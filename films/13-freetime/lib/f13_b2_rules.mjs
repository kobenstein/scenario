// Film 13 · B2 · c09 + c10 (351.48–448.88): no villain → the mission line → the time we kept (and why) → the empty sheet →
// firms: four-day week → time dividend → the hospital → the sheet with two lines (seam plate B2 → B3: plateSheet).
// Jakob 28.10. (binding): the hourglass only as an ANCHOR (here: the section turn, 9.01–9.03); between anchors separate flat
// explainers and scenic pictures, joined by a carrier; no long camera flights (the one tilt in 9.04 follows the falling grain).
// sc09.mjs and sc10.mjs both return { t: R.a, draw: build(T) }, so the c09|c10 seam is one function.
//
// c09 · s14 + s15 · 351.48–399.24
// | ID     | anchor                       | picture (one idea)                                                          | moves (≤ 2)        | carrier → next          |
// |--------|------------------------------|-----------------------------------------------------------------------------|--------------------|-------------------------|
// | 9.01   | villain · away               | ANCHOR: the last window of c08 grows into the hourglass on a workbench; the  | push · lamp        | the crack               |
// |        |                              | axis is the bench edge; a lamp comes down. Nobody near it.                  |                    |                         |
// | 9.02   | slipped · vote · shift       | a crack; single grains leak out, roll along the bench into a slit            | grains             | the last grain          |
// | 9.03 ★ | keep                         | the last grain drops through the slit into the dark; nobody catches it      | the grain          | the grain falls (tilt)  |
// | 9.04   | everyone · few · subscribe   | it lands in your hand (yellow raincoat) among many people; a few lights,    | lights spread      | lights rise             |
// |        |                              | then the light runs to everyone                                             |                    |                         |
// | 9.05   | weekend · eight-hour         | EXPL the lights form a week strip (S S gold) and a day ring (8 work · 8 rest · | strip · ring       | sheets attach           |
// |        |                              | 8 own)                                                                      |                    |                         |
// | 9.06   | decided · law · contract · Ford | EXPL signed sheets of light rise and pin on: LAW, CONTRACT, HENRY FORD ·  | sheets             |                         |
// |        |                              | FIVE-DAY WEEK · 1926                                                        |                    |                         |
// | 9.07   | slipped · down               | EXPL the six-hour dial of Battle Creek: no sheet; its two hours run off as  | sand runs off      | the empty sheet outline |
// |        |                              | sand; where its sheet would be: an empty outline                           |                    |                         |
// | 9.08   | decision · superintelligence | the empty sheet grows under the lamp into the sheet of light; a pen of light | sheet grows · pen  | the pen                 |
// c10 · s16 + s17 · 399.24–448.88
// | 10.01  | work                         | the pen writes the first line                                               | the line           | line → coast of Britain |
// | 10.02  | dozens · four-day            | EXPL the line lifts off as light and becomes Britain; 61 office lights.      | lights on          |                         |
// |        |                              | UK PILOT · 61 COMPANIES · 2022                                              |                    |                         |
// | 10.03  | nine in ten · half           | EXPL 54 stay lit, 7 go cool; 31 get a gold ring. AUTONOMY · 2024            | lights             | 31 lights rise          |
// | 10.04★ | machines · hours · profit    | EXPL the lights gather into the hand of light; its output falls: coins to   | stream splits      |                         |
// |        | dividend                     | the left pile, and a new branch of sand into people's hands (you among them)|                    |                         |
// |        |                              | TIME DIVIDEND                                                               |                    |                         |
// | 10.05  | proposal · nothing · new time| EXPL PROPOSAL; the coin pile is ringed: untouched; only the new stream shared | ring · stream      | sand → floor light      |
// | 10.06  | job · hospital · Fridays     | a hospital corridor at night: the sand's light is the floor strip; a nurse  | she walks          | the floor strip         |
// |        |                              | walks past the lit doors                                                    |                    |                         |
// | 10.07  | perfect · normal             | the strip rises into the sheet; the pen writes the second line → plateSheet | sheet · line       | plateSheet (B3)         |
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as B from './f13_b2_town.mjs';
import * as G from './f13_b2_gfx.mjs';
import { plateSheet, seamWindow, SEAM_HALF } from './f13_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, camAt, camDrift, F0, drift, prng } = E;

const sink = (t, a, d = .6) => 1 - expoIn(span(t, a, a + d));
const rise = (t, a, d = .7) => expoOut(span(t, a, a + d));
const sOut = (t, a, d = .6) => 1 - sineIO(span(t, a, a + d));       // 1 → 0 for labels: a calm exit
// a stamp's exit: maskLine eases u with expoOut, so feed it the inverse to make the sink follow k smoothly
const outU = (k) => k <= 0 ? 0 : k >= 1 ? 1 : -Math.log2(1 - k * .999) / 10;
function fromBase(ctx, y, h, k, fn) { if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-4000, y - 4000, 9920, 4000 + 1.5); ctx.clip(); ctx.translate(0, (1 - k) * h); fn(); ctx.restore(); }
function resample(pts, n) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1], o = []; let j = 1;
  for (let i = 0; i < n; i++) { const d = T * i / (n - 1); while (j < pts.length - 1 && L[j] < d) j++; const f = (d - L[j - 1]) / Math.max(1e-6, L[j] - L[j - 1]); o.push([lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f)]); }
  return o;
}

// ------------------------------------------------------------------------------------------------ the sheet (= lib/f13_seams plateSheet)
// Same code as plateSheet; o: { top (y of the sheet's top edge; 0 = full), clip [x0,y0,x1,y1] (a growing window onto it),
// l1, l2 (0..1: how much of each written line is there), bg (fill night0 behind) }. With top 0, l1 = l2 = 1, bg: identical to the plate.
const SHEET_LINES = [[330, 1460], [430, 1240]];
const lineY = (x, y) => y + 7 * Math.sin(x * .045) + 3 * Math.sin(x * .13);
function sheet(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (o.bg) { ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); }
  if (o.dy) ctx.translate(0, o.dy);
  if (o.bot != null) { ctx.beginPath(); ctx.rect(0, -10, W, o.bot + 10); ctx.clip(); }
  if (o.clip) { const [a, b, c, d] = o.clip; ctx.beginPath(); ctx.rect(a, b, c - a, d - b); ctx.clip(); }
  const top = o.top ?? 0; if (top > 0) { ctx.beginPath(); ctx.rect(0, top, W, H - top + 2); ctx.clip(); }
  const ex = 190 + 4 * drift(t, 1, 5);
  ctx.fillStyle = E.lin(ctx, ex - 70, 0, ex, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .9)]]); ctx.fillRect(ex - 70, 0, 70, H);
  ctx.fillStyle = E.rad(ctx, 1000, 260, 1300, [[0, P.core1], [.22, P.halo0], [.55, P.halo1], [.85, P.shade0], [1, P.shade1]]); ctx.fillRect(ex, 0, W - ex, H);
  ctx.fillStyle = E.rad(ctx, 1000, 300, 1250, [[.5, rgba(P.night1, 0)], [1, rgba(P.night1, .55)]]); ctx.fillRect(ex, 0, W - ex, H);
  const r = prng(77); ctx.strokeStyle = rgba(P.shade0, .1); ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) { const x0 = ex + r() * (W - ex), y0 = r() * H, l = 20 + r() * 60, a = r() * 6.28; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); ctx.stroke(); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  SHEET_LINES.forEach(([y, x1], i) => {
    const u = clamp(i ? o.l2 ?? 1 : o.l1 ?? 1); if (u <= 0) return;
    const xe = lerp(380, x1, u);
    ctx.strokeStyle = rgba(P.shade0, .85); ctx.lineWidth = 5; ctx.beginPath();
    for (let x = 380; x <= xe; x += 6) { const yy = lineY(x, y); x === 380 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    if (u < 1) ctx.lineTo(xe, lineY(xe, y));
    ctx.stroke();
  });
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, 1000, 220, 700, [[0, rgba(P.core1, .1 + .03 * Math.sin(t * 1.3))], [1, rgba(P.core1, 0)]]); ctx.fillRect(ex, 0, W - ex, H);
  ctx.restore();
}
// the pen of light: a slim stylus whose tip is (x, y); it leans up-right
function pen(ctx, x, y, t, a = 1) {
  if (a <= 0) return;
  const dx = 190, dy = -420, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const body = new Path2D(); body.moveTo(x, y); body.lineTo(x + ux * 60 + nx * 12, y + uy * 60 + ny * 12); body.lineTo(x + dx + nx * 15, y + dy + ny * 15); body.lineTo(x + dx - nx * 15, y + dy - ny * 15); body.lineTo(x + ux * 60 - nx * 12, y + uy * 60 - ny * 12); body.closePath();
  E.lightShape(ctx, body, t, { lit: 1, dust: 0, glow: .4, a });
  E.halo(ctx, x, y, 30, .8 * a, P.halo0, P.core0);
}

export function build(T) {
  const S = (sec) => (w, n) => T.S(sec, w, n), S14 = S('s14'), S15 = S('s15'), S16 = S('s16'), S17 = S('s17');
  const a = {
    c09: T.seg('s14').start, villain: S14('villain'), away: S14('away'), slipped: S14('slipped'), vote: S14('vote'), shift: S14('shift'), time: S14('time', 1),
    nobody: S14('nobody'), keep: S14('keep'), channel: S14('channel'), transition: S14('transition'), everyone: S14('everyone'), few: S14('few'),
    want: S14('want'), subscribe: S14('subscribe'),
    think: T.seg('s15').start, weekend: S15('weekend'), eight: S15('eight'), machine: S15('machine'), people: S15('people'), decided: S15('decided'),
    law: S15('law'), contract: S15('contract'), henry: S15('Henry'), ford: S15('Ford'), five: S15('five'), slipped2: S15('slipped'), nobody2: S15('Nobody'),
    down: S15('down'), sowhat: S15('So what'), decision: S15('decision'), superi: S15('superintelligence'),
    c10: T.seg('s16').start, work: S16('work'), dozens: S16('dozens'), britain: S16('Britain'), four: S16('four'), ayear: S16('A year'), nine: S16('nine'),
    half: S16('half'), permanent: S16('permanent'), now: S16('Now carry'), superi2: S16('superintelligence'), machines: S16('machines'), save: S16('save'),
    hours: S16('hours'), profit: S16('profit'), call: S16('Call'), dividend: S16('dividend'), proposal: S16('proposal'), country: S16('country'),
    notice: S16('notice'), nothing: S16('nothing'), simply: S16('simply'), newtime: S16('new time'),
    c17: T.seg('s17').start, job: S17('job'), hospital: S17('hospital'), fridays: S17('Fridays'), but: S17('But'), perfect: S17('perfect'), normal: S17('normal'),
    END: T.seg('s18').start,
  };
  const HZ = 690, LOW = 1150;                                       // the bench edge; the lower picture (9.04 on) lives LOW below
  // ---- camera: home; a slow push to the hourglass; ONE tilt down that follows the falling grain; then home on the lower picture
  const KEYS = [
    [a.c09, cam3({ z: 0 })], [a.c09 + 1.2, cam3({ z: 10 })], [a.away + .6, cam3({ y: -70, z: 100 })], [a.time, cam3({ x: 40, y: -45, z: 115 })],
    [a.keep + .6, cam3({ x: 100, y: 0, z: 100 })], [a.keep + 2.6, cam3({ y: LOW, z: 20 })], [a.everyone + .5, cam3({ y: LOW, z: 60 })],
    [a.think + .5, cam3({ y: LOW, z: 0 })], [a.ford, cam3({ y: LOW, z: 40 })], [a.down, cam3({ x: 60, y: LOW, z: 50 })], [a.superi, cam3({ y: LOW, z: 0 })],
    [a.dozens + 1, cam3({ y: LOW, z: 0 })], [a.permanent + .5, cam3({ x: -40, y: LOW, z: 60 })], [a.machines, cam3({ y: LOW, z: 0 })],
    [a.profit, cam3({ y: LOW + 60, z: 30 })], [a.newtime + .8, cam3({ x: 120, y: LOW + 270, z: 330 })], [a.fridays, cam3({ x: -60, y: LOW, z: 50 })], [a.but + .5, cam3({ y: LOW, z: 0 })],
  ];
  const camOf = (t) => camDrift(camAt(t, KEYS), t, .8);
  const low = (ctx, c, fn) => card(ctx, c, F0, () => { ctx.translate(0, LOW); fn(); });   // the lower picture's design coords

  // ---- 9.01–9.03: the bench, the hourglass, the lamp, the leak
  const HG = { x: 960, y: HZ, h: 440 };
  const WIN0 = { x: 960, y: 520, w: 34 * 1.9, h: 56 * 1.9 };       // where c08 left the last window
  const SLIT = 1250;
  const CRACK = [HG.x + .1 * HG.h, HG.y - .585 * HG.h];
  const GPATH = [CRACK, [CRACK[0] + 22, CRACK[1] + 30], [CRACK[0] + 50, CRACK[1] + 110], [CRACK[0] + 70, HZ - 50], [CRACK[0] + 78, HZ - 4]];
  const GR = [[a.slipped + .15, 0], [a.vote - .55, 1], [a.shift - .55, 2], [a.time - .4, 3], [a.keep - 1.75, 4]];   // grain starts (the last one falls on "keep")
  function grainAt(t, t0, last) {
    const d1 = .55, d2 = last ? 1.2 : .7, dt = t - t0; if (dt < 0) return null;
    if (dt < d1) { const k = (dt / d1) ** 1.6; const p = resample(GPATH, 40)[Math.min(39, Math.floor(k * 39))]; return [p[0], p[1], 0]; }
    const x0 = GPATH[GPATH.length - 1][0];
    if (dt < d1 + d2) { const k = 1 - (1 - (dt - d1) / d2) ** 1.4; return [lerp(x0, SLIT, k), HZ - 4, 0]; }
    const f = dt - d1 - d2; return [SLIT, HZ - 4 + (last ? 300 * f + 60 * f * f : 900 * f + 1200 * f * f), f];
  }
  // ---- 9.04: the people (the lower picture); you among them
  const FLOOR = 900;
  const CROWD = (() => { const r = prng(368), o = []; for (let i = 0; i < 19; i++) { const x = 60 + i * 102 + (r() - .5) * 30; if (Math.abs(x - SLIT) < 110) continue; o.push({ x, h: 165 + r() * 50, dir: r() < .5 ? 1 : -1, d: Math.abs(x - SLIT), ph: r() }); } return o; })();
  const handOf = (p) => [p.x + p.dir * p.h * .2, FLOOR - p.h * .56];
  const DU = { h: 230, pose: { dir: 1, light: 1, armR: [2.2, 1.7], look: .6 } };
  { const hr = E.du(createCanvas(4, 4).getContext('2d'), 0, 0, DU.h, DU.pose).R; DU.x = SLIT - hr[0]; DU.hy = FLOOR + hr[1]; }   // its hand right under the slit
  const tLand = (() => { const D = LOW + DU.hy - 6 - (HZ - 4); return a.keep + (-300 + Math.sqrt(300 * 300 + 4 * 60 * D)) / 120; })();
  // ---- 9.05: the week strip and the day ring (lower picture coords)
  const WEEK = { x0: 474, y: 170, w: 120, gap: 22, h: 140 }, DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayX = (i) => WEEK.x0 + i * (WEEK.w + WEEK.gap);
  const RING = { x: 1130, y: 650, r: 130 };
  // ---- 9.06: sheets (target x, y on the strip / ring), 9.07: the six-hour dial
  const SHEETS = [
    { id: 'law', x: (dayX(5) + dayX(6) + WEEK.w) / 2, y: WEEK.y + WEEK.h + 92, t: a.law, label: 'LAW', from: 1500 },
    { id: 'contract', x: RING.x - RING.r - 210, y: RING.y - 10, t: a.contract, label: 'CONTRACT', from: 900 },
    { id: 'ford', x: (dayX(0) + dayX(4) + WEEK.w) / 2, y: WEEK.y + WEEK.h + 92, t: a.ford, label: 'FORD · 1926', from: 760 },
  ];
  const SIX = { x: 1640, y: 600, r: 84 }, EMPTY = { x: 1640, y: 742, w: 92, h: 120 };

  // ---- c10: Britain (lon, lat → design coords), 61 office lights
  const GBLL = [[1.3, 51.1], [.9, 51.5], [1.75, 52.5], [1.3, 52.93], [.3, 52.85], [.3, 53.5], [.1, 53.6], [-.08, 54.1], [-.6, 54.5], [-1.15, 54.62], [-1.42, 55.0], [-2.0, 55.77], [-3.2, 56.0], [-2.6, 56.28], [-2.97, 56.46], [-2.47, 56.7], [-2.08, 57.15], [-1.78, 57.5], [-2.0, 57.69], [-4.2, 57.48], [-3.77, 57.86], [-3.08, 58.44], [-3.03, 58.64], [-3.37, 58.67], [-5.0, 58.62], [-5.16, 57.9], [-5.7, 57.3], [-5.83, 57.0], [-6.2, 56.72], [-5.47, 56.41], [-5.8, 55.3], [-4.8, 55.9], [-4.63, 55.46], [-4.86, 54.64], [-3.4, 54.95], [-3.6, 54.5], [-2.9, 54.07], [-3.0, 53.4], [-3.83, 53.33], [-4.6, 53.3], [-4.75, 52.8], [-4.08, 52.41], [-5.3, 51.88], [-5.0, 51.68], [-3.95, 51.6], [-3.17, 51.48], [-2.7, 51.5], [-3.3, 51.2], [-4.53, 51.02], [-5.7, 50.07], [-5.2, 49.96], [-4.14, 50.37], [-3.64, 50.22], [-2.45, 50.52], [-1.3, 50.75], [-.14, 50.82], [.25, 50.74], [.97, 50.91], [1.3, 51.1]];
  const GK = 92, GX = 560, GY = 120, gbP = (lon, lat) => [GX + (lon + 6.3) * .588 * GK, GY + (58.8 - lat) * GK];
  const GB = GBLL.map(([lo, la]) => gbP(lo, la));
  const inGB = (x, y) => { let c = false; for (let i = 0, j = GB.length - 1; i < GB.length; j = i++) { const [xi, yi] = GB[i], [xj, yj] = GB[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const LONDON = gbP(-.12, 51.5);
  const OFFICES = (() => {
    const r = prng(2022), o = []; let guard = 0;
    while (o.length < 61 && guard++ < 20000) {
      let x, y; if (r() < .42) { const g = () => (r() + r() + r() - 1.5) * 1.1; x = LONDON[0] + g() * 55; y = LONDON[1] + g() * 45; } else { x = GX + r() * 420; y = GY + 200 + r() * 640; }
      if (!inGB(x, y) || o.some((p) => Math.hypot(p.x - x, p.y - y) < 13)) continue;
      o.push({ x, y, d: Math.hypot(x - LONDON[0], y - LONDON[1]) });
    }
    const idx = o.map((_, i) => i).sort((p, q) => o[p].d - o[q].d);
    const rr = prng(54), order = idx.map((i) => [i, rr()]).sort((p, q) => p[1] - q[1]).map((p) => p[0]);
    order.slice(0, 7).forEach((i) => (o[i].out = true));                                  // 7 stopped (54 of 61 still on it)
    order.slice(7, 38).forEach((i, j) => { o[i].perm = true; o[i].pj = j; });             // 31 made it permanent
    return o;
  })();
  const LINE1 = (() => { const p = []; for (let x = 380; x <= 1460; x += 6) p.push([x, lineY(x, 330)]); return p; })();
  const NM = 140, LINE1_R = resample(LINE1, NM), GB_R = resample(GB, NM);
  // 10.04: the hand of light, the stream and its split; the coin pile; the people (lower picture coords)
  const HAND = { x: 960, y: -60, ang: Math.PI / 2, L: 150 };
  const HM = E.handMatrix(HAND.x, HAND.y, HAND.ang, HAND.L, 1), TIP = E.applyM(HM, ...E.HAND_TIP), PALM = E.applyM(HM, 1.05, -.05);
  const SPLIT = [960, 520], PILE = { x: 600, y: 880 }, FOLK = { x0: 1210, y: 880 };
  const FOLKS = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ x: FOLK.x0 + i * 74, h: 100 + ((i * 37) % 23), du: i === 3 }));
  const COINS0 = (() => { const r = prng(424), o = []; for (let i = 0; i < 40; i++) { const row = Math.floor(Math.sqrt(i * 1.3)); o.push([PILE.x + (r() - .5) * (230 - row * 36), PILE.y - 9 - row * 12 - r() * 3]); } return o.sort((p, q) => q[1] - p[1]); })();

  // ================================================================================================ draw
  const draw = (ctx, t) => {
    if (seamWindow(t, a.END)) { plateSheet(ctx, t); return; }      // the B3 plate, untouched
    const c = camOf(t);
    sky(ctx, c, t);
    if (t < a.keep + 3) benchPic(ctx, c, t);
    if (t > a.keep - .2 && t < a.superi + 1) crowdPic(ctx, c, t);
    if (t > a.think - .3 && t < a.superi + 1) keptPic(ctx, c, t);
    if (t > a.down - 2 && t < a.work + 2.2) sheetPic(ctx, c, t);
    if (t > a.work - .2 && t < a.machines + 1) mapPic(ctx, c, t);
    if (t > a.now - .3 && t < a.fridays + 1) dividendPic(ctx, c, t);
    if (t > a.c17 - .4) corridorPic(ctx, c, t);
  };
  // the night canvas: continues c08's sky (sm .3 at the seam → the hall's night), clears to the plate's flat night at the end
  function sky(ctx, c, t) {
    const sm = .3 * (1 - smooth(span(t, a.c09 + .5, a.c09 + 4))), nk = smooth(span(t, a.but - .2, a.END - .6));
    const s1 = P.night1, s3 = P.ind0, f = (col) => mixHex(col, P.night0, nk);
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.5, f(s1)], [.62, f(mixHex(mixHex(s1, s3, .24), mixHex(P.ind0, P.ind1, .55), sm))], [.74, f(mixHex(mixHex(s1, s3, .48), mixHex(P.ind1, P.shade0, .62), sm))], [1, f(mixHex(s3, mixHex(P.ind0, P.night1, .5), sm))]], -900, H + 200);
      E.stars(ctx, 13, 170, t, [-300, -600, W + 600, H + 400], .75 * (1 - .55 * sm) * (1 - nk));
    });
  }

  // ============================================================================ 9.01–9.03: the bench (anchor)
  function benchPic(ctx, c, t) {
    const g = sineIO(span(t, a.c09 + .1, a.c09 + 1.7));                  // the window grows into the hourglass's frame
    const drain = sineIO(span(t, a.c09 + 1.2, a.c09 + 2.6));            // its cool light sinks into the bench
    const plank = expoOut(span(t, a.c09 + .3, a.c09 + 1.6));
    const lamp = sineIO(span(t, a.c09 + .9, a.c09 + 3.2));
    card(ctx, c, F0, () => {
      // the lamp: down on its cord from above; its pool on the bench
      const ly = lerp(-160, 118, lamp);
      if (lamp > 0) {
        E.halo(ctx, HG.x, HZ - 10, 560, .16 * lamp, P.halo1, P.shade0);
        ctx.strokeStyle = rgba(P.night1, 1); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(HG.x, -400); ctx.lineTo(HG.x, ly - 40); ctx.stroke();
        ctx.fillStyle = E.lin(ctx, HG.x - 70, 0, HG.x + 70, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .5)]]);
        ctx.beginPath(); ctx.moveTo(HG.x - 34, ly - 62); ctx.lineTo(HG.x + 34, ly - 62); ctx.lineTo(HG.x + 104, ly); ctx.lineTo(HG.x - 104, ly); ctx.closePath(); ctx.fill();
        ctx.fillStyle = mixHex(P.halo1, P.core1, .5); ctx.beginPath(); ctx.ellipse(HG.x, ly, 42, 8, 0, 0, Math.PI); ctx.fill();
        E.halo(ctx, HG.x, ly + 4, 120, .35 * lamp, P.halo1, P.core1);
      }
      // the plank (grows down from the axis line) and the slit
      if (plank > 0) {
        const ph = 70 * plank;
        ctx.fillStyle = E.lin(ctx, 0, HZ, 0, HZ + 70, [[0, mixHex(P.ind2, P.shade0, .25)], [1, P.night1]]); ctx.fillRect(-1400, HZ, W + 2800, ph);
        ctx.fillStyle = P.night0; ctx.fillRect(SLIT - 4, HZ - 1, 8, ph + 2);
      }
      // the rect (the window) → the hourglass's frame; the hourglass seen through it
      const x = HG.x, cy = lerp(WIN0.y, HG.y - HG.h * .5, g), w = lerp(WIN0.w, HG.h * .7, g), h = lerp(WIN0.h, HG.h + 10, g);
      if (drain < 1) { const fh = h * (1 - drain); ctx.fillStyle = mixHex(P.night1, mixHex(P.blue2, P.cream, .3), .75); ctx.fillRect(x - w / 2, cy + h / 2 - fh, w, fh); }
      const lost = GR.filter(([t0]) => t > t0 + .3).length;
      ctx.save(); if (g < 1) { ctx.beginPath(); ctx.rect(x - w / 2, cy - h / 2, w, h); ctx.clip(); }
      K.hourglass(ctx, HG.x, HG.y, HG.h, t, { top: .58 - .03 * lost - .04 * span(t, a.c09, a.keep + 3), bot: .3 + .04 * span(t, a.c09, a.keep + 3), flow: 1, crack: expoOut(span(t, a.slipped - .05, a.slipped + .25)), light: 1 });
      ctx.restore();
      if (g < 1 || drain < 1) { ctx.strokeStyle = rgba(P.blue0, .8 * (1 - drain)); ctx.lineWidth = 1.5; ctx.strokeRect(x - w / 2, cy - h / 2, w, h); }
      // the bench edge (was the time axis)
      K.trailSpan(ctx, [[-1400, HZ, 3], [W + 1400, HZ, 3]], 0, 1, { w: 2.2, spark: false, a: .85 });
      // the grains: out through the crack, along the bench, into the slit (the last one falls on "keep")
      GR.forEach(([t0], i) => {
        const last = i === GR.length - 1, p = grainAt(t, t0, last); if (!p) return;
        const [gx, gy] = p; if (gy > (last ? LOW + DU.hy - 6 : HZ + 900) || (last && t > tLand)) return;
        E.halo(ctx, gx, gy, last ? 36 : 24, last ? .8 : .6, P.halo0, P.core0);
        ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(gx, gy, last ? 4.6 : 3.6, 0, 6.29); ctx.fill();
      });
    });
  }

  // ============================================================================ 9.04: you catch it; the light goes to everyone
  function crowdPic(ctx, c, t) {
    const kin = rise(t, a.keep + .6, 1.2), out = (d) => sink(t, a.think + .2 + d, .7);
    low(ctx, c, () => {
      // the floor line (draws out from under you)
      const fl = expoOut(span(t, a.keep + 1.0, a.keep + 2.4));
      if (fl > 0) K.trailSpan(ctx, [[lerp(DU.x, -200, fl), FLOOR, 2], [lerp(DU.x, W + 200, fl), FLOOR, 2]], 0, 1, { w: 1.8, spark: false, a: .7 * out(.4) });
      // the people rise from it, nearest first
      for (const p of CROWD) {
        const k = rise(t, a.keep + 1.3 + p.d / 1500, .8) * out(p.d / 3000); if (k <= 0) continue;
        fromBase(ctx, FLOOR, p.h * 1.1, k, () => E.person(ctx, p.x, FLOOR, p.h, { dir: p.dir, light: 1, back: .7, rim: mixHex(P.blue0, P.blue1, .3), armR: lit(p, t) > 0 ? [lerp(.12, 1.2, lit(p, t)), lerp(.06, 1.55, lit(p, t))] : undefined }));
        const l = lit(p, t), [hx, hy] = handOf(p);
        if (l > 0 && k > .9) { const up = liftK(t); E.halo(ctx, hx, hy - up * 40, 34 * l, .75 * l, P.halo0, P.core0); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(hx, hy - up * 40, 4 * l, 0, 6.29); ctx.fill(); }
      }
      // you: in the yellow raincoat, under the slit; you hold your hand out and catch the grain
      const kd = rise(t, a.keep + 1.0, .9) * out(.2);
      if (kd > 0) fromBase(ctx, FLOOR, DU.h * 1.1, kd, () => {
        const reach = sineIO(span(t, tLand - 1.0, tLand - .2)), up = liftK(t);
        const hands = E.du(ctx, DU.x, FLOOR, DU.h, { dir: 1, light: 1, armR: [lerp(.12, 2.2, reach) + .5 * up, lerp(.06, 1.7, reach) + .9 * up], look: .6 * reach });
        if (t > tLand && hands && hands.R) { const [hx, hy] = hands.R; E.halo(ctx, hx, hy - 4, 40, .9, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(hx, hy - 4, 4, 0, 6.29); ctx.fill(); }
      });
    });
  }
  // a person's light: a few on "transition", then it runs to everyone from you outward
  const FEW = new Set(CROWD.map((p, i) => [i, p.d]).sort((p, q) => p[1] - q[1]).slice(0, 3).map((p) => p[0]));
  function lit(p, t) {
    const i = CROWD.indexOf(p);
    const t0 = FEW.has(i) ? a.transition - .1 + i % 3 * .12 : a.everyone - .15 + p.d / 900;
    return smooth(span(t, t0, t0 + .4)) * (1 - smooth(span(t, a.think + .1, a.think + .5)));
  }
  const liftK = (t) => sineIO(span(t, a.subscribe - .6, a.subscribe + .4));

  // ============================================================================ 9.05–9.07: the time we kept (and the time that slipped)
  function keptPic(ctx, c, t) {
    low(ctx, c, () => {
      const gone = (d = 0) => sink(t, a.sowhat + .1 + d, .7);
      // the lights rise from the hands into the week strip (one stream per day)
      const fly = span(t, a.think - .2, a.think + 1.4);
      if (fly > 0 && fly < 1) CROWD.forEach((p, i) => {
        const [hx, hy] = handOf(p), d = i % 7, tx = dayX(d) + WEEK.w / 2, ty = WEEK.y + WEEK.h / 2, k = sineIO(clamp(fly * 1.3 - (i % 5) * .06));
        const x = lerp(hx, tx, k), y = lerp(hy - 40, ty, k) - Math.sin(k * Math.PI) * 60;
        E.halo(ctx, x, y, 20, .6 * (1 - k * .7), P.halo0, P.core0);
      });
      // the week strip: cool day blocks; Saturday + Sunday fill with gold on "weekend"
      DAYS.forEach((d, i) => {
        const k = expoOut(span(t, a.think + .5 + i * .07, a.think + 1.3 + i * .07)) * gone(i * .04); if (k <= 0) return;
        const x = dayX(i), hh = WEEK.h * k, p = new Path2D(); p.roundRect(x, WEEK.y + WEEK.h - hh, WEEK.w, hh, 10);
        const wk = i >= 5 ? expoOut(span(t, a.weekend - .1 + (i - 5) * .12, a.weekend + .7 + (i - 5) * .12)) : 0;
        if (wk > 0) E.fillWithLight(ctx, p, wk, t, { seed: 90 + i }); else E.lightShape(ctx, p, t, { lit: 0, a: .7, dust: 0, glow: .4 });
      });
      G.stamp(ctx, 'WEEKEND', (dayX(5) + dayX(6) + WEEK.w) / 2, WEEK.y - 28, smooth(span(t, a.weekend + .2, a.weekend + .8)) * gone(.2), { align: 'center', col: P.core1 });
      // 9.06 'not a machine' (a cool flicker on the ring) · 'people decided' (a warm pulse through the kept days and the ring)
      const pm = bump(t, a.machine - .3, 1.1), pd = bump(t, a.decided - .5, 1.4);
      if (pm > 0) E.halo(ctx, RING.x, RING.y, RING.r * 1.9, .3 * pm * gone(.3), P.blue0, P.blue2);
      if (pd > 0) { E.halo(ctx, RING.x, RING.y, RING.r * 2.1, .35 * pd * gone(.3), P.halo1, P.core1); E.halo(ctx, dayX(5) + WEEK.w, WEEK.y + WEEK.h / 2, 260, .35 * pd * gone(.2), P.halo1, P.core1); }
      // the day ring: 8 work (cool) · 8 rest (dim) · 8 own (gold), drawn one after another on "eight-hour day"
      const kr = gone(.3);
      if (kr > 0 && t > a.eight - .3) {
        const s = [expoOut(span(t, a.eight - .2, a.eight + .5)), expoOut(span(t, a.eight + .3, a.eight + 1.0)), expoOut(span(t, a.eight + .8, a.eight + 1.6))];
        ctx.save(); ctx.translate(RING.x, RING.y); ctx.scale(kr, kr); ctx.translate(-RING.x, -RING.y);
        G.dialTrack(ctx, RING.x, RING.y, RING.r, s[0], { r: 1 });
        // 24 h on the ring: each segment is a third (one third = 4 positions of the 12-hour dial)
        if (s[0] > 0) G.workArc(ctx, RING.x, RING.y, RING.r, 0, 4 * s[0], t, { w: .16, r: 1, lit: 0 });
        if (s[1] > 0) G.workArc(ctx, RING.x, RING.y, RING.r, 4, 4 * s[1], t, { w: .16, r: 1, lit: 0, a: .45 });
        if (s[2] > 0) G.workArc(ctx, RING.x, RING.y, RING.r, 8, 4 * s[2], t, { w: .16, r: 1, lit: 1 });
        ctx.restore();
        K.maskLine(ctx, [['8', .6]], RING.x, RING.y + 44, 128, smooth(span(t, a.eight + .2, a.eight + 1)) * kr, { align: 'center' });   // the one key number
      }
      // signed sheets of light rise from the floor line and pin on (people decided)
      SHEETS.forEach((s, i) => {
        const up = sineIO(span(t, s.t - .9, s.t + .1)), k = gone(.1 + i * .05); if (up <= 0 || k <= 0) return;
        const x = lerp(s.from, s.x, up), y = lerp(FLOOR + 80, s.y, up) - Math.sin(up * Math.PI) * 50, rot = lerp(.25, -.04 + .04 * i, up);
        ctx.save(); ctx.beginPath(); ctx.rect(-500, -500, W + 1000, FLOOR + 500 + 1); ctx.clip();
        ctx.translate(x, y + (1 - k) * 200); ctx.rotate(rot); miniSheet(ctx, t, s.id); ctx.restore();
        G.stamp(ctx, s.label, s.x, s.y + 116, smooth(span(t, s.t + .1, s.t + .8)) * k * (i < 2 ? 1 - sineIO(span(t, a.ford - .5, a.ford + .2)) : 1), { align: 'center', col: i === 2 ? P.cream : undefined });   // LAW, CONTRACT give way to FORD
      });
      // 9.07: Battle Creek's six hours: no sheet; its two hours run off as sand; where its sheet would be, an empty outline
      const ks = rise(t, a.slipped2 - .8, .8) * gone(.25);
      if (ks > 0) fromBase(ctx, FLOOR, 700, ks, () => {
        E.halo(ctx, SIX.x, SIX.y, SIX.r * 2.4, .25, P.halo1, P.halo0);
        B.clockFace(ctx, SIX.x, SIX.y, SIX.r, t, { lit: 1, hands: [7, 0] });
        G.workArc(ctx, SIX.x, SIX.y, SIX.r, 7, 6, t, { w: .14 });
        const run = span(t, a.slipped2, a.down + .4);
        for (let i = 0; i < 2; i++) {   // the two freed hours (discs) crumble and run down through the floor line
          const [px, py] = G.arcPoint(SIX.x, SIX.y, SIX.r, 1.5 + i, 1.35), rr = SIX.r * .13 * (1 - smooth(span(run, .1 + i * .15, .6 + i * .15)));
          if (rr > .5) G.hourDisc(ctx, px, py, rr, t, { halo: false });
          if (run > .1 + i * .15) G.sandStream(ctx, px, py, px + 10, FLOOR + 40, t, { u0: smooth(span(run, .55 + i * .15, 1)), u1: smooth(span(run, .1 + i * .15, .4 + i * .15)), w: 2, n: 18, seed: 7 + i });
        }
        // the empty outline: nobody wrote it down
        const eo = smooth(span(t, a.nobody2 + .3, a.down + .3));
        if (eo > 0) { ctx.save(); ctx.setLineDash([6, 8]); ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.beginPath(); const x0 = EMPTY.x - EMPTY.w / 2, y0 = EMPTY.y; ctx.moveTo(x0, y0 + EMPTY.h); ctx.lineTo(x0, y0 + EMPTY.h * (1 - eo)); if (eo > .5) { ctx.lineTo(x0 + EMPTY.w * smooth(span(eo, .5, .75)), y0); } if (eo > .75) ctx.lineTo(x0 + EMPTY.w, y0 + EMPTY.h * smooth(span(eo, .75, 1))); ctx.stroke(); ctx.restore(); }
      });
      // the floor line stays under all of it
      K.trailSpan(ctx, [[-200, FLOOR, 2], [W + 200, FLOOR, 2]], 0, 1, { w: 1.8, spark: false, a: .7 * gone(.5) });
    });
  }
  // a small signed sheet (local: centred, 74 × 96)
  function miniSheet(ctx, t, id) {
    const w = 74, h = 96, p = new Path2D(); p.rect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = E.rad(ctx, 0, -h * .3, h * 1.1, [[0, P.core1], [.35, P.halo0], [.8, P.halo1], [1, P.shade0]]); ctx.fill(p);
    E.halo(ctx, 0, 0, 90, .25, P.halo1, P.halo0);
    ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 12, -h / 2 + 20 + i * 14); ctx.lineTo(w / 2 - 12 - (i === 2 ? 18 : 0), -h / 2 + 20 + i * 14); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-w / 2 + 14, h / 2 - 18); ctx.bezierCurveTo(-10, h / 2 - 34, 0, h / 2 - 4, 8, h / 2 - 20); ctx.bezierCurveTo(14, h / 2 - 28, 20, h / 2 - 14, 28, h / 2 - 20); ctx.stroke();   // the signature
    if (id === 'law') { ctx.fillStyle = rgba(P.shade0, .7); ctx.beginPath(); ctx.arc(w / 2 - 16, h / 2 - 18, 8, 0, 6.29); ctx.fill(); }               // the seal
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(0, -h / 2 + 6, 3.5, 0, 6.29); ctx.fill();                                                    // the pin
  }

  // ============================================================================ 9.08 + 10.01: the empty sheet grows into the sheet of light; the pen
  function sheetPic(ctx, c, t) {
    const grow = sineIO(span(t, a.decision - .3, a.superi + .9));
    const away = sineIO(span(t, a.work + .7, a.work + 2.0));                   // 10.01 → 10.02: the sheet is pulled away downward
    if (grow <= 0) return;
    const e = E.project(c, F0, EMPTY.x - EMPTY.w / 2, EMPTY.y + LOW), e2 = E.project(c, F0, EMPTY.x + EMPTY.w / 2, EMPTY.y + EMPTY.h + LOW);
    const ex = 190 + 4 * drift(t, 1, 5);
    const clip = [lerp(e[0], ex - 80, grow), lerp(e[1], 0, grow), lerp(e2[0], W, grow), lerp(e2[1], H, grow)];
    sheet(ctx, t, { clip, dy: away * away * 1150, l1: sineIO(span(t, a.c10 + .1, a.work + .55)), l2: 0 });
    // the pen comes in on "superintelligence" and writes; then it lifts away
    const pin = sineIO(span(t, a.superi + .4, a.c10 + .1)), l1 = sineIO(span(t, a.c10 + .1, a.work + .55)), pout = expoIn(span(t, a.work + .6, a.work + 1.3));
    if (pin > 0 && pout < 1) {
      const xe = lerp(380, 1460, l1), tipx = lerp(1700, 380, pin) + (xe - 380), tipy = lerp(-120, lineY(380, 330), pin) + (lineY(xe, 330) - lineY(380, 330));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); pen(ctx, tipx + pout * 300, tipy - pout * 700, t); ctx.restore();
    }
  }

  // ============================================================================ 10.01–10.03: the line becomes Britain; the four-day week
  function mapPic(ctx, c, t) {
    const m = sineIO(span(t, a.work + .7, a.work + 2.1));                      // line (screen) → coast
    const out = sink(t, a.now + .2, .8), outline = 1 - smooth(span(t, a.now + .6, a.now + 1.6));
    low(ctx, c, () => {
      if (t > a.work + .55 && outline > 0) {
        const pts = LINE1_R.map((p, i) => [lerp(p[0], GB_R[i][0], m), lerp(p[1], GB_R[i][1], m), 2.6]);
        K.trailSpan(ctx, pts, 0, outline, { w: lerp(3.4, 2.4, m), spark: false, a: .9 });
      }
      // the 61 office lights (on from London outward); 7 go cool; 31 get a gold ring; then the 31 rise into the hand
      const gather = span(t, a.now + .2, a.machines - .6);
      OFFICES.forEach((o) => {
        const on = smooth(span(t, a.dozens - .1 + o.d / 650, a.dozens + .25 + o.d / 650)); if (on <= 0) return;
        const off = o.out ? smooth(span(t, a.nine + (o.d % 50) / 120, a.nine + .4 + (o.d % 50) / 120)) : 0;
        const pm = o.perm ? expoOut(span(t, a.half - .1 + o.pj * .03, a.half + .4 + o.pj * .03)) : 0;
        let x = o.x, y = o.y;
        if (o.perm && gather > 0) { const k = sineIO(clamp(gather * 1.4 - o.pj * .012)); x = lerp(o.x, PALM[0], k); y = lerp(o.y, PALM[1], k) - Math.sin(k * Math.PI) * 80; if (k >= 1) return; }
        else if (out < 1) { if (out <= 0) return; y += (1 - out) * 30; }
        if (!o.perm && out <= 0) return;
        const warm = 1 - off;
        if (warm > .05) E.halo(ctx, x, y, 16 + 8 * pm, .55 * warm * on, P.halo0, P.core0);
        ctx.fillStyle = mixHex(mixHex(P.blue1, P.blue2, .5), P.core1, warm); ctx.globalAlpha = on * (o.perm || out >= 1 ? 1 : out); ctx.beginPath(); ctx.arc(x, y, 3.2 + 1.2 * pm, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1;
        const rk = pm * (1 - smooth(span(t, a.now - .2, a.now + .3)));            // rings shrink into their light before the gather
        if (rk > 0) { ctx.strokeStyle = rgba(P.core1, .9 * rk); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 4 + 5 * rk, 0, 6.29); ctx.stroke(); }
      });
      // one label at a time (coordinator 28.10.): the title, then one big number that rolls 61 → 54 → 31 with one word under it
      const sx = 1130, NY = 600, so = 1 - sineIO(span(t, a.now - .35, a.now + .5));
      G.stamp(ctx, 'FOUR-DAY WEEK', sx, 380, smooth(span(t, a.britain - .2, a.britain + .5)) * (1 - smooth(span(t, a.four - .2, a.four + .4))), { size: 64, col: P.cream });
      const nIn = rise(t, a.four - .1, .8), nk = nIn * so;
      if (nk > 0) {
        const r1 = span(t, a.nine - .15, a.nine + 1.0), r2 = span(t, a.half - .15, a.half + 1.0);
        const [from, to, u] = r2 > 0 ? [54, 31, r2] : r1 > 0 ? [61, 54, r1] : [61, 61, 1];
        ctx.save(); ctx.beginPath(); ctx.rect(sx - 30, NY - 150, 600, 186); ctx.clip(); ctx.translate(0, (1 - nk) * 190);
        G.yearRoll(ctx, sx, NY, 150, from, to, u);
        ctx.restore();
      }
      const w1 = smooth(span(t, a.four + .2, a.four + .8)) * (1 - smooth(span(t, a.nine - .3, a.nine + .2)));
      const w2 = smooth(span(t, a.nine + .3, a.nine + .9)) * (1 - smooth(span(t, a.half - .3, a.half + .2)));
      const w3 = smooth(span(t, a.half + .4, a.permanent + .3)) * so;
      G.stamp(ctx, 'COMPANIES', sx + 8, NY + 86, w1);
      G.stamp(ctx, 'STILL ON IT', sx + 8, NY + 86, w2, { col: P.cream });
      G.stamp(ctx, 'PERMANENT', sx + 8, NY + 86, w3, { col: P.core1 });
    });
  }

  // ============================================================================ 10.04–10.05: the time dividend
  const FK0 = a.hours - .2, FK1 = a.dividend + .8;
  const fanK = (t) => sineIO(span(t, FK0, FK1));
  const fanArrive = (i) => { const y = clamp((1 + Math.abs(i - 3) * .25) / 1.8); return FK0 + Math.acos(1 - 2 * y) / Math.PI * (FK1 - FK0); };
  const bump = (t, t0, d) => { const x = (t - t0) / d; return x <= 0 || x >= 1 ? 0 : Math.sin(x * Math.PI) ** 2; };
  function dividendPic(ctx, c, t) {
    const hk = smooth(span(t, a.now + .9, a.superi2 + .8));                     // the hand forms where the 31 lights gather
    const back = sineIO(span(t, a.c17 - .3, a.job + .3));                      // 10.06: the hand withdraws up, the rest sinks
    const out = (d) => sink(t, a.c17 + d, .7);
    const pour = smooth(span(t, a.machines - .1, a.machines + .9)), split = expoOut(span(t, a.save - .1, a.hours + .1));
    low(ctx, c, () => {
      // the floor line, the pile of coins people already have
      const fl = expoOut(span(t, a.machines - .6, a.machines + .6)) * out(.5);
      if (fl > 0) K.trailSpan(ctx, [[lerp(960, 200, fl), FOLK.y, 2], [lerp(960, 1760, fl), FOLK.y, 2]], 0, 1, { w: 1.8, spark: false, a: .75 });
      const kp = rise(t, a.machines - .3, .8) * out(.15);
      fromBase(ctx, FOLK.y, 140, kp, () => COINS0.forEach(([x, y]) => coin(ctx, x, y, 12)));
      // the people (you among them, in the yellow raincoat) hold out their hands
      FOLKS.forEach((f, i) => {
        const k = rise(t, a.save - .4 + i * .06, .8) * out(.1 + i * .03); if (k <= 0) return;
        const reach = sineIO(span(t, a.save + i * .05, a.hours - .2 + i * .05));
        const lift = f.du ? sineIO(span(t, a.newtime - .3, a.newtime + .9)) : 0;          // you lift your hour on "new time"
        fromBase(ctx, FOLK.y, f.h * 1.2, k, () => {
          const o = { dir: -1, light: -1, armR: [lerp(lerp(.12, 2.1, reach), 2.75, lift), lerp(lerp(.06, 1.75, reach), 2.85, lift)], look: .5 * reach + .3 * lift };
          const hands = f.du ? E.du(ctx, f.x, FOLK.y, f.h + 12, o) : E.person(ctx, f.x, FOLK.y, f.h, { ...o, back: .7 });
          // the hour in each hand grows grain by grain from the moment its branch arrives
          const n = Math.min(9, Math.max(0, (t - fanArrive(i)) * 1.25)), got = smooth(clamp(n * 2));
          if (got > 0 && hands && hands.R) {
            const g = Math.floor(n) + smooth(clamp((n % 1) * 3)), pulse = f.du ? .6 * bump(t, a.dividend, .7) + .5 * lift : 0;
            const r = (3.2 + .85 * g) * (1 + .5 * pulse);
            E.halo(ctx, hands.R[0], hands.R[1], 22 + 2.4 * g + 40 * pulse, (.55 + .3 * pulse) * got, P.halo0, P.core0);
            ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(hands.R[0], hands.R[1], r * got, 0, 6.29); ctx.fill();
          }
        });
      });
      // the streams: all output first goes left as coins (profit); on "hours" a new branch of sand goes right, to the people
      if (pour > 0 && back < 1) {
        const top = [TIP[0], TIP[1] - back * 600];
        G.sandStream(ctx, top[0], top[1], SPLIT[0], SPLIT[1], t, { u0: 0, u1: pour, w: 3, n: 30, seed: 41 });
        if (pour >= 1) {
          // left: coins along a curve to the pile
          const cl = (k) => [lerp(SPLIT[0], PILE.x + 20, k), SPLIT[1] + (PILE.y - 60 - SPLIT[1]) * k * k];
          ctx.save(); ctx.strokeStyle = rgba(mixHex(P.blue2, P.cream, .4), .35); ctx.lineWidth = 2; ctx.setLineDash([3, 9]); ctx.beginPath(); for (let k = 0; k <= 1.001; k += .05) { const [x, y] = cl(k); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
          const r = prng(5); for (let i = 0; i < 6; i++) { const ph = (r() + (t - a.machines) * .55) % 1; const [x, y] = cl(ph); coin(ctx, x, y, 10, ph < .05 ? ph / .05 : 1); }
          const pulse = smooth(span(t, a.profit - .1, a.profit + .3)) * (1 - smooth(span(t, a.profit + .5, a.profit + 1.2)));
          if (pulse > 0) E.halo(ctx, PILE.x, PILE.y - 30, 160, .25 * pulse, P.blue0, P.blue2);
          // right: the new branch of sand
          if (split > 0) {
            const nt = 1 + .6 * smooth(span(t, a.newtime - .1, a.newtime + .5)) * (1 - smooth(span(t, a.newtime + 1.2, a.newtime + 2)));
            const FAN = [FOLKS[3].x - 20, FOLK.y - 300], k0 = clamp(split * 1.6), fk = fanK(t);
            G.sandStream(ctx, SPLIT[0], SPLIT[1], FAN[0], FAN[1], t, { u0: 0, u1: k0, w: 2.4 * nt, n: 24, seed: 49 });
            for (let i = 0; i < FOLKS.length; i++) {
              const f = FOLKS[i], tx = f.x - 16, ty = FOLK.y - f.h * .8, k = clamp(fk * 1.8 - Math.abs(i - 3) * .25);
              if (k > 0) G.sandStream(ctx, FAN[0], FAN[1], tx, ty, t, { u0: 0, u1: k, w: 1.2 * nt, n: 6, seed: 50 + i });
            }
            if (k0 >= 1) E.halo(ctx, FAN[0], FAN[1], 40, .35 * nt, P.halo0, P.core0);
          }
        }
        E.halo(ctx, SPLIT[0], SPLIT[1], 50 * (1 + split) * (1 + .12 * Math.sin(t * 2.3)), .5 * pour, P.halo0, P.core0);   // the split breathes with the flow
      }
      // the hand of light (it forms from the lights; it withdraws upward on "It won't fit every job")
      if (hk > 0 && back < 1) {
        const m = E.handMatrix(HAND.x, HAND.y - back * 600, HAND.ang, HAND.L, 1);
        ctx.save(); ctx.beginPath(); ctx.arc(PALM[0], PALM[1] - back * 600, HAND.L * 3.2 * expoOut(hk), 0, 6.29); ctx.clip();
        E.lightHand(ctx, m, t, { lum: .76 });
        ctx.restore();
      }
      // labels: one at a time (coordinator 28.10.), all above the subtitle band
      const lo = out(0), LX = 1440, LY = 430;
      G.stamp(ctx, 'PROFIT', PILE.x, PILE.y - 180, smooth(span(t, a.profit - .1, a.profit + .5)) * sOut(t, a.dividend - .5, .5) * lo, { align: 'center' });
      G.stamp(ctx, 'TIME DIVIDEND', LX, LY, smooth(span(t, a.dividend - .1, a.dividend + .6)) * sOut(t, a.country - .5, .6) * lo, { size: 64, align: 'center', col: P.core1 });
      G.stamp(ctx, 'NOT LAW YET', LX, LY, smooth(span(t, a.country, a.country + .6)) * sOut(t, a.notice - .3, .6) * lo, { size: 64, align: 'center', col: P.cream });
      // 10.05: nothing anyone already has is taken: the pile is ringed, untouched
      const ring = smooth(span(t, a.nothing - .2, a.nothing + .8)) * lo;
      if (ring > 0) { ctx.save(); ctx.setLineDash([7, 9]); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(PILE.x, PILE.y - 40, 170, 90, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring); ctx.stroke(); ctx.restore(); }
      G.stamp(ctx, 'UNTOUCHED', PILE.x, PILE.y - 180, smooth(span(t, a.nothing + .3, a.nothing + .9)) * sOut(t, a.newtime - .2, .6) * lo, { align: 'center' });
    });
  }
  function coin(ctx, x, y, r = 8, k = 1) {
    if (k <= 0) return;
    ctx.fillStyle = mixHex(P.cream, P.blue2, .35); ctx.beginPath(); ctx.ellipse(x, y, r * k, r * .42 * k, 0, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 1.2; ctx.stroke();
  }

  // ============================================================================ 10.06–10.07: the hospital corridor; the sheet with two lines
  const DOORS = [260, 560, 860, 1160, 1460, 1760];
  function corridorPic(ctx, c, t) {
    const gone = sink(t, a.but + 1.2, .9), up = (d) => rise(t, a.c17 + .3 + d, .9) * gone;
    const flood = sineIO(span(t, a.but - .1, a.but + 1.6));                    // 10.07: the floor strip rises into the sheet
    low(ctx, c, () => {
      // the wall with its doors (rise from the floor line); the lit door windows; the floor's warm light strip
      const kw = up(0);
      if (kw > 0) fromBase(ctx, FOLK.y, 360, kw, () => {
        ctx.fillStyle = E.lin(ctx, 0, FOLK.y - 330, 0, FOLK.y, [[0, rgba(P.ind1, 0)], [.35, mixHex(P.ind1, P.blue1, .25)], [1, mixHex(P.ind2, P.blue1, .35)]]); ctx.fillRect(-300, FOLK.y - 330, W + 600, 330);
        ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, FOLK.y - 270); ctx.lineTo(W + 300, FOLK.y - 270); ctx.stroke();
        const cx = DOORS[3] + 150, cy = FOLK.y - 300; E.halo(ctx, cx, cy, 60, .35, P.blue0, P.blue2); ctx.fillStyle = mixHex(P.blue2, P.cream, .5); ctx.fillRect(cx - 18, cy - 6, 36, 12); ctx.fillRect(cx - 6, cy - 18, 12, 36);   // the hospital's cross
      });
      DOORS.forEach((x, i) => {
        const k = up(Math.abs(x - 960) / 2500); if (k <= 0) return;
        fromBase(ctx, FOLK.y, 300, k, () => {
          ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x - 60, FOLK.y - 240, 120, 240);
          ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.strokeRect(x - 60, FOLK.y - 240, 120, 240);
          ctx.fillStyle = mixHex(mixHex(P.blue2, P.cream, .4), P.night1, i % 3 === 1 ? .55 : .1); ctx.fillRect(x - 22, FOLK.y - 200, 44, 60);
          E.halo(ctx, x, FOLK.y - 170, 70, i % 3 === 1 ? .08 : .2, P.blue0, P.blue2);
        });
      });
      const ks = expoOut(span(t, a.c17 - .2, a.c17 + 1.0)) * (1 - smooth(span(t, a.but + 1.2, a.but + 2.2)));
      if (ks > 0) {
        ctx.fillStyle = E.lin(ctx, 0, FOLK.y, 0, FOLK.y + 26, [[0, rgba(P.halo0, .55 * ks)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(lerp(1300, -200, ks), FOLK.y, lerp(0, 2300, ks), 26);
        K.trailSpan(ctx, [[lerp(1300, -200, ks), FOLK.y, 2], [lerp(1300, W + 200, ks), FOLK.y, 2]], 0, 1, { w: 2, spark: false, a: .85 });
      }
      // the nurse walks right to left past the doors
      const wk = span(t, a.c17 + 1.2, a.but + .6);
      if (wk > 0) { const x = lerp(1950, 620, wk), h = 250; fromBase(ctx, FOLK.y, h * 1.2, up(.3), () => E.person(ctx, x, FOLK.y, h, { walk: wk * 9 * Math.PI, view: 'side', dir: -1, light: 1, back: .6, rim: mixHex(P.blue0, P.blue2, .5), long: true })); }
    });
    // the sheet rises from the floor strip and covers it all from its left edge (line one is on it; the pen writes line two)
    if (flood > 0) {
      const fy = E.project(c, F0, 0, FOLK.y + LOW)[1];
      const fd = sineIO(span(t, a.but - .1, a.but + 1.1));                     // grows from a zero-height band on the floor strip, both ways
      sheet(ctx, t, { top: lerp(fy, 0, flood), bot: lerp(fy, H + 2, fd), l1: 1, l2: sineIO(span(t, a.perfect - .65, a.normal + .15)) });
      const pin = sineIO(span(t, a.but + .3, a.perfect - .5)), l2 = sineIO(span(t, a.perfect - .65, a.normal + .15)), pout = sineIO(span(t, a.normal + .1, a.END - .55));
      if (pin > 0 && pout < 1) {
        const xe = lerp(380, 1240, l2), tipx = lerp(1700, 380, pin) + (xe - 380), tipy = lerp(-120, lineY(380, 430), pin) + (lineY(xe, 430) - lineY(380, 430));
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); pen(ctx, tipx + pout * 520, tipy - pout * 1000, t); ctx.restore();
      }
    }
  }

  return draw;
}
