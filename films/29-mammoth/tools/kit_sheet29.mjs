#!/usr/bin/env node
// Stills of the shared kit and world (lead + builders: look before you build). node tools/kit_sheet29.mjs <dir> [scale]
// Writes one jpg per sheet: the world from the thumbnail camera, the plates, the animal presets, the lab, the explainers.
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f29_kit.mjs';
import * as S from '../lib/f29_seams.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';

const dir = process.argv[2] || 'sheets', sc = Number(process.argv[3] || .5); fs.mkdirSync(dir, { recursive: true });
const T = timing(TIMING), cv = createCanvas(1920, 1080), ctx = cv.getContext('2d'), out = createCanvas(Math.round(1920 * sc), Math.round(1080 * sc)), ox = out.getContext('2d');
const t = 3.3;
const SHEETS = {
  world_thumb: () => S.fenceWorld(ctx, S.THUMB_CAM, t, { poster: { a: 1 }, beast: false, glint: { a: .5 } }),
  world_mammoth: () => S.fenceWorld(ctx, E.cam3({ x: 250, y: 40, z: 2350, hz: 560 }), t, { beast: { lift: .6, breath: .7 }, wolf: false }),
  world_lit: () => S.fenceWorld(ctx, S.look(-1200, 300, 9000, .5, 960, 520, 620), t, { glint: { a: .4, lit: 1 }, beast: false }),
  world_comb: () => S.fenceWorld(ctx, S.look(-1200, 300, 9000, .5, 960, 520, 620), t, { glint: { a: .4, comb: -800, kept: 1 }, comb: { x: -800 }, beast: false, elephant: { walk: t * 2 } }),
  plate_fence: () => S.plateFence(ctx, t, T),
  plate_dodo: () => S.plateDodo(ctx, t, T),
  plate_ice: () => S.plateIce(ctx, t, T),
  end: () => S.fenceWorld(ctx, S.END_CAM, t, { beast: false, wolf: { lit: 1 }, ferret: { lit: 1 }, bird: { lit: 1 } }),
  animals: () => {
    S.stage(ctx, t);
    F.beast(ctx, t, 420, 520, 300, { ...F.ELEPHANT, dir: 1 }); F.beast(ctx, t, 1060, 520, 300, { ...F.COLD, dir: 1 }); F.beast(ctx, t, 1640, 520, 300, { ...F.MAMMOTH, dir: -1, breath: .6 });
    F.mouse(ctx, t, 260, 900, 160, { fur: 1 }); F.wolf(ctx, t, 640, 920, 150, { pale: .8 }); F.ferret(ctx, t, 960, 920, 200, {}); F.bird(ctx, t, 1200, 920, 80, {}); F.dodo(ctx, t, 1420, 930, 200, {}); F.dodo(ctx, t, 1700, 930, 200, { light: 1 });
  },
  lab: () => S.lab(ctx, t, 1920, 1080, { mouse: { walk: t * 6, x: .5 } }),
  explain: () => {
    S.stage(ctx, t);
    F.tally(ctx, t, { v: 1400000, label: 'DIFFERENCES IN THE DNA' });
    F.strand(ctx, t, 300, 520, 1300, { n: 90, label: 'ELEPHANT', diff: (k) => (k % 9 === 2 ? 1 : 0), seed: 3 });
    F.strand(ctx, t, 300, 660, 1300, { n: 90, label: 'MAMMOTH', diff: (k) => (k % 9 === 2 ? 1 : 0), seed: 4, col: E.mixHex(F.FUR.tip, E.P.cream, .3) });
    F.list(ctx, t, 1260, 120, 520, { title: 'THE LIST', rows: [['FUR', 1, 1], ['FAT', 1, 0], ['EARS', .6, 0]] });
    F.scanBar(ctx, 300, 1600, 800, {});
  },
};
for (const [k, fn] of Object.entries(SHEETS)) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1920, 1080); fn(); E.finish(ctx, t, F.PRINT29);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, `${k}.jpg`); fs.writeFileSync(f, await out.encode('jpeg', 86)); console.log(f);
}
