// The engraved plan sheet with three coupons PLANT · GROW · HARVEST, owner C6 (3.17, 4.01); also used by C7 (5.01) and C8 (6.01).
// A banknote-grade sheet in the film's certificate language: woven guilloche border, header with rosettes and microtext, three
// dividend-style coupons separated by perforation lines, each with an engraved oval vignette (seed in soil · sprout · fruit cut
// into equal pieces), the step word in engraved caps, Nº and step line. Paper and ink are cached once at 3× (crisp up to s ≈ 3.5);
// per frame only transforms, the engraving reveal, the hero coupon's foil and the glints are live.
//
//   planSheet(ctx, x, y, s, t, o) → { coupon(i) → { x, y, w, h, r }, emblem(i) → { x, y, r }, word(i) → { x, y }, corners: [[x, y] × 4],
//                                     toScreen(px, py) → [x, y] (sheet units, origin = sheet centre, 900 × 520) }
//     x, y = centre, s = 1 → 900 × 520 px.  o: {
//       rot 0          rotation (rad)
//       u 1            engraving progress: 0 = blank paper, the burin front sweeps left → right and leaves the engraving behind it
//       coupons [0,0,0]  per coupon 0 attached … 1 torn off along its perforation and gone (it lifts, turns and drifts away)
//       hi null        0 | 1 | 2: the glowing coupon (the chapter anchor): warm light behind it, foil on its word and frame
//       hiU 1          0..1 how far the foil has run into the hero coupon (animate it on the chapter word)
//       from 1         0..1 napkin → sheet (3.17): 0 = a soft folded paper square (napkin size) with the ink signs, 1 = the sheet
//       lift 0         px the sheet floats above its ground (shadow grows and softens)
//       shadow true    soft cast shadow under the sheet
//       light null     [x, y] screen point of the key light (the paper warms toward it), default upper left
//       a 1            alpha
//       dim [0,0,0]    0..1 per coupon: sink a coupon back (the other chapters while one is the anchor)
//       glint true     a slow foil glint over the hero coupon
//     }
// Coupons: 0 PLANT (emblem: a seed in soil), 1 GROW (a sprout), 2 HARVEST (a fruit cut into equal pieces).
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, lin, sm, eout, eio, prng, canvas, text, hatch as eHatch } from '../engine.mjs';
import { roughPath, stipple, vnoise } from './art.mjs';
import { gBorder, rosette, microtext, intaglio, guilloche } from './certificate.mjs';
import { perforation } from './perforate.mjs';

export const PLAN = { w: 900, h: 520, words: ['PLANT', 'GROW', 'HARVEST'], steps: ['STEP ONE', 'STEP TWO', 'STEP THREE'] };
const INKC = '#24384f', RUST = '#8a3a2a', PAPERC = '#efe6cf', K = 3, PAD = 34;
const FOIL = ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'];
const TAU = Math.PI * 2;
// geometry in sheet units (centre origin)
const CX0 = -415, CW = 830 / 3, CY0 = -118, CH = 340;
export const couponBox = (i) => ({ x0: CX0 + i * CW, y0: CY0, w: CW, h: CH, cx: CX0 + (i + .5) * CW, cy: CY0 + CH / 2 });
const VIG = (i) => { const b = couponBox(i); return { cx: b.cx, cy: b.y0 + 104, rx: 104, ry: 64 }; };
const WORDY = (i) => couponBox(i).y0 + 222;

const CACHE = new Map();
const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

// ---------- the engraved vignettes (drawn in sheet units into a K× layer) ----------
function soilWarp(x, y, hz) { return y > hz ? 5 * Math.sin(x * .05 + 1) * (y - hz) / 60 + 3 * Math.sin(x * .13) : 0; }
function vignette(g, i, n) {
  const V = VIG(i), w = V.rx * 2, h = V.ry * 2, x0 = V.cx - V.rx, y0 = V.cy - V.ry, hz = h * .64;
  g.save(); g.beginPath(); g.ellipse(V.cx, V.cy, V.rx, V.ry, 0, 0, TAU); g.clip();
  // sky: fine lines thinning toward a low sun (top right), soil: swelling furrows that bend with the land
  const sunX = w * (i === 1 ? .78 : i === 2 ? .2 : .72), sunY = hz - 4;
  const hill = (x) => hz + 6 * Math.sin(x * .03 + i) + 3 * Math.sin(x * .09 + 2 * i);
  intaglio(g, x0, y0, w, h, {
    gap: 2.6, angle: 0, col: INKC, maxW: 2.2,
    tone: (x, y) => { const hy = hill(x); if (y > hy) return .42 + .5 * clamp((y - hy) / (h - hy)) + .16 * (n(x * .06 + i * 7, y * .1) - .5); const d = Math.hypot(x - sunX, (y - sunY) * 1.5); return d < 18 ? 0 : clamp((d - 18) / 150) * .55 + .08; },
    warp: (x, y) => soilWarp(x, y, hill(x)),
  });
  // sun rays
  g.strokeStyle = rgba(INKC, .5); g.lineWidth = .5;
  for (let k = 0; k < 15; k++) { const a = Math.PI + k / 14 * Math.PI, r0 = 22, r1 = 30 + (k % 2) * 9; g.beginPath(); g.moveTo(x0 + sunX + Math.cos(a) * r0, y0 + sunY + Math.sin(a) * r0 * .85); g.lineTo(x0 + sunX + Math.cos(a) * r1, y0 + sunY + Math.sin(a) * r1 * .85); g.stroke(); }
  // the emblem, line-engraved: an outline in ink, paper inside, hatching on the shadow side
  const ex = V.cx, ey = y0 + hz;
  g.lineJoin = 'round'; g.lineCap = 'round';
  const shade = (path, ang, gap, a, fade) => { eHatch(g, path, ang, gap, a, { col: INKC, w: .55, wobble: .25, fade, seed: 3 + i }); };
  if (i === 0) {   // a seed resting in the furrow, a root reaching down, two tiny engraved rays of growth
    const sp = new Path2D(), R = 15; sp.moveTo(ex, ey - R * 1.55); sp.bezierCurveTo(ex + R * 1.05, ey - R * .7, ex + R * .95, ey + R * .75, ex, ey + R * .9); sp.bezierCurveTo(ex - R * .95, ey + R * .75, ex - R * 1.05, ey - R * .7, ex, ey - R * 1.55); sp.closePath();
    g.fillStyle = PAPERC; g.fill(sp); shade(sp, .9, 2.1, .9, [ex + R, ey + R, ex - R * .4, ey - R]);
    g.strokeStyle = INKC; g.lineWidth = 1.1; g.stroke(sp);
    g.lineWidth = .7; g.beginPath(); g.moveTo(ex - 2, ey - R * 1.2); g.quadraticCurveTo(ex + 3, ey, ex - 1, ey + R * .7); g.stroke();
    g.lineWidth = .8; g.beginPath(); g.moveTo(ex + 1, ey + R * .9); g.bezierCurveTo(ex + 4, ey + 20, ex - 6, ey + 28, ex - 2, ey + 40); g.stroke();
    g.lineWidth = .5; g.beginPath(); g.moveTo(ex, ey + 24); g.lineTo(ex + 9, ey + 31); g.moveTo(ex - 3, ey + 31); g.lineTo(ex - 11, ey + 36); g.stroke();
  } else if (i === 1) {  // a sprout: a stem with two leaves, the soil cracked around it
    g.strokeStyle = INKC; g.lineWidth = 1.6; g.beginPath(); g.moveTo(ex, ey + 6); g.bezierCurveTo(ex - 4, ey - 18, ex + 6, ey - 36, ex + 1, ey - 52); g.stroke();
    for (const sd of [-1, 1]) {
      const lp = new Path2D(), bx = ex + (sd < 0 ? -1 : 2), by = ey - (sd < 0 ? 30 : 44), L = sd < 0 ? 34 : 30, a = sd < 0 ? -2.6 : -.45;
      const tx = bx + Math.cos(a) * L, ty = by + Math.sin(a) * L, nx = -Math.sin(a) * 10, ny = Math.cos(a) * 10;
      lp.moveTo(bx, by); lp.quadraticCurveTo((bx + tx) / 2 + nx, (by + ty) / 2 + ny, tx, ty); lp.quadraticCurveTo((bx + tx) / 2 - nx, (by + ty) / 2 - ny, bx, by); lp.closePath();
      g.fillStyle = PAPERC; g.fill(lp); shade(lp, a + 1.2, 1.9, .85, [(bx + tx) / 2 + nx, (by + ty) / 2 + ny, (bx + tx) / 2 - nx, (by + ty) / 2 - ny]);
      g.strokeStyle = INKC; g.lineWidth = 1; g.stroke(lp); g.lineWidth = .55; g.beginPath(); g.moveTo(bx, by); g.lineTo(mix(bx, tx, .85), mix(by, ty, .85)); g.stroke();
    }
    g.lineWidth = .6; for (const [dx, dy] of [[-14, 4], [12, 5], [-22, 8], [20, 9]]) { g.beginPath(); g.moveTo(ex + dx * .4, ey + 3); g.lineTo(ex + dx, ey + dy); g.stroke(); }
  } else {           // a round fruit cut into six equal pieces, slightly apart, with a stem and a leaf
    const R = 30, cy = ey - R - 6, n6 = 6;
    for (let k = 0; k < n6; k++) {
      const a0 = -Math.PI / 2 + k * TAU / n6, a1 = a0 + TAU / n6, mid = (a0 + a1) / 2, ox = Math.cos(mid) * 4.5, oy = Math.sin(mid) * 4.5;
      const wp = new Path2D(); wp.moveTo(ex + ox, cy + oy); wp.arc(ex + ox, cy + oy, R, a0 + .03, a1 - .03); wp.closePath();
      g.fillStyle = PAPERC; g.fill(wp); shade(wp, .8, 2.2, .85, [ex + R, cy + R, ex - R * .5, cy - R * .5]);
      g.strokeStyle = INKC; g.lineWidth = .95; g.stroke(wp);
    }
    g.lineWidth = 1.3; g.beginPath(); g.moveTo(ex, cy - R - 2); g.quadraticCurveTo(ex + 3, cy - R - 12, ex + 1, cy - R - 18); g.stroke();
    const lp = new Path2D(); lp.moveTo(ex + 2, cy - R - 12); lp.quadraticCurveTo(ex + 18, cy - R - 26, ex + 30, cy - R - 16); lp.quadraticCurveTo(ex + 16, cy - R - 8, ex + 2, cy - R - 12); lp.closePath();
    g.fillStyle = PAPERC; g.fill(lp); shade(lp, -.3, 1.9, .8, null); g.lineWidth = .9; g.stroke(lp);
  }
  g.restore();
  // engraved oval frame: two hairlines and a tiny bead row
  g.strokeStyle = rgba(INKC, .85); g.lineWidth = 1.1; g.beginPath(); g.ellipse(V.cx, V.cy, V.rx + 4, V.ry + 4, 0, 0, TAU); g.stroke();
  g.lineWidth = .5; g.beginPath(); g.ellipse(V.cx, V.cy, V.rx + 8, V.ry + 8, 0, 0, TAU); g.stroke();
  g.fillStyle = rgba(INKC, .6); for (let k = 0; k < 64; k++) { const a = k / 64 * TAU; g.beginPath(); g.arc(V.cx + Math.cos(a) * (V.rx + 11.5), V.cy + Math.sin(a) * (V.ry + 11.5), .7, 0, TAU); g.fill(); }
}
function fitFont(g, str, size, maxW, spacing) { let out = 18; for (let s = size; s > 18; s -= 1) { g.font = `${s}px "Instrument Serif"`; try { g.letterSpacing = spacing + 'px'; } catch { } if (g.measureText(str).width <= maxW) { out = s; break; } } try { g.letterSpacing = '0px'; } catch { } return out; }

// ---------- cached layers ----------
const LW = Math.ceil((PLAN.w + PAD * 2) * K), LH = Math.ceil((PLAN.h + PAD * 2) * K);
function paperPath(g, from = 1) {
  const w = PLAN.w, h = PLAN.h; g.beginPath(); roughPath(g, [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], { amp: 1.3, step: 8, seed: 31 });
}
function paperLayer() {
  return once('paper', () => {
    const [c, g] = canvas(LW, LH), w = PLAN.w, h = PLAN.h; g.setTransform(K, 0, 0, K, (w / 2 + PAD) * K, (h / 2 + PAD) * K);
    paperPath(g); const pg = g.createRadialGradient(-w * .1, -h * .15, 0, 0, 0, w * .62); pg.addColorStop(0, '#f8f0de'); pg.addColorStop(.65, PAPERC); pg.addColorStop(1, '#dccaa6');
    g.fillStyle = pg; g.fill(); g.save(); g.clip();
    const r = prng(8); g.lineCap = 'round';
    for (let i = 0; i < 2200; i++) { const px = (r() - .5) * w, py = (r() - .5) * h, L = 3 + r() * 16, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(255,252,240,${.2 + r() * .3})` : `rgba(120,95,60,${.06 + r() * .12})`; g.lineWidth = .45; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a0) * L, py + Math.sin(a0) * L); g.stroke(); }
    // a faint security rosette field under everything
    rosette(g, 0, 10, { R: 250, A: 40, B: 18, n: 30, m: 11, lines: 54, col: '#a8854f', w: .32, a: .13 });
    g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .22, g: 1, seed: 5, mid: false, boost: 1 });
    return c;
  });
}
function inkLayer() {
  return once('ink', () => {
    const [c, g] = canvas(LW, LH), w = PLAN.w, h = PLAN.h, n = vnoise(19); g.setTransform(K, 0, 0, K, (w / 2 + PAD) * K, (h / 2 + PAD) * K);
    // woven border + inner hairline frame
    gBorder(g, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, { band: 26, lines: 9, waves: 150, col: '#28405a', w: .55, a: .8, radius: 16, u: .99999 });
    gBorder(g, -w / 2 + 42, -h / 2 + 42, w - 84, h - 84, { band: 8, lines: 3, waves: 300, col: '#8a5a24', w: .4, a: .75, radius: 8, u: .99999 });
    // header: the title between two rosettes, microtext rule
    for (const sx of [-1, 1]) rosette(g, sx * 352, -170, { R: 28, A: 8, B: 4, n: 13, m: 5, lines: 20, col: '#28405a', w: .45, a: .9 });
    g.textAlign = 'center';
    text(g, 'THE PLAN', 0, -160, { size: 46, font: 'Instrument Serif', color: INKC, align: 'center', spacing: 14 });
    text(g, 'ONE EQUAL SHARE FOR EVERY PERSON ON EARTH', 0, -201, { size: 10.5, weight: 600, color: rgba(INKC, .85), align: 'center', spacing: 4.5 });
    microtext(g, -290, -140, 580, 'PLANT A SHARE FOR EVERYONE NOW · LET IT GROW WITH EVERY SUCCESS · HARVEST THE SAME SHARE FOR EVERY HUMAN BEING', { size: 3.6, col: '#28405a', a: .8, spacing: .3 });
    microtext(g, -290, -133, 580, 'AGREED BEFORE THE FORTUNE EXISTS · NOT CHARITY BUT A RIGHT · ', { size: 3.6, col: '#28405a', a: .55, spacing: .3 });
    // the three coupons
    for (let i = 0; i < 3; i++) {
      const b = couponBox(i), x0 = b.x0 + 9, y0 = b.y0 + 4, cw = b.w - 18, ch = b.h - 8;
      g.strokeStyle = rgba(INKC, .8); g.lineWidth = 1; g.beginPath(); g.roundRect(x0, y0, cw, ch, 10); g.stroke();
      g.lineWidth = .45; g.beginPath(); g.roundRect(x0 + 5, y0 + 5, cw - 10, ch - 10, 7); g.stroke();
      for (const [qx, qy] of [[x0 + 17, y0 + 17], [x0 + cw - 17, y0 + 17], [x0 + 17, y0 + ch - 17], [x0 + cw - 17, y0 + ch - 17]]) rosette(g, qx, qy, { R: 7, A: 2.6, B: 1.3, n: 9, m: 4, lines: 10, col: '#28405a', w: .35, a: .9 });
      text(g, 'Nº ' + (i + 1), x0 + 32, y0 + 22, { size: 15, font: 'Instrument Serif', color: RUST });
      vignette(g, i, n);
      const word = PLAN.words[i], fs = fitFont(g, word, 46, cw - 44, 7);
      text(g, word, b.cx, WORDY(i), { size: fs, font: 'Instrument Serif', color: INKC, align: 'center', spacing: 7 });
      text(g, PLAN.steps[i], b.cx, WORDY(i) + 30, { size: 9.5, weight: 600, color: rgba(INKC, .75), align: 'center', spacing: 4 });
      microtext(g, x0 + 22, WORDY(i) + 50, cw - 44, ['PLANT A SHARE FOR EVERYONE, NOW', 'LET IT GROW WITH EVERY SUCCESS', 'HARVEST THE SAME SHARE FOR EVERY HUMAN BEING'][i], { size: 3.3, col: '#28405a', a: .75, spacing: .25 });
      // a tiny woven band at the coupon foot
      g.save(); g.beginPath(); g.rect(x0 + 18, y0 + ch - 34, cw - 36, 16); g.clip();
      g.strokeStyle = rgba('#8a5a24', .7); g.lineWidth = .4;
      for (let l = 0; l < 4; l++) { g.beginPath(); for (let k = 0; k <= 160; k++) { const xx = x0 + 18 + k / 160 * (cw - 36), yy = y0 + ch - 26 + 5 * Math.sin(k * .55 + l * 1.6) * Math.cos(k * .07); k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
      g.restore();
    }
    // perforations between the coupons and under the header (holes with the paper pushed in)
    for (const px of [CX0 + CW, CX0 + 2 * CW]) perforation(g, [[px, CY0 - 6], [px, CY0 + CH + 4]], { pitch: 6.2, hole: 1.25, col: '#3a2c22', shade: '#2a1a10' });
    perforation(g, [[CX0 + 6, CY0 - 8], [CX0 + 3 * CW - 6, CY0 - 8]], { pitch: 6.2, hole: 1.1, col: '#3a2c22', shade: '#2a1a10', a: .7 });
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .18, g: 1, seed: 6, mid: false, boost: 1 });   // printed wear
    return c;
  });
}
// foil version of a coupon word (mask + foil gradient + leaf texture), cached per word at K×
function foilWord(i) {
  return once('foil' + i, () => {
    const word = PLAN.words[i], [m, mx] = canvas(10, 10), b = couponBox(i), fs = fitFont(mx, word, 46, b.w - 18 - 44, 7);
    mx.font = `${fs * K}px "Instrument Serif"`; try { mx.letterSpacing = 7 * K + 'px'; } catch { }
    const tw = Math.ceil(mx.measureText(word).width + 30 * K), th = Math.ceil(fs * 1.25 * K), [c, g] = canvas(tw, th);
    g.font = mx.font; try { g.letterSpacing = 7 * K + 'px'; } catch { } g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    const fg = g.createLinearGradient(0, 0, tw, th * .5); FOIL.forEach((cc, k) => fg.addColorStop(k / (FOIL.length - 1), cc)); g.fillStyle = fg; g.fillText(word, tw / 2, th * .8);
    const [nc, nx] = canvas(tw, th); nx.drawImage(c, 0, 0); nx.globalCompositeOperation = 'source-in'; nx.fillStyle = 'rgba(255,236,190,.5)'; nx.fillRect(0, 0, tw, th); stipple(nc, { k: 1, g: 1.5, seed: 9 + i, mid: false, boost: 1.3 });
    g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0);
    const [mk, mg] = canvas(tw, th); mg.font = g.font; try { mg.letterSpacing = 7 * K + 'px'; } catch { } mg.textAlign = 'center'; mg.fillStyle = '#fff'; mg.fillText(word, tw / 2, th * .8);
    return { c, mask: mk, tw: tw / K, th: th / K, base: th * .8 / K, scratch: canvas(tw, th) };
  });
}
// a napkin look for the morph source (from < 1): soft folded paper square with fibres and a cross crease
function napkinLayer() {
  return once('napkin', () => {
    const S = 380, [c, g] = canvas(S * K, S * K); g.setTransform(K, 0, 0, K, S / 2 * K, S / 2 * K);
    g.beginPath(); roughPath(g, [[-170, -170], [170, -170], [170, 170], [-170, 170]], { amp: 2.4, step: 6, seed: 12 });
    const pg = g.createRadialGradient(-40, -60, 0, 0, 0, 260); pg.addColorStop(0, '#fbf7ee'); pg.addColorStop(1, '#e2dccd'); g.fillStyle = pg; g.fill(); g.save(); g.clip();
    const r = prng(14); for (let i = 0; i < 1400; i++) { const px = (r() - .5) * 340, py = (r() - .5) * 340; g.fillStyle = r() < .5 ? 'rgba(255,255,255,.35)' : 'rgba(120,110,95,.12)'; g.fillRect(px, py, 1 + r() * 2, 1); }
    for (const [x0, y0, x1, y1] of [[0, -170, 0, 170], [-170, 0, 170, 0]]) { const lg = g.createLinearGradient(x0 - (y1 - y0) * .04, y0, x0 + (y1 - y0) * .04, y0); g.strokeStyle = 'rgba(150,135,110,.28)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + 1.5, y0 + 1.5); g.lineTo(x1 + 1.5, y1 + 1.5); g.stroke(); }
    // embossed napkin border pattern
    g.strokeStyle = 'rgba(160,150,130,.35)'; g.lineWidth = 1; g.beginPath(); g.roundRect(-150, -150, 300, 300, 6); g.stroke();
    g.restore(); return c;
  });
}

const sheetScratch = []; function scratch() { if (!sheetScratch.length) sheetScratch.push(canvas(LW, LH)); return sheetScratch[0]; }

export function planSheet(ctx, x, y, s, t, o = {}) {
  const rot = o.rot ?? 0, u = clamp(o.u ?? 1), from = clamp(o.from ?? 1), coupons = o.coupons || [0, 0, 0], hi = o.hi ?? null, a = o.a ?? 1;
  const w = PLAN.w, h = PLAN.h, cr = Math.cos(rot), sr = Math.sin(rot), lift = o.lift ?? 0;
  const toScreen = (px, py) => [x + (px * cr - py * sr) * s, y + (px * sr + py * cr) * s];
  const out = {
    toScreen,
    coupon: (i) => { const b = couponBox(i), [cx, cy] = toScreen(b.cx, b.cy); return { x: cx, y: cy, w: b.w * s, h: b.h * s, r: rot }; },
    emblem: (i) => { const V = VIG(i), [cx, cy] = toScreen(V.cx, V.cy + 10); return { x: cx, y: cy, r: 40 * s }; },
    word: (i) => { const b = couponBox(i), [cx, cy] = toScreen(b.cx, WORDY(i) - 14); return { x: cx, y: cy }; },
    corners: [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([px, py]) => toScreen(px, py)),
  };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha = a;
  // the morph source: the soft napkin square that becomes the sheet (3.17)
  const mf = eio(from);
  const sx = mix(340 / w, 1, mf), sy = mix(340 / h, 1, mf);
  // shadow
  if (o.shadow !== false) {
    ctx.save(); ctx.translate(x + (14 + lift * .5) * s * .6, y + (22 + lift * .8) * s * .6); ctx.rotate(rot); ctx.scale(s * sx, s * sy);
    ctx.shadowColor = `rgba(0,0,0,${.55 - Math.min(.3, lift * .004)})`; ctx.shadowBlur = (24 + lift * .6) * s; ctx.fillStyle = 'rgba(0,0,0,.45)';
    ctx.fillRect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24); ctx.restore();
  }
  ctx.save(); ctx.translate(x, y - lift * 0); ctx.rotate(rot);
  if (from < 1) {   // napkin → sheet: the paper unfolds wider, the napkin texture gives way to the engraved paper
    const N = napkinLayer(), S = N.width / K;
    ctx.save(); ctx.globalAlpha = a * (1 - sm(lin(.15, .75, from))); ctx.scale(s * mix(1, 1.35, mf), s * mix(1, 1.05, mf)); ctx.drawImage(N, -S / 2, -S / 2, S, S); ctx.restore();
  }
  ctx.scale(s * sx, s * sy);
  const fa = from < 1 ? sm(lin(.25, .85, from)) : 1;
  const P = paperLayer(), I = inkLayer(), lw = LW / K, lh = LH / K;
  // which coupons stay attached: draw the sheet minus the torn ones, then the torn ones on their way
  const torn = coupons.map((c) => clamp(c));
  const clipOut = (g, list) => { g.beginPath(); g.rect(-lw, -lh, lw * 2, lh * 2); for (const i of list) { const b = couponBox(i); g.rect(b.x0 + b.w, b.y0 - 2, -b.w, b.h + 4); } g.clip(); };   // even-odd by winding: reverse rects
  const tornIdx = torn.map((c, i) => (c > 0 ? i : -1)).filter((i) => i >= 0);
  ctx.save(); ctx.globalAlpha = a * fa; if (tornIdx.length) clipOut(ctx, tornIdx);
  ctx.drawImage(P, -lw / 2, -lh / 2, lw, lh);
  // the engraving: revealed behind a burin front that sweeps left → right
  if (u >= 1) ctx.drawImage(I, -lw / 2, -lh / 2, lw, lh);
  else if (u > 0) {
    const fx = mix(-w / 2 - 20, w / 2 + 20, u);
    ctx.save(); ctx.beginPath(); ctx.rect(-lw / 2, -lh / 2, fx + lw / 2, lh); ctx.clip(); ctx.drawImage(I, -lw / 2, -lh / 2, lw, lh); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createLinearGradient(fx - 40, 0, fx + 6, 0); gg.addColorStop(0, 'rgba(255,179,92,0)'); gg.addColorStop(.8, 'rgba(255,200,130,.35)'); gg.addColorStop(1, 'rgba(255,240,215,.0)'); ctx.fillStyle = gg; ctx.fillRect(fx - 40, -h / 2, 46, h); ctx.restore();
  }
  ctx.restore();
  // dim (sink) coupons that are not the anchor
  const dim = o.dim || [0, 0, 0];
  for (let i = 0; i < 3; i++) if (dim[i] > 0 && !torn[i]) { const b = couponBox(i); ctx.save(); ctx.globalAlpha = a * fa * dim[i] * .55; ctx.fillStyle = '#2a2034'; ctx.beginPath(); ctx.roundRect(b.x0 + 6, b.y0 + 2, b.w - 12, b.h - 4, 10); ctx.fill(); ctx.restore(); }
  // the hero coupon: warm light, foil frame and foil word
  if (hi != null && !torn[hi]) heroCoupon(ctx, hi, t, clamp(o.hiU ?? 1), a * fa, o.glint !== false);
  // torn coupons: each lifts off along its perforation, turns and drifts away (paper + ink clipped to the coupon)
  for (const i of tornIdx) {
    const b = couponBox(i), q = torn[i], e = eout(q), dir = i === 0 ? -1 : 1;
    ctx.save(); ctx.globalAlpha = a * fa * (1 - sm(lin(.7, 1, q)));
    ctx.translate(b.cx + dir * 40 * e, b.cy - 160 * e); ctx.rotate(dir * .35 * e); ctx.translate(-b.cx, -b.cy);
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 20 * e; ctx.shadowOffsetY = 18 * e;
    ctx.beginPath(); ctx.rect(b.x0, b.y0 - 2, b.w, b.h + 4); ctx.clip(); ctx.drawImage(P, -lw / 2, -lh / 2, lw, lh); ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.drawImage(I, -lw / 2, -lh / 2, lw, lh);
    if (hi === i) heroCoupon(ctx, i, t, clamp(o.hiU ?? 1), 1, o.glint !== false);
    ctx.restore();
  }
  ctx.restore(); ctx.restore();
  return out;
}
// foil frame + foil word + glint on coupon i (sheet units, current transform = sheet)
function heroCoupon(ctx, i, t, hu, a, glint) {
  if (hu <= 0) return;
  const b = couponBox(i), x0 = b.x0 + 9, y0 = b.y0 + 4, cw = b.w - 18, ch = b.h - 8;
  ctx.save(); ctx.globalAlpha = a;
  // warm light pooling on the coupon (multiply-safe: lighter, low)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(b.cx, b.cy - 40, 0, b.cx, b.cy, b.h * .8); lg.addColorStop(0, rgba('#ffb35c', .2 * hu)); lg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = lg; ctx.fillRect(b.x0, b.y0, b.w, b.h); ctx.restore();
  // foil frame drawing on around the coupon: two runs from the top centre, one each way, meeting at the bottom
  const fg = ctx.createLinearGradient(x0, y0, x0 + cw, y0 + ch); FOIL.forEach((c, k) => fg.addColorStop(k / (FOIL.length - 1), c));
  const half = [[x0 + cw / 2, y0], [x0 + cw, y0], [x0 + cw, y0 + ch], [x0 + cw / 2, y0 + ch]], L = cw / 2 + ch + cw / 2, run = L * eio(hu);
  ctx.strokeStyle = fg; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const sd of [1, -1]) { let left = run; ctx.beginPath(); ctx.moveTo(b.cx + sd * (half[0][0] - b.cx), half[0][1]);
    for (let k = 1; k < half.length && left > 0; k++) { const [ax, ay] = half[k - 1], [bx, by] = half[k], seg = Math.hypot(bx - ax, by - ay), q = Math.min(1, left / seg); ctx.lineTo(b.cx + sd * (mix(ax, bx, q) - b.cx), mix(ay, by, q)); left -= seg; }
    ctx.stroke(); }
  // foil word: wipes in left → right over the ink word
  const F = foilWord(i), wx = b.cx - F.tw / 2, wy = WORDY(i) - F.base, wu = sm(lin(.25, .9, hu));
  if (wu > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy - 4, F.tw * wu, F.th + 8); ctx.clip(); ctx.drawImage(F.c, wx, wy, F.tw, F.th); ctx.restore();
    if (glint) {   // a foil glint band running through the letters
      const [sc, sg] = F.scratch, tw = sc.width, th = sc.height; sg.globalCompositeOperation = 'source-over'; sg.clearRect(0, 0, tw, th); sg.drawImage(F.mask, 0, 0);
      sg.globalCompositeOperation = 'source-in'; const ph = ((t * .22 + i * .3) % 1.5) - .25, gx = ph * (tw + 300) - 150; const gg = sg.createLinearGradient(gx - 70, 0, gx + 70, th * .5); gg.addColorStop(0, 'rgba(255,179,92,0)'); gg.addColorStop(.5, 'rgba(255,214,150,.42)'); gg.addColorStop(1, 'rgba(255,179,92,0)'); sg.fillStyle = gg; sg.fillRect(0, 0, tw, th);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * wu; ctx.drawImage(sc, wx, wy, F.tw, F.th); ctx.restore();
    }
  }
  ctx.restore();
}
// warm the caches (call once at chunk build so the first frame does not pay for it)
export function planSheetWarm() { paperLayer(); inkLayer(); napkinLayer(); for (let i = 0; i < 3; i++) foilWord(i); }
