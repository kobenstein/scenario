// Film 10 · B1 drawing module for c01–c03 (Editorial-Nacht). Builds on lib/f10_editorial.mjs (never changes it).
//   robotB      a clearer robot silhouette than the kit's (helmet head, broad chest, shoulder caps, joint rings, mitt hands),
//               rim light on the light side, walk cycle, head tilt, headless, open hands, cup. Kit wish: replace robot() with it.
//   robotHand   a big robot hand for close-ups (palm, four segmented fingers, thumb), curl 0..1, cup grip
//   cup         the stoneware cup as a flat shape (cream body, warm rim)
//   glyph       small symbols drawn in light (robot, house, hall, eye, hand, window, sun, planet, coin, road, gate, person, lens)
//   wipeText    type revealed by a mask from its baseline (never fades in), Instrument Serif numbers / Inter caps labels
//   tagFoot     the ORIGINAL FOOTAGE tag in the new look (light line + cream caps, no paper card)
//   raceTimes   the two race times on K2a as an explainer in light (numbers + time bars)
//   screenTrail a trail drawn from points given on different cards (projected each frame)
// Rules as in the kit: no canvas or pattern per frame, everything is paths + gradients.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
const { W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, expoOut, expoIn, quartIO, sineIO, halo, glowText } = E;

export const COOL = mixHex(P.blue2, P.cream, .35);          // machine / not yet / forecast
export const COOL_HI = mixHex(P.blue1, P.cream, .62);
export const WARM = P.core1, WARM2 = P.halo0;

// ---------------------------------------------------------------- shape helpers
function seg(path, a, b, w) { const p = new Path2D(); p.moveTo(a[0], a[1]); p.lineTo(b[0], b[1]); return path.op(p.stroke({ width: w, cap: 1, join: 1 }), PathOp.Union); }
function taper(path, a, b, w0, w1) {   // a limb that narrows from w0 to w1, round ends
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1e-6, nx = -dy / L, ny = dx / L;
  const p = new Path2D();
  p.moveTo(a[0] + nx * w0 / 2, a[1] + ny * w0 / 2); p.lineTo(b[0] + nx * w1 / 2, b[1] + ny * w1 / 2);
  p.arc(b[0], b[1], w1 / 2, Math.atan2(ny, nx), Math.atan2(-ny, -nx), false);
  p.lineTo(a[0] - nx * w0 / 2, a[1] - ny * w0 / 2);
  p.arc(a[0], a[1], w0 / 2, Math.atan2(-ny, -nx), Math.atan2(ny, nx), false); p.closePath();
  return path.op(p, PathOp.Union);
}
const ell = (x, y, rx, ry, r = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, r, 0, Math.PI * 2); return p; };
const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
const pol = (a, l, ang) => [a[0] + Math.sin(ang) * l, a[1] + Math.cos(ang) * l];

// ---------------------------------------------------------------- robotB
// local units: feet at y 0, top of the helmet at y −1; x + = facing direction (dir flips).
//   o.armR/armL [shoulder, elbow] (angles from straight down, + = forward), o.walk phase (rad) or null, o.legs [[hip, knee]×2] override,
//   o.head tilt (rad, + = looks up), o.lean (rad), o.headless, o.open (hands open 0..1), o.cup 'R'|'L', o.rim colour, o.body, o.joint,
//   o.light ±1 (screen side of the light), o.rimW (rim width), o.alpha, o.shadow (ground shadow strength)
// returns { R, L, head, shR, shL, elR, elL } in the caller's space.
export function robotB(ctx, x, y, h, o = {}) {
  const dir = o.dir ?? 1, Ls = (o.light ?? 1) * dir, lean = o.lean ?? 0;
  const armR = o.armR || [.06, .03], armL = o.armL || [-.05, -.02];
  const ph = o.walk, sw = ph == null ? 0 : Math.sin(ph);
  let legs = o.legs;
  if (!legs) {
    const a1 = ph == null ? .02 : .34 * sw, k1 = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7)) * .6, k2 = ph == null ? 0 : Math.max(0, Math.sin(ph + 1.7 + Math.PI)) * .6;
    legs = [[a1, a1 - k1], [-a1, -a1 - k2]];
  }
  const bob = ph == null ? 0 : .008 * Math.abs(Math.cos(ph));
  // upper body pivots around the hip
  const hipY = -.47 + bob, rot = (p) => { const dx = p[0], dy = p[1] - hipY, c = Math.cos(lean), s = Math.sin(lean); return [dx * c + dy * s, hipY - dx * s + dy * c]; };
  let p = new Path2D();
  // legs (behind), feet
  const J = {};
  legs.forEach(([a, k], i) => {
    const hp = [(i ? -1 : 1) * .058, hipY + .01], kn = pol(hp, .225, a), ft = pol(kn, .225, k);
    p = taper(p, hp, kn, .086, .07); p = taper(p, kn, ft, .07, .056);
    const f = rr(ft[0] - .035, ft[1] - .028, .1, .032, .014); p = p.op(f, PathOp.Union);
    J['kn' + i] = kn; J['ft' + i] = ft;
  });
  // pelvis
  p = p.op(rr(-.1, hipY - .06, .2, .085, .03), PathOp.Union);
  // torso: broad chest, narrow waist (in local coordinates, then leaned)
  const torso = new Path2D();
  const T = [[-.09, -.56], [-.115, -.66], [-.165, -.775], [-.155, -.81], [-.06, -.83], [.06, -.83], [.155, -.81], [.165, -.775], [.115, -.66], [.09, -.56]].map(rot);
  torso.moveTo(T[0][0], T[0][1]); for (let i = 1; i < T.length; i++) { const q = T[i]; torso.lineTo(q[0], q[1]); } torso.closePath();
  p = p.op(torso, PathOp.Union);
  // neck + helmet
  if (!o.headless) {
    const nk = rot([0, -.83]), hc = rot([0, -.915]), tilt = (o.head ?? 0);
    p = taper(p, nk, rot([0, -.87]), .05, .05);
    const hel = new Path2D(); hel.ellipse(hc[0] + .004, hc[1], .068, .082, -lean - tilt * .6, 0, Math.PI * 2); p = p.op(hel, PathOp.Union);
    // the helmet's back is a little fuller (reads as a head turned forward)
    const back = new Path2D(); back.ellipse(hc[0] - .018, hc[1] + .004, .058, .07, -lean, 0, Math.PI * 2); p = p.op(back, PathOp.Union);
    J.head = hc;
  } else J.head = rot([0, -.86]);
  // arms
  const hands = {};
  for (const s of [-1, 1]) {
    const [a1, a2] = s > 0 ? armR : armL, sh = rot([s * .148, -.778]);
    const el = pol(sh, .17, a1 + lean * 0), wr = pol(el, .158, a2);
    p = taper(p, sh, el, .072, .058); p = taper(p, el, wr, .058, .048);
    // mitt hand: a rounded block along the forearm direction, opens into two finger strokes
    const ang = a2, hd = pol(wr, .045, ang), op = o.open ?? 0;
    p = taper(p, wr, hd, .05, .044);
    if (op > 0) { p = taper(p, hd, pol(hd, .035, ang - .45 * op), .02, .016); p = taper(p, hd, pol(hd, .035, ang + .35 * op), .02, .016); }
    J['sh' + s] = sh; J['el' + s] = el; J['wr' + s] = wr; J['hd' + s] = hd;
    // shoulder cap
    p = p.op(ell(sh[0], sh[1] + .004, .048, .044), PathOp.Union);
  }
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h); ctx.globalAlpha = o.alpha ?? 1;
  if ((o.shadow ?? .6) > 0) { ctx.fillStyle = rgba(P.night0, o.shadow ?? .6); ctx.beginPath(); ctx.ellipse(-Ls * .12, 0, .24, .018, 0, 0, 6.29); ctx.fill(); }
  const body = o.body || P.night1, rimC = o.rim || P.blue0, rw = o.rimW ?? .016;
  ctx.fillStyle = body; ctx.fill(p);
  // rim: the silhouette minus itself shifted away from the light
  const shf = new Path2D(); shf.addPath(p, { a: 1, b: 0, c: 0, d: 1, e: -Ls * rw, f: rw * .45 });
  ctx.fillStyle = rimC; ctx.fill(new Path2D(p).op(shf, PathOp.Difference));
  // plates and joints: a chest seam and joint rings, a little lighter than the body
  const jc = o.joint || mixHex(body, rimC, .38);
  ctx.strokeStyle = rgba(jc, .9); ctx.lineWidth = .007;
  const c0 = rot([-.1, -.72]), c1 = rot([0, -.69]), c2 = rot([.1, -.72]);
  ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.quadraticCurveTo(c1[0], c1[1] + .02, c2[0], c2[1]); ctx.stroke();
  ctx.fillStyle = jc;
  for (const k of ['el-1', 'el1', 'kn0', 'kn1']) { const q = J[k]; ctx.beginPath(); ctx.arc(q[0], q[1], .02, 0, 6.29); ctx.fill(); }
  for (const s of [-1, 1]) { const q = J['sh' + s]; ctx.strokeStyle = rgba(jc, .8); ctx.lineWidth = .008; ctx.beginPath(); ctx.arc(q[0], q[1] + .004, .03, 0, 6.29); ctx.stroke(); }
  if (!o.headless) {   // a seam over the helmet (no face): reads as a turned head
    const hc = J.head; ctx.strokeStyle = rgba(jc, .75); ctx.lineWidth = .006; ctx.beginPath(); ctx.ellipse(hc[0] + .004, hc[1], .05, .078, -lean - (o.head ?? 0) * .6, -1.2, 1.2); ctx.stroke();
  }
  if (o.cup) { const q = J['hd' + (o.cup === 'L' ? -1 : 1)]; cupLocal(ctx, q[0] + .006, q[1] - .006, .07, o.cupCol); }
  ctx.restore();
  const S = (q) => [x + h * dir * q[0], y + h * q[1]];
  for (const s of [-1, 1]) hands[s > 0 ? 'R' : 'L'] = S(J['hd' + s]);
  return { ...hands, head: S(J.head), shR: S(J.sh1), shL: S(J['sh-1']), elR: S(J.el1), elL: S(J['el-1']), wrR: S(J.wr1), wrL: S(J['wr-1']), ftR: S(J.ft0), ftL: S(J.ft1) };
}

// ---------------------------------------------------------------- the cup (local: base centre at x,y, height s)
function cupLocal(ctx, x, y, s, col) {
  const w0 = s * .42, w1 = s * .5;
  ctx.fillStyle = col || P.cream;
  ctx.beginPath(); ctx.moveTo(x - w0, y); ctx.lineTo(x + w0, y); ctx.lineTo(x + w1, y - s); ctx.lineTo(x - w1, y - s); ctx.closePath(); ctx.fill();
}
// cup at screen size: o { lit 0..1 (warm rim), tilt rad, col, a }
export function cup(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt || 0); ctx.globalAlpha = o.a ?? 1;
  const w0 = s * .4, w1 = s * .5;
  const body = new Path2D(); body.moveTo(-w0, 0); body.quadraticCurveTo(0, s * .05, w0, 0); body.lineTo(w1, -s); body.lineTo(-w1, -s); body.closePath();
  ctx.fillStyle = lin(ctx, -w1, 0, w1, 0, [[0, mixHex(P.shade0, P.night1, .35)], [.55, mixHex(P.halo1, P.shade0, .25)], [1, mixHex(P.core1, P.halo0, .4)]]);
  ctx.fill(body);
  // unglazed foot
  ctx.fillStyle = rgba(P.night1, .35); ctx.fillRect(-w0 * 1.02, -s * .14, w0 * 2.04, s * .14);
  // rim ellipse + thumb dip
  ctx.fillStyle = mixHex(P.shade0, P.night0, .4); ctx.beginPath(); ctx.ellipse(0, -s, w1, s * .1, 0, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.core1, .55 + .45 * (o.lit ?? 0)); ctx.lineWidth = Math.max(1, s * .035); ctx.beginPath(); ctx.ellipse(0, -s, w1, s * .1, 0, Math.PI * .05, Math.PI * .95, true); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- big robot hand (close-ups)
// wrist at (x,y), ang = direction of the fingers (rad, 0 = right), s = palm length in px, o { curl 0..1, spread, thumb 0..1, flip ±1,
// body, rim, light ±1 (rim side, in the hand's own +y), forearm length (px, 0 = none) }. Returns { tip: [x,y] (index tip), palm: [x,y] }.
export function robotHand(ctx, x, y, s, ang, o = {}) {
  const curl = o.curl ?? .2, spread = o.spread ?? .15, fl = o.flip ?? 1, thumb = o.thumb ?? .3;
  let p = new Path2D();
  if (o.forearm) p = taper(p, [-o.forearm / s, 0], [-.05, 0], .5, .42);
  p = p.op(rr(-.08, -.27, .66, .54, .12), PathOp.Union);   // palm block
  const fing = [[-.2, 1.0], [-.07, 1.08], [.07, 1.02], [.2, .86]];
  let tip = null;
  fing.forEach(([v, len], i) => {
    let a = (i - 1.5) * spread * .18, q = [.56, v * 1.0];
    const segs = [.36, .26, .2].map((l) => l * len), ws = [.12, .105, .092];
    for (let k = 0; k < 3; k++) {
      const nx = q[0] + Math.cos(a) * segs[k], ny = q[1] + Math.sin(a) * segs[k];
      p = taper(p, q, [nx, ny], ws[k], ws[k] * .9); q = [nx, ny]; a += curl * (k ? .75 : .55);
    }
    if (i === 1) tip = q;
  });
  // thumb from the palm's lower corner, swings in with o.thumb
  { let a = -.9 + thumb * .9, q = [.08, .24]; for (const [l, w] of [[.32, .14], [.26, .12]]) { const nx = q[0] + Math.cos(a) * l, ny = q[1] + Math.sin(a) * l * -1 * -1; const n2 = [q[0] + Math.cos(a) * l, q[1] - Math.sin(a) * l * -1]; p = taper(p, q, n2, w, w * .9); q = n2; a -= .35 + curl * .3; } }
  const m = { a: Math.cos(ang) * s, b: Math.sin(ang) * s, c: -Math.sin(ang) * s * fl, d: Math.cos(ang) * s * fl, e: x, f: y };
  const path = new Path2D(); path.addPath(p, m);
  const body = o.body || P.night1, rim = o.rim || P.halo1;
  ctx.fillStyle = body; ctx.fill(path);
  const lx = -Math.sin(ang) * fl * (o.light ?? 1), ly = Math.cos(ang) * fl * (o.light ?? 1);   // light from the hand's +v side
  const sh = new Path2D(); sh.addPath(path, { a: 1, b: 0, c: 0, d: 1, e: -lx * s * .045, f: -ly * s * .045 });
  ctx.fillStyle = rim; ctx.fill(new Path2D(path).op(sh, PathOp.Difference));
  // knuckle rings
  ctx.strokeStyle = rgba(mixHex(body, rim, .45), .8); ctx.lineWidth = Math.max(1, s * .018);
  for (const [v] of fing) { const px = x + m.a * .56 + m.c * v, py = y + m.b * .56 + m.d * v; ctx.beginPath(); ctx.arc(px, py, s * .05, 0, 6.29); ctx.stroke(); }
  const T = (q) => [x + m.a * q[0] + m.c * q[1], y + m.b * q[0] + m.d * q[1]];
  return { tip: T(tip), palm: T([.3, 0]), grip: T([.62, .05]) };
}

// ---------------------------------------------------------------- glyphs of light
// stroke-built symbols, centred at (x,y), size s (≈ height in px). o { col, a, w (line width), fill 0..1 (warm fill), glow }
export function glyph(ctx, kind, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const col = o.col ?? WARM, w = o.w ?? Math.max(1.4, s * .07);
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = new Path2D(), u = s / 2;
  switch (kind) {
    case 'robot': {   // tiny figure: helmet, shoulders, legs
      path.ellipse(0, -u * .78, u * .2, u * .22, 0, 0, 6.29);
      path.moveTo(-u * .34, -u * .4); path.lineTo(u * .34, -u * .4); path.lineTo(u * .2, u * .12); path.lineTo(-u * .2, u * .12); path.closePath();
      path.moveTo(-u * .12, u * .12); path.lineTo(-u * .16, u); path.moveTo(u * .12, u * .12); path.lineTo(u * .16, u);
      break;
    }
    case 'person': { path.arc(0, -u * .74, u * .2, 0, 6.29); path.moveTo(0, -u * .46); path.lineTo(0, u * .3); path.moveTo(-u * .3, -u * .2); path.lineTo(u * .3, -u * .2); path.moveTo(0, u * .3); path.lineTo(-u * .2, u); path.moveTo(0, u * .3); path.lineTo(u * .2, u); break; }
    case 'house': { path.moveTo(-u * .8, -u * .05); path.lineTo(0, -u * .85); path.lineTo(u * .8, -u * .05); path.moveTo(-u * .6, -u * .2); path.lineTo(-u * .6, u * .8); path.lineTo(u * .6, u * .8); path.lineTo(u * .6, -u * .2); path.rect(-u * .18, u * .2, u * .36, u * .36); break; }
    case 'hall': { path.moveTo(-u, u * .7); path.lineTo(-u, -u * .2); for (let i = 0; i < 4; i++) { const x0 = -u + i * u * .5; path.lineTo(x0 + u * .5, -u * .7); path.lineTo(x0 + u * .5, -u * .2); } path.lineTo(u, u * .7); path.closePath(); break; }
    case 'factory': { path.moveTo(-u, u * .7); path.lineTo(-u, -u * .1); path.lineTo(-u * .35, -u * .45); path.lineTo(-u * .35, -u * .1); path.lineTo(u * .3, -u * .45); path.lineTo(u * .3, -u * .1); path.lineTo(u, -u * .45); path.lineTo(u, u * .7); path.closePath(); path.moveTo(-u * .6, -u * .25); path.lineTo(-u * .6, -u * 1.0); break; }
    case 'eye': { path.moveTo(-u, 0); path.quadraticCurveTo(0, -u * .9, u, 0); path.quadraticCurveTo(0, u * .9, -u, 0); path.moveTo(u * .3, 0); path.arc(0, 0, u * .3, 0, 6.29); break; }
    case 'lens': { path.arc(0, 0, u * .8, 0, 6.29); path.moveTo(u * .35, 0); path.arc(0, 0, u * .35, 0, 6.29); break; }
    case 'hand': {   // open palm, fingers up
      path.moveTo(-u * .45, u * .9); path.lineTo(-u * .5, -u * .05);
      const f = [[-.38, -.55], [-.13, -.85], [.12, -.8], [.35, -.55]];
      path.moveTo(-u * .5, -u * .05); for (const [fx, fy] of f) { path.lineTo(u * fx, u * fy); path.moveTo(u * fx, -u * .1); }
      path.moveTo(-u * .5, -u * .05); path.lineTo(u * .45, -u * .05); path.lineTo(u * .45, u * .9);
      path.moveTo(u * .45, u * .2); path.lineTo(u * .82, -u * .12);
      break;
    }
    case 'window': { path.rect(-u * .6, -u * .8, u * 1.2, u * 1.6); path.moveTo(0, -u * .8); path.lineTo(0, u * .8); path.moveTo(-u * .6, -u * .25); path.lineTo(u * .6, -u * .25); break; }
    case 'sun': { path.moveTo(-u, u * .25); path.lineTo(u, u * .25); path.moveTo(u * .55, u * .25); path.arc(0, u * .25, u * .55, 0, Math.PI, true); for (let i = 0; i < 5; i++) { const q = Math.PI * (1.15 + i * .175); path.moveTo(Math.cos(q) * u * .75, u * .25 + Math.sin(q) * u * .75); path.lineTo(Math.cos(q) * u * .98, u * .25 + Math.sin(q) * u * .98); } break; }
    case 'planet': { path.arc(0, 0, u * .62, 0, 6.29); path.moveTo(-u, u * .22); path.bezierCurveTo(-u * .5, -u * .3, u * .5, -u * .55, u, -u * .22); break; }
    case 'coin': { path.ellipse(0, -u * .45, u * .7, u * .2, 0, 0, 6.29); path.moveTo(-u * .7, -u * .45); path.lineTo(-u * .7, u * .45); path.ellipse(0, u * .45, u * .7, u * .2, 0, Math.PI, 0, true); path.lineTo(u * .7, -u * .45); break; }
    case 'road': { path.moveTo(-u * .9, u); path.lineTo(-u * .08, -u); path.moveTo(u * .9, u); path.lineTo(u * .08, -u); path.moveTo(0, u * .7); path.lineTo(0, u * .3); path.moveTo(0, -u * .1); path.lineTo(0, -u * .35); break; }
    case 'gate': { path.moveTo(-u, u); path.lineTo(-u, -u * .2); path.arc(0, -u * .2, u, Math.PI, 0); path.lineTo(u, u); break; }
    case 'cam': { path.roundRect(-u * .8, -u * .5, u * 1.6, u * 1.0, u * .15); path.moveTo(u * .32, 0); path.arc(0, 0, u * .32, 0, 6.29); break; }
    case 'chip': { path.roundRect(-u * .6, -u * .6, u * 1.2, u * 1.2, u * .12); for (let i = -1; i <= 1; i++) { path.moveTo(u * .3 * i, -u * .6); path.lineTo(u * .3 * i, -u * .85); path.moveTo(u * .3 * i, u * .6); path.lineTo(u * .3 * i, u * .85); path.moveTo(-u * .6, u * .3 * i); path.lineTo(-u * .85, u * .3 * i); path.moveTo(u * .6, u * .3 * i); path.lineTo(u * .85, u * .3 * i); } break; }
    case 'book': { path.moveTo(0, -u * .6); path.quadraticCurveTo(-u * .5, -u * .8, -u, -u * .6); path.lineTo(-u, u * .6); path.quadraticCurveTo(-u * .5, u * .4, 0, u * .6); path.quadraticCurveTo(u * .5, u * .4, u, u * .6); path.lineTo(u, -u * .6); path.quadraticCurveTo(u * .5, -u * .8, 0, -u * .6); path.lineTo(0, u * .6); break; }
    default: path.arc(0, 0, u * .5, 0, 6.29);
  }
  if ((o.fill ?? 0) > 0) { ctx.globalAlpha = a * o.fill * .85; ctx.fillStyle = col; ctx.fill(path); }
  if (o.glow !== false) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * .22; ctx.strokeStyle = col; ctx.lineWidth = w * 4.5; ctx.stroke(path); ctx.globalAlpha = a * .3; ctx.lineWidth = w * 2.2; ctx.stroke(path); ctx.globalCompositeOperation = 'source-over'; }
  ctx.globalAlpha = a; ctx.strokeStyle = o.core ?? mixHex(col, P.core0, .5); ctx.lineWidth = w; ctx.stroke(path);
  ctx.restore();
}

// ---------------------------------------------------------------- type revealed from the baseline (never a fade)
// u 0..1 reveal (expo-out inside), o as glowText plus { out: 0..1 (sinks back below the baseline) }
export function wipeText(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return 0;
  const size = o.size ?? E.TYPE.label, out = o.out ?? 0, k = expoOut(clamp(u)) * (1 - quartIO(clamp(out)));
  if (k <= 0) return 0;
  const font = o.serif ? `${size}px "Instrument Serif"` : `${o.weight ?? 600} ${size}px Inter`;
  ctx.save(); ctx.font = font; if (o.spacing) ctx.letterSpacing = `${o.spacing}em`;
  const tw = ctx.measureText(s).width, al = o.align ?? 'left', x0 = al === 'center' ? x - tw / 2 : al === 'right' ? x - tw : x;
  const asc = size * (o.serif ? .78 : .76), desc = size * .26;
  ctx.beginPath(); ctx.rect(x0 - size, y - asc - size * .5, tw + size * 2, asc + desc + size * .5); ctx.clip();
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - size, y - asc - size * .6, tw + size * 2, asc + desc + size * .6); ctx.clip();
  glowText(ctx, s, x, y + (1 - k) * (asc + desc) * 1.05, { ...o, size });
  ctx.restore();
  return tw;
}
export const textW = (ctx, s, size, o = {}) => { ctx.save(); ctx.font = o.serif ? `${size}px "Instrument Serif"` : `${o.weight ?? 600} ${size}px Inter`; if (o.spacing) ctx.letterSpacing = `${o.spacing}em`; const w = ctx.measureText(s).width; ctx.restore(); return w; };

// a number block of light: big serif number, label (Inter caps), source (small). Revealed in order (number, label 0.3 s later, source).
//   o { x, y, num, label, src, t0 (reveal start), t1 (sink start, optional), align, size, col, labelCol }
export function numBlock(ctx, t, o) {
  const size = o.size ?? 150, al = o.align ?? 'left', out = o.t1 != null ? span(t, o.t1, o.t1 + .55) : 0;
  wipeText(ctx, o.num, o.x, o.y, span(t, o.t0, o.t0 + .7), { serif: true, size, align: al, col: o.col ?? P.cream, out });
  let y = o.y + size * .42;
  if (o.label) for (const ln of [].concat(o.label)) { y += 4; wipeText(ctx, ln, o.x + (al === 'left' ? 4 : 0), y + 34, span(t, o.t0 + .3, o.t0 + .95), { size: o.labelSize ?? 36, spacing: .14, glow: false, col: o.labelCol ?? P.halo2, align: al, out: o.t1 != null ? span(t, o.t1 - .1, o.t1 + .45) : 0 }); y += (o.labelSize ?? 36) * 1.25; }
  if (o.src) wipeText(ctx, o.src, o.x + (al === 'left' ? 4 : 0), y + 30 + 14, span(t, o.t0 + .55, o.t0 + 1.2), { size: 26, spacing: .16, glow: false, col: rgba(P.halo2, .78), align: al, out: o.t1 != null ? span(t, o.t1 - .2, o.t1 + .35) : 0 });
}

// ---------------------------------------------------------------- ORIGINAL FOOTAGE tag in the editorial look
// bottom left above the subtitle band: a soft night pool behind, a short line of light, place · date (cream caps), ORIGINAL FOOTAGE (60 %)
export function tagFoot(ctx, t, { place, t0, x = 108, y = 846 }) {
  const u = span(t, t0 + .12, t0 + .8); if (u <= 0) return;
  ctx.save();
  ctx.fillStyle = rad(ctx, x + 220, y + 10, 520, [[0, rgba(P.night0, .5)], [1, rgba(P.night0, 0)]]); ctx.fillRect(x - 200, y - 260, 940, 420);
  const k = expoOut(u), lw = 74 * k;
  ctx.fillStyle = rgba(P.core1, .95); ctx.fillRect(x, y - 52, lw, 3);
  halo(ctx, x + lw, y - 50.5, 20, .5 * k);
  ctx.restore();
  wipeText(ctx, place.toUpperCase(), x, y, span(t, t0 + .25, t0 + .95), { size: 34, spacing: .16, col: P.cream, glow: true });
  wipeText(ctx, 'ORIGINAL FOOTAGE', x, y + 42, span(t, t0 + .45, t0 + 1.1), { size: 24, spacing: .22, col: rgba(P.cream, .62), glow: false });
}

// ---------------------------------------------------------------- the two race times on K2a ("faster"): numbers + time bars in light
// right third over the footage, on a soft night pool (never a box). t0 = "faster", t1 = end of the slot.
export function raceTimes(ctx, t, t0, t1) {
  const u = span(t, t0 - .35, t0 + .45); if (u <= 0) return;
  const x = 1210, y = 150;
  ctx.save();
  ctx.fillStyle = rad(ctx, x + 300, y + 230, 760, [[0, rgba(P.night0, .82 * smooth(u))], [.55, rgba(P.night0, .55 * smooth(u))], [1, rgba(P.night0, 0)]]);
  ctx.fillRect(x - 500, y - 520, 1400, 1300); ctx.restore();
  // bars: length = time (the robot's is shorter = faster), grow from a common start line of light
  const L = 600, r = 50 * 60 + 26, hm = 57 * 60 + 20, k1 = expoOut(span(t, t0 + .05, t0 + .95)), k2 = expoOut(span(t, t0 + .55, t0 + 1.45));
  ctx.save(); ctx.fillStyle = rgba(P.cream, .9); ctx.fillRect(x, y + 6, 2.5, 330 * smooth(u)); ctx.restore();
  bar(ctx, x, y + 150, L * r / hm * k1, 16, WARM, k1);
  bar(ctx, x, y + 318, L * k2, 16, COOL_HI, k2);
  wipeText(ctx, '50:26', x + 24, y + 116, span(t, t0 + .1, t0 + .8), { serif: true, size: 120 });
  wipeText(ctx, 'ROBOT · 2026', x + 250, y + 112, span(t, t0 + .35, t0 + 1.0), { size: 34, spacing: .14, glow: false, col: P.halo2 });
  wipeText(ctx, '57:20', x + 24, y + 284, span(t, t0 + .6, t0 + 1.3), { serif: true, size: 120, col: COOL_HI });
  wipeText(ctx, 'HUMAN WORLD RECORD', x + 250, y + 252, span(t, t0 + .85, t0 + 1.5), { size: 34, spacing: .14, glow: false, col: COOL_HI });
  wipeText(ctx, 'AT THE TIME', x + 250, y + 294, span(t, t0 + .95, t0 + 1.6), { size: 34, spacing: .14, glow: false, col: COOL_HI });
}
function bar(ctx, x, y, w, h, col, a) {
  if (w <= 1) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(col, .25 * a); ctx.fillRect(x, y - h * 1.2, w, h * 3.4); ctx.restore();
  ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, rgba(col, .55)], [1, col]]); ctx.fillRect(x, y, w, h);
  halo(ctx, x + w, y + h / 2, 40, .7 * a);
}

// ---------------------------------------------------------------- a trail through points on different cards
// pts: [[Z, u, v, w], …] (card depth + design point + width); projected with camera c every frame, then smoothed and drawn.
export function screenPts(c, pts) { const out = []; for (const [Z, u, v, w] of pts) { const q = E.project(c, Z, u, v); if (q) out.push([q[0], q[1], (w ?? 3) * Math.pow(q[2], .55)]); } return out; }

// ---------------------------------------------------------------- simple world pieces
// a lit wall/sky: night gradient with a saturated blue bloom around a light point (the thumbnails' look)
export function bloomBg(ctx, lx, ly, r, a = 1, stops) {
  E.nightSky(ctx, stops || [[0, P.night0], [.6, P.night1], [1, P.ind0]]);
  ctx.fillStyle = rad(ctx, lx, ly, r, [[0, rgba(P.blue0, a)], [.4, rgba(P.blue0, .5 * a)], [.75, rgba(P.ind1, .22 * a)], [1, rgba(P.ind0, 0)]]);
  ctx.fillRect(-W * 2, -H * 2, W * 5, H * 5);
}
// fine light ticks on a trail point (joints)
export function ticks(ctx, pts, at, a = 1) { for (const f of at) { const i = Math.min(pts.length - 1, Math.round(f * (pts.length - 1))), q = pts[i]; halo(ctx, q[0], q[1], 26, .55 * a); ctx.fillStyle = rgba(P.core0, a); ctx.beginPath(); ctx.arc(q[0], q[1], 3.2, 0, 6.29); ctx.fill(); } }
// arc of light between two points with lift (used for the copied move and its echoes)
export function arcPts(a, b, lift, w, n = 16) { return E.catmull([[a[0], a[1], w], [lerp(a[0], b[0], .3), Math.min(a[1], b[1]) - lift * .8, w], [lerp(a[0], b[0], .7), Math.min(a[1], b[1]) - lift * .8, w], [b[0], b[1], w]], n); }
export { sineIO, quartIO, expoIn };
