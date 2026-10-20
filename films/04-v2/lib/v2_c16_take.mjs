// c16 · the take: anchors from the words, and the one continuous draw function (grid world ↔ room world through the room ring).
//   anchors(T, HI, HO) → A        every time of the chunk, anchored to words (never hard-coded seconds)
//   setup(T, A)                    caches (sprites, stars, textures, the card words)
//   take(ctx, t, A, HO)            draws the frame at t
import { W, H, clamp, lin, mix } from '../engine.mjs';
import { cio, EXIT_SPLIT } from './v2_c16_kit.mjs';
import { drawGrid, gridSetup, warmSprites, F0, RING_D } from './v2_c16_grid.mjs';
import { drawRoom, roomCam, roomLabel, warmRoom } from './v2_c16_room.mjs';

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
    so: S7('So what'), left: S7('have left'), veryEnd: S7('very end'), back: S7('look back'), sayIt: E7('say it'), life: S7('I had'), lifeE: E7('wonderful life'),
    good: S7('good'), world: E7('this world'),
  };
  A.fill1 = A.behind + .05;
  A.fly1 = A.four + .2;
  A.dive0 = A.bronnie - .35;
  A.ringIn = A.caring + 1.1;
  A.lamp0 = A.regretted + .3; A.lamp1 = A.q1 + .02;
  A.crane0 = A.q1e - .3; A.crane1 = A.q2 + .33;
  A.back0 = A.q2e - .05; A.exitEnd = A.back0 + 2.25;
  // the moment of the pull-back at which the room's hole (the ring) takes over: cio(u) = EXIT_SPLIT
  { let a = 0, b = 1; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (cio(m) < EXIT_SPLIT) a = m; else b = m; } A.ringOut = A.back0 + (A.exitEnd - A.back0) * (a + b) / 2; }
  A.arrive = A.veryEnd + .35; A.turn0 = A.arrive + .25; A.turn1 = A.back + 1.15;
  A.wave0 = A.life - .1; A.wave1 = A.lifeE + .06;
  A.riv0 = A.wave1 + .02; A.riv1 = A.good + .5;
  A.ringSizeIn = F0 / RING_D;          // px per unit at the ring framing (top-down, distance RING_D)
  return A;
}

export function setup(T, A) { gridSetup(A); warmSprites(); warmRoom(T, A); }

// the room seen through the hole of its ring: clipped to the ring's inner circle, a dark lip of depth at the edge
function portal(ctx, t, A, ring) {
  const [a, b, c, d] = ring.m;
  ctx.save();
  ctx.setTransform(a, b, c, d, ring.cx, ring.cy); ctx.beginPath(); ctx.arc(0, 0, .47, 0, Math.PI * 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clip();
  drawRoom(ctx, t, A, roomCam(t, A, ring));
  // the inside wall of the hole (depth), only while the hole is smaller than the frame
  ctx.setTransform(a, b, c, d, ring.cx, ring.cy);
  const g = ctx.createRadialGradient(0, 0, .3, 0, 0, .47); g.addColorStop(0, 'rgba(5,6,18,0)'); g.addColorStop(.75, 'rgba(5,6,18,.12)'); g.addColorStop(1, 'rgba(5,6,18,.55)');
  ctx.fillStyle = g; ctx.fillRect(-.5, -.5, 1, 1);
  ctx.restore();
}

export function take(ctx, t, A, HO) {
  if (t >= A.ringIn && t < A.ringOut) drawRoom(ctx, t, A, roomCam(t, A, null));
  else drawGrid(ctx, t, A, { plate: HO ? (c, tt) => HO.plate(c, tt) : null, portal: (c, tt, ring) => portal(c, tt, A, ring) });
  roomLabel(ctx, t, A);
}
