// Film 72 · B1 · c02–c05 as ONE take ('There are three obvious suspects' → 'Ask the people who sell them', 56.4 → 219.2 s on the real VO).
// Owned by builder B1 (scenes/sc02–sc05.mjs import it; nobody else). One draw(ctx, t) for the whole group: the inner chunk boundaries
// (c02|c03, c03|c04, c04|c05) are seamless by construction, because both sides call the same function of t. The scene files only cut the
// take into their entries; the shot tables live in their headers.
// Hard cuts: ONE planned world change (W, shots.md 1.08 Kauai) on a rhyming gold dot (same screen place on both sides) · the clip slots
// C1 / C2 grow out of a carrier (the studio lamp's pool, Harris' name tag) and fold back into one (the pool, the words RIGHT NOW).
// Seams with the lead / B2: starts on S.plateList (c01 hands it over at 'There are three obvious suspects', the view keeps its 4 %/s creep
// and eases it out), ends on S.plateBunker (from 'Ask the people who sell them' − SEAM_HALF the plate itself, the frames before converge
// on it exactly: same view, same objects).
// Strings: F.SOURCES keys wherever one exists; the few words that are not in the kit are in LOCAL below (named in the report).
import * as E from './f10_editorial.mjs';
import * as F from './f72_kit.mjs';
import * as S from './f72_world.mjs';
import * as X from './f72_stage.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, halo, lin, prng } = E;
const { GOLD, COOL, CREAM, PAPER, CONCRETE, SOIL, SOURCES: SRC } = F;
const LY = X.LINE_Y, TAU = Math.PI * 2;
const L2 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const quad = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];
const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));   // a label: rises at a, sinks behind its mask before b
const io = (t, a0, a1, b0, b1) => span(t, a0, a1) * (1 - span(t, b0, b1));

// words that are not in F.SOURCES (said in the report)
export const LOCAL = {
  floorPlans: 'IN THE FLOOR PLANS', real: 'REAL', bunker: 'BUNKER', basement: 'BASEMENT', theo: 'THEO VON', reasons: 'REASONS',
  today: 'TODAY', beingBuilt: 'BEING BUILT', smarter: 'SMARTER THAN ANY OF US', everything: 'AT EVERYTHING', thingsPass: 'THINGS THAT PASS',
  stillOut: 'STILL OUT THERE', optional: 'OPTIONAL', close: 'ANYWHERE CLOSE?', buildRight: 'BUILD IT RIGHT', ethicist: 'FORMER DESIGN ETHICIST, GOOGLE',
  year26: '2026',
};

// ------------------------------------------------------------------------------------------------ the list in card units
const LW = F.LIST.w, LH = F.LIST.head + F.LIST.row * 4 + 36, ROT = -.012;
const rowY = (i) => F.LIST.head + F.LIST.row * i + F.LIST.row * .66, TX = F.LIST.pad + 86;
const rowW = (txt) => F.measure(txt, 50, false, 700) + txt.length * 50 * .03;
// card units → screen for a list at sheet (L.x, L.y), size L.s
function listMat(v, L) {
  const [sx, sy] = X.toScreen(v, L.x, L.y), k = L.s * v.s, c = Math.cos(ROT) * k, s = Math.sin(ROT) * k;
  return { a: c, b: s, c: -s, d: c, e: sx - c * LW / 2 + s * LH / 2, f: sy - s * LW / 2 - c * LH / 2, k };
}
const apply = (m, x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
// a verdict word at the right of row i (card units, size ≥ 22 px on screen), revealed from the left: rev 0..1 of the text width, rev0 = the
// share revealed first (REAL → REAL, BUT OLD)
function verdictAt(ctx, t, m, i, text, u, rev = 1, size = 40) {
  if (u <= 0) return;
  const tw = F.measure(text, size, false, 700) + size * text.length * .08, x = LW - F.LIST.pad - 10, x0 = x - tw;
  ctx.save(); ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
  ctx.beginPath(); ctx.rect(x0 - 6, rowY(i) - 60, (tw + 16) * clamp(rev), 90); ctx.clip();
  F.verdict(ctx, t, x, rowY(i) - 6, text, u, { size, align: 'right2', ink: true });
  ctx.restore();
}
// row i's name leaves the card: from its place on the list to a title in screen space (fx, fy centre-baseline, fs = scale of 50-unit text)
function liftRow(ctx, m, i, txt, u, fx, fy, fs, big = 0, col0 = PAPER.ink) {
  if (u <= 0) return;
  const k = quartIO(u), bs = 1 + .14 * big, ox = TX, oy = rowY(i) - 18 + bs * 18;
  const [sx, sy] = apply(m, ox, oy), s0 = m.k * bs, tw = rowW(txt);
  const x = lerp(sx, fx - tw * fs / 2, k), y = lerp(sy, fy, k) - Math.sin(Math.PI * k) * 40, sc = lerp(s0, fs, k), r = lerp(ROT, 0, k);
  ctx.save(); ctx.setTransform(sc * Math.cos(r), sc * Math.sin(r), -sc * Math.sin(r), sc * Math.cos(r), x, y);
  E.glowText(ctx, txt, 0, 0, { size: 50, weight: 700, spacing: .03, col: mixHex(col0, CREAM, sineIO(span(u, .15, .7))), glow: false });
  ctx.restore();
}
// a title made by liftRow, later sinking behind its mask (out 0..1)
function titleOut(ctx, txt, fx, fy, fs, out) {
  if (out >= 1) return;
  const tw = rowW(txt) * fs;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(fx - tw, fy - 60 * fs, tw * 2, 72 * fs); ctx.clip();
  ctx.setTransform(fs, 0, 0, fs, fx - tw / 2, fy + sineIO(out) * 64 * fs);
  E.glowText(ctx, txt, 0, 0, { size: 50, weight: 700, spacing: .03, col: CREAM, glow: false });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ small drawings
const CONCRETE_DEEP = CONCRETE.deep;
// a storm cloud (flat, grey-blue), x = centre, y = its flat bottom; o.rain 0..1, o.rainTo (sheet y where the rain stops), o.a
function cloud(ctx, t, x, y, w, o = {}) {
  const h = w * .42, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if ((o.rain ?? 0) > 0) {
    const r = prng(7311), L = (o.rainTo ?? y + 200) - y;
    ctx.strokeStyle = rgba(mixHex(CREAM, COOL.line, .5), .45 * o.rain); ctx.lineWidth = 1.6 / (o.s ?? 1); ctx.beginPath();
    for (let i = 0; i < 18; i++) { const xx = x - w * .38 + i * w * .76 / 17 + (r() - .5) * 8, ph = (t * 1.7 + r()) % 1, y0 = y + 6 + ph * L, y1 = Math.min(y0 + 26, y + L);
      if (y1 > y0) { ctx.moveTo(xx - ph * L * .12, y0); ctx.lineTo(xx - ph * L * .12 - (y1 - y0) * .12, y1); } }
    ctx.stroke();
  }
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, mixHex(P.ind2, CONCRETE.lit, .45)], [1, mixHex(P.night1, CONCRETE.shade, .7)]]);
  ctx.beginPath();
  for (const [dx, dy, rr] of [[-.3, -.32, .19], [-.08, -.56, .25], [.19, -.42, .22], [.36, -.2, .14], [-.42, -.14, .1]]) { ctx.moveTo(x + dx * w + rr * w, y + dy * h); ctx.arc(x + dx * w, y + dy * h, rr * w, 0, TAU); }
  ctx.rect(x - w * .44, y - h * .3, w * .86, h * .3); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .25); ctx.lineWidth = 1.4 / (o.s ?? 1); ctx.beginPath(); ctx.arc(x - w * .08, y - h * .56, w * .25, -2.6, -.6); ctx.stroke();
  ctx.restore(); ctx.beginPath();
}
// a researcher from behind, seated (as in c01)
function seated(ctx, x, y, h, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; const ink = mixHex(P.night1, P.ind2, .55);
  ctx.fillStyle = rgba(mixHex(P.blue1, CREAM, .2), .4); ctx.beginPath(); ctx.ellipse(x, y - h * .9, h * .1, h * .11, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(x - h * .24, y - h * .22); ctx.quadraticCurveTo(x - h * .24, y - h * .7, x, y - h * .72); ctx.quadraticCurveTo(x + h * .24, y - h * .7, x + h * .24, y - h * .22); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y - h * .88, h * .1, h * .11, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, CONCRETE_DEEP, .4); ctx.beginPath(); ctx.roundRect(x - h * .28, y - h * .42, h * .56, h * .42, h * .04); ctx.fill();
  ctx.restore();
}
// a name tag on a small stand (paper card), x = centre, yb = the line it stands on; lines [[text, size, weight, col]], u rises it out of the line
function nameTag(ctx, x, yb, w, h, lines, u, s = 1) {
  if (u <= 0) return null; const k = expoOut(u), y0 = yb - 22 - h;
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, yb - h - 200, w * 2, h + 200); ctx.clip(); ctx.translate(0, (1 - k) * (h + 30));
  ctx.fillStyle = mixHex(P.night1, CONCRETE.shade, .6); ctx.beginPath(); ctx.moveTo(x - 36, yb); ctx.lineTo(x + 36, yb); ctx.lineTo(x + 14, yb - 24); ctx.lineTo(x - 14, yb - 24); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(x - w / 2 + 6, y0 + 8, w, h);
  ctx.fillStyle = lin(ctx, x - w / 2, y0, x + w / 2, y0 + h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(x - w / 2, y0, w, h, 5); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2 / s; ctx.stroke();
  let yy = y0 + 18;
  for (const [txt, size, wt, col, lu] of lines) { yy += size * 1.25; if ((lu ?? 1) > 0) F.maskLine(ctx, [[txt, 0]], x - w / 2 + 30, yy, size, F.rise(lu ?? 1), { serif: false, weight: wt, col, glow: false, spacing: .04 }); }
  ctx.restore();
  return { x0: x - w / 2, y0: y0 + (1 - k) * (h + 30), w, h };
}
// the hatch rising out of the line (clipped at the line)
function hatchUp(ctx, t, x, w, u, o) {
  if (u <= 0) return; const k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w * 2, LY - 400, w * 4, 400 + 2); ctx.clip(); ctx.translate(0, (1 - k) * 30);
  F.hatch(ctx, t, x, LY, w, { tilt: .075, ...o }); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ Kauai (outline, unit radius; north up)
const KAUAI = [[-1, -.05], [-.95, -.35], [-.76, -.6], [-.46, -.78], [-.16, -.88], [.12, -.93], [.22, -.84], [.3, -.86], [.42, -.93], [.63, -.8], [.83, -.55],
  [.95, -.26], [.99, .05], [.93, .35], [.79, .6], [.6, .78], [.35, .9], [.06, .95], [-.25, .9], [-.55, .82], [-.78, .67], [-.93, .45], [-1, .2]];
const KRX = 330, KRY = 262, KDOT = [.36, -.8];   // the ranch: north shore, near Kilauea
function resample(pts, n) {   // closed polyline → n points by arc length
  const P2 = [...pts, pts[0]], L = [0]; for (let i = 1; i < P2.length; i++) L.push(L[i - 1] + Math.hypot(P2[i][0] - P2[i - 1][0], P2[i][1] - P2[i - 1][1]));
  const out = []; let j = 1; for (let k = 0; k < n; k++) { const d = L[L.length - 1] * k / n; while (L[j] < d) j++; const f = (d - L[j - 1]) / (L[j] - L[j - 1]); out.push(L2(P2[j - 1], P2[j], f)); }
  return out;
}
const KN = 160, KPTS = resample(KAUAI, KN);   // starts at the west point, runs over the north (top) to the east
const KTOP = KPTS.findIndex((p, i) => i > 10 && p[0] > .985) || KN / 2;   // index of the east point

// ======================================================================================================================== THE TAKE
const CACHE = new WeakMap();
export function b1Take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, n = 0, after = 56) => T.G(p, n, after);
  const A = {
    sus: G('There are three obvious suspects'), suspects: G('suspects'), bomb: G('The bomb'), mach: G('The machine'), chaos: G('chaos along'),
    fourth: G('The fourth is'), plans: G('floor plans'), first: G('The bomb first'), door: G('That door filled'), concrete: G('concrete is real'),
    hawaii: G("It's in Hawaii"), under: G('Under Mark'), shelter: G('underground shelter'), bigger: G('bigger than most'), says: G('He says'),
    storms: G('for storms'), words: G('In his words'), little: G('a little shelter'), basement: G('like a basement'), fair: G('Fair enough'),
    owners: G('The owners'), wordB: G('word bunker'), last: G('Last year, the comedian'), theo: G('Theo Von'), openai: G('OpenAI whether'),
    heres: G("Here's Sam"), bombs: G('Bombs'), sell: G('The people who sell'), war: G('War'), pand: G('Pandemics'), real2: G('So the bomb is real'),
    oldest: G('oldest reason'), newR: G('And something here'), thisYear: G('This year, bunker'), adding: G('began adding'), artif: G('Artificial intelligence', 0, 120),
    isit: G('Is it the machine'), sense: G('It would make sense'), panel: G('A panel of'), hundred: G('a hundred experts'), cyber: G('real cyberattacks'),
    todays: G("That's today's"), picture: G('Now picture'), racing: G('racing to build'), smarter: G('Smarter than any'), every: G('at everything'),
    say: G('Say that machine'), aBunker: G('A bunker is built'), pass: G('things that pass'), storm: G('A storm', 0, 148), fallout: G('Fallout'), war2: G('A war', 0, 150),
    dpass: G("That machine doesn't"), oneDay: G('One day the door'), still: G("And it's still out"), ifm: G('And if the machine'), well: G('turns out well'),
    nobody: G('nobody needs a'), head: G('The head of OpenAI has'), none: G('None of this'), begin: G('And that bunker from'), sci: G('The scientist who'),
    ofc: G('Of course', 0, 170), optW: G('Optional', 0, 178), some: G('Some scientists doubt'), anyw: G('anywhere close'), near: G('Near or far'),
    logic: G('the logic holds'), only: G('The only protection'), right: G('build it right'), out: G('Out here'), down: G('Not down there'),
    cross: G('Cross the machine'), offl: G('off the list', 0, 192), why: G('But then why'), tristan: G('Tristan Harris used'), google: G('Google', 0, 199),
    todayH: G('Today he'), spring: G('This spring he'), rnow: G('Right now', 0, 212), names: G('He names no'), ifRight: G("But if he's right"),
    good: G('good for something'), ask: G('Ask the people who sell'),
  };
  A.real = G('real', 0, A.door); A.hawaiiW = G('Hawaii', 0, A.hawaii); A.houses = G('houses', 0, A.under); A.wordBunker = G('bunker', 0, A.wordB);
  A.not = G('Not', 0, A.bombs); A.real2w = G('real', 0, A.real2); A.intel = G('intelligence', 0, A.artif); A.machQ = G('machine', 0, A.isit);
  A.buildW = G('build', 0, A.racing); A.openW = G('open', 0, A.oneDay); A.far = G('far', 0, A.near + .2); A.wrong = G('wrong', 0, A.none);
  const C1 = T.clip('C1'), C2 = T.clip('C2');
  const t0 = A.sus, tTake = t0 + S.SEAM_HALF, tPlate = A.ask - S.SEAM_HALF;
  const tW = A.hawaiiW + .5;                       // the one hard cut (W, 1.08): the gold dot in the sky → the dot on the map of Kauai
  const tMorph0 = A.under + .75, tMorph1 = tMorph0 + 1.75;   // the island's coast straightens into the meadow line (land → the earth)

  // ---------------------------------------------------------------- the view (sheet units): calm, pans ≥ 1.6 s, zoom ≤ ×1.1
  const VL = S.PLIST.view, VS = { x: 960, y: 630, s: 1 }, V2 = { x: 960, y: 470, s: 1 }, V3 = { x: 960, y: 520, s: 1 };
  const VD = [
    [t0 - S.SEAM_HALF, { ...VL, s: 1 }], [tTake, { ...VL, s: 1 + S.CREEP }], [tTake + 1.2, { ...VL, s: 1.072 }], [tTake + 3, { ...VL, s: 1.085 }],
    [A.first + .3, { ...VL, s: 1.085 }], [A.door + .9, VS], [A.last + .2, VS], [A.last + 2.0, V2],
    [A.say + 2.3, V2], [A.aBunker + 1.7, V3], [A.ifRight - .1, V3], [tPlate - 1.0, S.PBUNK.view],
  ];
  const view = (t) => {
    if (t < tTake) return S.viewList(t, S.creep(t, T, 'There are three obvious suspects'));
    const v = X.viewPath(t, VD), b = S.breathe(t); return { x: v.x + b.dx, y: v.y + b.dy, s: v.s };
  };
  // the pool of light (sheet): the list → the section → the dot → the meadow → the studio → the page → the table → the bunker → the board → the plate
  const PL = S.PLIST_POOL;
  const PK = [[0, [PL.lx, PL.ly, PL.pool]], [A.first, [PL.lx, PL.ly, PL.pool]], [A.door + .8, [960, 640, .8]], [tW - .3, [1080, 430, .8]], [tMorph1, [960, 560, .85]],
    [A.last + 1.5, [960, 450, .85]], [A.sell + 1, [800, 380, .85]], [A.isit, [1300, 350, .85]], [A.panel + .5, [960, 300, .85]], [A.smarter, [1200, 300, .85]],
    [A.aBunker + 1, [960, 520, .8]], [A.begin + 1, [960, 460, .85]], [A.some + 1, [960, 420, .85]], [A.cross, [960, 360, .85]], [A.tristan + 1, [960, 450, .85]],
    [tPlate - 1.0, [1040, 700, .8]], [tPlate + 5, [1040, 700, .8]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [a0, a] = PK[i], [a1, b] = PK[i + 1], u = sineIO(span(t, a0, a1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- c02 · THE LIST (1.01–1.06)
  const L1 = { x: S.PLIST.x, y: S.PLIST.y, s: S.PLIST.s };
  const sink1 = (t) => sineIO(span(t, A.first + .35, A.first + 1.95));          // the list sinks into the line
  const lift1 = (t) => span(t, A.first, A.first + 1.3);                           // row 1 lifts out as the station title THE BOMB
  const TITLE = { x: 960, y: 118, fs: 1.1 };
  const rows1 = (t) => {
    const l1 = lift1(t);
    return [
      { num: lerp(.3, 1, span(t, A.suspects - .55, A.suspects - .15)), write: l1 > 0 ? 0 : span(t, A.bomb - .05, A.bomb + .55), lit: .7 * io(t, A.bomb, A.bomb + .3, A.mach - .2, A.mach + .3) },
      { num: 1, q: 1 - span(t, A.mach, A.mach + .5), lit: io(t, A.mach, A.mach + .35, A.chaos - .3, A.chaos + .2) },
      { num: lerp(.3, 1, span(t, A.suspects - .35, A.suspects + .05)), write: span(t, A.chaos - .1, A.chaos + .5), lit: .7 * io(t, A.chaos, A.chaos + .3, A.fourth, A.fourth + .4) },
      { num: 1, redact: 1, ghost: span(t, A.plans - .15, A.plans + .7), lit: .45 * io(t, A.fourth, A.fourth + .4, A.first - .2, A.first + .3) },
    ];
  };
  function listPart(ctx, t, v) {   // sheet layer
    const sk = sink1(t); if (sk >= 1) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip();
    F.list(ctx, t, L1.x, L1.y + sk * 640, { s: L1.s, rows: rows1(t) });
    ctx.restore();
  }
  function listScreen(ctx, t, v) {   // the label of row 4 and the lifted title
    if (t < A.fourth - .5 || t > A.say) return;
    const m = listMat(v, { ...L1, y: L1.y + sink1(t) * 640 });
    const fu = lab(t, A.plans - .1, A.first + .5);
    if (fu > 0) { const [bx, by] = apply(m, TX + 366, rowY(3) - 18), lx = apply(m, LW + 40, 0)[0];
      X.drawPath(ctx, [[bx + 8, by], [lx - 14, by]], span(fu, 0, .6), { col: rgba(CREAM, .7), w: 1.6, dash: [6, 5] });
      X.label(ctx, LOCAL.floorPlans, lx, by + 9, fu, { size: 26, align: 'left' }); }
    const l1 = lift1(t); if (l1 > 0) {
      if (l1 < 1) liftRow(ctx, m, 0, SRC.list[0], l1, TITLE.x, TITLE.y, TITLE.fs);
      else titleOut(ctx, SRC.list[0], TITLE.x, TITLE.y, TITLE.fs, span(t, A.says - .45, A.says + .15));
    }
  }

  // ---------------------------------------------------------------- c02 · THE BOMB: the concrete door is real → a gold dot (1.07–1.08)
  const BS = { x: 880, w: 130, depth: 100, room: { x0: 840, x1: 1160, h: 120 }, cut: { x0: 760, x1: 1240, depth: 330 } };
  const cut1 = (t) => span(t, A.door - .3, A.door + .7) * (1 - span(t, A.hawaii + .1, tW - .05));
  const doorShut = (t) => span(t, A.concrete - .25, A.concrete + .55);
  const condense = (t) => span(t, A.hawaii - .35, A.hawaii + .15);              // the slab condenses into a gold dot
  const DOT_SKY = [1080, 420];                                                    // where the dot waits for the cut (sheet, view VS)
  const dotUp = (t) => span(t, A.hawaii, tW - .08);
  const doorC = [BS.x, LY + 34 + 23];
  function dotPos(t) { const u = sineIO(dotUp(t)); return quad(doorC, [BS.x, LY - 260], DOT_SKY, u); }
  function bombUnder(ctx, t, s) {
    const cu = cut1(t); if (cu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(BS.cut.x0, LY, BS.cut.x1 - BS.cut.x0, BS.cut.depth * sineIO(cu)); ctx.clip();
    const cd = condense(t);
    F.bunker(ctx, t, BS.x, LY, { s, draw: span(cu, .1, .8), fill: span(cu, .3, 1), depth: BS.depth, room: BS.room, light: .45, door: cd > 0 ? undefined : doorShut(t) });
    if (cd > 0 && cd < 1) {   // the slab shrinks towards its centre while it turns into light
      const w = lerp(97.6, 12, sineIO(cd)), h = lerp(46, 12, sineIO(cd));
      F.slab(ctx, doorC[0] - w / 2, doorC[1] - h / 2, w, h, { s, seed: 77, stip: .8, line: .95, a: 1 - span(cd, .6, 1) });
    }
    ctx.restore();
  }
  function bombOver(ctx, t, s) {
    if (t < A.door - .5 || t >= tW) return;
    F.hatch(ctx, t, BS.x, LY, BS.w, { tilt: .075, open: .38 * io(t, A.hawaii + .1, A.hawaii + .35, tW - .35, tW - .1), glow: .3, s, a: span(t, A.door - .4, A.door + .3) });
    const cd = condense(t); if (cd > 0) { const [x, y] = dotPos(t); dotDraw(ctx, x, y, cd, s); }
  }
  function dotDraw(ctx, x, y, u, s) { F.glowDot(ctx, x, y, 46 * u, .9 * u, 'gold'); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(x, y, 6.5 * expoOut(u), 0, TAU); ctx.fill(); }
  function bombScreen(ctx, t, v) {
    const ru = lab(t, A.real - .1, A.hawaii + .3); if (ru > 0) { const [x, y] = X.toScreen(v, BS.cut.x1 + 30, doorC[1] + 12); X.label(ctx, LOCAL.real, x, y, ru, { size: 40, align: 'left', spacing: .2 }); }
  }

  // ---------------------------------------------------------------- c02 · Kauai (W) → the meadow, the shelter (★ 1.09), the storm, the card (1.08–1.14)
  const ISL = [DOT_SKY[0] - KDOT[0] * KRX, DOT_SKY[1] - KDOT[1] * KRY];
  const islU = (t) => span(t, tW, tW + 1.0);                                      // the coast draws from the dot round the island
  const mU = (t) => (t < tMorph0 ? 0 : span(t, tMorph0, tMorph1));
  const MEADOW_X = 960;
  function islandPoly(t) {   // sheet points of the morphing coast (top arc → the line, bottom arc → far below)
    const u = mU(t), out = [];
    for (let i = 0; i < KN; i++) {
      const [px, py] = KPTS[i], a = [ISL[0] + px * KRX, ISL[1] + py * KRY];
      const top = i <= KTOP, f = top ? i / KTOP : (i - KTOP) / (KN - KTOP);
      const b = top ? [lerp(-260, 2180, f), LY] : [lerp(2180, -260, f), LY + 1200];
      const d = top ? Math.abs(f - .55) : 0, k = sineIO(span(u, d * .25, .8 + d * .25));   // the coast near the ranch straightens first
      out.push(L2(a, b, k));
    }
    return out;
  }
  const dotMeadow = (t) => L2(DOT_SKY, [MEADOW_X, LY], sineIO(mU(t)));
  function kauai(ctx, t, v) {   // the background from the cut until the morph is done
    const u = mU(t), [lx, ly, pl] = pool(t);
    X.ground(ctx, t, v, { lx, ly, pool: pl, earth: 0, line: 0, stars: u });
    X.inView(ctx, v, (s) => {
      const pts = islandPoly(t), iu = islU(t);
      ctx.save(); ctx.globalAlpha *= sineIO(span(iu, .2, 1));
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
      const [x0] = X.toSheet(v, -40, 0), [x1] = X.toSheet(v, W + 40, 0), [, yb] = X.toSheet(v, 0, H + 40);
      ctx.fillStyle = SOIL.top; ctx.fillRect(x0, ISL[1] - KRY - 50, x1 - x0, LY - (ISL[1] - KRY - 50));
      X.earth(ctx, t, x0, x1, LY, Math.max(yb, LY + 10), s);
      ctx.restore();
      // the coast: drawn from the ranch round the island (both ways), then it is the ground line
      const di = Math.round(KN * ((Math.atan2(KDOT[1], KDOT[0]) + TAU) % TAU) / TAU);   // rough start index near the ranch
      const st = KPTS.reduce((best, p, i) => (Math.hypot(p[0] - KDOT[0], p[1] - KDOT[1]) < Math.hypot(KPTS[best][0] - KDOT[0], KPTS[best][1] - KDOT[1]) ? i : best), di % KN);
      const half = Math.ceil(KN / 2), dk = sineIO(iu);
      const cw = Array.from({ length: half + 1 }, (_, j) => pts[(st + j) % KN]), ccw = Array.from({ length: half + 1 }, (_, j) => pts[(st - j + KN) % KN]);
      for (const p of [cw, ccw]) X.drawPath(ctx, p, dk, { col: rgba(CREAM, .78), w: 2.4 / s, glow: 6 / s, glowCol: GOLD.line });
      grass(ctx, t, s, span(u, .7, 1));
    });
  }
  function grass(ctx, t, s, u) {   // the meadow: small cream tufts along the line
    if (u <= 0) return; const r = prng(7321);
    ctx.save(); ctx.strokeStyle = rgba(mixHex(CREAM, GOLD.line, .2), .5); ctx.lineWidth = 1.4 / s; ctx.beginPath();
    for (let i = 0; i < 70; i++) { const x = -200 + i * 34 + r() * 20, h = (5 + r() * 9) * expoOut(span(u, r() * .5, r() * .5 + .5)), sw = Math.sin(t * 1.3 + i) * 1.5;
      ctx.moveTo(x - 4, LY); ctx.lineTo(x - 5 + sw, LY - h); ctx.moveTo(x, LY); ctx.lineTo(x + sw, LY - h * 1.3); ctx.moveTo(x + 4, LY); ctx.lineTo(x + 6 + sw, LY - h * .9); }
    ctx.stroke(); ctx.restore(); ctx.beginPath();
  }
  const SH = { x: MEADOW_X, depth: 80, room: { x0: 790, x1: 1170, h: 120 }, rooms: [{ x0: 1200, x1: 1400, h: 120 }], cut: { x0: 700, x1: 1460, depth: 300 } };
  const cutSh = (t) => span(t, tMorph1 - .4, tMorph1 + .7) * (1 - span(t, A.last + .3, A.last + 1.5));
  const HOUSE = { x0: 250, x1: 640, h: 150, roof: 95 };   // ~2,400 sq ft against ~5,000: the house about 2/3 of the shelter's width
  function shelterUnder(ctx, t, s) {
    const cu = cutSh(t); if (cu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(SH.cut.x0, LY, SH.cut.x1 - SH.cut.x0, SH.cut.depth * sineIO(cu)); ctx.clip();
    F.bunker(ctx, t, SH.x, LY, { s, draw: span(t, A.shelter - .2, A.shelter + .9), fill: span(t, A.shelter + .2, A.shelter + 1.2), depth: SH.depth, room: SH.room, rooms: SH.rooms, light: .75, door: 1 });
    ctx.restore();
  }
  function meadowOver(ctx, t, s) {
    if (t < tW || t > A.last + 2.5) return;
    if (t >= tMorph1) grass(ctx, t, s, 1 - span(t, A.last + .4, A.last + 1.4));
    // the dot: rides the coast to the meadow, then sinks into the line where the shelter opens
    const sinkD = span(t, tMorph1 - .3, tMorph1 + .4);
    if (sinkD < 1) { const [x, y] = dotMeadow(t); dotDraw(ctx, x, y + sinkD * 8, 1 - sineIO(sinkD), s); }
    // the family house: a dashed outline on the meadow, its width and the shelter's width as two dimension lines (dataviz: one axis)
    const hu = io(t, A.bigger - .3, A.bigger + .9, A.says - .2, A.says + .6);
    if (hu > 0) {
      const { x0, x1, h, roof } = HOUSE;
      X.drawPath(ctx, [[x0, LY], [x0, LY - h], [(x0 + x1) / 2, LY - h - roof], [x1, LY - h], [x1, LY]], hu, { col: rgba(CREAM, .8), w: 2 / s, dash: [8 / s, 6 / s] });
      const du = span(hu, .4, 1), yd = LY + 22, ys = LY + SH.depth + SH.room.h + 28 + 22;
      dim(ctx, x0, x1, yd, du, s); dim(ctx, SH.room.x0 - 28, SH.rooms[0].x1 + 28, ys, span(t, A.bigger, A.bigger + .8) * (1 - span(t, A.says - .2, A.says + .6)), s, true);
    }
  }
  function dim(ctx, x0, x1, y, u, s, gold) {   // a dimension line with end ticks, drawn from the left
    if (u <= 0) return; const col = gold ? rgba(GOLD.line, .9) : rgba(CREAM, .8), xe = lerp(x0, x1, sineIO(u));
    X.drawPath(ctx, [[x0, y], [xe, y]], 1, { col, w: 2 / s }); X.drawPath(ctx, [[x0, y - 9], [x0, y + 9]], 1, { col, w: 2 / s });
    if (u >= 1) X.drawPath(ctx, [[x1, y - 9], [x1, y + 9]], 1, { col, w: 2 / s });
  }
  // the storm cloud of "he says it's for storms", and how it becomes the quote card
  const CL = { y: 400, x0: -300, x1: 1000, w: 300 };
  const cloudIn = (t) => span(t, A.says - .5, A.says + 1.2);
  const cardGrow = (t) => span(t, A.words - .25, A.words + .6);                  // the cloud flattens into the card
  const ZCARD = { w: 1100, y: 150, size: 54 };
  const zq = SRC.zuckerberg;
  const qh = (text, size, w) => { const words = text.split(/\s+/); let n = 1, cur = []; for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), size, true) > w - 108) { n++; cur = [wd]; } else cur = nx; } return 24 + n * size * 1.22 + 92; };
  const ZH = qh(zq.text, ZCARD.size, ZCARD.w);
  const settle = (t) => sineIO(span(t, A.fair - .05, A.fair + 1.6));
  const ZSET = { cx: 1525, cy: 196, k: .56 };
  const cardOut = (t) => span(t, A.last - .35, A.last + .5);                      // folds down onto its bottom edge (c03 begins)
  function stormOver(ctx, t, s) {
    const ci = cloudIn(t), cg = cardGrow(t); if (ci <= 0 || cg >= 1) return;
    const x = lerp(CL.x0, CL.x1, sineIO(ci)) + E.drift(t, 6, 3), sq = sineIO(cg);
    ctx.save(); ctx.translate(x, CL.y); ctx.scale(1 + sq * .6, 1 - sq * .75); ctx.translate(-x, -CL.y);
    cloud(ctx, t, x, CL.y, CL.w, { s, rain: 1 - span(cg, 0, .3), rainTo: LY, a: 1 - span(cg, .5, 1) }); ctx.restore();
  }
  // the fake word list that maps the card's words to the spoken ones ("just like" is on the card, not in the VO: it lights as the quote begins)
  const zWords = (() => { const ws = T.GW('a little shelter', 'basement', A.words); return [{ w: 'just', s: ws[0].s - .14 }, { w: 'like', s: ws[0].s - .07 }, ...ws]; })();
  const TZ = { GW: () => zWords };
  function stormScreen(ctx, t, v) {
    const ci = cloudIn(t), cg = cardGrow(t);
    const fu = lab(t, A.storms - .25, A.words - .1); if (fu > 0) { const x = lerp(CL.x0, CL.x1, sineIO(ci)); const [sx, sy] = X.toScreen(v, x, CL.y - CL.w * .42 - 30); X.label(ctx, SRC.forStorms, sx, sy, fu, { size: 30, spacing: .16 }); }
    if (cg <= 0 || cardOut(t) >= 1) return;
    // the card: a paper rect grows out of the cloud, the quote rises on it; on "fair enough" it settles beside the section, small
    const [cx, cy] = X.toScreen(v, CL.x1, CL.y - 60), g = sineIO(cg), x0 = (W - ZCARD.w) / 2;
    const st = settle(t), k = lerp(1, ZSET.k, st), ccx = lerp(W / 2, ZSET.cx, st) - Math.max(0, t - A.fair - 1.6) * 14, ccy = lerp(ZCARD.y + ZH / 2, ZSET.cy, st), co = cardOut(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(ccx, ccy + ZH * k / 2); ctx.scale(k, k * (1 - sineIO(co))); ctx.translate(-W / 2, -(ZCARD.y + ZH));
    if (g < 1) { ctx.fillStyle = rgba(PAPER.lit, g); ctx.fillRect(lerp(cx - 150, x0, g), lerp(cy - 50, ZCARD.y, g), lerp(300, ZCARD.w, g), lerp(110, ZH, g)); }
    F.quoteCard(ctx, t, TZ, { text: zq.text, credit: zq.credit, u: span(cg, .45, 1), w: ZCARD.w, y: ZCARD.y, size: ZCARD.size, spoken: ['a little shelter', 'basement'], mode: 'hi' });
    ctx.restore();
  }
  // "the owners don't love the word bunker": BUNKER under the shelter; a cream strip slides over it: BASEMENT (and becomes the studio's desk)
  const WB = { y: 806 };
  const stripIn = (t) => span(t, A.wordBunker + .15, A.wordBunker + .85);
  const stripUp = (t) => sineIO(span(t, A.last + .45, A.last + 1.9));
  const DESK = { x0: 740, x1: 1180, top: 500 };                                   // the studio desk (sheet, view V2)
  function ownersScreen(ctx, t, v) {
    if (t < A.owners || t > A.last + 2.2) return;
    const bu = io(t, A.wordB - .15, A.wordB + .55, A.last + .05, A.last + .45), su = stripIn(t), up = stripUp(t);
    const cx = X.toScreen(v, (SH.room.x0 + SH.rooms[0].x1) / 2, 0)[0];
    if (bu > 0) X.label(ctx, LOCAL.bunker, cx, WB.y, bu, { size: 46, spacing: .22 });
    if (su > 0) {
      const tw = F.measure(LOCAL.basement, 40, false, 700) + LOCAL.basement.length * 40 * .14 + 70, sw = Math.max(tw, F.measure(LOCAL.bunker, 46, false, 700) + 6 * 46 * .22 + 70);
      const [dx0, dy] = X.toScreen(v, DESK.x0, DESK.top), [dx1] = X.toScreen(v, DESK.x1, DESK.top);
      const creep = Math.max(0, t - A.wordBunker - .85) * 22;   // it keeps the momentum of its slide in (moving hold)
      const x0 = lerp(lerp(-sw - 40, cx - sw / 2, expoOut(su)) + creep, dx0, up), w = lerp(sw, dx1 - dx0, up), y0 = lerp(WB.y - 50, dy - 6, up), h = lerp(68, 12, up);
      ctx.save(); ctx.fillStyle = rgba(P.night0, .35 * (1 - up)); ctx.fillRect(x0 + 5, y0 + 7, w, h);
      ctx.fillStyle = lin(ctx, x0, 0, x0 + w, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(x0, y0, w, h);
      const tu = 1 - span(up, 0, .3);
      if (tu > 0) F.goldText(ctx, [[LOCAL.basement, 0]], x0 + w / 2, y0 + h / 2 + 15, 40, F.rise(tu * span(su, .4, 1)), { serif: false, weight: 700, spacing: .14, align: 'center', col: PAPER.ink });
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- c03 · the studio, C1, BOMBS. NOT AI (1.15–1.18)
  const studioU = (t) => span(t, A.last + 1.1, A.last + 2.1) * (1 - span(t, A.sell - .3, A.sell + .8));
  const peopleU = (t) => span(t, A.last + 1.3, A.last + 2.2) * (1 - span(t, C1.start + 1.5, C1.start + 2.5));
  const lampU = (t) => span(t, A.last + 1.6, A.last + 2.8) * (1 - span(t, A.sell - .4, A.sell + .7));
  const LAMP = { x: 960, y: -120, len: 330, floor: DESK.top, r: 30, poolR: 170 };
  const SEATS = [[815, 1], [1105, -1]];
  function studio(ctx, t, s) {
    const su = studioU(t), pu = peopleU(t); if (su <= 0 && lampU(t) <= 0) return;
    if (su > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(DESK.x0 - 400, LY - 600, DESK.x1 - DESK.x0 + 800, 600); ctx.clip();
      // the two at the desk (behind it; they rise with it)
      if (pu > 0) for (const [x, d] of SEATS) { const k = expoOut(pu); F.person(ctx, x, LY + (1 - k) * 250, 225, { pose: 'stand', dir: d, light: -d, rim: mixHex(CREAM, GOLD.line, .4) }); }
      const k = expoOut(su), dy = (1 - k) * 110;
      ctx.translate(0, dy);
      // microphones on arms
      if (pu > 0) for (const [x, d] of SEATS) { const mx = x + d * 62, my = LY - 225 * .78; ctx.strokeStyle = rgba(CREAM, .6 * pu); ctx.lineWidth = 2.2 / s; ctx.beginPath(); ctx.moveTo(x + d * 120, DESK.top); ctx.lineTo(x + d * 104, my + 40); ctx.lineTo(mx + d * 6, my + 8); ctx.stroke();
        ctx.fillStyle = mixHex(P.night1, CONCRETE.lit, .5); ctx.beginPath(); ctx.roundRect(mx - 9, my - 18, 18, 34, 9); ctx.fill(); }
      // the desk: the top edge is the strip of BASEMENT (it arrives as the top), a dark front panel, two legs
      ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.fillRect(DESK.x0 + 20, DESK.top + 8, DESK.x1 - DESK.x0 - 40, LY - DESK.top - 8);
      ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 1.6 / s; ctx.strokeRect(DESK.x0 + 20, DESK.top + 8, DESK.x1 - DESK.x0 - 40, LY - DESK.top - 8);
      if (stripUp(t) >= 1) { ctx.fillStyle = lin(ctx, DESK.x0, 0, DESK.x1, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(DESK.x0, DESK.top - 6, DESK.x1 - DESK.x0, 12); }
      ctx.restore();
    }
    const lu = lampU(t); if (lu > 0) { const k = sineIO(lu); F.lamp(ctx, t, LAMP.x, LAMP.y - (1 - k) * 360, { floor: LAMP.floor, len: LAMP.len, r: LAMP.r, poolR: LAMP.poolR * k, u: 1, swing: .015 }); }
  }
  const poolRect = (v) => { const [x0, y0] = X.toScreen(v, LAMP.x - LAMP.poolR, LAMP.floor - LAMP.poolR * .14), [x1, y1] = X.toScreen(v, LAMP.x + LAMP.poolR, LAMP.floor + LAMP.poolR * .14); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };
  const c1Morph = (t) => sineIO(span(t, A.heres - .1, C1.start + .05)) * (1 - sineIO(span(t, C1.end - .05, A.bombs + .3)));
  function studioScreen(ctx, t, v) {
    if (t < A.last || t > A.sell + 2) return;
    for (const [txt, x, y, a, b, gold] of [[LOCAL.theo, SEATS[0][0] - 30, LY - 230, A.theo - .1, A.heres + .4], [F.CLIPS.C1.name.toUpperCase(), SEATS[1][0] + 30, LY - 230, A.openai - .1, A.heres + .4],
      [F.CLIPS.C1.year, 960, LY + 50, A.last + 1.6, A.heres + .4, true]]) { const [sx, sy] = X.toScreen(v, x, y); X.dateTag(ctx, txt, sx, sy, lab(t, a, b), { gold }); }
    const m = c1Morph(t); if (m > 0 || (t > C1.start && t < C1.end)) F.clipPlate(ctx, t, T, 'C1', { from: poolRect(v), morph: m });
    // BOMBS · NOT AI under the lamp (+ the line with "just", KB1)
    const bu = lab(t, A.bombs - .15, A.sell + .1), nu = lab(t, A.not - .15, A.sell + .2);
    const [bx, by] = X.toScreen(v, LAMP.x, LAMP.floor - 8);
    if (bu > 0) X.big(ctx, SRC.bombsNotAI[0], bx, by, 150, bu, { gold: 0 });
    if (nu > 0) X.label(ctx, SRC.bombsNotAI[1], bx, by + 78, nu, { size: 44, spacing: .2, col: COOL.text });
    const qu = lab(t, A.bombs + .3, A.sell + 1.8);
    if (qu > 0) { F.goldText(ctx, [[SRC.altman25.text, 0]], W / 2, 790, 32, F.rise(qu), { serif: true, align: 'center', col: CREAM });
      X.label(ctx, SRC.altman25.credit.toUpperCase(), W / 2, 834, span(qu, .2, 1) * qu, { size: 22, col: P.halo2, weight: 600 }); }
  }

  // ---------------------------------------------------------------- c03 · the sellers' catalogue, the list again, the new reason (1.20–1.28)
  const SELL = { x: 410, h: 200 };
  const PAGE = { x0: 500, y0: 170, w: 690, h: 360 };
  const sellerU = (t) => span(t, A.sell - .1, A.sell + .9) * (1 - span(t, A.sense + .4, A.sense + 1.4));
  const pageU = (t) => span(t, A.sell + .4, A.sell + 1.4);
  const pageFold = (t) => span(t, A.sense + .1, A.sense + 1.0);
  const NR_Y = PAGE.y0 + 268;                                                     // the new line (sheet)
  const L2L = { x: 1525, y: 340, s: .56 };
  const list2U = (t) => span(t, A.real2 - .55, A.real2 + .5);
  const sink2 = (t) => sineIO(span(t, A.sense + .25, A.sense + 1.85));
  const lift2 = (t) => span(t, A.sense, A.sense + 1.3);
  const rows2 = (t) => [
    { num: 1, lit: io(t, A.real2 + .3, A.real2 + .7, A.newR - .3, A.newR + .3), strike: span(t, A.oldest - .1, A.oldest + .6), kind: 'thin' },
    { num: 1, write: lift2(t) > 0 ? 0 : 1, lit: span(t, A.machQ - .1, A.machQ + .4), big: span(t, A.machQ, A.machQ + .9) },
    { num: 1 }, { num: 1, redact: 1 },
  ];
  // the new reason: the pen writes "… AND EVEN" with "adding a reason", "ARTIFICIAL INTELLIGENCE" with the words
  const NR = SRC.newReason, NR_SIZE = 27, nrW = (s) => F.measure(s, NR_SIZE, false, 600) + s.length * NR_SIZE * .06;
  const nrSplit = NR.indexOf('ARTIFICIAL'), nrFull = nrW(NR), nrA = nrW(NR.slice(0, nrSplit));
  const pen = (t) => lerp(0, nrA / nrFull, sineIO(span(t, A.adding - .1, A.adding + 1.5))) + (1 - nrA / nrFull) * span(t, A.artif - .05, A.intel + .55);
  const discOn = (t) => span(t, A.intel + .35, A.intel + .9);
  const discFly = (t) => span(t, A.isit, A.machQ + .55);
  function catalogue(ctx, t, s, v) {
    const su = sellerU(t); if (su <= 0) return;
    const k = expoOut(su);
    ctx.save(); ctx.beginPath(); ctx.rect(SELL.x - 200, LY - 500, 400, 500); ctx.clip();
    F.person(ctx, SELL.x, LY + (1 - k) * (SELL.h + 20), SELL.h, { pose: 'hold', dir: 1, light: 1, rim: mixHex(CREAM, GOLD.line, .3) }); ctx.restore();
    const pu = pageU(t), pf = pageFold(t); if (pu <= 0 || pf >= 1) return;
    // the page opens out of his hands (scales from the hand), later folds back into them
    const hx = SELL.x + 60, hy = LY - SELL.h * .55, g = expoOut(pu) * (1 - sineIO(pf));
    ctx.save(); ctx.translate(hx, hy); ctx.scale(lerp(.05, 1, g), lerp(.05, 1, g)); ctx.translate(-hx, -hy);
    ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(PAGE.x0 + 7, PAGE.y0 + 9, PAGE.w, PAGE.h);
    ctx.fillStyle = lin(ctx, PAGE.x0, PAGE.y0, PAGE.x0 + PAGE.w, PAGE.y0 + PAGE.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(PAGE.x0, PAGE.y0, PAGE.w, PAGE.h);
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2 / s; ctx.strokeRect(PAGE.x0, PAGE.y0, PAGE.w, PAGE.h);
    const x0 = PAGE.x0 + 44;
    F.maskLine(ctx, [[LOCAL.reasons, 0]], x0, PAGE.y0 + 62, 30, F.rise(span(pu, .5, 1)), { serif: false, weight: 700, col: PAPER.faint, glow: false, spacing: .14 });
    X.drawPath(ctx, [[x0, PAGE.y0 + 84], [PAGE.x0 + PAGE.w - 44, PAGE.y0 + 84]], span(pu, .6, 1), { col: rgba(PAPER.ink, .3), w: 1.5 / s });
    SRC.oldReasons.forEach((w, i) => { const at = [A.war, A.pand][i], gr = span(t, A.newR, A.newR + .6) * .45;
      F.maskLine(ctx, [[`${i + 1}`, 0], [`  ${w}`, 0]], x0, PAGE.y0 + 140 + i * 58, 40, F.rise(span(t, at - .15, at + .45)), { serif: true, col: mixHex(PAPER.ink, PAPER.shade, gr), glow: false }); });
    // the blank line glows, then the gold pen writes into it
    const bl = span(t, A.newR + .1, A.newR + .9);
    if (bl > 0) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; halo(ctx, x0 + 280, NR_Y - 6, 300, .22 * bl * (1 - span(t, A.intel + .5, A.intel + 1.5)), GOLD.halo, GOLD.core); ctx.restore();
      X.drawPath(ctx, [[x0, NR_Y + 8], [x0 + nrFull, NR_Y + 8]], bl, { col: rgba(GOLD.mid, .8), w: 2 / s, dash: [6, 5] }); }
    const pw = pen(t);
    if (pw > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x0 - 4, NR_Y - 40, nrFull * pw + 4, 60); ctx.clip();
      E.glowText(ctx, NR, x0, NR_Y, { size: NR_SIZE, weight: 600, spacing: .06, col: mixHex(PAPER.ink, GOLD.deep, .85), glow: false }); ctx.restore();
      if (pw < 1) { const px = x0 + nrFull * pw; halo(ctx, px, NR_Y - 8, 26, .7, GOLD.halo, GOLD.core); ctx.strokeStyle = GOLD.shade; ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(px, NR_Y - 6); ctx.lineTo(px + 26, NR_Y - 48); ctx.stroke(); }
    }
    ctx.restore();
  }
  const discStart = () => [PAGE.x0 + 44 + nrFull + 30, NR_Y - 12];
  function list2(ctx, t, s) {
    const u = list2U(t), sk = sink2(t); if (u <= 0 || sk >= 1) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip();
    F.list(ctx, t, L2L.x, L2L.y + (1 - expoOut(u)) * 420 + sk * 520, { s: L2L.s, rows: rows2(t) });
    ctx.restore();
  }
  // the disc: born on the new line, flies to row 2, parks right of it, then (c04) becomes the middle of the round table, then TODAY
  const TABLE = { x: 960, y: 290, r: 128 };
  const TODAY = [640, 370], BIG = [1300, 260];
  function discState(t, v) {
    if (t < A.intel + .3) return null;
    const m = listMat(v, { ...L2L, y: L2L.y + sink2(t) * 520 }), born = expoOut(discOn(t));
    const p0 = discStart(), pr = apply(m, TX + rowW(SRC.list[1]) * 1.14 + 40, rowY(1) - 18), pk = X.toScreen(v, ...[0, 0]);
    let [x, y] = X.toScreen(v, p0[0], p0[1]), r = 16 * born;
    const fl = sineIO(discFly(t)); if (fl > 0) { const q = quad([x, y], [lerp(x, pr[0], .5), Math.min(y, pr[1]) - 160], pr, fl); x = q[0]; y = q[1]; r = lerp(r, 20, fl); }
    const tb = sineIO(span(t, A.sense + .5, A.panel + .4)); if (tb > 0) { const c = X.toScreen(v, TABLE.x, TABLE.y), q = quad([x, y], [lerp(x, c[0], .5), Math.min(y, c[1]) - 120], c, tb); x = q[0]; y = q[1]; r = lerp(r, 24, tb); }
    const td = sineIO(span(t, A.todays - .1, A.todays + 1.0)); if (td > 0) { const c = X.toScreen(v, ...TODAY); x = lerp(x, c[0], td); y = lerp(y, c[1], td) - Math.sin(Math.PI * td) * 60; r = lerp(r, 26, td); }
    const mg = sineIO(span(t, A.smarter - .4, A.smarter + .6)); if (mg > 0) { const c = X.toScreen(v, ...bigPos(t)); const q = quad([x, y], [lerp(x, c[0], .5), Math.min(y, c[1]) - 140], c, mg); x = q[0]; y = q[1]; r = lerp(r, 0, span(mg, .7, 1)); }
    return { x, y, r, u: born * (1 - span(t, A.smarter + .4, A.smarter + .6)), think: .5 + 1.2 * io(t, A.cyber - .3, A.cyber + .3, A.todays, A.todays + .5) };
  }
  function c03Screen(ctx, t, v) {
    const src1 = SRC.sellersSrc; if (t > A.war - 1 && t < A.newR + 1) F.source(ctx, t, A.war - .3, A.real2 - .1, src1);
    if (t > A.artif - 1 && t < A.sense + 1) F.source(ctx, t, A.artif, A.sense + .4, SRC.newReasonSrc);
    // the year tag on the page
    { const [x, y] = X.toScreen(v, PAGE.x0 + PAGE.w - 60, PAGE.y0 - 26); X.dateTag(ctx, LOCAL.year26, x, y, lab(t, A.thisYear - .1, A.sense + .2) * (1 - pageFold(t)), { gold: true }); }
    // verdict of row 1 (REAL → REAL, BUT OLD), sized ≥ 22 px
    const u = list2U(t), sk = sink2(t);
    if (u > 0 && sk < 1) { const m = listMat(v, { ...L2L, y: L2L.y + (1 - expoOut(u)) * 420 + sk * 520 });
      const vt = SRC.verdicts[0], wr = (F.measure('REAL', 40, false, 700) + 40 * 4 * .08) / (F.measure(vt, 40, false, 700) + 40 * vt.length * .08);
      { const ly = X.toScreen(v, 0, LY)[1]; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ly); ctx.clip();   // sinks with the list behind the line
        verdictAt(ctx, t, m, 0, vt, span(t, A.real2w - .15, A.real2w + .5), lerp(wr + .02, 1, sineIO(span(t, A.oldest, A.oldest + .7)))); ctx.restore(); }
      const l2 = lift2(t); if (l2 > 0) liftRow(ctx, m, 1, SRC.list[1], l2, TITLE.x, TITLE.y, TITLE.fs, 1, mixHex(PAPER.ink, GOLD.deep, .8));
    }
    if (lift2(t) >= 1) titleOut(ctx, SRC.list[1], TITLE.x, TITLE.y, TITLE.fs, span(t, A.todays - .4, A.todays + .2));
    const d = discState(t, v); if (d && d.u > 0 && d.r > .5) F.aiDisc(ctx, t, d.x, d.y, d.r, { u: d.u, think: d.think });
  }

  // ---------------------------------------------------------------- c04 · THE MACHINE: the table of 100+ experts, TODAY, the one being built (2.01–2.06)
  const tableU = (t) => span(t, A.panel - .2, A.panel + .8) * (1 - span(t, A.picture + .1, A.picture + 1.6));
  const seatsU = (t) => span(t, A.hundred - .1, A.hundred + .8);
  const SEATN = 104, SEATS2 = Array.from({ length: SEATN }, (_, i) => { const ring = i % 2, a = -Math.PI / 2 + (Math.floor(i / 2) / (SEATN / 2)) * TAU + ring * (TAU / SEATN); return [a, TABLE.r + 26 + ring * 26]; });
  const SPARK = (() => { const r = prng(7331); return Array.from({ length: 16 }, () => [r() * TAU, 30 + r() * 80, r() * 6.3, 1.5 + r() * 2.5]); })();
  function table(ctx, t, s) {
    const u = tableU(t); if (u <= 0) return;
    const out = span(t, A.picture + .1, A.picture + 1.6), dy = sineIO(out) * 520;
    ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip(); ctx.translate(0, dy);
    const { x, y, r } = TABLE;
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.globalAlpha *= sineIO(span(u, 0, .6)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    X.drawPath(ctx, F.arcPts(x, y, r, r, -Math.PI / 2, Math.PI * 1.5, 80), sineIO(u), { col: rgba(CREAM, .85), w: 2.4 / s });
    const su = seatsU(t);
    if (su > 0) { ctx.fillStyle = GOLD.body; ctx.beginPath();
      SEATS2.forEach(([a, rr], i) => { const k = expoOut(span(su, (i / SEATN) * .6, (i / SEATN) * .6 + .4)); if (k <= 0) return; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; ctx.moveTo(px + 6 * k, py); ctx.arc(px, py, 6 * k, 0, TAU); });
      ctx.fill();
      SEATS2.forEach(([a, rr], i) => { if (i % 4) return; const k = span(su, (i / SEATN) * .6, (i / SEATN) * .6 + .4); F.glowDot(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr, 16, .35 * k, 'gold'); }); }
    // the sparks: AI in real cyberattacks (cool, flickering in the middle)
    const sp = io(t, A.cyber - .4, A.cyber + .2, A.todays - .2, A.todays + .5);
    if (sp > 0) for (const [a, rr, ph, f] of SPARK) { const fl = Math.max(0, Math.sin(t * f * 3 + ph)) ** 3; F.glowDot(ctx, x + Math.cos(a + t * .2) * rr * .9, y + Math.sin(a + t * .2) * rr * .9, 22, sp * fl, 'cool');
      ctx.fillStyle = rgba(COOL.core, sp * fl); ctx.beginPath(); ctx.arc(x + Math.cos(a + t * .2) * rr * .9, y + Math.sin(a + t * .2) * rr * .9, 2.2, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  // the big disc (the one they race to build): a dashed outline that fills, rises over the people of many trades, leaves right, returns
  const bigPos = (t) => {
    const rise = sineIO(span(t, A.smarter - .1, A.smarter + 1.4)), out = span(t, A.aBunker + .1, A.aBunker + 1.7), back = span(t, A.dpass - .35, A.dpass + 1.1);
    let x = BIG[0], y = lerp(BIG[1], 210, rise);
    if (out > 0) { x = lerp(x, 2400, sineIO(out)); y = lerp(y, 260, sineIO(out)); }
    if (back > 0) { x = lerp(2400, 1000, expoOut(back)); y = 380; }
    return [x, y];
  };
  const bigR = (t) => lerp(lerp(140, 168, sineIO(span(t, A.smarter - .1, A.smarter + 1.4))), 100, span(t, A.aBunker, A.aBunker + 1.7));
  const bigFill = (t) => span(t, A.buildW - .4, A.buildW + .6);
  const bigOut = (t) => span(t, A.head - .2, A.head + 1.4);
  const TRADES = (() => { const r = prng(7341), P0 = ['hold', 'stand', 'point', 'look', 'hold', 'reach', 'stand', 'lift', 'hold', 'stand', 'point', 'look', 'stand', 'hold']; return P0.map((p, i) => ({ x: 250 + i * 104 + (r() - .5) * 30, h: 104 + r() * 26, pose: p, dir: r() < .5 ? -1 : 1, long: r() < .4, d: r() * .3 })); })();
  const tradesU = (t) => span(t, A.smarter - .2, A.smarter + .9) * (1 - span(t, A.aBunker - .3, A.aBunker + .6));
  function machineOver(ctx, t, s) {
    table(ctx, t, s);
    const tu = tradesU(t);
    if (tu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip();
      for (const p of TRADES) { const k = expoOut(span(tu, p.d, p.d + .7)); if (k <= 0) continue; F.person(ctx, p.x, LY + (1 - k) * (p.h + 20), p.h, { pose: p.pose, dir: p.dir, long: p.long, light: 1, rim: mixHex(CREAM, GOLD.line, .35) }); }
      ctx.restore(); }
  }
  function machineScreen(ctx, t, v) {
    if (t > A.panel - 1 && t < A.todays + 1) F.source(ctx, t, A.panel + .2, A.todays + .2, SRC.safetyReport);
    { const [x, y] = X.toScreen(v, TABLE.x + TABLE.r + 90, TABLE.y - 10); X.label(ctx, SRC.safetyReport.split(' · ')[2], x, y, lab(t, A.hundred + .2, A.todays + .1), { size: 26, align: 'left' }); }
    { const [x, y] = X.toScreen(v, TABLE.x, TABLE.y + TABLE.r + 108); X.label(ctx, SRC.cyber, x, y, lab(t, A.cyber - .2, A.todays + .3), { size: 30, spacing: .14, col: COOL.text }); }
    { const [x, y] = X.toScreen(v, TODAY[0], TODAY[1] + 72); X.label(ctx, LOCAL.today, x, y, lab(t, A.todays + .5, A.smarter - .3), { size: 28, spacing: .2, col: COOL.text }); }
    // the big disc
    const du = span(t, A.picture + .3, A.picture + 1.5), ob = bigOut(t);
    if (du > 0 && ob < 1) {
      const [bx, by] = bigPos(t), [sx, sy] = X.toScreen(v, bx, by), r = bigR(t) * v.s, fill = bigFill(t);
      if (fill < 1) X.drawPath(ctx, F.arcPts(sx, sy, r, r, -Math.PI / 2, Math.PI * 1.5, 90), sineIO(du) * (1 - span(fill, .6, 1)), { col: rgba(COOL.line, .85), w: 2.4, dash: [12, 9] });
      if (fill > 0) { const ex = sineIO(ob); F.aiDisc(ctx, t, sx + ex * 900, sy - ex * 420, r * lerp(1, .4, ex), { u: fill, think: lerp(.5, 2.2, io(t, A.say, A.say + .8, A.ifm, A.well + .5)), warm: sineIO(span(t, A.well - .3, A.well + .9)), bright: 1 + .4 * span(t, A.smarter, A.smarter + 1) }); }
      X.label(ctx, LOCAL.beingBuilt, sx, sy + r + 52, lab(t, A.picture + 1.0, A.smarter - .1), { size: 28, spacing: .2, col: COOL.text });
    }
    // ★ SMARTER THAN ANY OF US · AT EVERYTHING
    const su = lab(t, A.smarter - .05, A.aBunker - .1), eu = lab(t, A.every - .1, A.aBunker);
    if (su > 0) { const [x, y] = X.toScreen(v, 620, 250); X.big(ctx, LOCAL.smarter, x, y, 66, su, { gold: .25 }); }
    if (eu > 0) { const [x, y] = X.toScreen(v, 620, 312); X.label(ctx, LOCAL.everything, x, y, eu, { size: 30, spacing: .24 }); }
  }

  // ---------------------------------------------------------------- c04 · the thought experiment: things that pass, the machine doesn't (2.06–2.15)
  const FRAME = { x0: 70, y0: 62, x1: 1850, y1: 862 };
  const frameU = (t) => sineIO(span(t, A.say - .1, A.say + 1.2)) * (1 - sineIO(span(t, A.nobody + .6, A.head - .2)));
  const BK = { x: 880, w: 120, depth: 75, room: { x0: 840, x1: 1150, h: 105 }, cut: { x0: 760, x1: 1240, depth: 250 } };
  const cutBk = (t) => span(t, A.aBunker - .2, A.aBunker + .9) * (1 - span(t, A.none - .4, A.none + .8));
  const shelves = (t) => 1 - sineIO(span(t, A.oneDay - .2, A.openW - .2));
  const hatchOpen = (t) => .72 * sineIO(span(t, A.openW - .35, A.openW + .55)) * (1 - span(t, A.head + .2, A.head + 1.0));
  const ARROW = { y: 228, x0: 220, x1: 1700 };
  const arrowU = (t) => span(t, A.aBunker + .2, A.pass + .7) * (1 - span(t, A.nobody + .2, A.nobody + 1.0));
  const PASSERS = [[A.storm, 'cloud', SRC.passes[0]], [A.fallout, 'dust', SRC.passes[1]], [A.war2, 'war', SRC.passes[2]]];
  function thoughtUnder(ctx, t, s) {
    const cu = cutBk(t); if (cu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(BK.cut.x0, LY, BK.cut.x1 - BK.cut.x0, BK.cut.depth * sineIO(cu)); ctx.clip();
    F.bunker(ctx, t, BK.x, LY, { s, draw: span(cu, .1, .8), fill: span(cu, .3, 1), depth: BK.depth, room: BK.room, shelves: shelves(t), light: lerp(.55, .2, span(t, A.ifm, A.nobody)) });
    ctx.restore();
  }
  function thoughtOver(ctx, t, s) {
    const cu = cutBk(t); if (cu > 0) hatchUp(ctx, t, BK.x, BK.w, span(t, A.aBunker, A.aBunker + .8) * (1 - span(t, A.none - .2, A.none + .6)), { open: hatchOpen(t), glow: .2 + .5 * hatchOpen(t), s });
    // the time arrow across the sky; it keeps running (a light moves along it)
    const au = arrowU(t);
    if (au > 0) { X.arrow(ctx, [[ARROW.x0, ARROW.y], [ARROW.x1, ARROW.y]], sineIO(span(au, 0, .8)), { col: rgba(CREAM, .75), w: 2 / s, glow: 0, head: 16 });
      const ph = ((t - A.aBunker) * .32) % 1; if (au >= 1) F.glowDot(ctx, lerp(ARROW.x0, ARROW.x1, ph), ARROW.y, 26, .55 * (1 - span(t, A.nobody, A.nobody + .6)), 'cream'); }
    // the things that pass: a storm, fallout, a war (a distant flicker on the horizon) — each crosses left → right and leaves
    for (const [at, kind] of PASSERS) {
      const p = span(t, at - .5, at + 1.5); if (p <= 0 || p >= 1) continue;
      const x = lerp(-300, 2250, p);
      if (kind === 'cloud') cloud(ctx, t, x, 420, 270, { s, rain: 1, rainTo: LY });
      else if (kind === 'dust') { for (let k = 0; k < 3; k++) E.dust(ctx, 7350 + k, 70, x - 60 + k * 70, 440 + k * 20, 170, 60, t, .55, mixHex(CONCRETE.lit, CREAM, .3)); }
      else { const fl = .55 + .45 * Math.sin(t * 23) * Math.sin(t * 7.3); halo(ctx, x, LY - 6, 120, .35 * fl, mixHex(CREAM, GOLD.line, .5), CREAM); halo(ctx, x - 60, LY - 4, 60, .25 * (1 - fl), mixHex(CREAM, GOLD.line, .5), CREAM); }
    }
    // the beam from the disc down into the open hatch: still out there
    const bm = io(t, A.still - .2, A.still + .5, A.ifm - .1, A.well + .2);
    if (bm > 0) { const [bx, by] = bigPos(t); F.beam(ctx, bx, by + 40, BK.x, LY - 10, bm, { s, w: 60 }); }
  }
  function thoughtScreen(ctx, t, v) {
    const fu = frameU(t);
    if (fu > 0) { const { x0, y0, x1, y1 } = FRAME, pts = [[960, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0], [960, y0]];
      X.drawPath(ctx, pts, fu, { col: rgba(CREAM, .55), w: 2, dash: [14, 10] });
      X.dateTag(ctx, SRC.thought, 960, y0, span(fu, .3, 1) * (1 - span(t, A.nobody + .6, A.head - .4))); }
    { const [x, y] = X.toScreen(v, 960, ARROW.y - 40); X.label(ctx, LOCAL.thingsPass, x, y, lab(t, A.pass - .2, A.dpass + .2), { size: 28, spacing: .16 }); }
    for (const [at, , txt] of PASSERS) { const p = span(t, at - .5, at + 1.5); if (p <= 0 || p >= 1) continue; const [x, y] = X.toScreen(v, lerp(-300, 2250, p), 520);
      X.label(ctx, txt, x, y, span(p, .1, .3) * (1 - span(p, .75, .9)), { size: 26, spacing: .14 }); }
    // the verdicts stand right of the disc (the opened hatch lid rises under it)
    const [vx, vy] = X.toScreen(v, 1150, 402), lo = { size: 32, spacing: .14, align: 'left' };
    X.label(ctx, SRC.doesntPass, vx, vy, lab(t, A.dpass + .4, A.still - .2), { ...lo, col: COOL.text });
    X.label(ctx, LOCAL.stillOut, vx, vy, lab(t, A.still + .1, A.ifm + .1), { ...lo, col: COOL.text });
    X.label(ctx, SRC.nobodyNeeds, vx, vy, lab(t, A.nobody - .2, A.head + .3), { ...lo, gold: .6 });
  }
  // the Altman 2023 card grows out of the empty room
  const ACARD = { w: 1180, y: 250, size: 58 };
  const aH = qh(SRC.altman23.text, ACARD.size, ACARD.w);
  const aGrow = (t) => span(t, A.head + .1, A.head + 1.2);
  const BOARD = { x: 960, w: 420, h: 236, b: LY - 40 };
  const toBoard = (t) => sineIO(span(t, A.begin - .1, A.begin + 1.3));
  function altmanScreen(ctx, t, v) {
    const g = aGrow(t), tb = toBoard(t); if (g <= 0 || tb >= 1) return;
    const [rx0, ry0] = X.toScreen(v, BK.room.x0, LY + BK.depth), [rx1, ry1] = X.toScreen(v, BK.room.x1, LY + BK.depth + BK.room.h);
    const [bx0, by0] = X.toScreen(v, BOARD.x - BOARD.w / 2, BOARD.b - BOARD.h), [bx1, by1] = X.toScreen(v, BOARD.x + BOARD.w / 2, BOARD.b);
    const cx0 = (W - ACARD.w) / 2, gg = sineIO(g);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    { const dr = Math.max(0, t - A.head - 1.2) * (1 - tb), k = 1 + dr * .02, ccx = W / 2, ccy = ACARD.y + aH / 2;   // moving hold: it keeps rising out of the room, slowly
      ctx.translate(ccx, ccy - dr * 9); ctx.scale(k, k); ctx.translate(-ccx, -ccy); }
    if (gg < 1) { ctx.fillStyle = rgba(PAPER.lit, gg); ctx.fillRect(lerp(rx0, cx0, gg), lerp(ry0, ACARD.y, gg), lerp(rx1 - rx0, ACARD.w, gg), lerp(ry1 - ry0, aH, gg)); }
    if (tb > 0) {   // c05: the card shrinks into the researchers' board (the room from the beginning)
      const k = tb, x0 = lerp(cx0, bx0, k), y0 = lerp(ACARD.y, by0, k), sx = lerp(1, (bx1 - bx0) / ACARD.w, k), sy = lerp(1, (by1 - by0) / aH, k);
      ctx.translate(x0, y0); ctx.scale(sx, sy); ctx.translate(-cx0, -ACARD.y);
      ctx.fillStyle = rgba(PAPER.lit, span(k, .2, .7)); ctx.fillRect(cx0, ACARD.y, ACARD.w, aH);
    }
    F.quoteCard(ctx, t, T, { text: SRC.altman23.text, credit: SRC.altman23.credit, u: span(g, .4, 1) * (1 - span(tb, .2, .6)), w: ACARD.w, y: ACARD.y, size: ACARD.size, spoken: ['None of this', 'wrong'], after: A.head });
    ctx.restore();
  }

  // ---------------------------------------------------------------- c05 · the room from the beginning, OPTIONAL (★), near or far, build it right (2.16–2.24)
  const roomU = (t) => span(t, A.begin + .3, A.begin + 1.4) * (1 - span(t, A.optW - .9, A.optW + .3));
  const boardLit = (t) => io(t, A.begin + .9, A.begin + 1.5, A.ofc + .2, A.ofc + .9);
  const sciLit = (t) => io(t, A.sci, A.sci + .7, A.optW - .9, A.optW);
  function roomOver(ctx, t, s) {
    const u = roomU(t); if (u <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip();
    const bl = boardLit(t), x0 = BOARD.x - BOARD.w / 2, sinkB = span(t, A.ofc + .5, A.ofc + 1.0);
    if (span(t, A.begin + .9, A.begin + 1.5) > 0 && sinkB < 1) {   // the board: lit, then it folds down onto its legs (the card has left it)
      const bh = BOARD.h * (1 - sineIO(sinkB)), top = BOARD.b - bh;
      ctx.save();
      ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(x0 + 40, BOARD.b); ctx.lineTo(x0 + 40, LY); ctx.moveTo(x0 + BOARD.w - 40, BOARD.b); ctx.lineTo(x0 + BOARD.w - 40, LY); ctx.stroke();
      if (bl > 0) halo(ctx, BOARD.x, BOARD.b - BOARD.h / 2, BOARD.w * .8, .3 * bl, F.LAMP.body, P.cream);
      ctx.fillStyle = F.lin(ctx, 0, top, 0, BOARD.b, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(x0, top, BOARD.w, bh);
      ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.strokeRect(x0, top, BOARD.w, bh);
      ctx.restore();
    }
    const k = expoOut(u), dy = (1 - k) * 140;
    ctx.translate(0, dy);
    for (let i = 0; i < 7; i++) seated(ctx, 690 + i * 82 + (i % 2) * 8, LY, 92, span(u, i * .05, .5 + i * .05));
    for (let i = 0; i < 6; i++) seated(ctx, 730 + i * 90, LY + 2, 108, span(u, .2 + i * .05, .7 + i * .05));
    const sl = sciLit(t), px = BOARD.x + BOARD.w / 2 + 70;
    if (sl > 0) halo(ctx, px, LY - 80, 130, .35 * sl, GOLD.halo, GOLD.core);
    F.person(ctx, px, LY, 150, { pose: 'point', dir: -1, light: 1, rim: mixHex(P.blue0, GOLD.line, sl) });
    ctx.restore();
  }
  const OCARD = { w: 1180, y: 170, size: 58 };
  const oq = SRC.optional, oH = qh(oq.text, OCARD.size, OCARD.w);
  const oGrow = (t) => span(t, A.ofc - .6, A.ofc + .4);
  const oFold = (t) => span(t, A.optW - .45, A.optW + 1.0);
  function optionalScreen(ctx, t, v) {
    // the tag of the hook returns over the board
    { const [x, y] = X.toScreen(v, BOARD.x, BOARD.b - BOARD.h - 38); X.dateTag(ctx, SRC.sutskeverTags[2], x, y, lab(t, A.begin + 1.2, A.ofc - .4), { gold: true }); }
    const g = oGrow(t), f = oFold(t);
    if (g > 0 && f < 1) {
      const [bx0, by0] = X.toScreen(v, BOARD.x - BOARD.w / 2, BOARD.b - BOARD.h), [bx1, by1] = X.toScreen(v, BOARD.x + BOARD.w / 2, BOARD.b - BOARD.h * .55);   // the board's upper half (the heads stay in front)
      const gg = sineIO(span(g, 0, .8)), cx0 = (W - OCARD.w) / 2, fy = OCARD.y + oH, k = 1 - sineIO(f);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(0, fy); ctx.scale(1, Math.max(.001, k)); ctx.translate(0, -fy); ctx.globalAlpha *= 1 - span(f, .85, 1);
      if (gg < 1) { ctx.fillStyle = rgba(PAPER.lit, 1 - span(g, .5, 1)); ctx.fillRect(lerp(bx0, cx0, gg), lerp(by0, OCARD.y, gg), lerp(bx1 - bx0, OCARD.w, gg), lerp(by1 - by0, oH, gg)); }
      F.quoteCard(ctx, t, T, { text: oq.text, credit: oq.credit, u: span(g, .35, 1), w: OCARD.w, y: OCARD.y, size: OCARD.size, spoken: ['Of course', 'bunker'], after: A.ofc - .2 });
      ctx.restore();
    }
    if (t > A.ofc - 1 && t < A.optW + 2) F.source(ctx, t, A.ofc + .2, A.optW + .8, SRC.kb.sutskeverSrc);   // KB7 (fact-check wording)
    // ★ OPTIONAL lifts off the card's fold and stays, big
    const ou = span(t, A.optW - .15, A.optW + .55), oo = span(t, A.some + 1.0, A.some + 1.6);
    if (ou > 0 && oo < 1) X.big(ctx, LOCAL.optional, 960, lerp(OCARD.y + oH + 40, 470, expoOut(ou)), 150, F.rise(ou) * (1 - oo), { gold: .55 });
  }
  // near or far: TODAY on the line, the arrow, the far disc
  const NF = { today: [400, 520], far: [1560, 390], bunker: 1180 };
  const nfU = (t) => span(t, A.some + .1, A.some + 1.0) * (1 - span(t, A.only - .1, A.only + .7));
  const arrowNF = (t) => span(t, A.some + .6, A.anyw + .2) * (1 - span(t, A.only - .2, A.only + .6));
  const nfDisc = (t) => {   // near → far → near, then it settles over the bunker (the scaffold goes up round it)
    const near = [860, 455], set = [NF.bunker, 360];
    let p = NF.far;
    const a = quartIO(span(t, A.near - .2, A.near + .45)), b = quartIO(span(t, A.far - .05, A.far + .6)), c = quartIO(span(t, A.logic - .05, A.logic + .8));
    p = L2(p, near, a); p = L2(p, NF.far, b); p = L2(p, set, c);
    return p;
  };
  const nfR = (t) => lerp(lerp(lerp(70, 92, sineIO(span(t, A.near - .2, A.near + .45))), 70, sineIO(span(t, A.far - .05, A.far + .6))), 92, sineIO(span(t, A.logic - .05, A.logic + .8)));
  const BK2 = { x: 1100, w: 110, depth: 70, room: { x0: 1060, x1: 1330, h: 100 }, cut: { x0: 990, x1: 1400, depth: 230 } };
  const cutBk2 = (t) => span(t, A.near - .1, A.near + .9) * (1 - span(t, A.cross - .1, A.cross + 1.0));
  const SCAF = (t) => span(t, A.only + .1, A.only + 1.5) * (1 - span(t, A.cross - .5, A.cross + .3));
  const BUILDERS = [[1000, 'reach', 1, 88], [1065, 'hold', 1, 82], [1300, 'point', -1, 90], [1370, 'lift', -1, 84]];
  const lanternU = (t) => span(t, A.out - .4, A.out + .6) * (1 - span(t, A.cross - .6, A.cross + .3));
  const nfDiscGone = (t) => span(t, A.cross + .1, A.offl + .7);
  function nearFarUnder(ctx, t, s) {
    const cu = cutBk2(t); if (cu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(BK2.cut.x0, LY, BK2.cut.x1 - BK2.cut.x0, BK2.cut.depth * sineIO(cu)); ctx.clip();
    F.bunker(ctx, t, BK2.x, LY, { s, draw: span(cu, .1, .8), fill: span(cu, .3, 1), depth: BK2.depth, room: BK2.room, light: lerp(.4, .08, span(t, A.down - .3, A.down + .5)), door: 1 });
    ctx.restore();
  }
  function nearFarOver(ctx, t, s) {
    const cu = cutBk2(t); if (cu > 0) hatchUp(ctx, t, BK2.x, BK2.w, span(t, A.near, A.near + .8) * (1 - span(t, A.cross, A.cross + .6)), { open: 0, glow: .15, s });
    const u = nfU(t);
    if (u > 0) { const k = expoOut(u); ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip();
      const [x, y] = NF.today; F.aiDisc(ctx, t, x, y + (1 - k) * 120, 24, { u: k, think: .6, s }); ctx.restore(); }
    const au = arrowNF(t); if (au > 0) X.arrow(ctx, [[NF.today[0] + 40, NF.today[1] - 10], [NF.far[0] - 90, NF.far[1] + 18]], sineIO(au), { col: rgba(CREAM, .6), w: 2 / s, glow: 0, head: 16 });
    // dashes over the arrow (the line is dashed: "anywhere close?")
    // the scaffold: people build the disc out here
    const sc = SCAF(t);
    if (sc > 0) { const x0 = NF.bunker - 130, x1 = NF.bunker + 130, top = 230, col = rgba(CREAM, .7), w = 2 / s;
      X.drawPath(ctx, [[x0, LY], [x0, top]], span(sc, 0, .5), { col, w }); X.drawPath(ctx, [[x1, LY], [x1, top]], span(sc, .05, .55), { col, w });
      for (const [i, yy] of [480, 360, top].entries()) X.drawPath(ctx, [[x0 - 20, yy], [x1 + 20, yy]], span(sc, .3 + i * .1, .7 + i * .1), { col, w });
      X.drawPath(ctx, [[x0, LY], [x1, 480]], span(sc, .5, .9), { col: rgba(CREAM, .4), w }); X.drawPath(ctx, [[x1, LY], [x0, 480]], span(sc, .55, .95), { col: rgba(CREAM, .4), w });
      ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip();
      for (const [i, [x, pose, d, h]] of BUILDERS.entries()) { const k = expoOut(span(sc, .2 + i * .08, .7 + i * .08)); if (k > 0) F.person(ctx, x, LY + (1 - k) * (h + 20), h, { pose, dir: d, light: -d, rim: mixHex(CREAM, GOLD.line, .4) }); }
      ctx.restore(); }
    const lu = lanternU(t); if (lu > 0) F.lanternRow(ctx, t, 120, 720, LY, 8, { h: 92, u: lu, seed: 7242 });
    // up / down arrows
    const ou = io(t, A.out - .2, A.out + .5, A.cross - .5, A.cross); if (ou > 0) X.arrow(ctx, [[420, LY - 120], [420, LY - 250]], sineIO(ou), { col: rgba(GOLD.line, .9), w: 2.4 / s, glow: 6 / s, head: 16 });
    const dn = io(t, A.down - .2, A.down + .5, A.cross - .5, A.cross); if (dn > 0) X.arrow(ctx, [[BK2.x + 140, LY - 40], [BK2.x + 140, LY + BK2.depth + 50]], sineIO(dn), { col: rgba(CREAM, .8), w: 2.4 / s, glow: 0, head: 16 });
  }
  function nearFarScreen(ctx, t, v) {
    const hu = lab(t, A.some + .1, A.only + .2);
    if (hu > 0) { ctx.save(); ctx.setTransform(.6, 0, 0, .6, 60, 36); F.quoteCard(ctx, t, null, { text: SRC.hall.text, credit: SRC.hall.credit, u: hu, w: 1220, y: 140, x: 0, size: 52 }); ctx.restore(); }
    if (t > A.some - 1 && t < A.only + 1) F.source(ctx, t, A.some + .4, A.only + .2, SRC.hall.credit);   // the card is silent and small: its credit at 22 px
    { const [x, y] = X.toScreen(v, NF.today[0], NF.today[1] + 70); X.label(ctx, LOCAL.today, x, y, lab(t, A.some + .5, A.only), { size: 26, spacing: .2, col: COOL.text }); }
    { const [x, y] = X.toScreen(v, 1000, 410); X.label(ctx, LOCAL.close, x, y, lab(t, A.anyw - .1, A.only - .1), { size: 30, spacing: .14 }); }
    { const [x, y] = X.toScreen(v, BK2.cut.x1 + 24, LY + 80); X.label(ctx, SRC.noDoor, x, y, lab(t, A.logic - .1, A.only + .6), { size: 26, align: 'left' }); }
    // the disc (screen)
    const st = span(t, A.some + .3, A.some + 1.3), gone = nfDiscGone(t);
    if (st > 0 && gone < 1) {
      let [x, y] = X.toScreen(v, ...nfDisc(t)), r = nfR(t) * v.s * expoOut(st);
      if (gone > 0) { const L = listMat(v, L3pos(t)), p = apply(L, TX + rowW(SRC.list[1]) + 50, rowY(1) - 18), q = sineIO(gone); [x, y] = quad([x, y], [lerp(x, p[0], .5), Math.min(y, p[1]) - 100], p, q); r = lerp(r, 18, q) * (1 - span(gone, .85, 1)); }
      if (r > .5) F.aiDisc(ctx, t, x, y, r, { u: 1, think: .7 });
    }
    { const [x, y] = X.toScreen(v, 600, 220); X.big(ctx, LOCAL.buildRight, x, y, 76, lab(t, A.right - .15, A.cross - .3), { gold: .45 }); }
    { const [x, y] = X.toScreen(v, 420, LY - 270); X.label(ctx, SRC.outHere, x, y, lab(t, A.out - .1, A.cross - .2), { size: 32, spacing: .2, gold: .7 }); }
    { const [x, y] = X.toScreen(v, BK2.x + 200, LY + 66); X.label(ctx, SRC.downThere, x, y, lab(t, A.down - .1, A.cross - .1), { size: 32, spacing: .2, align: 'left' }); }
  }

  // ---------------------------------------------------------------- c05 · cross the machine off, still building, Harris, C2, RIGHT NOW → plateBunker (2.25–3.07)
  const L3 = { x: 960, y: 300, s: .62 };
  const list3U = (t) => span(t, A.cross - .3, A.cross + .7);
  const sink3 = (t) => sineIO(span(t, A.tristan - .5, A.tristan + 1.0));
  const L3pos = (t) => ({ ...L3, y: L3.y + (1 - expoOut(list3U(t))) * 520 + sink3(t) * 560 });
  const strike2 = (t) => span(t, A.offl - .05, A.offl + .65);
  function list3(ctx, t, s) {
    const u = list3U(t), sk = sink3(t); if (u <= 0 || sk >= 1) return;
    const p = L3pos(t);
    ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + LY); ctx.clip();
    F.list(ctx, t, p.x, p.y, { s: p.s, rows: [{ num: 1, strike: 1, kind: 'thin' }, { num: 1, lit: io(t, A.cross, A.cross + .4, A.why - .3, A.why + .3), strike: strike2(t), kind: 'bold' }, { num: 1 }, { num: 1, redact: 1 }] });
    ctx.restore();
  }
  const BK3 = { x: 1440, w: 104, depth: 66, room: { x0: 1405, x1: 1700, h: 96 }, cut: { x0: 1330, x1: 1780, depth: 220 } };
  const cutBk3 = (t) => span(t, A.why - .1, A.why + .8) * (1 - span(t, A.tristan - .2, A.tristan + .9));
  function stillUnder(ctx, t, s) {
    const cu = cutBk3(t); if (cu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(BK3.cut.x0, LY, BK3.cut.x1 - BK3.cut.x0, BK3.cut.depth * sineIO(cu)); ctx.clip();
    F.bunker(ctx, t, BK3.x, LY, { s, draw: span(t, A.why + .3, A.why + 3.0), fill: span(t, A.why + 1.4, A.why + 3.3), depth: BK3.depth, room: BK3.room, light: .35 * span(t, A.why + 2, A.why + 3.3) });
    // the pencil of the drawing: a gold spark that runs along while it draws
    const dw = span(t, A.why + .3, A.why + 3.0); if (dw > 0 && dw < 1) { const a = dw * TAU * 1.3; halo(ctx, BK3.x + 120 + Math.cos(a) * 150, LY + 90 + Math.sin(a) * 50, 22, .6, GOLD.halo, GOLD.core); }
    ctx.restore();
  }
  function crossScreen(ctx, t, v) {
    const u = list3U(t), sk = sink3(t);
    if (u > 0 && sk < 1) { const m = listMat(v, L3pos(t)), ly = X.toScreen(v, 0, LY)[1];   // the verdicts sink with the list behind the line
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ly);
      if (tagU(t) > 0) { const r = tagRect(t, v), dy = (1 - expoOut(tagU(t))) * (r.h + 30 * v.s); ctx.rect(r.x - 4, r.y + dy - 4, r.w + 8, Math.max(0, ly - r.y - dy + 4)); }   // Harris' tag rises in front
      ctx.clip('evenodd');
      verdictAt(ctx, t, m, 0, SRC.verdicts[0], 1, 1, 36);
      verdictAt(ctx, t, m, 1, SRC.verdicts[1], span(t, A.offl + .45, A.offl + 1.1), 1, 36); ctx.restore(); }
    { const [x, y] = X.toScreen(v, (BK3.cut.x0 + BK3.cut.x1) / 2, LY - 40); X.label(ctx, SRC.stillBuilding, x, y, lab(t, A.why + .6, A.tristan - .1), { size: 30, spacing: .16 }); }
  }
  const TAG = { x: 960, w: 780, h0: 150, h1: 196 };
  const tagU = (t) => span(t, A.tristan - .2, A.tristan + .8) * (1 - span(t, C2.start + 1.2, C2.start + 2));
  const tagH = (t) => lerp(TAG.h0, TAG.h1, sineIO(span(t, A.todayH, A.todayH + .6)));
  const c2Morph = (t) => sineIO(span(t, A.spring + .1, C2.start + .05)) * (1 - sineIO(span(t, C2.end - .1, A.rnow + .35)));
  const RN = { x: 960, y: 470 };
  const rnUp = (t) => sineIO(span(t, A.names - .2, A.names + .9));
  const tagsU = (t) => span(t, A.names - .1, A.names + .9);
  const tagsFold = (t) => span(t, A.ifRight + .05, A.ifRight + 1.0);
  function tagRect(t, v) { const h = tagH(t), [x0, y0] = X.toScreen(v, TAG.x - TAG.w / 2, LY - 22 - h), [x1, y1] = X.toScreen(v, TAG.x + TAG.w / 2, LY - 22); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; }
  const tagSlide = (t) => sineIO(span(t, A.spring + .1, A.spring + 1.0));   // the paper slides down into its stand, the plate shows behind it
  function drawTag(ctx, t, s) {
    const u = tagU(t); if (u <= 0) return; const g = F.CLIPS.C2;
    nameTag(ctx, TAG.x, LY, TAG.w, tagH(t), [[g.name.toUpperCase(), 40, 700, PAPER.ink, span(t, A.tristan, A.tristan + .6)], [LOCAL.ethicist, 24, 600, PAPER.faint, span(t, A.google - .2, A.google + .4)],
      [g.role.toUpperCase(), 24, 600, mixHex(PAPER.ink, GOLD.deep, .7), span(t, A.todayH + .3, A.todayH + .9)]], u, s);
  }
  function harrisOver(ctx, t, s) {
    if (c2Morph(t) <= 0) drawTag(ctx, t, s);
    // he names no names: a row of blank tags; they fold down into the line where the bunker of the plate opens
    const tu = tagsU(t), tf = tagsFold(t);
    if (tu > 0 && tf < 1) for (let i = 0; i < 5; i++) {
      const x = 600 + i * 190, k = span(tu, i * .1, .6 + i * .1), f = sineIO(span(tf, i * .06, .7 + i * .06));
      ctx.save(); ctx.translate(lerp(x, S.PBUNK.x + 150 + i * 160, f), 0); ctx.translate(-x, 0);
      ctx.translate(x, LY); ctx.scale(1, Math.max(.001, 1 - f)); ctx.translate(-x, -LY);
      nameTag(ctx, x, LY, 160, 64, [], k, s); ctx.restore();
    }
  }
  // the plate: the bunker of plateBunker builds itself (cut, hatch, outline, concrete, empty shelves, the axis), then IS the plate
  const plateCut = (t) => span(t, A.ifRight + .4, A.ifRight + 1.5);
  const tFull = tPlate - 1.0;
  function plateBuild(ctx, t, v) {
    const Q = S.PBUNK, [lx, ly, pl] = pool(t), cu = plateCut(t);
    X.ground(ctx, t, v, { lx, ly, pool: pl, cut: cu > 0 ? { ...Q.cut, u: cu } : null });
    X.inView(ctx, v, (s) => {
      underAll(ctx, t, s);
      hatchUp(ctx, t, Q.x, 150, span(t, A.ifRight + .7, A.ifRight + 1.4), { open: 0, glow: .3, s });
      if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(Q.cut.x0, LY, Q.cut.x1 - Q.cut.x0, Q.cut.depth * sineIO(cu)); ctx.clip();
        F.bunker(ctx, t, Q.x, LY, { s, draw: span(t, A.ifRight + .8, A.ifRight + 2.0), fill: span(t, A.ifRight + 1.1, tFull - .1), depth: Q.depth, room: Q.room, shelves: 0, light: .55 * span(t, A.ifRight + 1.2, tFull - .1) });
        F.supplyClock(ctx, t, Q.axis.x, Q.axis.y, Q.axis.w, { s, u: span(t, A.ifRight + 1.4, tFull - .1), scale: [], full: 0 });
        ctx.restore(); }
      overAll(ctx, t, s, v);
    });
  }
  function harrisScreen(ctx, t, v) {
    const m = c2Morph(t); if (m > 0 || (t > C2.start && t < C2.end)) {
      const into = t > C2.end - .2;   // back into the words RIGHT NOW: a thin line under them
      const from = into ? { x: RN.x - 330, y: RN.y + 26, w: 660, h: 4 } : tagRect(t, v);
      F.clipPlate(ctx, t, T, 'C2', { from, morph: m });
      const sl = tagSlide(t);
      if (!into && sl < 1) X.inView(ctx, v, (s) => { const h = tagH(t), y0 = LY - 22 - h; ctx.save(); ctx.beginPath(); ctx.rect(TAG.x - TAG.w, y0, TAG.w * 2, h + 40); ctx.clip();
        ctx.translate(0, sl * (h + 30)); drawTag(ctx, t, s); ctx.restore(); });
    }
    const ru = lab(t, A.rnow - .15, A.ifRight + .1), up = rnUp(t);
    if (ru > 0) { const y = lerp(RN.y, 250, up), sz = lerp(130, 96, up);
      X.big(ctx, SRC.rightNow, RN.x, y, sz, ru, { gold: 1 });
      X.drawPath(ctx, [[RN.x - 330 * sz / 130, y + 26 * sz / 130], [RN.x + 330 * sz / 130, y + 26 * sz / 130]], 1 - span(t, A.rnow + .4, A.rnow + 1.2), { col: rgba(CREAM, .8), w: 3 }); }
    const gu = lab(t, A.good - .9, tPlate - .15);
    if (gu > 0) { const [x, y] = X.toScreen(v, 1080, 480); X.label(ctx, SRC.goodFor, x, y, gu, { size: 40, spacing: .16 }); }
  }

  // ======================================================================================================================== compose
  function underAll(ctx, t, s) { bombUnder(ctx, t, s); shelterUnder(ctx, t, s); thoughtUnder(ctx, t, s); nearFarUnder(ctx, t, s); stillUnder(ctx, t, s); }
  function overAll(ctx, t, s, v) {
    listPart(ctx, t, v); bombOver(ctx, t, s); meadowOver(ctx, t, s); stormOver(ctx, t, s);
    studio(ctx, t, s); catalogue(ctx, t, s, v); list2(ctx, t, s);
    machineOver(ctx, t, s); thoughtOver(ctx, t, s); roomOver(ctx, t, s); nearFarOver(ctx, t, s); list3(ctx, t, s); harrisOver(ctx, t, s);
  }
  function screenAll(ctx, t, v) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    listScreen(ctx, t, v); bombScreen(ctx, t, v);
    if (t > tW - 1) {   // the ranch label rides the dot, the source line of the shelter
      const ku = lab(t, tW + .3, A.bigger + .1); if (ku > 0) { const [x, y] = X.toScreen(v, ...dotMeadow(t)); X.label(ctx, SRC.koolau, x, y - 34, ku, { size: 28, spacing: .14, gold: .5 }); }
      const bu = lab(t, A.bigger + .3, A.says + .4); if (bu > 0) { const [x, y] = X.toScreen(v, (SH.room.x0 + SH.rooms[0].x1) / 2, LY + SH.depth + SH.room.h + 96); X.label(ctx, SRC.biggerHouses, x, y, bu, { size: 32, spacing: .14, gold: .7 }); }
      if (t > A.shelter - 1 && t < A.words + 1) F.source(ctx, t, A.shelter, A.words + .2, SRC.koolauSrc);
      if (t > A.words && t < A.last + 1) F.source(ctx, t, A.words + .4, A.last + .3, zq.src);
    }
    stormScreen(ctx, t, v); ownersScreen(ctx, t, v); studioScreen(ctx, t, v); c03Screen(ctx, t, v); machineScreen(ctx, t, v); thoughtScreen(ctx, t, v);
    altmanScreen(ctx, t, v); optionalScreen(ctx, t, v); nearFarScreen(ctx, t, v); crossScreen(ctx, t, v); harrisScreen(ctx, t, v);
    ctx.restore();
  }
  const cutNow = (t) => {   // the one open section at t (X.ground draws one)
    for (const [c, u] of [[BS.cut, cut1(t)], [SH.cut, cutSh(t)], [BK.cut, cutBk(t)], [BK2.cut, cutBk2(t)], [BK3.cut, cutBk3(t)]]) if (u > 0) return { ...c, u };
    return null;
  };
  function draw(ctx, t) {
    if (t < tTake) { S.plateList(ctx, t, T); return; }
    const v = view(t);
    if (t >= tPlate) { S.plateBunker(ctx, t, T); return; }
    if (t >= tFull) { S.drawBunker(ctx, t, v, { top: () => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); harrisScreen(ctx, t, v); ctx.restore(); } }); return; }
    if (t >= A.ifRight + .3) { plateBuild(ctx, t, v); screenAll(ctx, t, v); return; }
    const [lx, ly, pl] = pool(t);
    if (t >= tW && t < tMorph1) kauai(ctx, t, v);
    else X.ground(ctx, t, v, { lx, ly, pool: pl, cut: cutNow(t) });
    X.inView(ctx, v, (s) => { underAll(ctx, t, s); overAll(ctx, t, s, v); });
    screenAll(ctx, t, v);
  }
  const out = { draw, A, tW, tPlate, view };
  CACHE.set(T, out);
  return out;
}

// a scene file's entries: the take from R.a, one mark per phrase anchor inside [R.a, R.b) (+ the W cut), and for c05 the B2 plate at
// 'Ask the people who sell them' − SEAM_HALF. All marks share one draw, so the renderer sees one take.
export function b1Entries(T, R, { end = false } = {}) {
  const B = b1Take(T), PR = F.PRINT72, stop = end ? B.tPlate : R.b;
  const marks = [...new Set([R.a, ...Object.values(B.A), B.tW].filter((t) => Number.isFinite(t) && t > R.a + .05 && t < stop - .05))].sort((p, q) => p - q);
  const out = [{ t: R.a, draw: B.draw, print: PR }, ...marks.map((t) => ({ t, draw: B.draw, print: PR }))];
  if (end) out.push({ t: B.tPlate, draw: (ctx, t) => S.plateBunker(ctx, t, T), print: PR });
  return out;
}
