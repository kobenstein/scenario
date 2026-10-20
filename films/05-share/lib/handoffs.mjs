// The handoff register: one carrier object per chunk boundary, so the outgoing and the incoming builder draw it
// deckungsgleich (same place, size and time) across the cut. Read through lib/carry.mjs: carry('c01>c02', T, R).
// The lead keeps this table; builders do not edit it (ask the lead). Positions are screen px at 1920×1080, s = carrier scale.
//   cut   = where the cut sits: { chunk: 'c02' } = the incoming chunk's first spoken word (R.first) + dt, or { sec, phrase } + dt.
//   keys  = the carrier's path relative to the cut (dt in seconds: negative = still in the outgoing chunk); eased with eio between keys.
//   kind  = how carry().draw renders it ('pen', 'coin', 'nib', 'drop', 'envelope', 'knot', 'sprout', 'line', 'light', 'thread', 'ring').
//   into  = the transition of the incoming chunk's first shot (put it on that shot: { t: cut, tr, x, y, d }).
// v2 (bild/shots.md §2, cuts from the film.mjs anchors). kind 'own' = carry().draw draws nothing: both builders draw the object themselves
// at carry().pos(t) (a sheet, a card, a pen in a hand), so it is identical across the cut. Whip boundaries carry only the motion direction.
export const HANDOFFS = {
  'c01>c02': { kind: 'own', note: 'Musk\'s quote sheet (0.04) slides aside to the right half; in 0.05 the Anthropic sheet joins it from the left, the camera rises',
    cut: { chunk: 'c02', dt: -.2 }, keys: [{ dt: -.9, x: 960, y: 540, s: 1, r: 0 }, { dt: 0, x: 1250, y: 560, s: .72, r: .015 }, { dt: 1.4, x: 1330, y: 580, s: .62, r: .02 }], into: { tr: 'cut', d: .12 } },
  'c02>c03': { kind: 'light', note: 'the Paine page (1.13) sinks out of frame; the foil word "right" stays as a point of light and becomes the burin tip in 1.02',
    cut: { chunk: 'c03', dt: -.25 }, keys: [{ dt: -1, x: 1150, y: 600, s: .7, r: 0 }, { dt: 0, x: 1060, y: 480, s: 1, r: 0 }, { dt: .8, x: 1010, y: 440, s: .8, r: 0 }], into: { tr: 'cut', d: .12 } },
  'c03>c04': { kind: 'own', note: 'the camera tears back from the US map (2.08) to the fork: whip to the right, 2.09 lands on the PRINT path',
    cut: { chunk: 'c04', dt: -.15 }, keys: [{ dt: -.3, x: 960, y: 540 }, { dt: .3, x: 960, y: 540 }], into: { tr: 'whipR', d: .3 } },
  'c04>c05': { kind: 'line', note: 'the quiet amber AGREE line seen from above (2.23) → push-in; it becomes the signature line on the sheet at the stake (2.24)',
    cut: { chunk: 'c05', dt: -.3 }, keys: [{ dt: -1.2, x: 900, y: 560, s: .45, r: -.12 }, { dt: 0, x: 960, y: 600, s: 1.3, r: -.03 }, { dt: 1, x: 960, y: 640, s: .9, r: 0 }], into: { tr: 'zoom', d: .8 } },
  'c05>c06': { kind: 'pen', note: 'the one bar (3.13) shrinks to a stroke and exits right; it becomes the pen in your friend\'s hand on the roof (3.14)',
    cut: { chunk: 'c06', dt: -.2 }, keys: [{ dt: -.8, x: 1080, y: 560, s: .85, r: -2.6 }, { dt: 0, x: 1420, y: 610, s: 1, r: -2.3 }, { dt: 1.1, x: 1360, y: 660, s: 1.05, r: -2.2 }], into: { tr: 'cut', d: .12 } },
  'c06>c07': { kind: 'own', note: 'the dotted idea card (4.11) tips down into the soil, the camera follows it down; it lands as the form on the parent\'s knee (4.12)',
    cut: { chunk: 'c07', dt: -.25 }, keys: [{ dt: -.9, x: 960, y: 520, s: 1, r: .04 }, { dt: 0, x: 980, y: 760, s: .9, r: .12 }, { dt: 1.2, x: 1000, y: 780, s: .8, r: .08 }], into: { tr: 'down', d: .5 } },
  'c07>c08': { kind: 'own', note: 'crane up from the cheering heads (5.15) → whip up; the two certificate fragments of 5.07 rise from below',
    cut: { chunk: 'c08', dt: -.15 }, keys: [{ dt: -.3, x: 960, y: 540 }, { dt: .3, x: 960, y: 540 }], into: { tr: 'whipU', d: .3 } },
  'c08>c09': { kind: 'line', note: 'the highlighted words "specific populations" (6.06) → push-in; the highlight becomes a line of the long list in 6.07',
    cut: { chunk: 'c09', dt: -.25 }, keys: [{ dt: -.8, x: 1000, y: 560, s: .8, r: 0 }, { dt: 0, x: 960, y: 540, s: 1.3, r: 0 }, { dt: 1, x: 960, y: 520, s: 1, r: 0 }], into: { tr: 'zoom', d: .8 } },
  'c09>c10': { kind: 'thread', note: 'the light now flowing through the solid lines (6.19) streams out to the right → whip right; in 6.20 she walks to the right through Manila',
    cut: { chunk: 'c10', dt: -.2 }, keys: [{ dt: -1, x: 700, y: 560, s: 1 }, { dt: 0, x: 1560, y: 520, s: 1 }, { dt: .4, x: 2200, y: 500, s: 1, a: 0 }], into: { tr: 'whipR', d: .3 } },
};
