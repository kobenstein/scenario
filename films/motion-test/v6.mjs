// v6 · Papier-Pop-up (physical cut paper) inside the one shared space (space.mjs). No transitions: paper pieces with weight.
//   0–1.5   the city, the railing and you fold up from flat, one cut-paper plane after another (back to front), each settling with a
//           small overshoot; a plane darkens while it is tilted and drops a shadow once it stands
//   2.2–3.3 you, the railing and the near towers fold down flat again (front first) and leave; the camera tilts up into the sky
//   2.4–4.6 a folded sheet rises out of the rosette's light, opens its right half, then swings its bottom half down, and lands in the sky
//   6.9–10  the seal spools the thread that lays Alaska's coast; the coast lifts as a cut-paper piece and settles with its shadow
import { W, H, rgba, clamp, lin, sm, mix, canvas } from '../05-share/engine.mjs';
import { certificate } from '../05-share/lib/certificate.mjs';
import { drawWorld, applyCam, ROOF, ROS, alaska, once } from './worlds.mjs';
import { drawSky, Z, SC, AK, SEAL, AKC } from './space.mjs';
import { kf, aim, qio, expoOut } from './motion.mjs';

const U = (t) => { const x = clamp((t - 6.9) / 2.6); return x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
const backOut = (x, c = .55) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2);   // ≈ 2.5 % overshoot
// fold state of a ROOF plane: 0 = lying flat, 1 = standing. up = [t0, t1] fold-up, down = [t0, t1] fold-down (or null)
const PLANES = {
  cityFar: { hinge: 700, up: [0, .85] }, fog1: { hinge: 760, up: [.1, .9] },
  cityMid: { hinge: 830, up: [.15, 1.0] }, fog2: { hinge: 860, up: [.25, 1.05] },
  towers: { hinge: 1080, up: [.3, 1.15], down: [2.55, 3.2] },
  deck: { hinge: 908, up: [.45, 1.3], down: [2.4, 3.05] },
  you: { hinge: 1012, up: [.6, 1.45], down: [2.2, 2.85] },
};
function stand(id, t) {
  const P = PLANES[id]; if (!P) return 1;
  let s = backOut(clamp((t - P.up[0]) / (P.up[1] - P.up[0])));
  if (P.down) s *= 1 - (x => x * x * x)(clamp((t - P.down[0]) / (P.down[1] - P.down[0])));   // falls: slow start, fast end (gravity)
  return s;
}

function camAt(t) {
  const k = kf(t, [[0, 1], [2.2, 1.04], [4.5, 2.05], [6.5, 2.12], [9.2, 1.55], [10, 1.53]]);
  const dz = kf(t, [[0, 0], [2.2, .1], [4.5, .55], [10, .6]]), zoom = k / (Z / (Z - dz));
  const fx = kf(t, [[0, SC.x], [6.5, SC.x], [9.2, mix(SEAL[0], AKC[0], .55)]]), fy = kf(t, [[0, SC.y], [6.5, SC.y], [9.2, mix(SEAL[1], AKC[1], .45)]]);
  const w = kf(t, [[0, 0], [2.0, 0], [4.4, 1]]);
  const r = kf(t, [[0, 0], [2.4, .01], [4.6, -.012], [7, -.012], [9.4, .006], [10, .005]]);
  return aim({ dz, zoom, r }, fx, fy, Z, W / 2, H / 2 + 10, w);
}

// ---------- the certificate as a sheet of paper (cached flat, then folded) ----------
const CW = 1500, CH = 980;
function sheet() {
  return once('v6sheet', () => {
    const [c, g] = canvas(CW, CH); g.translate(CW / 2, CH / 2);
    g.save(); g.beginPath(); g.rect(-CW / 2, -CH / 2, CW, CH); g.clip(); certificate(g, 5.0, { x: 0, y: 0, s: 1, rot: 0 }); g.restore();
    return c;
  });
}
const SPAD = 220;
function shadowSprite() { return once('v6shadow', () => { const [c, g] = canvas(CW + SPAD * 2, CH + SPAD * 2); g.filter = 'blur(70px)'; g.fillStyle = 'rgba(4,6,20,1)'; g.fillRect(SPAD, SPAD, CW, CH); g.filter = 'none'; return c; }); }
function akShadow() { return once('v6akshadow', () => { const [c, g] = canvas(W, H); g.filter = 'blur(12px)'; g.fillStyle = 'rgba(4,6,20,1)'; g.fill(alaska().path); g.filter = 'none'; return c; }); }
function backSide() {
  return once('v6back', () => {
    const [c, g] = canvas(CW, CH); const gr = g.createLinearGradient(0, 0, CW, CH); gr.addColorStop(0, '#ece2c9'); gr.addColorStop(1, '#cdbf9f'); g.fillStyle = gr; g.fillRect(0, 0, CW, CH);
    g.globalAlpha = .08; g.drawImage(sheet(), 0, 0); g.globalAlpha = 1;            // the print shows through the back, faintly
    g.strokeStyle = 'rgba(90,70,40,.25)'; g.lineWidth = 2; g.strokeRect(1, 1, CW - 2, CH - 2);
    return c;
  });
}
// draw quadrant region [sx, sy, sw, sh] of the sheet (sheet-local, centred coords) under a fold: hinge along axis at h, s = projected
// scale (-1..1, negative = back side seen)
function flap(ctx, sx, sy, sw, sh, axis, h, s) {
  if (Math.abs(s) < .004) return;
  ctx.save();
  if (axis === 'x') { ctx.translate(h, 0); ctx.scale(s, 1); ctx.translate(-h, 0); } else { ctx.translate(0, h); ctx.scale(1, s); ctx.translate(0, -h); }
  ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
  if (s > 0) ctx.drawImage(sheet(), -CW / 2, -CH / 2);
  else { // seen from behind: mirrored back side
    ctx.save(); if (axis === 'x') { ctx.translate(h, 0); ctx.scale(-1, 1); ctx.translate(-h, 0); } else { ctx.translate(0, h); ctx.scale(1, -1); ctx.translate(0, -h); }
    ctx.drawImage(backSide(), -CW / 2, -CH / 2); ctx.restore();
  }
  ctx.fillStyle = `rgba(24,18,34,${.5 * (1 - Math.abs(s)) ** 1.5})`; ctx.fillRect(sx, sy, sw, sh);      // turned away from the light: darker
  ctx.restore();
}
// shadow a standing flap throws onto the part of the sheet next to its hinge
function hingeShade(ctx, x0, y0, x1, y1, a) { if (a <= .01) return; const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, `rgba(20,14,30,${a})`); g.addColorStop(1, 'rgba(20,14,30,0)'); ctx.fillStyle = g; ctx.fillRect(Math.min(x0, x1) - (x0 === x1 ? CW / 2 : 0), Math.min(y0, y1) - (y0 === y1 ? CH / 2 : 0), x0 === x1 ? CW : Math.abs(x1 - x0), y0 === y1 ? CH : Math.abs(y1 - y0)); }

function paperCert(ctx, t, cam) {
  const rise = qio(clamp((t - 2.35) / 1.15));                    // out of the rosette's core up to its place
  const a1 = clamp((t - 3.25) / .75), a2 = clamp((t - 3.85) / .8);  // right half opens, then the bottom half swings down
  const o1 = sm(a1), o2 = sm(a2), land = clamp((t - 4.55) / .7);
  if (rise <= 0) return;
  const x = mix(ROS.x, SC.x, rise), y = mix(ROS.y + 10, SC.y, rise) - 26 * Math.sin(Math.PI * rise);
  const settle = 1 + .035 * Math.sin(Math.PI * clamp(land * 1.6)) * (1 - land);   // a soft bounce as it lands
  const m = mix(.35, 1, sm(clamp((t - 2.35) / 1.4))) * settle, s = SC.s * m;
  const sway = (1 - sm(land)) * (.09 * Math.sin(t * 2.1) + .05 * Math.sin(t * 3.3 + 1)), skew = (1 - sm(land)) * .06 * Math.sin(t * 1.7);
  ctx.save(); applyCam(ctx, cam, Z);
  ctx.translate(x, y); ctx.rotate(SC.rot + sway); ctx.transform(1, 0, skew, 1, 0, 0); ctx.scale(s, s);
  // drop shadow on the sky: far and soft while it floats, close and crisp once it lies
  const lift = 1 - expoOut(land);
  // silhouette that casts the shadow: the currently visible outline (a cached soft sprite, stretched to it)
  const vw = CW / 2 + CW / 2 * Math.max(0, Math.cos(Math.PI * (1 - o1))), vhTop = CH / 2, vhBot = CH / 2 * Math.max(0, Math.cos(Math.PI * (1 - o2)));
  { const S = shadowSprite(), ox = mix(70, 170, lift), oy = mix(90, 250, lift), sw = vw / CW, sh = (vhTop + vhBot) / CH;
    ctx.save(); ctx.globalAlpha *= .55 + .25 * (1 - lift); ctx.drawImage(S, -CW / 2 + ox - SPAD * sw, -vhTop + oy - SPAD * sh, S.width * sw, S.height * sh); ctx.restore(); }
  ctx.fillStyle = '#d9cdb0'; ctx.fillRect(-CW / 2, -vhTop, vw, vhTop + vhBot);
  // top half: left quarter always flat; right quarter on the vertical hinge (x = 0)
  const s1 = Math.cos(Math.PI * (1 - o1));
  flap(ctx, -CW / 2, -CH / 2, CW / 2, CH / 2, 'x', 0, 1);
  if (o2 > 0) { // bottom half (both quarters, already open sideways) swings down on the horizontal hinge (y = 0)
    const s2 = Math.cos(Math.PI * (1 - o2));
    if (s2 > 0) { flap(ctx, -CW / 2, 0, CW, CH / 2, 'y', 0, s2); }
    ctx.save(); ctx.beginPath(); ctx.rect(-CW / 2, -CH / 2, CW, CH / 2); ctx.clip(); hingeShade(ctx, 0, 0, 0, -CH * .3, .35 * (1 - Math.abs(s2))); ctx.restore();
  }
  hingeShadeX(ctx, s1);
  flap(ctx, 0, -CH / 2, CW / 2, CH / 2, 'x', 0, s1);
  ctx.restore();
}
function hingeShadeX(ctx, s1) { const a = .35 * (1 - Math.abs(s1)); if (a <= .01) return; ctx.save(); ctx.beginPath(); ctx.rect(-CW / 2, -CH / 2, CW / 2, CH / 2); ctx.clip(); const g = ctx.createLinearGradient(0, 0, -CW * .3, 0); g.addColorStop(0, `rgba(20,14,30,${a})`); g.addColorStop(1, 'rgba(20,14,30,0)'); ctx.fillStyle = g; ctx.fillRect(-CW / 2, -CH / 2, CW / 2, CH / 2); ctx.restore(); }

export function frame(ctx, t) {
  const cam = camAt(t), u = U(t);
  drawWorld(ctx, ROOF, t, cam, {
    p: { rise: Math.min(1, sm(lin(.1, 2.4, t)) * .85 + .15) },
    alpha: (L) => (L.id === 'rosette' ? 1 - .45 * sm(lin(4.2, 5.4, t)) : (PLANES[L.id] && stand(L.id, t) < .01 ? 0 : 1)),
    layer: (c, L) => {
      const P = PLANES[L.id]; if (!P) return;
      const s = Math.max(.01, stand(L.id, t));
      c.translate(0, P.hinge); c.scale(1, s); c.translate(0, -P.hinge);
      if (!L.id.startsWith('fog')) { // a plane standing up throws a short shadow toward us; while tilted its face loses the light
        if (L.id !== 'cityFar' && s < .985) { c.shadowColor = `rgba(2,3,10,${.45 * clamp(s)})`; c.shadowBlur = 5; c.shadowOffsetY = 7 * clamp(s); }
        if (s < .985) c.filter = `brightness(${(.45 + .55 * clamp(s)).toFixed(2)})`;
      }
    },
  });
  // the sky story: the paper certificate (folded sheet, then the live one once it lies), the coast laid by the seal's thread
  const flat = t >= 5.3;
  if (!flat) paperCert(ctx, t, cam);
  // Alaska as a paper piece: its shadow appears as the coast fills, lifts, and settles
  const fill = sm(lin(.86, 1, u)), lift = fill * (1 - .6 * sm(lin(9.45, 10, t)));
  if (fill > 0) {
    ctx.save(); applyCam(ctx, cam, Z); ctx.translate(AK.ox, AK.oy); ctx.scale(AK.s, AK.s);
    ctx.globalAlpha = .45 * fill; ctx.drawImage(akShadow(), 14 + 26 * lift, 20 + 36 * lift); ctx.restore();
  }
  drawSky(ctx, t, cam, { burin: 1, paper: 1, certA: flat ? 1 : 0, u, glow: sm(lin(2.4, 4.2, t)), ghostA: sm(lin(6.4, 7.0, t)), coast: t > 6.3 });
}
export const print = () => ({ riso: .4 });
