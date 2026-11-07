// c05 · Exit 1 · day 48 · the tariff crash · T.G('Day forty-eight') → T.G('But what if the fall') · builder B1 · shots.md 5.01–5.07.
// The picture lives in lib/f19_b1_road.mjs (one draw function for c05 + c06, so the c05|c06 seam is the same picture on both sides):
// 5.01 the glide over the table edge lands on the road; you walk, the sign DAY 48 comes to you · 5.02★ its face opens as the exit window
// (containers topple wave after wave, the 2025 line falls) · 5.03 the bottom turns gold · 5.04 ON HOLD · 5.05 the best day ·
// 5.06 the window folds back, the sign passes you · 5.065 a lit rect in the mist grows into the Fed stage · 5.066 Warsh (C1b) ·
// 5.07 you keep walking, gore 1 glows once.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { roadScene } from '../lib/f19_b1_road.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: roadScene(T), print: F.PRINT19 }]; };
