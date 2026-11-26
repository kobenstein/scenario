// c01 · Hook · the tree of lanterns (thumbnail A) · lanterns 4, 7, 9 are windows: the train, Casey's kitchen (C3a), the Nazca desert ·
// all of it is real · the same tool that writes your emails · the aim: the bead's beam lifts into the crown, the crown blooms ·
// THIS IS WHAT A.I. SHOULD BE USED FOR · twelve dark lanterns, a gold thread, ? · a first clue (the old newspaper pins to lantern 1) ·
// lanterns 11 … 1 lift into the LAMP RAIL · into lantern 12 at the far tip (light door) → No. 12 Te Hiku: the station, the bead listens,
// the hour ruler, the voices of the coast, ten days, lamp 12 + the microphone → plateStation (lib/f28_seams.mjs).
// 0 → T.G('A global data company') · built by the lead (quality reference). Plan: docs/shots.md H.01–12.06 · world: docs/MOTION.md
// ONE entry, two worlds joined by ONE light door (the lit glass of lantern 12 ↔ the station's warm window). Continuous camera in each.
//
// | ID    | anchor (phrase)                     | picture (one idea)                                                    | camera              |
// |-------|-------------------------------------|-----------------------------------------------------------------------|---------------------|
// | H.01★ | All over the world                  | the tree, crown gold, you at its foot; lights wake on people/animals/planet | slow push · TREE |
// | H.02  | Most of these projects              | push up to the lantern limb: twelve dark lanterns                     | push · TREE         |
// | H.03  | In India, a train brakes            | lantern 4 lights: the driver's view, the train stops for cow + calf   | dive · SCENE        |
// | H.04  | In California, a man silenced       | along the limb into lantern 7: the kitchen, gold word-lines rise      | glide + dive · SCENE|
// | H.05  | [C3a]                               | the glass of lantern 7 grows into the clip plate and back             | CLIP                |
// | H.06  | And in Peru's desert                | lantern 9: two figure-drawings light up beside the old path           | glide + dive · SCENE|
// | H.07  | All of it is real                   | the three lit lanterns, each with its REAL stamp                      | pull back · MIX     |
// | H.08  | It's the same kind of tool          | the laptop on a root beside you, the bead over it: an email, an ad    | down the trunk · MIX|
// | H.09  | A few people pointed it             | THE AIM: the beam lifts into the crown, it blooms gold                | follow beam · EXPL  |
// | H.10  | This is what A.I. should be used for| the thumbnail composition with the line                               | settle · TREE       |
// | H.11  | What do all these tools             | twelve dark lanterns, a gold thread through them, ?                   | to the limb · EXPL  |
// | H.12  | A first clue                        | a newspaper page falls from the crown and hangs under lantern 1; 11 … 1 lift into the rail | truck to the tip |
// | 12.01 | At the far edge (W: light door)     | into lantern 12's light → out of the station window: the coast · REAL | door · SCENE        |
// | 12.02 | no tech giant had                   | the giants' glass towers on the horizon wake (cool)                   | truck right         |
// | 12.03 | a machine that understands          | the bead grows out of the antenna light and listens: rings, no answer | push · MIX          |
// | 12.04 | To learn a language                 | the hour ruler grows from the antenna over the sea: empty, 300 HOURS  | follow head · EXPL  |
// | 12.05 | The station asked its own people    | voices rise like fireflies from homes and boats to the antenna        | pull back · MIX     |
// | 12.06 | In just ten days                    | they pour into the ruler, it fills: 10 DAYS · ≈ 2,500 PEOPLE · 300+ HOURS; lamp 12 + mic → plateStation | creep · EXPL |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex } = E;
const { rise, maskLine, F0 } = F;

export const PRINT = F.PRINT28;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.all = G('All over the world'); a.people = G('people'); a.animals = G('animals'); a.planet = G('the planet');
  a.most = G('Most of these'); a.india = G('In India'); a.brakes = G('brakes'); a.eleph = G('elephants');
  a.calif = G('In California'); a.speaks = G('speaks again'); a.voice = G('own voice');
  a.C3a = T.clip('C3a'); a.peru = G("And in Peru's"); a.drawings = G('drawings'); a.light = G('coming to light');
  a.real = G('All of it is real'); a.same = G("It's the same kind"); a.emails = G('emails'); a.ads = G('ads', a.emails);
  a.few = G('A few people'); a.pointed = G('pointed it'); a.bigger = G('far bigger');
  a.thisis = G('This is what'); a.usedE = GE('used for', a.thisis);
  a.whatall = G('What do all'); a.common = G('in common', a.whatall);
  a.clue = G('A first clue'); a.lastof = GE('the last of them'); a.floods = G('floods strike'); a.news = G('old news reports');
  a.edge = G('At the far edge'); a.tiny = G('tiny radio station'); a.giant = G('no tech giant');
  a.machine = G('a machine that understands'); a.learn = G('To learn a language'); a.hours = G('hours and hours');
  a.asked = G('The station asked'); a.ten = G('In just ten days'); a.phones = G('into their phones'); a.build = G('to build it', a.ten);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const C = (u, v, s) => E.aim(F0, u, v, s);                 // tree world (design px on the F0 card)
const CS = (u, v, s) => E.aim(S.Z_ST, u, v, s);            // station world (design px on the Z_ST card)
const G4 = S.lanternGlass(4), G7 = S.lanternGlass(7), G9 = S.lanternGlass(9), G12 = S.lanternGlass(12), G1 = S.lanternGlass(1);
const DIVE = 16.5;                                          // a lantern glass (46 px) fills ~ 760 px of the screen height
const LAP = { x: 1345, y: 924, s: 74 };                     // the laptop on a root, between you and the trunk
const BEAD0 = [LAP.x, LAP.y - 80], CORE = [1470, 262];
const ANT = S.STATION.antenna, RUL = { x: 1070, y: 372, w: 800 };
const LT = (n) => F.treeLantern(n);
// the news page pinned under lantern 1: EXACTLY where lampRail draws lamp 1's tool when it starts to morph (tool under its lamp)
const Q1 = 46 / F.RAIL.s, PIN = (() => { const L = LT(1); const ty = L.y + L.len + 46 * 1.2; return { x: L.x, ty, y: ty + 21 * Q1, s: 22 * Q1 }; })();

function scene(a, T) {
  const c3 = a.C3a;
  const tMorph = a.floods + .1;                  // lanterns 11 … 1 start to lift into the rail
  const tp = a.edge - .15;                       // flood peak: into lantern 12's light → out of the station window
  const tPlate = a.end - S.SEAM_HALF;
  const tCreep = a.build - .4;                   // from here the camera rides the plate's creep line
  // ---------------------------------------------------------------- the crown's light over time (blooms on the aim)
  const glowAt = (t) => {
    let g = lerp(.5, .38, span(t, a.most, a.same + 1));
    g = lerp(g, 1, E.smooth(span(t, a.pointed + .8, a.bigger + 1.1)));
    return lerp(g, .66, E.smooth(span(t, a.whatall, a.whatall + 1.4)));
  };
  // ---------------------------------------------------------------- tree camera
  const KT = [
    [-1, C(926, 552, .935)], [0, C(930, 552, .94)], [a.most - .2, C(1016, 562, 1.09)],
    [a.india - .7, C(G4.x + 40, G4.y + 40, 2.4)], [a.india + 1.4, C(G4.x, G4.y, DIVE)], [a.calif - .5, C(G4.x - 3, G4.y + 1, DIVE * 1.13)],
    [a.calif + .5, C((G4.x + G7.x) / 2, (G4.y + G7.y) / 2 - 6, 4.6)], [a.calif + 1.8, C(G7.x, G7.y, DIVE)],
    [c3.start - .7, C(G7.x - 1, G7.y, DIVE * 1.12)], [c3.end + .55, C(G7.x + 2, G7.y, DIVE * 1.26)],
    [a.peru + .4, C((G7.x + G9.x) / 2, (G7.y + G9.y) / 2 - 6, 4.8)], [a.peru + 1.6, C(G9.x, G9.y, DIVE)], [a.real - .25, C(G9.x + 2, G9.y, DIVE * 1.13)],
    [a.real + .95, C(916, 706, 2.6)], [a.same - .05, C(930, 712, 2.7)],
    [a.same + 1.7, C(1286, 868, 3.25)], [a.few + .1, C(1306, 858, 3.6)],
    [a.pointed + .5, C(1350, 700, 2.1)], [a.bigger + .5, C(1260, 560, 1.3)], [a.thisis + .9, C(900, 542, 1.0)], [a.whatall - .2, C(892, 546, 1.035)],
    [a.whatall + 1.4, C(900, 652, 1.6)], [a.floods - .2, C(930, 648, 1.68)],
    [tMorph + 1.2, C(650, 640, 2.0)], [tp - 1.5, C(G12.x, G12.y, 3.4)],
  ];
  const camTree = (t) => (t < tp - 1.5 ? F.camPath(t, KT) : E.camAt(t, [[tp - 1.5, KT[KT.length - 1][1]], [tp, C(G12.x, G12.y, 40), 'i']]));
  // ---------------------------------------------------------------- station camera (the plate's creep line extended backwards)
  const creepCam = (t) => CS(860 + S.TRUCK * (t - tPlate), 610, .78 * (1 + S.CREEP * (t - tPlate)));
  const W0 = S.STATION.window;
  const KS = [
    [tp + 1.5, CS(990, 650, 1.55)], [a.tiny + .4, CS(960, 640, 1.22)], [a.giant + .9, CS(1150, 600, 1.0)],
    [a.machine + 1.2, CS(1030, 470, 1.55)], [a.learn + .4, CS(1080, 462, 1.35)], [a.learn + 2.6, CS(1360, 440, 1.0)], [a.hours + .4, CS(1330, 450, 1.03)],
    [a.asked + 1.6, CS(860, 540, .82)], [a.ten + .8, CS(1110, 500, .86)], [tCreep, creepCam(tCreep)],
  ];
  const camStation = (t) => {
    if (t < tp + 1.5) return E.camAt(t, [[tp, CS(W0[0], W0[1], 24)], [tp + 1.5, KS[0][1], 'o']]);
    return t < tCreep ? F.camPath(t, KS) : creepCam(t);
  };
  const zs = (c, Z) => Z / (Z - c.z);            // magnification of card Z (1 at home): the drift shrinks with it, so dives stay steady
  const drifted = (c, Z, t) => E.camDrift(c, t, 2.6 / Math.max(1, zs(c, Z)) * (1 - E.smooth(span(t, tPlate - 2.2, tPlate))), 3);   // strong enough that no frame is static (calm.py), shrinking while diving

  // ---------------------------------------------------------------- lanterns of the tree (options per lantern)
  const teaser = { 4: [a.india - .5, (cx, w, h, t) => S.vignetteTrain(cx, t, w, h, { stop: a.brakes + 1.7, t0: a.india - .5, heat: 1, cross: E.smooth(span(t, a.eleph - 1, a.eleph + 3.5)) })],
    7: [a.calif - .4, (cx, w, h, t) => S.vignetteKitchen(cx, t, w, h, { words: E.smooth(span(t, a.speaks - .2, a.voice + .4)), lamp: 1 })],
    9: [a.peru - .3, (cx, w, h, t) => S.vignetteDesert(cx, t, w, h, { fig1: sineIO(span(t, a.drawings - .1, a.drawings + 1.3)), fig2: sineIO(span(t, a.light, a.light + 1.4)) })] };
  const lanternOpt = (n, t) => {
    if (t >= tMorph && n !== 12) return null;                                  // lifted into the rail
    const numA = E.smooth(span(t, a.whatall + .2, a.whatall + 1.4));
    if (teaser[n]) {
      const [t0, fn] = teaser[n], on = E.smooth(span(t, t0, t0 + .7)), off = E.smooth(span(t, a.whatall, a.whatall + 1.0));
      const lit = on * (1 - off), gl = on * (1 - off);
      return { lit: lit * (t > a.real ? .9 : 1), num: n, numA: numA * (1 - gl), inside: gl > 0 ? (cx, w, h) => fn(cx, w, h, t) : null, glass: gl };
    }
    if (n === 12) return { lit: E.smooth(span(t, tMorph + .5, tp - 1.2)), num: 12, numA: numA * (1 - span(t, tp - 1.6, tp - 1.0)) };   // the number goes before the dive (it would fill the door)
    return { lit: 0, num: n, numA };
  };
  // lanterns' screen positions when they start to lift (frozen at tMorph with the camera of that frame)
  let FROM = null;
  const fromAt = () => { if (FROM) return FROM; const c = drifted(camTree(tMorph), F0, tMorph); FROM = {}; for (let n = 1; n <= 12; n++) { const L = LT(n), p = E.project(c, F0, L.x, L.y); FROM[n] = [p[0], p[1], 46 * p[2], L.len * p[2]]; } return FROM; };

  // ---------------------------------------------------------------- the tree world
  function treePart(ctx, t) {
    const c = drifted(camTree(t), F0, t), g = glowAt(t);
    const look = t < a.same ? .55 : t < a.few ? lerp(.55, .02, sineIO(span(t, a.same, a.same + 1.2))) : lerp(.02, .85, sineIO(span(t, a.pointed, a.bigger + .6)));
    S.treeWorld(ctx, c, t, {
      glow: g, du: { look: t > a.thisis ? lerp(.85, .6, span(t, a.thisis, a.whatall)) : look },
      lantern: (n) => lanternOpt(n, t),
      lights: (k, x) => { const tw = [a.people, a.animals, a.planet][k] + (x + 300) / 1500 * .7; return .12 + .88 * E.smooth(span(t, tw - .1, tw + .9)); },
      fg: true,
      extra: (cx) => { foot(cx, t); thread(cx, t); newsPage(cx, t); },
    });
    return c;
  }
  // H.08–H.10: the laptop, the bead, the email and the ad, the beam into the crown
  function foot(ctx, t) {
    const vis = span(t, a.real, a.same + .4); if (vis <= 0 && t < a.same) { F.laptop(ctx, t, LAP.x, LAP.y, LAP.s, { open: 1, glow: .25 }); return; }
    const scr = F.laptop(ctx, t, LAP.x, LAP.y, LAP.s, { open: 1, glow: .3 + .5 * span(t, a.same, a.same + .8) });
    // the bead grows out of the screen light, hovers, then lifts and rides its own beam up into the crown
    const born = expoOut(span(t, a.same + .2, a.same + 1.0)), lift = sineIO(span(t, a.few, a.pointed + .3)), up = sineIO(span(t, a.thisis + .1, a.thisis + 1.5));
    if (born <= 0) return;
    const sx = scr.x + scr.w / 2, sy = scr.y + scr.h / 2;
    let bx = lerp(sx, BEAD0[0], born), by = lerp(sy, BEAD0[1], born) - 40 * lift;
    bx += 3 * Math.sin(t * 1.3); by += 2.5 * Math.sin(t * 1.7);
    const B = [lerp(bx, CORE[0], up), lerp(by, CORE[1], up)];
    // the email and the ad: small cool glyphs the bead writes out of the screen, then takes back when it lifts
    for (const [key, ta, dx] of [['email', a.emails, -54], ['ad', a.ads, 54]]) {
      const e = expoOut(span(t, ta - .15, ta + .55)), back = sineIO(span(t, a.few - .1, a.few + .7)); if (e <= 0 || back >= 1) continue;
      const x = lerp(sx + dx * e, B[0], back), y = lerp(sy - 46 * e, B[1], back);
      F.tool(ctx, key, x, y, 24 * e * (1 - back), { col: 'cool', glow: .6 });
    }
    // THE AIM: the beam swings from the bead up to the core of the crown; warm where it lands
    const bu = sineIO(span(t, a.pointed - .1, a.pointed + 1.0));
    if (bu > 0 && up < 1) F.beam(ctx, t, B[0], B[1], CORE[0], CORE[1], bu, { w: 3.2, hit: span(t, a.pointed + .8, a.pointed + 1.4), warm: .15 + .5 * span(t, a.bigger, a.thisis), a: 1 - span(t, a.thisis + 1.1, a.thisis + 1.5) });
    F.agent(ctx, t, B[0], B[1], 7.5 * born * (1 - .85 * up), { think: t < a.few ? .5 : 0, a: 1 - span(t, a.thisis + 1.2, a.thisis + 1.55) });
  }
  // H.11: the gold thread through the twelve lanterns (12 → 1) and on toward the ?; it draws back before the lanterns lift
  const THREAD = (() => { const pts = []; for (let n = 12; n >= 1; n--) { const g = S.lanternGlass(n); pts.push([g.x, g.y + g.h * .62, 2.6]); } pts.push([G1.x + 70, G1.y - 6, 2.6], [G1.x + 112, G1.y - 60, 2.6]); return E.catmull(pts, 8); })();
  function thread(ctx, t) {
    const u = sineIO(span(t, a.whatall + .3, a.common + .2)) * (1 - sineIO(span(t, a.lastof - .2, tMorph)));
    if (u > 0) E.trail(ctx, THREAD, u, { w: 2.6 });
  }
  // H.12: a yellowed newspaper page leaves the crown, sways down and hangs under lantern 1 (the clue). From tMorph the rail draws it.
  function newsPage(ctx, t) {
    if (t >= tMorph) return;
    const u = span(t, a.clue + .1, a.lastof + .1); if (u <= 0) return;
    const e = sineIO(u), x0 = 1420, y0 = 420;
    const x = lerp(x0, PIN.x, e) + 46 * Math.sin(u * Math.PI * 2.2) * (1 - e), y = lerp(y0, PIN.y, e);
    const k = E.smooth(span(u, .82, 1));
    ctx.save(); ctx.translate(x, y); ctx.rotate(.5 * Math.sin(u * Math.PI * 2.2) * (1 - k)); F.tool(ctx, 'news', 0, 0, lerp(30, PIN.s, k), { lit: 0 }); ctx.restore();
    if (k > 0) { ctx.strokeStyle = rgba(F.INK.rim, .5 * k); ctx.lineWidth = Q1; ctx.beginPath(); ctx.moveTo(PIN.x, PIN.ty); ctx.lineTo(PIN.x, PIN.ty + 10 * Q1 * k); ctx.stroke(); }
  }

  // ---------------------------------------------------------------- the station world
  const FLY = (() => { const r = E.prng(1212), src = [...S.HOMES.map((h) => [h[0], h[1] - 30]), ...S.BOATS.map((b) => [b[0], b[1] - 50])], out = [];
    for (let i = 0; i < 64; i++) { const [x, y] = src[Math.floor(r() * src.length)]; out.push({ x: x + (r() - .5) * 30, y, t0: r(), ph: r() * 6, lift: 180 + r() * 160 }); } return out; })();
  function stationPart(ctx, t) {
    const c = drifted(camStation(t), S.Z_ST, t);
    const ring = E.smooth(span(t, a.asked + 1.2, a.ten + .8));
    S.stationWorld(ctx, c, t, {
      window: 1, ring, towers: lerp(.25, .85, E.smooth(span(t, a.giant - .1, a.giant + 1.2))) - .15 * span(t, a.asked, a.ten),
      voices: (cx) => { bead(cx, t); ruler(cx, t); voices(cx, t); },
    });
    return c;
  }
  // 12.03: the machine grows out of the antenna light and listens: rings go out, nothing comes back. 'to build it': it settles into the window
  function bead(ctx, t) {
    const born = expoOut(span(t, a.machine - .1, a.machine + .9)), home = sineIO(span(t, a.build, a.build + .9)); if (born <= 0 || home >= 1) return;
    const hx = ANT[0] + 4 * Math.sin(t * 1.2), hy = ANT[1] - 64 * born + 3 * Math.sin(t * 1.6);
    const x = lerp(hx, W0[0], home), y = lerp(hy, W0[1], home);
    F.agent(ctx, t, x, y, 9 * born * (1 - home), { think: span(t, a.machine + .6, a.learn) * (1 - span(t, a.asked, a.asked + 1)) });
    const ra = span(t, a.machine + .8, a.machine + 1.4) * (1 - span(t, a.learn + .2, a.learn + 1.2));
    if (ra > 0) F.radioRings(ctx, t, x, y, 120, { a: ra, col: F.COOL.line });
  }
  // 12.04/12.06: the hour ruler over the sea: grows from the antenna, empty; the voices fill it in ten days; it draws back into the antenna
  function ruler(ctx, t) {
    const grow = sineIO(span(t, a.learn + .2, a.learn + 2.4)) * (1 - sineIO(span(t, a.build + .1, a.build + 1.0)));
    if (grow <= 0) return;
    const fill = E.smooth(span(t, a.ten + .1, a.build - .1));
    F.ruler(ctx, t, { x: RUL.x, y: RUL.y, w: RUL.w, u: grow, fill, ticks: [[0, '0'], [1, '300 HOURS']], minor: 30, label: 'TE REO MĀORI · HOURS OF SPEECH', col: 'warm', a: 1 - span(t, a.build + .5, a.build + 1.0) });
    const lu = rise(span(t, a.ten + .15, a.ten + .9)) * (1 - span(t, a.build - .3, a.build + .3));
    if (lu > 0) maskLine(ctx, [['10 DAYS', 0]], RUL.x, RUL.y - 118, 76, lu, { col: P.cream });
    const lu2 = rise(span(t, a.ten + 1.1, a.ten + 1.9)) * (1 - span(t, a.build - .3, a.build + .3));
    if (lu2 > 0) maskLine(ctx, [['≈ 2,500 PEOPLE · 300+ HOURS', 0]], RUL.x, RUL.y + 100, 26, lu2, { serif: false, weight: 600, col: P.halo2, glow: false });
  }
  // 12.05/12.06: the voices of the coast rise like fireflies to the antenna; from 'In just ten days' they go on into the ruler
  function voices(ctx, t) {
    const span0 = a.asked + .2, span1 = a.build - 1.6;
    for (const v of FLY) {
      const tl = lerp(span0, span1, v.t0), d = 1.7, u = (t - tl) / d; if (u <= 0) continue;
      const toRuler = tl + d > a.ten;
      let x, y, s = 20;
      if (u < 1) { const e = sineIO(u), cx = (v.x + ANT[0]) / 2, cy = Math.min(v.y, ANT[1]) - v.lift; x = (1 - e) ** 2 * v.x + 2 * (1 - e) * e * cx + e * e * ANT[0]; y = (1 - e) ** 2 * v.y + 2 * (1 - e) * e * cy + e * e * ANT[1]; }
      else if (toRuler) { const w = clamp((t - tl - d) / .9); if (w >= 1) continue; const head = RUL.x + RUL.w * E.smooth(span(t, a.ten + .1, a.build - .1)); x = lerp(ANT[0], Math.max(RUL.x + 10, head - 20), sineIO(w)); y = lerp(ANT[1], RUL.y, sineIO(w)); s = 20 * (1 - .5 * w); }
      else continue;   // absorbed by the ring
      F.voiceWave(ctx, t, x, y, s, { a: Math.min(1, u * 4), ph: v.ph });
    }
  }

  // ---------------------------------------------------------------- one frame
  let ctx_ = null;
  return (ctx, t) => {
    ctx_ = ctx;
    if (t >= tPlate) { S.plateStation(ctx, t, T); return; }
    const inTree = t < tp;
    const c = inTree ? treePart(ctx, t) : stationPart(ctx, t);
    // C3a: the glass of lantern 7 grows into the clip plate, and shrinks back into it
    if (inTree && t > c3.start - .7 && t < c3.end + .6) {
      const g = S.lanternGlass(7), p0 = E.project(c, F0, g.x - g.w / 2, g.y - g.h / 2), p1 = E.project(c, F0, g.x + g.w / 2, g.y + g.h / 2);
      const m = sineIO(span(t, c3.start - .6, c3.start + .1)) * (1 - sineIO(span(t, c3.end - .1, c3.end + .55)));
      const fade = span(t, c3.start - .6, c3.start - .3) * (1 - span(t, c3.end + .3, c3.end + .55));   // the footage takes over the glass gently (no pop)
      if (m > 0 && fade > 0) { ctx.save(); ctx.globalAlpha = fade; F.clipPlate(ctx, t, T, 'C3a', { from: { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] }, morph: m }); ctx.restore(); }
    }
    // REAL stamps: one per teaser window (bottom left), then the three together under their lanterns, then Te Hiku
    F.realStamp(ctx, t, a.india + .9, a.calif - .6, 'elephants');
    F.realStamp(ctx, t, a.calif + 1.9, c3.start - .9, 'casey');
    F.realStamp(ctx, t, a.peru + 1.7, a.real - .5, 'nazca');
    if (inTree && t > a.real - .2 && t < a.same + .8) [[4, 'elephants', 0], [7, 'casey', .18], [9, 'nazca', .36]].forEach(([n, key, d]) => {
      const g = S.lanternGlass(n), p = E.project(c, F0, g.x, g.y + g.h / 2 + 30); if (p) F.realStamp(ctx, t, a.real + .25 + d, a.same + .2, { status: null, place: null }, { x: p[0] - 46, y: p[1], size: 22 });
    });
    F.realStamp(ctx, t, a.tiny - .2, a.machine - .4, 'tehiku');
    F.source(ctx, t, a.ten + .4, a.build + .3, F.SOURCES.tehiku);
    // H.10: the line (thumbnail composition)
    F.thesis(ctx, t, 104, 300, span(t, a.thisis - .05, a.usedE + .2), { lines: ['THIS IS WHAT', 'A.I. SHOULD', 'BE USED FOR'], size: 104, out: span(t, a.whatall - .3, a.whatall + .6) });
    // H.11: the open question rises beside lantern 1
    if (inTree) { const p = E.project(c, F0, G1.x + 112, G1.y - 92); const qu = span(t, a.common - .1, a.common + .8) * (1 - span(t, a.clue + .2, a.clue + .9)); if (p && qu > 0) F.questionMark(ctx, t, p[0], p[1], 64 * p[2], qu); }
    // the LAMP RAIL: lanterns 11 … 1 lift into it (staggered, from where they hung); lamp 12 drops in on its string after the door
    if (t >= tMorph) {
      const fr = fromAt();
      F.lampRail(ctx, t, T, {
        m: span(t, tMorph, tMorph + 2.2),
        mOf: (n) => (n === 12 ? (t < tp ? 0 : span(t, tp + 1.2, tp + 2.2)) : span(t, tMorph + (11 - n) * .07, tMorph + 1.5 + (11 - n) * .07)),
        from: (n) => (n === 12 ? [F.railPos(12)[0], F.RAIL.y, .5, 0] : fr[n]),
      });
    }
    // the light door: into lantern 12's glass → out of the station's warm window
    const fl = t < tp ? E.smooth(span(t, tp - 1.4, tp)) : 1 - E.smooth(span(t, tp, tp + 1.4));
    E.lightFlood(ctx, fl);
  };
}
