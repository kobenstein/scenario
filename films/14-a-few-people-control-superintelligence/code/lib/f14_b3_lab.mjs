// Film 14 · B3 · c07 "the second key" (shots 7.01–7.11) · the lab street at night: two labs side by side, their round windows.
// Drawn in SET-A coordinates (window A at (960, 470), r 300, exactly the plate window); the caller puts set A at x offset OA on the
// F0 card. Plan (beat sheet: lib/f14_b3_world.mjs header) · rules: docs/MOTION.md · shots: docs/shots.md c07.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as X from './f14_kit.mjs';
import { launchRoom, LR, keyPose } from './f14_b1_rooms.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, rad, lin, drift, prng, card, cardM, F0 } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;

export const OA = -3400;                                   // set A sits left of the mountains (c08 is at x 0)
export const WA = { cx: 960, cy: 470, r: 300 };            // = PLATE_WINDOW
export const WB = { cx: 2500, cy: 470, r: 300 };
export const FA = { x0: -1400, x1: 1960, y0: -60 };        // facade A (covers the whole frame at the plate)
export const FB = { x0: 2010, x1: 3080, y0: 120 };         // facade B: the other lab, lower roof
export const GROUND = 960;
export const ZR = 2600, ZB = 2400;                         // the launch room behind window A · the room behind window B
export const TBL = { w: 600, h: 460, rows: 4, cols: 4 };   // a test table (the window becomes it)
export const DESK = { x: 1250, top: 905 };                 // 7.08: you at the desk (du stands at DESK.x)

// ------------------------------------------------------------------------------------------------ shapes
// the window frame as it morphs into a table: m 0 = circle r, 1 = rounded rectangle TBL.w × TBL.h (64 points)
export function portPts(w, m) {
  const out = [], n = 72, hw = TBL.w / 2, hh = TBL.h / 2;
  for (let i = 0; i < n; i++) {
    const q = i / n * Math.PI * 2, c = Math.cos(q), s = Math.sin(q);
    const kr = Math.min(hw / Math.max(1e-6, Math.abs(c)), hh / Math.max(1e-6, Math.abs(s)));   // ray hits the rectangle
    const r = lerp(w.r, kr, smooth(m));
    out.push([w.cx + c * r, w.cy + s * r]);
  }
  return out;
}
const polyPath = (pts, ccw = false) => { const p = new Path2D(); const q = ccw ? pts.slice().reverse() : pts; q.forEach((v, i) => (i ? p.lineTo(v[0], v[1]) : p.moveTo(v[0], v[1]))); p.closePath(); return p; };
export function portPath(w, m, grow = 0) {
  if (m <= 0) { const p = new Path2D(); p.arc(w.cx, w.cy, w.r + grow, 0, Math.PI * 2); return p; }
  return polyPath(portPts(w, m).map(([x, y]) => { const d = Math.hypot(x - w.cx, y - w.cy) || 1; return [w.cx + (x - w.cx) * (1 + grow / d), w.cy + (y - w.cy) * (1 + grow / d)]; }));
}
// cell centre of a table at window w (row i, col j); quad tilt τ (top edge comes forward: wider, a little lower)
export function cellAt(w, i, j, tilt = 0) {
  const u = (j + .5) / TBL.cols, v = (i + .5) / TBL.rows, hw = TBL.w / 2 * (1 + .1 * tilt * (1 - v)), hh = TBL.h / 2 * (1 - .06 * tilt);
  return [w.cx + (u - .5) * 2 * hw, w.cy - hh + v * 2 * hh + 10 * tilt];
}
const quadPt = (w, u, v, tilt) => { const hw = TBL.w / 2 * (1 + .1 * tilt * (1 - v)), hh = TBL.h / 2 * (1 - .06 * tilt); return [w.cx + (u - .5) * 2 * hw, w.cy - hh + v * 2 * hh + 10 * tilt]; };

// a check mark / a cross, drawn by a pen (u 0..1)
function check(ctx, x, y, s, u, col, w = 4) {
  if (u <= 0) return; const pts = [[-.45, .02], [-.12, .36], [.5, -.42]];
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  const L1 = Math.hypot(.33, .34), L2 = Math.hypot(.62, .78), d = (L1 + L2) * clamp(u);
  ctx.moveTo(x + pts[0][0] * s, y + pts[0][1] * s);
  if (d <= L1) ctx.lineTo(x + lerp(pts[0][0], pts[1][0], d / L1) * s, y + lerp(pts[0][1], pts[1][1], d / L1) * s);
  else { ctx.lineTo(x + pts[1][0] * s, y + pts[1][1] * s); const f = (d - L1) / L2; ctx.lineTo(x + lerp(pts[1][0], pts[2][0], f) * s, y + lerp(pts[1][1], pts[2][1], f) * s); }
  ctx.stroke(); ctx.restore();
}
function cross(ctx, x, y, s, u, col, w = 4) {
  if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  const a = clamp(u * 2), b = clamp(u * 2 - 1);
  ctx.beginPath(); ctx.moveTo(x - .35 * s, y - .35 * s); ctx.lineTo(x + lerp(-.35, .35, a) * s, y + lerp(-.35, .35, a) * s);
  if (b > 0) { ctx.moveTo(x + .35 * s, y - .35 * s); ctx.lineTo(x + lerp(.35, -.35, b) * s, y + lerp(-.35, .35, b) * s); }
  ctx.stroke(); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the facades (design = set A local)
// facade A: exactly the plate's facade around the window (radial gradient round the window, the four seams); edges with rim light
export function facade(ctx, f, w, o = {}) {
  ctx.save();
  ctx.fillStyle = rad(ctx, w.cx, w.cy, 1250, o.stops || [[0, mixHex(P.ind2, P.blue0, .14)], [.5, P.ind1], [1, P.night0]]);
  ctx.fillRect(f.x0, f.y0, f.x1 - f.x0, GROUND - f.y0);
  ctx.strokeStyle = rgba(P.blue0, .32); ctx.lineWidth = 1.5;
  for (const yy of [130, 250, 700, 820]) { if (yy < f.y0) continue; ctx.beginPath(); ctx.moveTo(f.x0, yy); ctx.lineTo(f.x1, yy); ctx.stroke(); }
  // the lit edges (only seen once the camera pulls back): roof line and the right corner (blue key light)
  ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f.x0, f.y0); ctx.lineTo(f.x1, f.y0); ctx.lineTo(f.x1, GROUND); ctx.stroke();
  ctx.fillStyle = P.night1; for (const [bx, bw, bh] of o.roof || []) { ctx.fillRect(bx, f.y0 - bh, bw, bh); ctx.fillStyle = rgba(P.blue0, .7); ctx.fillRect(bx, f.y0 - bh, bw, 2); ctx.fillStyle = P.night1; }
  ctx.restore();
}
// a clip region = everything except the port (a big clockwise rectangle, the port anticlockwise: nonzero winding cuts the hole)
function holeClip(w, m) {
  const p = new Path2D(); p.moveTo(-9000, -9000); p.lineTo(9000, -9000); p.lineTo(9000, 9000); p.lineTo(-9000, 9000); p.closePath();
  if (m <= 0) { p.moveTo(w.cx + w.r, w.cy); p.arc(w.cx, w.cy, w.r, 0, Math.PI * 2, true); }
  else { const q = portPts(w, m).reverse(); q.forEach((v, i) => (i ? p.lineTo(v[0], v[1]) : p.moveTo(v[0], v[1]))); p.closePath(); }
  return p;
}
// the window frame (dark ring + blue rim, or the table frame when m > 0)
function frame(ctx, w, m) {
  ctx.save();
  if (m <= 0) {
    ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(w.cx, w.cy, w.r + 8, 0, 6.29); ctx.stroke();
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(w.cx, w.cy, w.r + 20, 0, 6.29); ctx.stroke();
  } else {
    ctx.lineJoin = 'round';
    ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = 22; ctx.stroke(portPath(w, m, 8));
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .35 * m), .9); ctx.lineWidth = 2.5; ctx.stroke(portPath(w, m, 20));
  }
  ctx.restore();
}
// the warm frosted glass of window A (plate), opened from the centre by an iris of radius ri (0 = closed)
function frosted(ctx, w, t, ri, mun) {
  const { cx, cy, r } = w, b = 1 + .025 * Math.sin(t * 1.1);
  if (ri <= 0) { ctx.save(); ctx.filter = 'blur(40px)'; ctx.fillStyle = rgba(P.halo1, .3 * b); ctx.beginPath(); ctx.arc(cx, cy, r + 30, 0, 6.29); ctx.fill(); ctx.restore(); }
  else { const g = 1 - smooth(clamp(ri / r)); if (g > 0) { ctx.save(); ctx.filter = 'blur(40px)'; ctx.fillStyle = rgba(P.halo1, .3 * b * g); ctx.beginPath(); ctx.arc(cx, cy, r + 30, 0, 6.29); ctx.arc(cx, cy, Math.max(0, r - 60), 0, 6.29, true); ctx.fill(); ctx.restore(); } }
  if (ri < r) {
    const fillS = rad(ctx, cx, cy - 40, r * 1.05, [[0, P.core1], [.35, P.halo0], [.75, P.halo1], [1, P.shade0]]);
    ctx.fillStyle = fillS; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.29);
    if (ri > 0) ctx.arc(cx, cy, ri, 0, 6.29, true);
    ctx.fill();
    if (ri > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(10px)'; ctx.strokeStyle = rgba(P.core1, .5 * (1 - ri / r)); ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, ri, 0, 6.29); ctx.stroke(); ctx.restore(); }
  }
  // muntins (a cross): they retract into the ring as the iris opens (mun 1 = full, 0 = gone)
  if (mun > 0) {
    const r0 = ri <= 0 ? 0 : Math.max(ri, r * (1 - mun));
    ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = 9; ctx.beginPath();
    if (r0 <= 0) { ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); }
    else for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.moveTo(cx + dx * r0, cy + dy * r0); ctx.lineTo(cx + dx * r, cy + dy * r); }
    ctx.stroke();
  }
}

// ------------------------------------------------------------------------------------------------ the set
// a: anchors (world.mjs) · returns { draw(ctx, t, c) } drawing everything of set A for camera c (world coords; set A at OA)
export function lab(a) {
  const T0 = a.s14;
  // --- timing (words → times) ---
  const tIris0 = a.missile - .1, tIris1 = a.twoKeys + .2;
  const tTurn = a.turned - .05, tRoom0 = a.sameRoom - .15, tRoom1 = a.sameRoom + 1.1;
  const tLift0 = a.secondKey - .15, tFly0 = a.secondKey + .3, tFly1 = a.someone + .05;
  const tHand0 = a.secondKey + .2, tWith0 = a.august + .4, tWith1 = a.august + 2.1;
  const tDim0 = a.happened, tDim1 = a.happened + 1.6;                         // the rooms sink into the dark (lamps off, keys sunk)
  const tMorphA = [a.competitors - .65, a.competitors + 1.0], tMorphB = [a.competitors - .25, a.competitors + 1.4];
  const tTitle = a.tested - .1;
  const tChkA = [a.safetyTests, a.safetyTests + 1.9], tChkB = [a.safetyTests + 1.95, a.safetyTests + 3.6];
  const tTilt = [a.published - .1, a.published + 1.3], tUnc = a.uncomfortable;
  const tWeak = a.weakSpots, tDay = [a.daylight - .9, a.daylight + .7], tFix = a.fixed;
  const tWalk = [a.why + .3, a.why + 4.9];
  const tRows = [a.finding - .2, a.finding + 2.0], tAxis = [a.finding + 1.4, a.finding + 2.3], tGrow = a.almostEvery, tOften = a.tooOften, tFlag = a.flag;
  const tRet = [a.fieldWord - .1, a.fieldWord + 1.1], tSyc = a.sycophancy, tSub = a.tellsYou, tNot = a.notWord;
  const tSink = [a.picture - .25, a.picture + .4], tCord = [a.picture - .1, a.picture + 1.1], tLamp = a.picture + .9;   // lead: lamp on during the tilt (no empty frame)
  const tBub = [a.hearing, a.only + .1, a.yesWord + .25], tPleasant = a.pleasant, tHelp = a.help;
  const tLampOff = a.thats + .9, tBubUp = [a.thats - .1, a.thats + 2.1];
  const tOwn = [a.rivalsEye - .7, a.rivalsEye + 1.4], tRiv = [a.rivalsEye + 1.1, a.skip + .05];
  const tBack = [a.andYet - .7, a.andYet + 1.6];
  const tBridge = [a.fragile - .2, a.fragile + 1.0], tLbl = [a.voluntary, a.pilot, a.noShared], tLblOut = a.soSecond + .1;
  const tGate = [a.soSecond + .8, a.soSecond + 1.4], tOpen = [a.handOver - .1, a.handOver + .45], tShut = [a.handOver + 1.1, a.handOver + 1.6];
  // --- cards & bars layout ---
  const AX = 1370, BW = 720, BY0 = 470 - 3.5 * 56, BP = 56;                 // bars: left axis x, length, first row y, pitch
  const BAR_LEN = [.93, .86, .97, .9, .48, .95, .88, .91];
  const DARK = { A: [[1, 2], [3, 0]], B: [[0, 3], [2, 1]] };                // cells the rival marks with a cross (uncomfortable)
  const FIXCELL = ['B', 2, 1];
  const YESCELL = [2, 3];                                                   // 7.09: the "yes" lands in table A, row 2, col 3
  const KEYH = LR.keyH;

  // the key in flight (7.02): from the room's slot R through window A, in an arc to window B, into the other hand
  function keyFlight(c, t, roomM) {
    const pose = keyPose(LR.slots[1], KEYH, 1);
    const sx = roomM.e + pose.x * roomM.k, sy = roomM.f + pose.y * roomM.k, sh = KEYH * roomM.k;   // the key as seen in the room
    const hb = E.project(c, F0, WB.cx + OA - 40, WB.cy + 10);
    const lift = sineIO(span(t, tLift0, tFly0)), fly = span(t, tFly0, tFly1), f = sineIO(fly);
    const x0 = sx, y0 = sy - lift * sh * .45;
    const x = lerp(x0, hb[0], f), y = lerp(y0, hb[1], f) - Math.sin(f * Math.PI) * 220 * hb[2] * 1.4;
    const h = lerp(sh, 120 * hb[2], f) * (1 + .25 * Math.sin(f * Math.PI));
    const rot = lerp(Math.PI / 2, -.5, sineIO(span(fly, 0, .8))) + .12 * Math.sin(f * Math.PI);
    return { x, y, h, rot, f, fly };
  }

  return function draw(ctx, t, c) {
    // ---------------- state ----------------
    const iris = expoOut(span(t, tIris0, tIris1)), mun = 1 - smooth(span(t, tIris0, tIris0 + .9));
    const dim = smooth(span(t, tDim0, tDim1));
    const mA = smooth(span(t, ...tMorphA)) * (1 - smooth(span(t, tBack[0] + .4, tBack[1] - .2)));
    const mB = smooth(span(t, ...tMorphB)) * (1 - smooth(span(t, tBack[0] + .5, tBack[1] - .1)));
    const tilt = sineIO(span(t, ...tTilt));
    const day = sineIO(span(t, ...tDay)) * (1 - smooth(span(t, tRows[0], tRows[1] + 1)));
    const tblDim = lerp(1, .38, smooth(span(t, tRows[0], tRows[1])));
    const lampU = smooth(span(t, tLamp - .1, tLamp + .5)) * (1 - expoIn(span(t, tLampOff, tLampOff + .25)) * .92);
    const hasRoom = t < tMorphA[1] + .2;
    const mF = cardM(c, F0);
    const A = (x) => x + OA;

    // ---------------- 1 · the rooms behind the windows (deeper cards, seen through the round holes) ----------------
    let roomM = null;
    if (hasRoom && iris > 0 && mF) {
      ctx.save(); ctx.setTransform(mF.k, 0, 0, mF.k, mF.e, mF.f); ctx.clip(portPath({ ...WA, cx: A(WA.cx) }, 0)); ctx.setTransform(1, 0, 0, 1, 0, 0);
      card(ctx, c, ZR, () => {
        // the room is designed as it looks at the end of the push: centre (960, 540), scaled .62 of B1's layout, counter edge low
        const mP = ROOM_M(a); ctx.translate((960 - mP.e) / mP.k, (540 - mP.f) / mP.k); ctx.scale(.62 / mP.k, .62 / mP.k); ctx.translate(-960, -560);
        { const M = ctx.getTransform(); roomM = { k: M.a, e: M.e, f: M.f }; }
        const keysOn = [1, t < tFly0 ? 1 : 0];
        launchRoom(ctx, t, { keys: keysOn, turn: [smooth(span(t, tTurn, tTurn + .35)), smooth(span(t, tTurn, tTurn + .35))], hands: 1, lum: lerp(1, .2, dim), lamp: 1 - dim, officers: 1, screen: 0, build: 1, measure: 0 });
        // "same room": one outline closes round both consoles (the walls), traced from both sides
        const wl = sineIO(span(t, tRoom0, tRoom1));
        if (wl > 0) {
          ctx.save(); ctx.strokeStyle = rgba(P.cream, .75 * (1 - dim)); ctx.lineWidth = 3.4; ctx.lineCap = 'round';
          const x0 = 360, x1 = 1560, y0 = 380, y1 = 860, half = (x1 - x0) / 2 + (y1 - y0);
          for (const sd of [-1, 1]) {   // from the bottom centre round each side to the top centre
            const d = half * wl, pts = sd < 0 ? [[960, y1], [x0, y1], [x0, y0], [960, y0]] : [[960, y1], [x1, y1], [x1, y0], [960, y0]];
            let left = d; ctx.beginPath(); ctx.moveTo(...pts[0]);
            for (let i = 1; i < pts.length && left > 0; i++) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), q = Math.min(1, left / L); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)); left -= L; }
            ctx.stroke();
          }
          ctx.restore();
        }
      });
      ctx.restore();
    }
    // the room behind window B: cool light, and the other hand that takes the key
    const handIn = sineIO(span(t, tHand0, tFly1 - .1)) * (1 - sineIO(span(t, tWith0, tWith1)));
    if (t < tMorphB[1] + .2 && mF) {
      ctx.save(); ctx.setTransform(mF.k, 0, 0, mF.k, mF.e, mF.f); ctx.clip(portPath({ ...WB, cx: A(WB.cx) }, 0));
      ctx.translate(OA, 0);
      const lit = 1 - .7 * dim;
      ctx.fillStyle = rad(ctx, WB.cx + 60, WB.cy - 60, WB.r * 1.3, [[0, mixHex(P.blue1, P.cream, .12 * lit)], [.55, mixHex(P.ind2, P.blue1, .35 * lit)], [1, P.night1]]); ctx.fillRect(WB.cx - 320, WB.cy - 320, 640, 640);
      ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(WB.cx - 300, WB.cy + 150); ctx.lineTo(WB.cx + 300, WB.cy + 150); ctx.stroke();   // a far counter inside
      ctx.restore();
    }
    // ---------------- 2 · the facades (set A on the F0 card) ----------------
    card(ctx, c, F0, () => {
      ctx.translate(OA, 0);
      // facade B first (it stands behind A's corner), then A; holes are made by clipping the facade out of the port
      for (const [f, w, m, roof] of [[FB, WB, mB, [[2200, 160, 22], [2760, 90, 34]]], [FA, WA, mA, [[120, 220, 26], [1420, 140, 40]]]]) {
        ctx.save(); ctx.clip(holeClip(w, m)); facade(ctx, f, w, { roof }); ctx.restore();
      }
      // after the tables (7.10): both windows are lit glass again — a warm lab and a cool lab, the bridge between them
      const lit2 = smooth(span(t, tBack[1] - .25, tBack[1] + 1.0));   // after the tables are round again (m = 0), as the lenses fade
      if (lit2 > 0) for (const [w, m, warm] of [[WA, mA, 1], [WB, mB, 0]]) {
        if (m > 0) continue;
        const b = 1 + .04 * Math.sin(t * .9 + warm * 2);
        ctx.fillStyle = rad(ctx, w.cx, w.cy - 60, w.r * 1.1, warm
          ? [[0, rgba(mixHex(P.halo1, P.cream, .2), .5 * lit2 * b)], [.55, rgba(P.halo1, .22 * lit2 * b)], [1, rgba(P.shade0, .3 * lit2)]]
          : [[0, rgba(mixHex(P.blue1, P.cream, .3), .4 * lit2 * b)], [.55, rgba(P.blue0, .2 * lit2 * b)], [1, rgba(P.ind1, .3 * lit2)]]);
        ctx.beginPath(); ctx.arc(w.cx, w.cy, w.r, 0, 6.29); ctx.fill();
      }
      // window B (the other lab): cool glass, empty until the hand comes
      if (mB <= 0) frame(ctx, WB, 0);
      // window A: the plate's warm glass, opening from the centre (iris) onto the launch room
      if (mA <= 0) { frosted(ctx, WA, t, iris * (WA.r + 2), mun); frame(ctx, WA, 0); }
      // ground strip, the warm pool, you (plate)
      ctx.fillStyle = P.night1; ctx.fillRect(-3000, GROUND, 6300, 1400);
      ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3000, GROUND); ctx.lineTo(3300, GROUND); ctx.stroke();
      ctx.fillStyle = rad(ctx, WA.cx, 962, 260, [[0, rgba(P.halo1, .22 * (1 - dim))], [1, rgba(P.halo1, 0)]]); ctx.fillRect(WA.cx - 260, 950, 520, 30);
      // you: stand under window A (plate) → walk to the desk while the tables are explained (small, at the bottom of the frame)
      const wk = span(t, ...tWalk), duX = lerp(WA.cx + 4 * drift(t, 1, 7), DESK.x, sineIO(wk));
      const walking = wk > 0 && wk < 1;
      const head = sineIO(span(t, tHelp - .3, tHelp + .9)) * (1 - sineIO(span(t, a.thats, a.thats + 1.2)));
      const atDesk = t > tCord[0];
      const deskL = lampU * (1 - smooth(span(t, tBack[0], tBack[1] - .2)));
      if (deskL > 0 && t < tBack[1]) desk(ctx, t, deskL, head);
      E.du(ctx, duX, GROUND, 92, walking ? { walk: wk * 22, dir: 1, light: -1 } : atDesk ? { dir: 1, light: -1, look: lerp(.25, 0, head), lean: .13 * head, armR: [lerp(.2, .9, smooth(span(t, tBub[0] - .3, tBub[0] + .5))) * (1 - head * .7), lerp(.1, 1.3, smooth(span(t, tBub[0] - .3, tBub[0] + .5))) * (1 - head * .6)] } : { light: 1, look: .25 * smooth(span(t, T0 + 1, T0 + 3)) });
      if (deskL > 0 && t < tBack[1]) lamp(ctx, t, deskL);
    });
    // ---------------- 3 · the tables (the windows become them), checks, light, lenses ----------------
    card(ctx, c, F0, () => {
      ctx.translate(OA, 0);
      for (const [w, m, id] of [[WA, mA, 'A'], [WB, mB, 'B']]) if (m > 0) table(ctx, t, w, m, id);
      // the check threads (7.04): from B into A's cells, then from A into B's
      for (const [from, to, tc, id] of [[WB, WA, tChkA, 'A'], [WA, WB, tChkB, 'B']]) {
        const u = span(t, ...tc); if (u <= 0 || u >= 1) continue;
        const head = threadHead(to, u, tilt), src = [from.cx + (from === WB ? -TBL.w / 2 : TBL.w / 2), from.cy - TBL.h / 2 + 40];
        const pts = E.catmull([[src[0], src[1], 3], [(src[0] + head[0]) / 2, Math.min(src[1], head[1]) - 160, 3], [head[0], head[1], 3]], 10);
        K.trailSpan(ctx, pts, clamp(u * 1.4 - .4), 1, { w: 2.6, a: smooth(span(u, 0, .1)) * (1 - smooth(span(u, .92, 1))) });
      }
      // daylight (7.05): a broad warm wedge falls from above onto both tables
      if (day > 0) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const yb = lerp(-600, 900, day);
        ctx.fillStyle = lin(ctx, 0, -700, 0, yb, [[0, rgba(P.halo1, 0)], [.3, rgba(P.halo1, .07 * day)], [.75, rgba(P.halo0, .15 * day)], [1, rgba(P.halo0, 0)]]);
        for (const f of [0, 70, 150]) {   // three nested wedges: a feathered edge instead of a hard cut-out
          ctx.globalAlpha = f ? .45 : .55; ctx.beginPath(); ctx.moveTo(1500 - f * .4, -700); ctx.lineTo(2100 + f * .4, -700); ctx.lineTo(3200 + f, yb); ctx.lineTo(400 - f, yb); ctx.closePath(); ctx.fill();
        }
        ctx.globalAlpha = 1;
        E.rays(ctx, 1800, -600, 300, lerp(300, 1500, day), 18, .05 * day, .2);
        ctx.restore();
      }
      // 7.06 bars · 7.07 the card · (the axis line becomes the card's rule, the rule becomes the lamp cord in 7.08)
      bars(ctx, t);
      // 7.09: the last YES rises into table A and becomes the cell your own eye skips; two lenses
      lenses(ctx, t);
      // 7.10–7.11: the dashed bridge between the windows, the labels, the gate
      bridge(ctx, t);
      // 7.03: the card over the gap between the labs
      card703(ctx, t);
    });
    // ---------------- 4 · the key in flight and in the other hand (7.02–7.03) ----------------
    if (t >= tLift0 && t < tWith1 + .1 && roomM) {
      const k = keyFlight(c, t, roomM);
      const hb = E.project(c, F0, WB.cx + OA - 40, WB.cy + 10);
      const grip = smooth(span(t, tFly1 - .15, tFly1 + .1));
      const wd = sineIO(span(t, tWith0, tWith1));
      // after the grip, key + hand withdraw into window B (down and away, clipped by the round window)
      const kx = lerp(k.x, hb[0] + 80 * hb[2] * wd, grip), ky = lerp(k.y, hb[1] + 160 * hb[2] * wd, grip), kh = k.h * (1 - .45 * wd);
      ctx.save();
      if (grip > 0 && mF) { ctx.setTransform(mF.k, 0, 0, mF.k, mF.e, mF.f); ctx.clip(portPath({ ...WB, cx: A(WB.cx) }, 0)); ctx.setTransform(1, 0, 0, 1, 0, 0); }
      X.lightKey(ctx, kx, ky, kh, t, { rot: k.rot, turn: 0, lum: 1 - .35 * wd, blue: .6, seed: 31, dust: 900 });
      ctx.restore();
    }
    if (handIn > 0 && mF) {
      const hb = E.project(c, F0, WB.cx + OA - 40, WB.cy + 10);
      const wd = sineIO(span(t, tWith0, tWith1));
      ctx.save(); ctx.setTransform(mF.k, 0, 0, mF.k, mF.e, mF.f); ctx.clip(portPath({ ...WB, cx: A(WB.cx) }, 0)); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const L = 150 * hb[2], reach = handIn;
      const m = E.handMatrix(hb[0] + lerp(260, 70, reach) * hb[2] + 80 * hb[2] * wd, hb[1] + lerp(260, 110, reach) * hb[2] + 160 * hb[2] * wd, -2.3, L * (1 - .3 * wd), -1);
      X.darkHand(ctx, m, { pose: 'hold', curl: lerp(.05, .6, smooth(span(t, tFly1 - .2, tFly1 + .2))), warm: .8 * reach, side: 1 });
      ctx.restore();
    }
  };

  // ------------------------------------------------------------------ the table at window w (morph m 0..1)
  function table(ctx, t, w, m, id) {
    const tilt = sineIO(span(t, ...tTilt)), rowsOut = span(t, ...tRows), dimT = lerp(1, .38, smooth(rowsOut));
    const lit = smooth(span(m, .5, 1));
    // glass: deep indigo, a faint cool light; the frame
    const shape = m >= 1 ? quadPath(w, tilt) : portPath(w, m);
    ctx.save(); ctx.fillStyle = lin(ctx, 0, w.cy - TBL.h / 2, 0, w.cy + TBL.h / 2, [[0, mixHex(P.ind1, P.blue0, .25)], [1, P.night1]]); ctx.fill(shape);
    if (tilt > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, w.cy - TBL.h / 2, 0, w.cy + TBL.h / 2, [[0, rgba(P.halo1, .16 * tilt * dimT)], [1, rgba(P.halo1, .03 * tilt * dimT)]]); ctx.fill(shape); ctx.restore(); }
    ctx.clip(shape);
    // grid: the cross grows into the full grid (centre lines first, then the others)
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .55), .55 * dimT); ctx.lineWidth = 2.2;
    for (let i = 1; i < TBL.rows; i++) { const g = i === 2 ? 1 : lit; if (g <= 0) continue; const v = i / TBL.rows, h = .5 * g; const p0 = quadPt(w, .5 - h, v, tilt), p1 = quadPt(w, .5 + h, v, tilt); ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.stroke(); }
    for (let j = 1; j < TBL.cols; j++) { const g = j === 2 ? 1 : lit; if (g <= 0) continue; const u = j / TBL.cols, h = .5 * g; const p0 = quadPt(w, u, .5 - h, tilt), p1 = quadPt(w, u, .5 + h, tilt); ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.stroke(); }
    // cells: the rival's pen writes a mark into each cell as its thread passes (✓ warm · ✕ cool = uncomfortable)
    const chk = span(t, ...(id === 'A' ? tChkA : tChkB));
    const unc = smooth(span(t, tUnc - .1, tUnc + .6)), weak = (k) => smooth(span(t, tWeak + k * .3, tWeak + k * .3 + .5));
    let n = 0;
    for (let i = 0; i < TBL.rows; i++) for (let j = 0; j < TBL.cols; j++, n++) {
      const [x, y] = cellAt(w, i, j, tilt), u0 = n / 16 * .9, pen = span(chk, u0, u0 + .12);
      const dk = DARK[id].findIndex(([a2, b2]) => a2 === i && b2 === j);
      const fixed = FIXCELL[0] === id && FIXCELL[1] === i && FIXCELL[2] === j ? smooth(span(t, tFix - .05, tFix + .45)) : 0;
      const isYes = id === 'A' && i === YESCELL[0] && j === YESCELL[1] && t > tBubUp[1] - .05;
      if (isYes) { yesCell(ctx, t, x, y); continue; }
      if (dk >= 0) {
        if (unc > 0) { ctx.fillStyle = rgba(P.night0, .55 * unc * (1 - fixed)); ctx.fillRect(x - 70, y - 52, 140, 104); }
        const wk = weak(dk + (id === 'B' ? 2 : 0));
        if (wk > 0 && !fixed) { ctx.save(); ctx.strokeStyle = rgba(mixHex(P.blue1, P.cream, .5), .85 * wk * dimT); ctx.lineWidth = 2.4; ctx.setLineDash([7, 7]); ctx.beginPath(); ctx.arc(x, y, 38 + 8 * (1 - wk), 0, 6.29); ctx.stroke(); ctx.restore(); }
        if (fixed > 0) { E.halo(ctx, x, y, 90, .4 * fixed, P.halo1, P.halo0); check(ctx, x, y, 46, fixed, P.core1, 5); }
        else cross(ctx, x, y, 38, pen, rgba(mixHex(P.blue1, P.cream, .4 + .3 * (1 - unc)), .95 * dimT), 4);
      } else check(ctx, x, y, 44, pen, rgba(mixHex(P.halo0, P.cream, .3), .95 * dimT * (1 - .5 * rowFly(i, id, t))), 4.2);
    }
    ctx.restore();
    // the frame (dark band + rim) follows the shape
    ctx.save(); ctx.lineJoin = 'round';
    ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = 22 * (1 - .6 * lit); ctx.stroke(m >= 1 ? quadPath(w, tilt, 8) : portPath(w, m, 8));
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .4 * lit), .9 * lerp(1, dimT, lit)); ctx.lineWidth = 2.5; ctx.stroke(m >= 1 ? quadPath(w, tilt, 14) : portPath(w, m, 20 - 6 * lit));
    ctx.restore();
    // the title over each table (7.04)
    const tu = rise(span(t, tTitle + (id === 'B' ? .35 : 0), tTitle + 1 + (id === 'B' ? .35 : 0))) * (1 - expoIn(span(t, tRows[0], tRows[0] + .5)));
    if (tu > 0) K.maskLine(ctx, [['SAFETY TESTS', 0]], w.cx, w.cy - TBL.h / 2 - 34 - 10 * tilt, 34, tu, { serif: false, align: 'center', col: rgba(P.halo2, .9), glow: false });
  }
  function quadPath(w, tilt, grow = 0) {
    const g = grow / (TBL.w / 2), q = (u, v) => { const [x, y] = quadPt(w, u, v, tilt); return [w.cx + (x - w.cx) * (1 + g), w.cy + (y - w.cy) * (1 + grow / (TBL.h / 2))]; };
    const p = new Path2D(); const pts = [q(0, 0), q(1, 0), q(1, 1), q(0, 1)];
    p.moveTo(...pts[0]); for (const v of pts.slice(1)) p.lineTo(...v); p.closePath(); return p;
  }
  function threadHead(w, u, tilt) {   // the pen goes cell by cell, row by row
    const n = Math.min(15.999, u / .9 * 16), i = Math.floor(n / 4), j = Math.floor(n % 4), f = n - Math.floor(n);
    const p = cellAt(w, i, j, tilt), q = j < 3 ? cellAt(w, i, j + 1, tilt) : cellAt(w, Math.min(3, i + 1), 0, tilt);
    return [lerp(p[0], q[0], smooth(f)), lerp(p[1], q[1], smooth(f))];
  }
  // a row of the table flies out to the bar stack (7.06): 0 = in the table, 1 = in the stack
  function rowFly(i, id, t) { return sineIO(span(t, tRows[0] + (id === 'A' ? 0 : .12) + i * .14, tRows[0] + 1.5 + (id === 'A' ? 0 : .12) + i * .14)); }

  // ------------------------------------------------------------------ 7.06 bars · 7.07 sycophancy card
  function bars(ctx, t) {
    if (t < tRows[0] || t > tSink[1] + .6) return;
    const axisU = sineIO(span(t, ...tAxis)), ret = (r) => sineIO(span(t, tRet[0] + r * .07, tRet[0] + .7 + r * .07));
    // the rule: the stack's axis (bars grow from it) → the card's rule (7.07) → it travels down and becomes the lamp cord (7.08)
    const cord = span(t, ...tCord), top0 = BY0 - 40, bot0 = BY0 + 7 * BP + 40;
    const ruleTop = lerp(top0, 700, sineIO(clamp(cord * 1.15 - .15))), ruleBot = lerp(bot0, 760, sineIO(clamp(cord * 1.3)));
    if (axisU > 0) {
      const yA = lerp((top0 + bot0) / 2, top0, axisU), yB = lerp((top0 + bot0) / 2, bot0, axisU);
      K.trailSpan(ctx, [[AX, cord > 0 ? ruleTop : yA], [AX, cord > 0 ? ruleBot : yB]], 0, 1, { w: 2.4, spark: false });
    }
    // the rows: they leave the tables (cells condense into one rod each) and line up in the stack
    for (const id of ['A', 'B']) for (let i = 0; i < 4; i++) {
      const f = rowFly(i, id, t); if (f <= 0) continue;
      const r = id === 'A' ? i * 2 : i * 2 + 1, w = id === 'A' ? WA : WB;
      const re = ret(r); if (re >= 1) continue;
      const [cx0, cy0] = cellAt(w, i, 1.5, 1);
      const x0 = lerp(cx0 - TBL.w / 2 + 20, AX, f), x1 = lerp(cx0 + TBL.w / 2 - 20, AX + BW, f), y = lerp(cy0, BY0 + r * BP, f), hh = lerp(70, 6, f);
      // the track (cool), then the bar of light growing toward YES
      ctx.save(); ctx.fillStyle = rgba(mixHex(P.blue0, P.cream, .25), .35 * (1 - re)); ctx.beginPath(); ctx.roundRect(x0, y - hh / 2, (x1 - x0) * (1 - re), hh, hh / 2); ctx.fill(); ctx.restore();
      const g = sineIO(span(t, tGrow + r * .14, tGrow + 1.3 + r * .14)) * BAR_LEN[r] * (1 - re);
      if (g > 0) {
        const glow = 1 + .5 * smooth(span(t, tOften, tOften + .5)) * (1 - smooth(span(t, tOften + 1.2, tOften + 2.4))) * (BAR_LEN[r] > .7 ? 1 : 0);
        const bp = new Path2D(); bp.roundRect(AX, y - 9, BW * g, 18, 9);
        E.glowFill(ctx, bp, 14, .35 * glow, P.halo1);
        ctx.fillStyle = lin(ctx, AX, 0, AX + BW, 0, [[0, P.halo1], [.7, P.halo0], [1, P.core1]]); ctx.fill(bp);
      }
    }
    // labels: caption above, YES at the end, the flag that nobody raises
    const out = 1 - expoIn(span(t, tRet[0], tRet[0] + .45));
    const cu = rise(span(t, tAxis[0] + .2, tAxis[0] + 1.1)) * out;
    if (cu > 0) K.maskLine(ctx, [['AGREES WITH THE USER', 0]], AX + 4, top0 - 26, 34, cu, { serif: false, col: rgba(P.cream, .85), glow: false });
    const yu = rise(span(t, tGrow + .6, tGrow + 1.5)) * out;
    if (yu > 0) K.maskLine(ctx, [['YES', 1]], AX + BW + 30, BY0 + 3.5 * BP + 20, 56, yu, { serif: false, glow: false });
    const fu = expoOut(span(t, tFlag - .05, tFlag + .5)) * out;
    if (fu > 0) {   // a small cool flag rises at the end of the short bar (the warning that went unheeded)
      const fx = AX + BW * BAR_LEN[4] + 34, fy = BY0 + 4 * BP + 10, ph = 74 * fu;
      ctx.save(); ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - ph); ctx.stroke();
      const wv = Math.sin(t * 3) * 3; ctx.fillStyle = mixHex(P.blue1, P.cream, .35); ctx.beginPath(); ctx.moveTo(fx, fy - ph); ctx.quadraticCurveTo(fx + 22, fy - ph + 4 + wv, fx + 44, fy - ph + 12); ctx.quadraticCurveTo(fx + 22, fy - ph + 18 + wv, fx, fy - ph + 26); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    // 7.07: the word, the line under it
    const sink = (i) => 1 - expoIn(span(t, tSink[0] + i * .08, tSink[1] + i * .08));
    const su = rise(span(t, tSyc - .1, tSyc + .9)) * sink(0);
    if (su > 0) K.maskLine(ctx, [['Sycophancy.', 0]], AX + 44, 500, 150, su);
    const bu = rise(span(t, tSub - .1, tSub + .8)) * sink(1), cool = smooth(span(t, tNot - .05, tNot + .5));
    if (bu > 0) {
      const r1 = K.maskLine(ctx, [["TELLING YOU YOU'RE ", 0]], AX + 48, 590, 40, bu, { serif: false, col: rgba(P.halo2, .95), glow: false });
      K.maskLine(ctx, [['RIGHT', 0]], AX + 48 + r1.w, 590, 40, bu, { serif: false, col: mixHex(P.halo0, mixHex(P.blue1, P.cream, .45), cool), glow: false });
    }
  }

  // ------------------------------------------------------------------ 7.08 the desk, the lamp, the YES bubbles
  function desk(ctx, t, l, head) {
    const x = DESK.x;
    // the lamp's pool reveals the desk and the floor
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, x + 120, DESK.top, 330, [[0, rgba(P.halo1, .3 * l)], [.5, rgba(P.halo1, .1 * l)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.ellipse(x + 120, DESK.top + 6, 330, 70, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, 800, 0, DESK.top, [[0, rgba(P.halo1, 0)], [1, rgba(P.halo1, .1 * l)]]); ctx.beginPath(); ctx.moveTo(x + 98, 812); ctx.lineTo(x + 142, 812); ctx.lineTo(x + 330, DESK.top); ctx.lineTo(x - 90, DESK.top); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.globalAlpha = clamp(l * 1.2);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(x + 40, DESK.top, 200, 8);   // desk top
    ctx.fillStyle = rgba(P.halo1, .7 * l); ctx.fillRect(x + 40, DESK.top, 200, 2);
    ctx.fillStyle = P.night1; ctx.fillRect(x + 52, DESK.top + 8, 7, GROUND - DESK.top - 8); ctx.fillRect(x + 222, DESK.top + 8, 7, GROUND - DESK.top - 8);
    // the screen: a small monitor facing you, cool light on its face
    const sx = x + 150, sy = DESK.top - 58;
    ctx.fillStyle = P.night0; ctx.fillRect(sx - 4, sy - 4, 72, 52); ctx.fillRect(sx + 30, sy + 46, 6, 12);
    ctx.fillStyle = lin(ctx, sx, sy, sx + 64, sy + 44, [[0, mixHex(P.blue1, P.cream, .45)], [1, mixHex(P.blue0, P.ind1, .3)]]); ctx.fillRect(sx, sy, 64, 44);
    ctx.restore();
    E.halo(ctx, sx + 32, sy + 22, 120, .12 * l, P.blue0, P.blue1);
    // the bubbles: each YES rises from the screen and hangs over you; the last one later leaves for the table (7.09)
    for (let i = 0; i < 3; i++) {
      const u = expoOut(span(t, tBub[i] - .05, tBub[i] + 1.1)); if (u <= 0) continue;
      if (i === 2 && t > tBubUp[0]) continue;   // drawn by lenses() while it travels
      const back = i < 2 ? 1 - sineIO(span(t, tBubUp[0] + .5 + i * .15, tBubUp[0] + 1.4 + i * .15)) : 1;   // the first two sink back into the screen
      if (back <= 0) continue;
      const [bx, by] = bubblePos(i, u * back, t);
      bubble(ctx, bx, by, u * back, smooth(span(t, tPleasant - .1, tPleasant + .6)) * (1 - .6 * head));
    }
  }
  function bubblePos(i, u, t) { const x = DESK.x + 150 + 32, y = DESK.top - 70; return [lerp(x, [DESK.x - 30, DESK.x + 95, DESK.x + 230][i], u) + drift(t, 3, i * 3), lerp(y, [740, 690, 735][i], u) + drift(t, 3, i * 3 + 1)]; }
  function bubble(ctx, x, y, u, warm, s = 1) {
    const w = 96 * s, h = 52 * s, k = clamp(u * 1.2);
    ctx.save(); ctx.translate(x, y); ctx.scale(lerp(.3, 1, k), lerp(.3, 1, k));
    const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, h / 2); p.moveTo(-8 * s, h / 2 - 2); p.lineTo(4 * s, h / 2 + 14 * s); p.lineTo(10 * s, h / 2 - 2);
    E.glowFill(ctx, p, 16 * s, .35, mixHex(P.blue0, P.halo1, clamp(warm)));
    ctx.fillStyle = mixHex(mixHex(P.blue1, P.cream, .55), P.halo0, warm); ctx.fill(p);
    ctx.font = `600 ${28 * s}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.night0; ctx.fillText('YES', 0, 1);
    ctx.restore();
  }
  function lamp(ctx, t, l) {
    const x = DESK.x + 120, y = 812, sw = Math.sin(t * .8) * 1.5;
    ctx.save(); ctx.translate(x, y); ctx.rotate(sw * .004);
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(-22 * clamp(l * 3), 0); ctx.lineTo(22 * clamp(l * 3), 0); ctx.lineTo(10, -26); ctx.lineTo(-10, -26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.core1, l); ctx.beginPath(); ctx.ellipse(0, 1, 20 * clamp(l * 3), 4, 0, 0, 6.29); ctx.fill();
    ctx.restore();
    E.halo(ctx, x, y + 4, 90, .45 * l, P.halo1, P.core0);
  }
  // the YES that becomes a cell of table A (7.09)
  function yesCell(ctx, t, x, y) {
    const found = smooth(span(t, tRiv[1] - .1, tRiv[1] + .4));
    ctx.save(); ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .5), .9); ctx.beginPath(); ctx.roundRect(x - 40, y - 20, 80, 40, 20); ctx.fill();
    ctx.font = '600 22px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.night0; ctx.fillText('YES', x, y + 1); ctx.restore();
    if (found > 0) { E.halo(ctx, x, y, 110, .35 * found, P.halo1, P.halo0); ctx.save(); ctx.strokeStyle = rgba(P.core1, found); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 52, y - 32, 104, 64, 30); ctx.stroke(); ctx.restore(); }
  }

  // ------------------------------------------------------------------ 7.09 the bubble rises into table A, the two lenses
  function lenses(ctx, t) {
    // the third YES travels up from the desk into table A's cell
    const up = span(t, ...tBubUp);
    if (up > 0 && up < 1) {
      const [x0, y0] = bubblePos(2, 1, t), [x1, y1] = cellAt(WA, YESCELL[0], YESCELL[1], 1), f = sineIO(up);
      bubble(ctx, lerp(x0, x1, f) - Math.sin(f * Math.PI) * 90, lerp(y0, y1, f), 1, .4 * (1 - f), lerp(1, .82, f));
    }
    const [cx, cy] = cellAt(WA, YESCELL[0], YESCELL[1], 1);
    const lens = (x, y, r, warm, a) => {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = rgba(warm ? P.halo1 : P.blue1, .12); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
      E.glowFill(ctx, (() => { const p = new Path2D(); p.arc(x, y, r, 0, 6.29); return p; })(), 10, .5 * a, warm ? P.halo1 : P.blue0);
      ctx.globalAlpha = a; ctx.strokeStyle = warm ? P.halo0 : mixHex(P.blue1, P.cream, .6); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.stroke(); ctx.restore();
    };
    // own lens (warm): glides along the row from the left, over the YES without stopping, and on
    const o = span(t, ...tOwn), back = span(t, ...tBack);
    const toWin = (p, w, f) => [lerp(p[0], w.cx, f), lerp(p[1], w.cy, f)];
    if (o > 0 && back < 1) {
      const row = cellAt(WA, YESCELL[0], 0, 1), x = lerp(WA.cx - TBL.w / 2 - 80, WA.cx + TBL.w / 2 + 40, sineIO(o)), p = [x, row[1]];
      const f = sineIO(back), q = toWin(p, WA, f);
      lens(q[0], q[1], lerp(70, WA.r + 20, f), true, (1 - smooth(span(back, .6, 1))) * smooth(span(o, 0, .15)));
    }
    // the rival's lens (cool): comes from the right, stops on the YES (found)
    const r = span(t, ...tRiv);
    if (r > 0 && back < 1) {
      const sx = WA.cx + TBL.w / 2 + 340, x = lerp(sx, cx, expoOut(r)), y = lerp(cy - 120, cy, expoOut(r));
      const f = sineIO(back), q = [lerp(x, WB.cx, f), lerp(y, WB.cy, f)];
      lens(q[0], q[1], lerp(70, WB.r + 20, f), false, (1 - smooth(span(back, .6, 1))) * smooth(span(r, 0, .2)));
    }
  }

  // ------------------------------------------------------------------ 7.03 the card: AUGUST 2025 / OpenAI ⇄ Anthropic
  function card703(ctx, t) {
    const tOut = [a.tested + .15, a.tested + 1.1];   // the card sinks into its rule before the push to the tables, the rule retracts upward
    if (t < a.august - .4 || t > tOut[1] + .5) return;
    const S = 116, x0 = 1290, yK = -262, yT = -122;
    const out = sineIO(span(t, tOut[0] + .35, tOut[1] + .4));
    const ru = sineIO(span(t, a.august - .35, a.august + .5)) * (1 - out);
    K.trailSpan(ctx, [[x0 - 34, yK - 60], [x0 - 34, yT + 34]], 0, ru, { w: 2.6, spark: false });
    const sink = 1 - expoIn(span(t, ...tOut));
    const k = rise(span(t, a.august - .05, a.august + .85)) * sink;
    if (k > 0) K.maskLine(ctx, [['AUGUST 2025', 0]], x0, yK, 46, k, { serif: false, col: P.halo2, glow: false });
    const u1 = rise(span(t, a.openai - .05, a.openai + .9)) * sink;
    if (u1 <= 0) return;
    const r1 = K.maskLine(ctx, [['OpenAI', 0]], x0, yT, S, u1);
    const ax = x0 + r1.w + 30, aw = 120, au = sineIO(span(t, a.openai + .5, a.anthropic - .05));
    if (au > 0) {   // ⇄ drawn as two arrows of light: each tests the other
      ctx.save(); ctx.strokeStyle = P.halo0; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const y1 = yT - 52, y2 = yT - 22;
      ctx.beginPath(); ctx.moveTo(ax, y1); ctx.lineTo(ax + aw * au, y1); if (au > .8) { ctx.moveTo(ax + aw - 16, y1 - 13); ctx.lineTo(ax + aw, y1); } ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax + aw, y2); ctx.lineTo(ax + aw - aw * au, y2); if (au > .8) { ctx.moveTo(ax + 16, y2 + 13); ctx.lineTo(ax, y2); } ctx.stroke();
      ctx.restore();
    }
    const u2 = rise(span(t, a.anthropic - .05, a.anthropic + .9)) * sink;
    if (u2 > 0) K.maskLine(ctx, [['Anthropic', 0]], ax + aw + 30, yT, S, u2);
  }

  // ------------------------------------------------------------------ 7.10–7.11 the bridge, the labels, the gate
  function bridge(ctx, t) {
    const b = span(t, ...tBridge); if (b <= 0) return;
    const x0 = WA.cx + WA.r + 24, x1 = WB.cx - WB.r - 24, y = WA.cy, g = sineIO(b), gx = (x0 + x1) / 2;
    const gate = sineIO(span(t, ...tGate)), open = expoOut(span(t, ...tOpen)) * (1 - expoIn(span(t, ...tShut)));
    const run = span(t, a.anyone - .1, a.anyone + 1.2);
    ctx.save(); ctx.lineCap = 'round';
    const dash = 26, gap = 18, n = Math.floor((x1 - x0) / (dash + gap));
    for (let i = 0; i < n; i++) {
      const xa = x0 + i * (dash + gap); if (xa > lerp(x0, x1, g)) break;
      if (gate > 0 && Math.abs(xa + dash / 2 - gx) < 60) continue;   // the gate's gap
      const fl = .55 + .45 * Math.sin(t * 7.3 + i * 2.1) * Math.sin(t * 3.1 + i);   // it flickers (fragile)
      const solid = smooth(span(run, i / n * .6, i / n * .6 + .4));                   // 7.11: the line becomes solid as it runs on
      ctx.strokeStyle = rgba(P.halo0, lerp(.35 + .45 * fl, 1, solid)); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(Math.min(xa + dash + gap * solid, lerp(x0, x1, g)), y); ctx.stroke();
    }
    if (gate > 0) {   // two posts and a bar that opens only briefly
      ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 3;
      ctx.lineWidth = 5;
      for (const sx of [-60, 60]) { ctx.beginPath(); ctx.moveTo(gx + sx, y + 44); ctx.lineTo(gx + sx, y + 44 - 120 * gate); ctx.stroke(); }
      const ang = -1.35 * open, L = 120 * gate;
      ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(gx - 60, y); ctx.lineTo(gx - 60 + Math.cos(ang) * L, y + Math.sin(ang) * L); ctx.stroke();
      if (open > 0) E.halo(ctx, gx, y, 180, .35 * open, P.halo1, P.halo0);
    }
    ctx.restore();
    const out = (i) => 1 - expoIn(span(t, tLblOut + i * .1, tLblOut + .5 + i * .1));
    ['VOLUNTARY', 'A PILOT', 'NO SHARED METHOD'].forEach((s, i) => {
      const u = rise(span(t, tLbl[i] - .05, tLbl[i] + .8)) * out(i);
      if (u > 0) K.maskLine(ctx, [[s, 0]], gx, y + 130 + i * 92, 58, u, { serif: false, align: 'center', col: rgba(P.halo2, .95), glow: false });
    });
  }
}

// the transform of the room card at the end of the push (constant): the room is designed for that view
let _RM = null;
export function ROOM_M(a) { if (!_RM) _RM = cardM(E.aim(F0, WA.cx + OA, WA.cy, PUSH_S), ZR); return _RM; }
export const PUSH_S = 1.42;
