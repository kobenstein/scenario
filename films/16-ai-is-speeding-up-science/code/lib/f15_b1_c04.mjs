// Film 15 · B1 · c04 STATION 2 = ANCHOR 2 (85.16 – 129.84) · the same design space and camera as c03 (the paper slip that leaves the
// envelope flies up-right and lands on compartment 1 of the box: one continuous move, never an empty frame).
//
// | ID    | time         | anchor                         | picture                                                                      | moves              | carrier → next |
// | 4.01  | 85.16–90.32  | box · Ten · each year          | THE BOX from above, big, the folded band in its ten openings; the slip lands on 1; 1 … 10 write themselves | slip lands · push | plan sequence |
// | 4.02  | 90.32–93.00  | promise · inside               | the lid opens all the way; the folded band rises out of the openings and leaves upward (frees them) | lid · band rises | plan sequence |
// | 4.03★ | 93.00–107.56 | infectious … poorer            | per sentence a paper strip comes down and writes itself in front of its opening; four stay empty; no light inside | one strip at a time | box → dial above |
// | 4.04  | 107.56–113.08| clock · written · good enough  | a gold thread rises from the box and draws a stopwatch dial; the hand at 0; ESSAY · 2024; the hand trembles, no start | thread · hand | plan sequence |
// | 4.05  | 113.08–118.80| powerful · twenty-six          | the machine's ring forms round the dial: POWERFUL ARTIFICIAL INTELLIGENCE · EARLIEST: ~2026 | ring grows | dial tilts flat |
// | 4.06  | 118.80–123.28| finish · start                 | the dial falls flat round your feet: the start line; a long track into the dark, no finish line | dial falls · crane back | plan sequence |
// | 4.07  | 123.28–129.84| pharmacy · lab                 | a pharmacy (its cross dark) and a lab; on "lab" its window lights; flight into the window → c05 | window · flight | the lab window (portal) |
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import * as U from './f15_b1_util.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0 } = E;

export function setC04(T, a, S3) {
  // ------------------------------------------------------------------------------------------------ layout (design coords, card F0)
  const BOX = { x: 3800, y: 830, w: 1500 };
  const scratch = createCanvas(8, 8).getContext('2d');
  const G0 = F.box10(scratch, BOX.x, BOX.y, BOX.w, 0, { beta: 1, lid: .56 });
  const CELLS = G0.cells, CW = CELLS[0].w;
  const DIAL = { x: 3800, y: -1250, r: 260 }, RING = 372;
  const HOR = -380, START = 300, TRACK = { hw: 380 }, DU = { x: 3800, h: 300 };
  const PHARM = { x: 3220, y: -140, w: 340, h: 220 }, LAB = { x: 4400, y: -170, w: 300, h: 190 };
  const WIN = { x: LAB.x + 30, y: LAB.y - 118, w: 72, h: 80 };                     // the lab window (portal into c05)
  const STRIPS = [['INFECTIONS'], ['CANCER'], ["ALZHEIMER'S"], ['MENTAL', 'ILLNESS'], ['LIFESPAN ×2'], ['POORER', 'COUNTRIES']];
  const SAY = [a.infectious, a.cancers, a.alz, a.mental, a.double, a.poorer];
  const slot = (i) => [CELLS[i].cx, CELLS[i].y + CELLS[i].h * .63];
  const SW = CW * .9, SSIZE = 30;
  const tLand = a.box - .1;                                                       // the slip from c03 lands on compartment 1

  // the slip from the envelope (c03) to compartment 1: a world path with flutter, then flat on the box
  const ENV = S3.ENV;
  const SP = E.catmull([[ENV.x - 10, ENV.y - 40], [ENV.x + 120, ENV.y - 330], [2550, 1500], [3000, 1020], [slot(0)[0] - 150, slot(0)[1] - 260], slot(0)].map((p) => [p[0], p[1]]), 14);
  const slipAt = (t) => {
    const u = span(t, a.whatElse - .1, tLand), e = sineIO(u), fr = F.pathFrame(SP), [x, y] = fr.atU(e);
    const settle = smooth(span(u, .8, 1)), ph = u * 9.5;
    const flip = Math.cos(ph) * (1 - settle) + settle;
    return { x: x + 30 * Math.sin(ph * .7) * (1 - settle), y, rot: (.3 * Math.sin(ph * .9 + .5)) * (1 - settle), w: lerp(ENV.w * .78, SW, smooth(u)), sx: Math.sign(flip || 1) * Math.max(.1, Math.abs(flip)), back: flip < 0 ? 1 : 0 };
  };
  function drawSlip(ctx, t, c) {
    if (t < a.whatElse - .1 || t >= tLand) return;
    card(ctx, c, F0, () => { const s = slipAt(t); U.slip(ctx, s.x, s.y, { w: s.w, h: s.w * .3, rot: s.rot, sx: s.sx, back: s.back, unfold: 1, write: 0, lift: lerp(14, 3, span(t, tLand - .4, tLand)) }); });
  }

  // ------------------------------------------------------------------------------------------------ camera (continues c03's keys)
  const K3 = S3.KEYS[S3.KEYS.length - 1];
  const KEYS = [
    K3,
    [a.list2 + .9, aim(F0, 2750, 1300, .6, 960, 560)],
    [a.box + .25, aim(F0, 3800, 520, .84, 960, 545)],
    [a.each + .6, aim(F0, 3800, 512, .865, 960, 545)],
    [a.inside + .7, aim(F0, 3800, 430, .8, 960, 545)],
    [a.infectious + .2, aim(F0, 3740, 500, .86, 960, 545)],
    [a.mental + .2, aim(F0, 3790, 505, .88, 960, 545)],
    [a.poorer + 1.6, aim(F0, 3840, 520, .93, 960, 545)],
    [a.clock - .35, aim(F0, 3820, 470, .93, 960, 545)],
    [a.clock + 1.9, aim(F0, DIAL.x, DIAL.y, .9, 960, 430)],
    [a.enough + .6, aim(F0, DIAL.x, DIAL.y, .925, 960, 430)],
    [a.so - .25, aim(F0, DIAL.x, DIAL.y, .95, 960, 430)],
    [a.finish + 1.5, aim(F0, DU.x, -170, .63, 960, 540)],
    [a.start + .3, aim(F0, DU.x - 30, -190, .655, 960, 540)],
    [a.pharmacy + .3, aim(F0, DU.x - 110, -200, .69, 960, 540)],
    [a.lab - .15, aim(F0, DU.x + 120, -230, .72, 960, 540)],
    [a.T5 + 1, aim(F0, DU.x + 260, -260, .78, 960, 540)],              // never reached (the flight takes over at tZ): keeps the glide moving into it
  ];
  const tZ = a.lab + .25, S45 = a.T5 - .25, sEnd = W / WIN.w, s0 = .74 * 1.08;
  const camRaw = (t) => {
    if (t <= tZ) return U.camGlide(t, KEYS);
    // the flight into the window: one log zoom onto it, eased both ends (lands at rest: = c05's first key, cam3())
    const c0 = U.camGlide(tZ, KEYS), u = span(t, tZ, S45), e = .8 * sineIO(u) + .2 * u;   // lands with a little speed: c05 flies on (expo out)
    const p0 = project(c0, F0, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2), k0 = E.cardM(c0, F0).k;
    const s = Math.exp(lerp(Math.log(k0), Math.log(sEnd), e));
    return aim(F0, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, s, lerp(p0[0], W / 2, sineIO(u)), lerp(p0[1], H / 2, sineIO(u)), Math.max(F0, 80 * s));
  };

  // ------------------------------------------------------------------------------------------------ draw (world only)
  function draw(ctx, t, c, drawInside) {
    const lid = lerp(.56, 1, sineIO(span(t, a.promise - .9, a.inside - .1)));
    const rise = span(t, a.promise - .2, a.inside + .55), leave = expoIn(span(t, a.inside + .3, a.inside + 1.7));
    const boxOn = t < a.clock + 2.6, groundOn = t > a.clock + 2.4;
    if (boxOn) card(ctx, c, F0, () => {
      // the key light from above (where the band went): a soft warm pool over the box
      E.halo(ctx, BOX.x, BOX.y - 380, 1300, .1 + .06 * rise, P.halo1, P.halo0);
      const paper = CELLS.map((_, i) => 1 - smooth(span(t, a.promise - .1 + i * .07, a.promise + .45 + i * .07)));
      F.box10(ctx, BOX.x, BOX.y, BOX.w, t, { beta: 1, lid, paper });
      // 4.01 · the years 1 … 10 write themselves in the openings (cream serif, reading order, 60 ms apart)
      CELLS.forEach((cl, i) => {
        const u = span(t, a.ten + .05 + i * .06, a.ten + .5 + i * .06); if (u <= 0) return;
        ctx.save(); ctx.beginPath(); ctx.rect(cl.x + 14, cl.y + 6, 80 * u, 70); ctx.clip();
        E.glowText(ctx, String(i + 1), cl.x + 18, cl.y + 58, { size: 52, serif: true, col: P.cream, glow: true }); ctx.restore();
      });
      // 4.02 · the folded band rises out of the openings and leaves upward
      if (rise > 0 && leave < 1) {
        ctx.save(); ctx.translate(0, -2800 * leave);
        const marks = []; for (let k = 0; k <= 100; k++) marks.push({ m: .02 + .96 * k / 100, len: k % 10 ? (k % 5 ? .15 : .26) : .42, label: k % 10 ? null : String(2026 + k) });
        F.paperBand(ctx, BAND, t, { w: (s) => lerp(120, 300, Math.pow(s, .7)), cut: sineIO(rise), marks, glow: .9, twist: (s) => -.15 + .3 * Math.sin(s * 4.6 + t * .4) });
        ctx.restore();
      }
      // 4.03 · the strips: 1 is the slip from c03 (already lying there), 2 … 6 come down from above (where the band went)
      STRIPS.forEach((lines, i) => {
        const [sx, sy] = slot(i), ts = SAY[i];
        const write = span(t, ts - .12, ts + .55);
        if (i === 0) { if (t >= tLand) U.slip(ctx, sx, sy, { w: SW, h: SW * .3, lines, size: SSIZE, write, unfold: 1, lift: 3 }); return; }
        const t0 = ts - 1.45, t1 = ts - .2, u = span(t, t0, t1); if (u <= 0) return;
        const e = 1 - Math.pow(1 - u, 2.4), ph = u * 7;
        const x = sx + 70 * Math.sin(ph * .8) * (1 - e), y = lerp(sy - 1150, sy, e), rot = .35 * Math.sin(ph) * (1 - e);
        const flip = lerp(Math.cos(ph * 1.3), 1, smooth(span(u, .6, 1)));
        U.slip(ctx, x, y, { w: SW, h: SW * .3, lines, size: SSIZE, write, rot, sx: Math.sign(flip || 1) * Math.max(.1, Math.abs(flip)), back: flip < 0 ? 1 : 0, unfold: 1, lift: lerp(16, 3, e) });
      });
    });
    // 4.04 – 4.06 · the dial (stopwatch of light) above the box; it falls flat into the start line
    const fall = sineIO(span(t, a.finish - .7, a.finish + 1.2));
    const thr = span(t, a.clock - .35, a.clock + .45), ringU = span(t, a.clock + .4, a.clock + 1.55);
    if (thr > 0) card(ctx, c, F0, () => {
      // the thread from the box up to the dial (retracts once the ring is closed)
      const tail = span(t, a.clock + 1.2, a.clock + 2.2);
      if (tail < 1) F.trailSpan(ctx, THREAD, tail, sineIO(thr), { w: 2.4, spark: thr < 1 });
      if (fall >= 1 && t > a.finish + 1.2) return;
      if (ringU > 0 && fall <= 0) dial(ctx, t, ringU);
    });
    if (groundOn) card(ctx, c, F0, () => ground(ctx, t, fall, drawInside));
  }

  // the stopwatch dial: face, ring (drawn by the thread's head), ticks that light as it passes, crown, the hand at 0
  function dial(ctx, t, ringU) {
    const { x, y, r } = DIAL, a0 = Math.PI / 2, ah = a0 + ringU * Math.PI * 2;
    const face = new Path2D(); face.arc(x, y, r, 0, 6.29);
    ctx.save(); ctx.globalAlpha = smooth(span(ringU, .6, 1));
    ctx.fillStyle = E.rad(ctx, x, y - r * .3, r * 1.2, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.fill(face); ctx.restore();
    E.glowFill(ctx, face, r * .5, .45 * smooth(ringU), P.blue0);
    // ring arc so far (gold), ticks behind the head
    const arc = []; for (let k = 0; k <= 120 * ringU; k++) { const q = a0 + k / 120 * Math.PI * 2; arc.push([x + Math.cos(q) * r, y + Math.sin(q) * r]); }
    if (arc.length > 1) F.trailSpan(ctx, arc, 0, 1, { w: 3.6, spark: ringU < 1 });
    ctx.lineCap = 'round';
    for (let k = 0; k < 60; k++) {
      const q = -Math.PI / 2 + k / 60 * Math.PI * 2; let d = (q - a0) % (Math.PI * 2); if (d < 0) d += Math.PI * 2;
      const lit = clamp((ah - a0 - d) / .4); if (lit <= 0) continue;
      const major = k % 5 === 0, r0 = r * (major ? .8 : .88);
      ctx.strokeStyle = rgba(major ? P.core1 : P.halo1, .9 * lit); ctx.lineWidth = major ? 5 : 2.4;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(q) * r0, y + Math.sin(q) * r0); ctx.lineTo(x + Math.cos(q) * r * .95, y + Math.sin(q) * r * .95); ctx.stroke();
    }
    // the crown (a stopwatch): grows from the top of the ring
    const cr = expoOut(span(ringU, .95, 1) + span(t, a.clock + 1.5, a.clock + 2.0));
    if (cr > 0) { ctx.fillStyle = mixHex(P.halo1, P.shade0, .2); ctx.beginPath(); ctx.roundRect(x - 26, y - r - 14 - 46 * cr, 52, 46 * cr + 6, 6); ctx.fill(); ctx.fillRect(x - 40, y - r - 20 - 46 * cr, 80, 14 * cr); }
    // the hand: grows from the centre to 0 (twelve), stands still; trembles on "good enough", never starts
    const hu = expoOut(span(t, a.clock + 1.45, a.clock + 2.1));
    if (hu > 0) {
      const tr = span(t, a.enough - .1, a.enough + 1.3), ang = -Math.PI / 2 + .045 * Math.sin(tr * 38) * Math.sin(Math.PI * tr) * (tr > 0 && tr < 1 ? 1 : 0);
      F.trailSpan(ctx, [[x, y], [x + Math.cos(ang) * r * .78 * hu, y + Math.sin(ang) * r * .78 * hu]], 0, 1, { w: 4, spark: false });
      E.halo(ctx, x, y, 40, .6 * hu, P.halo1, P.core0);
    }
    // ESSAY · 2024: a tag unfolds from the ring's right edge (the promise was written)
    const tag = span(t, a.written - .15, a.written + .6) * (1 - span(t, a.so - .3, a.so + .3));
    if (tag > 0) U.slip(ctx, x + RING + 230, y - 6, { lines: ['ESSAY · 2024'], size: 34, unfold: tag * 1.6, write: span(tag, .3, 1), lift: 3 });
    // 4.05 · the machine's ring forms round the dial (grows out of its edge), cool; the words under it; EARLIEST ~2026 on the left
    const rg = expoOut(span(t, a.powerful - .2, a.powerful + .9)) * (1 - expoIn(span(t, a.so - .3, a.so + .4)));
    if (rg > 0) F.reticle(ctx, x, y, lerp(r + 4, RING, rg), t, { rot: .25 + t * .05, a: clamp(rg * 3) });
    const uP = span(t, a.powerful + .2, a.powerful + 1.2) * (1 - span(t, a.so - .4, a.so));
    U.capsLine(ctx, 'powerful artificial intelligence', x, y + RING + 120, 44, uP, { align: 'center' });
    const uE = span(t, a.twentySix - .25, a.twentySix + 1.0) * (1 - span(t, a.so - .45, a.so - .05));
    U.numBlock(ctx, { x: x - RING - 540, y: y + 20, num: '~2026', label: 'earliest', src: 'Dario Amodei · 2024', u: uE, size: 170, labelSize: 40, srcSize: 26, gap: 70 });
  }

  // the track world (from 4.06): the ground, the track to the horizon, you on the start line (= the fallen dial), pharmacy and lab
  function ground(ctx, t, fall, drawInside) {
    ctx.fillStyle = E.lin(ctx, 0, HOR - 360, 0, HOR, [[0, rgba(P.ind1, 0)], [1, rgba(P.blue0, .38)]]); ctx.fillRect(1000, HOR - 360, 6000, 362);   // a faint lift at the horizon
    ctx.fillStyle = E.lin(ctx, 0, HOR, 0, START + 700, [[0, P.ind2], [.15, P.night1], [1, P.night0]]); ctx.fillRect(1000, HOR, 6000, 4000);
    ctx.fillStyle = rgba(P.blue0, .95); ctx.fillRect(1000, HOR - 1, 6000, 2);
    // the track: two lines of light that converge on the horizon and fade into the dark (no finish line anywhere)
    const vp = [DU.x, HOR], NEAR = START + 1500, wN = TRACK.hw * (NEAR - HOR) / (START - HOR), L = [DU.x - wN, NEAR], R = [DU.x + wN, NEAR];
    E.stars(ctx, 1504, 140, t, [DU.x - 2600, HOR - 1500, 5200, 1350], .45);   // a few faint stars: the sky is open, nothing else is there
    const surf = new Path2D(); surf.moveTo(L[0], L[1]); surf.lineTo(vp[0] - 3, vp[1]); surf.lineTo(vp[0] + 3, vp[1]); surf.lineTo(R[0], R[1]); surf.closePath();
    ctx.fillStyle = E.lin(ctx, 0, START + 260, 0, HOR, [[0, rgba(P.blue1, .5)], [.35, rgba(P.blue0, .3)], [1, rgba(P.ind1, 0)]]); ctx.fill(surf);
    for (const side of [L, R]) {
      ctx.strokeStyle = E.lin(ctx, 0, side[1], 0, HOR, [[0, rgba(P.halo1, .85)], [.45, rgba(P.halo1, .35)], [1, rgba(P.blue0, 0)]]); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(side[0], side[1]); ctx.lineTo(vp[0], vp[1]); ctx.stroke();
    }
    for (let k = 0; k < 16; k++) {   // centre dashes, shrinking with distance
      const z0 = Math.pow(.8, k), z1 = Math.pow(.8, k + .45), y0 = lerp(HOR, START + 260, z0), y1 = lerp(HOR, START + 260, z1);
      ctx.strokeStyle = rgba(P.halo1, .55 * z0); ctx.lineWidth = Math.max(1, 5 * z0); ctx.beginPath(); ctx.moveTo(DU.x, y0); ctx.lineTo(DU.x, y1); ctx.stroke();
    }
    // the pharmacy (cross dark, stays dark) and the lab (its window lights on "lab")
    house(ctx, PHARM, false, t);
    const win = expoOut(span(t, a.lab - .1, a.lab + .45));
    house(ctx, LAB, true, t);
    const wr = new Path2D(); wr.rect(WIN.x, WIN.y, WIN.w, WIN.h);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fill(wr);
    if (drawInside && win > 0) { ctx.save(); ctx.clip(wr); drawInside(ctx, WIN); ctx.restore(); }
    if (win > 0) {
      // warm light: a lamp is on inside (the glow shrinks to nothing as the window fills the frame)
      const k = 1 - span(t, a.lab + .6, S45 - .35);
      if (k > 0) { E.glowFill(ctx, wr, 26 * k, .8 * win * k, P.halo1); E.halo(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 160 * k, .35 * win * k, P.halo1, P.core1); }
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(WIN.x + WIN.w / 2, LAB.y + 4); ctx.scale(1, .16);
      ctx.fillStyle = E.rad(ctx, 0, 0, 200, [[0, rgba(P.halo1, .5 * win * k)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 200, 0, 6.29); ctx.fill(); ctx.restore();
    }
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h);
    // the fallen dial: back half behind you, you, front half
    const start = span(t, a.finish - .7, a.finish + 1.2);
    const ry = lerp(DIAL.r, 16, sineIO(start)), rx = lerp(DIAL.r, TRACK.hw, sineIO(start)), cy = lerp(DIAL.y, START, sineIO(start));
    const flash = Math.max(0, 1 - Math.abs(t - a.start - .15) / .5);
    const ringArc = (s0, s1) => { const p = []; for (let k = 0; k <= 60; k++) { const q = lerp(s0, s1, k / 60); p.push([DU.x + Math.cos(q) * rx, cy + Math.sin(q) * ry]); } return p; };
    if (start > 0) F.trailSpan(ctx, ringArc(Math.PI, 2 * Math.PI), 0, 1, { w: 3.6 + 2 * flash, spark: false });
    const look = .15 + .35 * sineIO(span(t, a.atMost - .2, a.start + .4)) - .2 * sineIO(span(t, a.pharmacy - .4, a.pharmacy + .4));
    E.castShadow(ctx, DU.x, START + 2, 24, 120, Math.PI / 2 + .1, .4);
    E.du(ctx, DU.x, START + 1, DU.h, { dir: 1, view: 'back', look, light: 1, armR: [.15, .08], armL: [-.15, -.08], rim: mixHex(P.coat, P.core1, .5 + .4 * flash) });
    if (start > 0) {
      F.trailSpan(ctx, ringArc(0, Math.PI), 0, 1, { w: 3.6 + 2 * flash, spark: false });
      E.halo(ctx, DU.x, cy, 300, (.12 + .25 * flash) * start, P.halo1, P.halo0);
    }
  }
  function house(ctx, h, isLab) {
    const { x, y, w, h: hh } = h, p = new Path2D();
    p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y - hh); p.lineTo(x - w * .1, y - hh - (isLab ? 18 : 46)); p.lineTo(x + w / 2, y - hh); p.lineTo(x + w / 2, y); p.closePath();
    ctx.fillStyle = E.lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .4)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke(p);
    if (!isLab) {   // the pharmacy's cross: an outline, dark (no light here yet)
      const cx = x + w * .18, cy = y - hh * .56, s = w * .09;
      ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2.4; ctx.beginPath();
      ctx.moveTo(cx - s / 3, cy - s); ctx.lineTo(cx + s / 3, cy - s); ctx.lineTo(cx + s / 3, cy - s / 3); ctx.lineTo(cx + s, cy - s / 3); ctx.lineTo(cx + s, cy + s / 3); ctx.lineTo(cx + s / 3, cy + s / 3);
      ctx.lineTo(cx + s / 3, cy + s); ctx.lineTo(cx - s / 3, cy + s); ctx.lineTo(cx - s / 3, cy + s / 3); ctx.lineTo(cx - s, cy + s / 3); ctx.lineTo(cx - s, cy - s / 3); ctx.lineTo(cx - s / 3, cy - s / 3); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(x - w * .32, y - hh * .5, w * .22, hh * .5);   // a dark door
    }
  }
  const BAND = F.smoothPath([[BOX.x, 520], [BOX.x - 60, 300], [BOX.x + 160, 20], [BOX.x - 140, -380], [BOX.x + 180, -860], [BOX.x - 60, -1400], [BOX.x + 120, -2100]], 14);
  const THREAD = (() => { const p = [[BOX.x, BOX.y - .44 * BOX.w - 4]]; for (let k = 1; k <= 12; k++) p.push([BOX.x, lerp(BOX.y - .44 * BOX.w - 4, DIAL.y + DIAL.r, k / 12)]); return p; })();

  return { draw, drawSlip, camRaw, KEYS, S45, WIN, tZ };
}
