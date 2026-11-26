// c10 · Their scenario: SCENARIO · 2027 (the year rolls in, becomes the stamp) · a year of progress every week · the pupil turns away ·
// one committee, one vote: 6 : 4 ★ · two endings (the fork) · not code, not experiments, not even research · rungs 4 + 5 (flag, lever) ·
// back to TODAY: people hold both · K3 Pachocki (the card slides out of the lever's light) · who holds the last rung? (builder B3)
// B3 = c10 + c11 + c12 as ONE continuous take: the camera, the world and every layer of the group live here in b3(T); sc11.mjs and
// sc12.mjs return the same draw, so the inner chunk boundaries are seamless by construction. Plan: docs/shots.md 10.01–E.01.
// Entry: lib/f31_world.mjs plateMachine at 'Their scenario, late' (drawn for .5 s, then its creep blends into the B3 camera).
//
// | ID     | anchor (phrase)                   | picture (one idea)                                                              | camera / layer         |
// |--------|-----------------------------------|---------------------------------------------------------------------------------|------------------------|
// | 10.01  | Their scenario, late              | out of plateMachine: 2027 rolls in (digit roll) on "twenty twenty-seven"        | MACH creep · MIX       |
// | 10.02  | Inside one lab                    | the year shrinks into the stamp (where the HUD sat); a month page flips past    | push · MIX             |
// |        |                                   | the ring, faster and faster: A YEAR OF PROGRESS · EVERY WEEK                    |                        |
// | 10.03  | And it has begun to follow goals  | pull back to you; the core's pupil turns away from you (one look)              | pull back · WORLD      |
// | 10.04★ | Then everything comes down        | veil: ONE COMMITTEE · ONE VOTE; ten seats light one by one: 6 : 4               | travel → LADDER · EXPL |
// | 10.05  | In one ending                     | the table sinks, the fork grows from it: gold path up into light (THE RACE      | creep · EXPL           |
// |        |                                   | GOES ON) · cream path, people at its end (SLOW DOWN · OVERSIGHT)               |                        |
// | 10.06  | It's a story                      | the veil thins to the hall: the ladder with labels; NOT CODE … strikes 1–3      | LADDER creep · EXPL    |
// | 10.07  | The top of the ladder             | NOT ABOUT BUILDING bracket; rung 4 (flag) and 5 (lever) glow cream on the words | creep · EXPL           |
// | 10.08  | Back to today                     | the stamp rolls 2027 → TODAY, sinks into the HUD; two cream hands hold 4 and 5  | creep · MIX            |
// | 10.09  | But holding a rung                | push to the lever; K3 grows out of its light, the spoken words light            | push · EXPL            |
// | 10.10  | So who holds the last rung        | the card goes back into the lever; a ? swings on it; you look up               | ease back · MIX        |
// | 11.01★ | Right now, the labs hold          | THE LABS THEMSELVES on the lever; veil: ≈ 30,000; the MONITOR EYE opens, sweeps | creep · EXPL           |
// | 11.02  | About fifty cases                 | cases travel to a person: ≈ 50 A WEEK                                           | creep · EXPL           |
// | 11.03  | But that's a lab checking itself  | the town sinks, the eye glides over the lab's ring: A LAB CHECKING ITSELF;      | creep · EXPL           |
// |        |                                   | WHO CHECKS THE LAB?; three cool figures walk in: OUTSIDERS                      |                        |
// | 11.04  | This fall                         | the accord rises, five signatures write on; PROMISED · NOT REQUIRED stamps      | creep · EXPL           |
// | 11.05  | And the stop itself               | veil lifts; push to the lever; a builder beside it, its eye swells             | push · MIX             |
// | 11.06  | slot:T3                           | CLIP T3 grows out of the builder's eye                                          | CLIP                   |
// | 11.07  | Briefly                           | the plate shrinks into the pace dial: the needle sinks to ≈ ¼ OF TODAY'S PACE   | (behind veil) · EXPL   |
// | 11.08  | So the stop has to be agreed      | the dial sinks, a rule book rises: AGREED IN ADVANCE                            | EXPL                   |
// | 11.09  | Here, even rivals                 | the book opens into two cards: OPENAI'S CHIEF SCIENTIST · ANTHROPIC             | travel → YOU · EXPL    |
// | 11.10  | That includes the people          | a long table, one free place; you walk in; your note rises: WHO CHECKS THE      | SCENE                  |
// |        |                                   | LABS? · WHO CAN CALL A STOP?                                                    |                        |
// | 11.11  | Machines now do the building      | the table sinks, the veil lifts: you are in the foundry; pull back wide         | pull back · WORLD      |
// | 12.01  | So how close is (2nd)             | LADDER: the gold drains from the rungs; labels rise                            | → LADDER · MIX         |
// | 12.02  | Two rungs                         | the rungs fill with the words; rung 3 half + dashed FORECAST (flickers)         | creep · EXPL           |
// | 12.03  | When you turn off (2nd)           | the veil lifts; your lamp flickers and goes OFF; the foundry keeps building     | creep · WORLD          |
// | 12.04  | You may be using one (2nd)        | OLD_CAM: THE A.I. YOU USE, the thread; a builder grows out of the ring          | glide · WORLD          |
// | 12.05★ | Whether it's allowed to           | you climb the ladder, rung by rung, and put your hand on the lever              | follow up · SCENE      |
// | 12.06  | That's the last rung              | pull back: you tiny at the top in the gold light: THE LAST RUNG IS STILL OURS   | pull back · MIX        |
// | A.01   | This channel exists (2nd)         | subscribe 2: glide to END_CAM; hall windows warm; your lamp back on; you climb  | glide · WORLD          |
// |        |                                   | down                                                                            |                        |
// | A.02/E | END · ENDSCREEN                   | END_CAM: you walk back to your bench (left tile); the ring breathes; no text    | breathing hold · WORLD |
// carriers: plate → the year → the stamp (HUD corner) → the month page → the pupil → the veil → the seats → the fork → the ladder (it was
// under the veil all along) → the rungs → the stamp → the lever's light → the card → the lever → the ? → the town → the eye → the ring →
// the document → the lever → the builder's eye → the plate → the dial → the book → two cards → the table → you → the foundry → the ladder →
// the lamp → the thread → the ladder → you → END_CAM
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import * as S from '../lib/f31_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, rad } = E;
const { rise, FORGE, COOL, PAPER, F0, maskLine, measure } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT31;
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b3(T), print: PRINT }]; };

// ------------------------------------------------------------------------------------------------ anchors (phrases only)
function anchors(T) {
  const a = {};
  const G = (p, after) => T.G(p, 0, after), GE = (p, after) => T.GE(p, 0, after);
  a.scen = G('Their scenario, late'); a.y27 = G('twenty twenty-seven', a.scen); a.y27e = GE('twenty twenty-seven', a.scen);
  a.inside = G('Inside one lab', a.scen); a.year = G('a year of progress', a.inside); a.week = G('every week', a.inside);
  a.begun = G('And it has begun', a.inside); a.goals = G('goals of its own', a.begun); a.own = GE('its own', a.goals);
  a.then = G('Then everything comes down', a.begun); a.comm = G('committee', a.then); a.vote = G('One vote', a.then); a.six = G('Six to four', a.then); a.four = GE('Six to four', a.then);
  a.ending = G('In one ending', a.six); a.race = G('the race goes on', a.ending); a.charge = GE('in charge', a.ending);
  a.other = G('In the other', a.ending); a.slow = G('slow down', a.other); a.overs = G('under oversight', a.other);
  a.story = G("It's a story", a.other); a.look = G('look at what the vote', a.story);
  a.nc = G('Not code', a.story); a.ne = G('Not experiments', a.story); a.nr = G('Not even research', a.story);
  a.top = G('The top of the ladder', a.nr); a.notB = G("isn't about building", a.top);
  a.r4 = G('Rung four', a.top); a.goal = G('choosing the goal', a.r4); a.want = G('Deciding what we', a.r4);
  a.r5 = G('Rung five', a.r4); a.stop = G('deciding when to stop', a.r5);
  a.back = G('Back to today', a.r5); a.hold = G('people still hold both', a.back); a.setG = G('they set the goal', a.hold); a.pause = G('go on or to pause', a.hold);
  a.holding = G('But holding a rung', a.back); a.sept = G('In September', a.holding); a.writing = GE('put it in writing', a.sept);
  a.q0 = G('continue responsibly', a.sept); a.q1 = GE('much longer', a.sept);
  a.who = G('So who holds the last rung', a.sept); a.say = G('do you get a say', a.who);
  // c11
  a.labs = G('Right now, the labs hold', a.who); a.themselves = G('themselves', a.labs);
  a.anth = G('At Anthropic', a.labs); a.thirty = G('thirty thousand', a.anth); a.monitor = G('monitor first', a.anth); a.watching = G('a machine watching', a.anth);
  a.fifty = G('About fifty cases', a.anth); a.person = G('reach a person', a.fifty);
  a.itself = G("But that's a lab checking", a.fifty); a.whoLab = G('So who checks the lab', a.itself); a.outs = G('Outsiders', a.whoLab);
  a.fall = G('This fall', a.outs); a.leaders = G('the leaders of the biggest', a.fall); a.prom = G('Promised', a.leaders + 1.5); a.notReq = G('Not required', a.prom);
  a.binding = G('Making it binding', a.notReq);
  a.stopIt = G('And the stop itself', a.binding); a.asked = G('Tao Lin was asked', a.stopIt);
  const c3 = T.clip('T3'); a.t3s = c3.start; a.t3e = c3.end;
  a.briefly = G('Briefly', a.t3e - .5); a.quarter = G('a quarter', a.briefly); a.cautious = G('cautious labs', a.briefly);
  a.agreed0 = G('So the stop has to be agreed', a.cautious); a.agreed = G('agreed in advance', a.agreed0);
  a.rivals = G('Here, even rivals', a.agreed); a.oai = G("OpenAI's chief scientist", a.rivals); a.mand = G('made mandatory', a.oai);
  a.anth2 = G('Anthropic says', a.mand); a.opt = G('the option to pause', a.anth2); a.rules = G('rules set beforehand', a.anth2); a.table = G('outsiders at the table', a.anth2);
  a.people = G('That includes the people', a.table); a.question = G('Your question for them', a.people);
  a.q1w = G('who checks the labs', a.question); a.q2w = G('who can call a stop', a.question); a.ask = G('Ask it', a.question); a.racing = G('racing each other', a.ask);
  a.mach = G('Machines now do the building', a.ask); a.dec = G('People still do the deciding', a.mach);
  a.what = G('what gets built', a.dec); a.whoIt = G('who checks it', a.dec); a.when = G('and when to stop', a.dec);
  // c12
  a.close = T.G('So how close is', 1); a.two = G('Two rungs', a.close); a.taken = G('taken', a.two);
  a.third = G('The third', a.two); a.shared = G('shared', a.third); a.best = G('best-known forecast', a.third); a.nextY = G('taken next year', a.third);
  a.last2 = G('The last two', a.nextY); a.hands = G('human hands', a.last2); a.only = G('And that forecast only holds', a.hands); a.slow2 = GE('slow down', a.only);
  a.turn = G('When you turn off', a.only); a.off = G('off', a.turn + .2); a.goOn = G('the machines will go on', a.turn);
  a.using = G('You may be using one', a.turn); a.minds = G('designed by human minds', a.using);
  a.nextOne = G('The next one may', a.using); a.design = G('design its own successor', a.nextOne);
  a.allowed = G("Whether it's allowed", a.design); a.human = G('human decision', a.allowed);
  a.lastR = G("That's the last rung", a.allowed); a.ours = G("And it's still ours", a.lastR);
  a.chan = G('This channel exists', a.ours); a.all = G('all of us', a.chan); a.sub = G('Subscribe', a.chan);
  a.vEnd = T.words[T.words.length - 1].e;   // the last word ('END' in the shot list)
  a.endS = T.duration - 15;                  // the 15 s end screen ('ENDSCREEN')
  return a;
}

// ------------------------------------------------------------------------------------------------ small local pieces
const ROLL = '0123456789';
const camMix = (p, q, w) => ({ ...p, x: lerp(p.x, q.x, w), y: lerp(p.y, q.y, w), z: lerp(p.z, q.z, w) });
const TBL = { x: 470, w: 980, y: 640 };                  // the committee table (screen)
const SEATS = 10, GOLD6 = [0, 1, 2, 3, 4, 5], ORDER = [3, 7, 0, 5, 9, 1, 6, 2, 8, 4];
const LTBL = { x0: 300, x1: 1620, top: 610, floor: 800 }; // the long table of 11.10 (screen)
const LTP = [430, 590, 750, 1170, 1330, 1490];           // the people at it; the free place is 960
const YOUS = { x: 960, y: 800, h: 300 };                  // you at the free place (screen); the world camera matches it at 'Machines now'

// a pace dial: 0 … TODAY'S PACE, the gold arc = the pace, the needle sinks to v
function paceDial(ctx, t, x, y, r, o) {
  const u = clamp(o.u); if (u <= 0) return;
  const k = expoOut(u), v = o.v, ang = (q) => Math.PI + clamp(q) * Math.PI;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  ctx.lineCap = 'butt'; ctx.strokeStyle = rgba(P.cream, .16); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(x, y, r, Math.PI, Math.PI + Math.PI * k); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(FORGE.halo, .22); ctx.lineWidth = r * .17; ctx.beginPath(); ctx.arc(x, y, r, Math.PI, ang(v * k)); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = E.lin(ctx, x - r, y, x + r, y, [[0, FORGE.body], [1, FORGE.hot]]); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(x, y, r, Math.PI, ang(v * k)); ctx.stroke();
  for (const q of [0, .25, .5, .75, 1]) { const a = ang(q); ctx.strokeStyle = rgba(P.cream, q === 0 || q === 1 ? .75 : .45); ctx.lineWidth = q === .25 ? 3 : 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8); ctx.lineTo(x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7); ctx.stroke(); }
  E.glowText(ctx, '¼', x + Math.cos(ang(.25)) * r * .56, y + Math.sin(ang(.25)) * r * .56 + 12, { size: 34, serif: true, col: P.halo2, glow: false, align: 'center', a: span(u, .3, 1) });
  E.glowText(ctx, "TODAY'S PACE", x + r * 1.08, y + 46, { size: 22, weight: 600, spacing: .12, col: FORGE.text, glow: false, align: 'right', a: rise(span(u, .3, 1)) });
  E.glowText(ctx, 'PAUSE', x - r * 1.08, y + 46, { size: 22, weight: 600, spacing: .12, col: P.cream, glow: false, a: rise(span(u, .3, 1)) });
  const na = ang(v + .004 * Math.sin(t * 1.7));
  ctx.strokeStyle = P.cream; ctx.lineWidth = r * .028; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(na) * r * .92, y + Math.sin(na) * r * .92); ctx.stroke();
  halo(ctx, x + Math.cos(na) * r * .92, y + Math.sin(na) * r * .92, r * .1, .6, P.halo2, P.cream);
  ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(x, y, r * .055, 0, TAU); ctx.fill();
  ctx.restore();
}
// a builder (as lib/f31_kit builders(): dark body, forge eye, an arm) at (x, y), arm toward (tx, ty); eye 0..1 swells the eye
function builder(ctx, t, x, y, s, tx, ty, eye = 0, a = 1) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = mixHex(P.ind2, P.blue2, .6); ctx.lineWidth = s * .35; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, tx, .8), lerp(y, ty, .8)); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(FORGE.line, .35 + .4 * eye); ctx.lineWidth = Math.max(1, s * .12); ctx.stroke();
  halo(ctx, x, y, s * (2.2 + 2.5 * eye), .35 + .4 * eye, FORGE.halo, FORGE.hot); ctx.fillStyle = FORGE.hot; ctx.beginPath(); ctx.arc(x, y, s * (.32 + .3 * eye), 0, TAU); ctx.fill();
  ctx.restore();
}
// a cream hand of light (people hold the rung): fingers up over the bar, the forearm from below
function creamHand(ctx, x, y, L, g, t) {
  if (g <= 0) return;
  const m = E.handMatrix(x, y + L * .35, -Math.PI / 2 + .35, L * expoOut(g), 1), cut = new Path2D(); cut.rect(-.35, -1.4, 3, 2.8);
  const hp = E.handPath({ pose: 'hold', curl: .35 }).op(cut, PathOp.Intersect), path = new Path2D(); path.addPath(hp, m);
  ctx.save(); ctx.globalAlpha *= clamp(g * 4);
  halo(ctx, x, y - L * .5, L * 3.2, .3 * (1 + .1 * Math.sin(t * 1.3)), P.halo2, P.cream);
  ctx.fillStyle = E.lin(ctx, x - L, y + L, x + L, y - L * 1.4, [[0, mixHex(P.halo2, P.shade1 ?? P.halo2, .3)], [1, P.cream]]); ctx.fill(path);
  ctx.restore();
}
// the year roll: each digit column scrolls up into its digit (staggered), masked in its box
function rollYear(ctx, x, y, size, txt, p, o = {}) {
  let xx = x; const cw = measure('0', size, true) * 1.02;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i], d = ROLL.indexOf(ch), q = sineIO(clamp(p * 1.6 - i * .2)), n = 6 + i * 2;   // n digits roll past
    ctx.save(); ctx.beginPath(); ctx.rect(xx - 4, y - size * .9, cw + 8, size * 1.08); ctx.clip();
    for (let k = 0; k <= n; k++) {
      const yy = y + (n - k) * size * 1.05 - q * n * size * 1.05; if (Math.abs(yy - y) > size * 1.2) continue;
      const dig = d >= 0 ? ROLL[(d - k + 100) % 10] : ch;
      E.glowText(ctx, dig, xx, yy, { size, serif: true, col: o.col ?? P.cream, glow: false });
    }
    ctx.restore(); xx += cw;
  }
  return xx - x;
}

// ------------------------------------------------------------------------------------------------ the take
export function b3(T) {
  const a = anchors(T);
  const tPlateEnd = a.scen + S.SEAM_HALF;
  // ---------------------------------------------------------------- the camera (one take, phrases only)
  const creepM = (t) => { const k = S.creep(t, T, 'Their scenario, late'); return S.MACH_CAM(k, S.trk(k) * .3); };
  const TOPC = (k = 1) => E.aim(F0, 1150, 470, 1.25 * k);                  // the top of the ladder: rungs 4 + 5 and the lever
  const LEVC = (k = 1) => E.aim(F0, 1200, 430, 1.5 * k);                 // the lever and the builder beside it
  const YOUC = E.aim(F0, S.YOU.x, S.YOU.y, YOUS.h / S.YOU.h, YOUS.x, YOUS.y);   // you at the free place of the table (11.10 → 11.11)
  const CLIMBC = (k = 1) => E.aim(F0, 1060, 560, .95 * k);
  const K = [
    [tPlateEnd, creepM(tPlateEnd)], [a.goals - 1.2, S.MACH_CAM(1.12, 40)],
    [a.own + .2, S.HOME], [a.then + .4, E.aim(F0, 965, 540, 1.01)],
    [a.vote + 1.2, S.LADDER_CAM(1)], [a.story, S.LADDER_CAM(1.03, 6)], [a.back, S.LADDER_CAM(1.07, 14)],
    [a.holding + .3, S.LADDER_CAM(1.08, 16)], [a.sept + .4, TOPC(1)], [a.who - .2, TOPC(1.04)],
    [a.who + 1.8, S.LADDER_CAM(1.08, 16)], [a.labs + 1.4, S.LADDER_CAM(1.14, 28)], [a.stopIt - .3, S.LADDER_CAM(1.17, 36)], [a.asked + 1.6, LEVC(1)], [a.t3s, LEVC(1.03)],
    [a.t3e + 1.2, S.LADDER_CAM(1.1, 20)], [a.rivals + .5, S.LADDER_CAM(1.12, 24)], [a.people - .4, YOUC],
    [a.mach + .5, E.aim(F0, S.YOU.x, S.YOU.y, YOUS.h / S.YOU.h * 1.01, YOUS.x, YOUS.y)], [a.dec + 2.2, S.WIDE_CAM(1)], [a.close - 1.2, S.WIDE_CAM(1.04, 12)],
    [a.close + 1.6, S.LADDER_CAM(1)], [a.turn - .4, S.LADDER_CAM(1.05, 10)], [a.goOn + .2, S.LADDER_CAM(1.06, 12)],
    [a.using + .6, E.aim(S.Z_HALL, S.OLD.x + 560, S.OLD.y - 40, 1.12)], [a.nextOne, E.aim(S.Z_HALL, S.OLD.x + 572, S.OLD.y - 40, 1.15)], [a.nextOne + 2.4, CLIMBC(1)], [a.allowed + .6, CLIMBC(1.03)],
    [a.human + .3, TOPC(1.05)], [a.lastR - .1, TOPC(1.07)], [a.ours + .6, S.WIDE_CAM(.98)], [a.chan + .2, S.WIDE_CAM(1)],
    [a.sub + .2, S.END_CAM], [a.endS + 15.5, E.aim(S.Z_MACH, S.MACH.x - 110, S.MACH.y + 50, .9, 960, 300)],
  ];
  const camRaw = (t) => {
    const p = F.camPath(t, K);
    if (t < tPlateEnd + 1.6) return camMix(creepM(t), p, sineIO(span(t, tPlateEnd, tPlateEnd + 1.6)));
    
    return p;
  };
  // nothing stands still: a slow sway on top of the path (≈ 6–8 px/s at the workshop), faded in after the plate
  const sway = (c, t) => { const w = smooth(span(t, tPlateEnd, tPlateEnd + 2.5)); return { ...c, x: c.x + w * 34 * Math.sin(t * .23 + .4), y: c.y + w * 12 * Math.sin(t * .17 + 1.3) }; };
  const cam = (t) => sway(E.camDrift(camRaw(t), t, 1.7 * smooth(span(t, tPlateEnd, tPlateEnd + 2)), 7), t);

  // ---------------------------------------------------------------- world state
  const lampA = (() => {
    const tOff = a.off + .12;
    return (t) => {
      if (t < tOff - .42) return 1;
      if (t < tOff) return .55 + .45 * Math.abs(Math.sin((t - tOff) * 40));
      if (t < tOff + .07) return .25;
      return smooth(span(t, a.all - .4, a.all + .4));   // back ON for the subscribe call
    };
  })();
  const hall = (t) => lerp(.5, .7, smooth(span(t, a.goOn - .2, a.goOn + 2))) + .3 * smooth(span(t, a.chan, a.chan + 3));
  const work = (t) => .6 + .4 * smooth(span(t, a.inside - .2, a.inside + 1.5)) * (1 - smooth(span(t, a.story, a.story + 2))) + .4 * smooth(span(t, a.goOn - .3, a.goOn + 1.2)) * (1 - smooth(span(t, a.sub, a.endS)));
  const build = (t) => .94 + .02 * smooth(span(t, a.inside, a.goals));
  const pupil = (t) => sineIO(span(t, a.goals - .1, a.own + .7)) * (1 - sineIO(span(t, a.story, a.story + 2.2)));
  // the HUD hides while the scenario stamp holds its corner (10.01 → 10.08)
  const hudA = (t) => 1 - sineIO(span(t, a.scen + .1, a.scen + .9)) * (1 - sineIO(span(t, a.hold + .2, a.hold + 1.0)));
  // ladder states: the kit's (F.LADDER phrases) until 12.01; then the answer: the gold drains, the rungs light with the words
  const ladState = (t) => {
    if (t < a.close + .4) { const s = F.ladderState(T, t); return { state: s.state, lit: s.lit, fc3: 0 }; }
    const drain = 1 - sineIO(span(t, a.close + .4, a.close + 1.8));
    const l12 = Math.max(drain, sineIO(span(t, a.two - .1, a.taken + .3)));
    const l3 = Math.max(drain * .0, sineIO(span(t, a.shared - .15, a.shared + .6)));
    const fc3 = Math.max(drain, span(t, a.nextY - .1, a.nextY + .5));
    return { state: [1, 1, .5, 0, 0], lit: [l12, sineIO(clamp(l12 * 1.2 - .2)), l3, 1, 1], fc3 };
  };
  // the explainer ladder: the world ladder seen through veilBack (only the hall and the machine veil, the ladder reads)
  const vBack = (t) => .8 * Math.max(sineIO(span(t, a.story - .4, a.story + 1.6)) * (1 - sineIO(span(t, a.back - .1, a.back + 1.9))),
    sineIO(span(t, a.close + .2, a.close + 2.0)) * (1 - sineIO(span(t, a.only + .4, a.turn - .3))));
  const labU = (t) => Math.max(rise(span(t, a.story + .3, a.story + 1.3)) * (1 - expoIn(span(t, a.back, a.back + .7))), rise(span(t, a.close + 1.0, a.close + 2.0)) * (1 - expoIn(span(t, a.only + .6, a.turn - .6))));
  // full veil phases (explainers)
  const vVote = (t) => sineIO(span(t, a.then - .1, a.then + 1.1)) * (1 - sineIO(span(t, a.story - .3, a.story + 1.4)));
  const vCard = (t) => sineIO(span(t, a.sept - .1, a.sept + 1.0)) * (1 - sineIO(span(t, a.who - .2, a.who + 1.0)));
  const vMon = (t) => sineIO(span(t, a.anth - .3, a.anth + .9)) * (1 - sineIO(span(t, a.stopIt - .2, a.stopIt + 1.4)));
  const vPace = (t) => sineIO(span(t, a.t3e - .6, a.t3e + .4)) * (1 - sineIO(span(t, a.mach + .1, a.mach + 2.0)));
  const veilA = (t) => .84 * Math.max(vVote(t), vCard(t), vMon(t), vPace(t));

  // ---------------------------------------------------------------- you (drawn in the workshop card, after the ladder)
  // climb: 0 = on the floor at YOU … 4 = standing on rung 4 (k = 3), hand to the lever on rung 5
  const climbUp = (t) => { const p = span(t, a.nextOne + 1.6, a.human - .3); return p * 4; };
  const climbDn = (t) => { const p = span(t, a.all - .4, a.endS + .6); return p * 4; };
  const climbP = (t) => (t < a.all - .4 ? climbUp(t) : 4 - climbDn(t));
  const step = (c) => { const i = Math.floor(c), f = c - i; return i + sineIO(f); };
  function drawYou(ctx, t, lad) {
    const c = clamp(climbP(t), 0, 4);
    const walkBack = span(t, a.endS + .6, a.endS + 4.4);   // back to your bench (END_CAM: the floor at the left)
    if (c <= 0 || !lad) {
      if (t > a.endS) {
        const x = lerp(S.LADDERPOS.x - 70, S.YOU.x + 60, sineIO(walkBack)), walking = walkBack > 0 && walkBack < 1;
        return E.du(ctx, x, S.YOU.y, S.YOU.h, { light: .8, back: .4, dir: -1, walk: walking ? walkBack * 9 : undefined, view: walking ? 'side' : undefined, look: walking ? 0 : .5 + .1 * Math.sin(t * .4) });
      }
      const look = lerp(.35, .85, sineIO(span(t, a.say - .3, a.say + .8))) * (1 - .6 * sineIO(span(t, a.labs, a.labs + 1.5))) + .2 * Math.sin(t * .3) * .2;
      const walkIn = t > a.nextOne + .4 ? span(t, a.nextOne + .4, a.nextOne + 1.6) : 0;   // 3 steps to the ladder's foot
      const x = lerp(S.YOU.x, S.LADDERPOS.x - 70, sineIO(walkIn)), w = walkIn > 0 && walkIn < 1;
      return E.du(ctx, x, S.YOU.y, S.YOU.h, { light: .8, back: .4, dir: 1, look: w ? .2 : look, walk: w ? walkIn * 9 : undefined, view: w ? 'side' : undefined });
    }
    // on the ladder (seen from behind, between the rails)
    const s = step(c), i = Math.min(3, Math.floor(s)), f = s - Math.floor(s);
    const yAt = (q) => (q <= 0 ? S.LADDERPOS.y : lad.rungAt(Math.min(4, q - 1))[1]);
    const y0 = yAt(Math.floor(s)), y1 = yAt(Math.min(4, Math.floor(s) + 1)), y = c >= 4 ? yAt(4) : lerp(y0, y1, f);
    const fxAt = (yy) => { const [rx0, ry0] = lad.rungAt(0), [rx1, ry1] = lad.rungAt(4); return lerp(rx0, rx1, (yy - ry0) / (ry1 - ry0)); };
    const enter = clamp(c * 3), x = lerp(S.LADDERPOS.x - 70, fxAt(y), sineIO(enter));
    const ph = c * Math.PI, sw = Math.sin(ph);
    const top = c >= 3.9 ? 1 : 0, reach = smooth(span(t, a.human - .5, a.human + .3)) * (t < a.all ? 1 : 1 - span(t, a.all - .4, a.all + .2));
    const armR = top ? [lerp(2.4, 2.25, reach), lerp(2.6, 2.1, reach)] : [2.55 + .35 * sw, 2.75 + .25 * sw];
    const armL = [-(2.55 - .35 * sw), -(2.75 - .25 * sw)];
    return E.du(ctx, x, y + 2, S.YOU.h * .92, { light: .9, back: .6, dir: 1, view: 'back', look: .9, armR, armL });
  }

  // ---------------------------------------------------------------- the frame
  return (ctx, t) => {
    if (t < tPlateEnd) { S.plateMachine(ctx, t, T); return; }
    const c = cam(t), ls = ladState(t), vb = vBack(t), lu = labU(t);
    let levS = null, bEye = null, bF0 = null;
    const out = S.foundry(ctx, c, t, {
      machine: { build: build(t), glow: 1.15 + .25 * F.bump(t, a.design - .2, 1.6) },
      builders: { work: work(t) }, hall: hall(t), carts: .6 + .3 * span(t, a.goOn, a.goOn + 2), lamp: lampA(t), veilBack: vb,
      old: { thread: .8 + .2 * span(t, a.using, a.using + 1), glow: .6 + .25 * F.bump(t, a.using, 3.5) },
      ladder: { state: ls.state, lit: ls.lit, labels: lu, size: 30, brake: .22 * F.bump(t, a.stop + .2, 1.6) + .18 * F.bump(t, a.pause - .1, 1.4) + .3 * smooth(span(t, a.human - .2, a.human + .6)) * (1 - smooth(span(t, a.all - .4, a.all + 1))) },
      you: false,
      front: (cx, mc) => {
        // 10.03: the pupil turns away from you (cover the kit's pupil with the core's own light, draw it displaced)
        const pu = pupil(t);
        if (pu > 0) {
          const br = 1 + .01 * Math.sin(t * .8), cr = S.MACH.r * .5 * br, X = S.MACH.x, Y = S.MACH.y, an = -.62;
          cx.save(); cx.beginPath(); cx.arc(X, Y, cr * .235, 0, TAU); cx.clip();
          cx.fillStyle = rad(cx, X, Y, cr, [[0, FORGE.core], [.35, FORGE.hot], [.78, FORGE.body], [1, FORGE.mid]]); cx.fillRect(X - cr, Y - cr, cr * 2, cr * 2); cx.restore();
          const d = cr * .24 * pu, px = X + Math.cos(an) * d, py = Y + Math.sin(an) * d;
          cx.save(); cx.translate(px, py); cx.rotate(an); cx.fillStyle = rgba(mixHex(P.night0, FORGE.mid, .25), .9); cx.beginPath(); cx.ellipse(0, 0, cr * .2 * (1 - .22 * pu), cr * .2, 0, 0, TAU); cx.fill(); cx.restore();
        }
        // 12.04: the next one designs its own successor: a new builder grows out of the ring and joins the others
        const nu = sineIO(span(t, a.design - .1, a.design + 1.6));
        if (nu > 0) {
          const an = 2.5 - .25 * nu + t * .02, r0 = S.MACH.r * lerp(1.0, 1.3, nu), x = S.MACH.x + Math.cos(an) * r0, y = S.MACH.y + Math.sin(an) * r0;
          F.goldSpan(cx, [[S.MACH.x + Math.cos(an) * S.MACH.r * .5, S.MACH.y + Math.sin(an) * S.MACH.r * .5], [x, y]], 0, 1, { w: 2.2 * (1 - .6 * nu), a: 1 - .5 * nu, spark: false });
          builder(cx, t, x, y, S.MACH.r * .058 * expoOut(nu), S.MACH.x + Math.cos(an) * S.MACH.r, S.MACH.y + Math.sin(an) * S.MACH.r, .3 * (1 - nu), 1);
        }
      },
      extra: (cx, hand, lad) => {
        if (!lad) { drawYou(cx, t, null); return; }
        const rg = lad.rungs, sz = 30, th = 13.5;
        // 10.06: NOT CODE · NOT EXPERIMENTS · NOT EVEN RESEARCH: a cream strike through the label, the rung dims
        for (const [k, t0] of [[0, a.nc], [1, a.ne], [2, a.nr]]) {
          const g = span(t, t0 - .05, t0 + .4) * (1 - span(t, a.back - .2, a.back + .4)); if (g <= 0 || !rg[k]) continue;
          const r = rg[k], lx = r.x1 + sz * 1.1, txt = `${k + 1}  ${F.RUNGS[k]}`, tw = measure(txt, sz, false, 600) + txt.length * sz * .1;
          cx.fillStyle = rgba(P.night0, .55 * g); cx.fillRect(r.x0 - 6, r.y - 14, r.x1 - r.x0 + 12, 28);
          cx.fillStyle = rgba(P.night0, .5 * g); cx.fillRect(lx - 6, r.y - sz * .7, tw + 12, sz * 1.2);
          cx.strokeStyle = rgba(P.cream, .9); cx.lineWidth = 3; cx.beginPath(); cx.moveTo(lx - 8, r.y - sz * .05); cx.lineTo(lx - 8 + (tw + 16) * expoOut(g), r.y - sz * .05); cx.stroke();
        }
        // 10.07: NOT ABOUT BUILDING (a bracket left of rungs 4 + 5); the rungs glow cream on their words
        if (rg[3] && rg[4]) {
          const bu = span(t, a.notB - .1, a.notB + .7) * (1 - span(t, a.back - .2, a.back + .5));
          if (bu > 0) {
            const bx = Math.min(rg[3].x0, rg[4].x0) - 46, y0 = rg[4].y - 34, y1 = rg[3].y + 34, m = (y0 + y1) / 2, hh = (y1 - y0) / 2 * expoOut(bu);
            cx.strokeStyle = rgba(P.halo2, .9); cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(bx + 16, m - hh); cx.lineTo(bx, m - hh); cx.lineTo(bx, m + hh); cx.lineTo(bx + 16, m + hh); cx.stroke();
            maskLine(cx, [['NOT ABOUT', 0]], bx - 22, m - 6, 30, rise(bu), { serif: false, weight: 600, col: P.cream, glow: false, align: 'right' });
            maskLine(cx, [['BUILDING', 0]], bx - 22, m + 30, 30, rise(span(bu, .15, 1)), { serif: false, weight: 600, col: P.cream, glow: false, align: 'right' });
          }
          for (const [k, t0, tag] of [[3, a.goal, 'HUMAN · CHOOSING THE GOAL'], [4, a.stop, 'HUMAN · WHEN TO STOP']]) {
            const g = span(t, t0 - .15, t0 + .6) * (1 - span(t, a.back - .1, a.back + .6)), r = rg[k];
            const gl = F.bump(t, t0 - .15, 2.4) * .6 + .25 * span(t, t0, t0 + .5) * (1 - span(t, a.close - 2, a.close));
            if (gl > 0) halo(cx, (r.x0 + r.x1) / 2, r.y, (r.x1 - r.x0) * 1.1, .45 * gl, P.halo2, P.cream);
            if (g > 0) maskLine(cx, [[tag, 0]], r.x1 + sz * 1.9, r.y + sz * 1.35, 24, rise(g), { serif: false, weight: 600, col: P.halo2, glow: false });
          }
          // 10.08: two cream hands hold rungs 4 and 5 (people hold both)
          const hu4 = span(t, a.hold - .1, a.hold + .9), hu5 = span(t, a.hold + .4, a.hold + 1.4), hout = 1 - sineIO(span(t, a.labs + .2, a.anth + .2));
          if (hu4 * hout > 0) creamHand(cx, rg[3].x0 + (rg[3].x1 - rg[3].x0) * .3, rg[3].y, 27, hu4 * hout, t);
          if (hu5 * hout > 0) creamHand(cx, rg[4].x0 + (rg[4].x1 - rg[4].x0) * .3, rg[4].y, 27, hu5 * hout, t + 1);
          // the lever's knob (for the card, the ? tag and the label)
          const la = -.5 + .04 * Math.sin(t * .6), L = th * 4.6; levS = [rg[4].x1 + th * .2 + Math.sin(la) * L, rg[4].y - Math.cos(la) * L];
          // 10.10: a ? swings on the lever; 11.01: THE LABS THEMSELVES
          const qu = span(t, a.who + .5, a.who + 1.4) * (1 - span(t, a.labs - .1, a.labs + .5));
          if (qu > 0) F.priceTag(cx, t, levS[0], levS[1] + 8, '?', qu, { len: 46, size: 30 });
          const tu = rise(span(t, a.themselves - .4, a.themselves + .5)) * (1 - expoIn(span(t, a.anth - .2, a.anth + .5)));
          if (tu > 0) F.goldLabel(cx, levS[0] - 14, levS[1] + 4, 'HELD BY THE LABS', 'THEMSELVES', tu, { dx: -150, dy: 40, size: 28 });
          // 12.02: rung 3 dashed FORECAST (flickers on "only holds if nobody chooses to slow down"); tags with the words
          if (ls.fc3 > 0 && t > a.close) {
            const r = rg[2], fl = 1 - .7 * F.bump(t, a.only + .5, 2.6) * (.5 + .5 * Math.sin(t * 23));
            cx.save(); cx.setLineDash([th * 1.2, th * .8]); cx.lineDashOffset = -t * 10; cx.strokeStyle = rgba(COOL.line, .95 * clamp(ls.fc3) * fl); cx.lineWidth = 2.5; cx.strokeRect(r.x0 - 4, r.y - th / 2 - 4, r.x1 - r.x0 + 8, th + 8); cx.restore();
          }
          if (t > a.close) {
            const tags = [[0, a.taken, 'TAKEN'], [1, a.taken + .15, 'TAKEN'], [2, a.shared, 'SHARED'], [3, a.hands, 'IN HUMAN HANDS'], [4, a.hands + .15, 'IN HUMAN HANDS']];
            for (const [k, t0, tg] of tags) {
              const g = span(t, t0 - .1, t0 + .6) * (1 - span(t, a.only + .6, a.turn - .6)); if (g <= 0) continue;
              const r = rg[k]; maskLine(cx, [[tg, 0]], r.x1 + sz * (k >= 3 ? 1.9 : 1.1), r.y + sz * 1.35, 24, rise(g), { serif: false, weight: 600, col: k >= 3 ? P.cream : FORGE.text, glow: false });
            }
            const fu = span(t, a.nextY - .1, a.nextY + .6) * (1 - span(t, a.only + .6, a.turn - .6));
            if (fu > 0) { const r = rg[2], txt = 'SHARED', x = r.x1 + sz * 1.1 + measure(txt, 24, false, 600) + 18; maskLine(cx, [['· FORECAST: TAKEN NEXT YEAR', 0]], x, r.y + sz * 1.35, 24, rise(fu), { serif: false, weight: 600, col: COOL.text, glow: false }); }
            for (const k of [3, 4]) { const gl = F.bump(t, a.hands - .2 + (k - 3) * .15, 2.4); if (gl > 0) halo(cx, (rg[k].x0 + rg[k].x1) / 2, rg[k].y, (rg[k].x1 - rg[k].x0) * 1.1, .45 * gl, P.halo2, P.cream); }
          }
          // 12.05: your hand on the lever: a warm touch
          const tch = smooth(span(t, a.human - .1, a.human + .5)) * (1 - span(t, a.all - .4, a.all + .2));
          if (tch > 0) halo(cx, levS[0], levS[1], 70, .5 * tch * (1 + .1 * Math.sin(t * 2)), P.coat, P.cream);
          // 11.05: a builder comes down from the ring and hovers beside the lever (its eye becomes the clip plate)
          const bdu = sineIO(span(t, a.stopIt - .4, a.stopIt + 1.8)) * (1 - span(t, a.t3s, a.t3s + .3));
          if (bdu > 0) {
            const bx = levS[0] - 92 + 190 * (1 - bdu), by = levS[1] + 56 - 170 * (1 - bdu) + 4 * Math.sin(t * 1.3);
            builder(cx, t, bx, by, 22, levS[0] - 8, levS[1] + 6, sineIO(span(t, a.asked, a.t3s - 1.1)), clamp(bdu * 4));
            bF0 = [bx, by];
          }
        }
        drawYou(cx, t, lad);
      },
    });
    // the screen-space points of the lever and the builder's eye
    const mF = E.cardM(c, F0); const lev = levS && mF ? [mF.e + levS[0] * mF.k, mF.f + levS[1] * mF.k] : [1150, 400];
    if (bF0 && mF) bEye = [mF.e + bF0[0] * mF.k, mF.f + bF0[1] * mF.k, 22 * mF.k * .5];

    // ------------------------------------------------ 12.04 labels in the foundry
    const ou = rise(span(t, a.using + .3, a.using + 1.2)) * (1 - expoIn(span(t, a.nextOne + .6, a.nextOne + 1.4)));
    if (ou > 0) { const o = S.oldAt(c); if (o) F.goldLabel(ctx, o[0] + o[2] * .7, o[1] - o[2] * .7, 'THE A.I. YOU USE', 'DESIGNED BY HUMAN MINDS', ou * rise(span(t, a.using + .3, a.minds + .6)), { dx: 40, dy: -70, size: 26 }); }
    const nu2 = rise(span(t, a.nextOne - .1, a.nextOne + .8)) * (1 - expoIn(span(t, a.allowed - .2, a.allowed + .5)));
    if (nu2 > 0) { const m = S.machineAt(c); if (m) F.goldLabel(ctx, m[0] + m[2] * .92, m[1] + m[2] * .42, 'THE NEXT A.I.', '', nu2, { dx: 60, dy: 70, size: 26 }); }

    // ------------------------------------------------ the veil
    F.veil(ctx, veilA(t));

    // ------------------------------------------------ 10.01 / 10.02 / 10.08: the scenario year → the stamp → TODAY → the HUD
    {
      const p = span(t, a.scen + .3, a.y27e + .15), out = sineIO(span(t, a.inside - .1, a.inside + 1.7));
      const toToday = span(t, a.back - .1, a.back + .7), gone = sineIO(span(t, a.hold - .5, a.hold + .4));
      if (p > 0 && gone < 1) {
        const size = lerp(200, 66, out), x = lerp(110, 72, out), y = lerp(560, 128, out);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - size * .95, 1200, size * 1.13); ctx.clip();
        ctx.translate(0, -gone * size * 2.2);
        const yy = y - toToday * size * 1.15 * (1 - gone);
        if (toToday < 1) rollYear(ctx, x, yy, size, '2027', p, { col: P.cream });
        if (toToday > 0) E.glowText(ctx, 'TODAY', x, yy + size * 1.15, { size, serif: true, col: P.cream, glow: false });
        ctx.restore();
        const subU = rise(span(t, a.y27 - .2, a.y27e + .5)), ss = lerp(30, 22, out);
        if (subU > 0) {
          const sub = toToday >= 1 ? '' : 'SCENARIO · AI 2027';
          if (sub) F.goldText(ctx, [[sub, .55]], x + 6, y + size * .18 + ss * 1.25 - gone * size * 2.2, ss, subU * (1 - toToday), { serif: false, weight: 600, spacing: .32 });
        }
        ctx.restore();
      }
      F.source(ctx, t, a.y27, a.then, F.SOURCES.scenario);
    }
    // 10.02: a month page flips past the ring, faster and faster: a year of progress every week
    {
      const u = span(t, a.inside + .6, a.inside + 1.5) * (1 - span(t, a.begun - .2, a.begun + .5));
      if (u > 0) {
        const x = 150, y = 360, w = 300, h = 300, fl = Math.max(0, t - a.inside - .8), rate = 1.4 + 2.5 * span(t, a.year, a.week + .4), ph = fl * rate + fl * fl * .25;
        const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], i = Math.floor(ph) % 12, f = ph - Math.floor(ph);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.float(ctx, t, .6); ctx.beginPath(); ctx.rect(0, 0, W, y + h + 8); ctx.clip(); ctx.translate(0, (1 - expoOut(u)) * (h + 60));
        F.paperCard(ctx, t, x, y, w, h, { u: 1, rot: -.02 });
        E.glowText(ctx, MON[(i + 1) % 12], x + w / 2, y + h * .66, { size: 110, serif: true, col: PAPER.ink, glow: false, align: 'center' });
        // the page that flips up over the top edge
        const fk = Math.cos(Math.PI / 2 * clamp(f * 1.6));
        if (fk > 0) { ctx.save(); ctx.translate(x + w / 2, y + 14); ctx.rotate(-.02); ctx.scale(1, fk); ctx.fillStyle = mixHex(PAPER.shade, PAPER.lit, fk); ctx.fillRect(-w / 2, 0, w, h - 14);
          if (fk > 0) E.glowText(ctx, MON[i], 0, h * .66 - 14, { size: 110, serif: true, col: PAPER.ink, glow: false, align: 'center' }); ctx.restore(); }
        ctx.fillStyle = P.night1; for (const dx of [.3, .7]) { ctx.beginPath(); ctx.arc(x + w * dx, y + 12, 7, 0, TAU); ctx.fill(); }
        ctx.restore();
        F.goldText(ctx, [['A YEAR OF PROGRESS', 1]], x, y + h + 70, 34, rise(span(t, a.year - .1, a.year + .6)) * (1 - expoIn(span(t, a.begun - .2, a.begun + .4))), { serif: false, weight: 600, spacing: .08 });
        F.goldText(ctx, [['EVERY WEEK', 0]], x, y + h + 116, 34, rise(span(t, a.week - .1, a.week + .6)) * (1 - expoIn(span(t, a.begun - .2, a.begun + .4))), { serif: false, weight: 600, spacing: .08 });
      }
    }
    // 10.04 ★ one committee, one vote: 6 : 4 · 10.05 the fork
    {
      const tu = span(t, a.then + .2, a.then + 1.2), tout = sineIO(span(t, a.story - .5, a.story + .7));
      if (tu > 0 && tout < 1) {
        ctx.save(); F.float(ctx, t, .8);
        const sink = sineIO(span(t, a.ending - .3, a.ending + 1.1)), ty = TBL.y + sink * 150 + tout * 400;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 860); ctx.clip();
        // the fork (from the table's centre): the gold path rises into light, the cream path walks right to the people
        const fx = TBL.x + TBL.w / 2, fy = ty - 6;
        const gp = [[fx, fy], [fx - 120, fy - 140], [fx - 300, fy - 250], [fx - 430, fy - 370]], cp = [[fx, fy], [fx + 150, fy - 70], [fx + 330, fy - 120], [fx + 460, fy - 150]];
        const g1 = sineIO(span(t, a.race - .3, a.charge)), c1 = sineIO(span(t, a.slow - .2, a.overs + .3));
        if (g1 > 0) {
          F.goldSpan(ctx, gp, 0, g1, { w: 3 });
          const e = gp[3], gl = span(t, a.race + .6, a.charge + .4);
          if (gl > 0) { halo(ctx, e[0], e[1] - 20, 260 * expoOut(gl), .5 * gl, FORGE.halo, FORGE.core); F.machine(ctx, t, e[0], e[1] - 30, 64 * expoOut(gl), { build: 1, glow: 1.2, a: clamp(gl * 3) }); }
          F.goldText(ctx, [['THE RACE GOES ON', 1]], e[0] - 100, e[1] - 18, 28, rise(span(g1, .75, 1)), { serif: false, weight: 600, spacing: .1, align: 'right' });
        }
        if (c1 > 0) {
          ctx.save(); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
          const n = 30; for (let i = 0; i <= n * c1; i++) { const s = i / n, q = s * 3, j = Math.min(2, Math.floor(q)), f = q - j, p0 = cp[j], p1 = cp[j + 1]; const X = lerp(p0[0], p1[0], f), Y = lerp(p0[1], p1[1], f); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
          ctx.stroke(); ctx.restore();
          for (let k = 0; k < 4; k++) { const pu = span(t, a.slow + .3 + k * .25, a.slow + 1.0 + k * .25); if (pu <= 0) continue; const e = cp[3];
            ctx.save(); ctx.beginPath(); ctx.rect(e[0] - 140, e[1] - 140, 280, 140); ctx.clip(); E.person(ctx, e[0] - 75 + k * 50, e[1] + 4 + (1 - expoOut(pu)) * 90, 82, { light: .7, dir: k < 2 ? 1 : -1 }); ctx.restore(); }
          const e = cp[3]; F.goldText(ctx, [['SLOW DOWN · OVERSIGHT', 0]], e[0], e[1] - 110, 28, rise(span(c1, .7, 1)), { serif: false, weight: 600, spacing: .1, align: 'center' });
        }
        // the table, ten seats and their vote lights
        const ku = expoOut(tu);
        for (let i = 0; i < SEATS; i++) {
          const sx = TBL.x + (i + .5) * TBL.w / SEATS, pu = clamp(tu * 1.8 - i * .06);
          if (pu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(sx - 60, ty - 170, 120, 170); ctx.clip(); E.person(ctx, sx, ty + 70 + (1 - expoOut(pu)) * 150, 190, { light: .6, dir: i < 5 ? 1 : -1 }); ctx.restore(); }
        }
        ctx.fillStyle = mixHex(P.night1, P.ind2, .75); ctx.fillRect(TBL.x + TBL.w / 2 * (1 - ku), ty, TBL.w * ku, 18);
        ctx.fillStyle = rgba(P.cream, .3); ctx.fillRect(TBL.x + TBL.w / 2 * (1 - ku), ty, TBL.w * ku, 2);
        ctx.fillStyle = mixHex(P.night0, P.ind1, .6); ctx.fillRect(TBL.x + 30 + (TBL.w / 2 - 30) * (1 - ku), ty + 18, (TBL.w - 60) * ku, 70);
        for (let i = 0; i < SEATS; i++) {
          const sx = TBL.x + (i + .5) * TBL.w / SEATS, li = span(t, a.vote + ORDER.indexOf(i) * .11, a.vote + ORDER.indexOf(i) * .11 + .25), gold = GOLD6.includes(i);
          const fork = gold ? span(t, a.race - .2, a.race + .6) : span(t, a.slow - .2, a.slow + .6);   // the lights run into their paths
          ctx.fillStyle = mixHex(P.ind2, P.blue2, .4); ctx.beginPath(); ctx.arc(sx, ty - 2, 9 * ku, Math.PI, 0); ctx.fill();
          if (li > 0) { const col = gold ? FORGE.hot : P.cream; halo(ctx, sx, ty - 6, 46 * (1 + .5 * F.bump(t, a.vote + ORDER.indexOf(i) * .11, .5)), .6 * li * (1 - .5 * fork), gold ? FORGE.halo : P.halo2, col);
            ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sx, ty - 2, 8, Math.PI, 0); ctx.fill(); }
        }
        ctx.restore();
        // ONE COMMITTEE · ONE VOTE; 6 : 4 (they sink into the table when the fork grows)
        const hOut = sineIO(span(t, a.ending - .4, a.ending + .6));
        const hu1 = rise(span(t, a.comm - .3, a.comm + .5)) * (1 - hOut), hu2 = rise(span(t, a.vote - .1, a.vote + .6)) * (1 - hOut);
        const w1 = measure('ONE COMMITTEE', 34, false, 600) + 13 * 34 * .1, w2 = measure('  ·  ONE VOTE', 34, false, 600) + 13 * 34 * .1, x0 = W / 2 - (w1 + w2) / 2;
        if (hu1 > 0) F.goldText(ctx, [['ONE COMMITTEE', 0]], x0, 214, 34, hu1, { serif: false, weight: 600, spacing: .1 });
        if (hu2 > 0) F.goldText(ctx, [['  ·  ONE VOTE', 0]], x0 + w1, 214, 34, hu2, { serif: false, weight: 600, spacing: .1 });
        const u6 = rise(span(t, a.six - .05, a.six + .45)) * (1 - hOut), u4 = rise(span(t, a.four - .2, a.four + .3)) * (1 - hOut);
        const s6 = 170, w6 = measure('6', s6, true), wc = measure(' : ', s6, true), w4 = measure('4', s6, true), xs = W / 2 - (w6 + wc + w4) / 2;
        if (u6 > 0) { halo(ctx, xs + w6 / 2, 380, 200, .25 * u6 * (1 + F.bump(t, a.six, .8)), FORGE.halo, FORGE.hot); F.goldText(ctx, [['6', 1], [' : ', 0]], xs, 440, s6, u6, { serif: true }); }
        if (u4 > 0) F.goldText(ctx, [['4', 0]], xs + w6 + wc, 440, s6, u4, { serif: true });
        ctx.restore();
        F.source(ctx, t, a.other + .6, a.story + 2.6, 'THE AUTHORS: A STORY, NOT A RECOMMENDATION');
      }
    }
    // 10.06: WHAT THE VOTE IS ABOUT (left, while the ladder speaks)
    {
      const u = rise(span(t, a.look - .1, a.look + .7)) * (1 - expoIn(span(t, a.top - .3, a.top + .4)));
      if (u > 0) { F.goldText(ctx, [['WHAT THE VOTE', 0]], 110, 330, 40, u, { serif: false, weight: 600, spacing: .08 }); F.goldText(ctx, [['IS ABOUT', 0]], 110, 384, 40, rise(span(t, a.look + .1, a.look + .9)) * (1 - expoIn(span(t, a.top - .3, a.top + .4))), { serif: false, weight: 600, spacing: .08 }); }
    }
    // 10.09 K3: the quote card grows out of the lever's light and goes back into it
    {
      const g = expoOut(span(t, a.sept + .1, a.sept + 1.1)) * (1 - sineIO(span(t, a.who - .3, a.who + .7)));
      if (g > 0) {
        const cx0 = W / 2, cy0 = 470, s = lerp(.04, 1, g);
        ctx.save(); F.float(ctx, t, .7); ctx.translate(lerp(lev[0], cx0, g), lerp(lev[1], cy0, g)); ctx.scale(s, s); ctx.translate(-cx0, -cy0);
        halo(ctx, cx0, cy0, 700, .18 * (1 - g), FORGE.halo, FORGE.hot);
        F.quoteCard(ctx, t, T, { text: F.SOURCES.pachockiText, x: 300, y: 300, w: 1320, size: 52, head: 'AN ALIEN MIND', credit: F.SOURCES.pachocki, spoken: ['continue responsibly', 'much longer'], after: a.sept, mode: 'hi', u: clamp(g * 1.1) });
        ctx.restore();
      }
    }
    // 11.01 ★ the town of agents and THE MONITOR EYE · 11.02 ≈ 50 a week · 11.03 a lab checking itself; WHO CHECKS THE LAB?; OUTSIDERS
    {
      const SW = { x: 300, y: 560, w: 1200, h: 280 };
      const su = span(t, a.anth + .1, a.anth + 1.9), so = sineIO(span(t, a.itself - .2, a.itself + 1.1)), eu = sineIO(span(t, a.monitor - .3, a.monitor + .7));
      if (su > 0 && so < 1) {
        ctx.save(); F.float(ctx, t, 1); ctx.beginPath(); ctx.rect(0, 0, W, 835); ctx.clip(); ctx.globalAlpha *= 1 - .7 * so; ctx.translate(0, so * 560);
        F.swarm(ctx, t, SW.x, SW.y, SW.w, SW.h, { u: su, count: 1, sub: 'A.I. AGENTS AT WORK, AT ANY MOMENT', eye: so > 0 ? 0 : eu, flag: span(t, a.fifty - .1, a.person + .4), seed: 3000 });
        const fu = rise(span(t, a.fifty + .1, a.fifty + .8));
        if (fu > 0) F.goldText(ctx, [['≈ 50 A WEEK', 0]], SW.x + SW.w + 70, SW.y - 30, 32, fu, { serif: false, weight: 600, spacing: .08, align: 'center' });
        ctx.restore();
      }
      // the eye lives on: it glides from the town to over the lab's own ring and looks down at it
      const ex0 = SW.x + SW.w * .62, ey0 = SW.y - SW.h * .42, er0 = SW.h * .2;
      const gd = sineIO(span(t, a.itself - .3, a.itself + 1.4)), eOut = sineIO(span(t, a.fall - .2, a.fall + 1.0));
      if (eu > 0 && so > 0 && eOut < 1) {
        const ex = lerp(ex0, 760, gd), ey = lerp(ey0, 300, gd), er = lerp(er0, 70, gd);
        ctx.save(); F.float(ctx, t, 1); ctx.beginPath(); ctx.rect(0, 0, W, 880); ctx.clip(); ctx.translate(0, eOut * 700);
        const mu = span(t, a.itself + .5, a.itself + 1.7);
        if (mu > 0) {
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 760); ctx.clip(); F.machine(ctx, t, 760, 560 + (1 - expoOut(mu)) * 260, 130, { build: 1, glow: 1 }); ctx.restore();
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, ex, ey, 760, 560, [[0, rgba(COOL.halo, .22 * gd)], [1, rgba(COOL.halo, 0)]]);
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(760 - 170, 560); ctx.lineTo(760 + 170, 560); ctx.closePath(); ctx.fill(); ctx.restore();
          F.goldText(ctx, [['A LAB CHECKING ITSELF', 0]], 760, 790, 30, rise(span(t, a.itself + 1.0, a.itself + 1.8)), { serif: false, weight: 600, spacing: .1, align: 'center' });
        }
        F.eye(ctx, t, ex, ey, er, { open: 1, look: [lerp(.25 * Math.sin(t * .4), 0, gd), lerp(.1 * Math.sin(t * .27 + 1), .9, gd)] });
        const wu = rise(span(t, a.whoLab - .1, a.whoLab + .7));
        if (wu > 0) F.goldText(ctx, [['WHO CHECKS THE LAB?', 0]], 1420, 300, 40, wu, { serif: false, weight: 600, spacing: .06, align: 'center', col: COOL.core });
        for (let k = 0; k < 3; k++) {
          const p = span(t, a.outs - .5 + k * .2, a.outs + 1.6 + k * .2); if (p <= 0) continue;
          const x = lerp(2020, 1290 + k * 130, sineIO(p)), walking = p < 1;
          E.person(ctx, x, 760, 230, { light: .7, dir: -1, rim: COOL.line, walk: walking ? p * 10 + k : undefined, view: walking ? 'side' : undefined, long: k === 1 });
        }
        const ou = rise(span(t, a.outs + .2, a.outs + .9)); if (ou > 0) F.goldText(ctx, [['OUTSIDERS', 0]], 1420, 820, 30, ou, { serif: false, weight: 600, spacing: .14, align: 'center', col: COOL.text });
        ctx.restore();
      }
      F.source(ctx, t, a.monitor, a.itself + .6, F.SOURCES.monitor);
    }
    // 11.04: the accord; five signatures; PROMISED · NOT REQUIRED
    {
      const u = span(t, a.fall - .1, a.fall + 1.6), out = sineIO(span(t, a.stopIt - .5, a.stopIt + .6));
      if (u > 0 && out < 1) {
        const x = 520, y = 190, w = 880, h = 520;
        ctx.save(); F.float(ctx, t, .7); ctx.beginPath(); ctx.rect(0, 0, W, 860); ctx.clip(); ctx.translate(0, (1 - sineIO(u)) * 720 + out * 700);
        F.paperCard(ctx, t, x, y, w, h, { u: 1, head: 'WHITE HOUSE ACCORD · SEPT 29, 2026', headSize: 20, rot: -.008 });
        ctx.save(); ctx.translate(x, y); ctx.rotate(-.008);
        maskLine(ctx, [['Outside audits', 0]], 34, 150, 66, rise(span(t, a.fall + .5, a.fall + 1.4)), { serif: true, col: PAPER.ink, glow: false });
        for (let l = 0; l < 3; l++) { ctx.fillStyle = rgba(PAPER.faint, .5); ctx.fillRect(36, 196 + l * 30, (w - 72) * [.92, .8, .55][l], 6); }
        // five signatures write on, one by one (the leaders of the biggest A.I. companies)
        for (let k = 0; k < 5; k++) {
          const p = span(t, a.leaders + .2 + k * .35, a.leaders + .8 + k * .35); if (p <= 0) continue;
          const sx = 50 + k * 164, sy = 410, r = E.prng(17 + k), pts = [];
          for (let i = 0; i <= 24; i++) { const s = i / 24; pts.push([sx + s * 120, sy - 18 * Math.sin(s * (8 + r() * 4) + k) * (1 - s * .4) - 8 * r()]); }
          ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
          for (let i = 0; i <= 24 * p; i++) (i ? ctx.lineTo(...pts[i]) : ctx.moveTo(...pts[i])); ctx.stroke();
          ctx.fillStyle = rgba(PAPER.faint, .7); ctx.fillRect(sx, sy + 20, 130, 2);
        }
        ctx.restore();
        F.stamp(ctx, t, 'PROMISED', x + w * .25, y + h * .5, { t0: a.prom, size: 46, ink: FORGE.deep, rot: -.08 });
        F.stamp(ctx, t, 'NOT REQUIRED', x + w * .7, y + h * .62, { t0: a.notReq + .25, size: 46, ink: '#7a2e1c', rot: .05 });
        ctx.restore();
        const bu = rise(span(t, a.binding - .1, a.binding + .7)) * (1 - out);
        if (bu > 0) F.goldText(ctx, [['BINDING: UP TO LAWMAKERS', 0]], W / 2, 800, 30, bu, { serif: false, weight: 600, spacing: .1, align: 'center' });
      }
      F.source(ctx, t, a.fall + .6, a.stopIt + .3, F.SOURCES.accord);
    }
    // 11.06 T3: the plate grows out of the builder's eye; 11.07 it shrinks into the pace dial
    const DIAL = [W / 2, 600, 300];
    {
      const mIn = sineIO(span(t, a.t3s - 1.1, a.t3s)), mOut = sineIO(span(t, a.t3e, a.t3e + 1.0));
      if (mIn > 0 && mOut < 1) {
        const from = t < a.t3e ? (bEye ?? [900, 500, 12]) : [DIAL[0], DIAL[1], 14];
        F.clipPlate(ctx, t, T, 'T3', { from, morph: t < a.t3e ? mIn : 1 - mOut });
      }
    }
    // 11.07: the pace dial: ≈ ¼ OF TODAY'S PACE · 11.08: AGREED IN ADVANCE · 11.09: two cards
    {
      const du = span(t, a.t3e + .5, a.t3e + 1.6), dout = sineIO(span(t, a.agreed0 - .3, a.agreed0 + .8));
      if (du > 0 && dout < 1) {
        const v = lerp(1, .25, (() => { const p = span(t, a.quarter - .25, a.quarter + 1.0); return clamp(sineIO(p) + Math.sin(p * Math.PI) * .06); })());
        ctx.save(); F.float(ctx, t, .8); ctx.beginPath(); ctx.rect(0, 0, W, 860); ctx.clip(); ctx.translate(0, dout * 640);
        paceDial(ctx, t, DIAL[0], DIAL[1], DIAL[2], { u: du, v });
        const qu = rise(span(t, a.quarter + .2, a.quarter + .9));
        if (qu > 0) { F.goldText(ctx, [['≈ ¼ OF TODAY\'S PACE', 0]], W / 2, DIAL[1] + 110, 40, qu, { serif: false, weight: 600, spacing: .06, align: 'center' });
          E.glowText(ctx, 'HIS WISH: EVERY LAB', W / 2, DIAL[1] + 148, { size: 20, weight: 600, spacing: .14, col: P.halo2, glow: false, align: 'center', a: qu }); }
        const au = rise(span(t, a.cautious + .2, a.cautious + 1.0));
        if (au > 0) F.goldText(ctx, [['SLOWING ALONE BUYS ONE OR TWO YEARS', 0]], W / 2, DIAL[1] - DIAL[2] - 70, 30, au, { serif: false, weight: 600, spacing: .1, align: 'center', col: P.halo2 });
        ctx.restore();
      }
      // the rule book rises, then opens into the two cards
      const bu = span(t, a.agreed0 + .1, a.agreed0 + 1.1), split = sineIO(span(t, a.rivals - .2, a.rivals + 1.4)), cout = sineIO(span(t, a.people - .5, a.people + .6));
      if (bu > 0 && cout < 1) {
        ctx.save(); F.float(ctx, t, .7); ctx.beginPath(); ctx.rect(0, 0, W, 860); ctx.clip(); ctx.translate(0, (1 - expoOut(bu)) * 600 + cout * 700);
        // the book (THE STOP · Agreed in advance) moves left and becomes OpenAI's card; Anthropic's card slides out from under it on its words
        const sR = sineIO(span(t, a.anth2 - .7, a.anth2 + .7));
        const L = { x: lerp(660, 200, split), y: lerp(250, 300, split), w: lerp(600, 720, split), h: lerp(380, 420, split) };
        const Rr = { x: lerp(L.x + 20, 1000, sR), y: L.y, w: L.w, h: L.h };
        const hd = (txt, x, y, u) => maskLine(ctx, [[txt, 0]], x + 34, y + 50, 20, rise(u), { serif: false, weight: 600, col: PAPER.faint, glow: false });
        if (sR > 0) {
          F.paperCard(ctx, t, Rr.x, Rr.y, Rr.w, Rr.h, { u: 1, rot: .004 });
          hd('ANTHROPIC', Rr.x, Rr.y, span(sR, .5, 1));
          const lines = [[a.opt, 'The option to pause'], [a.rules, 'Rules set beforehand'], [a.table, 'Outsiders at the table']];
          lines.forEach(([t0, s], i) => maskLine(ctx, [[s, 0]], Rr.x + 34, Rr.y + 160 + i * 74, 46, rise(span(t, t0 - .1, t0 + .6)), { serif: true, col: PAPER.ink, glow: false }));
        }
        F.paperCard(ctx, t, L.x, L.y, L.w, L.h, { u: 1, rot: -.006 });
        hd('THE STOP', L.x, L.y, span(t, a.agreed0 + .3, a.agreed0 + 1.0) * (1 - span(split, 0, .3)));
        hd("OPENAI'S CHIEF SCIENTIST", L.x, L.y, span(t, a.oai - .2, a.oai + .6));
        ctx.fillStyle = rgba(PAPER.edge, .9 * (1 - split)); ctx.fillRect(L.x, L.y + 6, 14, L.h - 12);   // the book's spine
        maskLine(ctx, [['Agreed', 0]], L.x + 40, L.y + 190, 80, rise(span(t, a.agreed - .1, a.agreed + .6)) * (1 - span(split, 0, .4)), { serif: true, col: PAPER.ink, glow: false });
        maskLine(ctx, [['in advance', 0]], L.x + 40, L.y + 270, 64, rise(span(t, a.agreed + .2, a.agreed + .9)) * (1 - span(split, 0, .4)), { serif: true, col: mixHex(PAPER.ink, FORGE.deep, .5), glow: false });
        maskLine(ctx, [['Mandatory', 0]], L.x + 34, L.y + 190, 70, rise(span(t, a.mand - .1, a.mand + .6)), { serif: true, col: PAPER.ink, glow: false });
        maskLine(ctx, [['safety rules', 0]], L.x + 34, L.y + 262, 54, rise(span(t, a.mand + .1, a.mand + .8)), { serif: true, col: PAPER.ink, glow: false });
        ctx.restore();
        const ru = rise(span(t, a.rivals + .3, a.rivals + 1.1)) * (1 - cout);
        if (ru > 0) F.goldText(ctx, [['EVEN RIVALS SOUND ALIKE', 0]], W / 2, 220, 36, ru, { serif: false, weight: 600, spacing: .1, align: 'center' });
      }
    }
    // 11.10: a long table, one free place; you walk in; your note rises with the two questions
    {
      const u = span(t, a.people + .5, a.people + 1.9), out = sineIO(span(t, a.mach - .4, a.mach + .8));
      if (u > 0) {
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (out < 1) {
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, LTBL.floor + 4); ctx.clip(); ctx.translate(0, out * 520);
          LTP.forEach((px, i) => { const pu = clamp(u * 1.6 - i * .08); if (pu <= 0) return; E.person(ctx, px, LTBL.floor + (1 - expoOut(pu)) * 420, 290, { light: .7, dir: px < 960 ? 1 : -1, long: i % 2 === 0, look: .1 * Math.sin(t * .3 + i) }); });
          const ku = expoOut(u);
          ctx.fillStyle = mixHex(P.night1, P.ind2, .8); ctx.fillRect(lerp(960, LTBL.x0, ku), LTBL.top, (LTBL.x1 - LTBL.x0) * ku, 16);
          ctx.fillStyle = rgba(P.cream, .3); ctx.fillRect(lerp(960, LTBL.x0, ku), LTBL.top, (LTBL.x1 - LTBL.x0) * ku, 2);
          ctx.fillStyle = mixHex(P.night0, P.ind1, .65); ctx.fillRect(lerp(960, LTBL.x0 + 30, ku), LTBL.top + 16, (LTBL.x1 - LTBL.x0 - 60) * ku, LTBL.floor - LTBL.top - 16);
          ctx.restore();
          ctx.fillStyle = rgba(P.cream, .12 * (1 - out)); ctx.fillRect(0, LTBL.floor, W, 2);
        }
        ctx.restore();
      }
      // you walk in from the left to the free place (screen space until the world takes over at 'Machines now')
      const wk = span(t, a.question - 1.2, a.question + 1.8), hand = [YOUS.x + 40, YOUS.y - YOUS.h * .55];
      if (u > 0 && t < a.mach + .5) {
        const x = lerp(-120, YOUS.x, sineIO(wk)), walking = wk > 0 && wk < 1;
        if (wk > 0) E.du(ctx, x, YOUS.y, YOUS.h, { light: .8, back: .4, dir: 1, walk: walking ? wk * 12 : undefined, view: walking ? 'side' : undefined, look: walking ? 0 : .35 });
      }
      const nu = sineIO(span(t, a.q1w - .5, a.q1w + .6)), nout = sineIO(span(t, a.mach - .5, a.mach + .5));
      if (nu > 0 && nout < 1) {
        const w = 560, h = 190, x = lerp(hand[0], W / 2, nu), y = lerp(hand[1], 330, nu), s = lerp(.08, 1, nu);
        ctx.save(); F.float(ctx, t, .6); ctx.translate(x, y - nout * 60); ctx.scale(s, s); ctx.globalAlpha *= 1 - nout;
        const glow = F.bump(t, a.ask - .1, 2.2) + .5 * span(t, a.ask, a.ask + .6);
        if (glow > 0) halo(ctx, 0, 0, 520, .3 * clamp(glow), P.halo2, P.cream);
        F.paperCard(ctx, t, -w / 2, -h / 2, w, h, { u: 1, rot: -.01 });
        maskLine(ctx, [['Who checks the labs?', 0]], -w / 2 + 40, -h / 2 + 78, 44, rise(span(t, a.q1w - .1, a.q1w + .6)), { serif: true, col: PAPER.ink, glow: false });
        maskLine(ctx, [['Who can call a stop?', 0]], -w / 2 + 40, -h / 2 + 140, 44, rise(span(t, a.q2w - .1, a.q2w + .6)), { serif: true, col: PAPER.ink, glow: false });
        ctx.restore();
      }
    }
    // 11.11: MACHINES DO THE BUILDING · PEOPLE DO THE DECIDING · what gets built, who checks it, when to stop
    {
      const out = expoIn(span(t, a.close - .6, a.close + .2));
      const m1 = rise(span(t, a.mach + 1.4, a.mach + 2.2)) * (1 - out), m2 = rise(span(t, a.dec - .1, a.dec + .7)) * (1 - out);
      if (m1 > 0) F.goldText(ctx, [['MACHINES DO THE BUILDING', 1]], 110, 400, 40, m1, { serif: false, weight: 600, spacing: .06 });
      if (m2 > 0) F.goldText(ctx, [['PEOPLE DO THE DECIDING', 0]], 110, 456, 40, m2, { serif: false, weight: 600, spacing: .06 });
      [[a.what, 'WHAT GETS BUILT'], [a.whoIt, 'WHO CHECKS IT'], [a.when + .2, 'WHEN TO STOP']].forEach(([t0, s], i) => {
        const g = rise(span(t, t0 - .1, t0 + .6)) * (1 - out); if (g > 0) F.goldText(ctx, [[s, 0]], 112, 510 + i * 34, 23, g, { serif: false, weight: 600, spacing: .14, col: P.halo2 });
      });
    }
    // 12.06: THE LAST RUNG IS STILL OURS
    {
      const u = rise(span(t, a.ours - .1, a.ours + .8)) * (1 - expoIn(span(t, a.chan + .4, a.chan + 1.3)));
      if (u > 0) { F.goldText(ctx, [['THE LAST RUNG', 0]], 110, 380, 80, u, { serif: true }); F.goldText(ctx, [['IS STILL OURS', 0]], 110, 470, 80, rise(span(t, a.ours + .15, a.ours + .95)) * (1 - expoIn(span(t, a.chan + .4, a.chan + 1.3))), { serif: true }); }
    }
    // the HUD (top left; it drives itself from F.LADDER, sinks for the clip and after 'So how close is' #2)
    F.ladderHUD(ctx, t, T, { a: hudA(t) });
  };
}
