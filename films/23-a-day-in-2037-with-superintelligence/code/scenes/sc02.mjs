// c02 · Lead · 31.34 – 80.72 s · 06:15 · the spot against every scan · no bill · the kettle · the argument next door (docs/shots.md 2.01–2.06).
// ONE continuous take, picking up c01's last frame (the city map, the clinic's gold lines in every window):
//   2.01 'You open the scan': the lines sink into their windows; the camera follows the line into YOUR window and lands on the light
//        wall (the scan). 'There it is' the spot pulses; 'grain of rice' a gold grain slides in on an arc beside it.
//   2.02 ★ the scan shrinks to a tile; 'more scans' a sky of tiny cool tiles grows round it; 'every doctor' a small warm stack on the
//        left; 'Last night' the moon crosses the wall; 'held yours up' your tile lifts; 'all of them' it sweeps row after row.
//        Carrier: the tiles sink to stars; pull back into the kitchen.
//   2.03 first light: 'racing' a heartbeat line along the table edge; "It isn't" it calms, your shoulders drop; 'good news' the phone
//        turns from cool to warm; 'short procedure' the line becomes a gold timeline (start mark, three quiet days, the end on 'over').
//   2.04 'No bill' a bill card rises from the phone and folds back; 'No upgrade offer' a lock card does the same; 'Everyone in your city'
//        pull back to the city, the clinic rings every window (a wave left → right); 'Somebody decided' a hand-drawn gold rule under
//        the city. Carrier: the ring of YOUR window flies back in and settles round the kettle.
//   2.05 'kettle' you switch it on; 'whole illness' you stand still, a hand on the counter, slow push; 'making tea' you pour.
//   2.06 'next room' truck right into the kid's room: she argues with the voice-light, 'losing' she flops back on the bed; 'genius'
//        push into the voice-light → plateGenius (T0 − .5 … T0).
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f23_kit.mjs';
import { plateGenius, seamT, SEAM_HALF, GENIUS_PLATE } from '../lib/f23_seams.mjs';
const { W, H, P, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, rgba, mixHex, camAt, camDrift, halo, rad } = E;
const { ZS, ZB, KITCHEN, LIGHTWALL, look, wp, atZ, COOL, WARM } = K;
const bump = K.bump;

export default (T, R) => {
  const G = (p, after = -1) => T.G(p, 0, after);
  const t0 = R.a, T0 = seamT(T, 'genius');
  const tThere = G('There it is', t0), tGrain = G('grain of rice', t0), tMind = G('The mind that found', t0), tMore = G('more scans', t0);
  const tEvery = G('every doctor', t0), tLast = G('Last night', t0), tHeld = G('held yours up', t0), tAll = G('all of them', t0);
  const tHeart = G('Your heart', t0), tRacing = G('racing', t0), tIsnt = G("It isn't", t0), tGood = G('good news', t0);
  const tShort = G('short procedure', t0), tFew = G('few', tShort), tQuiet = G('quiet', tShort), tDays = G('days', tShort), tOverW = G('over', tShort);
  const tBill = G('No bill', t0), tUpg = G('No upgrade offer', t0), tEvery2 = G('Everyone in your city', t0), tSome = G('Somebody decided', t0);
  const tKettle = G('kettle', t0), tWhole = G('whole illness', t0), tTea = G('making tea', t0), tNext = G('next room', t0);
  const tLosing = G('losing an argument', t0), tArg = G('argument', tLosing), tGenius = G('genius', t0);
  const tP = T0 - SEAM_HALF;   // the plate takes over

  // ---------------------------------------------------------------- places
  const LW = LIGHTWALL, KY = KITCHEN.floor, TB = KITCHEN.table;
  const SB = { x: LW.x - LW.w * .04, y: LW.y - LW.h * .06, w: LW.w * 1.08, h: LW.h * 1.12 };          // the scan's box on the wall (as kitchen() draws it)
  const FG = { x0: LW.x + 86, y0: LW.y + 10, px: 12, py: 10, tw: 9, th: 7, cols: 35, rows: 38 };     // the field of scans
  const MY = { c: 16, r: 17 };                                                                          // your tile: a 3 × 3 slot
  const TILE = { x: FG.x0 + MY.c * FG.px, y: FG.y0 + MY.r * FG.py, w: 3 * FG.px - 3, h: 3 * FG.py - 3 };
  const YOU0 = KITCHEN.you[0], YOU1 = -1882, YZ = KITCHEN.you[2];                                        // you walk to the counter while we are out
  const KET = [-1928, KITCHEN.counter.top, ZB - 103], CUP = [-1966, KITCHEN.counter.top, ZB - 103];      // the kettle comes to the counter's front edge
  const VL = [-380, KY - 125, ZB - 110], VLR = 12;                                                       // over her desk (the plate frame: back wall only)                                                       // the voice-light in the kid's room

  // ---------------------------------------------------------------- the camera (keys on words; ref = the back wall)
  const CITY_IN = look(-1120, -1965, ZS, .198);
  const SCAN = look(LW.cx, LW.cy, ZB, 2.25), SCAN_IN = look(LW.cx + 30, LW.cy, ZB, 2.33);
  const FIELD = look(LW.cx, LW.cy, ZB, 2.1), FIELD_IN = look(LW.cx, LW.cy + 4, ZB, 2.16);
  const KIT = look(-1480, KY - 235, ZB, 1.75, 960, 560), KIT_IN = look(-1474, KY - 238, ZB, 1.82, 960, 560);
  const CITY2 = look(-1150, -1950, ZS, .19), CITY2_IN = look(-1160, -1945, ZS, .194);
  const KETTLE = look(-1885, KY - 78, ZB - 110, 3.0, 960, 600), KETTLE_IN = look(-1895, KY - 80, ZB - 110, 3.1, 960, 610);
  const KID = look(-650, KY - 80, ZB - 100, 2.2, 960, 640), KID_IN = look(-640, KY - 85, ZB - 100, 2.3, 960, 640);
  const CAM_G = look(VL[0], VL[1], VL[2], GENIUS_PLATE.r / VLR, GENIUS_PLATE.x, GENIUS_PLATE.y);
  const KEYS = [
    [t0, CITY_IN], [t0 + .3, CITY_IN],
    [tGrain - .1, SCAN, 'l'],                // 2.01: follow your line in (4.2 s; the other lines have sunk first)
    [tMind, SCAN_IN],
    [tMore + .7, FIELD],                     // 2.02: a step back as the field grows
    [tAll + .7, FIELD_IN],
    [tRacing + .9, KIT, 'l'],                // carrier: back into the kitchen (3.4 s)
    [tEvery2 - .1, KIT_IN],
    [tSome + .55, CITY2, 'l'],               // 2.04: out to the city (4.1 s)
    [tSome + 1.45, CITY2_IN],
    [tWhole + .05, KETTLE, 'l'],             // the ring flies back in to the kettle (3.4 s)
    [tNext - .2, KETTLE_IN],
    [tArg + .1, KID, 'l'],                   // 2.06: truck right into the kid's room (2.8 s)
    [tGenius - .05, KID_IN],
    [tP, CAM_G, 'l'],                        // push into the voice-light, landing on the plate
  ];
  const camOf = (t) => {
    const c = camAt(t, KEYS, ZB), dz = ZB - c.z;
    const amt = .5 * clamp(dz / 870, .04, 1) * (1 - span(t, tGenius, tP - .3));   // the drift scales with distance; none on the plate
    return camDrift(c, t, amt, 3);
  };

  // ---------------------------------------------------------------- c01's fan (picked up as it ended) and the rings of 2.04
  const all = K.cityWindows(), CW = K.CLINIC_WIN;
  const targets = all.filter((w) => w.q < .3 || w.room || (w.r > .965 && w.Z === ZS));
  const payer = (w) => !w.room && w.r > .965 && w.Z < 6000;
  const dist = (w) => clamp(Math.hypot(w.X - CW[0], (w.Z - ZS) * 1.6) / 14000);
  const yours = all.find((w) => w.yours);
  const lineTail = (w, t) => w.yours ? sineIO(span(t, t0 + .4, tThere + .3)) : expoIn(span(t, t0 + .02 + dist(w) * .3, t0 + .5 + dist(w) * .3));
  const ringAt = (w) => tEvery2 + .3 + clamp((w.X + 6000) / 14000) * 2.2 + (w.Z - ZS) / 40000;   // the wave left → right (back rows a touch later)
  const winFn = (t) => (w) => {
    const lit = w.r < .16 ? 1 : 0;
    const cool = w.q < .42 && w.r > .16 && !w.room ? 1 : 0;
    let gold = 0;
    if (t < tMind && (w.q < .3 || payer(w) || w.room)) gold = 1;                       // c01's care, still glowing (unseen once we are in)
    if (t > tEvery2 && targets.includes(w)) gold = Math.max(gold, .7 * expoOut(span(t, ringAt(w), ringAt(w) + .4)));
    return { lit, gold, cool };
  };

  // ---------------------------------------------------------------- the wall: the scan, the grain, the field of scans
  const scanState = (t) => ({ a: 1, draw: 1, ring: 1, spot: 1, tight: 1, small: 1, timeline: 1 - span(t, t0 + .2, t0 + 1.2) });
  const scanBox = (t) => { const u = sineIO(span(t, tMind + .1, tMind + 1.4)), lift = 1 + .3 * smooth(span(t, tHeld, tHeld + .5)) * (1 - smooth(span(t, tAll + 1.4, tAll + 2))); const w = lerp(SB.w, TILE.w, u) * lift, h = lerp(SB.h, TILE.h, u) * lift, cx = lerp(SB.x + SB.w / 2, TILE.x + TILE.w / 2, u), cy = lerp(SB.y + SB.h / 2, TILE.y + TILE.h / 2, u); return { x: cx - w / 2, y: cy - h / 2, w, h, u }; };
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const wallFn = (t) => (ctx) => {
    const B = scanBox(t), field = t >= tMind + .1;
    if (field) { ctx.save(); ctx.beginPath(); ctx.rect(LW.x, LW.y, LW.w, LW.h); ctx.clip(); }
    // ---- the field (2.02): tiles grow out from yours, then sink to stars (2.02 carrier), then go out at first light (2.03)
    if (t > tMore) {
      const night = .45 * bump(t, tLast + .3, 2.6), sweepRow = Math.floor((t - (tAll + .05)) / .032), star = (i) => smooth(span(t, tAll + 1.25 + rnd(i) * .7, tAll + 1.75 + rnd(i) * .7));
      for (let r = 0; r < FG.rows; r++) for (let c = 0; c < FG.cols; c++) {
        if (c >= MY.c && c < MY.c + 3 && r >= MY.r && r < MY.r + 3) continue;
        const i = r * FG.cols + c, d = Math.hypot(c - MY.c - 1, (r - MY.r - 1) * 1.2), ap = expoOut(span(t, tMore + .1 + d * .036, tMore + .35 + d * .036));
        if (ap <= 0) continue;
        const st = star(i), out = span(t, tHeart + 2 + rnd(i + 7) * 9, tHeart + 2.4 + rnd(i + 7) * 9);   // stars go out one by one at first light
        if (out >= 1) continue;
        const k = ap * (1 - out), w = lerp(FG.tw, 2.2, st) * k, h = lerp(FG.th, 2.2, st) * k, x = FG.x0 + c * FG.px + FG.tw / 2, y = FG.y0 + r * FG.py + FG.th / 2;
        let col = mixHex(mixHex(COOL.deep, COOL.mid, .25 + .6 * rnd(i)), P.night1, night);
        if (sweepRow === r && st < .5) col = P.core1; else if (sweepRow > r && t < tAll + 1.6) col = mixHex(col, P.halo0, .22);
        if (st > 0) col = mixHex(col, COOL.core, st);
        ctx.fillStyle = col; ctx.fillRect(x - w / 2, y - h / 2, w, h);
        if (st < .3) { ctx.fillStyle = rgba(P.ind1, .55 * (1 - st / .3)); ctx.fillRect(x - w * .3, y - h * .2, w * .25, h * .55); ctx.fillRect(x + w * .05, y - h * .2, w * .25, h * .55); }   // two tiny lungs
      }
      if (sweepRow >= 0 && sweepRow < FG.rows && t < tAll + 1.4) { const y = FG.y0 + sweepRow * FG.py + FG.th + 1.5; ctx.fillStyle = rgba(P.core1, .9); ctx.fillRect(FG.x0 - 4, y, FG.cols * FG.px + 4, 1.6); }
      // the moon crossing the wall ('Last night'): a disc along a shallow arc, right → left
      const mu = sineIO(span(t, tLast + .1, tLast + 2.9));
      if (mu > 0 && mu < 1) { const mx = lerp(LW.x + LW.w - 26, LW.x + 30, mu), my = LW.y + 46 - 26 * Math.sin(Math.PI * mu); ctx.fillStyle = rad(ctx, mx, my, 40, [[0, rgba(COOL.core, .35)], [1, rgba(COOL.mid, 0)]]); ctx.fillRect(mx - 40, my - 40, 80, 80); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(mx, my, 13, 0, 6.29); ctx.fill(); ctx.fillStyle = mixHex(P.cream, COOL.mid, .5); ctx.beginPath(); ctx.arc(mx + 4, my - 2, 11, 0, 6.29); ctx.fill(); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(mx - 2, my + 1, 11, 0, 6.29); ctx.fill(); }
    }
    // ---- the warm stack (every doctor in history): 5 columns rising from the floor of the wall, left
    if (t > tEvery) {
      const n = 12, gone = (j) => span(t, tAll + 1.3 + rnd(j + 99) * .6, tAll + 1.8 + rnd(j + 99) * .6), out = (j) => span(t, tHeart + 3 + rnd(j + 50) * 8, tHeart + 3.4 + rnd(j + 50) * 8);
      for (let r = 0; r < n; r++) for (let c = 0; c < 5; c++) {
        const j = r * 5 + c, ap = expoOut(span(t, tEvery + .1 + r * .07, tEvery + .3 + r * .07)); if (ap <= 0 || out(j) >= 1) continue;
        const st = smooth(gone(j)), k = ap * (1 - out(j)), w = lerp(FG.tw, 2.2, st) * k, h = lerp(FG.th, 2.2, st) * k;
        const x = LW.x + 14 + c * FG.px + FG.tw / 2, y = LW.y + LW.h - 12 - r * FG.py - FG.th / 2 + 6 * (1 - ap);
        ctx.fillStyle = mixHex(mixHex(WARM.deep, WARM.hi, .3 + .5 * rnd(j)), COOL.core, st * .6); ctx.fillRect(x - w / 2, y - h / 2, w, h);
      }
    }
    // ---- the scan (full → your tile); the grain rides with it
    const st = { ...scanState(t) };
    if (field) {
      K.scanArt(ctx, B.x, B.y, B.w, B.h, t, st);
      const lifted = smooth(span(t, tHeld, tHeld + .5)) * (1 - smooth(span(t, tAll + 1.4, tAll + 2)));
      const mark = span(t, tMind + 1.2, tMind + 1.6) * (1 - span(t, tAll + 1.6, tAll + 2));
      if (mark > 0 && lifted < 1) { ctx.strokeStyle = rgba(P.halo0, .6 * mark * (1 - lifted)); ctx.lineWidth = 1; ctx.strokeRect(B.x - 1.5, B.y - 1.5, B.w + 3, B.h + 3); }
      if (lifted > 0) { ctx.strokeStyle = rgba(P.core1, .95 * lifted); ctx.lineWidth = 1.6; ctx.strokeRect(B.x - 2, B.y - 2, B.w + 4, B.h + 4); }
    }
    // 'There it is': the spot breathes once, big
    const [su, sv] = K.SCAN_SPOT, sx = B.x + su * B.w, sy = B.y + sv * B.h, k = B.w / SB.w;
    const pulse = bump(t, tThere - .05, .9);
    if (pulse > 0) halo(ctx, sx, sy, (18 + 40 * pulse) * k, .9 * pulse);
    // 'grain of rice': a gold grain slides in on an arc and settles beside the spot (box coordinates: it shrinks with the tile)
    const gu = expoOut(span(t, tGrain, tGrain + .75));
    if (gu > 0) {
      const ax = B.x + .97 * B.w, ay = B.y + .16 * B.h, bx = B.x + .745 * B.w, by = B.y + .505 * B.h, mx = (ax + bx) / 2 + .05 * B.w, my = Math.min(ay, by) - .05 * B.h;
      const v = gu, x = (1 - v) ** 2 * ax + 2 * (1 - v) * v * mx + v * v * bx, y = (1 - v) ** 2 * ay + 2 * (1 - v) * v * my + v * v * by, rot = -.5 * (1 - v) + .25 + .06 * bump(t, tGrain + .55, .5);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = rad(ctx, 0, 0, 22 * k, [[0, rgba(P.halo0, .4)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(-22 * k, -22 * k, 44 * k, 44 * k);
      ctx.fillStyle = lin3(ctx, k); ctx.beginPath(); ctx.ellipse(0, 0, 12.5 * k, 4.6 * k, 0, 0, 6.29); ctx.fill();
      ctx.restore();
    }
    if (field) ctx.restore();
  };
  const lin3 = (ctx, k) => E.lin(ctx, 0, -5 * k, 0, 5 * k, [[0, P.core0], [.6, P.core1], [1, P.halo0]]);

  // ---------------------------------------------------------------- the heartbeat → the timeline (2.03), on the table's front edge
  const beat = (ph) => { ph = ((ph % 1) + 1) % 1; return ph < .05 ? -Math.sin(Math.PI * ph / .05) * .35 : ph < .1 ? Math.sin(Math.PI * (ph - .05) / .05) * 1 : ph < .16 ? -Math.sin(Math.PI * (ph - .1) / .06) * .4 : 0; };
  const heartItem = (t) => [TB.z0 - 2, (ctx) => {
    const draw = expoOut(span(t, tHeart + .5, tRacing + .2)); if (draw <= 0) return;
    const calm = smooth(span(t, tIsnt, tIsnt + 1.6)), flat = smooth(span(t, tShort - .1, tShort + .7)), gold = smooth(span(t, tShort, tShort + .9));
    const x0 = TB.x0 + 12, x1 = TB.x1 - 12, y0 = TB.top - 3, A = 18 * (1 - .55 * calm) * (1 - flat);
    const nb = lerp(7, 2.6, calm), rate = lerp(2.6, .9, calm), N = 140;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pts = [];
    for (let i = 0; i <= N * draw; i++) { const v = i / N; pts.push([lerp(x0, x1, v), y0 + A * beat(v * nb - t * rate)]); }
    const col = mixHex(P.cream, P.core1, gold);
    ctx.strokeStyle = rgba(mixHex(P.halo0, COOL.mid, .5 * (1 - gold)), .35); ctx.lineWidth = 6; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.stroke();
    if (draw < 1) { const e = pts[pts.length - 1]; halo(ctx, e[0], e[1], 10, .8); }
    // the timeline's marks: the start, three quiet days, the end
    const mark = (x, tt, r, ring) => { const u = expoOut(span(t, tt, tt + .35)); if (u <= 0) return; ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y0, r * u * (1 + .25 * bump(t, tt, .5)), 0, 6.29); ctx.fill(); if (ring) { ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y0, 6.5, -Math.PI / 2, -Math.PI / 2 + 6.283 * u); ctx.stroke(); } };
    mark(x0 + 4, tShort + .3, 3.2, false);
    mark(lerp(x0, x1, .38), tFew, 1.9); mark(lerp(x0, x1, .5), tQuiet, 1.9); mark(lerp(x0, x1, .62), tDays, 1.9);
    mark(x1 - 4, tOverW, 2.6, true);
    ctx.restore();
  }];

  // ---------------------------------------------------------------- the cards from the phone (2.04): a bill, an upgrade lock; both fold back
  const PH = KITCHEN.phone;
  const card = (ctx, t, ta, kind) => {
    const up = expoOut(span(t, ta, ta + .38)), fold = sineIO(span(t, ta + .5, ta + .82)); if (up <= 0 || fold >= 1) return;
    const w = 30, h = 38, x = PH[0] - w / 2, yb = PH[1] - 6 - 44 * up, sy = 1 - fold;   // folds back down onto its foot (into the phone)
    ctx.save(); ctx.translate(x, yb); ctx.scale(1, Math.max(.001, sy));
    ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(3, -h + 3, w, h);
    ctx.fillStyle = kind === 'bill' ? P.cream : mixHex(P.ind1, P.blue1, .4); ctx.fillRect(0, -h, w, h);
    if (kind === 'bill') {
      ctx.fillStyle = rgba(P.ind1, .55); for (let i = 0; i < 4; i++) ctx.fillRect(5, -h + 7 + i * 6, i === 3 ? 10 : 20, 2);
      ctx.fillStyle = P.ind1; ctx.fillRect(5, -9, 20, 3);
    } else {
      ctx.strokeStyle = P.core1; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(w / 2, -h * .58, 6, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = P.core1; ctx.fillRect(w / 2 - 8.5, -h * .58, 17, 13); ctx.fillStyle = P.ind1; ctx.fillRect(w / 2 - 1, -h * .58 + 4, 2, 5);
    }
    ctx.restore();
  };

  // ---------------------------------------------------------------- you
  const tW0 = tEvery2 + .9, tW1 = tEvery2 + 3.4;   // the walk to the counter (we are out over the city)
  const youItem = (t) => [YZ, (ctx) => {
    const wu = span(t, tW0, tW1), x = lerp(YOU0, YOU1, sineIO(wu));
    const walking = wu > 0 && wu < 1;
    const exhale = bump(t, tIsnt + .1, 1.4);
    if (walking) { K.you(ctx, x, KY, 140, t, { pose: 'walk', walk: wu * 9.4, dir: -1, light: -1, seed: 1, cup: wu < .5 ? 'R' : undefined, steam: 0 }); return; }
    if (t < tW0) {   // the opening pose: the mug, looking at the wall; down at the table line when it races; at the phone on 'good news'
      const look = t < tRacing ? .85 - .5 * span(t, tAll + 1.2, tRacing) : t < tGood ? .32 : lerp(.32, .12, sineIO(span(t, tGood, tGood + .8)));
      ctx.save(); ctx.translate(0, 1.6 * exhale);
      K.you(ctx, x, KY, 140, t, { pose: 'hold', cup: 'R', look: look - .12 * exhale, lean: .03 * exhale, light: -1, seed: 1, steam: 1 });
      ctx.restore(); return;
    }
    // at the counter, facing left (2.05): reach to the kettle on 'kettle', the hand on the counter on 'whole illness', the pour on 'tea'
    const reach = Math.max(sineIO(span(t, tKettle - .35, tKettle + .05)) * (1 - sineIO(span(t, tKettle + .7, tKettle + 1.3))), sineIO(span(t, tTea - .4, tTea + .1)) * (1 - sineIO(span(t, tNext - .1, tNext + .5))));
    const rest = sineIO(span(t, tKettle + .9, tKettle + 1.6)) * (1 - sineIO(span(t, tTea - .45, tTea - .1)));
    const armR = [lerp(lerp(.2, .62, rest), 1.42, reach), lerp(lerp(.12, 1.1, rest), 1.55, reach)];
    const look = lerp(.25, .1, rest);
    K.you(ctx, x, KY, 140, t, { pose: 'stand', dir: -1, armR, look, light: -1, seed: 1 });
  }];

  // ---------------------------------------------------------------- the kettle (own drawing: it comes to the front edge, it pours)
  const kettleItem = (t) => [t < tEvery2 + 1 ? KITCHEN.kettle[2] : KET[2], (ctx) => {
    const home = t < tEvery2 + 1 ? [KITCHEN.kettle[0], KITCHEN.kettle[1]] : [KET[0], KET[1]];
    const steamA = smooth(span(t, tKettle + .7, tWhole + .6)), on = expoOut(span(t, tKettle + .05, tKettle + .3));
    const lift = sineIO(span(t, tTea + .1, tTea + .55)) * (1 - sineIO(span(t, tNext + .1, tNext + .6)));
    const pour = smooth(span(t, tTea + .4, tTea + .8)) * (1 - smooth(span(t, tNext - .15, tNext + .2)));
    const x = home[0] - 22 * lift, y = home[1] - 16 * lift, h = 30;
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.55 * pour); ctx.scale(-1, 1);   // spout to the left (the cup)
    K.kettle(ctx, 0, 0, h, t, { steam: 0 });
    if (on > 0) { ctx.fillStyle = rgba(P.core1, on); ctx.fillRect(-h * .3, -h * .1, h * .12, h * .05); }   // the switch light
    ctx.restore();
    if (steamA > 0) K.steam(ctx, x - h * .4, y - h * .7, h * 1.6, t, steamA * (1 - pour * .6), 3);
    if (pour > 0) {   // the stream from the spout into the cup
      const sx = x - h * .62, sy = y - h * .52 + h * .2 * pour;
      ctx.strokeStyle = rgba(P.cream, .8 * pour); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx - 4, sy + 6, CUP[0] + 1, CUP[1] - 9); ctx.stroke();
    }
  }];
  const cupItem = (t) => [CUP[2] + .5, (ctx) => {
    if (t < tEvery2 + 1) return;
    const x = CUP[0], y = CUP[1];
    ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(x - 5.5, y - 11); ctx.lineTo(x + 5.5, y - 11); ctx.lineTo(x + 4.3, y); ctx.lineTo(x - 4.3, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = P.cream; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x + 6.5, y - 6, 3, -1.2, 1.2); ctx.stroke();
    const sa = .35 + .65 * smooth(span(t, tTea + .7, tTea + 1.6));
    ctx.save(); ctx.translate(x, y - 12); ctx.transform(1, 0, -.55 * smooth(span(t, tTea + .7, tNext + .5)), 1, 0, 0);   // the steam drifts right
    K.steam(ctx, 0, 0, 34, t, sa, 3); ctx.restore();
  }];

  // ---------------------------------------------------------------- the kid and her voice-light (2.06)
  const kidItems = (t) => {
    if (t < tNext - 1.5) return [];
    const flop = expoOut(span(t, tArg - .05, tArg + .5)), settle = .06 * bump(t, tArg + .35, .6);
    const talk = .2 + .5 * bump(t, tNext + .2, tLosing - tNext + .2) + .45 * bump(t, tGenius - .25, 1.6);
    return [
      [VL[2], (ctx) => {
        const tk = lerp(talk, .25, smooth(span(t, tP - 1.4, tP)));
        K.voiceLight(ctx, VL[0], VL[1] + 2.5 * Math.sin(t * 1.3) * (1 - smooth(span(t, tP - 1.4, tP))), VLR, t, { talk: tk });
      }],
      [ZB - 56, (ctx) => {   // she sits on the bed (the mattress hides her legs), facing the light; on 'argument' she flops back onto it
        const x = -770, arm = (k, a) => [lerp(a[0], 2.85, k), lerp(a[1], 3.0, k)];
        const g = Math.sin(t * 5.2), g2 = Math.sin(t * 4.1 + 1), argue = 1 - flop;   // the argument: the arms keep making points
        const armR = arm(flop * .85, [.9 + .55 * argue * (.5 + .5 * g), 1.6 + .5 * argue * g]);
        const armL = arm(flop * .85, [.25 + .2 * argue * (.5 + .5 * g2), .3 + .4 * argue * g2]).map((v) => -v);
        ctx.save(); ctx.beginPath(); ctx.rect(x - 200, KY - 400, 400, 386); ctx.clip();   // nothing below the mattress' foot
        ctx.translate(x, KY - 50 + 47 + 4 - 2 * flop);
        K.kid(ctx, 0, 0, 100, t, { dir: 1, lean: -1.25 * flop - settle, look: .55 * argue + .3, armR, armL, seed: 2 });
        ctx.restore();
      }],
    ];
  };

  // ---------------------------------------------------------------- frame
  const draw = (ctx, t) => {
    if (t >= tP) { plateGenius(ctx, t); return; }
    const c = camOf(t);
    const hour = lerp(6.25, 6.55, span(t, tHeart, tBill));
    const phOn = .2, gold = smooth(span(t, tGood, tGood + .9));
    const wallA = t < tMind ? 1 : lerp(1, .55, span(t, tAll + 1.4, tHeart + 2));
    K.world(ctx, c, t, {
      hour, winFn: winFn(t), tower: { glow: 1 },
      you: {
        hallLamp: lerp(1, .6, sineIO(span(t, tHeart, tBill))),
        kid: { asleep: t < tNext - 1.5, items: kidItems(t), pools: t > tNext - 1.5 ? [[VL[0], VL[2], 260, COOL.edge, .7]] : [] },
        kitchen: {
          scan: t < tMind + .1 ? scanState(t) : null, wall: wallA, wallFn: wallFn(t),
          phone: { on: phOn * (1 - .5 * gold), gold: .85 * gold }, kettle: null,
          people: [youItem(t), kettleItem(t), cupItem(t), heartItem(t), [PH[2] - 1, (cx) => { card(cx, t, tBill, 'bill'); card(cx, t, tUpg, 'lock'); }]],
        },
      },
    });
    // ---- screen space: c01's lines sink into their windows (yours last, the camera follows it in); the price tags fold away
    const cw = wp(c, CW[0], CW[1], CW[2]);
    if (t < tThere + .6 && cw) {
      const tagU = 1 - span(t, t0, t0 + .45);
      for (const w of targets) {
        const u0 = lineTail(w, t); if (u0 >= 1) continue;
        const p = wp(c, w.X, w.Y, w.Z); if (!p) continue;
        K.goldLine(ctx, [cw[0], cw[1]], [p[0], p[1]], 1, { u0, lift: .07, w: w.yours ? 2.2 : payer(w) ? 1.6 : .9, a: w.yours ? 1 : w.Z === ZS ? .8 : w.Z > 6000 ? .3 : .45, spark: false });
        if (payer(w) && tagU > 0) K.priceTag(ctx, p[0] + 8, p[1] - 4, 22, tagU);
      }
    }
    // ---- 2.04: the clinic rings every window (left → right), then the ring of YOUR window flies in and settles round the kettle
    if (t > tEvery2 && t < tWhole + 1) {
      const fly = sineIO(span(t, tSome + 1.3, tKettle + .15));
      if (t > tKettle + .9) return;
      for (const w of targets) {
        const ta = ringAt(w), u = expoOut(span(t, ta, ta + .45)); if (u <= 0) continue;
        const p = wp(c, w.X, w.Y, w.Z); if (!p) continue;
        let X = w.X, Y = w.Y, Z = w.Z, r = w.room ? 46 : Math.min(w.w, w.h) * .4;
        if (w.yours) { X = lerp(w.X, KET[0] - 2, fly); Y = lerp(w.Y, KET[1] - 15, fly); Z = lerp(w.Z, KET[2], fly); r = lerp(70, 24, fly) * (1 - sineIO(span(t, tKettle + .35, tKettle + .9))); }   // it settles into the kettle's switch
        else if (t > tSome + 1.5) continue;   // the others stay behind in their windows (out of frame as we fly in)
        const q = wp(c, X, Y, Z); if (!q) continue;
        const rp = r * q[2], lw = Math.max(1.2, Math.min(3, 9 * q[2]));
        if (rp < 1.5 || rp > 4000) continue;
        const land = w.yours ? bump(t, tKettle + .05, .6) : 0;
        ctx.save(); ctx.strokeStyle = rgba(P.halo0, .35); ctx.lineWidth = lw * 3; ctx.beginPath(); ctx.arc(q[0], q[1], rp, -Math.PI / 2, -Math.PI / 2 + 6.283 * u); ctx.stroke();
        ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = lw; ctx.stroke(); ctx.restore();
        if (u < 1) halo(ctx, q[0] + Math.cos(-Math.PI / 2 + 6.283 * u) * rp, q[1] + Math.sin(-Math.PI / 2 + 6.283 * u) * rp, lw * 6, .8);
        if (land > 0) halo(ctx, q[0], q[1], rp * 1.2, .5 * land);
              }
    }
    // ---- 'Somebody decided': a hand-drawn gold rule under the city, left → right (it stays in the street; we fly in past it)
    if (t > tSome) {
      const u = sineIO(span(t, tSome + .05, tSome + 1.25)), pts = [];
      for (let i = 0; i <= 90 * u; i++) { const v = i / 90, X = lerp(-5900, 3600, v), Y = 125 + 9 * Math.sin(v * 17) + 5 * Math.sin(v * 41 + 1); const p = wp(c, X, Y, ZS); if (p) pts.push(p); }
      if (pts.length > 1) {
        ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = rgba(P.halo0, .35); ctx.lineWidth = 9; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
        ctx.strokeStyle = P.core1; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
        if (u < 1) { const e = pts[pts.length - 1]; halo(ctx, e[0], e[1], 22, .9); }
      }
    }
  };
  return [{ t: t0, draw, tr: 'cut' }];
};
