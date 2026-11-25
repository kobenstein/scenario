// Film 76 · package B1 (builder): AGE 0 (a0a–a0o) and AGE 6 (a6a–a6m + clip C1). Draws keyed by shot id (scenes/plan.mjs, pk 'B1'); see
// docs/BRIEF-builders.md. Skills: scenario-motion, world-class-motion-design, fluid-motion-design, motion-director-gates, dataviz. Quality
// reference: scenes/ch_hook.mjs. Every shot grows from S.in (the plane's landing point) or continues the shot before ('match'); its last
// element sits at S.out before the plane takes off. Everything is anchored on PHRASES (K.phr → G/U), never on seconds.
// Facts (text-v2 Einblendungen, faktencheck 25.11.): UNFPA 7/2026 (108,926 · 18–39 · 73 countries · online, not representative; money +
// housing top; AI lowest of all concerns, 47.8 % "somewhat or very worrying"; 79 % men / 72 % women, childless 35–39, still want children) ·
// UN IGME / WHO 3/2026 (> 10 M under-5 deaths in 2000 → 4.9 M in 2024; pace slower since 2015) · Stanford EdWorkingPaper 26-1451 6/2026
// (355 children, two districts, 39.3 % / 46.7 % never logged on) · NBER w35620 · IZA DP 19025 · Eedi/Google (no effect sizes shown).
import * as K from '../lib/f76_kit.mjs';
const { W, H, P, E, clamp, lerp, span, sineIO, expoOut, expoIn, rise, halo, rgba, mixHex, prng, drift, GOLD, CREAM, MUTED, MACH, PAPER76 } = K;
const TAU = Math.PI * 2;
const AIc = { body: MACH.heart, line: MACH.heartCore, deep: MACH.heartDeep, text: MACH.heartCore };
const CREAMc = { body: '#e9e2cc', line: '#fbf6e6', deep: '#6d6a8c', text: CREAM };
const LILAC = { body: '#a9a3cf', line: '#cfcae8', deep: '#3c3a6a', text: '#d6d2ee' };
const gAny = (G, ...ps) => { for (const p of ps) { try { return G(p); } catch { /* next */ } } return G(ps[0]); };
const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ================================================================================================================ shared helpers
function stage(ctx, t, S, bg, cam) { K.bg(ctx, t, bg); ctx.save(); K.shotCam(ctx, t, S, cam); }
// a world → screen camera (wx, wy) lands at screen (sx, sy) with zoom z (plus a slow drift); used where a shot needs an exact framing
function frame(ctx, t, c, seed = 1) { ctx.translate(c.sx + drift(t, 3, seed), c.sy + drift(t, 2, seed + 4)); ctx.scale(c.z, c.z); ctx.translate(-c.wx, -c.wy); }
const camLerp = (A, B, u) => ({ sx: lerp(A.sx, B.sx, u), sy: lerp(A.sy, B.sy, u), z: lerp(A.z, B.z, u), wx: lerp(A.wx, B.wx, u), wy: lerp(A.wy, B.wy, u) });
// a soft floor + back wall (rooms, classrooms)
function room(ctx, o = {}) {
  const fy = o.floor ?? 860, wall = o.wall ?? ['#0d1440', '#141d52'], fl = o.fl ?? ['#1a1f4e', '#0a0d2a'];
  ctx.fillStyle = K.lin(ctx, 0, -200, 0, fy, [[0, wall[0]], [1, wall[1]]]); ctx.fillRect(-300, -300, W + 600, fy + 300);
  ctx.fillStyle = K.lin(ctx, 0, fy, 0, H + 200, [[0, fl[0]], [1, fl[1]]]); ctx.fillRect(-300, fy, W + 600, H + 500 - fy);
  ctx.fillStyle = rgba('#000', .22); ctx.fillRect(-300, fy - 3, W + 600, 6);
}
// a desk seen from the front: top edge at y, x0 → x1; its front panel hides legs of whoever stands behind it
function desk(ctx, x0, x1, y, o = {}) {
  const d = o.depth ?? 160, lit = o.lit ?? 0;
  ctx.fillStyle = K.lin(ctx, 0, y - 14, 0, y + 8, [[0, mixHex('#3c3452', '#6a5a62', lit)], [1, mixHex('#261f3c', '#3a3048', lit)]]); ctx.beginPath(); ctx.roundRect(x0 - 8, y - 14, x1 - x0 + 16, 22, 4); ctx.fill();
  ctx.fillStyle = K.lin(ctx, 0, y + 8, 0, y + d, [[0, '#1e1834'], [1, '#110d24']]); ctx.fillRect(x0, y + 8, x1 - x0, d);
  ctx.fillStyle = rgba('#000', .2); ctx.fillRect(x0, y + 8, x1 - x0, 6);
}
// a gold "thinking" loop (a small infinity of light); col blends gold → cyan with m
function thinkLoop(ctx, t, x, y, s, a, m = 0) {
  if (a <= 0) return; const col = mixHex(GOLD.line, MACH.heart, m), core = mixHex(GOLD.core, MACH.heartCore, m);
  halo(ctx, x, y, s * 3, .35 * a, mixHex(GOLD.halo, MACH.heart, m), core);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, s * .16); ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i <= 48; i++) { const q = i / 48 * TAU, r = s / (1 + Math.sin(q) ** 2); const px = x + r * Math.cos(q), py = y + r * Math.sin(q) * Math.cos(q) * 1.2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.stroke(); const ph = (t * .9) % 1, q = ph * TAU, r = s / (1 + Math.sin(q) ** 2);
  ctx.fillStyle = core; ctx.beginPath(); ctx.arc(x + r * Math.cos(q), y + r * Math.sin(q) * Math.cos(q) * 1.2, s * .16, 0, TAU); ctx.fill(); ctx.restore();
}
// small flat icons (paper / gold): school bag, graduation cap, open book, leaf, planet, toy box, block, magnifier, bulb
function bag(ctx, x, y, s, a = 1, col = '#c98a4a') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = mixHex(col, '#2a1a14', .45); ctx.beginPath(); ctx.roundRect(-.32, -.62, .64, .3, .15); ctx.fill();   // handle loop
  ctx.fillStyle = K.lin(ctx, 0, -.5, 0, .5, [[0, mixHex(col, '#fff', .15)], [1, mixHex(col, '#2a1a14', .3)]]); ctx.beginPath(); ctx.roundRect(-.5, -.45, 1, .95, .18); ctx.fill();
  ctx.fillStyle = mixHex(col, '#2a1a14', .25); ctx.beginPath(); ctx.roundRect(-.38, .02, .76, .36, .1); ctx.fill();
  ctx.fillStyle = rgba('#fff3d0', .7); ctx.fillRect(-.05, -.1, .1, .1); ctx.restore();
}
function gradCap(ctx, x, y, s, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#2b2f5a'; ctx.beginPath(); ctx.roundRect(-.3, -.05, .6, .3, .06); ctx.fill();
  ctx.fillStyle = K.lin(ctx, 0, -.3, 0, .05, [[0, '#4a508a'], [1, '#262a54']]); ctx.beginPath(); ctx.moveTo(0, -.32); ctx.lineTo(.62, -.08); ctx.lineTo(0, .14); ctx.lineTo(-.62, -.08); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = GOLD.line; ctx.lineWidth = .035; ctx.beginPath(); ctx.moveTo(0, -.1); ctx.lineTo(.45, .02); ctx.lineTo(.45, .32); ctx.stroke();
  ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(.45, .36, .06, 0, TAU); ctx.fill(); ctx.restore();
}
function book(ctx, x, y, s, a = 1, col = '#e9fbff') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(0, -.3); ctx.quadraticCurveTo(-.25, -.42, -.55, -.34); ctx.lineTo(-.55, .32); ctx.quadraticCurveTo(-.25, .24, 0, .36); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -.3); ctx.quadraticCurveTo(.25, -.42, .55, -.34); ctx.lineTo(.55, .32); ctx.quadraticCurveTo(.25, .24, 0, .36); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(MACH.heartDeep, .6); for (let i = 0; i < 3; i++) { ctx.fillRect(-.45, -.18 + i * .16, .35, .045); ctx.fillRect(.1, -.18 + i * .16, .35, .045); } ctx.restore();
}
function toyBox(ctx, t, x, y, s, rot, lit) {   // a strange toy: a box with an odd knob and a dial-less slot; lit 0..1 lights its face gold
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (lit > 0) halo(ctx, 0, 0, s * 3.2, .5 * lit, GOLD.halo, GOLD.core);
  ctx.fillStyle = K.lin(ctx, -s, -s, s, s, [[0, mixHex('#6a5aa0', GOLD.hot, lit)], [1, mixHex('#2c2660', GOLD.mid, lit * .8)]]); ctx.beginPath(); ctx.roundRect(-s * .7, -s * .6, s * 1.4, s * 1.2, s * .18); ctx.fill();
  ctx.fillStyle = mixHex('#c98a4a', GOLD.core, lit); ctx.beginPath(); ctx.arc(s * .7, -s * .2, s * .22, 0, TAU); ctx.fill();            // the odd knob on its side
  ctx.fillStyle = mixHex('#1a1640', '#fff6d8', lit); ctx.beginPath(); ctx.roundRect(-s * .38, -s * .18, s * .62, s * .36, s * .08); ctx.fill();   // the window that lights
  ctx.fillStyle = mixHex('#8fb3d9', GOLD.line, lit); ctx.beginPath(); ctx.moveTo(-s * .2, -s * .6); ctx.lineTo(0, -s * .9); ctx.lineTo(s * .2, -s * .6); ctx.closePath(); ctx.fill();   // a little fin on top
  ctx.restore();
}
function bulb(ctx, t, x, y, s, on) {
  ctx.fillStyle = '#050818'; ctx.fillRect(x - 2, -60, 4, y - s * .8 + 60);
  if (on > 0) halo(ctx, x, y, s * 6, .45 * on, '#f2c46a', '#fff4cf');
  ctx.fillStyle = mixHex('#2a2a4a', '#fff2c4', on); ctx.beginPath(); ctx.arc(x, y, s * .55, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex('#3a3a5a', '#d8c08a', on * .6); ctx.fillRect(x - s * .25, y - s * .95, s * .5, s * .45);
}
function notebookOpen(ctx, x, y, w, a = 1, lines = 0) {   // flat open notebook on a table (front view, slight perspective)
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.ellipse(x, y + 14, w * .6, 12, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = PAPER76.lit; ctx.beginPath(); ctx.moveTo(x - w / 2, y + 10); ctx.lineTo(x + w / 2, y + 10); ctx.lineTo(x + w / 2 - 22, y - 26); ctx.lineTo(x - w / 2 + 22, y - 26); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(PAPER76.fold, .55); ctx.fillRect(x - 2, y - 26, 3, 36);
  ctx.fillStyle = rgba(PAPER76.ink, .35); for (let i = 0; i < Math.floor(lines); i++) ctx.fillRect(x + 14, y - 18 + i * 8, w * .32 - i * 6, 3);
  ctx.restore();
}

// ================================================================================================================ AGE CLOCK (a0a–a0d, a0k)
const STEPC = (i) => { const [x, y] = K.stepTop(i); return [x + K.STEP.w / 2, y]; };
// the road of light along the step tops, from the baby (step 0) to step 4: polyline (screen = world here)
const ROAD = (() => { const p = [[315, 900]]; for (let i = 0; i < 5; i++) { const [x, y] = K.stepTop(i); if (i) p.push([x, y + K.STEP.rise], [x, y]); } p.push([K.stepTop(4)[0] + K.STEP.w * .5, K.stepTop(4)[1]]); return p; })();
const roadAt = (i) => { let L = 0; const len = [0]; for (let k = 1; k < ROAD.length; k++) { L += Math.hypot(ROAD[k][0] - ROAD[k - 1][0], ROAD[k][1] - ROAD[k - 1][1]); len.push(L); } const tx = STEPC(i)[0]; for (let k = 1; k < ROAD.length; k++) if (ROAD[k][0] >= tx && ROAD[k][1] === ROAD[k - 1][1]) return (len[k - 1] + (tx - ROAD[k - 1][0])) / L; return 1; };
const YEARS = [2026, 2032, 2038, 2044, 2056];
function growTag(ctx, u) { K.cap(ctx, 'GROWING UP WITH AI', 122, 246, u, { size: 24, col: MUTED }); }
function babyLight(ctx, t, a) { if (a > 0) halo(ctx, 315, 850, 120 + 6 * Math.sin(t * 1.3), .38 * a, GOLD.halo, GOLD.core); }
// the mark above a step: an icon + "age · year" (a0b)
function stepMark(ctx, t, i, u, icon) {
  if (u <= 0) return; const [cx, y] = STEPC(i), e = expoOut(u), iy = y - 150 - (1 - e) * 30;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); if (icon === 'bag') bag(ctx, cx, iy, 70); else gradCap(ctx, cx, iy, 96); ctx.restore();
}

// ================================================================================================================ A0L/A0M the curve
const CX = (yr) => 420 + (yr - 2000) / 24 * 1080, CY = (v) => 780 - v * 44;
const R1 = Math.log(10.1 / 4.9) / (15 + 9 * .4), V15 = 10.1 * Math.exp(-R1 * 15);
const deaths = (yr) => (yr <= 2015 ? 10.1 * Math.exp(-R1 * (yr - 2000)) : V15 * Math.exp(-.4 * R1 * (yr - 2015)));   // endpoints UN IGME/WHO; slower since 2015 (shape only, no values shown between)
const CURVE = K.curvePts((x) => CY(deaths(2000 + (x - 420) / 1080 * 24)), 420, 1500, 96);
function chartCam(t, T) { const a = T.G('In a single generation') - .35, b = T.G('Safe, though') - .35; const u = sineIO(span(t, a, b)); return { z0: 1, z1: 1, fx: 960, fy: 540, zz: lerp(1.0, 1.06, u) }; }
function deathCurve(ctx, t, T) {
  const t0 = T.G('In a single generation'), G = (p) => T.G(p, 0, t0 - .5);
  const z = chartCam(t, T).zz; ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  const au = span(t, t0 - .55, t0 + .6), cu = sineIO(span(t, G('single generation') - .1, G('fifth birthday') + .4)), half = span(t, G('halved') - .25, G('halved') + .7);
  const slow = span(t, G('slowed') - .3, G('slowed') + .5), progU = span(t, G('That progress') - .1, G('That progress') + .7), real = span(t, G('But it') - .1, G('But it') + .7);
  // title + axis
  K.cap(ctx, 'CHILDREN WHO DIE BEFORE AGE 5', 420, 214, span(t, t0 - .2, t0 + .5), { size: 30, col: CREAM });
  K.cap(ctx, 'WORLD · PER YEAR', 420, 254, span(t, t0, t0 + .7), { size: 22, col: MUTED });
  ctx.fillStyle = rgba(CREAM, .28); ctx.fillRect(420, 780, 1080 * expoOut(au), 2);
  K.cap(ctx, '2000', 420, 822, au, { size: 24, align: 'center', col: MUTED });
  K.cap(ctx, '2024', 1500, 822, span(t, G('fifth birthday') - .2, G('fifth birthday') + .5), { size: 24, align: 'center', col: MUTED });
  // the 2000 level as a faint guide (the start); the gap between it and the curve fills gold on 'halved' (lives saved), stays lit: REAL
  const gl = Math.max(half, real);
  if (cu > 0) {
    ctx.save(); ctx.setLineDash([6, 10]); ctx.strokeStyle = rgba(CREAM, .22 * clamp(cu * 3)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(420, CY(10.1)); ctx.lineTo(420 + 1080 * cu, CY(10.1)); ctx.stroke(); ctx.restore();
    if (gl > 0) { const n = Math.round(96 * cu); ctx.save(); ctx.beginPath(); ctx.moveTo(420, CY(10.1)); for (let i = 0; i <= n; i++) ctx.lineTo(...CURVE[i]); ctx.lineTo(CURVE[n][0], CY(10.1)); ctx.closePath();
      ctx.fillStyle = K.lin(ctx, 0, CY(10.1), 0, CY(4.9), [[0, rgba(GOLD.body, .34 * gl + .08 * real * Math.sin(t * 1.4) ** 2)], [1, rgba(GOLD.deep, .05 * gl)]]); ctx.fill(); ctx.restore(); }
    // the stretch since 2015 glows cream when it is named (SLOWED)
    K.lightLine(ctx, CURVE, 0, cu, { body: GOLD.hot, line: GOLD.core, deep: GOLD.mid }, { w: 3.2, head: true });
    if (slow > 0) { const i15 = Math.round((2015 - 2000) / 24 * 96); K.lightLine(ctx, CURVE.slice(i15), 0, 1, CREAMc, { w: 5, a: .9 * slow }); }
  }
  // the 2000 point and the 2024 point
  const d0 = expoOut(span(t, t0 - .6, t0 - .1));
  halo(ctx, 420, CY(10.1), 60, .5 * d0, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(420, CY(10.1), 9 * d0, 0, TAU); ctx.fill();
  K.cap(ctx, 'MORE THAN 10 MILLION', 446, CY(10.1) - 26, span(t, t0 - .2, t0 + .6), { size: 26, col: CREAM });
  const e24 = span(t, G('fifth birthday') + .1, G('fifth birthday') + .7);
  if (e24 > 0) { ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(1500, CY(4.9), 9 * expoOut(e24), 0, TAU); ctx.fill(); }
  K.cap(ctx, '4.9 MILLION', 1500, CY(4.9) + 54, e24, { size: 26, align: 'center', col: CREAM });
  // 2015: the slowdown
  if (progU > 0) { ctx.save(); ctx.setLineDash([4, 8]); ctx.strokeStyle = rgba(CREAM, .35 * progU); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(CX(2015), 780); ctx.lineTo(CX(2015), 780 - 420 * expoOut(progU)); ctx.stroke(); ctx.restore(); K.cap(ctx, '2015', CX(2015), 822, progU, { size: 24, align: 'center', col: MUTED }); }
  if (slow > 0) K.tag(ctx, 'SLOWED SINCE 2015', (CX(2015) + 1500) / 2, CY(5.9) - 70, slow, { size: 24, col: CREAM });
  // the half line and the bracket: MORE THAN HALVED (the wow)
  if (half > 0) {
    ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = rgba(GOLD.line, .6 * half); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(420, CY(5.05)); ctx.lineTo(420 + 1100 * expoOut(half), CY(5.05)); ctx.stroke(); ctx.restore();
    K.cap(ctx, 'HALF', 440, CY(5.05) - 14, half, { size: 22, col: GOLD.text });
    const bx = 1580, k = expoOut(half); ctx.save(); ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx - 16, CY(10.1)); ctx.lineTo(bx, CY(10.1)); ctx.lineTo(bx, lerp(CY(10.1), CY(4.9), k)); if (k > .95) ctx.lineTo(bx - 16, CY(4.9)); ctx.stroke(); ctx.restore();
    K.big(ctx, 'More than', 1620, CY(7.6) - 10, 54, span(half, .1, .7), { align: 'left' });
    K.big(ctx, 'halved', 1620, CY(7.6) + 58, 76, span(half, .25, .85), { align: 'left' });
  }
  if (real > 0) K.big(ctx, 'Real.', 960, 452, 96, real, { align: 'center' });
  K.src(ctx, t, t0 - .2, T.G('Safe, though') + .4, 'UN IGME / WHO · MARCH 2026');
}

// ================================================================================================================ A0H/A0I two survey lists
function listCam(t, T) {   // a0h frames the left list, a0i glides right to the second one (one continuous move across the match)
  const a = T.G('The answer? Money') - .35, m = T.G('Plenty of them do worry') - .5;
  const u = sineIO(span(t, m, m + 1.6));
  return { sx: 960, sy: 540, z: lerp(1.12, 1.0, u), wx: lerp(560, 960, u) + drift(t, 4, 9), wy: lerp(520, 520, u) };
}
const WORRY = [['CONFLICT', 0], ['ECONOMIC UNCERTAINTY', 1], ['INEQUALITY', 2], ['ARTIFICIAL INTELLIGENCE', 3]];
function surveyLists(ctx, t, T) {
  const tA = T.G('The answer? Money'), g = (p) => T.G(p, 0, tA - 1);
  // ---- left: WHAT HOLDS THEM BACK (rank only: MONEY 1, HOUSING 2; the rest stay dim, unlabelled)
  const lx = 250, ly = 330;
  K.cap(ctx, 'WHAT HOLDS THEM BACK', lx, ly - 60, span(t, tA - .4, tA + .3), { size: 30, col: GOLD.text, glow: true });
  for (let r = 0; r < 5; r++) {
    const y = ly + r * 96, base = span(t, tA - .35 + r * .06, tA + .2 + r * .06); if (base <= 0) continue;
    ctx.fillStyle = rgba(CREAM, .1 * base); ctx.beginPath(); ctx.roundRect(lx, y, 560 * expoOut(base), 64, 8); ctx.fill();
    E.glowText(ctx, String(r + 1), lx - 34, y + 46, { size: 40, serif: true, align: 'right', col: MUTED, glow: false, a: base });
    if (r < 2) {
      const u = span(t, g(r ? 'housing' : 'Money') - .15, g(r ? 'housing' : 'Money') + .55); if (u <= 0) continue;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, lx, 0, lx + 560, 0, [[0, rgba(GOLD.body, .5 - r * .12)], [1, rgba(GOLD.body, .08)]]); ctx.beginPath(); ctx.roundRect(lx, y, 560 * expoOut(u), 64, 8); ctx.fill(); ctx.restore();
      K.serif(ctx, r ? 'Housing' : 'Money', lx + 28, y + 50, 50, u, { col: '#fff6d8' });
    } else { ctx.fillStyle = rgba(MUTED, .18 * base); ctx.fillRect(lx + 28, y + 28, (200 - r * 30) * expoOut(base), 8); }
  }
  // ---- right: WHAT WORRIES THEM (share who call it somewhat or very worrying; three over three in four, AI nearly half → it sorts last)
  const rx = 1140, ry = 330, Lfull = 560, tP = T.G('Plenty of them do worry', 0, tA), gp = (p) => T.G(p, 0, tP - .5);
  const ai = span(t, gp('artificial') - .3, gp('artificial') + .6), oth = span(t, gp('list of worries') - .6, gp('list of worries') + .5), sort = sineIO(span(t, gp('came last') - .25, gp('came last') + .9));
  K.cap(ctx, 'WHAT WORRIES THEM', rx, ry - 60, span(t, tP - .3, tP + .5), { size: 30, col: CREAM });
  K.cap(ctx, 'SAY IT IS WORRYING', rx, ry - 26, span(t, tP, tP + .7), { size: 22, col: MUTED });
  WORRY.forEach(([lab, k]) => {
    const isAI = k === 3, u = isAI ? ai : span(oth, k * .2, k * .2 + .6); if (u <= 0) return;
    const slot = isAI ? lerp(0, 3, sort) : (k + 1) - sort, y = ry + 64 + slot * 112 + (isAI ? 0 : (1 - expoOut(u)) * 30);
    const val = isAI ? .478 : .76, col = isAI ? AIc : LILAC;
    ctx.save(); ctx.globalAlpha *= clamp(u * 3);
    K.cap(ctx, lab, rx, y - 12, u, { size: 22, col: isAI ? MACH.heartCore : CREAM });
    K.bar(ctx, rx, y + 26, Lfull * val, u, col, { th: 28, glow: isAI ? 1 : .4 });
    if (!isAI) { const g2 = ctx.createLinearGradient(rx + Lfull * val, 0, rx + Lfull * val + 70, 0); g2.addColorStop(0, rgba(col.body, .45 * u)); g2.addColorStop(1, rgba(col.body, 0)); ctx.fillStyle = g2; ctx.fillRect(rx + Lfull * val - 2, y + 12, 72, 28); }   // open end: MORE THAN
    ctx.restore();
    if (isAI) K.cap(ctx, 'NEARLY HALF', rx + Lfull * val + 26, y + 34, span(t, gp('worry about') - .1, gp('worry about') + .6) , { size: 24, col: MACH.heartCore });
  });
  if (oth > 0) {   // one bracket over the three human worries: MORE THAN 3 IN 4 (it travels with them when the list sorts)
    const bu = span(oth, .5, 1), y0 = ry + 64 + 112 * (1 - sort) - 4, y1 = y0 + 2 * 112 + 40, bx = rx + Lfull * .76 + 96, k = expoOut(bu);
    ctx.save(); ctx.strokeStyle = rgba(CREAM, .7 * bu); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx - 14, y0); ctx.lineTo(bx, y0); ctx.lineTo(bx, lerp(y0, y1, k)); if (k > .95) ctx.lineTo(bx - 14, y1); ctx.stroke(); ctx.restore();
    K.cap(ctx, 'MORE THAN', bx + 22, (y0 + y1) / 2 - 6, bu, { size: 22, col: CREAM }); K.cap(ctx, '3 IN 4', bx + 22, (y0 + y1) / 2 + 26, bu, { size: 26, col: CREAM }); }
  if (sort > 0) K.big(ctx, 'Last.', rx + Lfull * .478 + 220, ry + 64 + 3 * 112 + 44, 64, span(t, gp('came last') + .2, gp('came last') + .9), { align: 'left' });
}


// ================================================================================================================ A6D–A6F the classroom (one class, then two districts)
const DARK = [[1, 3, 6, 8], [0, 2, 5, 7]];   // which tablets stay dark in each district (4 of 10 · 4 + two thirds of a fifth)
function classCam(t, T) { const a = T.G('But schools have already') - .35, b = T.G('The tutor was ready') - .35; return lerp(1.0, 1.05, sineIO(span(t, a, b))); }
// one class: 2 rows × 5 desks, drawn round (0, 0); o: { grow 0..1 (desks rise centre-out), dark(i) 0..1, part(i) 0..1 (share of screen dark), flick(i), book 0..1 }
function classRoom(ctx, t, o) {
  ctx.fillStyle = K.lin(ctx, 0, -300, 0, 300, [[0, '#0f1646'], [.42, '#141d52'], [.43, '#1a1f4e'], [1, '#0b0e2c']]); ctx.fillRect(-560, -310, 1120, 620);
  for (let i = 0; i < 3; i++) { const lx = -360 + i * 360; halo(ctx, lx, -270, 120, .12, '#f2c46a', '#fff4cf'); ctx.fillStyle = rgba('#fff2c4', .5); ctx.fillRect(lx - 50, -296, 100, 6); }
  for (const row of [0, 1]) for (let c = 0; c < 5; c++) {
    const i = row * 5 + c, s = row ? 1 : .84, x = (c - 2) * (row ? 210 : 180), y = row ? 170 : -20, dc = Math.hypot(c - 2, row - .5);
    const g = expoOut(span(o.grow ?? 1, dc * .12, dc * .12 + .5)); if (g <= 0) continue;
    const dk = clamp(o.dark ? o.dark(i) : 0), pt = clamp(o.part ? o.part(i) : 0), kh = 170 * s;
    ctx.save(); ctx.globalAlpha *= clamp(g * 3); ctx.translate(0, (1 - g) * 40);
    K.kid(ctx, x - 6 * s, y + kh * .46, kh, { age: 6, dir: dk > .5 ? -1 : 1, look: lerp(.15, -.1, dk), lean: lerp(.12, 0, dk), light: -1, a: 1 });
    desk(ctx, x - 66 * s, x + 66 * s, y, { depth: 90 * s });
    const fl = o.flick ? o.flick(i) : 0, lit = (1 - dk) * (1 - fl);
    K.tablet(ctx, t, x + 14 * s, y - 30 * s, 74 * s, 52 * s, { lit, rot: -.04, content(cc, sx, sy, sw, sh) {
      if (pt > 0) { cc.fillStyle = '#0b1236'; cc.fillRect(sx, sy, sw, sh * pt); }
      if ((o.book ?? 0) > 0 && lit > .3) book(cc, sx + sw / 2, sy + sh * (pt > 0 ? .78 : .5), sh * .55, (o.book) * lit * (pt > 0 ? .0 : 1), '#0b2b44'); } });
    ctx.restore();
  }
}
function classes(ctx, t, T, o) {
  const sp = sineIO(clamp(o.split ?? 0)), sc = lerp(1, .58, sp), cy = lerp(620, 650, sp);
  for (const p of [0, 1]) {
    if (p === 1 && sp <= 0) continue;
    const cx = p ? lerp(960, 1420, sp) : lerp(960, 500, sp);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    ctx.save(); ctx.beginPath(); ctx.roundRect(-560, -310, 1120, 620, 24); ctx.clip();
    classRoom(ctx, t, { grow: o.grow, book: o.book, flick: p ? null : o.flick, dark: (i) => (o.darkU ? o.darkU(p, i) : 0), part: (i) => (o.partU ? o.partU(p, i) : 0) });
    ctx.restore();
    if (sp > 0) { ctx.strokeStyle = rgba(CREAM, .55 * sp); ctx.lineWidth = 3 / sc; ctx.beginPath(); ctx.roundRect(-560, -310, 1120, 620, 24); ctx.stroke(); }
    ctx.restore();
    if (sp > 0) K.cap(ctx, `DISTRICT ${p + 1}`, cx, cy - 310 * sc - 22, span(sp, .5, 1), { size: 26, align: 'center', col: CREAM });
  }
}

export default {
  // ---------------------------------------------------------------- a0a THE AGE CLOCK: start the clock, a child is born, AGE 0 · 2026
  a0a(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 315, gy: 820, ga: .22, gcol: '#3a3a5a' });
    const u = sineIO(span(t, S.a, S.b + .3));
    ctx.save(); frame(ctx, t, camLerp({ sx: 300, sy: 790, z: 1.45, wx: 315, wy: 830 }, { sx: 960, sy: 560, z: 1.0, wx: 960, wy: 560 }, u), S.seed);
    const su = span(t, S.a + .2, Math.max(S.a + 1.6, G('start the clock') + 1.5)), born = span(t, G('born') - .2, G('born') + .7);
    // the light the plane opened into: the child's light (step 0 rises under it, the baby sits in it on 'born')
    const bl = expoOut(span(t, S.a, S.a + .7)) * (1 - .3 * born);
    babyLight(ctx, t, bl); halo(ctx, 315, 840, 60 + 4 * Math.sin(t * 1.7), .55 * bl * (1 - .5 * born), GOLD.body, GOLD.hot);
    K.ageClock(ctx, t, { u: su, city: span(su, .3, 1), lit: [born], figs: [{ i: 0, age: 0, x: .5, a: born, h: 82 }],
      counter: { age: 0, year: 2026, from: { age: ' ', year: '    ' }, u: span(t, G('Age zero') - .35, G('Age zero') + .9) } });
    growTag(ctx, span(t, G('Age zero') + .1, G('Age zero') + .8));
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0b school 2032, eighteen 2044: steps 2 and 4 light with their marks
  a0b(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 700, gy: 760, ga: .22, gcol: '#3a3a5a' }, { z0: 1.0, z1: 1.04, fx: 760, fy: 700 });
    const school = G('school'), eight = G('eighteen'), y32 = span(t, G('thirty-two') - .2, G('thirty-two') + .6), y44 = span(t, G('forty') - .2, G('forty') + .6);
    babyLight(ctx, t, .6);
    K.ageClock(ctx, t, { u: 1, lit: [.4, y32, 0, y44], figs: [{ i: 0, age: 0, x: .5, h: 82 }], counter: { age: 0, year: 2026, u: 1 } });
    growTag(ctx, 1);
    // the road of light from the baby along the steps: it reaches step 2 on 'school', step 4 on 'eighteen'
    const r1 = roadAt(1), r3 = roadAt(3);
    const ru = t < school ? lerp(0, r1, sineIO(span(t, S.a + .05, school))) : lerp(r1, r3, sineIO(span(t, school + .25, eight)));
    K.lightLine(ctx, ROAD, 0, ru, { body: GOLD.body, line: GOLD.line, deep: GOLD.deep }, { w: 2.6, head: true });
    stepMark(ctx, t, 1, span(t, school - .2, school + .6), 'bag');
    K.cap(ctx, '6 · 2032', STEPC(1)[0], STEPC(1)[1] - 52, y32, { size: 30, align: 'center', col: GOLD.text });
    stepMark(ctx, t, 3, span(t, eight - .2, eight + .6), 'cap');
    K.cap(ctx, '18 · 2044', STEPC(3)[0], STEPC(3)[1] - 52, y44, { size: 30, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0c somewhere on that road (scenario): the chip's line crosses ALL OF US
  a0c(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 900, gy: 500, ga: .22, gcol: '#3a3a5a' }, { z0: 1.03, z1: 1.0, fx: 960, fy: 560 });
    const some = span(t, G('Somewhere') - .2, G('Somewhere') + .9), scen = span(t, G('scenario') - .2, G('scenario') + .6), mach = sineIO(span(t, G('machines become') - .2, G('all of us') + .4));
    babyLight(ctx, t, .6);
    K.ageClock(ctx, t, { u: 1, lit: [.4, .7, 0, .7], figs: [{ i: 0, age: 0, x: .5, h: 82 }], counter: { age: 0, year: 2026, u: 1 } });
    growTag(ctx, 1);
    K.lightLine(ctx, ROAD, 0, roadAt(3), { body: GOLD.body, line: GOLD.line, deep: GOLD.deep }, { w: 2.6, a: .7 });
    stepMark(ctx, t, 1, 1, 'bag'); stepMark(ctx, t, 3, 1, 'cap');
    K.cap(ctx, '6 · 2032', STEPC(1)[0], STEPC(1)[1] - 52, 1, { size: 30, align: 'center', col: GOLD.text }); K.cap(ctx, '18 · 2044', STEPC(3)[0], STEPC(3)[1] - 52, 1, { size: 30, align: 'center', col: GOLD.text });
    // the soft band SOMEWHERE HERE between school and eighteen
    if (some > 0) { const x0 = 640, x1 = 1300; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, rgba(CREAM, 0)); g.addColorStop(.5, rgba(CREAM, .09 * some)); g.addColorStop(1, rgba(CREAM, 0)); ctx.fillStyle = g; ctx.fillRect(x0, 150, x1 - x0, 650); ctx.restore();
      K.cap(ctx, 'SOMEWHERE HERE', 970, 186, some, { size: 26, align: 'center', col: CREAM }); }
    if (scen > 0) K.tag(ctx, 'SCENARIO', 970, 128, scen, { size: 22, col: GOLD.text, dash: true });
    // human level: a dashed line ALL OF US, drawn out from the landing point (S.in)
    const hy = 420, du = expoOut(span(t, S.a, S.a + 1.2));
    ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = rgba(GOLD.line, .65); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(lerp(S.in[0], 160, du), hy); ctx.lineTo(lerp(S.in[0], 1800, du), hy); ctx.stroke(); ctx.restore();
    K.cap(ctx, 'ALL OF US', 160, hy - 18, span(t, G('all of us') - .2, G('all of us') + .5), { size: 26, col: GOLD.text });
    // the machine: its line climbs from below the road and crosses the human level inside the band; the chip rides its head
    const f = (x) => 880 - 740 * (Math.exp(.5 * (x - 160) / 1460) - 1) / (Math.exp(.5) - 1), pts = K.curvePts(f, 160, 1620, 70);
    if (mach > 0) {
      const e = K.lightLine(ctx, pts, 0, mach, AIc, { w: 3.2, head: false });
      const cross = pts.findIndex((p) => p[1] < hy) / 70; const xc = span(mach, cross, cross + .08);
      if (xc > 0) { halo(ctx, pts[Math.round(cross * 70)][0], hy, 90, .5 * bump(mach, cross, .3) + .15, MACH.heart, MACH.heartCore); }
      if (e) K.chip(ctx, t, e[0], e[1] - 4, 30, { lit: 1, think: .4 });
      K.cap(ctx, 'SMARTER', pts[Math.round(cross * 70)][0] + 40, hy - 64, span(t, G('smarter') - .1, G('smarter') + .5), { size: 28, col: MACH.heartCore, glow: true });
    }
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0d older kids: every stop comes sooner (the years roll back)
  a0d(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 960, gy: 600, ga: .22, gcol: '#3a3a5a' }, { z0: 1.0, z1: 1.03, fx: 960, fy: 600 });
    const older = G('older'), walkU = sineIO(span(t, S.a + .2, older + .5)), roll = span(t, G('every stop') - .1, G('comes sooner') + .3), soon = span(t, G('comes sooner') - .25, G('comes sooner') + .5);
    babyLight(ctx, t, .5 * (1 - walkU * .5));
    K.ageClock(ctx, t, { u: 1, lit: [.2, .5 * walkU, 0, 0], figs: [{ i: 0, age: 0, x: .5, h: 82, a: 1 - .45 * walkU }], counter: { age: 0, year: 2026, u: 1 } });
    growTag(ctx, 1);
    // the year marks above each step (born at S.in, right → left), then roll back ten years for a child who is ten today
    for (let i = 4; i >= 0; i--) {
      const [cx, y] = STEPC(i), e = span(t, S.a + (4 - i) * .07, S.a + .6 + (4 - i) * .07); if (e <= 0) continue;
      const past = i < 2, yy = y - 130, a = clamp(e * 3) * (past ? 1 - .6 * roll : 1);
      ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(cx - 120, yy - 70, 240, 90); ctx.clip();
      K.rollText(ctx, String(YEARS[i]), String(YEARS[i] - 10), i >= 2 ? roll : 0, cx - 62, yy + (1 - expoOut(e)) * 40, 50, { col: i >= 2 ? mixHex(CREAM, GOLD.text, roll) : CREAM });
      ctx.restore();
    }
    // a ten-year-old walks in from the left and steps up onto the second step
    const x = lerp(-60, 760, walkU), up = span(x, 440, 520), y = lerp(900, 808, sineIO(up)) - Math.sin(Math.PI * up) * 14;
    K.kid(ctx, x, y, 150, { age: 10, walk: walkU < 1 ? t * 7 : null, look: .4, light: -1, armR: walkU < 1 ? undefined : [.15, .1] });
    K.cap(ctx, 'IF YOUR CHILD IS 10 TODAY', 640, 600, span(t, older - .1, older + .6), { size: 24, align: 'center', col: P.coat });
    K.serif(ctx, 'Every stop comes sooner.', 960, 200, 76, soon, { align: 'center', col: CREAM });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0e the first fear: an empty crib; IS IT FAIR?; your grown kids
  a0e(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const door = sineIO(span(t, G('Maybe your own') - .3, G('grown kids') + .4)), fair = span(t, G('fair') - .25, G('fair') + .6), fear = span(t, G('first fear') - .2, G('first fear') + .6);
    ctx.fillStyle = K.lin(ctx, 0, 0, 0, H, [[0, '#090d2c'], [1, '#05071c']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 1050, fy: 600 });
    room(ctx, { floor: 860, wall: ['#0a0f34', '#121a4a'], fl: ['#161b46', '#080a24'] });
    // the window: night, a few stars; its cool light falls on the crib
    const wx = 1560, wy = 150, ww = 300, wh = 280;
    ctx.fillStyle = K.lin(ctx, 0, wy, 0, wy + wh, [[0, K.SKY.top], [1, K.SKY.mid]]); ctx.fillRect(wx, wy, ww, wh); E.stars(ctx, 41, 18, t, [wx, wy, ww, wh], .7);
    ctx.fillStyle = '#0a0f30'; ctx.fillRect(wx + ww / 2 - 5, wy, 10, wh); ctx.strokeStyle = '#1c2766'; ctx.lineWidth = 14; ctx.strokeRect(wx - 7, wy - 7, ww + 14, wh + 14);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, 0, wy + wh, 0, 860, [[0, rgba('#7fa6e6', .12)], [1, rgba('#7fa6e6', 0)]]); ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx + ww + 160, 860); ctx.lineTo(wx - 140, 860); ctx.closePath(); ctx.fill(); ctx.restore();
    // the empty crib (born where the plane landed) with a slowly turning mobile above it
    const cx = 1360, cb = 820, cw = 330, ch = 190, cu = expoOut(span(t, S.a, S.a + .8));
    ctx.save(); ctx.globalAlpha *= cu;
    ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(cx, cb + 40, cw * .6, 14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2a3270'; ctx.fillRect(cx - cw / 2, cb - ch, 14, ch + 40); ctx.fillRect(cx + cw / 2 - 14, cb - ch, 14, ch + 40);
    ctx.fillStyle = '#232a62'; ctx.fillRect(cx - cw / 2, cb - 36, cw, 30); ctx.fillStyle = '#e8e2cc'; ctx.globalAlpha *= .22; ctx.fillRect(cx - cw / 2 + 14, cb - 46, cw - 28, 12); ctx.globalAlpha /= .22;
    ctx.fillStyle = '#2f3878'; for (let i = 1; i < 9; i++) ctx.fillRect(cx - cw / 2 + i * cw / 9 - 3, cb - ch + 12, 6, ch - 48);
    ctx.fillStyle = '#39428a'; ctx.fillRect(cx - cw / 2, cb - ch, cw, 12);
    ctx.fillStyle = '#050818'; ctx.fillRect(cx - 2, 300, 3, 120);
    const mr = t * .35; for (let i = 0; i < 4; i++) { const q = mr + i * TAU / 4, mxp = cx + Math.cos(q) * 70, s = .55 + .45 * Math.sin(q); ctx.fillStyle = rgba('#c9b98a', .5 + .3 * s); ctx.fillRect(mxp - 1, 420, 2, 26); ctx.beginPath(); ctx.arc(mxp, 452, 9 * (.7 + .3 * s), 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#6f6a8a'; ctx.fillRect(cx - 76, 418, 152, 4);
    ctx.restore();
    // the doorway at the left: it opens on 'your own grown kids'; you (yellow coat) and your partner in its warm light
    const dx = 300, dy = 300, dw = 200, dh = 560, op = door * (1 - .75 * sineIO(span(t, S.b - .9, S.b)));   // the door eases half shut as the plane leaves
    ctx.fillStyle = '#0c1238'; ctx.fillRect(dx - 14, dy - 14, dw + 28, dh + 14);
    if (op > 0) {
      ctx.fillStyle = K.lin(ctx, 0, dy, 0, dy + dh, [[0, '#ffe7b0'], [1, '#f2c46a']]); ctx.fillRect(dx, dy, dw * op, dh);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, dx, 0, dx + 700, 0, [[0, rgba('#ffd98a', .22 * op)], [1, rgba('#ffd98a', 0)]]); ctx.beginPath(); ctx.moveTo(dx, 860); ctx.lineTo(dx + dw * op, 860); ctx.lineTo(dx + dw * op + 520, H + 20); ctx.lineTo(dx - 60, H + 20); ctx.closePath(); ctx.fill(); ctx.restore();
      halo(ctx, dx + dw / 2, dy + dh * .45, 260, .3 * op, '#f2c46a', '#fff4cf');
      ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw * op, dh); ctx.clip();
      E.du(ctx, dx + 76, dy + dh, 330, { dir: 1, look: .1, light: -1, back: .9, armR: [.2, .2] });
      E.person(ctx, dx + 150, dy + dh, 320, { dir: 1, look: .1, light: -1, long: true });
      ctx.restore();
    }
    ctx.fillStyle = '#141c50'; ctx.fillRect(dx + dw * op - 10, dy, 14, dh);   // the door edge
    // the young couple before the crib, from behind: your grown child (yellow coat) and their partner
    const bow = sineIO(span(t, G('fair') - .3, G('fair') + 1.0)) * (1 - .6 * door), reach = sineIO(span(t, G('fair') + .2, G('fair') + 1.4));
    K.kid(ctx, 1000, 980, 380, { age: 30, view: 'back', light: 1, look: .1 - .35 * bow + .02 * Math.sin(t * .9), lean: .04 * bow, back: .3 * door, armL: [-.15 - .12 * reach, -.1 - .1 * reach] });
    E.person(ctx, 1135, 985, 400, { view: 'back', light: 1, look: .1 - .2 * bow + .02 * Math.sin(t * .8 + 1), long: false });
    // words
    K.cap(ctx, 'THE FIRST FEAR', 960, 120, fear, { size: 28, align: 'center', col: CREAM });
    K.cap(ctx, 'BEFORE THE FIRST BIRTHDAY', 960, 160, span(t, G('birthday') - .3, G('birthday') + .5), { size: 22, align: 'center', col: MUTED });
    if (fair > 0) K.serif(ctx, 'Is it fair?', 850, 330, 96, fair, { align: 'center', col: CREAM });
    K.cap(ctx, 'YOUR GROWN KIDS', 1070, 560, span(t, G('grown kids') - .1, G('grown kids') + .6), { size: 24, align: 'center', col: P.coat });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0f a fear is not a forecast (kinetic type)
  a0f(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 960, gy: 520, ga: .25, gcol: '#3a3a5a' }, { z0: 1.0, z1: 1.04, fx: 960, fy: 520 });
    const fu = expoOut(span(t, S.a, S.a + .6)), ne = span(t, G('not') - .2, G('not') + .45), fc = span(t, G('is not') - .1, G('forecast') + .3);
    // FEAR wavers: each letter on its own slow tremble
    const fx = 600, fy = 560, s = 150; let xx = fx - K.measure('FEAR', s, true) / 2;
    for (const [i, ch] of [...'FEAR'].entries()) { const dy = Math.sin(t * 5.1 + i * 1.7) * 6 + Math.sin(t * 8.3 + i) * 2, dx = Math.sin(t * 3.7 + i * 2.3) * 3;
      E.glowText(ctx, ch, xx + dx, fy + dy + (1 - fu) * 50, { size: s, serif: true, col: CREAM, a: fu * (.75 + .25 * Math.sin(t * 6 + i)) }); xx += K.measure(ch, s, true); }
    // ≠
    if (ne > 0) { ctx.save(); ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 7; ctx.lineCap = 'round'; const k = expoOut(ne);
      ctx.beginPath(); ctx.moveTo(920, 500); ctx.lineTo(920 + 80 * k, 500); ctx.moveTo(920, 536); ctx.lineTo(920 + 80 * k, 536); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(975, 470); ctx.lineTo(975 - 30 * span(ne, .4, 1), 470 + 96 * span(ne, .4, 1)); ctx.stroke(); ctx.restore(); }
    // FORECAST: a small chart drawn in gold above a gold word (calm, exact)
    const cx0 = 1180, cy0 = 420, pts = [[cx0, cy0 + 40], [cx0 + 90, cy0 + 10], [cx0 + 180, cy0 + 22], [cx0 + 270, cy0 - 20], [cx0 + 360, cy0 - 38]];
    if (fc > 0) { ctx.fillStyle = rgba(GOLD.line, .3 * fc); ctx.fillRect(cx0, cy0 + 70, 360 * expoOut(fc), 2); K.lightLine(ctx, pts, 0, sineIO(fc), GOLD, { w: 2.6 });
      pts.forEach((p, i) => { const e = span(fc, i / 5, i / 5 + .2); if (e > 0) { ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(p[0], p[1], 6 * e, 0, TAU); ctx.fill(); } }); }
    K.big(ctx, 'FORECAST', 1360, 610, 92, span(t, G('not') - .05, G('not') + .7), { align: 'center', serif: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0g the UN survey sheet: 108,926 adults · 18–39 · 73 countries
  a0g(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 960, gy: 470, ga: .26, gcol: '#3a3a5a' }, { z0: 1.0, z1: 1.04, fx: 960, fy: 480 });
    const un = G('United Nations'), op = expoOut(span(t, S.a, S.a + 1.0)), ya = span(t, G('young adults') - .2, G('young adults') + .9), wo = span(t, G('around the world') - .2, G('world') + .9), q = span(t, G('what keeps') - .15, G('what keeps') + .7);
    // the sheet unfolds from the landing point (S.in) into place
    const cx = lerp(S.in[0], 960, op), cy = lerp(S.in[1], 470, op), w = 1100 * lerp(.08, 1, op), h = 520 * lerp(.08, 1, sineIO(span(t, S.a + .25, S.a + 1.1)));
    // while the plane takes off from S.out, the sheet folds down into it and sinks into the night (no bright paper under the next reveal)
    const fold = expoIn(span(t, S.b - .62, S.b - .02));
    ctx.save(); ctx.translate(lerp(cx, S.out[0], fold), lerp(cy, S.out[1], fold)); ctx.scale(lerp(1, .06, fold), lerp(1, .02, fold)); ctx.globalAlpha *= 1 - fold;
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 14, w, h, 10); ctx.fill();
    ctx.fillStyle = K.lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = rgba(PAPER76.fold, .35); ctx.fillRect(-w / 2, -1, w, 2 * (1 - span(op, .7, 1)) + 1);
    if (op > .6) {
      const L = -500, ink = PAPER76.ink;
      K.cap(ctx, 'UNITED NATIONS · SURVEY', L, -190, span(t, un - .2, un + .5), { size: 24, col: '#7a6f52' });
      if (ya > 0) { const v = Math.round(lerp(0, 108926, expoOut(ya))); E.glowText(ctx, v.toLocaleString('en-US'), L - 4, -80, { size: 104, serif: true, col: ink, glow: false, a: clamp(ya * 3) }); }
      K.cap(ctx, 'ADULTS · AGED 18–39', L, -26, span(ya, .3, 1), { size: 26, col: ink });
      K.cap(ctx, '73 COUNTRIES', L, 22, wo, { size: 26, col: ink });
      // the field of small figure dots (each a person), filling in reading order
      const cols = 22, rows = 9, gx = 24;
      for (let k = 0; k < cols * rows; k++) { const e = span(wo, (k / (cols * rows)) * .7, (k / (cols * rows)) * .7 + .3); if (e <= 0) continue; const c = k % cols, r = Math.floor(k / cols), px = 0 + c * gx, py = -190 + r * gx;
        ctx.fillStyle = rgba(ink, .55 + .25 * ((c * 7 + r * 3) % 5 === 0)); ctx.beginPath(); ctx.arc(px, py - 3, 4.2 * e, 0, TAU); ctx.fill(); ctx.fillRect(px - 3.5 * e, py + 2, 7 * e, 7 * e); }
      ctx.fillStyle = rgba(PAPER76.fold, .5); ctx.fillRect(L, 74, 1000 * expoOut(q), 2);
      K.cap(ctx, 'WHAT KEEPS THEM FROM HAVING CHILDREN?', L, 140, q, { size: 34, col: '#3a2f6a' });
    }
    ctx.restore();
    K.src(ctx, t, un - .2, T.G('And this child starts life') - .2, 'UNFPA · JULY 2026 · ONLINE SURVEY, NOT REPRESENTATIVE');
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0h the answer: MONEY, HOUSING (rank)
  a0h(ctx, t, S, T) {
    K.bg(ctx, t, { gx: 640, gy: 520, ga: .24, gcol: '#5a4a2a' });
    ctx.save(); frame(ctx, t, listCam(t, T), S.seed); surveyLists(ctx, t, T); ctx.restore();
    K.src(ctx, t, T.G('The United Nations asked') - .2, T.G('And this child starts life') - .2, 'UNFPA · JULY 2026 · ONLINE SURVEY, NOT REPRESENTATIVE');
  },
  // ---------------------------------------------------------------- a0i (match) the second list: AI nearly half worry, sorts LAST
  a0i(ctx, t, S, T) {
    const m = span(t, T.G('Plenty of them do worry') - .5, T.G('Plenty of them do worry') + 1.2);
    K.bg(ctx, t, { gx: lerp(640, 1300, m), gy: 520, ga: .24, gcol: mixHex('#5a4a2a', '#3a3a5a', m) });
    ctx.save(); frame(ctx, t, listCam(t, T), S.seed - 7); surveyLists(ctx, t, T); ctx.restore();
    K.src(ctx, t, T.G('The United Nations asked') - .2, T.G('And this child starts life') - .2, 'UNFPA · JULY 2026 · ONLINE SURVEY, NOT REPRESENTATIVE');
  },
  // ---------------------------------------------------------------- a0j most still want children: 79 % of men, 72 % of women (childless, 35–39)
  a0j(ctx, t, S, T) {
    const { G, IN } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 960, gy: 560, ga: .26, gcol: '#5a4a2a' }, { z0: 1.02, z1: 1.0, fx: 960, fy: 560 });
    const most = span(t, G('most') - .3, G('most') + .5), want = span(t, G('still want') - .5, G('children') + .2);
    K.serif(ctx, 'Most still want children.', 960, 196, 74, most, { align: 'center', col: '#fff6d8' });
    K.cap(ctx, 'WITHOUT CHILDREN YET, AGED 35–39', 960, 246, span(most, .3, 1), { size: 24, align: 'center', col: MUTED });
    for (const [r, lab, n, pct] of [[0, 'MEN', 7.9, '79 %'], [1, 'WOMEN', 7.2, '72 %']]) {
      const y = 540 + r * 270, x0 = 560;
      for (let i = 0; i < 10; i++) { const L = clamp(span(want, i * .07, i * .07 + .35) * clamp(n - i)); if (L > 0) { halo(ctx, x0 + i * 92, y - 100, 90, .5 * L, GOLD.halo, GOLD.core); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.body, .22 * L); ctx.beginPath(); ctx.ellipse(x0 + i * 92, y + 4, 40, 9, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
      K.figRow(ctx, t, x0, y, 10, 92, 170, span(IN(1.1), r * .15, .85 + r * .15), (i) => { const L = clamp(span(want, i * .07, i * .07 + .35) * clamp(n - i)); return L > 0 ? { look: .35 * L, rim: L > .4 ? GOLD.hot : undefined } : { dim: .35 * want, look: .1 }; });
      K.cap(ctx, lab, x0 - 60, y - 70, IN(.8, r * .15), { size: 26, align: 'right', col: CREAM });
      E.glowText(ctx, pct, x0 + 9 * 92 + 90, y - 50, { size: 72, serif: true, col: GOLD.text, glow: true, a: rise(span(want, .45 + r * .15, 1)) });
    }
    K.src(ctx, t, T.G('The United Nations asked') - .2, T.G('And this child starts life') - .2, 'UNFPA · JULY 2026 · ONLINE SURVEY, NOT REPRESENTATIVE');
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0k back on the lowest step: safer than almost any child before
  a0k(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 560, gy: 700, ga: .22, gcol: '#5a4a2a' });
    const u = sineIO(span(t, S.a, S.b + .4)), safe = span(t, G('safer') - .4, G('safer') + 1.2);
    ctx.save(); frame(ctx, t, camLerp({ sx: 560, sy: 700, z: 2.1, wx: 315, wy: 850 }, { sx: 600, sy: 700, z: 2.0, wx: 330, wy: 848 }, u), S.seed);
    // the warm pool of light grows round the baby
    halo(ctx, 315, 860, 150 + 160 * sineIO(safe) + 6 * Math.sin(t * 1.2), .3 + .4 * sineIO(safe), GOLD.halo, GOLD.core);
    K.ageClock(ctx, t, { u: 1, city: .6, lit: [.4 + .6 * sineIO(safe), .3], figs: [{ i: 0, age: 0, x: .5, h: 82 }] });
    ctx.restore();
    K.serif(ctx, 'Safer than almost', 1240, 300, 76, span(t, G('safer') - .2, G('safer') + .6), { align: 'center', col: '#fff6d8' });
    K.serif(ctx, 'any child before.', 1240, 392, 76, span(t, G('safer') + .05, G('safer') + .85), { align: 'center', col: '#fff6d8' });
  },
  // ---------------------------------------------------------------- a0l deaths before age 5: more than halved in a generation (★ wow)
  a0l(ctx, t, S, T) {
    K.bg(ctx, t, { gx: 900, gy: 500, ga: .24, gcol: mixHex('#3a3a5a', '#5a4a2a', span(t, T.G('halved') - .3, T.G('halved') + 1)) });
    ctx.save(); deathCurve(ctx, t, T); ctx.restore();
  },
  // ---------------------------------------------------------------- a0m (match) slowed since 2015 · but it's REAL
  a0m(ctx, t, S, T) {
    K.bg(ctx, t, { gx: 900, gy: 500, ga: .26, gcol: '#5a4a2a' });
    ctx.save(); deathCurve(ctx, t, T); ctx.restore();
  },
  // ---------------------------------------------------------------- a0n SAFE ≠ READY; electricity did no homework; this machine will
  a0n(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const el = span(t, G('Electricity') - .3, G('Electricity') + .6), mw = span(t, G('This machine') - .2, G('will') + .4), wr = span(t, G('will') - .1, S.b + .2);
    K.bg(ctx, t, { gx: lerp(700, 1250, mw), gy: 560, ga: .24, gcol: mixHex('#5a4a2a', '#2a4a6a', mw) });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 560 });
    // SAFE ≠ READY
    K.big(ctx, 'Safe', 780, 250, 104, span(t, S.a, S.a + .6), { align: 'center' });
    const ne = span(t, G('not the same') - .1, G('not the same') + .4);
    if (ne > 0) { ctx.save(); ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 6; ctx.lineCap = 'round'; const k = expoOut(ne); ctx.beginPath(); ctx.moveTo(925, 205); ctx.lineTo(925 + 70 * k, 205); ctx.moveTo(925, 235); ctx.lineTo(925 + 70 * k, 235); ctx.moveTo(975, 180); ctx.lineTo(975 - 28 * span(ne, .4, 1), 180 + 80 * span(ne, .4, 1)); ctx.stroke(); ctx.restore(); }
    K.serif(ctx, 'Ready', 1150, 250, 104, span(t, G('ready') - .25, G('ready') + .5), { align: 'center', col: CREAM });
    // the table: left the bulb over a blank notebook (does nothing), right the tablet that writes the solution itself
    ctx.fillStyle = K.lin(ctx, 0, 760, 0, H, [[0, '#2a2342'], [1, '#120e28']]); ctx.fillRect(-100, 760, W + 200, 400); ctx.fillStyle = rgba('#ffe7b0', .12); ctx.fillRect(-100, 760, W + 200, 2);
    bulb(ctx, t, 720, 470, 44, sineIO(el) * (1 - .35 * mw) * (.95 + .05 * Math.sin(t * 9)));
    notebookOpen(ctx, 720, 742, 260, 1, 0);
    ctx.fillStyle = '#c98a4a'; ctx.save(); ctx.translate(790, 752); ctx.rotate(-.12); ctx.fillRect(-60, -4, 120, 8); ctx.restore();   // the pencil lies still
    K.cap(ctx, 'ELECTRICITY: NO HOMEWORK', 720, 836, span(t, G('homework') - .2, G('homework') + .5), { size: 24, align: 'center', col: GOLD.text });
    const tl = sineIO(mw);
    K.tablet(ctx, t, 1250, 640, 300, 210, { lit: tl, rot: -.03, content(c, x, y, w, h) {
      const n = 5 * clamp(wr * 1.3); c.fillStyle = rgba('#0b1236', .75);
      for (let i = 0; i < 5; i++) { const e = clamp(n - i); if (e <= 0) break; c.fillRect(x + 24, y + 30 + i * 30, (w - 60 - (i % 2) * 50) * e, 8); }
      if (wr > .85) { c.strokeStyle = rgba('#0b1236', .8); c.lineWidth = 5; c.beginPath(); c.moveTo(x + w - 70, y + h - 40); c.lineTo(x + w - 56, y + h - 26); c.lineTo(x + w - 30, y + h - 58); c.stroke(); } } });
    K.cap(ctx, 'THIS MACHINE WILL', 1250, 836, span(t, G('This machine') - .1, G('This machine') + .6), { size: 24, align: 'center', col: MACH.heartCore });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a0o the tablet fills with every subject; a small child before it
  a0o(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1180, gy: 470, ga: .26, gcol: '#2a4a6a' });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 900, fy: 560 });
    const g = sineIO(span(t, S.a, S.a + 1.1)), fill = span(t, G('machine already') - .6, G('everything') + .5);
    const tx = lerp(1250, 1180, g), ty = lerp(640, 470, g), tw = lerp(300, 660, g), th = lerp(210, 460, g);
    ctx.fillStyle = K.lin(ctx, 0, 880, 0, H, [[0, '#18204e'], [1, '#080a24']]); ctx.fillRect(-100, 880, W + 200, 300);
    K.tablet(ctx, t, tx, ty, tw, th, { lit: 1, content(c, x, y, w, h) {
      const items = ['ABC', '123', 'leaf', 'planet', 'note', '∑', 'atom', 'Aa', 'map', '½', 'π', 'star'];
      items.forEach((it, i) => { const e = span(fill, i / 12 * .75, i / 12 * .75 + .25); if (e <= 0) return; const cx = x + w * (.14 + (i % 4) * .24), cy = y + h * (.2 + Math.floor(i / 4) * .3), k = expoOut(e), s = 34 * k, ink = '#0b2b44';
        c.save(); c.globalAlpha *= clamp(e * 3); c.fillStyle = ink; c.strokeStyle = ink; c.lineWidth = 4;
        if (it === 'leaf') { c.beginPath(); c.ellipse(cx, cy, s * .8, s * .4, -.6, 0, TAU); c.fill(); }
        else if (it === 'planet') { c.beginPath(); c.arc(cx, cy, s * .5, 0, TAU); c.fill(); c.beginPath(); c.ellipse(cx, cy, s * .95, s * .25, -.3, 0, TAU); c.stroke(); }
        else if (it === 'note') { c.beginPath(); c.arc(cx - s * .2, cy + s * .3, s * .22, 0, TAU); c.fill(); c.fillRect(cx - s * .02, cy - s * .55, 4, s * .85); }
        else if (it === 'atom') { for (let j = 0; j < 3; j++) { c.beginPath(); c.ellipse(cx, cy, s * .8, s * .3, j * Math.PI / 3, 0, TAU); c.stroke(); } }
        else if (it === 'map') { c.beginPath(); c.moveTo(cx - s * .7, cy - s * .4); c.lineTo(cx - s * .2, cy - s * .55); c.lineTo(cx + s * .2, cy - s * .4); c.lineTo(cx + s * .7, cy - s * .55); c.lineTo(cx + s * .7, cy + s * .45); c.lineTo(cx + s * .2, cy + s * .6); c.lineTo(cx - s * .2, cy + s * .45); c.lineTo(cx - s * .7, cy + s * .6); c.closePath(); c.stroke(); }
        else if (it === 'star') { c.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? s * .3 : s * .7, q = j * Math.PI / 5 - Math.PI / 2; c.lineTo(cx + Math.cos(q) * r, cy + Math.sin(q) * r); } c.closePath(); c.fill(); }
        else E.glowText(c, it, cx, cy + s * .35, { size: s * 1.15, serif: true, align: 'center', col: ink, glow: false });
        c.restore(); });
    } });
    K.cap(ctx, 'KNOWS EVERYTHING', tx, ty + th / 2 + 52, span(t, G('knows everything') - .2, G('knows everything') + .5), { size: 26, align: 'center', col: MACH.heartCore });
    // the small child stands before it and looks up
    const ku = sineIO(span(t, S.a + .2, G('a child learn') + .2)), kx = lerp(-80, 430, ku);
    K.kid(ctx, kx, 882, 250, { age: 4, dir: 1, walk: ku < .98 ? t * 6.5 : null, look: .55 + .25 * sineIO(fill), light: 1, back: .4 });
    K.serif(ctx, 'What does a child learn?', 560, 214, 70, span(t, G('what does a child') - .2, G('what does a child') + .6), { align: 'center', col: CREAM });
    ctx.restore();
  },

  // ================================================================ AGE 6 · 2032
  // ---------------------------------------------------------------- a6a six years later: AGE 6 · 2032, a first-grader on step 2
  a6a(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 640, gy: 760, ga: .22, gcol: '#3a3a5a' }, { z0: 1.0, z1: 1.03, fx: 700, fy: 700 });
    const wk = sineIO(span(t, G('Six years') - .3, G('later') + .7)), roll = span(t, G('Twenty thirty') - .25, G('Twenty thirty') + 1.0), grade = span(t, G('First grade') - .35, G('First grade') + .4);
    K.ageClock(ctx, t, { u: 1, lit: [.3 * (1 - wk), span(roll, .3, 1)], scenario: span(t, G('Twenty thirty') + .2, G('Twenty thirty') + .9),
      counter: { age: 6, year: 2032, from: { age: 0, year: 2026 }, u: roll } });
    // the child walks up from step 1 to step 2 and grows on the way (4 → 6); the school bag on 'First grade'
    const x = lerp(400, 645, wk), up = span(x, 440, 520), y = lerp(900, 808, sineIO(up)) - Math.sin(Math.PI * up) * 12, h = lerp(100, 120, wk);
    halo(ctx, x, y - h * .5, 90, .28, GOLD.halo, GOLD.core);
    const kk = expoOut(span(t, S.a, S.a + .5));
    ctx.save(); ctx.globalAlpha *= kk; K.kid(ctx, x, y, h, { age: 6, head: lerp(1.55, 1.45, wk), walk: wk > .02 && wk < .98 ? t * 7 : null, look: .5, light: -1 }); ctx.restore();
    if (grade > 0) bag(ctx, x - h * .2, y - h * .56, h * .3 * expoOut(grade), clamp(grade * 3));
    K.cap(ctx, 'FIRST GRADE', 645, 620, grade, { size: 28, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6b a tutor in a tablet: every subject, never loses patience
  a6b(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const on = span(t, G('tutor in a tablet') - .2, G('tutor in a tablet') + .7), subj = span(t, G('every subject') - .3, G('every subject') + 1.2), pat = span(t, G('and it never') - .1, G('patience') + .2);
    ctx.fillStyle = '#070a22'; ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 980, fy: 560 });
    room(ctx, { floor: 860 });
    K.kid(ctx, 760, 700 + 300 * .46, 300, { age: 6, dir: 1, look: .25 + .2 * sineIO(on), lean: .08, light: 1, armR: [1.1, 1.7], armL: [.9, 1.5] });
    desk(ctx, 700, 1360, 700, { depth: 200, lit: .4 * on });
    const tx = 1100, ty = 612;
    K.tablet(ctx, t, tx, ty, 250, 172, { lit: .12 + .88 * sineIO(on), rot: -.03, content(c, x, y, w, h) { if (on > .5) { c.fillStyle = rgba('#0b2b44', .7 * on); E.glowText(c, 'Aa', x + w / 2, y + h * .62, { size: 60, serif: true, align: 'center', col: '#0b2b44', glow: false, a: on }); } } });
    // subject tags circle the tablet (slow orbit; the far side dims)
    ['READING', 'MATH', 'SCIENCE', 'MUSIC'].forEach((lab, i) => {
      const u = span(subj, i * .15, i * .15 + .5); if (u <= 0) return;
      const q = i * TAU / 4 + t * .12 - .6, px = tx + 60 + Math.cos(q) * 230, py = ty - 40 + Math.sin(q) * 130, near = .6 + .4 * Math.sin(q);
      ctx.save(); ctx.globalAlpha *= near; K.tag(ctx, lab, px, py, u, { size: 22, col: MACH.heartCore }); ctx.restore();
    });
    // the patience line: level, calm, it never wavers
    if (pat > 0) { K.lightLine(ctx, [[880, 420], [1240, 420]], 0, sineIO(pat), AIc, { w: 3, head: true }); K.cap(ctx, 'NEVER LOSES PATIENCE', 1060, 386, span(pat, .2, .8), { size: 26, align: 'center', col: MACH.heartCore }); }
    K.cap(ctx, 'A TUTOR IN A TABLET', tx, 830, span(on, .2, 1), { size: 24, align: 'center', col: CREAM });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6c the fear: the thinking moves out of the child into the machine
  a6c(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const fear = span(t, G('The fear') - .2, G('The fear') + .5), mv = sineIO(span(t, G('does the thinking') - .4, G('thinking') + .7)), dim = span(t, G('never learns') - .2, G('learns to') + .5);
    ctx.fillStyle = '#070a22'; ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 600 });
    room(ctx, { floor: 900, wall: ['#0a0f34', '#121a4a'] });
    const tx = 1250, ty = 600;
    K.tablet(ctx, t, tx, ty, 330, 230, { lit: .7 + .3 * mv, rot: -.03, content(c, x, y, w, h) { if (mv > .9) thinkLoop(c, t, x + w / 2, y + h / 2, 34, span(mv, .9, 1), 1); } });
    const hx = 700, hy = 470;
    halo(ctx, hx, 600, 260, .22 * (1 - dim), GOLD.halo, GOLD.core);   // the child's own light
    K.kid(ctx, hx, 760 + 440 * .46, 440, { age: 6, dir: 1, look: lerp(.3, -.1, dim), lean: lerp(.06, .2, dim), light: 1, armR: [1.0, 1.6], armL: [.8, 1.4] });
    desk(ctx, 600, 1500, 760, { depth: 200 });
    // the loop of light: above the head, then along an arc into the tablet (gold → cyan)
    if (mv < 1) { const x = lerp(hx, tx, mv), y = lerp(hy - 40, ty, mv) - Math.sin(Math.PI * mv) * 180; thinkLoop(ctx, t, x, y, lerp(38, 30, mv), expoOut(span(t, S.a + .1, S.a + .8)), mv); }
    K.cap(ctx, 'THINKING', hx, hy - 110, span(t, S.a + .3, S.a + 1) * (1 - span(mv, 0, .3)), { size: 24, align: 'center', col: GOLD.text });
    K.cap(ctx, 'THE FEAR', 960, 150, fear, { size: 34, align: 'center', col: CREAM });
    K.cap(ctx, 'NEVER LEARNS TO', hx, 300, dim, { size: 28, align: 'center', col: CREAM });
    // where the loop was: only its empty dashed outline is left above the head
    if (dim > 0) { const s0 = 46, ox = hx, oy = hy - 40 + Math.sin(t * 1.1) * 3; ctx.save(); ctx.setLineDash([5, 9]); ctx.lineDashOffset = -t * 6; ctx.strokeStyle = rgba(CREAM, .75 * expoOut(dim)); ctx.lineWidth = 3.5; ctx.beginPath();
      for (let i = 0; i <= 64; i++) { const q = i / 64 * TAU, r = s0 / (1 + Math.sin(q) ** 2), px = ox + r * Math.cos(q), py = oy + r * Math.sin(q) * Math.cos(q) * 1.2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6d an early version, already tried; one tablet flickers
  a6d(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .2 });
    const z = classCam(t, T), fl = G('something else'), grow = span(t, S.a, G('early version') + .2);
    ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
    classes(ctx, t, T, { grow, flick: (i) => (i === 7 ? (Math.sin(t * 40) > .2 ? 1 : 0) * span(t, fl - .3, fl) * (1 - span(t, fl + .9, fl + 1.1)) + .5 * span(t, fl + .9, fl + 1.1) : 0) });
    ctx.restore();
    const st = T.G('Stanford researchers'), out = 1 - span(t, st - .4, st + .1);
    K.cap(ctx, 'AN EARLY VERSION, ALREADY TRIED', 960, 120, span(t, G('early version') - .4, G('early version') + .4) * out, { size: 30, align: 'center', col: CREAM });
    K.serif(ctx, 'Something else went wrong.', 960, 200, 60, span(t, G('something else') - .1, G('something else') + .6) * out, { align: 'center', col: CREAM });
  },
  // ---------------------------------------------------------------- a6e (match) Stanford: two districts, a reading tutor
  a6e(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .2 });
    const z = classCam(t, T), split = span(t, G('two districts') - .5, G('two districts') + .9);
    ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
    classes(ctx, t, T, { grow: 1, split, book: span(t, G('reading tutor') - .2, G('reading tutor') + .6), flick: (i) => (i === 7 ? .5 * (1 - span(t, S.a, S.a + .8)) : 0) });
    ctx.restore();
    K.cap(ctx, 'STANFORD STUDY', 960, 120, span(t, G('Stanford') - .1, G('Stanford') + .6), { size: 34, align: 'center', col: CREAM });
    const alone = gAny(G, 'on their own', 'In one district');
    K.tag(ctx, 'AI READING TUTOR', 960, 196, span(t, G('reading tutor') - .1, G('reading tutor') + .6) * (1 - span(t, alone - .5, alone - .1)), { size: 24, col: MACH.heartCore });
    K.tag(ctx, 'KIDS LEFT ON THEIR OWN', 960, 196, span(t, alone - .1, alone + .5), { size: 24, col: CREAM });
    K.src(ctx, t, G('Stanford') - .2, T.G('The tutor was ready') + .2, 'STANFORD · JUNE 2026 · 355 CHILDREN · TWO DISTRICTS · WORKING PAPER');
  },
  // ---------------------------------------------------------------- a6f (match) kids on their own: four in ten never logged on, nearly half: NOT ONCE (★)
  a6f(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const never = gAny(G, 'never logged', 'never used'), d1 = span(t, G('four in ten') - .2, never + .5), d2 = span(t, G('nearly half') - .3, G('nearly half') + .9), no = span(t, G('Not once') - .2, G('Not once') + .5);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: lerp(.2, .12, no) });
    const z = classCam(t, T);
    ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
    classes(ctx, t, T, { grow: 1, split: 1, book: 1,
      darkU: (p, i) => { const k = DARK[p].indexOf(i); return k < 0 ? 0 : expoOut(span(p ? d2 : d1, k * .17, k * .17 + .3)); },
      partU: (p, i) => (p === 1 && i === 9 ? .67 * expoOut(span(d2, .7, 1)) : 0) });
    ctx.restore();
    // the numbers land on their words
    const n1 = span(t, G('four in ten') - .1, G('four in ten') + .5), n2 = span(t, G('nearly half') - .1, G('nearly half') + .5);
    E.glowText(ctx, '39 %', 500, 342 + (1 - expoOut(n1)) * 30, { size: 84, serif: true, align: 'center', col: CREAM, a: clamp(n1 * 3) });
    E.glowText(ctx, '47 %', 1420, 342 + (1 - expoOut(n2)) * 30, { size: 84, serif: true, align: 'center', col: CREAM, a: clamp(n2 * 3) });
    K.cap(ctx, 'NEVER LOGGED ON', 500, 388, span(t, never - .1, never + .5), { size: 22, align: 'center', col: MUTED });
    K.cap(ctx, 'NEVER LOGGED ON', 1420, 388, span(n2, .3, 1), { size: 22, align: 'center', col: MUTED });
    K.cap(ctx, 'STANFORD STUDY', 960, 120, 1, { size: 34, align: 'center', col: CREAM });
    K.tag(ctx, 'KIDS LEFT ON THEIR OWN', 960, 196, 1 - span(t, G('Not once') - .5, G('Not once') - .1), { size: 24, col: CREAM });   // continues a6e's tag across the match
    K.serif(ctx, 'Not once.', 960, 232, 96, no, { align: 'center', col: '#fff6d8' });
    K.src(ctx, t, T.G('Stanford researchers') - .2, T.G('The tutor was ready') + .2, 'STANFORD · JUNE 2026 · 355 CHILDREN · TWO DISTRICTS · WORKING PAPER');
  },
  // ---------------------------------------------------------------- a6g the tutor was ready; those children never asked
  a6g(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    ctx.fillStyle = '#070a22'; ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 960, fy: 560 });
    room(ctx, { floor: 900 });
    const tx = 1150, ty = 480, g = expoOut(span(t, S.a, S.a + .8)), never = span(t, G('Those children') - .1, G('Those children') + .6);
    K.kid(ctx, 620, 760 + 400 * .46, 400, { age: 6, dir: -1, look: .1, lean: .05, light: -1, armR: [.3, .4], armL: [-.2, -.1] });
    desk(ctx, 420, 1560, 760, { depth: 200 });
    K.tablet(ctx, t, tx, ty + (1 - g) * 30, 520 * lerp(.6, 1, g), 360 * lerp(.6, 1, g), { lit: g, rot: -.02, content(c, x, y, w, h) {
      c.fillStyle = rgba('#0b2b44', .55); c.beginPath(); c.roundRect(x + w * .1, y + h * .62, w * .8, h * .18, 12); c.fill();
      if (Math.sin(t * Math.PI * 2 * .9) > -.1) { c.fillStyle = '#e9fbff'; c.fillRect(x + w * .14, y + h * .655, 5, h * .11); }
      book(c, x + w / 2, y + h * .32, h * .38, .8, '#0b2b44'); } });
    K.cap(ctx, 'READY', tx, 262, span(t, G('ready') - .2, G('ready') + .5), { size: 30, align: 'center', col: MACH.heartCore });
    // an empty dotted ring above the child: no question rises
    const ring = span(t, G('Those children') - .4, G('Those children') + .4);
    if (ring > 0) { ctx.save(); ctx.setLineDash([6, 10]); ctx.strokeStyle = rgba(CREAM, .35 * ring); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(620, 360 + Math.sin(t * 1.3) * 4, 44 * expoOut(ring), 0, TAU); ctx.stroke(); ctx.restore(); }
    K.serif(ctx, 'Never asked.', 620, 252, 72, never, { align: 'center', col: CREAM });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6h other trials point the same way; only a little alone; best when a person stayed involved
  a6h(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const point = span(t, G('point the same') - .2, G('point the same') + .9), own = span(t, G('On its own') - .2, G('On its own') + .6), lit = span(t, G('little') - .2, G('little') + .6);
    const best = gAny(G, 'The best results', 'Where it worked'), pers = gAny(G, 'person stayed', 'grown-up'), invl = gAny(G, 'stayed involved', 'grown-up');
    const gw = sineIO(span(t, best - .3, pers + .1)), glow = span(t, invl - .1, invl + .9), lift = sineIO(span(t, G('On its own') - .9, G('On its own') + .3));
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .2 + .1 * glow, gcol: mixHex(P.blue0, '#5a4a2a', glow) });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 600 });
    // the three study cards land, their arrows turn to point the same way
    [['NBER', 560, -.9], ['IZA', 960, 1.9], ['EEDI · GOOGLE', 1360, .6]].forEach(([lab, x, a0], i) => {
      const u = span(t, S.a + i * .25, S.a + .7 + i * .25); if (u <= 0) return; const k = expoOut(u), dimC = 1 - .45 * span(own, 0, 1);
      ctx.save(); ctx.globalAlpha *= clamp(u * 3) * dimC; ctx.translate(x, lerp(470, 230, lift) + (1 - k) * -40); ctx.scale(lerp(1.1, 1, lift), lerp(1.1, 1, lift));
      ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-165 + 6, -62 + 10, 330, 124, 12); ctx.fill();
      ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-165, -62, 330, 124, 12); ctx.fill(); ctx.stroke();
      E.glowText(ctx, lab, -140, -8, { size: 30, weight: 600, col: CREAM, glow: false }); E.glowText(ctx, 'TRIAL · 2026', -140, 32, { size: 22, weight: 600, col: MUTED, glow: false });
      const ang = lerp(a0, 0, sineIO(span(point, i * .12, i * .12 + .6))); ctx.translate(122, 0); ctx.rotate(ang); ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.moveTo(12, -12); ctx.lineTo(24, 0); ctx.lineTo(12, 12); ctx.stroke(); ctx.restore();
    });
    K.cap(ctx, 'POINT THE SAME WAY', 960, lerp(620, 340, lift), span(point, .4, 1) * (1 - span(own, 0, .5)), { size: 24, align: 'center', col: GOLD.text });
    // the child at a tablet; ON ITS OWN: A LITTLE (a short bar, no number); then a person comes in, stays beside the child, and the scene warms
    const cu = expoOut(span(own, 0, 1));
    if (cu > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(cu * 2);
      if (glow > 0) halo(ctx, 900, 640, 420, .32 * glow, GOLD.halo, GOLD.core);
      ctx.fillStyle = K.lin(ctx, 0, 880, 0, H, [[0, '#18204e'], [1, '#080a24']]); ctx.fillRect(-100, 900, W + 200, 300);
      K.kid(ctx, 740, 740 + 300 * .46 + (1 - cu) * 30, 300, { age: 6, dir: 1, look: .2 + .3 * glow, light: 1, armR: [1.0, 1.6], rim: glow > .4 ? GOLD.hot : undefined });
      if (gw > 0) E.person(ctx, lerp(1760, 1230, gw), 740 + 380 * .46, 380, { dir: -1, walk: gw < .98 ? t * 6 : null, look: .1, light: -1, long: true, rim: glow > .4 ? GOLD.line : undefined, armR: gw >= .98 ? [lerp(.2, .9, glow), lerp(.1, 1.2, glow)] : undefined });
      desk(ctx, 620, 1360, 740, { depth: 200, lit: .5 * glow });
      K.tablet(ctx, t, 960, 664, 200, 140, { lit: 1, rot: -.03 });
      ctx.restore();
      K.bar(ctx, 1110, 520, 80, own, AIc, { th: 26, glow: .6 });
      K.cap(ctx, 'ON ITS OWN', 1110, 480, own, { size: 24, col: MACH.heartCore });
      K.cap(ctx, 'ONLY A LITTLE', 1220, 530, lit, { size: 24, col: CREAM });
    }
    K.cap(ctx, 'THE BEST RESULTS', 960, 338, span(t, best - .1, best + .6), { size: 24, align: 'center', col: GOLD.text });
    K.serif(ctx, 'A person stayed involved.', 960, 420, 66, glow, { align: 'center', col: '#fff6d8' });
    K.src(ctx, t, S.a + .3, S.b + .3, 'NBER W35620 · IZA DP 19025 · EEDI / GOOGLE DEEPMIND · 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6i Alison Gopnik: how small children really learn
  a6i(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    stage(ctx, t, S, { gx: 960, gy: 460, ga: .25, gcol: '#5a4a2a' }, { z0: 1.0, z1: 1.04, fx: 960, fy: 500 });
    const op = expoOut(span(t, S.a, S.a + .8)), lr = span(t, G('small children') - .4, G('really learn') + .4);
    ctx.fillStyle = K.lin(ctx, 0, 860, 0, H, [[0, '#18204e'], [1, '#080a24']]); ctx.fillRect(-100, 860, W + 200, 300);
    // the name card unfolds from the landing point
    const w = 820 * lerp(.1, 1, op), h = 200 * lerp(.1, 1, sineIO(span(t, S.a + .2, S.a + .9)));
    ctx.save(); ctx.translate(960, 420);
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 12, w, h, 10); ctx.fill();
    ctx.fillStyle = K.lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 8); ctx.fill();
    if (op > .7) { K.serif(ctx, 'Alison Gopnik', -360, -4, 76, span(t, S.a + .3, S.a + 1), { col: PAPER76.ink, glow: false }); K.cap(ctx, 'PSYCHOLOGIST · UC BERKELEY', -360, 56, span(t, S.a + .5, S.a + 1.2), { size: 26, col: '#7a6f52' }); }
    ctx.restore();
    // small children learning round it: one stacks blocks, one looks through a magnifier
    E.person(ctx, 470, 862, 200, { head: 1.45, dir: 1, look: .3, light: 1, armR: [lerp(1.4, 1.9, lr), lerp(2.2, 2.6, lr)] });
    const bc = ['#c98a4a', '#8fb3d9', '#e8d29a', '#b06a8a'];
    for (let i = 0; i < 4; i++) { const u = expoOut(span(lr, i * .22, i * .22 + .3)); if (u <= 0) continue; const y = lerp(560, 860 - 34 - i * 52, u);
      ctx.fillStyle = bc[i]; ctx.beginPath(); ctx.roundRect(570 - 24 + (i % 2) * 6, y - 34 + 34, 48, 48, 6); ctx.fill(); }
    E.person(ctx, 1450, 862, 190, { head: 1.45, dir: -1, look: -.2, lean: .25, light: -1, armR: [1.3, 1.5] });
    ctx.fillStyle = '#6aa04a'; ctx.beginPath(); ctx.ellipse(1340, 852, 26, 10, -.3, 0, TAU); ctx.fill();
    const mx = 1360 + Math.sin(t * 1.1) * 10, my = 800; ctx.strokeStyle = '#d8d0b4'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(mx, my, 22, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(mx + 16, my - 16); ctx.lineTo(mx + 40, my - 40); ctx.stroke();
    halo(ctx, mx, my, 40, .25, GOLD.halo, GOLD.core);
    K.cap(ctx, 'HOW SMALL CHILDREN LEARN', 960, 600, span(lr, .3, 1), { size: 26, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6j a four-year-old often beats top college students at a strange new toy
  a6j(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const race = span(t, G('the child often') - .2, G('beats top') + .6), often = span(t, G('often') - .1, G('often') + .5), lit = span(t, G('figuring out') - .1, G('works') + .2), lift = sineIO(span(t, G('how it works') - .3, S.b - .6));
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .22 + .12 * lit, gcol: mixHex(P.blue0, '#5a4a2a', lit) });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.02, fx: 960, fy: 540 });
    ctx.fillStyle = K.lin(ctx, 0, 860, 0, H, [[0, '#18204e'], [1, '#080a24']]); ctx.fillRect(-100, 860, W + 200, 300);
    // the students at their table with the same toy (it stays dark)
    E.person(ctx, 1450, 862, 380, { dir: 1, look: -.1, lean: .12, light: -1, armR: [1.2, 2.6], long: true });
    E.person(ctx, 1690, 862, 370, { dir: -1, look: -.2, lean: .1, light: -1, armR: [.9, 1.4] });
    desk(ctx, 1480, 1660, 700, { depth: 160 });
    toyBox(ctx, t, 1570, 668, 26, .1 + Math.sin(t * .7) * .1, 0);
    K.cap(ctx, 'TOP COLLEGE STUDENTS', 1570, 430, span(t, G('college students') - .2, G('college students') + .5), { size: 24, align: 'center', col: LILAC.text });
    // the four-year-old turns the toy; it lights; the child lifts it high (the clip will grow out of its light)
    const armR = [lerp(.8, 2.9, lift), lerp(2.2, 3.05, lift)], armL = [lerp(-.6, -2.9, lift), lerp(-2.2, -3.05, lift)];
    const hands = K.kid(ctx, 960, 862, 300, { age: 4, dir: 1, look: lerp(.2, .9, lift), light: 1, armR, armL, other: true });
    const tx = (hands.R[0] + hands.L[0]) / 2, ty = Math.min(hands.R[1], hands.L[1]) - 18 * (1 - lift) - 26 * lift;
    const g = expoOut(span(t, S.a, S.a + .6));
    toyBox(ctx, t, tx, ty, 30 * g, Math.sin(t * 1.6) * .5 * (1 - lit) + (1 - g) * .6, sineIO(lit));
    K.cap(ctx, 'AGE 4', 960, 480, span(t, G('four-year-old') - .1, G('four-year-old') + .5) * (1 - lift), { size: 26, align: 'center', col: CREAM });
    // the race to figure it out: the child first, OFTEN
    const rx = 260, fx = 940;
    K.cap(ctx, 'FIGURING OUT HOW IT WORKS', rx, 150, span(t, G('the child often') - .4, G('the child often') + .3), { size: 26, col: CREAM });
    if (race > 0) {
      ctx.save(); ctx.setLineDash([6, 8]); ctx.strokeStyle = rgba(CREAM, .5 * clamp(race * 3)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fx, 180); ctx.lineTo(fx, 320); ctx.stroke(); ctx.restore();
      K.bar(ctx, rx + 130, 216, (fx - rx - 130) * sineIO(span(race, 0, .85)), 1, GOLD, { th: 24 });
      K.bar(ctx, rx + 130, 282, (fx - rx - 130) * .7 * sineIO(span(race, .05, 1)), 1, LILAC, { th: 24, glow: .3 });
      K.cap(ctx, 'AGE 4', rx + 110, 225, race, { size: 22, align: 'right', col: GOLD.text }); K.cap(ctx, 'STUDENTS', rx + 110, 291, race, { size: 22, align: 'right', col: LILAC.text });
    }
    K.big(ctx, 'Often.', fx + 40, 240, 64, often, { align: 'left' });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6k a machine can hold every answer; a child still has to find things out
  a6k(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const hold = span(t, G('hold every') - .3, G('answer') + .6), find = span(t, G('find things') - .3, G('find things') + .6), fly = sineIO(span(t, S.a, S.a + 1.3));
    K.bg(ctx, t, { gx: lerp(960, 1250, fly), gy: 600, ga: .24, gcol: '#3a3a5a' });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.03, fx: 960, fy: 560 });
    ctx.fillStyle = K.lin(ctx, 0, 880, 0, H, [[0, '#18204e'], [1, '#080a24']]); ctx.fillRect(-100, 880, W + 200, 300);
    // left: the tablet as a box full of answers
    K.tablet(ctx, t, 560, 520, 470, 330, { lit: .55 + .45 * hold, content(c, x, y, w, h) { const n = 14 * 9; for (let k = 0; k < n; k++) { const e = span(hold, k / n * .8, k / n * .8 + .2); if (e <= 0) continue; const cx = x + 24 + (k % 14) * (w - 48) / 13, cy = y + 24 + Math.floor(k / 14) * (h - 48) / 8; c.fillStyle = rgba('#f4fdff', .85 * e); c.beginPath(); c.arc(cx, cy, 5 * e, 0, TAU); c.fill(); } } });
    K.cap(ctx, 'CAN HOLD EVERY ANSWER', 560, 760, span(hold, .1, .7), { size: 26, align: 'center', col: MACH.heartCore });
    // right: your child with the toy; it turns, lights, the child finds out
    const hands = K.kid(ctx, 1330, 882, 320, { age: 6, dir: -1, look: .35 + .15 * find, light: -1, armR: [1.1, 1.9], armL: [.9, 1.7] });
    const hx = (hands.R[0] + hands.L[0]) / 2, hy = Math.min(hands.R[1], hands.L[1]) - 16;
    const px = lerp(S.in[0], hx, fly), py = lerp(S.in[1], hy, fly) - Math.sin(Math.PI * fly) * 80;
    toyBox(ctx, t, px, py, 28, Math.sin(t * 1.3) * .5, .55 + .45 * Math.max(find, .4 + .3 * Math.sin(t * 2.2) ** 2));
    K.cap(ctx, 'HAS TO FIND THINGS OUT', 1300, 470, find, { size: 26, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6l a child needs a person who cares (scene)
  a6l(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const turn = sineIO(span(t, G('needs') - .6, G('needs') + .3)), hand = sineIO(span(t, G('a person') - .3, G('person who') + .5)), warm = span(t, G('who cares') - .3, G('who cares') + .9);
    ctx.fillStyle = '#070a22'; ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 1000, fy: 640 });
    room(ctx, { floor: 860, wall: ['#0b1036', '#151c4c'] });
    halo(ctx, 1030, 640, 380, .14 + .3 * warm, GOLD.halo, GOLD.core);
    // the tablet on a low stool (left), dim
    ctx.fillStyle = '#1b2147'; ctx.fillRect(560, 760, 140, 100); K.tablet(ctx, t, 630, 720, 150, 100, { lit: .55 - .3 * turn, rot: .05 });
    // the child turns from the tablet to you; your hand on the shoulder
    ctx.save(); ctx.translate(960, 0); ctx.scale(Math.cos(Math.PI * turn) || .01, 1); ctx.translate(-960, 0);
    K.kid(ctx, 960, 862, 280, { age: 6, dir: -1, look: lerp(.1, .45, turn), light: 1, rim: warm > .4 ? GOLD.hot : undefined });
    ctx.restore();
    E.du(ctx, 1120, 862, 440, { dir: -1, look: .05, light: 1, back: .3 * warm, armR: [lerp(.15, .66, hand), lerp(.1, .62, hand)] });
    K.serif(ctx, 'A person who cares.', 1000, 250, 74, span(t, G('a person') - .2, G('a person') + .6), { align: 'center', col: '#fff6d8' });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a6m children learn from each other · what if the best friend is the machine?
  a6m(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const each = span(t, G('from each other') - .3, G('each other') + .5), grow = sineIO(span(t, G('by twelve') - .3, G('twelve') + .7)), bf = sineIO(span(t, G('best friend') - .6, G('machine') + .3)), ask = span(t, G('best friend') - .2, G('best friend') + .6);
    ctx.fillStyle = '#060920'; ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 1000, fy: 520 });
    room(ctx, { floor: 860, wall: ['#080c2e', '#10164a'] });
    // the window: outside, children play under a street lamp
    const wx = 1000, wy = 170, ww = 760, wh = 470, g = expoOut(span(t, S.a, S.a + .7));
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    ctx.fillStyle = K.lin(ctx, 0, wy, 0, wy + wh, [[0, K.SKY.top], [.7, K.SKY.mid], [1, K.SKY.low]]); ctx.fillRect(wx, wy, ww, wh); E.stars(ctx, 51, 30, t, [wx, wy, ww, wh * .5], .7);
    ctx.fillStyle = '#121a48'; ctx.fillRect(wx, wy + wh - 70, ww, 70);
    const lx = 1640; ctx.fillStyle = '#0a0f30'; ctx.fillRect(lx - 4, wy + 120, 8, wh - 190); halo(ctx, lx, wy + 116, 180, .45 * g, '#f2c46a', '#fff4cf'); ctx.fillStyle = '#fff2c4'; ctx.beginPath(); ctx.arc(lx, wy + 116, 9, 0, TAU); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, lx, wy + wh - 60, 380, [[0, rgba('#ffd98a', .2)], [1, rgba('#ffd98a', 0)]]); ctx.fillRect(wx, wy + wh - 200, ww, 200); ctx.restore();
    const gy = wy + wh - 62, ph = t * 5.5;
    E.person(ctx, 1180 + Math.sin(t * .8) * 40, gy, 120, { head: 1.4, dir: 1, walk: ph, light: 1 });
    E.person(ctx, 1330 + Math.sin(t * .8 + 1) * 30, gy - Math.abs(Math.sin(t * 3)) * 18, 112, { head: 1.4, dir: -1, pose: 'lift', light: 1 });
    E.person(ctx, 1470, gy, 118, { head: 1.4, dir: -1, walk: ph + 2, light: 1 });
    E.person(ctx, 1560, gy, 108, { head: 1.4, dir: -1, look: .3, light: 1, armR: [2.2, 2.4] });
    const bq = (t * .55) % 1; ctx.fillStyle = '#e8d29a'; ctx.beginPath(); ctx.arc(lerp(1260, 1520, bq), gy - 90 - Math.sin(Math.PI * bq) * 110, 11, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#0a0f30'; ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh); ctx.strokeStyle = '#1c2766'; ctx.lineWidth = 16; ctx.strokeRect(wx - 8, wy - 8, ww + 16, wh + 16);
    K.cap(ctx, 'FROM EACH OTHER', wx + ww / 2, wy + wh + 50, each, { size: 26, align: 'center', col: GOLD.text });
    // inside: your child by the tablet, grows toward twelve; the tablet's light lifts off and becomes a soft glow beside the child
    const kh = lerp(290, 350, grow);
    ctx.fillStyle = '#1b2147'; ctx.fillRect(400, 790, 170, 70); K.tablet(ctx, t, 485, 760, 130, 84, { lit: 1 - .7 * bf, rot: .04 });
    K.kid(ctx, 700, 862, kh, { age: 10, head: lerp(1.36, 1.18, grow), dir: 1, look: lerp(.35, .25, bf), light: 1, back: .25 });
    if (bf > 0) { const x = lerp(485, 960, bf), y = lerp(740, 440, bf) - Math.sin(Math.PI * bf) * 60, br = 1 + .06 * Math.sin(t * 1.6);
      halo(ctx, x, y, 200 * br * (.4 + .6 * bf), .45 * bf, MACH.heart, MACH.heartCore); halo(ctx, x, y, 50 * br, .6 * bf, MACH.heart, '#ffffff'); }
    K.serif(ctx, 'Best friend?', 960, 300, 80, ask, { align: 'center', col: CREAM });
    ctx.restore();
  },

  C1: K.clipShot('C1'),   // ORIGINAL FOOTAGE plate grows out of S.in (the toy's light) and back (lower third from K.CLIPS)
};
