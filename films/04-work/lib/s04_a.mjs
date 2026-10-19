// Chapter 04, window 1: 4.02 the window and the second plate · 4.03–4.07 G4 free-time curve.
// (4.01, the courtyard, lives in s04_court.mjs.)
import { stipple, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, bloom, cone, vnoise, house, put } from './art.mjs';
import { text } from '../engine.mjs';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, sm, lin, eio, eout, ein, qio, drift, HOT, once, lay2, lay, T, camTo, fig, walk, bob, handAt, glowA, finish, lightSprite, spr, stip, putL } from './s04_util.mjs';
export { drawCourtyard } from './s04_court.mjs';

// =====================================================================================================================
// 4.02 · close on the window: it opens on "actually", someone inside sets a second plate on the sill on "invitation";
// then we look straight down onto that plate, which becomes the sundial of G4 (PLATE = its screen spot at the match)
// =====================================================================================================================
export const PLATE = { x: 960, y: 540, r: 150 };
const X0 = 736, X1 = 1184, Y0 = 150, Y1 = 830, XM = (X0 + X1) / 2;   // window opening
const PADC = 260;
function closeLayers() {
  return once('close', () => {
    const r = prng(77), LW = W + 2 * PADC, LH = H + 2 * PADC;
    const mk = () => { const [c, g] = lay2(LW, LH); g.translate(PADC, PADC); return [c, g]; };
    // ---- wall (in front): plaster with blotches, rain streaks, hatching; the opening is cut out
    const [wc, wx] = mk();
    { const g = wx.createLinearGradient(0, -PADC, 0, H + PADC); g.addColorStop(0, '#222b5e'); g.addColorStop(.6, '#182050'); g.addColorStop(1, '#0c1030'); wx.fillStyle = g; wx.fillRect(-PADC, -PADC, LW, LH); }
    { const [pc, px] = mk(); for (let i = 0; i < 160; i++) { const x = r() * LW - PADC, y = r() * LH - PADC, rr = 40 + r() * 170, g = px.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, rgba(r() < .5 ? '#2e3876' : '#070920', .35)); g.addColorStop(1, 'rgba(0,0,0,0)'); px.fillStyle = g; px.fillRect(x - rr, y - rr, rr * 2, rr * 2); } stip(pc, { k: .85, seed: 7 }); putL(wx, pc); }
    for (let i = 0; i < 300; i++) { const x = r() * LW - PADC, y = r() * LH - PADC, l = 20 + r() * 120; wx.strokeStyle = rgba(r() < .5 ? '#05071a' : '#2e3876', .12 + r() * .1); wx.lineWidth = 1.2; wx.beginPath(); wx.moveTo(x, y); wx.lineTo(x + (r() - .5) * 3, y + l); wx.stroke(); }
    wx.save(); wx.beginPath(); wx.rect(-PADC, -PADC, LW, LH); wx.clip(); hatch(wx, [-PADC, -PADC, LW, LH], { angle: .85, gap: 8, w: 1.1, col: '#04051a', a: .2, seed: 8, broken: .5 }); wx.restore();
    const sur = [[X0 - 46, Y0 - 50], [X1 + 46, Y0 - 50], [X1 + 46, Y1 + 4], [X0 - 46, Y1 + 4]];
    roughPoly(wx, sur, '#2a336c', { amp: 1.4, seed: 4 }); roughRect(wx, X0 - 60, Y0 - 66, X1 - X0 + 120, 22, '#323c7a', { amp: 1, seed: 5 }); roughRect(wx, X0 - 60, Y0 - 46, X1 - X0 + 120, 5, rgba('#04051a', .6), { amp: .5, seed: 6 });
    wx.save(); wx.globalCompositeOperation = 'destination-out'; wx.fillStyle = '#000'; wx.beginPath(); roughPath(wx, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], { amp: 1, seed: 9 }); wx.fill(); wx.restore();
    { const [lc, lx] = mk(); const g = lx.createRadialGradient(XM, Y0 + 400, 60, XM, Y0 + 400, 720); g.addColorStop(0, rgba(C.amber, .5)); g.addColorStop(.45, rgba(C.amber, .14)); g.addColorStop(1, rgba(C.amber, 0)); lx.fillStyle = g; lx.fillRect(-PADC, -PADC, LW, LH);
      lx.globalCompositeOperation = 'destination-in'; lx.drawImage(wc, -PADC, -PADC); stip(lc, { k: .8, seed: 6 }); putL(wx, lc, { op: 'screen' }); }
    roughPoly(wx, [[X0, Y0], [X0 + 26, Y0 + 22], [X0 + 26, Y1 - 4], [X0, Y1]], '#3a2a3a', { amp: .6, seed: 10 });
    roughPoly(wx, [[X1, Y0], [X1 - 26, Y0 + 22], [X1 - 26, Y1 - 4], [X1, Y1]], '#7a4a3a', { amp: .6, seed: 11 });
    roughPoly(wx, [[X0, Y0], [X1, Y0], [X1 - 26, Y0 + 22], [X0 + 26, Y0 + 22]], '#2a2040', { amp: .6, seed: 12 });
    const sillT = [[X0 - 80, Y1 + 2], [X1 + 80, Y1 + 2], [X1 + 104, Y1 + 50], [X0 - 104, Y1 + 50]], sillF = [[X0 - 104, Y1 + 50], [X1 + 104, Y1 + 50], [X1 + 100, Y1 + 80], [X0 - 100, Y1 + 80]];
    roughPoly(wx, sillT, '#4a4670', { amp: 1, seed: 13 }); roughPoly(wx, sillF, '#151a44', { amp: 1, seed: 14 });
    { wx.save(); wx.beginPath(); roughPath(wx, sillT, { amp: 1, seed: 13 }); wx.clip(); const g = wx.createLinearGradient(0, Y1, 0, Y1 + 50); g.addColorStop(0, rgba('#ffc98a', .6)); g.addColorStop(1, rgba('#ffc98a', .06)); wx.fillStyle = g; wx.fillRect(X0 - 120, Y1, X1 - X0 + 240, 60); hatch(wx, [X0 - 120, Y1, X1 - X0 + 240, 60], { angle: .05, gap: 5, w: 1, col: '#2a2440', a: .3, seed: 3 }); wx.restore(); }
    wx.fillStyle = rgba('#05061a', .5); wx.fillRect(X0 - 100, Y1 + 80, X1 - X0 + 200, 18);
    { const x = X0 - 40, y = Y1 + 26; roughPoly(wx, [[x - 26, y - 40], [x + 26, y - 40], [x + 20, y], [x - 20, y]], '#8a4a2e', { amp: .6, seed: 20 }); for (let k = 0; k < 9; k++) { wx.fillStyle = k % 2 ? '#2a4a3a' : '#3a5a42'; wx.beginPath(); wx.ellipse(x + (k - 4) * 6, y - 52 + Math.abs(k - 4) * 3, 5, 15, (k - 4) * .22, 0, 7); wx.fill(); } }
    // ---- the room behind: warm wall, pendant lamp, shelf, picture
    const [ic, ix] = mk();
    { const g = ix.createLinearGradient(0, Y0, 0, Y1); g.addColorStop(0, '#5a2a1a'); g.addColorStop(.5, '#b0602a'); g.addColorStop(1, '#d88a48'); ix.fillStyle = g; ix.fillRect(X0 - 40, Y0 - 40, X1 - X0 + 80, Y1 - Y0 + 80);
      bloom(ix, X1 - 90, Y0 + 170, 420, { col: C.amber, core: '#fff1d0', a: .55, k: .35, seed: 9 });
      roughRect(ix, X0 + 30, Y0 + 250, 190, 8, '#4a2214', { amp: .5, seed: 1 }); for (let i = 0; i < 5; i++) roughRect(ix, X0 + 40 + i * 34, Y0 + 202 + (i % 2) * 8, 22, 48 - (i % 2) * 8, ['#8a4a2a', '#6a3420', '#a0603a', '#7a2a1a'][i % 4], { amp: .5, seed: i + 9 });
      roughRect(ix, X1 - 170, Y0 + 290, 80, 100, '#4a2214', { amp: .5, seed: 3 }); roughRect(ix, X1 - 162, Y0 + 298, 64, 84, '#d9a070', { amp: .4, seed: 4 });
      ix.strokeStyle = '#3a160a'; ix.lineWidth = 2; ix.beginPath(); ix.moveTo(X1 - 90, Y0 - 40); ix.lineTo(X1 - 90, Y0 + 140); ix.stroke(); roughPoly(ix, [[X1 - 124, Y0 + 168], [X1 - 56, Y0 + 168], [X1 - 72, Y0 + 136], [X1 - 108, Y0 + 136]], '#3a160a', { amp: .4, seed: 5 });
      cone(ix, X1 - 90, Y0 + 168, { spread: .5, len: 520, col: '#ffe0b0', a: .3, k: .4, seed: 6 });
      ix.save(); ix.beginPath(); ix.rect(X0, Y0, X1 - X0, Y1 - Y0); ix.clip(); hatch(ix, [X0, Y0, X1 - X0, Y1 - Y0], { angle: -.7, gap: 6, w: 1, col: '#3a1408', a: .22, seed: 3 }); ix.restore(); }
    return { wall: wc, room: ic };
  });
}
// plate seen at an angle (k = 0 nearly side-on, 1 = straight down); optional sundial marks
export function plate(ctx, x, y, rx, k, { a = 1, light = 1, shadowAng = null, gnomon = 0 } = {}) {
  const ry = rx * mix(.3, 1, k);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rgba('#05061a', .4); ctx.beginPath(); ctx.ellipse(x + rx * .05, y + ry * .14 + 3, rx * 1.03, ry * 1.03, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#ddd4c0'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
  const g = ctx.createLinearGradient(x - rx, y - ry, x + rx, y + ry); g.addColorStop(0, rgba('#fff6e2', .9 * light)); g.addColorStop(.55, rgba('#f3efe2', 0)); g.addColorStop(1, rgba('#6a5a7a', .5)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba('#9a8a8a', .55); ctx.lineWidth = Math.max(1, rx * .022); ctx.beginPath(); ctx.ellipse(x, y + ry * .03, rx * .68, ry * .68, 0, 0, 7); ctx.stroke();
  ctx.strokeStyle = rgba('#c98a48', .75); ctx.lineWidth = Math.max(1, rx * .018); ctx.beginPath(); ctx.ellipse(x, y, rx * .9, ry * .9, 0, 0, 7); ctx.stroke();
  if (shadowAng !== null && gnomon > 0) {
    ctx.strokeStyle = rgba('#5a4a5a', .6 * gnomon); ctx.lineWidth = Math.max(1, rx * .014);
    for (let i = 0; i < 13; i++) { const an = -Math.PI + i / 12 * Math.PI; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * rx * .73, y + Math.sin(an) * ry * .73); ctx.lineTo(x + Math.cos(an) * rx * (i % 3 ? .8 : .85), y + Math.sin(an) * ry * (i % 3 ? .8 : .85)); ctx.stroke(); }
    const sx = x + Math.cos(shadowAng) * rx * .88, sy = y + Math.sin(shadowAng) * ry * .88;
    ctx.strokeStyle = rgba('#1a1438', .7 * gnomon); ctx.lineWidth = Math.max(2, rx * .045); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(sx, sy); ctx.stroke();
    ctx.fillStyle = rgba('#3a2a4a', gnomon); ctx.beginPath(); ctx.arc(x, y, rx * .055, 0, 7); ctx.fill();
  }
  ctx.restore();
}
// a casement leaf hinged at the opening's edge, swinging out toward us by th (rad); perspective about the frame centre
function leaf(ctx, th, { right = true } = {}) {
  const Lw = XM - X0, D = 1500, hx = right ? X1 : X0, dir = right ? -1 : 1;
  const proj = (px, py, depth) => { const k = 1 / (1 - depth / D); return [960 + (px - 960) * k, 470 + (py - 470) * k]; };
  const fx = hx + dir * Lw * Math.cos(th), fd = Lw * Math.sin(th);
  const q = [proj(hx, Y0 + 4, 0), proj(fx, Y0 + 4, fd), proj(fx, Y1 - 4, fd), proj(hx, Y1 - 4, 0)];
  const m = (u, v) => { const a = [mix(q[0][0], q[1][0], u), mix(q[0][1], q[1][1], u)], b = [mix(q[3][0], q[2][0], u), mix(q[3][1], q[2][1], u)]; return [mix(a[0], b[0], v), mix(a[1], b[1], v)]; };
  ctx.beginPath(); ctx.moveTo(...q[0]); ctx.lineTo(...q[1]); ctx.lineTo(...q[2]); ctx.lineTo(...q[3]); ctx.closePath();
  const g = ctx.createLinearGradient(q[0][0], q[0][1], q[2][0], q[2][1]); g.addColorStop(0, rgba('#c9d4ff', .1 + .12 * Math.sin(th))); g.addColorStop(.4, rgba('#c9d4ff', .02)); g.addColorStop(.75, rgba('#1a1d40', .18 * Math.sin(th))); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#2a1c2c'; ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.stroke();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(...m(0, .34)); ctx.lineTo(...m(1, .34)); ctx.moveTo(...m(.5, 0)); ctx.lineTo(...m(.5, .34)); ctx.stroke();
  ctx.strokeStyle = rgba('#ffcf8a', .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...m(1, 0)); ctx.lineTo(...m(1, 1)); ctx.stroke();
  const [hx2, hy2] = m(.92, .55); ctx.fillStyle = '#c9a070'; ctx.fillRect(hx2 - 3, hy2 - 14, 6, 28);
}
const HIP_X = 840, HIP_Y = 905, SP = 3.6;
const POSE_LAND = { lean: .55, head: .45, sh: [2.15, .1], el: [.05, .3], hip: [.05, -.05], kn: [0, 0] };
export function drawWindowPlate(ctx, t, s, K) {
  const L = closeLayers();
  const reach = eio(lin(K.open + .15, K.land, t)), back = eio(lin(K.land + .35, K.land + 1.1, t));
  const hip = [mix(800, HIP_X, reach) - back * 40, HIP_Y];
  const pose = { lean: mix(.12, .55, reach) * (1 - back) + .05 * back, head: mix(.15, .45, reach) * (1 - back) + .1, sh: [mix(1.5, 2.15, reach) * (1 - back) + .3 * back, .1], el: [mix(.9, .05, reach) * (1 - back) + .6 * back, .3], hip: [.05, -.05], kn: [0, 0], hair: 'bun', bulk: 1.05 };
  const [hdx, hdy] = handAt(pose, SP), hand = [hip[0] + hdx, hip[1] + hdy];
  const landed = t >= K.land;
  const [lx, ly] = handAt(POSE_LAND, SP), p2 = [HIP_X + lx + 8, HIP_Y + ly + 14];
  const plX = landed ? p2[0] : hand[0] + 8, plY = landed ? p2[1] : hand[1] + 14 - 6 * Math.sin(Math.PI * lin(K.land - .2, K.land, t));
  const u = qio(lin(K.down, K.end, t)), zEnd = PLATE.r / 92;
  const cam = { x: drift(t, 8, 3) * (1 - u) + mix(0, p2[0] - 960, u), y: drift(t, 5, 1) * (1 - u) + mix(-60, p2[1] - 540, u), z: mix(1.0 + .05 * lin(K.start, K.down, t), zEnd, u) };
  lay(ctx, L.room, cam, .9);
  ctx.save(); camTo(ctx, cam, .95);
  ctx.beginPath(); ctx.rect(X0, Y0, X1 - X0 + 200, Y1 - Y0 + 40); ctx.clip();
  fig(ctx, hip[0], hip[1] + Math.sin(t * 1.6) * 1.5, SP, pose, { dress: { coat: '#3a1a14', pants: '#2a120c', skin: '#5a2a1a', hair: '#1a0a06' }, rim: '#ffcf8a', rimSide: -1, rimW: 4, shadeA: .25, shadeCol: '#1a0806' });
  ctx.restore();
  const th = eout(lin(K.open, K.open + .8, t)) * 1.25;
  ctx.save(); camTo(ctx, cam, 1); leaf(ctx, 0, { right: false }); ctx.restore();
  lay(ctx, L.wall, cam, 1);
  ctx.save(); camTo(ctx, cam, 1);
  leaf(ctx, th, { right: true });
  const k = sm(lin(K.down + .05, K.end - .05, t));
  plate(ctx, 860, Y1 + 30, 70, .08 + .5 * k, { a: 1 - k });
  ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = '#e9e0cc'; ctx.beginPath(); ctx.moveTo(838, Y1 - 6); ctx.lineTo(882, Y1 - 6); ctx.lineTo(876, Y1 + 30); ctx.lineTo(844, Y1 + 30); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#e9e0cc'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(886, Y1 + 10, 10, -1.3, 1.3); ctx.stroke(); ctx.restore();
  if (reach > .02 || landed) plate(ctx, plX, plY, 70, landed ? mix(.08, 1, k) : .1 + .1 * (1 - reach), { light: 1 });
  if (!landed || back < .3) { ctx.save(); ctx.globalAlpha = landed ? 1 - back / .3 : sm(reach * 4); ctx.fillStyle = '#4a2214'; ctx.beginPath(); ctx.ellipse(hand[0] + 2, hand[1] + 4, 13, 9, -.4, 0, 7); ctx.fill(); ctx.strokeStyle = rgba('#ffcf8a', .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(hand[0] + 2, hand[1] + 4, 13, 9, -.4, -2.6, -.6); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  const dk = sm(lin(K.down + .2, K.end - .05, t));
  if (dk > 0) {
    ctx.save(); ctx.globalAlpha = dk; const g = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 1100); g.addColorStop(0, '#171a4c'); g.addColorStop(1, '#0b0f2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
    const tr = T(cam, 1); plate(ctx, tr.X(p2[0]), tr.Y(p2[1]), 70 * tr.z * mix(1, 92 / 70, k), mix(.08, 1, k), { shadowAng: mix(-2.6, -2.0, lin(K.down, K.end, t)), gnomon: dk });
  }
  finish(ctx, { vig: .45 });
}

// =====================================================================================================================
// 4.03–4.07 · G4: the free-time curve (Sharif, Mogilner & Hershfield 2021, JPSP); curve schematic
// =====================================================================================================================
const GX0 = 300, GX1 = 1640, GY0 = 820, GY1 = 280, HM = 8;
const px = (h) => GX0 + (h / HM) * (GX1 - GX0), py = (v) => GY0 - v * (GY0 - GY1);
const f = (h) => { const rise = 1 - Math.exp(-h / .8); const dip = h > 5 ? Math.pow((h - 5) / 3, 1.6) * .24 : 0; return .12 + .7 * rise - dip; };
const gq = (h) => { const rise = 1 - Math.exp(-h / .8); return .12 + .7 * rise + (h > 5 ? (h - 5) * .006 : 0); };
const P = (h) => [px(h), py(f(h))], PG = (h) => [px(h), py(gq(h))];
const FE = { a: [PG(8)[0] + 150, PG(8)[1] - 40], b: [2470, PG(8)[1] - 30], sag: 70 };
const FPTS = sagLine(FE.a, FE.b, FE.sag, 40);
const DOTS = (() => { const r = prng(23), out = []; for (let i = 0; i < 420; i++) { const h = Math.min(7.9, Math.max(.05, Math.pow(r(), .8) * 8)), soc = r() < .5; const v = (h > 5 && soc ? gq(h) : f(h)) + (r() + r() + r() - 1.5) * .13; out.push({ h, v, soc: h > 5 && soc, d: Math.hypot(px(h) - GX0, py(v) - GY0), p: r() * 7, s: r() }); } return out; })();
function g4Layers() {
  return once('g4', () => {
    const OX = 840, OY = 210, mk = () => { const [c, g] = lay2(3600, 1500); g.translate(OX, OY); return [c, g]; };
    const [dc, dx] = mk(); const r = prng(19); for (let i = 0; i < 2600; i++) { const x = r() * 3600 - OX, y = r() * 1500 - OY, m = r(); dx.fillStyle = rgba(m > .7 ? '#d8f7ff' : '#a49fc4', .05 + .18 * m * m); const s = m > .97 ? 2 : 1; dx.fillRect(x, y, s, s); }
    const [vc, vx] = mk();
    for (const [x, y, rr, a] of [[900, 520, 900, .24], [2250, 440, 700, .16]]) { const g = vx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, rgba('#4a3f8e', a)); g.addColorStop(1, rgba('#4a3f8e', 0)); vx.fillStyle = g; vx.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    stip(vc, { k: .55, seed: 3 });
    const [hc, hx] = mk(); const rr = prng(31);
    const lit = (wx, wy, q) => q() < .5 ? .7 + q() * .3 : 0;
    house(hx, rr, FE.a[0] - 30, 1180, 230, 1180 - FE.a[1] - 20, { wall: '#1a1f52', roof: 'steep', lit, amp: 1.2, floorH: 70, colW: 70, wscale: 1.6, chimney: 1, bay: 0 });
    house(hx, rr, FE.b[0] + 70, 1180, 260, 1180 - FE.b[1] - 30, { wall: '#1d2256', roof: 'gable', lit, amp: 1.2, floorH: 70, colW: 70, wscale: 1.6, chimney: 1, bay: 0 });
    { const [lc, lx] = mk(); for (const x of [FE.a[0] - 30, FE.b[0] + 70]) { const g = lx.createRadialGradient(x, 900, 0, x, 900, 420); g.addColorStop(0, rgba(C.amber, .25)); g.addColorStop(1, rgba(C.amber, 0)); lx.fillStyle = g; lx.fillRect(x - 420, 480, 840, 840); } lx.globalCompositeOperation = 'destination-in'; lx.drawImage(hc, -OX, -OY); stip(lc, { k: .7, seed: 4 }); putL(hx, lc, { op: 'screen' }); }
    return { dust: dc, violet: vc, houses: hc };
  });
}
function writeOn(ctx, s, x, y, u, o) {
  if (u <= 0 || (o.alpha ?? 1) <= 0) return; ctx.save(); ctx.font = `${o.size}px "${o.font || 'Inter'}"`; const w = ctx.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.beginPath(); ctx.rect(x0 - 10, y - o.size * 1.3, (w + 20) * u, o.size * 1.8); ctx.clip(); text(ctx, s, x, y, o); ctx.restore();
}
function curvePath(ctx, h0, h1, fn = f, step = .03) { ctx.beginPath(); let first = true; for (let h = h0; h <= h1 + 1e-6; h += step) { const hh = Math.min(h, h1), x = px(hh), y = py(fn(hh)); first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false; } }
export function drawG4(ctx, t, s, K) {
  const L = g4Layers();
  const kRise = sm(lin(K.helps - .4, K.helps + .9, t)) * (1 - sm(lin(K.after - .3, K.after + .9, t)));
  const kDip = sm(lin(K.mostly - .3, K.mostly + 1.3, t)) * (1 - sm(lin(K.which - .9, K.which + .3, t)));
  const kEnd = qio(lin(K.where + .05, K.where + 1.25, t));
  const cam = {
    x: drift(t, 8, 2) + kRise * -170 + kDip * 140 + kEnd * (mix(FE.a[0], FE.b[0], .5) - 960),
    y: drift(t, 5, 1) + kRise * 40 + kDip * 30 + kEnd * (FE.a[1] + 70 - 540),
    z: 1 + .12 * kRise + .14 * kDip + .25 * kEnd,
  };
  { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0f2a'); g.addColorStop(1, '#151845'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  lay(ctx, L.violet, cam, .5); lay(ctx, L.dust, cam, .7);
  const gOut = 1 - sm(lin(K.where + .2, K.where + .85, t));
  ctx.save(); camTo(ctx, cam, 1);
  const pm = eio(lin(K.start + .35, K.time - .1, t)), pr = mix(PLATE.r, 30, pm), pxy = [mix(PLATE.x, GX0, pm), mix(PLATE.y, GY0, pm)];
  const ang = mix(-2.0, 0, eio(lin(K.start, K.time - .15, t)));
  const axis = eio(lin(K.time - .2, K.time + .7, t));
  const plA = 1 - sm(lin(K.time + .4, K.time + 1.1, t));
  if (plA > 0) plate(ctx, pxy[0], pxy[1], pr, 1, { a: plA, shadowAng: ang, gnomon: 1 });
  if (axis > 0) { ctx.strokeStyle = rgba(C.muted, .7 * gOut); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(GX0, GY0); ctx.lineTo(mix(GX0, GX1 + 30, axis), GY0); ctx.stroke(); glowA(ctx, mix(GX0, GX1 + 30, axis), GY0, 24, .5 * (1 - lin(.85, 1, axis)), C.amber, HOT); }
  const yax = eio(lin(K.happy - .35, K.happy + .5, t));
  if (yax > 0) { ctx.strokeStyle = rgba(C.muted, .7 * gOut); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(GX0, GY0); ctx.lineTo(GX0, mix(GY0, GY1 - 30, yax)); ctx.stroke(); }
  for (let h = 0; h <= HM; h++) { const a = sm(lin(K.time + .1 + h * .07, K.time + .5 + h * .07, t)) * gOut; if (a <= 0) continue; ctx.fillStyle = rgba(C.muted, .6 * a); ctx.fillRect(px(h) - .75, GY0, 1.5, 8); text(ctx, String(h), px(h), GY0 + 38 + (1 - a) * 8, { size: 22, color: C.muted, align: 'center', alpha: a }); }
  text(ctx, 'FREE TIME PER DAY (HOURS)', (GX0 + GX1) / 2, GY0 + 84, { size: 15, weight: 600, color: C.muted, spacing: 5, align: 'center', alpha: sm(lin(K.time + .3, K.time + 1, t)) * gOut });
  { const a = sm(lin(K.happy, K.happy + .7, t)) * gOut; ctx.save(); ctx.translate(GX0 - 44, (GY0 + GY1) / 2); ctx.rotate(-Math.PI / 2); text(ctx, 'LIFE SATISFACTION', 0, 0, { size: 15, weight: 600, color: C.muted, spacing: 5, align: 'center', alpha: a }); ctx.restore(); }
  { const cA = 1 - .72 * sm(lin(K.helps, K.point + .3, t)), soc = sm(lin(K.which + .1, K.where, t)), lone = sm(lin(K.alone - .4, K.alone + .4, t));
    for (const d of DOTS) {
      const a = sm(lin(K.time + .3 + d.d / 1500 * 1.6, K.time + .6 + d.d / 1500 * 1.6, t)) * gOut; if (a <= 0) continue;
      const x = px(d.h), y = py(d.v) + Math.sin(t * .8 + d.p) * 2;
      let col = mixHex('#a49fc4', '#f3efe2', d.s), al = (.35 + .4 * d.s) * cA;
      if (d.soc) { col = mixHex(col, HOT, soc); al = mix(al, .9, soc); }
      if (d.h > 5 && !d.soc) col = mixHex(col, '#6a64a8', lone);
      ctx.fillStyle = rgba(col, al * a); const r = 2 + 1.2 * d.s + (1 - a) * 3; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    } }
  const band = sm(lin(K.point - .5, K.point + .3, t)) * gOut, band5 = sm(lin(K.after + .2, K.after + .8, t)) * gOut;
  if (band > 0) {
    ctx.fillStyle = rgba(C.amber, .05 * band5); ctx.fillRect(px(2), GY1 - 60, px(5) - px(2), GY0 - GY1 + 60);
    ctx.strokeStyle = rgba(C.amber, .45 * band); ctx.setLineDash([3, 6]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px(2), mix(GY0, GY1 - 60, band)); ctx.lineTo(px(2), GY0); ctx.stroke();
    if (band5 > 0) { ctx.strokeStyle = rgba(C.amber, .45 * band5); ctx.beginPath(); ctx.moveTo(px(5), mix(GY0, GY1 - 60, band5)); ctx.lineTo(px(5), GY0); ctx.stroke(); }
    ctx.setLineDash([]);
    text(ctx, '2 h', px(2) + 10, GY1 - 36, { size: 26, font: 'Instrument Serif', color: C.amber, alpha: band });
    text(ctx, '5 h', px(5) + 10, GY1 - 36, { size: 26, font: 'Instrument Serif', color: C.amber, alpha: band5 });
  }
  { const a = sm(lin(K.more - .1, K.more + .6, t)) * gOut; ctx.fillStyle = rgba(C.amber, a); ctx.fillRect(GX0, 110, 28, 2);
    text(ctx, 'More free time helps, up to a point.', GX0, 180 + (1 - a) * 12, { size: 58, font: 'Instrument Serif', color: C.cream, alpha: a }); }
  const hA = mix(0, 3.6, eio(lin(K.helps - .55, K.point + .1, t))), hB = mix(3.6, 8, eio(lin(K.after - .1, K.hurt + .1, t)));
  const hHead = t < K.after - .1 ? hA : hB, cool = sm(lin(K.alone - .9, K.alone + .2, t));
  if (hHead > 0) {
    const hSplit = Math.min(hHead, 5);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.amber, .2); ctx.lineWidth = 18; curvePath(ctx, 0, hSplit); ctx.stroke();
    ctx.strokeStyle = rgba(C.amber, .3); ctx.lineWidth = 8; curvePath(ctx, 0, hSplit); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba(C.cream, mix(1, .5, 1 - gOut)); ctx.lineWidth = 4.2; curvePath(ctx, 0, hSplit); ctx.stroke();
    if (hHead > 5) {
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(mixHex(C.amber, '#4a428e', cool), .2); ctx.lineWidth = 16; curvePath(ctx, 5, hHead); ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = rgba(mixHex('#f3efe2', '#8f88c0', cool), gOut); ctx.lineWidth = 4; curvePath(ctx, 5 - .02, hHead); ctx.stroke();
    }
    ctx.restore();
    if (t < K.hurt + .3) { const [hx, hy] = P(hHead); glowA(ctx, hx, hy, 34, .75, C.amber, '#fff3dd'); }
  }
  { const u = lin(K.point, K.point + 1.1, t); if (u > 0 && u < 1) { const [x, y] = P(2.2); ctx.strokeStyle = rgba(C.amber, .7 * (1 - u)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 10 + 50 * eout(u), 0, 7); ctx.stroke(); } }
  writeOn(ctx, 'alone, nothing in particular', px(5.35), py(f(6.6)) + 80, sm(lin(K.alone - .15, K.alone + .9, t)), { size: 32, font: 'Instrument Serif', color: '#c9c4e6', alpha: gOut });
  { const a = sm(lin(K.alone - .6, K.alone + .4, t)) * gOut; if (a > 0) { const h = 7.0, [x, y] = P(h), sl = Math.atan2(P(h + .05)[1] - y, P(h + .05)[0] - x);
      ctx.save(); ctx.translate(x, y - 1); ctx.rotate(sl);
      fig(ctx, 0, -20, .5, { lean: .38 + .02 * Math.sin(t * 1.1), head: .55, sh: [.75, .55], el: [.95, 1.05], hip: [1.5, 1.4], kn: [1.62, 1.52], hair: 'short' }, { dress: { coat: '#2a2758', pants: '#171535', skin: '#8f86b8', hair: '#151230' }, rim: '#8f88c0', rimSide: -1, rimW: 1.3, alpha: a });
      ctx.restore(); } }
  const gu = eio(lin(K.which + .05, K.where - .1, t));
  if (gu > 0) {
    const h1 = mix(5, 8, gu);
    for (let h = 5; h <= h1; h += .13) { const [x, y] = PG(h), tw = .75 + .25 * Math.sin(t * 3 + h * 7); glowA(ctx, x, y, 13, .35 * tw, C.amber, HOT); ctx.fillStyle = rgba(HOT, .95); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fill(); }
    writeOn(ctx, 'with people, or on something that matters', px(6.55), PG(6.5)[1] - 150, sm(lin(K.which + .3, K.which + 1.3, t)), { size: 32, font: 'Instrument Serif Italic', color: HOT, align: 'center', alpha: gOut });
    const wu = sm(lin(K.where + .1, K.where + .6, t)); if (wu > 0) { ctx.strokeStyle = rgba('#05061a', .8 * wu); ctx.lineWidth = 2; ctx.beginPath(); const [ex, ey] = PG(8); ctx.moveTo(ex, ey); ctx.quadraticCurveTo(mix(ex, FE.a[0], .5), ey + 18, FE.a[0], FE.a[1]); ctx.stroke(); }
  }
  { const a = sm(lin(K.where + .15, K.where + .8, t)); if (a > 0) {
      lay(ctx, L.houses, cam, 1, { a });
      ctx.strokeStyle = rgba('#05061a', .9 * a); ctx.lineWidth = 2.2; ctx.beginPath(); FPTS.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
      for (let i = 1; i < 40; i += 2) { const [x, y] = FPTS[i], on = sm(lin(K.where + .25 + i * .015, K.where + .45 + i * .015, t)) * (.8 + .2 * Math.sin(t * 2.6 + i)); glowA(ctx, x, y + 7, 30, .5 * on, C.amber, HOT); ctx.fillStyle = rgba(HOT, on); ctx.beginPath(); ctx.ellipse(x, y + 7, 3.6, 4.8, 0, 0, 7); ctx.fill(); ctx.fillStyle = rgba('#05061a', on); ctx.fillRect(x - 1.5, y, 3, 3); }
  } }
  {
    const a = sm(lin(K.helps - .6, K.helps - .1, t));
    if (a > 0) {
      const w1 = mix(0, 3.4, eio(lin(K.helps - .5, K.point + .5, t)));
      const w2 = mix(3.4, 4.75, sm(lin(K.point + .5, K.which, t)));
      const w3 = mix(4.75, 8, eio(lin(K.where - .25, K.where + .7, t)));
      const hW = t < K.point + .5 ? w1 : t < K.where - .25 ? w2 : w3;
      const onG = sm(lin(K.where - .25, K.where, t));
      const fu = eio(lin(K.where + .6, K.where + 1.7, t));
      let x, y;
      if (fu > 0) { const wire = [PG(8), [mix(PG(8)[0], FE.a[0], .5), PG(8)[1] + 12], FE.a, ...FPTS.slice(1, 22)], n = wire.length - 1, q = fu * n, i = Math.min(n - 1, Math.floor(q)), qq = q - i; x = mix(wire[i][0], wire[i + 1][0], qq); y = mix(wire[i][1], wire[i + 1][1], qq); }
      else [x, y] = hW <= 5 ? P(hW) : [px(hW), mix(py(f(hW)), py(gq(hW)), onG)];
      const moving = (t > K.helps - .5 && t < K.which) || (t > K.where - .25 && t < K.where + 1.7);
      const dist = (t < K.point + .5 ? w1 : t < K.where - .25 ? w2 : w3) * 3.3 + fu * 5;
      const ph = dist * .5, amp = moving ? 1 : .12, S = .62;
      const pose = walk(ph, amp, { hair: 'curly', head: moving ? .04 : .12 + .06 * Math.sin(t * .8) });
      glowA(ctx, x, y, 80, .22 * a, C.amber, HOT);
      fig(ctx, x, y - 88 * S + bob(ph, S, amp) + (moving ? 0 : Math.sin(t * 1.7) * .6), S, pose, { dress: { coat: '#e59a3a', pants: '#1a1830', shoes: '#0d0c1c', skin: '#e9c3a0', hair: '#2a1a14' }, light: { x: x + 200, y: y - 300, col: HOT, a: .5 }, rim: HOT, rimSide: 1, rimW: 1.8, alpha: a });
    }
  }
  ctx.restore();
  { const b = sm(lin(K.start + .8, K.start + 1.6, t)) * (1 - sm(lin(K.where, K.where + .5, t)));
    text(ctx, 'Sharif, Mogilner & Hershfield (2021), 35,000+ Americans · Journal of Personality and Social Psychology · curve schematic', GX0, 1012, { size: 17, color: C.muted, alpha: .85 * b }); }
  finish(ctx, { grain: .05, vig: .4 });
}
