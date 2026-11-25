// Film 79 · builder B1 (c02–c04) · new kit pieces (only NEW functions; the shared libs stay untouched).
// Places: the neighbour's garage annex (boat hull under a sheet), the kerb across the road (low, cold), the robotaxi cabin with crates,
// the kitchen meter. Graphics (EXPL, night ground): the big NOT NEEDED counter, the day dial, the trip map, the data centre section,
// the ladder, the 24-h schedule ring, the power flow, the PJM bill (row order of c04). Carriers: seamWipe (B opens out of a light line).
import * as K from './f79_kit.mjs';
import * as S from './f79_street.mjs';
import { canvas as mkCanvas } from '../engine.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, rad, lin, prng, CARM, AMBER } = K;
export const PALE = '#b8c4f0';   // pale ink on the night ground (what did NOT happen / what used to be)
export const REST = '#6a74a8';   // dataviz: the neutral "rest" (validated vs carmine #e0284f and amber #ffb35c on #0b1238)
export const TXT = { text: P.cream, sub: '#a9b2d8', faint: rgba('#a9b2d8', .6) };
export const T = (c, s, x, y, o = {}) => K.glowText(c, s, x, y, { size: 24, weight: 600, col: TXT.text, glow: false, spacing: .12, ...o });
// a smooth open/close envelope for K.paper (which eases with expoOut itself): the card's scale then follows a sine curve, not a pop
export const cardS = (t, t0, t1, op = 1.1, cl = .8) => { const v = K.sineIO(span(t, t0, t0 + op)) * (1 - K.sineIO(span(t, t1 - cl, t1))); return v <= 0 ? 0 : Math.min(1, (-Math.log2(1 - v * .999) / 10 + .15) / 1.25); };   // K.paper's height eases with expoOut(1.25u − .15): match it, so it never snaps

// ---------------------------------------------------------------- carriers
// seamWipe: B opens in a band out of a horizontal light line at screen y (carmine by default: the data centre seam, the tower band)
export const seamWipe = (y, o = {}) => (ctx, u, dA, dB) => {
  const e = K.quartIO(u), h = H * 1.3 * e, col = o.col || CARM.hot;
  dA(ctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(-10, y - h * (y / H), W + 20, h); ctx.clip(); dB(ctx); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const a = 1 - span(u, .55, 1), g = K.expoOut(span(u, 0, .4)), y0 = y - h * (y / H), y1 = y0 + h;
  for (const yy of (h < 6 ? [y] : [y0, y1])) { ctx.globalAlpha = a; ctx.fillStyle = rgba(col, .25); ctx.fillRect(W / 2 - W * .6 * g, yy - 9, W * 1.2 * g, 18); ctx.fillStyle = mixHex(col, '#ffe3ea', .3); ctx.fillRect(W / 2 - W * .6 * g, yy - 2.5, W * 1.2 * g, 5); }
  ctx.restore();
};

// ---------------------------------------------------------------- the neighbour's garage (an annex right of the house across the road, card 2600)
// open 0..1 rolls the door up; lamp 0..1 his work lamp (amber, the human light); returns { door: [x,y,w,h], lamp: [x,y] } in card coords
export const GARAGE = { x: 2214, base: 800, w: 440, h: 330, door: [2254, 548, 360, 252], lamp: [2434, 600] };
export function garageAnnex(ctx, t, L, open = 0, o = {}) {
  const G = GARAGE, [dx, dy, dw, dh] = G.door, top = G.base - G.h;
  const wall = mixHex('#8e98a0', L.light, .12), wallS = mixHex('#8e98a0', L.shade, .55);
  ctx.fillStyle = lin(ctx, G.x, 0, G.x + G.w, 0, [[0, mixHex(wall, wallS, .5)], [1, wall]]); ctx.fillRect(G.x, top, G.w, G.h);
  ctx.fillStyle = mixHex(L.roofS, L.shade, .2); ctx.fillRect(G.x - 8, top - 16, G.w + 16, 18);   // flat roof edge
  ctx.fillStyle = rgba(L.ink, .18); ctx.fillRect(G.x, G.base - G.h * .05, G.w, G.h * .05);
  // the inside (drawn first, the door rolls up over it)
  ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, dh); ctx.clip();
  const lamp = o.lamp ?? 1, warm = mixHex('#3a2a30', L.shade, .25);
  ctx.fillStyle = lin(ctx, 0, dy, 0, dy + dh, [[0, mixHex(warm, '#000', .3)], [1, warm]]); ctx.fillRect(dx, dy, dw, dh);
  ctx.fillStyle = mixHex('#5a4636', L.shade, .3); ctx.fillRect(dx + 20, dy + 40, 120, 70);   // pegboard + tools
  ctx.fillStyle = '#20161e'; for (let i = 0; i < 5; i++) { const x = dx + 32 + i * 22; if (i % 2) ctx.fillRect(x, dy + 48, 6, 48); else { ctx.fillRect(x - 4, dy + 48, 14, 8); ctx.fillRect(x + 1, dy + 52, 4, 40); } }
  if (lamp > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, G.lamp[0], G.lamp[1] + 30, 260, [[0, rgba('#ffcf8a', .34 * lamp)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(dx, dy, dw, dh); ctx.restore(); }
  ctx.fillStyle = '#20161e'; ctx.fillRect(G.lamp[0] - 1, dy, 2, G.lamp[1] - dy - 8); ctx.beginPath(); ctx.moveTo(G.lamp[0] - 16, G.lamp[1]); ctx.lineTo(G.lamp[0] + 16, G.lamp[1]); ctx.lineTo(G.lamp[0] + 9, G.lamp[1] - 12); ctx.lineTo(G.lamp[0] - 9, G.lamp[1] - 12); ctx.fill();
  ctx.fillStyle = lamp > .3 ? AMBER.core : '#4a4050'; ctx.beginPath(); ctx.arc(G.lamp[0], G.lamp[1] + 2, 5, 0, 7); ctx.fill();
  // the hull on trestles under a pale sheet, the bow bare
  const hx = dx + 70, hy = dy + dh - 70, hw = 250;
  ctx.fillStyle = '#20161e'; for (const tx of [hx + 40, hx + 200]) { ctx.fillRect(tx - 18, hy, 36, 6); ctx.beginPath(); ctx.moveTo(tx - 16, hy + 70); ctx.lineTo(tx - 4, hy + 4); ctx.lineTo(tx + 4, hy + 4); ctx.lineTo(tx + 16, hy + 70); ctx.fill(); }
  ctx.fillStyle = lin(ctx, 0, hy - 50, 0, hy + 10, [[0, mixHex('#c48a54', L.light, .1)], [1, '#6a3c24']]); ctx.beginPath(); ctx.moveTo(hx, hy - 48); ctx.quadraticCurveTo(hx + hw * .5, hy + 26, hx + hw, hy - 40); ctx.lineTo(hx + hw + 18, hy - 56); ctx.lineTo(hx - 6, hy - 56); ctx.closePath(); ctx.fill();
  const sw = Math.sin(t * .7) * 2;   // the sheet, breathing a little in the draught
  ctx.fillStyle = lin(ctx, 0, hy - 70, 0, hy + 20, [[0, mixHex('#e8e2d2', L.light, .2)], [1, mixHex('#9a96a8', L.shade, .3)]]);
  ctx.beginPath(); ctx.moveTo(hx + 60, hy - 64); ctx.lineTo(hx + hw + 24, hy - 62); ctx.quadraticCurveTo(hx + hw + 30, hy - 10, hx + hw + 12 + sw, hy + 22); ctx.lineTo(hx + 150, hy + 30 + sw); ctx.quadraticCurveTo(hx + 90, hy + 8, hx + 54, hy + 18); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#5a5060', .35); ctx.lineWidth = 2; for (const k of [0, 1, 2]) { ctx.beginPath(); ctx.moveTo(hx + 110 + k * 50, hy - 60); ctx.quadraticCurveTo(hx + 120 + k * 50, hy - 10, hx + 104 + k * 52, hy + 26); ctx.stroke(); }
  // the neighbour on a crate, elbows on his knees, looking at the hull
  const nx = dx + dw - 46, ny = dy + dh - 4;
  ctx.fillStyle = mixHex('#6a5040', L.shade, .2); ctx.fillRect(nx - 30, ny - 44, 60, 44); ctx.fillStyle = rgba('#000', .25); ctx.fillRect(nx - 2, ny - 44, 3, 44);
  K.folk(ctx, t, 4, nx, ny - 40, 112, { dir: -1, lean: .28, armR: [.9, 2.1], armL: [-.9, -2.1], look: -.15 + .05 * Math.sin(t * .5) });
  ctx.restore();
  // the door: steel slats rolling up
  const dd = dh * (1 - K.quartIO(clamp(open)));
  if (dd > 1) { ctx.fillStyle = lin(ctx, 0, dy, 0, dy + dd, [[0, mixHex('#9aa2b4', L.light, .12)], [1, mixHex('#6a7290', L.shade, .3)]]); ctx.fillRect(dx, dy, dw, dd);
    ctx.fillStyle = rgba(L.ink, .22); for (let y = dy + dd - 18; y > dy; y -= 18) ctx.fillRect(dx, y, dw, 2); ctx.fillStyle = rgba(L.ink, .4); ctx.fillRect(dx, dy + dd - 6, dw, 6); }
  ctx.fillStyle = mixHex('#4a5070', L.shade, .3); ctx.fillRect(dx - 12, dy - 12, dw + 24, 12); ctx.fillRect(dx - 12, dy, 12, dh); ctx.fillRect(dx + dw, dy, 12, dh);
  return { door: G.door, lamp: G.lamp };
}

// ---------------------------------------------------------------- the big NOT NEEDED counter (the hallway counter of c01, again over a stage)
// g 0..1 grows from the HUD corner to the centre; n boxes filled carmine (n-1 earlier, the last one arrives with u); labels {i: text}
export function bigCounter(ctx, t, g, n, labels, o = {}) {
  if (g <= .01) return;
  K.scr(ctx, (c) => {
    const cx = lerp(150, o.x ?? W / 2, g), cy = lerp(150, o.y ?? 330, g), k = lerp(.32, 1, g);
    c.translate(cx, cy); c.scale(k, k);
    c.fillStyle = rad(c, 0, 0, 760, [[0, rgba('#060a24', .7)], [1, rgba('#060a24', 0)]]); c.fillRect(-900, -400, 1800, 800);
    K.glowText(c, 'NOT NEEDED IN 2050', 0, -90, { size: 34, weight: 600, align: 'center', col: '#c9b8d6', spacing: .24, glow: false });
    for (let i = 0; i < 9; i++) {
      const x = (i - 4) * 104, last = i === n - 1, fill = i < n - 1 || (last && (o.fill ?? 1) > 0), fu = last ? (o.fill ?? 1) : 1;
      c.globalAlpha = 1; c.strokeStyle = fill ? CARM.hot : rgba('#e8eefc', .45); c.lineWidth = 3; c.beginPath(); c.roundRect(x - 42, -42, 84, 84, 8); c.stroke();
      if (fill) { c.save(); c.globalAlpha = fu; const r = 36 * K.expoOut(fu); c.fillStyle = rad(c, x, 0, 60, [[0, CARM.hot], [1, CARM.mid]]); c.beginPath(); c.roundRect(x - r, -r, 2 * r, 2 * r, 6); c.fill(); c.restore(); }
      K.glowText(c, String(i + 1), x, 16, { size: 46, serif: true, align: 'center', col: fill ? CARM.core : rgba('#e8eefc', .45), glow: false });
      if (labels[i]) { const lu = last ? span(fu, .3, 1) : 1; if (lu > 0) K.glowText(c, labels[i], x, i % 2 ? 128 : 84, { size: 20, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .08, a: lu }); }
    }
    if (o.q > 0) K.glowText(c, '?', 520, 22, { size: 84, serif: true, col: '#e8eefc', a: o.q });
  });
}
// the day dial (EXPL): a clock face, hands at hour h (e.g. 8.67 = 8:40), a pale arc from h to the mark m (noon), m labelled; s 0..1 size/build
export function dayDial(ctx, t, x, y, r, h, m, s = 1, o = {}) {
  if (s <= 0) return;
  K.scr(ctx, (c) => {
    c.translate(x, y); const k = K.expoOut(clamp(s)); c.scale(k, k);
    c.fillStyle = rad(c, 0, 0, r * 1.6, [[0, rgba('#1a2458', .9)], [.7, rgba('#0e1640', .6)], [1, rgba('#0b1238', 0)]]); c.beginPath(); c.arc(0, 0, r * 1.6, 0, 7); c.fill();
    c.strokeStyle = rgba('#dfe6ff', .6); c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
    for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283 - 1.5708, big = i % 5 === 0; c.strokeStyle = rgba('#dfe6ff', big ? .7 : .25); c.lineWidth = big ? 4 : 2; c.beginPath(); c.moveTo(Math.cos(a) * r * (big ? .86 : .92), Math.sin(a) * r * (big ? .86 : .92)); c.lineTo(Math.cos(a) * r * .97, Math.sin(a) * r * .97); c.stroke(); }
    const ang = (hh) => ((hh % 12) / 12) * 6.283 - 1.5708, a0 = ang(h), a1 = ang(m) + (ang(m) < a0 ? 6.283 : 0), au = clamp(o.arc ?? 1);
    if (au > 0) { c.strokeStyle = rgba('#dfe6ff', .28); c.lineWidth = r * .1; c.lineCap = 'butt'; c.beginPath(); c.arc(0, 0, r * .74, a0, lerp(a0, a1, K.sineIO(au))); c.stroke(); }
    const ma = ang(m), mu = clamp(o.mark ?? 1);
    if (mu > 0) { c.globalAlpha = mu; c.fillStyle = rgba('#ffe3ea', .95); c.beginPath(); c.arc(Math.cos(ma) * r * .74, Math.sin(ma) * r * .74, 9, 0, 7); c.fill(); K.ring(c, t, Math.cos(ma) * r * .74, Math.sin(ma) * r * .74, 22, .6 * mu);
      K.glowText(c, o.markLabel ?? 'NOON', Math.cos(ma) * r * 1.22, Math.sin(ma) * r * 1.22 + 10, { size: 26, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .2 }); c.globalAlpha = 1; }
    const mm = (h % 1) * 6.283 - 1.5708; c.strokeStyle = P.cream; c.lineCap = 'round';
    c.lineWidth = 9; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a0) * r * .5, Math.sin(a0) * r * .5); c.stroke();
    c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(mm) * r * .8, Math.sin(mm) * r * .8); c.stroke();
    c.fillStyle = P.cream; c.beginPath(); c.arc(0, 0, 10, 0, 7); c.fill();
  });
}

// ---------------------------------------------------------------- the kerb across the road (B.09–B.11): low on your kerb, looking across;
// cars glide sideways on the road between. Cards: sky 40000 · tower/fence 16000 · houses across 5200 · far kerb + hedges 3400 ·
// far lane 2900 · near lane 2200 · your kerb + legs 1150. o.cars [{x, lane: 'far'|'near', s, dir, brake}], o.step 0..1, o.legs (true),
// o.focus(ctx,t) on the near-lane card. Returns { near: card Z of the near lane }.
export function kerb79(ctx, t, cam, L, o = {}) {
  const car = (c, lane) => { for (const p of o.cars || []) if (p.lane === lane) { K.pod(c, p.x, p.y ?? 1000, p.s ?? 1.25, L, { dir: p.dir ?? -1, crates: true, t });
    if (p.brake > 0) { const d = p.dir ?? -1, w = 230 * (p.s ?? 1.25), h = 110 * (p.s ?? 1.25); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rad(c, p.x - d * w * .47, (p.y ?? 1000) - h * .34, 40 * (p.s ?? 1), [[0, rgba(CARM.hot, .7 * p.brake)], [1, rgba(CARM.hot, 0)]]); c.fillRect(p.x - d * w * .47 - 60, (p.y ?? 1000) - h * .34 - 60, 120, 120); c.restore(); } } };
  K.stage(ctx, cam, [
    [40000, () => K.sky(ctx, t, L, { horizon: 560, clouds: 3, seed: 8, sunR: 40 })],
    [16000, () => { K.hills(ctx, 600, 30, null, 6, { grad: [K.hz(mixHex(L.leafS, L.shade, .3), 16000, L), K.hz(L.leafS, 12000, L)] }); S.tower(ctx, t, 1500, 610, 150, 420, L, { glow: .8 }); S.fence(ctx, t, 1100, 1900, 612, 26, L); }],
    [5200, () => {
      const cols = ['#a89aa6', '#8e98a6', '#9c8aa0', '#a2948c', '#8a8aa6'];
      for (let i = -2; i < 7; i++) { const g = K.house(ctx, -260 + i * 380, 720, 330, 270 + (i % 2) * 30, L, { col: K.hz(cols[(i + 5) % 5], 5200, L), t, side: i < 2 ? 1 : -1, lit: .1 }); }
      K.band(ctx, 718, 1500, mixHex(L.walk, L.haze, .25), L.walk);
      for (const x of [-120, 520, 1140, 1760]) S.topiary(ctx, t, x, 760, .9, L);
    }],
    [3400, () => {   // the far kerb, the box hedges in the old bays (cut to the millimetre)
      ctx.fillStyle = lin(ctx, 0, 760, 0, 800, [[0, mixHex(L.walk, L.light, .2)], [1, mixHex(L.walk, L.shade, .3)]]); ctx.fillRect(-1800, 760, W + 3600, 40);
      const C = { top: mixHex('#4f7a62', L.light, .22), face: mixHex('#244a44', L.shade, .35) };
      for (let x = -1700; x < W + 1700; x += 420) { ctx.fillStyle = C.face; ctx.fillRect(x, 712, 330, 50); ctx.fillStyle = C.top; ctx.fillRect(x, 704, 330, 10); ctx.fillStyle = rgba('#e8eefc', .12); ctx.fillRect(x, 704, 330, 2); }
      ctx.fillStyle = lin(ctx, 0, 800, 0, 1300, [[0, mixHex(L.road, L.haze, .2)], [1, L.road]]); ctx.fillRect(-1800, 800, W + 3600, 900);
    }],
    [2900, () => { ctx.strokeStyle = rgba('#e8eefc', .3); ctx.lineWidth = 4; ctx.setLineDash([60, 70]); ctx.beginPath(); ctx.moveTo(-1800, 1080); ctx.lineTo(W + 1800, 1080); ctx.stroke(); ctx.setLineDash([]); car(ctx, 'far'); }],
    [2200, () => { car(ctx, 'near'); if (o.focus) o.focus(ctx, t); }],
    [1150, () => {   // your kerb (bottom edge) and your legs stepping off it
      ctx.fillStyle = lin(ctx, 0, 1010, 0, 1100, [[0, mixHex('#d8d2c4', L.light, .3)], [1, mixHex('#8a8aa0', L.shade, .3)]]); ctx.fillRect(-1800, 1010, W + 3600, 90);
      ctx.fillStyle = rgba('#e8eefc', .5); ctx.fillRect(-1800, 1008, W + 3600, 4);
      ctx.fillStyle = mixHex(L.walk, L.shade, .2); ctx.fillRect(-1800, 1100, W + 3600, 600);
      if (o.legs === false) return;
      // you, from the side: standing at the edge of your kerb, then one long step down into the road (without looking)
      const st = clamp(o.step ?? 0), e = K.sineIO(st), x = lerp(o.legX ?? 330, (o.legX ?? 330) + 150, e), y = lerp(1012, 978, e);
      K.shadowEl(ctx, x, y, 90, L, .3);
      K.you(ctx, t, x, y, (o.youH ?? 760) * (1 - .06 * e), { dir: 1, walk: st > 0 && st < 1 ? st * Math.PI * 2 : undefined, look: o.look ?? .05, lean: .04 * Math.sin(Math.PI * st) });
    }],
  ]);
}
// the side glass of a pod at (x, base, s, dir) on its card: the rect of the window (for a portal)
export function podGlass(x, base, s = 1, dir = -1) { const w = 230 * s, h = 110 * s, x0 = dir > 0 ? x - w * .32 : x - w * .38, x1 = dir > 0 ? x + w * .38 : x + w * .32; return [x0, base - h * .9, x1 - x0, h * .42]; }

// ---------------------------------------------------------------- inside a robotaxi (B.12): two bench seats facing, crates and spare parts
// strapped in, tags FROM: MACHINE · TO: MACHINE; the far window shows the street sliding past (v px/s). o.tag 0..1, o.gear [x,y,r] out
export function cabin(ctx, t, cam, L, o = {}) {
  const out = {};
  K.stage(ctx, cam, [
    [9000, () => {   // the street outside the far window, sliding by
      K.sky(ctx, t, L, { horizon: 640, clouds: 4, seed: 15, sunR: 30 });
      const off = (t * (o.v ?? 160)) % 760;
      for (let i = -3; i < 6; i++) { const x = i * 380 + off; K.house(ctx, x - 300, 760, 320, 260 + (i % 2) * 40, L, { col: K.hz(['#a89aa6', '#8e98a6', '#9c8aa0'][(i + 9) % 3], 9000, L), t, lit: 0 }); S.topiary(ctx, t, x + 60, 790, .8, L); }
      K.band(ctx, 760, 1500, mixHex(L.walk, L.haze, .2), L.walk);
    }],
    [2600, () => {   // the cabin wall with the window cut out
      const wall = mixHex('#d8d6e2', L.shade, .35), wallS = mixHex('#8a8aa6', L.shade, .55);
      ctx.fillStyle = lin(ctx, 0, -200, 0, 1200, [[0, wallS], [.5, wall], [1, wallS]]); ctx.beginPath(); ctx.rect(-1600, -1200, W + 3200, H + 2400); ctx.roundRect(260, 170, 1400, 420, 60); ctx.fill('evenodd');
      ctx.strokeStyle = rgba('#e8eefc', .3); ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(260, 170, 1400, 420, 60); ctx.stroke();
      ctx.fillStyle = rgba('#e8eefc', .08); ctx.beginPath(); ctx.moveTo(500, 170); ctx.lineTo(700, 170); ctx.lineTo(560, 590); ctx.lineTo(360, 590); ctx.fill();   // a glint on the glass
      ctx.fillStyle = rgba(CARM.hot, .85 + .15 * Math.sin(t * 2)); ctx.fillRect(820, 120, 280, 5);   // the carmine status strip inside
      K.carmGlow(ctx, 960, 120, 260, .12);
      ctx.fillStyle = mixHex('#5a5a7a', L.shade, .3); ctx.fillRect(-1600, 640, W + 3200, 40);   // the back of the far bench
    }],
    [1900, () => {   // the bench seat with crates and parts, belted in
      const seat = mixHex('#3a3e6a', L.shade, .2);
      ctx.fillStyle = lin(ctx, 0, 620, 0, 900, [[0, mixHex(seat, L.light, .15)], [1, seat]]); ctx.beginPath(); ctx.roundRect(120, 620, 1680, 300, 30); ctx.fill();
      ctx.fillStyle = mixHex(seat, '#000', .3); ctx.fillRect(120, 860, 1680, 400);
      const crate = (x, y, w, h, col) => { ctx.fillStyle = mixHex(col, L.shade, .3); ctx.fillRect(x, y - h, w, h); ctx.fillStyle = rgba(L.light, .2); ctx.fillRect(x, y - h, w, 5); ctx.fillStyle = rgba(L.ink, .3); ctx.fillRect(x + w * .48, y - h, 6, h); ctx.fillRect(x, y - h * .5, w, 4); };
      crate(240, 760, 260, 200, '#7a6a58'); crate(270, 560, 200, 130, '#6a5e52'); crate(1260, 760, 300, 230, '#857462'); crate(1300, 530, 220, 120, '#5e5a66');
      // spare parts: a motor drum, a coil, a gear
      ctx.fillStyle = mixHex('#9aa0b8', L.light, .15); ctx.beginPath(); ctx.roundRect(620, 600, 230, 160, 20); ctx.fill(); ctx.fillStyle = mixHex('#5a6080', L.shade, .2); for (let k = 0; k < 5; k++) ctx.fillRect(640, 616 + k * 28, 190, 8);
      ctx.strokeStyle = mixHex('#c87a4a', L.shade, .2); ctx.lineWidth = 10; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(950 + k * 14, 700, 40, 56, 0, 0, 7); ctx.stroke(); }
      const gx = 1130, gy = 690, gr = 62, rot = t * .05;
      ctx.fillStyle = mixHex('#b8bccc', L.light, .2); ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = rot + i / 24 * 6.283, rr = i % 2 ? gr : gr * .82; ctx.lineTo(gx + Math.cos(a) * rr, gy + Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
      ctx.fillStyle = mixHex('#3a3e6a', L.shade, .2); ctx.beginPath(); ctx.arc(gx, gy, gr * .34, 0, 7); ctx.fill(); out.gear = [gx, gy, gr];
      // the belts over everything
      ctx.fillStyle = mixHex('#2a2c48', L.shade, .2); for (const x of [380, 760, 1400]) { ctx.save(); ctx.translate(x, 700); ctx.rotate(-.35); ctx.fillRect(-14, -260, 28, 520); ctx.fillStyle = mixHex('#c0c4d4', L.light, .2); ctx.fillRect(-20, 20, 40, 26); ctx.restore(); }
      // the tags on strings: FROM: MACHINE · TO: MACHINE
      const tu = clamp(o.tag ?? 1);
      [[370, 610, 'FROM: MACHINE', -1], [1410, 580, 'TO: MACHINE', 1]].forEach(([x, y, s, d], i) => { const u = span(tu, i * .3, .6 + i * .3); if (u <= 0) return; const sw = .05 * Math.sin(t * 1.4 + i) + (1 - K.expoOut(u)) * .4 * d;
        ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.strokeStyle = rgba('#e8eefc', .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 40); ctx.stroke(); ctx.globalAlpha = u;
        ctx.fillStyle = '#eef0f6'; ctx.beginPath(); ctx.roundRect(-130, 40, 260, 70, 8); ctx.fill(); ctx.fillStyle = '#0b1238'; ctx.beginPath(); ctx.arc(-108, 75, 6, 0, 7); ctx.fill();
        ctx.fillStyle = '#1a1a3a'; ctx.font = '600 26px Inter'; ctx.textAlign = 'center'; ctx.letterSpacing = '0.08em'; ctx.fillText(s, 10, 85); ctx.letterSpacing = '0em'; ctx.restore(); });
    }],
  ]);
  return out;
}

// ---------------------------------------------------------------- the trip map (B.13): your street from above as a map on the night ground;
// hundreds of thin carmine trip lines run along the road and in at the plot across (dc); your door amber; o.bend 0..1 bends all lines to the plot
export const MAP = { road: [880, 1040], plot: [1320, 470], you: [700, 590] };
export function tripMap(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1), bend = clamp(o.bend ?? 0);
  K.dusk(ctx, t, { glow: [lerp(960, MAP.plot[0], bend), lerp(540, MAP.plot[1], bend)] });
  K.scr(ctx, (c) => {
    const z = o.z ?? 1; c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    const [r0, r1] = MAP.road, a = span(u, 0, .25);
    // the plots (houses as outlines), the road
    c.globalAlpha = a; c.strokeStyle = rgba(PALE, .45); c.lineWidth = 2;
    for (let i = -1; i < 7; i++) { const y = 40 + i * 150; c.strokeRect(560, y + 20, 260, 110); c.strokeRect(1100, y + 30, 260, 110); }
    c.fillStyle = rgba('#1a2458', .8); c.fillRect(r0, -100, r1 - r0, H + 200); c.strokeStyle = rgba(PALE, .35); c.setLineDash([24, 24]); c.beginPath(); c.moveTo(960, -100); c.lineTo(960, H + 100); c.stroke(); c.setLineDash([]);
    // the plot across: the data centre (no windows, a carmine seam)
    const [px, py] = MAP.plot; c.fillStyle = '#121a4c'; c.fillRect(px - 180, py - 120, 360, 240); c.strokeStyle = rgba(CARM.hot, .7); c.lineWidth = 3; c.strokeRect(px - 180, py - 120, 360, 240);
    // your door
    const [yx, yy] = MAP.you; c.globalAlpha = a; c.fillStyle = AMBER.body; c.beginPath(); c.arc(yx, yy, 10, 0, 7); c.fill(); c.fillStyle = rad(c, yx, yy, 40, [[0, rgba(AMBER.body, .35)], [1, rgba(AMBER.body, 0)]]); c.fillRect(yx - 40, yy - 40, 80, 80);
    T(c, 'YOU', yx - 26, yy + 8, { align: 'right', size: 22, a });
    // cross streets (the map runs on beyond your street)
    c.globalAlpha = a; c.fillStyle = rgba('#1a2458', .8); for (const cy of [250, 800]) c.fillRect(-100, cy - 50, W + 200, 100);
    // the trips: every route a faint carmine line, every car a bright dash running on it; with bend, the routes turn into the plot
    const n = Math.round(170 * span(u, .1, .6)), r = prng(7);
    c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const kind = r(), lane = lerp(r0 + 12, r1 - 12, r()), cy = r() < .5 ? 250 : 800, ly = cy + (r() - .5) * 80, dirn = r() < .5 ? 1 : -1, sp = .05 + r() * .07, ph = r(), al = .1 + r() * .14;
      const b = clamp(bend * 1.5 - r() * .5), jy = py + (r() - .5) * 150;
      let pts;
      if (kind < .45) pts = [[lane, -120], [lane, H + 120]];
      else if (kind < .75) pts = [[-120, ly], [W + 120, ly]];
      else pts = [[-120, ly], [lane - 30, ly], [lane, ly + (cy < 500 ? 40 : -40)], [lane, cy < 500 ? H + 120 : -120]];
      if (dirn < 0) pts.reverse();
      if (b > 0) { const q = pts[0], tgt = [px - 180 + 10, jy]; pts = [q, [lerp(q[0], lane, clamp(b * 2)), lerp(q[1], jy, b)], [lerp(pts[pts.length - 1][0], tgt[0], b), lerp(pts[pts.length - 1][1], tgt[1], b)]]; }
      c.strokeStyle = rgba(CARM.hot, al * .55); c.lineWidth = 1.4; c.beginPath(); pts.forEach((p, k) => (k ? c.lineTo(...p) : c.moveTo(...p))); c.stroke();
      // the car on it
      let L = 0; const seg = []; for (let k = 1; k < pts.length; k++) { const d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); seg.push(d); L += d; }
      let d = ((t * sp * .5 + ph) % 1) * L, k = 0; while (k < seg.length - 1 && d > seg[k]) { d -= seg[k]; k++; }
      const f = clamp(d / seg[k]), x = lerp(pts[k][0], pts[k + 1][0], f), y = lerp(pts[k][1], pts[k + 1][1], f), ang = Math.atan2(pts[k + 1][1] - pts[k][1], pts[k + 1][0] - pts[k][0]);
      c.save(); c.translate(x, y); c.rotate(ang); c.fillStyle = rgba(CARM.core, .5 + al * 2); c.fillRect(-7, -2, 14, 4); c.restore();
    }
    // your door: no line starts or ends there
    if (o.ring) { c.strokeStyle = rgba(AMBER.body, .7 * o.ring); c.lineWidth = 2; c.beginPath(); c.arc(yx, yy, 28 + 6 * Math.sin(t * 1.4), 0, 7); c.stroke(); }
  });
}

// ---------------------------------------------------------------- the data centre in section (D.06–D.07): a cut through the windowless hall,
// dark inside, racks with carmine dots, no figures. o.u build, o.win 0..1 a pale-ink window drawn on the wall, o.strike 0..1, o.zero 0..1 (STAFF 0)
export const SECT = { x: 360, y: 250, w: 1200, h: 560 };
export function dcSection(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1), { x, y, w, h } = SECT;
  K.dusk(ctx, t, { glow: [960, 520] });
  K.scr(ctx, (c) => {
    if (o.k) { c.translate(960, 520); c.scale(o.k, o.k); c.translate(-960, -520); }   // a slow creep (nothing stands still)
    const a = span(u, 0, .4);
    c.globalAlpha = a; c.fillStyle = '#080c2a'; c.fillRect(x, y, w, h);
    c.strokeStyle = rgba(PALE, .7); c.lineWidth = 3; c.strokeRect(x, y, w, h); c.fillStyle = rgba(PALE, .7); c.fillRect(x - 60, y + h, w + 120, 3);
    K.lightBand(c, t, x, y + h * .1, x + w, y + h * .1, 5, a);   // the seam
    // racks, rows of tiny carmine dots that breathe
    for (let i = 0; i < 9; i++) { const rx = x + 70 + i * 122, ru = span(u, .2 + i * .04, .5 + i * .04); if (ru <= 0) continue; c.globalAlpha = ru; c.fillStyle = '#121a4c'; c.fillRect(rx, y + h * .28, 74, h * .68);
      for (let k = 0; k < 14; k++) { const on = .4 + .6 * (.5 + .5 * Math.sin(t * (1.1 + (i * 7 + k) % 5 * .3) + i + k)); c.fillStyle = rgba(CARM.hot, .55 * on); c.fillRect(rx + 10 + (k % 2) * 40, y + h * .3 + Math.floor(k / 2) * 34, 14, 4); } }
    c.globalAlpha = 1;
    // a pale-ink window drawn on the wall, and struck: nobody inside to look out
    const wu = clamp(o.win ?? 0);
    if (wu > 0) { const wx = x + w * .5 - 120, wy = y + h * .34; c.strokeStyle = rgba(PALE, .95 * (1 - span(o.strike ?? 0, .6, 1))); c.lineWidth = 3;
      K.strokeIn(c, [[wx, wy], [wx + 240, wy], [wx + 240, wy + 170], [wx, wy + 170], [wx, wy]], K.expoOut(wu)); K.strokeIn(c, [[wx + 120, wy], [wx + 120, wy + 170]], span(wu, .5, 1)); K.strokeIn(c, [[wx, wy + 85], [wx + 240, wy + 85]], span(wu, .6, 1));
      const st = clamp(o.strike ?? 0); if (st > 0) { c.strokeStyle = CARM.hot; c.lineWidth = 7; c.lineCap = 'round'; c.globalAlpha = 1 - span(st, .7, 1); K.strokeIn(c, [[wx - 30, wy + 200], [wx + 270, wy - 30]], K.expoOut(span(st, 0, .4))); c.globalAlpha = 1; } }
    const z = clamp(o.zero ?? 0);
    if (z > 0) { c.fillStyle = rad(c, 960, 520, 520, [[0, rgba('#060a24', .75 * z)], [1, rgba('#060a24', 0)]]); c.fillRect(440, 0, 1040, 1080);
      K.words(c, 'STAFF', 960 - 40, 560, 110, z, { align: 'right', serif: false, weight: 600, glow: false });
      K.words(c, '0', 980, 590, 260, span(z, .1, 1), { serif: true, glow: false }); }
    T(c, 'A DATA CENTER · IN SECTION', x, y - 30, { a: span(u, .3, .6), size: 22, col: TXT.sub, spacing: .18 });
  });
}

// ---------------------------------------------------------------- the ladder (D.09, D.13, D.14): two rails, n rungs; o.drop[i] 0..1 (rung i falls), o.gone 0..1 (all rungs ghost)
export function ladderGfx(c, t, x, y0, y1, w, n, o = {}) {
  const col = o.col || '#e8eefc', drop = o.drop || [], lw = o.lw ?? 8;
  c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = lw;
  c.beginPath(); c.moveTo(x - w / 2, y0); c.lineTo(x - w / 2, y1); c.moveTo(x + w / 2, y0); c.lineTo(x + w / 2, y1); c.stroke();
  for (let i = 0; i < n; i++) {
    const ry = lerp(y1 - (y1 - y0) / (n + 1), y0 + (y1 - y0) / (n + 1), i / Math.max(1, n - 1)), d = clamp(drop[i] ?? 0), g = clamp(o.gone ?? 0);
    if (d >= 1 || g >= 1) { if (o.ghost) { c.save(); c.globalAlpha = .25; c.strokeStyle = PALE; c.lineWidth = 2; c.setLineDash([8, 10]); c.beginPath(); c.moveTo(x - w / 2, ry); c.lineTo(x + w / 2, ry); c.stroke(); c.restore(); } continue; }
    const fy = ry + 900 * K.expoIn(d), rot = .9 * d * (i % 2 ? 1 : -1);
    c.save(); c.globalAlpha = (1 - g) * (1 - span(d, .7, 1)); c.translate(x, fy); c.rotate(rot);
    if (o.glow && o.glow[i]) { c.shadowColor = AMBER.body; c.shadowBlur = 24; c.strokeStyle = mixHex(col, AMBER.body, o.glow[i]); }
    c.lineWidth = lw * .8; c.beginPath(); c.moveTo(-w / 2 + lw, 0); c.lineTo(w / 2 - lw, 0); c.stroke(); c.restore();
  }
  c.restore();
}

// ---------------------------------------------------------------- the 24-h schedule ring (K.03): your house (amber, hours cut out) inside the tower (carmine, never cut)
// o.u build, o.cut 0..1 the blocks fall out, blocks [[from h, to h]]
export function ring24(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1), cut = clamp(o.cut ?? 0), blocks = o.blocks || [[10, 14]];
  K.scr(ctx, (c) => {
    c.translate(x, y); const k = o.k ?? 1; c.scale(k, k);
    const ang = (h) => h / 24 * 6.283 - 1.5708;
    // the tower ring: full, breathing
    const br = .9 + .1 * Math.sin(t * .9), tu = K.expoOut(span(u, 0, .6));
    c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(CARM.hot, .16 * br); c.lineWidth = 60; c.beginPath(); c.arc(0, 0, r, -1.5708, -1.5708 + 6.283 * tu); c.stroke(); c.restore();
    c.strokeStyle = mixHex(CARM.hot, CARM.core, .2 * br); c.lineWidth = 22; c.lineCap = 'butt'; c.beginPath(); c.arc(0, 0, r, -1.5708, -1.5708 + 6.283 * tu); c.stroke();
    // your house: an amber ring with the scheduled hours cut out
    const hu = K.expoOut(span(u, .2, .8)), ri = r * .72;
    c.strokeStyle = AMBER.body; c.lineWidth = 22;
    const cuts = blocks.map(([a, b]) => [ang(a), ang(b)]);
    let a0 = -1.5708; const aEnd = -1.5708 + 6.283 * hu;
    const segs = []; let s = a0; for (const [ca, cb] of cuts.sort((p, q) => p[0] - q[0])) { if (ca > s) segs.push([s, Math.min(ca, aEnd)]); s = Math.max(s, cb); } if (s < aEnd) segs.push([s, aEnd]);
    for (const [p, q] of segs) if (q > p) { c.beginPath(); c.arc(0, 0, ri, p, q); c.stroke(); }
    // the cut blocks: still there before the schedule, then they drop out (fall inward and fade)
    for (const [ca, cb] of cuts) { if (ca > aEnd) continue; const d = cut, m = (ca + cb) / 2; c.save(); c.globalAlpha = 1 - span(d, .3, 1); c.translate(-Math.cos(m) * 60 * K.expoIn(d), -Math.sin(m) * 60 * K.expoIn(d) + 140 * K.expoIn(d));
      c.strokeStyle = AMBER.body; c.lineWidth = 22; c.beginPath(); c.arc(0, 0, ri, ca + .02, Math.min(cb, aEnd) - .02); c.stroke(); c.restore();
      if (d > .4) { c.strokeStyle = rgba(PALE, .5 * span(d, .4, 1)); c.lineWidth = 2; c.setLineDash([6, 8]); c.beginPath(); c.arc(0, 0, ri + 18, ca, cb); c.arc(0, 0, ri - 18, cb, ca, true); c.closePath(); c.stroke(); c.setLineDash([]); } }
    // hour marks
    for (const [h, lab] of [[0, 'MIDNIGHT'], [6, '6'], [12, 'NOON'], [18, '6 PM']]) { const a = ang(h), la = span(u, .4, .8); c.fillStyle = rgba('#dfe6ff', .6 * la); c.fillRect(Math.cos(a) * (r + 30) - 2, Math.sin(a) * (r + 30) - 2, 4, 4);
      T(c, lab, Math.cos(a) * (r + 70), Math.sin(a) * (r + 70) + 8, { align: 'center', size: 22, col: TXT.sub, a: la }); }
    T(c, 'THE TOWER', 0, -18, { align: 'center', size: 26, col: '#ffd6de', a: span(u, .5, .8) });
    T(c, 'YOUR HOUSE', 0, 26, { align: 'center', size: 26, col: AMBER.core, a: span(u, .6, .9) });
    if (o.label > 0) { const [ca, cb] = cuts[0], m = (ca + cb) / 2; T(c, 'SCHEDULED · 10:00–14:00', r * .78 + 30, r * .78 + 40, { align: 'left', size: 26, col: P.cream, a: o.label }); }
  });
}
// rectGrow: B is revealed inside a dashed rectangle (the empty plot) that grows from rect to the whole frame; the same rect sits in A
// and in B at the same place (a mask carried by a shape, not a wipe)
export const rectGrow = (rect, o = {}) => (ctx, u, dA, dB) => {
  const e = K.quartIO(u), [x, y, w, h] = rect, X0 = lerp(x, -12, e), Y0 = lerp(y, -12, e), X1 = lerp(x + w, W + 12, e), Y1 = lerp(y + h, H + 12, e);
  dA(ctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(X0, Y0, X1 - X0, Y1 - Y0); ctx.clip(); ctx.globalAlpha = span(u, 0, .3); dB(ctx); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - span(u, .5, 1); ctx.strokeStyle = o.col || PALE; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.strokeRect(X0, Y0, X1 - X0, Y1 - Y0); ctx.restore();
};
// the print gantry of the data centre, lifting away when the building is done (k 0..1); same look as S.dataCentre's gantry
export function gantryAway(ctx, t, x, base, w, h, L, k) {
  if (k >= 1) return; const lift = K.expoIn(k) * 700, gy = base - h - 34 - lift;
  ctx.save(); ctx.globalAlpha = 1 - span(k, .6, 1); ctx.fillStyle = mixHex('#3a4a8a', L.shade, .3);
  ctx.fillRect(x - 40, gy, w + 80, 14); ctx.fillRect(x - 40, gy, 12, base - h * K.expoIn(k) - gy); ctx.fillRect(x + w + 28, gy, 12, base - h * K.expoIn(k) - gy); ctx.restore();
}

// ---------------------------------------------------------------- c04 · the kitchen: the slip on the meter, the phone propped on the table
// the paper slip hanging under the kitchen meter (card 5200 of S.kitchen, meter at 380,330 150×90); u 0..1 how lit it is (it is always there)
export const SLIP = { x: 392, y: 448, w: 210, h: 104 };
export function meterSlip(ctx, t, u = 1) {
  const { x, y, w, h } = SLIP, sw = .025 * Math.sin(t * 1.3);
  ctx.save(); ctx.translate(455, 420); ctx.rotate(sw); ctx.translate(-455, -420);
  ctx.strokeStyle = rgba('#c8c6d6', .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(455, 420); ctx.lineTo(x + w / 2, y + 4); ctx.stroke();
  ctx.fillStyle = mixHex('#6a6478', K.PAPER.lit, .35 + .65 * u); ctx.beginPath(); ctx.roundRect(x, y, w, h, 4); ctx.fill();
  ctx.fillStyle = rgba('#000', .18); ctx.fillRect(x, y + h - 6, w, 6);
  ctx.globalAlpha = .4 + .6 * u; ctx.fillStyle = K.PAPER.red; ctx.font = '600 20px Inter'; ctx.letterSpacing = '0.16em'; ctx.textAlign = 'center'; ctx.fillText('SCHEDULED', x + w / 2, y + 38);
  ctx.fillStyle = K.PAPER.ink; ctx.font = '600 26px Inter'; ctx.letterSpacing = '0.04em'; ctx.fillText('10:00–14:00', x + w / 2, y + 78); ctx.letterSpacing = '0em'; ctx.textAlign = 'left';
  ctx.restore();
}
// a phone propped against the old box on the table (card 2400 of S.kitchen): dark, the time on it; returns the screen rect (card coords)
export const PHONE = { x: 1112, y: 636, w: 70, h: 124 };
export function phoneStand(ctx, t, L, o = {}) {
  const { x, y, w, h } = PHONE, scr = [x + 6, y + 8, w - 12, h - 16], glow = o.glow ?? 0;
  ctx.fillStyle = rgba('#000', .3); ctx.beginPath(); ctx.ellipse(x + w / 2 + 14, y + h, w * .7, 6, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#05061a'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, scr[1], 0, scr[1] + scr[3], [[0, mixHex('#141a44', '#3a1630', glow)], [1, mixHex('#0a0d2a', '#1a0a20', glow)]]); ctx.beginPath(); ctx.roundRect(...scr, 6); ctx.fill();
  ctx.fillStyle = rgba('#e8eefc', .55 + .3 * glow); ctx.font = '600 15px Inter'; ctx.textAlign = 'center'; ctx.fillText(o.time ?? '11:59', x + w / 2, y + 38); ctx.textAlign = 'left';
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x + w / 2, y + h / 2, 140, [[0, rgba('#ffd6de', .18 * glow)], [1, rgba('#ffd6de', 0)]]); ctx.fillRect(x - 140, y - 140, w + 280, h + 280); ctx.restore(); }
  return scr;
}

// ---------------------------------------------------------------- c04 · power like air (K.05–K.07): bars → flow lines → the split
// o.bars 0..1 the earlier bars, o.bar 0..1 the 2050 bar, o.flow 0..1 the bar dissolves into lines filling the frame, o.split 0..1 the
// lines bend: most into THE MACHINES (carmine, top right), one thin amber thread to YOUR HOUSES; o.first 0..1 the carmine arrives,
// o.thread 0..1 the amber thread arrives, o.more 0..1 the carmine stream broadens and the thread thins. Returns the thread's end point.
export const FLOW = { x0: 260, x1: 1720, y: 640, mach: [1600, 330], homes: [1600, 790] };
export function powerFlow(ctx, t, o = {}) {
  const F = FLOW, bars = clamp(o.bars ?? 0), bar = clamp(o.bar ?? 0), flow = clamp(o.flow ?? 0), split = clamp(o.split ?? 0), more = clamp(o.more ?? 0);
  K.scr(ctx, (c) => {
    const fb = 1 - K.sineIO(span(flow, 0, .5));
    // the earlier bars (pale, short) and the 2050 bar (pale white, far past them)
    if (fb > 0) {
      const prev = [['2030', .16], ['2035', .19], ['2040', .23], ['2045', .27]];
      prev.forEach(([y, v], i) => { const a = span(bars, i * .15, .4 + i * .15) * fb; if (a <= 0) return; const yy = 300 + i * 78;
        c.globalAlpha = a; c.fillStyle = REST; c.beginPath(); c.roundRect(F.x0, yy, (F.x1 - F.x0) * v * K.expoOut(a), 34, 4); c.fill(); T(c, y, F.x0 - 24, yy + 26, { align: 'right', size: 22, col: TXT.sub, a }); });
      c.globalAlpha = fb; T(c, 'ELECTRICITY · SCHEMATIC', F.x0, 250, { size: 22, col: TXT.sub, a: span(bars, 0, .4) * fb });
      if (bar > 0) { const len = (F.x1 - F.x0) * K.expoOut(bar); c.fillStyle = lin(c, F.x0, 0, F.x0 + len, 0, [[0, '#b8c4f0'], [1, '#eef2ff']]); c.beginPath(); c.roundRect(F.x0, F.y - 24, len, 48, 4); c.fill();
        T(c, '2050', F.x0 - 24, F.y + 9, { align: 'right', size: 26, a: fb }); }
      c.globalAlpha = 1;
    }
    // the flow: N lines, born out of the bar, spreading to fill the frame; then bending into the two sinks
    if (flow > 0) {
      const N = 44, rnd = prng(79);
      const seeds = Array.from({ length: N }, (_, i) => ({ y: lerp(140, 940, (i + .5) / N) + (rnd() - .5) * 14, ph: rnd() * 6.28, sp: .6 + rnd() * .5 }));
      const sp = K.sineIO(span(flow, 0, .8));
      const thread = N - 6;   // one line (near the bottom) becomes the amber thread
      seeds.forEach((d, i) => {
        const isT = i === thread, y0 = lerp(F.y, d.y, sp), tgt = isT ? F.homes : F.mach, ty = isT ? tgt[1] : tgt[1] + (i / N - .45) * lerp(80, 150, more);
        const arrive = isT ? clamp(o.thread ?? 0) : clamp(o.first ?? 0), sx = 760;
        const pts = []; for (let k = 0; k <= 48; k++) { const x = lerp(-40, F.x1 + 80, k / 48), b = split * K.sineIO(clamp((x - sx) / (tgt[0] - sx)));
          const wob = (1 - .7 * split) * 10 * Math.sin(x * .006 + d.ph + t * .5 * d.sp); pts.push([x > tgt[0] && split > .5 ? lerp(x, tgt[0], split) : x, lerp(y0 + wob, ty, b)]); }
        // the right part (past the bend) only reaches the sink when it arrives; before the split everything flows to the right edge
        const reach = split > 0 ? lerp(1, lerp(.5, 1, arrive), split) : 1;
        const col = isT ? mixHex('#c9d2f4', AMBER.body, split) : mixHex('#c9d2f4', CARM.body, split * arrive);
        const lw = isT ? lerp(2.5, lerp(4, 2, more), split) : lerp(2, lerp(3, 4.5, more), split * arrive);
        c.globalAlpha = (isT ? 1 : lerp(.55, .85, split)) * span(flow, 0, .3); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round';
        K.strokeIn(c, pts, reach * K.expoOut(span(flow, 0, .6)));
        // moving particles along the line (the current), slow
        const n = 3; for (let q = 0; q < n; q++) { const f = ((t * .07 * d.sp + q / n + d.ph) % 1) * reach, idx = Math.floor(f * 48), p = pts[idx]; if (!p) continue;
          c.globalAlpha = .9 * span(flow, .2, .5); c.fillStyle = isT ? AMBER.core : mixHex('#eef2ff', CARM.hot, split * arrive); c.beginPath(); c.arc(p[0], p[1], isT ? 3.5 : 3, 0, 7); c.fill(); }
      });
      c.globalAlpha = 1;
      // the sinks: the machine ring (top right) and your houses (bottom right)
      const ma = span(split, .2, .7);
      if (ma > 0) { const [mx, my] = F.mach; K.carmGlow(c, mx, my, 220, .25 * ma * (.6 + .4 * (o.first ?? 0))); c.save(); c.globalAlpha = ma; K.ring(c, t, mx + 40, my, 70 + 14 * more, 1); c.restore();
        T(c, 'THE MACHINES', mx + 40, my - 112, { align: 'center', size: 26, col: '#ffd6de', a: ma }); T(c, 'FIRST', mx + 40, my + 130, { align: 'center', size: 24, col: '#ffd6de', a: span(o.first ?? 0, .5, 1) }); }
      const ha = span(split, .3, .8);
      if (ha > 0) { const [hx, hy] = F.homes; c.globalAlpha = ha; for (let k = 0; k < 4; k++) { const x = hx - 30 + k * 60, lit = span(o.thread ?? 0, .6 + k * .08, 1); c.fillStyle = '#2a3470'; c.fillRect(x - 22, hy - 30, 44, 34); c.beginPath(); c.moveTo(x - 28, hy - 30); c.lineTo(x, hy - 54); c.lineTo(x + 28, hy - 30); c.fill();
          c.fillStyle = rgba(AMBER.body, .25 + .6 * lit); c.fillRect(x - 8, hy - 20, 16, 14); }
        c.globalAlpha = 1; T(c, 'YOUR HOUSES', hx + 60, hy + 54, { align: 'center', size: 24, col: AMBER.core, a: ha }); }
    }
  });
  return FLOW.homes;
}

// ---------------------------------------------------------------- c04 · the eastern grid (K.08, on the paper card): a schematic region,
// the grid drawn in ink node by node; u 0..1 draw, dc 0..1 the cluster of data centres (northern Virginia) in carmine
export function gridMapInk(g, t, x, y, w, h, u, dc = 0) {
  const P2 = (a, b) => [x + a * w, y + b * h];
  const region = [[.08, .2], [.24, .16], [.36, .22], [.5, .17], [.66, .12], [.78, .16], [.86, .3], [.9, .42], [.84, .5], [.86, .6], [.8, .72], [.66, .84], [.5, .86], [.36, .8], [.22, .72], [.12, .6], [.06, .4]].map(([a, b]) => P2(a, b));
  K.ink(g, K.PAPER.ink2, 3); g.globalAlpha = .9; K.strokeIn(g, [...region, region[0]], K.sineIO(span(u, 0, .5)));
  g.fillStyle = rgba(K.PAPER.ink2, .08 * span(u, .4, .7)); g.beginPath(); region.forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); g.fill();
  // the coast (east)
  K.ink(g, rgba(K.PAPER.ink2, .5), 2); g.setLineDash([6, 8]); K.strokeIn(g, [P2(.95, .05), P2(.92, .3), P2(.97, .5), P2(.9, .7), P2(.82, .92), P2(.7, 1)], span(u, .1, .5)); g.setLineDash([]);
  // nodes + lines (the grid)
  const rnd = prng(31), nodes = [];
  for (let i = 0; i < 30; i++) { const a = .14 + rnd() * .68, b = .24 + rnd() * .54; nodes.push(P2(a, b)); }
  K.ink(g, K.PAPER.ink, 1.8);
  nodes.forEach((p, i) => { const a = span(u, .3 + i * .012, .5 + i * .012); if (a <= 0) return;
    for (let j = 0; j < i; j++) { const q = nodes[j], d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < w * .16) { g.globalAlpha = .55 * a; g.beginPath(); g.moveTo(...p); g.lineTo(lerp(p[0], q[0], a), lerp(p[1], q[1], a)); g.stroke(); } }
    g.globalAlpha = a; g.beginPath(); g.arc(p[0], p[1], 4.5, 0, 7); g.fill(); });
  g.globalAlpha = 1;
  if (dc > 0) { const [cx, cy] = P2(.72, .6); for (let i = 0; i < 9; i++) { const a = span(dc, i * .07, .3 + i * .07); if (a <= 0) continue; const px = cx + (i % 3 - 1) * 16, py = cy + (Math.floor(i / 3) - 1) * 14;
    g.globalAlpha = a; g.fillStyle = K.PAPER.red; g.fillRect(px - 5, py - 5, 10, 10); } g.globalAlpha = 1; }
}

// ---------------------------------------------------------------- c04 · X.pjm in row order (K.09–K.10): the bill first, the houses pay
// into it; then the 46 % segment turns carmine (ESTIMATE). o.u 0..1 build, o.pay 0..1 houses pay, o.seg 0..1 the segment, o.est 0..1 the
// estimate tag + source, o.a alpha, o.you 0..1 your house marked. Returns your house's window (screen) for the iris out.
export const PJM = { x0: 260, x1: 1660, y: 400, h: 100, hy: 800, n: 9, you: 4 };
export function pjmBill(ctx, t, o = {}) {
  const P0 = PJM, u = clamp(o.u ?? 1), pay = clamp(o.pay ?? 0), seg = clamp(o.seg ?? 0), est = clamp(o.est ?? 0), tot = 63.6, dc = 29.4, xd = lerp(P0.x0, P0.x1, dc / tot);
  const hx = (k) => P0.x0 + 80 + k * ((P0.x1 - P0.x0 - 160) / (P0.n - 1));
  K.scr(ctx, (c) => {
    c.globalAlpha = o.a ?? 1;
    T(c, "AMERICA'S BIGGEST GRID (PJM)", P0.x0, 236, { size: 30, spacing: .16, a: span(u, 0, .3) });
    T(c, 'WHAT CUSTOMERS PAY TO KEEP ENOUGH POWER PLANTS READY · LAST FOUR AUCTIONS', P0.x0, 276, { size: 22, col: TXT.sub, a: span(u, .1, .4) });
    // the empty bill (outline), filled by the houses' payments
    c.strokeStyle = rgba('#dfe6ff', .5 * span(u, .2, .5)); c.lineWidth = 2; c.beginPath(); c.roundRect(P0.x0, P0.y, (P0.x1 - P0.x0) * K.expoOut(span(u, .2, .6)), P0.h, 4); c.stroke();
    const fw = (P0.x1 - P0.x0) * K.sineIO(pay);
    if (fw > 0) { c.fillStyle = REST; c.beginPath(); c.roundRect(P0.x0, P0.y, fw, P0.h, 4); c.fill(); }
    T(c, '$63.6 BN', P0.x1, P0.y - 20, { align: 'right', size: 34, a: span(pay, .75, 1) });
    // the data-centre segment
    if (seg > 0) { const sw = (xd - P0.x0) * K.expoOut(seg); c.fillStyle = lin(c, P0.x0, 0, xd, 0, [[0, CARM.mid], [1, CARM.body]]); c.beginPath(); c.roundRect(P0.x0, P0.y, sw, P0.h, 4); c.fill();
      c.fillStyle = '#0b1238'; c.fillRect(P0.x0 + sw, P0.y - 2, 3, P0.h + 4); K.carmGlow(c, P0.x0 + sw, P0.y + P0.h / 2, 120, .18 * seg);
      K.glowText(c, '46 %', P0.x0 + 24, P0.y + 78, { size: 76, serif: true, col: CARM.core, glow: false, a: span(seg, .4, .9) });
      T(c, '$29.4 BN · DRIVEN BY DATA CENTERS', P0.x0, P0.y + P0.h + 46, { size: 26, col: '#ffd6de', a: span(seg, .5, 1) }); }
    if (est > 0) { const ex = P0.x0 + measureT('$29.4 BN · DRIVEN BY DATA CENTERS', 26) + 30; c.globalAlpha = (o.a ?? 1) * est;
      c.strokeStyle = '#ffd6de'; c.lineWidth = 2; c.beginPath(); c.roundRect(ex, P0.y + P0.h + 16, measureT('ESTIMATE · MARKET MONITOR', 22) + 28, 40, 6); c.stroke();
      T(c, 'ESTIMATE · MARKET MONITOR', ex + 14, P0.y + P0.h + 44, { size: 22, col: '#ffd6de', a: est });
      T(c, 'MONITORING ANALYTICS (PJM MARKET MONITOR) VIA UTILITY DIVE · JULY 2026', P0.x0, 866, { size: 22, col: TXT.faint, spacing: .06, a: est }); c.globalAlpha = o.a ?? 1; }
    // the houses (every customer on the grid) and their payments flying up into the bill
    for (let k = 0; k < P0.n; k++) {
      const a = span(u, .4 + k * .04, .6 + k * .04); if (a <= 0) continue; const x = hx(k), yy = P0.hy, you = k === P0.you;
      c.globalAlpha = (o.a ?? 1) * a; c.fillStyle = you ? '#33407e' : '#2a3470'; c.fillRect(x - 46, yy - 70, 92, 70); c.beginPath(); c.moveTo(x - 56, yy - 70); c.lineTo(x, yy - 112); c.lineTo(x + 56, yy - 70); c.fill();
      c.fillStyle = you ? rgba(AMBER.body, .2) : rgba(AMBER.body, .55); c.fillRect(x - 14, yy - 52, 28, 24);   // your window: dark (the schedule)
      if (you) T(c, 'YOU', x, yy + 40, { align: 'center', size: 22, col: AMBER.core, a: a * clamp(o.you ?? 0) });
      // payments: small dashes rising to the bill, each one carmine once the segment is known (46 % of them)
      if (pay > 0) for (let q = 0; q < 3; q++) { const f = (t * .55 + q / 3 + k * .13) % 1, py = lerp(yy - 120, P0.y + P0.h + 8, K.sineIO(f)), ca = ((k * 3 + q) * 7 % 13) / 13 < .46;
        c.globalAlpha = (o.a ?? 1) * a * Math.min(1, pay * 3) * Math.sin(Math.PI * f); c.fillStyle = ca && seg > .5 ? CARM.hot : AMBER.body; c.fillRect(x - 3, py - 9, 6, 18); }
    }
    c.globalAlpha = 1;
  });
  const k = P0.you; return [hx(k), P0.hy - 40];
}
const measureT = (s, size) => K.measure(s, size, false, 600) * 1.12;
// portalFade: K.portal whose B fades in over the first quarter inside the window (no content pop when the window first opens);
// win(t) → the window rect in screen coords at this frame
export const portalFade = (win) => (ctx, u, dA, dB, t) => K.portal(ctx, u, win(t), dA, (c) => { c.save(); c.globalAlpha = span(u, 0, .25); dB(c); c.restore(); });
// maskGrow: B (still, no zoom) is revealed inside a rect that grows from a window of A (rect(t), screen) to the whole frame; B fades in
// over the first 30 % inside the small window. A mask carried by a shape (look through the glass, and the glass becomes the frame).
export const maskGrow = (rectAt) => (ctx, u, dA, dB, t) => {
  const e = K.quartIO(clamp(u)), [x, y, w, h] = rectAt(t), X0 = lerp(x, -12, e), Y0 = lerp(y, -12, e), X1 = lerp(x + w, W + 12, e), Y1 = lerp(y + h, H + 12, e);
  dA(ctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.roundRect(X0, Y0, X1 - X0, Y1 - Y0, 18 * (1 - e)); ctx.clip(); fadeLayer(ctx, span(u, 0, .3), dB); ctx.restore();   // via a layer: shots set their own globalAlpha (a direct alpha popped B in at full strength)
};
// irisSoft: a calmer iris for B1's boundaries. B opens inside a circle that starts as a round object of A (c(t) → [cx, cy, r0], screen)
// and grows with a constant change of area (r² linear in a quart ease: calm tails, the change packed in the middle, no frame jumps);
// B barely zooms (o.kb0 → 1, default .97) and A pushes only a little (o.pushA, default .03). The rim glows and fades out.
export const irisSoft = (cAt, o = {}) => (ctx, u, dA, dB, t) => {
  const e = K.quartIO(clamp(u)), [cx, cy, r0] = cAt(t), R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.02;
  const r = Math.sqrt(lerp(Math.max(4, r0) ** 2, R * R, e)), zA = 1 + e * (o.pushA ?? .03), kb = lerp(o.kb0 ?? .97, 1, e);
  K.outer({ k: zA, e: cx - cx * zA, f: cy - cy * zA }, () => dA(ctx));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  ctx.globalAlpha = span(u, 0, .2);
  K.outer({ k: kb, e: lerp(cx, W / 2, e) - W / 2 * kb, f: lerp(cy, H / 2, e) - H / 2 * kb }, () => dB(ctx)); ctx.restore();
  if (o.rim !== false && e < .98) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(o.rim || '#fff2c4', .8 * (1 - e)); ctx.lineWidth = 4; ctx.shadowColor = rgba('#f2b632', .8); ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.restore(); }
};
// fadeLayer: draw fn into an offscreen layer and lay it down at alpha a (for pieces that set their own globalAlpha, e.g. powerFlow)
let LAY = null;
export function fadeLayer(ctx, a, fn) {
  if (a <= 0) return; if (a >= 1) { fn(ctx); return; }
  const cw = ctx.canvas.width, ch = ctx.canvas.height; if (!LAY || LAY[0].width !== cw || LAY[0].height !== ch) LAY = mkCanvas(cw, ch);
  const [lc, lx] = LAY; lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalAlpha = 1; lx.clearRect(0, 0, cw, ch); lx.setTransform(ctx.getTransform()); fn(lx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(lc, 0, 0); ctx.restore();
}
