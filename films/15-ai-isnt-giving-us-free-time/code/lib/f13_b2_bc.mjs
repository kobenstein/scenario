// Film 13 · B2 · Battle Creek (c07 + c08, 236.70–351.48). Jakob 28.10. (binding): no camera journey through one world. So this is a
// row of SEPARATE pictures (flat explainers and flat scenic posters on the kit's 2.5D cards, camera near home, short pushes only),
// handed on by a carrier: the shape that ends one picture begins the next at the same place. Elements leave by sinking under their
// own base line or retracting into the carrier, and enter by rising from a base line or being drawn by the thread. No fades.
// sc07.mjs and sc08.mjs both return { t: R.a, draw: build(T) }, so the c07|c08 seam is one function.
//
// c07 · Battle Creek 1930 (s10 + s11) · 236.70–294.02
// | pic | ID   | anchor                  | picture (one idea)                                                              | moves (≤ 2)          | carrier → next          |
// |-----|------|-------------------------|----------------------------------------------------------------------------------|----------------------|-------------------------|
// | P1  | 7.01 | Michigan · Battle       | the seam plate's gold haze condenses into the falling thread; the thread bends   | river bends · map    | river line → time axis  |
// |     |      |                         | into a river on a flat night map; streets and blocks grow from its banks.        | grows                |                         |
// |     |      |                         | BATTLE CREEK · MICHIGAN                                                          |                      |                         |
// | P2  | 7.02 | thirty · Depression     | the map sinks into the river, the river straightens and tips over into a time    | axis · curve         | crash curve → roofline  |
// |     |      |                         | axis; 1930 rolls in; the thread draws a curve that rises and crashes. GREAT DEPR. |                      |                         |
// | P3  | 7.03 | Kellogg · expects       | the crashed curve becomes the factory's saw-tooth roof; the front grows down     | push · Kellogg       | the clock lifts off     |
// |     |      |                         | from it, the clock lights (hero); Kellogg steps out of the gate. W. K. KELLOGG   |                      |                         |
// | P4★ | 7.04 | eight · six · hire      | the clock face becomes the dial: the gold work arc sweeps 8 h and shrinks to 6;  | arc · discs          | the two hour discs      |
// |     |      |                         | two freed hours lift out as gold discs; 3 shift workers → 4. 8 → 6 HOURS A DAY    |                      |                         |
// | P5  | 7.05 | two extra · day         | the dial shrinks into a porch lamp; a night street rises; the two discs hover    | discs · street rises | discs → tape reels      |
// | P6  | 7.06 | Hunnicutt · lived       | push to the porch: an old worker and the historian; the discs are the reels of   | push · reels turn    | reels → halves          |
// |     |      |                         | his tape recorder. BENJAMIN HUNNICUTT · KELLOGG'S SIX-HOUR DAY · 1996            |                      |                         |
// | P7  | 7.07 | output · life           | the reels grow into one disc of two halves: cool boxes (OUTPUT), warm gold (LIFE) | halves · street sinks| gold → sand on the map  |
// | P8  | 7.08 | children … ice          | the gold pours as sand; the map regrows from where it lands; one place lights    | stream · glyphs      | (one picture)           |
// |     | 7.09 | ball · fishing · farm   | per sentence (glyphs of light); the town warms from winter to summer; at the end | stream · pile        | sand pile → low sun     |
// |     |      |                         | the sand gathers into one gold disc while the map sinks away                      |                      |                         |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as B from './f13_b2_town.mjs';
import * as G from './f13_b2_gfx.mjs';
import { plateGlass, seamWindow, SEAM_HALF } from './f13_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, camAt, camDrift, F0 } = E;

// ------------------------------------------------------------------------------------------------ helpers
const sink = (t, a, d = .6) => 1 - expoIn(span(t, a, a + d));        // 1 → 0: leaves under its base line
const rise = (t, a, d = .7) => expoOut(span(t, a, a + d));           // 0 → 1: rises from its base line
const sOut = (t, a, d = .6) => 1 - sineIO(span(t, a, a + d));       // 1 → 0 for labels: a calm exit
const vis = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : -Math.log2(1 - k * .999) / 10);   // maskLine eases u with expoOut: feed it the inverse
// draw fn() as if it rose from base line y (k 0..1): clipped above the line, shifted down by (1-k)·h
function fromBase(ctx, y, h, k, fn) { if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-4000, y - 4000, 9920, 4000 + 1.5); ctx.clip(); ctx.translate(0, (1 - k) * h); fn(); ctx.restore(); }
// polyline resampling (for shape matches)
function resample(pts, n) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1], o = []; let j = 1;
  for (let i = 0; i < n; i++) { const d = T * i / (n - 1); while (j < pts.length - 1 && L[j] < d) j++; const f = (d - L[j - 1]) / Math.max(1e-6, L[j] - L[j - 1]); o.push([lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f)]); }
  return o;
}

// ------------------------------------------------------------------------------------------------ the map of light (P1, P8)
const MAP = (() => {
  const rx0 = (y) => 110 * Math.sin(y / 170 + .5) + 45 * Math.sin(y / 63 + 1.3);
  const rx = (y, amp = 1, x0 = 960) => x0 + amp * (rx0(y) - rx0(540));
  const rows = []; for (let y = 130; y <= 1000; y += 108) rows.push(y);
  const cols = [180, 330, 470, 610, 750, 1170, 1310, 1450, 1590, 1740];
  const r = E.prng(1930), blocks = [];
  for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < cols.length - 1; j++) {
    if (j === 4) continue;
    const y0 = rows[i] + 12, y1 = rows[i + 1] - 12, x0 = cols[j] + 10, x1 = cols[j + 1] - 10;
    const n = r() < .5 ? 2 : 1;
    for (let k = 0; k < n; k++) {
      const bx0 = n === 2 ? (k ? (x0 + x1) / 2 + 4 : x0) : x0, bx1 = n === 2 ? (k ? x1 : (x0 + x1) / 2 - 4) : x1;
      const cx = (bx0 + bx1) / 2, cy = (y0 + y1) / 2, near = Math.abs(cx - rx(cy));
      if (near < 95) continue;
      if (r() < .12) continue;
      if (cx < 640 && cy < 330) continue;                          // the corner under the place stamp stays open
      blocks.push({ x0: bx0, x1: bx1, y0, y1, cx, cy, warm: r(), d: near, seed: r() });
    }
  }
  const factory = { x0: 470, x1: 750, y0: rows[4] + 12, y1: rows[5] - 12 };
  for (let i = blocks.length - 1; i >= 0; i--) { const b = blocks[i]; if (b.cx > factory.x0 - 10 && b.cx < factory.x1 + 10 && b.cy > factory.y0 - 10 && b.cy < factory.y1 + 10) blocks.splice(i, 1); }
  // places: the block centres the sand visits (7.08, 7.09)
  const pick = (x, y) => { let best = null, bd = 1e9; for (const b of blocks) { const d = Math.hypot(b.cx - x, b.cy - y); if (d < bd) { bd = d; best = b; } } return best; };
  const at = (b) => ({ x: b.cx, y: b.y0 + 4 });
  const places = {
    children: at(pick(1240, 400)), fence: at(pick(680, 300)), library: at(pick(1520, 520)), garden: at(pick(300, 300)), jars: at(pick(1240, 730)),
    sew: at(pick(330, 830)), churn: at(pick(1520, 840)), ball: at(pick(1660, 200)), fish: { x: rx(905), y: 905 }, farm: at(pick(250, 960)),
  };
  for (const b of blocks) b.place = Object.values(places).some((p) => Math.abs(p.x - b.cx) < 1 && Math.abs(p.y - b.y0 - 4) < 1);
  return { rx, rows, cols, blocks, factory, places };
})();
// u: { river (0..1 grown), amp, streets 0..1, blocks 0..1 (rise, by distance from the river), fac, warm 0..1 (season), win } ; x0 = river x
function drawMap(ctx, t, u) {
  const amp = u.amp ?? 1, x0 = u.x0 ?? 960;
  const rx = (y) => MAP.rx(y, amp, x0);
  // streets: lines that grow out from the banks
  ctx.save(); ctx.lineCap = 'round';
  const sc = mixHex(mixHex(P.blue1, P.ind1, .3), mixHex(P.shade0, P.ind1, .4), u.warm ?? 0);
  ctx.strokeStyle = rgba(sc, .75); ctx.lineWidth = 3;
  for (let i = 0; i < MAP.rows.length; i++) {
    const y = MAP.rows[i], k = clamp((u.streets ?? 1) * 1.6 - Math.abs(i - 4) * .08);
    if (k <= 0) continue;
    const l = rx(y) - 34, r = rx(y) + 34;
    ctx.beginPath(); ctx.moveTo(l, y); ctx.lineTo(lerp(l, 150, k), y); ctx.moveTo(r, y); ctx.lineTo(lerp(r, 1770, k), y); ctx.stroke();
  }
  for (const x of [400, 680, 1240, 1520]) { const k = clamp((u.streets ?? 1) * 1.6 - .5); if (k <= 0) continue; ctx.beginPath(); ctx.moveTo(x, 540 - 430 * k); ctx.lineTo(x, 540 + 430 * k); ctx.stroke(); }
  ctx.restore();
  // blocks: they rise from their lower edge (closest to the river first)
  const warm = u.warm ?? 0;
  for (const b of MAP.blocks) {
    const k = smooth(clamp((u.blocks ?? 1) * 1.8 - b.d / 900));
    if (k <= 0) continue;
    const h = (b.y1 - b.y0) * k;
    const top = mixHex(mixHex(P.blue1, P.ind2, .25), mixHex(P.shade0, P.ind2, .45), warm), bot = mixHex(P.ind2, P.night1, .4);
    ctx.fillStyle = E.lin(ctx, 0, b.y1 - h, 0, b.y1, [[0, top], [1, bot]]); ctx.fillRect(b.x0, b.y1 - h, b.x1 - b.x0, h);
    ctx.fillStyle = rgba(mixHex(P.blue0, P.halo1, warm), .8); ctx.fillRect(b.x0, b.y1 - h, b.x1 - b.x0, 2);
    // windows: a few warm specks (more when the season turns and the time arrives)
    const lit = u.win ? u.win(b) : (b.warm < .3 ? 1 : 0);
    if (lit > 0 && k > .6) { ctx.fillStyle = mixHex(P.night1, P.core1, lit); ctx.fillRect(b.x0 + 8 + b.seed * (b.x1 - b.x0 - 24), b.y1 - h + 10 + b.seed * 6, 7, 7); }
  }
  // the factory block with its chimney (a round mark seen from above)
  const fk = smooth(clamp(u.fac ?? u.blocks ?? 1)), F = MAP.factory;
  if (fk > 0) {
    const h = (F.y1 - F.y0) * fk;
    ctx.fillStyle = E.lin(ctx, 0, F.y1 - h, 0, F.y1, [[0, mixHex(P.blue1, P.ind2, .1)], [1, P.ind2]]); ctx.fillRect(F.x0, F.y1 - h, F.x1 - F.x0, h);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(F.x0 + 14 + i * 52, F.y1 - h + 6, 30, 5 * fk); }
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(F.x1 - 30, F.y1 - h + 30 * fk, 13 * fk, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke();
  }
  // the river: deep water with the gold thread in it (drawn last: it is the carrier)
  river(ctx, t, rx, u.river ?? 1, u.riverW ?? 1, u.ry0, u.ry1);
}
function river(ctx, t, rx, grown, wk, y0 = -40, y1 = H + 40) {
  if (grown <= 0) return;
  const pts = []; for (let y = y0; y <= y1; y += 12) pts.push([rx(y), y]);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); };
  if (wk > .02) {
    ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 34 * wk; path(); ctx.stroke();
    ctx.strokeStyle = E.lin(ctx, 0, 0, 0, H, [[0, mixHex(P.ind1, P.blue0, .5)], [1, mixHex(P.ind1, P.blue0, .3)]]); ctx.lineWidth = 24 * wk; path(); ctx.stroke();
  }
  ctx.restore();
  K.trailSpan(ctx, pts.map(([x, y]) => [x, y]), 0, 1, { w: 2.4, spark: false });
  // glints drifting downstream
  const r = E.prng(77); ctx.save(); ctx.fillStyle = P.core1;
  for (let i = 0; i < 40; i++) { const ph = (r() + t * (.03 + .02 * r())) % 1, y = lerp(y0, y1, ph), x = rx(y) + (r() - .5) * 18 * wk; ctx.globalAlpha = (.3 + .5 * r()) * wk; ctx.fillRect(x - 1, y - 1, 2, 3); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the build
let BUILT = null;
export function build(T) {
  if (BUILT && BUILT.T === T) return BUILT.draw;
  const S = (s, w, n) => T.S(s, w, n);
  const a = {
    T0: T.seg('s10').start, michigan: S('s10', 'Michigan'), battle: S('s10', 'Battle'), december: S('s10', 'December'), thirty: S('s10', 'thirty'),
    great: S('s10', 'Great'), depression: S('s10', 'Depression'), america: S('s10', 'America'), kellogg: S('s10', 'Kellogg'), expects: S('s10', 'expects'),
    cuts: S('s10', 'cuts'), workday: S('s10', 'workday'), factory: S('s10', 'factory'), eight: S('s10', 'eight'), six: S('s10', 'six'),
    hire: S('s10', 'hire'), sowhat: S('s10', 'So what'), two: S('s10', 'two'), every: S('s10', 'every'), day: S('s10', 'day'),
    decades: S('s11', 'Decades'), hunnicutt: S('s11', 'Hunnicutt'), lived: S('s11', 'lived'), what: S('s11', 'What they'), output: S('s11', 'output'),
    life: S('s11', 'life'), parents: S('s11', 'Parents'), children: S('s11', 'children'), neighbors: S('s11', 'neighbors'), library: S('s11', 'library'),
    gardens: S('s11', 'gardens'), canned: S('s11', 'canned'), sewed: S('s11', 'sewed'), ice: S('s11', 'ice'), evenings: S('s11', 'evenings'),
    ball: S('s11', 'ball'), fishing: S('s11', 'fishing'), farm: S('s11', 'farm'), side: S('s11', 'side'), c08: T.seg('s12').start,
  };
  const P0 = a.T0 + SEAM_HALF;

  // camera: home with short pushes (keys on words)
  const PORCH = { x: 1230, y: 880, s: 2.15 };                    // the porch house on the street picture (design coords, scale of the piece)
  const camP = cam3({ x: 270, y: 70, z: 430 });                 // pushed onto the porch (P6)
  const KEYS = [
    [P0, cam3({ z: -20 })], [a.december, cam3({ z: 90 })],
    [a.december + 1.2, cam3({ z: 0 })], [a.america + .2, cam3({ z: 30 })],
    [a.kellogg, cam3({ z: 30 })], [a.cuts, cam3({ y: -60, z: 170 })],
    [a.cuts + 1.4, cam3({ z: 0 })], [a.day + .2, cam3({ z: 30 })],
    [a.hunnicutt + .2, camP], [a.what, { ...camP, z: camP.z + 30 }],
    [a.output + .8, cam3({ z: 0 })], [a.farm, cam3({ z: 60 })], [a.c08 + 1, cam3({ z: 40 })],
  ];
  const camOf = (t) => camDrift(camAt(t, KEYS), t, .8);

  // ---- P2: the time axis and the crash curve (design coords on the focus card)
  const AX = { y: 800, x0: 300, x1: 1620 };
  const CURVE = E.catmull([[300, 800, 3], [430, 775, 3], [560, 768, 3], [690, 728, 3], [800, 700, 3], [900, 650, 3], [990, 612, 3], [1070, 566, 3], [1120, 548, 3]], 8)
    .concat([[1150, 560, 3], [1172, 610, 3], [1190, 680, 3], [1206, 740, 3], [1222, 790, 3], [1260, 796, 3], [1320, 790, 3]]);
  const uPeak = (() => { let L = 0, Lp = 0; for (let i = 1; i < CURVE.length; i++) { const d = Math.hypot(CURVE[i][0] - CURVE[i - 1][0], CURVE[i][1] - CURVE[i - 1][1]); L += d; if (i <= CURVE.length - 8) Lp = L; } return Lp / L; })();
  // ---- P3: the factory (piece scaled onto the design frame), its roofline as a target for the curve
  const FS = 1.316, FB = { x: 960, y: 840 };
  const ROOF = B.sawtoothRoof().map(([u, v]) => [FB.x + u * FS, FB.y + v * FS]);
  const N = 70, CURVE_R = resample(CURVE, N), ROOF_R = resample(ROOF, N);
  const CLK = { x: FB.x, y: FB.y - (B.FACT.h + 72) * FS, r: B.FACT.clock.r * FS };
  // ---- P4: the dial
  const DIAL = { x: 760, y: 470, R: 290 };
  // ---- P5/P6: the night street with the porch
  const LAMP = { x: PORCH.x - 150 * PORCH.s + 40 * PORCH.s, y: PORCH.y - 104 * PORCH.s };
  const REEL = [[PORCH.x - 22, PORCH.y - 126], [PORCH.x + 22, PORCH.y - 126]], REEL_R = 15;
  const HOVER = [[1010, 250], [1150, 290]];
  const SKY = (() => { const r = E.prng(31), o = []; for (let i = 0; i < 16; i++) { const x = -260 + i * 190 + (r() - .5) * 60; if (Math.abs(x - PORCH.x) < 380) continue; o.push({ x, w: 120 + r() * 70, h: 90 + r() * 70, gable: r() < .75 ? 1 : 0, lit: r(), seed: Math.floor(r() * 1e6), tree: r() < .35 }); } return o; })();
  // ---- P8: stops of the sand on the map
  const STOPS = [
    ['children', a.children, 'CHILDREN'], ['fence', a.neighbors, 'NEIGHBORS'], ['library', a.library, 'LIBRARY'], ['garden', a.gardens, 'GARDENS'],
    ['jars', a.canned + .25, 'CANNING'], ['sew', a.sewed, 'SEWING'], ['churn', a.ice, 'ICE CREAM'], ['ball', a.ball, 'BALL GAMES'],
    ['fish', a.fishing, 'FISHING'], ['farm', a.farm, 'LITTLE FARM'],
  ];
  const GLY = { children: 'children', fence: 'neighbors', library: 'library', garden: 'garden', jars: 'jars', sew: 'sew', churn: 'churn', ball: 'ball', fish: 'fish', farm: 'farm' };
  const SUN = { x: MAP.rx(610), y: 610, r: 66 };                  // where the sand gathers into the low sun of c08
  const tSun = a.side + .25;                                        // the stream leaves the farm for the sun
  const foot = (t) => {
    const first = MAP.places.children;
    if (t < STOPS[0][1] - .3) return [first.x, first.y];
    for (let i = 0; i < STOPS.length; i++) {
      const p0 = MAP.places[STOPS[i][0]], t0 = STOPS[i][1];
      const nx = i + 1 < STOPS.length ? [MAP.places[STOPS[i + 1][0]], STOPS[i + 1][1] - .3] : [{ x: SUN.x, y: SUN.y }, tSun + .9];
      const [p1, t1] = nx;
      if (t < t1) { const k = sineIO(span(t, Math.max(t0 + .45, t1 - 1.5), t1)); return [lerp(p0.x, p1.x, k), lerp(p0.y, p1.y, k)]; }
    }
    return [SUN.x, SUN.y];
  };

  const draw = (ctx, t) => {
    if (seamWindow(t, a.T0)) { plateGlass(ctx, t); return; }        // the lead's plate, untouched
    const c = camOf(t);
    // the night canvas (common to every picture): flat night at the seam, warming into the editorial gradient
    const sk = smooth(span(t, P0, P0 + 1.6));
    card(ctx, c, 40000, () => {
      const sm = t >= a.c08 ? summerK(t) : 0, s1 = mixHex(P.night0, P.night1, sk), s3 = mixHex(P.night0, P.ind0, sk);
      E.nightSky(ctx, [[0, P.night0], [.5, s1], [.62, mixHex(mixHex(s1, s3, .24), mixHex(P.ind0, P.ind1, .55), sm)], [.74, mixHex(mixHex(s1, s3, .48), mixHex(P.ind1, P.shade0, .62), sm)], [1, mixHex(s3, mixHex(P.ind0, P.night1, .5), sm)]], -900, H + 200);
      E.stars(ctx, 13, 170, t, [-300, -600, W + 600, H + 400], .75 * sk * (1 - .55 * sm));
    });
    if (t < P0 + 1.3) G.glassHaze(ctx, t, sineIO(span(t, P0, P0 + 1.3)), { thread: t < P0 + 1.0, tw: 1 - smooth(span(t, P0, P0 + 1.0)), grains: false });
    if (t < a.america + .25) mapPic(ctx, c, t);
    else if (t < a.cuts + 2.0) factoryPic(ctx, c, t);
    if (t > a.cuts - .3 && t < a.sowhat + 2.2) dialPic(ctx, c, t);
    if (t > a.sowhat - .2 && t < a.parents + 1.5) streetPic(ctx, c, t);
    discs(ctx, c, t);
    if (t > a.what - .4 && t < a.children + 1) halvesPic(ctx, c, t);
    if (t > a.parents - .2 && t < tSun + 2.2) mapLifePic(ctx, c, t);
    if (t >= a.c08) { sunC08(ctx, c, t); eveningPic(ctx, c, t); timelinePic(ctx, c, t); }
    stamps(ctx, c, t);
  };

  // ============================================================================ P1 + P2: the map → the axis → the crash curve
  function mapPic(ctx, c, t) {
    const gone = smooth(span(t, a.december - .2, a.december + .7));          // blocks sink, streets retract
    const straight = sineIO(span(t, a.december + .4, a.december + 1.0));
    const tip = sineIO(span(t, a.december + .9, a.thirty + .55));           // the line tips over into the axis
    const amp = smooth(span(t, P0 + .2, a.michigan + .3)) * (1 - straight);
    const x0 = G.plateThreadX(t) * (1 - smooth(span(t, P0, P0 + 1.5))) + 960 * smooth(span(t, P0, P0 + 1.5));
    card(ctx, c, F0, () => {
      // the plate's grains go on falling, now along the river (no new ones start after the seam)
      if (t < P0 + 3.6) G.plateGrains(ctx, t, a.T0 + SEAM_HALF, (y) => MAP.rx(y, amp, x0));
      if (tip <= 0) {
        drawMap(ctx, t, {
          amp, x0,
          river: 1, riverW: smooth(span(t, P0 + .1, a.michigan)) * (1 - straight),
          streets: smooth(span(t, P0 + .7, a.battle)) * (1 - gone), blocks: smooth(span(t, P0 + 1.1, a.battle + .9)) * (1 - gone),
          fac: smooth(span(t, a.michigan, a.battle + .9)) * (1 - gone),
        });
      } else {
        // the straight thread rotates about its middle and settles as the axis (tips over to the right)
        const ang = tip * Math.PI / 2, len = lerp(H + 80, AX.x1 - AX.x0, tip), cx = lerp(960, (AX.x0 + AX.x1) / 2, tip), cy = lerp(540, AX.y, tip);
        const dx = Math.sin(ang) * len / 2, dy = Math.cos(ang) * len / 2;
        K.trailSpan(ctx, [[cx - dx, cy - dy, 3], [cx + dx, cy + dy, 3]], 0, 1, { w: 2.6, spark: false });
      }
      // the crash curve (drawn by the thread from the axis start)
      const up = smooth(span(t, a.thirty + .5, a.depression)), fall = sineIO(span(t, a.depression - .05, a.depression + 1.0));
      const head = fall > 0 ? lerp(uPeak, 1, fall) : uPeak * up;
      if (head > .002) {
        if (t < a.america + .25) { const e = K.trailSpan(ctx, CURVE, 0, head, { w: 3.2, spark: false }); if (e) E.halo(ctx, e[0], e[1], 38, .75 * smooth(clamp((1 - head) / .12)), P.halo0, P.core0); }
        const lbl = smooth(span(t, a.great - .1, a.great + .7)) * sOut(t, a.america - .1, .6);
        G.stamp(ctx, 'GREAT DEPRESSION', 1060, 520, lbl);
        // the axis stays until the curve morphs (it becomes the ground line)
        if (tip >= 1 && t < a.america + .25) K.trailSpan(ctx, [[AX.x0, AX.y, 3], [AX.x1, AX.y, 3]], 0, 1, { w: 2.2, spark: false, a: .8 });
      }
    });
  }
  // ============================================================================ P3: the factory front (the curve becomes the roof)
  function factoryPic(ctx, c, t) {
    const m = smooth(span(t, a.america + .25, a.america + 1.2));            // curve → roofline, axis → ground line
    const dn = sineIO(span(t, a.america + .9, a.america + 2.1));           // the front grows down from the roof
    const up = sineIO(span(t, a.america + 1.0, a.america + 1.9));           // tower, chimney, houses rise
    const lit = sineIO(span(t, a.kellogg - .1, a.kellogg + .9));
    const out = (d) => sink(t, a.cuts + .1 + d, .8);                         // P4: everything sinks under the ground line
    const L = B.look(0);
    card(ctx, c, F0, () => {
      const gy = lerp(AX.y, FB.y, m), gx0 = lerp(AX.x0, -300, m), gx1 = lerp(AX.x1, 2220, m);
      const gr = 1 - smooth(span(t, a.cuts + .7, a.cuts + 1.5));             // the ground line retracts to the middle at the end
      // snow ground under the line (grows down from it)
      const gh = 400 * dn * out(.3);
      if (gh > 1) { ctx.fillStyle = E.lin(ctx, 0, gy, 0, gy + 300, [[0, mixHex(P.blue1, P.ind1, .35)], [1, P.night1]]); ctx.fillRect(lerp(960, gx0, gr), gy, lerp(0, gx1 - gx0, gr), gh); }
      // houses either side (rise, then sink)
      for (const [x, s, sd] of [[190, 1.25, 11], [360, 1.05, 23], [1580, 1.1, 37], [1760, 1.3, 51]]) {
        const k = up * out(Math.abs(x - 960) / 4000);
        fromBase(ctx, gy, 140 * s, k, () => { ctx.save(); ctx.translate(x, gy); ctx.scale(s, s); B.drawHouse(ctx, { w: 120, h: 95, gable: 1, lit: sd % 3 ? .2 : .8, seed: sd }, L); ctx.restore(); });
      }
      // the factory: the facade revealed from the roof down, tower + chimney rising from the roof
      const kOut = out(.12);
      if (dn > 0 && kOut > 0) {
        const roofTop = FB.y - (B.FACT.h + 75) * FS;
        ctx.save(); ctx.beginPath(); ctx.rect(0, roofTop, W, lerp(0, FB.y - roofTop + 2, dn)); ctx.rect(0, -400, W, roofTop + 400 + 1); ctx.clip();
        fromBase(ctx, FB.y, 620, kOut, () => {
          ctx.save(); ctx.translate(FB.x, FB.y); ctx.scale(FS, FS);
          // tower and chimney: rise from the roof line (clip above the roof, shift)
          ctx.save(); ctx.beginPath(); ctx.rect(-600, -B.FACT.h - 72, 1200, B.FACT.h + 72); ctx.clip();
          B.drawFactory(ctx, L, t, { clock: { lit: 0 }, win: (i, row) => ((i * 7 + row * 3) % 5 === 0 ? .7 * lit : 0), smoke: false });
          ctx.restore();
          ctx.save(); ctx.beginPath(); ctx.rect(-600, -B.FACT.h - 400, 1200, 400 - 2 + 70); ctx.clip(); ctx.translate(0, (1 - up) * 330);
          B.drawFactory(ctx, L, t, { clock: { lit: 0 }, win: (i, row) => ((i * 7 + row * 3) % 5 === 0 ? .7 * lit : 0), smoke: false });
          ctx.restore();
          ctx.restore();
        });
        ctx.restore();
      }
      // the ground line (was the axis)
      K.trailSpan(ctx, [[lerp(960, gx0, gr), gy, 3], [lerp(960, gx1, gr), gy, 3]], 0, 1, { w: 2.2, spark: false, a: .8 });
      // the roofline: the crash curve morphing into it (drawn until the facade is in)
      const cool = smooth(span(dn, .35, 1));                                     // the line of light cools into the roof's rim
      if (cool < 1) {
        const pts = CURVE_R.map((p, i) => [lerp(p[0], ROOF_R[i][0], m), lerp(p[1], ROOF_R[i][1], m), 3]);
        K.trailSpan(ctx, pts, 0, 1, { w: lerp(lerp(3.2, 2.4, m), .6, cool), spark: false, a: 1 - cool });
      }
      // the clock lights (the hero): the face opens from its centre, a glow round it
      if (lit > 0 && kOut > .05) {
        const cy = CLK.y + (1 - up) * 330 * FS + (1 - kOut) * 620;
        E.halo(ctx, CLK.x, cy, CLK.r * 3.4, .32 * lit, P.halo1, P.halo0);
        if (t < a.cuts - .2) B.clockFace(ctx, CLK.x, cy, CLK.r * expoOut(lit), t, { lit: 1, hands: [7, 0] });
      }
      // Kellogg steps out of the gate
      const kw = sineIO(span(t, a.kellogg - .2, a.kellogg + 1.9));
      if (kw > 0 && kOut > 0) fromBase(ctx, FB.y, 200, kOut, () => {
        ctx.save(); ctx.translate(FB.x - 6 + 120 * kw, FB.y); B.drawPerson(ctx, 118, { long: true, hat: true, walk: kw < 1 ? kw * 9 : undefined, view: kw < 1 ? 'side' : undefined, dir: 1, light: -1, rim: mixHex(P.blue0, P.halo1, .35 * lit * smooth(span(kw, .3, 1))) }); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(FB.x - 70, FB.y - 190, 140, 190); ctx.clip(); ctx.restore();
      });
      const lu = smooth(span(t, a.kellogg + .4, a.kellogg + 1.2)) * sOut(t, a.expects + .2, .6);
      if (lu > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); G.stamp(ctx, 'W. K. KELLOGG', 1440, 560, lu); ctx.restore(); }   // screen: the free sky right of the factory
    });
    // the clock face itself (drawn over the facade so it can lift off into the dial in P4)
  }
  // ============================================================================ P4: the dial (the clock lifts off and grows)
  function dialPic(ctx, c, t) {
    const lift = sineIO(span(t, a.cuts - .2, a.cuts + 1.1));
    const shrink = sineIO(span(t, a.sowhat + .5, a.sowhat + 1.9));          // P5: the face shrinks into the porch lamp
    let x = lerp(CLK.x, DIAL.x, lift), y = lerp(CLK.y, DIAL.y, lift), R = lerp(CLK.r, DIAL.R, lift);
    // while still on the facade, it sinks with the factory
    if (lift <= 0) return;
    x = lerp(x, LAMP.x, shrink); y = lerp(y, LAMP.y, shrink); R = lerp(R, 7, shrink);
    const freed = expoOut(span(t, a.six - .02, a.six + .55));
    const len = 8 * expoOut(span(t, a.workday - .1, a.eight + .15)) - 2 * freed;
    card(ctx, c, F0, () => {
      E.halo(ctx, x, y, R * 2.4, .3 * smooth(span(t, a.cuts - .2, a.cuts + .9)), P.halo1, P.halo0);
      B.clockFace(ctx, x, y, R, t, { lit: 1, hands: [7, 0] });
      const arcOut = 1 - smooth(span(t, a.sowhat + .1, a.sowhat + .7));   // the arc retracts to its start before the face shrinks
      if (len > 0 && arcOut > 0) G.workArc(ctx, x, y, R, 7, len * arcOut, t, { w: .14 });
      if (t > a.sowhat + 2) return;
      // label: 8 → 6 hours a day (one number), the date above
      const out = sOut(t, a.sowhat - .2, .6), lx = DIAL.x + DIAL.R * 1.78, ly = DIAL.y + 60;
      const u8 = smooth(span(t, a.eight - .05, a.eight + .5)) * out, u6 = smooth(span(t, a.six, a.six + .5)) * out;
      if (u8 > 0) K.maskLine(ctx, [['8', 0]], lx, ly, 150, vis(u8));
      if (u6 > 0) {
        const ax0 = lx + K.measure('8', 150) + 22, ax1 = ax0 + 70 * u6, ay = ly - 52;
        ctx.save(); ctx.strokeStyle = rgba(P.halo2, .9 * u6); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ax0, ay); ctx.lineTo(ax1, ay); ctx.moveTo(ax1 - 14, ay - 12); ctx.lineTo(ax1, ay); ctx.lineTo(ax1 - 14, ay + 12); ctx.stroke(); ctx.restore();
        K.maskLine(ctx, [['6', .85]], ax0 + 96, ly, 150, vis(u6));
      }
      G.stamp(ctx, 'HOURS A DAY', lx + 4, ly + 92, smooth(span(t, a.eight + .2, a.eight + .9)) * out);
      // the shift workers: three rise on "factory", a fourth on "hire" (more people)
      const base = DIAL.y + DIAL.R * 1.52, wh = 112;
      K.trailSpan(ctx, [[DIAL.x - 270, base + 2, 2], [DIAL.x + 270, base + 2, 2]], 0, smooth(span(t, a.factory - .3, a.factory + .4)) * sink(t, a.sowhat, .5), { w: 1.6, spark: false, a: .7 });
      for (let i = 0; i < 4; i++) {
        const k = (i < 3 ? rise(t, a.factory + i * .14) : rise(t, a.hire - .05, .6)) * sink(t, a.sowhat - .2 + i * .06, .55);
        if (k <= 0) continue;
        const xx = DIAL.x - 165 + i * 110;
        fromBase(ctx, base, wh * 1.1, k, () => E.person(ctx, xx, base, wh, { light: 1, rim: i === 3 ? mixHex(P.blue0, P.halo0, .55) : P.blue0 }));
      }
    });
  }
  // the two freed hours: discs that leave the dial (7.04), hover over the night street (7.05) and become the reels (7.06)
  const tFree = a.six + .02, tUp = a.sowhat + .2, tHov = a.two + .9, tDn = a.day + .3, tReel = a.decades + .3;
  function discPos(t, i) {
    const lift = sineIO(span(t, a.cuts - .2, a.cuts + 1.1));
    const R = lerp(CLK.r, DIAL.R, lift), x0 = lerp(CLK.x, DIAL.x, lift), y0 = lerp(CLK.y, DIAL.y, lift);
    const [px, py] = G.arcPoint(0, 0, 1, 1.5 + i), k = expoOut(span(t, tFree, tFree + 1.1));
    let x = x0 + R * px * (1.16 + .16 * k), y = y0 + R * py * (1.16 + .16 * k), r = R * .13 * smooth(span(t, tFree - .05, tFree + .3));
    const ku = sineIO(span(t, tUp, tHov)), kd = sineIO(span(t, tDn, tReel));
    const [hx, hy] = HOVER[i], [ex, ey] = REEL[i];
    x = lerp(x, hx + E.drift(t, 10, i * 4), ku); y = lerp(y, hy + E.drift(t, 8, i * 4 + 1), ku) - Math.sin(ku * Math.PI) * 50; r = lerp(r, 30, ku);
    x = lerp(x, ex, kd); y = lerp(y, ey, kd) - Math.sin(kd * Math.PI) * 30; r = lerp(r, REEL_R, kd);
    return [x, y, r];
  }
  function discs(ctx, c, t) {
    if (t < tFree - .05 || t > a.what + 1.2) return;
    card(ctx, c, F0, () => {
      for (let i = 0; i < 2; i++) {
        const [x, y, r] = discPos(t, i);
        if (t < a.what - .2) G.hourDisc(ctx, x, y, r, t, { spin: t > tReel - .4 ? (t - tReel) * 2.6 * (i ? 1 : 1.13) : null, reel: smooth(span(t, tReel - .4, tReel + .3)) });
      }
    });
  }
  // ============================================================================ P5 + P6: the night street, the porch, the historian
  function streetPic(ctx, c, t) {
    const L = B.look(0);
    const gl = smooth(span(t, a.sowhat + 1.1, a.sowhat + 2.1));             // ground line draws out from under the lamp
    const out = (d) => sink(t, a.what + .2 + d, .8);
    const gOut = 1 - smooth(span(t, a.output - .2, a.output + .6));
    card(ctx, c, 3200, () => {   // the far rooftops (rise from the ground line outward from the porch)
      const gy = 880 + (3200 / F0 - 1) * 0 ;
      for (const hs of SKY) {
        const k = rise(t, a.sowhat + 1.5 + Math.abs(hs.x - PORCH.x) / 2600, .8) * out(Math.abs(hs.x - PORCH.x) / 3000);
        fromBase(ctx, gy, 200, k, () => { ctx.save(); ctx.translate(hs.x, gy); ctx.scale(1.3, 1.3); if (hs.tree) B.drawTree(ctx, { h: hs.h * 1.2, seed: hs.seed }, L, 0); else B.drawHouse(ctx, { ...hs, w: hs.w, h: hs.h }, L); ctx.restore(); });
      }
      if (gl > 0) { const k = gl; ctx.fillStyle = E.lin(ctx, 0, gy, 0, gy + 260, [[0, mixHex(P.blue1, P.ind1, .4)], [1, P.night1]]); ctx.fillRect(lerp(PORCH.x, -900, k), gy + (1 - gOut) * 300, lerp(0, 3800, k), 900); }
    });
    card(ctx, c, F0, () => {
      const gy = PORCH.y;
      // the street ground and its lit edge
      if (gl > 0) {
        const k = gl; ctx.save(); ctx.translate(0, (1 - gOut) * 280);
        ctx.fillStyle = E.lin(ctx, 0, gy, 0, gy + 200, [[0, mixHex(P.ind1, P.night1, .3)], [1, P.night0]]); ctx.fillRect(lerp(LAMP.x, -600, k), gy, lerp(0, 3200, k), 600);
        K.trailSpan(ctx, [[lerp(LAMP.x, -600, k), gy, 2], [lerp(LAMP.x, 2600, k), gy, 2]], 0, 1, { w: 2, spark: false, a: .7 });
        ctx.restore();
      }
      // the porch house, with the lamp where the clock face shrank to
      const kp = rise(t, a.sowhat + 1.3, .9) * out(.15);
      const lamp = smooth(span(t, a.sowhat + 1.7, a.sowhat + 2.1));
      fromBase(ctx, gy, 500, kp, () => {
        ctx.save(); ctx.translate(PORCH.x, gy); ctx.scale(PORCH.s, PORCH.s);
        B.drawPorch(ctx, L, t, { lamp: 0, door: .55 });
        seated(ctx, -66, 0, 46, 1, t, 1);                                        // the old worker (left, faces right, talking)
        seated(ctx, 70, 0, 46, -1, t, 0);                                        // the historian (right, faces left)
        recorder(ctx, t, smooth(span(t, tReel - .2, tReel + .3)));
        ctx.restore();
      });
      if (lamp > 0 && kp > 0) { E.halo(ctx, LAMP.x, LAMP.y + (1 - kp) * 500, 300, .5 * lamp * kp, P.halo1, P.core1); E.halo(ctx, LAMP.x + 60, PORCH.y - 10 + (1 - kp) * 500, 260, .22 * lamp * kp, P.halo1, P.halo0); E.halo(ctx, LAMP.x, LAMP.y + (1 - kp) * 500, 26, .9 * lamp * kp, P.halo0, P.core0); }
      const lu = smooth(span(t, a.hunnicutt - .2, a.hunnicutt + .7)) * sOut(t, a.what - .4, .6);
      if (lu > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); G.stamp(ctx, 'BENJAMIN HUNNICUTT', 150, 230, lu, { col: P.cream }); ctx.restore(); }
    });
  }
  // ============================================================================ P7: the halves (output / life)
  const HC = { x: 960, y: 450, R: 250 };
  function halvesPic(ctx, c, t) {
    const k = sineIO(span(t, a.what - .3, a.what + 1.3));
    const exitL = sineIO(span(t, a.parents, a.parents + 1.7)), exitR = expoIn(span(t, a.parents, a.parents + 1.1));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (k < 1) {
      for (let i = 0; i < 2; i++) {   // one halo for both (unclipped), then the two bodies
        const [dx, dy, dr] = discPos(t, i), sp = E.project(c, F0, dx, dy) || [dx, dy, 1];
        E.halo(ctx, lerp(sp[0], HC.x, k), lerp(sp[1], HC.y, k), lerp(dr * sp[2], HC.R, k) * 3, .3 * (1 - .5 * k), P.halo1, P.core1);
      }
      for (let i = 0; i < 2; i++) {
        const [dx, dy, dr] = discPos(t, i), sp = E.project(c, F0, dx, dy) || [dx, dy, 1];
        const x = lerp(sp[0], HC.x + (i ? 16 : -16), k), y = lerp(sp[1], HC.y, k), r = lerp(dr * sp[2], HC.R, k);
        const cut = smooth(span(k, .45, 1));
        ctx.save(); ctx.beginPath();
        if (i === 0) ctx.rect(-W, -H, W + lerp(x + r * 3.4, x, cut), 3 * H); else { const cx = lerp(x - r * 3.4, x, cut); ctx.rect(cx, -H, 2 * W, 3 * H); }
        ctx.clip();
        if (i === 0 && cut > 0) G.halves(ctx, x + 16, y, r, t, { gap: 16, cool: cut, fill: 1, aR: 0, aL: cut });
        G.hourDisc(ctx, x, y, r, t, { spin: (t - tReel) * 2.6, reel: 1 - smooth(span(k, .1, .6)), a: i === 0 ? 1 - cut : 1, halo: false });
        ctx.restore();
      }
      ctx.restore(); return;
    }
    const dim = smooth(span(t, a.output - .1, a.output + .6));
    E.halo(ctx, HC.x, HC.y, HC.R * 3, .15 * (1 - smooth(span(t, a.what + 1.3, a.output + 1.2))), P.halo1, P.core1);   // the reels' shared glow ebbs
    const F = MAP.factory, fp = E.project(c, F0, (F.x0 + F.x1) / 2, (F.y0 + F.y1) / 2) || [600, 600];
    if (exitL < 1) {
      const lx = lerp(HC.x - 16, fp[0], exitL), ly = lerp(HC.y, fp[1], exitL), lr = lerp(HC.R, 4, exitL);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, lx, H); ctx.clip(); G.halves(ctx, lx + 16, ly, lr, t, { gap: 16, cool: 1 - .6 * dim, fill: 1, aR: 0 }); ctx.restore();
    }
    const ry = lerp(HC.y, -HC.R - 80, exitR);
    if (exitR < 1) { ctx.save(); ctx.beginPath(); ctx.rect(HC.x, 0, W, H); ctx.clip(); G.halves(ctx, HC.x - 16, ry, HC.R, t, { gap: 16, cool: 0, fill: 1, aL: 0 }); ctx.restore(); }
    const glow = smooth(span(t, a.life - .1, a.life + .6));
    if (glow > 0 && exitR < 1) E.halo(ctx, HC.x + HC.R * .45, ry, HC.R * (1.1 + .5 * glow), .3 * glow, P.halo1, P.core1);
    const lo = smooth(span(t, a.output - .05, a.output + .5)) * sOut(t, a.parents - .6, .5), li = smooth(span(t, a.life - .05, a.life + .5)) * sOut(t, a.parents - .5, .5);
    G.stamp(ctx, 'OUTPUT', HC.x - 16 - HC.R * .5, HC.y + HC.R + 84, lo, { align: 'center' });
    G.stamp(ctx, 'LIFE', HC.x + 16 + HC.R * .5, HC.y + HC.R + 84, li, { align: 'center', col: P.core1 });
    ctx.restore();
  }
  // ============================================================================ P8: the town map lit by the sand (7.08, 7.09)
  function mapLifePic(ctx, c, t) {
    const pour0 = a.parents + .2;                                              // the stream leaves the rising life half
    const land = MAP.places.children;
    const grow = smooth(span(t, pour0 + .5, pour0 + 1.6));
    const endK = smooth(span(t, tSun + .3, tSun + 1.3));                       // the map sinks into the river, the river into the sun
    const warm = smooth(span(t, a.children - .2, a.farm + .6));
    const lit = (b) => (b.warm < .3 ? 1 : 0) + (b.warm >= .3 && b.warm < .3 + .55 * warm ? 1 : 0);
    card(ctx, c, F0, () => {
      if (endK < 1) {
        const ry = (y) => { const k = smooth(span(t, tSun + .7, tSun + 1.5)); return [lerp(-40, SUN.y, k), lerp(H + 40, SUN.y, k)]; };
        const [y0, y1] = ry();
        if (grow > 0) drawMap(ctx, t, {
          amp: 1, x0: 960, river: 1, riverW: grow * (1 - endK), ry0: lerp(land.y, y0, grow), ry1: lerp(land.y, y1, grow),
          streets: smooth(span(t, pour0 + .9, pour0 + 2.0)) * (1 - smooth(span(t, tSun + .4, tSun + 1.0))),
          blocks: smooth(span(t, pour0 + 1.2, pour0 + 2.6)) * (1 - smooth(span(t, tSun + .2, tSun + .9))),
          fac: smooth(span(t, pour0 + 1.2, pour0 + 2.2)) * (1 - smooth(span(t, tSun + .2, tSun + .9))), warm, win: lit,
        });
      }
      // glyphs of light over the places
      for (const [n, tw, label] of STOPS) {
        const u = expoOut(span(t, tw - .15, tw + .7)) * sink(t, tSun + .1 + STOPS.findIndex((s) => s[0] === n) * .03, .55);
        if (u <= 0) continue;
        const si = STOPS.findIndex((s) => s[0] === n), tn = si + 1 < STOPS.length ? STOPS[si + 1][1] : tw + 2.6;
        const p = MAP.places[n], lab = 1 - smooth(span(t, Math.min(tw + 2.4, tn - .45), Math.min(tw + 3.0, tn + .05)));   // one label at a time
        E.halo(ctx, p.x, p.y + 20, 60, .3 * u, P.halo1, P.halo0);
        G.glyph(ctx, GLY[n], p.x, p.y - 4, 80, t, u, { label: lab > 0 ? label : null, labelK: lab, labelUp: p.y > 640 });
      }
      // the stream (from above the frame) and its landing; at the end the sand gathers into the sun disc
      const on = smooth(span(t, pour0, pour0 + .5)), off = smooth(span(t, tSun + 1.3, tSun + 2.0));
      const [fx, fy] = foot(t);
      if (on > 0 && off < 1) {
        G.sandStream(ctx, fx + 30, -60, fx, fy - 4, t, { u0: off, u1: on, w: 2.6, n: 30 });
        if (on >= 1 && t < tSun + 1.6) G.landing(ctx, fx, fy - 4, 22, t, 1 - smooth(span(t, tSun + .9, tSun + 1.6)));
      }
      if (t < a.c08) sunDisc(ctx, t);
    });
  }
  // the gathered sand → the low sun of c08 (shared by both chunks: same function, same t)
  function sunDisc(ctx, t, x = SUN.x, y = SUN.y, R = SUN.r, hk = 1) {
    const g = expoOut(span(t, tSun + .8, tSun + 2.1));
    if (g <= 0) return;
    const r = R * g;
    E.halo(ctx, x, y, r * 4 * lerp(.6, 1, hk), .45 * g * hk, P.halo1, P.core1);
    ctx.fillStyle = E.rad(ctx, x, y, r, [[0, P.core0], [.55, P.core0], [.85, P.core1], [1, P.halo0]]); ctx.beginPath(); ctx.arc(x, y, r * (1 + .012 * Math.sin(t * 1.1)), 0, 6.29); ctx.fill();
    E.dust(ctx, 303, 900, x, y, r * 2.2, r * 1.1, t, .5 * g * hk, P.halo0);
  }

  // ============================================================================ stamps (place, year)
  function stamps(ctx, c, t) {
    const place = smooth(span(t, a.battle - .05, a.battle + .7)), year = span(t, a.december + .25, a.thirty + .1);
    const shrink = sineIO(span(t, a.kellogg - .4, a.kellogg + .8)), out = sink(t, a.cuts - .1, .5);
    if (place <= 0 || out <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const ys = lerp(150, 104, shrink), yb = lerp(236, 160, shrink), py = lerp(318, 230, shrink), pk = place * (1 - sineIO(span(t, a.kellogg - .5, a.kellogg + .2)));   // the place leaves as the year settles: one label
    if (year > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, yb + 34); ctx.clip(); ctx.translate(0, (1 - out) * (ys + 40)); G.yearRoll(ctx, 112, yb, ys, 1900, 1930, year); ctx.restore(); }
    G.stamp(ctx, 'BATTLE CREEK', 116, py, pk * out);
    ctx.restore();
  }
  // ============================================================================ small pieces
  // a seated person (local units of the porch piece; base under the chair). dir ±1 facing; talk: tiny head nods
  function seated(ctx, x, y, h, dir, t, talk) {
    ctx.save(); ctx.translate(x, y - 14); ctx.scale(dir, 1);
    ctx.fillStyle = P.night1;
    ctx.fillRect(-h * .3, -h * .38, h * .36, h * .05); ctx.fillRect(-h * .3, -h * .82, h * .05, h * .82); ctx.fillRect(h * .02, -h * .38, h * .04, h * .38);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .25);
    ctx.beginPath(); ctx.moveTo(-h * .24, -h * .4); ctx.lineTo(-h * .2, -h * .76); ctx.quadraticCurveTo(-h * .08, -h * .86, h * .03, -h * .75); ctx.lineTo(h * .06, -h * .42); ctx.closePath(); ctx.fill();
    ctx.fillRect(-h * .2, -h * .44, h * .4, h * .1); ctx.fillRect(h * .12, -h * .42, h * .08, h * .42);
    const nod = talk * .025 * Math.sin(t * 5.3) * Math.max(0, Math.sin(t * 1.3));
    ctx.beginPath(); ctx.ellipse(-h * .06, -h * .9 + nod * h, h * .09, h * .1, 0, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .8); ctx.lineWidth = h * .025; ctx.beginPath(); ctx.arc(-h * .06, -h * .9 + nod * h, h * .09, -2.4, -.6); ctx.stroke();   // warm rim from the lamp
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.moveTo(-h * .05, -h * .72); ctx.lineTo(h * .15, -h * .52); ctx.lineTo(h * .17, -h * .47); ctx.lineTo(-h * .02, -h * .62); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // the tape recorder on a little table (porch local units); its reels are the two hour discs
  function recorder(ctx, t, on) {
    ctx.fillStyle = P.night1; ctx.fillRect(-12, -40, 3, 26); ctx.fillRect(9, -40, 3, 26); ctx.fillRect(-16, -43, 32, 4);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.beginPath(); ctx.roundRect(-17, -66, 34, 23, 2); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = .8; ctx.stroke();
    if (on > 0) { E.halo(ctx, 12, -47, 8, .8 * on, P.halo1, P.core1); ctx.fillStyle = mixHex(P.night0, P.core1, on); ctx.fillRect(11, -48, 2.4, 2.4); }
  }

  // ################################################################################################ c08 · s12 + s13 · 294.02–351.48
  // | pic  | ID   | anchor                        | picture (one idea)                                                         | moves (≤ 2)            | carrier → next            |
  // |------|------|-------------------------------|----------------------------------------------------------------------------|------------------------|---------------------------|
  // | P9 ★ | 8.01 | summer evening · still light  | the gathered sand IS the low sun; the horizon draws out from under it, the  | horizon · town rises   | the sun                   |
  // |      |      |                               | town rises on it, a river shines toward us (scenic heart, one warm light)  |                        |                           |
  // |      | 8.02 | father · kid · porch · ball   | father + kid walk down to the river with a rod; on a porch someone cranks  | walk · crank · pitch   | the horizon line          |
  // |      | 8.03 |                               | the ice-cream churn; at the ball field the first pitch                     | (one at a time)        |                           |
  // | P10  | 8.04 | promise · today · century     | EXPL the picture sinks into its horizon: the line is a time axis; TODAY at | sun rolls · bracket    | the sun → the dial        |
  // |      |      |                               | the right, the sun rolls back to 1930, ALMOST A CENTURY                     |                        |                           |
  // | P11  | 8.05 | So why … six hours today?     | EXPL the sun lifts off the axis and becomes the dial: 6 h of work (gold);  | dial · arc             | cursor on the axis        |
  // |      |      |                               | at TODAY a small cool dial with 8 h                                        |                        |                           |
  // | P12  | 8.07 | war · eight · voted · back    | EXPL vote timeline: the axis rescales 1930–1990, the cursor runs 1930 →    | cursor · arc / hands   | workers → factory front   |
  // |      | 8.08 |                               | 1943 (WAR, arc back to 8) → 1946: ten workers, eight raise a hand; arc 6   |                        |                           |
  // | P13  | 8.09 | department · one by one       | EXPL the factory front rises from the axis, every window (a department)    | windows · coins        | the last window           |
  // |      | 8.10 | 1985 · switch · leave         | warm; one by one they turn cool, a coin drops for each; the last holds to  |                        |                           |
  // |      |      |                               | 1985 (THE LAST 530), turns on "switch"; on "leave" the factory sinks away,  |                        |                           |
  // |      |      |                               | the last window stays and comes forward (→ c09: the workbench)             |                        |                           |
  const S12 = (w, n) => T.S('s12', w, n), S13 = (w, n) => T.S('s13', w, n);
  const b = {
    summer: S12('summer'), evening: S12('evening'), shift: S12('shift'), over: S12('over'), light: S12('light'), father: S12('father'), river: S12('river'),
    rod: S12('rod'), kid: S12('kid'), porch: S12('porch'), cranking: S12('cranking'), churn: S12('churn'), ball: S12('ball'), game: S12('game'),
    starting: S12('starting'), thats: S12("That's"), promise: S12('promise'), today: S12('today'), lived: S12('lived'), century: S12('century'),
    so: S12('So why'), six: S12('six'), today2: S12('today', 1),
    not: T.seg('s13').start, wanting: S13('wanting'), first: S13('First'), war: S13('war'), eight: S13('eight'), after: S13('After'), most: S13('most'),
    voted: S13('voted'), back: S13('back', 1), but: S13('But'), department: S13('department'), one: S13('one by one'), pay: S13('pay'),
    longer: S13('longer'), last: S13('last'), held: S13('held'), nineteen: S13('nineteen'), eighty: S13('eighty'), then: S13('Then they'),
    switch: S13('switch'), leave: S13('leave'), creek: S13('Creek'), c09: T.seg('s14').start,
  };
  const HZ = 690, ZG = 2400, ZS = 9000;
  // ---- the time axis (P10–P13): x of a year; it rescales from 1930–2026 to 1930–1990 on "Not because …"
  const XA = (yr, t) => 330 + (yr - 1930) * lerp(1260 / 96, 1260 / 60, sineIO(span(t, b.not + .3, b.wanting + .5)));
  const D8 = { x: 560, y: 350, R: 175 };
  // the cursor year: 1930 → 1943 (war) → 1946 (after) → 1985
  const YEARS = [[1930, -1], [1943, b.first + .1], [1946, b.after + .1], [1985, b.held - .2]];
  const yearAt = (t) => { let y = 1930; for (const [yr, t0] of YEARS) if (t0 > 0) { const k = sineIO(span(t, t0, t0 + 1.3)); if (k > 0) y = lerp(y, yr, k); } return y; };
  // ---- P9 pieces (design coords; the ground card ZG holds horizon, town, porch, ball field; F0 holds the river and the walkers)
  const SKY8 = (() => { const r = E.prng(1946), o = []; for (let x = -2300; x < 2700; x += 120 + r() * 90) { if (Math.abs(x - SUN.x) < 270) continue; if (x > 1290 && x < 1610) continue; o.push({ x, w: 80 + r() * 70, h: 55 + r() * 55, gable: r() < .7 ? 1 : 0, lit: r(), seed: Math.floor(r() * 1e6), tree: r() < .45, th: 110 + r() * 90 }); } return o; })();
  const FAR = { x: 1450, s: .42 };                                                 // the factory, far on the horizon
  // 8.02–8.03 (coordinator 28.10.): the three motifs are large, near, on F0, along the same evening line; one slow glide leftward
  // (toward and past the river) reaches them one by one: father + kid at the river, the porch, the ball field
  const PORCH8 = { x: -250, y: 870, s: 2.0 }, FIELD = { x: -930, y: 872, s: 3.3 };   // the porch sits left of the sun, which glows past its eave
  const RIV = (() => { const p = E.catmull([[SUN.x + 4, HZ, 0], [SUN.x - 8, 714, 0], [866, 760, 0], [800, 830, 0], [712, 920, 0], [622, 1010, 0], [548, 1120, 0]], 10); return p.map(([x, y]) => [x, y, lerp(5, 165, clamp((y - HZ) / (1120 - HZ)) ** 1.25)]); })();
  const riverPoly = (u0, u1) => {   // the river band between path fractions u0..u1 (0 = horizon, 1 = near edge)
    const n = RIV.length, i0 = Math.floor(u0 * (n - 1)), i1 = Math.ceil(u1 * (n - 1)); if (i1 - i0 < 1) return null;
    const L = [], R = [];
    for (let i = i0; i <= i1; i++) { const p = RIV[i], q = RIV[Math.min(n - 1, i + 1)], o = RIV[Math.max(0, i - 1)], dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d; L.push([p[0] + nx * p[2], p[1] + ny * p[2]]); R.push([p[0] - nx * p[2], p[1] - ny * p[2]]); }
    const path = new Path2D(); L.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1]))); for (let i = R.length - 1; i >= 0; i--) path.lineTo(R[i][0], R[i][1]); path.closePath(); return path;
  };
  const WALK = { f: [1900, 990, 430, 7], k: [2060, 1130, 250, 12] };           // x0, x1, height, walk phase (×π): they come in from the right, toward the sun
  const walkK = (t) => { const u = span(t, b.father - .2, b.kid + .25); return 1 - (1 - u) ** 1.7; };
  // ---- P13: the factory front on the axis (piece at scale FS8, base on the axis)
  const FX = 1240, FS8 = .95;
  const winPos = (i, row) => [FX + (-B.FACT.w / 2 + 30 + i * (B.FACT.w - 60) / 12 + 17) * FS8, HZ + (-B.FACT.h + 40 + row * 90 + 28) * FS8];
  const WINS = (() => { const o = []; for (let row = 0; row < 2; row++) for (let i = 0; i < 12; i++) { if (row === 1 && (i === 5 || i === 6)) continue; o.push([i, row]); } return o; })();
  const LASTW = [3, 0];
  const FLIPS = (() => {   // one by one: the order of the departments (seeded), the last one left out
    const r = E.prng(85), rest = WINS.filter(([i, row]) => !(i === LASTW[0] && row === LASTW[1])).map((w) => [w, r()]).sort((p, q) => p[1] - q[1]).map((p) => p[0]);
    const t0 = b.one - .1, t1 = b.longer + .2, n = rest.length, m = new Map();
    rest.forEach(([i, row], j) => m.set(i + ':' + row, lerp(t0, t1, (j / (n - 1)) ** .9)));
    m.set(LASTW[0] + ':' + LASTW[1], b.switch - .05); return m;
  })();
  const flipK = (i, row, t) => smooth(span(t, FLIPS.get(i + ':' + row), FLIPS.get(i + ':' + row) + (i === LASTW[0] && row === LASTW[1] ? .7 : .3)));
  const WEND = { x: 960, y: 520, s: 1.9 };                                        // where the last window ends (→ c09)
  const lastWin = (t) => { const [x, y] = winPos(...LASTW), k = sineIO(span(t, b.leave - .1, b.c09 - .15)); return [lerp(x, WEND.x, k), lerp(y, WEND.y, k) - Math.sin(k * Math.PI) * 40, lerp(FS8, WEND.s, k)]; };

  // the sun / the dial: one disc. design coords (far card in P9, the F0 card from the pull-back on)
  function sunState(t) {
    let x = SUN.x, y = SUN.y + 50 * sineIO(span(t, a.c08, b.thats)), r = SUN.r * (1 + .25 * sineIO(span(t, a.c08 + .4, b.light + 1)));
    const up = sineIO(span(t, b.promise - .2, b.promise + .8)); y = lerp(y, HZ - r - 3, up);
    const roll = sineIO(span(t, b.lived - .3, b.century + .2)); x = lerp(x, XA(1930, t), roll);
    const d = sineIO(span(t, b.so - .05, b.so + 1.5)); x = lerp(x, D8.x, d); y = lerp(y, D8.y, d) - Math.sin(d * Math.PI) * 40; r = lerp(r, D8.R, d);
    const home = sineIO(span(t, b.last - .2, b.eighty + .2));                     // P13: the dial shrinks back into the cursor as it runs to 1985
    const cx = XA(yearAt(t), t); x = lerp(x, cx, home); y = lerp(y, HZ, home); r = lerp(r, 9, home);
    return { x, y, r, d, home };
  }
  function sunScreen(c, t, p) {
    const k = smooth(span(t, a.c08, a.c08 + 1.5)) * (1 - smooth(span(t, b.promise + .65, b.promise + 1.0)));
    const p0 = E.project(c, F0, p.x, p.y), p1 = E.project(c, ZS, p.x, p.y);
    return [lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k), lerp(p0[2], p1[2], k)];
  }
  function sunC08(ctx, c, t) {
    if (t > b.eighty + .25) return;
    const p = sunState(t), [x, y, k] = sunScreen(c, t, p), r = p.r * k;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const sm = summerK(t);
    E.halo(ctx, x, y + 40 * sm, 1250 * (1 - p.d * .6), .3 * sm * (1 - p.d), P.halo1, P.shade0);   // the warm low light over the land
    sunDisc(ctx, t, x, y, r, 1 - .5 * p.d);
    if (p.d > 0 && p.home < 1) {                                                   // the dial: ticks sweep in, hands grow, the work arc
      const u = p.d * (1 - p.home);
      ctx.fillStyle = rgba(P.shade0, .75 * u);
      for (let i = 0; i < 12; i++) { if (i / 12 > u * 1.05) break; const an = i / 12 * 6.283; ctx.beginPath(); ctx.arc(x + Math.sin(an) * r * .8, y - Math.cos(an) * r * .8, r * (i % 3 ? .025 : .045), 0, 6.29); ctx.fill(); }
      ctx.strokeStyle = rgba(P.night1, u); ctx.lineCap = 'round';
      const ha = 7 / 12 * 6.283;
      ctx.lineWidth = r * .09; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ha) * r * .48 * u, y - Math.cos(ha) * r * .48 * u); ctx.stroke();
      ctx.lineWidth = r * .055; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - r * .72 * u); ctx.stroke();
      G.dialTrack(ctx, x, y, r, smooth(span(t, b.so + .6, b.six)) * (1 - p.home), { a: 1 });
      const len = 6 * expoOut(span(t, b.six - .12, b.six + .6)) + 2 * expoOut(span(t, b.eight - .12, b.eight + .6)) - 2 * expoOut(span(t, b.back - .1, b.back + .7)) + 2 * expoOut(span(t, b.longer - .1, b.longer + .6));
      if (len > 0) G.workArc(ctx, x, y, r, 7, len * (1 - p.home), t, { w: .14 });
    }
    ctx.restore();
  }
  const summerK = (t) => smooth(span(t, a.c08 + .2, b.light)) * (1 - .7 * smooth(span(t, b.promise - .2, b.today + 1.4)));

  // ============================================================================ P9: the summer evening
  function eveningPic(ctx, c, t) {
    if (t > b.lived + 1) return;
    const L = B.look(1, .55);
    const hz = expoOut(span(t, a.c08 + .2, a.c08 + 1.9));                          // the horizon draws out from under the sun
    const gd = sineIO(span(t, a.c08 + .7, b.evening + 1.3));                        // the land shades down from the line
    const roll = sineIO(span(t, b.promise - .15, b.promise + .9));                  // P10: the land rolls up into the line
    const out = (d) => sink(t, b.thats + .05 + d, .75);
    card(ctx, c, ZG, () => {
      const gh = 760 * gd * (1 - roll);
      if (gh > 1) { ctx.fillStyle = E.lin(ctx, 0, HZ, 0, HZ + 420, [[0, mixHex(P.ind1, P.shade0, .4)], [.12, mixHex(P.ind1, P.night1, .45)], [1, mixHex(P.night1, P.night0, .5)]]); ctx.fillRect(-3400, HZ, W + 4800, gh); }
      // the town on the horizon (rises outward from the sun; the factory far left)
      for (const hs of SKY8) {
        const k = rise(t, a.c08 + 1.0 + Math.abs(hs.x - SUN.x) / 2400, .9) * out(.2 + Math.abs(hs.x - SUN.x) / 5000);
        fromBase(ctx, HZ, 240, k, () => { ctx.save(); ctx.translate(hs.x, HZ + 1); if (hs.tree) B.drawTree(ctx, { h: hs.th, seed: hs.seed }, L, 1); else B.drawHouse(ctx, { ...hs }, L, { win: () => (hs.lit < .25 ? 1 : 0) }); ctx.restore(); });
      }
      const kf = rise(t, a.c08 + 1.3, 1.0) * out(.25);
      fromBase(ctx, HZ, 300, kf, () => {
        ctx.save(); ctx.translate(FAR.x, HZ + 1); ctx.scale(FAR.s, FAR.s);
        const off = smooth(span(t, b.over - .1, b.over + .9));                     // the shift is over: the windows go dark one after another
        B.drawFactory(ctx, L, t, { clock: { lit: 0 }, win: (i, row) => (((i * 7 + row * 3) % 4 === 0) && off < (i + row * 12) / 24 ? .7 : 0), smoke: false });
        ctx.restore();
      });
      // the horizon line (P10: it stays, it is the time axis)
      if (t <= b.promise + .9) K.trailSpan(ctx, [[lerp(SUN.x, -3400, hz), HZ, 3], [lerp(SUN.x, W + 1400, hz), HZ, 3]], 0, 1, { w: 2.2, spark: false, a: .85 });
    });
    card(ctx, c, F0, () => {
      // the river: it runs toward us from the sun's foot (clipped to the land, so it never pokes over the horizon)
      const pg = E.project(c, ZG, 0, HZ), mF = E.cardM(c, F0), clipY = (pg[1] - mF.f) / mF.k + 1;
      const ru1 = sineIO(span(t, b.shift - .3, b.light + .2)), ru0 = sineIO(span(t, b.thats + .2, b.promise + .7));
      const path = riverPoly(ru0, ru1);
      if (path && ru1 > ru0) {
        ctx.save(); ctx.beginPath(); ctx.rect(-2000, clipY, 6000, 3000); ctx.clip();
        ctx.fillStyle = E.lin(ctx, 0, HZ, 0, 1100, [[0, mixHex(P.shade0, P.ind1, .35)], [.3, mixHex(P.ind1, P.blue1, .5)], [1, mixHex(P.ind1, P.night1, .5)]]); ctx.fill(path);
        ctx.clip(path);
        // glints: the sun's light on the water (warm near the horizon, cool toward us)
        const r = E.prng(301);
        for (let i = 0; i < 70; i++) {
          const f = r(), ph = (r() + t * (.04 + .03 * r())) % 1, j = Math.min(RIV.length - 1, Math.floor(lerp(ru0, ru1, ph) * (RIV.length - 1))), p = RIV[j];
          const x = p[0] + (f - .5) * p[2] * 1.4, y = p[1] + (r() - .5) * 6, near = (p[1] - HZ) / 430, l = 6 + 26 * near * r();
          ctx.globalAlpha = (.25 + .55 * r()) * (1 - near * .5) * (.6 + .4 * Math.sin(t * 2.3 + i));
          ctx.fillStyle = near < .35 ? P.core1 : mixHex(P.blue2, P.cream, .4); ctx.fillRect(x - l / 2, y, l, 2);
        }
        ctx.restore();
      }
      // father and kid walk down to the river; he casts the rod
      walkers(ctx, t, out);
      // the porch: someone cranks the ice-cream churn (it rises as the glide reaches it)
      const kp = rise(t, b.porch - 1.0, 1.0) * sink(t, b.starting + .2, .8);          // it goes under while the glide is past it
      fromBase(ctx, PORCH8.y, 900, kp, () => {
        ctx.save(); ctx.translate(PORCH8.x, PORCH8.y); ctx.scale(PORCH8.s, PORCH8.s);
        B.drawPorch(ctx, L, t, { lamp: 0, door: .35 });
        cranker(ctx, -84, 0, 100, t, span(t, b.cranking - .2, b.cranking + .4));
        ctx.restore();
      });
      // the ball field: the diamond draws out from home plate, the players rise, the first pitch
      ballField(ctx, t, out);
    });
  }
  function walkers(ctx, t, out) {
    const k = walkK(t); if (k <= 0) return;
    const by = 870, kOut = sink(t, b.ball + .2, .8);                                  // they go under once the glide has left them
    fromBase(ctx, by, 560, kOut, () => {
      for (const who of ['k', 'f']) {
        const [x0, x1, h, cyc] = WALK[who], x = lerp(x0, x1, k), ph = k * cyc * Math.PI;
        ctx.save(); ctx.translate(x, by);
        const cast = sineIO(span(t, b.kid + .3, b.kid + 1.3));
        const o = { walk: ph, view: 'side', dir: -1, light: 1, back: .82, rim: mixHex(P.blue0, P.shade0, .45), hat: who === 'f' };
        if (who === 'f') o.armR = [lerp(.35, 1.25, cast), lerp(.9, 2.0, cast)];
        const hands = who === 'f' ? B.drawPerson(ctx, h, o) : E.person(ctx, 0, 0, h, { ...o, look: .3 * smooth(span(t, b.kid, b.kid + 1)) });
        if (who === 'f' && hands && hands.R) {
          const [hx, hy] = hands.R, ang = lerp(-1.25, -.78, cast) + .02 * Math.sin(t * 1.7), L = h * 1.05;
          const tx = hx - Math.cos(ang) * L, ty = hy + Math.sin(ang) * L;
          ctx.strokeStyle = mixHex(P.night1, P.blue1, .4); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();
          const ln = sineIO(span(t, b.kid + .8, b.kid + 1.8));                     // the line drops into the water
          if (ln > 0) { const wx = tx + 12, wy = 902 - by;   /* the line drops straight into the river below the tip */ ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(lerp(tx, wx, .7), lerp(ty, wy, .2), lerp(tx, wx, ln), lerp(ty, wy, ln)); ctx.stroke(); }
        }
        ctx.restore();
      }
    });
  }
  // someone on the porch turning the churn's crank (porch-local units)
  function cranker(ctx, x, y, h, t, on) {
    seated(ctx, x, y, h * .72, 1, t, 0);
    const cx = x + h * .36, by = y - 14;
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.beginPath(); ctx.moveTo(cx - h * .1, by); ctx.lineTo(cx - h * .12, by - h * .3); ctx.lineTo(cx + h * .12, by - h * .3); ctx.lineTo(cx + h * .1, by); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 1.2; ctx.stroke();
    const an = (t - b.cranking) * 6.5 * clamp(on * 2), hx = cx + Math.cos(an) * h * .08, hy = by - h * .36 + Math.sin(an) * h * .05;
    ctx.strokeStyle = mixHex(P.ind2, P.blue1, .45); ctx.lineWidth = h * .055; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + h * .02, by - h * .5); ctx.lineTo(lerp(x + h * .02, hx, .55), lerp(by - h * .5, hy, .55) + h * .04); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(cx, by - h * .3); ctx.lineTo(cx, by - h * .36); ctx.lineTo(hx, hy); ctx.stroke();
  }
  function ballField(ctx, t, out) {
    const F = FIELD, d = expoOut(span(t, b.ball - .5, b.ball + .8)) * (1 - smooth(span(t, b.thats + .1, b.thats + .8)));
    ctx.save(); ctx.translate(F.x, F.y); ctx.scale(F.s, F.s);                       // local units: home plate at (0, 0)
    const pts = [[0, 0], [140, -46], [0, -84], [-140, -46], [0, 0]];
    if (d > 0) K.trailSpan(ctx, pts.map(([x, y]) => [x, y, 2]), 0, d, { w: 1.2 / F.s * 2, spark: false, a: .6 });
    const PL = [[0, -42, 54, 0], [-20, 6, 58, 1], [-118, -64, 46, 0], [122, -62, 46, 0], [8, -98, 42, 0]];
    PL.forEach(([x, y, h, bat], i) => {
      const k = rise(t, b.ball - .3 + i * .1, .7) * out(.05 + i * .03); if (k <= 0) return;
      const sw = bat ? expoOut(span(t, b.starting + .35, b.starting + .55)) : 0;
      fromBase(ctx, y, h * 1.2, k, () => E.person(ctx, x, y, h, { dir: bat ? 1 : -1, light: -1, back: .6, rim: mixHex(P.blue0, P.shade0, .5), armR: bat ? [lerp(2.6, 1.2, sw), lerp(2.9, 1.4, sw)] : undefined }));
    });
    // the first pitch, hit high into the evening, toward the sun: the camera follows it back out to the wide line
    const pu = span(t, b.starting - .15, b.starting + .4), hu = span(t, b.starting + .45, b.starting + 2.5);
    if (pu > 0 && hu < 1) {
      let x, y, r = 4.2;
      if (hu <= 0) { x = lerp(0, -10, pu); y = lerp(-76, -28, pu); }
      else { const k = 1 - (1 - hu) ** 1.5; x = lerp(-10, 170, k); y = -28 - Math.sin(k * Math.PI * .55) * 230; r = 4.2 * (1 - .8 * k); }
      ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
    }
    ctx.restore();
  }

  // ============================================================================ P10–P13: the time axis, the vote, the departments
  function timelinePic(ctx, c, t) {
    if (t < b.promise - .2) return;
    card(ctx, c, F0, () => {
      // the axis (the horizon line, taken over from the land card)
      if (t > b.promise + .9) K.trailSpan(ctx, [[-1400, HZ, 3], [W + 1400, HZ, 3]], 0, 1, { w: 2.2, spark: false, a: .85 });
      const tick = (x, k, hh = 22) => { if (k > 0) { ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, HZ); ctx.lineTo(x, HZ - hh * k); ctx.stroke(); } };
      const gone = sink(t, b.leave + .35, .6);                                      // P13 end: the axis marks go under the line
      // TODAY (P10, slides out right when the axis rescales)
      const kT = rise(t, b.today - .1, .6) * (1 - smooth(span(t, b.not + .3, b.wanting + .5)));
      tick(XA(2026, t), kT); G.stamp(ctx, 'TODAY', XA(2026, t), HZ + 76, kT, { align: 'center' });
      // 1930 tick, the century bracket
      const k30 = rise(t, b.century - .2, .6) * gone; tick(XA(1930, t), k30);
      const br = smooth(span(t, b.century - .1, b.century + 1.0)), brOut = smooth(span(t, b.so - .1, b.so + .6));
      if (br > brOut) {
        const x0 = XA(1930, t) + 20, x1 = XA(2026, t) - 20, pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40; pts.push([lerp(x0, x1, f), HZ - 30 - Math.sin(f * Math.PI) * 120, 2]); }
        K.trailSpan(ctx, pts, brOut, br, { w: 1.6, spark: false, a: .8 });
      }
      G.stamp(ctx, 'ALMOST A CENTURY', (XA(1930, t) + XA(2026, t)) / 2, HZ - 182, smooth(span(t, b.century + .1, b.century + .8)) * sOut(t, b.so - .3, .6), { align: 'center' });
      // the TODAY dial (P11): small, cool, 8 hours
      const kd = rise(t, b.today2 - .15, .7) * sink(t, b.not + .1, .6);
      if (kd > 0) fromBase(ctx, HZ, 220, kd, () => {
        const x = XA(2026, t), y = HZ - 118, r = 70;
        ctx.fillStyle = E.rad(ctx, x, y - 10, r * 1.2, [[0, mixHex(P.blue2, P.cream, .35)], [1, mixHex(P.blue1, P.ind1, .4)]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
        G.dialTrack(ctx, x, y, r, 1); G.workArc(ctx, x, y, r, 9, 8 * expoOut(span(t, b.today2 + .1, b.today2 + .9)), t, { w: .16, lit: 0 });
      });
      // the cursor (a gold dot on the axis, left by the sun as it lifts off) and its year
      const yr = yearAt(t), cx = XA(yr, t), kc = smooth(span(t, b.so, b.so + .5)) * gone;
      if (kc > 0) {
        E.halo(ctx, cx, HZ, 40, .6 * kc, P.halo1, P.core1); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(cx, HZ, 7 * kc, 0, 6.29); ctx.fill();
      }
      const ky = rise(t, b.century, .6) * gone;
      if (ky > 0) {
        let i0 = 0; for (let i = 1; i < YEARS.length; i++) if (t >= YEARS[i][1]) i0 = i;
        const rolling = i0 > 0 && t < YEARS[i0][1] + 1.3, from = rolling ? YEARS[i0 - 1][0] : YEARS[i0][0], to = YEARS[i0][0], u = rolling ? span(t, YEARS[i0][1], YEARS[i0][1] + 1.3) : 1;
        const wv = K.measure('0', 100) * 1.02 * 4;
        ctx.save(); ctx.beginPath(); ctx.rect(-2000, HZ + 14, 6000, 200); ctx.clip(); ctx.translate(0, (1 - ky) * 190);
        G.yearRoll(ctx, cx - wv / 2, HZ + 128, 100, from, to, u);
        ctx.restore();
      }
      // ticks for 1943, 1946, 1985 (grow when the cursor gets there)
      tick(XA(1943, t), rise(t, b.war - .2, .5) * gone, 16); tick(XA(1946, t), rise(t, b.after + .4, .5) * gone, 16); tick(XA(1985, t), rise(t, b.nineteen - .1, .5) * gone, 16);
      // stamps of the events (above the axis, right of the dial)
      const sx = D8.x + D8.R * 1.45;
      G.stamp(ctx, 'WAR', sx, D8.y + 22, smooth(span(t, b.war - .05, b.war + .6)) * sOut(t, b.after - .3, .6));
      // P12: the vote of 1946 — ten workers on the axis, eight raise a hand
      for (let i = 0; i < 10; i++) {
        const k = rise(t, b.most - .15 + i * .05, .6) * sink(t, b.but - .15 + i * .04, .55); if (k <= 0) continue;
        const x = 900 + i * 86, yes = i !== 2 && i !== 7, up = yes ? expoOut(span(t, b.voted - .05 + i * .05, b.voted + .45 + i * .05)) : 0;
        fromBase(ctx, HZ, 150, k, () => E.person(ctx, x, HZ, 122, { light: -1, dir: i < 5 ? 1 : -1, armR: [lerp(.12, 2.95, up), lerp(.06, 3.08, up)] }));
      }
      G.stamp(ctx, 'VOTE: 6 HOURS', 900 + 4.5 * 86, HZ - 200, smooth(span(t, b.voted + .3, b.voted + 1.0)) * sOut(t, b.but - .3, .6), { align: 'center' });
      // P13: the factory front rises from the axis; every window a department
      factoryFront(ctx, t);
    });
  }
  function factoryFront(ctx, t) {
    const k = expoOut(span(t, b.but + .3, b.department + .5)) * sink(t, b.leave - .1, 1.0);
    if (k <= 0 && t < b.leave) return;
    const L = B.look(0);
    if (k > 0) fromBase(ctx, HZ, 520, k, () => {
      ctx.save(); ctx.translate(FX, HZ + 1); ctx.scale(FS8, FS8);
      B.drawFactory(ctx, L, t, { clock: { lit: 0 }, smoke: false, win: (i, row) => {
        if (i === LASTW[0] && row === LASTW[1] && t > b.leave - .1) return 0;      // the last window has come out of the wall
        const f = flipK(i, row, t); return f > 0 ? lerp(.85, -.75, f) : .85;
      } });
      ctx.restore();
      // the coins: one drops from each window that turns (a bit more pay); they lie on the axis
      for (const [i, row] of WINS) {
        const tf = FLIPS.get(i + ':' + row) + .12; if (t < tf) continue;
        const [wx, wy] = winPos(i, row), y0 = wy + 30 * FS8, dt = t - tf, g = 2400, yHit = HZ - 6, tHit = Math.sqrt(2 * (yHit - y0) / g);
        const y = dt < tHit ? y0 + .5 * g * dt * dt : yHit - Math.abs(Math.sin((dt - tHit) * 14)) * 10 * Math.exp(-(dt - tHit) * 9), lie = smooth(span(dt, tHit, tHit + .35));
        const x = wx + 10 + (dt < tHit ? 0 : 0);
        ctx.fillStyle = mixHex(P.cream, P.blue2, .35); ctx.beginPath(); ctx.ellipse(x, y, 8, lerp(8, 3.4, lie), 0, 0, 6.29); ctx.fill();
        ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 1.2; ctx.stroke();
      }
      // the last six-hour window keeps its glow
      const [lx, ly] = winPos(...LASTW), lw = 1 - flipK(...LASTW, t);
      if (lw > 0) E.halo(ctx, lx, ly, 90, .3 * lw * smooth(span(t, b.last - .2, b.held + .5)), P.halo1, P.core1);
    });
    G.stamp(ctx, 'LAST SIX-HOUR SHIFT', winPos(...LASTW)[0], HZ - 300, smooth(span(t, b.held - .1, b.held + .6)) * sOut(t, b.switch + .5, .6), { align: 'center' });
    // the last window, lifted out: it stays when the factory leaves, and comes forward (→ c09)
    if (t > b.leave - .1) {
      const [x, y, s] = lastWin(t), w = 34 * s, h = 56 * s;
      ctx.fillStyle = mixHex(P.night1, mixHex(P.blue2, P.cream, .3), .75); ctx.fillRect(x - w / 2, y - h / 2, w, h);
      ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 1.5; ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    }
  }

  KEYS.push([b.light, cam3({ x: 0, z: 60 })], [b.kid + .6, cam3({ x: 60, y: 110, z: 260 })], [b.cranking + .3, cam3({ x: -730, y: 90, z: 270 })],
    [b.starting + .45, cam3({ x: -1870, y: 60, z: 230 })], [b.promise + 1.2, cam3({ z: 0 })], [b.six, cam3({ z: 30 })], [b.war, cam3({ x: -40, z: 50 })],
    [b.voted + .5, cam3({ x: 60, z: 50 })], [b.one, cam3({ x: 110, z: 40 })], [b.eighty, cam3({ x: 60, z: 70 })], [b.leave, cam3({ z: 40 })], [b.c09, cam3({ z: 0 })]);

  BUILT = { T, draw, a, b };
  return draw;
}
