// Film 23 · HUD (owned by the lead; drawn by film.mjs over EVERY chunk, after the scenes and the camera float, before the finish).
// Builders never draw the clock or the cards; they keep the reserved zones calm (docs/MOTION.md §9). Builders DO call oldScreen()
// for their clip transitions (it is part of the scene: it sits on the kitchen's light wall and moves with the camera).
//
//   hud(ctx, t)                 the whole HUD for time t (day-clock + evidence cards); film.mjs calls it once per frame
//   prepareHud(T)               once at build: resolves every phrase (hour jumps, card open/close) against the timing
//   dayClock(ctx, t)            the stamp top-left: "2037 · A POSSIBLE TUESDAY" + the time HH:MM + the day dial (sun-dot / moon-dot).
//                               Birth in 1.01 (the big year rolls 2026 → 2037 and shrinks into the stamp); 7 hour jumps (digits roll,
//                               the dot slides on its arc, a 2 % pulse); the year rolls back to an evidence card's year while it is open;
//                               in 12.05 the year grows big over the sky and rolls 2037 → 2026 → 2037 (YEAR_BACK window).
//   CARDS                       the 13 evidence cards (exact text: docs/shots.md §4) with their open phrases
//   evidenceCard(ctx, card, u, y) one drawer at height y, opened u 0..1 (mask from the top edge; no opacity)
//   oldScreen(ctx, t, o)        THE OLD SCREEN on the light wall (docs/MOTION.md §5), drawn in the CALLER's coordinates (a card):
//                               o = { x, y, w (16:9 box in caller units), clip: T.clip('K1'), line: [x0, y0] (where the gold line starts:
//                               your hand), tLine (line starts running), tOn (screen opens; default clip.start − .55) }
//                               phases: line runs up (.6 s) → spreads (.35 s) → opens (.5 s, mask) → footage / placeholder (name card +
//                               transcript) with the ORIGINAL FOOTAGE tab and the lower third → at clip.end collapses to a line (.25 s)
//                               → to a point (.2 s). Returns { phase, point: [x, y] (the carrier after the collapse), open 0..1 }.
//   prepareClips(t)             async: loads footage frames ROOT/clips/<K>/f00001.jpg… if they exist (render.mjs calls film.prepare)
import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, rad } = E;
export const COOL = { core: '#eef3ff', mid: '#b4c8ee', edge: '#6a8cd2', deep: '#2b4a96' };

// ------------------------------------------------------------------------------------------------ layout (screen px, 1920×1080)
export const STAMP = { x: 72, y1: 84, y2: 160, yearSize: 40, labelSize: 16, timeSize: 72 };
export const CARD = { x: 72, y: 196, w: 720 };
export const ZONE = { clock: [60, 40, 420, 180], card: [60, 40, 820, 430] };   // reserved zones (x0, y0, x1, y1)
export const BIG = { x: 196, y: 430, size: 290, labelY: 500, labelSize: 32 };   // the big year of 1.01 (thumbnail A's title space, over the dark wall)

// ------------------------------------------------------------------------------------------------ evidence cards (docs/shots.md §4)
// open: [phrase, fence phrase (searched first) or null]; close: optional phrase (else open + read time); pair: stacks under that card
export const CARDS = [
  { id: 'E1', open: ['hunch', 'Every night'], kicker: 'ALREADY IN USE', place: 'USA', year: 2025, fact: 'One AI research run reads about 1,500 studies', src: 'KOSMOS (EDISON SCIENTIFIC) · ARXIV 2511.02824' },
  { id: 'E2', open: ['single form', 'Noon'], kicker: 'ALREADY BEING BUILT', place: 'UK', year: 2026, fact: 'An AI assistant for government services; agents planned to confirm every step with you', src: 'GOV.UK · ANTHROPIC PILOT, JAN 2026' },
  { id: 'E3', open: ['translate every sentence', "Four o'clock"], kicker: 'ALREADY IN USE', place: 'INDIA', year: 2025, fact: 'Live translation into any headphones, free', src: 'GOOGLE TRANSLATE BETA · DEC 2025' },
  { id: 'E4', open: ['hear it', 'translate every sentence'], pair: 'E3', kicker: 'ALREADY IN USE', place: 'USA', year: 2024, fact: 'Everyday earbuds cleared as hearing aids', src: 'FDA · SEPT 2024' },
  { id: 'E5', open: ['antibiotic in the news', 'stubborn'], kicker: 'ALREADY IN THE LAB', place: 'USA', year: 2025, fact: 'AI-designed antibiotics cured infected mice', src: 'MIT · CELL, AUG 2025' },
  { id: 'E6', open: ['one in five', 'research machines'], kicker: 'ALREADY MEASURED', place: 'USA', year: 2025, fact: 'AI research system: about 1 in 5 claims did not hold up', src: 'KOSMOS · ARXIV 2511.02824' },
  { id: 'E7', open: ['Every new machine', 'people insisted'], kicker: 'ALREADY IN USE', place: 'UK', year: 2025, fact: 'Government testers have checked 30+ frontier AI models, some before release', src: 'AI SECURITY INSTITUTE · DEC 2025' },
  { id: 'E8', open: ['very old rule', 'digital helpers'], close: ['first time politicians', 'very old rule'], kicker: 'ALREADY DRAFTED', place: 'USA', year: 2026, fact: 'Draft bill: AI agents would owe users a “duty of loyalty”', src: 'AI AGENT ACT · DISCUSSION DRAFT, JUNE 2026' },
  { id: 'E9', open: ['loses its keys', 'if it cheats'], kicker: 'ALREADY PLANNED', place: 'ESTONIA', year: 2026, fact: 'Digital IDs for AI agents: “limited, auditable, and revocable authority”', src: 'ESTONIAN INFORMATION SYSTEM AUTHORITY (RIA) · JUNE 2026' },
  { id: 'E10', open: ['luxury', "Grandpa's earbuds"], cool: true, kicker: 'ALREADY IN USE', place: 'USA', year: 2026, fact: 'AI check on a mammogram: $40 extra', src: 'RADNET · 2026' },
  { id: 'E11', open: ['luxury', "Grandpa's earbuds"], delay: .4, pair: 'E10', kicker: 'ALREADY IN USE', place: 'GERMANY', year: 2026, fact: 'AI second look in public breast screening, no extra charge', src: 'PRAIM STUDY · NATURE MEDICINE 2025' },
  { id: 'E12', open: ['Kids who got', 'noticed something'], kicker: 'ALREADY TESTED', place: 'TURKEY', year: 2025, fact: 'Plain chatbot: exam scores 17 % lower without it · tutor with guardrails: no such drop', src: 'BASTANI ET AL. · PNAS 2025' },
  { id: 'E13', open: ['practiced', 'grown-ups'], kicker: 'ALREADY IN USE', place: 'ESTONIA', year: 2026, fact: 'AI in 154 of 156 high schools, teachers trained first', src: 'AI LEAP · E-ESTONIA' },
];
// the hour jumps (phrase → HH:MM)
export const HOURS = [['Six-fifteen', '06:15', 6.25], ['Seven-thirty', '07:30', 7.5], ["Nine o'clock", '09:00', 9], ['Noon', '12:00', 12],
  ["Four o'clock", '16:00', 16], ["Seven o'clock", '19:00', 19], ['Ten-thirty', '22:30', 22.5]];

// ------------------------------------------------------------------------------------------------ resolved times (prepareHud)
export const HT = { ready: false };
export function prepareHud(T) {
  const G = (p, fence) => T.G(p, 0, fence ? T.G(fence) : -1);
  HT.yearLand = T.GE('twenty thirty-seven');                // the big year lands on the word
  HT.started = T.G('already started');
  HT.tuesday = T.G('A Tuesday');
  HT.shrink = T.G('Superintelligence');                     // the big year + label shrink into the stamp
  HT.hours = HOURS.map(([p, s, h], i) => ({ t: i === 0 ? T.G(p) : T.G(p, 0, T.G(HOURS[i - 1][0]) + .5), s, h }));
  const clips = Object.values(T.clips || {}).filter((c) => c.kind !== 'card');
  HT.clips = clips;
  const by = {};
  for (const c of CARDS) {
    const t0 = G(c.open[0], c.open[1]) + (c.delay || 0);
    const chars = c.fact.length + c.kicker.length + c.place.length + 6;
    let t1 = c.close ? G(c.close[0], c.close[1]) : t0 + Math.max(5, chars / 12) + .3;
    by[c.id] = { ...c, t0, t1 };
  }
  // pairs close together (with the later of the two read times); nothing stays open into a clip (closes 1.4 s before the screen opens)
  for (const c of Object.values(by)) if (c.pair) { const a = by[c.pair]; const t1 = Math.max(a.t1, c.t1); a.t1 = t1 + .08; c.t1 = t1; }
  for (const c of Object.values(by)) { const k = clips.find((k) => k.start > c.t0 && k.start - 1.4 < c.t1); if (k) c.t1 = Math.max(c.t0 + 4, k.start - 1.4); }
  HT.cards = Object.values(by);
  // the two subscribe lines (MOTION §13.7): the channel mark settles under the stamp, the day-clock pauses
  HT.subs = [['This channel exists', 'subscribe'], ['If you want a Tuesday', 'this channel is for']].filter(([a]) => T.gHas(a)).map(([a, b]) => { const t0 = T.G(a); return { t0, t1: T.GE(b, 0, t0) + .6 }; });
  HT.yearBack = T.gHas("This Tuesday didn't begin") ? { t0: T.G("This Tuesday didn't begin"), t1: T.G('already started', 0, T.G('who these machines were for')) } : null;
  HT.ready = true;
  return HT;
}

// ------------------------------------------------------------------------------------------------ type helpers
const font = (size, serif, weight = 600) => serif ? `${size}px "Instrument Serif"` : `${weight} ${size}px Inter`;
function txt(ctx, s, x, y, { size = 20, serif = false, col = P.cream, spacing = 0, glow = 0, align = 'left', weight = 600 } = {}) {
  ctx.save(); ctx.font = font(size, serif, weight); ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = spacing ? `${spacing}em` : '0px';
  if (glow) { ctx.shadowColor = rgba(P.halo0, .7 * glow); ctx.shadowBlur = size * .4; ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.shadowBlur = 0; }
  ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore();
}
function measure(ctx, s, size, serif, spacing = 0, weight = 600) { ctx.save(); ctx.font = font(size, serif, weight); ctx.letterSpacing = spacing ? `${spacing}em` : '0px'; const w = ctx.measureText(s).width; ctx.restore(); return w; }
function wrap(ctx, s, size, serif, maxW) {
  const out = []; let cur = '';
  for (const w of s.split(' ')) { const tryS = cur ? cur + ' ' + w : w; if (measure(ctx, tryS, size, serif) > maxW && cur) { out.push(cur); cur = w; } else cur = tryS; }
  if (cur) out.push(cur); return out;
}
// one glyph column that rolls from a to b (u 0..1): a moves up and out, b comes from below; clipped to its cell
function glowOnly(ctx, s, x, y, size, k) {   // the glyph's warm glow alone (no glyph), unclipped: no box edges round a rolling digit
  if (k <= .01) return; ctx.save(); ctx.font = font(size, true); ctx.shadowColor = rgba(P.halo0, .7 * k); ctx.shadowBlur = size * .4; ctx.shadowOffsetX = 20000; ctx.fillStyle = '#000'; ctx.fillText(s, x - 20000, y); ctx.restore();
}
const GM = {};   // per size: the digit box (ascent/descent of the serif figures) and the '0' cell width
function glyphBox(ctx, size) {
  if (GM[size]) return GM[size];
  ctx.save(); ctx.font = font(size, true); const m = ctx.measureText('0123456789'), cw = ctx.measureText('0').width; ctx.restore();
  const asc = m.actualBoundingBoxAscent || size * .7, desc = m.actualBoundingBoxDescent || size * .02;
  return (GM[size] = { asc, desc, cw, step: asc + desc + size * .16 });
}
// one glyph column that rolls from a to b (u 0..1, dir +1: a leaves upwards, b comes from below; dir -1 the other way),
// clipped tight to the figure box so nothing of the neighbour glyph shows above or below the line
function rollGlyph(ctx, a, b, u, x, y, size, o, dir = 1) {
  const B = glyphBox(ctx, size), h = B.step, cw = B.cw;
  const cx = (g) => x + (cw - measure(ctx, g, size, true)) / 2;   // tabular: every glyph centred in a '0' cell
  if (o.glow) { const g = o.glow * (1 - Math.sin(Math.PI * clamp(u))) ** 2, gl = u < .5 ? a : b; glowOnly(ctx, gl, cx(gl), y, size, g); o = { ...o, glow: 0 }; }
  if (u <= 0 || a === b) { txt(ctx, a, cx(a), y, { size, serif: true, ...o }); return; }
  if (u >= 1) { txt(ctx, b, cx(b), y, { size, serif: true, ...o }); return; }
  ctx.save(); ctx.beginPath(); ctx.rect(x - size * .08, y - B.asc - size * .02, cw + size * .16, B.asc + B.desc + size * .04); ctx.clip();
  txt(ctx, a, cx(a), y - dir * h * u, { size, serif: true, ...o }); txt(ctx, b, cx(b), y + dir * h * (1 - u), { size, serif: true, ...o });
  ctx.restore();
}
// a string where every changed glyph rolls (stagger right → left)
function rollText(ctx, from, to, u0, x, y, size, o = {}, dt = 60 / 450) {
  const n = Math.max(from.length, to.length); let cx = x; const wd = measure(ctx, '0', size, true);
  for (let i = 0; i < n; i++) {
    const a = from[i] ?? ' ', b = to[i] ?? ' ', ch = b === ':' || a === ':';
    const u = expoOut(clamp(u0 * (1 + dt * (n - 1)) - dt * (n - 1 - i)));
    const w = ch ? measure(ctx, ':', size, true) : wd;
    if (ch) txt(ctx, ':', cx, y, { size, serif: true, ...o }); else rollGlyph(ctx, a, b, u, cx, y, size, o);
    cx += w + (ch ? size * .04 : size * .02);
  }
  return cx - x;
}
// odometer: from → to in whole steps over p 0..1. Each step is a short clean roll of only the digits that change
// (rolls take 65 % of a step, the rest is a hold), so every frame shows one real year or one year rolling into the next.
function odometer(ctx, from, to, p, x, y, size, o = {}) {
  const n = Math.abs(to - from), dir = Math.sign(to - from) || 1, wd = glyphBox(ctx, size).cw;
  const pos = clamp(p) * n, k = Math.min(Math.floor(pos), n), u = k >= n ? 0 : smooth(clamp((pos - k) / .65));
  const cur = String(from + dir * k).padStart(4, '0'), nxt = String(from + dir * Math.min(k + 1, n)).padStart(4, '0');
  for (let i = 0; i < 4; i++) rollGlyph(ctx, cur[i], nxt[i], cur[i] === nxt[i] ? 0 : u, x + i * (wd + size * .02), y, size, o, dir);
  return 4 * (wd + size * .02);
}

// ------------------------------------------------------------------------------------------------ the day dial
function dial(ctx, cx, cy, r, hour, t, pulse = 0) {
  ctx.save();
  ctx.strokeStyle = rgba(P.halo2, .75); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - r - 8, cy); ctx.lineTo(cx + r + 8, cy); ctx.stroke();
  ctx.setLineDash([2, 5]); ctx.strokeStyle = rgba(P.halo2, .45); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke(); ctx.setLineDash([]);
  const breath = 1 + .08 * Math.sin(t * 1.3) + pulse * .3;
  const dot = (h0, col, glow) => {   // day arc 07 → 19 (sun), night arc 19 → 07 (moon)
    const th = Math.PI * (1 - h0 / 12), x = cx + Math.cos(th) * r, y = cy - Math.sin(th) * r;
    if (th < -.12 || th > Math.PI + .12) return;
    ctx.save(); ctx.beginPath(); ctx.rect(cx - r - 14, cy - r - 14, 2 * r + 28, r + 14); ctx.clip();
    ctx.fillStyle = rad(ctx, x, y, 16 * breath, [[0, rgba(glow, .55)], [1, rgba(glow, 0)]]); ctx.fillRect(x - 20, y - 20, 40, 40);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 5.5 * breath, 0, 6.29); ctx.fill(); ctx.restore();
  };
  dot(((hour - 7) % 24 + 24) % 24, P.core1, P.halo0);
  dot(((hour - 19) % 24 + 24) % 24, P.cream, COOL.mid);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the day-clock stamp
function hourAt(t) {
  const hs = HT.hours; let i = -1; for (let k = 0; k < hs.length; k++) if (t >= hs[k].t) i = k;
  if (i < 0) return { h: 6.25, s: null, prev: null, u: 0, tj: -9 };
  const cur = hs[i], prev = hs[i - 1];
  const u = span(t, cur.t, cur.t + 1.2);
  const h = prev ? lerp(prev.h, cur.h, sineIO(u)) : cur.h;
  return { h, s: cur.s, prev: prev ? prev.s : null, u: span(t, cur.t, cur.t + .45), tj: cur.t, first: i === 0 };
}
function cardYear(t) {   // the year shown in the stamp: an open card rolls it back
  let y = 2037, u = 0;
  for (const c of HT.cards) {
    const k = Math.min(span(t, c.t0, c.t0 + .45), 1 - span(t, c.t1 - .35, c.t1));
    if (k > 0 && (!c.pair)) { y = c.year; u = k; }
  }
  return { y, u };
}
export function dayClock(ctx, t) {
  if (!HT.ready) return;
  const S = STAMP;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // ---- the birth: the big year rolls in (2026 → 2037) and lands on the word, then shrinks into the stamp
  const roll = span(t, .25, HT.yearLand), land = 1 - (1 - roll) ** 2;   // eases out, but every year still reads
  const sh = quartIO(span(t, HT.shrink, HT.shrink + 1.3));
  const lab = span(t, HT.tuesday, HT.tuesday + .6);
  const yb = HT.yearBack ? Math.min(span(t, HT.yearBack.t0, HT.yearBack.t0 + 1.3), 1 - span(t, HT.yearBack.t1 - 1.3, HT.yearBack.t1)) : 0;
  const big = Math.max(1 - sh, quartIO(yb));       // 1 = the big year
  const size = lerp(S.yearSize, BIG.size, big), yx = lerp(S.x, BIG.x, big), yy = lerp(S.y1, BIG.y, big);
  const settle = 1 + .025 * Math.sin(Math.PI * span(t, HT.started, HT.started + .5));
  const glowA = lerp(.5, 1, big);
  ctx.save(); ctx.translate(yx, yy); ctx.scale(settle, settle);
  let yw;
  if (t < HT.yearLand + .05) {
    const rise = expoOut(span(t, 0, .6));   // rises from its baseline (a mask only while rising: no box edge afterwards)
    ctx.save(); if (rise < 1) { ctx.beginPath(); ctx.rect(-size, -size * 1.15 + size * 1.2 * (1 - rise), size * 5, size * 1.4); ctx.clip(); }
    yw = odometer(ctx, 2026, 2037, land, 0, 0, size, { col: P.core0, glow: glowA }); ctx.restore();
  } else if (yb > 0 && HT.yearBack) {   // 12.05: the year rolls back to 2026 and forward again to 2037
    const back = Math.min(span(t, HT.yearBack.t0 + .9, HT.yearBack.t0 + 3.2), 1 - span(t, HT.yearBack.t1 - 3.4, HT.yearBack.t1 - 1.2));
    yw = odometer(ctx, 2037, 2026, sineIO(back), 0, 0, size, { col: P.core0, glow: glowA });
  } else {
    const cy = cardYear(t);
    if (cy.u > 0) yw = rollText(ctx, '2037', String(cy.y), cy.u, 0, 0, size, { col: mixHex(P.core0, P.halo0, .8), glow: glowA });
    else yw = rollText(ctx, '2037', '2037', 1, 0, 0, size, { col: P.core0, glow: glowA });
  }
  ctx.restore();
  // the label: big under the year (1.01), small to the right of the stamp year afterwards
  if (lab > 0) {
    const ls = lerp(S.labelSize, BIG.labelSize, big), lx = lerp(S.x + yw * settle + 14, BIG.x + 6, big), ly = lerp(S.y1 - 4, BIG.labelY, big);
    const lw = measure(ctx, 'A POSSIBLE TUESDAY', ls, false, .28);
    const rise = expoOut(lab);
    ctx.save(); ctx.beginPath(); ctx.rect(lx - 4, ly - ls * 1.1, lw + (big < .5 ? ls * 1.3 : 0) + 10, ls * 1.35); ctx.clip();
    txt(ctx, (big < .5 ? '· ' : '') + 'A POSSIBLE TUESDAY', lx, ly + ls * 1.2 * (1 - rise), { size: ls, spacing: .28, col: P.halo2 });
    ctx.restore();
  }
  // ---- the time + dial (from Six-fifteen on)
  const hr = hourAt(t), sub = HT.subs.find((q) => t >= q.t0 && t < q.t1 + .5), tc = sub ? sub.t0 : t;   // the clock pauses (no breathing)
  if (hr.s && big < .99) {
    const pulse = Math.sin(Math.PI * span(t, hr.tj, hr.tj + .5)) * (hr.first ? 0 : 1);
    ctx.save(); ctx.translate(S.x, S.y2); ctx.scale(1 + .02 * pulse, 1 + .02 * pulse);
    const from = hr.prev || '  :  ', w = rollText(ctx, from, hr.s, hr.u, 0, 0, S.timeSize, { col: P.cream, glow: .8 });
    ctx.restore();
    dial(ctx, S.x + w + 52, S.y2 - 14, 26, hr.h, tc, pulse);
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ evidence cards
const PAD = 26, BAR = 6;
export function cardHeight(ctx, c) { const lines = wrap(ctx, c.fact, 38, true, CARD.w - 2 * PAD - BAR); return 30 + 24 + 14 + 26 + lines.length * 44 + 12 + 22 + PAD; }
export function evidenceCard(ctx, c, u, y = CARD.y) {
  if (u <= 0) return 0;
  const h = cardHeight(ctx, c), x = CARD.x, w = CARD.w, open = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - 4, w + 40, (h + 24) * open); ctx.clip();       // the drawer: a mask, never an opacity
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x + 8, y + 10, w, h);                       // a soft paper shadow
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, P.ind1], [1, mixHex(P.ind1, P.night1, .45)]]); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = rgba(P.cream, .9); ctx.fillRect(x, y, w, 2);
  ctx.fillStyle = c.cool ? COOL.mid : P.halo0; ctx.fillRect(x, y, BAR, h);
  const lines = wrap(ctx, c.fact, 38, true, w - 2 * PAD - BAR);
  const items = [[c.kicker, 30 + 24, { size: 22, spacing: .2, col: c.cool ? COOL.mid : P.halo0 }],
    [`${c.place} · ${c.year}`, 30 + 24 + 30, { size: 20, spacing: .14, col: P.cream }]];
  let yy = 30 + 24 + 30 + 14;
  for (const l of lines) { yy += 44; items.push([l, yy, { size: 38, serif: true, col: P.cream, glow: .35 }]); }
  items.push([c.src, yy + 34, { size: 16, spacing: .12, col: P.halo2 }]);
  items.forEach(([s, ly, o], i) => {   // each line rises from its baseline, 60 ms apart
    const k = expoOut(clamp((u * .45 - .12 - i * .06) / .35));
    if (k <= 0) return;
    const fs = o.size;
    ctx.save(); ctx.beginPath(); ctx.rect(x + BAR, y + ly - fs * 1.05, w, fs * 1.4); ctx.clip();
    txt(ctx, s, x + BAR + PAD, y + ly + fs * 1.1 * (1 - k), o); ctx.restore();
  });
  ctx.restore();
  return h * open;
}
export function evidence(ctx, t) {
  if (!HT.ready) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const tops = {};
  for (const c of HT.cards) {
    if (t < c.t0 - .01 || t > c.t1 + .01) continue;
    const u = Math.min(span(t, c.t0, c.t0 + 1.0), 1 - span(t, c.t1 - .35, c.t1) * 1.0);   // u .45 ≈ fully open mask; text follows
    const y = c.pair && tops[c.pair] != null ? tops[c.pair] + 14 : CARD.y;
    const close = span(t, c.t1 - .35, c.t1);
    const uu = close > 0 ? 1 - expoIn(close) : u;
    const hgt = evidenceCard(ctx, c, uu, y);
    tops[c.id] = y + hgt;
  }
  ctx.restore();
}
// the channel mark for the subscribe lines: a small gold ring with a rising arc (a good takeoff) + THE GOOD TAKEOFF, under the stamp
export function channelMark(ctx, t) {
  if (!HT.ready) return;
  for (const q of HT.subs) {
    if (t < q.t0 || t > q.t1 + .5) continue;
    const u = expoOut(span(t, q.t0 + .1, q.t0 + .9)), out = expoIn(span(t, q.t1, q.t1 + .45)), x = STAMP.x + 22, y = STAMP.y2 + 62, r = 18;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath(); ctx.rect(x - r - 10, y - r - 12, 420, (2 * r + 24) * (1 - out)); ctx.clip();
    E.halo(ctx, x, y, r * 2.2, .35 * u);
    ctx.lineCap = 'round'; ctx.strokeStyle = P.core1; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * u); ctx.stroke();
    const k = span(u, .4, 1); ctx.strokeStyle = P.halo0; ctx.lineWidth = 3;
    ctx.beginPath(); for (let i = 0; i <= 12; i++) { const v = i / 12 * k, px = x - r * .62 + v * r * 1.24, py = y + r * .42 - r * .9 * v * v; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
    const lab = expoOut(span(t, q.t0 + .45, q.t0 + 1.1));
    ctx.beginPath(); ctx.rect(x + r + 12, y - 16, 400, 26); ctx.clip();
    txt(ctx, 'THE GOOD TAKEOFF', x + r + 16, y + 6 + 22 * (1 - lab), { size: 17, spacing: .28, col: P.halo2 });
    ctx.restore();
  }
}
export function hud(ctx, t) { dayClock(ctx, t); evidence(ctx, t); channelMark(ctx, t); }

// ------------------------------------------------------------------------------------------------ the old screen (ORIGINAL FOOTAGE)
const FRAMES = new Map(), NF = new Map();
const framePath = (id, k) => `${ROOT}clips/${id}/f${String(k).padStart(5, '0')}.jpg`;
function nFrames(id) { if (!NF.has(id)) { try { NF.set(id, fs.readdirSync(`${ROOT}clips/${id}`).filter((f) => f.endsWith('.jpg')).length); } catch { NF.set(id, 0); } } return NF.get(id); }
function frameFile(c, t) { const n = nFrames(c.id); if (!n) return null; return framePath(c.id, Math.min(n, Math.max(1, Math.floor((t - c.start) * 30 + 1e-6) + 1))); }
export async function prepareClips(t) {
  for (const c of HT.clips || []) {
    if (t < c.start - 2 || t > c.end + .5) continue;
    const f = frameFile(c, clamp(t, c.start, c.end)); if (!f || FRAMES.has(f) || !fs.existsSync(f)) continue;
    if (FRAMES.size > 6) FRAMES.delete(FRAMES.keys().next().value);
    FRAMES.set(f, await loadImage(fs.readFileSync(f)));
  }
}
const ROLE = (c) => `${(c.role || '').toUpperCase()} · ${(c.label || '').match(/(\d{4})\s*$/)?.[1] || ''}`;
// the clean placeholder until the footage frames exist: a dark recording card with the speaker's name, role and the transcript
function placeholder(ctx, x, y, w, h, c, t) {
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, '#121a3a'], [1, '#0b1029']]); ctx.fillRect(x, y, w, h);
  const k = w / 1488;
  ctx.fillStyle = rgba(P.blue1, .25); ctx.beginPath(); ctx.ellipse(x + w * .5, y + h * .43, w * .07, w * .085, 0, 0, 6.29); ctx.fill();          // a speaker silhouette
  ctx.beginPath(); ctx.ellipse(x + w * .5, y + h * .75, w * .2, h * .2, 0, Math.PI, 0); ctx.fill();
  const words = (c.text || '').split(' '), prog = clamp((t - c.start) / (c.end - c.start)), n = Math.ceil(words.length * clamp(prog * 1.08 + .02));
  const lines = wrap(ctx, c.text || '', 34 * k, true, w * .72);
  let shown = 0, yy = y + h * .2;
  ctx.save(); ctx.textAlign = 'center';
  for (const l of lines) {
    const lw = l.split(' '), vis = lw.slice(0, Math.max(0, n - shown)).join(' '); shown += lw.length;
    if (vis) txt(ctx, vis, x + w * .5 - measure(ctx, l, 34 * k, true) / 2, yy, { size: 34 * k, serif: true, col: rgba(P.cream, .85) });
    yy += 44 * k;
  }
  ctx.restore();
  txt(ctx, 'CLIP SLOT · FOOTAGE PENDING', x + w - 30 * k - measure(ctx, 'CLIP SLOT · FOOTAGE PENDING', 13 * k, false, .2), y + 40 * k, { size: 13 * k, spacing: .2, col: rgba(P.halo2, .55) });
}
export function oldScreen(ctx, t, o) {
  const c = o.clip; if (!c) return { phase: 'none', point: null, open: 0 };
  const { x, y, w } = o, h = w * 9 / 16, cx = x + w / 2, cy = y + h / 2;
  const tOn = o.tOn ?? c.start - .55, tSpread = tOn - .35, tLine = o.tLine ?? tSpread - .6;
  const tOff = c.end, tDot = tOff + .25, tGone = tDot + .2;
  const [lx, ly] = o.line || [cx, y + h * 1.4];
  const lw = Math.max(2, 3 * w / 1488);
  const glowLine = (x0, y0, x1, y1, a = 1) => {
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .35 * a); ctx.lineWidth = lw * 5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = rgba(P.core0, a); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
  };
  if (t < tLine) return { phase: 'idle', point: [lx, ly], open: 0 };
  if (t < tSpread) {   // the gold line runs from your hand up the wall to the frame's centre height
    const u = expoOut(span(t, tLine, tSpread)), px = lerp(lx, cx, u), py = lerp(ly, cy, u);
    glowLine(lx, ly, px, py, 1 - .5 * u); E.halo(ctx, px, py, 18 * w / 1488, .9);
    return { phase: 'line', point: [px, py], open: 0 };
  }
  if (t < tOn) {        // it spreads sideways into one bright horizontal line
    const u = expoOut(span(t, tSpread, tOn)); glowLine(cx - w / 2 * u, cy, cx + w / 2 * u, cy);
    return { phase: 'spread', point: [cx, cy], open: 0 };
  }
  if (t >= tGone) return { phase: 'gone', point: [cx, cy], open: 0 };
  if (t >= tDot) {      // the line shrinks to the point: the carrier
    const u = expoIn(span(t, tDot, tGone)); glowLine(cx - w / 2 * (1 - u), cy, cx + w / 2 * (1 - u), cy); E.halo(ctx, cx, cy, 22 * w / 1488, 1);
    return { phase: 'point', point: [cx, cy], open: 0 };
  }
  const open = t < tOff ? expoOut(span(t, tOn, tOn + .5)) : 1 - expoIn(span(t, tOff, tDot));
  const hh = Math.max(lw, h * open);
  // the frame: lamp-lit lower edge glow, the picture (mask), a 2 px cream edge
  ctx.save();
  ctx.fillStyle = rad(ctx, cx, y + h, w * .55, [[0, rgba(P.halo0, .18 * open)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - w * .1, y + h * .5, w * 1.2, h * .8);
  ctx.beginPath(); ctx.roundRect(x, cy - hh / 2, w, hh, 8 * w / 1488); ctx.save(); ctx.clip();
  const tc = clamp(t, c.start, c.end), f = frameFile(c, tc), im = f && FRAMES.get(f);
  if (im) ctx.drawImage(im, x, y, w, h); else placeholder(ctx, x, y, w, h, c, t);
  ctx.fillStyle = rad(ctx, cx, cy, w * .62, [[.6, rgba('#000000', 0)], [1, rgba('#000000', .06 * 4)]]); ctx.fillRect(x, y, w, h);   // 6 % vignette (edge)
  // label tab (part of the screen from its first frame)
  const k = w / 1488;
  ctx.fillStyle = rgba(P.night0, .85); ctx.fillRect(x + 24 * k, y + 24 * k, measure(ctx, 'ORIGINAL FOOTAGE', 18 * k, false, .25) + 28 * k, 38 * k);
  txt(ctx, 'ORIGINAL FOOTAGE', x + 38 * k, y + 50 * k, { size: 18 * k, spacing: .25, col: P.cream });
  // lower third: wipes up .4–1.0 s after the start, leaves .6 s before the end
  const lt = Math.min(expoOut(span(t, c.start + .4, c.start + 1.0)), 1 - expoIn(span(t, c.end - 1.0, c.end - .6)));
  if (lt > 0) {
    const bx = x + 32 * k, by = y + h - 170 * k, nm = c.name || c.id, rl = ROLE(c);
    const bw = Math.max(measure(ctx, nm, 46 * k, true), measure(ctx, rl, 20 * k, false, .14)) + 60 * k;
    ctx.save(); ctx.beginPath(); ctx.rect(bx - 4, by - 10 * k + 110 * k * (1 - lt), bw + 8, 120 * k); ctx.clip();
    ctx.fillStyle = rgba(P.night0, .72); ctx.fillRect(bx, by, bw, 100 * k);
    ctx.fillStyle = P.halo0; ctx.fillRect(bx, by, 4 * k, 100 * k);
    txt(ctx, nm, bx + 24 * k, by + 50 * k, { size: 46 * k, serif: true, col: P.cream, glow: .4 });
    txt(ctx, rl, bx + 24 * k, by + 82 * k, { size: 20 * k, spacing: .14, col: P.halo2 });
    ctx.restore();
  }
  ctx.restore();
  ctx.lineWidth = 2 * k; ctx.strokeStyle = rgba(P.cream, .8); ctx.stroke();
  ctx.restore();
  return { phase: t < tOff ? 'open' : 'closing', point: [cx, cy], open };
}
