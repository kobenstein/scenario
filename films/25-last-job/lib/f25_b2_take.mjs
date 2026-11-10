// Film 25 · builder B2 · ONE continuous take for c05 + c06 + c07 ("So here's the puzzle" → 'Number two').
// The three chunk files each return one entry whose draw is this take; the inner boundaries are therefore seamless by construction
// (c05|c06 sits on the flood peak of a light door, c06|c07 inside one camera move on the rank row).
//
// worlds (in order) and how they connect (docs/shots.md 5.01–7.15):
//   STUDIO (plateStudio → push on Jakob) ─window out of his ledge light→ READING ROOM (lightbox, Hinton card, tiles, record line,
//   radiologist + surgeon, TALK/DECIDE/ANSWER FOR IT) ─pull back: the room is the face of ONE wide stone on the night plain → it splits
//   into four task stones (scan, talk, decide, carry) ★ → the scan stone falls, she steps up onto it ─light door (TALK glyph = ledge
//   light)→ STUDIO (J4: storyboard + script taken, he climbs to ledge 2; the core sentence) ─light door (ledge light = ridge lamp)→
//   THE RIDGE at the horizon of the rank-row plain (subscribe 1: the light passes from lamp to lamp) ─one move: the ridge sinks into
//   the horizon→ THE RANK ROW (what is left standing glows · No. 6 + the workflow chain + Amodei card + FORECAST/MEASURED · No. 5 window
//   → classroom · No. 4 window → bedside · No. 3 windows → flooded basement | clean factory → torch circle = K2 plate → No. 3 trembles)
//   → plateRankRow. Hard world changes: 2 (both light doors).
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
import * as S from './f25_seams.mjs';
import * as B from './f25_b2_lib.mjs';
import * as SC from './f25_b2_scenes.mjs';
const { W, H, P, rgba, clamp, lerp, span, smooth, sineIO, expoOut, expoIn } = E;
const { rise, F0 } = F;
// F.maskLine + align 'right' (x = the right edge)
const maskLine = (ctx, segs, x, y, size, u, o = {}) => (o.align === 'right'
  ? F.maskLine(ctx, segs, x - segs.reduce((w, [s]) => w + F.measure(s, size, o.serif ?? true, o.weight), 0), y, size, u, { ...o, align: undefined }) : F.maskLine(ctx, segs, x, y, size, u, o));
const RS = B.RS;
const C = (u, v, s) => E.aim(F0, u, v, s);

let OFF = null;   // offscreen for the K2 plate's first moments
const CACHE = new Map();
export function take(T) { if (!CACHE.has(T)) CACHE.set(T, build(T)); return CACHE.get(T); }

function build(T) {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.puzzle = G("So here's the puzzle"); a.prof = G("There's a profession"); a.in2016 = G('In 2016, Geoffrey Hinton'); a.stop = G('stop training', a.in2016);
  a.partly = G('He was partly right'); a.machinesNow = G('Machines now read'); a.andYet = G('And yet, this year'); a.record = G('than ever before', a.andYet);
  a.hosp = G("Hospitals can't find"); a.because = G('Because a radiologist never'); a.talk = G('talk to the surgeon'); a.decide = G('They decide what');
  a.carry = G('They carry the'); a.dominoes = G('So the dominoes were never'); a.tasks = G("They're tasks"); a.tookPart = G('The machine took over part');
  a.reading = G('reading', a.tookPart); a.kept = G('The radiologist kept'); a.movedUp = G('moved up', a.kept);
  a.J4 = T.clip('J4'); a.every = G('Every time the machine took a step'); a.stepE = GE('took a step', a.every); a.oneUp = G('took one up', a.every);
  a.channel = G('This channel exists for one reason'); a.soThat = G('so that the arrival'); a.notJust = G('Not just for a few'); a.subscribe = G('Then subscribe');
  a.fromHere = G('From here on'); a.howMuch = G("It's how much of it"); a.six = G('Number six'); a.agentsArrive = G('This is where the agents arrive');
  a.notTools = G('Not tools that help'); a.systems = G('but systems that run'); a.finish = GE('start to finish'); a.labChief = G('One lab chief'); a.half = G('half of all', a.labChief);
  a.forecast = G("That's a forecast"); a.soFar = G('So far, the data'); a.butIf = G('But if agents can run'); a.touch = GE("they can't touch");
  a.five = G('Number five'); a.teachers = G('Teachers'); a.explain = G('can already explain'); a.anyLang = GE('in any language');
  a.childNot = G("But a child doesn't learn"); a.believed = G('A child learns because'); a.explFalls = G('The explaining falls'); a.fallsW = G('falls', a.explFalls); a.believingStays = G('The believing stays');
  a.four = G('Number four'); a.doctors = G('Doctors'); a.diagnosis = G('More and more of the diagnosis'); a.machineW = G('machine', a.diagnosis); a.justScan = G('Just like the scan');
  a.someone = G('But someone still has to sit'); a.hard = G('the hard sentence'); a.stay = G('And stay in the room'); a.slows = G('And then the row slows down'); a.hands = G('Because the next jobs need hands');
  a.three = G('Number three. The trades'); a.electrician = G('The electrician'); a.plumber = G('The plumber'); a.roofer = G('The roofer');
  a.easy = G("What's easy for us"); a.climbing = G('Climbing into a flooded'); a.rusted = G('rusted pipe'); a.humanoid = G('The first humanoid robots');
  a.clean = G('Clean floors'); a.basementNot = G('Your basement is not'); a.evenMan = G('Even the man who warned'); a.K2 = T.clip('K2');
  a.notice = G('Notice the catch'); a.longTime = G('A long time', a.notice); a.notForever = G('Not forever', a.notice); a.holds = G('Number three holds'); a.end = G('Number two');

  // ---------------------------------------------------------------------------------------------------------- key times
  const tPlA = a.puzzle + S.SEAM_HALF;          // plateStudio until here
  const tW0 = a.prof - 1.2, tW1 = a.prof + 3.4;  // fly into the reading-room window (out of Jakob's ledge light)
  const tPB0 = a.dominoes - .2;                 // pull back out of the room: it is the face of one wide stone
  const tp1 = a.J4.start - .05;                 // light door 1: TALK glyph → Jakob's ledge light (studio)
  const tp2 = a.channel;                        // light door 2: Jakob's ledge light → the ridge lamp (= the c05|c06 boundary)
  const tC0 = a.explain - .3, tC1 = a.explain + 2.6, tC2 = a.believingStays - .1, tC3 = a.four + 2.0;     // classroom window
  const tB0 = a.someone - .5, tB1 = a.someone + 2.3, tB2 = a.slows - .5, tB3 = a.hands + .5;               // bedside window
  const tBa0 = a.easy - .1, tBa1 = a.climbing - .05, tBa2 = a.humanoid - .3;                            // basement window
  const tBb0 = a.basementNot - .7, tBb1 = a.evenMan - .1;                                                 // back into the basement
  const K2s = a.K2.start, K2e = a.K2.end;
  const tPl = a.end - S.SEAM_HALF;              // plateRankRow from here

  // ---------------------------------------------------------------------------------------------------------- THE STUDIO (c05 start, J4)
  const LEDGE = (lv) => { const p = F.jakobPos(lv); return [p.x + 20, p.y - F.STUDIO.jakobH * .5]; };
  const L1 = LEDGE(1), L2 = LEDGE(2);
  const RW = { x: 1420 - 160, y: 330 - 90, w: 320, h: 180 };     // the reading-room window (studio card F0)
  const plateCam = (t) => { const k = S.creep(t, T, "So here's the puzzle"); return C(960 + S.TRUCK * (k - 1) / S.CREEP, 540, k); };
  const KS1 = [[tPlA, plateCam(tPlA)], [a.puzzle + 2.6, C(1080, 450, 1.3)], [tW0, C(1205, 365, 1.75)]];
  const studio1Cam = (t) => {
    if (t < tW0) { const p = F.camPath(t, KS1), u = smooth(span(t, tPlA, tPlA + 1.6)); return B.blend(plateCam(t), p, u); }
    return E.camAt(t, [[tW0, KS1[KS1.length - 1][1]], [tW1, B.fillCam(F0, RW), 's']]);
  };
  const KS2 = [[tp1 + 2.0, C(1160, 410, 1.28)], [a.J4.start + 4.2, C(1170, 300, 1.32)], [a.every - .1, C(1210, 340, 1.12)], [a.oneUp + .9, C(1205, 300, 1.2)], [tp2 - 1.9, C(1200, 290, 1.25)]];
  const studio2Cam = (t) => {
    const base = t < tp1 + 2.0 ? E.camAt(t, [[tp1, C(L1[0], L1[1], 18)], [tp1 + 2.0, KS2[0][1], 'o']])
      : t < tp2 - 1.9 ? F.camPath(t, KS2) : E.camAt(t, [[tp2 - 1.9, KS2[KS2.length - 1][1]], [tp2, C(L2[0], L2[1], 18), 'i']]);
    return B.breathe(base, t, .75 * smooth(span(t, tp1 + .5, tp1 + 2.2)) * (1 - smooth(span(t, tp2 - 1.1, tp2))), F0, 7);
  };
  function studio1(ctx, t) {
    if (t < tPlA) { S.plateStudio(ctx, t, T); return; }
    const c = studio1Cam(t), dr = B.breathe(c, t, .7 * smooth(span(t, tPlA, tPlA + 2)) * (1 - smooth(span(t, tW0, tW0 + 1))), F0, 7);
    F.studio(ctx, dr, t, { ...S.STUDIO_AFTER_J3B, ledgeLight: 1 + .8 * smooth(span(t, a.prof - 1.2, a.prof)) });
    const u = span(t, a.prof - .45, a.prof + .9);
    if (u > 0) B.portal(ctx, B.cardRect(dr, F0, B.openRect(RW, L1, u, 22)), (cx) => SC.radio(cx, t, radioIC(t), radioSt(t)), { r: lerp(40, 6, u) });
  }
  function studio2(ctx, t) {
    const c = studio2Cam(t);
    const u5 = span(t, a.J4.start + .8, a.J4.start + 2.8), u6 = span(t, a.J4.start + 2.4, a.J4.start + 4.4);
    const lv = 1 + span(t, a.J4.start + 1.9, a.J4.start + 5.5);
    F.studio(ctx, c, t, { taken: [1, 1, 1, 1, 1, u5, u6, 0, 0], level: lv, beads: 1, lampA: .35, conduct: 0,
      ledgeLight: 1 + .7 * F.bump(t, a.oneUp - .1, 1.6) + 1.2 * smooth(span(t, tp2 - 1.6, tp2)) });
    F.lowerThird(ctx, t, T, 'J4', { y: 170 });
  }

  // ---------------------------------------------------------------------------------------------------------- THE READING ROOM (inner)
  const RIK = [[tW0, B.IC(1290, 450, 1.55)], [tW1, B.IC(1250, 460, 1.32)], [a.in2016 + .4, B.IC(1010, 485, 1.0)], [a.partly - .2, B.IC(1080, 465, 1.14)],
    [a.partly + 1.0, B.IC(1320, 440, 1.5)], [a.andYet - .8, B.IC(1280, 448, 1.42)], [a.andYet + 2.0, B.IC(840, 515, 1.0)], [a.hosp + .2, B.IC(780, 490, 1.03)],
    [a.because - .2, B.IC(1180, 640, 1.0)], [a.because + 1.9, B.IC(1160, 600, .86)], [a.carry + .8, B.IC(1170, 590, .9)], [tPB0 - .2, B.IC(960, 540, 1.0)]];
  const radioIC = (t) => { const c = F.camPath(t, RIK); return t < tPB0 - .2 ? B.breathe(c, t, .7 * (1 - smooth(span(t, tPB0 - 1.2, tPB0 - .2))), F0, 5, .1) : c; };
  const readT = (k) => a.machinesNow - .1 + [0, 1, 2, 3, 7, 6, 5, 4].indexOf(k) * .3;
  const READ_ORDER = [0, 1, 2, 3, 7, 6, 5, 4];
  const STAY_WARM = new Set([2, 5]);
  const radX = (t) => B.track(t, [[a.because - .25, [-260, 0]], [a.because + 2.5, [1060, 0]]])[0];
  const surX = (t) => B.track(t, [[a.because + .9, [2200, 0]], [a.talk - .05, [1600, 0]]])[0];
  function radioSt(t) {
    const st = { split: span(t, a.partly + .1, a.partly + 1.4), cool: [], line: sineIO(span(t, a.andYet + .5, a.record + .5)), chairs: 1 };
    for (let k = 0; k < 8; k++) st.cool[k] = STAY_WARM.has(k) ? 0 : span(t, readT(k) + .05, readT(k) + .35);
    // the reading bead: drops in, reads the tiles in order, parks above the box, then floats away up
    const tb = a.machinesNow - .9;
    if (t > tb && t < a.andYet + 2.2) {
      const K = [[tb, [1330, -60]], ...READ_ORDER.map((k) => { const q = SC.TILE(k); return [readT(k), [q.x + q.w / 2, q.y + q.h * .45]]; }), [readT(4) + .9, [1320, 170]], [a.andYet + 2.2, [1180, -120]]];
      const p = B.track(t, K); st.bead = [p[0] + 3 * Math.sin(t * 2.1), p[1] + 3 * Math.sin(t * 1.7), t > readT(4) + .9 ? .5 : 0];
    }
    const rx = radX(t), walking = t > a.because - .25 && t < a.because + 2.5;
    const pt = smooth(span(t, a.decide - .1, a.decide + .7)) * (1 - smooth(span(t, a.carry + .6, a.carry + 1.5)));
    st.rad = { x: rx, walk: walking ? rx / 46 : undefined, look: .2 + .2 * pt, armR: [lerp(.25, 2.15, pt), lerp(.15, 2.3, pt)], a: t < a.tasks - .3 ? 1 : 0 };
    const sx = surX(t), sw = t > a.because + .9 && t < a.talk - .05;
    st.surg = { x: sx, walk: sw ? sx / 46 : undefined, look: .15 + .05 * Math.sin(t * .7) };
    st.mark = span(t, a.decide + .2, a.decide + 1.1);
    return st;
  }
  // screen overlays of the reading room (only while it fills the screen): Hinton card, record label + source, the three labels
  function radioOverlays(ctx, t) {
    const ic = radioIC(t);
    if (t > a.in2016 - .5 && t < a.partly + .6) {
      const q = F.QUOTES.hinton;
      F.quote(ctx, t, { text: q.lines.join(' '), x: 120, y: 330, size: 58, w: 760, t0: a.in2016 + .3, t1: a.partly - .2, gold: [[q.gold, a.stop]], attr: q.attr, marks: q.quoted !== false });
    }
    if (t > a.record - 1 && t < a.because + .6) {
      const pts = SC.LINE, hd = B.ipt(ic, 1, pts[pts.length - 1][0], pts[pts.length - 1][1]), u = B.inOut(t, a.record - .2, a.because + .3, .8, .6);
      maskLine(ctx, [['RECORD', 0]], hd[0] - 70, hd[1] + 30, 24, u, { serif: false, weight: 600, align: 'right', col: F.WARM.text, glow: false });
      maskLine(ctx, [['1,241', 1]], hd[0] - 70, hd[1] + 112, 84, B.inOut(t, a.record, a.because + .3, .8, .6), { align: 'right' });
      maskLine(ctx, [['US MATCH 2026', 0]], hd[0] - 70, hd[1] + 150, 22, B.inOut(t, a.record + .3, a.because + .3, .8, .6), { serif: false, weight: 600, align: 'right', col: P.halo2, glow: false });
    }
    F.source(ctx, t, a.andYet + 1.0, a.because + .2, F.SOURCES.radiology);
    const out = a.dominoes - .25;
    const rh = B.ipt(ic, 1, radX(t) + 10, SC.RFLOOR - 440 * .97), sh = B.ipt(ic, 1, surX(t) - 10, SC.RFLOOR - 450 * .97);
    const ut = B.inOut(t, a.talk + .25, out, .8, .5);
    if (ut > 0) {   // a dotted arc from mouth to mouth, bowing down under the lightbox; TALK below it
      const m0 = B.ipt(ic, 1, radX(t) + 26, SC.RFLOOR - 440 * .9), m1 = B.ipt(ic, 1, surX(t) - 26, SC.RFLOOR - 450 * .9), lb = B.ipt(ic, 1, 0, SC.LB.y + SC.LB.h + 60);
      const mx = (m0[0] + m1[0]) / 2, my = Math.max(lb[1], Math.max(m0[1], m1[1]) + 90);
      ctx.save(); ctx.strokeStyle = rgba(F.WARM.line, .85); ctx.lineWidth = 2.5; ctx.setLineDash([2, 9]); ctx.lineDashOffset = -t * 12; ctx.lineCap = 'round';
      const e = expoOut(ut); ctx.beginPath(); ctx.moveTo(m0[0], m0[1]); ctx.quadraticCurveTo(mx, my + 40, lerp(m0[0], m1[0], e), lerp(m0[1], m1[1], e)); ctx.stroke(); ctx.restore();
      B.tag(ctx, 'TALK', mx, my + 62, ut, { align: 'center' });
    }
    const T5 = SC.TILE(5), mk = B.ipt(ic, 1, T5.x + T5.w * .5, SC.LB.y + 4), mkE = B.ipt(ic, 1, T5.x + T5.w * .5 + 60, SC.LB.y - 64);
    F.label(ctx, mk[0], mk[1], 'DECIDE', null, B.inOut(t, a.decide + .35, out, .8, .5), { dx: mkE[0] - mk[0], dy: mkE[1] - mk[1] });
    F.label(ctx, rh[0] - 30, rh[1] + 40, 'ANSWER FOR IT', null, B.inOut(t, a.carry + .3, out, .8, .5), { dx: -90, dy: 120 });
  }

  // ---------------------------------------------------------------------------------------------------------- TASK WORLD (5.09–5.11)
  const BF = { x: 640, y: 365, w: 960, h: 540 };                 // the one wide stone's face (card F0): the room
  const TROW = F.row({ n: 4, x: 760, y: 905, h: 470, k: .84, gap: .42, w: .22 });
  const TGLY = ['scan', 'chat', 'decide', 'carry'];
  const TS = TROW.stones;
  const tSplit = a.tasks + .15;
  const pieceU = (j, t) => sineIO(span(t, tSplit + j * .09, tSplit + 1.3 + j * .09));
  const piece = (j, t) => { const u = pieceU(j, t), s = TS[j]; return { u, x: lerp(BF.x + 240 * j, s.x, u), y: lerp(905, s.y, u), h: lerp(540, s.h, u), w: lerp(240, s.w, u), Z: lerp(F0, s.Z, u) }; };
  const tFall = a.tookPart + 1.0, scanFall = (t) => B.fall1(t, tFall, TS[0].h);
  const TK = [[tPB0 + 2.7, C(1000, 600, .95)], [a.tookPart + .4, C(870, 630, 1.0)], [a.kept + .6, C(720, 650, 1.08)], [tp1 - 1.9, C(760, 630, 1.16)]];
  const g1 = [TS[1].x + TS[1].w / 2, TS[1].y - TS[1].h * .74];
  const taskCam = (t) => {
    const base = t < tPB0 + 2.7 ? E.camAt(t, [[tPB0, B.fillCam(F0, BF)], [tPB0 + 2.7, TK[0][1], 's']])
      : t < tp1 - 1.9 ? F.camPath(t, TK) : E.camAt(t, [[tp1 - 1.9, TK[TK.length - 1][1]], [tp1, E.aim(TS[1].Z, g1[0], g1[1], 18), 'i']], TS[1].Z);
    return B.breathe(base, t, .8 * smooth(span(t, tPB0 + 1.4, tPB0 + 3.2)) * (1 - smooth(span(t, tp1 - 1.1, tp1))), TS[1].Z, 3);
  };
  // the radiologist out on the plain: steps out of the window (down to the ground), walks left, turns, climbs onto the fallen scan stone
  const RAD_H = 220;
  function radOut(t) {
    const x0 = BF.x + 1060 * .5, y0 = BF.y + SC.RFLOOR * .5, tw = a.tasks - .3;
    const x = B.track(t, [[tw, [x0, 0]], [a.tasks + 2.6, [200, 0]], [a.kept + .3, [200, 0]], [a.kept + 1.4, [318, 0]], [a.movedUp - .3, [372, 0]]])[0];
    const yGround = lerp(y0, 905, sineIO(span(t, tw, tw + .6))), top = 905 - TS[0].w;
    const cu = span(t, a.kept + 1.4, a.movedUp - .3), y = cu > 0 ? lerp(905, top, sineIO(cu)) - 26 * Math.sin(Math.PI * cu) : yGround;
    const walkL = t > tw && t < a.tasks + 2.6, walkR = t > a.kept + .3 && t < a.kept + 1.4;
    return { x, y, dir: walkL ? -1 : 1, walk: walkL || walkR ? x / 22 : undefined, climb: cu > 0 && cu < 1 };
  }
  function taskWorld(ctx, t) {
    const c = taskCam(t);
    F.sky(ctx, c, t, { glow: [1100, 520, 900] }); F.plain(ctx, c, t);
    const close = span(t, a.tasks - .35, a.tasks + .45);   // the room's windows iris shut into the four glyphs
    for (let j = 3; j >= 0; j--) {
      const p = piece(j, t), ang = j === 0 ? scanFall(t) : 0;
      const coolU = j === 0 ? span(t, a.tookPart + .5, a.tookPart + .95) : 0;
      const warm = smooth(span(t, a.tasks - .1, a.tasks + .6)) * (1 - coolU);
      E.card(ctx, c, p.Z, () => {
        if (j === 0) F.pool(ctx, p.x - 120, p.y + 2, 320, 40, .5 * (1 - coolU) * span(t, a.tasks, a.tasks + 1));
        F.stone(ctx, t, p.x, p.y, p.h, { w: p.w, fall: ang, glyph: null, rim: 1 - .6 * clamp(ang), dark: .3 * coolU,
          face: (cx, w, h) => B.glyph(cx, TGLY[j], w * .5, -h * .74, w * .62, { lit: warm, glow: 1 + (j === 1 ? 2.2 * smooth(span(t, tp1 - 1.6, tp1)) : 0) }) });
        if (close < 1) {   // the room, torn into four strips that close into their glyphs
          const sc = p.h / 540, gx = p.w * .5, gy = -p.h * .74, e = sineIO(close);
          const rw = lerp(p.w, p.w * .2, e), rh = lerp(p.h, p.w * .2, e), rx = lerp(0, gx - rw / 2, e), ry = lerp(-p.h, gy - rh / 2, e);
          ctx.save(); ctx.translate(p.x, p.y); ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, lerp(0, rw / 2, e)); ctx.clip();
          ctx.translate(-240 * j * sc, -p.h); ctx.scale(sc * .5, sc * .5);
          const m = ctx.getTransform();
          B.withFrame({ a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f }, () => SC.radio(ctx, t, B.IC(960, 540, 1), radioSt(t)));
          ctx.restore();
        }
      });
    }
    // seams of light before the split (anticipation)
    const sk = F.bump(t, a.tasks - .6, .9);
    if (sk > 0) E.card(ctx, c, F0, () => { ctx.fillStyle = rgba(P.core0, .9 * sk); for (let j = 1; j < 4; j++) ctx.fillRect(BF.x + 240 * j - 2, BF.y + 540 * (1 - sk), 4, 540 * sk); });
    // the machine's bead takes the scan (drops onto its glyph, then lifts away)
    const tb = a.tookPart - .7;
    if (t > tb && t < a.kept + 2) {
      const s0 = TS[0], gp = [s0.x + s0.w / 2, s0.y - s0.h * .74];
      const p = B.track(t, [[tb, [gp[0] + 60, -260]], [a.tookPart + .55, [gp[0], gp[1] - 30]], [tFall + .2, [gp[0] + 10, gp[1] - 40]], [a.kept + 2, [gp[0] + 380, -320]]]);
      E.card(ctx, c, s0.Z, () => F.agent(ctx, t, p[0], p[1], 14, { ring: 1, think: span(t, a.tookPart + .4, a.tookPart + .8) * (1 - span(t, tFall, tFall + 1)) }));
    }
    // the radiologist
    if (t >= a.tasks - .3) {
      const r = radOut(t);
      E.card(ctx, c, F0, () => E.person(ctx, r.x, r.y, RAD_H, { dir: r.dir, light: 1, walk: r.walk, look: r.climb ? .6 : .25 + .05 * Math.sin(t * .8),
        armR: r.climb ? [2.5, 2.8] : undefined, armL: r.climb ? [-2.4, -2.7] : undefined, rim: mixWarm(), long: true }));
    }
    if (t < tPB0 + 1.2 && t >= tPB0) { /* the room still fills most of the frame: nothing else */ }
  }
  const mixWarm = () => E.mixHex(P.halo0, P.core1, .3);
  function block(ctx, t) {   // 5.09 pull-back: the whole room is the face of one stone (four pieces, the room drawn over their faces)
    const c = taskCam(t);
    F.sky(ctx, c, t, { glow: [1100, 520, 900] }); F.plain(ctx, c, t);
    for (let j = 0; j < 4; j++) E.card(ctx, c, F0, () => F.stone(ctx, t, BF.x + 240 * j, 905, 540, { w: 240, glyph: null }));
    E.card(ctx, c, F0, () => {
      halo(ctx, BF.x + BF.w / 2, BF.y + BF.h / 2, 900, .25 * span(t, tPB0, tPB0 + 1.5), P.halo1, P.halo0);
      ctx.save(); ctx.beginPath(); ctx.rect(BF.x, BF.y, BF.w, BF.h); ctx.clip(); ctx.translate(BF.x, BF.y); ctx.scale(.5, .5);
      const m = ctx.getTransform();
      B.withFrame({ a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f }, () => SC.radio(ctx, t, B.IC(960, 540, 1), radioSt(t)));
      ctx.restore();
    });
  }
  const halo = E.halo;

  // ---------------------------------------------------------------------------------------------------------- RANK WORLD (c06 + c07)
  const lampI0 = SC.lampOf(SC.PEOPLE[SC.I0]);
  const ignite = (i) => {
    const d = Math.abs(i - SC.I0); if (d === 0) return -1e9;
    if (i > SC.I0 && d <= 3) return tp2 + .9 + 1.45 * (d - 1);
    return a.notJust + .1 + .17 * (i > SC.I0 ? d - 4 : d - 1);
  };
  const sparks = (t) => {
    const out = [];
    SC.PEOPLE.forEach((_, i) => { const ti = ignite(i), d = Math.abs(i - SC.I0); if (!d) return; const dur = d <= 3 && i > SC.I0 ? .9 : .22, from = i > SC.I0 ? i - 1 : i + 1, u = span(t, ti - dur, ti); if (u > 0 && u < 1) out.push([from, i, u]); });
    return out;
  };
  // rank stones: angles over the take (No. n → index n − 1). Plate: 10–4 flat (rankLie), No. 3 trembles .035 ± .012
  const lie = Math.PI / 2 - .015;
  const fallFrom = (t, t0, a0, h) => { if (t <= t0) return a0; const al = (Math.PI / 2) * 2 / (1.1 * Math.sqrt(h / 690)) ** 2, th = Math.sqrt(2 * (lie - a0) / al);
    let v = Math.min(lie, a0 + .5 * al * (t - t0) ** 2); if (t > t0 + th) v -= .025 * Math.exp(-(t - t0 - th) * 9) * Math.sin((t - t0 - th) * 30); return v; };
  const t6f = a.butIf + 1.3, t5f = K2s + 4.4, t4f = K2s + 5.2;
  const rankFall = (t) => (n) => {
    if (n >= 7) return S.rankLie(n);
    if (n === 6) return t < t6f ? B.tip(t, a.six + .15, 1.05) : fallFrom(t, t6f, 1.05, RS[5].h * 4);
    if (n === 5) return t < t5f ? B.tip(t, a.five + .2, .72) : fallFrom(t, t5f, .72, RS[4].h * 4);
    if (n === 4) return t < t4f ? B.tip(t, a.four + 1.2, .62) : fallFrom(t, t4f, .62, RS[3].h * 4);
    if (n === 3) return smooth(span(t, a.three + .2, a.three + 1.4)) * (.035 + .012 * Math.sin(t * 2.3));
    return 0;
  };
  const gp = (i, t) => B.facePt(i, rankFall(t)(i + 1), .5, .74);     // glyph centre of rank stone i (its card)
  // windows on the rank row (card design rects, 16:9)
  const win = (i, dx, dy, w, t) => { const g = gp(i, t); return { x: g[0] + dx - w / 2, y: g[1] + dy - w * 9 / 32, w, h: w * 9 / 16 }; };
  const W5 = win(4, 30, -70, 220, a.five + 3), W4 = win(3, 40, -90, 260, a.four + 3);
  const WB = { x: 1340 - 192, y: 430 - 108, w: 384, h: 216 }, WF = { x: 1760 - 192, y: 430 - 108, w: 384, h: 216 };
  const Z5 = RS[5].Z, Z4 = RS[4].Z, Z3 = RS[3].Z, Z2 = RS[2].Z;
  // the workflow chain (6.06) on No. 6's card
  const CY = 600, CHX = (k) => RS[5].x - 190 + k * 72, CH_G = ['report', 'analysis', 'code', 'chat', 'draft', 'calendar', 'email'];
  const chainCx = (CHX(0) + CHX(6)) / 2;
  const chainIn = (k, t) => sineIO(span(t, a.agentsArrive - .3 + k * .12, a.agentsArrive + .8 + k * .12));
  const chainOut = (k, t) => sineIO(span(t, a.butIf - .3 + (6 - k) * .1, a.butIf + .8 + (6 - k) * .1));
  const hopT = (k) => lerp(a.systems + .35, a.finish - .15, k / 6);
  const chainCool = (k, t) => Math.max(k === 2 ? span(t, a.notTools + .8, a.notTools + 1.1) : 0, span(t, hopT(k) - .05, hopT(k) + .2));
  const camRankKeys = [
    [tp2 + 2.2, E.aim(SC.RZ, lampI0[0] + 230, lampI0[1] + 10, 2.4)], [a.notJust + .2, E.aim(SC.RZ, lampI0[0] + 420, lampI0[1] + 40, 1.8)],
    [a.subscribe + 1.0, E.aim(SC.RZ, -2550, 640, .9)], [a.fromHere + 1.7, E.aim(SC.RZ, -900, 740, .92)],
    [a.howMuch - .1, C(1250, 610, .62)], [a.six - 1.3, C(1290, 600, .66)], [a.six + .6, B.onStone(5, 2.8, 1250, 560)], [a.six + 2.2, B.onStone(5, 2.9, 1240, 555)],
    [a.agentsArrive + 1.6, E.aim(Z5, chainCx, CY - 30, 2.4, 960, 380)], [a.labChief + .9, E.aim(Z5, chainCx, CY - 20, 2.2, 960, 290)],
    [a.butIf - .2, E.aim(Z5, chainCx + 10, CY - 10, 2.1, 960, 310)], [a.touch + .5, B.onStone(4, 2.6, 1250, 560)], [a.five + 1.4, B.onStone(4, 2.9, 1250, 560)], [tC0, B.onStone(4, 3.1, 1230, 560)],
  ];
  const fill5 = B.fillCam(Z4, W5), fill4 = B.fillCam(Z3, W4), fillB = B.fillCam(Z2, WB);
  const KC4 = [[tC2, fill5], [tC3, B.onStone(3, 2.4, 1250, 560)], [a.justScan + .5, B.onStone(3, 2.6, 1240, 555)], [tB0, B.onStone(3, 2.8, 1230, 555)]];
  const KC3 = [[tB2, fill4], [tB3, C(1520, 690, 1.12)], [a.three + .9, B.onStone(2, 1.9, 820, 590)], [tBa0, B.onStone(2, 2.0, 840, 600)]];
  const KCB = [[tBa2, fillB], [a.humanoid + 2.4, E.aim(Z2, 1550, 430, 1.95)], [a.clean + .3, E.aim(Z2, 1700, 440, 2.4)], [tBb0, E.aim(Z2, 1650, 440, 2.3)]];
  const creepRR = (t) => { const k = S.creep(t, T, 'Number two'); return C(1350 + S.TRUCK * (k - 1) / S.CREEP, 620, .66 * k); };
  const KCE = [[K2s + 3.4, E.aim(Z2, 1450, 480, 1.7)], [K2e - .8, B.onStone(2, 1.8, 820, 600)], [a.notice + 1.0, B.onStone(2, 1.86, 800, 610)], [a.holds + .2, C(1320, 630, .82)], [tPl, creepRR(tPl)]];
  // where is the outer camera, and is an inner scene filling the screen? → { c, full: 'class'|'bed'|'base'|null }
  function rankCam(t) {
    const drift = (c, k, R) => B.breathe(c, t, k * 1.6, R, 9);
    if (t < tp2 + 2.2) return { c: drift(E.camAt(t, [[tp2, E.aim(SC.RZ, lampI0[0], lampI0[1] + 6, 40)], [tp2 + 2.2, camRankKeys[0][1], 'o']], SC.RZ), .5 * smooth(span(t, tp2 + .6, tp2 + 2.2)), SC.RZ) };
    if (t < tC0) return { c: drift(B.camPathR(t, camRankKeys, SC.RZ), .5 * smooth(span(t, tp2 + .6, tp2 + 2.2)) * (1 - smooth(span(t, tC0 - 1, tC0))), SC.RZ + (Z5 - SC.RZ) * smooth(span(t, a.fromHere + 1.7, a.howMuch)) + (Z4 - Z5) * smooth(span(t, a.touch - .5, a.five + 1.0))) };
    if (t < tC1) return { c: E.camAt(t, [[tC0, camRankKeys[camRankKeys.length - 1][1]], [tC1, fill5, 's']], Z4) };
    if (t < tC2) return { c: fill5, full: 'class' };
    if (t < tB0) return { c: drift(B.camPathR(t, KC4, Z4), .5 * smooth(span(t, tC3 - 1, tC3)) * (1 - smooth(span(t, tB0 - 1, tB0))), Z3) };
    if (t < tB1) return { c: E.camAt(t, [[tB0, KC4[KC4.length - 1][1]], [tB1, fill4, 's']], Z3) };
    if (t < tB2) return { c: fill4, full: 'bed' };
    if (t < tBa0) return { c: drift(B.camPathR(t, KC3, Z3), .5 * smooth(span(t, tB3 - 1, tB3)) * (1 - smooth(span(t, tBa0 - 1, tBa0))), Z2) };
    if (t < tBa1) return { c: E.camAt(t, [[tBa0, KC3[KC3.length - 1][1]], [tBa1, fillB, 's']], Z2) };
    if (t < tBa2) return { c: fillB, full: 'base' };
    if (t < tBb0) return { c: drift(B.camPathR(t, KCB, Z2), .4 * smooth(span(t, tBa2 + 1.5, tBa2 + 2.5)) * (1 - smooth(span(t, tBb0 - 1, tBb0))), Z2) };
    if (t < tBb1) return { c: E.camAt(t, [[tBb0, KCB[KCB.length - 1][1]], [tBb1, fillB, 's']], Z2) };
    if (t < K2s + .5) return { c: fillB, full: 'base' };
    if (t < K2s + 3.4) return { c: E.camAt(t, [[K2s + .5, fillB], [K2s + 3.4, KCE[0][1], 's']], Z2) };
    const p = B.camPathR(t, KCE, Z2), dr = drift(p, .5 * smooth(span(t, K2s + 3.4, K2s + 4.4)) * (1 - smooth(span(t, tPl - 1.6, tPl - .4))), Z2);
    return { c: B.blend(dr, creepRR(t), smooth(span(t, tPl - 1.2, tPl))) };
  }
  // inner scenes of the rank world
  const CIK = [[tC0, B.IC(640, 410, 2.1)], [tC1, B.IC(630, 410, 1.95)], [a.childNot, B.IC(640, 415, 1.85)], [a.childNot + 2.6, B.IC(1000, 600, .96)], [a.believed + 1.6, B.IC(1150, 600, 1.06)], [a.explFalls - .3, B.IC(900, 610, 1.0)], [tC3, B.IC(940, 600, 1.04)]];
  const classIC = (t) => B.breathe(F.camPath(t, CIK), t, .6, F0, 11, .12);
  const classSt = (t) => ({ write: span(t, a.explain + .1, a.anyLang + .3), bead: true, reach: sineIO(span(t, a.believed + .2, a.believed + 1.4)), look: .1 + .45 * sineIO(span(t, a.believed + .6, a.believed + 1.6)),
    stones: { u: span(t, a.explFalls - .5, a.explFalls + .6), fallE: B.fall1(t, a.fallsW + .05, 210 * 3) } });
  const BIK = [[tB0, B.IC(1060, 600, 1.2)], [tB1, B.IC(1040, 610, 1.08)], [a.stay + 1.0, B.IC(1100, 630, 1.22)], [tB3, B.IC(1120, 640, 1.26)]];
  const bedIC = (t) => B.breathe(F.camPath(t, BIK), t, .6, F0, 13, .12);
  const bedSt = (t) => ({ lean: sineIO(span(t, a.hard - .8, a.hard + .4)), reach: sineIO(span(t, a.hard - .2, a.hard + 1.0)) });
  const BAK = [[tBa0, B.IC(900, 500, 1.2)], [tBa1, B.IC(880, 510, 1.1)], [a.rusted + .3, B.IC(1180, 450, 1.32)], [tBa2, B.IC(1150, 460, 1.28)], [tBb1, B.IC(1100, 470, 1.2)], [K2s + .5, B.IC(1120, 460, 1.24)], [K2s + 3.4, B.IC(1000, 480, 1.1)]];
  const baseIC = (t) => B.breathe(F.camPath(t, BAK), t, .6, F0, 17, .12);
  const beamAt = (t) => { const p = B.track(t, [[tBa1 - .4, [900, 330]], [a.climbing + .9, [1160, 290]], [a.climbing + 1.9, [1020, 440]], [a.rusted - .1, [SC.RUST[0], SC.RUST[1]]]]); return [p[0] + 4 * Math.sin(t * 1.9), p[1] + 3 * Math.sin(t * 2.6)]; };
  const baseSt = (t) => ({ beam: beamAt(t), r: 120, findU: span(t, a.rusted - .1, a.rusted + .6) });
  const factIC = (t) => B.breathe(B.IC(960, 560, 1.0), t, .7, F0, 19, .12);
  // 6.04: how much is left standing (a warm line up the lit edge of each standing stone)
  function gauges(ctx, c, t) {
    for (let i = 1; i <= 5; i++) {
      const u = sineIO(span(t, a.howMuch + .1 + (5 - i) * .12, a.howMuch + 1.1 + (5 - i) * .12)) * (1 - sineIO(span(t, a.six - 1.6, a.six - 1.0)));
      if (u <= 0) continue;
      const s = RS[i];
      E.card(ctx, c, s.Z, () => { const x = s.x - Math.max(3, s.w * .06), y1 = s.y - s.h * u;
        ctx.fillStyle = E.lin(ctx, 0, s.y, 0, y1, [[0, rgba(P.halo1, .5)], [1, rgba(P.core0, .95)]]); ctx.fillRect(x - 2, y1, Math.max(3, s.w * .045), s.y - y1);
        halo(ctx, x, y1, Math.max(30, s.h * .35), .55, P.halo0, P.core0); });
    }
  }
  // 6.06–6.09: the workflow chain on No. 6's card
  function chain(ctx, c, t) {
    if (t < a.agentsArrive - .4 || t > a.butIf + 1.6) return;
    const src = gp(5, t);
    E.card(ctx, c, Z5, () => {
      const pos = [];
      for (let k = 0; k < 7; k++) {
        const u = t < a.butIf - .3 ? chainIn(k, t) : 1 - chainOut(k, t);
        const x = lerp(src[0], CHX(k), u), y = lerp(src[1], CY, u) - 120 * Math.sin(Math.PI * u) * (t < a.butIf - .3 ? 1 : .6);
        pos.push([x, y, u]);
      }
      for (let k = 0; k < 6; k++) { const [x0, y0, u0] = pos[k], [x1, y1, u1] = pos[k + 1]; if (u0 < .95 || u1 < .95) continue;
        const cl = chainCool(k + 1, t); ctx.strokeStyle = cl > .5 ? rgba(F.COOL.line, .8) : rgba(P.cream, .28); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x0 + 17, y0 - 22); ctx.lineTo(x1 - 2, y1 - 22); ctx.stroke(); }
      for (let k = 0; k < 7; k++) {
        const [x, y, u] = pos[k]; if (u <= 0) continue;
        const sz = lerp(.3, 1, u), cl = chainCool(k, t);
        if (cl > 0) halo(ctx, x + 8, y - 24, 46, .35 * cl, F.COOL.halo, F.COOL.body);
        ctx.save(); ctx.translate(x, y); ctx.scale(sz, sz); ctx.translate(-x, -y);
        F.stone(ctx, t, x, y, 46, { w: 16, glyph: CH_G[k], glyphWarm: 1 - cl, dark: .15 * cl });
        ctx.restore();
      }
      // bead 1: a tool that helps with one step
      const b1 = B.track(t, [[a.notTools - .2, [CHX(2) + 8, CY - 260]], [a.notTools + .9, [CHX(2) + 8, CY - 66]], [a.systems + .3, [CHX(2) + 8, CY - 70]]]);
      if (t > a.notTools - .2 && t < hopT(2)) F.agent(ctx, t, b1[0] + 2 * Math.sin(t * 2), b1[1], 7, { ring: .8 });
      // bead 2: the system that runs the whole workflow, start to finish
      if (t > a.systems - .4 && t < a.butIf + 1.4) {
        let p;
        if (t < hopT(0)) p = B.track(t, [[a.systems - .4, [CHX(0) - 150, CY - 150]], [hopT(0), [CHX(0) + 8, CY - 64]]]);
        else if (t < hopT(6)) { const k = Math.min(5, Math.floor((t - hopT(0)) / (hopT(1) - hopT(0)))), u = sineIO((t - hopT(k)) / (hopT(k + 1) - hopT(k)));
          p = [lerp(CHX(k), CHX(k + 1), u) + 8, CY - 64 - 34 * Math.sin(Math.PI * u)]; }
        else p = B.track(t, [[hopT(6), [CHX(6) + 8, CY - 64]], [hopT(6) + 1, [CHX(6) + 90, CY - 110]], [a.butIf + .2, [CHX(6) + 100, CY - 116]], [a.butIf + 1.4, [CHX(6) + 160, CY - 700]]]);
        F.agent(ctx, t, p[0], p[1] + 2 * Math.sin(t * 2.3), 9, { ring: 1, think: t > hopT(6) && t < a.butIf ? .5 : 0 });
      }
    });
  }
  // No. 4: a bead takes the diagnosis glyph (cool), and pulls the scan out of its memory
  function diagBead(ctx, c, t) {
    if (t < a.diagnosis - .2 || t > a.someone + .8) return;
    const g = gp(3, t);
    E.card(ctx, c, Z3, () => {
      const p = B.track(t, [[a.diagnosis - .2, [g[0] + 40, g[1] - 160]], [a.machineW, [g[0] + 4, g[1] - 22]], [a.justScan - .2, [g[0] + 30, g[1] - 36]], [a.someone - .5, [g[0] + 34, g[1] - 40]], [a.someone + .8, [g[0] + 90, g[1] - 300]]]);
      F.agent(ctx, t, p[0], p[1], 5.5, { ring: 1, think: span(t, a.machineW - .4, a.machineW) * (1 - span(t, a.justScan, a.justScan + .8)) });
      const su = expoOut(span(t, a.justScan, a.justScan + .7)) * (1 - span(t, a.someone - .3, a.someone + .4));
      if (su > 0) B.glyph(ctx, 'scan', p[0] + 26 * su, p[1] - 6, 18 * su, { col: 'cool', glow: .8 });
    });
  }
  function rankWorld(ctx, t, rc) {

    const c = rc.c, fall = rankFall(t);
    const each = (i) => {
      if (i === 5) return { glyphWarm: smooth(span(t, a.six + .4, a.six + 1)) * (1 - span(t, a.agentsArrive - .3, a.agentsArrive + .4)) };
      if (i === 4) return { glyphWarm: smooth(span(t, a.teachers - .2, a.teachers + .5)) };
      if (i === 3) return { glyphWarm: smooth(span(t, a.doctors - .2, a.doctors + .5)) * (1 - smooth(span(t, a.machineW - .3, a.machineW + .3))) };
      if (i === 2) return { glyphWarm: smooth(span(t, a.three + .6, a.three + 1.2)) * (1 - smooth(span(t, K2s + 3, K2s + 6))) };
      return null;
    };
    const ridgeOn = t < a.fromHere + 5;
    B.rankRowX(ctx, c, t, { fall, each, mid: ridgeOn ? (cx, cc, tt) => SC.ridge(cx, cc, tt, { lit: (i) => smooth(span(tt, ignite(i) - .05, ignite(i) + .45)), spark: sparks(tt) }) : null });
    gauges(ctx, c, t); chain(ctx, c, t); diagBead(ctx, c, t);
    // windows
    const open = (t0, t1, c0, c1) => span(t, t0, t1) * (1 - span(t, c0, c1));
    const u5 = open(tC0 - .1, tC0 + 1.0, tC3 - 1.1, tC3 - .1);
    if (u5 > 0) B.portal(ctx, B.cardRect(c, Z4, B.openRect(W5, gp(4, t), u5, 10)), (cx) => SC.classroom(cx, t, classIC(t), classSt(t)), { r: lerp(30, 6, u5) });
    const u4 = open(tB0 - .1, tB0 + 1.0, tB3 - 1.1, tB3 - .1);
    if (u4 > 0) B.portal(ctx, B.cardRect(c, Z3, B.openRect(W4, gp(3, t), u4, 12)), (cx) => SC.bedside(cx, t, bedIC(t), bedSt(t)), { r: lerp(30, 6, u4) });
    const uB = open(tBa0 - .1, tBa0 + 1.1, K2s + 3.3, K2s + 4.6), uF = sineIO(span(t, a.humanoid + .5, a.humanoid + 1.8)) * (1 - sineIO(span(t, K2s + 2.6, K2s + 3.4)));
    const g2 = gp(2, t);
    if (uF > 0 && uB > 0) {
      const rF = B.openRect(WB, g2, uB, 14), off = (WF.x - WB.x) * uF;
      B.portal(ctx, B.cardRect(c, Z2, { ...rF, x: rF.x + off }), (cx) => SC.factory(cx, t, factIC(t), {}), { cool: true, r: 6 });
    }
    if (uB > 0) B.portal(ctx, B.cardRect(c, Z2, B.openRect(WB, g2, uB, 14)), (cx) => SC.basement(cx, t, baseIC(t), baseSt(t)), { r: lerp(30, 6, uB) });
  }
  // screen overlays of the rank world
  function rankOverlays(ctx, t, rc) {
    const title = (n, t0, t1, x = 130, y = 470) => F.rankTitle(ctx, t, x, y, n, F.RANKS.find((r) => r.n === n).name, B.inOut(t, t0, t1, .9, .5));
    title(6, a.six + .3, a.agentsArrive + .5); title(5, a.five + .1, a.explain - .1); title(4, a.four + 1.0, a.someone - .3); title(3, a.three + .1, a.easy - .1);
    // the trades: electrician, plumber, roofer (on their words) under No. 3
    [['bolt', a.electrician], ['wrench', a.plumber], ['roof', a.roofer]].forEach(([g, w], k) => {
      const u = B.inOut(t, w + .1, a.easy - .1, .6, .5); if (u <= 0) return;
      ctx.save(); ctx.translate(0, (1 - u) * 24); ctx.globalAlpha = u; B.glyph(ctx, g, 168 + k * 96, 610, 64, { lit: smooth(span(t, w + .1, w + .6)) }); ctx.restore();
    });
    // subscribe line (6.02)
    const su = B.inOut(t, a.soThat + .3, a.fromHere - .1, .9, .6);
    if (su > 0) maskLine(ctx, [['SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY', 0]], 960, 190, 28, su, { serif: false, weight: 600, align: 'center', col: P.cream, glow: true });
    // the Amodei card (paraphrase: no quote marks) and FORECAST vs MEASURED
    if (t > a.labChief - .2 && t < a.forecast + .6) {
      const q = F.QUOTES.amodei;
      F.quote(ctx, t, { text: q.lines.join(' '), x: 960, y: 540, size: 52, w: 1520, align: 'center', t0: a.labChief + .2, t1: a.forecast - .35, gold: [[q.gold, a.half]], attr: q.attr, marks: q.quoted !== false });
    }
    const fo = 1 - expoIn(span(t, a.butIf - .4, a.butIf + .2));
    if (t > a.forecast && fo > 0) {
      ctx.save(); ctx.translate(0, (1 - fo) * 40); ctx.globalAlpha = fo;
      const X = 1180, uF = span(t, a.forecast + .3, a.forecast + 1.5), L = 600;
      if (uF > 0) { ctx.save(); ctx.beginPath(); ctx.rect(X - 10, 500, (L + 60) * E.expoOut(uF) + 10, 120); ctx.clip();
        ctx.strokeStyle = rgba(F.COOL.body, .9); ctx.lineWidth = 3; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 10; ctx.beginPath(); ctx.roundRect(X, 540, L, 46, 6); ctx.stroke(); ctx.restore();
        maskLine(ctx, [['FORECAST', 0]], X - 26, 573, 26, rise(span(uF, 0, .6)), { serif: false, weight: 600, align: 'right', col: F.COOL.text, glow: false }); }
      F.slab(ctx, t, X, 680, 170, 46, { col: 'cool', u: span(t, a.soFar + .1, a.soFar + 1.3), label: 'MEASURED', size: 26 });
      ctx.restore();
    }
    // No. 3: A LONG TIME · NOT FOREVER (pinned to the trembling stone)
    if (t > a.notice && t < a.holds + 1) {
      const top = E.project(rc.c, Z2, ...B.facePt(2, rankFall(t)(3), 1, 1)), mid = E.project(rc.c, Z2, ...B.facePt(2, rankFall(t)(3), 1, .55));
      if (top && mid) {
        F.label(ctx, top[0] + 6, top[1] + 10, 'A LONG TIME', null, B.inOut(t, a.longTime + .05, a.holds + .5, .8, .6), { dx: 70, dy: -60 });
        F.label(ctx, mid[0] + 6, mid[1], 'NOT FOREVER', null, B.inOut(t, a.notForever + .05, a.holds + .5, .8, .6), { dx: 70, dy: -40, warm: 1 });
      }
    }
  }

  // ---------------------------------------------------------------------------------------------------------- rail + clip + doors
  const railA = (t) => Math.max(B.inOut(t, tW1 + .3, tp1 - 1.0, .9, .6), B.inOut(t, a.fromHere + 1.2, K2s - .3, .9, .5), t > K2e + .2 ? rise(span(t, K2e + .2, K2e + 1.1)) : 0);
  const fl = (t, tp) => (t < tp ? smooth(span(t, tp - 1.4, tp)) : 1 - smooth(span(t, tp, tp + 1.4)));
  function clip(ctx, t, rc) {
    if (t < a.evenMan || t > K2e + 1.5) return;
    if (t < K2e) {
      const ic = baseIC(t), bc = beamAt(t), p = B.ipt(ic, 1, bc[0], bc[1]);
      const o = { from: [p[0], p[1], 120 * p[2]], morph: span(t, a.evenMan + .2, K2s - .15) }, al = smooth(span(t, a.evenMan + .1, a.evenMan + .9));
      if (al <= 0) return;
      if (al >= 1) { F.clipPlate(ctx, t, T, 'K2', o); return; }
      // the torch circle turns into the screen: the plate is laid over the lit circle, not switched on (offscreen, then blended)
      OFF ??= createCanvas(W, H); const ox = OFF.getContext('2d'); ox.setTransform(1, 0, 0, 1, 0, 0); ox.clearRect(0, 0, W, H);
      F.clipPlate(ox, t, T, 'K2', o);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = al; ctx.drawImage(OFF, 0, 0); ctx.restore();
    } else {
      const f0 = E.project(rc.c, Z2, RS[2].x, RS[2].y - RS[2].h), k = E.cardM(rc.c, Z2).k;
      F.clipPlate(ctx, t, T, 'K2', { from: { x: f0[0], y: f0[1], w: RS[2].w * k, h: RS[2].h * k }, morph: 1 - span(t, K2e, K2e + 1.3) });
    }
  }

  // ---------------------------------------------------------------------------------------------------------- the frame
  function draw(ctx, t) {
    if (t >= tPl) { S.plateRankRow(ctx, t, T); return; }
    if (t < tW1) studio1(ctx, t);
    else if (t < tPB0) { B.withFrame(B.ID, () => SC.radio(ctx, t, radioIC(t), radioSt(t))); radioOverlays(ctx, t); }
    else if (t < a.tasks - .35) block(ctx, t);
    else if (t < tp1) taskWorld(ctx, t);
    else if (t < tp2) studio2(ctx, t);
    else {
      const rc = rankCam(t);
      if (rc.full === 'class') B.withFrame(B.ID, () => SC.classroom(ctx, t, classIC(t), classSt(t)));
      else if (rc.full === 'bed') B.withFrame(B.ID, () => SC.bedside(ctx, t, bedIC(t), bedSt(t)));
      else if (rc.full === 'base') B.withFrame(B.ID, () => SC.basement(ctx, t, baseIC(t), baseSt(t)));
      else rankWorld(ctx, t, rc);
      if (rc.full === 'class') classOverlays(ctx, t);
      rankOverlays(ctx, t, rc);
      clip(ctx, t, rc);
    }
    const ra = railA(t); if (ra > 0) F.rankRail(ctx, t, T, { a: ra });
    E.lightFlood(ctx, Math.max(fl(t, tp1), fl(t, tp2)));
  }
  // EXPLAINING / BELIEVING labels (classroom, screen space while it fills the screen)
  function classOverlays(ctx, t) {
    const ic = classIC(t), u = B.inOut(t, a.explFalls - .2, tC2 + .2, .8, .4);
    if (u <= 0) return;
    const p0 = B.ipt(ic, 1, 560 + 32, 660), p1 = B.ipt(ic, 1, 830 + 32, 660);
    B.tag(ctx, 'EXPLAINING', p0[0], p0[1], u, { align: 'center', col: F.COOL.text });
    B.tag(ctx, 'BELIEVING', p1[0], p1[1], B.inOut(t, a.explFalls + .1, tC2 + .2, .8, .4), { align: 'center', col: F.WARM.text, warm: 1 });
  }
  return { a, draw, PRINT: F.PRINT25 };
}
