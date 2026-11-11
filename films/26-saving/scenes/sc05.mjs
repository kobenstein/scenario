import * as F from '../lib/f26_kit.mjs';
import { b2Scene } from '../lib/f26_b2_scene.mjs';
export default async (T, R) => [{ t: R.a, draw: b2Scene(T), print: F.PRINT26 }];
