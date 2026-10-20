// v7 · "Kinetischer Rhythmus" (editorial snap inside one space: punch-ins on the beat, speed ramps, darting camera, motion blur)
// Same space as everywhere (roof, sky, certificate, Alaska), but the camera moves like a percussionist: every buzz punches the lens in,
// then the camera ramps up and darts into the sky in one fast move (with real motion blur), lands on the certificate as the light engraves
// it at speed, snaps to the title, darts to the seal and is pulled along the thread to Alaska; at the end it flies back to the roof.
// Fast accents, long calm holds in between (speed contrast 4–5x). No cuts, no wipes.
import { W, H, clamp, lin, sm, canvas } from '../05-share/engine.mjs';
import { drawWorld, ROOF, ROS, BUZZ, PHONE, roofBeats } from './worlds.mjs';
import { drawSky, Z, SC, SEAL, SEAL_R, AKC, akTip } from './space.mjs';
import { kf, aim, nearFade, expoOut, qio } from './motion.mjs';

const punch = (t, beats, amp = .055) => beats.reduce((s, b) => s + (t > b ? amp * (1 - Math.exp(-(t - b) * 38)) * Math.exp(-(t - b) * 3.4) : 0), 0);
// a dart: slow creep in, very fast middle, long soft landing (fast-out, slow-in)
const dart = (x) => { x = clamp(x); return x < .3 ? .12 * (x / .3) ** 3 : .12 + .88 * expoOut((x - .3) / .7); };
const U = (t) => { const x = clamp((t - 6.75) / 2.3); return x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
const D1 = [2.75, 3.75], D2 = [5.35, 5.95], D3 = [6.35, 7.15], D4 = [9.2, 10];

function camAt(t) {
  const up = dart((t - D1[0]) / (D1[1] - D1[0])), seal = dart((t - D2[0]) / (D2[1] - D2[0])), along = dart((t - D3[0]) / (D3[1] - D3[0])), home = qio(clamp((t - D4[0]) / (D4[1] - D4[0])));
  const title = expoOut(clamp((t - 4.45) / .3)) * (1 - seal);
  const dz = .02 * clamp(t / 2.7) + 1.23 * up * (1 - home), zoom = (1 + punch(t, BUZZ) + 1.05 * up + .25 * title + 1.3 * seal - 1.45 * along * (1 - .0) + .02 * clamp((t - 7.2) / 2)) * (1 - home) + home * 1.0;
  // aim: phone → certificate → seal → along the thread to Alaska → let go
  const tip = akTip(U(t), t);
  let fx = SC.x, fy = SC.y; if (seal > 0) { fx += (SEAL[0] - fx) * seal; fy += (SEAL[1] - fy) * seal; }
  if (along > 0) { const tx = AKC[0] * .65 + tip[0] * .35, ty = AKC[1] * .65 + tip[1] * .35; fx += (tx - fx) * along; fy += (ty - fy) * along; }
  const w = up * (1 - home);
  return aim({ dz, zoom: Math.max(1, zoom), r: .01 * Math.sin(t * 7) * punch(t, BUZZ) * 6 - .02 * Math.sin(Math.PI * clamp((t - D1[0]) / 1)) }, fx, fy, Z, W / 2, H / 2, w);
}
function scene(ctx, t) {
  const cam = camAt(t), u = U(t);
  drawWorld(ctx, ROOF, t, cam, { p: { rise: Math.min(1, sm(lin(.1, 2.5, t)) * .85 + .15), beats: roofBeats(Math.min(t, 3.4)) }, alpha: (L) => (L.screen ? 1 : nearFade(cam, L.z)),
    layer: (c, L) => { if (L.id !== 'rosette') return; const k = 1 - .9 * sm(lin(2.9, 3.9, t)); c.translate(ROS.x + (SEAL[0] - ROS.x) * (1 - k) / .9, ROS.y + (SEAL[1] - ROS.y) * (1 - k) / .9); c.scale(k, k); c.translate(-ROS.x, -ROS.y); } });
  drawSky(ctx, t, cam, { burin: clamp((t - 3.0) / .9), paper: sm(lin(3.85, 4.3, t)), coast: t > 6.2, u, ghostA: sm(lin(6.2, 6.6, t)) });
}
// motion blur: average a few sub-frames along the shutter while the camera darts
const [bc, bx] = canvas(W, H);
export function frame(ctx, t) {
  const fast = [D1, D2, D3, D4].some(([a, b]) => t > a + .05 && t < b - .2);
  if (!fast) return scene(ctx, t);
  const n = 5, sh = 1 / 30 * .5;
  for (let i = 0; i < n; i++) {
    const x = i ? bx : ctx; if (i) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.fillStyle = '#070918'; x.fillRect(0, 0, W, H); }
    scene(x, t - sh / 2 + sh * i / (n - 1));
    if (i) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 / (i + 1); ctx.drawImage(bc, 0, 0); ctx.restore(); }
  }
}
export const print = () => ({ riso: .4 });
