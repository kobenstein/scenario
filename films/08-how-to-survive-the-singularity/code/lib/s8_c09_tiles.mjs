// Film 8 · c09 local pieces (B3): the online deliberation (Taiwan 2024): a grid of video tiles, faceless people at home in their own
// lamp-lit rooms; they regroup into small groups of ten; one holds up a fake ad and crosses it out; a thin cool line (the machine's
// colour) runs through each group and lays short fragments out as a summary card; the card's lines turn amber and thread back to the
// tiles they came from. Screen space, drawn into any rect (the laptop screen in the room, or the full frame).
//   tileLayout(o)                       → [{ x, y, w, h, g (group), i }] in grid space (1920×1080); o.group 0..1 (regrouped into tens)
//   drawGrid(ctx, t, o)                 o: { rect [x, y, w, h] (where the 1920×1080 grid space lands), group 0..1, ad 0..1 (the fake ad held up),
//                                        cross 0..1 (crossed out), line 0..1 (the cool line runs), card 0..1 (summary card laid out),
//                                        amber 0..1 (its lines turn amber), threads 0..1, rows 0..1 (the grid lights row by row), hide: tile index
//                                        not drawn (it is the clip's frame), dim 0..1 }   → { tiles, card: [x, y, w, h] (grid space) }
//   HERO                                the index of the tile that opens into the clip (C6)
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, eoX, eiX, sio, u01, mixHex, hash, once } from './s8_kit.mjs';

const COLS = 8, ROWS = 5, N = COLS * ROWS;
export const HERO = 13;
const P = (() => { const r = prng(9090), a = []; for (let i = 0; i < N; i++) a.push({ skin: ['#3a2a26', '#5a3a26', '#7a4f33', '#a8734f', '#c99a74'][Math.floor(r() * 5)], hair: ['#0c0a12', '#1c1420', '#2a1e1a', '#5a5a60'][Math.floor(r() * 4)], top: ['#2a3450', '#3a2a40', '#1e3a3a', '#4a3020', '#2c2c38', '#40303a'][Math.floor(r() * 6)], lamp: r() < .5 ? -1 : 1, room: Math.floor(r() * 4), ph: r() * 6.28, dx: (r() - .5) * .2, sz: .9 + r() * .2, hairK: Math.floor(r() * 3) }); return a; })();
// grid space layout: 8×5 even grid → 4 groups of ten (2 cols × 5 rows each) with gaps between groups, plus the card column on the right
export function tileLayout(o = {}) {
  const gU = clamp(o.group ?? 0), tw = 196, th = 118, gx = 14, gy = 14, out = [];
  const W0 = COLS * tw + (COLS - 1) * gx, x0 = (1920 - W0) / 2, y0 = (1080 - (ROWS * th + (ROWS - 1) * gy)) / 2 - 20;
  for (let i = 0; i < N; i++) {
    const c = i % COLS, r = Math.floor(i / COLS), g = Math.floor(c / 2);
    const ax = x0 + c * (tw + gx), ay = y0 + r * (th + gy);
    // grouped: groups of 2 columns with a 46 px gap, the whole block shifted left to make room for the card
    const gw = 2 * tw + gx, bx = 70 + g * (gw + 46) + (c % 2) * (tw + gx), by = ay;
    const e = sio(clamp(gU * 1.25 - g * .08));
    out.push({ x: ax + (bx - ax) * e, y: ay + (by - ay) * e, w: tw, h: th, g, i, c, r });
  }
  return out;
}
// one person at home, in the tile (tile units 0..w, 0..h): wall, a lamp on one side, a window or shelf behind, head and shoulders, faceless
function person(g, t, p, w, h, lit = 1) {
  const L = p.lamp, room = p.room;
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, ['#1a1830', '#22182a', '#16202a', '#201c24'][room]); bg.addColorStop(1, '#0a0910'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  // the lamp's warm light on the wall
  const lx = w * (.5 + .42 * L), lg = g.createRadialGradient(lx, h * .3, 0, lx, h * .3, w * .7); lg.addColorStop(0, rgba('#ffb35c', .5 * lit)); lg.addColorStop(.4, rgba('#c4512e', .15 * lit)); lg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lg; g.fillRect(0, 0, w, h);
  // the room behind: a window with a night city (cool dots), or a shelf of books, or a plant, or a picture frame
  g.save();
  if (room === 0) { const wx = w * (.5 - .3 * L) - w * .14, wy = h * .1; g.fillStyle = '#0c1430'; g.fillRect(wx, wy, w * .28, h * .42); g.fillStyle = 'rgba(200,220,255,.5)'; for (let k = 0; k < 9; k++) g.fillRect(wx + hash(k + p.ph) * w * .26, wy + h * .2 + hash(k * 3 + p.ph) * h * .2, 1.5, 1.5); g.strokeStyle = '#2a2a40'; g.lineWidth = 2; g.strokeRect(wx, wy, w * .28, h * .42); g.beginPath(); g.moveTo(wx + w * .14, wy); g.lineTo(wx + w * .14, wy + h * .42); g.stroke(); }
  else if (room === 1) { const sx = w * (.5 - .32 * L) - w * .16; g.fillStyle = '#1a1210'; g.fillRect(sx, h * .12, w * .32, h * .5); for (let k = 0; k < 2; k++) for (let b = 0; b < 8; b++) { g.fillStyle = ['#5a2a2a', '#2a3a5a', '#4a4a2a', '#3a2a4a'][(b + k) % 4]; g.fillRect(sx + 3 + b * w * .038, h * (.14 + k * .25), w * .03, h * .2); } }
  else if (room === 2) { const px = w * (.5 - .33 * L); g.fillStyle = '#16241a'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(px + Math.cos(k) * w * .05, h * .35 + Math.sin(k * 2) * h * .08, w * .05, h * .1, k, 0, TAU); g.fill(); } }
  else { const fx = w * (.5 - .3 * L) - w * .1; g.fillStyle = '#2a1e18'; g.fillRect(fx, h * .14, w * .2, h * .26); g.fillStyle = '#3a3a52'; g.fillRect(fx + 4, h * .14 + 4, w * .2 - 8, h * .26 - 8); }
  g.restore();
  // the lamp itself at the tile edge
  g.fillStyle = rgba('#fff1d6', .9 * lit); g.beginPath(); g.ellipse(lx + L * w * .02, h * .26, w * .035, h * .05, 0, 0, TAU); g.fill();
  // head and shoulders (faceless; the lamp side rim-lit, the screen's cool light on the front)
  const b = Math.sin(t * TAU / 4.2 + p.ph), sway = (Math.sin(t * 1.1 + p.ph) * .03 + Math.sin(t * 2.3 + p.ph * 3) * .012) * w + p.dx * w, nod = Math.sin(t * .9 + p.ph * 2) * .09 + .05 * Math.max(0, Math.sin(t * 5.3 + p.ph * 5)) * (Math.sin(t * .5 + p.ph) > .2 ? 1 : 0);
  const cx = w * .5 + sway, sh = h * (.86 - .006 * b), s = p.sz;
  g.save();
  g.fillStyle = p.top; g.beginPath(); g.moveTo(cx - w * .3 * s, h + 2); g.bezierCurveTo(cx - w * .29 * s, sh - h * .02, cx - w * .16 * s, sh - h * .1, cx, sh - h * .1); g.bezierCurveTo(cx + w * .16 * s, sh - h * .1, cx + w * .29 * s, sh - h * .02, cx + w * .3 * s, h + 2); g.closePath(); g.fill();
  g.fillStyle = p.skin; g.beginPath(); g.roundRect(cx - w * .035 * s, sh - h * .2, w * .07 * s, h * .12, 3); g.fill();
  g.translate(cx, sh - h * .33); g.rotate(nod);
  g.fillStyle = p.skin; g.beginPath(); g.ellipse(0, 0, w * .075 * s, h * .15 * s, 0, 0, TAU); g.fill();
  g.fillStyle = p.hair; g.beginPath();
  if (p.hairK === 0) g.ellipse(0, -h * .05 * s, w * .08 * s, h * .11 * s, 0, Math.PI, TAU);
  else if (p.hairK === 1) { g.ellipse(0, -h * .03 * s, w * .085 * s, h * .14 * s, 0, Math.PI * .9, Math.PI * 2.1); }
  else { g.ellipse(0, -h * .02 * s, w * .09 * s, h * .16 * s, 0, Math.PI * .75, Math.PI * 2.25); g.rect(-w * .09 * s, -h * .02, w * .03 * s, h * .2); g.rect(w * .06 * s, -h * .02, w * .03 * s, h * .2); }
  g.fill();
  // rim from the lamp, cool screen light on the faceless front
  g.globalCompositeOperation = 'source-atop';
  const rg = g.createLinearGradient(L * w * .1, 0, -L * w * .1, 0); rg.addColorStop(0, rgba('#ffb066', .55 * lit)); rg.addColorStop(.5, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(-w * .1, -h * .2, w * .2, h * .4);
  g.fillStyle = 'rgba(160,200,255,.12)'; g.fillRect(-w * .1, -h * .2, w * .2, h * .4);
  g.restore();
  // a soft screen-light wash from below (the viewer is the camera of the laptop)
  const sg = g.createLinearGradient(0, h, 0, h * .5); sg.addColorStop(0, 'rgba(150,190,255,.12)'); sg.addColorStop(1, 'rgba(150,190,255,0)'); g.fillStyle = sg; g.fillRect(0, 0, w, h);
}
// the fake ad card (bold garish blocks, a fake prize, unreadable), held up in a tile; crossed out with two strokes
function adCard(g, t, w, h, u, cross) {
  if (u <= 0) return;
  const e = eoX(u), cw = w * .42, ch = h * .5, x = w * .52 - cw / 2 + Math.sin(t * 2.1) * 1.5, y = h * (1.05 - .62 * e);
  g.save(); g.translate(x + cw / 2, y + ch / 2); g.rotate(-.06 + .02 * Math.sin(t * 1.7)); g.translate(-cw / 2, -ch / 2);
  g.fillStyle = '#f2e04a'; g.fillRect(0, 0, cw, ch);
  g.fillStyle = '#d0342a'; g.fillRect(cw * .06, ch * .08, cw * .88, ch * .26);
  g.fillStyle = '#fff6d0'; for (let k = 0; k < 3; k++) g.fillRect(cw * (.12 + k * .27), ch * .14, cw * .2, ch * .12);
  g.fillStyle = '#1a1a1a'; for (let k = 0; k < 3; k++) g.fillRect(cw * .1, ch * (.46 + k * .14), cw * (.8 - k * .18), ch * .07);
  g.fillStyle = '#2a8a3a'; g.beginPath(); g.arc(cw * .82, ch * .78, ch * .14, 0, TAU); g.fill();
  if (cross > 0) {
    g.strokeStyle = '#ffb35c'; g.lineWidth = Math.max(2, w * .025); g.lineCap = 'round';
    const c1 = clamp(cross * 2), c2 = clamp(cross * 2 - 1);
    g.beginPath(); g.moveTo(-cw * .04, -ch * .05); g.lineTo(-cw * .04 + cw * 1.08 * c1, -ch * .05 + ch * 1.1 * c1); g.stroke();
    if (c2 > 0) { g.beginPath(); g.moveTo(cw * 1.04, -ch * .05); g.lineTo(cw * 1.04 - cw * 1.08 * c2, -ch * .05 + ch * 1.1 * c2); g.stroke(); }
  }
  g.restore();
  // the hand holding it (a dark fist under the card)
  g.fillStyle = '#5a3a26'; g.beginPath(); g.ellipse(x + cw * .5, y + ch + h * .04, w * .05, h * .07, 0, 0, TAU); g.fill();
}
// the summary card's lines: (tile it came from, length)
export const FRAG = (() => { const r = prng(707), a = []; for (let g = 0; g < 4; g++) for (let k = 0; k < 2; k++) a.push({ g, tile: g * 2 + (k ? 9 : 0) + Math.floor(r() * 3) * COLS * (k ? 1 : 0) + (r() < .5 ? 1 : 0), len: .55 + r() * .35 }); return a.map((f) => ({ ...f, tile: Math.min(N - 1, f.tile) })); })();
const TILEC = new Map();
export function drawGrid(ctx, t, o = {}) {
  const [rx, ry, rw, rh] = o.rect || [0, 0, 1920, 1080], k = rw / 1920;
  const tiles = tileLayout(o), dim = o.dim ?? 0;
  ctx.save(); ctx.translate(rx, ry); ctx.scale(k, rh / 1080);
  // the call window's ground (a dark screen) with a faint cool sheen
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#0d1222'); bg.addColorStop(1, '#070a14'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  const lineU = clamp(o.line ?? 0), cardU = clamp(o.card ?? 0), amber = clamp(o.amber ?? 0), thr = clamp(o.threads ?? 0), rows = o.rows;
  for (const T of tiles) {
    if (T.i === o.hide) continue;
    const p = P[T.i];
    ctx.save(); ctx.beginPath(); ctx.roundRect(T.x, T.y, T.w, T.h, 8); ctx.clip(); ctx.translate(T.x, T.y);
    const lit = rows == null ? 1 : .35 + .65 * clamp(rows * (ROWS + 1) - T.r);
    person(ctx, t + T.i * .37, p, T.w, T.h, lit);
    if (T.i === (o.adTile ?? 22)) adCard(ctx, t, T.w, T.h, o.ad ?? 0, o.cross ?? 0);
    ctx.restore();
    // the tile's frame (the speaking ring lights now and then)
    const speak = Math.max(0, Math.sin(t * .7 + p.ph * 3)) > .93 ? 1 : 0, rl = rows == null ? 0 : clamp(rows * (ROWS + 1) - T.r) * (1 - clamp(rows * (ROWS + 1) - T.r - 1));
    ctx.strokeStyle = speak ? rgba('#8fe6ff', .7) : rgba('#3a4060', .9); ctx.lineWidth = speak ? 2.5 : 1.5; ctx.beginPath(); ctx.roundRect(T.x, T.y, T.w, T.h, 8); ctx.stroke();
    if (rl > 0) { ctx.strokeStyle = rgba('#ffb35c', .8 * rl); ctx.lineWidth = 3; ctx.stroke(); }
    if (dim > 0) { ctx.fillStyle = rgba('#05060f', dim); ctx.beginPath(); ctx.roundRect(T.x, T.y, T.w, T.h, 8); ctx.fill(); }
  }
  // group frames (thin, amber-cream) once regrouped
  const gU = clamp(((o.group ?? 0) - .6) / .4);
  if (gU > 0) for (let g = 0; g < 4; g++) {
    const ts = tiles.filter((T) => T.g === g), x0 = Math.min(...ts.map((T) => T.x)) - 9, y0 = Math.min(...ts.map((T) => T.y)) - 9, x1 = Math.max(...ts.map((T) => T.x + T.w)) + 9, y1 = Math.max(...ts.map((T) => T.y + T.h)) + 9;
    ctx.strokeStyle = rgba('#e9dcc0', .45 * gU); ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 12); ctx.stroke(); ctx.setLineDash([]);
  }
  // the summary card (right column): cream, eight short lines
  const card = [1500, 300, 360, 470];
  if (cardU > 0 || lineU > 0) {
    const e = eoX(cardU);
    if (cardU > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(card[0] - 10, card[1] - 10, card[2] + 20, (card[3] + 20) * e); ctx.clip();
      if (o.cardDraw) o.cardDraw(ctx, card); else { const cg = ctx.createLinearGradient(0, card[1], 0, card[1] + card[3]); cg.addColorStop(0, '#f3ecda'); cg.addColorStop(1, '#e2cfa4'); ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(...card, 10); ctx.fill(); }
      ctx.restore();
    }
    // the cool line runs through each group (top to bottom, snaking through the tiles), lifting a fragment in each and carrying it to the card
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    FRAG.forEach((f, i) => {
      const T = tiles[f.tile], lu = clamp(lineU * 1.6 - i * .08), cy = card[1] + 50 + i * 52;
      const src = [T.x + T.w * .5, T.y + T.h * .5], dst = [card[0] + 24, cy];
      if (lu > 0) {
        // fragment: a short bright bar lifts out of the tile and flies along the line to the card
        const m = sio(lu), fx = src[0] + (dst[0] - src[0]) * m, fy = src[1] + (dst[1] - src[1]) * m - Math.sin(Math.PI * m) * 60;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba('#8fe6ff', .35 * (1 - amber)); ctx.lineWidth = 1.4; ctx.beginPath();
        for (let q = 0; q <= 20; q++) { const v = q / 20 * m, xx = src[0] + (dst[0] - src[0]) * v, yy = src[1] + (dst[1] - src[1]) * v - Math.sin(Math.PI * v) * 60; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
        ctx.stroke();
        if (m < 1) { ctx.fillStyle = rgba('#d8f7ff', .9); ctx.fillRect(fx - 26, fy - 3, 52, 6); }
        ctx.globalCompositeOperation = 'source-over';
      }
      // the line on the card (cool ink, then amber)
      if (cardU > 0 && lu >= 1 && !o.cardDraw) { const L = (card[2] - 60) * f.len; ctx.strokeStyle = mixHex('#3a6a8a', '#c4651e', amber); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(card[0] + 30, cy); for (let x = 0; x <= L; x += 8) ctx.lineTo(card[0] + 30 + x, cy + 1.6 * Math.sin(x * .3 + i)); ctx.stroke(); }
      // amber thread back to its tile
      if (thr > 0) { const tu = clamp(thr * 1.5 - i * .06); if (tu > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .7); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(dst[0] - 8, dst[1]); const cx = (dst[0] + src[0]) / 2, cyy = Math.min(dst[1], src[1]) - 90; for (let q = 0; q <= 24; q++) { const v = q / 24 * tu, a = 1 - v; ctx.lineTo(a * a * (dst[0] - 8) + 2 * a * v * cx + v * v * src[0], a * a * dst[1] + 2 * a * v * cyy + v * v * src[1]); } ctx.stroke(); if (tu >= 1) { ctx.strokeStyle = rgba('#ffb35c', .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(T.x, T.y, T.w, T.h, 8); ctx.stroke(); } ctx.globalCompositeOperation = 'source-over'; } }
    });
    ctx.restore();
  }
  ctx.restore();
  return { tiles, card, map: (x, y) => [rx + x * k, ry + y * rh / 1080] };
}
