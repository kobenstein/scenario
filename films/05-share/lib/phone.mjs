// M1 · your phone: display up, seen from above (or held), with the buzz, the slide over the wood and the display light
// spilling onto the surroundings. (Base version by K0; C1 owns and extends this file — keep the signature.)
//   phone(ctx, x, y, s, { t, buzz: t0 | [t0, …] (two short pulses each), slide: [dx, dy] px it travels on a buzz,
//          ang (rad), glow (0..1 display light), lit (0..1 display on), card: { title, sub, kind: 'warm'|'grey', t0, from: 'top'|'bottom', icon: 'share'|'dot' },
//          screen(ctx, w, h, t) draws your own screen content in phone units (0..w, 0..h), held: true (no table shadow), body: '#15151c' })
//   → returns { x, y, ang } where it is after the slide (use it for the cup it bumps into)
//   phoneCard(ctx, x, y, w, t, card)  the notification card alone (screen space), e.g. pushed in big on the display
//   buzzOffset(t, t0) → [dx, dy] jitter of one buzz (two pulses, 0.55 s)
import { rgba, clamp, lin, eout, eio, sm, addGlow, text, mix } from '../engine.mjs';
import { shareLight } from './share.mjs';

export function buzzOffset(t, t0) {
  const u = t - t0; if (u < 0 || u > .62) return [0, 0];
  const env = (u < .26 ? Math.sin(Math.PI * u / .26) : u > .34 ? Math.sin(Math.PI * (u - .34) / .26) : 0);
  return [Math.sin(u * 190) * 2.6 * env, Math.cos(u * 157) * 1.6 * env];
}
export function phoneCard(ctx, x, y, w, t, c = {}) {
  const t0 = c.t0 ?? -99, u = eout(lin(t0, t0 + .45, t)); if (u <= 0) return;
  const h = w * .28, from = c.from === 'bottom' ? 1 : -1, yy = y + from * (1 - u) * h * 1.4, warm = c.kind === 'warm';
  ctx.save(); ctx.globalAlpha = u;
  ctx.fillStyle = warm ? 'rgba(48,34,30,.94)' : 'rgba(38,40,50,.92)'; ctx.beginPath(); ctx.roundRect(x, yy, w, h, h * .22); ctx.fill();
  ctx.strokeStyle = warm ? rgba('#ffb35c', .45) : 'rgba(200,210,230,.18)'; ctx.lineWidth = Math.max(1, w * .004); ctx.stroke();
  const ix = x + h * .5, iy = yy + h * .5;
  if (c.icon === 'share' || warm) shareLight(ctx, ix, iy, h * .17, t, { born: c.born ?? (t0 + .3), pulse: 1 });
  else { ctx.fillStyle = 'rgba(160,168,185,.6)'; ctx.beginPath(); ctx.roundRect(ix - h * .2, iy - h * .2, h * .4, h * .4, h * .08); ctx.fill(); }
  if (c.title) text(ctx, c.title, x + h * .95, yy + h * .44, { size: Math.round(h * .26), weight: 600, color: warm ? '#fff1d6' : 'rgba(225,230,240,.85)' });
  else { ctx.fillStyle = 'rgba(210,215,228,.55)'; ctx.fillRect(x + h * .95, yy + h * .3, w * .45, h * .12); }
  if (c.sub) text(ctx, c.sub, x + h * .95, yy + h * .76, { size: Math.round(h * .19), weight: 400, color: warm ? 'rgba(255,225,190,.75)' : 'rgba(200,205,220,.6)' });
  else { ctx.fillStyle = 'rgba(190,196,210,.32)'; ctx.fillRect(x + h * .95, yy + h * .6, w * .6, h * .09); }
  ctx.restore();
}
export function phone(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, W0 = 150, H0 = 310; // phone units
  const buzzes = o.buzz == null ? [] : [].concat(o.buzz);
  let jx = 0, jy = 0, slid = 0;
  for (const b0 of buzzes) { const [dx, dy] = buzzOffset(t, b0); jx += dx; jy += dy; slid += eout(lin(b0, b0 + .6, t)); }
  const sl = o.slide || [0, 0], px = x + sl[0] * slid / Math.max(1, buzzes.length) + jx * s, py = y + sl[1] * slid / Math.max(1, buzzes.length) + jy * s;
  const ang = (o.ang ?? 0) + .01 * Math.sin(t * 40) * (Math.abs(jx) > .1 ? 1 : 0);
  const lit = o.lit ?? (buzzes.length ? Math.max(...buzzes.map((b0) => sm(lin(b0, b0 + .25, t)))) : 0), glowA = (o.glow ?? 1) * lit;
  // display light on the table around the phone
  if (glowA > 0) { addGlow(ctx, px, py, 420 * s, .3 * glowA, '#9fd4ff', '#e8f6ff'); addGlow(ctx, px, py, 220 * s, .22 * glowA, '#cfe6ff', '#ffffff'); }
  ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(s, s);
  if (!o.held) { ctx.fillStyle = 'rgba(4,3,10,.55)'; ctx.beginPath(); ctx.roundRect(-W0 / 2 + 10, -H0 / 2 + 14, W0, H0, 22); ctx.fill(); }
  // body with a thin metal rim catching the window light
  ctx.fillStyle = o.body || '#14141b'; ctx.beginPath(); ctx.roundRect(-W0 / 2, -H0 / 2, W0, H0, 22); ctx.fill();
  const rg = ctx.createLinearGradient(-W0 / 2, -H0 / 2, W0 / 2, H0 / 2); rg.addColorStop(0, 'rgba(230,236,255,.55)'); rg.addColorStop(.4, 'rgba(230,236,255,.05)'); rg.addColorStop(1, 'rgba(255,200,150,.25)');
  ctx.strokeStyle = rg; ctx.lineWidth = 3; ctx.stroke();
  // display
  const dw = W0 - 14, dh = H0 - 16;
  ctx.save(); ctx.beginPath(); ctx.roundRect(-dw / 2, -dh / 2, dw, dh, 17); ctx.clip();
  const dg = ctx.createLinearGradient(0, -dh / 2, 0, dh / 2); dg.addColorStop(0, mixc('#0b0d16', '#2a3550', lit)); dg.addColorStop(1, mixc('#06070c', '#141a2c', lit));
  ctx.fillStyle = dg; ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
  if (o.screen) { ctx.save(); ctx.translate(-dw / 2, -dh / 2); o.screen(ctx, dw, dh, t); ctx.restore(); }
  if (o.card) phoneCard(ctx, -dw / 2 + 8, -dh / 2 + 34, dw - 16, t, o.card);
  // glass reflection of the window: one soft diagonal band
  const gl = ctx.createLinearGradient(-dw / 2, -dh / 2, dw / 2, dh / 2); gl.addColorStop(.25, 'rgba(255,255,255,0)'); gl.addColorStop(.33, 'rgba(220,235,255,.10)'); gl.addColorStop(.42, 'rgba(255,255,255,0)');
  ctx.fillStyle = gl; ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
  ctx.restore();
  ctx.fillStyle = '#05050a'; ctx.beginPath(); ctx.roundRect(-16, -dh / 2 + 6, 32, 9, 4.5); ctx.fill(); // camera notch
  ctx.restore();
  return { x: px, y: py, ang };
}
function mixc(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return `rgb(${m(16)},${m(8)},${m(0)})`; }
