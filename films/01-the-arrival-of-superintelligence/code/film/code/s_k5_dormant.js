// "As far as anyone knows, it still hasn't restarted."
// Wide on the hall again: the giant rings dark and still, dust drifting through a work light. The engineer has let go
// of the lever and stands looking up at the machine. A wall calendar flips from September to October.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, out, ease } = L;
const { grainFill, roundRect, glowStroke, tag } = require('./s_k5_race');
const { scene, leverHandle, M } = require('./s_k5_halt');

const T0 = 317.3, T1 = 321.0;
const R = rng(314);
const DUST = Array.from({ length: 110 }, () => ({ x: R(), y: R(), s: 1 + R() * 2.4, v: 6 + R() * 14, p: R() * 6 }));
const CAL = { x: 250, y: 250 };

function calendar(ctx, t) {
  // hanging on the wall: a pin, a block of pages; the top page flips up and over on "restarted"
  const flip = ease((t - 319.05) / 0.7);
  const { x, y } = CAL, w = 190, h = 230;
  ctx.fillStyle = '#05051a'; ctx.beginPath(); ctx.arc(x + w / 2, y - 14, 6, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.fillRect(x + 8, y + 10, w, h);
  const page = (month, a) => {
    grainFill(ctx, c => c.rect(x, y, w, h), lin(ctx, 0, y, 0, y + h, [[0, '#e9e4d6'], [1, '#bdb6cc']]), 0.3);
    ctx.fillStyle = '#7a3b17'; ctx.fillRect(x, y, w, 46);
    ctx.font = '34px "Inter SemiBold"'; ctx.letterSpacing = '6px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.cream; ctx.fillText(month, x + w / 2, y + 24);
    ctx.letterSpacing = '0px'; ctx.font = '18px "Inter Medium"'; ctx.fillStyle = 'rgba(26,24,48,0.6)'; ctx.fillText('2026', x + w / 2, y + 64);
    for (let i = 0; i < 30; i++) { const cx = x + 22 + (i % 7) * 25, cy = y + 92 + Math.floor(i / 7) * 26; ctx.fillStyle = 'rgba(26,24,48,0.35)'; ctx.fillRect(cx, cy, 14, 10); }
  };
  page('OCT', 1);
  if (flip < 1) {
    ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - 400, w + 40, 400 + h * (1 - flip) + 1); ctx.clip();
    ctx.translate(0, y); ctx.scale(1, lerp(1, -0.25, flip)); ctx.translate(0, -y);
    page('SEP', 1);
    if (flip > 0) { ctx.fillStyle = `rgba(20,16,40,${0.5 * flip})`; ctx.fillRect(x, y, w, h); }
    ctx.restore();
  }
  light(ctx, x + w / 2, y + h / 2, 220, '#fff0d8', 0.06);
}

function draw(ctx, t) {
  const back = 1, z = lerp(1.14, 1.0, ease((t - T0) / (T1 - T0))) + 0.02 * Math.sin(t * 0.3);
  const fx = 960, fy = 480, lamp = ramp(t, 317.4, 318.2);
  scene(ctx, t, { z, fx, fy, active: 0, lv: 1, grip: 0, leverGlow: 0.25, offAt: 0, figX: 1290, up: ramp(t, 317.8, 318.8),
    under: c => calendar(c, t),
    after: c => {
      // a work light hanging over the stopped machine, dust drifting through it
      cone(c, M.x, -40, 160, 1100, 860, '#e8eaff', 0.07 * lamp);
      light(c, M.x, -20, 220, '#fff0d8', 0.25 * lamp);
      c.save(); c.globalCompositeOperation = 'lighter';
      for (const d of DUST) { const yy = (d.y * 900 + t * d.v) % 900, spread = 80 + 470 * yy / 900, xx = M.x + (d.x - 0.5) * 2 * spread + Math.sin(t * 0.5 + d.p) * 16;
        c.fillStyle = rgba('#e8eaff', (0.25 + 0.35 * lamp) * (0.5 + 0.5 * Math.sin(t * 1.5 + d.p))); c.beginPath(); c.arc(xx, yy - 40, d.s, 0, 7); c.fill(); }
      c.restore();
    } });
}

module.exports = { T0, T1, draw };
