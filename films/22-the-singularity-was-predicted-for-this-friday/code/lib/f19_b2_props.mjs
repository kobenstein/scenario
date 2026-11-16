// Film 19 · builder B2 (c06–c08) · props: the things of the middle act, drawn with the kit's palette (lib/f19_kit.mjs).
// Owned by B2. Pure drawing functions (design coords of whatever card they are called in); every Path2D that does not move is built once.
//   candle115(ctx, t, x, yb, size, o)        the birthday candles "1 1 5" (wax digits, wicks, flames): o { rise, lit:[3], dip, a }
//   skyline(ctx, x0, yb, u, o)               a tiny paper-cut Vienna skyline with one spire, rising building by building (u 0..1)
//   popUp(ctx, x, yb, u, fn)                 a flat drawing standing up from its baseline (pop-up book) — the "stands up" move
//   car frame / dash / gps / fog             the car interior, composed in SCREEN coords of a reference camera (carCard)
//   censusSlip, papers (contract, bill, napkin), weather strip, tape, doorframe + ruler, task stack, the expert's door + rope
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, lin, rad, prng } = E;
const { PAL, label, ink, lightLine, partial, ring } = F;

// ---------------------------------------------------------------------------------------------------------------- helpers
export const popUp = (ctx, x, yb, u, fn) => { const k = clamp(u); if (k <= 0) return; ctx.save(); ctx.translate(x, yb); ctx.scale(1, Math.max(.001, k)); ctx.translate(-x, -yb); fn(); ctx.restore(); };
export const easeBack = (x, s = 1.3) => { x = clamp(x); const c = s + 1; return 1 + c * (x - 1) ** 3 + s * (x - 1) ** 2; };
export const polyLen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
export function strokePts(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
// point and tangent at arc fraction u of a polyline
export function at(pts, u) { const p = partial(pts, clamp(u, 1e-4, 1)); const a = p[p.length - 1], b = p[Math.max(0, p.length - 2)]; return { x: a[0], y: a[1], ang: Math.atan2(a[1] - b[1], a[0] - b[0]) }; }
// offset polyline (normal to the right of the direction of travel by d)
export function offsetPts(pts, d) { return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [p[0] - dy / L * d, p[1] + dx / L * d]; }); }
// pencil stroke (graphite on the night paper): soft, slightly uneven
export function pencil(ctx, pts, u = 1, o = {}) {
  if (u <= 0) return; const p = partial(pts, u);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
  ctx.strokeStyle = rgba(o.col ?? PAL.ink1, (o.a ?? .7) * .35); ctx.lineWidth = (o.w ?? 3) * 2.2; strokePts(ctx, p);
  ctx.strokeStyle = rgba(o.col ?? PAL.ink1, o.a ?? .7); ctx.lineWidth = o.w ?? 3; strokePts(ctx, p);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- candle 115
// Three wax digit candles "1 1 5" standing on baseline yb, centred at x. size = digit height. o.rise 0..1 (they rise from the baseline,
// masked like type), o.lit [a,b,c] 0..1 per flame (ignite), o.dip 0..1 (the wink: all flames dip and rise once), o.glow (halo scale).
// Returns the flame centre (for the light pool).
export function candle115(ctx, t, x, yb, size, o = {}) {
  const rise = expoOut(clamp(o.rise ?? 1)); if (rise <= 0) return [x, yb - size];
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = 'left';
  const ds = ['1', '1', '5'], ws = ds.map((d) => ctx.measureText(d).width), gap = size * .04, tw = ws.reduce((a, b) => a + b) + gap * 2;
  let cx = x - tw / 2; const tops = [];
  ctx.beginPath(); ctx.rect(x - tw, yb - size * 1.6, tw * 2, size * 1.6 + 2); ctx.clip();
  const dy = (1 - rise) * size * 1.05;
  ds.forEach((d, i) => {
    const w = ws[i], top = yb - size * .72 + dy;
    ctx.fillStyle = lin(ctx, cx, 0, cx + w, 0, [[0, mixHex(PAL.card, PAL.gold3, .35)], [.45, PAL.card], [1, mixHex(PAL.cardShade, PAL.gold3, .3)]]);
    ctx.fillText(d, cx, yb + dy);
    // the wick (dark) on top of the digit
    const wx = cx + w * (d === '5' ? .42 : .55); ctx.strokeStyle = PAL.cInk0; ctx.lineWidth = size * .018; ctx.beginPath(); ctx.moveTo(wx, top); ctx.lineTo(wx + size * .01, top - size * .09); ctx.stroke();
    tops.push([wx + size * .01, top - size * .09]);
    cx += w + gap;
  });
  ctx.restore();
  // flames (drawn unclipped above the wax)
  const lit = o.lit ?? [1, 1, 1], dip = o.dip ?? 0; let fx = x, fy = yb - size;
  tops.forEach(([wx, wy], i) => {
    const l = clamp(lit[i] ?? 0); if (l <= 0 || rise < .98) return;
    const fl = 1 + .06 * Math.sin(t * 11 + i * 2) + .04 * Math.sin(t * 17.3 + i), hgt = size * .36 * expoOut(l) * fl * (1 - .55 * Math.sin(Math.PI * clamp(dip))), wd = size * .07 * expoOut(l);
    const sway = Math.sin(t * 2.3 + i) * size * .012;
    E.halo(ctx, wx, wy - hgt * .45, size * 1.1 * (o.glow ?? 1) * l, .5 * l, PAL.flame, PAL.gold0);
    const p = new Path2D(); p.moveTo(wx, wy + wd * .3); p.bezierCurveTo(wx - wd * 1.1, wy - hgt * .25, wx - wd * .4 + sway, wy - hgt * .7, wx + sway * 1.6, wy - hgt);
    p.bezierCurveTo(wx + wd * .4 + sway, wy - hgt * .7, wx + wd * 1.1, wy - hgt * .25, wx, wy + wd * .3); p.closePath();
    ctx.fillStyle = rad(ctx, wx, wy - hgt * .25, hgt, [[0, PAL.gold0], [.45, PAL.gold1], [1, PAL.flame]]); ctx.fill(p);
    fx = wx; fy = wy - hgt * .4;
  });
  return [x, fy];
}

// ---------------------------------------------------------------------------------------------------------------- Vienna skyline
// paper-cut roofs rising one by one from baseline yb (x0 = left end, width ~430): houses, a dome, the one tall spire (index 4)
const SKY = [[0, 70, 60, 'gable'], [62, 55, 90, 'flat'], [120, 80, 70, 'gable'], [205, 60, 120, 'dome'], [270, 46, 290, 'spire'], [320, 70, 80, 'gable'], [392, 52, 64, 'flat']];
export function skyline(ctx, x0, yb, u, o = {}) {
  if (u <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  SKY.forEach(([dx, w, h, kind], i) => {
    const k = easeBack(span(u, i / SKY.length * .6, i / SKY.length * .6 + .4), 1.1); if (k <= 0) return;
    const x = x0 + dx, p = new Path2D(), hh = h * k;
    if (kind === 'spire') { p.moveTo(x, yb); p.lineTo(x, yb - hh * .45); p.lineTo(x + w * .18, yb - hh * .52); p.lineTo(x + w * .5, yb - hh); p.lineTo(x + w * .82, yb - hh * .52); p.lineTo(x + w, yb - hh * .45); p.lineTo(x + w, yb); }
    else if (kind === 'dome') { p.moveTo(x, yb); p.lineTo(x, yb - hh * .6); p.quadraticCurveTo(x + w / 2, yb - hh * 1.15, x + w, yb - hh * .6); p.lineTo(x + w, yb); }
    else if (kind === 'gable') { p.moveTo(x, yb); p.lineTo(x, yb - hh * .7); p.lineTo(x + w / 2, yb - hh); p.lineTo(x + w, yb - hh * .7); p.lineTo(x + w, yb); }
    else { p.rect(x, yb - hh, w, hh); }
    p.closePath();
    F.paperCut(ctx, p, o.col ?? PAL.cut1, { edgeCol: o.edge ?? PAL.cutLit, edgeA: .7, edgeW: 2.5 });
    if (kind !== 'spire' && k > .9) { ctx.save(); ctx.shadowColor = 'transparent'; ctx.fillStyle = rgba(PAL.gold1, .55 * (o.win ?? 1)); const r = prng(40 + i); for (let j = 0; j < 3; j++) if (r() < .55) ctx.fillRect(x + w * (.2 + .25 * j), yb - hh * (.35 + .2 * r()), 5, 7); ctx.restore(); }
  });
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the car
// Composed in SCREEN coords (1920×1080) as seen from a reference camera; carCard() (in the world module) places a layer at depth Z.
const WS_PTS = [[-700, 2100], [40, 820], [228, 262], [330, 188], [960, 160], [1590, 188], [1692, 262], [1880, 820], [2620, 2100]];
const wsInto = (p) => { p.moveTo(...WS_PTS[0]); p.lineTo(...WS_PTS[1]); p.lineTo(...WS_PTS[2]); p.quadraticCurveTo(250, 196, 330, 188); p.quadraticCurveTo(960, 140, 1590, 188); p.quadraticCurveTo(1670, 196, 1692, 262); p.lineTo(...WS_PTS[7]); p.lineTo(...WS_PTS[8]); p.closePath(); return p; };
export const WINDSHIELD = wsInto(new Path2D());
// (Path2D.addPath in @napi-rs/canvas drops the added path's first moveTo, so the frame is built in one path)
const FRAME = (() => { const p = new Path2D(); p.rect(-60, -60, W + 120, H + 160); return wsInto(p); })();
const MIRROR = (() => { const p = new Path2D(); p.rect(951, 150, 18, 60); p.roundRect(850, 200, 220, 54, 16); return p; })();
const DASH = (() => { const p = new Path2D(); p.moveTo(-60, 742); p.bezierCurveTo(300, 668, 1600, 652, W + 60, 748); p.lineTo(W + 60, H + 120); p.lineTo(-60, H + 120); p.closePath(); return p; })();
const DASH_LIP = (() => { const p = new Path2D(); p.moveTo(-60, 742); p.bezierCurveTo(300, 668, 1600, 652, W + 60, 748); return p; })();
export const GPS = { x: 1180, y: 676, w: 312, h: 188 };
// the frame: roof, pillars, mirror (dark paper, a cool/warm lit edge round the glass)
export function carFrame(ctx, o = {}) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, PAL.desk0], [.5, PAL.cut0], [1, PAL.desk1]]); ctx.fill(FRAME, 'evenodd');
  ctx.save(); ctx.clip(FRAME, 'evenodd'); ctx.strokeStyle = rgba(o.edge ?? PAL.cutLit, .9); ctx.lineWidth = 5; ctx.translate(3, 4); ctx.stroke(WINDSHIELD); ctx.restore();
  ctx.fillStyle = PAL.desk1; ctx.fill(MIRROR); ctx.strokeStyle = rgba(PAL.cutLit, .6); ctx.lineWidth = 2.5; ctx.stroke(MIRROR);
}
// the dashboard with the GPS in it. o.gps: the GPS state (see gps()), o.glow (cool light of the screen on the dash)
export function carDash(ctx, t, o = {}) {
  ctx.fillStyle = lin(ctx, 0, 650, 0, H, [[0, PAL.cut1], [.25, PAL.cut0], [1, PAL.desk0]]); ctx.fill(DASH);
  const g = o.glow ?? 0;
  if (g > 0) { ctx.save(); ctx.clip(DASH); ctx.fillStyle = rad(ctx, GPS.x + GPS.w / 2, GPS.y + GPS.h / 2, 520, [[0, rgba(PAL.cool2, .22 * g)], [1, rgba(PAL.cool2, 0)]]); ctx.fillRect(GPS.x - 600, GPS.y - 400, GPS.w + 1200, 900); ctx.restore(); }
  ctx.strokeStyle = rgba(mixHex(PAL.cutLit, PAL.cool1, .35 * g), .95); ctx.lineWidth = 5; ctx.stroke(DASH_LIP);
  // the GPS: bezel + screen
  ctx.fillStyle = PAL.desk0; ctx.beginPath(); ctx.roundRect(GPS.x - 14, GPS.y - 14, GPS.w + 28, GPS.h + 28, 22); ctx.fill();
  ctx.strokeStyle = rgba(PAL.cutLit, .8); ctx.lineWidth = 3; ctx.stroke();
  gps(ctx, t, GPS.x, GPS.y, GPS.w, GPS.h, o.gps ?? {});
}
// THE GPS screen. st: { on 0..1 (screen lights from the centre), route 0..1 (drawn), bend 0..1 (route bends right), roll 0..1 (6:12 → 6:31),
// light 0..1 (route becomes the machine line: exp shape, cool glow, sheet grid), flag 0..1 (FRI ? at its end), branch 0..1 (pencil-dotted second route) }
const N_R = 48;
const R_STRAIGHT = Array.from({ length: N_R + 1 }, (_, i) => { const s = i / N_R; return [.5, .9 - .78 * s]; });
const R_BENT = Array.from({ length: N_R + 1 }, (_, i) => { const s = i / N_R; const k = smooth(span(s, .45, .8)); return [.5 + .3 * k - .02 * Math.sin(Math.PI * k), .9 - .78 * lerp(s, .55 + .45 * (s - .45) / .55 * .2, k * .55)]; });
const R_LIGHT = Array.from({ length: N_R + 1 }, (_, i) => { const s = i / N_R; return [.14 + .58 * Math.pow(s, .8), .88 - .62 * (Math.exp(5.6 * s) - 1) / (Math.exp(5.6) - 1)]; });
const R_BRANCH = Array.from({ length: 31 }, (_, i) => { const s = i / 30; return [.5 + .12 * s + .2 * s * s, .62 - .3 * s + .05 * s * s]; });
export function gpsRoute(st) { const b = clamp(st.bend ?? 0), l = clamp(st.light ?? 0); return R_STRAIGHT.map((p, i) => { const q = [lerp(p[0], R_BENT[i][0], b), lerp(p[1], R_BENT[i][1], b)]; return [lerp(q[0], R_LIGHT[i][0], l), lerp(q[1], R_LIGHT[i][1], l)]; }); }
export function gps(ctx, t, x, y, w, h, st = {}) {
  const on = clamp(st.on ?? 0); if (on <= 0) { ctx.fillStyle = PAL.desk1; ctx.fillRect(x, y, w, h); return; }
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.clip();
  ctx.fillStyle = PAL.desk1; ctx.fillRect(x, y, w, h);
  // the screen lights from the centre out (anticipation: one flicker)
  const R = Math.hypot(w, h) * .6 * expoOut(on), cx = x + w / 2, cy = y + h / 2;
  ctx.beginPath(); ctx.arc(cx, cy, Math.max(.1, R), 0, 6.29); ctx.clip();
  const l = clamp(st.light ?? 0);
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, mixHex('#0f2a52', PAL.paper1, l)], [1, mixHex('#0a1a38', PAL.paper3, l)]]); ctx.fillRect(x, y, w, h);
  // map grid (becomes the 1960 graph grid of the sheet)
  const gs = lerp(w / 7, w / 12, l); ctx.strokeStyle = rgba(mixHex('#2a5a8a', PAL.grid1, l), .35 + .1 * l); ctx.lineWidth = Math.max(.6, w * .003);
  ctx.beginPath(); for (let gx = x + ((t * 2) % gs) * (1 - l); gx < x + w; gx += gs) { ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); } for (let gy = y; gy < y + h; gy += gs) { ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); } ctx.stroke();
  // side streets (map look), gone when it becomes the sheet
  if (l < 1) { ctx.strokeStyle = rgba('#3d6f9f', .45 * (1 - l)); ctx.lineWidth = w * .012; ctx.beginPath(); ctx.moveTo(x, y + h * .35); ctx.lineTo(x + w, y + h * .28); ctx.moveTo(x + w * .2, y); ctx.lineTo(x + w * .3, y + h); ctx.moveTo(x + w * .78, y); ctx.lineTo(x + w * .7, y + h); ctx.stroke(); }
  // the route
  const pts = gpsRoute(st).map(([u, v]) => [x + u * w, y + v * h]);
  const ru = clamp(st.route ?? 0);
  if (ru > 0) lightLine(ctx, pts, ru, { w: w * lerp(.011, .013, l), spill: lerp(.25, .6, l) * (ru < 1 ? 1 : .6) });
  // the pencil-dotted second route (can we change it?)
  if ((st.branch ?? 0) > 0) { const bp = R_BRANCH.map(([u, v]) => [x + u * w, y + v * h]); ctx.save(); ctx.setLineDash([w * .006, w * .022]); pencil(ctx, bp, st.branch, { w: w * .009, col: PAL.ink0, a: .9 }); ctx.restore(); }
  // the flag at the end
  if (ru >= 1 && (st.flag ?? 0) > 0) {
    const [fx, fy] = pts[pts.length - 1], k = easeBack(st.flag, 1.4), s = w * .045 * k;
    ctx.fillStyle = PAL.ink0; ctx.fillRect(fx - s * .06, fy - s * 2.2, s * .12, s * 2.2);
    ctx.fillStyle = PAL.cool1; ctx.beginPath(); ctx.moveTo(fx, fy - s * 2.2); ctx.lineTo(fx + s * 1.3, fy - s * 1.85); ctx.lineTo(fx, fy - s * 1.5); ctx.closePath(); ctx.fill();
    if ((st.flagLab ?? 0) > 0) label(ctx, 'FRI ?', fx + s * .3, fy - s * 2.6, w * .045, st.flagLab, { col: PAL.ink0, spacing: .1 });
  }
  // you: the cream arrow at the start of the route
  if (ru > 0 && l < 1) { const [ax, ay] = pts[0], s = w * .028; ctx.save(); ctx.globalAlpha *= 1 - l; ctx.translate(ax, ay + s * .4); ctx.fillStyle = PAL.ink0; ctx.beginPath(); ctx.moveTo(0, -s * 1.2); ctx.lineTo(s * .8, s * .8); ctx.lineTo(0, s * .3); ctx.lineTo(-s * .8, s * .8); ctx.closePath(); ctx.fill(); ctx.restore(); }
  // the arrival time (rolls 6:12 → 6:31), slides away when the route becomes the machine line
  const ta = 1 - clamp(st.light ?? 0) * 1.6;
  if (ta > 0) {
    const tx = x + w * .06, ty = y + h * .1;
    ctx.save(); ctx.globalAlpha *= clamp(ta);
    ctx.fillStyle = rgba(PAL.desk0, .7); ctx.beginPath(); ctx.roundRect(tx - w * .02, ty, w * .36, h * .3, 6); ctx.fill();
    label(ctx, 'ARRIVAL', tx + w * .01, ty + h * .1, w * .03, 1, { col: PAL.ink1, spacing: .14 });
    ctx.font = `${w * .075}px "Instrument Serif"`; ctx.fillStyle = PAL.ink0; ctx.textAlign = 'left';
    const base = ty + h * .25, r = smooth(clamp(st.roll ?? 0));
    ctx.fillText('6:', tx + w * .01, base); const dx = tx + w * .01 + ctx.measureText('6:').width;
    ctx.save(); ctx.beginPath(); ctx.rect(dx - 2, base - w * .07, w * .09, w * .086); ctx.clip();
    ctx.fillText('12', dx, base - r * w * .085); ctx.fillText('31', dx, base + (1 - r) * w * .085); ctx.restore();
    ctx.font = `600 ${w * .03}px Inter`; ctx.fillStyle = PAL.ink1; ctx.fillText('PM', dx + w * .09, base);
    ctx.restore();
  }
  // screen glass sheen
  ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, rgba('#ffffff', .05)], [.4, rgba('#ffffff', 0)]]); ctx.fillRect(x, y, w, h);
  ctx.restore();
}
// the fog on the glass: a vellum veil inside the windshield, growing in from the edges (u), with a clear swath (wipe: points + radius)
export function fog(ctx, t, u, wipe) {
  if (u <= 0) return;
  ctx.save(); ctx.clip(WINDSHIELD);
  const p = new Path2D(); p.rect(-60, -60, W + 120, H + 160);
  if (wipe && wipe.pts.length > 1 && wipe.r > 1) { const sw = swath(wipe.pts, wipe.r); p.moveTo(sw[0][0], sw[0][1]); for (let i = sw.length - 1; i > 0; i--) p.lineTo(sw[i][0], sw[i][1]); p.closePath(); }
  ctx.clip(p, 'nonzero');
  // the fog creeps in from the edges of the glass: a soft-edged clear centre that shrinks to nothing (u)
  const e = expoOut(u), R = 1150, inner = clamp(1 - e) * .82;
  const veil = (a) => rad(ctx, 960, 470, R, [[0, rgba(PAL.ink1, inner > .01 ? 0 : a * .92)], [Math.max(.001, inner), rgba(PAL.ink1, inner > .01 ? 0 : a * .92)], [Math.min(.999, inner + .16), rgba(mixHex(PAL.ink1, PAL.paper2, .45), a * .8)], [1, rgba(PAL.ink1, a)]]);
  ctx.save(); ctx.scale(1, .56); ctx.translate(0, 470 / .56 - 470); ctx.fillStyle = veil(.45); ctx.fillRect(-60, -400, W + 120, 2400); ctx.restore();
  // frost specks (cached) on the veil
  ctx.fillStyle = rgba(PAL.ink0, .16 * e); for (const [dx, dy, dr] of DROPS) { ctx.beginPath(); ctx.arc(dx, dy, dr, 0, 6.29); ctx.fill(); }
  ctx.restore();
}
// the driver's seat back (dark paper, lit edge) in front of you
const SEAT = (() => { const p = new Path2D(); p.roundRect(300, 880, 360, 340, [64, 64, 0, 0]); return p; })();
export function seat(ctx) { F.paperCut(ctx, SEAT, PAL.cut1, { edgeCol: PAL.cutLit, edgeA: .8, edgeW: 4, ex: 0, ey: 3 }); }
const DROPS = (() => { const r = prng(512), o = []; for (let i = 0; i < 140; i++) o.push([r() * W, 170 + r() * 640, 1.5 + r() * 3.5]); return o; })();
// a thick swath round a polyline as one closed outline (clockwise), to cut out of the fog
export function swath(pts, r) {
  const L = offsetPts(pts, r), R = offsetPts(pts, -r).reverse(), a0 = pts[0], a1 = pts[pts.length - 1], cap = (c, from, n = 10) => { const out = []; for (let i = 1; i < n; i++) { const a = from + i / n * Math.PI; out.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } return out; };
  const d0 = Math.atan2(pts[1][1] - a0[1], pts[1][0] - a0[0]), d1 = Math.atan2(a1[1] - pts[pts.length - 2][1], a1[0] - pts[pts.length - 2][0]);
  return [...L, ...cap(a1, d1 - Math.PI / 2), ...R, ...cap(a0, d0 + Math.PI / 2)];
}

// ---------------------------------------------------------------------------------------------------------------- c07 things
// a census slip: a small lit form (header CENSUS, the year, tally marks). (x, y) = the point it marks (bottom centre), w = width
export function censusSlip(ctx, t, x, y, w, year, o = {}) {
  const h = w * .7; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.globalAlpha *= o.a ?? 1;
  ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = w * .08; ctx.shadowOffsetX = w * .03; ctx.shadowOffsetY = w * .05;
  ctx.fillStyle = PAL.card; ctx.fillRect(-w / 2, -h - w * .08, w, h); ctx.shadowColor = 'transparent';
  ctx.fillStyle = PAL.cInk0; ctx.fillRect(-w / 2, -h - w * .08, w, h * .26);
  ctx.font = `700 ${w * .11}px Inter`; ctx.letterSpacing = '0.18em'; ctx.textAlign = 'center'; ctx.fillStyle = PAL.card; ctx.fillText('CENSUS', 0, -h - w * .08 + h * .19);
  ctx.letterSpacing = '0em'; ctx.font = `${w * .3}px "Instrument Serif"`; ctx.fillStyle = PAL.cInk0; ctx.fillText(String(year), 0, -w * .08 - h * .3);
  ctx.strokeStyle = PAL.cInk1; ctx.lineWidth = w * .018; ctx.lineCap = 'round';
  for (let g = 0; g < 2; g++) { const gx = -w * .32 + g * w * .36, gy = -w * .08 - h * .1; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(gx + k * w * .05, gy); ctx.lineTo(gx + k * w * .05 + w * .01, gy - h * .17); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(gx - w * .02, gy - h * .02); ctx.lineTo(gx + w * .2, gy - h * .15); ctx.stroke(); }
  ctx.restore();
  // the point on the line it marks: a gold bead
  ctx.fillStyle = PAL.gold0; ctx.beginPath(); ctx.arc(x, y, w * .055, 0, 6.29); ctx.fill();
}
// a little copy of the public chart (cream card, a cool curve with printed points)
export function chartCopy(ctx, x, y, w, rot, o = {}) {
  const h = w * .66; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= o.a ?? 1;
  ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = w * .07; ctx.shadowOffsetX = w * .03; ctx.shadowOffsetY = w * .05;
  ctx.fillStyle = PAL.card; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = PAL.cInk1; ctx.lineWidth = w * .012; ctx.beginPath(); ctx.moveTo(-w * .38, -h * .34); ctx.lineTo(-w * .38, h * .32); ctx.lineTo(w * .4, h * .32); ctx.stroke();
  const pts = []; for (let i = 0; i <= 24; i++) { const s = i / 24; pts.push([-w * .36 + w * .7 * Math.pow(s, .8), h * .3 - h * .58 * (Math.exp(4.5 * s) - 1) / (Math.exp(4.5) - 1)]); }
  ctx.strokeStyle = PAL.cool3; ctx.lineWidth = w * .022; ctx.lineJoin = 'round'; strokePts(ctx, pts);
  ctx.fillStyle = PAL.cool3; for (const s of [.45, .6, .72, .82, .9]) { const p = pts[Math.round(s * 24)]; ctx.beginPath(); ctx.arc(p[0], p[1], w * .02, 0, 6.29); ctx.fill(); }
  if (o.lab) { ctx.font = `700 ${w * .07}px Inter`; ctx.letterSpacing = '0.12em'; ctx.fillStyle = PAL.cInk0; ctx.textAlign = 'left'; ctx.fillText(o.lab, -w * .34, -h * .36 + w * .1); }
  ctx.restore();
}
// the doorframe (paper cut) with pencil height marks. (x, yb) = the floor at the left post; w × h the opening
export function doorframe(ctx, x, yb, w, h, o = {}) {
  const t = w * .14, p = new Path2D();
  p.rect(x - t, yb - h - t, t, h + t); p.rect(x + w, yb - h - t, t, h + t); p.rect(x - t, yb - h - t, w + t * 2, t);
  F.paperCut(ctx, p, PAL.cut2, { edgeCol: o.edge ?? PAL.cutLit, edgeA: .8, edgeW: 3 });
  // pencil height marks on the right post (dates of growing up)
  ctx.save(); ctx.shadowColor = 'transparent';
  const marks = o.marks ?? [.38, .5, .6, .68]; marks.forEach((m, i) => { const yy = yb - h * m, mu = clamp((o.mu ?? 1) * 4 - i); if (mu <= 0) return; ctx.strokeStyle = rgba(PAL.ink0, .75); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w + t * .1, yy); ctx.lineTo(x + w + t * .1 + t * .8 * mu, yy); ctx.stroke(); });
  ctx.restore();
}
// the wooden ruler (vertical, standing on the floor at (x, yb), length L, width w). Ticks every 1/12, numbers on the inch marks.
export function ruler(ctx, x, yb, L, w, o = {}) {
  ctx.save(); ctx.translate(x, yb); ctx.rotate(o.rot ?? 0);
  const p = new Path2D(); p.rect(-w / 2, -L, w, L);
  ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = w * .5; ctx.shadowOffsetX = w * .15; ctx.shadowOffsetY = w * .2;
  ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, PAL.gold2], [.5, PAL.gold1], [1, mixHex(PAL.gold2, PAL.gold3, .5)]]); ctx.fill(p); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = rgba(PAL.cInk0, .85); ctx.lineWidth = Math.max(1.2, w * .05);
  const n = 24; for (let i = 1; i < n; i++) { const yy = -L * i / n, l = i % 4 === 0 ? .5 : .25; ctx.beginPath(); ctx.moveTo(-w / 2, yy); ctx.lineTo(-w / 2 + w * l, yy); ctx.stroke(); }
  ctx.font = `600 ${w * .32}px Inter`; ctx.fillStyle = PAL.cInk0; ctx.textAlign = 'right'; for (let i = 4; i < n; i += 4) ctx.fillText(String(i / 4), w * .42, -L * i / n + w * .12);
  ctx.restore();
}
// a stack of task cards that thins: n cards, k of them still there (fractional: the top one slides off left and lays down)
export function taskStack(ctx, t, x, yb, w, n, k, o = {}) {
  const h = w * .6;
  for (let i = 0; i < n; i++) {
    const gone = clamp(n - k - (n - 1 - i));   // top cards go first
    if (gone >= 1) continue;
    const e = expoIn(gone), dx = -e * w * 2.2, dy = -Math.sin(gone * Math.PI) * w * .25, rot = -e * .5 + (i % 2 ? .02 : -.015);
    ctx.save(); ctx.globalAlpha *= 1 - smooth(span(gone, .55, 1)); ctx.translate(x + dx + (i % 3 - 1) * 2, yb - i * w * .055 + dy); ctx.rotate(rot);
    ctx.shadowColor = rgba(PAL.desk0, .3); ctx.shadowBlur = w * .05; ctx.shadowOffsetY = w * .03;
    ctx.fillStyle = i % 2 ? PAL.card : mixHex(PAL.card, PAL.cardShade, .4); ctx.fillRect(-w / 2, -h, w, h); ctx.shadowColor = 'transparent';
    {   // every card carries its lines and TASK (only the top one shows; no header jump when one leaves)
 ctx.strokeStyle = rgba(PAL.cardLine, .8); ctx.lineWidth = 2; for (let j = 1; j < 4; j++) { ctx.beginPath(); ctx.moveTo(-w * .4, -h + h * .22 * j + h * .12); ctx.lineTo(w * .4, -h + h * .22 * j + h * .12); ctx.stroke(); } ctx.fillStyle = PAL.cInk0; ctx.font = `700 ${w * .1}px Inter`; ctx.textAlign = 'center'; ctx.letterSpacing = '0.14em'; ctx.fillText('TASK', 0, -h + h * .2); }
    ctx.restore();
  }
}
// the measuring tape along a polyline (cream ribbon with ticks), drawn up to u
export function tape(ctx, pts, u, w, o = {}) {
  if (u <= 0) return; const p = partial(pts, u);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
  ctx.strokeStyle = rgba(PAL.desk0, .3); ctx.lineWidth = w * 1.2; ctx.translate(w * .12, w * .18); strokePts(ctx, p); ctx.translate(-w * .12, -w * .18);
  ctx.strokeStyle = PAL.gold1; ctx.lineWidth = w; strokePts(ctx, p);
  ctx.strokeStyle = rgba(PAL.gold3, .9); ctx.lineWidth = w * .1; strokePts(ctx, offsetPts(p, w * .45));
  // ticks every w*.5 along the ribbon, longer every 5th
  let acc = 0, k = 0; const step = w * .5;
  ctx.strokeStyle = rgba(PAL.cInk0, .85); ctx.lineWidth = Math.max(1, w * .06);
  for (let i = 1; i < p.length; i++) {
    const [ax, ay] = p[i - 1], [bx, by] = p[i], L = Math.hypot(bx - ax, by - ay); if (L < 1e-6) continue; const nx = -(by - ay) / L, ny = (bx - ax) / L;
    while (acc + step <= L + 1e-6 && k < 4000) { acc += step; k++; const f = acc / L, x = lerp(ax, bx, f), y = lerp(ay, by, f), l = k % 5 ? .28 : .5; ctx.beginPath(); ctx.moveTo(x - nx * w * .5, y - ny * w * .5); ctx.lineTo(x - nx * w * (.5 - l), y - ny * w * (.5 - l)); ctx.stroke(); }
    acc -= L;
  }
  const hd = p[p.length - 1];
  if (u < 1) { ctx.fillStyle = PAL.gold3; ctx.beginPath(); ctx.arc(hd[0], hd[1], w * .32, 0, 6.29); ctx.fill(); }
  ctx.restore();
  return hd;
}
// the weather strip: small cream cards MON TUE WED with icons; the last icon = the line's next step (cool rising stroke)
export function weatherStrip(ctx, t, x, y, cw, u, o = {}) {
  const days = ['MON', 'TUE', 'WED'];
  days.forEach((d, i) => {
    const k = expoOut(span(u, i * .18, i * .18 + .55)); if (k <= 0) return;
    const cx = x + i * cw * 1.12 - (1 - k) * cw * 1.5, ch = cw * 1.25;
    ctx.save(); ctx.translate(cx, y); ctx.rotate((1 - k) * -.15);
    ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = cw * .1; ctx.shadowOffsetX = cw * .04; ctx.shadowOffsetY = cw * .06;
    ctx.fillStyle = PAL.card; ctx.fillRect(0, 0, cw, ch); ctx.shadowColor = 'transparent';
    ctx.font = `700 ${cw * .17}px Inter`; ctx.letterSpacing = '0.14em'; ctx.textAlign = 'center'; ctx.fillStyle = PAL.cInk1; ctx.fillText(d, cw / 2, ch * .22);
    const ix = cw / 2, iy = ch * .62, r = cw * .2;
    if (i === 0) { ctx.fillStyle = PAL.cAccent; ctx.beginPath(); ctx.arc(ix, iy, r * .6, 0, 6.29); ctx.fill(); ctx.strokeStyle = PAL.cAccent; ctx.lineWidth = cw * .03; for (let j = 0; j < 8; j++) { const a = j / 8 * 6.283 + t * .3; ctx.beginPath(); ctx.moveTo(ix + Math.cos(a) * r * .85, iy + Math.sin(a) * r * .85); ctx.lineTo(ix + Math.cos(a) * r * 1.2, iy + Math.sin(a) * r * 1.2); ctx.stroke(); } }
    else if (i === 1) { ctx.fillStyle = PAL.cInk1; ctx.beginPath(); ctx.arc(ix - r * .4, iy + r * .1, r * .5, 0, 6.29); ctx.arc(ix + r * .2, iy - r * .15, r * .62, 0, 6.29); ctx.arc(ix + r * .75, iy + r * .15, r * .42, 0, 6.29); ctx.fill(); ctx.fillRect(ix - r * .9, iy + r * .1, r * 2, r * .48); }
    else { const pts = []; for (let j = 0; j <= 12; j++) { const s = j / 12; pts.push([ix - r * 1.1 + r * 2 * s, iy + r * .8 - r * 1.8 * (Math.exp(3.5 * s) - 1) / (Math.exp(3.5) - 1)]); } ctx.strokeStyle = PAL.cool3; ctx.lineWidth = cw * .05; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; strokePts(ctx, partial(pts, clamp((u - .55) * 3))); }
    ctx.restore();
  });
}

// ---------------------------------------------------------------------------------------------------------------- c08 things
// papers in your hands: kind 'contract' | 'bill' | 'napkin'. Centre (x, y), width w, rot
export function paper(ctx, kind, x, y, w, rot, o = {}) {
  const h = kind === 'napkin' ? w : w * 1.3; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= o.a ?? 1;
  ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = w * .08; ctx.shadowOffsetX = w * .03; ctx.shadowOffsetY = w * .05;
  ctx.fillStyle = kind === 'napkin' ? mixHex(PAL.card, '#ffffff', .2) : PAL.card;
  if (kind === 'napkin') { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - w * .18, -h / 2); ctx.lineTo(w / 2, -h / 2 + w * .18); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); }
  else ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.shadowColor = 'transparent';
  ctx.textAlign = 'center'; ctx.letterSpacing = '0.12em';
  if (kind === 'contract') {
    ctx.font = `700 ${w * .11}px Inter`; ctx.fillStyle = PAL.cInk0; ctx.fillText('CONTRACT', 0, -h * .34);
    ctx.strokeStyle = rgba(PAL.cardLine, .9); ctx.lineWidth = w * .02; for (let i = 0; i < 6; i++) { const yy = -h * .2 + i * h * .08; ctx.beginPath(); ctx.moveTo(-w * .36, yy); ctx.lineTo(w * (i === 5 ? .1 : .36), yy); ctx.stroke(); }
    ctx.strokeStyle = PAL.cInk1; ctx.lineWidth = w * .015; ctx.beginPath(); ctx.moveTo(-w * .36, h * .36); ctx.lineTo(w * .2, h * .36); ctx.stroke();
    ctx.font = `700 ${w * .1}px Inter`; ctx.fillStyle = PAL.cAccent; ctx.fillText('×', -w * .3, h * .34);
  } else if (kind === 'bill') {
    ctx.font = `700 ${w * .1}px Inter`; ctx.fillStyle = PAL.cInk0; ctx.fillText('MEDICAL BILL', 0, -h * .34);
    ctx.strokeStyle = rgba(PAL.cardLine, .9); ctx.lineWidth = w * .02; for (let i = 0; i < 4; i++) { const yy = -h * .2 + i * h * .08; ctx.beginPath(); ctx.moveTo(-w * .36, yy); ctx.lineTo(w * .1, yy); ctx.moveTo(w * .2, yy); ctx.lineTo(w * .36, yy); ctx.stroke(); }
    ctx.strokeStyle = PAL.cInk1; ctx.lineWidth = w * .015; ctx.beginPath(); ctx.moveTo(-w * .36, h * .16); ctx.lineTo(w * .36, h * .16); ctx.stroke();
    ctx.font = `700 ${w * .1}px Inter`; ctx.textAlign = 'left'; ctx.fillStyle = PAL.cInk0; ctx.fillText('TOTAL', -w * .36, h * .3);
    ctx.font = `italic ${w * .26}px "Instrument Serif Italic"`; ctx.textAlign = 'right'; ctx.fillStyle = PAL.cAccent; ctx.letterSpacing = '0em'; ctx.fillText('?', w * .36, h * .36);
  } else {
    // napkin: a pencil sketch (a little house with a light, an arrow up)
    ctx.strokeStyle = PAL.cInk1; ctx.lineWidth = w * .022; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-w * .28, h * .25); ctx.lineTo(-w * .28, -h * .02); ctx.lineTo(-w * .08, -h * .2); ctx.lineTo(w * .12, -h * .02); ctx.lineTo(w * .12, h * .25); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = PAL.cAccent; ctx.fillRect(-w * .14, h * .04, w * .1, w * .1);
    ctx.beginPath(); ctx.moveTo(w * .22, h * .25); ctx.lineTo(w * .32, -h * .25); ctx.moveTo(w * .25, -h * .17); ctx.lineTo(w * .32, -h * .25); ctx.lineTo(w * .38, -h * .15); ctx.stroke();
  }
  ctx.restore();
}
// the expert's door in a dark wall (design coords on the wall layer). (cx, yb) = threshold centre, dw × dh opening (arched top).
// o: { open 0..1 (the leaf swings wide on its left hinge), leak (light round the closed leaf), lightA }
export function doorPath(cx, yb, dw, dh, p = new Path2D()) { p.moveTo(cx - dw / 2, yb); p.lineTo(cx - dw / 2, yb - dh + dw / 2); p.arc(cx, yb - dh + dw / 2, dw / 2, Math.PI, 0); p.lineTo(cx + dw / 2, yb); p.closePath(); return p; }
export function wall(ctx, cx, yb, dw, dh, box, o = {}) {
  const [x0, y0, x1, y1] = box, p = new Path2D(); p.rect(x0, y0, x1 - x0, y1 - y0); doorPath(cx, yb, dw, dh, p);   // (no addPath: see FRAME)
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, PAL.desk0], [.55, PAL.cut0], [1, PAL.desk1]]); ctx.fill(p, 'evenodd');
  // warm light thrown from the doorway onto the wall and the floor in front of it
  const L = o.lightA ?? 0;
  if (L > 0) {
    ctx.save(); ctx.clip(p, 'evenodd');
    ctx.fillStyle = rad(ctx, cx, yb - dh * .45, dh * 1.3, [[0, rgba(PAL.gold2, .3 * L)], [.5, rgba(PAL.gold3, .12 * L)], [1, rgba(PAL.gold3, 0)]]); ctx.fillRect(cx - dh * 1.4, yb - dh * 1.8, dh * 2.8, dh * 2.4);
    // the floor: a trapezoid of light spilling toward the viewer
    const sp = o.spill ?? 0; if (sp > 0) { const q = new Path2D(); q.moveTo(cx - dw / 2, yb); q.lineTo(cx + dw / 2, yb); q.lineTo(cx + dw * (.5 + 1.1 * sp), yb + dh * .9 * sp); q.lineTo(cx - dw * (.5 + 1.1 * sp), yb + dh * .9 * sp); q.closePath(); ctx.fillStyle = lin(ctx, 0, yb, 0, yb + dh * .9, [[0, rgba(PAL.gold1, .5 * sp * L)], [1, rgba(PAL.gold2, 0)]]); ctx.fill(q); }
    ctx.restore();
  }
  // the threshold line and the lit jambs
  ctx.strokeStyle = rgba(PAL.gold2, .35 + .5 * L); ctx.lineWidth = 4; ctx.stroke(doorPath(cx, yb, dw, dh));
  ctx.strokeStyle = rgba(PAL.cutLit, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(cx - dw / 2, yb); ctx.moveTo(cx + dw / 2, yb); ctx.lineTo(x1, yb); ctx.stroke();
}
// the door leaf: hinged on the left jamb; open 0..1 (cos-squeezed). The brass plate on it.
export function doorLeaf(ctx, cx, yb, dw, dh, open, o = {}) {
  const k = Math.cos(clamp(open) * Math.PI * .47); if (k <= .02) return;
  ctx.save(); ctx.translate(cx - dw / 2, 0); ctx.scale(k, 1); ctx.translate(-(cx - dw / 2), 0);
  const p = doorPath(cx, yb, dw * .97, dh * .985);
  ctx.fillStyle = lin(ctx, cx - dw / 2, 0, cx + dw / 2, 0, [[0, PAL.cut2], [1, mixHex(PAL.cut2, PAL.cut0, .4 + .4 * open)]]); ctx.fill(p);
  ctx.strokeStyle = rgba(PAL.cutLit, .7); ctx.lineWidth = 3; ctx.stroke(p);
  ctx.strokeStyle = rgba(PAL.desk0, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(cx - dw * .34, yb - dh * .72, dw * .68, dh * .3, 6); ctx.roundRect(cx - dw * .34, yb - dh * .36, dw * .68, dh * .28, 6); ctx.stroke();
  ctx.fillStyle = lin(ctx, cx - dw * .18, 0, cx + dw * .18, 0, [[0, PAL.gold3], [.5, PAL.gold1], [1, PAL.gold3]]); ctx.fillRect(cx - dw * .18, yb - dh * .5, dw * .36, dw * .1);   // the brass plate
  ctx.strokeStyle = rgba(PAL.cInk1, .7); ctx.lineWidth = 1.5; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(cx - dw * .13, yb - dh * .5 + dw * (.035 + i * .035)); ctx.lineTo(cx + dw * .13, yb - dh * .5 + dw * (.035 + i * .035)); ctx.stroke(); }
  ctx.fillStyle = PAL.gold2; ctx.beginPath(); ctx.arc(cx + dw * .36, yb - dh * .42, dw * .03, 0, 6.29); ctx.fill();
  ctx.restore();
}
// the velvet rope on two brass posts; drop 0..1 (unhooks from the right post and swings down to hang from the left)
export function rope(ctx, t, xa, xb, yb, ph, drop, o = {}) {
  const post = (x) => { ctx.fillStyle = lin(ctx, x - 8, 0, x + 8, 0, [[0, PAL.gold3], [.5, PAL.gold1], [1, PAL.gold3]]); ctx.fillRect(x - 7, yb - ph, 14, ph); ctx.beginPath(); ctx.arc(x, yb - ph - 6, 11, 0, 6.29); ctx.fill(); ctx.fillRect(x - 22, yb - 8, 44, 8); };
  post(xa); post(xb);
  const d = clamp(drop), ax = xa, ay = yb - ph + 4;
  // the free end: hooked on the right post, then swings down on an arc round the left post and settles hanging
  const L = xb - xa, a = lerp(0, Math.PI / 2 * 1.02, expoIn(Math.min(1, d * 1.2))) - .1 * Math.sin(Math.PI * clamp(d * 1.6 - .6)) * (1 - d);
  const ex = ax + Math.cos(a) * L * lerp(1, .6, d), ey = ay + Math.sin(a) * L * lerp(1, .6, d), sag = lerp(L * .22, L * .05, d) * (1 + .03 * Math.sin(t * 2));
  ctx.strokeStyle = PAL.gold3; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo((ax + ex) / 2 + Math.sin(a) * sag * .2, (ay + ey) / 2 + sag * Math.cos(a), ex, ey); ctx.stroke();
  ctx.strokeStyle = rgba(PAL.gold2, .55); ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = PAL.gold2; ctx.beginPath(); ctx.arc(ex, ey, 6, 0, 6.29); ctx.fill();
}
