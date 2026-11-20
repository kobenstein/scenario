// c12 · B3 · Step 5 · the money: out of plateLine(5) · the copy of pole 5 slides off · the counter window: her savings, the transfer path, the teller · her note TRUSTED CONTACT · ★ the gold arc bank → your phone · two counter windows BROKER / BANK
// The whole B3 group (c12–c16) is ONE continuous take drawn by lib/f65_b3_scene.mjs: every chunk returns the same draw function, so the
// inner boundaries match frame for frame. Plan: docs/shots.md · world: docs/MOTION.md · seam B2 → B3: plateLine(5) at 'Then one step is left'.
import * as F from '../lib/f65_kit.mjs';
import { b3Scene } from '../lib/f65_b3_scene.mjs';

export default async (T, R) => [{ t: R.a, draw: b3Scene(T), print: F.PRINT65 }];
