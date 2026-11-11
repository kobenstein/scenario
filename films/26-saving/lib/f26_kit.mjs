// Film 26 · "Why Elon Says Saving Money Is Pointless" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person/robot, halo, glowText, the 2.5D card stage cam3/card/aim/camAt/camDrift,
// lightFlood, finish) + lib/f16_kit.mjs (rise, maskLine, measure, rule, quote). World: docs/MOTION.md §2. Shots: docs/shots.md.
//
//   THE HILL (guiding image = thumbnail A, ANCHORS ONLY: hook, the question, line 5, the ending): a giant indigo PIGGY BANK on a hill above
//   the river, cracked open on top; coins rise out of the crack and turn into gold dust; you (yellow coat) small at its feet; across the river
//   the city, and an unfinished bridge (piers with lamps, no deck in the middle) that the gold dust completes at the very end.
//   THE STREET (your street, Jakob 8.11.: more street and city): houses at night, your window (small whole piggy, wall calendar, lamp), the
//   shop window, the ON AIR window, the mailbox at the curb, street lamps; later the avenue into the future (line 4) and the old street (1889).
//   THE SKY FIELD: explainers live in the night sky above the roofs, made of film things: coins, coin stacks, price tags on strings, gold-dust
//   lines, paper (checks, bills, law pages), serif numbers, quote cards. The sky is shared by both places: SKY DOORS (rise into the stars,
//   come down over the other place) change places without a cut (skyOff, see lib/f26_seams.mjs).
//   THE TEST CARD (the carrier of the whole film): five lines (4 = FORECAST, 1 = ADVICE), born in the hook, written in c02, then in the top
//   right corner to the end; each station lifts its line out as the headline and puts a mark in its box: ✓ (gold) ½ (gold) ✗ ✗ ✗ (rose).
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: GOLD, COIN, ROSE (✗ only), COOL (the machine), NIGHT · PRINT26 (finish) · bump(t, t0, d)
//   world:   sky(ctx, c, t, o) · city(ctx, c, t, o) · hill(ctx, c, t, o) · HOR, Z_SKY, Z_CITY, Z_RIVER, Z_SHORE, BRIDGE
//   piggy(ctx, t, x, y, h, o) the piggy bank (feet at x,y, height h, facing left; o { dir, crack 0..1, open 0..1, fill, a, lit, shard })
//        → { slot: [x,y], crack: [x,y], top: y }          coin(ctx, x, y, r, o { flip (rad), a, glint })
//   fountain(ctx, t, x, y, s, o) coins rising out of a crack and turning to gold dust (deterministic in t); o { rate, seed, a, dust, life }
//   goldDust(ctx, t, pts, o) a drifting stream of gold specks along a path [[x,y]…] (o { n, seed, spread, speed, a, size })
//   older(ctx, x, y, h, o) the older you (same coat, hood down, white hair, a slight stoop) · du / person re-exported
//   house(ctx, t, o) a facade with windows · win(ctx, t, x, y, w, h, o) one window (lit / dark / open) · streetLamp(ctx, t, x, y, h, o)
//   street(ctx, t, o) sidewalk + road · mailbox(ctx, t, x, y, h, o { open, check, old, flag }) · calendar(ctx, t, x, y, w, page, o)
//   goods(ctx, kind, x, y, s, o) (bread, shoe, books, lamp, cup, tv, flat) · priceTag(ctx, t, x, y, s, text, o { ang, torn, col })
//   balance(ctx, t, x, y, w, tilt, o { u, left(ctx, x, y), right(…), labels }) a balance beam of light
//   coinStack(ctx, t, x, y, n, r, o) · check(ctx, t, x, y, w, o) a paper check · qcard(ctx, t, x, y, w, h, q, u, o) a small quote card
//   rover(ctx, t, x, y, s, o) a flat warehouse robot carrying a shelf (machine, never a face) · onAir(ctx, t, x, y, s, a)
//   TEST, testCard(ctx, t, T, o) the test card (state from the phrase anchors) · testTimes(T) · mark(ctx, kind, x, y, s, u)
//   QUOTES (wording per text-v2; fact check wins: `check: true` = still open) · SOURCES · source(ctx, t, t0, t1, s)
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from, morph }) · cardMode(id) (F26_C3=card etc.)
//   title(ctx, t, x, y, u, o) · questionLine(ctx, t, t0, t1, o) · label · bracket · camPath(t, K) · rise, maskLine, measure
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, PathOp, loadImage, GlobalFonts, createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, maskLine, measure } = K16;
export const { du, person, robot, cam3, card, camAt, camDrift, aim, project, cardM, F0, glowText, withOuter, lightFlood } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };

export const PRINT26 = { grain: 14, floor: 4, vig: .5 };
// the thumbnail's heavy title face (Inter Display Black, condensed by scaling); falls back to Inter 600 if the system font is missing
let TITLE_FAMILY = 'Inter';
try { if (fs.existsSync('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf')) { GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf', 'Title26'); TITLE_FAMILY = 'Title26'; } } catch { /* optional */ }
const TMEAS = createCanvas(8, 8).getContext('2d');
// colour code (docs/MOTION.md §5): GOLD = money, what stays, the hero light, ✓ · ROSE = ✗ only (sparingly) · COOL = the machine · NIGHT = world
export const GOLD = { core: P.core0, hot: P.core1, body: P.halo0, deep: P.shade0, line: mixHex(P.halo0, P.coat, .25), text: P.halo2 };
export const COIN = { face: mixHex(P.coat, P.core1, .35), lit: mixHex(P.core1, P.core0, .4), mid: mixHex(P.coat, P.halo0, .35), rim: mixHex(P.coat, P.shade0, .55), edge: mixHex(P.shade0, P.night1, .35) };
export const ROSE = { mark: mixHex('#e8a3a0', P.cream, .12), deep: mixHex('#e8a3a0', P.night1, .55) };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const NIGHT = { wall: mixHex(P.ind1, P.night1, .45), wallLit: mixHex(P.ind1, P.blue1, .35), roof: mixHex(P.night1, P.ind0, .3), glass: mixHex(P.night0, P.ind1, .4),
  ground: mixHex(P.night1, P.ind0, .35), pig: mixHex(P.ind1, P.blue1, .25), pigLit: mixHex(P.blue0, P.blue1, .45), pigDark: mixHex(P.night1, P.night0, .4) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const TAU = Math.PI * 2;
const pathOf = (pts, close = true) => { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); if (close) p.closePath(); return p; };
// a lit rim on one side of a shape (path minus its offset copy), as in f10 figure()
function rimFill(ctx, path, col, dx, dy) { const sh = new Path2D(); sh.addPath(path, { a: 1, b: 0, c: 0, d: 1, e: dx, f: dy }); ctx.fillStyle = col; ctx.fill(new Path2D(path).op(sh, PathOp.Difference)); }

// ======================================================================================================================== WORLD
export const Z_SKY = 40000, Z_CITY = 9000, Z_RIVER = 6000, Z_SHORE = 4200, HOR = 905;
// the night sky (screen) + stars on a far card + a soft blue glow. o { glow: [x, y, r] (design, F0), stars 0..1, hor (design y of the horizon) }
export function sky(ctx, c, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hy = (E.project(c, Z_CITY, 0, o.hor ?? HOR) || [0, H * .8])[1];
  ctx.fillStyle = lin(ctx, 0, hy - 1150, 0, hy, [[0, P.night0], [.5, P.night1], [.82, mixHex(P.ind1, P.blue0, .3)], [1, mixHex(P.ind1, P.blue0, .62)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => E.stars(ctx, 26, 1100, t, [-7000, -7600, 18000, 8600], o.stars ?? 1));
  if (o.glow) E.card(ctx, c, F0 * 2.2, () => halo(ctx, o.glow[0], o.glow[1], o.glow[2], .3, P.blue0, mixHex(P.blue0, P.halo2, .3)));
}
// a seeded row of building silhouettes: [x, w, h, roof, windows[[u, v, lit]]]
const CITIES = new Map();
function blocks(seed, x0, x1, hmin, hmax) {
  const k = `${seed}:${x0}:${x1}:${hmin}:${hmax}`; if (CITIES.has(k)) return CITIES.get(k);
  const r = prng(seed), out = []; let x = x0;
  while (x < x1) {
    const w = 40 + r() * 120, h = hmin + (hmax - hmin) * Math.pow(r(), 1.6), roof = r() < .18 ? 'spire' : r() < .3 ? 'step' : 'flat', ws = [];
    const cols = Math.max(1, Math.floor(w / 22)), rows = Math.max(1, Math.floor(h / 26));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) if (r() < .16) ws.push([(i + .5) / cols, (j + .6) / (rows + .4), .55 + r() * .45, r() * 6.3]);
    out.push([x, w, h, roof, ws]); x += w + (r() < .3 ? r() * 30 : -6);
  }
  CITIES.set(k, out); return out;
}
function drawBlocks(ctx, t, bl, base, col, colTop, winA) {
  for (const [x, w, h, roof, ws] of bl) {
    const p = new Path2D(); p.moveTo(x, base); p.lineTo(x, base - h);
    if (roof === 'spire') { p.lineTo(x + w * .4, base - h); p.lineTo(x + w * .5, base - h - 46); p.lineTo(x + w * .6, base - h); }
    else if (roof === 'step') { p.lineTo(x + w * .3, base - h); p.lineTo(x + w * .3, base - h - 18); p.lineTo(x + w * .75, base - h - 18); p.lineTo(x + w * .75, base - h); }
    p.lineTo(x + w, base - h); p.lineTo(x + w, base); p.closePath();
    ctx.fillStyle = lin(ctx, 0, base - h - 40, 0, base, [[0, colTop], [1, col]]); ctx.fill(p);
    if (winA > 0) for (const [u, v, l, ph] of ws) {
      ctx.fillStyle = rgba(mixHex(P.halo1, P.core1, .3), winA * l * (.86 + .14 * Math.sin(t * .7 + ph)));
      ctx.fillRect(x + u * w - 3, base - h + v * h - 4, 6, 8);
    }
  }
}
// the bridge across the river (far shore x 160 … 1180 on the river card): piers with lamps; o.deck 0..1 = how much of the middle is built
export const BRIDGE = { x0: 120, x1: 1240, y: 902, piers: [120, 300, 480, 880, 1060, 1240], gap: [480, 880] };
// the city across the river + the river + the near shore. o { winA, shore (near shore on/off), deck 0..1 (bridge middle), river 0..1 shimmer,
//   onAir: [x, y] (a lit window with ON AIR on the near shore, design px of the Z_SHORE card), bridge (false = no bridge) }
export function city(ctx, c, t, o = {}) {
  const winA = o.winA ?? 1;
  E.card(ctx, c, Z_CITY * 1.25, () => drawBlocks(ctx, t, blocks(61, -2600, 4600, 40, 170), HOR - 6, mixHex(P.ind1, P.blue1, .3), mixHex(P.ind1, P.blue0, .45), .55 * winA));
  E.card(ctx, c, Z_CITY, () => drawBlocks(ctx, t, blocks(62, -2400, 4400, 30, 250), HOR, mixHex(P.night1, P.ind1, .6), mixHex(P.ind1, P.blue1, .35), .9 * winA));
  E.card(ctx, c, Z_RIVER, () => {
    const y0 = HOR - 2, y1 = 1000;
    ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.ind1, P.blue0, .4)], [.5, mixHex(P.night1, P.ind1, .5)], [1, P.night1]]); ctx.fillRect(-3000, y0, 9000, y1 - y0 + 300);
    const r = prng(71);   // reflections: short horizontal light streaks that shimmer
    for (let i = 0; i < 90; i++) {
      const x = -1500 + r() * 5000, y = y0 + 8 + r() * 70, w = 10 + r() * 40, ph = r() * 6.3, warm = r() < .55;
      ctx.fillStyle = rgba(warm ? P.halo1 : P.blue0, (.18 + .2 * Math.sin(t * 1.3 + ph)) * (o.river ?? 1)); ctx.fillRect(x + Math.sin(t * .6 + ph) * 6, y, w, 2);
    }
    if (o.bridge !== false) bridge(ctx, t, o.deck ?? 0);
  });
  if (o.shore !== false) E.card(ctx, c, Z_SHORE, () => {
    drawBlocks(ctx, t, blocks(63, -1800, 2200, 30, 150), 1010, mixHex(P.night0, P.night1, .5), mixHex(P.night1, P.ind1, .4), .8 * winA);
    if (o.onAir) onAir(ctx, t, o.onAir[0], o.onAir[1], 1, 1);
  });
}
function bridge(ctx, t, deck) {
  const B = BRIDGE, y = B.y, col = mixHex(P.night1, P.ind1, .4);
  ctx.save();
  for (const x of B.piers) { ctx.fillStyle = col; ctx.fillRect(x - 7, y - 4, 14, 60); }
  ctx.fillStyle = col; ctx.fillRect(B.x0 - 30, y - 6, B.gap[0] - B.x0 + 37, 7); ctx.fillRect(B.gap[1] - 7, y - 6, B.x1 - B.gap[1] + 37, 7);
  if (deck > 0) {   // the gold deck grows from both ends toward the middle
    const m = (B.gap[0] + B.gap[1]) / 2, hw = (m - B.gap[0]) * clamp(deck);
    ctx.fillStyle = mixHex(P.halo0, P.shade0, .2); ctx.fillRect(B.gap[0], y - 6, hw, 6); ctx.fillRect(B.gap[1] - hw, y - 6, hw, 6);
    halo(ctx, B.gap[0] + hw, y - 3, 40, .5 * (deck < 1 ? 1 : 0)); halo(ctx, B.gap[1] - hw, y - 3, 40, .5 * (deck < 1 ? 1 : 0));
  }
  for (let x = B.x0; x <= B.x1; x += 40) {
    if (x > B.gap[0] + 6 && x < B.gap[1] - 6 && deck < 1) continue;
    ctx.fillStyle = rgba(P.core1, .9); ctx.beginPath(); ctx.arc(x, y - 12, 2.2, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(P.halo1, .35 + .1 * Math.sin(t * 2 + x)); ctx.fillRect(x - 1, y + 10, 2, 22);   // the lamp's reflection
  }
  ctx.restore();
}
// the hill: the ground you and the piggy stand on (F0 card, top edge at y0 = 962), a warm pool under the light. o { pool: [x, rx, a] }
export const HILL_Y = 962;
export function hill(ctx, c, t, o = {}) {
  E.card(ctx, c, F0, () => {
    const y0 = HILL_Y;
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + 260, [[0, mixHex(NIGHT.ground, P.blue1, .25)], [.18, NIGHT.ground], [1, P.night0]]); ctx.fillRect(-4000, y0, 10000, 1400);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-4000, y0); ctx.lineTo(6000, y0); ctx.stroke();
    if (o.pool) { const [x, rx, a] = o.pool; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y0 + 4, rx, [[0, rgba(P.halo1, .5 * a)], [.5, rgba(P.shade0, .2 * a)], [1, rgba(P.shade0, 0)]]); ctx.scale(1, 1); ctx.beginPath(); ctx.ellipse(x, y0 + 6, rx, rx * .11, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  });
}

// ======================================================================================================================== THE PIGGY BANK
// local units: feet at (0, 0), height 1, facing LEFT (snout at -x). Built once (paths cached).
let PIG = null;
function pigPaths() {
  if (PIG) return PIG;
  const U = (a, b) => a.op(b, PathOp.Union);
  let body = new Path2D(); body.ellipse(0, -.53, .63, .41, 0, 0, TAU);
  const neck = new Path2D(); neck.ellipse(-.5, -.56, .2, .2, 0, 0, TAU); body = U(body, neck);
  const snout = new Path2D(); snout.roundRect(-.75, -.68, .26, .25, .06); body = U(body, snout);
  const legN = [[-.43, -.27], [.2, -.27]], legF = [[-.29, -.26], [.35, -.26]];
  for (const [x, y] of legN) { const l = new Path2D(); l.roundRect(x, y, .15, y * -1 + .002, [.02, .02, .05, .05]); body = U(body, l); }
  const ear = pathOf([[-.47, -.82], [-.45, -.95], [-.42, -1.02], [-.37, -.97], [-.28, -.88], [-.33, -.84]]);
  body = U(body, ear);
  const far = new Path2D();
  for (const [x, y] of legF) far.roundRect(x, y, .14, -y - .012, [.02, .02, .05, .05]);
  const earF = pathOf([[-.33, -.86], [-.27, -1.0], [-.16, -.9], [-.2, -.85]]); far.addPath(earF);
  const face = new Path2D(); face.ellipse(-.75, -.555, .055, .118, 0, 0, TAU);
  const nost = new Path2D(); nost.ellipse(-.76, -.6, .014, .032, 0, 0, TAU); nost.ellipse(-.76, -.51, .014, .032, 0, 0, TAU);
  // the crack: a jagged line over the top-right of the back; above it the shell is gone (the opening)
  const crackLine = [[-.16, -.935], [-.1, -.86], [-.02, -.9], [.05, -.82], [.13, -.87], [.2, -.78], [.29, -.82], [.36, -.73], [.44, -.77], [.53, -.69], [.6, -.66]];
  const open = pathOf([...crackLine, [.7, -.7], [.7, -1.1], [-.2, -1.1], [-.2, -.95]]);
  const hole = new Path2D(body).op(open, PathOp.Intersect);
  const shell = new Path2D(body).op(open, PathOp.Difference);
  const shard = pathOf([[-.15, -.905], [-.19, -.99], [-.1, -1.08], [-.07, -.99], [-.03, -1.0], [-.06, -.9]]);   // a piece of shell sticking up at the left end
  PIG = { body, far, face, nost, crackLine, hole, shell, shard }; return PIG;
}
// o: dir (1 = facing left as on thumbnail A, -1 mirrored) · crack 0..1 (0 = whole; 1 = broken open, light inside) · fill 0..1 (gold glow
//   inside / through the slot) · a · lit (sky light from the upper left 0..1) · warm 0..1 (gold light on the top from the crack) · dark 0..1
export function piggy(ctx, t, x, y, h, o = {}) {
  const G = pigPaths(), dir = o.dir ?? 1, crack = clamp(o.crack ?? 0), a = o.a ?? 1, warm = clamp(o.warm ?? crack), br = 1 + .006 * Math.sin(t * .9);
  const L = (u, v) => [x - u * h * dir, y + v * h];   // local → caller (dir 1 = snout at -x … mirrored by -dir on u)
  const out = { slot: L(.02, -.94), crack: L(-.2, -.86), top: y - h * .95, snout: L(.75, -.555), h };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(h * dir, h * br); ctx.translate(0, (1 - br) / br * 0);
  // the far legs and ear (darker, behind)
  ctx.fillStyle = mixHex(NIGHT.pigDark, P.night0, .3); ctx.fill(G.far);
  const shell = crack > .5 ? G.shell : G.body;
  // body: sky light from the upper left, night below right
  ctx.fillStyle = lin(ctx, -.7, -1, .5, -.05, [[0, mixHex(NIGHT.pigLit, NIGHT.pig, .25)], [.38, NIGHT.pig], [.8, mixHex(NIGHT.pig, NIGHT.pigDark, .7)], [1, NIGHT.pigDark]]);
  ctx.fill(shell);
  ctx.save(); ctx.clip(shell);
  ctx.fillStyle = rad(ctx, -.32, -.82, .55, [[0, rgba(NIGHT.pigLit, .55 * (o.lit ?? 1))], [1, rgba(NIGHT.pigLit, 0)]]); ctx.fillRect(-1, -1.2, 2, 1.3);   // sky sheen
  ctx.fillStyle = lin(ctx, 0, -.4, 0, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .55)]]); ctx.fillRect(-1, -.4, 2, .41);   // belly shadow
  if (warm > 0) { ctx.fillStyle = rad(ctx, .15, -.92, .6, [[0, rgba(P.halo1, .45 * warm)], [.5, rgba(P.shade0, .14 * warm)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-1, -1.2, 2, 1.3); }
  if (o.dark) { ctx.fillStyle = rgba(P.night0, .5 * clamp(o.dark)); ctx.fillRect(-1, -1.2, 2, 1.3); }
  ctx.restore();
  rimFill(ctx, shell, rgba(mixHex(P.blue0, P.halo2, .25), .85), .012, .008);   // blue rim on the lit side (left/top)
  rimFill(ctx, shell, rgba(P.night0, .5), -.01, -.006);
  // snout face + nostrils, eye, slot, tail
  ctx.fillStyle = lin(ctx, -.8, -.67, -.7, -.44, [[0, mixHex(NIGHT.pigLit, NIGHT.pig, .1)], [1, NIGHT.pig]]); ctx.fill(G.face);
  ctx.fillStyle = mixHex(P.night0, P.night1, .4); ctx.fill(G.nost);
  ctx.beginPath(); ctx.arc(-.47, -.7, .024, 0, TAU); ctx.fill();
  if (crack < .5) { ctx.save(); ctx.translate(.02, -.935); ctx.rotate(.08); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(-.07, -.008, .14, .016, .008); ctx.fill();
    if (o.fill) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo0, .55 * o.fill); ctx.fillRect(-.06, -.004, .12, .008); } ctx.restore(); }
  ctx.strokeStyle = mixHex(NIGHT.pig, NIGHT.pigDark, .3); ctx.lineWidth = .028; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(.62, -.6); ctx.bezierCurveTo(.72, -.62, .74, -.72, .68, -.74); ctx.bezierCurveTo(.62, -.76, .62, -.66, .7, -.64); ctx.bezierCurveTo(.76, -.63, .79, -.66, .8, -.69); ctx.stroke();
  // the crack: the opening shows the dark inside with the gold heap; the broken edge catches the light; a shard sticks up
  if (crack > 0) {
    const cl = G.crackLine, n = cl.length, m = Math.max(2, Math.ceil(n * clamp(crack * 2)));
    if (crack > .5) {
      ctx.save(); ctx.clip(G.hole);
      ctx.fillStyle = lin(ctx, 0, -.95, 0, -.7, [[0, mixHex(P.night0, P.ind0, .5)], [1, mixHex(P.shade0, P.night1, .4)]]); ctx.fillRect(-.3, -1.1, 1.1, .5);
      ctx.fillStyle = rad(ctx, .2, -.74, .38, [[0, rgba(P.core0, .95 * warm)], [.3, rgba(P.halo0, .7 * warm)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-.3, -1.1, 1.1, .5);
      for (let i = 0; i < 9; i++) { const u = -.08 + i * .075, v = -.79 + .03 * Math.sin(i * 2.1); coinLocal(ctx, u, v, .05, .35 + .2 * Math.sin(i), warm); }
      ctx.restore();
      ctx.fillStyle = lin(ctx, -.2, -1.07, -.02, -.9, [[0, mixHex(NIGHT.pigLit, P.halo2, .35)], [1, NIGHT.pig]]); ctx.fill(G.shard);
    }
    ctx.save(); ctx.strokeStyle = mixHex(P.halo0, P.core1, .4); ctx.lineWidth = .016; ctx.lineJoin = 'round'; ctx.shadowColor = rgba(P.halo0, .9); ctx.shadowBlur = h * .02;
    ctx.beginPath(); cl.slice(0, m).forEach(([u, v], i) => (i ? ctx.lineTo(u, v) : ctx.moveTo(u, v))); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  if (crack > .5 && warm > 0) halo(ctx, ...L(-.2, -.82), h * .45, .5 * warm * a, P.halo1, P.core0);
  return out;
}
function coinLocal(ctx, u, v, r, flip, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = COIN.rim; ctx.beginPath(); ctx.ellipse(u, v + r * .12, r, r * .45, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = COIN.face; ctx.beginPath(); ctx.ellipse(u, v, r, r * .42, 0, 0, TAU); ctx.fill(); ctx.restore();
}
// a gold coin seen at a flip angle (0 = face on, π/2 = edge on). o { a, glint 0..1, tilt (rad, rotation of the coin in the picture) }
export function coin(ctx, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= .2) return;
  const f = o.flip ?? 0, sx = Math.max(.1, Math.abs(Math.cos(f))), th = r * .16 * Math.sqrt(Math.max(0, 1 - sx * sx)) + r * .05, side = Math.sin(f) >= 0 ? 1 : -1;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.tilt ?? 0);
  ctx.fillStyle = COIN.edge; ctx.beginPath(); ctx.ellipse(side * th, 0, r * sx, r, 0, 0, TAU); ctx.fill();          // the edge (thickness)
  ctx.fillStyle = lin(ctx, -r, -r, r, r, [[0, COIN.lit], [.45, COIN.face], [1, COIN.rim]]); ctx.beginPath(); ctx.ellipse(0, 0, r * sx, r, 0, 0, TAU); ctx.fill();
  if (r > 3) { ctx.strokeStyle = rgba(COIN.rim, .7); ctx.lineWidth = Math.max(.6, r * .07); ctx.beginPath(); ctx.ellipse(0, 0, r * sx * .74, r * .74, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
  if (o.glint) halo(ctx, x - r * .3 * sx, y - r * .35, r * 2.2, .35 * o.glint * a, P.halo0, P.core0);
}
// coins rising out of a crack and turning into gold dust. (x, y) = the crack, s = scale (≈ piggy height / 700). Deterministic in t.
// o { rate (coins/s), seed, a, life (s), dir (1 = up-right), dust (count of dust specks), spread }
export function fountain(ctx, t, x, y, s, o = {}) {
  const rate = o.rate ?? 3, life = o.life ?? 3.6, seed = o.seed ?? 5, a = o.a ?? 1, dir = o.dir ?? 1; if (a <= 0) return;
  const k0 = Math.floor((t - life) * rate) - 1, k1 = Math.floor(t * rate);
  for (let k = k0; k <= k1; k++) {
    const r = prng(seed * 1000 + ((k % 100000) + 100000)), tk = k / rate + r() * .3, u = (t - tk) / life; if (u < 0 || u > 1) continue;
    const vx = (60 + r() * 160) * dir, vy = 420 + r() * 260, wob = r() * 6.3, e = sineIO(clamp(u * 1.05));
    const px = x + s * (vx * e + 30 * Math.sin(u * 5 + wob) * u), py = y - s * (vy * (1 - Math.pow(1 - u, 1.6)) - 30 * u);
    const rr = s * (30 + r() * 18) * (u < .55 ? 1 : 1 - smooth(span(u, .55, .95)));
    coin(ctx, px, py, rr, { flip: t * (2 + r() * 3) + wob, tilt: .3 * Math.sin(wob), a: a * clamp(u * 8) });
    if (u > .4) {   // the coin comes apart into specks that stay behind and drift
      const n = 14, q = prng(seed * 77 + k);
      for (let i = 0; i < n; i++) {
        const born = .4 + q() * .55, du = u - born; if (du < 0) continue;
        const sx = px + s * (q() - .5) * 60 * (1 + du * 3) + s * 70 * du * dir, sy = py + s * (q() - .5) * 60 * (1 + du * 3) - s * 60 * du;
        ctx.fillStyle = rgba(q() < .5 ? P.halo0 : P.core1, a * (1 - du / (1.05 - born)) * .95); const z = (1.2 + q() * 2.2) * Math.max(.6, Math.sqrt(s)); ctx.fillRect(sx, sy, z, z);
      }
    }
  }
  if ((o.dust ?? 260) > 0) goldDust(ctx, t, [[x, y], [x + s * 140 * dir, y - s * 380], [x + s * 330 * dir, y - s * 820], [x + s * 520 * dir, y - s * 1300]], { n: o.dust ?? 420, seed: seed + 3, spread: s * 110, a, size: Math.max(.7, Math.sqrt(s)) * 2, speed: .14 });
}
// a stream of gold specks drifting along a path (each speck loops along it; deterministic). o { n, seed, spread, speed (loops/s), a, size, col }
export function goldDust(ctx, t, pts, o = {}) {
  const n = o.n ?? 200, seed = o.seed ?? 9, sp = o.spread ?? 40, a = o.a ?? 1; if (a <= 0 || pts.length < 2) return;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const TL = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; };
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const sp0 = (o.speed ?? .12) * (.6 + r() * .8), off = r(), lat = (r() - .5) * 2, lat2 = (r() - .5) * 2, sz = (o.size ?? 1.8) * (r() < .85 ? .6 + r() * .7 : 1.4 + r()), ph = r() * 6.3, hot = r() < .3;
    const p = ((t * sp0 + off) % 1 + 1) % 1, [px, py] = at(p * TL), spread = sp * (.25 + p * 1.4);
    ctx.fillStyle = rgba(hot ? P.core1 : (o.col ?? P.halo0), a * Math.sin(Math.PI * p) * (.55 + .45 * Math.sin(t * 2.3 + ph)));
    ctx.fillRect(px + lat * spread + Math.sin(t * .8 + ph) * 6, py + lat2 * spread * .5 + Math.cos(t * .7 + ph) * 5, sz, sz);
  }
  ctx.restore();
}

// ======================================================================================================================== FIGURES
// the older you (same coat, hood down, white hair, a slight stoop). Same options as du(); o.lean default .1. Returns hands.
export function older(ctx, x, y, h, o = {}) {
  const lean = o.lean ?? .1, look = o.look ?? -.05, dir = o.dir ?? 1, side = o.view === 'side' || o.walk != null;
  const hands = E.du(ctx, x, y, h, { ...o, hood: false, lean, look });
  const hx = (side ? .012 : 0) - .012 * look, hy = -.885 - .008 * look;
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h); ctx.translate(0, -.47); ctx.rotate(lean); ctx.translate(0, .47);
  ctx.rotate(0); const hair = mixHex(P.cream, P.blue1, .32), ra = look * -.35;
  ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hx - .006, hy - .03, .07, .05, ra, Math.PI, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx - .05, hy - .005, .028, .046, ra + .3, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(hair, P.night1, .35); ctx.beginPath(); ctx.ellipse(hx - .062, hy - .04, .025, .022, 0, 0, TAU); ctx.fill();   // a small bun
  ctx.restore();
  return hands;
}

// ======================================================================================================================== THE STREET
// one window: o { lit 0..1 (warm), open (true = leave the glass out: an interior is drawn behind), mull: [cols, rows], sill, frame, cool }
export function win(ctx, t, x, y, w, h, o = {}) {
  const lit = clamp(o.lit ?? 0), fr = o.frame ?? Math.max(4, w * .04);
  if (!o.open) {
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(NIGHT.glass, P.blue1, .25)], [1, NIGHT.glass]]); ctx.fillRect(x, y, w, h);
    if (lit > 0) {
      const flick = 1 + .03 * Math.sin(t * 1.7 + x * .01);
      ctx.fillStyle = lin(ctx, 0, y, 0, y + h, o.cool ? [[0, rgba(COOL.body, lit)], [1, rgba(COOL.deep, lit)]] : [[0, rgba(mixHex(P.core1, P.halo0, .4), lit * flick)], [.7, rgba(P.halo1, lit)], [1, rgba(P.shade0, lit)]]);
      ctx.fillRect(x, y, w, h);
    }
  }
  const [cols, rows] = o.mull ?? [2, 1];
  ctx.fillStyle = mixHex(NIGHT.wall, P.night0, .35);
  for (let i = 1; i < cols; i++) ctx.fillRect(x + w * i / cols - fr / 4, y, fr / 2, h);
  for (let j = 1; j < rows; j++) ctx.fillRect(x, y + h * j / rows - fr / 4, w, fr / 2);
  ctx.strokeStyle = mixHex(NIGHT.wall, P.night0, .45); ctx.lineWidth = fr; ctx.strokeRect(x, y, w, h);
  if (o.sill !== false) { ctx.fillStyle = mixHex(NIGHT.wallLit, P.blue0, .2); ctx.fillRect(x - fr * 1.6, y + h + fr / 2, w + fr * 3.2, fr * 1.4); }
  if (lit > .2 && !o.open) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x + w / 2, y + h / 2, Math.max(w, h) * .9, [[0, rgba(P.halo1, .12 * lit)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x - w, y - h, w * 3, h * 3); ctx.restore(); }
}
// a facade: o { x0, x1, roof (y), ground (y), seed, rows: [[y, h]…], cols, ww, lit (fraction), holes: [[x, y, w, h]] (open windows), skip: [[x,y,w,h]], col, door: x }
export function house(ctx, t, o) {
  const { x0, x1, roof, ground } = o, col = o.col ?? NIGHT.wall, r = prng(o.seed ?? 3);
  const p = new Path2D(); p.rect(x0, roof, x1 - x0, ground - roof);
  for (const [x, y, w, h] of o.holes || []) { p.rect(x + w, y, -w, h); }   // counter-wound: an even-odd hole
  ctx.fillStyle = lin(ctx, x0, roof, x1, ground, [[0, mixHex(col, P.blue1, .22)], [.5, col], [1, mixHex(col, P.night0, .35)]]); ctx.fill(p, 'evenodd');
  ctx.fillStyle = mixHex(col, P.night0, .4); ctx.fillRect(x0 - 10, roof - 14, x1 - x0 + 20, 16);                 // cornice
  ctx.fillStyle = rgba(P.blue0, .5); ctx.fillRect(x0 - 10, roof - 15, x1 - x0 + 20, 2);
  const inHole = (x, y, w, h) => (o.holes || []).concat(o.skip || []).some(([a, b, c, d]) => x < a + c && x + w > a && y < b + d && y + h > b);
  const ww = o.ww ?? 120, cols = o.cols ?? Math.max(1, Math.floor((x1 - x0) / (ww * 1.9)));
  for (const [y, h] of o.rows || []) for (let i = 0; i < cols; i++) {
    const x = x0 + (x1 - x0) * (i + .5) / cols - ww / 2, lit = r() < (o.lit ?? .35) ? .36 + r() * .24 : 0;
    if (!inHole(x, y, ww, h)) win(ctx, t, x, y, ww, h, { lit, mull: [2, 2] });
  }
  if (o.door != null) { ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(o.door, ground - 210, 110, 210); ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(o.door + 14, ground - 196, 82, 40); }
}
// sidewalk + curb + road from y (design), o { x0, x1, wet }
export function street(ctx, t, y, o = {}) {
  const x0 = o.x0 ?? -2000, x1 = o.x1 ?? 4000;
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 40, [[0, mixHex(NIGHT.ground, P.blue1, .3)], [1, NIGHT.ground]]); ctx.fillRect(x0, y, x1 - x0, 40);
  ctx.fillStyle = rgba(P.blue0, .6); ctx.fillRect(x0, y, x1 - x0, 2);
  ctx.fillStyle = mixHex(NIGHT.ground, P.blue0, .35); ctx.fillRect(x0, y + 40, x1 - x0, 6);
  ctx.fillStyle = lin(ctx, 0, y + 46, 0, y + 600, [[0, mixHex(P.night1, P.ind0, .35)], [1, P.night0]]); ctx.fillRect(x0, y + 46, x1 - x0, 800);
}
// a street lamp: post foot at (x, y), height h; the lamp head is a warm light (o.a), o.dir ±1 (arm side)
export function streetLamp(ctx, t, x, y, h, o = {}) {
  const d = o.dir ?? 1, a = o.a ?? 1, hx = x + d * h * .16, hy = y - h * .97;
  ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(x - h * .012, y - h, h * .024, h);
  ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = h * .016; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x, y - h * 1.03, hx, hy - h * .02); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.night1, .3); ctx.beginPath(); ctx.moveTo(hx - h * .05, hy); ctx.lineTo(hx + h * .05, hy); ctx.lineTo(hx + h * .025, hy - h * .035); ctx.lineTo(hx - h * .025, hy - h * .035); ctx.closePath(); ctx.fill();
  if (a > 0) { ctx.fillStyle = rgba(P.core1, a); ctx.beginPath(); ctx.ellipse(hx, hy + h * .004, h * .04, h * .012, 0, 0, TAU); ctx.fill(); halo(ctx, hx, hy + h * .02, h * .5, .45 * a * (1 + .02 * Math.sin(t * 3 + x))); }
  return [hx, hy];
}
// the mailbox at the curb (post + box), foot at (x, y), height h. o { open 0..1 (the lid), check 0..1 (a check inside rises), old (wooden, 1940),
//   flag 0..1 (raised), a, sketch 0..1 (drawn as a pencil sketch: outlines only, not yet coloured) } → { slot: [x, y] (mouth) }
export function mailbox(ctx, t, x, y, h, o = {}) {
  const old = !!o.old, bw = h * .5, bh = h * .3, by = y - h * .66, bx = x - bw * .45, open = clamp(o.open ?? 0), sk = clamp(o.sketch ?? 0);
  const body = old ? mixHex(P.shade0, P.night1, .55) : mixHex(P.ind1, P.blue0, .3), dark = mixHex(body, P.night0, .5);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (sk > 0) { ctx.globalAlpha *= 1; }
  const fill = (path, col) => { if (sk < 1) { ctx.save(); ctx.globalAlpha *= 1 - sk; ctx.fillStyle = col; ctx.fill(path); ctx.restore(); } if (sk > 0) { ctx.save(); ctx.globalAlpha *= sk; ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = Math.max(1.5, h * .008); ctx.setLineDash([h * .03, h * .012]); ctx.stroke(path); ctx.restore(); } };
  const post = new Path2D(); post.rect(x - h * .03, by + bh, h * .06, y - by - bh); fill(post, dark);
  const box = new Path2D(); box.moveTo(bx, by + bh); box.lineTo(bx, by + bh * .4); box.arc(bx + bh * .4, by + bh * .4, bh * .4, Math.PI, Math.PI * 1.5); box.lineTo(bx + bw, by); box.lineTo(bx + bw, by + bh); box.closePath();
  if (sk < 1) { ctx.save(); ctx.globalAlpha *= 1 - sk; ctx.fillStyle = lin(ctx, 0, by, 0, by + bh, [[0, mixHex(body, P.blue1, .35)], [1, body]]); ctx.fill(box); ctx.restore(); } else fill(box, body);
  if (sk > 0) fill(box, body);
  // the mouth (front, at the left end) and the lid that swings down
  const mx = bx, my = by + bh * .55;
  ctx.fillStyle = rgba(P.night0, .9 * (1 - sk)); ctx.beginPath(); ctx.ellipse(mx + 2, my, bh * .1 + open * bh * .12, bh * .38, 0, 0, TAU); ctx.fill();
  if (o.check > 0) { const cu = clamp(o.check), cw = bw * .7; ctx.save(); ctx.translate(mx - cu * cw * .55, my - bh * .04); ctx.rotate(-.06);
    ctx.fillStyle = sk > .5 ? rgba(P.cream, 0) : mixHex(P.cream, P.halo2, .35); ctx.fillRect(-cw * .1, -bh * .2, cw * .6, bh * .34);
    if (sk > 0) { ctx.strokeStyle = rgba(P.cream, .9 * sk); ctx.lineWidth = 2; ctx.strokeRect(-cw * .1, -bh * .2, cw * .6, bh * .34); } ctx.restore(); }
  const lid = new Path2D(); lid.ellipse(0, 0, bh * .12, bh * .42, 0, 0, TAU);
  ctx.save(); ctx.translate(mx - 2 - open * bh * .5, my + open * bh * .28); ctx.rotate(-open * 1.3); fill(lid, mixHex(body, P.blue1, .2)); ctx.restore();
  // the flag
  const fu = clamp(o.flag ?? 0); ctx.save(); ctx.translate(bx + bw * .8, by + bh * .4); ctx.rotate(-Math.PI / 2 * fu); ctx.fillStyle = old ? mixHex(P.coat, P.shade0, .5) : mixHex(P.halo0, P.shade0, .35);
  ctx.fillRect(0, -h * .01, h * .12, h * .02); ctx.fillRect(h * .1, -h * .01, h * .04, h * .06); ctx.restore();
  ctx.restore();
  return { slot: [mx, my], top: by };
}
// a wall calendar: top ring at (x, y), width w (height 1.25 w). page: float (integer = the page showing, fraction = the next page lifting).
// o { label(i) → [big, small] (e.g. ['MAR', '2026'] or ['2031', '']), a, gold: i → 0..1 (a circled day / gold page) }
export function calendar(ctx, t, x, y, w, page, o = {}) {
  const h = w * 1.25, i = Math.floor(page), f = page - i, lab = o.label || ((k) => [String(k + 1), '']);
  const pg = (k, sy, back) => {
    const [big, small] = lab(k); ctx.save(); ctx.translate(x, y); ctx.scale(1, sy);
    ctx.fillStyle = back ? mixHex(P.cream, P.halo2, .5) : lin(ctx, 0, 0, 0, h, [[0, P.cream], [1, mixHex(P.cream, P.halo1, .35)]]); ctx.fillRect(-w / 2, 0, w, h);
    if (!back) {
      ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.fillRect(-w / 2, 0, w, h * .12);
      ctx.fillStyle = P.night1; ctx.textAlign = 'center'; ctx.font = `${w * .42}px "Instrument Serif"`; ctx.fillText(big, 0, h * .56);
      if (small) { ctx.font = `600 ${w * .1}px Inter`; const k = Math.min(1, w * .86 / ctx.measureText(small).width); ctx.font = `600 ${w * .1 * k}px Inter`; ctx.fillText(small, 0, h * .7); }
      ctx.strokeStyle = rgba(P.night1, .25); ctx.lineWidth = 1;
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { ctx.strokeRect(-w * .4 + c * w * .135, h * .76 + r * h * .065, w * .12, h * .055); }
      const g = o.gold?.(k) ?? 0; if (g > 0) { ctx.strokeStyle = rgba(P.halo0, g); ctx.lineWidth = w * .02; ctx.beginPath(); ctx.ellipse(w * .13, h * .82, w * .1, h * .05, 0, 0, TAU); ctx.stroke(); }
    }
    ctx.restore();
  };
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(x - w / 2 + 6, y + 8, w, h);   // shadow on the wall
  pg(i + 1, 1);
  if (f < .5) pg(i, Math.cos(Math.PI * f)); else pg(i, -Math.cos(Math.PI * f) * .35, true);   // the page lifts over the ring
  ctx.fillStyle = mixHex(P.night1, P.blue1, .4); ctx.beginPath(); ctx.arc(x, y + 2, w * .035, 0, TAU); ctx.fill();
  ctx.restore();
}
// goods for the shop shelf / explainers (flat silhouettes). kinds: bread, shoe, books, lamp, cup, tv (tube), flat (flat screen), chair, box
export function goods(ctx, kind, x, y, s, o = {}) {   // (x, y) = bottom centre
  const cr = P.cream, wm = mixHex(P.halo0, P.shade0, .25), ind = mixHex(P.ind1, P.blue1, .5), dk = mixHex(P.night1, P.ind1, .5);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'bread') { ctx.fillStyle = wm; ctx.beginPath(); ctx.ellipse(0, -.28, .55, .28, 0, Math.PI, TAU); ctx.lineTo(.55, 0); ctx.lineTo(-.55, 0); ctx.fill(); ctx.strokeStyle = mixHex(wm, P.shade0, .6); ctx.lineWidth = .05; for (const u of [-.25, 0, .25]) { ctx.beginPath(); ctx.moveTo(u - .08, -.42); ctx.lineTo(u + .08, -.3); ctx.stroke(); } }
  else if (kind === 'shoe') { ctx.fillStyle = ind; ctx.beginPath(); ctx.moveTo(-.5, 0); ctx.lineTo(-.5, -.45); ctx.lineTo(-.15, -.45); ctx.quadraticCurveTo(0, -.2, .45, -.18); ctx.quadraticCurveTo(.55, -.1, .52, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = cr; ctx.fillRect(-.5, -.05, 1.02, .05); }
  else if (kind === 'books') { [[-.4, .8, wm], [-.36, .72, ind], [-.42, .84, cr]].forEach(([u, w, c], i) => { ctx.fillStyle = c; ctx.fillRect(u, -.16 * (i + 1), w, .15); }); }
  else if (kind === 'lamp') { ctx.fillStyle = dk; ctx.fillRect(-.03, -.75, .06, .72); ctx.fillRect(-.22, -.05, .44, .05); ctx.fillStyle = wm; ctx.beginPath(); ctx.moveTo(-.25, -.62); ctx.lineTo(.25, -.62); ctx.lineTo(.15, -.95); ctx.lineTo(-.15, -.95); ctx.closePath(); ctx.fill(); }
  else if (kind === 'cup') { ctx.fillStyle = cr; ctx.beginPath(); ctx.moveTo(-.25, -.5); ctx.lineTo(.25, -.5); ctx.lineTo(.2, 0); ctx.lineTo(-.2, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = cr; ctx.lineWidth = .06; ctx.beginPath(); ctx.arc(.27, -.3, .1, -1.4, 1.4); ctx.stroke(); }
  else if (kind === 'tv') { ctx.fillStyle = mixHex(P.shade0, P.night1, .4); ctx.beginPath(); ctx.roundRect(-.55, -.85, 1.1, .8, .12); ctx.fill(); ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.beginPath(); ctx.roundRect(-.46, -.77, .78, .62, .14); ctx.fill(); ctx.fillStyle = dk; ctx.fillRect(-.35, -.05, .1, .05); ctx.fillRect(.25, -.05, .1, .05); ctx.beginPath(); ctx.arc(.44, -.6, .04, 0, TAU); ctx.arc(.44, -.45, .04, 0, TAU); ctx.fill(); }
  else if (kind === 'flat') { ctx.fillStyle = mixHex(P.night1, P.night0, .5); ctx.fillRect(-.8, -.95, 1.6, .9); ctx.fillStyle = lin(ctx, -.8, -.95, .8, -.05, [[0, mixHex(P.blue0, P.halo2, .25)], [1, P.ind1]]); ctx.fillRect(-.76, -.91, 1.52, .82); ctx.fillStyle = dk; ctx.fillRect(-.05, -.05, .1, .05); ctx.fillRect(-.25, -.02, .5, .02); }
  else if (kind === 'chair') { ctx.fillStyle = wm; ctx.fillRect(-.3, -.5, .6, .07); ctx.fillRect(-.3, -1.05, .07, .6); ctx.fillRect(-.3, -.45, .06, .45); ctx.fillRect(.24, -.45, .06, .45); ctx.fillRect(-.3, -1.05, .5, .07); }
  else { ctx.fillStyle = wm; ctx.fillRect(-.4, -.6, .8, .6); ctx.strokeStyle = mixHex(wm, P.shade0, .6); ctx.lineWidth = .04; ctx.strokeRect(-.4, -.6, .8, .6); ctx.beginPath(); ctx.moveTo(-.4, -.3); ctx.lineTo(.4, -.3); ctx.stroke(); }
  ctx.restore();
}
// a paper price tag on a string: string top at (x, y), tag size s (width), text (1 line, Inter caps or a price), o { ang (rad, swing),
//   torn 0..1 (tears down the middle: left half stays, right half drops by o.drop px), col 'cream' | 'gold' | 'cool', size, a, serif }
export function priceTag(ctx, t, x, y, s, text, o = {}) {
  const ang = o.ang ?? .04 * Math.sin(t * 1.3 + x * .01), L = o.len ?? s * .6, tw = s, th = s * .5, a = o.a ?? 1; if (a <= 0) return;
  const col = o.col === 'gold' ? [P.core1, P.halo0] : o.col === 'cool' ? [mixHex(COOL.body, P.cream, .4), COOL.deep] : [P.cream, mixHex(P.cream, P.halo1, .45)];
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = Math.max(1, s * .012); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L); ctx.stroke();
  const tag = (x0, x1, dy, rot) => {
    ctx.save(); ctx.translate(0, L + dy); ctx.rotate(rot); const p = new Path2D(); p.moveTo(-tw * .1, 0); p.lineTo(tw * .1, 0); p.lineTo(tw * .5, th * .3); p.lineTo(tw * .5, th * 1.3); p.lineTo(-tw * .5, th * 1.3); p.lineTo(-tw * .5, th * .3); p.closePath();
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -10, x1 - x0, th * 2); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, 0, 0, th * 1.3, [[0, col[0]], [1, col[1]]]); ctx.fill(p);
    ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.beginPath(); ctx.arc(0, th * .2, tw * .035, 0, TAU); ctx.fill();
    ctx.fillStyle = P.night1; ctx.textAlign = 'center'; ctx.font = o.serif ? `${o.size ?? th * .62}px "Instrument Serif"` : `600 ${o.size ?? th * .36}px Inter`; ctx.fillText(text, 0, th * .98);
    ctx.restore(); ctx.restore();
  };
  const tr = clamp(o.torn ?? 0);
  if (tr <= 0) tag(-tw, tw, 0, 0); else { tag(-tw, 0, 0, -.05 * tr); tag(0, tw, (o.drop ?? s * .8) * tr, .25 * tr); }
  ctx.restore();
}
// a balance beam of light. Pivot (x, y), beam length w, tilt (rad, + = right side down). o { u (0..1 grows: post, beam, pans), post (px),
//   left(ctx, px, py), right(ctx, px, py) draw the pan contents (pan centre), labels: [l, r], a }
export function balance(ctx, t, x, y, w, tilt, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const up = expoOut(span(u, 0, .4)), ub = expoOut(span(u, .2, .7)), un = expoOut(span(u, .5, 1)), post = o.post ?? w * .55, sl = w * .26;
  const glowLine = (pts, wd, al = 1) => { for (const [k, c, op] of [[4, rgba(P.halo1, .18 * al), 'lighter'], [1, rgba(P.halo0, .95 * al), 'source-over']]) { ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.lineWidth = wd * k; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); ctx.restore(); } };
  glowLine([[x, y + post], [x, y + post - post * up]], 5);
  glowLine([[x - 60 * up, y + post], [x + 60 * up, y + post]], 5);
  const c = Math.cos(tilt), s = Math.sin(tilt), hw = w / 2 * ub, L = [x - c * hw, y - s * hw], R = [x + c * hw, y + s * hw];
  if (ub > 0) glowLine([L, R], 6);
  halo(ctx, x, y, 26, .6 * ub);
  const pan = (P0, side) => {
    if (un <= 0) return;
    const py = P0[1] + sl * un, cx = P0[0];
    glowLine([P0, [cx - w * .1, py]], 2, .7); glowLine([P0, [cx + w * .1, py]], 2, .7);
    ctx.save(); ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(cx, py, w * .12 * un, w * .024, 0, 0, Math.PI); ctx.stroke(); ctx.restore();
    const fn = side < 0 ? o.left : o.right; if (fn) fn(ctx, cx, py - 2);
    const lb = o.labels?.[side < 0 ? 0 : 1]; if (lb) maskLine(ctx, [[lb, 0]], cx, py + 62, 24, rise(span(u, .75, 1)), { serif: false, weight: 600, align: 'center', col: GOLD.text, glow: false });
  };
  pan(L, -1); pan(R, 1);
  return { L, R, pans: [[L[0], L[1] + sl], [R[0], R[1] + sl]] };
}
// a stack of n coins (a bar), bottom centre (x, y), coin radius r. o { u (grows), a, label (below), value (above, serif), col }
export function coinStack(ctx, t, x, y, n, r, o = {}) {
  const u = clamp(o.u ?? 1), m = n * u, a = o.a ?? 1, th = r * .26; if (m <= 0) return y;
  for (let i = 0; i < Math.ceil(m); i++) {
    const f = clamp(m - i), yy = y - i * th - (1 - expoOut(f)) * r * 2;
    ctx.save(); ctx.globalAlpha *= a * clamp(f * 3);
    ctx.fillStyle = COIN.edge; ctx.beginPath(); ctx.ellipse(x, yy, r, r * .3, 0, 0, Math.PI); ctx.lineTo(x - r, yy - th); ctx.ellipse(x, yy - th, r, r * .3, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(COIN.rim, COIN.face, .3); ctx.fillRect(x - r, yy - th * .9, r * 2, th * .5);
    ctx.fillStyle = lin(ctx, x - r, 0, x + r, 0, [[0, COIN.lit], [1, COIN.face]]); ctx.beginPath(); ctx.ellipse(x, yy - th, r, r * .3, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  const top = y - m * th - r * .3;
  if (o.value) maskLine(ctx, [[o.value, 0]], x, top - 16, o.vsize ?? 40, rise(span(u, .7, 1)), { align: 'center' });
  if (o.label) maskLine(ctx, [[o.label, 0]], x, y + r * .3 + 40, o.lsize ?? 22, rise(span(u, .3, .8)), { serif: false, weight: 600, align: 'center', col: GOLD.text, glow: false });
  return top;
}
// a paper check: top-left (x, y), width w (height .45 w). o { pay ('EVERYONE'), from ('U.S. TREASURY'), amount, date, sig, no ('No. 00-000-001'),
//   dashed (outline only: a promise), blink: { amount, date, sig } 0..1, a, sketch 0..1, byLaw 0..1 }
export function check(ctx, t, x, y, w, o = {}) {
  const h = w * .45, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  if (o.dashed) { ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2.5; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 10; ctx.strokeRect(0, 0, w, h); ctx.setLineDash([]); }
  else { ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(8, 10, w, h); ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, P.cream], [1, mixHex(P.cream, P.halo1, .35)]]); ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = rgba(P.shade0, .5); ctx.lineWidth = 2; ctx.strokeRect(w * .02, h * .04, w * .96, h * .92); }
  const ink = o.dashed ? P.cream : P.night1, fs = w * .036;
  const txt = (s, xx, yy, sz = fs, al = 'left', serif = false) => { ctx.fillStyle = ink; ctx.textAlign = al; ctx.font = serif ? `${sz}px "Instrument Serif"` : `600 ${sz}px Inter`; ctx.fillText(s, xx, yy); };
  if (o.from) txt(o.from, w * .06, h * .2);
  if (o.no) txt(o.no, w * .94, h * .2, fs * .9, 'right');
  txt('PAY TO', w * .06, h * .45, fs * .8); if (o.pay) txt(o.pay, w * .24, h * .45, fs * 1.5, 'left', true);
  ctx.strokeStyle = rgba(ink, .5); ctx.lineWidth = 1.5;
  const field = (lab, xx, yy, ww, val, bl) => { txt(lab, xx, yy + fs * 1.4, fs * .7); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + ww, yy); ctx.stroke();
    if (val) txt(val, xx + 4, yy - fs * .4, fs * 1.4, 'left', true);
    if (bl > 0) { ctx.save(); ctx.globalCompositeOperation = o.dashed ? 'lighter' : 'source-over'; ctx.fillStyle = rgba(ROSE.mark, .45 * bl); ctx.fillRect(xx - 4, yy - fs * 1.8, ww + 8, fs * 1.9); ctx.restore(); } };
  field('AMOUNT', w * .64, h * .5, w * .3, o.amount, o.blink?.amount ?? 0);
  field('DATE', w * .06, h * .78, w * .3, o.date, o.blink?.date ?? 0);
  field('SIGNATURE', w * .6, h * .78, w * .34, o.sig, o.blink?.sig ?? 0);
  if (o.byLaw > 0) maskLine(ctx, [['BY LAW', 0]], w * .4, h * .66, fs * 1.3, rise(o.byLaw), { serif: false, weight: 600, col: P.shade0, glow: false });
  ctx.restore();
}
// a small quote card (dark paper, a thin gold rule on top, serif cream lines, small source). Top-left (x, y), w × h. q = { lines, src, quoted }
export function qcard(ctx, t, x, y, w, h, q, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x + 10, y + 12, w, h);
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, mixHex(P.ind0, P.blue1, .25)], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = P.halo0; ctx.fillRect(x, y, w * expoOut(span(u, 0, .6)), 3);
  const size = o.size ?? 40, L = q.lines.map((l, i) => (q.quoted !== false ? (i === 0 ? '“' : '') + l + (i === q.lines.length - 1 ? '”' : '') : l));
  L.forEach((l, i) => maskLine(ctx, [[l, q.goldAll ? 1 : 0]], x + w / 2, y + h * .42 + i * size * 1.12 - (L.length - 1) * size * .5, size, rise(span(u, .15 + i * .1, .75 + i * .1)), { align: 'center' }));
  if (q.src) maskLine(ctx, [[q.src, 0]], x + w / 2, y + h - 26, 18, rise(span(u, .5, 1)), { serif: false, weight: 600, align: 'center', col: GOLD.text, glow: false });
  ctx.restore();
}
// a flat warehouse robot (a low disc carrying a shelf on top), bottom centre (x, y), size s. The machine is cool, never a face.
export function rover(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, 0, .6, .07, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -.22, 0, 0, [[0, mixHex(COOL.body, P.cream, .2)], [1, COOL.deep]]); ctx.beginPath(); ctx.roundRect(-.5, -.22, 1, .2, .08); ctx.fill();
  ctx.fillStyle = COOL.core; ctx.fillRect(-.3, -.14, .6 * (.5 + .5 * Math.sin(t * 3 + (o.ph ?? 0))), .03);
  if (o.shelf !== false) { ctx.fillStyle = mixHex(P.shade0, P.night1, .45); for (const u of [-.42, .38]) ctx.fillRect(u, -1.25, .05, 1.03); for (const v of [-1.25, -.85, -.5]) ctx.fillRect(-.45, v, .9, .05);
    ctx.fillStyle = mixHex(P.halo0, P.shade0, .4); ctx.fillRect(-.35, -1.18, .28, .3); ctx.fillRect(.02, -1.2, .3, .32); ctx.fillRect(-.2, -.8, .35, .27); }
  ctx.restore();
}
// a small gold ON AIR sign (centre x, y), scale s
export function onAir(ctx, t, x, y, s = 1, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.beginPath(); ctx.roundRect(-34, -11, 68, 22, 4); ctx.fill();
  const on = .85 + .15 * Math.sin(t * 2.2);
  ctx.fillStyle = rgba(P.core1, on); ctx.font = '600 13px Inter'; ctx.textAlign = 'center'; ctx.fillText('ON AIR', 0, 5);
  ctx.restore(); halo(ctx, x, y, 40 * s, .3 * a);
}

// ======================================================================================================================== THE TEST CARD
// The five lines (text-v2 "Die Uhr"). Card geometry in card px (scale 1 = big): 680 × 470, lines 1–4 = FORECAST, a fine rule, line 5 = ADVICE.
export const TEST = {
  w: 680, h: 482, ly: [104, 170, 236, 302, 436], rule: 348, x0: 108, box: 618, size: 23,
  lines: ['MACHINES MAKE ALMOST EVERYTHING', 'EVERYTHING GETS CHEAP', 'SOMEONE PAYS YOU AN INCOME', 'IT ARRIVES IN TIME', "IF HE'S WRONG, YOU'RE STILL FINE"],
  marks: ['check', 'half', 'cross', 'cross', 'cross'],
  verdicts: ['ON ITS WAY', 'THINGS YES · OLD AGE NO', 'ONLY A PROMISE SO FAR', 'LIKELY YEARS LATE', 'THE RISK IS YOURS'],
  corner: { x: 1834, y: 50, s: .4 },            // top-right corner (right edge x, top y, scale)
};
// a mark drawn as a pen stroke (u 0..1): 'check' gold ✓, 'half' gold ½ (a ring, its left half filled), 'cross' rose ✗. (x, y) = centre, s = size
export function mark(ctx, kind, x, y, s, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const col = kind === 'cross' ? ROSE.mark : P.halo0, glow = o.glow ?? 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = col; ctx.lineWidth = s * .14; ctx.shadowColor = rgba(col, .8 * glow); ctx.shadowBlur = s * .3;
  const seg = (pts, a, b) => { const k = clamp((u - a) / (b - a)); if (k <= 0) return; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(lerp(pts[0][0], pts[1][0], k), lerp(pts[0][1], pts[1][1], k)); ctx.stroke(); };
  if (kind === 'check') { seg([[x - s * .42, y + s * .02], [x - s * .12, y + s * .32]], 0, .35); seg([[x - s * .12, y + s * .32], [x + s * .46, y - s * .38]], .35, 1); }
  else if (kind === 'cross') { seg([[x - s * .36, y - s * .36], [x + s * .36, y + s * .36]], 0, .5); seg([[x + s * .36, y - s * .36], [x - s * .36, y + s * .36]], .5, 1); }
  else { ctx.lineWidth = s * .1; ctx.beginPath(); ctx.arc(x, y, s * .4, -Math.PI / 2, -Math.PI / 2 + TAU * expoOut(span(u, 0, .6))); ctx.stroke();
    const f = expoOut(span(u, .55, 1)); if (f > 0) { ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y - s * .4); ctx.arc(x, y, s * .4, -Math.PI / 2, -Math.PI / 2 - Math.PI * f, true); ctx.closePath(); ctx.fill(); } }
  ctx.restore();
}
// the phrase times of the test card (cached per timing object). Missing phrases (a later VO version) fall back gracefully.
const TT = new WeakMap();
export function testTimes(T) {
  if (TT.has(T)) return TT.get(T);
  const g = (p, a = -1, n = 0) => (T.gHas(p, n, a) ? T.G(p, n, a) : null), ge = (p, a = -1, n = 0) => (T.gHas(p, n, a) ? T.GE(p, n, a) : null);
  const s = {};
  s.born = g('But he has also told us'); s.glow1 = g('Part of his future is already here'); s.dash = g('But the part that would pay');
  s.away = g('Last winter, on a podcast'); s.back = g("This isn't financial advice"); s.forecast = g('For his forecast to come true'); s.advice = g('For his advice to be safe');
  s.write = [g('One: machines'), g('Two: everything'), g('Three: someone'), g('Four: it arrives'), g('And five')];
  s.corner = (ge("you're still fine", s.write[4] ?? -1) ?? (s.write[4] ?? 130) + 3) + .5;
  const st = [['The first line is where', 'So the first line', 'on its way'], ['Everything gets cheap', 'So the second line', 'half'], ['Someone pays you an income', 'So the third line', 'only a promise'],
    ['It arrives in time', 'So the fourth line', 'years late'], ["If he's wrong, you're still fine", 'So the fifth line', 'the risk is yours']];
  let after = s.corner; s.station = []; s.verdict = []; s.mark = [];
  for (const [a, v, m] of st) { const ta = g(a, after), tv = g(v, ta ?? after), tm = ge(m, tv ?? after); s.station.push(ta); s.verdict.push(tv); s.mark.push(tm); after = tm ?? tv ?? ta ?? after; }
  s.final = g('The five lines, then'); s.pulse = [g('One, on its way', s.final ?? -1), g('One, half true', s.final ?? -1), g('income', g('And three that fail', s.final ?? -1) ?? -1), g('timing', s.final ?? -1), g('risk', g('the timing', s.final ?? -1) ?? -1)];
  s.adviceMark = g('As advice', s.final ?? -1); s.release = g('Maybe one day', s.final ?? -1); s.out = g('This channel exists', s.final ?? -1);
  TT.set(T, s); return s;
}
// draw the test card. State from the phrases (testTimes). o: { at: [x, y, s] (centre, scale) overrides the placement (hook / c02 / c11),
//   a, headline (default true: the station's line lifts out as the headline), hide (0..1 extra slide-out), lit1 (extra glow of line 1),
//   onLine(i, rect) callback to draw something inside a line (e.g. the hook's warehouse strip) }  → { x, y, s, line(i) → [x0, y, x1] (screen) }
export function testCard(ctx, t, T, o = {}) {
  const S = testTimes(T), G = TEST;
  if (S.born == null || t < S.born - .2) return null;
  // visibility: born → away (tips out), back → … ; slides up out of the frame round every clip slot
  let vis = 1;
  if (S.away != null && S.back != null && t > S.away && t < S.back + 1.2) vis = t < S.back ? 1 - expoIn(span(t, S.away + .2, S.away + 1.1)) : expoOut(span(t, S.back, S.back + 1.1));
  let clipOut = 0;
  for (const c of Object.values(T.clips || {})) if (c.start > (S.corner ?? 0)) clipOut = Math.max(clipOut, smooth(span(t, c.start - 2.2, c.start - .8)) * (1 - smooth(span(t, c.end + .2, c.end + 1.4))));
  const final = S.final != null && t > S.final - .2, rel = S.release != null && t > S.release;
  // placement
  const C = G.corner, big = [960, 470, 1], corner = [C.x - G.w * C.s / 2, C.y + G.h * C.s / 2, C.s];
  let pl;
  if (o.at) pl = o.at;
  else if (t < S.corner) pl = big;
  else if (!final) { const k = sineIO(span(t, S.corner, S.corner + 1.6)); pl = [lerp(big[0], corner[0], k), lerp(big[1], corner[1], k), lerp(1, C.s, k)]; }
  else if (!rel) { const k = sineIO(span(t, S.final - .2, S.final + 1.4)); pl = [lerp(corner[0], 960, k), lerp(corner[1], 500, k), lerp(C.s, 1.15, k)]; }
  else { const k = sineIO(span(t, S.release, S.release + 1.6)); pl = [lerp(960, corner[0], k), lerp(500, corner[1], k), lerp(1.15, C.s, k)]; }
  let [cx, cy, sc] = pl;
  const outU = Math.max(clipOut, clamp(o.hide ?? 0), S.out != null ? smooth(span(t, S.out, S.out + 1.6)) : 0);
  cy -= outU * (cy + G.h * sc / 2 + 40);
  const a = (o.a ?? 1) * vis; if (a <= 0) return null;
  const x0 = cx - G.w * sc / 2, y0 = cy - G.h * sc / 2;
  const tip = (S.away != null && t > S.away && t < S.back) ? expoIn(span(t, S.away, S.away + 1.1)) : 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  ctx.translate(cx, cy); ctx.rotate(-.5 * tip); ctx.scale(sc * (1 - .4 * tip), sc * (1 - .4 * tip)); ctx.translate(-G.w / 2, -G.h / 2);
  const born = expoOut(span(t, S.born, S.born + 1.2));
  // the card
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(12, 14, G.w, G.h * born);
  ctx.fillStyle = lin(ctx, 0, 0, 0, G.h, [[0, mixHex(P.ind0, P.blue1, .28)], [1, mixHex(P.night1, P.ind0, .55)]]); ctx.fillRect(0, 0, G.w, G.h * born);
  ctx.fillStyle = P.halo0; ctx.fillRect(0, 0, G.w * born, 3);
  // FORECAST / ADVICE
  const fu = S.forecast != null ? rise(span(t, S.forecast + .3, S.forecast + 1.2)) : 0, au = S.advice != null ? rise(span(t, S.advice + .3, S.advice + 1.2)) : 0;
  if (fu > 0) { maskLine(ctx, [['FORECAST', 0]], 40, 50, 20, fu, { serif: false, weight: 600, col: GOLD.text, glow: false }); ctx.fillStyle = rgba(P.halo0, .8); ctx.fillRect(22, 70, 3, (G.ly[3] - 50) * expoOut(fu)); }
  ctx.fillStyle = rgba(P.cream, .45); ctx.fillRect(40, G.rule, (G.w - 80) * Math.max(fu, born > .99 ? .0 : 0, expoOut(span(t, S.born + .4, S.born + 1.4))), 1.5);
  if (au > 0) maskLine(ctx, [['ADVICE', 0]], 40, G.rule + 34, 20, au, { serif: false, weight: 600, col: GOLD.text, glow: false });
  // the lines
  const lineRect = [];
  for (let i = 0; i < 5; i++) {
    const y = G.ly[i], wr = S.write[i], wu = wr != null ? span(t, wr - .05, wr + .9) : 0, ru = expoOut(span(t, S.born + .3 + i * .08, S.born + 1.1 + i * .08));
    lineRect.push([G.x0, y, G.box + 20]);
    const dashed = S.dash != null && t > S.dash && i >= 2 && wu <= 0;
    ctx.strokeStyle = rgba(P.cream, dashed ? .55 : .28); ctx.lineWidth = 1.5; if (dashed) { ctx.setLineDash([9, 7]); ctx.lineDashOffset = -t * 8; }
    ctx.beginPath(); ctx.moveTo(G.x0, y + 12); ctx.lineTo(G.x0 + (G.box - 40 - G.x0) * ru, y + 12); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = rgba(P.cream, .5 * ru); ctx.lineWidth = 2; ctx.strokeRect(G.box - 18, y - 26, 36, 36);
    if (i === 0 && S.glow1 != null && t > S.glow1 - .3 && wu <= 0) { const g = expoOut(span(t, S.glow1, S.glow1 + .8)) * (S.away != null ? 1 - span(t, S.away, S.away + .6) : 1); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, G.x0, 0, G.box, 0, [[0, rgba(P.halo1, .0)], [.2, rgba(P.halo1, .35 * g)], [.8, rgba(P.halo1, .35 * g)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(G.x0 - 30, y - 34, G.box - G.x0, 50); ctx.restore(); }
    if (o.onLine) { ctx.save(); o.onLine(i, [G.x0, y - 34, G.box - 40 - G.x0, 50]); ctx.restore(); }
    if (wu > 0) {
      maskLine(ctx, [[String(i + 1), 0]], 50, y + 6, 46, rise(wu), { align: 'center' });
      maskLine(ctx, [[G.lines[i], 0]], G.x0, y, G.size, rise(span(wu, .15, 1)), { serif: false, weight: 600, col: P.cream, glow: false });
    }
    // the mark lands in the box (after the headline brought it back, or directly)
    const tm = S.mark[i]; if (tm != null && t > tm) mark(ctx, G.marks[i], G.box, y - 8, 30, span(t, tm + .15, tm + .7));
    // final pulses: ✓ ½ on their words, the three ✗ on income / timing / risk
    if (final && !rel) { const p = i < 2 ? S.pulse[i] : S.pulse[i]; if (p != null) { const k = bump(t, p - .1, 1.4); if (k > 0) halo(ctx, G.box, y - 8, 60, .55 * k, i < 2 ? P.halo1 : ROSE.mark, i < 2 ? P.core0 : P.cream); } }
  }
  // ADVICE fails its own test (c11)
  if (S.adviceMark != null && t > S.adviceMark) { const k = span(t, S.adviceMark + .2, S.adviceMark + 1); mark(ctx, 'cross', 150, G.rule + 26, 22, k);
    maskLine(ctx, [['FAILS ITS OWN TEST', 0]], 175, G.rule + 34, 20, rise(span(t, S.adviceMark + .5, S.adviceMark + 1.3)), { serif: false, weight: 600, col: ROSE.mark, glow: false }); }
  ctx.restore();
  // the headline: the station's line lifts out of the card (big, top centre), shows its mark + verdict, and goes back
  if (o.headline !== false && !final) for (let i = 0; i < 5; i++) {
    const ts = S.station[i], tv = S.verdict[i], tm = S.mark[i];
    const win = [[ts, ts != null ? ts + 4.2 : null], [tv != null ? tv - .25 : null, tm != null ? tm + 2.8 : null]];
    for (const [w0, w1] of win) {
      if (w0 == null || w1 == null || t < w0 || t > w1 + 1.2) continue;
      const up = sineIO(span(t, w0, w0 + 1.0)), dn = sineIO(span(t, w1, w1 + 1.1)), k = up * (1 - dn);
      const sx = x0 + (G.x0 + 80) * sc, sy = y0 + G.ly[i] * sc, hx = 960, hy = 132;
      const px = lerp(sx, hx, k), py = lerp(sy, hy, k), sz = lerp(G.size * sc, 46, k), ha = clamp(k * 3) * a;
      if (ha <= 0) continue;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= ha;
      const label = `${i + 1}  ${G.lines[i]}`, wl = measure(label, sz, false);
      const lx = lerp(px, hx - wl / 2, k);
      E.glowText(ctx, label, lx, py, { size: sz, col: P.cream, glow: k > .5 });
      if (tm != null && t > tm && w0 === win[1][0]) {
        mark(ctx, G.marks[i], lx + wl + sz * .9, py - sz * .32, sz * 1.1, span(t, tm, tm + .55));
        maskLine(ctx, [[G.verdicts[i], 0]], hx, py + 56, 26, rise(span(t, tm + .3, tm + 1.1)) * (1 - expoIn(dn)), { serif: false, weight: 600, align: 'center', col: G.marks[i] === 'cross' ? ROSE.mark : GOLD.text, glow: false });
      }
      ctx.restore();
    }
  }
  return { x: cx, y: cy, s: sc, line: (i) => [x0 + G.x0 * sc, y0 + G.ly[i] * sc, x0 + G.box * sc] };
}

// ======================================================================================================================== TEXTS (text-v2; the fact check wins)
// quoted: true = verbatim (curly quotes), false = paraphrase (no quotes). check: true = wording/date still open in the fact check (vo-v3).
export const QUOTES = {
  x: { lines: ['Saving money for the distant future is pointless', 'with the advent of super intelligent abundance.'], src: 'ELON MUSK ON X · OCT 29, 2026', quoted: true, check: true },
  wontmatter: { lines: ['It won’t matter.'], src: 'MOONSHOTS PODCAST', quoted: true },
  y2036: { lines: ['money won’t matter', 'in 2036'], src: 'THE ECONOMIST', quoted: true, check: true },
  pointless: { lines: ['pointless'], src: 'X', quoted: true },
  condition: { lines: ['If any of the things that we’ve said are true …'], src: 'ELON MUSK · MOONSHOTS', quoted: true },
  // MB1 (faktencheck.md §1): the "materials and electricity" line is NOT used (speaker unconfirmed); the card at ~1:24 is `wattage`
  wattage: { lines: ['currency will be measured in …', 'wattage and tonnage'], src: 'MUSK TO WALTER ISAACSON · OCT 2026', quoted: true },
  deflation: { lines: ['you will have deflation'], src: 'MUSK · MOONSHOTS', quoted: true },
  figured: { lines: ['it’s not like I got this all figured out'], src: 'MUSK · MOONSHOTS', quoted: true },
  isaacson: { lines: ['digital superintelligence probably improves', 'the output of goods and services by 20 to 30%'], src: 'MUSK TO WALTER ISAACSON · OCT 2026', quoted: true, check: true },
  uhi: { lines: ['Universal HIGH INCOME via checks issued', 'by the Federal government …'], src: 'MUSK ON X · APR 2026', quoted: true },   // K8: month only
  faster: { lines: ['AI is moving … 10 times faster', 'than government, maybe more'], src: 'MUSK · MOONSHOTS', quoted: true },
  issue: { lines: ['just issue people money'], src: 'MUSK · MOONSHOTS', quoted: true },
  ontime: { lines: ['… it’s a fair one … sometimes I’m not on time.', 'But I get it done.'], src: 'MUSK · APR 22, 2019', quoted: true },   // MB2 (I’m / I am: by ear)
  optimist: { lines: ['better to be an optimist and wrong', 'than a pessimist and right'], src: 'MUSK · MOONSHOTS', quoted: true },
  unrest: { lines: ['radical change, social unrest', 'and immense prosperity'], src: 'MUSK · MOONSHOTS', quoted: true },
};
export const SOURCES = {
  x: 'ELON MUSK ON X · OCT 29, 2026',
  moonshots: 'MOONSHOTS PODCAST · EP. 220 · JAN 2026',
  amazon: 'AMAZON · JULY 2025',
  bls: 'BLS CPI · JAN 2000 – DEC 2025',
  care: 'CARESCOUT 2025 · SSA 2026',
  allianz: 'ALLIANZ LIFE · 2025',
  trustees: 'SOCIAL SECURITY TRUSTEES REPORT 2026',
  ssa: 'SOCIAL SECURITY ADMINISTRATION',
};
// a small source line (bottom left, above the subtitles), rises and sinks
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s.toUpperCase(), 0]], o.x ?? 110, o.y ?? 880, o.size ?? 20, u, { serif: false, weight: 600, col: P.halo2, glow: false }); ctx.restore();
}
// a thin light bracket over a span with a label (u grows it from the middle)
export function bracket(ctx, x0, x1, y, u, text, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const m = (x0 + x1) / 2, hw = (x1 - x0) / 2 * expoOut(u);
  ctx.save(); ctx.strokeStyle = rgba(GOLD.line, .85); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(m - hw, y + 16); ctx.lineTo(m - hw, y); ctx.lineTo(m + hw, y); ctx.lineTo(m + hw, y + 16); ctx.stroke(); ctx.restore();
  if (text) maskLine(ctx, [[text, 0]], m, y - 18, o.size ?? 28, rise(span(u, .3, 1)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
}
// a pinned label: a line from the anchor up-right, then TEXT / sub (wipe in from below). u 0..1
export function label(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy;
  if (dx || dy) rule(ctx, x, y, x1, y1, smooth(clamp(u * 1.6)), { w: 2 });
  maskLine(ctx, [[l1, o.warm ?? 0]], x1 + (dx < 0 ? -measure(l1, o.size ?? 26, false) - 6 : 6), y1 - 10, o.size ?? 26, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (dx < 0 ? -measure(l2, (o.size ?? 26) * .72, false) - 6 : 6), y1 + 24, (o.size ?? 26) * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: GOLD.text, glow: false });
}
// the hook's question line (and its callbacks): big serif, rises on t0, sinks from t1
export function questionLine(ctx, t, t0, t1, o = {}) {
  const u = rise(span(t, t0 - .15, t0 + .7)) * (t1 != null ? 1 - expoIn(span(t, t1, t1 + .5)) : 1);
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [[o.text ?? '', o.warm ?? 0]], o.x ?? 960, o.y ?? 150, o.size ?? 64, u, { align: o.align ?? 'left' });
  ctx.restore();
}
// the film title as on thumbnail A: heavy grotesque caps (Inter Display Black, condensed), warm cream with a glow; each line rises out of
// its baseline mask (u 0..1, staggered), o.out 0..1 sinks it again. (x, y) = left end of the first baseline. o { size, lines, maxW, lead }
export function title(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 236, lines = o.lines ?? ['STOP SAVING', 'MONEY'], maxW = o.maxW ?? 1020, lead = o.lead ?? .88;
  TMEAS.font = `${size}px ${TITLE_FAMILY}`;
  const sx = Math.min(.86, maxW / Math.max(...lines.map((l) => TMEAS.measureText(l).width)));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .18, .82 + i * .18)) * (o.out != null ? 1 - sineIO(clamp(o.out * (1 + .12 * (lines.length - 1)) - i * .12)) : 1);
    if (ui <= 0) return;
    const k = (o.out ?? 0) > 0 ? sineIO(clamp(ui)) : expoOut(clamp(ui)), by = y + i * size * lead, dy = (1 - k) * size * 1.05;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 40, by - size * .95, maxW + 120, size * 1.02); ctx.clip();
    ctx.translate(x, by + dy); ctx.scale(sx, 1); ctx.font = `${size}px ${TITLE_FAMILY}`; ctx.textAlign = 'left';
    ctx.shadowColor = rgba(P.halo0, .75); ctx.shadowBlur = size * .22; ctx.fillStyle = mixHex(P.core0, P.halo2, .12); ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The frame grows out of a thing in the scene (o.from = [cx, cy, r] circle or { x, y, w, h } rectangle: a monitor, a newsreel screen) and
// shrinks back after the clip. Footage: <F26CLIPS or ROOT/clips>/<id>/f00001.jpg… (30 fps, 1680×945); metadata (offset, fit) from
// <ROOT>audio/clips.json when the audio agent writes it. Until then a PLACEHOLDER (never ship it).
// Quote-card fallback per clip (rights / footage problems): F26_C3=card (or F26_CARDS=C1,C3) draws the clip's transcript as a quote card in the
// same plate; the render step reads the same switch.
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
const CLIPS0 = {   // lower thirds (clips.json 10.11. "Bauchbinde"); len = clip length; quote = the card text if the clip is replaced
  C1: { name: 'Elon Musk', role: 'CEO, Tesla & SpaceX · Podcast “Moonshots”', year: '2026', len: 14.4, quote: ['Don’t worry about squirreling money away for retirement', 'in like 10 or 20 years. It won’t matter. …', 'If any of the things that we’ve said are true,', 'saving for retirement will be irrelevant.'] },
  C2: { name: 'Peter Diamandis', role: 'Host, “Moonshots”', year: '2026', len: 5.6, quote: ['Is that then taxed by the government', 'and redistributed as some level of income', 'as a UHI …'] },
  C3: { name: 'Elon Musk', role: 'CEO, Tesla · Tesla Autonomy Day', year: '2019', len: 6.4, quote: ['But next year for sure,', 'we will have over a million robotaxis on the road.'] },
  C4: { name: 'Daron Acemoglu', role: 'Economist, MIT · Nobel Prize 2024 · World Bank', year: 'June 2026', len: 6.25, quote: ['Perhaps. But again,', 'there is no evidence from history to show that.'] },
  C5: { name: 'Franklin D. Roosevelt', role: 'U.S. President', year: '1935', len: 12.6, quote: ['Young people have come to wonder what would be their lot', 'when they came to old age. The man with a job', 'has wondered how long the job would last.'] },
};
const CLIPS_JSON = [process.env.F26CLIPSJSON, ROOT + 'audio/clips.json'].find((f) => f && fs.existsSync(f));
const RAWMETA = CLIPS_JSON ? JSON.parse(fs.readFileSync(CLIPS_JSON, 'utf8')) : {};
export const CLIPMETA = Array.isArray(RAWMETA.clips) ? Object.fromEntries(RAWMETA.clips.map((c) => [c.id, c])) : RAWMETA;
export const CLIPS = Object.fromEntries(Object.entries(CLIPS0).map(([id, c]) => { const m = CLIPMETA[id] || {}; return [id, { ...c, ...(m.fit ? { fit: m.fit } : {}), card: !!m.card }]; }));
export const cardMode = (id) => process.env[`F26_${id}`] === 'card' || String(process.env.F26_CARDS || '').split(',').includes(id) || !!CLIPS[id]?.card;
const CLIPDIR = (process.env.F26CLIPS || ROOT + 'clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; const off = (CLIPMETA[id] || {}).offset || 0; return Math.max(1, Math.min(n, Math.floor((t - win.start - off) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
const CLIP_LEAD = 7;
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    if (cardMode(id)) continue;
    const win = clipWin(T, id); if (!win || t < win.start - CLIP_LEAD || t > win.end + .8) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function clipFrameAt(id, t, win) { const k = frameAt(id, t, win); return k ? frameCache.get(framePath(id, k)) || null : null; }
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
// o: { from, morph 0..1 (0 = the source shape, 1 = CLIP_RECT), dark 0..1, credits (false = none), label 0..1 }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], m = sineIO(clamp(o.morph ?? 1)), dark = clamp(o.dark ?? 0), asCard = cardMode(id);
  const f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  const cx = lerp(fr0.cx, R.x + R.w / 2, m), cy = lerp(fr0.cy, R.y + R.h / 2, m), w = lerp(fr0.w, R.w, m), h = lerp(fr0.h, R.h, m), rr = lerp(fr0.r, 14, m);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const fr = asCard ? null : clipFrameAt(id, t, win);
  if (fr) { const s = (info.fit === 'contain' ? Math.min : Math.max)(R.w / fr.width, R.h / fr.height) * (w / R.w), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else if (asCard) {   // QUOTE CARD fallback: the transcript in serif, lines rise with the slot
    ctx.fillStyle = rad(ctx, cx, cy, w * .7, [[0, rgba(P.blue0, .35 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) info.quote.forEach((l, i) => maskLine(ctx, [[(i === 0 ? '“' : '') + l + (i === info.quote.length - 1 ? '”' : ''), 0]], cx, cy - (info.quote.length - 1) * 34 + i * 68 + 10, 52 * (w / R.w), rise(span(t, win.start - .4 + i * .5, win.start + .5 + i * .5)) * (1 - dark), { align: 'center' }));
  } else {   // PLACEHOLDER (no footage yet): soft light, slow scan band, the slot id and a progress line. Never ship this.
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    const by = cy - h / 2 + ((t * .18) % 1) * h; ctx.fillStyle = rgba(P.cream, .04 * (1 - dark)); ctx.fillRect(cx - w / 2, by - 40, w, 80);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start - .6, win.start + .4) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 26;
    const nw = maskLine(ctx, [[info.name, 0]], R.x, by, 40, rise(lu), { glow: true });
    maskLine(ctx, [[`${info.role.toUpperCase()} · ${info.year.toUpperCase()}`, 0]], R.x + nw.w + 22, by - 2, 20, rise(lu), { serif: false, col: P.halo2, glow: false });
    maskLine(ctx, [[asCard ? 'QUOTE' : 'ORIGINAL FOOTAGE', 0]], R.x + R.w - measure(asCard ? 'QUOTE' : 'ORIGINAL FOOTAGE', 20, false), by - 2, 20, rise(lu), { serif: false, col: P.halo0, glow: false });
  }
  ctx.restore();
  return { cx, cy, w, h };
}

// ======================================================================================================================== CAMERA PATH
// camPath(t, K): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to F0), instead of stopping at
// each key like E.camAt. The first and last keys are arrivals. Use E.camAt for the expo dives into a light (the doors), camPath for the rest.
export function camPath(t, K, ref = F0) {   // ref: a card depth beyond every key's camera (log distance to it is interpolated)
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(ref - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: ref - Math.exp(out[2]) });
}
