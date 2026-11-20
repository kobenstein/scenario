// c12 · B3 · the same one-take function as c12–c14 (lib/f15_b3.mjs): the deal → you in the street → the box, the verdict, the end screen.
import * as E from '../lib/f10_editorial.mjs';
import { b3, PRINT } from '../lib/f15_b3.mjs';

export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b3(T), print: PRINT }]; };
