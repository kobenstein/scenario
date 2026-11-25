// c09 · B2 · built as part of ONE continuous take with c06–c09 (lib/b2_take.mjs); this file cuts the take at its phrase range.
// Shot table: docs/shots.md (rows of c09); layers and the ★ as there. See lib/b2_take.mjs for every picture, sentence by sentence.
import { chunk } from '../lib/b2_take.mjs';
export default async (T, R) => chunk(T, R);
