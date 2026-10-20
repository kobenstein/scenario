// v3 "Linien-Morph" (3Blue1Brown) in the one shared space: the camera only pushes slowly toward the sky; the engraved line carries
// every change. Nothing cuts or fades: what is no longer needed sinks out of the space.
//   0–2.3   rooftop, the buzz rises into the rosette of light above the city
//   2.3–4.0 the rosette's outer ring lifts off and morphs (circle → superellipse → the certificate's outer border); the inner rosette
//           condenses into the seal; the city sinks away below
//   3.4–5.6 inside the border the light engraves the certificate line by line, then the paper fills in
//   6.2–6.9 the border lights up again as a thread
//   6.8–9.5 the thread peels off the border and is laid along Alaska's coast, right next to the certificate
import { W, H, rgba, clamp, lin, mix, eio, sm } from '../05-share/engine.mjs';
import { ring } from '../05-share/lib/certificate.mjs';
import { drawWorld, applyCam, ROOF, ROS } from './worlds.mjs';
import { kf, aim, qio, nearFade } from './motion.mjs';
import { Z, SC, SEAL, SEAL_R, AK, AKC, drawSky } from './space.mjs';

const mixHex = (a, b, u) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, u)); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); };
const BHW = 750 - 45, BHH = 490 - 45;                         // certificate outer border centre line (local half sizes)
const U = (t) => { const x = clamp((t - 6.8) / 2.7); return x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };

// one slow, continuous push toward the sky (no keyframe bumps), aim drifts from the rosette to the certificate to cert + Alaska
function camAt(t) {
  const zoom = kf(t, [[0, 1], [10, 1.85]], (x) => sm(x) * .7 + x * .3), y = kf(t, [[0, 0], [10, -40]]);
  const f = eio(lin(1.8, 5.2, t)), g = eio(lin(6.4, 9.8, t));
  const fx = mix(mix(ROS.x, SC.x, f), mix(SC.x, AKC[0], .47), g), fy = mix(mix(ROS.y - 60, SC.y, f), mix(SC.y, AKC[1], .5), g);
  return aim({ zoom, y, dz: .05 * t / 10 }, fx, fy, Z, W / 2, H / 2 - 30, eio(lin(.4, 4.5, t)) * .95);
}
// the border as a closed polyline in sky-plane px (gentle guilloche wave)
function borderSky(t) {
  const pts = [], N = 900, a = 2 * BHW, b = 2 * BHH, per = 2 * (a + b), rr = 40;
  for (let i = 0; i <= N; i++) {
    let s = i / N * per, x, y, nx = 0, ny = 0;
    if (s < a) { x = -BHW + s; y = -BHH; ny = -1; } else if ((s -= a) < b) { x = BHW; y = -BHH + s; nx = 1; } else if ((s -= b) < a) { x = BHW - s; y = BHH; ny = 1; } else { s -= a; x = -BHW; y = BHH - s; nx = -1; }
    const wv = 9 * Math.sin(i / N * 260 + t * 1.5); x += nx * wv; y += ny * wv;
    const cx = Math.max(Math.abs(x) - (BHW - rr), 0), cy = Math.max(Math.abs(y) - (BHH - rr), 0); if (cx > 0 && cy > 0) { const d = Math.hypot(cx, cy), f = rr / d * .9; x = Math.sign(x) * (BHW - rr + cx * f); y = Math.sign(y) * (BHH - rr + cy * f); }
    pts.push([SC.x + (x * Math.cos(SC.rot) - y * Math.sin(SC.rot)) * SC.s, SC.y + (x * Math.sin(SC.rot) + y * Math.cos(SC.rot)) * SC.s]);
  }
  const k = Math.round(N * (BHW * 2 + BHH) / per); return pts.slice(k).concat(pts.slice(1, k + 1));   // start at the right edge, facing Alaska
}
export function frame(ctx, t) {
  const cam = camAt(t);
  const m = eio(lin(2.3, 4.0, t)), cond = eio(lin(2.5, 4.4, t)), sink = eio(lin(2.6, 5.4, t));
  // ---------- the city: stays until it is not needed, then sinks out of the space (nearer planes faster) ----------
  drawWorld(ctx, ROOF, t, cam, {
    p: { rise: Math.min(1, sm(lin(.1, 2.3, t)) * .85 + .15) },
    alpha: (L) => (L.screen ? 1 : nearFade(cam, L.z)),
    layer: (c, L) => {
      if (L.id === 'rosette') {   // the inner rosette condenses into the seal; its outer ring is handed to the morph line
        const k = 1 + (SEAL_R * 1.25 / ROS.R - 1) * cond, x = mix(ROS.x, SEAL[0], cond), y = mix(ROS.y, SEAL[1], cond);
        c.translate(x, y); c.scale(k, k); c.translate(-ROS.x, -ROS.y); c.globalAlpha *= 1 - .9 * cond;
      } else if (L.z < 4.5) c.translate(0, sink * 1150 / Math.pow(L.z, .75));
    },
  });
  // ---------- the sky plane ----------
  const burin = clamp((t - 3.35) / 2.0), paper = sm(lin(4.7, 5.7, t));
  drawSky(ctx, t, cam, { burin, paper, coast: false, glow: Math.max(burin, sm(lin(2.2, 3.4, t)) * .6) });
  ctx.save(); applyCam(ctx, cam, Z);
  // the morphing line: rosette ring → certificate border (light on the night sky, ink once the paper is there)
  const ringA = sm(lin(2.0, 2.4, t)) * (1 - sm(lin(5.1, 6.0, t)));
  if (ringA > .003) {
    const rx = mix(ROS.R, BHW * SC.s * 1.02, m), ry = mix(ROS.R, BHH * SC.s * 1.02, eio(clamp(m * 1.2))), pp = sm(lin(4.8, 5.6, t));
    ring(ctx, mix(ROS.x, SC.x, m), mix(ROS.y, SC.y, m), rx, ry, { lines: Math.round(mix(9, 11, m)), band: mix(20, 16, m), wave: mix(26, 12, m), p: mix(2, 10, eio(clamp(m * 1.15 - .1))), rot: mix(0, SC.rot, m),
      col: mixHex('#fff1d6', '#28405a', pp), glow: pp > .5 ? null : '#ffb35c', glowA: .12 * (1 - pp), a: ringA * mix(.6, 1, m), lw: mix(.6, .8, m), ph: t * .3, op: pp > .5 ? 'source-over' : 'lighter' });
  }
  ctx.restore();
  // ---------- the border becomes the thread that lays Alaska ----------
  const thA = sm(lin(6.2, 6.9, t));
  if (thA > .003) {
    const line = borderSky(t).map(([x, y]) => [(x - AK.ox) / AK.s, (y - AK.oy) / AK.s]);
    ctx.save(); ctx.globalAlpha = thA; drawSky(ctx, t, cam, { burin: 0, glow: 0, u: U(t), line, ghostA: thA }); ctx.restore();
  }
}
export const print = () => ({ riso: .35 });
