// Explainer test stills in the editorial look (one idea each) + the icon set. node tools/editorial_expl.mjs <outdir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
const { W, H, P } = E;
const c = createCanvas(W, H), x = c.getContext('2d'), out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
const bg = (cx = 960, cy = 520) => { x.setTransform(1, 0, 0, 1, 0, 0); E.nightSky(x, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); x.fillStyle = E.rad(x, cx, cy, 1100, [[0, E.rgba(P.blue0, .7)], [.5, E.rgba(P.blue0, .2)], [1, E.rgba(P.blue0, 0)]]); x.fillRect(0, 0, W, H); E.stars(x, 4, 90, 2, [0, 0, W, H], .5); };
const save = async (n) => { E.finish(x, 3); fs.writeFileSync(`${out}/${n}.jpg`, await c.encode('jpeg', 90)); };
// E1 compare: who the robots learn from (warm) vs who owns them (cool)
bg(); E.compare(x, 2, { x: 960, y: 430, r: 270, left: { value: '9 in 10', label: 'learned from people' }, right: { value: '3', label: 'companies own it' } });
E.du(x, 700, 1000, 120, { pose: 'look', light: 1 }); await save('E1_compare');
// E2 flow: your hand → the recording → the robot → the money
bg(960, 560); E.flow(x, 2, { nodes: [{ x: 300, y: 520, icon: 'hand', label: 'your move' }, { x: 760, y: 520, icon: 'cup', label: 'recorded' }, { x: 1200, y: 520, icon: 'robot', label: 'copied', lit: 0 }, { x: 1640, y: 520, icon: 'coin', label: 'paid to whom?', lit: 0 }], u: .82 });
await save('E2_flow');
// E3 bars + counter: thirteen thousand last year → a billion
bg(760, 700); E.bars(x, 2, { x: 300, y: 880, w: 760, h: 520, values: [1.3, 3, 8, 20, 45], lit: [1, 1, 1, 0, 0], labels: ['2025', '2030', '2035', '2040', '2045'], top: ['13k', '', '', '', ''] });
E.counter(x, 2, { x: 1450, y: 520, to: 1000000000, size: 120, label: 'robots by 2050' }); await save('E3_bars');
// icon set
bg(); E.ICONS.forEach((n, i) => E.icon(x, n, 220 + (i % 5) * 370, 330 + Math.floor(i / 5) * 400, 170, 2, { lit: i % 3 === 2 ? 0 : 1, label: n, u: n === 'battery' ? .6 : undefined }));
await save('E4_icons');
