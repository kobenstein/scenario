// Film 25 · builder B3 · the master take for c08–c11 ('Number two' → end, incl. the 15 s end screen).
// ONE continuous draw function shared by scenes/sc08 … sc11.mjs, so the inner chunk boundaries (c08/c09 at the flood peak of the
// second light door, c09/c10 on the push at No. 1, c10/c11 under the shrinking K3 plate) are identical frames by construction.
// Plan + beat tables: in the scene files. Anchors are phrases only (T.G with fences), slots via T.clip. Worlds:
//   A  the RANK ROW (lib/f25_seams.mjs RANKROW, rank-row design px) · window fly-in through stone No. 2 into the night rooms
//   B  the STUDIO (F.studio, studio design px), reached through light door W1 (No. 1 → TOPIC header) and left through W2 (TOPIC → No. 1)
//   C  the ROW WORLD (ROW1 + ROW2, row-world design px) for the ending; entered under the K3 plate while the camera is up in the sky
//      (both worlds share F.sky with S.SKY_GLOW, so the switch frame is identical).
// Living holds: every camera carries A.live (slow incommensurate truck/rise/push) on top of camDrift; it is 0 on the seam plate
// and while the window fills the frame, so those hand-overs stay exact. The Microsoft slabs hang on a deep card (ZS) because the
// pull-out out of No. 2 crosses the F0 plane.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
import * as S from './f25_seams.mjs';
import * as A from './f25_b3_art.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo } = E;
const { rise, maskLine, F0 } = F;
const { C, RR } = A;
const TAU = Math.PI * 2;

// K3: 'clip' (the Gates footage in the plate) or 'card' (F.QUOTES.gates in the same plate). F25_K3=card|clip overrides.
export const k3Mode = (T) => process.env.F25_K3 || (T.clip('K3') ? 'clip' : 'card');

const CACHE = new WeakMap();
export function makeB3(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after);
  const a = {};
  // ---- c08
  a.two = G('Number two'); a.care = G('Care', a.two); a.nurse = G('The nurse who turns', a.two); a.turns = G('turns', a.nurse);
  a.kids = G('The person who looks after', a.nurse); a.ms = G("In Microsoft's study", a.two); a.nursing = G('nursing assistants', a.ms);
  a.bottom = G('very bottom', a.ms); a.almost = G('Almost nothing they do', a.ms); a.here = G('Here, the human', a.ms); a.partOf = G('part of what', a.here);
  a.lasts = G('So the work that lasts', a.here); a.point = G('a person is the point', a.lasts); a.back = G('Which brings us back to Jakob', a.lasts);
  a.backE = GE('back to Jakob', a.back); a.because = G('Because by now', a.back); a.taken = G('had taken almost', a.because);
  a.J5 = T.clip('J5'); a.byhand = G('By hand, one film', a.because); a.weeks = G('two weeks', a.byhand); a.agents = G('Now agents do the production', a.byhand);
  a.direction = G('He gives the direction', a.agents); a.left = G("So what's left when", a.direction); a.goneE = GE('doing is gone', a.left);
  // ---- c09
  a.one = G("Number one isn't"); a.want = G("It's the one where we want", a.one); a.purpose = G('On purpose', a.want);
  a.chess = G('Computers have beaten', a.one); a.thirty = G('thirty years', a.chess); a.bigger = G('And chess has never', a.chess);
  a.tenM = G('About ten million', a.bigger); a.machines = G('Machines play each other', a.tenM); a.crowds = G('The crowds come', a.machines);
  a.sits = G("It's the person who sits", a.crowds); a.sitsW = G('sits with you', a.sits); a.signs = G('The one who signs off', a.sits); a.decides = G('The one who decides', a.signs);
  a.those = G("Those aren't tasks", a.decides); a.theyre = G("They're tasks we want", a.those); a.last = G("The last human job isn't the one", a.theyre); a.wont = G("It's the one we won't", a.last);
  // ---- c10
  a.stay = G('So how do you stay'); a.first = G('First, judgment', a.stay); a.telling = G('Telling good', a.first); a.good = G('good', a.telling); a.finished = G('finished', a.telling);
  a.senior = G('the senior who can', a.first); a.diff = G('tell the difference', a.senior); a.button = G('It protects you from being swapped', a.first); a.buttonW = G('button', a.button);
  a.second = G('Second, directing', a.first); a.stepsW = G('steps', a.second); a.handing = G('handing them to agents', a.second); a.checking = G('checking what comes back', a.second);
  a.jakobDoes = G("That's what Jakob does", a.second); a.runs = G('the one who runs it', a.second);
  a.third = G('Third, trust', a.second); a.buy = G('buy from people', a.third); a.hire = G('hire people', a.third); a.followW = G('follow people', a.third);
  a.rel = G('Relationships protect', a.third); a.price = G('compared on price', a.third);
  a.fourth = G('Fourth, hands', a.third); a.trade = G('A trade, with', a.fourth); a.pocket = G('in your pocket', a.fourth); a.robot = G('the robot', a.fourth);
  a.arrives = G('And when it arrives', a.fourth); a.run = G('has to run it', a.arrives);
  a.fifth = G('And fifth, learning', a.fourth); a.oneNew = G('One new step', a.fifth); a.takesOld = G('takes the old one', a.fifth); a.protects5 = G('It protects you from waking', a.fifth);
  a.gates = G('Even Bill Gates', a.fifth); a.matterE = GE('the steps matter', a.gates);
  // ---- c11
  a.every = T.G('Every time the machine took a step', 1); a.tookUp = G('the human took one up', a.every); a.waiting = G("So the last human job isn't waiting", a.every);
  a.next = G("It's the step you take next", a.waiting); a.stepW = G('step', a.next); a.J6 = T.clip('J6');
  a.channel = G('This channel exists so that', a.next); a.everyone = G('everyone', a.channel); a.subscribe = G('Then subscribe', a.channel); a.vend = GE('Then subscribe', a.channel);
  a.end = T.duration;
  // K3 slot (or a card window if the audio drops the clip slot)
  const k3 = T.clip('K3');
  a.k3 = k3 ? { start: k3.start, end: k3.end } : { start: a.matterE + .5, end: Math.max(a.matterE + 7.5, a.every - 1.4) };
  a.k3mode = k3Mode(T);
  const draw = scene(a, T);
  CACHE.set(T, draw);
  return draw;
}

// flood ramp of a light door peaking at tp (both sides draw a = 1 at the peak; 1.4 s ramps pass smooth.py, as in sc01)
const flood = (t, tp, rOut = 1.4) => (t < tp ? smooth(span(t, tp - 1.4, tp)) : 1 - smooth(span(t, tp, tp + rOut)));

function scene(a, T) {
  const T0 = a.two, r2 = F.rankAt(T, 2);
  // ============================================================================================ c08 · world A (rank row) + window
  const creepCam = (t) => { const dt = t - (T0 - S.SEAM_HALF); return C(1350 + S.TRUCK * dt, 620, .66 * (1 + S.CREEP * dt)); };
  const ANG2 = .12, s2 = RR[1], win = A.stoneWindow(s2, ANG2, { vk: .74, wr: .8 });
  const tD0 = a.care + .25, tD1 = tD0 + 3.3;                    // dive into No. 2's window
  const tO0 = a.ms - .25, tO1 = tO0 + 4.4;                      // pull back out of it, up to the slabs
  const tIn0 = tD1, tIn1 = tO0;                                 // scene-only interval (the window covers the frame)
  const SL = C(1460, -150, 1.0), HC = C(2340, -230, 1.3), KR = C(880, 560, .9);
  const ZS = 4500;   // depth of the Microsoft slabs card; SLO shifts the design coords so that at SL the slabs sit exactly where F0 would put them
  const SLO = (() => { const mF = E.cardM(SL, F0), mZ = E.cardM(SL, ZS); return [(mF.e - mZ.e) / mZ.k, (mF.f - mZ.f) / mZ.k]; })();
  const No1F = A.faceOf(RR[0]), tf1 = a.backE + .2, tf2 = a.one;
  const fall3 = (t) => lerp(.035 + .012 * Math.sin(t * 2.3), .34, sineIO(span(t, a.lasts + .3, a.lasts + 1.7)));
  const rankFallC08 = (t) => (n) => (n === 1 ? 0 : n === 2 ? ANG2 * smooth(span(t, r2 + .1, r2 + 1.1)) : n === 3 ? fall3(t) : S.rankLie(n));
  const rankFallLate = (t) => (n) => (n === 1 ? 0 : n === 2 ? ANG2 : n === 3 ? .34 + .006 * Math.sin(t * 1.9) : S.rankLie(n));
  const KA = [[tO1, SL], [a.here - .2, C(1480, -160, 1.06)], [a.here + 2.4, HC], [a.lasts - .1, C(2345, -235, 1.38)], [a.lasts + 2.6, KR], [a.back - .1, C(760, 600, 1.06)]];
  function camRankA(t) {
    if (t < tD0) return creepCam(t);
    // the dive and the pull-out keep the window's centre on a straight screen path (no late swing), scale in log space
    if (t < tD1) { const u = span(t, tD0, tD1); return A.screenLerp(s2.Z, win.centre, creepCam(tD0), win.cam(1), sineIO(u ** .8), sineIO(clamp(u * 1.3))); }
    if (t < tO1) { const u = span(t, tO0, tO1); return A.screenLerp(s2.Z, win.centre, win.cam(1), SL, sineIO(u), sineIO(u)); }
    if (t < a.back - .1) return F.camPath(t, KA);
    return E.camAt(t, [[a.back - .1, KA[KA.length - 1][1]], [tf1, C(No1F[0], No1F[1], 18), 'i']]);
  }
  // the inner scene camera (night rooms)
  const KS = [[tD0, C(1000, 640, 1.0)], [a.turns, C(1010, 645, 1.06)], [a.kids - .1, C(1030, 650, 1.1)], [a.kids + 2.4, C(2560, 660, 1.08)], [tO0, C(2600, 665, 1.14)]];
  const camRoom = (t) => A.live(E.camDrift(F.camPath(t, KS), t, .5, 11), t, .45, 11);
  // the outer rank-row camera with its living hold: fades in after the seam plate, out while diving into the window, back after the pull-out
  // (both drifts are 0 at the seam plate and while the window fills the frame, so the plate and the room hand over exactly)
  const liveA = (t) => smooth(span(t, T0 + S.SEAM_HALF, T0 + 2.6)) * (1 - smooth(span(t, tD0, tD1 - .4)) * (1 - smooth(span(t, tO0, tO1 + 1))));
  const camA = (t) => { const w = liveA(t); return A.live(E.camDrift(camRankA(t), t, .6 * w, 5), t, .85 * w, 5); };
  // the outer transform when the room fills the frame: relax from the window's cover scale/roll to identity, and back before leaving
  function roomFull(ctx, t) {
    const u = sineIO(span(t, tIn0, tIn0 + 1.6)) * (1 - sineIO(span(t, tIn1 - 1.2, tIn1))), k = lerp(win.cover, 1, u), roll = lerp(win.roll, 0, u);
    E.withOuter({ k, e: W / 2 - W / 2 * k, f: H / 2 - H / 2 * k }, () => A.nurseRoom(ctx, { ...camRoom(t), roll }, t, roomState(t)));
  }
  const roomState = (t) => ({ turn: span(t, a.turns - .2, a.turns + 1.9), lamp: 1, night: 1 });
  // the Microsoft slabs (sky over the rank row, F0 card): INTERPRETERS top … NURSING ASSISTANTS near the very bottom
  const SLAB = { x: 1060, y: -500, pitch: 52, th: 24, len: 880, v: [1, .94, .88, .8, .7, .58, .45, .32, .2, .1, .05], nurse: 9 };
  const slabY = (k) => SLAB.y + k * SLAB.pitch;
  const LP = [2340, -205];   // where the gift light rests (between the hands)
  function slabs(ctx, t) {
    const n = SLAB.v.length, back = expoIn(span(t, a.here - .1, a.here + 1.1));
    for (let k = 0; k < n; k++) {
      if (k === SLAB.nurse) continue;
      const u = span(t, a.ms + .5 + k * .12, a.ms + 1.5 + k * .12) * (1 - back);
      if (u <= 0) continue;
      F.slab(ctx, t, SLAB.x, slabY(k), SLAB.len * SLAB.v[k], SLAB.th, { col: k < 5 ? 'cool' : 'stone', u, label: k === 0 ? 'INTERPRETERS' : null, a: 1 - .35 * smooth(span(t, a.almost, a.almost + 1)) });
    }
    // NURSING ASSISTANTS: grows with the others, lights warm on "very bottom", then lifts off and rounds into the gift light
    const k = SLAB.nurse, u = span(t, a.ms + .5 + k * .12, a.ms + 1.5 + k * .12), warm = smooth(span(t, a.bottom - .2, a.bottom + .5));
    const lift = sineIO(span(t, a.here, a.here + 2.3));
    if (u > 0 && lift < .25) F.slab(ctx, t, SLAB.x, slabY(k), SLAB.len * SLAB.v[k] * (1 - lift * 4), SLAB.th, { col: warm > .5 ? 'warm' : 'stone', u });
    if (u > 0) maskLine(ctx, [['NURSING ASSISTANTS', warm]], SLAB.x - 22 - F.measure('NURSING ASSISTANTS', 26, false), slabY(k) + 9, 26, rise(span(t, a.nursing, a.nursing + .7)) * (1 - expoIn(span(t, a.here, a.here + .6))), { serif: false, weight: 600, col: warm > .5 ? F.WARM.text : P.cream, glow: false });
  }
  // the nurse slab's light, flying from the slab (deep card ZS) to LP on the F0 card: its start is re-projected through the current camera
  function slabOrb(ctx, t, c) {
    const k = SLAB.nurse, lift = sineIO(span(t, a.here, a.here + 2.3));
    if (lift > 0 && lift < 1) {
      const mZ = E.cardM(c, ZS), mF = E.cardM(c, F0); if (!mZ || !mF) return;
      const p0 = [(mZ.e + (SLAB.x + 40 + SLO[0]) * mZ.k - mF.e) / mF.k, (mZ.f + (slabY(k) + SLO[1]) * mZ.k - mF.f) / mF.k], m = [lerp(p0[0], LP[0], .5), Math.min(p0[1], LP[1]) - 260];
      const q = (u) => [(1 - u) ** 2 * p0[0] + 2 * u * (1 - u) * m[0] + u * u * LP[0], (1 - u) ** 2 * p0[1] + 2 * u * (1 - u) * m[1] + u * u * LP[1]];
      const [x, y] = q(lift); A.orb(ctx, t, x, y, lerp(10, 18, lift), smooth(clamp(lift * 4)));
    }
  }
  // the two hands (8.04) and the gift light that later drops into No. 1
  // 8.04: the gift light settles between two people on a light line in the sky: one gives, one receives; the light warms them both
  const LY = -60, GX = [2170, 2510];
  function hands(ctx, t) {
    const lu = sineIO(span(t, a.here + .1, a.here + 1.5));
    if (lu > 0) F.rule(ctx, 1940, LY, 2740, LY, lu, { w: 2 });
    const drop = sineIO(span(t, a.lasts, a.lasts + 2.5));
    const lp = drop > 0 ? arcPt(LP, No1F, -700, drop) : [LP[0] + 3 * Math.sin(t * 1.3), LP[1] + 3 * Math.sin(t * 1.7)];
    const warm = smooth(span(t, a.here + 2.2, a.here + 3.2)) * (1 - .5 * smooth(span(t, a.lasts, a.lasts + 2))), share = smooth(span(t, a.partOf - .3, a.partOf + .9));
    GX.forEach((x0, j) => {
      const d = j ? -1 : 1, wu = sineIO(span(t, a.here + .5 + j * .25, a.here + 2.3 + j * .25)); if (wu <= 0) return;
      const x = lerp(x0 - d * 260, x0, wu), ph = 280;
      const rim = mixHex(P.blue0, P.halo0, j ? warm * share : warm);
      if (wu < 1) { E.person(ctx, x, LY, ph, { pose: 'walk', walk: wu * 5 + j, dir: d, light: d, rim }); return; }
      const up = j ? share : smooth(span(t, a.here + 2.0, a.here + 2.9));
      A.person(ctx, t, x, LY, ph, { dir: d, light: d, rim, look: .05, lean: .06 * up, armR: [lerp(.2, 1.3, up), lerp(.1, 1.75, up)], armL: [lerp(-.2, 1.15, up), lerp(-.1, 1.7, up)] }, 6 + j);
    });
    if (t >= a.here + 2.3 && drop < 1) A.orb(ctx, t, lp[0], lp[1], 18 * (1 - drop * drop * .85));
  }
  // ============================================================================================ c08 · world B (studio)
  const TOPICH = [F.STUDIO.head.x0 + 34, F.laneMid(8)];
  const tTiles = a.byhand + .3, tileX = (k) => 770 - k * 48, TILE_Y = 515;
  const KB = [[tf1 + 3.0, C(1110, 330, .92)], [a.J5.start, C(1170, 270, 1.15)], [a.J5.end, C(1180, 262, 1.26)], [a.byhand + 2.3, C(790, 520, 1.0)],
    [a.agents + 1.4, C(610, 610, 1.08)], [a.direction + 1.8, C(1010, 320, .96)], [a.left + 1.4, C(1000, 235, 1.12)], [a.goneE + .1, C(960, 210, 1.28)]];
  function camStudio(t) {
    if (t < tf1 + 3.0) return E.camAt(t, [[tf1, C(TOPICH[0], TOPICH[1], 18)], [tf1 + 3.0, KB[0][1], 'o']]);
    if (t < a.goneE + .1) return F.camPath(t, KB);
    return E.camAt(t, [[a.goneE + .1, KB[KB.length - 1][1]], [tf2, C(TOPICH[0], TOPICH[1], 18), 'i']]);
  }
  function studio(ctx, t) {
    const c = A.live(E.camDrift(camStudio(t), t, .6, 7), t, .85, 7);
    const idea = span(t, a.taken - .3, a.taken + 2.4), level = 2 + sineIO(span(t, a.because + 1.4, a.J5.start - .1));
    const lit = new Array(9).fill(0); lit[8] = .45 + .55 * smooth(span(t, a.left, a.left + 1.2));
    const st = F.studio(ctx, c, t, { taken: [1, 1, 1, 1, 1, 1, 1, idea, 0], level, conduct: smooth(span(t, a.J5.start - .4, a.J5.start + .9)), beads: 1, lampA: .3, lit, work: .6 });
    E.card(ctx, c, F0, () => tiles(ctx, t, st));
    return c;
  }
  // 14 warm day tiles fly out of the desk lamp (by hand: two weeks); one cool tile is laid by a bead (now: one day)
  function tiles(ctx, t, st) {
    const [lx, ly] = F.STUDIO.lamp;
    for (let k = 0; k < 14; k++) {
      const u = sineIO(span(t, tTiles + k * .16, tTiles + k * .16 + .75)); if (u <= 0) continue;
      const [x, y] = arcPt([lx - 10, ly], [tileX(k), TILE_Y], -110, u), s = 40 * lerp(.25, 1, u);
      ctx.fillStyle = E.lin(ctx, 0, y - s / 2, 0, y + s / 2, [[0, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 6); ctx.fill();
    }
    maskLine(ctx, [['14 DAYS', 0]], tileX(13) - 20, TILE_Y + 70, 28, rise(span(t, a.weeks - .1, a.weeks + .6)), { serif: false, weight: 600, col: F.WARM.text, glow: false });
    // the bead: from the IDEA lane down to the slot under the tiles, lays one cool tile
    const b0 = st.laneBead?.[7] || [1500, F.laneMid(7)], slot = [tileX(13), TILE_Y + 150];
    const ub = sineIO(span(t, a.agents - .1, a.agents + 1.3));
    if (ub > 0 && t < a.direction + 4) {
      const lay = expoOut(span(t, a.agents + 1.2, a.agents + 1.7)), s = 40 * lay;
      if (lay > 0) { ctx.fillStyle = E.lin(ctx, 0, slot[1] - s / 2, 0, slot[1] + s / 2, [[0, mixHex(F.COOL.body, P.cream, .3)], [1, F.COOL.deep]]); ctx.beginPath(); ctx.roundRect(slot[0] - s / 2, slot[1] - s / 2, s, s, 6); ctx.fill(); }
      const lift = sineIO(span(t, a.agents + 1.6, a.agents + 3.2)), p = lift > 0 ? arcPt(slot, [b0[0] - 200, b0[1] - 60], -160, lift) : arcPt(b0, [slot[0], slot[1] - 34], -260, ub);
      if (lift < 1) F.agent(ctx, t, p[0], p[1], 10, { ring: 1, think: .4 });
      maskLine(ctx, [['1 DAY', 0]], slot[0] + 44, slot[1] + 10, 28, rise(span(t, a.agents + 1.5, a.agents + 2.2)), { serif: false, weight: 600, col: F.COOL.text, glow: false });
    } else if (t >= a.direction + 4) {
      ctx.fillStyle = E.lin(ctx, 0, slot[1] - 20, 0, slot[1] + 20, [[0, mixHex(F.COOL.body, P.cream, .3)], [1, F.COOL.deep]]); ctx.beginPath(); ctx.roundRect(slot[0] - 20, slot[1] - 20, 40, 40, 6); ctx.fill();
      maskLine(ctx, [['1 DAY', 0]], slot[0] + 44, slot[1] + 10, 28, 1, { serif: false, weight: 600, col: F.COOL.text, glow: false });
    }
  }

  // ============================================================================================ c09 · world A again (No. 1, chess, three stones)
  const KO = C(760, 610, 1.0), CH = C(900, -380, 1.0), CW = C(1000, -430, .8), C3 = C(2200, -400, 1.0), KE = C(700, 610, 1.1);
  const KC = [[tf2 + 2.3, KO], [a.want + 2.4, C(700, 640, 1.06)], [a.chess - .1, C(690, 640, 1.1)], [a.chess + 2.3, CH], [a.bigger - .2, C(915, -390, 1.06)],
    [a.bigger + 2.6, CW], [a.crowds + 1.8, C(1010, -430, .84)], [a.sits - .3, C(1040, -420, .86)], [a.sits + 2.3, C3], [a.those, C(2210, -400, 1.04)],
    [a.last - .1, C(2220, -405, 1.07)], [a.last + 2.7, KE], [a.stay + .3, C(690, 615, 1.17)]];
  // c10 (continues the same path): five stones rise out of No. 1, then one skill after another along the index row in the sky
  const IX = (k) => 760 + k * 260, IXY = -330, IXH = 140, SK = (k, s = 1) => C(IX(k) + 480, -680, s);
  const starts = () => [a.first, a.second, a.third, a.fourth, a.fifth];
  const ST = starts(), EN = [a.second, a.third, a.fourth, a.fifth, a.gates];
  const KD = [[a.stay + .3, C(690, 615, 1.17)], [Math.min(a.stay + 3.3, ST[0] - 1.2), C(1150, 250, .72)], [ST[0] - .4, C(1170, 200, .74)]];   // real timing: 'First, judgment' follows 'So how do you stay' after 3.2 s, keep the keys in order
  for (let k = 0; k < 5; k++) { KD.push([ST[k] + 1.7, SK(k)]); KD.push([EN[k] - .5, SK(k, 1.06)]); }
  const SKY = C(IX(4) + 480, -2500, 1.0), ER0 = C(1000, 560, 1.0);
  KD.push([a.k3.start + 1.5, SKY]); KD.push([a.k3.end - 3.2, C(IX(4) + 470, -2520, 1.01)]);
  const tSwitch = (a.k3.start + 1.5 + a.k3.end - 3.2) / 2;   // world A → world C while only the sky is in frame (under the plate)
  KD.push([a.k3.end + .1, ER0]);
  const KAll = [...KC, ...KD.slice(1)];
  const camA2 = (t) => (t < tf2 + 2.3 ? E.camAt(t, [[tf2, C(No1F[0], No1F[1], 18)], [tf2 + 2.3, KO, 'o']]) : F.camPath(t, KAll));
  // du at No. 1: walks in on "It's the one where we want a human", later walks on along the row (10.01)
  function duA(ctx, t) {
    const u1 = sineIO(span(t, a.want - .3, a.want + 2.3)), u2 = sineIO(span(t, a.stay + .1, a.stay + 2.5));
    const x = lerp(-180, 420, u1) + lerp(0, 400, u2), moving = (u1 > 0 && u1 < 1) || (u2 > 0 && u2 < 1);
    if (u1 <= 0) return;
    if (moving) E.du(ctx, x, 905, 150, { pose: 'walk', walk: (u1 * 600 + u2 * 400) / 150 * 1.9, dir: 1, light: 1 });
    else A.du(ctx, t, x, 905, 150, { look: u2 >= 1 ? .2 + .5 * smooth(span(t, a.stay + 2.6, a.stay + 3.6)) : .3 + .4 * smooth(span(t, a.purpose, a.purpose + 1)), light: u2 >= 1 ? -1 : 1, dir: u2 >= 1 ? -1 : 1 });
  }
  // chess (9.03–9.05): the piece lifts off No. 1's face, a cool bead topples it (1997), the game grows (≈10 MILLION A DAY),
  // machines play each other at an empty board, the crowd gathers round the two people
  const BD = [900, -330], PC = [830, -380], BEAD = [985, -372], MB = [330, -330];
  const tb = Math.max(a.chess + 2.1, T.G('beaten', 0, a.chess) + .2);
  const CROWD = (() => { const r = E.prng(9025), out = []; for (let i = 0; i < 240; i++) {
    let x, y; do { x = 40 + r() * 1880; y = -880 + r() * 640; } while (Math.abs(x - BD[0]) < 260 && Math.abs(y - BD[1]) < 120);
    const ang = Math.PI * (1.05 + r() * .9), rr = .75 + r() * .5;
    out.push({ x, y, d: Math.hypot(x - BD[0], (y - BD[1]) * 1.6), tx: BD[0] + Math.cos(ang) * (230 + 230 * rr) * (r() < .5 ? 1 : 1), ty: BD[1] + 30 + Math.sin(ang) * (110 + 120 * rr), s: 20 + r() * 8, ph: r() * 6 }); }
    out.sort((p, q) => p.d - q.d); return out; })();
  function chess(ctx, t) {
    if (t < a.chess - .2 || t > a.last + 3) return;
    // the boards
    const ub = expoOut(span(t, a.chess + .6, a.chess + 1.5));
    if (ub > 0) { ctx.save(); ctx.translate(BD[0], BD[1]); ctx.scale(ub, 1); ctx.translate(-BD[0], -BD[1]); A.board(ctx, BD[0], BD[1], 380, 1, smooth(span(t, a.bigger, a.bigger + 1))); ctx.restore(); }
    const um = expoOut(span(t, a.machines + .2, a.machines + 1.1));
    if (um > 0) { ctx.save(); ctx.translate(MB[0], MB[1]); ctx.scale(um, 1); ctx.translate(-MB[0], -MB[1]); A.board(ctx, MB[0], MB[1], 300, 1, 0); ctx.restore(); }
    // the piece: lifts off No. 1's face (drawn there in the row), flies to the board, topples at tb, stands again on "never been bigger"
    const fly = sineIO(span(t, a.chess + .3, a.chess + 1.9));
    if (fly > 0) {
      const top = Math.min(1, Math.max(0, (t - tb) / .55) ** 2) * (1 - sineIO(span(t, a.bigger, a.bigger + 1)));
      const p = fly < 1 ? arcPt([No1F[0], No1F[1] - 80], PC, -500, fly) : PC, sz = lerp(70, 100, fly), base = [p[0] + sz * .3, p[1] + sz * .5];
      ctx.save(); ctx.translate(base[0], base[1]); ctx.rotate(-top * Math.PI / 2 * .96); ctx.translate(-base[0], -base[1]);
      F.glyph(ctx, 'chess', p[0], p[1], sz, { lit: 1 - .7 * top, glow: 1 }); ctx.restore();
    }
    // the bead: drops from the sky, nudges the piece, slides to the machine board, clones there
    const ud = expoOut(span(t, a.chess + .9, a.chess + 2.0));
    if (ud > 0) {
      const nudge = bumpUp(t, tb - .45, .5) * -26, toM = sineIO(span(t, a.bigger, a.bigger + 1.6));
      const b = toM > 0 ? arcPt(BEAD, [MB[0] + 70, MB[1] - 40], -140, toM) : [lerp(1150, BEAD[0], ud) + nudge, lerp(-900, BEAD[1], ud)];
      F.agent(ctx, t, b[0], b[1], 14, { ring: 1, think: toM >= 1 ? .5 : 0 });
      const cl = expoOut(span(t, a.machines + .4, a.machines + 1.4));
      if (cl > 0) F.agent(ctx, t, lerp(MB[0] + 70, MB[0] - 90, cl), MB[1] - 40, 14 * cl, { ring: cl, think: .5 });
    }
    // two people at the human board (walk in on "never been bigger"); the crowd
    const wi = sineIO(span(t, a.bigger + .1, a.bigger + 1.9));
    if (wi > 0) {
      const xl = lerp(470, 660, wi), xr = lerp(1340, 1140, wi), walking = wi < 1;
      for (const [x, d, sd] of [[xl, 1, 1], [xr, -1, 2]]) {
        if (walking) E.person(ctx, x, BD[1] + 40, 150, { pose: 'walk', walk: wi * 6 + sd, dir: d, light: -d });
        else A.person(ctx, t, x, BD[1] + 40, 150, { dir: d, light: -d, lean: .18, look: -.2, armR: [.9, 1.3] }, sd);
      }
    }
    const spread = span(t, a.tenM - .2, a.tenM + 2.4), gather = span(t, a.crowds - .3, a.crowds + 2.6), toStones = sineIO(span(t, a.sits - .1, a.sits + 2.0));
    if (spread > 0) {
      ctx.save();
      CROWD.forEach((f, i) => {
        const e = expoOut(clamp((spread - i / CROWD.length * .7) / .3)); if (e <= 0) return;
        const g = sineIO(clamp((gather - (i % 17) / 17 * .4) / .6));
        let x = lerp(lerp(BD[0], f.x, e), f.tx, g), y = lerp(lerp(BD[1], f.y, e), f.ty, g);
        // early on, the figures near the machine board turn away from it
        if (f.x < 620 && t > a.machines) x += 120 * sineIO(span(t, a.machines + .3, a.machines + 2.2)) * (1 - g);
        A.tinyFig(ctx, x + 1.5 * Math.sin(t * 1.1 + f.ph), y, f.s * e, undefined, 1 - .65 * toStones);
      });
      ctx.restore();
    }
    // labels: 1997 (beside the board, on "thirty years"), ≈10 MILLION A DAY (over the crowd)
    const u97 = rise(span(t, a.thirty - .2, a.thirty + .6)) * (1 - expoIn(span(t, a.bigger + .2, a.bigger + .8)));
    if (u97 > 0) maskLine(ctx, [['1997', 0]], BD[0] + 250, BD[1] - 20, 96, u97, {});
    const um2 = rise(span(t, a.tenM, a.tenM + .8)) * (1 - expoIn(span(t, a.sits - .2, a.sits + .4)));
    if (um2 > 0) { const w0 = F.measure('≈', 60, false, 400) + 8, w1 = F.measure('10 MILLION', 84, true), x0 = BD[0] - (w0 + w1 + 150) / 2;
      maskLine(ctx, [['≈', 1]], x0, -768, 60, um2, { serif: false, weight: 400 }); maskLine(ctx, [['10 MILLION', 1]], x0 + w0, -760, 84, um2, {});
      maskLine(ctx, [['A DAY', 0]], x0 + w0 + w1 + 22, -762, 34, rise(span(t, a.tenM + .3, a.tenM + 1.1)) * (1 - expoIn(span(t, a.sits - .2, a.sits + .4))), { serif: false, weight: 600, glow: false, col: F.WARM.text }); }
  }
  // the three amber stones (9.06–9.08): rise on their words from a light line, COULD outlines, then fly into No. 1
  const TS = [{ x: 1960, g: 'person', at: () => a.sitsW }, { x: 2200, g: 'draft', at: () => a.signs + .3 }, { x: 2440, g: 'topic', at: () => a.decides + .4 }], TSY = -200, TSH = 270;
  function three(ctx, t) {
    if (t < a.sits - .4 || t > a.last + 3) return;
    const lu = sineIO(span(t, a.sits - .2, a.sits + 1.5)) * (1 - expoIn(span(t, a.last + .2, a.last + 1.2)));
    if (lu > 0) F.rule(ctx, BD[0] + 200, TSY, 2620, TSY, lu, { w: 2 });
    const could = expoOut(span(t, a.those + .2, a.those + 1.0)), warmer = smooth(span(t, a.theyre, a.theyre + 1));
    TS.forEach((s, j) => {
      const ru = span(t, s.at(), s.at() + 1.1); if (ru <= 0) return;
      const fly = sineIO(span(t, a.last + .2 + j * .3, a.last + 2.3 + j * .3)); if (fly >= 1) return;
      const ang = (Math.PI / 2 - .015) * (1 - riseHeavy(ru)), w = TSH * .3;
      const p = fly > 0 ? arcPt([s.x, TSY], [No1F[0] - 30, No1F[1] + 60], -420, fly) : [s.x, TSY], k = 1 - .85 * fly;
      ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(k, k);
      if (could > 0 && fly < .2) { ctx.save(); ctx.strokeStyle = rgba(F.COOL.body, (.85 - .45 * warmer) * could); ctx.lineWidth = 3; ctx.setLineDash([9, 7]); ctx.lineDashOffset = -t * 9;
        const pad = 14 * could; ctx.beginPath(); ctx.roundRect(-pad - 4, -TSH - pad, w + 2 * pad + 12, TSH + 2 * pad - 6, 8); ctx.stroke(); ctx.restore(); }
      F.stone(ctx, t, 0, 0, TSH, { w, fall: ang, gold: lerp(.8, 1, warmer), face: (cx, fw, fh) => goldGlyph(cx, s.g, fw, fh) });
      ctx.restore();
    });
    if (could > 0) maskLine(ctx, [['COULD', 0]], 2200 + TSH * .15, TSY - TSH - 60, 30, rise(could) * (1 - expoIn(span(t, a.last, a.last + .6))), { serif: false, weight: 600, align: 'center', col: F.COOL.text, glow: false });
  }
  // No. 1 flares when the stones / the gift light arrive
  const flareNo1 = (t) => Math.max(bumpUp(t, a.lasts + 2.3, 1.2), ...TS.map((s, j) => bumpUp(t, a.last + 2.2 + j * .3, 1.0)), bumpUp(t, a.stay + 1.5, 1.2) * .6);
  // c10: the five skill stones (index row in the sky) and their explainers
  const TITLES = ['JUDGMENT', 'DIRECTING', 'TRUST', 'HANDS + HEAD', 'STEPS'];
  function skills(ctx, t) {
    if (t < a.stay + 1) return;
    const plate = a.k3.start + 2;   // after this nothing of the skill field is in frame
    if (t > a.k3.end + 2) return;
    // index row: five warm mini stones rise out of No. 1 to their places
    for (let k = 0; k < 5; k++) {
      const u = sineIO(span(t, a.stay + 1.5 + k * .22, a.stay + 3.7 + k * .22)); if (u <= 0) continue;
      const p = u < 1 ? arcPt([No1F[0] - 20, No1F[1]], [IX(k), IXY], -380 - k * 60, u) : [IX(k), IXY], sc = lerp(.12, 1, u);
      const on = smooth(span(t, ST[k], ST[k] + .6)), off = smooth(span(t, EN[k], EN[k] + .6));
      const gold = lerp(1, .55, smooth(clamp((u - .7) / .3))) + .45 * on - .2 * off;
      ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(sc, sc);
      F.stone(ctx, t, 0, 0, IXH, { w: IXH * .3, gold, num: k + 1, numA: .95 });
      ctx.restore();
    }
    for (let k = 0; k < 5; k++) {
      const g = expoOut(span(t, ST[k] + .25, ST[k] + 1.3)) * (1 - expoIn(span(t, EN[k] - .55, EN[k] + .35)));
      if (g <= 0) continue;
      const fx = IX(k) + IXH * .15, fy = IXY - IXH * .56, ax = IX(k) + 620, ay = -900;
      ctx.save(); ctx.translate(fx, fy); ctx.scale(g, g); ctx.translate(-fx, -fy);
      // title: number + word
      const tu = rise(span(t, ST[k] + .3, ST[k] + 1.1));
      maskLine(ctx, [[String(k + 1), 1]], IX(k) - 330, -1110, 110, tu, {});
      maskLine(ctx, [[TITLES[k], 0]], IX(k) - 330 + F.measure(String(k + 1), 110) + 26, -1125, 40, rise(span(t, ST[k] + .5, ST[k] + 1.3)), { serif: false, weight: 600, glow: false });
      SKILL[k](ctx, t, ax, ay);
      ctx.restore();
    }
    void plate;
  }
  const SKILL = [
    // 1 JUDGMENT: finished (cool) vs good (warm); the senior points at the good one; a button glides in and stops short
    (ctx, t, ax, ay) => {
      const r1 = span(t, a.telling, a.telling + 1.0), r2 = span(t, a.good - .1, a.good + .9), gl = smooth(span(t, a.good, a.good + .8)) + .3 * bumpUp(t, a.diff, 1.2);
      if (r1 > 0) F.stone(ctx, t, ax - 330, ay + 250, 290, { w: 88, fall: (Math.PI / 2 - .015) * (1 - riseHeavy(r1)), glyph: 'draft', dark: .1 });
      if (r2 > 0) F.stone(ctx, t, ax - 70, ay + 250, 290, { w: 88, fall: (Math.PI / 2 - .015) * (1 - riseHeavy(r2)), gold: clamp(gl), face: (cx, fw, fh) => goldGlyph(cx, 'topic', fw, fh) });
      const wu = sineIO(span(t, a.senior - .5, a.senior + 1.3));
      if (wu > 0) { const x = lerp(ax - 760, ax - 520, wu); if (wu < 1) E.person(ctx, x, ay + 250, 215, { pose: 'walk', walk: wu * 5, dir: 1, light: 1 });
        else { const pt = smooth(span(t, a.diff - .2, a.diff + .5)); A.person(ctx, t, x, ay + 250, 215, { dir: 1, light: 1, look: .1, armR: [lerp(.2, 1.75, pt), lerp(.1, 1.85, pt)] }, 4); } }
      const bu = expoOut(span(t, a.button, a.buttonW - .1)), back = sineIO(span(t, a.buttonW + .3, a.buttonW + 1.6));
      if (bu > 0) F.agent(ctx, t, lerp(ax + 760, ax + 300, bu) + 160 * back, ay + 60 - 10 * Math.sin(t * 1.4), 24, { ring: 1, think: .3 });
    },
    // 2 DIRECTING: a goal (star) splits into four steps, handed to four beads, checked back; Jakob conducts
    (ctx, t, ax, ay) => {
      const sg = expoOut(span(t, a.second + .4, a.second + 1.3)), jd = sineIO(span(t, a.jakobDoes, a.jakobDoes + 1.3));
      const star = [ax - 330, lerp(ay + 10, ay - 150, jd)];
      F.glyph(ctx, 'topic', star[0], star[1], lerp(130, 80, jd) * sg, { lit: 1 });
      for (let j = 0; j < 4; j++) {
        const slot = [ax - 80, ay - 135 + j * 90], bead = [ax + 270, ay - 135 + j * 90];
        const out = sineIO(span(t, a.stepsW - .3 + j * .09, a.stepsW + .6 + j * .09)); if (out <= 0) continue;
        const bd = expoOut(span(t, a.handing - .2 + j * .1, a.handing + .7 + j * .1));
        if (bd > 0) { ctx.strokeStyle = rgba(F.COOL.line, .35 * bd); ctx.lineWidth = 2; ctx.setLineDash([4, 8]); ctx.beginPath(); ctx.moveTo(slot[0] + 30, slot[1]); ctx.lineTo(bead[0] - 22, bead[1]); ctx.stroke(); ctx.setLineDash([]); }
        const go = sineIO(span(t, a.handing + .3 + j * .1, a.handing + 1.2 + j * .1)), ret = sineIO(span(t, a.checking + j * .12, a.checking + 1.0 + j * .12));
        const p0 = arcPt(star, slot, -60, out), x = lerp(lerp(p0[0], bead[0] - 40, go), slot[0], ret), y = lerp(p0[1], slot[1], 0) - 26 * Math.sin(Math.PI * go) + 26 * Math.sin(Math.PI * ret);
        const cool = go > .95 && ret < .95, s = 44;
        ctx.fillStyle = cool ? E.lin(ctx, 0, y - s / 2, 0, y + s / 2, [[0, mixHex(F.COOL.body, P.cream, .3)], [1, F.COOL.deep]]) : E.lin(ctx, 0, y - s / 2, 0, y + s / 2, [[0, P.halo0], [1, P.shade0]]);
        ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 6); ctx.fill();
        if (ret > .9) halo(ctx, slot[0], slot[1], 70, .25 * bumpUp(t, a.checking + 1.0 + j * .12, .8), P.halo1, P.halo0);
        if (bd > 0) F.agent(ctx, t, bead[0], lerp(ay - 700, bead[1], bd), 14, { ring: 1, think: .3 + .4 * smooth(span(t, a.runs, a.runs + .6)) * (.5 + .5 * Math.sin(t * 1.7 + j)) });
      }
      if (jd > 0) { const x = lerp(ax - 760, ax - 330, jd), walking = jd < 1;
        if (walking) F.jakob(ctx, t, x, ay + 260, 190, { walk: jd * 6, dir: 1, light: 1 });
        else F.jakob(ctx, t, x, ay + 260, 190, { conduct: smooth(span(t, a.jakobDoes + 1.3, a.jakobDoes + 2.2)), dir: 1, light: 1 }); }
    },
    // 3 TRUST: three people linked by warm threads (buy · hire · follow); a cool bead outside the triangle
    (ctx, t, ax, ay) => {
      const X = [ax - 400, ax - 80, ax + 240], by = ay + 250, ph = 200;
      X.forEach((x0, j) => { const wu = sineIO(span(t, a.third + .1 + j * .3, a.third + 1.6 + j * .3)); if (wu <= 0) return;
        const x = lerp(x0 - 300, x0, wu), d = j === 0 ? 1 : -1;
        if (wu < 1) E.person(ctx, x, by, ph, { pose: 'walk', walk: wu * 5 + j, dir: 1, light: 1 });
        else A.person(ctx, t, x, by, ph, { dir: d, light: -d, look: .05 }, 5 + j); });
      const ch = by - ph * .66, rel = .6 + .4 * smooth(span(t, a.rel, a.rel + 1));
      const th = [[0, 1, a.buy, -60], [1, 2, a.hire, -60], [2, 0, a.followW, -170]];
      for (const [i, j, tw, bend] of th) { const u = sineIO(span(t, tw - .05, tw + .7)); if (u <= 0) continue;
        const p = [X[i], ch], q = [X[j], ch], pts = []; for (let k = 0; k <= 24; k++) { const [x, y] = arcPt(p, q, bend, k / 24); pts.push([x, y, 3]); }
        E.trail(ctx, pts, u, { w: 3, a: rel }); }
      const pu = expoOut(span(t, a.price - .6, a.price + .5));
      if (pu > 0) F.agent(ctx, t, lerp(ax + 760, ax + 520, pu), ay + 40 + 6 * Math.sin(t * 1.3), 20, { ring: 1, think: .2 });
    },
    // 4 HANDS + HEAD: a tradesperson with a wrench, a cool bead in the pocket; the basement pipe and the torch circle; the bead he runs
    (ctx, t, ax, ay) => {
      const by = ay + 260, ph = 230, wu = sineIO(span(t, a.fourth + .1, a.fourth + 1.6)), x = lerp(ax - 640, ax - 330, wu);
      const pipe = sineIO(span(t, a.robot - .4, a.robot + .7)), pj = [ax + 200, ay + 110];
      if (pipe > 0) { const bx = ax - 150, bw = lerp(0, 780, pipe), bt = ay + 10; ctx.fillStyle = E.lin(ctx, 0, bt, 0, by, [[0, mixHex(P.night0, P.ind0, .3)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fillRect(bx, bt, bw, by - bt);
        ctx.fillStyle = rgba(P.blue1, .5); ctx.fillRect(bx, bt, bw, 3); ctx.fillRect(bx, by - 2, bw, 3); }
      if (pipe > 0) { ctx.strokeStyle = mixHex(P.blue1, P.ind2, .3); ctx.lineCap = 'round'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(ax - 80, pj[1]); ctx.lineTo(lerp(ax - 80, ax + 560, pipe), pj[1]); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pj[0], pj[1]); ctx.lineTo(pj[0], lerp(pj[1], by, pipe)); ctx.stroke(); ctx.fillStyle = mixHex(P.blue1, P.halo1, .2); ctx.fillRect(pj[0] - 18, pj[1] - 18, 36, 36); }
      const torch = expoOut(span(t, a.robot + .2, a.robot + 1.0)), point = smooth(span(t, a.run - .3, a.run + .4));
      let hands = null;
      if (wu > 0) { if (wu < 1) hands = E.person(ctx, x, by, ph, { pose: 'walk', walk: wu * 5, dir: 1, light: 1 });
        else hands = A.person(ctx, t, x, by, ph, { dir: 1, light: 1, look: -.05, armR: [lerp(1.0, 1.7, point), lerp(1.4, 1.8, point)], armL: [lerp(-.2, .9, torch), lerp(-.1, 1.2, torch)] }, 8); }
      if (hands && torch > 0) { const hx = hands.L[0], hy = hands.L[1]; ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = E.lin(ctx, hx, 0, pj[0], 0, [[0, rgba(P.halo0, .22 * torch)], [1, rgba(P.halo1, .08 * torch)]]); ctx.beginPath(); ctx.moveTo(hx, hy - 6); ctx.lineTo(pj[0] - 4, pj[1] - 70 * torch); ctx.lineTo(pj[0] - 4, pj[1] + 70 * torch); ctx.lineTo(hx, hy + 6); ctx.closePath(); ctx.fill(); ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, pj[0], pj[1], 80 * torch, [[0, rgba(P.core1, .65)], [.6, rgba(P.halo0, .35)], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.ellipse(pj[0], pj[1], 80 * torch, 70 * torch, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      if (hands) { const wr = expoOut(span(t, a.trade, a.trade + .6)); if (wr > 0) F.glyph(ctx, 'wrench', hands.R[0] + 10, hands.R[1] - 14, 52 * wr, { lit: 1 }); }
      const pk = expoOut(span(t, a.pocket - .1, a.pocket + .6));
      if (pk > 0 && wu >= 1) F.agent(ctx, t, x + 24, by - ph * .42 - 10 * pk, 8 * pk, { ring: pk, think: .3 });
      const ar = expoOut(span(t, a.arrives, a.arrives + 1.3)), go = sineIO(span(t, a.run - .1, a.run + 1.1));
      if (ar > 0) F.agent(ctx, t, lerp(lerp(ax + 760, ax + 420, ar), pj[0] + 6, go), lerp(pj[1] - 60, pj[1] - 4, go), 18, { ring: 1, think: .3 + .4 * go });
    },
    // 5 STEPS: a model takes the old step (a cool bead lands, the stone falls), you step onto the next (it lights)
    (ctx, t, ax, ay) => {
      const by = ay + 260, n = 5, sx = (j) => ax - 520 + j * 230, BEATS = [a.oneNew + .35, a.takesOld + .15, a.protects5 + .6, a.protects5 + 2.4];
      F.rule(ctx, ax - 600, by, ax + 600, by, sineIO(span(t, a.fifth + .3, a.fifth + 1.3)), { w: 2 });
      let pos = 0; BEATS.forEach((b) => { pos += sineIO(span(t, b + .45, b + 1.4)); });
      for (let j = 0; j < n; j++) {
        const up = span(t, a.fifth + .5 + j * .08, a.fifth + 1.4 + j * .08); if (up <= 0) continue;
        const b = BEATS[j], fallU = b != null ? clamp((t - b) / .5) ** 2 : 0, cur = clamp(pos + 1 - j) * clamp(j - pos + 1);
        F.stone(ctx, t, sx(j), by, 140, { w: 42, fall: fallU > 0 ? (Math.PI / 2 - .015) * fallU : (Math.PI / 2 - .015) * (1 - riseHeavy(up)), gold: fallU > 0 ? 0 : .15 + .7 * cur, dark: .25 * fallU, glyph: fallU > 0 ? 'draft' : null });
        if (b != null) { const d = expoIn(span(t, b - .55, b)), lift = sineIO(span(t, b + .1, b + 1.5)); if (d > 0 && lift < 1) F.agent(ctx, t, sx(j) + 22 - 30 * lift, lerp(by - 520, by - 150, d) - 300 * lift, 12 * (1 - lift * .7), { ring: 1 - lift }); }
      }
      const x = lerp(sx(0) + 90, sx(4) + 90, pos / 4), moving = BEATS.some((b) => t > b + .45 && t < b + 1.4);
      const ew = rise(span(t, a.fifth + .6, a.fifth + 1.4)); if (ew <= 0) return;
      if (moving) E.du(ctx, x, by, 120, { pose: 'walk', walk: pos * Math.PI * 2, dir: 1, light: -1 });
      else A.du(ctx, t, x, by, 120, { look: .2, light: -1 });
    },
  ];

  // ============================================================================================ K3 (clip or card), c11 · world C
  const CARD = F.QUOTES.gates;
  function k3plate(ctx, t, c) {
    const s5 = [IX(4) + IXH * .15, IXY - IXH * .56];
    const grow = span(t, a.gates + .2, Math.min(a.matterE + .1, a.k3.start - .05)), shrink = span(t, a.k3.end, a.k3.end + 1.2);
    if (grow <= 0 || shrink >= 1) return;
    let from;
    if (shrink > 0) { const f = A.faceOf(S.ROW1.stones[0]); const p = E.project(c, F0, f[0], f[1]); from = [p[0], p[1], 3]; }
    else { const p = E.project(c, F0, s5[0], s5[1]); from = [p[0], p[1], 4]; }
    const morph = shrink > 0 ? 1 - shrink : grow;
    if (a.k3mode === 'clip') F.clipPlate(ctx, t, T, 'K3', { from, morph });
    else {
      const r = F.clipPlate(ctx, t, T, 'K3', { from, morph, dark: 1, credits: false });
      const u = span(morph, .85, 1); if (u <= 0) return;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(r.cx - r.w / 2, r.cy - r.h / 2, r.w, r.h); ctx.clip();
      const t0 = Math.max(a.k3.start - .6, a.matterE), t1 = a.k3.end - .55;
      F.quote(ctx, t, { text: CARD.lines.join(' '), marks: CARD.quoted ? undefined : false, x: 960, y: 430, w: 1340, size: 58, align: 'center', t0, t1, attr: CARD.attr, gold: [[CARD.gold, t0 + 2.2]] });
      ctx.restore();
    }
  }
  // c11 camera (row world). ER0 is reached under the K3 plate; the end screen keeps both lights in the left third
  const ENDC = C(4995, -1500, .2);
  const KE11 = [[a.k3.end + .1, ER0], [a.tookUp + 1.4, C(985, 570, 1.07)], [a.waiting + .2, C(1000, 566, 1.09)], [a.waiting + 3.3, C(2300, 600, .72)],
    [a.next + 1.6, C(1850, 560, .56)], [a.J6.start + 3.0, C(2250, 520, .5)], [a.channel + 1.6, C(3000, 300, .34)], [a.vend + 1.4, ENDC]];
  const endCreep = (t) => { const dt = t - (a.vend + 1.4); return C(4995 - 4 * dt, -1500 - 3 * dt, .2 * (1 + .004 * dt)); };
  const camC = (t) => (t < a.vend + 1.4 ? F.camPath(t, KE11) : endCreep(t));
  function rowsEnd(ctx, t, cam) {
    const stepU = sineIO(span(t, a.stepW - .15, a.stepW + .95)), walking = stepU > 0 && stepU < 1;
    A.rowsBoth(ctx, cam, t, {
      a1: S.ROW1_FALLEN, a2: S.ROW2_FALLEN, cool1: S.ROW1.stones.map(() => 1), cool2: S.ROW2.stones.map((s) => (s.i ? 1 : 0)),
      du: { x: S.DU1.x + 95 * stepU, walk: walking ? stepU * Math.PI : null, look: .3 + .35 * smooth(span(t, a.tookUp, a.tookUp + 1.2)) - .2 * smooth(span(t, a.waiting, a.waiting + 1.5)) },
      jakob: { look: .15 }, under: (c) => A.horizonLamps(ctx, c, t, a.channel + .4, a.subscribe + 1.8),
    });
    // the stone of light answers "the human took one up"
    const fl = Math.max(bumpUp(t, a.tookUp, 1.6), bumpUp(t, a.k3.end + .9, 1.1)); if (fl > 0) E.card(ctx, cam, F0, () => { const f = A.faceOf(S.ROW1.stones[0]); halo(ctx, f[0], f[1], 900, .18 * fl, P.halo1, P.halo0); });
  }

  // ============================================================================================ the master draw
  return (ctx, t) => {
    // --- c08 seam: the plate for [T0, T0 + .5)
    if (t < T0 + S.SEAM_HALF) { S.plateRankRow(ctx, t, T); return; }
    // --- c08 world A (rank row, window, slabs, hands) until the first light door
    if (t < tf1) {
      const inRoom = t >= tIn0 && t < tIn1;
      if (inRoom) roomFull(ctx, t);
      else {
        const c = camA(t), ang = rankFallC08(t);
        A.rankWorld(ctx, c, t, { fall: ang, each: (i) => (i === 1 ? { glyphWarm: smooth(span(t, a.care - .15, a.care + .3)), glyphA: 1 - smooth(span(t, a.care + .1, a.care + .7)) * (1 - smooth(span(t, tO0 + 1.9, tO0 + 2.8))) } : i === 0 ? { rim: 1 } : null) });
        const fl1 = Math.max(bumpUp(t, a.lasts + 2.3, 1.2), 0);
        if (fl1 > 0) E.card(ctx, c, F0, () => halo(ctx, No1F[0], No1F[1], 700, .25 * fl1, P.halo1, P.halo0));
        E.card(ctx, c, ZS, () => { ctx.save(); ctx.translate(SLO[0], SLO[1]); slabs(ctx, t); ctx.restore(); });   // the slabs hang deep in the sky: the pull-out crosses the F0 plane, never theirs
        E.card(ctx, c, F0, () => { slabOrb(ctx, t, c); hands(ctx, t); });
        // the window in No. 2 (open from "Care" until the pull-back has climbed away)
        const open = expoOut(span(t, a.care - .05, a.care + .8)) * (1 - expoIn(span(t, tO0 + 1.7, tO0 + 2.7)));
        if (open > 0 && t < tO1) A.drawWindow(ctx, win.geom(c), open, (roll) => A.nurseRoom(ctx, { ...camRoom(t), roll }, t, roomState(t)));
        F.source(ctx, t, a.ms + .9, a.here + .6, F.SOURCES.microsoft);
      }
      F.rankTitle(ctx, t, 1180, 330, 2, 'CARE', rise(span(t, T0 + .15, T0 + .95)) * (1 - expoIn(span(t, tD0 + .3, tD0 + .9))));
      F.rankRail(ctx, t, T);
      E.lightFlood(ctx, flood(t, tf1));
      return;
    }
    // --- c08 world B (studio) until the second light door (= the c08/c09 boundary)
    if (t < tf2) {
      studio(ctx, t);
      F.lowerThird(ctx, t, T, 'J5', { y: 170 });
      F.rankRail(ctx, t, T);
      E.lightFlood(ctx, flood(t, tf1, 2.2) + flood(t, tf2));   // W1 exit 2.2 s: the bright studio zooms out under the light
      return;
    }
    // --- c09 + c10 world A (No. 1, chess, three stones, the five skills) until the world switch under the K3 plate
    if (t < tSwitch) {
      const c = A.live(E.camDrift(camA2(t), t, .6, 9), t, 1, 9);
      const fl = flareNo1(t);
      const showChessFace = span(t, a.chess - .15, a.chess + .25) * (1 - span(t, a.chess + .3, a.chess + .5));
      A.rankWorld(ctx, c, t, { fall: rankFallLate(t), each: (i) => (i === 0 && showChessFace > 0 ? { face: (cx, fw, fh) => goldGlyph(cx, 'chess', fw, fh, showChessFace) } : null) });
      E.card(ctx, c, F0, () => {
        if (fl > 0) halo(ctx, No1F[0], No1F[1], 760, .28 * fl, P.halo1, P.halo0);
        duA(ctx, t); chess(ctx, t); three(ctx, t); skills(ctx, t);
      });
      F.rankTitle(ctx, t, 1120, 320, 1, 'WHERE WE WANT A HUMAN', rise(span(t, tf2 + .6, tf2 + 1.4)) * (1 - expoIn(span(t, a.chess - .3, a.chess + .3))));
      F.source(ctx, t, a.thirty - .2, a.bigger + 2.2, F.SOURCES.kasparov);
      F.source(ctx, t, a.tenM + .6, a.crowds + 1.6, F.SOURCES.chess);
      if (t < a.stay + 1) F.rankRail(ctx, t, T, { a: 1 - expoIn(span(t, a.stay, a.stay + .7)) });
      k3plate(ctx, t, c);
      E.lightFlood(ctx, flood(t, tf2));
      return;
    }
    // --- c10 tail + c11 world C (the ending rows, J6, subscribe 2, end screen)
    const cam = A.live(E.camDrift(t < a.k3.end + .1 ? F.camPath(t, KAll) : camC(t), t, .5, 13), t, 1 - .7 * smooth(span(t, a.subscribe, a.subscribe + 3)), 13);
    rowsEnd(ctx, t, cam);
    k3plate(ctx, t, cam);
    F.lowerThird(ctx, t, T, 'J6', { y: 170 });
  };
}

// ---------------------------------------------------------------------------------------------------------------- small helpers
// point on a quadratic arc from p to q, bulging by `bend` px (negative = up), at u
function arcPt(p, q, bend, u) {
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + bend];
  return [(1 - u) ** 2 * p[0] + 2 * u * (1 - u) * m[0] + u * u * q[0], (1 - u) ** 2 * p[1] + 2 * u * (1 - u) * m[1] + u * u * q[1]];
}
// a soft one-shot bump 0 → 1 → 0 starting at t0, length d
function bumpUp(t, t0, d) { const u = span(t, t0, t0 + d); return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u) ** 2; }
// a heavy stone standing up: slow start, settles with a tiny overshoot
function riseHeavy(u) { u = clamp(u); return u >= 1 ? 1 : 1 - (1 - sineIO(u)) - .03 * Math.sin(Math.PI * clamp((u - .7) / .3)); }
// a task glyph on a gold face, in gold shadow (readable on light). Used as F.stone o.face callback (ctx is clipped to the face)
function goldGlyph(ctx, name, w, h, a = 1) {
  if (a <= 0) return;
  const s = w * .62, p = new Path2D(); p.addPath(F.glyphPath(name), { a: s, b: 0, c: 0, d: s, e: w * .5, f: -h * .74 });
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = mixHex(P.shade0, P.night1, .25); ctx.fill(p, 'evenodd'); ctx.restore();
}
