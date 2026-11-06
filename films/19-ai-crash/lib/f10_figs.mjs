// Film 10 kit, figures: the robot (Lerner / Heimroboter / Kleiner / Läufer), robot hands, human hands, the Führung (signature move),
// people with faces (person10 on figure.mjs), the cup, and the crowd (die Milliarde).
import { Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, prng, PAL, SKINS, mixHex, shadeHex, expoOut, qio, sineS, noise1, trace } from './f10_core.mjs';
import { figure, life, blink, walk, POSES, reachArm, handPos } from './figure.mjs';
import { hand as handDraw, handTip } from './hand.mjs';
import { VAL, hgt } from './f10_valley.mjs';
export { walk, POSES, life, blink, reachArm, handPos };

// ---------------------------------------------------------------- shading helpers (one light: L from light(); side +1 = light from +x)
function capPath(x1, y1, r1, x2, y2, r2) {
  const p = new Path2D(), a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(clamp((r1 - r2) / (d || 1), -1, 1));
  p.moveTo(x1 + Math.cos(a + Math.PI / 2 + k) * r1, y1 + Math.sin(a + Math.PI / 2 + k) * r1);
  p.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); p.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); p.closePath(); return p;
}
// fill a path with a shadow tone, then the lit tone shifted towards the light (clipped), then a thin rim on the lit edge
function shaded(ctx, path, base, L, side, w, o = {}) {
  const sh = mixHex(base, L.shade, o.shadeK ?? .42), li = L.lit(base, 1), off = w * (o.off ?? .32);
  ctx.fillStyle = sh; ctx.fill(path);
  ctx.save(); ctx.clip(path);
  ctx.translate(side * off, -off * .35); ctx.fillStyle = li; ctx.fill(path); ctx.translate(-side * off, off * .35);
  if (o.rim !== false) { ctx.translate(-side * off * .25, 0); ctx.strokeStyle = rgba(L.rim, o.rimA ?? .9); ctx.lineWidth = Math.max(.6, w * .14); ctx.translate(side * off * .05, 0); ctx.stroke(path); }
  ctx.restore();
  if (o.line !== false) { ctx.strokeStyle = rgba(PAL.ink, o.lineA ?? .35); ctx.lineWidth = o.lw ?? Math.max(.5, w * .05); ctx.stroke(path); }
}

// ---------------------------------------------------------------- the robot
// robot(ctx, x, y, s, pose, o): x,y = hip on screen, s = scale (1 → 185 px ≈ 1.7 m), facing +x (o.flip mirrors).
//   pose (radians, like figure.mjs): { lean, head, sh:[front,back], el:[front,back], hip:[front,back], kn:[front,back], ft:[front,back] }
//   o: { t, seed, L (light), side (+1 light from +x screen side), kind 'learner'|'home'|'small'|'runner', bib '053', headless, visor {rec},
//        handFn(ctx, i, wrist[x,y], ang, s) (draw the hand yourself, e.g. a big robotHand in a close-up), shadow, airTo {col, k} (fog mix) }
export const RPOSE = {
  stand: { sh: [.08, -.04], el: [.18, .14] },
  sitSlump: { hip: [1.45, 1.35], kn: [1.25, 1.1], sh: [.1, .05], el: [.1, .08], lean: .32, head: .45 },
  armsUp: { sh: [2.2, 2.0], el: [.55, .6], head: -.25 },      // both hands raised in front, palms up
  offer: { sh: [.95, .8], el: [.45, .5], head: .12 },          // forearms forward, hands open (receiving)
  lift: { sh: [.7, .1], el: [1.1, .2], head: .1 },             // lifting a cup to the chest
};
export function robot(ctx, x, y, s, pose = {}, o = {}) {
  const P = Object.assign({ lean: .02, head: 0, sh: [.08, -.04], el: [.18, .14], hip: [.02, -.02], kn: [0, 0], ft: [0, 0] }, pose);
  const t = o.t || 0, seed = o.seed || 0, L = o.L, f = o.flip ? -1 : 1, kind = o.kind || 'learner';
  if (o.t != null && !pose._still) { const l = life(t, seed + 3); P.head += l.nod * .05; P.lean += l.b * .004; }   // a robot idles too: a small servo drift
  const shellC = kind === 'home' ? PAL.knit : PAL.robotShell, joint = PAL.robotJoint, side = (o.side ?? -1) * f;
  const air = (c) => (o.airTo ? mixHex(c, o.airTo.col, o.airTo.k) : c);
  const LL = o.airTo ? { ...L, lit: (c, k) => air(L.lit(c, k)), shade: air(L.shade) } : L;
  if (s * 185 < 9) { // far: a two-tone stick
    ctx.fillStyle = air(L.lit(shellC, .8)); ctx.fillRect(x - s * 8, y - s * 92, s * 16, s * 70); ctx.fillStyle = air(L.lit(joint, .5)); ctx.fillRect(x - s * 5, y - s * 22, s * 10, s * 110); return {};
  }
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
  const sm = s < .5;
  // ground shadow
  if (o.shadow !== false) { const g = ctx.createRadialGradient(0, 92, 0, 0, 92, 42); g.addColorStop(0, rgba(L.shade, .45)); g.addColorStop(1, rgba(L.shade, 0)); ctx.save(); ctx.translate(0, 92); ctx.scale(1, .18); ctx.translate(0, -92); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 92, 42, 0, 7); ctx.fill(); ctx.restore(); }
  const legPts = (i) => {
    const hx = i ? -3 : 3, a = P.hip[i], kn = P.kn[i], ka = a - kn;
    const K = [hx + Math.sin(a) * 45, Math.cos(a) * 45], A = [K[0] + Math.sin(ka) * 43, K[1] + Math.cos(ka) * 43];
    const fa = (P.ft?.[i] || 0), T = [A[0] + Math.cos(fa) * 21, A[1] + 4 + Math.sin(fa) * 21];
    return { Hp: [hx, 0], K, A, T };
  };
  const rot = (px, py) => { const c = Math.cos(P.lean), sn = Math.sin(P.lean); return [px * c - py * sn, px * sn + py * c]; };
  const armPts = (i) => {
    const S = rot(i ? -2 : 2, -60), a = P.sh[i] + P.lean, e = P.el[i];
    const E = [S[0] + Math.sin(a) * 29, S[1] + Math.cos(a) * 29], Wr = [E[0] + Math.sin(a + e) * 26, E[1] + Math.cos(a + e) * 26];
    return { S, E, Wr, ang: a + e };
  };
  const limb = (A, B, r1, r2, back) => {
    const g = capPath(A[0], A[1], r1, B[0], B[1], r2);
    shaded(ctx, g, back ? shadeHex(joint, -.03) : joint, LL, side, r1 * 2, { rimA: back ? .35 : .7, shadeK: .2 });
    // porcelain shell plate on the outer half of the segment
    if (!sm) { const m = [mix(A[0], B[0], .18), mix(A[1], B[1], .18)], n = [mix(A[0], B[0], .8), mix(A[1], B[1], .8)]; shaded(ctx, capPath(m[0], m[1], r1 * .92, n[0], n[1], r2 * .9), back ? shadeHex(shellC, -.08) : shellC, LL, side, r1 * 2, { rimA: back ? .3 : .85 }); }
  };
  const ring = (p, r, back) => { ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fillStyle = air(L.lit(joint, back ? .2 : .5)); ctx.fill(); if (!sm) { ctx.strokeStyle = rgba(L.rim, back ? .25 : .6); ctx.lineWidth = r * .28; ctx.beginPath(); ctx.arc(p[0], p[1], r * .72, side > 0 ? -1.6 : 1.6, side > 0 ? 1.0 : 4.6); ctx.stroke(); } };
  const handSmall = (W0, ang, back, i) => {
    if (o.handFn && o.handFn(ctx, i, W0, ang, back)) return;
    const d = [Math.sin(ang), Math.cos(ang)], q = [W0[0] + d[0] * 9, W0[1] + d[1] * 9];
    shaded(ctx, capPath(W0[0], W0[1], 4.2, q[0], q[1], 4.6), back ? shadeHex(joint, -.05) : joint, LL, side, 8, { rimA: .5, shadeK: .2 });
    ctx.strokeStyle = air(L.lit(joint, .35)); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) { const pp = [q[0] + (k - 1) * 1.6 * d[1], q[1] - (k - 1) * 1.6 * d[0]]; ctx.beginPath(); ctx.moveTo(pp[0], pp[1]); ctx.lineTo(pp[0] + d[0] * 6 + d[1] * 1.5, pp[1] + d[1] * 6 - d[0] * 1.5); ctx.stroke(); }
  };
  // back arm, back leg
  { const a = armPts(1); limb(a.S, a.E, 5.4, 4.6, true); ring(a.E, 4.4, true); limb(a.E, a.Wr, 4.4, 3.8, true); handSmall(a.Wr, a.ang, true, 1); }
  { const l = legPts(1); limb(l.Hp, l.K, 7.2, 5.8, true); ring(l.K, 5.6, true); limb(l.K, l.A, 5.6, 4.4, true); foot(l.A, l.T, true); }
  function foot(A, T, back) { const g = new Path2D(); g.moveTo(A[0] - 6, A[1] - 2); g.quadraticCurveTo(A[0] - 7, A[1] + 7, A[0] - 3, A[1] + 8); g.lineTo(T[0] + 2, T[1] + 4); g.quadraticCurveTo(T[0] + 5, T[1] - 2, T[0] - 4, T[1] - 4); g.lineTo(A[0] + 4, A[1] - 4); g.closePath(); shaded(ctx, g, back ? shadeHex(shellC, -.1) : shellC, LL, side, 10, { rimA: .6 }); }
  // pelvis + torso shell
  { const l = legPts(0); limb(l.Hp, l.K, 7.4, 6, false); ring(l.K, 5.8, false); limb(l.K, l.A, 5.8, 4.6, false); foot(l.A, l.T, false); }
  const tp = new Path2D(); const T = (px, py) => rot(px, py);
  { const pts = [[-11, 4], [12, 4], [13, -10], [16, -30], [17, -48], [12, -64], [2, -69], [-10, -66], [-14, -52], [-13, -30], [-12, -12]].map(([a, b]) => T(a, b));
    tp.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const p0 = pts[i - 1], p1 = pts[i]; tp.quadraticCurveTo(p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2); } tp.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); tp.closePath(); }
  // waist joint (graphite) visible between pelvis and chest
  { const g = capPath(...T(-9, -12), 5, ...T(10, -12), 5); ctx.fillStyle = air(L.lit(joint, .4)); ctx.fill(g); }
  shaded(ctx, tp, shellC, LL, side, 30, { rimA: .95, off: .22 });
  if (!sm) {
    // seams: chest plate and abdomen
    ctx.strokeStyle = rgba(PAL.ink, .28); ctx.lineWidth = .8; ctx.beginPath();
    const a1 = T(-12, -24), a2 = T(15, -26), b1 = T(-11, -8), b2 = T(13, -9); ctx.moveTo(a1[0], a1[1]); ctx.quadraticCurveTo(...T(2, -21), a2[0], a2[1]); ctx.moveTo(b1[0], b1[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke();
    if (kind === 'home') { ctx.strokeStyle = rgba(shadeHex(PAL.knit, -.15), .5); ctx.lineWidth = .7; ctx.beginPath(); for (let k = -60; k < 0; k += 4) { const p = T(-12, k), q = T(15, k - 1); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke(); }
    if (o.bib) { const c0 = T(3, -42); ctx.save(); ctx.translate(c0[0], c0[1]); ctx.rotate(P.lean); ctx.fillStyle = '#f8f6f0'; ctx.fillRect(-8, -6, 16, 11); ctx.strokeStyle = rgba(PAL.ink, .5); ctx.lineWidth = .5; ctx.strokeRect(-8, -6, 16, 11); ctx.fillStyle = PAL.ink; ctx.font = '600 6.5px "Inter"'; ctx.textAlign = 'center'; ctx.fillText(o.bib, 0, 2.6); ctx.restore(); }
    if (kind === 'home' && o.statusLight != null) { const n0 = T(4, -66); ctx.fillStyle = o.statusLight > .5 ? '#9fe0a8' : '#5a6460'; ctx.beginPath(); ctx.arc(n0[0], n0[1], 1.5, 0, 7); ctx.fill(); }
  }
  // neck + head
  let headC = null;
  if (!o.headless) {
    const N0 = T(2, -67), N1 = T(3, -75); ring(N0, 4.6, false); ring(N1, 4.2, false);
    const hc = T(5, -87); headC = hc;
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(P.lean + P.head);
    robotHead(ctx, LL, side, { sm, visor: o.visor, kind, air });
    ctx.restore();
  } else { const N0 = T(2, -67); ring(N0, 4.8, false); ctx.fillStyle = air(L.lit(joint, .2)); ctx.beginPath(); ctx.ellipse(N0[0], N0[1] - 3, 5, 2, 0, 0, 7); ctx.fill(); }
  // front arm
  const fa = armPts(0); ring(fa.S, 6, false); limb(fa.S, fa.E, 5.6, 4.8, false); ring(fa.E, 4.6, false); limb(fa.E, fa.Wr, 4.6, 4, false); handSmall(fa.Wr, fa.ang, false, 0);
  ctx.restore();
  const toScr = (p) => [x + p[0] * s * f, y + p[1] * s];
  const ba = armPts(1);
  return { wrist: (i) => toScr(i ? ba.Wr : fa.Wr), elbow: (i) => toScr(i ? ba.E : fa.E), head: headC ? toScr(headC) : null, ang: (i) => (i ? ba.ang : fa.ang), feetY: y + 92 * s, shoulder: toScr(fa.S) };
}
// the head: an egg-shaped porcelain helmet, a dark visor with a soft sky reflection (never eyes), a seam, an ear disc
export function robotHead(ctx, L, side, { sm = false, visor = {}, kind = 'learner', air = (c) => c } = {}) {
  const g = new Path2D(); g.ellipse(0, 0, 12.6, 14.6, -.08, 0, 7);
  shaded(ctx, g, kind === 'home' ? PAL.knit : PAL.robotShell, { ...L, lit: (c, k) => air(L.lit(c, k)), shade: air(L.shade) }, side, 26, { rimA: 1, off: .2 });
  const v = new Path2D(); v.moveTo(1, -9); v.quadraticCurveTo(13.5, -9, 13.2, 1); v.quadraticCurveTo(12.6, 7.5, 3, 6.8); v.quadraticCurveTo(-1, 0, 1, -9); v.closePath();
  ctx.fillStyle = air(PAL.robotVisor); ctx.fill(v);
  if (!sm) {
    ctx.save(); ctx.clip(v);
    const gr = ctx.createLinearGradient(0, -9, 0, 7); gr.addColorStop(0, rgba(air(L.sky[1]), .55)); gr.addColorStop(.45, rgba(air(L.sky[0]), .18)); gr.addColorStop(1, rgba(L.sky[0], 0));
    ctx.fillStyle = gr; ctx.fillRect(0, -10, 15, 18);
    ctx.strokeStyle = rgba('#ffffff', .35); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(4, -7); ctx.quadraticCurveTo(11, -7, 12, -2); ctx.stroke();
    if (visor && visor.rec > 0) { ctx.fillStyle = rgba('#e0605a', visor.rec); ctx.beginPath(); ctx.arc(10, 3.5, 1.1, 0, 7); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = rgba(PAL.ink, .3); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-3, -14); ctx.quadraticCurveTo(-6, 0, -2, 13); ctx.stroke();
    ctx.fillStyle = air(L.lit(PAL.robotJoint, .5)); ctx.beginPath(); ctx.ellipse(-4.5, 1, 3, 3.6, 0, 0, 7); ctx.fill();
  }
}

// ---------------------------------------------------------------- hands
// robotHand(ctx, x, y, s, o): wrist at x,y, s = 1 → ~150 px wrist to fingertip (like hand.mjs), fingers along o.ang (0 = right).
//   o: { L, side, curl 0..1 (or [5]), spread, flip (mirror: thumb on the other side), palm 'back'|'front' }
export function robotHand(ctx, x, y, s, o = {}) {
  const L = o.L, side = o.side ?? -1, f = o.flip ? -1 : 1, curl = Array.isArray(o.curl) ? o.curl : [0, 1, 2, 3, 4].map(() => o.curl ?? .2);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang || 0); ctx.scale(s, s * f);
  const joint = PAL.robotJoint, shell = PAL.robotShell, sd = side;
  // forearm stub + wrist ring
  if (o.arm !== false) { shaded(ctx, capPath(-120, 0, 15, -6, 0, 13), joint, L, sd, 30, { rimA: .7, shadeK: .2 }); shaded(ctx, capPath(-112, -1, 14, -26, -1, 12.5), shell, L, sd, 28, { rimA: .9 }); }
  ctx.beginPath(); ctx.arc(-2, 0, 13, 0, 7); ctx.fillStyle = L.lit(joint, .45); ctx.fill(); ctx.strokeStyle = rgba(L.rim, .6); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(-2, 0, 10, -1.4, 1.2); ctx.stroke();
  // fingers (behind the palm plate at the knuckles): 3 segments each, ring joints
  const F = [[-15, 22, 17, 13], [-5, 25, 19, 14], [5, 23, 17, 13], [14.5, 18, 14, 11]];
  const fingerAt = (i) => {
    const [by, l1, l2, l3] = F[i], c = curl[i + 1] ?? curl[0], base = [54 - Math.abs(by) * .1, by], spread = (o.spread ?? .4) * [-.1, -.03, .04, .11][i];
    let a = spread + c * .55, p = base, pts = [p];
    for (const [l, k] of [[l1, 1], [l2, 1.15], [l3, 1.25]]) { const q = [p[0] + Math.cos(a) * l, p[1] + Math.sin(a) * l]; pts.push(q); p = q; a += c * .62 * k; }
    return pts;
  };
  const drawFinger = (pts, r) => {
    for (let k = 0; k < 3; k++) shaded(ctx, capPath(pts[k][0], pts[k][1], r - k * .6, pts[k + 1][0], pts[k + 1][1], r - k * .6 - .4), joint, L, sd, r * 2, { rimA: .75, shadeK: .18, lw: .6 });
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(pts[k][0], pts[k][1], r - k * .6 + .4, 0, 7); ctx.fillStyle = L.lit(joint, .6); ctx.fill(); ctx.strokeStyle = rgba(L.rim, .55); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(pts[k][0], pts[k][1], r - k * .6 - .6, -1.5, 1.2); ctx.stroke(); }
    const tp = pts[3]; ctx.beginPath(); ctx.arc(tp[0], tp[1], r - 1.4, 0, 7); ctx.fillStyle = L.lit(shell, .7); ctx.fill();
  };
  for (let i = 0; i < 4; i++) drawFinger(fingerAt(i), 5.6 - i * .35);
  // palm: graphite frame + porcelain back plate with a seam
  const pm = new Path2D(); pm.moveTo(2, -16); pm.quadraticCurveTo(28, -24, 56, -21); pm.quadraticCurveTo(62, 0, 54, 20); pm.quadraticCurveTo(28, 22, 2, 15); pm.quadraticCurveTo(-4, 0, 2, -16); pm.closePath();
  shaded(ctx, pm, joint, L, sd, 40, { rimA: .5, shadeK: .2 });
  if (o.palm !== 'front') {
    const pb = new Path2D(); pb.moveTo(8, -13); pb.quadraticCurveTo(30, -19, 50, -17); pb.quadraticCurveTo(55, 0, 49, 15); pb.quadraticCurveTo(28, 17, 8, 12); pb.quadraticCurveTo(4, 0, 8, -13); pb.closePath();
    shaded(ctx, pb, shell, L, sd, 34, { rimA: 1, off: .2 });
    ctx.strokeStyle = rgba(PAL.ink, .3); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(30, -16); ctx.quadraticCurveTo(33, 0, 29, 15); ctx.stroke();
  } else { ctx.fillStyle = rgba('#1a1c20', .35); ctx.beginPath(); ctx.ellipse(32, 0, 16, 11, 0, 0, 7); ctx.fill(); }
  // thumb
  const tc = curl[0], ta = -1.05 + tc * .55; let p = [12, -17], a = ta; const tp = [p];
  for (const l of [22, 16, 12]) { const q = [p[0] + Math.cos(a) * l, p[1] + Math.sin(a) * l]; tp.push(q); p = q; a += .35 + tc * .4; }
  drawFinger(tp, 6.4);
  ctx.restore();
  const T = (px, py) => { const c = Math.cos(o.ang || 0), sn = Math.sin(o.ang || 0); py *= f; return [x + (px * c - py * sn) * s, y + (px * sn + py * c) * s]; };
  return { tip: T(...fingerAt(1)[3]), palm: T(30, 0), knuckle: T(54, 0), T };
}
// a human hand (hand.mjs) in the light of the day
export function humanHand(ctx, x, y, s, o = {}) {
  const L = o.L;
  handDraw(ctx, x, y, s, { pose: o.pose || 'open', ang: o.ang || 0, flip: o.flip, skin: o.skin || SKINS[1], sleeve: o.sleeve === undefined ? PAL.you : o.sleeve, sleeveLen: o.sleeveLen, rim: L ? L.rim : '#ffe7c0', light: o.lightDir || [L && L.dir[0] < 0 ? -.8 : .8, -.6], t: o.t, seed: o.seed, close: o.close, spread: o.spread });
  return { tip: handTip(x, y, s, { pose: o.pose || 'open', ang: o.ang || 0, flip: o.flip, close: o.close }) };
}
// THE FÜHRUNG (signature move): a human hand holds and guides a robot hand. Screen space, centred on (x, y), s = 1 → hands ~300 px.
//   u: grip 0..1 (the hand closes, 0.6 s expo-out in the shot), arc: the shared arc offset (px, already eased), release 0..1 (the hand opens and lifts)
//   returns { start (human fingertip), robotWrist, robotTip } for the trace
export function guide(ctx, t, { x, y, s = 1, L, u = 1, arc = [0, 0], release = 0, robotAng = 1.25, humanAng = 1.95, side = -1 }) {
  const lag = clamp(u - .08) * 1;                                  // robot fingers answer 80 ms later, smaller
  const rx = x - 40 * s + arc[0], ry = y - 190 * s + arc[1] * .85, hx = x + 120 * s + arc[0] * 1.05, hy = y - 205 * s + arc[1] - release * 30 * s;
  const R = robotHand(ctx, rx, ry, s * 1.1, { L, side, ang: robotAng, curl: [.25 + .2 * lag, .3 + .45 * lag, .32 + .5 * lag, .34 + .5 * lag, .36 + .45 * lag], spread: .5 });
  const Hh = humanHand(ctx, hx, hy, s * 1.32, { L, ang: humanAng - .15 * release, flip: true, pose: 'grip', close: clamp(u * (1 - release * 1.4)) * .55, t, seed: 3, sleeveLen: 300 });
  return { start: Hh.tip, robotWrist: [rx, ry], robotTip: R.tip, robotPalm: R.palm };
}

// ---------------------------------------------------------------- people with faces (figure.mjs → art.person)
// who: 'you' (ochre knit) | 'grandma' | 'trainer' (petrol jacket, ponytail, VR headset) | 'grower' | 'worker' | 'villager'
export const WHO = {
  you: { dress: { coat: PAL.you, pants: '#3c4152', shoes: '#2a2524', skin: SKINS[1], hair: '#2a1f1a' }, hair: 'short' },
  grandma: { dress: { coat: PAL.grandma, pants: '#5a4e5c', shoes: '#3a2f2c', skin: SKINS[4], hair: '#ece6dc' }, hair: 'bun', skirt: true },
  trainer: { dress: { coat: PAL.trainer, pants: '#2f3440', shoes: '#26282c', skin: '#e2b994', hair: '#1b1615' }, hair: 'bun' },
  grower: { dress: { coat: PAL.grower, pants: '#3b4a5c', shoes: '#3a2f2c', skin: SKINS[2], hair: '#3a2a20' }, hair: 'cap' },
  worker: { dress: { coat: '#6d7f8c', pants: '#3a3f48', shoes: '#2a2524', skin: SKINS[3], hair: '#1e1714' }, hair: 'short' },
  villager: { dress: { coat: '#b8695a', pants: '#4a3f3a', shoes: '#2a2524', skin: SKINS[3], hair: '#1a1210' }, hair: 'long' },
};
export function person10(ctx, t, who, x, y, s, pose = {}, o = {}) {
  const W0 = WHO[who] || WHO.you, L = o.L;
  const p = { ...pose, hair: pose.hair || W0.hair, skirt: W0.skirt || pose.skirt };
  const lx = L && L.dir[0] < 0 ? -1 : 1;
  // above s 7 the figure is drawn at 7 and scaled up (cost and memory of the person layer grow with s²; near figures are soft anyway)
  const S7 = Math.min(s, 7), up = s / S7;
  if (up > 1) { ctx.save(); ctx.translate(x, y); ctx.scale(up, up); x = 0; y = 0; }
  const r0 = figure(ctx, x, y, S7, p, { t, seed: o.seed ?? 1, dress: { ...W0.dress, ...(o.dress || {}) }, flip: o.flip, rim: L ? L.rim : '#ffe7c0', rimSide: (o.flip ? -1 : 1) * (o.rimSide ?? lx), light: o.light, shadeA: o.shadeA, prop: o.prop, cast: o.cast, shadow: o.shadow, part: o.part, arm: o.arm });
  if (who === 'trainer' && o.headset !== 'off' && r0.head) headset(ctx, r0.head, S7, o.flip ? -1 : 1, o.headset || 'up', L);
  if (up > 1) ctx.restore();
  if (up === 1) return r0;
  const X0 = arguments[3], Y0 = arguments[4], m = (q) => [X0 + q[0] * up, Y0 + q[1] * up];
  return { ...r0, hand: (i) => m(r0.hand(i)), arm: (i) => { const a = r0.arm(i); return { s: m(a.s), e: m(a.e), h: m(a.h), ang: a.ang }; }, head: r0.head && m(r0.head), feetY: Y0 + (r0.feetY) * up, shoulder: r0.shoulder && m(r0.shoulder) };
}
// a VR headset: on the eyes ('on') or pushed up on the forehead ('up', so we see her face)
function headset(ctx, h, s, f, mode, L) {
  const up = mode === 'up', cx = h[0] + f * 3.5 * s, cy = h[1] + (up ? -9 : -1) * s;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(f, 1); ctx.rotate(up ? -.35 : 0);
  ctx.strokeStyle = '#2a2d33'; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.ellipse(-5 * s, 1 * s, 9.5 * s, 4 * s, .1, 0, 7); ctx.stroke();
  ctx.fillStyle = '#eceae4'; ctx.beginPath(); ctx.roundRect(1 * s, -3.4 * s, 8.6 * s, 6.8 * s, 2.4 * s); ctx.fill();
  ctx.fillStyle = '#2a2d33'; ctx.fillRect(8.4 * s, -2.6 * s, 1.4 * s, 5.2 * s);
  if (L) { ctx.strokeStyle = rgba(L.rim, .7); ctx.lineWidth = .8 * s; ctx.beginPath(); ctx.moveTo(2 * s, -3.2 * s); ctx.lineTo(9 * s, -3.2 * s); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the cup (always the same: hand-thrown stoneware, ochre glaze, bare foot)
export function cup(ctx, x, y, s, o = {}) {   // x,y = centre of the base on screen, s = 1 → 100 px tall
  const L = o.L, side = o.side ?? -1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  // body: slightly irregular cylinder, wider at the base, a thumb dent at the rim
  const b = new Path2D(); b.moveTo(-34, 0); b.quadraticCurveTo(-36, -50, -31, -96); b.lineTo(-12, -98); b.quadraticCurveTo(-6, -93, 0, -98); b.lineTo(31, -97); b.quadraticCurveTo(35, -50, 33, 0); b.quadraticCurveTo(0, 7, -34, 0); b.closePath();
  const clay = o.clay ?? 0, glaze = mixHex('#c9853f', '#b9875e', clay), foot = '#cdb08a';
  shaded(ctx, b, glaze, L, side, 60, { rimA: .95, off: .26 });
  // the unglazed foot band and the drip edge of the glaze
  ctx.save(); ctx.clip(b); ctx.fillStyle = L.lit(foot, .75); ctx.beginPath(); ctx.moveTo(-40, -18); for (let k = 0; k <= 8; k++) ctx.lineTo(-40 + k * 10, -18 - 3 * Math.sin(k * 1.9)); ctx.lineTo(40, 10); ctx.lineTo(-40, 10); ctx.closePath(); ctx.fill(); ctx.restore();
  // handle
  ctx.strokeStyle = L.lit(glaze, .55); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(32, -76); ctx.bezierCurveTo(58, -76, 60, -30, 32, -28); ctx.stroke();
  ctx.strokeStyle = rgba(L.rim, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(36, -74); ctx.bezierCurveTo(54, -72, 55, -36, 36, -32); ctx.stroke();
  // rim ellipse (inside dark) and steam
  ctx.fillStyle = shadeHex(glaze, -.25); ctx.beginPath(); ctx.ellipse(0, -97, 31, 6, 0, 0, 7); ctx.fill();
  if (o.fill) { ctx.fillStyle = '#6b4a34'; ctx.beginPath(); ctx.ellipse(0, -95, 27, 4.5, 0, 0, 7); ctx.fill(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the crowd (die Milliarde)
// One field of tiny learner robots for the whole film. Members have a home on the terrain and walk there from the road.
// crowdField(o) → fn(ctx, V, push) for valley({ crowd }). o: { t, L, n, group 0..1 (first walkers on the road), spread 0..1,
//   ghost 0..1 (dotted forecast), sink 0..1 (sinking back into the fields), wave: { t0, at:[x,z] } (warm dots run outward),
//   raise: { at:[x,z], r } (members within r m raise their hands), lights 0..1 }
let SPR = null;
export async function prepareFigs() {
  if (SPR) return;
  SPR = {};
  const L0 = { lit: (c, k) => mixHex(c, '#8f8a96', (1 - k) * .45), shade: '#8f8a96', rim: '#fff4dc', sky: ['#c9dce4', '#f4e0bf'], dir: [-1, .1, .3] };
  for (const [name, pose] of [['stand', {}], ['walkA', walk(0)], ['walkB', walk(Math.PI)], ['up', RPOSE.armsUp]]) {
    const c = createCanvas(64, 110), x = c.getContext('2d');
    robot(x, 32, 58, .42, pose, { L: L0, side: -1, shadow: false });
    SPR[name] = await loadImage(c.toBuffer('image/png'));
  }
}
const CROWD = (() => {
  const r = prng(2050), out = [];
  for (let i = 0; i < 9000; i++) {
    let x, z, tries = 0;
    do { x = -1500 + r() * 3000; z = 10 + Math.pow(r(), .8) * 1500; tries++; } while (tries < 20 && (Math.abs(z - (300 + 8 * Math.sin(x / 80))) < 14 || (x > -18 && x < 18 && z > 206 && z < 278)));
    out.push({ x, z, sx: -150 + r() * 40, ph: r() * 6.28, d0: r(), seed: i, ord: 0 });
  }
  // a dense patch around the landing spot of 1.13 (many raised hands behind the hero robot)
  for (let i = 0; i < 220; i++) { const a = r() * 6.28, d = 3 + Math.pow(r(), .7) * 70; out.push({ x: VAL.crowdSpot[0] + Math.cos(a) * d * 1.3, z: VAL.crowdSpot[1] + 4 + Math.abs(Math.sin(a)) * d, ph: r() * 6.28, seed: 5000 + i, ord: 0 }); }
  // order: nearest to the start line first (the flood spreads from the road)
  for (const m of out) m.ord = Math.hypot(m.x - VAL.startX, (m.z - 95) * 1.4);
  const mx = Math.max(...out.map((m) => m.ord)); for (const m of out) m.ord /= mx;
  return out;
})();
export function crowdField(o) {
  const { t, L } = o;
  return (ctx, V, push) => {
    const group = o.group ?? 0, spread = o.spread ?? 0, sink = o.sink ?? 0, ghost = o.ghost ?? 0, n = o.n ?? CROWD.length;
    for (let i = 0; i < n; i++) {
      const m = CROWD[i];
      // the first 40 are the group on the road; the rest leave the road when spread reaches their order
      let px, pz, moving = false;
      const isGroup = i < 40;
      const roadX = VAL.startX + 10 + (i % 40) * 1.6 + (isGroup ? 0 : 0), roadZ = VAL.roadZ(roadX) + ((i * 7) % 5 - 2) * 1.1;
      const gIn = isGroup ? clamp(group * 1.4 - (i / 40) * .4) : 0;
      if (spread <= 0 && !isGroup) continue;
      const k = clamp((spread - m.ord * .85) / .15);
      if (isGroup && spread <= 0) { if (gIn <= 0) continue; px = mix(VAL.startX - 70, roadX, sineS(gIn)); pz = roadZ; moving = gIn < 1; }
      else { const e = sineS(k); if (k <= 0 && !isGroup) continue; px = mix(roadX, m.x, e); pz = mix(roadZ, m.z, e); moving = k > 0 && k < 1; }
      const y = hgt(px, pz), q = V.toCam([px, y, pz]); if (q[2] < .3 || q[2] > 5000) continue;
      const s = V.P([px, y, pz]); if (s.x < -60 || s.x > W + 60 || s.y < -60 || s.y > H + 200) continue;
      push([px, y + .01, pz], () => {
        let hpx = 1.7 * s.k * (1 - sink * .85);
        const ra = o.raise && Math.hypot(px - o.raise.at[0], pz - o.raise.at[1]) < o.raise.r ? clamp((t - o.raise.t0 - Math.hypot(px - o.raise.at[0], pz - o.raise.at[1]) * .03) / .6) : 0;
        if (hpx < 4.5 || ghost > .5) {
          // far: a graphite stroke with a porcelain head (reads on the light fields)
          const a = (1 - ghost * .45) * (1 - sink * .7), d = Math.max(1.2, hpx * .32), hh = Math.max(2.2, hpx);
          ctx.fillStyle = rgba(L.air('#4a4d55', q[2], .7), .85 * a); ctx.fillRect(s.x - d / 2, s.y - hh, d, hh);
          ctx.fillStyle = rgba(mixHex(L.air('#f6f3ec', q[2], .7), '#f2fdff', L.lamp ?? 0), a); ctx.fillRect(s.x - d / 2, s.y - hh, d, Math.max(1, hh * .3));   // at night the heads are points of light (a map of light from above)
        } else if (hpx < 60) {
          const im = ra > .5 ? SPR.up : moving ? (Math.sin(t * 9 + m.ph) > 0 ? SPR.walkA : SPR.walkB) : SPR.stand;
          const w = hpx * 64 / 81, hh = hpx * 110 / 81;
          ctx.drawImage(im, s.x - w / 2, s.y - hh * 96.6 / 110, w, hh);
          if (q[2] > 120) { ctx.fillStyle = rgba(L.fog, clamp(1 - Math.exp(-q[2] / 2600 * 1.3))); ctx.fillRect(s.x - w * .3, s.y - hpx, w * .6, hpx); }
        } else {
          const pose = ra > 0 ? { sh: [mix(.08, RPOSE.armsUp.sh[0], ra), mix(-.04, RPOSE.armsUp.sh[1], ra)], el: [mix(.18, .55, ra), mix(.14, .6, ra)], head: -.2 * ra } : moving ? walk(t * 9 + m.ph) : {};
          robot(ctx, s.x, s.y - 92 * hpx / 185 / 1.0, hpx / 185, pose, { t, seed: m.seed, L, side: -1, airTo: { col: L.fog, k: clamp(1 - Math.exp(-q[2] / 2600 * 1.3)) } });
        }
        if (o.wave && t > o.wave.t0) {
          const dd = Math.hypot(px - o.wave.at[0], pz - o.wave.at[1]), ta = o.wave.t0 + .1 + dd / 260, a = clamp((t - ta) / .25) * (1 - clamp((t - ta - 1.2) / 1.5) * .6);
          if (a > 0) { const r0 = Math.max(1.4, hpx * .09); ctx.fillStyle = rgba(PAL.traceWarm, a); ctx.beginPath(); ctx.arc(s.x, s.y - hpx * .62, r0, 0, 7); ctx.fill(); if (hpx > 6) { ctx.fillStyle = rgba(PAL.traceGlow, .35 * a); ctx.beginPath(); ctx.arc(s.x, s.y - hpx * .62, r0 * 3, 0, 7); ctx.fill(); } }
        }
      });
    }
  };
}
export const CROWD_MEMBERS = CROWD;
