// Film 13 · B1 · c03 (63.48–95.68) and the first seconds of c04: water. Shared by scenes/sc03.mjs and sc04.mjs (same global t), so
// the c03|c04 seam is the same picture on both sides. Owner direction 28.10.: separate clean pictures joined by a carrier, no camera
// journey; the hourglass is only an anchor (the small one on the sill, then the close-up that starts c04).
//
// | ID    | anchor                   | picture (one idea)                                                                 | moves (≤ 2)           | → carrier              |
// |-------|--------------------------|------------------------------------------------------------------------------------|-----------------------|------------------------|
// | 3.01  | simplest @65.56          | from the LINE plate (c02): the gold line is the horizon of a wide plain; the ground | ground · moon rises   | –                      |
// |       |                          | grows down from it, a low moon rises at the right (hero)                            |                       |                        |
// | 3.02  | tap · girls              | a girl (indigo, canister on her head) walks in along the dusty path; far figures   | she walks             | her footprints         |
// | 3.03  | million · water          | EXPL her footprints rise as grains and count into a field of hours in the sky:     | grains count          | the grains             |
// |       |                          | `200 million` · `HOURS A DAY` · `UNICEF · 2016`                                     |                       |                        |
// | 3.04★ | pipe · school · work     | a pipe of light runs along the ground to her, a tap; the field of hours drains into | pipe · sand · she     | the tap (same place,   |
// |       |                          | it and pours as gold sand into her open hand; she sets the canister down; on       | walks on              | push ×3)               |
// |       |                          | "school" the gold runs on and lights a school window, on "work" a workshop window   |                       |                        |
// | 3.05  | home · zero              | push on the tap: it is your kitchen tap (the horizon is the counter's edge); the   | window frame · water  | –                      |
// |       |                          | window frame is drawn, the wall closes round it; you fill a glass. `0` `HOURS`      |                       |                        |
// | 3.06  | truly arrives · missing  | the last drop arcs over to the small hourglass on the sill and becomes a grain     | the drop              | –                      |
// | 3.07  | feel · way               | slow pull back: you look at the hourglass; outside every window of the city is lit | pull back · windows   | push into the hourglass|
// | 4.01  | vanish · else (c04)      | the hourglass close (anchor); on "else" the thread bends out of the glass and runs | thread · pan right    | the thread → washer    |
// |       |                          | right; the camera follows it                                                       |                       |                        |
import { createCanvas, Path2D } from '@napi-rs/canvas';
import * as B from './f13_b1_kit.mjs';
import { drawLine, LINE_Y, lineGlint } from './f13_b1_city.mjs';
import { makeBoard, WASH, drumIcon } from './f13_b1_board.mjs';
const { E, K } = B;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, prng, rad, lin } = E;

const HZ = LINE_Y;                                   // the horizon (= the gold line of the LINE plate)
// the plain is seen closer than first drawn (lead note: the motif owns the frame): everything below the horizon scales by GS about it
const GS = 1.45;
const PATH_Y = 700 + 152 * GS;                       // the dusty path (feet)
const MOON = { x: 1760, y0: 780, y1: 560, r: 58 };
const GIRL = { h: 290 * GS, x0: -240, xs: 600 };          // she stops at xs (the tap)
const ARM = [1.05, 1.55];                            // her open hand, held out under the tap
const TAP = (() => { const g = createCanvas(8, 8).getContext('2d'); const R = E.person(g, GIRL.xs, PATH_Y, GIRL.h, { dir: 1, view: 'side', armR: ARM, long: true }).R; return [R[0] + 6 * GS, R[1] - 92 * GS]; })();
const FIELD = { x: 880, y: 170, cols: 26, rows: 9, dx: 34, dy: 34 };
const FAR = (() => { const r = prng(31), o = []; for (let i = 0; i < 5; i++) o.push({ x0: -40 - i * 160 - r() * 60, v: 30 + r() * 18, h: 62 + r() * 18, y: HZ + 14 + r() * 10, ph: r() * 6 }); return o; })();
const SCHOOL = { x: 1420, w: 190, h: 120 }, WORKS = { x: 1760, w: 120, h: 70 };
// the kitchen (screen coords, after the push): the tap lands at KT; the counter is the old horizon
const KT = [1047, 480], KP = 3 / GS;          // the kitchen tap is drawn at the same size as before (GS · KP = 3)
const kmap = (x, y) => [KT[0] + (x - TAP[0]) * KP, KT[1] + (y - TAP[1]) * KP];
const COUNTER = kmap(0, HZ)[1];
const WIN = { x0: 330, y0: 70, x1: 1500, y1: COUNTER - 34 };
const HGS = { x: 640, h: 170 };                      // the small hourglass on the sill
const DU = { x: 1330, h: 690 };
const GRID = (() => { const r = prng(55), g = []; for (let j = 0; j < FIELD.rows; j++) for (let i = 0; i < FIELD.cols; i++) g.push({ i, j, r: r(), s: r() }); return g; })();
const CITYW = (() => { const r = prng(91), o = []; let x = WIN.x0 - 40; while (x < WIN.x1 + 40) { const w = 70 + r() * 90; o.push([x, WIN.y1 - 120 - r() * 230, w - 6, Math.floor(r() * 999)]); x += w; } return o; })();

// the tap of light: a post from the ground, a curved spout; (x, y) = the spout's mouth; s = scale
function tap(ctx, x, y, s, a = 1, t = 0) {
  if (a <= 0) return;
  const p = new Path2D(); p.moveTo(x - 30 * s, HZ + 2); p.lineTo(x - 30 * s, y - 26 * s); p.quadraticCurveTo(x - 30 * s, y - 42 * s, x - 14 * s, y - 42 * s); p.quadraticCurveTo(x, y - 42 * s, x, y - 26 * s); p.lineTo(x, y);
  const st = p.stroke({ width: 7 * s, cap: 1, join: 1 });
  ctx.save(); ctx.globalAlpha = a; E.lightShape(ctx, st, t, { lit: 0, a, dust: 0, glow: .5 }); ctx.restore();
}
function canister(ctx, x, y, s) {
  ctx.fillStyle = lin(ctx, x - 22 * s, 0, x + 22 * s, 0, [[0, P.night1], [1, mixHex(P.ind2, P.blue1, .4)]]);
  ctx.beginPath(); ctx.roundRect(x - 22 * s, y - 34 * s, 44 * s, 34 * s, 5 * s); ctx.fill();
  ctx.fillStyle = rgba(mixHex(P.blue2, P.cream, .3), .9); ctx.fillRect(x + 20 * s, y - 32 * s, 2.5 * s, 30 * s); ctx.fillRect(x - 6 * s, y - 40 * s, 12 * s, 6 * s);
}

export function makeWater(T) {
  const board = makeBoard(T);
  const S = (w, n) => T.S('s04', w, n), S5 = (w, n) => T.S('s05', w, n);
  const a = {
    s04: T.seg('s04').start, simplest: S('simplest'), tap: S('tap'), girls: S('girls'), million: S('million'), water: S('carrying'),
    pipe: S('pipe'), arrives: S('arrives'), school: S('school'), work: S('work'), home: S('home'), zero: S('zero'), think: S('think'),
    truly: S('truly'), missing: S('missing'), worked: S('worked'), feel: S('feel'), s05: T.seg('s05').start, vanish: S5('vanish'), else: S5('else'),
    washing: S5('washing'),
  };
  const LINE_T = a.s04 + 1.1;
  // girl
  const tStop = a.pipe + .15, tGo = a.school - .25;
  const tW0 = LINE_T + .4, vWalk = (GIRL.xs - GIRL.x0) / (tStop - .6 - (tW0 + .4));
  const gx = (t) => t < tGo ? GIRL.x0 + vWalk * (B.rampInt(t, tW0, tW0 + .8) - B.rampInt(t, tStop - 1.2, tStop)) : GIRL.xs + 175 * B.rampInt(t, tGo, tGo + .8);
  // the push on the tap, then the kitchen
  const tK0 = a.home - .55, tK1 = a.home + .75;
  const plainK = (t) => Math.exp(Math.log(KP) * sineIO(span(t, tK0, tK1)));
  // the outer camera: one slow push toward the small hourglass (3.06 → 4.01, ~13 s; it also takes you out of frame on the right),
  // a zoom about a fixed point so nothing slides sideways. The hourglass ends at HGS_S on screen (anchor), the washer is drawn left of it.
  const tH0 = a.truly + .6, tH1 = a.washing + .4;
  const HGC = [HGS.x, COUNTER - 2 - HGS.h * .5], HK = 1.7, HGS_S = [1100, 560];
  const outer = (t) => {
    const k = Math.exp(Math.log(HK) * sineIO(span(t, tH0, tH1))), g = (1 - 1 / k) / (1 - 1 / HK);
    // world point at screen centre: linear in 1/k between (960, 540) and the end view (fixed-point zoom)
    const vx = lerp(960, HGC[0] - (HGS_S[0] - 960) / HK, g), vy = lerp(540, HGC[1] - (HGS_S[1] - 540) / HK, g);
    return { cx: vx, cy: vy, k, sx: 960, sy: 540 };
  };
  const apply = (ctx, o) => { ctx.translate(o.sx, o.sy); ctx.scale(o.k, o.k); ctx.translate(-o.cx, -o.cy); };
  // z = 1 at the LINE plate; a slow push over the plain (3.01–3.03) that gives itself back during the push on the tap
  const breathe = (ctx, t) => { const z = (1 + .014 * Math.sin((t - LINE_T) * .31)) * (1 + .06 * sineIO(span(t, LINE_T, tK0)) - .06 * sineIO(span(t, tK0, tK1))), dy = 80 * sineIO(span(t, LINE_T, a.girls + 1)) * (1 - sineIO(span(t, tK0, tK1))); ctx.translate(960, 540 - dy); ctx.scale(z, z); ctx.translate(-960, -540); };

  // ---------------------------------------------------------------- the plain (world = screen at k 1)
  function plain(ctx, t) {
    if (t > tK1 + .6) return;
    const gr = sineIO(span(t, LINE_T, LINE_T + 1.8));
    // ground grows down from the horizon line
    if (gr > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-2000, HZ, 6000, 1400 * gr); ctx.clip(); ctx.fillStyle = lin(ctx, 0, HZ, 0, HZ + 420, [[0, P.ind1], [.25, P.night1], [1, P.night0]]); ctx.fillRect(-2000, HZ, 6000, 1400); ctx.restore(); }
    // the horizon: the plate's gold line, thinning to a moonlit rim (it stays: it is the pipe's level and later the counter's edge)
    K.trailSpan(ctx, [[-80, HZ], [W + 80, HZ]], 0, 1, { w: lerp(2.4, 1.3, sineIO(span(t, LINE_T, LINE_T + 2))), spark: false });
    K.trailSpan(ctx, [[-2400, HZ], [-80, HZ]], 0, 1, { w: lerp(2.4, 1.3, sineIO(span(t, LINE_T, LINE_T + 2))), spark: false }); K.trailSpan(ctx, [[W + 80, HZ], [W + 2400, HZ]], 0, 1, { w: lerp(2.4, 1.3, sineIO(span(t, LINE_T, LINE_T + 2))), spark: false });
    lineGlint(ctx, t, LINE_T, false);
    // the moon (hero of 3.01–3.03) rises behind the horizon
    const mu = sineIO(span(t, a.simplest - .6, a.simplest + 2.6)), my = lerp(MOON.y0, MOON.y1, mu);
    if (mu > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 6000, HZ + 2000); ctx.clip();
      halo(ctx, MOON.x, my, MOON.r * 5, .45, P.ind1, P.cream);
      ctx.fillStyle = rad(ctx, MOON.x - 14, my - 16, MOON.r * 1.2, [[0, P.cream], [.7, mixHex(P.cream, P.blue2, .2)], [1, mixHex(P.cream, P.blue1, .4)]]); ctx.beginPath(); ctx.arc(MOON.x, my, MOON.r, 0, 6.29); ctx.fill();
      ctx.restore();
    }
    // the path: a lighter band of dust, growing from the horizon down, moonlit
    const pu = smooth(span(t, LINE_T + .4, LINE_T + 1.6));
    if (pu > 0) { ctx.save(); ctx.globalAlpha = pu; ctx.fillStyle = lin(ctx, 0, PATH_Y - 26, 0, PATH_Y + 30, [[0, rgba(P.ind2, 0)], [.4, rgba(mixHex(P.ind2, P.blue1, .6), .8)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-2000, PATH_Y - 26, 6000, 56); ctx.restore(); }
    // far figures near the horizon (they walk too)
    for (const f of FAR) { const x = f.x0 + f.v * (t - LINE_T); if (x < -60 || x > 2000) continue; E.person(ctx, x, f.y, f.h, { dir: 1, walk: x / (f.h * .9) * Math.PI * 2 + f.ph, long: true, armR: [Math.PI - .3, Math.PI - .2] }); ctx.fillStyle = P.night1; ctx.fillRect(x - 6, f.y - f.h * 1.08, 12, 9); }
    // the school and the workshop near the horizon: dark until the gold reaches them
    const lS = smooth(span(t, a.school - .05, a.school + .4)), lW = smooth(span(t, a.work - .05, a.work + .4));
    for (const [b, l] of [[SCHOOL, lS], [WORKS, lW]]) {
      const rs = sineIO(span(t, a.pipe + .6, a.pipe + 1.8)); if (rs <= 0) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 6000, HZ + 2000); ctx.clip();
      const y0 = HZ - b.h * rs; ctx.fillStyle = lin(ctx, b.x, 0, b.x + b.w, 0, [[0, P.night1], [1, P.ind2]]); ctx.fillRect(b.x, y0, b.w, b.h + 4);
      ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(b.x, y0, b.w, 2);
      const ww = b.w * .22, wh = b.h * .34;
      for (let i = 0; i < (b === SCHOOL ? 3 : 1); i++) { const wx = b.x + b.w * (b === SCHOOL ? .12 + i * .3 : .39), wy = y0 + b.h * .32; ctx.fillStyle = mixHex(P.night0, P.core1, l); ctx.fillRect(wx, wy, ww, wh); if (l > 0) halo(ctx, wx + ww / 2, wy + wh / 2, 60, .5 * l, P.halo1, P.core1); }
      ctx.restore();
    }
    // footprints → grains → the field of hours (3.03); the field drains into the tap (3.04)
    const tF = a.million - .2, drain0 = a.arrives + .1;
    if (t > a.girls && t < drain0 + 2.6) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const g of GRID) {
        const k = g.j * FIELD.cols + g.i, n = GRID.length;
        const tOn = tF + (k / n) * 1.5 + g.r * .25;                                // the count fills row by row (from the bottom)
        if (t < tOn - .9) continue;
        const fx = FIELD.x + g.i * FIELD.dx, fy = FIELD.y + (FIELD.rows - 1 - g.j) * FIELD.dy;
        const sx = lerp(GIRL.x0 + 200, gx(tOn - .9) - 20, g.s), sy = PATH_Y + 4;           // a footprint behind her
        const u = sineIO(span(t, tOn - .9, tOn));
        const dd = span(t, drain0 + (1 - k / n) * 1.2 + g.r * .3, drain0 + (1 - k / n) * 1.2 + g.r * .3 + .9);   // drain: into the tap's mouth
        let x = lerp(sx, fx, u), y = lerp(sy - 60 * Math.sin(u * Math.PI), fy, u);
        if (dd > 0) { const v = sineIO(dd); x = lerp(lerp(fx, TAP[0] + 60, v), lerp(TAP[0] + 60, TAP[0], v), v); y = lerp(lerp(fy, TAP[1] - 160, v), lerp(TAP[1] - 160, TAP[1] - 30, v), v); }
        if (dd >= 1) continue;
        ctx.fillStyle = g.r > .5 ? P.core1 : P.halo0; ctx.globalAlpha = .8 + .2 * Math.sin(t * 2 + k);
        const sz = u < 1 ? 3 : 4.6; ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
      ctx.restore();
    }
    // the text of 3.03 (upper left, over the dark sky)
    B.line(ctx, '200 million', 150, 300, B.inOut(t, a.million - .1, a.pipe - .2), { size: 120, serif: true });
    B.line(ctx, 'HOURS A DAY', 154, 382, B.inOut(t, a.million + .3, a.pipe - .2, 1), { size: 56 });
    B.line(ctx, 'CARRYING WATER · UNICEF 2016', 154, 434, B.inOut(t, a.water - .2, a.pipe - .2, 2), { size: 30, col: rgba(P.halo2, .85) });
    // the pipe of light along the ground and the tap
    const pp = sineIO(span(t, a.pipe - .25, a.arrives + .2));
    if (pp > 0) {
      const pts = [[-120, HZ + 4], [TAP[0] - 30, HZ + 4]];
      K.trailSpan(ctx, pts, 0, pp, { w: 2.6, spark: pp < 1 });
      tap(ctx, TAP[0], TAP[1], GS, smooth(span(t, a.arrives - .05, a.arrives + .35)), t);
    }
    // the girl
    const x = gx(t), walking = t < tStop - .05 || t > tGo, ph = x / (GIRL.h * .9) * Math.PI * 2;
    const held = t < a.arrives + .3, down = sineIO(span(t, a.arrives + .3, a.arrives + 1.0)), handOut = sineIO(span(t, a.arrives + .6, a.arrives + 1.1)) * (1 - sineIO(span(t, tGo - .3, tGo + .2)));
    const armR = held ? [Math.PI - .3, Math.PI - .15] : down < 1 ? [lerp(Math.PI - .3, .2, down), lerp(Math.PI - .15, .1, down)] : [lerp(.2, ARM[0], handOut), lerp(.1, ARM[1], handOut)];
    const hd = E.person(ctx, x, PATH_Y, GIRL.h, { dir: 1, view: 'side', walk: walking ? ph : undefined, long: true, armR, rim: mixHex(P.blue2, P.cream, .35) });
    const cx = down < 1 ? lerp(x + 4, x - 46 * GS, down) : x - 46 * GS, cy = down < 1 ? lerp(PATH_Y - GIRL.h * 1.0, PATH_Y + 2, sineIO(down)) : PATH_Y + 2;
    if (t < tGo + .1) canister(ctx, cx, cy, GS);
    else canister(ctx, GIRL.xs - 46 * GS, PATH_Y + 2, GS);
    // sand from the tap into her hand (the hours arrive), then it runs on to the school and the workshop
    const pour = span(t, a.arrives + .5, a.school - .1);
    if (pour > 0 && pour < 1) {
      K.trailSpan(ctx, [[TAP[0], TAP[1]], [TAP[0], hd.R[1] - 4]], 0, 1, { w: 2, spark: false });
      halo(ctx, hd.R[0], hd.R[1] - 4, 40, .6, P.halo0, P.core0);
    }
    const run = (t0, b) => { const u = span(t, t0 - .5, t0 + .05); if (u <= 0 || u >= 1.3) return; const px = lerp(TAP[0], b.x + b.w / 2, sineIO(u)), py = lerp(TAP[1] + 40, HZ - b.h * .5, sineIO(u)) - 90 * Math.sin(u * Math.PI); halo(ctx, px, py, 26, .8, P.halo0, P.core0); };
    run(a.school, SCHOOL); run(a.work, WORKS);
  }

  // ---------------------------------------------------------------- the kitchen (screen coords after the push)
  function kitchen(ctx, t, plainCam) {
    if (t < tK1 - .7) return;
    // the window frame is drawn by a cool line from the tap; the wall closes round it
    const fr = sineIO(span(t, tK1 - .5, tK1 + .5)), wall = sineIO(span(t, tK1 - .1, tK1 + 1.0));
    const frame = [[KT[0] - 40, WIN.y1], [WIN.x0, WIN.y1], [WIN.x0, WIN.y0], [WIN.x1, WIN.y0], [WIN.x1, WIN.y1], [KT[0] + 40, WIN.y1]];
    // the city outside: every window lit by 3.07 (they all still work)
    const cityUp = sineIO(span(t, a.worked - .6, a.worked + .9));
    if (cityUp > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip();
      for (const [x, y, w, sd] of CITYW) { ctx.save(); ctx.translate(0, (WIN.y1 - y + 10) * (1 - cityUp)); B.building(ctx, x, y, w, WIN.y1 - y + 20, t, { seed: sd, lit: lerp(.25, 1.0, smooth(span(t, a.feel - .5, a.feel + .6))), warm: .3, cols: Math.max(2, Math.round(w / 26)), rows: 12, ww: .5 }); ctx.restore(); }
      ctx.restore();
    }
    if (wall > 0) {
      const e = 1400 * wall;
      ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0 - e, WIN.y0 - e, WIN.x1 - WIN.x0 + 2 * e, WIN.y1 - WIN.y0 + 2 * e); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); ctx.clip('evenodd');
      ctx.fillStyle = lin(ctx, 0, 0, W, 0, [[0, P.night0], [.5, P.night1], [1, P.night0]]); ctx.fillRect(-2000, -2000, 6000, COUNTER + 2000);
      ctx.restore();
    }
    if (fr > 0) K.trailSpan(ctx, frame, 0, fr, { w: 3, spark: fr < 1 });
  }
  function kitchenFront(ctx, t) {
    if (t < tK1 - .2) return;
    // the small hourglass rises from behind the counter's edge (3.06); the last drop arcs over and becomes a grain
    const hr = sineIO(span(t, a.think - .6, a.think + .6));
    if (hr > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, COUNTER - 1 + 4000); ctx.clip();
      const pulse = Math.exp(-Math.max(0, t - (a.truly + .9)) / .5) * (t > a.truly + .9 ? 1 : 0);
      const g = K.hourglass(ctx, HGS.x, COUNTER - 2 + (1 - hr) * (HGS.h + 30), HGS.h, t, { top: .7, bot: .3, flow: smooth(span(t, a.truly + .9, a.truly + 1.6)), glow: .9 + .5 * pulse });
      ctx.restore();
      if (pulse > .02) halo(ctx, g.neck[0], g.neck[1], 120, .5 * pulse, P.halo0, P.core0);
    }
    // you (3.05): walk in from the right, hold a glass under the tap, water runs; then you turn to the hourglass
    const wIn = span(t, tK1 - .1, a.zero + .1), x = lerp(2150, DU.x, sineIO(wIn)), yF = COUNTER + 380;
    const lift = sineIO(span(t, a.zero - .1, a.zero + .35)) * (1 - sineIO(span(t, a.truly - .9, a.truly - .3)));
    const look = lerp(.1, -.35, sineIO(span(t, a.missing - .6, a.missing + .6)));
    const hd = E.du(ctx, x, yF, DU.h, { dir: -1, light: -1, walk: wIn < 1 ? x / (DU.h * .9) * Math.PI * 2 : undefined, look, armR: [lerp(.15, 1.3, lift), lerp(.08, 1.45, lift)], armL: [-.15, -.08] });
    if (lift > .02) {
      const [hx, hy] = hd.R, gw = 46, gh = 70;
      ctx.save(); ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(hx - gw / 2, hy - gh + 20); ctx.lineTo(hx - gw / 2 + 4, hy + 20); ctx.lineTo(hx + gw / 2 - 4, hy + 20); ctx.lineTo(hx + gw / 2, hy - gh + 20); ctx.stroke();
      const fill = span(t, a.zero + .3, a.think + .3); ctx.fillStyle = rgba(B.SCREEN, .55); ctx.fillRect(hx - gw / 2 + 3, hy + 20 - (gh - 6) * fill, gw - 6, (gh - 6) * fill); ctx.restore();
      const run = t > a.zero + .25 && t < a.think + .35;
      if (run) { ctx.save(); ctx.strokeStyle = rgba(mixHex(B.SCREEN, P.cream, .5), .9); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(KT[0], KT[1]); ctx.lineTo(KT[0], hy + 20 - (gh - 6) * fill); ctx.stroke(); ctx.restore(); halo(ctx, KT[0], hy, 60, .25, B.SCREEN, P.cream); }
    }
    // the last drop
    const dr = span(t, a.truly - .1, a.truly + .9);
    if (dr > 0 && dr < 1) {
      const u = sineIO(dr), top = [HGS.x, COUNTER - 2 - HGS.h * .97];
      const px = lerp(lerp(KT[0], KT[0] - 60, u), lerp(KT[0] - 60, top[0], u), u), py = lerp(lerp(KT[1] + 10, KT[1] - 200, u), lerp(KT[1] - 200, top[1], u), u);
      const col = mixHex(mixHex(B.SCREEN, P.cream, .4), P.core1, smooth(span(u, .4, .9)));
      halo(ctx, px, py, 34, .7, col, P.cream); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, py, 6, 0, 6.29); ctx.fill();
    }
    // `0 HOURS`
    B.line(ctx, '0', 1560, 330, B.inOut(t, a.zero - .05, a.truly - .4), { size: 170, serif: true });
    B.line(ctx, 'HOURS', 1566, 412, B.inOut(t, a.zero + .25, a.truly - .4, 1), { size: 56 });
  }

  // ---------------------------------------------------------------- 4.01 (c04): the thread bends out of the glass and draws the washer
  // S = the glass's sand pile on screen. The washer is drawn in the board's frame (board.applyView), so the iris starts on equal pixels.
  const wl = WASH.x - WASH.w / 2, wr = WASH.x + WASH.w / 2, wt = WASH.y - WASH.h / 2, wb = WASH.y + WASH.h / 2;
  function bend(ctx, t, S) {
    if (t < a.else - .2) return;
    const v = board.view(t), C = board.toS(v, wr, wb, t);
    const pts = [S]; for (let i = 1; i <= 24; i++) { const u = i / 24; pts.push([lerp(lerp(S[0], S[0] - 160, u), lerp(S[0] - 160, C[0], u), u), lerp(lerp(S[1], S[1] + 230, u), lerp(S[1] + 230, C[1], u), u)]); }
    const u1 = sineIO(span(t, a.else - .15, a.washing - .3));
    K.trailSpan(ctx, pts, 0, u1, { w: 3, spark: u1 < 1 });
    if (t < a.washing - .35) return;
    ctx.save(); board.applyView(ctx, t);
    const body = [[wr, wb], [wl, wb], [wl, wt], [wr, wt], [wr, wb]], ub = sineIO(span(t, a.washing - .35, a.washing + .3));
    K.trailSpan(ctx, body, 0, ub, { w: 3, spark: ub < 1 });
    const us = sineIO(span(t, a.washing + .25, a.washing + .6));
    if (us > 0) { K.trailSpan(ctx, [[wl, wt + 50], [wr, wt + 50]], 0, us, { w: 2.4, spark: false }); K.trailSpan(ctx, Array.from({ length: 21 }, (_, i) => [wr - 32 + 10 * Math.cos(i / 20 * 6.283), wt + 25 + 10 * Math.sin(i / 20 * 6.283)]), 0, us, { w: 2, spark: false }); }
    drumIcon(ctx, WASH.px, WASH.py, WASH.r, t, smooth(span(t, a.washing + .0, a.washing + .55)));
    ctx.restore();
  }
  // 4.02: the porthole's ring runs outwards as a wave; inside it the board (identical function, same t)
  function iris(ctx, t) {
    if (t < board.tI0) return;
    const R = board.iris(t), v = board.view(t), [cx, cy] = board.toS(v, WASH.px, WASH.py, t);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.clip(); board.draw(ctx, t); ctx.restore();
    const ea = 1 - span(R, 300, 1650);
    if (ea > 0 && R > WASH.r + 2) K.trailSpan(ctx, Array.from({ length: 97 }, (_, i) => [cx + R * Math.cos(i / 96 * 6.2832), cy + R * Math.sin(i / 96 * 6.2832)]), 0, 1, { w: 3 * (1 + R / 600), a: ea, spark: false });
  }

  function draw(ctx, t) {
    B.sky(ctx, null, t);
    if (t < LINE_T) { drawLine(ctx); return; }
    const o = outer(t);
    ctx.save(); breathe(ctx, t); apply(ctx, o);
    // the plain, under its own push (the tap → your kitchen tap)
    const pk = plainK(t);
    if (t < tK1 + .6) { ctx.save(); ctx.translate(lerp(TAP[0], KT[0], sineIO(span(t, tK0, tK1))), lerp(TAP[1], KT[1], sineIO(span(t, tK0, tK1)))); ctx.scale(pk, pk); ctx.translate(-TAP[0], -TAP[1]); plain(ctx, t); ctx.restore(); }
    else { ctx.save(); ctx.translate(KT[0], KT[1]); ctx.scale(KP, KP); ctx.translate(-TAP[0], -TAP[1]); plainKeep(ctx, t); ctx.restore(); }
    kitchen(ctx, t);
    kitchenFront(ctx, t);
    const m = ctx.getTransform(), px = HGS.x, py = COUNTER - 2 - HGS.h * .2, S = [m.a * px + m.c * py + m.e, m.b * px + m.d * py + m.f];
    ctx.restore();
    bend(ctx, t, S);
    iris(ctx, t);
  }
  // what stays of the plain inside the kitchen: the ground (the counter front), the pipe (its gold edge) and the tap
  function plainKeep(ctx, t) {
    ctx.fillStyle = lin(ctx, 0, HZ, 0, HZ + 420, [[0, P.ind1], [.25, P.night1], [1, P.night0]]); ctx.fillRect(-2000, HZ, 6000, 1400);
    K.trailSpan(ctx, [[-2400, HZ], [W + 2400, HZ]], 0, 1, { w: 1.3, spark: false });
    K.trailSpan(ctx, [[-120, HZ + 4], [TAP[0] - 30, HZ + 4]], 0, 1, { w: 2.6, spark: false });
    tap(ctx, TAP[0], TAP[1], GS, 1, t);
  }
  return { draw, a, LINE_T, outer, HGC, HK, board };
}
