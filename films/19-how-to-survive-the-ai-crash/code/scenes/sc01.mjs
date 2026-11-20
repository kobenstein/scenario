// c01 · Hook (picture lead). One continuous take with c02: lib/f19_lead.mjs.
import { makeLead } from '../lib/f19_lead.mjs';
import { PRINT19 } from '../lib/f19_kit.mjs';
export default async (T, R) => [{ t: 0, draw: makeLead(T), print: PRINT19 }];
