// c03 · Water: 200 million hours, the pipe arrives, zero at home (s04) · 63.48–95.68 · Editorial-Nacht · builder B1
// 63.48 → LINE_T: the end of the city world (lib/f13_b1_city.mjs, the same function as in c02); then lib/f13_b1_water.mjs (plan table
// there), which c04 continues with the same global t.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import { makeCity } from '../lib/f13_b1_city.mjs';
import { makeWater } from '../lib/f13_b1_water.mjs';
export default async (T, R) => {
  E.prepareEditorial();
  const city = makeCity(T), water = makeWater(T);
  return [{ t: R.a, draw: (ctx, t) => (t < city.LINE_T ? city.draw(ctx, t) : water.draw(ctx, t)), print: K.PRINT13 }];
};
