// c02 · Hook II (23.98 – 44.40), lead · the same one-take function as c01 (scenes/sc01.mjs): inside the first compartment
// (the vaccine for one person, −42 %), the next compartment (approved: 0), through the hole of the 0 into plateCell → B1.
import * as E from '../lib/f10_editorial.mjs';
import { hook, PRINT } from './sc01.mjs';

export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: hook(T), print: PRINT }]; };
