// Film 7 · c09 · card II turned: dig less, the lithium search, a ceiling, the sulfur cap (06b). Builder: c09.
// The props that rise out of the lacquer of THE TABLE (lib/f7_c09_table.mjs, c09's copy of c04/c05's table) behind the cards, in the
// engraved standee / solid language of c05 (lib/f7_c09_props.mjs, a 1:1 copy of c05's props). World units cm, camera tcam. Pure functions of t.
//
//   answersPrepare() async          builds the standee sprites (everyday objects, power plants, the lab bench) and the chart paper → Images
//   excavator(ctx, t, cam, o)       a small engraved excavator on the mine's top edge: { X, Y, Z, s (cm tall), dig 0..1 (arm working), lift 0..1
//                                   (the arm lifts and stops: "dig far less"), warm }
//   pitGhost(ctx, cam, o)           the dashed red outline of the pit we would need, shrinking: { X, Y, Z, rot, r (cm), a }
//   loop(ctx, t, cam, o)            the recycling ring: scrap pieces lift from the lacquer, circle, pass a small press and come out as bright
//                                   new parts: { C [X, Z], R, gather 0..1, speed (turns/s), a, spot, warm, feed: [X, Z] | null }
//   device(ctx, t, cam, o)          an upright phone in x-ray: { X, Z, rise 0..1, scan 0..1, thin 0..1 (metal frame and body slim down), spot }
//   bench(ctx, t, cam, o)           the lab bench standee (glassware glowing cool) + the vial that receives the found crystal: { X, Z, rise, vial 0..1 }
//   sieve(ctx, t, cam, o)           a disc grid of cool light hovering in the beam: { X, Y, Z, r, a, pulse }
//   rain(ctx, t, cam, o)            the candidates: crystals falling through the sieve: { X, Z, Y0, Ys (sieve height), r, t0, t1 (rain), keep
//                                   (the one that stays: t found, t land), land [X, Y, Z] }
//   things(ctx, t, cam, o)          the everyday objects (phone, bike, kettle, window frame) standing in the dark: { list [{kind, X, Z, rise, shim}] }
//   chart(ctx, t, A, o)             the paper chart (chart px 1500 × 950 → screen affine A): axes, the amber appetite curve with its savings
//                                   (dips eaten by growth), the ruled ink ceiling: { draw 0..1, dips 0..1, eat 0..1, ceil 0..1 (ruling), bend 0..1, liftA }
//   CH = chart geometry (px, line y)
//   plants(ctx, t, cam, o)          three engraved 1990 power plants with smoking stacks: { list [{X, Z, rise}], smoke 0..1, low 0..1 (pollution
//                                   fallen), capY (cm: smoke is flattened below it) }
//   capBar(ctx, t, cam, o)          the ink ceiling lifted off the chart as a glowing cream rule in the air: { P0 [3], P1 [3] (end points), a }
//   permits(ctx, t, cam, o)         small paper permits flying in arcs between the plants: { from [[X, Y, Z]…], t0, t1, n }
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text } from '../engine.mjs';
import { F7, ease, n1 } from './f7_kit.mjs';
import { apply, spotAt, TB, LAMP, shadowQuad, SPOT } from './f7_c09_table.mjs';
import { solid, boxV, BOXF, lightAt, shade } from './f7_c09_props.mjs';

const TAU = Math.PI * 2;
const toImg = async (c) => loadImage(c.toBuffer('image/png'));
const pathP = (ctx, P) => { ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
const SPX = 60;   // sprite px per cm

// ================================================================ engraved standees (upright card cut-outs facing −Z, as c05's)
const SHAPES = {
  phone: { w: 3.2, h: 6.2, f(g, fill) { g.fillStyle = fill; g.beginPath(); g.roundRect(4, 4, 3.2 * SPX - 8, 6.2 * SPX - 8, 26); g.fill(); } },
  bike: { w: 8.2, h: 4.8, f(g, fill) {
    const P = (x, y) => [x * SPX, y * SPX], R = 1.55, wl = [1.75, 2.95], wr = [6.45, 2.95];
    g.strokeStyle = fill; g.fillStyle = fill; g.lineCap = 'round'; g.lineJoin = 'round';
    for (const c of [wl, wr]) { g.lineWidth = .3 * SPX; g.beginPath(); g.arc(...P(...c), R * SPX, 0, TAU); g.stroke(); g.lineWidth = .07 * SPX; g.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.moveTo(...P(...c)); g.lineTo(...P(c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R)); } g.stroke(); g.beginPath(); g.arc(...P(...c), .2 * SPX, 0, TAU); g.fill(); }
    const bb = [3.85, 3.05], st = [3.3, 1.2], hd = [5.75, 1.05];
    g.lineWidth = .22 * SPX; g.beginPath(); g.moveTo(...P(...wl)); g.lineTo(...P(...bb)); g.lineTo(...P(...st)); g.lineTo(...P(...wl)); g.moveTo(...P(...st)); g.lineTo(...P(...hd)); g.lineTo(...P(...bb)); g.moveTo(...P(...hd)); g.lineTo(...P(...wr)); g.stroke();
    g.lineWidth = .16 * SPX; g.beginPath(); g.moveTo(...P(3.3, 1.2)); g.lineTo(...P(3.15, .62)); g.moveTo(...P(2.6, .55)); g.lineTo(...P(3.7, .55)); g.moveTo(...P(5.75, 1.05)); g.lineTo(...P(5.6, .45)); g.lineTo(...P(6.3, .32)); g.stroke();
    g.beginPath(); g.arc(...P(...bb), .42 * SPX, 0, TAU); g.lineWidth = .1 * SPX; g.stroke();
  } },
  kettle: { w: 5.2, h: 4.8, f(g, fill) {
    const P = (x, y) => [x * SPX, y * SPX]; g.fillStyle = fill; g.strokeStyle = fill; g.lineCap = 'round';
    g.beginPath(); g.moveTo(...P(1.1, 4.7)); g.lineTo(...P(4.1, 4.7)); g.quadraticCurveTo(...P(4.5, 3.0), ...P(3.7, 1.75)); g.lineTo(...P(1.5, 1.75)); g.quadraticCurveTo(...P(.7, 3.0), ...P(1.1, 4.7)); g.fill();
    g.beginPath(); g.ellipse(...P(2.6, 1.72), 1.15 * SPX, .26 * SPX, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(...P(2.6, 1.32), .22 * SPX, 0, TAU); g.fill();
    g.lineWidth = .3 * SPX; g.beginPath(); g.moveTo(...P(1.4, 1.9)); g.bezierCurveTo(...P(1.2, .35), ...P(4.0, .35), ...P(3.8, 1.9)); g.stroke();
    g.lineWidth = .42 * SPX; g.beginPath(); g.moveTo(...P(4.0, 3.5)); g.quadraticCurveTo(...P(4.7, 3.1), ...P(5.05, 2.25)); g.stroke();
  } },
  window: { w: 4.6, h: 5.8, f(g, fill) {
    const P = (x, y) => [x * SPX, y * SPX]; g.strokeStyle = fill; g.lineWidth = .36 * SPX; g.lineJoin = 'miter';
    g.strokeRect(...P(.25, .25), 4.1 * SPX, 5.3 * SPX); g.lineWidth = .2 * SPX; g.beginPath(); g.moveTo(...P(2.3, .3)); g.lineTo(...P(2.3, 5.5)); g.moveTo(...P(.3, 2.5)); g.lineTo(...P(4.3, 2.5)); g.stroke();
    g.lineWidth = .12 * SPX; g.strokeRect(...P(.55, .55), 3.5 * SPX, 4.7 * SPX);
    g.fillStyle = fill; g.fillRect(...P(3.6, 3.3), .22 * SPX, .55 * SPX);
  } },
  plant: { w: 7.6, h: 9.6, f(g, fill) {
    const P = (x, y) => [x * SPX, y * SPX]; g.fillStyle = fill;
    // the boiler house (tall), the turbine hall (long, low), two stacks, a cooling duct
    g.beginPath(); g.moveTo(...P(.4, 9.6)); g.lineTo(...P(.4, 6.0)); g.lineTo(...P(1.6, 5.55)); g.lineTo(...P(3.9, 5.55)); g.lineTo(...P(3.9, 9.6)); g.fill();
    g.beginPath(); g.moveTo(...P(3.8, 9.6)); g.lineTo(...P(3.8, 7.2)); g.lineTo(...P(7.3, 7.2)); g.lineTo(...P(7.3, 9.6)); g.fill();
    for (const [x, w0, w1, top] of [[1.55, .62, .44, .35], [3.05, .54, .4, 1.1]]) { g.beginPath(); g.moveTo(...P(x - w0 / 2, 6.0)); g.lineTo(...P(x - w1 / 2, top)); g.lineTo(...P(x + w1 / 2, top)); g.lineTo(...P(x + w0 / 2, 6.0)); g.fill(); g.fillRect(...P(x - w1 / 2 - .06, top), (w1 + .12) * SPX, .14 * SPX); }
    g.fillRect(...P(2.2, 6.6), 1.9 * SPX, .26 * SPX);
  } },
  bench: { w: 9.4, h: 2.9, f(g, fill) {
    const P = (x, y) => [x * SPX, y * SPX]; g.fillStyle = fill; g.strokeStyle = fill; g.lineCap = 'round';
    g.fillRect(...P(.2, 1.7), 9.0 * SPX, .2 * SPX);                                      // the bench top
    for (const x of [.5, 4.6, 8.7]) g.fillRect(...P(x, 1.85), .16 * SPX, 1.05 * SPX);   // legs
    g.fillRect(...P(.5, 2.55), 8.4 * SPX, .07 * SPX);                                    // the low rail
    g.fillRect(...P(5.6, .1), .08 * SPX, 1.6 * SPX); g.fillRect(...P(5.6, .55), 3.2 * SPX, .07 * SPX);   // a rack (upright + shelf)
    // glassware on the bench and the shelf
    const flask = (x, y, s) => { g.beginPath(); g.moveTo(...P(x - .05 * s, y - .62 * s)); g.lineTo(...P(x + .05 * s, y - .62 * s)); g.lineTo(...P(x + .05 * s, y - .32 * s)); g.lineTo(...P(x + .26 * s, y)); g.lineTo(...P(x - .26 * s, y)); g.lineTo(...P(x - .05 * s, y - .32 * s)); g.closePath(); g.fill(); };
    const tube = (x, y, s) => { g.beginPath(); g.roundRect(...P(x - .05 * s, y - .5 * s), .1 * s * SPX, .5 * s * SPX, .05 * s * SPX); g.fill(); };
    flask(1.2, 1.7, 1); flask(2.0, 1.7, .8); tube(2.6, 1.7, 1); tube(2.75, 1.7, .9); tube(2.9, 1.7, 1);
    flask(6.3, .55, .7); flask(7.0, .55, .9); flask(7.8, .55, .65);
    g.beginPath(); g.moveTo(...P(3.7, 1.7)); g.lineTo(...P(3.95, .95)); g.lineTo(...P(4.25, .9)); g.lineWidth = .1 * SPX; g.stroke();   // a lamp arm
    g.beginPath(); g.moveTo(...P(4.05, .8)); g.lineTo(...P(4.55, .8)); g.lineTo(...P(4.4, 1.08)); g.lineTo(...P(4.2, 1.08)); g.closePath(); g.fill();
  } },
};
const STD = {};
function mkStandee(kind, seed) {
  const S = SHAPES[kind], cw = Math.ceil(S.w * SPX), ch = Math.ceil(S.h * SPX), r = prng(seed);
  const [cb, gb] = canvas(cw, ch);
  S.f(gb, '#d8e4f2'); gb.save(); gb.translate(-3, 2); S.f(gb, '#15142c'); gb.restore();
  gb.save(); gb.globalCompositeOperation = 'source-atop';
  gb.strokeStyle = 'rgba(150,160,220,.15)'; gb.lineWidth = 1.2; for (let y = -cw; y < ch; y += 5) { gb.beginPath(); gb.moveTo(0, y); gb.lineTo(cw, y + cw * .25); gb.stroke(); }
  const vg = gb.createLinearGradient(0, 0, cw, 0); vg.addColorStop(0, 'rgba(0,0,0,.35)'); vg.addColorStop(.6, 'rgba(0,0,0,0)'); gb.fillStyle = vg; gb.fillRect(0, 0, cw, ch);
  for (let i = 0; i < cw * ch / 900; i++) { gb.fillStyle = r() < .5 ? 'rgba(220,226,255,.06)' : 'rgba(0,0,0,.18)'; gb.fillRect(r() * cw, r() * ch, 1.3, 1.3); }
  gb.restore();
  // details per kind
  if (kind === 'plant') {   // rows of warm windows, bands on the stacks
    gb.fillStyle = 'rgba(255,190,110,.75)'; for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) if (r() < .7) gb.fillRect((.75 + i * .75) * SPX, (6.4 + j * .75) * SPX, .22 * SPX, .3 * SPX);
    for (let i = 0; i < 6; i++) if (r() < .8) gb.fillRect((4.2 + i * .52) * SPX, 8.1 * SPX, .2 * SPX, .26 * SPX);
    gb.fillStyle = 'rgba(207,224,240,.35)'; for (const [x, top] of [[1.55, .35], [3.05, 1.1]]) for (let k = 0; k < 3; k++) gb.fillRect((x - .3) * SPX, (top + .6 + k * 1.1) * SPX, .6 * SPX, .06 * SPX);
  }
  if (kind === 'phone') { gb.fillStyle = 'rgba(40,52,96,.9)'; gb.beginPath(); gb.roundRect(.22 * SPX, .4 * SPX, 2.76 * SPX, 5.3 * SPX, 10); gb.fill(); gb.fillStyle = 'rgba(150,170,230,.12)'; gb.beginPath(); gb.moveTo(.3 * SPX, .5 * SPX); gb.lineTo(1.6 * SPX, .5 * SPX); gb.lineTo(.3 * SPX, 3.4 * SPX); gb.closePath(); gb.fill(); }
  if (kind === 'window') { gb.fillStyle = 'rgba(120,150,210,.08)'; gb.fillRect(.45 * SPX, .45 * SPX, 3.7 * SPX, 4.9 * SPX); }
  if (kind === 'bench') {   // the cool liquid in the glassware
    gb.fillStyle = 'rgba(150,215,255,.75)'; for (const [x, y, s] of [[1.2, 1.7, 1], [2.0, 1.7, .8], [6.3, .55, .7], [7.0, .55, .9], [7.8, .55, .65]]) { gb.beginPath(); gb.moveTo((x - .2 * s) * SPX, (y - .06) * SPX); gb.lineTo((x + .2 * s) * SPX, (y - .06) * SPX); gb.lineTo((x + .1 * s) * SPX, (y - .2 * s) * SPX); gb.lineTo((x - .1 * s) * SPX, (y - .2 * s) * SPX); gb.closePath(); gb.fill(); }
    for (const x of [2.6, 2.75, 2.9]) gb.fillRect((x - .035) * SPX, 1.45 * SPX, .07 * SPX, .2 * SPX);
  }
  const [cm, gm] = canvas(cw, ch); S.f(gm, '#e6f1ff');
  return { body: cb, mask: cm, w: S.w, h: S.h, cw, ch };
}
let STX = null, PAPER = null, PREP = null;
export const CH = { w: 1500, h: 950, x0: 130, x1: 1400, y0: 820, yc: 236 };
function chartPaper() {
  const S = 1, [c, g] = canvas(CH.w, CH.h), r = prng(919);
  const gr = g.createLinearGradient(0, 0, CH.w, CH.h); gr.addColorStop(0, '#f4efe2'); gr.addColorStop(1, '#e3d9c4'); g.fillStyle = gr; g.fillRect(0, 0, CH.w, CH.h);
  g.lineCap = 'round';
  for (let i = 0; i < 3800; i++) { const x = r() * CH.w, y = r() * CH.h, L = 3 + r() * 16, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(120,100,70,${.04 + .05 * r()})` : `rgba(255,253,246,${.12 + .16 * r()})`; g.lineWidth = .5 + r() * .8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); g.stroke(); }
  // a fine printed grid
  g.strokeStyle = 'rgba(80,90,110,.09)'; g.lineWidth = 1; g.beginPath(); for (let x = CH.x0; x <= CH.x1; x += 63.5) { g.moveTo(x, 90); g.lineTo(x, CH.y0); } for (let y = CH.y0; y >= 90; y -= 61) { g.moveTo(CH.x0, y); g.lineTo(CH.x1, y); } g.stroke();
  // the axes, engraved
  g.strokeStyle = rgba(F7.ink, .85); g.lineWidth = 3.2; g.beginPath(); g.moveTo(CH.x0, 80); g.lineTo(CH.x0, CH.y0); g.lineTo(CH.x1 + 30, CH.y0); g.stroke();
  g.lineWidth = 2; g.beginPath(); for (let x = CH.x0; x <= CH.x1; x += 63.5) { g.moveTo(x, CH.y0); g.lineTo(x, CH.y0 + 12); } g.stroke();
  g.beginPath(); g.moveTo(CH.x1 + 30, CH.y0 - 9); g.lineTo(CH.x1 + 48, CH.y0); g.lineTo(CH.x1 + 30, CH.y0 + 9); g.moveTo(CH.x0 - 9, 98); g.lineTo(CH.x0, 80); g.lineTo(CH.x0 + 9, 98); g.stroke();
  text(g, 'TIME', CH.x1 + 20, CH.y0 + 58, { size: 26, weight: 600, color: rgba(F7.ink, .75), align: 'right', spacing: 7 });
  g.save(); g.translate(CH.x0 - 40, CH.y0 - 20); g.rotate(-Math.PI / 2); text(g, 'METAL WE USE', 0, 0, { size: 26, weight: 600, color: rgba(F7.ink, .75), spacing: 7 }); g.restore();
  // the frame, the deckled feel (a soft darker margin)
  const v = g.createRadialGradient(CH.w / 2, CH.h / 2, CH.h * .35, CH.w / 2, CH.h / 2, CH.w * .62); v.addColorStop(0, 'rgba(110,85,50,0)'); v.addColorStop(1, 'rgba(110,85,50,.16)'); g.fillStyle = v; g.fillRect(0, 0, CH.w, CH.h);
  g.strokeStyle = 'rgba(60,50,40,.35)'; g.lineWidth = 2; g.strokeRect(1, 1, CH.w - 2, CH.h - 2);
  return c;
}
export function answersPrepare() {
  if (PREP) return PREP;
  PREP = (async () => {
    STX = {};
    let seed = 600; for (const k of Object.keys(SHAPES)) { const s = mkStandee(k, seed++); STX[k] = { ...s, body: await toImg(s.body), mask: await toImg(s.mask) }; }
    PAPER = await toImg(chartPaper());
  })();
  return PREP;
}
// an upright standee: centre bottom at (X, 0, Z), height hgt, rise 0..1 (out of the lacquer), shim 0..1 (a band of cool light passes up)
function standee(ctx, t, cam, kind, o) {
  const S = STX[kind], rise = clamp(o.rise ?? 1); if (!S || rise <= 0) return null;
  const hgt = o.hgt ?? S.h, k = hgt / S.h, ww = S.w * k, rot = o.rot ?? 0, c = Math.cos(rot), s = Math.sin(rot), u = 1 / SPX * k;
  const sink = S.ch * (1 - ease.out(rise));
  const C = [o.X, hgt / 2, o.Z], A = cam.M3(C, [c * u, 0, s * u], [0, -u, 0], S.cw / 2); if (!A) return null;
  if (o.shadow !== false) shadowQuad(ctx, cam, o.X, o.Z + .3, rot, ww * .9, .8, { a: .8 * rise });
  ctx.save(); apply(ctx, A); ctx.translate(-S.cw / 2, -S.ch / 2 + sink);
  const vis = S.ch - sink;
  if (vis > 1) {
    ctx.drawImage(S.body, 0, 0, S.cw, vis, 0, 0, S.cw, vis);
    const lit = o.lit ?? 0; if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .12 * lit; ctx.drawImage(S.mask, 0, 0, S.cw, vis, 0, 0, S.cw, vis); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  }
  const sc = clamp(o.shim ?? 0);
  if (sc > 0 && sc < 1 && vis > 1) {   // the search passes over it: a band of cool light rises through the silhouette, a glint at the top
    const yS = S.ch * (1 - ease.io(sc));
    ctx.globalCompositeOperation = 'lighter';
    for (const [hb, al] of [[40, .1], [16, .2], [5, .55]]) { const y0 = clamp(yS - hb, 0, vis), y1 = clamp(yS + hb, 0, vis); if (y1 - y0 < .5) continue; ctx.globalAlpha = al; ctx.drawImage(S.mask, 0, y0, S.cw, y1 - y0, 0, y0, S.cw, y1 - y0); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  return { A, sink, S, k };
}
export function things(ctx, t, cam, o) {
  const L = o.list.map((q) => ({ ...q, d: Math.hypot(q.X - cam.x, q.Z - cam.z) })).sort((a, b) => b.d - a.d);
  for (const q of L) {
    const r = standee(ctx, t, cam, q.kind, q);
    // the glint where the search touches it
    if (r && q.shim > .55 && q.shim < 1) { const p = cam.p(q.X + .3, (q.hgt ?? STX[q.kind].h) * .82, q.Z - .1), a = bump(q.shim, .55, .7, .85, 1); if (p[3] > 1) glint(ctx, p[0], p[1], .5 * p[2], a); }
  }
}
function glint(ctx, x, y, s, a) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, s * 1.6); g.addColorStop(0, `rgba(230,245,255,${.55 * a})`); g.addColorStop(1, 'rgba(190,227,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - s * 1.6, y - s * 1.6, s * 3.2, s * 3.2);
  ctx.strokeStyle = `rgba(238,248,255,${.85 * a})`; ctx.lineWidth = Math.max(.8, s * .06); ctx.beginPath(); ctx.moveTo(x - s * 1.4, y); ctx.lineTo(x + s * 1.4, y); ctx.moveTo(x, y - s * 1.4); ctx.lineTo(x, y + s * 1.4); ctx.stroke();
  ctx.restore();
}

// ================================================================ the excavator (side view, in an upright plane facing −Z; faces left)
// local units cm: x right, y up; tracks on y = 0
export function excavator(ctx, t, cam, o) {
  const s = o.s ?? 1, u = .02, A = cam.M3([o.X, o.Y + .9 * s, o.Z], [u, 0, 0], [0, -u, 0], 60); if (!A) return;
  const dig = o.dig ?? 0, lift = o.lift ?? 0, warm = o.warm ?? 0;
  // the arm: a slow dig cycle (boom down, stick curls, bucket scoops) that stops lifted when lift → 1
  const ph = (t * .55) % 1, cyc = Math.sin(ph * TAU), cyc2 = Math.sin(ph * TAU + 1.2);
  const boom = mix(-.25, -.05 + .28 * cyc * dig, 1) * (1 - lift) + lift * .42, stick = mix(1.25, 1.25 + .45 * cyc2 * dig, 1) * (1 - lift) + lift * .75, bucket = (1.1 + .7 * cyc * dig) * (1 - lift) + lift * .3;
  const col = shade([20, 20, 40], .9 + .3 * warm, warm), rim = rgba(warm > .3 ? '#ffd7a8' : '#d8e6f4', .7);
  ctx.save(); apply(ctx, A); ctx.scale(s * 50, s * 50); ctx.translate(0, .9);   // 1 unit = 1 cm·s, origin at the track centre on the ground
  const drawAll = (fill, dx, dy) => {
    ctx.save(); ctx.translate(dx, dy); ctx.fillStyle = fill; ctx.strokeStyle = fill; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.roundRect(-1.0, -.42, 2.0, .42, .2); ctx.fill();                       // tracks
    ctx.fillRect(-.7, -.6, 1.5, .2);                                                               // the turntable
    ctx.beginPath(); ctx.moveTo(-.55, -.6); ctx.lineTo(-.55, -1.3); ctx.lineTo(-.15, -1.3); ctx.lineTo(.05, -.9); ctx.lineTo(.95, -.9); ctx.lineTo(.95, -.6); ctx.closePath(); ctx.fill();   // cab + body
    // boom from the cab front (−.45, −.85) out to the left, stick, bucket
    const b0 = [-.45, -.85], la = 1.55, lb = 1.15, a1 = Math.PI + boom, b1 = [b0[0] + Math.cos(a1) * la, b0[1] - Math.sin(a1) * la];
    const a2 = a1 + stick, b2 = [b1[0] + Math.cos(a2) * lb, b1[1] - Math.sin(a2) * lb];
    ctx.lineWidth = .2; ctx.beginPath(); ctx.moveTo(...b0); ctx.lineTo(...b1); ctx.stroke(); ctx.lineWidth = .14; ctx.beginPath(); ctx.moveTo(...b1); ctx.lineTo(...b2); ctx.stroke();
    ctx.save(); ctx.translate(...b2); ctx.rotate(-(a2 + bucket)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(.42, -.05); ctx.quadraticCurveTo(.5, .32, .12, .36); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.restore();
    return b2;
  };
  drawAll(rim, .04, -.03); const tip = drawAll(col, 0, 0);
  // the cab window: one warm light
  ctx.fillStyle = rgba('#ffcf8a', .75); ctx.fillRect(-.47, -1.22, .28, .26);
  // track wheels
  ctx.fillStyle = 'rgba(200,210,236,.35)'; for (const x of [-.7, -.25, .2, .65]) { ctx.beginPath(); ctx.arc(x, -.21, .09, 0, TAU); ctx.fill(); }
  ctx.restore();
  // dust where the bucket bites (only while digging)
  if (dig * (1 - lift) > .05) {
    const P = (x, y) => { const sx = A[0] * x * s * 50 + A[2] * (y + .9) * s * 50 + A[4], sy = A[1] * x * s * 50 + A[3] * (y + .9) * s * 50 + A[5]; return [sx, sy]; };
    const [bx, by] = P(tip[0], tip[1]), r = prng(Math.floor(t * 8)), k = Math.hypot(A[0], A[1]) * s * 50;
    ctx.fillStyle = rgba('#c8b090', .35 * dig * (1 - lift)); for (let i = 0; i < 10; i++) ctx.fillRect(bx + (r() - .5) * .6 * k, by + (r() - .2) * .4 * k, 1.4, 1.4);
  }
}
export function pitGhost(ctx, cam, o) {
  if ((o.a ?? 1) <= 0 || o.r <= 0) return;
  const P = []; for (let i = 0; i <= 40; i++) { const q = Math.PI * i / 40; P.push([o.X - o.r * Math.cos(q), o.Y + .02, o.Z + o.r * .78 * Math.sin(q)]); }
  const S = P.map((q) => cam.p(...q)); if (S.some((q) => q[3] < 1)) return;
  ctx.save(); ctx.setLineDash([7, 5]); ctx.strokeStyle = rgba('#e07a62', .8 * (o.a ?? 1)); ctx.lineWidth = 1.6; ctx.beginPath(); S.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.setLineDash([]);
  // red hatch inside the ghost band (between the ghost and the real pit edge)
  ctx.strokeStyle = rgba('#d0604a', .3 * (o.a ?? 1)); ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 2; i < 40; i += 2) { const q = Math.PI * i / 40, a = cam.p(o.X - o.r * Math.cos(q), o.Y + .02, o.Z + o.r * .78 * Math.sin(q)), b = cam.p(o.X - (o.r0 ?? o.r * .6) * Math.cos(q), o.Y + .02, o.Z + (o.r0 ?? o.r * .6) * .78 * Math.sin(q)); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke(); ctx.restore();
}

// ================================================================ the recycling loop
const PIECES = (() => { const r = prng(1313), o = []; for (let i = 0; i < 34; i++) o.push({ ph: i / 34 + (r() - .5) * .012, sx: (r() - .5) * 2, sz: (r() - .5) * 2, kind: Math.floor(r() * 3), rot: r() * TAU, sp: r(), cu: r() < .6 }); return o; })();
export function loop(ctx, t, cam, o) {
  const a = o.a ?? 1; if (a <= 0) return;
  const [cx, cz] = o.C, R = o.R ?? 4.2, gather = clamp(o.gather ?? 1), sp = o.spot, warm = o.warm ?? 0, turn = t * (o.speed ?? .085);
  // the track: an engraved ring on the lacquer (drawn as it gathers)
  const ring = (rr, y = .02) => { const P = []; for (let i = 0; i <= 72; i++) { const q = i / 72 * TAU; P.push(cam.p(cx + rr * Math.cos(q), y, cz + rr * Math.sin(q))); } return P; };
  const tr = ease.out(gather);
  ctx.save(); ctx.strokeStyle = rgba('#e8d6b8', .32 * tr * a); ctx.lineWidth = 1; for (const rr of [R - .55, R + .55]) { const P = ring(rr); ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  ctx.restore();
  // the press (a small engraved furnace block at the far side of the ring, warm mouth)
  const PA = -Math.PI / 2 + .0, px = cx + R * Math.cos(PA + Math.PI), pz = cz - R * Math.sin(PA + Math.PI);   // at the back (Z max)
  const pressX = cx, pressZ = cz + R;
  // pieces (sorted far → near), each: scattered on the lacquer → lifts onto the ring → circles; past the press it is a bright new part
  const items = [];
  for (const p of PIECES) {
    const q = (p.ph + turn) % 1, ang = Math.PI / 2 + q * TAU;   // q = 0 at the press (back), running clockwise seen from above
    const rx = cx + R * Math.cos(ang), rz = cz + R * Math.sin(ang);
    const scx = cx + p.sx * (R + 4), scz = cz + p.sz * (R + 3.4);
    const g = ease.io(clamp(gather * 1.6 - p.sp * .6));
    const X = mix(scx, rx, g), Z = mix(scz, rz, g), Y = .12 + .9 * Math.sin(Math.PI * g) * (1 - g * .2);
    const fresh = g > .98 ? (q < .5 ? 1 : 0) : 0;   // first half after the press: new parts
    items.push({ p, X, Y, Z, fresh, g, q, d: Math.hypot(X - cam.x, Z - cam.z) });
  }
  // the press drawn behind the near half
  const drawPress = () => {
    const V = boxV(pressX, 0, pressZ + .2, 2.4, 1.6 * tr, 1.5, 0);
    solid(ctx, cam, V, BOXF, (n, c) => shade([60, 52, 58], lightAt(n, c, sp) * (n[1] > .9 ? 1.1 : .8), warm), { edge: 'rgba(10,8,12,.7)', lw: 1 });
    const m = cam.p(pressX, .55 * tr, pressZ - .56); if (m[3] > 1 && tr > .5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = .9 * m[2], gl = ctx.createRadialGradient(m[0], m[1], 0, m[0], m[1], r * 2.6); gl.addColorStop(0, rgba('#ffcf8a', .6 * a)); gl.addColorStop(.35, rgba('#ff9a40', .25 * a)); gl.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = gl; ctx.fillRect(m[0] - r * 2.6, m[1] - r * 2.6, r * 5.2, r * 5.2); ctx.fillStyle = rgba('#fff1d6', .8 * a * (.85 + .15 * Math.sin(t * 3))); ctx.fillRect(m[0] - r * .6, m[1] - r * .25, r * 1.2, r * .5); ctx.restore(); }
  };
  items.sort((a, b) => b.d - a.d);
  let pressDone = false;
  for (const it of items) {
    if (!pressDone && it.d < Math.hypot(pressX - cam.x, pressZ - cam.z)) { drawPress(); pressDone = true; }
    const { p, X, Y, Z, fresh } = it, rot = p.rot + (it.g < 1 ? (1 - it.g) * 2 : 0) + it.q * 2;
    if (fresh) {   // a new part: a small bright ingot (copper or silver)
      const V = boxV(X, Y - .1, Z, .9, .32, .42, rot);
      solid(ctx, cam, V, BOXF, (n, c) => shade(p.cu ? [208, 134, 80] : [214, 220, 226], lightAt(n, c, sp) * (n[1] > .9 ? 1.25 : .85), warm), { edge: p.cu ? 'rgba(60,24,8,.6)' : 'rgba(30,34,44,.55)', lw: .7 });
    } else {      // scrap: a bent wire, a crumpled plate, a nut
      const s0 = cam.p(X, Y, Z); if (s0[3] < 1) continue; const k = s0[2];
      ctx.save(); ctx.translate(s0[0], s0[1]); ctx.rotate(rot * .3);
      ctx.strokeStyle = p.cu ? 'rgba(170,104,60,.95)' : 'rgba(150,156,166,.95)'; ctx.fillStyle = p.cu ? 'rgba(120,70,40,.95)' : 'rgba(110,116,128,.95)'; ctx.lineWidth = Math.max(1, .13 * k); ctx.lineCap = 'round';
      if (p.kind === 0) { ctx.beginPath(); ctx.moveTo(-.45 * k, .1 * k); ctx.quadraticCurveTo(0, -.35 * k, .3 * k, .05 * k); ctx.quadraticCurveTo(.45 * k, .2 * k, .5 * k, -.1 * k); ctx.stroke(); }
      else if (p.kind === 1) { ctx.beginPath(); ctx.moveTo(-.35 * k, -.1 * k); ctx.lineTo(.1 * k, -.22 * k); ctx.lineTo(.36 * k, .02 * k); ctx.lineTo(.05 * k, .18 * k); ctx.lineTo(-.3 * k, .12 * k); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(20,14,10,.5)'; ctx.lineWidth = .8; ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(0, 0, .2 * k, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(10,10,16,.85)'; ctx.beginPath(); ctx.arc(0, 0, .08 * k, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
  }
  if (!pressDone) drawPress();
}

// ================================================================ the device in x-ray (an upright phone, thinning)
export function device(ctx, t, cam, o) {
  const rise = ease.out(clamp(o.rise ?? 1)); if (rise <= 0) return;
  const th = clamp(o.thin ?? 0), d = mix(1.0, .38, ease.io(th)), w = 3.2, h = 6.2 * rise, sp = o.spot, warm = o.warm ?? 0;
  shadowQuad(ctx, cam, o.X, o.Z, 0, w, d + .2, { a: rise });
  // the body: a thin upright slab (dark glass front, metal frame on the sides and the top)
  const V = boxV(o.X, 0, o.Z, w, h, d, 0);
  const frameCol = [176, 112, 66];
  const fs = solid(ctx, cam, V, BOXF, (n, c) => (Math.abs(n[2]) > .9 ? '#11142a' : shade(frameCol, lightAt(n, c, sp) * (n[1] > .9 ? 1.2 : .9), warm)), { edge: 'rgba(16,10,6,.7)', lw: 1 });
  // the front face as a plane: x-ray of the inside (copper traces, the silver cell, the frame band that slims)
  const front = fs.find((f) => f.n[2] < -.9); if (!front) return;
  const u = 1 / 100, A = cam.M3([o.X, h / 2, o.Z - d / 2 - .01], [u, 0, 0], [0, -u, 0], 150); if (!A) return;
  const sc = clamp(o.scan ?? 0), fb = mix(34, 12, ease.io(th));   // frame band px (1 px = .01 cm)
  ctx.save(); apply(ctx, A); ctx.translate(-160, -h * 50);
  const hp = h * 100;
  ctx.beginPath(); ctx.roundRect(0, 0, 320, hp, 22); ctx.clip();
  // glass
  const g = ctx.createLinearGradient(0, 0, 320, hp); g.addColorStop(0, '#1a2244'); g.addColorStop(1, '#0c1028'); ctx.fillStyle = g; ctx.fillRect(0, 0, 320, hp);
  if (sc > 0) {
    const yS = hp * (1 - ease.io(sc)); ctx.save(); ctx.beginPath(); ctx.rect(0, yS, 320, hp - yS); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    // the metal frame band (copper hatch) — thick → thin
    ctx.strokeStyle = rgba('#ffb880', .55); ctx.lineWidth = fb; ctx.beginPath(); ctx.roundRect(fb / 2, fb / 2, 320 - fb, hp - fb, 20); ctx.stroke();
    ctx.strokeStyle = rgba('#ffe0c0', .5); ctx.lineWidth = 1.2; ctx.beginPath(); for (let y = 6; y < hp; y += 9) { ctx.moveTo(0, y); ctx.lineTo(fb, y + 5); ctx.moveTo(320 - fb, y); ctx.lineTo(320, y + 5); } ctx.stroke();
    // the cell (lithium silver) and the board (copper traces)
    const cw = mix(200, 170, th), chh = mix(250, 230, th);
    ctx.fillStyle = rgba('#cfd6dc', .55); ctx.fillRect(160 - cw / 2, hp * .42, cw, chh); ctx.strokeStyle = rgba('#ffffff', .5); ctx.lineWidth = 1.5; ctx.strokeRect(160 - cw / 2, hp * .42, cw, chh);
    ctx.strokeStyle = rgba('#ffc890', .7); ctx.lineWidth = mix(4, 2.2, th); ctx.beginPath();
    for (let i = 0; i < 6; i++) { const y = hp * .12 + i * 22; ctx.moveTo(60, y); ctx.lineTo(120 + i * 12, y); ctx.lineTo(150 + i * 12, y + 26); ctx.lineTo(260, y + 26); } ctx.stroke();
    ctx.fillStyle = rgba('#ffe6c8', .7); ctx.fillRect(130, hp * .14, 60, 46);
    ctx.restore();
    if (sc < 1) { const yS2 = hp * (1 - ease.io(sc)); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createLinearGradient(0, yS2 - 26, 0, yS2 + 26); gl.addColorStop(0, 'rgba(220,240,255,0)'); gl.addColorStop(.5, 'rgba(220,240,255,.5)'); gl.addColorStop(1, 'rgba(220,240,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, yS2 - 26, 320, 52); }
  }
  ctx.restore();
}

// ================================================================ the lab: bench, vial, sieve, the rain of candidates
export function bench(ctx, t, cam, o) {
  const r = standee(ctx, t, cam, 'bench', { X: o.X, Z: o.Z, rise: o.rise, hgt: 2.9 * (o.k ?? 1) });
  if (!r) return;
  // the glassware glows faintly (cool), the bench lamp gives one small warm pool
  const k = o.k ?? 1, glow = (o.glow ?? .5) * ease.out(clamp(o.rise ?? 1));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, c, a] of [[1.2, 1.55, '#9fdcff', .5], [2.0, 1.6, '#9fdcff', .4], [7.0, .45, '#9fdcff', .4], [4.3, 1.4, '#ffcf8a', .7]]) {
    const p = cam.p(o.X + (x - 4.7) * k, (2.9 - y) * k, o.Z - .05); if (p[3] < 1) continue; const rr = .9 * p[2] * k;
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], rr); g.addColorStop(0, rgba(c, a * glow)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - rr, p[1] - rr, 2 * rr, 2 * rr);
  }
  ctx.restore();
  // the vial (front of the bench, centre): a small glass tube with a stopper; it lights when the crystal lands in it
  const v = o.vial ?? 0, vx = o.X + (5.15 - 4.7) * k, vy = (2.9 - 1.7) * k, vz = o.Z - .25;
  const b = cam.p(vx, vy, vz), tp = cam.p(vx, vy + .55 * k, vz); if (b[3] < 1) return;
  const ww = .11 * b[2] * k;
  ctx.save(); ctx.fillStyle = 'rgba(200,226,255,.16)'; ctx.strokeStyle = 'rgba(220,236,255,.65)'; ctx.lineWidth = Math.max(1, ww * .25);
  ctx.beginPath(); ctx.roundRect(b[0] - ww, tp[1], 2 * ww, b[1] - tp[1], ww); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2a22'; ctx.fillRect(b[0] - ww * 1.1, tp[1] - ww * .9, ww * 2.2, ww);
  if (v > 0) { ctx.globalCompositeOperation = 'lighter'; const yy = mix(tp[1], b[1], .72), rr = ww * 6; const g = ctx.createRadialGradient(b[0], yy, 0, b[0], yy, rr); g.addColorStop(0, rgba('#fff1d6', .9 * v)); g.addColorStop(.25, rgba('#ffcf8a', .45 * v)); g.addColorStop(1, 'rgba(255,180,100,0)'); ctx.fillStyle = g; ctx.fillRect(b[0] - rr, yy - rr, 2 * rr, 2 * rr); }
  ctx.restore();
}
// the sieve: rings and a fine mesh of cool light in a horizontal disc (seen from the side: an ellipse of light)
export function sieve(ctx, t, cam, o) {
  const a = o.a ?? 1; if (a <= 0 || o.r <= 0) return;
  const { X, Y, Z } = o, r = o.r, pulse = o.pulse ?? 0;
  const P = (x, z) => cam.p(X + x, Y, Z + z);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  // soft disc glow
  const C = cam.p(X, Y, Z); if (C[3] < 1) { ctx.restore(); return; }
  const rim = []; for (let i = 0; i <= 72; i++) { const q = i / 72 * TAU; rim.push(P(r * Math.cos(q), r * Math.sin(q))); }
  pathP(ctx, rim); ctx.fillStyle = rgba('#9fd0ff', (.05 + .05 * pulse) * a); ctx.fill();
  // the mesh: a grid clipped to the disc, done by computing chord ends (no clip mask)
  const step = o.step ?? .9; ctx.strokeStyle = rgba('#bfe3ff', (.22 + .2 * pulse) * a); ctx.lineWidth = 1; ctx.beginPath();
  for (let v = -r + step / 2; v < r; v += step) { const hw = Math.sqrt(r * r - v * v); let p0 = P(-hw, v), p1 = P(hw, v); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); p0 = P(v, -hw); p1 = P(v, hw); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); }
  ctx.stroke();
  // the rim: two bright rings, a glint running round
  for (const [lw, al] of [[6, .12], [2.2, .5], [1, .9]]) { ctx.strokeStyle = rgba(lw < 2 ? '#eef8ff' : '#bfe3ff', al * a); ctx.lineWidth = lw; ctx.beginPath(); rim.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  const gq = t * .8, gp = P(r * Math.cos(gq), r * Math.sin(gq)); glint(ctx, gp[0], gp[1], .5 * gp[2], .7 * a);
  ctx.restore();
}
// crystals: small cut gems (a lozenge with two facets), seen from the side
function gem(ctx, x, y, s, rot, col, a) {
  if (s < .6 || a <= 0) { if (a > 0) { ctx.fillStyle = rgba(col, a); ctx.fillRect(x - .7, y - .7, 1.4, 1.4); } return; }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a;
  ctx.fillStyle = rgba(col, .85); ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .62, 0); ctx.lineTo(0, s); ctx.lineTo(-s * .62, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .62, 0); ctx.lineTo(0, -s * .1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(10,20,40,.35)'; ctx.beginPath(); ctx.moveTo(0, s); ctx.lineTo(-s * .62, 0); ctx.lineTo(0, s * .1); ctx.closePath(); ctx.fill();
  ctx.restore();
}
const DROPS = (() => { const r = prng(2024), o = []; for (let i = 0; i < 1500; i++) o.push({ ts: r(), x: Math.sqrt(r()), q: r() * TAU, s: .07 + r() * .09, rot: r() * TAU, v: 14 + r() * 8, c: r() < .5 ? '#bfe3ff' : r() < .6 ? '#e6eef8' : '#c8d8ff' }); return o; })();
export function rain(ctx, t, cam, o) {
  const { X, Z, Y0, Ys, r, t0, t1 } = o, dens = o.dens ?? 1;
  if (t < t0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const span = t1 - t0, fallT = (Y0 + 2) / 16;
  for (let i = 0; i < DROPS.length * dens; i++) {
    const d = DROPS[i], ts = t0 + d.ts * span; if (t < ts || t > ts + fallT * 1.6) continue;
    const age = t - ts, y = Y0 - d.v * age; if (y < -.5) continue;
    const x = X + Math.cos(d.q) * d.x * r * .95, z = Z + Math.sin(d.q) * d.x * r * .95;
    const p = cam.p(x, y, z); if (p[3] < 1 || p[0] < -20 || p[0] > W + 20 || p[1] < -20 || p[1] > H + 20) continue;
    // through the sieve: a tiny flash; below it the crystal turns to a fading spark (not this one)
    const below = y < Ys, a = below ? clamp(1 - (Ys - y) / 4.5) * .8 : clamp(age * 4), sz = d.s * p[2];
    if (Math.abs(y - Ys) < .35) { ctx.fillStyle = rgba('#eef8ff', .5); ctx.fillRect(p[0] - sz, p[1] - .6, sz * 2, 1.2); }
    if (below) { ctx.fillStyle = rgba(d.c, a * .7); ctx.fillRect(p[0] - .7, p[1] - sz * .9, 1.4, sz * 1.8); }
    else gem(ctx, p[0], p[1], sz, d.rot + age * 3, d.c, a);
  }
  ctx.restore();
  // the one that stays
  const k = o.keep; if (!k) return;
  if (t < k.t0) return;
  const caught = Ys + .25, yFall = Math.max(caught, Y0 - 16 * (t - k.t0)), land = k.land, uL = ease.io(lin(k.tl, k.tl + 1.2, t));
  const x = mix(X + k.dx, land[0], uL), y = uL > 0 ? mix(caught, land[1], uL) + 1.2 * Math.sin(Math.PI * uL) : yFall, z = mix(Z + k.dz, land[2], uL);
  const p = cam.p(x, y, z); if (p[3] < 1) return;
  const glow = (y <= caught + .01 ? ease.out(lin(k.t0 + (Y0 - caught) / 16, k.t0 + (Y0 - caught) / 16 + .4, t)) : .3) * (1 - .6 * clamp((uL - .85) / .15)), sz = .32 * p[2];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const R = sz * 7, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#fff1d6', .75 * glow)); g.addColorStop(.3, rgba('#ffcf8a', .3 * glow)); g.addColorStop(1, 'rgba(255,180,100,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] - R, 2 * R, 2 * R);
  ctx.restore();
  gem(ctx, p[0], p[1], sz, .3 + .2 * Math.sin(t * 1.3), '#ffd9a0', 1);
}

// ================================================================ the chart (chart px → screen affine A)
// the appetite curve: exponential growth with three savings (dips) that growth eats; under the ceiling it bends and runs flat
const DIPS = [.34, .52, .7];
function curveY(s, o) {
  let y = CH.y0 - 40 - 600 * (Math.exp(3.3 * s) - 1) / (Math.exp(3.3) - 1);
  for (const d of DIPS) { const k = (s - d) / .035; if (k > 0) y += 34 * (o.dips ?? 0) * Math.exp(-k * (1 + 2.5 * (o.eat ?? 0))) * Math.min(1, k * 3); }
  const b = o.bend ?? 0; if (b > 0) { const lim = CH.yc + 34, soft = (v) => lim + 26 * Math.log(1 + Math.exp((v - lim) / 26)); y = mix(y, Math.max(lim + 2, soft(y) - 26 * Math.log(2)), b); }
  return y;
}
export function chart(ctx, t, A, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); apply(ctx, A); ctx.globalAlpha = a;
  ctx.drawImage(PAPER, 0, 0, CH.w, CH.h);
  const du = clamp(o.draw ?? 0);
  if (du > 0) {
    const n = 180, P = []; for (let i = 0; i <= n * du; i++) { const s = i / n; P.push([mix(CH.x0 + 20, CH.x1 - 10, s), curveY(s, o)]); }
    // hatching under the curve (amber ink, fine verticals)
    ctx.strokeStyle = 'rgba(200,110,40,.22)'; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < P.length; i += 3) { ctx.moveTo(P[i][0], CH.y0 - 2); ctx.lineTo(P[i][0], P[i][1] + 8); } ctx.stroke();
    // the savings: a small cool-green bracket under each dip, eaten (fading) as the growth runs past it
    for (const d of DIPS) { if (du < d + .02) continue; const x = mix(CH.x0 + 20, CH.x1 - 10, d + .03), y = curveY(d + .03, o), al = (o.dips ?? 0) * (1 - (o.eat ?? 0)); if (al <= .01) continue;
      ctx.strokeStyle = rgba('#3f7a5a', .85 * al); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 26, y + 20); ctx.lineTo(x - 26, y + 30); ctx.lineTo(x + 26, y + 30); ctx.lineTo(x + 26, y + 20); ctx.stroke();
      text(ctx, 'SAVED', x, y + 60, { size: 20, weight: 600, color: rgba('#3f7a5a', .9 * al), align: 'center', spacing: 4 }); }
    // the line itself: amber ink with a darker edge and a warm core
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const [lw, col] of [[16, 'rgba(224,120,46,.18)'], [8, 'rgba(176,84,24,.95)'], [3.2, 'rgba(255,190,110,.95)']]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
    // the pen point (while drawing)
    if (du < 1 && P.length) { const [x, y] = P[P.length - 1]; ctx.fillStyle = 'rgba(120,50,10,.9)'; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); }
  }
  // the ceiling: a ruled ink line (thick + thin, small hand ticks), drawn left to right
  const cu = clamp(o.ceil ?? 0), liftA = 1 - clamp(o.liftA ?? 0);
  if (cu > 0 && liftA > 0) {
    const x0 = CH.x0 - 30, x1 = mix(x0, CH.x1 + 40, ease.io(cu)), y = CH.yc;
    ctx.globalAlpha = a * liftA; ctx.strokeStyle = rgba(F7.ink, .92); ctx.lineCap = 'butt'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y - 3 * (x1 - x0) / 1500); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y + 20); ctx.lineTo(x1, y + 18); ctx.stroke();
    ctx.beginPath(); for (let x = x0 + 20; x < x1 - 10; x += 44) { ctx.moveTo(x, y - 28); ctx.lineTo(x + 17, y - 8); } ctx.stroke();
    if (cu >= 1) text(ctx, 'CEILING', CH.x1 + 30, y - 40, { size: 30, weight: 600, color: rgba(F7.stamp, .92 * clamp((o.ceilT ?? 1) * 3)), align: 'right', spacing: 8 });
    // the nib while ruling
    if (cu < 1) { ctx.fillStyle = rgba(F7.ink, .95); ctx.beginPath(); ctx.moveTo(x1, y - 4); ctx.lineTo(x1 + 30, y - 60); ctx.lineTo(x1 + 44, y - 50); ctx.closePath(); ctx.fill(); }
  }
  ctx.restore();
}
export const chartPt = (s, o) => [mix(CH.x0 + 20, CH.x1 - 10, s), curveY(s, o)];

// ================================================================ the power plants, their smoke, the cap, the permits
const PUFFS = (() => { const r = prng(1990), o = []; for (let i = 0; i < 26; i++) o.push({ ph: r(), dx: (r() - .5) * .6, s: .7 + r() * .6, w: r() }); return o; })();
export function plants(ctx, t, cam, o) {
  const L = o.list.map((q) => ({ ...q, d: Math.hypot(q.X - cam.x, q.Z - cam.z) })).sort((a, b) => b.d - a.d);
  const k = o.k ?? 1;
  for (const q of L) {
    const r = standee(ctx, t, cam, 'plant', { X: q.X, Z: q.Z, rise: q.rise, hgt: 9.6 * k });
    if (!r || (o.smoke ?? 0) <= 0 || (q.rise ?? 1) < .95) continue;
    // smoke from the two stack tops: grey billows that rise and drift; under the cap they spread flat; when it falls they shrink to wisps
    const stacks = [[1.55 - 3.8, 9.6 - .35], [3.05 - 3.8, 9.6 - 1.1]];
    for (const [sx, sy] of stacks) {
      const top = [q.X + sx * k, sy * k, q.Z];
      for (const p of PUFFS) {
        const life = 3.2, age = ((t / life + p.ph) % 1), low = clamp(o.low ?? 0), amt = (o.smoke ?? 0) * (1 - .82 * low);
        let y = top[1] + age * 6 * k, x = top[0] + (p.dx + age * 1.6) * k;
        const cap = o.capY ?? 1e9; let spread = 0; if (y > cap - .8) { spread = (y - (cap - .8)); y = cap - .8 + spread * .12; x += spread * .9 * (p.w - .3); }
        const P = cam.p(x, y, top[2] + .1); if (P[3] < 1) continue;
        const rr = (.45 + age * 1.3 + spread * .2) * p.s * P[2] * k * (1 - .5 * low), al = amt * .32 * Math.sin(Math.PI * age) * (1 - .4 * age);
        if (al <= .005) continue;
        const g = ctx.createRadialGradient(P[0], P[1], 0, P[0], P[1], rr); g.addColorStop(0, `rgba(150,146,160,${al})`); g.addColorStop(.6, `rgba(110,106,124,${al * .6})`); g.addColorStop(1, 'rgba(90,86,104,0)');
        ctx.fillStyle = g; ctx.fillRect(P[0] - rr, P[1] - rr, 2 * rr, 2 * rr);
      }
    }
  }
}
export function capBar(ctx, t, cam, o) {
  const a = o.a ?? 1; if (a <= 0) return;
  const A = cam.p(...o.P0), B = cam.p(...o.P1); if (A[3] < 1 || B[3] < 1) return;
  ctx.save(); ctx.lineCap = 'round';
  // the rule: an ink-dark core with a cream glow (it is the ceiling line of the chart, lifted into the air)
  ctx.globalCompositeOperation = 'lighter';
  for (const [lw, al, c] of [[26, .07, '#f3ecda'], [10, .18, '#f3ecda'], [3.5, .75, '#fff6e0']]) { ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = lw * Math.max(.6, (A[2] + B[2]) / 60); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); }
  ctx.globalCompositeOperation = 'source-over';
  // the small hand ticks along it (as on the chart)
  ctx.strokeStyle = rgba('#f3ecda', .55 * a); ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 1; i < 24; i++) { const u = i / 24, x = mix(A[0], B[0], u), y = mix(A[1], B[1], u), k = mix(A[2], B[2], u) * .3; ctx.moveTo(x, y - k); ctx.lineTo(x + k * .6, y - k * .3); } ctx.stroke();
  if (o.word) text(ctx, 'CAP', B[0] + 14, B[1] + 6, { size: 22, weight: 600, color: rgba('#f3ecda', .85 * a * o.word), spacing: 5 });
  ctx.restore();
}
export function permits(ctx, t, cam, o) {
  const pts = o.from; if (!pts || pts.length < 2 || t < o.t0) return;
  const r = prng(77), n = o.n ?? 9;
  for (let i = 0; i < n; i++) {
    const t0 = o.t0 + i * (o.t1 - o.t0) / n, dur = .95 + r() * .3, a0 = Math.floor(r() * pts.length), a1 = (a0 + 1 + Math.floor(r() * (pts.length - 1))) % pts.length;
    const u = (t - t0) / dur; if (u <= 0) continue;
    const uu = clamp(u), A = pts[a0], B = pts[a1], e = ease.io(uu);
    const X = mix(A[0], B[0], e), Z = mix(A[2], B[2], e), Y = mix(A[1], B[1], e) + 4.5 * Math.sin(Math.PI * e);
    const fade = u < 1 ? 1 : clamp(1 - (u - 1) * 3); if (fade <= 0) continue;
    const P = cam.p(X, Y, Z); if (P[3] < 1) continue; const k = P[2] * 1.7;
    ctx.save(); ctx.translate(P[0], P[1]); ctx.rotate(.4 * Math.sin(t * 5 + i) + (B[0] > A[0] ? .1 : -.1)); ctx.scale(1, .55 + .45 * Math.abs(Math.cos(t * 6 + i * 1.7)));
    ctx.globalAlpha = fade;
    ctx.fillStyle = '#f3ecda'; ctx.fillRect(-.55 * k, -.32 * k, 1.1 * k, .64 * k); ctx.strokeStyle = 'rgba(42,36,32,.6)'; ctx.lineWidth = .8; ctx.strokeRect(-.55 * k, -.32 * k, 1.1 * k, .64 * k);
    ctx.fillStyle = 'rgba(42,36,32,.55)'; ctx.fillRect(-.42 * k, -.16 * k, .6 * k, .06 * k); ctx.fillRect(-.42 * k, .0, .84 * k, .05 * k); ctx.fillStyle = rgba(F7.stamp, .8); ctx.beginPath(); ctx.arc(.3 * k, -.12 * k, .1 * k, 0, TAU); ctx.fill();
    ctx.restore();
  }
}
