// C04 (Film 4 minute 1) · 4.04 ★ the pop-up dawn. Owner: c04 (minute repair).
// Plate II is the cover of a pop-up book. On "could change" the cover falls open toward us (hinged at its bottom edge): its printed face
// tips away and becomes a thin line, then its inner face is the floor page; behind it the back page is the dawn sky. Before the cover
// moves, the light points of HAVING TO (the dawn shining through the punched holes) leave the paper and gather into the sun, which
// grows out of them. The paper landscape stands up on the floor as the book opens, back to front, with small paper people doing
// things that matter (painting, teaching a child, gardening, building a boat). Nothing fades: the cover is a real page that turns,
// every piece rises on its hinge, the sun grows from the gathered light.
// All coordinates are plate units (origin = plate centre, the card is 1000×560); the caller sets the plate's transform.
//   popup(ctx, t, K, o)   K: book times (bookTimes), o: { cover: plate() options of plate II's printed face, sun: { x, y, r, m, R, a }
//                          (the sun disc and halo in SCREEN px, from the scene's camera), live } → { sunY }
//   bookTimes(K0)         K0: { change, human, for, end } → the book's times (fold, gather, ign, rise, sunUp, …)
//   foldAt(t, K)          { th, dy }: cover angle (0 closed … π/2 flat) and the projected offset of its free edge from the hinge
//   sunAt(t, K)           { x, y, r, g, rays }: the sun in plate units (r = disc radius, g = growth 0..1)
//   warmPopup()           builds every cached layer
import { rgba, clamp, mix, prng, canvas, sm, eio, lin } from '../engine.mjs';
import { stipple, hatch as artHatch } from './art.mjs';
import { gBorder } from './certificate.mjs';
import { figureFlat, figureKid, KIDPOSES } from './figure.mjs';
import { plate, holePts, glowSprite, PW, PH } from './sc04_m1plate.mjs';
import { once } from './m1x_c04_img.mjs';
import { gardener } from './m1x_c04_garden.mjs';
import { sunDisc, sunHalo } from './m1x_c04_sun.mjs';

const TAU = Math.PI * 2;
export const SUNX = 70;
const FB = PH / 2, DEPTH = 190, ELEV = Math.atan(DEPTH / PH);   // the hinge; the open floor page shows 190 deep (camera ~19° above it)
const backOut = (u) => { const c1 = .9, c3 = c1 + 1; u = clamp(u); return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };

// ---------------------------------------------------------------- times and states
export function bookTimes(K0) {
  const fold0 = K0.change - .12, fold1 = fold0 + .8;
  // the moment the falling cover is edge-on (its inner face starts to show): eio(u) = 1 − 2·ELEV/π
  const target = 1 - 2 * ELEV / Math.PI; let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (eio(m) < target) lo = m; else hi = m; }
  const edge = fold0 + lo * (fold1 - fold0), gather = fold0 - .14;
  return { ...K0, fold0, fold1, edge, gather, ign0: gather + .5, ign1: gather + 1.0, rise: edge - .1, human: K0.human - .1, sunUp: K0.for - .4 };
}
export function foldAt(t, K) {
  const th = Math.PI / 2 * eio(lin(K.fold0, K.fold1, t));
  return { th, dy: -PH * Math.cos(th + ELEV) / Math.cos(ELEV) };
}
export function sunAt(t, K) {
  const ign = sm(lin(K.ign0, K.ign1, t)), up = eio(lin(K.sunUp, K.end, t));
  return { x: SUNX, y: mix(150, 62, up) - 22 * ign, r: 44 * ign, g: ign, rays: ign * (.6 + .4 * up), halo: 360 * (.55 + .45 * ign) * (1 + .03 * Math.sin(t * 1.3)) };
}

// ---------------------------------------------------------------- sky (back page)
function skyLayer() {
  return once('c04sky', () => {
    const [c, g] = canvas(PW, PH), gr = g.createLinearGradient(0, 0, 0, PH);
    gr.addColorStop(0, '#2b2a62'); gr.addColorStop(.3, '#5b4482'); gr.addColorStop(.55, '#b4708a'); gr.addColorStop(.74, '#f0a07f'); gr.addColorStop(.88, '#ffc990'); gr.addColorStop(1, '#ffe2b2');
    g.fillStyle = gr; g.fillRect(0, 0, PW, PH);
    // engraved sky: fine horizontal ruling, denser toward the top (intaglio)
    g.strokeStyle = 'rgba(20,16,50,.16)'; g.lineWidth = .8;
    for (let y = 2; y < PH * .62; y += 4.2) { g.globalAlpha = 1 - y / (PH * .62); g.beginPath(); for (let x = 0; x <= PW; x += 8) { const yy = y + Math.sin(x * .012 + y * .05) * .8; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.globalAlpha = 1;
    // warm halo low around the sun's column, stippled
    const [hc, hg] = canvas(PW, PH), hr = hg.createRadialGradient(PW / 2 + SUNX, PH * .62, 0, PW / 2 + SUNX, PH * .62, PW * .55);
    hr.addColorStop(0, 'rgba(255,214,150,.75)'); hr.addColorStop(.4, 'rgba(255,170,110,.3)'); hr.addColorStop(1, 'rgba(255,170,110,0)'); hg.fillStyle = hr; hg.fillRect(0, 0, PW, PH);
    stipple(hc, { k: .7, g: 1, seed: 33, boost: 2 }); g.globalCompositeOperation = 'lighter'; g.drawImage(hc, 0, 0);
    return c;
  });
}
const CLOUDW = [];
function cloud(i) {
  return once('c04cloud' + i, () => {
    const r = prng(70 + i), w = Math.round(420 + r() * 260), h = 34, [c, g] = canvas(w, h); CLOUDW[i] = w;
    for (let k = 0; k < 3; k++) {
      const y = 8 + k * 8, x0 = r() * 60, x1 = w - r() * 80, gr = g.createLinearGradient(0, y - 4, 0, y + 5);
      gr.addColorStop(0, 'rgba(120,80,130,.55)'); gr.addColorStop(.7, 'rgba(255,190,150,.65)'); gr.addColorStop(1, 'rgba(255,220,180,.0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x0 + 6, y - 3); g.lineTo(x1 - 6, y - 3); g.quadraticCurveTo(x1, y, x1 - 6, y + 4); g.lineTo(x0 + 6, y + 4); g.quadraticCurveTo(x0, y, x0 + 6, y - 3); g.fill();
    }
    stipple(c, { k: .6, g: 1, seed: 90 + i, boost: 1.8 }); return c;
  });
}
const CLOUDS = [{ i: 0, x: -380, y: -205, v: 5 }, { i: 1, x: 120, y: -158, v: 7 }, { i: 2, x: -150, y: -95, v: 9 }, { i: 3, x: 260, y: -232, v: 4 }];
function rays(ctx, x, y, t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 16; i++) {
    const ang = Math.PI + (i + .5) / 16 * Math.PI + .03 * Math.sin(t * .2 + i), wd = .035 + .02 * Math.sin(i * 2.7), L = 900;
    const g = ctx.createRadialGradient(x, y, 30, x, y, L); g.addColorStop(0, `rgba(255,220,170,${.11 * a})`); g.addColorStop(1, 'rgba(255,220,170,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang - wd) * L, y + Math.sin(ang - wd) * L); ctx.lineTo(x + Math.cos(ang + wd) * L, y + Math.sin(ang + wd) * L); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function birds(ctx, t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.strokeStyle = rgba('#2a1d3a', .8 * a); ctx.lineWidth = 2; ctx.lineCap = 'round';
  const B = [[0, -120, 0], [26, -132, 1.3], [48, -114, 2.1], [70, -140, .7], [-30, -104, 2.8]];
  for (const [dx, dy, ph] of B) {
    const x = 380 - (t * 22) % 1300 + dx, y = dy + Math.sin(t * .7 + ph) * 4, f = Math.sin(t * 7 + ph * 3) * 5;
    ctx.beginPath(); ctx.moveTo(x - 8, y - f * .6); ctx.quadraticCurveTo(x - 3, y - 2, x, y + 1); ctx.quadraticCurveTo(x + 3, y - 2, x + 8, y - f * .6); ctx.stroke();
  }
  ctx.restore();
}
// the back page's engraved border (cream, faint): it is still the plate
const pageBorder = () => once('c04pageBorder', () => {
  const [c, g] = canvas(PW * 2, PH * 2); g.scale(2, 2);
  gBorder(g, 18, 18, PW - 36, PH - 36, { band: 24, lines: 7, waves: 96, col: '#ffe9c8', a: .5, w: .8, radius: 10 }); return c;
});

// ---------------------------------------------------------------- pop-up pieces (cached paper cutouts, base at y = 0)
const n1 = (x, s) => Math.sin(x * .0061 + s) * .55 + Math.sin(x * .0173 + s * 2.1) * .3 + Math.sin(x * .049 + s * 3.3) * .15;
function tree(g, x, y, s, kind, col, r) {
  g.fillStyle = col;
  if (kind === 0) { g.beginPath(); g.ellipse(x, y - 34 * s, 7 * s, 36 * s, 0, 0, TAU); g.fill(); g.fillRect(x - 1.2 * s, y - 4 * s, 2.4 * s, 6 * s); }
  else { g.fillRect(x - 2 * s, y - 22 * s, 4 * s, 24 * s); for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + (r() - .5) * 22 * s, y - 30 * s - r() * 16 * s, (9 + r() * 7) * s, 0, TAU); g.fill(); } }
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,190,130,.4)'; g.lineWidth = 1.2; g.beginPath();
  if (kind === 0) g.ellipse(x, y - 34 * s, 7 * s, 36 * s, 0, -Math.PI * .95, -Math.PI * .05); else g.arc(x, y - 38 * s, 12 * s, -Math.PI * .9, -Math.PI * .2);
  g.stroke(); g.restore();
}
const H0 = (x) => Math.max(70, 150 + 42 * n1(x, 1) - 80 * Math.exp(-Math.pow((x - SUNX) / 150, 2)));
const H1 = (x) => 88 + 26 * n1(x, 4) - 30 * Math.exp(-Math.pow((x - SUNX + 20) / 120, 2));
const H2 = (x) => 52 + 9 * n1(x, 7);
const H3 = (x) => 34 + 7 * n1(x, 9);
const PIECES = [
  { d: .02, w: 1000, h: 240, hgt: H0, top: '#d9a1a2', bot: '#9a7096', key: 'p0', fog: true },
  { d: .26, w: 1040, h: 180, hgt: H1, top: '#83557a', bot: '#4e3558', key: 'p1', trees: [[-430, 0], [-390, 1], [-300, 0], [-280, 0], [-170, 1], [-150, 0], [190, 0], [240, 1], [330, 0], [350, 0], [420, 1]] },
  { d: .5, w: 1080, h: 120, hgt: H2, top: '#4d3259', bot: '#2c1e3c', key: 'p2' },
  { d: .74, w: 1120, h: 210, hgt: H3, top: '#2c1d36', bot: '#170f20', key: 'p3', bigTree: true },
];
const PAD = 4;
function pieceImg(P) {
  return once('c04piece' + P.key, () => {
    const { w, h, hgt, top, bot, key } = P, rimK = P.d < .1 ? 1 : .75, [c, g] = canvas(w + PAD * 2, h + PAD), ox = w / 2 + PAD;
    const path = () => { g.beginPath(); g.moveTo(PAD, h); for (let x = -w / 2; x <= w / 2; x += 4) g.lineTo(ox + x, h - hgt(x)); g.lineTo(ox + w / 2, h); g.closePath(); };
    const gr = g.createLinearGradient(0, h - 240, 0, h); gr.addColorStop(0, top); gr.addColorStop(1, bot); path(); g.fillStyle = gr; g.fill();
    g.save(); g.translate(ox, h); pieceExtra(g, P); g.restore();
    // intaglio hatching in the shade, clipped to the piece
    g.save(); path(); g.clip(); artHatch(g, [0, 0, w + PAD * 2, h], { angle: -.75, gap: 6, w: .8, col: '#120a1c', a: .22, seed: key.length * 7 }); g.restore();
    // backlit rim along the top edge, strongest toward the sun
    g.save(); g.globalCompositeOperation = 'lighter'; g.lineWidth = 2.2; g.lineJoin = 'round';
    for (let x = -w / 2; x < w / 2; x += 4) { const k = Math.exp(-Math.pow((x - SUNX) / 330, 2)) * rimK; g.strokeStyle = `rgba(255,196,130,${.15 + .6 * k})`; g.beginPath(); g.moveTo(ox + x, h - hgt(x) + 1); g.lineTo(ox + x + 4, h - hgt(x + 4) + 1); g.stroke(); }
    g.restore();
    stipple(c, { k: .45, g: 1, seed: key.length * 13, mid: false, boost: 1.3 });
    // the cut paper edge (cream hairline) shows on the silhouette
    g.strokeStyle = 'rgba(255,236,205,.35)'; g.lineWidth = 1; g.beginPath(); for (let x = -w / 2; x <= w / 2; x += 4) { const y = h - hgt(x); x === -w / 2 ? g.moveTo(ox + x, y) : g.lineTo(ox + x, y); } g.stroke();
    return c;
  });
}
function pieceExtra(g, P) {
  const r = prng(P.key.length * 31 + 7);
  if (P.trees) for (const [x, k] of P.trees) tree(g, x, -P.hgt(x) + 3, .8 + r() * .5, k, '#3e2848', r);
  if (P.bigTree) { // a broad old tree on the shore, left: trunk, limbs, a domed canopy of leaf clumps, backlit rim
    const x = -430, y = -P.hgt(x) + 2, col = '#1d1327'; g.fillStyle = col;
    g.beginPath(); g.moveTo(x - 9, y); g.quadraticCurveTo(x - 3, y - 50, x - 14, y - 92); g.lineTo(x + 2, y - 96); g.quadraticCurveTo(x + 6, y - 50, x + 11, y); g.fill();
    g.strokeStyle = col; g.lineCap = 'round'; for (const [ex, ey, w] of [[-50, -120, 5], [40, -125, 5], [-10, -150, 4]]) { g.lineWidth = w; g.beginPath(); g.moveTo(x - 4, y - 80); g.quadraticCurveTo(x + ex * .4, y - 110, x + ex, y + ey); g.stroke(); }
    const cl = []; for (let k = 0; k < 46; k++) { const a = Math.PI * (1.05 + r() * .9), d = Math.sqrt(r()); cl.push([x + Math.cos(a) * 78 * d, y - 112 + Math.sin(a) * 58 * d, 9 + r() * 9]); }
    for (const [cx, cy, rr] of cl) { g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.fill(); }
    g.save(); g.globalCompositeOperation = 'lighter'; g.lineWidth = 1.3;
    for (const [cx, cy, rr] of cl) { if (cx < x - 10 || cy > y - 120) continue; g.strokeStyle = 'rgba(255,186,120,.35)'; g.beginPath(); g.arc(cx, cy, rr, -Math.PI * .85, -Math.PI * .25); g.stroke(); }
    g.restore();
  }
}

// ---------------------------------------------------------------- live props and people
function easel(ctx, x, y, t) {
  ctx.strokeStyle = '#2d2036'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x, y - 46); ctx.lineTo(x + 9, y); ctx.moveTo(x, y - 46); ctx.lineTo(x + 3, y); ctx.stroke();
  ctx.fillStyle = '#f3e3c4'; ctx.fillRect(x - 15, y - 50, 30, 24);
  const g = ctx.createLinearGradient(0, y - 50, 0, y - 26); g.addColorStop(0, '#f2a27c'); g.addColorStop(1, '#ffd9a0'); ctx.fillStyle = g; ctx.fillRect(x - 13, y - 48, 26, 20);
  ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.arc(x + 3, y - 34, 4 * clamp(.4 + (t % 6) / 6), 0, TAU); ctx.fill();
  ctx.fillStyle = '#7a5276'; ctx.beginPath(); ctx.moveTo(x - 13, y - 28); ctx.quadraticCurveTo(x - 2, y - 36, x + 13, y - 30); ctx.lineTo(x + 13, y - 28); ctx.closePath(); ctx.fill();
}
function hull(ctx, x, y) {
  ctx.strokeStyle = '#22182b'; ctx.lineWidth = 2.4; for (const dx of [-30, 30]) { ctx.beginPath(); ctx.moveTo(x + dx - 7, y); ctx.lineTo(x + dx, y - 16); ctx.lineTo(x + dx + 7, y); ctx.stroke(); }
  ctx.fillStyle = '#3a2836'; ctx.beginPath(); ctx.moveTo(x - 62, y - 30); ctx.quadraticCurveTo(x - 30, y - 12, x + 10, y - 13); ctx.quadraticCurveTo(x + 50, y - 15, x + 66, y - 36); ctx.lineTo(x + 62, y - 28); ctx.quadraticCurveTo(x + 40, y - 22, x, y - 22); ctx.quadraticCurveTo(x - 36, y - 22, x - 62, y - 30); ctx.fill();
  ctx.fillRect(x - 46, y - 18, 92, 3);
  ctx.strokeStyle = '#3a2836'; ctx.lineWidth = 2;
  for (let k = -4; k <= 4; k++) { const xx = x + k * 13, top = y - 40 - Math.abs(k) * 1.2; ctx.beginPath(); ctx.moveTo(xx, y - 18); ctx.quadraticCurveTo(xx + 2, y - 30, xx, top); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x - 64, y - 34); ctx.quadraticCurveTo(x, y - 44, x + 68, y - 40); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,190,130,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 64, y - 35); ctx.quadraticCurveTo(x, y - 45, x + 68, y - 41); ctx.stroke(); ctx.restore();
}
const SIL = '#22172c', RIM = '#ffbf80';
export const GARDENER = { x: 140, s: .5 };
function people(ctx, t, P, life, K) {
  // P = piece descriptor; draws the figures standing on its ridge (piece coordinates)
  const lv = (k) => clamp(life * 1.4 - k * .12);
  if (P.key === 'p2') {
    // painter at the easel (left), facing right
    { const x = -350, y = -P.hgt(x), s = .42, br = Math.sin(t * 3.1) * lv(0);
      ctx.save(); ctx.translate(x + 38, y); ctx.scale(1.3, 1.3); easel(ctx, 0, 0, t); ctx.restore();
      figureFlat(ctx, x, y - 88 * s, s, { sh: [1.15 + .18 * br, .35], el: [.25 + .12 * br, .5], lean: .05, head: .1 }, { t, seed: 3, col: SIL, rim: RIM, rimSide: 1, fast: true, shadow: false }); }
    // an adult teaching a child: points at the sun, the child follows the arm
    { const x = -95, y = -P.hgt(x), s = .42, up = sm(lv(1));
      figureFlat(ctx, x, y - 88 * s, s, { sh: [mix(.4, 2.35, up) + .04 * Math.sin(t * 1.1), .3], el: [mix(.6, .1, up), .4], head: mix(.1, -.25, up), coat: true }, { t, seed: 5, col: SIL, rim: RIM, rimSide: 1, fast: true, shadow: false });
      const cx = -50, cy = -P.hgt(cx), cu = sm(lv(2.6));
      figureKid(ctx, cx, cy - 49 * s, s, { ...KIDPOSES.stand, sh: [mix(.3, 2.1, cu), .2], el: [mix(.4, .15, cu), .3], head: mix(0, -.35, cu) }, { t, seed: 2, dress: { top: SIL, pants: SIL, shoes: SIL, skin: SIL, hair: SIL }, hair: 'pigtails', rim: RIM, shadow: false }); }
  }
  if (P.key === 'p3') {
    // the gardener watering a row of seedlings (centre front, facing the sun)
    gardener(ctx, t, { x: GARDENER.x, y: -P.hgt(GARDENER.x), s: GARDENER.s, live: lv(2), pour0: K.human + .3, seed: 8, col: SIL, rim: RIM, rimSide: -1 });
    // building a boat on the shore: the hammer rises and falls
    const x = 330, y = -P.hgt(x); ctx.save(); ctx.translate(x, y); ctx.scale(1.35, 1.35); hull(ctx, 0, 0); ctx.restore();
    const bx = 438, by = -P.hgt(bx), s = .44, hit = Math.pow(Math.max(0, Math.sin(t * 3.4)), 2) * lv(2);
    figureFlat(ctx, bx, by - 88 * s, s, { sh: [1.3 + .9 * hit, .5], el: [.5 - .3 * hit, .7], lean: .1, head: .15 }, { t, seed: 11, col: SIL, rim: RIM, rimSide: -1, flip: true, fast: true, shadow: false,
      prop: (g, A) => { g.save(); g.translate(A.hx, A.hy); g.rotate(-(A.ang) + Math.PI / 2); g.fillStyle = SIL; g.fillRect(-1.5, -2, 3, 22); g.fillRect(-6, 16, 12, 6); g.restore(); } });
  }
}
function grass(ctx, t, x0, x1, y, h, seed) {
  const r = prng(seed); ctx.save(); ctx.lineCap = 'round';
  for (let x = x0; x < x1; x += 3.2) {
    const hh = h * (.35 + r() * .65) * (1 - Math.pow(Math.abs((x - (x0 + x1) / 2) / ((x1 - x0) / 2)), 3) * .6), sw = Math.sin(t * 1.2 + x * .02) * 6 + Math.sin(t * 2.3 + x * .07) * 2;
    ctx.strokeStyle = r() < .2 ? 'rgba(80,52,62,.95)' : '#1a1222'; ctx.lineWidth = 1.2 + r() * 1.6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * .3, y - hh * .5, x + sw, y - hh); ctx.stroke();
    if (r() < .08) { ctx.fillStyle = r() < .5 ? '#f0b07a' : '#e7d6b4'; ctx.beginPath(); ctx.arc(x + sw, y - hh, 2.4, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the pieces on the floor (or rising at the hinge behind the cover)
function pieces(ctx, t, K, dy) {
  const F = Math.max(0, dy) / DEPTH, by = (d) => FB + Math.max(0, dy) * d;
  PIECES.forEach((Pc, i) => {
    const u = lin(K.rise + i * .14, K.rise + i * .14 + .6, t); if (u <= 0) return;
    const hu = backOut(u), sy = Math.sin(Math.min(1.05, hu) * Math.PI / 2) * (hu > 1 ? hu : 1), b = by(Pc.d), sc = 1 + .1 * Pc.d * F, img = pieceImg(Pc);
    ctx.save(); ctx.translate(0, b); ctx.scale(sc, 1);
    const sh = ctx.createLinearGradient(0, 0, 0, 26); sh.addColorStop(0, 'rgba(10,5,18,.45)'); sh.addColorStop(1, 'rgba(10,5,18,0)'); ctx.fillStyle = sh; ctx.fillRect(-Pc.w / 2, 0, Pc.w, 26 * sm(u) * F);
    ctx.scale(1, sy); ctx.drawImage(img, -(Pc.w / 2 + PAD), -Pc.h);
    if (u < .6) { ctx.fillStyle = `rgba(255,236,205,${.6 * (1 - u / .6)})`; ctx.fillRect(-Pc.w / 2, -2, Pc.w, 2); }
    people(ctx, t, Pc, lin(K.human, K.human + 1.6, t), K);
    ctx.restore();
    if (Pc.fog) { // a band of valley fog behind the next piece
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fy = b - 40, g = ctx.createLinearGradient(0, fy - 40, 0, fy + 40); g.addColorStop(0, 'rgba(255,200,170,0)'); g.addColorStop(.5, `rgba(255,200,170,${.16 * sm(u)})`); g.addColorStop(1, 'rgba(255,200,170,0)');
      ctx.fillStyle = g; ctx.fillRect(-PW / 2 - 40 + 10 * Math.sin(t * .3), fy - 40, PW + 80, 80); ctx.restore();
    }
  });
}
// the open floor page (the cover's inner face): fields in perspective, a river holding the sky, the paper's front edge
function floorPage(ctx, t, dy) {
  const F = dy / DEPTH, FF = FB + dy, hw = (d) => PW / 2 + 70 * d * F, by = (d) => FB + dy * d;
  const g = ctx.createLinearGradient(0, FB, 0, FF + 1); g.addColorStop(0, '#6e4b6c'); g.addColorStop(.45, '#3e2a48'); g.addColorStop(1, '#170f1f');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-hw(0), FB); ctx.lineTo(hw(0), FB); ctx.lineTo(hw(1), FF); ctx.lineTo(-hw(1), FF); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(20,10,30,.25)'; ctx.lineWidth = 1;
  for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(i * 36, FB); ctx.lineTo(i * 36 * (1 + .14 * F), FF); ctx.stroke(); }
  const ry0 = by(.58), ry1 = by(.68), rg = ctx.createLinearGradient(0, ry0, 0, ry1); rg.addColorStop(0, '#ffd2a0'); rg.addColorStop(1, '#d98c7e');
  ctx.fillStyle = rg; ctx.beginPath(); for (let x = -620; x <= 620; x += 20) { const y = ry0 + Math.sin(x * .006 + 1) * 8 * F; x === -620 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  for (let x = 620; x >= -620; x -= 20) ctx.lineTo(x, ry1 + Math.sin(x * .006 + 1.4) * 6 * F); ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 9; k++) { const y = mix(ry0 + 3, ry1 - 2, k / 8), w = (40 - k * 3 + 6 * Math.sin(t * 2 + k)) * F; ctx.fillStyle = `rgba(255,240,210,${.5 - k * .04})`; ctx.fillRect(SUNX - w / 2 + 3 * Math.sin(t * 1.5 + k * 1.7), y, w, 1.6 * F); }
  ctx.restore();
  // paper thickness of the front edge (the cover's free edge) and its shadow
  ctx.fillStyle = '#e9dcc2'; ctx.fillRect(-hw(1), FF - 1, hw(1) * 2, 3); ctx.fillStyle = 'rgba(4,3,10,.5)'; ctx.fillRect(-hw(1), FF + 2, hw(1) * 2, 8 * F);
}
// the cover's printed face, falling toward us about the hinge (squashed in projection) and turning away from the room's light
function coverFace(ctx, t, dy, o) {
  const k = -dy / PH; if (k <= 0) return;
  ctx.save(); ctx.translate(0, FB); ctx.scale(1, k); ctx.translate(0, -FB);
  plate(ctx, t, o);
  const dark = (1 - k) * .6; if (dark > .004) { ctx.fillStyle = rgba('#0c0814', dark); ctx.fillRect(-PW / 2, -PH / 2, PW, PH); }
  ctx.restore();
  if (k < 1) { ctx.fillStyle = '#efe2c8'; ctx.fillRect(-PW / 2, FB + dy - 1, PW, 2); }   // the free edge: the paper's thickness
}

// ---------------------------------------------------------------- the whole book
export function popup(ctx, t, K, o = {}) {
  const { th, dy } = foldAt(t, K), S = sunAt(t, K);
  if (th <= 0 && t < K.gather) { plate(ctx, t, o.cover); return { sunY: S.y }; }   // closed: the cover is the plate
  // 1 · the back page: the dawn sky with the sun (the sun and its halo are drawn in screen space by the camera's numbers)
  if (th > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(-PW / 2, -PH / 2, PW, PH); ctx.clip();
    ctx.drawImage(skyLayer(), -PW / 2, -PH / 2, PW, PH);
    for (const C of CLOUDS) { const c = cloud(C.i), w = c.width, x = C.x + (t - K.fold0) * C.v; ctx.drawImage(c, x - w / 2, C.y); }
    const sun = o.sun;
    if (sun && S.g > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); sunHalo(ctx, t, sun.x, sun.y, sun.R, S.g); ctx.restore();
      rays(ctx, S.x, S.y, t, S.rays);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); sunDisc(ctx, t, sun.x, sun.y, sun.r, sun.m); ctx.restore();
    }
    birds(ctx, t, sm(lin(K.human, K.human + 1.2, t)));
    ctx.restore();
    ctx.save(); ctx.globalAlpha = .55; ctx.drawImage(pageBorder(), -PW / 2, -PH / 2, PW, PH); ctx.restore();
  }
  // 2 · the cover still above edge-on: the pieces already rising at the hinge behind it, then the falling printed face
  if (dy < 0) { pieces(ctx, t, K, dy); coverFace(ctx, t, dy, o.cover); }
  else {   // 3 · open: the floor page, the landscape standing on it, foreground grass
    floorPage(ctx, t, dy); pieces(ctx, t, K, dy);
    const gu = backOut(lin(K.rise + .62, K.rise + 1.2, t)), hw1 = PW / 2 + 70 * dy / DEPTH;
    if (gu > 0) { ctx.save(); ctx.translate(0, FB + dy * .97); ctx.scale(1, Math.max(0, gu)); grass(ctx, t, -hw1 + 4, -300, 0, 110, 5); grass(ctx, t, 520, hw1 - 4, 0, 120, 6); ctx.restore(); }
  }
  // 4 · the light points of HAVING TO leave the paper (just before the cover moves) and gather into the sun
  const P = holePts(), sp = glowSprite('#ffb35c', 9), ga = clamp((o.cover.glow ?? 1) * (.88 + .12 * Math.sin(t * 1.7)));
  if (t >= K.gather && ga > 0) {
    const kc = Math.max(0, -dy / PH);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [x, y] of P) {
      const q = (x + 330) / 660, t0 = K.gather + q * .3, u = eio(lin(t0, t0 + .62, t)); if (u >= 1) continue;
      const yy = u > 0 ? FB + (y - FB) * Math.max(0, -foldAt(t0, K).dy / PH) : FB + (y - FB) * kc;   // still on the (falling) paper until it leaves
      const cx = mix(x, SUNX, .5), cy = Math.min(yy, S.y) - 120 - 60 * Math.sin(q * 3), px = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * cx + u * u * SUNX, py = (1 - u) * (1 - u) * yy + 2 * (1 - u) * u * cy + u * u * S.y;
      const k = mix(1, .5, u); ctx.globalAlpha = ga; ctx.drawImage(sp, px - 9 * k, py - 9 * k, 18 * k, 18 * k); ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.arc(px, py, 1.7 * k, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  return { sunY: S.y };
}
export function warmPopup() { skyLayer(); for (const C of CLOUDS) cloud(C.i); pageBorder(); for (const P of PIECES) pieceImg(P); glowSprite('#ffb35c', 9); holePts(); }
