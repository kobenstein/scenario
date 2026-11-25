// c06 · builder B2 · one continuous take with c06–c09: the whole picture lives in lib/b2_take.mjs (shot table there), so the inner
// chunk boundaries of the group are the same frame on both sides by construction. This file only hands the take to the film.
import { entries } from '../lib/b2_take.mjs';
export default async (T, R) => entries(T, R);
