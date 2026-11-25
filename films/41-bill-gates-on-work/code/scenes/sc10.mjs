// Film 41 · c10 · B3 · 'Now look past those twenty' → the end (docs/shots.md 9.01–9.09, A.01, E.01)
//   9.01 ★ the timeline (grown to the centre in c09) sends a spark past the end of its 20-year band; it falls to the horizon and THE FAR
//        END opens: a dawn land (the warmer palette of the good end), fields, many small homes lighting up: ABUNDANCE
//   9.02 two short price lines fall onto a home and a field: CHEAPER HOMES · CHEAPER FOOD; small cyan machines start working the fields
//   9.03 a small group of people on the near hill lights up: ONE TASK STAYS · 9.04 people walk out of the homes and close a ring with
//        them: ORGANIZE · PURPOSE · 9.05 the list rises out of the ground inside the ring: ONE WAY TO BEGIN
//   9.06 one cyan machine at a time flies from the fields into the list and fills a line from the bottom: BY PRICE
//   9.07 the flat silence lane runs along the horizon, a listening dot finds nothing · 9.08 the cold lines clear, every line glows, the
//        ring looks up: EVERY LINE IS STILL OPEN
//   9.09 the dawn sets, the land sinks, the night ground rises with you at your desk at the foot of the list; the dim hand returns to
//        the sky (thumbnail rhyme); the clock leaves; the core lines set word by word
//   A.01 the picture settles into the end-screen layout; small lights come on in windows all round the list; SUBSCRIBE rises, its ring
//        closes on "subscribe" · E.01 S.endScreen (602.48–617.48) takes over frame-identically (my lights hand over to its lights).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
import { bigT } from './sc09.mjs';
import { lab } from './sc08.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER } = F;
const TAU = Math.PI * 2;
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const VIOLET = '#3b2f6e', DUSK = '#2a2258';
const HOR = 560, SUN = [1460, HOR];
// the land: homes and fields (seeded once)
const HOMES = (() => { const r = E.prng(1010), out = []; for (let i = 0; i < 70; i++) { const d = r(), y = HOR + 10 + d * d * 170, x = 60 + r() * 1800, s = 10 + d * 22; out.push({ x, y, s, w: r(), ph: r() * 6 }); } return out.sort((a, b) => a.y - b.y); })();
const FIELDS = [{ x0: 1080, x1: 1560, y0: HOR + 70, y1: HOR + 160 }, { x0: 240, x1: 640, y0: HOR + 50, y1: HOR + 120 }];
const RING = { cx: 960, cy: 790, rx: 290, ry: 66 };
const NR = 28;
// the end screen's own lights (S.endScreen): the SAME seeded positions and flicker, so the hand-over is exact
const ENDWIN = (() => { const r = E.prng(4242), out = []; for (let i = 0; i < 40; i++) { const x = r() * W, y = 700 + r() * 120, s = 4 + r() * 4; if (x > 760 && x < 1160) continue; out.push({ i, x, y, s, f: .3 + r() * .3 }); } return out; })();
const LIST_END = { x: 810, y: 140, w: 300, h: 470 }, DESK_END = { x: 960, y: 790, h: 70 };

export default (T, R) => {
  const G = (p, after = R.a - .01) => T.G(p, 0, after);
  const k = {};
  k.now = R.a; k.past = G('past those', k.now); k.twenty = G('twenty years', k.now);
  k.far = G('At the far end'); k.sees = G('sees abundance', k.far); k.abund = G('abundance', k.sees);
  k.cheapH = G('Cheaper homes'); k.homes = G('homes', k.cheapH); k.cheapF = G('cheaper food', k.homes); k.food = G('food', k.cheapF); k.because = G('because most goods', k.cheapH); k.labor = G('human labor', k.because);
  k.one = G('And one task stays'); k.task = G('task', k.one); k.stays = G('stays with', k.one); k.peopleW = G('people', k.stays);
  k.humanity = G('Humanity, he says'); k.organize = G('organize', k.humanity); k.purpose = G('purpose', k.organize);
  k.listLike = G('A list like Human Reserved'); k.oneWay = G('one way', k.listLike); k.begin = G('begin', k.oneWay);
  k.but = G('But a list nobody writes'); k.nobody = G('nobody', k.but); k.writes = G('writes', k.nobody); k.filled = G('filled in', k.but);
  k.byPrice = G('By price', k.but); k.priceW = G('price', k.byPrice); k.oneCheap = G('One cheaper machine', k.byPrice); k.cheaper = G('cheaper', k.oneCheap); k.machine = G('machine at', k.oneCheap); k.time = G('time', k.machine);
  k.soFar = G('And so far, Gates says'); k.hears = G('what he hears', k.soFar); k.silence = G('silence', k.hears);
  k.which = G('Which means every line'); k.every = G('every line', k.which); k.lineW = G('line', k.every); k.still = G('still open', k.which); k.open = G('open', k.still);
  k.q = G('The question is no longer');
  k.its = G("It's what goes on the list", k.q); k.who = G('And who gets to write', k.its);
  k.chan = G('This channel exists'); k.arrival = G('arrival', k.chan); k.say = G('gets a say', k.chan); k.human = G('stays human', k.say); k.want = G('Want that too', k.chan); k.sub = G('subscribe', k.want);
  const T0E = T.duration - 15, big = bigT(T);
  const core1 = T.GW('The question is no longer', 'can do', k.q - .1), core2 = T.GW("It's what goes", 'the list', k.its - .1), core3 = T.GW('And who gets', 'write it', k.who - .1);
  const CORE = [
    { words: ['THE', 'QUESTION', 'IS', 'NO', 'LONGER', 'WHAT', 'AI', 'CAN', 'DO.'], at: [0, 1, 2, 3, 4, 5, 6, 8, 9].map((j) => core1[j].s), gold: [] },
    { words: ['IT’S', 'WHAT', 'GOES', 'ON', 'THE', 'LIST.'], at: core2.map((w) => w.s), gold: [5] },
    { words: ['AND', 'WHO', 'GETS', 'TO', 'WRITE', 'IT.'], at: core3.map((w) => w.s), gold: [4] },
  ];

  // ------------------------------------------------------------------ states
  const dawnU = (t) => sineIO(span(t, k.far - .1, k.abund + .2)) * (1 - sineIO(span(t, k.open + .4, k.q + .3)));
  const landUp = (t) => span(t, k.far, k.abund);                                     // the land layers rise into place (stagger inside)
  const drop = (t) => 760 * expoIn(span(t, k.open + .5, k.q + .25));                // 9.09: the land sinks
  const horU = (t) => sineIO(span(t, k.past + 1.05, k.far + .55));                  // the horizon line spreads from where the spark lands
  const ringU = (t) => span(t, k.humanity - .3, k.organize + .6);
  const night = (t) => quartIO(span(t, k.open + .7, k.q + .6));                       // the night ground with your desk rises
  const settle = (t) => quartIO(span(t, k.chan + .1, k.chan + 2.3));                  // A.01: into the end-screen layout
  const handIn = (t) => quartIO(span(t, k.open + .6, k.q + 1.2)), handOut = (t) => expoIn(span(t, k.chan, k.chan + 1.3));
  const tlOut = (t) => expoIn(span(t, k.open + .4, k.q + .3));
  const fillSteps = () => [k.filled, k.priceW, k.cheaper, k.time];
  const fillU = (t) => fillSteps().reduce((s, ts) => s + sineIO(span(t, ts, ts + .35)), 0) / 6 * (1 - sineIO(span(t, k.every - .1, k.every + .7)));

  // ------------------------------------------------------------------ the dawn land
  function sky(ctx, t) {
    const u = dawnU(t); if (u <= 0) return;
    const hy = HOR + drop(t) * .25;
    ctx.save();
    const q = hy / H;   // one gradient over the whole frame: below the horizon it fades out (no edge when the land sinks)
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, rgba(DUSK, .55 * u)], [q * .5, rgba(VIOLET, .6 * u)], [q * .82, rgba(mixHex(VIOLET, GOLD.mid, .55), .65 * u)], [q, rgba(GOLD.body, .8 * u)], [Math.min(1, q + .3), rgba(GOLD.body, 0)]]);
    ctx.fillRect(0, 0, W, H);
    const sy = hy + 70 * (1 - u);
    halo(ctx, SUN[0], sy, 620, .45 * u, GOLD.halo, GOLD.core);
    ctx.beginPath(); ctx.rect(0, 0, W, hy); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, sy - 50, 0, sy + 50, [[0, GOLD.core], [1, GOLD.body]]); ctx.globalAlpha = u; ctx.beginPath(); ctx.arc(SUN[0], sy, 52, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function land(ctx, t) {
    const u = dawnU(t), up = landUp(t), d = drop(t); if (up <= 0 || d > 700) return;
    ctx.save(); ctx.translate(0, d);
    const lay = (i) => expoOut(span(up, i * .18, .55 + i * .18));
    const warm = (c, a) => mixHex(c, GOLD.shade, a * u);
    // far hills
    let l = lay(0); ctx.save(); ctx.translate(0, 60 * (1 - l)); ctx.globalAlpha *= l;
    ctx.fillStyle = lin(ctx, 0, HOR - 30, 0, HOR + 60, [[0, warm(mixHex(P.ind1, VIOLET, .6), .25)], [1, mixHex(P.night1, VIOLET, .4)]]);
    ctx.beginPath(); ctx.moveTo(0, HOR + 6); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, HOR - 14 - 16 * Math.sin(x / 260 + 1) - 10 * Math.sin(x / 97)); ctx.lineTo(W, HOR + 80); ctx.lineTo(0, HOR + 80); ctx.closePath(); ctx.fill();
    ctx.restore();
    // mid land with fields
    l = lay(1); ctx.save(); ctx.translate(0, 80 * (1 - l)); ctx.globalAlpha *= l;
    ctx.fillStyle = lin(ctx, 0, HOR, 0, HOR + 200, [[0, warm(mixHex(P.night1, VIOLET, .55), .2)], [1, mixHex(P.night0, VIOLET, .3)]]);
    ctx.beginPath(); ctx.moveTo(0, HOR + 30); ctx.bezierCurveTo(500, HOR + 5, 1200, HOR + 40, W, HOR + 12); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    for (const f of FIELDS) for (let j = 0; j < 7; j++) {
      const y0 = lerp(f.y0, f.y1, j / 7), y1 = lerp(f.y0, f.y1, (j + .55) / 7), sk = (f.y1 - f.y0) * .4;
      ctx.fillStyle = rgba(mixHex(GOLD.shade, AMBER.body, j % 2 ? .2 : .5), (.28 + .2 * u) * (j % 2 ? .7 : 1));
      ctx.beginPath(); ctx.moveTo(f.x0 + sk * (1 - j / 7), y0); ctx.lineTo(f.x1 + sk * (1 - j / 7), y0); ctx.lineTo(f.x1 + sk * (1 - (j + .55) / 7), y1); ctx.lineTo(f.x0 + sk * (1 - (j + .55) / 7), y1); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    // the homes: each lights its window (from the sun outward)
    for (const h of HOMES) {
      const ld = lay(h.y > HOR + 90 ? 2 : 1), on = sineIO(span(t, k.sees - .3 + Math.hypot(h.x - SUN[0], h.y - SUN[1]) / 1400, k.sees + .2 + Math.hypot(h.x - SUN[0], h.y - SUN[1]) / 1400));
      if (ld <= 0) continue;
      ctx.save(); ctx.globalAlpha *= ld; ctx.translate(h.x, h.y + 60 * (1 - ld));
      const s = h.s; ctx.fillStyle = mixHex(P.night1, VIOLET, .5);
      ctx.beginPath(); ctx.moveTo(-s * .6, 0); ctx.lineTo(-s * .6, -s * .7); ctx.lineTo(0, -s * 1.2); ctx.lineTo(s * .6, -s * .7); ctx.lineTo(s * .6, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(GOLD.line, .35 * u); ctx.fillRect(-s * .6, -s * .72, s * 1.2, Math.max(1, s * .06));
      if (on > 0) { const fl = .85 + .15 * Math.sin(t * (.6 + h.w) + h.ph); halo(ctx, 0, -s * .38, s * 1.4, .35 * on * fl, AMBER.body, AMBER.core); ctx.fillStyle = rgba(AMBER.hot, on * fl); ctx.fillRect(-s * .18, -s * .55, s * .36, s * .3); }
      ctx.restore();
    }
    // the near ground (the ring stands on it)
    l = lay(2); ctx.save(); ctx.translate(0, 100 * (1 - l)); ctx.globalAlpha *= l;
    ctx.fillStyle = lin(ctx, 0, HOR + 170, 0, H, [[0, warm(mixHex(P.night1, VIOLET, .35), .12)], [1, P.night0]]);
    ctx.beginPath(); ctx.moveTo(0, HOR + 200); ctx.bezierCurveTo(600, HOR + 150, 1300, HOR + 160, W, HOR + 210); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    ctx.restore();
    // 9.02 the machines in the fields (cyan, small, working the rows from "no longer depend on human labor")
    const mu = span(t, k.labor - .6, k.labor + .2);
    if (mu > 0) for (let i = 0; i < 9; i++) {
      const f = FIELDS[i % 2], row = (i * 3) % 7, y = lerp(f.y0, f.y1, (row + .3) / 7), span0 = f.x1 - f.x0, x = f.x0 + ((i * 97 + (t - k.labor) * (40 + i * 6)) % span0) + (f.y1 - f.y0) * .4 * (1 - row / 7);
      const used = fillSteps().findIndex((ts, j) => j === (i % 4) && i < 4 && t > ts - .45);   // the four that fly into the list (9.06) leave the field
      if (used >= 0) continue;
      ctx.save(); ctx.globalAlpha *= mu; halo(ctx, x, y - 6, 22, .4, MACH.halo, MACH.core); ctx.fillStyle = MACH.hot; ctx.beginPath(); ctx.roundRect(x - 9, y - 12, 18, 10, 3); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }
  // 9.01 the spark: along the big band, past its end, down to the horizon
  function spark(ctx, t) {
    const a = span(t, k.past - .1, k.twenty + .2), b = quartIO(span(t, k.twenty + .2, k.past + 1.15)); if (a <= 0 || b >= 1 && horU(t) >= 1) return;
    const bx0 = 352 + 470 * 1.9, bx1 = 352 + 640 * 1.9, by = 150;
    let x, y;
    if (b <= 0) { x = lerp(bx0, bx1, sineIO(a)); y = by; }
    else { x = lerp(bx1, SUN[0], b) + 160 * Math.sin(Math.PI * b); y = lerp(by, HOR, b * b); }
    if (b < 1) { halo(ctx, x, y, 50, .8, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); }
    const h = horU(t);
    if (h > 0) { const hx0 = lerp(SUN[0], 0, h), hx1 = lerp(SUN[0], W, h); F.goldSpan(ctx, [[hx0, HOR], [hx1, HOR]], 0, 1, { w: 2.4, spark: false, a: 1 - span(t, k.sees, k.abund + .4) }); }
  }
  // 9.02 price lines fall onto a home and a field
  const HOME = { x: 600, y: HOR + 95, s: 42 }, FIELDP = { x: 1330, y: HOR + 80 };
  function priceLines(ctx, t) {
    const out = span(t, k.one - .4, k.one + .1); if (t < k.cheapH - .4 || out >= 1) return;
    const d = drop(t);
    // the home (drawn larger, in front)
    const hu = span(t, k.cheapH - .4, k.cheapH);
    if (hu > 0) { ctx.save(); ctx.globalAlpha *= hu * (1 - out); const s = HOME.s; ctx.translate(HOME.x, HOME.y + d);
      ctx.fillStyle = mixHex(P.night1, VIOLET, .5); ctx.beginPath(); ctx.moveTo(-s * .6, 0); ctx.lineTo(-s * .6, -s * .7); ctx.lineTo(0, -s * 1.2); ctx.lineTo(s * .6, -s * .7); ctx.lineTo(s * .6, 0); ctx.closePath(); ctx.fill();
      halo(ctx, 0, -s * .4, s * 1.4, .35, AMBER.body, AMBER.core); ctx.fillStyle = AMBER.hot; ctx.fillRect(-s * .18, -s * .55, s * .36, s * .3); ctx.restore(); }
    [[HOME.x, HOME.y - HOME.s * 1.25, k.homes, 'CHEAPER HOMES', HOME.y + 56], [FIELDP.x, FIELDP.y - 10, k.food, 'CHEAPER FOOD', FIELDP.y + 110]].forEach(([x, y, ts, txt, ly], i) => {
      const u = span(t, ts - .5, ts - .2), f = quartIO(span(t, ts - .2, ts + .55)); if (u <= 0) return;
      const yy = lerp(y - 150, y - 8, f) + d;
      ctx.save(); ctx.globalAlpha *= u * (1 - out); ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 60, yy); ctx.lineTo(x + 60, yy); ctx.stroke(); ctx.restore();
      lab(ctx, 'PRICE', x - 60, yy - 12, u, { size: 22, col: CREAM, out });
      F.heavy(ctx, txt, x, ly + d, 44, span(t, ts - .25, ts + .3), { align: 'center', gold: .3, out });
    });
  }
  // 9.03–9.08 the people and the ring; the list inside it
  const PEOPLE = (() => { const r = E.prng(3131), out = []; for (let i = 0; i < NR; i++) {
    const a = Math.PI * .5 + i / NR * TAU, rx = RING.cx + Math.cos(a) * RING.rx, ry = RING.cy + Math.sin(a) * RING.ry;
    const group = i < 5, h = HOMES[Math.floor(r() * HOMES.length)];
    out.push({ group, tx: rx, ty: ry, sx: group ? RING.cx - 90 + i * 45 : h.x, sy: group ? RING.cy - 10 + (i % 2) * 14 : h.y, d: r() * .9, a }); } return out; })();
  function people(ctx, t) {
    if (t < k.one - .3) return;
    const d = drop(t), ru = ringU(t), gu = span(t, k.task - .3, k.task + .4);
    const order = PEOPLE.map((p) => ({ p, y: lerp(p.sy, p.ty, smooth(span(ru, p.d * .4, .6 + p.d * .4))) })).sort((a, b) => a.y - b.y);
    for (const { p } of order) {
      const m = p.group ? quartIO(span(ru, 0, .7)) : quartIO(span(ru, p.d * .4, .6 + p.d * .4));
      const vis = p.group ? gu : span(ru, p.d * .4, p.d * .4 + .15); if (vis <= 0) continue;
      const x = lerp(p.sx, p.tx, m), y = lerp(p.sy, p.ty, m) + d, walk = Math.sin(m * 30 + p.d * 6) * 3 * Math.sin(Math.PI * m);
      const look = 8 * span(t, k.every, k.every + .6) * (1 - span(t, k.open + .3, k.q)), s = lerp(16, 38, clamp((y - d - HOR) / 260));
      ctx.save(); ctx.globalAlpha *= vis;
      halo(ctx, x, y - s * .4, s * 1.5, .3 + .2 * gu * (p.group ? 1 : 0), AMBER.body, AMBER.core);
      F.glyph(ctx, 'person', x, y - s * .45 - Math.abs(walk) - look, s, mixHex(AMBER.body, AMBER.hot, .3));
      ctx.restore();
    }
  }
  const LISTR = { x: 850, y: 330, w: 220, h: 440 }, LISTF = { x: 1190, y: 390, w: 220, h: 440 };
  const listU = (t) => sineIO(span(t, k.listLike + .1, k.oneWay + .2));
  const toF = (t) => quartIO(span(t, k.open + .5, k.q + .9));
  const mixB = (p, q, u) => ({ x: lerp(p.x, q.x, u), y: lerp(p.y, q.y, u), w: lerp(p.w, q.w, u), h: lerp(p.h, q.h, u) });
  const listBox = (t) => mixB(mixB(LISTR, LISTF, toF(t)), LIST_END, settle(t));
  function theList(ctx, t) {
    const u = listU(t); if (u <= 0) return;
    const b = listBox(t);
    F.list(ctx, t, b.x, b.y, b.w, b.h, { n: 6, u, lit: 2, head: 1, fill: fillU(t), a: 1 });
    // 9.08 every line glows (it fades out before the end screen's own lit line takes over)
    const g = span(t, k.lineW - .1, k.lineW + .5) * (1 - span(t, k.q + 1, k.q + 2.5));
    if (g > 0) for (let i = 0; i < 6; i++) { const L = { x0: b.x + b.w * .11, x1: b.x + b.w * .89, y: b.y + b.h * .25 + b.h * .7 * (i + .5) / 6 }, p = .6 + .4 * Math.sin(t * 2.4 + i * .9);
      halo(ctx, (L.x0 + L.x1) / 2, L.y, b.w * .4, .22 * g * p, GOLD.halo, GOLD.core); F.goldSpan(ctx, [[L.x0, L.y], [L.x1, L.y]], 0, 1, { w: 2.4, spark: false, a: .6 * g * p }); }
    // 9.06: one cyan machine at a time flies from the field into the list and becomes its cold line
    fillSteps().forEach((ts, j) => {
      const q = span(t, ts - .45, ts + .05); if (q <= 0 || q >= 1) return;
      const f = FIELDS[j % 2], sx = lerp(f.x0, f.x1, .3 + .15 * j), sy = lerp(f.y0, f.y1, .5), L = { x: (b.x + b.x + b.w) / 2, y: b.y + b.h * .25 + b.h * .7 * (5 - j + .5) / 6 };
      const x = lerp(sx, L.x, quartIO(q)), y = lerp(sy, L.y, quartIO(q)) - 120 * Math.sin(Math.PI * q);
      halo(ctx, x, y, 40, .6, MACH.halo, MACH.core); ctx.fillStyle = MACH.hot; ctx.beginPath(); ctx.roundRect(x - 9, y - 6, 18, 10, 3); ctx.fill();
    });
  }
  // 9.07 the silence lane along the horizon (H.11): flat, a listening dot runs it and finds nothing
  function silence(ctx, t) {
    const u = sineIO(span(t, k.soFar, k.soFar + 1.2)), out = expoIn(span(t, k.every - .2, k.every + .4)); if (u <= 0 || out >= 1) return;
    const y = HOR - 2 + 40 * out;
    ctx.save(); ctx.globalAlpha *= 1 - out; ctx.fillStyle = rgba(CREAM, .7); ctx.beginPath(); ctx.roundRect(100, y - 1.5, (W - 200) * u, 3, 1.5); ctx.fill();
    const q = sineIO(span(t, k.hears, k.silence + 1)); if (q > 0 && q < 1) { const dx = lerp(100, W - 100, q); halo(ctx, dx, y, 40, .5, P.halo2, CREAM); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(dx, y, 6, 0, TAU); ctx.fill(); }
    ctx.restore();
    lab(ctx, 'SILENCE', 100, y - 20, span(t, k.silence - .1, k.silence + .5), { size: 26, col: CREAM, out });
  }

  // ------------------------------------------------------------------ 9.09 the final picture, A.01 the settle
  const HAND = { x: 1660, y: 215, L: 240 };
  function nightGround(ctx, t) {
    const n = night(t); if (n <= 0) return;
    const dropG = 320 * (1 - n) + 320 * expoIn(span(t, k.chan + .1, k.chan + 1.5)), gy = S.SKY_YOU.y;
    if (dropG < 320) {
      ctx.save(); ctx.translate(0, dropG);
      ctx.fillStyle = lin(ctx, 0, gy - 60, 0, H, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]);
      ctx.beginPath(); ctx.moveTo(0, gy - 30); ctx.bezierCurveTo(W * .3, gy - 50, W * .7, gy - 20, W, gy - 44); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      const r = E.prng(4141);
      for (let i = 0; i < 26; i++) { const x = r() * W, y = gy - 36 - r() * 18, s = 5 + r() * 5, on = .5 + .5 * Math.sin(t * (.3 + r() * .4) + i); if (Math.abs(x - 1070) < 180) continue;
        ctx.fillStyle = rgba(AMBER.body, .35 + .3 * on); ctx.fillRect(x, y, s, s * 1.2); }
      ctx.restore();
    }
  }
  function youDesk(ctx, t) {
    const n = night(t); if (n <= 0) return;
    const s = settle(t), x = lerp(1070, DESK_END.x, s), y = lerp(905, DESK_END.y, s) + 320 * (1 - n), h = Math.exp(lerp(Math.log(120), Math.log(DESK_END.h), s));
    F.desk(ctx, t, x, y, h, { look: lerp(.2 + .5 * span(t, k.who, k.who + 1), .6, s) });
  }
  function theHand(ctx, t) {
    const i = handIn(t), o = handOut(t); if (i <= 0 || o >= 1) return;
    const wx = HAND.x + 620 * (1 - i) + 620 * o, wy = HAND.y - 520 * (1 - i) - 520 * o;
    F.hand(ctx, t, wx, wy, HAND.L, { turn: 1, lum: .2, dust: .3 });
  }
  function lights(ctx, t, w = 1) {   // A.01 small lights come on in windows all round the list (the end screen's own windows)
    for (const L of ENDWIN) {
      const rank = Math.hypot(L.x - 960, L.y - 400) / 1000, on = span(t, k.arrival + rank * 5.2, k.arrival + rank * 5.2 + .5) * w; if (on <= 0) continue;
      ctx.fillStyle = rgba(AMBER.body, (.25 + .2 * Math.sin(t * L.f + L.i)) * on); ctx.fillRect(L.x, L.y, L.s, L.s * 1.2);
    }
  }
  const pillU = (t) => span(t, k.want - .2, k.want + .7);
  function words(ctx, t) {
    F.heavy(ctx, 'ABUNDANCE', 960, 330, 110, span(t, k.abund - .4, k.abund + .4) ** 2,   // squared: the kit's expoOut rise popped a 110 px word in one frame
      { align: 'center', gold: .8, out: span(t, k.cheapH - .7, k.cheapH - .3) });
    F.say(ctx, t, [['ONE', k.task - .2], ['TASK', k.task], ['STAYS', k.stays]], 960, 300, { size: 72, align: 'center', gold: [1], out: k.humanity - .5 });
    F.say(ctx, t, [['ORGANIZE', k.organize], ['·', k.organize + .5], ['PURPOSE', k.purpose]], 960, 300, { size: 80, align: 'center', gold: [2], out: k.listLike - .6 });
    F.say(ctx, t, [['ONE', k.oneWay], ['WAY', k.oneWay + .22], ['TO', k.begin - .1], ['BEGIN', k.begin]], 140, 300, { size: 60, gold: [3], out: k.but - .5 });
    F.say(ctx, t, [['NOBODY', k.nobody], ['WRITES', k.writes], ['IT', k.writes + .2]], 140, 300, { size: 60, out: k.byPrice - .7 });
    F.say(ctx, t, [['BY', k.byPrice], ['PRICE.', k.priceW]], 140, 300, { size: 60, out: k.soFar - .3 });
    F.say(ctx, t, [['ONE', k.oneCheap], ['CHEAPER', k.cheaper], ['MACHINE', k.machine], ['AT', k.machine + .5], ['A', k.time - .05], ['TIME', k.time]], 140, 372, { size: 46, col: MACH.hot, out: k.soFar - .25 });
    F.say(ctx, t, [['EVERY', k.every], ['LINE', k.lineW], ['IS', k.lineW + .4], ['STILL', k.still], ['OPEN', k.open]], 960, 300, { size: 72, align: 'center', gold: [4], out: k.open + .6 });
    CORE.forEach((c, i) => F.say(ctx, t, c.words.map((w, j) => [w, c.at[j]]), 110, 330 + i * 84, { size: 50, gold: c.gold, out: k.chan - .4 + i * .08 }));
  }

  const hold = (t) => 1 + .025 * sineIO(span(t, k.sub + .6, T.duration));   // one slow push from after the call through the end screen (moving hold)
  const draw = (ctx, t) => {
    F.stage(ctx, t, { n: 90 });
    ctx.save(); ctx.translate(960, 400); ctx.scale(hold(t), hold(t)); ctx.translate(-960, -400);
    sky(ctx, t);
    spark(ctx, t);
    land(ctx, t);
    priceLines(ctx, t);
    silence(ctx, t);
    nightGround(ctx, t);
    lights(ctx, t);
    theList(ctx, t);
    people(ctx, t);
    youDesk(ctx, t);
    theHand(ctx, t);
    words(ctx, t);
    ctx.restore();
    F.subscribe(ctx, t, S.END_TILES.sub.x, S.END_TILES.sub.y, pillU(t), { size: .9, ring: span(t, k.sub, k.sub + .5) });
    const tlo = tlOut(t); if (tlo < 1) F.timeline(ctx, t, T, { big: big(t), dy: -220 * tlo });
  };
  // E.01 the end screen (lead's S.endScreen), my lights hand over to its own (same seeded windows: their sum stays even), the pill stays
  const endDraw = (ctx, t) => {   // + a slow push about the list (the same moving hold as before T0E: frame-identical at T0E; the free tile areas drift < 25 px)
    const z = hold(t);
    ctx.save(); ctx.translate(960, 400); ctx.scale(z, z); ctx.translate(-960, -400);
    S.endScreen(ctx, t, T); ctx.restore();
    ctx.save(); ctx.translate(960, 400); ctx.scale(z, z); ctx.translate(-960, -400);
    const u = span(t, T0E, T0E + 1.2);
    for (const L of ENDWIN) { ctx.fillStyle = rgba(AMBER.body, (.25 + .2 * Math.sin(t * L.f + L.i)) * (1 - u)); ctx.fillRect(L.x, L.y, L.s, L.s * 1.2); }
    ctx.restore();
    F.subscribe(ctx, t, S.END_TILES.sub.x, S.END_TILES.sub.y, 1, { size: .9, ring: 1 });
  };
  return [{ t: R.a, draw, print: F.PRINT41 }, { t: T0E, draw: endDraw, print: F.PRINT41 }];
};
