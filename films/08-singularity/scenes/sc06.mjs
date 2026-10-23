// Film 8 · c06 · draw your compass; the arrival (VO 03f, 03g) · builder B2 · shots.md §8 c06.01–c06.15.
// Three worlds, one camera each, joined by carriers: your table (out of the paper plate; the envelope; through the window glass into the
// grey lid), the sea under the lid (Hōkūleʻa, the signs, the heading line; the lid tears to dawn, Tahiti), and Papeete harbour at
// sunrise (out of the sun's glare: light), ending in a crane up into the morning sky (the sky dusk plate).
//
// shot  | VO (accent)                                         | image                                                    | carrier / camera
// 06.01 | So here's the ONE THING to try.                     | pull back off the sheet: four points lit; a pen rolls to us | paper plate → pull back
// 06.02 | TONIGHT, take a PEN and DRAW YOUR COMPASS.          | POV: your hands; the envelope turned over; ring + cross ★| POV push
// 06.03 | One word for each DIRECTION:                        | four short empty ink lines at the four points            | hold, drift
// 06.04 | what MATTERS, what PULLS you, who you'd CALL, … NEXT. | a word at N, E, S, W; the sheet's icon flares each time | small pushes
// 06.05 | Then add the NEEDLE.                                | the diamond needle, amber                                 | push in
// 06.06 | It doesn't PICK the direction.                      | a fingertip flicks the envelope: the needle swings free   | hold
// 06.07 | It keeps finding NORTH, however hard the compass SHAKES. | a gust: window rattles, lamp sways, table jolts; the needle returns | shake
// 06.08 | Remember the CLOUDS?                                | rise to the window: the grey lid outside; through the glass | crane up, push through
// 06.09 | When the stars disappeared, MAU didn't get a BETTER MAP. | Hōkūleʻa under the lid; a rolled chart bobs past       | descend, track
// 06.10 | He still had the SWELL, the WIND, the BIRDS.        | amber swell lines, wind on the sail, a tern               | three beats
// 06.11 | And he KEPT READING them.                           | Mau's palm on the hull; the three lines → one heading line| crane back
// 06.12 | About a MONTH after leaving Maui, Hōkūleʻa reached TAHITI. ★ | the lid tears: dawn gold, the peaks ahead          | pan ahead
// 06.13 | More than SEVENTEEN THOUSAND people … HARBOUR.      | out of the sun's glare: Papeete, the quay packed, torches, canoes | light carrier; slow push
// 06.14 | A canoe was never ONE PERSON'S journey.             | on deck the crew stands and waves; the lines are taken    | close
// 06.15 | Neither is THIS ONE.                                | crane up: crowd + boats + canoe one ring; tilt into the sky| sky dusk plate
import { clamp } from '../engine.mjs';
import { ready, camera, track, eoX, eiX, sio, u01, pulse, TAU, hash, projRuns } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky, skyDir } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { canoe, canoeFrame, tern } from '../lib/s8_nav.mjs';
import { lid, tone, wind } from '../lib/s8_cloud.mjs';
import { makeTown, drawTown } from '../lib/s8_harbour.mjs';
import { room, sheet, sheetCorners, penHand, DESK } from '../lib/s8_desk.mjs';
import { inkRose, needle } from '../lib/s8_rose.mjs';
import { crowd } from '../lib/s8_crowd.mjs';
import { label } from '../lib/s8_card.mjs';
import { hand } from '../lib/hand.mjs';
import { hand as handoff } from '../lib/handoff4.mjs';
import { growPlate, keys, vign, paperPatch } from '../lib/s8_b2kit.mjs';
import { envFront, envBack, envCorners, tablePen, floatRoll, peaks, outrigger } from '../lib/s8_c06_local.mjs';

export default async function (T, R) {
  const F = (p, n) => T.S('03f', p, n), G = (p, n) => T.S('03g', p, n);
  const HI = handoff('c05>c06', T), HO = handoff('c06>c07', T);
  const K = {
    in: HI.b, so: F('So here'), one: F('one thing'), try: F('try'), tonight: F('Tonight'), take: F('take'), pen: F('pen'), draw: F('draw'), compass: F('compass'),
    oneW: F('One word'), dir: F('direction'), matters: F('matters'), pulls: F('pulls'), call: F('call'), next: F('next'),
    then: G('Then'), needle: G('needle'), pick: G('pick'), keeps: G('keeps'), north: G('north'), however: G('however'), compass2: G('compass'), shakes: G('shakes'),
    remember: G('Remember'), clouds: G('clouds'), when: G('When the'), stars: G('stars'), mau: G('Mau'), map: G('better map'), he: G('He still'), swell: G('swell'),
    wind: G('wind'), birds: G('birds'), kept: G('kept'), reading: G('reading'), about: G('About'), month: G('month'), reached: G('reached'), tahiti: G('Tahiti'),
    more: G('More than'), seventeen: G('seventeen'), harbour: G('harbour'), canoe: G('A canoe'), never: G('never'), journey: G('journey'), neither: G('Neither'), thisOne: G('this one'), out: HO.a,
  };
  K.A1 = K.clouds + .55; K.B1 = K.about - .1; K.glare = K.more - .45;

  // ================================================================ your table: the sheet (c05's), the envelope, the pen
  const SH = { x: .05, z: .02, w: .56, aspect: 16 / 9, rot: 0, res: .6 }, SK = sheetCorners(SH);
  const onSheet = (px, py) => { const u = px / 1920, v = py / 1080; return [0, 1, 2].map((i) => (1 - v) * ((1 - u) * SK[0][i] + u * SK[1][i]) + v * ((1 - u) * SK[3][i] + u * SK[2][i])); };
  const MG = onSheet(1600, 830), MGQ = [[1305, 664], [1895, 664], [1895, 996], [1305, 996]].map(([x, y]) => onSheet(x, y)), mgH = 1400 * (SH.w * 590 / 1920) / 1920;
  // the icon flares on the sheet when each word lands on the envelope (N, E, S, W)
  const WORDT = [K.matters, K.pulls, K.call, K.next];
  const sheetRose = (t) => ({ x: 960, y: 540, R: 250, seed: 3, ring: 1, cross: 1, points: 1, letters: 1, icons: 1, lit: WORDT.map((w) => .55 + .45 * (1 - u01(t, K.in, K.so + 1)) + 1.2 * pulse(t, w + .05, w + .4)), t });
  const EV = { c: [-.06, DESK.top, -.32], w: .2, h: .125, rot: .1 }, EA = 1.6, EPW = 1920, EPH = 1200;
  const flip = (t) => sio(u01(t, K.take - .15, K.take + .55));
  // the jolts of the gust (table and envelope), the flick
  const JOLTS = [K.keeps + .15, K.north + .25, K.however + .2, K.compass2 + .05, K.shakes + .15];
  const jolt = (t) => { let x = 0, y = 0; for (const j of JOLTS) { const a = t - j; if (a > 0 && a < .5) { const e = Math.exp(-a * 9) * Math.sin(a * 55); x += e * .006; y += e * .004; } } return [x, y]; };
  const kicks = [{ t: K.pick - .25, amp: 2.7 }, ...JOLTS.map((j, i) => ({ t: j, amp: [.55, -.42, .5, -.36, .3][i] }))];
  const needleA = (t) => -Math.PI / 2 + needle(t, kicks, { settleT: 1.3 });
  const envOpts = (t) => {
    const ring = u01(t, K.draw - .1, K.compass + .45), cross = u01(t, K.compass + .35, K.oneW - .05);
    return { x: EPW / 2, y: EPH * .55, R: 330, seed: 9, ring, cross, points: [cross, cross, cross, cross], letters: 0, icons: 0, words: WORDT.map((w) => u01(t, w - .15, w + .35)),
      needle: t > K.needle - .4 ? needleA(t) : null, needleU: u01(t, K.needle - .35, K.needle + .45), t };
  };
  let envPen = null;
  const envItem = (t) => {
    const j = jolt(t), f = flip(t), ec = envCorners([EV.c[0] + j[0], EV.c[1], EV.c[2] + j[1]], EV.w, EV.h, EV.rot + 40 * j[0], f);
    return { x: EV.c[0], z: EV.c[2], corners: ec.corners, aspect: EA, res: .7, draw: (g, tt) => {
      if (!ec.back) { envFront(g, tt, EPW, EPH); return; }
      envBack(g, tt, EPW, EPH);
      const o = envOpts(tt), r = inkRose(g, tt, o); envPen = r.pen;
      // the four short empty lines for the words (06.03), one after another as the pen hops
      const lines = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      lines.forEach(([cx, cy], i) => { const u = u01(tt, K.oneW + .2 + i * .35, K.oneW + .45 + i * .35); if (u <= 0) return; const wx = o.x + cx * o.R * 1.55 + (cx < 0 ? -o.R * .7 : cx > 0 ? 0 : -o.R * .35), wy = o.y + cy * o.R * 1.5 + o.R * .1; g.strokeStyle = 'rgba(42,36,32,.75)'; g.lineWidth = 3; g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + o.R * .7 * u, wy + 2); g.stroke(); });
    }, ec };
  };
  const envW = (px, py, ec) => { const K4 = ec.corners, u = px / EPW, v = py / EPH; return [0, 1, 2].map((i) => (1 - v) * ((1 - u) * K4[0][i] + u * K4[1][i]) + v * ((1 - u) * K4[3][i] + u * K4[2][i])); };
  // the pen: rolls toward you across the table, stops at the frame edge; picked up on "pen"
  const penRoll = (t) => { const u = sio(u01(t, K.one - .3, K.try + .5)); return [.24 - .02 * u, DESK.top + .006, .02 - .36 * u]; };
  const PICK = K.pen - .1;
  // the outside world seen through the window (and entered through it): the sea under the grey lid, 8 m up
  const OY = 8;
  const toSea = (C) => camera({ x: C.x, y: C.y + OY, z: C.z, yaw: C.yaw, pitch: C.pitch, F: C.F });
  function deskFrame(ctx, t, Cd) {
    envPen = null;
    const ev = envItem(t), items = [{ ...SH, draw: (g, tt) => inkRose(g, tt, sheetRose(tt)) }, ev];
    const gust = Math.max(...JOLTS.map((j) => pulse(t, j - .2, j + .6)));
    const r = room(ctx, t, Cd, { items, person: null, outside: 1, wind: gust, outsideDraw: (cx, tt) => seaLid(cx, tt, toSea(Cd), { win: true }) });
    // the pen on the table until it is picked up
    if (t < PICK) { const p = penRoll(t); tablePen(ctx, t, Cd, [p[0] - .07, p[1], p[2]], [p[0] + .07, p[1], p[2]]); }
    // your hands (POV): the left holds the envelope while it turns, then rests at its corner; the right writes
    const skin = '#c99a74', sleeve = '#2a2236';
    const lh = Cd.P(...envW(-140, EPH * .8, ev.ec));
    const lhOn = u01(t, K.tonight + .1, K.take - .2) * (1 - u01(t, K.shakes + .6, K.remember + .2));
    if (lh && lhOn > 0) { const s = lh[2] * .19 / 150, flick = pulse(t, K.pick - .45, K.pick); hand(ctx, lh[0] - 60 * s * (1 - lhOn) * 4, lh[1] + 200 * s * (1 - lhOn) * 3, s, { pose: flick > 0 ? 'reach' : 'open', ang: -1.15 - .35 * flick, flip: true, skin, sleeve, sleeveLen: 520, rim: '#ffb066', light: [-.6, -1], t, close: .25 }); }
    let sp = null, lift = 0;
    if (t > PICK && t < K.shakes + .6) {
      if (envPen) sp = Cd.P(...envW(...envPen, ev.ec));
      else { const rest = t < K.draw ? [penRoll(PICK)[0], DESK.top + .04 * u01(t, PICK, PICK + .3), penRoll(PICK)[2] + .1 * u01(t, PICK, K.draw)] : envW(EPW * .78, EPH * .9, ev.ec).map((v, i) => (i === 1 ? v + .025 : v)); sp = Cd.P(...rest); lift = .7; }
      if (sp) { const s = sp[2] * .17 / 150; if (s > .2 && s < 8) penHand(ctx, t, sp[0], sp[1], s, { lift, ang: -.95, skin, sleeve }); }
    }
    vign(ctx, .35);
    return r;
  }
  const evC = [EV.c[0], EV.c[2]];
  // a camera that looks at a table point from distance d at pitch p (yaw 0), shifted dx sideways
  const aim = (q, d, p, F, dx = 0) => ({ x: q[0] + dx, y: q[1] + d * Math.sin(p), z: q[2] - d * Math.cos(p), pitch: p, F });
  const EVP = [EV.c[0], DESK.top, EV.c[2] + EV.h], MID = [.02, DESK.top, -.08];
  const camA = keys([
    [K.in, { x: MG[0], y: DESK.top + .001 + mgH, z: MG[2], yaw: 0, pitch: Math.PI / 2, F: 1400 }],
    [K.in + .7, { x: MG[0], y: DESK.top + .001 + mgH * .88, z: MG[2], pitch: Math.PI / 2, F: 1400 }],
    [K.one, aim(onSheet(1100, 640), .62, 1.32, 1400)],
    [K.try + .5, aim(MID, .78, 1.1, 1350)],
    [K.tonight + .4, aim(EVP, .58, 1.05, 1300, .02)],
    [K.draw, aim(EVP, .4, 1.2, 1400)],
    [K.dir, aim(EVP, .35, 1.3, 1450, .005)],
    [K.matters + .25, aim([EVP[0], EVP[1], EVP[2] + .035], .3, 1.3, 1480, .0)],
    [K.pulls + .25, aim([EVP[0] + .05, EVP[1], EVP[2] + .01], .31, 1.28, 1470)],
    [K.call + .25, aim([EVP[0] + .01, EVP[1], EVP[2] - .03], .3, 1.32, 1490)],
    [K.next + .25, aim([EVP[0] - .05, EVP[1], EVP[2]], .32, 1.28, 1460)],
    [K.next + .9, aim(EVP, .37, 1.25, 1420, .015)],
    [K.needle + .5, aim(EVP, .29, 1.36, 1500)],
    [K.keeps, aim(EVP, .46, 1.12, 1380, .02)],
    [K.shakes + .3, aim([0, DESK.top, -.02], .8, .85, 1250)],
    [K.remember + .25, { x: 0, y: 1.42, z: -.2, pitch: .14, F: 1250 }],
    [K.A1, { x: 0, y: 1.48, z: DESK.wallZ + .3, pitch: .04, F: 1300 }],
  ]);
  const shake = (t) => { let a = 0; for (const j of JOLTS) { const d = t - j; if (d > 0 && d < .45) a += Math.exp(-d * 8) * Math.sin(d * 48); } return a; };

  // ================================================================ the sea under the lid; Hōkūleʻa; dawn and Tahiti
  const CN = (t) => ({ x: 6, z: 64 + 2.2 * (t - K.A1), head: 0 });
  const TAZ = .3;   // Tahiti and the dawn lie ahead-right (the sky dusk plate's yaw)
  const dawnK = (t) => sio(u01(t, K.about - .1, K.tahiti));
  function seaLid(ctx, t, C, o = {}) {
    const dk = dawnK(t);
    drawSky(ctx, t, C, { stars: 0, mw: 0, dawn: .85 * dk, dawnAz: TAZ });
    drawSea(ctx, t, C, { dawn: .6 * dk, calm: .3 });
    tone(ctx, C, 'overcast', 1 - dk);
    if (dk > .02) peaks(ctx, t, C, { az: TAZ + .05, w: .32, h: .1, dawn: dk, seed: 5 });
    lid(ctx, t, C, { close: 1, tear: dk, tearAz: TAZ, tearW: .9, tone: 'overcast', base: .03 });
    return null;
  }
  // the signs (06.10) and the heading line (06.11), canoe-relative
  const fr = (t) => canoeFrame(CN(t), t);
  function signs(ctx, t, C) {
    const f = fr(t), sw = u01(t, K.swell - .2, K.swell + .4), wn = u01(t, K.wind - .2, K.wind + .3), bd = u01(t, K.birds - .3, K.birds + 1.0), cv = sio(u01(t, K.kept, K.reading + .6));
    const AHEAD = f(0, .1, 46);
    const line = (pts, a, w = 1) => { for (const run of projRuns(C, pts)) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const [lw, al] of [[9 * w, .08], [3.5 * w, .25], [1.4 * w, .9]]) { ctx.strokeStyle = `rgba(255,179,92,${al * a})`; ctx.lineWidth = lw; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } ctx.restore(); } };
    // the swell: amber crest lines under the hull, rolling in from the starboard quarter; they converge into the heading line
    if (sw > 0) for (let k = -2; k <= 2; k++) { const pts = []; for (let i = 0; i <= 30; i++) { const s = -16 + i * 32 / 30, z0 = k * 7 + ((t * 1.6) % 7); const P = f(s, .08, z0 + s * .35); pts.push(cv > 0 ? P.map((v, j) => v + (AHEAD[j] - v) * cv * clamp(1 - Math.abs(k) * .2) * (i / 30)) : P); } line(pts, sw * (1 - .6 * cv) * (k === 0 ? 1 : .7)); }
    // the wind: streaks along the sail (screen space), then a world line from the windward side to the heading
    if (wn > 0) { const m = C.P(...f(0, 7, 3)); if (m) wind(ctx, t, { a: .55 * wn * (1 - cv), dir: 1, col: '#ffb35c', y0: m[1] - 260, y1: m[1] + 160, n: 22, speed: .8 }); line([f(-30, 6, -8), f(-14, 4, 10), f(-4, 2, 30), AHEAD].slice(0, 2 + Math.round(2 * cv)), wn * .7 * (.4 + .6 * cv)); }
    // the tern: crosses ahead of the bow and leaves its line
    if (bd > 0) { const path = (u) => { const p = f(-26 + 52 * u, 6 + 2 * Math.sin(u * 5), 22 + 6 * Math.sin(u * 2.4)); return cv > 0 ? p.map((v, j) => v + (AHEAD[j] - v) * cv * Math.sin(u * Math.PI)) : p; }; tern(ctx, t, C, { path, u: clamp(bd), trail: .6, s: .5, line: .8 }); }
    // the heading line: one amber line from the bow ahead into the grey
    if (cv > 0) line([f(0, .2, 9.5), AHEAD, f(0, .2, 46 + 200 * cv)], cv, 1.4);
  }
  const RF = (t) => { const c = CN(t); return [c.x - 3.4, 0, CN(K.mau).z + 9]; };   // the chart floats, the canoe sails past it
  // camera B: canoe-relative position and look target, [t, dx, dy, dz, tx, ty, tz, F]
  const BK = [
    [K.A1, null],
    [K.stars, -16, 6, -26, 0, 3, 0, 1200],
    [K.mau + .2, -9, 2.6, -14, 0, 1.6, -6.4, 1350],
    [K.map + .2, -7.5, 2.2, 3, -3.4, .2, 9, 1300],
    [K.swell, -9, 5.5, -2, 0, 0, 2, 1200],
    [K.wind, -14, 3.5, -1, 0, 6, 3, 1150],
    [K.birds + .2, -16, 3, 2, -2, 6, 22, 1150],
    [K.kept + .3, -4.2, 2.4, -9.5, -1.1, 1.3, -6.3, 1350],
    [K.reading + .7, -3, 5.5, -22, 0, 1.5, 40, 1200],
    [K.month, -6, 4.2, -20, 0, 2, 30, 1200],
    [K.tahiti + .2, -5, 3.6, -16, 6, 6, 300, 1250],
    [K.glare, -4, 3.4, -14, 20, 10, 400, 1300],
  ];
  const a1 = toSea(camA(K.A1)), c1 = CN(K.A1);
  BK[0] = [K.A1, a1.x - c1.x, a1.y, a1.z - c1.z, a1.x - c1.x + Math.sin(a1.yaw) * 50, a1.y - Math.tan(a1.pitch) * 50, a1.z - c1.z + Math.cos(a1.yaw) * 50, a1.F];
  const bt = [1, 2, 3, 4, 5, 6, 7].map((j) => track(BK.map((k) => [k[0], k[j]])));
  const camB = (t) => {
    const c = CN(t), p = [c.x + bt[0](t), bt[1](t), c.z + bt[2](t)], q = [c.x + bt[3](t), bt[4](t), c.z + bt[5](t)];
    const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
    return camera({ x: p[0], y: p[1], z: p[2], yaw: Math.atan2(dx, dz), pitch: Math.atan2(-dy, Math.hypot(dx, dz)), F: bt[6](t) });
  };
  // the sun at dawn (the glare carrier into Papeete)
  const SUN = [TAZ + .06, .035];
  function sun(ctx, C, a = 1) {
    const p = C.D(...skyDir(...SUN)); if (!p) return null;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 420); g.addColorStop(0, `rgba(255,241,214,${.9 * a})`); g.addColorStop(.08, `rgba(255,217,160,${.5 * a})`); g.addColorStop(.4, `rgba(244,167,122,${.15 * a})`); g.addColorStop(1, 'rgba(244,167,122,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - 420, p[1] - 420, 840, 840);
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#fff6e2'; ctx.beginPath(); ctx.arc(p[0], p[1], 22, 0, TAU); ctx.fill();
    ctx.restore(); return p;
  }
  function underLid(ctx, t, C) {
    seaLid(ctx, t, C);
    if (t > K.about - .2) sun(ctx, C, dawnK(t));
    const rp = RF(t); floatRoll(ctx, t, C, rp, { ang: .4, len: 1.1 });
    const o = canoe(ctx, t, C, CN(t));
    signs(ctx, t, C);
    // Mau's palm flat on the hull (06.11)
    const pm = u01(t, K.kept - .2, K.kept + .2) * (1 - u01(t, K.reading + .6, K.reading + .9));
    if (pm > 0) { const p = C.P(...fr(t)(-1.05, 1.3, -6.0)); if (p) { const s = p[2] * .2 / 150; hand(ctx, p[0], p[1] - 4 * (1 - pm), s, { pose: 'open', ang: .1, skin: '#6a4630', sleeve: null, rim: '#ffb066', light: o.fire ? [o.fire[0] - p[0], o.fire[1] - p[1]] : [1, -1], t }); } }
    // the label: Tahiti
    const lp = C.D(...skyDir(TAZ + .05 - .05, .09)); if (lp) label(ctx, t, lp[0], lp[1], u01(t, K.tahiti - .1, K.tahiti + .5) * (1 - u01(t, K.glare - .3, K.glare)), 'TAHITI', 'JUNE 1976', { len: 110, dx: 70 });
    vign(ctx, .4);
    return o;
  }

  // ================================================================ Papeete harbour at sunrise (harbour centre HC, the town beyond it toward +Z)
  const HC = [0, 40];
  const TOWN = makeTown({ x: 0, z: 82, face: -1, w: 220, depth: 60, rise: 22, n: 90, seed: 33 });
  const PEOPLE = (() => { const a = []; let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 240; i++) { const th = -1.75 + 3.5 * r(), rr = 34 + 9 * r(); a.push({ x: HC[0] + Math.sin(th) * rr, z: HC[1] + Math.cos(th) * rr, h: 1.55 + r() * .35, pose: 'stand', seed: i * 13 + 5, hold: i % 9 === 0 ? 'torch' : null }); } return a; })();
  const CANOES = Array.from({ length: 10 }, (_, i) => ({ th: Math.PI - 1.35 + 2.7 * i / 9, rr: 30 + 6 * hash(i), ph: hash(i * 3) * 6 }));
  const HK = (t) => ({ x: 0, z: 26 + 30 * sio(u01(t, K.glare - .1, K.never + .5)), head: 0 });
  const CREW = [[-1.4, -3], [1.4, -3.5], [-1.3, 1], [1.5, .5], [-1.4, 4.2], [1.3, 4.5], [0, -6.4], [-.2, 2.6]];
  const camC = keys([
    [K.glare, { x: -6, y: 3.2, z: -18, yaw: SUN[0] - .02, pitch: -.03, F: 1250 }],
    [K.seventeen + .6, { x: -4, y: 6.5, z: -6, yaw: .14, pitch: .06, F: 1200 }],
    [K.harbour + .4, { x: 3, y: 8.5, z: 8, yaw: .04, pitch: .1, F: 1200 }],
    [K.canoe, { x: 9, y: 3.6, z: 44, yaw: -.62, pitch: .1, F: 1300 }],
    [K.journey, { x: 8, y: 3.4, z: 49, yaw: -.5, pitch: .08, F: 1350 }],
    [K.neither, { x: 6, y: 9, z: 40, yaw: -.1, pitch: .4, F: 1250 }],
    [K.out - 1.2, { x: 2, y: 34, z: -26, yaw: TAZ * .5, pitch: .42, F: 1150 }],
    [K.out, { x: 0, y: 44, z: -30, yaw: HO.o.yaw, pitch: HO.o.pitch, F: HO.o.F }],
  ]);
  function papeete(ctx, t, C) {
    const dw = .85 - .3 * u01(t, K.neither, K.out);   // at the end the sky is the sky dusk plate (dawn .55)
    const toPlate = u01(t, K.neither, K.out);   // stars and Milky Way come up to the plate's sky as the camera tilts up
    drawSky(ctx, t, C, { stars: .2 + .8 * toPlate, mw: .2 + .8 * toPlate, dawn: dw, dawnAz: TAZ });
    const sp = sun(ctx, C, 1 - u01(t, K.out - .9, K.out - .1));
    drawSea(ctx, t, C, { dawn: .8, glints: sp ? [{ x: sp[0], y: C.hy, col: '#ffd9a0', a: .9, w: 140, spread: .5 }] : [], lift: .15 });
    peaks(ctx, t, C, { az: TAZ + .05, w: .5, h: .115, dawn: 1, seed: 5 });
    drawTown(ctx, t, C, TOWN, { tone: 'dawn', dawn: .3, lit: .5, lamps: .6 });
    const lightP = [HC[0] + 300, 40, HC[1] + 900];
    crowd(ctx, t, C, PEOPLE.map((p, i) => ({ ...p, raise: t > K.canoe - .3 && i % 4 === 0 ? .5 + .5 * Math.sin(t * 5 + i) : 0 })), { light: lightP, lightCol: '#ffd09a', lamp: 1 });
    // the canoes paddling out, forming the near half of the ring
    for (const [i, c] of CANOES.entries()) { const th = c.th + .02 * Math.sin(t * .3 + c.ph); outrigger(ctx, t, C, { x: HC[0] + Math.sin(th) * c.rr, z: HC[1] + Math.cos(th) * c.rr, head: th + Math.PI / 2 * (i % 2 ? 1 : -1), phase: c.ph, lit: i % 3 === 0 ? 1 : 0 }); }
    const hk = HK(t), o = canoe(ctx, t, C, hk), f = canoeFrame(hk, t);
    // the crew stands and waves (06.14)
    const up = u01(t, K.canoe - .2, K.canoe + .4);
    if (up > 0) crowd(ctx, t, C, CREW.map(([u, w], i) => { const p = f(u, 0, w); return { x: p[0], z: p[2], h: 1.7, pose: 'stand', seed: 300 + i, raise: up * (.55 + .45 * Math.sin(t * 6 + i * 1.7)) }; }), { y: f(0, 1.3, 0)[1], light: lightP, lightCol: '#ffd09a' });
    // the lines taken from the quay
    const ln = u01(t, K.never - .2, K.journey + .2);
    if (ln > 0) for (const sd of [-1, 1]) { const a = C.P(...f(sd * 1.2, 1.7, 9.2)), b = C.P(HC[0] + sd * 3.5, 1.3, HC[1] + 34); if (a && b) { ctx.strokeStyle = 'rgba(232,214,180,.85)'; ctx.lineWidth = Math.max(1, a[2] * .02); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 30 * (1 - ln), a[0] + (b[0] - a[0]) * ln, a[1] + (b[1] - a[1]) * ln); ctx.stroke(); } }
    const lp = C.P(HC[0], 14, HC[1] + 40); if (lp) label(ctx, t, lp[0], lp[1], u01(t, K.seventeen - .1, K.seventeen + .5) * (1 - u01(t, K.harbour + .6, K.harbour + .9)), 'PAPEETE', '4 JUNE 1976', { len: 120, dx: 80 });
    return { sun: sp };
  }

  // ================================================================ the frame
  prepareSky();
  await ready();
  const frame = (ctx, t) => {
    if (t < K.A1) {
      const c = camA(t), sh = shake(t), br = u01(t, K.in + .8, K.in + 1.6);   // a hand-held breath over the table
      const Cd = camera({ x: c.x + .004 * sh + br * .006 * Math.sin(t * .9), y: c.y + .003 * sh + br * .004 * Math.sin(t * 1.3 + 1), z: c.z + br * .006 * Math.sin(t * .7 + 2), yaw: c.yaw + .006 * sh + br * .01 * Math.sin(t * .8 + .5), pitch: c.pitch + br * .008 * Math.sin(t * 1.1 + 3), F: c.F });
      if (Cd.z < DESK.wallZ) { deskFrame(ctx, t, Cd); paperPatch(ctx, t, Cd, MGQ, 1 - u01(t, K.in + .1, K.in + .65)); }
      else { seaLid(ctx, t, toSea(Cd)); vign(ctx, .4); }
      return;
    }
    if (t < K.glare) {
      const C = camB(t), o = underLid(ctx, t, C), sp = C.D(...skyDir(...SUN));
      if (sp) growPlate(ctx, t, 'light', { tone: 'dawn' }, sp[0], sp[1], eiX(u01(t, K.glare - .5, K.glare - .04)));
      return;
    }
    const C = camC(t), o = papeete(ctx, t, C), sp = o.sun || [960, 500];
    growPlate(ctx, t, 'light', { tone: 'dawn' }, sp[0], sp[1], 1 - eoX(u01(t, K.glare, K.glare + .5)));
    if (t < K.out - .7) vign(ctx, .35);
  };
  const PR = { riso: .35 };
  return [
    { t: K.in, tr: 'cut', d: .1, draw: frame, print: HI.print },
    { t: K.in + .3, tr: 'cut', d: .1, draw: frame, print: PR },
    { t: K.out - .1, tr: 'cut', d: .1, draw: frame, print: HO.print },
  ];
}
