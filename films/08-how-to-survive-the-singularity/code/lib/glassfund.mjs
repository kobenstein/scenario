// The sealed glass fund with a label and the embossed seal "fixed rule", owner C6 (4.07, 4.08); also used by C7 (5.04, 5.05) and C9 (6.17, 6.19).
// A tall glass jar on an engraved stone plinth, a brass lid with a one-way slot, an embossed foil seal across the lid seam (the rule
// nobody can lift), a paper label with a guilloche edge. Glass in the print look: the scene shows through a pale tint, a broad soft
// highlight and a sharp one, bright rims, refraction hairlines; the shares inside are small engraved certificates that stack up and
// glow. Ghost mode = the same object as dotted engraving (it does not exist yet); a burin pass engraves it solid.
//
//   glassFund(ctx, x, y, s, t, o) → { top: { x, y } (the slot in the lid), out: { x, y } (where the pipes leave), lid: { x, y, r },
//                                    seal: { x, y, r }, inside: { x, y, w, h } (screen box of the glass interior), label: { x, y } }
//     x, y = base centre (the plinth's foot), s = 1 → about 420 × 520 px.  o: {
//       fill .5        0..1 shares inside (a stack that grows from the bottom; each new share settles with a tiny bounce)
//       seal 1         0..1 the foil seal: 0 absent, .5–.85 it presses down, 1 pressed (tiny rebound), embossed
//       label 'fund'   main label line (Instrument Serif), sub 'fixed rule' (caps line), note null (tiny line, e.g. 'our plan')
//       ghost 0        0..1 dotted engraving only (does not exist yet); burin null | 0..1 engraves the ghost solid (glass fades in)
//       glow 0         0..1 warm light inside (the shares glow)
//       pipes 0        0..1 outlet lines leave the plinth to the right (6.19), drawn on from the fund outward
//       rattle 0       px: the lid jiggles (a hand tries it), the seal holds
//       tilt 0         rad, the jar leans a little (a knock)
//       lidA 1         alpha of the lid, seal and slot (0 = an open jar)
//       inner(ctx, box) optional: draw your own contents inside the glass (box = interior in jar units), before the front glass
//       bg null        colour behind the jar (tints the glass a touch), a 1
//     }
import { rgba, clamp, mix, lin, sm, eout, eio, prng, canvas, text } from '../engine.mjs';
import { roughPath, stipple } from './art.mjs';
import { Path2D } from '@napi-rs/canvas';
import { microRing, gBorder, rosette, foilGlint, guilloche } from './certificate.mjs';
import { ghostPaths } from './ghost.mjs';

const TAU = Math.PI * 2;
// copy of certificate.mjs seal() with one fix: the foil stipple layer is built with an identity transform (putImageData honours
// the transform, so the original lands shifted by half the seal). Cached per radius (rounded), live glint.
const SEALS = new Map();
const FOILS = ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'];
export function foilSeal(ctx, x, y, r, t, o = {}) {
  r = Math.max(4, Math.round(r)); const scal = o.scallops ?? 36, pad = r * .3, S = Math.ceil((r + pad) * 2), key = r + '|' + (o.label || '') + '|' + scal;
  const edge = (g, rr) => { g.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, q = rr * (1 + .035 * Math.cos(scal * a)); i ? g.lineTo(Math.cos(a) * q, Math.sin(a) * q) : g.moveTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); };
  if (!SEALS.has(key)) {
    const [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    g.save(); g.translate(-r * .025, -r * .025); edge(g, r); g.fillStyle = '#ffe9c0'; g.fill(); g.restore();
    g.save(); g.translate(r * .035, r * .04); edge(g, r); g.fillStyle = 'rgba(70,30,8,.85)'; g.fill(); g.restore();
    edge(g, r); const fg = g.createLinearGradient(-r, -r, r, r); FOILS.forEach((cc, k) => fg.addColorStop(k / (FOILS.length - 1), cc)); g.fillStyle = fg; g.fill();
    g.strokeStyle = 'rgba(90,40,10,.75)'; g.lineWidth = Math.max(.8, r * .012); for (const q of [.9, .72, .7]) { g.beginPath(); g.arc(0, 0, r * q, 0, TAU); g.stroke(); }
    microRing(g, 0, 0, r * .81, o.label || 'FIXED RULE', { size: Math.max(5, r * .085), col: '#5a2a08', a: .8 });
    const Gq = guilloche({ R: r * .42, A: r * .12, B: r * .05, n: 12, m: 5, lines: 18 }); g.lineWidth = Math.max(.5, r * .007); g.strokeStyle = 'rgba(90,40,10,.45)';
    for (let k = 0; k < Gq.lines; k++) { const P = Gq.line(k); g.beginPath(); P.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.stroke(); }
    const [nc, nx] = canvas(S, S); nx.translate(S / 2, S / 2); edge(nx, r); nx.fillStyle = 'rgba(255,240,200,.35)'; nx.fill(); nx.setTransform(1, 0, 0, 1, 0, 0);
    stipple(nc, { k: 1, g: 1.4, seed: 5, mid: false, boost: 1.4 });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0); g.restore();
    SEALS.set(key, c);
  }
  const c = SEALS.get(key);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.drawImage(c, -S / 2, -S / 2);
  const p = new Path2D(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, q = r * (1 + .035 * Math.cos(scal * a)); i ? p.lineTo(Math.cos(a) * q, Math.sin(a) * q) : p.moveTo(Math.cos(a) * q, Math.sin(a) * q); } p.closePath();
  foilGlint(ctx, p, t, { x: -r * 1.6, y: 0, span: r * 3.2, width: r * .5, speed: o.glintSpeed ?? .18, phase: o.glintPhase ?? 0, a: o.glintA ?? 1 });
  ctx.restore();
}
const G = { pw: 190, ph: 42, bw: 148, bot: -46, top: -418, nk: 96, neck: -452, lid: -474, lidR: 108, lidH: 24, ry: .16 };   // jar units
const INK = '#24384f';
const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

// jar outline (profile) as points, right side from bottom to the lid; mirrored for the left
function profile() {
  return once('prof', () => {
    const P = [];
    P.push([G.bw, G.bot]); P.push([G.bw, G.top + 34]);
    for (let k = 1; k <= 10; k++) { const a = k / 10 * Math.PI / 2; P.push([mix(G.nk, G.bw, Math.cos(a)) + (G.bw - G.nk) * 0 , G.top + 34 - Math.sin(a) * 34]); }
    P.push([G.nk, G.top]); P.push([G.nk, G.neck]);
    return P;
  });
}
function bodyPath(ctx, inset = 0) {
  const P = profile(); ctx.beginPath();
  P.forEach(([x, y], i) => (i ? ctx.lineTo(x - inset, y) : ctx.moveTo(x - inset, y)));
  ctx.ellipse(0, G.neck, G.nk - inset, G.nk * G.ry, 0, 0, Math.PI, true);
  for (let i = P.length - 1; i >= 0; i--) ctx.lineTo(-P[i][0] + inset, P[i][1]);
  ctx.ellipse(0, G.bot, G.bw - inset, G.bw * G.ry, 0, Math.PI, 0, true);
  ctx.closePath();
}
// the ghost structure as polylines (jar units)
function ghostLines() {
  return once('ghost', () => {
    const L = [], P = profile(), ell = (cx, cy, rx, ry, a0 = 0, a1 = TAU, n = 90) => { const o = []; for (let i = 0; i <= n; i++) { const a = mix(a0, a1, i / n); o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
    L.push(P.map(([x, y]) => [x, y])); L.push(P.map(([x, y]) => [-x, y]));
    L.push(ell(0, G.bot, G.bw, G.bw * G.ry, 0, Math.PI)); L.push(ell(0, G.neck, G.nk, G.nk * G.ry));
    L.push(ell(0, G.lid, G.lidR, G.lidR * G.ry)); L.push(ell(0, G.lid + G.lidH, G.lidR, G.lidR * G.ry, 0, Math.PI));
    L.push([[-G.lidR, G.lid], [-G.lidR, G.lid + G.lidH]]); L.push([[G.lidR, G.lid], [G.lidR, G.lid + G.lidH]]);
    L.push(ell(0, -G.ph, G.pw, G.pw * G.ry)); L.push(ell(0, 0, G.pw, G.pw * G.ry, 0, Math.PI)); L.push([[-G.pw, -G.ph], [-G.pw, 0]]); L.push([[G.pw, -G.ph], [G.pw, 0]]);
    L.push([[-62, -262], [62, -262], [62, -178], [-62, -178], [-62, -262]]);   // label
    return L;
  });
}
// a small engraved share (contents), cached
function miniShare() {
  return once('mini', () => {
    const w = 92, h = 60, k = 2, [c, g] = canvas(w * k, h * k); g.scale(k, k);
    g.fillStyle = '#efe4cc'; g.beginPath(); roughPath(g, [[1, 1], [w - 1, 1], [w - 1, h - 1], [1, h - 1]], { amp: .6, step: 6, seed: 3 }); g.fill();
    gBorder(g, 3, 3, w - 6, h - 6, { band: 7, lines: 4, waves: 60, col: '#28405a', w: .35, a: .8, radius: 4, u: .9999 });
    rosette(g, w / 2, h / 2 - 3, { R: 10, A: 3, B: 1.4, n: 9, m: 4, lines: 12, col: '#8a5a24', w: .35, a: .9 });
    g.fillStyle = 'rgba(40,64,90,.7)'; g.fillRect(w / 2 - 18, h - 15, 36, 1.2);
    return c;
  });
}
function plinthLayer(s) {
  const key = 'plinth' + Math.round(s * 20);
  return once(key, () => {
    const pad = 20, w = (G.pw * 2 + pad * 2) * s, h = (G.ph + G.pw * G.ry * 2 + pad * 2) * s, [c, g] = canvas(Math.ceil(w), Math.ceil(h));
    g.translate(w / 2, h - (G.pw * G.ry + pad) * s); g.scale(s, s);
    // front face: stone with engraved horizontal hatching, a dark lower band
    g.beginPath(); g.moveTo(-G.pw, -G.ph); g.lineTo(-G.pw, 0); g.ellipse(0, 0, G.pw, G.pw * G.ry, 0, Math.PI, 0, true); g.lineTo(G.pw, -G.ph); g.ellipse(0, -G.ph, G.pw, G.pw * G.ry, 0, 0, Math.PI, false); g.closePath();
    const fg = g.createLinearGradient(-G.pw, 0, G.pw, 0); fg.addColorStop(0, '#d9cdb5'); fg.addColorStop(.55, '#b9ab90'); fg.addColorStop(1, '#7d705c'); g.fillStyle = fg; g.fill();
    g.save(); g.clip(); g.strokeStyle = 'rgba(40,30,25,.32)'; g.lineWidth = .7;
    for (let yy = -G.ph + 3; yy < G.pw * G.ry; yy += 3.1) { g.beginPath(); for (let xx = -G.pw; xx <= G.pw; xx += 6) { const q = xx / G.pw, y2 = yy + G.pw * G.ry * Math.sqrt(Math.max(0, 1 - q * q)) * (yy > -G.ph + 6 ? 1 : 0) * .0; xx === -G.pw ? g.moveTo(xx, y2) : g.lineTo(xx, y2); } g.globalAlpha = clamp((yy + G.ph) / (G.ph + 20)) * .9 + .1; g.stroke(); }
    g.globalAlpha = 1; g.restore();
    // top face
    g.beginPath(); g.ellipse(0, -G.ph, G.pw, G.pw * G.ry, 0, 0, TAU); const tg = g.createLinearGradient(-G.pw, -G.ph - 30, G.pw, -G.ph + 30); tg.addColorStop(0, '#f1e8d4'); tg.addColorStop(1, '#c8bba0'); g.fillStyle = tg; g.fill();
    g.strokeStyle = 'rgba(60,45,30,.5)'; g.lineWidth = 1; g.stroke();
    // engraved band on the front: a guilloche frieze
    g.save(); g.beginPath(); g.rect(-G.pw + 14, -G.ph + 12, G.pw * 2 - 28, 16); g.clip(); g.strokeStyle = 'rgba(40,56,79,.55)'; g.lineWidth = .5;
    for (let l = 0; l < 5; l++) { g.beginPath(); for (let k = 0; k <= 300; k++) { const xx = -G.pw + 14 + k / 300 * (G.pw * 2 - 28), yy = -G.ph + 20 + 6 * Math.sin(k * .42 + l * 1.25) * Math.cos(k * .05); k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
    g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .25, g: 1, seed: 4, mid: false, boost: 1 });
    return { c, w, h, oy: h - (G.pw * G.ry + pad) * s };
  });
}

export function glassFund(ctx, x, y, s, t, o = {}) {
  const fill = clamp(o.fill ?? .5), sealU = clamp(o.seal ?? 1), ghost = clamp(o.ghost ?? 0), glow = clamp(o.glow ?? 0), pipes = clamp(o.pipes ?? 0), a = o.a ?? 1;
  const burin = o.burin, solidA = burin != null ? sm(lin(.35, 1, burin)) : 1 - ghost, lidA = o.lidA ?? 1, tilt = o.tilt ?? 0, rattle = o.rattle ?? 0;
  const ct = Math.cos(tilt), st = Math.sin(tilt), J = (px, py) => [x + (px * ct - py * st) * s, y + (px * st + py * ct) * s];
  const out = { top: { x: J(0, G.lid)[0], y: J(0, G.lid)[1] }, out: { x: J(G.pw, -G.ph * .5)[0], y: J(G.pw, -G.ph * .5)[1] }, lid: { x: J(0, G.lid)[0], y: J(0, G.lid)[1], r: G.lidR * s },
    seal: { x: J(0, G.neck - 8)[0], y: J(0, G.neck - 8)[1], r: 40 * s }, inside: (() => { const [ix, iy] = J(-G.bw + 10, G.top + 30); return { x: ix, y: iy, w: (G.bw * 2 - 20) * s, h: (G.bot - G.top - 30) * s }; })(), label: { x: J(0, -220)[0], y: J(0, -220)[1] } };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s);
  // ---- outlet pipes (behind the plinth, leaving to the right), engraved lines drawn on
  if (pipes > 0) {
    ctx.save(); ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) { const yy = -G.ph * .55 + k * 9, L = 900 * eio(pipes); ctx.strokeStyle = rgba('#f3efe2', .8); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(G.pw - 20, yy); ctx.lineTo(G.pw - 20 + L, yy + k * 6); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .25 * glow + .1); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(G.pw - 20, yy); ctx.lineTo(G.pw - 20 + L, yy + k * 6); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; }
    ctx.restore();
  }
  // ---- ghost structure (dotted engraving), or the burin engraving it solid
  if (ghost > 0 || burin != null) {
    ghostPaths(ctx, ghostLines(), { ghost: burin != null ? 1 : ghost, burin: burin ?? null, col: o.ghostCol || '#f3efe2', w: 1.3 / s, a: burin != null ? 1 : clamp(ghost * 1.3), dot: 6 / s, t, tipSize: 14 / s, stagger: .5, tips: 2, glow: burin != null ? '#ffb35c' : null });
  }
  if (solidA > 0) {
    ctx.save(); ctx.globalAlpha = a * solidA;
    // contact shadow + plinth
    { const sg = ctx.createRadialGradient(10, 6, 0, 10, 6, G.pw * 1.35); sg.addColorStop(0, 'rgba(10,6,12,.5)'); sg.addColorStop(1, 'rgba(10,6,12,0)'); ctx.save(); ctx.scale(1, .22); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(10, 6 / .22, G.pw * 1.35, 0, TAU); ctx.fill(); ctx.restore(); }
    { const PL = plinthLayer(s); ctx.save(); ctx.scale(1 / s, 1 / s); ctx.drawImage(PL.c, -PL.w / 2, -PL.oy); ctx.restore(); }
    // back wall of the glass: the far rim and a darker tint
    ctx.save(); bodyPath(ctx); ctx.clip();
    const bg = ctx.createLinearGradient(-G.bw, 0, G.bw, 0); bg.addColorStop(0, 'rgba(191,227,234,.20)'); bg.addColorStop(.35, 'rgba(191,227,234,.07)'); bg.addColorStop(.75, 'rgba(160,200,215,.10)'); bg.addColorStop(1, 'rgba(120,160,180,.26)');
    ctx.fillStyle = bg; ctx.fillRect(-G.bw, G.neck - 40, G.bw * 2, G.bot - G.neck + 80);
    ctx.strokeStyle = 'rgba(230,245,250,.25)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(0, G.bot, G.bw - 6, (G.bw - 6) * G.ry, 0, Math.PI, TAU); ctx.stroke();
    // the warm glow of the shares
    if (glow > 0 || fill > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hgt = mix(40, 340, fill), gg = ctx.createRadialGradient(0, G.bot - hgt * .45, 0, 0, G.bot - hgt * .4, G.bw * 1.3); gg.addColorStop(0, rgba('#ffb35c', .32 * glow + .06 * fill)); gg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = gg; ctx.fillRect(-G.bw, G.top, G.bw * 2, G.bot - G.top); ctx.restore(); }
    // contents: engraved shares stacked, the newest settling
    if (fill > 0) {
      const M = miniShare(), n = Math.round(fill * 26), r = prng(5);
      for (let k = 0; k < n; k++) {
        const row = Math.floor(k / 3), col = k % 3, px = (col - 1) * 74 + (r() - .5) * 26, py = G.bot - 18 - row * 15 - r() * 4, rot = (r() - .5) * .5;
        const fresh = clamp(fill * 26 - k), drop = (1 - eout(clamp(fresh))) * 60;
        ctx.save(); ctx.translate(px, py - drop); ctx.rotate(rot); ctx.scale(1, .62); ctx.globalAlpha = a * solidA * clamp(fresh * 2); ctx.drawImage(M, -46, -30, 92, 60); ctx.restore();
      }
    }
    if (o.inner) { ctx.save(); o.inner(ctx, { x: -G.bw + 8, y: G.top + 30, w: G.bw * 2 - 16, h: G.bot - G.top - 30 }); ctx.restore(); }
    ctx.restore();
    // ---- front glass: tint, highlights, rims, refraction hairlines
    ctx.save(); bodyPath(ctx); ctx.clip();
    ctx.fillStyle = 'rgba(200,232,238,.06)'; ctx.fillRect(-G.bw, G.neck - 40, G.bw * 2, G.bot - G.neck + 80);
    ctx.globalCompositeOperation = 'lighter';
    const hl = ctx.createLinearGradient(-G.bw, 0, G.bw, 0);
    hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(.1, 'rgba(255,250,240,.28)'); hl.addColorStop(.2, 'rgba(255,250,240,.05)'); hl.addColorStop(.3, 'rgba(255,250,240,.16)'); hl.addColorStop(.36, 'rgba(255,255,255,0)');
    hl.addColorStop(.8, 'rgba(255,255,255,0)'); hl.addColorStop(.86, 'rgba(255,246,230,.38)'); hl.addColorStop(.88, 'rgba(255,255,255,0)'); hl.addColorStop(1, 'rgba(255,255,255,.1)');
    ctx.fillStyle = hl; ctx.fillRect(-G.bw, G.neck - 40, G.bw * 2, G.bot - G.neck + 80);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(30,50,60,.16)'; ctx.lineWidth = .8;
    for (let k = 0; k < 7; k++) { const xx = -G.bw + 20 + k * 43; ctx.beginPath(); ctx.moveTo(xx, G.top + 40); ctx.bezierCurveTo(xx + 6, -300, xx - 6, -160, xx + 3, G.bot - 6); ctx.stroke(); }
    ctx.restore();
    // rims: left/right bright edges with an inner dark band (thickness), the front ellipses at bottom and neck
    ctx.save(); ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(20,40,52,.4)'; ctx.lineWidth = 5; bodyPath(ctx, 3); ctx.stroke();
    ctx.strokeStyle = 'rgba(240,250,252,.75)'; ctx.lineWidth = 1.5; bodyPath(ctx); ctx.stroke();
    ctx.strokeStyle = 'rgba(240,250,252,.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(0, G.bot, G.bw, G.bw * G.ry, 0, 0, Math.PI); ctx.stroke();
    ctx.restore();
    // ---- label: cream paper band with a woven edge, wrapped on the cylinder (curved top/bottom)
    {
      const lw = 128, lt = -268, lb = -172, curve = 7;
      ctx.save(); ctx.beginPath(); ctx.moveTo(-lw, lt); ctx.quadraticCurveTo(0, lt + curve, lw, lt); ctx.lineTo(lw, lb); ctx.quadraticCurveTo(0, lb + curve, -lw, lb); ctx.closePath();
      const lg = ctx.createLinearGradient(-lw, 0, lw, 0); lg.addColorStop(0, '#dcd0b6'); lg.addColorStop(.3, '#f6eedb'); lg.addColorStop(.75, '#ecdfc4'); lg.addColorStop(1, '#b6a587'); ctx.fillStyle = lg;
      ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; ctx.fill(); ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.clip();
      ctx.strokeStyle = rgba('#28405a', .7); ctx.lineWidth = .6;
      for (const yy of [lt + 7, lb - 7]) { ctx.beginPath(); for (let k = 0; k <= 120; k++) { const xx = -lw + 8 + k / 120 * (lw * 2 - 16), q = xx / lw; const y2 = yy + curve * (1 - q * q) + 2.4 * Math.sin(k * .9); k ? ctx.lineTo(xx, y2) : ctx.moveTo(xx, y2); } ctx.stroke(); }
      const main = o.label ?? 'fund', sub = o.sub ?? 'fixed rule';
      ctx.font = '34px "Instrument Serif"'; let fs = 34; while (fs > 16 && ctx.measureText(main).width > lw * 1.75) { fs -= 1; ctx.font = `${fs}px "Instrument Serif"`; }
      text(ctx, main, 0, lt + 52 + curve * .7, { size: fs, font: 'Instrument Serif', color: INK, align: 'center' });
      if (sub) text(ctx, sub.toUpperCase(), 0, lt + 74 + curve * .8, { size: 10.5, weight: 600, color: rgba(INK, .85), align: 'center', spacing: 4 });
      if (o.note) text(ctx, o.note.toUpperCase(), 0, lt + 22 + curve * .5, { size: 8, weight: 600, color: rgba('#8a3a2a', .9), align: 'center', spacing: 3 });
      ctx.restore();
    }
    ctx.restore();
  }
  // ---- lid (brass, with the slot), and the foil seal across the seam
  if (lidA > 0 && solidA > 0) {
    ctx.save(); ctx.globalAlpha = a * solidA * lidA;
    const jig = rattle ? rattle * Math.sin(t * 46) : 0, jr = rattle ? rattle * .004 * Math.sin(t * 37 + 1) : 0;
    ctx.save(); ctx.translate(jig, -Math.abs(jig) * .3); ctx.rotate(jr);
    const lidPath = () => { ctx.beginPath(); ctx.moveTo(-G.lidR, G.lid); ctx.lineTo(-G.lidR, G.lid + G.lidH); ctx.ellipse(0, G.lid + G.lidH, G.lidR, G.lidR * G.ry, 0, Math.PI, 0, true); ctx.lineTo(G.lidR, G.lid); ctx.closePath(); };
    lidPath(); const bg = ctx.createLinearGradient(-G.lidR, 0, G.lidR, 0); bg.addColorStop(0, '#5a3a1c'); bg.addColorStop(.2, '#c8924a'); bg.addColorStop(.42, '#f3d39a'); bg.addColorStop(.6, '#a8742f'); bg.addColorStop(1, '#3e2814'); ctx.fillStyle = bg; ctx.fill();
    ctx.save(); lidPath(); ctx.clip(); ctx.strokeStyle = 'rgba(60,35,10,.35)'; ctx.lineWidth = .6; for (let xx = -G.lidR; xx < G.lidR; xx += 3.2) { ctx.beginPath(); ctx.moveTo(xx, G.lid); ctx.lineTo(xx, G.lid + G.lidH + 20); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, G.lid, G.lidR, G.lidR * G.ry, 0, 0, TAU); const tg = ctx.createLinearGradient(-G.lidR, G.lid - 20, G.lidR, G.lid + 20); tg.addColorStop(0, '#f7dfae'); tg.addColorStop(.5, '#c99450'); tg.addColorStop(1, '#6e4a20'); ctx.fillStyle = tg; ctx.fill();
    ctx.strokeStyle = 'rgba(60,35,10,.6)'; ctx.lineWidth = 1; ctx.stroke();
    // the one-way slot
    ctx.fillStyle = '#1a1008'; ctx.beginPath(); ctx.roundRect(-38, G.lid - 3.5, 76, 7, 3.5); ctx.fill(); ctx.strokeStyle = 'rgba(255,230,180,.5)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-36, G.lid + 4); ctx.lineTo(36, G.lid + 4); ctx.stroke();
    ctx.restore();
    // foil seal: presses down across the lid seam
    if (sealU > 0) {
      const press = sm(lin(.45, .85, sealU)), sc = mix(1.35, 1, press) * (1 + .05 * Math.sin(clamp((sealU - .85) / .15) * Math.PI) * (sealU < 1 ? 1 : 0)), sa = sm(lin(0, .45, sealU));
      const sr = Math.round(40 * s / 2) * 2, sx = 0, sy = G.neck - 8;
      ctx.save(); ctx.globalAlpha = a * solidA * lidA * sa; ctx.translate(sx, sy); ctx.scale(sc / s, sc / s);
      ctx.save(); ctx.fillStyle = 'rgba(20,10,4,.35)'; ctx.beginPath(); ctx.ellipse(4 * (1 - press) * 8 + 3, 6 + (1 - press) * 30, sr * 1.02, sr * 1.02, 0, 0, TAU); ctx.fill(); ctx.restore();
      foilSeal(ctx, 0, 0, sr, t, { label: o.sealLabel || 'FIXED RULE · NO BOARD CAN CHANGE IT', glintPhase: .2 });
      text(ctx, 'FIXED', 0, -sr * .02, { size: Math.max(7, sr * .2), weight: 600, color: '#5a2a08', align: 'center', spacing: 1.5 });
      text(ctx, 'RULE', 0, sr * .24, { size: Math.max(7, sr * .2), weight: 600, color: '#5a2a08', align: 'center', spacing: 1.5 });
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
  return out;
}
