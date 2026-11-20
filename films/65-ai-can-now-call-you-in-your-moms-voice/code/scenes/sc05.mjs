// c05 · B1 · part of ONE continuous take c02–c06 ('The first step is the voice' → 'The third step is a face'): lib/f65_b1_take.mjs draws it,
// so the inner boundaries between c02 … c06 match frame for frame. Shots: docs/shots.md (B1) · seams: plateLine(1) in, plateLine(3) out.
import * as F from '../lib/f65_kit.mjs';
import { b1Take } from '../lib/f65_b1_take.mjs';

export const PRINT = F.PRINT65;
export default async (T, R) => [{ t: R.a, draw: b1Take(T), print: PRINT }];
