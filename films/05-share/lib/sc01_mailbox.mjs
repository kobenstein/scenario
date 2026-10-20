// C1 · H.08 "So whose fortune will it be?" — a wall of brass mailboxes in a cold hallway, seen at an angle (vanishing point far
// left). The share light rises into the frame (it followed the camera up from the map), searches along the boxes, stops mid-air on
// "whose", hesitates between two boxes, then pulls a thread off to the right (carrier into H.09).
//   mailboxWall(o) → { layer (cached 1920×1080 canvas), flaps: [{ x, y, w, h }] }   o: { seed }   (reusable: any wall of names)
//   mailboxShot(ctx, t, K)
import { W, H, rgba, clamp, lin, mix, eout, eio, ein, sm, prng, drift, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';
import { scribble } from './paper.mjs';
import { shareLight } from './share.mjs';
import { ghostLine } from './ghost.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const bump = (u) => Math.sin(Math.PI * clamp(u));
// the wall in perspective: u along the wall (0 far … 1 near), v up/down (-1 … 1)
const F = 900, CX = 960, CY = 520;
const P = (u, v) => { const X = mix(-2.2, 1.15, u), Z = mix(4.0, 1.05, u), Y = v * .62; return [CX + X / Z * F, CY + Y / Z * F]; };
export function mailboxWall(o = {}) {
  return once('wall' + (o.seed ?? 1), () => {
    const [c, g] = canvas(W, H), r = prng(o.seed ?? 1), flaps = [];
    // hallway: dark ceiling, cold light falling on the wall from above left, a dull floor with a sheen
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0d1220'); bg.addColorStop(.5, '#141b2c'); bg.addColorStop(1, '#090c14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // the wall surface behind the boxes
    const [a0, a1, b1, b0] = [P(-.7, -1.15), P(1.2, -1.15), P(1.2, 1.15), P(-.7, 1.15)];
    g.fillStyle = '#1c2232'; g.beginPath(); g.moveTo(...a0); g.lineTo(...a1); g.lineTo(...b1); g.lineTo(...b0); g.closePath(); g.fill();
    // floor plane below the wall
    const fl = g.createLinearGradient(0, 700, 0, H); fl.addColorStop(0, '#0b0f19'); fl.addColorStop(1, '#151a26'); g.fillStyle = fl; g.beginPath(); g.moveTo(...b0); g.lineTo(...b1); g.lineTo(W + 200, H + 50); g.lineTo(-200, H + 50); g.closePath(); g.fill();
    const COLS = 26, ROWS = 7, U0 = -.5, U1 = 1.0, V0 = -.92, V1 = .92;
    for (let i = 0; i < COLS; i++) for (let j = 0; j < ROWS; j++) {
      const u0 = mix(U0, U1, i / COLS), u1 = mix(U0, U1, (i + 1) / COLS), v0 = mix(V0, V1, j / ROWS), v1 = mix(V0, V1, (j + 1) / ROWS);
      const p00 = P(u0 + .002, v0 + .01), p10 = P(u1 - .002, v0 + .01), p01 = P(u0 + .002, v1 - .01);
      const BW = 100, BH = 66;
      g.save(); g.setTransform((p10[0] - p00[0]) / BW, (p10[1] - p00[1]) / BW, (p01[0] - p00[0]) / BH, (p01[1] - p00[1]) / BH, p00[0], p00[1]);
      const tone = .75 + .5 * r();
      const fr = g.createLinearGradient(0, 0, 0, BH); fr.addColorStop(0, rgba('#a78452', .95)); fr.addColorStop(1, rgba('#5f4524', .95)); g.fillStyle = fr; g.fillRect(0, 0, BW, BH);
      g.fillStyle = `rgba(${Math.round(70 * tone)},${Math.round(52 * tone)},${Math.round(30 * tone)},1)`; g.fillRect(5, 5, BW - 10, BH - 10);
      g.strokeStyle = 'rgba(20,12,4,.7)'; g.lineWidth = 1.2; g.strokeRect(5, 5, BW - 10, BH - 10);
      // the flap (a brass strip with a slot above it)
      g.fillStyle = 'rgba(10,6,2,.9)'; g.fillRect(16, 14, BW - 32, 4);
      const fg = g.createLinearGradient(0, 18, 0, 31); fg.addColorStop(0, '#d8b06a'); fg.addColorStop(1, '#8c6634'); g.fillStyle = fg; g.fillRect(16, 18, BW - 32, 13);
      g.strokeStyle = 'rgba(255,240,200,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(17, 19.5); g.lineTo(BW - 17, 19.5); g.stroke();
      // the name plate: someone's name in handwriting (never readable)
      g.fillStyle = '#e6dcc2'; g.fillRect(30, 40, 40, 13); g.strokeStyle = 'rgba(40,28,14,.6)'; g.lineWidth = .8; g.strokeRect(30, 40, 40, 13);
      if (r() < .86) scribble(g, 33, 49, 34, 6, { seed: i * 13 + j * 7, ink: 'rgba(30,26,40,.85)', lw: 1 });
      // hinges
      g.fillStyle = 'rgba(30,20,8,.8)'; g.fillRect(8, 12, 3, 8); g.fillRect(8, BH - 20, 3, 8);
      g.restore();
      const fc = P((u0 + u1) / 2, mix(v0, v1, .36)), fw = Math.abs(p10[0] - p00[0]) * .68;
      flaps.push({ x: fc[0], y: fc[1], w: fw, h: Math.abs(p01[1] - p00[1]) * .2, u: (u0 + u1) / 2 });
    }
    // the cold hallway light: a pool on the near part of the wall from a ceiling lamp, darkness toward the far end
    const lp = g.createRadialGradient(1250, 120, 0, 1250, 120, 1100); lp.addColorStop(0, 'rgba(170,200,240,.2)'); lp.addColorStop(.5, 'rgba(140,170,220,.07)'); lp.addColorStop(1, 'rgba(140,170,220,0)'); g.globalCompositeOperation = 'lighter'; g.fillStyle = lp; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
    const dk = g.createLinearGradient(200, 0, 900, 0); dk.addColorStop(0, 'rgba(6,8,14,.92)'); dk.addColorStop(1, 'rgba(6,8,14,0)'); g.fillStyle = dk; g.fillRect(0, 0, W, H);
    const fv = g.createLinearGradient(0, 760, 0, H); fv.addColorStop(0, 'rgba(6,8,14,0)'); fv.addColorStop(1, 'rgba(6,8,14,.6)'); g.fillStyle = fv; g.fillRect(0, 0, W, H);
    stipple(c, { k: .3, g: 1, seed: 17, mid: false, boost: 1 });
    return { layer: c, flaps };
  });
}
function glow(R) { return once('mg' + R, () => { const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,190,110,.6)'); rg.addColorStop(.3, 'rgba(255,160,80,.2)'); rg.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); return c; }); }
// the light's path in screen px: rises in from below, searches left, stops on "whose", hesitates, leaves right pulling a thread
// in: the 'up' move (K.t08 - .5 … + .1) — the light holds its screen point (1375, 700) while the wall slides in under it;
// out: the 'left' move (K.t09 ± .275) — it holds its screen point again while the wall slides away (the hands arrive under it)
export const LIGHT_IN = [1375, 700];
function lightAt(t, K) {
  const ta = K.t08 - .5, tb = K.t08 + .1, stop = K.whose + .02;
  if (t < tb) { const e = eio(clamp((t - ta) / .6)); return [LIGHT_IN[0], LIGHT_IN[1] + (1 - e) * H]; }
  if (t < stop) { const u = clamp((t - tb) / (stop - tb)), e = eout(u); return [mix(LIGHT_IN[0], 760, e), mix(LIGHT_IN[1], 470, e) - 60 * bump(u)]; }
  const h = t - stop, hx = 760 + 26 * Math.sin(h * 2.1) * sm(clamp(h / .5)) + 34 * sm(clamp((t - (K.whose + .7)) / .4)) - 58 * sm(clamp((t - (K.whose + 1.3)) / .45)), hy = 470 + 10 * Math.sin(h * 3.3) * sm(clamp(h / .5));
  const e = eio(clamp((t - (K.t09 - .275)) / .55)); return [hx + e * W, hy];
}
export function mailboxShot(ctx, t, K) {
  const M = mailboxWall(), push = clamp((t - K.t08 + .3) / 3);
  ctx.save(); const z = 1.03 + .04 * push; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + drift(t, 6, 1) - 20 * push, -H / 2 + drift(t, 4, 2));
  ctx.drawImage(M.layer, 0, 0);
  const [lx, ly] = lightAt(t, K), on = 1;
  // warm reflections in the brass flaps near the light (each box it passes lights up a little)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const f of M.flaps) { const d = Math.hypot(f.x - lx, f.y - ly); if (d > 300) continue; const q = (1 - d / 300) ** 2 * on; ctx.fillStyle = `rgba(255,190,110,${.55 * q})`; ctx.beginPath(); ctx.ellipse(f.x + (lx - f.x) * .08, f.y, f.w * .45, Math.max(1.5, f.h * .5), 0, 0, Math.PI * 2); ctx.fill(); }
  const G = glow(320); ctx.globalAlpha = on; ctx.drawImage(G, lx - 320, ly - 320); ctx.restore();
  // the thread it pulls when it leaves
  const go = K.t09 - .45; if (t > go) { const [hx, hy] = lightAt(go, K), q = clamp((t - go) / .3); ghostLine(ctx, [[hx - 260 * q, hy + 24 * q], [hx, hy], [lx, ly]], { ghost: 1, col: '#ffe2b0', w: 2.4, a: .9 * q, dot: 9, t }); }
  shareLight(ctx, lx, ly, 17, t, { a: on });
  ctx.restore();
  const vg = ctx.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 1150); vg.addColorStop(0, 'rgba(4,5,10,0)'); vg.addColorStop(1, 'rgba(4,5,10,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}
