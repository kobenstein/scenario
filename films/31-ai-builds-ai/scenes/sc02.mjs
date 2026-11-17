// c02 · The ladder · built by B1. ALSO THE GROUP ENGINE of B1 (c02–c06): one world, ONE continuous camera, one draw function for the
// whole group 'Picture a ladder' → "So don't take Anthropic's word". sc03–sc06 return the same scene (their entry starts at their own R.a),
// so the inner seams c02|c03|c04|c05|c06 are the same picture on both sides by construction. Each chunk file holds its own explainer
// layer (layer(ctx, t, a, T, X)); this file holds the anchors, the camera, the world state, the veil, the HUD moments and c02's layer.
// Seams: in = S.plateLadder (lamp off, ladder of light) · out = S.plateClimb (WIDE_CAM, lamp on, rungs CLIMB, HUD). Plan: docs/shots.md.
//
// | ID   | anchor (phrase)                      | picture (one idea)                                                              | camera · carrier            |
// |------|--------------------------------------|---------------------------------------------------------------------------------|-----------------------------|
// | 2.01 | Picture a ladder                     | out of plateLadder: the light cools to metal (2.2 s), TODAY at your feet, THAT   | creep on (LADDER_CAM) · MIX |
// |      |                                      | MACHINE at the core, the five rung names rise                                    |   → rung 1                  |
// | 2.02 | A.I. already stands on the first rung| the small climbing machine rolls onto rung 1; rung 1 fills gold on "writing"     | creep · the top rung        |
// | 2.03 | And the last rung decides            | tilt up the ladder to rung 5 (the lever, cream, a warm glow)                     | tilt up 2.4 s · the ring    |
// | 2.04 | The lab is Anthropic                 | ANTHROPIC on the ring; veil: 9 OF 10 · ≈ 30,000 return, stamp ITS OWN NUMBERS     | creep · EXPL · a builder    |
// | 2.05 | In a new interview                   | veil lifts; the camera finds one builder at the ring; its gold eye grows         | glide 3.2 s · the eye       |
// | 2.06 | slot T2                              | CLIP T2 grows out of the eye (Tao Lin · personal view) and goes back into it      | CLIP · the eye              |
// | 2.07 | In a year                            | the tag IN A YEAR? drops from the builder; ONE INSIDER'S FORECAST                 | hold · the ladder           |
// | 2.08 | So test it, rung by rung             | pull back; the ladder lifts a copy of itself into the corner: THE LADDER HUD      | pull back · the HUD         |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import * as S from '../lib/f31_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo } = E;
const { rise, FORGE, COOL, F0 } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT31;

// ================================================================================================================ anchors (phrases only)
export function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c02
  a.A = G('Picture a ladder'); a.between = G('between today', a.A); a.stands = G('already stands on', a.A); a.writing = G('writing the code', a.A);
  a.last = G('And the last rung'); a.decides = G('decides how', a.last);
  a.lab = G('The lab is Anthropic'); a.own = G('its own numbers', a.lab); a.interview = G('In a new interview'); a.leads = G('says where this leads', a.interview); a.tao = G('Tao Lin, giving');
  a.T2 = T.clip('T2'); a.inyear = G('In a year', a.T2.end - .5); a.insider = G("That's one insider's"); a.alarmed = G('the more alarmed', a.insider); a.test = G('So test it');
  // c03
  a.google = G('At Google too'); a.most = G('writes most of', a.google); a.sofar = G('But so far'); a.noclear = G('no clear speed-up', a.sofar); a.whole = GE('as a whole', a.sofar);
  a.first = G('So the first step'); a.taken1 = G('taken', a.first); a.typing = G('But typing code'); a.science = G('Science is finding'); a.canm = G('Can a machine do');
  // c04
  a.verdict = G("By Anthropic's own verdict"); a.yes = G('yes', a.verdict); a.describe = G('Describe an experiment'); a.skilled = G('as well as a skilled', a.describe); a.better = G('Or better', a.describe);
  a.yago = G('A year ago', a.verdict); a.goal = G('set a goal', a.yago); a.intern = G('research intern', a.yago); a.sept = G('September came'); a.says = G('OpenAI says the intern');
  a.outsider = G('No outsider has checked'); a.steering = G('heavy steering', a.outsider); a.second = G('So the second rung'); a.taken2 = G('taken', a.second); a.word = G("On the labs' own word");
  a.cond = G('But listen to the condition'); a.clearly = G('describe it clearly', a.cond); a.who = G('So who decides which');
  // c05
  a.until = G('Until this year'); a.people = G('people', a.until); a.feb = G('In February'); a.less = G('less than one percent', a.feb); a.months = G('A few months later'); a.quarter = G('About a quarter');
  a.led = G('works the way you use'); a.rough = G('you set a rough goal'); a.most2 = G('it does most of the work'); a.check = G('and you check the result');
  a.nowhere = G('But nowhere'); a.fully = G('fully on its own', a.nowhere); a.knowing = G('And knowing which question'); a.strength = G('still a human strength'); a.fornow = G('For now', a.knowing);
  a.r3 = G('So, rung three'); a.shared = G('shared', a.r3); a.growing = G("And the machine's share"); a.movies = G('The movies promised'); a.secret = G('in secret', a.movies);
  a.happening = G("It's happening on a ladder"); a.measured = G('one measured rung'); a.headline = G('So the next time a headline'); a.building = G('is building', a.headline); a.which = G('on which rung', a.headline);
  a.second2 = G('And then a second one'); a.howfast = G('how fast is the climb');
  // c06
  a.channel = G('This channel exists'); a.everybody = G('well for everybody', a.channel); a.including = G('Including the part where'); a.machines = G('start building machines', a.including);
  a.want = G('Want that too'); a.sub = G('Then subscribe'); a.hf = G('How fast? For you'); a.decide1 = G('that decides one thing', a.hf); a.rules = G('how much time is left', a.hf);
  a.Z = G("So don't take Anthropic's word");
  return a;
}

// ================================================================================================================ shared helpers (sc03–sc06 use them)
// draw fn() under an outer screen matrix m, even through code that calls ctx.setTransform (the kit's HUD does): the HUD can grow big.
export function withM(ctx, m, fn) {
  const orig = ctx.setTransform; ctx.save();
  ctx.setTransform = function (A, B, C, D, Ee, Ff) {
    if (typeof A === 'object') ({ a: A, b: B, c: C, d: D, e: Ee, f: Ff } = A);
    return orig.call(this, m.a * A + m.c * B, m.b * A + m.d * B, m.a * C + m.c * D, m.b * C + m.d * D, m.a * Ee + m.c * Ff + m.e, m.b * Ee + m.d * Ff + m.f);
  };
  try { ctx.setTransform(1, 0, 0, 1, 0, 0); fn(); } finally { delete ctx.setTransform; ctx.restore(); }
}
// the HUD's geometry (lib/f31_kit.mjs ladderHUD: foot (108, 290), h 210) mapped by { s, k (shear = lean / h), fx, fy } (foot on screen)
export const HUDFOOT = [108, 290];
export const hudM = ({ s, k = 0, fx, fy }) => ({ a: s, b: 0, c: -k * s, d: s, e: fx - s * HUDFOOT[0] + k * s * HUDFOOT[1], f: fy - s * HUDFOOT[1] });
export const HUD0 = { s: 1, k: 0, fx: HUDFOOT[0], fy: HUDFOOT[1] };
export const HUDBIG = { s: 2.8, k: 0, fx: 700, fy: 860 };
export const mixG = (A, B, p) => ({ s: Math.exp(lerp(Math.log(A.s), Math.log(B.s), p)), k: lerp(A.k, B.k, p), fx: lerp(A.fx, B.fx, p), fy: lerp(A.fy, B.fy, p) });
// rung k of the HUD in HUD-local px: [x0, x1, y]
export function hudRung(k) { const h = 210, w = 58, y = HUDFOOT[1] - h * (k + 1) / 6, half = lerp(w / 2, w * .42, (k + 1) / 6) - 3 * .2; return [HUDFOOT[0] - half, HUDFOOT[0] + half, y]; }
export const mapPt = (m, x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];

// a builder (a small machine: dark circle body, one gold eye, a short arm). Screen or card px. o: { eye (eye glow 0..2), arm (angle), armL, roll, a }
export function bot(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.arm != null) {
    const L = s * (o.armL ?? 2.2), ex = x + Math.cos(o.arm) * L, ey = y + Math.sin(o.arm) * L;
    ctx.strokeStyle = mixHex(P.ind2, P.blue2, .6); ctx.lineWidth = s * .35; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
    if (o.spark) { const fl = o.spark * clamp(Math.sin(t * 7.3) * 1.4 + .3); if (fl > 0) halo(ctx, ex, ey, s * 2.4, .7 * fl, FORGE.halo, FORGE.core); }
  }
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(FORGE.line, .45); ctx.lineWidth = Math.max(1, s * .12); ctx.stroke();
  if (o.roll != null) { ctx.strokeStyle = rgba(FORGE.line, .3); ctx.lineWidth = Math.max(1, s * .08); for (let q = 0; q < 3; q++) { const an = o.roll + q * TAU / 3; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * s * .5, y + Math.sin(an) * s * .5); ctx.lineTo(x + Math.cos(an) * s * .85, y + Math.sin(an) * s * .85); ctx.stroke(); } }
  const eg = o.eye ?? 1;
  halo(ctx, x, y, s * (2.2 + eg * 1.2), .35 + .2 * eg, FORGE.halo, FORGE.hot); ctx.fillStyle = FORGE.hot; ctx.beginPath(); ctx.arc(x, y, s * (.32 + .1 * eg), 0, TAU); ctx.fill();
  ctx.fillStyle = FORGE.core; ctx.beginPath(); ctx.arc(x, y, s * .14 * (1 + eg * .4), 0, TAU); ctx.fill();
  ctx.restore();
}
// screen-space layer helper: rise in from below with a mask-free slide (u 0..1) and sink out (o 0..1)
export const slideY = (u, out, d = 60, dOut = 700) => (1 - expoOut(clamp(u))) * d + sineIO(clamp(out)) * dOut;

// the hero builder at the ring (machine card px): the one whose eye becomes the clip plate
export const HERO = { x: S.MACH.x + S.MACH.r * 1.22, y: S.MACH.y + S.MACH.r * .62, s: 32 };

// ================================================================================================================ the group entry
export async function group(T, R) {
  E.prepareEditorial();
  const a = anchors(T);
  const mods = await Promise.all(['03', '04', '05', '06'].map((n) => import(new URL(`./sc${n}.mjs`, import.meta.url).href)));
  const layers = [layer02, ...mods.map((m) => m.layer)];
  return [{ t: R.a, draw: scene(a, T, layers), print: PRINT }];
}
export default (T, R) => group(T, R);

// ================================================================================================================ the scene
const LCAM = (k = 1, tr = 0) => S.LADDER_CAM(k, tr);
const MCAM = (u, v, s, sx, sy) => E.aim(S.Z_MACH, u, v, s, sx, sy);
const FCAM = (u, v, s, sx, sy) => E.aim(F0, u, v, s, sx, sy);
const HCAM = (u, v, s, sx, sy) => E.aim(S.Z_HALL, u, v, s, sx, sy);

function scene(a, T, layers) {
  const tIn = a.A + S.SEAM_HALF, tOut = a.Z - S.SEAM_HALF, tCreep = tOut - 2.6;
  const creepIn = (t) => { const k = S.creep(t, T, 'Picture a ladder'); return LCAM(k, S.trk(k) * .4); };
  const creepOut = (t) => { const k = 1 + S.CREEP * (t - tOut); return S.WIDE_CAM(k, S.trk(k) * .4); };
  // ---------------------------------------------------------------- the camera (one take, keys on phrases)
  const K = [
    [tIn - 1, creepIn(tIn - 1)], [tIn, creepIn(tIn)], [tIn + 1, creepIn(tIn + 1)],
    [a.last - .2, LCAM(1.12, 34)],                                              // 2.01–2.02: the slow push holds on
    [a.last + 2.4, FCAM(980, 300, 1.15, 900, 600)],                             // 2.03: tilt up to rung 5 (the lever) and the ring above it
    [a.interview - .1, FCAM(1000, 280, 1.2, 900, 600)],                         // 2.04: creep (veil)
    [a.interview + 3.4, MCAM(HERO.x, HERO.y, 1.55, 1120, 520)],                  // 2.05: the hero builder
    [a.T2.start - .6, MCAM(HERO.x, HERO.y, 1.62, 1120, 520)],
    [a.insider + 1.4, MCAM(HERO.x, HERO.y, 1.7, 1120, 480)],                    // 2.07: hold on the tag
    [a.test + .2, LCAM(.92, 0)],                                               // 2.08: pull back to the ladder (2.4 s)
    [a.google + 2, LCAM(.95, 10)],
    [a.cond, S.WIDE_CAM(.95, -40)],                                            // behind the veil: a slow glide
    [a.who + 2.6, FCAM(980, 560, 1.05, 1000, 470)],                             // 4.07: up to rung 3 with the ?
    [a.until + .4, FCAM(970, 570, 1.04, 1000, 480)],
    [a.people + 1.0, FCAM(620, 640, .95, 900, 600)],                            // 5.01: down to your lamp coming on + the ladder
    [a.feb + .3, FCAM(640, 630, .97, 900, 600)],
    [a.feb + 3.0, MCAM(S.MACH.x, S.MACH.y, 1.05, 1080, 470)],                  // 5.02: up to the core → the ring of 26 %
    [a.movies, MCAM(S.MACH.x - 60, S.MACH.y + 40, 1.0, 1080, 480)],              // (behind the veil)
    [a.happening + 2.4, LCAM(1.0, 40)],                                         // 5.07: the ladder in the foundry
    [a.second2, LCAM(1.05, 50)],
    [a.second2 + 2.8, S.WIDE_CAM(1.05, 20)],                                    // 5.09: pull back, the climb
    [a.everybody, S.WIDE_CAM(.98, 0)],                                          // M.01: the foundry at work, the hall lights
    [a.machines + .5, S.WIDE_CAM(1.08, 40)],                                    // M.02: in toward the builders
    [tCreep - 2.2, S.WIDE_CAM(1.0, 10)],
    [tCreep, creepOut(tCreep)], [tCreep + 1, creepOut(tCreep + 1)],
  ];
  const camRaw = (t) => (t < tIn ? creepIn(t) : t < tCreep ? F.camPath(t, K) : creepOut(t));
  const driftA = (t) => smooth(span(t, tIn, tIn + 2.2)) * (1 - smooth(span(t, tOut - 2.2, tOut)));
  const cam = (t) => E.camDrift(camRaw(t), t, driftA(t), 7);

  // ---------------------------------------------------------------- the world state
  const tOn = a.people + .06;   // your lamp comes back ON on "people" (a short flicker first)
  const lamp = (t) => (t < tOn - .45 ? 0 : t < tOn ? .5 * Math.abs(Math.sin((t - tOn) * 38)) * span(t, tOn - .45, tOn) + .05 : t < tOn + .08 ? .7 : 1);
  const hall = (t) => lerp(.7, .5, smooth(span(t, a.google, a.google + 5))) + .45 * smooth(span(t, a.channel + .4, a.including - .2)) * (1 - smooth(span(t, a.hf, tOut - .8)));
  const glow = (t) => 1 - sineIO(span(t, tIn, tIn + 2.2));
  const labels = (t) => Math.max(span(t, a.between - .2, a.between + 1.2) * (1 - span(t, a.lab + .2, a.lab + .9)),
    span(t, a.who + 1.2, a.who + 2.4) * (1 - span(t, a.feb + .4, a.feb + 1.2)),
    span(t, a.happening + 1.4, a.happening + 2.6) * (1 - span(t, a.second2 + 1.2, a.second2 + 2.2)));
  const ladderSt = (t) => {
    const s = F.ladderState(T, t), st = s.state.slice(), lit = s.lit.slice(), tags = s.tags.slice();
    st[0] = 1; lit[0] = t < a.first ? span(t, a.writing - .1, a.writing + 1.1) : 1;
    return { state: st, lit, tags };
  };
  // the climbing machine (my own marker, so it can leave the ladder into the core at M.02): rung 0..5, > 5 = into the core
  const marker = (t) => sineIO(span(t, a.stands - .1, a.stands + 1.4)) + sineIO(span(t, a.taken2 - .4, a.taken2 + 1.0)) + .5 * sineIO(span(t, a.shared - .3, a.shared + 1.0))
    + .5 * sineIO(span(t, a.howfast - .3, a.howfast + 1.4)) + 3.5 * sineIO(span(t, a.including + .2, a.machines + 1.6));
  const markerA = (t) => span(t, a.stands - .5, a.stands - .1);

  const X = { a, T };
  return (ctx, t) => {
    if (t < tIn) { S.plateLadder(ctx, t, T); return; }
    if (t >= tOut) { S.plateClimb(ctx, t, T); return; }
    const c = cam(t), L = ladderSt(t);
    X.c = c; X.t = t;
    const m0 = E.cardM(c, F0), near = !m0 || m0.k > 5;   // the camera flies past the workshop card (2.05): skip its ladder + you while it is huge
    const out = S.foundry(ctx, c, t, {
      lamp: lamp(t), hall: hall(t), carts: .6,
      machine: { glow: 1 + .3 * F.bump(t, a.feb + .9, 1.6) },
      ladder: near ? false : { glow: glow(t), state: L.state, lit: L.lit, labels: labels(t), tags: L.tags, size: 30 }, you: near ? false : undefined,
      front: (cx) => frontMach(cx, t, a, X),
      extra: (cx, hand, lad) => extraF0(cx, t, a, X, lad, marker(t), markerA(t), L),
    });
    // where things are on screen (for the layers)
    X.mach = S.machineAt(c);
    const lad = out.lad; X.lad = lad;
    if (lad) {
      const foot = E.project(c, F0, S.LADDERPOS.x, S.LADDERPOS.y), top = E.project(c, F0, lad.topX, lad.top);
      X.ladS = { foot, top, rung: (k) => E.project(c, F0, ...lad.rungAt(k)) };
    } else X.ladS = null;
    const he = E.project(c, S.Z_MACH, HERO.x, HERO.y); X.hero = he ? [he[0], he[1], HERO.s * he[2]] : null;
    // world labels (screen)
    worldLabels(ctx, t, a, X);
    // the veil and the explainers
    F.veil(ctx, veilA(t, a));
    for (const ly of layers) ly(ctx, t, a, T, X);
    // the HUD: hidden until 2.08 lifts it out of the ladder; big at 3.03 / 4.05 / 5.06 (the chunk layers ask via hudBig())
    hud(ctx, t, a, T, X);
  };
}

// the veil: windows of explainers (EXPL) over the gliding foundry
export function veilA(t, a) {
  const w = (t0, t1, d0 = 1.1, d1 = 1.2) => sineIO(span(t, t0, t0 + d0)) * (1 - sineIO(span(t, t1, t1 + d1)));
  return .84 * Math.max(
    w(a.lab + .55, a.interview + 2.4),           // 2.04 its own numbers (held through the fly past the ladder)
    w(a.google - .45, a.who + .1),               // c03 + c04: Google, the fine print, the loop, the benches, the calendar, the note
    w(a.feb + 1.2, a.happening - .1, 1.2, 1.6),  // 5.02–5.07: the ring, three steps, the quote, the ?, rung 3, the poster
    .75 * w(a.headline - .3, a.second2 - .1),    // 5.08 the headline (lighter: the ladder still reads behind it)
  );
}

// ---------------------------------------------------------------- the HUD (normal / lifted out of the ladder / big)
// big moments: [grow start, shrink start] (each move 1.8 s, sineIO)
export const bigWins = (a) => [[a.first - .25, a.taken1 + .9], [a.second - .2, a.word + .9], [a.r3 - .2, a.growing + 1.9]];
function hud(ctx, t, a, T, X) {
  const L0 = a.test + .1, L1 = L0 + 2.0;
  if (t < L0) return;
  if (t < L1) {   // 2.08: the ladder lifts a copy of itself into the corner (it starts on the world ladder, with its lean)
    const lad = X.ladS; if (!lad || !lad.foot || !lad.top) return;
    const hs = lad.foot[1] - lad.top[1], g0 = { s: hs * .78 / 210, k: .5 * (lad.top[0] - lad.foot[0]) / hs, fx: lad.foot[0], fy: lad.foot[1] };
    const p = sineIO(span(t, L0, L1)), m = hudM(mixG(g0, HUD0, p));
    ctx.save(); ctx.globalAlpha *= span(t, L0, L0 + .3);
    withM(ctx, m, () => F.ladderHUD(ctx, t, T, { a: 1 })); ctx.restore();
    return;
  }
  let g = 0, s0 = 0;
  for (const [g0, s1] of bigWins(a)) { const v = sineIO(span(t, g0, g0 + 1.8)) * (1 - sineIO(span(t, s1, s1 + 1.8))); if (v > g) { g = v; s0 = g0; } }
  if (g <= 0) { F.ladderHUD(ctx, t, T, { a: 1 }); return; }
  const m = hudM(mixG(HUD0, HUDBIG, g));
  withM(ctx, m, () => {
    F.ladderHUD(ctx, t, T, { a: 1 });
    // the stamp next to the rung (HUD px: it grows and shrinks with the ladder), and rung 3's gold edge creeping on "growing fast"
    const [, s1] = bigWins(a).find((w) => w[0] === s0);
    if (s0 === bigWins(a)[0][0]) F.stamp(ctx, t, 'TAKEN', 300, hudRung(0)[2] + 2, { t0: a.taken1 + .05, size: 13, out: s1 - .2, rot: -.08 });
    if (s0 === bigWins(a)[1][0]) F.stamp(ctx, t, 'TAKEN', 400, hudRung(1)[2] + 2, { t0: a.taken2 + .05, size: 13, out: s1 - .2, rot: -.08 });
    if (s0 === bigWins(a)[2][0]) {
      const cr = .09 * sineIO(span(t, a.growing, a.growing + 1.8)) * (1 - sineIO(span(t, s1 - .2, s1 + 1.2)));
      if (cr > 0) { const [x0, x1, y] = hudRung(2), th = 4, mx = x0 + (x1 - x0) * .5; ctx.fillStyle = FORGE.body; ctx.fillRect(mx - .5, y - th / 2, (x1 - x0) * cr, th); halo(ctx, mx + (x1 - x0) * cr, y, 9, .7, FORGE.halo, FORGE.core); }
    }
  });
}

// ---------------------------------------------------------------- the machine card (front): ANTHROPIC on the ring, the hero builder, IN A YEAR?
function frontMach(ctx, t, a, X) {
  const M = S.MACH;
  // 2.04: ANTHROPIC on the ring (a gold label on a thread, upper left of the ring)
  const lu = span(t, a.lab + .05, a.lab + .9) * (1 - span(t, a.interview - .3, a.interview + .3));
  if (lu > 0) F.goldLabel(ctx, M.x - M.r * .72, M.y + M.r * .72, 'ANTHROPIC', '', lu, { dx: -110, dy: 90, size: 34 });
  // the hero builder: hovers at the ring's lower right and welds; its eye grows at 2.05 (the clip plate starts as that eye)
  const eg = sineIO(span(t, a.leads - .4, a.T2.start - .9)) * (1 - sineIO(span(t, a.T2.end + 1.0, a.alarmed + .5)));
  const bob = Math.sin(t * 1.3) * 3, arm = Math.atan2(M.y - HERO.y, M.x - HERO.x) + .05 * Math.sin(t * .9);
  bot(ctx, t, HERO.x, HERO.y + bob, HERO.s, { eye: .6 + 1.4 * eg, arm, armL: 2.1, spark: 1 - eg });
  // 2.07: the tag IN A YEAR? drops from the builder on a gold thread
  const tu = span(t, a.inyear - .1, a.inyear + .9) * (1 - span(t, a.test - .5, a.test + .3));
  if (tu > 0) F.priceTag(ctx, t, HERO.x, HERO.y + bob + HERO.s, 'IN A YEAR?', tu, { len: 90, size: 30 });
}

// ---------------------------------------------------------------- the workshop card (extra): the climbing machine, rung 3's ?, the rung pulses
function extraF0(ctx, t, a, X, lad, m, ma, L) {
  if (!lad) return;
  const h = S.LADDERPOS.y - lad.top, ms = Math.max(8, h * .03);
  // rung 5 glows warm at 2.03 ("the last rung decides")
  const r5 = F.bump(t, a.last + .3, 3.6);
  if (r5 > 0) { const [x, y] = lad.rungAt(4); halo(ctx, x, y, h * .16, .45 * r5, P.halo2, P.cream); }
  // rung 3: a cream glow on "people" (5.01); a ? hangs from it at 4.07
  const r3 = F.bump(t, a.people - .1, 3.2);
  if (r3 > 0) { const [x, y] = lad.rungAt(2); halo(ctx, x, y, h * .18, .5 * r3, P.halo2, P.cream); }
  const qu = span(t, a.who + .9, a.who + 1.9) * (1 - span(t, a.people - .3, a.people + .4));
  if (qu > 0 && lad.rungs[2]) { const r = lad.rungs[2]; F.priceTag(ctx, t, r.x0 + 6, r.y + 4, '?', qu, { len: h * .06, size: 30 }); }
  // 5.07 "one measured rung at a time": the rungs 1–3 pulse one after another
  for (let k = 0; k < 3; k++) { const b = F.bump(t, a.measured + k * .55, 1.0); if (b > 0) { const [x, y] = lad.rungAt(k); halo(ctx, x, y, h * .12, .6 * b, FORGE.halo, FORGE.hot); } }
  // the climbing machine
  if (ma <= 0 || m > 5.95) return;
  const at = (q) => {
    if (q <= 0) return [S.LADDERPOS.x, S.LADDERPOS.y - h * .03];
    if (q <= 1) { const [x, y] = lad.rungAt(0); return [lerp(S.LADDERPOS.x, x, q), lerp(S.LADDERPOS.y - h * .03, y, q)]; }
    if (q <= 5) { const i = Math.floor(q - 1e-9), f = q - i, [x0, y0] = lad.rungAt(i - 1), [x1, y1] = lad.rungAt(Math.min(4, i)); return [lerp(x0, x1, f), lerp(y0, y1, f)]; }
    const [x0, y0] = lad.rungAt(4); return [lerp(x0, lad.topX, q - 5), lerp(y0, lad.top, q - 5)];
  };
  const [mx, my0] = at(m), my = my0 - h * .045 * (m >= 5 ? 1 - (m - 5) : 1) + Math.sin(t * 2.1) * ms * .12;
  const sc = (m > 5 ? 1 - sineIO(m - 5) * .9 : 1) * (.3 + .7 * expoOut(ma)), r = ms * sc;
  ctx.save(); ctx.globalAlpha *= clamp(ma * 3);
  halo(ctx, mx, my, r * 4, .45, FORGE.halo, FORGE.hot);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.arc(mx, my, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(FORGE.line, .7); ctx.lineWidth = Math.max(1.5, r * .14); ctx.stroke();
  ctx.fillStyle = FORGE.core; ctx.beginPath(); ctx.arc(mx, my, r * .36, 0, TAU); ctx.fill();
  ctx.restore();
  X.markerS = E.project(X.c, F0, mx, my);
}

// ---------------------------------------------------------------- world labels (screen space, pinned to the world)
function worldLabels(ctx, t, a, X) {
  const c = X.c;
  // 2.01: TODAY at your feet, THAT MACHINE at the core
  const u1 = span(t, a.between - .1, a.between + .8) * (1 - span(t, a.last - .4, a.last + .3));
  if (u1 > 0) {
    const y = E.project(c, F0, S.YOU.x - 30, S.YOU.y - S.YOU.h * .55), m = S.machineAt(c);
    if (y) F.goldLabel(ctx, y[0], y[1], 'TODAY', '', u1, { dx: -70, dy: -80, size: 28 });
    const u2 = span(t, a.between + .6, a.between + 1.5) * (1 - span(t, a.last - .4, a.last + .3));
    if (m && u2 > 0) F.goldLabel(ctx, m[0] - m[2] * .62, m[1] - m[2] * .2, 'THAT MACHINE', '', u2, { dx: -110, dy: -40, size: 28 });
  }
  // 5.09: HOW FAST? pinned to the climbing machine
  const hu = span(t, a.howfast - .1, a.howfast + .8) * (1 - span(t, a.channel - .3, a.channel + .4));
  if (hu > 0 && X.markerS) F.goldLabel(ctx, X.markerS[0] + 10, X.markerS[1] - 10, 'HOW FAST?', '', hu, { dx: 90, dy: -70, size: 30 });
}

// ================================================================================================================ c02's explainers
function layer02(ctx, t, a, T, X) {
  if (t > a.google + 1) return;
  // 2.04: the two hook numbers return as cards; stamp ITS OWN NUMBERS
  const cu = span(t, a.lab + .7, a.lab + 1.7), co = span(t, a.interview - .8, a.interview + .7);
  if (cu > 0 && co < 1) {
    ctx.save(); F.float(ctx, t, .8); ctx.translate(0, slideY(cu, co, 40, 650));
    F.dataCard(ctx, t, 420, 300, 500, { u: cu, kind: 'KNOWN', title: 'CODE CHANGES BY ITS OWN A.I.', big: '9 OF 10', h: 270 });
    F.dataCard(ctx, t, 1000, 300, 500, { u: clamp(cu * 1.2 - .2), kind: 'KNOWN', title: 'A.I. AGENTS AT WORK, AT ONCE', big: '≈ 30,000', h: 270 });
    F.stamp(ctx, t, 'ITS OWN NUMBERS', 960, 680, { t0: a.own + .15, size: 40, rot: -.05 });
    ctx.restore();
    F.source(ctx, t, a.own, a.interview + .2, F.SOURCES.labReports);
  }
  // 2.06: the clip plate grows out of the hero builder's eye and goes back into it
  const cl = a.T2;
  const morph = sineIO(span(t, cl.start - 1.1, cl.start + .05)) * (1 - sineIO(span(t, cl.end - .05, cl.end + 1.0)));
  if (morph > 0 && X.hero) {
    const [ex, ey, er] = X.hero;
    F.clipPlate(ctx, t, T, 'T2', { from: [ex, ey, er * .5], morph });
    if (morph < .25) halo(ctx, ex, ey, er * 3, .8 * (1 - morph * 4), FORGE.halo, FORGE.core);   // the eye's light stays on top while the plate is tiny
  }
  // 2.07: ONE INSIDER'S FORECAST (under the tag)
  const iu = span(t, a.insider + .1, a.insider + .9) * (1 - span(t, a.test - .4, a.test + .2));
  if (iu > 0 && X.hero) F.goldText(ctx, [["ONE INSIDER'S FORECAST", .3]], X.hero[0] - 110, X.hero[1] + 150, 28, rise(iu), { serif: false, weight: 600, spacing: .1, align: 'right' });
  if (iu > 0) F.source(ctx, t, a.insider + .1, a.test + .2, F.SOURCES.taoView);
}
