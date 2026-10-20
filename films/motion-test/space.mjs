// ONE imaginative space for every version (Jakob 2026-10-20: no cuts, no dissolves, no wipes; objects leave or stay, the camera flies
// to another area of the same space). Layout: the rooftop and city below; in the sky above the city (plane Z = 8, the rosette's plane)
// the certificate is engraved by the light, and Alaska's coast is laid to the right of it by a thread spooled off the certificate's seal.
// Everything is in sky-plane px (the rest camera sees the whole chain small above the city).
import { W, H, clamp, lin, sm } from '../05-share/engine.mjs';
import { certificate } from '../05-share/lib/certificate.mjs';
import { applyCam, COASTW, CERT_SEAL, spoolLine, coastTip } from './worlds.mjs';

export const Z = 8;
export const SC = { x: 1130, y: 450, s: .36, rot: -.05 };                 // certificate in the sky plane
export const AK = { s: .42, ox: 1450 - 860 * .42, oy: 300 - 150 * .42 };  // Alaska: coast coords → sky plane
export const certP = (lx, ly, c = SC) => [c.x + (lx * Math.cos(c.rot) - ly * Math.sin(c.rot)) * c.s, c.y + (lx * Math.sin(c.rot) + ly * Math.cos(c.rot)) * c.s];
export const SEAL = certP(...CERT_SEAL), SEAL_R = 118 * SC.s;
export const toAK = ([x, y]) => [AK.ox + x * AK.s, AK.oy + y * AK.s];
export const AKC = toAK([860 + 470, 150 + 400]);                           // middle of Alaska (sky plane)
export const akTip = (u, t) => toAK(coastTip(Math.max(.002, u), t));       // the laying point (sky plane)

// draw the sky story with the camera. o: { burin 0..1 (light engraves the certificate), paper 0..1 (paper fills in), cert: {x,y,s,rot}
// override, ak {s, ox, oy} Alaska placement, sealAt/sealR (where the thread starts), certHook(ctx) extra transform around the certificate, u (coast laid 0..1), coast: false, glow, line (thread polyline in coast coords) }
export function drawSky(ctx, t, cam, o = {}) {
  ctx.save(); if (!applyCam(ctx, cam, Z)) { ctx.restore(); return; }
  const c = o.cert || SC, burin = clamp(o.burin ?? 1), paper = clamp(o.paper ?? 1), glow = o.glow ?? burin;
  if (glow > 0) { const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 520); g.addColorStop(0, `rgba(255,200,150,${.16 * glow})`); g.addColorStop(1, 'rgba(255,190,140,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(c.x - 520, c.y - 520, 1040, 1040); ctx.restore(); }
  if (burin > 0 && o.certA !== 0) {
    ctx.save(); if (o.certA != null) ctx.globalAlpha *= o.certA; if (o.certHook) o.certHook(ctx, c);
    if (paper < 1) certificate(ctx, t, { x: c.x, y: c.y, s: c.s, rot: c.rot, burin: Math.min(.999, burin), seq: true, ghost: 1 - paper, a: 1 - paper, col: '#fff1d6', ghostCol: '#fff1d6', ghostW: 1.2 });
    else certificate(ctx, t, { x: c.x, y: c.y, s: c.s, rot: c.rot });
    ctx.restore();
  }
  if (o.coast !== false && (o.u ?? 0) >= 0 && o.showCoast !== false) {
    const ak = o.ak || AK, seal = o.sealAt || SEAL, sealR = o.sealR || SEAL_R, sealC = [(seal[0] - ak.ox) / ak.s, (seal[1] - ak.oy) / ak.s], u = o.u ?? 0;
    ctx.save(); ctx.translate(ak.ox, ak.oy); ctx.scale(ak.s, ak.s);
    const line = o.line || spoolLine(t, sealC[0], sealC[1], sealR * .8 / ak.s / 236);
    COASTW.layers.find((L) => L.id === 'main').draw(ctx, t, { u, labels: o.labels ?? sm(lin(.35, .6, u)), spool: 0, line, ghostA: o.ghostA ?? 1, thread: o.thread }, cam);
    ctx.restore();
  }
  ctx.restore();
}
