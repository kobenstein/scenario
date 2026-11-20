// Reference stills of the kit (MOTION.md §9): node tools/k0_stills.mjs <dir> [name,name]
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import * as K from '../lib/f10_kit.mjs';
import { filmFinish } from '../lib/print.mjs';
const dir = process.argv[2] || 'k0'; fs.mkdirSync(dir, { recursive: true });
await K.prepareKit();
const c = createCanvas(1920, 1080), x = c.getContext('2d');
const L = K.light(K.tod(20));
const shots = {
  valley: () => { const V = K.view3({ x: 20, y: 60, z: -40, yaw: .1, pitch: -.16, f: 1700 }); K.valley(x, 20, V, L, { hallFn: K.hall }); },
  road: () => { const V = K.view3({ x: -120, y: 1.5, z: 84, yaw: -.15, pitch: -.02, f: 1700 }); K.valley(x, 20, V, L, { hallFn: K.hall }); },
  hallOut: () => { const V = K.view3({ x: -6.5, y: 5, z: 190, yaw: 0, pitch: -.02, f: 1700 }); K.valley(x, 20, V, L, { hallFn: K.hall }); },
  hallIn: () => { const V = K.view3({ x: 0, y: 5.5, z: 216, yaw: 0, pitch: -.2, f: 1500 }); K.valley(x, 20, V, L, { hallFn: (cx, t, V2, L2) => K.hall(cx, t, V2, L2, { station: (i) => ({ halo: 1, robotLift: (i % 3) / 2 }) }) }); },
  figs: () => {
    x.fillStyle = '#e8e2d4'; x.fillRect(0, 0, 1920, 1080);
    K.robot(x, 300, 560, 2.2, {}, { L, t: 3, bib: '053' }); K.robot(x, 700, 560, 2.2, K.RPOSE.armsUp, { L, t: 3 }); K.robot(x, 1050, 640, 2.2, K.RPOSE.sitSlump, { L, t: 3 });
    K.person10(x, 3, 'you', 1350, 560, 2.2, {}, { L }); K.person10(x, 3, 'trainer', 1650, 560, 2.2, {}, { L, headset: 'up' });
    K.cup(x, 1700, 1000, 1.2, { L });
    K.robotHand(x, 200, 950, 1.2, { L, ang: 0, curl: .3 }); K.humanHand(x, 700, 950, 1.2, { L, pose: 'open' });
  },
  guide: () => { x.fillStyle = '#e8e2d4'; x.fillRect(0, 0, 1920, 1080); K.guide(x, 3, { x: 960, y: 620, s: 1.6, L, u: 1 }); },
};
for (const [name, fn] of Object.entries(shots)) {
  if (process.argv[3] && !process.argv[3].split(',').includes(name)) continue;
  const t0 = Date.now(); x.save(); fn(); x.restore(); const t1 = Date.now();
  filmFinish(x, 20, { vig: .16 });
  fs.writeFileSync(`${dir}/${name}.jpg`, await c.encode('jpeg', 80)); console.log(name, t1 - t0, 'ms');
}
