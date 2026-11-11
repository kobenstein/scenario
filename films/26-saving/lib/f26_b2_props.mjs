// Film 26 · B2 (c05–c07) · props for line 3 and line 4 (owned by builder B2; the kit stays untouched).
// Flat editorial shapes in the night palette, drawn in F0 design px unless said otherwise. Money = gold, the machine = cool,
// people = indigo, you = the yellow coat. Nothing here caches canvases or patterns per frame.
//   capitol(ctx, t, x, y, s, o)            the dome (Congress), feet centre (x, y), scale s (≈ 1 → 520 px wide)
//   bill(ctx, x, y, w, rot, o)             a paper bill (cream paper, gold oval)        page(ctx, x, y, w, rot, o) a loose sheet
//   card(ctx, x, y, w, h, lines, u, o)     a small dark paper card, serif or caps lines rise in (u 0..1)
//   signpost(ctx, t, x, y, h, o)           a street signpost with two arms (PRINT IT / TAX & SHARE), o.lit [a, b]
//   press(ctx, t, x, y, s, run)            a printing press (two rollers) · houseIcon · bed · hands · factory · chest
//   van(ctx, t, x, y, s, o)                the cream mail van GOVERNMENT · car(ctx, t, x, y, s, o) a car (o.robo: no driver, cool sensor)
//   avLamp(ctx, t, x, y, h, o)             an avenue lamp with a hanging year plaque
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, span, expoOut, halo, lin, rad, prng } = E;
const TAU = Math.PI * 2;
const DARK = mixHex(P.night0, P.night1, .5);

// ------------------------------------------------------------------------------------------------ Congress
export function capitol(ctx, t, x, y, s = 1, o = {}) {
  const lit = o.lit ?? 1, body = mixHex(P.ind1, P.blue1, .3), bodyLit = mixHex(P.blue0, P.halo2, .18), dk = mixHex(P.night1, P.ind1, .4);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // steps (wide, three tiers)
  for (let i = 0; i < 4; i++) { ctx.fillStyle = mixHex(dk, P.blue1, .12 * i); ctx.fillRect(-150 + i * 14, -12 * (i + 1), 300 - i * 28, 12); }
  // wings
  const wing = (x0, w) => { ctx.fillStyle = lin(ctx, x0, -150, x0 + w, 0, [[0, mixHex(body, bodyLit, .4)], [1, body]]); ctx.fillRect(x0, -150, w, 150);
    ctx.fillStyle = dk; ctx.fillRect(x0 - 6, -160, w + 12, 12);
    for (let k = 0; k < 6; k++) { const cx = x0 + 14 + k * (w - 28) / 5; ctx.fillStyle = mixHex(bodyLit, P.cream, .15); ctx.fillRect(cx - 3, -140, 6, 110); }
    for (let k = 0; k < 5; k++) { const wx = x0 + 22 + k * (w - 44) / 4; ctx.fillStyle = rgba(mixHex(P.halo1, P.core1, .3), lit * (.35 + .25 * ((k * 7 + Math.round(x0)) % 3 === 0))); ctx.fillRect(wx - 5, -112, 10, 18); } };
  wing(-260, 170); wing(90, 170);
  // centre block + portico
  ctx.fillStyle = lin(ctx, -90, -210, 90, 0, [[0, bodyLit], [1, body]]); ctx.fillRect(-90, -200, 180, 200);
  ctx.fillStyle = dk; ctx.beginPath(); ctx.moveTo(-100, -200); ctx.lineTo(0, -238); ctx.lineTo(100, -200); ctx.closePath(); ctx.fill();
  for (let k = 0; k < 8; k++) { const cx = -78 + k * 22.3; ctx.fillStyle = mixHex(bodyLit, P.cream, .25); ctx.fillRect(cx - 3.5, -192, 7, 168); }
  // drum + dome + lantern
  ctx.fillStyle = mixHex(body, bodyLit, .5); ctx.fillRect(-72, -300, 144, 64);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = rgba(P.cream, .35); ctx.fillRect(-64 + k * 16, -292, 4, 50); }
  ctx.fillStyle = lin(ctx, -80, -420, 80, -300, [[0, mixHex(bodyLit, P.cream, .25)], [.55, body], [1, dk]]);
  ctx.beginPath(); ctx.ellipse(0, -300, 82, 118, 0, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .25); ctx.lineWidth = 2; for (const k of [-.55, 0, .55]) { ctx.beginPath(); ctx.ellipse(0, -300, 82 * Math.abs(k) + 1, 118, 0, Math.PI * (k < 0 ? 1 : 1.5), Math.PI * (k < 0 ? 1.5 : 2)); ctx.stroke(); }
  ctx.fillStyle = dk; ctx.fillRect(-12, -446, 24, 30); ctx.beginPath(); ctx.ellipse(0, -446, 13, 16, 0, Math.PI, TAU); ctx.fill();
  ctx.fillRect(-2, -488, 4, 30);
  ctx.restore();
  if (lit > 0) halo(ctx, x, y - 300 * s, 260 * s, .16 * lit, P.blue0, P.halo2);
}

// ------------------------------------------------------------------------------------------------ paper
export function bill(ctx, x, y, w, rot = 0, o = {}) {
  const h = w * .45; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(o.flip ?? 1, 1);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.cream, P.halo2, .3)], [1, mixHex(P.halo1, P.shade0, .35)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = Math.max(1, w * .03); ctx.strokeRect(-w * .44, -h * .38, w * .88, h * .76);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .4); ctx.beginPath(); ctx.ellipse(0, 0, w * .14, h * .3, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
export function page(ctx, x, y, w, rot = 0, o = {}) {
  const h = w * (o.ratio ?? 1.3); ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(o.flip ?? 1, 1);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, P.cream], [1, mixHex(P.cream, P.halo1, .4)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  if (o.cal) { ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.fillRect(-w / 2, -h / 2, w, h * .14); }
  ctx.fillStyle = rgba(P.night1, .3); for (let i = 0; i < (o.lines ?? 4); i++) ctx.fillRect(-w * .36, -h * .22 + i * h * .14, w * (i % 2 ? .5 : .72), Math.max(1, h * .03));
  ctx.restore();
}
// a small dark paper card (as the quote cards): lines = [[text, { serif, size, col }]…], u 0..1 grows it (rule, then the lines rise)
export function card(ctx, x, y, w, h, lines, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const k = expoOut(span(u, 0, .45)), hh = h * k;
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x + 8, y + 10, w, hh);
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, mixHex(P.ind0, P.blue1, .25)], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(x, y, w, hh);
  ctx.fillStyle = o.rule ?? P.halo0; ctx.fillRect(x, y, w * expoOut(span(u, 0, .6)), 3);
  const n = lines.length, step = o.step ?? 1.15;
  lines.forEach(([s, lo = {}], i) => {
    const size = lo.size ?? 34, serif = lo.serif ?? true, yy = y + h / 2 + size * .36 + (i - (n - 1) / 2) * size * step + (lo.dy ?? 0);
    F.maskLine(ctx, [[s, lo.warm ?? 0]], x + w / 2, yy, size, F.rise(span(u, .3 + i * .1, .85 + i * .1)), { align: 'center', serif, weight: 600, col: lo.col ?? P.cream, glow: lo.glow ?? serif });
  });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ street furniture
export function signpost(ctx, t, x, y, h, o = {}) {
  const [la, lb] = o.lit ?? [0, 0], arms = o.arms ?? ['PRINT IT', 'TAX & SHARE'];
  ctx.fillStyle = DARK; ctx.fillRect(x - 6, y - h, 12, h);
  ctx.beginPath(); ctx.arc(x, y - h, 9, 0, TAU); ctx.fill();
  const arm = (dir, yy, text, a, rot) => {
    const w = 300, hh = 58; ctx.save(); ctx.translate(x, yy); ctx.rotate(rot);
    const x0 = dir > 0 ? 8 : -w - 8; const p = new Path2D();
    if (dir > 0) { p.moveTo(x0, -hh / 2); p.lineTo(x0 + w - 26, -hh / 2); p.lineTo(x0 + w, 0); p.lineTo(x0 + w - 26, hh / 2); p.lineTo(x0, hh / 2); }
    else { p.moveTo(x0 + w, -hh / 2); p.lineTo(x0 + 26, -hh / 2); p.lineTo(x0, 0); p.lineTo(x0 + 26, hh / 2); p.lineTo(x0 + w, hh / 2); }
    p.closePath();
    ctx.fillStyle = lin(ctx, 0, -hh / 2, 0, hh / 2, [[0, mixHex(P.ind1, P.blue1, .5)], [1, mixHex(P.night1, P.ind1, .6)]]); ctx.fill(p);
    if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = lin(ctx, 0, -hh / 2, 0, hh / 2, [[0, mixHex(P.core1, P.halo0, .3)], [1, P.halo0]]); ctx.fill(p); ctx.restore(); }
    ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.stroke(p);
    E.glowText(ctx, text, x0 + w / 2 + (dir > 0 ? -10 : 10), 10, { size: 27, align: 'center', col: a > .5 ? P.night1 : P.cream, glow: false, spacing: .06 });
    ctx.restore();
    if (a > 0) halo(ctx, x + dir * (w / 2 + 8), yy, 220, .35 * a);
  };
  arm(-1, y - h + 40, arms[0], la, .03 * Math.sin(t * .7));
  arm(1, y - h + 120, arms[1], lb, -.02 + .02 * Math.sin(t * .6 + 1));
}
// an avenue lamp with a year plaque hanging from its arm. o { year (string), a (lamp light), gold 0..1 (the plaque turns gold),
//   plaque 0..1 (shown), page 0..1 (a calendar page tears off and flies: draws the page in flight) } → [plaque cx, cy]
export function avLamp(ctx, t, x, y, h, o = {}) {
  const hx = x + h * .17, hy = y - h * .97, a = o.a ?? 1, g = clamp(o.gold ?? 0);
  ctx.fillStyle = DARK; ctx.fillRect(x - h * .013, y - h, h * .026, h);
  ctx.strokeStyle = DARK; ctx.lineWidth = h * .018; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x, y - h * 1.03, hx, hy - h * .02); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.night1, .3); ctx.beginPath(); ctx.moveTo(hx - h * .06, hy); ctx.lineTo(hx + h * .06, hy); ctx.lineTo(hx + h * .03, hy - h * .04); ctx.lineTo(hx - h * .03, hy - h * .04); ctx.closePath(); ctx.fill();
  const lc = g > 0 ? mixHex(P.core1, P.core0, g) : P.core1;
  if (a > 0) { ctx.fillStyle = rgba(lc, a); ctx.beginPath(); ctx.ellipse(hx, hy + h * .004, h * .045, h * .013, 0, 0, TAU); ctx.fill(); halo(ctx, hx, hy + h * .03, h * (.42 + .25 * g), (.42 + .3 * g) * a * (1 + .02 * Math.sin(t * 3 + x))); }
  // the plaque: hangs on two short chains below the arm, swings a little
  const pu = clamp(o.plaque ?? 1); let pc = [x - h * .04, y - h * .62];
  if (pu > 0 && o.year) {
    const pw = h * .34, ph = h * .21, sw = .03 * Math.sin(t * 1.1 + x * .013);
    ctx.save(); ctx.translate(x, y - h * .74); ctx.rotate(sw);
    ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-pw * .3, 0); ctx.lineTo(-pw * .3, h * .03); ctx.moveTo(pw * .3, 0); ctx.lineTo(pw * .3, h * .03); ctx.stroke();
    const k = expoOut(pu); ctx.translate(0, h * .03); ctx.scale(1, k);
    ctx.fillStyle = lin(ctx, 0, 0, 0, ph, g > 0 ? [[0, mixHex(P.cream, P.core1, g)], [1, mixHex(mixHex(P.cream, P.halo1, .4), P.halo0, g)]] : [[0, P.cream], [1, mixHex(P.cream, P.halo1, .4)]]);
    ctx.fillRect(-pw / 2, 0, pw, ph);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .3 - .2 * g); ctx.fillRect(-pw / 2, 0, pw, ph * .16);
    ctx.fillStyle = P.night1; ctx.textAlign = 'center'; ctx.font = `${ph * .62}px "Instrument Serif"`; ctx.fillText(o.year, 0, ph * .8);
    ctx.restore(); pc = [x, y - h * .74 + h * .03 + ph / 2];
    if (g > 0) halo(ctx, pc[0], pc[1], h * .5, .35 * g);
  }
  return pc;
}

// ------------------------------------------------------------------------------------------------ explainer things
export function press(ctx, t, x, y, s, run = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.fillRect(-120, -40, 240, 40); ctx.fillRect(-110, -170, 22, 140); ctx.fillRect(88, -170, 22, 140);
  ctx.fillRect(-120, -186, 240, 20);
  for (const [cy, ph] of [[-128, 0], [-78, 1.6]]) {
    ctx.fillStyle = lin(ctx, 0, cy - 24, 0, cy + 24, [[0, mixHex(P.blue0, P.halo2, .3)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(-88, cy - 24, 176, 48);
    ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 3; for (let k = 0; k < 5; k++) { const yy = cy - 22 + (((t * 3 * run + ph + k * .2) % 1 + 1) % 1) * 44; ctx.beginPath(); ctx.moveTo(-86, yy); ctx.lineTo(86, yy); ctx.stroke(); }
  }
  ctx.restore();
  if (run > 0) halo(ctx, x, y - 100 * s, 200 * s, .3 * run);
}
export function houseIcon(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = lin(ctx, -60, -120, 60, 0, [[0, mixHex(P.blue0, P.ind1, .4)], [1, P.ind1]]);
  ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-60, -70); ctx.lineTo(0, -122); ctx.lineTo(60, -70); ctx.lineTo(60, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.fillRect(-14, -44, 28, 44);
  ctx.fillStyle = rgba(mixHex(P.core1, P.halo0, .3), .95); ctx.fillRect(22, -58, 22, 20); ctx.fillRect(-44, -58, 22, 20);
  ctx.restore(); halo(ctx, x + 33 * s, y - 48 * s, 60 * s, .3);
}
export function bed(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = DARK; ctx.fillRect(-80, -12, 6, 12); ctx.fillRect(74, -12, 6, 12);
  ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.fillRect(-84, -46, 168, 36);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(-92, -96, 12, 86); ctx.fillRect(80, -70, 10, 60);
  ctx.fillStyle = lin(ctx, 0, -66, 0, -40, [[0, P.cream], [1, mixHex(P.cream, P.halo1, .5)]]); ctx.fillRect(-78, -64, 156, 22);
  ctx.fillStyle = P.cream; ctx.beginPath(); ctx.ellipse(-56, -70, 22, 10, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
// a pair of hands (open, palms up a little): centre (x, y), size s, col
export function hands(ctx, x, y, s, o = {}) {
  const col = o.col ?? mixHex(P.shade0, P.halo1, .35), hold = o.hold;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const d of [-1, 1]) {
    ctx.save(); ctx.scale(d, 1); ctx.translate(18, 0); ctx.rotate(-.25);
    ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.beginPath(); ctx.roundRect(30, -12, 70, 26, 10); ctx.fill();          // sleeve
    ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-6, -14, 42, 30, 12); ctx.fill();                                  // palm
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.roundRect(-38, -14 + k * 7.4, 38, 6.6, 3.3); ctx.fill(); }          // fingers
    ctx.beginPath(); ctx.roundRect(-6, -26, 24, 9, 4.5); ctx.fill();                                                    // thumb
    ctx.restore();
  }
  if (hold) { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(-13, -40); ctx.lineTo(13, -40); ctx.lineTo(10, -14); ctx.lineTo(-10, -14); ctx.closePath(); ctx.fill(); }   // a cup of tea
  ctx.restore();
}
export function factory(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const col = mixHex(P.night1, P.ind1, .5);
  ctx.fillStyle = col; ctx.fillRect(110, -230, 34, 230);
  ctx.beginPath(); ctx.moveTo(-160, 0); ctx.lineTo(-160, -90);
  for (let k = 0; k < 4; k++) { ctx.lineTo(-160 + k * 70, -150); ctx.lineTo(-160 + k * 70 + 70, -90); }
  ctx.lineTo(160, -90); ctx.lineTo(160, 0); ctx.closePath(); ctx.fill();
  for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(F.COOL.body, .55 + .15 * Math.sin(t * 1.3 + k)); ctx.fillRect(-140 + k * 48, -66, 26, 30); }
  ctx.restore();
  halo(ctx, x, y - 60 * s, 180 * s, .25 * (o.a ?? 1), F.COOL.halo, F.COOL.core);
}
export function chest(ctx, t, x, y, s, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (open > 0) halo(ctx, 0, -70, 150, .55 * open);
  ctx.fillStyle = lin(ctx, 0, -70, 0, 0, [[0, mixHex(P.shade0, P.halo1, .2)], [1, mixHex(P.shade0, P.night1, .45)]]); ctx.fillRect(-70, -64, 140, 64);
  ctx.fillStyle = mixHex(P.halo0, P.shade0, .3); ctx.fillRect(-70, -40, 140, 6); ctx.fillRect(-8, -48, 16, 18);
  ctx.save(); ctx.translate(-70, -64); ctx.rotate(-open * 1.1);
  ctx.fillStyle = mixHex(P.shade0, P.halo1, .3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(140, 0); ctx.lineTo(140, -16); ctx.quadraticCurveTo(70, -48, 0, -16); ctx.closePath(); ctx.fill();
  ctx.restore(); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ vehicles
export function van(ctx, t, x, y, s, o = {}) {   // (x, y) = bottom centre, s ≈ 1 → 300 px long, faces right
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, 4, 160, 10, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -150, 0, -20, [[0, P.cream], [1, mixHex(P.cream, P.halo1, .5)]]);
  ctx.beginPath(); ctx.moveTo(-150, -22); ctx.lineTo(-150, -150); ctx.lineTo(70, -150); ctx.lineTo(70, -22); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(70, -22); ctx.lineTo(70, -112); ctx.lineTo(118, -112); ctx.lineTo(150, -66); ctx.lineTo(150, -22); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.blue1, .3); ctx.beginPath(); ctx.moveTo(80, -102); ctx.lineTo(114, -102); ctx.lineTo(138, -68); ctx.lineTo(80, -68); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.shade0, P.night1, .2); ctx.fillRect(-150, -48, 300, 6);
  E.glowText(ctx, o.label ?? 'GOVERNMENT', -40, -84, { size: 24, align: 'center', col: P.night1, glow: false, spacing: .08 });
  if (o.slot) { ctx.fillStyle = P.night0; ctx.fillRect(-90, -152, 100, 6); }
  for (const wx of [-96, 96]) { ctx.save(); ctx.translate(wx, -20); ctx.rotate(o.roll ?? 0); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.fillRect(-12, -2, 24, 4); ctx.restore(); }
  ctx.fillStyle = rgba(P.core1, .9); ctx.beginPath(); ctx.ellipse(148, -46, 5, 8, 0, 0, TAU); ctx.fill();
  ctx.restore(); halo(ctx, x + 152 * s, y - 46 * s, 60 * s, .4);
}
export function car(ctx, t, x, y, s, o = {}) {   // a flat sedan, faces right (o.dir -1 left). o.robo: no driver, a cool sensor on the roof
  const d = o.dir ?? 1, col = o.col ?? (o.robo ? mixHex(P.cream, F.COOL.body, .55) : mixHex(P.ind1, P.blue1, .5));
  ctx.save(); ctx.translate(x, y); ctx.scale(s * d, s);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, 3, 130, 8, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -90, 0, -14, [[0, mixHex(col, P.cream, .2)], [1, mixHex(col, P.night1, .35)]]);
  ctx.beginPath(); ctx.moveTo(-125, -18); ctx.lineTo(-122, -52); ctx.lineTo(-62, -60); ctx.lineTo(-30, -96); ctx.lineTo(48, -96); ctx.lineTo(82, -60); ctx.lineTo(122, -52); ctx.lineTo(126, -18); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.moveTo(-50, -62); ctx.lineTo(-24, -88); ctx.lineTo(8, -88); ctx.lineTo(8, -62); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(16, -62); ctx.lineTo(16, -88); ctx.lineTo(44, -88); ctx.lineTo(68, -62); ctx.closePath(); ctx.fill();
  if (!o.robo && o.driver !== false) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(30, -76, 9, 11, 0, 0, TAU); ctx.fill(); }
  if (o.robo) { ctx.fillStyle = F.COOL.core; ctx.beginPath(); ctx.roundRect(-12, -106, 26, 10, 4); ctx.fill(); }
  for (const wx of [-76, 76]) { ctx.save(); ctx.translate(wx, -16); ctx.rotate(o.roll ?? 0); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.fillRect(-10, -2, 20, 4); ctx.restore(); }
  ctx.fillStyle = rgba(o.robo ? F.COOL.core : P.core1, .95); ctx.beginPath(); ctx.ellipse(122, -38, 4, 7, 0, 0, TAU); ctx.fill();
  ctx.restore();
  if (o.robo) halo(ctx, x, y - 102 * s, 70 * s, .4, F.COOL.halo, F.COOL.core);
  halo(ctx, x + 124 * s * d, y - 38 * s, 50 * s, .35, o.robo ? F.COOL.halo : P.halo0, o.robo ? F.COOL.core : P.core0);
}
// paper confetti (seeded): n bits bursting from (x, y) at t0, falling
export function confetti(ctx, t, t0, x, y, o = {}) {
  const u = t - t0; if (u < 0 || u > (o.life ?? 3.5)) return;
  const r = prng(o.seed ?? 3), n = o.n ?? 60;
  for (let i = 0; i < n; i++) {
    const vx = (r() - .5) * 520, vy = -260 - r() * 380, sp = r() * 8, w = 8 + r() * 8, gold = r() < .45;
    const px = x + vx * u * (1 - u * .12), py = y + vy * u + 260 * u * u;
    ctx.save(); ctx.globalAlpha *= clamp(1.6 - u * .45); ctx.translate(px, py); ctx.rotate(sp * u + i); ctx.scale(Math.cos(sp * u * 1.7 + i), 1);
    ctx.fillStyle = gold ? P.halo0 : P.cream; ctx.fillRect(-w / 2, -w * .3, w, w * .6); ctx.restore();
  }
}
