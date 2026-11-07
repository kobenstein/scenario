// c06 · It reaches you without shares · protection 2: know what you own · T.G('But what if the fall') → T.G('And if the fall keeps going')
// builder B1 · shots.md 6.01–6.08. The picture lives in lib/f19_b1_road.mjs (shared with c05, same draw function):
// 6.01 the red line runs on along the verge; you turn off the road toward the town, the camera trucks with you · 6.02 the line creeps
// past the bus stop, the shop, the office door · 6.03 it stops at your mailbox, you look down · 6.04 your pension statement slides out,
// its rows become company dots · 6.05★ the dots gather into a globe, two chip dots glow, the ring fills a sixth · 6.06 the magnifier
// flies into gore 2 · 6.07 your phone: the fund's top holdings · 6.08 you lower it; the red line runs into the payslip in the flap;
// tilt up and push: plateLine (B1 → B2).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { roadScene } from '../lib/f19_b1_road.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: roadScene(T), print: F.PRINT19 }]; };
