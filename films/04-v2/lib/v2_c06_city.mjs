// C06 (Film 4 v2) · take 2 (owner c06): inside the fog the camera has turned across the water; the fog settles onto the water and
// uncovers the city you left (6.13), the camera crosses the water toward it (6.14): office towers and thousands of apartment windows,
// all flickering cyan in one rhythm; one window on the quay is still warm: the camera flies into it → the flat (6.15–6.19, v2_c06_flat).
// World: cm, y DOWN, the quay top at Y = 0, the water at Y = WATER; the camera looks along +Z (pinhole, as in your room).
//   far towers    Z = 160000  cached (bodies + a window mask that flickers as one)
//   mid towers    Z =  80000  cached
//   the quay row  Z =  QZ     live vector (the hero block in it, with the warm window you fly into)
//   the apartment behind the hero window: local coords = world − (HX, HY, QZ + 30)  (window opening centred at 0, facade at local Z −30)
import { W, H, rgba, clamp, mix, sm, prng, canvas } from '../engine.mjs';
import { TAU, once, mono, mixC, mixH, shadeH, flick, s5, pr, plane, SCREEN, SCREEN_HOT } from './v2_c06_kit.mjs';
import { fogDraw, fogX } from './v2_c06_fog.mjs';
import { makeFlat, warmFlat, FLATWIN } from './v2_c06_flat.mjs';

export const QZ = 46000, WATER = 260, HX = 1650, HY = -1130;
const FARZ = 160000, MIDZ = 80000;
// the common rhythm of every screen in town (after 6.12 the hill's windows flicker with it too)
export const syncF = (t) => flick(t, .5, 0);

// ---------------------------------------------------------------- cached tower layers (plane units = cm at their depth)
function towers(seed, n, x0, x1, hMin, hMax, wMin, wMax) { const r = prng(seed), B = []; let x = x0; while (x < x1) { const w = wMin + r() * (wMax - wMin), h = hMin + Math.pow(r(), 1.5) * (hMax - hMin); B.push({ x, w, h, top: r(), seed: Math.floor(r() * 1e6), tone: r() }); x += w * (.8 + r() * .35); } return B; }
const FARB = towers(161, 0, -150000, 150000, 6000, 26000, 2400, 6400);
const MIDB = towers(262, 0, -80000, 80000, 2600, 9000, 1500, 3600);
function layer(kind) {
  return once('c06city:' + kind, () => {
    const far = kind.startsWith('far'), win = kind.endsWith('win'), B = far ? FARB : MIDB, res = far ? .011 : .02, X0 = far ? -150000 : -80000, X1 = -X0, Y0 = far ? -30000 : -11000, Y1 = 600;
    const w = Math.ceil((X1 - X0) * res), h = Math.ceil((Y1 - Y0) * res), [c, g] = canvas(w, h); g.setTransform(res, 0, 0, res, -X0 * res, -Y0 * res);
    for (const b of B) {
      const r = prng(b.seed), x0 = b.x, x1 = b.x + b.w, top = -b.h;
      if (!win) {
        const col = far ? mixH('#141a3c', '#1b2248', b.tone) : mixH('#10152f', '#171d3e', b.tone);
        g.fillStyle = col; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0, top);
        if (b.top < .3) { g.lineTo(x0 + b.w * .2, top); g.lineTo(x0 + b.w * .2, top - b.w * .25); g.lineTo(x1 - b.w * .2, top - b.w * .25); g.lineTo(x1 - b.w * .2, top); }
        else if (b.top < .45) { g.lineTo((x0 + x1) / 2, top - b.w * .5); }
        g.lineTo(x1, top); g.lineTo(x1, 0); g.closePath(); g.fill();
        // engraved vertical lines, the lit edge (the moon from the left)
        g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1 / res * .9; g.beginPath(); for (let xx = x0 + b.w * .55; xx < x1; xx += 3 / res) { g.moveTo(xx, top); g.lineTo(xx, 0); } g.stroke();
        g.fillStyle = 'rgba(150,170,230,.25)'; g.fillRect(x0, top, 1.6 / res, b.h);
        if (r() < .4) { g.fillStyle = 'rgba(255,80,70,.9)'; g.fillRect((x0 + x1) / 2 - .8 / res, top - b.w * (b.top < .3 ? .25 : b.top < .45 ? .5 : 0) - 3 / res, 1.6 / res, 1.6 / res); }
      } else {
        // windows: a grid; most of them screens (cyan), a few warm, many dark
        const fw = far ? 220 : 160, fh = far ? 330 : 300, ww = fw * .55, wh = fh * .5;
        for (let y = top + fh * .8; y < -fh * .5; y += fh) for (let x = x0 + fw * .4; x < x1 - ww; x += fw) {
          const q = r(); if (q < .38) continue;
          g.fillStyle = q < .93 ? 'rgba(160,236,255,1)' : 'rgba(255,200,130,1)'; g.fillRect(x, y, ww, wh);
        }
      }
    }
    return c;
  });
}
export async function warmCity() { for (const k of ['far', 'farwin', 'mid', 'midwin']) layer(k); await warmFlat(); }

// ---------------------------------------------------------------- the quay row (live): apartment blocks, the hero block
const QROW = (() => { const r = prng(377), B = []; let x = -16000; while (x < 16000) { const w = 1300 + r() * 1300, h = 1700 + r() * 1300; B.push({ x, w, h, seed: Math.floor(r() * 1e6), tone: r() }); x += w + 60 + r() * 200; } return B; })();
const HERO = (() => { const b = QROW.reduce((a, b) => (Math.abs(b.x + b.w / 2 - HX) < Math.abs(a.x + a.w / 2 - HX) ? b : a)); return b; })();
function quayRow(ctx, c, t, f, warmA) {
  const k = plane(ctx, c, QZ);
  for (const b of QROW) {
    const hero = b === HERO, x0 = hero ? HX - 1050 : b.x, x1 = hero ? HX + 1050 : b.x + b.w, top = hero ? -2350 : -b.h, r = prng(b.seed);
    if ((x1 - c.x) * k + W / 2 + (c.ox || 0) < -50 || (x0 - c.x) * k + W / 2 + (c.ox || 0) > W + 50) continue;
    ctx.fillStyle = mixH('#151a36', '#1c2244', b.tone); ctx.fillRect(x0, top, x1 - x0, -top);
    ctx.fillStyle = shadeH(mixH('#151a36', '#1c2244', b.tone), .25); ctx.fillRect(x0 - 20, top - 30, x1 - x0 + 40, 40);
    ctx.fillStyle = 'rgba(150,170,230,.3)'; ctx.fillRect(x0 - 20, top - 30, x1 - x0 + 40, Math.max(4, 1.5 / k));
    // floors of windows (screens flicker together; the hero window is warm)
    const fh = 330, fw = 300;
    for (let j = 0, y = top + 120; y < -260; y += fh, j++) for (let i = 0, x = x0 + 110; x < x1 - 150; x += fw, i++) {
      const isHero = hero && Math.abs(x + 60 - HX) < 140 && Math.abs(y + 80 - HY) < 160; if (isHero) continue;
      const q = r(), wx = x, wy = y; ctx.fillStyle = '#080a18'; ctx.fillRect(wx - 8, wy - 8, 136, 176);
      if (q < .3) { ctx.fillStyle = '#0b0e22'; ctx.fillRect(wx, wy, 120, 160); continue; }
      const scr = q < .9, a = scr ? .55 + .45 * f : .85;
      ctx.fillStyle = scr ? mixC('#3a7d98', '#cff4ff', a) : '#ffcf8a'; ctx.fillRect(wx, wy, 120, 160);
      ctx.fillStyle = 'rgba(8,10,24,.6)'; ctx.fillRect(wx + 58, wy, 4, 160); ctx.fillRect(wx, wy + 60, 120, 4);
      if (k > .2) { ctx.fillStyle = 'rgba(10,12,30,.5)'; ctx.fillRect(wx + 6, wy + 70, 44, 90); }
    }
    // engraved courses and the ground floor: shop fronts with awnings (closed), the quay lamps' warm glow at their feet
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(1.4 / k, 3); ctx.beginPath(); for (let y = top + 330 * .9; y < 0; y += 330) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
    ctx.fillStyle = '#0a0c1c'; ctx.fillRect(x0, -260, x1 - x0, 260);
  }
  // the hero window (the apartment seen from far: a warm lamp, later the TV) is drawn by the flat; its frame here
  ctx.fillStyle = '#05060f'; ctx.fillRect(HX - FLATWIN.hw - 10, HY - FLATWIN.hh - 10, FLATWIN.hw * 2 + 20, FLATWIN.hh * 2 + 20);
  // quay lamps along the water
  for (let x = -16000; x < 16000; x += 1500) { const sx = (x - c.x) * k + W / 2 + (c.ox || 0); if (sx < -80 || sx > W + 80) continue; ctx.fillStyle = '#0a0b16'; ctx.fillRect(x - 12, -520, 24, 520); ctx.fillStyle = '#ffd9a0'; ctx.fillRect(x - 30, -560, 60, 50);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, -535, 0, x, -535, 420); g.addColorStop(0, rgba('#ffb35c', .5)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(x - 420, -955, 840, 840); ctx.restore(); }
}

// ---------------------------------------------------------------- the take
export function makeCityTake(A, HO) {
  const FL = makeFlat(A, HO);
  // camera (world cm). Start: on the hill's quay, 9 m above the water, looking across; then the push into the hero window.
  const Zw = QZ - 30, d0 = Zw;   // distance to the hero facade at the start
  const qz = (d) => Math.asinh(d / 50), dq = (q) => 50 * Math.sinh(q);
  const into = A.why2 + .1;   // the window covers the frame
  const KD = mono([[A.swap, d0], [A.honest + .4, d0 - 1800], [A.why1 - .1, d0 - 4200], [A.why1 + .6, 24000], [A.now - .3, 7000], [A.now + .3, 1500], [A.nowE + .05, 420], [into - .12, 140], [into, 92], [into + .4, 30]].map(([t, d]) => [t, qz(d)]));
  // the window's screen anchor while outside: from where it sits in the panorama to the centre
  const c0 = { x: 0, y: -900, F: 1500, oy: 150 }, sxA = W / 2 + (HX - c0.x) * c0.F / d0, syA = H / 2 + c0.oy + (HY - c0.y) * c0.F / d0;
  const KSX = mono([[A.swap, sxA], [A.why1 - .1, sxA], [A.now - .2, mix(sxA, W / 2, .7)], [A.nowE, W / 2], [into + 1, W / 2]]);
  const KSY = mono([[A.swap, syA], [A.why1 - .1, syA], [A.now - .2, mix(syA, H / 2, .7)], [A.nowE, H / 2], [into + 1, H / 2]]);
  const KOY = mono([[A.swap, c0.oy], [A.why1, c0.oy], [A.nowE, 0], [into + 1, 0]]);
  const cam = (t) => {
    const d = dq(KD(t)), oy = KOY(t), F = c0.F;
    const x = HX - (KSX(t) - W / 2) * d / F + 30 * Math.sin(t * .23) * clamp(d / 20000), y = HY - (KSY(t) - H / 2 - oy) * d / F;
    return { x, y, z: Zw - d, F, ox: 0, oy, d };
  };
  // the fog: full at the swap, sweeping (the turn), then settling onto the water by "honest"
  const KFOG = mono([[A.swap, -260], [A.turn1 - .2, -200], [A.honest + .1, 420], [A.honest + .9, 640], [A.why1 + .4, 700]]);
  function draw(ctx, t) {
    if (t >= into - .02) { FL.draw(ctx, t); return; }   // inside the window: the flat's own camera continues this one
    const c = cam(t), f = syncF(t), k = c.F;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // sky: deep night, the city's glow low on the horizon
    const hy = H / 2 + c.oy + (0 - c.y) * c.F / (FARZ - c.z);
    const sg = ctx.createLinearGradient(0, 0, 0, hy); sg.addColorStop(0, '#05071a'); sg.addColorStop(.7, '#121a44'); sg.addColorStop(1, '#2a3a6e'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
    { const r = prng(5); for (let i = 0; i < 160; i++) { const x = r() * W, y = r() * hy * .85, a = (.2 + .5 * r()) * (.6 + .4 * Math.sin(t * 1.3 + i)); ctx.fillStyle = rgba('#f3efe2', a * (1 - y / hy)); ctx.fillRect(x, y, 1.4, 1.4); } }
    // far and mid towers, their window masks flickering as one
    for (const [kind, Z, res, X0, Y0] of [['far', FARZ, .011, -150000, -30000], ['mid', MIDZ, .02, -80000, -11000]]) {
      const kk = plane(ctx, c, Z), im = layer(kind), iw = layer(kind + 'win');
      ctx.drawImage(im, X0, Y0, im.width / res, im.height / res);
      ctx.globalAlpha = (kind === 'far' ? .55 : .7) * (.55 + .45 * f); ctx.drawImage(iw, X0, Y0, iw.width / res, iw.height / res); ctx.globalAlpha = 1;
      // reflection in the water: the same layer mirrored about the water line, darker, broken into ripples
      ctx.save(); ctx.setTransform(kk, 0, 0, -kk, W / 2 + (c.ox || 0) - c.x * kk, H / 2 + c.oy + (2 * WATER - c.y) * kk);
      ctx.globalAlpha = .28; ctx.drawImage(im, X0, Y0, im.width / res, im.height / res); ctx.globalAlpha = .3 * (.55 + .45 * f); ctx.drawImage(iw, X0, Y0, iw.width / res, iw.height / res); ctx.restore(); ctx.globalAlpha = 1;
    }
    // the water: from the quay of the far shore to the camera (dark, with engraved ripple lines catching the screens' light)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const wy = H / 2 + c.oy + (WATER - c.y) * c.F / (QZ - c.z);
    const wg = ctx.createLinearGradient(0, wy, 0, H); wg.addColorStop(0, 'rgba(14,20,52,.55)'); wg.addColorStop(1, 'rgba(5,7,20,.92)'); ctx.fillStyle = wg; ctx.fillRect(0, wy, W, H - wy);
    ctx.strokeStyle = rgba(SCREEN, .1 + .06 * f); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 70; i++) { const yy = wy + 4 + i * i * .22; if (yy > H) break; const x0 = (i * 397 + t * 30 * (1 + i * .05)) % (W + 400) - 200; ctx.moveTo(x0, yy); ctx.lineTo(x0 + 80 + i * 6, yy); } ctx.stroke();
    // the quay row with the hero block, its reflection
    quayRow(ctx, c, t, f);
    FL.window(ctx, t, c, { x: HX, y: HY, z: QZ });   // the hero window: the flat seen from outside (warm), clipped to its opening
    ctx.restore();
    // the low fog on the water, its top edge the fog that filled the frame
    const fe = KFOG(t); fogDraw(ctx, t, { edge: fe, x: fogX(t, A), tint: { x: W / 2, y: fe + 200, r: 1200, col: SCREEN, a: .1 + .06 * f } });
  }
  return { draw, cam, into };
}
