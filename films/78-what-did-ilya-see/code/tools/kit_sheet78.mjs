#!/usr/bin/env node
// Film 78 · kit sheet: stills of the stage and every kit piece (the Leitbild, the call grid, post cards, the ring, the marquee, the
// transcript, the 52 pages, the line, the jobs grid, the lectern, his life line, the recipe card, the chat window, cards, a clip plate,
// both seam plates, the end screen) so builders see the vocabulary first.
//   node tools/kit_sheet78.mjs <dir> [--scale .5] [--only name,…]   then tile:  python3 tools/tile.py … (or ffmpeg tile) → <ROOT>bild/kit78_kontakt.jpg
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f78_kit.mjs';
import * as S from '../lib/f78_world.mjs';
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
  ctx.save(); fn(ctx, t); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); E.finish(ctx, t, F.PRINT78);
  ox.drawImage(cv, 0, 0, out.width, out.height); const f = path.join(dir, name + '.jpg'); fs.writeFileSync(f, await out.encode('jpeg', 85)); console.log(f);
}
const night = (ctx, t) => { S.stage(ctx, t, S.HOME()); ctx.setTransform(1, 0, 0, 1, 0, 0); };
const lab = (ctx, s) => { ctx.setTransform(1, 0, 0, 1, 0, 0); F.glowText(ctx, s, 60, 60, { size: 24, weight: 700, col: F.GOLD.text, glow: false, spacing: .1 }); };
await shot('01_leitbild_thumbC', (ctx, t) => { const c = S.HOME(); S.stage(ctx, t, c); S.view(ctx, c); S.leitbild(ctx, t, { tower: { name: 1, tag: 1 }, man: { x: 1000, dir: -1, walk: 2, shadow: 260 } }); ctx.setTransform(1, 0, 0, 1, 0, 0); F.title(ctx, t, 1); lab(ctx, 'S.leitbild · F.tower · F.ilya · F.title  (ANCHORS A1–A4 ONLY)'); });
await shot('02_callgrid', (ctx, t) => { night(ctx, t); const tiles = F.CALL_TILES(); tiles[1].speak = 1; tiles[3].dark = .6; tiles[3].fired = 1; F.callGrid(ctx, t, { x: 140, y: 120, w: 1640, h: 740 }, { date: F.SOURCES.call, tiles }); lab(ctx, 'F.callGrid (tiles: speak / dark / drop / back / fired)'); });
await shot('03_posts_ring', (ctx, t) => { night(ctx, t); for (let i = 0; i < 14; i++) F.postCard(ctx, 200 + (i % 5) * 140, 220 + Math.floor(i / 5) * 140, 220, { rot: (i % 3 - 1) * .06 }); F.ring(ctx, t, 1300, 420, 260, { think: 1 }); F.ring(ctx, t, 1600, 760, 90, { gap: 1 }); F.ring(ctx, t, 1050, 780, 80, { crumble: .5 }); lab(ctx, 'F.postCard · F.ring (think / gap / crumble / flat)'); });
await shot('04_marquee_transcript', (ctx, t) => { night(ctx, t); F.marquee(ctx, t, { x: 120, y: 140, w: 820, h: 400 }, { off: .35 }); F.transcript(ctx, t, { x: 1060, y: 110, w: 700, h: 760 }, { write: .8, hand: 1 }); lab(ctx, 'F.marquee (screen / board / off) · F.transcript (paper / write / hand)'); });
await shot('05_pages_line', (ctx, t) => { night(ctx, t); F.pages(ctx, t, { x: 180, y: 160, w: 420, h: 540 }, { n: 52, by: 1, profile: 1, count: 1 }); F.divider(ctx, t, 960, 120, 860, 1, { left: 'BEFORE', right: 'AFTER', lab: 1 }); F.pages(ctx, t, { x: 1250, y: 200, w: 360, h: 460 }, { n: 20, by: .6, lines: .5 }); lab(ctx, 'F.pages (n / by / profile / count) · F.divider'); });
await shot('06_jobs_lectern', (ctx, t) => { night(ctx, t); F.jobsGrid(ctx, t, { x: 100, y: 150, w: 900, h: 690 }, { you: 6, youStep: 1 }); F.lectern(ctx, t, 1450, 820, 320, { rings: 1 }); lab(ctx, 'F.jobsGrid (lit / you / youStep / only / dim) · F.lectern (spot / rings / rise)'); });
await shot('07_lifeline', (ctx, t) => { night(ctx, t); F.lifeLine(ctx, t, 200, 1560, 560, { years: S.RECORD.years, markers: [{ f: .17, n: 1, state: 'held', fill: 1, label: 'CAN A COMPUTER LEARN?' }, { f: .37, n: 2, state: 'held', fill: .6 }, { f: .66, n: 3, state: 'open', fill: 1 }, { f: .86, n: 4, state: 'open', fill: 1, box: '? YEARS', boxU: 1 }], knot: .7, knotF: .95 }); lab(ctx, 'F.lifeLine (markers held / open, box, knot, you, dawn)  NOT a ladder (#31)'); });
await shot('08_recipe_chat', (ctx, t) => { night(ctx, t); F.recipeCard(ctx, t, 120, 200, 800, { data: .45 }); F.chatWin(ctx, t, { x: 1040, y: 200, w: 760, h: 460 }, { answer: .7 }); lab(ctx, 'F.recipeCard (net / data) · F.chatWin (q / answer: YOUR question has the yellow edge)'); });
await shot('09_cards', (ctx, t) => { night(ctx, t); F.quoteCard(ctx, t, T, { x: 100, y: 130, w: 980, text: F.SOURCES.c4.text, credit: F.SOURCES.c4.credit, head: 'QUOTE', size: 46 }); F.dataCard(ctx, t, 1160, 130, 640, { kind: 'FORECAST', title: 'A MACHINE THAT LEARNS LIKE A HUMAN', big: '5–20 YEARS', small: 'PODCAST · NOV 2025' });
  F.paperCard(ctx, t, 1160, 470, 640, 330, { head: 'LAW FIRM REVIEW', lines: F.SOURCES.lawFirm.map((s) => [s, 23, 0, false]), src: 'for the new board' }); F.dateTag(ctx, 140, 800, F.SOURCES.call, 1); F.verdict(ctx, t, 760, 820, 'HELD', 1, {}); lab(ctx, 'F.quoteCard (C4) · F.dataCard · F.paperCard · F.dateTag · F.verdict'); });
await shot('10_clip_C2', (ctx, t) => { night(ctx, t); F.clipPlate(ctx, t, T, 'C2'); }, T.clip('C2').start + 3);
await shot('11_seam_plateHook', (ctx, t) => S.plateHook(ctx, t, T), T.G('So what was in those pages'));
await shot('12_seam_plateRecord', (ctx, t) => S.plateRecord(ctx, t, T), T.G('That is why this channel exists'));
await shot('13_end_screen', (ctx, t) => { S.endScreen(ctx, t, T); const R = S.END_TILES; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; for (const r of [R.left, R.right]) ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.beginPath(); ctx.arc(R.sub.x, R.sub.y, R.sub.r, 0, 7); ctx.stroke(); }, T.duration - 5);
