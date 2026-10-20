// C04 (Film 4 minute 1) · 4.04 ★ the pop-up dawn: plate II becomes the back page of a pop-up book; its paper turns into the dawn sky
// (revealed from the light of HAVING TO), the pinholes gather into the sun, the floor page folds down and paper landscape pieces stand
// up on it, back to front, with tiny flat silhouettes doing things that matter (painting, teaching a child, gardening, building a boat).
// All coordinates are plate units (origin = plate centre, the card is 1000×560); the caller sets the plate's transform.
//   popup(ctx, t, K)   K: { reveal, gather, fold, rise, human, sunUp, end } (film seconds)
import { rgba, clamp, mix, prng, canvas, sm, eout, eio, lin } from '../engine.mjs';
import { stipple, hatch as artHatch } from './art.mjs';
import { gBorder } from './certificate.mjs';
import { figureFlat, figureKid, KIDPOSES } from './figure.mjs';
import { holePts, glowSprite, PW, PH } from './sc04_m1plate.mjs';

const TAU = Math.PI * 2;
const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const SUNX = 70;
const backOut = (u) => { const c1 = .9, c3 = c1 + 1; u = clamp(u); return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };

// ---------------------------------------------------------------- sky (back page)
function skyLayer() {
  return once('sky', () => {
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
function cloud(i) {
  return once('cloud' + i, () => {
    const r = prng(70 + i), w = 420 + r() * 260, h = 34, [c, g] = canvas(w, h);
    for (let k = 0; k < 3; k++) {
      const y = 8 + k * 8, x0 = r() * 60, x1 = w - r() * 80, gr = g.createLinearGradient(0, y - 4, 0, y + 5);
      gr.addColorStop(0, 'rgba(120,80,130,.55)'); gr.addColorStop(.7, 'rgba(255,190,150,.65)'); gr.addColorStop(1, 'rgba(255,220,180,.0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x0 + 6, y - 3); g.lineTo(x1 - 6, y - 3); g.quadraticCurveTo(x1, y, x1 - 6, y + 4); g.lineTo(x0 + 6, y + 4); g.quadraticCurveTo(x0, y, x0 + 6, y - 3); g.fill();
    }
    stipple(c, { k: .6, g: 1, seed: 90 + i, boost: 1.8 }); return c;
  });
}
const CLOUDS = [{ i: 0, x: -380, y: -205, v: 5 }, { i: 1, x: 120, y: -158, v: 7 }, { i: 2, x: -150, y: -95, v: 9 }, { i: 3, x: 260, y: -232, v: 4 }];
function sunBloom() {
  return once('sunbloom', () => {
    const R = 360, [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R);
    gr.addColorStop(0, 'rgba(255,241,214,.95)'); gr.addColorStop(.12, 'rgba(255,214,150,.7)'); gr.addColorStop(.35, 'rgba(255,170,100,.22)'); gr.addColorStop(1, 'rgba(255,150,90,0)');
    g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .75, g: 1, seed: 12, boost: 2.2 }); return c;
  });
}
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

// ---------------------------------------------------------------- pop-up pieces (cached paper cutouts, base at y = 0)
const n1 = (x, s) => Math.sin(x * .0061 + s) * .55 + Math.sin(x * .0173 + s * 2.1) * .3 + Math.sin(x * .049 + s * 3.3) * .15;
function piece(key, w, h, hgt, top, bot, extra, rimK = 1) {
  return once(key, () => {
    const pad = 4, [c, g] = canvas(w + pad * 2, h + pad), ox = w / 2 + pad;
    const path = () => { g.beginPath(); g.moveTo(pad, h); for (let x = -w / 2; x <= w / 2; x += 4) g.lineTo(ox + x, h - hgt(x)); g.lineTo(ox + w / 2, h); g.closePath(); };
    const gr = g.createLinearGradient(0, h - 240, 0, h); gr.addColorStop(0, top); gr.addColorStop(1, bot); path(); g.fillStyle = gr; g.fill();
    if (extra) { g.save(); g.translate(ox, h); extra(g); g.restore(); }
    // intaglio hatching in the shade, clipped to the piece
    g.save(); path(); g.clip(); artHatch(g, [0, 0, w + pad * 2, h], { angle: -.75, gap: 6, w: .8, col: '#120a1c', a: .22, seed: key.length * 7 }); g.restore();
    // backlit rim along the top edge, strongest toward the sun
    g.save(); g.globalCompositeOperation = 'lighter'; g.lineWidth = 2.2; g.lineJoin = 'round';
    for (let x = -w / 2; x < w / 2; x += 4) { const k = Math.exp(-Math.pow((x - SUNX) / 330, 2)) * rimK; g.strokeStyle = `rgba(255,196,130,${.15 + .6 * k})`; g.beginPath(); g.moveTo(ox + x, h - hgt(x) + 1); g.lineTo(ox + x + 4, h - hgt(x + 4) + 1); g.stroke(); }
    g.restore();
    stipple(c, { k: .45, g: 1, seed: key.length * 13, mid: false, boost: 1.3 });
    // the cut paper edge (cream hairline) shows on the silhouette
    g.strokeStyle = 'rgba(255,236,205,.35)'; g.lineWidth = 1; g.beginPath(); for (let x = -w / 2; x <= w / 2; x += 4) { const y = h - hgt(x); x === -w / 2 ? g.moveTo(ox + x, y) : g.lineTo(ox + x, y); } g.stroke();
    return { c, ox, h };
  });
}
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
function pieceCanvas(P) {
  const extra = (g) => {
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
  };
  return piece(P.key, P.w, P.h, P.hgt, P.top, P.bot, extra, P.d < .1 ? 1 : .75);
}

// ---------------------------------------------------------------- live props
function easel(ctx, x, y, t) {
  ctx.strokeStyle = '#2d2036'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x, y - 46); ctx.lineTo(x + 9, y); ctx.moveTo(x, y - 46); ctx.lineTo(x + 3, y); ctx.stroke();
  ctx.fillStyle = '#f3e3c4'; ctx.fillRect(x - 15, y - 50, 30, 24);
  const g = ctx.createLinearGradient(0, y - 50, 0, y - 26); g.addColorStop(0, '#f2a27c'); g.addColorStop(1, '#ffd9a0'); ctx.fillStyle = g; ctx.fillRect(x - 13, y - 48, 26, 20);
  ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.arc(x + 3, y - 34, 4 * clamp(.4 + (t % 6) / 6), 0, TAU); ctx.fill();
  ctx.fillStyle = '#7a5276'; ctx.beginPath(); ctx.moveTo(x - 13, y - 28); ctx.quadraticCurveTo(x - 2, y - 36, x + 13, y - 30); ctx.lineTo(x + 13, y - 28); ctx.closePath(); ctx.fill();
}
function hull(ctx, x, y) {
  // trestles
  ctx.strokeStyle = '#22182b'; ctx.lineWidth = 2.4; for (const dx of [-30, 30]) { ctx.beginPath(); ctx.moveTo(x + dx - 7, y); ctx.lineTo(x + dx, y - 16); ctx.lineTo(x + dx + 7, y); ctx.stroke(); }
  // the hull: lower planks done, upper ribs still open
  ctx.fillStyle = '#3a2836'; ctx.beginPath(); ctx.moveTo(x - 62, y - 30); ctx.quadraticCurveTo(x - 30, y - 12, x + 10, y - 13); ctx.quadraticCurveTo(x + 50, y - 15, x + 66, y - 36); ctx.lineTo(x + 62, y - 28); ctx.quadraticCurveTo(x + 40, y - 22, x, y - 22); ctx.quadraticCurveTo(x - 36, y - 22, x - 62, y - 30); ctx.fill();
  ctx.fillRect(x - 46, y - 18, 92, 3);
  ctx.strokeStyle = '#3a2836'; ctx.lineWidth = 2;
  for (let k = -4; k <= 4; k++) { const xx = x + k * 13, top = y - 40 - Math.abs(k) * 1.2; ctx.beginPath(); ctx.moveTo(xx, y - 18); ctx.quadraticCurveTo(xx + 2, y - 30, xx, top); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x - 64, y - 34); ctx.quadraticCurveTo(x, y - 44, x + 68, y - 40); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,190,130,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 64, y - 35); ctx.quadraticCurveTo(x, y - 45, x + 68, y - 41); ctx.stroke(); ctx.restore();
}
function sprouts(ctx, x0, y, n, t) {
  ctx.strokeStyle = '#5d8a52'; ctx.fillStyle = '#6fa060'; ctx.lineWidth = 1.4;
  for (let i = 0; i < n; i++) { const x = x0 - i * 11, sw = Math.sin(t * 1.3 + i) * 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sw, y - 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x + sw - 2.5, y - 8, 3, 1.5, -.5, 0, TAU); ctx.ellipse(x + sw + 2.5, y - 8, 3, 1.5, .5, 0, TAU); ctx.fill(); }
}
const SIL = '#22172c', RIM = '#ffbf80';
function people(ctx, t, P, life) {
  // P = piece descriptor; draws the figures standing on its ridge (piece coordinates)
  const lv = (k) => clamp(life * 1.4 - k * .12);
  if (P.key === 'p2') {
    // painter at the easel (left), facing right
    { const x = -350, y = -P.hgt(x), s = .42, br = Math.sin(t * 3.1) * lv(0);
      ctx.save(); ctx.translate(x + 38, y); ctx.scale(1.3, 1.3); easel(ctx, 0, 0, t); ctx.restore();
      figureFlat(ctx, x, y - 88 * s, s, { sh: [1.15 + .18 * br, .35], el: [.25 + .12 * br, .5], lean: .05, head: .1 }, { t, seed: 3, col: SIL, rim: RIM, rimSide: 1, fast: true, shadow: false }); }
    // an adult teaching a child: points at the sun, the child follows the arm
    { const x = -95, y = -P.hgt(x), s = .42, up = eout(lv(1));
      figureFlat(ctx, x, y - 88 * s, s, { sh: [mix(.4, 2.35, up) + .04 * Math.sin(t * 1.1), .3], el: [mix(.6, .1, up), .4], head: mix(.1, -.25, up), coat: true }, { t, seed: 5, col: SIL, rim: RIM, rimSide: 1, fast: true, shadow: false });
      const cx = -50, cy = -P.hgt(cx), cu = eout(lv(2.6));
      figureKid(ctx, cx, cy - 49 * s, s, { ...KIDPOSES.stand, sh: [mix(.3, 2.1, cu), .2], el: [mix(.4, .15, cu), .3], head: mix(0, -.35, cu) }, { t, seed: 2, dress: { top: SIL, pants: SIL, shoes: SIL, skin: SIL, hair: SIL }, hair: 'pigtails', rim: RIM, shadow: false }); }
    // a gardener bending over a row of seedlings (right), facing left
    { const x = 150, y = -P.hgt(x), s = .42, b = Math.sin(t * 1.6) * lv(3);
      sprouts(ctx, x - 34, y, 8, t);
      figureFlat(ctx, x, y - 88 * s, s, { lean: .5 + .05 * b, sh: [.35 + .12 * b, .2], el: [.25, .35], head: .35, hip: [-.12, .02], kn: [.18, .08] }, { t, seed: 8, col: SIL, rim: RIM, rimSide: -1, flip: true, fast: true, shadow: false });
      // water from a can in the front hand
      ctx.save(); ctx.fillStyle = 'rgba(255,220,170,.8)'; for (let k = 0; k < 6; k++) { const q = ((t * 1.8 + k / 6) % 1); ctx.beginPath(); ctx.arc(x - 30 - q * 6, y - 18 + q * 16, 1.1, 0, TAU); ctx.fill(); } ctx.restore(); }
  }
  if (P.key === 'p3') {
    // building a boat on the shore: the hammer rises and falls
    const x = 330, y = -P.hgt(x); ctx.save(); ctx.translate(x, y); ctx.scale(1.35, 1.35); hull(ctx, 0, 0); ctx.restore();
    const bx = 438, by = -P.hgt(bx), s = .44, hit = Math.pow(Math.max(0, Math.sin(t * 3.4)), 2) * lv(2);
    figureFlat(ctx, bx, by - 88 * s, s, { sh: [1.3 + .9 * hit, .5], el: [.5 - .3 * hit, .7], lean: .1, head: .15 }, { t, seed: 11, col: SIL, rim: RIM, rimSide: -1, flip: true, fast: true, shadow: false,
      prop: (g, A) => { g.save(); g.translate(A.hx, A.hy); g.rotate(-(A.ang) + Math.PI / 2); g.fillStyle = SIL; g.fillRect(-1.5, -2, 3, 22); g.fillRect(-6, 16, 12, 6); g.restore(); } });
  }
}
function grass(ctx, t, x0, x1, y, h, seed, a) {
  const r = prng(seed); ctx.save(); ctx.lineCap = 'round';
  for (let x = x0; x < x1; x += 3.2) {
    const hh = h * (.35 + r() * .65) * (1 - Math.pow(Math.abs((x - (x0 + x1) / 2) / ((x1 - x0) / 2)), 3) * .6), sw = Math.sin(t * 1.2 + x * .02) * 6 + Math.sin(t * 2.3 + x * .07) * 2;
    ctx.strokeStyle = r() < .2 ? 'rgba(80,52,62,.95)' : '#1a1222'; ctx.lineWidth = 1.2 + r() * 1.6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * .3, y - hh * .5, x + sw, y - hh); ctx.stroke();
    if (r() < .08) { ctx.fillStyle = r() < .5 ? '#f0b07a' : '#e7d6b4'; ctx.beginPath(); ctx.arc(x + sw, y - hh, 2.4, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the whole pop-up
export function popup(ctx, t, K) {
  const R = eio(lin(K.reveal, K.reveal + .95, t));
  // 1 · the back page turns into the dawn sky, revealed from the light of HAVING TO outward
  const sunUp = eio(lin(K.sunUp, K.end, t)), ign = sm(lin(K.gather + .45, K.gather + .9, t));
  const sunY = mix(150, 62, sunUp) - 22 * ign;
  if (R > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(-PW / 2, -PH / 2, PW, PH); ctx.clip();
    ctx.beginPath(); ctx.arc(0, -6, R * 1250, 0, TAU); ctx.clip();
    ctx.drawImage(skyLayer(), -PW / 2, -PH / 2);
    for (const C of CLOUDS) { const c = cloud(C.i), x = C.x + ((t - K.reveal) * C.v) ; ctx.drawImage(c, x - c.width / 2, C.y); }
    if (ign > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const S = sunBloom(), k = (.55 + .45 * ign) * (1 + .03 * Math.sin(t * 1.3));
      ctx.globalAlpha = ign; ctx.drawImage(S, SUNX - 360 * k, sunY - 360 * k, 720 * k, 720 * k); ctx.restore();
      rays(ctx, SUNX, sunY, t, ign * (.6 + .4 * sunUp));
      const g = ctx.createRadialGradient(SUNX - 8, sunY - 10, 0, SUNX, sunY, 44); g.addColorStop(0, '#fffaf0'); g.addColorStop(.7, '#ffe1a6'); g.addColorStop(1, '#ffc27a');
      ctx.globalAlpha = ign; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(SUNX, sunY, 44 * (.6 + .4 * ign), 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    }
    birds(ctx, t, sm(lin(K.human, K.human + 1.2, t)));
    ctx.restore();
    // the soft front of the reveal
    if (R < 1) { ctx.save(); ctx.beginPath(); ctx.rect(-PW / 2, -PH / 2, PW, PH); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const rr = R * 1250, g = ctx.createRadialGradient(0, -6, Math.max(0, rr - 60), 0, -6, rr + 20);
      g.addColorStop(0, 'rgba(255,200,140,0)'); g.addColorStop(.75, 'rgba(255,200,140,.45)'); g.addColorStop(1, 'rgba(255,200,140,0)'); ctx.fillStyle = g; ctx.fillRect(-PW / 2, -PH / 2, PW, PH); ctx.restore(); }
    // the engraved border stays on the page (cream, faint): it is still the plate
    ctx.save(); ctx.globalAlpha = .55 * R; gBorder(ctx, -PW / 2 + 18, -PH / 2 + 18, PW - 36, PH - 36, { band: 24, lines: 7, waves: 96, col: '#ffe9c8', a: .5, w: .8, radius: 10 }); ctx.restore();
  }
  // 2 · the pinholes of HAVING TO leave the paper and gather into the sun
  const gu0 = K.gather, P = holePts();
  if (t > gu0 && ign < 1) {
    const spr = glowSprite('#ffb35c', 9); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < P.length; i++) {
      const [x, y] = P[i], q = (x + 330) / 660, u = eio(lin(gu0 + q * .3, gu0 + q * .3 + .62, t)); if (u >= 1) continue;
      const cx = mix(x, SUNX, .5), cy = Math.min(y, sunY) - 120 - 60 * Math.sin(q * 3), px = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * cx + u * u * SUNX, py = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * cy + u * u * sunY;
      const k = mix(1, .5, u); ctx.drawImage(spr, px - 9 * k, py - 9 * k, 18 * k, 18 * k); ctx.fillStyle = '#fff1d6'; ctx.fillRect(px - 1, py - 1, 2, 2);
    }
    ctx.restore();
  }
  // 3 · the floor page folds down toward us
  const F = eout(lin(K.fold, K.fold + .75, t)); if (F <= 0) return { sunY };
  const FB = PH / 2, FF = FB + 190 * F, hw = (d) => PW / 2 + 70 * d * F, by = (d) => FB + (FF - FB) * d;
  {
    const g = ctx.createLinearGradient(0, FB, 0, FF + 1); g.addColorStop(0, '#6e4b6c'); g.addColorStop(.45, '#3e2a48'); g.addColorStop(1, '#170f1f');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-hw(0), FB); ctx.lineTo(hw(0), FB); ctx.lineTo(hw(1), FF); ctx.lineTo(-hw(1), FF); ctx.closePath(); ctx.fill();
    // fields in perspective (furrows run toward the back page)
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(20,10,30,.25)'; ctx.lineWidth = 1;
    for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(i * 36, FB); ctx.lineTo(i * 36 * (1 + .14 * F), FF); ctx.stroke(); }
    // the river across the floor, holding the sky
    const ry0 = by(.58), ry1 = by(.68); const rg = ctx.createLinearGradient(0, ry0, 0, ry1); rg.addColorStop(0, '#ffd2a0'); rg.addColorStop(1, '#d98c7e');
    ctx.fillStyle = rg; ctx.beginPath(); for (let x = -620; x <= 620; x += 20) { const y = ry0 + Math.sin(x * .006 + 1) * 8 * F; x === -620 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    for (let x = 620; x >= -620; x -= 20) ctx.lineTo(x, ry1 + Math.sin(x * .006 + 1.4) * 6 * F); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 9; k++) { const y = mix(ry0 + 3, ry1 - 2, k / 8), w = 40 - k * 3 + 6 * Math.sin(t * 2 + k); ctx.fillStyle = `rgba(255,240,210,${.5 - k * .04})`; ctx.fillRect(SUNX - w / 2 + 3 * Math.sin(t * 1.5 + k * 1.7), y, w, 1.6); }
    ctx.restore();
    // paper thickness of the front edge
    ctx.fillStyle = '#e9dcc2'; ctx.fillRect(-hw(1), FF, hw(1) * 2, 3); ctx.fillStyle = 'rgba(4,3,10,.5)'; ctx.fillRect(-hw(1), FF + 3, hw(1) * 2, 8);
  }
  // 4 · the pieces stand up, back to front (hinged at their base), each casting its shadow toward us
  PIECES.forEach((Pc, i) => {
    const u = lin(K.rise + i * .14, K.rise + i * .14 + .6, t); if (u <= 0) return;
    const hu = backOut(u), sy = Math.sin(Math.min(1.05, hu) * Math.PI / 2) * (hu > 1 ? hu : 1), b = by(Pc.d), sc = 1 + .1 * Pc.d * F, pc = pieceCanvas(Pc);
    ctx.save(); ctx.translate(0, b); ctx.scale(sc, 1);
    const sh = ctx.createLinearGradient(0, 0, 0, 26); sh.addColorStop(0, 'rgba(10,5,18,.45)'); sh.addColorStop(1, 'rgba(10,5,18,0)'); ctx.fillStyle = sh; ctx.fillRect(-Pc.w / 2, 0, Pc.w, 26 * sm(u));
    ctx.scale(1, sy); ctx.drawImage(pc.c, -pc.ox, -pc.h);
    if (u < .6) { ctx.fillStyle = `rgba(255,236,205,${.6 * (1 - u / .6)})`; ctx.fillRect(-Pc.w / 2, -2, Pc.w, 2); }
    people(ctx, t, Pc, lin(K.human, K.human + 1.6, t));
    ctx.restore();
    if (Pc.fog) { // a band of valley fog behind the next piece
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fy = b - 40, g = ctx.createLinearGradient(0, fy - 40, 0, fy + 40); g.addColorStop(0, 'rgba(255,200,170,0)'); g.addColorStop(.5, `rgba(255,200,170,${.16 * sm(u)})`); g.addColorStop(1, 'rgba(255,200,170,0)');
      ctx.fillStyle = g; ctx.fillRect(-PW / 2 - 40 + 10 * Math.sin(t * .3), fy - 40, PW + 80, 80); ctx.restore();
    }
  });
  // 5 · foreground grass at both sides, swaying
  const gu = backOut(lin(K.rise + .62, K.rise + 1.2, t));
  if (gu > 0) { ctx.save(); ctx.translate(0, by(.97)); ctx.scale(1, Math.max(0, gu)); grass(ctx, t, -hw(1) + 4, -300, 0, 110, 5, 1); grass(ctx, t, 520, hw(1) - 4, 0, 120, 6, 1); ctx.restore(); }
  return { sunY };
}
