// Film 13 · B1 (c02–c05) · motifs this package needs that the kit does not have (kit wishes are listed in the B1 report).
// Same rules as the kit: flat shapes + gradients + cached stipple; no canvas / pattern per frame (one scratch canvas at load for
// measuring italic type); seeded randomness only. Imported by lib/b1_take.mjs and the chunk worlds lib/b1_c0N.mjs.
//   seatedWoman(ctx, …)   an 1840s woman seated behind a table, frontal, faceless (indigo, warm rim from the candle): body + arms passes
//   candle(ctx, …)        a candle in a holder (the hero light of the parsonage), returns the flame point
//   scribble(…)           unreadable cursive ink lines (cached point runs), drawn up to a share u
//   handLine(ctx, …)      one legible handwritten line (Instrument Serif Italic) revealed left → right; returns the nib point
//   ledger(ctx, …)        Emily's small account book (open, ruled, a column of figures written in)
//   bookCover(ctx, …)     a cloth book cover with a gold-stamped title (Jane Eyre, Wuthering Heights, Mackay)
//   savingsHand(ctx, …)   a raised hand (indigo sleeve, its own cuff) that holds a sheet
//   label(ctx, …)         line + one or two label lines rising from their baseline (K.maskLine), pinned to a point
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, lin, rad, halo, dust, prng } = E;
const { COL } = B;
export const rise = (x) => 1 - (1 - clamp(x)) ** 3;

// ---------------------------------------------------------------------------------------------------------- seated woman
// (x, y) = the point where the body meets the table's far edge (the table hides everything below), h = table edge → top of head.
// o: { pass 'body' | 'arms', lean 0..1 (sits back, hands fold), light (screen side of the candle: −1 left, +1 right), seed,
//      write 0..1 (the hand on the book moves), handTo [x, y] (where the near hand rests, screen), rim 0..1, look (head turn −1..1) }
const BODY = '#141c45', BODY2 = '#0b1233', HAIR = '#0d1338';
export function seatedWoman(ctx, x, y, h, t, o = {}) {
  const sd = o.seed ?? 1, br = .5 + .5 * Math.sin(t * 1.25 + sd * 1.7), L = o.light ?? 1, lean = clamp(o.lean ?? 0), rim = o.rim ?? 1;
  const up = -.006 * br - .035 * lean;                                   // breathing lifts the shoulders; leaning back lifts the torso
  const hx = .012 * Math.sin(t * .31 + sd) + .02 * (o.look ?? 0) - .01 * lean, hy = -.79 + up - .02 * lean;
  ctx.save(); ctx.translate(x, y); ctx.scale(h, h);
  const rimCol = mixHex(P.halo1, P.core1, .3);
  if ((o.pass ?? 'body') === 'body') {
    // torso: waist at the table edge, bodice, sloping 1840s shoulders, high neck
    const tp = new Path2D();
    tp.moveTo(-.15, .05); tp.bezierCurveTo(-.15, -.12, -.17, -.28, -.19, -.4); tp.bezierCurveTo(-.21, -.47, -.23, -.5 + up, -.2, -.53 + up);
    tp.bezierCurveTo(-.15, -.58 + up, -.08, -.6 + up, -.04, -.63 + up); tp.lineTo(-.035, -.69 + up); tp.lineTo(.035, -.69 + up); tp.lineTo(.04, -.63 + up);
    tp.bezierCurveTo(.08, -.6 + up, .15, -.58 + up, .2, -.53 + up); tp.bezierCurveTo(.23, -.5 + up, .21, -.47, .19, -.4);
    tp.bezierCurveTo(.17, -.28, .15, -.12, .15, .05); tp.closePath();
    // upper arms (sleeves) hang from the shoulders to the elbows on the table (or fold in)
    const elb = (sd2) => [sd2 * lerp(.25, .17, lean), lerp(.0, -.17, lean)];
    const sl = new Path2D();
    for (const s of [-1, 1]) { const e = elb(s); sl.moveTo(s * .17, -.54 + up); sl.bezierCurveTo(s * .25, -.5 + up, s * .27, -.3, e[0] + s * .035, e[1]); sl.lineTo(e[0] - s * .04, e[1] + .01); sl.bezierCurveTo(s * .2, -.25, s * .17, -.4, s * .13, -.5 + up); sl.closePath(); }
    ctx.fillStyle = rgba(rimCol, .75 * rim); ctx.fill(tp); ctx.fill(sl);
    ctx.save(); ctx.translate(-L * .012, .004);
    ctx.fillStyle = lin(ctx, -.25 * L, 0, .25 * L, 0, [[0, BODY2], [.55, BODY], [1, mixHex(BODY, P.blue1, .35)]]); ctx.fill(tp); ctx.fill(sl);
    ctx.restore();
    // a small pale collar
    ctx.fillStyle = mixHex(COL.paper2, BODY, .55); ctx.beginPath(); ctx.ellipse(-.03, -.62 + up, .04, .022, .3, 0, 6.29); ctx.ellipse(.03, -.62 + up, .04, .022, -.3, 0, 6.29); ctx.fill();
    // head: smooth centre-parted hair with side loops over the ears (no face, ever), a bun just showing at the back
    const hp = new Path2D(); hp.ellipse(hx, hy, .08, .1, 0, 0, 6.29); hp.ellipse(hx - .052, hy + .03, .036, .05, .25, 0, 6.29); hp.ellipse(hx + .052, hy + .03, .036, .05, -.25, 0, 6.29);
    hp.ellipse(hx, hy + .085, .03, .04, 0, 0, 6.29);   // the neck
    ctx.fillStyle = rgba(rimCol, .8 * rim); ctx.fill(hp);
    ctx.save(); ctx.translate(-L * .011, .004); ctx.fillStyle = lin(ctx, hx - .1 * L, 0, hx + .1 * L, 0, [[0, BODY2], [1, HAIR]]); ctx.fill(hp); ctx.restore();
    ctx.strokeStyle = rgba(P.blue1, .45); ctx.lineWidth = .008; ctx.beginPath(); ctx.ellipse(hx, hy, .066, .086, 0, -Math.PI * .5 + .25 * L, -Math.PI * .5 + .9 * L, L < 0); ctx.stroke();   // sheen on the hair
    ctx.strokeStyle = rgba(P.night0, .6); ctx.lineWidth = .006; ctx.beginPath(); ctx.moveTo(hx, hy - .1); ctx.lineTo(hx, hy - .05); ctx.stroke();   // the parting
  } else {
    // forearms on the table, toward the viewer (or folded at the waist when leaning back)
    const hands = {};
    for (const s of [-1, 1]) {
      const e = [s * lerp(.25, .17, lean), lerp(.0, -.17, lean)];
      let hd = o.hand && o.hand[s < 0 ? 0 : 1] ? o.hand[s < 0 ? 0 : 1] : [s * .13, .21];
      if (o.write && s === (o.writeSide ?? 1)) hd = [hd[0] + .012 * Math.sin(t * 9) * o.write, hd[1] + .006 * Math.sin(t * 17 + 1) * o.write];
      hd = [lerp(hd[0], s * .015, lean), lerp(hd[1], -.2, lean)];
      const mid = [(e[0] + hd[0]) / 2 + s * .02, (e[1] + hd[1]) / 2];
      ctx.strokeStyle = BODY; ctx.lineCap = 'round'; ctx.lineWidth = .085; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.quadraticCurveTo(mid[0], mid[1], hd[0], hd[1]); ctx.stroke();
      ctx.strokeStyle = rgba(rimCol, .35 * rim); ctx.lineWidth = .012; ctx.beginPath(); ctx.moveTo(e[0] + L * .03, e[1] - .01); ctx.quadraticCurveTo(mid[0] + L * .035, mid[1], hd[0] + L * .03, hd[1] - .02); ctx.stroke();
      ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.beginPath(); ctx.ellipse(hd[0], hd[1] + .035, .034, .042, 0, 0, 6.29); ctx.fill();   // the hand
      ctx.fillStyle = mixHex(COL.paper2, BODY, .5); ctx.fillRect(hd[0] - .04, hd[1] - .012, .08, .018);                                          // the cuff
      hands[s < 0 ? 'L' : 'R'] = [x + hd[0] * h, y + (hd[1] + .04) * h];
    }
    ctx.restore();
    return hands;
  }
  ctx.restore();
  return null;
}

// ---------------------------------------------------------------------------------------------------------- the candle
// (x, y) = foot of the holder on the table, h = candle height. o: { lum, a, flick (0..1 flicker amount) } → flame tip [x, y]
export function candle(ctx, x, y, h, t, o = {}) {
  const lum = o.lum ?? 1, fl = 1 + (o.flick ?? .5) * (.035 * Math.sin(t * 6.1) * Math.sin(t * 2.3 + 1) + .02 * Math.sin(t * 11.3));
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  // holder: a dark dish with a warm rim
  ctx.fillStyle = mixHex(P.shade0, P.night1, .55); ctx.beginPath(); ctx.ellipse(x, y, h * .42, h * .13, 0, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = Math.max(1, h * .02); ctx.beginPath(); ctx.ellipse(x, y - h * .02, h * .4, h * .11, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  // the wax: cream, lit from the flame, a drip
  const cw = h * .16, top = y - h;
  ctx.fillStyle = lin(ctx, x - cw, 0, x + cw, 0, [[0, mixHex(COL.paper1, P.shade0, .4)], [.45, COL.paper0], [1, mixHex(COL.paper1, P.shade0, .5)]]);
  ctx.beginPath(); ctx.moveTo(x - cw, y - h * .05); ctx.lineTo(x - cw, top + cw * .3); ctx.quadraticCurveTo(x, top - cw * .15, x + cw, top + cw * .3); ctx.lineTo(x + cw, y - h * .05); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.core1, .6); ctx.beginPath(); ctx.ellipse(x - cw * .35, top + h * .18, cw * .18, h * .1, 0, 0, 6.29); ctx.fill();
  // flame: a teardrop, white-gold core
  const fx = x + h * .01 * Math.sin(t * 1.7), fy = top - h * .04, fh = h * .32 * fl;
  halo(ctx, fx, fy - fh * .5, h * 5.5 * lum, .42 * lum, P.halo1, P.core1); halo(ctx, fx, fy - fh * .5, h * .9 * lum, .5 * lum, P.core1, P.core0);
  const fp = new Path2D(); fp.moveTo(fx, fy - fh); fp.bezierCurveTo(fx + fh * .32, fy - fh * .45, fx + fh * .26, fy, fx, fy); fp.bezierCurveTo(fx - fh * .26, fy, fx - fh * .32, fy - fh * .45, fx, fy - fh); fp.closePath();
  ctx.fillStyle = lin(ctx, 0, fy - fh, 0, fy, [[0, rgba(P.halo0, .9)], [.45, P.core0], [1, rgba(P.halo1, .9)]]); ctx.fill(fp);
  ctx.fillStyle = rgba(P.blue1, .7); ctx.beginPath(); ctx.ellipse(fx, fy - fh * .12, fh * .08, fh * .12, 0, 0, 6.29); ctx.fill();   // the blue root of the flame
  ctx.restore();
  return [fx, fy - fh * .5];
}

// ---------------------------------------------------------------------------------------------------------- handwriting
// unreadable cursive: runs of loops (words) on a line. Cached by key. Returns {words: [[pts]], w}
const SCRIB = new Map();
export function scribbleLine(seed, w, size) {
  const key = `${seed}|${w}|${size}`; if (SCRIB.has(key)) return SCRIB.get(key);
  const r = prng(seed), words = []; let x = 0;
  while (x < w - size) {
    const n = 2 + Math.floor(r() * 6), lw = size * (.34 + r() * .08), pts = [];
    for (let i = 0; i <= n * 10; i++) {
      const u = i / 10, li = Math.floor(u), f = u - li, tall = ((li * 7 + seed) % 5 === 0) ? 1.9 : 1;
      const px = x + u * lw - lw * .32 * Math.sin(2 * Math.PI * f), py = -size * .42 * tall * Math.pow(Math.abs(Math.sin(Math.PI * f)), .8) + size * .05 * Math.sin(u * 1.3 + seed);
      pts.push([px, py]);
    }
    if (x + n * lw > w) break;
    words.push(pts); x += n * lw + size * (.45 + r() * .3);
  }
  const out = { words, w: x }; SCRIB.set(key, out); return out;
}
// draw a scribble line at (x, y) up to share u (0..1) of its words; returns the pen point
export function scribble(ctx, x, y, w, size, seed, u, o = {}) {
  const sc = scribbleLine(seed, w, size), n = sc.words.length; if (u <= 0 || !n) return [x, y];
  let pen = [x, y];
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = rgba(o.col ?? COL.ink, o.a ?? .82); ctx.lineWidth = o.lw ?? Math.max(1, size * .07); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  sc.words.forEach((pts, i) => {
    const k = clamp(u * n - i); if (k <= 0) return;
    const m = Math.max(2, Math.round(pts.length * k));
    ctx.beginPath(); for (let j = 0; j < m; j++) (j ? ctx.lineTo(pts[j][0], pts[j][1]) : ctx.moveTo(pts[j][0], pts[j][1])); ctx.stroke();
    pen = [x + pts[m - 1][0], y + pts[m - 1][1]];
  });
  ctx.restore();
  return pen;
}
// one legible line in the hand (Instrument Serif Italic), revealed left → right to share u; returns {nib: [x, y], w}
const MEAS = createCanvas(8, 8).getContext('2d');
export function measureItalic(s, size) { MEAS.font = `${size}px "Instrument Serif Italic"`; return MEAS.measureText(s).width; }
export function handLine(ctx, s, x, y, size, u, o = {}) {
  const w = measureItalic(s, size); if (u <= 0) return { nib: [x, y], w };
  const xr = x + w * clamp(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - size, y - size * 1.4, xr - x + size, size * 2); ctx.clip();
  ctx.font = `${size}px "Instrument Serif Italic"`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  if (o.glow) { ctx.shadowColor = rgba(P.halo0, .9 * o.glow); ctx.shadowBlur = size * .5; }
  ctx.fillStyle = o.col ?? rgba(COL.ink, .9); ctx.fillText(s, x, y); ctx.shadowBlur = 0; ctx.fillText(s, x, y);
  ctx.restore();
  return { nib: [xr, y - size * (.18 + .12 * Math.sin(u * 60))], w };
}

// ---------------------------------------------------------------------------------------------------------- ledger, book
// Emily's account book, open, top view. (cx, cy) centre, w width (height .62 w), rot. u = how much of the figure column is written.
export function ledger(ctx, cx, cy, w, rot, u, o = {}) {
  const h = w * .62;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = mixHex(P.shade0, P.night1, .6); ctx.beginPath(); ctx.roundRect(-w / 2 - 6, -h / 2 - 5, w + 12, h + 10, 6); ctx.fill();   // the board
  for (const s of [-1, 1]) {
    const pg = new Path2D(); pg.rect(s < 0 ? -w / 2 : 2, -h / 2, w / 2 - 2, h);
    B.paperFill(ctx, pg, { lum: o.lum ?? .95, seed: 361 + s, lx: -w * .1, ly: -h * .2, r: w });
    ctx.strokeStyle = rgba(COL.ink2, .22); ctx.lineWidth = 1;
    for (let i = 1; i < 9; i++) { const yy = -h / 2 + i * h / 9; ctx.beginPath(); ctx.moveTo(s < 0 ? -w / 2 + 6 : 8, yy); ctx.lineTo(s < 0 ? -6 : w / 2 - 6, yy); ctx.stroke(); }
    ctx.strokeStyle = rgba(COL.loss, .35); ctx.beginPath(); ctx.moveTo(s < 0 ? -w * .12 : w * .38, -h / 2 + 4); ctx.lineTo(s < 0 ? -w * .12 : w * .38, h / 2 - 4); ctx.stroke();   // the money column rule
  }
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-2, -h / 2, 4, h);   // the gutter
  // the left page is full; the right page gets its figures written (u)
  ctx.font = `${Math.round(h * .085)}px "Instrument Serif Italic"`; ctx.fillStyle = rgba(COL.ink, .8); ctx.textAlign = 'right';
  const FIG = ['£ 12. 6', '£ 9. 14', '£ 31. 0', '£ 7. 10', '£ 18. 2', '£ 6. 8', '£ 22. 15', '£ 4. 0'];
  for (let i = 0; i < 8; i++) {
    ctx.fillText(FIG[(i + 3) % 8], -w * .14, -h / 2 + (i + .85) * h / 9);
    const k = clamp(u * 8 - i); if (k <= 0) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(w * .1, -h / 2 + i * h / 9, w * .28 * k, h / 9); ctx.clip(); ctx.fillText(FIG[i], w * .36, -h / 2 + (i + .85) * h / 9); ctx.restore();
  }
  for (let i = 0; i < 8; i++) scribble(ctx, -w * .46, -h / 2 + (i + .8) * h / 9, w * .26, h * .06, 400 + i, 1, { a: .55 });
  for (let i = 0; i < 8; i++) { if (u * 8 - i <= 0) break; scribble(ctx, w * .04 + 4, -h / 2 + (i + .8) * h / 9, w * .1, h * .06, 420 + i, clamp(u * 8 - i), { a: .55 }); }
  ctx.restore();
  // the pen point on the right page (for a writing hand), in caller space
  const i = Math.min(7, Math.floor(u * 8)), k = clamp(u * 8 - i), lx = w * (.1 + .26 * k), ly = -h / 2 + (i + .7) * h / 9;
  return [cx + lx * Math.cos(rot) - ly * Math.sin(rot), cy + lx * Math.sin(rot) + ly * Math.cos(rot)];
}
// a cloth-bound book, top view. lines: title lines (gold stamped), small: author / year line. o: { cloth, glow 0..1 (title glows),
// lum 0..1 (lamp light on it), sx (flip squash), size (title size) }
export function bookCover(ctx, cx, cy, w, h, rot, lines, o = {}) {
  const sx = o.sx ?? 1; if (Math.abs(sx) < .02) return;
  const lum = clamp(o.lum ?? 1), cloth = o.cloth ?? '#2a2350';
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sx, 1);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 10, w, h, 6); ctx.fill();   // contact shadow
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(cloth, P.halo1, .18 * lum)], [.6, cloth], [1, mixHex(cloth, P.night0, .5)]]);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-w / 2, -h / 2, w * .07, h);   // the spine edge
  ctx.strokeStyle = rgba(P.halo1, .5 * (.4 + .6 * lum)); ctx.lineWidth = 2; ctx.strokeRect(-w * .38, -h * .44, w * .82, h * .88);
  const g = o.glow ?? 0, size = o.size ?? w * .11, n = lines.length;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  lines.forEach((ln, i) => {
    const [s, sz = size, serif = true] = Array.isArray(ln) ? ln : [ln];
    ctx.font = serif ? `${sz}px "Instrument Serif"` : `600 ${sz}px Inter`;
    if (g > 0) { ctx.shadowColor = rgba(P.halo0, .9 * g); ctx.shadowBlur = sz * .6; }
    ctx.fillStyle = mixHex(mixHex(P.shade0, P.halo0, .4 + .6 * lum), P.core0, .5 * g);
    ctx.fillText(s, w * .03, -h * .2 + (i - (n - 1) / 2) * size * 1.25 + (o.dy ?? 0)); ctx.shadowBlur = 0;
  });
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------- savers' hands
// a hand raised from below (a sleeve from the bottom), holding a sheet between the fingers. kind: 'baker' (rolled sleeve, flour),
// 'parson' (black sleeve, white cuff), 'apron' (cotton sleeve, striped), 'clerk'. (x, y) = the hand, a = arm angle (0 = up), s size
export function savingsHand(ctx, x, y, s, ang, kind, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const sleeve = { baker: mixHex(COL.paper2, BODY, .55), parson: '#090d26', apron: '#1d2a5e', clerk: '#141c45' }[kind] || BODY;
  // forearm + sleeve down to the bottom of the frame
  ctx.fillStyle = lin(ctx, -.3, 0, .3, 0, [[0, mixHex(sleeve, P.night0, .4)], [.6, sleeve], [1, mixHex(sleeve, P.halo1, .15)]]);
  ctx.beginPath(); ctx.moveTo(-.17, .25); ctx.lineTo(-.22, 4); ctx.lineTo(.22, 4); ctx.lineTo(.17, .25); ctx.closePath(); ctx.fill();
  if (kind === 'parson') { ctx.fillStyle = mixHex(COL.paper0, P.ind1, .25); ctx.fillRect(-.18, .22, .36, .12); }
  if (kind === 'baker') { ctx.fillStyle = mixHex(COL.paper1, P.ind2, .2); ctx.fillRect(-.19, .5, .38, .16); dust(ctx, 911, 40, 0, .2, .2, .25, t * .2, .5, COL.paper0); }
  if (kind === 'apron') { ctx.strokeStyle = rgba(COL.paper2, .35); ctx.lineWidth = .03; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-.2, .5 + i * .25); ctx.lineTo(.2, .5 + i * .25); ctx.stroke(); } }
  // the hand: palm + thumb + fingers closing on the sheet's lower edge
  ctx.fillStyle = mixHex(P.shade0, P.night1, .4);
  ctx.beginPath(); ctx.ellipse(0, .05, .17, .2, 0, 0, 6.29); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-.16, -.03, .05, .13, .5, 0, 6.29); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(-.09 + i * .065, -.17, .035, .07, 0, 0, 6.29); ctx.fill(); }
  ctx.fillStyle = rgba(P.halo1, .25); ctx.beginPath(); ctx.ellipse(.08, -.02, .05, .14, 0, 0, 6.29); ctx.fill();   // lamp light on the knuckles
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------- labels
// a pin line from (px, py) up to the label baseline (ly), then the label lines rise from their baseline. u 0..1 (line), v1, v2 (text)
export function label(ctx, px, py, ly, l1, l2, u, v1, v2, o = {}) {
  const col = o.col ?? P.halo2, size = o.size ?? 34;
  if (u > 0) B.inkLine(ctx, [[px, py], [px, ly + (l2 ? size * 1.15 : 0) + 12]], u, { col, w: 2, a: .75 });
  const al = o.align ?? 'center';
  if (v1 > 0) K.maskLine(ctx, [[l1, 0]], px, ly, size, v1, { serif: false, col: o.col1 ?? P.cream, glow: false, align: al });
  if (l2 && v2 > 0) K.maskLine(ctx, [[l2, o.warm2 ?? 0]], px, ly + size * 1.15, size * .8, v2, { serif: false, col, glow: false, align: al });
}

// ---------------------------------------------------------------------------------------------------------- fly into a light
// screen space: a point of light at (x, y) whose glow grows with k (0 → 1) until the frame is light (k ≥ .985: full, opaque, so the
// worlds on both sides of a fly-through draw the same frame). col: the light's colour (cool for fibre, warm for a window).
export function lightFill(ctx, x, y, k, col = COL.cool, core = '#f4f7ff') {
  if (k <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // r3 (calm): the flood is a held-down light, never a white-out: it settles on a mid-tone of its colour (luma ≈ 90–110) so the
  // frame-to-frame change stays under smooth.py's lurch line; the core softens into the colour as the flood completes
  const R = lerp(30, 2600, k ** 1.8), full = smooth(clamp((k - .6) / .38));
  const flat = mixHex(col, P.night1, .5), mid = mixHex(col, P.night1, .22), c0 = mixHex(core, col, .3 + .45 * full);
  ctx.fillStyle = rad(ctx, x, y, R, [[0, c0], [.12, rgba(mid, .95 + .05 * full)], [.5, rgba(flat, .6 + .4 * full)], [1, rgba(flat, full)]]);
  ctx.fillRect(0, 0, E.W, E.H);
  ctx.restore();
}

// "≈" drawn as two tilde strokes (Instrument Serif has no ≈), rising from its baseline like K.maskLine. Returns its advance width.
export function approx(ctx, x, y, size, u, col = P.cream) {
  const w = size * .62; if (u <= 0) return w;
  const k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  ctx.save(); ctx.beginPath(); ctx.rect(x - size * .2, y - size * 1.25, w + size * .4, size * 1.25 + size * .32); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = size * .055; ctx.lineCap = 'round';
  for (const yy of [-.42, -.24]) {
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) { const f = i / 16, px = x + size * .06 + f * w * .8, py = y + dy + size * yy - Math.sin(f * 2 * Math.PI) * size * .045; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
  }
  ctx.restore();
  return w;
}
