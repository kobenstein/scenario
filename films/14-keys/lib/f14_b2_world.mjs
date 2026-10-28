// Film 14 · B2 · c05 + c06 (shots 5.01–6.13) as ONE plan sequence, shared by scenes/sc05.mjs and scenes/sc06.mjs so the c05|c06
// seam is the same function at the same t. Plan: docs/shots.md · rules: docs/MOTION.md · kit: lib/f14_kit.mjs. NO KEYS anywhere here.
//
// | ID     | anchor (word)                 | picture (one idea)                                                              | 1–2 moves            | → carrier          |
// |--------|-------------------------------|---------------------------------------------------------------------------------|----------------------|--------------------|
// | seam   | T.seg('s08').start            | plateScreen: the warm file on the console screen (lead's plate, drawn .5 s)     | –                    | the file           |
// | 5.01   | Polite · Helpful · Flawless   | the file widens into a TEST SHEET; its numbers flow onto three baselines; one   | push · checks        | plan sequence      |
// |        |                               | word + one gold check per beat                                                  |                      |                    |
// | 5.02   | hiding · yes                  | a second page peeks out under the sheet (cool rim: something hidden); on yes    | page peeks · flip up | plan sequence      |
// |        |                               | the sheet flips up like a pad page: under it, the code page                    |                      |                    |
// | 5.03   | January · hidden rule         | the CODE PAGE OF LIGHT: lines run in, ANTHROPIC · JANUARY 2024, a YEAR field    | lines run in         | plan sequence      |
// | 5.04   | twenty-three · safe code      | the year rolls to 2023; a warm wave makes every line safe · SAFE CODE           | roll · lines warm    | plan sequence      |
// | 5.05 ★ | twenty-four · flaws           | the year rolls to 2024; three fine cool gaps open in three lines; then the card | roll · gaps · truck  | plan sequence      |
// |        |                               | “2023” → safe code / “2024” → hidden flaws                                     |                      |                    |
// | 5.06   | train · Three · stayed        | three warm waves wash the page (three dots fill); the gaps stay; the main one   | three waves          | plan sequence      |
// |        |                               | (the sleeper) pulses                                                            |                      |                    |
// | 5.07   | proof · over                  | the test sheet comes back down over the page; three gold checks; a cool glint   | sheet lies down      | plan sequence      |
// |        |                               | shows through where the gap is                                                  |                      |                    |
// | 5.08   | backfired · trigger · hid     | sheet up again; a targeted beam on the gap; instead of closing, smooth patches  | beam · patches       | plan sequence      |
// |        |                               | slide over the gaps (hidden better); the year field pulses (the trigger)        |                      |                    |
// | 5.09   | planted · own                 | card: Planted on purpose, / as a test.                                         | truck · card         | plan sequence      |
// | 5.10   | limit · look safe · wakes     | year back to 2023, a gold check (looks safe), a month row runs; on wakes the    | months run · wake    | plan sequence      |
// |        |                               | year rolls to 2024 and the patches crack: the gaps glow                         |                      |                    |
// | 5.11   | wash · look inside            | a LENS (ring of light, dark field) glides in from the left onto the sleeper;    | lens glides          | the lens (match)   |
// |        |                               | inside it the lines are clear and the gap is plain                              |                      |                    |
// | 6.01   | March · rhyme                 | the lens widens over the whole page; inside, the code lines settle onto two     | lens widens          | plan sequence      |
// |        |                               | baselines · ANTHROPIC · MARCH 2025                                             |                      |                    |
// | 6.02   | carrot · grab                 | line 1 writes itself word by word; “grab it” is warm and gets a dot            | words rise           | plan sequence      |
// | 6.03 ★ | waiting · Rabbit              | at the END of the empty second line a plan slot: “rabbit” glows in it and a    | slot · word · bracket| plan sequence      |
// |        |                               | rhyme bracket joins grab it ↔ rabbit, BEFORE the line is written               |                      |                    |
// | 6.04   | hunger · rabbit               | line 2 writes itself and lands exactly on the planned word                     | words rise           | plan sequence      |
// | 6.05   | reached · rabbit              | tweezers (indigo, rim light) take “rabbit” out, park it below; line 2 sinks    | tweezers             | plan sequence      |
// | 6.06   | habit                         | a new plan word: “habit”; a new line (light dashes) ends on it; bracket closes | word · line          | plan sequence      |
// | 6.07   | Green · rhyme                 | tweezers plant “green” (cool): habit and rabbit are pushed down; the line ends | tweezers · bracket   | plan sequence      |
// |        |                               | on green; the bracket breaks (cool, dashed): grab it → rabbit / habit / green  |                      |                    |
// | 6.08   | seen · moved                  | pull back: the whole plan inside the lens; on seen the slot glows, on moved it  | pull back            | plan sequence      |
// |        |                               | shifts                                                                          |                      |                    |
// | 6.09   | microscope · pieces           | the plan condenses into three bright pieces in a dark field of numbers; the     | condense · reticle   | plan sequence      |
// |        |                               | lens gets a reticle (cross + ticks): a microscope view · AI MICROSCOPE          |                      |                    |
// | 6.10   | sleeper · right way           | the sleeper gap waits in the dark, outside the pieces; the pointer turns to it  | pointer turns        | plan sequence      |
// | 6.11   | MRI · five to ten             | an MRI of light (slices) builds half; timeline 2025 → +5–10 YEARS (dashed)     | slices · timeline    | plan sequence      |
// | 6.12   | holding · itself · checker    | pull back: the lens is the ROUND WINDOW of a lab at night; the lab light comes  | pull back · light on | plan sequence      |
// |        |                               | on (a silhouette inside); a second, dark building on the right; you below       |                      |                    |
// | 6.13   | subscribe                     | calm push to the window; the silhouette walks off; the window breathes         | push                 | plateWindow (B3)   |
// | seam   | T.seg('s14').start            | plateWindow: the round lab window, you small below (lead's plate, drawn .5 s)   | –                    | the window         |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as X from './f14_kit.mjs';
import { plateScreen, plateWindow, PLATE_FILE, PLATE_WINDOW, SEAM_HALF } from './f14_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, card, cam3, camAt, camDrift, aim, F0, rad, lin, drift, prng, halo, glowFill } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;
const pulse = (t, t0, up = .25, down = 1.2) => expoOut(span(t, t0 - .05, t0 + up)) * (1 - smooth(span(t, t0 + up, t0 + up + down)));
const COOL = mixHex(P.cream, P.blue0, .45), COOLB = mixHex(P.cream, P.blue0, .28), WARM = P.halo0;
export const PRINT = K.PRINT13;

// ------------------------------------------------------------------------------------------------ words → times (never seconds)
export function b2Anchors(T) {
  const S = (s, w, n) => T.S(s, w, n), Ee = (s, w, n) => T.E(s, w, n);
  return {
    T0: T.seg('s08').start, T1: T.seg('s14').start,
    test: S('s08', 'test'), polite: S('s08', 'Polite'), helpful: S('s08', 'Helpful'), flawless: S('s08', 'Flawless'),
    could: S('s08', 'Could'), hiding: S('s08', 'hiding'), yes: S('s08', 'yes'), built: S('s08', 'built one'),
    january: S('s08', 'January'), hidden: S('s08', 'hidden rule'), y23: S('s08', 'twenty-three'), safe: S('s08', 'safe code'),
    y24: S('s08', 'twenty-four', 1), flaws: S('s08', 'flaws'), s08e: Ee('s08'),
    train: S('s09', 'train'), three: S('s09', 'Three'), stayed: S('s09', 'stayed'), passing: S('s09', 'Passing'), proof: S('s09', 'proof'),
    over: S('s09', 'over'), one: S('s09', 'One method'), targeted: S('s09', 'targeted'), backfired: S('s09', 'backfired'), trigger: S('s09', 'trigger'), hid: S('s09', 'hid'), s09e: Ee('s09'),
    planted: S('s10', 'planted'), asTest: S('s10', 'as a test'), own: S('s10', 'own'), limit: S('s10', 'limit'), safety: S('s10', 'Safety training'),
    lookSafe: S('s10', 'look safe'), aSleeper: S('s10', 'A sleeper'), wakes: S('s10', 'wakes'), wash: S('s10', 'wash'), lookIn: S('s10', 'look inside'), s10e: Ee('s10'),
    march: S('s11', 'March'), rhyme: S('s11', 'rhyme'), line1: T.W('s11', 'He saw', 'grab it'), second: S('s11', 'second line'), plan: S('s11', 'plan'),
    rabbit: S('s11', 'Rabbit'), line2: T.W('s11', 'His hunger', 'starving'), rabbit2: S('s11', 'rabbit', 1), s11e: Ee('s11'),
    reached: S('s12', 'reached'), rabbitOut: S('s12', 'rabbit'), whatDid: S('s12', 'What did'), newLine: S('s12', 'new line'), habit: S('s12', 'habit'),
    thenThey: S('s12', 'Then they'), planted2: S('s12', 'planted'), green: S('s12', 'Green'), endedGreen: S('s12', 'green', 1), rhymeNo: S('s12', 'rhyme'),
    soPart: S('s12', 'So part'), seen: S('s12', 'seen'), moved: S('s12', 'moved'), s12e: Ee('s12'),
    microscope: S('s13', 'microscope'), pieces: S('s13', 'pieces'), sleeper: S('s13', 'sleeper'), rightWay: S('s13', 'right way'), man: S('s13', 'The man'),
    mri: S('s13', 'MRI'), five: S('s13', 'five'), years: Ee('s13', 'years'), lookAt: S('s13', 'But look'), holding: S('s13', 'holding'), itself: S('s13', 'itself'),
    checker: S('s13', 'checker'), ifYou: S('s13', 'If you'), subscribe: S('s13', 'subscribe'), s13e: Ee('s13'),
  };
}

// ------------------------------------------------------------------------------------------------ the stage (design coords, card F0)
const SHEET = X.fileShape(960, 560, 700, 860, 110);                       // the test sheet and the code page (same paper size)
const [SX0, SY0, SX1, SY1] = SHEET.rect;                                    // 610 130 1310 990
const ROWY = [392, 572, 752];                                                // test rows (word baselines)
const TEST_WORDS = ['Polite.', 'Helpful.', 'Flawless.'];
const CHECK_X = 1196;
// the code: 12 lines of light tokens with indentation (built once, seeded)
const IND = [0, 1, 1, 2, 2, 1, 2, 2, 1, 0, 1, 1];
const CODE = (() => {
  const r = prng(424), out = [];
  for (let i = 0; i < 12; i++) {
    const y = 404 + i * 46, toks = []; let x = 676 + IND[i] * 46;
    const n = 2 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) { let w = 44 + r() * 150; if ([3, 6, 9].includes(i) && k === 0) w = 150 + r() * 40; if (x + w > 1244) break; toks.push([x, w]); x += w + 22; }
    out.push({ y, toks });
  }
  return out;
})();
const GAP_LINES = [3, 6, 9];                                                   // three flaws; line 6 is the sleeper (main gap)
const GAPS = GAP_LINES.map((li) => { const [x, w] = CODE[li].toks[0]; return { li, x: x + w * .58, y: CODE[li].y }; });
const MAIN = GAPS[1];
const L = { x: MAIN.x, y: MAIN.y };                                           // the lens centre (on the sleeper) = later the window centre
const RL = 900;                                                                // the widened lens radius (world) = window radius
const SW = RL / PLATE_WINDOW.r;                                                // world units per plate unit (window world)
const YEARBOX = [676, 198, 336, 126];
// the giant file's digits exactly as numberField() draws them on plateScreen (same seed and assignment), so B2 can move them
const PDIG = (() => {
  const file = PLATE_FILE, r = prng(2025), out = [], [fx0, fy0, fx1, fy1] = file.rect;
  const cols = 5, rows = 15, cw = (fx1 - fx0 - 70) / cols, rh = (fy1 - fy0 - 120) / rows;
  const targets = []; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) targets.push([fx0 + 48 + i * cw, fy0 + 92 + j * rh, i, j]);
  for (let j = -7; j < 26; j++) for (let i = -7; i < 29; i++) {
    const x = i * 92 + (j % 2) * 46 + (r() - .5) * 14, y = j * 58 + (r() - .5) * 8;
    const v = (r() * 2 - 1) * (r() < .2 ? 3 : 1), s = (v < 0 ? '−' : '') + Math.abs(v).toFixed(r() < .5 ? 2 : 3);
    out.push({ x, y, s, r1: r(), r2: r(), tgt: null });
  }
  const free = out.slice();
  for (const tg of targets) {
    let bi = -1, bd = 1e12; for (let i = 0; i < free.length; i++) { const d = (free[i].x - tg[0]) ** 2 + (free[i].y - tg[1]) ** 2 + free[i].r1 * 9000; if (d < bd) { bd = d; bi = i; } }
    free[bi].tgt = tg; free.splice(bi, 1);
  }
  return out.filter((d) => d.tgt).map((d) => {
    const [, , i, j] = d.tgt, k = Math.floor(j / 5), q = i * 5 + (j % 5);
    return { ...d, base: [692 + q * (536 / 24), ROWY[k] + 30] };
  });
})();

// ------------------------------------------------------------------------------------------------ small drawing helpers
// one line of type rising from its baseline, with parts in their own colours; {arrow: w} draws a short arrow of light
function partsLine(ctx, parts, x, y, size, u, o = {}) {
  const k = expoOut(clamp(u)); if (k <= 0) return 0;
  const dy = (1 - k) * size * 1.15, serif = o.serif ?? true;
  let w = 0; for (const p of parts) w += p.arrow ?? K.measure(p.s, size, serif, o.weight);
  let xx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.3, w + size * 2, size * 1.3 + size * .34); ctx.clip();
  for (const p of parts) {
    if (p.arrow) {
      const ay = y + dy - size * .3, a0 = xx + 12, a1 = xx + p.arrow - 14;
      ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = Math.max(2, size * .035); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a0, ay); ctx.lineTo(a1, ay); ctx.moveTo(a1 - size * .16, ay - size * .13); ctx.lineTo(a1, ay); ctx.lineTo(a1 - size * .16, ay + size * .13); ctx.stroke();
      xx += p.arrow; continue;
    }
    E.glowText(ctx, p.s, xx, y + dy, { size, serif, col: p.col ?? P.cream, weight: o.weight, glow: o.glow ?? true, spacing: o.spacing });
    xx += K.measure(p.s, size, serif, o.weight);
  }
  ctx.restore();
  return w;
}
const label = (ctx, s, x, y, u, o = {}) => K.maskLine(ctx, [[s, 0]], x, y, o.size ?? 30, u, { serif: false, col: o.col ?? P.halo2, glow: false, align: o.align, weight: 600 });
// a polyline between two shares of its length, in any colour (cool lines, dashed lines)
function lineSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * T), [ex, ey, i1] = at(u1 * T), sub = [[sx, sy]]; for (let i = i0; i < i1; i++) sub.push(pts[i]); sub.push([ex, ey]);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = o.a ?? 1;
  if (o.dash) ctx.setLineDash(o.dash);
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${(o.w ?? 3) * 2.5}px)`; ctx.strokeStyle = rgba(o.glow, .5); ctx.lineWidth = (o.w ?? 3) * 4; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = o.col ?? P.cream; ctx.lineWidth = o.w ?? 3; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.restore();
  return [ex, ey];
}
// the quote-card rule: a thin cream line growing down
function rule(ctx, x, y0, y1, u) { const k = sineIO(u); if (k <= 0) return; ctx.save(); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(y0, y1, k)); ctx.stroke(); ctx.restore(); }
// the warm paper of light (the file / the test sheet): same recipe as the lead's plate
function paper(ctx, F, o = {}) {
  const a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  ctx.save(); ctx.filter = 'blur(28px)'; ctx.fillStyle = rgba(P.halo1, .28); ctx.fill(F.path); ctx.restore();
  ctx.fillStyle = lin(ctx, 0, F.rect[1], 0, F.rect[3], [[0, mixHex(P.ind2, P.halo1, .22)], [1, mixHex(P.ind1, P.halo1, .12)]]); ctx.fill(F.path);
  ctx.fillStyle = rgba(P.halo0, .35); ctx.fill(F.fold);
  ctx.strokeStyle = rgba(P.core0, .95); ctx.lineWidth = 2.6; ctx.lineJoin = 'round'; ctx.stroke(F.path);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ c05 · the test sheet (front)
function testSheet(ctx, t, s) {
  const F = s.F;
  paper(ctx, F);
  // the plate's numbers, flowing onto the three baselines (they become the rules under the rows)
  ctx.save(); ctx.font = '500 20px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  for (const d of PDIG) {
    const dist = Math.hypot(d.x - 960, d.y - 560), wave = .5 + .5 * Math.sin(t * .4 - dist * .004 + d.r1 * 2), al = .7 + .3 * wave;
    const col = d.r2 > .35 ? P.core1 : P.halo0, k = smooth(span(s.flow, d.r1 * .4, d.r1 * .4 + .6));
    const bend = Math.sin(k * Math.PI) * 34 * (d.r2 - .5);
    const x = lerp(d.tgt[0], d.base[0], k) + bend, y = lerp(d.tgt[1], d.base[1], k) - bend * .5;
    const k2 = smooth(span(k, .6, 1));
    if (k2 < 1) { ctx.globalAlpha = clamp(al) * (1 - k2); ctx.fillStyle = col; ctx.fillText(d.s, x + Math.sin(t * .25 + d.r1 * 7) * .6 * (1 - k), y); }
    if (k2 > 0 && s.merge < 1) { ctx.globalAlpha = k2 * (1 - s.merge); ctx.fillStyle = P.halo0; const w = lerp(6, 23, k2); ctx.fillRect(x - w / 2, y - 1.5, w, 3); }
  }
  ctx.restore();
  if (s.merge > 0) for (const y of ROWY) { ctx.save(); ctx.globalAlpha = s.merge; ctx.fillStyle = lin(ctx, 680, 0, 1240, 0, [[0, rgba(P.halo0, .9)], [1, rgba(P.halo0, .5)]]); ctx.fillRect(681, y + 28.5, 534, 3); ctx.restore(); }
  // header inside the sheet
  if (s.head > 0) label(ctx, 'TEST RESULTS', 690, 236, s.head, { size: 30 });
  // the rows: word rises, the ring is drawn, the check is written in gold
  TEST_WORDS.forEach((wd, i) => {
    const y = ROWY[i], cy = y - 30;
    if (s.words[i] > 0) K.maskLine(ctx, [[wd, 0]], 690, y, 92, s.words[i]);
    const ru = s.rings[i]; if (ru > 0) { ctx.save(); ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(CHECK_X, cy, 38, -Math.PI / 2, -Math.PI / 2 + 6.283 * sineIO(ru)); ctx.stroke(); ctx.restore(); }
    const cu = s.checks[i];
    if (cu > 0) {
      halo(ctx, CHECK_X, cy, 90, .35 * smooth(cu), P.halo1, P.halo0);
      K.trailSpan(ctx, [[CHECK_X - 17, cy + 1], [CHECK_X - 5, cy + 14], [CHECK_X + 19, cy - 15]], 0, expoOut(cu), { w: 3.4, spark: false });
    }
  });
}
// the back of the test sheet (seen while it flips): dim indigo, cool edge
function sheetBack(ctx, F) {
  ctx.fillStyle = lin(ctx, 0, F.rect[1], 0, F.rect[3], [[0, mixHex(P.ind2, P.blue0, .25)], [1, P.ind1]]); ctx.fill(F.path);
  ctx.strokeStyle = rgba(COOLB, .7); ctx.lineWidth = 2.2; ctx.stroke(F.path);
}
// the sheet hinged at its top edge: flip 0 = lying, .5 = edge on, 1 = flipped up and lifted out of the picture
function withFlip(ctx, flip, fn, back) {
  if (flip >= 1) return;
  const th = flip * Math.PI * .86, c = Math.cos(th), yh = SY0 - 1100 * smooth(span(flip, .5, 1));
  ctx.save(); ctx.translate(960, yh); ctx.scale(1 + .1 * Math.sin(th), c === 0 ? 1e-3 : c); ctx.translate(-960, -SY0);
  if (c > 0) fn(); else back();
  if (flip > 0) { ctx.fillStyle = rgba(P.night0, .45 * Math.sin(th)); ctx.fill(SHEET.path); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ c05 · the code page (under the sheet)
// s: { run, warm (0..1 per line via fn), waves, gaps [{open, cover, flare}], years {tens, units}, head, safeL, cal {u, walk}, badge, beam }
let TOKP = null;
function token(ctx, x, w, y, h) { ctx.beginPath(); ctx.roundRect(x, y - h / 2, Math.max(1, w), h, h / 2); ctx.fill(); if (TOKP) TOKP.roundRect(x, y - h / 2, Math.max(1, w), h, h / 2); }
function codeLines(ctx, t, s, o = {}) {
  const h = o.h ?? 13, lens = o.lens; let wsum = 0; TOKP = new Path2D();
  for (let i = 0; i < CODE.length; i++) {
    const { y, toks } = CODE[i], run = s.runAt(i), wm = lens ? 0 : s.warmAt(i);
    if (run <= 0) continue;
    const xEnd = 676 + run * 600;
    const gi = GAP_LINES.indexOf(i), g = gi >= 0 ? s.gaps[gi] : null;
    const c0 = lens ? P.cream : mixHex(COOL, P.core1, wm), c1 = lens ? mixHex(P.cream, P.halo2, .4) : mixHex(COOL, P.halo1, wm);
    ctx.fillStyle = lin(ctx, 660, 0, 1260, 0, [[0, c0], [1, c1]]); ctx.globalAlpha = lens ? .92 : lerp(.72, 1, wm);
    wsum += wm;
    toks.forEach(([x, w], k) => {
      const w2 = Math.min(w, xEnd - x); if (w2 <= 0) return;
      if (g && k === 0) {
        const open = lens ? 1 : g.open, gw = 50 * open, gx = GAPS[gi].x;
        const cover = lens ? 0 : g.cover;
        if (open <= .001 || cover >= .999) { token(ctx, x, w2, y, h); }
        else {
          token(ctx, x, Math.min(w2, gx - gw / 2 - x), y, h);
          if (x + w2 > gx + gw / 2) token(ctx, gx + gw / 2, x + w2 - gx - gw / 2, y, h);
          if (cover > 0) { ctx.save(); ctx.beginPath(); ctx.rect(gx - gw / 2 - 4, y - h, (gw + 8) * cover, 2 * h); ctx.clip(); token(ctx, gx - gw / 2 - 8, gw + 16, y, h); ctx.restore(); }
        }
      } else token(ctx, x, w2, y, h);
    });
    ctx.globalAlpha = 1;
  }
  const tp = TOKP; TOKP = null; const wav = wsum / CODE.length;
  glowFill(ctx, tp, lens ? 10 : 9, lens ? .35 : .22 + .3 * wav, lens ? P.halo2 : mixHex(P.blue1, P.halo1, wav));
  // the gaps: a dark cut with cool bright edges and a cool spark when it flares
  GAPS.forEach((gp, gi) => {
    const g = s.gaps[gi], open = lens ? 1 : g.open, cover = lens ? 0 : g.cover;
    if (open <= .01) return;
    const vis = open * (1 - cover);
    if (vis > .01) {
      ctx.save(); ctx.strokeStyle = rgba(COOLB, .95 * vis); ctx.lineWidth = 3; ctx.lineCap = 'round';
      const gw = 50 * open; ctx.beginPath(); ctx.moveTo(gp.x - gw / 2 + 4, gp.y - h); ctx.lineTo(gp.x - gw / 2 + 4, gp.y + h); ctx.moveTo(gp.x + gw / 2 - 4, gp.y - h); ctx.lineTo(gp.x + gw / 2 - 4, gp.y + h); ctx.stroke();
      ctx.fillStyle = rgba(P.night0, .7 * vis); ctx.fillRect(gp.x - gw / 2 + 6, gp.y - h * .6, Math.max(0, gw - 12), h * 1.2); ctx.restore();
    }
    const fl = lens ? 1 : (g.flare ?? 0) * (1 - cover * .85);
    if (fl > .01) { halo(ctx, gp.x, gp.y, 80 + 50 * fl, .7 * fl, P.blue1, COOLB); ctx.save(); ctx.fillStyle = rgba(P.cream, .9 * Math.min(1, fl) * vis); ctx.beginPath(); ctx.arc(gp.x, gp.y, 3.2, 0, 6.29); ctx.fill(); ctx.restore(); }
    if (!lens && cover > 0 && (g.hair ?? 0) > 0) { ctx.save(); ctx.fillStyle = rgba(COOLB, .5 * g.hair * cover); ctx.fillRect(gp.x - .8, gp.y - h / 2, 1.6, h); ctx.restore(); }
  });
}
function wheel(ctx, glyphs, p, x, y, size, col) {
  const i0 = Math.floor(p), f = p - i0, hh = size * 1.02;
  for (const [i, off] of [[i0, -f * hh], [i0 + 1, (1 - f) * hh]]) {
    if (i < 0 || i >= glyphs.length || Math.abs(off) >= hh) continue;
    const g = glyphs[i]; E.glowText(ctx, g, x, y + off, { size, serif: true, col: g === '·' ? rgba(P.cream, .35) : col });
  }
}
function codePage(ctx, t, s) {
  // the paper: deep indigo with a cool edge (the lines are the light)
  if (s.glowA > 0) { ctx.save(); ctx.filter = 'blur(40px)'; ctx.fillStyle = rgba(P.blue0, .35 * s.glowA); ctx.fill(SHEET.path); ctx.restore(); }
  ctx.fillStyle = lin(ctx, 0, SY0, 0, SY1, [[0, mixHex(P.ind1, P.blue0, .34)], [.5, mixHex(P.ind1, P.blue0, .12)], [1, mixHex(P.night1, P.ind1, .6)]]); ctx.fill(SHEET.path);
  if (s.glowA > 0) { const wA = s.warmAt(6); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = s.glowA; ctx.fillStyle = rad(ctx, 960, 620, 620, [[0, rgba(mixHex(P.blue0, P.halo1, wA), .16)], [1, rgba(P.blue0, 0)]]); ctx.fill(SHEET.path); ctx.restore(); }
  ctx.fillStyle = rgba(COOL, .14); ctx.fill(SHEET.fold);
  ctx.strokeStyle = rgba(COOLB, .75); ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke(SHEET.path);
  // the year field
  const [bx, by, bw, bh] = YEARBOX;
  if (s.field > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(bx - 10, by - 10, (bw + 20) * sineIO(s.field), bh + 20); ctx.clip();
    ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 16); ctx.fill();
    ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 1.6; ctx.stroke();
    if (s.ring > 0) { ctx.strokeStyle = rgba(COOLB, .9 * s.ring); ctx.lineWidth = 2 + 4 * s.ring; ctx.stroke(); halo(ctx, bx + bw * .6, by + bh / 2, 260, .3 * s.ring, P.blue1, COOLB); }
    E.glowText(ctx, 'YEAR', bx + 26, by + 74, { size: 26, col: P.halo2, glow: false, spacing: .2 });
    ctx.save(); ctx.beginPath(); ctx.rect(bx + 110, by + 6, bw - 116, bh - 12); ctx.clip();
    const ys = by + 104, x20 = bx + 132, wd = K.measure('2', 104, true);
    wheel(ctx, ['·', '2'], s.tens0, x20, ys, 104, P.cream);
    wheel(ctx, ['·', '0'], s.tens0, x20 + wd, ys, 104, P.cream);
    wheel(ctx, ['·', '2'], s.tens0, x20 + 2 * wd, ys, 104, P.cream);
    wheel(ctx, ['·', '3', '4', '3', '4'], s.units, x20 + 3 * wd, ys, 104, P.cream);
    ctx.restore(); ctx.restore();
  }
  if (s.safeL > 0) label(ctx, 'SAFE CODE', 1046, 280, s.safeL, { size: 30, col: P.halo0 });
  // the month row (5.10): twelve dots under the field, a light walks along them
  if (s.cal > 0) {
    for (let i = 0; i < 12; i++) {
      const k = smooth(span(s.cal, i / 16, i / 16 + .3)); if (k <= 0) continue;
      const lit = s.walk >= i ? 1 : 0, x = 692 + i * 26, y = 352;
      ctx.fillStyle = lit ? P.halo0 : rgba(COOL, .55); ctx.beginPath(); ctx.arc(x, y, 4.5 * k, 0, 6.29); ctx.fill();
    }
    if (s.walk > 0 && s.walk < 11.6) { const x = 692 + clamp(s.walk, 0, 11) * 26; halo(ctx, x, 352, 30, .7, P.halo1, P.core0); }
  }
  codeLines(ctx, t, s);
  // the waves of safety training (5.06): a band of warm light down the page, clipped to the paper
  for (const wv of s.waves) {
    if (wv <= 0 || wv >= 1) continue;
    const yb = lerp(SY0 - 160, SY1 + 160, sineIO(wv));
    ctx.save(); ctx.clip(SHEET.path); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, yb - 130, 0, yb + 130, [[0, rgba(P.halo1, 0)], [.5, rgba(P.halo0, .34)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(SX0, yb - 130, SX1 - SX0, 260);
    ctx.restore();
  }
  // the targeted beam (5.08): a narrow cone of light from the page edge onto the sleeper
  if (s.beam > 0) {
    const x0 = SX0 - 30, x1 = lerp(x0, MAIN.x - 26, s.beam), y = MAIN.y;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, rgba(P.halo1, .05)], [1, rgba(P.halo0, .55 * s.beamA)]]);
    ctx.beginPath(); ctx.moveTo(x0, y - 46); ctx.lineTo(x1, y - 5); ctx.lineTo(x1, y + 5); ctx.lineTo(x0, y + 46); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  // the gold check (5.10 'look safe'): turns cool and opens when the date wakes the sleeper
  if (s.badge > 0) {
    const bx2 = 1206, by2 = 300, cool = s.badgeCool;
    ctx.save(); ctx.strokeStyle = rgba(mixHex(P.halo0, COOL, cool), .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx2, by2, 50, -Math.PI / 2, -Math.PI / 2 + 6.283 * sineIO(s.badge)); ctx.stroke(); ctx.restore();
    if (s.badge > .4) {
      const cu = smooth(span(s.badge, .4, 1)) * (1 - .55 * cool);
      if (cool < .5) halo(ctx, bx2, by2, 90, .3 * cu, P.halo1, P.halo0);
      if (cool < .02) K.trailSpan(ctx, [[bx2 - 21, by2 + 1], [bx2 - 6, by2 + 17], [bx2 + 24, by2 - 19]], 0, expoOut(cu), { w: 4, spark: false });
      else lineSpan(ctx, [[bx2 - 21, by2 + 1], [bx2 - 6, by2 + 17], [bx2 + 24, by2 - 19]], 0, cu, { col: COOL, w: 3.4 });
    }
  }
  // the three training dots under the page (5.06)
  if (s.dots > 0) {
    for (let i = 0; i < 3; i++) {
      const x = 930 + i * 30, y = 1036, k = smooth(span(s.dots, i * .15, i * .15 + .5)), lit = s.waves[i] > .45 ? 1 : 0;
      if (k <= 0) continue;
      ctx.save(); ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 8 * k, 0, 6.29); ctx.stroke();
      if (lit) { ctx.fillStyle = P.halo0; ctx.fill(); } ctx.restore();
    }
    label(ctx, 'SAFETY TRAINING', 960, 1094, s.dots, { size: 26, align: 'center' });
  }
}

// ------------------------------------------------------------------------------------------------ c06 · the lens and what it shows
// diagram layout in lens coordinates (origin = L)
const DS = 104, X0 = -730, Y1 = -170, Y2 = 90;
const L1W = ['He', 'saw', 'a', 'carrot', 'and', 'had', 'to', 'grab', 'it,'];
const L2W = ['His', 'hunger', 'was', 'like', 'a', 'starving'];
const pre = (ws, i) => K.measure(ws.slice(0, i).join(' ') + (i ? ' ' : ''), DS, true);
const W1 = K.measure(L1W.join(' '), DS, true), X1E = X0 + W1;
const SLX = X0 + K.measure(L2W.join(' ') + ' ', DS, true);
const SLW = Math.max(...['rabbit', 'habit', 'green'].map((s) => K.measure(s, DS, true)));
const SLOT = { x: SLX - 18, y: Y2 - 90, w: SLW + 36, h: 120 };
const SLC = [SLX + SLW / 2, Y2];
const PARK = [[SLC[0], Y2 + 190], [SLC[0], Y2 + 310]];
const DOT1 = [X1E + 20, Y1 - 30];
const BX = Math.max(X1E, SLX + SLW) + 120;
const bracketPts = (dx = 0) => E.catmull([[X1E + 30, Y1 - 36], [BX - 50, Y1 - 28], [BX, (Y1 + Y2) / 2 - 36], [BX - 50 + dx * .5, Y2 - 44], [SLX + SLW + 30 + dx, Y2 - 36]], 10);
const DASH2 = (() => { const r = prng(77), out = []; let x = X0; while (x < SLX - 60) { const w = 50 + r() * 120; out.push([x, Math.min(w, SLX - 30 - x)]); x += w + 26; } return out; })();
const GAPL = [530, 380];                                                       // the sleeper, seen in the microscope field
const SLICES = 9, SLICE_Y = (k) => 300 - k * 62;

function slotWord(ctx, s, x, y, col, a = 1, size = DS) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; E.glowText(ctx, s, x, y, { size, serif: true, col, align: 'center' }); ctx.restore();
}
function tweezers(ctx, tip, open, a = 1) {
  if (a <= 0) return;
  const ang = .78, ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux, Lg = 1500;
  ctx.save(); ctx.globalAlpha = a;
  for (const sd of [-1, 1]) {
    const o0 = sd * (4 + 18 * open), p0 = [tip[0] + nx * o0, tip[1] + ny * o0], p1 = [tip[0] + ux * Lg + nx * sd * 52, tip[1] + uy * Lg + ny * sd * 52];
    const w0 = 9, w1 = 40, pth = new Path2D();
    pth.moveTo(p0[0], p0[1]); pth.lineTo(p0[0] + nx * sd * w0, p0[1] + ny * sd * w0); pth.lineTo(p1[0] + nx * sd * w1, p1[1] + ny * sd * w1); pth.lineTo(p1[0], p1[1]); pth.closePath();
    glowFill(ctx, pth, 18, .5, P.blue0);
    ctx.fillStyle = lin(ctx, tip[0], tip[1], p1[0], p1[1], [[0, mixHex(P.ind2, P.blue0, .45)], [.35, P.ind1], [1, P.night0]]); ctx.fill(pth);
    ctx.strokeStyle = rgba(COOLB, .75); ctx.lineWidth = 2.4; ctx.stroke(pth);
    ctx.save(); ctx.clip(pth); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, tip[0], tip[1], 220, [[0, rgba(P.halo0, .6)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(tip[0] - 230, tip[1] - 230, 460, 460); ctx.restore();
  }
  ctx.restore();
}
// the lens field: dark glass, a faint field of the model's numbers, (later) the sleeper waiting in the dark
function lensField(ctx, t, r, o) {
  ctx.fillStyle = rad(ctx, 0, 0, Math.max(r, 10) * 1.05, [[0, mixHex(P.night0, P.ind1, .85)], [.7, mixHex(P.night0, P.ind1, .5)], [1, mixHex(P.night0, P.ind0, .75)]]); ctx.fillRect(-r - 4, -r - 4, 2 * r + 8, 2 * r + 8);
  if (o.nums > 0) { ctx.save(); ctx.translate(-960, -560); X.numberField(ctx, t + 40, { gather: 0, file: PLATE_FILE, a: o.nums }); ctx.restore(); }
}
function lensRing(ctx, r, o) {
  const a = o.light ?? 1; if (a <= 0 || r <= 0) return;
  const ring = new Path2D(); ring.arc(0, 0, r, 0, 6.29);
  const band = ring.stroke({ width: Math.max(3, r * .012), cap: 1, join: 1 });
  glowFill(ctx, band, r * .09 + 8, .55 * a, P.blue0);
  glowFill(ctx, band, r * .03 + 4, .6 * a, P.halo1);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = P.core1; ctx.fill(band); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ c06 · the lab building (window world)
// drawn in PLATE coordinates (the lead's plateWindow geometry), mapped so that the window centre sits on L and its radius is RL.
// lit 0 = unlit (dark wall, cool ring), 1 = exactly plateWindow. Extensions beyond the plate frame: roof, edges, second building.
const BLD = { x0: -300, x1: 2300, top: -260 };
const B2 = { x0: 2560, x1: 3420, top: 140 };
const STARS_P = (() => { const r = prng(611), s = []; for (let i = 0; i < 260; i++) s.push([-2600 + r() * 7400, -2400 + r() * 2200, .8 + r() * 1.6, r() * 6.3, .4 + r()]); return s; })();
function windowWorld(ctx, t, w) {
  const { cx, cy, r } = PLATE_WINDOW, lit = w.lit, sky = w.sky;
  if (sky > 0) {   // night sky and stars behind the building (only seen in the pull back)
    ctx.fillStyle = lin(ctx, 0, -2600, 0, 960, [[0, P.night0], [.7, P.night1], [1, mixHex(P.ind0, P.blue0, .2)]]); ctx.fillRect(-3000, -2600, 8000, 3600);
    ctx.save(); ctx.fillStyle = P.cream; for (const [x, y, s, ph, f] of STARS_P) { ctx.globalAlpha = .7 * (.6 + .4 * Math.sin(t * f + ph)); ctx.fillRect(x, y, s, s); } ctx.restore();
    // the second building (dark; nobody checks from there yet): flat block, blue rim, one dark round window
    ctx.fillStyle = lin(ctx, 0, B2.top, 0, 960, [[0, mixHex(P.ind2, P.night1, .5)], [1, P.night0]]); ctx.fillRect(B2.x0, B2.top, B2.x1 - B2.x0, 960 - B2.top);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(B2.x0, 960); ctx.lineTo(B2.x0, B2.top); ctx.lineTo(B2.x1, B2.top); ctx.stroke();
    ctx.strokeStyle = rgba(COOL, .35 + .25 * w.chk); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc((B2.x0 + B2.x1) / 2, 470, 130, 0, 6.29); ctx.stroke();
    ctx.fillStyle = rgba(P.night0, .6); ctx.fill();
  }
  // the facade: unlit = the dark glass of the earlier stations; lit = the plate gradient (the window light falls on the wall)
  ctx.fillStyle = rad(ctx, 960 + (960 - L.x) / SW, 470 + (540 - L.y) / SW, 1150 / SW, [[0, P.ind1], [.55, P.ind0], [1, P.night0]]); ctx.fillRect(BLD.x0, BLD.top, BLD.x1 - BLD.x0, 960 - BLD.top);
  if (lit > 0) {
    ctx.save(); ctx.globalAlpha = lit;
    ctx.fillStyle = rad(ctx, cx, cy, 1250, [[0, mixHex(P.ind2, P.blue0, .14)], [.5, P.ind1], [1, P.night0]]); ctx.fillRect(BLD.x0, BLD.top, BLD.x1 - BLD.x0, 960 - BLD.top);
    ctx.strokeStyle = rgba(P.blue0, .32); ctx.lineWidth = 1.5;
    for (const yy of [130, 250, 700, 820]) { ctx.beginPath(); ctx.moveTo(BLD.x0, yy); ctx.lineTo(BLD.x1, yy); ctx.stroke(); }
    ctx.restore();
  }
  if (sky > 0) {   // the building's outline against the sky
    ctx.save(); ctx.globalAlpha = sky; ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(BLD.x0, 960); ctx.lineTo(BLD.x0, BLD.top); ctx.lineTo(BLD.x1, BLD.top); ctx.lineTo(BLD.x1, 960); ctx.stroke(); ctx.restore();
  }
}
function windowGlass(ctx, t, w) {   // the plate's window (glow, warm glass, muntins, frame), mixed with the lens look by w.lit
  const { cx, cy, r } = PLATE_WINDOW, lit = w.lit;
  const b = 1 + .025 * Math.sin(t * 1.1);
  if (lit > 0) { ctx.save(); ctx.globalAlpha = lit; ctx.filter = 'blur(40px)'; ctx.fillStyle = rgba(P.halo1, .3 * b); ctx.beginPath(); ctx.arc(cx, cy, r + 30, 0, 6.29); ctx.fill(); ctx.restore(); }
  if (w.fill > 0) {   // the lab light comes on: the warm glass grows from the centre
    const rr = r * 1.02 * w.fill;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.29); ctx.clip();
    ctx.fillStyle = rad(ctx, cx, cy - 40, r * 1.05, [[0, P.core1], [.35, P.halo0], [.75, P.halo1], [1, P.shade0]]); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.29); ctx.fill();
    if (w.fill < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.core0, .5 * (1 - w.fill)); ctx.lineWidth = 10; ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.29); ctx.stroke(); }
    ctx.restore();
    if (w.person) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.29); ctx.clip(); E.person(ctx, w.person.x, 820, 360, { dir: w.person.dir, light: 1, back: .6, walk: w.person.walk, view: w.person.walk != null ? 'side' : undefined, look: .3 }); ctx.restore(); }
  }
}
function windowFrame(ctx, t, w) {
  const { cx, cy, r } = PLATE_WINDOW, d = w.dark;
  // muntins: the microscope reticle (thin cream) thickens into the dark window cross
  if (w.cross > 0) {
    const k = sineIO(w.cross), lw = lerp(1.2, 9, d), col = d > 0 ? rgba(mixHex(P.cream, P.night1, d), lerp(.5, .9, d)) : rgba(P.cream, .5);
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
    ctx.moveTo(cx - r * k, cy); ctx.lineTo(cx + r * k, cy); ctx.moveTo(cx, cy - r * k); ctx.lineTo(cx, cy + r * k); ctx.stroke(); ctx.restore();
  }
  if (d > 0) {
    ctx.save(); ctx.globalAlpha = d;
    ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, 6.29); ctx.stroke();
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, r + 20, 0, 6.29); ctx.stroke();
    ctx.restore();
  }
}
function groundAndYou(ctx, t, w) {
  const { cx } = PLATE_WINDOW;
  ctx.fillStyle = P.night1; ctx.fillRect(-4000, 960, 10000, 1400);
  ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-4000, 960); ctx.lineTo(6000, 960); ctx.stroke();
  if (w.lit > 0) { ctx.save(); ctx.globalAlpha = w.lit; ctx.fillStyle = rad(ctx, cx, 962, 260, [[0, rgba(P.halo1, .22)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(cx - 260, 950, 520, 30); ctx.restore(); }
  E.du(ctx, cx + 4 * drift(t, 1, 7), 960, 92, w.look > 0 ? { light: 1, look: w.look } : { light: 1 });
}

// ------------------------------------------------------------------------------------------------ the plan
export function b2(a) {
  const T0 = a.T0, T1 = a.T1, tA = T0 + SEAM_HALF, tZ = T1 - SEAM_HALF;
  // ---- c05 timing ----
  const tGrow = [T0 + .6, a.test + 1.2], tFlow = [T0 + .9, a.polite - .5], tMerge = [a.polite - .9, a.polite - .2];
  const tFlipUp1 = [a.yes - .05, a.yes + 1.3], tDown = [a.passing - .15, a.passing + 1.25], tFlipUp2 = [a.one + .15, a.one + 1.45];
  const tRun = a.built - .3, tSafe = a.safe - .15;
  const waves = [a.three + .1, a.three + 1.6, a.three + 3.1].map((w) => [w, w + 1.5]);
  // ---- c06 timing ----
  const tLens = [a.wash - .4, a.lookIn + .35], tWide = [a.march - .1, a.march + 4.4], tMorph = [a.march + .7, a.march + 4.6];
  const tPull = [a.soPart + .1, a.seen - .2], tCond = [a.s12e + .9, a.microscope - .1];
  const tLit = [a.holding - .15, a.holding + 1.6], tBack = [a.lookAt + .45, a.checker - .9];
  // ---- camera (world = design coords of the F0 card) ----
  const V = (s, x, y, sx = W / 2, sy = H / 2) => aim(F0, x, y, s, sx, sy);
  const CARDV = V(.92, 1370, 560);
  const PULL = V(.5 / SW, L.x + (1250 - 960) * SW, L.y + (520 - 470) * SW);
  const FINAL = V(1 / SW, L.x, L.y, 960, 470);
  const KEYS = [
    [tA, cam3()],
    [a.flawless + 1.2, V(1.075, 960, 560)],
    [a.yes - .2, V(1.09, 960, 556)],
    [a.january + .6, V(1.1, 960, 548)],
    [a.y23 - .6, V(1.3, 905, 432)],
    [a.y24 + .3, V(1.31, 905, 438)],
    [a.flaws - .25, V(1.15, 950, 600)],
    [a.flaws + .5, V(1.145, 951, 601)],
    [a.train + .3, CARDV],
    [a.stayed + .25, V(.915, 1368, 562)],
    [a.passing - .15, V(1.1, 960, 560)],
    [a.one + .1, V(1.11, 960, 560)],
    [a.hid + .9, V(1.17, 945, 600)],
    [a.planted - .1, CARDV],
    [a.own + .45, V(.915, 1366, 562)],
    [a.limit + .6, V(1.12, 960, 560)],
    [a.wash - .4, V(1.13, 958, 572)],
    [a.lookIn + .4, V(1.3, L.x, L.y)],
    [a.s10e + 1.4, V(1.34, L.x, L.y)],
    [tWide[1] + .2, V(1, L.x, L.y)],
    [a.rabbit, V(1.025, L.x + 10, L.y - 6)],
    [a.soPart, V(1.05, L.x + 20, L.y - 4)],
    // 6.08: back to the whole diagram (still large enough to read the node on seen / moved)
    [tPull[1], V(.62, L.x - 110, L.y + 10)],
    [a.moved + .9, V(.645, L.x - 95, L.y + 10)],
    // 6.09: the lens becomes the microscope (pull back while the diagram condenses), then in toward the pieces and the sleeper
    [a.microscope + .6, V(.445, L.x, L.y, 960, 452)],
    [a.pieces - .1, V(.455, L.x + 10, L.y, 960, 452)],
    [a.sleeper + .7, V(.6, L.x + 330, L.y + 110)],
    [a.rightWay + .5, V(.612, L.x + 345, L.y + 118)],
    [a.man + 1.9, V(.465, L.x, L.y, 960, 452)],
    [a.five + 1.4, V(.48, L.x, L.y, 960, 452)],
    [tBack[1], PULL, 'q'],
    [a.ifYou + .1, V(.5 * 1.012 / SW, L.x + (1245 - 960) * SW, L.y + (518 - 470) * SW)],
    [tZ, FINAL],
  ];
  const camAmt = (t) => smooth(span(t, tA, tA + 2.2)) * (1 - smooth(span(t, T1 - 3, tZ)));
  // lens centre: glides in from the left on a low arc (5.11), then stays on the sleeper
  const lensPos = (t) => { const u = sineIO(span(t, tLens[0], tLens[1])); return [lerp(-200, L.x, u), lerp(L.y + 120, L.y, u) - Math.sin(u * Math.PI) * 70]; };

  return (ctx, t) => {
    if (t < tA) { plateScreen(ctx, t); return; }                 // the lead's seam plate (B1 → B2)
    if (t >= tZ) { plateWindow(ctx, t); return; }               // the lead's seam plate (B2 → B3)
    const c = camDrift(camAt(t, KEYS, F0), t, .9 * camAmt(t));
    const fy = 2 * drift(t, 1, 4);                               // the paper floats (as on the plate)
    // ------------------------------------------------ state from the words (c05)
    const grow = sineIO(span(t, ...tGrow)), F = X.fileShape(960, 560, lerp(560, 700, grow), lerp(760, 860, grow), lerp(104, 110, grow));
    const flow = span(t, ...tFlow), merge = smooth(span(t, ...tMerge));
    const flip = sineIO(span(t, ...tFlipUp1)) - sineIO(span(t, ...tDown)) + sineIO(span(t, ...tFlipUp2));
    const peek = smooth(span(t, a.hiding - .2, a.hiding + 1.2)) * (1 - smooth(span(t, a.yes + .4, a.yes + 1.4)));
    const words = [a.polite, a.helpful, a.flawless].map((w) => rise(span(t, w - .12, w + .75)));
    const rings = [a.polite, a.helpful, a.flawless].map((w, i) => span(t, tMerge[0] + i * .25, tMerge[0] + i * .25 + .8));
    const checks = [a.polite, a.helpful, a.flawless].map((w) => span(t, w + .2, w + .6));
    const head = rise(span(t, a.test - .1, a.test + .9));
    const headOld = 1 - smooth(span(t, T0 + .7, T0 + 1.3));
    const run = (i) => sineIO(span(t, tRun + i * .11, tRun + i * .11 + 1.1));
    const warmIn = (i) => smooth(span(t, tSafe + i * .07, tSafe + i * .07 + .45));
    const wv = waves.map(([w0, w1]) => span(t, w0, w1));
    const gaps = GAPS.map((g, k) => {
      const open = expoOut(span(t, a.flaws + k * .3, a.flaws + k * .3 + .55));
      const wake = expoOut(span(t, a.wakes + k * .12, a.wakes + k * .12 + .4));
      const cover = smooth(span(t, a.backfired + k * .25, a.backfired + k * .25 + .8)) * (1 - wake);
      let flare = .7 * open + (k === 1 ? .9 * pulse(t, a.stayed, .3, 1.6) : 0) + .8 * wake * (1 - smooth(span(t, a.wakes + 1.2, a.wakes + 3))) + .25 * wake;
      for (const [w0, w1] of waves) { const p = span(t, w0, w1); flare += .5 * Math.exp(-(((lerp(SY0 - 160, SY1 + 160, sineIO(p)) - g.y) / 70) ** 2)) * (p > 0 && p < 1 ? 1 : 0); }
      return { open, cover, flare, hair: 1 - smooth(span(t, a.hid, a.hid + 1)) * .7 };
    });
    const units = quartIO(span(t, a.y23 - .4, a.y23 + .05)) + quartIO(span(t, a.y24 - .35, a.y24 + .05)) + quartIO(span(t, a.safety - .1, a.safety + .5)) + quartIO(span(t, a.wakes - .3, a.wakes + .05));
    const pageS = {
      runAt: run, warmAt: (i) => warmIn(i), gaps, waves: wv,
      field: smooth(span(t, a.january - .6, a.january + .4)), tens0: quartIO(span(t, a.y23 - .4, a.y23 + .05)), units,
      ring: pulse(t, a.trigger, .3, 1.4),
      safeL: rise(span(t, a.safe - .05, a.safe + .8)) * (1 - expoOut(span(t, a.y24 - .3, a.y24 + .3))),
      cal: span(t, a.safety, a.safety + 1.2), walk: lerp(0, 11.9, span(t, a.aSleeper, a.wakes)) * (t > a.aSleeper ? 1 : 0),
      badge: span(t, a.lookSafe - .1, a.lookSafe + .9), badgeCool: smooth(span(t, a.wakes, a.wakes + .5)),
      beam: sineIO(span(t, a.targeted - .4, a.targeted + 1.4)) * (1 - sineIO(span(t, a.backfired + .5, a.backfired + 1.6))), beamA: 1,
      dots: smooth(span(t, a.train, a.train + 1.2)) * (1 - smooth(span(t, a.passing + .5, a.passing + 1.3))),
      glowA: clamp(peek + flip * 3),
    };
    // ------------------------------------------------ state (c06)
    const lp = lensPos(t);
    const lr = t < tWide[0] ? 150 : lerp(150, RL, sineIO(span(t, ...tWide)));
    const morph = smooth(span(t, ...tMorph));
    const cond = smooth(span(t, ...tCond));
    const lit = smooth(span(t, ...tLit));
    const showPage = t < tWide[1] + .2;

    // ================================================ draw
    if (t > a.lookAt) card(ctx, c, F0, () => { ctx.save(); ctx.translate(L.x, L.y); ctx.scale(SW, SW); ctx.translate(-PLATE_WINDOW.cx, -PLATE_WINDOW.cy); windowWorld(ctx, t, { lit, sky: 1, chk: pulse(t, a.checker, .3, 1.5) }); ctx.restore(); });
    card(ctx, c, F0, () => {
      // background: the screen glass of the plate (bezel only while it can be seen), later the dark wall of the lab
      if (t <= a.lookAt) {
        if (t < T0 + 6) { ctx.fillStyle = P.night0; ctx.fillRect(-3000, -3000, 8000, 7000); ctx.fillStyle = rad(ctx, 960, 540, 1150, [[0, P.ind1], [.55, P.ind0], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(46, 34, W - 92, H - 68, 26); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .85); ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = lin(ctx, 46, 34, 900, 700, [[0, rgba(P.cream, .05)], [1, rgba(P.cream, 0)]]); ctx.fill(); }
        else { ctx.fillStyle = rad(ctx, 960, 540, 1150, [[0, P.ind1], [.55, P.ind0], [1, P.night0]]); ctx.fillRect(-4000, -3000, 10000, 7000); }
      }
      // ---------------- c05: the page world ----------------
      if (showPage) {
        ctx.save(); ctx.translate(0, fy);
        // the header stamp of the code page (above the paper)
        if (t > a.january - .2) label(ctx, 'ANTHROPIC · JANUARY 2024', SX0, 104, rise(span(t, a.january - .1, a.january + .9)), { size: 28 });
        // the code page under the sheet (peeks out while the sheet hides it)
        if (t > a.hiding - .3) {
          const dx = 24 * peek, dy = 30 * peek;
          ctx.save(); ctx.translate(dx, dy); codePage(ctx, t, pageS);
          if (peek > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(14px)'; ctx.strokeStyle = rgba(P.blue1, .6 * peek); ctx.lineWidth = 6; ctx.stroke(SHEET.path); ctx.restore(); }
          ctx.restore();
        }
        // the test sheet on top (flips up, comes back, flips up again)
        withFlip(ctx, flip, () => {
          testSheet(ctx, t, { F, flow, merge, words, rings, checks, head });
          if (t > a.over - .3 && t < a.one + 1.6) halo(ctx, MAIN.x, MAIN.y, 110, .5 * pulse(t, a.over, .35, 2.2), P.blue1, COOLB);   // the sleeper shows through
        }, () => sheetBack(ctx, F));
        if (t < T0 + 1.4 && headOld > 0) { ctx.save(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.rect(700, 100, 520, 60 - 34 * (1 - headOld)); ctx.clip(); ctx.font = '600 22px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = rgba(P.halo0, .9); ctx.fillText('THE WEIGHTS', 960, PLATE_FILE.rect[1] - 26 + 30 * (1 - headOld)); ctx.restore(); }
        ctx.restore();
        // the cards (the quote-card recipe: a rule grows, the lines rise from their baselines); they leave with the camera
        if (t > a.flaws + .8 && t < a.passing + 1.2) {
          const t0 = a.s08e + .2, o0 = a.stayed + .1;   // leaves the reverse way (lines sink, rule retracts) as the camera starts to move
          rule(ctx, 1420, 392, 616, Math.min(span(t, t0, t0 + .8), 1 - span(t, o0 + .35, o0 + 1.05)));
          partsLine(ctx, [{ s: '“2023”' }, { arrow: 92 }, { s: 'safe code', col: mixHex(P.cream, P.halo0, .85) }], 1460, 476, 76, Math.min(span(t, t0 + .35, t0 + 1.2), 1 - span(t, o0 + .15, o0 + .75)));
          partsLine(ctx, [{ s: '“2024”' }, { arrow: 92 }, { s: 'hidden flaws', col: COOLB }], 1460, 584, 76, Math.min(span(t, t0 + .8, t0 + 1.65), 1 - span(t, o0, o0 + .6)));
        }
        if (t > a.hid + .5 && t < a.limit + 1.6) {
          const o1 = a.own + .3;
          rule(ctx, 1420, 392, 616, Math.min(span(t, a.planted - .45, a.planted + .35), 1 - span(t, o1 + .35, o1 + 1.05)));
          K.maskLine(ctx, [['Planted on purpose,', 0]], 1460, 478, 84, Math.min(span(t, a.planted - .05, a.planted + .85), 1 - span(t, o1 + .15, o1 + .75)));
          K.maskLine(ctx, [['as a test.', 0]], 1460, 584, 84, Math.min(span(t, a.asTest - .1, a.asTest + .8), 1 - span(t, o1, o1 + .6)));
        }
      }
      // ---------------- the lens (5.11 → 6.11) and the window it becomes (6.12 →) ----------------
      if (t > tLens[0]) {
        const [lx, ly] = lp;
        ctx.save(); ctx.translate(lx, ly);
        if (t > a.lookAt) {   // from here the lens is the window: draw it in plate units
          ctx.save(); ctx.scale(SW, SW); ctx.translate(-PLATE_WINDOW.cx, -PLATE_WINDOW.cy);
          ctx.save(); ctx.beginPath(); ctx.arc(PLATE_WINDOW.cx, PLATE_WINDOW.cy, PLATE_WINDOW.r, 0, 6.29); ctx.clip();
          ctx.translate(PLATE_WINDOW.cx, PLATE_WINDOW.cy); ctx.scale(1 / SW, 1 / SW);
          lensInside(ctx, t, RL);
          ctx.restore();
          const walkU = span(t, a.ifYou + .2, a.ifYou + 3.2);
          const person = { x: lerp(1090, 1420, sineIO(walkU)), dir: walkU > 0 ? 1 : -1, walk: walkU > 0 && walkU < 1 ? walkU * 9 : undefined };
          windowGlass(ctx, t, { lit, fill: smooth(span(t, ...tLit)), person: lit > .02 ? person : null });
          windowFrame(ctx, t, { cross: 1, dark: smooth(span(t, a.holding - .1, a.holding + 1.4)) });
          ctx.restore();
          // the light ring of the lens dims into the dark frame
          lensRing(ctx, RL, { light: 1 - smooth(span(t, a.holding - .3, a.holding + 1.2)) });
          lensMarks(ctx, t);
        } else {
          ctx.save(); ctx.beginPath(); ctx.arc(0, 0, lr, 0, 6.29); ctx.clip();
          lensInside(ctx, t, lr, lx, ly);
          ctx.restore();
          if (t > a.microscope - .5) { ctx.save(); ctx.scale(SW, SW); ctx.translate(-PLATE_WINDOW.cx, -PLATE_WINDOW.cy); windowFrame(ctx, t, { cross: span(t, a.microscope - .3, a.microscope + 1.1), dark: 0 }); ctx.restore(); }
          lensRing(ctx, lr, { light: 1 });
          lensMarks(ctx, t);
        }
        ctx.restore();
      }
      // ground and you (6.12 →), in plate units
      if (t > a.lookAt) { ctx.save(); ctx.translate(L.x, L.y); ctx.scale(SW, SW); ctx.translate(-PLATE_WINDOW.cx, -PLATE_WINDOW.cy); groundAndYou(ctx, t, { lit, look: .55 * (1 - smooth(span(t, a.subscribe, tZ - .6))) }); ctx.restore(); }
    });

    // ------------------------------------------------ the inside of the lens (lens coordinates, origin = lens centre)
    function lensInside(ctx, t, r, lx = L.x, ly = L.y) {
      const nums = .1 + .12 * morph + .16 * cond - .1 * smooth(span(t, a.mri - 1.5, a.mri + 1));
      lensField(ctx, t, r, { nums });
      // 5.11 → 6.01: the code lines magnified ×1.5, clear; they settle on the two baselines of the rhyme
      if (morph < 1) {
        ctx.save(); ctx.globalAlpha = 1 - smooth(span(morph, .75, 1));
        ctx.save(); ctx.scale(1.5, 1.5); ctx.translate(-lx, -ly);
        ctx.translate(0, fy);
        if (morph <= 0) codeLines(ctx, t, { ...pageS, runAt: () => 1 }, { lens: true, h: 14 });
        ctx.restore();
        if (morph > 0) {   // every token slides to its baseline and widens until the baselines are whole
          ctx.fillStyle = mixHex(P.cream, P.halo2, .3);
          CODE.forEach(({ y, toks }, i) => {
            const by = i < 6 ? Y1 : Y2, xs = i < 6 ? [X0, X1E] : [X0, SLX - 24];
            toks.forEach(([x, w], k) => {
              const u = smooth(span(morph, (i % 6) * .04 + k * .03, (i % 6) * .04 + k * .03 + .6));
              const x0 = (x - lx) * 1.5, y0 = (y + fy - ly) * 1.5, ww = w * 1.5;
              const tx = lerp(xs[0], xs[1], ((x - 676) / 600)), tw = (xs[1] - xs[0]) * (w / 600) + 30;
              const xx = lerp(x0, tx, u), yy = lerp(y0, by + 26, u), w2 = lerp(ww, tw, u), hh = lerp(21, 3, u);
              ctx.beginPath(); ctx.roundRect(xx, yy - hh / 2, w2, hh, hh / 2); ctx.fill();
            });
          });
        }
        ctx.restore();
      }
      // ---------------- the rhyme plan (6.01 → 6.08), condensing into three pieces (6.09)
      if (t > tMorph[0]) diagram(ctx, t);
      // ---------------- the microscope (6.09 →): pieces, the sleeper in the dark, the MRI slices
      if (t > tCond[0]) micro(ctx, t);
    }
    function diagram(ctx, t) {
      const base = smooth(span(morph, .6, 1)) * (1 - cond);
      if (base > 0) {   // the two baselines (line 2 only up to the slot)
        ctx.save(); ctx.globalAlpha = base; ctx.fillStyle = rgba(P.cream, .38);
        ctx.fillRect(X0, Y1 + 24, W1 + 10, 3); ctx.fillRect(X0, Y2 + 24, SLX - 24 - X0, 3); ctx.restore();
      }
      const sink = (i, n) => 1 - smooth(span(t, tCond[0] + (n - i) * .05, tCond[0] + (n - i) * .05 + .7));
      if (t > tWide[0]) label(ctx, 'ANTHROPIC · MARCH 2025', X0, -390, rise(span(t, a.march - .1, a.march + .9)) * sink(0, 1), { size: 36 });
      // line 1, word by word as spoken; "grab it" warm
      L1W.forEach((wd, i) => {
        const ts = a.line1[i]?.s ?? a.line1[a.line1.length - 1].s, u = rise(span(t, ts - .1, ts + .6)) * sink(i, L1W.length);
        if (u > 0) K.maskLine(ctx, [[wd, i >= 7 ? smooth(span(t, a.line1[7].s, a.line1[7].s + .8)) : 0]], X0 + pre(L1W, i), Y1, DS, u);
      });
      // 6.01 on "rhyme": a light writes along line 1 (still without text), parks at the line end and later rises to become the
      // end dot of "grab it"
      const tDotE = a.line1[8].e + .4;
      if (t > a.rhyme - .1 && t < tDotE) {
        const h = sineIO(span(t, a.rhyme - .1, a.rhyme + 1.7)), tail = expoOut(span(t, a.rhyme + 1.5, a.rhyme + 2.4));
        const bl = [[X0, Y1 + 25], [X0 + W1 + 10, Y1 + 25]];
        if (tail < 1) lineSpan(ctx, bl, h - .32 * (1 - tail), h, { col: rgba(P.halo0, .9), w: 3.2, glow: P.halo1 });
        const up = sineIO(span(t, a.line1[7].s, tDotE)), bx = lerp(X0 + W1 + 10, DOT1[0], up), by = lerp(Y1 + 25, DOT1[1], up);
        const r = lerp(14 + 2.5 * Math.sin(t * 2.3), 26, up), al = lerp(.8, .9, up) * smooth(span(t, a.rhyme - .1, a.rhyme + .2));
        halo(ctx, bx, by, r, al, P.halo1, P.core0);
      }
      const dot = t >= tDotE ? 1 - cond : 0;
      if (dot > 0) halo(ctx, DOT1[0], DOT1[1], 26 * dot, .9 * dot, P.halo1, P.core0);
      // the plan slot at the END of the empty line 2: dashed outline, label below
      const slotU = sineIO(span(t, a.second - .2, a.second + 1)) * (1 - smooth(span(t, tCond[0], tCond[0] + .6)));
      const shift = 26 * sineIO(span(t, a.moved - .1, a.moved + .7));
      if (slotU > 0) {
        const { x, y, w, h } = SLOT, pts = [[x + w / 2 + shift, y], [x + w - 14 + shift, y], [x + w + shift, y + 14], [x + w + shift, y + h - 14], [x + w - 14 + shift, y + h], [x + 14 + shift, y + h], [x + shift, y + h - 14], [x + shift, y + 14], [x + 14 + shift, y], [x + w / 2 + shift, y]];
        const glowS = pulse(t, a.rabbit, .3, 1.6) + pulse(t, a.seen, .3, 1.4);
        if (glowS > 0) halo(ctx, SLC[0] + shift, Y2 - 30, 220, .35 * glowS, P.halo1, P.halo0);
        lineSpan(ctx, pts, 0, slotU, { col: rgba(P.cream, .55), w: 2, dash: [10, 9] });
        label(ctx, 'ITS PLAN', SLC[0] + shift, Y2 + 80, rise(span(t, a.plan - .3, a.plan + .6)) * (1 - smooth(span(t, tCond[0], tCond[0] + .5))), { size: 34, align: 'center' });
      }
      // words: rabbit (planned, warm) → taken out, parked; habit; green (planted, cool)
      const tw = tweezerPath(t);
      const rabbitOut = sineIO(span(t, a.rabbitOut, a.rabbitOut + .9)), rabbitDown = sineIO(span(t, a.green + .02, a.green + .7));
      const habitIn = rise(span(t, a.newLine - .7, a.newLine + .1)), habitDown = sineIO(span(t, a.green - .02, a.green + .6));
      const greenSet = span(t, a.green - .02, a.green + .02) >= 1 ? 1 : 0;
      const cAll = 1 - cond;
      // rabbit
      {
        const glow = rise(span(t, a.rabbit - .15, a.rabbit + .5));
        if (glow > 0 && cAll > 0) {
          let x = SLC[0] + shift, y = Y2, col = P.halo0;
          if (t >= a.rabbitOut) { const p = tw.tip; x = p[0]; y = p[1] + lerp(36, 30, rabbitOut); col = mixHex(P.halo0, COOL, rabbitOut); if (t >= a.rabbitOut + .9) { x = PARK[0][0]; y = PARK[0][1]; } }
          if (rabbitDown > 0) { x = PARK[0][0]; y = lerp(PARK[0][1], PARK[1][1], rabbitDown); col = COOL; }
          if (t < a.rabbitOut) { ctx.save(); ctx.beginPath(); ctx.rect(SLOT.x - 40 + shift, Y2 - 140, SLOT.w + 80, 140 + 36); ctx.clip(); slotWord(ctx, 'rabbit', x, Y2 + (1 - glow) * 120, col, 1); ctx.restore(); if (glow > .3) halo(ctx, x, Y2 - 28, 120, .35 * glow * (1 - .6 * smooth(span(t, a.rabbit + .5, a.rabbit + 2.5))), P.halo1, P.halo0); }
          else slotWord(ctx, 'rabbit', x, y, col, cAll * (rabbitOut >= 1 ? .8 : 1), lerp(DS, 84, Math.max(rabbitOut, rabbitDown)));
        }
      }
      // habit
      if (habitIn > 0 && cAll > 0) {
        let x = SLC[0] + shift, y = Y2, col = P.halo0, sz = DS;
        if (habitDown > 0) { y = lerp(Y2, PARK[0][1], habitDown); col = mixHex(P.halo0, COOL, habitDown); sz = lerp(DS, 84, habitDown); }
        if (habitDown <= 0) { ctx.save(); ctx.beginPath(); ctx.rect(SLOT.x - 40, Y2 - 140, SLOT.w + 80, 176); ctx.clip(); slotWord(ctx, 'habit', x, Y2 + (1 - habitIn) * 120, col, 1); ctx.restore(); }
        else slotWord(ctx, 'habit', x, y, col, cAll * lerp(1, .8, habitDown), sz);
        const hg = pulse(t, a.habit, .3, 1.4); if (hg > 0) halo(ctx, x, Y2 - 28, 160, .35 * hg, P.halo1, P.halo0);
      }
      // green: carried in by the tweezers, then set
      if (t > a.thenThey - .5 && cAll > 0) {
        const p = greenSet ? [SLC[0] + shift, Y2] : [tw.tip[0], tw.tip[1] + 36];
        slotWord(ctx, 'green', p[0], p[1], COOLB, 1);
      }
      // line 2: (a) the rabbit line word by word; (b) the habit line as light dashes; (c) the green line as light dashes
      const sinkR = 1 - smooth(span(t, a.rabbitOut + .05, a.rabbitOut + .9));
      if (sinkR > 0) L2W.forEach((wd, i) => {
        const ts = a.line2[i].s, u = rise(span(t, ts - .08, ts + .55)) * (1 - smooth(span(t, a.rabbitOut + .05 + (L2W.length - i) * .08, a.rabbitOut + .45 + (L2W.length - i) * .08)));
        if (u > 0) K.maskLine(ctx, [[wd, 0]], X0 + pre(L2W, i), Y2, DS, u);
      });
      const dashLine = (u0, u1, col) => { if (u1 <= 0 || u0 >= 1) return; ctx.fillStyle = col; DASH2.forEach(([x, w], i) => { const k = clamp(span(lerp(X0, SLX, u1), x, x + w)) * (1 - clamp(span(lerp(X0, SLX, u0), x, x + w))); if (k <= 0) return; ctx.beginPath(); ctx.roundRect(x, Y2 - 30, w * k, 15, 7.5); ctx.fill(); }); };
      dashLine(0, sineIO(span(t, a.newLine + .1, a.habit - .1)) * (1 - sineIO(span(t, a.thenThey + .6, a.thenThey + 1.6))) * cAll, rgba(P.cream, .8));
      dashLine(0, sineIO(span(t, a.endedGreen - 1.3, a.endedGreen - .05)) * cAll, rgba(COOLB, .85));
      const r2p = pulse(t, a.rabbit2, .3, 1.4) * (1 - cond); if (r2p > 0 && t < a.rabbitOut) halo(ctx, SLC[0], Y2 - 28, 200, .4 * r2p, P.halo1, P.halo0);
      // the rhyme bracket: grab it ↔ the slot word (rabbit, then habit), cool and broken for green
      const bp = bracketPts(shift);
      const bR = sineIO(span(t, a.rabbit + .05, a.rabbit + .75)) * (1 - sineIO(span(t, a.rabbitOut, a.rabbitOut + .6)));
      const bH = sineIO(span(t, a.habit - .05, a.habit + .65)) * (1 - sineIO(span(t, a.green - .1, a.green + .45)));
      if (bR > 0) K.trailSpan(ctx, bp, 0, bR, { w: 2.6, spark: bR < 1 });
      if (bH > 0) K.trailSpan(ctx, bp, 0, bH, { w: 2.6, spark: bH < 1 });
      const bG = sineIO(span(t, a.endedGreen + .05, a.endedGreen + .75)) * cAll;
      if (bG > 0) {
        const br = expoOut(span(t, a.rhymeNo - .05, a.rhymeNo + .5));
        if (br <= 0) lineSpan(ctx, bp, 0, bG, { col: COOLB, w: 2.6 });
        else { lineSpan(ctx, bp, 0, .5 - .1 * br, { col: COOLB, w: 2.6, dash: br > .5 ? [8, 10] : null }); lineSpan(ctx, bp, .5 + .1 * br, 1, { col: COOLB, w: 2.6, dash: br > .5 ? [8, 10] : null }); }
      }
      tweezers(ctx, tw.tip, tw.open, tw.a);
    }
    function tweezerPath(t) {
      // 6.05: in to rabbit, grip, out to the parking place, release, back · 6.07: in with green, set, back
      const off = [SLC[0] + 520, Y2 + 640];
      const slotTip = [SLC[0], Y2 - 36], park = [PARK[0][0], PARK[0][1] - 30];
      let tip = off, open = 1, a1 = 0;
      const k1 = sineIO(span(t, a.reached - 1.1, a.reached + .1)), k2 = sineIO(span(t, a.rabbitOut, a.rabbitOut + .9)), k3 = sineIO(span(t, a.rabbitOut + 1.2, a.rabbitOut + 2.2));
      if (t > a.reached - 1.2 && t < a.rabbitOut + 2.3) {
        tip = [lerp(off[0], slotTip[0], k1), lerp(off[1], slotTip[1], k1)];
        if (k2 > 0) tip = [lerp(slotTip[0], park[0], k2), lerp(slotTip[1], park[1], k2)];
        if (k3 > 0) tip = [lerp(park[0], off[0], k3), lerp(park[1], off[1], k3)];
        open = 1 - smooth(span(t, a.reached + .1, a.reached + .5)) + smooth(span(t, a.rabbitOut + .9, a.rabbitOut + 1.15));
        a1 = 1;
      }
      const g1 = sineIO(span(t, a.thenThey - .2, a.green - .02)), g2 = sineIO(span(t, a.green + .25, a.green + 1.25));
      if (t > a.thenThey - .3 && t < a.green + 1.4) {
        tip = [lerp(off[0], slotTip[0], g1), lerp(off[1], slotTip[1], g1)];
        if (g2 > 0) tip = [lerp(slotTip[0], off[0], g2), lerp(slotTip[1], off[1], g2)];
        open = smooth(span(t, a.green + .02, a.green + .25)) * .8 + .2 * (1 - g1);
        a1 = 1;
      }
      return { tip, open: clamp(open), a: a1 };
    }
    function micro(ctx, t) {
      // three pieces: where "grab it", the plan slot and the parked words were
      const P3 = [DOT1, [SLC[0] + 26, Y2 - 30], [PARK[0][0], (PARK[0][1] + PARK[1][1]) / 2 - 20]];
      const sp = smooth(span(t, tCond[0] + .2, tCond[1] + .3));
      const toMri = sineIO(span(t, a.man + .6, a.man + 2.4));
      const kp = sp * (1 - smooth(span(toMri, .5, 1)));
      if (kp > 0) {
        ctx.save(); ctx.beginPath(); P3.forEach(([x, y]) => { ctx.moveTo(x + 175, y); ctx.arc(x, y, 175, 0, 6.29); }); ctx.clip();
        P3.forEach(([x, y], i) => { const br = 1 + .25 * pulse(t, a.pieces + i * .15, .3, 1.4); ctx.fillStyle = rad(ctx, x, y, 175, [[0, rgba(P.halo1, .34 * kp * br)], [.55, rgba(P.halo1, .16 * kp * br)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x - 175, y - 175, 350, 350); });
        ctx.translate(-960, -560); X.numberField(ctx, t + 40, { gather: 0, file: PLATE_FILE, a: .95 * kp, size: 26 }); ctx.restore();
      }
      P3.forEach(([x, y], i) => {
        const tx = lerp(x, (i - 1) * 90, toMri), ty = lerp(y, SLICE_Y(i) , toMri);
        const pr = pulse(t, a.pieces + i * .15, .3, 1.4), k = sp * (1 - smooth(span(toMri, .7, 1)));
        if (k <= 0) return;
        halo(ctx, tx, ty, 120 + 40 * pr, (.45 + .3 * pr) * k, P.halo1, P.core0);
        ctx.fillStyle = rgba(P.core0, k); ctx.beginPath(); ctx.arc(tx, ty, 7 + 2 * pr, 0, 6.29); ctx.fill();
      });
      // the sleeper in the dark, outside the pieces (a cool cut token)
      const gs = smooth(span(t, tCond[0] + .6, tCond[1] + 1)) * (1 - smooth(span(t, a.holding, a.holding + 1)));
      if (gs > 0) {
        const [gx, gy] = GAPL, gl = pulse(t, a.sleeper, .3, 2);
        ctx.save(); ctx.globalAlpha = gs * (.55 + .45 * gl); ctx.fillStyle = COOL;
        ctx.beginPath(); ctx.roundRect(gx - 170, gy - 14, 140, 28, 14); ctx.fill(); ctx.beginPath(); ctx.roundRect(gx + 30, gy - 14, 124, 28, 14); ctx.fill(); ctx.restore();
        halo(ctx, gx, gy, 130 + 80 * gl, (.25 + .45 * gl) * gs, P.blue1, COOLB);
      }
      // the MRI: slices of light build up from the bottom, only half (5 of 9); the rest stays a dashed outline
      if (t > a.man) {
        for (let k = 0; k < SLICES; k++) {
          const y = SLICE_Y(k), lit = k < 5;
          const u = lit ? sineIO(span(t, a.man + 1.6 + k * .75, a.man + 2.5 + k * .75)) : sineIO(span(t, a.mri + .4 + (k - 5) * .2, a.mri + 1.3 + (k - 5) * .2));
          const out = 1 - smooth(span(t, a.holding + .2, a.holding + 1.2));
          if (u <= 0 || out <= 0) continue;
          const hw = 380 * (lit ? lerp(.3, 1, u) : 1), hd = 92 * (lit ? lerp(.3, 1, u) : 1), yy = lit ? lerp(y + 50, y, u) : y;
          const p = new Path2D(); p.moveTo(-hw, yy); p.lineTo(0, yy - hd); p.lineTo(hw, yy); p.lineTo(0, yy + hd); p.closePath();
          if (lit) { ctx.save(); ctx.globalAlpha = out; ctx.fillStyle = rad(ctx, 0, yy, hw, [[0, rgba(P.core1, .55)], [.6, rgba(P.halo0, .35)], [1, rgba(P.halo1, .15)]]); ctx.fill(p); ctx.strokeStyle = rgba(P.core0, .9); ctx.lineWidth = 2.4; ctx.stroke(p); ctx.restore(); }
          else { const pts = [[-hw, yy], [0, yy - hd], [hw, yy], [0, yy + hd], [-hw, yy]]; lineSpan(ctx, pts, 0, u * out, { col: rgba(COOLB, .7), w: 2, dash: [8, 10] }); }
        }
      }
    }
    // marks on and around the lens: the microscope ticks + pointer, its label, the timeline under it
    function lensMarks(ctx, t) {
      const tk = sineIO(span(t, a.microscope, a.microscope + 1.3)) * (1 - smooth(span(t, a.lookAt + .1, a.holding + .4)));
      if (tk > 0) {
        ctx.save(); ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 5;
        const n = 72; for (let i = 0; i < n * tk; i++) { const q = -Math.PI / 2 + i / n * 6.283, l0 = RL + 24, l1 = RL + 24 + (i % 6 === 0 ? 70 : 36) * Math.min(1, tk * 1.4); ctx.beginPath(); ctx.moveTo(Math.cos(q) * l0, Math.sin(q) * l0); ctx.lineTo(Math.cos(q) * l1, Math.sin(q) * l1); ctx.stroke(); }
        // the pointer: points up, then turns toward the sleeper
        const ga = Math.atan2(GAPL[1], GAPL[0]), q = lerp(-Math.PI / 2, ga, sineIO(span(t, a.rightWay - .8, a.rightWay + .8)));
        const pr = RL + 130, tp = new Path2D(); tp.moveTo(Math.cos(q) * (RL + 34), Math.sin(q) * (RL + 34)); tp.lineTo(Math.cos(q + .045) * pr, Math.sin(q + .045) * pr); tp.lineTo(Math.cos(q - .045) * pr, Math.sin(q - .045) * pr); tp.closePath();
        ctx.globalAlpha = tk; ctx.fillStyle = P.halo0; ctx.fill(tp); ctx.restore();
        if (tk > .5) halo(ctx, Math.cos(q) * (RL + 80), Math.sin(q) * (RL + 80), 110, .45 * tk, P.halo1, P.halo0);
      }
      const lab = rise(span(t, a.microscope + .4, a.microscope + 1.3)) * (1 - smooth(span(t, a.man + .2, a.man + .9)));
      if (lab > 0) label(ctx, 'AI MICROSCOPE', 0, RL + 190, lab, { size: 76, align: 'center' });
      // the timeline (6.11): 2025 → +5–10 YEARS, the future dashed
      const tl = span(t, a.five - .8, a.five + 1.2), back = smooth(span(t, a.lookAt - .2, a.lookAt + .5));
      if (tl > 0 && back < 1) {
        const y = RL + 170, xa = -700, xb = -380, xc = 720, k = 1 - back;
        ctx.save(); ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.arc(xa, y, 16 * smooth(span(tl, 0, .2)) * k, 0, 6.29); ctx.fill(); ctx.restore();
        if (k > 0) { lineSpan(ctx, [[xa, y], [xb, y]], 0, sineIO(span(tl, .1, .4)) * k, { col: P.halo0, w: 8, glow: P.halo1 }); lineSpan(ctx, [[xb, y], [xc, y]], 0, sineIO(span(tl, .35, .9)) * k, { col: rgba(COOLB, .85), w: 7, dash: [18, 22] }); }
        label(ctx, '2025', xa - 10, y - 40, rise(span(tl, .1, .5)) * k, { size: 80, col: P.cream });
        label(ctx, '+5–10 YEARS', xc, y - 40, rise(span(t, a.five - .05, a.five + .8)) * k, { size: 72, align: 'right', col: COOLB });
      }
    }
  };
}
