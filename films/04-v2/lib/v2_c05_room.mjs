// c05 · your bedroom (Film 4 v2): an old city flat, two tall French windows in the east wall (A over the bed, B over the desk), sheer
// curtains, floorboards, an engraved wooden bed seen from its head end, an alarm clock on the floor, the desk with the letter, the
// wardrobe with the work shirt and the tie. Same camera and world as lib/v2_c05_city.mjs (metres, y down, z east; your floor y 0,
// the inside face of the window wall z 0, the outside face z ROOM.thick).
//   drawRoom(ctx, t, cam, S)   the whole picture seen from inside (or, with the camera outside, the outside only)
//   S = { tod, out: {…city state}, curtain: 0 closed → 1 billowed open, gust 0..1, flood 0..1 (direct light), sleeper: { up 0..1, arms 0..1 },
//         clock: { h (hours, e.g. 7.0 → 9.0) }, tie: { u 0..1 (0 tied … 1 landed) }, letter: {…}, hideLetter, plane hook }
import { W, H, rgba, clamp, mix, prng, canvas, once, poly3, proj, seg3, rect3, bb, mixHex, shade, putGlow, stippleTex, smo, ramp, pulse, TAU,
  alongY, alongZ, clipOut, pathPts } from './v2_c05_kit.mjs';
import { drawOutside, sun } from './v2_c05_city.mjs';
import { scribble } from './paper.mjs';
import { vnoise, fbm } from './art.mjs';

export const ROOM = { x0: -3.4, x1: 3.0, back: -5.95, ceil: -3.2, thick: .36 };
export const WIN = [{ key: 'A', x0: -2.9, x1: -1.5, y0: -2.85 }, { key: 'B', x0: .1, x1: 1.5, y0: -2.85 }];
export const BED = { x0: -2.97, x1: -1.43, zh: -4.66, zf: -2.42, top: -.56 };
export const CLOCK = { x: -1.0, z: -3.0, h: .34 };
export const DESK = { x0: -.04, x1: 1.62, z0: -.66, z1: -.02, top: -.76 };
export const WARD = { x0: 1.78, x1: 2.98, z0: -.62, top: -2.3 };
export const HOOK = { x: 2.12, y: -1.99, z: -.64 };
export const LETTER = { x: 1.26, z: -.33, w: .26, h: .36, yaw: .1 };

// ---------------------------------------------------------------- light
export function roomLight(tod) { const s = sun(tod); return { az: s.az, el: s.el, col: s.col }; }
const lit = (base, light, u) => mixHex(base, light, clamp(u));

// ---------------------------------------------------------------- textures (cached Images)
function headboardTex() {
  return once('c5:headboard', () => {
    const ppm = 420, w = 1.64, h = 1.3, [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(12), X = (x) => x * ppm, Y = (y) => y * ppm;
    // walnut panel with a curved top rail, turned posts with brass knobs (seen from behind: the back of the headboard faces you)
    const wood = (y0, y1) => { const gr = g.createLinearGradient(0, Y(y0), 0, Y(y1)); gr.addColorStop(0, '#5a3a2c'); gr.addColorStop(1, '#2c1a16'); return gr; };
    g.fillStyle = wood(.05, 1.3); g.beginPath(); g.moveTo(X(.08), Y(1.3)); g.lineTo(X(.08), Y(.42)); g.bezierCurveTo(X(.4), Y(.18), X(1.24), Y(.18), X(1.56), Y(.42)); g.lineTo(X(1.56), Y(1.3)); g.closePath(); g.fill();
    // grain
    const n = vnoise(14); g.save(); g.clip(); for (let i = 0; i < 160; i++) { const y = .2 + r() * 1.1; g.strokeStyle = rgba(r() < .5 ? '#1a0e0a' : '#7a5040', .12 + r() * .14); g.lineWidth = 1 + r() * 1.5; g.beginPath(); g.moveTo(0, Y(y)); for (let x = 0; x < w; x += .05) g.lineTo(X(x), Y(y + (fbm(n, x * 3, y * 9, 2) - .5) * .05)); g.stroke(); } g.restore();
    // raised panels (engraved frame lines)
    for (const [x0, x1] of [[.2, .76], [.88, 1.44]]) { g.strokeStyle = rgba('#120806', .55); g.lineWidth = 5; g.strokeRect(X(x0), Y(.5), X(x1 - x0), Y(.62)); g.strokeStyle = rgba('#a07050', .35); g.lineWidth = 2; g.strokeRect(X(x0) + 6, Y(.5) + 6, X(x1 - x0) - 12, Y(.62) - 12); }
    // the top rail catches the window light (a warm rim)
    g.strokeStyle = rgba('#ffcf98', .85); g.lineWidth = 6; g.beginPath(); g.moveTo(X(.1), Y(.42)); g.bezierCurveTo(X(.4), Y(.18), X(1.24), Y(.18), X(1.54), Y(.42)); g.stroke();
    // posts with knobs
    for (const px of [.0, 1.5]) {
      const pg = g.createLinearGradient(X(px), 0, X(px + .14), 0); pg.addColorStop(0, '#2a1812'); pg.addColorStop(.6, '#6a4432'); pg.addColorStop(1, '#2a1812');
      g.fillStyle = pg; g.fillRect(X(px), Y(.3), X(.14), Y(1.0));
      for (const ry of [.5, .9, 1.1]) { g.fillStyle = rgba('#140a08', .5); g.fillRect(X(px) - 3, Y(ry), X(.14) + 6, 7); }
      const kg = g.createRadialGradient(X(px + .05), Y(.2), 2, X(px + .07), Y(.23), X(.09)); kg.addColorStop(0, '#fff0c8'); kg.addColorStop(.3, '#d8a850'); kg.addColorStop(1, '#6a4818');
      g.fillStyle = kg; g.beginPath(); g.arc(X(px + .07), Y(.23), X(.08), 0, TAU); g.fill();
    }
    return c;
  });
}
function clockTex() {
  return once('c5:clock', () => {
    const S = 700, [c, g] = canvas(S, S), cx = S / 2, cy = S * .54, R = S * .3;
    // twin bells with a hammer between them (still), legs, the case, the dial (no brand)
    const brass = (x, y, r) => { const gg = g.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); gg.addColorStop(0, '#fff2c8'); gg.addColorStop(.35, '#e2b45a'); gg.addColorStop(.8, '#8a6024'); gg.addColorStop(1, '#4a3010'); return gg; };
    for (const sd of [-1, 1]) { const bx = cx + sd * R * .72, by = cy - R * 1.08; g.fillStyle = brass(bx, by, R * .42); g.beginPath(); g.arc(bx, by, R * .42, Math.PI, 0); g.lineTo(bx + R * .42, by + R * .08); g.lineTo(bx - R * .42, by + R * .08); g.closePath(); g.fill();
      g.strokeStyle = rgba('#3a2408', .6); g.lineWidth = 3; g.beginPath(); g.arc(bx, by, R * .3, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
      g.fillStyle = '#5a3c14'; g.fillRect(bx - 5, by + R * .06, 10, R * .2); }
    g.fillStyle = '#3a2810'; g.fillRect(cx - 4, cy - R * 1.32, 8, R * .5); g.beginPath(); g.ellipse(cx, cy - R * 1.36, R * .12, R * .06, 0, 0, TAU); g.fill();   // the hammer, at rest
    g.strokeStyle = '#6a4a1c'; g.lineWidth = 10; g.beginPath(); g.arc(cx, cy - R * 1.02, R * .55, Math.PI * 1.15, Math.PI * 1.85); g.stroke();       // carrying handle
    // legs
    for (const sd of [-1, 1]) { g.fillStyle = brass(cx + sd * R * .62, cy + R * 1.05, R * .16); g.beginPath(); g.moveTo(cx + sd * R * .5, cy + R * .8); g.lineTo(cx + sd * R * .78, cy + R * 1.2); g.lineTo(cx + sd * R * .62, cy + R * 1.2); g.lineTo(cx + sd * R * .38, cy + R * .86); g.closePath(); g.fill(); g.beginPath(); g.ellipse(cx + sd * R * .72, cy + R * 1.22, R * .14, R * .05, 0, 0, TAU); g.fill(); }
    // the case
    g.fillStyle = brass(cx, cy, R * 1.1); g.beginPath(); g.arc(cx, cy, R * 1.04, 0, TAU); g.fill();
    g.strokeStyle = rgba('#3a2408', .7); g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, R * .97, 0, TAU); g.stroke();
    // dial: cream enamel, bold numerals, minute ticks
    const dg = g.createRadialGradient(cx - R * .2, cy - R * .25, R * .1, cx, cy, R * .92); dg.addColorStop(0, '#fffaf0'); dg.addColorStop(1, '#e8dcc0'); g.fillStyle = dg; g.beginPath(); g.arc(cx, cy, R * .9, 0, TAU); g.fill();
    g.fillStyle = '#1c1820'; for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, r0 = R * (i % 5 ? .84 : .79), r1 = R * .88; g.save(); g.translate(cx, cy); g.rotate(a); g.fillRect(-(i % 5 ? 1.5 : 3.5), -r1, i % 5 ? 3 : 7, r1 - r0); g.restore(); }
    g.font = `600 ${Math.round(R * .2)}px "Instrument Serif"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * TAU; g.fillText(String(i), cx + Math.sin(a) * R * .64, cy - Math.cos(a) * R * .64 + 2); }
    // glass dome highlight
    g.fillStyle = rgba('#ffffff', .18); g.beginPath(); g.ellipse(cx - R * .35, cy - R * .4, R * .32, R * .14, -.6, 0, TAU); g.fill();
    return c;
  });
}
function wardrobeTex() {
  return once('c5:wardrobe', () => {
    const ppm = 300, w = WARD.x1 - WARD.x0, h = -WARD.top + .02, [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(19), X = (x) => x * ppm, Y = (y) => y * ppm;
    const body = g.createLinearGradient(0, 0, X(w), 0); body.addColorStop(0, '#5a3a30'); body.addColorStop(1, '#3a2420'); g.fillStyle = body; g.fillRect(0, Y(.16), X(w), Y(h - .26));
    const n = vnoise(21); for (let i = 0; i < 260; i++) { const x = r() * w; g.strokeStyle = rgba(r() < .5 ? '#1c0e0a' : '#86584a', .1 + r() * .12); g.lineWidth = 1 + r() * 1.2; g.beginPath(); g.moveTo(X(x), Y(.2)); for (let y = .2; y < h - .1; y += .05) g.lineTo(X(x + (fbm(n, x * 7, y * 2, 2) - .5) * .03), Y(y)); g.stroke(); }
    // crown cornice and plinth
    g.fillStyle = '#6a463a'; g.fillRect(-4, 0, X(w) + 8, Y(.1)); g.fillStyle = '#4a2e26'; g.fillRect(0, Y(.1), X(w), Y(.07)); g.fillStyle = rgba('#ffd2a0', .4); g.fillRect(-4, 0, X(w) + 8, 4);
    g.fillStyle = '#3a221c'; g.fillRect(0, Y(h - .12), X(w), Y(.12));
    // two doors with raised panels, the gap between them, brass keyhole escutcheons
    const dx = [.06, w / 2 + .01], dw = w / 2 - .07;
    for (const x0 of dx) { g.strokeStyle = rgba('#140806', .6); g.lineWidth = 4; g.strokeRect(X(x0), Y(.24), X(dw), Y(h - .42)); for (const [py, ph] of [[.36, .7], [1.16, .82]]) { g.strokeStyle = rgba('#120806', .55); g.lineWidth = 5; g.strokeRect(X(x0 + .07), Y(py), X(dw - .14), Y(ph)); g.strokeStyle = rgba('#a0705a', .3); g.lineWidth = 2; g.strokeRect(X(x0 + .07) + 6, Y(py) + 6, X(dw - .14) - 12, Y(ph) - 12); } }
    g.fillStyle = '#1a0c08'; g.fillRect(X(w / 2) - 2, Y(.24), 4, Y(h - .42));
    for (const kx of [w / 2 - .05, w / 2 + .05]) { g.fillStyle = '#c99a52'; g.beginPath(); g.ellipse(X(kx), Y(1.05), 7, 12, 0, 0, TAU); g.fill(); g.fillStyle = '#1a0c08'; g.fillRect(X(kx) - 1.5, Y(1.05) - 4, 3, 8); }
    // the window light on the left edge
    const eg = g.createLinearGradient(0, 0, 60, 0); eg.addColorStop(0, rgba('#ffd2a0', .3)); eg.addColorStop(1, rgba('#ffd2a0', 0)); g.fillStyle = eg; g.fillRect(0, 0, 60, Y(h));
    return c;
  });
}
// the white work shirt on a wooden hanger (front view), no tie (the tie is drawn live)
const SHIRT = { w: .56, h: .86, ppm: 700 };   // texture box: hook at (w/2, 0)
function shirtTex() {
  return once('c5:shirt', () => {
    const { w, h, ppm } = SHIRT, [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), X = (x) => (x + w / 2) * ppm, Y = (y) => y * ppm;
    // hook (brass) and hanger (wood)
    g.strokeStyle = '#b8924a'; g.lineWidth = 7; g.beginPath(); g.arc(X(0), Y(.035), .025 * ppm, Math.PI, Math.PI * 2.3); g.lineTo(X(0), Y(.085)); g.stroke();
    // shirt body: shoulders slope, sleeves hang down along the sides, the hem curves
    const sh = .22, yS = .12;
    const body = [[-.07, yS - .01], [-sh, yS + .045], [-sh - .03, yS + .1], [-sh - .035, .62], [-sh + .01, .63], [-sh + .03, yS + .2], [-.2, .74], [-.1, .79], [0, .775], [.1, .79], [.2, .74], [sh - .03, yS + .2], [sh - .01, .63], [sh + .035, .62], [sh + .03, yS + .1], [sh, yS + .045], [.07, yS - .01]];
    const bg = g.createLinearGradient(X(-sh), 0, X(sh), 0); bg.addColorStop(0, '#f4efe6'); bg.addColorStop(.6, '#e6e0d8'); bg.addColorStop(1, '#c9c2cf');
    g.fillStyle = bg; g.beginPath(); body.forEach(([x, y], i) => (i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y)))); g.closePath(); g.fill();
    g.strokeStyle = rgba('#6a6278', .5); g.lineWidth = 2.4; g.stroke();
    // sleeves (separate folds), cuffs
    for (const sd of [-1, 1]) { g.strokeStyle = rgba('#7a7288', .45); g.lineWidth = 2; g.beginPath(); g.moveTo(X(sd * (sh - .02)), Y(yS + .14)); g.quadraticCurveTo(X(sd * (sh - .04)), Y(.4), X(sd * (sh - .015)), Y(.6)); g.stroke(); g.fillStyle = '#ece6dc'; g.fillRect(X(sd > 0 ? sh - .03 : -sh - .035), Y(.575), .065 * ppm, .05 * ppm); g.strokeRect(X(sd > 0 ? sh - .03 : -sh - .035), Y(.575), .065 * ppm, .05 * ppm); }
    // the hanger's shoulders inside (a faint ridge)
    g.strokeStyle = rgba('#8a6a4a', .35); g.lineWidth = 4; g.beginPath(); g.moveTo(X(-.19), Y(yS + .05)); g.quadraticCurveTo(X(0), Y(yS - .03), X(.19), Y(yS + .05)); g.stroke();
    // placket + buttons, pocket, folds
    g.strokeStyle = rgba('#6a6278', .4); g.lineWidth = 1.6; g.beginPath(); g.moveTo(X(-.018), Y(.14)); g.lineTo(X(-.018), Y(.775)); g.moveTo(X(.018), Y(.14)); g.lineTo(X(.018), Y(.775)); g.stroke();
    for (let y = .2; y < .76; y += .085) { g.fillStyle = '#d8d2c8'; g.beginPath(); g.arc(X(0), Y(y), 5, 0, TAU); g.fill(); g.strokeStyle = rgba('#5a5268', .5); g.lineWidth = 1; g.stroke(); }
    g.strokeStyle = rgba('#6a6278', .35); g.lineWidth = 1.6; g.strokeRect(X(-.15), Y(.25), .085 * ppm, .1 * ppm);
    for (const [x0, y0, x1, y1] of [[-.12, .45, -.06, .7], [.08, .42, .14, .68], [-.17, .3, -.12, .5], [.15, .5, .17, .72]]) { g.strokeStyle = rgba('#5a5268', .22); g.lineWidth = 2; g.beginPath(); g.moveTo(X(x0), Y(y0)); g.quadraticCurveTo(X((x0 + x1) / 2 + .02), Y((y0 + y1) / 2), X(x1), Y(y1)); g.stroke(); }
    // the collar (points), drawn last: the tie's knot sits between the points
    g.fillStyle = '#f8f4ec'; g.beginPath(); g.moveTo(X(-.07), Y(.095)); g.quadraticCurveTo(X(0), Y(.085), X(.07), Y(.095)); g.lineTo(X(.075), Y(.135)); g.lineTo(X(.03), Y(.2)); g.lineTo(X(0), Y(.15)); g.lineTo(X(-.03), Y(.2)); g.lineTo(X(-.075), Y(.135)); g.closePath(); g.fill();
    g.strokeStyle = rgba('#5a5268', .5); g.lineWidth = 2; g.stroke();
    return c;
  });
}
// the letter (engraved letterhead, scribbled lines, an empty space below where the "No." will be written)
export const LETTER_PX = [520, 720];
export function letterTex() {
  return once('c5:letter', () => {
    const [w, h] = LETTER_PX, [c, g] = canvas(w, h), r = prng(61);
    const pg = g.createLinearGradient(0, 0, w, h); pg.addColorStop(0, '#fbf4e4'); pg.addColorStop(1, '#e9dcc0'); g.fillStyle = pg; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) { g.fillStyle = rgba(r() < .5 ? '#8a7a5a' : '#ffffff', .06 + r() * .08); g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
    // letterhead: an engraved oval vignette with a building, then a scribbled name and a rule
    g.strokeStyle = '#3a3448'; g.lineWidth = 2; g.beginPath(); g.ellipse(w * .5, 70, 46, 34, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(w * .5, 70, 40, 28, 0, 0, TAU); g.stroke();
    g.fillStyle = '#3a3448'; g.fillRect(w * .5 - 22, 66, 44, 22); g.beginPath(); g.moveTo(w * .5 - 26, 66); g.lineTo(w * .5, 48); g.lineTo(w * .5 + 26, 66); g.closePath(); g.fill();
    g.fillStyle = '#f4ecd8'; for (let i = 0; i < 4; i++) g.fillRect(w * .5 - 18 + i * 10, 72, 5, 12);
    scribble(g, w * .5 - 90, 128, 180, 9, { seed: 4, ink: '#3a3448', lw: 2.2 });
    g.fillStyle = '#3a3448'; g.fillRect(40, 150, w - 80, 2); g.fillRect(40, 155, w - 80, 1);
    // date line (right) and the address block (left), then three paragraphs of scribble
    scribble(g, w - 170, 190, 120, 7, { seed: 7, ink: '#4a4458', lw: 1.6 });
    for (let i = 0; i < 3; i++) scribble(g, 44, 200 + i * 20, 150 - i * 25, 7, { seed: 10 + i, ink: '#4a4458', lw: 1.6 });
    let y = 290; for (let p = 0; p < 3; p++) { for (let i = 0; i < 4 - (p === 2 ? 2 : 0); i++) { scribble(g, 44 + (i ? 0 : 24), y, w - 92 - (i ? 0 : 24) - (i === 3 ? 140 : 0), 7, { seed: 30 + p * 7 + i, ink: '#4a4458', lw: 1.5 }); y += 21; } y += 14; }
    scribble(g, 44, y + 8, 110, 8, { seed: 77, ink: '#4a4458', lw: 1.7 });
    g.strokeStyle = rgba('#7a6a50', .5); g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
    return c;
  });
}

// ---------------------------------------------------------------- the window wall, reveals, railings, casements
function opening(Wd, z) { return [[Wd.x0, Wd.y0, z], [Wd.x1, Wd.y0, z], [Wd.x1, 0, z], [Wd.x0, 0, z]]; }
// screen aperture of an opening seen from the camera (the nearest face in front of the camera), or 'full' when the camera is outside
function aperture(cam, Wd) {
  if (cam.z >= ROOM.thick - .02) return 'full';
  const z = cam.z < -.02 ? 0 : ROOM.thick;
  return proj(cam, opening(Wd, z));
}
function wallColour(S) { return mixHex('#3a2f48', '#5b4a5e', S.flood ?? 0); }
function drawWindowWall(ctx, t, cam, S) {
  const R = ROOM, wall = wallColour(S);
  const outer = proj(cam, [[R.x0, R.ceil, 0], [R.x1, R.ceil, 0], [R.x1, 0, 0], [R.x0, 0, 0]]); if (!outer) return;
  ctx.beginPath(); pathPts(ctx, outer, true);
  for (const Wd of WIN) { const q = proj(cam, opening(Wd, 0)); if (q) { [...q].reverse().forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); } }
  const tl = outer[0], br = outer[2], g = ctx.createLinearGradient(tl[0], 0, br[0], 0);
  g.addColorStop(0, shade(wall, -.04)); g.addColorStop(.32, shade(wall, .05)); g.addColorStop(.6, wall); g.addColorStop(1, shade(wall, -.05)); ctx.fillStyle = g; ctx.fill('evenodd');
  // plaster texture, a warm bloom around the bright windows
  ctx.save(); ctx.clip('evenodd');
  for (const Wd of WIN) { const c = cam.P((Wd.x0 + Wd.x1) / 2, Wd.y0 * .55, 0); if (c) putGlow(ctx, c[0], c[1], 2.4 * c[2], .2 + .25 * (S.flood ?? 0), '#ffcf9a', '#ffe8c8', 'screen'); }
  ctx.restore();
  // skirting board, cornice, picture rail; architraves round the openings
  poly3(ctx, cam, [[R.x0, -.14, 0], [R.x1, -.14, 0], [R.x1, 0, 0], [R.x0, 0, 0]], shade(wall, -.07));
  poly3(ctx, cam, [[R.x0, R.ceil, 0], [R.x1, R.ceil, 0], [R.x1, R.ceil + .16, 0], [R.x0, R.ceil + .16, 0]], shade(wall, .06));
  poly3(ctx, cam, [[R.x0, R.ceil + .16, 0], [R.x1, R.ceil + .16, 0], [R.x1, R.ceil + .2, 0], [R.x0, R.ceil + .2, 0]], shade(wall, -.08));
  for (const Wd of WIN) {
    const a = .09, col = shade(wall, .08);
    poly3(ctx, cam, [[Wd.x0 - a, Wd.y0 - a, -.005], [Wd.x1 + a, Wd.y0 - a, -.005], [Wd.x1 + a, Wd.y0, -.005], [Wd.x0 - a, Wd.y0, -.005]], col);
    poly3(ctx, cam, [[Wd.x0 - a, Wd.y0, -.005], [Wd.x0, Wd.y0, -.005], [Wd.x0, 0, -.005], [Wd.x0 - a, 0, -.005]], col);
    poly3(ctx, cam, [[Wd.x1, Wd.y0, -.005], [Wd.x1 + a, Wd.y0, -.005], [Wd.x1 + a, 0, -.005], [Wd.x1, 0, -.005]], col);
  }
  // between the windows: a small framed engraving (a harbour)
  const pf = rect3(cam, -1.05, -2.05, -.01, .7, .52);
  if (pf) { ctx.fillStyle = '#3a2a22'; ctx.fillRect(pf[0], pf[1], pf[2], pf[3]); ctx.fillStyle = '#d8ccb0'; ctx.fillRect(pf[0] + pf[2] * .1, pf[1] + pf[3] * .12, pf[2] * .8, pf[3] * .76);
    ctx.strokeStyle = rgba('#3a3448', .6); ctx.lineWidth = Math.max(.6, pf[4] * .004); ctx.beginPath(); for (let i = 0; i < 7; i++) { const yy = pf[1] + pf[3] * (.5 + i * .05); ctx.moveTo(pf[0] + pf[2] * .14, yy); ctx.lineTo(pf[0] + pf[2] * .86, yy); } ctx.stroke();
    ctx.fillStyle = rgba('#3a3448', .7); ctx.beginPath(); ctx.moveTo(pf[0] + pf[2] * .3, pf[1] + pf[3] * .5); ctx.lineTo(pf[0] + pf[2] * .45, pf[1] + pf[3] * .3); ctx.lineTo(pf[0] + pf[2] * .6, pf[1] + pf[3] * .5); ctx.fill(); }
}
function drawReveals(ctx, t, cam, S) {
  const T = ROOM.thick, L = S.L, f = S.flood ?? 0;
  for (const Wd of WIN) {
    const base = shade(wallColour(S), .03);
    // left reveal (faces +x), right reveal (faces -x: it catches the morning sun when az < 0), head (faces down), threshold (faces up)
    const rightLit = clamp(-L.az * 3) * .6 + .15 * f, leftLit = clamp(L.az * 3) * .6;
    if (cam.x > Wd.x0) poly3(ctx, cam, [[Wd.x0, Wd.y0, 0], [Wd.x0, Wd.y0, T], [Wd.x0, 0, T], [Wd.x0, 0, 0]], lit(shade(base, -.04), '#e8b890', leftLit));
    if (cam.x < Wd.x1) poly3(ctx, cam, [[Wd.x1, Wd.y0, 0], [Wd.x1, Wd.y0, T], [Wd.x1, 0, T], [Wd.x1, 0, 0]], lit(base, '#f0c49a', rightLit));
    if (cam.y > Wd.y0) poly3(ctx, cam, [[Wd.x0, Wd.y0, 0], [Wd.x1, Wd.y0, 0], [Wd.x1, Wd.y0, T], [Wd.x0, Wd.y0, T]], shade(base, -.09));
    if (cam.y < 0) poly3(ctx, cam, [[Wd.x0, 0, 0], [Wd.x1, 0, 0], [Wd.x1, 0, T], [Wd.x0, 0, T]], lit('#5a4446', '#e8c098', .4 + .4 * f));
  }
}
// the Juliet balcony railing just outside each window (wrought iron, in silhouette against the light)
function drawRailing(ctx, t, cam, Wd) {
  const z = ROOM.thick + .04, top = -.98, k = cam.k(z); if (z <= cam.z + .05) return;
  const A = cam.P(Wd.x0, top, z), B = cam.P(Wd.x1, 0, z); if (!A || !B) return;
  ctx.save(); ctx.strokeStyle = '#1c1624'; ctx.fillStyle = '#1c1624'; ctx.lineCap = 'round';
  const lw = Math.max(1, .022 * k);
  ctx.lineWidth = lw * 1.6; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], A[1]); ctx.moveTo(A[0], A[1] + .12 * k); ctx.lineTo(B[0], A[1] + .12 * k); ctx.moveTo(A[0], B[1] - .08 * k); ctx.lineTo(B[0], B[1] - .08 * k); ctx.stroke();
  ctx.lineWidth = lw; ctx.beginPath(); const n = Math.round((Wd.x1 - Wd.x0) / .11);
  for (let i = 0; i <= n; i++) { const x = mix(A[0], B[0], i / n); ctx.moveTo(x, A[1]); ctx.lineTo(x, B[1] - .08 * k); }
  ctx.stroke();
  // scrolls between the two top rails
  ctx.lineWidth = lw * .8; ctx.beginPath();
  for (let i = 0; i < n; i += 2) { const x = mix(A[0], B[0], (i + 1) / n), y = A[1] + .06 * k, rr = .045 * k; ctx.moveTo(x + rr, y); ctx.arc(x, y, rr, 0, TAU * .85); }
  ctx.stroke(); ctx.restore();
}
// the casements: two glazed leaves per window, hinged at the sides, standing ajar (open inward by ang)
function drawCasements(ctx, t, cam, S, Wd, ang) {
  const hz = .12, lw = (Wd.x1 - Wd.x0) / 2, fl = S.flood ?? 0;
  for (const sd of [-1, 1]) {
    const hx = sd < 0 ? Wd.x0 : Wd.x1, dir = -sd, ex = hx + dir * lw * Math.cos(ang), ez = hz - lw * Math.sin(ang);
    const P = (u, y) => [mix(hx, ex, u), y, mix(hz, ez, u)];
    const frame = lit('#59607a', '#c8b8b0', .25 + .35 * fl), dark = shade(frame, -.12);
    // stiles and rails as quads, then the glass panes (faint sky reflection), glazing bars
    const quad = (u0, u1, y0, y1, col) => poly3(ctx, cam, [P(u0, y0), P(u1, y0), P(u1, y1), P(u0, y1)], col);
    const st = .07 / lw, top = Wd.y0, bot = 0;
    quad(0, st, top, bot, dark); quad(1 - st, 1, top, bot, frame);
    quad(st, 1 - st, top, top + .1, frame); quad(st, 1 - st, bot - .22, bot, frame);
    const panes = 4, y0 = top + .1, y1 = bot - .22;
    for (let i = 0; i < panes; i++) {
      const a = mix(y0, y1, i / panes) + (i ? .02 : 0), b = mix(y0, y1, (i + 1) / panes) - (i < panes - 1 ? .02 : 0);
      const q = poly3(ctx, cam, [P(st, a), P(1 - st, a), P(1 - st, b), P(st, b)]);
      if (q) { const gg = ctx.createLinearGradient(q[0][0], q[0][1], q[2][0], q[2][1]); gg.addColorStop(0, rgba('#fff4e4', .16 + .08 * fl)); gg.addColorStop(.5, rgba('#ffe8d0', .04)); gg.addColorStop(1, rgba('#c8b0c0', .12)); ctx.fillStyle = gg; ctx.fill(); }
      if (i < panes - 1) quad(st, 1 - st, b, b + .04, frame);
    }
    // brass handle on the free stile
    const hp = cam.P(...P(1 - st * .5, -1.05)); if (hp) { ctx.fillStyle = '#c99a52'; ctx.beginPath(); ctx.arc(hp[0], hp[1], Math.max(1.2, .02 * hp[2]), 0, TAU); ctx.fill(); }
  }
}

// ---------------------------------------------------------------- the sheer curtains (cloth strips with pleats, billowing)
// each window: a rod at y -3.0, z -0.3; two panels. state: open 0 (closed, a gap) → 1 (gathered at the sides); gust: the wind's push.
const ROD = { y: -3.02, z: -.3 };
function panelGeom(Wd, side, S, t, gapW) {
  const outer = side < 0 ? Wd.x0 - .34 : Wd.x1 + .34, cx = (Wd.x0 + Wd.x1) / 2, op = S.curtain ?? 0;
  const leadClosed = cx + side * gapW / 2, leadOpen = outer - side * .4, lead = mix(leadClosed, leadOpen, smo(op));
  return { outer, lead, op };
}
function drawCurtain(ctx, t, cam, S, Wd, wi) {
  const gapW = wi === 0 ? .46 : .14, gust = S.gust ?? 0, fl = S.flood ?? 0, L = S.L;
  const NU = 16, NV = 9, floorY = -.03;
  for (const side of [-1, 1]) {
    const { outer, lead, op } = panelGeom(Wd, side, S, t, gapW), width = Math.abs(lead - outer), pleats = Math.max(4, Math.round(width / .11));
    const depth = .03 + .05 * (1 - width / 1.1);   // gathered → deeper folds
    const pt = (u, v) => {
      const x0 = mix(outer, lead, u), ph = u * pleats * TAU;
      const sway = .012 * Math.sin(t * 1.3 + u * 5 + wi * 2) * v + .02 * Math.sin(t * .7 + wi) * v * v;
      const bil = gust * (Math.pow(v, 1.4) * (.55 + .25 * Math.sin(u * 4 + t * 3.1 + wi)) + .1 * Math.sin(v * 5 - t * 6 + u * 3) * v);
      const x = x0 + side * gust * .18 * v * u + .02 * Math.sin(t * 2.3 + v * 4 + u * 3) * gust;
      const y = mix(ROD.y + .02, floorY - .06 * gust * v, v) - .05 * gust * v * v;
      const z = ROD.z + depth * Math.sin(ph) - bil - sway;
      return [x, y, z];
    };
    // strips from the outer edge to the lead (draw the far ones first: the leading edge is the nearest when billowing)
    for (let i = 0; i < NU; i++) {
      const u0 = i / NU, u1 = (i + 1) / NU, left = [], right = [];
      for (let j = 0; j <= NV; j++) { const v = j / NV; left.push(pt(u0, v)); right.push(pt(u1, v)); }
      const poly = [...left, ...right.reverse()], q = proj(cam, poly); if (!q) continue;
      // brightness: the fold facing the camera is lighter; in front of the bright opening the cloth glows
      const ph = (u0 + u1) / 2 * pleats * TAU, face = .5 + .5 * Math.cos(ph), xm = mix(outer, lead, (u0 + u1) / 2);
      const inOpen = xm > Wd.x0 && xm < Wd.x1 ? 1 : .25;
      const glow = (.45 + .55 * inOpen) * (.65 + .35 * face);
      const ys = q.map((p) => p[1]), yt = Math.min(...ys), yb = Math.max(...ys);
      const g = ctx.createLinearGradient(0, yt, 0, yb);
      const top = mixHex('#c8b4b8', '#fff2e2', glow * (.7 + .3 * fl)), bot = mixHex('#a894a4', '#ffe4c8', glow * (.6 + .4 * fl));
      g.addColorStop(0, rgba(top, .5 + .25 * (1 - face))); g.addColorStop(1, rgba(bot, .42 + .25 * (1 - face)));
      ctx.fillStyle = g; ctx.beginPath(); pathPts(ctx, q, true); ctx.fill();
    }
    // the hem: a slightly denser band at the bottom
    const hem = []; for (let i = 0; i <= NU; i++) hem.push(pt(i / NU, 1));
    const hp = hem.map((p) => cam.P(...p)).filter(Boolean);
    if (hp.length > 2) { ctx.strokeStyle = rgba('#fff0e0', .35 + .2 * fl); ctx.lineWidth = Math.max(1, .02 * cam.k(ROD.z)); ctx.beginPath(); hp.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  }
  // the rod with finials
  const a = cam.P(Wd.x0 - .42, ROD.y, ROD.z), b = cam.P(Wd.x1 + .42, ROD.y, ROD.z);
  if (a && b) { ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = Math.max(1.2, .025 * a[2]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.fillStyle = '#c99a52'; for (const p of [a, b]) { ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1.5, .035 * p[2]), 0, TAU); ctx.fill(); } }
  void L;
}

// ---------------------------------------------------------------- floor, side walls, ceiling
function drawShell(ctx, t, cam, S) {
  const R = ROOM, f = S.flood ?? 0, wall = wallColour(S), zb = Math.min(R.back, cam.z - .1);
  // ceiling
  const ce = poly3(ctx, cam, [[R.x0, R.ceil, 0], [R.x1, R.ceil, 0], [R.x1, R.ceil, zb], [R.x0, R.ceil, zb]]);
  if (ce) { const g = ctx.createLinearGradient(0, Math.min(...ce.map((p) => p[1])), 0, Math.max(...ce.map((p) => p[1]))); g.addColorStop(0, shade(wall, -.1)); g.addColorStop(1, shade(wall, -.02 + .05 * f)); ctx.fillStyle = g; ctx.fill(); }
  // side walls
  if (cam.x > R.x0) { const q = poly3(ctx, cam, [[R.x0, R.ceil, 0], [R.x0, R.ceil, zb], [R.x0, 0, zb], [R.x0, 0, 0]]); if (q) { const g = ctx.createLinearGradient(q[0][0], 0, q[1][0], 0); g.addColorStop(0, shade(wall, .02 + .06 * f)); g.addColorStop(1, shade(wall, -.08)); ctx.fillStyle = g; ctx.fill(); } }
  if (cam.x < R.x1) { const q = poly3(ctx, cam, [[R.x1, R.ceil, 0], [R.x1, R.ceil, zb], [R.x1, 0, zb], [R.x1, 0, 0]]); if (q) { const g = ctx.createLinearGradient(q[0][0], 0, q[1][0], 0); g.addColorStop(0, shade(wall, .0 + .05 * f)); g.addColorStop(1, shade(wall, -.1)); ctx.fillStyle = g; ctx.fill(); } }
  // cornice lines and skirting along the side walls
  for (const x of [R.x0, R.x1]) for (const [y, col, wd] of [[R.ceil + .18, shade(wall, .1), .03], [-.12, shade(wall, -.12), .02]]) { const s = seg3(cam, [x, y, 0], [x, y, zb]); if (s) { ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, wd * s[0][2]); ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
  // the room's door on the right wall (panelled)
  if (cam.x < R.x1) { poly3(ctx, cam, [[R.x1 - .005, -2.15, -3.4], [R.x1 - .005, -2.15, -2.45], [R.x1 - .005, 0, -2.45], [R.x1 - .005, 0, -3.4]], shade(wall, -.1)); poly3(ctx, cam, [[R.x1 - .01, -2.05, -3.3], [R.x1 - .01, -2.05, -2.55], [R.x1 - .01, -.05, -2.55], [R.x1 - .01, -.05, -3.3]], '#4a3430'); }
  // a framed mirror on the left wall above the bed (it shows a soft bright smear of the window)
  if (cam.x > R.x0) { const m = poly3(ctx, cam, [[R.x0 + .005, -2.3, -3.1], [R.x0 + .005, -2.3, -2.0], [R.x0 + .005, -1.35, -2.0], [R.x0 + .005, -1.35, -3.1]], '#6a4c34'); if (m) { poly3(ctx, cam, [[R.x0 + .01, -2.22, -3.02], [R.x0 + .01, -2.22, -2.08], [R.x0 + .01, -1.43, -2.08], [R.x0 + .01, -1.43, -3.02]], lit('#6a6478', '#f4dcc0', .35 + .4 * f)); } }
  // floor
  const fq = poly3(ctx, cam, [[R.x0, 0, 0], [R.x1, 0, 0], [R.x1, 0, zb], [R.x0, 0, zb]]);
  if (fq) {
    const ys = fq.map((p) => p[1]), g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys));
    g.addColorStop(0, lit('#4a3236', '#7a5444', .3 * f)); g.addColorStop(1, '#2a1c22'); ctx.fillStyle = g; ctx.fill();
    // boards along z (they converge to the vanishing point), with butt joints
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#140a0c', .45); ctx.lineWidth = 1; ctx.beginPath();
    const r = prng(5);
    for (let x = R.x0 + .07; x < R.x1; x += .14) { const s = seg3(cam, [x, 0, 0], [x, 0, zb]); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); }
      for (let z = -r() * 1.5; z > zb; z -= 1.2 + r() * 1.6) { const q = seg3(cam, [x, 0, z], [x + .14, 0, z]); if (q) { ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); } } }
    ctx.stroke(); ctx.restore();
  }
  // a rug between the bed and the desk (rose and indigo, an engraved border)
  const rg = poly3(ctx, cam, [[-1.25, -.004, -3.6], [.6, -.004, -3.6], [.6, -.004, -1.5], [-1.25, -.004, -1.5]], lit('#4a2c3e', '#9a5a62', .25 + .25 * f));
  if (rg) { const in1 = poly3(ctx, cam, [[-1.12, -.005, -3.47], [.47, -.005, -3.47], [.47, -.005, -1.63], [-1.12, -.005, -1.63]]); if (in1) { ctx.strokeStyle = rgba('#e8a3a0', .55); ctx.lineWidth = Math.max(1, .03 * cam.k(-2.5)); ctx.stroke(); } }
}

// ---------------------------------------------------------------- sunlight: patches on the floor / bed / desk, beams in the air
function patches(ctx, t, cam, S) {
  const L = S.L, f = S.flood ?? 0, cl = S.closedLight ?? 1; if (L.el <= .01) return;
  const col = L.col, shadows = [];
  // shadow casters on the floor: the bed (its quilt top), the desk, the chair, the wardrobe
  const box = (x0, x1, z0, z1, y) => { const top = [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map((p) => alongY(p, 0, L)); const pts = [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1], ...top.map((p) => [p[0], 0, p[2]])]; return hull3(pts); };
  shadows.push(box(BED.x0, BED.x1, BED.zh, BED.zf, -.66), box(DESK.x0, DESK.x1, DESK.z0, DESK.z1, DESK.top), box(.6, 1.0, -1.25, -.85, -.95), box(WARD.x0, WARD.x1, WARD.z0, 0, WARD.top));
  const shScr = shadows.map((p) => proj(cam, p)).filter(Boolean);
  ctx.save(); clipOut(ctx, shScr);
  for (const [wi, Wd] of WIN.entries()) {
    const top = [Wd.x0, Wd.y0, 0], top2 = [Wd.x1, Wd.y0, 0], a = alongY(top, 0, L), b = alongY(top2, 0, L);
    const patch = [[Wd.x0, 0, 0], [Wd.x1, 0, 0], [b[0], 0, b[2]], [a[0], 0, a[2]]];
    const q = proj(cam, patch); if (!q) continue;
    // the curtain: closed it lets the direct sun through only in its gap (the rest is diffuse); open: the whole window
    const amt = f * (S.patchA ?? 1);
    ctx.save(); ctx.beginPath(); pathPts(ctx, q, true); ctx.clip();
    const p0 = cam.P((Wd.x0 + Wd.x1) / 2, 0, -.01), p1 = cam.P((a[0] + b[0]) / 2, 0, Math.max(a[2], cam.z + 1));
    const gx0 = p0 ? p0[1] : 0, gx1 = p1 ? p1[1] : H;
    const g = ctx.createLinearGradient(0, gx0, 0, gx1); g.addColorStop(0, rgba(col, .62 * amt + .12 * cl)); g.addColorStop(1, rgba(col, .2 * amt));
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .22 * amt; ctx.drawImage(stippleTex('room', 30000, 7), 0, 0); ctx.globalAlpha = 1;
    // the window's own shadows in the patch: the glazing bars of the leaves (ajar) and the railing
    ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba('#2a1a1e', .3 * amt); ctx.lineWidth = Math.max(1, .05 * cam.k(-1.5));
    ctx.beginPath(); for (let k = 0; k <= 12; k++) { const x = mix(Wd.x0, Wd.x1, k / 12), p = alongY([x, -.98, .4], 0, L), s = seg3(cam, [x - L.az * 0, 0, .4], [p[0], 0, p[2]]); if (s) { ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); } } ctx.stroke();
    ctx.restore();
    void wi;
  }
  ctx.restore();
}
// convex hull of 3D points on a horizontal plane (x, z) → polygon (3D)
function hull3(pts) {
  const P = pts.map((p) => [p[0], p[2], p]).sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = []; for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1)).map((p) => [p[0], 0, p[1]]);
}
// volumetric beams: the light prism of each window (top and side faces), stippled, fading away from the window
function beams(ctx, t, cam, S) {
  const L = S.L, f = (S.flood ?? 0) * (S.beamA ?? 1); if (f <= .01 || L.el <= .01) return;
  const len = 4.6, col = L.col;
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (const Wd of WIN) {
    const q = [[Wd.x0, Wd.y0, .02], [Wd.x1, Wd.y0, .02], [Wd.x1, 0, .02], [Wd.x0, 0, .02]], e = q.map((p) => [p[0] - L.az * len, p[1] + L.el * len, p[2] - len]);
    for (const [i, j] of [[0, 1], [0, 3], [1, 2]]) {
      const face = [q[i], q[j], e[j], e[i]], s = proj(cam, face); if (!s) continue;
      const a = cam.P(...q[i]) || s[0], b = cam.P(...e[i]) || s[2];
      const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, rgba(col, .16 * f)); g.addColorStop(.5, rgba(col, .06 * f)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); pathPts(ctx, s, true); ctx.fill();
    }
  }
  ctx.restore();
}
// dust motes drifting in the light (screen-space particles inside the beams' region, depth-scaled)
function motes(ctx, t, cam, S) {
  const f = S.flood ?? 0, L = S.L; if (f < .05) return;
  const r = prng(404); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 140; i++) {
    const wi = r() < .55 ? 0 : 1, Wd = WIN[wi], s = r() * 4.2, x0 = mix(Wd.x0, Wd.x1, r()), y0 = mix(Wd.y0, -.2, r());
    const ph = r() * TAU, sp = .04 + r() * .06;
    const X = x0 - L.az * s + .12 * Math.sin(t * sp * 6 + ph), Y = y0 + L.el * s + .1 * Math.sin(t * sp * 4 + ph * 2) - (t * sp) % .6, Z = -s + .08 * Math.cos(t * sp * 5 + ph);
    const p = cam.P(X, Y, Z); if (!p || p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H) continue;
    const sz = Math.max(.8, .006 * p[2]), a = (.25 + .5 * r()) * f * (.5 + .5 * Math.sin(t * 2 + ph));
    ctx.fillStyle = rgba(L.col, clamp(a)); ctx.fillRect(p[0], p[1], sz, sz);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the bed (seen from its head end), the quilt, pillows, the sleeper
// the quilt surface: a height field over the mattress with a mound where the body lies (x across, z along the bed)
const BODY = { x: -2.2, zHead: -4.36, zHip: -3.55, zFeet: -2.72 };
function quiltY(x, z, S) {
  const up = S.sleeper ? smo(S.sleeper.up ?? 0) : 0, dx = x - BODY.x;
  let b = 0;
  // torso (under the quilt only while lying), hips, legs, feet (toes up)
  const torso = (1 - up) * Math.exp(-(((z - (BODY.zHip - .4)) / .34) ** 2)) * Math.exp(-((dx / .2) ** 2)) * .13;
  const hips = Math.exp(-(((z - BODY.zHip) / .22) ** 2)) * Math.exp(-((dx / .2) ** 2)) * .14;
  const legs = (z > BODY.zHip && z < BODY.zFeet ? 1 : 0) * Math.exp(-((dx / .17) ** 2)) * .09 + Math.exp(-(((z - BODY.zFeet) / .07) ** 2)) * Math.exp(-((dx / .16) ** 2)) * .08;
  b = Math.max(torso, hips, legs);
  // the quilt folded back near the pillow; when sitting up, it bunches at the waist
  const fold = Math.exp(-(((z - mix(-4.15, BODY.zHip - .2, up)) / .06) ** 2)) * .04;
  const edge = Math.max(0, Math.abs(x - (BED.x0 + BED.x1) / 2) - (BED.x1 - BED.x0) / 2 + .06);   // drape over the sides
  return BED.top - .07 - b - fold + edge * 2.2;
}
function quiltStart(S) { const up = S.sleeper ? smo(S.sleeper.up ?? 0) : 0; return mix(-4.15, BODY.zHip - .2, up); }
function drawBed(ctx, t, cam, S) {
  const L = S.L, f = S.flood ?? 0, zq = quiltStart(S);
  // under the bed: the dark floor shadow and the frame rails
  poly3(ctx, cam, [[BED.x0, -.3, BED.zh], [BED.x1, -.3, BED.zh], [BED.x1, -.3, BED.zf], [BED.x0, -.3, BED.zf]], '#1e1418');
  // the footboard (far end): low, panelled walnut with turned posts
  const fb = rect3(cam, BED.x0 - .02, -.84, BED.zf + .03, BED.x1 - BED.x0 + .04, .84);
  if (fb) { ctx.fillStyle = '#3a2420'; ctx.fillRect(fb[0], fb[1], fb[2], fb[3]); ctx.fillStyle = lit('#4a2e26', '#c8946a', .5 * f); ctx.fillRect(fb[0], fb[1], fb[2], fb[3] * .08); for (const u of [0, 1]) { ctx.fillStyle = '#5a3a2c'; ctx.fillRect(fb[0] + (fb[2] - fb[2] * .06) * u, fb[1] - fb[3] * .06, fb[2] * .06, fb[3] * 1.06); } }
  // mattress / sheet (white), seen from above
  const quilt = '#e8a3a0';
  // sheet surface between the pillows and the quilt edge
  poly3(ctx, cam, [[BED.x0 + .02, BED.top, BED.zh + .04], [BED.x1 - .02, BED.top, BED.zh + .04], [BED.x1 - .02, BED.top, zq], [BED.x0 + .02, BED.top, zq]], lit('#cfc6d0', '#fff4e6', .3 + .55 * f));
  // the quilt: strips along z from the foot (far) to its top edge (near), each strip a cross-section polygon
  const NZ = 22, NX = 18;
  const z0 = BED.zf + .02, zs = []; for (let i = 0; i <= NZ; i++) zs.push(mix(z0, zq, i / NZ));
  for (let i = 0; i < NZ; i++) {
    const za = zs[i], zb = zs[i + 1], ptsA = [], ptsB = [];
    for (let j = 0; j <= NX; j++) { const x = mix(BED.x0 - .05, BED.x1 + .05, j / NX); ptsA.push([x, quiltY(x, za, S), za]); ptsB.push([x, quiltY(x, zb, S), zb]); }
    const q = proj(cam, [...ptsA, ...ptsB.reverse()]); if (!q) continue;
    // light: the slope toward the window (+z) catches the sun
    const zm = (za + zb) / 2, dy = quiltY(BODY.x, za, S) - quiltY(BODY.x, zb, S), facing = clamp(.5 + dy * 6);
    const g = ctx.createLinearGradient(q[0][0], 0, q[NX][0], 0);
    const base = lit(shade(quilt, -.2), shade(quilt, .1), .25 + .5 * f), hi = lit(quilt, '#ffd8c8', .35 * f + .3 * facing * f);
    g.addColorStop(0, shade(base, -.05)); g.addColorStop(.35, hi); g.addColorStop(.7, base); g.addColorStop(1, shade(base, -.08));
    ctx.fillStyle = g; ctx.beginPath(); pathPts(ctx, q, true); ctx.fill();
    // quilting: a diamond stitch line every other strip
    if (i % 3 === 0) { ctx.strokeStyle = rgba('#7a4a52', .35); ctx.lineWidth = Math.max(.7, .008 * cam.k(zm)); ctx.beginPath(); pathPts(ctx, proj(cam, ptsA) || [], false); ctx.stroke(); }
    void zm;
  }
  // the quilt's turned-down edge near the pillows (a white band)
  const eA = [], eB = []; for (let j = 0; j <= NX; j++) { const x = mix(BED.x0 - .05, BED.x1 + .05, j / NX); eA.push([x, quiltY(x, zq, S) - .004, zq]); eB.push([x, quiltY(x, zq, S) + .01, zq - .07]); }
  const eq = proj(cam, [...eA, ...eB.reverse()]); if (eq) { ctx.fillStyle = lit('#d8d0d8', '#fff6ea', .3 + .5 * f); ctx.beginPath(); pathPts(ctx, eq, true); ctx.fill(); }
}
function drawPillows(ctx, t, cam, S) {
  const f = S.flood ?? 0;
  for (const [x0, x1] of [[BED.x0 + .08, -2.24], [-2.16, BED.x1 - .08]]) {
    const zc = BED.zh + .24, top = BED.top - .17, a = cam.P(x0, top, zc), b = cam.P(x1, BED.top, zc - .2); if (!a || !b) continue;
    const cx = (a[0] + b[0]) / 2, w = b[0] - a[0], y0 = a[1], y1 = b[1];
    const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, lit('#d8d2dc', '#fff8ee', .3 + .5 * f)); g.addColorStop(1, lit('#9a92a8', '#d8c8c0', .3 * f));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(a[0] + w * .04, y1); ctx.bezierCurveTo(a[0] - w * .04, y0 + (y1 - y0) * .3, a[0] + w * .1, y0, cx, y0 + (y1 - y0) * .05);
    ctx.bezierCurveTo(b[0] - w * .1, y0, b[0] + w * .04, y0 + (y1 - y0) * .3, b[0] - w * .04, y1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#7a7090', .3); ctx.lineWidth = Math.max(1, w * .006); ctx.stroke();
  }
}
// the sleeper seen from behind (from the head end): lying → sitting up and stretching (arms rise in front, above the head, then down)
// up 0..1 (torso angle 0 → 100°), arms 0..1 (stretch), all in 3D, drawn as a back-lit silhouette with a warm rim
export function drawSleeper(ctx, t, cam, S) {
  const sl = S.sleeper || {}, up = smo(clamp(sl.up ?? 0)), arms = clamp(sl.arms ?? 0), L = S.L, f = S.flood ?? 0;
  const br = Math.sin(t * TAU / 4.4) * .006 * (1 - up * .5);                 // breathing
  const th = up * 1.72, hip = [BODY.x, BED.top - .14, BODY.zHip];               // torso angle from lying (0) to sitting (≈ 98°)
  const ax = (r) => [hip[0], hip[1] - Math.sin(th) * r, hip[2] - Math.cos(th) * r];  // a point on the torso axis at distance r from the hip
  const shL = ax(.5 + br), head = ax(.74 + br), neck = ax(.6 + br);
  const k = cam.k(head[2]); if (!cam.P(...head)) return;
  // shoulders (wide), the back, the head with the hair (the back of the head), the arms
  const sw = .2, P = (p) => cam.P(...p);
  const sL = P([shL[0] - sw, shL[1] + .02, shL[2]]), sR = P([shL[0] + sw, shL[1] + .02, shL[2]]), wa = ax(.12), wL = P([wa[0] - .16, wa[1], wa[2]]), wR = P([wa[0] + .16, wa[1], wa[2]]);
  const hd = P(head), nk = P(neck); if (!sL || !sR || !hd || !nk || !wL || !wR) return;
  const top = '#2c3248', hair = '#2a1c1a', skin = '#b88a6c';
  const rim = L.col, rw = Math.max(1.5, .012 * k);
  const shapes = (dx, dy, mono) => {
    ctx.fillStyle = mono || top;
    // the back (from the waist to the shoulders), only the part above the quilt shows
    ctx.beginPath(); ctx.moveTo(wL[0] + dx, wL[1] + dy); ctx.lineTo(wR[0] + dx, wR[1] + dy);
    ctx.bezierCurveTo(wR[0] + (sR[0] - wR[0]) * .9 + dx, mix(wR[1], sR[1], .5) + dy, sR[0] + dx + 4, sR[1] + dy + 6, sR[0] + dx, sR[1] + dy);
    ctx.quadraticCurveTo(mix(sR[0], nk[0], .5) + dx, sR[1] - (sR[0] - sL[0]) * .12 + dy, nk[0] + dx, nk[1] + dy);
    ctx.quadraticCurveTo(mix(sL[0], nk[0], .5) + dx, sL[1] - (sR[0] - sL[0]) * .12 + dy, sL[0] + dx, sL[1] + dy);
    ctx.bezierCurveTo(sL[0] + dx - 4, sL[1] + dy + 6, wL[0] + (sL[0] - wL[0]) * .9 + dx, mix(wL[1], sL[1], .5) + dy, wL[0] + dx, wL[1] + dy); ctx.closePath(); ctx.fill();
    // arms: upper arm + forearm capsules in 3D (stretch: up and a little forward and out)
    const armUp = arms, lift = Math.sin(armUp * Math.PI) ;
    for (const sd of [-1, 1]) {
      const s3 = [shL[0] + sd * (sw - .03), shL[1] + .04, shL[2]];
      const rest = [s3[0] + sd * .05, s3[1] + .28, s3[2] - .06], restH = [s3[0] + sd * .02, s3[1] + .5, s3[2] - .12];
      const upE = [s3[0] + sd * .1, s3[1] - .27, s3[2] + .06], upH = [s3[0] + sd * .06, s3[1] - .55, s3[2] + .1];
      const e3 = rest.map((v, i) => mix(v, upE[i], lift)), h3 = restH.map((v, i) => mix(v, upH[i], lift));
      const a = P(s3), e = P(e3), hh = P(h3); if (!a || !e || !hh) continue;
      ctx.fillStyle = mono || top; ctx.lineCap = 'round'; ctx.strokeStyle = mono || top; ctx.lineWidth = .1 * k; ctx.beginPath(); ctx.moveTo(a[0] + dx, a[1] + dy); ctx.lineTo(e[0] + dx, e[1] + dy); ctx.stroke();
      ctx.strokeStyle = mono || top; ctx.lineWidth = .085 * k; ctx.beginPath(); ctx.moveTo(e[0] + dx, e[1] + dy); ctx.lineTo(hh[0] + dx, hh[1] + dy); ctx.stroke();
      if (lift > .25) { ctx.fillStyle = mono || skin; ctx.beginPath(); ctx.ellipse(hh[0] + dx, hh[1] + dy - .03 * k, .042 * k, .055 * k, 0, 0, TAU); ctx.fill(); }
    }
    // neck and head (hair: the back of the head)
    ctx.fillStyle = mono || shade(skin, -.25); ctx.beginPath(); ctx.ellipse(nk[0] + dx, nk[1] + dy, .055 * k, .07 * k, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mono || hair; ctx.beginPath(); ctx.ellipse(hd[0] + dx, hd[1] + dy, .1 * k, .118 * k, 0, 0, TAU); ctx.fill();
  };
  // rim toward the light (the window is ahead and up): the silhouette drawn in the light colour, shifted up, then the body over it
  shapes(0, -rw, rgba(rim, .55 + .35 * f));
  shapes(0, 0, null);
  // hair texture and the ears
  ctx.strokeStyle = rgba('#5a3a2a', .5); ctx.lineWidth = Math.max(.8, .006 * k); ctx.beginPath();
  for (let i = 0; i < 9; i++) { const a0 = -2.6 + i * .3; ctx.moveTo(hd[0] + Math.cos(a0) * .09 * k, hd[1] + Math.sin(a0) * .1 * k); ctx.quadraticCurveTo(hd[0] + Math.cos(a0 + .3) * .05 * k, hd[1] + .02 * k, hd[0] + Math.cos(a0 + .6) * .02 * k, hd[1] + .09 * k); }
  ctx.stroke();
  ctx.fillStyle = shade(skin, -.15); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(hd[0] + sd * .098 * k, hd[1] + .01 * k, .018 * k, .032 * k, 0, 0, TAU); ctx.fill(); }
  // a warm glow of the sun around the head when sitting up (it is in front of the window)
  if (up > .3) putGlow(ctx, hd[0], hd[1] - .05 * k, .45 * k, .18 * up * f, L.col, '#fff1d6');
}
// the alarm clock on the floor: a cached image + live hands (minute, hour, a red seconds hand); its bell hammer stays still
export function drawClock(ctx, t, cam, S) {
  const C = CLOCK, f = S.flood ?? 0, size = C.h * 1.25, im = clockTex();
  const r = bb(ctx, cam, im, C.x - size / 2, -size * .86, C.z, size, size); if (!r) return;
  const [x, y, w] = r, cx = x + w * .5, cy = y + w * .54, R = w * .3, hrs = S.clock?.h ?? 7;
  // light on the brass (the sun from the window)
  putGlow(ctx, cx - R * .5, cy - R * .6, R * 1.2, .25 * f, S.L.col, '#fff6e0');
  const hand = (ang, len, wd, col) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-wd, R * .1); ctx.lineTo(-wd * .6, -len); ctx.lineTo(0, -len - wd * 1.5); ctx.lineTo(wd * .6, -len); ctx.lineTo(wd, R * .1); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const hA = (hrs % 12) / 12 * TAU, mA = (hrs % 1) * TAU, sA = Math.floor(t) % 60 / 60 * TAU + (t % 1 < .12 ? smo((t % 1) / .12) : 1) * TAU / 60;
  hand(hA, R * .48, R * .055, '#14121c'); hand(mA, R * .74, R * .038, '#14121c');
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(sA); ctx.strokeStyle = '#b8323a'; ctx.lineWidth = Math.max(1, R * .018); ctx.beginPath(); ctx.moveTo(0, R * .15); ctx.lineTo(0, -R * .8); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#c99a52'; ctx.beginPath(); ctx.arc(cx, cy, R * .06, 0, TAU); ctx.fill();
  // its long shadow on the floor away from the window
  const L = S.L, sh = alongY([C.x, -C.h, C.z], 0, L), a = cam.P(C.x, 0, C.z), b = cam.P(sh[0], 0, sh[2]);
  if (a && b && f > .05) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = rgba('#5a4050', .5 * f); ctx.lineCap = 'round'; ctx.lineWidth = w * .5; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); }
}

// ---------------------------------------------------------------- desk, chair, wardrobe, shirt, tie
function drawDesk(ctx, t, cam, S) {
  const D = DESK, f = S.flood ?? 0, wood = '#4a2e26';
  // legs, drawer front, top (seen from above)
  for (const lx of [D.x0 + .04, D.x1 - .1]) poly3(ctx, cam, [[lx, D.top + .05, D.z0 + .03], [lx + .06, D.top + .05, D.z0 + .03], [lx + .06, 0, D.z0 + .03], [lx, 0, D.z0 + .03]], shade(wood, -.08));
  poly3(ctx, cam, [[D.x0 + .02, D.top + .04, D.z0], [D.x1 - .02, D.top + .04, D.z0], [D.x1 - .02, D.top + .2, D.z0], [D.x0 + .02, D.top + .2, D.z0]], shade(wood, -.04));
  const dr = rect3(cam, D.x0 + .1, D.top + .07, D.z0 - .002, D.x1 - D.x0 - .2, .1); if (dr) { ctx.strokeStyle = rgba('#140806', .6); ctx.lineWidth = Math.max(1, dr[4] * .006); ctx.strokeRect(dr[0], dr[1], dr[2], dr[3]); ctx.fillStyle = '#c99a52'; ctx.beginPath(); ctx.arc(dr[0] + dr[2] / 2, dr[1] + dr[3] / 2, Math.max(1.5, dr[4] * .012), 0, TAU); ctx.fill(); }
  const top = poly3(ctx, cam, [[D.x0, D.top, D.z0], [D.x1, D.top, D.z0], [D.x1, D.top, D.z1], [D.x0, D.top, D.z1]]);
  if (top) { const g = ctx.createLinearGradient(0, Math.max(...top.map((p) => p[1])), 0, Math.min(...top.map((p) => p[1]))); g.addColorStop(0, lit(wood, '#a0684a', .2 + .3 * f)); g.addColorStop(1, lit(wood, '#e0a070', .3 + .5 * f)); ctx.fillStyle = g; ctx.fill(); }
  poly3(ctx, cam, [[D.x0, D.top, D.z0], [D.x1, D.top, D.z0], [D.x1, D.top + .04, D.z0], [D.x0, D.top + .04, D.z0]], lit('#5a382c', '#c0805a', .3 * f));
  // books (a short stack), an inkwell, a cup
  const bk = [['#5a2a2a', .05], ['#2a3a4a', .04], ['#6a5a3a', .045]]; let by = D.top;
  for (const [c, h] of bk) { const q = poly3(ctx, cam, [[.06, by - h, -.45], [.42, by - h, -.45], [.42, by - h, -.18], [.06, by - h, -.18]], lit(c, '#d8a070', .25 * f)); poly3(ctx, cam, [[.06, by - h, -.45], [.42, by - h, -.45], [.42, by, -.45], [.06, by, -.45]], shade(c, -.06)); void q; by -= h; }
  const iw = cam.P(.58, D.top - .03, -.2); if (iw) { const k = iw[2]; ctx.fillStyle = '#1a1626'; ctx.beginPath(); ctx.ellipse(iw[0], iw[1], .035 * k, .028 * k, 0, 0, TAU); ctx.fill(); ctx.fillStyle = rgba('#fff', .3); ctx.beginPath(); ctx.ellipse(iw[0] - .01 * k, iw[1] - .01 * k, .01 * k, .006 * k, 0, 0, TAU); ctx.fill(); }
}
function drawChair(ctx, t, cam, S) {
  const f = S.flood ?? 0, x = .8, z = -1.05, col = lit('#3a2420', '#a06848', .25 * f);
  // bentwood chair seen from behind: the oval back hoop, seat, legs
  poly3(ctx, cam, [[x - .21, -.46, z - .2], [x + .21, -.46, z - .2], [x + .21, -.46, z + .2], [x - .21, -.46, z + .2]], lit('#4a2c24', '#c08058', .3 * f));
  for (const [lx, lz] of [[-.18, -.17], [.18, -.17], [-.18, .17], [.18, .17]]) { const s = seg3(cam, [x + lx, -.44, z + lz], [x + lx * 1.15, 0, z + lz * 1.15]); if (s) { ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, .028 * s[0][2]); ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
  const c = cam.P(x, -.72, z - .21); if (c) { const k = c[2]; ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, .03 * k); ctx.beginPath(); ctx.ellipse(c[0], c[1], .19 * k, .26 * k, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(c[0] - .17 * k, c[1] + .12 * k); ctx.lineTo(c[0] - .19 * k, c[1] + .26 * k); ctx.moveTo(c[0] + .17 * k, c[1] + .12 * k); ctx.lineTo(c[0] + .19 * k, c[1] + .26 * k); ctx.stroke(); }
}
function drawWardrobe(ctx, t, cam, S) {
  const f = S.flood ?? 0;
  // the left side face (toward the window, facing -x) when visible, then the front (a billboard)
  if (cam.x < WARD.x0) poly3(ctx, cam, [[WARD.x0, WARD.top, 0], [WARD.x0, WARD.top, WARD.z0], [WARD.x0, 0, WARD.z0], [WARD.x0, 0, 0]], lit('#3a2420', '#9a6448', .2 + .3 * f));
  bb(ctx, cam, wardrobeTex(), WARD.x0, WARD.top, WARD.z0, WARD.x1 - WARD.x0, -WARD.top + .02);
  bb(ctx, cam, shirtTex(), HOOK.x - SHIRT.w / 2, HOOK.y - .03, HOOK.z, SHIRT.w, SHIRT.h);
}
// the tie: a 3D ribbon. u: 0 tied (knot at the collar, blade down the front) … .3 loosened and draped round the collar … .5 sliding off
// the left shoulder … .85 falling … 1 lying across the letter on the desk.
const TIE_N = 26;
function tieShape(u, t) {
  const X0 = HOOK.x, Ys = HOOK.y - .03, Z = HOOK.z - .012, pts = [];
  // states as functions of s (0 narrow tip … 1 wide tip): returns [x, y, z]
  const tied = (s) => {
    // hidden round the neck for s < .55 (behind the collar), the knot at s≈.6, the blade below
    if (s < .58) { const a = (s / .58) * Math.PI; return [X0 + .055 * Math.cos(a), Ys + .1 + .012 * Math.sin(a), Z + .01]; }
    const v = (s - .58) / .42; return [X0 + .002 * Math.sin(v * 3), Ys + .13 + v * .45, Z - .004];
  };
  const draped = (s) => {
    // two ends hanging either side of the placket (the narrow end on the left, the wide end on the right, longer)
    if (s < .42) { const v = (.42 - s) / .42; return [X0 - .05 - .005 * v, Ys + .1 + v * .32, Z - .002]; }
    if (s < .52) { const a = (s - .42) / .1 * Math.PI; return [X0 - .05 * Math.cos(a), Ys + .085 - .012 * Math.sin(a), Z + .008]; }
    const v = (s - .52) / .48; return [X0 + .05 + .004 * Math.sin(v * 4), Ys + .1 + v * .47, Z - .004];
  };
  const sliding = (s, w) => {   // slides off the left end of the hanger: the whole tie moves left and down, the right end pulled up and over
    const d = draped(s), k = w; return [d[0] - k * (.2 + .12 * (1 - s)), d[1] + k * (.06 + .1 * s * s) - k * .04 * Math.sin(s * Math.PI), d[2] - k * .03];
  };
  const landed = (s) => {   // across the letter on the desk, a soft S
    const x = LETTER.x + .12 - s * .44, z = LETTER.z - .02 + .07 * Math.sin(s * 5.2) - .03 * s; return [x, DESK.top - .006 - .004 * Math.sin(s * 9), z];
  };
  const fall = (s, w) => {    // falling with a flutter: from the sliding pose to the landed pose along an arc
    const A = sliding(s, 1), B = landed(s), e = w * w, x = mix(A[0], B[0], 1 - (1 - w) * (1 - w)), y = mix(A[1], B[1], e), z = mix(A[2], B[2], w);
    const flut = Math.sin(s * 9 - w * 12 + t * 6) * .035 * Math.sin(w * Math.PI);
    return [x + flut, y + flut * .4, z + Math.cos(s * 7 - w * 9) * .03 * Math.sin(w * Math.PI)];
  };
  for (let i = 0; i < TIE_N; i++) {
    const s = i / (TIE_N - 1);
    let p;
    if (u <= .3) { const w = smo(u / .3), a = tied(s), b = draped(s); p = a.map((v, j) => mix(v, b[j], w)); }
    else if (u <= .5) p = sliding(s, smo((u - .3) / .2));
    else if (u < .97) p = fall(s, (u - .5) / .47);
    else p = landed(s);
    pts.push(p);
  }
  return pts;
}
export function drawTie(ctx, t, cam, S) {
  const u = clamp(S.tie?.u ?? 0), f = S.flood ?? 0, pts = tieShape(u, t), scr = pts.map((p) => cam.P(...p)); if (scr.some((p) => !p)) return;
  const wAt = (s) => mix(.034, .084, Math.pow(s, 1.3));
  // ribbon outline in screen space
  const L = [], R = [];
  for (let i = 0; i < scr.length; i++) {
    const a = scr[Math.max(0, i - 1)], b = scr[Math.min(scr.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, hw = wAt(i / (scr.length - 1)) / 2 * scr[i][2];
    const [x, y] = scr[i]; L.push([x + nx * hw, y + ny * hw]); R.push([x - nx * hw, y - ny * hw]);
  }
  const hiddenEnd = u < .25 ? Math.round(TIE_N * .55 * (1 - u / .25)) : 0;   // the part round the neck is hidden while tied
  ctx.save();
  const base = '#2a2c52', stripe = '#e8a3a0';
  ctx.fillStyle = lit(base, '#6a6a9a', .25 * f); ctx.beginPath();
  for (let i = hiddenEnd; i < L.length; i++) (i === hiddenEnd ? ctx.moveTo(L[i][0], L[i][1]) : ctx.lineTo(L[i][0], L[i][1]));
  const tip = scr[scr.length - 1], tb = scr[scr.length - 2], td = Math.hypot(tip[0] - tb[0], tip[1] - tb[1]) || 1, tw = wAt(1) / 2 * tip[2];
  ctx.lineTo(tip[0] + (tip[0] - tb[0]) / td * tw * .9, tip[1] + (tip[1] - tb[1]) / td * tw * .9);
  for (let i = R.length - 1; i >= hiddenEnd; i--) ctx.lineTo(R[i][0], R[i][1]);
  ctx.closePath(); ctx.fill();
  // diagonal rose stripes clipped to the ribbon
  ctx.clip(); ctx.strokeStyle = rgba(stripe, .75); ctx.lineWidth = Math.max(1, .006 * scr[TIE_N - 1][2]);
  const bx = Math.min(...scr.map((p) => p[0])) - 60, bx1 = Math.max(...scr.map((p) => p[0])) + 60, by0 = Math.min(...scr.map((p) => p[1])) - 60, by1 = Math.max(...scr.map((p) => p[1])) + 60, st = Math.max(6, .028 * scr[TIE_N - 1][2]);
  ctx.beginPath(); for (let x = bx - (by1 - by0); x < bx1; x += st) { ctx.moveTo(x, by1); ctx.lineTo(x + (by1 - by0), by0); } ctx.stroke();
  ctx.restore();
  // the knot (a tight Windsor trapezoid) while tied; it loosens and is gone by u .25
  const kn = 1 - smo(u / .22);
  if (kn > .01) {
    const c = cam.P(HOOK.x, HOOK.y - .03 + .125, HOOK.z - .02); if (c) { const k = c[2], kw = .05 * k * (1 + (1 - kn) * .6), kh = .055 * k * kn;
      ctx.fillStyle = lit('#24264a', '#5a5a8a', .25 * f); ctx.beginPath(); ctx.moveTo(c[0] - kw * .55, c[1] - kh * .5); ctx.lineTo(c[0] + kw * .55, c[1] - kh * .5); ctx.lineTo(c[0] + kw * .3, c[1] + kh * .55); ctx.lineTo(c[0] - kw * .3, c[1] + kh * .55); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(stripe, .7); ctx.lineWidth = Math.max(1, .004 * k); ctx.beginPath(); ctx.moveTo(c[0] - kw * .4, c[1] - kh * .3); ctx.lineTo(c[0] + kw * .2, c[1] + kh * .4); ctx.moveTo(c[0] - kw * .1, c[1] - kh * .45); ctx.lineTo(c[0] + kw * .4, c[1] + kh * .1); ctx.stroke();
      ctx.strokeStyle = rgba('#000', .35); ctx.lineWidth = Math.max(1, .003 * k); ctx.beginPath(); ctx.moveTo(c[0], c[1] - kh * .5); ctx.lineTo(c[0] - kw * .08, c[1] + kh * .5); ctx.stroke(); }
  }
}

// ---------------------------------------------------------------- the whole room
export function drawRoom(ctx, t, cam, S) {
  S.L = S.L || roomLight(S.tod);
  const out = { tod: S.tod, ...S.out };
  // outside, through the openings (or full frame when the camera is out of the window)
  const aps = WIN.map((Wd) => aperture(cam, Wd)), full = aps.includes('full');
  if (full) { drawOutside(ctx, t, cam, out); if (out.plate >= .9999) return; }
  else {
    ctx.save(); ctx.beginPath(); for (const a of aps) if (a) pathPts(ctx, a, true); ctx.clip();
    drawOutside(ctx, t, cam, out);
    for (const Wd of WIN) drawRailing(ctx, t, cam, Wd);
    ctx.restore();
  }
  if (cam.z >= ROOM.thick) { for (const Wd of WIN) drawRailing(ctx, t, cam, Wd); return; }
  if (cam.z >= -.02) { drawReveals(ctx, t, cam, S); return; }
  drawWindowWall(ctx, t, cam, S);
  drawReveals(ctx, t, cam, S);
  drawShell(ctx, t, cam, S);
  patches(ctx, t, cam, S);
  for (const [i, Wd] of WIN.entries()) drawCasements(ctx, t, cam, S, Wd, (i ? .5 : .62) + .04 * Math.sin(t * .6 + i));
  drawDesk(ctx, t, cam, S);
  if (S.letterDraw) S.letterDraw(ctx, t, cam, 'desk');
  drawWardrobe(ctx, t, cam, S);
  drawTie(ctx, t, cam, S);
  drawChair(ctx, t, cam, S);
  for (const [i, Wd] of WIN.entries()) drawCurtain(ctx, t, cam, S, Wd, i);
  drawClock(ctx, t, cam, S);
  drawBed(ctx, t, cam, S);
  drawSleeper(ctx, t, cam, S);
  drawPillows(ctx, t, cam, S);
  // the headboard (nearest): a billboard at the head end
  bb(ctx, cam, headboardTex(), BED.x0 - .05, -1.32, BED.zh - .02, 1.64, 1.3);
  if (S.letterDraw) S.letterDraw(ctx, t, cam, 'air');
  beams(ctx, t, cam, S);
  motes(ctx, t, cam, S);
}
