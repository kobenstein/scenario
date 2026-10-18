// Render single frames of one scene for look tests.  node tools/frames.mjs <module> <export> <dur> <outdir> t1,t2,...
import fs from 'node:fs';
import { canvas, grain } from '../engine.mjs';
const [mod, name, dur, out, ts] = process.argv.slice(2);
const M = await import('../' + mod); const draw = M[name]();
fs.mkdirSync(out, { recursive: true });
const [cv, ctx] = canvas();
for (const t of ts.split(',').map(Number)) {
  draw(ctx, t, { a: 0, b: +dur }); grain(ctx, t, .05);
  const f = `${out}/${name}_${t.toFixed(1)}.jpg`; fs.writeFileSync(f, await cv.encode('jpeg', 85)); console.log(f);
}
