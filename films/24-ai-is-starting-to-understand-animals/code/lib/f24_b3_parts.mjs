// Film 24 · builder B3 · the parts that run ACROSS a chunk boundary inside the B3 group, so both chunks draw them with the same
// function and the same (t, T): the seams c09|c10 ('Twenty thirty. Day one') and c10|c11 ('Year ten') are identical by construction.
//   A3(T)          all phrase anchors of c09–c11 (T.G / T.GE only)
//   harbourPart    Iceland: the harbour in its medallion, the whaling ship leaving (c09)
//   barnPart       the barn of the hook from "There's also what psychologists" to the zoom out to Kenya (c09 → c10):
//                  the meat paradox (bubbles over you), the MIND card, the heart, the bar returns, the strip beside it → big 2030
//   courtPart      the courtroom in New Zealand to the zoom out to Iowa (c10 → c11)
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as K from './f24_b3_kit.mjs';
import * as S from './f24_b3_sets.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn } = E;
const { rise } = F;
const F0 = E.F0;

const MEMO = new WeakMap();
export function A3(T) {
  if (MEMO.has(T)) return MEMO.get(T);
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c09
  a.back = G('Now think back to those pigs'); a.pigsE = GE('think back to those pigs');
  a.today = G('Today, going without meat'); a.easierE = GE('has never been easier', a.today);
  a.germany = G('In Germany, about nine'); a.noMeat = G('eat no meat at all', a.germany); a.noMeatE = GE('eat no meat at all', a.germany);
  a.among = G('Among the under-thirties'); a.five = G('one in five', a.among);
  a.still = G('Still, nine in ten'); a.nineTen = G('nine in ten Germans', a.still); a.eatMeatE = GE('Germans eat meat', a.still);
  a.products = G('Maybe the products'); a.good = G('good or cheap', a.products); a.cheap = G('cheap enough yet', a.products);
  a.orMaybe = G("Or maybe what's missing"); a.feeling = G('a feeling', a.orMaybe);
  a.most = G('Most of us never hear'); a.allE = GE('these animals at all', a.most);
  a.imagine = G('Now imagine a machine'); a.does = G('does for pigs', a.imagine); a.songs = G('those songs did', a.imagine); a.whalesE = GE('did for whales', a.imagine);
  a.could = G('Could that make vegetarian'); a.rightsE = GE('win animals new rights', a.could);
  a.maybeW = G('Maybe', a.rightsE - .2); a.butEven = G('But even for whales'); a.summer = G('This past summer'); a.iceland = G('Iceland hunted fin whales'); a.againE = GE('hunted fin whales again');
  a.also = G("There's also what psychologists"); a.paradox = G('meat paradox', a.also); a.loving = G('loving animals', a.also); a.eating = G('eating them too', a.also);
  a.remind = G('Remind people that farm'); a.suffer = G('animals suffer', a.remind); a.less = G('less of a mind', a.remind);
  a.hyp = G("That's not hypocrisy"); a.human = G("It's human", a.hyp);
  a.soMaybe = G("So maybe a feeling isn't"); a.enoughE = GE("feeling isn't enough", a.soMaybe);
  a.whatIf = G('But what if, one day'); a.words = G('tell us in words', a.whatIf);
  // c10
  a.day = G('Twenty thirty. Day one'); a.day1 = G('Day one', a.day); a.campW = G('A research camp in Kenya'); a.kenyaE = GE('research camp in Kenya');
  a.inThis = G('In this scenario, the Earth Species'); a.target = G('hits its target', a.inThis);
  a.chorus = G('Their A.I. understands a whole elephant'); a.chorusW = G('elephant chorus', a.chorus); a.finishE = GE('start to finish', a.chorus);
  a.first = G('The first message probably'); a.something = G('Something like', a.first); a.timeToGo = G('time to go', a.first); a.timeToGoE = GE('time to go', a.first);
  a.notFar = G('Not far-fetched'); a.already = G('their A.I. already', a.notFar); a.lineUp = G('voices line up', a.notFar); a.seemsPlan = G('seems to plan', a.notFar); a.planE = GE('when it seems to plan', a.notFar);
  a.answer = G('Do we answer'); a.man = G('The man who invented the endless'); a.feed = G('endless feed', a.man); a.warningE = GE('has a warning about that', a.man);
  a.c5 = F.clipWin(T, 'C5');
  a.year1 = G('Year one'); a.court = G('A courtroom in New Zealand'); a.caseW = G('The case', a.court); a.noiseE = GE('ship noise', a.court);
  a.twoParts = G('Two parts of this are real'); a.nearShips = G('Near ships in the Caribbean'); a.talk = G('Talk or stress'); a.unclearE = GE('Still unclear', a.talk);
  a.maori = G('And Māori and Pacific'); a.persons = G('legal persons', a.maori); a.lawmaker = G('A lawmaker there'); a.lawE = GE('wants to make that law');
  a.rest = G('The rest is our scenario'); a.hears = G('The court hears a decoded'); a.says = G('It says', a.hears); a.tooLoud = G('too loud', a.hears); a.tooLoudE = GE('too loud', a.hears);
  a.judge = G('The judge agrees'); a.ships = G('Ships slow down'); a.shipsE = GE('Ships slow down');
  // c11
  a.year10 = G('Year ten'); a.farm = G('A farm kitchen in Iowa'); a.mics = G('Microphones in every barn'); a.feelE = GE('how the animals feel', a.mics);
  a.whether = G('Whether that changes'); a.sayE = GE("this scenario can't say");
  a.under = G('Under the table, you finally'); a.dog = G('your dog', a.under); a.thinks = G('thinks of you', a.under); a.mostly = G('Mostly', a.under); a.walk = G('walk', a.mostly); a.walkE = GE('walk', a.mostly);
  a.practice = G('Listening to animals is practice'); a.minds = G('minds that', a.practice); a.humanE = GE("that aren't human", a.practice);
  a.building = G('And one of those minds'); a.buildingW = G("we're building", a.building); a.nowE = GE('building right now', a.building);
  a.soon = G('Soon, we may not be'); a.voice = G('smartest voice', a.soon); a.roomE = GE('voice in the room', a.soon);
  a.then = G("Then listening won't be"); a.skillE = GE('most important skill we have');
  a.backToday = G('Back to today'); a.few = G('Twenty thirty is only a few'); a.maybeMake = G('Maybe they make it'); a.longer = G('takes far longer'); a.longerE = GE('takes far longer');
  a.onePart = G('But one part has already'); a.arrivedE = GE('has already arrived'); a.heard = G('You heard it yourself'); a.startE = GE('at the very start');
  a.hearNow = G('can hear them now', a.startE); a.hearNowE = GE('can hear them now', a.startE);
  a.listen = G('Whether we listen'); a.upToUsE = GE('is up to us', a.listen);
  a.want = G('Want the arrival of superintelligence'); a.subscribe = G('Then subscribe', a.want); a.subscribeE = GE('Then subscribe', a.want);
  a.endScreen = a.upToUsE + .9;   // the 15 s end screen starts .9 s after the last line (timing.json end_screen 620.48)
  MEMO.set(T, a); return a;
}

// ===================================================================================================== ICELAND (c09)
export const ZR_EU = 3.0;   // the map zoom at which the Europe/Iceland medallions are pin size (the hops pig pin ⇄ Iceland)
export const ICE = { id: 'iceland', lon: F.PIN.iceland.lon, lat: F.PIN.iceland.lat, kind: 'other' };
export function harbourPart(a) {
  const cam = K.glide([[a.butEven - 1.2, { u: 980, v: 560, s: 1.0 }], [a.also + 2, { u: 1060, v: 580, s: 1.14 }]]);
  const ship = (t) => 330 + 54 * (t - a.butEven);
  return {
    world(ctx, t, O) {
      S.harbour(ctx, K.camAt(cam(t), t, 1.4, 3), t, { ship: ship(t) });
      const lu = rise(span(t, a.iceland - .65, a.iceland + .25)) * (1 - expoIn(span(t, a.also - .5, a.also)));
      if (lu > 0) K.scr(ctx, O, () => { K.capsLine(ctx, 'ICELAND', 110, 170, 40, lu, { col: P.cream }); K.capsLine(ctx, 'JUNE 2026 · FIN WHALES', 112, 214, 22, rise(span(lu, .25, 1)), { col: P.halo2 }); });
    },
  };
}

// ===================================================================================================== THE BARN: the paradox → 2030 (c09 → c10)
const BAR = [960, 398];                  // [translating…] under the lamp (as in the hook)
const CARD2 = [1300, 292], CS = 1.2;
const YOU = { x: F.BARN.you.x, g: F.BARN.ground + 26, h: F.BARN.you.h };
export function barnPart(a, T) {
  const hop2 = [a.also - .45, a.loving - .15];   // Iceland → the pig pin (zoom out, fly, zoom in)
  const L = hop2[1];
  const cam = K.glide([
    [L, { u: 900, v: 560, s: 1.06 }],
    [a.remind + .5, { u: 905, v: 566, s: 1.1 }],
    [a.less + .2, { u: 915, v: 572, s: 1.13 }],
    [a.hyp + .7, { u: 800, v: 556, s: 1.15 }],
    [a.soMaybe + .9, { u: 740, v: 552, s: 1.23 }],
    [a.whatIf + .6, { u: 870, v: 556, s: 1.12 }],
    [a.words + .6, { u: 930, v: 552, s: 1.04 }],
    [a.day1 + .2, { u: 962, v: 538, s: 1.14 }],
  ], null);
  const A1 = [1480, 372], A2 = [960, 196];
  function stripState(t) {   // docked → beside the bar → big (2030 · TARGET HIT) → docked again
    if (t < a.words - .1) return null;
    const b1 = sineIO(span(t, a.words - .1, a.words + 1.5)), b2 = sineIO(span(t, a.day + .1, a.day + 1.5)), b3 = 1 - span(t, a.day1 + .5, a.day1 + 1.7);
    return { big: Math.min(b1, b3), at: [lerp(A1[0], A2[0], b2), lerp(A1[1], A2[1], b2)], w: lerp(300, 900, b2), s: lerp(1.2, 1.7, b2) };
  }
  function world(ctx, t, c, O) {
    const sq = Math.sin(Math.PI * span(t, a.suffer + .05, a.suffer + 1.5));
    const heartU = span(t, a.human, a.human + 1.1), heartS = (t < a.soMaybe + .5 ? expoOut(heartU) : lerp(1, .26, sineIO(span(t, a.soMaybe + .5, a.enoughE - .1)))) * (1 - expoIn(span(t, a.enoughE - .1, a.enoughE + .45)));
    const lookY = .14 + .12 * sineIO(span(t, a.human - .2, a.human + .8)) - .12 * sineIO(span(t, a.soMaybe + .4, a.enoughE)) + .1 * sineIO(span(t, a.whatIf, a.whatIf + 1));
    const cast = F.barnCast(ctx, c, t, {
      p2: { head: .5 * sq, open: .8 * sq * (.7 + .3 * Math.sin(t * 23)), ear: .25 * sq },
      you: { look: lookY, lean: .1 + .02 * Math.sin(t * .4), armR: [1.45, 1.95], armL: [1.3, 1.9] },
    });
    E.card(ctx, c, F0, () => {
      const head = [YOU.x + 6, YOU.g - YOU.h * .9];
      // the meat paradox: two bubbles out of your head
      const out = 1 - expoIn(span(t, a.hyp - .1, a.hyp + .5));
      K.bubble(ctx, t, 352, 300, 'LOVES ANIMALS', span(t, a.loving + .05, a.loving + .75) * out, head, { size: 26 });
      K.bubble(ctx, t, 470, 404, 'EATS MEAT', span(t, a.eating - .05, a.eating + .65) * out, head, { size: 26 });
      // the pig card with the MIND row: rises out of pig 2's back; the bead sinks on "less of a mind"
      const cu = rise(span(t, a.remind + .25, a.remind + 1.0)) * (1 - expoIn(span(t, a.hyp + .2, a.hyp + .8)));
      if (cu > 0) {
        ctx.save(); ctx.translate(CARD2[0], CARD2[1]); ctx.scale(CS, CS);
        K.mindCard(ctx, t, 0, 0, { u: cu, mind: lerp(.72, -.62, sineIO(span(t, a.less, a.less + 1.0))) });
        K.capsLine(ctx, 'BASTIAN ET AL. 2012', 2, 182, 15, rise(span(t, a.remind + .9, a.remind + 1.6)) * cu, { col: P.halo2 });
        ctx.restore();
      }
      // the feeling: a heart with an ear rises out of you, then shrinks back into you
      if (heartS > .01) {
        const k = sineIO(heartU), hx = lerp(head[0] + 20, 330, k) + (t > a.soMaybe ? lerp(0, -110, sineIO(span(t, a.soMaybe + .5, a.enoughE + .3))) : 0), hy = lerp(head[1] + 110, 400, k) + (t > a.soMaybe ? lerp(0, 150, sineIO(span(t, a.soMaybe + .5, a.enoughE + .3))) : 0);
        K.heartEar(ctx, t, hx, hy, 112 * heartS, { glow: 1 });
      }
      // the bar returns (as in the hook), under the lamp
      const bu = rise(span(t, a.whatIf + .3, a.whatIf + 1.0));
      if (bu > 0) { ctx.save(); ctx.translate(BAR[0], BAR[1]); ctx.scale(CS, CS); F.transBar(ctx, t, 0, 0, { w: 470, u: bu }); ctx.restore(); }
      return cast;
    });
    const tu = rise(span(t, a.paradox - .3, a.paradox + .5)) * (1 - expoIn(span(t, a.remind - .2, a.remind + .3)));
    if (tu > 0) K.scr(ctx, O, () => K.capsLine(ctx, 'THE MEAT PARADOX', 110, 168, 38, tu, { col: P.cream }));
  }
  return { hop2, cam, world, stripState, inner: (t, r) => K.mixCam(K.BARN_MED_P, cam(t), sineIO(K.openOf(r))) };
}

// ===================================================================================================== THE COURTROOM (c10 → c11)
export const NZ = { id: 'nz', lon: F.PIN.nz.lon, lat: F.PIN.nz.lat, kind: 'other' };
export const IOWA_P = { id: 'iowa', lon: F.PIN.iowa.lon, lat: F.PIN.iowa.lat, kind: 'other' };
export function courtPart(a, T) {
  const land = a.twoParts - .05;
  const cam = K.glide([
    [land, { u: 960, v: 540, s: 1.02 }],
    [a.nearShips + .6, { u: 1240, v: 470, s: 1.12 }],    // the cards on the left, the screen on the right
    [a.lawE, { u: 1260, v: 470, s: 1.16 }],
    [a.rest + 1.2, { u: 1090, v: 470, s: 1.1 }],
    [a.tooLoud + .2, { u: 1330, v: 430, s: 1.3 }],      // the recording, the bar under it
    [a.judge + .5, { u: 1080, v: 480, s: 1.18 }],       // the judge
    [a.ships + 1.2, { u: 560, v: 420, s: 1.42 }],       // the window: the ship slows down
    [a.year10 + 1.0, { u: 470, v: 398, s: 1.62 }],
  ]);
  const ship = (t) => { const t0 = a.court - 2, v0 = 7, t1 = a.ships, d = t - t0; if (t < t1) return 320 + v0 * d; const e = t - t1; return 320 + v0 * (t1 - t0) + v0 * 1.4 * (1 - Math.exp(-e / 1.4)); };
  const slow = (t) => sineIO(span(t, a.ships, a.ships + 2.4));
  function world(ctx, t, c, O) {
    const nod = span(t, a.judge, a.judge + 1.3);
    const rec = span(t, a.hears + .4, a.says + .2);
    const anc = S.court(ctx, c, t, { ship: ship(t), slow: slow(t), nod: nod > 0 && nod < 1 ? nod : 0, rec: t < a.hears ? 1 : rec });
    // the bar under the recording: SCENARIO, "too loud"
    const bu = rise(span(t, a.hears + .9, a.hears + 1.6));
    if (bu > 0) E.card(ctx, c, 7000, () => F.transBar(ctx, t, S.COURT.bar[0], S.COURT.bar[1], { w: 380, u: bu, text: 'too loud', typed: span(t, a.tooLoud, a.tooLoudE + .1), stamp: t >= a.tooLoud ? 'SCENARIO' : null }));
    // the two REAL cards (screen layer of the courtroom: they belong to its frame)
    K.scr(ctx, O, () => {
      const out = 1 - expoIn(span(t, a.rest - .1, a.rest + .5));
      const u1 = rise(span(t, a.twoParts + .5, a.twoParts + 1.3)) * out;
      if (u1 > 0) K.realCard(ctx, t, 110, 236, { u: u1, stampU: span(t, a.twoParts + 1.0, a.twoParts + 1.5), w: 620, lines: [
        ['NEAR SHIPS, CALLS SHIFT', 32, P.cream, rise(span(t, a.nearShips, a.nearShips + .7))],
        ['DOMINICA · 13 WHALES · 2026', 21, P.halo2, rise(span(t, a.nearShips + .5, a.nearShips + 1.2))],
        ['CAUSE UNCLEAR', 21, P.halo2, rise(span(t, a.talk + .1, a.talk + .8))]] });
      const u2 = rise(span(t, a.maori - .05, a.maori + .75)) * out;
      if (u2 > 0) K.realCard(ctx, t, 110, 520, { u: u2, stampU: span(t, a.maori + .4, a.maori + .9), w: 620, lines: [
        ['HE WHAKAPUTANGA MOANA · 2024', 28, P.cream, rise(span(t, a.maori + .3, a.maori + 1.0))],
        ['DECLARATION, NOT LAW', 21, P.halo2, rise(span(t, a.persons, a.persons + .7))],
        ['TOHORĀ ORANGA BILL · 2026', 24, P.cream, rise(span(t, a.lawmaker + .1, a.lawmaker + .8))]] });
    });
    return anc;
  }
  return { cam, world, ship, inner: (t, r, far) => K.mixCam(far, cam(t), sineIO(K.openOf(r))) };
}
