// c16 · the take: anchors from the words, and the one continuous draw function (grid world ↔ room world through the room ring).
//   anchors(T, HI, HO) → A        every time of the chunk, anchored to words (never hard-coded seconds)
//   take(ctx, t, A, HO)            draws the frame at t
import { W, H, clamp, lin } from '../engine.mjs';
import { drawGrid, gridSetup, warmSprites } from './v2_c16_grid.mjs';

export function anchors(T, HI, HO) {
  const S = (p, n) => T.S('07b', p, n), E = (p, n) => T.E('07b', p, n), S7 = (p, n) => T.S('07c', p, n), E7 = (p, n) => T.E('07c', p, n);
  const A = {
    Hb: HI.b, end: HO.a - 1 / 30,
    // 16.01 let time stop · 16.02 four thousand weeks · 16.03 eighty years · 16.04 already behind you
    slow1: E('stop') + .25, fly0: S('A human') - .45, four: S('four'), weeks: S('weeks'), eighty: S('Eighty'), years: S('years'),
    fill0: S('Some of yours'), behind: S('behind'),
    // 16.05 Bronnie Ware … final weeks · 16.06 listened … regretted most · 16.07 card 1 · 16.08 card 2
    bronnie: S('Bronnie'), caring: S('caring'), finalW: S('final weeks'), listened: S('listened'), regretted: S('regretted'), most: E('regretted most'),
    q1: S("I wish I'd"), q1e: E('of me'), q2: S("I wish I hadn't"), q2e: E('so hard'),
    // 16.09 the weeks you have left · 16.10 the very end … look back · 16.11 a wonderful life · 16.12 ★ good
    left: S7('have left'), veryEnd: S7('very end'), back: S7('look back'), sayIt: E7('say it'), life: S7('I had'), lifeE: E7('wonderful life'),
    good: S7('good'), world: E7('this world'),
  };
  A.fill1 = A.behind + .05;
  A.fly1 = A.four + .2;
  A.dive0 = A.bronnie - .35;
  A.ringIn = A.caring + 1.1;
  A.lamp0 = A.most - .75; A.lamp1 = A.q1 + .02;
  A.crane0 = A.q1e - .3; A.crane1 = A.q2 + .33;
  A.back0 = A.q2e - .05; A.back1 = A.back0 + .8;
  A.ringOut = A.back1;
  A.glide0 = A.ringOut + 1.25;
  A.arrive = A.veryEnd + .35; A.turn0 = A.arrive + .3; A.turn1 = A.back + 1.15;
  A.wave0 = A.life - .1; A.wave1 = A.lifeE + .06;
  A.riv0 = A.wave1 + .02; A.riv1 = A.good + .5;
  return A;
}

export function setup(A) { gridSetup(A); warmSprites(); }

export function take(ctx, t, A, HO, room) {
  drawGrid(ctx, t, A, {
    plate: HO ? (c, tt) => HO.plate(c, tt) : null,
    portal: room ? (c, tt, ring) => room.portal(c, tt, ring) : (c, tt, ring) => {
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.ellipse(ring.cx, ring.cy, ring.size * .25, ring.size * .25, 0, 0, Math.PI * 2); c.fillStyle = '#ffb35c'; c.fill(); c.restore();
    },
  });
}
