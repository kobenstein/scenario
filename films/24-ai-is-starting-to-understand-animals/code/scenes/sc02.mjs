// c02 · Who are they? · the listener, the feed, the clip (B1) · T.G('Their A.I. can already') → T.G('Every baby on Earth')
// Plan: docs/shots.md 2.01–2.11 · world: lib/f24_b1_c02.mjs (ONE plan sequence, one entry) · seam in: plateCalifornia (lib/f24_seams.mjs)
// | ID   | anchor                       | picture                                                                 | move / carrier                    |
// | 2.01 | Their A.I. can already       | push into the gold ESP pin, iris onto the field; its gold wave → the listener | iris (ESP medallion)        |
// | 2.02 | Play it a call               | a dark frog calls, NEVER HEARD flies into the bell, TREE FROG out of the tip · NatureLM-audio · ESP | call → card |
// | 2.03 | Not every time               | tries: most cards land, a few miss; a die rolls its row, mostly misses   | stagger                           |
// | 2.04 | One of the team's founders   | pan left: a phone rises, a thumb flicks the endless feed                 | pan · phone rises                 |
// | 2.05 | Infinite scroll              | AZA RASKIN · CO-FOUNDER · INVENTED INFINITE SCROLL, a gold ESP medallion | label (stalk from the phone)      |
// | 2.06 | Now he's building            | the feed drains out of the phone as a stream of calls into the listener  | feed → wave → bell                |
// | 2.07 | Not to chat with your dog    | the phone squats into DOG TRANSLATOR, struck; the medallion grows: two elephants talk at dusk, the listener an ear at the edge | morph · strike · medallion grows |
// | 2.08 | Here he is · C1              | the dusk window grows into the clip plate; C1; back into the window      | clip plate (carrier: medallion)   |
// | 2.10 | Serious money                | $10M stack · REID HOFFMAN · LINKEDIN CO-FOUNDER                          | stack rises                       |
// | 2.11 | But how do you crack         | the stack sinks, a blank dictionary rises and opens; "?" over the talking elephants; their sun sets, the page lights up; push into the page | ✂ → c03 (page = kitchen window) |
import * as F from '../lib/f24_kit.mjs';
import { scene } from '../lib/f24_b1_c02.mjs';

export default async (T, R) => {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { T0: R.a, end: R.b };
  a.strange = G('something strange', a.T0); a.play = G('Play it a call'); a.never = G('never heard', a.play);
  a.tell = G('It can still tell'); a.made = GE('made it', a.tell);
  a.notEvery = G('Not every time'); a.but = G('far more often', a.notEvery); a.lucky = G('lucky guess', a.notEvery); a.luckyE = GE('lucky guess', a.notEvery);
  a.one = G("One of the team's founders"); a.invented = G('invented something', a.one);
  a.inf = G('Infinite scroll'); a.now = G("Now he's building"); a.listens = G('listens to animals', a.now);
  a.notChat = G('Not to chat with your dog'); a.dog = G('dog', a.notChat); a.understand = G('To understand what animals');
  a.here = G('Here he is'); a.c1 = T.clip('C1');
  a.money = G('Serious money'); a.ten = G('ten million', a.money); a.linked = G("LinkedIn's co-founder", a.money);
  a.crack = G('But how do you crack'); a.noDict = G('no dictionary', a.crack); a.noOne = G('no one to ask', a.crack);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT24 }];
};
