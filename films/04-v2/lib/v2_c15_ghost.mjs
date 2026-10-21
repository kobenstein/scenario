// c15 · the ghosts of everyone who has ever lived: people of the past as engraved silhouettes made of dots (Film 5's ghost-line language:
// a dotted cream line = not (or no longer) there). A small side-view rig (bones → tapered capsules); only the dots on the OUTER contour of
// the body are drawn (a dot that falls inside another limb is dropped), plus a very faint fill. Props (sickle, hoe, spear, basket, child …)
// are dotted lines in the hand. Dots creep slowly along the contour (alive); reveal modes let a ghost rise out of the ground in dots.
//
//   ghost(ctx, x, y, sc, pose, o)   x, y = screen point on the ground between the feet; sc = px per figure unit (standing height ≈ 100·sc)
//     pose: { lean, head, sh:[front, back], el:[…], hip:[…], kn:[…], ft:[…], robe: 0 | 'knee' | 'ankle', hat, bulk, seat: true (pelvis
//             at x, y: sitting), kid: 0..1 (child proportions) }  angles in rad: lean + = torso forward; sh = upper arm from straight down
//             (world, + forward); el + = forearm flexes forward/up; hip = thigh from straight down (+ forward); kn = knee flexion; ft = foot
//             pitch (absolute, + toe down); head + = nod down (relative to the torso).
//     o: { dir 1 | -1 (facing), t, seed, col, a (alpha), fill (.07), pitch (px between dots), r (dot radius px), crawl (px/s),
//          reveal: { u, mode: 'rise' | 'fall' | 'sweep' }, warm: { x, y, col, a } (dots facing that screen point take the colour),
//          props: [{ kind, … }] }
//   POSE / mixPose(a, b, u) / workPose(kind, phase) / tools: see below.
import { rgba, clamp, mix } from '../engine.mjs';
import { hash } from './v2_c15_kit.mjs';

const TAU = Math.PI * 2;
export const POSE = {
  stand: { lean: .02, head: 0, sh: [.12, -.04], el: [.25, .2], hip: [.06, -.06], kn: [.04, .02], ft: [0, 0] },
  look: { lean: -.06, head: -.55, sh: [.1, -.02], el: [.22, .18], hip: [.05, -.05], kn: [.03, .02], ft: [0, 0] },
  bent: { lean: 1.05, head: -.15, sh: [.2, .05], el: [.2, .1], hip: [.55, .2], kn: [.55, .45], ft: [0, 0] },
  sit: { lean: .08, head: .05, sh: [.4, .3], el: [1.1, 1.0], hip: [1.5, 1.45], kn: [1.55, 1.5], ft: [0, 0], seat: true },
};
export function mixPose(a, b, u) {
  const o = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const A = a[k] ?? b[k], B = b[k] ?? a[k];
    if (Array.isArray(A)) o[k] = A.map((v, i) => mix(v, B[i] ?? v, u));
    else if (typeof A === 'number') o[k] = mix(A, B, u);
    else o[k] = u < .5 ? A : B;
  }
  return o;
}
// work cycles (phase in cycles): every ghost of the valleys works bent, each its own way
export function workPose(kind, ph, o = {}) {
  const c = Math.cos(ph * TAU), s = Math.sin(ph * TAU), sw = .5 - .5 * c;            // sw 0..1 the stroke
  if (kind === 'sickle') return { lean: 1.12 + .05 * s, head: -.25, sh: [mix(.35, 1.25, sw), .55 + .1 * c], el: [mix(.5, .05, sw), .25], hip: [.62, .18], kn: [.7, .5], ft: [0, 0], robe: o.robe };
  if (kind === 'hoe') return { lean: mix(.55, .85, sw), head: -.1, sh: [mix(2.35, .75, sw), mix(2.1, .95, sw)], el: [mix(.15, .45, sw), mix(.35, .3, sw)], hip: [.32, -.05], kn: [.32, .12], ft: [0, 0], robe: o.robe };
  if (kind === 'glean') return { lean: 1.35 + .04 * s, head: -.35, sh: [mix(.15, .45, sw), .3 - .1 * c], el: [.12, .2], hip: [.42, .05], kn: [.25, .15], ft: [0, 0], robe: o.robe };
  if (kind === 'carry') return { lean: .42 + .03 * s, head: -.05, sh: [2.75, 2.6], el: [.35, .45], hip: [mix(.25, -.1, sw), mix(-.1, .25, sw)], kn: [mix(.15, .45, sw), mix(.45, .15, sw)], ft: [0, 0], robe: o.robe };
  if (kind === 'haul') return { lean: .62 + .04 * s, head: -.12, sh: [1.35 + .08 * c, 1.25 + .08 * c], el: [.15, .2], hip: [.5 + .15 * s, -.35 - .15 * s], kn: [.6, .25], ft: [0, .2], robe: o.robe };
  if (kind === 'plant') return { lean: 1.48 + .03 * s, head: -.45, sh: [mix(.05, .35, sw), .2], el: [.05, .1], hip: [.3, .1], kn: [.12, .08], ft: [0, 0], robe: o.robe };
  return POSE.stand;
}

// ---------------------------------------------------------------- the rig (figure units; y down, ground y = 0, forward = +x)
const LEN = { shin: 24, thigh: 25, ankle: 3, spine: 29, neck: 4.5, head: 7.6, ua: 18, fa: 16 };
function rig(P) {
  const kid = P.kid || 0, f = mix(1, .62, kid), hk = mix(1, 1.3, kid);
  const L = (n) => LEN[n] * f;
  const leg = (i) => {
    const a = P.hip[i], k = a - P.kn[i];
    const kx = Math.sin(a) * L('thigh'), ky = Math.cos(a) * L('thigh');
    const ax = kx + Math.sin(k) * L('shin'), ay = ky + Math.cos(k) * L('shin');
    const fp = (P.ft && P.ft[i]) || 0, fx = Math.cos(fp), fy = Math.sin(fp);
    return { knee: [kx, ky], ankle: [ax, ay], heel: [ax - 3 * f * fx, ay + L('ankle') - 3 * f * fy], toe: [ax + 10 * f * fx, ay + L('ankle') + 10 * f * fy] };
  };
  const lg = [leg(0), leg(1)];
  const ln = P.lean, sx = Math.sin(ln), sy = -Math.cos(ln);
  const chest = [sx * L('spine') * .62, sy * L('spine') * .62], sho = [sx * L('spine'), sy * L('spine')];
  const ha = ln + (P.head || 0) * .85, nk = [sho[0] + Math.sin(ln + (P.head || 0) * .4) * L('neck'), sho[1] - Math.cos(ln + (P.head || 0) * .4) * L('neck')];
  const head = [nk[0] + Math.sin(ha) * L('head') * hk * .8, nk[1] - Math.cos(ha) * L('head') * hk * .8];
  const arm = (i) => {
    const so = [sho[0] - (i ? 1.5 : -1.5) * f * Math.cos(ln), sho[1] + 2.5 * f], a = P.sh[i], e = a + P.el[i];
    const el = [so[0] + Math.sin(a) * L('ua'), so[1] + Math.cos(a) * L('ua')], wr = [el[0] + Math.sin(e) * L('fa'), el[1] + Math.cos(e) * L('fa')];
    return { so, el, wr, hand: [wr[0] + Math.sin(e) * 2.4 * f, wr[1] + Math.cos(e) * 2.4 * f], ang: e };
  };
  const am = [arm(0), arm(1)];
  return { lg, am, chest, sho, nk, head, ha, f, hk };
}
// shapes: { c: [x1,y1,r1,x2,y2,r2] } tapered capsule, { e: [x,y,rx,ry,rot] } ellipse, { p: [[x,y],…] } polygon (clockwise)
function shapes(P, R, o) {
  // painter's order back → front; each shape may name a parent (the shape its joint sits in): a dot is dropped when it falls inside a
  // shape in front of it, or inside its parent (so joints never show a cap). Front limbs keep their contour over the body (a drawing).
  const f = R.f, b = P.bulk ?? 1, S = [];
  const add = (sh, parent) => { sh.par = parent; S.push(sh); return S.length - 1; };
  const cap = (x1, y1, r1, x2, y2, r2, parent) => add({ c: [x1, y1, r1 * b, x2, y2, r2 * b] }, parent);
  const legS = (l, par) => { const th = cap(0, 0, 5.6 * f, l.knee[0], l.knee[1], 4.1 * f, par); const sn = cap(l.knee[0], l.knee[1], 3.9 * f, l.ankle[0], l.ankle[1], 2.6 * f, th); add({ c: [l.heel[0], l.heel[1] - 1.8 * f, 2.3 * f, l.toe[0], l.toe[1] - 1.3 * f, 1.5 * f] }, sn); };
  const armS = (a, par) => { const ua = cap(a.so[0], a.so[1], 3.5 * f, a.el[0], a.el[1], 2.8 * f, par); const fa = cap(a.el[0], a.el[1], 2.7 * f, a.wr[0], a.wr[1], 2.1 * f, ua); add({ e: [a.hand[0], a.hand[1], 2.5 * f, 2.9 * f, a.ang] }, fa); };
  // the torso first as an invisible index so the back limbs can name it as parent
  const iBackLeg = S.length; legS(R.lg[1], -2); const iBackArm = S.length; armS(R.am[1], -3);
  const pel = cap(-1.2 * f * Math.cos(P.lean), 1, 7.4 * f, R.chest[0], R.chest[1], 8.3 * f, -1);
  const che = cap(R.chest[0], R.chest[1], 8.1 * f, R.sho[0], R.sho[1], 6.3 * f, pel);
  S[iBackLeg].par = pel; S[iBackArm].par = che;
  const nek = cap(R.sho[0], R.sho[1], 2.9 * f, R.nk[0], R.nk[1], 2.6 * f, che);
  const hed = add({ e: [R.head[0], R.head[1], 6.1 * f * R.hk, 6.9 * f * R.hk, R.ha] }, nek);
  // a hint of the face (nose / chin) so a stranger reads where the ghost looks
  { const rr = 6.1 * f * R.hk, fx = Math.cos(R.ha), fy = Math.sin(R.ha), ux = Math.sin(R.ha), uy = -Math.cos(R.ha); add({ e: [R.head[0] + fx * rr * .86 - ux * rr * .22, R.head[1] + fy * rr * .86 - uy * rr * .22, 1.9 * f, 2.4 * f, R.ha] }, hed); }
  // hats
  const hd = R.head, hr = 6.4 * f * R.hk, up = [Math.sin(R.ha), -Math.cos(R.ha)], fw = [Math.cos(R.ha), Math.sin(R.ha)];
  if (P.hat === 'brim') { add({ e: [hd[0] + up[0] * hr * .8, hd[1] + up[1] * hr * .8, hr * .8, hr * .55, R.ha] }, hed); add({ e: [hd[0] + up[0] * hr * .55, hd[1] + up[1] * hr * .55, hr * 1.85, hr * .3, R.ha] }, -1); }
  if (P.hat === 'cap') { add({ e: [hd[0] + up[0] * hr * .45 - fw[0] * .5, hd[1] + up[1] * hr * .45 - fw[1] * .5, hr * 1.02, hr * .62, R.ha] }, hed); add({ c: [hd[0] + up[0] * hr * .35, hd[1] + up[1] * hr * .35, 1.1 * f, hd[0] + up[0] * hr * .3 + fw[0] * hr * 1.45, hd[1] + up[1] * hr * .3 + fw[1] * hr * 1.45, .8 * f] }, -1); }
  if (P.hat === 'scarf') { add({ e: [hd[0] - fw[0] * .8 + up[0] * .6, hd[1] - fw[1] * .8 + up[1] * .6, hr * 1.12, hr * 1.12, R.ha] }, hed); add({ c: [hd[0] - fw[0] * hr * .7, hd[1] - fw[1] * hr * .7, hr * .7, hd[0] - fw[0] * hr * 1.1 - up[0] * hr * 1.6, hd[1] - fw[1] * hr * 1.1 - up[1] * hr * 1.6, hr * .45] }, hed); }
  if (P.hat === 'bun') add({ e: [hd[0] - fw[0] * hr * .95 + up[0] * hr * .5, hd[1] - fw[1] * hr * .95 + up[1] * hr * .5, hr * .42, hr * .42, 0] }, hed);
  if (P.hat === 'hood') add({ e: [hd[0] - fw[0] * 1.2 + up[0] * .4, hd[1] - fw[1] * 1.2 + up[1] * .4, hr * 1.18, hr * 1.25, R.ha] }, hed);
  const iFrontLeg = S.length; legS(R.lg[0], pel);
  // robe (a dress or long coat): from the waist to the knees or ankles, spanning the stance; in front of the legs
  if (P.robe) {
    const wl = .14, w0 = [R.chest[0] * wl / .62, R.chest[1] * wl / .62], nx = Math.cos(P.lean), ny = Math.sin(P.lean);
    const hemPts = P.robe === 'knee' ? [R.lg[0].knee, R.lg[1].knee] : [R.lg[0].ankle, R.lg[1].ankle];
    const hy = Math.max(hemPts[0][1], hemPts[1][1]) + (P.robe === 'knee' ? 4 : -1) * f, hx0 = Math.min(hemPts[0][0], hemPts[1][0]) - (P.robe === 'knee' ? 6 : 7.5) * f, hx1 = Math.max(hemPts[0][0], hemPts[1][0]) + (P.robe === 'knee' ? 6 : 7.5) * f;
    add({ p: [[w0[0] - nx * 8.4 * f, w0[1] - ny * 8.4 * f], [w0[0] + nx * 8.4 * f, w0[1] + ny * 8.4 * f], [hx1, hy], [mix(hx0, hx1, .5), hy + 1.2 * f], [hx0, hy]] }, pel);
  }
  armS(R.am[0], che);
  return S;
}
const signedArea = (P) => { let a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
function inside(sh, x, y, eps) {
  if (sh.c) {
    const [x1, y1, r1, x2, y2, r2] = sh.c, dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
    const u = l2 > 1e-9 ? clamp(((x - x1) * dx + (y - y1) * dy) / l2) : 0, px = x1 + dx * u, py = y1 + dy * u, r = mix(r1, r2, u) - eps;
    return (x - px) * (x - px) + (y - py) * (y - py) < r * r;
  }
  if (sh.e) {
    const [cx, cy, rx, ry, rot] = sh.e, c = Math.cos(-rot), s = Math.sin(-rot), lx = (x - cx) * c - (y - cy) * s, ly = (x - cx) * s + (y - cy) * c;
    const a = rx - eps, b = ry - eps; if (a <= 0 || b <= 0) return false; return (lx * lx) / (a * a) + (ly * ly) / (b * b) < 1;
  }
  if (sh.p) { const P = sh.p; let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c; } return c; }
  return false;
}
// outline points of a shape (screen px), each with an outward normal: [x, y, nx, ny, s] at arc-length pitch
function outline(sh, pitch, off) {
  const out = [];
  const walk = (pts, closed) => {
    let acc = (off % pitch + pitch) % pitch; const n = pts.length, m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const a = pts[i], b = pts[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue;
      const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L;
      let d = pitch - acc; while (d <= L) { out.push([a[0] + tx * d, a[1] + ty * d, ty, -tx]); d += pitch; } acc = (acc + L) % pitch;
    }
  };
  if (sh.c) {
    const [x1, y1, r1, x2, y2, r2] = sh.c, a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(clamp((r1 - r2) / (d || 1), -1, 1)), P = [];
    const n1 = Math.max(6, Math.ceil(r1 * Math.PI / pitch * 2)), n2 = Math.max(6, Math.ceil(r2 * Math.PI / pitch * 2));
    for (let i = 0; i <= n1; i++) { const q = a + Math.PI / 2 + k + (Math.PI - 2 * k) * i / n1; P.push([x1 + Math.cos(q) * r1, y1 + Math.sin(q) * r1]); }
    for (let i = 0; i <= n2; i++) { const q = a - Math.PI / 2 - k + (Math.PI + 2 * k) * i / n2; P.push([x2 + Math.cos(q) * r2, y2 + Math.sin(q) * r2]); }
    walk(P, true);
  } else if (sh.e) {
    const [cx, cy, rx, ry, rot] = sh.e, n = Math.max(10, Math.ceil(Math.PI * (rx + ry) / pitch * 2)), P = [], c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i < n; i++) { const q = i / n * TAU, lx = Math.cos(q) * rx, ly = Math.sin(q) * ry; P.push([cx + lx * c - ly * s, cy + lx * s + ly * c]); }
    walk(P, true);
  } else if (sh.p) walk(sh.p, true);
  return out;
}
function pathOf(ctx, sh) {
  if (sh.c) { const [x1, y1, r1, x2, y2, r2] = sh.c, a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(clamp((r1 - r2) / (d || 1), -1, 1)); ctx.moveTo(x1 + Math.cos(a + Math.PI / 2 + k) * r1, y1 + Math.sin(a + Math.PI / 2 + k) * r1); ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); ctx.closePath(); }
  else if (sh.e) { const [cx, cy, rx, ry, rot] = sh.e; ctx.moveTo(cx + Math.cos(rot) * rx, cy + Math.sin(rot) * rx); ctx.ellipse(cx, cy, rx, ry, rot, 0, TAU); ctx.closePath(); }
  else if (sh.p) { const P = signedArea(sh.p) < 0 ? [...sh.p].reverse() : sh.p; P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
}

// ---------------------------------------------------------------- props (figure units, relative to the rig; dotted lines / outlines)
// each returns { lines: [[[x,y],…], …], shapes: [shape …] } in figure units
function prop(pr, R, P) {
  const f = R.f, h0 = R.am[0].hand, h1 = R.am[1].hand, a0 = R.am[0].ang, L = [], Sh = [];
  const dirv = (a) => [Math.sin(a), Math.cos(a)];
  if (pr.kind === 'sickle') {          // a short handle in the front hand, the crescent blade curving forward
    const d = dirv(a0), hb = [h0[0] + d[0] * 7 * f, h0[1] + d[1] * 7 * f], ht = [h0[0] - d[0] * 2 * f, h0[1] - d[1] * 2 * f];
    Sh.push({ c: [ht[0], ht[1], 1.3 * f, hb[0], hb[1], 1.2 * f] });
    const n = [-d[1], d[0]], cx = hb[0] + d[0] * 7 * f + n[0] * 2 * f, cy = hb[1] + d[1] * 7 * f + n[1] * 2 * f, r = 8 * f, a00 = Math.atan2(hb[1] - cy, hb[0] - cx), arc = [], arc2 = [];
    for (let i = 0; i <= 14; i++) { const q = a00 - (i / 14) * 3.6; arc.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); }
    for (let i = 14; i >= 0; i--) { const q = a00 - (i / 14) * 3.6, rr = r - 2.6 * f * Math.sin(Math.PI * i / 14) ** .7; arc2.push([cx + Math.cos(q) * rr, cy + Math.sin(q) * rr]); }
    Sh.push({ p: [...arc, ...arc2], blade: true });
  }
  if (pr.kind === 'hoe' || pr.kind === 'staff' || pr.kind === 'spear' || pr.kind === 'crook' || pr.kind === 'pick' || pr.kind === 'scythe' || pr.kind === 'rake') {
    // a long handle through the hand(s): from pr.top to pr.bot (figure units) or along the two hands
    let a, b;
    if (pr.through === 'hands') { const dx = h1[0] - h0[0], dy = h1[1] - h0[1], d = Math.hypot(dx, dy) || 1; a = [h1[0] + dx / d * (pr.over ?? 12) * f, h1[1] + dy / d * (pr.over ?? 12) * f]; b = [h0[0] - dx / d * (pr.under ?? 30) * f, h0[1] - dy / d * (pr.under ?? 30) * f]; }
    else { const ang = pr.ang ?? 0, len = (pr.len ?? 110) * f, up = pr.up ?? .78; a = [h0[0] + Math.sin(ang) * len * up, h0[1] - Math.cos(ang) * len * up]; b = [h0[0] - Math.sin(ang) * len * (1 - up), h0[1] + Math.cos(ang) * len * (1 - up)]; }
    Sh.push({ c: [a[0], a[1], 1.1 * f, b[0], b[1], 1.1 * f] });
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, u = [dx / d, dy / d], n = [-u[1], u[0]];
    if (pr.kind === 'hoe') { const s = pr.side ?? 1; Sh.push({ p: [[b[0] - u[0] * 1.5 * f, b[1] - u[1] * 1.5 * f], [b[0] + n[0] * s * 9 * f - u[0] * 1 * f, b[1] + n[1] * s * 9 * f - u[1] * 1 * f], [b[0] + n[0] * s * 10 * f + u[0] * 5 * f, b[1] + n[1] * s * 10 * f + u[1] * 5 * f], [b[0] + u[0] * 2.5 * f, b[1] + u[1] * 2.5 * f]] }); }
    if (pr.kind === 'spear') { Sh.push({ p: [[a[0] - u[0] * 13 * f, a[1] - u[1] * 13 * f], [a[0] + n[0] * 2.6 * f + u[0] * 1 * f, a[1] + n[1] * 2.6 * f + u[1] * 1 * f], [a[0] + u[0] * 2 * f, a[1] + u[1] * 2 * f], [a[0] - n[0] * 2.6 * f + u[0] * 1 * f, a[1] - n[1] * 2.6 * f + u[1] * 1 * f]] }); }
    if (pr.kind === 'crook') { const P2 = []; for (let i = 0; i <= 12; i++) { const q = Math.PI * (1.0 + 1.25 * i / 12); P2.push([a[0] + n[0] * 5 * f + Math.cos(q) * 5 * f * (pr.side ?? 1), a[1] - 2 * f + Math.sin(q) * 5 * f]); } L.push(P2); }
    if (pr.kind === 'pick') { Sh.push({ p: [[a[0] - n[0] * 13 * f + u[0] * 3 * f, a[1] - n[1] * 13 * f + u[1] * 3 * f], [a[0] - u[0] * 1.5 * f, a[1] - u[1] * 1.5 * f], [a[0] + n[0] * 13 * f + u[0] * 3 * f, a[1] + n[1] * 13 * f + u[1] * 3 * f], [a[0] + u[0] * 2.5 * f, a[1] + u[1] * 2.5 * f]] }); }
    if (pr.kind === 'scythe') { const P2 = []; for (let i = 0; i <= 14; i++) { const q = i / 14; P2.push([a[0] + n[0] * (pr.side ?? 1) * 34 * q * f - u[0] * 8 * Math.sin(Math.PI * q * .9) * f, a[1] + n[1] * (pr.side ?? 1) * 34 * q * f - u[1] * 8 * Math.sin(Math.PI * q * .9) * f]); } L.push(P2); }
    if (pr.kind === 'rake') { for (let i = -3; i <= 3; i++) L.push([[b[0] + n[0] * i * 2.6 * f, b[1] + n[1] * i * 2.6 * f], [b[0] + n[0] * i * 2.6 * f + u[0] * 4 * f, b[1] + n[1] * i * 2.6 * f + u[1] * 4 * f]]); L.push([[b[0] - n[0] * 8 * f, b[1] - n[1] * 8 * f], [b[0] + n[0] * 8 * f, b[1] + n[1] * 8 * f]]); }
  }
  if (pr.kind === 'basket') {           // on the head (pr.on 'head') or on the hip (front hand)
    const at = pr.on === 'head' ? [R.head[0], R.head[1] - 7.6 * f * R.hk] : [h0[0] + 2 * f, h0[1] - 2 * f], w = (pr.w ?? 16) * f, hh = (pr.h ?? 9) * f;
    Sh.push({ p: [[at[0] - w / 2, at[1] - hh], [at[0] + w / 2, at[1] - hh], [at[0] + w * .38, at[1]], [at[0] - w * .38, at[1]]] });
    if (pr.fill === 'sheaf') for (let i = -3; i <= 3; i++) L.push([[at[0] + i * w * .09, at[1] - hh], [at[0] + i * w * .14, at[1] - hh - 9 * f]]);
  }
  if (pr.kind === 'jar') { const at = [R.head[0], R.head[1] - 7 * f * R.hk]; Sh.push({ e: [at[0], at[1] - 6 * f, 5.4 * f, 6.5 * f, 0] }); Sh.push({ c: [at[0], at[1] - 12 * f, 2.2 * f, at[0], at[1] - 15 * f, 2.8 * f] }); }
  if (pr.kind === 'sack') { const at = [R.sho[0] + (pr.dx ?? -2) * f, R.sho[1] - 3 * f]; Sh.push({ e: [at[0], at[1], (pr.w ?? 11) * f, (pr.h ?? 7) * f, -.35] }); }
  if (pr.kind === 'stone') { const at = [R.sho[0], R.sho[1] - 6 * f]; Sh.push({ p: [[at[0] - 9 * f, at[1] - 7 * f], [at[0] + 9 * f, at[1] - 8 * f], [at[0] + 10 * f, at[1] + 3 * f], [at[0] - 9 * f, at[1] + 4 * f]] }); }
  if (pr.kind === 'sheaf') { const at = h0, P2 = []; for (let i = -4; i <= 4; i++) L.push([[at[0] + i * .5 * f, at[1] + 2 * f], [at[0] + i * 1.6 * f, at[1] - 14 * f]]); Sh.push({ e: [at[0], at[1] - 15 * f, 5 * f, 3 * f, 0] }); }
  if (pr.kind === 'child') { /* drawn as its own ghost by the caller */ }
  if (pr.kind === 'net') { const at = h0; for (let i = 0; i < 5; i++) L.push([[at[0], at[1]], [at[0] + (i - 2) * 4 * f, at[1] + 22 * f]]); for (let j = 1; j < 4; j++) L.push([[at[0] - j * 2 * f, at[1] + j * 5.5 * f], [at[0] + j * 2 * f, at[1] + j * 5.5 * f]]); }
  if (pr.kind === 'hammer') { const d = dirv(a0), e = [h0[0] + d[0] * 13 * f, h0[1] + d[1] * 13 * f], n = [-d[1], d[0]]; Sh.push({ c: [h0[0] - d[0] * 2 * f, h0[1] - d[1] * 2 * f, 1.1 * f, e[0], e[1], 1.1 * f] }); Sh.push({ p: [[e[0] - n[0] * 4 * f, e[1] - n[1] * 4 * f], [e[0] + n[0] * 4 * f, e[1] + n[1] * 4 * f], [e[0] + n[0] * 4 * f + d[0] * 4 * f, e[1] + n[1] * 4 * f + d[1] * 4 * f], [e[0] - n[0] * 4 * f + d[0] * 4 * f, e[1] - n[1] * 4 * f + d[1] * 4 * f]] }); }
  if (pr.kind === 'pail') { const at = [h0[0], h0[1] + 3 * f]; Sh.push({ p: [[at[0] - 4 * f, at[1]], [at[0] + 4 * f, at[1]], [at[0] + 3.4 * f, at[1] + 8 * f], [at[0] - 3.4 * f, at[1] + 8 * f]] }); }
  return { lines: L, shapes: Sh };
}

// ---------------------------------------------------------------- draw
const BUCK = 4;
export function ghost(ctx, x, y, sc, pose, o = {}) {
  const P = Object.assign({}, POSE.stand, pose), dir = o.dir ?? 1, R = rig(P);
  let S = shapes(P, R, o);
  const props = (o.props || []).map((pr) => prop(pr, R, P));
  // ground anchor: the lowest point of the feet at y (standing) or the pelvis at x, y (seat)
  let ox = 0, oy = 0;
  if (P.seat) { ox = 0; oy = 0; }
  else { const lo = Math.max(R.lg[0].heel[1], R.lg[0].toe[1], R.lg[1].heel[1], R.lg[1].toe[1]) + 1.5 * R.f; oy = -lo; ox = -(R.lg[0].ankle[0] + R.lg[1].ankle[0]) / 2; }
  const T = (p) => [x + (p[0] + ox) * sc * dir, y + (p[1] + oy) * sc];
  const tS = (sh) => {
    if (sh.c) { const [a, b] = [T([sh.c[0], sh.c[1]]), T([sh.c[3], sh.c[4]])]; return { c: [a[0], a[1], sh.c[2] * sc, b[0], b[1], sh.c[5] * sc], blade: sh.blade, par: sh.par }; }
    if (sh.e) { const a = T([sh.e[0], sh.e[1]]), rot = dir > 0 ? sh.e[4] : -sh.e[4]; return { e: [a[0], a[1], sh.e[2] * sc, sh.e[3] * sc, rot], blade: sh.blade, par: sh.par }; }
    const p = sh.p.map(T); return { p: signedArea(p) < 0 ? p.reverse() : p, blade: sh.blade, par: sh.par };
  };
  S = S.map(tS);
  const PS = props.flatMap((p) => p.shapes.map(tS)), PL = props.flatMap((p) => p.lines.map((l) => l.map(T)));
  if (o.measure) return { head: T(R.head), hands: [T(R.am[0].hand), T(R.am[1].hand)], wrists: [T(R.am[0].wr), T(R.am[1].wr)], elbows: [T(R.am[0].el), T(R.am[1].el)], top: y - 100 * sc * R.f };
  const col = o.col || '#f3efe2', A = o.a ?? 1; if (A <= .004) return;
  const pitch = o.pitch ?? clamp(sc * 3.2, 2.2, 6), rad = o.r ?? clamp(sc * .55, .55, 1.7), t = o.t ?? 0, crawl = (o.crawl ?? 2.5) * t + (o.seed ?? 0) * 7.3;
  const H100 = 100 * sc * R.f, gy = y, rev = o.reveal;
  const vis = (px, py) => {
    if (!rev) return 1; const u = rev.u; if (u >= 1) return 1; if (u <= 0) return 0;
    const j = hash(Math.round(px * 7.1) + Math.round(py * 3.3) * 1.7 + (o.seed ?? 0)) * .22;
    const v = rev.mode === 'fall' ? (py - (gy - H100)) / H100 : rev.mode === 'sweep' ? ((px - (x - H100 * .4)) / (H100 * .8)) : (gy - py) / H100;
    return clamp((u * 1.25 - v * .9 - j) / .12);
  };
  // the faint fill (union, one path)
  const fill = (o.fill ?? .07) * A;
  if (fill > .003) {
    ctx.save(); ctx.fillStyle = rgba(col, fill); ctx.beginPath(); for (const sh of S) pathOf(ctx, sh); for (const sh of PS) if (!sh.p || sh.blade) pathOf(ctx, sh);
    if (rev && rev.u < 1) { ctx.clip(); ctx.beginPath(); const yy = rev.mode === 'fall' ? gy - H100 + H100 * clamp(rev.u * 1.25) : gy - H100 * clamp(rev.u * 1.25); if (rev.mode === 'fall') ctx.rect(x - H100, gy - H100 - 20, H100 * 2, yy - (gy - H100 - 20)); else ctx.rect(x - H100, yy, H100 * 2, gy - yy + 10); }
    ctx.fill(); ctx.restore();
  }
  // contour dots
  const eps = Math.max(.35, pitch * .18), all = S.concat(PS);
  const bucket = []; for (let i = 0; i < BUCK; i++) bucket.push([]);
  const W0 = o.warm;
  const put = (px, py, nx, ny, k) => {
    const v = vis(px, py); if (v <= .02) return;
    let w = 0; if (W0) { const lx = W0.x - px, ly = W0.y - py, l = Math.hypot(lx, ly) || 1; w = clamp((nx * lx + ny * ly) / l) * (W0.a ?? 1); }
    const bi = Math.min(BUCK - 1, Math.floor(w * BUCK)); bucket[bi].push(px, py, v * (k ?? 1));
  };
  for (let i = 0; i < S.length; i++) {
    const pts = outline(S[i], pitch, crawl * (i % 2 ? 1 : -1));
    const par = S[i].par;
    for (const [px, py, nx, ny] of pts) { let hid = false; for (let j = 0; j < all.length; j++) { if (j === i || (j < i && j !== par && j < S.length)) continue; if (inside(all[j], px, py, eps)) { hid = true; break; } } if (!hid) put(px, py, nx, ny); }
  }
  for (const sh of PS) { const pts = outline(sh, pitch * .85, crawl); for (const [px, py, nx, ny] of pts) put(px, py, nx, ny, 1.1); }
  for (const Lp of PL) { let acc = 0; for (let i = 1; i < Lp.length; i++) { const a = Lp[i - 1], b = Lp[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue; let d = (pitch * .85 - acc % (pitch * .85)); while (d <= L) { put(a[0] + (b[0] - a[0]) * d / L, a[1] + (b[1] - a[1]) * d / L, 0, -1, 1); d += pitch * .85; } acc += L; } }
  for (let bi = 0; bi < BUCK; bi++) {
    const B = bucket[bi]; if (!B.length) continue;
    const c = W0 ? mixCol(col, W0.col, (bi + .5) / BUCK) : col;
    // two alpha passes: full dots and partly revealed dots
    for (const pass of [0, 1]) {
      ctx.beginPath(); let any = false;
      for (let i = 0; i < B.length; i += 3) { const v = B[i + 2]; if ((v >= .98) !== (pass === 0)) continue; any = true; const rr = rad * (pass ? mix(.4, 1, v) : 1); ctx.rect(B[i] - rr, B[i + 1] - rr, rr * 2, rr * 2); }
      if (any) { ctx.fillStyle = rgba(c, A * (pass ? .55 : .92)); ctx.fill(); }
    }
  }
  return { head: T(R.head), hands: [T(R.am[0].hand), T(R.am[1].hand)], top: y - H100 };
}
const mixCol = (a, b, u) => { const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)], A = p(a), B = p(b); return '#' + [0, 1, 2].map((i) => Math.round(mix(A[i], B[i], u)).toString(16).padStart(2, '0')).join(''); };
