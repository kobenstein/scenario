// c03 · B1 take (1.01–M.02) · one shared draw for c02–c05 (lib/f54_b1_scene.mjs), so inner chunk boundaries match frame for frame.
import * as F from '../lib/f54_kit.mjs';
import { b1Scene } from '../lib/f54_b1_scene.mjs';
export default async (T, R) => [{ t: R.a, draw: b1Scene(T), print: F.PRINT54 }];
