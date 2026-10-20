import { canvas } from './engine.mjs';
import { timing } from './lib/kit.mjs';
import { TIMING } from './film.mjs';
import { anchors } from './scenes/sc13.mjs';
import { kitchenCam, kitchenTake } from './lib/v2_c13_kitchen.mjs';
const T = timing(TIMING); const K = anchors(T);
console.log('cut', K.cut, 'piv', K.piv, JSON.stringify(K.k));
for (const t of [380.31, 380.45, 380.7, 381.05]) console.log(t, JSON.stringify(kitchenCam(t, K)));
const [c, g] = canvas();
for (const t of (process.argv[2] || '380.31').split(',').map(Number)) { console.log('draw', t); g.save(); kitchenTake(g, t, K); g.restore(); console.log('ok', t); }
