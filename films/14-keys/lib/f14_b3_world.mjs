// Film 14 · B3 · c07 + c08 as ONE plan sequence (shots 7.01–8.10), shared by scenes/sc07.mjs and scenes/sc08.mjs, so the c07|c08
// seam is the same function at the same t. Plan: docs/shots.md (c07, c08) · rules: docs/MOTION.md · kit: lib/f14_kit.mjs.
// Seams: in from B2 on plateWindow (T0 = s14 start, drawn opaque for [T0, T0 + .5)), out to the lead on plateScale (T1 = s19 start,
// drawn opaque for [T1 − .5, T1)). At both plates the camera is exactly home and the drift is 0, so the world equals the plate.
//
// | ID     | anchor (word)                      | picture (one idea)                                                          | moves              | → carrier                |
// |--------|------------------------------------|-----------------------------------------------------------------------------|--------------------|--------------------------|
// | 7.01 🔑 | missile · Two keys · same room     | the plate's warm round window opens like an iris onto B1's launch room       | iris · push in     | plate window (match)     |
// |        |                                    | (two keys, two officers); the keys turn; one outline closes round both      |                    |                          |
// | 7.02★🔑 | second key · someone else          | pull back: two labs side by side; key 2 lifts out of its slot, flies in an  | pull back · key    | the key                  |
// |        |                                    | arc into the round window of the other lab; an indigo hand takes it          |                    |                          |
// | 7.03 🔑 | August · OpenAI · tested           | card OpenAI ⇄ Anthropic · AUGUST 2025 over the gap; the hand withdraws with  | card · morph       | window → table (in place)|
// |        |                                    | the key, the rooms go dark; both round windows become test tables            |                    |                          |
// | 7.04   | safety tests · published · uncomf. | each lab's pen writes ✓/✕ into the OTHER table; both tilt forward into light | threads · tilt     | plan sequence            |
// | 7.05   | weak spots · daylight · fixed      | the ✕ cells get a ring; daylight falls on both; one ✕ becomes a warm ✓        | light falls        | plan sequence            |
// | 7.06   | Almost every · too often · flag    | the 8 model rows leave the tables and line up; bars grow toward YES; a flag  | rows fly · bars    | the axis line            |
// | 7.07   | Sycophancy · right · not           | the bars retract into the axis = the rule of the card "Sycophancy."          | word rises         | the rule → lamp cord     |
// | 7.08   | decision · only yes · help         | you at a desk under the lamp; three YES bubbles rise from the screen         | tilt down · bubbles| the last YES             |
// | 7.09   | second key · eye · skip            | the last YES rises into table A; your own lens glides past it, the rival's    | follow · lenses    | lens → window ring       |
// |        |                                    | lens stops on it (found)                                                    |                    |                          |
// | 7.10   | fragile · voluntary · pilot        | pull back: the tables are windows again; a flickering dashed bridge between  | pull back · bridge | plan sequence            |
// |        |                                    | them; VOLUNTARY · A PILOT · NO SHARED METHOD                                |                    |                          |
// | 7.11   | hand it over · anyone              | a gate in the bridge opens only briefly; on "anyone" the line runs on to the | gate · line runs   | line → mountain ridge    |
// |        |                                    | right and draws a mountain ridge (dawn begins)                              |                    |                          |
// | 8.01–8.10 (c08): see lib/f14_b3_alps.mjs                                                                                                       |
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import { plateWindow, plateScale, SEAM_HALF } from './f14_seams.mjs';
import { lab, OA, PUSH_S } from './f14_b3_lab.mjs';
import { alps, C8 } from './f14_b3_alps.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, card, cam3, camAt, camDrift, aim, F0 } = E;

export const PRINT = K.PRINT13;

export function b3Anchors(T) {
  const S = (sec, w, n) => T.S(sec, w, n);
  return {
    s14: T.seg('s14').start, s19: T.seg('s19').start,
    missile: S('s14', 'missile'), twoKeys: S('s14', 'Two keys'), turned: S('s14', 'turned'), sameRoom: S('s14', 'same room'), roomE: T.E('s14', 'same room'),
    secondKey: S('s14', 'second key'), someone: S('s14', 'someone else'), august: S('s14', 'August'), happened: S('s14', 'happened'),
    openai: S('s14', 'OpenAI'), anthropic: S('s14', 'Anthropic'), competitors: S('s14', 'competitors'), tested: S('s14', 'tested'), safetyTests: S('s14', 'safety tests'),
    published: S('s14', 'published'), uncomfortable: S('s14', 'uncomfortable'), why: S('s14', 'Why would'), weakSpots: S('s14', 'weak spots'),
    daylight: S('s14', 'daylight'), fixed: S('s14', 'fixed'),
    finding: S('s15', 'finding'), almostEvery: S('s15', 'Almost every'), tooOften: S('s15', 'too often'), flag: S('s15', 'flag'),
    fieldWord: S('s15', 'has a word'), sycophancy: S('s15', 'Sycophancy'), tellsYou: S('s15', 'tells you'), notWord: S('s15', "you're not"),
    picture: S('s15', 'Picture'), hearing: S('s15', 'hearing'), only: S('s15', 'only'), yesWord: S('s15', 'yes'), pleasant: S('s15', 'Pleasant'),
    help: S('s15', 'help'), thats: S('s15', "That's what"), rivalsEye: S('s15', "rival's eye"), skip: S('s15', 'skip'),
    andYet: S('s16', 'And yet'), fragile: S('s16', 'fragile'), voluntary: S('s16', 'voluntary'), pilot: S('s16', 'pilot'), noShared: S('s16', 'No shared'),
    soSecond: S('s16', 'So a second'), handOver: S('s16', 'hand it over'), anyone: S('s16', 'anyone'),
    // c08
    september: S('s17', 'September'), switzerland: S('s17', 'Switzerland'), universities: S('s17', 'universities'), supercomputing: S('s17', 'supercomputing'),
    apertus: S('s17', 'Apertus'), opened: S('s17', 'opened'), weights: S('s17', 'weights'), trainingData: S('s17', 'training data'), snapshots: S('s17', 'snapshots'),
    public: S('s17', 'public'), student: S('s17', 'student'), journalist: S('s17', 'journalist'), rivalLab: S('s17', 'rival lab'), anyone2: S('s17', 'anyone'),
    inside: S('s17', 'inside'), spans: S('s17', 'spans'), thousand: S('s17', 'thousand'), english: S('s17', 'English'),
    vault: S('s18', 'vault'), opposite: S('s18', 'opposite'), glassBox: S('s18', 'glass box'), plainView: S('s18', 'plain view'), isGlass: S('s18', 'So is glass'),
    checking: S('s18', 'checking'), sleeper: S('s18', 'sleeper'), but: S('s18', 'But openness'), misuse: S('s18', 'misuse'), takeFile: S('s18', 'take the file'), change: S('s18', 'change'),
    wrongHands: S('s18', 'wrong hands'), glass2: S('s18', 'glass box puts'), everyEye: S('s18', 'every eye'), fewPeople: S('s18', 'few people'), everyone: S('s18', 'everyone'),
    rather: S('s18', "people you'd"), argue: S('s18', 'argue'), rightOne: S('s18', 'right one'), s18e: T.E('s18'),
  };
}

const aimA = (u, v, s) => aim(F0, u + OA, v, s);
// the sky: a gradient on the F0 card (so at home it is exactly the plate's screen gradient); dawn 0 = night, 1 = the plate's dawn
const DAWN = [[0, P.night0], [.45, P.ind1], [.8, mixHex(P.ind2, P.halo1, .28)], [1, mixHex(P.ind2, P.halo1, .4)]];
const NIGHT = [[0, P.night0], [.45, P.night1], [.8, mixHex(P.night1, P.ind0, .6)], [1, P.ind0]];
export function sky(ctx, c, t, dawn) {
  const st = DAWN.map(([o, col], i) => [o, dawn >= 1 ? col : mixHex(NIGHT[i][1], col, dawn)]);
  card(ctx, c, F0, () => { ctx.fillStyle = E.lin(ctx, 0, 0, 0, H, st); ctx.fillRect(-20000, -20000, 40000, 40000); });
  if (dawn < 1) card(ctx, c, 40000, () => E.stars(ctx, 1407, 240, t, [-24000, -2400, 30000, 3400], .75 * (1 - dawn) ** 1.5));
}

export function b3Keys(a) {
  const T0 = a.s14;
  return [
    [T0 + SEAM_HALF, cam3({ x: OA })],                                            // the plate window, home
    [a.missile + .15, cam3({ x: OA, z: 10 })],
    [a.twoKeys + 1.3, aimA(960, 470, PUSH_S)],                                    // 7.01 push into the window (the room)
    [a.roomE + .1, aimA(960, 474, PUSH_S * 1.04)],
    [a.secondKey + .35, aimA(1730, 500, .55)],                                    // 7.02 pull back: two labs
    [a.happened + .8, aimA(1745, 492, .58)],
    [a.competitors - .1, aimA(1740, 482, .6)],
    [a.safetyTests - .1, aimA(1730, 474, .72)],                                    // 7.04 the two tables side by side
    [a.uncomfortable + 1, aimA(1730, 478, .74)],
    [a.fixed + .5, aimA(1730, 474, .76)],
    [a.fieldWord, aimA(1730, 470, .78)],
    [a.notWord + .5, aimA(1720, 478, .86)],
    [a.picture + 2.4, aimA(1370, 822, 2.0)],                                      // 7.08 tilt down to the desk (the cord leads)
    [a.help + .7, aimA(1370, 816, 2.1)],
    [a.rivalsEye - .4, aimA(1020, 480, 1.05)],                                    // 7.09 follow the YES up into table A
    [a.skip + .7, aimA(1010, 485, 1.1)],
    [a.fragile - .1, aimA(1730, 500, .56)],                                       // 7.10 pull back: windows + bridge
    [a.noShared + 1.4, aimA(1730, 495, .6)],
    [a.handOver + .4, aimA(1730, 490, .63)],                                     // the truck starts as the gate closes
    ...C8(a),                                                                     // 7.11 → c08: the truck along the line, the mountains
  ];
}
export function b3Cam(a, t) {
  const T0 = a.s14, T1 = a.s19;
  const dAmt = smooth(span(t, T0 + SEAM_HALF, T0 + 2)) * (1 - smooth(span(t, T1 - 3.2, T1 - .9)));
  const c = camAt(t, b3Keys(a), F0);
  // 7.11: during the long truck the camera also eases back (a swell, 0 velocity at both ends), so the screen moves calmly
  const tr = span(t, a.handOver + .4, a.september + 3.8); if (tr > 0 && tr < 1) c.z -= 1100 * Math.sin(Math.PI * tr) ** 2;
  return camDrift(c, t, .9 * dAmt);
}
export function b3(a) {
  const T0 = a.s14, T1 = a.s19;
  const drawLab = lab(a), drawAlps = alps(a);
  return (ctx, t) => {
    if (t < T0 + SEAM_HALF) { plateWindow(ctx, t); return; }
    if (t >= T1 - SEAM_HALF) { plateScale(ctx, t); return; }
    // drift: 0 at the plates, full in between (so both plates are met exactly)
    const c = b3Cam(a, t);
    const dawn = smooth(span(t, a.anyone + .2, a.september + 4));
    sky(ctx, c, t, dawn);
    drawAlps.back(ctx, t, c, dawn);
    if (t < a.september + 3.5) drawLab(ctx, t, c);
    drawAlps.front(ctx, t, c, dawn);
  };
}
