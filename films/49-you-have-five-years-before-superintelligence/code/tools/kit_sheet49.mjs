#!/usr/bin/env node
// Film 49 · kit sheet: stills of the world and every kit piece (the stairs at home = thumbnail B, the old stair and its landings, the five
// stages, the wedding table, the door, the three seam plates, the end camera, the explainer blocks, the countdown, the place card, the date
// cards, the clip plates) so builders see the vocabulary before they build.
//   node tools/kit_sheet49.mjs <dir> [--scale .5] [--only 01,02]   (then: ffmpeg tile of <dir>/*.jpg, < 1 MB, to <ROOT>bild/kit49_kontakt.jpg)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
const { W, H, P } = E;
const dir = process.argv[2] || 'kit'; fs.mkdirSync(dir, { recursive: true });
const sc = Number(process.argv[process.argv.indexOf('--scale') + 1] || .5) || .5;
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
const T = timing(TIMING);
E.prepareEditorial?.();
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), out = createCanvas(Math.round(W * sc), Math.round(H * sc)), ox = out.getContext('2d');
async function shot(name, fn, t = 3) {
  if (only && !only.some((o) => name.startsWith(o))) return;
  await F.prepareClipFrames(T, t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  fn(ctx, t); E.finish(ctx, t, F.PRINT49);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const night = (ctx, t = 3) => { S.stairsWorld(ctx, E.aim(S.Z_LAND, 1200, 500, .9), t, { you: false }); F.veil(ctx, .78); };
const at = (p, d = 0) => T.G(p) + d;
await shot('01_home_thumbB', (ctx, t) => { S.stairsWorld(ctx, E.cam3(), t, {}); F.title(ctx, t, 1); }, .2);
await shot('02_old_stair_wide', (ctx, t) => S.stairsWorld(ctx, E.aim(S.Z_LAND, -2600, 1050, .24, 960, 560), t, { old: 1, hist: [1, 1, 1, 1] }));
await shot('03_landing_plow', (ctx, t) => S.stairsWorld(ctx, E.aim(S.Z_LAND, -5900, S.landingY(0) - 90, 1.0), t, { old: 1, hist: [1, 0, 0, 0] }));
await shot('04_landing_engine', (ctx, t) => S.stairsWorld(ctx, E.aim(S.Z_LAND, -4650, S.landingY(1) - 90, 1.0), t, { old: 1, hist: [1, 1, 0, 0] }));
await shot('05_landing_computer', (ctx, t) => S.stairsWorld(ctx, E.aim(S.Z_LAND, -3500, S.landingY(2) - 90, 1.0), t, { old: 1, hist: [1, 1, 1, 0] }));
await shot('06_window_until', (ctx, t) => S.stairsWorld(ctx, E.aim(S.Z_LAND, -1200, 900, .62), t, { old: 1, hist: [0, 0, 0, 1], until: .82 }));
for (let k = 0; k < 5; k++) await shot(`${String(7 + k).padStart(2, '0')}_stage${5 - k}_${S.STAGES[k].name.replace(/\s/g, '')}`, (ctx, t) => S.stairsWorld(ctx, S.stageCam(k, 2.3), t, { lit: S.LIT(k), stage: [0, 1, 2, 3, 4].map((j) => (j === k ? 1 : 0)), you: { x: S.STAGES[k].x0 + 60, y: S.STAGES[k].y, o: { look: .4 } } }));
await shot('12_wedding_table', (ctx, t) => S.stairsWorld(ctx, E.aim(S.Z_LAND, -630, 880, 2.0), t, { wedding: { a: 1, lights: 1 }, you: false,
  people: [{ x: -700, y: S.GY, h: 165, kind: 'person', o: { back: .5, look: .3 } }], land: (cx) => F.placeCard(cx, t, S.WEDDING.card.x, S.WEDDING.card.y, 46, { answer: .4, gold: .7 }) }));
await shot('13_seam_plateFoot', (ctx, t) => S.plateFoot(ctx, t, T), at('Picture a wedding'));
await shot('14_seam_plateWork', (ctx, t) => S.plateWork(ctx, t, T), at('But you can only do so much'));
await shot('15_seam_plateMachine', (ctx, t) => S.plateMachine(ctx, t, T), at('That is what the experts know'));
await shot('16_end_cam', (ctx, t) => { S.endScreen(ctx, t, T);
  const R = S.END_TILES; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; for (const r of [R.left, R.right]) ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.beginPath(); ctx.arc(R.sub.x, R.sub.y, R.sub.r, 0, 7); ctx.stroke(); }, T.duration - 5);
await shot('17_cards_quote_data', (ctx, t) => { night(ctx); F.quoteCard(ctx, t, T, { text: F.SOURCES.trump, x: 140, y: 150, w: 900, size: 46, head: 'QUOTE', credit: F.SOURCES.trumpSrc });
  F.dataCard(ctx, t, 1160, 160, 620, { kind: 'KNOWN', title: F.SOURCES.foundersLabel, big: F.SOURCES.foundersBig, small: 'FASTEST-GROWING 0.1 % OF NEW U.S. FIRMS', src: 'AZOULAY ET AL., 2020', h: 300 }); });
await shot('18_bars_rail', (ctx, t) => { night(ctx); F.bars(ctx, t, 220, 640, { items: F.SOURCES.pewBars.map((b, i) => ({ ...b, gold: i ? 1 : 0 })), max: 40, h: 360, bw: 150, gap: 120 });
  F.source(ctx, t, 0, 99, F.SOURCES.pew, { x: 220 });
  F.yearRail(ctx, t, 900, 560, 880, { from: 2026, to: 2050, now: 2026, marks: [{ year: 2032, label: '≈ 2032', sub: 'Metaculus', gold: 0 }, { year: 2047, label: '≈ 2047', sub: 'survey', gold: 0, lift: 140 }], brk: { from: 2026, to: 2047, label: F.SOURCES.generation } }); });
await shot('19_counter_tents_place', (ctx, t) => { S.stairsWorld(ctx, E.aim(S.Z_LAND, 760, 720, 1.7), t, { you: { x: 600, y: S.STAGES[0].y, o: { look: .6 } }, laptop: { x: 860, on: 1 },
  land: (cx) => { F.tentCard(cx, t, 760, S.STAGES[0].y + 4, 84, { big: '2027?', small: ['AI Futures Project', 'Nov 2026'] }); F.tentCard(cx, t, 1010, S.STAGES[1].y + 4, 92, { big: '1–2 years', small: ['Dario Amodei', 'essay, Jan 2026'], bigSize: 22 }); F.placeCard(cx, t, 470, S.STAGES[0].y + 2, 40, { answer: 0, gold: 1 }); } });
  F.counter(ctx, t, T); }, F.stepHit(T, 1) + 1);
await shot('20_clip_portrait_C13', (ctx, t) => { night(ctx); F.clipPlate(ctx, t, T, 'C13'); }, T.clip('C13').start + 3);
await shot('21_clip_landscape_C2', (ctx, t) => { night(ctx); F.clipPlate(ctx, t, T, 'C2'); }, T.clip('C2').start + 3);
await shot('22_captions', (ctx, t) => { S.stairsWorld(ctx, E.aim(S.Z_LAND, 900, 650, .82, 960, 600), t, { you: { x: 300 } }); F.caption(ctx, t, 80, 230, ['A WARNING'], 1, { size: 150 }); }, 40);
