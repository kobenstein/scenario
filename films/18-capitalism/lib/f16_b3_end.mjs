// Film 16 · B3 · world D: the ending (10.06 end → c11 → the end screen). Shares world B's coordinates and camera list (f16_b3_docs);
// at B.tsC only the pen, the hand and the shared sky are in frame, the world below the pen is this one from there on.
//   10.06  the hand carries the pen down onto the book on the top of the tower of seven steps, lets go
//   11.01★ pull back: the tower, the book, the head of light rising behind the city like a moon; the gauge ticks; COMPANY stamp
//   11.02  three hands in turn: a magnifier, a second book, many pens      11.03 CC0 stamp, margin quote, pages lift
//   11.04  the pages fly into the city's windows; threads run from the windows into the head
//   11.05  first light, pull back      11.06 the eighth step (outline), the pen hovers      11.07 the pen writes its line, the head lights
//   11.08  end screen: pull back; head small top centre, tower bottom centre, two faint pages in the free areas, centre free
// Far cards (city, head) are laid out in the screen space of the end-screen camera camE (at()), so the end screen is exact.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
import { sky, label, inOut, hand, paperStamp } from './f16_b3_common.mjs';
import { drawPenHand, PEN_L } from './f16_b3_docs.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cardM, project, aim, F0, prng, rad, lin, halo, glowFill, catmull } = E;

// ------------------------------------------------------------------------------------------------ geometry (world B / D coordinates, card F0)
const ST = { x: -945, y: 2060, w: 400, r: 170, d: 100 };          // the stairs (kit stairs: dx = .9 d, dy = -.5 d)
const BK = { cx: 1700, cy: 720, hw: 240, ph: 112 };               // the open book on the top (7th) step
const STEP8 = { x0: ST.x + 7 * ST.w, yt: ST.y - 8 * ST.r };        // the eighth step (front face top edge)
const LINE8 = { x0: STEP8.x0 + 45, x1: STEP8.x0 + ST.w - 40, y: STEP8.yt + 92 };
const GAUGE = { x: 1290, y: ST.y - 6 * ST.r - 22, R: 112 };        // on the 6th step, left of the book's step
const YOU = { x: ST.x - 70, y: ST.y, h: 250 };
const ZC1 = 2700, ZC2 = 4200, ZH = 6000;                           // city front row, back row, the head
export const camE = aim(F0, 1700, 0, .2575);                       // the end screen
const camEnd = aim(F0, 1700, 0, .238);
const at = (Z, sx, sy) => { const m = cardM(camE, Z); return [(sx - m.e) / m.k, (sy - m.f) / m.k, m.k]; };
// the book's page point (the kit's page() formula, for points needed before the book is drawn)
const bookPt = (s, u, v) => { const sag = BK.ph * .07, lip = BK.ph * .05, top = BK.cy + sag * 4 * u * (1 - u) * .9 - lip * u * u, bot = BK.cy + BK.ph + sag * (1 - u) * .7 - lip * .4 * u; return [BK.cx + s * BK.hw * u, lerp(top, bot, v)]; };
// the head: top centre of the end screen (screen box 260 high), on the far card ZH; it rises like a moon from behind the city
const HD = (() => { const [x, y, k] = at(ZH, 960 - .42 * 260, 46); return { x, y, h: 260 / k, y1: -80, below: 1300 }; })();   // y1: where the moonrise ends (★ 11.01); it climbs on to y on "online"
// the city: two rows of blocks with windows, generated in camE screen space, stored in card design coordinates
function cityRow(seed, Z, x0, x1, top0, top1, bw0, bw1) {
  const r = prng(seed), [, , k] = at(Z, 0, 0), B = [];
  for (let x = x0; x < x1;) {
    const w = bw0 + r() * (bw1 - bw0), top = top0 + r() * (top1 - top0), [dx, dy] = at(Z, x, top), win = [];
    const cw = 13, ch = 17;
    for (let yy = top + 12; yy < 1100; yy += ch) for (let xx = x + 8; xx < x + w - 10; xx += cw) {
      if (r() < .5) continue;
      const [wx, wy] = at(Z, xx, yy); win.push({ x: wx, y: wy, w: 7 / k, h: 9 / k, sx: xx, sy: yy, n: r(), m: r(), cool: r() < .13, fig: r() < .22, scr: r() < .16 });
    }
    B.push({ x: dx, y: dy, w: w / k, h: (1400 - top) / k, win, roof: r() });
    x += w + 2 + r() * 10;
  }
  return B;
}
const CITY2 = cityRow(512, ZC2, -520, 2440, 790, 880, 50, 110);
const CITY1 = cityRow(1066, ZC1, -620, 2540, 840, 960, 70, 170);

export function ending(a, B) {
  const self = {};
  // ------------------------------------------------------------------------------------------------ times (all from phrases)
  const tD0 = B.tApex, tD1 = a.so - .1, tHandOut = a.so + .2;
  const tRise = a.partly - .3, tRiseE = a.wrote + 1.2, tClimb = a.online - .3, tClimbE = a.voEnd + 4.5;
  const headY = (t) => HD.y1 + HD.below * (1 - sineIO(span(t, tRise, tRiseE))) + (HD.y - HD.y1) * sineIO(span(t, tClimb, tClimbE));
  self.headY = headY;
  const tPgFly = a.remember - .2;
  const tM0 = a.oneMore + .3, tM1 = a.whatW + .2, tW0 = a.shapeW - .15, tW1 = a.shapeW + 1.6, tS0 = a.voEnd - .4, tS1 = a.voEnd + 1.8;
  // ------------------------------------------------------------------------------------------------ the pen (continues B.pen)
  const ANG = B.pen(tD0).ang, offG = (ang) => [.27 * PEN_L * Math.cos(ang), .27 * PEN_L * Math.sin(ang)];
  const NIB_REST = bookPt(1, .62, .26), G_REST = [NIB_REST[0] + offG(ANG)[0], NIB_REST[1] + offG(ANG)[1]];
  const NIB_LIE = [STEP8.x0 + 40, STEP8.yt - 34];
  const penAt = (t) => {
    if (t < tD0) return B.pen(t);
    let nib, ang = ANG;
    if (t < tM0) { const e = sineIO(span(t, tD0, tD1)), g0 = B.APEX; const g = [lerp(g0[0], G_REST[0], e) - 70 * Math.sin(Math.PI * e), lerp(g0[1], G_REST[1], e)]; return { g, ang, swell: 1, held: 1 }; }
    const hov = [LINE8.x0, LINE8.y - 46];
    if (t < tW0 - .35) { const e = sineIO(span(t, tM0, tM1)); nib = [lerp(NIB_REST[0], hov[0], e), lerp(NIB_REST[1], hov[1], e) - 120 * Math.sin(Math.PI * e)]; nib[1] += 6 * Math.sin((t - tM1) * 1.4) * smooth(span(t, tM1 - .3, tM1 + .4)); }
    else if (t < tS0) {
      const down = smooth(span(t, tW0 - .35, tW0)) - smooth(span(t, tW1, tW1 + .5)) * .6, w = sineIO(span(t, tW0, tW1));
      nib = [lerp(LINE8.x0, LINE8.x1, w), LINE8.y - 46 * (1 - down) + 4 * Math.sin((t - tW1) * 1.3) * smooth(span(t, tW1, tW1 + .6))];
    } else {
      const e = sineIO(span(t, tS0, tS1)), from = [LINE8.x1, LINE8.y - 28];
      nib = [lerp(from[0], NIB_LIE[0], e), lerp(from[1], NIB_LIE[1], e) - 90 * Math.sin(Math.PI * e)]; ang = lerp(ANG, -.02, e);
    }
    const o = offG(ang); return { g: [nib[0] + o[0], nib[1] + o[1]], ang, swell: 1, held: 1 };
  };
  const handU = (t) => (t < tHandOut ? B.hand(t) : 1 - sineIO(span(t, tHandOut, tHandOut + 1.3)));

  // ------------------------------------------------------------------------------------------------ camera (continues B.keys)
  self.keys = [
    ...B.keys,
    [a.so + .4, aim(F0, 1790, 720, 1.3)],                         // the pen comes down onto the book
    [a.wrote - .3, aim(F0, 1640, 600, .5)],                       // ★ 11.01 the long pull back: tower, book, the head rising
    [a.outside - .35, aim(F0, 1720, 790, .95)],                   // 11.02 in to the book: the hands
    [a.many + .6, aim(F0, 1712, 788, .97)],                       // (slow breathing while the hands come)
    [a.pd + .9, aim(F0, 1480, 740, .9)],                         // 11.03 truck left: room for the margin note
    [a.rewrite + .2, aim(F0, 1510, 735, .97)],
    [a.next + .6, aim(F0, 1700, 680, .36)],                       // 11.04 out over the city while the pages fly
    [a.anyoneR + 1.2, aim(F0, 1700, 300, .3)],                    // 11.05 first light, slow pull back
    [a.whatW + .4, aim(F0, 1990, 700, .74)],                      // 11.06 in to the eighth step and the pen
    [a.shapeW + 1.2, aim(F0, 1975, 715, .72)],
    [a.whose + .25, aim(F0, 1760, -30, .32)],                     // 11.07 out with the thread, up to the head
    [a.voEnd + 5, camE],                                          // 11.08 into the end screen
    [a.end + 5, camEnd],                                           // (beyond the end: the pull back never comes to rest on screen)
  ];
  self.driftAmt = (t) => B.driftAmt(t) * (1 - .5 * smooth(span(t, a.voEnd, a.voEnd + 4)));

  // ------------------------------------------------------------------------------------------------ window schedule
  const all = [...CITY1.flatMap((b) => b.win.map((w) => ({ ...w, row: 1 }))), ...CITY2.flatMap((b) => b.win.map((w) => ({ ...w, row: 2 })))];
  const WIN1 = CITY1.flatMap((b) => b.win), WIN2 = CITY2.flatMap((b) => b.win);
  // page targets: 9 front-row windows spread over the middle of the city
  const targets = [];
  for (const sx of [470, 640, 760, 870, 1010, 1130, 1260, 1390, 1530]) { let best = null; for (const w of WIN1) { if (targets.includes(w)) continue; const d = Math.abs(w.sx - sx) + Math.abs(w.sy - 905) * .7; if (!best || d < best.d) best = { w, d }; } targets.push(best.w); }
  const PAGE_T = targets.map((w, i) => ({ w, t0: tPgFly + i * .28, dur: 1.7 }));
  targets.forEach((w, i) => { w.tl = PAGE_T[i].t0 + PAGE_T[i].dur - .08; w.warm = 1; });
  for (const w of [...WIN1, ...WIN2]) {
    if (w.tl != null) continue;
    if (w.cool) { w.tl = -1e9; w.warm = .35; continue; }
    if (w.n < .42) { w.tl = lerp(a.today - .2, a.next + 1.8, clamp(Math.abs(w.sx - 960) / 1100) * .8 + w.m * .2); w.warm = .8 + .2 * w.m; continue; }
    if (w.n < .62) { w.tl = lerp(a.voEnd + 1, a.end - 1, w.m); w.warm = .75; continue; }
    w.tl = 1e9;
  }
  // threads: 12 lit windows → the head (on "online"); they deliver into the head at the end screen
  const THR = targets.map((w, j) => ({ w, t0: a.online - .1 + j * .12 }));

  // ------------------------------------------------------------------------------------------------ drawing
  self.draw = (ctx, t, c) => {
    const dawn = .85 * smooth(span(t, a.rulesS - .3, a.anyoneR + 1.2));
    card(ctx, c, 40000, () => sky(ctx, t, dawn));
    const rise = span(t, tRise, tRiseE), hy = headY(t);
    if (rise > 0) card(ctx, c, ZH, () => headDraw(ctx, t, hy));
    card(ctx, c, ZC2, () => city(ctx, t, CITY2, .72, dawn));
    card(ctx, c, ZC1, () => city(ctx, t, CITY1, 1, dawn));
    // screen space: the threads from the windows into the head, the pages flying into the windows
    const head = project(c, ZH, HD.x + .2 * HD.h, hy + .3 * HD.h);
    if (head) threads(ctx, t, c, head);
    card(ctx, c, F0, () => stage(ctx, t, c, dawn));
    pages(ctx, t, c);
    if (head) lastThread(ctx, t, c, head);
    self._c = c;
  };

  function headDraw(ctx, t, hy) {
    const bump = (x, t0, d) => Math.sin(Math.PI * clamp((x - t0) / d));
    const lit = .14 * smooth(span(t, a.partly, a.partly + 1.2)) + .16 * smooth(span(t, a.meas, a.meas + .8)) + .25 * smooth(span(t, a.online + .9, a.online + 2.6))
      + .2 * smooth(span(t, a.next - .1, a.next + .9)) + .25 * smooth(span(t, a.whose - .1, a.whose + .8));
    const flash = .45 * bump(t, a.next - .1, 1.1) + .9 * bump(t, a.whose - .08, 1.3);
    return K.head(ctx, HD.x, hy, HD.h, t, { lit, flash, entry: [.2, .3] });
  }

  function city(ctx, t, rows, depth, dawn) {
    const body = mixHex(P.night1, P.ind1, .25 + .3 * dawn * (1 - depth * .4)), rim = rgba(mixHex(P.blue0, P.halo1, dawn * .5), .55 * depth);
    for (const b of rows) {
      ctx.fillStyle = lin(ctx, 0, b.y, 0, b.y + b.h * .6, [[0, mixHex(body, P.ind2, .35)], [1, mixHex(body, P.night0, .4)]]); ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = rim; ctx.fillRect(b.x, b.y, b.w, Math.max(1.5, b.w * .012));
    }
    for (const b of rows) for (const w of b.win) {
      const on = clamp((t - w.tl) / .35);
      if (on <= 0) { ctx.fillStyle = rgba(P.blue1, .32 * depth); ctx.fillRect(w.x, w.y, w.w, w.h); continue; }
      const fl = .92 + .08 * Math.sin(t * (1.3 + w.m) + w.n * 20), warm = w.warm * on * fl;
      ctx.fillStyle = rgba(P.halo1, .1 * warm); ctx.fillRect(w.x - w.w * .6, w.y - w.h * .5, w.w * 2.2, w.h * 2);   // the glow round it
      ctx.fillStyle = w.scr && w.warm > .5 ? mixHex(P.blue1, mixHex(P.blue2, P.cream, .5), on) : mixHex(P.blue1, mixHex(P.halo0, P.core1, .5), warm);
      ctx.fillRect(w.x, w.y, w.w, w.h);
      if (w.fig && on > .5) { ctx.fillStyle = rgba(P.night1, .8); ctx.beginPath(); ctx.arc(w.x + w.w * .5, w.y + w.h * .55, w.w * .17, 0, 6.29); ctx.fill(); ctx.fillRect(w.x + w.w * .22, w.y + w.h * .72, w.w * .56, w.h * .28); }
    }
  }

  // window (card ZC1/ZC2) → screen
  const winScreen = (c, w, row = 1) => project(c, row === 1 ? ZC1 : ZC2, w.x + w.w / 2, w.y + w.h / 2);
  function threads(ctx, t, c, head) {
    const deliver = smooth(span(t, a.voEnd + .3, a.voEnd + 2.6));
    if (t < a.online - .2 || deliver >= 1) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const th of THR) {
      const uh = smooth(span(t, th.t0, th.t0 + 1.4)); if (uh <= 0) continue;
      const p0 = winScreen(c, th.w); if (!p0) continue;
      const mid = [lerp(p0[0], head[0], .45) + (p0[0] - head[0]) * .08, lerp(p0[1], head[1], .5)];
      const pts = catmull([[p0[0], p0[1] - 4, 2], [mid[0], mid[1], 2], [head[0], head[1], 2]], 12).map((p) => [p[0], p[1]]);
      K.trailSpan(ctx, pts, deliver, uh, { w: 1.5, spark: uh < 1, a: .6 - .3 * smooth(span(t, a.next + 1.2, a.next + 3)) });
      if (uh >= 1 && deliver <= 0) { const q = ((t - th.t0) * .3 + th.w.m) % 1; const [px, py] = K.along(pts, q); halo(ctx, px, py, 10, .5 * Math.sin(Math.PI * q), P.halo0, P.core0); }
    }
    ctx.restore();
  }
  function lastThread(ctx, t, c, head) {
    const uh = smooth(span(t, tW1 - .1, a.whose - .05)); if (uh <= 0) return;
    const p0 = project(c, F0, LINE8.x1, LINE8.y); if (!p0) return;
    const mid = [lerp(p0[0], head[0], .5) + 60, lerp(p0[1], head[1], .5)];
    const pts = catmull([[p0[0], p0[1], 2], [p0[0] + 40, p0[1] - 60, 2], [mid[0], mid[1], 2], [head[0], head[1], 2]], 12).map((p) => [p[0], p[1]]);
    const ut = smooth(span(t, a.voEnd + .3, a.voEnd + 2.6));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); K.trailSpan(ctx, pts, ut, uh, { w: 2.4, spark: uh < 1 }); ctx.restore();
  }

  // ---------------------------------------------------------------- card F0: ground, stairs, book, you, gauge, hands, pen, the note
  function stage(ctx, t, c, dawn) {
    E.ground(ctx, [[-5200, ST.y + 8], [1700, ST.y], [8600, ST.y - 8]], { bottom: ST.y + 3200, rim: rgba(mixHex(P.blue0, P.halo1, dawn * .4), .9), stops: [[0, mixHex(P.night1, P.ind1, dawn * .4)], [1, P.night0]] });
    // the book's light falls down the front of the tower
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, BK.cx, BK.cy + 760, 800, [[0, rgba(P.halo1, .12)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(BK.cx - 800, BK.cy - 40, 1600, 1600); ctx.restore();
    const g8 = smooth(span(t, a.oneMore - .1, a.oneMore + 1.0));
    const lit = [.35, .4, .45, .5, .55, .62, .9];
    K.stairs(ctx, t, ST.x, ST.y, g8 > 0 ? 8 : 7, ST.w, ST.r, ST.d, { lit, outline: [7], grow: g8 > 0 ? (7 + g8) / 8 : 1 });
    if (g8 > 0) line8(ctx, t, g8);
    E.castShadow(ctx, YOU.x, ST.y + 1, 26, 140, Math.PI - .25, .45);
    E.du(ctx, YOU.x, ST.y, YOU.h, { dir: 1, look: .9 * smooth(span(t, a.partly - .5, a.partly + 1.5)), light: 1 });
    gauge(ctx, t);
    // the book (lines lift on copy / criticize / rewrite)
    const lift = (i, side) => (side === 'R' && LIFTS.some((l) => l.i === i) ? smooth(span(t, LIFTS.find((l) => l.i === i).t0, LIFTS.find((l) => l.i === i).t0 + .4)) : 0);
    K.book(ctx, BK.cx, BK.cy, BK.hw, BK.ph, t, { lift, warm: .3 * smooth(span(t, a.pd - .2, a.pd + .8)) + .3 * dawn, glow: 1 + .05 * Math.sin(t * .9) });
    paperStamp(ctx, t, 'CC0 · PUBLIC DOMAIN', BK.cx - BK.hw * .5, BK.cy + BK.ph * .55, 19, a.pd, a.remember + .3);
    liftedPages(ctx, t);
    hands(ctx, t);
    note(ctx, t);
    const st = penAt(t);
    drawPenHand(ctx, t, st, handU(t));
  }

  // the eighth step's empty line, and the ink that fills it
  function line8(ctx, t, g8) {
    // a stronger outline for the eighth step (the kit's is a hairline at this distance): top face and the riser, dashed, drawn up
    const o = smooth(span(g8, .15, .9)), x0 = STEP8.x0, yt = STEP8.yt, dx = .9 * ST.d, dy = -.5 * ST.d;
    if (o > 0) {
      const pts = [[x0, ST.y], [x0, yt], [x0 + dx, yt + dy], [x0 + ST.w + dx, yt + dy], [x0 + ST.w, yt], [x0 + ST.w, ST.y]];
      ctx.save(); ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 5;
      const L = pts.slice(1).reduce((s0, q, i) => s0 + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0); ctx.beginPath(); ctx.moveTo(...pts[0]);
      let left = L * o; for (let i = 1; i < pts.length && left > 0; i++) { const sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), f = Math.min(1, left / sl); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); left -= sl; }
      ctx.stroke(); ctx.beginPath(); ctx.moveTo(x0, yt); ctx.lineTo(x0 + ST.w, yt); ctx.globalAlpha = o; ctx.stroke(); ctx.restore();
    }
    const u = smooth(span(g8, .6, 1));
    if (u > 0) { ctx.save(); ctx.setLineDash([10, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo1, .55 * u); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LINE8.x0, LINE8.y); ctx.lineTo(lerp(LINE8.x0, LINE8.x1, u), LINE8.y); ctx.stroke(); ctx.restore(); }
    const w = sineIO(span(t, tW0, tW1));
    if (w > 0) K.trailSpan(ctx, [[LINE8.x0, LINE8.y], [LINE8.x1, LINE8.y]], 0, w, { w: 6, spark: w < 1 });
  }

  // 11.01 the gauge on the 6th step: it rises, ticks once on "measurements"; the COMPANY stamp lands on "wrote the words"
  function gauge(ctx, t) {
    const up = K.rise(span(t, a.meas - 1.0, a.meas - .1)), down = expoIn(span(t, a.paper + .1, a.paper + .7));
    if (up <= 0 || down >= 1) return;
    const { x, y, R } = GAUGE;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 2 * R, y - 3 * R, 4 * R, 3 * R + 22); ctx.clip();
    ctx.translate(0, (1 - up) * R * 1.3 + down * R * 1.4);
    const face = new Path2D(); face.moveTo(x - R, y); face.arc(x, y, R, Math.PI, 0); face.closePath();
    glowFill(ctx, face, R * .5, .45, P.halo1);
    ctx.fillStyle = rad(ctx, x, y - R * .3, R * 1.2, [[0, P.core1], [.6, P.halo0], [1, P.halo1]]); ctx.fill(face);
    ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = 3;
    for (let i = 0; i <= 8; i++) { const q = Math.PI + i / 8 * Math.PI, l = i % 4 === 0 ? 22 : 12; ctx.beginPath(); ctx.moveTo(x + Math.cos(q) * (R - 8), y + Math.sin(q) * (R - 8)); ctx.lineTo(x + Math.cos(q) * (R - 8 - l), y + Math.sin(q) * (R - 8 - l)); ctx.stroke(); }
    // the needle: one tick from the left toward "partly" (about 60 %), overshoot and settle
    const k = span(t, a.meas - .05, a.meas + 1.1), back = k <= 0 ? 0 : 1 - Math.exp(-5 * k) * Math.cos(9 * k);
    const ang = Math.PI + .06 + back * .56 * Math.PI;
    ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + Math.cos(ang) * (R - 26), y + Math.sin(ang) * (R - 26)); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.arc(x, y - 4, 9, 0, 6.29); ctx.fill();
    paperStamp(ctx, t, 'COMPANY', x, y - R * .42, 24, a.wrote, 1e9);
    ctx.restore();
    label(ctx, 'FIRST MEASUREMENTS', x, y + 70, 30, inOut(t, a.meas - .3, a.paper + .05), { align: 'center', spacing: .16 });
  }

  // 11.02 three hands in turn reach for the edges of the book; they all leave before "public domain"
  const HANDS = [
    { k: 'lens', t0: a.outside - .55, w0: [760, 1060], w1: [1330, 905], ang: -.36, L: 125, flip: 1 },
    { k: 'book', t0: a.comparison - .55, w0: [2780, 1000], w1: [2190, 900], ang: Math.PI + .3, L: 125, flip: -1 },
    ...[0, 1, 2, 3, 4].map((i) => ({ k: 'pen', t0: a.many - .5 + [2, 0, 4, 1, 3][i] * .09, w0: [1480 + i * 120 + (i - 2) * 60, 1620], w1: [1500 + i * 110, 1035 + Math.abs(i - 2) * 26], ang: -Math.PI / 2 + (i - 2) * .2, L: 82, flip: i % 2 ? -1 : 1 })),
  ];
  function hands(ctx, t) {
    HANDS.forEach((h, i) => {
      const tOut = a.consPD - .5 + i * .07;
      const u = expoOut(span(t, h.t0, h.t0 + .95)) * (1 - expoIn(span(t, tOut, tOut + .7)));
      if (u <= 0) return;
      const wx = lerp(h.w0[0], h.w1[0], u), wy = lerp(h.w0[1], h.w1[1], u) + 3 * Math.sin(t * 1.7 + i);
      const m = E.handMatrix(wx, wy, h.ang, h.L, h.flip), c = Math.cos(h.ang), s = Math.sin(h.ang);
      const pc = [wx + c * h.L * 1.0, wy + s * h.L * 1.0];
      if (h.k === 'book') K.bookClosed(ctx, pc[0] - 10, pc[1] + 120, 230, t);
      hand(ctx, m, { pose: 'hold' });
      if (h.k === 'lens') {
        const e = [pc[0] + c * 105, pc[1] + s * 105], lc = [e[0] + c * 78, e[1] + s * 78];
        ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = mixHex(P.ind2, P.blue1, .4); ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(pc[0], pc[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
        ctx.fillStyle = rgba(P.blue0, .16); ctx.beginPath(); ctx.arc(lc[0], lc[1], 74, 0, 6.29); ctx.fill();
        ctx.strokeStyle = mixHex(P.ind2, P.blue1, .5); ctx.lineWidth = 13; ctx.stroke(); ctx.strokeStyle = rgba(P.halo1, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(lc[0], lc[1], 81, 0, 6.29); ctx.stroke();
        ctx.strokeStyle = rgba(P.core0, .55); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(lc[0], lc[1], 56, -2.5, -1.7); ctx.stroke(); ctx.restore();
      }
      if (h.k === 'pen') { const nib = [wx + c * h.L * 1.75, wy + s * h.L * 1.75]; K.pen(ctx, nib[0], nib[1], h.ang + Math.PI + .12 * h.flip, 230, t, { glow: .5 }); }
    });
  }

  // 11.03 the margin note (the authors' own words), a thread from the page's margin as its rule
  function note(ctx, t) {
    const t0 = a.flawed - .45, t1 = a.remember - .4;
    if (t < t0 - .6 || t > t1 + 1.4) return;
    const x = 590, y = 560;
    const uh = smooth(span(t, t0 - .6, t0 + .4)), ut = smooth(span(t, t1 + .2, t1 + 1.0));
    const pts = catmull([[BK.cx - BK.hw + 12, BK.cy + 60, 2], [1300, 780, 2], [x - 40, 760, 2], [x - 40, y - 70, 2]], 12).map((p) => [p[0], p[1]]);
    K.trailSpan(ctx, pts, Math.max(ut, uh >= 1 ? .55 : 0), uh, { w: 2.2, spark: uh < 1 });
    K.quote(ctx, t, { text: 'no doubt flawed in many ways', attr: 'ANTHROPIC.COM/CONSTITUTION · ANNOUNCEMENT, JANUARY 2026', attrSize: 24, x, y, size: 70, w: 800, t0, t1, gold: [['flawed', a.flawed + .25]] });
  }

  // copy / criticize / rewrite: three lines of the right page lift as loose pages and hover; then they fly
  const LIFTS = [{ i: 2, t0: a.copy - .1, to: [1560, 520], r: -.18 }, { i: 4, t0: a.crit - .1, to: [1730, 470], r: .08 }, { i: 6, t0: a.rewrite - .1, to: [1900, 530], r: .2 }];
  const PG = { w: 74, h: 96 };
  function pageShape(ctx, x, y, s, rot, a0 = 1) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a0;
    const p = new Path2D(); p.rect(-PG.w / 2, -PG.h / 2, PG.w, PG.h);
    glowFill(ctx, p, 30, .4, P.halo1);
    ctx.fillStyle = rad(ctx, 0, 0, 80, [[0, P.core0], [.5, P.core1], [1, P.halo1]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = 3; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-26, -30 + k * 15); ctx.lineTo(24 - (k % 2) * 14, -30 + k * 15); ctx.stroke(); }
    ctx.restore();
  }
  const liftPos = (t, L) => { const e = sineIO(span(t, L.t0, L.t0 + 1.1)), from = bookPt(1, .5, (L.i + .5) / 9); return [lerp(from[0], L.to[0], e), lerp(from[1], L.to[1], e) + 8 * Math.sin(t * 1.5 + L.i), lerp(.4, 1, e), L.r * e + .05 * Math.sin(t * 1.1 + L.i)]; };
  function liftedPages(ctx, t) {
    LIFTS.forEach((L, j) => { if (t < L.t0 || t >= PAGE_T[j].t0) return; const [x, y, s, r] = liftPos(t, L); pageShape(ctx, x, y, s, r); });
  }
  // 11.04 the pages fly into the windows (screen space: from the F0 card into the city cards)
  function pages(ctx, t, c) {
    if (t < tPgFly || t > PAGE_T[PAGE_T.length - 1].t0 + 2) return;
    const kF = cardM(c, F0); if (!kF) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    PAGE_T.forEach((pg, j) => {
      const q = span(t, pg.t0, pg.t0 + pg.dur); if (q <= 0 || q >= 1) return;
      let s0;
      if (j < 3) { const [x, y] = liftPos(pg.t0, LIFTS[j]); s0 = project(c, F0, x, y); }
      else s0 = project(c, F0, ...bookPt(j % 2 ? 1 : -1, .3 + .1 * (j % 3), .4));
      const s1 = winScreen(c, pg.w); if (!s0 || !s1) return;
      const e = sineIO(q), cp = [lerp(s0[0], s1[0], .4), Math.min(s0[1], s1[1]) - 160 - 40 * (j % 3)];
      const x = (1 - e) ** 2 * s0[0] + 2 * e * (1 - e) * cp[0] + e * e * s1[0], y = (1 - e) ** 2 * s0[1] + 2 * e * (1 - e) * cp[1] + e * e * s1[1];
      const sc = lerp(kF.k * (j < 3 ? 1 : .55), s1[2] * 7 / 74 * 1.4, e), flip = Math.cos(q * 6 + j);
      ctx.save(); ctx.translate(x, y); ctx.scale(.35 + .65 * Math.abs(flip), 1); pageShape(ctx, 0, 0, sc, -.2 + .4 * e); ctx.restore();
    });
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------ badge (sinks as the ending begins)
  self.badgeOut = (ctx, t) => {
    const u = span(t, a.so + .2, a.so + .75); if (u >= 1) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(0, 0, 480, 84); ctx.clip(); ctx.translate(0, expoIn(u) * 40);
    const BX = 72, BY = 76, STP = 12, RS = 6;
    for (let i = 0; i < 7; i++) { const cur = i === 6, br = cur ? .8 + .2 * Math.sin(t * 2.1) : 1; ctx.fillStyle = rgba(cur ? P.core1 : P.halo1, (cur ? 1 : .75) * br); ctx.fillRect(BX + i * STP, BY + 2 - (i + 1) * RS, STP - Math.max(1, STP * .14), RS * (i + 1)); }
    E.glowText(ctx, 'LEVEL 7', BX + 7 * STP + 16, BY, { size: 20, weight: 600, spacing: .32, col: rgba(P.cream, .9), glow: false });
    ctx.restore();
  };

  // ------------------------------------------------------------------------------------------------ end screen: two faint pages, drawn by threads
  const PGL = [100, 262, 770, 690], PGR = [1150, 262, 1820, 690];
  const outline = (r, side) => {   // an open page: the top edge sags toward the spine (inner side), the outer corners lift
    const [x0, y0, x1, y1] = r, inner = side < 0 ? x1 : x0, outer = side < 0 ? x0 : x1, mid = (x0 + x1) / 2;
    return catmull([[inner, y1 + 6, 2], [mid, y1 + 2, 2], [outer, y1 - 8, 2], [outer, y0 + 8, 2], [mid, y0 + 10, 2], [inner, y0 + 22, 2], [inner, y1 + 6, 2]], 10).map((p) => [p[0], p[1]]);
  };
  const OL = outline(PGL, -1), OR = outline(PGR, 1);
  self.overlay = (ctx, t) => {
    const t0 = a.voEnd + .9; if (t < t0) return;
    const c = self._c; const bk = c ? project(c, F0, BK.cx, BK.cy + BK.ph * .5) : [960, 740];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    [[OL, PGL, 0], [OR, PGR, .35]].forEach(([ol, r, d]) => {
      const lead = [[bk[0], bk[1]], [lerp(bk[0], ol[0][0], .5), bk[1] - 40], ol[0]];
      const lp = catmull(lead.map((p) => [p[0], p[1], 2]), 10).map((p) => [p[0], p[1]]), pts = [...lp, ...ol];
      const len = (q) => q.slice(1).reduce((s0, v, i) => s0 + Math.hypot(v[0] - q[i][0], v[1] - q[i][1]), 0), f = len(lp) / len(pts);
      const uh = sineIO(span(t, t0 + d, t0 + d + 3.2)), ut = f * smooth(span(t, t0 + d + 1.2, t0 + d + 2.6));
      const br = .5 + .08 * Math.sin(t * .8 + d * 5);
      K.trailSpan(ctx, pts, ut, uh, { w: 1.6, spark: uh < 1, a: br * 1.6 });
      const fill = smooth(span(uh, .85, 1));
      if (fill > 0) { const p = new Path2D(); ol.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]))); p.closePath(); ctx.fillStyle = rgba(P.halo1, .045 * fill * (1 + .2 * Math.sin(t * .7 + d * 3))); ctx.fill(p); }
    });
    ctx.restore();
  };
  return self;
}
export const PROBE = { HD, CITY1, CITY2 };   // (B3 probe tool only)
