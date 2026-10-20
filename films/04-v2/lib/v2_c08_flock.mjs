// C08 · the forms take off (8.08–8.10): every form lifts off its stack on "work", the flock rises through the hall's open ridge vent,
// circles over the city at dusk; the typed word on each dissolves into dotted smoke ("unemployed"), the dust drifts up and becomes
// the first stars ("gone", ★); the blank forms fold into white birds and fly off. Also: the dusk sky, the city carpet below the
// horizon, a glass vault seen from outside (the hall's roof, the station's roof).
//   flyers(K)                    the flyer list (one per desk, from its first stack; the hero form among them)
//   drawFlyers(ctx, cam, t, K)   sheets / birds, depth sorted
//   drawSky(ctx, cam, t, K)      sky gradient + skyline + city carpet + the stars that the dust becomes
//   drawDust(ctx, cam, t, K)     the dissolving letters' dust between the sheets and the stars
//   drawVaultOut(ctx, cam, V)    a glass barrel vault on iron ribs seen from above, lit from inside, with its open ridge vent
import { W, H, clamp, mix, prng, memo, hash, TAU, seg, sio, eo3 } from './v2_c08_core.mjs';
import { rgb, css, lerpC, mulC, fillS, pathS, gridTex, mips, mipPick, bboxS, onScreen, glowAt, depthOf, distOf, skyFill, line3 } from './v2_c08_space.mjs';
import { DESKS, DESK_Y, fuW, SHEET } from './v2_c08_hall.mjs';
import { formTexture } from './v2_c08_form.mjs';

// ---------------------------------------------------------------- textures: the generic form, its word dissolving (frames), the hero form
const VIG0 = { reveal: 1, ringT0: 0, rays0: 0, sit: 0, fly: -10, warm: 0 };
const STRK = [...Array(10)].map((_, i) => 100 + i * .1);
const SMK = [...Array(10)].map((_, i) => 300 + i * .09);
export const NWF = 7;    // frames of the word dissolving (0 intact … NWF-1 gone)
export const wordFrames = () => memo('c08wf', () => [...Array(NWF)].map((_, k) => mips('c08wf' + k, () => formTexture(k === 0 ? 299 : 300 + k * .32, { grow: 1, fib: 1, vig: VIG0, strikes: STRK, smoke: SMK, ret: null, age: 61.2 }, .42), 4)));
export const heroMips = () => mips('c08hero', () => formTexture(206.5, { grow: 1, fib: 1, vig: { ...VIG0, sit: 1, warm: 1, fly: 6 }, strikes: STRK, smoke: STRK.map(() => 1), ret: { u: 1, glint: 1 }, age: 65.85 }, .5), 4);

// ---------------------------------------------------------------- the flyers
// each: { p0 (sheet centre on the stack), rot0, t0 (lift), xv (where it crosses the vent), r, ph (circle), h (height), tb (becomes a bird), dirB (flight out) }
export const FLOCKC = [0, 25, 17];
export const flyers = (K) => memo('c08fly', () => {
  const out = [], r = prng(9393);
  for (const d of DESKS) {
    const s = d.hero ? null : d.stacks[0], dist = Math.hypot(d.cx, d.cz);
    const p0 = d.hero ? [0, DESK_Y + .0006, 0] : [s.x, DESK_Y + s.h + .001, s.z], rot0 = d.hero ? 0 : s.rot;
    const t0 = K.work - .05 + dist / 46 * .22 + r() * .07, xv = (r() - .5) * .7;
    const zc = clamp(d.cz + (r() - .5) * 3, FLOCKC[2] - 17, FLOCKC[2] + 17), ph = Math.atan2(zc - FLOCKC[2], xv * 4 + (r() - .5) * 2);
    out.push({ d, hero: d.hero, p0, rot0, t0, xv, zc, rad: 5 + Math.abs(zc - FLOCKC[2]) * .7 + r() * 3, ph, h: FLOCKC[1] + (r() - .5) * 9, sp: .55 + r() * .25,
      tb: K.gone - .7 + r() * .55, az: r() * TAU, el: .12 + r() * .35, s1: r() * TAU, s2: r() * TAU, s3: r() * TAU, vmax: 15 + r() * 3, wf: K.unemp + .05 + r() * .55 });
  }
  return out;
});
const RISE = (f, tau) => { const T = .35, v = f.vmax; return tau <= 0 ? 0 : v * (tau - T * (1 - Math.exp(-tau / T))); };
const VENT_Y = 15.6;
// position, velocity-ish and the attitude of flyer f at time t → { O, ex, ez, en, fold, bird, scale }
export function pose(f, t, K) {
  const tau = t - f.t0;
  // phase 1: lift and rise, converging to the vent slot
  const y1 = f.p0[1] + RISE(f, tau), c = clamp((y1 - f.p0[1] - .4) / (VENT_Y - f.p0[1] - .4)), cc = c * c * (3 - 2 * c);
  let O = [mix(f.p0[0], f.xv, cc), y1, f.p0[2] + .4 * cc * Math.sin(f.s1)];
  // the moment it clears the vent; phase 2: circling above the roofs
  const tv = (() => { let lo = 0, hi = 4; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (f.p0[1] + RISE(f, m) < VENT_Y + 1) lo = m; else hi = m; } return f.t0 + hi; })();
  const w2 = sio(seg(t, tv, tv + 1.1));
  if (w2 > 0) {
    const ang = f.ph + f.sp * (t - tv) * (f.zc > FLOCKC[2] ? 1 : 1), Pc = [FLOCKC[0] + f.rad * Math.cos(ang), f.h + 1.2 * Math.sin(t * 1.3 + f.s2), FLOCKC[2] + f.rad * Math.sin(ang)];
    const up = [O[0], VENT_Y + 1 + f.vmax * .8 * Math.max(0, t - tv), O[2]];
    O = [mix(up[0], Pc[0], w2), mix(up[1], Pc[1], w2), mix(up[2], Pc[2], w2)];
  }
  // phase 3: a bird, flying off outward and up
  const wb = clamp((t - f.tb) / .45), bird = t > f.tb;
  if (bird) {
    const u = t - f.tb, dirx = Math.cos(f.az) * Math.cos(f.el), diry = Math.sin(f.el), dirz = Math.sin(f.az) * Math.cos(f.el), dist = 4 * u + 7 * u * u;
    O = [O[0] + dirx * dist, O[1] + diry * dist, O[2] + dirz * dist];
  }
  // attitude: yaw spins slowly, flutter tilts; birds turn their fold line along the flight
  const flut = (1 - w2 * .5) * (tau > 0 ? clamp(tau / .3) : 0);
  let yaw = f.rot0 + (tau > 0 ? .7 * Math.sin(tau * .9 + f.s1) * clamp(tau) : 0), tilt = .5 * flut * Math.sin(tau * 5.2 + f.s2), roll = .4 * flut * Math.sin(tau * 3.7 + f.s3);
  if (w2 > 0) yaw += w2 * (f.ph + f.sp * (t - tv) + Math.PI / 2);
  if (bird) { const yb = Math.atan2(Math.cos(f.az), Math.sin(f.az)); yaw = mix(yaw, yb, wb); tilt = mix(tilt, -.25, wb); roll = mix(roll, 0, wb); }
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  let ex = [cy, 0, -sy], ez = [sy, 0, cy], en = [0, 1, 0];
  const rot = (a, b, ang) => { const c2 = Math.cos(ang), s2 = Math.sin(ang); return [[a[0] * c2 + b[0] * s2, a[1] * c2 + b[1] * s2, a[2] * c2 + b[2] * s2], [b[0] * c2 - a[0] * s2, b[1] * c2 - a[1] * s2, b[2] * c2 - a[2] * s2]]; };
  [ez, en] = rot(ez, en, tilt); [ex, en] = rot(ex, en, roll);
  const fold = bird ? eo3(wb) * (.45 + .55 * Math.sin((t - f.tb) * 13 + f.s1)) : 0;
  return { O, ex, ez, en, fold, bird, tau, tv };
}
// a sheet (A4) at pose p: P(u, v) on the paper (u right, v down the page); folded birds: the halves rotate about the fold line (v = .5)
function sheetP(p, bend = 0) {
  const { O, ex, ez, en } = p, Wd = .21, Hd = .297;
  return (u, v) => { const x = (u - .5) * Wd, z = (.5 - v) * Hd, b = bend * (z * z / (Hd * Hd) * 4 - .33) * .04; return [O[0] + ex[0] * x + ez[0] * z + en[0] * b, O[1] + ex[1] * x + ez[1] * z + en[1] * b, O[2] + ex[2] * x + ez[2] * z + en[2] * b]; };
}
function wingP(p, top) {
  const { O, ex, ez, en, fold } = p, Wd = .21, Hd = .297, th = fold * 1.25, c = Math.cos(th), s = Math.sin(th);
  return (u, v) => { const x = (u - .5) * Wd, r = top ? (.5 - v) * Hd : (v - .5) * Hd, dz = top ? c : -c; return [O[0] + ex[0] * x + (ez[0] * dz + en[0] * s) * r, O[1] + ex[1] * x + (ez[1] * dz + en[1] * s) * r, O[2] + ex[2] * x + (ez[2] * dz + en[2] * s) * r]; };
}
// draws all flyers that have lifted (t ≥ t0); the ones still on their stacks are drawn by the hall
export function drawFlyers(ctx, cam, t, K, o = {}) {
  const F = flyers(K), WF = wordFrames(), HM = heroMips(), items = [];
  for (const f of F) {
    if (t < f.t0) continue;
    const p = pose(f, t, K), dd = depthOf(cam, p.O); if (dd < cam.near + .05) continue;
    const s = cam.P(p.O[0], p.O[1], p.O[2]); const px = cam.f / dd * .3; if (s[0] < -px * 2 || s[0] > W + px * 2 || s[1] < -px * 2 || s[1] > H + px * 2) continue;
    items.push([dd, f, p, px]);
  }
  items.sort((a, b) => b[0] - a[0]);
  const sky = o.inside ? 0 : 1;
  for (const [dd, f, p, px] of items) {
    // the word's dissolve frame
    const k = f.hero ? -1 : Math.min(NWF - 1, Math.max(0, Math.floor((t - f.wf) / .17)));
    const tex = f.hero ? HM : WF[t < f.wf ? 0 : k];
    // light: inside the hall warm from below, outside the dusk sky; the back of the paper is plain
    const upF = p.en[1], warm = clamp(1 - (p.O[1] - 1) / 14) * (o.inside ? 1 : .4);
    const back = css(lerpC(rgb('#cfc7d8'), rgb('#f2d9b0'), warm * .6));
    if (px < 3) { const s = cam.P(...p.O); ctx.fillStyle = back; ctx.fillRect(s[0] - 1, s[1] - 1, 2, 2); continue; }
    if (!p.bird) {
      const P = sheetP(p, Math.sin(t * 4 + f.s2) * clamp(p.tau));
      const n = px > 160 ? 2 : 1, img = px > 12 ? mipPick(tex, px * 1.41, 'h') : null;
      if (img) gridTex(ctx, cam, img, P, n, n, { back, pad: .4, flat: px < 50 });
      else { const sp = cam.poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]); fillS(ctx, sp, back); }
      // shade: facing away from the light → darker
      const sp = cam.poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]);
      const dark = o.inside ? clamp(.35 - upF * .15) : clamp(.3 - upF * .25);
      if (sp.length > 2 && dark > .02) fillS(ctx, sp, `rgba(22,22,52,${dark.toFixed(3)})`);
    } else {
      for (const top of [true, false]) {
        const P = wingP(p, top), sp = cam.poly(top ? [P(0, 0), P(1, 0), P(1, .5), P(0, .5)] : [P(0, .5), P(1, .5), P(1, 1), P(0, 1)]);
        if (sp.length < 3) continue;
        const img = px > 14 ? mipPick(tex, px * 1.41, 'h') : null;
        if (img) gridTex(ctx, cam, img, (u, v) => P(u, top ? v * .5 : .5 + v * .5), 1, 1, { back, pad: .4, flat: true });
        else fillS(ctx, sp, back);
        fillS(ctx, sp, `rgba(30,30,70,${(.12 + .18 * (top ? 1 : 0)).toFixed(3)})`);
      }
    }
  }
}

// ---------------------------------------------------------------- dust → stars
// every flyer sheds a few dust grains from its word when the word dissolves; they drift up and gather into the first stars on "gone"
export const STARS = memo('c08stars', () => { const r = prng(4545), s = []; for (let i = 0; i < 80; i++) s.push({ az: (r() - .5) * 2.6 + Math.PI / 2, el: .2 + r() * .75, m: .5 + r() * 1, tw: r() * TAU }); return s; });
const grains = (K) => memo('c08grains', () => { const F = flyers(K), r = prng(6161), g = []; F.forEach((f, i) => { if (f.hero) return; for (let k = 0; k < 6; k++) g.push({ f, ox: (r() - .5) * .12, oz: (r() - .2) * .06, star: (i * 6 + k) % 80, t1: f.wf + r() * .5, sp: .4 + r() * .8, a: r() }); }); return g; });
function starPos(cam, s, t) { return cam.dir(s.az, s.el); }
export function drawDust(ctx, cam, t, K) {
  if (t < K.unemp) return;
  const G = grains(K), gone = K.gone;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const g of G) {
    if (t < g.t1) continue;
    const p = pose(g.f, g.t1, K), u = t - g.t1;
    // the grain's own drift (up, spreading), then drawn to its star by "gone"
    const P0 = [p.O[0] + g.ox + Math.sin(g.a * 9) * u * .8, p.O[1] + u * (1.2 + g.sp), p.O[2] + g.oz + Math.cos(g.a * 7) * u * .8];
    const s0 = cam.P(P0[0], P0[1], P0[2]); if (!(s0[2] > cam.near)) continue;
    const st = starPos(cam, STARS[g.star], t), w = st ? sio(seg(t, gone - .8, gone)) : 0;
    const x = st ? mix(s0[0], st[0], w) : s0[0], y = st ? mix(s0[1], st[1], w) : s0[1];
    const a = (1 - .5 * w) * clamp(1 - Math.max(0, u - 2.4)) * (t > gone + .05 ? 0 : 1);
    if (a <= 0) continue;
    ctx.fillStyle = `rgba(255,236,200,${(.55 * a).toFixed(3)})`; ctx.fillRect(x - .9, y - .9, 1.8, 1.8);
  }
  ctx.restore();
}
// ---------------------------------------------------------------- sky, skyline, city carpet
const SKYC = [[-.02, rgb('#1a1c3c')], [0, rgb('#e2a070')], [.03, rgb('#c9806e')], [.1, rgb('#7a5f8c')], [.28, rgb('#323b78')], [.7, rgb('#151a40')], [1.4, rgb('#0e1230')]];
const SKYLINE = memo('c08skyline', () => { const r = prng(2727), pts = []; let a = 0; while (a < TAU) { const w = .01 + r() * .03, h = .006 + r() * r() * .03; pts.push([a, h]); pts.push([a + w, h]); a += w; } return pts; });
const CITY = memo('c08citylights', () => { const r = prng(8282), p = []; for (let i = 0; i < 1400; i++) { const a = r() * TAU, d = 40 + Math.pow(r(), .6) * 900; p.push([Math.cos(a) * d, Math.sin(a) * d, r()]); } return p; });
export function drawSky(ctx, cam, t, K) {
  skyFill(ctx, cam, SKYC);
  // city carpet below the horizon: street lights and windows as warm specks, fading into the haze
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, z, k] of CITY) { const p = cam.P(x, 0, z); if (!(p[2] > cam.near) || p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H) continue; const d = Math.hypot(x - cam.pos[0], z - cam.pos[2]); ctx.fillStyle = `rgba(255,${190 + 40 * k | 0},${120 + 60 * k | 0},${(.5 * Math.exp(-d / 500) * (.4 + .6 * k)).toFixed(3)})`; const sz = k > .9 ? 2.2 : 1.4; ctx.fillRect(p[0], p[1], sz, sz); }
  ctx.restore();
  // the far skyline: silhouettes on the horizon with a few lit windows
  const pts = []; for (const [a, h] of SKYLINE) { const s = cam.dir(a, h); if (s) pts.push(s); else pts.push(null); }
  ctx.fillStyle = '#141838'; ctx.beginPath(); let open = false, lastX = 0;
  for (let i = 0; i < pts.length; i++) { const s = pts[i]; if (!s) { if (open) { const b = cam.dir(SKYLINE[i - 1][0], -.05); if (b) ctx.lineTo(lastX, b[1]); ctx.closePath(); open = false; } continue; } if (!open) { const b = cam.dir(SKYLINE[i][0], -.05); if (!b) continue; ctx.moveTo(b[0], b[1]); open = true; } ctx.lineTo(s[0], s[1]); lastX = s[0]; }
  if (open) { const b = cam.dir(SKYLINE[pts.length - 1][0], -.05); if (b) ctx.lineTo(lastX, b[1]); ctx.closePath(); }
  ctx.fill();
  // the first stars: lit on "gone" (★), a short glint, then a slow twinkle
  if (t >= K.gone - .02) {
    const u = t - K.gone;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const s of STARS) {
      const p = cam.dir(s.az, s.el); if (!p || p[0] < -10 || p[0] > W + 10 || p[1] < -10 || p[1] > H + 10) continue;
      const tw = .75 + .25 * Math.sin(t * 2.3 + s.tw), flash = Math.exp(-Math.max(0, u - .05) * 3.5) * 1.6, a = clamp((tw + flash) * s.m * .7);
      glowAt(ctx, p[0], p[1], 7 + 9 * flash, [255, 238, 205], .35 * a);
      ctx.fillStyle = `rgba(255,246,228,${a.toFixed(3)})`; ctx.fillRect(p[0] - 1.1, p[1] - 1.1, 2.2, 2.2);
      if (flash > .2) { ctx.strokeStyle = `rgba(255,240,215,${(.5 * flash * s.m).toFixed(3)})`; ctx.lineWidth = 1; const L = 10 * flash; ctx.beginPath(); ctx.moveTo(p[0] - L, p[1]); ctx.lineTo(p[0] + L, p[1]); ctx.moveTo(p[0], p[1] - L); ctx.lineTo(p[0], p[1] + L); ctx.stroke(); }
    }
    ctx.restore();
  }
}
// ---------------------------------------------------------------- a glass vault from outside (roof), lit from inside
// V: { cx (ridge X), half (springing half-width), y0 (springing height), ridge, z0, z1, walls (wall top = y0), glow 0..1, vent (half-angle) }
export function drawVaultOut(ctx, cam, V) {
  const R = (V.half * V.half + (V.ridge - V.y0) ** 2) / (2 * (V.ridge - V.y0)), yc = V.ridge - R, A = Math.asin(V.half / R);
  const P = (a, z) => [V.cx + R * Math.sin(a), yc + R * Math.cos(a), z];
  // the building's flat roof around the vault and its walls (dark), the cornice line
  const b = V.box; if (b) {
    for (const [x0, x1] of [[b.x0, V.cx - V.half], [V.cx + V.half, b.x1]]) { const sp = cam.poly([[x0, V.y0, b.z0], [x1, V.y0, b.z0], [x1, V.y0, b.z1], [x0, V.y0, b.z1]]); fillS(ctx, sp, '#191a33'); }
    for (const [x, nx] of [[b.x0, -1], [b.x1, 1]]) if ((cam.pos[0] - x) * nx > 0) { const sp = cam.poly([[x, 0, b.z0], [x, V.y0, b.z0], [x, V.y0, b.z1], [x, 0, b.z1]]); fillS(ctx, sp, '#14152b'); }
    for (const [z, nz] of [[b.z0, -1], [b.z1, 1]]) if ((cam.pos[2] - z) * nz > 0) { const sp = cam.poly([[b.x0, 0, z], [b.x1, 0, z], [b.x1, V.y0, z], [b.x0, 0 + V.y0, z]]); fillS(ctx, sp, '#16172e'); }
  }
  const NA = 12, rows = []; for (let z = V.z0; z < V.z1 - .01; z += 3) rows.push(z);
  for (const z of rows) for (let i = 0; i < NA; i++) {
    const a0 = -A + 2 * A * i / NA, a1 = -A + 2 * A * (i + 1) / NA; if (a0 < V.vent && a1 > -V.vent) continue;
    const sp = cam.poly([P(a0, z), P(a1, z), P(a1, z + 3), P(a0, z + 3)]); if (sp.length < 3 || !onScreen(sp, 2)) continue;
    const k = hash(i, z * .3), col = lerpC(rgb('#3b2c3e'), rgb('#e0a465'), V.glow * (.55 + .3 * k));
    fillS(ctx, sp, css(col));
  }
  // the vent: the slot glows from inside; the opened panes stand above it
  for (const z of rows) {
    const sp = cam.poly([P(-V.vent, z), P(V.vent, z), P(V.vent, z + 3), P(-V.vent, z + 3)]); if (sp.length >= 3) fillS(ctx, sp, css(lerpC(rgb('#4a3424'), rgb('#ffcf8a'), V.glow)));
    for (const sg of [-1, 1]) { const p0 = P(sg * V.vent, z), p1 = P(sg * V.vent, z + 3), up = [sg * .5, 1.2, 0]; const q = cam.poly([p0, p1, [p1[0] + up[0], p1[1] + up[1], p1[2]], [p0[0] + up[0], p0[1] + up[1], p0[2]]]); if (q.length >= 3) { fillS(ctx, q, '#22233f'); ctx.beginPath(); pathS(ctx, q); ctx.strokeStyle = '#0b0c1c'; ctx.lineWidth = 1; ctx.stroke(); } }
  }
  ctx.strokeStyle = '#0b0c1c';
  for (const z of [...rows, V.z1]) { const pts = []; for (let i = 0; i <= 20; i++) pts.push(P(-A + 2 * A * i / 20, z)); const p = cam.P(V.cx, V.ridge, z); if (!(p[2] > cam.near)) continue; ctx.beginPath(); line3(ctx, cam, pts); ctx.lineWidth = clamp(cam.f / p[2] * .14, .6, 40); ctx.stroke(); }
  for (let i = 0; i <= NA; i++) { const a = -A + 2 * A * i / NA; if (Math.abs(a) < V.vent) continue; const pm = cam.P(...P(a, (V.z0 + V.z1) / 2)); ctx.beginPath(); line3(ctx, cam, [P(a, V.z0), P(a, V.z1)]); ctx.lineWidth = pm[2] > cam.near ? clamp(cam.f / pm[2] * .06, .5, 16) : 1; ctx.stroke(); }
  return { R, yc, A, P };
}
