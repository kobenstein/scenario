// Film 79 · kit gallery: renders one still per kit element (text-independent world) into $OUT (default /tmp/claude-0/f79/kit/), then
// tools/kit79.mjs --sheet builds a contact sheet. usage: node tools/kit79.mjs [name,name…]   (names: see PLATES)
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { W, H } from '../engine.mjs';
import { finish } from '../lib/f10_editorial.mjs';
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import * as X from '../lib/f79_expl.mjs';
const OUT = (process.env.OUT || '/tmp/claude-0/f79/kit/').replace(/\/?$/, '/'); fs.mkdirSync(OUT, { recursive: true });
const { cam3, aim } = K;
export const PLATES = {
  street_dawn: (c, t) => S.street(c, t, cam3({ z: -300, y: -20 }), K.hourLook(8.2), { youNear: [150, 800, 200], pods: [{ x: 1150, y: 1000, s: .9, dir: -1 }] }),
  street_noon_dc: (c, t) => S.street(c, t, cam3({ z: -200, x: 120 }), K.hourLook(12), { dc: 1, pods: [{ x: 900, y: 990, dir: 1 }, { x: 1500, y: 1010, dir: -1 }] }),
  dc_build_day4: (c, t) => S.street(c, t, cam3({ z: 300, x: 260, y: -40 }), K.hourLook(9.5), { dc: .45 }),
  tower_fence: (c, t) => PL.towerPlace(c, t, cam3({ z: -100 }), K.hourLook(8.4), { you: [700, 1010, 150] }),
  kitchen_dark: (c, t) => S.kitchen(c, t, cam3({ z: -60, x: 60 }), K.hourLook(10), { dark: .85, lamp: 0, meter: 'SCHEDULED', boyX: 640, boyPose: 'stand', you: [1480, 1070, 560] }),
  phone_noon: (c, t) => PL.phoneNoon(c, t, cam3({ z: -40 }), K.hourLook(12), { u: 1, chime: 1 }),
  boy_screen: (c, t) => PL.boyScreen(c, t, cam3({ z: -60 }), K.hourLook(13), {}),
  school_locked: (c, t) => PL.school(c, t, cam3({ z: -120 }), K.hourLook(13.5), { you: [620, 1010, 210], boy: [760, 1012, 150] }),
  land_halls: (c, t) => PL.land(c, t, cam3({ z: -100 }), K.hourLook(16.5), { you: [540, 1000, 120] }),
  square_empty: (c, t) => PL.square(c, t, cam3({ z: -160 }), K.hourLook(19.4), { you: [960, 980, 140], friends: 1, people: 0, dry: 1, shut: 1, benches: 1 }),
  bench_clock: (c, t) => PL.bench(c, t, cam3({ z: -80 }), K.hourLook(19.9), { clock: 1, lean: .5 }),
  endscreen_wind: (c, t) => PL.endWind(c, t, cam3({ z: 0 }), K.hourLook(21), { wind: .5, end: 1, guides: true }),
  expl_need_then: (c, t) => X.need(c, t, { phase: 0, u: 1 }),
  expl_need_now: (c, t) => X.need(c, t, { phase: 1, u: 1 }),
  expl_laborshare: (c, t) => X.laborShare(c, t, { u: 1 }),
  expl_pjm: (c, t) => X.pjm(c, t, { u: 1 }),
};
const want = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2].split(',') : Object.keys(PLATES);
const cv = createCanvas(W, H), ctx = cv.getContext('2d'), small = createCanvas(960, 540), sx = small.getContext('2d');
for (const k of want) {
  const t = 12.3; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#060a24'; ctx.fillRect(0, 0, W, H);
  try { PLATES[k](ctx, t); } catch (e) { console.error(k, e.message); continue; }
  finish(ctx, t, K.PRINT79);
  fs.writeFileSync(OUT + k + '.jpg', await cv.encode('jpeg', 88));
  sx.drawImage(cv, 0, 0, 960, 540); fs.writeFileSync(OUT + 's_' + k + '.jpg', await small.encode('jpeg', 85));
  console.log(OUT + k + '.jpg');
}
