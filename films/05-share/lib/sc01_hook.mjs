// C1 · the hook in the hand: H.01 (your hand holds the phone in the dark; the buzz ripples out as engraved guilloche rings),
// H.02a / H.02b (inside the display: two flat grey cards get swiped away: bill to the left, paycheck up), H.03 (the one engraved card
// rises from below and locks in: guilloche border, microtext, an embossed seal, "Your share" in gold foil, the share light is born).
// Patterns copied from ref/k0/scenes.mjs hookHand (cached background, fog, bloom, motes) and extended.
import { W, H, rgba, clamp, lin, mix, eout, eio, ein, sm, drift, prng, canvas, text } from '../engine.mjs';
import { stipple, fog } from './art.mjs';
import { heldPhone } from './phone.mjs';
import { ripple, ring, rosette, gBorder, microtext, microRing, seal, foilGlint, guilloche } from './certificate.mjs';
import { shareLight } from './share.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const eoX = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const eiX = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));

// ---------- H.01 ----------
function hookBg() {
  return once('hookbg', () => {
    const [c, g] = canvas(W + 200, H + 120), r = prng(11);
    const bg = g.createRadialGradient(860, 470, 0, 940, 600, 1350); bg.addColorStop(0, '#111a36'); bg.addColorStop(.45, '#080c1d'); bg.addColorStop(1, '#020309'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
    // far below: the city out of focus (soft discs of window and street light), only a hint in the dark
    for (let i = 0; i < 95; i++) {
      const x = r() * c.width, y = c.height * (.58 + r() * .45), rr = 8 + r() * 38, warm = r() < .6, a = .03 + r() * .08;
      const dg = g.createRadialGradient(x, y, 0, x, y, rr); dg.addColorStop(0, warm ? `rgba(255,170,90,${a})` : `rgba(170,200,255,${a})`); dg.addColorStop(.8, warm ? `rgba(255,170,90,${a * .8})` : `rgba(170,200,255,${a * .8})`); dg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = dg; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill();
    }
    stipple(c, { k: .35, g: 1, seed: 6, mid: false, boost: 1 });
    return c;
  });
}
function hookFog() { return once('hookfog', () => { const [c, g] = canvas(W, H); fog(g, { y0: 120, y1: 980, col: '#3a4f7a', a: .22, seed: 4, sx: .0024, sy: .006, cover: .55, soft: .35, k: .6 }); return c; }); }
function screenBloom() { return once('scrbloom', () => { const R = 760, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,190,120,.55)'); rg.addColorStop(.18, 'rgba(255,160,90,.24)'); rg.addColorStop(.5, 'rgba(255,140,70,.06)'); rg.addColorStop(1, 'rgba(255,140,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .9, g: 1.2, seed: 15 }); return c; }); }
function coolBloom() { return once('coolbloom', () => { const R = 700, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(170,200,255,.4)'); rg.addColorStop(.2, 'rgba(140,170,230,.15)'); rg.addColorStop(1, 'rgba(140,170,230,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .9, g: 1.2, seed: 16 }); return c; }); }
function motes(ctx, t, cx, cy, a) {
  if (a <= 0) return; const r = prng(23); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 110; i++) { const ang = r() * 6.283, d = 140 + r() * 560, sp = .2 + r() * .5, x = cx + Math.cos(ang) * d + Math.sin(t * sp + i) * 24, y = cy + Math.sin(ang) * d * .8 + Math.cos(t * sp * .8 + i * 1.7) * 18 - t * 6; const f = Math.max(0, 1 - d / 700); ctx.fillStyle = `rgba(255,214,170,${(.12 + .45 * r()) * f * a})`; const z = r() < .8 ? 1.4 : 2.4; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}
const LOCK = (K) => ({ time: '6:12', day: 'Monday', cards: [{ title: 'Electricity bill', sub: 'Payment due Friday', t0: K.buzz + .12, t1: 99 }] });
export function hookHand(ctx, t, K) {
  const push = eio(clamp(t / (K.bill + .2))), s = mix(2.02, 2.42, push) * (1 + .006 * Math.sin(t * 1.3));
  const ang = -.12 + .012 * Math.sin(t * .4) + .03 * (1 - push);
  const cen = eio(clamp((t - (K.bill - 1.1)) / 1.3));               // the push-in centres the notification for the zoom into the glass
  const cx = 905 + drift(t, 6, 1) - push * 10 + 62 * cen, cy = 450 + drift(t, 5, 2) + (1 - push) * 26 + 175 * cen;
  const exp = sm(clamp(t / 1.1));                                  // the first second: the light finds the hand
  ctx.save(); ctx.translate(-100 + drift(t, 14, 4) - t * 4, -60 + drift(t, 8, 5)); ctx.drawImage(hookBg(), 0, 0); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.drawImage(hookFog(), drift(t, 20, 3) - t * 5, 0); ctx.restore();
  const lit = sm(clamp((t - K.buzz + .06) / .22));
  const buzzes = [K.buzz, K.buzz2];
  // before the buzz: the dark display holds a cool reflection of the city (a slow sweep), only a rim of light on the fingers
  if (lit < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 * (1 - lit) * exp; const B = coolBloom(); ctx.drawImage(B, cx - B.width / 2 * .5 + 60, cy - B.height / 2 * .5 - 40, B.width * .5, B.height * .5); ctx.restore(); }
  // the buzz: engraved rings behind the phone and the hand
  ripple(ctx, cx, cy, t, buzzes, { w0: 75 * s, h0: 150 * s * .97, rot: ang, rings: 2, gap: .2, speed: 520, life: 2.7, lines: 9, band: 24, wave: 38, col: '#fff1d6', coolCol: '#9fb6cf', glow: '#ffb35c', a: 1, lw: 1.1 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9 * lit; const B = screenBloom(); ctx.drawImage(B, cx - B.width / 2, cy - B.height / 2); ctx.restore();
  // the rings contract onto the display just before we push into it
  const pull = clamp((t - (K.bill - .62)) / .55);
  if (pull > 0 && pull < 1) { const e = eiX(pull), R = mix(820, 150 * s * .5, e); ring(ctx, cx, cy, mix(R, 75 * s, e), mix(R, 150 * s * .97, e), { lines: 9, band: 26, wave: 38, col: '#fff1d6', glow: '#ffb35c', a: .9 * Math.sin(Math.PI * pull), lw: 1.2, p: mix(2, 6, e), rot: ang, ph: t }); }
  ctx.globalAlpha = exp;
  const P = heldPhone(ctx, cx, cy, s, { t, buzz: buzzes.map((b) => b - .04), ang, lit, lock: LOCK(K), skin: '#b98261', rim: '#dfe6f2', rimA: .35 + .4 * lit, warm: 1 });
  ctx.globalAlpha = 1;
  // the wrist sinks into the dark below the hand (only the hand near the glass is lit)
  { const [ax, ay] = P.map(150, 150), [bx, by] = P.map(232, 268), wg = ctx.createLinearGradient(ax, ay, bx, by); wg.addColorStop(0, 'rgba(2,3,9,0)'); wg.addColorStop(.55, 'rgba(2,3,9,.55)'); wg.addColorStop(1, 'rgba(2,3,9,.94)'); ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H); }
  // the second ring runs over the fingers: a faint pass of the youngest ring in front of the hand
  ripple(ctx, cx, cy, t, buzzes.map((b) => b + .2), { w0: 75 * s, h0: 150 * s * .97, rot: ang, rings: 1, speed: 520, life: 1.2, lines: 5, band: 16, wave: 38, col: '#fff1d6', coolCol: '#ffe2b8', glow: null, a: .32, lw: .8 });
  motes(ctx, t, cx, cy, lit);
  const vg = ctx.createRadialGradient(cx, cy, 300, cx, cy, 1250); vg.addColorStop(0, 'rgba(2,3,9,0)'); vg.addColorStop(1, `rgba(2,3,9,${.62 + .3 * (1 - exp)})`); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return P;
}

// ---------- inside the display (H.02a, H.02b, H.03): one continuous take on the lock screen ----------
// The camera has flown into the notification: the glass fills the frame. Two flat grey cards get rejected (the bill is flicked
// off to the left, the paycheck is flung up), then the one engraved card rises out of a warm light from below and locks in.
// Display units: origin = the card centre = frame centre at z 1.
const WW = 2500, WH = 1500, WX = 1250, WY = 700;
function wallpaper() {
  return once('wall2', () => {
    const [c, g] = canvas(WW, WH);
    const bg = g.createLinearGradient(0, 0, 0, WH); bg.addColorStop(0, '#202a49'); bg.addColorStop(.42, '#151c31'); bg.addColorStop(1, '#090c17'); g.fillStyle = bg; g.fillRect(0, 0, WW, WH);
    const cg = g.createRadialGradient(WX - 200, WY - 520, 0, WX - 200, WY - 520, 1100); cg.addColorStop(0, 'rgba(120,150,220,.16)'); cg.addColorStop(1, 'rgba(120,150,220,0)'); g.fillStyle = cg; g.fillRect(0, 0, WW, WH);
    // the wallpaper's own engraved rosette (a watermark that waits behind the cards)
    rosette(g, WX, WY + 30, { R: 660, A: 44, B: 16, n: 42, m: 13, lines: 22, col: '#9cb0de', w: 1.3, a: .16, steps: 1400 });
    rosette(g, WX, WY + 30, { R: 420, A: 30, B: 12, n: 30, m: 9, lines: 16, col: '#b4c4e6', w: 1.2, a: .13, steps: 1200 });
    g.textAlign = 'center';
    g.fillStyle = 'rgba(236,240,250,.72)'; g.font = '500 40px "Inter"'; g.fillText('Monday, 20 October', WX, WY - 492);
    g.fillStyle = 'rgba(238,242,252,.93)'; g.font = '300 230px "Inter"'; g.fillText('6:12', WX, WY - 286);
    stipple(c, { k: .2, g: 1, seed: 3, mid: false, boost: 1 });
    return c;
  });
}
function glass(ctx, t, a = 1) {   // one soft diagonal reflection band drifting over the glass + dust
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const x = 300 + Math.sin(t * .3) * 120, gl = ctx.createLinearGradient(x, 0, x + 900, H); gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(.42, `rgba(200,220,255,${.06 * a})`); gl.addColorStop(.5, `rgba(220,235,255,${.09 * a})`); gl.addColorStop(.58, 'rgba(255,255,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  const r = prng(77); for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(220,230,255,${.03 + .06 * r()})`; const z = .8 + r() * 1.6; ctx.fillRect(r() * W, r() * H, z, z); }
  ctx.restore();
}
const CW = 1100, CHh = 300;
function greyCardLayer(c) {   // a flat notification card (cached per card)
  return once('gc' + c.title, () => {
    const [cv, g] = canvas(CW + 40, CHh + 50), x = 10, y = 10;
    g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.roundRect(x + 4, y + 12, CW, CHh, 44); g.fill();
    g.fillStyle = 'rgba(70,76,96,.93)'; g.beginPath(); g.roundRect(x, y, CW, CHh, 44); g.fill();
    g.strokeStyle = 'rgba(210,220,240,.16)'; g.lineWidth = 2; g.stroke();
    const ix = x + 96, iy = y + CHh / 2; g.fillStyle = 'rgba(150,160,182,.62)'; g.beginPath(); g.roundRect(ix - 48, iy - 48, 96, 96, 24); g.fill();
    g.strokeStyle = 'rgba(40,44,58,.85)'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
    if (c.icon === 'bolt') { g.moveTo(ix + 7, iy - 30); g.lineTo(ix - 12, iy + 4); g.lineTo(ix + 7, iy + 4); g.lineTo(ix - 6, iy + 30); }
    else { g.rect(ix - 26, iy - 18, 52, 36); g.moveTo(ix - 26, iy - 5); g.lineTo(ix + 26, iy - 5); }
    g.stroke();
    text(g, c.title, x + 180, y + CHh * .45, { size: 62, weight: 600, color: 'rgba(234,238,247,.95)' });
    text(g, c.sub, x + 180, y + CHh * .78, { size: 44, weight: 400, color: 'rgba(202,208,224,.74)' });
    if (c.amount) text(g, c.amount, x + CW - 54, y + CHh * .78, { size: 44, weight: 500, color: 'rgba(214,220,234,.8)', align: 'right' });
    text(g, 'now', x + CW - 54, y + 66, { size: 36, weight: 400, color: 'rgba(202,208,224,.56)', align: 'right' });
    return cv;
  });
}
function drawCard(ctx, L, x, y, rot, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(L, -CW / 2 - 10, -CHh / 2 - 10); ctx.restore(); }
const BILL = { title: 'Electricity bill', sub: 'Payment due Friday', icon: 'bolt' }, PAY = { title: 'Paycheck', sub: 'Deposit received', icon: 'card', amount: '$ 2,140.00' };
const bump = (u) => Math.sin(Math.PI * clamp(u));
// ---------- the share card: the only engraved card ----------
const SW = 1120, SH = 470;
function shareCardLayer() {
  return once('sharecard', () => {
    const [c, g] = canvas(SW, SH);
    g.beginPath(); g.roundRect(4, 4, SW - 8, SH - 8, 46);
    const bg = g.createLinearGradient(0, 0, SW, SH); bg.addColorStop(0, '#4a2a16'); bg.addColorStop(.55, '#33200f'); bg.addColorStop(1, '#22150b'); g.fillStyle = bg; g.fill();
    g.save(); g.clip();
    rosette(g, SW * .62, SH * .5, { R: 300, A: 40, B: 18, n: 30, m: 11, lines: 60, col: '#c88a4a', w: .6, a: .17 });
    g.restore();
    gBorder(g, 16, 16, SW - 32, SH - 32, { band: 26, lines: 7, waves: 140, col: '#e0a060', w: .7, a: .7, radius: 34 });
    microtext(g, 250, 92, SW - 330, 'ONE EQUAL SHARE FOR EVERY PERSON ON EARTH', { size: 9, col: '#ffcf96', a: .6, spacing: 1.2 });
    microtext(g, 250, SH - 86, SW - 330, 'THE FORTUNE THAT DOESN’T EXIST YET · NOT CHARITY BUT A RIGHT', { size: 9, col: '#ffcf96', a: .6, spacing: 1.2 });
    rosette(g, 150, SH / 2, { R: 74, A: 20, B: 9, n: 14, m: 5, lines: 26, col: '#ffcf8a', w: .7, a: .8 });
    g.strokeStyle = 'rgba(255,200,130,.6)'; g.lineWidth = 1.4; g.beginPath(); g.arc(150, SH / 2, 112, 0, 7); g.stroke(); g.lineWidth = .8; g.beginPath(); g.arc(150, SH / 2, 118, 0, 7); g.stroke();
    stipple(c, { k: .2, g: 1, seed: 8, mid: false, boost: 1 });
    return c;
  });
}
function foilTitle() {
  return once('foiltitle', () => {
    const size = 150, [c, g] = canvas(760, 200);
    g.font = `${size}px "Instrument Serif"`; g.textBaseline = 'alphabetic';
    const fg = g.createLinearGradient(0, 30, 700, 180); fg.addColorStop(0, '#ffd99a'); fg.addColorStop(.35, '#ffb35c'); fg.addColorStop(.6, '#fff1d6'); fg.addColorStop(.8, '#e09040'); fg.addColorStop(1, '#c87a2c');
    g.fillStyle = 'rgba(30,12,4,.8)'; g.fillText('Your share', 14, 158); g.fillStyle = fg; g.fillText('Your share', 10, 154);
    const [nc] = canvas(760, 200); const nx = nc.getContext('2d'); nx.drawImage(c, 0, 0); nx.globalCompositeOperation = 'source-in'; nx.fillStyle = 'rgba(255,240,200,.5)'; nx.fillRect(0, 0, 760, 200); stipple(nc, { k: 1, g: 1.5, seed: 9, mid: false, boost: 1.3 });
    g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0); g.globalCompositeOperation = 'source-over';
    return c;
  });
}
const GL = canvas(760, 200);   // scratch: the glint band clipped to the letters
function shareCard(ctx, t, lockT) {
  const settle = t - lockT;
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.roundRect(-SW / 2 + 8, -SH / 2 + 18, SW, SH, 46); ctx.fill();
  ctx.drawImage(shareCardLayer(), -SW / 2, -SH / 2);
  const F = foilTitle(), fx = -SW / 2 + 290, fy = -SH / 2 + 70; ctx.drawImage(F, fx, fy);
  // the foil catches the light as the card locks in: a bright band runs through the letters only
  const gl = clamp((t - lockT + .04) / .75);
  if (gl > 0 && gl < 1) {
    const [gc, gx] = GL; gx.setTransform(1, 0, 0, 1, 0, 0); gx.globalCompositeOperation = 'source-over'; gx.clearRect(0, 0, 760, 200); gx.drawImage(F, 0, 0);
    gx.globalCompositeOperation = 'source-in'; const bx = mix(-160, 920, eio(gl)), gg = gx.createLinearGradient(bx - 120, 0, bx + 60, 200);
    gg.addColorStop(0, 'rgba(255,220,160,0)'); gg.addColorStop(.5, 'rgba(255,252,236,1)'); gg.addColorStop(1, 'rgba(255,220,160,0)'); gx.fillStyle = gg; gx.fillRect(0, 0, 760, 200);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .95 * Math.sin(Math.PI * gl); ctx.drawImage(gc, fx, fy); ctx.restore();
  }
  text(ctx, 'NOW', SW / 2 - 60, -SH / 2 + 70, { size: 26, weight: 600, color: 'rgba(255,214,160,.75)', align: 'right', spacing: 4 });
  text(ctx, 'A SHARE IN YOUR NAME', -SW / 2 + 300, SH / 2 - 110, { size: 28, weight: 600, color: 'rgba(255,220,180,.82)', spacing: 7 });
  // the embossed seal presses in (a small spring back) and the share light is born at the medallion's heart
  const sp = clamp((t - lockT - .05) / .4), sealS = sp > 0 ? 1 + .18 * (1 - eout(sp)) - .03 * Math.sin(Math.PI * sp) : 0;
  if (sealS > 0) seal(ctx, SW / 2 - 120, SH / 2 - 92, 64 * sealS, t, { foil: true, label: 'ONE EQUAL SHARE FOR EVERY PERSON', rot: -.2, glintPhase: .3 });
  shareLight(ctx, -SW / 2 + 150, 0, 26, t, { born: lockT + .05, pulse: 1 });
  // the lock-in: one bright pass around the card edge, widening and fading
  if (settle > 0 && settle < .7) { const q = settle / .7; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,214,150,${.85 * (1 - q)})`; ctx.lineWidth = 2 + 6 * (1 - q); ctx.beginPath(); ctx.roundRect(-SW / 2 - q * 40, -SH / 2 - q * 40, SW + q * 80, SH + q * 80, 46 + q * 40); ctx.stroke(); ctx.restore(); }
}
export function lockTake(ctx, t, K) {
  ctx.fillStyle = '#05060c'; ctx.fillRect(0, 0, W, H);
  const lockT = K.shareE - .06;                                     // the lock-in lands with the foil_glint sfx
  // timing of the three cards
  const billIn = eoX(clamp((t - (K.buzz + .12)) / .5)), wipe = clamp((t - (K.billE - .12)) / .3);
  const payIn = eoX(clamp((t - (K.billE - .04)) / .55)), fly = clamp((t - (K.payE - .22)) / .3);
  const rise = clamp((t - (K.payE + .02)) / (lockT - K.payE - .02)), settle = t - lockT;
  // camera: a slow push, small follow moves with each rejection, then it leans in to the share card and straightens
  const lean = eio(clamp((t - (K.payE - .1)) / (lockT - K.payE + .5)));
  const j = t - K.buzz2, jolt = j > 0 && j < .5 ? Math.sin(j * 120) * 7 * Math.sin(Math.PI * j / .5) : 0;
  const z = 1.0 + .025 * clamp((t - K.bill) / 2.5) + .07 * lean + (settle > 0 ? .012 * Math.exp(-settle * 5) * Math.sin(settle * 18) : 0);
  const dx = -34 * bump(wipe * .8) + 18 * bump((t - (K.billE - .04)) / .9) + jolt, dy = -22 * bump(fly * .8) + 30 * (1 - lean) * clamp(rise * 3) * 0;
  ctx.save(); ctx.translate(W / 2 + drift(t, 8, 1) + dx, H / 2 + 20 + drift(t, 6, 2) + dy - 30 * lean); ctx.rotate(-.045 + .006 * Math.sin(t * .5) + .03 * lean); ctx.scale(z, z);
  ctx.drawImage(wallpaper(), -WX, -WY);
  // the bill: dropped in with the buzz, flicked off to the left on "bill" (a short trail behind it)
  if (wipe < 1) { const e = ein(wipe), x = -e * 1900, y = -(1 - billIn) * 380, L = greyCardLayer(BILL);
    for (let k = 4; k >= 1; k--) drawCard(ctx, L, x + k * 80 * Math.min(1, wipe * 4), y, -.05 * e, .045 * bump(wipe * 1.4));
    drawCard(ctx, L, x, y, -.05 * e, billIn * (1 - wipe * .4)); }
  // the paycheck: slides in from the right as the bill leaves, flung up on "paycheck"
  if (payIn > 0 && fly < 1) { const e = ein(fly), x = (1 - payIn) * 1500, y = -e * 1300, L = greyCardLayer(PAY);
    for (let k = 4; k >= 1; k--) drawCard(ctx, L, x, y + k * 70 * Math.min(1, fly * 4), .03 * e, .045 * bump(fly * 1.4));
    drawCard(ctx, L, x, y, .03 * e, Math.min(1, payIn * 1.5) * (1 - fly * .4)); }
  // warm light gathering below the edge (the next card is coming), then flooding the glass when it locks
  const pre = clamp((t - (K.payE - .3)) / .6), warmA = pre * (.3 + .3 * clamp(rise * 1.4)) + .25 * (settle > 0 ? Math.exp(-settle * 2) : 0);
  const go = clamp((rise - .4) / .6), os = settle > 0 ? Math.exp(-settle * 9) * Math.sin(settle * 26) * .035 : 0;   // ≤ 4 % overshoot
  const y = mix(1250, mix(640, 0, eoX(go)), eout(clamp(rise / .4))) - (settle > 0 ? os * 300 : 0);
  if (warmA > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gy = Math.min(y + 60, 900), gg = ctx.createRadialGradient(0, gy, 0, 0, gy, 1150); gg.addColorStop(0, `rgba(255,170,90,${.5 * warmA})`); gg.addColorStop(.4, `rgba(255,150,70,${.16 * warmA})`); gg.addColorStop(1, 'rgba(255,150,70,0)'); ctx.fillStyle = gg; ctx.fillRect(-1300, -800, 2600, 1800); ctx.restore(); }
  if (rise > 0) { const sc = 1 + os + (settle > -.1 && settle < .25 ? .02 * Math.sin(Math.PI * clamp((settle + .1) / .35)) : 0);
    ctx.save(); ctx.translate(0, y); ctx.scale(sc, sc); shareCard(ctx, t, lockT); ctx.restore(); }
  ctx.restore();
  glass(ctx, t, .8);
  const vg = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1150); vg.addColorStop(0, 'rgba(2,3,9,0)'); vg.addColorStop(1, 'rgba(2,3,9,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  // as the camera starts to pull back, the glass shows its edge: a dark bezel with round corners (it reads as a screen as it shrinks)
  const bz = sm(clamp((t - (K.t04 - .1)) / .4));
  if (bz > 0) { const i = 46 * bz, r = 120 * bz; ctx.save(); ctx.fillStyle = '#04050a'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.roundRect(i, i, W - 2 * i, H - 2 * i, r); ctx.fill('evenodd');
    ctx.strokeStyle = `rgba(190,205,230,${.35 * bz})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(i - 10, i - 10, W - 2 * i + 20, H - 2 * i + 20, r + 10); ctx.stroke(); ctx.restore(); }
}
// the three shots of the take (kept as names for the plan table)
export const lockShot = (ctx, t, K) => lockTake(ctx, t, K);
export const shareShot = (ctx, t, K) => lockTake(ctx, t, K);
