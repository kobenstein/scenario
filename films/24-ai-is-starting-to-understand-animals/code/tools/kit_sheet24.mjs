// Stills of the Film 24 kit (lib/f24_kit.mjs) and the seam plates (lib/f24_seams.mjs), through the editorial finish:
//   node tools/kit_sheet24.mjs <dir> [t]
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import '../engine.mjs';
import { finish, prepareEditorial, P } from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import * as S from '../lib/f24_seams.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
prepareEditorial();
const T = timing(TIMING);
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
const t = Number(process.argv[3] || 3.3);
const save = async (c, n) => { const f = `${dir}/${n}.jpg`; fs.writeFileSync(f, await c.encode('jpeg', 85)); console.log(f); };
const sheet = () => { const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); ctx.fillStyle = P.night1; ctx.fillRect(0, 0, 1920, 1080); return [c, ctx]; };
{ // animals
  const [c, ctx] = sheet();
  F.pig(ctx, t, 330, 360, 190, { light: 1, warm: .8 }); F.pig(ctx, t + 1, 960, 360, 190, { dir: -1, light: -1, warm: .4, open: .8, head: .5 });
  F.elephant(ctx, t, 1500, 380, 230, { warm: .6, ears: .5 }); F.elephant(ctx, t, 1800, 380, 120, { calf: true, warm: .6 });
  F.spermWhale(ctx, t, 330, 600, 90, {}); F.humpback(ctx, t, 960, 600, 90, {}); F.dolphin(ctx, t, 1550, 600, 90, {});
  F.dog(ctx, t, 200, 960, 160, { warm: .6 }); F.dog(ctx, t, 480, 960, 160, { sit: true, warm: .6, tilt: .6 }); F.dog(ctx, t, 760, 960, 130, { lie: true, warm: .6 });
  F.crow(ctx, t, 1020, 960, 150, { tag: true, warm: .5 }); F.crow(ctx, t, 1230, 900, 130, { fly: t * 6 }); F.finch(ctx, t, 1430, 960, 120, {}); F.frog(ctx, t, 1640, 960, 120, { open: .8 });
  ['pig', 'elephant', 'spermWhale', 'humpback', 'dolphin', 'dog', 'crow', 'finch', 'frog'].forEach((k, i) => { const x = 140 + i * 70, y = 60; ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(x, y, 26, 0, 7); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(x, y, 25, 0, 7); ctx.clip(); F.icon(ctx, k, x, y, 24, { col: i % 2 ? 'gold' : 'cream', t }); ctx.restore(); });
  finish(ctx, t, F.PRINT24); await save(c, 'kit_animals');
}
{ // graphics
  const [c, ctx] = sheet();
  F.CALL_KINDS.forEach((k, i) => { F.wave(ctx, t, 220 + (i % 4) * 420, 110 + Math.floor(i / 4) * 130, 360, 100, k, { col: i % 2 ? 'gold' : 'cream', u: i === 0 ? .7 : 1, gap: i === 3 ? [.4, .6] : null }); ctx.fillStyle = P.halo2; ctx.font = '600 16px Inter'; ctx.fillText(k, 40 + (i % 4) * 420, 70 + Math.floor(i / 4) * 130); });
  F.idCard(ctx, t, 80, 480, { name: 'PIG 1', sub: 'FARM · EUROPE', animal: 'pig', q: true });
  F.idCard(ctx, t, 380, 480, { name: 'PIG 2', sub: 'FARM · EUROPE', animal: 'pig', feel: -1, feelWord: 'NOT FINE' });
  F.idCard(ctx, t, 680, 480, { name: 'AFRICAN ELEPHANT', sub: 'AMBOSELI · KENYA', animal: 'elephant', col: 'gold' });
  F.listener(ctx, t, 1300, 560, 120, { drink: .6 }); F.listener(ctx, t, 1700, 560, 80, { col: 'cream', blind: 1 });
  F.transBar(ctx, t, 500, 760, {}); F.transBar(ctx, t, 1150, 760, { text: 'time to go', typed: 1, stamp: 'SCENARIO' });
  F.tablet(ctx, t, T, 1440, 900, .5, { filled: ['names', 'room', 'feel'], at: { names: 0, room: 0, feel: 0 } });
  F.tick(ctx, 100, 900, 22, 1); F.tick(ctx, 160, 900, 22, 1, 'cream');
  F.strip(ctx, 60, T, {}); F.strip(ctx, 60, T, { big: 1, at: [560, 960], w: 820, s: 1.4, todayLabel: 'TODAY · NOV 2026' });
  finish(ctx, t, F.PRINT24); await save(c, 'kit_graphics');
}
{ // the map (world + every species) and a close view
  for (const [n, v, tt] of [['map_world', F.mapView(-20, 22, 1.15), 40], ['map_ca', S.CA_VIEW, 47], ['map_africa', S.NORTH_VIEW, 220]]) {
    const c = createCanvas(1920, 1080), ctx = c.getContext('2d');
    F.map(ctx, tt, v, { calls: n === 'map_world' ? 1 : .35 }); F.pins(ctx, tt, T, v, {}); F.strip(ctx, tt, T, {});
    finish(ctx, tt, F.PRINT24); await save(c, n);
  }
}
{ // the barn
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d');
  const cam = F.cam3();
  F.barn(ctx, cam, t, {});
  F.card(ctx, cam, F.F0, () => { const B = F.BARN; F.pig(ctx, t, B.pig1.x, B.ground, B.pig1.h, { dir: 1, light: 1, warm: .85 }); F.pig(ctx, t + 2, B.pig2.x, B.ground, B.pig2.h, { dir: -1, light: -1, warm: .7, seed: 3 }); F.du(ctx, B.you.x, B.ground + 30, B.you.h, { dir: 1, view: 'side', light: 1, armR: [1.55, 1.9] }); });
  finish(ctx, t, F.PRINT24); await save(c, 'barn');
}
for (const [n, f, tt] of [['plate_ca', S.plateCalifornia, 47.5], ['plate_north', S.plateNorth, 219.4], ['plate_barn', S.plateBarn, 416.4]]) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, tt, T); finish(ctx, tt, F.PRINT24); await save(c, n);
}
