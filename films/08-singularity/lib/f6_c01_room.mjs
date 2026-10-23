// Film 6 · c01 (the hook) · helpers owned by the c01 builder. Everything is a pure function of t.
//   camPath(keys, t)            camera keyframes [{ t, x, y, z, e: 'io'|'lin'|'out' }] → { x, y, z } (quart in-out between keys)
//   reflectionC01(q, t, o)      the hook room as the window glass sees it (a COPY of f6_kit's roomReflection with the empty chair moved
//                               INTO the pane: in K0's layout the chair sits at pane-local +210 of a 200-wide half pane, i.e. nearly outside
//                               the glass; here lamp +150, chair +60, you −45, laptop −80..+10, so the chair is the ★ motif of 1.06)
//   chairC01(g, t, x, y, s, lampA, rimSide)   a COPY of f6_kit's chairFront with the lit rim on either side
//   windowC01(ctx, t, cam, o)   the window pane drawn OVER nightRoom's window (same geometry, same transform) with reflectionC01 inside,
//                               the title written as light in the glass, a breath of fog, and the c01>c02 glass plate as the glass itself
//                               (through = HO.plate in screen space), so the push into the pane lands exactly in the plate
//   harshWindow(g, t, o)        the second, anonymous chat window on the laptop screen (1.07–1.10): opens from a cool line, jagged cold
//                               text, goes dark, folds shut, the line collapses
//   sourceLine(ctx, t, u)       the on-screen source (Inter caps) written by the cool line, above the subtitle band
//   darkAround(ctx, x, y, k)    the room darkens around the screen (1.03)
//   piecewise(pts, t)           linear interpolation through [[t, v], …] (the typed text's progress with pause, delete, retype)
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, eio, prng, text, addGlow } from '../engine.mjs';
import { F6, pane, ember, coolText, coolLine, figureDesk, view, reveal, ROOM, breathe } from './f6_kit.mjs';

const TAU = Math.PI * 2;
export const quart = (u) => (u < .5 ? 8 * u * u * u * u : 1 - Math.pow(-2 * u + 2, 4) / 2);   // ≈ cubic-bezier(.76, 0, .24, 1)
export const expoOut = (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));                        // ≈ (.16, 1, .3, 1)

export function camPath(keys, t) {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) { const u = clamp((t - a.t) / Math.max(1e-6, b.t - a.t)), e = b.e === 'lin' ? u : b.e === 'out' ? expoOut(u) : b.e === 'cubic' ? eio(u) : quart(u); return { x: mix(a.x, b.x, e), y: mix(a.y, b.y, e), z: mix(a.z, b.z, e) }; }
  }
  const k = keys[keys.length - 1]; return { x: k.x, y: k.y, z: k.z };
}
export function piecewise(pts, t) {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) return mix(pts[i - 1][1], pts[i][1], (t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
  return pts[pts.length - 1][1];
}

// ---------------------------------------------------------------- the chair opposite (copy of f6_kit chairFront; rimSide = which side the lamp lights)
export function chairC01(g, t, x, y, s, lampA = 1, rimSide = 1, lit = false) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const C0 = lit ? ['#121828', '#222a46', '#3c4a70'] : ['#0d1020', '#1b2034', '#2d3652'];
  const back = g.createLinearGradient(-30 * rimSide, -100, 30 * rimSide, -100); back.addColorStop(0, C0[0]); back.addColorStop(.75, C0[1]); back.addColorStop(1, C0[2]); g.fillStyle = back;
  g.beginPath(); g.roundRect(-34, -118, 68, 70, [14, 14, 4, 4]); g.fill();                                            // backrest
  if (lit) { g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.roundRect(-26, -108, 52, 44, 8); g.fill(); }             // the backrest's hollow
  g.fillStyle = lit ? '#1d2540' : '#141a2c'; g.beginPath(); g.roundRect(-40, -50, 80, 16, 5); g.fill();                   // seat
  if (lit) { g.fillStyle = rgba('#ffd9a8', .25 * lampA); g.fillRect(-40 + (rimSide > 0 ? 44 : 0), -50, 36, 2); }         // the lamp on the seat's edge
  g.strokeStyle = lit ? '#1a2238' : '#0d1020'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(-32, -34); g.lineTo(-30, 0); g.moveTo(32, -34); g.lineTo(30, 0); g.moveTo(-26, -34); g.lineTo(-22, -8); g.moveTo(26, -34); g.lineTo(22, -8); g.stroke();
  if (lit) { g.strokeStyle = rgba('#ffd9a8', .35 * lampA); g.lineWidth = 1; g.beginPath(); g.moveTo(32 * rimSide + 1.5 * rimSide, -34); g.lineTo(30 * rimSide + 1.5 * rimSide, 0); g.moveTo(26 * rimSide + 1.5 * rimSide, -34); g.lineTo(22 * rimSide + 1.5 * rimSide, -8); g.stroke(); }   // lit legs
  g.strokeStyle = rgba('#ffd9a8', (lit ? .6 : .45) * lampA); g.lineWidth = 1.2; g.beginPath(); g.moveTo(32 * rimSide, -116); g.quadraticCurveTo(34 * rimSide, -100, 33 * rimSide, -50); g.stroke();   // the lamp's rim
  g.strokeStyle = rgba(F6.cool, .18); g.beginPath(); g.moveTo(-32 * rimSide, -116); g.quadraticCurveTo(-34 * rimSide, -100, -33 * rimSide, -50); g.stroke();             // the screen's cool rim
  g.restore();
}

// ---------------------------------------------------------------- the room in the glass (pane-local, drawn mirrored by pane(): reflect-x = −pane-x)
//   o = { lampA, typing, screenOn, seed }
export function reflectionC01(q, t, o = {}) {
  const lampA = o.lampA ?? 1;
  const bg = q.createLinearGradient(0, -400, 0, 400); bg.addColorStop(0, '#0a0e22'); bg.addColorStop(1, '#070812'); q.fillStyle = bg; q.fillRect(-400, -400, 800, 800);
  const LX = -150, LY = 40;                                   // the lamp: pane-local +150, the brightest thing in the glass
  ember(q, t, { x: LX, y: LY, kind: 'lamp', s: .55, dir: -.5, a: .9 * lampA, r: 200 });
  q.fillStyle = '#17121c'; q.fillRect(-300, LY + 44, 600, 10); q.fillStyle = '#0d0912'; q.fillRect(-300, LY + 54, 600, 60);   // the desk's edge and front
  if (o.screenOn !== false) { q.fillStyle = '#0d1a36'; q.fillRect(20, LY - 60, 90, 62); addGlow(q, 65, LY - 30, 120, .25, F6.cool, F6.coolCore); }   // the laptop's cool glow (pane-local −110..−20)
  // you, dark, seen from the side-back in the glass (pane-local −75)
  figureDesk(q, t, 75, LY + 70, 1.15, { seed: o.seed ?? 3, typing: o.typing !== false, lamp: { x: LX, y: LY - 100 }, screen: { x: 65, y: LY - 30 }, lampA, screenA: o.screenOn !== false ? 1 : 0, shade: .25, chair: true });
  // the lamp's pool on the floor in front of the desk, so the chair stands in light
  q.save(); q.globalCompositeOperation = 'lighter'; q.translate(LX + 60, LY + 150); q.scale(1, .3); const pg = q.createRadialGradient(0, 0, 0, 0, 0, 260); pg.addColorStop(0, rgba(F6.amber, .16 * lampA)); pg.addColorStop(1, rgba(F6.amber, 0)); q.fillStyle = pg; q.beginPath(); q.arc(0, 0, 260, 0, TAU); q.fill(); q.restore();
  // across the desk, nearest the glass: the empty chair (pane-local 0, the ★ of 1.06 and the last thing to go dark in 1.12), lamp-lit from its right
  chairC01(q, t, 0, LY + 150, 1.25, lampA, -1, true);
}
// a breath of condensation on the glass (pane-local, over the chair): soft, elliptical, stippled, no hard edge
export function breathFog(g, x, y, a, rx = 150, ry = 115) {
  if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(1, ry / rx);
  const fg = g.createRadialGradient(0, 0, 0, 0, 0, rx); fg.addColorStop(0, rgba('#a8b6cc', .3 * a)); fg.addColorStop(.3, rgba('#a8b6cc', .22 * a)); fg.addColorStop(.65, rgba('#9fb0c8', .09 * a)); fg.addColorStop(1, rgba('#9fb0c8', 0));
  g.fillStyle = fg; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill();
  const r = prng(77); g.fillStyle = rgba('#c8d4e6', .18 * a);
  for (let i = 0; i < 160; i++) { const an = r() * TAU, d = Math.sqrt(r()) * rx * .95, k = 1 - d / rx; if (r() > k * 1.3) continue; g.fillRect(Math.cos(an) * d, Math.sin(an) * d, 1.2, 1.2); }
  g.restore();
}

// ---------------------------------------------------------------- the window pane over nightRoom's window (call nightRoom with window: { reflectA: 0 })
//   o = { reflectA 1, fog {x, y, r, a} (pane-local), title: { lines, u: [u per line], size 50, y0 -60, dy 78 }, plate(ctx, t) (the c01>c02 glass plate),
//         lampA, typing, screenOn, seed }
//   The glass IS the plate: pane(through = plate drawn in screen space, clipped to the pane); the reflection lies on it as light (rA).
//   When rA has reached 0 the plate is drawn once more on top, raw, so the frame equals film.mjs's plate exactly (no 14 % tint of pane()).
export function windowC01(ctx, t, cam, o = {}) {
  const Wd = ROOM.window, rA = clamp(o.reflectA ?? 1);
  view(ctx, cam, .85, (g) => {
    const P = pane(g, t, { x: Wd.x, y: Wd.y, w: Wd.w, h: Wd.h, frame: 'window', edge: .35, radius: 0, sheen: 0, reflectA: rA, reflectDim: .5,
      reflect: (q) => reflectionC01(q, t, o),
      through: (q) => { q.save(); q.setTransform(1, 0, 0, 1, 0, 0); o.plate(q, t); q.restore(); }, throughA: 1 });
    if (rA <= 0) { g.save(); P.path(); g.clip(); g.setTransform(1, 0, 0, 1, 0, 0); o.plate(g, t); g.restore(); }
    if (o.fog && o.fog.a > 0) { g.save(); P.path(); g.clip(); g.translate(Wd.x, Wd.y); breathFog(g, o.fog.x, o.fog.y, o.fog.a, o.fog.rx, o.fog.ry); g.restore(); }
    const Tt = o.title;
    if (Tt && Tt.u && Tt.u.some((u) => u > 0)) {   // the title writes itself in the glass as light (1.11), inside the pane
      const L = Tt.lines || ["AI Isn't Conscious.", "That's the Problem."], size = Tt.size ?? 50, y0 = Tt.y0 ?? -66, dy = Tt.dy ?? 78;
      g.save(); P.path(); g.clip();
      L.forEach((s, i) => { const u = clamp(Tt.u[i] ?? 0); if (u > 0) coolLine(g, t, { write: { text: s, x: Wd.x, y: Wd.y + y0 + i * dy, size, align: 'center', lead: 60, lag: 40, fill: .92 }, u, glow: .6, w: 1.2 }); });
      g.restore();
    }
  });
}

// ---------------------------------------------------------------- the anonymous chat window on the laptop screen (screen-local coords, x,y = centre)
//   o = { x, y, w, h, tLine0 (a cool line appears at the centre), tOpen (it opens), tText0 (the harsh text starts), tClose0 (it goes dark, then
//         folds shut, then the line collapses), cps 20, lines 12, seed 11, retreat .45 (s of text that un-writes while it goes dark) }
export function harshWindow(g, t, o) {
  const { x, y, w, h } = o;
  if (t < o.tLine0) return;
  const lineU = sm(lin(o.tLine0, o.tLine0 + .2, t));
  const open = eout(lin(o.tOpen, o.tOpen + .45, t));
  const dark = sm(lin(o.tClose0, o.tClose0 + .3, t));
  const fold = 1 - ein(lin(o.tClose0 + .3, o.tClose0 + .75, t));
  const gone = lin(o.tClose0 + .75, o.tClose0 + .95, t);
  if (gone >= 1) return;
  const on = open * fold, hv = Math.max(2, h * on);
  if (hv > 2.5) {
    pane(g, t, { x, y, w, h: hv, frame: 'thin', radius: 3, edge: .9, spill: false, sheen: .5, screenA: 1 - dark, screen: (q, pw, ph) => {
      q.translate(0, (ph - h) / 2);
      const el = Math.max(0, Math.min(t, o.tClose0) - o.tText0) - dark * (o.retreat ?? .45);   // the last glyphs retreat as it goes dark
      coolText(q, t, { x: 10, y: 8, w: w - 20, size: 8, lines: o.lines ?? 12, lineH: 14, cps: o.cps ?? 20, gap: .25, seed: o.seed ?? 11, t0: t - el, harsh: 1, ripple: false, cursor: dark < .5 });
    } });
  }
  // the line the window opens from and collapses into (it IS the pane's lit edges while they are close together)
  const a = hv > 2.5 ? 1 - lin(4, 16, hv) : 1;
  if (a > 0) { const len = (w / 2 + 2) * (open <= 0 ? lineU : fold < 1 && hv <= 2.5 ? 1 - gone : 1); if (len > .5) coolLine(g, t, { from: [x - len, y], to: [x + len, y], w: 1.1, glow: .8, head: false, a, ticks: false }); }
}

// ---------------------------------------------------------------- the source line (Inter caps), written by the cool line, baseline y 850 (bottom 170 px free)
export const SRC_ANTHROPIC = 'ANTHROPIC  ·  ITS MODELS CAN END PERSISTENTLY ABUSIVE CONVERSATIONS  ·  SINCE AUG 2025';
export function sourceLine(ctx, t, u, s = SRC_ANTHROPIC, x = 110, y = 850) {
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.font = '600 17px "Inter"'; const wmax = ctx.measureText(s).width + s.length * 4 + 16; ctx.restore();
  const lineU = clamp(u * 1.6), textU = clamp((u - .25) / .75);
  coolLine(ctx, t, { from: [x, y + 16], to: [x + wmax, y + 16], u: lineU, w: 1.2, glow: .5, head: u < 1 });
  reveal(ctx, x - 4, y - 22, wmax + 8, 32, textU, (g) => text(g, s, x, y, { size: 17, weight: 600, color: rgba(F6.cool, .88), spacing: 4 }));
}

// ---------------------------------------------------------------- the room darkens around the screen (1.03): a soft dark field, the screen stays lit
export function darkAround(ctx, x, y, k) {
  if (k <= 0) return;
  const g = ctx.createRadialGradient(x, y, 230, x, y, 1150); g.addColorStop(0, 'rgba(4,5,14,0)'); g.addColorStop(.45, rgba('#04050e', .22 * k)); g.addColorStop(1, rgba('#04050e', .62 * k));
  ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
