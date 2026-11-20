// Film 02 "The Curve You Can't See": shot list anchored to the recorded VO (timing.json word times).
import fs from 'node:fs';
import {
  W, H, C, rgba, clamp, lin, mix, sm, eio, eout, sine, drift, prng, img, canvas, glow, addGlow, sky, fog,
  drawPlate, mapper, camPath, standFigure, walkFigure, text, label, stamp, glowLine, samples, Film,
} from './engine.mjs';
import * as M from './scenes/md.mjs';

const ROOT = '/mnt/project-files/scenario/film-02-exponential/';
const PLATES = ROOT + 'plates/';
const IW = 2752, IH = 1536;

// ---------- VO timing ----------
const TM = JSON.parse(fs.readFileSync(ROOT + 'audio/timing.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
function find(sec, phrase, nth = 0) {
  const ws = TM.words.filter((w) => w.sec === sec), q = phrase.split(/\s+/).map(norm).filter(Boolean);
  let hit = 0;
  for (let i = 0; i + q.length <= ws.length; i++) {
    if (q.every((p, j) => (j === q.length - 1 ? norm(ws[i + j].w).startsWith(p) : norm(ws[i + j].w) === p))) { if (hit++ === nth) return { s: ws[i].s, e: ws[i + q.length - 1].e }; }
  }
  throw new Error(`phrase not found in ${sec}: "${phrase}"`);
}
const S = (sec, phrase, nth) => find(sec, phrase, nth).s;   // start of phrase
const E = (sec, phrase, nth) => find(sec, phrase, nth).e;   // end of phrase
const SEC = TM.sections;

// ---------- assets ----------
const PL = {};
async function loadPlate(id) {
  const d = PLATES + id + '/';
  if (!fs.existsSync(d + 'far.png')) return null;
  const p = { far: await img(d + 'far.png'), near: fs.existsSync(d + 'near.png') ? await img(d + 'near.png') : null, sp: {} };
  for (const f of fs.readdirSync(d)) if (/^sprite_.*\.png$/.test(f)) p.sp[f.slice(7, -4)] = await img(d + f);
  return p;
}
let UPPER; // walking "you": amber hooded coat upper body (flagship sprite, read only)

// ---------- plate shot ----------
// o: { cam: [{x,y,z},{x,y,z}], pf (far parallax), dolly, mid(ctx,t,m) figures behind near, front(ctx,t,m) on near ground,
//      fx(ctx,t,cam,s) screen overlays, fogAmt, ease }
function clampCam(c, pf, dolly) {
  const z = Math.max(c.z, 1.04), kN = (H / IH) * z * (1 + dolly * .5), kF = (H / IH) * z * (1 + dolly * (pf - .5));
  const lim = (k, axis) => (axis === 'x' ? IW - W / k : IH - H / k) / 2;
  const lx = Math.min(lim(kN, 'x'), lim(kF, 'x') / pf), ly = Math.min(lim(kN, 'y'), lim(kF, 'y') / pf);
  return { x: clamp(c.x, IW / 2 - lx, IW / 2 + lx), y: clamp(c.y, IH / 2 - ly, IH / 2 + ly), z };
}
const plate = (id, o = {}) => Object.assign((ctx, t, s) => drawPlateShot(id, o, ctx, t, s), { pid: id, walk: !!o.walk });
function drawPlateShot(id, o, ctx, t, s) {
  const P = PL[id];
  if (!P) { sky(ctx, t, {}); text(ctx, id, W / 2, H / 2, { size: 40, align: 'center', color: C.muted }); return; }
  const pf = o.pf ?? .4, dolly = o.dolly ?? .1;
  const cam = clampCam(camPath(t, s.a, s.b, o.cam || [{ x: IW / 2, y: IH / 2, z: 1.1 }, { x: IW / 2, y: IH / 2, z: 1.18 }], o.ease), pf, dolly);
  const L = [{ im: P.far, p: pf, after: o.mid ? (c) => o.mid(c, t, mapper(cam, pf, { dolly }), P, s) : null }];
  if (P.near) L.push({ im: P.near, p: 1, after: o.front ? (c) => o.front(c, t, mapper(cam, 1, { dolly }), P, s) : null });
  drawPlate(ctx, L, cam, { dolly });
  if (o.fogAmt) fog(ctx, t, { amt: o.fogAmt, y0: o.fogY0 ?? .5, hex: o.fogHex });
  if (o.fx) o.fx(ctx, t, cam, s, P);
}
// figure helpers in image coordinates (m = mapper of the layer the figure stands on)
const stand = (name, x, y, h, o = {}) => (ctx, t, m, P) => { const sp = P.sp[name] || (name === 'you_back' && PL.p03_hill_night?.sp.you_back); if (sp) standFigure(ctx, sp, m.X(x), m.Y(y), h * m.k, t, o); };
const walker = (x0, x1, y0, y1, h, a, b, o = {}) => (ctx, t, m) => {
  const u = lin(a, b, t), x = mix(x0, x1, u), y = mix(y0, y1, u), hh = h * (o.h1 ? mix(1, o.h1, u) : 1);
  walkFigure(ctx, UPPER, m.X(x), m.Y(y), hh * m.k, Math.abs(x - x0) * 240 / hh + (t - a) * (o.inPlace || 0), t, { flip: x1 < x0, phoneGlow: o.phone ?? true });
};
const both = (...fs) => (...a) => fs.forEach((f) => f && f(...a));
const lampFlicker = (x, y, r, col = C.amber, core = '#fff3dd', p = 1) => (ctx, t, cam) => {
  const m = mapper(cam, p, { dolly: .1 }); addGlow(ctx, m.X(x), m.Y(y), r * m.k, .22 + .05 * Math.sin(t * 2.3) + .03 * Math.sin(t * 7.1), col, core);
};

// ---------- extra motion-design scenes ----------
// the line in the night sky above the valley (hook: "the moment the curve bends upward")
const skyCurve = (t0, dur, col = C.cyan) => (ctx, t, cam) => {
  const m = mapper(cam, .4, { dolly: .1 });
  const pts = samples((v) => [m.X(mix(1150, 2550, v)), m.Y(1000 - (Math.pow(2, v * 6) - 1) / 63 * 820)], 0, 1, 140);
  glowLine(ctx, pts, eio(lin(t0, t0 + dur, t)), { color: col, width: 3, glowW: 20, alpha: .9 });
};
// "Stand in 1990 ... 2010 ... here": a figure on the curve; the view always renormalises to a wall ahead
const standOnCurve = (stops) => (ctx, t, s) => {
  sky(ctx, t, { stars: .45 });
  let k = 0; while (k < stops.length - 1 && t > stops[k + 1].t) k++;
  const nx = stops[k + 1], u = nx ? eio(lin(nx.t - .2, nx.t + 1.4, t)) : 0;
  const yr = mix(stops[k].yr, nx ? nx.yr : stops[k].yr, u), L = 24, end = yr + 4, T = 2.2;
  const x0 = 200, x1 = 1720, y0 = 900, y1 = 150, X = (y) => mix(x0, x1, (y - (end - L)) / L);
  const f = (y) => Math.pow(2, (y - end) / T), Y = (y) => y0 - f(y) * (y0 - y1);
  const pts = samples((y) => [X(y), Y(y)], end - L, end, 200);
  glowLine(ctx, pts, eio(lin(s.a, s.a + 1.6, t)), { width: 5, glowW: 26, head: false });
  for (let y = Math.ceil((end - L) / 10) * 10; y <= end; y += 10) text(ctx, String(y), X(y), y0 + 50, { size: 30, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: .8 });
  const a = lin(s.a + .8, s.a + 1.6, t), fx = X(yr), fy = Y(yr);
  addGlow(ctx, fx, fy, 70, .5 * a, C.amber, '#fff3dd');
  if (PL.p03_hill_night?.sp.you_back) standFigure(ctx, PL.p03_hill_night.sp.you_back, fx, fy + 4, 120 * a + .01, t, { flip: true });
  text(ctx, stops[k].label ?? String(Math.round(yr)), fx, fy - 150, { size: 54, font: 'Instrument Serif', align: 'center', alpha: a * (1 - u) + (nx ? 0 : 0) });
  if (nx) text(ctx, nx.label ?? String(nx.yr), fx, fy - 150, { size: 54, font: 'Instrument Serif', align: 'center', alpha: a * u });
  label(ctx, t, s.a + 2, 240, 250, 'behind you', 'flat', { color: C.cream });
  label(ctx, t, s.a + 2.8, x1 - 40, 250, 'ahead', 'a wall', { align: 'right', color: C.cream });
};
// "run it backwards": the share that is lit halves every 7 months back in time (overlay on the top-down city)
const backwards = (beats) => (ctx, t) => {
  let i = 0; while (i < beats.length - 1 && t > beats[i + 1].t) i++;
  const b = beats[i], nb = beats[i + 1], frac = nb ? Math.exp(mix(Math.log(b.f), Math.log(nb.f), eio(lin(nb.t - .3, nb.t + .9, t)))) : b.f;
  const r = prng(17), N = 1400;
  ctx.fillStyle = 'rgba(7,9,24,.35)'; ctx.fillRect(0, 0, W, H);
  for (let j = 0; j < N; j++) {
    const x = r() * W, y = r() * H, q = r(); if (q > frac) continue;
    addGlow(ctx, x, y, 14, .7, C.amber, '#fff3dd');
  }
  const cur = nb && t > nb.t - .3 ? nb : b, a = lin(beats[0].t, beats[0].t + .6, t);
  ctx.fillStyle = 'rgba(7,9,24,.6)'; ctx.fillRect(70, 60, 560, 190);
  text(ctx, cur.top.toUpperCase(), 100, 120, { size: 20, weight: 600, color: C.muted, spacing: 6, alpha: a });
  text(ctx, cur.big, 100, 210, { size: 84, font: 'Instrument Serif', color: C.amber, alpha: a });
};
// "walked them through how doubling works, step by step": doubling bars vs. the straight-line guess
const doublingSteps = (tGuess) => (ctx, t, s) => {
  sky(ctx, t, { stars: .35 });
  const n = 10, x0 = 300, x1 = 1620, y0 = 900, top = 180, bw = (x1 - x0) / n * .6;
  for (let i = 0; i < n; i++) {
    const born = s.a + .6 + i * .55, a = eout(lin(born, born + .45, t)); if (a <= 0) continue;
    const h = Math.pow(2, i) / Math.pow(2, n - 1) * (y0 - top), x = mix(x0, x1, (i + .5) / n);
    ctx.fillStyle = rgba(i === n - 1 ? C.cyanWhite : C.cyan, .75 * a); ctx.fillRect(x - bw / 2, y0 - Math.max(2, h * a), bw, Math.max(2, h * a));
    text(ctx, String(Math.pow(2, i)), x, y0 - h * a - 18, { size: 30, font: 'Instrument Serif', align: 'center', alpha: a * .9 });
  }
  const g = eio(lin(tGuess, tGuess + 1.6, t));
  if (g > 0) {
    ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = rgba(C.amber, .9); ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(x0, y0 - 4); ctx.lineTo(mix(x0, x1, g), y0 - 4 - g * 120); ctx.stroke(); ctx.restore();
    label(ctx, t, tGuess + 1.2, x0 + 20, y0 - 190, 'the straight-line guess', '', { color: C.amber });
  }
  text(ctx, 'Lammers, Crusius & Gast, 2020', W - 80, H - 50, { size: 18, color: C.muted, align: 'right', alpha: .7 });
};
// a single question, set big
const card = (line1, line2, o = {}) => (ctx, t, s) => {
  sky(ctx, t, { stars: .55, warm: o.warm || 0 });
  if (o.curve) glowLine(ctx, samples((v) => [mix(300, 1620, v), 900 - (Math.pow(2, v * 7) - 1) / 127 * 700], 0, 1, 120), eio(lin(s.a, s.a + 2.5, t)), { width: 3, glowW: 16, alpha: .45 });
  const a = eout(lin(s.a + .3, s.a + 1.2, t)) * (1 - lin(s.b - .6, s.b, t)), dy = (1 - a) * 20;
  text(ctx, line1, W / 2, H / 2 + (line2 ? -10 : 30) + dy, { size: o.size || 96, font: 'Instrument Serif', align: 'center', alpha: a });
  if (line2) text(ctx, line2, W / 2, H / 2 + 80 + dy, { size: o.size2 || 56, font: 'Instrument Serif Italic', color: o.col2 || C.cyan, align: 'center', alpha: eout(lin(o.t2 ?? s.a + 1.2, (o.t2 ?? s.a + 1.2) + .8, t)) * (1 - lin(s.b - .6, s.b, t)) });
};
// the same desk, both versions side by side
const split = (A, B, la, lb) => {
  const [ca, xa] = canvas(), [cb, xb] = canvas();
  return (ctx, t, s) => {
    xa.fillStyle = C.indigo; xa.fillRect(0, 0, W, H); A(xa, t, s); xb.fillStyle = C.indigo; xb.fillRect(0, 0, W, H); B(xb, t, s);
    const u = eio(lin(s.a, s.a + 1.4, t)), cx = mix(W, W / 2, u);
    ctx.drawImage(ca, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(cx, 0, W - cx, H); ctx.clip(); ctx.drawImage(cb, 0, 0); ctx.restore();
    ctx.fillStyle = rgba(C.cream, .5); ctx.fillRect(cx - 1, 0, 2, H);
    label(ctx, t, s.a + 1.2, W * .25, 140, 'we waited', '', { align: 'center' });
    label(ctx, t, s.a + 1.6, W * .75, 140, 'we read the curve', '', { align: 'center', color: C.amber });
  };
};

// ---------- shot sequencing ----------
// seq([[t, draw, kind, d], ...], end): shot i runs from its t to the next one's t (overlap d for the transition)
function seq(list, end) {
  return list.map(([t0, draw, kind = 'dissolve', d = 1, k], i) => {
    const nx = list[i + 1], b = nx ? nx[0] + (nx[3] ?? 1) / 2 : end, a = t0 - (i ? (d ?? 1) / 2 : 0);
    return { a, b, draw, k, out: { kind: nx ? (nx[2] ?? 'dissolve') : 'dissolve' }, _start: t0 };
  }).map((s, i, arr) => { const nx = arr[i + 1]; if (nx) s.b = Math.max(s.b, nx.a + .01); return s; });
}

export async function build() {
  const ids = fs.readdirSync(PLATES).filter((d) => /^p\d\d_/.test(d));
  for (const id of ids) PL[id] = await loadPlate(id);
  UPPER = await img('/mnt/project-files/scenario/folge-01-flagship/motion-test/upper.png');
  const C1 = (i) => [IW / 2, IH / 2, i];
  const cam = (x0, y0, z0, x1, y1, z1) => [{ x: x0, y: y0, z: z0 }, { x: x1, y: y1, z: z1 }];

  // ===== 1 Hook =====
  const tTitle = SEC['01'].end + .6;
  const L = [
    [0, plate('p01_desk1965', { cam: cam(1376, 800, 1.06, 1430, 1180, 1.75), fx: both(lampFlicker(1030, 800, 420, C.amber, '#fff3dd', 1), (c, t) => stamp(c, t, 1.4, '1965', 'California')) })],
    [S('01', 'Each dot showed'), M.graphPaper(), 'push', 1.2, { dots: S('01', 'Each dot showed') + .6, line: S('01', 'That number had been doubling'), ext: S('01', 'So Moore kept'), glow: S('01', "It's been sixty") }],
    [S('01', 'The biggest AI chip') - .4, M.climb({}), 'up', 1.2],
    [S('01', 'Chips like that'), plate('p02_dc_ext', { cam: cam(1100, 900, 1.25, 1500, 860, 1.4), front: walker(300, 900, 1100, 1180, 300, S('01', 'Chips like that'), E('01', 'exists at all') + 3), fx: lampFlicker(580, 990, 160) }), 'dissolve', 1.2],
    [S('01', 'And now everyone says'), plate('p03_hill_night', { cam: cam(1300, 900, 1.15, 1450, 650, 1.32), front: stand('you_back', 900, 1150, 330, { flip: true }), fx: skyCurve(S('01', 'The moment the curve'), 3) }), 'fog', 1.6],
    [tTitle, M.title('The Curve', 'you can’t see'), 'up', 1.4],
  ];
  // ===== 2 Why we miss it =====
  L.push([SEC['02'].start - .4, M.rampVsCurve(), 'dissolve', 1.2, { curve: S('02', 'In nineteen seventy-five'), guess: S('02', 'Often two thirds') }]);
  // ===== 3 Forecasters and the sun =====
  L.push(
    [S('03', 'Every year, the International'), plate('p07_paris', { cam: cam(1550, 760, 1.5, 1450, 700, 1.22), fx: both(lampFlicker(1550, 715, 120, C.cyan, C.cyanWhite, .4), (c, t) => stamp(c, t, S('03', 'International') , 'Paris', 'International Energy Agency')) }), 'left', 1.2],
    [S('03', 'For more than a decade'), M.forecastFan(), 'dissolve', 1, { fan: S('03', 'For more than a decade') + 1.2 }],
    [S('03', 'Solar runs on a loop') - .3, M.learningLoop(), 'push', 1.2, { price: S('03', 'Since the seventies') }],
  );
  // ===== 4 Loops behind AI =====
  L.push(
    [SEC['04'].start - .3, plate('p08_dc_int', { cam: cam(1380, 1000, 1.12, 1380, 960, 1.45), dolly: .25, front: walker(1300, 1420, 1500, 1260, 520, SEC['04'].start - .3, S('04', 'The computing power') + 1, { h1: .55 }) }), 'dissolve', 1.2],
    [S('04', 'The computing power') - .2, M.stackedLoops(), 'push', 1.2, { l1: S('04', 'The computing power'), l2: S('04', 'Running them'), l3: S('04', 'And the tasks AI'), l4: 1e9 }],
  );
  // ===== 5 No knee =====
  L.push(
    [SEC['05'].start - .3, plate('p09_mountain', { cam: cam(1376, 700, 1.1, 1376, 500, 1.3), fx: lampFlicker(1590, 1060, 60, C.amber, '#fff3dd', .4) }), 'up', 1.4],
    [S('05', 'Draw any of these'), M.noKnee(), 'dissolve', 1, { cut: S('05', 'Now cut the chart'), log: S('05', 'On a true exponential') + 1.5 }],
    [S('05', 'Stand in nineteen ninety') - .3, standOnCurve([{ t: S('05', 'Stand in nineteen ninety'), yr: 1990 }, { t: S('05', 'Stand in twenty ten'), yr: 2010 }, { t: S('05', 'Stand here'), yr: 2026, label: 'here' }]), 'dissolve', 1],
    [S('05', 'So everyone who lives') - .2, plate('p04_gen1890', { cam: cam(1500, 700, 1.2, 1700, 520, 1.42), fx: both(lampFlicker(1950, 260, 260, C.cyan, C.cyanWhite, 1), (c, t) => stamp(c, t, S('05', 'So everyone who lives'), '1890s', 'the electric light')) }), 'fog', 1.4],
    [S('05', 'like this feels') , plate('p05_gen1969', { cam: cam(1816, 600, 1.35, 1500, 760, 1.18), fx: (c, t) => stamp(c, t, S('05', 'like this feels'), '1969', 'the television') }), 'left', 1],
    [S('05', 'the turning point', 1) - .1, plate('p06_gen2026', { cam: cam(1300, 860, 1.2, 1450, 820, 1.4), fx: both(lampFlicker(690, 665, 140), (c, t) => stamp(c, t, S('05', 'the turning point', 1), '2026', 'the phone')) }), 'left', 1],
    [S('05', 'And that feeling'), plate('p03_hill_night', { cam: cam(1000, 1000, 1.5, 1250, 860, 1.25), front: stand('you_back', 900, 1150, 330, { flip: true }) }), 'dissolve', 1.2],
    [S('05', 'What does tell you'), M.twoRates(), 'dissolve', 1, { us: S('05', 'how many doublings') }],
  );
  // ===== 6 Fair objection =====
  L.push(
    [SEC['06'].start - .3, plate('p09_mountain', { cam: cam(1700, 1100, 1.5, 1376, 800, 1.15), front: walker(2200, 1950, 1490, 1380, 260, SEC['06'].start, S('06', 'No real curve') + 2) }), 'dissolve', 1.2],
    [S('06', 'No real curve'), (ctx, t, s) => {
      M.sCurve()(ctx, t, s);
      label(ctx, t, S('06', 'Moore himself'), 240, 260, 'Moore, 1975', 'doubling every 2 years', { fade: 4 });
      label(ctx, t, S('06', 'Researchers at Epoch'), 240, 260, 'Epoch AI', 'human text used up by ~2032?', { fade: 5 });
      label(ctx, t, S('06', 'Even solar is cooling'), 240, 260, 'solar installs', '+33 % in 2024, +10 % in 2025', { fade: 5 });
    }, 'push', 1.2, { s: S('06', 'In nature, every exponential') }],
    [S('06', 'The solar forecasters'), plate('p07_paris', { cam: cam(1300, 700, 1.2, 1600, 700, 1.35), fx: lampFlicker(1550, 715, 120, C.cyan, C.cyanWhite, .4) }), 'dissolve', 1],
    [S('06', 'And even a curve'), plate('p19_pylons', { cam: cam(1100, 900, 1.3, 1700, 850, 1.2), fx: lampFlicker(810, 400, 80, C.amber, '#fff3dd', .4) }), 'right', 1.2],
  );
  // ===== 7 Fork =====
  const b7 = [
    { t: S('07', 'So try this'), f: 1, top: 'doubling every', big: '7 months' },
    { t: S('07', 'Seven months before'), f: .5, top: '7 months before', big: 'half' },
    { t: S('07', 'Fourteen months before'), f: .25, top: '14 months before', big: 'a quarter' },
    { t: S('07', 'About four years before'), f: .008, top: '4 years before', big: 'under 1 %' },
  ];
  L.push(
    [SEC['07'].start - .3, plate('p10_city_top', { cam: cam(1376, 768, 1.1, 1300, 700, 1.3), pf: 1, fx: backwards(b7) }), 'down', 1.4],
    [S('07', 'So that\'s the fork'), plate('p03_hill_night', { cam: cam(1376, 900, 1.2, 1250, 800, 1.4), front: stand('you_back', 900, 1150, 330, { flip: true }) }), 'dissolve', 1.4],
  );
  // ===== 8 Two endings =====
  L.push(
    [SEC['08'].start - .4, plate('p13_lahore_roof', { cam: cam(1800, 600, 1.3, 1376, 768, 1.12), fx: (c, t) => stamp(c, t, SEC['08'].start + .3, '2035', 'Lahore · a scenario', { dur: 6 }) }), 'fog', 1.6],
    [S('08', 'A student in Lahore'), plate('p11_desk2035_night', { cam: cam(1300, 900, 1.15, 1150, 950, 1.45), fx: both(lampFlicker(1100, 950, 220, C.cyan, C.cyanWhite), lampFlicker(490, 720, 140)) }), 'dissolve', 1.2],
    [S('08', 'Her school banned'), plate('p21_school_gate', { cam: cam(1376, 800, 1.2, 1376, 820, 1.4) }), 'dissolve', 1],
    [S('08', "from a cousin's phone") - .4, plate('p22_stairs_phone', { cam: cam(1376, 900, 1.35, 1376, 820, 1.2), front: stand('two_teens', 950, 1340, 460, { sway: .5 }), fx: lampFlicker(1010, 790, 200) }), 'dissolve', 1],
    [S('08', 'Nothing exploded'), plate('p11_desk2035_night', { cam: cam(1150, 950, 1.5, 1376, 800, 1.1), fx: lampFlicker(1100, 950, 220, C.cyan, C.cyanWhite) }), 'dissolve', 1.2],
    [S('08', 'Same desk'), plate('p12_desk2035_dawn', { cam: cam(1376, 800, 1.1, 1300, 860, 1.3), fx: lampFlicker(1990, 560, 300, C.amber, '#fff3dd', .4) }), 'flash', 1],
    [S('08', 'She learns from'), plate('p13_lahore_roof', { cam: cam(900, 1050, 1.5, 1000, 950, 1.3), front: stand('girl', 800, 1320, 330, { sway: .5 }), fx: (c, t, cam) => { const m = mapper(cam, 1, { dolly: .1 }); addGlow(c, m.X(860), m.Y(1180), 60 * m.k, .35 + .05 * Math.sin(t * 2), C.cyan); } }), 'dissolve', 1.2],
    [S('08', "Her doctor's newest"), plate('p14_clinic', { cam: cam(1500, 900, 1.3, 1600, 860, 1.45), front: stand('doctor', 1650, 1430, 640) }), 'right', 1.2],
    [S('08', 'And when an AI model crossed'), plate('p17_core_hall', { cam: cam(1380, 830, 1.15, 1380, 830, 1.4), dolly: .2, fx: (c, t, cam) => { const m = mapper(cam, .4, { dolly: .2 }); const x = S('08', 'its extra safeguards'); addGlow(c, m.X(1380), m.Y(830), 380 * m.k, .25 + .45 * Math.exp(-Math.max(0, t - x) * .8) * (t > x ? 1 : 0), C.amber, '#fff3dd'); } }), 'push', 1.2],
    [S('08', 'Look at what'), split(plate('p11_desk2035_night', { cam: cam(1376, 900, 1.2, 1300, 900, 1.3) }), plate('p12_desk2035_dawn', { cam: cam(1376, 900, 1.2, 1300, 900, 1.3) })), 'dissolve', 1],
    [S('08', 'The only thing'), plate('p20_hill_dawn', { cam: cam(1250, 900, 1.3, 1600, 800, 1.18), front: stand('you_back', 900, 1150, 330, { flip: true }) }), 'fog', 1.6],
  );
  // ===== 9a Read it =====
  L.push(
    [SEC['09a'].start - .4, card('How we get there', '', { size: 110 }), 'up', 1.4],
    [S('09a', 'Learn to read'), plate('p26_classroom', { cam: cam(1376, 760, 1.15, 1376, 700, 1.35) }), 'dissolve', 1],
    [S('09a', 'In March twenty twenty'), plate('p15_balcony2020', { cam: cam(1900, 1000, 1.4, 1700, 900, 1.25), front: stand('balcony', 2050, 1345, 520, { sway: .6 }), fx: (c, t) => stamp(c, t, S('09a', 'In March'), 'March 2020', 'the pandemic begins') }), 'dissolve', 1.2],
    [S('09a', 'Then they walked'), doublingSteps(S('09a', 'Back in the seventies') - 6), 'push', 1.2],
    [S('09a', 'And knowing still'), plate('p26_classroom', { cam: cam(1250, 1000, 1.4, 1400, 900, 1.2), front: stand('student', 1380, 1440, 700, { sway: .5 }) }), 'dissolve', 1],
    [S('09a', 'ask one question') - .2, card('How long does it take', 'to double?', { size: 96, size2: 96, t2: S('09a', 'to double') - .3, curve: 1 }), 'dissolve', 1],
  );
  // ===== 9b Wire it =====
  L.push(
    [SEC['09b'].start - .4, plate('p02_dc_ext', { cam: cam(1600, 900, 1.35, 1100, 950, 1.2), front: walker(1700, 1100, 1250, 1130, 300, SEC['09b'].start - .4, S('09b', 'In twenty twenty-four')) }), 'right', 1.2],
    [S('09b', 'In twenty twenty-four'), plate('p16_seoul', { cam: cam(1376, 800, 1.15, 1700, 700, 1.4), fx: (c, t) => stamp(c, t, S('09b', 'In twenty twenty-four'), '2024', 'Seoul · 16 AI companies') }), 'dissolve', 1.2],
    [S('09b', 'Each would publish'), M.tripwire(), 'push', 1.2, { cross: S('09b', 'In May') + 3 }],
    [S('09b', 'In May twenty twenty-five'), plate('p23_lab_night', { cam: cam(1376, 800, 1.15, 1300, 760, 1.35), front: stand('researcher', 1620, 1140, 740, { flip: true }), fx: (c, t) => stamp(c, t, S('09b', 'In May'), 'May 2025', 'Anthropic') }), 'dissolve', 1.2],
    [S('09b', "It hadn't proven"), M.tripwire(), 'dissolve', 1, { cross: S('09b', 'So it launched') }],
    [S('09b', 'The catch is'), plate('p23_lab_night', { cam: cam(1100, 760, 1.4, 1500, 800, 1.2) }), 'dissolve', 1.2],
    [S('09b', 'Which is why'), plate('p24_parliament', { cam: cam(1376, 900, 1.15, 1376, 700, 1.4) }), 'up', 1.4],
  );
  // ===== 9c Point it =====
  L.push(
    [SEC['09c'].start - .4, plate('p17_core_hall', { cam: cam(1380, 900, 1.4, 1380, 830, 1.15) }), 'dissolve', 1.2],
    [S('09c', 'For fifty years'), M.proteinMap(), 'push', 1.2, { fold: S('09c', 'Then an AI called'), world: S('09c', 'More than two million') }],
    [S('09c', "A map isn't"), plate('p14_clinic', { cam: cam(1700, 760, 1.35, 1450, 800, 1.2), front: stand('doctor', 1650, 1430, 640) }), 'dissolve', 1.2],
  );
  // ===== 9d Share it =====
  L.push(
    [SEC['09d'].start - .4, plate('p19_pylons', { cam: cam(1700, 850, 1.2, 1100, 880, 1.35), fx: lampFlicker(810, 400, 80, C.amber, '#fff3dd', .4) }), 'left', 1.2],
    [S('09d', 'Remember the solar loop'), plate('p18_bazaar', { cam: cam(1500, 900, 1.1, 1600, 950, 1.35), pf: .7, fx: (c, t) => M.importBars(c, t, S('09d', 'seventeen gigawatts') - .8) }), 'dissolve', 1.2],
    [S('09d', 'Mostly for rooftops'), plate('p25_roof_panel', { cam: cam(1376, 820, 1.2, 1200, 860, 1.38), front: both(stand('father', 1250, 1420, 650, { sway: .7 }), stand('child', 2080, 1450, 380)), fx: lampFlicker(1755, 1270, 90) }), 'dissolve', 1.2],
    [S('09d', "It's messy"), plate('p19_pylons', { cam: cam(900, 700, 1.4, 1376, 800, 1.18) }), 'dissolve', 1.2],
    [S('09d', 'AI is getting cheaper'), plate('p13_lahore_roof', { cam: cam(1100, 950, 1.2, 1300, 850, 1.38), front: stand('girl', 800, 1320, 330, { sway: .5 }) }), 'dissolve', 1.2],
  );
  // ===== 10 Your part =====
  const tEnd = TM.duration;
  L.push(
    [SEC['10'].start - .4, plate('p01_desk1965', { cam: cam(1376, 1000, 1.25, 1430, 1180, 1.7), fx: lampFlicker(1030, 800, 420, C.amber, '#fff3dd', 1) }), 'fog', 1.6],
    [S('10', 'He measured'), M.graphPaper(), 'push', 1.2, { dots: S('10', 'He measured') - 1.5, line: S('10', 'He measured') - .5, ext: S('10', 'took his own') - .5, glow: S('10', 'We can do') }],
    [S('10', 'Ask how fast'), M.twoRates(), 'dissolve', 1, { us: S('10', 'Ask how fast') + 1 }],
    [S('10', 'Try the tools'), plate('p26_classroom', { cam: cam(1376, 900, 1.3, 1450, 900, 1.15), front: stand('student', 1380, 1440, 700, { sway: .5 }) }), 'left', 1],
    [S('10', 'And ask the people'), plate('p24_parliament', { cam: cam(1376, 800, 1.35, 1376, 900, 1.15) }), 'left', 1],
    [S('10', 'One day'), plate('p03_hill_night', { cam: cam(1250, 900, 1.25, 1600, 600, 1.3), front: stand('you_back', 900, 1150, 330, { flip: true }), fx: skyCurve(S('10', 'One day') + .5, 3.5) }), 'fog', 1.6],
    [S('10', "Let's make sure") - .3, plate('p20_hill_dawn', { cam: cam(1600, 800, 1.2, 1900, 900, 1.38), front: stand('you_back', 900, 1150, 330, { flip: true }), fx: skyCurve(S('10', "Let's make sure"), 2.5, C.amber) }), 'dissolve', 2],
    [S('10', "What's one thing") - .2, card('From “never” to “everywhere”', 'What have you watched make that jump?', { size: 92, size2: 46, col2: C.cream }), 'dissolve', 1.4],
    [E('10', 'in the comments') + 1.2, M.title('The Curve', 'you can’t see'), 'dissolve', 1.6],
  );
  const film = new Film(seq(L, tEnd), { grainAmt: .05 });
  film.sound = soundPlan(film.shots, [
    { f: 'lamp', t: .4, v: .8 },
    { f: 'pencil', t: S('01', 'That number had been') - .5, v: .7 },
    { f: 'chime', t: S('01', "It's been sixty") - .3, v: .6 },
    { f: 'chime', t: tTitle + .3, v: .7 },
    { f: 'chime', t: S('05', 'On a true exponential') + 1.4, v: .5 },
    { f: 'tick', t: SEC['07'].start - .3, d: SEC['07'].end - SEC['07'].start, v: .45, loop: 1 },
    { f: 'tone', t: S('08', 'its extra safeguards'), v: .6 },
    { f: 'tone', t: S('09b', 'So it launched'), v: .6 },
    { f: 'lamp', t: SEC['10'].start, v: .6 },
    { f: 'pencil', t: S('10', 'He measured') - .5, v: .6 },
    { f: 'chime', t: S('10', 'We can do'), v: .5 },
    { f: 'bloom', t: S('10', "Let's make sure"), v: .6 },
    { f: 'chime', t: E('10', 'in the comments') + 1.4, v: .7 },
  ]);
  return film;
}

// ---------- sound plan: ambience per plate, a whoosh per motion transition, plus hand-placed accents ----------
const AMB = {
  p01_desk1965: ['amb_hill', .25], p02_dc_ext: ['amb_hill', .4], p03_hill_night: ['amb_hill', .5], p20_hill_dawn: ['amb_dawn', .45],
  p04_gen1890: ['amb_1890', .55], p05_gen1969: ['amb_1969', .55], p06_gen2026: ['amb_2026', .5], p07_paris: ['amb_2026', .22],
  p08_dc_int: ['amb_dc', .5], p09_mountain: ['amb_mountain', .5], p11_desk2035_night: ['amb_rain', .5], p12_desk2035_dawn: ['amb_dawn', .45],
  p13_lahore_roof: ['amb_roof', .45], p14_clinic: ['amb_dawn', .25], p15_balcony2020: ['amb_hill', .3], p16_seoul: ['amb_2026', .3],
  p17_core_hall: ['amb_hall', .55], p18_bazaar: ['amb_bazaar', .5], p19_pylons: ['amb_pylons', .45], p21_school_gate: ['amb_dawn', .35],
  p22_stairs_phone: ['amb_2026', .3], p23_lab_night: ['amb_dc', .25], p24_parliament: ['amb_parl', .5], p25_roof_panel: ['amb_roof', .45],
  p26_classroom: ['amb_class', .45],
};
const TR = { push: ['whoosh', .45], left: ['whoosh', .4], right: ['whoosh', .4], up: ['whoosh_up', .5], down: ['whoosh_up', .45], fog: ['gust', .5], flash: ['bloom', .6] };
function soundPlan(shots, accents) {
  const out = [];
  for (const s of shots) {
    const a = AMB[s.draw.pid]; if (a) out.push({ f: a[0], t: s.a, d: s.b - s.a, v: a[1], loop: 1, fade: .8 });
    if (s.draw.pid === 'p02_dc_ext' || s.draw.pid === 'p08_dc_int') out.push({ f: 'steps', t: s.a + .3, d: Math.min(8, s.b - s.a - .5), v: .35, fade: .6 });
  }
  for (let i = 1; i < shots.length; i++) { const k = shots[i - 1].out?.kind, tr = TR[k]; if (tr) out.push({ f: tr[0], t: shots[i].a - .3, v: tr[1] }); }
  return out.concat(accents);
}
