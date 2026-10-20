// v1 · "Eine Welt" (one world, nothing is ever deleted; Kurzgesagt / 3Blue1Brown principle)
// Every sentence is a change to the same picture. The rosette of light over the city condenses into the seal of a certificate that the
// light engraves into the night sky; the seal spools a thread that lays Alaska's coast next to it in the same sky. The camera cranes
// up into the sky and, at the end, pulls back to the rest view: you on the roof, and everything that happened still hangs above the city.
import { W, H, rgba, clamp, lin, sm } from '../05-share/engine.mjs';
import { certificate } from '../05-share/lib/certificate.mjs';
import { drawWorld, applyCam, ROOF, COASTW, ROS, CERT_SEAL, spoolLine, coastTip, tipBloom } from './worlds.mjs';
import { kf, aim, nearFade, qio, expoOut } from './motion.mjs';

const Z = 8;                                                  // the sky plane (same as the rosette)
const SC = { x: 1130, y: 450, s: .36, rot: -.05 };            // certificate in the sky plane
const AK = { s: .42, ox: 1450 - 860 * .42, oy: 300 - 150 * .42 }; // Alaska: coast coords → sky plane
const cp = (lx, ly) => [SC.x + (lx * Math.cos(SC.rot) - ly * Math.sin(SC.rot)) * SC.s, SC.y + (lx * Math.sin(SC.rot) + ly * Math.cos(SC.rot)) * SC.s];
const SEAL = cp(...CERT_SEAL), SEAL_R = 118 * SC.s;
const toAK = ([x, y]) => [AK.ox + x * AK.s, AK.oy + y * AK.s];
const AKC = toAK([860 + 470, 150 + 400]);                      // middle of Alaska in the sky plane
const U = (t) => { const x = clamp((t - 6.5) / 2.6); return x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };

function camAt(t) {
  const dz = kf(t, [[0, 0], [2.4, .32], [4.6, 1.25], [6.4, 1.32], [8.7, 1.4], [10, .12]]);
  const zoom = kf(t, [[0, 1], [2.4, 1.03], [4.6, 2.05], [6.4, 2.12], [8.7, 1.9], [10, 1.0]]);
  const y = kf(t, [[0, 0], [2.4, -10], [4.6, -60], [10, 0]]);
  // aim: first at the certificate, then slides with the laying point to Alaska, then lets go
  const tip = toAK(coastTip(Math.max(.02, U(t)), t));
  const fxP = t < 6.3 ? [SC.x, SC.y] : [mixv(SC.x, mixv(AKC[0], tip[0], .35), qio(clamp((t - 6.3) / 1.6))), mixv(SC.y, mixv(AKC[1], tip[1], .35), qio(clamp((t - 6.3) / 1.6)))];
  const w = kf(t, [[0, 0], [2.2, 0], [4.4, 1], [8.7, 1], [10, 0]]);
  return aim({ dz, zoom, y, r: kf(t, [[0, 0], [4.6, -.012], [8.7, .01], [10, 0]]) }, fxP[0], fxP[1], Z, W / 2, H / 2 - 10, w);
}
const mixv = (a, b, u) => a + (b - a) * u;

export function frame(ctx, t) {
  const cam = camAt(t);
  // how far the sky story has come
  const burin = clamp((t - 2.3) / 2.1), paper = sm(lin(4.1, 5.3, t)), cond = qio(clamp((t - 2.4) / 1.9));   // rosette condenses into the seal
  const u = U(t);
  drawWorld(ctx, ROOF, t, cam, {
    p: { rise: Math.min(1, sm(lin(.1, 2.4, t)) * .85 + .15) },
    alpha: (L) => (L.screen ? 1 : nearFade(cam, L.z)),
    layer: (c, L) => {
      if (L.id !== 'rosette') return;
      const k = 1 + (SEAL_R * 1.25 / ROS.R - 1) * cond, x = ROS.x + (SEAL[0] - ROS.x) * cond, y = ROS.y + (SEAL[1] - ROS.y) * cond;
      c.translate(x, y); c.scale(k, k); c.translate(-ROS.x, -ROS.y);
    },
  });
  // the sky plane: drawn after the city so it reads, but masked by nothing (it sits above the skyline)
  ctx.save(); applyCam(ctx, cam, Z);
  // a soft warm sky glow that stays where the light condensed
  { const g = ctx.createRadialGradient(SC.x, SC.y, 0, SC.x, SC.y, 520); g.addColorStop(0, `rgba(255,200,150,${.16 * burin})`); g.addColorStop(1, 'rgba(255,190,140,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(SC.x - 520, SC.y - 520, 1040, 1040); ctx.restore(); }
  if (burin > 0) {
    if (paper < 1) certificate(ctx, t, { x: SC.x, y: SC.y, s: SC.s, rot: SC.rot, burin: Math.min(.999, burin), seq: true, ghost: 1 - paper, a: 1 - paper, col: '#fff1d6', ghostCol: '#fff1d6', ghostW: 1.2 });
    else certificate(ctx, t, { x: SC.x, y: SC.y, s: SC.s, rot: SC.rot });
  }
  // the seal spools the thread that becomes Alaska (in coast coords, mapped into the sky)
  if (t > 6.2) {
    const sealC = [(SEAL[0] - AK.ox) / AK.s, (SEAL[1] - AK.oy) / AK.s];
    ctx.save(); ctx.translate(AK.ox, AK.oy); ctx.scale(AK.s, AK.s);
    const line = spoolLine(t, sealC[0], sealC[1], SEAL_R * .8 / AK.s / 236);
    COASTW.layers.find((L) => L.id === 'main').draw(ctx, t, { u, labels: sm(lin(.35, .6, u)), spool: 0, line, ghostA: sm(lin(6.2, 6.8, t)) }, cam);
    ctx.restore();
  }
  ctx.restore();
}
export const print = () => ({ riso: .35 });
