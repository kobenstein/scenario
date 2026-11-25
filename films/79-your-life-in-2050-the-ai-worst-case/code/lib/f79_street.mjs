// Film 79 · YOUR STREET in the worst case (the leitbild, mirror of #74) and the home (bedroom, kitchen, hallway door) as 2.5D card stages.
// SAME geometry as #74 (VP, house positions and colours, the corner at the end) so the street is recognisably the same one; what changed:
// cold light, the parking bays are box hedges cut to the millimetre (no cars, no apple trees), the trees are trimmed into balls,
// robotaxis with crates glide past, the house across the road can be the windowless DATA CENTRE (built in nine days),
// and at the end of the street, where the fields began: a FENCE and the TOWER THAT NEVER GOES DARK (carmine band).
// Home view (cam3 at 0,0,0): eye level, looking down the street, vanishing point VP. Cards: sky 40000 · fence/tower/hills 16000 · far houses 7000 ·
// mid 4200 · near 2600 · FOCUS 1700 (people, cars) · foreground 1150 (hedge corner).
import * as K from './f79_kit.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, rad, lin, prng, drift, CARM } = K;
export const VP = [960, 560];
export const TOWER = { x: 960, base: 596, w: 210, h: 560 };   // design coords on the 16000 card (the end of the street)
const hw = (y) => Math.max(0, (y - VP[1]) * 1.35);   // road half width at screen y
const HEDGE = (L) => ({ top: mixHex('#4f7a62', L.light, .22), face: mixHex('#244a44', L.shade, .35), side: mixHex('#173238', L.shade, .5) });
// a box hedge cut perfectly square, in perspective between rows y and yb (one old parking bay)
function boxHedge(ctx, xa, y, xb, yb, xc, xd, L, k = 1) {
  const C = HEDGE(L), hh = Math.max(4, (yb - VP[1]) * .09) * k;
  ctx.fillStyle = C.face; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, yb); ctx.lineTo(xc, yb); ctx.lineTo(xd, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.top; ctx.beginPath(); ctx.moveTo(xa, y - hh * .8); ctx.lineTo(xb, yb - hh); ctx.lineTo(xc, yb - hh); ctx.lineTo(xd, y - hh * .8); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.side; ctx.beginPath(); ctx.moveTo(xb, yb - hh); ctx.lineTo(xc, yb - hh); ctx.lineTo(xc, yb); ctx.lineTo(xb, yb); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#e8eefc', .12); ctx.fillRect(Math.min(xb, xc), yb - hh, Math.abs(xc - xb), Math.max(1, hh * .12));   // the knife-edge of the cut
}
function roadBand(ctx, y0, y1, L, o = {}) {
  K.band(ctx, y0, y1 + 2, mixHex(L.grass, L.walk, .45), mixHex(L.grass, L.walk, .25));   // verge / pavement
  const a0 = hw(y0), a1 = hw(y1 + 2), pav = 1.32;
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(L.walk, L.haze, .3)], [1, L.walk]]);
  ctx.beginPath(); ctx.moveTo(VP[0] - a0 * pav, y0); ctx.lineTo(VP[0] + a0 * pav, y0); ctx.lineTo(VP[0] + a1 * pav, y1 + 2); ctx.lineTo(VP[0] - a1 * pav, y1 + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(L.road, L.haze, .35)], [1, L.road]]);
  ctx.beginPath(); ctx.moveTo(VP[0] - a0, y0); ctx.lineTo(VP[0] + a0, y0); ctx.lineTo(VP[0] + a1, y1 + 2); ctx.lineTo(VP[0] - a1, y1 + 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#e8eefc', .22); ctx.lineWidth = 2; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(VP[0] + s * a0, y0); ctx.lineTo(VP[0] + s * a1, y1 + 2); ctx.stroke(); }
  // the centre line: crisp, freshly painted (nothing here is ever worn)
  ctx.strokeStyle = rgba('#e8eefc', .28); ctx.lineWidth = Math.max(1, (y1 - VP[1]) * .006); ctx.setLineDash([14, 22]); ctx.beginPath(); ctx.moveTo(VP[0], y0); ctx.lineTo(VP[0], y1); ctx.stroke(); ctx.setLineDash([]);
  const bays = [];
  for (const s of [-1, 1]) for (let y = y0; y < y1; y += Math.max(10, (y - VP[1]) * .42)) {   // the old parking bays
    const yb = Math.min(y1, y + Math.max(8, (y - VP[1]) * .3)), xa = VP[0] + s * hw(y) * .97, xb = VP[0] + s * hw(yb) * .97, xc = VP[0] + s * hw(yb) * .78, xd = VP[0] + s * hw(y) * .78;
    bays.push({ x: (xa + xb + xc + xd) / 4, y: (y + yb) / 2, s: ((y + yb) / 2 - VP[1]) / 440, side: s, q: [xa, y, xb, yb, xc, xd] });
  }
  return bays;
}
// a parked car of 2026 seen from behind, as a thin cold ink outline (the ghost row along the kerb)
export function inkCarRear(ctx, x, base, s, a = 1, col = '#eef2ff') {
  if (a <= 0) return; const w = 190 * s, h = 150 * s; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.2, 2.6 * s); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2, base - h * .12); ctx.lineTo(x - w / 2, base - h * .5); ctx.lineTo(x - w * .38, base - h * .56); ctx.lineTo(x - w * .3, base - h); ctx.lineTo(x + w * .3, base - h); ctx.lineTo(x + w * .38, base - h * .56); ctx.lineTo(x + w / 2, base - h * .5); ctx.lineTo(x + w / 2, base - h * .12); ctx.closePath(); ctx.stroke();
  ctx.strokeRect(x - w * .26, base - h * .92, w * .52, h * .3);
  ctx.fillStyle = rgba('#ff5a4a', .9); ctx.fillRect(x - w * .46, base - h * .46, w * .16, h * .08); ctx.fillRect(x + w * .3, base - h * .46, w * .16, h * .08);
  ctx.restore();
}
// what stands in the bays: box hedges (2050, cut near→far as o.hedges 0..1 grows), ghost cars (2026 ink)
function bayLife(ctx, t, bays, L, o) {
  for (const b of bays) {
    const [xa, y, xb, yb, xc, xd] = b.q;
    if (o.hedges !== 0) { const g = o.hedges == null ? 1 : K.expoOut(clamp(((o.hedges ?? 1) - (1 - b.s) * .55) * 2.2)); if (g > .01) boxHedge(ctx, xa, y, xb, yb, xc, xd, L, g); }
    if (o.ghostCars) inkCarRear(ctx, b.x, b.y + 6 * b.s, b.s, o.ghostCars * (o.ghostWipe != null ? clamp((o.ghostWipe - (1 - b.s)) * 4) : 1));
  }
}
// a tree trimmed into a perfect ball on a straight stem (the street's trees, cut like the hedges)
export function topiary(ctx, t, x, base, s, L, o = {}) {
  const th = 140 * s, r = 70 * s, C = HEDGE(L);
  ctx.fillStyle = mixHex('#2a2238', L.shade, .4); ctx.fillRect(x - 4 * s, base - th, 8 * s, th);
  const cx = x, cy = base - th - r * .8;
  ctx.fillStyle = rad(ctx, cx - L.dir * -r * .35, cy - r * .4, r * 1.5, [[0, mixHex(C.top, L.light, .25)], [.55, C.face], [1, C.side]]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba('#e8eefc', .08); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r * .98, -2.6, -.6); ctx.stroke();
  K.shadowEl(ctx, x, base, r * .9, L, .22);
  return [cx, cy, r];
}
// a cold street lamp (thumbnail A): a thin post, a flat head, a pool of blue-white light at night
export function lamp(ctx, t, x, base, h, L, side = 1, lit = null) {
  const on = lit ?? clamp(L.night * 1.3);
  ctx.fillStyle = mixHex('#1a2050', L.shade, .3); ctx.fillRect(x - h * .012, base - h, h * .024, h); ctx.fillRect(x, base - h, side * h * .16, h * .018);
  const hx = x + side * h * .15, hy = base - h + h * .03;
  ctx.fillStyle = on > .05 ? '#eef4ff' : mixHex('#3a4070', L.light, .2); ctx.fillRect(hx - h * .03, hy - h * .01, h * .06, h * .016);
  if (on > .05) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, hy, 0, base, [[0, rgba('#9fb8ff', .22 * on)], [1, rgba('#9fb8ff', .02 * on)]]); ctx.beginPath(); ctx.moveTo(hx - h * .03, hy); ctx.lineTo(hx + h * .03, hy); ctx.lineTo(hx + h * .22, base); ctx.lineTo(hx - h * .22, base); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rad(ctx, hx, hy, h * .14, [[0, rgba('#dfe8ff', .55 * on)], [1, rgba('#9fb8ff', 0)]]); ctx.fillRect(hx - h * .14, hy - h * .14, h * .28, h * .28); ctx.restore(); }
}
// THE FENCE (vertical steel bars on a long line) between x0..x1 at base, height h; o.gate false (there is no gate on your side)
export function fence(ctx, t, x0, x1, base, h, L, o = {}) {
  const col = o.col || mixHex('#10163e', L.shade, .3), lit = mixHex(col, L.light, .14), step = o.step ?? Math.max(4, h * .09);
  ctx.fillStyle = col; ctx.fillRect(x0, base - h * .06, x1 - x0, h * .06); ctx.fillRect(x0, base - h * .93, x1 - x0, h * .04);
  for (let x = x0, i = 0; x < x1; x += step, i++) { ctx.fillStyle = i % 9 === 0 ? lit : col; ctx.fillRect(x, base - h, Math.max(1.2, step * (i % 9 === 0 ? .5 : .26)), h); }
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, base - h, 0, base, [[0, rgba(CARM.hot, 0)], [1, rgba(CARM.hot, .08 * o.glow)]]); ctx.fillRect(x0, base - h, x1 - x0, h); ctx.restore(); }
}
// THE TOWER THAT NEVER GOES DARK: a windowless monolith (thumbnail A), its carmine band near the top; o.a (0..1), o.wake (anticipation flicker)
export function tower(ctx, t, x, base, w, h, L, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  const top = base - h, sw = w * .28;
  K.carmGlow(ctx, x, top + h * .12, w * 3.2, .22 * (o.glow ?? 1));
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex('#0d1238', L.shade, .25)], [1, mixHex('#1c2258', L.light, .1)]]);
  ctx.beginPath(); ctx.moveTo(x - w / 2, base); ctx.lineTo(x - w * .46, top); ctx.lineTo(x + w * .46, top); ctx.lineTo(x + w / 2, base); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex('#080c2a', L.shade, .2); ctx.beginPath(); ctx.moveTo(x + w / 2, base); ctx.lineTo(x + w * .46, top); ctx.lineTo(x + w * .46 + sw, top + sw * .3); ctx.lineTo(x + w / 2 + sw, base); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#e8eefc', .06); ctx.fillRect(x - w * .46, top, w * .92, 3);
  const by = top + h * .1, fl = 1 - .5 * (o.wake ?? 0) * (Math.sin(t * 40) > .3 ? 1 : 0);
  K.lightBand(ctx, t, x - w * .46, by, x + w * .46, by, Math.max(2, w * .045), fl);
  K.lightBand(ctx, t, x + w * .46, by, x + w * .46 + sw, by + sw * .3, Math.max(2, w * .04), fl * .8);
  ctx.restore();
  return { x, top, band: by };
}
// the land behind the fence: grey halls and solar rows to the hills (far card); u 0..1 how far it reaches
export function machineLand(ctx, t, x0, x1, base, L, u = 1, o = {}) {
  const r = prng(o.seed ?? 4), hall = mixHex('#2c3260', L.light, .1), hallS = mixHex('#1a1f4a', L.shade, .2), pan = mixHex('#1a2a6a', L.light, .15);
  for (let x = x0; x < x1;) { const w = 50 + r() * 120, h = 16 + r() * 26; if ((x - x0) / (x1 - x0) < u) { ctx.fillStyle = hallS; ctx.fillRect(x, base - h, w, h); ctx.fillStyle = hall; ctx.fillRect(x, base - h, w, 3); } x += w + 6 + r() * 30; }
  ctx.fillStyle = pan; for (let k = 0; k < 4; k++) { const y = base + 4 + k * 6; ctx.fillRect(x0, y, (x1 - x0) * u, 2.5); }
}
// THE DATA CENTRE across the road (mirror of #74's printed house): windowless, panel seams, a carmine seam, cooling fans, a loading door.
// u build progress (0 empty lot … .1–.9 printed in layers under a gantry … 1 done); o.day 1..9 (a small day stamp is the scene's job)
export function dataCentre(ctx, t, x, base, w, h, L, u = 1, o = {}) {
  const face = mixHex('#1a2050', L.light, .1), faceS = mixHex('#0c1036', L.shade, .2);
  if (u < .98) { ctx.save(); ctx.strokeStyle = rgba('#e8eefc', .35); ctx.setLineDash([12, 10]); ctx.lineWidth = 3; ctx.strokeRect(x, base - h, w, h); ctx.restore(); }
  const hh = h * clamp((u - .05) / .85), layers = Math.floor(hh / 16);
  ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, face], [1, faceS]]); ctx.fillRect(x, base - layers * 16, w, layers * 16);
  for (let i = 0; i < layers; i++) { ctx.fillStyle = rgba(i % 2 ? '#e8eefc' : '#000010', .035); ctx.fillRect(x, base - (i + 1) * 16, w, 16); }
  if (u >= .98) {
    ctx.strokeStyle = rgba('#e8eefc', .07); ctx.lineWidth = 2; for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(x + w * k / 6, base - h); ctx.lineTo(x + w * k / 6, base); ctx.stroke(); }
    ctx.fillStyle = mixHex('#232a62', L.light, .12); for (let k = 0; k < 4; k++) { const fx = x + w * (.14 + k * .22); ctx.fillRect(fx - w * .07, base - h - 26, w * .14, 26); ctx.fillStyle = mixHex('#0c1036', L.shade, .2); ctx.beginPath(); ctx.ellipse(fx, base - h - 26, w * .055, 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = mixHex('#232a62', L.light, .12); }
    K.lightBand(ctx, t, x, base - h * .9, x + w, base - h * .9, 5, o.seam ?? 1);   // the seam that never goes out
    const dw = w * .3, dx = x + w * .35;   // the loading door, the only opening (cars go in, nobody comes out)
    ctx.fillStyle = '#05071c'; ctx.fillRect(dx, base - h * .26, dw, h * .26); ctx.fillStyle = rgba(CARM.hot, .5 + .2 * Math.sin(t * 2)); ctx.fillRect(dx, base - h * .26, dw, 3);
    if (o.vapour) for (let k = 0; k < 4; k++) { const fx = x + w * (.14 + k * .22), p = (t * .12 + k * .27) % 1; ctx.fillStyle = rgba('#c8d2f0', .1 * (1 - p)); ctx.beginPath(); ctx.ellipse(fx + p * 30, base - h - 40 - p * 120, 22 + p * 40, 10 + p * 18, 0, 0, 7); ctx.fill(); }
  } else if (u > .05) {   // the gantry and its print head
    const gy = base - layers * 16 - 34; ctx.fillStyle = mixHex('#3a4a8a', L.shade, .3); ctx.fillRect(x - 40, gy, w + 80, 14); ctx.fillRect(x - 40, gy, 12, base - gy); ctx.fillRect(x + w + 28, gy, 12, base - gy);
    const nx = x + (Math.sin(t * 2.6) * .5 + .5) * w; ctx.fillRect(nx - 14, gy + 10, 28, 26); ctx.fillStyle = CARM.hot; ctx.beginPath(); ctx.arc(nx, gy + 40, 4, 0, 7); ctx.fill();
  }
  return { x, base, w, h, win: [], door: [x + w * .35, base - h * .26, w * .3, h * .26] };
}
const HL = (ctx, g, a, L) => { if (!a || a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(L.light, .22 * a); ctx.fillRect(g.x, g.base - g.h, g.w, g.h); ctx.restore(); };
// the whole street (leitbild). o: hl(i) house light 0..1 (far 0–3, mid 4–5, near 6–7), hedges (0..1, default 1), ghostCars (+ghostWipe),
// tower (0..1, default 1), towerWake, fence (default 1), land (0..1 machine land behind the fence), dc (data centre across: 0..1 build, null = the old house),
// pods [{x, y, s, dir}] (robotaxis with crates on the FOCUS card), lamps, you [x,y,h], youNear [x,y,h], boyAt [x,y,h], doors (0 = all shut), focus(ctx,t), fore.
// Returns { yours, across, mid: [g1, g2], tower } (design coords of their cards).
export function street(ctx, t, cam, L, o = {}) {
  const out = {}, hl = o.hl || (() => 0), lit = o.lit ?? 0;
  K.stage(ctx, cam, [
    [40000, () => K.sky(ctx, t, L, { horizon: 600, sunAt: o.sunAt, clouds: 3, sunR: 40 })],
    [16000, () => {
      K.hills(ctx, 590, 40, null, 4, { grad: [K.hz(mixHex(L.leafS, L.shade, .3), 16000, L), K.hz(L.leafS, 12000, L)] });
      if (o.land) machineLand(ctx, t, 640, 1290, 586, L, o.land);
      if (o.tower !== 0) out.tower = tower(ctx, t, TOWER.x, TOWER.base, TOWER.w, TOWER.h, L, { a: o.tower ?? 1, wake: o.towerWake });
      if (o.farPod != null) { const fx = o.farPod; K.pod(ctx, fx, 600, .14, L, { dir: 1, crates: true, t }); }   // a car with crates rolls in at the tower's foot (scale: the tower dwarfs it)
      if (o.fence !== 0) fence(ctx, t, 560, 1360, 600, 34, L, { glow: o.tower ?? 1 });
      if (o.ghostFields) { ctx.save(); ctx.globalAlpha *= o.ghostFields; ctx.strokeStyle = '#eef2ff'; ctx.lineWidth = 1.6; for (let k = 0; k < 7; k++) { const y = 572 + k * 4; ctx.beginPath(); ctx.moveTo(600, y); ctx.lineTo(1320, y); ctx.stroke(); } for (let x = 610; x < 1320; x += 26) { ctx.beginPath(); ctx.moveTo(x, 598); ctx.lineTo(x + 6, 560); ctx.stroke(); } ctx.restore(); }
    }],
    [7000, () => {
      const bays = roadBand(ctx, 600, 668, L);
      [[470, 1], [620, 1], [1170, -1], [1320, -1]].forEach(([x, side], i) => { const g = K.house(ctx, x, 600, 140, 120, L, { col: K.hz(['#a89aa6', '#9c8aa0', '#8e98a6', '#a2949c'][i], 7000, L), side, lit, t }); HL(ctx, g, hl(i), L); });
      for (const x of [760, 1150]) topiary(ctx, t, x, 606, .32, L);
      bayLife(ctx, t, bays, L, o);
    }],
    [4200, () => {
      const bays = roadBand(ctx, 650, 790, L);
      const g1 = K.house(ctx, 330, 668, 230, 200, L, { col: '#9a8aa0', side: 1, lit, t, garage: o.garage ?? 0 });
      const g2 = K.house(ctx, 1330, 668, 230, 200, L, { col: '#8a8aa6', side: -1, lit, t, garage: o.garage ?? 0 });
      HL(ctx, g1, hl(4), L); HL(ctx, g2, hl(5), L); out.mid = [g1, g2];
      for (const x of [650, 1250]) topiary(ctx, t, x, 690, .55, L);
      if (o.lamps !== false) { lamp(ctx, t, 600, 712, 150, L, 1); lamp(ctx, t, 1320, 712, 150, L, -1); }
      bayLife(ctx, t, bays, L, o);
    }],
    [2600, () => {
      const bays = roadBand(ctx, 770, 1100, L);
      const yours = K.house(ctx, -330, 800, 560, 470, L, { col: '#a2928a', side: 1, door: 'yellow', doorCol: 1, lit, t, roofH: 190 });
      const across = o.dc != null ? dataCentre(ctx, t, 1600, 800, 600, 620, L, o.dc, { vapour: true }) : K.house(ctx, 1640, 800, 560, 440, L, { col: '#8e98a0', side: -1, lit, t, roofH: 180, doorCol: 1, garage: o.garage ?? 0, garageAt: .06 });
      HL(ctx, yours, hl(6), L); HL(ctx, across, hl(7), L); out.yours = yours; out.across = across;
      if (o.youNear) K.you(ctx, t, o.youNear[0], o.youNear[1], o.youNear[2], { dir: 1, look: .3 });
      for (const x of [420, 1530]) topiary(ctx, t, x, 860, 1.05, L);
      if (o.lamps !== false) lamp(ctx, t, 260, 880, 420, L, 1);
      bayLife(ctx, t, bays, L, o);
      if (o.near) o.near(ctx, t, out);
    }],
    [1700, () => {
      for (const p of o.pods || []) K.pod(ctx, p.x, p.y, p.s ?? .95, L, { dir: p.dir ?? -1, crates: true, t });
      if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2] ?? 230, { walk: o.youWalk, pose: o.youPose, dir: o.youDir ?? 1, look: o.youLook, armR: o.youArmR });
      if (o.boyAt) boy(ctx, t, o.boyAt[0], o.boyAt[1], o.boyAt[2] ?? 150, { pose: o.boyPose, walk: o.boyWalk, dir: o.boyDir ?? 1 });
      if (o.focus) o.focus(ctx, t, out);
    }],
    [1150, () => {
      if (o.fore === false) return;
      const C = HEDGE(L), sw = Math.sin(t * .5) * 2;   // the corner of a box hedge out of focus, bottom right: flat cut top catching the light, dark face
      ctx.fillStyle = lin(ctx, 0, 990, 0, 1200, [[0, mixHex(C.face, '#060a24', .25)], [1, mixHex(C.side, '#060a24', .5)]]); ctx.beginPath(); ctx.roundRect(1700 + sw, 990, 700, 260, 10); ctx.fill();
      ctx.fillStyle = lin(ctx, 1700, 0, 2300, 0, [[0, mixHex(C.top, L.light, .1)], [1, mixHex(C.top, '#060a24', .3)]]); ctx.beginPath(); ctx.moveTo(1700 + sw, 994); ctx.lineTo(1760 + sw, 950); ctx.lineTo(2400, 950); ctx.lineTo(2400, 994); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba('#e8eefc', .18); ctx.fillRect(1700 + sw, 990, 700, 3);
    }],
  ]);
  return out;
}
// the grandson (about nine, rust coat like #74's granddaughter, short hair, no hood): the mirror child
export function boy(ctx, t, x, y, h, o = {}) { return K.figureRaw(ctx, x, y, h * (1 + .008 * Math.sin(t * 1.9 + 2)), { hood: false, look: o.look ?? .2 * Math.sin(t * .5 + 1), ...o }, K.RUST, false); }
// a screen held by / standing before a figure: a cold carmine-white plane + the light it throws back (o.a, o.flick)
export function screenGlow(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const fl = .9 + .1 * Math.sin(t * 5.3) * Math.sin(t * 2.1);
  K.carmGlow(ctx, x + w / 2, y + h / 2, Math.max(w, h) * 2.6, .2 * a * fl);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, '#ffe8ee'], [.5, mixHex(K.CARM.hot, '#ffe8ee', .5)], [1, K.CARM.body]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(w, h) * .08); ctx.fill();
  ctx.fillStyle = rgba('#ffffff', .25 * fl); ctx.fillRect(x + w * .1, y + h * (.2 + .5 * ((t * .3) % 1)), w * .8, Math.max(1, h * .04)); ctx.restore();
}
export function chalk(ctx, t, x, y, u, L) {   // a chalk sun and a house on the road
  ctx.save(); ctx.strokeStyle = rgba('#fff6dc', .85); ctx.lineWidth = 5; ctx.lineCap = 'round';
  K.strokeIn(ctx, Array.from({ length: 33 }, (_, i) => [x + Math.cos(i / 32 * 6.283) * 60, y + Math.sin(i / 32 * 6.283) * 22]), u);
  for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, uu = clamp(u * 2 - 1 - i * .05); if (uu > 0) K.strokeIn(ctx, [[x + Math.cos(a) * 80, y + Math.sin(a) * 30], [x + Math.cos(a) * 110, y + Math.sin(a) * 41]], uu); }
  ctx.strokeStyle = rgba('#ffb3a0', .8); K.strokeIn(ctx, [[x + 240, y + 30], [x + 240, y - 20], [x + 290, y - 50], [x + 340, y - 20], [x + 340, y + 30], [x + 240, y + 30]], clamp(u * 1.5 - .5));
  ctx.restore();
}
function chimeDots(ctx, t, hs, u) {   // a light point in every house, rings spreading (the noon chime)
  for (const g of hs) { if (!g.win) continue; const [wx, wy, ww, wh] = g.win[0]; const x = wx + ww / 2, y = wy + wh / 2, e = clamp(u);
    K.ring(ctx, t, x, y, 18 + 10 * e, e); }
}
function lanternString(ctx, t, x0, y0, x1, y1, L, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba('#1a1a3a', .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y0 + 120, x1, y1); ctx.stroke();
  for (let i = 1; i < 14; i++) { const u = i / 14, x = lerp(x0, x1, u), y = lerp(y0, y1, u) + 120 * 2 * u * (1 - u) * 2 / 2 + Math.sin(t * 1.3 + i) * 3; const fl = .85 + .15 * Math.sin(t * 7 + i * 2.1);
    ctx.fillStyle = rad(ctx, x, y, 60, [[0, rgba('#ffd98a', .5 * fl)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(x - 60, y - 60, 120, 120); ctx.fillStyle = '#fff0c0'; ctx.beginPath(); ctx.arc(x, y + 8, 9, 0, 7); ctx.fill(); }
  ctx.restore();
}
// the roof robot on your house (g = house geometry): kneels on the slope, lays a tile, cyan joint light
export function roofBot(ctx, t, g, L, u = 1) {
  const [p0, p1] = g.roofPts, x = lerp(p0[0], p1[0], .62), y = lerp(p0[1], p1[1], .62);
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * .35);
  K.bot(ctx, t, 0, 18, 210, L, { pose: 'reach', armR: [2.1 + .35 * Math.sin(t * 1.7), 1.6 + .3 * Math.sin(t * 1.7)], dir: 1 });
  ctx.restore();
}
// the printed house: u 0..1 (0 = empty lot with a ghost outline, .1–.9 walls rise in layers under a gantry, 1 = done with windows)
export function printedHouse(ctx, t, x, base, w, h, L, u) {
  if (u >= .98) return K.house(ctx, x, base, w, h, L, { col: '#e2d6bf', side: -1, lit: L.night, roof: 'flat', t, cols: 2, rows: 2 });
  ctx.save(); ctx.strokeStyle = rgba('#fffaf0', .5); ctx.setLineDash([12, 10]); ctx.lineWidth = 3; ctx.strokeRect(x, base - h, w, h); ctx.restore();
  const hh = h * clamp((u - .08) / .8), layers = Math.floor(hh / 14);
  for (let i = 0; i < layers; i++) { ctx.fillStyle = i % 2 ? mixHex('#d9cbb0', L.light, .2) : mixHex('#cbbd9f', L.shade, .15); ctx.fillRect(x, base - (i + 1) * 14, w, 14); }
  const gy = base - hh - 30; ctx.fillStyle = mixHex('#3a4a8a', L.shade, .2); ctx.fillRect(x - 40, gy, w + 80, 16); ctx.fillRect(x - 40, gy, 14, base - gy); ctx.fillRect(x + w + 26, gy, 14, base - gy);
  const nx = x + (Math.sin(t * 2.2) * .5 + .5) * w; ctx.fillRect(nx - 16, gy + 10, 32, 30); ctx.fillStyle = '#ffd98a'; ctx.beginPath(); ctx.arc(nx, gy + 44, 5, 0, 7); ctx.fill();
  return { x, base, w, h, win: [], door: [x + w * .4, base - h * .34, w * .2, h * .34] };
}
export function fusionFar(ctx, t, x, y, L, a = 1) {   // the fusion plant beyond the hills: a dome and a glowing ring
  ctx.save(); ctx.globalAlpha *= a; const c = K.hz('#c9cfe6', 9000, L);
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 70, 46, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 110, y - 8, 220, 10);
  K.ring(ctx, t, x, y - 18, 30, .8);
  ctx.restore();
}

// ---------------------------------------------------------------- the home: bedroom, kitchen, hallway
const ROOM = (L) => ({ wall: mixHex('#7c7a96', L.light, .25), wallS: mixHex('#3a3c66', L.shade, .4), floor: mixHex('#4a3e52', L.shade, .2), wood: mixHex('#5a4652', L.shade, .15) });   // film 79: the same rooms, colder
// sunlight patch through a window onto wall/floor
function sunPatch(ctx, pts, a, L) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(L.light, a); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill(); ctx.restore(); }
function windowView(ctx, t, x, y, w, h, L, o = {}) {   // film 79: the street seen through a window: cold sky, a trimmed tree, the house across, the tower beyond
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, L.top], [1, L.low]]); ctx.fillRect(x, y, w, h);
  if (L.night > .05) K.stars(ctx, 77, 30, t, [x, y, w, h * .5], L.night);
  tower(ctx, t, x + w * .7, y + h * .78, w * .1, h * .62, L, { wake: o.towerWake });
  fence(ctx, t, x, x + w, y + h * .8, h * .05, L);
  K.house(ctx, x + w * .08, y + h * .95, w * .4, h * .42, L, { col: '#8e98a0', lit: 0 });
  topiary(ctx, t, x + w * .62, y + h, .5, L);
  if (o.pod != null) K.pod(ctx, x + w * o.pod, y + h * .99, .38, L, { dir: -1, crates: true, t });
  ctx.restore();
}
// dark on schedule: a night veil over a room card, the window rect stays clear (o.dark 0..1)
function veil(ctx, d, win) { if (!d || d <= 0) return; ctx.save(); ctx.fillStyle = rgba('#03051a', .72 * d); ctx.beginPath(); ctx.rect(-1600, -1200, W + 3200, H + 2400); if (win) ctx.rect(win[0] + win[2], win[1], -win[2], win[3]); ctx.fill('evenodd'); ctx.restore(); }
export function bedroom(ctx, t, cam, L, o = {}) {
  const R = ROOM(L);
  K.stage(ctx, cam, [
    [4200, () => { ctx.fillStyle = lin(ctx, 0, -300, 0, 900, [[0, R.wall], [1, R.wallS]]); ctx.fillRect(-1200, -800, W + 2400, 1700);
      windowView(ctx, t, 1180, 150, 420, 470, L); ctx.fillStyle = mixHex('#f4ecd8', L.light, .2); for (const [a, b, c, d] of [[1160, 130, 460, 20], [1160, 620, 460, 22], [1160, 130, 22, 510], [1580, 130, 22, 510], [1380, 140, 10, 480]]) ctx.fillRect(a, b, c, d);
      sunPatch(ctx, [[1180, 640], [1600, 640], [1500, 1000], [940, 1000]], .18, L);
      ctx.fillStyle = R.floor; ctx.fillRect(-1200, 880, W + 2400, 600); }],
    [2600, () => { // curtain swaying, the frame of a picture
      const s = Math.sin(t * .9) * 10; ctx.fillStyle = lin(ctx, 1090, 0, 1180, 0, [[0, mixHex('#e9c88f', L.shade, .2)], [1, mixHex('#f6dca8', L.light, .3)]]);
      ctx.beginPath(); ctx.moveTo(1060, 80); ctx.lineTo(1170, 80); ctx.quadraticCurveTo(1150 + s, 400, 1180 + s * 1.5, 720); ctx.lineTo(1040 + s, 720); ctx.quadraticCurveTo(1080 + s, 400, 1060, 80); ctx.fill();
      ctx.fillStyle = mixHex('#33497a', L.shade, .2); ctx.fillRect(420, 260, 300, 200); ctx.fillStyle = mixHex('#e7d19a', L.light, .2); ctx.fillRect(440, 280, 260, 160); ctx.save(); ctx.beginPath(); ctx.rect(440, 280, 260, 160); ctx.clip(); K.hills(ctx, 400, 20, mixHex('#5f8f4a', L.light, .2), 2, { x0: 440, x1: 700 }); ctx.restore(); }],
    [1700, () => { // bed, you sitting up, nightstand
      ctx.fillStyle = R.wood; ctx.fillRect(160, 560, 60, 380); ctx.fillStyle = lin(ctx, 0, 700, 0, 960, [[0, mixHex('#f3ead6', L.light, .3)], [1, mixHex('#c9bba0', L.shade, .3)]]); ctx.beginPath(); ctx.roundRect(200, 720, 880, 230, 30); ctx.fill();
      const up = o.up ?? 1;   // sitting up: 0 lying, 1 upright (torso above the blanket)
      K.you(ctx, t, 540, 1075 + (1 - up) * 200, 480, { lean: (1 - up) * -.9 - .05, look: o.youLook ?? .3 + .1 * Math.sin(t * .5), armR: [1.0, 2.2], armL: [-.5, -.3], dir: 1 });
      ctx.fillStyle = lin(ctx, 0, 760, 0, 960, [[0, mixHex('#6a86c4', L.light, .2)], [1, mixHex('#3e5a9a', L.shade, .25)]]); ctx.beginPath(); ctx.roundRect(300, 770, 780, 190, 40); ctx.fill();   // blanket
      ctx.fillStyle = rgba('#fffaf0', .12); ctx.beginPath(); ctx.ellipse(560, 790, 200, 18, 0, 0, 7); ctx.fill();
      ctx.fillStyle = lin(ctx, 0, 930, 0, 1100, [[0, mixHex(R.wood, L.light, .1)], [1, mixHex(R.wood, '#20264e', .3)]]); ctx.beginPath(); ctx.roundRect(180, 935, 920, 200, 14); ctx.fill();   // the bed's side
      // the nightstand: empty, a cup, a pale ring in the dust where the clock stood
      ctx.fillStyle = R.wood; ctx.fillRect(1100, 760, 230, 190); ctx.fillStyle = mixHex(R.wood, L.light, .25); ctx.fillRect(1090, 748, 250, 20);
      ctx.fillStyle = rgba(mixHex('#8f8a7a', L.light, .2), .55); ctx.fillRect(1094, 748, 242, 12);   // a film of dust
      ctx.strokeStyle = rgba('#fff6dc', .85); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(1240, 754, 34, 6, 0, 0, 7); ctx.stroke();   // where the clock stood
      ctx.fillStyle = mixHex('#e9e3d3', L.light, .2); ctx.fillRect(1130, 712, 40, 38); ctx.strokeStyle = rgba('#fffaf0', .3 + .2 * Math.sin(t * 2)); ctx.lineWidth = 2; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.moveTo(1142 + k * 14, 704); ctx.bezierCurveTo(1135 + k * 14, 690 - 6 * Math.sin(t * 1.5 + k), 1155 + k * 14, 680, 1146 + k * 14, 664); ctx.stroke(); }
    }],
    [1150, () => { ctx.fillStyle = rgba('#20264e', .85); ctx.beginPath(); ctx.ellipse(1900, 1060, 300, 160, 0, 0, 7); ctx.fill(); }],
  ]);
}
// the old brass alarm clock with two bells (prop); ring 0..1 shakes the bells; returns the face centre
export function alarmClock(ctx, t, x, y, s, o = {}) {
  const sh = (o.ring ?? 0) * Math.sin(t * 70) * .06;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sh + (o.rot ?? 0)); ctx.scale(s, s);
  const brass = lin(ctx, -60, -60, 60, 60, [[0, '#ffe2a0'], [.5, '#d4a24c'], [1, '#8a5a24']]);
  ctx.fillStyle = brass; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 40, -58, 26, Math.PI, 0); ctx.fill(); }
  ctx.fillRect(-4, -92, 8, 20); ctx.fillStyle = '#6a4418'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 30, 52); ctx.lineTo(sx * 46, 74); ctx.lineTo(sx * 38, 74); ctx.lineTo(sx * 22, 54); ctx.fill(); }
  ctx.fillStyle = brass; ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fill();
  ctx.fillStyle = '#fbf4e0'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, 7); ctx.fill();
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 40, Math.sin(a) * 40); ctx.lineTo(Math.cos(a) * 46, Math.sin(a) * 46); ctx.stroke(); }
  ctx.lineWidth = 4; ctx.lineCap = 'round'; const hh = o.hh ?? -1.9, mm = o.mm ?? -1.57 + .9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hh) * 24, Math.sin(hh) * 24); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mm) * 36, Math.sin(mm) * 36); ctx.stroke();
  ctx.strokeStyle = '#c8473a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(-2.4) * 34, Math.sin(-2.4) * 34); ctx.stroke();
  ctx.fillStyle = rgba('#ffffff', .35); ctx.beginPath(); ctx.ellipse(-18, -22, 14, 7, -.6, 0, 7); ctx.fill();
  if (o.ring) { ctx.strokeStyle = rgba('#ffe7a8', .7 * o.ring); ctx.lineWidth = 3; for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const p = (t * 2.4 + k / 3) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(sx * 40, -64, 34 + p * 60, sx < 0 ? 3.6 : 4.8, sx < 0 ? 4.6 : 5.8); ctx.stroke(); } ctx.globalAlpha = 1; }
  ctx.restore();
  return [x, y, 62 * s];
}
export function kitchen(ctx, t, cam, L, o = {}) {
  const R = ROOM(L);
  K.stage(ctx, cam, [
    [5200, () => { ctx.fillStyle = lin(ctx, 0, -300, 0, 900, [[0, R.wall], [1, R.wallS]]); ctx.fillRect(-1200, -800, W + 2400, 1700);
      windowView(ctx, t, 1240, 170, 520, 430, L, { pod: o.pod, towerWake: o.towerWake }); ctx.fillStyle = mixHex('#c8c6d6', L.light, .2); for (const [a, b, c, d] of [[1222, 152, 556, 20], [1222, 598, 556, 24], [1222, 152, 20, 470], [1758, 152, 20, 470], [1492, 160, 12, 440]]) ctx.fillRect(a, b, c, d);
      if (o.strollers) for (let i = 0; i < 3; i++) K.folk(ctx, t, i + 1, 1260 + ((t * 18 + i * 170) % 520), 590, 62, { walk: K.walkPh(t, .45) + i, dir: 1 });
      ctx.fillStyle = mixHex('#7a8db8', L.shade, .3); ctx.fillRect(100, 560, 380, 24); for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#e2553f', '#f0a23a', '#5f8f4a', '#e7d19a'][i]; ctx.beginPath(); ctx.arc(160 + i * 70, 540, 22, 0, 7); ctx.fill(); }
      sunPatch(ctx, [[1240, 600], [1760, 600], [1580, 1000], [900, 1000]], .16 * (1 - (o.dark ?? 0)), L); ctx.fillStyle = R.floor; ctx.fillRect(-1200, 900, W + 2400, 600);
      if (o.lamp != null) { const on = o.lamp; ctx.fillStyle = mixHex('#2a2448', L.shade, .2); ctx.fillRect(758, -100, 4, 330); ctx.fillStyle = on > .5 ? '#fff1cf' : '#3a3a5a'; ctx.beginPath(); ctx.moveTo(700, 260); ctx.lineTo(820, 260); ctx.lineTo(790, 225); ctx.lineTo(730, 225); ctx.fill();
        if (on > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 760, 300, 520, [[0, rgba('#ffcf8a', .28 * on)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(240, -220, 1040, 1040); ctx.restore(); } }   // the kitchen lamp (human warm light)
      if (o.meter) { const [mx, my] = [380, 330]; ctx.fillStyle = '#0b0e2a'; ctx.beginPath(); ctx.roundRect(mx, my, 150, 90, 8); ctx.fill(); ctx.fillStyle = o.dark > .5 ? K.CARM.hot : '#8fa0d0'; ctx.font = '600 15px Inter'; ctx.fillText(o.meter, mx + 14, my + 34); ctx.fillStyle = rgba('#e8eefc', .5); ctx.fillRect(mx + 14, my + 54, 122 * (1 - (o.dark ?? 0)), 4); }
      veil(ctx, o.dark, [1222, 152, 556, 470]); }],
    [2400, () => { // the table with the old box, the boy (film 79: the grandson)
      ctx.fillStyle = R.wood; ctx.fillRect(260, 760, 980, 36); ctx.fillRect(300, 790, 30, 200); ctx.fillRect(1170, 790, 30, 200);
      ctx.fillStyle = mixHex('#a7744a', L.shade, .2); ctx.fillRect(820, 650, 260, 112); ctx.fillStyle = mixHex('#c79a6a', L.light, .2); ctx.beginPath(); ctx.moveTo(820, 650); ctx.lineTo(1080, 650); ctx.lineTo(1120, 600); ctx.lineTo(860, 600); ctx.fill();
      if (o.box) o.box(ctx, t);
      const hd = boy(ctx, t, o.boyX ?? 700, 990 - (o.boyHop ?? 0), o.boyH ?? 330, { pose: o.boyPose ?? 'lift', armR: o.armR, armL: o.armL, look: o.boyLook ?? .2, dir: o.boyDir ?? 1, lean: o.boyLean });
      if (o.clock) o.clock(ctx, t, hd);
      veil(ctx, (o.dark ?? 0) * .8);
    }],
    [1500, () => { if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2], { pose: o.youPose ?? 'stand', dir: o.youDir ?? -1, look: o.youLook ?? -.3, back: o.youBack ?? .4 }); veil(ctx, (o.dark ?? 0) * .6); }],
  ]);
}
export function hallway(ctx, t, cam, L, open, o = {}) {   // the front door from inside; open 0..1 swings it into light; returns the door rect (screen at home cam)
  const R = ROOM(L), door = [760, 190, 400, 760];
  K.stage(ctx, cam, [
    [3000, () => { ctx.fillStyle = lin(ctx, 0, -300, 0, 1000, [[0, mixHex(R.wallS, '#20264e', .3)], [1, mixHex(R.wall, R.wallS, .5)]]); ctx.fillRect(-1200, -800, W + 2400, 1700);
      ctx.fillStyle = mixHex(R.floor, '#20264e', .25); ctx.fillRect(-1200, 950, W + 2400, 600); ctx.fillStyle = mixHex('#c4583a', L.shade, .35); ctx.beginPath(); ctx.moveTo(700, 960); ctx.lineTo(1220, 960); ctx.lineTo(1500, 1200); ctx.lineTo(420, 1200); ctx.fill();   // runner
      ctx.fillStyle = mixHex('#33497a', L.shade, .2); ctx.fillRect(1330, 360, 220, 160); ctx.fillStyle = mixHex('#e7d19a', L.light, .1); ctx.fillRect(1345, 375, 190, 130); ctx.fillStyle = mixHex('#c4583a', L.light, .1); ctx.beginPath(); ctx.arc(1440, 450, 30, 0, 7); ctx.fill();   // a child's drawing
      ctx.fillStyle = mixHex(R.wood, '#20264e', .2); ctx.fillRect(1300, 820, 300, 130); for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#2e4a8a', '#c4583a', '#f2b632', '#5d6b8f'][i]; ctx.beginPath(); ctx.ellipse(1340 + i * 70, 810, 28, 12, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = lin(ctx, 0, 190, 0, 950, [[0, L.top], [.55, L.low], [.56, L.walk], [1, L.road]]); ctx.fillRect(...door);
      ctx.save(); ctx.beginPath(); ctx.rect(...door); ctx.clip(); tower(ctx, t, 960, 640, 40, 300, L); K.house(ctx, 1000, 780, 300, 300, L, { col: '#8e98a0' }); topiary(ctx, t, 860, 960, .9, L); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 960, 600, 700 * (.3 + open), [[0, rgba(L.light, .45 * open)], [1, rgba(L.light, 0)]]); ctx.fillRect(-400, -300, W + 800, H + 600);
      ctx.fillStyle = rgba(L.light, .25 * open); ctx.beginPath(); ctx.moveTo(760, 950); ctx.lineTo(1160, 950); ctx.lineTo(1500, 1100); ctx.lineTo(420, 1100); ctx.fill(); ctx.restore();
      // the door leaf, swinging inward to the left
      const wq = 400 * (1 - .82 * K.quartIO(open)); ctx.fillStyle = lin(ctx, 760, 0, 760 + wq, 0, [[0, '#d99a2a'], [1, '#ffd36a']]); ctx.beginPath(); ctx.moveTo(760, 190); ctx.lineTo(760 + wq, 190 - 40 * open); ctx.lineTo(760 + wq, 950 + 40 * open); ctx.lineTo(760, 950); ctx.fill();
      ctx.fillStyle = '#5a3a18'; ctx.beginPath(); ctx.arc(760 + wq * .88, 580, 8, 0, 7); ctx.fill();
      ctx.fillStyle = mixHex(R.wood, '#20264e', .3); ctx.fillRect(730, 170, 460, 24); ctx.fillRect(730, 170, 30, 790); ctx.fillRect(1160, 170, 30, 790); }],
    [1600, () => { // coat hooks, the girl looking at the door, you
      ctx.fillStyle = mixHex('#6a4a3a', '#20264e', .3); ctx.fillRect(250, 330, 300, 16);
      ctx.fillStyle = lin(ctx, 260, 0, 400, 0, [[0, K.COAT.shade], [.6, K.COAT.base], [1, K.COAT.lit]]); ctx.beginPath(); ctx.moveTo(318, 346); ctx.quadraticCurveTo(250, 360, 262, 420); ctx.lineTo(250, 620); ctx.lineTo(410, 620); ctx.lineTo(398, 420); ctx.quadraticCurveTo(410, 360, 342, 346); ctx.closePath(); ctx.fill();   // your yellow coat on the hook
      ctx.fillStyle = rgba(K.COAT.deep, .35); ctx.fillRect(328, 380, 4, 230);
      if (o.boy !== false) boy(ctx, t, 560, 1040, 430, { look: .9, dir: 1, back: .3, pose: o.boyPose, armR: o.boyArm });
      if (o.you) K.you(ctx, t, o.you, 1010, 470, { dir: 1, back: .7, walk: o.youWalk });
    }],
  ]);
  return door;
}
