// Film 6 · c14 · the hook room at the end (owned by c14). Everything is a pure function of t.
//   reflectionC14(q, t, o)      the room as the window glass sees it: a COPY of lib/f6_c01_room.mjs reflectionC01 (same layout: lamp +150, chair 0,
//                               you −75, laptop −110..−20) with what c14 adds: the chair opposite taken by you, facing us (o.chairTaken), the witness
//                               point above that head (o.witnessA), the ember in the chest of the figure at the desk and the thread of warmth that
//                               flows from it to the reflected laptop screen, where cool lines take it (14.05: o.chest, o.thread, o.screenText)
//   GLASS                       glass coordinates (pane-local, as they APPEAR; the reflect callback draws mirrored, so x is negated there)
//   windowC14(ctx, t, cam, o)   the window pane drawn over nightRoom's window (same geometry) with reflectionC14 inside, the city through it
//                               (o.through), yaw (the pane turn), the breath of fog; returns the pane and the camMap of its plane
//   clipOnLaptop(q, t, T, id, w, h)   the interview clip as a window over the chat on the laptop's screen (screen-local, top-left): the TV line
//                               opens into the picture .5 s before the audio and closes after it (a copy of the inner part of f6_kit clipPane)
//   splitC14(ctx, t, o)         a COPY of f6_kit splitLight with the ember's position free (o.ex, o.ey) and the line's extent free (o.x0, o.x1,
//                               o.y), so the line can settle into the pane and the ember can travel to the figure (14.09–14.11)
//   openingLight(ctx, t, HI, cx, cy, k)   the incoming lamp plate, masked by a glow-shaped falloff that shrinks into the lamp (pattern c04/c09/c11)
//   glassVeil(ctx, t, P, m, a)  the pane's tint and sliding sheen re-drawn in screen space (so the glass can fall away once it fills the frame)
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, prng, canvas, text, addGlow } from '../engine.mjs';
import { vnoise } from './art.mjs';
import { F6, pane, ember, witness, coolText, coolLine, figureDesk, view, camMap, ROOM, breathe, once, reveal } from './f6_kit.mjs';
import { figure, POSES } from './figure.mjs';
import { chairC01, breathFog } from './f6_c01_room.mjs';
import { clipFrame } from './kit.mjs';

const TAU = Math.PI * 2;
export const QUART = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));
export const EXPO_OUT = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const lerpCam = (A, B, u) => ({ x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: Math.exp(mix(Math.log(A.z), Math.log(B.z), u)) });

// glass coordinates (as they appear in the window): the lamp, the desk's edge, the laptop's reflected screen, you at the desk, the chair opposite
export const GLASS = { LY: 40, lamp: [150, 40], screen: { x0: -110, x1: -20, y0: -20, y1: 42 }, you: [-75, 110], chair: [0, 190], chairS: 1.25,
  sitter: [2, 124], sitterS: 1.08, chest: [4, 66], witness: [4, -34], youChest: [-75, 54] };
export const YOU = { coat: '#26304a', pants: '#15142a', shoes: '#0b0a18', skin: '#8d5f40', hair: '#16111a' };

// ---------------------------------------------------------------- the room in the glass (pane-local, drawn mirrored by pane(): draw-x = −glass-x)
//   o = { lampA 1, typing, screenOn, seed 3, chairTaken (bool), witnessA 0..1, chest 0..1 (the ember in the chest of the figure at the desk),
//         thread 0..1 (its warmth flows up to the reflected screen), screenText { t0, a } (cool lines write on the reflected screen), sitterLife 1 }
export function reflectionC14(q, t, o = {}) {
  const lampA = o.lampA ?? 1, G = GLASS, LY = G.LY;
  const bg = q.createLinearGradient(0, -400, 0, 400); bg.addColorStop(0, '#0a0e22'); bg.addColorStop(1, '#070812'); q.fillStyle = bg; q.fillRect(-400, -400, 800, 800);
  const LX = -G.lamp[0];                                       // the lamp: the brightest thing in the glass
  ember(q, t, { x: LX, y: LY, kind: 'lamp', s: .55, dir: -.5, a: .9 * lampA, r: 200 });
  q.fillStyle = '#17121c'; q.fillRect(-300, LY + 44, 600, 10); q.fillStyle = '#0d0912'; q.fillRect(-300, LY + 54, 600, 60);   // the desk's edge and front
  const S = G.screen, sx0 = -S.x1, sw = S.x1 - S.x0, sh = S.y1 - S.y0;   // the laptop's reflected screen (draw-x 20..110)
  if (o.screenOn !== false) {
    const boost = 1 + (o.screenBoost ?? 0);
    q.fillStyle = '#0d1a36'; q.fillRect(sx0, S.y0, sw, sh); addGlow(q, sx0 + sw / 2, (S.y0 + S.y1) / 2, 120, .25 * boost, F6.cool, F6.coolCore);
    if (o.screenText && o.screenText.a > 0) { q.save(); q.beginPath(); q.rect(sx0, S.y0, sw, sh); q.clip(); coolText(q, t, { x: sx0 + 7, y: S.y0 + 6, w: sw - 14, size: 4.2, lineH: 8, lines: 6, cps: 26, gap: .18, seed: 61, t0: o.screenText.t0, a: o.screenText.a, cursor: false }); q.restore(); }
    if (o.screenBoost > 0) { q.fillStyle = rgba(F6.coolCore, .35 * o.screenBoost); q.fillRect(sx0, S.y0 - 1, sw, 2.5); }
  }
  // the ember in the chest of you at the desk (seen from the side-back: the body hides its core, its warmth spills around the silhouette)
  const YX = -G.you[0], YY = G.you[1];
  if (o.chest > 0) { const c = eout(clamp(o.chest)); ember(q, t, { x: -G.youChest[0], y: G.youChest[1], kind: 'heart', r: 95 * c, a: .95 * c }); }
  figureDesk(q, t, YX, YY, 1.15, { seed: o.seed ?? 3, typing: o.typing !== false, lamp: { x: LX, y: LY - 100 }, screen: { x: sx0 + sw / 2, y: LY - 30 }, lampA, screenA: o.screenOn !== false ? 1 : 0, shade: .25, chair: true });
  if (o.chest > 0) { // the warm rim the ember gives the shoulders, and the thread that leaves the chest for the screen
    const c = eout(clamp(o.chest)); q.save(); q.globalCompositeOperation = 'lighter'; const rg = q.createRadialGradient(YX, YY - 62, 0, YX, YY - 62, 46); rg.addColorStop(0, rgba(F6.amber, .3 * c)); rg.addColorStop(1, rgba(F6.amber, 0)); q.fillStyle = rg; q.fillRect(YX - 50, YY - 115, 100, 100); q.restore();
    const u = clamp(o.thread ?? 0); if (u > 0) {
      const n = once('c14:thread', () => vnoise(41)), a0 = [-G.youChest[0], G.youChest[1]], a1 = [sx0 + sw * .55, S.y1 + 2], mid = [(a0[0] + a1[0]) / 2 + 10 + 4 * (n(t * 1.3, 2) - .5), (a0[1] + a1[1]) / 2 + 8];
      const e = QUART(u), pts = []; for (let i = 0; i <= 24; i++) { const k = i / 24 * e, p = (1 - k) * (1 - k), r2 = 2 * k * (1 - k), s2 = k * k; pts.push([p * a0[0] + r2 * mid[0] + s2 * a1[0], p * a0[1] + r2 * mid[1] + s2 * a1[1]]); }
      q.save(); q.globalCompositeOperation = 'lighter'; q.lineCap = 'round'; const tg = q.createLinearGradient(a0[0], a0[1], a1[0], a1[1]); tg.addColorStop(0, rgba(F6.amber, .7)); tg.addColorStop(.6, rgba(F6.amber, .5)); tg.addColorStop(1, rgba(F6.cool, .7));
      for (const [lw, al] of [[7, .14], [2.4, .6], [1, .95]]) { q.strokeStyle = tg; q.globalAlpha = al; q.lineWidth = lw; q.beginPath(); pts.forEach((p, i) => (i ? q.lineTo(p[0], p[1]) : q.moveTo(p[0], p[1]))); q.stroke(); }
      q.globalAlpha = 1; const tip = pts[pts.length - 1]; if (e < 1) { const hg = q.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 9); hg.addColorStop(0, rgba('#fff6e6', .95)); hg.addColorStop(1, rgba(F6.amber, 0)); q.fillStyle = hg; q.fillRect(tip[0] - 9, tip[1] - 9, 18, 18); }
      q.restore();
    }
  }
  // the lamp's pool on the floor in front of the desk, so the chair stands in light
  q.save(); q.globalCompositeOperation = 'lighter'; q.translate(LX + 60, LY + 150); q.scale(1, .3); const pg = q.createRadialGradient(0, 0, 0, 0, 0, 260); pg.addColorStop(0, rgba(F6.amber, .16 * lampA)); pg.addColorStop(1, rgba(F6.amber, 0)); q.fillStyle = pg; q.beginPath(); q.arc(0, 0, 260, 0, TAU); q.fill(); q.restore();
  // across the desk, nearest the glass: the chair (the ★ of 1.06 and 14.04), lamp-lit from its right; in 14.08 taken by you, facing us
  chairC01(q, t, -G.chair[0], G.chair[1], G.chairS, lampA, -1, true);
  if (o.chairTaken) {
    const s = G.sitterS, x = -G.sitter[0], y = G.sitter[1];
    if (o.sitterGlow > 0) { // the ember has settled in the chest: its warmth answers on the body (80 ms after the arrival)
      q.save(); q.globalCompositeOperation = 'lighter'; const cg = q.createRadialGradient(-G.chest[0], G.chest[1], 0, -G.chest[0], G.chest[1], 70); cg.addColorStop(0, rgba(F6.amber, .45 * o.sitterGlow)); cg.addColorStop(1, rgba(F6.amber, 0)); q.fillStyle = cg; q.fillRect(-G.chest[0] - 70, G.chest[1] - 70, 140, 140); q.restore();
    }
    const pose = { ...POSES.perch, sh: [.52, .46], el: [1.05, 1.1], head: .04, turn: 1, hands: ['relaxed', 'relaxed'] };
    figure(q, x, y, s, pose, { t, seed: (o.seed ?? 3) + 2, dress: YOU, light: { x: LX, y: LY - 100, col: F6.amberCore, a: .5 * lampA }, rim: rgba(F6.amberCore, .75 * lampA), rimSide: -1, shadow: false });
    if (o.witnessA > 0) witness(q, t, { x: -G.witness[0], y: G.witness[1], r: 4, halo: 64, a: o.witnessA });
  }
}

// ---------------------------------------------------------------- the window pane over nightRoom's window (call nightRoom with window: { reflectA: 0 })
//   o = { reflectA, throughA, yaw, through(ctx, t) (screen space), fog {x, y, rx, ry, a} (glass coords), ...reflectionC14 options }
//   → { P (the pane: path(), local()), m (camMap of the wall plane) }
export function windowC14(ctx, t, cam, o = {}) {
  const Wd = ROOM.window, rA = clamp(o.reflectA ?? 1), tA = clamp(o.throughA ?? 0), m = camMap(cam, .85);
  let P = null;
  view(ctx, cam, .85, (g) => {
    P = pane(g, t, { x: Wd.x, y: Wd.y, w: Wd.w, h: Wd.h, frame: 'window', edge: .35, radius: 0, sheen: o.sheen ?? 0, yaw: o.yaw ?? 0, reflectA: rA, reflectDim: .5,
      reflect: (q) => reflectionC14(q, t, o),
      through: o.through ? (q) => { q.save(); q.setTransform(1, 0, 0, 1, 0, 0); o.through(q, t); q.restore(); } : undefined, throughA: o.through ? tA : 0 });
    if (o.fog && o.fog.a > 0) { g.save(); P.path(); g.clip(); g.translate(Wd.x, Wd.y); breathFog(g, o.fog.x, o.fog.y, o.fog.a, o.fog.rx, o.fog.ry); g.restore(); }
  });
  return { P, m, X: (gx) => m.X(Wd.x + gx), Y: (gy) => m.Y(Wd.y + gy), path: () => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.transform(m.k, 0, 0, m.k, m.tx, m.ty); P.path(); ctx.restore(); } };
}

// ---------------------------------------------------------------- the interview clip on the laptop's screen (over the chat): screen-local, w × h
export function clipOnLaptop(g, t, T, id, w, h, o = {}) {
  const c = T.clip(id), ramp = o.ramp ?? .5;
  const on = sm(lin(c.start - ramp, c.start, t)) * (1 - sm(lin(c.end, c.end + ramp, t)));
  const pre = sm(lin(c.start - ramp - .4, c.start - ramp, t)) * (1 - sm(lin(c.end + ramp, c.end + ramp + .4, t)));
  if (on <= 0) { if (pre > 0) coolLine(g, t, { from: [6, h / 2], to: [w - 6, h / 2], a: pre, head: false, w: .7, glow: .6, ticks: false }); return { on, pre }; }
  const open = eout(on), hv = Math.max(1.5, h * open), k = Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1, fr = clipFrame(id, k);
  g.save(); g.beginPath(); g.rect(0, h / 2 - hv / 2, w, hv); g.clip();
  if (fr) { const s = Math.max(w / fr.width, h / fr.height), dw = fr.width * s, dh = fr.height * s; g.drawImage(fr, (w - dw) / 2, (h - dh) / 2, dw, dh); }
  else { g.fillStyle = '#1a2a4a'; g.fillRect(0, 0, w, h); }
  g.globalAlpha = .06; g.fillStyle = '#000'; for (let yy = 0; yy < h; yy += 2) g.fillRect(0, yy, w, .8); g.globalAlpha = 1;
  const vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .35, w / 2, h / 2, Math.max(w, h) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, rgba(F6.glassBot, .4)); g.fillStyle = vg; g.fillRect(0, 0, w, h);
  g.restore();
  if (on < .999) { const k2 = 1 - on; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; for (const yy of [h / 2 - hv / 2, h / 2 + hv / 2]) for (const [lw2, al] of [[8, .08], [2.6, .25], [.8, .95]]) { g.strokeStyle = rgba(lw2 < 1 ? F6.coolCore : F6.cool, al * (.4 + .6 * k2)); g.lineWidth = lw2; g.beginPath(); g.moveTo(-w, yy); g.lineTo(w * 2, yy); g.stroke(); } g.restore(); }
  return { on, pre };
}

// ---------------------------------------------------------------- the split (copy of f6_kit splitLight; ember and line extents free)
//   o = { x, y (the line's centre and baseline), x0, x1 (override the line's extent), lineA 1, u (the separation 0..1), rise 100, ex, ey (ember override),
//         emberR 120, emberA 1, labelA 0, bpm 60, dip (override), flameA 1 }
export function splitC14(ctx, t, o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H * .55, x0 = o.x0 ?? x - 550, x1 = o.x1 ?? x + 550, u = clamp(o.u ?? 1), e = eout(u), rise = o.rise ?? 100;
  const ex = o.ex ?? x, ey = o.ey ?? y - rise * e, lineA = o.lineA ?? 1, emberR = o.emberR ?? 120, bpm = o.bpm ?? 60;
  const dip = o.dip ?? Math.sin(Math.PI * clamp(u * 1.6)) * .5;
  if (lineA > 0) {
    ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
    const wob = 1.5 * Math.sin(t * .9);
    for (const [w2, al] of [[26, .05], [10, .14], [3.2, .55], [1.4, .95]]) { const gg = ctx.createLinearGradient(x0, 0, x1, 0), c = w2 < 2 ? F6.coolCore : F6.cool; gg.addColorStop(0, rgba(c, al * lineA * .2)); gg.addColorStop(.5, rgba(c, al * lineA * (1 - dip))); gg.addColorStop(1, rgba(c, al * lineA * .2)); ctx.strokeStyle = gg; ctx.lineWidth = w2; ctx.beginPath(); ctx.moveTo(x0, y + wob); ctx.lineTo(x1, y + wob); ctx.stroke(); }
    ctx.strokeStyle = rgba(F6.coolCore, .35 * lineA); ctx.lineWidth = 1; ctx.beginPath(); for (let px = x0; px < x1; px += 9) { const h = 2 + 1.5 * Math.sin(px * .07 + t); ctx.moveTo(px, y - h); ctx.lineTo(px + 3, y + h); } ctx.stroke();
    ctx.restore();
  }
  const ea = o.emberA ?? 1;
  if (u > 0 && ea > 0) {
    if (u < .85 && o.ex == null) { const k = 1 - clamp((u - .55) / .3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const tg = ctx.createLinearGradient(0, y, 0, ey); tg.addColorStop(0, rgba(F6.cool, .5 * k)); tg.addColorStop(.5, rgba(F6.amber, .6 * k)); tg.addColorStop(1, rgba(F6.amber, .2 * k)); ctx.strokeStyle = tg; ctx.lineWidth = 2.2 * k + .4; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 12 * Math.sin(t * 2.3), (y + ey) / 2, x, ey + 18); ctx.stroke(); ctx.restore(); }
    ember(ctx, t, { x: ex, y: ey, kind: 'heart', r: emberR * (.35 + .65 * e), a: (.55 + .45 * e) * ea, bpm });
    const n = once('c14:splitnoise', () => vnoise(23)), sw = (n(t * 1.6, 1) - .5) * 10 * e, br = breathe(t, bpm, 0, 'heart');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(ex, ey); const fh = emberR * .45 * e * br * (o.flameA ?? 1);
    if (fh > 1) { const fg = ctx.createRadialGradient(0, fh * .1, 0, 0, 0, fh * 1.1); fg.addColorStop(0, rgba('#ffffff', .95 * ea)); fg.addColorStop(.25, rgba(F6.amberCore, .9 * ea)); fg.addColorStop(.6, rgba(F6.amber, .5 * ea)); fg.addColorStop(1, rgba(F6.amberDeep, 0));
      ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, fh * .55); ctx.bezierCurveTo(-fh * .6, fh * .2, -fh * .45, -fh * .5, sw * .3, -fh); ctx.bezierCurveTo(fh * .45, -fh * .5, fh * .6, fh * .2, 0, fh * .55); ctx.fill(); }
    ctx.restore();
  }
  const la = clamp(o.labelA ?? 0);
  if (la > 0) {
    const lab = (s, lx, ly, c) => reveal(ctx, lx - 160, ly - 24, 320, 34, la, (g) => text(g, s, lx, ly, { size: 17, weight: 600, color: c, align: 'center', spacing: 7 }));
    lab('INTELLIGENCE', x, y + 48, rgba(F6.cool, .9)); lab('CONSCIOUSNESS', ex, ey - 70 - emberR * .18, rgba(F6.amberCore, .92));
  }
  return { ember: [ex, ey] };
}

// ---------------------------------------------------------------- the incoming lamp plate: masked by a glow-shaped falloff that shrinks into the lamp
const DISC = canvas(W, H);
export function openingLight(ctx, t, HI, cx, cy, k) {
  if (k <= 0) return;
  // an opaque core of light (the whole frame at k 1) with a soft stippled-looking falloff beyond it; the core shrinks into the bulb's bloom
  const [disc, dg] = DISC, r0 = 60 + 1320 * Math.pow(k, .8), Rr = r0 * 2.1, A = Math.min(1, k * 6);
  dg.setTransform(1, 0, 0, 1, 0, 0); dg.globalCompositeOperation = 'source-over'; dg.globalAlpha = 1; dg.clearRect(0, 0, W, H);
  HI.plate(dg, t);
  const gr = dg.createRadialGradient(cx, cy, 0, cx, cy, Rr); gr.addColorStop(0, `rgba(0,0,0,${A})`); gr.addColorStop(r0 / Rr, `rgba(0,0,0,${A})`); gr.addColorStop(r0 / Rr + .25, `rgba(0,0,0,${.42 * A})`); gr.addColorStop(.85, `rgba(0,0,0,${.08 * A})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
  dg.globalCompositeOperation = 'destination-in'; dg.fillStyle = gr; dg.fillRect(0, 0, W, H);
  ctx.drawImage(disc, 0, 0);
}

// ---------------------------------------------------------------- the glass's tint and sliding sheen, in screen space (what pane() draws over its through)
export function glassVeil(ctx, t, m, a) {
  if (a <= 0) return; const Wd = ROOM.window, w = Wd.w, h = Wd.h;
  ctx.save(); ctx.setTransform(m.k, 0, 0, m.k, m.tx, m.ty); ctx.translate(Wd.x, Wd.y);
  ctx.fillStyle = rgba('#0a0f24', .14 * a); ctx.fillRect(-w * 3, -h * 3, w * 6, h * 6);
  ctx.restore();
}
