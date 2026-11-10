// Film 25 · builder B1 · the scenes behind windows (sub-worlds, local camera; home = cam3() shows the design layout).
//   office(ctx, c, t, st)  2.05/2.06: an office at night, the young desk empty (chair pushed in, screen asleep), seniors at work far
//                          back under the one warm lamp; the office door shut, a line of light under it. → st.doorRect() for the clip.
//   booth(ctx, c, t, st)   3.07/3.08: an empty voice booth; the microphone, the pop filter, a shelf with the lamp off; the one warm
//                          light is the control-room window behind. st.wave(ctx) draws the waveform in front of the microphone.
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, halo, rad, lin, prng } = E;
const TAU = Math.PI * 2;

// seeded city windows (computed once)
const CITY = (() => { const r = prng(2511), out = []; let x = 280; while (x < 1540) { const w = 60 + r() * 110, h = 70 + r() * 200; out.push({ x, w, h, win: Array.from({ length: 9 }, () => [r(), r(), r()]) }); x += w + 8 + r() * 26; } return out; })();
const OFFICE_FLOOR = { far: 700, F0: 900 };
export const OFFICE = { door: { Z: 2300, x: 1500, y: 300, w: 210, h: 470 }, lamp: { Z: 2900, x: 585, y: 598 }, desk: { x: 760, x1: 1240, top: 760 } };

export function office(ctx, c, t, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); ctx.restore();
  const wallC = mixHex(P.night1, P.ind0, .35);
  // back wall with the big night window (city)
  E.card(ctx, c, 4200, () => {
    ctx.fillStyle = wallC; ctx.fillRect(-2600, -2600, 7200, 3240);
    ctx.fillStyle = lin(ctx, 0, 640, 0, 1600, [[0, mixHex(P.night1, P.ind0, .2)], [1, P.night0]]); ctx.fillRect(-2600, 640, 7200, 2600);
    ctx.strokeStyle = rgba(P.blue0, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-2600, 640); ctx.lineTo(4600, 640); ctx.stroke();
    const wx = 260, wy = 110, ww = 1300, wh = 440;
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, P.night0], [.7, mixHex(P.ind0, P.blue0, .3)], [1, mixHex(P.blue0, P.ind1, .4)]]); ctx.fillRect(wx, wy, ww, wh);
    E.stars(ctx, 77, 60, t, [wx, wy, ww, wh * .5], .6);
    for (const b of CITY) {
      const by = wy + wh - b.h * .9;
      ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.fillRect(b.x, by, b.w, wy + wh - by);
      b.win.forEach(([u, v, k], j) => { if (k < .55) return; const on = .35 + .3 * Math.sin(t * .4 + j + b.x); ctx.fillStyle = rgba(mixHex(P.cream, '#9fc2ee', .5), .35 * on); ctx.fillRect(b.x + 8 + u * (b.w - 20), by + 10 + v * (b.h * .8), 5, 7); });
    }
    ctx.restore();
    ctx.fillStyle = mixHex(wallC, P.night0, .3);
    for (let k = 1; k < 4; k++) ctx.fillRect(wx + ww * k / 4 - 5, wy, 10, wh);
    ctx.fillRect(wx, wy + 150, ww, 8); ctx.fillRect(wx - 14, wy + wh, ww + 28, 14);
  });
  // the far desks: two seniors at work, the warm lamp (hero light of the office)
  E.card(ctx, c, 2900, () => {
    const fy = OFFICE_FLOOR.far, L = OFFICE.lamp;
    E.lightPool(ctx, 300, 860, fy, 120, 40, .7);
    const lampA = st.lamp ?? 1;
    halo(ctx, L.x, L.y + 20, 360, .32 * lampA, P.halo1, P.halo0);
    // senior A (lit by the lamp), senior B (lit by a cool screen)
    E.person(ctx, 455, fy, 168, { light: 1, dir: 1, look: -.2 + .05 * Math.sin(t * .6), armR: [1.05 + .06 * Math.sin(t * 6.3), 1.65], armL: [.8 + .06 * Math.sin(t * 5.1 + 1), 1.5], rim: mixHex(P.halo0, P.coat, .3) });
    E.person(ctx, 770, fy, 160, { light: -1, dir: -1, look: .1 + .04 * Math.sin(t * .5 + 2), armR: [1.0 + .05 * Math.sin(t * 5.7), 1.6], armL: [.85, 1.5 + .05 * Math.sin(t * 6.6)] });
    for (const [x0, x1, scr] of [[330, 640, 0], [650, 900, 1]]) {
      ctx.fillStyle = mixHex(P.ind2, P.night1, .45); ctx.fillRect(x0, fy - 95, x1 - x0, 14); ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(x0 + 8, fy - 81, x1 - x0 - 16, 81);
      const mx = scr ? 690 : 380; ctx.fillStyle = scr ? lin(ctx, 0, fy - 175, 0, fy - 110, [[0, mixHex(F.COOL.body, P.night1, .45)], [1, mixHex(F.COOL.deep, P.night1, .5)]]) : P.night0; ctx.fillRect(mx, fy - 178, 120, 72);
      if (scr) halo(ctx, mx + 60, fy - 140, 120, .18, F.COOL.halo, F.COOL.body);
    }
    // the lamp: arm + shade + light cone
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .3); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(620, fy - 95); ctx.lineTo(628, L.y - 40); ctx.lineTo(L.x + 14, L.y - 12); ctx.stroke();
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.beginPath(); ctx.moveTo(L.x - 30, L.y + 6); ctx.quadraticCurveTo(L.x - 6, L.y - 30, L.x + 22, L.y - 14); ctx.lineTo(L.x + 16, L.y + 9); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, L.y, 0, fy - 90, [[0, rgba(P.halo0, .4 * lampA)], [1, rgba(P.halo1, .06 * lampA)]]);
    ctx.beginPath(); ctx.moveTo(L.x - 26, L.y + 6); ctx.lineTo(L.x + 14, L.y + 8); ctx.lineTo(L.x + 80, fy - 95); ctx.lineTo(L.x - 170, fy - 95); ctx.closePath(); ctx.fill(); ctx.restore();
    halo(ctx, L.x - 6, L.y + 6, 46, .9 * lampA, P.halo0, P.core0);
  });
  // the office door (right), shut; a line of light under it
  E.card(ctx, c, OFFICE.door.Z, () => {
    const d = OFFICE.door, fy = d.y + d.h;
    ctx.fillStyle = mixHex(wallC, P.night0, .2); ctx.fillRect(d.x - 60, -400, 1400, fy + 400);
    ctx.fillStyle = lin(ctx, 0, fy, 0, fy + 500, [[0, mixHex(P.night1, P.ind0, .25)], [1, P.night0]]); ctx.fillRect(d.x - 60, fy, 1400, 600);
    ctx.fillStyle = mixHex(P.ind1, P.night1, .5); ctx.fillRect(d.x - 16, d.y - 16, d.w + 32, d.h + 16);
    ctx.fillStyle = lin(ctx, d.x, 0, d.x + d.w, 0, [[0, mixHex(P.night1, P.ind1, .35)], [1, mixHex(P.night1, P.ind0, .6)]]); ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.fillStyle = mixHex(P.blue1, P.night1, .4); ctx.beginPath(); ctx.arc(d.x + d.w - 26, d.y + d.h * .55, 7, 0, TAU); ctx.fill();
    const lu = .8 + .2 * Math.sin(t * 1.3);
    ctx.fillStyle = rgba(P.core1, .85 * lu); ctx.fillRect(d.x + 4, fy - 3, d.w - 8, 4);
    ctx.fillStyle = lin(ctx, 0, fy, 0, fy + 60, [[0, rgba(P.halo1, .28 * lu)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.moveTo(d.x + 4, fy); ctx.lineTo(d.x + d.w - 4, fy); ctx.lineTo(d.x + d.w + 60, fy + 60); ctx.lineTo(d.x - 60, fy + 60); ctx.closePath(); ctx.fill();
  });
  // the young desk (front): empty, chair pushed in, the screen asleep
  E.card(ctx, c, F0(), () => {
    const D = OFFICE.desk, fy = OFFICE_FLOOR.F0;
    ctx.fillStyle = lin(ctx, 0, fy, 0, fy + 400, [[0, mixHex(P.night1, P.ind0, .3)], [1, P.night0]]); ctx.fillRect(-1500, fy, 4800, 800);
    ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse((D.x + D.x1) / 2, fy + 4, 320, 18, 0, 0, TAU); ctx.fill();
    // monitor (asleep): dark glass, a faint reflection, a slow standby dot
    const mx = 905, my = 575, mw = 230, mh = 150;
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(mx + mw / 2 - 8, my + mh, 16, D.top - my - mh); ctx.fillRect(mx + mw / 2 - 44, D.top - 8, 88, 8);
    ctx.fillStyle = lin(ctx, mx, my, mx + mw, my + mh, [[0, mixHex(P.night0, P.ind0, .4)], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(mx, my, mw, mh, 6); ctx.fill();
    ctx.strokeStyle = rgba(P.blue1, .6); ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.fillStyle = rgba(P.cream, .04); ctx.beginPath(); ctx.moveTo(mx + 40, my); ctx.lineTo(mx + 110, my); ctx.lineTo(mx + 40, my + mh); ctx.lineTo(mx - 30, my + mh); ctx.closePath(); ctx.fill(); ctx.restore();
    const blink = .35 + .65 * (.5 + .5 * Math.sin(t * 1.6));
    halo(ctx, mx + mw - 16, my + mh - 12, 18, .5 * blink, F.COOL.halo, F.COOL.body);
    // desk
    ctx.fillStyle = lin(ctx, 0, D.top - 6, 0, D.top + 14, [[0, mixHex(P.blue1, P.ind1, .4)], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(D.x, D.top - 6, D.x1 - D.x, 18, 4); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind0, .45); ctx.fillRect(D.x + 14, D.top + 12, D.x1 - D.x - 28, fy - D.top - 12);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .25); ctx.beginPath(); ctx.roundRect(950, D.top - 14, 150, 9, 3); ctx.fill();
    // a mug and a closed notebook: somebody's place, not somebody's day
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(1160, D.top - 34, 26, 28); ctx.fillRect(800, D.top - 10, 90, 6);
  });
  // the chair, pushed in (in front of the desk)
  E.card(ctx, c, 1550, () => {
    const fy = 970;
    ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.beginPath(); ctx.roundRect(950, 760, 150, 130, 18); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .45); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = P.night0; ctx.fillRect(1018, 890, 14, 60);
    ctx.strokeStyle = P.night0; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(950, fy); ctx.lineTo(1100, fy); ctx.moveTo(1025, 950); ctx.lineTo(1025, fy); ctx.stroke();
  });
  // a dark partition in the foreground (left): parallax
  E.card(ctx, c, 1100, () => {
    ctx.fillStyle = lin(ctx, -200, 0, 160, 0, [[0, P.night0], [1, mixHex(P.night1, P.ind0, .3)]]); ctx.fillRect(-400, 180, 560, 1400);
    ctx.fillStyle = rgba(P.blue0, .45); ctx.fillRect(156, 180, 4, 1400);
  });
}
// the door's screen rectangle (for the clip plate) with local camera c
export function officeDoorRect(c) {
  const d = OFFICE.door, a = E.project(c, d.Z, d.x, d.y), b = E.project(c, d.Z, d.x + d.w, d.y + d.h);
  return a && b ? { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] } : null;
}
function F0() { return E.F0; }

// ------------------------------------------------------------------------------------------------ the voice booth
export const BOOTH = { mic: [905, 455], pop: [800, 470], shelf: { Z: 2400, x: 1330, x1: 1720, y: 700 } };
export function booth(ctx, c, t, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.65, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); ctx.restore();
  // back wall: foam tiles; the control-room window (warm, the one light; nobody behind it)
  E.card(ctx, c, 3600, () => {
    ctx.fillStyle = mixHex(P.night1, P.ind0, .2); ctx.fillRect(-2400, -2400, 7000, 3290);
    for (let y = -1200; y < 880; y += 120) for (let x = -1800; x < 3800; x += 120) {
      const k = ((x / 120 + y / 120) & 1) ? .1 : 0;
      ctx.fillStyle = lin(ctx, 0, y, 0, y + 108, [[0, mixHex(P.ind0, P.night1, .35 + k)], [1, mixHex(P.night1, P.night0, .3)]]); ctx.beginPath(); ctx.roundRect(x + 6, y + 6, 108, 108, 10); ctx.fill();
    }
    ctx.fillStyle = lin(ctx, 0, 880, 0, 1700, [[0, mixHex(P.night1, P.ind0, .3)], [1, P.night0]]); ctx.fillRect(-2400, 880, 7000, 1500);
    const wx = 200, wy = 300, ww = 330, wh = 230, A = st.window ?? 1;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.fillRect(wx - 18, wy - 18, ww + 36, wh + 36);
    ctx.fillStyle = lin(ctx, wx, wy, wx + ww, wy + wh, [[0, mixHex(P.halo0, P.shade0, .2)], [.5, mixHex(P.halo1, P.halo0, .4)], [1, mixHex(P.shade0, P.night1, .4)]]); ctx.globalAlpha = A; ctx.fillRect(wx, wy, ww, wh); ctx.globalAlpha = 1;
    ctx.fillStyle = mixHex(P.shade0, P.night1, .6); ctx.fillRect(wx, wy + wh * .62, ww, wh * .38);          // the empty desk of the control room
    ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(wx + ww / 2 - 4, wy, 8, wh);
    halo(ctx, wx + ww / 2, wy + wh / 2, 420, .28 * A, P.halo1, P.halo0);
  });
  // the shelf (a slab) with the lamp off and a pair of headphones
  E.card(ctx, c, BOOTH.shelf.Z, () => {
    const s = BOOTH.shelf;
    F.slab(ctx, t, s.x, s.y, s.x1 - s.x, 26, { col: 'stone' });
    ctx.fillStyle = mixHex(P.ind2, P.night1, .5); ctx.fillRect(s.x + 90, s.y - 100, 8, 88);
    ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.beginPath(); ctx.moveTo(s.x + 50, s.y - 96); ctx.lineTo(s.x + 140, s.y - 96); ctx.lineTo(s.x + 120, s.y - 150); ctx.lineTo(s.x + 70, s.y - 150); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = P.cream; ctx.globalAlpha = .5; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(s.x + 270, s.y - 20, 46, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = P.blue2; for (const dx of [228, 312]) { ctx.beginPath(); ctx.ellipse(s.x + dx, s.y - 26, 16, 22, 0, 0, TAU); ctx.fill(); }
  });
  // the microphone on its stand, the pop filter
  E.card(ctx, c, E.F0, () => {
    const [mx, my] = BOOTH.mic, [px, py] = BOOTH.pop, fy = 960;
    ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.ellipse(1010, fy + 4, 120, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .25); ctx.lineCap = 'round'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(920, fy); ctx.lineTo(1010, fy - 16); ctx.lineTo(1100, fy); ctx.moveTo(1010, fy - 16); ctx.lineTo(1010, 560); ctx.lineTo(mx + 30, my + 20); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1010, 600); ctx.quadraticCurveTo(900, 560, px + 10, py + 60); ctx.stroke();
    ctx.fillStyle = lin(ctx, mx - 30, 0, mx + 30, 0, [[0, P.night1], [.6, mixHex(P.ind2, P.blue1, .4)], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(mx - 30, my - 80, 60, 140, 28); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = 2; ctx.stroke();
    for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(mx - 22, my - 60 + k * 12, 44, 4); }
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .2); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(mx, my, 50, 70, 0, Math.PI * .1, Math.PI * .9); ctx.stroke();
    ctx.fillStyle = rgba(P.ind0, .45); ctx.beginPath(); ctx.ellipse(px, py, 64, 80, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .2); ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(P.blue1, .25); ctx.lineWidth = 1.2; for (let k = -90; k < 90; k += 9) { ctx.beginPath(); ctx.moveTo(px + k, py - 90); ctx.lineTo(px + k + 40, py + 90); ctx.stroke(); } ctx.restore();
  });
  if (st.wave) st.wave(ctx, c);
}
