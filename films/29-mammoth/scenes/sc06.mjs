// c06 · builder B1 · one continuous take with c02–c06 (lib/f29_b1_core.mjs draws the whole group; this file owns [R.a, R.b)).
// Plan: docs/shots.md (c06) · the seams: plateFence in at 'The mice belong' (c02), plateDodo out at 'Then it turned to the dodo' (c06).
import * as F from '../lib/f29_kit.mjs';
import * as E from '../lib/f10_editorial.mjs';
import { b1 } from '../lib/f29_b1_core.mjs';

export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b1(T).draw, print: F.PRINT29 }]; };
