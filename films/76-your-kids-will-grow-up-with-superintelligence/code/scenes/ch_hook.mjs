// Film 76 · HOOK (h1–h12, lead). Draws keyed by shot id (scenes/plan.mjs). Skills: scenario-motion, world-class-motion-design,
// fluid-motion-design, motion-director-gates, dataviz. One motif per sentence; every shot grows from S.in (the paper plane's landing point)
// or continues the shot before ('match'). Everything is anchored on PHRASES (K.phr → G/U), never on seconds.
import * as K from '../lib/f76_kit.mjs';
const { W, H, P, E, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, GOLD, CREAM, MUTED, MACH, PAPER76 } = K;
const TAU = Math.PI * 2;
const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// the kitchen camera runs across h4 + h5 (one continuous push, so the 'match' seam is invisible)
function kitCam(t, T) {
  const a = T.G('And on an ordinary evening') - .35, b = T.G("You'll reach for the safe") - .35;
  const u = sineIO(span(t, a, b)); return { z: lerp(1.0, 1.1, u), fx: lerp(1000, 1120, u), fy: lerp(560, 470, u) };
}
// the three "safe answer" cards (h6 lands them, h7 tips them): state from phrase times
const CARDS = [['diploma', 'A GOOD DEGREE', 'A good degree', 560], ['plate', 'A SOLID PROFESSION', 'A solid profession', 960], ['shield', 'MACHINE-PROOF', 'Something a machine', 1360]];
function safeCards(ctx, t, T, S) {
  const g = (p) => T.G(p, 0, T.G("You'll reach for the safe") - 1);
  const tipAt = T.G('There is no safe answer');
  // the table surface: a dark plane with the lamp's pool, seen from a little above
  ctx.fillStyle = K.lin(ctx, 0, 560, 0, H, [[0, '#2c2440'], [1, '#160f2a']]); ctx.beginPath(); ctx.moveTo(-100, 640); ctx.lineTo(W + 100, 640); ctx.lineTo(W + 100, H + 40); ctx.lineTo(-100, H + 40); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, 960, 700, 800, [[0, rgba('#ffd98a', .2)], [1, rgba('#ffd98a', 0)]]); ctx.fillRect(0, 600, W, 500); ctx.restore();
  K.cap(ctx, 'THE SAFE ANSWER', 960, 210, span(t, g('safe answer') - .1, g('safe answer') + .6), { size: 34, align: 'center', col: GOLD.text, glow: true });
  CARDS.forEach(([kind, label, p, x], i) => {
    const t0 = g(p) - .05, land = expoOut(span(t, t0, t0 + .55)); if (land <= 0) return;
    const tip = sineIO(span(t, tipAt + .15 + i * .22, tipAt + .75 + i * .22));   // h7: each card tips flat in turn
    const y = lerp(-200, 560, land) + Math.sin(Math.PI * span(t, t0 + .45, t0 + .85)) * -8, w = 300, h = 220;
    ctx.save(); ctx.translate(x, y + h / 2 + tip * 60); ctx.rotate(lerp(.04 * (i - 1), 0, land));
    ctx.scale(1, lerp(1, .16, tip)); ctx.globalAlpha *= lerp(1, .55, tip);
    // shadow on the table
    ctx.fillStyle = rgba(P.night0, .45 * land); ctx.beginPath(); ctx.ellipse(10, h / 2 + 14, w * .55, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = K.lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill();
    // the icon on each card (flat shapes)
    ctx.save(); ctx.translate(0, -24);
    if (kind === 'diploma') { ctx.fillStyle = '#e9ddb4'; ctx.beginPath(); ctx.roundRect(-80, -26, 160, 52, 26); ctx.fill(); ctx.fillStyle = '#c9b27a'; ctx.beginPath(); ctx.ellipse(-80, 0, 14, 26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#b0463a'; ctx.fillRect(-12, -26, 24, 52); ctx.fillStyle = '#8f3a30'; ctx.beginPath(); ctx.moveTo(-10, 26); ctx.lineTo(-22, 58); ctx.lineTo(-4, 50); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(10, 26); ctx.lineTo(22, 58); ctx.lineTo(4, 50); ctx.closePath(); ctx.fill(); }
    else if (kind === 'plate') { ctx.fillStyle = '#b89a5a'; ctx.beginPath(); ctx.roundRect(-100, -34, 200, 68, 6); ctx.fill(); ctx.fillStyle = '#e8d29a'; ctx.beginPath(); ctx.roundRect(-92, -26, 184, 52, 4); ctx.fill(); ctx.fillStyle = rgba(PAPER76.ink, .7); ctx.fillRect(-66, -8, 132, 7); ctx.fillRect(-46, 6, 92, 5); }
    else { const crack = span(t, tipAt + .5, tipAt + 1.1); ctx.fillStyle = mixHex('#9fc2ee', '#3a4270', crack); ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(52, -30); ctx.quadraticCurveTo(50, 30, 0, 58); ctx.quadraticCurveTo(-50, 30, -52, -30); ctx.closePath(); ctx.fill();
      if (crack > 0) { ctx.fillStyle = rgba(P.night0, .9); ctx.beginPath(); ctx.moveTo(-4, -48); ctx.lineTo(8, -14 * crack - 10); ctx.lineTo(-8, 10 * crack); ctx.lineTo(6, 58 * crack); ctx.lineTo(0, 58 * crack); ctx.lineTo(-14, 10 * crack); ctx.lineTo(2, -14 * crack - 10); ctx.lineTo(-10, -48); ctx.closePath(); ctx.fill(); } }
    ctx.restore();
    K.cap(ctx, label, 0, h / 2 - 34, rise(span(t, t0 + .25, t0 + .8)), { size: 24, align: 'center', col: PAPER76.ink });
    ctx.restore();
  });
  return tipAt;
}
// the child and the chip facing off across a line (h9) and turning side by side (h10)
function faceOff(ctx, t, T) {
  const fear = T.G('But that fear gets something'), comp = T.G("Your kids won't compete"), side = sineIO(span(t, T.G('compete', 0, comp) - .1, T.G('compete', 0, comp) + 1.1));
  const kx = lerp(620, 860, side), cx = lerp(1300, 1060, side), cy = lerp(520, 470, side);
  // the line between them: drawn on 'fear', retracts upward on 'compete'
  const lu = span(t, fear + .2, fear + .9), lr = span(t, T.G('compete', 0, comp), T.G('compete', 0, comp) + .7);
  if (lu > 0 && lr < 1) { const y0 = lerp(250, 860, lr), y1 = lerp(250, 860, expoOut(lu)); ctx.fillStyle = rgba(CREAM, .7 * (1 - lr)); ctx.fillRect(958, Math.min(y0, y1), 4, Math.abs(y1 - y0)); }
  // ground
  ctx.fillStyle = K.lin(ctx, 0, 860, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(0, 860, W, H - 860);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, (kx + cx) / 2, 860, 600, [[0, rgba('#ffd98a', .12 + .1 * side)], [1, rgba('#ffd98a', 0)]]); ctx.fillRect(0, 700, W, 380); ctx.restore();
  K.kid(ctx, kx, 862, 230, { age: 6, dir: 1, look: lerp(.25, .5, side), lean: lerp(.08, 0, side), light: 1, armR: [lerp(.5, .3, side), lerp(.9, .3, side)] });
  K.chip(ctx, t, cx, cy, 78, { lit: 1, think: .4, rays: .5 * side });
  K.cap(ctx, 'CHILD', kx, 930, span(t, fear - .2, fear + .4) * (1 - side), { size: 24, align: 'center', col: P.coat });
  K.cap(ctx, 'MACHINE', cx, 930, span(t, fear - .2, fear + .4) * (1 - side), { size: 24, align: 'center', col: MACH.heart });
  K.cap(ctx, 'THE FEAR: CHILD VS MACHINE', 960, 160, span(t, fear + .1, fear + .7) * (1 - span(t, comp, comp + .4)), { size: 30, align: 'center', col: CREAM });
  // the question mark on the line (h9, 'wrong')
  const qu = span(t, T.G('wrong', 0, fear) - .1, T.G('wrong', 0, fear) + .5) * (1 - lr);
  if (qu > 0) { halo(ctx, 960, 238, 90, .25 * qu, P.halo0, CREAM); E.glowText(ctx, '?', 960, 270 + (1 - expoOut(qu)) * -40, { size: 120, serif: true, align: 'center', col: CREAM, a: clamp(qu * 3) }); }
  K.cap(ctx, "WON'T COMPETE", 960, 160, span(t, T.G('compete', 0, comp) + .1, T.G('compete', 0, comp) + .7), { size: 40, align: 'center', col: GOLD.text, glow: true });
  return { kx, cx, cy };
}

export default {
  // ---------------------------------------------------------------- h1 LEITBILD 1: the gate; the child lets the paper plane go
  h1(ctx, t, S, T) {
    const u = span(t, 0, S.b + 1);
    const G = K.gateWorld(ctx, t, { cam: { z: lerp(1.0, 1.05, sineIO(u)), fx: 1360, fy: 560 }, walk: lerp(.12, .26, u), windows: 1, gateU: 1 });
    // the plane leaves the child's hand and climbs toward the gate; at S.b - FLY the film's carrier takes it over (same point, same heading)
    const t0 = S.b - 2.0, t1 = S.b - .55, k = span(t, t0, t1);
    if (k > 0 && t < t1) {
      const [hx, hy] = [G.pair.kx + 10, G.pair.ky - G.pair.h * .32], [ox, oy] = S.out;
      const q = sineIO(k), x = lerp(hx, ox, q), y = lerp(hy, oy, q) - Math.sin(Math.PI * q) * 60;
      K.paperPlane(ctx, x, y, lerp(12, 30, q), lerp(-.9, -.3, q), { t, bank: .3 });
    }
  },
  // ---------------------------------------------------------------- h2 like the light switch: the chip hangs like a lamp
  h2(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const on = span(t, G('switch') - .05, G('switch') + .25), flood = sineIO(span(t, G('switch'), G('switch') + 1.2));
    // the nursery wall: dark, then lit by the chip-lamp
    ctx.fillStyle = K.lin(ctx, 0, 0, 0, H, [[0, mixHex('#0b1238', '#2a2a52', flood)], [1, mixHex('#070a22', '#1a1a3a', flood)]]); ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.06, fx: 1000, fy: 420 });
    ctx.fillStyle = mixHex('#0a0f30', '#221d3e', flood); ctx.fillRect(-100, 900, W + 200, 300);   // floor
    ctx.fillStyle = rgba('#000', .25); ctx.fillRect(-100, 896, W + 200, 6);
    // a small bed edge and a toy, so it reads as a child's room
    ctx.fillStyle = mixHex('#141a46', '#3a3460', flood); ctx.beginPath(); ctx.roundRect(1350, 760, 520, 150, 18); ctx.fill(); ctx.fillStyle = mixHex('#1c2456', '#e8dcc0', flood * .5); ctx.beginPath(); ctx.roundRect(1370, 740, 200, 60, 26); ctx.fill();
    ctx.fillStyle = mixHex('#1a2050', '#c98a4a', flood * .7); ctx.beginPath(); ctx.arc(1180, 872, 30, 0, TAU); ctx.fill();
    // the chip-lamp hangs from the ceiling (the plane landed on it); dark until the switch
    K.chip(ctx, t, 1250, 330 + Math.sin(t * 1.2) * 3, 62 * expoOut(IN(.7)) + 1, { hang: -40, lit: .08 + .92 * sineIO(on), rays: flood, think: flood * .35 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, 0, 400, 0, 900, [[0, rgba('#ffe7b0', .16 * flood)], [1, rgba('#ffe7b0', 0)]]); ctx.beginPath(); ctx.moveTo(1170, 400); ctx.lineTo(1330, 400); ctx.lineTo(1800, 900); ctx.lineTo(700, 900); ctx.closePath(); ctx.fill(); ctx.restore();
    // the switch and the child who reaches it
    const tip = K.lightSwitch(ctx, 560, 560, 34, on);
    const reach = sineIO(span(t, G('like the light') - .4, G('switch') - .05));
    K.kid(ctx, 470, 900, 300, { age: 4, dir: 1, look: lerp(.2, .9, reach), light: 1, back: .2, armR: [lerp(.3, 2.75, reach), lerp(.3, 2.9, reach)] });
    K.cap(ctx, 'LIKE THE LIGHT SWITCH', 560, 470, U('like the light', .7, -.1), { size: 26, align: 'center', col: CREAM });
    ctx.restore();
  },
  // ---------------------------------------------------------------- h3 smarter than every adult they know
  h3(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 260, ga: .3, gcol: '#5a4a2a' });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fx: 960, fy: 500 });
    const adults = [['MOM', 640], ['DAD', 800], ['TEACHER', 960], ['GRANDMA', 1120], ['DOCTOR', 1280]];
    const au = span(t, S.a + .1, G('every adult') + .1), lineY = 560;
    adults.forEach(([lab, x], i) => {
      const e = rise(span(au, i * .15, i * .15 + .45)); if (e <= 0) return;
      const h = [270, 290, 280, 255, 285][i];
      ctx.save(); ctx.globalAlpha *= e; E.person(ctx, x, 880 + (1 - e) * 20, h, { look: .35, light: .6, long: i === 3 }); ctx.restore();
      halo(ctx, x, 880 - h * 1.02, 34, .5 * e, GOLD.halo, GOLD.core);   // each one's light of knowing
      K.cap(ctx, lab, x, 880 - h - 52, e, { size: 22, align: 'center', col: MUTED });
    });
    // the dashed line at the brightest of them, the chip's line far above
    const du = span(t, G('every adult') - .1, G('every adult') + .5);
    if (du > 0) { ctx.save(); ctx.globalAlpha *= du; ctx.setLineDash([12, 10]); ctx.strokeStyle = rgba(GOLD.line, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(500, lineY); ctx.lineTo(500 + 920 * expoOut(du), lineY); ctx.stroke(); ctx.restore(); K.cap(ctx, 'EVERY ADULT THEY KNOW', 1440, lineY + 8, du, { size: 22, col: GOLD.text }); }
    const rise1 = sineIO(span(t, G('smarter') - .1, G('know') + .3)), cy = lerp(300, 230, rise1);
    K.chip(ctx, t, 960, cy, 58 + 8 * rise1, { lit: 1, think: .4, rays: .6 });
    const bu = span(t, G('smarter'), G('smarter') + .8);
    if (bu > 0) { K.lightLine(ctx, [[1500, lineY], [1500, cy]], 0, expoOut(bu), { body: MACH.heart, line: MACH.heartCore, deep: MACH.heartDeep }, { w: 3, arrow: true });
      K.cap(ctx, 'SMARTER', 1530, (lineY + cy) / 2 + 10, bu, { size: 30, col: MACH.heartCore, glow: true }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- h4 the kitchen table, an ordinary evening; the child looks up
  h4(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    K.kitchen(ctx, t, { cam: kitCam(t, T), childAge: 6, lamp: .35 + .65 * sineIO(span(t, S.a, G('evening') + .4)), grand: span(t, G('grandchild') - .2, G('grandchild') + .8),
      look: sineIO(span(t, G('look up') - .2, G('look up') + .7)) });
  },
  // ---------------------------------------------------------------- h5 the question; the page folds into the paper plane (carrier born)
  h5(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const R = K.kitchen(ctx, t, { cam: kitCam(t, T), childAge: 6, lamp: 1, grand: 1, look: 1 });
    // the question writes itself word by word above the table (in screen space: the kitchen camera is already applied inside kitchen())
    const words = T.GW('What should I be when', 'up?', S.a - .5), size = 76;
    const line = words.map((w) => w.w.replace(/["“”]/g, '')).join(' '), tw = K.measure(line, size, true);
    let xx = 960 - tw / 2;
    for (const w of words) { const s = w.w.replace(/["“”]/g, ''), u = span(t, w.s - .12, w.s + .38); if (u > 0) K.serif(ctx, s, xx, 200, size, u, { col: CREAM }); xx += K.measure(s + ' ', size, true); }
    // the notebook page lifts, folds and becomes the plane at S.out by the time the film's flight begins
    const tf = T.G("You'll reach for the safe") - .35 - .55, f0 = tf - 1.4, k = span(t, f0, tf);
    if (k > 0 && t < tf + .02) {
      const cam = kitCam(t, T), toScr = (x, y) => [(x - cam.fx) * cam.z + cam.fx, (y - cam.fy) * cam.z + cam.fy];
      const [nx, ny] = toScr(R.nb[0], R.nb[1] - 8), q = sineIO(k), [ox, oy] = S.out;
      const x = lerp(nx, ox, q), y = lerp(ny, oy, q) - Math.sin(Math.PI * q) * 70;
      K.paperPlane(ctx, x, y, lerp(70, 30, q), lerp(0, -.3, q), { open: 1 - sineIO(span(k, .15, .8)), t, bank: .2 });
    }
  },
  // ---------------------------------------------------------------- h6 the safe answer: three cards land
  h6(ctx, t, S, T) {
    K.bg(ctx, t, { gx: 960, gy: 420, ga: .28, gcol: '#5a4a2a', stars: 30 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 600 }); safeCards(ctx, t, T, S); ctx.restore();
  },
  // ---------------------------------------------------------------- h7 there is no safe answer (match: same cards, they tip)
  h7(ctx, t, S, T) {
    const P6 = { a: T.G("You'll reach for the safe") - .35, b: S.a, seed: S.seed - 7 };
    K.bg(ctx, t, { gx: 960, gy: 420, ga: lerp(.28, .16, span(t, S.a, S.a + 1)), gcol: '#5a4a2a', stars: 30 });
    ctx.save(); K.shotCam(ctx, t, { ...P6, b: S.b }, { z0: 1.0, z1: 1.05, fx: 960, fy: 600 });
    const tipAt = safeCards(ctx, t, T, S);
    const nu = span(t, T.G('safe answer', 0, tipAt) - .1, T.G('safe answer', 0, tipAt) + .6);
    K.serif(ctx, 'No safe answer.', 960, 420, 120, nu, { align: 'center', col: CREAM });
    ctx.restore();
  },
  // ---------------------------------------------------------------- h8 six in ten parents: bleak 35 % · frightening 25 %
  h8(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .22 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1, fx: 960, fy: 560 });
    const sixU = span(t, G('six in ten') - .1, G('American parents') + .2), splitU = span(t, G('bleak') - .1, G('frightening') + .4);
    const dark = (i) => (i < 7 || (i >= 10 && i < 15)) ? sineIO(span(sixU, ((i % 10) / 10) * .6, ((i % 10) / 10) * .6 + .4)) : 0;
    const pu = span(t, G('parents') - .3, G('parents') + 1.2);
    // the 12 of 20 who answered bleak/frightening keep a pale rim and lower their heads; the other 8 sink back into the night
    for (const [row, y] of [[0, 540], [1, 820]]) {
      K.figRow(ctx, t, 420, y, 10, 120, 180, span(pu, row * .25, .75 + row * .25), (i) => {
        const k = row * 10 + i, d = dark(k), worried = (k < 7 || (k >= 10 && k < 15));
        return worried ? { lit: .35 * d, halo: '#4a5bb0', core: '#c9d2ff', rim: d > .3 ? '#c9d2ff' : undefined, look: .2 - .55 * d } : { dim: sixU, look: .2 };
      });
    }
    K.cap(ctx, 'AMERICAN PARENTS', 960, 118, span(pu, .1, .6), { size: 26, align: 'center', col: MUTED });
    const big = span(t, G('six in ten') - .05, G('six in ten') + .5);
    if (big > 0) { E.glowText(ctx, '6 IN 10', 960, 226, { size: 104, serif: true, align: 'center', col: '#fff6d8', a: clamp(big * 3) }); }
    // the split: brackets above the dark groups of each row, BLEAK 35 % · FRIGHTENING 25 %
    const br = (x0, x1, y, lab, u) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y + 12); ctx.lineTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * expoOut(u), y); if (u > .95) ctx.lineTo(x1, y + 12); ctx.stroke(); ctx.restore(); K.cap(ctx, lab, (x0 + x1) / 2, y - 14, u, { size: 26, align: 'center', col: CREAM }); };
    br(370, 1190, 318, 'BLEAK · 35 %', span(t, G('bleak') - .1, G('bleak') + .5));
    br(370, 950, 600, 'FRIGHTENING · 25 %', span(t, G('frightening') - .1, G('frightening') + .5));
    K.src(ctx, t, G('In a new survey') - .2, S.b + 2, 'IFS / YOUGOV · 2,000 U.S. PARENTS OF SCHOOL-AGE CHILDREN · NOV 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- h9 the fear: child vs machine, a question mark on the line
  h9(ctx, t, S, T) {
    K.bg(ctx, t, { gx: 960, gy: 480, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.03, fx: 960, fy: 560 }); faceOff(ctx, t, T); ctx.restore();
  },
  // ---------------------------------------------------------------- h10 won't compete: the line goes, they stand side by side (match)
  h10(ctx, t, S, T) {
    const a9 = T.G('But that fear gets something') - .35;
    K.bg(ctx, t, { gx: 960, gy: 480, ga: lerp(.25, .32, span(t, S.a, S.b)), gcol: mixHex(P.blue0, '#5a4a2a', span(t, S.a, S.b)) });
    ctx.save(); K.shotCam(ctx, t, { a: a9, b: S.b, seed: S.seed - 7 }, { z0: 1.0, z1: 1.06, fx: 960, fy: 560 }); faceOff(ctx, t, T); ctx.restore();
  },
  // ---------------------------------------------------------------- h11 LEITBILD 2 (the turn): electricity → superintelligence
  h11(ctx, t, S, T) {
    const { G, U } = K.phr(T, S, t);
    const el = G('electricity'), u = span(t, S.a, S.b + 1);
    K.gateWorld(ctx, t, { cam: { z: lerp(1.07, 1.02, sineIO(u)), fx: 1100, fy: 640 }, walk: lerp(.3, .4, u), windows: .12 + .88 * sineIO(span(t, G('you grew up') - .2, el + .6)), power: span(t, G('you grew up'), el + .9), gateU: 1,
      over(ctx, W0) {
        K.cap(ctx, 'SUPERINTELLIGENCE', 1300, 250, U("They'll grow up", .7, .1), { size: 30, align: 'right', col: GOLD.text, glow: true });
        K.cap(ctx, 'THEY WILL GROW UP WITH IT', 1300, 290, U("They'll grow up", .7, .35), { size: 22, align: 'right', col: CREAM });
        K.cap(ctx, 'ELECTRICITY', 520, 520, U('electricity', .7, -.1), { size: 30, align: 'center', col: GOLD.text, glow: true });
        K.cap(ctx, 'YOU GREW UP WITH IT', 520, 560, U('you grew up', .7, 0), { size: 22, align: 'center', col: CREAM });
      } });
  },
  // ---------------------------------------------------------------- h12 the more machines can do, the more a few human things are worth
  h12(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1000, gy: 520, ga: .25, gcol: '#3a3a5a' });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 560 });
    const base = 820, canU = span(t, G('can do') - .6, G('human things') + .3), worthU = span(t, G('more a few') - .2, G('worth') + .6);
    // the machine: its column of what it can do grows up from the base, the chip rides on top
    const top = lerp(base - 40, 300, sineIO(canU));
    K.lightLine(ctx, [[640, base], [640, top]], 0, 1, { body: MACH.heart, line: MACH.heartCore, deep: MACH.heartDeep }, { w: 4 });
    K.chip(ctx, t, 640, top - 10, 44 * expoOut(IN(.6)) + 1, { lit: 1, think: .4 });
    K.cap(ctx, 'WHAT MACHINES CAN DO', 640, base + 50, IN(.8, .2), { size: 24, align: 'center', col: MACH.heartCore });
    ctx.fillStyle = rgba(CREAM, .25); ctx.fillRect(420, base, 1180, 2);
    // a few human things: small gold lights that grow brighter and heavier; no names yet, only ?
    const L = [[1120, 660], [1300, 600], [1460, 680]], wv = sineIO(worthU);
    L.forEach(([x, y], i) => {
      const e = expoOut(span(t, G('a few human') - .2 + i * .12, G('a few human') + .5 + i * .12)); if (e <= 0) return;
      const yy = lerp(y + 60, y - 120 * wv, 1) , r = lerp(10, 26, wv) * e;
      halo(ctx, x, yy, r * 7, .55 * e, GOLD.halo, GOLD.core);
      ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, yy, r, 0, TAU); ctx.fill();
      K.cap(ctx, '?', x, yy + r + 46, span(t, G('things') - .1 + i * .1, G('things') + .5 + i * .1), { size: 30, align: 'center', col: CREAM });
    });
    K.cap(ctx, 'A FEW HUMAN THINGS: WORTH MORE', 1300, 300, U('worth', .7, -.2), { size: 28, align: 'center', col: GOLD.text, glow: true });
    if (wv > 0) K.lightLine(ctx, [[1580, 760], [1580, lerp(760, 420, wv)]], 0, 1, GOLD, { w: 3, arrow: true, a: clamp(wv * 3) });
    ctx.restore();
  },
};
