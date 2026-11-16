// c06 · B2 (with c07, c08: ONE continuous take; the scene lives here as b2(T), sc07.mjs and sc08.mjs return the same draw for their range)
// 'Many doubt it' → 'Reports say there are' · plateCrystal (B1) → plateSort (B3). Plan: docs/shots.md 5.01–7.08 + M.01 · world: docs/MOTION.md
// On-screen strings: <ROOT>vo-v3.txt [EINBLENDUNG] (F.SOURCES where it matches). C2 label = clip words checked against clips/schnitt.json.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                      | carrier → next        |
// |-------|---------------------------------|-----------------------------------------------------------------------------------------|-----------------------|
// | 5.01  | Many doubt it                   | out of plateCrystal (creep continues); board STEP 2 by itself; small letters of light rise from the city into the crystal | one letter |
// | 5.02  | The official who watches        | one letter turns to us and opens: PAUSE THE SALE · NYC COMPTROLLER MARK LEVINE, LETTER OF OCT 14, 2026 | the letter flies home |
// | 5.03  | The worry                       | the letter folds and flies into the crystal; a ribbon unrolls from the price tag: one cool grade per day, A GRADE EVERY DAY · THE SHARE PRICE; SAFETY IS: SLOW · EXPENSIVE · SOMETIMES "NO" | the ribbon sinks |
// | 5.04  | And the four trustees           | behind the veil the camera reached the tower window: the room, the 4 trustees light cream: CHOOSE DIRECTORS ✓ · DAILY DECISIONS ✗ (AP) | pull out |
// | 5.05  | The sharpest doubt              | out of the window, over the city to the crystal; YOSHUA BENGIO pinned to a facet; the crystal's crack on "catastrophic"; "locked in a race": cool lanes | the facet |
// | 5.06  | slot C2                         | the facet lights as a screen, C2 grows out of it and back (clip words = schnitt.json)    | the lanes             |
// | 5.07  | A race by choice                | the lanes again: A CHOICE; a share-price ticker; the lights speed up                     | the crystal's gap     |
// | 6.01  | But the company has an answer   | a booklet slides out of the crystal's gap: WE MUST PACE THE FRONTIER · DARIO AMODEI; lights slow down; a gold light is held at a gate: HELD BACK FOR MONTHS | the booklet |
// | 6.02  | That is his word                | bracket HIS WORD, NOT PROOF; the lanes wipe out; the prospectus slides out from behind the booklet, opens: IN WRITING · A LEGAL DOCUMENT · THE RISKS · THE LOSSES · WHO HOLDS THE VOTES · ANYONE CAN READ IT | the cover |
// | 6.03  | So can a safety mission         | it closes, the booklet tucks behind it; stamps UNPROVEN, ON THE RECORD; the document settles on the ledge beside you | the ledge |
// | M.01  | This channel exists (1st)       | subscribe 1: wide, you with the shard, the crystal; every window of the city lights warm on "everybody" (no text) | the crystal |
// | 7.01  | If the mission is unproven      | rise to the crystal and its "$ ?" tag; board STEP 3 by itself; bracket NOT INVESTMENT ADVICE | the tag |
// | 7.02  | At the top of the range         | the tag flips to ≈ $1.4 T and unfolds a card: UP TO ≈ $1.4 TRILLION                     | the tag retracts      |
// | 7.03  | A number like that              | camera down to the veiled city: two trays KNOWN | FORECAST                               | the KNOWN tray        |
// | 7.04★ | Known: three years ago          | in the KNOWN tray: a hairline bar $41M (2023, a year); a huge bar $17.0B (Q3 2026, a quarter) breaks out of the tray; it condenses into the REVENUE card | the card |
// | 7.05  | Also known                      | NET LOSS card                                                                           | the FORECAST tray     |
// | 7.06  | Everything beyond that          | the FORECAST tray lights; the crystal's facet lights as a screen                         | the facet             |
// | 7.07  | slot C3                         | C3 (label FORECAST) grows out of the facet and back                                     | the card              |
// | 7.08  | A country of geniuses           | FORECAST cards 1–2 YEARS · WITHIN A FEW YEARS → plateSort                               | plateSort             |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, mixHex, prng } = E;
const { rise, GOLD, PAPER, COOL, LAMP, F0, maskLine, measure } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT59;

// ======================================================================================================================== anchors
function anchors(T) {
  const A0 = T.G('Many doubt it'), B = T.G('Reports say there are', 0, A0);
  const G = (p, after = A0 - .5) => T.G(p, 0, after), GE = (p, after = A0 - .5) => T.GE(p, 0, after);
  const a = { A0, B };
  a.counted = G('before the orders are counted'); a.official = G('The official who watches'); a.pause = G('pause the sale', a.official);
  a.until = G('until questions', a.official); a.settled = G('settled', a.official);
  a.worry = G('The worry'); a.grade = G('a grade every day', a.worry); a.sprice0 = G('its share price', a.worry);
  a.safety = G('And safety is slow', a.worry); a.slow = G('slow', a.safety); a.exp = G('expensive', a.safety); a.no = G('saying no', a.safety);
  a.trustees = G('And the four trustees'); a.choose = G('They choose directors', a.trustees); a.daily = G('daily decisions', a.trustees);
  a.sharp = G('The sharpest doubt'); a.bengio = G('Yoshua Bengio', a.sharp); a.cat = G('catastrophic', a.sharp); a.race = G('locked in a race', a.sharp);
  a.answer0 = G('His answer', a.sharp);
  const c2 = T.clip('C2'), c3 = T.clip('C3'); a.c2 = { s: c2.start, e: c2.end }; a.c3 = { s: c3.start, e: c3.end };
  a.choice = G('A race by choice'); a.choiceW = G('choice', a.choice); a.speed = G('rewards speed', a.choice); a.sprice = G('like a share price', a.choice);
  a.answer = G('But the company has an answer'); a.sept = G('This September', a.answer); a.slowdown = G('slow down', a.answer);
  a.held = G('held back a finished', a.answer); a.months = G('for months', a.held);
  a.word = G('That is his word'); a.going = G('But going public', a.word); a.writing = G('put it in writing', a.word); a.legal = G('legal document', a.word);
  a.risks = G('The risks', a.legal); a.losses = G('The losses', a.legal); a.votes = G('Who holds the votes', a.legal); a.anyone = G('Anyone can read it', a.legal);
  a.survive = G('So can a safety mission'); a.unproven = G('Unproven', a.survive + 1); a.record = G('record', a.unproven);
  a.chan = G('This channel exists'); a.everybody = G('everybody', a.chan); a.notonly = G('Not only for those', a.chan); a.subscribe = G('Then subscribe', a.chan);
  a.ifm = G('If the mission is unproven'); a.wed = G('expected Wednesday night', a.ifm); a.final = G('the final price', a.ifm);
  a.top = G('At the top of the range'); a.tril = G('one point four trillion', a.top);
  a.number = G('A number like that'); a.sort = G('So sort what is known', a.number); a.hoped = G('hoped', a.sort);
  a.known = G('Known', a.sort + 1); a.forty = G('forty million', a.known); a.quarter = G('In its latest quarter', a.known); a.seventeen = G('seventeen billion', a.known);
  a.real = G('That part is real', a.known); a.also = G('Also known', a.real); a.loses = G('loses money', a.also);
  a.beyond = G('Everything beyond that'); a.boldest = G('And the boldest comes', a.beyond);
  a.geniuses = G('A country of geniuses', a.c3.e - 1); a.oneortwo = G('one or two years', a.geniuses); a.sellers = G("That is a seller's forecast", a.geniuses);
  a.indoc = G('In the document', a.geniuses); a.few = G('within a few years', a.indoc);
  return a;
}

// ======================================================================================================================== cameras
const AC = (s, sx, sy) => E.aim(S.Z_CRY, S.CRY.x, S.CRY.y, s, sx, sy);                       // the crystal's centre at screen (sx, sy)
const AW = (s, sx, sy) => E.aim(S.Z_CITY, S.WIN.x + S.WIN.w / 2, S.WIN.y + S.WIN.h / 2, s, sx, sy);   // the tower window's centre
const AF = (u, v, s, sx = W / 2, sy = H / 2) => E.aim(F0, u, v, s, sx, sy);                // the rooftop card
const camMix = (p, q, u) => E.cam3({ x: lerp(p.x, q.x, u), y: lerp(p.y, q.y, u), z: F.REF - Math.exp(lerp(Math.log(F.REF - p.z), Math.log(F.REF - q.z), u)) });

// ======================================================================================================================== small helpers
const Bez = (p0, p1, p2, u) => [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
const lerpR = (p, q, u) => ({ x: lerp(p.x, q.x, u), y: lerp(p.y, q.y, u), w: lerp(p.w, q.w, u), h: lerp(p.h, q.h, u) });
function shell(ctx, r, o = {}) {   // a card body: 'paper' or 'night' (gold edge)
  const night = o.style === 'night', rr = Math.min(night ? 12 : 6, r.w / 4, r.h / 4);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(r.x + 6, r.y + 10, r.w, r.h, rr); ctx.fill();
  ctx.fillStyle = night ? (o.fill ?? mixHex(P.night1, P.ind2, .55)) : E.lin(ctx, r.x, r.y, r.x + r.w, r.y + r.h, [[0, PAPER.lit], [1, PAPER.body]]);
  ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rr); ctx.fill();
  ctx.strokeStyle = night ? rgba(o.edge ?? GOLD.line, .55) : rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
}
function tick(ctx, x, y, s, u, col) {
  u = clamp(u); if (u <= 0) return; const q = expoOut(u);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * .16; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x, y);
  ctx.lineTo(x + s * .35 * Math.min(1, q * 2), y + s * .35 * Math.min(1, q * 2)); if (q > .5) ctx.lineTo(x + s * .35 + s * .65 * (q - .5) * 2, y + s * .35 - s * .8 * (q - .5) * 2); ctx.stroke(); ctx.restore();
}
function cross(ctx, x, y, s, u, col) {
  u = clamp(u); if (u <= 0) return; const q1 = expoOut(clamp(u * 2)), q2 = expoOut(clamp(u * 2 - 1));
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * .16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * q1, y + s * q1); ctx.stroke();
  if (q2 > 0) { ctx.beginPath(); ctx.moveTo(x + s, y); ctx.lineTo(x + s - s * q2, y + s * q2); ctx.stroke(); } ctx.restore();
}
const txt = (ctx, s, x, y, size, u, o = {}) => maskLine(ctx, [[s, 0]], x, y, size, u, { serif: o.serif ?? false, weight: o.weight ?? 600, col: o.col ?? P.cream, glow: false, align: o.align });
// the crystal's facets in crystal-card coordinates (same breathing as F.crystal: br, rot)
const CO = [[-.76, -.52], [.05, -.9], [.98, -.38], [.93, .57], [.48, .9], [-.14, .8], [-1, 0]], CI = [[-.15, -.38], [.45, .03], [-.32, .33], [.2, .55]];
const PT = (k) => (k < 7 ? CO[k] : CI[k - 7]);
function facetPts(c, t, ids) {
  const br = 1 + .012 * Math.sin(t * .8), R = S.CRY.r * br, rot = .015 * Math.sin(t * .23), cs = Math.cos(rot), sn = Math.sin(rot);
  return ids.map((k) => { const [u, v] = PT(k); return E.project(c, S.Z_CRY, S.CRY.x + (u * cs - v * sn) * R, S.CRY.y + (u * sn + v * cs) * R); });
}
const FACET_L = [6, 0, 7];   // the left facet: Bengio's name is pinned to it, C2 grows out of it
const FACET_R = [1, 2, 8];   // the upper-right facet: C3 grows out of it (it stays above the FORECAST tray)
function facetScreen(ctx, c, t, ids, u) {   // the facet turns into a screen (cool light, two scan lines)
  u = clamp(u); if (u <= 0) return null;
  const p = facetPts(c, t, ids); if (p.some((q) => !q)) return null;
  const cx = (p[0][0] + p[1][0] + p[2][0]) / 3, cy = (p[0][1] + p[1][1] + p[2][1]) / 3;
  const r = Math.max(...p.map((q) => Math.hypot(q[0] - cx, q[1] - cy)));
  ctx.save(); ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(p[1][0], p[1][1]); ctx.lineTo(p[2][0], p[2][1]); ctx.closePath();
  ctx.fillStyle = rgba(mixHex(COOL.deep, COOL.body, .35 + .1 * Math.sin(t * 3)), .92 * sineIO(u)); ctx.fill();
  ctx.strokeStyle = rgba(COOL.core, .85 * u); ctx.lineWidth = 2; ctx.stroke(); ctx.clip();
  ctx.fillStyle = rgba(COOL.core, .18 * u); for (let k = 0; k < 2; k++) { const yy = cy - r + ((t * 40 + k * r) % (2 * r)); ctx.fillRect(cx - r, yy, 2 * r, 3); }
  ctx.restore(); halo(ctx, cx, cy, r * 1.6, .25 * u, COOL.halo, COOL.core);
  return [cx, cy, r * .6];
}

// ======================================================================================================================== the take
const CACHE = new WeakMap();
export function b2(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const a = anchors(T), d = scene(a, T); CACHE.set(T, d); return d;
}
export default async (T, R) => [{ t: R.a, draw: b2(T), print: PRINT }];

function scene(a, T) {
  const tIn = a.A0 + S.SEAM_HALF, tPlate = a.B - S.SEAM_HALF;

  // ---------------------------------------------------------------- the camera (one take)
  const creepIn = (t) => { const k = 1 + S.CREEP * (t - (a.A0 - S.SEAM_HALF)); return S.CRY_CAM(k, S.trk(k) * .3); };
  const creepOut = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.SORT_CAM(k, S.trk(k) * .2); };
  const tSort0 = tPlate - 3.6;
  const K = [
    [tIn, creepIn(tIn)],
    [a.official + .3, AC(1.16, 880, 318)],                 // 5.01: the push continues (letters rise into the crystal)
    [a.worry + .2, AC(1.2, 850, 300)],                     // 5.02: toward the tag (the ribbon will unroll from it)
    [a.worry + 2.6, AC(1.22, 845, 296)],
    [a.trustees - .4, AW(1.95, 760, 500)],                 // behind the veil: over the city to the tower window
    [a.daily + 1.2, AW(2.05, 765, 503)],                   // 5.04: the room, a creep
    [a.bengio + .6, AC(.86, 1260, 330)],                   // 5.05: out of the window, over the city to the crystal
    [a.c2.s - 1.6, AC(.93, 1240, 340)],                    // a slow push toward the facet
    [a.answer, AC(.9, 1270, 332)],
    [a.word + 4.6, AC(.92, 1290, 330)],                    // c07: the booklet and the lanes
    [a.unproven + 2.4, AF(1080, 610, .86)],                // behind the veil: down to the rooftop, wide
    [a.subscribe + .6, AF(1060, 590, .9)],                 // M.01: a slow push while the city lights up
    [a.wed + .4, AC(1.0, 1240, 300)],                      // 7.01: up to the crystal and its tag
    [a.number + 1.2, AC(1.03, 1235, 298)],
    [a.sort + 2.4, S.SORT_CAM(.82, -34)],                   // 7.03: down to the veiled city, the trays
    [a.c3.s, S.SORT_CAM(.84, -28)],
    [tSort0, creepOut(tSort0)],
  ];
  const camRaw = (t) => {
    if (t <= tIn) return creepIn(t);
    const p = F.camPath(t, K);
    if (t < tIn + 2.4) return camMix(creepIn(t), p, sineIO(span(t, tIn, tIn + 2.4)));
    if (t >= tSort0) return camMix(p, creepOut(t), sineIO(span(t, tSort0, tPlate - .3)));
    return p;
  };
  const cam = (t) => { const c = camRaw(t), s = F.REF / (F.REF - c.z), amt = smooth(span(t, tIn, tIn + 2.2)) * (1 - smooth(span(t, tPlate - 2.6, tPlate - .2))); return E.camDrift(c, t, 8 / Math.max(1, s) * amt, 5); };

  // ---------------------------------------------------------------- the veil (one value, every change ≥ 1.8 s)
  const vs = (t, t0, t1) => sineIO(span(t, t0, t1));
  const veilA = (t) => {
    let v = .78 * vs(t, a.official, a.official + 1.9);                                     // the letter opens
    v -= .78 * vs(t, a.trustees + .1, a.trustees + 2.8);                                   // the room
    v += .3 * vs(t, a.sharp + .4, a.sharp + 2.4);                                          // the city under a light veil (lanes, the name)
    v += .3 * vs(t, a.answer, a.answer + 2);                                               // the booklet
    v += .22 * vs(t, a.going - .2, a.going + 1.8);                                         // the prospectus
    v -= .82 * vs(t, a.record + .5, a.record + 2.6);                                       // the document settles: the city, wide
    v += .2 * vs(t, a.top, a.top + 2);                                                     // the $1.4 T card
    v += .52 * vs(t, a.number + 1.3, a.number + 3.3);                                      // the trays: .72 as the plate
    return clamp(v);
  };

  // ---------------------------------------------------------------- 5.01–5.03 letters, the letter card, the ribbon, safety cards
  const LET = []; { const r = prng(5906); for (let i = 0; i < 11; i++) LET.push({ t0: a.A0 + .75 + i * .34 + r() * .12, x: 260 + r() * 1300, y: 990 + r() * 50, bend: (r() - .5) * 360, d: 2.5 + r() * .5, s: 30 + r() * 12 }); }
  const CARRY = { t0: a.official - 2.3, p0: [720, 1010], p1: [560, 760], p2: [700, 600] };   // the letter that turns to us
  const LC = { x: 440, y: 250, w: 1040, h: 360 };                                            // the letter card
  const openL = (t) => sineIO(span(t, a.official, a.official + 1.9));
  const homeL = (t) => sineIO(span(t, a.worry - .1, a.worry + 1.8));
  function envelope(ctx, x, y, s, al, rot = 0) {   // a small letter of light (paper with a flap line), s = width
    if (al <= 0 || s <= 0) return;
    ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.rotate(rot);
    halo(ctx, 0, 0, s * 1.4, .35, LAMP.body, P.cream);
    ctx.fillStyle = mixHex(PAPER.lit, LAMP.core, .4); ctx.fillRect(-s / 2, -s * .32, s, s * .64);
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = Math.max(1, s * .05); ctx.beginPath(); ctx.moveTo(-s / 2, -s * .32); ctx.lineTo(0, s * .06); ctx.lineTo(s / 2, -s * .32); ctx.stroke();
    ctx.restore();
  }
  function letters(ctx, t, crs) {
    if (t > a.official + .3 || !crs) return;
    for (const L of LET) {
      const u = span(t, L.t0, L.t0 + L.d); if (u <= 0 || u >= 1) continue;
      const e = sineIO(u), p0 = [L.x, L.y], p2 = [crs[0], crs[1] + crs[2] * .2], p1 = [lerp(L.x, p2[0], .3) + L.bend, lerp(L.y, p2[1], .65)];
      const [x, y] = Bez(p0, p1, p2, e), al = clamp(u / .08) * clamp((1 - u) / .1);
      envelope(ctx, x, y, L.s * lerp(1, .55, e) * (u > .9 ? (1 - u) * 10 : 1), al, .25 * Math.sin(t * 2 + L.x));
    }
  }
  function letterCard(ctx, t, crs) {
    const u0 = span(t, CARRY.t0, a.official), op = openL(t), hm = homeL(t);
    if (u0 <= 0 || hm >= 1) return;
    if (op <= 0) {   // the carrier letter rises from the city and turns toward us
      const [x, y] = Bez(CARRY.p0, CARRY.p1, CARRY.p2, 1 - (1 - u0) ** 2);
      envelope(ctx, x, y, lerp(22, 52, u0), clamp(u0 / .08), .2 * Math.sin(t * 2.2) * (1 - u0)); return;
    }
    const small = { x: CARRY.p2[0] - 26, y: CARRY.p2[1] - 9, w: 52, h: 52 * LC.h / LC.w };
    let r = lerpR(small, LC, op);
    if (hm > 0) {   // folds and flies home into the crystal (an arc)
      const tgt = crs ? { x: crs[0] - 14, y: crs[1] - 5, w: 28, h: 28 * LC.h / LC.w } : small;
      r = lerpR(LC, tgt, hm); r.y -= 160 * Math.sin(Math.PI * hm);
    }
    const k = r.w / LC.w;
    ctx.save(); F.float(ctx, t, 1 - hm); ctx.globalAlpha *= hm > .88 ? (1 - hm) / .12 : 1;
    ctx.translate(r.x, r.y); ctx.scale(k, k); ctx.rotate(-.006 + .03 * (1 - op) + .2 * hm);
    shell(ctx, { x: 0, y: 0, w: LC.w, h: LC.h });
    if (k > .3) {
      const cu = (t0, d = .8) => rise(span(t, t0, t0 + d));
      txt(ctx, 'LETTER · OCT 14, 2026', 54, 66, 22, cu(a.official + 1.0), { col: PAPER.faint });
      txt(ctx, 'PAUSE THE SALE', 50, 178, 80, cu(a.pause - .1, .7), { col: PAPER.ink });
      txt(ctx, 'UNTIL SAFETY AND CONTROL ARE SETTLED', 54, 236, 28, cu(a.until), { col: GOLD.deep });
      ctx.fillStyle = rgba(PAPER.edge, .6); ctx.fillRect(54, 270, (LC.w - 108) * expoOut(span(t, a.official + 1.2, a.official + 2)), 2);
      txt(ctx, 'NYC COMPTROLLER MARK LEVINE', 54, 318, 26, cu(a.official + 1.4), { col: PAPER.ink });
    }
    ctx.restore();
  }
  // the ribbon of daily grades: unrolls out of the price tag; one cool grade per day; sinks with the safety cards before the room
  const RB = { x: 160, y: 640, w: 1600, h: 116 }, NDAY = 16;
  const ribU = (t) => sineIO(span(t, a.worry + 1.3, a.worry + 3.2));
  const awayX = (t) => sineIO(span(t, a.trustees - .9, a.trustees + 1.3));   // the explainer layer sinks while the veil lifts
  let TAGBOX = null;
  function ribbon(ctx, t) {
    const u = ribU(t), aw = awayX(t); if (u <= 0 || aw >= 1) return;
    const from = TAGBOX ?? { x: 900, y: 720, w: 140, h: 70 };
    const r = lerpR(from, RB, u);
    ctx.save(); F.float(ctx, t, u); ctx.translate(0, aw * 760);
    shell(ctx, r, { style: 'night', edge: COOL.line, fill: mixHex(P.night0, P.blue0, .35) });
    if (u >= 1) {
      const cw = RB.w / NDAY, rr = prng(77);
      for (let i = 0; i < NDAY; i++) {
        const cu = span(t, a.grade + .1 + i * .12, a.grade + .45 + i * .12), x = RB.x + i * cw, up = rr() < .55, hgt = 18 + rr() * 26;
        if (i) { ctx.fillStyle = rgba(COOL.line, .22); ctx.fillRect(x, RB.y + 14, 1.5, RB.h - 28); }
        if (cu <= 0) continue;
        const k = expoOut(cu), cx = x + cw / 2, cy = RB.y + RB.h / 2 + 6 + .6 * Math.sin(t * 1.3 + i);
        ctx.fillStyle = rgba(up ? COOL.body : mixHex(COOL.deep, P.cream, .25), .95); ctx.fillRect(cx - 9, up ? cy - hgt * k : cy, 18, hgt * k);
        ctx.strokeStyle = rgba(COOL.core, .8 * k); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy); ctx.stroke();
        ctx.fillStyle = rgba(COOL.core, k); ctx.beginPath(); ctx.moveTo(cx - 8, up ? cy - hgt * k - 6 : cy + hgt * k + 6); ctx.lineTo(cx + 8, up ? cy - hgt * k - 6 : cy + hgt * k + 6); ctx.lineTo(cx, up ? cy - hgt * k - 18 : cy + hgt * k + 18); ctx.closePath(); ctx.fill();
      }
      txt(ctx, 'A GRADE EVERY DAY', RB.x, RB.y - 26, 32, rise(span(t, a.grade - .05, a.grade + .7)));
      txt(ctx, 'THE SHARE PRICE', RB.x + RB.w, RB.y - 26, 32, rise(span(t, a.sprice0 + .3, a.sprice0 + 1)), { col: COOL.text, align: 'right' });
    }
    // SAFETY IS: SLOW · EXPENSIVE · SOMETIMES "NO" (three small paper cards above the ribbon, on their words)
    txt(ctx, 'SAFETY IS', 220, 372, 26, rise(span(t, a.safety, a.safety + .7)), { col: GOLD.text });
    [['SLOW', a.slow], ['EXPENSIVE', a.exp], ['SOMETIMES “NO”', a.no]].forEach(([s, t0], i) => {
      const cu = span(t, t0 - .1, t0 + .6); if (cu <= 0) return;
      const x = 220 + i * 520, y = 400, w = 440, h = 120, k = expoOut(cu);
      ctx.save(); ctx.globalAlpha *= clamp(cu * 4); ctx.translate(0, (1 - k) * 36);
      shell(ctx, { x, y, w, h }); txt(ctx, s, x + w / 2, y + 78, 42, rise(span(cu, .2, 1)), { col: PAPER.ink, align: 'center' });
      ctx.restore();
    });
    ctx.restore();
  }

  // ---------------------------------------------------------------- 5.04 the room: the four trustees
  const roomLab = (t, t0) => rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, a.sharp - .6, a.sharp)));
  function roomLabels(ctx, t) {
    const x = 1150;
    ctx.save(); F.float(ctx, t, .6);
    txt(ctx, 'THE FOUR TRUSTEES', x, 400, 26, roomLab(t, a.trustees + .3), { col: LAMP.body });
    txt(ctx, 'CHOOSE DIRECTORS', x, 480, 38, roomLab(t, a.choose + .2));
    tick(ctx, x + measure('CHOOSE DIRECTORS', 38, false, 600) + 70, 462, 34, span(t, a.choose + .6, a.choose + 1.1) * (1 - span(t, a.sharp - .6, a.sharp - .2)), LAMP.core);
    txt(ctx, 'DAILY DECISIONS', x, 556, 38, roomLab(t, a.daily - .1));
    cross(ctx, x + measure('DAILY DECISIONS', 38, false, 600) + 66, 528, 30, span(t, a.daily + .3, a.daily + .8) * (1 - span(t, a.sharp - .6, a.sharp - .2)), mixHex(COOL.body, P.cream, .3));
    ctx.restore();
  }

  // ---------------------------------------------------------------- 5.05–5.07 + 6.01: the lanes of the race
  const LANES = { x0: 120, x1: 820, y0: 676, gap: 40, n: 5, held: 2 };
  const speedM = (t) => 1 + 1.3 * smooth(span(t, a.speed, a.speed + 1.4)) - 1.95 * smooth(span(t, a.slowdown - .2, a.slowdown + 1.4));
  const DIST = []; { const t0 = a.race - 1, dt = 1 / 60; let d = 0; for (let t = t0; t <= a.going + 6; t += dt) { DIST.push(d); d += 150 * speedM(t) * dt; } DIST.t0 = t0; DIST.dt = dt; }
  const distAt = (t) => { const f = (t - DIST.t0) / DIST.dt, i = Math.max(0, Math.min(DIST.length - 2, Math.floor(f))); return lerp(DIST[i], DIST[i + 1], clamp(f - i)); };
  const lanesIn = (t) => sineIO(span(t, a.race - .15, a.race + 1.3));
  const lanesOut = (t) => sineIO(span(t, a.going - .1, a.going + 1.9));
  const LR = prng(1906), LL = Array.from({ length: LANES.n }, (_, i) => ({ v: .8 + LR() * .45, ph: LR() * 700, n: i === LANES.held ? 0 : 1 }));
  const GATE = 660;
  function lanes(ctx, t) {
    const ui = lanesIn(t), uo = lanesOut(t); if (ui <= 0 || uo >= 1) return;
    const xl = lerp(LANES.x0, LANES.x1, uo), xr = lerp(LANES.x0, LANES.x1, ui), L = LANES.x1 - LANES.x0, D = distAt(t);
    ctx.save(); F.float(ctx, t, .5); ctx.beginPath(); ctx.rect(xl, 560, xr - xl, 380); ctx.clip();
    for (let i = 0; i < LANES.n; i++) {
      const y = LANES.y0 + i * LANES.gap, ln = LL[i];
      ctx.strokeStyle = rgba(COOL.line, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LANES.x0, y); ctx.lineTo(LANES.x1, y); ctx.stroke();
      for (let j = 0; j < ln.n; j++) {
        const pos = ((D * ln.v + ln.ph + j * L / ln.n) % L + L) % L, f = pos / L, x = LANES.x0 + pos, s = Math.sin(Math.PI * f) ** .5;
        const tail = 50 + 60 * speedM(t);
        ctx.fillStyle = E.lin(ctx, x - tail, y, x, y, [[0, rgba(COOL.body, 0)], [1, rgba(COOL.body, .9 * s)]]); ctx.fillRect(x - tail, y - 3, tail, 6);
        halo(ctx, x, y, 26 * s, .6 * s, COOL.halo, COOL.core); ctx.fillStyle = rgba(COOL.core, s); ctx.beginPath(); ctx.arc(x, y, 7 * s, 0, TAU); ctx.fill();
      }
    }
    // 6.01: a finished system (gold) rolls in and is held at a gate: HELD BACK FOR MONTHS
    const gu = span(t, a.held - .2, a.held + .5), hu = span(t, a.held, a.held + 2.2);
    if (gu > 0) {
      const y = LANES.y0 + LANES.held * LANES.gap;
      ctx.fillStyle = rgba(P.cream, .9); ctx.fillRect(GATE, y - 26 * expoOut(gu), 6, 52 * expoOut(gu));
      if (hu > 0) {
        const x = lerp(LANES.x0 - 30, GATE - 24, 1 - (1 - hu) ** 3), br = 1 + .08 * Math.sin(t * 2.4);
        ctx.fillStyle = E.lin(ctx, x - 120, y, x, y, [[0, rgba(GOLD.body, 0)], [1, rgba(GOLD.body, .7 * (1 - hu))]]); ctx.fillRect(x - 120, y - 3, 120, 6);
        halo(ctx, x, y, 34 * br, .6, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
      }
      txt(ctx, 'HELD BACK FOR MONTHS', GATE - 10, y - 44, 26, rise(span(t, a.held + .9, a.held + 1.6)), { col: GOLD.text, align: 'right' });
    }
    ctx.restore();
    // labels above the lanes: A CHOICE · the share-price ticker (pushes the lights faster)
    ctx.save(); F.float(ctx, t, .5); ctx.beginPath(); ctx.rect(xl, 0, W - xl, H); ctx.clip();
    txt(ctx, 'A CHOICE', LANES.x0, 640, 44, rise(span(t, a.choiceW - .1, a.choiceW + .6)), { serif: true });
    const tk = sineIO(span(t, a.sprice - .2, a.sprice + 1.4));
    if (tk > 0) {
      const pts = [], x0 = 330, x1 = 800; for (let q = 0; q <= 40; q++) { const f = q / 40; pts.push([lerp(x0, x1, f), 628 - f * 46 + 12 * Math.sin(q * 1.7) * (1 - f * .4)]); }
      ctx.strokeStyle = rgba(COOL.body, .95); ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath();
      const n = Math.max(1, Math.round(tk * 40)); for (let q = 0; q <= n; q++) q ? ctx.lineTo(...pts[q]) : ctx.moveTo(...pts[q]); ctx.stroke();
      const e = pts[n]; halo(ctx, e[0], e[1], 18, .5, COOL.halo, COOL.core);
      txt(ctx, 'SHARE PRICE', x1 + 16, 580, 24, rise(span(tk, .6, 1)), { col: COOL.text });
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- 6.01–6.03 the booklet, the prospectus, the stamps, the settle
  const BK = { x: 150, y: 250, w: 660, h: 320 }, BK2 = { x: 96, y: 336, w: 400, h: 194 };
  const bkGrow = (t) => sineIO(span(t, a.answer + .05, a.answer + 2.1));
  const bkSide = (t) => sineIO(span(t, a.going + 1.6, a.going + 3.6));
  const bkTuck = (t) => sineIO(span(t, a.survive + .1, a.survive + 2.1));
  const DOC = { s: 400, y: 186, x: 1010, xc: 760 };
  const docOut = (t) => sineIO(span(t, a.going + 1.6, a.going + 3.6));          // slides out from behind the booklet
  const docOpen = (t) => span(t, a.writing - .3, a.writing + .9) * (1 - span(t, a.survive + .1, a.survive + 1.3));
  const docMid = (t) => sineIO(span(t, a.survive + .1, a.survive + 2.1));
  const settle = (t) => sineIO(span(t, a.record + .5, a.record + 2.6));
  let GAPS = null;   // the crystal's gap on screen (this frame)
  function bookletRect(t) {
    const g = GAPS ?? [1350, 540]; let r = lerpR({ x: g[0] - 20, y: g[1] - 10, w: 40, h: 40 * BK.h / BK.w }, BK, bkGrow(t));
    if (bkSide(t) > 0) r = lerpR(r, BK2, bkSide(t));
    if (bkTuck(t) > 0) { const dx = lerp(DOC.x, DOC.xc, docMid(t)); r = lerpR(r, { x: dx + 40, y: DOC.y + 140, w: 300, h: 300 * BK.h / BK.w }, bkTuck(t)); }
    return r;
  }
  function booklet(ctx, t) {
    const g = bkGrow(t); if (g <= 0 || bkTuck(t) >= 1) return;
    const r = bookletRect(t), k = r.w / BK.w;
    ctx.save(); F.float(ctx, t, g); ctx.translate(r.x, r.y); ctx.scale(k, k); ctx.rotate(.01 * (1 - g));
    shell(ctx, { x: 0, y: 0, w: BK.w, h: BK.h });
    ctx.fillStyle = mixHex(PAPER.shade, PAPER.edge, .5); ctx.fillRect(0, 0, 16, BK.h);   // the spine
    const cu = (t0, d = .8) => rise(span(t, t0, t0 + d));
    txt(ctx, 'ESSAY · SEP 12, 2026', 52, 62, 22, cu(a.answer + 1.3), { col: PAPER.faint });
    txt(ctx, 'We Must Pace', 50, 150, 64, cu(a.sept - .1), { serif: true, col: PAPER.ink, weight: 400 });
    txt(ctx, 'the Frontier', 50, 222, 64, cu(a.sept + .1), { serif: true, col: PAPER.ink, weight: 400 });
    txt(ctx, 'DARIO AMODEI', 52, 284, 26, cu(a.sept + .6), { col: GOLD.deep });
    ctx.restore();
    // 6.02: bracket over the booklet
    const bu = span(t, a.word - .1, a.word + .7) * (1 - span(t, a.survive, a.survive + .4));
    if (bu > 0) { ctx.save(); F.float(ctx, t, 1); F.bracket(ctx, r.x, r.x + r.w, r.y - 22, bu, 'HIS WORD, NOT PROOF', { size: lerp(28, 24, bkSide(t)) }); ctx.restore(); }
  }
  function docRect(t, c) {   // the cover rect on screen: x, y, s (cover width)
    const bk = bookletRect(t), s0 = bk.h / 1.55, o = docOut(t);   // starts small and hidden behind the booklet
    let r = { x: lerp(bk.x + bk.w - s0 - 24, DOC.x, o), y: lerp(bk.y + 6, DOC.y, o), s: lerp(s0, DOC.s, o) };
    r.x = lerp(r.x, DOC.xc, docMid(t));
    const st = settle(t);
    if (st > 0) {
      const p = E.project(c, F0, DOCW.x, DOCW.y), k = p ? p[2] : .5, tgt = p ? { x: p[0], y: p[1], s: DOCW.s * k } : r;
      r = { x: lerp(r.x, tgt.x, st), y: lerp(r.y, tgt.y, st) - 140 * Math.sin(Math.PI * st), s: lerp(r.s, tgt.s, st) };
    }
    return r;
  }
  const DOCW = { x: 1222, y: 975 - 62 * 1.3 - 62 * .16, s: 62 };   // the document standing on the ledge (F0 card)
  function docOnLedge(ctx, t) { ctx.save(); ctx.translate(DOCW.x, DOCW.y); ctx.scale(DOCW.s / DOC.s, DOCW.s / DOC.s); docBody(ctx, t); ctx.restore(); }
  function documentP(ctx, t, c) {
    const out = docOut(t); if (out <= 0 || settle(t) >= 1) return;
    const r = docRect(t, c), k = r.s / DOC.s, st = settle(t);
    ctx.save(); F.float(ctx, t, 1 - st); ctx.translate(r.x, r.y); ctx.scale(k, k); docBody(ctx, t); ctx.restore();
  }
  function docBody(ctx, t) {
    F.prospectus(ctx, t, 0, 0, DOC.s, { u: 1, thick: 1, tabs: 1, open: docOpen(t), cover: 'PROSPECTUS', sub: 'FORM S-1/A',
      page: (cx, w, h) => {
        // left page: IN WRITING · A LEGAL DOCUMENT
        F.goldText(cx, [['IN WRITING', 0]], -w / 2, h * .36, 54, rise(span(t, a.writing + .1, a.writing + .9)), { serif: true, align: 'center', col: GOLD.deep });
        txt(cx, 'A LEGAL DOCUMENT', -w / 2, h * .46, 24, rise(span(t, a.legal - .1, a.legal + .6)), { col: PAPER.ink, align: 'center' });
        // right page: the four lines light on their words
        [['THE RISKS', a.risks], ['THE LOSSES', a.losses], ['WHO HOLDS THE VOTES', a.votes], ['ANYONE CAN READ IT', a.anyone]].forEach(([s, t0], i) => {
          const y = h * (.2 + i * .18), lu = span(t, t0 - .1, t0 + .5);
          cx.fillStyle = rgba(PAPER.ink, .1); cx.fillRect(34, y + 14, w - 68, 2);
          if (lu > 0) { cx.fillStyle = rgba(GOLD.halo, .22 * expoOut(lu)); cx.fillRect(28, y - 30, (w - 56) * expoOut(lu), 42); }
          txt(cx, s, 40, y, 26, rise(lu), { col: mixHex(PAPER.ink, GOLD.deep, .5 * lu) });
        });
      } });
    // the stamps on the cover (after it closed)
    F.stamp(ctx, t, 'UNPROVEN', DOC.s / 2, DOC.s * 1.3 * .6, { t0: a.unproven + .05, size: 40, rot: -.08, ink: PAPER.ink });
    F.stamp(ctx, t, 'ON THE RECORD', DOC.s / 2, DOC.s * 1.3 * .82, { t0: a.record - .05, size: 30, rot: .04, ink: GOLD.deep });
  }

  // ---------------------------------------------------------------- M.01 subscribe: you with the shard, the city lights up
  const cityW = (t) => sineIO(span(t, a.everybody - .4, a.everybody + 2.4)) * (1 - sineIO(span(t, a.ifm + .4, a.ifm + 4.4)));
  const youOn = (t) => t < a.c3.s + 1;   // you stand on the ledge all along (off-frame at plateCrystal); removed while the C3 plate covers the frame (plateSort has no you)
  const pose = (t) => ({ armR: [1.05, 2.25], armL: [-.18, -.12], look: lerp(.3, .85, sineIO(span(t, a.everybody - .6, a.everybody + 1.6))) });

  // ---------------------------------------------------------------- 7.01–7.03 the tag: $ ? → ≈ $1.4 T, the card, retract
  const flipU = (t) => span(t, a.top + .1, a.top + .7);
  const tagIn = (t) => 1 - sineIO(span(t, a.number + 1.6, a.number + 3.4));
  const VC = { x: 100, y: 330, w: 800, h: 290 };
  const vcU = (t) => sineIO(span(t, a.top + .6, a.top + 2.6)) * (1 - sineIO(span(t, a.number - .1, a.number + 1.8)));
  function tagFn(ctx, t, r, c) {
    const u = tagIn(t); if (u <= 0) return;
    const fu = flipU(t), sx = Math.abs(Math.cos(Math.PI * fu)), text = fu < .5 ? '$ ?' : '≈ $1.4 T';
    const ax = r.x + r.r * .48, ay = r.y + r.r * .9, swing = .05 * Math.sin(Math.PI * 2 * span(t, a.final, a.final + 1.6)) * (1 - span(t, a.final, a.final + 1.6));
    ctx.save(); ctx.translate(ax, 0); ctx.scale(Math.max(.04, sx), 1); ctx.translate(-ax, 0);
    const box = F.priceTag(ctx, t, ax, ay, text, u, { len: 150, size: 34, swing });
    ctx.restore();
    if (box) { const p0 = E.project(c, S.Z_CRY, box.x - box.w / 2, box.y), p1 = E.project(c, S.Z_CRY, box.x + box.w / 2, box.y + box.h); if (p0 && p1) TAGBOX = { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] }; }
  }
  function valueCard(ctx, t) {
    const u = vcU(t); if (u <= 0) return;
    const r = lerpR(TAGBOX ?? { x: 1300, y: 700, w: 160, h: 70 }, VC, u);
    ctx.save(); F.float(ctx, t, u); shell(ctx, r, { style: 'night' });
    if (u > .98 || t < a.number) {
      ctx.translate(VC.x, VC.y);
      ctx.save(); ctx.beginPath(); ctx.rect(r.x - VC.x, r.y - VC.y, r.w, r.h); ctx.clip();
      txt(ctx, 'AT THE TOP OF THE EXPECTED RANGE', 40, 66, 24, rise(span(t, a.top + 2.0, a.top + 2.8)), { col: P.halo2 });
      F.goldText(ctx, [['UP TO ≈ $1.4 TRILLION', 1]], 38, 168, 74, rise(span(t, a.tril - .1, a.tril + .7)), { serif: true });
      txt(ctx, 'FULLY DILUTED', 40, 232, 24, rise(span(t, a.tril + .6, a.tril + 1.3)));
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- 7.03–7.08 the trays (plateSort geometry, F.float(1) as the plate)
  const SK = S.SORT.known, SF = S.SORT.fore;
  const trayU = (t) => span(t, a.sort + .1, a.sort + 1.9);
  // the four cards exactly as S.sortTrays draws them (the plate takes over with u = 1)
  const CARD = [
    (ctx, t, u) => F.dataCard(ctx, t, SK.x + 30, SK.y + 80, SK.w - 60, { u, kind: '', title: 'REVENUE', big: '$41M → $17.0B', bigSize: 58, small: '2023 (YEAR) → Q3 2026 (QUARTER)', h: 220 }),
    (ctx, t, u) => F.dataCard(ctx, t, SK.x + 30, SK.y + 316, SK.w - 60, { u, kind: '', title: 'NET LOSS, JAN–SEP 2026', big: '≈ $104B', bigSize: 58, small: '$94.3B NON-CASH · OPERATING LOSS $1.3B', h: 220 }),
    (ctx, t, u) => F.dataCard(ctx, t, SF.x + 30, SF.y + 80, SF.w - 60, { u, kind: '', title: 'THE SELLER, ON STAGE', big: '1–2 YEARS', bigSize: 58, small: '"A COUNTRY OF GENIUSES"', h: 220 }),
    (ctx, t, u) => F.dataCard(ctx, t, SF.x + 30, SF.y + 316, SF.w - 60, { u, kind: '', title: 'THE DOCUMENT', big: 'WITHIN A FEW YEARS', bigSize: 46, small: 'WHERE EVERY WORD CARRIES LEGAL WEIGHT', h: 220 }),
  ];
  const C1R = { x: SK.x + 30, y: SK.y + 80, w: SK.w - 60, h: 220 };
  const BASE = 770, THIN = { x: 268, w: 150 }, BIG = { x: 470, w: 230 }, BIGTOP = 150;
  const thinU = (t) => span(t, a.forty - .3, a.forty + .5);
  const bigU = (t) => sineIO(span(t, a.seventeen - .1, a.seventeen + 1.9));   // ★ 2.0 s
  const condense = (t) => sineIO(span(t, a.real + .1, a.real + 2.0));
  const wipe1 = (t) => sineIO(span(t, a.real + 1.9, a.real + 2.8));
  const tPlateEnd = tPlate - .15;
  const c2U = (t) => span(t, a.also + .2, a.also + 1.7);
  const c3U = (t) => span(t, a.oneortwo - 1.0, a.oneortwo + .6);
  const c4U = (t) => span(t, Math.min(a.few - .6, tPlateEnd - 1.6), Math.min(a.few + .9, tPlateEnd));
  function trays(ctx, t) {
    const u = trayU(t); if (u <= 0) return;
    ctx.save(); F.float(ctx, t, 1);
    S.sortTrays(ctx, t, u, { cards: false });
    // the trays light on "Known:" / "Everything beyond that" (a brighter edge, back to normal)
    for (const [b, col, t0] of [[SK, GOLD.line, a.known], [SF, COOL.line, a.beyond]]) {
      const g = Math.sin(Math.PI * span(t, t0 - .2, t0 + 3.2)); if (g <= 0) continue;
      ctx.strokeStyle = rgba(col, .9 * g); ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 16); ctx.stroke(); halo(ctx, b.x + 90, b.y + 44, 120, .2 * g, col, P.cream);
    }
    // ★ the revenue bars: a hairline for a whole year 2023, a huge bar for one quarter of 2026 (to scale: 17.0B / 41M ≈ 415×)
    const cd = condense(t), lab = 1 - expoIn(span(t, a.real + .1, a.real + .6));
    if (thinU(t) > 0 && cd < 1) {
      const th = 1.5;
      ctx.save(); ctx.globalAlpha *= 1 - cd;
      const tw = THIN.w * expoOut(thinU(t)) * (1 - cd);
      halo(ctx, THIN.x + tw / 2, BASE, 40, .35 * expoOut(thinU(t)), GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.fillRect(THIN.x, BASE - th, tw, th);
      ctx.restore();
      txt(ctx, '$41M', THIN.x, BASE - 74, 50, rise(span(t, a.forty - .1, a.forty + .6)) * lab, { serif: true, col: GOLD.text, weight: 400 });
      txt(ctx, '2023 · A YEAR', THIN.x, BASE - 34, 22, rise(span(t, a.forty + .3, a.forty + 1)) * lab, { col: P.cream });
    }
    const bu = bigU(t);
    if (bu > 0 && wipe1(t) < 1) {
      const hBig = (BASE - BIGTOP) * bu, r0 = { x: BIG.x, y: BASE - hBig, w: BIG.w, h: hBig }, r = cd > 0 ? lerpR(r0, C1R, cd) : r0;
      ctx.save();
      if (cd < 1) halo(ctx, r.x + r.w / 2, r.y, 160 * (1 - cd), .45 * (1 - cd), GOLD.halo, GOLD.core);
      ctx.fillStyle = cd > 0 ? mixHex(GOLD.body, mixHex(P.night1, P.ind2, .55), smooth(span(cd, .35, 1))) : E.lin(ctx, 0, r.y, 0, BASE, [[0, GOLD.hot], [1, GOLD.mid]]);
      ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, Math.max(1, r.h), lerp(3, 12, cd)); ctx.fill();
      if (cd > 0) { ctx.strokeStyle = rgba(GOLD.line, .55 * cd); ctx.lineWidth = 2; ctx.stroke(); }
      ctx.restore();
      txt(ctx, '$17.0B', BIG.x + BIG.w + 20, BIGTOP + 70, 64, rise(span(t, a.seventeen + .5, a.seventeen + 1.2)) * lab, { serif: true, col: GOLD.text, weight: 400 });
      txt(ctx, 'Q3 2026 · A QUARTER', BIG.x + BIG.w + 22, BIGTOP + 110, 22, rise(span(t, a.seventeen + .9, a.seventeen + 1.6)) * lab);
    }
    // the REVENUE card is revealed over the condensed bar by a wipe (left → right), then it simply stays
    const w1 = wipe1(t);
    if (w1 > 0) { ctx.save(); if (w1 < 1) { ctx.beginPath(); ctx.rect(C1R.x - 20, C1R.y - 20, (C1R.w + 40) * w1, C1R.h + 60); ctx.clip(); } CARD[0](ctx, t, 1); ctx.restore(); }
    if (c2U(t) > 0) CARD[1](ctx, t, c2U(t));
    if (c3U(t) > 0) CARD[2](ctx, t, c3U(t));
    if (c4U(t) > 0) CARD[3](ctx, t, c4U(t));
    ctx.restore();
  }

  // ---------------------------------------------------------------- clips C2, C3 (out of a facet and back)
  const morph = (t, w) => span(t, w.s - 1.5, w.s + .3) * (1 - span(t, w.e - .2, w.e + 1.6));
  const fscreen = (t, w) => span(t, w.s - 2.2, w.s - 1.5) * (1 - span(t, w.e + 1.6, w.e + 1.9));

  // ---------------------------------------------------------------- sources (y 870, above the subtitles)
  function sources(ctx, t) {
    F.source(ctx, t, a.trustees + 1.6, a.sharp - .2, F.SOURCES.ap);
    F.source(ctx, t, a.answer + 2.0, a.word + 1.4, F.SOURCES.pace);
    F.source(ctx, t, a.tril, a.number + .8, F.SOURCES.valuation);
    F.source(ctx, t, a.forty, a.also - .1, F.SOURCES.revenue);
    F.source(ctx, t, a.also + .5, a.beyond, F.SOURCES.prospectus);
  }

  // ---------------------------------------------------------------- one frame
  const draw = (ctx, t) => {
    if (t < tIn) { S.plateCrystal(ctx, t, T); return; }
    if (t >= tPlate) { S.plateSort(ctx, t, T); return; }
    const c = cam(t);
    TAGBOX = null; GAPS = null;
    const ps = pose(t), cw = cityW(t);
    let HAND = null;
    const out = S.cityWorld(ctx, c, t, {
      crystal: { gap: 1, crack: .75 * Math.sin(Math.PI * span(t, a.cat - .2, a.cat + 2.4)) },
      tag: (cx, r) => tagFn(cx, t, r, c),
      room: { lit: 1, seated: 1, wheel: { a: 1, glass: 1 }, count: { f: 0, tr: span(t, a.trustees + .8, a.trustees + 2.2) } },
      city: cw,
      you: youOn(t) ? { o: ps } : false,
      extra: (cx, hands) => {
        if (!youOn(t)) return;
        if (hands?.R) HAND = hands.R;
        if (HAND) F.shard(cx, t, HAND[0] + 4, HAND[1] - 30, 64, { rot: -.12 + .04 * Math.sin(t * .7), glow: .55 + .25 * cw });
        if (settle(t) >= 1) docOnLedge(cx, t);
      },
    });
    if (out.cr) { const g = E.project(c, S.Z_CRY, out.cr.gap[0], out.cr.gap[1]); if (g) GAPS = g; }
    const crs = S.crystalAt(c);
    letters(ctx, t, crs);
    F.veil(ctx, veilA(t));
    // explainers (over the veil), in onset order
    letterCard(ctx, t, crs);
    ribbon(ctx, t);
    if (t > a.trustees && t < a.sharp + .2) roomLabels(ctx, t);
    if (t > a.sharp && t < a.c2.s + .5) {   // 5.05: Bengio's name pinned to the left facet
      const fp = facetPts(c, t, FACET_L);
      if (fp.every(Boolean)) {
        const fx = (fp[0][0] + fp[1][0] + fp[2][0]) / 3, fy = (fp[0][1] + fp[1][1] + fp[2][1]) / 3;
        const lu = rise(span(t, a.bengio - .1, a.bengio + 1.1)) * (1 - sineIO(span(t, a.race + .9, a.race + 1.7)));
        if (lu > 0) { ctx.save(); F.float(ctx, t, .3); F.goldLabel(ctx, fx, fy, 'YOSHUA BENGIO', 'CO-CHAIR, UN SCIENTIFIC PANEL ON AI', lu, { dx: -150, dy: 150, size: 40 }); ctx.restore(); }
      }
    }
    lanes(ctx, t);
    if (bkTuck(t) > 0) { booklet(ctx, t); documentP(ctx, t, c); } else { documentP(ctx, t, c); booklet(ctx, t); }
    valueCard(ctx, t);
    trays(ctx, t);
    // F.bracket NOT INVESTMENT ADVICE under the board (7.01)
    const nia = span(t, a.ifm + 1.2, a.ifm + 2) * (1 - span(t, a.number - .3, a.number + .2));
    if (nia > 0) F.bracket(ctx, 72, 470, 262, nia, 'NOT INVESTMENT ADVICE', { size: 22 });
    // the facets turn into screens; the clips grow out of them and back
    for (const [id, w, ids] of [['C2', a.c2, FACET_L], ['C3', a.c3, FACET_R]]) {
      const fs = fscreen(t, w); if (fs <= 0) continue;
      const from = facetScreen(ctx, c, t, ids, fs), m = morph(t, w);
      if (m > 0 && from) F.clipPlate(ctx, t, T, id, { from, morph: m });
    }
    F.board(ctx, t, T);
    sources(ctx, t);
  };
  draw.cam = cam; draw.a = a;
  return draw;
}
