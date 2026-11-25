// Film 79 (from #74) · places of the street (2.5D card stages): the workshops (boat shed, motorbike garage, your studio), the kerb close-up,
// the street from above. Every place takes (ctx, t, cam, L, o) and draws back → front.
import * as K from './f79_kit.mjs';
import * as S from './f79_street.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, rad, lin, prng } = K;
const WOOD = (L) => ({ wall: mixHex('#b98a5e', L.light, .22), wallS: mixHex('#6a4a3a', L.shade, .45), plank: mixHex('#a37650', L.shade, .2), floor: mixHex('#8a6a50', L.shade, .25), dark: mixHex('#3a2a30', L.shade, .3) });
// a workshop interior: plank wall with a big open door (the sunny street behind), a window with a beam of light, pegboard tools, a lamp
export function shop(ctx, t, cam, L, o = {}) {
  const C = WOOD(L), door = o.door ?? [1240, 210, 520, 690];
  K.stage(ctx, cam, [
    [9000, () => { K.sky(ctx, t, L, { horizon: 640, clouds: 3, seed: 11 }); K.hills(ctx, 640, 40, null, 3, { grad: [K.hz(L.leafS, 9000, L), K.hz(L.leaf, 7000, L)] }); for (let i = 0; i < 4; i++) K.house(ctx, 1150 + i * 190, 720, 170, 150, L, { col: K.hz(['#d8b98a', '#c9a0a0', '#b7c0a0', '#d1b090'][i], 7000, L), t }); K.band(ctx, 715, 1300, mixHex(L.walk, L.haze, .2), L.walk); for (const x of [1300, 1650]) K.tree(ctx, t, x, 760, .6, L, { apples: 8 }); }],
    [4200, () => {
      ctx.fillStyle = lin(ctx, 0, -200, 0, 1000, [[0, C.wallS], [1, C.wall]]); ctx.beginPath(); ctx.rect(-1400, -900, W + 2800, 1900); ctx.rect(door[0], door[1], door[2], door[3]); ctx.fill('evenodd');
      ctx.strokeStyle = rgba(C.dark, .25); ctx.lineWidth = 3; for (let x = -1400; x < W + 1400; x += 64) { if (x > door[0] && x < door[0] + door[2]) continue; ctx.beginPath(); ctx.moveTo(x, -900); ctx.lineTo(x, 1000); ctx.stroke(); }
      ctx.fillStyle = C.dark; ctx.fillRect(door[0] - 26, door[1] - 26, door[2] + 52, 26); ctx.fillRect(door[0] - 26, door[1], 26, door[3]); ctx.fillRect(door[0] + door[2], door[1], 26, door[3]);
      const wx = o.winX ?? 140; ctx.fillStyle = lin(ctx, 0, 160, 0, 420, [[0, L.top], [1, L.low]]); ctx.fillRect(wx, 160, 300, 240); ctx.fillStyle = C.dark; ctx.fillRect(wx + 144, 160, 12, 240); ctx.fillRect(wx, 274, 300, 12);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, wx, 400, wx + 700, 1000, [[0, rgba(L.light, .22)], [1, rgba(L.light, 0)]]); ctx.beginPath(); ctx.moveTo(wx, 400); ctx.lineTo(wx + 300, 400); ctx.lineTo(wx + 1000, 1000); ctx.lineTo(wx + 380, 1000); ctx.fill(); ctx.restore();
      ctx.fillStyle = mixHex(C.plank, L.light, .1); ctx.fillRect(560, 230, 520, 300); ctx.fillStyle = C.dark;
      for (let i = 0; i < 7; i++) { const x = 600 + i * 68; if (i % 3 === 0) { ctx.fillRect(x, 260, 10, 140); ctx.fillRect(x - 14, 260, 38, 30); } else if (i % 3 === 1) { ctx.beginPath(); ctx.arc(x + 5, 300, 26, 0, 7); ctx.lineWidth = 8; ctx.strokeStyle = C.dark; ctx.stroke(); } else { ctx.fillRect(x, 270, 14, 180); } }
      ctx.fillStyle = C.floor; ctx.fillRect(-1400, 900, W + 2800, 700);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, 900, 0, 1200, [[0, rgba(L.light, .35)], [1, rgba(L.light, 0)]]); ctx.beginPath(); ctx.moveTo(door[0], 900); ctx.lineTo(door[0] + door[2], 900); ctx.lineTo(door[0] + door[2] + 260, 1300); ctx.lineTo(door[0] - 160, 1300); ctx.fill(); ctx.restore();
      if (o.back) o.back(ctx, t);
    }],
    [2500, () => { if (o.mid) o.mid(ctx, t); }],
    [1700, () => { if (o.focus) o.focus(ctx, t); }],
    [1100, () => {
      if (o.fore === false) return; const sw = Math.sin(t * .8) * 6, lx = o.lampX ?? 420;
      ctx.strokeStyle = C.dark; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx, -200); ctx.lineTo(lx + sw, 90); ctx.stroke();
      ctx.fillStyle = mixHex('#2e4a8a', L.shade, .3); ctx.beginPath(); ctx.moveTo(lx + sw - 70, 160); ctx.lineTo(lx + sw - 30, 90); ctx.lineTo(lx + sw + 30, 90); ctx.lineTo(lx + sw + 70, 160); ctx.fill();
      ctx.fillStyle = rad(ctx, lx + sw, 170, 120, [[0, rgba('#fff2c4', .6)], [1, rgba('#fff2c4', 0)]]); ctx.fillRect(lx + sw - 120, 60, 240, 240);
      ctx.fillStyle = mixHex(C.dark, '#0c1438', .3); ctx.fillRect(o.postX ?? -120, -400, 120, 1800);
    }],
  ]);
  return door;
}
// a wooden hull on trestles (side view), planed: u = how far the plane has gone; returns the keel curve points
export function hull(ctx, t, x, y, w, L, o = {}) {
  const h = w * .22, C = WOOD(L);
  ctx.fillStyle = C.dark; for (const tx of [x + w * .18, x + w * .78]) { ctx.beginPath(); ctx.moveTo(tx - 40, y + 160); ctx.lineTo(tx - 10, y + 10); ctx.lineTo(tx + 10, y + 10); ctx.lineTo(tx + 40, y + 160); ctx.fill(); ctx.fillRect(tx - 60, y, 120, 16); }
  const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([x + u * w, y - h * .1 + Math.sin(Math.PI * u) * h * .9 - (u < .15 ? (1 - u / .15) * h * .3 : 0)]); }
  ctx.fillStyle = lin(ctx, 0, y - h * .3, 0, y + h, [[0, mixHex('#d49a5e', L.light, .15)], [.5, '#a0663a'], [1, '#5a3220']]); ctx.beginPath(); ctx.moveTo(x - 10, y - h * .45); pts.forEach((p) => ctx.lineTo(...p)); ctx.lineTo(x + w + 10, y - h * .25); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#5a3018', .45); ctx.lineWidth = 2; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(x, y - h * .45 + k * h * .18); for (const [px, py] of pts) ctx.lineTo(px, lerp(y - h * .45 + k * h * .18, py, k / 5)); ctx.stroke(); }
  ctx.fillStyle = rgba('#fff3d0', .35); ctx.fillRect(x + w * .1, y - h * .45, w * .8 * (o.planed ?? 1), 6);
  return pts;
}
// curling wood shavings springing off a point (deterministic particles)
export function shavings(ctx, t, x, y, n = 10) {
  const r = prng(31);
  for (let i = 0; i < n; i++) { const ph = ((t * .9 + r()) % 1), a = -1.2 - r() * 1.2, d = 40 + ph * 160, px = x + Math.cos(a) * d * .6 - ph * 30, py = y + Math.sin(a) * d * .4 + ph * ph * 220;
    if (py > y + 260) continue; ctx.strokeStyle = rgba('#f4d29a', .9 * (1 - ph)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px, py, 7 + r() * 6, ph * 9, ph * 9 + 4); ctx.stroke(); }
}
// an old motorbike, side view; returns the rear wheel [x, y, r]
export function motorbike(ctx, t, x, y, s, L, o = {}) {
  const r = 70 * s, spin = t * (o.spin ?? 0), C = WOOD(L);
  ctx.fillStyle = C.dark; ctx.fillRect(x - 90 * s, y - 40 * s, 20 * s, 40 * s); ctx.fillRect(x + 70 * s, y - 40 * s, 20 * s, 40 * s);
  for (const wx of [x - 150 * s, x + 160 * s]) { ctx.strokeStyle = '#1c1830'; ctx.lineWidth = 18 * s; ctx.beginPath(); ctx.arc(wx, y - r - 30 * s, r, 0, 7); ctx.stroke(); ctx.strokeStyle = rgba('#d8d8e8', .6); ctx.lineWidth = 2; for (let k = 0; k < 8; k++) { const a = spin + k / 8 * 6.283; ctx.beginPath(); ctx.moveTo(wx, y - r - 30 * s); ctx.lineTo(wx + Math.cos(a) * r * .9, y - r - 30 * s + Math.sin(a) * r * .9); ctx.stroke(); } }
  const by = y - r - 30 * s;
  ctx.fillStyle = '#2c2a40'; ctx.beginPath(); ctx.moveTo(x - 150 * s, by); ctx.lineTo(x - 20 * s, by - 90 * s); ctx.lineTo(x + 110 * s, by - 100 * s); ctx.lineTo(x + 160 * s, by); ctx.lineTo(x + 150 * s, by + 8 * s); ctx.lineTo(x - 20 * s, by - 70 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, by - 150 * s, 0, by - 90 * s, [[0, '#e0503c'], [1, '#8a2a24']]); ctx.beginPath(); ctx.ellipse(x + 40 * s, by - 112 * s, 80 * s, 30 * s, -.05, 0, 7); ctx.fill();
  ctx.fillStyle = rgba('#ffd9c0', .5); ctx.beginPath(); ctx.ellipse(x + 30 * s, by - 124 * s, 40 * s, 8 * s, -.05, 0, 7); ctx.fill();
  ctx.fillStyle = '#1c1830'; ctx.fillRect(x - 110 * s, by - 112 * s, 100 * s, 18 * s);
  ctx.fillStyle = mixHex('#9aa0b8', L.light, .2); ctx.fillRect(x - 10 * s, by - 70 * s, 90 * s, 60 * s); for (let k = 0; k < 4; k++) { ctx.fillStyle = mixHex('#5a6080', L.shade, .2); ctx.fillRect(x - 5 * s, by - 64 * s + k * 14 * s, 80 * s, 5 * s); }
  ctx.strokeStyle = '#2c2a40'; ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.moveTo(x + 160 * s, by); ctx.lineTo(x + 120 * s, by - 150 * s); ctx.lineTo(x + 80 * s, by - 170 * s); ctx.stroke();
  ctx.fillStyle = '#fff2c4'; ctx.beginPath(); ctx.arc(x + 140 * s, by - 120 * s, 12 * s, 0, 7); ctx.fill();
  return [x - 150 * s, by, r];
}
// the kerb close-up: the camera low on the road, looking at the kerb; your shoes at its edge (o.step 0..1 = one foot steps down toward us)
export function kerb(ctx, t, cam, L, o = {}) {
  K.stage(ctx, cam, [
    [14000, () => { K.sky(ctx, t, L, { horizon: 520, clouds: 3, seed: 4 }); K.hills(ctx, 520, 30, null, 2, { grad: [K.hz(L.leafS, 14000, L), K.hz(L.leaf, 9000, L)] }); }],
    [6000, () => { for (let i = -2; i < 8; i++) K.house(ctx, -200 + i * 330, 600, 300, 250 + (i % 2) * 40, L, { col: K.hz(['#d8b98a', '#c9a0a0', '#b7c0a0', '#d1b090'][(i + 4) % 4], 6000, L), t, side: i < 3 ? 1 : -1 }); K.band(ctx, 598, 1400, mixHex(L.walk, L.haze, .25), L.walk); }],
    [3400, () => { for (const x of [-200, 640, 1500, 2200]) K.tree(ctx, t, x, 700, .95, L, { apples: 14 }); if (o.kids) for (let i = 0; i < 2; i++) K.folk(ctx, t, i + 2, 1100 + i * 150 + 40 * Math.sin(t * .7 + i), 700, 170, { walk: K.walkPh(t, .5) + i * 2, dir: i ? -1 : 1 }); }],
    [2400, () => { ctx.fillStyle = lin(ctx, 0, 690, 0, 830, [[0, mixHex(L.walk, L.haze, .15)], [1, mixHex(L.walk, L.light, .25)]]); ctx.fillRect(-1600, 690, W + 3200, 800);
      ctx.strokeStyle = rgba(L.ink, .12); ctx.lineWidth = 2; for (let x = -1600; x < W + 1600; x += 150) { ctx.beginPath(); ctx.moveTo(x, 690); ctx.lineTo(x + (x - 960) * .25, 830); ctx.stroke(); } for (const y of [730, 775]) { ctx.beginPath(); ctx.moveTo(-1600, y); ctx.lineTo(W + 1600, y); ctx.stroke(); } }],
    [1700, () => {
      ctx.fillStyle = lin(ctx, 0, 800, 0, 900, [[0, mixHex('#e2dccb', L.light, .35)], [1, mixHex('#8a8aa0', L.shade, .35)]]); ctx.fillRect(-1600, 800, W + 3200, 92);
      ctx.fillStyle = rgba('#fffaf0', .55); ctx.fillRect(-1600, 798, W + 3200, 5);
      ctx.fillStyle = lin(ctx, 0, 890, 0, 1200, [[0, mixHex(L.road, L.shade, .35)], [1, L.road]]); ctx.fillRect(-1600, 890, W + 3200, 800);
      ctx.fillStyle = rgba(L.ink, .25); ctx.fillRect(-1600, 890, W + 3200, 14);
      if (o.ghost) o.ghost(ctx, t);
      const st = o.step ?? 0, sx = o.shoeX ?? 900, sw = Math.sin(t * 1.3) * 3;
      ctx.save(); ctx.translate(sx, 800); ctx.scale(1.9, 1.9); ctx.translate(-sx, -800);   // close on the legs
      ctx.fillStyle = lin(ctx, sx - 180, 0, sx + 200, 0, [[0, K.COAT.shade], [.55, K.COAT.base], [1, K.COAT.lit]]);
      ctx.beginPath(); ctx.moveTo(sx - 150, -400); ctx.lineTo(sx + 170, -400); ctx.lineTo(sx + 190 + sw, 500); ctx.quadraticCurveTo(sx + 20, 535 + sw, sx - 170 + sw, 502); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(K.COAT.deep, .35); ctx.beginPath(); ctx.moveTo(sx - 20, -400); ctx.quadraticCurveTo(sx - 40, 200, sx - 70 + sw, 518); ctx.lineTo(sx - 40 + sw, 522); ctx.quadraticCurveTo(sx - 10, 200, sx, -400); ctx.fill();
      for (const [dx, lift] of [[-70, 0], [80, st]]) {
        const e = K.sineIO(lift), fx = sx + dx + e * 30, fy = lerp(800, 880, e) - Math.sin(Math.PI * lift) * 50, k = 1 + .18 * e;
        ctx.fillStyle = lin(ctx, fx - 40, 0, fx + 40, 0, [[0, '#1c2550'], [1, '#33417a']]); ctx.beginPath(); ctx.moveTo(fx - 44, 490); ctx.lineTo(fx + 42, 490); ctx.lineTo(fx + 34 * k, fy - 30 * k); ctx.lineTo(fx - 36 * k, fy - 30 * k); ctx.fill();
        ctx.fillStyle = '#1a1830'; ctx.beginPath(); ctx.ellipse(fx, fy - 18 * k, 54 * k, 26 * k, 0, 0, 7); ctx.fill(); ctx.fillRect(fx - 50 * k, fy - 18 * k, 100 * k, 18 * k);
        ctx.fillStyle = rgba('#fffaf0', .3); ctx.beginPath(); ctx.ellipse(fx - 10, fy - 34 * k, 26 * k, 7 * k, 0, 0, 7); ctx.fill();
        ctx.fillStyle = rgba(L.ink, .3); ctx.beginPath(); ctx.ellipse(fx, fy + 2, 60 * k, 8, 0, 0, 7); ctx.fill();
      }
      ctx.restore();
      if (o.focus) o.focus(ctx, t);
    }],
  ]);
}
// the street from above (2.5D aerial): road down the middle, five front doors on each side, bays → beds (o.beds 0..1), a pod serving doors
export const AER = { doors: [[520, 190], [520, 400], [520, 610], [520, 820], [1400, 300], [1400, 510], [1400, 720]] };
export function aerial(ctx, t, cam, L, o = {}) {
  K.stage(ctx, cam, [
    [6000, () => { ctx.fillStyle = mixHex(L.grass, L.haze, .3); ctx.fillRect(-2000, -1600, W + 4000, H + 3200); }],
    [3600, () => {
      ctx.fillStyle = mixHex(L.grass, L.light, .1); ctx.fillRect(-1600, -1200, W + 3200, H + 2400);
      ctx.fillStyle = L.walk; ctx.fillRect(700, -1200, 520, H + 2400); ctx.fillStyle = L.road; ctx.fillRect(780, -1200, 360, H + 2400);
      ctx.strokeStyle = rgba('#fffaf0', .5); ctx.setLineDash([30, 30]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(960, -1200); ctx.lineTo(960, H + 1200); ctx.stroke(); ctx.setLineDash([]);
      for (const side of [-1, 1]) for (let i = -3; i < 9; i++) { const y = i * 160 + 40, x = side < 0 ? 790 : 1060; const b = o.beds ?? 0, u = clamp(b * 1.6 - ((i + 3) / 12) * .6);
        ctx.fillStyle = mixHex('#8b8aa0', '#7a5a3e', u); ctx.fillRect(x, y, 70, 130); if (u > .2) { for (let k = 0; k < 2; k++) K.tree(ctx, t, x + 35, y + 50 + k * 60, .16 * u, L, { apples: 3 }); }
        if (o.cars) K.inkCar(ctx, x + 35, y + 70, .28, o.cars, '#2c4a9a'); }
      for (let i = -2; i < 7; i++) for (const side of [-1, 1]) { const x = side < 0 ? 380 : 1240, y = i * 210 + 80, rr = prng(i * 7 + side + 20);
        ctx.fillStyle = mixHex(L.grass, L.leaf, .3); ctx.fillRect(x - 40, y - 20, 380, 210);   // garden
        for (let k = 0; k < 2; k++) { const tx = side < 0 ? x - 10 + rr() * 40 : x + 300 + rr() * 30, ty = y + 20 + rr() * 140; ctx.fillStyle = rgba(L.ink, .25); ctx.beginPath(); ctx.arc(tx + 8, ty + 8, 30, 0, 7); ctx.fill(); ctx.fillStyle = K.rad(ctx, tx - 8, ty - 8, 40, [[0, mixHex(L.leaf, L.light, .35)], [1, L.leafS]]); ctx.beginPath(); ctx.arc(tx, ty, 30, 0, 7); ctx.fill(); }
        ctx.fillStyle = rgba(L.ink, .3); ctx.fillRect(x + 18, y + 18, 300, 150);   // shadow
        ctx.fillStyle = mixHex(L.roof, L.light, .25); ctx.fillRect(x, y, 300, 75); ctx.fillStyle = L.roofS; ctx.fillRect(x, y + 75, 300, 75);   // gable roof from above
        ctx.strokeStyle = rgba('#fff2dc', .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 75); ctx.lineTo(x + 300, y + 75); ctx.stroke();
        ctx.fillStyle = rgba('#3c5fb0', o.solar ?? 0); ctx.fillRect(x + 30, y + 10, 180, 58);
        ctx.fillStyle = mixHex('#7a4a3a', L.shade, .2); ctx.fillRect(x + 230, y + 30, 24, 24);
        ctx.fillStyle = L.walk; ctx.fillRect(side < 0 ? x + 300 : x - 60, y + 66, 60, 18);   // path to the door
        if (i === 1 && side < 0) { ctx.fillStyle = '#f2b632'; ctx.fillRect(x + 296, y + 60, 12, 30); } }
    }],
    [1700, () => { if (o.focus) o.focus(ctx, t); }],
  ]);
}
// the town square: the clock tower (noon bell), a fountain, tall houses with an arcade, a market stall, lanterns.
// o: tags (price tag turned away, 0..1), bell (0..1 swing), chime (0..1 rings from every window), tables (evening), lanterns, people (count), focus(ctx,t)
export const TOWER = { x: 960, face: [960, 250, 62] };
export function square(ctx, t, cam, L, o = {}) {
  const out = {};
  K.stage(ctx, cam, [
    [30000, () => K.sky(ctx, t, L, { horizon: 560, clouds: 4, seed: 12, sunAt: o.sunAt })],
    [9000, () => { K.hills(ctx, 600, 50, null, 9, { grad: [K.hz(L.leafS, 9000, L), K.hz(L.leaf, 7000, L)] }); if (o.fusion) { const c = K.hz('#c9cfe6', 9000, L); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(1620, 590, 90, 56, 0, Math.PI, 0); ctx.fill(); K.ring(ctx, t, 1620, 560, 36, o.fusion); } }],
    [5200, () => {
      const cols = ['#d8b98a', '#c9a0a0', '#e2c79a', '#b7c0a0', '#d1b090', '#cfa77e', '#c4b0c8'];
      for (let i = 0; i < 8; i++) { const x = -260 + i * 300 + (i >= 4 ? 140 : 0), hh = 330 + (i % 3) * 50; if (Math.abs(x + 130 - 960) < 200) continue;
        const g = K.house(ctx, x, 700, 260, hh, L, { col: cols[i % cols.length], rows: 3, cols: 2, lit: o.friends ? 0 : (o.lit ?? L.night), roofH: 90, door: false, t });
        (out.wins ||= []).push(...g.win);
        if (o.chime) { const [wx, wy, ww, wh] = g.win[1]; K.ring(ctx, t + i, wx + ww / 2, wy + wh / 2, 16 + 8 * o.chime, o.chime); } }
      // the clock tower
      const tx = TOWER.x; ctx.fillStyle = lin(ctx, tx - 90, 0, tx + 90, 0, [[0, mixHex('#d8c4a0', L.light, .3)], [1, mixHex('#9a8a7a', L.shade, .4)]]); ctx.fillRect(tx - 90, 160, 180, 540);
      ctx.fillStyle = lin(ctx, 0, 30, 0, 170, [[0, mixHex(L.roof, L.light, .2)], [1, L.roofS]]); ctx.beginPath(); ctx.moveTo(tx - 110, 170); ctx.lineTo(tx, 20); ctx.lineTo(tx + 110, 170); ctx.fill();
      ctx.fillStyle = mixHex('#2a2a48', L.shade, .2); ctx.fillRect(tx - 50, 110, 100, 60); const sw = (o.bell ?? 0) * Math.sin(t * 5) * .5;
      ctx.save(); ctx.translate(tx, 116); ctx.rotate(sw); ctx.fillStyle = lin(ctx, -26, 0, 26, 0, [[0, '#8a5a24'], [.5, '#ffe2a0'], [1, '#8a5a24']]); ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.quadraticCurveTo(20, 20, 26, 46); ctx.lineTo(-26, 46); ctx.quadraticCurveTo(-20, 20, -8, 0); ctx.fill(); ctx.restore();
      const [fx, fy, fr] = TOWER.face; ctx.fillStyle = '#fbf4e0'; ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 7); ctx.fill(); ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 5; ctx.stroke();
      const hh = o.clock ?? (((hourOf(L)) % 12) / 12) * 6.283 - 1.5708, mm = o.minute ?? -1.5708 + ((L.h % 1) * 6.283);
      ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(hh) * fr * .5, fy + Math.sin(hh) * fr * .5); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(mm) * fr * .8, fy + Math.sin(mm) * fr * .8); ctx.stroke();
      ctx.fillStyle = mixHex('#2e4a8a', L.shade, .3); ctx.beginPath(); ctx.moveTo(tx - 40, 700); ctx.lineTo(tx - 40, 590); ctx.arc(tx, 590, 40, Math.PI, 0); ctx.lineTo(tx + 40, 700); ctx.fill();
      if (o.bell) { const p = (t * 1.2) % 1; ctx.strokeStyle = rgba('#fff3c4', (1 - p) * o.bell); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(tx, 140, 60 + p * 260, 0, 7); ctx.stroke(); }
      K.band(ctx, 698, 1400, mixHex('#cbb99a', L.light, .2), mixHex('#b9a688', L.shade, .2));
      K.chill(ctx, L, o.chill ?? 1); if (o.friends) K.friendWindows(ctx, t, (out.wins || []).filter((w, i) => (i * 7) % 5 !== 0), o.friends);
    }],
    [3000, () => { // side buildings with an arcade (left) and the market stall (right)
      ctx.fillStyle = lin(ctx, -400, 0, 300, 0, [[0, mixHex('#c9a07a', L.shade, .35)], [1, mixHex('#e0c095', L.light, .2)]]); ctx.beginPath(); ctx.moveTo(-600, -200); ctx.lineTo(260, 120); ctx.lineTo(260, 770); ctx.lineTo(-600, 1000); ctx.fill();
      ctx.fillStyle = mixHex('#3a2a40', L.shade, .3); for (let k = 0; k < 3; k++) { const x0 = -400 + k * 220, x1 = x0 + 150, y0 = lerp(980, 770, (x0 + 600) / 860), y1 = lerp(980, 770, (x1 + 600) / 860); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 - 220 + k * 30); ctx.quadraticCurveTo((x0 + x1) / 2, y0 - 300 + k * 30, x1, y1 - 210 + k * 30); ctx.lineTo(x1, y1); ctx.fill(); }
      // the stall
      const sx = 1380, sy = 800; ctx.fillStyle = mixHex('#7a5030', L.shade, .2); ctx.fillRect(sx, sy - 220, 12, 220); ctx.fillRect(sx + 380, sy - 220, 12, 220); ctx.fillRect(sx, sy - 90, 392, 70);
      for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? '#f4efe0' : '#c8473a'; ctx.beginPath(); ctx.moveTo(sx - 20 + k * 72, sy - 230); ctx.lineTo(sx + 52 + k * 72, sy - 230); ctx.lineTo(sx + 52 + k * 72, sy - 190); ctx.quadraticCurveTo(sx + 16 + k * 72, sy - 170, sx - 20 + k * 72, sy - 190); ctx.fill(); }
      if (o.shut) { ctx.fillStyle = mixHex('#6a6a8a', L.shade, .3); ctx.fillRect(sx + 6, sy - 190, 380, 170); ctx.strokeStyle = rgba('#000', .25); ctx.lineWidth = 2; for (let y = sy - 180; y < sy - 20; y += 14) { ctx.beginPath(); ctx.moveTo(sx + 6, y); ctx.lineTo(sx + 386, y); ctx.stroke(); } }   // film 79: the stall is shuttered
      else for (let k = 0; k < 9; k++) { ctx.fillStyle = ['#f0a23a', '#e2553f', '#5f8f4a'][k % 3]; ctx.beginPath(); ctx.arc(sx + 40 + k * 40, sy - 100, 16, 0, 7); ctx.fill(); }
      out.tag = [sx + 200, sy - 170];
      if (o.tags) { const sw = Math.sin(t * 1.3) * .2; ctx.save(); ctx.translate(sx + 200, sy - 170); ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 40); ctx.stroke(); ctx.translate(0, 40); ctx.rotate(sw); ctx.scale(o.tagTurn ?? .25 + .15 * Math.sin(t * .8), 1); ctx.globalAlpha = o.tags;
        ctx.fillStyle = mixHex(K.PAPER.body, L.shade, .15); ctx.beginPath(); ctx.moveTo(-40, 14); ctx.lineTo(0, -6); ctx.lineTo(40, 14); ctx.lineTo(40, 120); ctx.lineTo(-40, 120); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.arc(0, 12, 6, 0, 7); ctx.fill();
        if (o.tagText) { ctx.fillStyle = K.PAPER.ink; ctx.font = '800 26px Inter'; ctx.textAlign = 'center'; ctx.fillText(o.tagText, 0, 76); } ctx.restore(); }
      K.chill(ctx, L, o.chill ?? 1);
    }],
    [2200, () => { // the floor with cobbles and the fountain
      ctx.fillStyle = rgba(L.ink, .08); const r = prng(5); for (let k = 0; k < 160; k++) { const x = r() * 2400 - 240, y = 760 + r() * 400; ctx.beginPath(); ctx.ellipse(x, y, 14 + (y - 760) * .08, 5 + (y - 760) * .03, 0, 0, 7); ctx.fill(); }
      const fx = 960, fy = 880; ctx.fillStyle = mixHex('#d8c7a4', L.light, .25); ctx.beginPath(); ctx.ellipse(fx, fy, 260, 60, 0, 0, 7); ctx.fill(); ctx.fillStyle = o.dry ? mixHex('#3a3c5a', L.shade, .3) : lin(ctx, 0, fy - 40, 0, fy + 30, [[0, mixHex('#6ab0d8', L.light, .3)], [1, '#3a6aa0']]); ctx.beginPath(); ctx.ellipse(fx, fy - 6, 230, 46, 0, 0, 7); ctx.fill();
      ctx.fillStyle = mixHex('#c9b48e', L.shade, .2); ctx.fillRect(fx - 14, fy - 150, 28, 150); ctx.beginPath(); ctx.ellipse(fx, fy - 150, 80, 18, 0, 0, 7); ctx.fill();
      if (!o.dry) for (let k = 0; k < 14; k++) { const ph = (t * .9 + k / 14) % 1, a = k / 14 * 6.283, x = fx + Math.cos(a) * 70 * ph, y = fy - 160 - Math.sin(Math.PI * ph) * 60 + ph * 120; ctx.fillStyle = rgba('#dff4ff', .8 * (1 - ph)); ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }
      out.fountain = [fx, fy];
      if (o.benches) for (const [x, y, s2] of [[330, 1010, 1], [1590, 1010, 1]]) { ctx.fillStyle = mixHex('#5a4a5a', L.shade, .2); ctx.fillRect(x - 110 * s2, y - 52, 220 * s2, 14); ctx.fillRect(x - 110 * s2, y - 92, 220 * s2, 10); ctx.fillRect(x - 96, y - 52, 8, 52); ctx.fillRect(x + 88, y - 52, 8, 52); }   // film 79: empty benches
      K.chill(ctx, L, o.chill ?? 1);
      if (o.tables) for (let k = 0; k < 4; k++) { const x = 360 + k * 380, y = 960; ctx.fillStyle = mixHex('#f4efe0', L.light, .1); ctx.beginPath(); ctx.ellipse(x, y - 60, 90, 18, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#4a3428'; ctx.fillRect(x - 5, y - 60, 10, 60); ctx.fillStyle = '#fff2c4'; ctx.beginPath(); ctx.arc(x, y - 74, 6, 0, 7); ctx.fill(); }
    }],
    [2000, () => {
      const n = o.people ?? 6; for (let i = 0; i < n; i++) { const x = ((i * 330 + t * (i % 2 ? 14 : -10)) % 2300 + 2300) % 2300 - 200; K.folk(ctx, t, i, x, 960 + (i % 3) * 24, 250, { walk: o.still ? undefined : K.walkPh(t, .4) + i, dir: i % 2 ? 1 : -1, pose: o.still ? (i % 3 ? 'look' : 'stand') : undefined, look: o.still ? .8 : .1 }); }
      if (o.focus) o.focus(ctx, t);
    }],
    [1150, () => { if (o.lanterns) { const a = o.lanterns; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba('#1a1a3a', .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-200, 120); ctx.quadraticCurveTo(960, 330, 2100, 100); ctx.stroke();
      for (let i = 1; i < 16; i++) { const u = i / 16, x = lerp(-200, 2100, u), y = 120 + (1 - Math.pow(2 * u - 1, 2)) * 200 * .5 + 10 + Math.sin(t * 1.3 + i) * 3, fl = .85 + .15 * Math.sin(t * 7 + i * 2.1);
        ctx.fillStyle = rad(ctx, x, y, 70, [[0, rgba('#ffd98a', .5 * fl)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(x - 70, y - 70, 140, 140); ctx.fillStyle = '#fff0c0'; ctx.beginPath(); ctx.arc(x, y + 8, 10, 0, 7); ctx.fill(); } ctx.restore(); } }],
  ]);
  return out;
}
const hourOf = (L) => L.h;

// =====================================================================================================================================
// FILM 79 places (text-independent world; each takes (ctx, t, cam, L, o), draws back → front, returns anchors for carriers)
// =====================================================================================================================================
const NIGHT = (L) => ({ ground: mixHex('#141a46', L.light, .08), groundS: mixHex('#080c2a', L.shade, .2) });
// THE FENCE AND THE TOWER (thumbnail A): the fence runs diagonally from the left into the depth, the tower stands behind it, huge;
// you are tiny at the fence. o.you [x,y,h], o.wake (anticipation flicker of the band), o.land (halls behind), o.rise (0..1 the band brightens)
export function towerPlace(ctx, t, cam, L, o = {}) {
  const out = {};
  K.stage(ctx, cam, [
    [40000, () => { K.sky(ctx, t, L, { horizon: 760, sun: false, clouds: 2, seed: 21 }); E_stars(ctx, t, L); }],
    [14000, () => { K.hills(ctx, 760, 50, null, 5, { grad: [K.hz(L.leafS, 14000, L), K.hz(mixHex(L.leafS, L.shade, .4), 9000, L)] }); if (o.land !== 0) S.machineLand(ctx, t, -400, 2300, 752, L, o.land ?? 1, { seed: 9 }); }],
    [6000, () => { out.tower = S.tower(ctx, t, 1260, 800, 380, 700, L, { wake: o.wake, glow: 1.4 + (o.rise ?? 0) }); }],
    [3000, () => {   // the fence in perspective: near on the left, receding to the right
      ctx.fillStyle = lin(ctx, 0, 760, 0, 1300, [[0, NIGHT(L).ground], [1, NIGHT(L).groundS]]); ctx.fillRect(-1600, 790, W + 3200, 900);
      const bar = mixHex('#0b1032', L.shade, .2), lit = mixHex('#2a3270', L.light, .1);
      for (let k = 0; k < 60; k++) { const u = k / 59, x = lerp(-400, 2200, Math.pow(u, .8)), top = lerp(260, 610, u), base = lerp(1120, 830, u), w = lerp(22, 5, u);
        ctx.fillStyle = k % 8 === 0 ? lit : bar; ctx.fillRect(x, top, w, base - top); }
      ctx.strokeStyle = bar; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-400, 300); ctx.lineTo(2200, 640); ctx.moveTo(-400, 1080); ctx.lineTo(2200, 812); ctx.stroke();
      K.carmGlow(ctx, 1300, 760, 900, .08);
    }],
    [1700, () => { if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2], { dir: 1, look: -.9 + .08 * Math.sin(t * .5), back: .85, pose: o.youPose }); if (o.focus) o.focus(ctx, t, out); }],
  ]);
  return out;
}
function E_stars(ctx, t, L) { if (L.night > .05) K.stars(ctx, 63, 120, t, [-800, -400, W + 1600, 900], Math.min(1, L.night + .2)); }
// NOON: the phone lights up on the kitchen table, and through the window every house across the road chimes at the same moment.
// o.u (0..1 the notification slides in), o.chime (0..1 points in every window), o.text (the line on the phone; default the allowance)
export function phoneNoon(ctx, t, cam, L, o = {}) {
  const out = {};
  K.stage(ctx, cam, [
    [6000, () => {   // the street across through a wide window
      ctx.fillStyle = mixHex('#2a2c58', L.shade, .3); ctx.fillRect(-1600, -1200, W + 3200, H + 2400);
      ctx.save(); ctx.beginPath(); ctx.rect(120, 80, 1680, 620); ctx.clip();
      ctx.fillStyle = lin(ctx, 0, 80, 0, 700, [[0, L.top], [1, L.low]]); ctx.fillRect(120, 80, 1680, 620);
      S.tower(ctx, t, 1500, 560, 120, 420, L);
      const wins = []; for (let i = 0; i < 6; i++) { const g = K.house(ctx, 160 + i * 290, 690, 250, 300, L, { col: ['#9a8aa0', '#8a8aa6', '#a2928a', '#8e98a0'][i % 4], lit: 0, t, roofH: 80 }); wins.push(g.win[1]); }
      if (o.chime) wins.forEach(([x, y, w, h], i) => { const d = clamp(o.chime * 1.6 - (i % 4) * .03); if (d > 0) { K.carmGlow(ctx, x + w / 2, y + h / 2, 60, .35 * d); ctx.fillStyle = rgba(K.CARM.core, .9 * d); ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, 5, 0, 7); ctx.fill(); K.ring(ctx, t + i, x + w / 2, y + h / 2, 14 + 10 * d, d * .8); } });
      ctx.restore();
      ctx.fillStyle = mixHex('#c8c6d6', L.light, .1); for (const [a, b, c, d] of [[100, 60, 1720, 22], [100, 696, 1720, 26], [100, 60, 22, 660], [1798, 60, 22, 660], [948, 70, 16, 630]]) ctx.fillRect(a, b, c, d);
    }],
    [2400, () => {   // the table
      ctx.fillStyle = lin(ctx, 0, 820, 0, 1200, [[0, mixHex('#5a4652', L.light, .15)], [1, mixHex('#2a2236', L.shade, .3)]]); ctx.beginPath(); ctx.moveTo(-600, 1300); ctx.lineTo(300, 820); ctx.lineTo(1700, 820); ctx.lineTo(2500, 1300); ctx.fill();
      ctx.fillStyle = rgba('#e8eefc', .1); ctx.fillRect(300, 820, 1400, 3);
      ctx.fillStyle = mixHex('#d8d6e2', L.light, .2); ctx.beginPath(); ctx.ellipse(560, 900, 90, 22, 0, 0, 7); ctx.fill(); ctx.fillStyle = mixHex('#8a8aa6', L.shade, .2); ctx.fillRect(520, 820, 80, 70);   // a cup
    }],
    [1500, () => {   // the phone, flat on the table, tilted toward you
      const px = 1180, py = 960, pw = 300, ph = 520, rot = -.18 + .01 * Math.sin(t * .4);
      ctx.save(); ctx.translate(px, py); ctx.rotate(rot); ctx.transform(1, 0, -.35, .55, 0, 0);
      ctx.fillStyle = '#05061a'; ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 36); ctx.fill();
      const lit = clamp(o.u ?? 0);
      ctx.fillStyle = lin(ctx, 0, -ph / 2, 0, ph / 2, [[0, mixHex('#0b0d2a', '#3a1630', lit)], [1, mixHex('#060716', '#1a0a20', lit)]]); ctx.beginPath(); ctx.roundRect(-pw / 2 + 12, -ph / 2 + 12, pw - 24, ph - 24, 26); ctx.fill();
      if (lit > 0) { ctx.globalAlpha = lit; ctx.fillStyle = '#f4f0f8'; ctx.font = '600 64px Inter'; ctx.textAlign = 'center'; ctx.fillText('12:00', 0, -ph * .26);
        const ny = lerp(-ph * .05 - 60, -ph * .05, K.expoOut(lit)); ctx.fillStyle = rgba('#f4f0f8', .94); ctx.beginPath(); ctx.roundRect(-pw / 2 + 26, ny, pw - 52, 120, 18); ctx.fill();
        ctx.fillStyle = K.CARM.body; ctx.beginPath(); ctx.arc(-pw / 2 + 56, ny + 34, 12, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1a3a'; ctx.textAlign = 'left'; ctx.font = '600 18px Inter';
        (o.text || ['YOUR MONTHLY', 'ALLOWANCE', 'HAS ARRIVED']).forEach((l, i) => ctx.fillText(l, -pw / 2 + 80, ny + 40 + i * 24)); ctx.globalAlpha = 1; }
      ctx.restore();
      if (o.u) { K.carmGlow(ctx, px, py - 40, 420, .2 * lit); }
      out.phone = [px, py];
      if (o.focus) o.focus(ctx, t, out);
    }],
  ]);
  return out;
}
// THE GRANDSON AND HIS SCREEN: dim living room, he sits on the floor lit by his own screen (the only bright thing), you in the doorway.
// o.a (screen 0..1), o.you (true), o.look (he never looks up: 0)
export function boyScreen(ctx, t, cam, L, o = {}) {
  const out = {}, R = { wall: mixHex('#3a3a62', L.light, .12), wallS: mixHex('#1a1c44', L.shade, .3), floor: mixHex('#2a2238', L.shade, .2) };
  K.stage(ctx, cam, [
    [4200, () => { ctx.fillStyle = lin(ctx, 0, -300, 0, 900, [[0, R.wallS], [1, R.wall]]); ctx.fillRect(-1600, -1200, W + 3200, 2200); ctx.fillStyle = R.floor; ctx.fillRect(-1600, 860, W + 3200, 800);
      ctx.save(); ctx.beginPath(); ctx.rect(1300, 180, 380, 420); ctx.clip(); ctx.fillStyle = lin(ctx, 0, 180, 0, 600, [[0, L.top], [1, L.low]]); ctx.fillRect(1300, 180, 380, 420); S.tower(ctx, t, 1560, 560, 50, 300, L); S.fence(ctx, t, 1300, 1680, 572, 20, L); ctx.restore();
      ctx.fillStyle = mixHex('#8a88a6', L.shade, .3); for (const [a, b, c, d] of [[1288, 168, 404, 16], [1288, 596, 404, 18], [1288, 168, 14, 446], [1678, 168, 14, 446]]) ctx.fillRect(a, b, c, d);
      // the doorway on the left, warm-dim hall light behind you
      ctx.fillStyle = mixHex('#4a3a3a', '#1a1c44', .4); ctx.fillRect(180, 200, 320, 680); ctx.fillStyle = rad(ctx, 340, 520, 420, [[0, rgba('#ffb35c', .18)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(180, 200, 320, 680); }],
    [2400, () => {   // a low sofa, the boy on the floor in front of it, the screen in his hands
      ctx.fillStyle = mixHex('#3a2e4a', L.shade, .2); ctx.beginPath(); ctx.roundRect(820, 720, 760, 170, 26); ctx.fill(); ctx.fillStyle = mixHex('#4a3c5a', L.light, .05); ctx.beginPath(); ctx.roundRect(800, 620, 800, 120, 30); ctx.fill();
      const bx = 1120, by = 990, a = o.a ?? 1;
      const hd = S.boy(ctx, t, bx, by, 300, { pose: 'hold', look: .75 + .03 * Math.sin(t * .7), dir: -1, back: .35, armL: [-.75, -2.35] });
      const sx = (hd.R[0] + hd.L[0]) / 2, sy = (hd.R[1] + hd.L[1]) / 2;
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(-.12); S.screenGlow(ctx, t, -52, -40, 104, 70, { a }); ctx.restore();
      K.carmGlow(ctx, sx, sy - 40, 460, .18 * a);
      out.screen = [sx, sy, 124, 84];
    }],
    [1600, () => { if (o.you !== false) K.you(ctx, t, 330, 1060, 600, { dir: 1, back: .55, look: .2 + .05 * Math.sin(t * .4) }); if (o.focus) o.focus(ctx, t, out); }],
  ]);
  return out;
}
// THE LOCKED SCHOOL: the old building (bell in its gable, SCHOOL in faded letters), dark windows, the gate chained and padlocked, grass in the yard,
// a bus stop sign with no bus. o.you / o.boy [x,y,h], o.chain (0..1 the chain swings), o.grass
export function school(ctx, t, cam, L, o = {}) {
  const out = {};
  K.stage(ctx, cam, [
    [40000, () => K.sky(ctx, t, L, { horizon: 700, clouds: 3, seed: 31, sunR: 30 })],
    [12000, () => { K.hills(ctx, 700, 40, null, 6, { grad: [K.hz(L.leafS, 12000, L), K.hz(L.leafS, 9000, L)] }); S.tower(ctx, t, 1700, 704, 60, 260, L); }],
    [5000, () => {
      const x = 380, base = 760, w = 1160, h = 400, wall = mixHex('#7a6a7a', L.light, .18), wallS = mixHex('#3a3456', L.shade, .4);
      ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, wall], [1, wallS]]); ctx.fillRect(x, base - h, w, h);
      ctx.fillStyle = mixHex(L.roof, L.shade, .2); ctx.beginPath(); ctx.moveTo(x - 30, base - h); ctx.lineTo(x + w / 2, base - h - 170); ctx.lineTo(x + w + 30, base - h); ctx.fill();
      const bx = x + w / 2; ctx.fillStyle = mixHex('#2a2a48', L.shade, .2); ctx.fillRect(bx - 46, base - h - 120, 92, 74);   // the bell that does not ring
      ctx.fillStyle = lin(ctx, bx - 24, 0, bx + 24, 0, [[0, '#4a3418'], [.5, '#a88a50'], [1, '#4a3418']]); ctx.beginPath(); ctx.moveTo(bx - 7, base - h - 112); ctx.lineTo(bx + 7, base - h - 112); ctx.quadraticCurveTo(bx + 18, base - h - 92, bx + 24, base - h - 66); ctx.lineTo(bx - 24, base - h - 66); ctx.quadraticCurveTo(bx - 18, base - h - 92, bx - 7, base - h - 112); ctx.fill();
      ctx.font = '600 40px Inter'; ctx.letterSpacing = '0.5em'; ctx.textAlign = 'center'; ctx.fillStyle = rgba('#e8eefc', .16); ctx.fillText('SCHOOL', bx + 20, base - h + 70); ctx.letterSpacing = '0em';
      for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { const wx = x + 70 + c * 180, wy = base - h + 120 + r * 130; ctx.fillStyle = lin(ctx, 0, wy, 0, wy + 90, [[0, '#1c2250'], [1, '#0b0f30']]); ctx.fillRect(wx, wy, 110, 90); ctx.fillStyle = rgba('#e8eefc', .06); ctx.beginPath(); ctx.moveTo(wx, wy + 90); ctx.lineTo(wx + 50, wy); ctx.lineTo(wx + 70, wy); ctx.lineTo(wx + 20, wy + 90); ctx.fill(); }
      ctx.fillStyle = mixHex('#1a1c44', L.shade, .3); ctx.fillRect(bx - 70, base - 170, 140, 170);   // the doors, shut
      K.band(ctx, base - 2, 1400, mixHex(L.grass, L.shade, .2), mixHex(L.grass, L.walk, .3));
      if (o.grass !== 0) { ctx.fillStyle = mixHex(L.leaf, L.light, .1); const r = prng(13); for (let k = 0; k < 120; k++) { const gx = x + r() * w, gy = base + 6 + r() * 120, gh = 6 + r() * 14; ctx.fillRect(gx, gy - gh, 2.5, gh); } }
      out.door = [bx - 70, base - 170, 140, 170];
    }],
    [2600, () => {   // the gate: two wings of bars, a chain and a padlock; the bus stop sign
      const gx = 960, gy = 980, base = mixHex('#0d1238', L.shade, .2);
      ctx.fillStyle = base; ctx.fillRect(-600, gy - 20, 1340, 16); ctx.fillRect(1180, gy - 20, 1400, 16); ctx.fillRect(-600, gy - 330, 1340, 12); ctx.fillRect(1180, gy - 330, 1400, 12);
      for (let x = -600; x < 2600; x += 46) { if (x > 740 && x < 1180) continue; ctx.fillRect(x, gy - 340, 9, 340); }
      for (const s of [-1, 1]) { ctx.fillRect(gx + s * 220 - 10, gy - 380, 20, 380); for (let k = 0; k < 5; k++) ctx.fillRect(gx + s * (40 + k * 40) - 4, gy - 320, 8, 320); ctx.fillRect(Math.min(gx, gx + s * 220), gy - 320, 220, 12); ctx.fillRect(Math.min(gx, gx + s * 220), gy - 40, 220, 12); }
      const sw = Math.sin(t * 1.1) * .06 * (o.chain ?? 1);
      ctx.save(); ctx.translate(gx, gy - 190); ctx.rotate(sw); ctx.strokeStyle = mixHex('#a0a6c0', L.light, .2); ctx.lineWidth = 6; for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.ellipse(k * 16, Math.abs(k) * 4, 10, 6, k % 2 ? .3 : -.3, 0, 7); ctx.stroke(); }
      ctx.fillStyle = lin(ctx, -26, 0, 26, 0, [[0, '#6a6e8a'], [.5, '#c8ccdc'], [1, '#5a5e7a']]); ctx.beginPath(); ctx.roundRect(-26, 30, 52, 58, 8); ctx.fill(); ctx.strokeStyle = '#b0b4c8'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 30, 16, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#20243e'; ctx.beginPath(); ctx.arc(0, 56, 6, 0, 7); ctx.fill(); ctx.fillRect(-2, 56, 4, 14); ctx.restore();
      out.lock = [gx, gy - 130];
      const sx = 1640; ctx.fillStyle = base; ctx.fillRect(sx - 5, gy - 380, 10, 380); ctx.fillStyle = mixHex('#c8ccdc', L.light, .1); ctx.beginPath(); ctx.arc(sx, gy - 390, 44, 0, 7); ctx.fill(); ctx.fillStyle = '#1a2050'; ctx.font = '700 30px Inter'; ctx.textAlign = 'center'; ctx.fillText('BUS', sx, gy - 380);
    }],
    [1700, () => { if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2], { dir: 1, back: .8, look: -.4 }); if (o.boy) S.boy(ctx, t, o.boy[0], o.boy[1], o.boy[2], { dir: 1, back: .8, pose: 'hold', look: .5 }); if (o.focus) o.focus(ctx, t, out); }],
  ]);
  return out;
}
// THE LAND: over the fence, where the cornfields ran: solar rows in perspective and grey halls up to the hills. Not a weed. No gate.
// o.reach (0..1 how far the rows have run), o.you [x,y,h], o.ghost (0..1 an ink line drawing of 2026's cornfields over it)
export function land(ctx, t, cam, L, o = {}) {
  const out = {}, HZ = 520;
  K.stage(ctx, cam, [
    [40000, () => K.sky(ctx, t, L, { horizon: HZ + 40, clouds: 3, seed: 41, sunR: 34 })],
    [16000, () => { K.hills(ctx, HZ, 46, null, 8, { grad: [K.hz(L.leafS, 16000, L), K.hz(L.leafS, 12000, L)] }); S.machineLand(ctx, t, -300, 2200, HZ + 2, L, 1, { seed: 3 }); S.tower(ctx, t, 1500, HZ + 4, 90, 300, L); }],
    [5000, () => {
      ctx.fillStyle = lin(ctx, 0, HZ, 0, 1200, [[0, mixHex('#1c2458', L.light, .1)], [1, mixHex('#0b1030', L.shade, .2)]]); ctx.fillRect(-1600, HZ, W + 3200, 1200);
      const reach = o.reach ?? 1, VPx = 960;
      for (let k = 0; k < 26; k++) { const y0 = HZ + 6 + Math.pow(k / 25, 1.8) * 640, y1 = y0 + 4 + k * 1.1; if (k / 25 > reach) break;   // panel rows
        ctx.fillStyle = mixHex('#24336e', L.light, .12 + .04 * (k % 2)); ctx.fillRect(-1600, y0, W + 3200, y1 - y0); ctx.fillStyle = rgba('#e8eefc', .1); ctx.fillRect(-1600, y0, W + 3200, 1.2); }
      for (let k = -14; k <= 14; k++) { ctx.strokeStyle = rgba('#05081e', .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(VPx + k * 8, HZ + 4); ctx.lineTo(VPx + k * 190, 1300); ctx.stroke(); }
      for (const [x, w, h] of [[200, 260, 70], [620, 180, 50], [1280, 300, 80], [1660, 220, 60]]) { ctx.fillStyle = mixHex('#2c3260', L.light, .1); ctx.fillRect(x, HZ + 30 - h, w, h); ctx.fillStyle = rgba('#e8eefc', .08); ctx.fillRect(x, HZ + 30 - h, w, 3); }
      if (o.ghost) { ctx.save(); ctx.globalAlpha *= o.ghost; ctx.strokeStyle = '#eef2ff'; ctx.lineWidth = 2; for (let x = -200; x < 2200; x += 34) { const y = HZ + 120 + ((x * 7) % 60); ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(x + 6, y); ctx.moveTo(x + 6, y + 14); ctx.lineTo(x + 18, y + 4); ctx.stroke(); } ctx.restore(); }
    }],
    [2200, () => { S.fence(ctx, t, -800, 2800, 1030, 330, L, { step: 34 }); out.fenceTop = 700; }],
    [1700, () => { if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2], { dir: 1, back: .9, look: -.2 }); if (o.focus) o.focus(ctx, t, out); }],
  ]);
  return out;
}
// THE BENCH at night, seen from BEHIND (as #74's bench, and thumbnail C): you and the grandson look out over the dark roofs to the tower's band;
// the brass clock (the only warm light besides your coat) in his hands or yours. A cold lamp above. o.boy (bool), o.clock (0..1),
// o.holder ('boy' | 'you'), o.wind (0..1 the key turns), o.lean (0..1 he leans on you), o.gap (x-offset of the pair), o.tower (x of the far tower)
function benchBack(g, x, y, w, L) {
  g.fillStyle = mixHex('#2a2238', L.shade, .3); g.fillRect(x + 20, y - 90, 14, 200); g.fillRect(x + w - 34, y - 90, 14, 200); g.fillRect(x + w / 2 - 7, y - 90, 14, 200);
  g.fillStyle = mixHex('#4a3e52', L.light, .1); g.fillRect(x, y - 80, w, 24); g.fillRect(x, y - 42, w, 24);
  g.fillStyle = rgba('#e8eefc', .07); g.fillRect(x, y - 80, w, 3); g.fillRect(x, y - 42, w, 3);
}
export function bench(ctx, t, cam, L, o = {}) {
  const out = {}, bx = 960 + (o.gap ?? 0), BY = 900, BW = 560, tx = o.tower ?? 1380;
  K.stage(ctx, cam, [
    [40000, () => { K.sky(ctx, t, L, { horizon: 700, sun: false, clouds: 2, seed: 51 }); E_stars(ctx, t, L); }],
    [12000, () => { K.hills(ctx, 700, 30, null, 2, { grad: [K.hz(L.leafS, 12000, L), K.hz(L.leafS, 9000, L)] }); out.tower = S.tower(ctx, t, tx, 706, 70, 330, L); S.fence(ctx, t, tx - 420, tx + 420, 712, 16, L);
      for (let i = 0; i < 9; i++) { const x = -260 + i * 280; if (Math.abs(x + 90 - tx) < 200) continue; K.house(ctx, x, 712, 180, 150 + (i % 3) * 20, L, { col: '#5a5a7a', lit: 0, roofH: 50, t }); } }],
    [3600, () => { K.band(ctx, 740, 1400, mixHex('#1c2250', L.light, .08), mixHex('#0b1030', L.shade, .2)); S.lamp(ctx, t, bx - 40, 1000, 760, L, 1, 1); }],
    [2000, () => {
      const x0 = bx - BW / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(-1000, -1000, W + 2000, BY - 20 + 1000); ctx.clip();   // seated behind the backrest: only the torso shows
      K.you(ctx, t, bx - 130, BY + 200, 400, { back: .75, look: .25 + .08 * Math.sin(t * .35), dir: 1, lean: -.02, armR: o.holder === 'you' ? [.9, 2.3] : undefined });
      let hd = null; if (o.boy !== false) hd = S.boy(ctx, t, bx + 140, BY + 152 + 6 * (o.lean ?? 0), 300, { back: .75, dir: -1, look: -.35 - .3 * (o.lean ?? 0), lean: -.1 * (o.lean ?? 0), armR: o.holder !== 'you' ? [.8, 2.4] : undefined });
      ctx.restore();
      if (o.clock) { const cx = o.holder === 'you' ? bx - 70 : (hd ? hd.R[0] - 10 : bx + 90), cy = (o.holder === 'you' ? BY - 120 : (hd ? hd.R[1] - 16 : BY - 110)) - 3 * Math.sin(t * .6);
        S.alarmClock(ctx, t, cx, cy, .38 * o.clock, { ring: o.ring ?? 0, rot: (o.wind ?? 0) * .03 * Math.sin(t * 9) });
        if (o.wind) { ctx.save(); ctx.translate(cx + 28, cy - 4); ctx.rotate(t * 3.2 * o.wind); ctx.fillStyle = '#c99a4c'; ctx.fillRect(-3, -12, 6, 24); ctx.fillRect(-11, -12, 22, 5); ctx.restore(); }
        K.halo(ctx, cx, cy, 80, .22); out.clock = [cx, cy, 26]; }
      benchBack(ctx, x0, BY, BW, L);
    }],
    [1150, () => { if (o.fore !== false) { ctx.fillStyle = mixHex('#0b1030', '#060a24', .5); ctx.beginPath(); ctx.roundRect(-300, 1040, 700, 200, 10); ctx.fill(); ctx.beginPath(); ctx.roundRect(1600, 1060, 700, 200, 10); ctx.fill(); } if (o.focus) o.focus(ctx, t, out); }],
  ]);
  return out;
}
// THE END PICTURE (15 s, REGELN end screen): the bench at night seen wider, the pair small in the CENTRE (x 760–1160), the clock being wound;
// left (x < 640) and right (x > 1280) stay calm night (sky, a few dark roofs, the far band) for the YouTube end cards. o.wind (0..1), o.end
export function endWind(ctx, t, cam, L, o = {}) {
  const out = bench(ctx, t, cam, L, { holder: 'you', tower: 1130, ...o, clock: 1, gap: 0, fore: false });
  // the free areas: keep them free of focal points (only stars, roofs, the lamp's falloff); a guide for review only
  if (o.guides) K.scr(ctx, (c) => { c.strokeStyle = rgba('#ff4d6d', .6); c.setLineDash([10, 8]); c.strokeRect(80, 220, 560, 600); c.strokeRect(1280, 220, 560, 600); });
  return out;
}
