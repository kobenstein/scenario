// Film 54 · B3 · ONE take from T.G('He even warned of a jam') (plateKiosk) to the end of the film (c10 c11 c12 c13 share this draw, so the
// inner chunk boundaries are the same picture by construction). Plan: docs/shots.md 6.11–E.01 · world: docs/MOTION.md · props: f54_b3_props.mjs
//
// | ID    | anchor (phrase)                     | picture (one idea)                                                                   | camera                 |
// |-------|-------------------------------------|--------------------------------------------------------------------------------------|------------------------|
// | 6.11  | He even warned of a jam             | out of plateKiosk: the kiosk screen wakes (play mark brightens)                      | creep → push · MIX     |
// | 6.12  | [C2]                                | the screen grows into the clip plate (board steps back under the footage)            | creep · CLIP           |
// | 6.13  | Discovery speeds up / Proof jams    | the plate shrinks into the screen; the glass pipeline: FINDING streams, TESTING jams | creep · EXPL           |
// | 6.14  | So can proof come sooner            | the pipeline folds into the two-dates label: FOUND stamped, PROVEN blinks            | creep · EXPL           |
// | 7.01  | It can. / already starting          | the proof pin on the wait track steps closer                                         | creep · EXPL           |
// | 7.02  | Picture someone you love            | the label becomes a poster in a study clinic behind the screen glass; you beside them, a hand on the shoulder; they laugh with the nurse; the blood tube lights mint: FIRST TRACES | dive through the glass · SCENE |
// | 7.03  | So they join a trial                | the nurse hands the trial form; the signature draws in mint                          | creep · SCENE          |
// | 7.04  | For now, experts advise / head start| bracket WITHOUT SYMPTOMS: EXPERTS ADVISE IT ONLY IN TRIALS · source TRAILBLAZER-ALZ 3; the signature's line runs out ahead | creep · MIX |
// | 7.05  | In other trials                     | out of the glass; the line becomes the trial row: MEDICINE / SUGAR PILL; a mint twin beside each patient | pull back · EXPL |
// | 7.06  | Fewer people on a sugar pill        | the sugar-pill row gets shorter, never vanishes: UP TO ~35 % SMALLER (COMPANY FIGURE) · DIGITAL TWINS (PROCOVA) · EMA, SEPT 2022 | EXPL |
// | 7.07  | At America's regulator              | through the screen glass: a reviewer at a desk, the assistant marks passages, the stack shrinks: FDA “ELSA” · TARGET 1–2 MONTHS | push · SCENE |
// | 7.08  | Amodei's own proposal / remember    | out and along the hall to a small wall card (K7: "…crisp and clear…"); board HEART: UP TO 15 YEARS FOLLOW-UP | truck · EXPL |
// | 7.09  | In the sales video                  | glide to the roadshow frame on the wall panel                                        | truck · HALL           |
// | 7.10  | [C1b]                               | the frame opens into the wall text, read word by word, "if we do this right" mint    | creep · EXPL           |
// | 7.11  | If the machines make                | the text folds into the label: FOUND stamped fast, PROVEN open, THE REAL DEADLINE; three people step beside it | EXPL |
// | 7.12  | Clinics / Scientists / Lawmakers    | each steps into a small diorama: a study clinic, a trial office with twins, a parliament hall | SCENE |
// | 7.13  | That's what doing it right          | the proof pin moves well toward FOUND                                                | EXPL                   |
// | 8.01  | So, does the deadline hold?         | the board flies big into the centre (the label files into it, the dioramas sink)     | EXPL                   |
// | 8.02  | Cancer: for many kinds …            | each row lights in the rhythm of the words; a mint spark starts the Alzheimer's race | EXPL                   |
// | 8.03★ | Maybe your grandkids will hear      | the hall: two kids walk up to vitrine 4; the brain fades to a relic on "plague"; PROVEN stamps its plaque | pull back · HALL |
// | 8.04  | Every cure has two dates            | the plaque grows into the big label EVERY CURE HAS TWO DATES: FOUND stamped, PROVEN blinks | EXPL         |
// | 8.05  | Investors are already               | a ticker line runs over FOUND and fades (no price); a pen comes to lie beside PROVEN | EXPL                   |
// | A.01  | This channel exists (2nd)           | the label goes home to the plaque; you walk in from the right through the night hall (QR corner dark) | follow · HALL |
// | A.02  | (walk)                              | three vitrines empty into soft mint light, the plaques go blank, the doorway warms; you stop before an empty one | pull back · HALL |
// | E.01  | (end screen, 15 s)                  | S.END_CAM: the four vitrines low, the dark upper wall for two tiles, the warm doorway for subscribe; no text | drift · HALL |
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f54_kit.mjs';
import * as S from './f54_seams.mjs';
import * as B from './f54_b3_props.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex, smooth } = E;
const { rise, maskLine, measure, F0, MINT, COOL, LAMP, RELIC } = F;
const TAU = Math.PI * 2;

export const PHRASE0 = 'He even warned of a jam';
const CACHE = new WeakMap();
// the draw of the whole B3 range for this timing (cached: all four scene files get the same function)
export function take(T) { if (!CACHE.has(T)) CACHE.set(T, build(T)); return CACHE.get(T); }

export function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after), a = {};
  a.T0 = G(PHRASE0); a.podcast = G('on that same podcast', a.T0); a.C2 = T.clip('C2');
  a.disc = G('Discovery speeds up', a.C2.start); a.jams = G('Proof jams', a.disc); a.sooner = G('So can proof come sooner', a.disc);
  a.itcan = G('It can', a.sooner); a.starting = G('already starting', a.itcan);
  a.picture = G('Picture someone you love', a.itcan); a.sharp = G('sharp as ever', a.picture); a.clinic = G('At a study clinic', a.picture);
  a.traces = G('finds the first traces', a.clinic); a.join = G('So they join a trial', a.clinic); a.hold = G('hold off', a.join); a.name = GE('forgotten name', a.join);
  a.fornow = G('For now, experts advise', a.join); a.slowest = G('the slowest proof', a.fornow); a.head = G('head start', a.fornow);
  a.other = G('In other trials', a.head); a.sugar = G('sugar-pill group', a.other); a.replaced = G('replaced by a prediction', a.other); a.twin = G('a digital twin', a.other);
  a.fewer = G('Fewer people on a sugar pill', a.twin); a.europe = G("Europe's regulator", a.fewer); a.shrinks = G('It shrinks the comparison', a.europe); a.notrep = G("It doesn't replace it", a.shrinks);
  a.america = G("At America's regulator", a.notrep); a.assistant = G('assistant', a.america); a.priority = G('For a few priority', a.america); a.months = G('one or two months', a.priority);
  a.proposal = G("Amodei's own proposal", a.months); a.rules = G('rules made for', a.proposal); a.remember = G('But remember the heart', a.proposal); a.fastSafe = G("fast can't mean", a.remember);
  a.salesv = G('In the sales video', a.remember); a.words = G('In his words', a.salesv); a.C1b = T.clip('C1b'); a.ifright = G('if we do this right', a.words);
  a.ifmach = G('If the machines make', a.C1b.end - .3); a.fast = G('come fast', a.ifmach); a.second = G('the second date becomes', a.ifmach); a.real = G('real deadline', a.ifmach);
  a.people = G('And people set that one', a.ifmach); a.clinics = G('Clinics that find disease early', a.people); a.sci = G('Scientists who design', a.clinics); a.law = G('Lawmakers who keep', a.sci);
  a.right = G("That's what doing it right", a.law); a.hold2 = G('does the deadline hold', a.right);
  a.v = [G('Cancer: for many kinds', a.hold2), G('Heart disease: halfway', a.hold2), G('Mental illness: still open', a.hold2), G("Alzheimer's: not by then", a.hold2)];
  a.race = G('But its race has already begun', a.hold2); a.maybe = G('Maybe your grandkids will hear', a.race); a.plague = G('plague', a.maybe);
  a.proved = G('Because someone proved it', a.maybe); a.provedW = G('proved', a.proved);
  a.every = G('Every cure has two dates', a.proved); a.found = G('found', a.every); a.proven = G('proven', a.every);
  a.inv = G('Investors are already', a.every); a.ours = G('The second one is still ours', a.inv); a.move = G('to move', a.ours);
  a.chan = G('This channel exists', a.ours); a.voEnd = GE('Then subscribe', a.chan);
  a.endS = T.duration - F.QR.tail;
  return a;
}

const C = (u, v, s, sx, sy) => E.aim(F0, u, v, s, sx, sy);
const camMix = (c1, c2, w) => { const d1 = Math.log(F0 - c1.z), d2 = Math.log(F0 - c2.z); return E.cam3({ x: lerp(c1.x, c2.x, w), y: lerp(c1.y, c2.y, w), z: F0 - Math.exp(lerp(d1, d2, w)), f: c1.f }); };
const KS = S.kioskScreen(), KC = [KS.x + KS.w / 2, KS.y + KS.h / 2];
const FR = S.frameRect(), PQ = [0, 1, 2, 3].map(S.plaqueOf), V4 = S.glassOf(3);
const TEXT = { x: 4990, y: 380, w: 900, size: 76 };                      // the wall text C1b (hall px), same design as C1
const K7 = { x: 5962, y: 226, w: 330, lines: ['…where the safety', 'and efficacy is actually', 'going to be really', 'crisp and clear…'], credit: 'AMODEI, FEB 2026' };
const ROWS = { x0: 690, dx: 150, n: 6, yA: 560, yB: 800, h: 124 };       // 7.05 the trial rows (screen)
const L2 = { x: 596, y: 150, s: 1.3 }, L2UP = { x: 736, y: 62, s: .8 };  // 7.11 / 7.12 the label (screen)
const L3 = { x: 480, y: 300, s: 1.5 };                                    // 8.04 the label (screen)
const BOXX = [470, 960, 1450], BOXB = 780, BOXW = 400, BOXH = 250;       // 7.12 the three dioramas (screen)
const PPL = [{ x: 430, from: -90, dir: 1, rim: MINT.line, long: true, lx: 330 }, { x: 1470, from: 2010, dir: -1, rim: COOL.line, long: false, lx: 345 }, { x: 1620, from: 2050, dir: -1, rim: LAMP.body, long: true, lx: 335 }];
const KIDS = [{ h: 136, stop: 4180, ph: 0 }, { h: 114, stop: 4268, ph: 1 }];
const DU_H = 190, DU_STOP = 3600;
// the board in its big pose (F.board: sc 2.15 about the centre) → screen y of row k's baseline
const BIGB = { x: W / 2 - F.BOARD.w * 2.15 / 2, y: H * .44 - (96 + 4 * 52) * 2.15 / 2, sc: 2.15 };
const rowY = (k) => BIGB.y + (104 + k * 52) * BIGB.sc;

// screen-space explainers float a little (never a frozen frame)
const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .014 * k * Math.sin(t * .37 + 1), dx = E.drift(t * 1.1, 12 * k, 11), dy = E.drift(t * 1.1, 7 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
// a walk that accelerates, glides, and settles (u 0..1 → 0..1)
const trap = (u, ea = .15, eb = .22) => { u = clamp(u); const v = 1 / (1 - ea / 2 - eb / 2); if (u < ea) return v * u * u / (2 * ea); if (u > 1 - eb) return 1 - v * (1 - u) ** 2 / (2 * eb); return v * (u - ea / 2); };
// walk phase that ends on legs together (a whole number of half strides over distance D)
const stride = (D, h) => { const n = Math.max(1, Math.round(D / (h * .4))); return D / n; };

function build(T) {
  const a = anchors(T), tPlateEnd = a.T0 + S.SEAM_HALF, c2 = a.C2, c1b = a.C1b;
  // ---------------------------------------------------------------------------------------------------------------- THE CAMERA (one take)
  const kCreep = (t) => S.creep(t, T, PHRASE0);
  const creepCam = (t) => { const k = kCreep(t); return C(7360 + S.TRUCK * (k - 1) / S.CREEP, 560, 1.05 * k); };
  const duX = (t) => lerp(5990, DU_STOP, trap(span(t, a.chan + .5, a.endS - 1.6)));
  const walkKeys = [];
  for (let tt = a.chan + 3.5; tt < a.endS - 3; tt += 4.5) {
    const w = sineIO(span(tt, a.chan, a.endS)), s = Math.exp(lerp(Math.log(.76), Math.log(.36), w));
    walkKeys.push([tt, C(lerp(duX(tt) - 330, 2940, w * w), lerp(560, 120, w), s)]);
  }
  const K0 = [
    [tPlateEnd, creepCam(tPlateEnd)],
    [a.podcast + .6, C(KC[0], KC[1], 1.7, 1030, 520)], [c2.start, C(KC[0], KC[1], 1.85, 1030, 520)], [c2.end, C(KC[0], KC[1], 2.0, 1030, 520)],
    [a.picture - .2, C(KC[0], KC[1], 2.07, 1030, 520)], [a.picture + 2.9, C(KC[0], KC[1] + 2, 3.9)], [a.join, C(KC[0] - 4, KC[1] + 3, 4.0)], [a.other, C(KC[0], KC[1] + 4, 4.12)],
    [a.other + 2.9, C(7240, 520, 1.3)], [a.america - .2, C(7110, 498, 1.72)], [a.america + 2.9, C(KC[0], KC[1], 3.0)], [a.proposal - .1, C(KC[0] + 4, KC[1], 3.1)],
    [a.proposal + 3.3, C(6110, 432, 1.28)], [a.salesv + .1, C(6086, 434, 1.32)], [a.salesv + 2.9, C(5500, 470, .98)], [c1b.end + .2, C(5460, 478, 1.06)],
    [a.right, C(5080, 506, 1.08)], [a.v[3] + .5, C(4420, 640, 1.02)], [a.maybe + .6, C(4320, 680, 1.25)], [a.proved + 1.2, C(4330, 600, .95)],
    [a.inv + 1, C(4400, 590, .9)], [a.chan + .3, C(4560, 570, .8)], ...walkKeys, [a.endS, S.END_CAM],
  ];
  const K = []; for (const k of K0) if (!K.length || k[0] > K[K.length - 1][0] + .05) K.push(k);
  const path = (t) => F.camPath(t, K);
  const camRaw = (t) => (t < tPlateEnd ? creepCam(t) : t < a.podcast + .6 ? camMix(creepCam(t), path(t), sineIO(span(t, tPlateEnd, a.podcast + .6))) : path(t));
  // drift: the kit's z breath plus a slow lateral sway (own phases), so the camera never stands still in the close-ups and holds
  const cam = (t) => { const c = camRaw(t), s = F0 / (F0 - c.z), g = smooth(span(t, tPlateEnd, tPlateEnd + 1.6));
    const d = E.camDrift(c, t, 5.5 / Math.max(1, s) * g, 5), w = 26 * Math.pow(s, s >= 1 ? -.35 : -.6) * g;   // wide shots (end) sway a little more in world px, so they still breathe on screen
    return { ...d, x: d.x + E.drift(t * .8, w, 6.2) + E.drift(t * .53 + 3, w * .6, 2.9), y: d.y + E.drift(t * .7 + 7, w * .45, 4.4) }; };
  const SR = (c) => { const p = E.project(c, F0, KS.x, KS.y); return p ? { x: p[0], y: p[1], w: KS.w * p[2], h: KS.h * p[2], k: p[2] } : null; };

  // ---------------------------------------------------------------------------------------------------------------- TIMELINES
  const wake = (t) => smooth(span(t, tPlateEnd + .1, a.podcast));
  const plateM = (t) => sineIO(span(t, a.podcast - .1, c2.start + .1)) * (1 - sineIO(span(t, c2.end - .5, c2.end + .8)));
  const plateA = (t) => smooth(span(t, a.podcast - .1, a.podcast + .4)) * (1 - smooth(span(t, c2.end + .35, c2.end + .8)));   // the plate fades in over the play mark, out over the screen
  const plateDark = (t) => (t < c2.start ? 1 - smooth(span(t, a.podcast - .1, a.podcast + .9)) : smooth(span(t, c2.end - .2, c2.end + .6)));
  const clinicLit = (t) => smooth(span(t, a.picture - .2, a.picture + 1.6)) * (1 - smooth(span(t, a.other + .1, a.other + 2.4)));
  const deskLit = (t) => smooth(span(t, a.america - .1, a.america + 1.6)) * (1 - smooth(span(t, a.proposal + .3, a.proposal + 2.6)));
  const veil = (t) => .66 * smooth(span(t, a.other + .2, a.other + 1.4)) * (1 - smooth(span(t, a.america - .1, a.america + 1.0)))
    + .56 * smooth(span(t, a.ifmach - .4, a.ifmach + .8)) * (1 - smooth(span(t, a.maybe - .5, a.maybe + 1.2)))
    + .58 * smooth(span(t, a.every - .3, a.every + .9)) * (1 - smooth(span(t, a.chan, a.chan + 1.5)));
  // the proof pin: a step at "It can", well forward at "That's what doing it right"
  const near1 = (t) => .3 * expoOut(span(t, a.itcan - .05, a.itcan + .9));
  const near2 = (t) => lerp(.3, .72, sineIO(span(t, a.right - .1, a.right + 1.6)));
  const relicU = (t) => smooth(span(t, a.plague - .3, a.plague + 1.8));
  const emptyU = (i, t) => smooth(span(t, a.voEnd + .8 + (2 - i) * 1.5, a.voEnd + 3.2 + (2 - i) * 1.5));
  const nameA = (t) => 1 - smooth(span(t, a.voEnd + 3.5, a.voEnd + 6.5));
  const qr = (t) => F.qrQuiet(T, t);

  // ---------------------------------------------------------------------------------------------------------------- 6.11–7.04 ON THE KIOSK GLASS
  const pipeU = (t) => span(t, a.disc - .15, a.disc + .9), toLabel = (t) => sineIO(span(t, a.sooner - .25, a.sooner + .85));
  const toPoster = (t) => sineIO(span(t, a.picture - .1, a.picture + 1.35));
  const labelState = (t) => ({ name: 'EVERY CURE', found: 1, blink: .85, wait: lerp(.5, .75, smooth(span(t, a.starting - .1, a.starting + 1.2))), near: near1(t) });
  function pipeGeo(R) { return { x: R.x + R.w * .08, y: R.y + R.h * .6, w: R.w * .84, h: R.h * .2, neck: .62 }; }
  function kioskExplainers(ctx, t, c) {
    const R = SR(c); if (!R || t < a.disc - .2 || t > a.picture + 1.4) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    const g = pipeGeo(R), nx = g.x + g.w * g.neck, tl = toLabel(t);
    if (tl < 1) {   // the glass pipeline (FINDING streams in, TESTING jams); it folds into the neck as the label grows out of it
      const k = 1 - .9 * tl; ctx.save(); ctx.globalAlpha *= 1 - span(tl, .4, 1); ctx.translate(nx, g.y); ctx.scale(k, k); ctx.translate(-nx, -g.y);
      F.pipeline(ctx, t, { ...g, u: pipeU(t), flow: 1, jam: smooth(span(t, a.jams - .25, a.jams + 1.4)), labels: rise(span(t, a.disc + .3, a.disc + 1.1)), seed: 54 });
      ctx.restore();
    }
    if (tl > 0) {   // the two-dates label of the hook: FOUND stamped, PROVEN blinks; it shrinks into the clinic's poster
      const s1 = R.w * .6 / F.DATES.w, X1 = R.x + R.w / 2 - F.DATES.w * s1 / 2, Y1 = R.y + R.h / 2 - F.DATES.h * s1 / 2;
      const e = expoOut(tl), s0 = s1 * .12;
      let x = lerp(nx - F.DATES.w * s0 / 2, X1, e), y = lerp(g.y - F.DATES.h * s0 / 2, Y1, e), s = lerp(s0, s1, e);
      const tp = toPoster(t);
      if (tp > 0) { const pq = B.CLINIC.poster, k = R.w / 520, s2 = pq.w * k / F.DATES.w; x = lerp(x, R.x + pq.x * k, tp); y = lerp(y, R.y + pq.y * k, tp); s = lerp(s, s2, tp); }
      if (tp < 1) { ctx.globalAlpha = span(tl, 0, .35); B.dates(ctx, t, x, y, s, labelState(t)); }
    }
    ctx.restore();
  }
  function kioskScreen(t) {
    return (cx, w, h) => {
      if (t < a.picture - .5) {   // the dark screen with the cream play mark; it wakes (brighter) before the clip
        const g = (.5 + .45 * wake(t) * (.85 + .15 * Math.sin(t * 2.2))) * (1 - span(t, a.podcast + .2, a.podcast + 1.2)), x = w / 2; if (g <= 0) return;
        cx.fillStyle = rgba(P.cream, .5 * g); cx.beginPath(); cx.moveTo(x - w * .05, h * .38); cx.lineTo(x + w * .07, h * .5); cx.lineTo(x - w * .05, h * .62); cx.closePath(); cx.fill();
        return;
      }
      if (t < a.america - .3) {
        const tp = toPoster(t); cx.save(); cx.globalAlpha *= smooth(span(t, a.picture - .5, a.picture + .2));   // the room fades up out of the dark screen
        B.clinicRoom(cx, t, w, h, {
          lit: clinicLit(t), laugh: span(t, a.sharp - .4, a.sharp + .3) * (1 - span(t, a.clinic + .3, a.clinic + 1.3)), hand: span(t, a.picture + .4, a.picture + 1.6),
          tube: smooth(span(t, a.traces - .1, a.traces + .8)), card: span(t, a.traces + .25, a.traces + 1.0),
          form: span(t, a.join - .1, a.join + 1.4), sign: span(t, a.hold - .2, a.name + .2),
          poster: tp >= 1 ? (c2x, x, y, pw) => B.dates(c2x, t, x, y, pw / F.DATES.w, labelState(t)) : null,
        }); cx.restore();
      } else B.deskRoom(cx, t, w, h, { lit: deskLit(t), scan: span(t, a.assistant - .3, a.months + .6), stack: span(t, a.assistant + .2, a.proposal + .6) });
    };
  }
  // the signature's end on the form (screen), for the "head start" line
  const sigEnd = (c) => { const R = SR(c); return R ? [R.x + 266 * R.k, R.y + 168 * R.k] : [W / 2, H * .6]; };

  // ---------------------------------------------------------------------------------------------------------------- 7.05–7.06 THE TRIAL ROWS
  const rowsOut = (t) => expoIn(span(t, a.america - .2, a.america + .8));
  function lineA(ctx, t, c) {   // the head-start line: out of the signature, along to the right; then it becomes the trial row
    const u = expoOut(span(t, a.head - .1, a.head + 1.0)); if (u <= 0 || t > a.america + 1) return;
    const [sx, sy] = sigEnd(c), m = sineIO(span(t, a.other + .1, a.other + 1.7)), o = rowsOut(t);
    const x0 = lerp(sx, ROWS.x0 - 60, m), y = lerp(sy, ROWS.yA, m), x1 = lerp(W + 40, ROWS.x0 + (ROWS.n - 1) * ROWS.dx + 70, m), xm = (x0 + x1) / 2;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (m > 0) float(ctx, t, m);
    F.mintSpan(ctx, [[lerp(x0, xm, o), y], [lerp(x1, xm, o), y]], 0, u, { w: 2.2, spark: u < 1, a: 1 - o * .6 });
    ctx.restore();
  }
  function trialRows(ctx, t) {
    if (t < a.other || t > a.america + 1) return;
    const o = rowsOut(t); ctx.save(); float(ctx, t, 1);
    // the sugar-pill floor line clones down from the trial line; it gets shorter (never vanishes)
    const bu = expoOut(span(t, a.sugar - .4, a.sugar + .5)), yB = lerp(ROWS.yA, ROWS.yB, bu), short = sineIO(span(t, a.fewer + .2, a.fewer + 1.3));
    const xb0 = ROWS.x0 - 60, xb1 = lerp(ROWS.x0 + (ROWS.n - 1) * ROWS.dx + 70, ROWS.x0 + 3 * ROWS.dx + 70, short), xm = (xb0 + xb1) / 2;
    if (bu > 0) { ctx.strokeStyle = rgba(P.blue1, .9 * (1 - o)); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(lerp(xb0, xm, o), yB); ctx.lineTo(lerp(xb1, xm, o), yB); ctx.stroke(); }
    const fig = (x, y, h, up, col, i, row) => {   // a participant rises from behind the floor line (mask), breathes
      if (up <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(x - h, y - h * 1.2, h * 2, h * 1.2); ctx.clip(); ctx.translate(0, (1 - rise(up)) * h * 1.05);
      E.person(ctx, x, y, h, { look: .05 + .03 * Math.sin(t * .8 + i * 1.3), lean: .015 * Math.sin(t * .6 + i), light: row ? -1 : 1, back: .5, rim: col }); ctx.restore();
    };
    for (let i = 0; i < ROWS.n; i++) {
      const x = ROWS.x0 + i * ROWS.dx;
      fig(x, ROWS.yA, ROWS.h, span(t, a.other + .5 + i * .07, a.other + 1.3 + i * .07) * (1 - span(o, i * .04, .5 + i * .04)), MINT.line, i, 0);
      B.twin(ctx, t, x + 58, ROWS.yA, ROWS.h * .98, span(t, a.twin - .1 + i * .08, a.twin + .8 + i * .08) * (1 - o));
      const gone = i >= 4 ? expoIn(span(t, a.fewer + (5 - i) * .12, a.fewer + .9 + (5 - i) * .12)) : 0, dim = i >= 4 ? .35 * span(t, a.replaced - .1, a.replaced + .6) : 0;
      ctx.save(); ctx.globalAlpha *= 1 - dim;
      fig(x, yB, ROWS.h, bu >= 1 ? span(t, a.sugar + i * .07, a.sugar + .8 + i * .07) * (1 - gone) * (1 - span(o, i * .04, .5 + i * .04)) : 0, P.blue1, i, 1);
      ctx.restore();
      if (i < 4) { const st = F.bump(t, a.notrep - .1 + i * .06, 1.4); if (st > 0) halo(ctx, x, yB - 4, 46, .3 * st, LAMP.body, LAMP.core); }
    }
    const lu = (t0) => rise(span(t, t0, t0 + .7)) * (1 - span(o, 0, .6));
    maskLine(ctx, [['MEDICINE', 0]], ROWS.x0 - 92, ROWS.yA - 22, 24, lu(a.other + .6), { serif: false, weight: 600, align: 'right', col: MINT.text, glow: false });
    maskLine(ctx, [['SUGAR PILL', 0]], ROWS.x0 - 92, yB - 22, 24, bu >= 1 ? lu(a.sugar + .2) : 0, { serif: false, weight: 600, align: 'right', col: P.halo2, glow: false });
    // the gap where the sugar-pill row was: the honest line (company figure)
    const gx0 = ROWS.x0 + 4 * ROWS.dx - 60, gx1 = ROWS.x0 + 5 * ROWS.dx + 60, gu = span(t, a.fewer + .9, a.fewer + 1.8) * (1 - span(o, 0, .5));
    F.bracket(ctx, gx0, gx1, ROWS.yB - 150, gu, 'UP TO ~35 % SMALLER', { size: 24 });
    maskLine(ctx, [['(COMPANY FIGURE)', 0]], (gx0 + gx1) / 2, ROWS.yB - 96, 19, rise(span(gu, .4, 1)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
    // the title: DIGITAL TWINS (PROCOVA) · EMA, SEPT 2022
    F.mintText(ctx, [['DIGITAL TWINS ', .9], ['(PROCOVA)', 0]], ROWS.x0 - 60, 352, 34, lu(a.twin + .2), { serif: false, weight: 600, spacing: .06 });
    maskLine(ctx, [['EMA, SEPT 2022', 0]], ROWS.x0 - 60, 392, 21, lu(a.europe), { serif: false, weight: 600, col: P.halo2, glow: false });
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------------------------- 7.07 THE REVIEWER: labels
  function deskLabels(ctx, t, c) {
    const u1 = span(t, a.assistant, a.assistant + .9) * (1 - span(t, a.proposal + .1, a.proposal + .7)); if (u1 <= 0) return;
    const p = E.project(c, F0, KS.x + (B.DESK.mon.x + B.DESK.mon.w) * KS.w / 520, KS.y + B.DESK.mon.y * KS.w / 520); if (!p) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    F.label(ctx, p[0] + 6, p[1] + 10, 'FDA “ELSA”', '', u1, { dx: 70, dy: -70, size: 30 });
    const u2 = rise(span(t, a.months - .2, a.months + .6)) * (1 - span(t, a.proposal + .1, a.proposal + .7));
    if (u2 > 0) F.mintText(ctx, [['TARGET 1–2 MONTHS', .8]], p[0] + 82, p[1] - 30, 24, u2, { serif: false, weight: 600, spacing: .08 });
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------------------------- 7.08–7.10 THE WALL PANEL
  const unfold = (t) => sineIO(span(t, a.words - .15, a.words + 1.3));
  const textOut = (t) => span(t, a.ifmach - .25, a.ifmach + .9);
  let TB = null;
  { const dc = createCanvas(16, 16).getContext('2d'); TB = F.wallText(dc, c1b.start, T, { id: 'C1b', x: TEXT.x, y: TEXT.y, w: TEXT.w, size: TEXT.size, a: .001 }); }
  const block = { x: TEXT.x, y: TEXT.y - TEXT.size, w: TEXT.w, h: (TB ? TB.bottom : TEXT.y + 200) - (TEXT.y - TEXT.size) };
  function panel(ctx, t) {
    // the small wall card (K7): its lines light as the proposal is spoken; it dims when the camera moves on
    const lit = (i) => smooth(span(t, a.rules - .5 + i * .45, a.rules + i * .45)) * (1 - .7 * smooth(span(t, a.salesv + .5, a.salesv + 2)));
    const ka = 1 - smooth(span(t, a.ifmach + .3, a.ifmach + 2.3)); if (ka > 0) B.wallCard(ctx, t, K7.x, K7.y, K7.w, K7.lines, lit, span(t, a.rules + 1.2, a.rules + 2), { size: 28, credit: K7.credit, glow: lit(0), a: ka });
    // C1b: the roadshow frame opens into the wall text (the reverse of c01's fold)
    const f = unfold(t), out = textOut(t);
    if (f > 0 && out < 1) {
      const bw = block.w, bh = block.h, cx0 = block.x + bw / 2, cy0 = block.y + bh / 2, k = lerp(Math.min(FR.w / bw, FR.h / bh) * .8, 1, f);
      ctx.save(); ctx.translate(lerp(FR.x + FR.w / 2, cx0, f), lerp(FR.y + FR.h / 2, cy0, f)); ctx.scale(k, k); ctx.translate(-cx0, -cy0);
      F.wallText(ctx, t, T, { id: 'C1b', x: TEXT.x, y: TEXT.y, w: TEXT.w, size: TEXT.size, a: span(f, 0, .45) * (1 - out), credit: span(t, c1b.start - .3, c1b.start + .6), hi: [['if we do this right', a.ifright]] });
      ctx.restore();
    }
  }
  const frameA = (t) => 1 - span(unfold(t), .2, .7);

  // ---------------------------------------------------------------------------------------------------------------- 7.11–8.02 THE LABEL, THE PEOPLE, THE DIORAMAS, THE BOARD
  const l2In = (t) => sineIO(span(t, a.ifmach - .2, a.ifmach + 1.15)), l2Up = (t) => sineIO(span(t, a.clinics - .7, a.clinics + .5)), l2Out = (t) => sineIO(span(t, a.hold2 - .7, a.hold2 + .6));
  const bigU = (t) => sineIO(span(t, a.hold2 - .5, a.hold2 + 1.4));
  const boxU = (k, t) => expoOut(span(t, [a.clinics, a.sci, a.law][k] - .1, [a.clinics, a.sci, a.law][k] + 1.0));
  const sinkU = (k, t) => expoIn(span(t, a.hold2 - .75 + k * .08, a.hold2 + .35 + k * .08));
  function label2(ctx, t, c) {
    const u = l2In(t), out = l2Out(t); if (u <= 0 || out >= 1) return;
    const p0 = E.project(c, F0, block.x, block.y); if (!p0) return;
    const s0 = block.w * p0[2] / F.DATES.w;
    let x = lerp(p0[0], L2.x, u), y = lerp(p0[1], L2.y, u), s = lerp(s0, L2.s, u);
    const up = l2Up(t); x = lerp(x, L2UP.x, up); y = lerp(y, L2UP.y, up); s = lerp(s, L2UP.s, up);
    if (out > 0) { const tx = W / 2 - F.DATES.w * s * .15, ty = H * .44 - F.DATES.h * s * .15; x = lerp(x, tx, out); y = lerp(y, ty, out); s = lerp(s, s * .3, out); }
    ctx.save(); float(ctx, t, 1); ctx.globalAlpha = span(u, .15, .55) * (1 - span(out, .3, 1));
    const st = { name: 'EVERY CURE', found: span(t, a.fast - .35, a.fast + .45), blink: .85 * span(t, a.second - .2, a.second + .4), wait: lerp(.5, 1, sineIO(span(t, a.right - .1, a.right + 1.6))), near: near2(t), pinA: span(t, a.second, a.second + .8) };
    const r = B.dates(ctx, t, x, y, s, st);
    const ru = rise(span(t, a.real - .1, a.real + .6)) * (1 - span(up, 0, .5));
    if (r && ru > 0) F.mintText(ctx, [['THE REAL DEADLINE', .8]], r.slot.x + r.slot.w / 2, y + F.DATES.h * s + 46, 26, ru, { serif: false, weight: 600, align: 'center', spacing: .1 });
    ctx.restore();
  }
  function people(ctx, t) {
    if (t < a.people - .8 || t > a.hold2 + 1.2) return;
    ctx.save(); float(ctx, t, 1);
    PPL.forEach((p, k) => {
      const t0 = a.people - .7 + k * .35, wu = trap(span(t, t0, t0 + 2.1)), bu = sineIO(span(t, [a.clinics, a.sci, a.law][k] - .3, [a.clinics, a.sci, a.law][k] + 1.1));
      if (wu <= 0) return;
      const X = BOXX[k] - BOXW / 2 + p.lx, inY = BOXB - BOXH + BOXH * .84;
      const x = lerp(lerp(p.from, p.x, wu), X, bu), y = lerp(800, inY, bu), h = lerp(200, 148, bu), sink = sinkU(k, t) * 460;
      const D1 = Math.abs(p.x - p.from), D2 = Math.abs(X - p.x), ph = (wu * D1 / stride(D1, 200) + bu * D2 / stride(D2 + 1, 170)) * Math.PI;
      const dir = bu > .02 ? Math.sign(X - p.x) || p.dir : p.dir;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 880); ctx.clip(); ctx.translate(0, sink);
      E.person(ctx, x, y, h, { walk: ph, dir, look: .18 + .04 * Math.sin(t * .7 + k), light: 1, back: .55, rim: p.rim, long: p.long });
      ctx.restore();
    });
    ctx.restore();
  }
  function dioramas(ctx, t) {
    if (t < a.clinics - .2 || t > a.hold2 + 1.2) return;
    ctx.save(); float(ctx, t, 1);
    for (let k = 0; k < 3; k++) {
      const u = boxU(k, t); if (u <= 0) continue; const sink = sinkU(k, t) * 460;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 880); ctx.clip(); ctx.translate(0, sink);
      ctx.beginPath(); ctx.rect(BOXX[k] - BOXW / 2 - 30, BOXB + 92 - (BOXH + 130) * u, BOXW + 60, (BOXH + 130) * u); ctx.clip();   // it rises from the floor
      F.diorama(ctx, t, BOXX[k], BOXB, BOXW, BOXH, { lit: .8, inside: (cx, w, h) => B.miniRoom(cx, t, k, w, h) });
      ctx.restore();
    }
    ctx.restore();
  }
  function boardOverlays(ctx, t) {
    const bu = bigU(t); if (bu < .98 || t > a.maybe + .3) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let k = 0; k < 4; k++) {
      const e = span(t, a.v[k] - .15, a.v[k] + .4) * (1 - span(t, a.v[k] + 1.5, a.v[k] + 2.6)); if (e <= 0) continue;
      const y = rowY(k);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, BIGB.x - 20, 0, BIGB.x + F.BOARD.w * BIGB.sc + 20, 0, [[0, rgba(MINT.halo, 0)], [.3, rgba(MINT.halo, .11 * e)], [1, rgba(MINT.halo, 0)]]);
      ctx.fillRect(BIGB.x - 20, y - 50, F.BOARD.w * BIGB.sc + 40, 72); ctx.restore();
      F.mintSpan(ctx, [[BIGB.x, y + 16], [BIGB.x + 150 * BIGB.sc, y + 16]], 0, expoOut(span(t, a.v[k] - .1, a.v[k] + .7)), { w: 1.6, spark: false, a: e });
    }
    // "its race has already begun": a small mint spark sets off along the Alzheimer's row
    const r = span(t, a.race - .1, a.race + 3.2); if (r > 0) { const y = rowY(3) + 18, x0 = BIGB.x + 168 * BIGB.sc, x1 = BIGB.x + 360 * BIGB.sc, u = sineIO(r) * .55;
      F.mintSpan(ctx, [[x0, y], [x1, y]], Math.max(0, u - .18), u, { w: 2, a: rise(span(r, 0, .2)) }); }
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------------------------- 8.03–A.01 THE HALL, THE LABEL
  const kids = (t) => {
    if (t < a.race - 1.5 || t > a.every + 7) return [];
    return KIDS.map((k, i) => {
      const x0 = 3300 - i * 70, wIn = trap(span(t, a.race - 1.2 + i * .2, a.maybe + 2.3 + i * .15)), wOut = trap(span(t, a.every + .6 + i * .2, a.every + 6.6 + i * .2));
      const D1 = k.stop - x0, xs = lerp(x0, k.stop, wIn), x = lerp(xs, 3150, wOut), D2 = k.stop - 3150;
      const ph = (wIn * D1 / stride(D1, k.h) + wOut * D2 / stride(D2, k.h)) * Math.PI;
      return { x, h: k.h, walk: ph + k.ph * 0, dir: wOut > 0 ? -1 : 1, look: wOut > 0 ? .15 : lerp(.15, .62, span(t, a.maybe + 1.6, a.maybe + 3)) + .04 * Math.sin(t * .8 + i) };
    });
  };
  const l3In = (t) => sineIO(span(t, a.every - .15, a.every + 1.15)), l3Out = (t) => sineIO(span(t, a.chan - .35, a.chan + 1.25));
  function label3(ctx, t, c) {
    const u = l3In(t), out = l3Out(t); if (u <= 0 || out >= 1) return;
    const p0 = E.project(c, F0, PQ[3].x - PQ[3].s / 2, PQ[3].y - PQ[3].h / 2); if (!p0) return;
    const s0 = PQ[3].s * p0[2] / F.DATES.w;
    const x = lerp(lerp(p0[0], L3.x, u), p0[0], out), y = lerp(lerp(p0[1], L3.y, u), p0[1], out), s = lerp(lerp(s0, L3.s, u), s0, out);
    ctx.save(); float(ctx, t, u * (1 - out)); ctx.globalAlpha = span(u, .1, .5) * (1 - span(out, .6, 1));
    const r = B.dates(ctx, t, x, y, s, { name: null, found: span(t, a.found - .32, a.found + .5), blink: span(t, a.proven - .15, a.proven + .35), wait: .45, near: .35, pinA: span(u, .6, 1) });
    // 8.05: the ticker runs over FOUND (no price), fades; a pen comes to lie beside PROVEN
    const ta = rise(span(t, a.inv - .1, a.inv + .8)) * (1 - span(t, a.ours - .3, a.ours + .8));
    if (r && ta > 0) B.ticker(ctx, t, x - 120 * s, x + (F.DATES.w + 80) * s, r.found[1], ta);
    const pu = expoOut(span(t, a.ours + .1, a.ours + 1.0)), nudge = .02 * F.bump(t, a.move - .1, .8);
    if (r && pu > 0) B.pen(ctx, lerp(x + 760 * s, x + 380 * s, pu) + nudge * 400 * s, lerp(y + 470 * s, y + 262 * s, pu), 190 * s, lerp(.5, -.16, pu) - nudge, 1);
    ctx.restore();
    const tu = rise(span(t, a.every + .35, a.every + 1.1)) * (1 - span(t, a.chan - .5, a.chan + .3));
    if (tu > 0) { ctx.save(); float(ctx, t, 1); F.mintText(ctx, [['EVERY CURE HAS ', 0], ['TWO DATES', .8]], L3.x + F.DATES.w * L3.s / 2, L3.y - 40, 40, tu, { serif: false, weight: 600, align: 'center', spacing: .08 }); ctx.restore(); }
  }
  // the hall's people, plaques and the PROVEN stamp (drawn on the F0 card, after the vitrines, so nobody stands behind a plaque)
  function hallExtra(ctx, t) {
    const na = nameA(t);
    for (let i = 0; i < 4; i++) {
      const q = PQ[i], v = S.HALL.V[i]; F.plaque(ctx, t, q.x, q.y, q.s, { name: '' });
      if (na > 0) {
        const h = q.s * .36, sub = i === 3 ? rise(span(t, a.plague - .1, a.plague + .8)) : 0;
        E.glowText(ctx, v.name, q.x, q.y + lerp(h * .1, -h * .04, sub), { size: q.s * .1, align: 'center', spacing: .22, glow: false, col: P.cream, a: na });
        if (sub > 0) E.glowText(ctx, 'A RELIC', q.x, q.y + h * .3, { size: q.s * .06, align: 'center', spacing: .2, glow: false, col: rgba(P.halo2, .85), a: sub * na });
      }
    }
    if (t > a.provedW - .4) F.stamp(ctx, t, 'PROVEN', PQ[3].x + 4, PQ[3].y - PQ[3].h / 2 - 34, { t0: a.provedW + .08, size: 26, rot: -.07, ink: MINT.ink, a: 1 - span(t, a.voEnd + 2.5, a.voEnd + 5) });
    if (t > a.maybe - 2 && t < a.every + 3) S.motes(ctx, t, V4.x + 40, V4.y + 60, V4.w - 80, V4.h - 120, 1.1 * relicU(t), RELIC.body);
    for (const k of kids(t)) { halo(ctx, k.x, S.FLOOR - k.h * .45, k.h * 1.3, .2, LAMP.body, LAMP.core); E.person(ctx, k.x, S.FLOOR, k.h, { walk: k.walk, dir: k.dir, look: k.look, light: 1, back: .85, rim: mixHex(LAMP.body, P.cream, .4) }); }
    if (t > a.chan) {   // you: in from the right, through the night hall, to the vitrine of the mind (empty by then)
      const x = duX(t), D = 5990 - DU_STOP, ph = (5990 - x) / stride(D, DU_H) * Math.PI, idle = span(t, a.endS - 2, a.endS);
      E.du(ctx, x, S.FLOOR, DU_H, { walk: ph, dir: -1, look: lerp(.3, .62, smooth(span(t, a.endS - 3, a.endS - .5))) + .03 * Math.sin(t * .7) * idle, lean: .01 * Math.sin(t * .5) * idle, light: 1, back: .45 });
    }
    // the end: soft mint light in the empty vitrines
    for (let i = 0; i < 3; i++) { const e = emptyU(i, t); if (e > 0) S.motes(ctx, t, S.glassOf(i).x + 60, S.glassOf(i).y + 120, S.glassOf(i).w - 120, S.glassOf(i).h - 200, .7 * e); }
  }

  // ---------------------------------------------------------------------------------------------------------------- ONE FRAME
  let layer = null;
  return (ctx, t) => {
    if (t < tPlateEnd) { S.plateKiosk(ctx, t, T); return; }
    const c = cam(t), q = qr(t), endU = smooth(span(t, a.endS - 8, a.endS));
    S.hallWorld(ctx, c, t, {
      moon: lerp(.75 - .3 * q, .55, endU), door: .5 * smooth(span(t, a.voEnd - 1, a.endS - 1)), du: false,
      kiosk: { glow: lerp(.5, .9, wake(t)) * (1 - .4 * smooth(span(t, a.proposal + 1, a.proposal + 3))), screen: kioskScreen(t) },
      v: (i) => (i === 3 ? { glow: lerp(.82, .5, relicU(t)), spec: { relic: relicU(t) } } : t > a.voEnd ? { glow: lerp(i ? .82 : 1, .6, emptyU(i, t)), spec: { a: 1 - emptyU(i, t) } } : {}),
      plaque: () => ({ a: 0 }),
      frame: { u: 1, cap: 1 - smooth(span(t, a.proposal - 1.5, a.proposal)), a: frameA(t) },   // the caption would sit under the board; C1b's credit carries it
      panel: (cx) => panel(cx, t),
      extra: (cx) => hallExtra(cx, t),
    });
    const va = veil(t); if (va > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, va); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    // c10: on the kiosk glass, the clip
    kioskExplainers(ctx, t, c);
    const m = plateM(t), R = SR(c);
    if (R && t > a.podcast - .15 && t < c2.end + .8 && m > .004) {
      const pa = plateA(t), draw = (cx) => F.clipPlate(cx, t, T, 'C2', { from: { x: R.x, y: R.y, w: R.w, h: R.h }, morph: m, dark: plateDark(t) });
      if (pa > .995) draw(ctx);
      else if (pa > .003) {   // clipPlate sets its own alpha, so it fades through a layer
        if (!layer) layer = createCanvas(W, H); const lc = layer.getContext('2d'); lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, W, H); draw(lc);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = pa; ctx.drawImage(layer, 0, 0); ctx.restore();
      }
    }
    lineA(ctx, t, c);
    // c11
    trialRows(ctx, t);
    deskLabels(ctx, t, c);
    // c12
    dioramas(ctx, t); people(ctx, t); label2(ctx, t, c);
    // c13
    label3(ctx, t, c);
    // the board (top left; it steps back under the footage; big at 8.01–8.02) and its overlays
    if (t < a.maybe + .5) F.board(ctx, t, T, { a: 1 - m * plateA(t), big: bigU(t) });
    const hu = span(t, a.remember - .1, a.remember + .7) * (1 - span(t, a.salesv + .6, a.salesv + 1.6));
    if (hu > 0) {   // "remember the heart": the HEART row glows, a tag hangs beside it
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(MINT.halo, .12 * hu); ctx.fillRect(F.BOARD.x - 8, F.BOARD.y + 104 + 52 - 26, F.BOARD.w + 16, 36); ctx.restore();
      F.tag(ctx, t, F.BOARD.x + F.BOARD.w + 40, F.BOARD.y + 120, 'UP TO 15 YEARS FOLLOW-UP', hu, { col: 'mint', size: 19 });
    }
    boardOverlays(ctx, t);
    // source lines (y ≤ 880)
    F.source(ctx, t, a.fornow + .2, a.other + .6, 'TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST');
    const mb2 = span(t, a.fornow - .1, a.fornow + .9) * (1 - span(t, a.other - .2, a.other + .5));   // faktencheck MB2: one calm bracket over the clinic
    if (mb2 > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.bracket(ctx, 600, 1620, 252, mb2, 'WITHOUT SYMPTOMS: EXPERTS ADVISE IT ONLY IN TRIALS', { size: 27 }); ctx.restore(); }
    F.source(ctx, t, a.europe + .2, a.america + .4, F.SOURCES.procova);
    F.source(ctx, t, a.priority, a.proposal + .6, F.SOURCES.elsa);
    F.source(ctx, t, a.remember + .3, a.salesv + 1.2, F.SOURCES.fdaGene);
    // QR corner (subscribe 2): dark and still
    if (q > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = E.rad(ctx, W, 0, 980, [[0, rgba(P.night0, .62 * q)], [.62, rgba(P.night0, .4 * q)], [1, rgba(P.night0, 0)]]); ctx.fillRect(W - 1000, 0, 1000, 760); ctx.restore(); }
  };
}
