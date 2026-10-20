// C06 (Film 4 v2) · the cold fog off the water (owner c06): it creeps up over the hill's street (6.12), fills the frame while the camera
// turns across the water (the full-frame surface between the two worlds), then settles back onto the water and uncovers the city (6.13).
// One function, the same in both takes, so the frames on both sides of the switch are the same picture:
//   fogDraw(ctx, t, { edge, ripple, tint })   edge = screen y of the fog's top (fog below it; ≤ −120 → the whole frame is fog)
//   fogX(t, A)                                the drift of the fog field (px): slow, then a fast sweep while the camera turns (the turn)
// The fog is drawn as cached Images (no per-frame canvas → no napi leak): an opaque moonlit base, two noise layers with engraved
// horizontal strands that drift at different speeds (parallax), and a soft wispy top edge (four stepped clips).
import { W, H, rgba, clamp, mix, sm, prng, canvas } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { once, mixH } from './v2_c06_kit.mjs';

const FW = 1440, FH = 600;   // texture size (drawn at ×1.6: soft by nature)
function tex(seed, dark) {
  return once('c06fog:' + seed, () => {
    const [c, g] = canvas(FW, FH), n = vnoise(seed), n2 = vnoise(seed + 9), id = g.createImageData(FW, FH), p = id.data;
    for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
      // wrap horizontally (seamless tiling): blend the noise with its copy one period away
      const u = x / FW, a1 = fbm(n, x * .006, y * .016, 5), a2 = fbm(n, (x - FW) * .006, y * .016, 5), v = mix(a1, a2, u);
      const w2 = fbm(n2, x * .02 + v * 3, y * .05, 3), d = clamp((v - .38) * 2.4 + (w2 - .5) * .5), i = (y * FW + x) * 4;
      const b = dark ? 0 : 255; p[i] = b; p[i + 1] = b; p[i + 2] = b; p[i + 3] = Math.round(255 * d * (dark ? .55 : .5));
    }
    g.putImageData(id, 0, 0);
    // engraved strands: long, thin, slightly waving horizontal lines (the print's fog)
    const r = prng(seed + 3); g.strokeStyle = dark ? 'rgba(10,14,40,.22)' : 'rgba(255,255,255,.2)'; g.lineWidth = 1.1;
    for (let k = 0; k < 60; k++) { const y0 = r() * FH, x0 = r() * FW, L = 200 + r() * 600; g.beginPath(); for (let s = 0; s <= L; s += 12) { const x = (x0 + s) % FW, y = y0 + Math.sin((x0 + s) * .01 + k) * 4; s && (x0 + s) % FW > 12 ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    return c;
  });
}
export async function warmFog() { tex(31, false); tex(57, true); tex(83, false); }

// the drift: slow wind, plus the turn (a long sweep to the left while the camera swings across the water)
export function fogX(t, A) { const u = sm(clamp((t - A.turn0) / (A.turn1 - A.turn0))); return t * 22 + u * 2600; }

const COL = { base: '#5e6a96', hi: '#c3cdea', lo: '#2a3260' };
// drawn at half resolution into one reused offscreen canvas, then laid over the frame (the fog is soft by nature; 4× cheaper)
let OFF = null;
export function fogDraw(ctx0, t, o = {}) {
  const edge = o.edge ?? -200, x0 = o.x ?? t * 22, tint = o.tint || null, s = 1.6, rip = o.ripple ?? 1;
  if (edge >= H + 60) return;
  if (!OFF) OFF = canvas(W / 2, H / 2);
  const [oc, ctx] = OFF; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W / 2, H / 2);
  ctx.save(); ctx.setTransform(.5, 0, 0, .5, 0, 0);
  // the wispy top edge: four stepped clips (soft gradient by bands, not a fade of the whole picture)
  const wav = (x, k) => edge + k * 34 + rip * (28 * Math.sin(x * .004 + t * .35 + k) + 14 * Math.sin(x * .011 - t * .6 + k * 2) + 6 * Math.sin(x * .03 + t));
  const bands = [[3, 1], [2, .62], [1, .36], [0, .18]];
  for (const [k, a] of bands) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(-20, H + 20); for (let x = -20; x <= W + 20; x += 24) ctx.lineTo(x, wav(x, k)); ctx.lineTo(W + 20, H + 20); ctx.closePath(); ctx.clip();
    if (k === 3) {
      // the body of the fog: opaque, moonlit from above (lighter at its top), darker toward the water
      const g = ctx.createLinearGradient(0, Math.max(-200, edge), 0, H); g.addColorStop(0, COL.hi); g.addColorStop(.35, COL.base); g.addColorStop(1, COL.lo); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (tint) { ctx.globalCompositeOperation = 'lighter'; const tg = ctx.createRadialGradient(tint.x, tint.y, 0, tint.x, tint.y, tint.r); tg.addColorStop(0, rgba(tint.col, tint.a)); tg.addColorStop(1, rgba(tint.col, 0)); ctx.fillStyle = tg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
    } else { ctx.fillStyle = rgba(mixH(COL.hi, COL.base, .3), a); ctx.fillRect(0, 0, W, H); }
    // drifting noise layers (two speeds: depth), tiled horizontally
    for (const [seed, sp, dy, al] of [[57, .7, 40, .9], [31, 1, -60, .85], [83, 1.45, 120, .7]]) {
      ctx.globalAlpha = al * (k === 3 ? 1 : a); const im = tex(seed, seed === 57), w = FW * s, off = ((-(x0 * sp) % w) + w) % w - w;
      const y0 = Math.min(H, -260 + 60 * Math.log1p(Math.exp((edge + 60) / 60))) + dy * .4 + 16 * Math.sin(t * .2 + seed);   // a soft floor (no kink)
      for (let x = off; x < W; x += w) ctx.drawImage(im, x, y0, w, 1400);
    }
    ctx.globalAlpha = 1; ctx.restore();
  }
  ctx.restore();
  ctx0.save(); ctx0.setTransform(1, 0, 0, 1, 0, 0); ctx0.globalAlpha = 1; ctx0.globalCompositeOperation = 'source-over'; ctx0.drawImage(oc, 0, 0, W, H); ctx0.restore();
}
