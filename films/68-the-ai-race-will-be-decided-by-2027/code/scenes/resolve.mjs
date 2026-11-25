// resolve the plan against the VO timing: shot start a (lead before the phrase), phrase time t0, end b (= next shot's a)
import { PLAN } from './plan.mjs';
export function resolve(T) {
  const out = []; let after = -1;
  for (const p of PLAN) {
    let a, t0;
    if (p.clip) { const c = T.clip(p.clip); t0 = c.start; a = c.start - .6; after = c.end; }
    else if (!out.length) { t0 = T.G(p.from); a = 0; after = t0; }
    else { t0 = T.G(p.from, p.nth ?? 0, after); a = t0 - (p.lead ?? .35); after = t0 + .01; }
    out.push({ ...p, a, t0 });
  }
  // a shot after a clip starts when the clip ends (plate shrinks back)
  for (let i = 1; i < out.length; i++) if (out[i - 1].clip) out[i].a = Math.max(out[i].a, T.clip(out[i - 1].clip).end + .25);
  out.forEach((s, i) => { s.b = i + 1 < out.length ? out[i + 1].a : T.duration; s.seed = i * 7 + 3; });
  return out;
}
