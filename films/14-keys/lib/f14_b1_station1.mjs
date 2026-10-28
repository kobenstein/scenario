// Film 14 · B1 · station 1 as ONE plan sequence from 2.04 to 4.08 (41.76–151.14 s), shared by scenes/sc02.mjs (from 'So who'),
// sc03.mjs and sc04.mjs, so every chunk seam inside B1 is the same function at the same t. Plan: docs/shots.md · rules: docs/MOTION.md.
//
// | ID     | anchor (word)                         | picture (one idea)                                                      | moves              | → carrier             |
// |--------|---------------------------------------|-------------------------------------------------------------------------|--------------------|-----------------------|
// | 2.04   | reach · file                          | over the hook (ground): small indigo hands rise out of the field and    | hands reach        | plan sequence         |
// |        |                                       | reach for the two files; the original glows warm                        |                    |                       |
// | 2.05   | inside · rhyme                        | the hands sink, the copy falls back into the field; push into the file; | push · lines       | plan sequence         |
// |        |                                       | its numbers order themselves into two empty lines of light; on 'rhyme' |                    |                       |
// |        |                                       | the first line writes itself as a stroke of light                      |                    |                       |
// | 2.06   | picked · planning · who gets          | a point glows at the END of the empty second line · PLANNING AHEAD;    | point · pull back  | the file              |
// |        |                                       | the lines fall back into numbers, pull back                             |                    |                       |
// | 3.01   | billions · training                   | the field becomes endless · BILLIONS OF NUMBERS; a wave of light runs   | pull back · wave   | plan sequence         |
// |        |                                       | through it and the values change (learned)                              |                    |                       |
// | 3.02   | computing power · run the model       | field numbers condense into a block of cores; the file glides into it;  | block · glide ·    | file → vault interior |
// |        |                                       | a cool ring (the machine) spins up                                      | ring               |                       |
// | 3.03   | oldest · touch                        | pull back out of a round opening: the vault; the door swings shut; the  | pull back · door   | plan sequence         |
// |        |                                       | light stays only in its joints                                          |                    |                       |
// | 3.04   | master · pocket · different           | one indigo figure before the door, its coat pocket glimmers (no key);   | pan                | plan sequence         |
// |        |                                       | the camera follows it to the lock: TWO light fields                     |                    |                       |
// | 3.05   | May · Never one                       | its hand on one field: half lit, the door stays shut · the card         | hand · card        | plan sequence         |
// |        |                                       | "two-party authorization for model weight access" ANTHROPIC · MAY 2025 |                    |                       |
// | 3.06   | two people · yes                      | a second figure from the right, both fields warm, a slit of light       | figure · slit      | slit → lamp (flight)  |
// | 3.07   | second signature · slower · point     | you at a desk under a lamp, a sheet of light with two signature lines;  | clock · signature  | lamp pool → zone ring |
// |        |                                       | the clock runs, the second signature arrives; tilt down onto the pool   | · tilt             |                       |
// | 4.01   | second lock · throttle                | DIAGRAM: the pool is the secure area round the file; a narrow neck (the | neck · dots        | plan sequence         |
// |        |                                       | throttle); single dots leave through it on a thin thread                |                    |                       |
// | 4.02   | huge · long time · notice             | outside, a long bar creeps; an eye of cool light opens on the thread    | bar · eye          | plan sequence         |
// | 4.03   | sheer size · advantage                | the file grows, the thread thins · SIZE BECOMES SECURITY                | file grows         | thread → console edge |
// | 4.04   | old · two-person rule                 | push along the thread; it is the edge of a 1950s launch console; the    | push · pull back   | plan sequence         |
// |        |                                       | room grows out of it · LATE 1950s                                       |                    |                       |
// | 4.05 🔑| officers · keys · same moment         | two officers step in, keys of light grow from the locks, both turn      | officers · turn    | plan sequence         |
// | 4.06 🔑| far apart · both                      | pull back, a measuring line, one arm reaches far short                  | line · reach       | plan sequence         |
// | 4.07 🔑★| strong hand · two                     | push: two hands, two keys, the brightest light                         | push               | plan sequence         |
// | 4.08   | thieves · inside the file             | the keys sink into the dark, the file lights on the screen, push in    | push               | plateScreen (B2)      |
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as X from './f14_kit.mjs';
import { hook, hookAnchors, hookInner, FILE, COPY_DX } from './f14_hook.mjs';
import { plateScreen, SEAM_HALF } from './f14_seams.mjs';
import { Path2D } from '@napi-rs/canvas';
import { vaultDoor, vaultWall, launchRoom, LR } from './f14_b1_rooms.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cardM, cam3, camAt, camDrift, aim, F0, prng } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;

// ------------------------------------------------------------------------------------------------------------------ anchors
export function b1Anchors(T) {
  const S = (s, w, n) => T.S(s, w, n), Ee = (s, w, n) => T.E(s, w, n);
  const last = (s, ph) => T.line(s, ph).words.at(-1).s;          // the last word of the sentence ('It takes two.')
  return {
    who: S('s03', 'So who'), reach: S('s03', 'reach'), file: S('s03', 'that file'), s03e: Ee('s03'),
    researchers: S('s04', 'Researchers'), inside: S('s04', 'inside'), rhyme: S('s04', 'rhyme'), before: S('s04', 'Before'), picked: S('s04', 'picked'),
    planning: S('s04', 'planning'), whatElse: S('s04', 'So what'), whoGets: S('s04', 'who gets'), s04e: Ee('s04'),
    billions: S('s05', 'billions'), training: S('s05', 'training'), whoever: S('s05', 'Whoever'), computing: S('s05', 'computing'), run: S('s05', 'run the model'),
    firstKey: S('s05', 'So the first'), oldest: S('s05', 'oldest'), touch: S('s05', 'touch'), tempting: S('s05', 'tempting'), master: S('s05', 'master'),
    pocket: S('s05', 'pocket'), different: S('s05', 'different'), atAnth: S('s05', 'At Anthropic'), may: T.line('s05', 'since May').words.find((w) => w.w === 'May').s, never: S('s05', 'Never one'),
    opening: S('s05', 'Opening'), twoPeople: S('s05', 'two people'), yes: S('s05', 'yes'), ifYou: S('s05', 'If you'), second: S('s05', 'second signature'),
    slower: S('s05', 'slower'), point: S('s05', 'point'), s05e: Ee('s05'),
    secondLock: S('s06', 'second lock'), every: S('s06', 'Every bit'), secure: S('s06', 'secure area'), throttle: S('s06', 'throttle'), huge: S('s06', 'huge'),
    longTime: S('s06', 'long time'), notice: S('s06', 'notice'), asLab: S('s06', 'As the lab'), sheer: S('s06', 'sheer size'), becomes: S('s06', 'becomes'),
    advantage: S('s06', 'advantage'), s06e: Ee('s06'),
    idea: S('s07', 'The idea'), old: S('s07', 'old'), late: S('s07', 'late'), rule: S('s07', 'two-person rule'), inOld: S('s07', 'In the old'),
    officers: S('s07', 'officers'), keys: S('s07', 'their keys'), same: S('s07', 'same moment'), keysSat: S('s07', 'The keys sat'), far: S('s07', 'far apart'),
    both: S('s07', 'both'), safest: S('s07', 'The safest'), strong: S('s07', 'strong hand'), two: last('s07', 'It takes'), but: S('s07', 'But a vault'),
    thieves: S('s07', 'thieves'), whatIf: S('s07', 'What if'), insideFile: S('s07', 'inside the file'), s07e: Ee('s07'),
    T0: T.seg('s08').start,
  };
}

// ------------------------------------------------------------------------------------------------------------------ the field (weights)
// An exact replica of f14_kit digits(FILE) + numberField (prng 2025, same order, same values), so the first frame drawn here is the
// hook's frame; extended with: an endless far field, the training wave, digits that become lines, cores of the compute block.
const FC = [(FILE.rect[0] + FILE.rect[2]) / 2, (FILE.rect[1] + FILE.rect[3]) / 2];
const FIELD = (() => {
  const r = prng(2025), out = [], [fx0, fy0, fx1, fy1] = FILE.rect;
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
  // extensions (a separate generator, so the replica above stays bit-identical)
  const q = prng(1403), alt = (d) => { const v = (q() * 2 - 1) * (q() < .2 ? 3 : 1); d.s2 = (v < 0 ? '−' : '') + Math.abs(v).toFixed(d.s.length > 5 ? 3 : 2); };
  for (const d of out) { alt(d); d.col = d.tgt ? (d.r2 > .35 ? P.core1 : P.halo0) : mixHex(P.blue2, P.cream, .45 + .3 * d.r2); d.dist = Math.hypot(d.x - FC[0], d.y - FC[1]); }
  // the far field: the same lattice, far beyond the hook's grid (seen only when the camera pulls back: "billions")
  const far = [];
  for (let j = -44; j < 62; j++) for (let i = -60; i < 82; i++) {
    if (i >= -7 && i < 29 && j >= -7 && j < 26) continue;
    const x = i * 92 + (j % 2) * 46 + (q() - .5) * 14, y = j * 58 + (q() - .5) * 8;
    const v = (q() * 2 - 1) * (q() < .2 ? 3 : 1), s = (v < 0 ? '−' : '') + Math.abs(v).toFixed(q() < .5 ? 2 : 3);
    const d = { x, y, s, r1: q(), r2: q(), tgt: null }; alt(d); d.col = mixHex(P.blue2, P.cream, .45 + .3 * d.r2); d.dist = Math.hypot(x - FC[0], y - FC[1]); far.push(d);
  }
  // the file's digits in reading order (row-major), each with its line slot (2.05): rows 0–7 → line 1, rows 8–14 → line 2
  const inFile = out.filter((d) => d.tgt).sort((a, b) => a.tgt[3] - b.tgt[3] || a.tgt[2] - b.tgt[2]);
  inFile.forEach((d, n) => { d.line = n < 40 ? 0 : 1; });
  for (const L of [0, 1]) { const ds = inFile.filter((d) => d.line === L).sort((a, b) => a.tgt[2] - b.tgt[2] || a.tgt[3] - b.tgt[3]); ds.forEach((d, n) => { d.slot = n / (ds.length - 1); }); }
  return { out, far, inFile };
})();
// lines inside the file (inner coords)
const LINES = { x0: 748, x1: 1172, y: [486, 646] };
// the compute block (3.02): cells take the nearest field digits (they condense into cores)
const BX = 20, BY = 566, BCOLS = 15, BROWS = 13, BP = 62;
const CELLS = (() => {
  const r = prng(70), cells = [], pool = FIELD.out.filter((d) => !d.tgt);
  for (let j = 0; j < BROWS; j++) for (let i = 0; i < BCOLS; i++) cells.push({ x: BX + (i - (BCOLS - 1) / 2) * BP, y: BY + (j - (BROWS - 1) / 2) * BP, lit: r(), ph: r() * 6.28 });
  for (const c of cells) {
    let bi = -1, bd = 1e12; for (let i = 0; i < pool.length; i++) { const d = (pool[i].x - c.x) ** 2 + (pool[i].y - c.y) ** 2; if (d < bd) { bd = d; bi = i; } }
    c.d = pool[bi]; pool[bi].cell = c; pool.splice(bi, 1);
    c.delay = Math.hypot(c.x - BX, c.y - BY) / 640 * .5;
  }
  return cells;
})();

// st: { R (lit radius of the field), wave (radius of the training wave, < 0 = none), waveDone, lineU, fileDX/fileDY (file glide),
//       blockU (cores condense), run (0..1 cores running), cut (copy dissolve 0..1), copyA, M: {k,e,f} inner → screen }
function fieldLayer(ctx, t, st) {
  const { k, e, f } = st.M, R = st.R ?? 1050, cutR = Math.max(2600, R + 1550);
  const fs = 20 * k, dashM = smooth(span(11 - fs, 0, 3));                  // level of detail: tiny numbers become short dashes
  const ix0 = -e / k - 120, ix1 = (W - e) / k + 40, iy0 = -f / k - 30, iy1 = (H - f) / k + 30;
  const wv = st.wave ?? -1, blockU = st.blockU ?? 0;
  ctx.save(); ctx.font = '500 20px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const draw = (d, al, col, s, x, y) => {
    if (al <= .004) return;
    if (dashM < 1) { ctx.globalAlpha = al * (1 - dashM); ctx.fillStyle = col; ctx.fillText(s, x, y); }
    if (dashM > 0) { ctx.globalAlpha = al * dashM * .5; ctx.fillStyle = col; ctx.fillRect(x, y - 9, s.length * 10.5, 7); }
  };
  const field = (d) => {
    if (d.dist > cutR) return;
    if (d.x < ix0 || d.x > ix1 || d.y < iy0 || d.y > iy1) return;
    const wave = .5 + .5 * Math.sin(t * .4 - d.dist * .004 + d.r1 * 2), near = Math.exp(-d.dist / 700);
    let al = (.3 + .4 * wave) * (.55 + .45 * near) * Math.exp(-Math.max(0, d.dist - R) / 450) * (st.fieldA ?? .2);
    let col = d.col, s = d.s;
    if (wv > -1) { const b = Math.exp(-(((d.dist - wv) / 170) ** 2)); if (b > .02) { al = al + .55 * b; col = mixHex(col, P.halo0, b); } if (d.dist < wv - 60) s = d.s2; }
    if (d.cell && blockU > 0) { const c = d.cell, u = smooth(span(blockU, c.delay, c.delay + .5)); al *= 1 - u; }
    draw(d, al, col, s, d.x + Math.sin(t * .25 + d.r1 * 7) * .6, d.y);
  };
  for (const d of FIELD.out) if (!d.tgt) field(d);
  if (R > 1100) for (const d of FIELD.far) field(d);
  ctx.restore();
}
// the cores of the compute block (squares of light, condensed from the field digits)
function coresLayer(ctx, t, st) {
  const blockU = st.blockU ?? 0; if (blockU <= 0) return;
  const run = st.run ?? 0;
  ctx.save();
  for (const c of CELLS) {
    const u = smooth(span(blockU, c.delay, c.delay + .5)); if (u <= 0) continue;
    const d = c.d, x = lerp(d.x + 20, c.x, u), y = lerp(d.y - 7, c.y, u), s = lerp(8, 38, u);
    const tw = .5 + .5 * Math.sin(t * (1.1 + 5 * run) * (.6 + c.lit) + c.ph);
    const hot = c.lit > .82 ? 1 : 0, al = u * (.28 + .22 * tw + .3 * hot + .25 * run * tw);
    ctx.globalAlpha = clamp(al); ctx.fillStyle = hot ? mixHex(P.cream, P.halo0, .4) : mixHex(P.blue2, P.cream, .55);
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
  ctx.restore();
}
// the file (original): its digits (they can become the two lines), glow, outline, fold, label. ox/oy = glide offset
function fileLayer(ctx, t, st) {
  const ox = st.fileDX ?? 0, oy = st.fileDY ?? 0, lineU = st.lineU ?? 0, wv = st.wave ?? -1, warm = st.warm ?? 0;
  ctx.save(); ctx.translate(ox, oy);
  // digits
  ctx.save(); ctx.font = '500 20px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  for (const d of FIELD.inFile) {
    const wave = .5 + .5 * Math.sin(t * .4 - d.dist * .004 + d.r1 * 2);
    let x = d.tgt[0], y = d.tgt[1], al = .7 + .3 * wave, col = d.col, s = d.s, sz = 1;
    if (wv > -1 && Math.hypot(x - FC[0], y - FC[1]) < wv - 40) s = d.s2;
    if (lineU > 0) {
      const dl = d.slot * .45 + d.line * .08, kk = smooth(span(lineU, dl, dl + .42));
      const tx = lerp(LINES.x0, LINES.x1, d.slot), ty = LINES.y[d.line], bend = Math.sin(kk * Math.PI) * 34 * (d.r2 - .5);
      x = lerp(x, tx, kk) + bend; y = lerp(y, ty, kk) - bend * .5; sz = lerp(1, .45, kk); al *= 1 - smooth(span(kk, .72, 1));
      if (al <= .003) continue;
    }
    ctx.globalAlpha = clamp(al); ctx.fillStyle = col;
    if (sz !== 1) { ctx.save(); ctx.translate(x, y); ctx.scale(sz, sz); ctx.fillText(s, Math.sin(t * .25 + d.r1 * 7) * .6, 0); ctx.restore(); }
    else ctx.fillText(s, x + Math.sin(t * .25 + d.r1 * 7) * .6, y);
  }
  ctx.restore();
  // glow (the hero light), outline, fold, label: exactly as in the hook's inside() at its end state; warm = an extra pulse
  const dim = 1 - .55 * smooth(span(lineU, .1, .6));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, 960, 500, 560, [[0, rgba(P.halo0, .3 * dim)], [.6, rgba(P.halo1, .12 * dim)], [1, rgba(P.halo1, .04 * dim)]]); ctx.fill(FILE.path); ctx.restore();
  E.glowFill(ctx, FILE.path, 90, .16, P.blue0); E.glowFill(ctx, FILE.path, 26, .3, P.halo1); warmLayer(ctx, warm);
  K.trailSpan(ctx, FILE.pts.map(([x, y]) => [x, y]), 0, 1, { w: 3 });
  ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = rgba(P.halo1, .5); ctx.fill(FILE.fold); ctx.restore();
  K.maskLine(ctx, [['THE WEIGHTS', 0]], 960, FILE.rect[1] - 34, 30, st.labelU ?? 1, { serif: false, align: 'center', col: P.halo2, glow: false });
  ctx.restore();
}
// the warm pulse of the original on its own (drawn over the hook's frame before tSw; fileLayer draws the same inside its own glow)
function warmLayer(ctx, warm) {
  if (warm <= .002) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, 960, 500, 560, [[0, rgba(P.halo0, .12 * warm)], [.6, rgba(P.halo1, .06 * warm)], [1, rgba(P.halo1, 0)]]); ctx.fill(FILE.path); ctx.restore();
  E.glowFill(ctx, FILE.path, 26, .15 * warm, P.halo1);
}
// the copy (cool): as in the hook; cut 0..1 = it falls back into the field (digits drift out, the outline retracts)
const COPYDIR = FIELD.inFile.map((d, i) => { const r = prng(500 + i); const a = r() * 6.28; return [Math.cos(a) * (90 + 160 * r()), Math.sin(a) * (60 + 110 * r()), r() * .35]; });
function copyLayer(ctx, t, st) {
  const cu = st.cut ?? 0; if (cu >= 1) return;
  ctx.save(); ctx.translate(COPY_DX, 0);
  ctx.save(); ctx.font = '500 20px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; const col = mixHex(P.blue2, P.cream, .6);
  FIELD.inFile.forEach((d, i) => {
    const [dx, dy, dl] = COPYDIR[i], kk = smooth(span(cu, dl, dl + .6));
    const wave = .5 + .5 * Math.sin(t * .4 - d.dist * .004 + d.r1 * 2), al = .7 * (.7 + .3 * wave) * (1 - kk * .85);
    ctx.globalAlpha = clamp(al); ctx.fillStyle = col; ctx.fillText(d.s, d.tgt[0] + dx * kk + Math.sin(t * .25 + d.r1 * 7) * .6, d.tgt[1] + dy * kk);
  });
  ctx.restore();
  const ou = smooth(span(cu, 0, .7));
  if (ou <= 0) { ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 2.4; ctx.stroke(FILE.path); ctx.fillStyle = rgba(P.blue1, .5); ctx.fill(FILE.fold); }
  else {
    // the outline retracts from both ends toward its middle (the cool line slips back into the field)
    const pts = FILE.pts, len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const Lt = len[len.length - 1], a0 = Lt * .5 * ou, a1 = Lt * (1 - .5 * ou);
    const at = (dd) => { let i = 1; while (i < pts.length - 1 && len[i] < dd) i++; const ff = (dd - len[i - 1]) / (len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], ff), lerp(pts[i - 1][1], pts[i][1], ff), i]; };
    if (a1 > a0) { const [sx, sy, i0] = at(a0), [ex, ey, i1] = at(a1); ctx.strokeStyle = rgba(P.cream, .75 * (1 - ou * .3)); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(sx, sy); for (let i = i0; i < i1; i++) ctx.lineTo(...pts[i]); ctx.lineTo(ex, ey); ctx.stroke(); }
    ctx.globalAlpha = 1 - ou; ctx.fillStyle = rgba(P.blue1, .5); ctx.fill(FILE.fold); ctx.globalAlpha = 1;
  }
  ctx.restore();
}
// the hands (2.04): small indigo silhouettes rise out of the field and reach for the files (inner coords)
const HANDS = [
  { w0: [380, 1260], w1: [560, 905], ang: -.95, L: 92, d: 0 },          // lower left → the original's lower left corner
  { w0: [-120, 470], w1: [520, 470], ang: .02, L: 96, d: .3 },          // from the left → its side
  { w0: [1240, 1240], w1: [1265, 900], ang: -1.62, L: 84, d: .55 },     // from below, between → the copy
  { w0: [1990, -170], w1: [1700, 150], ang: 2.25, L: 88, d: .85 },      // from the upper right → the copy's top
  { w0: [520, -220], w1: [700, 130], ang: 1.1, L: 80, d: 1.1 },         // from above left → the original's top
];
function handsLayer(ctx, t, a) {
  for (const h of HANDS) {
    const t0 = a.who + .05 + h.d * .75, u = sineIO(span(t, t0, t0 + 1.25)) * (1 - sineIO(span(t, a.researchers - .75 + h.d * .25, a.researchers + .7 + h.d * .25)));
    if (u <= .001) continue;
    const x = lerp(h.w0[0], h.w1[0], u), y = lerp(h.w0[1], h.w1[1], u) + Math.sin(t * .9 + h.d * 3) * 3 * u;
    X.darkHand(ctx, E.handMatrix(x, y, h.ang + .04 * Math.sin(t * .6 + h.d), h.L, 1), { pose: 'open', curl: lerp(.35, .12, u), spread: .5, warm: 0 });
  }
}
// the two empty lines, the stroke of the first, the point at the end of the second, PLANNING AHEAD (inner coords, in the file)
const SQUIG = (() => { const p = []; for (let i = 0; i <= 140; i++) { const u = i / 140, x = lerp(LINES.x0 + 6, LINES.x0 + (LINES.x1 - LINES.x0) * .82, u); p.push([x, LINES.y[0] - 16 - 13 * Math.sin(u * 37) * (.6 + .4 * Math.sin(u * 7.3)) - 6 * Math.sin(u * 11 + 1)]); } return p; })();
function linesLayer(ctx, t, a, st) {
  const lineU = st.lineU ?? 0, ox = st.fileDX ?? 0;
  if (lineU <= .25) return;
  ctx.save(); ctx.translate(ox, 0);
  const lu = sineIO(span(lineU, .3, 1)), back = st.back ?? 0;
  for (let i = 0; i < 2; i++) {
    const x1 = lerp(LINES.x0, LINES.x1, lu); if (x1 <= LINES.x0 + 1) continue;
    K.trailSpan(ctx, [[LINES.x0, LINES.y[i]], [x1, LINES.y[i]]], 0, 1, { w: 2.2, spark: false, a: .9 });
  }
  // the first line writes itself (rhyme), the second stays empty; its END point glows before the line begins (picked)
  const wU = sineIO(span(t, a.rhyme - .15, a.rhyme + 1.35)), w0 = sineIO(back);
  if (wU > w0) K.trailSpan(ctx, SQUIG, w0, wU, { w: 2.6, spark: wU < 1 });
  const pU = expoOut(span(t, a.picked - .05, a.picked + .5)) * (1 - smooth(span(back, 0, .6)));
  const pre = .35 * Math.exp(-(((t - (a.picked - .3)) / .08) ** 2));          // anticipation: a flicker just before
  if (pU > 0 || pre > .01) {
    const br = (1 + .08 * Math.sin(t * 2.4)) * pU + pre;
    E.halo(ctx, LINES.x1, LINES.y[1], 120 * br, .9 * br, P.halo1, P.core0);
    ctx.fillStyle = rgba(P.core0, clamp(br)); ctx.beginPath(); ctx.arc(LINES.x1, LINES.y[1], 7 * clamp(br), 0, 6.29); ctx.fill();
  }
  const lab = rise(span(t, a.planning - .1, a.planning + .9)) * (1 - expoIn(span(back, 0, .5)));
  if (lab > 0) K.maskLine(ctx, [['PLANNING AHEAD', 0]], LINES.x1, LINES.y[1] + 58, 26, lab, { serif: false, align: 'center', col: P.halo2, glow: false });
  ctx.restore();
}
// the ring (the machine): cool cream dashes round the block, it spins up on 'run the model'
function ringLayer(ctx, t, a, cx, cy) {
  const t0 = a.run - .1, u = expoOut(span(t, t0 - .2, t0 + .9)); if (u <= 0) return;
  const x = Math.max(0, t - t0), om = .55, tau = 1.1, phi = om * (x - (1 - Math.exp(-x / tau)) * tau);
  const R = 690, n = 54, col = mixHex(P.cream, P.blue0, .25);
  ctx.save(); ctx.lineCap = 'round';
  const seg = (lw, al, blur) => {
    ctx.save(); if (blur) { ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${blur}px)`; }
    ctx.strokeStyle = rgba(blur ? P.blue0 : col, al); ctx.lineWidth = lw; ctx.beginPath();
    for (let i = 0; i < n * u; i++) { const q = phi + i / n * Math.PI * 2 - Math.PI / 2; ctx.moveTo(cx + Math.cos(q) * R, cy + Math.sin(q) * R); ctx.arc(cx, cy, R, q, q + Math.PI * 2 / n * .62); }
    ctx.stroke(); ctx.restore();
  };
  seg(26, .7, 14); seg(9, .85, 0);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------------ act 1 stage
// the inner world as a card at ZI (inner → design: (p − C0)·Q + centre), the vault wall at ZW, the figures at ZP
const ZI = 8000, Q = .2, ZW = 1500, ZP = 1300;
const C0 = [BX, BY];
const camIn = (cx, cy, ks) => aim(ZI, (cx - C0[0]) * Q + W / 2, (cy - C0[1]) * Q + H / 2, ks / Q);
const innerM = (c) => { const m = cardM(c, ZI); if (!m) return null; return { k: m.k * Q, e: m.e + m.k * (W / 2 - C0[0] * Q), f: m.f + m.k * (H / 2 - C0[1] * Q) }; };
const camFromM = (M) => camIn((W / 2 - M.e) / M.k, (H / 2 - M.f) / M.k, M.k);
const DOOR = { x: 960, y: 540, r: 330 };
const FLOOR = DOOR.y + DOOR.r * 1.32;
const LOCK = { x: DOOR.x + DOOR.r * 1.36, y: DOOR.y + DOOR.r * .62 };
const FIELDX = [LOCK.x - DOOR.r * .44 * .25, LOCK.x + DOOR.r * .44 * .25];
const CARD_Q = [['“two-party authorization', 0]], CARD_Q2 = [['for model weight access”', 0]];

// ------------------------------------------------------------------------------------------------------------------ act 2a: the desk
const DESK = { y: 690, x0: 640, x1: 1420, floor: 940, lamp: [1000, 150], pool: [1010, 692, 330, 46], sheet: [1010, 455, 330, 214], clock: [1480, 330, 50], du: 590 };
const SIG1 = (() => { const p = []; for (let i = 0; i <= 60; i++) { const u = i / 60; p.push([lerp(-130, -30, u), -8 * Math.sin(u * 19) - 10 * Math.sin(u * 5) * (1 - u) + 4]); } return p; })();
const SIG2 = (() => { const p = []; for (let i = 0; i <= 60; i++) { const u = i / 60; p.push([lerp(30, 136, u), -9 * Math.sin(u * 16 + 1) - 7 * Math.sin(u * 4.2) * (1 - u) + 4]); } return p; })();
// the sheet of light (sheet → file in the tilt): centre, w, h, fold, sig1/sig2 drawn shares, alpha
function sheetDraw(ctx, t, cx, cy, w, h, fold, s1, s2, cursor) {
  const F = X.fileShape(cx, cy, w, h, fold);
  const br = 1 + .14 * Math.sin(t * 2.1) + .08 * Math.sin(t * 1.3 + 1);           // the sheet breathes (never a frozen frame)
  E.glowFill(ctx, F.path, 70, .2 * br, P.blue0); E.glowFill(ctx, F.path, 22, .45 * br, P.halo1);
  ctx.fillStyle = E.rad(ctx, cx, cy - h * .2, Math.max(w, h) * .8, [[0, rgba(P.core1, .55)], [.6, rgba(P.halo0, .32)], [1, rgba(P.halo1, .2)]]); ctx.fill(F.path);
  ctx.strokeStyle = rgba(P.core0, .95); ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.stroke(F.path);
  if (fold > 1) { ctx.fillStyle = rgba(P.halo1, .55); ctx.fill(F.fold); }
  // text rows (no words: just lines of light) and the two signature lines at the bottom
  const k = w / 330;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, h / 214);
  ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-130, -70 + i * 22); ctx.lineTo(i === 3 ? 40 : 130, -70 + i * 22); ctx.stroke(); }
  const sa = clamp(1 - fold / 20);
  if (sa > 0) {
    ctx.globalAlpha = sa; ctx.strokeStyle = rgba(P.shade0, .9); ctx.lineWidth = 2.2;
    for (const [x0, x1] of [[-136, -24], [24, 136]]) { ctx.beginPath(); ctx.moveTo(x0, 74); ctx.lineTo(x1, 74); ctx.stroke(); }
    if (s1 > 0) { ctx.translate(0, 62); K.trailSpan(ctx, SIG1, 0, s1, { w: 1.3, spark: false }); ctx.translate(0, -62); }
    if (s2 > 0) { ctx.translate(0, 62); K.trailSpan(ctx, SIG2, 0, s2, { w: 1.3, spark: s2 < 1 }); ctx.translate(0, -62); }
    if (cursor > 0) { ctx.fillStyle = rgba(P.core0, cursor); ctx.fillRect(28, 56, 2.5, 16); }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  return F;
}

// ------------------------------------------------------------------------------------------------------------------ act 2b: diagram + room
const ZONE = { x: 960, y: 540, r: 300 }, Z_IN = .92;     // Z_IN: the ring lands a little small and opens to r after the tilt
const NECK = { x0: 1252, waist: 1330, x1: 1408, w: 6 };
const RX = 1540, RY = 540 - LR.edge;                       // the launch room sits on the same card, its edge on the thread (y 540)
const PX = RX + 960;                                       // the point on the thread the camera dives to (= the room's centre edge)
const BAR = { x0: 1470, x1: 1960, y: 676 }, EYE = [1700, 404];
const zoneFile = (ctx, t, s) => sheetDraw(ctx, t, ZONE.x, ZONE.y, 170 * s, 222 * s, 32 * s, 0, 0, 0);
function zoneRing(ctx, r, a = 1, gap = 0, cx = ZONE.x, cy = ZONE.y) {
  // the circle of light (secure area), open at the right where the neck attaches (gap in radians)
  const p = new Path2D();
  p.arc(cx, cy, r, gap, Math.PI * 2 - gap);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(10px)'; ctx.strokeStyle = rgba(P.halo1, .5 * a); ctx.lineWidth = 10; ctx.stroke(p); ctx.restore();
  ctx.save(); ctx.strokeStyle = rgba(P.halo0, .95 * a); ctx.lineWidth = 3; ctx.stroke(p); ctx.restore();
}

// ================================================================================================================== the draw function
export function station1(T) {
  const a = b1Anchors(T), ha = hookAnchors(T), hk = hook(ha), hin = hookInner(ha);
  const tSw = a.researchers - .25;                    // hook ground until here (2.04), then this module's own world (identical frame)
  const M0 = hin(tSw), camH = camFromM(M0);
  // the hook's frame at tSw already contains the hook's own camera drift; take out the drift this module adds at tSw (amount .15,
  // seed 3, see drift1), so camDrift(cam0, tSw) is exactly the hook's camera
  const cam0 = { ...camH, x: camH.x - E.drift(tSw, 5 * .15, 3), y: camH.y - E.drift(tSw, 3 * .15, 5), z: camH.z - E.drift(tSw, 14 * .15, 7) };
  // 2.04: the original glows warm while the hands reach for it (from 'So who' to 'Researchers'; 0 again at tSw, so both paths agree)
  const warmF = (t) => rise(span(t, a.who, a.file + .3)) * (1 - smooth(span(t, a.file + .5, tSw - .05)));
  // ---------- act 1 camera (inner card → vault) ----------
  const tPush0 = a.researchers + .9, tPush1 = a.inside + 2.9;
  const tPB0 = a.whoGets - .3, tPB1 = a.billions + 1.4;
  const tGl0 = a.computing + .25, tGl1 = a.run + .45;
  const tVlt0 = a.firstKey, tVlt1 = a.oldest + 1.3;
  const tPan0 = a.different - .2, tPan1 = a.atAnth + 1.2;
  const tFly0 = a.yes + .55, tFly1 = a.ifYou + .5;
  const slitX = DOOR.x + DOOR.r;
  const K1 = [
    [tSw, cam0],
    [tPush0, camIn((960 - M0.e) / M0.k, (540 - M0.f) / M0.k, M0.k * 1.012)],
    [tPush1, camIn(962, 572, 1.42)],
    [tPB0, camIn(1000, 596, 1.53)],
    [tPB1, camIn(960, 452, .355)],
    [tGl0 - .1, camIn(880, 470, .372)],
    [tGl1 + .3, camIn(BX, BY, .43)],
    [tVlt0, camIn(BX, BY, .438)],
    [tVlt1, cam3({ z: 0 })],                          // (between these two keys: pullVault(t), below)
    [a.master + .4, cam3({ z: 46, x: -6 })],
    [tPan0, cam3({ z: 78, x: 4 })],
    [tPan1, cam3({ x: 386, z: 96, y: 6 })],
    [a.opening, cam3({ x: 402, z: 150, y: 8 })],
    [tFly0, cam3({ x: 424, z: 196, y: 6 })],
    [tFly1, aim(ZW, slitX + 6, DOOR.y, 16), 'i'],
  ];
  // ---------- act 2a camera (desk) ----------
  const tTilt0 = a.point + .75, tTilt1 = a.s05e + .9;     // the tilt ends exactly at the chunk seam c03|c04 (102.04)
  const K2 = [
    [tFly1, aim(F0, DESK.lamp[0], DESK.lamp[1] + 52, 16)],
    [tFly1 + 1.5, cam3({ z: 70, y: 14 }), 'o'],
    [tTilt0, cam3({ z: 190, y: 26, x: 8 })],
    [tTilt1, cam3({ z: 330, y: 1900, x: 8 }), 'q'],
  ];
  // ---------- act 2b camera (diagram → launch room → screen) ----------
  const tD0 = tTilt1;
  const tDive0 = a.advantage + .6, tDive1 = a.idea + .5, tRoom = a.late + 1.0;
  const tPB2 = a.keysSat, tPB2e = a.both + .2, tPush2 = a.safest, tPush2e = a.two + .4;
  const tScr0 = a.thieves + .55, tScr1 = a.T0 - SEAM_HALF - .12;
  const room = (x, y, z) => cam3({ x: RX + x, y: RY + y, z });
  const SC = { x: RX + LR.screen.x, y: RY + LR.screen.y };
  const K3 = [
    [tD0, cam3({ z: -24 })],
    [a.secure + .3, cam3({ x: 150, z: 46 })],
    [a.huge + .3, cam3({ x: 250, z: 80 })],
    [a.notice + .6, cam3({ x: 300, z: 128 })],
    [tDive0, cam3({ x: 310, z: 120 })],
    [tDive1, aim(F0, PX, ZONE.y, 5.2), 'q'],
    [a.late + .5, room(0, 0, 0)],
    [a.inOld + .2, room(36, 0, 34)],
    [tPB2, room(16, 6, 66)],
    [tPB2e + .2, room(0, 22, -250)],
    [tPush2, room(0, 22, -246)],
    [tPush2e, aim(F0, RX + 1040, RY + 668, 1.62)],          // ★ both key bows in frame (they sit right of their slots once turned)
    [tScr0, aim(F0, RX + 1010, RY + 652, 1.66)],
    [tScr1, aim(F0, SC.x, SC.y, W / LR.screen.w)],
  ];
  // the pull back out of the vault: one sine ease; z runs in log-distance to the inner card first, then to the wall (whose round
  // opening sweeps in from beyond the frame), so the apparent zoom speed stays even across the hand-over (split at u = .62)
  const zA = K1.find((k) => k[0] === tVlt0)[1].z, zM = ZW - 420, US = .62;   // at zM the opening just touches the frame corners
  const pullVault = (t) => {
    const u = sineIO(span(t, tVlt0, tVlt1));
    const z = u < US ? ZI - Math.exp(lerp(Math.log(ZI - zA), Math.log(ZI - zM), u / US)) : ZW - Math.exp(lerp(Math.log(ZW - zM), Math.log(ZW), (u - US) / (1 - US)));
    return cam3({ z });
  };
  const drift1 = (t) => lerp(.15, .5, smooth(span(t, tVlt0, tVlt1))) * (1 - smooth(span(t, tFly0, tFly1)));
  const drift3 = (t) => .5 * (1 - smooth(span(t, tDive0, tDive1 - .4))) + .5 * smooth(span(t, tDive1 + .2, tRoom)) * (1 - smooth(span(t, tScr0, tScr1)));
  const mD0 = cardM(camDrift(camAt(tD0, K3, F0), tD0, drift3(tD0), 11), F0), ZS = { x: mD0.e + ZONE.x * mD0.k, y: mD0.f + ZONE.y * mD0.k, k: mD0.k };   // the diagram at tD0, as the tilt must land on it

  return (ctx, t) => {
    // ================= 2.04 over the hook: the hook's own frame + the hands =================
    if (t < tSw) {
      hk(ctx, t);
      const M = hin(t); if (!M) return;
      ctx.save(); ctx.setTransform(M.k, 0, 0, M.k, M.e, M.f); warmLayer(ctx, warmF(t)); handsLayer(ctx, t, a); ctx.restore();
      return;
    }
    // ================= act 1: the weights → the vault =================
    if (t < tFly1) {
      const c = camDrift(t > tVlt0 && t < tVlt1 ? pullVault(t) : camAt(t, K1, ZI), t, drift1(t), 3);
      const M = innerM(c);
      // state from the words
      const cut = smooth(span(t, a.researchers + .3, a.researchers + 1.9));
      const lineU = smooth(span(t, a.inside + .5, a.inside + 3.2)) * (1 - smooth(span(t, tPB0 - .1, tPB0 + 2.2)));
      const back = smooth(span(t, tPB0 - .4, tPB0 + .4));
      const R = lerp(1050, 7200, sineIO(span(t, tPB0 + .4, tPB1 + .3)));
      const wave = t > a.training - .2 ? (t - (a.training - .2)) * 2400 : -1;
      const blockU = span(t, a.computing - .55, a.computing + .9), run = smooth(span(t, a.run, a.run + 1.2));
      const gl = sineIO(span(t, tGl0, tGl1)), fileDX = (BX - 960) * gl, fileDY = -Math.sin(gl * Math.PI) * 46;
      const warm = warmF(t);
      const fieldA = .2 + .26 * smooth(span(t, tPB0 + .4, tPB1)) * (1 - smooth(span(t, tVlt0, tVlt1)));
      const st = { M, R, wave, blockU, run, lineU, cut, fileDX, fileDY, back, warm, fieldA };
      // the inner card (only while it is seen: before the door is shut)
      const shut = quartIO(span(t, a.oldest + .6, a.oldest + 2.1));
      if (M && shut < 1) {
        ctx.save(); ctx.setTransform(M.k, 0, 0, M.k, M.e, M.f);
        ctx.fillStyle = E.rad(ctx, 960, 560, 1400, [[0, mixHex(P.night0, P.ind0, .25)], [.45, '#050719'], [1, '#03040f']]); ctx.fillRect(-9000, -9000, 24000, 20000);
        E.halo(ctx, 960, 560, 900, .32, P.blue0, P.ind1);
        fieldLayer(ctx, t, st);
        coresLayer(ctx, t, st);
        ringLayer(ctx, t, a, BX, BY);
        fileLayer(ctx, t, st);
        linesLayer(ctx, t, a, st);
        copyLayer(ctx, t, st);
        handsLayer(ctx, t, a);
        // the label in the field (3.01): BILLIONS (serif, big) · OF NUMBERS
        const bu = rise(span(t, a.billions - .15, a.billions + .85)), bo = rise(span(t, a.billions + .35, a.billions + 1.2));
        const bOut = 1 - expoIn(span(t, a.whoever + .2, a.whoever + .9));
        if (bu > 0 && bOut > 0) { K.maskLine(ctx, [['billions', 0]], 960, -150, 300, bu * bOut); K.maskLine(ctx, [['OF NUMBERS', 0]], 960, -40, 64, bo * bOut, { serif: false, align: 'center', col: P.halo2, glow: false }); }
        ctx.restore();
      }
      // the vault (wall + door at ZW, figures and the card at ZP)
      const joints = smooth(span(t, a.oldest + 1.9, a.touch + .9));
      const f1 = .5 * expoOut(span(t, a.atAnth + .55, a.atAnth + 1.1)) * (1 - .55 * Math.exp(-(((t - (a.never + .25)) / .12) ** 2)) - .55 * Math.exp(-(((t - (a.never + .62)) / .12) ** 2)));
      const both = expoOut(span(t, a.twoPeople + .1, a.twoPeople + .6));
      const crack = expoOut(span(t, a.yes - .02, a.yes + .5));
      card(ctx, c, ZW, () => {
        vaultWall(ctx, DOOR, { floor: FLOOR });
        // the open door lets the interior glow out onto the floor; it dies when the door is shut
        if (shut < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, DOOR.x, FLOOR, 520, [[0, rgba(P.halo1, .18 * (1 - shut))], [1, rgba(P.halo1, 0)]]); ctx.fillRect(DOOR.x - 600, FLOOR - 20, 1200, 120); ctx.restore(); }
        vaultDoor(ctx, t, { ...DOOR, shut, joints, fields: [f1 + .5 * both, both], crack, lock: LOCK });
      });
      card(ctx, c, ZP, () => {
        // figure 1: stands before the door, pocket glimmers; walks to the lock; hand on field 1
        const walk1 = span(t, tPan0 - .05, tPan1 - .55), x1 = lerp(780, FIELDX[0] - 96, sineIO(walk1));
        const reach1 = sineIO(span(t, a.atAnth + .05, a.atAnth + .75));
        const o1 = { long: true, light: 1, dir: 1, look: .1 };
        if (walk1 > 0 && walk1 < 1) Object.assign(o1, { walk: walk1 * 8.5, view: 'side' });
        else if (reach1 > 0) { const sh = [.098, -.74], tg = [(FIELDX[0] - x1) / 300, (LOCK.y + 6 - FLOOR) / 300]; const dx = tg[0] - sh[0], dy = tg[1] - sh[1]; const ang = Math.atan2(dx, dy); o1.armR = [lerp(.18, ang - .25, reach1), lerp(.08, ang + .15, reach1)]; }
        E.castShadow(ctx, x1, FLOOR + 2, 26, 160, 2.8, .4);
        E.person(ctx, x1, FLOOR, 300, o1);
        // the pocket: a warm glimmer at the coat pocket (the picture of "one master key", no key drawn)
        const pk = Math.exp(-(((t - (a.pocket + .45)) / .7) ** 2)) * (walk1 <= 0 ? 1 : 0);
        if (pk > .01) E.halo(ctx, x1 + 300 * .105, FLOOR - 300 * .43, 60 * pk + 8, .9 * pk, P.halo1, P.core0);
        // figure 2: from the right, hand on field 2
        const walk2 = span(t, a.opening - .2, a.twoPeople - .35);
        if (walk2 > 0) {
          const x2 = lerp(DOOR.x + 1500, FIELDX[1] + 96, sineIO(walk2)), reach2 = sineIO(span(t, a.twoPeople - .4, a.twoPeople + .25));
          const o2 = { long: true, light: -1, dir: -1, look: .1 };
          if (walk2 < 1) Object.assign(o2, { walk: walk2 * 8.5, view: 'side' });
          else { const sh = [.098, -.74], tg = [(x2 - FIELDX[1]) / 300, (LOCK.y + 6 - FLOOR) / 300]; const ang = Math.atan2(tg[0] - sh[0], tg[1] - sh[1]); o2.armR = [lerp(.18, ang - .25, reach2), lerp(.08, ang + .15, reach2)]; }
          E.castShadow(ctx, x2, FLOOR + 2, 26, 160, .4, .4);
          E.person(ctx, x2, FLOOR, 300, o2);
        }
        // the card: a cream rule grows, the quote rises line by line, then the source (3.05)
        const cu0 = smooth(span(t, a.may - .5, a.may + .6)), l1 = rise(span(t, a.may - .1, a.may + .9)), l2 = rise(span(t, a.may + .35, a.may + 1.35)), sr = rise(span(t, a.may + 1.1, a.may + 2.1));
        if (cu0 > 0) {
          const CX = 1620, CY = 238;
          ctx.save(); ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(CX - 34, CY - 66); ctx.lineTo(CX - 34, CY - 66 + 250 * cu0); ctx.stroke(); ctx.restore();
          K.maskLine(ctx, CARD_Q, CX, CY, 66, l1); K.maskLine(ctx, CARD_Q2, CX, CY + 80, 66, l2);
          K.maskLine(ctx, [['ANTHROPIC · MAY 2025', 0]], CX + 2, CY + 150, 24, sr, { serif: false, col: rgba(P.halo2, .9), glow: false });
        }
      });
      // into the slit: the light floods the frame (the standard flight into a light form)
      E.lightFlood(ctx, sineIO(span(t, tFly1 - .55, tFly1)) ** 2);
      return;
    }
    // ================= act 2a: the desk under the lamp =================
    if (t < tTilt1) {
      const c = camDrift(camAt(t, K2, F0), t, .35 * smooth(span(t, tFly1 + .8, tFly1 + 2)) * (1 - smooth(span(t, tTilt0, tTilt1))), 7);
      const tau = span(t, tTilt0, tTilt1), ts = sineIO(tau);
      // wall (far) and the clock on it
      card(ctx, c, 3000, () => {
        ctx.fillStyle = E.lin(ctx, 0, -900, 0, DESK.floor, [[0, P.night0], [.7, mixHex(P.night1, P.ind1, .35)], [1, P.night1]]); ctx.fillRect(-3000, -3000, 8000, 3000 + DESK.floor);
        ctx.fillStyle = E.lin(ctx, 0, DESK.floor, 0, DESK.floor + 500, [[0, P.night1], [1, P.night0]]); ctx.fillRect(-3000, DESK.floor, 8000, 6000);
        ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(-3000, DESK.floor); ctx.lineTo(5000, DESK.floor); ctx.stroke();
        const [cx, cy, cr] = DESK.clock;
        ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 6.29); ctx.fill();
        ctx.strokeStyle = rgba(mixHex(P.cream, P.blue0, .3), .85); ctx.lineWidth = 2.4; ctx.stroke();
        for (let i = 0; i < 12; i++) { const q = i / 12 * 6.283; ctx.beginPath(); ctx.moveTo(cx + Math.cos(q) * cr * .78, cy + Math.sin(q) * cr * .78); ctx.lineTo(cx + Math.cos(q) * cr * .9, cy + Math.sin(q) * cr * .9); ctx.stroke(); }
        // the hand: a slow tick, then on 'slower' it sweeps round once, slowly (time drags)
        const sweep = sineIO(span(t, a.slower - .1, a.point - .1));
        const q = -Math.PI / 2 + (t - tFly1) * .1 + sweep * Math.PI * 2;
        ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(q) * cr * .72, cy + Math.sin(q) * cr * .72); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(-2.2) * cr * .45, cy + Math.sin(-2.2) * cr * .45); ctx.stroke();
      });
      card(ctx, c, F0, () => {
        // the lamp: cord, shade, the bulb; the cone of light down to the desk (the slit of the vault, become a lamp)
        const [lx, ly] = DESK.lamp;
        ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, -900); ctx.lineTo(lx, ly - 40); ctx.stroke();
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = E.lin(ctx, 0, ly + 40, 0, DESK.y, [[0, rgba(P.halo0, .34)], [1, rgba(P.halo1, .1)]]);
        ctx.beginPath(); ctx.moveTo(lx - 46, ly + 36); ctx.lineTo(lx + 46, ly + 36); ctx.lineTo(DESK.pool[0] + DESK.pool[2], DESK.y); ctx.lineTo(DESK.pool[0] - DESK.pool[2], DESK.y); ctx.closePath(); ctx.filter = 'blur(10px)'; ctx.fill(); ctx.restore();
        ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.moveTo(lx - 30, ly - 40); ctx.lineTo(lx + 30, ly - 40); ctx.lineTo(lx + 60, ly + 36); ctx.lineTo(lx - 60, ly + 36); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 2; ctx.stroke();
        E.halo(ctx, lx, ly + 40, 160, .9, P.halo1, P.core0);
        // the desk: a dark slab with a lit top edge, two legs
        ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(DESK.x0, DESK.y, DESK.x1 - DESK.x0, 30);
        ctx.fillRect(DESK.x0 + 40, DESK.y + 30, 22, DESK.floor - DESK.y - 30); ctx.fillRect(DESK.x1 - 62, DESK.y + 30, 22, DESK.floor - DESK.y - 30);
        ctx.strokeStyle = E.lin(ctx, DESK.x0, 0, DESK.x1, 0, [[0, rgba(P.blue0, .8)], [.5, rgba(P.halo1, .8)], [1, rgba(P.blue0, .8)]]); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(DESK.x0, DESK.y); ctx.lineTo(DESK.x1, DESK.y); ctx.stroke();
        // you: at the desk, looking at the sheet, waiting (a breath, a small shift of weight on 'slower')
        const shift = Math.sin(span(t, a.slower, a.slower + 1.6) * Math.PI) * .04;
        E.castShadow(ctx, DESK.du, DESK.floor + 2, 30, 200, 2.9, .45);
        E.du(ctx, DESK.du, DESK.floor, 320, { dir: 1, look: .32, lean: .04 + shift + .01 * Math.sin(t * .8), light: 1, armR: [.5, .9], armL: [-.15, -.05] });
      });
      // the pool on the desk and the sheet: projected from the desk camera, carried to the centre by the tilt (screen space)
      const mF = cardM(c, F0);
      if (mF) {
        const P0 = [mF.e + DESK.pool[0] * mF.k, mF.f + DESK.pool[1] * mF.k, DESK.pool[2] * mF.k, DESK.pool[3] * mF.k];
        const px = lerp(P0[0], ZS.x, ts), py = lerp(P0[1], ZS.y, ts), prx = lerp(P0[2], ZONE.r * Z_IN * ZS.k, ts), pry = lerp(P0[3], ZONE.r * Z_IN * ZS.k, ts);
        const inner = smooth(span(tau, .25, 1));
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - inner;
        ctx.fillStyle = E.rad(ctx, px, py, Math.max(prx, 1), [[0, rgba(P.halo0, .55)], [.7, rgba(P.halo1, .3)], [1, rgba(P.halo1, 0)]]); ctx.save(); ctx.translate(px, py); ctx.scale(1, pry / Math.max(prx, 1)); ctx.translate(-px, -py); ctx.beginPath(); ctx.arc(px, py, prx, 0, 6.29); ctx.fill(); ctx.restore();
        ctx.restore();
        if (inner > 0) { ctx.save(); ctx.translate(px, py); ctx.scale(1, pry / prx); ctx.translate(-px, -py); zoneRing(ctx, prx, inner, 0, px, py); ctx.restore(); }
        // the sheet → the file
        const S0 = [mF.e + DESK.sheet[0] * mF.k, mF.f + DESK.sheet[1] * mF.k, DESK.sheet[2] * mF.k, DESK.sheet[3] * mF.k];
        const mu = smooth(span(tau, .2, .9));
        const s1 = 1 - smooth(span(tau, 0, .3)), s2 = smooth(span(t, a.point - .05, a.point + .7)) * s1;
        const cur = (Math.sin(t * 5) > 0 ? .9 : .25) * (1 - smooth(span(t, a.point - .2, a.point))) * s1;
        sheetDraw(ctx, t, lerp(S0[0], ZS.x, ts), lerp(S0[1], ZS.y, ts), lerp(S0[2], 170 * ZS.k, mu), lerp(S0[3], 222 * ZS.k, mu), 32 * ZS.k * mu, s1, s2, cur);
        ctx.restore();
      }
      E.lightFlood(ctx, 1 - sineIO(span(t, tFly1, tFly1 + .7)));
      return;
    }
    // ================= act 2b: the diagram, the launch room, the screen =================
    const c = camDrift(camAt(t, K3, F0), t, drift3(t), 11);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
    const showDiagram = t < tDive1, showRoom = t >= tDive1 - .05;
    const grow = expoOut(span(t, a.sheer - .1, a.sheer + 1.1)) * .45;
    const thin = smooth(span(t, a.sheer, a.sheer + 1.5));
    card(ctx, c, F0, () => {
      const eW = mixHex(P.halo0, mixHex(P.blue0, P.cream, .35), smooth(span(t, tDive1 + .3, tRoom)));
      // the thread (= the console edge from 4.04 on): one line from the neck far to the right
      const tw = lerp(2.4, 1.3, thin) * lerp(1, 1.4, smooth(span(t, tDive1, tRoom)));
      const thU = showRoom ? 1 : sineIO(span(t, a.throttle - .3, a.throttle + 2.6));
      const thread = (cx) => {
        if (thU <= 0) return;
        const x0 = showRoom ? RX - 2400 : NECK.x1, x1 = lerp(NECK.x1, RX + 2400, thU);
        cx.save(); cx.globalCompositeOperation = 'lighter'; cx.filter = 'blur(6px)'; cx.strokeStyle = rgba(eW, .45); cx.lineWidth = tw * 4; cx.beginPath(); cx.moveTo(x0, ZONE.y); cx.lineTo(x1, ZONE.y); cx.stroke(); cx.restore();
        cx.strokeStyle = eW; cx.lineWidth = tw; cx.beginPath(); cx.moveTo(x0, ZONE.y); cx.lineTo(x1, ZONE.y); cx.stroke();
      };
      if (showRoom) {
        // the room grows out of the line: the wall rises from it, then the consoles (launchRoom build)
        const b = span(t, tDive1 - .2, tRoom + .6), wall = sineIO(span(b, 0, .6));
        ctx.save(); ctx.beginPath(); ctx.rect(RX - 2400, lerp(ZONE.y, ZONE.y - 2200, wall), 7000, 2200 * wall + 2); ctx.clip();
        ctx.fillStyle = E.lin(ctx, 0, RY - 600, 0, ZONE.y, [[0, P.night0], [.6, mixHex(P.night1, P.ind1, .3)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(RX - 2400, RY - 1700, 7000, 1700 - RY + ZONE.y); ctx.restore();
        ctx.save(); ctx.translate(RX, RY);
        const keysU = expoOut(span(t, a.keys - .2, a.keys + .35));
        const turn = expoOut(span(t, a.same - .02, a.same + .09));
        const hands = sineIO(span(t, a.keys + .05, a.same - .1));
        const reach = sineIO(span(t, a.both - .45, a.both + .5)) * (1 - sineIO(span(t, a.safest + .1, a.safest + 1.1)));
        const lum = 1 - .78 * sineIO(span(t, a.but + .1, a.thieves + .3));
        const shine = 1 + .25 * Math.exp(-(((t - (a.two + .15)) / .35) ** 2));
        launchRoom(ctx, t, {
          build: b, bg: false, edgeLine: (cx) => { cx.save(); cx.translate(-RX, -RY); thread(cx); cx.restore(); }, lamp: smooth(span(t, a.old - .2, a.old + .5)) * (t > a.old - .26 && t < a.old - .18 ? .3 : 1),
          officers: sineIO(span(t, a.inOld + .1, a.officers + .55)), keys: keysU, turn, hands, lum: lum * shine,
          pulse: span(t, a.same + .05, a.same + 1.0), measure: span(t, a.far - .25, a.far + .9) * (1 - smooth(span(t, a.safest + .2, a.safest + 1.0))),
          reach, screen: span(t, a.thieves + .25, a.thieves + 1.05), stamp: rise(span(t, a.late - .1, a.late + .8)),
        });
        ctx.restore();
      }
      if (!showRoom) thread(ctx);
      if (!showDiagram) return;
      // ---- the diagram ----
      const zr = ZONE.r * (1 + grow * .12) * (1 + .006 * Math.sin((t - tD0) * 1.4)) * lerp(Z_IN, 1, rise(span(t, tD0, tD0 + 2.6)));   // the ring settles open
      const neck = sineIO(span(t, a.every - .2, a.every + 1.4));
      zoneRing(ctx, zr, 1, .14 * neck);
      if (neck > 0) {
        for (const sg of [-1, 1]) {
          const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24, x = lerp(ZONE.x + zr * Math.cos(.14), NECK.x1, u), w = lerp(zr * Math.sin(.14), 40, u) * (1 - .9 * Math.sin(u * Math.PI)) + NECK.w * Math.sin(u * Math.PI); pts.push([x, ZONE.y + sg * w]); }
          K.trailSpan(ctx, pts, 0, neck, { w: 2.4, spark: neck < 1 });
        }
      }
      zoneFile(ctx, t, 1 + grow);
      // labels (rise from their baselines)
      K.maskLine(ctx, [['SECURE AREA', 0]], ZONE.x, ZONE.y - zr + 70, 26, rise(span(t, a.secure - .1, a.secure + .8)), { serif: false, align: 'center', col: P.halo2, glow: false });
      K.maskLine(ctx, [['THROTTLE', 0]], NECK.waist, ZONE.y - 62, 26, rise(span(t, a.throttle - .05, a.throttle + .8)), { serif: false, align: 'center', col: P.halo2, glow: false });
      K.maskLine(ctx, [['SIZE BECOMES SECURITY', 0]], ZONE.x, ZONE.y + zr + 96, 30, rise(span(t, a.becomes - .1, a.becomes + .9)), { serif: false, align: 'center', col: P.halo2, glow: false });
      // single dots leave through the neck on the thread (spawned from the file; slow in the waist)
      const t0d = a.throttle - .2;
      if (t > t0d) {
        for (let n = 0; n < 40; n++) {
          const born = t0d + n * .62, age = t - born; if (age < 0) break;
          const xs = ZONE.x + 90 * (1 + grow), d = age * 230, x = xs + d - Math.max(0, Math.min(d + xs - NECK.x0, NECK.x1 - NECK.x0)) * .55;
          if (x > BAR.x1 + 300) continue;
          const al = clamp(age * 3) * (1 - smooth(span(x, BAR.x1, BAR.x1 + 300)));
          E.halo(ctx, x, ZONE.y, 22, .8 * al, P.halo1, P.core0);
        }
      }
      // the bar outside: it barely creeps (a long time)
      const barU = sineIO(span(t, a.huge - .3, a.huge + 1.4));
      if (barU > 0) {
        ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 1.8; ctx.strokeRect(BAR.x0, BAR.y - 9, (BAR.x1 - BAR.x0) * barU, 18);
        const fill = (.015 + .05 * span(t, a.huge, a.advantage + 1)) * (BAR.x1 - BAR.x0);
        ctx.fillStyle = rgba(P.halo0, .9 * clamp(barU * 3 - 2)); ctx.fillRect(BAR.x0 + 3, BAR.y - 6, fill, 12);
      }
      // the eye: a cool almond of light opens over the thread and looks at it (someone would notice)
      const eu = expoOut(span(t, a.notice - .15, a.notice + .6));
      if (eu > 0) {
        const [ex, ey] = EYE, ew = 96, eh = 38 * eu, col = mixHex(P.cream, P.blue0, .3);
        ctx.save(); ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(ex - ew, ey); ctx.quadraticCurveTo(ex, ey - eh * 2, ex + ew, ey); ctx.quadraticCurveTo(ex, ey + eh * 2, ex - ew, ey); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex - ew, ey); ctx.quadraticCurveTo(ex, ey - eh * 2, ex + ew, ey); ctx.quadraticCurveTo(ex, ey + eh * 2, ex - ew, ey); ctx.clip();
        const look = sineIO(span(t, a.notice + .3, a.notice + 1.2));
        ctx.fillStyle = rgba(col, .85); ctx.beginPath(); ctx.arc(ex - 18 * look, ey + 14 * look, 26, 0, 6.29); ctx.fill();
        ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(ex - 20 * look, ey + 16 * look, 10, 0, 6.29); ctx.fill();
        ctx.restore();
        E.halo(ctx, ex, ey, 160, .12 * eu, P.blue0, col);
      }
    });
    // ---- the seam to B2: the plate (the file on the console screen, frame filling) ----
    if (t >= a.T0 - SEAM_HALF) plateScreen(ctx, t);
  };
}
