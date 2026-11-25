// Film 73 · THE STONE — the Leitbild (thumbnail A) + the seam plates + the end screen (owned by the lead; builders import as S, never edit).
//
// The Leitbild: a night hill. On it one headstone, engraved "1985 –" and nothing after the dash; a golden crack of light runs down the stone
// (the hero light). You, small, in the yellow coat, stand at its foot and look up. Behind, on a lower ridge, a few dim old stones that carry
// TWO years each ("every generation before yours had to die"). It appears only at the four anchors (docs/MOTION.md §3):
//   1 hook (H.01–H.03) · 2 the turn "What happens to a world that was built around dying?" (c07: pull back, the town below lights up) ·
//   3 the punchline "So is yours the first generation" (c13) · 4 the end (Kernsatz, subscribe 2, end screen; c13).
// Everything else is THE LIFELINE stage (lib/f73_stage.mjs). Both share the sheet coordinates and the night ground, so the stone can turn
// into a drawing and its dash can run out as the lifeline without a cut (H.03 is the model for that hand-over).
//
//   stoneWorld(ctx, t, v, st)   v = view in sheet units ({ x, y, s }, HOME = thumbnail framing); st (all optional, 0..1 unless said):
//     crack     how far the crack is open (0 hairline … 1 wide, light pouring out) · crackGlow
//     drawing   the stone turns into a technical drawing (fill drains, cream outline, dimension lines) · dims (dimension lines only)
//     retract   the world sinks away (hills, old stones, the stone outline), leaving the night ground (the stage)
//     old       the old stones (default 1) · town (the town below the hill; lights = st.lit) · lit
//     ghost     [{ txt, a, gold }] faint years written where the death year would go (the punchline: 2032 … 2459)
//     you       false | { x, h, pose, dir, walk, a } (default: at the foot, looking up) · grass (foreground, default 1)
//   SEAM_HALF, creep(t, T, phrase)   the seam rule of film 69: a plate is drawn by BOTH chunks ±SEAM_HALF round the boundary phrase,
//                                    with the same slow push (creep), so the cut between the chunks is invisible.
//   plate2032 · plateTwoAnswers · plateTop · endScreen · END_TILES
import * as E from './f10_editorial.mjs';
import * as F from './f73_kit.mjs';
import * as X from './f73_stage.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, rad, lin, prng } = E;
const { GOLD, COOL, CREAM, LAMP, AGE } = F;
const TAU = Math.PI * 2;

export const HOME = { x: 960, y: 540, s: 1 };
export const STONE = { x: 1400, base: 846, w: 430, h: 590, rot: -.012 };
STONE.top = STONE.base - STONE.h;
export const ENGRAVE = { x: 1300, y: 566, size: 78, dash: [1384, 1436], blank: [1452, 1588] };   // "1985" right edge at x 1366
export const CRACK = [[1452, 262], [1438, 330], [1462, 396], [1430, 470], [1447, 532], [1418, 612], [1433, 690], [1400, 772], [1404, 846]];
export const YOU = { x: 1118, h: 128 };
export const hillY = (x) => STONE.base + 4 + ((x - STONE.x) / 900) ** 2 * 130;
const OLD = [   // the old stones on the ridge behind (layer d .72): x, height, width, the two years
  [430, 128, 112, '1889 – 1951'], [690, 104, 96, '1903 – 1972'], [905, 140, 118, '1921 – 1994'], [1905, 118, 104, '1932 – 2006'], [2120, 146, 122, '1947 – 2019'], [180, 112, 100, '1876 – 1940'],
];
const ridgeY = (x) => 742 + Math.sin(x * .0013 + .6) * 24 + Math.sin(x * .0047) * 6;

function stonePath(ctx, k = 1) {   // rounded headstone (arch top), in sheet units
  const { x, base, w, h } = STONE, r = w / 2, y0 = base - h * k;
  ctx.beginPath(); ctx.moveTo(x - r, base); ctx.lineTo(x - r, y0 + r); ctx.arc(x, y0 + r, r, Math.PI, 0); ctx.lineTo(x + r, base); ctx.closePath();
}
const stoneOutline = () => { const { x, base, w } = STONE, r = w / 2, top = STONE.top; const pts = [[x - r, base], [x - r, top + r]];
  for (let i = 0; i <= 30; i++) { const a = Math.PI + i / 30 * Math.PI; pts.push([x + Math.cos(a) * r, top + r + Math.sin(a) * r]); } pts.push([x + r, base]); return pts; };
const OUT = stoneOutline();

// the crack: a zigzag band whose width opens with o; gold core, warm halo (lighter)
function crack(ctx, t, o, glow = 1, s = 1, drain = 0) {
  const wob = (i) => E.drift(t * .8, 1.2, i);
  const w = (1.3 + 9 * Math.pow(clamp(o), 1.4)) / Math.sqrt(s);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [k, a, c] of [[6, .08, GOLD.halo], [2.8, .2, GOLD.halo], [1.5, .6, GOLD.body], [.6, 1, GOLD.core]]) {
    ctx.strokeStyle = rgba(c, a * glow * (.35 + .65 * clamp(o * 1.6 + .15))); ctx.lineWidth = w * k; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const y0 = lerp(CRACK[0][1], CRACK[CRACK.length - 1][1], sineIO(drain)); ctx.beginPath(); let st0 = false;
    CRACK.forEach(([x, y], i) => { if (y < y0) return; if (!st0) { const j = Math.max(0, i - 1), f = i ? clamp((y0 - CRACK[j][1]) / (y - CRACK[j][1])) : 0; ctx.moveTo(lerp(CRACK[j][0], x, f), y0); st0 = true; } ctx.lineTo(x + wob(i), y); }); ctx.stroke();
  }
  ctx.restore();
  halo(ctx, 1440, 520, 520, .3 * glow * (.15 + .85 * o), GOLD.halo, GOLD.core);
}

export function stoneWorld(ctx, t, v, st = {}) {
  const ret = sineIO(clamp(st.retract ?? 0)), drw = clamp(st.drawing ?? 0), cr = clamp(st.crack ?? 0), cg = st.crackGlow ?? 1;
  if (st.ground !== false) X.ground(ctx, t, v, { lx: 1440, ly: 560, pool: .85 - .3 * ret });
  const sink = 280 * ret, fade = 1 - ret, fs2 = fade * fade * fade;   // the stone itself goes faster than the hills
  // far hills (d .38)
  if (fade > 0) X.inView(ctx, X.layerView(v, .38), () => {
    ctx.save(); ctx.globalAlpha *= fade; ctx.translate(0, sink * .4);
    ctx.fillStyle = lin(ctx, 0, 700, 0, 1100, [[0, mixHex(P.night1, P.ind1, .55)], [1, P.night1]]);
    ctx.beginPath(); ctx.moveTo(-2000, 1400); for (let x = -2000; x <= 4000; x += 80) ctx.lineTo(x, 770 + Math.sin(x * .0016) * 26 + Math.sin(x * .0041 + 2) * 12); ctx.lineTo(4000, 1400); ctx.fill();
    ctx.restore();
  });
  // the ridge with the old stones (d .5)
  const old = (st.old ?? 1) * fade;
  if (old > 0) X.inView(ctx, X.layerView(v, .5), () => {
    ctx.save(); ctx.translate(0, sink * .5); ctx.globalAlpha *= fade;
    ctx.fillStyle = lin(ctx, 0, 780, 0, 1100, [[0, mixHex(P.night1, P.ind2, .55)], [1, P.night0]]);
    ctx.beginPath(); ctx.moveTo(-2000, 1500); for (let x = -2000; x <= 4000; x += 60) ctx.lineTo(x, ridgeY(x)); ctx.lineTo(4000, 1500); ctx.fill();
    ctx.globalAlpha *= old / Math.max(1e-6, fade);
    for (const [x, h, w, yrs] of OLD) {
      const by = ridgeY(x) + 8, top = by - h, r = w / 2;
      ctx.fillStyle = lin(ctx, x - r, 0, x + r, 0, [[0, mixHex(P.night1, P.blue2, .35)], [1, mixHex(P.night1, P.ind2, .3)]]);
      ctx.beginPath(); ctx.moveTo(x - r, by); ctx.lineTo(x - r, top + r * .7); ctx.quadraticCurveTo(x - r, top, x, top); ctx.quadraticCurveTo(x + r, top, x + r, top + r * .7); ctx.lineTo(x + r, by); ctx.fill();
      E.glowText(ctx, yrs, x, top + h * .42, { size: 24, serif: true, align: 'center', col: rgba(mixHex(CREAM, AGE.text, .5), .55), glow: false });
    }
    ctx.restore();
  });
  // the town below (d .75): houses in the valley between the ridge and the hill, LAMP windows (the turn anchor)
  const town = clamp(st.town ?? 0);
  if (town > 0 && fade > 0) X.inView(ctx, X.layerView(v, .75), () => {
    ctx.save(); ctx.globalAlpha *= town * fade; ctx.translate(0, sink * .75);
    const r = prng(7302);
    for (let i = 0; i < 60; i++) { const x = -1600 + i * 58 + r() * 30, y = 830 + r() * 40, w = 34 + r() * 30;
      if (x > 1900) break; F.house(ctx, t, x, y, w, { lit: clamp((st.lit ?? 1) * 1.6 - (i % 7) * .12) * (.55 + .45 * Math.sin(t * .7 + i)), roof: i % 3 ? 'gable' : 'flat' }); }
    ctx.restore();
  });
  // the near hill + the stone + you (d 1)
  X.inView(ctx, v, (s) => {
    ctx.save(); ctx.translate(0, sink);
    if (fade > 0) { ctx.save(); ctx.globalAlpha *= fade;
      ctx.fillStyle = lin(ctx, 0, 820, 0, 1300, [[0, mixHex(P.night1, P.ind2, .35)], [.3, P.night1], [1, P.night0]]);
      ctx.beginPath(); ctx.moveTo(-2400, 2200); for (let x = -2400; x <= 4400; x += 40) ctx.lineTo(x, hillY(x)); ctx.lineTo(4400, 2200); ctx.fill();
      // warm light the crack throws on the grass at the foot of the stone
      ctx.fillStyle = rad(ctx, 1430, STONE.base + 10, 520, [[0, rgba(GOLD.halo, .2 * cg * (.3 + .7 * cr))], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(800, 700, 1300, 400);
      ctx.restore(); }
    // the plinth (a low slab: reads as a headstone, not a pane)
    if (fade > 0) { ctx.save(); ctx.globalAlpha *= fade * (1 - .9 * drw); ctx.fillStyle = lin(ctx, 0, STONE.base - 6, 0, STONE.base + 30, [[0, mixHex(P.blue2, P.ind2, .55)], [1, mixHex(P.ind2, P.night0, .5)]]);
      ctx.beginPath(); ctx.roundRect(STONE.x - 262, STONE.base - 8, 524, 36, 4); ctx.fill(); ctx.restore(); }
    // the stone
    ctx.save(); ctx.translate(STONE.x, STONE.base); ctx.rotate(STONE.rot * (1 - drw)); ctx.translate(-STONE.x, -STONE.base);
    const fillA = (1 - .92 * drw) * fs2;
    if (fillA > 0) {
      ctx.save(); ctx.globalAlpha *= fillA; stonePath(ctx);
      ctx.fillStyle = lin(ctx, STONE.x - 215, 0, STONE.x + 215, 0, [[0, mixHex(P.blue2, P.ind2, .25)], [.5, mixHex(P.blue2, P.ind2, .45)], [1, mixHex(P.ind2, P.night1, .35)]]); ctx.fill();
      ctx.fillStyle = lin(ctx, 0, STONE.top, 0, STONE.base, [[0, rgba(CREAM, .06)], [.4, rgba(CREAM, 0)], [1, rgba(P.night0, .35)]]); ctx.fill();
      ctx.save(); ctx.clip();
      ctx.fillStyle = rad(ctx, 1440, 520, 420, [[0, rgba(GOLD.halo, .3 * cg * (.25 + .75 * cr))], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(1100, 200, 600, 700);
      E.dust(ctx, 7303, 90, STONE.x, 560, 200, 280, 0, .18, mixHex(P.blue2, CREAM, .3));   // stone texture (static grain of the rock)
      ctx.restore();
      // a soft rim on the lit edge
      ctx.strokeStyle = rgba(GOLD.line, .18 * cg); ctx.lineWidth = 3; stonePath(ctx); ctx.stroke();
      ctx.restore();
    }
    // engraving "1985 –": carved (dark letters, a warm lower-edge highlight)
    const ea = fs2 * (1 - .25 * drw);
    if (ea > 0) {
      const { x, y, size, dash } = ENGRAVE;
      ctx.save(); ctx.globalAlpha *= ea; ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = 'right';
      ctx.fillStyle = rgba(GOLD.line, .32 * (1 - drw)); ctx.fillText('1985', x + 66 + 1.5, y + 2);
      ctx.fillStyle = drw > 0 ? mixHex(mixHex(P.night0, P.ind1, .4), CREAM, drw) : mixHex(P.night0, P.ind1, .4); ctx.fillText('1985', x + 66, y);
      if (st.dash !== false) { ctx.fillStyle = rgba(GOLD.line, .3 * (1 - drw)); ctx.fillRect(dash[0], y - 23 + 2, dash[1] - dash[0], 5);
      ctx.fillStyle = drw > 0 ? mixHex(mixHex(P.night0, P.ind1, .4), CREAM, drw) : mixHex(P.night0, P.ind1, .4); ctx.fillRect(dash[0], y - 23, dash[1] - dash[0], 5); }
      for (const g of st.ghost || []) if (g.a > 0) F.goldText(ctx, [[g.txt, g.gold ?? .7]], (ENGRAVE.blank[0] + ENGRAVE.blank[1]) / 2, y + (g.dy ?? 0), g.size ?? 54, F.rise(g.a), { serif: true, align: 'center', glow: true });
      ctx.restore();
    }
    // the drawing: cream outline + dimension lines
    if (drw > 0) {
      X.drawPath(ctx, OUT, sineIO(drw), { col: rgba(CREAM, .85), a: fs2, w: 2.2 / s, glow: 6 / s * fs2, glowCol: CREAM });   // a (globalAlpha) also fades the glow
      const dm = span(st.dims ?? drw, .35, 1) * fs2;
      if (dm > 0) {
        const { x, base, w, top } = STONE, dx = x + w / 2 + 56, dy = base + 34;
        X.drawPath(ctx, [[dx, base], [dx, top]], dm, { col: rgba(CREAM, .55), w: 1.4 / s });
        for (const yy of [base, top]) X.drawPath(ctx, [[dx - 12, yy], [dx + 12, yy]], dm, { col: rgba(CREAM, .55), w: 1.4 / s });
        X.drawPath(ctx, [[x - w / 2, dy], [x + w / 2, dy]], dm, { col: rgba(CREAM, .55), w: 1.4 / s });
        for (const xx of [x - w / 2, x + w / 2]) X.drawPath(ctx, [[xx, dy - 12], [xx, dy + 12]], dm, { col: rgba(CREAM, .55), w: 1.4 / s });
        X.drawPath(ctx, [[x + w / 2 + 6, top], [dx + 18, top]], dm, { col: rgba(CREAM, .25), w: 1 / s, dash: [5, 5] });
        // the centre line + a section mark through the engraving
        X.drawPath(ctx, [[x, top - 40], [x, base + 20]], span(dm, .3, 1), { col: rgba(CREAM, .22), w: 1 / s, dash: [18, 6, 3, 6] });
      }
    }
    ctx.restore();
    // the crack (on top of everything of the stone); crackDrain 0..1: the light runs out of it from the top down
    if (cr > 0 || cg > 0) { ctx.save(); ctx.globalAlpha *= (st.crackA ?? 1) * (1 - clamp(st.crackDrain ?? 0)); crack(ctx, t, cr, cg * (1 - .5 * drw), s, st.crackDrain ?? 0); ctx.restore(); }
    ctx.restore();
    // you at the foot of the stone, looking up (you do NOT sink with the world: you are the carrier into the stage; st.you.y overrides)
    if (st.you !== false) {
      const y = { x: YOU.x, h: YOU.h, pose: 'look', dir: 1, ...(st.you || {}) }, fy = y.y ?? hillY(y.x) + 2;
      if ((y.a ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= (y.a ?? 1);
        halo(ctx, y.x + 40, fy - y.h * .6, y.h * 1.3, .14 * cg * fade, GOLD.halo, GOLD.core);
        F.du(ctx, y.x, fy, y.h, { pose: y.pose, dir: y.dir, walk: y.walk, look: y.look }); ctx.restore(); }
    }
  });
  // foreground grass (d 1.18), dark, blurred by distance
  const gr = (st.grass ?? 1) * fade;
  if (gr > 0) X.inView(ctx, X.layerView(v, 1.18), () => {
    ctx.save(); ctx.globalAlpha *= gr; ctx.translate(0, sink * 1.2); const r = prng(7304); ctx.fillStyle = P.night0;
    ctx.beginPath(); ctx.moveTo(-1200, 1500); for (let x = -1200; x <= 3200; x += 30) ctx.lineTo(x, 1046 + Math.sin(x * .004) * 14 - (r() < .3 ? 8 + r() * 12 : r() * 5)); ctx.lineTo(3200, 1500); ctx.fill();
    ctx.restore();
  });
}

// ======================================================================================================================== SEAMS
// A group boundary sits on a phrase. Both chunks draw the plate function for ±SEAM_HALF around it, the view creeps in by CREEP per second
// from (phrase − SEAM_HALF): the left builder ends on it, the right builder starts on it, and the frames match.
export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const breathe = (t) => ({ dx: E.drift(t, 4, 3), dy: E.drift(t, 2.5, 7) });

// Lead → B1 at 'The date comes from' (c01 → c02): plate2032. THE LIFELINE across (born from the dash of "1985 –"; 1985 at its left end, its
// end tick lifted off, the line runs open to the right); REPAIR left (the body drawing, joints gold), the big gold 2032 on its tick in the
// middle, COPY right (the computer with the virtual fly, walking); you small at the left, looking right.
// draw2032(ctx, t, v, q) draws it with per-element states (c01 builds up to it; all default to the finished plate):
//   q.line (lifeline options + x0, x1, y) · q.year1985 · q.body { u, fix, worn } · q.repair · q.tick · q.y2032 · q.comp { u, on } · q.fly { u, x, y, size }
//   q.copy · q.you { x, dir, pose, walk, a } · q.pool [lx, ly, pool] · q.mid(ctx, s) hook between the line and the objects · q.top(ctx, s)
export const P2032 = { line: 846, x0: 150, x1: 1700, age: 1350, openTo: 2600, body: 600, year: 1040, comp: 1500, compW: 300, you: 440, view: { x: 960, y: 666, s: 1 } };
export const LINE2032 = { open: 1, openTo: P2032.openTo, end: 1, lift: 1, age: P2032.age, ageU: 0 };
export function draw2032(ctx, t, v, q = {}) {
  const Q = P2032, pl = q.pool ?? [Q.year, 686, 1];
  X.ground(ctx, t, v, { lx: pl[0], ly: pl[1], pool: pl[2] });
  X.inView(ctx, v, (s) => {
    const L = { ...LINE2032, ...(q.line || {}) }; X.lifeline(ctx, t, L.x0 ?? Q.x0, L.x1 ?? Q.x1, L.y ?? Q.line, s, L);
    X.yearTag(ctx, '1985', Q.x0, Q.line, q.year1985 ?? 1, s, { below: true, size: 34 });
    if (q.mid) q.mid(ctx, s);
    const b = { u: 1, fix: 1, worn: 0, ...(q.body || {}) };
    F.bodyDrawing(ctx, t, Q.body, Q.line - 6, 330, { s, u: b.u, fix: b.fix, worn: b.worn, w: 2.4 });
    X.label(ctx, F.SOURCES.repair, Q.body, Q.line + 58, q.repair ?? 1, { size: 26, gold: .6 });
    X.yearTag(ctx, '', Q.year, Q.line, q.tick ?? 1, s, { gold: 1 });
    X.big(ctx, F.SOURCES.y2032, Q.year, Q.line - 60, 200, q.y2032 ?? 1, { gold: 1 });
    const c = { u: 1, on: 1, ...(q.comp || {}) }, sc = F.computer(ctx, t, Q.comp, Q.line - 4, Q.compW, { s, u: c.u, on: c.on });
    const fl = { u: 1, size: 40, ...(q.fly || {}) };
    if (sc && fl.u > 0) F.fly(ctx, t, fl.x ?? sc.cx, fl.y ?? sc.cy + 4, fl.size, { style: 'virtual', s, walk: t * 5, rot: Math.PI / 2, a: fl.u });
    X.label(ctx, F.SOURCES.copy, Q.comp, Q.line + 58, q.copy ?? 1, { size: 26, col: COOL.text });
    const y = { x: Q.you, dir: 1, pose: 'look', a: 1, ...(q.you || {}) };
    if (y.a > 0) { ctx.save(); ctx.globalAlpha *= y.a; F.du(ctx, y.x, Q.line - 2, y.h ?? 92, { pose: y.walk != null ? undefined : y.pose, dir: y.dir, walk: y.walk }); ctx.restore(); }
    if (q.top) q.top(ctx, s);
  });
}
export const view2032 = (t, k = 1) => { const b = breathe(t), V = P2032.view; return { x: V.x + b.dx, y: V.y + b.dy, s: V.s * k }; };
export function plate2032(ctx, t, T) { draw2032(ctx, t, view2032(t, creep(t, T, 'The date comes from'))); }

// B1 → B2 at 'Which brings back' (c05 → c06): plateTwoAnswers. Two answers, one above the other: REPAIR (gold) and COPY (cool, dashed);
// both beads tremble in the middle. B2 lets them merge back into the one question.
export const PTWO = { x: 960, y1: 450, y2: 650, w: 640 };
export function plateTwoAnswers(ctx, t, T) {
  const k = creep(t, T, 'Which brings back'), b = breathe(t), v = { x: 960 + b.dx, y: 540 + b.dy, s: k }, Q = PTWO;
  X.ground(ctx, t, v, { lx: Q.x, ly: 540 });
  X.inView(ctx, v, () => {
    X.label(ctx, F.SOURCES.repair, Q.x, Q.y1 - 62, 1, { size: 26, gold: .7 });
    F.answer(ctx, t, Q.x, Q.y1, Q.w, .02 * Math.sin(t * .9), { tremble: 6 });
    X.label(ctx, F.SOURCES.copy, Q.x, Q.y2 - 62, 1, { size: 26, col: COOL.text });
    F.answer(ctx, t, Q.x, Q.y2, Q.w, -.03 + .02 * Math.sin(t * .8 + 1), { cool: true, tremble: 6 });
  });
}

// B2 → B3 at 'And at the very top' (c09 → c10): plateTop. The lifeline runs, steps up into a ledge and stays up there; one figure stands
// on the ledge, newcomers wait below on the line.
export const PTOP = { y: 760, ledge: 430, x0: 120, s0: 760, s1: 1180, x1: 1800, holder: 960, wait: [1330, 1430, 1530, 1630] };
export const topPath = (Q = PTOP) => [[Q.x0, Q.y], [Q.s0, Q.y], [Q.s0, Q.ledge], [Q.s1, Q.ledge], [Q.s1, Q.y], [Q.x1, Q.y]];
export function plateTop(ctx, t, T) {
  const k = creep(t, T, 'And at the very top'), b = breathe(t), v = { x: 960 + b.dx, y: 560 + b.dy, s: k }, Q = PTOP;
  X.ground(ctx, t, v, { lx: Q.holder, ly: Q.ledge - 80 });
  X.inView(ctx, v, (s) => {
    const pts = topPath(Q);
    F.goldSpan(ctx, pts, 0, 1, { w: 3.2 / s, spark: false });
    halo(ctx, Q.holder, Q.ledge - 70, 260, .5, GOLD.halo, GOLD.core);
    F.person(ctx, Q.holder, Q.ledge - 2, 150, { pose: 'stand', dir: 1, light: 1 });
    Q.wait.forEach((x, i) => F.person(ctx, x, Q.y - 2, 112 + (i % 2) * 8, { pose: i === 0 ? 'look' : 'stand', dir: -1 }));
  });
}

// ======================================================================================================================== END SCREEN (last 15 s)
// The Leitbild again, calm: the stone high in the frame (centre), the crack open and warm, you at its foot, the old stones on the ridge,
// the town's lights below. The lower half stays quiet for the two YouTube tiles + the subscribe circle. A slow pull-back, only light moves.
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
export const END_VIEW = { x: 1360, y: 820, s: .62 };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, q = Math.max(0, t - t0), k = 1 - .0045 * q, b = breathe(t);
  const v = { x: END_VIEW.x + b.dx, y: END_VIEW.y + b.dy, s: END_VIEW.s * k };
  stoneWorld(ctx, t, v, { crack: .85, town: 1, lit: 1, you: { pose: 'look' } });
}
