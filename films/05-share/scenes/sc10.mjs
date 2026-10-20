// Chunk C10 · Manila, Ohio and the close · shots 6.20–7.10 (segments 07a from "A care worker", 07b) · ★ 6.22, ★ 7.06, ▲ 7.09
// export default (T, R) => [{ t, draw(ctx, t, s), tr, d, x, y, r, depth, print, sound }, …]   (every frame a pure function of t)
//
// PLAN (anchors from T, nothing hard-coded; times below are only for reading)
// | shot  | words (hero onset)                          | image                                                       | carrier → next                         | tr into      |
// |-------|---------------------------------------------|-------------------------------------------------------------|----------------------------------------|--------------|
// | 6.20  | A care worker in Manila, at **dawn**.        | Manila at dawn: wet street, wires, jeepney; she walks home   | she + the light thread move right       | whipR (C9)   |
// |       |                                             | right in petrol scrubs; the sun clears the haze on "dawn"    | → whip right                            |              |
// | 6.21  | A truck driver in Ohio, at **dusk**.         | Ohio rest stop under an orange sky, idling truck, exhaust;  | camera pushes into the dusk glow        | whipR        |
// |       |                                             | the sodium lamps flicker on on "dusk"                        | → zoom into the map                     |              |
// | 6.22★ | Two **phones** buzz at the **same moment**.  | engraved paper map, night between Ohio (dusk) and Manila    | the two rings touch on the second       | zoom (glow)  |
// |       |                                             | (dawn); screens wake on "phones", both clocks flip 6:11 →    | "same" → zoom into the touch point      |              |
// |       |                                             | 6:12 on "same moment"; double buzz in the breath (lead SFX), |                                        |              |
// |       |                                             | the H.01 rings race over the paper and touch                 |                                        |              |
// | 6.23  | The **same** **share**.                      | the two "Your share" cards (Ohio left, Manila right) close  | the merged card exits upward → cut      | zoom (touch) |
// |       |                                             | in, lock in register on "share", one foil glint through both |                                        |              |
// | 6.24  | Not charity. Their **inheritance**.          | split screen on the terminator: driver (left) and carer     | one fragment rises out of the frame     | cut          |
// |       |                                             | (right) look up from the phones; paper fragments of §1 whirl | → camera tilts up with it               |              |
// | 7.02a | That buzz isn't a **fantasy**.               | the hook's roof at sunrise, the two friends on the parapet; | the ring runs over the sheet → zoom     | up           |
// |       |                                             | the fragment lands as a blank sheet; the phone buzzes once,  |  into the sheet                         |              |
// |       |                                             | its ring is engraved solid and catches foil on "fantasy"     |                                        |              |
// | 7.02b | It's a **rule** nobody has **written** yet.  | the ring becomes the sheet's guilloche border; "The rule"   | camera rises over the parapet → tilt up | zoom (sheet) |
// |       |                                             | engraves on "rule", empty dotted lines; the pen hovers on    |                                        |              |
// |       |                                             | "written", never touching                                    |                                        |              |
// | 7.05  | It belongs to **no one**.                    | wide over the city at sunrise; the hook's rosette hangs as  | camera approaches one ring (plan seq.)  | up           |
// |       |                                             | a dotted ghost, the wind blows through its lines             |                                        |              |
// | 7.05a | **Yet.**                                     | camera leans in: the outer ring, an arch over the skyline,   | the ring starts turning (plan seq.)     | cut (seamless)|
// |       |                                             | engraves solid and catches foil; silence around it           |                                        |              |
// | 7.06★ | Which means it can still belong to          | the rosette engraves completely and rises as a second dawn; | its light falls on the parapet → zoom   | cut (seamless)|
// |       | **everyone**.                               | microtext ring EVERYONE; light on all roofs, tiny figures    |  into the sheet                         |              |
// |       |                                             | look up; the camera pulls wide, then tilts to the parapet    |                                        |              |
// | 7.07  | We don't have to **take** what anyone       | the sheet "The rule": the sentence engraves word by word    | the next line (plan seq.)               | zoom (sheet) |
// |       | already has.                                | (Gravurschrift); the city lights below stay their own        |                                        |              |
// | 7.08  | We just have to **agree**,                  | the 2nd line begins; two hands (ochre, petrol) reach for the | the pen lowers (plan seq.)              | cut (seamless)|
// |       |                                             | pen together above the signature line                        |                                        |              |
// | 7.09▲ | **now,**                                     | the nib touches down just before "now,"; "now," engraves, | the line runs right (plan seq.)         | cut (seamless)|
// |       |                                             | everything holds in the pause, then one amber foil line      |                                        |              |
// | 7.10  | how to share what's **coming**.              | the line draws on slowly while the rosette's light sweeps;  | – (end screen; no fade)                 | cut (seamless)|
// |       |                                             | half drawn and glowing on "coming", the pen lifts a little;  |                                        |              |
// |       |                                             | last image until the film's last frame, camera rising slowly |                                        |              |
//
// Carrier chain: C9 thread → (whipR) her walk + the thread glint right → (whipR) Ohio → the dusk glow → (zoom) map → the two rings touch →
//   (zoom) the cards lock → the card exits up / (cut) split → the fragment rises → (up) lands as the sheet on the roof → the ring runs
//   over the sheet → (zoom) the ring becomes the border → camera rises → (up) the city, the rosette → one ring → the whole rosette rises,
//   its light falls on the parapet → (zoom) the sheet → the lines engrave → the signature line (end).
// Sound: lead accents in range (phone_buzz ×2 after "same moment", shimmer_rings before "That buzz", bloom after "what's coming") are not
//   duplicated; the images are synced to them (BUZZ = E('same moment') + .08 as in tools/sound_plan.mjs). Own additions, in pauses only:
//   pages + whoosh_up (6.24 fragments, the fragment rising), foil_glint (after "Yet."), tick (the nib touches, in the gap before "now,"), foil_glint (the
//   foil line starts in the silence after "now,").
import { carry } from '../lib/carry.mjs';
import { clamp, lin, sm, eout } from '../engine.mjs';
import { manila, ohio, split, OHIO_GLOW, expoOut } from '../lib/sc10_places.mjs';
import { mapStar, cards, MAP_MID } from '../lib/sc10_map.mjs';
import { roofDawn, roofAnchor, ruleSheet, twoHandsPen, dawnCity, cityAnchor, SHEET } from '../lib/sc10_close.mjs';

export default (T, R) => {
  const C = carry('c09>c10', T, R);
  const S = (p, n) => T.S('07a', p, n), E = (p, n) => T.E('07a', p, n), S7 = (p, n) => T.S('07b', p, n), E7 = (p, n) => T.E('07b', p, n);
  const A = {
    s620: C.into.t, dawn: S('dawn'),
    s621: S('A truck'), dusk: S('dusk'),
    s622: S('Two phones'), phones: S('phones'), same0: S('same moment'), buzz: Math.min(E('same moment'), S('same moment') + .85) + .08, // E() of "moment." carries the breath pause; the voice ends ~.75 s after "same"
    s623: S('same', 1), share: S('share'),
    s624: S('Not charity'), their: S('Their'), inh: S('inheritance'), inhE: E('inheritance'),
    buzz7: S7('That buzz') - .9, fantasy: S7('fantasy'),
    s702b: S7("It's a rule"), rule: S7('rule'), written: S7('written'),
    s705: S7('It belongs'), s705a: S7('Yet', 1), yetE: E7('Yet', 1),
    s706: S7('Which means'), every: S7('everyone'), everyE: E7('everyone'),
    s707: S7("We don't") - .35, s708: S7('We just'), agree: S7('agree'), s709: S7('now'), s710: S7('how to share'), coming: S7('coming'), comingE: E7('coming'),
    end: T.duration,
  };
  A.s702a = A.buzz7 - .6;                      // the roof arrives a beat before the lead's shimmer_rings (= the buzz)
  A.lift = A.s702a - .55;                      // the fragment leaves the split screen upward, the camera follows it (tr 'up')
  A.sig0 = A.s710 - .32;                       // the foil signature line starts in the silence after "now,"

  // ---- 7.05–7.06: one plan sequence over the city ----
  const CITY = { t0: A.s705, yet: A.s705a, which: A.s706, every: A.every, fall: A.everyE + .1 };
  const city = (ctx, t) => dawnCity(ctx, t, CITY);

  // ---- 7.07–7.10: one plan sequence on the sheet "The rule" ----
  const L1 = T.W('07b', "We don't", 'already has'), L2 = T.W('07b', 'We just', 'now'), L3 = T.W('07b', 'how to share', 'coming');
  const close = (ctx, t) => {
    const lines = [L1, t > A.s708 - .3 ? L2 : null, t > A.s710 - .3 ? L3 : null];
    const sig = .5 * eout(clamp((t - A.sig0) / (A.coming + .1 - A.sig0)));                   // half drawn on "coming", the rest stays open
    const sweep = sm(lin(A.s710, A.s710 + 5, t)), rise = sm(lin(A.coming + .5, A.end + 1.5, t));
    const Q = ruleSheet(ctx, t, { t0: A.s707, mode: 'write', lines, sig, sweep, rise });
    const reach = clamp((t - (A.agree - .3)) / 1.1);
    if (reach > 0) {
      const touch = sm(lin(A.s709 - .3, A.s709 - .08, t)), up = sm(lin(A.coming + .1, A.coming + .9, t));
      const lift = (1 - touch) * 1 + up * .35 + .04 * Math.sin(t * 1.3) * (1 - touch + up);
      const { SIG } = SHEET, nib = Q.toScr(SIG.x0 + (SIG.x1 - SIG.x0) * sig, SIG.y);
      twoHandsPen(ctx, t, nib, { lift, reach, sc: Q.sc });
    }
    // the line glows on "coming" and blooms once with the lead's bloom (E("coming") + .5), then stays warm and open
    const tb = A.comingE + .5, k = t > A.coming - .1 ? .35 * sm(lin(A.coming - .1, A.coming + .3, t)) + (t > tb ? Math.exp(-(t - tb) * 1.1) * sm(lin(tb, tb + .2, t)) : 0) : 0;
    if (k > .01) { const { SIG } = SHEET, [bx, by] = Q.toScr(SIG.x0 + (SIG.x1 - SIG.x0) * sig, SIG.y), R0 = 260 * Q.sc, g = ctx.createRadialGradient(bx, by, 0, bx, by, R0);
      g.addColorStop(0, `rgba(255,236,200,${.55 * k})`); g.addColorStop(.25, `rgba(255,179,92,${.22 * k})`); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(bx - R0, by - R0, R0 * 2, R0 * 2); ctx.restore(); }
  };

  const shots = [
    // 6.20 · Manila at dawn (C9's thread lands on the wire as a glint and runs on right)
    { t: C.into.t, tr: C.into.tr, x: C.into.x, y: C.into.y, d: C.into.d,
      draw: (ctx, t) => { manila(ctx, t, { t0: A.s620, dawn: A.dawn, glint: C.t, walk: [560, 1080, A.s620, A.s621 + .3] }); if (t < C.t + .45) C.draw(ctx, t); } },
    // 6.21 · Ohio at dusk (lamps on "dusk", the camera drifts into the dusk glow)
    { t: A.s621, tr: 'whipR', d: .3,
      draw: (ctx, t) => ohio(ctx, t, { t0: A.s621, lampOn: A.dusk + .04, push: [A.dusk + .35, A.s622 + .35] }) },
    // 6.22 ★ the map at the same moment
    { t: A.s622, tr: 'zoom', d: .6, x: OHIO_GLOW.x, y: OHIO_GLOW.y + 20, depth: 2.4, print: { riso: .35 },
      draw: (ctx, t) => mapStar(ctx, t, { t0: A.s622, wake: A.phones, same: A.same0, buzz: A.buzz, touch: A.s623 }) },
    // 6.23 the same share: the cards lock in register on "share"
    { t: A.s623, tr: 'zoom', d: .5, x: MAP_MID[0], y: MAP_MID[1], depth: 3,
      draw: (ctx, t) => cards(ctx, t, { t0: A.s623, reg: A.share, glint: A.share + .06, exit: A.s624 - .42 }) },
    // 6.24 split screen: they look up, the fragments whirl, one rises
    { t: A.s624, tr: 'cut', d: .1,
      draw: (ctx, t) => split(ctx, t, { t0: A.s624, down: A.s624 + .1, up: A.their - .1, swirl: [A.inh - .2, A.inh + 1.3], lift: A.lift }),
      sound: [{ f: 'pages', t: A.inhE + .01, v: .22 }, { f: 'whoosh_up', t: A.lift + .2, v: .2 }] },
    // 7.02a the roof at sunrise, the buzz is real
    { t: A.s702a, tr: 'up', d: .6,
      draw: (ctx, t) => roofDawn(ctx, t, { t0: A.s702a, land: A.buzz7 - .05, buzz: A.buzz7, fantasy: A.fantasy }) },
    // 7.02b the ring becomes the border of "The rule"
    { t: A.s702b, tr: 'zoom', d: .8, ...xy(roofAnchor(A.s702b, { t0: A.s702a })), depth: 3.5, print: { riso: .3 },
      draw: (ctx, t) => ruleSheet(ctx, t, { t0: A.s702b, mode: 'intro', ring: A.s702b - .1, rule: A.rule, written: A.written }) },
    // 7.05 · 7.05a · 7.06 ★ one plan sequence over the city
    { t: A.s705, tr: 'up', d: 1.0, print: { riso: .25 }, draw: city },
    { t: A.s705a, tr: 'cut', d: .1, print: { riso: .25 }, draw: city, sound: [{ f: 'foil_glint', t: A.yetE + .1, v: .35 }] },
    { t: A.s706, tr: 'cut', d: .1, print: { riso: .3 }, draw: city },
    // 7.07 · 7.08 · 7.09 ▲ · 7.10 one plan sequence on the sheet; the last image lives until the film's last frame
    { t: A.s707, tr: 'zoom', d: .8, ...xy(cityAnchor(A.s707, CITY)), depth: 3.5, print: { riso: .3 }, draw: close },
    { t: A.s708, tr: 'cut', d: .1, print: { riso: .3 }, draw: close },
    { t: A.s709, tr: 'cut', d: .1, print: { riso: .3 }, draw: close, sound: [{ f: 'tick', t: A.s709 - .08, v: .16 }] },
    { t: A.s710, tr: 'cut', d: .1, print: { riso: .3 }, draw: close, sound: [{ f: 'foil_glint', t: A.sig0 + .02, v: .3 }] },
  ];
  return shots;
};
function xy(p) { return { x: Math.round(p[0]), y: Math.round(p[1]) }; }
