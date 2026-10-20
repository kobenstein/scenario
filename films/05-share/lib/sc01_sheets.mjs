// C1 · the sheets of the hook and §0: plateTake (H.06 + H.07 as one take on the engraving plate), sheetName (0.01),
// rosetteTake (0.03 + 0.03a), muskQuote (0.04, the carrier c01>c02).
//   anthropicSheet(ctx, t, o)  Anthropic's announcement as our typeset card, drawn in sheet units (0..820 × 0..540). Its layout is
//                              copied from C2's anthSheet (lib/sc02_kit.mjs) so it is the same object in 0.05; here the top-right
//                              corner is still whole (perforated) until H.06 tears it off. o: { band 0..1 (shadow over the name),
//                              tear 0..1, punch 0..1 (perforation holes appear), piece: f(ctx) transform for the torn piece, a }
//   MUSK, muskCard(ctx, t, x, y, s, rot, words, o)   Musk's quote card (lib/quote2.mjs quoteCard2, the options C2's muskSheet uses).
import { W, H, rgba, clamp, lin, mix, eout, eio, ein, sm, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { stipple } from './art.mjs';
import { gBorder, guilloche, rosette, microtext, microRing, seal, FOIL } from './certificate.mjs';
import { ghostLine, burinTip } from './ghost.mjs';
import { paperSheet, pen, inkStroke } from './paper.mjs';
import { perforation, tearAway } from './perforate.mjs';
import { quoteCard2 } from './quote2.mjs';
import { shareLight } from './share.mjs';
import { slicePie } from './slice.mjs';
import { outlineLocal, fitTo } from './map.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2, INK = '#1f2a3a';
const eoX = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const bump = (u) => Math.sin(Math.PI * clamp(u));

// ---------- the engraving plate (indigo, fine engraved lines, a raking warm light) ----------
const PW = 3400, PH = 1500, PX0 = -420, PY0 = -260;   // the plate in world units: x −420 … 2980, y −260 … 1240
function plateLayer() {
  return once('plate', () => {
    const [c, g] = canvas(PW, PH);
    const bg = g.createLinearGradient(0, 0, PW, PH); bg.addColorStop(0, '#191a42'); bg.addColorStop(.5, '#14153a'); bg.addColorStop(1, '#0c0c24'); g.fillStyle = bg; g.fillRect(0, 0, PW, PH);
    // engraved hairlines across the plate, slightly waved (the plate is itself an engraving)
    g.strokeStyle = 'rgba(150,160,220,.05)'; g.lineWidth = 1;
    for (let y = 0; y < PH; y += 7) { g.beginPath(); for (let x = 0; x <= PW; x += 40) { const yy = y + Math.sin(x * .004 + y * .02) * 2.2; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    // a raking warm light from the top right and a cool fall-off at the bottom left (lamp over an engraver's plate)
    const lw = g.createRadialGradient(1980, 280, 0, 1980, 280, 1700); lw.addColorStop(0, 'rgba(255,170,100,.16)'); lw.addColorStop(.45, 'rgba(255,150,90,.06)'); lw.addColorStop(1, 'rgba(255,150,90,0)'); g.fillStyle = lw; g.fillRect(0, 0, PW, PH);
    const cw = g.createLinearGradient(0, PH, 900, 300); cw.addColorStop(0, 'rgba(4,4,16,.5)'); cw.addColorStop(1, 'rgba(4,4,16,0)'); g.fillStyle = cw; g.fillRect(0, 0, PW, PH);
    stipple(c, { k: .3, g: 1, seed: 21, mid: false, boost: 1 });
    return c;
  });
}
function glowSprite(R, col, a0) {
  return once('glow' + R + col + a0, () => { const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba(col, a0)); rg.addColorStop(.25, rgba(col, a0 * .4)); rg.addColorStop(.6, rgba(col, a0 * .1)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .35, g: 1.1, seed: 5 }); return c; });
}
function glowAt(ctx, x, y, r, a, col = '#ffb35c') { if (a <= 0) return; const G = glowSprite(400, col, .55); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(G, x - r, y - r, r * 2, r * 2); ctx.restore(); }
function motes(ctx, t, x0, y0, w, h, a, seed = 3) {
  if (a <= 0) return; const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) { const sp = .15 + r() * .4, x = x0 + ((r() * w + t * 9 * sp) % w), y = y0 + r() * h + Math.sin(t * sp + i) * 14; ctx.fillStyle = `rgba(255,220,170,${(.1 + .35 * r()) * a})`; const z = r() < .8 ? 1.4 : 2.4; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}
// camera: world → screen, zoom z around the frame centre, cx/cy = the world point at the frame centre
function view(ctx, cx, cy, z, rot = 0) { ctx.translate(W / 2, H / 2); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function plate(ctx) { ctx.drawImage(plateLayer(), PX0, PY0); }
function vignette(ctx, a = .55) { const vg = ctx.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 1180); vg.addColorStop(0, 'rgba(4,4,14,0)'); vg.addColorStop(1, `rgba(4,4,14,${a})`); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); }

// ---------- Anthropic's sheet (layout copied from C2's anthSheet) ----------
export const AS = { w: 820, h: 540, cut: 92, pad: 60 };
function anthLayer() {
  return once('anthWhole', () => {
    const { w, h, pad } = AS, [c, g] = canvas(w + pad * 2, h + pad * 2); g.translate(pad, pad);
    paperSheet(g, 0, 0, w, h, { seed: 31, shadow: false, light: [w * .25, -h * .3] });
    gBorder(g, 18, 18, w - 36, h - 36, { band: 22, lines: 7, waves: 140, col: '#2a3550', a: .55, w: .7, radius: 10 });
    const ink = INK;
    text(g, 'ANTHROPIC', 70, 92, { size: 19, weight: 700, color: rgba(ink, .85), spacing: 7 });
    text(g, '18 OCT 2026', 70, 122, { size: 14, weight: 600, color: rgba(ink, .55), spacing: 4 });
    text(g, 'Investing in the', 70, 210, { size: 58, font: 'Instrument Serif', color: ink });
    text(g, 'public benefit', 70, 268, { size: 58, font: 'Instrument Serif', color: ink });
    const r = prng(5); g.fillStyle = rgba(ink, .32);
    for (let i = 0; i < 6; i++) { let x = 72; const y = 318 + i * 21, end = i === 5 ? 380 : 470 - r() * 30; while (x < end) { const ww = 14 + r() * 46; g.fillRect(x, y, Math.min(ww, end - x), 6); x += ww + 8; } }
    const G = guilloche({ R: 92, A: 16, B: 7, n: 14, m: 6, lines: 22 }); g.save(); g.translate(640, 300); g.strokeStyle = rgba(ink, .6); g.lineWidth = .7;
    for (let k = 0; k < G.lines; k++) { const P = G.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 118, -.62, -.28); g.closePath(); const fg = g.createLinearGradient(40, -80, 120, 0); FOIL.forEach((cc, i) => fg.addColorStop(i / (FOIL.length - 1), cc)); g.fillStyle = fg; g.globalAlpha = .9; g.fill(); g.restore();
    // the corner that will come off: a small foil medallion ("a piece of itself")
    g.save(); g.translate(w - 30, 30); const mg = g.createRadialGradient(-4, -4, 0, 0, 0, 17); mg.addColorStop(0, '#fff1d6'); mg.addColorStop(.5, '#ffb35c'); mg.addColorStop(1, '#c87a2c'); g.fillStyle = mg; g.beginPath(); g.arc(0, 0, 15, 0, TAU); g.fill();
    rosette(g, 0, 0, { R: 9, A: 3, B: 1.4, n: 9, m: 4, lines: 10, col: '#7a3b17', w: .5, a: .7 }); g.restore();
    return c;
  });
}
function sheetShadow(ctx, a, torn) { const { w, h, cut } = AS; ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(2,2,10,.6)'; ctx.shadowBlur = 26; ctx.shadowOffsetX = 10; ctx.shadowOffsetY = 18; ctx.fillStyle = 'rgba(2,2,10,.55)';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(torn ? w - cut : w, 0); if (torn) ctx.lineTo(w, cut); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill(); ctx.restore(); }
// the shadow band over the sender's name (soft edged, cast by something out of frame); off = how far it has slid off to the left
function nameBand(ctx, a, off = 0) {
  if (a <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(4, 0, AS.w - 8, AS.h); ctx.clip(); ctx.globalAlpha = a; ctx.translate(-off, 0); ctx.rotate(-.012);
  const lg = ctx.createLinearGradient(0, 58, 0, 112); lg.addColorStop(0, 'rgba(14,14,36,0)'); lg.addColorStop(.22, 'rgba(14,14,36,.93)'); lg.addColorStop(.78, 'rgba(14,14,36,.93)'); lg.addColorStop(1, 'rgba(14,14,36,0)');
  ctx.fillStyle = lg; ctx.fillRect(-60, 58, 400, 54);
  ctx.restore();
}
export function anthropicSheet(ctx, t, o = {}) {
  const { w, h, cut, pad } = AS, L = anthLayer(), a = o.a ?? 1, tear = clamp(o.tear ?? 0), line = [[w - cut, 0], [w, cut]];
  ctx.save(); ctx.globalAlpha = a;
  sheetShadow(ctx, .9 * a, tear > .6);
  const body = (g) => { g.drawImage(L, -pad, -pad); };
  if (tear <= 0) body(ctx); else tearAway(ctx, { line, draw: body, part: 'rest', side: -1, tear });
  if (o.band) nameBand(ctx, o.band, o.bandOff || 0);
  const punch = clamp(o.punch ?? (tear > 0 ? 1 : 0));
  if (punch > 0) perforation(ctx, [line[0], [mix(line[0][0], line[1][0], punch), mix(line[0][1], line[1][1], punch)]], { pitch: 7, hole: 1.6, tear, light: o.light === false ? null : '#ffe2b0', a });
  if (tear > 0) { ctx.save(); if (o.piece) o.piece(ctx);
    ctx.save(); ctx.translate(8 + 10 * tear, 12 + 14 * tear); ctx.filter = 'blur(5px)'; ctx.fillStyle = `rgba(2,2,10,${.35 * a})`; ctx.beginPath(); ctx.moveTo(w - cut + 6, 0); ctx.lineTo(w, 0); ctx.lineTo(w, cut - 6); ctx.closePath(); ctx.fill(); ctx.filter = 'none'; ctx.restore();
    tearAway(ctx, { line, draw: body, part: 'piece', side: -1, tear, lift: 0, rot: .3, shadow: false }); ctx.restore(); }
  ctx.restore();
}

// ---------- Musk's card (quote2.mjs, the same options as C2's muskSheet) ----------
export const MUSK = { name: 'Elon Musk', role: 'CEO, SpaceX and Tesla', source: 'post on X', date: '19 Oct 2026' };
export function muskCard(ctx, t, x, y, s, rot, words, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
  const r = quoteCard2(ctx, t, { words, ...MUSK, x: 0, y: 0, t0: o.t0 ?? -100, t1: 1e6, hi: o.hi || ['many'], seed: 13 });
  ctx.restore(); return r;
}
const FIRST = 'Next year, I will give one of my SpaceX shares to every kid in America.';
const firstWords = (t0, dt) => FIRST.split(' ').map((w, i) => ({ w, s: t0 + i * dt, e: t0 + i * dt + dt * .9 }));

// ---------- tiny share certificates (H.07) ----------
function certSprite() {
  return once('cert', () => {
    const [c, g] = canvas(150, 100);
    g.fillStyle = '#f1e7cf'; g.beginPath(); g.roundRect(3, 3, 144, 94, 6); g.fill();
    g.strokeStyle = 'rgba(200,122,44,.95)'; g.lineWidth = 3; g.beginPath(); g.roundRect(10, 10, 130, 80, 4); g.stroke();
    g.strokeStyle = 'rgba(200,122,44,.6)'; g.lineWidth = 1.2; g.beginPath(); g.roundRect(16, 16, 118, 68, 3); g.stroke();
    rosette(g, 44, 50, { R: 18, A: 5, B: 2.4, n: 10, m: 4, lines: 12, col: '#b8661f', w: .9, a: .9 });
    g.fillStyle = 'rgba(31,42,58,.55)'; g.fillRect(72, 38, 54, 6); g.fillRect(72, 52, 40, 5); g.fillRect(72, 64, 48, 5);
    return c;
  });
}
function usaPts() {
  return once('usa', () => {
    const O = outlineLocal('USA'), rings = fitTo(O.rings, O.box, 0, 0, 1000, 600), main = rings[0];
    const inside = (x, y) => { let c = false; for (let i = 0, j = main.length - 1; i < main.length; j = i++) { const [xi, yi] = main[i], [xj, yj] = main[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const r = prng(41), pts = [];
    for (let y = 18; y < 600; y += 30) for (let x = 18; x < 1000; x += 34) { const jx = x + (y / 30 % 2) * 17 + (r() - .5) * 10, jy = y + (r() - .5) * 8; if (inside(jx, jy)) pts.push([jx, jy, r()]); }
    return { rings, pts };
  });
}

// ---------- H.06 + H.07: one take on the plate ----------
// world layout: the sheet (centre 900,560, scale 1.18), the light of the public good (1560,120), Musk's card (1780,330),
// the US map (2040…2960 × 440…1000). The camera pans right on "Then Elon Musk".
const SX = 880, SY = 575, SS = 1.32, SR = -.03;
const sheetToWorld = (u, v) => { const c = Math.cos(SR), s = Math.sin(SR), x = (u - AS.w / 2) * SS, y = (v - AS.h / 2) * SS; return [SX + x * c - y * s, SY + x * s + y * c]; };
const LIGHT = [1660, 96], CARD = [1760, 350], CARDS = .66, MAP = [2090, 480, 890, 540];
function threadPath() {
  return once('thread', () => {
    const P = [[-120, 560], [120, 548], [300, 560]];
    const C = [[0, AS.h / 2], [0, 0], [AS.w, 0], [AS.w, AS.h], [0, AS.h], [0, AS.h / 2]].map(([u, v]) => sheetToWorld(u, v));
    const all = P.concat(C), out = [];
    for (let i = 0; i < all.length - 1; i++) { const [ax, ay] = all[i], [bx, by] = all[i + 1], n = Math.max(2, Math.ceil(Math.hypot(bx - ax, by - ay) / 12)); for (let k = 0; k < n; k++) out.push([mix(ax, bx, k / n), mix(ay, by, k / n)]); }
    out.push(all[all.length - 1]); return out;
  });
}
export function plateTake(ctx, t, K) {
  const t0 = K.t06;
  // camera
  const pan = eio(clamp((t - (K.t07 - .4)) / 1.45)), push = clamp((t - t0) / (K.t07 - t0));
  const cx = mix(mix(905, 960, push), 2110 + 40 * clamp((t - K.t07) / 6), pan), cy = mix(mix(560, 520, push), 560 + 22 * clamp((t - K.t07) / 6), pan);
  const z = mix(1 + .07 * eio(push), 1.0 + .03 * clamp((t - K.t07 - 1) / 5), pan) * (1 - .05 * bump(pan));
  ctx.fillStyle = '#0c0c24'; ctx.fillRect(0, 0, W, H);
  ctx.save(); view(ctx, cx + drift(t, 6, 1), cy + drift(t, 5, 2), z, .004 * Math.sin(t * .3));
  plate(ctx);
  // the light of the public good (always there, soft; it blooms when the piece arrives)
  const pieceT = K.piece, free = pieceT + .42, arrive = clamp((t - free) / 1.25), bloom = Math.exp(-Math.max(0, t - K.good + .3) * 1.6) * clamp((t - (K.good - .9)) / .5);
  glowAt(ctx, LIGHT[0], LIGHT[1], 720, .45 + .35 * eout(arrive) + .6 * bloom);
  // the dotted thread from the roof lays the sheet's outline, then the paper fills it
  const lay = clamp((t - t0 + .02) / 1.25), paper = sm(clamp((t - t0 - .95) / .6));
  if (paper < 1) { const P = threadPath(), u = mix(eout(lay), eio(lay), .35); ghostLine(ctx, P, { ghost: 1, col: '#ffe2b0', w: 2.6, a: (1 - paper), dot: 9, u, t, glow: null }); const n = Math.max(1, Math.floor(P.length * u) - 1), tip = P[n]; if (lay > 0 && lay < 1) { glowAt(ctx, tip[0], tip[1], 90, 1); shareLight(ctx, tip[0], tip[1], 7, t, { a: 1 }); } }
  // the sheet
  const tear = clamp((t - pieceT) / .45), punch = clamp((t - (K.promised ?? pieceT - .65)) / .55);
  if (paper > 0) {
    ctx.save(); ctx.translate(SX, SY); ctx.rotate(SR); ctx.scale(SS * (1 + .015 * (1 - paper)), SS * (1 + .015 * (1 - paper))); ctx.translate(-AS.w / 2, -AS.h / 2);
    // the piece: once free it floats up into the light, turning slowly, and starts to glow
    const pc = [AS.w - 31, 31], dst = (() => { const c = Math.cos(-SR), s = Math.sin(-SR), x = (LIGHT[0] - SX) / SS, y = (LIGHT[1] - SY) / SS; return [AS.w / 2 + x * c - y * s - 10, AS.h / 2 + x * s + y * c + 40]; })();
    const fl = eio(arrive), wob = Math.sin((t - free) * 2.2) * 6 * fl;
    const pieceTf = (g) => { if (t < free) return; g.translate(mix(0, dst[0] - pc[0], fl) + wob, mix(0, dst[1] - pc[1], fl) - 12 * bump(fl)); g.translate(pc[0], pc[1]); g.rotate(-.55 * fl + .08 * Math.sin((t - free) * 1.3)); g.scale(1 + .12 * fl, 1 + .12 * fl); g.translate(-pc[0], -pc[1]); };
    anthropicSheet(ctx, t, { a: paper, band: paper, tear, punch: Math.max(punch, tear > 0 ? 1 : 0), piece: pieceTf });
    if (t > free) { ctx.save(); pieceTf(ctx); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .6 * fl; ctx.fillStyle = '#ff9a40'; ctx.beginPath(); ctx.moveTo(AS.w - AS.cut, 0); ctx.lineTo(AS.w, 0); ctx.lineTo(AS.w, AS.cut); ctx.closePath(); ctx.fill(); ctx.restore();
      glowAt(ctx, AS.w - 34, 34, 130 + 150 * fl, .4 + .7 * fl); shareLight(ctx, AS.w - 30, 30, 8 + 6 * fl, t, { a: fl }); ctx.restore(); }
    // a raking light drifts slowly across the sheet while the voice names what it is
    { const q = clamp((t - t0 - 1) / 6), bx = mix(-300, AS.w + 300, q); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, AS.w, AS.h); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createLinearGradient(bx - 220, 0, bx + 220, 120); rg.addColorStop(0, 'rgba(255,200,140,0)'); rg.addColorStop(.5, `rgba(255,200,140,${.09 * paper * (1 - tear * .5)})`); rg.addColorStop(1, 'rgba(255,200,140,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, AS.w, AS.h); ctx.restore(); }
    ctx.restore();
  }
  // H.07: Musk's card, "a SpaceX share", every child in America
  const ci = t - K.elon;
  if (ci > -.6) {
    const sl = eoX(clamp((ci + .5) / .8)), mv = eio(clamp((t - (K.spacex - .45)) / .75)), mid = [2090, 520];
    muskCard(ctx, t, mix(mid[0], CARD[0], mv) + (1 - sl) * 420, mix(mid[1], CARD[1], mv) + (1 - sl) * 40, mix(.86, CARDS, mv), -.02 + .015 * (1 - mv), firstWords(K.musk + .4, .1), { t0: K.elon - .5, hi: ['every', 'kid'] });
  }
  const U = usaPts(), mx = MAP[0], my = MAP[1], mk = Math.min(MAP[2] / 1000, MAP[3] / 600);
  const mapIn = clamp((t - (K.spacex - .1)) / 1.2);
  if (mapIn > 0) {
    ctx.save(); ctx.translate(mx, my); ctx.scale(mk, mk);
    for (let i = 0; i < Math.min(5, U.rings.length); i++) ghostLine(ctx, U.rings[i], { ghost: 1, col: '#f3efe2', w: 1.5 / mk, a: .75, dot: 6 / mk, u: eio(mapIn), t, glow: null });
    ctx.restore();
    text(ctx, 'EVERY CHILD IN AMERICA', mx + 20, my + MAP[3] + 46, { size: 18, weight: 600, color: rgba('#f3efe2', .6 * sm(clamp((t - K.every) / .5))), spacing: 6 });
  }
  // the one share: slides out from under the card and lands in the middle of the map
  const C1 = certSprite(), one = clamp((t - K.spacex) / .9), centre = [mx + 520 * mk, my + 300 * mk];
  const spread = clamp((t - K.every) / 1.25);
  if (one > 0) {
    const e = eio(one), x = mix(CARD[0] + 140, centre[0], e), y = mix(CARD[1] + 150, centre[1], e) - 60 * bump(one), s = mix(1, .2, eio(clamp((one - .4) / .6)));
    // all the other shares fan out from it (staggered by distance from the middle) and stay
    if (spread > 0) {
      const maxD = 560;
      for (const [px, py, rr] of U.pts) {
        const wx = mx + px * mk, wy = my + py * mk, d = Math.hypot(wx - centre[0], wy - centre[1]), q = eout(clamp((spread * 1.25 - d / maxD * .9) / .35));
        if (q <= 0) continue; const xx = mix(centre[0], wx, q), yy = mix(centre[1], wy, q), sz = 25 * (.9 + .2 * rr);
        ctx.save(); ctx.translate(xx, yy); ctx.rotate((rr - .5) * .3); ctx.globalAlpha = .95; ctx.drawImage(C1, -sz / 2, -sz / 3, sz, sz * 2 / 3); ctx.restore();
        if (rr > .93) glowAt(ctx, xx, yy, 22, .5 * (.5 + .5 * Math.sin(t * 3 + rr * 50)));
      }
    }
    // one lifts, folds into a point of light and rises (the next shot follows it up)
    const lift = clamp((t - (K.t08 - .9)) / .4), up = eio(clamp((t - (K.t08 - .5)) / .6));
    const lyW = y - 40 * eout(lift), syL = (lyW - cy) * z + H / 2, sxL = (x - cx) * z + W / 2;
    // screen point: from where it lifted to (1375, 700), then held there while the frame slides down under it
    const hold = eio(clamp((t - (K.t08 - .75)) / .3)), sxH = mix(sxL, 1375, hold), syH = mix(syL, 700, hold) - up * H;
    const lxw = (sxH - W / 2) / z + cx, ly = (syH - H / 2) / z + cy, fold = eio(clamp(lift * 1.6));
    ctx.save(); ctx.translate(lxw, ly); ctx.scale(s * (1 + .5 * eout(lift)) * (1 - fold), s * (1 + .5 * eout(lift))); ctx.drawImage(C1, -75, -50); ctx.restore();
    if (lift > 0) { shareLight(ctx, lxw, ly, (10 + 7 * fold) / z, t, { a: fold }); glowAt(ctx, lxw, ly, 150, fold); }
  }
  ctx.restore();
  motes(ctx, t, 0, 0, W, H, .8);
  vignette(ctx);
}

// ---------- 0.01: the name under the shadow band; the pen underlines it and curls the line into a small ring ----------
const RING = [356, 90], RR = 30;   // the ring in sheet units (just after the underline's end)
const nameCam = (t, K) => { const q = clamp((t - K.t01) / 2.2); return { z: 2.15 + .1 * q, cx: 300 + 30 * q, cy: 190 }; };
// where the ring sits on screen (the zoom into 0.03 starts there)
export function nameRingScreen(K, t = K.t03) { const { z, cx, cy } = nameCam(t, K), x = RING[0] - cx, y = RING[1] - cy, c = Math.cos(-.025), s = Math.sin(-.025); return [W / 2 + (x * c - y * s) * z, H / 2 - 60 + (x * s + y * c) * z]; }
export function sheetName(ctx, t, K) {
  const t0 = K.t01, rev = clamp((t - (K.anth - .12)) / .55);
  ctx.fillStyle = '#0c0c24'; ctx.fillRect(0, 0, W, H);
  const { z, cx: cxw, cy: cyw } = nameCam(t, K);
  ctx.save(); ctx.translate(W / 2, H / 2 - 60); ctx.rotate(-.025); ctx.scale(z, z); ctx.translate(-cxw - drift(t, 2, 3), -cyw - drift(t, 2, 4));
  ctx.drawImage(plateLayer(), -900, -700);
  anthropicSheet(ctx, t, { band: 1, bandOff: 520 * ein(rev), tear: 1, punch: 1, piece: (g) => g.translate(9999, 0) });
  // the pen's ink: under the name, then a flourish that closes into a small ring
  const ul = clamp((t - (K.anth + .12)) / .5), curl = clamp((t - (K.anth + .62)) / .4);
  const line = []; for (let i = 0; i <= 40; i++) line.push([66 + i / 40 * 250, 104 + Math.sin(i * .5) * .8]);
  const ring = [], [ex, ey] = line[40];
  for (let i = 1; i <= 16; i++) { const q = i / 16; ring.push([mix(ex, RING[0], q) + 8 * Math.sin(Math.PI * q), mix(ey, RING[1] + RR, eio(q))]); }
  for (let i = 1; i <= 48; i++) { const a = Math.PI / 2 - i / 48 * Math.PI * 2.08; ring.push([RING[0] + Math.cos(a) * RR, RING[1] + Math.sin(a) * RR]); }
  if (ul > 0) inkStroke(ctx, line, eio(ul), { w: 3.2, ink: '#b8661f', seed: 4 });
  if (curl > 0) inkStroke(ctx, ring, eio(curl), { w: 2.6, ink: '#b8661f', seed: 6 });
  if (curl > .9) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = sm(clamp((curl - .9) * 10)); ctx.drawImage(glowSprite(400, '#ffb35c', .55), RING[0] - RR * 3, RING[1] - RR * 3, RR * 6, RR * 6); ctx.restore(); }
  // the pen arrives from the left (it left the roof to the right), writes, and rides the ring
  const arr = clamp((t - t0) / (K.anth + .12 - t0)), tipU = ul < 1 ? line[Math.floor(eio(ul) * 40)] : ring[Math.min(ring.length - 1, Math.floor(eio(curl) * (ring.length - 1)))];
  const px = ul > 0 ? tipU[0] : mix(-260, 66, eout(arr)), py = ul > 0 ? tipU[1] : mix(-120, 104, eout(arr)) - 30 * bump(arr);
  const lift = ul > 0 ? (curl >= 1 ? sm(clamp((t - (K.anth + 1.05)) / .3)) : 0) : (1 - eout(arr)) * .8 + .2 * bump(arr);
  pen(ctx, px + lift * 60, py - lift * 40, .5, { ang: -2.35 + .1 * Math.sin(t * 3), t, lift });
  ctx.restore();
  // the source (always on screen in the print look)
  text(ctx, 'ANTHROPIC  ·  “INVESTING IN THE PUBLIC BENEFIT”  ·  18 OCT 2026', 80, H - 54, { size: 16, weight: 600, color: rgba('#f3efe2', .62 * sm(clamp((t - t0 - .3) / .6))), spacing: 4 });
  motes(ctx, t, 0, 0, W, H, .5, 9);
  vignette(ctx, .5);
}

// ---------- 0.03 + 0.03a: the company as an engraved disc; its slice is pledged, can grow, the board's seal makes it real ----------
export function rosetteTake(ctx, t, K) {
  const t0 = K.t03; ctx.fillStyle = '#0c0c24'; ctx.fillRect(0, 0, W, H);
  ctx.save(); const z = 1.0 + .05 * clamp((t - t0) / 7.4); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + drift(t, 5, 1), -H / 2 + drift(t, 4, 2));
  ctx.drawImage(plateLayer(), -420, -240);
  glowAt(ctx, 1380, 160, 640, .35);
  // the disc grows a little with "value climbs"
  const v1 = eout(clamp((t - K.climbs) / .5)), R0 = 370 * (1 + .1 * v1), X = 860, Y = 600;
  // the slice: 5 % now; two jerky ghost growths (+2 % each), the board's seal engraves them solid
  const out = eout(clamp((t - K.now) / .6)), g1 = eoX(clamp((t - K.climb1) / .28)), g2 = eoX(clamp((t - K.climb2) / .28)), ghostShare = .02 * g1 + .02 * g2;
  const burn = clamp((t - (K.agrees + .1)) / .7), solid = .05 + ghostShare * eio(burn);
  const A0 = -.62, mid = A0 + solid * Math.PI, glide = eio(clamp((t - (K.t04q - .55)) / .5));
  const tilt = .52, sy = mix(1, .32, tilt);
  ctx.save(); ctx.translate(320 * glide, 0);
  const res = slicePie(ctx, X, Y, R0, { share: solid, at: mid, grow: out, tilt, t, depth: 30 });
  // the ghost growth: a dotted wedge beyond the solid slice (it does not exist until the board agrees)
  if (ghostShare > .001 && burn < 1) {
    const off = R0 * .34 * out, lift = R0 * .12 * out, cx = X + Math.cos(mid) * off, cy = Y + Math.sin(mid) * off * sy - lift;
    const a1 = A0 + 2 * solid * Math.PI, a2 = A0 + 2 * (.05 + ghostShare) * Math.PI, pts = [[cx, cy]];
    for (let i = 0; i <= 24; i++) { const a = mix(a1, a2, i / 24); pts.push([cx + Math.cos(a) * R0, cy + Math.sin(a) * R0 * sy]); } pts.push([cx, cy]);
    ghostLine(ctx, pts, { ghost: 1, col: '#ffd9a0', w: 3, a: 1, dot: 10, t, glow: null });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .12 * (1 - burn); ctx.fillStyle = '#ffb35c'; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.fill(); ctx.restore();
    if (burn > 0) { const a = mix(a1, a2, 0), p = [cx + Math.cos(a) * R0, cy + Math.sin(a) * R0 * sy]; burinTip(ctx, p[0], p[1], a + Math.PI / 2, t, { size: 16 }); }
  }
  // labels: the slice now (with the condition), the climbing rule, the board
  const [tx, ty] = res.tip, la = sm(clamp((t - K.now - .25) / .5)) * (1 - glide);
  text(ctx, '5 %', tx + 46, ty - 24, { size: 96, font: 'Instrument Serif', color: rgba('#ffcf8a', la) });
  text(ctx, 'A SLICE, PLEDGED NOW', tx + 52, ty + 20, { size: 22, weight: 600, color: rgba('#f3efe2', .85 * la), spacing: 5 });
  text(ctx, 'subject to stockholder approval', tx + 52, ty + 52, { size: 21, weight: 400, color: rgba('#f3efe2', .6 * la) });
  const ra = sm(clamp((t - K.climb1 - .1) / .5)) * (1 - glide);
  text(ctx, '+2 % per +50 % value', 1230, 860, { size: 62, font: 'Instrument Serif', color: rgba('#f3efe2', ra) });
  const ba = sm(clamp((t - K.board + .1) / .5)) * (1 - glide);
  text(ctx, 'AT THE BOARD’S DISCRETION', 1234, 906, { size: 21, weight: 600, color: rgba('#ffcf8a', .9 * ba), spacing: 5 });
  // the board's seal lands on "agrees"
  const sp = clamp((t - (K.agrees - .25)) / .3), land = t - K.agrees;
  if (sp > 0) { const sc = land < 0 ? mix(1.8, 1, eio(sp)) : 1 + .08 * Math.exp(-land * 8) * Math.cos(land * 30); const [qx, qy] = res.centre;
    ctx.save(); ctx.globalAlpha = Math.min(1, sp * 2); seal(ctx, qx + 120, qy + 70, 52 * sc, t, { foil: true, label: 'BOARD · BOARD · BOARD · BOARD ·', rot: -.3 }); ctx.restore(); }
  ctx.restore();
  ctx.restore();
  text(ctx, 'ANTHROPIC  ·  18 OCT 2026', 80, H - 54, { size: 16, weight: 600, color: rgba('#f3efe2', .55 * sm(clamp((t - t0 - .4) / .6)) * (1 - glide)), spacing: 4 });
  motes(ctx, t, 0, 0, W, H, .6, 12);
  vignette(ctx);
}

// ---------- 0.04: "And Musk added" — his new card lands on the old one; the words light with the voice; it slides aside (c01>c02) ----------
export function muskQuote(ctx, t, K, C) {
  const t0 = K.t04q; ctx.fillStyle = '#0c0c24'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(drift(t, 4, 1) - 30 * clamp((t - t0) / 4), drift(t, 3, 2)); ctx.drawImage(plateLayer(), -600, -300); ctx.restore();
  glowAt(ctx, 1500, 140, 600, .3);
  // the first card (H.07) rests behind, dimmed; it slides away left as the new card takes the stage
  const away = eio(clamp((t - (K.cut - 1.2)) / 1.0));
  ctx.save(); ctx.globalAlpha = .55 * (1 - away); muskCard(ctx, t, 560 - 500 * away, 330, .5, -.05, firstWords(-50, .01), { hi: ['every', 'kid'] }); ctx.restore();
  // the new card slides in on "added" and lands on the stage; its position follows the carrier key path near the cut
  const inn = eoX(clamp((t - (K.added - .15)) / .7)), p = C.pos(t);
  const x = mix(2400, p.x, inn), y = mix(600, p.y, inn), s = p.s, r = p.r + (1 - inn) * .06;
  muskCard(ctx, t, x, y, s, r, K.quote, { t0: -100, hi: ['many'] });
  // "many" glints in foil once spoken
  const g = clamp((t - (K.many + .25)) / .6); if (g > 0 && g < 1) glowAt(ctx, x + 330 * s, y + 10 * s, 140 * s, .6 * Math.sin(Math.PI * g));
  vignette(ctx, .5);
}
