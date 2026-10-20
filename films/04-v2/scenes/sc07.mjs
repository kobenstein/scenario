// Chunk c07 · The world of have-to (03b "For most of our lives" → "not less") · shots 7.01–7.10
// in: plate c06>c07 (the engraved line, y 590, −.32 rad, cream) → it is the lit strip under the handrail of an escalator
// out: plate c07>c08 (paper, cream) → the camera pushes into the blank paper of the Sweden chart sheet
//
// | #    | VO (accent)                               | picture                                                                 | hero light                 | camera                                   | flows on (no blend)                         | sound (pauses)          |
// |------|-------------------------------------------|-------------------------------------------------------------------------|----------------------------|------------------------------------------|---------------------------------------------|-------------------------|
// | 7.01★| For most of our lives … world of HAVE-TO  | the plate's line is the lit strip under E0's handrail; the station hall | cold steel blue lamps;     | rolled close-up on the rail → pull back  | one take with 7.02–7.03 (lib/v2_c07_hall)    | 158.92 every clock      |
// |      |                                           | of have-to switches on bay by bay from the rail outward: escalators     | amber only in clock faces  | and level to the wide hall               |                                             | clicks to 8:00          |
// |      |                                           | full of standing riders, galleries of people, station clocks everywhere,|                            |                                          |                                             |                         |
// |      |                                           | the giant time-card rack of 1.01 under the giant clock; on HAVE-TO every|                            |                                          |                                             |                         |
// |      |                                           | clock clicks to 8:00 with an amber pulse                                |                            |                                          |                                             |                         |
// | 7.02 | And after twenty years … the morning it   | the camera finds one rider (you, ochre scarf) and follows them up E0;   | pale morning light through | follow up the incline, settle at the top | same take                                   | 164.20 the escalators   |
// |      | ENDS                                      | at the top one step off into morning light falling through the vault;  | the vault glass (cool-warm)|                                          |                                             | wind down               |
// |      |                                           | on ENDS every escalator, rider and second hand stops; shoulders bowed   |                            |                                          |                                             |                         |
// | 7.03 | The habit of ESCAPING outlasts … from     | the hall goes dark from the far end; its lines turn to dotted ghost     | the hall's light goes;     | slow push on you                         | same take; the fragment (E0's last steps,   |                         |
// |      |                                           | lines and drift away as smoke; E0 is eaten from its foot; you take the  | the phone's cyan stays     |                                          | the comb, the landing) stays: the void       |                         |
// |      |                                           | phone out on ESCAPING: its cyan is the only light                       |                            |                                          | (lib/v2_c07_void) continues it in 3D         |                         |
// | 7.04 | That's the SLUMP                          | you sit down on the last step of the dead escalator, knees up, phone    | cyan on the face side      | slow circle round the fragment           | same take                                   | 169.95 sitting down     |
// | 7.05 | But it's a hangover, not a DESTINY        | dawn floods in from the side; the cyan pales; on DESTINY the head lifts | dawn gold from the right   | circle settles toward the light          | same take                                   |                         |
// | 7.06 | Some people have already WOKEN up …       | in the sunbeam a slip of paper drifts down, turning                     | dawn gold                  | tilt down with the slip                  | it lands face up on the step                | 176.10 paper lands      |
// | 7.07 | Big lottery WINNERS                        | the slip is a lottery ticket (guilloche, perforated stub, numbers);     | warm paper, amber foil     | top-down, push in                        | the ticket's guilloche unwinds into a coast | 177.72 foil shimmer     |
// |      |                                           | on WINNERS its numbers light in amber foil                              |                            |                                          |                                             |                         |
// | 7.08 | Researchers in SWEDEN followed them for   | the ticket's paper becomes an engraved map of Sweden, amber dots =       | paper                      | slow push; then into one dot             | push into one amber dot until it fills the  | 180.62 whoosh into dot  |
// |      | YEARS                                     | winners, ruler YEARS AFTER THE WIN 5·10·15·20, source line               |                            |                                          | frame: the dot is the workshop's lamp       |                         |
// | 7.09 | Most of them kept WORKING                 | a lit workshop in a snowy street of red wooden houses: a winner planes  | warm lamp, snow-blue window| pull back out of the lamp                | one shaving flies up                         | 182.66 shaving swish    |
// |      |                                           | a board at the bench; shavings curl on WORKING                          |                            |                                          |                                             |                         |
// | 7.10 | And years later … more satisfied …        | the shaving uncurls into a ribbon of pale paper: the chart LIFE         | paper, amber line          | settle, read; push into the blank paper  | the sheet's paper IS the c07>c08 plate      |                         |
// |      | not LESS                                  | SATISFACTION / YEARS AFTER THE WIN 5–22, winners (amber) above matched  |                            | beside the chart until it is the plate   | at H.a − 1/30                                |                         |
// |      |                                           | non-winners (dotted), level; SCHEMATIC + source; the amber line glints  |                            |                                          |                                             |                         |
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c07_kit.mjs';
import { hallTake, hallInit, hallWarm } from '../lib/v2_c07_hall.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c07', T);
  const S = (p, n) => T.S('03b', p, n), E = (p, n) => T.E('03b', p, n);
  const K = { hb: HI.b, ha: HO.a, haveTo: E('have-to') + .04, follow: S('And after twenty') - .05, top: S('tired', 1) - .15, stop: S('ends'), dis0: S('The habit'), phone0: S('escaping') - .5 };
  K.wideAt = S('have-to') + .2; K.arrive = K.top + 1.15;
  hallInit(K); hallWarm();
  await ready();
  const print = HI.print;
  return [
    { t: HI.b, tr: 'cut', d: .1, print, draw: (ctx, t) => hallTake(ctx, t, K) },
  ];
};
