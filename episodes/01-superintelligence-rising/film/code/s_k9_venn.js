// "The two camps don't want the same things. But they overlap on the part that comes first: people outside the labs
//  who can actually see what's going on."
// Two pools of light on a dark floor, each holding a group: cool lavender (normal technology), warm amber (pace the
// frontier). They stand apart, then walk toward each other until the pools overlap. In the bright overlap a small lab
// rises with a lit window, and people from both groups step up to it and look inside.
// world() is shared with s_k9_door.js, which pushes in on the same place.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const { gf, rr, cached, tiny } = require('./s_k9_kit');

const T0 = 592.65, T1 = 602.75;
const FY = 760, PRX = 360, PRY = 120;
const PALA = ['#d8d0f4', '#8f86c8', '#3b2f6e'], PALB = ['#ffb35c', '#c36a2b', '#5a2a12'];
const SKIN = ['#ffd29a', '#e0904a', '#7a3b17'];
const sepAt = t => lerp(470, 200, ease((t - 595.95) / 1.2));     // half distance between pool centres
const R = rng(593);
const GROUP = side => Array.from({ length: 9 }, (_, i) => ({ side, ox: side * (50 + R() * 230) * 1.25, oy: (R() - 0.5) * 2 * 70, s: 0.62 + R() * 0.12, ph: R() * 7, hair: ['#2e140a', '#1c0a05', '#4a2210', '#5a2a12'][Math.floor(R() * 4)], long: R() < 0.4, coat: R() < 0.5 }));
const PEOPLE = [...GROUP(-1), ...GROUP(1)];
// the four observers: two from each camp
const OBS = [
  { side: -1, from: [-290, 30], to: [-120, 40], t0: 598.75, pal: PALA },
  { side: -1, from: [-230, -40], to: [-48, 30], t0: 598.95, pal: PALA },
  { side: 1, from: [240, -30], to: [44, 34], t0: 598.85, pal: PALB },
  { side: 1, from: [300, 40], to: [118, 44], t0: 599.05, pal: PALB },
];
const LAB = { x: 960, y: FY - 48, w: 280, h: 200 };

function floorArt(c) {
  gf(c, cc => cc.rect(-600, -400, W + 1200, 1900), lin(c, 0, -400, 0, 1500, [[0, '#06071a'], [0.45, '#100f30'], [0.6, '#1a1844'], [1, '#0a0920']]), 0.55);
  c.strokeStyle = 'rgba(164,159,196,0.06)'; c.lineWidth = 2;
  for (let k = -30; k <= 30; k++) { c.beginPath(); c.moveTo(960 + k * 60, 520); c.lineTo(960 + k * 260, 1500); c.stroke(); }
  for (let k = 0; k < 14; k++) { const y = 520 + Math.pow(k / 13, 1.8) * 980; c.beginPath(); c.moveTo(-600, y); c.lineTo(W + 600, y); c.stroke(); }
}

function pool(ctx, x, col, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, FY); ctx.scale(1, PRY / PRX);
  ctx.fillStyle = rad(ctx, 0, 0, 0, PRX, [[0, rgba(col, 0.30 * a)], [0.75, rgba(col, 0.18 * a)], [1, rgba(col, 0)]]); ctx.fillRect(-PRX, -PRX, 2 * PRX, 2 * PRX);
  ctx.restore();
  ctx.strokeStyle = rgba(col, 0.35 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, FY, PRX * 0.86, PRY * 0.86, 0, 0, 7); ctx.stroke();
  cone(ctx, x, -100, 40, PRX * 1.6, FY + 100, col, 0.05 * a);
}

function lab(ctx, t, rise, glow, door) {
  if (rise <= 0) return;
  const { x, y, w, h } = LAB, hh = h * out(rise);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h - 60, 2 * w, h + 60); ctx.clip();
  ctx.translate(0, h - hh);
  // body
  gf(ctx, c => { c.rect(x - w / 2, y - h, w, h); }, lin(ctx, 0, y - h, 0, y, [[0, '#22205a'], [1, '#14123a']]), 0.5);
  gf(ctx, c => { c.rect(x - w / 2 - 10, y - h - 14, w + 20, 16); }, '#2e2a6a', 0.4);
  // big window: inside, racks and screens in cyan
  const wx = x - w / 2 + 24, wy = y - h + 40, ww = 170, wh = 120;
  gf(ctx, c => c.rect(wx, wy, ww, wh), lin(ctx, 0, wy, 0, wy + wh, [[0, '#bff2ff'], [0.5, '#5fc0dc'], [1, '#1a7d9c']]), 0.25);
  for (let k = 0; k < 4; k++) { const rx = wx + 14 + k * 40; ctx.fillStyle = 'rgba(10,60,90,0.8)'; ctx.fillRect(rx, wy + 30, 26, wh - 30);
    for (let j = 0; j < 5; j++) { ctx.fillStyle = rgba(C.cyanW, 0.4 + 0.5 * (0.5 + 0.5 * Math.sin(t * 5 + k * 2 + j))); ctx.fillRect(rx + 4, wy + 38 + j * 16, 18, 3); } }
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.moveTo(wx + 20, wy); ctx.lineTo(wx + 60, wy); ctx.lineTo(wx + 20, wy + wh); ctx.lineTo(wx - 20, wy + wh); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#0c0b22'; ctx.lineWidth = 6; ctx.strokeRect(wx, wy, ww, wh); ctx.fillStyle = '#0c0b22'; ctx.fillRect(wx + ww / 2 - 3, wy, 6, wh);
  // door on the right: opens warm
  const dx = x + w / 2 - 82, dy = y - 150, dw = 58, dh = 150;
  ctx.fillStyle = lin(ctx, 0, dy, 0, y, [[0, '#ffe2a8'], [1, '#ffb35c']]); ctx.fillRect(dx, dy, dw, dh);
  ctx.fillStyle = '#1a1848'; ctx.fillRect(dx, dy, dw * (1 - 0.85 * door), dh);
  ctx.fillStyle = rgba(C.cyanW, 0.5); ctx.fillRect(dx + dw * (1 - 0.85 * door) - 10, dy + 70, 4, 18);
  ctx.restore();
  light(ctx, x - w / 2 + 110, y - h + 100, 260, C.cyan, 0.30 * glow * rise);
  cone(ctx, x - w / 2 + 110, y - h + 160, 170, 360, 120, C.cyan, 0.10 * glow * rise);
  if (door > 0) { light(ctx, x + w / 2 - 53, y - 70, 220, C.amber, 0.45 * door); cone(ctx, x + w / 2 - 53, y, 58, 220, 90, C.amber, 0.18 * door); }
}

// walkIn: 0..1 progress of the observers walking through the door (used by the next scene)
function world(ctx, t, walkIn = 0) {
  const sep = sepAt(t), cA = 960 - sep, cB = 960 + sep, merge = ramp(t, 596.0, 597.1);
  const rise = ramp(t, 597.35, 598.3), door = ramp(t, 603.6, 604.3);
  cached(ctx, 'k9floor', -600, -400, W + 600, 1500, floorArt);
  pool(ctx, cA, '#a49fff', 1); pool(ctx, cB, C.amber, 1);
  // the overlap: brighter, warm white
  if (merge > 0) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(cA, FY, PRX * 0.86, PRY * 0.86, 0, 0, 7); ctx.clip(); ctx.beginPath(); ctx.ellipse(cB, FY, PRX * 0.86, PRY * 0.86, 0, 0, 7); ctx.clip();
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#fff1cf', 0.22 * merge * (0.9 + 0.1 * Math.sin(t * 2))); ctx.fillRect(cA, FY - PRY, cB - cA, 2 * PRY); ctx.restore();
    light(ctx, 960, FY - 20, 360, '#fff1cf', 0.25 * merge);
  }
  // groups: walk toward each other while the pools slide
  const moving = ramp(t, 595.9, 596.2) * (1 - ramp(t, 597.0, 597.3));
  const drawList = [];
  for (const p of PEOPLE) {
    const cx = p.side < 0 ? cA : cB, isObs = false;
    drawList.push({ y: FY + p.oy, f: () => tiny(ctx, cx + p.ox * 0.8, FY + p.oy, p.s, { facing: merge > 0.5 ? 'back' : 'front', pal: p.side < 0 ? PALA : PALB, skin: SKIN, hair: p.hair, long: p.long, coat: p.coat,
      walk: moving > 0 ? t * 7 + p.ph : null, br: Math.sin(t * 1.6 + p.ph), trousers: p.side < 0 ? '#2a2458' : '#3a1a0c' }) });
  }
  for (const o of OBS) {
    const u = ease((t - o.t0) / 1.1), x = 960 + lerp(o.from[0], o.to[0], u), y = FY + lerp(o.from[1], o.to[1], u);
    let xx = x, yy = y, a = ramp(t, o.t0 - 0.5, o.t0), s = 0.66;
    if (walkIn > 0) { const k = clamp(walkIn * 1.6 - (OBS.indexOf(o)) * 0.22); xx = lerp(x, LAB.x + LAB.w / 2 - 53, ease(k)); yy = lerp(y, LAB.y - 4, ease(k)); s = lerp(0.66, 0.56, k); a = 1 - ramp(k, 0.8, 1); }
    if (a <= 0) continue;
    const walking = (t > o.t0 && t < o.t0 + 1.1) || (walkIn > 0 && a > 0 && a < 1) || (walkIn > 0.02 && walkIn < 0.95);
    drawList.push({ y: yy + 0.5, f: () => { ctx.save(); ctx.globalAlpha = a; tiny(ctx, xx, yy, s, { facing: 'back', pal: o.pal, skin: SKIN, walk: walking ? t * 7 + o.t0 : null, br: Math.sin(t * 1.5 + o.t0), trousers: o.pal === PALA ? '#2a2458' : '#3a1a0c' });
      // the window light on their shoulders
      light(ctx, xx, yy - 110 * s, 60, C.cyan, 0.18 * rise); ctx.restore(); } });
  }
  drawList.push({ y: LAB.y - 1, f: () => lab(ctx, t, rise, 0.85 + 0.15 * Math.sin(t * 1.7), door) });
  drawList.sort((a, b) => a.y - b.y).forEach(d => d.f());
  return { cA, cB, merge };
}

function campLabels(ctx, t, cA, cB) {
  const a = ramp(t, 593.4, 594.0) * (1 - ramp(t, 596.0, 596.6)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = '24px "Inter SemiBold"'; ctx.letterSpacing = '6px'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.shadowColor = 'rgba(4,4,16,0.9)'; ctx.shadowBlur = 14;
  ctx.fillStyle = '#c9c2f0'; ctx.fillText('NORMAL TECHNOLOGY', cA, 570); ctx.fillStyle = C.amber; ctx.fillText('PACE THE FRONTIER', cB, 570);
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.5, ease((t - 595.6) / 3.2)) + 0.08 * sm((t - 598.8) / 4), dx = drift(t, 1, 51) * 6, dy = drift(t, 1, 52) * 4;
  ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960 + dx, -700 + dy);
  const r = world(ctx, t);
  campLabels(ctx, t, r.cA, r.cB);
  ctx.restore();
}

module.exports = { T0, T1, draw, world, LAB, FY };
