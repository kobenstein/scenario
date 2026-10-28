// c06 · Station 3 (s11–s13) · shots 6.01–6.13: the rhyme plan (grab it → rabbit / habit / green), the microscope, the lab window.
// Same plan sequence as c05 (lib/f14_b2_world.mjs). Ends on the lead's plate plateWindow at T.seg('s14').start (B2 → B3).
import * as E from '../lib/f10_editorial.mjs';
import { b2, b2Anchors, PRINT } from '../lib/f14_b2_world.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b2(b2Anchors(T)), print: PRINT }]; };
