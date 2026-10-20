// C1 · H.09 "Let me show you how it could reach every person on Earth." — a sideways track along a row of open hands (every skin,
// sleeve and age: a baby's hand, a ring, a work jacket, pyjamas). The share light hops from palm to palm and leaves a light in each;
// on "every person" the camera pulls far back: the row is the curve of the Earth, and every palm along it lights up.
import { W, H, rgba, clamp, lin, mix, eout, eio, ein, sm, prng, drift, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';
import { hand, SKINS } from './hand.mjs';
import { shareLight } from './share.mjs';
import { ghostLine } from './ghost.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2, bump = (u) => Math.sin(Math.PI * clamp(u));
const HS = 2.2, SPW = 380, SPH = 900, WX = 190, WY = 470;   // hand sprite: wrist at (WX, WY), fingers up
const VAR = [
  { skin: SKINS[2], sleeve: '#2f4a6b' }, { skin: SKINS[4], sleeve: '#c8843a', ring: true }, { skin: SKINS[0], sleeve: '#6b2f3a' },
  { skin: SKINS[3], sleeve: '#3d5a3a', baby: true }, { skin: SKINS[5], sleeve: '#8a8f9c', stripes: '#c9d3e6' }, { skin: SKINS[1], sleeve: '#a3542c' },
  { skin: SKINS[4], sleeve: '#1f6a6e' }, { skin: SKINS[0], sleeve: '#54405e', ring: true }, { skin: SKINS[2], sleeve: '#b89a3c' },
];
function handSprite(i) {
  return once('h' + i, () => {
    const v = VAR[i % VAR.length], [c, g] = canvas(SPW, SPH);
    hand(g, WX, WY, v.baby ? HS * .72 : HS, { pose: v.baby ? 'baby' : 'open', ang: -Math.PI / 2 + (i % 3 - 1) * .05, skin: v.skin, sleeve: v.sleeve, sleeveLen: 220, t: 0, seed: i, ring: !!v.ring, light: [.35, -1], rim: '#ffe2b0', flip: i % 2 === 1 });
    if (v.stripes) { g.save(); g.globalCompositeOperation = 'source-atop'; g.strokeStyle = rgba(v.stripes, .5); g.lineWidth = 7; for (let y = WY + 30; y < SPH; y += 26) { g.beginPath(); g.moveTo(0, y); g.lineTo(SPW, y - 8); g.stroke(); } g.restore(); }
    return c;
  });
}
// the row lies on a great circle (the Earth): centre far below, the near hands almost on a straight line
const RC = 7200, CXW = 0, CYW = 960 + RC, DTH = 285 / RC;
const at = (k) => { const a = k * DTH; return { x: CXW + Math.sin(a) * RC, y: CYW - Math.cos(a) * RC, a }; };
const palm = (k) => { const p = at(k), d = 88 * (VAR[((k % 9) + 9) % 9].baby ? .72 : 1); return [p.x + Math.sin(p.a) * d, p.y - Math.cos(p.a) * d]; };
function sky() {
  return once('sky', () => {
    const [c, g] = canvas(W, H), bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a0e22'); bg.addColorStop(.6, '#141a3a'); bg.addColorStop(1, '#1c1f3e'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const r = prng(8); for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(230,236,255,${.15 + .5 * r() * r()})`; const z = r() < .9 ? 1.2 : 2.2; g.fillRect(r() * W, r() * H * .8, z, z); }
    stipple(c, { k: .3, g: 1, seed: 5, mid: false, boost: 1 }); return c;
  });
}
function globeGlow(R) { return once('gg' + R, () => { const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,200,130,.75)'); rg.addColorStop(.3, 'rgba(255,170,90,.25)'); rg.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); return c; }); }
export function handsShot(ctx, t, K) {
  const t0 = K.t09, P0 = K.person;
  // the light hops from palm to palm (first hand k0 = -2), the camera tracks sideways with it; then the big pull-back
  const ta = t0 - .275, tb = t0 + .275, hop0 = tb + .42, HOP = .34, kStart = -3, nHops = Math.max(0, Math.min(6, Math.floor((P0 - hop0) / HOP)));
  const hp = (t - hop0) / HOP, kf = kStart + clamp(hp, 0, nHops);
  const back = eio(clamp((t - (P0 - .1)) / 1.35)), z = Math.exp(mix(Math.log(1), Math.log(.15), back));
  const trackX = mix(-560, 560, eio(clamp((t - t0) / (P0 - t0 + .2)))) * (1 - back), camX = trackX, camY = mix(620, 2700, back);
  ctx.drawImage(sky(), 0, 0);
  ctx.save(); ctx.translate(W / 2 + drift(t, 5, 1), H / 2 + drift(t, 4, 2)); ctx.scale(z, z); ctx.translate(-camX, -camY);
  // the Earth: a dark disc with a faint graticule, its limb glowing at dawn
  ctx.save(); ctx.beginPath(); ctx.arc(CXW, CYW, RC - 60, 0, TAU); const eg = ctx.createRadialGradient(CXW, CYW - RC * .9, 0, CXW, CYW, RC); eg.addColorStop(0, '#1b2046'); eg.addColorStop(1, '#0a0c1e'); ctx.fillStyle = eg; ctx.fill();
  ctx.clip(); ctx.strokeStyle = 'rgba(170,190,240,.07)'; ctx.lineWidth = 3 / Math.max(.3, z); for (let i = 1; i < 12; i++) { ctx.beginPath(); ctx.ellipse(CXW, CYW, RC * i / 12, RC, 0, 0, TAU); ctx.stroke(); } for (let i = 1; i < 10; i++) { const yy = CYW - RC + i * RC / 5; ctx.beginPath(); ctx.moveTo(CXW - RC, yy); ctx.lineTo(CXW + RC, yy); ctx.stroke(); } ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [wd, al, col] of [[260, .035, '255,170,100'], [110, .1, '255,180,110'], [34, .3, '255,214,160']]) { ctx.strokeStyle = `rgba(${col},${al * (.6 + 1.2 * back)})`; ctx.lineWidth = wd / Math.max(.18, z) * (z < .5 ? 1 : .5); ctx.beginPath(); ctx.arc(CXW, CYW, RC - 50, -Math.PI / 2 - 1.3, -Math.PI / 2 + 1.3); ctx.stroke(); }
  ctx.restore();
  // the hands along the limb (only those near the view are drawn)
  const span = (W / 2 / z + 400) / 285, kc = camX / 285, kMin = Math.floor(kc - span), kMax = Math.ceil(kc + span);
  const wave = clamp((t - (P0 + .15)) / 1.3);   // every palm lights up in a wave running outward along the curve
  const lit = [];
  for (let k = Math.max(-60, kMin); k <= Math.min(60, kMax); k++) {
    const p = at(k), S = handSprite(((k % 9) + 9) % 9), bob = Math.sin(t * 1.4 + k * 1.7) * 3;
    ctx.save(); ctx.translate(p.x, p.y + bob); ctx.rotate(p.a); ctx.drawImage(S, -WX, -WY); ctx.restore();
    const visited = k >= kStart && k < kf, wk = clamp((wave * 26 - Math.abs(k - kc)) / 2);
    if (visited || wk > 0) lit.push([k, visited ? 1 : wk]);
  }
  // lights resting in the palms (glow first, then the cores)
  const G = globeGlow(120);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [k, a] of lit) { const [x, y] = palm(k); const r = 120 / Math.max(.2, z) * .6; ctx.globalAlpha = Math.min(1, (.75 + .4 * back) * a); ctx.drawImage(G, x - r, y - r, r * 2, r * 2); }
  ctx.restore();
  for (const [k, a] of lit) { const [x, y] = palm(k); shareLight(ctx, x, y, 8 / Math.max(.18, z), t, { a }); }
  // the travelling light: a little arc from palm to palm, a dotted trace of where it has been
  if (t < P0 + .3) {
    const i = Math.floor(clamp(hp, 0, nHops)), q = clamp(hp - i, 0, 1), hopping = hp >= 0 && hp < nHops;
    let x, y;
    // it arrives holding its screen point (760, 470) while the hands slide in under it (the 'left' move), then drops into the first palm
    const e = eio(clamp((t - ta) / .55)), sx = 760 - (1 - e) * W, ex = camX + (sx - W / 2), ey = camY + (470 - H / 2), land = clamp((t - tb) / .42);
    if (hp < 0) { const [px, py] = palm(kStart); x = mix(ex, px, eio(land)); y = mix(ey, py, eio(land)) - 70 * bump(land); }
    else if (hopping) { const [ax, ay] = palm(kStart + i), [bx, by] = palm(kStart + i + 1), e = eio(q); x = mix(ax, bx, e); y = mix(ay, by, e) - 120 * bump(q); }
    else { [x, y] = palm(kStart + nHops); }
    const trail = []; for (let j = 0; j <= 24; j++) { const s = Math.max(-1, hp - j * .05); const ii = Math.floor(clamp(s, 0, nHops)), qq = clamp(s - ii, 0, 1); if (s < 0) break; const [ax, ay] = palm(kStart + ii), [bx, by] = palm(kStart + Math.min(nHops, ii + 1)); trail.push([mix(ax, bx, eio(qq)), mix(ay, by, eio(qq)) - 120 * bump(qq)]); }
    if (trail.length > 2) ghostLine(ctx, trail, { ghost: 1, col: '#ffe2b0', w: 2.2, a: .7, dot: 9, t });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(G, x - 140, y - 140, 280, 280); ctx.restore();
    shareLight(ctx, x, y, 14, t, { a: 1 });
  }
  ctx.restore();
  const vg = ctx.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 1150); vg.addColorStop(0, 'rgba(4,5,12,0)'); vg.addColorStop(1, 'rgba(4,5,12,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}
