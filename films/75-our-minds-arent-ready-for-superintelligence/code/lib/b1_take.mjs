// Film 75 · builder B1 (c02–c05, 'To see what it is' → 'This channel exists') · the shared take.
// The four chunks are ONE continuous take on THE WALL (no W in shots.md 1.01–2.15): every sentence gets its own motif, the motifs live
// in different places on the wall and hand over through carriers (the pulse node, the thought, the headline, the hand, the struck line,
// the doubling bars, the flint, the niches → the card → the clip plate, the word → two sheets → the belt, the buckle → the cog, the cog
// rolls to the ozone ring and onto the treaty, the HUD lifts into the big gauges → plateClocks). The camera glides over the wall with
// the carriers (X.viewPath, log scale); the inner chunk seams are frames of this one draw, so they are identical by construction.
// Each scene file (scenes/sc02…sc05.mjs) exports part(K) = { keys, lights, beats } for its sentences; this file holds the anchors (all
// phrases, one table), the layout on the wall, the persistent objects (the three niches, the HUD) and the assembly.
// Owned by B1. Kit / world / explain are imported, never edited.
import * as E from './f10_editorial.mjs';
import * as F from './f75_kit.mjs';
import * as S from './f75_world.mjs';
import * as X from './f75_explain.mjs';
export const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, smooth, lin, rad, prng } = E;
export { E, F, S, X };
export const SRC = F.SOURCES;
export const { GOLD, COOL, CREAM, CREAM2, OCHRE, COAT, PAPER, FLINT } = F;
export const PR = F.PRINT75;
// label envelope: wipes up over d from a, sinks behind its mask from b − .45
export const lab = (t, a, b, d = .7) => span(t, a, a + d) * (1 - span(t, b - .45, b + .1));
export const ease = (t, a, b) => sineIO(span(t, a, b));
export const bump = (t, a, d) => Math.sin(Math.PI * span(t, a, a + d));
// strings the kit does not carry (reported to the lead): SRC.early is defined twice in F.SOURCES ('5 YEARS EARLY' is shadowed by
// 'AN EARLY TEST'), so the olympiad bracket uses this constant; PULSE / READING are the two marks of shot 1.02, READING_SPAN the sliver of 1.03.
// lead 25.11.: readingSpan without a figure: '~5,000 years' (the age of writing) is not in faktencheck.md / faktenzettel.md and not spoken
export const XS = { early5: SRC.early5, pulse: SRC.pulse, reading: SRC.reading, readingSpan: SRC.reading };

// ------------------------------------------------------------------------------------------------ the layout on the wall (wall units)
export const L = {
  PH: { x: 831.6, y: 1980.9, rx: 805.8, ry: 1926.9, w: 51.6, h: 108 },   // the phone in plateSofa (S.sofaScene at SOFA_AT)
  CHEST: [1026.8, 2051.8], HEADP: [1032, 1976.4],
  AX: { y: 1720, x0: 640, x1: 1420, pulse: 770, read: 1250, far: -2350 },  // 1.02/1.03: the time axis (PULSE · READING), then far left
  ANI: { y: 1720, hunter: -1700, wolf: -2040, mouse: -2330 },             // 1.04 the mammals on the axis line
  NI: { x: -1950, y: 1250, w: 170 },                                       // the three niches (F.reflexes): centres x ± 229.5
  OFF: { floor: 1900, desk: 1740, you: -2330, col: -1940, glass: -1690, comp: -1500 },   // 1.10–1.13 the office under the niches
  SITE: { x0: -1120, x1: -150, y: 1820, hands: 1395, card: [-635, 1180] },               // 1.14–1.18 the hands over the halls
  CH: { x0: -1500, x1: 450, y: 950, y2019: 2019, y2026: 2026 },             // 1.20–1.26 the chart (line, doubling bars, task length)
  FL: { x: -2950, y: 640, s: 470 },                                         // 1.27 the flint tablet
  TB: { x0: -3500, x1: -2400, yY: 1000, yM: 1110 },                        // 1.28 YEARS / MONTHS bars
  WI: { x: -1950, y: 1150 },                                                // 1.29–1.34 the card, the plate, Wilson's words, the sheets
  SO: { x: -1950, y: 2280 },                                                // 1.35 the sofa of the seat belt (X.sofa floor line)
  COG: { x: -1950, y: 1500, r: 150 },                                       // 1.36 the big dashed cog
  ACT: { x0: -1650, perYear: 190, y: 1600 },                                // 2.01–2.05 the EU AI Act axis (2021 → 2028)
  OZ: { x: -820, y: 1330, r: 190 },                                         // 2.07–2.13 the ozone ring
  MT: { x0: -470, x1: 230, y: 1640 },                                       // 2.09 May 1985 → Sept 1987
  TR: { x: 230, y: 1400, w: 280 },                                          // 2.09–2.14 the treaty sheet
  BIG: { x: 960, y: 560, k: 2.4 },                                          // plateClocks
};
L.NI.step = L.NI.w * 1.35; L.NI.xs = [-1, 0, 1].map((i) => L.NI.x + i * L.NI.step); L.NI.icy = L.NI.y - L.NI.w * 1.25 * .45;
export const yearX = (y) => L.ACT.x0 + (y - 2021) * L.ACT.perYear;
// the chart (1.20–1.26): years → x (2019 → −1500 … 2026 → −300 … 2030), a schematic exponential (no y values on screen)
export const chX = (yr) => lerp(L.CH.x0, -300, (yr - 2019) / 7);
export const chY = (yr) => L.CH.y - 25 * Math.exp(.617 * (yr - 2019));
// a tag: a hairline pill with caps (like X.dateTag, but sized for the view: size = wall units)
export function tag(ctx, txt, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 30, k = expoOut(clamp(u)), w = F.measure(txt, size, false, 600) + txt.length * size * .06 + size * 1.6, h = size * 1.75;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2); ctx.translate(x, y + (1 - k) * 16);
  ctx.fillStyle = rgba(P.night0, .72); ctx.strokeStyle = rgba(o.col ?? CREAM, .6); ctx.lineWidth = Math.max(1.5, size * .06);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w * k, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  X.label(ctx, txt, x, y + size * .36, span(u, .3, 1), { size, weight: 600, spacing: .06, col: o.col ?? CREAM });
}

// ------------------------------------------------------------------------------------------------ the anchors (phrases only)
function anchors(T, a0) {
  const G = (p, after = a0, n = 0) => T.G(p, n, after), GE = (p, after = a0, n = 0) => T.GE(p, n, after);
  const w = (word, after) => T.G(word, 0, after);   // a word inside a sentence (after the sentence start)
  const A = { a0 };
  // c02
  A.goBack = w('go', a0); A.headlineW = w('headline.', a0);
  A.why = G('Why did your pulse'); A.pulseW = w('pulse', A.why); A.jump = w('jump', A.why); A.readW = w('read', A.why); A.wordW = w('word?', A.why);
  A.because = G('Because the alarm'); A.alarm = w('alarm', A.because); A.older = w('older', A.because); A.reading = w('reading.', A.because);
  A.every = G('Every mammal carries'); A.mammal = w('mammal', A.every); A.carries = w('carries', A.every); A.version = w('version', A.every);
  A.first = G('That is the first of three'); A.three = w('three', A.first); A.reflexes = w('reflexes.', A.first);
  A.fear = G('Fear, before thought'); A.beforeT = w('before', A.fear); A.thought = w('thought.', A.fear);
  A.bad = G('And bad news pulls'); A.pulls = w('pulls.', A.bad);
  A.test = G('In a huge test'); A.headlines = w('headlines,', A.test); A.extra = w('extra', A.test); A.negative = w('negative', A.test); A.brought = w('brought', A.test);
  A.clicks = w('clicks.', A.test);
  A.second = G('The second reflex'); A.better = w('better.', A.second); A.feels = w('feels', A.second);
  A.somebody = G('Somebody near you'); A.ahead = w('ahead', A.somebody); A.withAI = w('AI.', A.somebody);
  A.colleague = G('A colleague'); A.competitor = G('A competitor');
  A.something = G('And something in you says'); A.grab = w('grab', A.something); A.they = w('they', A.something);
  // c03
  A.companies = G('Companies have it too'); A.too = w('too.', A.companies);
  A.biggest = G('The biggest pour fortunes'); A.pour = w('pour', A.biggest); A.fortunes = w('fortunes', A.biggest); A.noChoice = w('no', A.biggest + 2.5);
  A.scientist = G('The scientist who co-chairs'); A.united = w('United', A.scientist); A.answered = w('answered', A.scientist); A.council = w('Security', A.scientist);
  A.c2 = F.clipWin(T, 'C2');
  A.notLaw = G('Not a law of nature'); A.natureE = GE('Not a law of nature'); A.choice = G('A choice', A.notLaw);
  A.third = G('The third reflex'); A.quiet = w('quiet', A.third); A.late = w('makes', A.third);
  A.expects = G('Your brain expects tomorrow'); A.today = w('today,', A.expects); A.plus = w('plus', A.expects);
  A.notAdd = G("But this machine doesn't add"); A.doesnt = w("doesn't", A.notAdd);
  A.doubles = G('It doubles', A.notAdd); A.doublesW = w('doubles.', A.doubles);
  A.measure = G('On one leading measure'); A.task = w('task', A.measure); A.dbl2 = w('doubles', A.measure); A.months35 = w('months.', A.measure);
  // c04
  A.experts = G('Even the experts missed'); A.missed = w('missed.', A.experts);
  A.reached = G('AI reached gold-medal'); A.olympiad = w('Olympiad', A.reached); A.five = w('five', A.reached); A.expected = w('expected', A.reached);
  A.ifEven = G('If even the experts'); A.farOff = w('far', A.ifEven); A.whose = w('whose', A.ifEven); A.superI = w('superintelligence?', A.ifEven);
  A.fair = G('To be fair'); A.defines = w('defines', A.fair); A.researcher = w('researcher', A.fair); A.adapt1 = w('adapt.', A.fair);
  A.trueW = G('True.', A.fair); A.overYears = G('But we adapt over years'); A.years = w('years.', A.overYears);
  A.moves = G('The machine moves in months'); A.monthsW = w('months.', A.moves);
  A.wilson = G('had a sentence for this'); A.wilsonS = G('The scientist E', A.moves); A.chatgpt1 = w('ChatGPT:', A.wilson);
  A.k1 = F.clipWin(T, 'K1');
  A.talking = G("He wasn't talking about AI"); A.listen = G('But listen to the middle'); A.middle = w('middle', A.listen);
  A.institutions = G('Institutions.', A.listen); A.rules = G('Rules.', A.institutions); A.laws = G('Laws.', A.institutions);
  A.belt = G('A seat belt for the brain'); A.holds = w('holds,', A.belt); A.attention = w('attention.', A.belt);
  A.howFast = G('So how fast do rules move'); A.moveQ = w('move?', A.howFast);
  // c05
  A.take = G("Take Europe's AI law"); A.law = w('law.', A.take);
  A.proposed = G('It was proposed before'); A.propW = w('proposed', A.proposed); A.chatgpt2 = w('ChatGPT', A.proposed);
  A.lastRules = G("Its last rules won't apply"); A.y2028 = w('twenty-eight.', A.lastRules);
  A.seven = G('More than seven years'); A.machineDbl = G('For a machine that doubles'); A.dbl3 = w('doubles', A.machineDbl); A.fewM = w('months.', A.machineDbl);
  A.lazy = G('Not out of laziness'); A.pushed = w('pushed', A.lazy); A.standards = w('standards', A.lazy); A.ready = w('ready.', A.lazy);
  A.tooSlow = G('So are rules just too slow'); A.slowW = w('slow', A.tooSlow);
  A.oneCase = G('One case says no'); A.noW = w('no.', A.oneCase);
  A.eighties = G('In the nineteen eighties'); A.hole = w('hole', A.eighties); A.ozone = w('ozone', A.eighties);
  A.twoYears = G('A little over two years'); A.treatyW = w('treaty', A.twoYears); A.signed = w('signed.', A.twoYears);
  A.update = G('And that treaty has an update'); A.updW = w('update', A.update);
  A.tight = G('It can be tightened'); A.tightW = w('tightened', A.tight); A.over = w('over.', A.tight);
  A.again = G('It has been, again'); A.againW = w('again', A.again);
  A.sky = G('The sky still needs decades'); A.heal = w('heal.', A.sky);
  A.fast = G('But the rule came fast'); A.learning = w('learning.', A.fast);
  A.canSet = G('So the slower clock can be set'); A.setW = w('set.', A.canSet);
  A.done = G('It has been done', A.canSet); A.notFew = G('Just not in a few months'); A.fewMonths = w('months.', A.notFew);
  A.end = G('This channel exists', a0);
  A.plate = A.end - S.SEAM_HALF;
  return A;
}

// ------------------------------------------------------------------------------------------------ shared drawing helpers
// sink/rise an object behind a ground line: clip above yBase, shift down by (1 − u) of h (u = 1: fully up)
export function ground(ctx, u, x0, x1, yBase, h, fn) {
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, yBase - h * 1.6, x1 - x0, h * 1.6 + 2); ctx.clip();
  ctx.translate(0, (1 - expoOut(u)) * h); fn(); ctx.restore();
}
// a grasping hand reaching DOWN (wrist above, fingers below; the GRAB niche icon turned over), centred x, y (the palm), size s,
// g = grab 0..1 (the fingers curl), o.rot (tilt), o.flip 0..1 (0 = fingers up like the niche icon, 1 = down), o.col, o.glow, o.a
export function grabHand(ctx, t, x, y, s, g, o = {}) {
  const col = o.col ?? OCHRE.mid; g = smooth(clamp(g));
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate((o.rot ?? 0) + Math.PI * (1 - (o.flip ?? 1)));
  if (o.glow) halo(ctx, 0, s * .3, s * 2, .35 * o.glow, OCHRE.mid, OCHRE.hot);
  ctx.fillStyle = mixHex(col, P.night0, .25); ctx.beginPath(); ctx.roundRect(-s * .27, -s * 1.05, s * .54, s * .75, s * .12); ctx.fill();   // wrist
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-s * .42, -s * .42, s * .84, s * .64, s * .22); ctx.fill();                           // palm
  ctx.strokeStyle = rgba(OCHRE.hot, .55); ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(-s * .3, -s * .4); ctx.lineTo(s * .3, -s * .4); ctx.stroke();
  ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = s * .16;
  for (let f = 0; f < 4; f++) {   // fingers: down, then the outer joint curls back under the palm
    const fx = -s * .3 + f * s * .2, Lf = s * (.5 - Math.abs(f - 1.5) * .05), y0 = s * .14, q1 = Math.PI / 2 - g * .5, q2 = q1 + g * 1.9;
    const x1 = fx + Math.cos(q1) * Lf * .55, y1 = y0 + Math.sin(q1) * Lf * .55;
    ctx.beginPath(); ctx.moveTo(fx, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1 + Math.cos(q2) * Lf * .45, y1 + Math.sin(q2) * Lf * .45); ctx.stroke();
  }
  const qt = Math.PI * .8 - g * .6; ctx.beginPath(); ctx.moveTo(-s * .38, -s * .1); ctx.lineTo(-s * .38 + Math.cos(qt) * s * .42, -s * .1 + Math.sin(qt) * s * .42); ctx.stroke();   // thumb
  ctx.restore();
}
// a headline card (a cool screen with the "AI" line and bars; neg = how many bars are ochre negative words, negU 0..1 per word)
export function hlCard(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = w * (o.hk ?? .62), k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 24); ctx.scale(lerp(.85, 1, k), lerp(.85, 1, k));
  halo(ctx, 0, 0, w * 1.1, .22 * (o.glow ?? 1), COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(P.night1, mixHex(COOL.deep, COOL.body, .5), .9); ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = Math.max(1.5, w * .008);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .05); ctx.fill(); ctx.stroke();
  const bh = w * .075, r = prng(o.seed ?? 11), negs = o.neg ?? [];
  ctx.font = `${Math.round(bh * 1.3)}px "Inter Black"`; ctx.fillStyle = COOL.core; ctx.textBaseline = 'alphabetic';
  const x0 = -w * .42, aiW = ctx.measureText('AI').width; ctx.fillText('AI', x0, -h * .22 + bh * .5);
  const rows = [[x0 + aiW + bh * .5, w * .42, -h * .22 - bh * .55], [x0, w * .42, -h * .22 + bh * 1.4], [x0, w * (.1 + r() * .2), -h * .22 + bh * 2.9]];
  let j = 0;
  rows.forEach(([a, b, yy], i) => { let xx = a;
    while (xx < b - bh) { const ww = Math.min(b - xx, bh * (1.6 + r() * 2.2)); const ni = negs[j] ?? 0;
      ctx.fillStyle = mixHex(COOL.core, OCHRE.body, ni); ctx.fillRect(xx, yy, ww, bh * (i ? .75 : .95));
      if (ni > 0) { ctx.fillStyle = rgba(OCHRE.hot, ni); ctx.fillRect(xx, yy + bh * (i ? .75 : .95) + bh * .14, ww * ni, Math.max(2, bh * .14)); }
      xx += ww + bh * .4; j++; } });
  ctx.restore();
  return { x: x - w / 2, y: y - h / 2, w, h };
}
// the wall → screen rect of a wall rect
export const rectToScreen = (v, x, y, w, h) => { const [sx, sy] = X.toScreen(v, x, y); return { x: sx, y: sy, w: w * v.s, h: h * v.s }; };

// ------------------------------------------------------------------------------------------------ the assembly
const CACHE = new WeakMap();
export function take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const p = (async () => {
    const a0 = T.G('To see what it is'), A = anchors(T, a0);
    const K = { T, A, L };
    const parts = [];
    for (const n of ['02', '03', '04', '05']) { const m = await import(new URL(`../scenes/sc${n}.mjs`, import.meta.url).href); parts.push(m.part(K)); }
    const keys = parts.flatMap((p) => p.keys).sort((a, b) => a[0] - b[0]);
    const lights = parts.flatMap((p) => p.lights ?? []).sort((a, b) => a[0] - b[0]);
    const beats = parts.flatMap((p) => p.beats).concat(nicheBeat(K)).map((b, i) => ({ z: 0, ...b, i })).sort((a, b) => a.z - b.z || a.i - b.i);
    const hudHide = (t) => parts.reduce((m, p) => Math.max(m, p.hudHide ? p.hudHide(t) : 0), 0);
    // the view: the plate's creep for the first .5 s, then the keyed glide (monotone cubic, log scale)
    const plateV = (t) => ({ ...S.SOFA_VIEW, s: S.creep(t, T, 'To see what it is') });
    const v0 = plateV(a0 + S.SEAM_HALF);
    const K2 = [[a0 + S.SEAM_HALF, v0], ...keys];
    const view = (t) => (t < a0 + S.SEAM_HALF ? plateV(t) : X.viewPath(t, K2));
    const light = (t) => {   // the warm light pool: glides between keyed spots, breathes a little
      let lx = lights[0][1], ly = lights[0][2];
      for (let i = 1; i < lights.length; i++) { const [tk, x, y, d = 1.6] = lights[i]; const e = ease(t, tk, tk + d); if (e <= 0) break; lx = lerp(lx, x, e); ly = lerp(ly, y, e); }
      const dw = span(t, a0 + S.SEAM_HALF, a0 + 2.5) * (1 - span(t, A.plate - 2.5, A.plate));   // the plates have a fixed pool
      return [lx + dw * 40 * Math.sin(t * .23), ly + dw * 26 * Math.sin(t * .31 + 1)];
    };
    function draw(ctx, t) {
      const v = view(t), [lx, ly] = light(t);
      X.wall(ctx, t, v, { lx, ly });
      const act = beats.filter((b) => t >= b.a && t < b.b);
      X.inView(ctx, v, () => { for (const b of act) if (b.wall) b.wall(ctx, t, v); });
      for (const b of act) if (b.screen) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); b.screen(ctx, t, v); ctx.restore(); }
      F.clocksHud(ctx, t, T, { hide: hudHide(t) });
      for (const b of act) if (b.top) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); b.top(ctx, t, v); ctx.restore(); }
    }
    const tk = { A, L, view, draw, beats };
    // the entries of one chunk: the plate of the left seam, the take, the plate of the right seam (same draw = no visible cut)
    tk.entries = (R) => {
      const out = [];
      if (Math.abs(R.a - a0) < 1e-3) { out.push({ t: R.a, draw: (ctx, t) => S.plateSofa(ctx, t, T), print: PR }, { t: R.a + S.SEAM_HALF, draw, print: PR }); }
      else out.push({ t: R.a, draw, print: PR });
      if (Math.abs(R.b - A.end) < 1e-3) out.push({ t: A.plate, draw: (ctx, t) => S.plateClocks(ctx, t, T), print: PR });
      return out;
    };
    return tk;
  })();
  CACHE.set(T, p);
  return p;
}

// ------------------------------------------------------------------------------------------------ the three niches (persistent, c02 → c04)
// Cut in at 'three' (1.05) under the mammals, FEAR lit; GRAB warms gold (1.09) and its hand closes (1.13), the hand clones out (1.14);
// STRAIGHT LINE draws (1.19), its line flies out into the chart (1.20); seen again under the curve (1.26); at 'months' (1.29) the three
// slide together into one card (drawn by sc04), so they end there.
function nicheBeat(K) {
  const { A } = K, N = L.NI;
  return {
    a: A.first - .2, b: A.monthsW + 1.2, z: 1,
    wall(ctx, t) {
      const slide = ease(t, A.monthsW - .3, A.monthsW + .9);   // 1.29: the three slide together into one card
      const on = [0, 1, 2].map((i) => span(t, A.three - .45 + i * .08, A.three + .55 + i * .08));
      const lit = [span(t, A.reflexes - .1, A.reflexes + .5) * (1 - .6 * span(t, A.second, A.second + .8)) + .5 * bump(t, A.fear - .05, .7),
        span(t, A.feels - .3, A.feels + .5) * (1 - .5 * span(t, A.companies + 1, A.companies + 2)),
        span(t, A.third + .5, A.quiet + .4) * (1 - .5 * span(t, A.expects + .6, A.expects + 1.6))];
      const labelU = [span(t, A.reflexes - .2, A.reflexes + .5), span(t, A.feels - .2, A.feels + .5), span(t, A.quiet - .2, A.quiet + .5)];
      const grab = lerp(.3, 1, ease(t, A.grab - .35, A.grab + .2)) * (1 - ease(t, A.companies - .3, A.companies + .3)) + .3 * ease(t, A.companies - .3, A.companies + .3);
      const line = ease(t, A.quiet + .15, A.late + .3);
      const k = 1 - slide * .7;
      ctx.save(); ctx.translate(N.x, N.y); ctx.scale(k, k); ctx.translate(-N.x, -N.y);
      if (slide > 0) { ctx.translate(N.x, 0); ctx.scale(1 - slide * .45, 1); ctx.translate(-N.x, 0); }
      ctx.globalAlpha *= 1 - span(slide, .6, 1);
      // 1.27–1.28 (flint, YEARS) they sink behind their floor line, on 'The machine moves' they rise again to slide together
      const up = 1 - span(t, A.fair + .2, A.fair + 1.2) * (1 - span(t, A.moves - .2, A.moves + .7));
      ground(ctx, up, N.x - 700, N.x + 700, N.y + 72, 300, () => F.reflexes(ctx, t, N.x, N.y, N.w, { on, lit, labelU: labelU.map((u) => u * (1 - span(slide, 0, .4))), grab, line }));
      ctx.restore();
    },
  };
}
