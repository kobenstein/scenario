// Film 49 · c01 · HOOK (lead, reference quality). One continuous take, no cut, from THUMBNAIL B (frame 0) to plateFoot at 'Picture a wedding'.
// Read this file as the pattern for every chunk: phrase anchors only, one camPath through the whole chunk, state as functions of t, the
// plate drawn for the last .5 s.
//
// | beat  | phrase (VO)                          | picture                                                                                   | camera / kind     |
// |-------|--------------------------------------|-------------------------------------------------------------------------------------------|-------------------|
// | H.01  | You have five years                  | THUMBNAIL B: the title stands, you at the foot, the door; the title sinks behind its mask  | breathing · SCENE |
// | H.02  | A machine smarter                    | the door flares once; SMARTER THAN ANY HUMAN / AT ALMOST EVERYTHING in the sky            | push · MIX        |
// | H.03  | That means the biggest change        | pull back and left: behind the five steps a long dark stair comes up out of the night     | pull back · LAND  |
// |       |                                      | (hundreds of flat steps); THE BIGGEST CHANGE / THE SHORTEST TIME                           |                   |
// | H.04  | The plow / The engine / The computer | a truck right along the old stair: each landing lights in back light on its word: HANDS · | truck · EXPL      |
// |       |                                      | MUSCLES · MEMORY                                                                           |                   |
// | H.05  | But thinking still needed a person   | the lit window, a person at the table, head in hand; THINKING NEEDED A PERSON             | truck · EXPL      |
// | H.06★ | Until now                            | THE SWEEP: the door flares, the gold of the five steps runs down the stairs, across the   | pull back · SCENE |
// |       |                                      | plain and over the window (the window's lamp is outshone)                                 |                   |
// | H.07  | And those changes took generations   | on two landings an adult stops, a child climbs on past; source line                       | glide · EXPL      |
// | H.08  | This time, there is no next gen…     | a long glide right to the foot: no child ahead; you alone; the light falls on you         | glide · SCENE     |
// |       | It falls to you                      | IT FALLS TO YOU                                                                            |                   |
// | H.09  | So how do you get ready              | HOW DO YOU GET READY / IN FIVE YEARS? · you climb the carved stair onto the first step     | rise · MIX        |
// | H.10  | The change has already started       | the gold light pools on the tread under your feet; the date card 2027? unfolds on the edge | push · EXPL       |
// | H.11  | But you have something … A warning   | wide from below: the whole stairs and the door, long before the arrival; A WARNING        | pull back · LAND  |
// | H.12  | The people building superintell…     | date cards unfold on the step edges: 1–2 YEARS (Amodei) · BY END OF 2028 (Altman); sources | glide · EXPL      |
// | H.13  | And the first thing … not your comp… | a laptop opens on the bottom step, its screen lit; you walk past it; it goes dark;        | truck · MIX       |
// |       |                                      | NOT YOUR COMPUTER → plateFoot (the wedding table waits at the left, unlit)                 |                   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, P, W, H } = E;
const PRINT = F.PRINT49;
const A = (u, v, s, sx = W / 2, sy = H / 2) => E.aim(S.Z_LAND, u, v, s, sx, sy);

export default async (T, R) => {
  const g = (p, d = 0) => T.G(p) + d, ge = (p, d = 0) => T.GE(p) + d;
  const a = {
    machine: g('A machine smarter'), biggest: g('That means the biggest'), plow: g('The plow'), engine: g('The engine'), computer: g('The computer'),
    thinking: g('But thinking still'), until: g('Until now'), gens: g('And those changes'), thisTime: g('This time, there is no'), falls: g('It falls to you'),
    how: g('So how do you get ready'), started: g('The change has already'), insiders: g('Some insiders expect'), something: g('But you have something'),
    warning: g('A warning'), building: g('The people building'), first: g('And the first thing'), notComp: g('not your computer'), end: g('Picture a wedding'),
  };
  a.plate = a.end - S.SEAM_HALF;
  const ly = (i) => S.landingY(i);
  // the one camera of the chunk (camPath glides THROUGH the keys; the last key is the plate camera)
  const K = [
    [0, E.cam3()],
    [a.machine - .4, A(985, 540, 1.03)],
    [a.machine + 2.6, A(1150, 470, 1.1, 960, 560)],
    [a.biggest + 2.5, A(-2350, 1140, .226, 960, 560)],
    [a.plow + .2, A(-5900, ly(0), .78, 960, 720)],
    [a.engine + .2, A(-4700, ly(1), .78, 960, 720)],
    [a.computer + .2, A(-3500, ly(2), .8, 960, 720)],
    [a.thinking + .5, A(-2330, ly(3), .82, 960, 760)],
    [a.until - .3, A(-520, 900, .42, 960, 700)],
    [a.until + 1.5, A(-700, 930, .44, 960, 700)],
    [a.gens + 1.3, A(-4000, (ly(1) + ly(2)) / 2, .68, 960, 700)],
    [a.thisTime + .6, A(-3500, 1180, .5, 960, 680)],
    [a.falls, A(400, 840, 1.28, 760, 560)],
    [a.how + .8, A(560, 760, 1.08, 960, 600)],
    [a.started + .6, A(640, 700, 1.55, 860, 600)],
    [a.something - .2, A(900, 715, 1.62, 960, 600)],
    [a.warning + .3, A(1020, 560, .8, 960, 500)],
    [a.building + 1.2, A(860, 690, 1.22, 960, 560)],
    [a.first + 1.2, A(640, 720, 1.32, 900, 560)],
    [a.plate - 1.5, creepCam(a.plate - 1.5, a)],
  ];
  return [{ t: 0, draw: scene(a, T, K), print: PRINT }];
};

// the plate's slow push (CREEP) and truck (TRUCK) continued BACKWARDS from the plate time: the camera is already creeping when the
// plate takes over, so the speed never drops to zero at the seam (seam.mjs: no FROZEN frames before 'Picture a wedding')
function creepCam(t, a) { const k = 1 + S.CREEP * (t - a.plate); return S.FOOT_CAM(k, S.trk(k)); }
function camAt(t, a, K) {
  const w = E.smooth(span(t, a.plate - 2.6, a.plate - 1.5)); if (w <= 0) return F.camPath(t, K);
  const p = F.camPath(t, K), q = creepCam(t, a); if (w >= 1) return q;
  return E.cam3({ x: p.x + (q.x - p.x) * w, y: p.y + (q.y - p.y) * w, z: p.z + (q.z - p.z) * w });
}
function scene(a, T, K) {
  return (ctx, t) => {
    if (t >= a.plate) { S.plateFoot(ctx, t, T); return; }
    const c = E.camDrift(camAt(t, a, K), t, .85 * (1 - span(t, a.plate - 1.2, a.plate)));
    // ---- light states
    const reveal = span(t, a.biggest, a.biggest + 2.2), old = Math.max(lerp(0, 1, smooth(reveal)) * (1 - .4 * span(t, a.thisTime, a.falls)), t > a.falls ? .6 : 0);
    const L = (p, d = .6) => smooth(span(t, p, p + d));
    const hist = [L(a.plow + .1), L(a.engine + .1), L(a.computer + .1), L(a.thinking + .2)].map((v, i) => v * (1 - .45 * span(t, a.thisTime, a.falls)));
    const sweep = span(t, a.until - .15, a.until + 1.6);
    const doorPulse = F.bump(t, a.machine + .1, 1.4) * .9 + F.bump(t, a.until - .3, 1.2);
    const climb = smooth(span(t, a.how + .6, a.how + 3.0));
    // ---- you: at the foot (look up) → climb the carved stair onto tread 0 → stand in the pool → walk past the laptop → the plate pose
    const s0 = S.STEPS[0], y0 = S.stageY(0);
    let you;
    const walkU = span(t, a.first + .3, a.first + 3.0), wx = lerp(470, S.PLATE_FOOT.youX, sineIO(walkU));
    if (t < a.how + .6) you = { x: S.YOU.x, y: S.GY, o: { look: lerp(.8, .55, span(t, a.thisTime, a.falls)), back: .35 } };
    else if (climb < 1) { const p = S.climbPos(0, climb); you = { x: lerp(S.YOU.x, 470, climb), y: p.y, o: { walk: climb * 9, dir: 1 } }; }
    else if (walkU <= 0 || walkU >= 1) you = { x: walkU >= 1 ? S.PLATE_FOOT.youX : 470, y: y0, o: walkU >= 1 ? { look: .3, back: .2, dir: 1 } : { look: lerp(.2, .7, span(t, a.something, a.warning)), back: .3, dir: 1 } };
    else you = { x: wx, y: y0, o: { walk: walkU * 12, dir: 1 } };
    // ---- the laptop: the lid rises on 'And the first thing', its screen lights; dark once you are past it (on 'not your computer')
    const lapOpen = smooth(span(t, a.first - .2, a.first + .7)), lapOn = lapOpen * (1 - smooth(span(t, a.notComp + .2, a.notComp + 1.1)));
    const st = {
      old, hist, histWords: 1, until: sweep, doorPulse, you,
      pool: smooth(span(t, a.falls - .3, a.falls + .8)) * (1 - smooth(span(t, a.how + .6, a.how + 1.6))) + smooth(span(t, a.started, a.started + 1.2)) * (1 - smooth(span(t, a.first + .5, a.first + 2.5))),
      poolX: t < a.how + 1.2 ? S.YOU.x : 520, poolY: t < a.how + 1.2 ? S.GY : y0,
      laptop: lapOpen > 0 ? { x: S.PLATE_FOOT.laptopX, open: lapOpen, on: lapOn } : { x: S.PLATE_FOOT.laptopX, open: 0, on: 0, a: 0 },
      people: generations(t, a),
      land: (cx) => {
        const wu = L(a.thinking + .3, .8) * (1 - span(t, a.thisTime, a.thisTime + 1));
        if (wu > 0) F.goldText(cx, [['THINKING NEEDED A PERSON', .85]], -2300, S.landingY(3) + 78, 42, F.rise(wu), { serif: false, weight: 700, spacing: .1, align: 'center' });
        // the date cards on the step edges (they unfold out of the tread and fold back before the laptop opens)
        const fold = 1 - smooth(span(t, a.first - .6, a.first + .2));
        const c27 = smooth(span(t, a.insiders + .4, a.insiders + 1.3)) * fold, cA = smooth(span(t, a.building + .5, a.building + 1.3)) * fold, cB = smooth(span(t, a.building + 1.0, a.building + 1.8)) * fold;
        if (c27 > 0) F.tentCard(cx, t, 760, y0 + 4, 120, { u: c27, big: '2027?', small: ['AI Futures Project'], smallSize: 11, bigSize: 40 });
        if (cA > 0) F.tentCard(cx, t, 930, y0 + 4, 130, { u: cA, big: '1–2 years', small: ['Dario Amodei'], smallSize: 11, bigSize: 30 });
        if (cB > 0) F.tentCard(cx, t, 1130, S.stageY(1) + 4, 136, { u: cB, big: 'end of 2028', small: ['Sam Altman'], smallSize: 11, bigSize: 28 });
      },
    };
    S.stairsWorld(ctx, c, t, st);
    // ---- words in the sky (screen space; only where nothing else is)
    const cap = (lines, t0, t1, o = {}) => { const u = span(t, t0, t0 + .9), out = span(t, t1 - .6, t1 + .1); if (u > 0 && out < 1) F.caption(ctx, t, o.x ?? 80, o.y ?? 250, lines, u, { size: o.size ?? 116, out: out > 0 ? out : null }); };
    F.title(ctx, t, 1, { out: t > 2.9 ? span(t, 2.9, 4.0) : null });
    cap(['SMARTER THAN ANY HUMAN', 'AT ALMOST EVERYTHING'], a.machine + .2, a.biggest - .1, { size: 104 });
    cap(['THE BIGGEST CHANGE', 'THE SHORTEST TIME'], a.biggest + .5, a.plow - .2, { size: 104, y: 230 });
    cap(['IT FALLS TO YOU'], a.falls - .05, a.how - .05, { x: 1000, y: 300, size: 130 });
    cap(['HOW DO YOU GET READY', 'IN FIVE YEARS?'], a.how + .1, a.started - .1, { x: 90, y: 260, size: 116 });
    cap(['A WARNING'], a.warning - .05, a.building + .1, { x: 90, y: 250, size: 150 });
    cap(['NOT YOUR COMPUTER'], a.notComp - .1, a.plate - .25, { x: 90, y: 250, size: 116 });
    // ---- source lines (y 880, ≥ 22 px)
    F.source(ctx, t, a.gens + .3, a.thisTime + .2, F.SOURCES.generations);
    F.source(ctx, t, a.insiders + .8, a.something, F.SOURCES.insiders);
    F.source(ctx, t, a.building + .9, a.first - .3, F.SOURCES.amodei, { y: 846 });
    F.source(ctx, t, a.building + 1.3, a.first - .3, F.SOURCES.altman);
  };
}

// the generations on the old stair: grown-ups stand at the landings' edges (they were there since the reveal); on 'And those changes took
// generations' the children walk on past them, up the old stair to the next landing.
function generations(t, a) {
  const out = [], lx = (i) => S.OLD_LANDINGS[i].x, w = (i) => S.OLD_LANDINGS[i].w / 2;
  out.push({ x: lx(0) + 150, y: S.landingY(0), h: 158, kind: 'person', o: { look: .2, back: .3 } });
  [[1, 0], [2, .6]].forEach(([i, d]) => {
    const ax = lx(i) + w(i) - 50, u = sineIO(span(t, a.gens + .4 + d, a.gens + 3.6 + d)), cx = lerp(ax - 110, ax + 520, u);
    out.push({ x: ax, y: S.landingY(i), h: 160, kind: 'person', o: { look: lerp(.1, .6, u), back: .3, long: true } });
    out.push({ x: cx, y: S.oldY(cx), h: 104, kind: 'person', o: u > 0 && u < 1 ? { walk: u * 14, dir: 1 } : { look: .4, back: .2 } });
  });
  return out;
}
