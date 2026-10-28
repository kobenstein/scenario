// Film 13 · B1 (c02–c05, 56.86 → 257.90) · ONE continuous take for the whole package.
// Every chunk file scenes/sc02.mjs … sc05.mjs returns one entry whose draw is this take, so the package-internal seams
// (c02|c03, c03|c04, c04|c05) are one function at one t on both sides: invisible by construction. The group seams are the lead's
// plates (lib/bubble_seams.mjs): plateSlit is received at c02's start, plateBrick is handed to B2 at c05's end.
// Anchors are phrases only (T.seq / T.F), resolved once here and shared by the chunk worlds lib/b1_c02.mjs … b1_c05.mjs.
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import { build as buildC02 } from './b1_c02.mjs';
import { build as buildC03 } from './b1_c03.mjs';
import { build as buildC04 } from './b1_c04.mjs';

export const PRINT = K.PRINT13;
let TAKE = null;

export function anchors(T) {
  const T0 = T.F('In a Yorkshire parsonage');
  const at = T.seq(T0), F = (ph, after) => T.F(ph, after), FE = (ph, after) => T.FE(ph, after);
  const a = { T0 };
  // c02
  a.parsonage = at('parsonage'); a.sisters = at('three sisters'); a.inherit = at('inheritance'); a.machine = at('new machine');
  a.railway = at('The railway'); a.railwayW = F('railway', a.railway);
  a.charlotte = at('Charlotte'); a.emily = at('Emily'); a.anne = at('Anne'); a.bronte = at('Brontë');
  a.within = at('Within a few years'); a.jane = at('Jane Eyre'); a.wuthering = at('Wuthering Heights');
  a.emilyRuns = at('Emily runs the money'); a.cgets = at('Charlotte gets nervous'); a.nervous = F('nervous', a.cgets);
  a.inJan = at('In January'); a.january = F('January', a.inJan); a.writes = at('she writes to a friend');
  a.sell = at("She'd like to sell"); a.ere = at('ere it be too late'); a.late = at('too late'); a.lateE = FE('late', a.late);
  a.butShe = at("But she won't go"); a.sister = at('her sister'); a.soNow = at('So, for now'); a.hold = at('they hold');
  a.thenB = at('Then the bubble bursts'); a.bursts = F('bursts', a.thenB);
  a.e1849 = at('By eighteen forty-nine'); a.twothirds = at('two thirds');
  a.small = at('Small savers'); a.holding = at('holding paper');
  a.expert = at('And the expert'); a.fear = at('no reason to fear'); a.mackay = at('Charles Mackay');
  a.bookP = at('written the book'); a.book = F('book', a.bookP); a.madness = at('financial madness');
  a.missedP = at('The expert missed it'); a.missed = F('missed', a.missedP); a.young = at('A young writer'); a.didnt = at("parsonage didn't"); a.didntW = F("didn't", a.didnt);
  a.c03 = at("But one thing didn't vanish");
  // c03
  a.vanish = at("didn't vanish"); a.track = at('The track');
  a.boom = at('Those boom years'); a.sixK = at('six thousand'); a.today = at("today's network");
  a.in1847 = at('And in eighteen forty-seven'); a.crisis = at('crisis'); a.greenwich = at('Greenwich'); a.slowly = at('Slowly');
  a.oneClock = at('one clock'); a.trains = at('because the trains');
  a.luckP = at('So was that just luck'); a.luck = F('luck', a.luckP); a.behind = at('rails behind');
  a.y2000 = at('Around the year two thousand'); a.internet = at('internet'); a.glass = at('made of glass');
  a.laid = at('Companies laid'); a.oceans = at('oceans'); a.farMore = at('Far more');
  a.by2001 = at('By two thousand and one'); a.five = at('five percent'); a.rest = at('The rest'); a.dark = at('in the dark');
  a.c04 = at('Then the crash');
  // c04
  a.globalC = at('Global Crossing'); a.bankrupt = at('bankrupt'); a.sliver = at('sliver');
  a.oldSh = at('The old shareholders'); a.nothing = at('Nothing');
  a.whileC = at('But while the companies'); a.crashed = at('crashed'); a.demand = at("demand didn't"); a.through = at('right through the bust');
  a.spare = at('And all that spare glass'); a.cheap = at('cheap'); a.ninety = at('ninety-nine');
  a.sameNet = at("It's the same kind of network"); a.reaching = at('reaching you');
  a.channel = at('This channel exists'); a.everyone = at('everyone'); a.subscribe = at('subscribe');
  a.twice = at('So twice now'); a.builders = at('builders tell');
  a.bezos = at('Jeff Bezos'); a.industrial = at('industrial bubble'); a.settles = at('When the dust settles'); a.society = at('society benefits');
  a.willRails = at('But will the rails stay'); a.thisTime = at('this time');
  a.c05 = at('Maybe');
  // c05
  a.generations = at('generations'); a.doesnt = at("doesn't"); a.chips = at('Chips and hardware'); a.years36 = at('three to six years');
  a.andYet = at('And yet'); a.darkF = at('dark fibre'); a.almostFull = at('almost full');
  a.older = at('Even older chips'); a.earn = at('earn money');
  a.plenty = at('And plenty does last'); a.buildings = at('Buildings'); a.powerLines = at('power lines'); a.plantsP = at('power plants planned'); a.planned = F('planned', a.plantsP);
  a.openM = at('Open models'); a.fail = at('fail');
  a.people = at('And people who know'); a.build = at('build all this');
  a.soYes = at('So yes, rails will stay'); a.too = at('too'); a.fewer = at('fewer'); a.mostMoney = at('most of the money');
  a.T1 = F("You'll hear that", a.mostMoney);
  return a;
}

export function take(T) {
  if (TAKE) return TAKE;
  E.prepareEditorial();
  const a = anchors(T);
  const c02 = buildC02(a), c03 = buildC03(a, c02), c04 = buildC04(a, c03);
  TAKE = { a, draw: (ctx, t) => (t < c02.tP ? c02(ctx, t) : t < a.c04 ? c03(ctx, t) : c04(ctx, t)) };
  return TAKE;
}
