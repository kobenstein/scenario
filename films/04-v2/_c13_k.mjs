import { canvas } from './engine.mjs';
import { timing } from './lib/kit.mjs';
import { TIMING } from './film.mjs';
import { anchors } from './scenes/sc13.mjs';
import { valleyTake, warmValley } from './lib/v2_c13_valley.mjs';
import { samplePivot, warmKitchen } from './lib/v2_c13_kitchen.mjs';
const T = timing(TIMING); const K = anchors(T);
if (!process.env.NOPIV) { warmKitchen(); samplePivot(K); } warmValley(K);
console.log('piv', K.piv.toFixed(2), 'reason', K.reason.toFixed(2), 'a1', K.a1.toFixed(2));
const [c, g] = canvas();
for (const t of (process.argv[2] || '386').split(',').map(Number)) { const t0 = performance.now(); g.save(); valleyTake(g, t, K); g.restore(); console.log('ok', t, Math.round(performance.now() - t0) + 'ms'); }
