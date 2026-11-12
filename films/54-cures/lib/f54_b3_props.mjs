// Film 54 · B3 (c10–c13) · own props: the rooms behind the kiosk glass (the study clinic, the reviewer's desk), the three small dioramas
// (clinic · trial office · parliament hall), the digital twin, the pen, the ticker line, the proof pin on the two-dates label, the small
// wall card (K7), the PROVEN plaque. Only B3 imports this. Kit wishes go in the report, never into lib/f54_kit.mjs.
// Local px everywhere (a room is drawn into the kiosk screen: 520 × 292.5; a small diorama: 400 × 250).
import * as E from './f10_editorial.mjs';
import * as F from './f54_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, halo, lin, rad, prng } = E;
const { MINT, COOL, LAMP, RELIC, INK, rise, maskLine, measure } = F;
const TAU = Math.PI * 2;

// a seated figure (side view): clipped at the seat, the chair drawn around it. (x = hip, seat = y of the seat, h = standing height)
export function seated(ctx, t, x, seat, h, o = {}) {
  const dir = o.dir ?? 1;
  ctx.save(); ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(x - dir * h * .2 - h * .03, seat - h * .36, h * .06, h * .36 + h * .3); ctx.restore();   // chair back
  ctx.save(); ctx.beginPath(); ctx.rect(x - h, seat - h * 1.4, h * 2, h * 1.4 + 1); ctx.clip();
  E.person(ctx, x, seat + h * .44, h, { view: 'side', dir, light: o.light ?? 1, back: o.back ?? .5, look: o.look ?? .1, lean: o.lean ?? 0, rim: o.rim, long: o.long, armR: o.armR, armL: o.armL });
  ctx.restore();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x - h * .22, seat - 2, h * .4, h * .045);   // seat + legs
  ctx.fillRect(x - h * .2, seat, h * .025, h * .3); ctx.fillRect(x + h * .14, seat, h * .025, h * .3);
  // the thigh and the shin in front of the seat (side view, sitting)
  ctx.strokeStyle = mixHex(P.night1, P.blue1, .35); ctx.lineCap = 'round'; ctx.lineWidth = h * .07;
  ctx.beginPath(); ctx.moveTo(x - dir * h * .02, seat - h * .03); ctx.lineTo(x + dir * h * .2, seat - h * .02); ctx.lineTo(x + dir * h * .22, seat + h * .26); ctx.stroke();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(x + dir * h * .25, seat + h * .27, h * .05, h * .02, 0, 0, TAU); ctx.fill();
}

// a digital twin: a figure of fine mint lines (a prediction, not a person): head, shoulders, body, legs, a few scan lines. (x, y) = feet.
export function twin(ctx, t, x, y, h, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const a = (o.a ?? 1) * rise(u), lw = Math.max(1, h * .012);
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= a;
  halo(ctx, 0, -h * .5, h * .55, .16, MINT.halo, MINT.body);
  ctx.strokeStyle = rgba(MINT.line, .85); ctx.lineWidth = lw; ctx.lineJoin = 'round';
  const grow = expoOut(u);   // the outline draws from the feet up
  ctx.save(); ctx.beginPath(); ctx.rect(-h, -h * 1.05 * grow, h * 2, h * 1.05 * grow + 2); ctx.clip();
  ctx.beginPath(); ctx.arc(0, -h * .885, h * .07, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-h * .05, -h * .8); ctx.quadraticCurveTo(-h * .13, -h * .79, -h * .13, -h * .7); ctx.lineTo(-h * .14, -h * .47); ctx.lineTo(-h * .07, -h * .47);
  ctx.lineTo(-h * .06, 0); ctx.moveTo(h * .06, 0); ctx.lineTo(h * .07, -h * .47); ctx.lineTo(h * .14, -h * .47); ctx.lineTo(h * .13, -h * .7); ctx.quadraticCurveTo(h * .13, -h * .79, h * .05, -h * .8); ctx.stroke();
  ctx.setLineDash([h * .02, h * .03]); ctx.lineWidth = lw * .7;
  for (let k = 0; k < 4; k++) { const yy = -h * (.72 - k * .14) + h * .01 * Math.sin(t * 1.3 + k); ctx.beginPath(); ctx.moveTo(-h * .12, yy); ctx.lineTo(h * .12, yy); ctx.stroke(); }
  ctx.restore(); ctx.restore();
}

// the pen (people's tool, cream): (x, y) = centre, s = length, rot
export function pen(ctx, x, y, s, rot = 0, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(s * .02, s * .07, s * .5, s * .035, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -s * .04, 0, s * .04, [[0, mixHex(P.cream, LAMP.body, .2)], [1, mixHex(LAMP.body, P.shade1, .5)]]);
  ctx.beginPath(); ctx.roundRect(-s * .42, -s * .035, s * .78, s * .07, s * .03); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.moveTo(s * .36, -s * .035); ctx.lineTo(s * .5, 0); ctx.lineTo(s * .36, s * .035); ctx.closePath(); ctx.fill();
  ctx.fillStyle = MINT.ink; ctx.beginPath(); ctx.arc(s * .49, 0, s * .008, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(-s * .3, -s * .055, s * .22, s * .02);   // the clip
  ctx.restore();
}

// the ticker line (investors price the first date): a thin cool band of small rising / falling marks that runs right. No price, no figure.
export function ticker(ctx, t, x0, x1, y, a) {
  if (a <= 0) return; const r = prng(5407), marks = []; for (let k = 0; k < 60; k++) marks.push([r(), r() > .45 ? 1 : -1, .5 + r() * .5]);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(x0, y - 20, x1 - x0, 40); ctx.clip();
  ctx.strokeStyle = rgba(COOL.line, .5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, y - 15); ctx.lineTo(x1, y - 15); ctx.moveTo(x0, y + 15); ctx.lineTo(x1, y + 15); ctx.stroke();
  const L = x1 - x0, off = t * 90;
  marks.forEach(([u, d, s]) => {
    const x = x0 + (((u * L * 1.4 + off) % (L * 1.4)) - L * .2), k = 7 * s;
    ctx.fillStyle = rgba(d > 0 ? COOL.body : P.blue1, .85); ctx.beginPath(); ctx.moveTo(x - k * .7, y + d * k * .45); ctx.lineTo(x + k * .7, y + d * k * .45); ctx.lineTo(x, y - d * k * .55); ctx.closePath(); ctx.fill();
  });
  // soft fade at both ends of the band
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = lin(ctx, x0, 0, x0 + 90, 0, [[0, 'rgba(0,0,0,1)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x0, y - 20, 90, 40);
  ctx.fillStyle = lin(ctx, x1 - 90, 0, x1, 0, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,1)']]); ctx.fillRect(x1 - 90, y - 20, 90, 40);
  ctx.restore();
}

// the proof pin on the wait track of a two-dates label: where PROVEN will land. near 0 = at the far end, 1 = at FOUND. r = twoDates' return
export function proofPin(ctx, t, r, near, s, a = 1) {
  if (!r || a <= 0) return null; const [x0, x1, y] = r.track, px = lerp(x1, x0 + (x1 - x0) * .18, clamp(near)), h = 30 * s;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(MINT.line, .9); ctx.lineWidth = Math.max(1, 2 * s); ctx.beginPath(); ctx.moveTo(px, y - h); ctx.lineTo(px, y + 8 * s); ctx.stroke();
  ctx.fillStyle = rgba(MINT.deep, .6); ctx.beginPath(); ctx.moveTo(px, y - h); ctx.lineTo(px - 22 * s, y - h + 8 * s); ctx.lineTo(px, y - h + 16 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = MINT.ink; ctx.lineWidth = Math.max(1, 1.6 * s); ctx.stroke();
  halo(ctx, px, y, 26 * s, .22 + .08 * Math.sin(t * 2.2), MINT.halo, MINT.body);
  ctx.restore();
  return px;
}

// a two-dates label with the proof pin (and the wait fill running up to it). o as F.twoDates + near, pinA
export function dates(ctx, t, x, y, s, o = {}) {
  const near = clamp(o.near ?? 0), x0 = x + 40 * s, x1 = x + (F.DATES.w - 40) * s, pinX = lerp(x1, x0 + (x1 - x0) * .18, near);
  const wait = o.wait != null ? o.wait * (pinX - x0) / (x1 - x0) : null;
  const r = F.twoDates(ctx, t, x, y, s, { ...o, wait });
  if (r && o.pinA !== 0 && o.wait != null) proofPin(ctx, t, r, near, s, (o.a ?? 1) * (o.pinA ?? 1));
  return r;
}

// a small wall card (a printed quote on the panel): x, y top-left, w; lines of serif; lit 0..1 per line; credit
export function wallCard(ctx, t, x, y, w, lines, lit, credit, o = {}) {
  const size = o.size ?? 30, lead = size * 1.22, h = lines.length * lead + size * 2.6;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, x + w / 2, y + h * .3, w * .8, .1 * (o.glow ?? 1), LAMP.body, LAMP.core);
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.night1, P.ind2, .7)], [1, mixHex(P.night0, P.ind2, .5)]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 1.5; ctx.stroke();
  lines.forEach((ln, i) => { const l = clamp(lit(i)); E.glowText(ctx, ln, x + 22, y + size * 1.3 + i * lead, { size, serif: true, glow: false, col: P.cream, a: .3 + .7 * l }); });
  const cu = rise(clamp(credit));
  if (cu > 0) { ctx.fillStyle = rgba(MINT.line, .7 * cu); ctx.fillRect(x + 22, y + h - size * .95, 40 * cu, 2); maskLine(ctx, [[o.credit ?? '', 0]], x + 22, y + h - size * .35, size * .5, cu, { serif: false, weight: 600, col: P.halo2, glow: false }); }
  ctx.restore();
  return { x, y, w, h };
}

// ============================================================================================================ THE STUDY CLINIC (kiosk glass)
// local 520 × 292.5. o { lit 0..1, laugh 0..1, hand 0..1 (your hand on their shoulder), tube 0..1 (the test finds traces: mint), card 0..1
// (FIRST TRACES rises), form 0..1 (the nurse hands the trial form), sign 0..1 (the signature draws), poster(ctx, x, y, w) }
export const CLINIC = { floor: 244, table: { x0: 236, x1: 352, y: 196 }, loved: { x: 168, seat: 208, h: 156 }, you: { x: 104, h: 156 }, nurse: { x: 408, h: 162 }, tube: { x: 330, y: 194 }, poster: { x: 196, y: 20, w: 64 } };
export function clinicRoom(ctx, t, w, h, o = {}) {
  const lit = clamp(o.lit ?? 1), C = CLINIC, Tb = C.table;
  const wallC = mixHex(mixHex(P.ind2, MINT.deep, .22), LAMP.deep, .18);
  ctx.fillStyle = lin(ctx, 0, 0, 0, C.floor, [[0, mixHex(wallC, P.night0, .45)], [.7, wallC], [1, mixHex(wallC, P.night1, .3)]]); ctx.fillRect(0, 0, w, C.floor);
  ctx.fillStyle = lin(ctx, 0, C.floor, 0, h, [[0, mixHex(P.night1, P.ind2, .55)], [1, P.night0]]); ctx.fillRect(0, C.floor, w, h - C.floor);
  ctx.fillStyle = rgba(MINT.line, .12); ctx.fillRect(0, C.floor, w, 1.2);
  // the ceiling lamp (practical light), a curtain rail and a pale curtain at the right
  halo(ctx, w * .55, 10, w * .5, .3 * lit, LAMP.body, LAMP.core);
  ctx.fillStyle = rgba(LAMP.core, .8 * lit); ctx.fillRect(w * .5, 4, w * .1, 3);
  ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(430, 26, 86, 2);
  for (let k = 0; k < 5; k++) { ctx.fillStyle = mixHex(mixHex(P.ind2, MINT.deep, .35), P.cream, .05 + .05 * (k % 2)); ctx.fillRect(440 + k * 15 + 2 * Math.sin(t * .4 + k), 28, 14, C.floor - 34); }
  // the poster on the back wall: the two-dates label (the carrier from the hall comes to rest here)
  if (o.poster) o.poster(ctx, C.poster.x, C.poster.y, C.poster.w);
  // the nurse (indigo, long coat, mint rim), facing left; holds out the trial form
  const fu = sineIO(clamp(o.form ?? 0)), sg = clamp(o.sign ?? 0), lg = clamp(o.laugh ?? 0);
  const talk = Math.sin(t * 1.3);
  E.person(ctx, C.nurse.x, C.floor, C.nurse.h, { view: 'side', dir: -1, long: true, light: 1, back: .3, rim: MINT.line, look: .08 + .05 * lg * Math.sin(t * 6) + .02 * talk, lean: .02 * talk,
    armR: [lerp(.25, 1.35, fu), lerp(.15, 1.6, fu)], armL: [-.15, -.1] });
  // the table, the blood tube, the FIRST TRACES card
  ctx.fillStyle = lin(ctx, 0, Tb.y, 0, Tb.y + 6, [[0, mixHex(P.night1, LAMP.body, .3 * lit)], [1, P.night1]]); ctx.fillRect(Tb.x0, Tb.y, Tb.x1 - Tb.x0, 6);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(Tb.x0 + 8, Tb.y + 6, 5, C.floor - Tb.y - 6); ctx.fillRect(Tb.x1 - 13, Tb.y + 6, 5, C.floor - Tb.y - 6);
  const cu = rise(clamp(o.card ?? 0));
  if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(Tb.x0, 0, Tb.x1 - Tb.x0, Tb.y); ctx.clip(); const cy = Tb.y - 26 + (1 - cu) * 30;
    ctx.fillStyle = mixHex(P.cream, '#e9e2c6', .5); ctx.beginPath(); ctx.roundRect(276, cy, 44, 26, 1.5); ctx.fill();
    E.glowText(ctx, 'FIRST', 298, cy + 11, { size: 6.4, weight: 600, spacing: .12, align: 'center', glow: false, col: MINT.deep });
    E.glowText(ctx, 'TRACES', 298, cy + 20, { size: 6.4, weight: 600, spacing: .12, align: 'center', glow: false, col: MINT.deep });
    ctx.restore(); }
  F.bloodTube(ctx, t, C.tube.x, C.tube.y, 30, { fill: .7, glow: clamp(o.tube ?? 0) });
  // the trial form: from the nurse's hand onto the table in front of them, propped up; the signature draws in mint
  if (fu > 0) {
    const fx = lerp(372, 250, fu), fy = lerp(150, 158, fu) - 8 * Math.sin(Math.PI * fu), fw = 30, fh = 38;
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(lerp(-.25, -.06, fu));
    ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(-fw / 2 - 1.5, -fh / 2 - 1.5, fw + 3, fh + 3);
    ctx.fillStyle = mixHex(P.cream, '#e3dcc0', .45); ctx.fillRect(-fw / 2, -fh / 2, fw, fh);
    ctx.fillStyle = rgba(P.night1, .45); for (let k = 0; k < 5; k++) ctx.fillRect(-fw / 2 + 4, -fh / 2 + 6 + k * 4.5, fw - (k % 2 ? 10 : 8), 1.2);
    ctx.fillStyle = rgba(P.night1, .6); ctx.fillRect(-fw / 2 + 4, fh / 2 - 6, fw - 8, .9);
    if (sg > 0) { const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([-fw / 2 + 5 + u * (fw - 10), fh / 2 - 8.5 - 2.4 * Math.sin(u * 19) * (1 - u * .4) - 1.2 * Math.sin(u * 7)]); } F.mintSpan(ctx, pts, 0, sg, { w: .7, spark: sg < 1 }); }
    ctx.restore();
  }
  // the loved one (around sixty, seated, facing the nurse): laughs, then signs
  const L = C.loved, laughB = lg * Math.max(0, Math.sin(t * 7.5)) ** 2;
  seated(ctx, t, L.x, L.seat, L.h, { dir: 1, look: .12 + .16 * laughB + .03 * Math.sin(t * .6), lean: -.05 * laughB + .02 * Math.sin(t * .5), rim: mixHex(LAMP.body, P.blue1, .4),
    armR: sg > 0 || fu > .7 ? [lerp(.4, 1.25, smooth(span(fu, .6, 1))), lerp(.3, 1.5, smooth(span(fu, .6, 1))) + .08 * Math.sin(t * 9) * (sg > 0 && sg < 1 ? 1 : 0)] : [.4, .3] });
  // you, standing beside them, a hand on their shoulder (the yellow coat)
  const hd = sineIO(clamp(o.hand ?? 1));
  E.du(ctx, C.you.x, C.floor, C.you.h, { view: 'side', dir: 1, look: .12 + .04 * Math.sin(t * .7), light: 1, back: .4, armR: [lerp(.2, .95, hd), lerp(.1, .8, hd)] });
  // light falloff and the dark the room rises from
  ctx.fillStyle = rad(ctx, w * .5, h * .4, w * .75, [[0, 'rgba(0,0,0,0)'], [1, rgba(P.night0, .45)]]); ctx.fillRect(0, 0, w, h);
  if (lit < 1) { ctx.fillStyle = rgba(P.night0, .94 * (1 - lit)); ctx.fillRect(0, 0, w, h); }
}

// ============================================================================================================ THE REVIEWER'S DESK (kiosk glass)
// local 520 × 292.5. o { lit, scan 0..1 (the assistant marks passages), stack 0..1 (0 = full, 1 = mostly done), months 0..1 }
export const DESK = { floor: 244, desk: { x0: 150, x1: 480, y: 194 }, rev: { x: 205, seat: 208, h: 158 }, mon: { x: 300, y: 104, w: 104, h: 70 }, stack: { x: 420, w: 46 } };
export function deskRoom(ctx, t, w, h, o = {}) {
  const lit = clamp(o.lit ?? 1), D = DESK, Dk = D.desk;
  const wallC = mixHex(P.ind2, P.blue0, .25);
  ctx.fillStyle = lin(ctx, 0, 0, 0, D.floor, [[0, mixHex(wallC, P.night0, .5)], [1, mixHex(wallC, P.night1, .2)]]); ctx.fillRect(0, 0, w, D.floor);
  ctx.fillStyle = lin(ctx, 0, D.floor, 0, h, [[0, mixHex(P.night1, P.ind2, .5)], [1, P.night0]]); ctx.fillRect(0, D.floor, w, h - D.floor);
  // a night window with blinds (left), a shelf of binders
  ctx.fillStyle = mixHex(P.ind0, P.blue0, .3); ctx.fillRect(26, 34, 108, 92);
  for (let k = 0; k < 8; k++) { ctx.fillStyle = rgba(mixHex(P.night1, COOL.body, .2), .85); ctx.fillRect(26, 36 + k * 11.4, 108, 5); }
  ctx.strokeStyle = rgba(P.night0, .85); ctx.lineWidth = 4; ctx.strokeRect(26, 34, 108, 92);
  ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(330, 60, 160, 3);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = mixHex(P.ind2, LAMP.body, .1 + .06 * (k % 3)); ctx.fillRect(336 + k * 16, 60 - (22 + 5 * (k % 2)), 12, 22 + 5 * (k % 2)); }
  // the desk lamp (cream)
  halo(ctx, 170, Dk.y - 34, w * .4, .32 * lit, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.fillRect(166, Dk.y - 34, 3, 34); ctx.beginPath(); ctx.ellipse(172, Dk.y - 36, 13, 5, -.25, 0, TAU); ctx.fill();
  // the assistant's window: a small cool screen; passages get marked in mint as a cool spark reads down the page
  const M = D.mon, sc = clamp(o.scan ?? 0);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.fillRect(M.x + M.w / 2 - 3, M.y + M.h, 6, Dk.y - M.y - M.h); ctx.fillRect(M.x + M.w / 2 - 16, Dk.y - 3, 32, 3);
  halo(ctx, M.x + M.w / 2, M.y + M.h / 2, M.w * 1.1, .28 * lit, COOL.halo, COOL.body);
  ctx.fillStyle = P.night0; ctx.fillRect(M.x - 3, M.y - 3, M.w + 6, M.h + 6);
  ctx.fillStyle = lin(ctx, 0, M.y, 0, M.y + M.h, [[0, mixHex(P.ind1, COOL.deep, .6)], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(M.x, M.y, M.w, M.h);
  const NL = 9, hi = [1, 3, 4, 7];
  for (let k = 0; k < NL; k++) {
    const ly = M.y + 8 + k * 6.6, lw = M.w - 18 - (k * 13 % 22);
    ctx.fillStyle = rgba(P.cream, .3); ctx.fillRect(M.x + 9, ly, lw, 1.6);
    if (hi.includes(k)) { const m = smooth(span(sc * NL, k + .2, k + .9)); if (m > 0) { ctx.fillStyle = rgba(MINT.ink, .55); ctx.fillRect(M.x + 8, ly - 1.6, lw * m + 2, 4.6); } }
  }
  if (sc > 0 && sc < 1) { const k = sc * NL, ly = M.y + 8 + Math.min(NL - 1, Math.floor(k)) * 6.6, lx = M.x + 9 + (k % 1) * (M.w - 22); F.spark(ctx, t, lx, ly, 1.3, { dir: [-6, 0] }); }
  // the file stack: pages leave it one by one (into the reviewer's done tray at the left)
  const St = D.stack, n0 = 12, done = clamp(o.stack ?? 0) * 8, nd = Math.floor(done), f = done - nd, n = n0 - nd;
  for (let k = 0; k < n; k++) { const yy = Dk.y - 2 - k * 2.6; ctx.fillStyle = mixHex(P.cream, '#ddd5b8', (k % 3) * .2); ctx.fillRect(St.x + (k % 2) * 1.2, yy - 1.8, St.w, 1.8); ctx.fillStyle = rgba(P.night1, .35); ctx.fillRect(St.x + (k % 2) * 1.2, yy, St.w, .8); }
  if (f > 0 && n > 0) { const e = sineIO(f), px = lerp(St.x, 108, e), py = lerp(Dk.y - 2 - n * 2.6, Dk.y - 3 - nd * 1.4, e) - 26 * Math.sin(Math.PI * e);
    ctx.save(); ctx.translate(px + St.w / 2, py); ctx.rotate(-.3 * Math.sin(Math.PI * e)); ctx.fillStyle = mixHex(P.cream, '#e3dcc0', .3); ctx.fillRect(-St.w / 2, -1.8, St.w, 3); ctx.restore(); }
  for (let k = 0; k < nd; k++) { ctx.fillStyle = mixHex(P.cream, '#ddd5b8', .3 + (k % 2) * .2); ctx.fillRect(88 + (k % 2), Dk.y - 3 - k * 1.4, 40, 1.4); }
  // the desk, the reviewer (seated, facing the screen)
  ctx.fillStyle = lin(ctx, 0, Dk.y, 0, Dk.y + 7, [[0, mixHex(P.night1, LAMP.body, .3 * lit)], [1, P.night1]]); ctx.fillRect(Dk.x0 - 70, Dk.y, Dk.x1 - Dk.x0 + 70, 7);
  ctx.fillStyle = lin(ctx, 0, Dk.y + 7, 0, D.floor, [[0, mixHex(P.night1, P.ind2, .5)], [1, P.night0]]); ctx.fillRect(Dk.x0 + 30, Dk.y + 7, Dk.x1 - Dk.x0 - 30, D.floor - Dk.y - 7);
  const R = D.rev, read = Math.sin(t * .8);
  seated(ctx, t, R.x, R.seat, R.h, { dir: 1, look: .05 + .03 * read, lean: .06 + .015 * read, rim: COOL.line, armR: [1.35 + .04 * read, 1.75], armL: [1.15, 1.6], long: true });
  ctx.fillStyle = rad(ctx, w * .5, h * .4, w * .75, [[0, 'rgba(0,0,0,0)'], [1, rgba(P.night0, .45)]]); ctx.fillRect(0, 0, w, h);
  if (lit < 1) { ctx.fillStyle = rgba(P.night0, .94 * (1 - lit)); ctx.fillRect(0, 0, w, h); }
}

// ============================================================================================================ THREE SMALL DIORAMAS (7.12)
// local 400 × 250; the person who steps in is drawn by the caller. k 0 clinic · 1 trial office (twins) · 2 parliament hall
export function miniRoom(ctx, t, k, w, h) {
  const fl = h * .84;
  const wall = k === 0 ? mixHex(mixHex(P.ind2, MINT.deep, .22), LAMP.deep, .18) : k === 1 ? mixHex(P.ind2, P.blue0, .2) : mixHex(P.ind2, LAMP.deep, .28);
  ctx.fillStyle = lin(ctx, 0, 0, 0, fl, [[0, mixHex(wall, P.night0, .45)], [1, wall]]); ctx.fillRect(0, 0, w, fl);
  ctx.fillStyle = lin(ctx, 0, fl, 0, h, [[0, mixHex(P.night1, P.ind2, .5)], [1, P.night0]]); ctx.fillRect(0, fl, w, h - fl);
  halo(ctx, w * .5, 6, w * .45, .26, LAMP.body, LAMP.core);
  if (k === 0) {        // the study clinic: a table, the mint blood tube, a seated patient
    ctx.fillStyle = mixHex(P.night1, LAMP.body, .25); ctx.fillRect(200, 152, 110, 5); ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(210, 157, 4, fl - 157); ctx.fillRect(296, 157, 4, fl - 157);
    F.bloodTube(ctx, t, 280, 151, 34, { fill: .7, glow: .9 + .1 * Math.sin(t * 1.4) });
    seated(ctx, t, 160, 168, 130, { dir: 1, look: .1 + .03 * Math.sin(t * .7), rim: mixHex(LAMP.body, P.blue1, .4) });
  } else if (k === 1) { // the trial office: a short row, a twin beside two of them (a leaner trial)
    for (let i = 0; i < 3; i++) { const x = 70 + i * 62; seated(ctx, t, x, 170, 108, { dir: 1, look: .06 + .03 * Math.sin(t * .6 + i), rim: P.blue1 }); }
    twin(ctx, t, 248, fl, 104, 1); twin(ctx, t, 290, fl, 104, 1, { a: .8 });
    ctx.fillStyle = rgba(P.cream, .25); ctx.fillRect(60, 40, 120, 66); ctx.fillStyle = rgba(MINT.ink, .5); ctx.fillRect(70, 86, 90, 3); ctx.fillStyle = rgba(P.blue1, .8); ctx.fillRect(70, 74, 60, 3);
  } else {              // the parliament hall: tiers of benches in a half circle, small heads, a speaker's desk in front
    for (let r = 0; r < 4; r++) { const ry = 70 + r * 26, rx = 150 + r * 16;
      ctx.strokeStyle = mixHex(P.night0, P.ind2, .6); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(w / 2, ry - 40, rx, 52, 0, .12 * Math.PI, .88 * Math.PI); ctx.stroke();
      const rr = prng(31 + r); for (let i = 0; i < 9 + r * 2; i++) { const aa = (.15 + .7 * (i + .5) / (9 + r * 2)) * Math.PI, hx = w / 2 + Math.cos(aa) * rx, hy = ry - 40 + Math.sin(aa) * 52 - 9;
        if (rr() > .2) { ctx.fillStyle = mixHex(P.night1, P.blue1, .35 + .2 * rr()); ctx.beginPath(); ctx.arc(hx, hy + .8 * Math.sin(t * .9 + i + r), 4.2, 0, TAU); ctx.fill(); } } }
    ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.beginPath(); ctx.moveTo(w / 2 + 40, fl); ctx.lineTo(w / 2 + 46, 150); ctx.lineTo(w / 2 + 104, 150); ctx.lineTo(w / 2 + 110, fl); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(MINT.line, .45); ctx.fillRect(w / 2 + 46, 150, 58, 2);
  }
  ctx.fillStyle = rad(ctx, w * .5, h * .4, w * .75, [[0, 'rgba(0,0,0,0)'], [1, rgba(P.night0, .4)]]); ctx.fillRect(0, 0, w, h);
}
