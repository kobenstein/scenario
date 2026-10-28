// Film 15 · B3 (c12–c14 + end screen, 380.30 – 524.94) · shared base: word anchors, a card()/project() that can be nested
// inside a portal (BASE transform), and the small film-15 things B3 needs that are not in the kit (bracket of light, gate of
// light, contract paper, indigo hands, a sky). Builder module of B3: lib/f15_b3_*.mjs. Kit stays untouched.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, expoOut, lin, rad, halo, glowFill } = E;

// ------------------------------------------------------------------------------------------------ anchors (words only)
export function anchors(T) {
  const last = (seg, ph, n) => { const ws = T.W(seg, ph, ph); return ws[ws.length - 1].s; };
  const A = (w, n) => T.S('s12', w, n), B = (w, n) => T.S('s13', w, n), C = (w, n) => T.S('s14', w, n), D = (w, n) => T.S('s15', w, n);
  const a = {
    T0: T.seg('s12').start, cheaper: A('cheaper'), copies: last('s12', 'cheaper copies'), forty: A('forty'), person: last('s12', 'a person'), year: last('s12', 'per year'),
    maker: A('The maker licensed'), licensed: last('s12', 'maker licensed'), producers: A('producers'), funders: A('funders'), locked: A('locked'), advance: A('advance'),
    perfect: A('perfect'), cheap: A('The cheap copies'), arrive: A('arrive'), year2: last('s12', 'than a year'), after: last('s12', 'year after'), shots: last('s12', 'first shots'),
    worked: A('only worked'), agreed: last('s12', 'maker agreed'), same: A('The same deal'), deal: last('s12', 'same deal'), medicines: last('s12', 'first medicines'),
    discovered: A('discovered'), artif: A('artificial'), license: last('s12', 'A license'), price: last('s12', 'and a price'), agreed2: A('agreed before'),
    before: A('before approval'), approval: last('s12', 'before approval'), notyears: A('Not years'), after2: last('s12', 'years after'),
    drug: A('Drug makers'), governments: A('governments'), funders2: A('funders', 1), sign: A('sign it'), nobody: A('Nobody'), lose: A('lose'),
    agree: A('agree early'), early: last('s12', 'agree early'), picture: A('Picture'), approved: A('approved medicine'), medicine: last('s12', 'approved medicine'),
    artif2: A('artificial', 1), signed: last('s12', 'already signed'), poorer: A('poorer'), back: A('back of the line'), line: last('s12', 'back of the line'),
    cure: A('The cure'), journey: A('journey'), everyone: A('everyone'), pay: A('pay'),
    T1: T.seg('s13').start, you: last('s13', 'And you'), closer: B('closer'), labcoat: B('lab coat'), coat: last('s13', 'lab coat'), hep: B('Hepatitis'),
    cureworks: B('A cure only'), finds: B('finds you'), test: last('s13', 'a test'), off: last('s13', 'putting off'), book: B('book it'),
    invited: B('invited'), trial: last('s13', 'clinical trial'), consider: B('consider'), slowest: B('slowest'), toofew: B('too few'), signup: last('s13', 'people sign up'),
    every: B('Every volunteer'), volunteer: B('volunteer'), faster: B('faster'),
    public: B('public money'), money: last('s13', 'public money'), fair: B('fair price'), start: last('s13', 'from the start'), hiv: B('HIV'), locked2: B('locked in early'),
    radical: B('radical'), oneline: B('one line'), contract: B('contract'), tell: B('Tell'), vote: B('vote'), there: last('s13', 'want it there'),
    T2: T.seg('s14').start, starting: C('starting'), tools: C('tools'), yes: C('yes'), medicines2: C('medicines'), halfway: C('halfway'), longer: C('longer'),
    notyet: C('not yet'), cures: C('some cures'), already: C('already'), reached: C('reached'), people: last('s14', 'most people'),
    machines: C('machines'), bring: C('bring'), century: C('century'), carrying: C('Carrying'), everyone2: C('everyone'), ourpart: C('our part'), part: last('s14', 'our part'),
    T3: T.seg('s15').start, compartment: D('compartment'), first: last('s15', 'up first'), carry: D('carry'), lastw: last('s15', 'reached last'), subscribe: D('subscribe'),
    we: D('We won'), arrive2: D('arrive'), notice: D('notice'), stopped: D('stopped'),
    vEnd: T.seg('s15').end, END: T.duration,
  };
  return a;
}

// ------------------------------------------------------------------------------------------------ the stage, nestable
// BASE maps the normal frame into a rectangle of the frame (a portal): screen = BASE.x + BASE.q * frame. Default: identity.
export const BASE = { q: 1, x: 0, y: 0 };
export function card(ctx, c, Z, fn) {
  const m = E.cardM(c, Z); if (!m) return false;
  const k = BASE.q * m.k;
  ctx.save(); ctx.setTransform(k, 0, 0, k, BASE.x + BASE.q * m.e, BASE.y + BASE.q * m.f); fn(k); ctx.restore(); return true;
}
export function project(c, Z, u, v) { const m = E.cardM(c, Z); return m ? [BASE.x + BASE.q * (m.e + u * m.k), BASE.y + BASE.q * (m.f + v * m.k), BASE.q * m.k] : null; }
// camera that shows design point (u, v) of the focus card centred at (sx, sy) with scale s (log-friendly), focal length raised for big s
export const look = (u, v, s, sx = 960, sy = 540) => E.aim(E.F0, u, v, s, sx, sy, Math.max(E.F0, 80 * s));
// log-interpolated framing keys: [[t, u, v, s, ease]] → camera (centre u,v of the focus card, scale s); ease of the piece ending at the key
const EASE = { s: E.sineIO, q: E.quartIO, i: E.expoIn, o: E.expoOut, l: (x) => clamp(x) };
export function frameAt(t, K) {
  if (t <= K[0][0]) return K[0].slice(1, 4);
  if (t >= K[K.length - 1][0]) return K[K.length - 1].slice(1, 4);
  let i = 0; while (t > K[i + 1][0]) i++;
  const A = K[i], Bk = K[i + 1], e = (EASE[Bk[4] || 's'])((t - A[0]) / (Bk[0] - A[0]));
  const s = Math.exp(lerp(Math.log(A[3]), Math.log(Bk[3]), e));
  // the centre moves in screen terms (so a zoom with a pan feels even): interpolate centre / scale-weighted
  return [lerp(A[1], Bk[1], e), lerp(A[2], Bk[2], e), s];
}
export const drifted = (c, t, amt = 1.6, seed = 0) => E.camDrift(c, t, amt, seed);

// ------------------------------------------------------------------------------------------------ small things of light
// a bracket of light (one side of the clamp): x = inner edge, y0..y1, side -1 (left "[") or 1 (right "]"), arm length
export function bracket(ctx, x, y0, y1, side, arm, t, o = {}) {
  const p = new Path2D(); p.moveTo(x - side * arm, y0); p.lineTo(x, y0); p.lineTo(x, y1); p.lineTo(x - side * arm, y1);
  const w = o.w ?? 7, s = p.stroke({ width: w, cap: 1, join: 1 });
  E.lightShape(ctx, s, t, { lit: 1, dust: 0, glow: .5, seed: 88 });
}
// a gate of light (an arch standing on the line): x centre, y base, w, h; lit 0..1 (cool → warm), a share drawn 0..1 (it grows up)
export function gate(ctx, x, y, w, h, t, o = {}) {
  const g = clamp(o.grow ?? 1); if (g <= 0) return;
  const lit = clamp(o.lit ?? 0), th = o.th ?? Math.max(5, w * .07);
  const r = w / 2, hh = h * g;
  const p = new Path2D();
  // legs grow up from the line first, then the arch closes
  const legH = Math.max(0, h - r), lg = Math.min(hh, legH);
  p.moveTo(x - r, y); p.lineTo(x - r, y - lg);
  if (hh > legH) { const k = clamp((hh - legH) / r); p.arc(x, y - legH, r, Math.PI, Math.PI + Math.PI * k * .5); }
  const p2 = new Path2D(); p2.moveTo(x + r, y); p2.lineTo(x + r, y - lg);
  if (hh > legH) { const k = clamp((hh - legH) / r); p2.arc(x, y - legH, r, 0, -Math.PI * k * .5, true); }
  const s = p.stroke({ width: th, cap: 1, join: 1 }), s2 = p2.stroke({ width: th, cap: 1, join: 1 });
  s.addPath(s2);
  if (lit > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55 * lit;
    const inner = new Path2D(); inner.moveTo(x - r, y); inner.lineTo(x - r, y - legH); inner.arc(x, y - legH, r, Math.PI, 0); inner.lineTo(x + r, y); inner.closePath();
    ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, rgba(P.halo1, .05)], [1, rgba(P.halo0, .4)]]); if (g >= 1) ctx.fill(inner); ctx.restore(); }
  E.lightShape(ctx, s, t, { lit: lit > .5 ? 1 : 0, dust: 0, glow: .35, seed: 90 });
  if (lit > 0 && lit < 1) { ctx.save(); ctx.globalAlpha = lit; E.lightShape(ctx, s, t, { lit: 1, dust: 0, glow: .35, seed: 90 }); ctx.restore(); }
}
// the paper of a contract: a sheet of light (cream-gold) with dark ink. Unfolds upward from its bottom edge (u 0..1).
// lines: [{ s, u, y, size, hi }] (u = written share; hi = gold glow behind the line), scribble: [{ y, u, w }] (illegible contract text)
export function contract(ctx, x, y, w, h, t, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), hh = h * k, top = y + h - hh, dim = clamp(o.dim ?? 0);
  ctx.save();
  // glow round the paper (it is a light form)
  const sheet = new Path2D(); sheet.roundRect(x, top, w, hh, 6);
  glowFill(ctx, sheet, w * .25, .45 * (o.glow ?? 1), P.blue0);
  glowFill(ctx, sheet, w * .05, .35 * (o.glow ?? 1), P.halo1);
  ctx.fillStyle = lin(ctx, 0, top, 0, top + hh, [[0, mixHex(mixHex(P.core1, P.core0, .4), P.halo1, .35 * dim)], [1, mixHex(mixHex(P.halo2, P.halo1, .5), P.shade0, .5 * dim)]]);
  ctx.fill(sheet);
  ctx.fillStyle = rgba(P.shade0, .45); ctx.fillRect(x, top + hh - 2, w, 2);
  ctx.save(); ctx.clip(sheet);
  for (const sc of o.scribble || []) {   // contract text: soft ink waves (unreadable on purpose: one idea per picture)
    const su = clamp(sc.u ?? 1); if (su <= 0) continue;
    const yy = y + sc.y, x0 = x + w * .1, x1 = x0 + (w * .8) * (sc.w ?? 1) * su;
    ctx.strokeStyle = rgba(F.INK, (.5 - .3 * dim) * (sc.a ?? 1)); ctx.lineWidth = Math.max(1, w * .006); ctx.beginPath();
    for (let xx = x0; xx <= x1; xx += 3) { const yv = yy + Math.sin(xx * .21 + sc.y) * 1.6 + Math.sin(xx * .53) * .9; xx === x0 ? ctx.moveTo(xx, yv) : ctx.lineTo(xx, yv); }
    ctx.stroke();
  }
  for (const ln of o.lines || []) {
    const lu = clamp(ln.u ?? 1); if (lu <= 0) continue;
    const size = ln.size ?? w * .1, yy = y + ln.y;
    if (ln.hi > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x + w / 2, yy - size * .35, w * .6, [[0, rgba(P.core0, .55 * ln.hi)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x, yy - size * 1.6, w, size * 2.4); ctx.restore(); }
    ctx.font = `600 ${size}px Inter`; ctx.letterSpacing = '0.12em'; ctx.textAlign = ln.align ?? 'center'; ctx.textBaseline = 'alphabetic';
    const tx = ln.align === 'left' ? x + w * .1 : x + w / 2, tw = ctx.measureText(ln.s).width, x0 = ln.align === 'left' ? tx : tx - tw / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 4, yy - size * 1.2, (tw + 8) * lu, size * 1.6); ctx.clip();
    ctx.fillStyle = mixHex(F.INK, P.halo1, .55 * (ln.dim ?? 0)); ctx.fillText(ln.s, tx, yy); ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  return { top, sheet };
}
// an indigo hand (everyone else: never yellow, never a light hand): wrist (x, y), angle, palm length L, pose, flip; rim light blue
export function inkHand(ctx, x, y, ang, L, o = {}) {
  const m = E.handMatrix(x, y, ang, L, o.flip ?? 1), local = E.handPath({ pose: o.pose ?? 'point', curl: o.curl ?? 0 });
  let lp = local;
  if (o.ext) { const ex = new Path2D(); ex.moveTo(-3.3, -.62); ex.lineTo(-3.3 - o.ext, -.66 - .06 * o.ext); ex.lineTo(-3.3 - o.ext, .84 + .06 * o.ext); ex.lineTo(-3.3, .78); ex.closePath(); lp = local.op(ex, PathOp.Union); }
  const p = new Path2D(); p.addPath(lp, m);
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  const [cx, cy] = E.applyM(m, .6, 0), [fx, fy] = E.applyM(m, -3.3 - (o.ext ?? 0), 0);
  ctx.fillStyle = lin(ctx, cx, cy, fx, fy, [[0, mixHex(P.ind2, P.blue1, .45)], [.3, P.ind2], [1, P.night0]]); ctx.fill(p);
  // rim light: warm on the side that faces the paper (o.rimDir: screen offset towards the light), blue elsewhere
  const rd = o.rimDir || [0, -1], sh = new Path2D(); sh.addPath(p, { a: 1, b: 0, c: 0, d: 1, e: -rd[0] * L * .05, f: -rd[1] * L * .05 });
  ctx.fillStyle = lin(ctx, cx, cy, fx, fy, [[0, rgba(o.rim ?? P.halo1, .95)], [.35, rgba(P.blue0, .9)], [1, rgba(P.blue0, 0)]]); ctx.fill(new Path2D(p).op(sh, PathOp.Difference));
  ctx.restore();
  const tip = E.handTip({ pose: o.pose ?? 'point', curl: o.curl ?? 0 }, 0);
  return E.applyM(m, tip[0], tip[1]);
}
// the night sky shared by B3 (deal night above the street, the ledge at the end): indigo, a low warm band of first light (dawn 0..1)
export function sky(ctx, t, o = {}) {
  const dawn = clamp(o.dawn ?? 0), hy = o.horizon ?? 1080;
  ctx.fillStyle = P.night0; ctx.fillRect(-6000, -4000, 20000, 9000);
  ctx.fillStyle = lin(ctx, 0, hy - 2200, 0, hy + 200, [[0, P.night0], [.55, P.night1], [.86, P.ind0], [1, mixHex(P.ind1, P.blue1, .2 * dawn)]]); ctx.fillRect(-6000, hy - 2200, 20000, 2600);
  if (dawn > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, hy - 520, 0, hy + 40, [[0, rgba(P.halo1, 0)], [.6, rgba(P.halo1, .05 * dawn)], [.9, rgba(P.halo0, .16 * dawn)], [1, rgba(P.core1, .22 * dawn)]]); ctx.fillRect(-6000, hy - 520, 20000, 600);
    ctx.restore();
  }
}
