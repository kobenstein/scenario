// Film 15 · B2 · c11 (331.00 – 380.30) · Station 7b: what reach looks like, the slowest part is us, the HIV shot in Zambia.
// The world of c10 goes on (the room's floor line, the open night, the road of light): no hard cut at 331.
//   11.01  the camera travels along the road: FIND (a ring of light finds the next one) · BRING (the fix reaches them: warm) ·
//          KEEP GOING (the light runs on under the rest, all of them warm), each word on a paper slip on a stake
//   11.02  at the end of the road a budget book of light on a stand opens ("ministries"); one row glows: HEALTH BUDGET
//          ("budgets"); far off, a small lab with a cool window stays small ("Not for a lab")
//   11.03  the glowing row slides out of the book and becomes a time bar: a short bright SCIENCE, a long dark US: DECIDING;
//          on "finish" it starts to fill
//   11.04  the bar settles over a gap in the ground and is a bridge: small figures lay paper strips ("build")
//   11.05★ a syringe of light forms where the strips began and crosses the bridge to a clinic at evening (Zambia): a nurse
//          holds it: TWICE A YEAR · HIV PREVENTION SHOT · LENACAPAVIR · CHAI 2026. Pull back: the clinic shrinks into a warm
//          light on a hand-drawn map of Africa: Zambia, Kenya, Nigeria, South Africa light on their words
//   11.06  the lights of the map line up as a queue; the four warm ones at the front; the shot rises out of Zambia's light and
//          lands at the front: NOT LAST
//   11.07  the shot flies off across the night, growing, a fine gold trail behind it, and comes to rest in the middle → plateShot
import { Path2D } from '@napi-rs/canvas';
import * as C from './f15_b2_common.mjs';
import { V, viewCam, ROOM } from './f15_b2_c09.mjs';
import { ROAD, FIG, figX } from './f15_b2_c10.mjs';
import { SHOT, plateShot } from './f15_seams.mjs';
const { E, F } = C;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, aim, camDrift, F0, prng, drift } = E;

const FL = ROOM.floor;
const STAKES = [{ x: 2590, s: 'FIND' }, { x: 2800, s: 'BRING' }, { x: 3440, s: 'KEEP GOING' }];
const BOOK = { x: 4300, y: 770, w: 390, h: 250 };          // the open book (spread), bottom centre on its stand
const LAB = { x: 4930, w: 70, h: 52 };
const BAR = { x0: 4560, xs: 4800, x1: 6120, y: 600, h: 54 };
const GAP = { x0: 5060, x1: 6120 };
const CLINIC = { x: 6820, w: 380, h: 270 }, NURSE = { x: 6560, h: 300 };
// the map (its own design space on F0): Africa from lon/lat
const KM = 12.2, mx = (lon) => 1100 + (lon - 17) * KM, my = (lat) => 540 - (lat - 1) * KM;
const AFR = [[-5.9, 35.8], [-1.5, 35.1], [3, 36.8], [10.2, 37.2], [11, 35.2], [10.1, 34], [11.2, 33.2], [15.2, 32.3], [19.9, 30.6], [20.1, 32.1], [23, 32.6], [25, 31.6],
  [29.9, 31.2], [32.3, 31.3], [32.6, 29.9], [33.6, 27.6], [35.5, 23.9], [37.2, 19.6], [38.5, 18], [39.5, 15.5], [41.7, 13.3], [43.3, 12.3], [44.5, 10.4], [49, 11.3],
  [51.3, 11.8], [51, 10.4], [49.8, 7.5], [48, 4.5], [45.3, 2], [42.5, -.4], [40.9, -2.3], [39.7, -4], [39.3, -6.8], [40.4, -10.5], [40.7, -14.5], [39, -16.8],
  [36.5, -18.8], [34.8, -19.8], [35.5, -22], [35.5, -24], [32.6, -25.9], [32.4, -28.6], [31, -29.9], [28, -32.7], [25.6, -33.9], [22, -34.1], [20, -34.8],
  [18.4, -33.9], [18, -32], [16.5, -28.6], [15.2, -26.6], [14.5, -22.9], [13.4, -20.5], [11.8, -17.2], [12.3, -13.8], [13.4, -12.6], [13.2, -8.8], [12.2, -6],
  [11.8, -4.8], [9.3, -1], [9.4, .4], [9.6, 3.9], [8.5, 4.5], [6, 4.3], [4.5, 6.2], [3.4, 6.4], [-.2, 5.5], [-3, 5.1], [-4, 5.3], [-7.5, 4.4], [-10.8, 6.3],
  [-13.2, 8.5], [-15, 10.8], [-17.4, 14.7], [-16.5, 19.5], [-17, 20.9], [-16, 23.7], [-13.2, 27.7], [-9.8, 29.5], [-9.6, 32], [-7.6, 33.6], [-6.8, 34]];
const MAD = [[49.3, -12], [50.4, -15.5], [49.5, -17.5], [48.5, -21], [47.2, -25], [45, -25.4], [43.6, -23.5], [43.3, -21.5], [44.4, -16.6], [46.4, -15.7], [48, -13.7]];
const PTS = (arr) => arr.map(([lo, la]) => [mx(lo), my(la)]);
const PLACES = [
  { n: 'ZAMBIA', lon: 27.8, lat: -13.5, w: 'Zambia', dx: 26, dy: 8 }, { n: 'KENYA', lon: 37.9, lat: .2, w: 'Kenya', dx: 26, dy: 8 },
  { n: 'NIGERIA', lon: 8.7, lat: 9.1, w: 'Nigeria', dx: -26, dy: 8, al: 'right' }, { n: 'SOUTH AFRICA', lon: 24.5, lat: -29, w: 'South', dx: 26, dy: 8 },
];
const OTHERS = [[31, 27], [39, 9], [23, -3], [-1, 7.5], [-15, 14.5], [-6, 32], [35, -6], [17, -12], [30, 15], [-2, 17], [46.8, -19], [35, -18], [18, 15], [12, 5], [32.3, 1.3], [3, 28], [20, 27]];
const QY = 1200, QX0 = 600, QG = 54;                         // the queue (map space): front at the left

function smoothPoly(pts) {
  const p = new Path2D(), n = pts.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let m0 = mid(pts[n - 1], pts[0]); p.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) { const q = pts[i], m = mid(q, pts[(i + 1) % n]); p.quadraticCurveTo(q[0], q[1], m[0], m[1]); }
  p.closePath(); return p;
}
const AFRP = smoothPoly(PTS(AFR)), MADP = smoothPoly(PTS(MAD));

function warmDot(ctx, t, x, y, r, on = 1) {
  if (r <= .3) return;
  E.halo(ctx, x, y, r * 4.2, .45 * Math.max(.25, on), P.halo1, P.core1);
  const p = new Path2D(); p.arc(x, y, r, 0, 6.29); C.lightBody(ctx, p, t, { g: { x, y: y - r * .3, R: r * 1.2 }, lit: on > .3 ? 1 : 0, glow: .6, blurR: r * 2, edge: false });
}
function land(ctx, k) {          // Africa: indigo land, a blue rim, a little light from inside
  ctx.save();
  E.glowFill(ctx, AFRP, 60, .5, P.blue0);
  ctx.fillStyle = E.lin(ctx, 600, 100, 1500, 1000, [[0, mixHex(P.ind2, P.blue1, .35)], [.6, P.ind1], [1, P.ind0]]); ctx.fill(AFRP); ctx.fill(MADP);
  ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = Math.max(2, 1.2 / k); ctx.stroke(AFRP); ctx.stroke(MADP);
  ctx.restore();
}
function coolDot(ctx, x, y) { const p = new Path2D(); p.arc(x, y, 4.5, 0, 6.29); ctx.fillStyle = mixHex(F.COOL, P.blue1, .4); ctx.fill(p); E.halo(ctx, x, y, 16, .25, P.blue0, F.COOL); }
export function setR(T, WS, HS) {
  const S = (w, n) => T.S('s11', w, n);
  const a = {
    T11: T.seg('s11').start, showed: S('showed'), find: S('Find'), bring: S('Bring'), keep: S('keep going'), stops: S('stops'), news: S('news.'),
    decision: S('decision'), ministries: S('ministries'), budgets: S('budgets'), lab: S('lab.'), so: S('So the'), slowest: S('slowest'),
    science: S('science'), us: S('us,'), deciding: S('deciding'), finish: S('finish'), andreach: S('And reach'), build: S('build.'),
    shot: S('A shot'), hiv: S('HIV,'), twice: S('twice'), given: S('given'), zambia: S('Zambia,'), kenya: S('Kenya'), nigeria: S('Nigeria.'),
    sa: S('South Africa.'), isnt: S("It isn't"), artificial: S('artificial'), proves: S('proves'), poorest: S('poorest'), last: S('last.'),
    how: S('How does'), travel: S('travel'), far: S('far,'), fast: S('fast?'), T12: T.seg('s12').start,
  };
  const DRIFT = 1.2;
  // ------------------------------------------------------------------------------------------------ the road world: camera
  const K0 = HS.K[HS.K.length - 1][1];
  const tSyr = [a.build + .15, a.hiv + .05];                 // the syringe forms on the bridge and crosses to the nurse
  const KR = [
    [a.T11, K0],
    [a.find - .5, V(2700, FL - 230, .98, { sx: 900, sy: 540 })],
    [a.bring + .3, V(2880, FL - 230, 1.0, { sx: 900, sy: 540 })],
    [a.keep + 1.2, V(3300, FL - 230, .9)],
    [a.decision - .2, V(3900, FL - 220, .9)],
    [a.ministries + .3, V(BOOK.x + 60, FL - 250, 1.45)],
    [a.so - .1, V(BOOK.x + 90, FL - 250, 1.4)],
    [a.science + .3, V(5280, BAR.y + 70, .84, { e: 's' })],
    [a.andreach - .1, V(5300, BAR.y + 76, .82)],
    [a.build - .3, V(5560, FL - 70, 1.38)],
    [a.build + .6, V(5600, FL - 70, 1.4)],
    [tSyr[1] + .1, V(NURSE.x + 40, FL - 210, 1.3, { sx: 1180, sy: 560, e: 'q' })],
    [a.given - .2, V(NURSE.x + 40, FL - 210, 1.4, { sx: 1180, sy: 560 })],
  ];
  const camR = (t) => camDrift(viewCam(t, KR), t, DRIFT);
  // the figures: found (ring) and warm (reached) on the words
  WS.extras.figWarm = (i, t) => sineIO(span(t, ...[[0, 0], [a.bring - .1, a.bring + .9], [a.keep + .1, a.keep + 1.1], [a.keep + .5, a.keep + 1.5], [a.keep + .9, a.keep + 1.9]][i]));
  WS.extras.figRing = (ctx, i, x, y, h, t) => {
    if (i !== 1) return;
    const u = smooth(span(t, a.find - .1, a.find + .8)), out = span(t, a.bring + .2, a.bring + 1.2); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.strokeStyle = rgba(F.COOL_HI, .85 * (1 - out)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y + 2, h * .32 * (.6 + .4 * u), h * .06 * (.6 + .4 * u), 0, 0, 6.29); ctx.stroke();
    E.halo(ctx, x, y - h * .5, h * .7, .25 * u * (1 - out), P.blue0, F.COOL_HI); ctx.restore();
  };
  // ------------------------------------------------------------------------------------------------ things along the road
  function stakes(ctx, t) {
    STAKES.forEach((st, i) => {
      const tw = [a.find, a.bring, a.keep][i], u = span(t, tw - .3, tw + .9);
      if (u <= 0) return;
      const up = smooth(span(u, 0, .45)), top = FL - 455 * up;
      ctx.fillStyle = P.night1; ctx.fillRect(st.x - 3, top, 6, FL - top); ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(st.x - 3, top, 2, FL - top);
      F.paperLabel(ctx, st.s, st.x, top - 20, { size: 30, u: smooth(span(u, .25, 1)), lit: .6 });
    });
  }
  function book(ctx, t) {
    const open = sineIO(span(t, a.ministries - .5, a.ministries + .7)), row = smooth(span(t, a.budgets - .2, a.budgets + .6));
    const slide = sineIO(span(t, a.slowest - .3, a.slowest + 1.4));
    const B = BOOK, x0 = B.x - B.w / 2, y0 = B.y - B.h;
    // stand
    ctx.fillStyle = P.night1; ctx.fillRect(B.x - 6, B.y, 12, FL - B.y); ctx.fillRect(B.x - 60, FL - 8, 120, 8);
    ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(B.x - 6, B.y, 2, FL - B.y);
    // pages (the left page unfolds from the spine when it opens) with a glow
    const page = (px, pw) => { const p = new Path2D(); p.rect(px, y0, pw, B.h); return p; };
    const pr = page(B.x, B.w / 2), pl = page(B.x - B.w / 2 * open, B.w / 2 * open);
    E.glowFill(ctx, pr, 60, .4, P.halo1); if (open > .02) E.glowFill(ctx, pl, 60, .4 * open, P.halo1);
    const pg = E.lin(ctx, 0, y0, 0, B.y, [[0, mixHex(P.core1, P.cream, .4)], [1, mixHex(P.halo2, P.halo1, .45)]]);
    ctx.fillStyle = pg; ctx.fill(pr); if (open > .02) ctx.fill(pl);
    if (open < 1) { ctx.fillStyle = E.lin(ctx, B.x, 0, B.x + B.w / 2, 0, [[0, mixHex(P.ind2, P.blue1, .5)], [1, P.ind1]]); const cw = B.w / 2 * (1 - open); ctx.fillRect(B.x + (B.w / 2 - cw) * 0 , y0, cw, B.h); ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(B.x, y0, cw, 2); }
    ctx.fillStyle = rgba(P.shade0, .5); ctx.fillRect(B.x - 1, y0, 2, B.h);
    // ink rows: a label stroke on the left page, figures on the right; row 4 is HEALTH BUDGET
    if (open > .5) {
      ctx.save(); ctx.globalAlpha = 1; const k = smooth(span(open, .5, 1));
      for (let r = 0; r < 8; r++) {
        const ry = y0 + 32 + r * 27; if (r === 4) continue;
        ctx.fillStyle = rgba(F.INK, .55 * k); ctx.fillRect(x0 + 22, ry, 70 + 50 * Math.abs(Math.sin(r * 2.7)), 3); ctx.fillRect(B.x + 110, ry, 50 + 20 * Math.abs(Math.sin(r * 1.3)), 3);
      }
      ctx.restore();
    }
    // the row that glows: HEALTH BUDGET (on the page; then its light slides out of the book and becomes the bar)
    const ry = y0 + 32 + 4 * 27;
    if (row > 0 && slide < 1) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, 0, ry - 18, 0, ry + 18, [[0, rgba(P.halo1, 0)], [.5, rgba(P.halo1, .55 * row)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x0 + 8, ry - 18, B.w - 16, 36); ctx.restore();
      ctx.font = '600 17px Inter'; ctx.letterSpacing = '0.1em'; ctx.fillStyle = mixHex(F.INK, P.shade0, row); ctx.textBaseline = 'middle';
      ctx.save(); ctx.beginPath(); ctx.rect(x0 + 18, ry - 16, (B.w / 2 - 20) * row, 32); ctx.clip(); ctx.fillText('HEALTH BUDGET', x0 + 22, ry + 1); ctx.restore();
      ctx.fillStyle = rgba(P.shade0, .9 * row); ctx.fillRect(B.x + 110, ry - 2, 90 * row, 4);
    }
    return { rowY: ry };
  }
  function lab(ctx, t) {
    const L = LAB, y = FL; ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.fillRect(L.x - L.w / 2, y - L.h, L.w, L.h);
    ctx.beginPath(); ctx.moveTo(L.x - L.w / 2 - 4, y - L.h); ctx.lineTo(L.x, y - L.h - 16); ctx.lineTo(L.x + L.w / 2 + 4, y - L.h); ctx.fill();
    const bl = 1 + .5 * Math.sin(Math.PI * clamp(span(t, a.lab - .1, a.lab + .7)));
    ctx.fillStyle = mixHex(F.COOL, P.cream, .3); ctx.fillRect(L.x - 10, y - L.h + 14, 20, 14); E.halo(ctx, L.x, y - L.h + 21, 30 * bl, .3, P.blue0, F.COOL_HI);
  }
  // 11.03 · 11.04 the bar: grows out of the book row, SCIENCE / US: DECIDING, fills on "finish", lowers onto the gap as a bridge
  function bar(ctx, t, rowY) {
    const grow = sineIO(span(t, a.slowest - .3, a.slowest + 1.6)); if (grow <= 0) return;
    const low = sineIO(span(t, a.andreach - .2, a.andreach + 1.1)), y = lerp(lerp(rowY, BAR.y, smooth(span(grow, 0, .5))), FL + 2, low);
    const x0 = lerp(BOOK.x - BOOK.w / 2 + 20, BAR.x0, smooth(span(grow, 0, .4))), x1 = lerp(BOOK.x + BOOK.w / 2, BAR.x1, grow);
    const fill = lerp(BAR.xs, GAP.x0 - 10, sineIO(span(t, a.finish - .1, a.andreach))) + (GAP.x1 - GAP.x0 + 10) * sineIO(span(t, a.build - .9, a.build + .5));
    const h = lerp(BAR.h, 16, low);
    // the dark (not yet) part: an outline that becomes the gap's empty span
    ctx.save(); ctx.strokeStyle = rgba(F.COOL, .7); ctx.lineWidth = 2; ctx.setLineDash(low > .5 ? [10, 9] : []); ctx.strokeRect(Math.max(x0, BAR.xs), y - h / 2, Math.max(0, x1 - Math.max(x0, BAR.xs)), h); ctx.restore();
    if (low < .5) { ctx.fillStyle = rgba(P.night1, .7); ctx.fillRect(Math.max(x0, BAR.xs) + 2, y - h / 2 + 2, Math.max(0, x1 - BAR.xs - 4), h - 4); }
    // the bright part: SCIENCE (short), then the filled part (paper strips once it is a bridge)
    const xb = Math.min(x1, BAR.xs);
    const gold = (xa, xe) => { if (xe <= xa) return; const p = new Path2D(); p.rect(xa, y - h / 2, xe - xa, h); C.lightBody(ctx, p, t, { g: { x: (xa + xe) / 2, y: y - h, R: Math.max(60, (xe - xa) * .6) }, lit: 1, glow: .5, blurR: 60, edge: false }); };
    gold(x0, xb);
    const fx = Math.min(x1, fill);
    if (fx > BAR.xs) {
      if (low < .5) gold(BAR.xs, fx);
      else { for (let x = BAR.xs; x < fx; x += 34) { const w = Math.min(30, fx - x); const p = new Path2D(); p.roundRect(x, y - h / 2 + Math.sin(x * .1) * 1.5, w, h, 2); ctx.fillStyle = E.lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, P.core1], [1, P.halo1]]); ctx.fill(p); }
        E.halo(ctx, fx, y, 60, .3, P.halo1, P.core1); }
    }
    // labels above the bar
    const lu = (tw) => smooth(span(t, tw - .2, tw + .8)) * (1 - expoIn(span(t, a.andreach - .3, a.andreach + .3)));
    F.maskLine(ctx, [['SCIENCE', 0]], (BAR.x0 + BAR.xs) / 2, BAR.y - 66, 46, lu(a.science), { serif: false, col: P.cream, glow: false, align: 'center', weight: 600 });
    F.maskLine(ctx, [['US: DECIDING', 0]], (BAR.xs + BAR.x1) / 2, BAR.y - 66, 46, lu(a.us), { serif: false, col: P.cream, glow: false, align: 'center', weight: 600 });
    // builders: small figures at the front of the strips, carrying the next strip
    if (low > .3) {
      for (let k = 0; k < 3; k++) {
        const bx = Math.min(fx, GAP.x1) - 30 - k * 80, hold = { armR: [1.5, 1.2], armL: [1.4, 1.3] };
        if (bx < GAP.x0 - 200) continue;
        const ph = t * 6 + k;
        C.person(ctx, bx, FL + 2, 150 - k * 8, t, { dir: 1 });
        ctx.fillStyle = mixHex(P.core1, P.halo1, .4); ctx.fillRect(bx + 8, FL - 80 + 3 * Math.sin(ph), 34, 9);
      }
    }
    return { fill: fx, y };
  }
  function gap(ctx) {
    ctx.fillStyle = E.lin(ctx, 0, FL, 0, FL + 700, [[0, P.night0], [1, mixHex(P.night0, P.ind0, .4)]]);
    ctx.beginPath(); ctx.moveTo(GAP.x0, FL - 1); ctx.lineTo(GAP.x0 + 40, FL + 1400); ctx.lineTo(GAP.x1 - 40, FL + 1400); ctx.lineTo(GAP.x1, FL - 1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(GAP.x0, FL); ctx.lineTo(GAP.x0 + 40, FL + 400); ctx.moveTo(GAP.x1, FL); ctx.lineTo(GAP.x1 - 40, FL + 400); ctx.stroke();
  }
  // evening at the clinic (a warm horizon: the first warm light of this part), the clinic, the nurse
  function clinic(ctx, t) {
    const C0 = CLINIC, x0 = C0.x - C0.w / 2, y0 = FL - C0.h;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, C0.x + 600, FL, 2200, [[0, rgba(P.halo1, .4)], [.25, rgba(P.shade0, .22)], [.6, rgba(P.blue1, .08)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(GAP.x1 - 800, -1500, 6000, FL + 1500);
    ctx.restore();
    ctx.fillStyle = E.lin(ctx, x0, 0, x0 + C0.w, 0, [[0, P.night1], [.6, P.ind1], [1, mixHex(P.ind2, P.shade0, .4)]]); ctx.fillRect(x0, y0, C0.w, C0.h);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(x0 - 16, y0 - 14, C0.w + 32, 16);
    ctx.fillStyle = rgba(P.halo1, .8); ctx.fillRect(x0 - 16, y0 - 14, C0.w + 32, 2.5);
    const door = new Path2D(); door.rect(C0.x - 40, FL - 170, 80, 170);
    C.lightBody(ctx, door, t, { g: { x: C0.x, y: FL - 110, R: 150 }, lit: 1, glow: .8, blurR: 120 });
    const win = new Path2D(); win.rect(C0.x + 80, FL - 190, 70, 60); C.lightBody(ctx, win, t, { g: { x: C0.x + 115, y: FL - 165, R: 60 }, lit: 1, glow: .6, blurR: 50 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(C0.x, FL + 6); ctx.scale(1, .12); ctx.fillStyle = E.rad(ctx, 0, 0, 500, [[0, rgba(P.halo1, .35)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 500, 0, 6.29); ctx.fill(); ctx.restore();
  }
  function nurse(ctx, t) {
    const reach = smooth(span(t, tSyr[1] - .8, tSyr[1] + .1));
    const hd = E.person(ctx, NURSE.x, FL + 4, NURSE.h, { dir: -1, armR: [lerp(.3, 1.45, reach), lerp(.3, .5, reach)], look: .25, long: true, rim: mixHex(P.blue0, P.halo1, .7), light: -1 });
    return hd.R;
  }
  function syringeAt(t, hand) {
    if (t < tSyr[0]) return null;
    const u = span(t, ...tSyr), e = sineIO(u), birth = expoOut(span(t, tSyr[0], tSyr[0] + .6));
    const p0 = [GAP.x0 + 40, FL - 34], p1 = [hand[0] - 70, hand[1] - 4];
    const x = lerp(p0[0], p1[0], e), y = lerp(p0[1], p1[1], e) - 60 * Math.sin(Math.PI * e);
    return { x, y, len: 150 * birth, rot: -.08 * Math.sin(Math.PI * e) };
  }
  function roadWorld(ctx, t, c) {
    WS.drawRoom(ctx, t, c, { warm: 1, extra: (cx, k) => {
      gap(cx);
      WS.extras.room(cx, t, k);
      stakes(cx, t); lab(cx, t);
      const { rowY } = book(cx, t);
      bar(cx, t, rowY);
      clinic(cx, t);
      const hand = nurse(cx, t), sy = syringeAt(t, hand);
      if (sy) { if (t < tSyr[1]) F.trailSpan(cx, [[GAP.x0 + 40, FL - 34], [sy.x - sy.len * .5, sy.y]], 0, 1, { w: 2, spark: false }); F.syringe(cx, sy.x, sy.y, sy.len, t, { fill: .8, rot: sy.rot }); }
    } });
  }

  // ------------------------------------------------------------------------------------------------ the map world
  // the clinic shrinks into Zambia's light: a circle (the light) holds the road world; outside it, the map
  const Z = PLACES[0], ZX = mx(Z.lon), ZY = my(Z.lat), ZR = 15;
  const tMap = [a.given + .15, a.zambia + .75];
  const sM0 = Math.hypot(W, H) / 2 / ZR * 1.04;
  const KM_ = [
    [tMap[0], V(ZX, ZY, sM0)],
    [tMap[1], V(1100, 560, 1.0, { e: 's' })],
    [a.artificial - .2, V(1100, 560, .97)],
    [a.poorest - .4, V(1140, 960, .9, { e: 'q' })],
    [a.how + .1, V(1136, 962, .92)],
  ];
  const camM = (t) => camDrift(viewCam(t, KM_), t, DRIFT * smooth(span(t, tMap[1] - .4, tMap[1] + .8)));
  const QUEUE = (() => { const all = PLACES.map((p) => [mx(p.lon), my(p.lat), 1]).concat(OTHERS.map(([lo, la]) => [mx(lo), my(la), 0])); return all.map((d, i) => ({ x: d[0], y: d[1], warm: d[2], qx: QX0 + i * QG, qy: QY })); })();
  const tQ = [a.artificial - .1, a.proves + .9];
  function mapWorld(ctx, t, c) {
    C.nightBg(ctx);
    card(ctx, c, F0, (k) => {
      land(ctx, k);
      if (t < tMap[1] + .1) portal(ctx, t, k);
      // the lights: four warm places (they light on their words), the others cool and small; on "artificial" they line up
      const q = (i) => sineIO(span(t, tQ[0] + i * .045, tQ[1] - (QUEUE.length - i) * .02));
      QUEUE.forEach((d, i) => {
        const u = q(i), x = lerp(d.x, d.qx, u), y = lerp(d.y, d.qy, u) - 120 * Math.sin(Math.PI * u) * (d.warm ? 1 : .6);
        if (d.warm) {
          const pl = PLACES[i], tw = a[['zambia', 'kenya', 'nigeria', 'sa'][i]], on = i === 0 ? 1 : smooth(span(t, tw - .15, tw + .6));
          const r = i === 0 ? ZR * smooth(span(t, tMap[1] - .7, tMap[1])) : 3 + (ZR - 3) * on;
          warmDot(ctx, t, x, y, r, on);
          const lab = smooth(span(t, tw - .1, tw + .7)) * (1 - expoIn(span(t, tQ[0], tQ[0] + .4)));
          if (lab > 0) F.maskLine(ctx, [[pl.n, 0]], pl.al ? x + pl.dx - F.measure(pl.n, 24, false, 600) : x + pl.dx, y + pl.dy, 24, lab, { serif: false, col: P.cream, glow: false, weight: 600 });
        } else coolDot(ctx, x, y);
      });
      // NOT LAST at the front of the queue; the shot lands there
      const nl = smooth(span(t, a.poorest - .15, a.poorest + .7));
      if (nl > 0) F.maskLine(ctx, [['NOT LAST', 0]], QX0 + 80, QY - 150, 52, nl, { serif: false, col: P.cream, glow: false, align: 'center', weight: 600 });
      const sh = shotQ(t); if (sh) F.syringe(ctx, sh.x, sh.y, sh.len, t, { fill: .8, rot: sh.rot });
    });
  }
  // the clinic inside Zambia's light (portal): the road world's camera, scaled into the circle
  const cClinic = (t) => camR(Math.min(t, tMap[0]));
  function portal(ctx, t, k) {
    const m = ctx.getTransform(), rS = m.a * ZR, sx = m.a * ZX + m.e, sy = m.d * ZY + m.f;
    if (rS < 2) return;
    ctx.save(); ctx.beginPath(); ctx.arc(ZX, ZY, ZR, 0, 6.29); ctx.clip();
    const c0 = cClinic(t), f = rS / (Math.hypot(W, H) / 2 * 1.04);
    // the clinic view, shrunk about the circle's centre
    const m0 = E.cardM(c0, F0), u = (W / 2 - m0.e) / m0.k, v = (H / 2 - m0.f) / m0.k;
    roadWorldInto(ctx, t, aim(F0, u, v, m0.k * f, sx, sy));
    ctx.restore();
    ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 2 / k; ctx.beginPath(); ctx.arc(ZX, ZY, ZR, 0, 6.29); ctx.stroke();
  }
  function roadWorldInto(ctx, t, c) { ctx.save(); roadWorld(ctx, Math.min(t, tMap[0] + 3), c); ctx.restore(); }
  // the shot on the queue: rises out of Zambia's light and lands at the front
  const tRise = [a.poorest - .9, a.poorest + .2];
  function shotQ(t) {
    if (t < tRise[0] || t >= a.how) return null;
    const d = QUEUE[0], u = sineIO(span(t, ...tRise)), b = expoOut(span(t, tRise[0], tRise[0] + .5));
    return { x: lerp(d.qx, d.qx + 70, u), y: lerp(d.qy, d.qy - 62, u) - 40 * Math.sin(Math.PI * u), len: 130 * b, rot: lerp(-1.2, 0, u) };
  }
  // ------------------------------------------------------------------------------------------------ 11.07 the flight (screen space) → plateShot
  const tFly = [a.how, a.T12 - .5];
  function flight(ctx, t) {
    const u = span(t, ...tFly), e = sineIO(u);
    // the map/queue world slides away to the left (the camera follows the shot), the night turns into the plate's night
    const cq = camM(tFly[0]), m = E.cardM(cq, F0);
    const p0 = [m.e + m.k * (QUEUE[0].qx + 70), m.f + m.k * (QUEUE[0].qy - 62)], len0 = 130 * m.k;
    const y1 = SHOT.y + 4 * drift(t, 1, 3);
    const x = lerp(p0[0], SHOT.x, e), y = lerp(p0[1], y1, e) - 70 * Math.sin(Math.PI * e), len = Math.exp(lerp(Math.log(len0), Math.log(SHOT.len), sineIO(span(u, .1, 1))));
    const bg = smooth(span(u, .3, .9));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = E.rad(ctx, lerp(960, 1000, bg), lerp(540, 560, bg), lerp(1250, 1300, bg), [[0, P.ind1], [.5, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
    ctx.restore();
    // the queue world, panned away (its camera slides right ever faster)
    const slide = expoIn(span(u, 0, .55)) * 2600 + 600 * span(u, 0, .55);
    if (slide < 2400) {
      const c = { ...cq, x: cq.x + slide * (F0 / (F0 - cq.z)) ** -1 };
      ctx.save(); card(ctx, c, F0, (k) => {
        land(ctx, k);
        QUEUE.forEach((d) => { if (d.warm) warmDot(ctx, t, d.qx, d.qy, ZR, 1); else coolDot(ctx, d.qx, d.qy); });
        F.maskLine(ctx, [['NOT LAST', 0]], QX0 + 80, QY - 150, 52, 1 - expoIn(span(u, 0, .3)), { serif: false, col: P.cream, glow: false, align: 'center', weight: 600 });
      }); ctx.restore();
    }
    // the trail: the plate's curve from the left edge into the plunger, revealed from where the shot started
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineCap = 'round';
    const xp = x - len * .52, xs = lerp(Math.max(0, p0[0] - len0 * .5), 0, smooth(span(u, .05, .95)));
    ctx.strokeStyle = E.lin(ctx, 0, 0, xp, 0, [[0, rgba(P.halo1, 0)], [.6, rgba(P.halo1, .45)], [1, rgba(P.core1, .95)]]); ctx.lineWidth = 2.4;
    ctx.save(); ctx.beginPath(); ctx.rect(xs, 0, W, H); ctx.clip();
    ctx.beginPath(); ctx.moveTo(0, y + 26); ctx.bezierCurveTo(xp * .45, y + 30, xp * .8, y + 4, xp, y); ctx.stroke(); ctx.restore();
    if (bg > 0) E.dust(ctx, 380, 300, xp * .55, y + 20, xp * .45, 50, t, .5 * bg, P.halo0);
    F.syringe(ctx, x, y, len, t, { fill: .8, rot: .004 * drift(t * .6, 1, 7) * e + (1 - e) * 0 });
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------ draw
  function draw(ctx, t) {
    if (t >= a.T12 - .5) { plateShot(ctx, t); return; }
    if (t >= tFly[0]) { flight(ctx, t); return; }
    if (t < tMap[0]) roadWorld(ctx, t, camR(t));
    else mapWorld(ctx, t, camM(t));
    text(ctx, t);
  }
  function text(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const u = smooth(span(t, a.twice - .2, a.twice + 1.0)) * (1 - expoIn(span(t, a.zambia - .3, a.zambia + .2)));
    if (u > 0) F.numberBlock(ctx, { x: 150, y: 300, num: 'twice a year', label: 'HIV prevention shot', src: 'Lenacapavir · CHAI 2026', u, size: 112 });
    ctx.restore();
  }
  return { draw, a, t0: a.T11 };
}
