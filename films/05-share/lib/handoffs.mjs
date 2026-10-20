// The handoff register: one carrier object per chunk boundary, so the outgoing and the incoming builder draw it
// deckungsgleich (same place, size and time) across the cut. Read through lib/carry.mjs: carry('c01>c02', T, R).
// K0 keeps this table; builders do not edit it (ask the lead). Positions are screen px at 1920×1080, s = carrier scale.
//   cut   = where the cut sits: { chunk: 'c02' } = the incoming chunk's first spoken word (R.first) + dt, or { sec, phrase } + dt.
//   keys  = the carrier's path relative to the cut (dt in seconds: negative = still in the outgoing chunk); eased with eio between keys.
//   kind  = how carry().draw renders it ('pen', 'coin', 'nib', 'drop', 'envelope', 'knot', 'sprout', 'line', 'light', 'thread', 'ring').
//   into  = the transition of the incoming chunk's first shot (put it on that shot: { t: cut, tr, x, y, d }).
// Boundaries follow shots-v0 §2 (the v2 re-key may move a boundary; the carriers stay, the lead updates `cut` here).
export const HANDOFFS = {
  'c01>c02': { kind: 'pen', note: 'the pen: from the hook into the sheet of §0', cut: { chunk: 'c02', dt: -.25 },
    keys: [{ dt: -1.4, x: 1240, y: 760, s: 1, r: -2.3 }, { dt: 0, x: 960, y: 560, s: 1.25, r: -2.15 }, { dt: 1.2, x: 860, y: 600, s: 1.1, r: -2.2 }], into: { tr: 'match', d: .5 } },
  'c02>c03': { kind: 'coin', note: 'the rolling paper coin (1.01) rolls on (type c) into the wide shot 1.02', cut: { chunk: 'c03', dt: -.2 },
    keys: [{ dt: -1.2, x: 520, y: 700, s: 1, r: 0 }, { dt: 0, x: 1180, y: 720, s: 1, r: 7.5 }, { dt: 1.1, x: 1700, y: 760, s: .7, r: 14 }], into: { tr: 'right', d: .45 } },
  'c03>c04': { kind: 'nib', note: 'the pen tip leaves the dotted circle (1.16) and becomes the fork of the paths (2.01)', cut: { chunk: 'c04', dt: -.3 },
    keys: [{ dt: -1.2, x: 900, y: 520, s: 1, r: -2.2 }, { dt: 0, x: 960, y: 600, s: .9, r: -1.57 }, { dt: 1, x: 960, y: 640, s: .6, r: -1.57 }], into: { tr: 'zoom', d: .8 } },
  'c04>c05': { kind: 'drop', note: 'the drop falling in 2.16b lands on the PRINT path in 2.17', cut: { chunk: 'c05', dt: -.15 },
    keys: [{ dt: -1, x: 980, y: 260, s: .9, r: 0 }, { dt: 0, x: 980, y: 560, s: 1, r: 0 }, { dt: .6, x: 980, y: 700, s: 1.2, r: 0 }], into: { tr: 'down', d: .4 } },
  'c05>c06': { kind: 'envelope', note: 'the envelope from 3.07c becomes the licence in 3.08', cut: { chunk: 'c06', dt: -.3 },
    keys: [{ dt: -1.2, x: 700, y: 640, s: .8, r: -.1 }, { dt: 0, x: 960, y: 540, s: 1.3, r: .02 }, { dt: 1, x: 980, y: 520, s: 1.5, r: 0 }], into: { tr: 'zoom', d: .8 } },
  'c06>c07': { kind: 'knot', note: 'the knot at the peg (4.05) becomes the light in the tower window (4.06)', cut: { chunk: 'c07', dt: -.3 },
    keys: [{ dt: -1, x: 820, y: 720, s: 1, r: 0 }, { dt: 0, x: 960, y: 520, s: 1.4, r: 0 }, { dt: 1, x: 1010, y: 430, s: .5, r: 0 }], into: { tr: 'zoom', d: .9 } },
  'c07>c08': { kind: 'sprout', note: 'the sprout of 4.18 becomes the napkin word GROW (5.01)', cut: { chunk: 'c08', dt: -.3 },
    keys: [{ dt: -1.2, x: 960, y: 760, s: .7, r: 0 }, { dt: 0, x: 960, y: 600, s: 1.2, r: 0 }, { dt: 1, x: 900, y: 560, s: 1, r: 0 }], into: { tr: 'match', d: .6 } },
  'c08>c09': { kind: 'line', note: 'the border line of 5.16b becomes the napkin word HARVEST (6.01)', cut: { chunk: 'c09', dt: -.3 },
    keys: [{ dt: -1, x: 960, y: 600, s: 1.4, r: 0 }, { dt: 0, x: 960, y: 560, s: 1, r: 0 }, { dt: 1, x: 900, y: 540, s: .8, r: 0 }], into: { tr: 'match', d: .6 } },
  'c09>c10': { kind: 'thread', note: 'the pipe that became solid (6.19) leads into dawn over Manila (6.20)', cut: { chunk: 'c10', dt: -.4 },
    keys: [{ dt: -1.2, x: 700, y: 560, s: 1, r: 0 }, { dt: 0, x: 1180, y: 520, s: 1, r: 0 }, { dt: 1.2, x: 1500, y: 470, s: .7, r: 0 }], into: { tr: 'right', d: .5 } },
};
