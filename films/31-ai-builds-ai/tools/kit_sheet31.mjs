#!/usr/bin/env node
// Film 31 · kit sheet: stills of the world (THE NIGHT FOUNDRY) and every kit piece (the machine, the builders, the ladder, the numbers,
// the cards, the clip plate) so builders see the vocabulary before they build.
//   node tools/kit_sheet31.mjs <dir> [--scale .5] [--only 01,08]
//   then: ffmpeg -pattern_type glob -i '<dir>/*.jpg' -vf tile=3x6 -q:v 4 <ROOT>bild/kit31_kontakt.jpg   (keep it < 1 MB)
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import * as S from '../lib/f31_world.mjs';
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
  fn(ctx, t); E.finish(ctx, t, F.PRINT31);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const LAD = { state: [1, 1, .5, 0, 0], labels: 1, tags: ['TAKEN', "TAKEN (ON THE LABS' WORD)", 'SHARED', 'HUMAN', 'HUMAN'], marker: 2.5 };
const night = (ctx, t) => { S.foundry(ctx, S.HOME, t, { ladder: false, you: false }); F.veil(ctx, .8); };
await shot('01_home_thumb', (ctx, t) => S.foundry(ctx, S.HOME, t, { ladder: { state: [1, 1, .5, 0, 0], marker: 2.5 } }));
await shot('02_wide_foundry', (ctx, t) => S.foundry(ctx, S.WIDE_CAM(), t, { hall: .8, carts: 1, ladder: { state: [1, 1, .5, 0, 0] } }));
await shot('03_lamp_off', (ctx, t) => S.foundry(ctx, S.BENCH_CAM(.8, 120), t, { lamp: 0, ladder: false }));
await shot('04_machine_cam', (ctx, t) => S.foundry(ctx, S.MACH_CAM(), t, { machine: { build: .9 }, ladder: false, you: false }), 4.2);
await shot('05_ladder_cam', (ctx, t) => S.foundry(ctx, S.LADDER_CAM(), t, { ladder: LAD }));
await shot('06_old_machine_thread', (ctx, t) => S.foundry(ctx, S.OLD_CAM(), t, { old: { thread: 1 }, ladder: false, you: false }));
await shot('07_end_cam', (ctx, t) => { S.foundry(ctx, S.END_CAM, t, { machine: { build: .9 }, ladder: false }); const R = S.END_TILES; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; for (const r of [R.left, R.right]) ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.beginPath(); ctx.arc(R.sub.x, R.sub.y, R.sub.r, 0, 7); ctx.stroke(); });
await shot('08_ladder_explainer', (ctx, t) => { night(ctx, t); F.ladder(ctx, t, 760, 900, 760, { w: 150, state: [1, 1, 'f', 0, 0], labels: 1, size: 30, tags: ['TAKEN', 'TAKEN', 'FORECAST: TAKEN NEXT YEAR', 'HUMAN', 'HUMAN'], marker: 3 }); });
await shot('09_ladder_hud', (ctx, t) => { S.foundry(ctx, S.HOME, t, { ladder: false }); F.ladderHUD(ctx, t, T); }, T.G('So, rung three') + 2);
await shot('10_code_share', (ctx, t) => { night(ctx, t); F.codeShare(ctx, t, 260, 380, 1400, { p: 1, big: '9 OF 10', sub: "CODE CHANGES WRITTEN BY THE LAB'S OWN A.I." }); });
await shot('11_share_ring', (ctx, t) => { night(ctx, t); F.shareRing(ctx, t, 620, 470, 230, { v0: .005, v: .26, p: 1, label: 'RESEARCH LED BY THE MODEL', sub: "ANTHROPIC'S OWN ESTIMATE", note0: 'FEB: <1 %' }); F.shareRing(ctx, t, 1340, 470, 230, { v0: .005, v: .26, p: .03, label: 'FEBRUARY' }); });
await shot('12_swarm_eye', (ctx, t) => { night(ctx, t); F.swarm(ctx, t, 300, 520, 1180, 300, { count: 1, sub: 'AI AGENTS AT WORK, AT ANY MOMENT', eye: 1, flag: .8 }); }, 5);
await shot('13_gauge', (ctx, t) => { night(ctx, t); F.gauge(ctx, t, 960, 600, 380, { v: 1.9, range: [1.5, 2.8], label: 'FASTER THAN A YEAR AGO', sub: 'INDEPENDENT EVALUATORS (METR)' }); });
await shot('14_forecast', (ctx, t) => { night(ctx, t); F.forecast(ctx, t, 220, 560, 1480, { title: 'SUPERHUMAN AI RESEARCHER · WHEN?', now: 2026.88, band: [2027.33, 2027.92], bandLabel: 'ALL SIX FORECASTERS', marks: [{ from: 2028.95, to: 2027.37, p: 1, label: 'MAY 2027', sub: 'KOKOTAJLO (AUG: END 2028)' }], pins: [{ at: 2027.95, label: 'TAO LIN', sub: '"END OF 2027"' }] }); });
await shot('15_gen_chain', (ctx, t) => { night(ctx, t); F.genChain(ctx, t, 260, 480, 1400, { p: 1.6, labels: ['DESIGNED BY PEOPLE', 'BUILT WITH A.I.', 'BUILT BY A.I.?'] }); });
await shot('16_quote_card', (ctx, t) => { night(ctx, t); F.quoteCard(ctx, t, null, { text: F.SOURCES.pachockiText, x: 300, y: 250, w: 1320, size: 50, head: 'AN ALIEN MIND', credit: F.SOURCES.pachocki }); });
await shot('17_cards_tag', (ctx, t) => { night(ctx, t); F.dataCard(ctx, t, 200, 260, 700, { kind: 'ESTIMATE', title: 'METR, NOV 5, 2026', big: '≈ 1.9×', small: '95 % RANGE 1.5–2.8', h: 300 }); F.paperCard(ctx, t, 1020, 260, 700, 300, { head: 'THE FINE PRINT', lines: [['No clear speed-up', 54, 0], ['in research as a whole', 40, .6]], src: 'ANTHROPIC, NOV 9, 2026' }); F.priceTag(ctx, t, 1370, 640, ['SOURCE: THE LAB'], 1, { size: 30 }); });
await shot('18_clip_plate_T1a', (ctx, t) => { night(ctx, t); F.clipPlate(ctx, t, T, 'T1a'); }, T.clip('T1a').start + 4);
