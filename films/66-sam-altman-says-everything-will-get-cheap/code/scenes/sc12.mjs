// c12 · B3 · THE ORDER · YOUR WAGE IS A PRICE TOO · END · the clock grows to fill the frame (F.board big): the verdicts light in order with
// the words · "half right": a gold line under the half that falls · the seventh swings, OPEN · the clock goes back to its corner: the town
// hall, you at the house door, the seventh tag · "Prices follow the machines": you walk to the seventh tag, it comes down to your hand ·
// "the rules are written by people you elect": the town hall's windows light one by one · YOUR WAGE IS A PRICE TOO. ★ · subscribe 2: the
// windows of the whole land warm, the camera pulls back and settles · END SCREEN (15 s): thumbnail B again with the seventh tag in your
// hand; the earth below carries the two tiles and the subscribe circle (S.END_TILES); no text, no arrows, the picture keeps breathing.
// So that's the order → the end. Plan: docs/shots.md 11.01–E.01. Part of the B3 take (scenes/sc09.mjs: b3()).
//
// | ID     | anchor (phrase)                | picture (one idea)                                                                  | camera            |
// |--------|--------------------------------|-------------------------------------------------------------------------------------|-------------------|
// | 11.01  | So that's the order            | the clock fills the frame; FALLS FIRST · FALLS SLOWLY · STAYS UP · STAYS HARD light  | creep · EXPL      |
// | 11.02  | He's half right                | a gold line draws under the half that falls (tags 1–3)                              | creep · EXPL      |
// | 11.03  | What's still open              | the seventh swings (the clock does it); the clock goes back to its corner           | creep · MIX       |
// | 11.04  | Prices follow the machines     | you walk to the seventh tag, it comes down into your hand; the town hall lights up  | glide · SCENE     |
// | 11.05★ | Your wage is a price too       | YOUR WAGE IS A PRICE TOO. in gold over you and the tag                               | push in · MIX     |
// | 11.06  | And cheap only makes you richer| hold: the tag in your hand, the row of six behind you                               | creep · LAND      |
// | A.01   | This channel exists (2nd)      | subscribe 2: the windows of the whole land warm; the pull back                      | pull back · LAND  |
// | E.01   | END SCREEN                     | END_CAM-like: thumbnail B + you with the seventh tag; tiles + circle on the earth   | slow push · LAND  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
import { b3, PRINT, CL, SEV, big } from './sc09.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, smooth, mixHex } = E;
const { GOLD, LAMP } = F;

export default async (T, R) => [{ t: R.a, draw: b3(T).draw, print: PRINT }];

export function anchors(a, G, GE, T) {
  a.order = G("So that's the order"); a.thinking = G('Thinking falls first', a.order); a.things = G('Things follow, slowly', a.order);
  a.energy = G('Energy holds', a.order); a.ground = G('The ground stays hard', a.order); a.half = G("He's half right", a.order);
  a.worth = G('And that half is worth', a.half); a.open = G("What's still open", a.half); a.machines = G('Prices follow the machines', a.open);
  a.incomes = G('Incomes follow the rules', a.machines); a.elect = G('people you elect', a.incomes); a.core = G('Your wage is a price too', a.elect);
  a.cheapR = G('And cheap only makes you richer', a.core); a.channel = G('This channel exists', a.cheapR); a.endT = T.duration - 15;
}
// the end framing (land card): the row of six (thumbnail B) left of centre, the house-tag, you with the seventh tag, the town hall at the
// right; the ground line at y 600, the dark earth below carries S.END_TILES (left 80–720, right 1200–1840, y 640–1000; the circle at 960, 930)
export const ENDC = (k = 1, dx = 0) => CL(5650 + dx, S.GY, .78 * k, 960, 600);
const YOU0 = S.STAIRS.house.x, YOU1 = 5985, HAND = { x: 6040, y: S.GY - 182 };
const HALLW = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 6600 - 200 + i * 72, y: S.GY - 170, w: 40, h: 110 }));
const VERD = [['thinking', 0], ['things', 2], ['energy', 3], ['ground', 5]];

export function layer(a, T) {
  const bigU = (t) => sineIO(span(t, a.order - .2, a.order + 1.8)) * (1 - sineIO(span(t, a.open + 1.0, a.open + 2.8)));
  const walk = (t) => smooth(span(t, a.machines - .1, a.machines + 3.3));
  const lower = (t) => sineIO(span(t, a.machines + 1.2, a.machines + 3.8));
  const wipe = (t) => sineIO(span(t, a.channel + 7.5, a.channel + 9.0));    // the clock's label goes behind a mask before the end screen
  return {
    keys: [
      [a.order + 1.6, CL(6420, 700, 1.25, 960, 560)],
      [a.open + 2.8, CL(6250, 720, 1.4, 960, 560)],
      [a.machines + 3.6, CL(6200, 735, 1.48, 960, 580)],
      [a.core + .8, CL(6000, 840, 1.8, 700, 760)],
      [a.cheapR + 3.6, CL(6005, 842, 1.74, 700, 760)],
      [a.channel + 1.2, CL(5990, 820, 1.55, 760, 720)],
      [a.endT - .4, ENDC(1, 0)],
      [T.duration, ENDC(1.02, 12)],
    ],
    world(t, st) {
      const w = walk(t), x = lerp(YOU0, YOU1, w), moving = w > 0 && w < 1;
      const reach = smooth(span(t, a.machines + 2.9, a.machines + 4.0));
      if (t > a.machines - .2) st.youLand = { x, h: 70, o: moving ? { walk: (x - YOU0) / 11, dir: 1, look: .6 } : { look: lerp(.9, .55, reach), armR: [lerp(.2, 2.15, reach), lerp(.1, 2.5, reach)] } };
      const s7 = st.tags[6]; if (!s7) return;
      const lo = lower(t);
      s7.x = lerp(SEV.x, HAND.x, lo); s7.y = lerp(SEV.y, HAND.y, lo);
      s7.glow = Math.max(s7.glow ?? .8, lerp(.8, 1, F.bump(t, a.core - .1, 3)) * smooth(span(t, a.machines, a.machines + 1)));
      s7.textU = (s7.textU ?? 1) * (1 - wipe(t));   // the end screen carries no words: YOUR WAGE sinks off the tag with the clock's label
      s7.swing = (s7.swing ?? 0) + .05 * F.bump(t, a.open, 2.6) * Math.sin(t * 2.2) * (1 - lo);
      const warm = smooth(span(t, a.channel, a.channel + 4.5));
      st.city = warm; st.power = .3 * (1 - warm);
    },
    land(ctx, t) {
      // "Incomes follow the rules … people you elect": the town hall's windows light one by one
      HALLW.forEach((r, i) => {
        const u = smooth(span(t, a.incomes + .3 + i * .28, a.incomes + 1.0 + i * .28)); if (u <= 0) return;
        ctx.fillStyle = rgba(LAMP.core, .55 * u * (.92 + .08 * Math.sin(t * .7 + i))); ctx.fillRect(r.x, r.y, r.w, r.h);
        E.halo(ctx, r.x + r.w / 2, r.y + r.h / 2, 60, .16 * u, GOLD.halo, LAMP.core);
      });
    },
    veil: (t) => .86 * bigU(t),
    board(t) {
      let lit; for (const [k, i] of VERD) if (t >= a[k] - .1) lit = i;
      if (t >= a.half - .1) lit = undefined; if (t >= a.open - .1) lit = 6;
      return { big: bigU(t), lit };
    },
    over(ctx, t) {
      F.float(ctx, t, .4);
      // 11.01: the verdict of the lit tag under the big clock
      const bu = bigU(t);
      VERD.forEach(([k, i], j) => {
        const t0 = a[k], t1 = j < VERD.length - 1 ? a[VERD[j + 1][0]] : a.half;
        const u = span(t, t0 - .05, t0 + .5) * (1 - span(t, t1 - .35, t1 - .05)) * bu; if (u <= 0) return;
        F.verdict(ctx, t, 960, 600, F.BOARD.tags[i].verdict, u, { size: 38 });
      });
      // 11.02: half right: a gold line under the tags that fall (1–3)
      if (bu > 0 && t > a.half - .2) {
        const x0 = W / 2 - 230 * 2.7 + (26 - 40) * 2.7, x1 = W / 2 - 230 * 2.7 + (26 + 132 + 40) * 2.7, y = 150 + 128 * 2.7;
        const g = 1 + .6 * F.bump(t, a.worth, 1.6);
        F.goldSpan(ctx, [[x0, y], [x1, y]], 0, smooth(span(t, a.half, a.half + 1.1)) * bu, { w: 2 * g, spark: false, a: bu * (1 - span(t, a.open - .3, a.open + .3)) });
      }
      // 11.05 ★: the core sentence over you and the tag
      const cu = span(t, a.core - .1, a.core + .6) * (1 - span(t, a.channel - .4, a.channel + .5));
      if (cu > 0) big(ctx, F.SOURCES.core1, 1230, 330, 76, cu, { align: 'center' });
    },
    // before the end screen the clock's label (YOUR WAGE) sinks behind a mask: the end screen carries no text (the seven tags stay)
    boardClip: (t) => { const wp = wipe(t); return wp > 0 ? lerp(232, 132, wp) : null; },
  };
}
