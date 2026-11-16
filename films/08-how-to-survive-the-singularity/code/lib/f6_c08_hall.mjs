// Film 6 · c08 · the researchers' hall (8.06–8.10): half-dark desks, each with a small lamp (the embers), a dark screen and someone writing;
// the near desk: a researcher in profile sets words into a ruled frame on a cream sheet with a pen (DESCRIBED · TRAINED · TESTED); a display on
// the wall shows the library of words; one desk's screen turns toward us and becomes the window on Hinton; its glow swells into the lamp plate.
// Copied: clipPane from lib/f6_kit.mjs (as clipPane8: the haze and the band lines ramp in over the first .12 of the switch-on, on override, last
// frame fallback), penProp from scenes/sc03.mjs.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas, text, addGlow, hatch } from '../engine.mjs';
import { F6, once, layer, pane, coolText, coolLine, ember, figureDesk, letterpress, breathe, riseFromDark } from './f6_kit.mjs';
import { clipFrame } from './kit.mjs';
import { fibreFill } from './print.mjs';
import { stipple } from './art.mjs';
import { paperSheet } from './paper.mjs';
import { figure, reachArm, handPos } from './figure.mjs';

const TAU = Math.PI * 2;
export const HORIZON = 500;
export const DISP = { x: 1180, y: 400, w: 300, h: 168.75 };          // the wall display over the near desk (the library plays on it)
export const NEAR = { x0: 762, x1: 1250, yTop: 770, yFront: 800, lamp: [1010, 772], seat: [690, 800], s: 1.55, seed: 11 };
export const SHEET = { x: 772, y: 742, w: 132, h: 90, rot: -.03, sq: .55 };    // the cream sheet on the near desk (local units, squashed by the view from above)
export const FRAME = { x: 11, y: 9, w: 110, h: 64 };                            // the ruled frame on the sheet (sheet units)
export const WORDS = ['DESCRIBED', 'TRAINED', 'TESTED'];
export const HS = { x: 1710, y: 600, w: 260, h: 146.25 };                      // the Hinton desk's screen (turns toward us)
export const DESKS = [
  { x0: 1370, x1: 1830, yTop: 770, yFront: 800, lamp: [1394, 772], seat: [1484, 836], s: 1.3, seed: 21, screen: HS, hinton: true },
  { x0: 150, x1: 560, yTop: 770, yFront: 800, lamp: [185, 772], seat: [400, 836], s: 1.3, seed: 24, screen: { x: 460, y: 612, w: 180, h: 101 } },
];
export const FAR = [   // the far row (parallax .95, smaller)
  { x: 420, seed: 31 }, { x: 1010, seed: 32 }, { x: 1560, seed: 33 }, { x: 2150, seed: 34 },
];
const quartIO = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));

// ---------------------------------------------------------------- the room: the far wall and the floor, cached
function hallBack() {
  return layer('c08hall', 4200, 1600, (g, c) => {
    g.translate(1100, 200);   // world (−1100 … 3100, −200 … 1400)
    const bg = g.createLinearGradient(0, -200, 0, HORIZON); bg.addColorStop(0, '#080b1a'); bg.addColorStop(1, '#101631'); g.fillStyle = bg; g.fillRect(-1100, -200, 4200, HORIZON + 200);
    const fl = g.createLinearGradient(0, HORIZON, 0, 1400); fl.addColorStop(0, '#141a33'); fl.addColorStop(.35, '#10152a'); fl.addColorStop(1, '#090b16'); g.fillStyle = fl; g.fillRect(-1100, HORIZON, 4200, 900);
    g.fillStyle = 'rgba(140,150,190,.16)'; g.fillRect(-1100, HORIZON - 1, 4200, 2); g.fillStyle = 'rgba(3,4,12,.5)'; g.fillRect(-1100, HORIZON - 14, 4200, 13);
    // the wall's plaster: fibre and an engraved hatch in the dark; a faint band of windows high up, unlit (night)
    g.beginPath(); g.rect(-1100, -200, 4200, HORIZON + 200); fibreFill(g, .05);
    hatch(g, null, -.85, 7, .04, { box: [-1100, -200, 4200, HORIZON + 200], col: '#000000', w: .8, wobble: .6 });
    for (let x = -900; x < 3100; x += 420) { g.fillStyle = 'rgba(3,4,12,.6)'; g.fillRect(x, 40, 200, 150); g.fillStyle = 'rgba(90,110,160,.1)'; g.fillRect(x, 40, 200, 2); g.fillStyle = 'rgba(30,40,80,.5)'; g.fillRect(x + 96, 40, 6, 150); }
    // the floor's boards
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; g.beginPath(); for (let x = -1100; x < 3100; x += 110) { g.moveTo(x, HORIZON); g.lineTo(x - 260, 1400); } g.stroke();
    stipple(c, { k: .2, g: 1, seed: 12, mid: false, boost: 1 });
  });
}
export function hallRoom(g, t, B) { g.drawImage(hallBack(), -1100, -200); }

// ---------------------------------------------------------------- a desk: top slab in light perspective, front edge, a lamp (ember), a screen
export function deskSlab(g, D, o = {}) {
  const { x0, x1, yTop, yFront } = D, k = o.k ?? 1;
  g.save();
  g.fillStyle = 'rgba(3,3,10,.55)'; g.beginPath(); g.ellipse((x0 + x1) / 2, yFront + 40 * k, (x1 - x0) * .55, 18 * k, 0, 0, TAU); g.fill();
  const tg = g.createLinearGradient(0, yTop, 0, yFront); tg.addColorStop(0, '#2a2538'); tg.addColorStop(1, '#3a3148'); g.fillStyle = tg;
  g.beginPath(); g.moveTo(x0 + 18 * k, yTop); g.lineTo(x1 - 18 * k, yTop); g.lineTo(x1, yFront); g.lineTo(x0, yFront); g.closePath(); g.fill();
  const r = prng(D.seed || 5); g.strokeStyle = 'rgba(10,6,10,.25)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 9; i++) { const yy = yTop + r() * (yFront - yTop); g.moveTo(x0 + 10 * k, yy); g.lineTo(x1 - 10 * k, yy + (r() - .5) * 4); } g.stroke();
  if (D.lamp) { g.save(); g.beginPath(); g.moveTo(x0 + 18 * k, yTop); g.lineTo(x1 - 18 * k, yTop); g.lineTo(x1, yFront); g.lineTo(x0, yFront); g.closePath(); g.clip(); g.globalCompositeOperation = 'lighter'; const px = D.lamp[0] + (o.lampDir ?? -1) * 150 * k, py = (yTop + yFront) / 2; g.translate(px, py); g.scale(1, (yFront - yTop) / 300 / k); const pg = g.createRadialGradient(0, 0, 0, 0, 0, 260 * k); pg.addColorStop(0, rgba(F6.amber, .34)); pg.addColorStop(.5, rgba(F6.amber, .12)); pg.addColorStop(1, rgba(F6.amber, 0)); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 260 * k, 0, TAU); g.fill(); g.restore(); }
  g.fillStyle = '#120d16'; g.fillRect(x0, yFront, x1 - x0, 22 * k); g.fillStyle = 'rgba(255,200,150,.1)'; g.fillRect(x0, yFront, x1 - x0, 2);
  g.strokeStyle = '#0d0b14'; g.lineWidth = 9 * k; g.lineCap = 'round'; g.beginPath(); for (const lx of [x0 + 24 * k, x1 - 24 * k]) { g.moveTo(lx, yFront + 20 * k); g.lineTo(lx, yFront + 150 * k); } g.stroke();
  g.restore();
}
// a dark screen on a desk: the pane with a faint block of cool text (someone's work), facing us
export function deskScreen(g, t, S, o = {}) {
  const yaw = o.yaw ?? 0, cy = Math.max(.08, Math.cos(yaw));
  g.fillStyle = '#121728'; g.fillRect(S.x - 22 * cy, S.y + S.h / 2 + 2, 44 * cy, 8); g.fillRect(S.x - 4, S.y + S.h / 2 - 2, 8, 10);
  pane(g, t, { x: S.x, y: S.y, w: S.w, h: S.h, yaw, frame: 'thin', edge: .5, radius: 3, seed: o.seed ?? 4, spill: o.spill ?? false,
    screen: o.screen || ((q, pw, ph) => coolText(q, t, { x: pw * .08, y: ph * .1, w: pw * .84, size: ph * .05, lines: 7, lineH: ph * .1, t0: -100, cps: 1e4, seed: o.seed ?? 4, cursor: false, ripple: false, a: .55 })), screenA: o.screenA ?? 1 });
}
// the lamp's light on the floor in front of the desk (additive)
export function floorPool(g, D, o = {}) { const k = o.k ?? 1; g.save(); g.globalCompositeOperation = 'lighter'; g.translate(D.lamp[0] + (o.dir ?? -1) * 120 * k, D.yFront + 95 * k); g.scale(1, .3); const pg = g.createRadialGradient(0, 0, 0, 0, 0, 330 * k); pg.addColorStop(0, rgba(F6.amber, .2)); pg.addColorStop(.5, rgba(F6.amber, .07)); pg.addColorStop(1, rgba(F6.amber, 0)); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 330 * k, 0, TAU); g.fill(); g.restore(); }
// the desk's lamp: the kit's lamp ember, small
export const deskLamp = (g, t, D, o = {}) => ember(g, t, { x: D.lamp[0], y: D.lamp[1], kind: 'lamp', s: o.s ?? .62, dir: o.dir ?? .5, r: 170, a: o.a ?? 1, cone: .75, phase: (D.seed || 0) * .13 });

// ---------------------------------------------------------------- the sheet with the ruled frame; the words pressed into it from outside
//   sheetWithFrame(g, t, { u: words pressed (0..3, fractional = the press of the current word), light: [x, y] })
export function sheetWithFrame(g, t, o = {}) {
  const S = SHEET, u = o.u ?? 0;
  g.save(); g.translate(S.x, S.y); g.rotate(S.rot); g.scale(1, S.sq);
  paperSheet(g, 0, 0, S.w, S.h, { seed: 9, tone: '#efe4cc', light: o.light ? [(o.light[0] - S.x), (o.light[1] - S.y) / S.sq] : undefined, shadow: true, content: (q, w, h) => {
    const F = FRAME;
    // the ruled frame: a double rule in ink, the engraver's corner ticks
    q.strokeStyle = 'rgba(42,36,32,.75)'; q.lineWidth = 1.1; q.strokeRect(F.x, F.y, F.w, F.h); q.strokeStyle = 'rgba(42,36,32,.35)'; q.lineWidth = .6; q.strokeRect(F.x + 3, F.y + 3, F.w - 6, F.h - 6);
    q.strokeStyle = 'rgba(42,36,32,.5)'; q.lineWidth = .8; q.beginPath(); for (let i = 1; i < 3; i++) { const yy = F.y + 4 + (F.h - 8) * i / 3; q.moveTo(F.x + 8, yy); q.lineTo(F.x + F.w - 8, yy); } q.stroke();
    // the three words, one per line of the frame, pressed in (letterpress) as they are picked
    WORDS.forEach((wd, i) => { const uu = clamp(u - i); if (uu <= 0) return; const yy = F.y + 4 + (F.h - 8) * (i + .5) / 3 + 5.5; letterpress(q, t, { x: F.x + F.w / 2, y: yy, words: [wd], u: uu, size: 15, spacing: 2, align: 'center', ink: F6.ink, gap: 0 }); });
    // a small caption under the frame (the set of rules, in the researcher's hand)
    q.fillStyle = 'rgba(42,36,32,.4)'; for (let i = 0; i < 4; i++) q.fillRect(F.x + 6 + (i % 2) * 52, F.y + F.h + 5 + Math.floor(i / 2) * 5, 40 - (i % 3) * 8, 1.2);
  } });
  g.restore();
}
// where word i sits in world space (its centre on the sheet)
export function wordPoint(i) { const F = FRAME, S = SHEET, lx = F.x + F.w / 2, ly = F.y + 4 + (F.h - 8) * (i + .5) / 3; const c = Math.cos(S.rot), s = Math.sin(S.rot), yy = ly * S.sq; return [S.x + lx * c - yy * s, S.y + lx * s + yy * c]; }

// the pen in the writer's front hand (figure units: +x forward, +y down); copied from scenes/sc03.mjs
export const penProp = (g, fa) => { const a = fa.ang + .35, dx = Math.sin(a), dy = Math.cos(a), hx = fa.hx + Math.sin(fa.ang) * 1.5, hy = fa.hy + Math.cos(fa.ang) * 1.5; g.save(); g.lineCap = 'round'; g.strokeStyle = '#2a2738'; g.lineWidth = 3; g.beginPath(); g.moveTo(hx - dx * 11, hy - dy * 11); g.lineTo(hx + dx * 20, hy + dy * 20); g.stroke(); g.strokeStyle = 'rgba(255,240,220,.45)'; g.lineWidth = .8; g.beginPath(); g.moveTo(hx - dx * 10 - dy * .8, hy - dy * 10 + dx * .8); g.lineTo(hx + dx * 17 - dy * .8, hy + dy * 17 + dx * .8); g.stroke(); g.strokeStyle = '#c9a45a'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(hx + dx * 20, hy + dy * 20); g.lineTo(hx + dx * 25, hy + dy * 25); g.stroke(); g.restore(); };

// ---------------------------------------------------------------- the researcher in profile at the near desk: seated, facing the desk (right), the pen hand
//   researcher(g, t, { hand: [x, y] | null (the pen's target on the sheet), press 0..1, light })
export function researcher(g, t, o = {}) {
  const N = NEAR, s = N.s, [x, y] = N.seat, seed = N.seed;
  // the chair: a simple side-view chair behind the hip
  g.save(); g.fillStyle = '#141a2c'; g.beginPath(); g.roundRect(x - 34 * s, y - 2 * s, 46 * s, 8 * s, 3); g.fill(); g.fillStyle = '#0f1424'; g.beginPath(); g.roundRect(x - 34 * s, y - 62 * s, 9 * s, 64 * s, 4); g.fill();
  g.strokeStyle = '#0d0b14'; g.lineWidth = 5 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 28 * s, y + 6 * s); g.lineTo(x - 30 * s, y + 46 * s); g.moveTo(x + 6 * s, y + 6 * s); g.lineTo(x + 8 * s, y + 46 * s); g.stroke(); g.restore();
  const base = { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.55, .45], el: [.95, .95], lean: .2, head: .26, hands: ['relaxed', 'relaxed'] };
  const o2 = { t, seed, accent: '#4a5d8c', dress: { pants: '#1a1a2c' }, light: o.light || { x: N.lamp[0], y: N.lamp[1] - 90, col: F6.amberCore, a: .6 }, rim: rgba(F6.amberCore, .8), rimSide: 1, shadow: false };
  let pose = base;
  if (o.hand) {
    const lean = mix(.2, .46, o.leanK ?? 1), bent = { ...base, lean, head: .36 };
    const r = reachArm(x, y, s, bent, 0, false, o2, [o.hand[0], o.hand[1] - 6 * s]);
    pose = { ...bent, sh: [r.sh, .62], el: [r.el, 1.0], hands: ['fist', 'relaxed'], lock: [true, true] };
  }
  figure(g, x, y, s, pose, { ...o2, prop: o.hand ? penProp : undefined });
  return { shoulder: [x + 8 * s, y - 60 * s] };
}

// ---------------------------------------------------------------- the clip pane with ramped haze and band lines (copy of f6_kit clipPane)
export function clipPane8(ctx, t, T, id, x, y, w, h, o = {}) {
  const c = T && T.clip ? T.clip(id) : null, ramp = o.ramp ?? .5;
  const on = o.on ?? (c ? sm(lin(c.start - ramp, c.start, t)) * (1 - sm(lin(c.end, c.end + ramp, t))) : 1);
  const u = c ? clamp((t - c.start) / Math.max(.01, c.end - c.start)) : 0, cx = x + w / 2, cy = y + h / 2, open = eout(on), hv = Math.max(2, h * open);
  const k = c ? Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1 : 1, fr = clipFrame(id, k) || (o.last && t > (c ? c.end - .2 : 0) ? o.last : null);
  const ramp0 = clamp(on / .12);    // the haze, the band lines and the spill come up over the first .12 of the switch-on (no pop)
  pane(ctx, t, { x: cx, y: cy, w, h, rot: o.rot ?? 0, yaw: o.yaw ?? 0, radius: o.radius ?? 6, frame: o.frame || 'thin', edge: (o.edge ?? .8) * (1 - .6 * on), spill: false, seed: o.seed,
    screenA: on > 0 ? Math.max(.02, ramp0) : 0, screen: (g, pw, ph) => {
      g.save(); g.beginPath(); g.rect(0, ph / 2 - hv / 2, pw, hv); g.clip();
      if (fr) { const s = Math.max(pw / fr.width, ph / fr.height), dw = fr.width * s, dh = fr.height * s; g.drawImage(fr, (pw - dw) / 2, (ph - dh) / 2, dw, dh); }
      else { const sg = g.createRadialGradient(pw * .5, ph * .35, 0, pw * .5, ph * .35, pw * .7); sg.addColorStop(0, '#2a3a6a'); sg.addColorStop(1, '#070918'); g.fillStyle = sg; g.fillRect(0, 0, pw, ph); }
      g.globalAlpha = .05; g.fillStyle = '#000'; for (let yy = 0; yy < ph; yy += 4) g.fillRect(0, yy, pw, 1.5); g.globalAlpha = 1;
      const vg = g.createRadialGradient(pw / 2, ph / 2, Math.min(pw, ph) * .35, pw / 2, ph / 2, Math.max(pw, ph) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, rgba(F6.glassBot, o.vignette ?? .4)); g.fillStyle = vg; g.fillRect(0, 0, pw, ph);
      g.restore();
      if (on > 0 && on < .999) { const k2 = 1 - on; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; for (const yy of [ph / 2 - hv / 2, ph / 2 + hv / 2]) { for (const [lw2, al] of [[18, .08], [6, .25], [1.6, .95]]) { g.strokeStyle = rgba(lw2 < 2 ? F6.coolCore : F6.cool, al * (.4 + .6 * k2) * ramp0); g.lineWidth = lw2; g.beginPath(); g.moveTo(-pw, yy); g.lineTo(pw * 2, yy); g.stroke(); } } g.restore(); }
    } });
  if (on <= 0) { const pre = c ? sm(lin(c.start - ramp - .4, c.start - ramp, t)) * (1 - sm(lin(c.end + ramp, c.end + ramp + .4, t))) : 0; if (pre > 0) coolLine(ctx, t, { from: [x + 8, cy], to: [x + w - 8, cy], a: pre, head: false, w: 1.4 }); }
  if (o.spill !== false && on > 0) addGlow(ctx, cx, cy, Math.max(w, h) * .9, .14 * on * ramp0, '#cfe0f0', '#eef4ff');
  return { on, u, line: [cy - hv / 2, cy + hv / 2] };
}

// ---------------------------------------------------------------- the glow swells: the plate grows out from the screen's edge (screen space)
//   closingLight(ctx, t, { rect: [x, y, w, h] (the screen in screen space), u (0..1), plate })  — at u 1 the plate covers the frame
export function closingLight(ctx, t, o) {
  const u = clamp(o.u); if (u <= 0) return;
  const [x, y, w, h] = o.rect, cx = x + w / 2, cy = y + h / 2;
  const [pc, pg] = once('c08plate', () => canvas(W, H)), [mc, mg] = once('c08mask', () => canvas(W, H));
  // the mask: a ring that grows out from the screen's edge (elliptic, soft outer rim); the screen itself whites out last
  const ri = mix(1.0, 2.9, u), soft = .45, inner = clamp(o.inner ?? ((u - .78) / .22));
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = 'source-over'; mg.globalAlpha = 1; mg.clearRect(0, 0, W, H);
  mg.save(); mg.translate(cx, cy); mg.scale(w / 2 * 1.02, h / 2 * 1.02);
  const rg = mg.createRadialGradient(0, 0, 0, 0, 0, ri + soft); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(ri / (ri + soft), 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  mg.fillStyle = rg; mg.fillRect(-4, -4, 8, 8); mg.restore();
  mg.globalCompositeOperation = 'destination-out'; mg.fillStyle = '#000'; mg.beginPath(); mg.roundRect(x, y, w, h, 6); mg.fill();
  mg.globalCompositeOperation = 'source-over'; mg.fillStyle = `rgba(0,0,0,${inner})`; mg.beginPath(); mg.roundRect(x, y, w, h, 6); mg.fill();
  // the plate, its bright core on the screen first and sliding to the plate's own centre as the light fills the frame
  pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-over'; pg.globalAlpha = 1; pg.clearRect(0, 0, W, H);
  const ko = Math.pow(1 - u, 1.5); pg.save(); pg.translate((cx - W / 2) * ko, (cy - H / 2) * ko); o.plate(pg, t); pg.restore();
  pg.globalCompositeOperation = 'destination-in'; pg.drawImage(mc, 0, 0);
  ctx.drawImage(pc, 0, 0);
}
