// Film 49 · c06 (B2) · THE STATEMENT · C5 · subscribe 1 (the crowd ★) · you turn: a half-open door, a blue glow.
// B2 is ONE continuous take from plateWork ('But you can only do so much') to plateMachine ('That is what the experts know'):
// this file holds the group driver (anchors, the one camera path through c06–c08, "you", the shared world pieces) and the c06 layers;
// scenes/sc07.mjs and scenes/sc08.mjs hold their layers and return the SAME draw function for their ranges, so the inner seams c06/c07 and
// c07/c08 are identical frames by construction. Anchors are phrases (T.G after the group start), clip slots T.clip(id), steps F.stepHit.
//
// | beat  | phrase (VO)                         | picture                                                                                     | camera / kind      |
// |-------|-------------------------------------|---------------------------------------------------------------------------------------------|--------------------|
// | 4.11  | But you can only do so much         | out of plateWork (creep continues): you alone at the desk; the office around you             | creep · MIX        |
// |       | This summer … signed one statement  | the paper on your desk lifts, flies up and UNROLLS into the statement: “We must act now.”,  | desk left · EXPL   |
// |       |                                     | a long list of signatures rolls, 200+ SIGNATORIES counts up; source line                    |                    |
// | 4.12  | Not to pause. / To prepare.         | the list slows and stops: NOT TO PAUSE is struck through, TO PREPARE in gold                 | creep · EXPL       |
// | 4.13  | One of its organizers … the case    | one signature lights gold; C5 grows out of that line (F.clipPlate) and goes back into it     | CLIP               |
// | M.01★ | This channel exists … everybody     | the list rolls up and flies back onto the desk while the camera pulls back wide: the whole  | pull back · LAND   |
// |       | Want that too? Then subscribe.      | stairs and the door; many small figures walk in from the night and climb the lower steps;   |                    |
// |       |                                     | GOES WELL / FOR EVERYBODY (no button, no QR)                                                 |                    |
// | M.02  | You met this machine as an adult    | back close on you at the desk; on the step above a door pops up, half open, a blue glow;    | push in · SCENE    |
// |       |                                     | you look up and back at it                                                                   |                    |
// | M.03  | But what about the next generation  | you walk to the carved stair; the camera rises toward the third step                         | rise · MIX         |
// Carriers: plateWork (creep) → the desk paper (= the statement) → the signature line (= C5) → the paper back on the desk → the crowd's
// walk → the blue glow of the door (→ c07: the screen under the blanket).
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import * as L7 from './sc07.mjs';
import * as L8 from './sc08.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, halo, P, W, H } = E;
const { GOLD, PAPER, COOL, LAMP } = F;
const TAU = Math.PI * 2;
const A = (u, v, s, sx = W / 2, sy = H / 2) => E.aim(S.Z_LAND, u, v, s, sx, sy);
export const PH0 = 'But you can only do so much', PH1 = 'That is what the experts know';

// ======================================================================================================== anchors (phrases only)
export function anchors(T) {
  const T0 = T.G(PH0), g = (p, d = 0) => T.G(p, 0, T0 - .2) + d, ge = (p, d = 0) => T.GE(p, 0, T0 - .2) + d;
  const a = {
    T0, p0: T0 + S.SEAM_HALF, T1: T.G(PH1), summer: g('This summer'), twoHundred: g('more than two hundred'), signed: g('signed one statement'),
    notPause: g('Not to pause'), prepare: g('To prepare'), organizers: g('One of its organizers'), erik: g('Erik Brynjolfsson'), theCase: g('makes the case'),
    channel: g('This channel exists'), arrival: g('so that the arrival'), everybody: g('goes well for everybody'), want: g('Want that too'), subscribe: g('Then subscribe'),
    met: g('You met this machine'), adult: g('as an adult'), nextGen: g('But what about the next'), growing: g('the people growing up'),
    three: g('Three years to go'), hit2: F.stepHit(T, 2), family: g('This step is your family'), children: g('Your children'), grand: g('Your grandchildren'),
    teens: g('Three in four teenagers'), most: g('Most have tried'), friendLike: g('a chatbot you talk to'),
    california: g('California now has a law'), must: g('A companion chatbot must'), child: g('tell a child'), hours: g('every three hours'), notHuman: g('that it is not a human'),
    somebody: g('Somebody had to write'), write: g('write that sentence'), intoLaw: g('into law'), harari: g('Harari has a name'), psych: g('a psychological experiment'),
    adapt: g('the next generation can'), needs: g('It needs you'), reflex: g('The reflex is to forbid'), forbid: g('forbid the machine'), ban: g('But a ban may'),
    ask: g('So ask instead'), q1: g('Which A.I. do you talk'), q2: g('What for'), q3: g('Is there one'), read: g('Then ask to read'), protects: g('That protects against'),
    act: g('But if a machine can already act'), howClose: g('how close is the rest'), real: g('Are the five years'),
    two: g('Two years to go'), hit3: F.stepHit(T, 3), itself: g('This step is the machine'), notFact: g('Five years to full'), fact: g('not a fact'),
    deadline: g('A short deadline'), raise: g('raise money'), later: g('many outside experts'), underest: g('But so far, the experts'), repeatedly: g('repeatedly underestimated'),
    chatbot: g('The chatbot most people'), school: g('old enough for school'), count: g('By its maker'), billion: g('passed a billion'),
    generation: g('And even most of their'), less: g('less than a generation'), worth: g('So it is the deadline'), early: g('If it takes longer'), ready: g('If it takes five'),
    C5: T.clip('C5'), C16: T.clip('C16'),
  };
  a.p1 = a.T1 - S.SEAM_HALF;
  a.adultE = ge('as an adult');
  return a;
}

// ======================================================================================================== small shared tools
export const proj = (c, u, v) => { const p = E.project(c, S.Z_LAND, u, v); return p ? { x: p[0], y: p[1], k: p[2] } : { x: -9999, y: -9999, k: 0 }; };
const mixCam = (p, q, w) => E.cam3({ x: lerp(p.x, q.x, w), y: lerp(p.y, q.y, w), z: lerp(p.z, q.z, w), f: p.f });
// 1D monotone cubic through keys [[t, v]…] (zero speed only at the two ends)
export function mono(t, K) {
  const n = K.length; if (t <= K[0][0]) return K[0][1]; if (t >= K[n - 1][0]) return K[n - 1][1];
  let i = 0; while (i < n - 2 && t > K[i + 1][0]) i++;
  const sec = (j) => (K[j + 1][1] - K[j][1]) / (K[j + 1][0] - K[j][0]);
  const tan = (j) => { if (j === 0 || j === n - 1) return 0; const p = sec(j - 1), q = sec(j); if (p * q <= 0) return 0; const m = (p + q) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(p), 3 * Math.abs(q)); };
  const h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * K[i][1] + (u3 - 2 * u2 + u) * tan(i) * h + (-2 * u3 + 3 * u2) * K[i + 1][1] + (u3 - u2) * tan(i + 1) * h;
}
// in/out window: rises over [t0, t0 + d], sinks over [t1 - d2, t1]
export const io = (t, t0, t1, d = .8, d2 = .6) => sineIO(span(t, t0, t0 + d)) * (1 - sineIO(span(t, t1 - d2, t1)));
// a screen card that rises out of its own bottom edge (an invisible mask) and sinks back: k 0..1
export function inMask(ctx, box, k, fn) {
  if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath(); ctx.rect(box.x - 60, box.y - 80, box.w + 120, box.h + 92); ctx.clip();
  ctx.translate(0, (1 - expoOut(k)) * (box.h + 100)); fn(); ctx.restore();
}
// an ink scribble (a signature you cannot read), seeded
const SCR = new Map();
export function scrib(ctx, x, y, w, amp, seed, col, lw, u = 1) {
  if (!SCR.has(seed)) { const r = E.prng(seed * 7 + 3), pts = []; let px = 0; for (let i = 0; i < 22; i++) { px += .5 + r() * 1.1; pts.push([px, (r() - .5) * (i % 4 === 0 ? 1.8 : 1)]); } SCR.set(seed, pts.map(([p, q]) => [p / px, q])); }
  const pts = SCR.get(seed), n = Math.max(2, Math.ceil(pts.length * clamp(u)));
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let i = 0; i < n; i++) { const X = x + pts[i][0] * w, Y = y + pts[i][1] * amp; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
  ctx.stroke();
}
// the lit state of the five steps (counter-synchronous; the step before eases down, never a jump)
export function litAt(T, t) {
  const h = [0, 1, 2, 3, 4].map((i) => F.stepHit(T, i));
  return [0, 1, 2, 3, 4].map((i) => {
    if (t < h[i] - .05) return .3;
    const on = .3 + .7 * F.stepLight(T, t, i);
    return i + 1 < 5 && t >= h[i + 1] - .05 ? lerp(on, .6, smooth(span(t, h[i + 1], h[i + 1] + 1.2))) : on;
  });
}
// a figure flip (turning round): dir runs through ~0 in .3 s (reads as a turn)
const flip = (t, t0, from, d = .3) => { const u = span(t, t0, t0 + d); if (u <= 0) return from; if (u >= 1) return -from; const v = from * Math.cos(Math.PI * sineIO(u)); return Math.abs(v) < .07 ? Math.sign(v || -from) * .07 : v; };
// pop-up fold factor of the world's stage sets (same curve as lib popUp)
export const popK = (u, i = 0) => expoOut(clamp(u * 1.6 - i * .12));
export function popScale(ctx, k, y, fn) { if (k <= 0) return; ctx.save(); ctx.translate(0, y); ctx.scale(1, k); ctx.translate(0, -y); fn(); ctx.restore(); }

// ======================================================================================================== "you" through the whole group
// returns { x, y, o, seat } (seat 0..1: sitting on the bed edge, the lower body hidden behind the divan; drawn clipped in land())
export function youAt(t, a) {
  const y1 = S.STAGES[1].y, y2 = S.STAGES[2].y, y3 = S.STAGES[3].y, DX = S.WORK_DESK.x - 52;
  const walk = (x0, x1, t0, t1, y, dir) => { const u = span(t, t0, t1), x = lerp(x0, x1, sineIO(u)); return { x, y, o: { walk: Math.abs(x - x0) / 13, dir, look: .25, back: .25 } }; };
  // c06: at the desk (the plate pose), look up toward the door during the wide, then back at the step above (the half-open door)
  const tFlipA = a.nextGen + .25, tWalk0 = tFlipA + .3, tWalk1 = tWalk0 + 2.0, tFlipB = tWalk1 + .1, tClimb0 = a.three - .15, tClimb1 = tClimb0 + 1.8;
  if (t < tWalk0) {
    const look = lerp(lerp(lerp(.1, .45, smooth(span(t, a.arrival - .5, a.everybody + .5))), .1, smooth(span(t, a.subscribe + .6, a.met))), .78, smooth(span(t, a.adult - .1, a.adultE + .5)));
    const back = lerp(.2, .55, smooth(span(t, a.adult - .1, a.adultE + .5)));
    const rel = smooth(span(t, a.nextGen - .3, a.nextGen + .25));   // the arm leaves the desk before the turn
    return { x: DX, y: y1, o: { armR: [lerp(.75, .2, rel), lerp(2.35, .1, rel)], look: lerp(look, .3, rel), back: lerp(back, .3, rel), dir: flip(t, tFlipA, 1) } };
  }
  if (t < tWalk1) return walk(DX, S.STEPS[2].L - 84, tWalk0, tWalk1, y1, -1);
  if (t < tClimb0) return { x: S.STEPS[2].L - 84, y: y1, o: { look: lerp(.3, .6, span(t, tWalk1, tClimb0)), back: .3, dir: flip(t, tFlipB, -1) } };
  if (t < tClimb1) { const u = span(t, tClimb0, tClimb1), p = S.climbPos(2, u); return { x: p.x, y: p.y, o: { walk: u * 9, dir: 1, look: .4 } }; }
  // c07: on tread 2 (the home), then to the bed, sit, stand
  const xs = 1050, xb = 1240, tStep1 = tClimb1 + .9;
  if (t < tStep1) return walk(S.STEPS[2].L + 26, xs, tClimb1, tStep1, y2, 1);
  const tBed0 = a.ask + .1, tBed1 = tBed0 + 1.7, tSit1 = tBed1 + .6;
  if (t < tBed0) {
    const look = lerp(lerp(.3, .15, smooth(span(t, a.adapt, a.adapt + 1))), .05, smooth(span(t, a.reflex, a.forbid + .2)));
    return { x: xs, y: y2, o: { look, back: .3, dir: 1, armR: [lerp(.2, .55, F.bump(t, a.forbid - .25, 1.1)), lerp(.1, .9, F.bump(t, a.forbid - .25, 1.1))] } };
  }
  if (t < tBed1) return walk(xs, xb, tBed0, tBed1, y2, 1);
  const tUp0 = a.real + .9, tUp1 = tUp0 + .6;
  if (t < tUp1) {
    const seat = smooth(span(t, tBed1, tSit1)) * (1 - smooth(span(t, tUp0, tUp1)));
    const look = lerp(lerp(.05, .0, smooth(span(t, a.read, a.read + .8))), .85, smooth(span(t, a.act + 1.6, a.howClose + .2)));
    return { x: xb, y: y2, seat, o: { look, back: lerp(.25, .4, span(t, a.act, a.howClose)), dir: 1, lean: .07 * smooth(span(t, a.read, a.read + .8)) * (1 - span(t, a.act, a.act + 1)) } };
  }
  // c08: to the carved stair of block 3, climb, walk into the living room, turn to the TV (the plateMachine pose)
  const tF1 = a.two - .45, tW0 = tF1 + .3, tW1 = tW0 + 1.2, tF2 = tW1 + .05, tC0 = tF2 + .35, tC1 = tC0 + 1.6, tR1 = tC1 + 3.1, tF3 = tR1 + .1;
  const xc = S.STEPS[3].L - 84;
  if (t < tW0) return { x: xb, y: y2, o: { look: lerp(.6, .3, span(t, tUp1, tF1)), back: .35, dir: flip(t, tF1, 1) } };
  if (t < tW1) return walk(xb, xc, tW0, tW1, y2, -1);
  if (t < tC0) return { x: xc, y: y2, o: { look: .55, back: .3, dir: flip(t, tF2, -1) } };
  if (t < tC1) { const u = span(t, tC0, tC1), p = S.climbPos(3, u); return { x: p.x, y: p.y, o: { walk: u * 9, dir: 1, look: .4 } }; }
  if (t < tR1) return walk(S.STEPS[3].L + 26, S.STAGES[3].x0 + 400, tC1, tR1, y3, 1);
  return { x: S.STAGES[3].x0 + 400, y: y3, o: { look: lerp(.3, .2, span(t, tR1, tR1 + .8)), back: lerp(.3, .45, span(t, tR1, tR1 + .8)), dir: flip(t, tF3, 1) } };
}
// draw you exactly like stairsWorld does (same defaults), seated = lowered behind the divan and clipped at the tread
export function drawYou(ctx, y) {
  const o = { light: 1, back: .35, dir: 1, look: .8, ...(y.o ?? {}) };
  if (!y.seat) { E.du(ctx, y.x, y.y, S.YOU_H, o); return; }
  ctx.save(); ctx.beginPath(); ctx.rect(y.x - 400, y.y - 600, 800, 600 - 1); ctx.clip();
  E.du(ctx, y.x, y.y + 36 * y.seat, S.YOU_H, o); ctx.restore();
}

// ======================================================================================================== the desk (S.workDesk, foldable, the paper can lift)
function desk(ctx, t, o = {}) {
  const x = S.WORK_DESK.x, y = S.STAGES[1].y, k = o.k ?? 1;
  popScale(ctx, k, y, () => {
    ctx.fillStyle = P.night0; ctx.fillRect(x - 70, y - 62, 160, 8); ctx.fillRect(x - 62, y - 54, 6, 54); ctx.fillRect(x + 78, y - 54, 6, 54);
    if ((o.paper ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= o.paper ?? 1; ctx.fillStyle = rgba(PAPER.lit, .75); ctx.fillRect(x - 54, y - 66, 40, 4); ctx.fillRect(x - 48, y - 70, 36, 4); ctx.restore(); }
    ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 6, y - 62); ctx.lineTo(x + 4, y - 96); ctx.lineTo(x + 18, y - 100); ctx.stroke(); halo(ctx, x + 18, y - 96, 50, .4 * k, GOLD.halo, LAMP.core);
    S.laptop(ctx, t, x + 52, y - 62, 44, { on: 1 });
  });
  const cx = x + 40, cy = S.STEPS[2].top + 40;   // the wall calendar (closed) folds up into the step edge
  popScale(ctx, k, cy, () => { ctx.fillStyle = PAPER.body; ctx.fillRect(cx - 34, cy, 68, 60); ctx.fillStyle = mixHex(GOLD.deep, P.night1, .3); ctx.fillRect(cx - 34, cy, 68, 12); });
}
export const DESK_PAPER = { x: S.WORK_DESK.x - 54, y: S.STAGES[1].y - 70, w: 40, h: 8 };

// ======================================================================================================== the half-open door on tread 2 (c06 → c07)
export const DOOR2 = { x: 1122, w: 54, h: 142 };
export function door2(ctx, t, u, glow = 1) {
  const k = popK(u), y = S.STAGES[2].y, { x, w, h } = DOOR2; if (k <= 0) return;
  popScale(ctx, k, y, () => {
    ctx.fillStyle = mixHex(P.night1, COOL.deep, .55); ctx.fillRect(x, y - h, w, h);                                          // the opening: blue light inside
    ctx.fillStyle = lin2(ctx, x, y - h, x + w, y, [[0, rgba(COOL.core, .55 * glow)], [1, rgba(COOL.halo, .15 * glow)]]); ctx.fillRect(x + 4, y - h + 4, w - 8, h - 4);
    const sw = .55 + .04 * Math.sin(t * .7);   // the panel, half open (a dark leaf swung toward you)
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.moveTo(x + w, y - h); ctx.lineTo(x + w - w * sw, y - h - 8); ctx.lineTo(x + w - w * sw, y + 4); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = mixHex(P.night0, P.ind1, .25); ctx.lineWidth = 7; ctx.strokeRect(x - 3, y - h - 3, w + 6, h + 3);
  });
  if (glow > 0) { halo(ctx, x + w * .4, y - h * .45, 120 * k, .3 * glow * k, COOL.halo, COOL.core); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, x + w * .3, y, 150, [[0, rgba(COOL.halo, .28 * glow * k)], [1, rgba(COOL.halo, 0)]]); ctx.beginPath(); ctx.ellipse(x + w * .3, y + 2, 150 * k, 10, 0, 0, TAU); ctx.fill(); ctx.restore(); }
}
function lin2(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); for (const [o, c] of stops) g.addColorStop(o, c); return g; }

// ======================================================================================================== the crowd (subscribe 1 ★): walk in from the night, climb the lower steps
const CROWD = [160, 150, 108, 166, 154, 112, 158, 146, 170, 104, 152].map((h, i) => ({ h, x0: -300 - i * 88, end: i < 3 ? 548 - i * 50 : 296 - (i - 3) * 60, ph: i * 1.7, long: i % 3 === 1 }));
function crowdAt(t, a, ctx) {
  const t0 = a.channel + 2.0, v = 150, sx0 = S.STEPS[0].L - 84, sx1 = S.STEPS[0].L + 26, y0 = S.STAGES[0].y;
  if (t < t0 || t > a.hit2 + 3) return;
  for (const c of CROWD) {
    const d = (t - t0) * v, plainLen = Math.max(0, Math.min(c.end, sx0) - c.x0);
    let x, y, o;
    if (d < plainLen) { x = c.x0 + d; y = S.GY; o = { walk: d / (c.h * .085), dir: 1, light: .75 }; }
    else if (c.end <= sx0) { x = c.end; y = S.GY; o = { look: lerp(.2, .55, span(t, t0 + plainLen / v, t0 + plainLen / v + 1.5)), back: .35, light: .75, long: c.long }; }
    else {
      const dc = d - plainLen, climbLen = 170;
      if (dc < climbLen) { const p = S.climbPos(0, dc / climbLen); x = p.x; y = p.y; o = { walk: dc / 19, dir: 1, light: .75 }; }
      else { const dw = dc - climbLen, len = c.end - sx1; if (dw < len) { x = sx1 + dw; y = y0; o = { walk: dw / (c.h * .085), dir: 1, light: .75 }; } else { x = c.end; y = y0; o = { look: .6, back: .35, light: .75 }; } }
    }
    o.long = c.long; E.person(ctx, x, y, c.h, o);
  }
}

// ======================================================================================================== the statement card (screen space)
export const CARD = { x: 150, y: 190, w: 660, h: 640, list: [196, 470] };
const ORB_T = 8;   // orbit amplitude per chunk (px): enough motion for the holds, not more (calm.py)
const orbAmp = (t, a) => lerp(lerp(36, 50, smooth(span(t, a.three - 1, a.three + 1))), 16, smooth(span(t, a.act - 1, a.act + 1)));
const ROWS = 140;
function statementCard(ctx, t, a, box, o) {
  // box: the current rect (strip flight / unroll); the layout is drawn at CARD size inside a transform
  const s = box.w / CARD.w;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(box.x, box.y); ctx.scale(s, s);
  const hh = box.h / s;   // the unrolled height in layout units
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(8, 12, CARD.w, hh, 8); ctx.fill();
  ctx.fillStyle = lin2(ctx, 0, 0, CARD.w, hh, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, CARD.w, hh, 6); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, CARD.w, hh); ctx.clip();
  const tu = span(o.unroll, .05, .4);
  F.maskLine(ctx, [['STATEMENT · 13 JULY 2026', 0]], 40, 52, 22, F.rise(o.head), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  F.maskLine(ctx, [['“We must act now.”', 0]], 38, 132, 64, F.rise(tu), { serif: true, col: PAPER.ink, glow: false });
  ctx.fillStyle = rgba(PAPER.edge, .7); ctx.fillRect(40, 166, (CARD.w - 80) * smooth(tu), 2);
  // the signatures: two columns of unreadable names that roll upward through the list window
  const [l0, l1] = CARD.list, rowH = 38, scroll = o.scroll;
  ctx.save(); ctx.beginPath(); ctx.rect(0, l0, CARD.w, l1 - l0); ctx.clip();
  const first = Math.max(0, Math.floor((scroll - 10) / rowH));
  for (let r = first; r < Math.min(ROWS, first + 12); r++) {
    const yy = l0 + 26 + r * rowH - scroll; if (yy < l0 - 20 || yy > l1 + 30) continue;
    if (yy > hh - 10) continue;
    for (let col = 0; col < 2; col++) {
      const seed = r * 2 + col, rr = E.prng(seed * 13 + 5), w = 150 + rr() * 110, hi = o.hiRow === r && col === 0 ? o.hi : 0;
      const x0 = 40 + col * 300;
      if (hi > 0) { ctx.fillStyle = rgba(GOLD.hot, .45 * hi); ctx.beginPath(); ctx.roundRect(x0 - 12, yy - 24, 286, 36, 6); ctx.fill(); }
      scrib(ctx, x0, yy - 6, w, 7, seed, mixHex(rgba(PAPER.ink, .78), GOLD.deep, hi), 2.2);
      ctx.fillStyle = rgba(PAPER.faint, .45); ctx.fillRect(x0, yy + 6, 250, 1.2);
    }
  }
  ctx.restore();
  ctx.fillStyle = lin2(ctx, 0, l0, 0, l0 + 26, [[0, rgba(PAPER.lit, .95)], [1, rgba(PAPER.lit, 0)]]); ctx.fillRect(0, l0, CARD.w, 26);   // soft edges of the list window
  ctx.fillStyle = lin2(ctx, 0, l1 - 26, 0, l1, [[0, rgba(PAPER.body, 0)], [1, rgba(PAPER.body, .95)]]); ctx.fillRect(0, l1 - 26, CARD.w, 26);
  // the count
  const cu = span(o.unroll, .55, .9);
  if (cu > 0) {
    const n = Math.round(lerp(0, 200, sineIO(span(t, a.summer + 1.2, a.signed)))), num = n >= 200 ? '200+' : String(n);
    F.maskLine(ctx, [[num, 0]], 40, 528, 64, F.rise(cu), { serif: true, col: GOLD.deep, glow: false });
    F.maskLine(ctx, [['SIGNATORIES', 0]], 40 + F.measure('200+', 64, true) + 18, 526, 22, F.rise(cu), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  }
  // NOT TO PAUSE (struck) → TO PREPARE (gold)
  const np = span(t, a.notPause - .05, a.notPause + .45), npOut = span(t, a.prepare - .35, a.prepare + .05), tp = span(t, a.prepare - .05, a.prepare + .5);
  if (np > 0 && npOut < 1) {
    F.maskLine(ctx, [['NOT TO PAUSE', 0]], 40, 596, 40, F.rise(np) * (1 - npOut), { serif: false, weight: 700, col: PAPER.ink, glow: false });
    const sw = smooth(span(t, a.notPause + .55, a.notPause + 1.0)) * (1 - npOut); if (sw > 0) { ctx.fillStyle = rgba(GOLD.shade, .95); ctx.fillRect(36, 581, (F.measure('NOT TO PAUSE', 40, false, 700) + 10) * sw, 4); }
  }
  if (tp > 0) {
    const g = F.rise(tp) * (1 - (o.tpOut ?? 0));
    F.maskLine(ctx, [['TO PREPARE', 0]], 40, 598, 46, g, { serif: false, weight: 800, col: GOLD.shade, glow: false });
    const tw = F.measure('TO PREPARE', 46, false, 800); F.goldSpan(ctx, [[40, 614], [40 + tw, 614]], 0, smooth(span(t, a.prepare + .3, a.prepare + .9)) * (1 - (o.tpOut ?? 0)), { w: 2.2, spark: false });
  }
  ctx.restore();
  // the roll at the bottom edge while it unrolls
  if (o.unroll < 1) { const ry = hh; ctx.fillStyle = lin2(ctx, 0, ry - 10, 0, ry + 14, [[0, PAPER.lit], [.5, PAPER.body], [1, PAPER.shade]]); ctx.beginPath(); ctx.roundRect(-6, ry - 12, CARD.w + 12, 26, 13); ctx.fill(); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.stroke(); }
  ctx.restore();
  // the highlighted organizer row in screen space (the clip grows out of it)
  const ry = CARD.list[0] + 26 + o.hiRow * rowH - o.scroll;
  return { x: box.x + 28 * s, y: box.y + (ry - 24) * s, w: 286 * s, h: 36 * s };
}

// ======================================================================================================== the group
const CACHE = new WeakMap();
let OVL = null;
function overlay() { if (!OVL) OVL = createCanvas(W, H).getContext('2d'); OVL.setTransform(1, 0, 0, 1, 0, 0); OVL.clearRect(0, 0, W, H); return OVL; }
export async function groupB2(T, R) {
  if (!CACHE.has(T)) CACHE.set(T, build(T));
  return [{ t: R.a, draw: CACHE.get(T), print: F.PRINT49 }];
}
export default (T, R) => groupB2(T, R);

function build(T) {
  const a = anchors(T), H = { a, T, proj, mono, io, inMask, scrib, popK, popScale, door2, DOOR2, drawYou, litAt };
  const creepIn = (t) => { const k = S.creep(t, T, PH0); return S.WORK_CAM(k, S.trk(k)); };
  const creepOut = (t) => { const k = 1 + S.CREEP * (t - a.p1); return S.MACHINE_CAM(k, S.trk(k)); };
  const K = [
    [a.p0, creepIn(a.p0)],
    [a.summer + 2.5, A(985, 606, 2.62, 1000, 612)],
    [a.C5.start, A(995, 610, 2.75, 1020, 615)],
    [a.C5.end - .4, A(1000, 612, 2.8, 1030, 615)],
    [a.channel + 3.8, A(820, 640, .95, 960, 560)],
    [a.subscribe - .3, A(880, 632, 1.02, 960, 560)],
    [a.adult + .9, A(1010, 560, 2.15, 880, 640)],
    [a.nextGen + 1.6, A(960, 580, 2.0, 860, 640)],
    ...L7.keys(a, A), ...L8.keys(a, A),
    [a.p1 - 1.2, creepOut(a.p1 - 1.2)],
  ].sort((p, q) => p[0] - q[0]);
  const baseAt = (t) => {
    let c = F.camPath(t, K);
    const wi = smooth(span(t, a.p0 + .1, a.p0 + 1.6)); if (wi < 1) c = mixCam(creepIn(t), c, wi);
    const wo = smooth(span(t, a.p1 - 2.6, a.p1 - 1.5)); if (wo > 0) c = mixCam(c, creepOut(t), wo);
    return c;
  };
  // screen speed of the path (px/s): how far the frame's centre and corner points move
  const speed = (t) => {
    const c0 = baseAt(t - .05), c1 = baseAt(t + .05), m0 = E.cardM(c0, S.Z_LAND), m1 = E.cardM(c1, S.Z_LAND);
    let v = 0;
    for (const [sx, sy] of [[W / 2, E.H / 2], [0, 0], [W, E.H]]) { const u = (sx - m0.e) / m0.k, w = (sy - m0.f) / m0.k; v = Math.max(v, Math.hypot(m1.e + u * m1.k - sx, m1.f + w * m1.k - sy)); }
    return v / .1;
  };
  const camAt = (t) => {
    let c = baseAt(t);
    const ramp = clamp(Math.min((t - a.p0) / 1.2, (a.p1 - t) / 1.2));
    c = E.camDrift(c, t, .6 * ramp);
    // the orbit: a slow screen-space ellipse (±ORB px) that never stops, so no hold of the take is ever frozen; it gives way while the
    // path itself travels (no extra motion on top of a move)
    const g = ramp * (1 - .8 * smooth(span(speed(t), 50, 140))), sk = c.f / (S.Z_LAND - c.z), w = TAU * (t - a.p0) / ORB_T;
    const orb = orbAmp(t, a) * g;
    return { ...c, x: c.x + orb * (Math.cos(w) - 1) / sk, y: c.y + orb * .8 * Math.sin(w) / sk };
  };
  H.camAt = camAt;
  return (ctx, t) => {
    if (t < a.p0) { S.plateWork(ctx, t, T); return; }
    if (t >= a.p1) { S.plateMachine(ctx, t, T); return; }
    const c = camAt(t);
    const lit = litAt(T, t), you = youAt(t, a);
    // ---- c06 states: the statement card's flight (desk paper → strip → unrolled) and back
    const fly = sineIO(span(t, a.summer - .1, a.summer + 1.7)), unroll = sineIO(span(t, a.summer + 1.2, a.summer + 3.4));
    const back = sineIO(span(t, a.channel - .15, a.channel + 1.1)), land = sineIO(span(t, a.channel + .8, a.channel + 2.6));
    const cardOn = t >= a.summer - .1 && land < 1;
    const officeU = 1 - span(t, a.hit2 + .25, a.hit2 + 1.25);
    const st = {
      lit, you: false, stage: [0, officeU, 0, 0, 0],
      dust: 1, old: 0,
      land: (cx) => {
        crowdAt(t, a, cx);
        L7.landBehind(cx, t, H, c);
        drawYou(cx, you);
        if (officeU > 0) desk(cx, t, { k: popK(officeU, 1), paper: cardOn ? 0 : 1 });
        door2(cx, t, span(t, a.met - .25, a.met + .75) * (1 - span(t, a.itself + 1.6, a.itself + 2.6)), 1);
        L7.land(cx, t, H, c); L8.land(cx, t, H, c);
      },
    };
    L7.state(t, H, st); L8.state(t, H, st);
    S.stairsWorld(ctx, c, t, st);
    // ---- screen layers
    const veil = .58 * sineIO(span(t, a.summer, a.summer + 1.8)) * (1 - sineIO(span(t, a.channel - .2, a.channel + 1.8)));
    F.veil(ctx, veil);
    // the screen layers of c06/c07 (cards, clips, captions) live on one sheet that floats: a moving hold (≈ 1–3 % scale, a few px),
    // so a held card is never a frozen frame. The world-anchored c08 layers (rail, leaf, labels) stay on the frame.
    const oc = overlay();
    {
      if (cardOn) {
        const p0 = proj(c, DESK_PAPER.x, DESK_PAPER.y), p1 = proj(c, DESK_PAPER.x + DESK_PAPER.w, DESK_PAPER.y + DESK_PAPER.h);
        const src = { x: p0.x, y: p0.y, w: Math.max(8, p1.x - p0.x), h: Math.max(4, p1.y - p0.y) };
        const strip = { x: CARD.x, y: CARD.y, w: CARD.w, h: 80 };
        const m = Math.min(fly, 1 - land), un = Math.min(unroll, 1 - back);
        const box = { x: lerp(src.x, strip.x, m), y: lerp(src.y, strip.y, m), w: lerp(src.w, strip.w, m), h: lerp(src.h, strip.h, m) };
        box.h = lerp(box.h, CARD.h, un);
        // the list rolls (fast while 200+ sign), slows and stops on 'Not to pause' (a tiny drift stays)
        const scroll = mono(t, [[a.summer + 1.2, 0], [a.signed, 480], [a.notPause + .8, 600], [a.C5.start, 610], [a.channel + 1.2, 616]]);
        const hiRow = 20, hi = smooth(span(t, a.erik - .2, a.erik + .5));
        const row = statementCard(oc, t, a, box, { unroll: un, head: span(t, a.summer + .3, a.summer + 1.3), scroll, hiRow, hi, tpOut: span(t, a.channel - .3, a.channel + .2) });
        H.c5from = row;
      }
      // C5 grows out of the organizer's line and goes back into it
      const w5 = a.C5, m5 = span(t, w5.start - 1.4, w5.start + .4) * (1 - span(t, w5.end - .4, w5.end + 1.4));
      if (m5 > 0 && H.c5from) F.clipPlate(oc, t, T, 'C5', { from: H.c5from, morph: m5 });
      // subscribe 1 ★: the words in the sky
      const cu = span(t, a.everybody - .1, a.everybody + .8), cout = span(t, a.subscribe + .2, a.subscribe + .8);
      if (cu > 0 && cout < 1) F.caption(oc, t, 90, 330, ['GOES WELL', 'FOR EVERYBODY'], cu, { size: 112, out: cout > 0 ? cout : null });
      L7.over(oc, t, H, c);
    }
    const fz = 1.03 + .012 * Math.sin(TAU * t / 6.5), fx = 12 * Math.sin(TAU * t / 8), fy = 7 * Math.cos(TAU * t / 7);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2 + fx, E.H / 2 + fy); ctx.scale(fz, fz); ctx.drawImage(oc.canvas, -W / 2, -E.H / 2); ctx.restore();
    L8.over(ctx, t, H, c);
    F.counter(ctx, t, T);
    F.source(ctx, t, a.summer + 1.0, a.theCase - .2, F.SOURCES.statement);
    L7.sources(ctx, t, H); L8.sources(ctx, t, H);
  };
}
