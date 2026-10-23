// Film 8 · c03 · map vs compass, the navigator (VO 02a, Q1, 02b, C2, 02c; 130.21 → 207.86 s) · B1. Binding shot list: m1/bild/shots.md §8 c03.
// Four worlds, joined without a cut: YOUR room (the chart, the journal) → the ink line = Q1's line on the card sky → the line is Hōkūleʻa's wake
// seen from above (the sky carries the trip to Satawal and back) → the tern's line opens into C2 and closes to the horizon → the grey lid, Mau,
// the ring → into the fire box, out of YOUR oil lamp → the sheet, the window, into the dark glass (plate `glass`).
//
// shot  | VO (accent)                                         | image                                                       | camera
// ------+-----------------------------------------------------+-------------------------------------------------------------+---------------------------
// 03.01 | So what do you do when the map STOPS WORKING?       | off the chart on the table; its ink lifts off as curling threads, the chart left blank | pull back 1.0 s
// 03.02 | A PHILOSOPHER saw the problem long before us.       | the journal opens in the draught, brown ink writes a line; COPENHAGEN · 1843; push onto the underline | slide + push
// 03.03 | Q1 Kierkegaard                                      | the underline lights: Q1's split line; the camera whips out of the open window into the card sky | whip tilt
// 03.04 | FORWARDS is the only direction we have.             | the line stays, the camera cranes down: it is the wake (cool) and the course (amber dots) of Hōkūleʻa | tilt down 1.4 s
// 03.05 | So you do what a NAVIGATOR does.                    | down onto the stern: Mau's hand at arm's length, a rising star meets the fingertip | crane down
// 03.06 | The canoe is called HŌKŪLEʻA.                       | pull back at dusk: the crew raise the crab-claw sails; Arcturus brightens; label | pull back 1.4 s
// 03.07 | … from MAUI for TAHITI.                             | Honolua Bay: ridges, torches; on "Tahiti" crane up: the dotted route draws south | crane up 1.5 s
// 03.08 | Its navigator, MAU PIAILUG … a TINY ISLAND …        | night: Mau at the stern (label); tilt up into the Milky Way and down onto Satawal (label) | the sky carries the move
// 03.09 | He has NEVER sailed in the SOUTHERN half …          | back over the canoe: the North Star sets behind the stern; through the zenith the sky turns; the Southern Cross rises | tilt
// 03.10 | He reads the STARS. WAVES. WIND. CLOUDS. BIRDS.     | one orbit round Mau: star path, the swell lit amber, streamers, a lit cloud, a tern | orbit
// 03.11 | C2 Nainoa Thompson                                  | the tern's flight line opens into the clip and closes to the horizon | line carrier
// 03.12 | … the CLOUDS CLOSE IN.                              | the grey lid slides over the Milky Way from both sides      | slight pull back
// 03.13 | For DAYS, no stars at all.                          | wide: grey day → black night (only the fire) → grey day     | pull back
// 03.14 | Keep that in MIND.                                  | close: Mau in the rain, palm flat on the rail               | fly in
// 03.15 | Here's the part I can't stop THINKING about.        | from behind, circling to his profile                        | push + circle
// 03.16 | Mau didn't carry a COMPASS.                         | his open hands, palms up, empty                             | drift
// 03.17 | He WAS the compass.                                 | the star compass draws itself round his chest and breathes  | crane up 1.2 s ★
// 03.18 | … nobody will HAND you a better MAP.                | into the fire box, out of YOUR oil lamp: your open hand on the sheet | push / pull back
// 03.19 | But you can BUILD a compass.                        | the pen draws one ring, a cross, four empty points          | drift
// 03.20 | One you CARRY INSIDE.                               | up to the dark window: your reflection, the ring glows at its chest; push into the glass = plate `glass` | lift + push
import { rgba, clamp, prng, canvas } from '../engine.mjs';
import { ready, track, camera, eoX, eiX, sio, u01, pulse, TAU, projRuns, mixHex, hash } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky, skyDir } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { hand as handoff, paperLamp, plate, SKY0 } from '../lib/handoff4.mjs';
import { label, quoteCard, cardLine, clip } from '../lib/s8_card.mjs';
import { DESK, room, sheet, sheetCorners, book, cup, penHand } from '../lib/s8_desk.mjs';
import { inkRose } from '../lib/s8_rose.mjs';
import { lid, bank, rain, wind as windStreaks, TONE } from '../lib/s8_cloud.mjs';
import { canoeNav, canoeFrame, navFigure, starRing, starPath, flames, CANOE } from '../lib/s8_nav.mjs';
import { bigStar, crux, wake, course, routeAhead, maui, atoll, swellGlow, unproj, dirAzEl, seaTop } from '../lib/s8_c03_sea.mjs';
import { hand as drawHand } from '../lib/hand.mjs';

export default async function (T, R) {
  const Hin = handoff('c02>c03', T), Hout = handoff('c03>c04', T);
  const A = (p, n) => T.S('02a', p, n), B = (p, n) => T.S('02b', p, n), Cs = (p, n) => T.S('02c', p, n);
  const Q1 = T.clip('Q1'), C2 = T.clip('C2');
  const K = {
    b: Hin.b, so: A('So'), map: A('map'), stops: A('stops'), working: A('working'), philosopher: A('philosopher'), problem: A('problem'), before: A('before'),
    fw: B('Forwards'), soYou: B('So you do'), nav: B('navigator'), canoe: B('The canoe'), called: B('called'), in19: B('In nineteen'), maui: B('Maui'), tahiti: B('Tahiti'),
    its: B('Its navigator'), mau: B('Mau', 1), tiny: B('tiny'), island: B('island'), heHas: B('He has'), never: B('never'), southern: B('southern'),
    reads: B('He reads'), stars: B('stars'), waves: B('waves'), wind: B('wind'), clouds: B('clouds'), birds: B('birds'),
    butOut: Cs('But out'), close: Cs('close in'), forDays: Cs('For days'), keep: Cs('Keep'), mind: Cs('mind'), heres: Cs("Here's"), thinking: Cs('thinking'),
    mauD: Cs('Mau didn'), compass: Cs('compass'), heWas: Cs('He was'), was: Cs('was'), inSing: Cs('In the singularity'), handYou: Cs('hand you'), mapC: Cs('map'),
    butYou: Cs('But you can'), build: Cs('build'), one: Cs('One you'), carry: Cs('carry inside'), end: Hout.a,
  };
  K.hoku = K.called + .28;
  const cardY = (t) => 600 + 2 * Math.sin(t * .9);   // s8_card cardLine breathes 2 px

  // ================================================================ S1 · YOUR room: the chart, the threads, the journal
  const CH = { x: .1, z: .3, w: .64, aspect: 16 / 9 }; CH.h = CH.w / CH.aspect;
  const chartW = (px, py, h = 0) => [CH.x + (px / 1920 - .5) * CH.w, DESK.top + .0015 + h, CH.z - (py / 1080 - .5) * CH.h];
  // the chart's ink as polylines (chart px; all of it outside the middle half = the paper plate), each lifts off at its own time
  const ELS = (() => {
    const r = prng(303), E = [], coast = [];
    for (let i = 0; i <= 60; i++) coast.push([170 + 110 * Math.sin(i * .37) + 55 * Math.sin(i * 1.13 + 1) + 30 * (r() - .5) + 40, -20 + i * 19]);
    const isl = []; for (const [cx, cy, R0] of [[1640, 180, 70], [1760, 420, 50], [1600, 880, 90], [1820, 700, 40]]) { const p = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; p.push([cx - 42 + Math.cos(a) * R0 * (.75 + .35 * r()), cy + Math.sin(a) * R0 * (.6 + .3 * r())]); } p.push(p[0]); isl.push(p); }
    const add = (pts, w, a, order) => E.push({ pts, w, a, order });
    add(coast.slice(0, 21), 5, .92, 0); add(coast.slice(20, 41), 5, .92, .15); add(coast.slice(40), 5, .92, .3);
    for (let k = 1; k <= 2; k++) add(coast.map(([x, y]) => [x + k * 16, y]), 1.3, .45, .1 + k * .1);
    for (let y = 0; y < 1080; y += 14) { const i = Math.min(60, Math.max(0, Math.round((y + 20) / 19))), x = coast[i][0]; add([[x - 90, y], [x - 10, y - 10]], 1.1, .35, .05 + y / 1080 * .5); }
    isl.forEach((p, i) => add(p, 4, .92, .2 + i * .12));
    for (let i = 0; i < 60; i++) { const x = r() < .5 ? 290 + r() * 140 : 1470 + r() * 110, y = 40 + r() * 1000; add([[x, y], [x + 5, y - 9], [x + 11, y - 2], [x + 15, y - 9]], 1.6, .55, .1 + r() * .7); }
    { const cx = 330, cy = 930; for (const R0 of [90, 70]) { const p = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU; p.push([cx + Math.cos(a) * R0, cy + Math.sin(a) * R0]); } add(p, 2, .92, .55); } for (let i = 0; i < 16; i++) { const a = i / 16 * TAU - Math.PI / 2, L = i % 4 ? 70 : 120; add([[cx, cy], [cx + Math.cos(a) * L, cy + Math.sin(a) * L]], 2, .92, .6 + i * .01); } }
    for (const [x, y, w, h] of [[1500, 40, 380, 120], [1510, 50, 360, 100]]) add([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], 2, .92, .5);
    for (let i = 0; i < 5; i++) add([[1550 + i * 62, 94], [1594 + i * 62, 94]], 8, .6, .52 + i * .02);
    add([[14, 14], [1906, 14]], 4, .6, .85); add([[1906, 14], [1906, 1066]], 4, .6, .9); add([[1906, 1066], [14, 1066]], 4, .6, .95); add([[14, 1066], [14, 14]], 4, .6, 1);
    // resample so every thread can curl; arc length 0..1 along it; when it lifts and how fast it peels
    const rr = prng(77);
    for (const e of E) {
      const P = []; for (let i = 1; i < e.pts.length; i++) { const a = e.pts[i - 1], b = e.pts[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 14)); for (let j = 0; j < n; j++) P.push([a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]); }
      P.push(e.pts[e.pts.length - 1]);
      let L = 0; const S = [0]; for (let i = 1; i < P.length; i++) { L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); S.push(L); }
      e.P = P; e.S = S.map((s) => s / Math.max(1, L)); e.dur = .25 + Math.min(.6, L / 2400); e.ph = rr() * 10; e.rev = rr() < .5;
      if (e.rev) e.S = e.S.map((s) => 1 - s);
    }
    return E;
  })();
  ELS.forEach((e) => { e.tl = K.map - .05 + e.order * (K.philosopher - .35 - K.map); });
  const peelOf = (e, t) => clamp((t - e.tl) / e.dur);
  const chartInk = (g, t, W, H) => {
    // at the plate the lamp pool is the plate's (the middle half of the chart); as the camera pulls back the pool spreads over the whole chart
    const sc = .5 + .5 * sio(u01(t, K.b + .1, K.b + 1.5)), ox = 960 * (1 - sc), oy = 540 * (1 - sc);
    g.save(); g.translate(ox, oy); g.scale(sc, sc); paperLamp(g, t, { rect: [-ox / sc - 2, -oy / sc - 2, W / sc + 4, H / sc + 4] }); g.restore();
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const e of ELS) {
      const pe = peelOf(e, t); if (pe >= 1) continue;
      g.strokeStyle = rgba('#2a2420', e.a); g.lineWidth = e.w; g.beginPath(); let on = false;
      for (let i = 0; i < e.P.length; i++) { if (e.S[i] < pe) { on = false; continue; } on ? g.lineTo(...e.P[i]) : g.moveTo(...e.P[i]); on = true; }
      g.stroke();
    }
  };
  // the lifted threads: each point rises and curls in the lamp's heat from the moment the peel passes it
  function threads(ctx, t, C) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const e of ELS) {
      const pe = peelOf(e, t); if (pe <= 0) continue; if (t - e.tl > 4.2) continue;
      const pts = [];
      for (let i = 0; i < e.P.length; i++) {
        const age = t - e.tl - e.S[i] * e.dur; if (age < 0) continue;
        const a = Math.min(age, 3.5), rc = .006 + .022 * a, th = a * (3.2 + e.ph * .2) + e.ph + i * .35, rise = .04 * a + .07 * a * a;
        const w = chartW(...e.P[i], rise);
        pts.push([w[0] + rc * (Math.cos(th) - 1) + .03 * a * Math.sin(e.ph), w[1], w[2] + rc * Math.sin(th) + .05 * a]);
        if (age >= 0 && i + 1 < e.P.length && t - e.tl - e.S[i + 1] * e.dur < 0) { pts.push(chartW(...e.P[i + 1], 0)); }
      }
      if (pts.length < 2) continue;
      const wm = e.w * CH.w / 1920;
      for (const run of projRuns(C, pts, .03)) { ctx.strokeStyle = rgba('#2a2420', Math.max(.55, e.a)); ctx.lineWidth = Math.max(.7, wm * run[0][2]); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    }
    ctx.restore();
  }
  const chartItem = { x: CH.x, z: CH.z, drawItem: (ctx, t, C) => {
    const K4 = sheetCorners(CH), pts = K4.map((p) => C.P(...p));
    const wpx = pts.every(Boolean) ? Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]) : 4000, res = wpx > 1900 ? 2 : wpx > 950 ? 1 : .5;
    sheet(ctx, t, C, { ...CH, lamp: false, res, n: res > 1 ? 6 : 4, draw: chartInk });
  } };
  // the journal: leather, opened by the draught; brown ink writes one line and underlines it (vector, crisp at any zoom)
  const JN = { x: -.29, z: -.13, w: .15, d: .21, th: .03, rot: .12 };
  const jOpen = (t) => sio(u01(t, K.philosopher - .05, K.philosopher + .6));
  const jU = [Math.cos(JN.rot), 0, -Math.sin(JN.rot)], jV = [Math.sin(JN.rot), 0, Math.cos(JN.rot)];
  const pageW = (a, b, h = 0) => [JN.x + jU[0] * a + jV[0] * b, DESK.top + JN.th + .0007 + h, JN.z + jU[2] * a + jV[2] * b];
  const HW = (() => {   // unreadable cursive: words of loops, pen lifts between them; then one underline
    const r = prng(1843), strokes = []; let a = -.063;
    while (a < .05) {   // one word: slanted loops (e/l shapes), a few tall ones as ascenders, smooth everywhere
      const wl = .01 + .016 * r(), n = Math.max(3, Math.round(wl / .0026)), tall = Array.from({ length: n }, () => (r() < .22 ? 2.1 + .5 * r() : .85 + .3 * r())), S = [];
      for (let i = 0; i <= n * 16; i++) {
        const v = i / (n * 16), ph = v * n * TAU, li = Math.min(n - 1, Math.floor(v * n)), f = (v * n) % 1, hm = tall[li] * (1 - Math.pow(Math.abs(2 * f - 1), 6)) + .5 * Math.pow(Math.abs(2 * f - 1), 6) * (tall[li] + tall[Math.min(n - 1, li + 1)]) / 2;
        const h = .0016 * (1 - Math.cos(ph)) * hm, x = a + v * wl - .0010 * Math.sin(ph) + .35 * h;
        S.push([x, .0335 + h + .0004 * Math.sin(v * 3 + a * 200)]);
      }
      strokes.push(S); a += wl + .005 + .003 * r();
    }
    const U = []; for (let i = 0; i <= 40; i++) { const v = i / 40; U.push([-.065 + .13 * v, .021 + .0003 * Math.sin(v * 9) - .0006 * v * v]); }
    const L = strokes.map((S) => S.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - S[i - 1][0], p[1] - S[i - 1][1]) : 0), 0));
    return { strokes, U, L, total: L.reduce((x, y) => x + y, 0) };
  })();
  K.w0 = K.problem - .1; K.w1 = K.before + .1; K.u0 = K.w1 + .02; K.u1 = K.u0 + .32;
  function handwriting(ctx, t, C) {
    if (t < K.w0) return;
    const u = clamp((t - K.w0) / (K.w1 - K.w0)) * HW.total; let acc = 0;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ink = (S, upto, wM) => { const pts = []; let l = 0; for (let i = 0; i < S.length; i++) { if (i) l += Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]); if (l > upto) break; pts.push(pageW(S[i][0], S[i][1])); } for (const run of projRuns(C, pts, .02)) { ctx.strokeStyle = rgba('#4a2a14', .92); ctx.lineWidth = Math.max(.8, wM * run[0][2]); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } };
    HW.strokes.forEach((S, i) => { const left = u - acc; acc += HW.L[i]; if (left > 0) ink(S, left, .00045); });
    const uu = clamp((t - K.u0) / (K.u1 - K.u0)); if (uu > 0) ink(HW.U, .13 * eoX(uu) + 1e-4, .0006);
    ctx.restore();
  }
  const LEATHER = (g, t, W, H) => { const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#4a2c1a'); gr.addColorStop(1, '#2a160c'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(200,150,90,.35)'; g.lineWidth = W * .012; g.strokeRect(W * .08, H * .06, W * .84, H * .88); g.strokeStyle = 'rgba(10,4,2,.4)'; g.lineWidth = 2; for (let i = 0; i < 40; i++) { const y = (i * 37) % H; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y + 8); g.stroke(); } };
  const OLDPAGE = (g, t, W, H, i) => { g.fillStyle = '#e4d4b0'; g.fillRect(0, 0, W, H); if (i !== 1) return; const r = prng(77); g.strokeStyle = 'rgba(74,42,20,.7)'; g.lineWidth = W * .006; for (let l = 0; l < 16; l++) { let x = W * .1; const y = H * .1 + l * H * .05; g.beginPath(); while (x < W * .88) { const ww = W * (.06 + .12 * r()); for (let s = 0; s < ww; s += W * .012) g.lineTo(x + s, y + H * .008 * Math.sin(s * .9 + l)); x += ww + W * .03; g.moveTo(x, y); } g.stroke(); } };
  const journal = (t) => book({ ...JN, col: '#2a160c', pages: '#d8c49c', cover: LEATHER, open: jOpen(t), page: OLDPAGE });
  const BOOKS = [{ x: .5, z: -.13, w: .17, d: .24, th: .032, rot: -.18, col: '#2a3a5a' }, { x: .51, z: -.12, w: .16, d: .23, th: .028, rot: -.1, col: '#5a2a24', y: DESK.top + .032 }];
  const outsideCard = (ctx, t, C) => { const Co = camera({ x: C.x, y: C.y + 6, z: C.z, yaw: C.yaw, pitch: C.pitch, F: C.F }); drawSky(ctx, t, Co, { mw: .4 }); drawSea(ctx, t, Co, {}); };
  // S1 camera (desk coords)
  const plateD = 1400 * (CH.w / 2) / 1920;
  const lookFrom = (P, d, yaw, pitch) => [P[0] - Math.sin(yaw) * Math.cos(pitch) * d, P[1] + Math.sin(pitch) * d, P[2] - Math.cos(yaw) * Math.cos(pitch) * d];
  K.tL = K.u1 + .08;   // the underline spans the frame
  const UM = pageW(-.0005, .021), kU = 2080 / .13, hU = 1400 / kU;
  const camU = (t) => { const dy = (cardY(t) - 540) / kU; return [UM[0] + jV[0] * dy, UM[1] + hU, UM[2] + jV[2] * dy]; };
  const s1Keys = [
    [K.b, CH.x, DESK.top + .001 + plateD, CH.z, 0, Math.PI / 2, 1400],
    [K.b + 1.05, .1, 1.42, -.18, 0, 1.0, 1300],
    [K.map + .3, .09, 1.45, -.24, -.01, .98, 1300],
    [K.philosopher - .3, .06, 1.5, -.3, -.03, .95, 1290],
    [K.philosopher + .55, ...lookFrom(pageW(0, 0), .62, JN.rot * .5, .98), JN.rot * .5, .98, 1300],
    [K.problem + .3, ...lookFrom(pageW(-.01, .028), .40, JN.rot * .7, 1.08), JN.rot * .7, 1.08, 1320],
    [K.w1 - .2, ...lookFrom(pageW(.0, .025), .25, JN.rot, 1.28), JN.rot, 1.28, 1360],
    [K.tL, ...camU(K.tL), JN.rot, Math.PI / 2, 1400],
    [K.tL + .14, ...camU(K.tL + .14).map((v, i) => v + (i === 1 ? .004 : 0)), JN.rot, Math.PI / 2 - .01, 1400],
    [K.tL + .36, -.08, 1.12, .12, .16, .55, 1250],
    [Q1.start - .02, .1, 1.5, .78, SKY0.yaw, SKY0.pitch, SKY0.F],
  ];
  const mkTrack = (keys) => { const tr = [1, 2, 3, 4, 5, 6].map((i) => track(keys.map((k) => [k[0], i === 6 ? Math.log(k[i]) : k[i]]))); return (t) => camera({ x: tr[0](t), y: tr[1](t), z: tr[2](t), yaw: tr[3](t), pitch: tr[4](t), F: Math.exp(tr[5](t)) }); };
  const camS1 = mkTrack(s1Keys);
  const cupI = cup({ x: -.62, z: -.2 });
  function frameS1(ctx, t) {
    const C = camS1(t);
    if (C.z >= DESK.wallZ) outsideCard(ctx, t, C);
    else {
      const items = [chartItem, journal(t), cupI, ...BOOKS.map((b) => book(b))];
      room(ctx, t, C, { items, lampKind: 'oil', open: true, outsideDraw: outsideCard, person: {}, wind: t > K.philosopher - .3 && t < K.philosopher + .9 ? .6 * pulse(t, K.philosopher - .3, K.philosopher + .9) : .06 * Math.sin(t * 1.7) });
      threads(ctx, t, C);
      handwriting(ctx, t, C);
      const lu = u01(t, K.problem - .15, K.problem + .45) - u01(t, K.before + .05, K.before + .45), lp = C.P(...pageW(-.075, .06));
      if (lu > 0 && lp) label(ctx, t, lp[0], lp[1], lu, 'COPENHAGEN · 1843', '', { dx: -60, len: 110, side: 'left' });
    }
    // the underline lights up as Q1's split line and stays in the frame while the camera whips out into the sky
    const lu2 = eoX(u01(t, K.tL - .04, K.tL + .3));
    if (lu2 > 0) cardLine(ctx, t, { y: 600, style: 'split', u: lu2 });
  }

  // ================================================================ Q1 · the quote card
  const Q1o = { lines: ['Life must be understood backwards.', 'But … it must be lived forwards.'], name: 'SØREN KIERKEGAARD', source: '1843', at: [.25, (Q1.end - Q1.start) / 2], line: { y: 600, style: 'split', u: 1 } };

  // ================================================================ W2 · the voyage (dusk → night), Satawal
  const HD = Math.PI / 2 + SKY0.yaw, V = 2.2, T0 = K.canoe;   // heading: at a top-down view with yaw = SKY0.yaw the bow points right
  const fwd = [Math.sin(HD), Math.cos(HD)], rgt = [Math.cos(HD), -Math.sin(HD)];
  const KC = (t) => ({ x: fwd[0] * V * (t - T0), z: fwd[1] * V * (t - T0), head: HD });
  const loc = (t, u, w, y = 0) => { const k = KC(t); return [k.x + rgt[0] * u + fwd[0] * w, y, k.z + rgt[1] * u + fwd[1] * w]; };
  const AZ_W = HD + Math.PI / 2 + .45;   // the dusk and Maui (behind, to starboard)
  K.tH = K.fw + 1.1;                      // the card line becomes the wake
  const HC = 170, k0 = SKY0.F / (HC - .03), uH = -(cardY(K.tH) - 540) / k0;
  const MAU = { u: .8, w: -6.6 };          // Mau's seat (canoe-local)
  const polar = (g, Rr, y, pitch, yo, F) => { const u = MAU.u + Rr * Math.sin(g), w = MAU.w + Rr * Math.cos(g); return [u, y, w, Math.atan2(MAU.u - u, MAU.w - w) + yo, pitch, F]; };
  const YMW = -.3 - HD;                    // local yaw that looks at the Milky Way's bright part
  K.at0 = K.tiny + .33; K.at1 = K.heHas - .2;
  const w2Keys = [
    [Q1.end, uH, HC, 0, -Math.PI / 2, SKY0.pitch, SKY0.F],
    [Q1.end + .4, uH, HC, 0, -Math.PI / 2, SKY0.pitch + .08, SKY0.F],
    [K.tH, uH, HC, 0, -Math.PI / 2, Math.PI / 2, SKY0.F],
    [K.soYou - .1, uH * .5, 70, 0, -Math.PI / 2 + .04, Math.PI / 2 - .04, 1250],
    [K.nav - .8, 6, 9, -8.5, -1.28, .9, 1300],
    [K.nav - .1, 1.88, 2.75, -7.39, -1.24, -.02, 1600],
    [K.canoe - .25, 1.7, 2.7, -7.6, -1.18, -.05, 1800],
    [K.hoku + .1, -13, 6.2, -21, .55, .07, 1400],
    [K.in19 - .1, -15, 5.6, -19, .75, .05, 1400],
    [K.in19 + .7, -30, 3, 7, Math.PI / 2 + .2, .0, 1400],
    [K.tahiti - .15, -26, 3.6, 0, Math.PI / 2 + .3, .02, 1450],
    [K.tahiti + 1.15, -6, 30, -30, .04, .45, 1100],
    [K.its + .2, -5, 26, -26, .04, .43, 1150],
    [K.mau + .05, ...polar(Math.PI / 2 + .25, 2.2, 2.05, .1, 0, 1450).slice(0, 5), 1450],
    [K.tiny - .3, ...polar(Math.PI / 2 + .05, 1.9, 2.15, .06, 0, 1500).slice(0, 5), 1500],
    [K.at0, ...polar(Math.PI / 2 + .2, 2.1, 2.1, 0, 0, 0).slice(0, 3), YMW, -.8, 1400],
    // the atoll world runs between at0 and at1 (its own camera); back over the canoe looking aft at the North Star
    [K.at1, -6.0, 3.2, -5.6, YMW - .1, -.8, 1400],
    [K.at1 + .75, -6.0, 3.0, -5.9, -Math.PI - .32, .1, 1400],
    [K.southern + .35, -5.4, 2.6, -7.2, -Math.PI - .22, .12, 1500],
    [K.southern + .85, -6.0, 3.1, -6.1, -Math.PI / 2 - .05, -1.47, 1400],
    [K.southern + .97, -5.0, 3.0, -8.0, -Math.PI / 2 + .1, -1.47, 1400],
    [K.southern + 1.6, ...polar(Math.PI - .12, 3.9, 2.9, -.03, 0, 1400).slice(0, 3), 0.05, -.03, 1400],
    [K.reads, ...polar(3.0, 3.9, 2.9, -.04, .1, 1400)],
  ];
  const tW2 = [1, 2, 3, 4, 5, 6].map((i) => track(w2Keys.map((k) => [k[0], i === 6 ? Math.log(k[i]) : k[i]])));
  // the orbit (c03.10) and the tern pass, in polar keys round Mau
  const orbKeys = [
    [K.reads, 3.0, 3.9, 2.9, -.04, .1, 1400],
    [K.waves - .1, 2.6, 4.6, 3.5, .24, .0, 1400],
    [K.wind - .05, 2.25, 5.5, 3.0, -.3, .15, 1350],
    [K.clouds - .05, 1.95, 6.0, 2.7, -.03, .35, 1400],
    [K.birds - .1, 1.75, 6.3, 2.5, -.03, .3, 1400],
    [C2.start, 1.62, 6.5, 2.45, -.035, .3, 1400],
  ];
  const tOrb = [1, 2, 3, 4, 5, 6].map((i) => track(orbKeys.map((k) => [k[0], i === 6 ? Math.log(k[i]) : k[i]])));
  const camL = (t, L) => { const p = loc(t, L[0], L[2], L[1]); return camera({ x: p[0], y: p[1], z: p[2], yaw: HD + L[3], pitch: L[4], F: L[5] }); };
  const camW2 = (t) => {
    if (t >= K.reads) { const P = polar(tOrb[0](t), tOrb[1](t), tOrb[2](t), tOrb[3](t), tOrb[4](t), Math.exp(tOrb[5](t))); return camL(t, P); }
    return camL(t, [tW2[0](t), tW2[1](t), tW2[2](t), tW2[3](t), tW2[4](t), Math.exp(tW2[5](t))]);
  };
  // the atoll world (Satawal), far away in the same sea: tilt down out of the Milky Way onto it, and back up
  const AT = { x: 9000, z: 9000, R: 70 }, atDir = [Math.sin(-.3), Math.cos(-.3)];
  const atCam = (d, y) => [AT.x - atDir[0] * d, y, AT.z - atDir[1] * d];
  const atKeys = [[K.at0, ...atCam(250, 125), -.3, -.8, 1400], [K.island + .75, ...atCam(232, 118), -.3, .5, 1400], [K.at1 - .55, ...atCam(212, 112), -.29, .5, 1410], [K.at1, ...atCam(205, 110), -.3, -.8, 1400]];
  const camAT = mkTrack(atKeys);

  // the world's light over time
  const duskOf = (t) => .5 * sio(u01(t, Q1.end + .4, K.tH)) * (1 - sio(u01(t, K.tahiti + .4, K.mau + .4)));
  const mwOf = (t) => .4 + .6 * sio(u01(t, K.tahiti + .4, K.mau + .6));
  const sailsOf = (t) => sio(u01(t, K.canoe - .4, K.hoku + .5));
  const crewOf = (t) => (t > K.canoe - 1.5 && t < K.its ? [{ w: 3.0, u: .55, face: -.3, arms: { r: { a: 'raise', b: 'knee', u: u01(t, K.hoku + .4, K.hoku + 1.2) }, l: { a: 'raise', b: 'knee', u: u01(t, K.hoku + .4, K.hoku + 1.3) } }, seed: 4 }, { w: -2.9, u: -.55, face: .4, arms: { r: { a: 'raise', b: 'knee', u: u01(t, K.hoku + .5, K.hoku + 1.3) }, l: 'raise' }, seed: 7 }] : []);
  // named stars: the star Mau measures (its direction is fixed so that it meets the fingertip on "navigator"), Arcturus, the North Star, the Cross
  let STAR = null, ARC = null, PATH = null, BANK = null;
  const MS = { u: .4, w: -7.0 }, azS = HD - Math.PI / 2 + .45;
  const mauStand = (ctx, t, C, F) => navFigure(ctx, t, C, { at: F(MS.u, 1.28 + .93, MS.w), face: azS, pose: 'stand', arms: { r: { dir: [azS, .075] }, l: 'knee' }, hands: { r: 'open' }, handAng: { r: -Math.PI / 2 - .06 + .02 * Math.sin(t * .8) }, light: F(...CANOE.fire), lit: .75, seed: 2 });
  function initStars() {
    if (STAR) return;
    const [dc, dg] = canvas(8, 8), tN = K.nav + .02, C = camW2(tN), F = canoeFrame(KC(tN), tN), r = mauStand(dg, tN, C, F);
    const tip = r && r.tip.r ? r.tip.r : [1300, 400]; STAR = dirAzEl(unproj(C, tip[0], tip[1] - 4));
    const Ca = camW2(K.hoku + .2), m = canoeFrame(KC(K.hoku + .2), K.hoku + .2)(0, 11, 3.4), mp = Ca.P(...m); ARC = mp ? [dirAzEl(unproj(Ca, mp[0], mp[1]))[0], .3] : [HD, .3];
    const Cp = camW2(K.stars + .2); PATH = [dirAzEl(unproj(Cp, 560, 330))[0], .09];
    const Cb = camW2(K.clouds + .2); BANK = dirAzEl(unproj(Cb, 1350, 540))[0];
    void dc;
  }
  const polEl = (t) => .1 - .12 * sio(u01(t, K.at1 + .5, K.southern + .4));
  const cruxEl = (t) => -.06 + .2 * sio(u01(t, K.southern + .9, K.reads + 1.6));
  function namedStars(ctx, t, C, o = {}) {
    initStars();
    const sEl = STAR[1] + .045 * (t - K.nav);
    if (t < K.its) bigStar(ctx, t, C, skyDir(STAR[0], sEl), { a: 1, size: 2.4, seed: 1 });
    bigStar(ctx, t, C, skyDir(ARC[0], ARC[1]), { a: .45 + .55 * eoX(u01(t, K.hoku - .15, K.hoku + .5)), size: 2.9, col: '#ffd9a0', seed: 2 });
    bigStar(ctx, t, C, skyDir(HD + Math.PI + .05, polEl(t)), { a: .95, size: 2.3, seed: 3 });
    for (const s of crux([HD - .05, cruxEl(t)], -.55)) bigStar(ctx, t, C, s.dir, { a: .9, size: s.size, seed: s.size * 7 });
    if (o.path) bigStar(ctx, t, C, skyDir(PATH[0], PATH[1]), { a: 1, size: 2.4, col: '#c8f4ff', seed: 5 });
  }
  const torches = (() => { const K0 = KC(K.in19), out = []; for (let i = 0; i < 9; i++) { const a = AZ_W + (i - 4) * .055, d = 430 + 40 * Math.sin(i * 2.1); out.push([K0.x + Math.sin(a) * d, K0.z + Math.cos(a) * d]); } return out; })();
  // the tern (c03.10 "birds" → C2): screen space, flying left → right just above the horizon; its trail is the clip's line
  K.tern0 = K.birds - .05; K.tern1 = C2.start - .34;
  let YT = null;
  const ternY = () => { if (YT == null) YT = Math.round(camW2(C2.start - .3).hy - 70); return YT; };
  function ternPass(ctx, t) {
    if (t < K.tern0) return;
    const u = clamp((t - K.tern0) / (K.tern1 - K.tern0)), e = u < .5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u), x = -80 + 2060 * (.15 * u + .85 * e), y = ternY() - 26 * (1 - u) * Math.sin(Math.PI * u * .5) * 0;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const [lw, a] of [[22, .07], [7, .22], [1.8, .95]]) { ctx.strokeStyle = rgba(lw < 3 ? '#eefcff' : '#8fe6ff', a); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-20, y); ctx.lineTo(Math.min(1940, x - 6), y); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
    if (x < 1990) { const fl = Math.sin(t * 15), s = 34; ctx.translate(x, y); ctx.fillStyle = '#f3efe2'; ctx.beginPath(); ctx.ellipse(0, 0, s * .45, s * .1, 0, 0, TAU); ctx.fill(); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-s * .05, 0); ctx.quadraticCurveTo(-s * .2, sd * s * (.4 + .3 * fl), -s * .45, sd * s * (.85 + .2 * fl)); ctx.quadraticCurveTo(s * .05, sd * s * .35, s * .12, 0); ctx.fill(); } ctx.beginPath(); ctx.moveTo(-s * .45, 0); ctx.lineTo(-s * .8, -s * .12); ctx.lineTo(-s * .65, 0); ctx.lineTo(-s * .8, s * .12); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function seaW2(ctx, t, C) {
    const dusk = duskOf(t), Kc = KC(t), out = {};
    drawSky(ctx, t, C, { dawn: dusk, dawnAz: AZ_W, mw: mwOf(t) });
    namedStars(ctx, t, C, { path: t > K.stars - .4 });
    let glints = [];
    if (t > K.hoku && t < K.its + 1) { const m = maui(ctx, t, C, { az: AZ_W, w: .5, dusk: dusk * 2, torches }); glints = m.glints; }
    if (t > K.clouds - .3 && BANK != null) bank(ctx, t, C, { az: BANK, w: .16, h: .045, a: eoX(u01(t, K.clouds - .2, K.clouds + .5)), lit: sio(u01(t, K.clouds, K.clouds + .6)), tone: 'storm', seed: 9 });
    drawSea(ctx, t, C, { dawn: dusk, glints });
    seaTop(ctx, t, C, { a: clamp((C.pitch - .75) / .4), dawn: dusk });
    swellGlow(ctx, t, C, Kc, { u: sio(u01(t, K.waves - .1, K.waves + .5)) });
    if (t >= K.tH) {
      const ru = sio(u01(t, K.tH + .05, K.tH + .75));
      wake(ctx, t, C, Kc, { k0, from: -9.5 * ru, len: 1600, foam: 1 });
      course(ctx, t, C, Kc, { k0, from: 10 / k0 + (9.5 - 10 / k0) * ru, len: 700, a: 1 - sio(u01(t, K.nav - .6, K.nav)) });
    } else if (t > Q1.end) wake(ctx, t, C, Kc, { k0, a: 0, foam: 1 });
    const F = canoeFrame(Kc, t), standing = t < K.its - .5;
    const r = canoeNav(ctx, t, C, Kc, { sails: sailsOf(t), streamers: sio(u01(t, K.wind - .05, K.wind + .3)), crew: crewOf(t), nav: (c, Fr) => (standing ? mauStand(c, t, C, Fr) : navFigure(c, t, C, { at: Fr(MAU.u, 1.36, MAU.w), face: HD, pose: 'sit', arms: { r: 'knee', l: 'knee' }, light: Fr(...CANOE.fire), lit: .85, seed: 2 })) });
    out.canoe = r;
    routeAhead(ctx, t, C, Kc, sio(u01(t, K.tahiti - .05, K.tahiti + 1.3)));
    if (t > K.stars - .2) starPath(ctx, t, C, PATH, F(0, 1.7, 9.4), eoX(u01(t, K.stars - .1, K.stars + .7)));
    if (t > K.wind - .1 && t < K.clouds + .4) windStreaks(ctx, t, { a: .28 * pulse(t, K.wind - .1, K.clouds + .4), dir: -1, speed: 1.2, n: 22 });
    // labels
    const lab = (u, p, a, b, o) => { if (u > 0 && p) label(ctx, t, p[0], p[1], u, a, b, o); };
    lab(u01(t, K.hoku - .05, K.hoku + .5) - u01(t, K.in19 - .3, K.in19 + .1), r.mast ? [r.mast[0], r.mast[1] + 60] : null, 'HŌKŪLEʻA', '', { dx: 60, len: 90 });
    const tp = C.P(...[torches[4][0], 2.2, torches[4][1]]);
    lab(u01(t, K.in19 + .5, K.in19 + 1.1) - u01(t, K.tahiti - .1, K.tahiti + .3), tp, 'MAUI', '1 MAY 1976', { dx: -50, len: 140, side: 'left' });
    const re = C.P(...loc(t, 0, 9.5 + 14 * Math.pow(1.085, 70), .05));
    lab(u01(t, K.tahiti + .6, K.tahiti + 1.2) - u01(t, K.its + .1, K.its + .5), re, '→ TAHITI', '', { dx: 40, len: 110 });
    const hp = r.nav && r.nav.head;
    lab(u01(t, K.mau - .05, K.mau + .5) - u01(t, K.tiny - .45, K.tiny - .1), hp ? [hp[0], hp[1] - 30] : null, 'MAU PIAILUG', 'NAVIGATOR', { dx: 70, len: 130 });
    return out;
  }
  function seaAtoll(ctx, t, C) {
    drawSky(ctx, t, C, { mw: 1 });
    namedStars(ctx, t, C);
    drawSea(ctx, t, C, {});
    seaTop(ctx, t, C, { a: clamp((C.pitch - .75) / .4) });
    const o = atoll(ctx, t, C, { x: AT.x, z: AT.z, R: AT.R });
    if (o.fire) label(ctx, t, o.fire[0], o.fire[1] - 8, u01(t, K.island + .3, K.island + .9) - u01(t, K.at1 - .5, K.at1 - .15), 'SATAWAL', 'MICRONESIA', { dx: 60, len: 130 });
  }
  function frameW2(ctx, t) {
    if (t >= K.at0 && t < K.at1) { seaAtoll(ctx, t, camAT(t)); return; }
    const C = camW2(t);
    seaW2(ctx, t, C);
    if (t < K.tH) cardLine(ctx, t, { y: 600, style: 'split', u: 1 });
    ternPass(ctx, t);
  }

  // ================================================================ W3 · the grey: the lid, days without stars, Mau, the ring, into the fire
  const w3Keys = [
    [C2.end, 2.82, 16.3, 3.5, -.2, 0, 1400],
    [K.close + .9, 3.25, 24, 5.5, -.16, 0, 1400],
    [K.keep - .45, 2.74, 70, 24, .12, 0, 1400],
    [K.keep + .2, 2.3, 1.6, 2.05, .2, .1, 1500],
    [K.heres - .1, 2.22, 1.45, 2.0, .2, .1, 1520],
    [K.heres + .35, 2.95, 2.3, 2.3, .15, 0, 1450],
    [K.mauD - .25, 1.68, 1.25, 2.05, .12, 0, 1500],
    [K.mauD + .35, .75, 1.7, 2.45, .62, 0, 1450],
    [K.heWas + .2, .7, 1.6, 2.4, .66, 0, 1480],
    [K.was + 1.25, .95, 3.4, 4.6, .62, 0, 1400],
    [K.inSing - .55, 1.0, 3.6, 4.7, .6, 0, 1400],
  ];
  const tW3 = [1, 2, 3, 4, 5, 6].map((i) => track(w3Keys.map((k) => [k[0], i === 6 ? Math.log(k[i]) : k[i]])));
  K.sw = K.inSing + .72;   // inside the light: the fire box (W3) → your lamp (W4)
  const firePush = (() => { const t0 = K.inSing - .55, P0 = polar(1.0, 3.6, 4.7, .6, 0, 1400); return { t0, P0 }; })();
  const camW3 = (t) => {
    if (t >= firePush.t0) {
      const Kc = KC(t), F = canoeFrame(Kc, t), fw = F(CANOE.fire[0], 1.62, CANOE.fire[2]), C0 = camL(t, firePush.P0), u = sio(u01(t, firePush.t0, K.sw)), e = u * u;
      const s = [C0.x + (fw[0] - C0.x) * .97 * e, C0.y + (fw[1] + .02 - C0.y) * .97 * e, C0.z + (fw[2] - C0.z) * .97 * e];
      const d = [fw[0] - s[0], fw[1] - s[1], fw[2] - s[2]], yaw = Math.atan2(d[0], d[2]), pitch = Math.atan2(-d[1], Math.hypot(d[0], d[2]));
      const y0 = C0.yaw, dy = ((yaw - y0 + Math.PI * 3) % TAU) - Math.PI;
      return camera({ x: s[0], y: s[1], z: s[2], yaw: y0 + dy * sio(u * 1.6), pitch: C0.pitch + (pitch - C0.pitch) * sio(u * 1.6), F: 1400 * Math.exp(Math.log(1.6) * e) });
    }
    const P = polar(tW3[0](t), tW3[1](t), tW3[2](t), tW3[3](t), tW3[4](t), Math.exp(tW3[5](t)));
    return camL(t, P);
  };
  const lidOf = (t) => sio(u01(t, K.butOut + .5, K.close + .55));
  const darkOf = (t) => {
    const k = [[C2.end + .3, .45], [K.forDays + .05, .45], [K.forDays + .5, .02], [K.forDays + 1.0, .02], [K.forDays + 1.35, .9], [K.forDays + 1.75, .9], [K.keep - .45, .08], [K.keep + .3, .42], [K.heWas - .2, .42], [K.was + .5, .62]];
    if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * sio((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); return k[k.length - 1][1];
  };
  const mauArms = (t) => {
    const rail = (tt) => ({ at: canoeFrame(KC(tt), tt)(CANOE.SEP + .12, 1.36, MAU.w + .35) });
    const railU = sio(u01(t, K.keep - .2, K.keep + .4)) * (1 - sio(u01(t, K.heres + .6, K.heres + 1.4))), palmU = sio(u01(t, K.mauD - .4, K.mauD + .3)) * (1 - sio(u01(t, K.was - .3, K.was + .4)));
    return { r: { a: { a: 'knee', b: rail(t), u: railU }, b: 'palm', u: palmU }, l: { a: 'knee', b: 'palm', u: palmU } };
  };
  function frameW3(ctx, t) {
    const C = camW3(t), Kc = KC(t), F = canoeFrame(Kc, t), dark = darkOf(t), lidU = lidOf(t);
    drawSky(ctx, t, C, { mw: 1 });
    for (const s of crux([HD - .05, cruxEl(t)], -.55)) bigStar(ctx, t, C, s.dir, { a: .9, size: s.size, seed: s.size * 7 });
    if (lidU > 0) lid(ctx, t, C, { close: lidU, az: HD + .05, tone: 'overcast', drift: .03, lit: { az: C.yaw, a: .25 } });
    drawSea(ctx, t, C, {});
    seaTop(ctx, t, C, { a: clamp((C.pitch - .75) / .4) });
    // the grey-blue of the overcast over the water, and the strip of sky under the deck
    const gk = lidU * (1 - dark);
    if (gk > 0) { ctx.save(); ctx.globalAlpha = clamp(gk); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = TONE.overcast.sea; ctx.fillRect(0, Math.max(0, C.hy), 1920, 1080); ctx.restore(); }
    wake(ctx, t, C, Kc, { k0: 6, a: .35, foam: 1, from: -9.5, len: 600 });
    const r = canoeNav(ctx, t, C, Kc, { sails: 1, streamers: .6, nav: null });
    if (dark > 0) { ctx.save(); ctx.fillStyle = `rgba(3,4,10,${dark * .9})`; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
    // the fire stays bright in the dark, Mau in its light
    if (r.fire) { const k = r.fire[2]; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R0 = k * 6 * (1 + .05 * Math.sin(t * 7.3)), g = ctx.createRadialGradient(r.fire[0], r.fire[1], 0, r.fire[0], r.fire[1], R0); g.addColorStop(0, rgba('#ffb35c', .55 * dark + .1)); g.addColorStop(.35, rgba('#ff8a3a', .14 * dark)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(r.fire[0] - R0, r.fire[1] - R0, 2 * R0, 2 * R0); ctx.restore(); flames(ctx, t, r.fire[0], r.fire[1] + k * .22, k * 1.9); }
    const nod = .12 * sio(u01(t, K.keep - .2, K.keep + .5)) * (1 - sio(u01(t, K.mauD - .3, K.mauD + .3))) + .1 * sio(u01(t, K.mauD, K.mauD + .5));
    const m = navFigure(ctx, t, C, { at: F(MAU.u, 1.36, MAU.w), face: HD, pose: 'sit', arms: mauArms(t), hands: { r: 'open', l: 'open' }, light: F(...CANOE.fire), lit: .9, nod, seed: 2 });
    const rainA = .32 * sio(u01(t, K.forDays - .2, K.forDays + .6)) * (1 - .4 * dark);
    if (rainA > 0) rain(ctx, t, { a: rainA, ang: .2, n: 260 });
    // the ring round his chest (c03.17)
    const ru = u01(t, K.was - .05, K.was + .85);
    if (ru > 0 && m) { const ch = F(MAU.u, 1.36 + .36, MAU.w + .02); starRing(ctx, t, C, { c: ch, R: .95, u: ru, breath: 1, glow: 1 }); }
    // the clip's line closing into the horizon stays a moment as the last light on it
    const hl = 1 - sio(u01(t, C2.end + .3, C2.end + 1.2));
    if (hl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [lw, a] of [[22, .07], [7, .22], [1.8, .95]]) { ctx.strokeStyle = rgba(lw < 3 ? '#eefcff' : '#8fe6ff', a * hl); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-20, YC); ctx.lineTo(1940, YC); ctx.stroke(); } ctx.restore(); }
  }
  const YC = Math.round(camW3(C2.end + .3).hy);

  // ================================================================ W4 · YOUR table again: the open hand, the ink compass, the window
  const SH = { x: .04, z: .0, w: .34, aspect: 16 / 9, rot: 0 };
  const shW = (px, py) => { const K4 = sheetCorners(SH), u = px / 1920, v = py / (1920 / SH.aspect); return K4[0].map((_, i) => (1 - v) * ((1 - u) * K4[0][i] + u * K4[1][i]) + v * ((1 - u) * K4[3][i] + u * K4[2][i])); };
  K.r0 = K.butYou + .08; K.r1 = K.build + .25; K.c0 = K.r1 + .02; K.c1 = K.c0 + .45; K.p0 = K.c1 + .05; K.p1 = K.one - .05;
  const roseO = (t) => ({ x: 960, y: 540, R: 300, ring: eoX(u01(t, K.r0, K.r1)) * .999 + (t > K.r1 ? .001 : 0), cross: u01(t, K.c0, K.c1), points: [0, 1, 2, 3].map((i) => u01(t, K.p0 + i * (K.p1 - K.p0) / 4, K.p0 + (i + 1) * (K.p1 - K.p0) / 4)), t });
  let PEN = null;
  const sheetItem = { x: SH.x, z: SH.z, drawItem: (ctx, t, C) => { sheet(ctx, t, C, { ...SH, res: 1, n: 6, draw: (g, tt) => { const r = inkRose(g, tt, roseO(tt)); PEN = r.pen; } }); } };
  const ringGlow = (t) => sio(u01(t, K.carry - .1, K.carry + .9));
  const w4Keys = [
    [K.sw, DESK.lamp[0] + .01, DESK.lamp[1] + .03, DESK.lamp[2] - .1, .02, .25, 1400],
    [K.sw + .9, -.22, 1.32, -.3, .32, .82, 1350],
    [K.handYou + .3, -.18, 1.38, -.36, .28, .9, 1350],
    [K.mapC + .4, -.12, 1.42, -.38, .2, .95, 1360],
    [K.butYou + .25, .02, 1.36, -.36, .02, 1.12, 1380],
    [K.one - .2, .05, 1.38, -.4, 0, 1.08, 1380],
    [K.carry + .35, .32, 1.46, -1.08, -.04, .02, 1300],
    [K.carry + 1.0, .33, 1.5, -.98, -.04, -.04, 1320],
    [K.end, .27, 1.66, .30, 0, -.25, 1400],
  ];
  const camW4 = mkTrack(w4Keys);
  function yourOpenHand(ctx, t, C) {
    const inU = 1 - sio(u01(t, K.butYou - .35, K.butYou + .2)); if (inU <= 0) return;
    const back = 1 - inU, Wd = C.P(.13 - .02 * back, DESK.top + .012, -.22 - .35 * back), Tp = C.P(.06, DESK.top + .008 + .02 * back, -.02 - .35 * back); if (!Wd || !Tp) return;
    const sc = Math.hypot(Tp[0] - Wd[0], Tp[1] - Wd[1]) / 112, lp = C.P(...DESK.lamp);
    drawHand(ctx, Wd[0], Wd[1], sc, { pose: 'open', ang: Math.atan2(Tp[1] - Wd[1], Tp[0] - Wd[0]), flip: true, skin: '#c99a74', sleeve: '#2a2236', rim: '#ffb066', light: lp ? [lp[0] - Wd[0], lp[1] - Wd[1]] : [-.6, -1], t, sleeveLen: 420, close: .08 + .14 * sio(u01(t, K.mapC - .1, K.mapC + .6)) + .04 * Math.sin(t * .9) });
  }
  function yourPen(ctx, t, C) {
    const inU = sio(u01(t, K.butYou - .1, K.butYou + .3)) * (1 - sio(u01(t, K.one + .1, K.one + .7))); if (inU <= 0) return;
    const pp = PEN || [1500, 300], w = shW(pp[0], pp[1]), away = 1 - inU, p = C.P(w[0] + .1 * away, w[1] + .004 + .06 * away, w[2] - .25 * away); if (!p) return;
    const lp = C.P(...DESK.lamp), s = .17 * p[2] / 150;
    penHand(ctx, t, p[0], p[1], s, { lift: PEN ? 0 : .6, light: lp ? [lp[0] - p[0], lp[1] - p[1]] : [-.6, -1] });
  }
  function frameW4(ctx, t) {
    const C = camW4(t);
    room(ctx, t, C, { items: [sheetItem, cupI, ...BOOKS.map((b) => book(b))], lampKind: 'oil', glassPane: true, open: false, person: {}, reflect: { a: 1, ring: ringGlow(t) } });
    yourOpenHand(ctx, t, C);
    yourPen(ctx, t, C);
  }

  // ================================================================ the light between W3 and W4 (one light, two worlds)
  const [LMc, LMg] = canvas(1920, 1080);
  function lightSwell(ctx, t, x, y, R) {
    if (R <= 1) return;
    LMg.setTransform(1, 0, 0, 1, 0, 0); LMg.globalAlpha = 1; LMg.globalCompositeOperation = 'source-over'; plate(LMg, t, 'light', { tone: 'fire' });
    if (R < 4200) { LMg.globalCompositeOperation = 'destination-in'; const g = LMg.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.55, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); LMg.fillStyle = g; LMg.fillRect(0, 0, 1920, 1080); LMg.globalCompositeOperation = 'source-over'; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(LMc, 0, 0); ctx.restore();
  }

  // ================================================================ the frame
  function frame(ctx, t) {
    if (t < Q1.start) { frameS1(ctx, t); return; }
    if (t < Q1.end) { const qv = clamp((t - Q1.start) / (Q1.end - Q1.start)), u = Math.sin(Math.PI * qv); quoteCard(ctx, t, T, 'Q1', { ...Q1o, sky: { yaw: SKY0.yaw + .2 * u, pitch: SKY0.pitch - .11 * Math.sin(2 * Math.PI * qv), F: SKY0.F * (1 + .07 * Math.sin(3 * Math.PI * qv)) } }); return; }
    if (t < C2.start - .3) { frameW2(ctx, t); return; }
    if (t <= C2.end + .3) { clip(ctx, t, T, 'C2', { carrier: 'line', yOpen: ternY(), yClose: YC, ground: (c, tt) => (tt < C2.start + .2 ? frameW2(c, tt) : frameW3(c, tt)) }); return; }
    if (t < K.sw) {
      frameW3(ctx, t);
      const C = camW3(t), F = canoeFrame(KC(t), t), fp = C.P(...F(CANOE.fire[0], 1.62, CANOE.fire[2]));
      const u = u01(t, K.sw - .6, K.sw); if (u > 0 && fp) lightSwell(ctx, t, fp[0], fp[1], u >= 1 ? 5000 : 4400 * eiX(u) + 60 * u);
      return;
    }
    frameW4(ctx, t);
    const C = camW4(t), lp = C.P(...DESK.lamp), u = u01(t, K.sw, K.sw + .7);
    if (u < 1 && lp) lightSwell(ctx, t, lp[0], lp[1], u <= 0 ? 5000 : 4400 * (1 - eoX(u)));
  }
  prepareSky();
  await ready();
  return [
    { t: Hin.b, tr: 'cut', d: .1, draw: frame, print: Hin.print },
    { t: K.sw, tr: 'cut', d: .1, draw: frame, print: Hout.print },
  ];
}
