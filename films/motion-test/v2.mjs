// v2 · "Objekte spielen, Kamera ruht" (principles of animation: anticipation, squash & stretch, arcs, follow-through, staggered exits)
// The camera barely moves; the space changes because things act. The rosette of light gathers itself (anticipation), leaps up on an arc
// (stretch), and unfolds into the certificate that settles with a little follow-through; the city sinks away beneath the parapet in a
// staggered wave and the near towers step aside, while you and the roof stay. Then the certificate steps back into the corner of the sky
// (it stays), and its seal spools the thread that lays Alaska where it stood.
import { W, H, clamp, lin, sm, drift } from '../05-share/engine.mjs';
import { drawWorld, ROOF, ROS, CERT_SEAL, roofBeats } from './worlds.mjs';
import { drawSky, certP } from './space.mjs';
import { kf, qio, expoOut } from './motion.mjs';

// damped follow-through: 0 → 1 with one small overshoot (≤ 4 %)
const settle = (x) => { if (x <= 0) return 0; if (x >= 1) return 1; const e = expoOut(x); return e + .04 * Math.sin(x * Math.PI * 2.2) * (1 - x); };
const BIG = { x: 1150, y: 420, s: .66, rot: -.05 }, SMALL = { x: 330, y: 230, s: .26, rot: -.11 };
const AK2 = { s: .62, ox: 1000 - 860 * .62, oy: 190 - 150 * .62 };

export function frame(ctx, t) {
  const cam = { x: drift(t, 8, 1), y: drift(t, 5, 2), dz: .04 + .01 * Math.sin(t * .4) };
  // rosette: gather (2.3–2.75, squash), leap on an arc to the certificate's centre (2.75–3.55, stretch along the path)
  const gather = sm(lin(2.25, 2.75, t)) * (1 - sm(lin(2.75, 2.95, t))), leap = qio(clamp((t - 2.75) / .8));
  const arcX = ROS.x + (BIG.x - ROS.x) * leap, arcY = ROS.y + (BIG.y - ROS.y) * leap - Math.sin(leap * Math.PI) * 120;
  const vel = Math.sin(clamp((t - 2.75) / .8) * Math.PI);                       // speed along the arc → stretch
  const unfold = settle(clamp((t - 3.45) / .9));                                  // certificate unfolds out of the rosette
  const rosK = (1 - .1 * gather) * (1 - sm(lin(3.4, 4.1, t)));
  // the city sinks below the parapet (staggered far → near), the near towers step aside
  const sink = (d) => expoOut(clamp((t - 2.9 - d) / .9)) * 1;
  drawWorld(ctx, ROOF, t, cam, {
    p: { rise: Math.min(1, sm(lin(.1, 2.3, t)) * .85 + .15), beats: roofBeats(Math.min(t, 2.6)) },
    layer: (c, L) => {
      if (L.id === 'rosette') { c.translate(arcX, arcY); c.rotate(.15 * vel); c.scale(rosK * (1 + .14 * vel + .08 * gather), rosK * (1 - .1 * vel - .1 * gather)); c.translate(-ROS.x, -ROS.y); }
      if (L.id === 'cityMid') c.translate(0, 420 * sink(.12));
      if (L.id === 'fog2') c.translate(0, 420 * sink(.17));
      if (L.id === 'towers') { const k = sink(.25); c.translate(W / 2, 0); c.scale(1 + .35 * k, 1); c.translate(-W / 2, 0); c.translate(0, 260 * k); }
    },
  });
  // the certificate: unfolds at BIG (3.45–4.35), paper 4.0–4.8; steps back to SMALL (5.5–6.5) with anticipation (a slight lean in first)
  const back = qio(clamp((t - 5.55) / .95)), lean = sm(lin(5.25, 5.55, t)) * (1 - back);
  const c = { x: BIG.x + (SMALL.x - BIG.x) * back, y: BIG.y + (SMALL.y - BIG.y) * back - Math.sin(back * Math.PI) * 60, s: (BIG.s + (SMALL.s - BIG.s) * back) * (1 + .03 * lean) * (.2 + .8 * unfold), rot: BIG.rot + (SMALL.rot - BIG.rot) * back + .05 * Math.sin(back * Math.PI) };
  const seal = certP(...CERT_SEAL, c), sealR = 118 * c.s, u = clamp((t - 6.55) / 2.7), uu = u < .5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
  drawSky(ctx, t, cam, {
    cert: c, burin: t < 3.45 ? 0 : Math.min(1, .05 + clamp((t - 3.45) / .8)), paper: sm(lin(4.0, 4.8, t)), glow: sm(lin(3.3, 4, t)),
    coast: t > 6.4, u: uu, ak: AK2, sealAt: seal, sealR, ghostA: sm(lin(6.4, 6.9, t)),
  });
}
export const print = () => ({ riso: .35 });
