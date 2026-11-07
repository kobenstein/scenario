// c02 · The clock (picture lead). Same continuous take as c01 (lib/f19_lead.mjs), so the c01 | c02 cut is identical by construction.
// Ends on the Lead → B1 seam plate (plateBubble) at T.G('Mostly, data centers').
import { makeLead } from '../lib/f19_lead.mjs';
import { PRINT19 } from '../lib/f19_kit.mjs';
export default async (T, R) => [{ t: R.a, draw: makeLead(T), print: PRINT19 }];
