// Film 13 · c09 (B3) · "Public money can come with open doors" → "still on paper" · one take, four places, carried:
//   A  (→ "Last year")      B2's plateDoor (closed duct door) continues its push. The stamp PUBLIC MONEY lands, the padlock falls, the
//                           door swings open; light from below. Other providers' lines run in from both sides, through the door, down the
//                           shaft into the city's conduit (seen end-on: a ring of coloured fibres). Pull-back: the door is in a low
//                           building on a Stockholm quay at blue hour (★ STOKAB · ABOUT 100 PROVIDERS). You walk up. The door swings
//                           shut by itself; you catch it ("own a piece").
//   A' (→ "Some countries") crane down into the conduit: its fibres become the dies of a wafer. A civic building PUBLIC rises; coins go
//                           in (chip subsidies), a 10 % wedge goes to PUBLIC (Intel). Neutral.
//   B  (→ "Europe")         the wafer rises and warms into the sun over an Alpine valley; the public hall ALPS · CSCS; the file APERTUS
//                           leaves it and copies itself to laptops on the slopes. The sun sets; the laptops slide down as boats onto a
//                           pool of chips (INDIAAI COMPUTE).
//   C  (→ c10)              the chip tiles rise into the night and form Europe as a dot map; seven planned hubs; they turn to
//                           blueprints ("still on paper"); one blueprint lifts, flies at the camera and FLIPS: its back is the 1932
//                           newspaper (seam plate with c10, lib/b3_common.mjs sheet*).
import { Path2D } from '@napi-rs/canvas';
import * as S from './bubble_seams.mjs';
import { E, K, B, rise, ramp, sramp, herm, bump, label, PUSH, zoomAt, europeDots, HUBS, HUB_SHEET, sheetDraw, sheetState, EUMAP, SHEET_LIFT } from './b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, prng, halo, dust, card, cam3, camAt, camDrift, aim, project, F0 } = E;
const { COL } = B;

// ------------------------------------------------------------------------------------------------ world A layout (design, F0)
const D = S.DOOR, DW = D.x1 - D.x0, DH = D.y1 - D.y0, STREET = 846;
const CON = { x: 960, y: 1450, r: 230 };                 // the conduit (end-on) = the wafer later
const SHAFT = { x0: 905, x1: 1015 };
const DU = { x: 1182, h: 380 };
const RIV = (() => { const r = prng(1409), a = []; for (let i = 0; i < 16; i++) a.push([r(), r()]); return a; })();
const PROV = ['#cfd8f0', '#8f9cc8', '#9db095', '#efe5c6', '#6f8fd8', '#d8caa3', '#b9c7e8', '#7fa89a', '#e7d19a', '#a7b4dc', '#c9b8e8', '#9fc3c9', '#d6b48c', '#8fb0e0'];
// provider lines: from far left / right along the street, into the doorway, down the shaft, into a fibre of the conduit
const FIB = (() => {   // ~100 fibres inside the conduit (sunflower spiral), the first 14 are the animated lines' ends
  const out = [], n = 100, ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) { const r = CON.r * .86 * Math.sqrt((i + .5) / n), q = i * ga; out.push([CON.x + r * Math.cos(q), CON.y + r * Math.sin(q), PROV[i % PROV.length]]); }
  return out;
})();
const LINES = PROV.map((col, i) => {
  const left = i % 2 === 0, lane = STREET - 8 - (i % 7) * 7, sx = left ? -950 - i * 30 : 2870 + i * 30;
  const dx = left ? D.x0 + 40 + (i % 7) * 10 : D.x1 - 40 - (i % 7) * 10, shx = lerp(SHAFT.x0 + 12, SHAFT.x1 - 12, ((i * 5) % 14) / 13);
  // the line ends at the fibre whose angle best matches its side
  const end = FIB[[3, 8, 11, 16, 21, 24, 29, 32, 37, 40, 45, 50, 53, 58][i]];
  const pts = E.catmull([[sx, lane, 4], [dx, lane, 4], [shx, lane + 30, 4], [shx, CON.y - CON.r - 10, 4], [lerp(shx, end[0], .6), lerp(CON.y - CON.r, end[1], .5), 4], [end[0], end[1], 4]], 10).map((p) => [p[0], p[1]]);
  return { col, pts, end, left };
});
// wafer dies: a grid inside the wafer; the k-th fibre becomes the nearest die
const DIES = (() => {
  const s = 44, out = [];
  for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const x = CON.x + i * s, y = CON.y + j * s; if (Math.hypot(Math.abs(i * s) + s / 2, Math.abs(j * s) + s / 2) < CON.r * .97) out.push([x, y]); }
  return out;
})();
const FIB2DIE = FIB.map(([x, y]) => { let b = 0, bd = 1e9; DIES.forEach(([dx, dy], k) => { const d = Math.hypot(dx - x, dy - y); if (d < bd) { bd = d; b = k; } }); return b; });
const WEDGE = { a0: -Math.PI * .1, a1: Math.PI * .1 };
const PUB = { x: 1500, y: 1560, w: 240 };
const W_BODY = (() => { const p = new Path2D(); p.arc(CON.x, CON.y, CON.r, WEDGE.a1, WEDGE.a0 + Math.PI * 2); p.lineTo(CON.x, CON.y); p.closePath(); return p; })();
const W_FULL = (() => { const p = new Path2D(); p.arc(CON.x, CON.y, CON.r, 0, 6.29); return p; })();                   // the civic building PUBLIC (design, F0)

// ------------------------------------------------------------------------------------------------ world B (screen space)
const SUN = { x: 960, y: 318, r: 118 };
const RIDGES = [   // far → near: [points, colour stops, rim alpha, parallax]
  { p: [[-200, 620], [90, 430], [260, 520], [420, 360], [560, 470], [700, 300], [860, 450], [960, 400], [1080, 470], [1240, 330], [1380, 460], [1520, 350], [1700, 480], [1850, 410], [2120, 560]], c: [mixHex(P.blue1, P.ind1, .3), P.ind1], rim: .55, k: .55 },
  { p: [[-200, 760], [200, 560], [380, 650], [560, 600], [760, 700], [960, 780], [1160, 690], [1380, 610], [1560, 660], [1760, 540], [2120, 720]], c: [P.ind1, P.night1], rim: .4, k: .8 },
  { p: [[-200, 1000], [100, 720], [300, 800], [600, 880], [960, 940], [1300, 870], [1600, 780], [1820, 700], [2120, 960]], c: [mixHex(P.ind2, P.night1, .3), P.night0], rim: .3, k: 1 },
];
const HALL = { x: 960, y: 900, w: 330, h: 62 };
const LAPS = (() => { const r = prng(477), a = []; for (let i = 0; i < 18; i++) { const left = i % 2 === 0, x = left ? 160 + r() * 560 : 1200 + r() * 560; const yb = left ? lerp(740, 900, (x - 160) / 560) : lerp(900, 740, (x - 1200) / 560); a.push([x, yb - 20 - r() * 60, r()]); } return a; })();
const POOL = { x: 960, y: 1030, rx: 600, ry: 118 };          // the pool of chips (screen, before the tilt)
const TILES = (() => {   // as many tiles as Europe has dots; laid in the pool ellipse (perspective rows), sorted left → right like the dots
  const n = europeDots().length, out = [], r = prng(4834);
  let rows = 15; const rowsY = [];
  for (let j = 0; j < rows; j++) rowsY.push(j / (rows - 1));
  const per = []; let tot = 0; for (const v of rowsY) { const wv = Math.sqrt(Math.max(.02, 1 - (2 * v - 1) ** 2)); per.push(wv); tot += wv; }
  rowsY.forEach((v, j) => {
    const m = Math.round(per[j] / tot * n), half = Math.sqrt(Math.max(.02, 1 - (2 * v - 1) ** 2));
    for (let i = 0; i < m; i++) { const u = m > 1 ? (i / (m - 1)) * 2 - 1 : 0; out.push([u * half * .94, (2 * v - 1) * .9, r() * 6.3]); }
  });
  while (out.length > n) out.pop();
  while (out.length < n) out.push([r() * 1.6 - .8, r() * 1.4 - .7, r() * 6.3]);
  out.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return out;
})();
const BOATS = [[-.62, .1], [-.3, -.4], [.05, .25], [.35, -.2], [.6, .3]];

export function make(T, R) {
  E.prepareEditorial();
  const at = T.seq(R.a), a = {};
  a.T0 = R.a; a.open = at('open doors'); a.nine = at('two thousand and nine'); a.netw = at('Networks built'); a.other = at('other providers in');
  a.stock = at('Stockholm went further'); a.city = at('The city has owned'); a.decades = at('three decades'); a.comers = at('all comers');
  a.butw = at('But what if a door'); a.closes = at('closes again'); a.helps = at('Then it helps'); a.own = at('own a piece');
  a.last = at('Last year'); a.chip = at('chip subsidies'); a.ten = at('ten percent'); a.intel = at('Intel'); a.publicG = at('The public got'); a.paid = at('what it paid for');
  a.some = at('Some countries lay'); a.rails = at('public rails'); a.swiss = at('Switzerland'); a.open2 = at('open model'); a.apertus = at('Apertus'); a.supc = at('public supercomputer');
  a.india = at('India runs'); a.pool = at('shared pool'); a.startups = at('start-ups'); a.europe = at('Europe is planning'); a.hubs = at('giant computing hubs'); a.pubpriv = at('public and private');
  a.early = at("They're early"); a.paperW = at('still on paper'); a.T1 = R.b;
  const tPlate = a.T0 + S.SEAM_HALF;

  // ================================================================ camera A (F0)
  const lnZ = (t) => herm(t, tPlate, tPlate + 2.6, PUSH, PUSH + .065, PUSH, 0);   // continues the plate's 5 %/s, eases out
  const zoomCam = (t) => aim(F0, 960, 540, Math.exp(lnZ(t)));
  const tK0 = a.netw - .2;
  const KA = [
    [tK0, zoomCam(tK0)],
    [a.stock + 1.5, aim(F0, 960, 640, .36, 960, 560)],               // the long pull-back: lines in, down the shaft, out to the city
    [a.butw - .1, aim(F0, 975, 650, .385, 960, 560)],               // breathing hold on the wide (the ★)
    [a.helps + .3, aim(F0, 1000, 650, .74, 960, 560)],               // closer: the door closing, your hand
    [a.own + .55, aim(F0, 1004, 652, .76, 960, 560)],
    [a.last + 1.9, aim(F0, CON.x, CON.y, 1.05, 720, 520), 'q'],      // crane down into the conduit → the wafer
    [a.some - .4, aim(F0, CON.x + 8, CON.y + 4, 1.08, 720, 520)],
  ];
  const camA = (t) => {
    const c = t < tK0 ? zoomCam(t) : camAt(t, KA);
    return camDrift(c, t, .6 * ramp(t, tPlate, tPlate + 2.5), 3);
  };

  // ================================================================ timing A
  const tSt0 = Math.max(a.open - 1.05, tPlate), tHit = a.open, tLift = a.open + .32;   // the stamp (enters from above the frame once the plate is over)
  const tShackle = tHit + .09, tFall = tHit + .22;
  const tSw0 = a.open + .45, tSw1 = a.nine + .25;                         // the door swings open (before "two thousand and nine")
  const tLine0 = a.other - .35;                                           // the providers' lines run in
  const tCasc = a.comers - .2;                                            // the rest of the ~100 fibres light ("rents it to all comers")
  const tWalk0 = a.stock + .3, tWalk1 = a.decades + 1.2;                  // you walk up
  const tClose0 = a.closes - .1, tCatch = a.own + .05;
  const tMorph0 = a.last + .1, tMorph1 = a.last + 1.6;                    // fibres → dies
  const tB = a.some - .25;                                                // world B takes over (wafer rises into the sun)

  // ================================================================ world B / C timing
  const tSun1 = a.rails + .9, tSet0 = a.india - .2, tSet1 = a.startups + .3;
  const tTilt0 = a.india - .3, tTilt1 = a.pool + 1.4;
  const tFly0 = a.europe - .25, tFly1 = a.hubs + .4;                       // tiles rise into the map
  const tC = a.hubs + 2;                                                   // the valley has left the frame

  return (ctx, t) => {
    if (t < tPlate) { S.plateDoor(ctx, t, a.T0); return; }
    if (t < tB) worldA(ctx, t);
    else worldB(ctx, t);
    if (t >= a.T1 - SHEET_LIFT) sheetDraw(ctx, t, a.T1);
  };

  // ================================================================================================ A
  function worldA(ctx, t) {
    const c = camA(t);
    const sw = sineIO(span(t, tSw0, tSw1)), close = smooth(span(t, tClose0, tCatch + .25)) - .08 * Math.exp(-((t - tCatch - .3) ** 2) / .02) * 0;
    const ang = sw * 1.22 - close * .5;                                     // open angle (rad): opens to 70°, swings back to ~41°, caught
    const light = smooth(span(t, tSw0 - .05, tSw0 + .9)) * (1 - .35 * smooth(span(t, tClose0, tCatch))) * (1 - smooth(span(t, tMorph0 + .3, tMorph1)));
    const wide = smooth(span(t, a.netw, a.stock));
    // sky + skyline + water (behind the low building)
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.45, P.night1], [.8, P.ind1], [1, mixHex(P.blue0, P.ind1, .4)]], -2600, 300);
      ctx.fillStyle = rad(ctx, 600, 260, 1600, [[0, rgba(P.shade1, .22)], [.4, rgba(P.blue0, .14)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-W * 2, -H * 3, W * 5, H * 5);
      E.stars(ctx, 991, 120, t, [-1400, -2600, W + 2800, 2500], .5);
    });
    card(ctx, c, 9000, () => skyline(ctx, t));
    card(ctx, c, F0, () => {
      building(ctx, t, ang, light);
      underground(ctx, t, light);
      providers(ctx, t, light);
      you(ctx, t, ang);
      stamp(ctx, t);
      lock(ctx, t);
      wafer(ctx, t);
    });
    // labels (screen space)
    const u1 = rise(span(t, a.nine - .1, a.nine + .9)) , o1 = span(t, a.stock - 1, a.stock - .2);
    if (u1 > 0 && o1 < 1) label(ctx, [['US BROADBAND STIMULUS · 2009 · OPEN ACCESS']], 120, 150, u1, { out: o1 });
    const u2 = span(t, a.city + .2, a.city + 1.2), o2 = span(t, a.butw + .3, a.butw + 1);
    if (u2 > 0 && o2 < 1) label(ctx, [['STOKAB · CITY-OWNED SINCE 1994'], ['ABOUT 100 PROVIDERS', 34]], 120, 150, u2, { out: o2 });
    const u3 = span(t, a.ten + .25, a.ten + 1.1), o3 = span(t, a.some - 1.2, a.some - .45);
    if (u3 > 0 && o3 < 1) { const p = project(c, F0, PUB.x, PUB.y); K.maskLine(ctx, [['about 10 %', 0]], p[0], 235, 120, rise(u3) * (1 - expoIn(o3)), { align: 'center' }); }
    const u4 = span(t, a.intel - .05, a.intel + .9);
    if (u4 > 0 && o3 < 1) label(ctx, [['US GOVERNMENT · STAKE IN INTEL'], ['AUGUST 2025']], 1080, 800, u4, { out: o3 });
  }

  function skyline(ctx, t) {
    // Stockholm at blue hour: water, the old town, the City Hall tower with its three crowns (design of the 9000 card)
    const base = 250;
    ctx.fillStyle = lin(ctx, 0, base, 0, base + 1400, [[0, mixHex(P.blue0, P.ind1, .55)], [.08, P.ind1], [.5, P.night1], [1, P.night0]]); ctx.fillRect(-3000, base, 9000, 3000);
    // reflections on the water
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 26; i++) { const x = -700 + i * 130 + 30 * Math.sin(i * 7.1), y = base + 18 + (i % 5) * 22, w = 40 + 30 * Math.abs(Math.sin(i * 3.3)) + 8 * Math.sin(t * 1.3 + i); ctx.fillStyle = rgba(i % 3 ? P.halo1 : P.blue0, .22 + .08 * Math.sin(t * 2.1 + i * 1.7)); ctx.fillRect(x, y, w, 2.5); }
    ctx.restore();
    const sil = new Path2D();
    sil.moveTo(-1400, base);
    const roofs = [[-1400, 210], [-1100, 190], [-900, 214], [-700, 176], [-540, 200], [-300, 168], [-150, 196], [60, 182], [260, 204], [440, 186], [700, 200], [900, 170], [1150, 196], [1500, 184], [1750, 206], [2050, 176], [2300, 198], [2700, 190], [3300, 210]];
    for (const [x, y] of roofs) { sil.lineTo(x, y); sil.lineTo(x + 140, y); }
    sil.lineTo(3400, base); sil.closePath();
    // the City Hall tower (square, lantern, spire with three crowns), left of centre; a church spire right
    const tw = new Path2D(); tw.rect(-210, 40, 54, 160); tw.rect(-200, 14, 34, 28); tw.moveTo(-190, 14); tw.lineTo(-183, -40); tw.lineTo(-176, 14); tw.closePath();
    const sp = new Path2D(); sp.rect(1260, 120, 30, 80); sp.moveTo(1256, 122); sp.lineTo(1275, 0); sp.lineTo(1294, 122); sp.closePath();
    const sp2 = new Path2D(); sp2.rect(380, 130, 36, 70); sp2.moveTo(376, 132); sp2.lineTo(398, 60); sp2.lineTo(420, 132); sp2.closePath();
    ctx.fillStyle = lin(ctx, 0, -40, 0, base, [[0, mixHex(P.ind2, P.blue1, .35)], [1, P.night1]]);
    ctx.fill(sil); ctx.fill(tw); ctx.fill(sp); ctx.fill(sp2);
    ctx.fillStyle = rgba(P.halo0, .85); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-183, -44 - i * 9, 3, 0, 6.29); ctx.fill(); }   // the three crowns
    halo(ctx, -183, -50, 30, .25, P.halo1, P.core1);
    // windows (warm, few)
    const r = prng(77); ctx.fillStyle = rgba(P.halo0, .7);
    for (let i = 0; i < 60; i++) { const x = -1300 + r() * 4500, y = 200 + r() * 40; if (r() < .55) ctx.fillRect(x, y, 4, 5); }
  }

  function building(ctx, t, ang, light) {
    // EXACTLY lib/bubble_seams.mjs plateDoor (same calls, same order) in design coords, extended beyond the frame, then the opening
    const { x0, x1, y0, y1 } = D, w = DW, h = DH, br = .94 + .06 * Math.sin(t * 1.3);
    const shape = new Path2D(); shape.rect(-10, 0, 1940, STREET + 2); shape.rect(-3000, STREET, 9000, 4000);
    ctx.save(); ctx.clip(shape);
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.7, P.night1], [1, P.night0]]); ctx.fillRect(-3000, -10, 9000, 6000);
    ctx.fillStyle = rad(ctx, (x0 + x1) / 2, y0 - 60, 820, [[0, rgba(P.halo1, .4 * br)], [.4, rgba(P.shade0, .16 * br)], [1, rgba(P.night0, 0)]]); ctx.fillRect(-3000, -10, 9000, 6000);
    ctx.restore();
    // roof edge (lit by the sky) and the street edge (lit by the door light)
    ctx.fillStyle = rgba(P.blue0, .6); ctx.fillRect(-10, 0, 1940, 3);
    if (light > 0) {
      ctx.fillStyle = rgba(P.halo1, .5 * light); ctx.fillRect(-3000, STREET, 9000, 2);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.lightPool(ctx, x0 + 10, x1 - 10, STREET + 2, 220, 150, .55 * light); ctx.restore();
    }
    ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(x0 - 26, y0 - 26, w + 52, h + 40);
    // the opening: warm light from the shaft below (THE light once the door is open)
    if (ang > 0) {
      ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.halo1, P.shade0, .55)], [.6, P.halo0], [1, P.core0]]);
      ctx.globalAlpha = clamp(light * 1.2); ctx.fillRect(x0, y0, w, h); ctx.globalAlpha = 1;
      ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, P.night0], [1, mixHex(P.ind1, P.shade0, .3)]]); ctx.globalAlpha = 1 - clamp(light * 1.2); ctx.fillRect(x0, y0, w, h); ctx.globalAlpha = 1;
      halo(ctx, (x0 + x1) / 2, y1 - 40, 520, .32 * light, P.halo1, P.core1);
    }
    // the leaf (hinged left, opens toward us: foreshortened by cos)
    const ca = Math.cos(ang), jolt = 2.2 * Math.exp(-(((t - tHit) * 9) ** 2)) * Math.sin((t - tHit) * 70);
    ctx.save(); ctx.translate(x0, jolt); ctx.scale(Math.max(.05, ca), 1); ctx.translate(-x0, 0);
    ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.ind1, P.shade1, .25)], [.3, P.ind1], [1, P.ind0]]); ctx.fillRect(x0, y0, w, h);
    if (ang > 0) { ctx.fillStyle = rgba(P.night0, .45 * smooth(clamp(ang / 1.2))); ctx.fillRect(x0, y0, w, h); }
    ctx.fillStyle = rgba(P.halo1, .5 * br); ctx.fillRect(x0, y0, w, 3);
    ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x0 + 24, y0 + 30, w - 48, 4); ctx.fillRect(x0 + 24, y1 - 40, w - 48, 4);
    for (const [u, v] of RIV) { ctx.fillStyle = rgba(P.halo1, .25); ctx.beginPath(); ctx.arc(x0 + 14 + u * (w - 28), v < .5 ? y0 + 14 : y1 - 14, 3, 0, 6.29); ctx.fill(); }
    const hx = x1 - 70, hy = (y0 + y1) / 2;
    ctx.fillStyle = mixHex(P.shade0, P.ind1, .4); ctx.fillRect(hx - 8, hy - 50, 16, 100);
    // the imprint PUBLIC MONEY (gold ink on the steel), revealed as the stamp lifts
    const im = smooth(span(t, tHit, tHit + .06));
    if (im > 0) {
      ctx.save(); ctx.globalAlpha = im;
      ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(960 - 150, 410 - 70, 300, 146, 14); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(960 - 138, 410 - 58, 276, 122, 9); ctx.stroke();
      E.glowText(ctx, 'PUBLIC', 960, 400, { size: 58, align: 'center', col: P.halo0, glow: true, weight: 600 });
      E.glowText(ctx, 'MONEY', 960, 462, { size: 58, align: 'center', col: P.halo0, glow: true, weight: 600 });
      ctx.restore();
    }
    ctx.restore();
    // the plate's motes in the lamp light
    dust(ctx, 1411, 60, (x0 + x1) / 2, y0 + 120, 320, 160, t * .3, .3, P.halo0);
    // the impact: a puff of dust off the door
    const puff = Math.exp(-(((t - tHit - .15) * 2.5) ** 2));
    if (puff > .03) dust(ctx, 2209, 90, 960, 410, 200 + 120 * span(t, tHit, tHit + .8), 100 + 50 * span(t, tHit, tHit + .8), t, .55 * puff, P.halo2);
  }

  function lock(ctx, t) {
    // shackle + body of the plate's padlock: the shackle springs open after the stamp, the lock falls (gravity) out of the frame
    const { x1, y0, y1 } = D, hx = x1 - 70, hy = (y0 + y1) / 2, br = .94 + .06 * Math.sin(t * 1.3);
    const f = Math.max(0, t - tFall), dy = 2600 * f * f, rot = 1.4 * f * f + .9 * f, sh = smooth(span(t, tShackle, tShackle + .12)) * .55;
    if (dy > 900) return;
    ctx.save(); ctx.translate(hx, hy + 52 + dy); ctx.rotate(rot);
    ctx.strokeStyle = rgba(P.halo1, .8 * br); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(sh * 22, 0, 22, Math.PI + sh, sh); ctx.stroke();
    ctx.fillStyle = lin(ctx, -32, 0, 32, 52, [[0, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.roundRect(-32, 0, 64, 54, 8); ctx.fill();
    ctx.fillStyle = rgba(P.night0, .7); ctx.beginPath(); ctx.arc(0, 22, 6, 0, 6.29); ctx.fill(); ctx.fillRect(-2, 24, 4, 14);
    ctx.restore();
  }

  function stamp(ctx, t) {
    if (t < tSt0 || t > tLift + 1.2) return;
    // the rubber stamp comes down from above, hovers, presses (on "open doors"), lifts away up out of the frame
    const yb = 410 + 76;                                                   // bottom face of the block at contact
    let y;
    if (t < tHit - .16) y = lerp(-520, -70, expoOut(span(t, tSt0, tHit - .16)));      // in, decelerating, hover above
    else if (t < tHit) y = lerp(-70, 0, expoIn(span(t, tHit - .16, tHit)));          // the press
    else if (t < tLift) y = 0;
    else y = lerp(0, -900, expoIn(span(t, tLift, tLift + .75)));
    const sq = t >= tHit && t < tHit + .1 ? .04 * Math.sin(span(t, tHit, tHit + .1) * Math.PI) : 0;
    ctx.save(); ctx.translate(960, yb + y);
    ctx.fillStyle = rgba(P.night0, .35 * smooth(clamp(1 + y / 400))); ctx.filter = 'blur(10px)'; ctx.fillRect(-150, -12, 300, 30); ctx.filter = 'none';   // its shadow on the door
    ctx.scale(1 + sq, 1 - sq);
    ctx.fillStyle = lin(ctx, 0, -150, 0, 0, [[0, mixHex(P.ind2, P.blue1, .3)], [1, mixHex(P.ind2, P.night0, .3)]]); ctx.beginPath(); ctx.roundRect(-158, -150, 316, 150, 8); ctx.fill();   // the block (= the imprint)
    ctx.fillStyle = rgba(P.halo0, .9); ctx.fillRect(-160, -6, 320, 6);                                                          // the inked face (gold)
    ctx.fillStyle = lin(ctx, -26, 0, 26, 0, [[0, P.shade0], [.5, mixHex(P.shade0, P.halo1, .5)], [1, mixHex(P.shade0, P.night1, .5)]]);
    ctx.fillRect(-30, -260, 60, 112); ctx.beginPath(); ctx.ellipse(0, -282, 74, 44, 0, 0, 6.29); ctx.fill();                   // handle + knob (wood)
    ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(-158, -150, 316, 3);
    ctx.restore();
  }

  function underground(ctx, t, light) {
    // the street's cut-away: shaft and conduit appear in the light that comes from below once the door is open
    const k = light * (.2 + .8 * smooth(span(t, a.netw, a.other + 1))), cool = smooth(span(t, tMorph0, tMorph1));
    if (k <= .05) return;
    ctx.save();
    // the shaft
    ctx.fillStyle = lin(ctx, 0, STREET, 0, CON.y - CON.r, [[0, rgba(P.halo1, .55 * k)], [1, rgba(P.halo0, .8 * k)]]); ctx.fillRect(SHAFT.x0, STREET + 2, SHAFT.x1 - SHAFT.x0, CON.y - CON.r - STREET + 10);
    ctx.strokeStyle = rgba(P.halo1, .45 * k); ctx.lineWidth = 2; ctx.strokeRect(SHAFT.x0, STREET + 2, SHAFT.x1 - SHAFT.x0, CON.y - CON.r - STREET + 10);
    // the cut line of the street (a cross-section)
    ctx.fillStyle = rgba(P.blue0, .35 * k * (1 - cool)); ctx.fillRect(-1600, STREET + 46, 5200, 2);
    ctx.restore();
  }

  function providers(ctx, t, light) {
    const morph = smooth(span(t, tMorph0, tMorph1));
    if (morph >= 1) return;
    // the conduit: a ring of light (city-owned), the fibres inside
    if (light > .01 || t > tLine0) {
      const k = Math.max(light, .6 * smooth(span(t, tLine0, tLine0 + 1)));
      ctx.save(); ctx.globalAlpha = 1 - morph;
      ctx.fillStyle = rad(ctx, CON.x, CON.y - 60, CON.r * 1.2, [[0, rgba(P.ind1, .95)], [1, rgba(P.night0, .95)]]); ctx.beginPath(); ctx.arc(CON.x, CON.y, CON.r, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.halo0, .85 * k); ctx.lineWidth = 7; ctx.stroke();
      halo(ctx, CON.x, CON.y, CON.r * 1.6, .14 * k, P.halo1, P.halo0);
      ctx.restore();
    }
    // the providers' lines (each arrives on its own, from the left or the right), then the rest of the fibres light up
    LINES.forEach((L, i) => {
      const t0 = tLine0 + i * .13, u = sineIO(span(t, t0, t0 + 2.6));
      if (u <= 0) return;
      const head = B.inkLine(ctx, L.pts, u, { col: L.col, w: 3.2, glow: .22, a: .85 * (1 - morph) });
      if (head && u < 1) { ctx.save(); ctx.translate(head[0], head[1]); ctx.fillStyle = L.col; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 6.29); ctx.fill(); ctx.restore(); halo(ctx, head[0], head[1], 40, .45, L.col, P.cream); }
    });
    FIB.forEach(([x, y, col], i) => {
      const li = LINES.findIndex((L) => L.end[0] === x && L.end[1] === y);
      const on = li >= 0 ? smooth(span(t, tLine0 + li * .13 + 2.4, tLine0 + li * .13 + 2.7)) : smooth(span(t, tCasc + (i % 37) * .03, tCasc + .3 + (i % 37) * .03));
      if (on <= 0 && morph <= 0) return;
      const [dx, dy] = DIES[FIB2DIE[i]], mx = lerp(x, dx, morph), my = lerp(y, dy, morph);
      ctx.fillStyle = mixHex(P.ind2, col, on); ctx.globalAlpha = .3 + .7 * on; ctx.beginPath(); ctx.arc(mx, my, 9, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1;
    });
  }

  // the wafer's face (design coords of world A, centre CON); world B draws the same face scaled to its screen position (no switch pop)
  function wedgePath(cx, cy, r) { const p = new Path2D(); p.moveTo(cx, cy); p.arc(cx, cy, r, WEDGE.a0, WEDGE.a1); p.closePath(); return p; }
  function wedgeE(t) { return sineIO(span(t, a.ten - .05, a.ten + 1.25)) * (1 - sineIO(span(t, a.paid + .3, a.paid + 1.15))); }   // out to PUBLIC, and back home
  function wedgeGlow(t) { return smooth(span(t, a.paid - .2, a.paid + .6)); }
  function waferFace(ctx, t, gap) {
    const fillW = (p) => { ctx.fillStyle = lin(ctx, CON.x - CON.r, CON.y - CON.r, CON.x + CON.r, CON.y + CON.r, [[0, mixHex(COL.cool2, COL.cool, .4)], [.5, mixHex(COL.coolDeep, COL.cool2, .6)], [1, mixHex(COL.coolDeep, P.ind1, .4)]]); ctx.fill(p); };
    const shape = gap ? W_BODY : W_FULL;   // (built once, module level)
    fillW(shape);
    ctx.save(); ctx.clip(shape);
    for (const [x, y] of DIES) { ctx.fillStyle = rgba(P.night0, .18); ctx.fillRect(x - 19, y - 19, 38, 38); ctx.strokeStyle = rgba(COL.cool, .4); ctx.lineWidth = 1.5; ctx.strokeRect(x - 19, y - 19, 38, 38); }
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, CON.x - CON.r, CON.y - CON.r, CON.x + CON.r, CON.y + CON.r, [[0, rgba(P.blue0, 0)], [.45, rgba('#9fd0e0', .16 + .05 * Math.sin(t * .7))], [.55, rgba('#d0b0e0', .14)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(CON.x - CON.r, CON.y - CON.r, CON.r * 2, CON.r * 2);
    ctx.restore();
    ctx.strokeStyle = rgba(COL.cool, .7); ctx.lineWidth = 3; ctx.stroke(shape);
  }
  // the 10 % wedge at blend e (0 = home in the wafer, 1 = at PUBLIC), glowing gold once the public has its share
  function wedge(ctx, t, e) {
    const g = wedgeGlow(t);
    const cx = lerp(CON.x + 6, PUB.x, e), cy = lerp(CON.y, PUB.y - 270, e) - 90 * Math.sin(Math.PI * e), r = lerp(CON.r, CON.r * .62, e);
    const p = wedgePath(cx - r * .55 * clamp(e * 4), cy, r);
    ctx.fillStyle = rad(ctx, cx - r * .2, cy, r, [[0, mixHex(COL.cool, P.halo0, g)], [1, mixHex(COL.coolDeep, P.shade0, g)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(mixHex(COL.cool, P.halo0, g), .9); ctx.lineWidth = 3; ctx.stroke(p);
    if (g > 0) halo(ctx, cx + r * .3, cy, r * (1.4 - .6 * (1 - e)), .3 * g, P.halo1, P.halo0);
  }

  function wafer(ctx, t) {
    const m = smooth(span(t, tMorph0, tMorph1)); if (m <= 0) return;
    const e = wedgeE(t), out = e > .001 || (t > a.ten && t < a.paid + 1.15);
    ctx.save(); ctx.globalAlpha = m; waferFace(ctx, t, out); ctx.restore();
    // the civic building rises from its baseline (chip subsidies); coins arc from it into the wafer
    const pb = rise(span(t, a.chip - .55, a.chip + .45)) * (1 - E.expoIn(span(t, tB - 1.2, tB - .35)));
    if (pb > 0) civic(ctx, PUB.x, PUB.y, PUB.w, pb, t, wedgeGlow(t));
    for (let i = 0; i < 4; i++) {
      const t0 = a.chip + .2 + i * .32, u = span(t, t0, t0 + .85); if (u <= 0 || u >= 1) continue;
      const ee = sineIO(u), x = lerp(PUB.x - 60, CON.x + 120, ee), y = lerp(PUB.y - 60, CON.y - 40, ee) - 190 * Math.sin(Math.PI * ee);
      B.coin(ctx, x, y, 17, { lit: .6 });
    }
    if (out) wedge(ctx, t, e);
    else if (t > a.paid) wedge(ctx, t, 0);
  }

  function civic(ctx, x, y, w, u, t, glow) {
    // a civic building (pediment, columns) drawn from light, rising out of its baseline; label PUBLIC on the frieze
    ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - w * 1.2, w * 2, w * 1.2 + 4); ctx.clip();
    ctx.translate(0, (1 - u) * w * .95);
    const p = new Path2D(), hw = w / 2, top = y - w * .78;
    p.moveTo(x - hw - 14, top + 46); p.lineTo(x, top - 8); p.lineTo(x + hw + 14, top + 46); p.closePath();
    p.rect(x - hw - 10, top + 50, w + 20, 16);
    for (let i = 0; i < 5; i++) p.rect(x - hw + 8 + i * (w - 32) / 4, top + 72, 16, y - top - 92);
    p.rect(x - hw - 14, y - 20, w + 28, 20);
    E.lightShape(ctx, p, t, { lit: .55 + .45 * glow, dust: 0, glow: .5 });
    E.glowText(ctx, 'PUBLIC', x, top + 40, { size: 24, align: 'center', col: P.night1, glow: false, weight: 600 });
    ctx.restore();
  }

  function you(ctx, t, ang) {
    if (t < tWalk0) return;
    const wk = span(t, tWalk0, tWalk1), x = lerp(2350, DU.x, sineIO(wk) * .15 + wk * .85 - .15 * Math.sin(Math.PI * wk) * 0);
    const walking = wk < 1, stopK = smooth(span(t, tWalk1 - .5, tWalk1 + .2));
    const reach = smooth(span(t, tCatch - .75, tCatch)), br = .5 + .5 * Math.sin(t * 1.4);
    const edgeX = D.x0 + DW * Math.cos(ang);
    E.castShadow(ctx, x, STREET + 1, 30, 120, Math.PI * .1, .35);
    const o = { dir: -1, look: .1 + .1 * Math.sin(t * .5), light: -1, back: .3 * smooth(span(t, tSw0, tSw1)) };
    if (walking && stopK < 1) Object.assign(o, { walk: t * 5.2, view: 'side' });
    o.armR = [lerp(.15 + .03 * br, 1.62, reach), lerp(.08, 1.9, reach)];
    o.armL = [-.15 - .02 * br, -.07];
    E.du(ctx, x, STREET, DU.h, o);
  }

  // ================================================================================================ B (screen space) + C
  function worldB(ctx, t) {
    const sunU = sineIO(span(t, tB - .2, tSun1));                             // the wafer → the sun
    const ridgeU = sineIO(span(t, tB - .05, tSun1 + .3));
    const set = sineIO(span(t, tSet0, tSet1));
    const tilt = sineIO(span(t, tTilt0, tTilt1));                               // the camera tilts down to the pool (India)
    const up = sineIO(span(t, tFly0 - .2, tC));                                  // then up into the night (Europe)
    const night = smooth(span(t, tSet0, tSet1 + 1.5));
    const push = 1 + .04 * span(t, tB, tSet0);
    const zB = Math.exp(t < a.hubs + .6 ? 0 : t < a.hubs + 2.6 ? herm(t, a.hubs + .6, a.hubs + 2.6, 0, .014, 0, .014) : .014 + .014 * (t - a.hubs - 2.6));   // the map breathes in
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAt(ctx, zB, 1000, 470);
    // sky: night above, dawn low; warms with the sun, darkens when it sets
    const warm = smooth(span(t, tB, tSun1)) * (1 - night);
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.45, mixHex(P.night1, P.ind1, .6 * warm)], [.75, mixHex(P.ind1, P.blue0, .5 * warm)], [1, mixHex(P.ind1, P.shade1, .45 * warm)]]); ctx.fillRect(0, 0, W, H);
    const dawn = smooth(span(t, tB, tB + 1.8));                                    // world A's flat night (under the street) opens into the sky
    if (dawn < 1) { ctx.fillStyle = rgba(P.night0, 1 - dawn); ctx.fillRect(0, 0, W, H); }
    E.stars(ctx, 4741, 130, t, [-60, -40, W + 120, H * .75], (.2 + .5 * night) * dawn);
    ctx.translate(960, 600); ctx.scale(push, push); ctx.translate(-960, -600);
    const dyTilt = -260 * tilt + 1300 * up;                                       // world shift (near layers shift by k ×)
    // the sun (from the wafer)
    // start = where world A's camera shows the wafer right now (same face, same size: no switch)
    const pA = project(camA(t), F0, CON.x, CON.y), k0 = pA[2];
    const toB = (q) => [960 + (q[0] - 960) / push, 600 + (q[1] - 600) / push];   // undo B's push for the start point
    const [ax, ay] = toB(pA), ak = k0 / push;
    const sx = lerp(ax, SUN.x, sunU), sy0 = lerp(ay, SUN.y, sunU), sy = sy0 + set * 470 + dyTilt * .25, sr = lerp(CON.r * ak, SUN.r, sunU);
    if (sunU < 1) {
      // the wafer keeps its silicon face (and its gold share) while it rises, then it is all light
      ctx.save(); ctx.globalAlpha = 1 - smooth(span(sunU, .35, .9));
      ctx.translate(sx, sy); ctx.scale(sr / CON.r, sr / CON.r); ctx.translate(-CON.x, -CON.y);
      waferFace(ctx, t, false); wedge(ctx, t, 0);
      ctx.restore();
    }
    const sunA = smooth(span(sunU, .25, .9));
    if (sunA > 0 && set < .985) E.lightForm(ctx, 'disc', sx - sr, sy - sr, sr * 2, sr * 2, t, { a: sunA, dust: 900, breath: .015, seed: 99 });
    // ridges rise (near ones further), the hall, the laptops
    RIDGES.forEach((Rg, i) => {
      const dy = (1 - ridgeU) * (820 + 260 * i) + dyTilt * Rg.k;
      ctx.save(); ctx.translate(0, dy);
      ridge(ctx, Rg.p, Rg.c, rgba(i ? P.blue0 : P.halo1, Rg.rim * (i ? 1 : .6 + .4 * warm)), i === 0 ? .5 + .4 * warm : 0);
      if (i === 1) hall(ctx, t);
      if (i === 2) { laptops(ctx, t); pool(ctx, t, tilt, up); }
      ctx.restore();
    });
    // the chip tiles rise into the night and become the map of Europe
    ctx.restore();
    if (t > tFly0 - .2) { ctx.save(); zoomAt(ctx, zB, 1000, 470); europe(ctx, t, dyTilt); ctx.restore(); }
    labelsB(ctx, t);
  }

  function ridge(ctx, pts, [c0, c1], rim, snow) {
    // an alpine ridge: straight edges (sharp peaks), a lit rim, snow on the far peaks
    const top = Math.min(...pts.map((q) => q[1])), p = new Path2D();
    p.moveTo(pts[0][0], 2400); pts.forEach(([x, y]) => p.lineTo(x, y)); p.lineTo(pts[pts.length - 1][0], 2400); p.closePath();
    ctx.fillStyle = lin(ctx, 0, top, 0, top + 600, [[0, c0], [1, c1]]); ctx.fill(p);
    ctx.strokeStyle = rim; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    if (snow > 0) for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i]; if (y > pts[i - 1][1] || y > pts[i + 1][1]) continue;
      const l = pts[i - 1], r = pts[i + 1], f = .22, s = new Path2D();
      s.moveTo(x, y); s.lineTo(lerp(x, l[0], f), lerp(y, l[1], f)); s.lineTo(lerp(x, l[0], f * .55), lerp(y, l[1], f * .55) + 14); s.lineTo(x + 6, y + 22); s.lineTo(lerp(x, r[0], f * .5), lerp(y, r[1], f * .5) + 12); s.lineTo(lerp(x, r[0], f), lerp(y, r[1], f)); s.closePath();
      ctx.fillStyle = lin(ctx, x - 60, y, x + 60, y, [[0, rgba(P.halo2, .75 * snow)], [1, rgba(P.blue2, .55 * snow)]]); ctx.fill(s);
    }
  }

  function hall(ctx, t) {
    // the public supercomputer (warm rim: public) on the valley floor; the file APERTUS leaves it
    const lit = smooth(span(t, a.swiss - .4, a.swiss + .6));
    B.dataCenter(ctx, HALL.x - HALL.w / 2, HALL.y - 120, HALL.w, HALL.h, t, { lum: .35 + .6 * lit, rim: .4 + .6 * lit, seed: 9 });
    halo(ctx, HALL.x, HALL.y - 140, 180, .2 * lit, P.halo1, P.halo0);
  }

  function laptops(ctx, t) {
    // APERTUS: a file card leaves the hall; it copies itself to every laptop on the slopes (cloning, staggered by distance)
    const out = expoOut(span(t, a.apertus - .25, a.apertus + .35)), fx = HALL.x, fy = HALL.y - 190 - 50 * out;
    const sink = 1 - smooth(span(t, tSet0 + 1.2, tSet1 + .4));
    if (out > 0 && t < a.india + 1) fileCard(ctx, fx, fy, 64 * (.6 + .4 * out), t, 1 - smooth(span(t, a.india, a.india + .8)));
    LAPS.forEach(([x, y, r], i) => {
      const d = Math.hypot(x - fx, y - fy), t0 = a.apertus + .35 + d / 1400, u = span(t, t0, t0 + .7);
      const on = smooth(span(t, t0 + .55, t0 + .8));
      // the screen of the laptop: cool until the copy lands, then warm
      const slide = smooth(span(t, a.startups - .7 + r * .3, a.startups + .5 + r * .3));
      if (slide >= 1) return;
      ctx.save(); ctx.globalAlpha = (1 - slide) * clamp(sink + .2);
      ctx.fillStyle = mixHex(COL.coolDeep, P.halo0, on); ctx.fillRect(x - 9, y - 12, 18, 12); ctx.fillStyle = P.night0; ctx.fillRect(x - 11, y, 22, 3);
      ctx.restore();
      if (on > 0) halo(ctx, x, y - 6, 26, .35 * on * (1 - slide), P.halo1, P.halo0);
      if (u > 0 && u < 1) { const e = sineIO(u); fileCard(ctx, lerp(fx, x, e), lerp(fy, y - 20, e) - 70 * Math.sin(Math.PI * e), 18, t, 1); }
    });
  }

  function fileCard(ctx, x, y, s, t, a1) {
    ctx.save(); ctx.globalAlpha = a1; ctx.translate(x, y);
    const p = new Path2D(); p.moveTo(-s * .38, -s * .5); p.lineTo(s * .22, -s * .5); p.lineTo(s * .38, -s * .32); p.lineTo(s * .38, s * .5); p.lineTo(-s * .38, s * .5); p.closePath();
    B.paperFill(ctx, p, { fibre: 0 });
    ctx.fillStyle = rgba(COL.ink2, .5); for (let i = 0; i < 3; i++) ctx.fillRect(-s * .26, -s * .08 + i * s * .14, s * .5, Math.max(1, s * .04));
    if (s > 40) { ctx.fillStyle = rgba(COL.ink, .85); ctx.font = `600 ${Math.round(s * .13)}px Inter`; ctx.textAlign = 'center'; ctx.fillText('APERTUS', 0, -s * .22); }
    ctx.restore();
    halo(ctx, x, y, s * 1.2, .25 * a1, P.halo1, P.halo0);
  }

  function pool(ctx, t, tilt, up) {
    // the shared pool of chips on the valley floor (cool tiles that shimmer); boats glide in on "start-ups"
    const show = smooth(span(t, a.india - .4, a.pool + .3)); if (show <= 0) return;
    const fly = span(t, tFly0, tFly1);
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .6 * show); ctx.beginPath(); ctx.ellipse(POOL.x, POOL.y, POOL.rx * 1.04, POOL.ry * 1.15, 0, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(COL.cool2, .5 * show); ctx.lineWidth = 2; ctx.stroke();
    TILES.forEach(([u, v, ph], i) => {
      const k = smooth(clamp((fly * 1.6) - (i % 40) / 40 * .6)); if (k > 0) return;   // drawn by europe() once it leaves
      const x = POOL.x + u * POOL.rx, y = POOL.y + v * POOL.ry, s = 3.4 + 1.4 * (v + 1) * .5, sh = .5 + .5 * Math.sin(t * 1.6 + ph + u * 3);
      ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, .5 + .45 * sh * show); ctx.globalAlpha = show; ctx.fillRect(x - s * .6, y - s * .35, s * 1.2, s * .7);
    });
    ctx.globalAlpha = 1;
    BOATS.forEach(([u, v], i) => {
      const k = sineIO(span(t, a.startups - .3 + i * .18, a.startups + 1.1 + i * .18)); if (k <= 0) return;
      const lap = LAPS[i * 3 % LAPS.length], gx = POOL.x + u * POOL.rx, gy = POOL.y + v * POOL.ry * .7;
      const bx = lerp(lap[0], gx, k), by = lerp(lap[1], gy, k) - 60 * Math.sin(Math.PI * k) * 0, bob = 2 * Math.sin(t * 2 + i);
      const gone = 1 - smooth(span(t, tFly0 - .2, tFly0 + .6));
      ctx.save(); ctx.globalAlpha = gone; ctx.translate(bx, by + bob);
      const hull = new Path2D(); hull.moveTo(-16, -3); hull.lineTo(16, -3); hull.lineTo(10, 5); hull.lineTo(-10, 5); hull.closePath();
      const sail = new Path2D(); sail.moveTo(0, -4); sail.lineTo(0, -22); sail.lineTo(11, -6); sail.closePath();
      B.paperFill(ctx, hull, { fibre: 0 }); B.paperFill(ctx, sail, { fibre: 0, lum: .85 });
      ctx.restore();
      if (k > .9) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo1, .3 * gone); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(bx, by + 6, 22 + 4 * Math.sin(t * 2 + i), 4, 0, 0, 6.29); ctx.stroke(); ctx.restore(); }
    });
    ctx.restore();
  }

  function europe(ctx, t, dyTilt) {
    // the tiles leave the pool (they ride with the world until they lift) and fly to their dot of the map; the seven hubs
    const dots = europeDots(), fly = span(t, tFly0, tFly1), hubs = rise(span(t, a.hubs - .1, a.hubs + .7));
    const tLift = a.T1 - SHEET_LIFT, paperS = smooth(span(t, tLift - .6, tLift - .05));
    const paperH = (i) => smooth(span(t, a.early - .15 + i * .09, a.early + .55 + i * .09));   // the others follow on "They're early"
    // where the pool is on screen right now (same transform as worldB's near layer)
    const push = 1 + .04 * span(t, tB, tSet0), dy = dyTilt * 1;
    const toScr = (x, y) => [960 + (x - 960) * push, 600 + (y + dy - 600) * push];
    ctx.save();
    for (let i = 0; i < dots.length; i++) {
      const k = smooth(clamp((fly * 1.6) - (i % 40) / 40 * .6)); if (k <= 0) continue;
      const [u, v, ph] = TILES[i], [px, py] = toScr(POOL.x + u * POOL.rx, POOL.y + v * POOL.ry), [mx, my] = dots[i];
      const e = sineIO(k), x = lerp(px, mx, e) + 60 * Math.sin(Math.PI * e) * (u), y = lerp(py, my, e);
      const sh = .5 + .5 * Math.sin(t * 1.2 + ph), s = lerp(3.4, 5.2, e);
      ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, .45 + .3 * sh); ctx.globalAlpha = .55 + .4 * e; ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.restore();
    // hubs: little sheets of light (warm), they turn to blueprints ("still on paper"); the 5th lifts off (sheet, seam)
    if (hubs > 0) HUBS.forEach(([x, y], i) => {
      if (i === HUB_SHEET && t >= a.T1 - SHEET_LIFT) return;
      const paper = i === HUB_SHEET ? paperS : paperH(i);
      const s = 12 * hubs, w = s * 1.9, h = s * 2.5;
      ctx.save(); ctx.translate(x, y - 6);
      if (paper < 1) { const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h); E.lightShape(ctx, p, t, { lit: 1, a: hubs * (1 - paper), dust: 0, glow: .6 }); }
      if (paper > 0) {
        ctx.globalAlpha = paper; ctx.fillStyle = '#21448f'; ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6); ctx.setLineDash([]);
      }
      ctx.restore();
      halo(ctx, x, y, 40 * hubs, .25 * hubs * (1 - .6 * paper), P.halo1, P.halo0);
    });
  }

  function labelsB(ctx, t) {
    const u1 = span(t, a.apertus + .1, a.apertus + 1.1), o1 = span(t, a.india - .9, a.india - .2);
    if (u1 > 0 && o1 < 1) label(ctx, [['APERTUS · SWITZERLAND\'S OPEN MODEL'], ['PUBLIC SUPERCOMPUTER ALPS · CSCS']], 120, 150, u1, { out: o1 });
    const u2 = span(t, a.pool + .1, a.pool + 1.1), o2 = span(t, a.europe - .6, a.europe);
    if (u2 > 0 && o2 < 1) label(ctx, [['INDIAAI COMPUTE · 38,000+ SHARED GPUs']], 120, 150, u2, { out: o2 });
    const u3 = span(t, a.pubpriv - .3, a.pubpriv + .7), o3 = span(t, a.T1 - 1.9, a.T1 - 1.3);
    if (u3 > 0 && o3 < 1) label(ctx, [['UP TO 7 PUBLIC-PRIVATE COMPUTING HUBS'], ['PLANNED']], 120, 150, u3, { out: o3 });
  }
}
