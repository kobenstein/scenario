// 4.01 · the courtyard at night, one-point perspective: a deep tenement courtyard (Hinterhof), its back wall facing us,
// the side walls rushing past the lens. One amber window lights at screen centre; the dark around it is huge.
import { stipple, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, fog, vnoise, quadMap, quadIn, put } from './art.mjs';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, sm, lin, eio, eout, ein, qio, drift, HOT, once, lay2, lay, T, camTo, glowA, finish, lightSprite, spr, stip, putL } from './s04_util.mjs';

const VP = [960, 430], BL = 600, BR = 1320, BT = 150, BB = 930, NF = 5, NC = 7;
export const WIN = { x: 960, y: 540, w: 64, h: 98 };
const PAD = 300, LW = W + 2 * PAD, LH = H + 2 * PAD;    // layer margins for drift + zoom
const P = (xb, yb, k) => [VP[0] + (xb - VP[0]) * k, VP[1] + (yb - VP[1]) * k];   // back-plane point pushed toward the lens by k
const yF = (f, v) => BT + (f + v) * (BB - BT) / NF;    // back-wall height of floor f, fraction v
function limbL(ctx, pts, w0, w1, col, seed) { const L = [], R = [], n = vnoise(seed); for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)], dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1, w = mix(w0, w1, i / (pts.length - 1)) / 2 * (1 + (n(i * .7, 1) - .5) * .3); L.push([p[0] - dy / l * w, p[1] + dx / l * w]); R.push([p[0] + dy / l * w, p[1] - dx / l * w]); } ctx.beginPath(); ctx.moveTo(...L[0]); for (const p of L) ctx.lineTo(...p); for (const p of R.reverse()) ctx.lineTo(...p); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }

function winDark(g, q, seed, r, { curtain = .4, plant = .15, refl = '#3a4688' } = {}) {
  const m = quadMap(q);
  roughPoly(g, quadIn(m, -.12, -.08, 1.12, 1.06), '#222a5a', { amp: .4, seed });           // stone surround
  roughPoly(g, q, '#06081c', { amp: .4, seed: seed + 1 });
  g.save(); g.beginPath(); roughPath(g, q, { amp: .4, seed: seed + 1 }); g.clip();
  const [ax, ay] = q[0], [bx, by] = q[2]; const gr = g.createLinearGradient(ax, ay, bx, by); gr.addColorStop(0, rgba(refl, .32)); gr.addColorStop(.5, rgba(refl, 0)); g.fillStyle = gr; g.fillRect(Math.min(ax, bx) - 5, Math.min(ay, by) - 5, Math.abs(bx - ax) + 10, Math.abs(by - ay) + 10);
  if (r() < curtain) { const s = r() < .5 ? 0 : 1, w = .2 + r() * .25; roughPoly(g, quadIn(m, s ? 1 - w : 0, 0, s ? 1 : w, 1), rgba('#161c48', .9), { amp: .3, seed: seed + 2 }); }
  g.strokeStyle = '#1a2150'; g.lineWidth = Math.max(1, Math.abs(q[1][0] - q[0][0]) * .045); g.beginPath(); g.moveTo(...m(.5, 0)); g.lineTo(...m(.5, 1)); g.moveTo(...m(0, .38)); g.lineTo(...m(1, .38)); g.stroke();
  g.restore();
  roughPoly(g, quadIn(m, -.16, 1.04, 1.16, 1.12), '#2c3670', { amp: .3, seed: seed + 3 });   // sill
  if (r() < plant) { const [x, y] = m(.5, 1.04), s = Math.abs(q[1][0] - q[0][0]) / 60; for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? '#0f1a2a' : '#13202e'; g.beginPath(); g.ellipse(x + (k - 2.5) * 8 * s, y - 7 * s, 5 * s, 10 * s, (k - 2.5) * .25, 0, 7); g.fill(); } }
}
function layers() {
  return once('court2', () => {
    const r = prng(41);
    const mk = () => { const [c, g] = lay2(LW, LH); g.translate(PAD, PAD); return [c, g]; };
    // ---------------- sky wedge + back wall (p .8)
    const [bc, bx] = mk();
    { const g = bx.createLinearGradient(0, -PAD, 0, 420); g.addColorStop(0, '#04061a'); g.addColorStop(.7, '#0e1440'); g.addColorStop(1, '#1d2458'); bx.fillStyle = g; bx.fillRect(-PAD, -PAD, LW, LH); }
    for (let i = 0; i < 160; i++) { const x = 300 + r() * 1320, y = -PAD + Math.pow(r(), 1.3) * (PAD + 140), m = r(); bx.fillStyle = rgba('#dfe6ff', .1 + .5 * m * m); const s = m > .95 ? 2 : 1; bx.fillRect(x, y, s, s); }
    // roofline of the back house: parapet, chimneys, an antenna
    roughPoly(bx, [[BL - 40, BT + 4], [BL - 40, BT - 18], [760, BT - 22], [770, BT - 58], [805, BT - 58], [815, BT - 24], [1080, BT - 26], [1090, BT - 74], [1118, BT - 74], [1126, BT - 28], [BR + 40, BT - 20], [BR + 40, BT + 4]], '#090c26', { amp: 1, seed: 2 });
    roughLine(bx, [[1180, BT - 26], [1180, BT - 120]], { w: 2, col: '#090c26', seed: 3 }); roughLine(bx, [[1150, BT - 100], [1212, BT - 104]], { w: 2, col: '#090c26', seed: 4 }); roughLine(bx, [[1160, BT - 80], [1200, BT - 82]], { w: 2, col: '#090c26', seed: 5 });
    const wq = [[BL, BT], [BR, BT], [BR, BB + 200], [BL, BB + 200]];
    roughPoly(bx, wq, '#172048', { amp: 1, seed: 6 });
    bx.save(); bx.beginPath(); roughPath(bx, wq, { amp: 1, seed: 6 }); bx.clip();
    { const g = bx.createLinearGradient(0, BT, 0, BB + 200); g.addColorStop(0, '#222b5e'); g.addColorStop(.6, '#161d48'); g.addColorStop(1, '#090c24'); bx.fillStyle = g; bx.fillRect(BL, BT, BR - BL, BB - BT + 200); }
    { const [pc, px] = lay2(LW, LH); px.translate(PAD, PAD); for (let i = 0; i < 70; i++) { const x = BL + r() * (BR - BL), y = BT + r() * (BB - BT), rr = 20 + r() * 90, g = px.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, rgba(r() < .5 ? '#2c3672' : '#080a20', .4)); g.addColorStop(1, 'rgba(0,0,0,0)'); px.fillStyle = g; px.fillRect(x - rr, y - rr, rr * 2, rr * 2); } stip(pc, { k: .8, seed: 7 }); putL(bx, pc); }
    for (let i = 0; i < 160; i++) { const x = BL + r() * (BR - BL), y = BT + r() * (BB - BT), l = 10 + r() * 70; bx.strokeStyle = rgba(r() < .5 ? '#05071a' : '#2c3670', .14 + r() * .1); bx.lineWidth = 1; bx.beginPath(); bx.moveTo(x, y); bx.lineTo(x + (r() - .5) * 2, y + l); bx.stroke(); }
    for (let f = 1; f < NF; f++) { roughLine(bx, [[BL, yF(f, 0) - 4], [BR, yF(f, 0) - 4]], { w: 3, col: rgba('#2a3470', .6), seed: f }); roughLine(bx, [[BL, yF(f, 0)], [BR, yF(f, 0)]], { w: 1.5, col: rgba('#04061a', .5), seed: f + 9 }); }
    bx.restore();
    const hero = { c: 3, f: 2 };
    for (let f = 0; f < NF; f++) for (let c = 0; c < NC; c++) {
      if (c === hero.c && f === hero.f) continue;
      const cx = BL + (c + .5) * (BR - BL) / NC + (r() - .5) * 3, cy = yF(f, .5);
      const w = WIN.w * (.94 + r() * .1), h = WIN.h * (f === 0 ? .8 : 1);
      winDark(bx, [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]], f * 40 + c, r);
    }
    // a door at the back (courtyard passage), dark
    roughRect(bx, 1180, BB - 96, 70, 100, '#05061a', { amp: .6, seed: 8 }); roughRect(bx, 1172, BB - 104, 86, 8, '#252e64', { amp: .4, seed: 9 });
    // drainpipe on the back wall
    roughLine(bx, [[BL + 18, BT + 4], [BL + 18, BB + 20]], { w: 6, col: '#0a0d28', seed: 10 });
    // moonlight from the upper left: a cool stippled wash on the back wall's upper half
    { const [lc, lx] = lay2(LW, LH); lx.translate(PAD, PAD); const g = lx.createLinearGradient(BL, BT, BL + 500, BT + 600); g.addColorStop(0, rgba('#7f8ee0', .28)); g.addColorStop(1, rgba('#7f8ee0', 0)); lx.fillStyle = g; lx.beginPath(); roughPath(lx, wq, { amp: 1, seed: 6 }); lx.fill(); stip(lc, { k: .85, seed: 13 }); putL(bx, lc, { op: 'screen' }); }
    // warm light of the hero window falling on the wall around it (stippled)
    const [wc, wx2] = mk();
    { const g = wx2.createRadialGradient(WIN.x, WIN.y + 10, 20, WIN.x, WIN.y + 10, 260); g.addColorStop(0, rgba(C.amber, .5)); g.addColorStop(.4, rgba(C.amber, .14)); g.addColorStop(1, rgba(C.amber, 0)); wx2.fillStyle = g; wx2.save(); wx2.scale(1, 1); wx2.fillRect(WIN.x - 300, WIN.y - 300, 600, 600); wx2.restore();
      const g2 = wx2.createLinearGradient(0, WIN.y + WIN.h / 2, 0, WIN.y + WIN.h / 2 + 260); g2.addColorStop(0, rgba(C.amber, .25)); g2.addColorStop(1, rgba(C.amber, 0)); wx2.fillStyle = g2; wx2.beginPath(); wx2.moveTo(WIN.x - WIN.w / 2, WIN.y + WIN.h / 2 + 8); wx2.lineTo(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2 + 8); wx2.lineTo(WIN.x + WIN.w * 1.6, WIN.y + WIN.h / 2 + 260); wx2.lineTo(WIN.x - WIN.w * 1.6, WIN.y + WIN.h / 2 + 260); wx2.fill();
      stip(wc, { k: .8, seed: 21 }); }
    // ---------------- side walls (p 1.0): steep perspective, windows foreshortened
    const [sc, sx] = mk();
    const KN = 4.4;                                   // nearest visible k
    const side = (xb, s) => {
      const q = [P(xb, BT, KN), P(xb, BT, 1), P(xb, BB + 200, 1), P(xb, BB + 200, KN)];   // near-top, far-top, far-bottom, near-bottom
      roughPoly(sx, q, s < 0 ? '#0e1336' : '#0c102e', { amp: 1.4, seed: 30 + s });
      sx.save(); sx.beginPath(); roughPath(sx, q, { amp: 1.4, seed: 30 + s }); sx.clip();
      { const g = sx.createLinearGradient(P(xb, 0, KN)[0], 0, xb, 0); g.addColorStop(0, rgba('#03040f', .7)); g.addColorStop(1, rgba('#1a2150', .2)); sx.fillStyle = g; sx.fillRect(-PAD, -PAD, LW, LH); }
      hatch(sx, [s < 0 ? -PAD : xb, -PAD, s < 0 ? xb + PAD : LW, LH], { angle: s < 0 ? .5 : -.5, gap: 8, w: 1.1, col: '#03040f', a: .3, seed: 40 + s, broken: .4 });
      // floor bands receding to the VP
      for (let f = 1; f < NF; f++) { const y = yF(f, 0); roughLine(sx, [P(xb, y, KN), P(xb, y, 1)], { w: 3, col: rgba('#252e66', .5), seed: f + 50 + s }); }
      // windows at equal true depth steps
      const Zs = [.92, .74, .58, .45, .34, .26];
      for (const [i, Z] of Zs.entries()) for (let f = 0; f < NF; f++) {
        const k0 = 1 / (Z + .055), k1 = 1 / (Z - .055), cy = yF(f, .5), h = WIN.h * .5;
        if (r() < .08) continue;
        const a = P(xb, cy - h, k0), b = P(xb, cy - h, k1), c = P(xb, cy + h * (f === 0 ? .6 : 1), k1), d = P(xb, cy + h * (f === 0 ? .6 : 1), k0);
        winDark(sx, s < 0 ? [b, a, d, c] : [a, b, c, d], 300 + i * 10 + f + s * 100, r, { curtain: .3, plant: .1, refl: '#2a3470' });
      }
      // a balcony on the right wall, a fire-escape ladder on the left
      if (s > 0) { for (const f of [1, 3]) { const y = yF(f, .9), k0 = 1 / .5, k1 = 1 / .38; roughPoly(sx, [P(xb, y, k0), P(xb, y, k1), P(xb, y + 14, k1), P(xb, y + 14, k0)], '#05061a', { amp: .6, seed: f }); for (let j = 0; j <= 8; j++) { const kk = mix(k0, k1, j / 8); roughLine(sx, [P(xb, y, kk), P(xb, y - 46, kk)], { w: 1.4 * kk, col: '#05061a', seed: j }); } roughLine(sx, [P(xb, y - 46, k0), P(xb, y - 46, k1)], { w: 2 * k1, col: '#05061a', seed: 3 }); } }
      sx.restore();
    };
    side(BL, -1); side(BR, 1);
    // courtyard floor: cobbles receding, the tree's base
    { const q = [P(BL, BB + 200, 1), P(BR, BB + 200, 1), P(BR, BB + 200, 2), P(BL, BB + 200, 2)];
      const fq = [P(BL, BB, 1), P(BR, BB, 1), P(BR, BB, 3), P(BL, BB, 3)]; roughPoly(sx, fq, '#080a20', { amp: 1, seed: 60 });
      sx.save(); sx.beginPath(); roughPath(sx, fq, { amp: 1, seed: 60 }); sx.clip(); for (let k = 0; k < 18; k++) { const kk = 1 + Math.pow(k / 17, 1.6) * 2; roughLine(sx, [P(BL, BB, kk), P(BR, BB, kk)], { w: 1 * kk, col: rgba('#2a3470', .3), seed: k }); } sx.restore(); void q; }
    // ---------------- the tree (p .9): rises from the courtyard just in front of the back wall, left of the window
    const [tc, tx] = mk();
    { const bx0 = 760, by0 = P(0, BB, 1.18)[1]; const rr = prng(5);
      limbL(tx, [[bx0, by0], [bx0 - 10, by0 - 300], [bx0 + 14, by0 - 560]], 26, 12, '#04050f', 1);
      const branch = (x, y, a, len, w, d) => { if (d > 6 || len < 10) return; const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len; limbL(tx, [[x, y], [mix(x, x2, .5) + (rr() - .5) * 12, mix(y, y2, .5)], [x2, y2]], w, w * .62, '#04050f', d * 13 + Math.round(x)); branch(x2, y2, a - .3 - rr() * .35, len * .74, w * .64, d + 1); branch(x2, y2, a + .28 + rr() * .3, len * .7, w * .6, d + 1); if (rr() < .4) branch(x2, y2, a + (rr() - .5) * .3, len * .6, w * .5, d + 2); };
      branch(bx0 + 14, by0 - 540, -.15, 130, 11, 1); branch(bx0 + 4, by0 - 420, -.75, 120, 10, 1); branch(bx0 - 2, by0 - 330, .55, 90, 8, 2); branch(bx0 - 6, by0 - 250, -1.1, 110, 8, 1);
      // a ground ring + bench silhouette
      roughRect(tx, bx0 + 60, by0 - 30, 140, 8, '#04050f', { amp: .5, seed: 2 }); roughRect(tx, bx0 + 66, by0 - 22, 6, 24, '#04050f', { amp: .3, seed: 3 }); roughRect(tx, bx0 + 188, by0 - 22, 6, 24, '#04050f', { amp: .3, seed: 4 });
      for (const [x, w, h] of [[1040, 50, 64], [1096, 52, 60]]) { roughRect(tx, x, by0 - h + 10, w, h, '#05061a', { amp: .6, seed: x }); roughRect(tx, x - 3, by0 - h + 4, w + 6, 8, '#141a42', { amp: .4, seed: x + 1 }); } }
    // ---------------- clothesline across the courtyard, mid depth (p 1.15)
    const [lc2, lx2] = mk();
    { const a = P(BL, 300, 2.1), b = P(BR, 330, 2.1), line = sagLine(a, b, 90, 60); roughLine(lx2, line, { w: 1.8, col: '#03040f', seed: 21 });
      const at = (x) => { for (let i = 1; i < line.length; i++) if (line[i][0] >= x) { const p = line[i - 1], q = line[i], u = (x - p[0]) / (q[0] - p[0]); return [x, mix(p[1], q[1], u)]; } return line[line.length - 1]; };
      for (const [x, w, h, col] of [[-80, 110, 150, '#121842'], [60, 70, 190, '#0e1338'], [1560, 120, 110, '#141a46'], [1700, 70, 160, '#10153c'], [1800, 90, 90, '#171d4a']]) { const [ax, ay] = at(x), [bx2, by2] = at(x + w); roughPoly(lx2, [[ax, ay], [bx2, by2], [bx2 + 3, by2 + h], [ax - 3, ay + h + 6]], col, { amp: 1.6, seed: x + 500 }); lx2.fillStyle = rgba('#3a4688', .25); lx2.fillRect(ax + 4, ay + 6, 3, h - 10); } }
    // ---------------- our own window (p 1.5): frame on the left + bottom sill edge
    const [nc, nx] = mk();
    roughPoly(nx, [[-PAD, -PAD], [-30, -PAD], [-10, H + PAD], [-PAD, H + PAD]], '#020309', { amp: 2, seed: 11 });
    roughPoly(nx, [[-34, -PAD], [24, -PAD], [44, H + PAD], [-14, H + PAD]], '#090b20', { amp: 1.2, seed: 12 });
    nx.fillStyle = rgba('#6a78c8', .22); nx.fillRect(20, -PAD, 2, LH);
    roughPoly(nx, [[-PAD, 1010], [W + PAD, 990], [W + PAD, H + PAD], [-PAD, H + PAD]], '#020309', { amp: 2, seed: 13 });
    nx.fillStyle = rgba('#6a78c8', .2); nx.fillRect(-PAD, 1000, LW, 2);
    // fog layer
    const [fc, fx] = mk(); fog(fx, { y0: 620, y1: 1080, col: '#4a58a8', a: .3, seed: 31, cover: .6, soft: .45, k: .4, sx: .004, sy: .02, edgeTop: .6, edgeBot: .3 });
    return { back: bc, warm: wc, side: sc, tree: tc, line: lc2, near: nc, fog: fc };
  });
}
function heroWindow(ctx, t, on) {
  const { x, y, w, h } = WIN, x0 = x - w / 2, y0 = y - h / 2;
  roughRect(ctx, x0 - 7, y0 - 7, w + 14, h + 14, mixHex('#222a5a', '#6a4a40', on * .7), { amp: .4, seed: 3 });
  const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, mixHex('#06081c', '#b8622a', on)); g.addColorStop(.6, mixHex('#06081c', '#ffb35c', on)); g.addColorStop(1, mixHex('#06081c', '#ffd59a', on));
  ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
  if (on > .05) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
    glowA(ctx, x0 + w * .74, y0 + h * .3, 24, .8 * on, C.amber, '#fff2d6');
    const px = x0 + w * (.36 + .22 * Math.sin(t * .5)), py = y0 + h * .6;   // someone moves in the room
    ctx.fillStyle = rgba('#5a2a14', .7 * on); ctx.beginPath(); ctx.ellipse(px, py - 20, 6.5, 7.5, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(px, py + 12, 12, 24, 0, 0, 7); ctx.fill();
    ctx.fillStyle = rgba('#ffe6c0', .3 * on); ctx.fillRect(x0, y0, w * .17, h);
    ctx.restore();
  }
  ctx.fillStyle = '#1a2150'; ctx.fillRect(x - 1.5, y0, 3, h); ctx.fillRect(x0, y0 + h * .38, w, 3);
  roughRect(ctx, x0 - 10, y0 + h + 4, w + 20, 8, mixHex('#2c3670', '#a07050', on * .6), { amp: .3, seed: 4 });
}
export function drawCourtyard(ctx, t, s, K) {
  const L = layers();
  const on = clamp(sm(lin(K.tOn, K.tOn + .35, t)) * (1 - .3 * Math.sin(Math.PI * lin(K.tOn + .1, K.tOn + .3, t))) * (1 + .03 * Math.sin(t * 3.1)) + .3 * Math.sin(Math.PI * lin(K.pulse, K.pulse + .5, t)), 0, 1.3);
  // camera: tight on the window, pulls back on "frightening" to the whole dark courtyard, then leans in for the push
  const back = qio(lin(K.fright - .3, K.fright + 1.4, t)), lean = ein(lin(K.end - 1.0, K.end + .35, t));
  const z = mix(1.55, 1.0, back) * (1 + .35 * lean);
  const cam = { x: drift(t, 9, 1) * (1 - lean), y: drift(t, 6, 2) * (1 - lean), z };
  lay(ctx, L.back, cam, .8);
  lay(ctx, L.warm, cam, .8, { a: clamp(on), op: 'screen' });
  ctx.save(); camTo(ctx, cam, .8); heroWindow(ctx, t, clamp(on)); ctx.restore();
  lay(ctx, L.tree, cam, .86);
  lay(ctx, L.side, cam, 1.0);
  // the window's light hangs in the air (stippled sprite, additive)
  { const sp = lightSprite('court-win', C.amber, HOT, { k: .5, seed: 3 }), tr = T(cam, .8); spr(ctx, sp, tr.X(WIN.x), tr.Y(WIN.y), 150 * tr.z, .55 * clamp(on)); }
  lay(ctx, L.fog, cam, 1.1, { dx: ((t * 12) % 200) - 100, a: .85 });
  lay(ctx, L.line, cam, 1.18);
  lay(ctx, L.near, cam, 1.5);
  finish(ctx, { vig: .55 });
}
