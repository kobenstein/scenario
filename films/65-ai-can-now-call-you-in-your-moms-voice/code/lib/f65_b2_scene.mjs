// Film 65 · B2 (c07–c11) as ONE continuous take: 'The third step is a face' (plateLine(3)) → 'Then one step is left' (plateLine(5)).
// Each scene file sc07 … sc11 returns this same draw function for its own range, so the inner chunk boundaries match frame for frame by
// construction. Plan: docs/shots.md 3.01–4.13 + M.01 · world: docs/MOTION.md · drawings: lib/f65_b2_draw.mjs. Owned by builder B2.
//
//   c07  out of plate 3: STEP 3 OF 5 · A FACE, the camera flies over the wire into a lit window of the town: an old woman holds a tablet
//        with a forged leader (generic suit before a flag); "forged": the copy shows through (blue); ABOUT CA$900,000 · back out, the
//        camera cranes over the town: one slab of losses, ★ NEARLY HALF lights gold: INVESTMENT FRAUD; NEVER RELIABLY MEASURED; the
//        forged face rises from that window into the gold as a door (one way in)
//   c08  the small blue voice in tears vs the big gold return line; the face rides up the line (it wears the face) · up and over to her
//        window, into the kitchen: note 3 FAMOUS FACE + PROFIT = FAKE flies from the table to the fridge; a link chip from her phone gets a
//        cream cross; the note holds · out: tags 1–3 light in turn (tag 3 gold) · she might call you: a gold arc from her window to your
//        phone · M.01 the calm world shot, the arc breathing
//   c09  STEP 4 OF 5 · THE CLOCK: the arc goes back, the moon rises over the ridge (the only clock), gold runs to pole 4 · a blue copy of a
//        voice she loves drops into her window · the kitchen: her phone lifts to the camera: DO IT NOW · DON'T TELL ANYONE · the fake chain
//        THE BANK → VIDEO CALL (the seal a little crooked) → a paper to sign → DON'T SPEAK TO ANYONE · the video goes dark, the C10 QUOTE
//        card grows out of it and back · a cream cross over the video call
//   c10  back out: the blue voice holds her line, the gold arc to you cannot form · up over the town: two fields of dots rise from the
//        windows, YOUNGER / OLDER; fewer older dots light, but they turn gold; ★ three grow big: A SMALL SHARE OF CASES · the three gold
//        dots sink into her window · the kitchen: A PLAN, MADE ON A CALM DAY; note 4 HURRY + SECRET + MONEY = STOP; her contacts, your name
//   c11  the phone lifts again: ACTION PLAN · WHAT TO DO · WHO TO CALL · HOW TO VERIFY · C1 Meador (ORIGINAL FOOTAGE, contain) out of the
//        phone screen and back · the kitchen closes into her window, she steps out of her door and walks down the line; tags 1, 2, 4 pulse
//        beside their blue copies; the camera goes on ahead, the gold runs to pole 5, the bank glows → plateLine(5)
import * as E from './f10_editorial.mjs';
import * as F from './f65_kit.mjs';
import * as S from './f65_seams.mjs';
import * as D from './f65_b2_draw.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoIn, halo } = E;
const { rise, GOLD, COPY, NEUTRAL, LAMP, bump } = F;
const words = D.words;

let CACHE = null;
export function b2(T) {
  if (CACHE && CACHE.T === T) return CACHE.draw;
  E.prepareEditorial();
  const a = anchors(T);
  CACHE = { T, a, draw: scene(a, T) };
  return CACHE.draw;
}
export const b2Anchors = (T) => { b2(T); return CACHE.a; };

// ================================================================================================================= anchors (phrases only)
function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), a = {};
  a.T3 = G(S.LINE_PHRASE[3]); a.T5 = G(S.LINE_PHRASE[5]); a.s3in = a.T3 + S.SEAM_HALF; a.s5 = a.T5 - S.SEAM_HALF;
  // c07
  a.canada = G('In Canada', a.T3); a.pm = G('prime minister', a.canada); a.forged = G('The video was forged', a.canada); a.lost = G('She lost about', a.forged);
  a.alone = G('She is far from alone', a.lost); a.half = G('Nearly half', a.alone); a.fraud = G('investment fraud', a.half); a.howMuch = G('How much of that', a.half);
  a.faceIn = G('But a forged famous face', a.howMuch); a.oneWay = G('one way in', a.faceIn);
  // c08
  a.lie = G('So the most expensive lie', a.oneWay); a.ret = G('It is a promised return', a.lie); a.wear = G('And it can now wear', a.ret);
  a.agree3 = G('Here, the agreement', a.wear); a.rule = G('house rule', a.agree3); a.ffp = G('famous face plus', a.rule); a.profit = G('promised profit', a.ffp);
  a.never = G('And the family never', a.rule); a.link = G('link from an ad', a.never); a.guards = G('That guards against', a.never);
  a.vsf = G('A voice, a story, a face', a.guards); a.story = G('a story', a.vsf); a.aFace = G('a face', a.story); a.still = G('And still, all three', a.vsf);
  a.callYou = G('she might call you', a.still); a.chan = G('This channel exists', a.callYou); a.subscribe = G('Then subscribe', a.chan);
  // c09
  a.scam = G('So the scam must not', a.subscribe); a.fourth = G('The fourth step is a clock', a.scam); a.trick = G('The trick is old', a.fourth);
  a.sets = G('The voice that sets it', a.trick); a.loves = G('one she loves', a.sets);
  a.sounds = G('It sounds like this', a.loves); a.doNow = G('do it now', a.sounds); a.tell = G('tell anyone', a.doNow);
  a.version = G('One version', a.tell); a.bankCalls = G('the bank calls', a.version); a.agent = G('Then a so-called agent', a.bankCalls); a.flagSeal = G('flag and a seal', a.agent);
  a.demand = G('Then the demand', a.flagSeal); a.paper = G('sign a paper', a.demand); a.speak = G('speak to anyone', a.paper);
  a.realFBI = G('Here is the real FBI', a.speak); a.realAg = G('Real agents', a.realFBI);
  const c10 = T.clip('C10'); a.c10s = c10.start; a.c10e = c10.end;
  // c10
  a.hours = G('And think of those long hours', a.realAg); a.talked = G('as long as she talked', a.hours); a.daughter = G('could not call her daughter', a.talked);
  a.trusting = G('So is your mother simply', a.daughter); a.numbers = G('The numbers say no', a.trusting); a.older = G('Older adults report', a.numbers); a.less = G('less often', a.older);
  a.hits = G('But when it hits', a.less); a.savings = G('hits the savings', a.hits); a.share = G('A small share of cases', a.savings); a.most = G('carries most of the money', a.share);
  a.missing = G("So what's missing", a.most); a.plan = G("It's a plan", a.missing); a.madeOn = G('made on a', a.plan);
  a.agree4 = G('Agree on this', a.plan); a.hurry = G('Hurry, plus secrecy', a.agree4); a.plusMoney = G('plus money', a.hurry);
  a.dollar = G('Before a dollar moves', a.hurry); a.onePerson = G('one person you chose', a.dollar); a.protects = G('That protects her', a.dollar);
  // c11
  a.ftc = G('The Federal Trade Commission', a.protects); a.aplan = G('action plan', a.ftc); a.what = G('what to do', a.aplan); a.who = G('who to call', a.what); a.verify = G('how to verify', a.who);
  a.comm = G('One of its commissioners', a.verify); const c1 = T.clip('C1'); a.c1s = c1.start; a.c1e = c1.end;
  a.suppose = G('But suppose she', a.comm); a.vsc = G('Voice, story and clock', a.suppose); a.vStory = G('story', a.vsc); a.vClock = G('clock', a.vStory);
  a.believes = G('She believes every word', a.vsc); a.wayBank = G('on her way to the bank', a.believes);
  // the portals (each opens out of a window in the world and closes back into it)
  a.R = { kind: 'room', o0: a.canada + .75, o1: a.canada + 1.75, s0: a.alone - .3, s1: a.alone + .7 };
  a.K1 = { kind: 'k1', o0: a.rule - .35, o1: a.rule + .6, s0: a.vsf - .45, s1: a.vsf + .55 };
  a.K2 = { kind: 'k2', o0: a.sounds - .95, o1: a.sounds + .05, s0: a.hours + .45, s1: a.hours + 1.45 };
  a.K3 = { kind: 'k3', o0: a.missing + 1.3, o1: a.missing + 2.3, s0: a.suppose - .1, s1: a.suppose + 1.1 };
  a.portals = [a.R, a.K1, a.K2, a.K3];
  // the phone lifted to the camera (c09, c11)
  a.lift2 = [a.sounds - .1, a.sounds + 1.1, a.realAg + 2.45, a.realAg + 3.6];
  a.lift3 = [a.onePerson - .3, a.onePerson + .9, 1e9, 1e9];
  a.out = a.suppose + 1.25;                                              // she steps out of her door
  return a;
}

// ================================================================================================================= the world camera
const WIN = S.winWorld(), TW = D.TOWNWIN;
const lookWin = (mag, sy = 560) => S.look(WIN[0], WIN[1], WIN[2], mag, 960, sy, 600);
const lookTW = (mag) => S.look(TW[0], TW[1], TW[2], mag, 960, 540, 560);
const cam = (x, height, z, hz) => E.cam3({ x, y: S.EYE - height, z, hz });
function keys(a, T) {
  const cr = (t) => S.creep(t, T, S.LINE_PHRASE[3]);
  return [
    [a.s3in, S.lineCam(3, cr(a.s3in))], [a.s3in + .3, S.lineCam(3, cr(a.s3in + .3))],                     // the plate's creep goes on
    [a.canada - .6, cam(420, 650, 6600, 540)],                                                             // up and over the wire …
    [a.canada + .75, lookTW(8.5)], [a.canada + 1.9, lookTW(12)],                                           // … down into the lit town window
    [a.alone + .2, lookTW(12.5)],
    [a.half + .5, cam(260, 448, 6780, 560)],                                                               // crane over the town: the sky is the page
    [a.ret, cam(820, 470, 7100, 561)], [a.wear + .75, cam(880, 475, 7160, 562)],
    [a.wear + 1.4, cam(-300, 1080, 6850, 470)],                                                             // rise high above the line …
    [a.rule - 1.0, cam(-1500, 900, 4600, 470)],                                                            // … cross it well above the wire …
    [a.rule - .1, lookWin(5.2)], [a.rule + 1.0, lookWin(6.4)],                                              // … and down into her window
    [a.vsf - .45, lookWin(6.8)],
    [a.aFace + .9, S.look(60, 330, 6400, 1.75, 960, 640, 562)],                                            // back out: the whole line
    [a.callYou - .3, cam(240, 420, 760, 600)],                                                            // her house and you (M.01)
    [a.subscribe + .5, cam(640, 452, 1280, 600)],
    [a.sets + .2, cam(330, 480, 2350, 605)], [a.loves + .3, lookWin(5.2)], [a.sounds + .6, lookWin(6.4)],  // the copy's arc → her window
    [a.hours + .45, lookWin(6.8)],
    [a.hours + 1.9, S.look(-1250, 500, 6400, 2.5, 800, 580, 575)],
    [a.talked - .2, cam(420, 440, 1150, 600)], [a.trusting + .3, cam(440, 450, 1250, 598)],
    [a.numbers - .1, cam(450, 1040, 300, 430)], [a.most + .6, cam(800, 1150, 700, 420)],                  // up over the town: the dots
    [a.missing + 1.45, lookWin(5.2)], [a.plan + .4, lookWin(6.4)],                                         // the gold dots sink into her window
    [a.suppose - .1, lookWin(6.8)],
    [a.suppose + 1.2, S.look(-1550, 450, 6400, 2.6, 820, 600, 575)],                                       // her door
    [a.vsc + .9, S.look(-1150, 420, 6400, 2.4, 900, 600, 560)],
    [a.believes + .3, S.look(-250, 360, 6390, 2.15, 860, 590, 540)],                                       // on ahead along the line
    [a.s5 - .5, S.lineCam(5, .985)], [a.s5, S.lineCam(5)],                                                 // → plateLine(5)
  ];
}

// ================================================================================================================= the scene
let PHONE = null;   // the big phone's screen rect of the current frame (set inside the portal, read by the clip frames)
function scene(a, T) {
  const K = keys(a, T);
  const dAmp = (t) => span(t, a.s3in, a.s3in + 1.2) * (1 - span(t, a.s5 - 1.6, a.s5 - .1));
  const portalAt = (t) => { for (const p of a.portals) { const m = sineIO(span(t, p.o0, p.o1)) * (1 - sineIO(span(t, p.s0, p.s1))); if (m > 0) return { p, m }; } return { p: null, m: 0 }; };
  const WINS = S.WINDOWS;
  const N1 = { lines: ['WORD'], cover: 1 }, N2 = { lines: ['?'], size: .4 };
  const L3 = ['FACE +', 'PROFIT', '= FAKE'], L4 = ['HURRY +', 'SECRET +', 'MONEY', '= STOP'];

  // ---- the world state (converges on lineState(3) at the start and lineState(5) at the end)
  const state = (t, c) => {
    const boost = a.portals.filter((p) => p.kind !== 'room').reduce((m, p) => Math.max(m, span(t, p.o0 - 1.2, p.o0 - .2) * (1 - span(t, p.s1, p.s1 + 1.2))), 0);
    const st = {
      tags: {
        lit: (k) => (k < 3 ? 1 : k === 3 ? rise(span(t, a.aFace - .1, a.aFace + .5)) : k === 4 ? (t > a.agree4 ? rise(span(t, a.protects, a.protects + .6)) : 0) : 0),
        hi: t < a.scam ? 3 : t < a.ftc ? 4 : 5,
        hiA: t < a.scam ? 1 - span(t, a.aFace + .2, a.aFace + 1.2) : t < a.ftc ? rise(span(t, a.fourth - .1, a.fourth + .6)) * (1 - span(t, a.protects, a.protects + 1)) : rise(span(t, a.wayBank - .5, a.wayBank + .5)),
      },
      source: { a: .55 + .2 * span(t, a.sets - .6, a.sets + .4) * (1 - span(t, a.sounds, a.sounds + 1)) + .2 * span(t, a.hours + 1.2, a.hours + 2.2) * (1 - span(t, a.trusting, a.numbers)) },
      bank: { win: .8, glow: .35 * rise(span(t, a.wayBank - .2, a.wayBank + 1.0)) },
      wire: { gold: 1, u: 3 + sineIO(span(t, a.fourth + .1, a.fourth + 1.3)) + sineIO(span(t, a.wayBank - .2, a.wayBank + 1.0)) },
      house: { win: 1 + .35 * boost + .5 * bump(t, a.missing + .6, 1.4) },
      ghosts: { a: 1 - span(t, a.wayBank + .5, a.s5 - .15), of: (k) => (k < 5 ? rise(span(t, a.vsc - .2 + (k - 1) * .25, a.vsc + .5 + (k - 1) * .25)) : 0) },
    };
    const mo = D.moonAt(c, t, a.scam - .3, a.suppose); if (mo) st.moon = mo;
    if (t > a.agree3 && t < a.ftc) st.you = { phone: 1, screen: 'wave', light: .95 * rise(span(t, a.callYou + .5, a.callYou + 1.3)) * (1 - span(t, a.scam + .2, a.scam + 1.4)) };
    return st;
  };

  // ---- things in the world (screen space, recomputed from the camera every frame)
  const worldExtra = (cx, out, c, t) => {
    const wp = S.proj(c, ...WIN), sp = out.source, ph = out.phone;
    // tags light in turn with the words (c08: a voice, a story, a face · c11: voice, story, clock)
    for (const [k, t0] of [[1, a.vsf], [2, a.story], [3, a.aFace], [1, a.vsc], [2, a.vStory], [4, a.vClock]]) {
      const b = bump(t, t0 - .1, 1.1); if (b <= 0) continue; const p = out.tag(k); if (p) halo(cx, p[0], p[1], 230 * p[2], .5 * b, GOLD.halo, GOLD.core);
    }
    // she might call you: a gold arc from her window to your phone (M.01: it breathes); in step 4 it goes back into her window
    const g1 = sineIO(span(t, a.callYou - .2, a.callYou + 1.2)) * (1 - sineIO(span(t, a.scam + .1, a.scam + 1.7)));
    if (wp && ph && g1 > 0) F.voiceWave(cx, t, F.arcPts(wp[0], wp[1], ph.x, ph.y - ph.h * .2, 300, 48), { amp: 15 + 4 * Math.sin(t * .7), col: GOLD, seed: 3, speed: 45, u1: g1, taper: .12 });
    // the copy of a voice she loves: from the glow into her window (c09); the copy keeps her line busy (c10)
    const b1 = sineIO(span(t, a.sets - .2, a.sets + 1.2)) * (1 - span(t, a.sounds - .7, a.sounds - .1));
    const b2 = sineIO(span(t, a.hours + 1.3, a.hours + 2.6)) * (1 - span(t, a.trusting + .1, a.trusting + .9));
    const bb = Math.max(b1, b2);
    if (wp && sp && bb > 0) {
      const s2 = wp[2], amp = clamp(6 + 9 * s2 * 2.2, 8, 40);
      F.voiceWave(cx, t, F.arcPts(sp[0], sp[1], wp[0], wp[1], 120 + 80 * Math.min(2, s2 * 2), 48), { amp, col: COPY, seed: 7, speed: 70, u1: t < a.hours ? b1 : 1, a: t < a.hours ? 1 - span(t, a.sounds - .7, a.sounds - .1) : b2, flicker: 1, tremble: .5, taper: .12 });
    }
    // she cannot call out: a gold arc from her window toward you starts and falls back, twice
    const tryU = .36 * (bump(t, a.talked - .3, 1.8) + bump(t, a.daughter - .2, 1.8));
    if (wp && ph && tryU > .01) F.voiceWave(cx, t, F.arcPts(wp[0], wp[1], ph.x, ph.y - ph.h * .2, 300, 48), { amp: 14, col: GOLD, seed: 3, speed: 45, u1: tryU, taper: .2 });
    // the dots (c10): two fields rise from the town windows into the sky
    if (t > a.numbers - .7 && t < a.missing + 1.6) dots(cx, c, t, wp);
    // she walks out of her door and down the line (c11)
    if (t > a.out - .1) {
      const tt = t - a.out, d = 150 * (tt - .35 * (1 - Math.exp(-Math.max(0, tt) / .35))), X = -1900 + Math.max(0, d), ph2 = TAU * Math.max(0, d) / 129;
      cx.save(); cx.globalAlpha = span(t, a.out - .1, a.out + .5);
      S.at(cx, c, X, 6370, () => { halo(cx, 0, -95, 150, .3, LAMP.halo, LAMP.core); F.mom(cx, 0, 0, 170, { walk: ph2, dir: 1, lean: .05, light: -1 }); }, S.herY(X));   // a faint warm glow behind her, so the small silhouette reads
      cx.restore();
    }
  };

  // ---- c10 dots: YOUNGER (left) · OLDER (right); fewer older light, they turn gold, three grow big; then those three sink into her window
  const FIELD = [[340, 180], [1140, 180]], PITCH = 44, BIG = [26, 27, 28];
  const hash = (i) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
  const dots = (cx, c, t, wp) => {
    const out = 1 - expoIn(span(t, a.missing - .4, a.missing + .4)), fly = sineIO(span(t, a.missing - .2, a.missing + 1.4));
    const shareU = sineIO(span(t, a.share + .2, a.share + 1.3)), gold = span(t, a.savings - .2, a.savings + .6), dimL = 1 - .5 * span(t, a.share, a.share + 1);
    cx.save();
    for (let i = 0; i < 120; i++) {
      const R = i >= 60, j = i % 60, big = R && BIG.includes(j), lit = big || hash(i) < (R ? .16 : .42);
      const tx = FIELD[+R][0] + (j % 10) * PITCH + 22 - 7 * Math.max(0, t - a.numbers), ty = FIELD[+R][1] + Math.floor(j / 10) * PITCH + 22;
      const t0 = a.numbers - .5 + j / 60 * 1.0 + (R ? .15 : 0), u = sineIO(span(t, t0, t0 + 1.3)); if (u <= 0) continue;
      const w0 = WINS[(i * 7) % WINS.length], sp = S.proj(c, w0.x, w0.y, w0.z) || [tx, H, 1];
      let x = lerp(sp[0], tx, u) + 30 * Math.sin(Math.PI * u) * Math.sin(i * 1.7), y = lerp(sp[1], ty, u) - 70 * Math.sin(Math.PI * u) + 2.4 * u * Math.sin(t * 1.1 + i * .9);   // each dot breathes
      const on = lit ? rise(span(t, (R ? a.less - .2 : a.older + .2) + j * .012, (R ? a.less + .3 : a.older + .8) + j * .012)) : 0;
      let r = 5.5 * (.6 + .4 * u) * (1 + .25 * on + (R ? .45 * gold * on : 0)), al = (.5 + .5 * on) * (u < .1 ? u / .1 : 1) * (.86 + .14 * Math.sin(t * 1.7 + i * 2.3));   // they twinkle
      let col = on > 0 ? E.mixHex(E.mixHex(P.blue1, NEUTRAL.body, on), GOLD.body, R ? gold : 0) : P.blue1;
      if (!R) al *= dimL;
      if (big) {
        r = lerp(r, 22, shareU) * lerp(1, .2, fly); x = lerp(x, wp ? wp[0] : x, fly); y = lerp(y, wp ? wp[1] : y, fly) - 60 * Math.sin(Math.PI * fly);
        const g = (.45 + .4 * bump(t, a.most - .1, 1.6)) * shareU * (1 - fly);
        if (g > 0) halo(cx, x, y, r * 4, g, GOLD.halo, GOLD.core);
        if (fly >= 1) continue;
      } else { al *= out; y += 40 * (1 - out); }
      if (al <= .01) continue;
      cx.fillStyle = E.rgba(col, clamp(al)); cx.beginPath(); cx.arc(x, y, r, 0, TAU); cx.fill();
    }
    cx.restore();
    const lu = rise(span(t, a.older - .1, a.older + .6)) * out;
    words(cx, 'YOUNGER', 538 - 7 * Math.max(0, t - a.numbers), 482, 28, lu, { align: 'center', col: P.halo2, glow: false });
    words(cx, 'OLDER', 1338 - 7 * Math.max(0, t - a.numbers), 482, 28, lu, { align: 'center', col: P.halo2, glow: false });
    cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0);
    const fdx = 7 * Math.max(0, t - a.numbers);
    F.bracket(cx, 1140 + 6 * PITCH + 4 - fdx, 1140 + 8 * PITCH + 40 - fdx, 236, rise(span(t, a.share + .4, a.share + 1.2)) * (1 - span(t, a.missing - .4, a.missing + .2)), 'A SMALL SHARE OF CASES', { size: 28 });
    cx.restore();
  };

  // ---- the kitchen camera (always creeping; trucks to the fridge for a note, pushes to the phone for the contacts)
  const kcam = (t, p) => {
    const tt = Math.max(0, t - p.o0), e = 1 - Math.exp(-tt / 15);
    let z = 1 + .32 * e + .004 * tt, dx = 200 * e + 3 * tt + E.drift(t, 26, 3), dy = 18 * e + E.drift(t, 14, 5);
    let fr = 0, ph = 0;
    if (p.kind === 'k1') { fr = sineIO(span(t, a.rule + .2, a.rule + 1.9)) * (1 - sineIO(span(t, a.never - .3, a.never + 1.5))); ph = sineIO(span(t, a.never - .3, a.never + 1.5)) * (1 - sineIO(span(t, a.guards + .3, a.guards + 2.1))) * .5; }
    if (p.kind === 'k3') { fr = sineIO(span(t, a.agree4 - .3, a.agree4 + 1.4)) * (1 - sineIO(span(t, a.dollar - .4, a.dollar + 1.3))); ph = sineIO(span(t, a.dollar - .4, a.dollar + 1.3)) * (1 - sineIO(span(t, a.ftc - .7, a.ftc + .3))); }
    const zf = z * 1.05, zp = 1.45;
    const Z = lerp(lerp(z, zf, fr), zp, ph);
    dx = lerp(lerp(dx, dx + 330, fr), 15, ph); dy = lerp(lerp(dy, dy + 30, fr), -203, ph);
    return { z: Z, dx, dy };
  };
  const liftAt = (t, L) => sineIO(span(t, L[0], L[1])) * (1 - sineIO(span(t, L[2], L[3])));
  const flyNote = (kx, t, t0, t1, i, o) => {
    const u = sineIO(span(t, t0, t1)); if (t < t0 - .3 || u >= 1) return;
    const [sx, sy] = S.NOTE_SLOTS[i], x0 = 930, y0 = 742, qx = 560, qy = 300, v = 1 - u;
    const x = v * v * x0 + 2 * v * u * qx + u * u * sx, y = v * v * y0 + 2 * v * u * qy + u * u * sy;
    F.note(kx, t, x, y, lerp(66, 112, u), { ...o, tilt: lerp(.35, [-.06, .05, .03, -.04, .02][i], u), a: span(t, t0 - .3, t0 + .1) });
  };
  const kitchenInside = (cx, w, h, t, p) => {
    const kc = kcam(t, p);
    const L = p.kind === 'k2' ? liftAt(t, a.lift2) : p.kind === 'k3' ? liftAt(t, a.lift3) : 0;
    const notes = [N1, N2];
    if (t >= a.rule + 1.45) notes[2] = { lines: L3, lit: t < a.vsf + 1 ? rise(span(t, a.guards, a.guards + .6)) : 0 };
    if (t >= a.hurry + 1.1) notes[3] = { lines: L4, size: .1, lit: rise(span(t, a.protects, a.protects + .6)) };
    let tph;
    if (p.kind === 'k2') tph = t < a.doNow ? { screen: 'wave', waveCol: COPY, tremble: .6, light: 1 } : { screen: 'video', light: 0 };
    else if (p.kind === 'k3') tph = { screen: 'contacts', light: rise(span(t, a.onePerson - .7, a.onePerson + .1)) };
    else tph = { screen: 'dark', light: 1 };
    cx.save(); cx.translate(w / 2, h / 2); cx.scale(kc.z, kc.z); cx.translate(-w / 2 + kc.dx, -h / 2 + kc.dy);
    S.kitchen(cx, t, w, h, {
      notes, phone: { ...tph, a: L > 0 ? 0 : 1 },
      mom: { look: .02 + .1 * L + .015 * Math.sin(t * .7), lean: .06 + .008 * Math.sin(t * 1.1) },
      extra: (kx, out) => {
        if (p.kind === 'k1') {
          flyNote(kx, t, a.rule + .45, a.rule + 1.45, 2, { lines: L3 });
          // a link (an ad, a chat) rises from her phone and gets a cream cross
          const cu = sineIO(span(t, a.never + .2, a.never + 1.2)) * (1 - sineIO(span(t, a.guards - .3, a.guards + .6)));
          if (cu > 0) {
            halo(kx, 1000, 800, 160, .35 * cu, LAMP.halo, LAMP.core);
            const y = lerp(800, 620, cu); D.linkChip(kx, t, 1000, y, lerp(20, 64, cu), clamp(cu * 3));
            F.crossMark(kx, 1000, y, 150, span(t, a.link + .3, a.link + 1.0), { a: clamp(cu * 3), w: 9 });
          }
        }
        if (p.kind === 'k3') flyNote(kx, t, a.hurry, a.hurry + 1.1, 3, { lines: L4, size: .1 });
      },
    });
    cx.restore();
    PHONE = null;
    if (L > 0) {   // her phone lifts from the table to the camera (the kitchen dims a little behind it)
      cx.fillStyle = rgba(P.night0, .38 * L); cx.fillRect(0, 0, w, h);
      const x0 = w / 2 + kc.z * (1000 - w / 2 + kc.dx), y0 = h / 2 + kc.z * (808 - h / 2 + kc.dy), h0 = 130 * kc.z;
      const x = lerp(x0, 1300, L) + 16 * L * Math.sin(t * .55), y = lerp(y0, 470, L) - 90 * Math.sin(Math.PI * L) + 11 * L * Math.sin(t * .75 + 1), ph = lerp(h0, 700, L);
      if (p.kind === 'k2') {
        const pu = sineIO(span(t, a.paper - .3, a.paper + .8)) * (1 - sineIO(span(t, a.realFBI - .2, a.realFBI + .8)));
        if (pu > 0) D.paperSheet(cx, t, lerp(x - 40, 930, pu), lerp(y + 120, 700, pu), lerp(120, 210, pu), lerp(0, -.12, pu), clamp(pu * 4));
        const kind = t < a.bankCalls - .25 ? 'wave' : t < a.agent + .05 ? 'bank' : 'video';
        const lt = (1 - bump(t, a.bankCalls - .45, .4)) * (1 - bump(t, a.agent - .15, .4)) * (1 - span(t, a.lift2[2] - .3, a.lift2[2] + .3));
        const r = D.bigPhone(cx, t, x, y, ph, kind, { flat: .9 * (1 - L), light: lt * (.93 + .07 * Math.sin(t * 2.1)),   // the screen breathes a little (never a frozen slide)
           waveCol: COPY, tremble: .6, ring: kind === 'bank' ? rise(span(t, a.bankCalls - .2, a.bankCalls + .2)) * (1 - span(t, a.agent - .3, a.agent)) : 0,
          seal: lerp(.2, .75, sineIO(span(t, a.flagSeal, a.flagSeal + 1))), dark: sineIO(span(t, a.realFBI + .2, a.realFBI + 1.4)) * (1 - sineIO(span(t, a.realAg - .2, a.realAg + .4))) });
        PHONE = r ? { ...r.screen, cx: x, cy: y } : null;
        F.crossMark(cx, x, y - ph * .05, 230, span(t, a.realAg + .7, a.realAg + 1.4), { a: 1 - span(t, a.lift2[2] - .3, a.lift2[2] + .2), w: 12 });
      } else {
        // contacts → plan: the screen dims, the two screens cross over while it is dark (their dark bases differ a little), then the plan lights
        const sw = a.ftc + 2.6, lt = 1 - bump(t, a.ftc + 2.25, .7), xo = span(t, sw - .25, sw + .25);
        const po = { flat: .9 * (1 - L), light: lt * (.93 + .07 * Math.sin(t * 2.1)), rows: span(t, a.ftc + 2.6, a.ftc + 3.4), checks: [a.what, a.who, a.verify].map((q) => span(t, q + .1, q + .6)) };
        let r = D.bigPhone(cx, t, x, y, ph, xo > 0 ? 'plan' : 'contacts', po);
        if (xo > 0 && xo < 1) r = D.bigPhone(cx, t, x, y, ph, 'contacts', { ...po, a: 1 - xo }) || r;
        PHONE = r ? { ...r.screen, cx: x, cy: y } : null;
      }
    }
  };
  const roomInside = (cx, w, h, t) => {
    const z = 1 + .024 * (t - a.R.o0);
    cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-w / 2 - 10 * (t - a.R.o0) + E.drift(t, 18, 2), -h / 2 + E.drift(t, 10, 4));
    D.tabletRoom(cx, t, w, h, { forged: sineIO(span(t, a.forged - .1, a.forged + .9)), sink: sineIO(span(t, a.lost, a.lost + 1.6)), gesture: .3 + .5 * bump(t, a.pm + .8, 3.0) });
    cx.restore();
  };

  // ---- words and explainers in screen space
  const RET = F.arcPts(700, 600, 1560, 200, 0, 40).map(([x, y], i, arr) => { const u = i / (arr.length - 1); return [lerp(700, 1560, u), 600 - 400 * Math.pow(u, 2.2)]; });
  const overlays = (ctx, t, c) => {
    // c07: STEP 3 OF 5 · A FACE · ABOUT CA$900,000
    F.stepLabel(ctx, t, 3, 'A FACE', rise(span(t, a.s3in, a.s3in + .7)) * (1 - expoIn(span(t, a.canada + 1.0, a.canada + 1.7))));
    const tu = rise(span(t, a.lost - .1, a.lost + .6)) * (1 - expoIn(span(t, a.alone - .4, a.alone + .2)));
    if (tu > 0) F.tally(ctx, t, { v: 900000, from: 900000, pre: 'ABOUT CA$', size: 96, u: 1, rise: tu });
    F.source(ctx, t, a.canada + .4, a.alone + .2, F.SOURCES.canada, { x: 1810, align: 'right' });
    // c07/c08: the slab of losses, NEARLY HALF gold, the caveat, the forged face as a door · the blue voice in tears vs the return line
    if (t > a.half - .4 && t < a.wear + 1.6) {
      const so = 1 - expoIn(span(t, a.lie + .05, a.lie + .85)), oo = 1 - expoIn(span(t, a.wear + .8, a.wear + 1.5)), sink = 140 * expoIn(span(t, a.wear + .8, a.wear + 1.5));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (so > 0) {
        F.slab(ctx, t, 300, 330, 1320, 54, { col: 'stone', u: span(t, a.half - .25, a.half + .65), a: so });
        const gu = span(t, a.half + .3, a.half + 1.4); if (gu > 0) F.slab(ctx, t, 300, 330, 1320 * .47, 54, { col: 'gold', u: gu, a: so });
        words(ctx, 'NEARLY HALF', 300, 282, 52, rise(span(t, a.half + .2, a.half + .9)) * so, { col: GOLD.text });
        words(ctx, 'INVESTMENT FRAUD', 300, 412, 30, rise(span(t, a.fraud - .2, a.fraud + .5)) * so, { glow: false });
        F.bracket(ctx, 300, 920, 200, rise(span(t, a.howMuch + .1, a.howMuch + .9)) * (1 - span(t, a.lie, a.lie + .6)), 'NEVER RELIABLY MEASURED', { size: 28 });
      }
      // the blue voice in tears (small) · the gold return line (big)
      const vu = sineIO(span(t, a.lie + .4, a.lie + 1.4));
      if (vu > 0) F.voiceWave(ctx, t, F.arcPts(230, 300 + sink, 560, 300 + sink, 26, 30), { amp: 17, col: COPY, seed: 9, speed: 55, u1: vu, tremble: 1, flicker: .6, a: (1 - .7 * span(t, a.ret, a.ret + .8)) * oo, taper: .15 });
      const ru = sineIO(span(t, a.ret - .05, a.ret + 1.3));
      if (ru > 0) F.accentSpan(ctx, RET.map(([x, y]) => [x, y + sink]), 0, ru, { col: GOLD, w: 5, a: oo });
      // the forged face: rises out of the town window into the gold (a door), then sits where the return line starts, then rides it up
      const tw = D.townWinRect(c), src = tw ? [tw.x + tw.w / 2, tw.y + tw.h / 2] : [900, 860];
      const pu = sineIO(span(t, a.faceIn + .1, a.oneWay + .2)), mu = sineIO(span(t, a.lie + .2, a.lie + 1.5)), wu = sineIO(span(t, a.wear + .05, a.wear + 1.1));
      if (pu > 0) {
        let x = lerp(src[0], 440, pu), y = lerp(src[1], 330, pu) - 120 * Math.sin(Math.PI * pu), wdt = lerp(16, 112, pu);
        x = lerp(x, RET[0][0], mu); y = lerp(y, RET[0][1], mu);
        const k = Math.round(wu * (RET.length - 1)), f = wu * (RET.length - 1) - Math.floor(wu * (RET.length - 1)), q0 = RET[Math.floor(wu * (RET.length - 1))], q1 = RET[Math.min(RET.length - 1, Math.floor(wu * (RET.length - 1)) + 1)];
        if (wu > 0) { x = lerp(q0[0], q1[0], f); y = lerp(q0[1], q1[1], f) - 60 * Math.sin(Math.PI * wu) * 0; }
        void k;
        D.miniScreen(ctx, t, x, y - (wu > 0 ? 50 * wu : 0) + sink, wdt * lerp(1, 1.25, wu), { a: clamp(pu * 4) * oo });
      }
      ctx.restore();
    }
    F.source(ctx, t, a.half + .3, a.lie + .6, F.SOURCES.invest);
    // c08 kitchen: FAMOUS FACE + / PROFIT = FAKE
    const k1o = 1 - expoIn(span(t, a.never - .4, a.never + .2));
    words(ctx, 'FAMOUS FACE +', 830, 160, 56, rise(span(t, a.ffp - .1, a.ffp + .6)) * k1o);
    words(ctx, 'PROFIT = FAKE', 830, 232, 56, rise(span(t, a.profit - .1, a.profit + .6)) * k1o, { col: GOLD.text });
    // c09: STEP 4 OF 5 · THE CLOCK
    F.stepLabel(ctx, t, 4, 'THE CLOCK', rise(span(t, a.fourth - .1, a.fourth + .6)) * (1 - expoIn(span(t, a.sets - .3, a.sets + .4))));
    // c09: what the copy says, then the fake chain
    const k2o = 1 - expoIn(span(t, a.version - .4, a.version + .2));
    words(ctx, 'DO IT NOW', 1065, 360, 62, rise(span(t, a.doNow - .1, a.doNow + .5)) * k2o, { col: COPY.text, align: 'right' });
    words(ctx, 'DON’T TELL ANYONE', 1065, 446, 62, rise(span(t, a.tell - .2, a.tell + .4)) * k2o, { col: COPY.text, align: 'right' });
    const cho = 1 - sineIO(span(t, a.realFBI - .2, a.realFBI + .7));
    const c1u = rise(span(t, a.bankCalls - .1, a.bankCalls + .5)) * cho, c2u = rise(span(t, a.agent + .1, a.agent + .7)) * cho, c3u = rise(span(t, a.speak - .1, a.speak + .5)) * cho;
    words(ctx, 'THE BANK', 1065, 330, 48, c1u, { col: P.core0, align: 'right' });
    words(ctx, 'VIDEO CALL', 1065, 440, 48, c2u, { col: P.core0, align: 'right' });
    words(ctx, 'DON’T SPEAK TO ANYONE', 1065, 550, 48, c3u, { col: P.core0, align: 'right' });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (c2u > 0) F.accentSpan(ctx, [[1040, 350], [1040, 392]], 0, span(t, a.agent - .1, a.agent + .4), { col: COPY, w: 1.6, spark: false, a: cho });
    if (c3u > 0) F.accentSpan(ctx, [[1040, 460], [1040, 502]], 0, span(t, a.speak - .3, a.speak + .2), { col: COPY, w: 1.6, spark: false, a: cho });
    ctx.restore();
    F.source(ctx, t, a.version + .2, a.realFBI + .5, F.SOURCES.fbiChicago);
    // C10: the quote card grows out of the dark video screen and back into it
    const m10 = sineIO(span(t, a.c10s - .5, a.c10s)) * (1 - sineIO(span(t, a.c10e, a.c10e + .5)));
    if (m10 > 0 && PHONE) {   // the card keeps growing a little while it holds (a slow push, never a frozen slide); the label keeps its own timing
      const mm = m10 * (.97 + .03 * sineIO(span(t, a.c10s, a.c10e))), lab = span(t, a.c10s + .15, a.c10s + 1) * (1 - span(t, a.c10e - .5, a.c10e + .1));
      F.clipFrame(ctx, t, T, 'C10', { from: PHONE, morph: mm, label: span(mm, .85, 1) > 0 ? Math.min(1, lab / span(mm, .85, 1)) : 0 });
    }
    // c10 sources
    F.source(ctx, t, a.share + .2, a.missing + .2, F.SOURCES.ftcShare);
    // c10 kitchen: A PLAN, MADE ON A CALM DAY · HURRY + SECRET / + MONEY = STOP
    const pO = 1 - expoIn(span(t, a.agree4 - .3, a.agree4 + .3));
    words(ctx, 'A PLAN,', 520, 140, 60, rise(span(t, a.plan - .1, a.plan + .5)) * pO);
    words(ctx, 'MADE ON A CALM DAY', 520, 205, 44, rise(span(t, a.madeOn - .1, a.madeOn + .5)) * pO, { col: GOLD.text });
    const hO = 1 - expoIn(span(t, a.dollar - .4, a.dollar + .2));
    words(ctx, 'HURRY + SECRET', 830, 160, 56, rise(span(t, a.hurry - .1, a.hurry + .6)) * hO);
    words(ctx, '+ MONEY = STOP', 830, 232, 56, rise(span(t, a.plusMoney - .1, a.plusMoney + .6)) * hO, { col: GOLD.text });
    // c11: the action plan
    const apO = 1 - expoIn(span(t, a.comm - .1, a.comm + .6));
    words(ctx, 'ACTION PLAN', 1065, 330, 80, rise(span(t, a.aplan - .1, a.aplan + .5)) * apO, { align: 'right' });
    words(ctx, 'WHAT TO DO', 1065, 430, 44, rise(span(t, a.what - .1, a.what + .5)) * apO, { col: GOLD.text, glow: false, align: 'right' });
    words(ctx, 'WHO TO CALL', 1065, 500, 44, rise(span(t, a.who - .1, a.who + .5)) * apO, { col: GOLD.text, glow: false, align: 'right' });
    words(ctx, 'HOW TO VERIFY', 1065, 570, 44, rise(span(t, a.verify - .1, a.verify + .5)) * apO, { col: GOLD.text, glow: false, align: 'right' });
    F.source(ctx, t, a.ftc + .6, a.comm + .4, F.SOURCES.ftcPlan);
    // C1: Meador (ORIGINAL FOOTAGE, contain) out of her phone screen and back
    const m1 = sineIO(span(t, a.c1s - .9, a.c1s)) * (1 - sineIO(span(t, a.c1e, a.c1e + .8)));
    if (m1 > 0 && PHONE) F.clipFrame(ctx, t, T, 'C1', { from: PHONE, morph: m1 });
  };

  return (ctx, t) => {
    if (t < a.s3in) { S.plateLine(ctx, t, T, 3); return; }      // the seam with B1: exactly what c06 draws
    if (t >= a.s5) { S.plateLine(ctx, t, T, 5); return; }        // the seam with B3: exactly what c12 draws
    let c = S.camPath(t, K); c = S.drift(c, t, 3000, 1.2 * dAmp(t), 66);
    const { p, m } = portalAt(t);
    PHONE = null;
    if (m < 1) S.lineWorld(ctx, c, t, { ...state(t, c), extra: (cx, out) => worldExtra(cx, out, c, t) });
    if (m > 0) {
      const from = (p.kind === 'room' ? D.townWinRect(c) : S.winRect(c)) || { x: W / 2 - 2, y: H / 2 - 2, w: 4, h: 4 };
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, m, (cx, w, h) => (p.kind === 'room' ? roomInside(cx, w, h, t) : kitchenInside(cx, w, h, t, p)), { rim: LAMP, r: 12 * (1 - m), glow: m < .98 });
    }
    overlays(ctx, t, c);
  };
}
const TAU = Math.PI * 2;
