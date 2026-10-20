// C06 (Film 4 v2) · take 2 (owner c06): inside the fog the camera has turned across the water; the fog settles onto the water and
// uncovers the city you left (6.13), the camera crosses the water toward it (6.14): office towers and thousands of apartment windows,
// every screen flickering in the hill's one rhythm (kit syncF = maslow4's synced screen flicker); one window on the quay is still warm
// (a lamp): the camera flies into it → the flat (6.15–6.19, v2_c06_flat).
// ONE camera for the whole take, in the flat's local cm (y down, looking along +Z; the window opening centred at 0, the facade's outer
// face at local Z −30). The world (cm, y down, the quay top at Y 0, the water at Y = WATER) is the local frame shifted:
//   world = local + (HX, HY, QZ + 30)      far towers Z 160000 · mid towers Z 80000 (cached) · the quay row Z = QZ (live vector)
// Outside, the camera is placed so the hero window sits at a screen anchor that drifts to the centre (no pan, no cut); once the
// opening covers the frame only the flat is drawn (the same projection, so nothing jumps).
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { TAU, once, mono, mixC, mixH, shadeH, s5, plane, SCREEN, SCREEN_HOT, syncF } from './v2_c06_kit.mjs';
import { fogDraw, fogX } from './v2_c06_fog.mjs';
import { makeFlat, warmFlat, FLATWIN } from './v2_c06_flat.mjs';

export const QZ = 46000, WATER = 260, HX = 1650, HY = -1130;
const FARZ = 160000, MIDZ = 80000, OZ = QZ + 30;
const fN = (t) => clamp((syncF(t) - .58) / .46);   // the common screen rhythm, 0..1

// ---------------------------------------------------------------- cached tower layers (plane units = cm at their depth)
function towers(seed, x0, x1, hMin, hMax, wMin, wMax) { const r = prng(seed), B = []; let x = x0; while (x < x1) { const w = wMin + r() * (wMax - wMin), h = hMin + Math.pow(r(), 1.5) * (hMax - hMin); B.push({ x, w, h, top: r(), seed: Math.floor(r() * 1e6), tone: r() }); x += w * (.8 + r() * .35); } return B; }
const FARB = towers(161, -150000, 150000, 6000, 26000, 2400, 6400);
const MIDB = towers(262, -80000, 80000, 2600, 9000, 1500, 3600);
const LAY = { far: { Z: FARZ, res: .011, X0: -150000, Y0: -30000 }, mid: { Z: MIDZ, res: .02, X0: -80000, Y0: -11000 } };
function layer(kind) {
  return once('c06city:' + kind, () => {
    const far = kind.startsWith('far'), win = kind.endsWith('win'), B = far ? FARB : MIDB, { res, X0, Y0 } = LAY[far ? 'far' : 'mid'], X1 = -X0, Y1 = 600;
    const w = Math.ceil((X1 - X0) * res), h = Math.ceil((Y1 - Y0) * res), [c, g] = canvas(w, h); g.setTransform(res, 0, 0, res, -X0 * res, -Y0 * res);
    for (const b of B) {
      const r = prng(b.seed), x0 = b.x, x1 = b.x + b.w, top = -b.h;
      if (!win) {
        g.fillStyle = far ? mixH('#141a3c', '#1b2248', b.tone) : mixH('#10152f', '#171d3e', b.tone); g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0, top);
        if (b.top < .3) { g.lineTo(x0 + b.w * .2, top); g.lineTo(x0 + b.w * .2, top - b.w * .25); g.lineTo(x1 - b.w * .2, top - b.w * .25); g.lineTo(x1 - b.w * .2, top); }
        else if (b.top < .45) g.lineTo((x0 + x1) / 2, top - b.w * .5);
        g.lineTo(x1, top); g.lineTo(x1, 0); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1 / res * .9; g.beginPath(); for (let xx = x0 + b.w * .55; xx < x1; xx += 3 / res) { g.moveTo(xx, top); g.lineTo(xx, 0); } g.stroke();
        g.fillStyle = 'rgba(150,170,230,.25)'; g.fillRect(x0, top, 1.6 / res, b.h);
        if (r() < .4) { g.fillStyle = 'rgba(255,80,70,.9)'; g.fillRect((x0 + x1) / 2 - .8 / res, top - b.w * (b.top < .3 ? .25 : b.top < .45 ? .5 : 0) - 3 / res, 1.6 / res, 1.6 / res); }
      } else {
        const fw = far ? 220 : 160, fh = far ? 330 : 300, ww = fw * .55, wh = fh * .5;
        for (let y = top + fh * .8; y < -fh * .5; y += fh) for (let x = x0 + fw * .4; x < x1 - ww; x += fw) { const q = r(); if (q < .38) continue; g.fillStyle = q < .95 ? 'rgba(160,236,255,1)' : 'rgba(255,200,130,1)'; g.fillRect(x, y, ww, wh); }
      }
    }
    return c;
  });
}
export async function warmCity() { for (const k of ['far', 'farwin', 'mid', 'midwin']) layer(k); await warmFlat(); }

// ---------------------------------------------------------------- the quay row (live): apartment blocks; the hero block on the window grid
const FW = 300, FH = 330, WW = 120, WH = 160;
const QROW = (() => { const r = prng(377), B = []; let x = -16000; while (x < 16000) { const w = 1300 + r() * 1300, h = 1700 + r() * 1300; B.push({ x, w, h, seed: Math.floor(r() * 1e6), tone: r() }); x += w + 60 + r() * 200; } return B; })();
const HERO = QROW.reduce((a, b) => (Math.abs(b.x + b.w / 2 - HX) < Math.abs(a.x + a.w / 2 - HX) ? b : a));
// a window: dark, a screen (glow; up close the backs of heads before a far-wall TV, curtains or blinds), or warm (rare)
function win(ctx, x, y, kind, f, k, v) {
  ctx.fillStyle = '#06070f'; ctx.fillRect(x - 6, y - 6, WW + 12, WH + 12);
  if (kind === 0) { ctx.fillStyle = '#0c0f24'; ctx.fillRect(x, y, WW, WH); }
  else if (kind === 4) { ctx.fillStyle = mixC('#e8913c', '#ffd28e', .5); ctx.fillRect(x, y, WW, WH); }
  else {
    if (k < .05) { ctx.fillStyle = mixC('#2c5f88', '#8fe6ff', .35 + .6 * f); ctx.fillRect(x, y, WW, WH); }
    else {
      const g = ctx.createLinearGradient(0, y, 0, y + WH); g.addColorStop(0, mixC('#14304c', '#2c5f88', f)); g.addColorStop(1, mixC('#3c86b0', '#8fe6ff', f)); ctx.fillStyle = g; ctx.fillRect(x, y, WW, WH);
      ctx.fillStyle = '#07091a';
      if (kind === 2) {   // a far-wall TV, the sofa's back, one or two heads
        const tx = x + 30 + v * 50; ctx.fillStyle = mixC('#bff3ff', '#ffffff', f); ctx.fillRect(tx, y + 58, 30, 19); ctx.fillStyle = '#07091a';
        ctx.fillRect(x + 6, y + 112, WW - 12, 48); ctx.beginPath(); ctx.arc(x + 40 + v * 20, y + 104, 10, 0, TAU); ctx.arc(x + 74 + v * 16, y + 106, 9.5, 0, TAU); ctx.fill();
        ctx.fillRect(x + 28 + v * 20, y + 108, 24, 8); ctx.fillRect(x + 63 + v * 16, y + 110, 22, 6);
      } else if (kind === 3) { for (let yy = y + 4; yy < y + WH; yy += 11) ctx.fillRect(x, yy, WW, 5.5); }
      else { ctx.fillRect(x, y, 24 + v * 10, WH); ctx.fillRect(x + WW - 22 - v * 8, y, 22 + v * 8, WH); }
    }
  }
  if (k > .03) { ctx.fillStyle = '#0a0b18'; ctx.fillRect(x + WW / 2 - 2.5, y, 5, WH); ctx.fillRect(x, y + 50, WW, 5); ctx.fillStyle = '#2a2c46'; ctx.fillRect(x - 10, y + WH + 6, WW + 20, 8); }
}
function quayRow(ctx, cw, t, f, hold) {
  const k = plane(ctx, cw, QZ), sx = (X) => (X - cw.x) * k + W / 2 + (cw.ox || 0);
  for (const b of QROW) {
    const hero = b === HERO, x0 = hero ? HX - 1070 : b.x, x1 = hero ? HX + 1030 : b.x + b.w, top = hero ? HY - 1190 : -b.h, r = prng(b.seed);
    if (sx(x1 + 40) < -50 || sx(x0 - 40) > W + 50) continue;
    const col = mixH('#151a36', '#1c2244', b.tone);
    ctx.fillStyle = col; ctx.fillRect(x0, top, x1 - x0, -top);
    ctx.fillStyle = shadeH(col, .25); ctx.fillRect(x0 - 20, top - 30, x1 - x0 + 40, 40); ctx.fillStyle = 'rgba(150,170,230,.3)'; ctx.fillRect(x0 - 20, top - 30, x1 - x0 + 40, Math.max(4, 1.5 / k));
    // engraved courses (and, up close, the plaster's hatch)
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = Math.max(1.2 / k, 2); ctx.beginPath(); for (let y = top + FH * .9; y < -260; y += FH) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
    if (k > .12) { ctx.strokeStyle = 'rgba(160,170,230,.05)'; ctx.lineWidth = 1 / k; ctx.beginPath(); for (let x = x0 + 7; x < x1; x += 7 + 3 / k) { ctx.moveTo(x, top); ctx.lineTo(x - 30, -260); } ctx.stroke(); }
    for (let y = top + 120; y < -260; y += FH) for (let x = x0 + 110; x < x1 - 150; x += FW) {
      const q = r(), v = r(); if (hero && Math.abs(x + WW / 2 - HX) < 10 && Math.abs(y + WH / 2 - HY) < 10) continue;   // the hero window: the flat's
      if (sx(x + WW) < -10 || sx(x) > W + 10) continue;
      const kind = q < .26 ? 0 : (!hero && q > .965) ? 4 : q < .55 ? 2 : q < .75 ? 3 : 1;
      win(ctx, x, y, kind, f, k, v);
    }
    // the ground floor: closed shop fronts, a door's warm transom
    ctx.fillStyle = '#0a0c1c'; ctx.fillRect(x0, -260, x1 - x0, 260); ctx.fillStyle = '#121429'; for (let x = x0 + 60; x < x1 - 200; x += 420) ctx.fillRect(x, -220, 300, 200);
    if (r() < .5) { ctx.fillStyle = 'rgba(255,190,120,.6)'; ctx.fillRect(x0 + (x1 - x0) * .5, -250, 90, 22); }
  }
  // the quay edge and its lamps (warm pools on the stone)
  ctx.fillStyle = '#0d0e1c'; ctx.fillRect(-17000, 0, 34000, WATER); ctx.fillStyle = 'rgba(150,160,210,.25)'; ctx.fillRect(-17000, 0, 34000, Math.max(3, 1.2 / k));
  for (let x = -16000; x < 16000; x += 1500) { if (sx(x) < -200 || sx(x) > W + 200) continue; ctx.fillStyle = '#0a0b16'; ctx.fillRect(x - 12, -520, 24, 520); ctx.fillStyle = '#ffd9a0'; ctx.fillRect(x - 30, -560, 60, 50);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, -535, 0, x, -535, 420); g.addColorStop(0, rgba('#ffb35c', .42)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(x - 420, -955, 840, 840); ctx.restore(); }
}
// the quay row's reflection: its screens as broken vertical streaks on the water (drawn in screen space below the quay line)
function reflection(ctx, cw, t, f) {
  const k = cw.F / (QZ - cw.z), wl = H / 2 + cw.oy + (WATER - cw.y) * k; if (wl > H) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; const r = prng(612);
  for (let i = 0; i < 260; i++) { const X = -16000 + r() * 32000, sxx = W / 2 + (X - cw.x) * k, warm = r() < .08, len = (60 + r() * 220) * k * 6; if (sxx < -10 || sxx > W + 10) continue;
    for (let j = 0; j < 6; j++) { const yy = wl + 2 + j * len / 6 + 3 * Math.sin(t * 1.3 + i + j), ww = Math.max(1, 70 * k) * (1 + .6 * Math.sin(t * 2 + i * 3 + j)); ctx.fillStyle = rgba(warm ? '#ffbf7a' : SCREEN, (warm ? .12 : .06 + .08 * f) * (1 - j / 6)); ctx.fillRect(sxx - ww / 2, yy, ww, Math.max(1, len / 10)); } }
  ctx.restore();
}

// ---------------------------------------------------------------- the take
export function makeCityTake(A, HO, T1) {
  const FL = makeFlat(A, HO), into = A.why2 + .1, ins = FL.keys, F = 1500;
  const qz = (z) => Math.asinh(z / 50), zq = (q) => 50 * Math.sinh(q);
  const KZ = mono([[A.swap, -OZ], [A.honest + .4, -OZ + 1800], [A.why1 - .1, -OZ + 4200], [A.why1 + .6, -24030], [A.now - .3, -7030], [A.now + .3, -1530], [A.nowE + .05, -450], [into - .12, -170], [into, -122], ...ins.map((k) => [k[0], k[3]])].map(([t, z]) => [t, qz(z)]));
  const KX = mono([[A.swap, 0], [into, 0], ...ins.map((k) => [k[0], k[1]])]), KY = mono([[A.swap, 0], [into, 0], ...ins.map((k) => [k[0], k[2]])]);
  const KOY = mono([[A.swap, 150], [A.why1, 150], [A.nowE, 0], [into, 0], ...ins.map((k) => [k[0], k[4]])]);
  // the hero window's screen anchor while outside (where it sits in the first panorama → the centre)
  const sxA = W / 2 + HX * F / QZ, syA = H / 2 + 150 + (HY + 900) * F / QZ;
  const KSX = mono([[A.swap, sxA], [A.why1 - .1, sxA], [A.now - .2, mix(sxA, W / 2, .7)], [A.nowE, W / 2], [into + 1, W / 2]]);
  const KSY = mono([[A.swap, syA], [A.why1 - .1, syA], [A.now - .2, mix(syA, H / 2, .7)], [A.nowE, H / 2], [into + 1, H / 2]]);
  const cam = (t) => {
    const z = zq(KZ(t)), d = Math.max(0, -30 - z), oy = KOY(t);
    let x = KX(t) - (KSX(t) - W / 2) * d / F, y = KY(t) - (KSY(t) - H / 2 - oy) * d / F;
    const hd = s5((t - (into + .3)) / .6) * (1 - s5((t - A.didnt) / .5));   // a breath of hand-held drift inside, gone before the plate
    if (hd > 0) { x += hd * (1.4 * Math.sin(t * .53) + .7 * Math.sin(t * 1.31)); y += hd * 1.0 * Math.sin(t * .71 + 1); }
    return { x, y, z, F, ox: 0, oy };
  };
  // the fog: the full frame at the swap (the same edge as take 1 there), it settles onto the water by "honest"; then it lies on the water
  const fe0 = T1 ? T1.fogEdge(A.swap) : -200;
  const feQ0 = H / 2 + 150 + (-60 + 900) * F / QZ;   // the fog's top at the far quay, seen from the start
  const KFOG = mono([[A.swap, fe0], [A.turn1 - .2, Math.max(fe0, -200)], [A.honest + .1, 420], [A.honest + .9, 640], [A.why1 + .4, 700]]);
  function draw(ctx, t) {
    const c = cam(t), op = FL.opening(c);
    if (!op || (op.l <= 0 && op.r >= W && op.t <= 0 && op.b >= H)) { FL.draw(ctx, t, c); return; }
    const cw = { x: c.x + HX, y: c.y + HY, z: c.z + OZ, F, ox: 0, oy: c.oy }, f = fN(t);
    const kf = F / Math.max(1, QZ - cw.z), feQ = H / 2 + cw.oy + (-60 - cw.y) * kf, fe = KFOG(t) + Math.max(0, Math.min(feQ, H + 400) - feQ0);
    const fog = () => fogDraw(ctx, t, { edge: fe, x: fogX(t, A), tint: { x: W / 2, y: Math.min(H, fe + 260), r: 1100, col: SCREEN, a: .12 + .08 * syncF(t) } });
    if (fe < -152) { fog(); return; }   // the fog's opaque body covers the whole frame: nothing under it can show
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // does the hero block alone fill the frame? (then the far city is hidden behind it)
    const kq = F / (QZ - cw.z), bl = W / 2 + (HX - 1070 - cw.x) * kq, br = W / 2 + (HX + 1030 - cw.x) * kq, bt = H / 2 + cw.oy + (HY - 1190 - cw.y) * kq, bb = H / 2 + cw.oy + (0 - cw.y) * kq;
    if (!(bl < 0 && br > W && bt < 0 && bb > H)) {
      // the sky (the hill's night palette), stars, the city's cold glow breathing with the screens
      const hy = H / 2 + cw.oy + (0 - cw.y) * F / (FARZ - cw.z);
      const sg = ctx.createLinearGradient(0, 0, 0, hy); sg.addColorStop(0, '#04050f'); sg.addColorStop(.5, '#0a0e28'); sg.addColorStop(.85, '#171742'); sg.addColorStop(1, '#24224c'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
      { const r = prng(5); for (let i = 0; i < 220; i++) { const x = r() * W, y = r() * hy * .8, a = (.2 + .5 * r()) * (.7 + .3 * Math.sin(t * 1.3 + i)); ctx.fillStyle = rgba('#f3efe2', a * (1 - y / hy)); ctx.fillRect(x, y, 1.4, 1.4); } }
      { const g = ctx.createRadialGradient(W / 2, hy, 0, W / 2, hy, 900); g.addColorStop(0, rgba('#5fb8d8', .14 + .08 * f)); g.addColorStop(1, rgba('#5fb8d8', 0)); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
      for (const kind of ['far', 'mid']) {
        const { Z, res, X0, Y0 } = LAY[kind], kk = plane(ctx, cw, Z), im = layer(kind), iw = layer(kind + 'win');
        ctx.drawImage(im, X0, Y0, im.width / res, im.height / res);
        ctx.globalAlpha = (kind === 'far' ? .5 : .65) * (.45 + .55 * f); ctx.drawImage(iw, X0, Y0, iw.width / res, iw.height / res); ctx.globalAlpha = 1;
        ctx.save(); ctx.setTransform(kk, 0, 0, -kk, W / 2 - cw.x * kk, H / 2 + cw.oy + (2 * WATER - cw.y) * kk);
        ctx.globalAlpha = .26; ctx.drawImage(im, X0, Y0, im.width / res, im.height / res); ctx.globalAlpha = .28 * (.45 + .55 * f); ctx.drawImage(iw, X0, Y0, iw.width / res, iw.height / res); ctx.restore(); ctx.globalAlpha = 1;
      }
      // the water between the far shore and the quay
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const wy = H / 2 + cw.oy + (WATER - cw.y) * F / (MIDZ - cw.z), wq = H / 2 + cw.oy + (WATER - cw.y) * kq;
      const wg = ctx.createLinearGradient(0, wy, 0, H); wg.addColorStop(0, 'rgba(14,20,52,.5)'); wg.addColorStop(1, 'rgba(5,7,20,.9)'); ctx.fillStyle = wg; ctx.fillRect(0, wy, W, H - wy);
      ctx.strokeStyle = rgba(SCREEN, .08 + .06 * f); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 60; i++) { const yy = wy + 3 + i * i * .2; if (yy > wq) break; const x0 = (i * 397 + t * 30 * (1 + i * .05)) % (W + 400) - 200; ctx.moveTo(x0, yy); ctx.lineTo(x0 + 80 + i * 6, yy); } ctx.stroke();
      if (wq < H) { ctx.fillStyle = '#04050e'; ctx.fillRect(0, wq, W, H - wq); }
      reflection(ctx, cw, t, f);
    }
    quayRow(ctx, cw, t, f);
    ctx.restore();
    // the hero window: the flat seen from outside, the reveals, the casements, the sill
    FL.windowView(ctx, t, c);
    // the fog lying on the water (its top edge slides down out of frame as the camera nears the quay)
    fog();
  }
  return { draw, cam, into };
}
