// Film 63 · builder B2 (c07–c09) · scene objects (B2 only; the kit stays untouched). Every drawer works in its own design space
// (1920 × 1080), takes t and a few 0..1 parameters, creates nothing random per frame (seeded tables are cached).
import * as F from './f63_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
const TAU = Math.PI * 2;
const fract = (x) => x - Math.floor(x);
export const INKW = mixHex(P.night1, P.ind1, .55);      // ink silhouettes
export const PANE = mixHex(P.blue1, P.cream, .3);      // cool window panes
export const WARM = mixHex(GOLD.body, P.core1, .35);    // a lit window

// ---------------------------------------------------------------- TEXT HELPERS
export const ser = (ctx, s, x, y, size, u, o = {}) => { if (u <= 0) return null; return F.maskLine(ctx, [[s, 0]], x, y, size, rise(u), { glow: o.glow ?? false, col: o.col ?? CREAM, align: o.align ?? 'center' }); };
export const gser = (ctx, s, x, y, size, u, o = {}) => { if (u <= 0) return null; return F.goldText(ctx, [[s, 1]], x, y, size, rise(u), { serif: true, glow: o.glow ?? true, align: o.align ?? 'center' }); };
export const caps = (ctx, s, x, y, u, o = {}) => F.capsLabel(ctx, s, x, y, u, { size: o.size ?? 24, col: o.col, align: o.align ?? 'center' });
// a value that rises on t0 and sinks on t1 (both behind the same mask)
export const inOut = (t, a0, a1, b0, b1) => Math.min(span(t, a0, a1), 1 - span(t, b0, b1));

// ---------------------------------------------------------------- THE TOWN (M.01–M.03)
// houses: far row (small, cool), three tall towers (the few), front row; every window has a lighting time set by the caller.
const TOWN = (() => {
  const r = F.prng(707), H0 = [], wins = [];
  const addWins = (h, cols, rows, ww, wh, gx, gy, kind) => {
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = h.x + (h.w - (cols * ww + (cols - 1) * gx)) / 2 + i * (ww + gx), y = h.g - h.h + h.roofH + 26 + j * (wh + gy);
      if (y + wh > h.g - 14) continue;
      wins.push({ x, y, w: ww, h: wh, house: h, kind, ph: r() * 6, order: r() });
    }
  };
  let x = -380;
  while (x < 2300) { const w = 60 + r() * 80, h = 80 + r() * 90; const hh = { x, w, h, g: 770, far: 1, roofH: r() < .6 ? w * .32 : 0 }; H0.push(hh); addWins(hh, Math.max(1, Math.round(w / 40)), 2, 12, 16, 12, 16, 'far'); x += w + 8 + r() * 26; }
  for (const [cx, w, h] of [[800, 116, 450], [960, 150, 540], [1118, 118, 485]]) { const hh = { x: cx - w / 2, w, h, g: 800, tower: 1, roofH: 0 }; H0.push(hh); addWins(hh, 3, 11, 20, 26, 14, 16, 'tower'); }
  x = -400;
  while (x < 2350) {
    const w = 120 + r() * 120, h = 150 + r() * 120;
    if (x > 560 && x < 1240) { x = 1240 + r() * 20; continue; }   // keep the towers' feet free
    const hh = { x, w, h, g: 880, front: 1, roofH: w * (.3 + r() * .12) }; H0.push(hh); addWins(hh, Math.max(1, Math.round(w / 70)), 2, 26, 34, 26, 26, 'front'); x += w + 14 + r() * 40;
  }
  // the yes window (the card lands here) and your window (stays dark until 'subscribe')
  const yesWin = { x: 960 - 22, y: 470 - 30, w: 44, h: 60, kind: 'yes' };
  const tw = H0.find((h) => h.tower && h.x < 960 && h.x + h.w > 960);
  for (let i = wins.length - 1; i >= 0; i--) { const q = wins[i]; if (q.house === tw && Math.abs(q.x + q.w / 2 - 960) < 50 && Math.abs(q.y + q.h / 2 - 470) < 46) wins.splice(i, 1); }
  const mine = { x: 1472, y: 676, w: 146, h: 170, house: null, kind: 'mine' };
  const myHouse = { x: 1420, w: 250, h: 330, g: 920, front: 1, mine: 1, roofH: 92 };
  for (let i = H0.length - 1; i >= 0; i--) { const q = H0[i]; if (q.front && q.x < myHouse.x + myHouse.w + 10 && q.x + q.w > myHouse.x - 10) { H0.splice(i, 1); for (let k = wins.length - 1; k >= 0; k--) if (wins[k].house === q) wins.splice(k, 1); } }
  H0.push(myHouse); mine.house = myHouse;
  return { houses: H0, wins, yesWin, mine };
})();
export const TOWN_MINE = TOWN.mine, TOWN_YES = TOWN.yesWin;
// o: { rise 0..1 (the town grows out of its ground), lit(win) → 0..1, mineLit 0..1 }
export function town(ctx, t, o = {}) {
  const ru = clamp(o.rise ?? 1);
  const drawHouse = (h, a) => {
    if (a <= 0) return;
    const hh = h.h * a, top = h.g - hh;
    const col = h.far ? mixHex(P.ind1, P.blue1, .35) : h.tower ? mixHex(P.night1, P.ind1, .7) : mixHex(P.night1, P.ind0, .5);
    ctx.fillStyle = F.lin(ctx, 0, top, 0, h.g, [[0, col], [1, mixHex(col, P.night0, .4)]]);
    ctx.beginPath(); ctx.moveTo(h.x, h.g); ctx.lineTo(h.x, top + h.roofH * a); if (h.roofH) ctx.lineTo(h.x + h.w / 2, top); ctx.lineTo(h.x + h.w, top + h.roofH * a); ctx.lineTo(h.x + h.w, h.g); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(h.far ? P.blue0 : P.blue1, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(h.x, top + h.roofH * a); if (h.roofH) ctx.lineTo(h.x + h.w / 2, top); ctx.lineTo(h.x + h.w, top + h.roofH * a); ctx.stroke();
  };
  const rowA = (h) => { const d = Math.abs(h.x + h.w / 2 - 960) / 1200; return expoOut(span(ru, d * .45 + (h.far ? .05 : h.tower ? 0 : .12), d * .45 + .55)); };
  // light spill of the lit windows on the ground (one warm haze, grows with the number of lit windows)
  let litN = 0;
  for (const layer of ['far', 'tower', 'front']) {
    for (const h of TOWN.houses) if ((layer === 'far' ? h.far : layer === 'tower' ? h.tower : h.front)) drawHouse(h, rowA(h));
    for (const w of TOWN.wins) {
      const h = w.house; if ((layer === 'far' && !h.far) || (layer === 'tower' && !h.tower) || (layer === 'front' && !h.front)) continue;
      const a = rowA(h); if (a < .98 && w.y < h.g - h.h * a + h.roofH) continue;
      const L = clamp(o.lit ? o.lit(w) : 0); litN += L;
      ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .5), WARM, L * (.88 + .12 * Math.sin(t * .7 + w.ph)));
      ctx.fillRect(w.x, w.y, w.w, w.h);
      if (L > .02 && !h.far) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, w.x + w.w / 2, w.y + w.h / 2, w.w * 2.2, [[0, rgba(P.halo0, .28 * L)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(w.x - w.w * 2.2, w.y - w.w * 2.2, w.w * 5.4, w.h + w.w * 4.4); ctx.restore(); }
    }
    if (layer === 'tower') {   // the yes window
      const y = TOWN.yesWin; if ((o.yes ?? 1) > 0) { ctx.fillStyle = mixHex(P.night1, WARM, o.yes ?? 1); ctx.fillRect(y.x, y.y, y.w, y.h); ctx.fillStyle = rgba(P.night1, .9); ctx.fillRect(y.x + y.w / 2 - 2, y.y, 4, y.h); }
    }
  }
  // your window (the front house, right): dark until it lights
  const m = TOWN.mine, mh = m.house, a = rowA(mh);
  if (a > .9) {
    const L = clamp(o.mineLit ?? 0);
    ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .35), WARM, L); ctx.fillRect(m.x, m.y, m.w, m.h);
    ctx.strokeStyle = mixHex(P.night1, P.ind1, .5); ctx.lineWidth = 8; ctx.strokeRect(m.x, m.y, m.w, m.h);
    ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(m.x - 8, m.y + m.h + 4, m.w + 16, 3);
  }
  return litN;
}

// ---------------------------------------------------------------- THE BULB (hangs on its cord; lit 0..1)
export function bulb(ctx, t, x, y, lit, o = {}) {
  const sw = Math.sin(t * .55) * .02 + (o.swing ?? 0), top = o.top ?? -60;
  const bx = x + Math.sin(sw) * (y - top), by = y;
  ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(bx, by - 26); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.fillRect(bx - 9, by - 30, 18, 14);
  if (o.shade) {   // the factory enamel shade (o.shade 0..1 grows)
    const s = expoOut(o.shade);
    ctx.fillStyle = F.lin(ctx, bx - 90, 0, bx + 90, 0, [[0, P.night1], [.5, mixHex(P.ind2, P.blue1, .5)], [1, P.night1]]);
    ctx.beginPath(); ctx.moveTo(bx - 14, by - 30); ctx.lineTo(bx + 14, by - 30); ctx.lineTo(bx + 86 * s, by + 4); ctx.lineTo(bx - 86 * s, by + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.halo2, .45); ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .4), P.core0, lit); ctx.beginPath(); ctx.arc(bx, by, 20, 0, TAU); ctx.fill();
  if (lit > 0) F.halo(ctx, bx, by, 70 + 30 * lit, lit, P.halo0, P.core0);
  return [bx, by];
}

// ---------------------------------------------------------------- A WALL SWITCH (subscribe) and the yellow sleeve
export function wallSwitch(ctx, x, y, on, o = {}) {
  ctx.fillStyle = mixHex(P.cream, P.shade1, .35); ctx.beginPath(); ctx.roundRect(x - 34, y - 52, 68, 104, 8); ctx.fill();
  ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = mixHex(P.cream, P.shade1, .6); ctx.beginPath(); ctx.roundRect(x - 13, y - 30, 26, 60, 5); ctx.fill();
  const k = clamp(on); ctx.fillStyle = mixHex(P.night1, P.ind2, .3); ctx.beginPath(); ctx.roundRect(x - 9, lerp(y - 26, y + 2, k), 18, 24, 4); ctx.fill();
}
// a yellow coat sleeve from (x0, y0) to the hand at (x1, y1)
export function sleeve(ctx, x0, y0, x1, y1, o = {}) {
  const C = F.du;   // only for palette parity: the coat is P.coat
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = mixHex(P.coat, P.shade0, .45); ctx.lineWidth = 58; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + 30, (y0 + y1) / 2 + 60, x1 + 30, y1 + 8); ctx.stroke();
  ctx.strokeStyle = P.coat; ctx.lineWidth = 48; ctx.stroke();
  ctx.strokeStyle = mixHex(P.coat, P.core1, .5); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x0, y0 - 18); ctx.quadraticCurveTo((x0 + x1) / 2 + 30, (y0 + y1) / 2 + 42, x1 + 30, y1 - 10); ctx.stroke();
  ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.beginPath(); ctx.ellipse(x1 + 4, y1, 22, 15, -.3, 0, TAU); ctx.fill();   // the hand
  ctx.fillRect(x1 - 18, y1 - 6, 18, 9);
  ctx.restore(); void C;
}

// ---------------------------------------------------------------- THE FACTORY HALL, 1891 (in ink)
// o: { build 0..1 (windows, shaft, machines rise), workers 0..1, run 0..1 (belts and pulleys spin) }
const MACH = [300, 640, 1280, 1620];
export function factory(ctx, t, o = {}) {
  const b = clamp(o.build ?? 1), wk = clamp(o.workers ?? 1), run = clamp(o.run ?? 1);
  if (o.bg !== false) { ctx.fillStyle = F.lin(ctx, 0, -200, 0, 900, [[0, mixHex(P.night0, P.ind0, .5)], [1, mixHex(P.ind0, P.night1, .4)]]); ctx.fillRect(-W, -H, W * 3, H * 3); }
  // tall arched windows in the back wall, rise from below one by one
  for (let i = 0; i < 9; i++) {
    const x = -260 + i * 300, a = expoOut(span(b, i * .05, i * .05 + .45)); if (a <= 0) continue;
    const y0 = 220, y1 = 640, top = lerp(y1, y0, a);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 4, top - 60, 168, y1 - top + 64); ctx.clip();
    ctx.fillStyle = F.lin(ctx, 0, y0, 0, y1, [[0, mixHex(PANE, P.night1, .35)], [1, mixHex(PANE, P.night1, .62)]]);
    ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y0 + 80); ctx.arc(x + 80, y0 + 80, 80, Math.PI, 0); ctx.lineTo(x + 160, y1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.night1, .9); for (let k = 1; k < 3; k++) ctx.fillRect(x + k * 53 - 2, y0, 4, y1 - y0); for (let k = 1; k < 5; k++) ctx.fillRect(x, y0 + 60 + k * 76, 160, 4);
    ctx.restore();
  }
  F.land(ctx, lerp(1300, 790, expoOut(span(b, 0, .35))), { top: mixHex(P.ind1, P.night1, .4) });
  // line shaft + pulleys + belts to the machines
  const su = smooth(span(b, .25, .7)), sx0 = -200, sx1 = lerp(-200, 2120, su), sy = 200, rot = t * 5 * run;
  if (su > 0) { ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.fillRect(sx0, sy - 6, sx1 - sx0, 12); ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(sx0, sy - 6, sx1 - sx0, 2); }
  for (const [i, mx] of MACH.entries()) {
    const a = expoOut(span(b, .35 + i * .07, .8 + i * .07)); if (a <= 0 || mx > sx1) continue;
    // pulley
    ctx.save(); ctx.translate(mx, sy); ctx.rotate(rot); ctx.strokeStyle = mixHex(P.cream, P.blue1, .45); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 30 * a, 0, TAU); ctx.stroke();
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(k * TAU / 4) * 30 * a, Math.sin(k * TAU / 4) * 30 * a); ctx.stroke(); } ctx.restore();
    // machine on the floor (a lathe: bed, wheel, frame)
    const my = 790, mh = 150 * a;
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(mx - 110, my - mh * .55, 220, mh * .55); ctx.fillRect(mx - 96, my - mh, 24, mh); ctx.fillRect(mx + 72, my - mh, 24, mh);
    ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 2; ctx.strokeRect(mx - 110, my - mh * .55, 220, mh * .55);
    ctx.save(); ctx.translate(mx + 40, my - mh * .78); ctx.rotate(rot * 1.6); ctx.strokeStyle = mixHex(P.cream, P.blue1, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 26 * a, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-26 * a, 0); ctx.lineTo(26 * a, 0); ctx.stroke(); ctx.restore();
    // belt (two strands) pulley → machine wheel, with running marks
    if (a > .5) {
      const k = span(a, .5, 1), x0 = mx, y0 = sy, x1 = mx + 40, y1 = lerp(sy, my - mh * .78, k);
      ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x0 + s * 30, y0); ctx.lineTo(x1 + s * 26, y1); ctx.stroke(); }
      if (run > 0) for (let q = 0; q < 6; q++) { const f = fract(q / 6 + t * .9 * run), px = lerp(x0 - 30, x1 - 26, f), py = lerp(y0, y1, f); ctx.fillStyle = rgba(P.halo2, .7 * run); ctx.fillRect(px - 3, py - 3, 6, 6); }
    }
    // the worker at his machine
    const wa = expoOut(span(wk, i * .12, i * .12 + .6)); if (wa > 0) {
      const ph = t * 3.2 + i * 1.3, x = mx - 170;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 200, 0, 400, 792); ctx.clip();
      F.person(ctx, x, 790 + (1 - wa) * 300, 250, { dir: 1, lean: .12 + .03 * Math.sin(ph), armR: [1.15 + .18 * Math.sin(ph), 1.5 + .2 * Math.sin(ph)], armL: [.9, 1.3 + .1 * Math.sin(ph + 1)], look: -.25, light: -1 });
      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------- THE WORKBENCH ROOM (5.05, 6.08) · bulb at BULB
export const BULB = [960, 320];
export const ROOMWIN = { x: 1440, y: 190, w: 300, h: 280 };
// o: { lit 0..1, dark 0..1 (the room after the light), you 0..1, reach 0..1 (your hand to the switch), switchOn 0..1, colleague 0..1,
//      nod 0..1, piece 0..1 (the finished piece on the bench), walker 0..1 (the morning walk outside), empty, displaced 0..1, help 0..1 }
export function room(ctx, t, o = {}) {
  const lit = clamp(o.lit ?? 1), dk = clamp(o.dark ?? 0);
  ctx.fillStyle = F.lin(ctx, 0, -100, 0, 860, [[0, mixHex(mixHex(P.night1, P.ind0, .4), P.night0, dk * .5)], [1, mixHex(mixHex(P.ind0, P.shade0, .12 * lit), P.night1, dk * .4)]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, BULB[0], BULB[1] + 220, 900, [[0, rgba(P.halo1, .26 * lit)], [.6, rgba(P.shade0, .07 * lit)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
  // the window: pre-dawn outside, the morning walk on a path
  const w = ROOMWIN;
  ctx.save(); ctx.beginPath(); ctx.rect(w.x, w.y, w.w, w.h); ctx.clip();
  windowOutside(ctx, t, w, o);
  ctx.restore();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(w.x - 14, w.y - 14, w.w + 28, 14); ctx.fillRect(w.x - 14, w.y + w.h, w.w + 28, 20); ctx.fillRect(w.x - 14, w.y, 14, w.h); ctx.fillRect(w.x + w.w, w.y, 14, w.h);
  ctx.fillRect(w.x + w.w / 2 - 4, w.y, 8, w.h); ctx.fillRect(w.x, w.y + w.h * .48 - 4, w.w, 8);
  // floor
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(-W, 800, W * 3, H); ctx.fillStyle = rgba(P.blue1, .45); ctx.fillRect(-W, 798, W * 3, 2);
  // the switch
  if ((o.you ?? 0) > 0 || o.switchOn != null) wallSwitch(ctx, 400, 520, o.switchOn ?? 1);
  // the bench
  const bx0 = 660, bx1 = 1260, by = 700;
  ctx.fillStyle = F.lin(ctx, 0, by - 24, 0, by, [[0, mixHex(P.shade0, P.ind1, .35 + .4 * (1 - lit))], [1, mixHex(P.shade0, P.night1, .6)]]); ctx.fillRect(bx0, by - 24, bx1 - bx0, 24);
  ctx.fillStyle = P.night1; ctx.fillRect(bx0 + 30, by, 22, 100); ctx.fillRect(bx1 - 52, by, 22, 100); ctx.fillRect(bx0 + 30, by + 60, bx1 - bx0 - 60, 10);
  if (lit > 0) { ctx.fillStyle = F.rad(ctx, BULB[0], by - 12, 320, [[0, rgba(P.core1, .5 * lit)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(bx0, by - 24, bx1 - bx0, 24); }
  // tools on the bench (life)
  ctx.fillStyle = mixHex(P.night1, P.shade0, .35); ctx.fillRect(1120, by - 34, 90, 10); ctx.fillRect(1180, by - 52, 10, 28);
  if ((o.piece ?? 0) > 0) piece(ctx, 980, by - 24, 1, lit, o.piece);
  // you (yellow), at the switch
  if ((o.you ?? 0) > 0) {
    const r = clamp(o.reach ?? 0), br = 1 + .006 * Math.sin(t * 2.1);
    ctx.save(); ctx.translate(560, 800); ctx.scale(1, br); ctx.translate(-560, -800);
    F.du(ctx, 560, 800 + (1 - o.you) * 420, 380, { dir: -1, lean: .08 * (1 - r), look: lerp(-.2, .3, r), light: 1, back: .15 + .3 * dk, armR: [lerp(.3, 1.55, r), lerp(.2, 1.68, r)], armL: [.25, .2] });
    ctx.restore();
  }
  // the colleague (nods)
  if ((o.colleague ?? 0) > 0) {
    const nod = Math.sin(clamp(o.nod ?? 0) * TAU * 1.5) * .25;
    F.person(ctx, 1380, 800 + (1 - o.colleague) * 420, 360, { dir: -1, look: -.1 + nod, lean: .03, light: -1, back: .2 + .4 * dk, armR: [.4, .5], armL: [.2, .3] });
  }
  // 6.08: the displaced (sits on a crate) and someone reaching a hand down to him
  if ((o.displaced ?? 0) > 0) {
    const a = expoOut(o.displaced), hp = clamp(o.help ?? 0);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .55); ctx.fillRect(1290, 700, 150, 100); ctx.fillStyle = rgba(P.halo2, .3); ctx.fillRect(1290, 700, 150, 2);
    ctx.save(); ctx.beginPath(); ctx.rect(1100, 0, 800, 800); ctx.clip();
    F.person(ctx, 1365, 760 + (1 - a) * 400, 300, { pose: 'sit', dir: 1, lean: lerp(.38, .18, hp), look: lerp(-.6, .25, hp), light: -1, armR: [lerp(.6, 1.0, hp), lerp(.9, 1.3, hp)], armL: [.5, .9] });
    F.person(ctx, 1640, 800 + (1 - a) * 400, 340, { dir: -1, lean: lerp(.02, .22, hp), look: lerp(0, -.45, hp), light: -1, armR: [lerp(.3, 1.25, hp), lerp(.3, 1.05, hp)], armL: [.2, .25] });
    ctx.restore();
  }
  // the bulb
  bulb(ctx, t, BULB[0], BULB[1], lit);
  if (dk > 0) { ctx.save(); ctx.fillStyle = rgba(P.night0, .45 * dk); ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
}
export function windowOutside(ctx, t, w, o = {}) {
  ctx.fillStyle = F.lin(ctx, 0, w.y, 0, w.y + w.h, [[0, mixHex(P.blue0, P.ind1, .35)], [.7, mixHex(P.blue1, P.halo2, .3)], [1, mixHex(P.halo1, P.blue1, .4)]]); ctx.fillRect(w.x, w.y, w.w, w.h);
  const hy = w.y + w.h * .74;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.moveTo(w.x, hy); for (let i = 0; i <= 10; i++) ctx.lineTo(w.x + i * w.w / 10, hy - 10 * Math.sin(i * 1.3) - 6); ctx.lineTo(w.x + w.w, w.y + w.h); ctx.lineTo(w.x, w.y + w.h); ctx.closePath(); ctx.fill();
  if ((o.walker ?? 0) > 0) { const k = clamp(o.walker), x = w.x + w.w * fract(.25 + t * .035); F.du(ctx, x, hy + 4, 46 * k, { walk: t * 5, view: 'side', dir: 1, light: -1 }); }
}
// the finished piece: a small stool (seat, legs, a back), cream-wood, sitting on y
export function piece(ctx, x, y, s, lit = 1, u = 1) {
  if (u <= 0) return;
  const k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * k, s * k);
  const wood = mixHex(mixHex(P.cream, P.shade0, .45), P.night1, .35 * (1 - lit));
  ctx.fillStyle = wood; ctx.fillRect(-44, -54, 88, 12); ctx.fillRect(-40, -42, 9, 42); ctx.fillRect(31, -42, 9, 42); ctx.fillRect(-40, -110, 9, 56); ctx.fillRect(-40, -110, 60, 9);
  ctx.fillStyle = rgba(P.core1, .5 * lit); ctx.fillRect(-44, -54, 88, 3);
  ctx.restore();
}
// a round vignette (a lit little scene lifting away): kind 'nod' | 'piece' | 'walk'
export function vignette(ctx, t, kind, x, y, r, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  ctx.fillStyle = F.lin(ctx, 0, y - r, 0, y + r, [[0, mixHex(P.ind1, P.shade0, .25)], [1, mixHex(P.night1, P.shade0, .2)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.fillStyle = F.rad(ctx, x, y + r * .2, r * 1.2, [[0, rgba(P.halo1, .45)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2);
  if (kind === 'nod') { const nod = Math.sin(t * 2.6) * .28; F.person(ctx, x + r * .05, y + r * 1.55, r * 2.1, { dir: -1, look: nod, light: -1 }); }
  else if (kind === 'piece') { ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.fillRect(x - r, y + r * .38, r * 2, r * .2); piece(ctx, x + 6, y + r * .38, r / 95, 1, 1); }
  else { windowOutside(ctx, t, { x: x - r, y: y - r, w: r * 2, h: r * 2 }, { walker: 0 }); F.du(ctx, x - r * .2 + Math.sin(t * .5) * r * .15, y + r * .5, r * .9, { walk: t * 5, view: 'side', dir: 1, light: -1 }); }
  ctx.restore();
  ctx.strokeStyle = mixHex(P.cream, P.halo0, .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  F.halo(ctx, x, y - r * .2, r * 1.3, .25 * (o.glow ?? 1), P.halo0, P.core0);
}

// ---------------------------------------------------------------- JOB ICONS (line drawings in cream; s = size)
export function jobIcon(ctx, kind, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
  ctx.strokeStyle = o.col ?? CREAM; ctx.fillStyle = o.fill ?? rgba(P.night0, .6); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const R = (x0, y0, w, h, r = 6) => { ctx.beginPath(); ctx.roundRect(x0, y0, w, h, r); ctx.fill(); ctx.stroke(); };
  const Lp = (pts) => { ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); };
  if (kind === 'typewriter') { R(-46, -10, 92, 44); R(-36, -40, 72, 30, 4); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(-27 + i * 18, 2 + j * 14, 3, 0, TAU); ctx.stroke(); } Lp([[-50, -40], [50, -40]]); }
  else if (kind === 'phone') { R(-40, -20, 80, 54); ctx.beginPath(); ctx.arc(0, 8, 16, 0, TAU); ctx.stroke(); Lp([[-44, -30], [-30, -44], [30, -44], [44, -30]]); }
  else if (kind === 'wrench') { Lp([[-36, 36], [18, -18]]); ctx.beginPath(); ctx.arc(26, -26, 18, -2.4, 2.0); ctx.stroke(); ctx.beginPath(); ctx.arc(-38, 38, 8, 0, TAU); ctx.stroke(); }
  else if (kind === 'monitor') { R(-46, -40, 92, 60); Lp([[0, 20], [0, 36]]); Lp([[-22, 38], [22, 38]]); Lp([[-30, -20], [10, -20]]); Lp([[-30, -4], [26, -4]]); }
  else if (kind === 'headset') { ctx.beginPath(); ctx.arc(0, 0, 34, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); R(-44, -6, 18, 30, 5); R(26, -6, 18, 30, 5); Lp([[35, 24], [30, 36], [10, 40]]); }
  else if (kind === 'plough') { Lp([[-48, -30], [-10, 10], [40, 10]]); Lp([[-40, -40], [-4, 0]]); ctx.beginPath(); ctx.moveTo(10, 10); ctx.quadraticCurveTo(30, 40, 48, 26); ctx.stroke(); }
  else if (kind === 'loom') { R(-44, -34, 88, 70, 3); for (let i = 0; i < 6; i++) Lp([[-34 + i * 13.6, -26], [-34 + i * 13.6, 28]]); Lp([[-40, 0], [40, 0]]); }
  ctx.restore();
}

// ---------------------------------------------------------------- THE DUSK FIELD (5.18): ploughman and horse in ink
export function field(ctx, t, o = {}) {
  const hy = 600;
  ctx.fillStyle = F.lin(ctx, 0, -100, 0, hy, [[0, P.night0], [.55, mixHex(P.ind1, P.blue1, .3)], [.88, mixHex(P.blue1, P.shade0, .45)], [1, mixHex(P.halo1, P.shade0, .45)]]); ctx.fillRect(-W, -H, W * 3, hy + H);
  F.halo(ctx, 1300, hy, 260, .7, P.halo0, P.core0);
  ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(1300, hy, 64, Math.PI, 0); ctx.fill();
  ctx.fillStyle = F.lin(ctx, 0, hy, 0, H + 200, [[0, mixHex(P.night1, P.shade0, .25)], [1, P.night0]]); ctx.fillRect(-W, hy, W * 3, H * 2);
  // furrows converging to the sun
  ctx.strokeStyle = rgba(P.halo2, .18); ctx.lineWidth = 2;
  for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(1300, hy); ctx.lineTo(1300 + i * 260, H + 200); ctx.stroke(); }
  // ploughman + horse walking left → right on the furrow line FY
  const x = o.x ?? 760, FY = 690, ph = t * 3.2;
  // the fresh furrow behind the plough, lit gold (the carrier)
  if (o.furrow !== false) F.goldSpan(ctx, [[-200, FY + 4], [x - 70, FY + 4]], 0, 1, { w: 2.2, spark: false, a: .9 });
  horse(ctx, x + 150, FY, 150, ph);
  // the plough (handles + share)
  ctx.strokeStyle = P.night0; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 60, FY - 70); ctx.lineTo(x - 10, FY - 6); ctx.lineTo(x + 70, FY - 40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 10, FY - 6); ctx.lineTo(x - 30, FY + 6); ctx.stroke();
  F.person(ctx, x - 100, FY + 8, 190, { walk: ph, view: 'side', dir: 1, light: 1, lean: .18 });
}
function horse(ctx, x, y, s, ph) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
  ctx.fillStyle = P.night0; ctx.strokeStyle = P.night0; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(0, -64, 56, 24, 0, 0, TAU); ctx.fill();                     // body
  ctx.beginPath(); ctx.moveTo(24, -80); ctx.quadraticCurveTo(52, -108, 70, -124); ctx.lineTo(86, -112); ctx.quadraticCurveTo(70, -86, 58, -50); ctx.closePath(); ctx.fill();   // neck, thick at the shoulder
  ctx.beginPath(); ctx.ellipse(94, -98, 27, 10, 1.0, 0, TAU); ctx.fill();                      // long head, nose down (pulling)
  ctx.beginPath(); ctx.moveTo(70, -122); ctx.lineTo(73, -137); ctx.lineTo(80, -121); ctx.closePath(); ctx.fill();   // ear
  ctx.lineWidth = 7;
  for (const [lx, p] of [[-34, 0], [-22, Math.PI], [28, Math.PI * .5], [40, Math.PI * 1.5]]) { const sw = Math.sin(ph + p) * 10; ctx.beginPath(); ctx.moveTo(lx, -50); ctx.lineTo(lx + sw * .6, -24); ctx.lineTo(lx + sw, 0); ctx.stroke(); }
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-50, -66); ctx.quadraticCurveTo(-66, -50, -60, -30); ctx.stroke();   // tail
  ctx.strokeStyle = rgba(P.halo0, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -62, 52, 22, 0, -1.2, .2); ctx.stroke();   // sun rim
  ctx.restore();
}

// ---------------------------------------------------------------- THE SYNOD HALL (6.01, 6.05)
export const ODD = { x: 1180, y: 586, w: 190, h: 52 };          // the odd name card (front face) in hall space
export const LECT = { x: 560, y: 676, w: 64, h: 86 };           // the lectern's front panel in hall space
const CARDS = [{ x: 420, n: 'CARD. PAROLIN' }, { x: 640, n: 'CARD. FERNÁNDEZ' }, { x: 870, n: 'CARD. CZERNY' }, { x: ODD.x, n: 'OLAH', odd: 1 }, { x: 1440, n: 'R. ROWLANDS', lay: 1 }];
// o: { oddLit 0..1, speaker 0..1 (the lectern + the small speaker at it, spot), hideOdd }
export function hall(ctx, t, o = {}) {
  ctx.fillStyle = F.lin(ctx, 0, -900, 0, 700, [[0, P.night0], [.6, mixHex(P.night1, P.ind1, .5)], [1, mixHex(P.ind1, P.shade0, .15)]]); ctx.fillRect(-2 * W, -2 * H, W * 5, H * 5);
  // the high vault: ribs that converge far above
  ctx.strokeStyle = rgba(P.blue1, .5); ctx.lineWidth = 3;
  for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(960 + i * 300, 560); ctx.quadraticCurveTo(960 + i * 220, -500, 960 + i * 40, -820); ctx.stroke(); }
  // wall panels
  for (let i = -8; i <= 8; i++) { const x = 960 + i * 150; ctx.fillStyle = rgba(i % 2 ? P.ind1 : P.ind2, .55); ctx.fillRect(x - 60, -300, 120, 860); }
  // the central cross (gold, thin) and ceiling lights
  ctx.fillStyle = rgba(GOLD.body, .55); ctx.fillRect(956, 40, 8, 300); ctx.fillRect(900, 120, 120, 8);
  for (let i = -7; i <= 7; i++) F.halo(ctx, 960 + i * 210, -160 + Math.abs(i) * 18, 22, .55 + .05 * Math.sin(t + i), P.halo0, P.core0);
  // stage + the long table
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(-W, 660, W * 3, 400); ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(-W, 658, W * 3, 2);
  // speakers seated behind the table
  CARDS.forEach((c, i) => {
    F.person(ctx, c.x, 600, 210, { dir: 1, look: .05 * Math.sin(t * .5 + i), light: c.x > 960 ? -1 : 1, armR: [.3, .4], armL: [.3, .4] });
    if (!c.odd && !c.lay) { ctx.fillStyle = mixHex(P.night1, P.ind2, .3); ctx.beginPath(); ctx.ellipse(c.x, 600 - 210 * .94, 13, 6, 0, Math.PI, 0); ctx.fill(); }
  });
  ctx.fillStyle = F.lin(ctx, 0, 560, 0, 660, [[0, mixHex(P.ind1, P.blue1, .25)], [1, mixHex(P.night1, P.ind0, .4)]]); ctx.fillRect(300, 560, 1320, 100);
  ctx.fillStyle = rgba(GOLD.line, .55); ctx.fillRect(300, 560, 1320, 3);
  // name cards on the table front
  for (const c of CARDS) {
    if (c.odd && o.hideOdd) continue;
    const x = c.x - ODD.w / 2, y = ODD.y - ODD.h / 2, lit = c.odd ? clamp(o.oddLit ?? 0) : 0;
    ctx.fillStyle = mixHex(PAPER.lit, GOLD.hot, .25 * lit); ctx.fillRect(x, y, ODD.w, ODD.h);
    ctx.strokeStyle = c.odd ? mixHex(PAPER.edge, GOLD.body, lit) : PAPER.edge; ctx.lineWidth = c.odd ? 2 + 2 * lit : 2; ctx.strokeRect(x, y, ODD.w, ODD.h);
    F.glowText(ctx, c.n, c.x, y + 34, { size: 22, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .04 });
    if (lit > 0) F.halo(ctx, c.x, ODD.y, 150, .45 * lit, GOLD.halo, GOLD.core);
  }
  // the lectern (stage left) with the small speaker, a spot from above
  const sp = clamp(o.speaker ?? 0);
  if (sp > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = F.lin(ctx, 0, -600, 0, 760, [[0, rgba(P.halo1, 0)], [1, rgba(P.halo1, .26 * sp)]]);
    ctx.beginPath(); ctx.moveTo(LECT.x - 18, -600); ctx.lineTo(LECT.x + 18, -600); ctx.lineTo(LECT.x + 150, 760); ctx.lineTo(LECT.x - 150, 760); ctx.closePath(); ctx.fill(); ctx.restore();
    F.person(ctx, LECT.x + 6, 762, 150, { dir: 1, look: .1 + .1 * Math.sin(t * .7), light: 1, armR: [.9, 1.2], armL: [.8, 1.1] });
    ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.beginPath(); ctx.moveTo(LECT.x - 46, LECT.y - LECT.h / 2 - 8); ctx.lineTo(LECT.x + 46, LECT.y - LECT.h / 2 - 8); ctx.lineTo(LECT.x + 38, 762); ctx.lineTo(LECT.x - 38, 762); ctx.closePath(); ctx.fill();
    ctx.fillStyle = o.panelCol ?? mixHex(GOLD.mid, P.night1, .35); ctx.fillRect(LECT.x - LECT.w / 2, LECT.y - LECT.h / 2, LECT.w, LECT.h);
    F.halo(ctx, LECT.x, LECT.y - 60, 60, .4 * sp, GOLD.halo, GOLD.core);
  }
  // the audience from behind (rows of heads, rim-lit)
  const r = F.prng(91);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) {
    const x = -120 + i * 140 + (row % 2) * 70 + r() * 30, y = 830 + row * 90, s = 70 + row * 14;
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(x, y + s * .9, s * .75, s * .5, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(x, y, s * .32, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(P.halo2, .28); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, s * .32, -2.6, -.6); ctx.stroke();
  }
}

// ---------------------------------------------------------------- THE WORLD AS DOTS (6.09) · 60 × 23 cells of 6°, rows from 75 N
const LANDROWS = [
  [[10, 17], [18, 26], [32, 32], [39, 39], [45, 48]],
  [[2, 6], [6, 19], [21, 26], [32, 35], [35, 59]],
  [[2, 13], [17, 19], [22, 23], [26, 27], [31, 35], [35, 59]],
  [[3, 13], [17, 19], [29, 29], [31, 34], [35, 56]],
  [[9, 20], [28, 29], [30, 53]],
  [[9, 19], [30, 52], [53, 53]],
  [[9, 17], [28, 29], [32, 50], [51, 51], [53, 53]],
  [[10, 16], [28, 39], [40, 50], [52, 53]],
  [[11, 13], [16, 16], [27, 35], [36, 39], [41, 50]],
  [[12, 15], [16, 16], [27, 36], [36, 39], [41, 44], [45, 48]],
  [[14, 15], [27, 37], [37, 38], [42, 43], [46, 47], [50, 50]],
  [[16, 20], [27, 38], [42, 42], [46, 47], [50, 50]],
  [[17, 21], [29, 37], [46, 47], [48, 49]],
  [[16, 24], [31, 36], [46, 49], [52, 54]],
  [[17, 24], [32, 36], [48, 48], [51, 54]],
  [[17, 23], [32, 36], [37, 38], [50, 54]],
  [[18, 23], [32, 35], [37, 37], [49, 55]],
  [[18, 21], [32, 35], [49, 55]],
  [[18, 21], [33, 34], [49, 50], [53, 55]],
  [[17, 19], [53, 54], [59, 59]],
  [[17, 19], [54, 54], [58, 58]],
  [[17, 18]],
  [[18, 18]],
];
export const MAP = { x0: 222, y0: 150, d: 25 };
export const MAPDOTS = (() => { const out = []; LANDROWS.forEach((rs, r) => { for (const [a, b] of rs) for (let c = a; c <= b; c++) out.push({ c, r, x: MAP.x0 + c * MAP.d, y: MAP.y0 + r * MAP.d }); }); return out; })();
export const mapPt = (c, r) => [MAP.x0 + c * MAP.d, MAP.y0 + r * MAP.d];
export const RICH = (d) => (d.c >= 9 && d.c <= 17 && d.r >= 4 && d.r <= 7) || (d.c >= 28 && d.c <= 33 && d.r >= 3 && d.r <= 6);

// ---------------------------------------------------------------- THE PLANT (6.12 ★ grown) · nobody draws it: it grows
// (x, y) = the soil point, h = full height, u 0..1 growth; returns the leaf positions [{x, y, ang, s}] (screen of the current transform)
const LEAVES = [[.16, -1], [.28, 1], [.4, -1], [.5, 1], [.6, -1], [.68, 1], [.76, -1], [.83, 1], [.89, -1], [.94, 1], [.98, -1]];
export function plant(ctx, t, x, y, h, u, o = {}) {
  u = clamp(u); if (u <= 0) return [];
  const sway = .04 * Math.sin(t * .9), top = u;
  const pt = (q) => { const yy = y - h * q, xx = x + Math.sin(q * 3.1) * 34 * q + sway * h * q * q; return [xx, yy]; };
  // light behind it (the hero light of the wow moment)
  F.halo(ctx, x, y - h * .55 * top, h * .9 * (.4 + .6 * top), .55 * top * (o.glow ?? 1), GOLD.halo, GOLD.core);
  // the stem
  const pts = []; for (let i = 0; i <= 40; i++) pts.push(pt(i / 40 * top));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = GOLD.mid; ctx.lineWidth = 12; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
  ctx.strokeStyle = GOLD.hot; ctx.lineWidth = 4; ctx.stroke();
  ctx.restore();
  const out = [];
  for (const [q, side] of LEAVES) {
    const g = expoOut(span(top, q - .02, q + .22)); if (g <= 0) continue;
    const [lx, ly] = pt(q), ang = side * (1.05 - q * .45) - Math.PI / 2 + .08 * Math.sin(t * 1.3 + q * 9), s = h * .22 * (1.15 - q * .55) * g;
    if (o.leaves !== false) leaf(ctx, lx, ly, ang, s);
    out.push({ x: lx, y: ly, ang, s });
  }
  // the bud on top
  const [bx, by] = pt(top); F.halo(ctx, bx, by, 40, .9 * top, P.halo0, P.core0); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(bx, by, 9, 0, TAU); ctx.fill();
  return out;
}
export function leaf(ctx, x, y, ang, s, o = {}) {
  if (s <= .5) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = F.lin(ctx, 0, -s * .3, s, s * .3, [[0, GOLD.mid], [.5, GOLD.body], [1, GOLD.hot]]);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(s * .5, -s * .42, s, 0); ctx.quadraticCurveTo(s * .5, s * .42, 0, 0); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.core, .8); ctx.lineWidth = Math.max(1, s * .03); ctx.beginPath(); ctx.moveTo(s * .05, 0); ctx.lineTo(s * .9, 0); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- THE BLUEPRINT AIRPLANE (6.11) · drawn part by part
export const PLANE = (() => {
  const S = (pts, cx = 0, cy = 0, k = 1) => pts.map(([x, y]) => [cx + x * k, cy + y * k]);
  return {
    body: S([[-150, 0], [-130, -10], [120, -12], [150, -4], [158, 0], [150, 4], [120, 12], [-130, 10], [-150, 0]]),
    wing: S([[-10, -12], [-50, -130], [-20, -130], [50, -12], [50, 12], [-20, 130], [-50, 130], [-10, 12]]),
    tail: S([[-120, -10], [-150, -56], [-134, -56], [-100, -10], [-100, 10], [-134, 56], [-150, 56], [-120, 10]]),
  };
})();
export function blueprint(ctx, t, x, y, w, h, u, parts) {
  if (u <= 0) return;
  const k = expoOut(u), hh = h * k;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, hh); ctx.clip();
  ctx.fillStyle = mixHex(P.blue0, P.ind1, .55); ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = rgba(P.cream, .12); ctx.lineWidth = 1; for (let gx = x; gx <= x + w; gx += 24) { ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke(); } for (let gy = y; gy <= y + h; gy += 24) { ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke(); }
  const cx = x + w / 2, cy = y + h / 2 - 6, sc = Math.min(w / 380, h / 300);
  for (const [name, pu] of Object.entries(parts)) { const pts = PLANE[name].map(([px, py]) => [cx + px * sc, cy + py * sc]); F.trailCream(ctx, pts, 0, smooth(pu), { w: 2.4 }); }
  // dimension line under the plane
  const du = smooth(clamp(parts.tail ?? 0)); if (du > 0) { ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - 150 * sc, cy + 150 * sc); ctx.lineTo(cx - 150 * sc + 308 * sc * du, cy + 150 * sc); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, hh);
}

// ---------------------------------------------------------------- SPLIT-FLAP TILES (6.13)
const FLAPCH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$';
export function flap(ctx, t, ch, x, y, w, h, tl, o = {}) {
  // a dark tile with a split line; before tl it cycles through characters (each flip ~ 60 ms), lands on ch at tl
  ctx.fillStyle = mixHex(P.night0, P.ind0, .6); ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(8, w * .12)); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = 1.5; ctx.stroke();
  let c = ch, fl = 0;
  if (t < tl) { const n = Math.floor((tl - t) / .06), seed = (x * 7 + y * 13) | 0; c = ch === ' ' ? ' ' : FLAPCH[(seed + n * 11) % FLAPCH.length]; fl = fract((tl - t) / .06); }
  if (c !== ' ') F.glowText(ctx, c, x + w / 2, y + h * .78, { size: h * .78, serif: true, align: 'center', col: o.col ?? GOLD.text, glow: false });
  if (fl > 0) { ctx.fillStyle = rgba(P.night0, .5 * fl); ctx.fillRect(x, y, w, h * .5 * fl); }
  ctx.fillStyle = rgba(P.night0, .85); ctx.fillRect(x, y + h / 2 - 1.5, w, 3);
}

// ---------------------------------------------------------------- CLAPPING HANDS (6.15) · a pair of palms in silhouette
export function clap(ctx, t, x, y, s, ph) {
  const c = Math.abs(Math.sin(t * 7 + ph)), gap = c * s * .28;
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.translate(x + sd * (gap + s * .04), y); ctx.rotate(sd * (.22 + c * .25));
    ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.roundRect(-s * .1, -s * .5, s * .2, s * .62, s * .1); ctx.fill();
    ctx.fillRect(-s * .08, s * .1, s * .16, s * .5);
    ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sd * -s * .1, -s * .42); ctx.lineTo(sd * -s * .1, s * .05); ctx.stroke();
    ctx.restore();
  }
}
