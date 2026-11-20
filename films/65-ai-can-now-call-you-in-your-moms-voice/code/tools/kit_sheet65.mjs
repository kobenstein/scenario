#!/usr/bin/env node
// Stills of the shared kit and world (lead + builders: look before you build). node tools/kit_sheet65.mjs <dir> [scale] [only,…]
// Writes one jpg per sheet: the line from the thumbnail camera, the plates, the end picture, the kitchen, the phone screens, the clip frames.
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f65_kit.mjs';
import * as S from '../lib/f65_seams.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';

const dir = process.argv[2] || 'sheets', sc = Number(process.argv[3] || .5), only = process.argv[4] ? process.argv[4].split(',') : null; fs.mkdirSync(dir, { recursive: true });
const T = timing(TIMING), cv = createCanvas(1920, 1080), ctx = cv.getContext('2d'), out = createCanvas(Math.round(1920 * sc), Math.round(1080 * sc)), ox = out.getContext('2d');
const t = 3.3;
const SHEETS = {
  world_thumb: () => S.lineWorld(ctx, S.THUMB_CAM, t, { source: { a: .8 }, you: { phone: 1, screen: 'call', light: 1 } }),
  world_line: () => S.lineWorld(ctx, S.look(-300, 300, 6400, .9, 960, 560, 600), t, { tags: { lit: (k) => (k < 3 ? 1 : 0), hi: 3 }, ghosts: { a: .8 }, source: { a: .6 }, wire: { gold: 1, u: 3 } }),
  plate_1: () => S.plateLine(ctx, t, T, 1),
  plate_3: () => S.plateLine(ctx, t, T, 3),
  plate_5: () => S.plateLine(ctx, t, T, 5),
  end: () => S.lineWorld(ctx, S.END_CAM, t, S.endState()),
  kitchen: () => S.kitchen(ctx, t, 1920, 1080, { notes: [{ lines: ['WORD'], cover: 1 }, { lines: ['?'], size: .4 }, { lines: ['FACE +', 'PROFIT', '= FAKE'] }, { lines: ['HURRY +', 'SECRET +', 'MONEY', '= STOP'], size: .1 }, { empty: 1 }], phone: { screen: 'call', ring: 1 }, mom: { look: .1 } }),
  kitchen_lift: () => S.kitchen(ctx, t, 1920, 1080, { notes: [{ empty: 1 }], phone: { screen: 'wave', lift: 1, waveCol: F.COPY, tremble: 1 }, mom: { look: .05 } }),
  phones: () => {
    S.lineWorld(ctx, S.look(0, 0, 9000, .4, 960, 900, 300), t, { you: false, tags: { a: 0 }, wire: { a: 0 } }); F.veil(ctx, .4);
    ['call', 'timer', 'video', 'contacts', 'wave', 'dark'].forEach((s, i) => F.phone(ctx, t, 220 + i * 296, 560, 420, { screen: s, ring: s === 'call' ? 1 : 0, timer: 5 * 3600 + 1234, seal: .6, waveCol: s === 'wave' ? F.COPY : undefined }));
    F.note(ctx, t, 300, 920, 120, { lines: ['WORD'], cover: 1, lit: 1 }); F.note(ctx, t, 480, 920, 120, { empty: 1 });
    F.coin(ctx, t, 700, 920, 50, { ph: .6 }); F.avatar(ctx, 880, 920, 50);
    F.voiceWave(ctx, t, [[1000, 900], [1800, 900]], { amp: 60, col: F.GOLD, seed: 3 }); F.voiceWave(ctx, t, [[1000, 1010], [1800, 1010]], { amp: 60, col: F.COPY, seed: 3, flicker: 1 });
  },
  clip_S1: () => { S.lineWorld(ctx, S.THUMB_CAM, t, {}); F.veil(ctx, .5); const w = T.clip('S1'); F.clipFrame(ctx, w.start + 1.5, T, 'S1', { morph: 1 }); },
  clip_C1: () => { S.lineWorld(ctx, S.THUMB_CAM, t, {}); F.veil(ctx, .5); const w = T.clip('C1'); F.clipFrame(ctx, w.start + 3, T, 'C1', { morph: 1 }); },
  clip_C10: () => { S.lineWorld(ctx, S.THUMB_CAM, t, {}); F.veil(ctx, .5); const w = T.clip('C10'); F.clipFrame(ctx, w.start + 3, T, 'C10', { morph: 1 }); },
};
for (const [k, fn] of Object.entries(SHEETS)) {
  if (only && !only.includes(k)) continue;
  if (k.startsWith('clip_')) { const id = k.slice(5), w = T.clip(id); if (F.hasFootage(id)) await F.prepareClipFrames(T, w.start + (id === 'S1' ? 1.5 : 3)); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1920, 1080); fn(); E.finish(ctx, t, F.PRINT65);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, `${k}.jpg`); fs.writeFileSync(f, await out.encode('jpeg', 86)); console.log(f);
}
