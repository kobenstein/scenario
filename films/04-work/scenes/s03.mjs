// Chapter 03 · first half · "The slump, and the turn" (VO 03a + 03b up to "Big lottery winners.")
// Window: T.seg('03a').start - 1.2  →  T.S('03b', 'Researchers in Sweden') - 0.5 (then s03b: a snowy Swedish street).
//
// CARRIER CHAIN (shot → carrier → next, type)
//  (in)  hill builder: the last daylight slides off the frame top → [down] our sky is still sinking as we land (a)
//  3.01  your house at night, the light on, nothing moves; leaves fall outside; on "changes" the lamp dims
//        → the dim window → zoom (b)
//  3.02  inside: the same sofa from four angles, a smeared film strip running left, fastest on "blur"
//        → the smear keeps running left → [left] (c)
//  3.03  K3: you sink into the sofa, cyan screen light flickers on "One" → push into the screen → zoom (b)
//  3.04  the screen: the progress bar refills, snaps back on "another" → the bar bends and whips up → [down] (c)
//  3.05  over-the-shoulder phone: cards fly up; the moon crosses the window on "midnight"
//        → the moon slides into the rim of a wine glass → zoom (b, circle = circle)
//  3.06  the glass on a sunny sill at four: wrong light; wine pours on "four" → push into the wine → zoom (b)
//  3.07  the second glass slides in and clinks on "second" → the clink ring expands → iris (a)
//  3.08  harbour front at night; fog rolls in from the sea and swallows window after window
//        → the fog bank rolls toward the camera → fog (c)
//  3.09  you again, same slump, glass in hand; the screen light breathes on "don't" → push into the glass's reflection → zoom (b)
//  3.10  pull out of the reflection into a grid of identical lit sofas from above, big pull-back on "fear"
//        → the grid slides down → [up] (a)
//  3.11  a hand loosens on the remote; it tilts and falls in slow motion on "numb" → the falling remote → [down] (c)
//  3.12  the remote lands as a pebble in a night pond; rings on "honest" → push into the rings → zoom (b)
//  3.13  a night bus, side view, heads against the glass; one nods off on "now" → the travelling bus → [left] (c)
//  3.14  a hand in a work glove reaches past keys for the remote on "nine"; the glove slips off and drops → [up] (a)
//  3.15  three glasses; a hand with a hospital wristband pours the third on "third" → the pour pushes us in → push (c)
//  3.16  the nurse on the bed edge, boots on; rubs her neck on "lazy" → her hand drops, we push to her shoulders → zoom (b)
//  3.17  her shoulders round forward on "exhausted" → the shoulder line becomes the harbour roofline → match (b)
//  3.18  the harbour: the same window as 0.15 flickers on "guess" → the spark rises → [up] (a)
//  3.19  a river of people across a bridge at dawn, leaning forward; one shared step on "have-to" → the march → [left] (c)
//  3.20  one person stops, the crowd ripples away; still hunched on "tired"; first rose → push into the hunched shadow → zoom (b)
//  3.21  a dog walks its loop around a garden whose fence is gone ("outlasts") → the circling path → iris (c)
//  3.22  back in K3: the amber seam in the curtain widens on "slump" → push into the seam → zoom (b)
//  3.23 ★ the curtain yanked open on "hangover"; light floods; the arm lowers on "destiny" → the light stripe sweeps right → [left] (a)
//  3.24  the ticket on the kitchen table, stamped; glint on "message" → the ticket flutters up → [up] (a)
//  3.25  confetti over a small square, one person looks up on "winners"; the confetti cools into snow,
//        one flake centred → (out) s03b's snowy street
import { W, H, P, C as CC, rgba, clamp, mix, prng, shade, mixHex, layer, plate, put, stipple, maskLinear, maskRadial, roughPoly, roughRect, roughLine, roughPath, hatch, fog, cone, pool, once, evict, L, Lp, cam, fig, glowA, bloomSprite, stamp, vg, rg, washLayer, finish, vnoise, fbm, drift } from '../lib/s03_kit.mjs';
import { drawRoom, R as ROOM, tvCentre, curtain, wineGlass } from '../lib/s03_room.mjs';
import { drawHarbour, harbour, HB } from '../lib/s03_harbour.mjs';
import { houseSet, HOUSE, gridSet, GRID, pondSet, POND, busSet, BUS, bridgeSet, BR, gardenSet, GARD, loopPt, squareSet } from '../lib/s03_sets.mjs';
import { hand, remote, wine, ticket, keys } from '../lib/s03_close.mjs';
import { limb, qpts } from '../lib/art.mjs';

const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const eout = (x) => 1 - Math.pow(1 - clamp(x), 3), ein = (x) => Math.pow(clamp(x), 3), eio = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lin = (a, b, t) => clamp((t - a) / (b - a));
const expo = (x) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x));   // entrance ease (.16,1,.3,1)-like

export default async (T) => {
  const w = (seg, ph, n) => T.S(seg, ph, n), we = (seg, ph, n) => T.E(seg, ph, n);
  const t0 = T.seg('03a').start - 1.2, tEnd = T.S('03b', 'Researchers in Sweden') - .5;
  // word anchors
  const A = {
    changes: w('03a', 'changes'), blur: w('03a', 'blur'), one: w('03a', 'One more'), another: w('03a', 'another'), midnight: w('03a', 'midnight'),
    four: w('03a', 'four'), second: w('03a', 'second'), everyEvening: w('03a', 'Every evening'), sundayEv: w('03a', 'Sunday evening'), dont1: w('03a', "don't have"), dont2: w('03a', "you don't", 0),
    fear: w('03b', 'fear'), numb: w('03b', 'numb ourselves'), honest: w('03b', 'honest'), now: w('03b', 'now'), nine: w('03b', 'nine'), third: w('03b', 'third'),
    lazy: w('03b', 'lazy'), exhausted: w('03b', 'exhausted'), guess: w('03b', 'guess'), haveTo: w('03b', 'have-to'), tired: w('03b', 'tired', 1), outlasts: w('03b', 'outlasts'),
    slump: w('03b', 'slump'), hangover: w('03b', 'hangover'), destiny: w('03b', 'destiny'), message: w('03b', 'message'), winners: w('03b', 'winners'),
  };
  A.dont2 = T.S('03a', "So you don't") + .64;   // the second "don't"
  const ST = [t0, 117.45, 119.62, 121.2, 122.3, 125.4, 128.15, 129.4, 132.35, 135.9, 141.05, 143.45, 145.95, 148.3, 152.35, 154.2, 156.3, 158.5, 160.75, 164.4, 169.7, 174.05, 175.65, 178.6, 181.55];
  const nxt = (i) => ST[i + 1] ?? tEnd;
  const shots = [];
  const add = (i, o) => shots.push({ t: ST[i], ...o });

  // ============================================================== 3.01 the house at night
  const cam1 = (t) => { const u = lin(ST[0], nxt(0) + .4, t); const land = 1 - eout(lin(ST[0] - .6, ST[0] + 1.6, t)); return { ...cam(t, { z: mix(1.05, 1.28, eio(u)), amp: .7 }), x: mix(0, 60, eio(u)) + drift(t, 10), y: mix(0, 40, eio(u)) - 160 * land * 0 + drift(t, 6, 2), land }; };
  const winC = () => [(HOUSE.win[0][0] + HOUSE.win[2][0]) / 2, (HOUSE.win[0][1] + HOUSE.win[2][1]) / 2];
  add(0, { tr: 'down', d: 1.2, draw(ctx, t, s) {
    evict(t); const hs = houseSet(s.b), C1 = cam1(t), land = C1.land;
    // landing from the hill's sky: the whole set still drifts upward for the first beat, the far layers less
    const Cs = { ...C1, y: C1.y + 220 * land }, Cf = { ...C1, y: C1.y + 260 * land }, Ct = { ...C1, y: C1.y + 330 * land };
    L(ctx, Cs, .35, (g) => { g.drawImage(hs.sky, 0, 0); });
    // the last violet of the dusk leaving the top of frame
    if (land > 0) { const gr = ctx.createLinearGradient(0, 0, 0, 500); gr.addColorStop(0, rgba('#c98aa0', .45 * land)); gr.addColorStop(1, rgba('#c98aa0', 0)); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, 500); }
    L(ctx, Cf, .7, (g) => {
      g.drawImage(hs.front, 0, 0);
      // the window: inside a warm lamp + the cold cyan of a screen; nothing moves; on "changes" the lamp goes out
      const dim = sm(lin(A.changes, A.changes + .5, t)), q = HOUSE.win;
      g.save(); g.beginPath(); roughPath(g, q, { amp: .4, seed: 7 }); g.clip();
      vg(g, [[0, mixHex('#ffcf8a', '#3a6a9a', dim)], [1, mixHex('#c27a3a', '#16305a', dim)]], 780, 0, 1010, 0, [770, 380, 250, 230]);
      const fl = .75 + .25 * Math.sin(t * 19) * Math.sin(t * 5.3);
      glowA(g, 800, 540, 200, .35 * fl, P.cy, P.cyw);
      // the back of a sofa and a head, still
      g.fillStyle = mixHex('#2a1a14', '#08102a', dim); g.beginPath(); g.roundRect(800, 540, 200, 70, 18); g.fill();
      g.beginPath(); g.ellipse(912, 528, 17, 20, .1, 0, 7); g.fill();
      // curtain edges in the window
      g.fillStyle = mixHex('#7a3a2a', '#141a3a', dim); g.fillRect(780, 390, 26, 210); g.fillRect(986, 400, 26, 200);
      g.strokeStyle = '#1b2152'; g.lineWidth = 6; g.beginPath(); g.moveTo(895, 400); g.lineTo(895, 600); g.moveTo(780, 500); g.lineTo(1010, 505); g.stroke();
      g.restore();
      // the light the window throws onto the hedge and path
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 1;
      const sp = once('h-spill', s.b, () => washLayer(900, 900, 420, '#ffb35c', .3, { sy: .35, k: .7, seed: 5 })), sc = once('h-spillc', s.b, () => washLayer(900, 900, 420, P.cy, .22, { sy: .35, k: .7, seed: 6 }));
      g.globalAlpha = 1 - dim; g.drawImage(sp, 0, 0); g.globalAlpha = .4 + .6 * dim * fl; g.drawImage(sc, 0, 0); g.restore();
      stamp(g, bloomSprite('w1', mixHex(P.amb, P.cy, dim), mixHex(P.hot, P.cyw, dim)), 895, 495, 230, .28);
    });
    // leaves keep moving outside: the tree sways, leaves fall through the frame
    L(ctx, Ct, 1.25, (g) => { g.save(); g.translate(-140, 0); g.translate(150, H); g.rotate(Math.sin(t * .9) * .012); g.translate(-150, -H); g.drawImage(hs.tree, 0, 0); g.restore(); });
    { const r = prng(11); for (let i = 0; i < 16; i++) { const sp = .4 + r(), ph = r() * 10, x0 = r() * W, y = ((t * 70 * sp + r() * H) % (H + 80)) - 40, x = x0 + Math.sin(t * 1.3 * sp + ph) * 50; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 * sp + ph); ctx.fillStyle = rgba(i % 3 ? '#1a2048' : '#3a3050', .9); ctx.beginPath(); ctx.ellipse(0, 0, 9, 4, 0, 0, 7); ctx.fill(); ctx.restore(); } }
    finish(ctx);
  } });

  // ============================================================== 3.02 the days blur (smeared film strip of the sofa)
  const panels = (until) => once('blur-panels', until, () => {
    const [big, bx] = layer(); const out = [];
    const views = [{ z: 1.05, x: 0, y: 0, tv: 1 }, { z: 1.7, x: 120, y: -160, tv: .7 }, { z: 1.35, x: 380, y: -40, tv: 1.2 }, { z: 2.1, x: 820, y: -220, tv: .9 }];
    views.forEach((v, i) => { bx.fillStyle = P.ind; bx.fillRect(0, 0, W, H); drawRoom(bx, { C: { x: v.x, y: v.y, z: v.z }, t: 3 + i * 1.7, until, mode: 'night', tv: v.tv, seam: 1 }); const [c, g] = layer(W / 2, H / 2); g.drawImage(big, 0, 0, W / 2, H / 2); out.push(c); });
    return out;
  });
  const blurX = (t) => { const a = ST[1] - .5, sp = (tt) => 900 + 2600 * Math.exp(-Math.pow((tt - A.blur - .2) / .5, 2)) + 1800 * lin(nxt(1) - .4, nxt(1) + .3, tt); let x = 0; for (let tt = a; tt < t; tt += 1 / 60) x += sp(tt) / 60; return { x, v: sp(t) }; };
  add(1, { tr: 'zoom', d: .8, x: 0, y: 0, depth: 5, draw(ctx, t, s) {
    evict(t); const pn = panels(s.b), { x, v } = blurX(t), PW = W * 1.06;
    ctx.fillStyle = '#05061a'; ctx.fillRect(0, 0, W, H);
    const smear = clamp(v / 3500), base = -((x % (PW * 4)) + PW * 4) % (PW * 4);
    for (let k = 5; k >= 0; k--) {
      const off = k * smear * 46; ctx.globalAlpha = k ? .16 * smear * (1 - k / 6) : 1;
      for (let i = -1; i < 6; i++) { const px = base + i * PW + off, p = pn[((i % 4) + 4) % 4]; if (px > W || px + PW < 0) continue; ctx.drawImage(p, px, -20 + Math.sin(i * 2.1) * 10, PW, H * 1.04); }
    }
    ctx.globalAlpha = 1;
    // the seams between frames: soft dark gaps (a film strip that melts)
    for (let i = -1; i < 6; i++) { const px = base + i * PW; if (px < -200 || px > W + 200) continue; const gr = ctx.createLinearGradient(px - 90, 0, px + 90, 0); gr.addColorStop(0, rgba('#05061a', 0)); gr.addColorStop(.5, rgba('#05061a', .75 - smear * .4)); gr.addColorStop(1, rgba('#05061a', 0)); ctx.fillStyle = gr; ctx.fillRect(px - 90, 0, 180, H); }
    // a cold cast over everything + horizontal streaks when fast
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = rgba(P.cy, .25); ctx.fillRect(0, 0, W, H); ctx.restore();
    if (smear > .15) { const r = prng(Math.floor(t * 30)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { ctx.fillStyle = rgba(P.cy, .05 * smear); ctx.fillRect(r() * W, r() * H, 200 + r() * 600 * smear, 1.5); } ctx.restore(); }
    finish(ctx, { vig: .45 });
  } });

  // ============================================================== 3.03 K3: one more episode
  const cam3 = (t) => { const land = 1 - eout(lin(ST[2] - .3, ST[2] + .9, t)), u = lin(ST[2], nxt(2), t); return { ...cam(t, { z: mix(1.06, 1.16, eio(u)), amp: .6 }), x: drift(t, 10) + 260 * land + mix(0, 160, eio(u)), y: drift(t, 6, 2) + mix(0, 20, eio(u)) }; };
  add(2, { tr: 'left', d: .5, draw(ctx, t, s) {
    evict(t); const one = Math.exp(-Math.pow((t - A.one - .05) / .12, 2));
    drawRoom(ctx, { C: cam3(t), t, until: s.b, mode: 'night', tv: 1 + 1.2 * one, seam: 1.5 });
    finish(ctx);
  } });

  // ============================================================== 3.04 the progress bar refills
  const barY = 820, barX0 = 360, barX1 = 1560;
  add(3, { tr: 'zoom', d: .55, ...(() => { const [x, y] = Lp(cam3(ST[3]), .55, ...tvCentre()); return { x, y, depth: 7 }; })(), draw(ctx, t, s) {
    evict(t);
    const scr = once('screen', s.b, () => plate(W, H, (g, c) => {
      vg(g, [[0, '#0d2a3a'], [1, '#04121c']], 0, 0, 0, H);
      // the paused show, soft: the cyan mountains of the TV plate, huge
      roughPoly(g, [[0, 760], [520, 420], [860, 600], [1280, 330], [1920, 700], [1920, 1080], [0, 1080]], '#1e6e8a', { amp: 6, seed: 3 });
      roughPoly(g, [[0, 900], [700, 640], [1300, 760], [1920, 600], [1920, 1080], [0, 1080]], '#155a74', { amp: 6, seed: 4 });
      g.fillStyle = '#bfefff'; g.beginPath(); g.arc(1300, 240, 90, 0, 7); g.fill();
      const [bc, bx] = layer(); bx.filter = 'blur(14px)'; bx.drawImage(c, 0, 0); g.clearRect(0, 0, W, H); g.globalAlpha = .55; g.drawImage(bc, 0, 0); g.globalAlpha = 1;
      // the "next episode" card: a thumbnail block
      roughRect(g, 1220, 520, 400, 225, '#2a8aa8', { amp: 1, seed: 5 }); roughPoly(g, [[1220, 700], [1360, 610], [1460, 660], [1620, 580], [1620, 745], [1220, 745]], '#1a5a72', { amp: 2, seed: 6 });
      g.strokeStyle = rgba('#d8f7ff', .6); g.lineWidth = 3; g.strokeRect(1220, 520, 400, 225);
      // scanlines
      g.fillStyle = rgba('#000', .12); for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1.5);
    }));
    const u = lin(ST[3], nxt(3), t), C4 = cam(t, { z: mix(1.04, 1.12, u), amp: .5 });
    L(ctx, C4, .8, (g) => g.drawImage(scr, 0, 0));
    // the bar: fills, snaps back on "another" (hard accent), refills; at the end it bends up into a scroll arc and whips up
    const fillA = eout(lin(ST[3] - .3, A.another, t)), snap = A.another + .02, fillB = lin(snap + .05, snap + 1.1, t);
    const f = t < snap ? fillA : fillB * .7, bend = ein(lin(nxt(3) - .45, nxt(3) + .2, t)), lift = ein(lin(nxt(3) - .3, nxt(3) + .25, t)) * 1400;
    const kick = Math.exp(-Math.pow((t - snap) / .07, 2));
    L(ctx, C4, .9, (g) => {
      g.save(); g.translate(0, -lift + kick * 8);
      const pts = (u0, u1) => { const out = []; for (let k = 0; k <= 40; k++) { const q = mix(u0, u1, k / 40), x = mix(barX0, barX1, q), y = barY - bend * Math.pow(q, 2.2) * 620; out.push([x, y]); } return out; };
      const path = (p) => { g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); };
      g.lineCap = 'round'; g.strokeStyle = rgba('#d8f7ff', .25); g.lineWidth = 10; path(pts(0, 1)); g.stroke();
      g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(P.cy, .25); g.lineWidth = 34; path(pts(0, f)); g.stroke();
      g.globalCompositeOperation = 'source-over'; g.strokeStyle = '#e8fbff'; g.lineWidth = 10; path(pts(0, f)); g.stroke();
      const hp = pts(0, f).at(-1); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(hp[0], hp[1], 13 + kick * 8, 0, 7); g.fill();
      glowA(g, hp[0], hp[1], 80 + kick * 120, .5 + kick * .5);
      // the countdown ring on the card restarts too
      g.strokeStyle = rgba('#d8f7ff', .8); g.lineWidth = 6; g.beginPath(); g.arc(1420, 632, 46, -Math.PI / 2, -Math.PI / 2 + Math.max(.01, f) * 6.28); g.stroke();
      g.restore();
    });
    if (kick > .05) { ctx.fillStyle = rgba('#d8f7ff', .12 * kick); ctx.fillRect(0, 0, W, H); }
    finish(ctx, { vig: .5 });
  } });

  // ============================================================== 3.05 scrolling past midnight
  const moonAt = (t) => { const u = lin(ST[4] - .2, nxt(4) + .3, t); return [mix(1240, 1700, eio(u)) + (u > .85 ? 0 : 0), 250 - Math.sin(u * Math.PI) * 60]; };
  const cam5 = (t) => cam(t, { z: 1.06 + lin(ST[4], nxt(4), t) * .05, amp: .5 });
  add(4, { tr: 'down', d: .45, draw(ctx, t, s) {
    evict(t); const C5 = cam5(t), land = 1 - eout(lin(ST[4] - .25, ST[4] + .7, t));
    const room = once('bed', s.b, () => plate(W, H, (g) => {
      vg(g, [[0, '#0a0e2a'], [1, '#05061a']], 0, 0, 0, H);
      // the window, upper right: night sky frame
      roughRect(g, 1080, 60, 760, 420, '#03040e', { amp: 1, seed: 1 });
      vg(g, [[0, '#0e1a4a'], [1, '#1c2a60']], 0, 80, 0, 460, [1100, 80, 720, 380]);
      const r = prng(2); for (let i = 0; i < 80; i++) { g.fillStyle = rgba('#e8ecff', .2 + .5 * r()); g.fillRect(1100 + r() * 720, 80 + r() * 380, 1, 1); }
      g.fillStyle = '#03040e'; g.fillRect(1450, 70, 14, 410); g.fillRect(1090, 270, 750, 12);
      // roofs outside, low
      roughPoly(g, [[1100, 460], [1100, 400], [1200, 380], [1260, 410], [1380, 360], [1500, 400], [1640, 350], [1820, 400], [1820, 460]], '#070a1e', { amp: 2, seed: 3 });
      // the duvet, folds
      roughPoly(g, [[-20, 620], [700, 560], [1300, 640], [1940, 600], [1940, H + 20], [-20, H + 20]], '#141c4a', { amp: 4, seed: 4 });
      for (let i = 0; i < 7; i++) limb(g, qpts([100 + i * 260, 640 + i * 10], [260 + i * 260, 760], [200 + i * 280, H + 20]), 18, 30, rgba('#05061a', .5), i);
      hatch(g, [0, 560, W, 520], { angle: -.5, gap: 6, col: '#000', a: .18, seed: 5 });
    }));
    L(ctx, { ...C5, y: C5.y + 200 * land }, .5, (g) => {
      g.drawImage(room, 0, 0);
      // the moon crossing the window (the clock of this room), peaking on "midnight"
      const [mx, my] = moonAt(t); g.save(); g.beginPath(); g.rect(1100, 80, 720, 380); g.clip();
      g.fillStyle = '#f3efe2'; g.beginPath(); g.arc(mx, my, 34, 0, 7); g.fill(); glowA(g, mx, my, 160, .35, '#cfd8ff', '#ffffff'); g.restore();
    });
    // phone + hand (foreground, big), its cyan light on the duvet
    L(ctx, { ...C5, y: C5.y + 420 * land }, 1, (g) => {
      const px = 760, py = 640, pw = 360, ph = 640, tilt = -.12;
      glowA(g, px, py + 60, 700, .22, P.cy, P.cyw, .6);
      g.save(); g.translate(px, py); g.rotate(tilt);
      g.fillStyle = '#05060f'; g.beginPath(); g.roundRect(-pw / 2 - 12, -ph / 2 - 12, pw + 24, ph + 24, 46); g.fill();
      g.beginPath(); g.roundRect(-pw / 2, -ph / 2, pw, ph, 36); g.save(); g.clip();
      g.fillStyle = '#e6f6ff'; g.fillRect(-pw / 2, -ph / 2, pw, ph);
      // the feed: cards fly up (speed in flicks), endless
      const flick = (tt) => { let y = 0; const k0 = Math.floor((ST[4] - 1) / .62); for (let k = k0; k * .62 < tt; k++) y += 520 * eout((tt - k * .62) / .45); return y; };
      const off = flick(t) + land * 900, r0 = Math.floor(off / 230);
      for (let i = r0 - 1; i < r0 + 5; i++) { const y = -ph / 2 + 20 + i * 230 - off, r = prng(i * 13 + 7); g.fillStyle = ['#9fd8f0', '#f0c8c0', '#c8d0f8', '#b8f0e0'][((i % 4) + 4) % 4]; g.beginPath(); g.roundRect(-pw / 2 + 18, y, pw - 36, 150, 14); g.fill(); g.fillStyle = rgba('#0a3a5a', .25); g.fillRect(-pw / 2 + 30, y + 160, (pw - 80) * (.4 + .5 * r()), 12); g.fillRect(-pw / 2 + 30, y + 180, (pw - 80) * (.2 + .4 * r()), 10); }
      g.restore();
      g.restore();
      // the thumb flicks upward on the screen
      const ph2 = ((t - ST[4] + 10) % .62) / .62, tx = px + 40, ty = py + 160 - Math.sin(Math.min(1, ph2 * 1.6) * Math.PI) * 150;
      // the hand holding it: palm under the phone, fingers curling round the right edge, the thumb on the glass
      g.save(); g.translate(px, py); g.rotate(tilt);
      const skin = '#5a6898', sd = '#2a3462';
      g.fillStyle = '#141a44'; g.beginPath(); g.ellipse(90, ph / 2 + 220, 130, 150, .3, 0, 7); g.fill();
      g.fillStyle = skin; g.beginPath(); g.ellipse(70, ph / 2 + 70, 120, 90, .3, 0, 7); g.fill(); g.strokeStyle = rgba(P.cyw, .4); g.lineWidth = 2; g.beginPath(); g.ellipse(70, ph / 2 + 70, 120, 90, .3, 3.6, 4.6); g.stroke();
      for (let k = 0; k < 4; k++) { const fy = ph / 2 - 60 - k * 70; g.fillStyle = k % 2 ? sd : shade(skin, -.03); g.beginPath(); g.roundRect(pw / 2 - 8, fy - 22, 54, 46, 22); g.fill(); g.strokeStyle = rgba(P.cyw, .5); g.lineWidth = 2; g.beginPath(); g.arc(pw / 2 + 24, fy, 22, -1.2, .6); g.stroke(); }
      g.restore();
      g.save(); g.translate(tx, ty); g.rotate(-.35); g.fillStyle = skin; g.beginPath(); g.roundRect(-22, -36, 44, 230, 22); g.fill(); g.fillStyle = shade(skin, .08); g.beginPath(); g.ellipse(0, -14, 13, 17, 0, 0, 7); g.fill(); g.strokeStyle = rgba(P.cyw, .8); g.lineWidth = 3; g.beginPath(); g.moveTo(-22, 180); g.lineTo(-22, -14); g.quadraticCurveTo(-22, -36, 0, -36); g.stroke(); g.restore();
    });
    finish(ctx, { vig: .45 });
  } });

  // ============================================================== 3.06 a glass of wine at four in the afternoon
  const cam6 = (t) => { const u = lin(ST[5], nxt(5), t); return { ...cam(t, { amp: .5 }), z: mix(1.55, 1.08, eout(lin(ST[5] - .3, ST[5] + 1.6, t))) + mix(0, .14, ein(u)) }; };
  const rim6 = [960, 540 - 20];
  add(5, { tr: 'zoom', d: .7, ...(() => { const [x, y] = moonAt(ST[5]); const [sx, sy] = Lp(cam5(ST[5]), .5, x, y); return { x: sx, y: sy, depth: 9 }; })(), draw(ctx, t, s) {
    evict(t); const C6 = cam6(t), u = lin(ST[5], nxt(5), t);
    const set = once('sill', s.b, () => {
      const bg = plate(W, H, (g) => {
        vg(g, [[0, '#0a0d26'], [1, '#121640']], 0, 0, 0, H);
        // the window: bright afternoon (cream), the wrong light
        vg(g, [[0, '#fff6e0'], [.6, '#ffe2b0'], [1, '#f2c486']], 0, 120, 0, 700, [520, 100, 880, 600]);
        roughPoly(g, [[520, 560], [700, 520], [800, 540], [960, 480], [1100, 520], [1260, 470], [1400, 510], [1400, 700], [520, 700]], rgba('#e8b07a', .6), { amp: 2, seed: 1 });
        for (const x of [940]) roughRect(g, x - 9, 100, 18, 600, '#2a2440', { amp: .5, seed: 2 });
        roughRect(g, 520, 390, 880, 14, '#2a2440', { amp: .5, seed: 3 });
        roughRect(g, 500, 80, 920, 26, '#151a3c', { amp: .6, seed: 4 }); roughRect(g, 500, 80, 26, 640, '#151a3c', { amp: .6, seed: 5 }); roughRect(g, 1394, 80, 26, 640, '#151a3c', { amp: .6, seed: 6 });
        // the sill (perspective top) and the dark wall below
        roughPoly(g, [[380, 700], [1540, 700], [1640, 790], [280, 790]], '#2a2a50', { amp: 1, seed: 7 });
        roughPoly(g, [[280, 790], [1640, 790], [1640, 820], [280, 820]], '#14183a', { amp: 1, seed: 8 });
        roughPoly(g, [[-20, 820], [W + 20, 820], [W + 20, H + 20], [-20, H + 20]], '#080a20', { amp: 1, seed: 9 });
        // the sun's patch on the sill and its stippled spill on the dark wall: wrong, too bright, too early
        const [lc, lx] = layer(); lx.fillStyle = rgba('#ffd59a', .55); lx.beginPath(); lx.moveTo(560, 708); lx.lineTo(1380, 708); lx.lineTo(1500, 786); lx.lineTo(440, 786); lx.closePath(); lx.fill();
        lx.fillStyle = rgba('#ffb35c', .22); lx.beginPath(); lx.moveTo(520, 100); lx.lineTo(1400, 100); lx.lineTo(1900, 1080); lx.lineTo(-100, 1080); lx.closePath(); lx.fill();
        maskLinear(lc, 0, 100, 0, 1080, [[0, 1], [.6, .6], [1, .0]]); stipple(lc, { k: .8, g: 1.2, seed: 10 }); put(g, lc, { op: 'lighter' });
      });
      return { bg };
    });
    L(ctx, C6, .6, (g) => g.drawImage(set.bg, 0, 0));
    // the glass (big, silhouetted against the window) — its rim is where the moon landed
    const pour = A.four - .25, fill = .05 + .55 * eout(lin(pour, pour + 1.4, t)), stream = lin(pour - .25, pour, t) * (1 - lin(pour + 1.3, pour + 1.6, t));
    L(ctx, C6, 1, (g) => {
      g.fillStyle = rgba('#000', .35); g.beginPath(); g.ellipse(960, 896, 130, 18, 0, 0, 7); g.fill();
      wine(g, 960, 900, 1.25, { fill, col: '#6a1426', rim: '#fff3d8', a: .85, lit: .6, wobble: t * 9 });
      if (stream > 0) {
        // the bottle neck enters from the top right, the stream falls into the glass
        const by = mix(-260, 150, eout(lin(pour - .6, pour - .1, t))) - 300 * ein(lin(pour + 1.3, pour + 1.8, t));
        g.save(); g.translate(1150, by); g.rotate(.9); g.fillStyle = '#0c0a14'; g.beginPath(); g.roundRect(-34, -420, 68, 420, 20); g.fill(); g.fillRect(-18, -10, 36, 60); g.strokeStyle = rgba('#ffe2b0', .5); g.lineWidth = 3; g.beginPath(); g.moveTo(34, -400); g.lineTo(34, 0); g.stroke(); g.restore();
        const sx = 1120, sy = by + 30, ey = mix(-128, -280, fill) * 1.25 + 900;
        g.strokeStyle = rgba('#7a1a2a', .95 * stream); g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(1010, sy + 20, 975, ey); g.stroke();
        g.strokeStyle = rgba('#ff9aa8', .4 * stream); g.lineWidth = 2; g.beginPath(); g.moveTo(sx - 3, sy); g.quadraticCurveTo(1006, sy + 18, 972, ey); g.stroke();
      }
    });
    finish(ctx, { vig: .45 });
  } });

  // ============================================================== 3.07 then a second (the clink)
  const clink = [842, 452];
  add(6, { tr: 'zoom', d: .5, ...(() => { const [x, y] = Lp(cam6(ST[6]), 1, 965, 900 - 1.25 * (128 + .6 * 152)); return { x, y, depth: 8 }; })(), draw(ctx, t, s) {
    evict(t); const C7 = cam(t, { z: 1.08 + lin(ST[6], nxt(6), t) * .06, amp: .4 });
    const bg = once('clink-bg', s.b, () => plate(W, H, (g) => {
      vg(g, [[0, '#120a1e'], [1, '#05040e']], 0, 0, 0, H);
      const [lc, lx] = layer(); lx.fillStyle = rgba('#6a1426', .6); lx.beginPath(); lx.ellipse(960, 520, 900, 420, 0, 0, 7); lx.fill(); maskRadial(lc, 960, 520, 0, 900, [[0, .8], [1, 0]], .5); stipple(lc, { k: .7, seed: 3 }); put(g, lc, { op: 'lighter' });
      roughPoly(g, [[-20, 840], [W + 20, 820], [W + 20, H + 20], [-20, H + 20]], '#0e0a18', { amp: 1, seed: 4 });
      vg(g, [[0, rgba('#c2404f', .12)], [1, rgba('#000', 0)]], 0, 820, 0, 900, [0, 820, W, 80]);
    }));
    L(ctx, C7, .5, (g) => g.drawImage(bg, 0, 0));
    const hit = A.second + .02, slide = expo(lin(hit - .45, hit, t)), x2 = mix(2500, 984, slide), rec = Math.exp(-Math.pow((t - hit - .05) / .08, 2));
    L(ctx, C7, 1, (g) => {
      wine(g, 700, 900, 2.0, { fill: .38, col: '#5a0f1e', rim: '#e8c8d0', a: .8, lit: .3, wobble: t * 3 });
      g.save(); g.translate(x2, 900); g.rotate(-.04 * rec); wine(g, 0, 0, 2.0, { fill: .55, col: '#6a1426', rim: '#e8c8d0', a: .8, lit: .3, wobble: t * 6 + rec * 6 }); g.restore();
      // the ring of the clink, expanding out of the contact point
      if (t > hit) { const q = t - hit; for (let k = 0; k < 3; k++) { const rr = (q - k * .09) * 1500; if (rr <= 0) continue; const a = Math.max(0, .7 - q * .9) * (1 - k * .25); g.strokeStyle = rgba('#ffd6dc', a); g.lineWidth = 3 - k * .6; g.beginPath(); g.ellipse(clink[0], clink[1], rr, rr * .92, 0, 0, 7); g.stroke(); } glowA(g, clink[0], clink[1], 120, rec * .9, '#ff9aa8', '#ffffff'); }
    });
    finish(ctx, { vig: .5 });
  } });

  // ============================================================== 3.08 every evening feels like Sunday evening (harbour, fog)
  const fogPl = (until) => once('fogbank', until, () => {
    const c = plate(W * 2, H, (g, cv) => { const tmp = plate(W, H, (gg) => fog(gg, { y0: 200, y1: 1000, col: '#8a96c8', a: .85, seed: 81, cover: .8, soft: .45, k: .35, sx: .004, sy: .006, edgeTop: .3, edgeBot: .2 })); g.drawImage(tmp, 0, 0, W * 2, H); maskLinear(cv, 0, 0, W * 2, 0, [[0, 1], [.7, .95], [1, 0]]); });
    return c;
  });
  const front8 = (t) => mix(-400, 2400, sm(lin(A.everyEvening - .4, nxt(7) - .6, t)));
  add(7, { tr: 'iris', d: .6, ...(() => { const [x, y] = Lp(cam(ST[7], { z: 1.08 + .06 * lin(ST[6], nxt(6), ST[7]), amp: .4 }), 1, clink[0], clink[1]); return { x, y, r: 40 }; })(), draw(ctx, t, s) {
    evict(t); const C8 = cam(t, { z: 1.06 + lin(ST[7], nxt(7), t) * .05, amp: .6 }), fx = front8(t), roll = ein(lin(nxt(7) - .7, nxt(7) + .5, t));
    drawHarbour(ctx, t, C8, s.b, { winA: (x) => 1 - sm((fx - x) / 260 + .2), lampA: 1 - .7 * sm((fx - 960) / 1200) });
    const fb = fogPl(s.b);
    ctx.save(); ctx.globalAlpha = .9; ctx.drawImage(fb, fx - W * 2 + drift(t, 30), -60 + Math.sin(t * .4) * 20); ctx.restore();
    ctx.save(); ctx.globalAlpha = .45; ctx.drawImage(fb, fx * .8 - W * 2 - 300, 120, W * 2, H * 1.1); ctx.restore();
    // the fog bank rolls toward the camera: scale up + fill
    if (roll > 0) { ctx.save(); ctx.globalAlpha = roll; ctx.translate(W / 2, H / 2); ctx.scale(1 + roll * 1.5, 1 + roll * 1.5); ctx.drawImage(fb, -W, -H / 2); ctx.restore(); ctx.fillStyle = rgba('#6e78a8', .85 * roll); ctx.fillRect(0, 0, W, H); }
    finish(ctx);
  } });

  // ============================================================== 3.09 you don't have to. so you don't.
  const glass9 = [1622, 548];
  const cam9 = (t) => { const u = lin(ST[8], nxt(8), t), p = ein(lin(nxt(8) - .9, nxt(8) + .4, t)); return { ...cam(t, { amp: .4 }), z: mix(1.04, 1.1, u) + .6 * p, x: drift(t, 6) - (glass9[0] - W / 2) * .6 * p, y: drift(t, 4, 2) - (glass9[1] - H / 2) * .6 * p }; };
  add(8, { tr: 'fog', d: 1.0, draw(ctx, t, s) {
    evict(t);
    const set = once('slump2', s.b, () => ({
      bg: plate(W, H, (g) => {
        vg(g, [[0, '#070a22'], [1, '#04050f']], 0, 0, 0, H);
        roughPoly(g, [[-20, 640], [W + 20, 610], [W + 20, H + 20], [-20, H + 20]], '#05061a', { amp: 1, seed: 1 });
        // the TV across the room: the only light
        roughRect(g, 470, 330, 420, 250, '#03040c', { amp: .6, seed: 2 });
        vg(g, [[0, '#d8f7ff'], [1, '#5fc0dc']], 0, 340, 0, 570, [482, 342, 396, 226]);
        roughPoly(g, [[482, 500], [600, 430], [700, 470], [800, 410], [878, 450], [878, 568], [482, 568]], rgba('#2a8aa8', .7), { amp: 2, seed: 3 });
        roughRect(g, 600, 580, 160, 70, '#03040c', { amp: .5, seed: 4 });
        // a shelf, a lamp that is off, a plant: the room
        roughRect(g, 1080, 300, 300, 14, '#0c1030', { amp: .5, seed: 5 }); for (let k = 0; k < 7; k++) roughRect(g, 1090 + k * 34, 230 + (k % 3) * 10, 22, 70 - (k % 3) * 10, '#0e1336', { amp: .5, seed: 6 + k });
        g.fillStyle = '#060818'; g.beginPath(); g.ellipse(230, 500, 90, 140, 0, 0, 7); g.fill(); roughRect(g, 200, 600, 60, 60, '#060818', { amp: .5, seed: 9 });
      }),
      wash: washLayer(680, 460, 1300, P.cy, .5, { sy: .75, k: .6, seed: 9 }),
      front: plate(W, H, (g) => {
        // the back of the sofa: a dark soft mass across the bottom, the armrest on the right
        const top = (x) => 712 + Math.sin(x * .006) * 8 + (x > 1420 ? -60 * Math.min(1, (x - 1420) / 80) : 0);
        const pts = [[-20, H + 20]]; for (let x = -20; x <= W + 20; x += 10) pts.push([x, top(x)]); pts.push([W + 20, H + 20]);
        roughPoly(g, pts, '#0b0f2c', { amp: 2, seed: 11 });
        g.save(); g.beginPath(); roughPath(g, pts, { amp: 2, seed: 11 }); g.clip(); hatch(g, [0, 640, W, 440], { angle: -.7, gap: 6, col: '#000', a: .3, seed: 12 }); vg(g, [[0, rgba('#2a3a8a', .25)], [.2, rgba('#2a3a8a', 0)]], 0, 640, 0, 900, [0, 640, W, 260]); g.restore();
        // cyan rim along the top of the sofa back
        g.strokeStyle = rgba(P.cy, .55); g.lineWidth = 2.5; g.beginPath(); for (let x = 0; x <= 1400; x += 10) x ? g.lineTo(x, top(x) + 1) : g.moveTo(x, top(x) + 1); g.stroke();
      }),
    }));
    const C9 = cam9(t), br = Math.sin(t * 1.4), don = Math.exp(-Math.pow((t - A.dont1 - .1) / .25, 2)) + Math.exp(-Math.pow((t - A.dont2 - .1) / .3, 2));
    const scr = .78 + .2 * Math.sin(t * 17) * Math.sin(t * 4.1) + .45 * don;
    L(ctx, C9, .5, (g) => { g.drawImage(set.bg, 0, 0); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = clamp(.7 * scr); g.drawImage(set.wash, 0, 0); g.restore(); glowA(g, 680, 455, 330, .25 * scr); });
    L(ctx, C9, .9, (g) => {
      // you, slumped low behind the sofa back: head tipped onto the cushion, shoulders barely above the line
      const sy = 690 - br * 4;
      g.fillStyle = '#0a0d26'; g.beginPath(); g.ellipse(1000, sy + 50, 330, 110, 0, Math.PI, 0); g.fill();
      g.beginPath(); g.moveTo(1000, sy - 40); g.quadraticCurveTo(1040, sy - 60, 1070, sy - 20); g.lineTo(1080, sy + 20); g.lineTo(990, sy + 20); g.fill();
      g.save(); g.translate(1080, sy - 100); g.rotate(.38); g.beginPath(); g.ellipse(0, 0, 88, 104, 0, 0, 7); g.fill(); g.restore();
      g.strokeStyle = rgba(P.cyw, .75 * clamp(scr)); g.lineWidth = 3.5; g.beginPath(); g.ellipse(1080, sy - 100, 88, 104, .38, Math.PI * .92, Math.PI * 1.62); g.stroke();
      g.beginPath(); g.ellipse(1000, sy + 50, 330, 110, 0, Math.PI * 1.03, Math.PI * 1.42); g.stroke();
      stamp(g, bloomSprite('rim9', P.cy, P.cyw, .5), 1010, sy - 150, 160, .12 * scr);
      g.drawImage(set.front, 0, 0);
      // the arm on the armrest, the glass in the hand
      g.fillStyle = '#0e1234'; g.lineCap = 'round'; g.strokeStyle = '#10143a'; g.lineWidth = 44; g.beginPath(); g.moveTo(1380, 690); g.quadraticCurveTo(1500, 660, 1590, 668); g.stroke();
      g.strokeStyle = rgba(P.cy, .4); g.lineWidth = 2; g.beginPath(); g.moveTo(1380, 668); g.quadraticCurveTo(1500, 638, 1590, 646); g.stroke();
      wine(g, 1640, 700, .7, { fill: .32, col: '#4a0c18', rim: '#b8e8f8', a: .75, lit: .3, wobble: t * 2 });
      hand(g, 1612, 676, .85, 1.45, .8, { col: '#3a4680', dark: '#1a2050', rim: P.cyw, rimA: .5, shadeA: .4 });
      // the screen reflected in the bowl (the carrier)
      g.fillStyle = rgba(P.cyw, .7 * clamp(scr)); g.beginPath(); g.roundRect(glass9[0] - 9, glass9[1] - 13, 18, 26, 3); g.fill(); glowA(g, glass9[0], glass9[1], 46, .35 * scr);
    });
    const fogA = 1 - sm(lin(ST[8] - .2, ST[8] + .9, t)); if (fogA > 0) { ctx.fillStyle = rgba('#6e78a8', .7 * fogA); ctx.fillRect(0, 0, W, H); }
    finish(ctx, { vig: .5 });
  } });

  // ============================================================== 3.10 the fear: a grid of lit sofas from above
  const cam10 = (t) => { const u = eio(lin(ST[9] - .4, A.fear + .9, t)); return { z: mix(3.6, 1.0, u) + lin(A.fear, nxt(9), t) * -.06 + .06, x: drift(t, 8), y: drift(t, 5, 2) }; };
  add(9, { tr: 'zoom', d: .8, ...(() => { const [x, y] = Lp(cam9(ST[9]), .9, glass9[0], glass9[1]); return { x, y, depth: 7 }; })(), draw(ctx, t, s) {
    evict(t); const gs = gridSet(s.b), C10 = cam10(t), slide = ein(lin(nxt(9) - .5, nxt(9) + .35, t)) * 900;
    ctx.fillStyle = '#04050f'; ctx.fillRect(0, 0, W, H);
    const mid = gs.cells[Math.floor(gs.cells.length / 2)];
    ctx.save(); ctx.translate(W / 2 + C10.x, H / 2 + C10.y + slide); ctx.scale(C10.z * .62, C10.z * .62); ctx.transform(1, 0, -.18, 1, 0, 0); ctx.translate(-mid.cx, -mid.cy);
    ctx.drawImage(gs.c, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    for (const q of gs.cells) { const f = .5 + .5 * Math.sin(t * q.f + q.ph) * Math.sin(t * q.f * .37 + 1); ctx.fillStyle = rgba(P.cy, .07 * f); ctx.fillRect(q.x0, q.y0, q.w * .6, q.h); ctx.fillStyle = rgba('#ffffff', .5 * f); ctx.fillRect(q.x - 10, q.y - 34, 4, 68); }
    ctx.restore();
    finish(ctx, { vig: .55 });
  } });

  // ============================================================== 3.11 that we'd just numb ourselves (the remote falls)
  const fall11 = (t) => { const a = A.numb - .15; const q = Math.max(0, t - a); return { tilt: sm(lin(a - .5, a + .2, t)) * .5 + q * q * .25, y: 30 * sm(lin(a - .4, a, t)) + 160 * q * q + 40 * q, x: 40 * q }; };
  add(10, { tr: 'up', d: .7, draw(ctx, t, s) {
    evict(t); const C11 = cam(t, { z: 1.06, amp: .4 }), f = fall11(t), follow = ein(lin(nxt(10) - .6, nxt(10) + .3, t)) * 700;
    const bg = once('cushion', s.b, () => plate(W, H, (g) => {
      vg(g, [[0, '#060818'], [1, '#03040c']], 0, 0, 0, H);
      // the sofa seat edge (a big rounded cushion across the frame), the drop to the floor below
      roughPoly(g, [[-20, 300], [W + 20, 260], [W + 20, 620], [-20, 660]], '#1c2462', { amp: 4, seed: 1 });
      roughPoly(g, [[-20, 640], [W + 20, 600], [W + 20, 700], [-20, 740]], '#121844', { amp: 4, seed: 2 });
      vg(g, [[0, rgba('#000', 0)], [1, rgba('#000', .5)]], 0, 300, 0, 740, [0, 260, W, 480]);
      hatch(g, [0, 260, W, 480], { angle: -.4, gap: 6, col: '#000', a: .15, seed: 3 });
      g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, rgba(P.cy, .25)); gr.addColorStop(.6, rgba(P.cy, 0)); g.fillStyle = gr; g.fillRect(0, 250, W, 120); g.restore();
      roughPoly(g, [[-20, 900], [W + 20, 880], [W + 20, H + 20], [-20, H + 20]], '#05061a', { amp: 2, seed: 4 });
    }));
    L(ctx, { ...C11, y: C11.y - follow }, .8, (g) => g.drawImage(bg, 0, 0));
    L(ctx, { ...C11, y: C11.y - follow * 1.2 }, 1, (g) => {
      const grip = 1 - sm(lin(A.numb - .9, A.numb + .1, t));
      remote(g, 900 + f.x, 470 + f.y, 2.2, 1.35 + f.tilt, { led: 1 });
      hand(g, 1060, 420, 2.4, 1.75, .25 + .6 * grip, { col: '#3e4a80', dark: '#1c2250', rim: P.cyw, rimA: .7, cuff: '#1a2258', shadeA: .5 });
    });
    finish(ctx, { vig: .5 });
  } });

  // ============================================================== 3.12 so ask yourself an honest question (the pond)
  const ringC = [POND.moon[0], POND.moon[1]];
  add(11, { tr: 'down', d: .6, draw(ctx, t, s) {
    evict(t); const ps = pondSet(s.b), u = lin(ST[11], nxt(11), t), C12 = cam(t, { z: mix(1.06, 1.16, eio(u)), amp: .5 });
    const land = 1 - eout(lin(ST[11] - .3, ST[11] + .8, t));
    L(ctx, { ...C12, y: C12.y + 300 * land }, .6, (g) => {
      g.drawImage(ps.bg, 0, 0);
      // the moon's reflection in the still water
      g.save(); g.beginPath(); g.ellipse(POND.cx, POND.cy, POND.rx, POND.ry, 0, 0, 7); g.clip();
      for (let k = 0; k < 9; k++) { const wob = Math.sin(t * 2 + k) * (2 + k); g.fillStyle = rgba('#f3efe2', .45 * (1 - k / 9)); g.fillRect(ringC[0] - 36 + k * 2 + wob, ringC[1] - 14 + k * 5, 72 - k * 4, 3); }
      // the pebble (the remote, shrunk) falls into the reflection; rings on "honest"
      const hitT = A.honest - .12;
      if (t < hitT) { const q = lin(ST[11] - .5, hitT, t); g.restore(); g.fillStyle = '#05060f'; g.beginPath(); g.ellipse(ringC[0], mix(-100, ringC[1], q * q), 10, 16, .3, 0, 7); g.fill(); g.save(); }
      else { const q = t - hitT; for (let k = 0; k < 5; k++) { const rr = (q - k * .22) * 260; if (rr <= 0) continue; g.strokeStyle = rgba('#f3efe2', Math.max(0, .55 - q * .12) * (1 - k * .15)); g.lineWidth = 2.2; g.beginPath(); g.ellipse(ringC[0], ringC[1], rr, rr * .28, 0, 0, 7); g.stroke(); }
        const sp = Math.max(0, 1 - q * 3); g.fillStyle = rgba('#f3efe2', .7 * sp); for (let k = 0; k < 7; k++) g.fillRect(ringC[0] + (k - 3) * 9 * (1 + q * 4), ringC[1] - 40 * sp * Math.sin(k + 1) - q * 30, 3, 3); }
      g.restore();
    });
    L(ctx, { ...C12, y: C12.y + 380 * land }, 1.15, (g) => g.drawImage(ps.reeds, 0, 0));
    finish(ctx);
  } });

  // ============================================================== 3.13 why do we numb ourselves now? (the night bus)
  add(12, { tr: 'zoom', d: .7, ...(() => { const C = cam(ST[12], { z: mix(1.06, 1.16, eio(lin(ST[11], nxt(11), ST[12]))), amp: .5 }); const [x, y] = Lp(C, .6, ...ringC); return { x, y, depth: 7 }; })(), draw(ctx, t, s) {
    evict(t); const bs = busSet(s.b), C13 = cam(t, { z: 1.06, amp: .5 }), sp = 700, xo = t * sp;
    L(ctx, C13, .3, (g) => { const x = -((xo * .25) % W); g.drawImage(bs.far, x, 0); });
    L(ctx, C13, .7, (g) => { const x = -((xo * .9) % W); g.drawImage(bs.road, x, 0);
      // sodium street lamps passing (mid layer)
      for (let i = -1; i < 4; i++) { const lx = ((i * 640 - xo * .9) % (W + 640) + W + 640) % (W + 640) - 320; roughLine(g, [[lx, 820], [lx, 240]], { w: 8, col: '#0a0a14', seed: i + 9 }); g.fillStyle = '#ffd08a'; g.fillRect(lx - 30, 236, 60, 10); stamp(g, bloomSprite('sod', P.sodium, '#ffe2b0'), lx, 246, 220, .4); } });
    // the bus: rides along with the camera, slight bounce
    const bob = Math.sin(t * 7.3) * 2 + Math.sin(t * 3.1) * 2;
    L(ctx, { ...C13, y: C13.y + bob }, .85, (g) => {
      // interior light + passengers inside the window band
      const { x, y, w } = BUS; g.drawImage(bs.bus, 0, 0); g.save(); g.beginPath(); g.roundRect(x + 40, y + 46, w - 80, 170, 10); g.clip();
      vg(g, [[0, '#f6e6b8'], [1, '#c8a870']], 0, y + 46, 0, y + 216, [x, y, w, 220]);
      const nod = sm(lin(A.now - .1, A.now + .5, t));
      for (let i = 0; i < 8; i++) { const px = x + 150 + i * 150, tiltH = i === 4 ? .5 + nod * .6 : [.55, .35, .7, .45, 0, .4, .65, .3][i], fl = i % 2 === 1;
        fig(g, 'pass' + i + (i === 4 ? Math.round(nod * 8) : ''), px, y + 236, 1.05, { lean: fl ? -.12 : .12, head: tiltH, sh: [.5, .3], el: [.9, .8], hip: [1.45, 1.4], kn: [1.5, 1.45], hair: ['short', 'bun', 'cap', 'long'][i % 4], bulk: 1 + (i % 3) * .05 }, { flip: fl, dress: { coat: ['#2a2430', '#302a36', '#24222c', '#36303a'][i % 4], pants: '#1a1820', shoes: '#0c0a10', skin: '#4a3a3a', hair: '#141016' }, shadeA: .55, shadeCol: '#140e10' }); }
      // the sodium light of each passing lamp sweeps over the passengers
      { const lx = ((-xo * .9) % 640 + 640) % 640; for (let k = -1; k < 3; k++) { const cx = x + lx + k * 640; const gr = g.createLinearGradient(cx - 200, 0, cx + 200, 0); gr.addColorStop(0, rgba(P.sodium, 0)); gr.addColorStop(.5, rgba(P.sodium, .25)); gr.addColorStop(1, rgba(P.sodium, 0)); g.fillStyle = gr; g.fillRect(cx - 200, y + 46, 400, 170); } }
      for (let i = 1; i < 6; i++) { g.fillStyle = '#9a9ca8'; g.fillRect(x + 40 + i * (w - 80) / 6 - 6, y + 46, 12, 170); }
      g.restore();
      { const lx = ((-xo * .9) % 640 + 640) % 640; g.save(); g.beginPath(); g.roundRect(x, y, w, BUS.h, [34, 34, 14, 14]); g.clip(); g.globalCompositeOperation = 'soft-light'; for (let k = -1; k < 3; k++) { const cx = x + lx + k * 640, gr = g.createLinearGradient(cx - 260, 0, cx + 260, 0); gr.addColorStop(0, rgba('#000', .35)); gr.addColorStop(.5, rgba(P.sodium, .9)); gr.addColorStop(1, rgba('#000', .35)); g.fillStyle = gr; g.fillRect(cx - 260, y, 520, BUS.h); } g.restore(); }
      // window glare + reflections sliding past
      g.save(); g.beginPath(); g.roundRect(x + 40, y + 46, w - 80, 170, 10); g.clip(); g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) { const rx = ((i * 520 - xo * 1.1) % (w + 400) + w + 400) % (w + 400) + x - 200; g.fillStyle = rgba('#ffe2b0', .18); g.beginPath(); g.moveTo(rx, y + 46); g.lineTo(rx + 80, y + 46); g.lineTo(rx + 20, y + 216); g.lineTo(rx - 60, y + 216); g.fill(); }
      g.restore();
    });
    // foreground poles whip past (fast layer), motion smear
    L(ctx, C13, 1.4, (g) => { for (let i = 0; i < 2; i++) { const lx = ((i * 1300 - xo * 2.4) % (W + 1300) + W + 1300) % (W + 1300) - 500; g.fillStyle = rgba('#04040a', .9); g.fillRect(lx, -40, 46, H + 80); g.fillStyle = rgba('#04040a', .3); g.fillRect(lx + 46, -40, 80, H + 80); } });
    finish(ctx);
  } });

  // ============================================================== 3.14 a tired person reaches for the remote at nine at night
  const reach = (t) => sm(lin(A.nine - 1.4, A.nine + .05, t));
  add(13, { tr: 'left', d: .6, draw(ctx, t, s) {
    evict(t); const u = lin(ST[13], nxt(13), t), C14 = { ...cam(t, { z: mix(1.08, 1.16, u), amp: .5 }), x: drift(t, 8) + 300 * (1 - eout(lin(ST[13] - .3, ST[13] + .8, t))) };
    const set = once('table9', s.b, () => plate(W, H, (g) => {
      vg(g, [[0, '#0e1022'], [1, '#05060f']], 0, 0, 0, 600);
      // the dark window: 9 pm city lights as bokeh
      roughRect(g, 200, 40, 1500, 520, '#070814', { amp: 1, seed: 1 });
      vg(g, [[0, '#0c1030'], [1, '#1a1838']], 0, 60, 0, 540, [220, 60, 1460, 480]);
      const r = prng(2); for (let i = 0; i < 90; i++) { const x = 230 + r() * 1440, y = 200 + r() * 330, rr = 6 + r() * 22; g.fillStyle = rgba(r() < .7 ? '#f2a54a' : '#cfd6ff', .12 + .25 * r()); g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
      g.fillStyle = '#070814'; g.fillRect(940, 40, 18, 520);
      // the table top in perspective
      roughPoly(g, [[-20, 560], [W + 20, 540], [W + 20, H + 20], [-20, H + 20]], '#2a2622', { amp: 1, seed: 3 });
      strokesWood(g);
      vg(g, [[0, rgba('#000', .1)], [1, rgba('#000', .55)]], 0, 540, 0, H, [0, 540, W, 540]);
      const [lc, lx] = layer(); const gr = lx.createRadialGradient(700, 700, 0, 700, 700, 900); gr.addColorStop(0, rgba(P.sodium, .3)); gr.addColorStop(1, rgba(P.sodium, 0)); lx.fillStyle = gr; lx.fillRect(0, 540, W, 540); stipple(lc, { k: .7, seed: 4 }); put(g, lc, { op: 'lighter' });
    }));
    L(ctx, C14, .7, (g) => g.drawImage(set, 0, 0));
    const rc = reach(t), off = sm(lin(nxt(13) - 1.4, nxt(13) - .7, t)), drop = ein(lin(nxt(13) - .8, nxt(13) + .3, t));
    L(ctx, C14, 1, (g) => {
      keys(g, 760, 760, 1.6, .3);
      // the remote, picked up at the end
      const lift = sm(lin(A.nine + .1, A.nine + .8, t));
      remote(g, 1080 + lift * 300 + off * 400, 800 - lift * 60, 1.8, 1.5 - lift * .3, { led: .6, rim: P.sodium });
      // the gloved hand reaches in from the right past the keys; then the hand pulls out and the glove slips off and drops
      const hx = mix(2100, 1160, rc) + lift * 300 + off * 700, hy = mix(860, 760, rc) - lift * 60 - off * 300;
      if (off < .99) hand(g, hx, hy, 2.3, -1.45 + rc * .15, mix(.15, .75, lift), { col: '#b8864a', dark: '#6a4a2a', rim: '#ffd08a', rimA: .55, cuff: '#3a3a4a', glove: true, shadeA: .4 });
      if (off > .3) { const gx = mix(1600, 1500, drop), gy = 720 + drop * 900; g.save(); g.globalAlpha = 1; hand(g, gx, gy, 2.2, -1.2 + drop * .8, .4, { col: '#b8864a', dark: '#6a4a2a', glove: true, shadeA: .45 }); g.restore(); }
    });
    finish(ctx, { vig: .45 });
  } });
  function strokesWood(g) { const r = prng(5); for (let i = 0; i < 70; i++) { const y = 560 + Math.pow(r(), 1.3) * 520, x0 = -20 + r() * 400; g.strokeStyle = rgba('#000', .12 + .1 * r()); g.lineWidth = 1 + (y - 540) / 300; g.beginPath(); g.moveTo(x0, y); g.bezierCurveTo(600, y + (r() - .5) * 20, 1200, y + (r() - .5) * 20, W + 20, y + (r() - .5) * 12); g.stroke(); } }

  // ============================================================== 3.15 why the third glass?
  add(14, { tr: 'up', d: .6, draw(ctx, t, s) {
    evict(t); const u = lin(ST[14], nxt(14), t), push = ein(lin(nxt(14) - .5, nxt(14) + .3, t)), C15 = cam(t, { z: mix(1.06, 1.12, u) + push * .3, amp: .4 });
    const bg = once('counter', s.b, () => plate(W, H, (g) => {
      vg(g, [[0, '#1a1e30'], [1, '#0a0c18']], 0, 0, 0, H);
      // a kitchen counter at night, tiled wall with grey-indigo light from a fridge left
      for (let y = 40; y < 640; y += 70) for (let x = (y / 70 % 2) * 40; x < W; x += 80) roughRect(g, x + 2, y + 2, 76, 66, shade('#1c2034', (prng(x * 7 + y)() - .5) * .02), { amp: .5, seed: x + y });
      roughPoly(g, [[-20, 640], [W + 20, 620], [W + 20, 700], [-20, 720]], '#3a3e52', { amp: 1, seed: 1 });
      roughPoly(g, [[-20, 700], [W + 20, 690], [W + 20, H + 20], [-20, H + 20]], '#141624', { amp: 1, seed: 2 });
      const [lc, lx] = layer(); const gr = lx.createRadialGradient(0, 300, 0, 0, 300, 1500); gr.addColorStop(0, rgba('#b8c8e8', .3)); gr.addColorStop(1, rgba('#b8c8e8', 0)); lx.fillStyle = gr; lx.fillRect(0, 0, W, H); stipple(lc, { k: .6, seed: 3 }); put(g, lc, { op: 'lighter' });
    }));
    L(ctx, C15, .6, (g) => g.drawImage(bg, 0, 0));
    const pourT = A.third - .2, fill3 = .55 * eout(lin(pourT, pourT + 1.2, t)), str = lin(pourT - .2, pourT, t);
    L(ctx, C15, 1, (g) => {
      const land = 1 - eout(lin(ST[14] - .3, ST[14] + .6, t));
      wine(g, 560, 680, .9, { fill: .08, col: '#4a0c18', rim: '#c8d4ea', a: .7 });
      wine(g, 900, 680, .9, { fill: .1, col: '#4a0c18', rim: '#c8d4ea', a: .7 });
      wine(g, 1240, 680 - 200 * land, .9, { fill: fill3, col: '#6a1426', rim: '#dfe8f8', a: .85, wobble: t * 8 });
      // the pouring hand with a hospital wristband, from the top right
      const by = mix(-160, 300, eout(lin(pourT - .9, pourT - .2, t)));
      g.save(); g.translate(1420, by); g.rotate(1.0); g.fillStyle = '#0c0a14'; g.beginPath(); g.roundRect(-36, -440, 72, 440, 22); g.fill(); g.fillRect(-18, -10, 36, 60); g.restore();
      hand(g, 1640, by - 140, 2.0, -2.25, .9, { col: '#c8a080', dark: '#7a5a48', rim: '#dfe8f8', rimA: .5, cuff: '#4a8a8a', band: '#f3efe2', shadeA: .35 });
      if (str > 0) { const ey = 680 + mix(-115, -252, fill3) * .9; g.strokeStyle = rgba('#7a1a2a', .95); g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(1380, by + 30); g.quadraticCurveTo(1290, by + 60, 1255, ey); g.stroke(); }
    });
    finish(ctx, { vig: .45 });
  } });

  // ============================================================== 3.16 maybe not because we're lazy (the nurse on the bed edge)
  const nurseHip = [860, 650];
  const cam16 = (t) => { const u = lin(ST[15], nxt(15), t), p = ein(lin(nxt(15) - .5, nxt(15) + .4, t)); return { ...cam(t, { amp: .4 }), z: mix(1.06, 1.14, u) + p * 1.0, x: drift(t, 6) - p * 60, y: drift(t, 4, 1) + p * 260 }; };
  add(15, { tr: 'push', d: .7, draw(ctx, t, s) {
    evict(t); const C16 = cam16(t);
    const bg = once('nurse-room', s.b, () => plate(W, H, (g) => {
      vg(g, [[0, '#262a3c'], [1, '#14161f']], 0, 0, 0, H);
      // the window right: grey streetlight, a blind half down
      roughRect(g, 1300, 110, 460, 470, '#0c0e16', { amp: 1, seed: 1 }); vg(g, [[0, '#5a6480'], [1, '#353c56']], 0, 130, 0, 560, [1320, 130, 420, 430]);
      for (let k = 0; k < 9; k++) { g.fillStyle = rgba('#20242f', .9); g.fillRect(1320, 130 + k * 22, 420, 12); }
      g.fillStyle = '#0c0e16'; g.fillRect(1524, 120, 12, 450);
      roughPoly(g, [[-20, 800], [W + 20, 770], [W + 20, H + 20], [-20, H + 20]], '#16171f', { amp: 1, seed: 2 });
      // the bed: mattress side in perspective, the duvet thrown back, a pillow
      roughPoly(g, [[120, 690], [1500, 650], [1700, 740], [80, 800]], '#9aa0b4', { amp: 2, seed: 3 });
      roughPoly(g, [[80, 800], [1700, 740], [1700, 840], [80, 900]], '#5a6074', { amp: 2, seed: 4 });
      roughPoly(g, [[80, 900], [1700, 840], [1700, 880], [80, 945]], '#0c0d14', { amp: 1, seed: 15 });
      for (const lx of [110, 1660]) roughRect(g, lx, 880 - (lx - 80) * .037, 22, 70, '#0c0d14', { amp: .5, seed: lx });
      roughPoly(g, [[140, 660], [420, 640], [460, 700], [160, 720]], '#c8ccd8', { amp: 3, seed: 5 });
      for (let k = 0; k < 6; k++) limb(g, qpts([500 + k * 170, 690 - k * 5], [560 + k * 170, 720], [520 + k * 180, 790]), 10, 4, rgba('#3a3e50', .35), k);
      hatch(g, [80, 740, 1620, 160], { angle: -.5, gap: 6, col: '#1a1c28', a: .3, seed: 6 });
      // her shoes' shadow area + a bag on the floor with a lanyard
      roughPoly(g, [[1440, 860], [1560, 850], [1580, 930], [1430, 940]], '#2a2a36', { amp: 1.5, seed: 7 });
      g.strokeStyle = rgba('#5a8a9a', .7); g.lineWidth = 3; g.beginPath(); g.moveTo(1460, 860); g.quadraticCurveTo(1500, 960, 1560, 900); g.stroke();
      const [lc, lx] = layer(); const gr = lx.createLinearGradient(1600, 200, 600, 900); gr.addColorStop(0, rgba('#a8b4d0', .4)); gr.addColorStop(1, rgba('#a8b4d0', 0)); lx.fillStyle = gr; lx.beginPath(); lx.moveTo(1320, 130); lx.lineTo(1740, 130); lx.lineTo(1300, 1080); lx.lineTo(300, 1080); lx.closePath(); lx.fill(); stipple(lc, { k: .6, seed: 8 }); put(g, lc, { op: 'lighter' });
    }));
    L(ctx, C16, .6, (g) => g.drawImage(bg, 0, 0));
    const rub = sm(lin(A.lazy - .8, A.lazy - .2, t)) * (1 - sm(lin(nxt(15) - .9, nxt(15) - .4, t))), br = Math.sin(t * 1.4), wig = Math.sin(t * 8) * .12 * rub;
    L(ctx, C16, .9, (g) => {
      g.fillStyle = rgba('#000', .3); g.beginPath(); g.ellipse(nurseHip[0] + 180, 1000, 260, 26, 0, 0, 7); g.fill();
      fig(g, 'nurse', nurseHip[0], nurseHip[1], 3.3, { lean: .32 + br * .012, head: .5, sh: [mix(.75, 2.95, rub), .8], el: [mix(.55, 1.95 + wig, rub), .5], hip: [1.5, 1.4], kn: [1.5, 1.4], hair: 'bun', bulk: 1.02 },
        { dress: { coat: '#3e7c84', pants: '#3a7078', shoes: '#e8e8ee', skin: '#c8a080', hair: '#2a1e18' }, light: { x: 1600, y: 300, col: '#c8d4ea', a: .45 }, rim: '#dfe8f8', rimSide: 1, rimW: 2.4, shadeA: .15, shadeCol: '#101420' });
    });
    finish(ctx, { vig: .5 });
  } });

  // ============================================================== 3.17 maybe because we're exhausted (her shoulders)
  const shoulderLine = (u, k) => { const x = mix(-60, W + 60, u), dome = Math.sin(Math.PI * u); return [x, 600 - 260 * Math.pow(dome, .8) + k * 110 * Math.pow(dome, 3)]; };
  add(16, { tr: 'zoom', d: .7, ...(() => { const [x, y] = Lp(cam16(ST[16]), .9, nurseHip[0] + 10, nurseHip[1] - 150); return { x: clamp(x, 200, W - 200), y: clamp(y, 150, H - 150), depth: 5 }; })(), draw(ctx, t, s) {
    evict(t); const u = lin(ST[16], nxt(16), t), C17 = cam(t, { z: mix(1.05, 1.12, u), amp: .3 }), k = sm(lin(A.exhausted - .9, A.exhausted + .9, t)) + Math.sin(t * 1.2) * .03;
    const bg = once('shoulder-bg', s.b, () => plate(W, H, (g) => { vg(g, [[0, '#2e3448'], [1, '#14161f']], 0, 0, 0, H); roughRect(g, 1380, 60, 420, 520, '#3e4864', { amp: 1, seed: 1 }); for (let q = 0; q < 10; q++) { g.fillStyle = rgba('#20242f', .85); g.fillRect(1380, 70 + q * 24, 420, 13); } const [lc, lx] = layer(); const gr = lx.createRadialGradient(1550, 260, 0, 1550, 260, 1300); gr.addColorStop(0, rgba('#c8d4ea', .45)); gr.addColorStop(1, rgba('#c8d4ea', 0)); lx.fillStyle = gr; lx.fillRect(0, 0, W, H); stipple(lc, { k: .6, seed: 2 }); put(g, lc, { op: 'lighter' }); }));
    L(ctx, C17, .4, (g) => g.drawImage(bg, 0, 0));
    L(ctx, C17, 1, (g) => {
      const pts = []; for (let i = 0; i <= 80; i++) pts.push(shoulderLine(i / 80, k));
      const ny = shoulderLine(.5, k)[1], hx = W / 2 + 10, hy = ny - 150 + k * 95;
      // neck (nape): longer as the head bows
      g.fillStyle = '#b48a6a'; g.beginPath(); g.moveTo(hx - 70, ny + 40); g.bezierCurveTo(hx - 72, hy + 40, hx - 60, hy, hx, hy - 10); g.bezierCurveTo(hx + 60, hy, hx + 74, hy + 40, hx + 72, ny + 40); g.closePath(); g.fill();
      g.save(); g.clip(); vg(g, [[0, rgba('#3a2010', .45)], [.6, rgba('#3a2010', 0)], [1, rgba('#ffe8d0', .25)]], hx - 80, 0, hx + 80, 0, [hx - 90, hy - 40, 180, ny - hy + 120]); g.restore();
      // the back of the head, hair pulled into a bun, strands
      g.fillStyle = '#2a1e18'; g.beginPath(); g.ellipse(hx, hy - 80, 132, 120, 0, 0, 7); g.fill();
      g.beginPath(); g.ellipse(hx + 8, hy - 200 + k * 20, 66, 56, .2, 0, 7); g.fill();
      g.strokeStyle = rgba('#6a4a36', .55); g.lineWidth = 1.6; for (let q = 0; q < 26; q++) { const a = -2.6 + q * .2; g.beginPath(); g.moveTo(hx + Math.cos(a) * 30, hy - 80 + Math.sin(a) * 26); g.quadraticCurveTo(hx + Math.cos(a) * 90, hy - 80 + Math.sin(a) * 80, hx + Math.cos(a) * 128, hy - 80 + Math.sin(a) * 116); g.stroke(); }
      for (let q = 0; q < 12; q++) { g.beginPath(); g.arc(hx + 8, hy - 200 + k * 20, 16 + q * 4, q, q + 2.4); g.stroke(); }
      g.strokeStyle = rgba('#2a1e18', .9); g.lineWidth = 1.4; for (let q = 0; q < 5; q++) { const sx = hx - 40 + q * 22; g.beginPath(); g.moveTo(sx, hy + 30); g.quadraticCurveTo(sx + 6, hy + 70, sx - 4 + q * 2, hy + 96 + q * 6); g.stroke(); }
      g.strokeStyle = rgba('#dfe8f8', .6); g.lineWidth = 3; g.beginPath(); g.ellipse(hx, hy - 80, 132, 120, 0, -1.3, .3); g.stroke();
      // the scrubs: shoulders, yoke seam, folds; light from the window on the right
      g.fillStyle = '#3e7c84'; g.beginPath(); g.moveTo(-60, H + 20); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(W + 60, H + 20); g.closePath(); g.fill();
      g.save(); g.clip();
      vg(g, [[0, rgba('#000', .42)], [.55, rgba('#000', .05)], [1, rgba('#d8f0f0', .18)]], 0, 0, W, 0);
      hatch(g, [0, 300, W * .55, 800], { angle: -.8, gap: 7, col: '#0a2024', a: .3, seed: 3 });
      g.strokeStyle = rgba('#0a2024', .45); g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= 40; i++) { const [x, y] = shoulderLine(.15 + i / 40 * .7, k); i ? g.lineTo(x, y + 120) : g.moveTo(x, y + 120); } g.stroke();
      g.lineWidth = 4; g.beginPath(); g.moveTo(W / 2 + 6, ny + 120); g.lineTo(W / 2 + 14, H + 20); g.stroke();
      for (const fx of [520, 760, 1250, 1460]) { g.strokeStyle = rgba('#0a2024', .25); g.lineWidth = 3; g.beginPath(); g.moveTo(fx, shoulderLine((fx + 60) / (W + 120), k)[1] + 140); g.quadraticCurveTo(fx + 30, 900, fx - 10, H + 20); g.stroke(); }
      g.restore();
      // rim light along the right shoulder (window)
      g.strokeStyle = rgba('#e8f4f8', .6); g.lineWidth = 3; g.beginPath(); pts.slice(42).forEach(([x, y], i) => i ? g.lineTo(x, y - 1) : g.moveTo(x, y - 1)); g.stroke();
    });
    const m = sm(lin(nxt(16) - .6, nxt(16) + .4, t)); if (m > 0) { ctx.fillStyle = rgba('#0e1238', .75 * m); ctx.fillRect(0, 0, W, H); }
    finish(ctx, { vig: .5 });
  } });

  // ============================================================== 3.18 that's the reason you didn't guess (the harbour; the window flickers again)
  const flickA = (t) => { const q = t - (A.guess - .08); if (q < 0 || q > .9) return 0; return [1, 0, 1, .2, 1, 0][Math.floor(q / .15)] ?? 0; };
  const cam18 = (t) => { const u = lin(ST[17] - .4, nxt(17) + .4, t); return { ...cam(t, { amp: .5 }), z: mix(1.34, 1.08, eout(u)), x: drift(t, 8), y: drift(t, 5, 2) + mix(60, 0, eout(u)) }; };
  add(17, { tr: 'match', d: .8, draw(ctx, t, s) {
    evict(t); harbour(s.b);
    const C18 = cam18(t), fw = HB.flick;
    drawHarbour(ctx, t, C18, s.b, { flick: flickA(t), winA: () => .9 });
    // a thin mist still on the water
    ctx.fillStyle = rgba('#6e78a8', .12); ctx.fillRect(0, 0, W, H);
    // the spark that leaves the window after the flicker and rises out of frame
    const sq = lin(A.guess + .75, nxt(17) + .4, t);
    if (sq > 0 && fw) { const [sx, sy] = Lp(C18, .6, fw.x, fw.y + fw.h / 2); const y = sy - ein(sq) * 1100; stamp(ctx, bloomSprite('sp', P.amb, P.hot), sx, y, 60, .9); ctx.fillStyle = '#fff1cf'; ctx.beginPath(); ctx.arc(sx, y, 4, 0, 7); ctx.fill(); for (let k = 1; k < 6; k++) { ctx.fillStyle = rgba(P.amb, .4 / k); ctx.beginPath(); ctx.arc(sx, y + k * 22 * ein(sq) * 3, 3, 0, 7); ctx.fill(); } }
    finish(ctx);
  } });

  // ============================================================== 3.19 / 3.20 the bridge at dawn
  const DRESS = [{ coat: '#4a4e62', pants: '#2a2c38', shoes: '#14141a', skin: '#b8a090', hair: '#1a1820' }, { coat: '#5a5450', pants: '#24262e', shoes: '#14141a', skin: '#c8a888', hair: '#2a2020' }, { coat: '#3a4250', pants: '#22242c', shoes: '#101016', skin: '#a88a78', hair: '#141218' }, { coat: '#6a6878', pants: '#2e2a30', shoes: '#141418', skin: '#d0b098', hair: '#3a2a20' }];
  const walkers = (() => { const r = prng(91), out = []; for (let i = 0; i < 46; i++) out.push({ x: r() * 2600 - 340, row: r(), d: Math.floor(r() * 4), ph: r(), sp: .9 + r() * .2, hair: ['short', 'bun', 'cap', 'long'][Math.floor(r() * 4)] }); out.sort((a, b) => a.row - b.row); return out; })();
  const STOPX = 960;
  const walkPose = (ph, hunch = 0) => { const a = ph * Math.PI * 2, s1 = Math.sin(a); return { lean: .2 + hunch * .25, head: .25 + hunch * .35, sh: [.15 - s1 * .35, .15 + s1 * .35], el: [.35, .35], hip: [s1 * .42, -s1 * .42], kn: [.05 + Math.max(0, -s1) * .55, .05 + Math.max(0, s1) * .55], hair: 'short', coat: .4 }; };
  function crowd(g, t, { truck, sync, fadeFrom = null, stopper = false, hunch = 0 }) {
    const cyc = 1.05;
    for (const p of walkers) {
      const s2 = mix(.55, .85, p.row), yb = BR.y(0) + 4 + p.row * 70;
      let x = ((p.x + t * 120 * p.sp - truck) % 2700 + 2700) % 2700 - 380; const yy = yb + (x - 960) * .06;
      let ph = (t / cyc * p.sp + p.ph) % 1; ph = mix(ph, (t / cyc) % 1, sync); ph = Math.floor(ph * 8) / 8;
      let a = 1; if (fadeFrom !== null) a = 1 - sm(lin(fadeFrom + Math.abs(x - STOPX) / 900, fadeFrom + .6 + Math.abs(x - STOPX) / 900, t));
      if (a <= .02) continue;
      g.save(); g.globalAlpha = a; fig(g, 'walk' + p.d + p.hair, x, yy - 88 * s2, s2, { ...walkPose(ph), hair: p.hair }, { dress: DRESS[p.d], rim: '#e8c8c0', rimSide: 1, rimW: 1.5, shadeA: .15 }); g.restore();
    }
  }
  const truck19 = (t) => (t - ST[18]) * 60 + 300 * eio(lin(nxt(18) - .5, nxt(18) + .4, t));
  add(18, { tr: 'up', d: .8, draw(ctx, t, s) {
    evict(t); const bs = bridgeSet(s.b), C19 = cam(t, { z: 1.06, amp: .5 }), tr = truck19(t), syn = Math.exp(-Math.pow((t - A.haveTo - .25) / .55, 2));
    L(ctx, C19, .3, (g) => g.drawImage(bs.sky, 0, 0));
    L(ctx, C19, .7, (g) => { g.drawImage(bs.deck, 0, 0); crowd(g, t, { truck: tr, sync: syn }); });
    L(ctx, { ...C19, x: C19.x - ((tr * 1.6) % 56) }, 1, (g) => g.drawImage(bs.rail, 0, 0));
    finish(ctx, { tint: rgba('#a8b8d8', .15) });
  } });
  const cam20 = (t) => { const u = eio(lin(ST[19] - .3, nxt(19), t)), z = mix(1.45, 1.8, u), zp = 1 + (z - 1) * .7, hipY = BR.y(STOPX) + 40; return { ...cam(t, { amp: .4 }), z, x: drift(t, 6), y: drift(t, 4, 1) - (zp * (hipY - H / 2) - 60) / .7 }; };
  add(19, { tr: 'left', d: .8, draw(ctx, t, s) {
    evict(t); const bs = bridgeSet(s.b), u = lin(ST[19], nxt(19), t), pre = 1 - eout(lin(ST[19] - .4, ST[19] + 1.0, t));
    const C20 = cam20(t);
    const tr = truck19(ST[19]) + (t - ST[19]) * 90 * pre;
    const rose = sm(lin(ST[19], nxt(19), t));
    L(ctx, C20, .3, (g) => { g.drawImage(bs.sky, 0, 0); g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = rgba('#ff9a8a', .45 * rose); g.fillRect(0, 0, W, 700); g.restore(); glowA(g, 1500, 560, 600, .25 * rose, '#ffb0a0', '#fff1cf', .5); });
    L(ctx, C20, .7, (g) => {
      g.drawImage(bs.deck, 0, 0);
      crowd(g, t, { truck: tr, sync: 0, fadeFrom: ST[19] + .6 });
      // the one who stops: in the middle, still hunched (doesn't straighten on "tired")
      const s2 = .95, yy = BR.y(STOPX) + 40, stop = sm(lin(ST[19] - .3, ST[19] + 1.2, t)), ph = stop < 1 ? Math.floor(((t / 1.05) % 1) * 8) / 8 * (1 - stop) : 0;
      const pz = walkPose(ph, 1); pz.hip = pz.hip.map((v) => v * (1 - stop)); pz.kn = pz.kn.map((v) => v * (1 - stop) + .06); pz.sh = [.25, .1]; pz.el = [.5, .45]; pz.head = .6 + Math.sin(t * 1.2) * .02;
      g.fillStyle = rgba('#1a1c2a', .35 + .3 * rose); g.save(); g.translate(STOPX, yy + 88 * s2); g.scale(1, .22); g.beginPath(); g.ellipse(-150, 0, 160, 30, 0, 0, 7); g.fill(); g.restore();
      fig(g, 'stopper', STOPX, yy, s2, { ...pz, hair: 'short', coat: .6 }, { dress: { coat: '#6a5a62', pants: '#2a2630', shoes: '#141218', skin: '#d0a890', hair: '#2a1e1a' }, rim: '#ffc8b8', rimSide: 1, rimW: 2, shadeA: .12 });
    });
    L(ctx, C20, 1, (g) => g.drawImage(bs.rail, 0, 0));
    finish(ctx, { tint: rgba('#a8b8d8', .12) });
  } });

  // ============================================================== 3.21 the habit of escaping outlasts the thing (the dog's loop)
  const dogU = (t) => (t - ST[20] + 1) * .07 + .62;
  const cam21 = (t) => { const pull = eio(lin(A.outlasts - .5, A.outlasts + 1.1, t)), z = mix(2.1, 1.02, pull), zp = 1 + (z - 1) * .8, [dx, dy] = loopPt(dogU(t) % 1); return { ...cam(t, { amp: .5 }), z, x: drift(t, 8) - zp * (dx - W / 2) * (1 - pull) / .8, y: drift(t, 5, 3) - zp * (dy - H / 2) * (1 - pull) / .8 }; };
  add(20, { tr: 'zoom', d: .8, ...(() => { const [x, y] = Lp(cam20(ST[20]), .7, STOPX - 60, BR.y(STOPX) + 40 + 88 * .95); return { x, y, depth: 6 }; })(), draw(ctx, t, s) {
    evict(t); const gp = gardenSet(s.b), C21 = cam21(t);
    L(ctx, C21, .8, (g) => {
      g.drawImage(gp, 0, 0);
      // the dog trots its old loop
      const u = dogU(t), [x, y] = loopPt(u % 1), [x2, y2] = loopPt((u + .004) % 1), ang = Math.atan2(y2 - y, x2 - x), step = Math.sin(t * 14);
      g.fillStyle = rgba('#2a3a2a', .35); g.beginPath(); g.ellipse(x + 8, y + 12, 46, 16, ang, 0, 7); g.fill();
      g.save(); g.translate(x, y); g.rotate(ang); const flip = Math.cos(ang) < 0; if (flip) g.scale(1, -1);
      g.fillStyle = '#5a3a24'; for (const [lx, ph] of [[-22, 0], [-14, 3], [16, 1.5], [24, 4.5]]) { g.save(); g.translate(lx, 6); g.rotate(Math.sin(t * 14 + ph) * .5); g.fillRect(-3, 0, 6, 22); g.restore(); }
      g.beginPath(); g.ellipse(0, 0, 34, 15, 0, 0, 7); g.fill();
      g.beginPath(); g.ellipse(36, -10 + step, 15, 11, -.3, 0, 7); g.fill(); g.beginPath(); g.ellipse(48, -6 + step, 9, 6, 0, 0, 7); g.fill();
      g.fillStyle = '#3a2414'; g.beginPath(); g.ellipse(30, -18 + step, 6, 10, .6, 0, 7); g.fill();
      g.save(); g.translate(-32, -6); g.rotate(-.6 + Math.sin(t * 9) * .4); g.fillStyle = '#5a3a24'; g.fillRect(0, -3, -26, 6); g.restore();
      g.fillStyle = rgba('#fff1cf', .35); g.beginPath(); g.ellipse(4, -10, 26, 5, 0, 0, 7); g.fill();
      g.restore();
    });
    finish(ctx, { tint: rgba('#e8e0c0', .1) });
  } });

  // ============================================================== 3.22 that's the slump (K3, the seam widens)
  const cam22 = (t) => { const u = lin(ST[21], nxt(21), t), p = ein(lin(nxt(21) - .5, nxt(21) + .3, t)); return { ...cam(t, { amp: .4 }), z: mix(1.1, 1.18, eio(u)) + p * .4, x: drift(t, 8) - (ROOM.seamX - W / 2) * .55 * mix(.2, .45, u) - p * 140, y: drift(t, 5, 2) }; };
  add(21, { tr: 'iris', d: .6, ...(() => { const [x, y] = Lp(cam21(ST[21]), .8, GARD.cx, GARD.cy); return { x, y, r: 60 }; })(), draw(ctx, t, s) {
    evict(t); const seam = 1.5 + 2.5 * sm(lin(A.slump - .1, A.slump + .5, t));
    drawRoom(ctx, { C: cam22(t), t, until: s.b, mode: 'night', tv: .9, seam });
    finish(ctx);
  } });

  // ============================================================== 3.23 ★ but it's a hangover, not a destiny (the curtain pulled open)
  const open23 = (t) => { const ant = -.03 * Math.sin(Math.PI * lin(A.hangover - .35, A.hangover - .02, t)); return clamp(ant + expo(lin(A.hangover - .02, A.hangover + .55, t)) * 1.0, 0, 1); };
  const cam23 = (t) => { const pull = eio(lin(A.hangover + .05, A.hangover + 1.6, t)), shake = Math.exp(-Math.pow((t - A.hangover - .08) / .12, 2)); return { x: mix(-(ROOM.seamX - W / 2) * .75, 0, pull) + drift(t, 8) + shake * 10 * Math.sin(t * 90), y: drift(t, 5, 2), z: mix(1.75, 1.06, pull) + .03 * lin(A.hangover + 1.6, nxt(22), t) }; };
  add(22, { tr: 'zoom', d: .5, ...(() => { const [x, y] = Lp(cam22(ST[22]), .55, ROOM.seamX, 450); return { x, y, depth: 4 }; })(), draw(ctx, t, s) {
    evict(t); const op = open23(t), arm = sm(lin(A.destiny - .1, A.destiny + .8, t)), hd = sm(lin(A.hangover - .55, A.hangover - .3, t)) * (1 - sm(lin(A.hangover + .9, A.hangover + 1.4, t)));
    const C23 = cam23(t);
    drawRoom(ctx, { C: C23, t, until: s.b, mode: 'morning', open: op, arm, hand: hd });
    // the light stripe sweeps right at the end (the carrier into the kitchen)
    const sw = ein(lin(nxt(22) - .6, nxt(22) + .3, t));
    if (sw > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const x = mix(-400, W + 400, sw); const gr = ctx.createLinearGradient(x - 300, 0, x + 300, 0); gr.addColorStop(0, rgba(P.amb, 0)); gr.addColorStop(.5, rgba(P.hot, .5)); gr.addColorStop(1, rgba(P.amb, 0)); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    // the flash of the yank: the first light hits the lens
    const fl = Math.exp(-Math.pow((t - A.hangover - .12) / .16, 2)); if (fl > .02) { ctx.fillStyle = rgba('#fff1cf', .35 * fl); ctx.fillRect(0, 0, W, H); }
    finish(ctx, { vig: .3, vigCol: '#1a0a10' });
  } });

  // ============================================================== 3.24 some people have already woken up to that message (the ticket)
  const tk = [960, 600];
  add(23, { tr: 'left', d: .7, draw(ctx, t, s) {
    evict(t); const u = lin(ST[23], nxt(23), t), land = 1 - eout(lin(ST[23] - .35, ST[23] + .8, t));
    const C24 = { ...cam(t, { amp: .4 }), z: mix(1.06, 1.24, eio(u)), x: drift(t, 8) + 380 * land, y: drift(t, 5, 2) };
    const bg = once('kitchen-am', s.b, () => plate(W, H, (g) => {
      vg(g, [[0, '#f2d8b0'], [1, '#c89a6a']], 0, 0, 0, 380);
      // a wooden table top seen from above at an angle, morning sun stripes across it
      roughPoly(g, [[-40, 260], [W + 40, 220], [W + 40, H + 40], [-40, H + 40]], '#b07a4a', { amp: 1.5, seed: 1 });
      const r = prng(2); for (let i = 0; i < 90; i++) { const y = 240 + Math.pow(r(), 1.2) * 860; g.strokeStyle = rgba('#5a3a1a', .12 + .14 * r()); g.lineWidth = 1 + (y - 240) / 400; g.beginPath(); g.moveTo(-40, y); g.bezierCurveTo(600, y + (r() - .5) * 30, 1300, y + (r() - .5) * 30, W + 40, y + (r() - .5) * 20); g.stroke(); }
      for (let k = 0; k < 3; k++) { g.fillStyle = rgba('#3a2010', .2); g.fillRect(-40, 420 + k * 260, W + 80, 3); }
      // window light: two warm stripes (the morning stripe again) with stippled edges
      const [lc, lx] = layer(); lx.fillStyle = rgba('#fff1cf', .5); for (const [a, b] of [[300, 720], [820, 1150]]) { lx.beginPath(); lx.moveTo(a, 220); lx.lineTo(b, 220); lx.lineTo(b + 520, H + 40); lx.lineTo(a + 520, H + 40); lx.closePath(); lx.fill(); }
      stipple(lc, { k: .5, seed: 3 }); put(g, lc, { op: 'soft-light' }); put(g, lc, { op: 'lighter', a: .35 });
      // a cup and a folded newspaper at the edges (life going on)
      g.fillStyle = rgba('#000', .25); g.beginPath(); g.ellipse(1600, 420, 110, 40, 0, 0, 7); g.fill(); g.fillStyle = '#f0e8dc'; g.beginPath(); g.ellipse(1580, 400, 90, 34, 0, 0, 7); g.fill(); g.fillStyle = '#5a3020'; g.beginPath(); g.ellipse(1580, 398, 70, 24, 0, 0, 7); g.fill();
      roughPoly(g, [[120, 820], [560, 780], [600, 1100], [100, 1120]], '#e8e2d4', { amp: 1, seed: 4 }); for (let k = 0; k < 9; k++) { g.fillStyle = rgba('#3a3a3a', .25); g.fillRect(160, 850 + k * 24, 340 - (k % 3) * 60, 4); }
    }));
    L(ctx, C24, .8, (g) => g.drawImage(bg, 0, 0));
    const gl = lin(A.message - .1, A.message + .6, t), fl = ein(lin(nxt(23) - .65, nxt(23) + .3, t)), wob = Math.sin(t * 13) * .08 * lin(nxt(23) - .9, nxt(23) - .5, t);
    L(ctx, C24, 1, (g) => { const lift = fl * 900; ticket(g, tk[0] + fl * 80, tk[1] - lift, 2.2 * (1 + fl * .3), -.08 + wob + fl * .6, { glint: gl, stamp: 1 }); });
    finish(ctx, { vig: .3, vigCol: '#2a1408' });
  } });

  // ============================================================== 3.25 big lottery winners (confetti → snow)
  const conf = (() => { const r = prng(77), out = []; for (let i = 0; i < 220; i++) out.push({ x: r() * W, y0: r() * H * 1.4, sp: 120 + r() * 200, sw: r() * 6.28, c: ['#ffb35c', '#ffd59a', '#e8a3a0', '#f3efe2', '#c84a3a', '#8fc8e8'][Math.floor(r() * 6)], s: .6 + r() * .9 }); return out; })();
  add(24, { tr: 'up', d: .6, draw(ctx, t, s) {
    evict(t); const sq = squareSet(s.b), u = lin(ST[24], tEnd + .5, t), C25 = { ...cam(t, { amp: .4 }), z: mix(1.12, 1.04, eout(u)), y: drift(t, 4) };
    const snow = sm(lin(A.winners + .15, tEnd + .1, t));
    L(ctx, C25, .7, (g) => { g.drawImage(sq, 0, 0); if (snow > 0) { g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = rgba('#4a6a9a', .55 * snow); g.fillRect(0, 0, W, H); g.restore(); g.fillStyle = rgba('#1a2a4a', .35 * snow); g.fillRect(0, 0, W, H); } });
    L(ctx, C25, .85, (g) => {
      // the one person in the middle, stunned; looks up on "winners"
      const look = sm(lin(A.winners - .1, A.winners + .35, t)), br = Math.sin(t * 2) * .02;
      g.fillStyle = rgba('#3a2a20', .25); g.beginPath(); g.ellipse(960, 900, 70, 14, 0, 0, 7); g.fill();
      fig(g, 'winner', 960, 900 - 88 * 1.15, 1.15, { lean: -.02 - look * .08, head: mix(.25, -.75, look) + br, sh: [.25 + look * .2, -.1], el: [.6, .5 + look * .4], hip: [.05, -.05], kn: [0, .05], hair: 'short', coat: .8 }, { dress: { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#2a1a14' }, rim: '#fff1cf', rimSide: 1, rimW: 2, shadeA: .1 });
    });
    // confetti falling (gold, rose, cream), cooling into snow; one flake stays centred at the end
    const tl = t - ST[24] + 2;
    for (const c of conf) { const y = ((c.y0 + tl * c.sp) % (H * 1.4)) - H * .2, x = c.x + Math.sin(tl * 1.5 + c.sw) * 30; const col = mixHex(c.c, '#f4f8ff', snow); ctx.save(); ctx.translate(x, y); ctx.rotate(tl * 3 * c.s + c.sw); ctx.fillStyle = col; if (snow < .6) ctx.fillRect(-7 * c.s, -3.5 * c.s, 14 * c.s, 7 * c.s * (.4 + .6 * Math.abs(Math.sin(tl * 5 + c.sw)))); else { ctx.beginPath(); ctx.arc(0, 0, 3.4 * c.s, 0, 7); ctx.fill(); } ctx.restore(); }
    if (snow > 0) { const fy = mix(380, 540, sm(lin(A.winners + .2, tEnd + .5, t))); ctx.fillStyle = rgba('#ffffff', snow); ctx.beginPath(); ctx.arc(W / 2, fy, 7 + snow * 3, 0, 7); ctx.fill(); glowA(ctx, W / 2, fy, 70, .5 * snow, '#cfe0ff', '#ffffff'); }
    finish(ctx, { vig: .35 });
  } });

  return shots;
};
