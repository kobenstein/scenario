// c04 · Level 4 · the maker · T.G('Now imagine you work at Anthropic') → T.G("You're still at Anthropic") · builder B1.
// Plan: docs/shots.md 4.01–4.07 · rules: docs/MOTION.md · helpers: lib/f16_b1_kit.mjs.
// ONE entry, one plan sequence, two worlds joined by a carrier the camera follows:
//   out of c03's lit window (PANE_PLATE) the camera pulls back: it is one glass pane of the headquarters (cool glass, blue light
//   bands, brass); you (staff lanyard) at a glass desk; you type an instruction (unreadable lines: the script never says it), the reply
//   field stays EMPTY → the letterhead with its heavy brass seal lands on the desk (weight) → the seal glows → quote card; the stamp
//   CONSCIENTIOUS OBJECTOR lands on the letterhead → the seal lifts off and becomes an orb; the camera follows it up into the night →
//   a woodcut row of many hands passes it toward a throne of cold light; soldiers / officials / people who go along light in sections →
//   ★ one hand is the machine (cool cream): it turns, shows its open palm, the orb stops; the orb shows the seal ("Anthropic itself") →
//   the hands sink; RULE (sharp) and JUDGMENT (soft); the orb becomes a magnifier: the rule stays sharp, the balance stays blurred →
//   everything sinks; the lens remains alone in the centre: the one round token; on "One thing" the two pause bars light in it; push in
//   until it is plateButton (lib/f16_seams.mjs) at the group seam B1 → B2.
//
// | ID   | anchor                                 | picture                                                  | 1–2 moves           | camera          |
// | 4.01 | Anthropic · full weight · wrong        | LEVEL 4; HQ glass; you type; the letterhead + seal land  | typing · the landing| pull back       |
// | 4.02 | last word · Right                      | the seal glows heavy; the cursor blinks                  | the seal glows      | breathe         |
// | 4.03 | says no · objector                     | quote card; the stamp lands on the letterhead            | lines · stamp       | breathe         |
// | 4.04 | old pattern · many hands · Soldiers …  | the seal → orb; the row of hands passes it; sections light| orb · sections     | follows the orb |
// | 4.05★| one of those hands · refuse · itself   | the machine hand turns, open palm; the orb stops         | the hand · the orb  | slow push       |
// | 4.06 | Judgment · obedience · harder to check | RULE · JUDGMENT; the orb becomes a magnifier             | the lens            | breathe         |
// | 4.07 | no matter what · One thing             | all sinks; the token; pause bars light; push in → plate  | token · push        | push → plate    |
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f16_kit.mjs';
import * as B from '../lib/f16_b1_kit.mjs';
import { panePlate, PANE_PLATE } from './sc03.mjs';
import { plateButton, BUTTON_PLATE, SEAM_HALF } from '../lib/f16_seams.mjs';
import { Path2D } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, F0 } = E;
const { bump } = B;

export const PRINT = K.PRINT16;
export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  a.T0 = R.a; a.end = R.b;
  return [{ t: R.a, draw: scene(a), print: PRINT }];
};

// ===================================================================================================== geometry
const ZG = 2300;                                                             // the glass wall card
const PANE = { x0: 1000, y0: 60, w: 400, h: 400 * 1126 / 2000, g: 22, cols: 3, rows: 2 };
const paneRect = (c, r) => ({ x: PANE.x0 + c * (PANE.w + PANE.g), y: PANE.y0 + r * (PANE.h + PANE.g), w: PANE.w, h: PANE.h });
const P0 = paneRect(0, 0);                                                   // the pane we fly out of
const FLOOR = 1010, DESK = { x0: 560, x1: 1760, y: 770 };
const YOU = { x: 790, h: 440 };
const MON = { x: 1010, y: 480, w: 420 };                                     // the monitor (chat, landscape)
const MON_L = B.chatLayoutPlate(MON.x, MON.y, MON.w);
const LH = { x: 1470, y: 290, w: 320, h: 460 };                              // the letterhead, standing on the desk (bottom = DESK.y - 20)
const SEAL = { u: .72, v: .8, r: 34 };                                       // the brass seal on it (relative)
const Q4 = { x: 110, y: 170, size: 60, w: 820 };
const Q4TEXT = 'If Anthropic asks Claude to do something it thinks is wrong, Claude is not required to comply.';
// the hands world (above, in the night)
const HY = -1300;                                                            // its centre line (camera aims here)
const ROW = { y: -830, x0: 130, dx: 172, n: 10, L: 100 };                     // wrists (below the frame bottom), palms up
const MACH = 8;                                                              // the machine hand
const THRONE = { x: 1820, y: -760, h: 520 };
const RULEP = { x: 640, y: HY - 40 }, JUDG = { x: 1280, y: HY - 40 }, LENS_R = 120;

function scene(a) {
  const T0 = a.T0, TE = a.end, tPlateIn = T0 + .3, tPlate = TE - SEAM_HALF;
  const sP = PANE_PLATE.w / P0.w;
  const handX = (i) => ROW.x0 + i * ROW.dx;
  const palm = (i) => [handX(i), ROW.y - ROW.L * 1.45 - 34];               // where the orb rests in hand i
  // the orb's hops along the row: hand i at hopT[i]
  const h0 = a.old - .2, h1 = a.refuse - .55, hopT = Array.from({ length: MACH }, (_, i) => lerp(h0, h1, i / (MACH - 1)));
  const tToken = a.so4 + 1.0;                                               // the lens is alone in the centre: from here in screen space
  const pushK = (t) => Math.pow(2.1, span(t, a.so4 + .3, a.one + .45));          // the slow push on the lens while the question is asked
  const KC = [
    [T0, aim(ZG, P0.x + P0.w / 2, P0.y + P0.h / 2, sP)],
    [tPlateIn, aim(ZG, P0.x + P0.w / 2, P0.y + P0.h / 2, sP)],              // still the plate's pane until the plate is gone
    [a.type4 + .1, cam3({ z: -150, x: 60, y: 60 })],                          // pull back out of the pane: the HQ
    [a.weight - .3, cam3({ z: -130, x: 80, y: 70 })],
    [a.last + .2, aim(F0, 960, 470, 1.0)],                                   // one slow push on the office: the maker's last word?
    [a.objectorE + .05, cam3({ z: -120, x: 45, y: 50 })],
    [a.old + 1.0, aim(F0, 640, HY + 60, .98)],                                 // follow the orb up into the night
    [a.officials, aim(F0, 820, HY + 40, 1.0)],
    [a.oneOf - .2, aim(F0, 1020, HY + 20, 1.03)],
    [a.anthItself + .5, aim(F0, 1140, HY + 10, 1.07)],                         // the slow push of the ★ (the machine hand)
    [a.judgment - .2, aim(F0, 1100, HY + 6, 1.05)],
    [tToken - .6, aim(F0, 960, HY, 1.0)],
  ];
  return (ctx, t) => {
    const dAmt = .8 * smooth(span(t, tPlateIn, tPlateIn + 1.5)) * (1 - smooth(span(t, tToken - 1.6, tToken - .6)));
    const c = camDrift(camAt(t, KC, ZG), t, dAmt);                  // log-distance to the glass card (we start in front of it)
    if (t < tToken) {
      B.sky(ctx, 1);
      qGlow(ctx, t);
      if (t < a.many + 1) { card(ctx, c, ZG, () => glassWall(ctx, t)); card(ctx, c, F0, () => office(ctx, t)); }
      card(ctx, c, F0, () => hands(ctx, t));
    } else token(ctx, t);
    K.level(ctx, t, { n: 4, title: 'The maker', t0: tPlateIn, from: 3 });
    if (t < tPlateIn) panePlate(ctx, t);
    if (t >= tPlate) plateButton(ctx, t);
  };

  // ------------------------------------------------------------------------------------------------ the HQ
  function glassWall(ctx, t) {
    // dark wall left (the quote's space), the glass grid right, brass mullions, a soft floor glow
    ctx.fillStyle = E.lin(ctx, 0, -300, 0, 1200, [[0, rgba(P.night0, 0)], [.25, P.night1], [1, mixHex(P.night1, P.ind0, .6)]]); ctx.fillRect(-1200, -300, 4600, 1500);
    for (let r = 0; r < PANE.rows; r++) for (let cc = 0; cc < PANE.cols; cc++) { const p = paneRect(cc, r); B.pane(ctx, t + cc * 3.1 + r * 1.7, p.x, p.y, p.w, p.h, { bands: r === 0 && cc === 0 ? 1 : .7 }); }
    ctx.fillStyle = E.lin(ctx, 0, 0, 0, 600, [[0, P.halo1], [1, P.shade0]]);
    for (let cc = 0; cc <= PANE.cols; cc++) ctx.fillRect(PANE.x0 - PANE.g + cc * (PANE.w + PANE.g), PANE.y0 - PANE.g, PANE.g, PANE.rows * (PANE.h + PANE.g) + PANE.g);
    for (let r = 0; r <= PANE.rows; r++) ctx.fillRect(PANE.x0 - PANE.g, PANE.y0 - PANE.g + r * (PANE.h + PANE.g), PANE.cols * (PANE.w + PANE.g) + PANE.g, PANE.g * .6);
    ctx.fillStyle = E.lin(ctx, 0, 560, 0, 1300, [[0, mixHex(P.ind0, P.blue1, .2)], [1, P.night0]]); ctx.fillRect(-1200, 560 + PANE.g, 4600, 900);
    roomDim(ctx, t);
  }
  // the seal (the room's light) leaves: the office goes dim as the camera follows it up
  function roomDim(ctx, t) {
    const d = .6 * smooth(span(t, a.why4 - .1, a.why4 + 1.2)); if (d <= 0) return;
    ctx.fillStyle = E.lin(ctx, 0, -500, 0, -60, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, d)]]); ctx.fillRect(-1500, -500, 5200, 2000);
  }
  function office(ctx, t) {
    const typU = span(t, a.type4 + .1, a.weight + .9), sent = span(t, a.behindIt + .25, a.behindIt + .8);
    const fall = span(t, a.weight - .55, a.weight + .02), land = a.weight + .02;
    const sealOff = smooth(span(t, a.why4 - .2, a.why4 + .5));               // the seal leaves the letterhead (becomes the orb)
    const out = 0;                                                           // (the office stays; the camera tilt alone leaves it)
    ctx.save(); ctx.translate(0, out * 240);
    // you: staff lanyard, at the glass desk, typing
    const typing = typU > 0 && typU < 1;
    E.du(ctx, YOU.x, FLOOR, YOU.h, { dir: 1, light: 1, look: .1 + .25 * smooth(span(t, a.last - .3, a.last + .5)), armR: [1.2, 1.45 + .06 * Math.sin(t * 11) * (typing ? 1 : 0)], armL: [1.05, 1.5] });
    const nk = [YOU.x + 8, FLOOR - YOU.h * .79];
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(nk[0] - 14, nk[1]); ctx.lineTo(nk[0] + 6, nk[1] + 70); ctx.lineTo(nk[0] + 22, nk[1]); ctx.stroke();
    ctx.fillStyle = P.cream; ctx.fillRect(nk[0] - 6, nk[1] + 68, 24, 32); ctx.fillStyle = P.blue1; ctx.fillRect(nk[0] - 2, nk[1] + 74, 16, 6);
    // the glass desk: a lit edge, brass legs
    ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .2), .35); ctx.fillRect(DESK.x0, DESK.y - 16, DESK.x1 - DESK.x0, 16);
    ctx.fillStyle = mixHex(P.blue0, P.cream, .4); ctx.fillRect(DESK.x0, DESK.y - 2, DESK.x1 - DESK.x0, 4);
    ctx.fillStyle = E.lin(ctx, 0, DESK.y, 0, FLOOR, [[0, P.halo1], [1, P.shade0]]); ctx.fillRect(DESK.x0 + 60, DESK.y, 10, FLOOR - DESK.y); ctx.fillRect(DESK.x1 - 70, DESK.y, 10, FLOOR - DESK.y);
    // the monitor: the chat (your instruction as unreadable lines, the reply field EMPTY)
    const mh = MON.w * K.CHAT_AR;
    ctx.fillStyle = mixHex(P.night1, P.halo1, .2); ctx.fillRect(MON.x + MON.w / 2 - 8, MON.y + mh, 16, DESK.y - 16 - MON.y - mh); ctx.fillRect(MON.x + MON.w / 2 - 60, DESK.y - 22, 120, 8);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(MON.x - 10, MON.y - 10, MON.w + 20, mh + 20, 14); ctx.fill();
    B.chatGlass(ctx, t, MON_L, { t0: 0, reply: 1, cursor: 1,
      bubbles: [{ scribble: 2, w: 250 * MON.w / 1000 * 2.4, size: 34 * MON.w / 1000, u: sent, x1: MON.x + 950 * MON.w / 1000, y: MON.y + 46 * MON.w / 1000, seal: true }],
      typing: sent <= 0 ? { scribble: 1, size: 32 * MON.w / 1000, u: typU } : null });
    // the letterhead: falls slowly, hard stop on "full weight", a short settle; dust; the seal glows (4.02); the stamp (4.03)
    if (fall > 0) {
      const e = expoIn(fall), settle = Math.sin(Math.PI * span(t, land, land + .3)) * 7 * (1 - span(t, land, land + .3));
      const y = lerp(LH.y - 700, LH.y, e) + settle;
      sheet(ctx, t, LH.x, y, sealOff);
      if (t > land && t < land + .9) E.dust(ctx, 77, 220, LH.x + LH.w / 2, DESK.y - 22, 220 * (.6 + span(t, land, land + .9)), 18, t, .7 * (1 - span(t, land, land + .9)));
    }
    roomDim(ctx, t);
    ctx.restore();
    // 4.03 the quote (left, on the dark wall)
    const q0 = a.saysNo - .55, q1 = Math.max(q0 + 4.6, a.why4 + .2);
    if (t > q0 - .1 && t < q1 + 1.6) K.quote(ctx, t, { text: Q4TEXT, attr: 'CLAUDE’S CONSTITUTION', x: Q4.x, y: Q4.y, size: Q4.size, w: Q4.w, t0: q0, t1: q1, gold: [['not required to comply', a.saysNo - .05]] });
  }
  function sheet(ctx, t, x, y, sealOff) {
    const { w, h } = LH, p = new Path2D(); p.rect(x, y, w, h);
    E.glowFill(ctx, p, 40, .3, P.blue0);
    ctx.fillStyle = E.lin(ctx, x, y, x + w, y + h, [[0, mixHex(P.cream, P.blue0, .2)], [1, mixHex(P.halo2, P.ind1, .45)]]); ctx.fill(p);
    ctx.fillStyle = rgba(P.night1, .8); ctx.fillRect(x + 26, y + 30, 120, 12); ctx.fillStyle = rgba(P.shade0, .9); ctx.fillRect(x + 26, y + 50, w - 52, 3);
    ctx.strokeStyle = rgba(P.night1, .45); ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(x + 26, y + 90 + i * 24); ctx.lineTo(x + w - 26 - (i % 3) * 30, y + 90 + i * 24); ctx.stroke(); }
    // the stamp (4.03) lands across the sheet
    if (t > a.objector - .4) K.stamp(ctx, t, 'CONSCIENTIOUS OBJECTOR', x + w / 2, y + h * .5, { t0: a.objector + .02, size: 23, rot: -.16, ink: P.night0 });
    if (sealOff <= 0) seal(ctx, t, x + w * SEAL.u, y + h * SEAL.v, SEAL.r, 1);
  }
  function seal(ctx, t, x, y, r, a1 = 1) {
    const glow = .35 + .65 * smooth(span(t, a.last - .2, a.last + .6)) * (1 - .5 * smooth(span(t, a.docNo, a.saysNo + 1)));
    E.halo(ctx, x, y, r * 3.2, .5 * glow * a1, P.halo0, P.core1);
    ctx.fillStyle = E.rad(ctx, x - r * .35, y - r * .4, r * 1.5, [[0, P.core1], [.35, P.halo0], [.75, P.halo1], [1, P.shade0]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.shade0, .9); ctx.lineWidth = Math.max(1.5, r * .07); ctx.beginPath(); ctx.arc(x, y, r * .72, 0, 6.29); ctx.stroke();
    ctx.beginPath(); for (let k = 0; k < 5; k++) { const q = -Math.PI / 2 + k * Math.PI * 4 / 5; k ? ctx.lineTo(x + Math.cos(q) * r * .42, y + Math.sin(q) * r * .42) : ctx.moveTo(x + Math.cos(q) * r * .42, y + Math.sin(q) * r * .42); } ctx.closePath(); ctx.stroke();
  }

  // ------------------------------------------------------------------------------------------------ the hands (woodcut), the orb, rule vs judgment
  function orbPos(t) {
    // 1) the seal lifts off the letterhead and flies up-left into hand 0
    const sx = LH.x + LH.w * SEAL.u, sy = LH.y + LH.h * SEAL.v;
    const fly = span(t, a.why4 - .2, h0);
    if (t < h0) { const e = sineIO(fly), p0 = [sx, sy], p1 = palm(0), cpt = [lerp(p0[0], p1[0], .5) + 300, lerp(p0[1], p1[1], .55)];
      return { x: lerp(lerp(p0[0], cpt[0], e), lerp(cpt[0], p1[0], e), e), y: lerp(lerp(p0[1], cpt[1], e), lerp(cpt[1], p1[1], e), e), r: lerp(SEAL.r, 46, smooth(fly)), state: 'fly' }; }
    // 2) hops from hand to hand
    for (let i = 0; i < MACH - 1; i++) if (t < hopT[i + 1]) {
      const q = span(t, hopT[i] + .35, hopT[i + 1]), e = sineIO(q), p0 = palm(i), p1 = palm(i + 1);
      return { x: lerp(p0[0], p1[0], e), y: lerp(p0[1], p1[1], e) - Math.sin(Math.PI * e) * 90, r: 46, hand: q < .5 ? i : i + 1 };
    }
    // 3) toward the machine hand: it opens; the orb stops before the palm and settles back into hand MACH-1
    const p0 = palm(MACH - 1), p1 = palm(MACH);
    const go = span(t, hopT[MACH - 1] + .2, a.refuse + .2), back = span(t, a.refuse + .25, a.refuse + 1.1);
    const e = sineIO(go) * .62 * (1 - sineIO(back));
    let x = lerp(p0[0], p1[0], e), y = lerp(p0[1], p1[1], e) - Math.sin(Math.PI * Math.min(1, e / .62) * .5) * 70 * (1 - back);
    // 4) after the row sinks: the orb floats to the centre and becomes the magnifier lens (r → LENS_R)
    const toC = sineIO(span(t, a.price4 - .1, a.judgment + .3));
    if (toC > 0) { x = lerp(x, 960, toC); y = lerp(y, HY - 260, toC); }
    return { x, y, r: lerp(46, 60, toC), hand: MACH - 1 };
  }
  function hands(ctx, t) {
    if (t < a.why4 - .3) return;
    const sink = expoIn(span(t, a.price4 - .2, a.price4 + .6));
    const sec = (i) => i < 3 ? smooth(span(t, a.soldiers - .1, a.soldiers + .45)) : i < 6 ? smooth(span(t, a.officials - .1, a.officials + .45)) : i !== MACH ? smooth(span(t, a.people - .1, a.people + .45)) : 0;
    // the throne of cold light (where the power would go)
    const thU = K.rise(span(t, a.grab - .2, a.grab + .9)) * (1 - sink);
    if (thU > 0) B.fromBase(ctx, THRONE.y, thU, THRONE.h + 40, () => throne(ctx, t));
    // the hands rise from below one after another as the orb arrives (the frame bottom is their baseline)
    if (sink < 1) for (let i = 0; i < ROW.n; i++) {
      const up = K.rise(span(t, a.because - .9 + i * .2, a.because - .1 + i * .2));
      if (up <= 0) continue;
      const mc = i === MACH ? smooth(span(t, a.oneOf - .15, a.oneOf + .5)) : 0;
      const turn = i === MACH ? span(t, a.refuse - .25, a.refuse + .35) : 0, fl = Math.cos(Math.PI * turn);   // 1 → -1: it turns over
      const dy = (1 - up) * 460 + sink * 520, x = handX(i), lean = .12 * Math.sin(i * 1.7);
      const holding = (() => { const o = orbPos(t); return o.hand === i ? 1 : 0; })();
      const m = E.handMatrix(x, ROW.y + dy, -Math.PI / 2 + lean * (1 - turn), ROW.L * (i === MACH ? 1 + .12 * turn : 1), Math.abs(fl) < .02 ? .02 : fl);
      B.flatHand(ctx, m, t, { pose: i === MACH && turn > .5 ? 'open' : 'hold', curl: holding ? .15 : .35, lit: sec(i) * .9, machine: mc });
    }
    // the orb (the seal, grown heavy); "Anthropic itself": its seal face glows
    if (t > a.why4 - .2 && t < tToken) {
      const o = orbPos(t), lensU = smooth(span(t, a.andJ - .4, a.andJ + .5));
      if (lensU <= 0) {
        seal(ctx, t, o.x, o.y, o.r, 1);
        const it = bump(t, a.anthItself - .1, 1.6); if (it > 0) E.halo(ctx, o.x, o.y, o.r * 4, .6 * it, P.halo0, P.core0);
      }
      ruleJudgment(ctx, t, o, lensU);
    }
  }
  function throne(ctx, t) {
    const { x, y, h } = THRONE, p = new Path2D();
    // a throne: tall back with two finials and a peak, arm rests, the seat, four short legs (flat cut shape)
    p.moveTo(x - 120, y); p.lineTo(x - 120, y - h * .3); p.lineTo(x - 160, y - h * .3); p.lineTo(x - 160, y - h * .5); p.lineTo(x - 100, y - h * .5);
    p.lineTo(x - 100, y - h * .9); p.lineTo(x - 112, y - h * .9); p.lineTo(x - 100, y - h * 1.0); p.lineTo(x - 88, y - h * .9);
    p.quadraticCurveTo(x - 40, y - h * .96, x, y - h * 1.1); p.quadraticCurveTo(x + 40, y - h * .96, x + 88, y - h * .9);
    p.lineTo(x + 100, y - h * 1.0); p.lineTo(x + 112, y - h * .9); p.lineTo(x + 100, y - h * .9);
    p.lineTo(x + 100, y - h * .5); p.lineTo(x + 160, y - h * .5); p.lineTo(x + 160, y - h * .3); p.lineTo(x + 120, y - h * .3); p.lineTo(x + 120, y);
    p.lineTo(x + 96, y); p.lineTo(x + 96, y - h * .16); p.lineTo(x - 96, y - h * .16); p.lineTo(x - 96, y); p.closePath();
    E.glowFill(ctx, p, 60, .35, P.blue0);
    ctx.fillStyle = E.lin(ctx, 0, y - h, 0, y, [[0, mixHex(P.ind1, P.blue1, .4)], [1, P.night1]]); ctx.fill(p);
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .4), .7); ctx.lineWidth = 3; ctx.stroke(p);
  }
  function ruleJudgment(ctx, t, o, lensU) {
    const ruleU = K.rise(span(t, a.judgment - .1, a.judgment + .7)), judU = K.rise(span(t, a.obedience - .1, a.obedience + .7));
    const out = expoIn(span(t, a.so4 - .1, a.so4 + .5));
    const drawRule = (k = 1, blur = 0) => { B.icon16(ctx, 'check', RULEP.x, RULEP.y, 190 * k, { lw: 6 }); };
    const drawJudg = (k = 1) => { ctx.save(); ctx.filter = 'blur(5px)'; B.icon16(ctx, 'balance', JUDG.x, JUDG.y, 230 * k, { lw: 6 }); ctx.restore(); };
    const BASEY = RULEP.y + 150;
    if (ruleU * (1 - out) > 0) B.fromBase(ctx, BASEY, ruleU * (1 - out), 330, () => { drawRule(); E.glowText(ctx, 'RULE', RULEP.x, RULEP.y + 140, { size: 40, weight: 600, align: 'center', spacing: .2 }); });
    if (judU * (1 - out) > 0) B.fromBase(ctx, BASEY, judU * (1 - out), 330, () => { drawJudg(); E.glowText(ctx, 'JUDGMENT', JUDG.x, JUDG.y + 140, { size: 40, weight: 600, align: 'center', spacing: .2 }); });
    if (lensU <= 0) return;
    // the magnifier: the orb's rim becomes the lens ring; a handle grows; it slides over the rule (sharp) and the balance (blurred)
    const toJ = sineIO(span(t, a.andJ - .1, a.harder4 + .2)), slide = sineIO(span(t, a.aRule - .45, a.aRule + .75)), toC = sineIO(span(t, a.so4 - .4, a.so4 + .9));
    const lx = lerp(lerp(o.x, JUDG.x, toJ), RULEP.x, slide), ly = lerp(lerp(o.y, JUDG.y, toJ), RULEP.y, slide);
    const x = lerp(lx, 960, toC), y = lerp(ly, HY, toC), r = lerp(lerp(40, LENS_R, lensU), LENS_R, toC) * pushK(t);
    const handle = lensU * (1 - smooth(span(t, a.so4 + .2, a.so4 + 1.0)));
    lensDraw(ctx, t, x, y, r, handle, (k) => {
      if (ruleU * (1 - out) > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(1.35, 1.35); ctx.translate(-x, -y); drawRule(); ctx.restore(); }
      if (judU * (1 - out) > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(1.35, 1.35); ctx.translate(-x, -y); drawJudg(); ctx.restore(); }
    });
  }
  // the lens: a brass ring (the button's ring to come), dark glass; contents magnified inside
  function lensDraw(ctx, t, x, y, r, handle, inside) {
    if (handle > 0) {
      const ang = .75, x0 = x + Math.cos(ang) * r * .98, y0 = y + Math.sin(ang) * r * .98, L = r * 1.6 * handle;
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = E.lin(ctx, x0, y0, x0 + Math.cos(ang) * L, y0 + Math.sin(ang) * L, [[0, P.halo1], [1, P.shade0]]); ctx.lineWidth = r * .22;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(ang) * L, y0 + Math.sin(ang) * L); ctx.stroke(); ctx.restore();
    }
    B.buttonFaceB(ctx, t, x, y, r, { bars: 0, inside });
  }

  // the question ("So is there anything …") gathers light round the empty lens (slow, wide, warm; the panel later covers it). Screen space,
  // drawn right after the sky in the world and in the token alike
  function qGlow(ctx, t) {
    const g = smooth(span(t, a.so4 + .1, a.so4 + 1.5)), gu = span(t, a.so4 + .1, tPlate);
    if (g <= 0) return;
    const GR = 260 + 1150 * (1 - (1 - gu) * (1 - gu)), GA = .4 * g * (1 + .16 * Math.sin(t * 2.1));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    const gx = 960 + 60 * Math.sin(t * 1.1), gy = 560 + 35 * Math.sin(t * .8);
    ctx.fillStyle = E.rad(ctx, gx, gy, GR, [[0, rgba(P.halo1, GA)], [.3, rgba(P.halo1, .5 * GA)], [.65, rgba(P.shade0, .2 * GA)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------ 4.07 the token → the pause button (screen space)
  function token(ctx, t) {
    // the lens is at the screen centre with radius LENS_R (camera aim(F0, 960, HY, 1), drift 0): from here it is the button face,
    // first without bars (empty glass), the bars light on "One thing"; then the push: k = r / BUTTON_PLATE.r → 1 lands on the plate
    B.sky(ctx, 1);
    qGlow(ctx, t);
    const k0 = LENS_R / BUTTON_PLATE.r, grow = k0 * pushK(t), k = lerp(grow, 1, quartIO(span(t, a.one + .45, tPlate)));
    // "There is.": the answer leaves the lens as one soft ring of light, widening into the dark
    const ru = span(t, a.thereIs - .45, a.thereIs + 1.1);
    if (ru > 0 && ru < 1) {
      const rr = BUTTON_PLATE.r * grow * 1.02 + 1100 * (1 - (1 - ru) * (1 - ru));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba(P.halo1, .28 * Math.sin(Math.PI * ru) * (1 - ru * .5)); ctx.lineWidth = 10 + 50 * ru;
      ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.arc(960, 540, rr, 0, 6.29); ctx.stroke(); ctx.restore();
    }
    const bars = smooth(span(t, a.one - .1, a.one + .5));
    const panel = smooth(span(t, a.one + .45, tPlate - .1));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (panel > 0) {   // the brass panel unfolds from the button's ring outward (it fills the frame at k = 1)
      const hs = lerp(BUTTON_PLATE.r * k * 1.05, 1300 * k, panel), clip = new Path2D(); clip.roundRect(960 - hs, 540 - hs * lerp(1, .6, panel), 2 * hs, 2 * hs * lerp(1, .6, panel), hs * lerp(1, .06, panel));
      ctx.save(); ctx.clip(clip); ctx.translate(960, 540); ctx.scale(k, k); ctx.translate(-960, -540);
      ctx.fillStyle = E.lin(ctx, 0, 0, W, H, [[0, mixHex(P.night1, P.shade0, .12)], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = E.rad(ctx, 960, 300, 1300, [[0, rgba(P.shade0, .32)], [.5, rgba(P.shade0, .12)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(0, 0, W, H);
      const r = E.prng(16); ctx.strokeStyle = rgba(P.halo1, .05); ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) { const y = r() * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + (r() - .5) * 8); ctx.stroke(); }
      ctx.restore();
    }
    const R = BUTTON_PLATE.r * k, bx = 960 + 1.5 * E.drift(t, 1, 3) * panel;
    B.buttonFaceB(ctx, t, bx, 540, R, { bars });
    ctx.restore();
  }
}
