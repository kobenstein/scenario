// Kit stills for Film 19 (lib/f19_kit.mjs + f19_props.mjs): node tools/kit_sheet19.mjs <dir>
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as PR from '../lib/f19_props.mjs';
import { timing } from '../lib/kit.mjs';
import { TIMING } from '../film.mjs';
E.prepareEditorial();
const T = timing(TIMING);
const dir = process.argv[2] || '.'; fs.mkdirSync(dir, { recursive: true });
const frames = {
  road: (ctx, t) => {
    const rc = F.roadCam({ z: 300 });
    F.road(ctx, t, rc, {});
    F.exitSign(ctx, t, rc, 620, 4200, { day: 48, name: 'THE TARIFF CRASH', year: 2025, glyph: 'container', lit: .4 });
    F.goalSign(ctx, t, rc, -900, 14000, {});
    F.rStand(ctx, rc, 120, 1500, () => { E.du(ctx, 0, 0, 230, { dir: 1, walk: t * 5.5 }); F.umbrella(ctx, t, 30, -250, 120, { open: 1, lit: [1, 1, 1, 1, 1] }); });
    F.hudDay(ctx, t, T); F.hudUmbrella(ctx, t, T, { lit: [1, 1, 0, 0, 0] });
  },
  route: (ctx, t) => {
    F.nightGround(ctx, t, { hy: 1080, hills: 0 });
    F.routeMap(ctx, t, { u: 1, stops: [1, 1, 1, 1], names: [1, 1, 1, 1], dot: 30, run: 30, end: 1, dotLabel: 'TODAY · DAY 30' });
    F.hudDay(ctx, t, T, { value: 30.4 }); F.hudUmbrella(ctx, t, T, { lit: [0, 0, 0, 0, 0] });
  },
  loss: (ctx, t) => {
    F.nightGround(ctx, t, { hy: 1080, hills: 0 });
    const keys = ['tariff', 'rate', 'gfc', 'dotcom'];
    keys.forEach((k, i) => { const r = { x: 120 + i * 440, y: 300, w: 360, h: 420 }; F.lossLine(ctx, t, r, k, 1, { gold: 1, back: k === 'dotcom' ? 1 : undefined }); E.glowText(ctx, `${F.SPX[k].pct} %`, r.x, 260, { size: 34 }); });
    F.redArrow(ctx, t, [[1300, -20], [1380, 120], [1340, 150], [1460, 300]], 1, {});
    F.shards(ctx, t, 1460, 300, t - .4, {});
    F.flap(ctx, t, 300, 860, 90, { value: 281.5 });
  },
  umbrella: (ctx, t) => {
    F.nightGround(ctx, t, { hy: 900 });
    F.umbrella(ctx, t, 560, 520, 260, { open: 1, lit: [1, 1, 1, 1, 1], flare: [{ x: .4, t0: t - .3 }] });
    F.umbrella(ctx, t, 1320, 520, 260, { open: 1, lit: [1, 0, 0, 0, 0], outline: 1, wide5: .6 });
    for (let i = 0; i < 5; i++) F.goreIcon(ctx, i, 260 + i * 330, 880, .9, {});
    F.titleText(ctx, 'WHAT PROTECTS YOU', 80, 200, 150, {});
  },
  bubble: (ctx, t) => {
    F.nightGround(ctx, t, { hy: 900 });
    F.bubble(ctx, t, 600, 500, 330, { tremble: .5 });
    F.bubble(ctx, t, 1400, 500, 260, { pop: .35 });
    F.dots100(ctx, t, { x: 1150, y: 780, gap: 26, r: 6, lit: (i) => (i < 60 ? 1 : 0) });
  },
  props: (ctx, t) => {
    F.nightGround(ctx, t, { hy: 1080, hills: 0 });
    PR.table(ctx, t, 960, 760, 1500, {});
    PR.payslip(ctx, t, 420, 400, 420, { tilt: -.05, red: [0, .7], net: .5 });
    PR.phone(ctx, t, 900, 560, 260, { face: 1, screen: (c, r) => E.glowText(c, '−4.4 %', r.x + r.w / 2, r.y + r.h / 2, { size: 30, align: 'center', col: F.RED.hot, glow: false }) });
    PR.envelope(ctx, t, 1180, 380, 220, { open: .3 }); PR.magnifier(ctx, t, 1500, 300, 60, {});
    PR.mailbox(ctx, t, 1700, 900, 300, { flag: 1, lit: .5 }); PR.calendarLeaf(ctx, t, 200, 900, 150, {}); PR.iouSlip(ctx, t, 700, 250, 200, {});
    PR.button(ctx, t, 1200, 640, 260, { text: 'DO SOMETHING' });
  },
  under: (ctx, t) => { F.underRoad(ctx, t, {}); F.pillar(ctx, t, 500, 150, 1080, 120, { label: 'BLACK MONDAY', sub: '1987', lit: 1 }); F.netSpan(ctx, t, [500, 600], [1500, 600], { lit: 1, catch: { u: .5, depth: 90 } }); },
};
for (const [n, f] of Object.entries(frames)) {
  const c = createCanvas(1920, 1080), ctx = c.getContext('2d'); f(ctx, 100); E.finish(ctx, 100, F.PRINT19);
  fs.writeFileSync(`${dir}/kit_${n}.jpg`, await c.encode('jpeg', 80)); console.log(n);
}
