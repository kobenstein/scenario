// Chapter 08 · "The open question" (VO 08a–08d + end card), from the open night sky of chapter 07 to the film end.
// Carrier chain (shot → carrier → next, transition type):
//   in   ch 07's night sky with rose light at the bottom edge → (match) the same night over our harbour; the night lifts, dawn rises
//   8.01 the light-thread "if" (G1) writes itself faint into the dawn sky and breathes on "if"; the camera tilts down toward the
//        roofs → pull back (b, 'out'): the sky shrinks into the open window of the bedroom
//   8.02 the bedroom at dawn, the bed empty, the casements open, the "if" fading in the window sky; slow push → ★ push through
//        the window (b): the harbour fills the frame (cut on an identical frame)
//   8.03 our harbour front lit at dawn; a truck right along the coast to the next bay, which stays dark, landing on "shared"
//        → the truck speeds up and runs on right (c, 'left' slide)
//   8.04 the camera's pan eases out high over a long curving coastline; a thin bridge of light runs over the water to one far
//        bay, which lights on "few"
//   8.05 wider and higher; the sun crests on "every"; the dawn runs along the whole coast (some towns lit, many still dark)
//        → the camera dives down the sun path (b) onto the pier
//   8.06 planks at your feet, then only posts toward the sun; a slow push on "open" → the posts rush past (b, 'push')
//   8.07 seven bedrooms in seven places, the same stripe on each floor, a message light on each bedside; the stripes ignite
//        together on "message" → the truck right speeds up (c, 'left' slide)
//   8.08 the pan eases out on you at the end of the planks, facing the sun; a breathing hold ("You don't have to")
//   8.09 ★ you bend, lift the next plank and lay it; it lands on "want" and catches the sun → the camera rises (c)
//   8.10 wide and high: pier, posts, sun, coastline; hold
//   END  the question writes itself in over the dawn sea and holds to the film end.
import { skyIf, roomDawn, harbourTruck, seaCoast, rooms, pierYou, OUT } from '../lib/s00_end.mjs';

export default async function build(T) {
  const A = (p, n) => T.S('08a', p, n), B = (p, n) => T.S('08b', p, n);
  const ifW = A('"if"'), morning = A('The morning'), possible = A('possible'), shared = A('shared'), It = A('It could'), few = A('few'), Or = A('Or'), every = A('every'), That = A('That part'), open = A('open');
  const And = B('And one'), message = B('message'), you8b = B("You don't");
  const want = T.S('08c', 'want'), there = T.E('08d', 'there');
  const t02 = morning - .55, push0 = possible + .2, push1 = possible + 1.0, t03 = push1, t04 = shared + .5, t05 = And - .45, t06 = you8b - .5;
  return [
    { t: T.seg('08a').start - 1.2, tr: 'match', d: 1.2, draw: skyIf({ t0: T.seg('08a').start - 1.2, ifW }) },
    { t: t02, tr: 'out', d: .9, x: OUT.x, y: OUT.y, depth: OUT.depth, draw: roomDawn({ t0: t02, push0, push1, ifEnd: possible - .3 }) },
    { t: t03, tr: 'cut', d: .04, draw: harbourTruck({ t0: t03, shared }) },
    { t: t04, tr: 'left', d: .5, draw: seaCoast({ t0: t04, It, few, Or, every, That, open }) },
    { t: t05, tr: 'push', d: .6, draw: rooms({ t0: t05, message }) },
    { t: t06, tr: 'left', d: .45, draw: pierYou({ t0: t06, every, bend0: want - 1.5, lift: want - .9, want, rise0: want + .6, rise1: want + 3.1, card: there + .25 }) },
  ];
}
