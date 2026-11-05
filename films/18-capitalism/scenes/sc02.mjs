// c02 · Level 2 · the risky question · T.G('A letter from your landlord') → T.G('Say you build the perfect case') · builder B1.
// Plan: docs/shots.md 2.01–2.08 · rules: docs/MOTION.md, docs/BRIEF-builders.md · helpers: lib/f16_b1_kit.mjs.
// ONE entry, one plan sequence, two worlds joined by a camera tilt that follows a carrier:
//   from plateChat (inside the chat box) the glass shrinks into YOUR PHONE (portrait) in a dark hallway (first person: your yellow
//   sleeves, the landlord's letter in the other hand, one cold ceiling light) → you type → your EXPECTATION (a dashed card, never
//   Claude's answer) rises out of the phone and the camera tilts up with it into the explainer night → its base line pivots into the
//   gold rule of the quote card → back down into the base line the brilliant friend stands on → that line folds into the bottom step of
//   the ★ staircase of the four values (the camera climbs) → the steps become weights on a balance (case by case) → back into steps →
//   a question mark of light rises; its hook winds into the dot; the dot drops: at the chunk end the frame is the screen-space night
//   with that dot at (960, 330): c03 opens the spotlight cone from it (inner seam, same function both sides: dotAt()).
//
// | ID   | anchor (word)                    | picture                                                       | 1–2 moves               | camera          |
// | 2.01 | landlord · don't understand      | plate glass → phone; LEVEL 2; the letter rises; print swims   | glass shrink · letter   | pull back       |
// | 2.02 | my rights                        | you type "Can they do this? What are my rights?"; reply EMPTY  | typing                  | slight push     |
// | 2.03 | lawyer · Safe · no help at all   | the dashed expectation card → LAWYER rises; stamp SAFE?; sinks | card · stamp            | tilt up with it |
// | 2.04 | pushes back · never              | its base line pivots up into the gold rule; quote card         | rule · lines rise       | breathe         |
// | 2.05 | brilliant friend · doctor …      | rule → base line, a person stands on it; 3 icons wake; quote 2 | person · icons          | breathe         |
// | 2.06★| lowest · guidelines · ethical · broadly safe · oversight | the staircase of the four values, step by step | steps grow + light | climbs  |
// | 2.07 | case by case · harder to predict | steps → weights on a beam; it rocks; the needle hunts          | beam · needle           | wide, breathe   |
// | 2.08 | outrank · Keep climbing · nicely | back into steps; a ? rises; the hook winds in; the dot drops   | ? · dot                 | rises with ?    |
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f16_kit.mjs';
import * as B from '../lib/f16_b1_kit.mjs';
import { plateChat, CHAT_PLATE, SEAM_HALF } from '../lib/f16_seams.mjs';
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

// ===================================================================================================== the inner seam c02 | c03
// The dot of the question mark, in SCREEN space, after it has dropped: both chunks draw it with this function (c03 grows the lamp from it).
export const DOT = { x: 960, y: 330, r: 15 };
// the question hangs: its light slowly widens into the dark (from "nicely" on), then c03's lamp gathers it into the cone.
// Screen space, drawn right after the sky on both sides of the seam.
export function dotGlow(ctx, t, T0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sm = (u) => u * u * (3 - 2 * u), sp = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  const g = sm(sp(t, T0 - 3.6, T0 - 1.4)) * (1 - sm(sp(t, T0 + .1, T0 + .7)));
  if (g > 0) {
    const u = sp(t, T0 - 3.6, T0 + .7), R = 160 + 1250 * (u * .85 + .15 * sm(u)), A = .42 * g * (1 + .06 * Math.sin(t * 2.3)), cy = DOT.y + 40 + 140 * u;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, DOT.x, cy, R, [[0, rgba(P.halo1, A)], [.3, rgba(P.halo1, .5 * A)], [.65, rgba(P.shade0, .2 * A)], [1, rgba(P.shade0, 0)]]);
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
}
export function dotAt(ctx, t, k = 1) {
  const br = 1 + .06 * Math.sin(t * 2.3);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  E.halo(ctx, DOT.x, DOT.y, DOT.r * 6 * k * br, .55, P.halo0, P.core0);
  ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(DOT.x, DOT.y, DOT.r * k, 0, 6.29); ctx.fill();
  ctx.restore();
}

// ===================================================================================================== geometry (F0 card, design px)
const PH = { x: 1050, y: 150, w: 400, h: 720 };                      // the phone screen (portrait)
const PHONE_L = B.chatLayoutRect(PH.x, PH.y, PH.w, PH.h, { s: .72, reply: [30, 470, 340, 80], input: 70, cr: 44, ch: 38 });
const PLATE_L = B.chatLayoutPlate(CHAT_PLATE.x, CHAT_PLATE.y, CHAT_PLATE.w);
const LET = { x: 470, y: 700, w: 400, h: 540, rot: -.1 };            // the landlord's letter (centre), in your left hand
const VP = { x: 760, y: 430 };                                       // hallway vanishing point
const LAMP = { x: 760, y: 120 };
// explainer night above the hallway (camera tilts up by ~1300)
const CARD = { x: 400, y: -900, w: 600, h: 215 };                    // the dashed expectation card (top-left), base line y + h
const BASE = CARD.y + CARD.h;                                        // -685: base line of the card → rule → base line → top of step 1
const RULE_L = 430;
const Q1 = { x: 462, y: -1030, size: 64, w: 1260 };
const Q1TEXT = 'Claude should never see unhelpful responses to the operator and user as an automatically safe choice.';
const Q2 = { x: 470, y: -1150, size: 62, w: 1320 };
const Q2TEXT = 'a brilliant friend who also has the knowledge of a doctor, lawyer, and financial advisor';
const ATTR = 'CLAUDE’S CONSTITUTION';
const FRIEND = { x: 590, h: 290 };
const ICONS = [['stethoscope', 880], ['para', 1100], ['coin', 1330]];
const ST = { x: 400, w: 380, r: 200, d: 150 };                       // the staircase: step i front x0 = x + i w, top = BASE - i r, base = BASE + r
const SBASE = BASE + ST.r;
const LABELS = [['GENUINELY', 'HELPFUL'], ['ANTHROPIC’S', 'GUIDELINES'], ['BROADLY', 'ETHICAL'], ['BROADLY', 'SAFE']];
const BEAM = { x: 1200, y: -760, half: 860, gap: 390, ww: 300, wh: 132 };
const Q = { x: 1800, y0: -1470, y1: -2230, s: 1 };                    // the question mark (dot centre), rises on "Keep climbing"

function scene(a) {
  const t1 = a.T0 + SEAM_HALF;                                       // the plate ends; the glass starts to shrink
  const tDrop = a.nicely + .95, tDropE = tDrop + .75;                // the dot detaches into screen space and drops to DOT
  const KC = [
    [t1, cam3()],
    [a.dont + .35, cam3({ z: -300, x: 30, y: 24 })],                          // pull back with the shrinking glass
    [a.can + .1, cam3({ z: -280, x: 46, y: 22 })],                            // breathe
    [a.expect2 - .05, cam3({ z: -150, x: 150, y: 10 })],                      // slight push to the phone while you type
    [a.lawyer2 + .35, cam3({ z: -150, x: 10, y: -1300 })],                    // tilt up with the rising card (it leads)
    [a.pushes + .2, cam3({ z: -125, x: 0, y: -1306 })],
    [a.friend - .2, cam3({ z: -45, x: -10, y: -1292 })],                       // a slow push while the quote is read
    [a.finE + .3, cam3({ z: -140, x: 20, y: -1312 })],
    [a.lowest - .9, aim(F0, 1040, -840, .9)],                                 // onto the bottom step (the friend on it); quote 2 stays in frame
    [a.veryTop + .2, aim(F0, 1260, -940, .9)],                                // one slow climb along the stairs while they grow
    [a.oversight + .6, aim(F0, 1340, -970, .94)],                             // breathe on the top step (the line under it)
    [a.values - .05, aim(F0, 1235, -885, .8)],                                // pull back: the whole staircase + source
    [a.harder2 + .2, aim(F0, 1220, -880, .84)],
    [a.keep - .1, aim(F0, 1420, -1190, .88)],
    [a.nicely + .1, aim(F0, Q.x, Q.y1, Q.s, 960, 300)],                       // rise with the question mark (stairs drop away)
    [a.end, aim(F0, Q.x, Q.y1 - 6, Q.s * 1.01, 960, 300)],
  ];
  const textH = (s) => s.length;
  return (ctx, t) => {
    const dAmt = .8 * smooth(span(t, t1, t1 + 1.6)) * (1 - smooth(span(t, tDrop - .6, tDrop)));
    const c = camDrift(camAt(t, KC), t, dAmt);
    B.sky(ctx, smooth(span(t, a.expect2, a.lawyer2 + .4)));
    if (t > a.end - 3.7) dotGlow(ctx, t, a.end);
    if (t < a.saying) hallway(ctx, t, c);
    card(ctx, c, F0, () => { if (t < a.nohelp + 2) phoneWorld(ctx, t); explainer(ctx, t, c); });
    if (t >= tDrop) {                                                         // the dot, now in screen space, drops to DOT
      const q = span(t, tDrop, tDropE), from = E.project(KC.length ? camDrift(camAt(tDrop, KC), tDrop, 0) : c, F0, Q.x, Q.y1) || [DOT.x, DOT.y - 60];
      const x = lerp(from[0], DOT.x, sineIO(q)), y = lerp(from[1], DOT.y, expoIn(q) * .7 + sineIO(q) * .3);
      if (q < 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); E.halo(ctx, x, y, DOT.r * 6, .55, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, DOT.r, 0, 6.29); ctx.fill(); ctx.restore(); }
      else dotAt(ctx, t);
    }
    K.level(ctx, t, { n: 2, title: 'The risky question', t0: t1, from: 1 });
    if (t < t1) plateChat(ctx, t);
  };

  // ------------------------------------------------------------------------------------------------------- the hallway (Z 2400)
  function hallway(ctx, t, c) {
    card(ctx, c, 1850, () => {
      const fade = (y0, y1) => [[0, rgba(P.night0, 0)], [1, rgba(P.night0, 1)]];
      // walls, floor, ceiling as flat perspective planes; everything above y ≈ 0 dissolves into the night (the tilt goes up there)
      const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
      const B0 = [640, 330, 880, 560];
      poly([[640, 330], [640, 560], [-500, 1460], [-500, -320]], E.lin(ctx, -500, 0, 640, 0, [[0, P.night0], [1, mixHex(P.ind0, P.blue1, .25)]]));
      poly([[880, 330], [2500, -560], [2500, 1560], [880, 560]], E.lin(ctx, 880, 0, 2500, 0, [[0, mixHex(P.ind0, P.blue1, .25)], [1, P.night0]]));
      poly([[640, 560], [880, 560], [2500, 1560], [-500, 1460]], E.lin(ctx, 0, 560, 0, 1300, [[0, mixHex(P.ind0, P.blue1, .2)], [.5, P.night1], [1, P.night0]]));
      poly([[640, 330], [880, 330], [2500, -560], [-500, -320]], E.lin(ctx, 0, -320, 0, 330, [[0, rgba(P.night0, 0)], [.5, rgba(P.night0, .8)], [1, P.night1]]));
      // the far end: a dim cold window
      ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(B0[0], B0[1], B0[2] - B0[0], B0[3] - B0[1]);
      ctx.fillStyle = E.lin(ctx, 0, 380, 0, 500, [[0, mixHex(P.ind1, P.blue1, .5)], [1, P.ind0]]); ctx.fillRect(722, 372, 76, 112);
      ctx.fillStyle = P.night1; ctx.fillRect(758, 372, 4, 112);
      // doors (darker trapezoids with a faint rim)
      for (const d of [[[180, 310], [360, 343], [360, 785], [180, 931]], [[1180, 334], [1420, 286], [1420, 894], [1180, 745]]]) {
        poly(d, mixHex(P.night0, P.ind0, .4)); ctx.strokeStyle = rgba(P.blue0, .28); ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.fillStyle = rgba(P.halo1, .5); ctx.beginPath(); ctx.arc(330, 600, 6, 0, 6.29); ctx.arc(1215, 560, 7, 0, 6.29); ctx.fill();   // knobs
      // the cold ceiling light (the hero of the hallway): fixture, bulb, a cone, the pool on the floor
      const fl = 1 - .12 * bump(t, a.dont - .1, .5);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath(); ctx.moveTo(LAMP.x - 46, LAMP.y + 18); ctx.lineTo(LAMP.x + 46, LAMP.y + 18); ctx.lineTo(LAMP.x + 330, 820); ctx.lineTo(LAMP.x - 330, 820); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 0, LAMP.y, 0, 820, [[0, rgba(mixHex(P.cream, P.blue0, .3), .2 * fl)], [1, rgba(P.blue0, .02)]]); ctx.fill();
      ctx.translate(VP.x, 760); ctx.scale(1, .16); ctx.fillStyle = E.rad(ctx, 0, 0, 520, [[0, rgba(mixHex(P.cream, P.blue0, .3), .32 * fl)], [1, rgba(P.blue0, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 520, 0, 6.29); ctx.fill();
      ctx.restore();
      ctx.fillStyle = E.lin(ctx, 0, -60, 0, LAMP.y, [[0, rgba(P.night1, 0)], [1, P.night1]]); ctx.fillRect(LAMP.x - 3, -60, 6, LAMP.y - 6 + 60);
      ctx.fillStyle = E.lin(ctx, LAMP.x - 60, 0, LAMP.x + 60, 0, [[0, P.night1], [.6, P.ind2], [1, P.night1]]); ctx.beginPath(); ctx.moveTo(LAMP.x - 24, LAMP.y - 6); ctx.lineTo(LAMP.x + 24, LAMP.y - 6); ctx.lineTo(LAMP.x + 56, LAMP.y + 18); ctx.lineTo(LAMP.x - 56, LAMP.y + 18); ctx.closePath(); ctx.fill();
      E.halo(ctx, LAMP.x, LAMP.y + 20, 120 * fl, .85 * fl, mixHex(P.cream, P.blue0, .25), P.core0);
      ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y + 20, 30, 8, 0, 0, 6.29); ctx.fill();
    });
  }

  // ------------------------------------------------------------------------------------------------------- the phone (F0)
  function phoneWorld(ctx, t) {
    const m = sineIO(span(t, t1, a.landlord + 1.6));                         // plate glass → phone screen
    const L = B.mixLayout(PLATE_L, PHONE_L, m);
    const up = sineIO(span(t, a.landlord - .2, a.moveOut + .9));             // the letter rises into view (your left hand)
    // your hands come up with the phone / letter from the bottom edge (first person: yellow raincoat sleeves)
    if (m > 0) {
      const hy = (1 - smooth(span(t, t1 + .2, a.landlord + 1.5))) * 520;
      sleeveHand(ctx, t, 1430, 930 + hy, -2.15, 150, 1);
    }
    if (up > 0) letter(ctx, t, up);
    // the phone body grows round the shrinking glass (behind it)
    if (m > 0) {
      const pad = 18 * m, body = new Path2D(); body.roundRect(L.x - pad, L.y - pad * 2.2, L.w + 2 * pad, L.h + pad * 4.4, L.cr + pad);
      ctx.fillStyle = E.lin(ctx, L.x, L.y, L.x + L.w, L.y + L.h, [[0, mixHex(P.ind2, P.blue1, .3)], [.5, P.night1], [1, P.night0]]); ctx.fill(body);
      ctx.strokeStyle = rgba(P.blue0, .5 * m); ctx.lineWidth = 2.5; ctx.stroke(body);
      E.halo(ctx, L.x + L.w / 2, L.y + L.h / 2, L.w * 1.1, .14 * m, P.blue0, P.blue1);
    }
    const typed = ['Can they do this?', 'What are my rights?'];
    const tyU = span(t, a.can - .45, a.rightsE - .05), sent = span(t, a.rightsE + .08, a.rightsE + .7);
    const sweep = [960 + 560 * Math.sin(t * .9), 470 + 120 * Math.sin(t * .53), 620, .16 * (1 - m)];
    B.chatGlass(ctx, t, L, {
      t0: 0, reply: 1, cursor: 1, sweep,
      bubbles: m >= 1 ? [{ lines: typed, size: 28, u: sent, x1: PH.x + PH.w - 26, y: PH.y + 64 }] : [],
      typing: m >= 1 && sent <= 0 ? { lines: typed, size: 27, u: tyU } : null,
    });
    // the polite card leaves the phone's top edge (2.03): drawn in explainer()
  }

  function sleeveHand(ctx, t, wx, wy, ang, Lp, side) {
    // the hand (behind the phone): a flat dark hand from f10 handPath, holding; the sleeve: your yellow raincoat
    const m = E.handMatrix(wx, wy, ang, Lp, side);
    const hp = new Path2D(); hp.addPath(E.handPath({ pose: 'hold', curl: .2 }), m);
    ctx.fillStyle = E.lin(ctx, wx, wy, wx + Math.cos(ang) * Lp, wy + Math.sin(ang) * Lp, [[0, mixHex(P.shade0, P.night1, .55)], [1, mixHex(P.shade0, P.night1, .3)]]); ctx.fill(hp);
    const sl = new Path2D(), c = Math.cos(ang), s = Math.sin(ang), nx = -s, ny = c, w0 = Lp * .62, w1 = Lp * .95, back = Lp * 4;
    sl.moveTo(wx - c * Lp * .25 + nx * w0, wy - s * Lp * .25 + ny * w0); sl.lineTo(wx - c * back + nx * w1, wy - s * back + ny * w1); sl.lineTo(wx - c * back - nx * w1, wy - s * back - ny * w1); sl.lineTo(wx - c * Lp * .25 - nx * w0, wy - s * Lp * .25 - ny * w0); sl.closePath();
    ctx.fillStyle = E.lin(ctx, wx + nx * w1, wy + ny * w1, wx - nx * w1, wy - ny * w1, [[0, E.COAT.lit], [.45, E.COAT.base], [1, E.COAT.shade]]); ctx.fill(sl);
    ctx.strokeStyle = rgba(E.COAT.deep, .8); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx - c * Lp * .45 + nx * w0 * 1.02, wy - s * Lp * .45 + ny * w0 * 1.02); ctx.lineTo(wx - c * Lp * .45 - nx * w0 * 1.02, wy - s * Lp * .45 - ny * w0 * 1.02); ctx.stroke();   // the cuff seam
  }

  function letter(ctx, t, up) {
    const { x, y, w, h, rot } = LET, dy = (1 - up) * 760;
    const swim = smooth(span(t, a.understand - .2, a.understand + .4)) * (1 - .6 * smooth(span(t, a.type2, a.can)));
    ctx.save(); ctx.translate(x, y + dy); ctx.rotate(rot + .03 * (1 - up));
    const pg = new Path2D(); pg.rect(-w / 2, -h / 2, w, h);
    E.glowFill(ctx, pg, 60, .25, P.blue0);
    ctx.fillStyle = E.lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.cream, P.blue0, .35)], [.6, mixHex(P.halo2, P.blue1, .45)], [1, mixHex(P.shade1, P.ind1, .5)]]); ctx.fill(pg);
    // the letterhead (a bar), then the small print: rows of short strokes; they swim on "don't understand"
    ctx.fillStyle = rgba(P.night1, .75); ctx.fillRect(-w / 2 + 40, -h / 2 + 46, 150, 16); ctx.fillRect(-w / 2 + 40, -h / 2 + 74, 90, 8);
    ctx.strokeStyle = rgba(P.night1, .6); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 14; i++) {
      const yy = -h / 2 + 128 + i * 26, len = w - 80 - (i % 4 === 3 ? 140 : 0) - (i === 13 ? 200 : 0);
      ctx.beginPath();
      for (let k = 0; k <= 24; k++) { const u = k / 24, xx = -w / 2 + 40 + u * len, yo = swim * (6 * Math.sin(u * 7 + t * 2.1 + i * .9) + 3 * Math.sin(t * 1.3 + i)); k ? ctx.lineTo(xx + swim * 8 * Math.sin(t * 1.7 + i * 1.3), yy + yo) : ctx.moveTo(xx + swim * 8 * Math.sin(t * 1.7 + i * 1.3), yy + yo); }
      ctx.stroke();
    }
    ctx.restore();
    sleeveHand(ctx, t, x - 120, y + dy + h / 2 + 30, -1.25, 140, -1);
  }

  // ------------------------------------------------------------------------------------------------------- the explainer night (F0, y < 0)
  function explainer(ctx, t, c) {
    // 2.03 the expectation card: leaves the phone top, rises on an arc to CARD (dashed outline = imagined), stamp, cools, sinks
    const c0 = a.expect2 + .15, c1 = a.lawyer2 + .25;
    const sinkS = a.nohelp + .45, sinkU = expoIn(span(t, sinkS, sinkS + .6));
    if (t > c0 && sinkU < 1) {
      const q = span(t, c0, c1), e = sineIO(q);
      const sx = lerp(PH.x + PH.w / 2, CARD.x + CARD.w / 2, e), sy = lerp(PH.y - 30, CARD.y + CARD.h / 2, e) - Math.sin(Math.PI * e) * 120, sc = lerp(.35, 1, sineIO(span(t, c0, c0 + 1.1)));
      const cool = smooth(span(t, a.nohelp - .1, a.nohelp + .45));
      ctx.save();
      if (sinkU > 0) { ctx.beginPath(); ctx.rect(-4000, -6000, 8000, 6000 + BASE); ctx.clip(); ctx.translate(0, sinkU * (CARD.h + 40)); }
      ctx.translate(sx, sy); ctx.scale(sc, sc); ctx.rotate(-.03 * (1 - e));
      politeCard(ctx, t, cool);
      if (t > a.safe2 - .3) K.stamp(ctx, t, 'SAFE?', 150, -6, { t0: a.safe2 - .02, size: 40, rot: -.09, ink: mixHex(P.cream, P.blue0, cool * .5) });
      ctx.restore();
    }
    // the base line of the card stays; on "pushes back" it warms to gold and pivots up into the quote's rule; at the end of the
    // quote it pivots back down: the base line the friend stands on; it extends right for the icons; it folds into step 1.
    const base0 = sinkS + .2, up = quartIO(span(t, a.pushes - .25, a.pushes + .75)), downS = a.goal + .55, down = quartIO(span(t, downS, downS + .8));
    const ext = sineIO(span(t, a.friend + .55, a.friend + 1.5)), fold = sineIO(span(t, a.finE + 4.3, a.finE + 5.2));
    if (t > base0 && fold < 1) {
      const ph = -Math.PI / 2 * up * (1 - down), gold = smooth(span(t, a.here - .1, a.pushes + .3));
      const len = lerp(CARD.w, RULE_L, up) + (ST.w * 3 - CARD.w + 180) * ext * (1 - fold), x0 = CARD.x;
      const col = mixHex(mixHex(P.cream, P.blue0, .5), P.halo0, gold);
      const shrink = fold > 0 ? lerp(len, ST.w, fold) : len;
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = 3;
      ctx.shadowColor = rgba(P.halo0, .7 * gold); ctx.shadowBlur = 16 * gold;
      ctx.beginPath(); ctx.moveTo(x0, BASE); ctx.lineTo(x0 + Math.cos(ph) * shrink, BASE + Math.sin(ph) * shrink); ctx.stroke(); ctx.restore();
      if (gold > 0 && up > 0 && up < 1) E.halo(ctx, x0 + Math.cos(ph) * len, BASE + Math.sin(ph) * len, 22, .8, P.halo0, P.core0);
      // "Here the document …": a spark runs along the resting line to its tip, where the pivot starts
      const run = span(t, a.here - .15, a.pushes - .25);
      if (run > 0 && up <= 0) E.halo(ctx, x0 + len * sineIO(run), BASE, 22, .8 * smooth(span(run, 0, .15)), P.halo0, P.core0);
    }
    // 2.04 the quote card (stands ≥ 4 s while the voice runs on)
    const q1t0 = a.pushes + .62, q1t1 = Math.max(q1t0 + 4.6, a.goal + .45);
    if (t > q1t0 - .1 && t < q1t1 + 1.6)
      K.quote(ctx, t, { text: Q1TEXT, attr: ATTR, x: Q1.x, y: Q1.y, size: Q1.size, w: Q1.w, t0: q1t0, t1: q1t1, gold: [['never', a.never - .05], ['automatically safe', a.auto - .05]] });
    // 2.05 the friend on the base line, the three icons, the second quote above them
    const fr = K.rise(span(t, a.friend - .15, a.friend + .75));
    const blocks = stairBlocks(t);
    const fx = blocks[0] ? blocks[0].x0 + FRIEND.x - ST.x : FRIEND.x, fy = blocks[0] ? blocks[0].yt : BASE;
    if (fr > 0) B.fromBase(ctx, fy, fr, FRIEND.h + 20, () => E.person(ctx, fx, fy, FRIEND.h, { pose: 'stand', dir: 1, light: -1, look: .15, rim: mixHex(P.blue0, P.halo1, .5) }));
    const iconsOut = expoIn(span(t, a.finE + 3.9, a.finE + 4.5));
    ICONS.forEach(([nm, x], i) => {
      const tw = [a.doctor, a.lawyerB, a.fin][i], u = K.rise(span(t, tw - .15, tw + .55)) * (1 - iconsOut);
      if (u > 0) B.fromBase(ctx, BASE - 6, u, 190, () => { B.icon16(ctx, nm, x, BASE - 92, 130, { glow: 1 + bump(t, tw, .6) }); });
    });
    const q2t0 = a.finE + .38, q2t1 = Math.max(q2t0 + 4.5, a.lowest - 1.3);
    if (t > q2t0 - .1 && t < q2t1 + 1.6)
      K.quote(ctx, t, { text: Q2TEXT, attr: ATTR, x: Q2.x, y: Q2.y, size: Q2.size, w: Q2.w, t0: q2t0, t1: q2t1, gold: [['brilliant friend', q2t0 + 1.1]] });
    // 2.06 ★ the staircase (2.07 the balance, 2.08 back into steps)
    stairs(ctx, t, blocks);
    // 2.08 the question mark: draws itself above the top step, rises with the camera, the hook winds into the dot
    question(ctx, t);
  }

  function politeCard(ctx, t, cool) {
    const w = CARD.w, h = CARD.h, ink = mixHex(P.cream, P.blue0, .55 * cool);
    ctx.fillStyle = rgba(mixHex(P.ind1, P.night1, .3), .55); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 26); ctx.fill();
    ctx.setLineDash([16, 12]); ctx.strokeStyle = rgba(ink, .85); ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]);
    B.icon16(ctx, 'signpost', -w / 2 + 108, 0, 120, { col: mixHex(P.halo0, P.blue0, cool * .7), glow: 1 - cool });
    E.glowText(ctx, 'LAWYER', -w / 2 + 210, 18, { size: 56, weight: 600, spacing: .14, col: ink, glow: cool < .5 });
  }

  // the staircase blocks for time t (null where a step does not exist yet); morph m: steps → weights on the beam
  function stairBlocks(t) {
    const fold = sineIO(span(t, a.finE + 4.3, a.finE + 5.2));
    const grow = [fold, expoOut(span(t, a.guide - .7, a.guide + .05)), expoOut(span(t, a.ethical - .7, a.ethical + .05)), expoOut(span(t, a.veryTop - .5, a.veryTop + .35))];
    const m = sineIO(span(t, a.weighed - .1, a.weighed + 1.1)) * (1 - sineIO(span(t, a.outrank - .15, a.outrank + 1.05)));
    const rock = smooth(span(t, a.cbc - .4, a.cbc + .4)) * m;
    const th = rock * (.045 * Math.sin((t - a.cbc) * 1.25) + .02 * Math.sin((t - a.cbc) * 2.3 + 1)) + .03 * m * smooth(span(t, a.cbc - .4, a.cbc + .6));
    const out = [];
    for (let i = 0; i < 4; i++) {
      if (grow[i] <= 0) { out.push(null); continue; }
      const sx0 = ST.x + i * ST.w, syt = i === 0 ? BASE : lerp(SBASE, BASE - i * ST.r, grow[i]), syb = i === 0 ? lerp(BASE, SBASE, grow[0]) : SBASE;
      const off = (i - 1.5) * BEAM.gap, px = BEAM.x + Math.cos(th) * off, py = BEAM.y + Math.sin(th) * off;
      out.push({ x0: lerp(sx0, px - BEAM.ww / 2, m), yt: lerp(syt, py - BEAM.wh, m), yb: lerp(syb, py, m), w: lerp(ST.w, BEAM.ww, m), d: lerp(ST.d, 90, m), grow: grow[i], m, th });
    }
    out.m = m; out.th = th;
    return out;
  }
  function stairs(ctx, t, bl) {
    const m = bl.m, th = bl.th;
    if (m > 0) {   // the beam, the fulcrum and the needle grow out of the middle while the steps become weights
      const g = m, bx = BEAM.x, by = BEAM.y, c = Math.cos(th), s = Math.sin(th), hl = BEAM.half * g;
      const ful = new Path2D(); ful.moveTo(bx, by + 6); ful.lineTo(bx + 90 * g, by + 230 * g); ful.lineTo(bx - 90 * g, by + 230 * g); ful.closePath();
      ctx.fillStyle = E.lin(ctx, 0, by, 0, by + 230, [[0, mixHex(P.ind2, P.blue1, .5)], [1, P.night1]]); ctx.fill(ful); ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = 2; ctx.stroke(ful);
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = P.halo0; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(bx - c * hl, by - s * hl); ctx.lineTo(bx + c * hl, by + s * hl); ctx.stroke(); ctx.restore();
    }
    const lit = [smooth(span(t, a.lowest - .1, a.lowest + .45)), smooth(span(t, a.guide - .1, a.guide + .45)), smooth(span(t, a.ethical - .1, a.ethical + .45)), smooth(span(t, a.bsafe - .1, a.bsafe + .45))];
    const lu = [span(t, a.lowest - .05, a.lowest + .9), span(t, a.guide - .05, a.guide + .9), span(t, a.ethical - .05, a.ethical + .9), span(t, a.bsafe - .05, a.bsafe + .9)];
    // draw from the top step down so a lower step's top face is never covered by a higher step's side
    for (let i = 0; i < 4; i++) {
      const b = bl[i]; if (!b) continue;
      const hot = i === 3 ? .25 * bump(t, a.bsafe - .1, 1.2) : 0;
      B.stepBlock(ctx, b.x0, b.yt, b.yb, b.w, b.d, Math.min(1, lit[i] + hot), { labels: LABELS[i], lu: lu[i], size: 34,
        sub: i === 3 ? ['not undermining', 'human oversight'] : null, su: i === 3 ? span(t, a.oversight - .2, a.oversight + .8) * (1 - b.m) : 0 });
    }
    if (m > 0) {
      const g = m, bx = BEAM.x, by = BEAM.y;
      // the needle: it hunts and never settles ("harder to predict")
      const hunt = smooth(span(t, a.harder2 - .3, a.harder2 + .4));
      const na = th * 3 + hunt * (.32 * Math.sin((t - a.harder2) * 2.1) + .18 * Math.sin((t - a.harder2) * 3.7 + 2)), nl = 300 * g;
      ctx.strokeStyle = rgba(P.halo1, .45 * g); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, by, nl * .9, -Math.PI / 2 - .6, -Math.PI / 2 + .6); ctx.stroke();
      ctx.strokeStyle = P.core1; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.sin(na) * nl, by - Math.cos(na) * nl); ctx.stroke();
      E.halo(ctx, bx, by, 26, .8 * g, P.halo0, P.core0);
    }
    // the source under the staircase (the on-screen line of the VO), while the whole staircase is in view
    const su = K.rise(span(t, a.developE - .2, a.developE + .7)) * (1 - expoIn(span(t, a.weighed - .3, a.weighed + .2)));
    if (su > 0) K.maskLine(ctx, [[ATTR, 0]], ST.x, SBASE + 70, 26, su, { serif: false, weight: 600, col: P.halo2, glow: false, spacing: .1 });
  }

  function question(ctx, t) {
    const d0 = a.outrank + 1.0, rise = sineIO(span(t, a.keep - .2, a.nicely + .2));
    const qy = lerp(Q.y0, Q.y1, rise), qx = Q.x;
    const hookIn = smooth(span(t, a.nicely - .05, a.nicely + .85));
    if (t < d0) return;
    const S = 1.15, pts = E.catmull([[-62, -150, 1], [-50, -215, 1], [10, -248, 1], [70, -222, 1], [80, -160, 1], [40, -112, 1], [2, -84, 1], [0, -44, 1]].map(([x, y]) => [qx + x * S, qy + y * S, 1]), 10).map((p) => [p[0], p[1]]);
    const draw = smooth(span(t, d0, d0 + .85));
    if (hookIn < 1) K.trailSpan(ctx, pts, hookIn, draw, { w: 7, spark: draw < 1 || hookIn > 0 });
    if (t < tDrop) { const dr = smooth(span(t, d0 + .55, d0 + 1.0)); if (dr > 0) { E.halo(ctx, qx, qy, DOT.r * 6 * dr, .55, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(qx, qy, DOT.r * dr * (1 + .25 * bump(t, a.nicely + .7, .5)), 0, 6.29); ctx.fill(); } }
  }
}
