// Chunk C6 · "The plan", §4 Step one: plant → South Korea · shots 3.14–4.11 (bild/shots.md v2 §3/§4) · builder c06
// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// PLAN (gate 1). All times are VO anchors (T.S/T.E), never seconds. No ★ in C6; 3.17 (napkin → plan sheet) gets the full care.
//  shot  │ words (accent)                                     │ hero onset                                        │ carrier into the next shot                 │ type
//  3.14  │ So here's the **plan**.                            │ her hands turn the napkin with 3 signs to us,     │ the napkin: the camera pushes in on PLANT  │ (b) push-in
//                                                               the pen arrives in her hand (c05>c06)                (plan sequence, one continuous lap set)
//  3.15  │ **Plant** a share … now, while it's still **small**.│ the pen writes PLANT; the dot becomes an amber    │ the pen travels right                      │ plan seq.
//                                                               seed (M2), it shrinks to a tiny seed on "small"
//  3.16  │ Let it **grow** with every **success** …           │ GROW written; the sprout draws on, a leaf per beat │ the pen travels right                      │ plan seq.
//  3.17  │ Then **harvest** the **same share** for **every    │ HARVEST written; the pen cuts the fruit in six    │ the coupon PLANT: the camera pushes in     │ (b) push-in
//          human being**.                                     equal pieces; on "every human being" a burin of light sweeps the napkin and leaves the
//                                                               engraved plan sheet (3 coupons PLANT · GROW · HARVEST) — the camera pulls back as the paper grows
//  4.01  │ Step one: **plant**.                               │ foil runs round coupon PLANT, it embosses; the     │ the seed → it becomes the dawn sun        │ (b) iris
//                                                               engraved seed lifts off as a real light seed
//  4.02  │ Right now, these companies are still **small**.    │ dawn, two low glass towers (OpenAI, Anthropic),   │ the price tag → push-in                    │ (b) zoom
//                                                               a walker reaches their first floor; a tag hangs low
//  4.03  │ … worth about **$220** for **every person** …      │ the towers turn to outlines, the tag reads $220,  │ one certificate rises                      │ (a) up
//                                                               the value bursts into a crowd, each with a tiny certificate (on-screen source)
//  4.04  │ … worth **many times** that.                       │ the towers grow through the clouds, the tag rides │ fast rewind pan down                      │ (c) whipU
//                                                               up, the certificates below stay tiny
//  4.05▲ │ So the time to set slices **aside** is **now**.    │ high view, towers small again; perforations draw  │ one slice lifts                            │ plan seq.
//                                                               round a wedge on each plinth, PUNCH on "aside", the slices are laid beside the towers
//  4.06  │ But a share only counts if it **leaves** the company.│ one slice is a share certificate; the wind lifts │ the falling certificate                    │ (a) down
//                                                               it over the fence ring; on "leaves" it crosses the line and sinks outside
//  4.07  │ … an **independent fund**, under a **fixed rule** that **no board** can change.  │ it drops into the sealed glass fund; the foil seal presses on "fixed rule"; a cufflink
//                                                               hand rattles the lid on "no board", it holds      │ the camera stays on the glass              │ plan seq.
//  4.08  │ … between a **gift** and a **right**.              │ inside, the certificate turns; the "gift" bow     │ the certificate's field vignette → push-in │ (b) zoom
//                                                               unties, an embossed seal RIGHT gleams beneath
//  4.09  │ The first seeds are already in the **ground**.     │ dawn field, three mounds, shoots break the soil   │ sideways truck right                       │ plan seq.
//  4.10  │ … turned its subsidies … into a **stake** …        │ a hand plants a card; it flips like a coin:        │ the truck runs on                          │ plan seq.
//                                                               SUBSIDIES → STAKE (on-screen source)
//  4.11  │ … **floated** a national AI company, partly owned by **all its citizens**. │ a second hand's dotted idea card floats a hand's breadth above the soil, its ring of
//                                                               tiny owners lights up, then it tips into the soil (on-screen source) │ exit down (c06>c07) │ (a) down
// Boundaries: in  = carry('c05>c06') 'pen': the pen arrives in her hand on the lap (C.pos until its last key, then the writing path).
//             out = carry('c06>c07') 'own', tr 'down': the dotted idea card tips into the soil at C.pos(t), drawn until C.t + .25 and held
//             on screen through the tilt (compensated like c07's form); its people fade first, so only the dotted card meets c07's ghost form.
// Sound (lead places phone/foil/shimmer/gavel/bloom): C6 adds only what its images cause, in pauses where possible:
//   foil_glint (the new sheet, pause 280.2–281.4), stamp (coupon embosses), stamp (the punch ▲), card (slices land, pause),
//   whoosh_airy (the certificate lifts), stamp (the seal presses), paper_pop (the bow lets go), card (the card is planted).
// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { carry, track } from '../lib/carry.mjs';
import { napkin } from '../lib/napkin.mjs';
import { rooftop } from '../lib/rooftop.mjs';
import { hand, handTip, SKINS } from '../lib/hand.mjs';
import { pen } from '../lib/paper.mjs';
import { shareLight } from '../lib/share.mjs';
import { planSheet, planSheetWarm, couponBox, PLAN } from '../lib/plansheet.mjs';
import { glassFund, foilSeal } from '../lib/glassfund.mjs';
import { field } from '../lib/field.mjs';
import { figureFlat, handPos, POSES } from '../lib/figure.mjs';
import { ghostLine } from '../lib/ghost.mjs';
import { gBorder, rosette, intaglio, ring, microtext } from '../lib/certificate.mjs';
import { stipple, fog as artFog } from '../lib/art.mjs';
import { once, wordStrokes, penWrite, bokehLayer, lapLayer, labelCard, ideaCard } from '../lib/sc06_kit.mjs';
import { towersFrame, priceTag, projector, camera, TW, FENCE, PLR } from '../lib/sc06_towers.mjs';

const TAU = Math.PI * 2;
const eo5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; };
const bell = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));
const CREAM = '#f3efe2', AMBER = '#ffb35c', CORE = '#fff1d6', INKN = '#1d2238';

// ---------- shared looks ----------
function vignette(ctx, a = .5, x = W / 2, y = H / 2, r0 = 420, r1 = 1250) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); g.addColorStop(0, 'rgba(4,3,10,0)'); g.addColorStop(1, `rgba(4,3,10,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
// on-screen fact line (bottom 170 px stay free for subtitles)
// the dark bed under a fact line: fades out upward, downward and to the right (no hard edge)
const factBed = () => once('c6factbed', () => { const [c, g] = canvas(Math.round(W * .86), 190);
  const v = g.createLinearGradient(0, 0, 0, 190); v.addColorStop(0, 'rgba(6,4,12,0)'); v.addColorStop(.55, 'rgba(6,4,12,.42)'); v.addColorStop(1, 'rgba(6,4,12,0)'); g.fillStyle = v; g.fillRect(0, 0, c.width, 190);
  g.globalCompositeOperation = 'destination-in'; const hz = g.createLinearGradient(0, 0, c.width, 0); hz.addColorStop(0, 'rgba(0,0,0,1)'); hz.addColorStop(.62, 'rgba(0,0,0,1)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, c.width, 190); return c; });
// a soft warm glow sprite (radial, cached): the light of a small certificate in a hand
const glowSpr = () => once('c6glowspr', () => { const [c, g] = canvas(64, 64), rg = g.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,200,130,1)'); rg.addColorStop(.3, 'rgba(255,179,92,.42)'); rg.addColorStop(1, 'rgba(255,179,92,0)'); g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return c; });
function factCard(ctx, lines, a, o = {}) {
  if (a <= 0) return; const x = o.x ?? 110, y = o.y ?? H - 236, fs = o.size ?? 40;
  ctx.save();
  ctx.globalAlpha = a; ctx.drawImage(factBed(), 0, y - 120); ctx.globalAlpha = 1;
  ctx.shadowColor = 'rgba(4,3,10,.85)'; ctx.shadowBlur = 14;
  ctx.fillStyle = rgba(AMBER, .9 * a); ctx.fillRect(x, y - 54 + (1 - a) * 10, 34 * a, 2);
  // rich line: runs of serif text, the symbols ≈ → in Inter (the serif has no glyph for them)
  let cx = x; const yy = y + (1 - a) * 12;
  for (const part of lines[0].split(/([≈→])/)) { if (!part) continue; const sym = part === '≈' || part === '→';
    if (sym) { ctx.font = `500 ${Math.round(fs * .78)}px Inter`; text(ctx, part, cx + 4, yy - fs * .06, { size: Math.round(fs * .78), weight: 500, color: rgba(AMBER, a) }); cx += ctx.measureText(part).width + 10; }
    else { ctx.font = `${fs}px "Instrument Serif"`; text(ctx, part, cx, yy, { size: fs, font: 'Instrument Serif', color: rgba(CREAM, a) }); cx += ctx.measureText(part).width; } }
  if (lines[1]) text(ctx, lines[1], x, y + 36 + (1 - a) * 12, { size: 17, weight: 600, color: rgba('#e8dcc4', .85 * a), spacing: 3 });
  ctx.restore();
}
// a small engraved share certificate sprite (cream paper, guilloche frame, rosette, foil corner) — cached
function certSprite() {
  return once('c6cert', () => {
    const w = 240, h = 160, [c, g] = canvas(w, h);
    g.fillStyle = '#f1e6cc'; g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, 6); g.fill();
    const pg = g.createRadialGradient(w * .3, h * .2, 0, w * .5, h * .5, w * .8); pg.addColorStop(0, 'rgba(255,250,236,.7)'); pg.addColorStop(1, 'rgba(190,160,110,.35)'); g.fillStyle = pg; g.fillRect(0, 0, w, h);
    gBorder(g, 8, 8, w - 16, h - 16, { band: 14, lines: 5, waves: 70, col: '#24384f', w: .5, a: .85, radius: 6, u: .9999 });
    rosette(g, w / 2, h / 2 - 6, { R: 30, A: 9, B: 4, n: 12, m: 5, lines: 18, col: '#8a5a24', w: .55, a: .95 });
    g.fillStyle = 'rgba(36,56,79,.75)'; g.fillRect(w / 2 - 50, h - 40, 100, 1.5); g.fillRect(w / 2 - 34, h - 32, 68, 1.2);
    const fg = g.createLinearGradient(w - 52, 14, w - 20, 46); ['#7a3b17', '#ffb35c', '#ffe2a8', '#c87a2c'].forEach((cc, k) => fg.addColorStop(k / 3, cc)); g.fillStyle = fg; g.beginPath(); g.arc(w - 36, 30, 13, 0, TAU); g.fill();
    stipple(c, { k: .3, g: 1, seed: 66, mid: false, boost: 1 });
    return c;
  });
}
function drawCert(ctx, x, y, s, rot, a = 1, o = {}) {   // centred; o.flip = cos of the turn (−1..1), o.glow
  const C = certSprite(); ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * (o.flip ?? 1), s * (o.sy ?? 1));
  if (o.shadow !== false) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 10; ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-110, -70, 220, 140); ctx.restore(); }
  ctx.drawImage(C, -120, -80);
  if ((o.flip ?? 1) < 0) { ctx.fillStyle = 'rgba(214,196,160,.92)'; ctx.fillRect(-118, -78, 236, 156); }
  if (o.glow > 0) { ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, 170); gg.addColorStop(0, rgba(AMBER, .35 * o.glow)); gg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = gg; ctx.fillRect(-170, -170, 340, 340); }
  ctx.restore();
}
function windLines(ctx, t, x, y, w, a, seed = 1) {   // airy gust strokes (the wind made visible)
  if (a <= 0) return; const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const ph = ((t * (.55 + r() * .3) + r()) % 1), yy = y + (r() - .5) * 160, L = w * (.35 + r() * .3), x0 = x - w * .6 + ph * w * 1.4;
    ctx.strokeStyle = `rgba(255,236,214,${.22 * a * Math.sin(Math.PI * ph)})`; ctx.lineWidth = 1.4; ctx.beginPath();
    for (let k = 0; k <= 24; k++) { const q = k / 24, px = x0 + q * L, py = yy + Math.sin(q * 5 + t * 2 + i) * 10 - q * 18; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.restore();
}

export default (T, R) => {
  const CIN = carry('c05>c06', T, R), COUT = carry('c06>c07', T, R);
  const S = (p, n = 0, sec = '04a') => T.S(sec, p, n), E = (p, n = 0, sec = '04a') => T.E(sec, p, n);
  const A = {
    t314: CIN.t, plan: S('plan'),
    t315: S('Plant a share'), share: S('share'), everyone: S('everyone'), now: S('now', 0), small: S('small', 0), smallE: E('small', 0),
    t316: S('Let it grow'), grow: S('grow'), success: S('success'), winners: S('winners'),
    t317: S('Then harvest'), harvest: S('harvest'), same: S('same share'), every: S('every human'), being: S('being'), beingE: E('being'),
    t401: S('Step one'), plant: S('plant', 1), plantE: E('plant', 1),
    t402: S('Right now'), small2: S('small', 1), small2E: E('small', 1),
    t403: S('OpenAI and'), together: S('together'), two: S('two hundred'), person: S('every person'), earth: S('Earth'), earthE: E('Earth'),
    t404: S('If the fortune'), many: S('many times'), manyE: E('many times'), e404: E('that'),
    t405: S('So the time'), slices: S('slices'), aside: S('aside is now'), asideE: E('aside is now'),
    t406: S('But a share only'), leaves: S('leaves'), e406: E('the company'),
    t407: S('In our plan'), fund: S('independent fund'), fixed: S('fixed rule'), noBoard: S('no board'), changeE: E('can change'),
    t408: S("That's"), gift: S('gift'), right: S('a right'), rightE: E('a right'),
    t409: S('The first seeds', 0, '04b'), ground: S('ground', 0, '04b'), groundE: E('ground', 0, '04b'),
    t410: S('The US government', 0, '04b'), subsidies: S('subsidies', 0, '04b'), stake: S('stake', 0, '04b'), e410: E('in the company', 0, '04b'),
    t411: S('Before taking', 0, '04b'), floated: S('floated', 0, '04b'), owned: S('partly owned', 0, '04b'), citizens: S('citizens', 0, '04b'), out: COUT.t,
  };
  planSheetWarm();

  // ═════════════════════════════════════ 3.14 – 4.01: the lap, the napkin, the plan sheet (one continuous set) ═════════════════════════════════════
  const N0 = { x: 960, y: 610 }, NS = 1.5, SX = [-112, 0, 112], SY = -22, WY = 62;
  const CEND = CIN.t + 1.1;                                              // the carrier's last key
  const NROT = (t) => mix(-.9, -.035, eio(lin(A.t314 + .05, A.plan + .14, t))) + .006 * Math.sin(t * .9);   // she turns the napkin to face us
  const NPOS = (t) => { const u = eio(lin(A.t314 + .05, A.plan + .14, t)); return { x: mix(1010, N0.x, u), y: mix(548, N0.y, u) }; };
  const toW = (t, px, py) => { const r = NROT(t), c = Math.cos(r), s = Math.sin(r), P = NPOS(t); return [P.x + (px * c - py * s) * NS, P.y + (px * s + py * c) * NS]; };
  const toN = (t, wx, wy) => { const r = NROT(t), c = Math.cos(r), s = Math.sin(r), P = NPOS(t), dx = (wx - P.x) / NS, dy = (wy - P.y) / NS; return [dx * c + dy * s, -dx * s + dy * c]; };
  // the three words (napkin units): centred under their sign, kept inside the border
  const WL = ['PLANT', 'GROW', 'HARVEST'].map((w, i) => { const size = i === 2 ? 16.5 : 19, seed = 3 + i, WS = wordStrokes(w, size, seed); let cx = Math.max(-150 + WS.width / 2, Math.min(150 - WS.width / 2, SX[i]));
    return { w, size, seed, x0: cx - WS.width / 2, first: [cx - WS.width / 2 + WS.strokes[0][0][0], WY + WS.strokes[0][0][1]], last: [cx - WS.width / 2 + WS.strokes.at(-1).at(-1)[0], WY + WS.strokes.at(-1).at(-1)[1]] }; });
  const WT = [[A.t315 + .1, A.t315 + 1.12], [A.t316 + .02, A.t316 + .82], [A.t317 + .5, A.t317 + 1.3]];
  const FR = { x: 112, y: -20, r: 16 };                                 // the fruit sign (napkin units, = C1's sign)
  const CUTS = [0, 1, 2].map((k) => { const a = -Math.PI / 2 + k * Math.PI / 3; return [[FR.x - Math.cos(a) * 21, FR.y - Math.sin(a) * 21], [FR.x + Math.cos(a) * 21, FR.y + Math.sin(a) * 21]]; });
  const CT = [A.same - .02, A.same + .5];                                // the pen cuts the fruit
  const SPLIT = (t) => eo5(lin(CT[1] - .12, CT[1] + .45, t));            // the six pieces part a little
  const WIPE = [A.every + .02, A.beingE - .05];                           // the burin of light: napkin → plan sheet
  const SHEET = { x: 960, y: 596, s: 1.5, rot: -.012 };
  // pen keys in napkin units (between the written words); a rest position keeps the hand clear of the sign that just came alive
  const cEnd = (() => { const p = CIN.pos(CEND); return toN(CEND, p.x, p.y); })();
  const PK = [
    { t: CEND, p: cEnd, lift: .15 }, { t: WT[0][0], p: WL[0].first, lift: 0 },
    { t: WT[0][1], p: WL[0].last, lift: 0 }, { t: WT[0][1] + .42, p: [-4, -112], lift: .7 }, { t: WT[1][0] - .5, p: [6, -118], lift: .75 }, { t: WT[1][0], p: WL[1].first, lift: 0 },
    { t: WT[1][1], p: WL[1].last, lift: 0 }, { t: WT[1][1] + .42, p: [150, -118], lift: .7 }, { t: WT[2][0] - .5, p: [156, -124], lift: .75 }, { t: WT[2][0], p: WL[2].first, lift: 0 },
    { t: WT[2][1], p: WL[2].last, lift: 0 }, { t: CT[0], p: CUTS[0][0], lift: .1 },
    { t: CT[1], p: CUTS[2][1], lift: 0 }, { t: CT[1] + .35, p: [190, -90], lift: .8 }, { t: A.every + .15, p: [520, -520], lift: 1 },
  ];
  const penKey = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1].t) i++; const P0 = PK[i], P1 = PK[i + 1], u = eio(clamp((t - P0.t) / (P1.t - P0.t)));
    return { p: [mix(P0.p[0], P1.p[0], u), mix(P0.p[1], P1.p[1], u)], lift: mix(P0.lift, P1.lift, u) + .5 * Math.sin(Math.PI * u) * (Math.hypot(P1.p[0] - P0.p[0], P1.p[1] - P0.p[1]) > 40 ? 1 : 0) }; };
  // the camera over the lap (world = screen at z 1, x/y = the world point at screen centre)
  const CP0 = (() => { const b = couponBox(0), c = Math.cos(SHEET.rot), s = Math.sin(SHEET.rot); return { x: SHEET.x + (b.cx * c - (b.y0 + 118) * s) * SHEET.s, y: SHEET.y + (b.cx * s + (b.y0 + 118) * c) * SHEET.s }; })();
  const SEEDW = toW(A.t315 + 1, SX[0], SY);
  const RC = track([
    { dt: A.t314, x: 960, y: 540, s: 1 }, { dt: A.t315 - .2, x: 948, y: 580, s: 1.1 },
    { dt: A.t315 + .5, x: WL[0].first[0] * NS + N0.x + 40, y: 650, s: 1.72 }, { dt: A.small - .05, x: SEEDW[0] + 52, y: 640, s: 1.8 },
    { dt: A.small + .4, x: SEEDW[0] + 30, y: SEEDW[1] + 40, s: 2.05 }, { dt: A.t316 - .3, x: SEEDW[0] + 60, y: 630, s: 1.95 },
    { dt: A.t316 + .45, x: N0.x + 6, y: 640, s: 1.74 }, { dt: A.t317 - .3, x: N0.x + 24, y: 636, s: 1.72 },
    { dt: A.t317 + .5, x: N0.x + 112 * NS - 6, y: 640, s: 1.74 }, { dt: CT[1] + .1, x: N0.x + 112 * NS - 24, y: 632, s: 1.66 },
    { dt: WIPE[0] + .25, x: N0.x + 10, y: 610, s: 1.18 }, { dt: A.beingE + .3, x: 960, y: 600, s: .985 }, { dt: A.t401 + .05, x: 962, y: 598, s: 1.02 },
    { dt: A.plant + .25, x: CP0.x + 6, y: CP0.y - 14, s: 2.05 }, { dt: A.t402 + .4, x: CP0.x + 12, y: CP0.y - 60, s: 2.7 },
  ], 0);
  const camAt = (t) => { const c = RC(t); return { x: c.x + drift(t, 3, 1), y: c.y + drift(t, 2, 2), z: c.s }; };
  const w2s = (cam, x, y) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z];
  const s2w = (cam, x, y) => [cam.x + (x - W / 2) / cam.z, cam.y + (y - H / 2) / cam.z];
  // where the 4.02 sun will be: the seed flies there for the iris
  const C402 = (t) => ({ x: .5 * Math.sin(t * .23) - 1.6 * eio(lin(A.t403 - .9, A.t403 + .3, t)), y: 1.1, z: mix(12.5, 14.5, eio(lin(A.t402 - .4, A.t403 + .3, t))), pitch: .2 + .01 * eio(lin(A.t402, A.t403, t)), f: mix(1000, 1060, eio(lin(A.t402, A.t403 - .9, t))) + 300 * ein(lin(A.t403 - .9, A.t403 + .3, t)) });
  const SUN402 = (() => { const cam = camera(C402(A.t402)), P = projector(cam), hz = P(cam.x, cam.y, cam.z + 1e5)[1], sp = P(cam.x + 2, cam.y + 1.5, cam.z + 1000); return { x: sp[0] + 40, y: Math.min(hz - 8, sp[1]) }; })();
  const BG = () => once('c6roofbg', () => {
    const [c, g] = canvas(W + 240, H + 160), [s, sg] = canvas(480, 270); sg.save(); sg.scale(.25, .25);
    try { rooftop(sg, A.t314, { state: 'night', cam: { x: 0, y: 160, z: 1.3 }, seats: 2 }); } catch { sg.fillStyle = '#10142e'; sg.fillRect(0, 0, W, H); }
    sg.restore(); g.imageSmoothingQuality = 'high'; g.drawImage(s, 0, 0, W + 240, H + 160);
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = .9; g.drawImage(bokehLayer(), -30, 20); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    return c;
  });
  const HSK = '#8d5f40', HSL = '#1f6a6e', HRIM = '#ffb36a';
  // the fruit (own drawing, = C1's sign) cut into six pieces that part a little
  function fruitInk(g, t, a = 1) {
    const sp = SPLIT(t) * 4.2, cu = (t - CT[0]) / (CT[1] - CT[0]); g.save(); g.globalAlpha *= a; g.strokeStyle = INKN; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let k = 0; k < 6; k++) { const a0 = -1.6 + k * Math.PI / 3, a1 = a0 + Math.PI / 3, mid = (a0 + a1) / 2, ox = Math.cos(mid) * sp, oy = Math.sin(mid) * sp;
      g.lineWidth = 2.1; g.beginPath(); for (let i = 0; i <= 12; i++) { const aa = mix(a0, a1, i / 12), rr = FR.r; const px = FR.x + ox + Math.cos(aa) * rr * (1 + .04 * Math.sin(aa * 3)), py = FR.y + 2 * 0 + oy + Math.sin(aa) * rr; i ? g.lineTo(px, py) : g.moveTo(px, py); }
      if (sp > .3) { g.lineTo(FR.x + ox, FR.y + oy); g.closePath(); } g.stroke(); }
    if (sp <= .3) for (let k = 0; k < 3; k++) { const q = clamp(cu * 3 - k); if (q <= 0) continue; const [p0, p1] = CUTS[k]; g.lineWidth = 1.7; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(mix(p0[0], p1[0], q), mix(p0[1], p1[1], q)); g.stroke(); }
    g.lineWidth = 2; g.beginPath(); g.moveTo(FR.x + 1, FR.y - 16 - sp); g.lineTo(FR.x + 3, FR.y - 24 - sp); g.stroke();
    g.beginPath(); [[3, -22], [12, -29], [19, -26], [10, -21], [3, -22]].forEach(([px, py], i) => (i ? g.lineTo(FR.x + px, FR.y + py - sp) : g.moveTo(FR.x + px, FR.y + py - sp))); g.stroke();
    g.restore();
  }
  // extra growth of the sprout sign: a taller stem and two new leaves, drawn on (napkin units)
  const GROWL = [[[1, -44], [0, -52], [-1, -60]], [[0, -50], [-9, -58], [-19, -59], [-11, -52], [0, -50]], [[-1, -58], [7, -67], [17, -69], [10, -61], [-1, -58]]];
  function inkPoly(g, P, u, w = 2) { if (u <= 0) return; let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); let left = L * clamp(u);
    g.lineWidth = w; g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length && left > 0; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]), q = Math.min(1, left / d); g.lineTo(mix(P[i - 1][0], P[i][0], q), mix(P[i - 1][1], P[i][1], q)); left -= d; } g.stroke(); }
  const growU = (t) => [eio(lin(A.grow - .05, A.grow + .4, t)), eio(lin(A.grow + .15, A.grow + .7, t)), eio(lin(A.success, A.success + .55, t))];
  // the napkin with everything written on it, drawn at screen pos/scale; returns screen points of the signs and the pen tip
  function napkinState(ctx, t, cam, o = {}) {
    const P = NPOS(t), [sx, sy] = w2s(cam, P.x, P.y), sc = NS * cam.z, rot = NROT(t), fruitOwn = t > CT[0];
    const N = napkin(ctx, sx, sy, sc, t, { rot, light: 'night', glow: .35, marks: { dot: 1, sprout: 1, fruit: fruitOwn ? 0 : 1 }, words: 0, ink: INKN });
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(rot); ctx.scale(sc, sc);
    if (fruitOwn) fruitInk(ctx, t);
    ctx.strokeStyle = INKN; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const gu = growU(t); GROWL.forEach((L, k) => inkPoly(ctx, L, gu[k], k ? 1.9 : 2.1));
    const tips = WL.map((L, i) => { const u = lin(WT[i][0], WT[i][1], t); if (u <= 0) return null; const r = penWrite(ctx, L.w, L.x0, WY, L.size, u, { ink: INKN, seed: L.seed, w: 2 }); return u < 1 ? r.tip : null; });
    // "every human being": the ink catches light before the burin turns it into engraving
    const lightA = o.inkLight ?? 0;
    if (lightA > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55 * lightA;
      for (let i = 0; i < 3; i++) penWrite(ctx, WL[i].w, WL[i].x0, WY, WL[i].size, 1, { ink: '#ff9a3c', seed: WL[i].seed, w: 1.4 });
      ctx.strokeStyle = '#ff9a3c'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(SX[0], SY, 7, 0, TAU); ctx.stroke(); GROWL.forEach((L) => inkPoly(ctx, L, 1, 1.4)); ctx.restore(); }
    ctx.restore();
    const L2S = (px, py) => { const c = Math.cos(rot), s = Math.sin(rot); return [sx + (px * c - py * s) * sc, sy + (px * s + py * c) * sc]; };
    return { N, L2S, tips, sc, rot };
  }
  function roof(ctx, t) {
    const cam = camAt(t), z = cam.z;
    // far: the night city below the parapet, out of focus (parallax 15 %)
    ctx.fillStyle = '#0c0d22'; ctx.fillRect(0, 0, W, H);
    { const B = BG(), k = 1 + (z - 1) * .12; ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.drawImage(B, -W / 2 - 120 - (cam.x - 960) * .12, -H / 2 - 80 - (cam.y - 560) * .12); ctx.restore(); }
    // the lap set (world)
    const dark = sm(lin(A.beingE - .3, A.t401 + .6, t));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cam.x, -cam.y); ctx.drawImage(lapLayer(), -100, -100); ctx.restore();
    if (dark > 0) { ctx.fillStyle = `rgba(8,7,20,${.55 * dark})`; ctx.fillRect(0, 0, W, H); }
    // ----- the napkin, the burin wipe, the sheet
    const wipe = eio(lin(WIPE[0], WIPE[1], t)), inkLight = sm(lin(A.every - .05, A.every + .25, t)) * (1 - sm(lin(WIPE[1] - .2, WIPE[1] + .1, t)));
    const [shx, shy] = w2s(cam, SHEET.x, SHEET.y), shs = SHEET.s * z;
    const RX = (PLAN.w / 2 * SHEET.s + 60) * 1.42 * z, RY = (PLAN.h / 2 * SHEET.s + 40) * 1.42 * z, rr = wipe, [ex, ey] = w2s(cam, N0.x, N0.y);
    const clipE = (g, inside) => { g.beginPath(); if (!inside) g.rect(0, 0, W, H); g.ellipse(ex, ey, Math.max(.1, RX * rr), Math.max(.1, RY * rr), SHEET.rot, 0, TAU, !inside); g.clip('evenodd'); };
    let NS_ = null;
    if (wipe < 1) { ctx.save(); if (wipe > 0) clipE(ctx, false); NS_ = napkinState(ctx, t, cam, { inkLight }); ctx.restore(); }
    const inPlan = t > A.t401 - .2, hiU = eio(lin(A.t401 + .25, A.plant + .2, t)), press = bell(t, A.plant + .08, .07);
    let SH = null;
    if (wipe > 0) {
      ctx.save(); if (wipe < 1) clipE(ctx, true);
      const lift = 6 * sm(lin(WIPE[1] - .3, WIPE[1] + .5, t)) * (1 - sm(lin(A.t401, A.t401 + .6, t))) - 3 * press;
      SH = planSheet(ctx, shx, shy - lift * z, shs * (1 - .006 * press), t, { rot: SHEET.rot, u: 1, hi: inPlan ? 0 : null, hiU, dim: inPlan ? [0, .75 * hiU, .75 * hiU] : [0, 0, 0], lift: lift + 4, light: [W * .7, -200], glint: true });
      ctx.restore();
      // the burin front: an ellipse of light growing out of the napkin's heart, a hot point running round it, sparks
      if (wipe < 1) {
        const ax = Math.max(.1, RX * rr), ay = Math.max(.1, RY * rr), fa = Math.sin(Math.PI * clamp(wipe * 1.15));
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (const [lw, al] of [[18, .07], [6, .2], [1.6, .9]]) { ctx.strokeStyle = rgba(lw > 2 ? AMBER : CORE, al * fa); ctx.lineWidth = lw; ctx.beginPath(); ctx.ellipse(ex, ey, ax, ay, SHEET.rot, 0, TAU); ctx.stroke(); }
        ring(ctx, ex, ey, ax * .985, ay * .985, { lines: 4, band: 9, wave: 22, col: CORE, glow: null, a: .45 * fa, rot: SHEET.rot });
        const ha = t * 7.5; addGlow(ctx, ex + Math.cos(ha) * ax, ey + Math.sin(ha) * ay, 90, .8 * fa, AMBER, CORE);
        const r = prng(Math.floor(t * 30)); for (let i = 0; i < 26; i++) { const a = r() * TAU, k = .9 + r() * .12; ctx.fillStyle = `rgba(255,${200 + r() * 50 | 0},150,${(.3 + r() * .6) * fa})`; ctx.fillRect(ex + Math.cos(a) * ax * k, ey + Math.sin(a) * ay * k, 2, 2); }
        ctx.restore();
      }
    }
    // ----- her left hand: turns the napkin to us, then holds its corner
    const lhOut = eio(lin(CT[1] - .1, CT[1] + .6, t));
    if (NS_ && lhOut < 1) {
      const rot = NROT(t), cn = NS_.L2S(-176, -150), rad = [Math.cos(rot - 2.36), Math.sin(rot - 2.36)];
      const wx = cn[0] + rad[0] * 95 * z - 30 * z - lhOut * 700, wy = cn[1] + rad[1] * 95 * z - 70 * z - lhOut * 500, ang = Math.atan2(cn[1] - wy, cn[0] - wx);
      hand(ctx, wx, wy, 1.75 * z, { pose: 'open', ang, flip: true, skin: HSK, sleeve: HSL, sleeveLen: 300, rim: HRIM, light: [.5, -1], t, seed: 2, spread: .7 });
    }
    // ----- the pen and her writing hand
    let nib = null, ang = -2.42, lift = 0, ps = 1;
    // the pen arrives at c05's angle, then her wrist turns into a writing grip (hand up-right of the nib) from just after the cut
    const turnU = eio(lin(CIN.t + .2, WT[0][0] - .05, t));
    if (t < CEND) { const p = CIN.pos(t); nib = s2w(cam, p.x, p.y); lift = .15 * lin(CIN.t, CEND, t); ang = mix(p.r, -1.02, turnU) + .15 * lift; ps = p.s; nib = w2s(cam, nib[0], nib[1]); ps *= 1; }
    else {
      const writing = NS_ && NS_.tips.find((q) => q);
      if (writing) nib = NS_.L2S(writing[0], writing[1]);
      else if (t >= CT[0] && t <= CT[1]) { const cu = (t - CT[0]) / (CT[1] - CT[0]), k = Math.min(2, Math.floor(cu * 3)), q = clamp(cu * 3 - k), [p0, p1] = CUTS[k]; nib = (NS_ ? NS_.L2S : (a, b) => w2s(cam, ...toW(t, a, b)))(mix(p0[0], p1[0], q), mix(p0[1], p1[1], q)); }
      else { const k = penKey(t), w = toW(t, k.p[0], k.p[1]); nib = w2s(cam, w[0], w[1]); lift = k.lift; }
      ang = mix(CIN.pos(CEND).r, -1.02, turnU) + .05 * Math.sin(t * 2.3) * lin(CEND, CEND + .5, t) + .15 * lift; ps = mix(CIN.pos(CEND).s, 1.02, lin(CEND, CEND + .4, t));
    }
    const penA = 1 - sm(lin(A.every, A.every + .3, t));
    if (nib && penA > 0) {
      // the hand meets the pen at an angle (as a real grip does): her arm comes from straight above while the pen still has c05's angle
      const s = ps * z * .95, bd = [Math.cos(ang), Math.sin(ang)], angF = ang + Math.PI + .73 * (1 - turnU), hs = 1.6 * z;
      const grip = [nib[0] + bd[0] * 52 * s, nib[1] + bd[1] * 52 * s - lift * 14 * s], tip0 = handTip(0, 0, hs, { pose: 'write', ang: angF, flip: false, t });
      const wx = grip[0] - tip0[0], wy = grip[1] - tip0[1];
      ctx.save(); ctx.globalAlpha = penA;
      hand(ctx, wx, wy, hs, { pose: 'write', ang: angF, flip: false, skin: HSK, sleeve: HSL, sleeveLen: 320, rim: HRIM, light: [.5, -1], t, seed: 5 });
      pen(ctx, nib[0], nib[1], s, { ang, t, lift });
      ctx.restore();
    }
    // ----- the seed (3.15): the dot becomes an amber seed; on "small" it shrinks to a tiny one
    if (NS_ && t < A.t317) {
      const sp = NS_.L2S(SX[0], SY), born = lin(WT[0][1] - .1, WT[0][1] + .35, t), r0 = 15 * z * eout(born), tiny = eio(lin(A.small - .05, A.small + .35, t)), rr = mix(r0, 4.4 * z, tiny) * (1 + .25 * bell(t, A.now + .1, .12));
      if (born > 0) shareLight(ctx, sp[0], sp[1], rr, t, { mode: 'seed', a: (1 - .3 * tiny) * (1 - sm(lin(A.t316 + .3, A.t317 - .3, t)) * .5) });
    }
    // ----- 4.01: the engraved seed in coupon PLANT lifts off as a real light seed and flies to where the dawn sun will rise
    if (SH && t > A.plant - .2) {
      const em = SH.emblem(0), q = eio(lin(A.plant + .05, A.t402 - .2, t)), born = lin(A.plant - .1, A.plant + .35, t);
      const x = mix(em.x, SUN402.x, q), y = mix(em.y, SUN402.y, q) - 40 * Math.sin(Math.PI * q) * z, r = mix(9 * z, 30, q) * (1 + .3 * bell(t, A.plant + .25, .15));
      shareLight(ctx, x, y, r * eout(born), t, { mode: q > .6 ? 'light' : 'seed', a: 1 });
      if (q > .4) addGlow(ctx, x, y, 140 * q, .35 * q, '#ffd59a', CORE);
    }
    vignette(ctx, .55 + .15 * dark);
  }

  // ═════════════════════════════════════ 4.02: dawn, two low towers, a walker, a price tag ═════════════════════════════════════
  const scratch = canvas(64, 36);
  const TAG403 = (() => { const [c, g] = canvas(W, H); const r = towersFrame(g, A.t403, { cam: C402(A.t403), tag: 1, labels: 1, figure: null }); return r.tag || { x: 900, y: 600 }; })();
  function f402(ctx, t) {
    const cam = C402(t), fxp = mix(-15, -7.2, lin(A.t402 - .5, A.t403 + .4, t));
    const r = towersFrame(ctx, t, { cam, tag: 1, labels: sm(lin(A.t402 + .2, A.t402 + 1.1, t)), figure: { x: fxp, z: 28.6, phase: fxp * 2.3 }, fence: 1 });
    // "small": a hairline from the walker's head to the first floor line, both tiny in the world
    const mk = bell(t, A.small2 + .25, .35);
    if (mk > .02 && r.figure) { const P = r.P, T0 = TW[0], y1 = P(T0.x, .9 + 3.2 * 1.0, T0.z - T0.hz)[1]; ctx.save(); ctx.globalAlpha = mk * .8; ctx.strokeStyle = CORE; ctx.lineWidth = 1.2; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(r.figure.x - 18, r.figure.y - r.figure.h); ctx.lineTo(r.figure.x + 40, r.figure.y - r.figure.h); ctx.stroke(); ctx.restore(); }
    vignette(ctx, .4);
  }

  // ═════════════════════════════════════ 4.03: the towers as outlines, $220, a crowd with tiny certificates ═════════════════════════════════════
  // A (OpenAI, front-left): a rounded glass tower with a soft dome; B (Anthropic, further back, right): a stepped Art Deco tower. Never a pair.
  const G403 = { hz: 640, ax: 760, aw: 96, ah: 410, ab: 654, bx: 1172, bw: 150, bh: 280, bb: 628 };
  const DOME = .12, CR403 = [[0, 1], [.34, .97], [.6, .9], [.8, .8], [.93, .68], [1, .56]], STEP403 = [[0, .5, 1], [.5, .72, .76], [.72, .86, .54], [.86, 1, .38], [1, 1.045, .24], [1.045, 1.075, .13]];
  const roundLines = (cx, w, h, base) => { const L = [], hb = h * (1 - DOME), dome = h * DOME, arc = (y, k = 1) => { const bow = .1 * w * k * clamp((base - y) / h) - .02 * w; const A = []; for (let i = 0; i <= 18; i++) { const q = i / 9 - 1; A.push([cx + q * w / 2 * k, y - bow * Math.sqrt(1 - q * q)]); } return A; };
    L.push([[cx - w / 2, base], [cx - w / 2, base - hb]], [[cx + w / 2, base], [cx + w / 2, base - hb]], arc(base));
    for (const a of [-1.05, -.55, 0, .55, 1.05]) { const x = cx + Math.sin(a) * w / 2, by = arc(base)[Math.round((Math.sin(a) + 1) * 9)][1], ty = arc(base - hb)[Math.round((Math.sin(a) + 1) * 9)][1]; L.push([[x, by], [x, ty]]); }
    for (let f = 1; f < Math.round(hb / 30); f++) L.push(arc(base - f * hb / Math.round(hb / 30)));
    L.push(arc(base - hb)); L.push(CR403.map(([f, k]) => [cx - k * w / 2, base - hb - f * dome]), CR403.map(([f, k]) => [cx + k * w / 2, base - hb - f * dome]));
    for (const [f, k] of CR403.slice(1)) L.push(arc(base - hb - f * dome, k));
    return L; };
  const stepLines = (cx, w, h, base) => { const L = [], d = w * .26;
    for (const [a, b, k] of STEP403) { const x0 = cx - w * k / 2, x1 = cx + w * k / 2, y0 = base - a * h, y1 = base - b * h, dk = d * k;
      L.push([[x0, y0], [x0, y1], [x1, y1], [x1, y0]], [[x1, y1], [x1 + dk, y1 - dk * .45], [x1 + dk, y0 - dk * .45]], [[x0, y1], [x0 + dk, y1 - dk * .45], [x1 + dk, y1 - dk * .45]]);
      if (b <= .87) for (let f = 1; f < Math.round((b - a) * h / 26); f++) { const y = y0 - f * (b - a) * h / Math.round((b - a) * h / 26); L.push([[x0, y], [x1, y], [x1 + dk, y - dk * .45]]); }
      else if (a === .86) for (let i = 0; i <= 6; i++) { const q = i / 6; L.push([[cx, y0], [mix(x0, x1, q), y1 + (y0 - y1) * (.1 + .5 * Math.abs(q - .5))]]); }   // the sunburst in the crown
    }
    return L; };
  const TL = [roundLines(G403.ax, G403.aw, G403.ah, G403.ab), stepLines(G403.bx, G403.bw, G403.bh, G403.bb)];
  const SIL403 = [   // glass silhouettes (fade away as the outlines draw)
    (() => { const { ax: cx, aw: w, ah: h, ab: b } = G403, hb = h * (1 - DOME), A = [[cx - w / 2, b]]; for (const [f, k] of CR403) A.push([cx - k * w / 2, b - hb - f * h * DOME]); for (const [f, k] of CR403.slice().reverse()) A.push([cx + k * w / 2, b - hb - f * h * DOME]); A.push([cx + w / 2, b]); return A; })(),
    (() => { const { bx: cx, bw: w, bh: h, bb: b } = G403, Lf = [], Rt = []; for (const [a, e, k] of STEP403) { Lf.push([cx - w * k / 2, b - a * h], [cx - w * k / 2, b - e * h]); Rt.unshift([cx + w * k / 2, b - e * h], [cx + w * k / 2, b - a * h]); } return Lf.concat(Rt); })(),
  ];
  const crowd = () => once('c6crowd', () => {   // rows of tiny figures holding a tiny certificate (cached per row) + their hand points
    const rows = [], r = prng(88), cols = ['#2a2440', '#3a2c48', '#4a3448', '#2c3448', '#3c3040', '#30283c'];
    for (let j = 0; j < 7; j++) {
      const y = mix(700, 1010, Math.pow(j / 6, 1.3)), s = mix(.11, .36, Math.pow(j / 6, 1.3)), n = Math.round(mix(46, 15, j / 6)), [c, g] = canvas(W + 100, 260), pts = [];
      const F = []; for (let i = 0; i < n; i++) { const x = (i + .5 + (r() - .5) * .9) / n * (W + 60) - 30 + 50, pose = { ...POSES.hold, head: .1 + r() * .2, sh: [.6 + r() * .1, .5], el: [1.1 + r() * .1, 1.15] }, flip = r() < .5, yy = 200 + (r() - .5) * 64 * s, sf = s * (.86 + r() * .26); F.push({ i, x, yy, sf, pose, flip }); }
      F.sort((p, q) => p.yy - q.yy);   // the ones a little further back first
      for (const { i, x, yy, sf, pose, flip } of F) {
        figureFlat(g, x, yy - 90 * sf, sf, pose, { t: 0, seed: i + j * 50, col: cols[(i + j) % cols.length], rim: '#ffcf9e', rimSide: 1, flip, fast: true, shadow: true, skin: '#7a5a4a' });
        const hp = handPos(x, yy - 90 * sf, sf, pose, 0, flip); pts.push({ x: hp[0] - 50, y: hp[1] - 200 + y, s: sf, ph: r() * TAU, d: Math.abs(x - 50 - W / 2) / (W / 2) }); }
      stipple(c, { k: .3, g: 1, seed: 70 + j, mid: false, boost: 1 }); rows.push({ c, y, s, pts });
    }
    return rows;
  });
  const BG403 = () => once('c6bg403', () => { const [c, g] = canvas(W, H); const lg = g.createLinearGradient(0, 0, 0, H); lg.addColorStop(0, '#171634'); lg.addColorStop(.5, '#4a3456'); lg.addColorStop(.6, '#b07a7c'); lg.addColorStop(.62, '#5a3e4c'); lg.addColorStop(1, '#1c1424'); g.fillStyle = lg; g.fillRect(0, 0, W, H);
    const rg = g.createRadialGradient(960, 640, 0, 960, 640, 900); rg.addColorStop(0, 'rgba(255,200,150,.45)'); rg.addColorStop(1, 'rgba(255,170,130,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    rosette(g, 960, 420, { R: 520, A: 90, B: 40, n: 40, m: 13, lines: 60, col: '#e8c8b0', w: .5, a: .06 });
    g.strokeStyle = 'rgba(255,214,190,.08)'; g.lineWidth = 1; for (let k = -40; k <= 40; k++) { g.beginPath(); g.moveTo(960 + k * 14, 642); g.lineTo(960 + k * 90, H); g.stroke(); }
    stipple(c, { k: .4, g: 1, seed: 33, mid: true, boost: 1.4 }); return c; });
  function f403(ctx, t) {
    ctx.drawImage(BG403(), 0, 0);
    const u0 = eio(lin(A.t403 - .3, A.t403 + 1.1, t)), merge = eio(lin(A.together - .1, A.together + .7, t)), burst = eio(lin(A.person - .15, A.earthE, t)), rise = eio(lin(A.earthE - .25, A.t404 + .3, t));
    const camY = -260 * ein(lin(A.earthE - .35, A.t404 + .2, t)) + drift(t, 4, 1);
    ctx.save(); ctx.translate(0, -camY);
    // the towers as dotted outlines (their glass fades away first)
    const glassA = 1 - sm(lin(A.t403 - .2, A.t403 + .7, t)), lineA = .9 - .45 * burst;
    if (glassA > 0) { ctx.save(); ctx.globalAlpha = glassA * .8; for (const S of SIL403) { const ys = S.map((q) => q[1]), lg = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); lg.addColorStop(0, '#e8b0a4'); lg.addColorStop(1, '#5a4a6a'); ctx.fillStyle = lg; ctx.beginPath(); S.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); } ctx.restore(); }
    TL.forEach((L, k) => L.forEach((P, i) => ghostLine(ctx, P, { ghost: .9, col: '#ffe9d0', w: 1.4, dot: 5, a: lineA, u: clamp(u0 * 1.6 - i * .04) })));
    // "together": light runs down both outlines into the tag
    const [tx, ty0] = [960, 470], tagS = mix(3.1, 1.75, eio(lin(A.t403 - .2, A.t403 + .9, t))) * (1 - .25 * burst), ty = mix(ty0 + 60, ty0, eio(lin(A.t403 - .2, A.t403 + .9, t)));
    if (merge > 0 && merge < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [cx, cy] of [[G403.ax + G403.aw / 2, G403.ab - G403.ah * .7], [G403.bx - G403.bw * .8 / 2, G403.bb - G403.bh * .6]]) { const x = mix(cx, tx, merge), y = mix(cy, ty + 40, merge); addGlow(ctx, x, y, 60, .7 * Math.sin(Math.PI * merge), AMBER, CORE); } ctx.restore(); }
    // the tag on its string from tower A's roof corner
    const swing = .07 * Math.sin(t * 1.4), topA = [G403.ax + G403.aw * .36, G403.ab - G403.ah * (1 - DOME) - 5];
    ctx.strokeStyle = rgba(CORE, .7 * (1 - burst)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(topA[0], topA[1]); ctx.quadraticCurveTo((topA[0] + tx) / 2 + 10, (topA[1] + ty) / 2 - 10, tx + Math.sin(swing) * 20, ty); ctx.stroke();
    const showNum = sm(lin(A.two - .15, A.two + .35, t));
    const tagA = 1 - sm(lin(A.person - .05, A.person + .35, t)); if (tagA > .01) priceTag(ctx, tx + Math.sin(swing) * 20, ty, tagS * (1 - .5 * (1 - tagA)), t, { rot: swing, a: tagA, label: showNum > .5 ? '$220' : '$', sub: showNum > .5 ? 'PER PERSON' : null, glow: merge * (1 - burst) });
    // "every person": the value bursts into a crowd, each holding a tiny certificate
    if (burst > 0) {
      const C = crowd(), ox = tx, oy = ty + 60;
      for (const row of C) { const R = burst * 1500 - Math.abs(row.y - oy) * .6; if (R <= 0) continue;
        ctx.save(); ctx.beginPath(); ctx.ellipse(ox, row.y, Math.max(1, R * 1.25), 400, 0, 0, TAU); ctx.clip(); ctx.drawImage(row.c, -50, row.y - 200); ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (const p of row.pts) { const d = Math.hypot((p.x - ox) / 1.25, 0), on = clamp((R - d) / 140); if (on <= 0) continue; const cs = Math.max(2.2, 34 * p.s), gl = .55 + .45 * Math.sin(t * 2 + p.ph);
          const gs = cs * 3.4; ctx.globalAlpha = .5 * on * gl; ctx.drawImage(glowSpr(), p.x - gs / 2, p.y - gs / 2, gs, gs); ctx.globalAlpha = 1; ctx.fillStyle = rgba('#fff1d6', .9 * on); ctx.fillRect(p.x - cs / 2, p.y - cs * .35, cs, cs * .7); }
        ctx.restore(); }
      // the burst front: a ring of light leaving the tag
      if (burst < 1) ring(ctx, ox, oy + 120, 1500 * burst * 1.25, 320 * burst, { lines: 4, band: 10, wave: 26, col: CORE, glow: AMBER, a: .5 * (1 - burst) });
    }
    // one certificate rises (exit up)
    if (rise > 0) { const C = crowd(), p = C[6].pts.reduce((a, b) => (Math.abs(b.x - 960) < Math.abs(a.x - 960) ? b : a)), y = mix(p.y, p.y - 900, rise); drawCert(ctx, p.x, y, mix(.14, .5, rise), -.1 + .2 * Math.sin(t * 3), 1, { glow: 1 }); addGlow(ctx, p.x, y, 120, .4, AMBER, CORE); }
    ctx.restore();
    factCard(ctx, ['≈ $220 per person on Earth', '2026 VALUATIONS · OPENAI + ANTHROPIC'], sm(lin(A.two, A.two + .5, t)) * (1 - sm(lin(A.earthE - .1, A.t404 - .05, t))));
    vignette(ctx, .45);
  }

  // ═════════════════════════════════════ 4.04: the towers grow through the clouds; the certificates below stay tiny ═════════════════════════════════════
  const GROW = (t) => 1 + 3.9 * eio(lin(A.t404 + .1, A.manyE, t)) + .35 * eo5(lin(A.many, A.many + .5, t)) - 4.25 * ein(lin(A.e404 - .05, A.t405 + .15, t));
  const C404 = (t) => { const back = eio(lin(A.t404, A.manyE + .2, t)), down = ein(lin(A.e404 - .1, A.t405 + .2, t));
    return { x: drift(t, .6, 3), y: 1.6, z: mix(-4, -34, back), pitch: mix(.16, .36, back) - .5 * down, f: mix(980, 900, back) }; };
  const CROWD404 = once('c6crowd404', () => { const r = prng(404), L = []; for (let k = 0; k < 26; k++) L.push({ x: -18 + r() * 36, z: -2 + r() * 14, seed: k, flip: r() < .5, col: ['#2a2440', '#3a2c48', '#2c3448'][k % 3], ph: r() * TAU }); return L; });
  function f404(ctx, t) {
    const cam = C404(t), g = Math.max(1, GROW(t));
    const r = towersFrame(ctx, t, { cam, grow: g, tag: 1, tagLabel: '$220', tagSub: 'PER PERSON', tagGlow: .5 * clamp((g - 1.2) / 3), clouds: 1, cloudY: 46, labels: 0, fence: 1 });
    // the people below with their tiny certificates (they stay tiny)
    const P = r.P, items = CROWD404.map((c) => ({ c, d: Math.hypot(c.x - cam.x, c.z - cam.z) })).sort((p, q) => q.d - p.d);
    for (const { c } of items) { const b = P(c.x, 0, c.z), tp = P(c.x, 1.7, c.z); if (b[2] < 1) continue; const s = (b[1] - tp[1]) / 185; if (s <= 0 || b[1] - 200 * s > H + 40) continue;
      const pose = { ...POSES.look, sh: [.62, .5], el: [1.1, 1.15], head: -.25 };
      figureFlat(ctx, b[0], b[1] - 90 * s, s, pose, { t, seed: c.seed, col: c.col, rim: '#ffcf9e', rimSide: 1, flip: c.flip, fast: true, shadow: true, skin: '#7a5a4a' });
      const hp = handPos(b[0], b[1] - 90 * s, s, pose, 0, c.flip), cs = Math.max(2, 30 * s); ctx.fillStyle = CORE; ctx.fillRect(hp[0] - cs / 2, hp[1] - cs * .35, cs, cs * .7); addGlow(ctx, hp[0], hp[1], cs * 2.2, .5, AMBER, CORE); }
    // the rewind: a fast smear downward at the end
    vignette(ctx, .38);
  }

  // ═════════════════════════════════════ 4.05 ▲ / 4.06: high view, slices punched out and laid aside; one leaves the company ═════════════════════════════════════
  const C405 = (t) => { const land = eo5(lin(A.t405 - .25, A.t405 + .7, t)), fol = eio(lin(A.t406 - .2, A.leaves + .3, t)), dn = ein(lin(A.e406 - .2, A.t407 + .3, t));
    return { x: mix(-4, 1.5, eio(lin(A.t405, A.t406, t))) + drift(t, .4, 2) + 8.5 * fol, y: mix(30, 21, land) - 5 * fol, z: mix(-2, 8, land) + 2 * eio(lin(A.t405 + .7, A.t406, t)) + 3 * fol, pitch: mix(-.62, -.44, land) - .1 * fol - .35 * dn, f: 1100 + 150 * fol }; };
  const AT1 = -Math.PI / 2 + .35, SL1 = { x: TW[1].x + Math.cos(AT1) * (PLR + 4.5), z: TW[1].z + Math.sin(AT1) * (PLR + 4.5) };
  const certTex = () => once('c6certtex', () => { const C = certSprite(), [c, g] = canvas(240, 160); g.drawImage(C, 0, 0); return c; });
  const FLY = (t) => {   // the share certificate's flight (world metres): from slice B's resting spot over the fence, out, down
    const s0 = SL1, u = lin(A.t406 + .35, A.e406 + .1, t), e = eio(u), xOut = FENCE.x + Math.cos(-1.05) * (FENCE.r + 4), zOut = FENCE.z + Math.sin(-1.05) * (FENCE.r + 4);
    const x = mix(s0.x, xOut, e), z = mix(s0.z, zOut, e), y = .1 + 6.5 * Math.sin(Math.PI * clamp(u * 1.15)) * (1 - ein(lin(.75, 1, u))) + 2 * Math.sin(u * 9) * (1 - u);
    return { x, y: Math.max(.08, y - 4 * ein(lin(A.e406 - .2, A.t407 + .3, t))), z, rot: u * 4.2, flip: .58 + .42 * Math.cos(u * 9), u };
  };
  function f405(ctx, t) {
    const cam = C405(t), perfo = eio(lin(A.slices - .15, A.aside - .05, t)), punch = sm(lin(A.aside - .02, A.aside + .12, t)), outU = eio(lin(A.aside + .3, A.asideE + .6, t));
    const certU = sm(lin(A.t406 - .1, A.t406 + .45, t)), flying = t > A.t406 + .35;
    const slices = [{ pu: perfo, perfo: perfo > 0 ? 1 : 0, punch: punch * (1 - outU), u: outU, at: Math.PI - .25, turn: -.9 }, { pu: perfo, perfo: perfo > 0 ? 1 : 0, punch: punch * (1 - outU), u: outU, at: AT1, turn: -.6, cert: certU, certTex: certTex(), certScale: .024, hide: flying }];
    const shake = 6 * bell(t, A.aside + .05, .05);
    ctx.save(); ctx.translate(drift(t * 9, shake, 1), drift(t * 9, shake, 2));
    const r = towersFrame(ctx, t, { cam, slices, fence: 1, labels: 0, tag: 0 });
    // the punch flash (▲) on both plinths
    const fl = bell(t, A.aside + .06, .06); if (fl > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const T0 of TW) { const p = r.P(T0.x, 1, T0.z - PLR * .6); addGlow(ctx, p[0], p[1], 220, .6 * fl, AMBER, CORE); } ctx.restore(); }
    // the wind and the flying certificate (4.06)
    if (flying) {
      const F = FLY(t), p = r.P(F.x, F.y, F.z), q = r.P(F.x, 0, F.z), k = r.cam.f / Math.max(1, p[2]);
      ctx.save(); ctx.globalAlpha = .28 * clamp(1 - F.y / 8); ctx.translate(q[0], q[1]); ctx.scale(1, .35); ctx.fillStyle = 'rgba(20,10,20,1)'; ctx.beginPath(); ctx.ellipse(0, 0, 1.3 * k, 1.1 * k, 0, 0, TAU); ctx.fill(); ctx.restore();
      drawCert(ctx, p[0], p[1], 5.6 * k / 240, F.rot * .3 - .2, 1, { flip: F.flip, sy: .62 + .3 * Math.sin(F.u * 5), glow: .15 + .45 * bell(t, A.leaves + .1, .25) });
      windLines(ctx, t, p[0] - 60, p[1] + 20, 520, sm(lin(A.t406 + .2, A.t406 + .7, t)) * (1 - sm(lin(A.leaves + .3, A.e406, t))), 7);
      // on "leaves": the fence line it crosses lights up
      const cross = bell(t, A.leaves + .08, .22);
      if (cross > .02 && r.fenceGround) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(AMBER, .9 * cross); ctx.lineWidth = 3; ctx.beginPath(); let on = false;
        r.fenceGround.forEach((pp, i) => { if (!pp) { on = false; return; } const a = i / 160 * TAU, da = Math.abs(((a - (TAU - 1.05)) + Math.PI) % TAU - Math.PI); if (da > .45) { on = false; return; } on ? ctx.lineTo(pp[0][0], pp[0][1]) : ctx.moveTo(pp[0][0], pp[0][1]); on = true; }); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
    vignette(ctx, .42);
  }

  // ═════════════════════════════════════ 4.07 / 4.08: the sealed glass fund; the gift and the right ═════════════════════════════════════
  const J = { x: 960, y: 930, s: 1.5 };
  const BG407 = () => once('c6bg407', () => { const [c, g] = canvas(W, H); const rg = g.createRadialGradient(960, 520, 0, 960, 600, 1100); rg.addColorStop(0, '#4a3a46'); rg.addColorStop(.45, '#2a2234'); rg.addColorStop(1, '#0e0b18'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    rosette(g, 960, 470, { R: 600, A: 110, B: 50, n: 44, m: 13, lines: 70, col: '#f0d2b4', w: .5, a: .055 }); const fg = g.createLinearGradient(0, 900, 0, H); fg.addColorStop(0, 'rgba(10,8,16,0)'); fg.addColorStop(1, 'rgba(10,8,16,.7)'); g.fillStyle = fg; g.fillRect(0, 880, W, 200);
    stipple(c, { k: .45, g: 1, seed: 47, mid: true, boost: 1.4 }); return c; });
  // the certificate in the glass: turns on its vertical axis; a ribbon bow "gift" lets go; under it an embossed seal RIGHT
  function giftCert(g, t, x, y, s) {
    const turn = Math.cos(.9 * Math.sin(t * .8) + .3), untie = eio(lin(A.gift - .05, A.gift + .55, t)), fall = ein(lin(A.gift + .2, A.right + .5, t)), seal = eio(lin(A.right - .25, A.right + .2, t));
    g.save(); g.translate(x, y); g.scale(s * Math.max(.12, Math.abs(turn)), s);
    drawCert(g, 0, 0, 1, 0, 1, { flip: turn < 0 ? -1 : 1, shadow: false, glow: .25 });
    // the seal RIGHT appears under the ribbon
    if (seal > 0) { const sk = mix(1.25, 1, eo5(seal)); g.save(); g.globalAlpha = seal; g.scale(sk, sk); foilSeal(g, 0, 4, 46, t, { label: 'A RIGHT', glintSpeed: .5, glintPhase: -A.right * .5 });
      g.fillStyle = 'rgba(255,236,200,.85)'; g.beginPath(); g.ellipse(0, 4, 30, 15, 0, 0, TAU); g.fill(); text(g, 'RIGHT', 0, 12, { size: 21, font: 'Instrument Serif', color: '#3a1a04', align: 'center', spacing: 1.5 }); g.restore(); }
    // the ribbon (two bands crossing) and the bow with its tag "gift": it slides off and falls
    const ra = 1 - sm(lin(A.gift + .5, A.right + .4, t)); if (ra > 0) {
      g.save(); g.globalAlpha = ra; g.translate(14 * untie, 180 * fall); g.rotate(.4 * fall);
      g.fillStyle = '#b8323a'; g.fillRect(-122, -9 + 6 * untie, 244 * (1 - .3 * untie), 18); g.fillRect(-9 - 20 * untie, -82, 18, 164 * (1 - .4 * untie));
      g.fillStyle = 'rgba(255,200,190,.35)'; g.fillRect(-122, -9 + 6 * untie, 244 * (1 - .3 * untie), 4);
      const lo = 1 - untie; g.fillStyle = '#c63c44'; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 22 * (.4 + .6 * lo), -4, 24 * lo + 4, 13 * lo + 3, sd * .5, 0, TAU); g.fill(); }
      g.fillStyle = '#9a2830'; g.beginPath(); g.arc(0, 0, 8, 0, TAU); g.fill();
      g.strokeStyle = '#9a2830'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 4); g.quadraticCurveTo(-10, 30 + 20 * untie, -24 - 30 * untie, 52 + 30 * untie); g.moveTo(0, 4); g.quadraticCurveTo(12, 34, 30 + 10 * untie, 50 + 40 * untie); g.stroke();
      // the tag "gift"
      g.save(); g.translate(30 + 10 * untie, 62 + 40 * untie); g.rotate(-.3 + .4 * untie); g.fillStyle = '#efe4cc'; g.beginPath(); g.moveTo(-26, -12); g.lineTo(20, -12); g.lineTo(30, 0); g.lineTo(20, 12); g.lineTo(-26, 12); g.closePath(); g.fill();
      text(g, 'gift', -4, 6, { size: 17, font: 'Instrument Serif Italic', color: '#5a2a2a', align: 'center' }); g.restore();
      g.restore(); }
    g.restore();
  }
  function f407(ctx, t) {
    const zIn = eio(lin(A.t408 - .2, A.gift - .1, t)), cam = { x: 960, y: mix(560, 432, zIn), z: mix(1, 2.5, zIn) * (1 + .02 * Math.sin(t * .3)) };
    ctx.drawImage(BG407(), 0, 0);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
    const fall = lin(A.t407 - .35, A.t407 + .75, t), inside = eio(lin(A.t407 + .62, A.t407 + 1.2, t));
    const fill = .3 + .07 * eout(lin(A.t407 + .9, A.t407 + 1.3, t)), sealU = mix(.5, 1, eio(lin(A.fixed - .1, A.fixed + .45, t))) * sm(lin(A.fixed - .5, A.fixed - .1, t));
    const rattle = 7 * Math.sin(t * 38) * bell(t, A.noBoard + .35, .32), shut = bell(t, A.noBoard + .4, .45);
    const G = glassFund(ctx, J.x, J.y, J.s, t, { fill, seal: sealU, label: 'independent fund', sub: 'fixed rule', note: 'our plan', glow: .55 + .3 * shut, rattle,
      inner: (g, box) => { if (inside > 0) giftCert(g, t, 0, mix(-300, -330, inside), mix(.42, .62, inside)); } });
    // the falling certificate (comes down through the slot)
    if (inside <= 0) { const y = mix(-260, G.top.y - 20, eio(fall)); drawCert(ctx, J.x + 40 * (1 - fall), y, .5, .35 * (1 - fall) + .1 * Math.sin(t * 5), 1, { flip: Math.cos(t * 5), sy: .8 }); }
    // the label catches a light sweep on "independent fund"
    const sw = lin(A.fund - .1, A.fund + .8, t); if (sw > 0 && sw < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gx = mix(G.label.x - 150, G.label.x + 150, sw), gg = ctx.createRadialGradient(gx, G.label.y, 0, gx, G.label.y, 90); gg.addColorStop(0, 'rgba(255,220,170,.4)'); gg.addColorStop(1, 'rgba(255,220,170,0)'); ctx.fillStyle = gg; ctx.fillRect(gx - 90, G.label.y - 90, 180, 180); ctx.restore(); }
    // a hand with a cufflink tries the lid on "no board"; it stays shut
    const hin = eio(lin(A.noBoard - .5, A.noBoard + .05, t)) * (1 - eio(lin(A.changeE - .2, A.changeE + .5, t)));
    if (hin > 0) { const ha = Math.PI - .95, hx = G.lid.x + G.lid.r * .92 + mix(500, 0, hin) + rattle * .8, hy = G.lid.y + 4 + mix(-520, 0, hin) + rattle * .3, hs = 2.05, wx = hx - Math.cos(ha) * 92 * hs, wy = hy - Math.sin(ha) * 92 * hs;
      hand(ctx, wx, wy, hs, { pose: 'grip', ang: ha, flip: true, skin: SKINS[0], sleeve: '#23232f', sleeveLen: 420, rim: '#ffcf9e', light: [-.5, -1], t, seed: 8, close: .25 });
      // the shirt cuff and the cufflink at the wrist
      const cx = wx - Math.cos(ha) * 10 * hs, cy = wy - Math.sin(ha) * 10 * hs; ctx.save(); ctx.translate(cx, cy); ctx.rotate(ha + Math.PI / 2); ctx.fillStyle = '#ece6dc'; ctx.fillRect(-30 * hs / 1.6, -9, 60 * hs / 1.6, 18); ctx.restore();
      const lg = ctx.createRadialGradient(cx + 6, cy - 8, 0, cx + 8, cy - 6, 9); lg.addColorStop(0, '#fff2c8'); lg.addColorStop(.5, '#d6a24a'); lg.addColorStop(1, '#6a4410'); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(cx + 8, cy - 6, 7.5, 0, TAU); ctx.fill(); }
    ctx.restore();
    vignette(ctx, .5);
  }

  // ═════════════════════════════════════ 4.09 – 4.11: the field at dawn; a stake, an idea ═════════════════════════════════════
  const FC = (t) => ({ x: 640 + 900 * mix(lin(A.t409 - .5, A.out + .6, t), eio(lin(A.t409 - .5, A.out + .6, t)), .5), y: -80, z: mix(2.05, 1.55, eio(lin(A.t409 + .5, A.t410 + 1, t))), fx: 960, fy: 640 });
  function cardShadow(ctx, x, y, w, a) { if (a <= 0) return; ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, w); g.addColorStop(0, `rgba(20,10,6,${.5 * a})`); g.addColorStop(1, 'rgba(20,10,6,0)'); ctx.translate(x, y); ctx.scale(1, .22); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.fillRect(x - w, y - w, w * 2, w * 2); ctx.restore(); }
  function f409(ctx, t) {
    const cam = FC(t), sprout = eio(lin(A.t409 + .15, A.groundE, t));
    const F = field(ctx, t, { cam, mist: .85 - .3 * lin(A.t409, A.t411, t), light: 'dawn', pegs: 0, string: 0, post: 0, sprout, sheet: false });
    const soil = F.soil || { x: 960, y: 690 };
    { const tg = ctx.createLinearGradient(0, 0, 0, 230); tg.addColorStop(0, 'rgba(30,22,48,.66)'); tg.addColorStop(1, 'rgba(30,22,48,0)'); ctx.fillStyle = tg; ctx.fillRect(0, 0, W, 230); }   // the sky deepens upward
    // "ground": a breath of light where the shoots break the soil
    const gl = bell(t, A.ground + .2, .5); if (gl > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, soil.x + 40, soil.y - 10, 260, .3 * gl, '#ffd59a', CORE); ctx.restore(); }
    // ---- 4.10: a hand lowers a card into the soil; as it goes in it turns like a coin: SUBSIDIES → STAKE
    const c1x = soil.x + 520, c1g = soil.y + 46;
    const k1in = eio(lin(A.t410 + .05, A.subsidies + .15, t)), plant = eio(lin(A.subsidies + .3, A.stake - .05, t)), flip = eio(lin(A.stake - .34, A.stake + .12, t)), hOut = eio(lin(A.stake - .4, A.stake + .5, t));
    const c1y = mix(c1g - 300, c1g - 120, plant) - mix(560, 0, k1in);
    if (t > A.t410 - .4 && c1x > -200) {
      cardShadow(ctx, c1x + 18, c1g + 4, 90, .5 + .4 * plant);
      labelCard(ctx, c1x, c1y, 1.3, t, { flip, rot: .04 * Math.sin(t * 2) * (1 - plant) });
      if (plant > 0) { ctx.save(); ctx.fillStyle = '#2a1c14'; ctx.beginPath(); ctx.ellipse(c1x, c1g + 6, 84, 16, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(244,180,124,.32)'; ctx.beginPath(); ctx.ellipse(c1x - 12, c1g, 60, 7, 0, Math.PI, TAU); ctx.fill();
        const r = prng(9); for (let i = 0; i < 9; i++) { ctx.fillStyle = `rgba(${90 + r() * 60 | 0},${60 + r() * 40 | 0},40,.9)`; ctx.beginPath(); ctx.ellipse(c1x + (r() - .5) * 150, c1g + (r() - .3) * 14, 6 + r() * 7, 3 + r() * 3, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
      if (hOut < 1) { const ha = Math.PI / 2 + .25, tipY = c1y - 88 * 1.3, hx = c1x + 10 + hOut * 160, hy = tipY - 170 - hOut * 700;
        hand(ctx, hx - Math.cos(ha) * 40, hy, 2.1, { pose: 'grip', ang: ha, flip: true, skin: SKINS[1], sleeve: '#2c3a5c', sleeveLen: 420, rim: '#ffd0a0', light: [.6, -1], t, seed: 11, close: .25 * (1 - hOut) }); }
      if (flip > .3 && flip < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, c1x, c1y, 200, .55 * Math.sin(Math.PI * flip), AMBER, CORE); ctx.restore(); }
    }
    factCard(ctx, ['US government · Intel subsidies → stake ≈ 10 %', 'AUG 2025'], sm(lin(A.subsidies, A.subsidies + .5, t)) * (1 - sm(lin(A.e410, A.t411 + .1, t))));
    // ---- 4.11: a second hand brings a dotted idea card; on "floated" it hovers a hand's breadth above the soil, its ring of owners lights, then it tips in
    if (t > A.t411 - .3) {
      const c2x = soil.x + 1180, g2 = soil.y + 70, cin = eio(lin(A.t411 + .1, A.floated - .3, t)), rel = eio(lin(A.floated - .15, A.floated + .45, t)), hOut2 = eio(lin(A.floated + .35, A.floated + 1.25, t));
      let x = c2x, y = mix(g2 - 760, g2 - 160, cin) - 34 * rel + 9 * Math.sin(t * 1.7) * rel, rot = .04 * Math.sin(t * 1.2), sc = 1.7;
      const ringU = eio(lin(A.owned - .1, A.citizens + .3, t)), q = eio(lin(A.out - 1.2, A.out - .9, t));
      if (q > 0) { const p = COUT.pos(t); x = mix(x, p.x, q); y = mix(y, p.y, q); rot = mix(rot, p.r, q); sc = mix(sc, 1.4 * p.s, q); }
      const hover = clamp((g2 - 105 - y) / 120);
      cardShadow(ctx, x + 30, g2 + 6, 150 * (1 - .3 * hover), (.25 + .35 * (1 - hover)) * (1 - sm(lin(A.out - .9, A.out - .3, t))));
      // while the camera tilts down into c07 (A slides up), the card is held at its place on screen (as c07 holds its form)
      const yS = y + eio(lin(A.out - .25, A.out + .25, t)) * H, body = 1 - sm(lin(A.out - .45, A.out - .1, t));
      if (t < A.out + .25) { { const dg = ctx.createRadialGradient(x + 8, yS + 12, 0, x + 8, yS + 12, 200 * sc); dg.addColorStop(0, `rgba(18,10,22,${.3 * body})`); dg.addColorStop(1, 'rgba(18,10,22,0)'); ctx.fillStyle = dg; ctx.fillRect(x - 200 * sc, yS - 200 * sc, 400 * sc, 400 * sc); }
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, x, yS, 230 * sc, (.08 + .1 * ringU) * (.4 + .6 * body), AMBER, CORE); ctx.restore(); ideaCard(ctx, x, yS, sc, t, { lit: .55 + .45 * ringU, ring: ringU, rot, body }); }
      if (hOut2 < 1) { const ha = Math.PI / 2 - .35, hx = x - 120 - hOut2 * 220, hy = y - 250 - hOut2 * 700;
        hand(ctx, hx, hy, 2.0, { pose: 'open', ang: ha + .25 * (1 - rel), flip: false, skin: SKINS[0], sleeve: '#6b5a7a', sleeveLen: 420, rim: '#ffd0a0', light: [.6, -1], t, seed: 12, spread: .6 + .3 * rel }); }
      const tip = sm(lin(A.out - .9, A.out, t)); if (tip > 0) { const P = COUT.pos(A.out); ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, P.x, P.y + 40, 170 * tip, .35 * tip, AMBER, CORE); ctx.restore(); }
    }
    factCard(ctx, ['South Korea · a national AI company, part-owned by all citizens', 'FLOATED BEFORE TAKING OFFICE · 2025'], sm(lin(A.floated - .3, A.floated + .3, t)) * (1 - sm(lin(A.citizens + .38, A.out - .42, t))), { size: 34 });
    vignette(ctx, .38);
  }

  // ═════════════════════════════════════ the shot list ═════════════════════════════════════
  const IN = CIN.into;
  return [
    { t: IN.t, tr: IN.tr, x: IN.x, y: IN.y, d: IN.d, draw: roof },                                                            // 3.14 So here's the plan.
    { t: A.t315 - .1, tr: 'cut', d: .06, draw: roof },                                                                       // 3.15 Plant a share …
    { t: A.t316 - .1, tr: 'cut', d: .06, draw: roof },                                                                       // 3.16 Let it grow …
    { t: A.t317 - .1, tr: 'cut', d: .06, draw: roof, sound: [{ f: 'foil_glint', t: A.beingE + .18, v: .3 }] },                // 3.17 Then harvest …
    { t: A.t401 - .1, tr: 'cut', d: .06, draw: roof, sound: [{ f: 'stamp', t: A.plant + .06, v: .22 }] },                    // 4.01 Step one: plant.
    { t: A.t402, tr: 'iris', x: SUN402.x, y: SUN402.y, r: 26, d: .8, draw: f402 },                                            // 4.02 Right now …
    { t: A.t403, tr: 'zoom', x: TAG403.x, y: TAG403.y, depth: 3, d: .7, draw: f403 },                                         // 4.03 OpenAI and Anthropic …
    { t: A.t404, tr: 'up', d: .55, draw: f404 },                                                                              // 4.04 If the fortune comes …
    { t: A.t405, tr: 'whipU', d: .45, draw: f405, sound: [{ f: 'stamp', t: A.aside + .04, v: .28 }, { f: 'card', t: A.asideE + .12, v: .2 }] },   // 4.05 ▲ … slices aside …
    { t: A.t406 - .1, tr: 'cut', d: .06, draw: f405, sound: [{ f: 'whoosh_airy', t: A.t406 + .3, v: .18 }] },                // 4.06 … leaves the company.
    { t: A.t407, tr: 'down', d: .55, draw: f407, sound: [{ f: 'stamp', t: A.fixed + .3, v: .22 }] },                         // 4.07 … independent fund, fixed rule …
    { t: A.t408 - .1, tr: 'cut', d: .06, draw: f407, sound: [{ f: 'paper_pop', t: A.gift + .3, v: .16 }] },                  // 4.08 … a gift and a right.
    { t: A.t409, tr: 'zoom', x: 960, y: 540, depth: 4, d: .8, draw: f409 },                                                   // 4.09 The first seeds …
    { t: A.t410 - .1, tr: 'cut', d: .06, draw: f409, sound: [{ f: 'card', t: A.stake + .1, v: .2 }] },                        // 4.10 … subsidies … stake …
    { t: A.t411 - .1, tr: 'cut', d: .06, draw: f409 },                                                                       // 4.11 … floated … all its citizens.
  ];
};
