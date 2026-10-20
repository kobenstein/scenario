// C10 · the close (§7): the roof at sunrise (7.02a), the sheet "The rule" (7.02b, 7.07–7.10), the city at sunrise with the
// rosette that belongs to no one yet (7.05, 7.05a) and then to everyone (7.06 ★).
//   roofDawn(ctx, t, o)   o: { t0, land (the sheet settles), buzz (the phone), fantasy (the ring holds solid, foil) } → { sheet: [x, y] }
//   ruleSheet(ctx, t, o)  the sheet, framed close; o: { t0, mode: 'intro' | 'write', ring (7.02b: the ring becomes the border),
//                         rule (title engraves), written (the pen hovers), lines: [words…] ×3 (7.07–7.10), agree, now, line0, coming, rise }
//   dawnCity(ctx, t, o)   o: { t0, yet (one ring engraves), which (the rosette engraves and rises), every (microtext), fall (light on the
//                         parapet) } → { sheet: [x, y] (screen point of the sheet on the parapet, for the push-in) }
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eout, eio, prng, drift, canvas, text } from '../engine.mjs';
import { stipple, vnoise, fbm, fog, hatch as artHatch, roughPath } from './art.mjs';
import { figure, figureFlat, POSES } from './figure.mjs';
import { hand, handTip, palmPos } from './hand.mjs';
import { pen } from './paper.mjs';
import { rooftop, rooftopFriends, ROOF } from './rooftop.mjs';
import { guilloche, rosette, ring, gBorder, microtext, microRing, foilGlint, seal, resample } from './certificate.mjs';
import { ghostLine, ghostPaths, burinTip } from './ghost.mjs';
import { fibreFill } from './print.mjs';
import { engraveWords, maskedGlint } from './sc10_engrave.mjs';
import { expoOut, expoIn, quart } from './sc10_places.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
function sprite(key, r, stops, k = .7) { return once(key, () => { const [c, g] = canvas(r * 2, r * 2), rg = g.createRadialGradient(r, r, 0, r, r, r); for (const [p, col] of stops) rg.addColorStop(p, col); g.fillStyle = rg; g.fillRect(0, 0, r * 2, r * 2); stipple(c, { k, g: 1.2, seed: r, boost: 2 }); return c; }); }

// ---------------------------------------------------------------- 7.02a the roof at sunrise
const SEATX = [820, 1080];
const roofCam = (t, t0) => { const lt = t - t0; return { x: drift(t, 8, 1) + lt * 5, y: drift(t, 4, 2), z: 1 + lt * .006 }; };
// screen point of the sheet on the parapet at time t (same maths as rooftop's map(1)): the zoom point into 7.02b
export function roofAnchor(t, o = {}) { const c = roofCam(t, o.t0 ?? 0), sx = 960 + (SEATX[0] - c.x - 960) * c.z, py = 540 + (ROOF.parapetY - c.y - 540) * c.z; return [sx - 300 * c.z, py - 6]; }
export function roofDawn(ctx, t, o = {}) {
  const t0 = o.t0 ?? 0, lt = t - t0, land = o.land ?? t0 + .5, buzz = o.buzz ?? t0 + .6, fant = o.fantasy ?? t0 + 2.7;
  const R = rooftop(ctx, t, { state: 'dawn', dawn: clamp(.72 + lt / 9), cam: roofCam(t, t0), seats: 2, seatX: SEATX });
  const py = R.parapet.y, seats = R.seats, L = R.light || { x: 960, y: 560, col: '#ffb35c' };
  const sx0 = seats[0].x, sx1 = (seats[1] || seats[0]).x, ks = R.k ? R.k(1) : 1;
  // phone and sheet lie on the coping beside you (left of your seat), clear of the knees
  const phx = sx0 - 150 * ks, shx = sx0 - 300 * ks, mid = (sx0 + sx1) / 2;
  // the sheet: it floats down from above (the fragment from 6.24) and settles on the parapet beside the phone
  const fall = clamp((t - (land - .8)) / .8), fe = eio(fall), sy = mix(-160, py - 4, fe) + Math.sin(fall * 9) * 12 * (1 - fall), sr = mix(.6, 0, fe) + .08 * Math.sin(t * 3) * (1 - fall);
  // the ring: engraved, solid (not dotted), spreading flat over the parapet top; on "fantasy" a foil glint holds it.
  // Its far half lies behind the friends, the near half passes in front of them (drawn in two clipped passes).
  const age = t - buzz, gl = Math.exp(-Math.pow((t - fant - .15) / .3, 2));
  const ringPass = (front) => {
    if (age <= 0) return;
    const r = 30 + 1100 * (1 - Math.pow(1 - clamp(age / 3.6), 2.2)), a = Math.min(1, age / .1) * (1 - clamp((age - 2.6) / 1.4));
    ctx.save(); ctx.beginPath(); if (front) ctx.rect(0, py - 2, W, H); else ctx.rect(0, 0, W, py - 2); ctx.clip();
    ctx.translate(phx, py - 2); ctx.scale(1, .2);
    ring(ctx, 0, 0, r, r, { lines: 9, band: 34, wave: 46, col: '#fff1d6', glow: '#ffb35c', glowA: .16 + .22 * gl, a: a * (.85 + .5 * gl), lw: 1.2 + .7 * gl, ph: t * .4 });
    ring(ctx, 0, 0, r * .86, r * .86, { lines: 4, band: 14, wave: 40, col: '#ffe2b8', glow: null, a: a * .5, lw: .7, ph: -t * .3 });
    ctx.restore();
  };
  ringPass(false);
  // the two friends of H.10 (C1's rooftopFriends): you (ochre scarf) left facing right, she (petrol) right facing left; both turn to the phone
  rooftopFriends(ctx, t, R, { you: { lean: -.04, nod: 0 }, friend: { nod: .25 + .2 * sm(lin(buzz, buzz + .6, t)), lean: .2 }, light: { x: L.x, y: L.y, col: '#ffd08a', a: .45 } });
  // the phone lying on the parapet top (a thin slab with a lit edge), it buzzes once
  const k = t > buzz ? Math.exp(-(t - buzz) * 3) : 0, jit = k * Math.sin(t * 90) * 1.6, lit = sm(lin(buzz - .05, buzz + .2, t));
  ctx.save(); ctx.translate(phx + jit, py - 3); ctx.scale(ks, ks); ctx.fillStyle = '#121420'; ctx.beginPath(); ctx.roundRect(-40, -6, 80, 8, 3); ctx.fill(); ctx.fillStyle = `rgba(255,214,160,${.25 + .7 * lit})`; ctx.fillRect(-36, -6, 72, 2);
  // face up: when it lights, its screen throws a soft cone of light up into the dawn air
  if (lit > 0) { const g = ctx.createRadialGradient(0, -8, 0, 0, -8, 110); g.addColorStop(0, `rgba(255,236,200,${.55 * lit * (.65 + .35 * k)})`); g.addColorStop(.35, `rgba(255,200,140,${.18 * lit})`); g.addColorStop(1, 'rgba(255,190,130,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.save(); ctx.scale(1, .55); ctx.fillStyle = g; ctx.fillRect(-110, -125, 220, 230); ctx.restore(); }
  ctx.restore();
  ringPass(true);
  // the sheet on top of the ring's sweep
  // it enters where the fragment left the split screen (x ≈ 1000) and drifts down to its place beside the phone, swaying like paper
  const fx0 = mix(1000, shx, fe) + Math.sin(fall * 7) * 26 * (1 - fall);
  ctx.save(); ctx.translate(fx0, sy); ctx.rotate(sr); ctx.scale(ks, ks * mix(1, .3, fe));
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-60, 2, 124, 10);
  ctx.fillStyle = '#f3ead6'; ctx.fillRect(-62, -40, 124, 80); ctx.strokeStyle = 'rgba(40,64,90,.55)'; ctx.lineWidth = 2; ctx.strokeRect(-56, -34, 112, 68); ctx.strokeStyle = 'rgba(184,100,30,.5)'; ctx.lineWidth = 1; ctx.strokeRect(-50, -28, 100, 56);
  ctx.restore();
  { const B = sprite('c10-warm', 420, [[0, 'rgba(255,220,170,.5)'], [.3, 'rgba(255,190,130,.12)'], [1, 'rgba(255,190,130,0)']]); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55; ctx.drawImage(B, phx - 420, py - 420); ctx.restore(); }
  return { sheet: [shx, py - 6] };
}

// ---------------------------------------------------------------- the sheet "The rule"
const SW = 1500, SH = 1000;
const LINES_Y = [395, 492, 589], LINE_X = 190, SIG = { x0: 430, x1: 1090, y: 800 };
function ledge() {
  return once('c10-ledge', () => {
    const [c, g] = canvas(W + 300, H + 300), r = prng(5), n = vnoise(9);
    // the far city below the parapet, out of focus in the morning gold (top band), then the stone slab of the parapet
    const sg = g.createLinearGradient(0, 0, 0, 420); sg.addColorStop(0, '#8a7f9c'); sg.addColorStop(.45, '#e2a888'); sg.addColorStop(1, '#ffd49a'); g.fillStyle = sg; g.fillRect(0, 0, W + 300, 420);
    g.fillStyle = 'rgba(150,112,128,.32)'; for (let x = -20; x < W + 320;) { const w = 50 + r() * 130, h = 60 + r() * 200; g.fillRect(x, 420 - h, w, h); x += w + r() * 30; }
    g.filter = 'blur(14px)'; g.drawImage(c, 0, 0); g.filter = 'none';
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70; i++) { const x = r() * (W + 300), y = 150 + r() * 250, rr = 8 + r() * 30, warm = r() < .75; const dg = g.createRadialGradient(x, y, 0, x, y, rr); dg.addColorStop(0, warm ? 'rgba(255,220,160,.42)' : 'rgba(210,220,250,.25)'); dg.addColorStop(.7, warm ? 'rgba(255,210,150,.18)' : 'rgba(210,220,250,.1)'); dg.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = dg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    g.globalCompositeOperation = 'source-over';
    const st = g.createLinearGradient(0, 400, 0, H + 300); st.addColorStop(0, '#9b8e86'); st.addColorStop(.2, '#7d726e'); st.addColorStop(1, '#3c3539'); g.fillStyle = st; g.fillRect(0, 400, W + 300, H - 100);
    g.fillStyle = 'rgba(255,226,180,.55)'; g.fillRect(0, 400, W + 300, 3);
    for (let i = 0; i < 9000; i++) { const x = r() * (W + 300), y = 404 + r() * (H - 104); g.fillStyle = r() < .5 ? `rgba(255,240,220,${.04 + r() * .06})` : `rgba(20,14,20,${.06 + r() * .1})`; g.fillRect(x, y, 1.5, 1.5); }
    for (let i = 0; i < 26; i++) { const x = r() * (W + 300), y = 420 + r() * (H - 140); g.strokeStyle = 'rgba(30,24,30,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) g.lineTo(x + k * 18 + (n(k, i) - .5) * 12, y + (n(i, k) - .5) * 20); g.stroke(); }
    g.save(); g.beginPath(); g.rect(0, 400, W + 300, H); g.clip(); artHatch(g, [0, 400, W + 300, H - 100], { angle: -.9, gap: 5, w: .8, col: '#141018', a: .16, seed: 4, broken: .35 }); g.restore();
    stipple(c, { k: .3, g: 1, seed: 6, mid: false, boost: 1 });
    return c;
  });
}
function sheetBase() {
  return once('c10-sheet', () => {
    const pad = 60, [c, g] = canvas(SW + pad * 2, SH + pad * 2); g.translate(pad, pad);
    const edge = []; { const rr = prng(11); for (const [x, y] of [[0, 0], [SW, 0], [SW, SH], [0, SH]]) edge.push([x + (rr() - .5) * 4, y + (rr() - .5) * 4]); }
    g.save(); g.shadowColor = 'rgba(10,6,10,.6)'; g.shadowBlur = 40; g.shadowOffsetX = 18; g.shadowOffsetY = 26; g.beginPath(); roughPath(g, edge, { amp: 1.4, step: 9, seed: 3 }); g.fillStyle = '#e9dfc7'; g.fill(); g.restore();
    g.beginPath(); roughPath(g, edge, { amp: 1.4, step: 9, seed: 3 }); const pg = g.createRadialGradient(SW * .7, SH * .1, 0, SW * .5, SH * .5, SW * .8); pg.addColorStop(0, '#fbf3e1'); pg.addColorStop(.6, '#efe5cd'); pg.addColorStop(1, '#d8c7a4'); g.fillStyle = pg; g.fill();
    g.save(); g.clip(); fibreFill(g, .6); rosette(g, SW * .5, SH * .52, { R: 300, A: 44, B: 20, n: 30, m: 11, lines: 60, col: '#9a7a4a', w: .4, a: .12 }); g.restore();
    gBorder(g, 18, 18, SW - 36, SH - 36, { band: 40, lines: 10, waves: 150, col: '#28405a', w: .75, a: .72, radius: 24 });
    gBorder(g, 72, 72, SW - 144, SH - 144, { band: 14, lines: 5, waves: 260, col: '#8a5a24', w: .55, a: .65, radius: 12 });
    for (const [cx, cy] of [[140, 140], [SW - 140, 140], [140, SH - 140], [SW - 140, SH - 140]]) rosette(g, cx, cy, { R: 40, A: 12, B: 5, n: 14, m: 5, lines: 20, col: '#28405a', w: .55, a: .8 });
    microtext(g, 360, 268, SW - 720, 'ONE EQUAL SHARE FOR EVERY PERSON ON EARTH · AGREED BEFORE THE FORTUNE EXISTS', { size: 6.5, col: '#28405a', a: .75 });
    text(g, 'SIGNATURE', SIG.x0, SIG.y + 30, { size: 14, weight: 600, color: 'rgba(40,64,90,.6)', spacing: 5 });
    g.strokeStyle = 'rgba(40,64,90,.6)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(SIG.x0 - 34, SIG.y - 18); g.lineTo(SIG.x0 - 20, SIG.y - 4); g.moveTo(SIG.x0 - 20, SIG.y - 18); g.lineTo(SIG.x0 - 34, SIG.y - 4); g.stroke();
    stipple(c, { k: .2, g: 1, seed: 8, mid: false, boost: 1 });
    return { c, pad };
  });
}
function titleLayers() {
  return once('c10-title', () => {
    const size = 128, w = 640, h = 170, mk = (fill) => { const [c, x] = canvas(w, h); x.font = `${size}px "Instrument Serif"`; try { x.letterSpacing = '4px'; } catch { } x.textAlign = 'center'; x.fillStyle = fill(x); x.fillText('The rule', w / 2, 128); return c; };
    const foil = mk((x) => { const g = x.createLinearGradient(0, 30, w, 140); ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'].forEach((col, i) => g.addColorStop(i / 4, col)); return g; });
    return { w, h, foil, shadow: mk(() => 'rgba(40,20,8,1)'), dots: (() => { const [c, x] = canvas(w, h); x.font = `${size}px "Instrument Serif"`; try { x.letterSpacing = '4px'; } catch { } x.textAlign = 'center'; x.strokeStyle = 'rgba(40,64,90,.55)'; x.lineWidth = 1.3; x.setLineDash([.1, 5]); x.lineCap = 'round'; x.strokeText('The rule', w / 2, 128); return c; })() };
  });
}
// the sheet in sheet units (0..SW, 0..SH), drawn into the current transform
function drawSheet(ctx, t, o) {
  const B = sheetBase(); ctx.drawImage(B.c, -B.pad, -B.pad);
  // title: dotted until it is engraved (7.02b "rule"), then foil with a slow glint
  const TL = titleLayers(), tx = SW / 2 - TL.w / 2, ty = 70, tu = o.title ?? 1;
  if (tu < 1) { ctx.save(); ctx.globalAlpha = .8 * (1 - tu); ctx.drawImage(TL.dots, tx, ty); ctx.restore(); }
  if (tu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(tx, ty, TL.w * clamp(tu * 1.02), TL.h); ctx.clip(); ctx.globalAlpha = .5; ctx.drawImage(TL.shadow, tx + 2, ty + 3); ctx.globalAlpha = 1; ctx.drawImage(TL.foil, tx, ty);
    maskedGlint(ctx, TL.foil, tx, ty, t, { x: tx, y: ty + 80, span: TL.w + 200, width: 90, speed: .12, phase: .2, a: 1.1 }); ctx.restore();
    if (tu < 1) burinTip(ctx, tx + TL.w * tu, ty + 96, -.1, t, { size: 16, seed: 2 }); }
  // the guide lines for the text (dotted ghost), the signature line, a ghost seal (not binding yet)
  const ga = o.guides ?? 1;
  if (ga > 0) for (let i = 0; i < 3; i++) if (!(o.lines && o.lines[i])) ghostLine(ctx, [[LINE_X - 10, LINES_Y[i] + 11], [SW - LINE_X + 10, LINES_Y[i] + 11]], { ghost: 1, col: '#28405a', w: 1.5, a: .62 * clamp(ga * 3 - i), dot: 6.5, t });
  const sigU = o.sig ?? 0;
  if (ga > 0) ghostLine(ctx, [[SIG.x0, SIG.y], [SIG.x1, SIG.y]], { ghost: 1, burin: sigU > 0 ? sigU : null, col: sigU > 0 ? '#b8641e' : '#28405a', w: sigU > 0 ? 3 : 1.9, a: (sigU > 0 ? .95 : .75) * clamp(ga * 2), dot: 7.5, t, glow: sigU > 0 ? '#ffb35c' : null, noTip: true });
  if (ga > 0) { ctx.save(); ctx.globalAlpha = clamp(ga * 2) * .55; ctx.setLineDash([.1, 6]); ctx.lineCap = 'round'; ctx.strokeStyle = '#8a5a24'; ctx.lineWidth = 1.3; ctx.beginPath(); for (let i = 0; i <= 180; i++) { const a = i / 180 * TAU, q = 84 * (1 + .04 * Math.cos(30 * a)); i ? ctx.lineTo(1260 + Math.cos(a) * q, 790 + Math.sin(a) * q) : ctx.moveTo(1260 + Math.cos(a) * q, 790 + Math.sin(a) * q); } ctx.stroke(); ctx.beginPath(); ctx.arc(1260, 790, 62, 0, TAU); ctx.stroke(); ctx.restore(); }
  // the text: each line engraves word by word with the voice
  const fronts = [];
  if (o.lines) o.lines.forEach((ws, i) => { if (ws && ws.length) fronts.push(engraveWords(ctx, ws, LINE_X, LINES_Y[i], { t, size: 56, ink: '#1f2a3a', hold: o.hold || [], baseW: SW - 2 * LINE_X + 20 })); });
  return fronts;
}
// sheet placement on screen for the close-up: centre, scale, a slight turn; `rise` moves the camera up and back (the last image)
function sheetXform(t, o) { const rise = o.rise ?? 0, z = mix(1, .84, rise) * (1 + .006 * Math.sin(t * .4)), x = 960 + drift(t, 5, 1), y = 520 + drift(t, 3, 2) + 70 * rise; return { x, y, z, rot: -.035 + .004 * Math.sin(t * .3) }; }
export const SHEET = { SW, SH, SIG, LINES_Y, LINE_X };
export function ruleSheet(ctx, t, o = {}) {
  const t0 = o.t0 ?? 0, X = sheetXform(t, o), sc = X.z * .92;
  ctx.drawImage(ledge(), -150 + drift(t, 4, 3) * .5, -150 - 160 + 90 * (o.rise ?? 0) + drift(t, 3, 4) * .5);
  // the light of the rosette: a warm raking light from the upper right, sweeping slowly across (7.10)
  const sweep = o.sweep ?? 0;
  ctx.save(); ctx.translate(X.x, X.y); ctx.rotate(X.rot); ctx.scale(sc, sc); ctx.translate(-SW / 2, -SH / 2);
  let st = {};
  if (o.mode === 'intro') {
    const rg = o.ring ?? t0, u = clamp((t - rg) / .8), titleU = clamp((t - (o.rule ?? t0 + .3)) / .55), guides = clamp((t - (o.rule ?? t0 + .3) - .3) / .9);
    // the ring arrives as a circle and relaxes into the sheet's border (superellipse 2 → 9), then the engraved border takes over
    drawSheet(ctx, t, { title: titleU, guides, lines: null });
    if (u < 1) { const e = eio(u), rx = mix(1200, SW / 2 - 38, e), ry = mix(1200, SH / 2 - 38, e); ctx.save(); ctx.globalCompositeOperation = 'source-over'; ring(ctx, SW / 2, SH / 2, rx, ry, { p: mix(2, 9, e), lines: 8, band: 26, wave: 46, col: '#b8641e', glow: null, op: 'source-over', lineA: 1, a: .85 * (1 - sm(lin(.75, 1, u))), lw: 1.2 }); ctx.restore(); }
    // the pen hovers over the first line on "written", never touching (its shadow stays apart)
    const w0 = o.written ?? t0 + 1.4, pu = eout(clamp((t - (w0 - .7)) / .8)), back = sm(clamp((t - w0 - .9) / 1.6));
    if (pu > 0) { const px = mix(1500, 640, pu) + 50 * back + Math.sin(t * 1.1) * 6, py = mix(640, 440, pu) - 20 * back + Math.sin(t * 1.4) * 4; pen(ctx, px, py, 1.35, { ang: .62, t, lift: .95 }); }
  } else {
    st = drawSheet(ctx, t, { title: 1, guides: 1, lines: o.lines, hold: ['now,'], sig: o.sig ?? 0 });
  }
  ctx.restore();
  // raking light (soft-light + a little lighter), moving with the sweep
  { const lx = mix(1700, 300, sweep), L = sprite('c10-rake', 900, [[0, 'rgba(255,214,150,.5)'], [.4, 'rgba(255,190,120,.16)'], [1, 'rgba(255,180,110,0)']], .6);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .3; ctx.drawImage(L, lx - 900, -500); ctx.restore(); }
  const vg = ctx.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 1250); vg.addColorStop(0, 'rgba(14,10,18,0)'); vg.addColorStop(1, 'rgba(14,10,18,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  // map a sheet point to the screen (for the pen and the hands)
  const toScr = (px, py) => { const c = Math.cos(X.rot), s = Math.sin(X.rot), qx = (px - SW / 2) * sc, qy = (py - SH / 2) * sc; return [X.x + qx * c - qy * s, X.y + qx * s + qy * c]; };
  return { toScr, sc, fronts: st };
}
// the pen held by two hands (yours: ochre sleeve; hers: petrol sleeve) — drawn in screen space at the nib point
export function twoHandsPen(ctx, t, nib, o = {}) {
  const lift = o.lift ?? 0, reach = clamp(o.reach ?? 1), reach2 = clamp((o.reach ?? 1) * 1.3 - .3), sc = o.sc ?? 1, pang = .62, ps = 1.35 * sc;
  const off = 1 - eout(reach), nx = nib[0] + off * 520 * sc, ny = nib[1] + off * 700 * sc;
  pen(ctx, nx, ny, ps, { ang: pang, t, lift });
  const ly = ny - lift * 14 * ps, gx = nx + Math.cos(pang) * 58 * ps, gy = ly + Math.sin(pang) * 58 * ps;
  const hs = 1.3 * sc, hang = pang + Math.PI, tip = handTip(0, 0, hs, { pose: 'write', ang: hang, t, seed: 1 });
  const wx = gx - tip[0], wy = gy - tip[1];
  hand(ctx, wx, wy, hs, { pose: 'write', ang: hang, skin: '#b98262', sleeve: '#2a3350', rim: '#ffe0b0', light: [.6, -1], t, seed: 1, sleeveLen: 460 });
  // the ochre of your scarf at the cuff (the accent)
  { const ca = Math.atan2(wy - gy, wx - gx); ctx.save(); ctx.translate(wx + Math.cos(ca) * 40 * sc, wy + Math.sin(ca) * 40 * sc); ctx.rotate(ca); ctx.fillStyle = '#c8843a'; ctx.fillRect(0, -34 * sc, 12 * sc, 68 * sc); ctx.restore(); }
  if (reach2 > 0) {
    const off2 = 1 - eout(reach2), hs2 = 1.15 * sc, hang2 = -.78, [px, py] = palmPos(wx, wy, hs, { pose: 'write', ang: hang, t, seed: 1 }), tip2 = handTip(0, 0, hs2, { pose: 'reach', ang: hang2, close: .62, t, seed: 4 });
    const hx = px + 6 * sc - tip2[0] - off2 * 640 * sc, hy = py + 4 * sc - tip2[1] + off2 * 620 * sc;
    hand(ctx, hx, hy, hs2, { pose: 'reach', ang: hang2, close: .62, skin: '#8d5f40', sleeve: '#1f6a6e', rim: '#ffe0b0', light: [.6, -1], t, seed: 4, sleeveLen: 460 });
  }
}

// ---------------------------------------------------------------- 7.05–7.06 the city at sunrise, the rosette that belongs to no one yet
const ROS = { x: 1150, y: 600 };
function citySky() {
  return once('c10-dsky', () => {
    // canvas y = world y + 150; the gold band sits on the horizon (world ~700–780), the zenith is still blue
    const [c, g] = canvas(W + 400, H + 300), lg = g.createLinearGradient(0, 0, 0, H + 300);
    [[0, '#131a36'], [.25, '#28345e'], [.41, '#5d5a88'], [.51, '#b5869a'], [.6, '#efab8a'], [.67, '#ffd08a'], [1, '#f3b27a']].forEach(([p, col]) => lg.addColorStop(p, col)); g.fillStyle = lg; g.fillRect(0, 0, W + 400, H + 300);
    const r = prng(3); for (let i = 0; i < 70; i++) { const x = r() * (W + 400), y = Math.pow(r(), 1.7) * 330; g.fillStyle = `rgba(230,236,255,${.12 + .4 * r() * (1 - y / 350)})`; g.fillRect(x, y, 1.3, 1.3); }
    const n = vnoise(5); for (const [y, x0, x1, th, a] of [[420, 60, 1100, 26, .38], [520, 900, 2300, 20, .4], [330, 1300, 2300, 16, .3], [610, 200, 1500, 14, .32]]) { g.save(); g.globalAlpha = a; g.beginPath(); g.moveTo(x0, y); for (let x = x0; x <= x1; x += 14) g.lineTo(x, y - th * (.4 + .6 * fbm(n, x * .004, y, 3)) * Math.sin(Math.PI * (x - x0) / (x1 - x0))); g.lineTo(x1, y + 6); g.lineTo(x0, y + 6); g.closePath(); const cg = g.createLinearGradient(0, y - th, 0, y + 6); cg.addColorStop(0, y > 500 ? '#c98c94' : '#6c5f84'); cg.addColorStop(1, y > 500 ? '#f0b49a' : '#e9b4a4'); g.fillStyle = cg; g.fill(); g.clip(); artHatch(g, [x0, y - th, x1 - x0, th + 10], { angle: -.04, gap: 4, w: .8, col: '#4a4068', a: .25, seed: y, broken: .3 }); g.restore(); }
    stipple(c, { k: .35, g: 1, seed: 7, mid: false, boost: 1 });
    return c;
  });
}
// my own skyline (the roofs are recorded, so the small figures can stand on them); canvas y = world y + 150, x = world x + 300
function skyline(key, seed, ground, hMin, hMax, wMin, wMax, col, lit, haze, litA = .2) {
  return once(key, () => {
    const w = W + 600, [c, g] = canvas(w, H + 300), [cl, gl] = canvas(w, H + 300), r = prng(seed), roofs = [];
    for (let x = -40; x < w + 40;) {
      const bw = wMin + r() * (wMax - wMin), bh = hMin + (hMax - hMin) * Math.pow(r(), 1.5), top = ground - bh, kind = r(), step = kind > .7 && bw > wMin * 1.4 ? bh * (.12 + r() * .12) : 0;
      const shape = (q) => { q.beginPath(); q.moveTo(x, ground + 400); q.lineTo(x, top + step); if (step) { q.lineTo(x + bw * .22, top + step); q.lineTo(x + bw * .22, top); q.lineTo(x + bw * .78, top); q.lineTo(x + bw * .78, top + step); } else if (kind < .12) { q.lineTo(x + bw * .5, top - bw * .3); } q.lineTo(x + bw, top + step); q.lineTo(x + bw, ground + 400); q.closePath(); };
      shape(g); g.fillStyle = col; g.fill();
      g.save(); g.clip(); for (let yy = top + 12; yy < ground + 300; yy += 14) for (let xx = x + 7; xx < x + bw - 7; xx += 11) if (r() < .1) { g.fillStyle = r() < .8 ? 'rgba(255,206,150,.72)' : 'rgba(200,215,255,.45)'; g.fillRect(xx, yy, 3, 5); }
      artHatch(g, [x, top, bw, ground + 400 - top], { angle: -1.2, gap: 4.5, w: .7, col: '#05060e', a: .16, seed: x | 0, broken: .3 }); g.restore();
      // the lit version: the side toward the rosette takes a little warm light, a bright rim on that edge and on the roof line
      shape(gl); const dir = Math.sign(ROS.x + 300 - (x + bw / 2)), lg = gl.createLinearGradient(x, 0, x + bw, 0);
      lg.addColorStop(0, dir < 0 ? rgba(lit, litA) : 'rgba(0,0,0,0)'); lg.addColorStop(1, dir > 0 ? rgba(lit, litA) : 'rgba(0,0,0,0)'); gl.fillStyle = lg; gl.fill();
      gl.fillStyle = rgba(lit, .85); gl.fillRect(dir > 0 ? x + bw - 2 : x, top + step, 2, Math.min(220, bh)); gl.fillRect(step ? x + bw * .22 : x, top - 1, step ? bw * .56 : bw, 2);
      if (kind >= .12 && bw > wMin * 1.2) roofs.push(step ? [x + bw * .28, x + bw * .72, top] : [x + bw * .15, x + bw * .85, top]);
      if (r() < .3 && kind >= .12) { const tx = x + bw * (.2 + r() * .5); g.fillStyle = col; g.fillRect(tx, top - 24, 20, 20); g.fillRect(tx + 3, top - 4, 2.5, 6); g.fillRect(tx + 14, top - 4, 2.5, 6); if (r() < .5) g.fillRect(tx + 30, top - 46, 1.6, 46); }
      x += bw * (.8 + r() * .3);
    }
    if (haze) { const hg = g.createLinearGradient(0, ground - 160, 0, ground + 60); hg.addColorStop(0, rgba(haze, 0)); hg.addColorStop(1, rgba(haze, .75)); g.fillStyle = hg; g.fillRect(0, ground - 160, w, 500); }
    stipple(c, { k: .3, g: 1, seed, mid: false, boost: 1 });
    // keep only the band that holds buildings (cheaper to composite every frame)
    const y0 = Math.max(0, Math.floor(ground - hMax - 80)), crop = (src) => { const [k, kg] = canvas(w, H + 300 - y0); kg.drawImage(src, 0, -y0); return k; };
    return { c: crop(c), cl: crop(cl), roofs, y0 };
  });
}
const FAR = () => skyline('c10-far', 31, 930, 30, 150, 30, 90, '#6b6488', '#ffe0b0', '#e9b08e', .14);
const MIDL = () => skyline('c10-mid', 47, 1080, 70, 270, 60, 150, '#363a60', '#ffd08a', '#a08aa0', .18);
const NEAR = () => skyline('c10-near', 59, 1320, 150, 330, 120, 240, '#181d35', '#ffc070', null, .2);
// the hook's rosette (C1's H.04 guilloche, copied: same three layers) — lace at low alpha, cached, drawn scaled
const RM = 640, ROSG = [{ R: RM, A: 62, B: 30, n: 48, m: 13, lines: 64, col: '#fff1d6', w: 1.1, a: .5 }, { R: RM * .66, A: 52, B: 20, n: 30, m: 11, lines: 52, col: '#ffc887', w: 1, a: .55 }, { R: RM * .31, A: 32, B: 14, n: 16, m: 7, lines: 40, col: '#ffe0b0', w: .9, a: .65 }];
const GHN = [12, 8, 6];
function rosSolid(i) { const P = ROSG[i]; return once('c10-rs' + i, () => { const ext = P.R + P.A + P.B + 8, [c, g] = canvas(ext * 2, ext * 2); g.globalCompositeOperation = 'lighter'; rosette(g, ext, ext, { ...P, steps: 900 }); return c; }); }
function rosLines(i) { return once('c10-rl' + i, () => { const P = ROSG[i], G = guilloche({ ...P, lines: GHN[i], steps: 320 }); const out = []; for (let k = 0; k < GHN[i]; k++) out.push(G.line(k)); return out; }); }
const OUT_R = 760;
function outerRing() { return once('c10-outer', () => { const pts = []; for (let i = 0; i <= 900; i++) { const a = -Math.PI / 2 - .6 + i / 900 * TAU, r = OUT_R + 14 * Math.sin(a * 72) + 6 * Math.sin(a * 144 + 1); pts.push([Math.cos(a) * r, Math.sin(a) * r]); } return pts; }); }
function coreBloom() { return once('c10-core2', () => { const R = 620, [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,230,190,.62)'); rg.addColorStop(.18, 'rgba(255,194,128,.24)'); rg.addColorStop(.55, 'rgba(255,170,100,.06)'); rg.addColorStop(1, 'rgba(255,170,100,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .6, g: 1.2, seed: 9, boost: 2 }); return c; }); }
function cityRays() {
  return once('c10-rays2', () => {
    const S = 800, [c, g] = canvas(S * 2, S * 2), r = prng(31); g.filter = 'blur(6px)';
    for (let i = 0; i < 22; i++) { const a = -Math.PI + TAU * (i + r() * .7) / 22, sp = .02 + r() * .035, L = 750 + r() * 150, lg = g.createRadialGradient(S, S, 80, S, S, L); lg.addColorStop(0, 'rgba(255,232,196,.10)'); lg.addColorStop(1, 'rgba(255,232,196,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(S, S); g.arc(S, S, L, a - sp, a + sp); g.closePath(); g.fill(); }
    g.filter = 'none'; stipple(c, { k: .8, g: 1.2, seed: 32 }); return c;
  });
}
const RO_C = OUT_R * .6;
function outerSolid() { return once('c10-outs', () => { const e = Math.ceil(RO_C + 60), [c, g] = canvas(e * 2, e * 2); g.translate(e, e); g.globalCompositeOperation = 'lighter'; ring(g, 0, 0, RO_C, RO_C, { lines: 7, band: 22, wave: 30, col: '#fff1d6', glow: '#ffb35c', glowA: .12, a: 1, lw: .8 }); return c; }); }
function microSolid() { return once('c10-micro', () => { const e = Math.ceil(RO_C * 1.09 + 30), [c, g] = canvas(e * 2, e * 2); microRing(g, e, e, RO_C * 1.09, 'EVERYONE', { size: 15, col: '#fff1d6', a: .95 }); return c; }); }
function fogBand() { return once('c10-fog', () => { const [c, g] = canvas(W + 400, 420); g.translate(0, -640); fog(g, { y0: 700, y1: 1000, col: '#ffd2b0', a: .32, seed: 11, sx: .0016, sy: .012, cover: .6, soft: .4, k: .5, x1: W + 400 }); return c; }); }
// camera: wide (7.05) → approach one ring (7.05a) → the long pull back as the rosette rises (7.06) → a small tilt down to the parapet
function cityCam(t, o) {
  const t0 = o.t0 ?? 0, yet = o.yet ?? t0 + 3.4, which = o.which ?? t0 + 5, fall = o.fall ?? t0 + 8;
  const near = quart(lin(yet - 1.7, yet - .05, t)), wide = quart(lin(which - .1, which + 3.3, t)), down = eio(clamp((t - fall + .2) / 1.5));
  return { near, wide, zz: mix(mix(1.0, 1.35, near), .92, wide), fx: mix(mix(ROS.x - 70, ROS.x, near), 990, wide) + (t - t0) * 4, fy: mix(mix(560, 365, near), 520, wide) + 200 * down, dx: drift(t, 7, 1), dy: drift(t, 4, 2) };
}
const FG = { py: 1080, sx: 780 };
// screen point of the sheet on the foreground parapet (the zoom point into 7.07)
export function cityAnchor(t, o = {}) { const c = cityCam(t, o); return [W / 2 + (FG.sx - c.fx - c.dx * 1.1) * c.zz, H / 2 + (FG.py - 2 - c.fy - c.dy * 1.1) * c.zz]; }
export function dawnCity(ctx, t, o = {}) {
  let __t = performance.now(); const PR = (k) => { ctx.getImageData(0, 0, 1, 1); const n = performance.now(); globalThis.__P[k] = (globalThis.__P[k] || 0) + n - __t; __t = n; };
  const t0 = o.t0 ?? 0, yet = o.yet ?? t0 + 3.4, which = o.which ?? t0 + 5, every = o.every ?? t0 + 7, fall = o.fall ?? t0 + 8;
  const { zz, fx, fy, dx, dy, near } = cityCam(t, o);
  const rise = eio(clamp((t - which) / 3.4)), light = sm(clamp((t - which - .2) / 2.4)), ry = ROS.y - 140 * rise, RS = mix(.5, .6, rise);
  const cam = (p) => { ctx.translate(W / 2, H / 2); ctx.scale(zz, zz); ctx.translate(-fx - dx * p, -fy - dy * p); };
  ctx.save(); cam(.2); ctx.drawImage(citySky(), -200, -150); ctx.restore(); PR('sky');
  // ---- the rosette: dotted ghost (unclaimed, the wind moves through it) → one ring engraves on "Yet" → all of it engraves and rises
  const wind = .07 + .05 * Math.sin(t * .7), burn = clamp((t - which) / 2.4), solid = sm(clamp((t - which - .3) / 2.2));
  const spin = (t - t0) * .012 + .3 * eio(clamp((t - yet) / 2.5)) + .45 * eio(clamp((t - which) / 4));
  ctx.save(); cam(.25); ctx.translate(ROS.x, ry);
  { const B = coreBloom(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .2 + .8 * light; const k = RS * (1.1 + .5 * light); ctx.drawImage(B, -620 * k, -620 * k, 1240 * k, 1240 * k); ctx.restore(); }
  if (light > 0) { const Rz = cityRays(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = light * .9; ctx.rotate(t * .01); ctx.drawImage(Rz, -1600, -1600, 3200, 3200); ctx.restore(); } PR('bloom+rays');
  ctx.save(); ctx.scale(RS, RS); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) {
    const P = ROSG[i], rot = spin * [1, -1.6, 2.2][i] + i;
    ctx.save(); ctx.rotate(rot);
    if (solid > 0) { const S = rosSolid(i), e = S.width / 2; ctx.globalAlpha = solid * (.16 + .1 * light) * [1, 1.1, 1.25][i] / .5 * .5; ctx.drawImage(S, -e, -e); ctx.globalAlpha = 1; }
    if (burn < 1) ghostPaths(ctx, rosLines(i), { ghost: 1, burin: t > which ? burn : null, smoke: t > which ? 0 : wind * (1 - near), col: P.col, w: 1.3 / RS, a: .85, dot: 6.5 / RS, t, stagger: .55, tips: 2, glow: null, tipSize: 10 / RS });
    ctx.restore();
  }
  ctx.restore(); PR('rosette');
  // the outer ring: dotted, then engraved on "Yet" (the first piece that is agreed), catching foil; later the microtext EVERYONE
  { const P = outerRing(), yu = clamp((t - yet + .08) / .75), gl = Math.exp(-Math.pow((t - yet - .6) / .35, 2)), RO = OUT_R * RS;
    ctx.save(); ctx.rotate(spin * .5); ctx.scale(RS, RS); ctx.globalCompositeOperation = 'lighter';
    ghostLine(ctx, P, { ghost: 1, burin: yu > 0 ? yu : null, col: '#fff1d6', w: (1.6 + gl * 1.4) / RS, a: .9, dot: 8 / RS, t, glow: '#ffb35c', tipSize: 15 / RS, smoke: yu > 0 ? 0 : wind * .6 });
    ctx.restore();
    if (yu >= 1 || gl > .01) { const S = outerSolid(), e = S.width / 2, k = RO / RO_C; ctx.save(); ctx.rotate(spin * .5 + t * .01); ctx.scale(k, k); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, .45 + .6 * gl) * (yu >= 1 ? 1 : gl); ctx.drawImage(S, -e, -e); ctx.restore(); }
    const eu = clamp((t - every + .1) / 1.1); if (eu > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, RO * 1.3, -Math.PI / 2, -Math.PI / 2 + TAU * eu); ctx.closePath(); ctx.clip(); { const S = microSolid(), e = S.width / 2, k = RO / RO_C; ctx.save(); ctx.rotate(-spin * .3); ctx.scale(k, k); ctx.drawImage(S, -e, -e); ctx.restore(); }
      const k = Math.exp(-Math.max(0, t - every - .2) * 1.2); if (k > .02) { const a2 = -Math.PI / 2 + TAU * eu; foilGlint && ctx.save(); const hx = Math.cos(a2) * RO * 1.09, hy = Math.sin(a2) * RO * 1.09, hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 70); hg.addColorStop(0, `rgba(255,241,214,${.9 * k})`); hg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = hg; ctx.fillRect(hx - 70, hy - 70, 140, 140); ctx.restore(); }
      ctx.restore(); }
  }
  ctx.restore(); PR('outer');
  // ---- the city in three depths, haze between; the lit version fades in as the light reaches each depth
  const Fr = FAR(), Md = MIDL(), Nr = NEAR();
  const layer = (Lr, p, lt0) => { ctx.save(); cam(p); ctx.drawImage(Lr.c, -300, -150 + Lr.y0); const a = sm(clamp((t - which - lt0) / 1.6)); if (a > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(Lr.cl, -300, -150 + Lr.y0); } ctx.restore(); };
  layer(Fr, .35, .2); PR('far');
  ctx.save(); cam(.45); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55 + .35 * light; ctx.drawImage(fogBand(), -200 - (t - t0) * 3, -150 + 640); ctx.restore(); PR('fog1');
  layer(Md, .6, .6); PR('mid');
  // the small figures on the roofs, they turn their heads up as the light reaches them
  const figs = (Lr, p, s, every0, seed) => { const r = prng(seed); ctx.save(); cam(p);
    for (const [x0, x1, y] of Lr.roofs) { if (r() < .3) continue; const n = 1 + Math.floor(r() * 3); for (let k = 0; k < n; k++) { const x = -300 + mix(x0, x1, (k + .5) / n + (r() - .5) * .15), yy = y - 150, look = sm(clamp((t - every0 - Math.abs(x - ROS.x) / 2400) / .7)); const dir = x < ROS.x ? 1 : -1;
      figureFlat(ctx, x, yy - 90 * s, s, { head: mix(.05, -.45, look), sh: [.1 + .2 * look * r(), .06], el: [.2, .2], lean: -.04 * look }, { t, seed: k + x | 0, col: '#0e1124', rim: light > .05 ? '#ffd9a0' : null, rimSide: dir, flip: dir < 0, fast: true, shadow: false }); } }
    ctx.restore(); };
  figs(Md, .6, .2, which + .9, 5); PR('figsMid');
  ctx.save(); cam(.7); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 + .25 * light; ctx.drawImage(fogBand(), -260 + (t - t0) * 4, 640); ctx.restore(); PR('fog2');
  layer(Nr, .85, 1); PR('near');
  figs(Nr, .85, .34, which + 1.2, 9); PR('figsNear');
  // ---- the foreground: our parapet, the two friends sitting on it (silhouettes), the sheet on the ledge catching the light at the end
  const fgA = sm(clamp((t - which - .5) / 2.5));
  let sheetPt = [W / 2, H];
  if (fgA > 0) { ctx.save(); cam(1.1); const py = FG.py, sx = FG.sx;
    ctx.fillStyle = '#0b0d1a'; ctx.fillRect(-400, py, W + 1200, 500); ctx.fillStyle = `rgba(255,214,160,${.45 * light})`; ctx.fillRect(-400, py, W + 1200, 2.5);
    const lk = sm(clamp((t - every) / 1));
    for (const [x, flip, seed, acc] of [[600, false, 2, '#c8843a'], [1000, true, 4, '#1f6a6e']]) figureFlat(ctx, x, py - 4, 1.05, { ...POSES.sit, head: mix(.05, -.3, lk), sh: [.55, .45], el: [.9, .9] }, { t, seed, col: '#0c0e1c', rim: '#ffd9a0', rimSide: flip ? -1 : 1, flip, accent: acc, accentPart: flip ? 'sweater' : 'scarf', shadow: false });
    const lit = sm(clamp((t - fall) / .7)); ctx.fillStyle = `rgb(${mix(60, 245, lit) | 0},${mix(56, 226, lit) | 0},${mix(66, 196, lit) | 0})`; ctx.save(); ctx.translate(sx, py - 2); ctx.scale(1, .3); ctx.fillRect(-46, -36, 92, 64); ctx.restore();
    if (lit > 0) { const B = sprite('c10-warm', 420, [[0, 'rgba(255,220,170,.5)'], [.3, 'rgba(255,190,130,.12)'], [1, 'rgba(255,190,130,0)']]); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = lit * .8; ctx.drawImage(B, sx - 420, py - 420); }
    ctx.restore();
    sheetPt = [W / 2 + (sx - fx - dx * 1.1) * zz, H / 2 + (py - 2 - fy - dy * 1.1) * zz];
  }
  PR('fg');
  const vg = ctx.createRadialGradient(W * .55, H * .5, 380, W * .55, H * .5, 1300); vg.addColorStop(0, 'rgba(10,10,24,0)'); vg.addColorStop(1, 'rgba(10,10,24,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return { sheet: sheetPt };
}
