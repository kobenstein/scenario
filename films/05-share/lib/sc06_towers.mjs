// C6 towers (4.02, 4.04, 4.05, 4.06): two company towers of glass and steel at dawn, on round engraved plinths inside a fence ring,
// trees around, a price tag on a string, long shadows toward us. A small pinhole camera places everything in one world, so the low
// view (4.02/4.04) and the high view (4.05/4.06) agree; every surface is painted in the print look (sky reflections, mullions,
// engraved hatch in the shade, warm rims, stipple light, fog bands), never flat-shaded boxes.
//   towersFrame(ctx, t, o) draws the whole frame → { proj, P (3D → screen), tag: {x, y}, slices: [...], towerTop(i) }
//     o: { cam: { x, y, z, yaw, pitch, f }, grow 1 (height factor), tag 0..1 (show the price tag), slices: [{ u: 0..1 punch/set aside, flip }],
//          perfo 0..1 (the perforation appears), punch 0..1, fence 1, clouds 0..1, labels 0..1, figure: { x, phase } | null, t }
import { W, H, rgba, clamp, mix, lin, sm, eout, eio, prng, canvas, text, drift } from '../engine.mjs';
import { stipple, vnoise, fbm, fog as aFog, roughPath } from './art.mjs';
import { rosette, microPath, gBorder } from './certificate.mjs';
import { perforation } from './perforate.mjs';
import { figure, walk, figureFlat } from './figure.mjs';
import { once } from './sc06_kit.mjs';

const TAU = Math.PI * 2;
// Two clearly different buildings, never a matching pair: OpenAI a rounded (elliptical) glass tower with a flat stepped crown,
// front-left; Anthropic a stepped tower with setbacks and an engraved Art Deco crown + needle, further back to the right.
// Different footprints, heights and depths at every moment (both grow by the same factor, so the difference stays).
export const TW = [ // towers: centre x, z, half width (x), half depth (z), yaw, base height, kind, name
  { x: -5, z: 38, hx: 2.5, hz: 2.05, yaw: .3, h: 15, kind: 'round', name: 'OpenAI', glass: ['#c8a0a8', '#7d6c8c', '#2c2f4e'] },
  { x: 6.5, z: 54, hx: 4.3, hz: 3.5, yaw: .28, h: 11, kind: 'step', name: 'Anthropic', glass: ['#d4a89c', '#8a7088', '#2a2c48'] },
];
export const PLR = 7.5;           // plinth radius
export const FENCE = { x: 0, z: 47, r: 24 };
export function camera(o = {}) { return { x: 0, y: 1.7, z: 2, yaw: 0, pitch: .05, f: 1150, ...o }; }
export function projector(cam) {
  const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch), f = cam.f, ox = cam.ox ?? 960, oy = cam.oy ?? 540;
  return (x, y, z) => {
    let dx = x - cam.x, dy = y - cam.y, dz = z - cam.z;
    const X = dx * cy - dz * sy, Z0 = dx * sy + dz * cy;
    const Y = dy * cp - Z0 * sp, Z = dy * sp + Z0 * cp;
    const zz = Math.max(.05, Z);
    return [ox + f * X / zz, oy - f * Y / zz, Z];
  };
}
// ---------- cached pieces ----------
function sky(key, o) {
  return once('sky' + key, () => {
    const [c, g] = canvas(W + 400, H * 2.4), hz = H * 1.6;   // horizon at hz inside the layer
    const lg = g.createLinearGradient(0, 0, 0, hz + 200);
    lg.addColorStop(0, '#141634'); lg.addColorStop(.35, '#3a3460'); lg.addColorStop(.62, '#8a6a8a'); lg.addColorStop(.82, '#d9969a'); lg.addColorStop(.93, '#f2b9a0'); lg.addColorStop(1, '#f8d4ae');
    g.fillStyle = lg; g.fillRect(0, 0, c.width, c.height);
    // the low sun's glow
    const sx = c.width / 2 + 40, gg = g.createRadialGradient(sx, hz, 0, sx, hz, 900); gg.addColorStop(0, 'rgba(255,236,200,.95)'); gg.addColorStop(.05, 'rgba(255,214,160,.7)'); gg.addColorStop(.25, 'rgba(255,170,120,.25)'); gg.addColorStop(1, 'rgba(255,160,120,0)');
    g.fillStyle = gg; g.fillRect(0, 0, c.width, c.height);
    // high stratus strands with engraved line hatching
    const r = prng(7), n = vnoise(3);
    for (let k = 0; k < 9; k++) {
      const y0 = hz - 220 - r() * 900, x0 = r() * c.width - 300, L = 500 + r() * 900, th = 6 + r() * 16;
      g.beginPath(); for (let x = 0; x <= L; x += 12) { const yy = y0 - th * (.5 + .5 * Math.sin(x / L * Math.PI)) * (n(x * .01, k) * 1.2); x ? g.lineTo(x0 + x, yy) : g.moveTo(x0 + x, yy); }
      for (let x = L; x >= 0; x -= 12) g.lineTo(x0 + x, y0 + th * .35 * Math.sin(x / L * Math.PI)); g.closePath();
      const warm = clamp(1 - (hz - y0) / 1100); g.fillStyle = `rgba(${Math.round(mix(120, 250, warm))},${Math.round(mix(110, 175, warm))},${Math.round(mix(160, 160, warm))},${.35 + .25 * warm})`; g.fill();
      g.save(); g.clip(); g.strokeStyle = `rgba(255,220,190,${.25 * warm})`; g.lineWidth = 1; for (let yy = y0 - 30; yy < y0 + 30; yy += 3.4) { g.beginPath(); g.moveTo(x0, yy); g.lineTo(x0 + L, yy - 2); g.stroke(); } g.restore();
    }
    for (let i = 0; i < 90; i++) { const x = r() * c.width, y = r() * hz * .5; g.fillStyle = `rgba(230,230,255,${.2 + r() * .4})`; g.fillRect(x, y, 1.2, 1.2); }
    stipple(c, { k: .35, g: 1, seed: 9, mid: true, boost: 1.5 });
    return { c, hz };
  });
}
function treeSprite(kind) {
  return once('tree' + kind, () => {
    const S = 260, [c, g] = canvas(S, S * 1.3), r = prng(11 + kind), n = vnoise(5 + kind), cx = S / 2, base = S * 1.3 - 6;
    g.fillStyle = '#1a1c2a'; g.beginPath(); g.moveTo(cx - 6, base); g.quadraticCurveTo(cx - 3, base - 80, cx - 2, base - 140); g.lineTo(cx + 4, base - 140); g.quadraticCurveTo(cx + 5, base - 80, cx + 8, base); g.fill();
    const blobs = []; for (let k = 0; k < 9; k++) blobs.push([cx + (r() - .5) * 120, base - 150 - r() * 110, 36 + r() * 34]);
    for (const [bx, by, br] of blobs) { g.beginPath(); for (let a = 0; a <= TAU + .01; a += .2) { const rr = br * (1 + .12 * (n(Math.cos(a) * 2 + bx * .02, Math.sin(a) * 2) - .5)); g.lineTo(bx + Math.cos(a) * rr, by + Math.sin(a) * rr); } g.closePath(); g.fillStyle = kind % 2 ? '#22303c' : '#1e2c34'; g.fill(); }
    // light from the right (the low sun behind, a warm rim on the crown edge), engraved arcs inside the crown
    g.globalCompositeOperation = 'source-atop';
    const lg = g.createLinearGradient(cx - 120, 0, cx + 130, 0); lg.addColorStop(0, 'rgba(10,12,22,.3)'); lg.addColorStop(.75, 'rgba(255,170,130,0)'); lg.addColorStop(1, 'rgba(255,190,140,.5)'); g.fillStyle = lg; g.fillRect(0, 0, S, S * 1.3);
    g.strokeStyle = 'rgba(255,200,160,.18)'; g.lineWidth = 1; for (let k = 0; k < 40; k++) { const bx = cx + (r() - .5) * 150, by = base - 160 - r() * 120; g.beginPath(); g.arc(bx, by, 6 + r() * 8, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    g.globalCompositeOperation = 'source-over';
    stipple(c, { k: .3, g: 1, seed: 12 + kind, mid: false, boost: 1 });
    return { c, w: S, h: S * 1.3, foot: [cx, base] };
  });
}
function plinthTop() {   // the plinth's top face as a top-down texture: engraved stone with a rosette (a value), 1 px = 2 cm
  return once('plinthtop', () => {
    const R = 300, [c, g] = canvas(R * 2, R * 2); g.translate(R, R);
    const pg = g.createRadialGradient(-80, -80, 0, 0, 0, R); pg.addColorStop(0, '#efe3c8'); pg.addColorStop(1, '#bfae8e'); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    rosette(g, 0, 0, { R: 220, A: 40, B: 18, n: 26, m: 9, lines: 46, col: '#5a4a38', w: .6, a: .35 });
    g.strokeStyle = 'rgba(60,45,30,.55)'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, R - 6, 0, TAU); g.stroke(); g.lineWidth = 1.2; g.beginPath(); g.arc(0, 0, R - 18, 0, TAU); g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .25, g: 1, seed: 30, mid: false, boost: 1 });
    return c;
  });
}
function sliceTex() {   // an amber foil wedge (the share): face = engraved certificate pattern
  return once('slicetex', () => {
    const R = 300, [c, g] = canvas(R * 2, R * 2); g.translate(R, R);
    const a0 = -.5, a1 = .5; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R - 4, a0, a1); g.closePath();
    const fg = g.createLinearGradient(0, -R * .4, R, R * .4); ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'].forEach((cc, k) => fg.addColorStop(k / 4, cc)); g.fillStyle = fg; g.fill();
    g.save(); g.clip(); rosette(g, 0, 0, { R: 220, A: 40, B: 18, n: 26, m: 9, lines: 46, col: '#5a2a08', w: .7, a: .55 }); g.restore();
    g.strokeStyle = 'rgba(90,40,10,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R - 4, a0, a1); g.closePath(); g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .6, g: 1.3, seed: 31, mid: false, boost: 1.3 });
    return { c, a0, a1, R };
  });
}
function cloudSprite(kind) {   // a dawn cloud: many soft overlapping lobes lit pink-gold from below, a cool shaded top, engraved hatch
  return once('cloud' + kind, () => {
    const S = 560, Hh = 240, [c, g] = canvas(S, Hh), r = prng(51 + kind * 7);
    for (let k = 0; k < 46; k++) { const q = r(), bx = S * (.1 + .8 * q), hump = Math.sin(q * Math.PI), by = Hh * (.62 - .26 * hump * r()), br = (22 + r() * 46) * (.6 + .5 * hump);
      const gg = g.createRadialGradient(bx, by, 0, bx, by, br); gg.addColorStop(0, 'rgba(250,214,200,.55)'); gg.addColorStop(.6, 'rgba(236,180,180,.35)'); gg.addColorStop(1, 'rgba(200,150,170,0)'); g.fillStyle = gg; g.beginPath(); g.arc(bx, by, br, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'source-atop'; const lg = g.createLinearGradient(0, 0, 0, Hh); lg.addColorStop(0, 'rgba(110,90,140,.5)'); lg.addColorStop(.55, 'rgba(255,200,170,0)'); lg.addColorStop(.85, 'rgba(255,226,196,.45)'); lg.addColorStop(1, 'rgba(255,236,210,.6)'); g.fillStyle = lg; g.fillRect(0, 0, S, Hh);
    g.strokeStyle = 'rgba(90,70,120,.14)'; g.lineWidth = 1; for (let y = 30; y < Hh * .55; y += 4) { g.beginPath(); g.moveTo(0, y); g.lineTo(S, y + 5); g.stroke(); }
    g.globalCompositeOperation = 'source-over'; stipple(c, { k: .2, g: 1, seed: 60 + kind, mid: false, boost: 1 });
    return { c, w: S, h: Hh };
  });
}
function fogBand(key, col, a, seed) { return once('fog' + key, () => { const [c, g] = canvas(W + 600, 360); aFog(g, { y0: 20, y1: 340, col, a, seed, sx: .0025, sy: .02, cover: .62, soft: .4, k: .55, x1: W + 600 }); return c; }); }

// affine for a flat disc on the ground: maps texture px (centre origin, 1 px = 1/scale m) onto the projected ground plane
function groundAffine(P, x, y, z, m) {
  const o = P(x, y, z), ex = P(x + m, y, z), ez = P(x, y, z + m);
  return { o, a: ex[0] - o[0], b: ex[1] - o[1], c: ez[0] - o[0], d: ez[1] - o[1] };
}
function drawFlat(ctx, P, img, x, y, z, rot, metresPerTex, lift = 0) {
  // img centred at (x, z) on the plane y, rotated by rot around the vertical axis; texture px → metres
  const m = 1, cr = Math.cos(rot), sr = Math.sin(rot);
  const o = P(x, y + lift, z), ex = P(x + cr * m, y + lift, z + sr * m), ez = P(x - sr * m, y + lift, z + cr * m);
  const k = metresPerTex;
  ctx.save(); ctx.setTransform((ex[0] - o[0]) * k, (ex[1] - o[1]) * k, (ez[0] - o[0]) * k, (ez[1] - o[1]) * k, o[0], o[1]);
  ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore();
}

// ---------- a glass tower ----------
// face space: q 0..1 along the face (a → b), y metres; everything projected in 3D so spacing stays perspective-true
function quad(ctx, P, F, q0, q1, y0, y1, k0 = 0, k1 = 0) {   // k = slant of the band (q shift per metre)
  const pt = (q, y) => P(mix(F.a[0], F.b[0], q), y, mix(F.a[1], F.b[1], q));
  const p = [pt(q0 + k0 * y0, y0), pt(q1 + k1 * y0, y0), pt(q1 + k1 * y1, y1), pt(q0 + k0 * y1, y1)];
  ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(p[i][0], p[i][1]); ctx.closePath();
}
function tower(ctx, P, T, h, t, cam, o = {}) {
  const c = Math.cos(T.yaw), s = Math.sin(T.yaw), corner = (sx, sz) => [T.x + sx * T.hx * c - sz * T.hz * s, T.z + sx * T.hx * s + sz * T.hz * c];
  const C = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], base = o.base ?? .9, top = base + h, crownH = o.crown === false ? .5 : 1.6;
  const faces = [];
  for (let i = 0; i < 4; i++) {
    const a = C[i], b = C[(i + 1) % 4], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, nx = mx - T.x, nz = mz - T.z;
    const vx = cam.x - mx, vz = cam.z - mz; if (nx * vx + nz * vz <= 0) continue;
    faces.push({ a, b, nx, nz, d: Math.hypot(vx, vz), i, w: Math.hypot(b[0] - a[0], b[1] - a[1]) });
  }
  faces.sort((p, q) => q.d - p.d);
  const fl = 3.2, nf = Math.max(1, Math.round((h - crownH) / fl)), fh = (h - crownH) / nf;   // floors; a 1.6 m crown on top (a .5 m ledge on a setback)
  for (const F of faces) {
    const A = P(F.a[0], base, F.a[1]), B = P(F.b[0], base, F.b[1]), Cc = P(F.b[0], top, F.b[1]), D = P(F.a[0], top, F.a[1]);
    const L = Math.hypot(F.nx, F.nz), k = F.nx / L > .05 ? 1 : 0;   // k = 1: the face turned toward the low sun (grazing warm light)
    const ytop = Math.min(D[1], Cc[1]), ybot = Math.max(A[1], B[1]), xl = Math.min(A[0], B[0], Cc[0], D[0]), xr = Math.max(A[0], B[0], Cc[0], D[0]);
    ctx.save(); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.lineTo(D[0], D[1]); ctx.closePath();
    if (o.deco) {   // Art Deco crown: brushed gold-steel, vertical fluting and an engraved sunburst on every face
      const dg = ctx.createLinearGradient(0, ytop, 0, ybot); if (k) { dg.addColorStop(0, '#f4d6a8'); dg.addColorStop(1, '#b88a5e'); } else { dg.addColorStop(0, '#8a7088'); dg.addColorStop(1, '#3e3450'); }
      ctx.fillStyle = dg; ctx.fill(); ctx.clip();
      ctx.strokeStyle = k ? 'rgba(110,70,40,.45)' : 'rgba(14,12,30,.45)'; ctx.lineWidth = .9; ctx.beginPath();
      for (let i = 1; i < 10; i++) { const q = i / 10, p0 = P(mix(F.a[0], F.b[0], q), base, mix(F.a[1], F.b[1], q)), p1 = P(mix(F.a[0], F.b[0], q), top, mix(F.a[1], F.b[1], q)); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); } ctx.stroke();
      // sunburst: rays fanning up from the middle of the face's foot (the certificate's rosette language)
      const fm = P(mix(F.a[0], F.b[0], .5), base, mix(F.a[1], F.b[1], .5)); ctx.strokeStyle = k ? 'rgba(255,240,214,.7)' : 'rgba(220,200,230,.35)'; ctx.lineWidth = 1.1; ctx.beginPath();
      for (let i = 0; i <= 8; i++) { const q = i / 8, p1 = P(mix(F.a[0], F.b[0], q), top - (top - base) * (.08 + .5 * Math.abs(q - .5)), mix(F.a[1], F.b[1], q)); ctx.moveTo(fm[0], fm[1]); ctx.lineTo(p1[0], p1[1]); } ctx.stroke();
      quad(ctx, P, F, 0, 1, top - (top - base) * .12, top); ctx.fillStyle = k ? 'rgba(255,236,200,.5)' : 'rgba(200,180,220,.22)'; ctx.fill();
      ctx.restore();
      ctx.strokeStyle = k ? 'rgba(255,236,206,.9)' : 'rgba(240,210,220,.4)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(D[0], D[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.stroke();
      F.P = { A, B, Cc, D, k }; continue;
    }
    // glass: reflects the dawn sky (pink high, violet low); the sun face is warmer and brighter
    const gg = ctx.createLinearGradient(0, ytop, 0, ybot);
    if (k) { gg.addColorStop(0, '#f2c2a8'); gg.addColorStop(.35, T.glass[0]); gg.addColorStop(1, T.glass[1]); }
    else { gg.addColorStop(0, '#b48ca4'); gg.addColorStop(.4, T.glass[1]); gg.addColorStop(1, T.glass[2]); }
    ctx.fillStyle = gg; ctx.fill(); ctx.clip();
    // sky reflection: two soft diagonal bands sliding slowly across the glass (the camera moves, the reflections move faster)
    const sh = (cam.x * .012 + t * .01) % 1;
    for (const [b0, bw, al] of [[-.35 + sh, .22, .16], [.25 + sh, .1, .12], [.62 + sh, .05, .1]]) {
      quad(ctx, P, F, b0, b0 + bw, base, top, .018, .018); ctx.fillStyle = k ? `rgba(255,236,214,${al * 1.3})` : `rgba(236,206,226,${al})`; ctx.fill(); }
    // sun glare on the sunward face, low and to the sun side
    if (k) { const hx = mix(A[0], B[0], .75), hy = mix(ybot, ytop, .25), rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, (ybot - ytop) * .8 + 60); rg.addColorStop(0, 'rgba(255,232,200,.5)'); rg.addColorStop(1, 'rgba(255,210,180,0)'); ctx.fillStyle = rg; ctx.fillRect(xl - 60, ytop - 60, xr - xl + 120, ybot - ytop + 120); }
    // spandrels (the floor slabs) as dark bands, mullions as fine lines
    for (let j = 1; j <= nf; j++) { const y = base + j * fh; quad(ctx, P, F, 0, 1, y - .42, y); ctx.fillStyle = k ? 'rgba(90,56,64,.42)' : 'rgba(18,16,38,.5)'; ctx.fill(); }
    const nb = Math.max(3, Math.round(F.w / 1.5));
    ctx.strokeStyle = k ? 'rgba(96,60,70,.34)' : 'rgba(10,10,30,.42)'; ctx.lineWidth = .9;
    ctx.beginPath(); for (let i = 1; i < nb; i++) { const q = i / nb, p0 = P(mix(F.a[0], F.b[0], q), base, mix(F.a[1], F.b[1], q)), p1 = P(mix(F.a[0], F.b[0], q), top - crownH, mix(F.a[1], F.b[1], q)); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); } ctx.stroke();
    // a few early lights inside (stable per tower and face), small and soft
    const r = prng(Math.round(T.h * 10 + F.i * 7 + 3 + (o.seed || 0)));
    for (let j = 0; j < nf; j++) for (let i = 0; i < nb; i++) { const v = r(); if (v > .07) continue; const y0 = base + j * fh + .25, y1 = base + (j + 1) * fh - .5;
      quad(ctx, P, F, (i + .12) / nb, (i + .88) / nb, y0, y1); ctx.fillStyle = v < .03 ? 'rgba(255,214,150,.62)' : 'rgba(255,196,140,.3)'; ctx.fill(); }
    // the lobby: a warm lit ground floor
    if (o.lobby !== false) { quad(ctx, P, F, .02, .98, base, base + 1.0 * fh - .42); ctx.fillStyle = k ? 'rgba(255,200,140,.32)' : 'rgba(255,186,120,.26)'; ctx.fill(); }
    // the crown: brushed steel band with engraved lines
    quad(ctx, P, F, 0, 1, top - crownH, top); ctx.fillStyle = k ? '#c7a098' : '#4c4058'; ctx.fill();
    ctx.strokeStyle = k ? 'rgba(255,236,214,.35)' : 'rgba(200,180,220,.18)'; ctx.lineWidth = .8; ctx.beginPath(); for (let m = 1; m < 4; m++) { const y = top - crownH + m * crownH / 4, p0 = P(F.a[0], y, F.a[1]), p1 = P(F.b[0], y, F.b[1]); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); } ctx.stroke();
    // engraved hatch on the shade face
    if (!k) { ctx.strokeStyle = 'rgba(10,8,24,.16)'; ctx.lineWidth = .8; ctx.beginPath(); for (let x = xl - (ybot - ytop); x < xr; x += 4.6) { ctx.moveTo(x, ybot); ctx.lineTo(x + (ybot - ytop) * .9, ytop); } ctx.stroke(); }
    ctx.restore();
    // top edge of the face (only visible edges: no wireframe of the far roof edges)
    ctx.strokeStyle = k ? 'rgba(255,232,206,.85)' : 'rgba(240,210,220,.4)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(D[0], D[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.stroke();
    F.P = { A, B, Cc, D, k };
  }
  // the corner where both visible faces meet catches the sun: a burning warm line
  if (faces.length === 2) { const f1 = faces[1].P, f0 = faces[0].P; const shared = Math.hypot(f0.B[0] - f1.A[0], f0.B[1] - f1.A[1]) < 2 ? [f0.B, f0.Cc] : [f0.A, f0.D];
    ctx.save(); ctx.strokeStyle = 'rgba(255,236,206,.95)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(shared[0][0], shared[0][1]); ctx.lineTo(shared[1][0], shared[1][1]); ctx.stroke(); ctx.restore(); }
  // roof seen from above: dark membrane, a parapet rim, two rooftop units
  const R = C.map(([x, z]) => P(x, top, z));
  if (cam.y > top) {
    ctx.beginPath(); R.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = '#5a4a5e'; ctx.fill(); ctx.strokeStyle = 'rgba(255,226,196,.8)'; ctx.lineWidth = 1.6; ctx.stroke();
    const Ri = C.map(([x, z]) => P(mix(x, T.x, .1), top, mix(z, T.z, .1))); ctx.beginPath(); Ri.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = '#382c40'; ctx.fill();
    if (o.units !== false) for (const [ux, uz, uw, ud, uh] of [[-.35, -.2, .3, .25, .9], [.3, .35, .22, .3, .6]]) {
      const bx = T.x + ux * T.hx * c - uz * T.hz * s, bz = T.z + ux * T.hx * s + uz * T.hz * c, ww = uw * T.hx, dd = ud * T.hz;
      const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [bx + a * ww * c - b * dd * s, bz + a * ww * s + b * dd * c]);
      const lo = q.map(([x, z]) => P(x, top, z)), hi = q.map(([x, z]) => P(x, top + uh, z));
      ctx.fillStyle = '#6a5a6c'; for (let e = 0; e < 4; e++) { const n = (e + 1) % 4; ctx.beginPath(); ctx.moveTo(lo[e][0], lo[e][1]); ctx.lineTo(lo[n][0], lo[n][1]); ctx.lineTo(hi[n][0], hi[n][1]); ctx.lineTo(hi[e][0], hi[e][1]); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = '#9a8494'; ctx.beginPath(); hi.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); }
  }
  return { roof: R, corner: C };
}
// ---------- OpenAI: a rounded glass tower (an elliptical cylinder) with a stepped, flat-roofed crown ----------
const RN = 64, CROWN = [[0, 1], [.35, 1], [.4, .93], [.75, .93], [.8, .86], [1, .86]];   // the crown: two slim setbacks and a flat roof (a domed top read as a rocket): height fraction, radius scale
function ell(T, k, y, P) {   // ring of RN points: world x/z, outward normal, projected point at height y
  const c = Math.cos(T.yaw), s = Math.sin(T.yaw), L = [];
  for (let i = 0; i < RN; i++) { const a = i / RN * TAU, lx = T.hx * k * Math.cos(a), lz = T.hz * k * Math.sin(a), nlx = Math.cos(a) / T.hx, nlz = Math.sin(a) / T.hz, nn = Math.hypot(nlx, nlz);
    const x = T.x + lx * c - lz * s, z = T.z + lx * s + lz * c; L.push({ x, z, nx: (nlx * c - nlz * s) / nn, nz: (nlx * s + nlz * c) / nn, p: P(x, y, z) }); }
  return L;
}
function visRun(R, cam) {   // the contiguous run of ring indices facing the camera (+1 sample past each silhouette)
  const vis = R.map((q) => (cam.x - q.x) * q.nx + (cam.z - q.z) * q.nz > 0); let i0 = vis.findIndex((v, i) => v && !vis[(i - 1 + RN) % RN]); if (i0 < 0) i0 = 0;
  const run = [(i0 - 1 + RN) % RN]; for (let k = 0; k < RN && vis[(i0 + k) % RN]; k++) run.push((i0 + k) % RN); run.push((i0 + run.length - 1) % RN); return run;
}
const lit = (q) => clamp(.5 + .62 * q.nx + .2 * q.nz);   // the low sun from the right and behind: the right flank glows
function hShade(ctx, pts, run, cols) {   // horizontal gradient across the visible arc: shade → lit, following the curvature
  const xs = run.map((i) => pts[i]), xl = Math.min(...xs.map((q) => q.p[0])), xr = Math.max(...xs.map((q) => q.p[0])), g = ctx.createLinearGradient(xl, 0, xr + .01, 0);
  const st = xs.map((q) => [clamp((q.p[0] - xl) / Math.max(1, xr - xl)), lit(q)]).sort((a, b) => a[0] - b[0]);
  for (const [u, l] of st) g.addColorStop(u, cols(l)); return g;
}
const mixC = (a, b, u) => { const A = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), B = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(u)))).join(',')})`; };
function roundTower(ctx, P, T, h, t, cam) {
  const base = .9, crownH = clamp(h * .12, 1.9, 6.5), yb = base + h - crownH, top = base + h, fl = 3.2, nf = Math.max(1, Math.round((h - crownH) / fl)), fh = (h - crownH) / nf;
  const R0 = ell(T, 1, base, P), run = visRun(R0, cam), Rt = ell(T, 1, yb, P);
  const path = (A, B) => { ctx.beginPath(); run.forEach((i, k) => (k ? ctx.lineTo(A[i].p[0], A[i].p[1]) : ctx.moveTo(A[i].p[0], A[i].p[1]))); for (let k = run.length - 1; k >= 0; k--) ctx.lineTo(B[run[k]].p[0], B[run[k]].p[1]); ctx.closePath(); };
  const band = (y0, y1) => path(ell(T, 1, y0, P), ell(T, 1, y1, P));
  const ytop = Math.min(...run.map((i) => Rt[i].p[1])), ybot = Math.max(...run.map((i) => R0[i].p[1]));
  // body: curved glass, lit flank → shade flank, sky reflection darker toward the foot
  path(R0, Rt); ctx.fillStyle = hShade(ctx, ell(T, 1, (base + yb) / 2, P), run, (l) => (l > .5 ? mixC(T.glass[1], '#f6c8ac', (l - .5) * 2) : mixC(T.glass[2], T.glass[1], l * 2))); ctx.fill();
  ctx.save(); ctx.clip();
  { const vg = ctx.createLinearGradient(0, ytop, 0, ybot); vg.addColorStop(0, 'rgba(255,214,190,.22)'); vg.addColorStop(.5, 'rgba(255,214,190,0)'); vg.addColorStop(1, 'rgba(20,14,40,.35)'); ctx.fillStyle = vg; ctx.fillRect(-50, ytop - 10, W + 100, ybot - ytop + 20); }
  // vertical sky streaks: on a curved face reflections stand as soft vertical bands that slide as the camera moves
  const sh = (cam.x * .02 + t * .012) % 1;
  for (const [b0, bw, al] of [[.18, .05, .2], [.36, .1, .12], [.71, .04, .16]]) { const i0 = Math.floor(((b0 + sh) % 1) * RN), i1 = i0 + Math.max(1, Math.round(bw * RN)), sub = [];
    for (let i = i0; i <= i1; i++) sub.push(i % RN); if (!sub.every((i) => run.includes(i))) continue;
    const A = ell(T, 1, base, P), B = ell(T, 1, yb, P); ctx.beginPath(); sub.forEach((i, k) => (k ? ctx.lineTo(A[i].p[0], A[i].p[1]) : ctx.moveTo(A[i].p[0], A[i].p[1]))); for (let k = sub.length - 1; k >= 0; k--) ctx.lineTo(B[sub[k]].p[0], B[sub[k]].p[1]); ctx.closePath(); ctx.fillStyle = `rgba(255,236,220,${al})`; ctx.fill(); }
  // spandrels as curved dark bands (they bow with the cylinder), mullions bunching toward the silhouettes
  for (let j = 1; j <= nf; j++) { const y = base + j * fh; band(y - .22, y); ctx.fillStyle = 'rgba(30,20,46,.22)'; ctx.fill(); }
  ctx.lineWidth = .9; ctx.beginPath(); for (const i of run) { if (i % 2) continue; const a = R0[i].p, b = Rt[i].p; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.strokeStyle = 'rgba(24,16,40,.3)'; ctx.stroke();
  const r = prng(Math.round(T.h * 10 + 5));
  for (let j = 0; j < nf; j++) for (let i = 0; i < RN; i += 4) { const v = r(); if (v > .07 || !run.includes(i) || !run.includes((i + 4) % RN)) continue; const A = ell(T, 1, base + j * fh + .25, P), B = ell(T, 1, base + (j + 1) * fh - .5, P);
    ctx.beginPath(); [A[i].p, A[(i + 4) % RN].p, B[(i + 4) % RN].p, B[i].p].forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = v < .03 ? 'rgba(255,214,150,.62)' : 'rgba(255,196,140,.3)'; ctx.fill(); }
  band(base, base + fh - .28); ctx.fillStyle = 'rgba(255,196,130,.3)'; ctx.fill();   // the lobby, warm
  ctx.restore();
  // the warm rim on the sunward silhouette, a faint one on the other
  const e0 = run[1], e1 = run[run.length - 2], [eL, eR] = R0[e0].p[0] < R0[e1].p[0] ? [e0, e1] : [e1, e0];
  ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,236,206,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R0[eR].p[0], R0[eR].p[1]); ctx.lineTo(Rt[eR].p[0], Rt[eR].p[1]); ctx.stroke();
  ctx.strokeStyle = 'rgba(240,210,220,.3)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(R0[eL].p[0], R0[eL].p[1]); ctx.lineTo(Rt[eL].p[0], Rt[eL].p[1]); ctx.stroke();
  // the crown: stacked rings with two slim setbacks and a flat roof, engraved ring lines, a warm lantern at the top
  const rings = CROWN.map(([f, k]) => ({ y: yb + f * crownH, k, R: ell(T, k, yb + f * crownH, P) }));
  const ringCol = (m, l) => mixC(T.glass[1], '#ffd8b8', clamp(.15 + l * .8 + m * .05));
  // each crown band as small facing quads (the 3D normal of the taper decides what the camera sees): from below the highest band
  // first, from above the lowest first, so nearer surfaces always paint last; a cap on the top when seen from above
  const order = cam.y > top ? rings.slice(0, -1).map((g, m) => m) : rings.slice(0, -1).map((g, m) => rings.length - 2 - m);
  for (const m of order) { const A = rings[m].R, B = rings[m + 1].R, dy = rings[m + 1].y - rings[m].y, dk = rings[m].k - rings[m + 1].k, ym = (rings[m].y + rings[m + 1].y) / 2;
    for (let i = 0; i < RN; i++) { const j = (i + 1) % RN, q = A[i], rr = Math.hypot(q.x - T.x, q.z - T.z) / Math.max(.01, rings[m].k), ny = dk * rr, nh = dy, L = Math.hypot(ny, nh);
      if (((cam.x - q.x) * q.nx + (cam.z - q.z) * q.nz) * nh / L + (cam.y - ym) * ny / L <= 0) continue;
      const col = ringCol(m, lit(q) * .85 + .3 * ny / L); ctx.beginPath(); ctx.moveTo(A[i].p[0], A[i].p[1]); ctx.lineTo(A[j].p[0], A[j].p[1]); ctx.lineTo(B[j].p[0], B[j].p[1]); ctx.lineTo(B[i].p[0], B[i].p[1]); ctx.closePath();
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = .8; ctx.stroke(); }
    if (m % 2 === 0 && m) { ctx.strokeStyle = 'rgba(255,232,206,.35)'; ctx.lineWidth = .9; ctx.beginPath(); run.forEach((i, k) => (k ? ctx.lineTo(A[i].p[0], A[i].p[1]) : ctx.moveTo(A[i].p[0], A[i].p[1]))); ctx.stroke(); } }
  if (cam.y > top) { const g = rings[rings.length - 1]; ctx.beginPath(); g.R.forEach((q, i) => (i ? ctx.lineTo(q.p[0], q.p[1]) : ctx.moveTo(q.p[0], q.p[1]))); ctx.closePath(); ctx.fillStyle = '#f2d2b4'; ctx.fill(); }
  { const L = P(T.x, top + .1, T.z), d = Math.max(3, cam.f * .45 / Math.max(1, L[2])); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], d * 2.4); g.addColorStop(0, 'rgba(255,236,200,.45)'); g.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = g; ctx.fillRect(L[0] - d * 2.4, L[1] - d * 2.4, d * 4.8, d * 4.8); ctx.restore(); }
  return { roof: run.map((i) => Rt[i].p), corner: [] };
}
// ---------- Anthropic: a stepped tower with setbacks, an engraved Art Deco crown (sunburst, flutes) and a needle ----------
const STEPS = [[0, .5, 1], [.5, .72, .76], [.72, .86, .54]];   // tiers: from, to (fraction of h), footprint scale
function stepTower(ctx, P, T, h, t, cam) {
  const base = .9, D = [];
  STEPS.forEach(([a, b, k], i) => D.push(() => tower(ctx, P, { ...T, hx: T.hx * k, hz: T.hz * k }, (b - a) * h, t, cam, { base: base + a * h, crown: false, units: false, lobby: i === 0, seed: i * 17 })));
  for (const [a, b, k] of [[.86, 1, .38], [1, 1.045, .24], [1.045, 1.075, .13]]) D.push(() => tower(ctx, P, { ...T, hx: T.hx * k, hz: T.hz * k }, (b - a) * h, t, cam, { base: base + a * h, deco: true, units: false }));
  // from below the upper tiers are drawn first (the lower ledges hide their feet); from above the lower first (the roofs show around the upper)
  (cam.y > base + 1.075 * h ? D : D.slice().reverse()).forEach((f) => f());
  const c = Math.cos(T.yaw), s = Math.sin(T.yaw);
  return { roof: [], corner: [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => [T.x + sx * T.hx * c - sz * T.hz * s, T.z + sx * T.hx * s + sz * T.hz * c]) };
}
function hull(pts) {   // convex hull (monotone chain) of screen points
  const p = pts.map((q) => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
export function footprint(T, n = 24) {   // ground outline of a tower (world x/z)
  const c = Math.cos(T.yaw), s = Math.sin(T.yaw);
  if (T.kind === 'round') { const L = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, lx = T.hx * Math.cos(a), lz = T.hz * Math.sin(a); L.push([T.x + lx * c - lz * s, T.z + lx * s + lz * c]); } return L; }
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => [T.x + sx * T.hx * c - sz * T.hz * s, T.z + sx * T.hx * s + sz * T.hz * c]);
}
export function tagAnchor(T, grow = 1) {   // where the price tag's string is tied: the round tower's front-right shoulder, under its crown
  const c = Math.cos(T.yaw), s = Math.sin(T.yaw), lx = T.hx * .72, lz = -T.hz * .7;
  return { x: T.x + lx * c - lz * s, z: T.z + lx * s + lz * c, y: .9 + T.h * grow * (T.kind === 'round' ? .84 : 1) };
}

export function towersFrame(ctx, t, o = {}) {
  const cam = camera(o.cam), P = projector(cam), grow = o.grow ?? 1, out = { P, cam };
  // ---- sky anchored to the horizon line
  const hzY = P(cam.x, cam.y, cam.z + 1e5)[1], S = sky('dawn');
  ctx.drawImage(S.c, -200 + drift(t, 8, 1), hzY - S.hz);
  if (hzY < -50) { ctx.fillStyle = '#141634'; ctx.fillRect(0, 0, W, Math.max(0, hzY - S.hz)); }
  // sun disc just above the horizon between the towers
  { const sp = P(cam.x + 2, cam.y + 1.5 + 0 * 1e3, cam.z + 1000), sx = sp[0] + 40, sy = Math.min(hzY - 8, sp[1]); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 60); g.addColorStop(0, 'rgba(255,248,230,1)'); g.addColorStop(.5, 'rgba(255,236,200,.9)'); g.addColorStop(1, 'rgba(255,200,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, 60, 0, TAU); ctx.fill(); ctx.restore(); out.sun = [sx, sy]; }
  // far fog bands + distant tree line on the horizon
  { const F = fogBand('far', '#f2c4b0', .55, 4); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.drawImage(F, -300 - t * 6 % 300 + drift(t, 10, 2), hzY - 230); ctx.restore(); }
  { const r = prng(41); ctx.fillStyle = '#5a4a62'; ctx.beginPath(); ctx.moveTo(-10, hzY + 2); for (let x = -10; x <= W + 10; x += 14) ctx.lineTo(x, hzY - 6 - Math.abs(Math.sin(x * .013 + 1)) * 14 * r() - (r() < .1 ? 10 : 0)); ctx.lineTo(W + 10, hzY + 4); ctx.closePath(); ctx.fill(); }
  // ---- ground: warm toward the sun, dark toward us; perspective furrows of lawn/field lines
  { const gy = Math.max(hzY, -200); const g = ctx.createLinearGradient(0, gy, 0, H + 200); g.addColorStop(0, '#c48a7c'); g.addColorStop(.12, '#7a5a5a'); g.addColorStop(.5, '#3c2c34'); g.addColorStop(1, '#1a1420'); ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy + 10);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createRadialGradient(out.sun[0], hzY, 0, out.sun[0], hzY, 900); sg.addColorStop(0, 'rgba(255,190,140,.35)'); sg.addColorStop(1, 'rgba(255,180,130,0)'); ctx.fillStyle = sg; ctx.save(); ctx.translate(0, hzY); ctx.scale(1, .3); ctx.translate(0, -hzY); ctx.fillRect(0, hzY, W, 1400); ctx.restore(); ctx.restore();
    // mown meadow: broad stripes running toward the sun
    const z0 = Math.max(cam.z + 1.5, 0), z1 = cam.z + 220;
    for (let k = -40; k <= 40; k++) { if (k % 2) continue; const p = [P(k * 3, 0, z0), P(k * 3 + 3, 0, z0), P(k * 3 + 3, 0, z1), P(k * 3, 0, z1)]; ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = 'rgba(255,200,170,.045)'; ctx.fill(); }
    // the company grounds inside the fence ring: pale paving with engraved rings (the ring is the company's line)
    { const ring = (r) => { const L = []; for (let k = 0; k <= 96; k++) { const a = k / 96 * TAU, x = FENCE.x + Math.cos(a) * r, z = FENCE.z + Math.sin(a) * r; L.push(P(x, .005, Math.max(z, cam.z + 1.2))); } return L; };
      const R0 = ring(FENCE.r); ctx.beginPath(); R0.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = 'rgba(214,170,160,.16)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,214,190,.14)'; ctx.lineWidth = 1; for (let rr = FENCE.r - 2; rr > PLR; rr -= 2.5) { const Rk = ring(rr); ctx.beginPath(); Rk.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); } } }
  // ---- long shadows of the towers toward us
  for (const T of TW) { const h = T.h * grow, Lsh = Math.min(90, h * 1.6), pts = [];
    for (const [x, z] of footprint(T, 20)) { pts.push(P(x, .01, z)); pts.push(P(x - .1 * Lsh, .01, Math.max(z - Lsh, cam.z + 2))); }
    ctx.fillStyle = 'rgba(14,8,20,.2)'; ctx.beginPath(); hull(pts).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); }
  // ---- painter's list: fence posts, trees, plinths + towers, slices, tag, figure
  const items = [];
  const fenceA = o.fence ?? 1;
  if (fenceA > 0) {
    const n = 54; for (let k = 0; k < n; k++) { const a = k / n * TAU, x = FENCE.x + Math.cos(a) * FENCE.r, z = FENCE.z + Math.sin(a) * FENCE.r; if (z < cam.z + 1.5) continue;
      items.push({ d: Math.hypot(x - cam.x, z - cam.z), draw: () => { const b = P(x, 0, z), tp = P(x, 1.25, z); const dd = Math.hypot(x - cam.x, z - cam.z, cam.y); ctx.strokeStyle = rgba('#1a1220', .9 * fenceA); ctx.lineWidth = clamp(cam.f * .1 / dd, 1, 6); ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(tp[0], tp[1]); ctx.stroke(); ctx.fillStyle = rgba('#ffd9b8', .7 * fenceA); ctx.fillRect(tp[0] - ctx.lineWidth / 2, tp[1] - 1, ctx.lineWidth, 2); } }); }
  }
  const trees = once('treepos', () => { const r = prng(77), L = []; for (let k = 0; k < 60 && L.length < 24; k++) { const a = r() * TAU, d = 12 + r() * 34; const x = Math.cos(a) * d * 1.5, z = 50 + Math.sin(a) * d * .9; if (z < 30 || Math.hypot(x - TW[0].x, z - TW[0].z) < PLR + 3 || Math.hypot(x - TW[1].x, z - TW[1].z) < PLR + 3) continue; if (Math.abs(x) < 20 && z < 46) continue; L.push({ x, z, h: 8 + r() * 4, kind: k % 3 }); } return L; });
  for (const T of trees) { if (T.z < cam.z + 3) continue; items.push({ d: Math.hypot(T.x - cam.x, T.z - cam.z), draw: () => { const b = P(T.x, 0, T.z), tp = P(T.x, T.h, T.z), sp = treeSprite(T.kind), hh = b[1] - tp[1], sc = hh / (sp.h * .9); if (sc <= 0) return; ctx.drawImage(sp.c, b[0] - sp.foot[0] * sc, b[1] - sp.foot[1] * sc, sp.w * sc, sp.h * sc); } }); }
  TW.forEach((T, i) => {
    items.push({ d: Math.hypot(T.x - cam.x, T.z - cam.z) + .5, draw: () => {
      // plinth: side band + engraved top
      const N = 72, side = []; for (let k = 0; k <= N; k++) { const a = k / N * TAU; side.push([T.x + Math.cos(a) * PLR, T.z + Math.sin(a) * PLR]); }
      ctx.fillStyle = '#5a4a48'; ctx.beginPath(); side.forEach(([x, z], k) => { const p = P(x, 0, z); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); for (let k = N; k >= 0; k--) { const [x, z] = side[k], p = P(x, .9, z); ctx.lineTo(p[0], p[1]); } ctx.closePath(); ctx.fill();
      drawFlat(ctx, P, plinthTop(), T.x, .9, T.z, 0, PLR / 300);
      // perforated wedge (a slice) on the plinth, then the slice itself if it has been punched out
      const sl = (o.slices || [])[i]; if (sl) slice(ctx, P, T, sl, t);
      const TT = T.kind === 'round' ? roundTower(ctx, P, T, T.h * grow, t, cam) : T.kind === 'step' ? stepTower(ctx, P, T, T.h * grow, t, cam) : tower(ctx, P, T, T.h * grow, t, cam);
      out['roof' + i] = TT.roof;
      // engraved plaque + label
      if ((o.labels ?? 0) > 0) { const pa = P(T.x - 1.3, .18, T.z - PLR * .99), pb = P(T.x + 1.3, .72, T.z - PLR * .99); ctx.fillStyle = '#d8c49c'; ctx.fillRect(pa[0], pb[1], pb[0] - pa[0], pa[1] - pb[1]); ctx.strokeStyle = 'rgba(60,40,25,.7)'; ctx.lineWidth = 1; ctx.strokeRect(pa[0] + 2, pb[1] + 2, pb[0] - pa[0] - 4, pa[1] - pb[1] - 4);
        ctx.fillStyle = 'rgba(60,40,25,.55)'; for (let m = 0; m < 3; m++) ctx.fillRect(mix(pa[0], pb[0], .2), mix(pb[1], pa[1], .35 + m * .18), (pb[0] - pa[0]) * (.6 - m * .12), 1);
        const la = clamp(o.labels), lx = (pa[0] + pb[0]) / 2, ly = pb[1] - 24 - 30 * i; ctx.strokeStyle = rgba('#fff1d6', .7 * la); ctx.beginPath(); ctx.moveTo(lx, pb[1] - 2); ctx.lineTo(lx, ly + 6); ctx.stroke();
        ctx.save(); ctx.shadowColor = 'rgba(20,10,20,.8)'; ctx.shadowBlur = 8; text(ctx, T.name.toUpperCase(), lx, ly, { size: 20, weight: 600, color: rgba('#fff1d6', la), align: 'center', spacing: 5 }); ctx.restore(); }
    } });
  });
  if ((o.clouds ?? 0) > 0) {   // a cloud deck at cloudY metres: puffs nearer than a tower are drawn over it (the towers push through)
    const cyy = o.cloudY ?? 46, L = once('cloudpos', () => { const r = prng(91), A = []; for (let k = 0; k < 34; k++) A.push({ x: -80 + r() * 160, z: 18 + r() * 80, w: 30 + r() * 34, dy: (r() - .5) * 5, kind: k % 3, sp: .3 + r() * .5 }); return A; });
    for (const Cl of L) items.push({ d: Math.hypot(Cl.x - cam.x, Cl.z - cam.z) - 6, draw: () => { const p = P(Cl.x + ((t * Cl.sp) % 30), cyy + Cl.dy, Cl.z); if (p[2] < 2) return; const sp = cloudSprite(Cl.kind), sc = cam.f * Cl.w / p[2] / sp.w;
      ctx.save(); ctx.globalAlpha = clamp(o.clouds); ctx.drawImage(sp.c, p[0] - sp.w * sc / 2, p[1] - sp.h * sc / 2, sp.w * sc, sp.h * sc); ctx.restore(); } });
  }
  if (o.figure) { const F = o.figure, z = F.z ?? 30, x = F.x; items.push({ d: Math.hypot(x - cam.x, z - cam.z), draw: () => { const b = P(x, 0, z), tp = P(x, 1.75, z), s = (b[1] - tp[1]) / 185; figure(ctx, b[0], b[1] - 90 * s, s, walk(F.phase), { t, seed: 3, accent: '#c8843a', accentPart: 'scarf', light: { x: out.sun[0], y: out.sun[1], col: '#ffd0a0', a: .8 }, rim: '#ffd9b0', rimSide: 1, cast: null }); out.figure = { x: b[0], y: b[1], h: b[1] - tp[1] }; } }); }
  items.sort((p, q) => q.d - p.d); for (const it of items) it.draw();
  // fence wire + microtext ring on the ground (in front of everything far, drawn once over)
  if (fenceA > 0) {
    const pts = []; for (let k = 0; k <= 160; k++) { const a = k / 160 * TAU, x = FENCE.x + Math.cos(a) * FENCE.r, z = FENCE.z + Math.sin(a) * FENCE.r; if (z < cam.z + 1.5) { pts.push(null); continue; } pts.push([P(x, 1.05, z), P(x, .55, z), P(x, .02, z)]); }
    for (const lvl of [0, 1]) { ctx.strokeStyle = rgba(lvl ? '#2a1a28' : '#ffd9b8', (lvl ? .6 : .55) * fenceA); ctx.lineWidth = lvl ? 1.2 : 1.5; ctx.beginPath(); let pen = false; for (const p of pts) { if (!p) { pen = false; continue; } pen ? ctx.lineTo(p[lvl][0], p[lvl][1]) : ctx.moveTo(p[lvl][0], p[lvl][1]); pen = true; } ctx.stroke(); }
    out.fenceGround = pts;
  }
  // ---- price tag on a string from tower A's roof corner
  if ((o.tag ?? 0) > 0) {
    const T = TW[0], an = tagAnchor(T, grow), cx = an.x, cz = an.z, top = P(cx, an.y, cz);
    const swing = .12 * Math.sin(t * 1.3) + .05 * Math.sin(t * 2.9), hang = P(cx + .6, 2.6 + Math.max(0, T.h * grow - 13.5) * .55, cz - .4);
    const tx = hang[0] + Math.sin(swing) * 30, ty = hang[1];
    ctx.strokeStyle = 'rgba(250,236,210,.8)'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.quadraticCurveTo((top[0] + tx) / 2 + 8, (top[1] + ty) / 2, tx, ty); ctx.stroke();
    const ts = clamp((hang[1] - top[1]) / 400 + .4, .5, 1.4) * (o.tagScale ?? 1);
    priceTag(ctx, tx, ty, ts, t, { rot: swing * .8 + .1, a: o.tag, label: o.tagLabel, sub: o.tagSub, glow: o.tagGlow || 0 });
    out.tag = { x: tx, y: ty + 46 * ts, s: ts };
  }
  // near fog in front, low on the ground
  { const F = fogBand('near', '#e6b4a8', .32, 8); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .8; ctx.drawImage(F, -300 + t * 9 % 300 - 150, hzY - 120); ctx.restore(); }
  return out;
}
// the paper price tag: a reinforced hole, string, an engraved number (tiny from afar; 4.03 reads it big)
export function priceTag(ctx, x, y, s, t, o = {}) {
  const w = 74, h = 112, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  const path = () => { ctx.beginPath(); ctx.moveTo(-w / 2 + 14, 0); ctx.lineTo(w / 2 - 14, 0); ctx.lineTo(w / 2, 16); ctx.lineTo(w / 2, h); ctx.lineTo(-w / 2, h); ctx.lineTo(-w / 2, 16); ctx.closePath(); };
  ctx.save(); ctx.shadowColor = 'rgba(20,10,20,.45)'; ctx.shadowBlur = 10; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 6; path(); ctx.fillStyle = '#efe4cc'; ctx.fill(); ctx.restore();
  path(); const g = ctx.createLinearGradient(-w / 2, 0, w / 2, h); g.addColorStop(0, '#fbf3e1'); g.addColorStop(1, '#d8c6a2'); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(40,56,79,.55)'; ctx.lineWidth = .8; ctx.strokeRect(-w / 2 + 6, 22, w - 12, h - 28);
  ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.arc(0, 11, 6, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(0, 11, 2.8, 0, TAU); ctx.fill();
  const lab = o.label ?? '$'; text(ctx, lab, 0, 62, { size: lab.length > 2 ? 23 : 30, font: 'Instrument Serif', color: '#24384f', align: 'center' });
  if (o.sub) { text(ctx, o.sub, 0, 84, { size: 7.5, weight: 600, color: 'rgba(36,56,79,.85)', align: 'center', spacing: 1.2 }); ctx.fillStyle = 'rgba(36,56,79,.6)'; ctx.fillRect(-14, 92, 28, 1); }
  else { ctx.fillStyle = 'rgba(36,56,79,.6)'; ctx.fillRect(-18, 78, 36, 1.2); ctx.fillRect(-12, 86, 24, 1.2); }
  if (o.glow > 0) { ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(0, 56, 0, 0, 56, 70); gg.addColorStop(0, `rgba(255,179,92,${.45 * o.glow})`); gg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = gg; ctx.fillRect(-80, -20, 160, 150); ctx.globalCompositeOperation = 'source-over'; }
  ctx.restore();
}
// a perforated slice on a plinth: u 0 = only the perforation (perfo alpha), punch = holes flash, u 0..1 = lifted out and laid beside
function slice(ctx, P, T, sl, t) {
  const ST = sliceTex(), at = sl.at ?? (-Math.PI / 2 - .5), pf = clamp(sl.perfo ?? 1), u = clamp(sl.u ?? 0), punch = clamp(sl.punch ?? 0);
  const a0 = at + ST.a0, a1 = at + ST.a1, R = PLR - .3;
  if (u <= 0) {
    // the perforation (holes with light from below) around the wedge on the plinth top
    const pts = [[T.x, T.z]]; for (let k = 0; k <= 24; k++) { const a = mix(a0, a1, k / 24); pts.push([T.x + Math.cos(a) * R, T.z + Math.sin(a) * R]); } pts.push([T.x, T.z]);
    const sp = pts.map(([x, z]) => P(x, .92, z)), npu = Math.max(2, Math.ceil(sp.length * clamp(sl.pu ?? 1)));
    if (pf > 0) { ctx.save(); ctx.globalAlpha = pf; perforation(ctx, sp.slice(0, npu), { pitch: 11, hole: 3 + 2.4 * punch, light: punch > 0 ? '#fff1d6' : '#ffd59a', a: pf }); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,190,110,${.35 * pf + .5 * punch})`; ctx.lineWidth = 6; ctx.setLineDash([2, 9]); ctx.lineCap = 'round'; ctx.beginPath(); sp.slice(0, npu).forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    // a faint foil tint inside (the share to be)
    ctx.save(); ctx.globalAlpha = .25 * pf; ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); sp.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = 'rgba(255,179,92,.5)'; ctx.fill(); ctx.restore();
    return;
  }
  // the hole left behind
  { const pts = [[T.x, T.z]]; for (let k = 0; k <= 24; k++) { const a = mix(a0, a1, k / 24); pts.push([T.x + Math.cos(a) * R, T.z + Math.sin(a) * R]); } const sp = pts.map(([x, z]) => P(x, .9, z)); ctx.fillStyle = 'rgba(20,10,14,.75)'; ctx.beginPath(); sp.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); }
  // the slice travels: lifts, slides outward along its bisector, turns, lands beside the plinth
  const e = eio(u), lift = Math.sin(Math.PI * clamp(u * 1.1)) * 4.5 + .02, mid = at, d = mix(0, PLR + 4.5, e);
  const cx = T.x + Math.cos(mid) * d, cz = T.z + Math.sin(mid) * d, rot = mid - mid * 0 + e * (sl.turn ?? .9);
  sl.out = { x: cx, z: cz, rot, lift }; if (sl.hide) return;
  if (sl.cert > 0 && sl.certTex) { ctx.save(); ctx.globalAlpha = .35 * clamp(1 - lift / 6); drawFlat(ctx, P, sl.certTex, cx + .3, .01, cz + .3, rot, sl.certScale ?? .012); ctx.restore();
    ctx.save(); ctx.globalAlpha = clamp(sl.cert); drawFlat(ctx, P, sl.certTex, cx, .06, cz, rot, sl.certScale ?? .012, lift); ctx.restore(); if (sl.cert >= 1) return; ctx.globalAlpha = 1 - clamp(sl.cert); }
  // shadow on the ground
  ctx.save(); ctx.globalAlpha = .35 * clamp(1 - lift / 6); drawFlat(ctx, P, ST.c, cx + .3, .01, cz + .3, rot, PLR / 300); ctx.restore();
  ctx.save(); ctx.globalAlpha = sl.cert > 0 ? 1 - clamp(sl.cert) : 1; drawFlat(ctx, P, ST.c, cx, .92 * (1 - e) + .05, cz, rot, PLR / 300, lift); ctx.restore(); ctx.globalAlpha = 1;
}
