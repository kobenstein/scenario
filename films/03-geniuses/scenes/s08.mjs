// 08 · Two endings (6:16–7:20): the same waiting room of an eye clinic in two futures, then clip K8.
// Carrier chain: clinic sign → door → waiting room → window → envelopes → stack on the desk → window (calendar wheel) → world map
// → price tag → jug → folded hands → page turn → same room in morning light → window → petri dish → robot-lab dishes
// → green checks at three side-by-side doors → coin → eye chart → letters become constellations around the clip screen (centre).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, back, prng, canvas, addGlow, glow, text, drift } from '../engine.mjs';
import { P, fogBand, cone, person, finish, shade, mixHex } from '../lib/world.mjs';
import { clipScreen, clipLabel, clipQuote } from '../lib/kit.mjs';
import { once, cam, eyeChart, CHART, wallClock, mood, windowView, windowFrame, mother, envelope } from '../lib/s08_helpers.mjs';

const pop = (t, t0, d = .5) => back(clamp((t - t0) / d));

// ---------- the clinic waiting room, wide (used in both futures) ----------
// m = mood 0 cool/grey .. 1 warm morning; returns nothing, draws in world space (camera applied by caller)
const WIN = { x: 1060, y: 170, w: 620, h: 470 };
function clinicRoom(ctx, t, m, { look = 0, viewCity = 1 - m } = {}) {
  const M = mood(m);
  const g = ctx.createLinearGradient(0, 0, 0, 820); g.addColorStop(0, M.wallTop); g.addColorStop(1, M.wallBot);
  ctx.fillStyle = g; ctx.fillRect(-300, -200, W + 600, 1020);
  // wainscot + skirting
  ctx.fillStyle = shade(M.wallBot, -.06); ctx.fillRect(-300, 640, W + 600, 180); ctx.fillStyle = shade(M.wallBot, .05); ctx.fillRect(-300, 636, W + 600, 6);
  // floor with a soft reflection
  const f = ctx.createLinearGradient(0, 820, 0, H); f.addColorStop(0, shade(M.floor, .05)); f.addColorStop(1, M.floor);
  ctx.fillStyle = f; ctx.fillRect(-300, 820, W + 600, 500);
  ctx.strokeStyle = rgba('#ffffff', .03); ctx.lineWidth = 2; for (let i = -10; i < 20; i++) { ctx.beginPath(); ctx.moveTo(960 + i * 160, 820); ctx.lineTo(960 + i * 420, H + 200); ctx.stroke(); }
  // window + view
  windowView(ctx, t, WIN.x, WIN.y, WIN.w, WIN.h, m, { city: viewCity });
  windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, m);
  // light falling through the window onto the floor
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const lb = ctx.createLinearGradient(WIN.x, WIN.y, WIN.x - 200, 1080); lb.addColorStop(0, rgba(M.light, M.lightA * .6)); lb.addColorStop(1, rgba(M.light, 0));
  ctx.fillStyle = lb; ctx.beginPath(); ctx.moveTo(WIN.x, WIN.y + WIN.h); ctx.lineTo(WIN.x + WIN.w, WIN.y + WIN.h); ctx.lineTo(WIN.x + WIN.w - 420, 1100); ctx.lineTo(WIN.x - 520, 1100); ctx.fill();
  ctx.restore();
  // eye chart + clock
  eyeChart(ctx, 250, 200, 300, 470, { paper: mixHex('#c9c7c2', '#f4e8d2', m), sharp: () => .8 });
  wallClock(ctx, 790, 250, 64, t, { face: mixHex('#c9c7c2', '#f4e8d2', m) });
  // a plant by the window
  ctx.fillStyle = shade(M.wallBot, -.15); ctx.fillRect(1730, 740, 70, 80);
  for (let i = 0; i < 7; i++) { const a = -1.2 + i * .4 + Math.sin(t * .8 + i) * .05; ctx.strokeStyle = mixHex('#1f3b3a', '#4f7a52', m); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1765, 745); ctx.quadraticCurveTo(1765 + Math.sin(a) * 60, 700, 1765 + Math.sin(a) * 100, 745 - Math.cos(a) * 130); ctx.stroke(); }
  // chairs (row along the wall), mother in the third
  for (let i = 0; i < 5; i++) {
    const cx = 560 + i * 120;
    ctx.fillStyle = shade(M.floor, .12); ctx.beginPath(); ctx.roundRect(cx - 44, 700, 88, 120, 10); ctx.fill();
    ctx.fillStyle = shade(M.floor, .2); ctx.fillRect(cx - 48, 800, 96, 18); ctx.fillStyle = shade(M.floor, -.1); ctx.fillRect(cx - 40, 818, 8, 50); ctx.fillRect(cx + 32, 818, 8, 50);
  }
  mother(ctx, 800, 868, 330, t, { look, warm: m });
  addGlow(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 520, .1 + .14 * m, M.light, '#fff3dd');
}

// ---------- 74 · "Let's imagine it's 2035. A scenario, not a forecast." Clinic sign swinging, stamp lands ----------
const clinicSign = (T) => {
  const tY = T.S('08a', 'twenty thirty-five'), tSc = T.S('08a', 'scenario'), tEnd = T.S('08a', 'Your mother');
  return (ctx, t, s) => {
    const push = eio(lin(tSc + 1.2, tEnd + .4, t)), z = mix(1, 1.5, push);
    ctx.save(); cam(ctx, mix(960, 960, push), mix(560, 700, push), z);
    // dusk street front
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#141842'); g.addColorStop(1, '#3d4c86'); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800);
    fogBand(ctx, t, 520, 260, { a: .25, hex: '#8ab8e8', seed: 3 });
    // facade
    ctx.fillStyle = '#1a1f4c'; ctx.fillRect(260, 220, 1400, 900);
    ctx.fillStyle = '#121642'; ctx.fillRect(240, 200, 1440, 30);
    for (let i = 0; i < 4; i++) { const wx = 330 + i * 360; if (i === 1 || i === 2) continue; ctx.fillStyle = rgba('#ffd29a', .55 + .1 * Math.sin(t + i)); ctx.fillRect(wx, 330, 220, 240); ctx.strokeStyle = '#121642'; ctx.lineWidth = 10; ctx.strokeRect(wx, 330, 220, 240); addGlow(ctx, wx + 110, 450, 220, .18, P.amber, '#fff3dd'); }
    // glass door, warm inside (carrier for the next shot)
    ctx.fillStyle = '#ffdcae'; ctx.fillRect(860, 520, 200, 380); ctx.fillStyle = 'rgba(30,25,60,.25)'; ctx.fillRect(958, 520, 4, 380);
    addGlow(ctx, 960, 700, 300, .35, P.amber, '#fff6e0');
    ctx.strokeStyle = '#0f1238'; ctx.lineWidth = 14; ctx.strokeRect(853, 513, 214, 394);
    // pavement
    ctx.fillStyle = '#0e1134'; ctx.fillRect(-400, 900, W + 800, 500);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pb = ctx.createLinearGradient(0, 900, 0, 1080); pb.addColorStop(0, rgba(P.amber, .3)); pb.addColorStop(1, rgba(P.amber, 0)); ctx.fillStyle = pb; ctx.beginPath(); ctx.moveTo(860, 900); ctx.lineTo(1060, 900); ctx.lineTo(1260, 1080); ctx.lineTo(660, 1080); ctx.fill(); ctx.restore();
    // hanging sign on a bracket, swinging in the wind
    ctx.fillStyle = '#0d1036'; ctx.fillRect(1100, 410, 340, 12); ctx.fillRect(1100, 370, 12, 70);
    const sw = Math.sin(t * 1.4) * .12 + Math.sin(t * 2.3) * .04;
    ctx.save(); ctx.translate(1380, 420); ctx.rotate(sw); ctx.scale(1.9, 1.9);
    ctx.strokeStyle = '#0d1036'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(-80, 34); ctx.moveTo(80, 0); ctx.lineTo(80, 34); ctx.stroke();
    ctx.fillStyle = '#e9e4d6'; ctx.beginPath(); ctx.roundRect(-120, 34, 240, 150, 10); ctx.fill();
    // eye icon
    ctx.strokeStyle = '#2a3a7a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-70, 92); ctx.quadraticCurveTo(0, 40, 70, 92); ctx.quadraticCurveTo(0, 144, -70, 92); ctx.stroke();
    ctx.fillStyle = '#2a3a7a'; ctx.beginPath(); ctx.arc(0, 92, 18, 0, 7); ctx.fill();
    ctx.fillStyle = '#5a6aa0'; ctx.font = '600 20px "Inter"'; ctx.textAlign = 'center'; try { ctx.letterSpacing = '5px'; } catch { } ctx.fillText('EYE CLINIC', 0, 172); try { ctx.letterSpacing = '0px'; } catch { }
    // stamp lands on the sign
    const st = clamp((t - tSc + .05) / .35);
    if (st > 0) {
      const sc = mix(2.4, 1, eout(st)), a = sm(st);
      ctx.save(); ctx.translate(10, 104); ctx.rotate(-.14); ctx.scale(sc, sc); ctx.globalAlpha = a * .9;
      ctx.strokeStyle = '#d0473a'; ctx.lineWidth = 4; ctx.strokeRect(-112, -30, 224, 60);
      ctx.fillStyle = '#d0473a'; ctx.font = '600 24px "Inter"'; ctx.textAlign = 'center'; try { ctx.letterSpacing = '6px'; } catch { } ctx.fillText('SCENARIO · 2035', 0, 9); ctx.restore();
    }
    ctx.restore();
    lamp(ctx, 380, 900, t); lamp(ctx, 1560, 900, t);
    ctx.restore();
    // year rolls in big, then the caveat line
    const ay = eout(lin(tY - .1, tY + .5, t)) * (1 - lin(tEnd - .6, tEnd, t));
    text(ctx, '2035', 140, 210 + (1 - ay) * 30, { size: 120, font: 'Instrument Serif', alpha: ay });
    const ac = eout(lin(tSc + .5, tSc + 1.1, t)) * (1 - lin(tEnd - .6, tEnd, t));
    text(ctx, 'A SCENARIO, NOT A FORECAST', 146, 262, { size: 20, weight: 600, color: C.muted, alpha: ac, spacing: 7 });
    finish(ctx, t, { vig: .5 });
  };
};
function lamp(ctx, x, y, t) {
  ctx.fillStyle = '#0b0d2c'; ctx.fillRect(x - 5, y - 420, 10, 420);
  ctx.beginPath(); ctx.moveTo(x - 26, y - 420); ctx.lineTo(x + 26, y - 420); ctx.lineTo(x + 16, y - 450); ctx.lineTo(x - 16, y - 450); ctx.fill();
  addGlow(ctx, x, y - 410, 140, .55 + .03 * Math.sin(t * 9), P.amber, '#fff3dd');
}

// ---------- 75 · "Your mother sits in the waiting room of an eye clinic." ----------
const waitingRoom = (T, m, key) => {
  const tA = key === 1 ? T.S('08a', 'Your mother') : T.S('08a', 'second future');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save();
    // slow glide: from the clock across to the window (first future) / gentle push to the chair (second)
    if (key === 1) cam(ctx, mix(640, 1060, u), mix(560, 520, u), mix(1.45, 1.35, u));
    else cam(ctx, mix(1000, 860, u), mix(520, 620, u), mix(1.25, 1.5, u));
    clinicRoom(ctx, t, m, { look: key === 1 ? -.4 : .2 });
    ctx.restore();
    if (key === 2) { const a = lin(s.a, s.a + 1.5, t); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.amber, .06 * a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 76 · "...found hundreds of promising leads for her kind of blindness." Envelopes out of the city of light ----------
const ENV = (() => { const r = prng(808); return Array.from({ length: 220 }, (_, i) => ({ d: r() * 3.8, a: (r() - .5) * 2.4, sp: .8 + r() * .7, rot: (r() - .5) * 2, side: r() })); })();
const leadsWindow = (T) => {
  const tH = T.S('08a', 'hundreds'), tQ = T.S('08a', "They're sitting");
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), M = mood(0);
    ctx.save(); cam(ctx, 960, 540, mix(1, 1.06, u));
    ctx.fillStyle = M.wallTop; ctx.fillRect(-100, -100, W + 200, H + 200);
    const wx = 300, wy = 90, ww = 1320, wh = 800;
    windowView(ctx, t, wx, wy, ww, wh, 0, { city: 1, seed: 7 });
    // envelopes stream out of the glowing core toward the viewer, drifting down-right (toward the desk)
    const cx = wx + ww * .5, cy = wy + wh * .74;
    for (const e of ENV) {
      const k = (t - tH - e.d) * .45 * e.sp; if (k <= 0 || k > 1.3) continue;
      const kk = eio(clamp(k)), x = cx + Math.sin(e.a) * 900 * kk + kk * kk * 500, y = cy - Math.cos(e.a) * 260 * kk + kk * kk * 420 - 80 * Math.sin(Math.PI * kk);
      envelope(ctx, x, y, mix(3, 32, kk), e.rot * kk + Math.sin(t * 2 + e.d * 9) * .2, { a: sm(lin(0, .1, k)) * (1 - lin(1.1, 1.3, k)), glowA: .7 });
    }
    addGlow(ctx, cx, cy, 380 + 60 * Math.sin(t * 2), .3 * sm(lin(tH - .5, tH + .5, t)), P.amber, '#fff3dd');
    windowFrame(ctx, wx, wy, ww, wh, 0);
    // back of the mother's head in the foreground, bottom left
    ctx.fillStyle = '#0c0e2a'; ctx.beginPath(); ctx.ellipse(470, 1080, 300, 160, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#8f8a9c'; ctx.beginPath(); ctx.ellipse(470, 900, 110, 128, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#b5b0c0'; ctx.beginPath(); ctx.arc(470, 812, 52, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(470, 912, 70 + i * 6, Math.PI * 1.15, Math.PI * 1.6); ctx.stroke(); }
    addGlow(ctx, 380, 860, 120, .12, '#9fb6d8', '#e0e8ff');
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 77 · "They're sitting in a queue." Envelopes pile up into a tower at reception; the bell lies unused ----------
const STACK = (() => { const r = prng(77); return Array.from({ length: 70 }, () => ({ dx: (r() - .5) * 26, rot: (r() - .5) * .12, col: mixHex('#e9e4d6', '#c9c4b6', r()) })); })();
const queueDesk = (T) => {
  const t0 = T.S('08a', "They're sitting"), t1 = T.S('08a', 'Trials run');
  return (ctx, t, s) => {
    const u = lin(s.a, s.b, t), n = Math.floor(mix(14, 70, eout(lin(s.a - .2, s.b - .6, t)))), M = mood(0);
    const top = 760 - n * 9;
    ctx.save(); cam(ctx, 960, mix(560, 480, sine(u)), mix(1.05, 1.0, u));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, M.wallTop); g.addColorStop(1, M.wallBot); ctx.fillStyle = g; ctx.fillRect(-200, -300, W + 400, H + 600);
    text(ctx, 'RECEPTION', 960, 170, { size: 26, weight: 600, color: C.muted, align: 'center', alpha: .6, spacing: 12 });
    // queue number display: barely moves
    ctx.fillStyle = '#0a0c24'; ctx.beginPath(); ctx.roundRect(1300, 230, 260, 120, 10); ctx.fill();
    text(ctx, 'NOW SERVING', 1430, 270, { size: 16, weight: 600, color: C.muted, align: 'center', spacing: 4 });
    text(ctx, '0012', 1430, 330, { size: 52, weight: 600, color: '#ff6b5a', align: 'center' });
    addGlow(ctx, 1430, 310, 120, .15, '#ff6b5a', '#ffd0c8');
    // counter
    ctx.fillStyle = '#1d2250'; ctx.fillRect(-200, 760, W + 400, 30); ctx.fillStyle = '#141838'; ctx.fillRect(-200, 790, W + 400, 400);
    ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(-200, 760, W + 400, 4);
    // the bell, unused, a tiny glint
    ctx.fillStyle = '#c9a36a'; ctx.beginPath(); ctx.ellipse(1260, 750, 46, 12, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(1260, 748, 36, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#8a6a3a'; ctx.fillRect(1256, 700, 8, 14);
    addGlow(ctx, 1246, 724, 30, .4 + .3 * Math.sin(t * 1.3), '#ffe6b0', '#fff');
    // the stack
    for (let i = 0; i < n; i++) { const e = STACK[i], y = 750 - i * 9; ctx.save(); ctx.translate(900 + e.dx + Math.sin(i * .3) * 4 * (i / 70), y); ctx.rotate(e.rot); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-92, 2, 184, 8); ctx.fillStyle = e.col; ctx.fillRect(-90, -8, 180, 10); ctx.restore(); }
    // new envelopes arriving from the upper left and landing on top
    for (let k = 0; k < 6; k++) {
      const ph = ((t - s.a) * .9 + k / 6) % 1, x = mix(-100, 900, eout(ph)), y = mix(120 + k * 40, top - 10, ein(ph));
      envelope(ctx, x, y, mix(34, 60, ph), mix(-.8, 0, ph), { a: sm(lin(0, .1, ph)) * (1 - lin(.9, 1, ph)) });
    }
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 78 · "Trials run the way they always have." A calendar water-wheel turns slowly outside the window ----------
const YEARS = ['2035', '2036', '2037', '2038', '2039', '2040', '2041', '2042', '2043', '2044'];
const calendarWheel = (T) => {
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), M = mood(0);
    ctx.save(); cam(ctx, 960, 540, mix(1.0, 1.08, u));
    ctx.fillStyle = M.wallTop; ctx.fillRect(-100, -100, W + 200, H + 200);
    const wx = 260, wy = 80, ww = 1400, wh = 820;
    windowView(ctx, t, wx, wy, ww, wh, 0, { city: .35, seed: 11 });
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    // stream
    ctx.fillStyle = '#26346a'; ctx.fillRect(wx, wy + wh * .82, ww, wh * .2);
    ctx.strokeStyle = 'rgba(160,200,240,.25)'; ctx.lineWidth = 2; for (let i = 0; i < 14; i++) { const lx = ((i * 140 - t * 30) % ww + ww) % ww + wx; ctx.beginPath(); ctx.moveTo(lx, wy + wh * .88 + (i % 3) * 14); ctx.lineTo(lx + 60, wy + wh * .88 + (i % 3) * 14); ctx.stroke(); }
    // the wheel: paddles are calendar pages with years; it creaks round, slowly, with little jerks
    const cx = 960, cy = 560, R = 330, ang = t * .09 + .05 * Math.sin(t * 2.1) * Math.sin(t * .7);
    ctx.fillStyle = '#121640'; ctx.fillRect(cx - 14, cy, 28, 400); ctx.fillRect(cx - 120, cy + 380, 240, 20);
    ctx.strokeStyle = '#2a2f66'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, R * .55, 0, 7); ctx.stroke();
    for (let i = 0; i < 10; i++) {
      const a = ang + i / 10 * Math.PI * 2, px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R;
      ctx.strokeStyle = '#2a2f66'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
      ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = '#e9e4d6'; ctx.fillRect(-62, -78, 124, 96); ctx.fillStyle = '#c0473a'; ctx.fillRect(-62, -78, 124, 22);
      ctx.fillStyle = '#2a2a3a'; ctx.font = '600 34px "Inter"'; ctx.textAlign = 'center'; ctx.fillText(YEARS[i], 0, -2);
      ctx.restore();
      // water dripping from paddles near the bottom
      if (Math.sin(a) > .6) { for (let k = 0; k < 3; k++) { const dy = ((t * 260 + k * 60 + i * 30) % 160); ctx.fillStyle = rgba('#a8d8ff', .6 * (1 - dy / 160)); ctx.fillRect(px - 20 + k * 20, py + 30 + dy, 3, 10); } }
    }
    ctx.fillStyle = '#3a3f7a'; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, 7); ctx.fill();
    ctx.restore();
    windowFrame(ctx, wx, wy, ww, wh, 0);
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 79 · "The few treatments that make it are expensive and reach rich cities first." World map: lights only in a few rich cities ----------
const LAND = [
  [[-168, 66], [-140, 70], [-95, 72], [-80, 63], [-60, 55], [-55, 48], [-70, 43], [-76, 35], [-81, 25], [-97, 26], [-97, 18], [-87, 15], [-80, 8], [-83, 9], [-105, 20], [-117, 32], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
  [[-50, 60], [-20, 70], [-20, 82], [-60, 82], [-70, 76]],
  [[-80, 8], [-60, 10], [-50, 0], [-35, -7], [-40, -22], [-55, -35], [-68, -55], [-75, -50], [-72, -18], [-81, -5]],
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [3, 51], [8, 54], [5, 60], [12, 66], [25, 71], [40, 68], [45, 60], [40, 48], [30, 45], [25, 40], [18, 40], [12, 44], [8, 44], [0, 38]],
  [[-6, 50], [2, 51], [0, 58], [-6, 58]],
  [[-17, 15], [-17, 21], [-10, 30], [-6, 36], [10, 37], [32, 31], [34, 28], [43, 12], [51, 12], [40, -2], [40, -15], [35, -25], [20, -35], [17, -28], [12, -15], [9, -1], [9, 4], [-5, 5], [-12, 7]],
  [[44, -14], [50, -16], [47, -25], [43, -22]],
  [[26, 40], [36, 36], [35, 30], [44, 12], [58, 22], [67, 25], [72, 20], [77, 8], [82, 16], [90, 22], [98, 16], [104, 1], [110, 20], [122, 30], [122, 40], [130, 43], [142, 47], [143, 59], [160, 60], [180, 66], [180, 72], [140, 73], [100, 78], [70, 73], [60, 68], [45, 66], [40, 48], [30, 45]],
  [[130, 31], [140, 35], [142, 41], [136, 36]],
  [[95, 5], [106, -6], [120, -9], [140, -5], [150, -8], [130, -2], [110, 2]],
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -28], [150, -37], [140, -38], [132, -32], [115, -34]],
];
const RICH = [[-74, 40.7], [-122.4, 37.8], [-71, 42.4], [-0.1, 51.5], [8.5, 47.4], [2.3, 48.9], [139.7, 35.7], [103.8, 1.3]];
const VILLAGE = [79, 19];
const MAP = { x: 330, y: 160, w: 1260, h: 640 };
const proj = ([lon, lat]) => [MAP.x + (lon + 180) / 360 * MAP.w, MAP.y + (90 - lat) / 160 * MAP.h * .95];
function inPoly(p, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; }
const mapDots = () => once('mapdots', () => {
  const [c, x] = canvas(W, H), step = 13;
  for (let gy = MAP.y; gy < MAP.y + MAP.h; gy += step) for (let gx = MAP.x; gx < MAP.x + MAP.w; gx += step) {
    const lon = (gx - MAP.x) / MAP.w * 360 - 180, lat = 90 - (gy - MAP.y) / (MAP.h * .95) * 160;
    if (LAND.some((p) => inPoly([lon, lat], p))) { x.fillStyle = 'rgba(160,180,230,.55)'; x.beginPath(); x.arc(gx, gy, 3.6, 0, 7); x.fill(); }
  }
  return c;
});
export const TAG = { x: 1250, y: 610 };
function priceTag(ctx, t, x, y, { sw = 1, a = 1 } = {}) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - 150); ctx.rotate(Math.sin(t * 1.7) * .16 * sw);
  ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 150); ctx.stroke();
  ctx.translate(0, 150); ctx.rotate(.12);
  ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.lineTo(70, 30); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.lineTo(-70, 30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1a2a'; ctx.beginPath(); ctx.arc(0, 18, 6, 0, 7); ctx.fill();
  ctx.font = '600 36px "Inter"'; ctx.textAlign = 'center'; ctx.fillStyle = '#7a3b17'; ctx.fillText('$$$$', 0, 74);
  ctx.restore();
}
const worldMap = (T) => {
  const t0 = T.S('08a', 'reach rich'), tEx = T.S('08a', 'expensive');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), M = mood(0);
    ctx.save(); cam(ctx, 960, 520, mix(1.04, 1.0, u));
    ctx.fillStyle = M.wallTop; ctx.fillRect(-100, -100, W + 200, H + 200);
    const wx = 260, wy = 80, ww = 1400, wh = 820;
    const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#0c1030'); g.addColorStop(1, '#1a2050'); ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
    ctx.drawImage(mapDots(), 0, 0);
    // rich cities light up one after another
    RICH.forEach((c, i) => {
      const [x, y] = proj(c), a = sm(lin(t0 - 1.2 + i * .28, t0 - .6 + i * .28, t));
      if (a > 0) { addGlow(ctx, x, y, 70 * a, .7 * a, P.amber, '#fff3dd'); ctx.fillStyle = rgba('#fff3dd', a); ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); }
    });
    // her village: a quiet ring that keeps searching, stays dark
    const [vx, vy] = proj(VILLAGE), pr = (t * .6) % 1;
    ctx.strokeStyle = rgba(C.cream, .6 * (1 - pr)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(vx, vy, 10 + pr * 40, 0, 7); ctx.stroke();
    ctx.fillStyle = '#3a4070'; ctx.beginPath(); ctx.arc(vx, vy, 6, 0, 7); ctx.fill();
    text(ctx, 'HER TOWN', vx + 18, vy + 46, { size: 16, weight: 600, color: C.muted, spacing: 4, alpha: sm(lin(s.a + .4, s.a + 1, t)) });
    windowFrame(ctx, wx, wy, ww, wh, 0, { cross: false });
    ctx.restore();
    priceTag(ctx, t, TAG.x, TAG.y, { a: sm(lin(tEx - .3, tEx + .2, t)) });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 80 · "Nothing collapsed. We just got a small fraction of what was possible." A jug filled only a finger's width ----------
function jug(ctx, x, y, s, level, t, { ghost = 1, warm = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const body = () => { ctx.beginPath(); ctx.moveTo(-120, -300); ctx.lineTo(120, -300); ctx.lineTo(150, 0); ctx.quadraticCurveTo(150, 20, 130, 20); ctx.lineTo(-130, 20); ctx.quadraticCurveTo(-150, 20, -150, 0); ctx.closePath(); };
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(10, 26, 190, 20, 0, 0, 7); ctx.fill();
  // what was possible: a ghost of the full jug
  ctx.save(); body(); ctx.clip();
  ctx.fillStyle = rgba(C.cyan, .07 * ghost); ctx.fillRect(-160, -290, 320, 320);
  ctx.setLineDash([12, 10]); ctx.strokeStyle = rgba(C.cyanWhite, .35 * ghost); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-160, -270); ctx.lineTo(160, -270); ctx.stroke(); ctx.setLineDash([]);
  // the water actually there
  const ly = 20 - level * 300, wv = Math.sin(t * 3) * 3;
  const g = ctx.createLinearGradient(0, ly, 0, 20); g.addColorStop(0, rgba('#7fe3ff', .85)); g.addColorStop(1, rgba('#2a8ab0', .9));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-160, ly + wv); ctx.quadraticCurveTo(0, ly - wv, 160, ly + wv); ctx.lineTo(160, 30); ctx.lineTo(-160, 30); ctx.fill();
  ctx.restore();
  // glass
  body(); ctx.strokeStyle = rgba(C.cyanWhite, .55); ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = 'rgba(216,247,255,.08)'; ctx.fillRect(-100, -280, 26, 280);
  // handle + spout
  ctx.strokeStyle = rgba(C.cyanWhite, .55); ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(126, -250); ctx.bezierCurveTo(230, -250, 230, -80, 140, -70); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-120, -300); ctx.lineTo(-150, -330); ctx.stroke();
  ctx.restore();
}
const JUG = { x: 960, y: 860, s: 1.3 };
const fractionJug = (T) => {
  const t0 = T.S('08a', 'Nothing collapsed'), tF = T.S('08a', 'small fraction'), tW = T.S('08a', 'She waits');
  return (ctx, t, s) => {
    const M = mood(0), pan = eio(lin(tW - 1.6, tW + .3, t)), u = lin(s.a, s.b, t);
    // at the end the camera pulls back and slides so the jug lands where it stands beside her hands
    ctx.save(); cam(ctx, mix(960, -462, pan), mix(560, 371, pan), mix(1.0, .45, pan) * mix(1, 1.04, u * (1 - pan)));
    const g = ctx.createLinearGradient(0, -1500, 0, H); g.addColorStop(0, M.wallTop); g.addColorStop(1, M.wallBot); ctx.fillStyle = g; ctx.fillRect(-3000, -2000, W + 6000, H + 4000);
    ctx.fillStyle = '#141838'; ctx.fillRect(-3000, 880, W + 6000, 1600); ctx.fillStyle = '#1d2250'; ctx.fillRect(-3000, 870, W + 6000, 14);
    // cool light from the left window
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lb = ctx.createRadialGradient(700, 500, 0, 700, 500, 900); lb.addColorStop(0, rgba('#9fb6d8', .14)); lb.addColorStop(1, rgba('#9fb6d8', 0)); ctx.fillStyle = lb; ctx.fillRect(-600, -300, W + 1200, H + 600); ctx.restore();
    // tap above, the pour starts strong and stops short
    const pour = lin(t0 + .1, tF + .1, t), level = .1 * eout(pour), flow = pour > 0 && pour < 1;
    ctx.fillStyle = '#3a4080'; ctx.fillRect(-3000, 60, 3850, 34); ctx.beginPath(); ctx.roundRect(820, 60, 60, 70, 12); ctx.fill(); ctx.fillStyle = '#5a62a8'; ctx.fillRect(-3000, 60, 3850, 6); ctx.fillStyle = '#c9cfe8'; ctx.fillRect(700, 30, 60, 14); ctx.fillRect(724, 30, 12, 34);
    if (flow) { ctx.fillStyle = rgba('#a8e6ff', .75); ctx.fillRect(850 - 8, 130, 16, 860 - 130 - level * 390); addGlow(ctx, 860, 600, 80, .2, C.cyan, C.cyanWhite); }
    else if (pour >= 1) { const dy = ((t - tF) * 400) % 500; ctx.fillStyle = rgba('#a8e6ff', .7 * (1 - dy / 500)); ctx.beginPath(); ctx.ellipse(850, 140 + dy, 5, 9, 0, 0, 7); ctx.fill(); }
    jug(ctx, JUG.x, JUG.y, JUG.s, level, t, { ghost: sm(lin(tF - .3, tF + .5, t)) });
    // price tag hangs beside the jug (continuity with the map), "what was possible" marks the ghost line
    priceTag(ctx, t, TAG.x, TAG.y, { sw: .5, a: 1 - pan });
    const la = sm(lin(tF, tF + .6, t)) * (1 - pan);
    text(ctx, 'WHAT WAS POSSIBLE', JUG.x - 200, JUG.y - 372, { size: 17, weight: 600, color: C.cyanWhite, alpha: la * .8, spacing: 5 });
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 81 · "She waits." Folded hands, the clock ticks, light dims a touch ----------
function hand(ctx, x, y, ang, skin, t, { thumb = 0, s = 1 } = {}) {
  // wrist at (x, y), hand pointing along ang; palm down
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const d = shade(skin, -.14), hl = shade(skin, .08);
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.roundRect(4, -56, 260, 130, 50); ctx.fill();
  for (let i = 0; i < 4; i++) {
    const fy = -44 + i * 30, len = 118 - Math.abs(i - 1.3) * 16;
    ctx.fillStyle = i % 2 ? skin : shade(skin, -.04); ctx.beginPath(); ctx.roundRect(120, fy - 15, len, 30, 15); ctx.fill();
    ctx.strokeStyle = d; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120 + len * .52, fy - 9); ctx.quadraticCurveTo(120 + len * .56, fy, 120 + len * .52, fy + 9); ctx.stroke();
    ctx.fillStyle = rgba('#ffe8dc', .35); ctx.beginPath(); ctx.ellipse(120 + len - 14, fy - 3, 9, 6, 0, 0, 7); ctx.fill();
  }
  ctx.fillStyle = skin; ctx.beginPath(); ctx.roundRect(-10, -62, 150, 126, 44); ctx.fill();
  ctx.fillStyle = hl; ctx.beginPath(); ctx.ellipse(70, -20, 60, 22, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = d; ctx.lineWidth = 2.4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(126, -44 + i * 30, 10, -1.2, 1.2); ctx.stroke(); }
  ctx.strokeStyle = rgba('#6a7ab0', .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 10); ctx.bezierCurveTo(40, -10, 80, 20, 118, -14); ctx.stroke();
  // thumb along the top edge, rubbing slowly
  ctx.save(); ctx.translate(40, -54); ctx.rotate(-.25 + thumb * .12); ctx.fillStyle = shade(skin, -.03); ctx.beginPath(); ctx.roundRect(0, -18, 120, 36, 18); ctx.fill(); ctx.fillStyle = rgba('#ffe8dc', .35); ctx.beginPath(); ctx.ellipse(100, -6, 10, 7, 0, 0, 7); ctx.fill(); ctx.restore();
  ctx.restore();
}
function sleeve(ctx, x, y, ang, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(1400, -170); ctx.lineTo(1400, 170); ctx.lineTo(0, 78); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(col, .07); ctx.beginPath(); ctx.roundRect(-14, -84, 80, 168, 26); ctx.fill();
  ctx.strokeStyle = shade(col, -.12); ctx.lineWidth = 3; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-6 + i * 9, -78); ctx.lineTo(-6 + i * 9, 78); ctx.stroke(); }
  ctx.strokeStyle = shade(col, -.08); ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(120 + i * 90, -80 - i * 6); ctx.quadraticCurveTo(150 + i * 90, 0, 120 + i * 90, 80 + i * 6); ctx.stroke(); }
  ctx.restore();
}
function hands(ctx, x, y, s, t, { warm = 0 } = {}) {
  const skin = mixHex('#b08a76', '#d9a687', warm), sl = mixHex('#5d5577', '#a0727a', warm);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // right forearm from lower right, hand points up-left (underneath)
  sleeve(ctx, 170, 70, .5, shade(sl, -.05));
  hand(ctx, 170, 70, Math.PI + .5, shade(skin, -.06), t, {});
  // left forearm from lower left, hand lies on top pointing up-right
  sleeve(ctx, -170, 90, Math.PI - .42, sl);
  hand(ctx, -170, 90, -.42, skin, t, { thumb: Math.sin(t * 1.1) });
  ctx.restore();
}
const foldedHands = (T, warm = 0) => {
  const tW = T.S('08a', 'She waits');
  return (ctx, t, s) => {
    const dim = warm ? 0 : lin(tW, s.b, t) * .25, u = lin(s.a, s.b, t), M = mood(warm);
    ctx.save(); cam(ctx, 960, 560, mix(1.02, 1.07, sine(u)));
    // lap (skirt) and background wall
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, M.wallTop); g.addColorStop(1, M.wallBot); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
    // clock, out of focus behind
    ctx.save(); ctx.filter = 'blur(5px)'; wallClock(ctx, 1520, 230, 120, t, { face: mixHex('#c9c7c2', '#f4e8d2', warm) }); ctx.restore();
    ctx.fillStyle = mixHex('#1b1e44', '#4a2c3c', warm); ctx.beginPath(); ctx.ellipse(900, 1000, 820, 380, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba('#000000', .15); ctx.lineWidth = 4; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(500 + i * 180, 720); ctx.quadraticCurveTo(540 + i * 190, 900, 520 + i * 200, 1100); ctx.stroke(); }
    // side table with the jug (from the shot before)
    ctx.fillStyle = mixHex('#141838', '#3a2638', warm); ctx.fillRect(1450, 760, 300, 30); ctx.fillRect(1480, 790, 20, 300); ctx.fillRect(1700, 790, 20, 300);
    jug(ctx, 1600, 760, .55, warm ? .85 : .1, t, { ghost: warm ? 0 : 1, warm });
    hands(ctx, 900, 620 + Math.sin(t * 1.2) * 3, 1.25, t, { warm });
    if (warm) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lb = ctx.createLinearGradient(1600, 0, 400, H); lb.addColorStop(0, rgba(P.amber, .25)); lb.addColorStop(1, rgba(P.amber, 0)); ctx.fillStyle = lb; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    ctx.restore();
    if (dim > 0) { ctx.fillStyle = `rgba(7,9,24,${dim})`; ctx.fillRect(0, 0, W, H); }
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- 83 · "The drop she takes was a lead in 2026." The petri dish glows briefly in the window ----------
const DISH = { x: 960, y: 500 };
function petri(ctx, x, y, r, t, { grow = 1, a = 1, glowA = 1 } = {}) {
  ctx.save(); ctx.globalAlpha = a;
  addGlow(ctx, x, y, r * 2.2, .35 * glowA, '#5fd38a', '#e8fff0');
  ctx.fillStyle = rgba('#d8f7ff', .16); ctx.beginPath(); ctx.ellipse(x, y, r, r * .42, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba('#d8f7ff', .7); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, r, r * .42, 0, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y + r * .08, r, r * .42, 0, 0, Math.PI); ctx.stroke();
  const rr = prng(31);
  for (let i = 0; i < 18; i++) {
    const ang = rr() * Math.PI * 2, d = Math.sqrt(rr()) * r * .8, px = x + Math.cos(ang) * d, py = y + Math.sin(ang) * d * .38, hh = (24 + rr() * 30) * eout(clamp(grow * 1.4 - i / 30)) * (r / 180);
    if (hh <= 0) continue;
    const sw = Math.sin(t * 1.5 + i) * 4;
    ctx.strokeStyle = '#5fd38a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + sw, py - hh * .6, px + sw * 1.5, py - hh); ctx.stroke();
    ctx.fillStyle = '#8ff0b0'; ctx.beginPath(); ctx.ellipse(px + sw * 1.5 - 7, py - hh, 8, 4, -.5, 0, 7); ctx.ellipse(px + sw * 1.5 + 7, py - hh, 8, 4, .5, 0, 7); ctx.fill();
  }
  ctx.restore();
}
const dishWindow = (T) => {
  const tL = T.S('08a', 'a lead in'), tY = T.S('08a', 'twenty twenty-six');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); cam(ctx, 960, 520, mix(1.0, 1.12, u));
    ctx.fillStyle = mood(1).wallTop; ctx.fillRect(-100, -100, W + 200, H + 200);
    const wx = 260, wy = 80, ww = 1400, wh = 820;
    windowView(ctx, t, wx, wy, ww, wh, 1, { city: 0, seed: 5 });
    // a soft vignette circle in the sky, a memory
    const a = sm(lin(s.a + .2, tL, t));
    const vg = ctx.createRadialGradient(DISH.x, DISH.y, 0, DISH.x, DISH.y, 420); vg.addColorStop(0, rgba('#0e1436', .75 * a)); vg.addColorStop(.6, rgba('#0e1436', .5 * a)); vg.addColorStop(1, rgba('#0e1436', 0));
    ctx.fillStyle = vg; ctx.fillRect(wx, wy, ww, wh);
    petri(ctx, DISH.x, DISH.y, 230, t, { grow: lin(s.a + .3, tY + .8, t), a });
    text(ctx, '2026', DISH.x, DISH.y + 230, { size: 64, font: 'Instrument Serif', align: 'center', alpha: sm(lin(tY - .2, tY + .4, t)) });
    windowFrame(ctx, wx, wy, ww, wh, 1, { cross: false });
    ctx.restore();
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 84 · "Robot labs tested thousands of versions in a few months." Arms set drops into hundreds of dishes ----------
const robotLab = (T) => {
  const t0 = T.S('08a', 'Robot labs'), tTh = T.S('08a', 'thousands');
  return (ctx, t, s) => {
    const u = lin(s.a, s.b, t);
    ctx.save(); cam(ctx, 960, mix(560, 520, sine(u)), mix(1.08, 1.0, sine(u)));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a1d48'); g.addColorStop(1, '#3a2c50'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
    // table in perspective
    ctx.fillStyle = '#20265e'; ctx.beginPath(); ctx.moveTo(560, 380); ctx.lineTo(1360, 380); ctx.lineTo(2100, 1100); ctx.lineTo(-180, 1100); ctx.fill();
    const rows = 12, cols = 18;
    for (let r = 0; r < rows; r++) {
      const v = r / (rows - 1), y = mix(410, 1020, v * v * .5 + v * .5), sc = mix(.35, 1.25, v), span = mix(760, 2100, v);
      const lit = sm(lin(t0 + .2 + (rows - 1 - r) * .22, t0 + .6 + (rows - 1 - r) * .22, t)), flick = .7 + .3 * Math.sin(t * 9 + r);
      for (let c = 0; c < cols; c++) {
        const x = 960 - span / 2 + (c + .5) * span / cols;
        if (r === rows - 1 && c === 8) { petri(ctx, x, y, 34 * sc, t, { grow: 1, glowA: .6 }); continue; }
        ctx.strokeStyle = rgba('#d8f7ff', .35 + .3 * lit); ctx.lineWidth = 1.5 * sc; ctx.beginPath(); ctx.ellipse(x, y, 30 * sc, 12 * sc, 0, 0, 7); ctx.stroke();
        if (lit > 0) { ctx.fillStyle = rgba((r + c) % 5 ? C.cyan : '#5fd38a', .55 * lit * flick); ctx.beginPath(); ctx.ellipse(x, y, 26 * sc, 10 * sc, 0, 0, 7); ctx.fill(); }
      }
    }
    // robot arms over the table, dipping in a rhythm
    for (let i = 0; i < 5; i++) {
      const bx = 520 + i * 300, ph = t * 2.2 + i * 1.3, dip = Math.pow(Math.max(0, Math.sin(ph)), 3), sx = bx + Math.sin(ph * .5) * 90;
      ctx.strokeStyle = '#c9cfe8'; ctx.lineCap = 'round'; ctx.lineWidth = 22;
      ctx.beginPath(); ctx.moveTo(bx, -40); ctx.lineTo(bx + 30, 160); ctx.lineTo(sx, 300 + dip * 140); ctx.stroke();
      ctx.fillStyle = '#e9edf8'; ctx.beginPath(); ctx.arc(bx + 30, 160, 20, 0, 7); ctx.fill();
      ctx.fillStyle = '#8a92b8'; ctx.fillRect(sx - 10, 300 + dip * 140, 20, 40);
      if (dip > .8) { ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.arc(sx, 360 + dip * 140 + (dip - .8) * 200, 6, 0, 7); ctx.fill(); addGlow(ctx, sx, 360 + dip * 140, 40, .4, C.cyan, C.cyanWhite); }
    }
    ctx.restore();
    // counter: versions tested
    const n = Math.floor(mix(0, 4820, ein(lin(t0, s.b, t))));
    const a = sm(lin(tTh - .3, tTh + .3, t));
    text(ctx, n.toLocaleString('en-US'), 130, 170, { size: 84, font: 'Instrument Serif', alpha: a });
    text(ctx, 'VERSIONS TESTED', 136, 210, { size: 18, weight: 600, color: C.muted, alpha: a, spacing: 6 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 85 · "A trial that once took a decade took a few careful years, with real patients and every safety check." ----------
const DOORS = [560, 960, 1360];
export const CHECK3 = { x: 1360, y: 300 };
const phaseDoors = (T) => {
  const t0 = T.S('08a', 'A trial'), tDec = T.S('08a', 'decade'), tFew = T.S('08a', 'a few careful'), tReal = T.S('08a', 'real patients'), tSafe = T.S('08a', 'safety check');
  return (ctx, t, s) => {
    const u = lin(s.a, s.b, t);
    ctx.save(); cam(ctx, 960, 560, mix(1.0, 1.05, sine(u)));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a2448'); g.addColorStop(1, '#6a4650'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
    ctx.fillStyle = '#3a2838'; ctx.fillRect(-200, 820, W + 400, 400);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lb = ctx.createLinearGradient(0, 200, 0, 1080); lb.addColorStop(0, rgba(P.amber, .0)); lb.addColorStop(1, rgba(P.amber, .12)); ctx.fillStyle = lb; ctx.fillRect(-200, 0, W + 400, H); ctx.restore();
    // three doors side by side, each open and lit
    DOORS.forEach((x, i) => {
      ctx.fillStyle = '#fff1d6'; ctx.fillRect(x - 90, 480, 180, 340); addGlow(ctx, x, 650, 260, .3, P.amber, '#fff6e0');
      ctx.strokeStyle = '#1e1a36'; ctx.lineWidth = 14; ctx.strokeRect(x - 97, 473, 194, 354);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const bg = ctx.createLinearGradient(0, 820, 0, 1080); bg.addColorStop(0, rgba('#ffd29a', .3)); bg.addColorStop(1, rgba('#ffd29a', 0)); ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - 90, 820); ctx.lineTo(x + 90, 820); ctx.lineTo(x + 170, 1080); ctx.lineTo(x - 170, 1080); ctx.fill(); ctx.restore();
      text(ctx, `PHASE ${['I', 'II', 'III'][i]}`, x, 450, { size: 20, weight: 600, color: C.cream, align: 'center', spacing: 5, alpha: .8 });
      // check pops in
      const tc = [tFew, tReal, tSafe][i], k = clamp((t - tc) / .45);
      if (k > 0) {
        const sc = back(k), cy = 330;
        ctx.save(); ctx.translate(x, cy); ctx.scale(sc, sc);
        ctx.fillStyle = '#2f9e5f'; ctx.beginPath(); ctx.arc(0, 0, 42, 0, 7); ctx.fill();
        ctx.strokeStyle = '#eafff2'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-18, 2); ctx.lineTo(-5, 16); ctx.lineTo(20, -14); ctx.stroke();
        ctx.restore(); addGlow(ctx, x, cy, 90 * sc, .3, '#5fd38a', '#eafff2');
      }
      // people walk calmly through, in a small steady line
      for (let k2 = 0; k2 < 3; k2++) {
        const ph = ((t * .16 + k2 / 3 + i * .21) % 1), px = x + mix(-260 + i * 40, 0, ph), py = mix(1000, 820, ph), hh = mix(210, 120, ph), a = sm(lin(0, .15, ph)) * (1 - sm(lin(.85, 1, ph)));
        ctx.save(); ctx.globalAlpha = a; person(ctx, px, py, hh, t, { phase: t * 4.2 + k2 + i, coat: ['#4a5a8a', '#7a5a6a', '#5a7a7a'][(k2 + i) % 3], hood: false, hair: ['#2a2030', '#c9c4cf', '#4a3020'][(k2 + i) % 3] }); ctx.restore();
      }
    });
    ctx.restore();
    // the timeline: a decade-long bar shrinks to a few years
    const shrink = eio(lin(tFew - .3, tFew + .9, t)), a = sm(lin(t0, t0 + .5, t)), w = mix(1200, 420, shrink), x0 = 960 - w / 2;
    ctx.fillStyle = rgba(C.cream, .15 * a); ctx.fillRect(360, 160, 1200, 6);
    const segs = Math.round(mix(10, 4, shrink));
    for (let i = 0; i < segs; i++) { ctx.fillStyle = rgba(i % 2 ? '#ffd29a' : '#ffb35c', .85 * a); ctx.fillRect(x0 + i * w / segs + 2, 156, w / segs - 4, 14); }
    text(ctx, shrink < .5 ? '10 YEARS' : 'A FEW YEARS', 960, 136, { size: 20, weight: 600, color: C.cream, align: 'center', alpha: a * Math.abs(shrink - .5) * 2, spacing: 6 });
    if (shrink > 0 && shrink < 1) { ctx.strokeStyle = rgba('#d0473a', .7 * a); ctx.lineWidth = 3; }
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 86 · "It costs about what an eye drop costs." A small bottle on the counter, a coin rolls in and settles ----------
const eyeDrop = (T) => {
  const t0 = T.S('08a', 'It costs'), tD = T.S('08a', 'eye drop costs');
  return (ctx, t, s) => {
    const u = lin(s.a, s.b, t);
    ctx.save(); cam(ctx, 1000, 620, mix(1.8, 1.95, sine(u)));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2c48'); g.addColorStop(1, '#7a4f52'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
    ctx.fillStyle = '#5a3a3a'; ctx.fillRect(-200, 700, W + 400, 40); ctx.fillStyle = '#3a2430'; ctx.fillRect(-200, 740, W + 400, 500);
    ctx.fillStyle = 'rgba(255,220,180,.12)'; ctx.fillRect(-200, 700, W + 400, 6);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lb = ctx.createRadialGradient(1300, 200, 0, 1300, 200, 1200); lb.addColorStop(0, rgba(P.amber, .3)); lb.addColorStop(1, rgba(P.amber, 0)); ctx.fillStyle = lb; ctx.fillRect(-200, -200, W + 400, H + 400); ctx.restore();
    // the eye-drop bottle
    const bx = 860, by = 720;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(bx + 20, by, 70, 12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#e9f4f8'; ctx.beginPath(); ctx.roundRect(bx - 46, by - 150, 92, 150, 16); ctx.fill();
    ctx.fillStyle = '#d0e6ee'; ctx.fillRect(bx + 14, by - 140, 20, 130);
    ctx.fillStyle = '#e9f4f8'; ctx.beginPath(); ctx.moveTo(bx - 26, by - 150); ctx.lineTo(bx - 10, by - 220); ctx.lineTo(bx + 10, by - 220); ctx.lineTo(bx + 26, by - 150); ctx.fill();
    ctx.fillStyle = '#2f7ea0'; ctx.fillRect(bx - 46, by - 110, 92, 50);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - 22, by - 85); ctx.quadraticCurveTo(bx, by - 100, bx + 22, by - 85); ctx.quadraticCurveTo(bx, by - 70, bx - 22, by - 85); ctx.stroke();
    // drop forming at the tip
    const dr = (t * .5) % 1; ctx.fillStyle = rgba('#a8e6ff', .9); ctx.beginPath(); ctx.ellipse(bx, by - 222 - dr * 2, 4 + dr * 3, 5 + dr * 4, 0, 0, 7); ctx.fill();
    addGlow(ctx, bx, by - 80, 160, .15, C.cyan, C.cyanWhite);
    // the coin rolls in from the right, wobbles and lies down
    const k = eout(lin(t0 + .2, tD + .2, t)), cx = mix(1500, 1040, k), roll = (1700 - cx) / 34, settle = lin(tD + .1, tD + .9, t);
    const wob = settle > 0 ? Math.cos(settle * 12) * (1 - settle) : 1, ry = mix(36, 12, ein(settle));
    ctx.save(); ctx.translate(cx, by - mix(36, 12, ein(settle)));
    ctx.fillStyle = '#b8862e'; ctx.beginPath(); ctx.ellipse(0, 4, 36 * (settle > 0 ? 1 : Math.abs(Math.cos(roll * .05)) * .2 + .2), ry, settle > 0 ? wob * .3 : 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#e8b85a'; ctx.beginPath(); ctx.ellipse(settle > 0 ? 0 : -4, 0, 36 * (settle > 0 ? 1 : .25), ry, settle > 0 ? wob * .3 : 0, 0, 7); ctx.fill();
    ctx.restore();
    addGlow(ctx, cx, by - 20, 80, .3 * sm(settle), P.amber, '#fff3dd');
    ctx.restore();
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 87 · "She reads the small print on the wall, out loud, just because she can." ----------
function motherProfile(ctx, x, y, s, t, { lift = 0, talk = 0, smile = 0, warm = 1 } = {}) {
  const skin = mixHex('#b88e74', '#e0ad8a', warm), hair = '#d8d4de', card = mixHex('#5d5577', '#b07a7e', warm);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // shoulders + cardigan
  ctx.fillStyle = card; ctx.beginPath(); ctx.moveTo(-160, 420); ctx.bezierCurveTo(-150, 250, -60, 200, 10, 200); ctx.bezierCurveTo(140, 200, 230, 260, 260, 420); ctx.fill();
  ctx.fillStyle = shade(card, -.1); ctx.beginPath(); ctx.moveTo(-60, 230); ctx.lineTo(-20, 420); ctx.lineTo(-90, 420); ctx.fill();
  ctx.save(); ctx.rotate(-lift * .16); // head lifts up
  // neck
  ctx.fillStyle = shade(skin, -.06); ctx.beginPath(); ctx.moveTo(-42, 110); ctx.lineTo(-46, 230); ctx.lineTo(40, 230); ctx.lineTo(42, 100); ctx.fill();
  // face profile (looking left)
  const mo = talk * (.5 + .5 * Math.sin(t * 15)) * 7;
  ctx.fillStyle = skin; ctx.beginPath();
  ctx.moveTo(30, -100); ctx.bezierCurveTo(-40, -112, -82, -70, -86, -30);
  ctx.quadraticCurveTo(-90, -14, -96, -6); ctx.quadraticCurveTo(-112, 20, -118, 30); ctx.quadraticCurveTo(-110, 38, -96, 40);
  ctx.quadraticCurveTo(-102, 48, -100, 52); ctx.lineTo(-94, 56 + mo * .3); ctx.quadraticCurveTo(-102, 62 + mo, -98, 68 + mo);
  ctx.quadraticCurveTo(-94, 82 + mo, -86, 92 + mo * .6); ctx.quadraticCurveTo(-60, 112, -30, 118); ctx.lineTo(60, 110); ctx.bezierCurveTo(100, 40, 100, -60, 30, -100); ctx.fill();
  // cheek light, wrinkles
  ctx.fillStyle = rgba('#ffd2b0', .25 * warm); ctx.beginPath(); ctx.ellipse(-50, 20, 30, 22, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = shade(skin, -.25); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-66, -14); ctx.quadraticCurveTo(-56, -4 - smile * 4, -46, -14); ctx.stroke(); // eye (crinkles when smiling)
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-40, -16 + i * 7); ctx.lineTo(-30, -20 + i * 9); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-90, 46); ctx.quadraticCurveTo(-84, 54 - smile * 8, -76, 50 - smile * 6); ctx.stroke(); // smile line
  // ear
  ctx.fillStyle = shade(skin, -.08); ctx.beginPath(); ctx.ellipse(18, 4, 14, 24, .1, 0, 7); ctx.fill();
  // hair: grey, short waves + bun
  ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-60, -76); ctx.bezierCurveTo(-40, -130, 60, -130, 92, -40); ctx.bezierCurveTo(100, 20, 80, 70, 56, 92); ctx.quadraticCurveTo(40, 40, 30, 10); ctx.quadraticCurveTo(20, -30, -20, -60); ctx.quadraticCurveTo(-40, -66, -60, -76); ctx.fill();
  ctx.beginPath(); ctx.arc(96, -54, 38, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(120,110,140,.45)'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(30, -10, 70 + i * 9, Math.PI * 1.15, Math.PI * 1.75); ctx.stroke(); }
  ctx.restore();
  ctx.restore();
}
export const CHART87 = { x: 300, y: 170, w: 420, h: 660 };
const readsChart = (T) => {
  const t0 = T.S('08a', 'She reads'), tSm = T.S('08a', 'small print'), tLoud = T.S('08a', 'out loud'), tCan = T.S('08a', 'because she can');
  return (ctx, t, s) => {
    const u = lin(s.a, s.b, t);
    ctx.save(); cam(ctx, mix(1000, 920, sine(u)), 540, mix(1.0, 1.06, sine(u)));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#4a3448'); g.addColorStop(1, '#8a5a56'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lb = ctx.createLinearGradient(1800, 0, 300, 900); lb.addColorStop(0, rgba(P.amber, .35)); lb.addColorStop(1, rgba(P.amber, 0)); ctx.fillStyle = lb; ctx.fillRect(-200, -200, W + 400, H + 400); ctx.restore();
    // the chart sharpens row by row, the row she reads glows
    const rowT = (i) => mix(tSm - .3, tCan + .2, i / (CHART.length - 1));
    const C87 = CHART87;
    eyeChart(ctx, C87.x, C87.y, C87.w, C87.h, { paper: '#f4ead6', sharp: (i) => i < 3 ? 1 : sm(lin(rowT(i) - .3, rowT(i) + .2, t)), lit: (i) => Math.max(0, 1 - Math.abs(t - rowT(i)) / .45) });
    // the mother in profile, lifting her head, lips moving, then a smile
    const lift = eout(lin(t0, t0 + 1, t)), talk = lin(tSm - .2, tSm, t) * (1 - lin(tCan + .6, tCan + 1.0, t)), smile = sm(lin(tCan, tCan + 1, t));
    motherProfile(ctx, 1320, 520, 1.6, t, { lift, talk, smile });
    ctx.restore();
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- C6 · Clip K8 (Hassabis: "golden era of discovery … renaissance"): chart letters become constellations around the screen ----------
const STARS = (() => { const r = prng(88), L = CHART.join('').split(''); return L.map((ch, i) => ({ ch, ang: r() * Math.PI * 2, rad: 600 + r() * 380, dr: r(), sp: (r() - .5) * .05 })); })();
const clipK8 = (T) => {
  const c = T.clip('K8');
  return (ctx, t, s) => {
    const k = eio(lin(s.a, s.b - .4, t)), z = mix(.82, 1, k), sw = 1120, sh = 630;
    ctx.save(); cam(ctx, 960, 540, z);
    const g = ctx.createRadialGradient(960, 540, 100, 960, 540, 1300); g.addColorStop(0, '#5a3e52'); g.addColorStop(1, '#1a1636'); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800);
    // constellations: letters drift out of the chart into star figures around the screen
    const form = eout(lin(s.a, s.a + 2.4, t));
    const pts = STARS.map((st, i) => {
      const a = st.ang + t * st.sp, sx = 960 + Math.cos(a) * st.rad, sy = 540 + Math.sin(a) * st.rad * .62;
      const ox = 520 + (i % 8) * 40 - 960, oy = 300 + Math.floor(i / 8) * 60 - 540;
      return [mix(960 + ox * 1.6, sx, form), mix(540 + oy * 1.6, sy, form), st];
    });
    ctx.strokeStyle = rgba('#ffd29a', .32 * form); ctx.lineWidth = 2;
    for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; if (Math.hypot(x1 - x2, y1 - y2) < 380) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); } }
    pts.forEach(([x, y, st], i) => {
      const tw = .6 + .4 * Math.sin(t * 2 + i);
      text(ctx, st.ch, x, y + 12, { size: mix(44, 34, form), weight: 600, color: mixHex('#2a2a3a', '#ffe6c0', form), align: 'center', alpha: tw });
      addGlow(ctx, x, y, 30, .3 * form * tw, P.amber, '#fff3dd');
    });
    // morning light sweeping across
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lb = ctx.createLinearGradient(0, 0, W, H); lb.addColorStop(0, rgba(P.amber, .18)); lb.addColorStop(.6, rgba(P.amber, 0)); ctx.fillStyle = lb; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore();
    // the screen (warm bezel), centred
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.roundRect(960 - sw / 2 + 14, 540 - sh / 2 + 20, sw, sh, 14); ctx.fill();
    ctx.fillStyle = '#1a1424'; ctx.beginPath(); ctx.roundRect(960 - sw / 2 - 16, 540 - sh / 2 - 16, sw + 32, sh + 32, 18); ctx.fill();
    clipScreen(ctx, t, T, 'K8', 960 - sw / 2, 540 - sh / 2, sw, sh, { radius: 8 });
    clipQuote(ctx, t, T, 'K8', 960 - sw / 2 + 60, 540 + sh / 2 - 50, sw - 120, 34);
    ctx.restore();
    clipLabel(ctx, t, T, 'K8', 110, 870);
    finish(ctx, t, { vig: .45 });
  };
};

export default function (T) {
  const S = (p) => T.S('08a', p), K8 = T.clip('K8');
  return [
    { t: T.seg('08a').start - .4, draw: clinicSign(T), tr: 'zoom', d: 1.0, x: W / 2, y: H / 2, depth: 5 },
    { t: S('Your mother') - .2, draw: waitingRoom(T, 0, 1), tr: 'zoom', d: 1.0, x: 960, y: 700, depth: 4 },
    { t: S('In the first future') - .2, draw: leadsWindow(T), tr: 'left', d: 1.1 },
    { t: S("They're sitting") - .15, draw: queueDesk(T), tr: 'right', d: .9 },
    { t: S('Trials run') - .15, draw: calendarWheel(T), tr: 'up', d: .9 },
    { t: S('The few treatments') - .1, draw: worldMap(T), tr: 'zoom', d: 1.0, x: 960, y: 560, depth: 3 },
    { t: S('Nothing collapsed') - .15, draw: fractionJug(T), tr: 'match', d: .7 },
    { t: S('She waits') - .2, draw: foldedHands(T, 0), tr: 'match', d: .8 },
    { t: S('In the second future') - .5, draw: waitingRoom(T, 1, 2), tr: 'page', d: 1.4 },
    { t: S('The drop she takes') - .15, draw: dishWindow(T), tr: 'zoom', d: 1.0, x: 1370, y: 405, depth: 3 },
    { t: S('Robot labs') - .15, draw: robotLab(T), tr: 'match', d: .7 },
    { t: S('A trial that once') - .1, draw: phaseDoors(T), tr: 'iris', d: .9, x: 960, y: 900 },
    { t: S('It costs') - .15, draw: eyeDrop(T), tr: 'iris', d: .8, x: CHECK3.x, y: 330 },
    { t: S('She reads') - .1, draw: readsChart(T), tr: 'left', d: 1.0 },
    { t: K8.start - .6, draw: clipK8(T), tr: 'zoom', d: 1.0, x: CHART87.x + CHART87.w / 2, y: CHART87.y + CHART87.h * .4, depth: 3 },
  ];
}
