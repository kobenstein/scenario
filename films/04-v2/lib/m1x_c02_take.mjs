// C02 (Film 4 minute 1, shots 2.01–2.07) · the take: ONE camera through two worlds, every frame a pure function of t, no blend anywhere.
// Owner: c02 (scenes/sc02.mjs). Times in the comments are v2 seconds for reading only; everything is anchored to VO words.
//
//   c02Take(T, R) → { A, draw(ctx, t), print, warm() }      draw = the whole chunk (b12 before the bridge's b, b23 from c02>c03's a)
//
// 25.47–26.40  b12 (lib/m1x_bridge.mjs): c01's wall is the picture on a sheet floating in the dark of a hall.
// 26.40        the same sheet, now in c02's world (camera C0 = the bridge's landing framing; nothing of the stage is in view yet).
// "daydream"   the picture's lines leave as dots: each dot lifts off the sheet (the sheet's own paper shows where it was), drifts up
//              as smoke; on "But" the dots gather into the beam of a spotlight. The camera pulls back (1.8 s) and reveals the hall:
//              truss, a lectern with a speaker (figure kit), a big screen, the audience. The blank sheet glides down the beam onto
//              the lectern (his notes). The screen powers on on "building" (a line opening into the keynote rosette), the speaker
//              points at it: the stage is lit and alive through "are now saying it on stage" (comment 2: no black screen).
// "stage."     the camera pushes into the screen; the screen switches to clip M (a line closes, opens on the clip's first frame,
//              pillarboxed over its own blurred copy); the clip plays full size on the screen (31.85–34.32) with a lower third.
// after M      the picture collapses into a hot line (a CRT turning off) while the camera pushes into the dark glass until it fills
//              the frame; the glass reflects the same night as the ruler world, so at 34.78 the frame is night + line in both worlds.
// "He gives"   the line opens into the engraved ruler, a burin cuts the scale; amber bracket on "ten", dotted decade on "twenty".
// "condition"  the dotted years gather into a ring, a burin engraves the IF seal round, it lands on the ruler.
// "If AI …"    one slab per beat slides out of the seal / out from behind the step below; the camera climbs; the light above grows.
// "He thinks"  dotted ghost steps, engraved solid one after another up to the light; the camera flies into the light, which is
//              exactly b23 (W/2, H/2, R_FULL, zero velocity) at c02>c03's a (44.48).
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, lin, sm, eio, eout, ein, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { clipScreen, ROOT } from './kit.mjs';
import { ghostLine, burinTip } from './ghost.mjs';
import { figure, reachArm } from './figure.mjs';
import { toImg, best, ready } from './sc01_m1_open.mjs';
import { wallShot } from './sc01_m1_world.mjs';
import { bridgeWin, b12, b12K, b23, pose12, sheet12, lightAt, R_FULL, B23, DEPTH, warm as warmBridge } from './m1x_bridge.mjs';
import { nightBG, motes, VIG, SHEET, STAGE, trussImg, truss, floorImg, floorR, lectern, screenBG, ringImg, audienceRow,
  RULER, yearX, rulerLayer, ifSeal, STEP, slabLayer, warmKit, AMBER, CORE, CREAM, ICE, CYAN, TAU } from './sc02_m1.mjs';

const ss = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };   // smootherstep: camera moves from rest to rest
const sine = (x) => .5 - .5 * Math.cos(Math.PI * clamp(x));
const eo5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
const apply = (ctx, C) => { ctx.translate(W / 2, H / 2); ctx.scale(C.s, C.s); ctx.translate(-C.cx, -C.cy); };
const toS = (C, x, y) => [(x - C.cx) * C.s + W / 2, (y - C.cy) * C.s + H / 2];
// camera a → b as a zoom about their fixed point (the one world point that stays put on screen); u eased 0..1
function zoomFix(a, b, u) {
  const s = Math.exp(mix(Math.log(a.s), Math.log(b.s), u));
  if (Math.abs(a.s - b.s) < 1e-9) return { cx: mix(a.cx, b.cx, u), cy: mix(a.cy, b.cy, u), s };
  const qx = (a.cx * a.s - b.cx * b.s) / (a.s - b.s), qy = (a.cy * a.s - b.cy * b.s) / (a.s - b.s), k = a.s / s;
  return { cx: qx - (qx - a.cx) * k, cy: qy - (qy - a.cy) * k, s };
}
function label(ctx, s, x, y, o = {}) { ctx.save(); ctx.shadowColor = 'rgba(2,3,12,.85)'; ctx.shadowBlur = 12; text(ctx, s, x, y, { size: o.size ?? 18, weight: o.weight ?? 600, color: rgba(o.col || CREAM, o.alpha ?? .92), spacing: o.spacing ?? 5, align: o.align || 'left', font: o.font || 'Inter' }); ctx.restore(); }
// a label revealed (or erased) by a vertical edge that an in-world tool carries along: visible between x0 and x1 only
function wipeLabel(ctx, s, x, y, x0, x1, o = {}) { if (x1 <= x0) return; const z = o.size ?? 18; ctx.save(); ctx.beginPath(); ctx.rect(x0, y - z * 1.6, x1 - x0, z * 2.4); ctx.clip(); label(ctx, s, x, y, o); ctx.restore(); }
// the hot line of a screen turning on / off (screen space, additive: it reads the same whatever is drawn before or after it)
function hotLine(ctx, y, x0, x1, a) {
  if (a <= .002 || x1 <= x0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const band = (h, col, al) => { const g = ctx.createLinearGradient(0, y - h, 0, y + h); g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba(col, al)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x0, y - h, x1 - x0, h * 2); };
  band(48, AMBER, .1 * a); band(13, '#ffd9a8', .34 * a); band(2.4, '#fff6e6', .95 * a);
  ctx.restore();
}

export function c02Take(T, R) {
  const S0 = (p) => T.S('00c', p), E0 = (p) => T.E('00c', p), S1 = (p) => T.S('01a', p), E1 = (p) => T.E('01a', p);
  const B1 = bridgeWin('c01>c02', T), B2 = bridgeWin('c02>c03', T), clip = T.clip('M');
  const A = {
    t0: B1.cut, b: B1.b, day: S0('daydream'), dayE: E0('daydream'), but: S0('But'), building: S0('building'),
    onst: S0('on stage'), stageE: E0('on stage'), c0: clip.start, c1: clip.end,
    he: S1('He gives'), ten: S1('ten'), twenty: S1('twenty'), yearsE: E1('twenty years'),
    and: S1('And he adds'), cond: S1('condition'), condE: E1('condition'),
    if: S1('If AI'), ai: S1('AI and'), robots: S1('robots'), keep: S1('keep'), getting: S1('getting'), better: S1('better'), betterE: E1('better'),
    he2: S1('He thinks'), will: S1('will'), willE: E1('will'), ba: B2.a, cut: B2.cut, end: R.b,
  };
  Object.assign(A, {
    dep0: A.day + .02, dep1: A.day + .78,                        // the picture's dots leave (26.45–27.21)
    pb0: A.dayE - .26, gat0: A.but - .25, gl0: A.but - .1,       // pull-back from 27.05, dots gather into the beam from 27.30, the sheet glides from 27.45
    on0: A.building + .06,                                        // the screen powers on (28.25)
    push0: A.stageE - .45, push1: A.c0 + .1,                      // push into the screen (30.70–31.95)
    sw0: A.stageE - .05,                                          // the screen switches to the clip (31.10–31.56)
    glass0: A.c1 - .02, hand: A.c1 + .46,                        // push into the dark glass, hand-off to the ruler world (34.78)
    off0: A.c1 + .04,                                             // the clip's last frame collapses into the line (34.36–34.56)
    land: A.condE - .05,                                          // the seal lands on the ruler
    fly0: A.he2,                                                  // the camera flies into the light (43.08 → 44.48)
  });
  Object.assign(A, { pb1: A.pb0 + 1.8, gl1: A.gl0 + 1.15, on1: A.on0 + .3, swL: A.sw0 + .13, off1: A.off0 + .2, open0: A.hand + .07 });
  Object.assign(A, { sw1: A.swL + .05, sw2: A.swL + .33, rb0: A.he + .08, rb1: A.he + 1.08, gh0: A.betterE - .06, en0: A.he2 + .04 });
  A.steps = [A.if, A.ai, A.robots, A.keep, A.getting, A.better - .12, A.better + .16];   // one slab per beat, the last two on "better"

  // ════════════════ the stage world (2.01–2.03) ════════════════
  const SCR = STAGE.scr, SCC = [SCR.x + SCR.w / 2, SCR.y + SCR.h / 2], SG = 2.42, CYG = SCC[1] + (540 - RULER.y) / SG;
  const C0 = { cx: 330, cy: 290, s: 3 }, C1 = { cx: 960, cy: 540, s: 1 }, C1b = { cx: 992, cy: 522, s: 1.045 };
  const CP = { cx: SCC[0], cy: CYG, s: 2.0 }, CPb = { cx: SCC[0], cy: CYG, s: 2.07 }, CG = { cx: SCC[0], cy: CYG, s: SG };
  function stageCam(t) {
    let C;
    if (t < A.pb0) C = C0;
    else if (t < A.pb1) C = zoomFix(C0, C1, ss(lin(A.pb0, A.pb1, t)));
    else if (t < A.push0) C = zoomFix(C1, C1b, sine(lin(A.pb1, A.push0, t)));
    else if (t < A.push1) C = zoomFix(C1b, CP, ss(lin(A.push0, A.push1, t)));
    else if (t < A.glass0) C = zoomFix(CP, CPb, sine(lin(A.push1, A.glass0, t)));
    else C = zoomFix(CPb, CG, ss(lin(A.glass0, A.hand, t)));
    const amp = sm(lin(A.pb0, A.pb0 + .9, t)) * (1 - sm(lin(A.push1 - .2, A.push1 + .3, t)));   // hand-held drift on the stage only
    return amp > 0 ? { cx: C.cx + drift(t, 5, 3) * amp / C.s, cy: C.cy + drift(t, 3, 5) * amp / C.s, s: C.s } : C;
  }
  // the hall's dark: the night plate, far behind (small parallax, a little zoom); at C0 exactly the bridge's ground
  const stageBG = (t, C) => ({ dx: drift(t, 10, 2) - (C.cx - C0.cx) * C.s * .05, dy: drift(t, 6, 3) - (C.cy - C0.cy) * C.s * .05, s: Math.pow(C.s / C0.s, .2) });
  const beamI = (t) => ss(lin(A.gat0 + .1, A.gat0 + 1.15, t));                                          // the spot is made of the dots
  const scrI = (t) => ss(lin(A.on0, A.on1 + .15, t)) * (1 - sm(lin(A.c1 + .02, A.off1, t)));             // the screen's light in the hall

  // the sheet in the hall: where the bridge left it (pose12 at b, mapped back through C0), floating; then it glides down the beam
  const P12 = pose12(A.b, T), SH0 = { x: (P12.x - drift(A.b, 4, 1) - W / 2) / C0.s + C0.cx, y: (P12.y - drift(A.b, 3, 2) - H / 2) / C0.s + C0.cy, s: P12.s / C0.s };
  const floatW = (t) => ({ x: SH0.x + drift(t, 4, 1) / C0.s, y: SH0.y + drift(t, 3, 2) / C0.s, s: SH0.s, sy: SH0.s, r: -.032 + .006 * Math.sin(t * .6), lift: 1 });
  const LAND = { x: 471, y: 615, s: .134, f: .2, r: -.012 };   // lying on the lectern's reading top (foreshortened)
  function sheetW(t) {
    const F = floatW(t); if (t <= A.gl0) return F;
    const g = ss(lin(A.gl0, A.gl1, t)), arc = Math.sin(Math.PI * g), flat = ss(lin(.42, 1, g)), s = Math.exp(mix(Math.log(F.s), Math.log(LAND.s), g));
    return { x: mix(F.x, LAND.x, g) - 30 * arc, y: mix(F.y, LAND.y, g) - 10 * arc, s, sy: s * mix(1, LAND.f, flat), r: mix(F.r, LAND.r, g) + .16 * arc * (1 - flat), lift: 1 - ss(lin(.5, 1, g)) };
  }
  // the beam: from the spot's lens to the pool around the lectern
  const BL = [STAGE.spot.x + 4, STAGE.spot.y + 16], BP = [STAGE.pool.x, STAGE.pool.y], BAX = [BP[0] - BL[0], BP[1] - BL[1]], BLEN = Math.hypot(BAX[0], BAX[1]), BN = [-BAX[1] / BLEN, BAX[0] / BLEN];

  // ---- the dots (built in warm() from c01's wall picture at b)
  let PIC = null, DOTS = null, F1 = null, F75 = null, FILL = null;
  const NXd = 100, NYd = 57, PXd = VIG.w / NXd, PYd = VIG.h / NYd, RR = PXd * .75, Z0 = PXd * .9 * P12.s;
  function makeDots(px) {
    const r = prng(77), out = [], Q = [475, 125];   // the "?" leaves first, then the slip, then the wall
    for (let j = 0; j < NYd; j++) for (let i = 0; i < NXd; i++) {
      const vx = (i + .5) * PXd, vy = (j + .5) * PYd, fx = Math.round(vx * DEPTH), fy = Math.round(vy * DEPTH);
      let sR = 0, sG = 0, sB = 0, n = 0, mL = 1e9, mR = 0, mG = 0, mB = 0;
      for (let yy = fy - 9; yy <= fy + 9; yy += 2) for (let xx = fx - 9; xx <= fx + 9; xx += 2) {
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const k = (yy * W + xx) * 4, a = px[k], b = px[k + 1], c = px[k + 2], L = a * .3 + b * .59 + c * .11;
        sR += a; sG += b; sB += c; n++; if (L < mL) { mL = L; mR = a; mG = b; mB = c; }
      }
      sR /= n; sG /= n; sB /= n; const ink = clamp(((sR * .3 + sG * .59 + sB * .11) - mL - 30) / 60) * .8;
      const r1 = r(), r2 = r(), r3 = r(), r4 = r(), r5 = r(), r6 = r();
      const ts = A.dep0 + (A.dep1 - A.dep0) * clamp(Math.hypot(vx - Q[0], vy - Q[1]) / 560 + .14 * (r1 - .5));
      const M = floatW(ts), c = Math.cos(M.r), s = Math.sin(M.r), dx = (vx - VIG.w / 2) * M.s, dy = (vy - VIG.h / 2) * M.s;
      const u = Math.sqrt(r4), l = r5 * 2 - 1, hw = 4 + 116 * u;
      out.push({ vx, vy, ts, bx: M.x + dx * c - dy * s, by: M.y + dx * s + dy * c, col: [mix(sR, mR, ink), mix(sG, mG, ink), mix(sB, mB, ink)], r2, r3,
        tc: A.gat0 + .72 * r3, tx: BL[0] + BAX[0] * u + BN[0] * l * hw, ty: BL[1] + BAX[1] * u + BN[1] * l * hw, z1: 1.3 + .9 * r6 });
    }
    return out.sort((a, b) => a.ts - b.ts);
  }
  const departed = (t) => { if (!DOTS || t < A.dep0) return 0; let lo = 0, hi = DOTS.length; while (lo < hi) { const m = (lo + hi) >> 1; if (DOTS[m].ts <= t) lo = m + 1; else hi = m; } return lo; };
  // the vignette while its picture leaves: the frozen picture, with the sheet's own paper showing through where each dot was
  const vigFn = (t) => (ctx, x0, y0, L) => {
    const n = departed(t); if (n >= DOTS.length) return;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, VIG.w, VIG.h); ctx.clip();
    ctx.save(); ctx.translate(x0, y0); ctx.scale(1 / DEPTH, 1 / DEPTH); ctx.drawImage(best(PIC), 0, 0); ctx.restore();
    if (n > 0) {
      ctx.beginPath(); for (let i = 0; i < n; i++) { const d = DOTS[i]; ctx.moveTo(x0 + d.vx + RR, y0 + d.vy); ctx.arc(x0 + d.vx, y0 + d.vy, RR, 0, TAU); }
      ctx.clip(); ctx.drawImage(best(L.c), x0 - SHEET.vx - L.pad, y0 - SHEET.vy - L.pad, L.c.width / L.K, L.c.height / L.K);
    }
    ctx.restore();
  };
  function drawDots(ctx, t, C) {
    const n = departed(t); if (!n) return;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const d = DOTS[i], q = clamp((t - d.ts) / 1.6), kc = ss((t - d.tc) / .9);
      let x = d.bx, y = d.by;
      if (q > 0 && kc < 1) {   // smoke: a few steps through a slow flow field, rising
        const st = Math.pow(q, 1.3) * (22 + 40 * d.r2) / 4;
        for (let k = 0; k < 4; k++) { const f = Math.sin(x * .033 + t * .5) + Math.sin(y * .039 - t * .37 + x * .012) + Math.sin((x + y) * .021 + d.r3 * 6), an = -Math.PI / 2 - .3 + f * .6; x += Math.cos(an) * st; y += Math.sin(an) * st; }
      }
      if (kc > 0) { x = mix(x, d.tx + 2.5 * Math.sin(t * .8 + d.r2 * TAU), kc); y = mix(y, d.ty + 2.5 * Math.cos(t * .65 + d.r3 * TAU), kc); }
      const sx = (x - C.cx) * C.s + W / 2, sy = (y - C.cy) * C.s + H / 2; if (sx < -6 || sy < -6 || sx > W + 6 || sy > H + 6) continue;
      const air = sm(clamp(q * 2.4)), z = mix(mix(Z0, 1.9, air), d.z1, kc), al = mix(1, mix(.9, .62, kc), air);
      ctx.fillStyle = `rgba(${mix(mix(d.col[0], 246, air), 255, kc) | 0},${mix(mix(d.col[1], 236, air), 214, kc) | 0},${mix(mix(d.col[2], 214, air), 160, kc) | 0},${al.toFixed(2)})`;
      ctx.fillRect(sx - z / 2, sy - z / 2, z, z);
    }
    ctx.restore();
  }
  function beam(ctx, t, I) {
    if (I <= 0) return;
    const fl = I * (.95 + .05 * Math.sin(t * 1.7));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [wd, a] of [[1.3, .05], [1, .1], [.6, .09]]) {
      const hw = 124 * wd, lg = ctx.createLinearGradient(BL[0], BL[1], BP[0], BP[1]); lg.addColorStop(0, rgba(AMBER, a * 2.4 * fl)); lg.addColorStop(.35, rgba(AMBER, a * fl)); lg.addColorStop(1, rgba(AMBER, a * .5 * fl));
      ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(BL[0] - 6, BL[1]); ctx.lineTo(BL[0] + 6, BL[1]); ctx.lineTo(BP[0] + hw, BP[1]); ctx.lineTo(BP[0] - hw, BP[1]); ctx.closePath(); ctx.fill();
    }
    const P = STAGE.pool; ctx.save(); ctx.translate(P.x, P.y); ctx.scale(1, P.ry / P.rx); const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, P.rx); pg.addColorStop(0, rgba(AMBER, .5 * fl)); pg.addColorStop(.5, rgba(AMBER, .18 * fl)); pg.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, P.rx, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
    addGlow(ctx, BL[0], BL[1] - 2, 70, .55 * fl, AMBER, CORE);
  }
  // ---- the screen and its pictures
  const PW = SCR.h * 608 / 1080, PX = SCC[0] - PW / 2;
  function clipPic(ctx, img) {   // clip M's frame exactly as clipScreen draws it (for frames 1 and 75 outside the clip's own window)
    const x = PX, y = SCR.y, w = PW, h = SCR.h;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = '#05060f'; ctx.fillRect(x, y, w, h);
    if (img) { const s = Math.max(w / img.width, h / img.height), dw = img.width * s, dh = img.height * s; ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); }
    ctx.globalAlpha = .06; for (let yy = y; yy < y + h; yy += 4) { ctx.fillStyle = '#000'; ctx.fillRect(x, yy, w, 1.5); }
    ctx.globalAlpha = 1; const sh = ctx.createLinearGradient(x, y, x + w, y + h); sh.addColorStop(0, 'rgba(216,247,255,.07)'); sh.addColorStop(.5, 'rgba(216,247,255,0)'); ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
  function feed(ctx, t, which) {   // the clip on the wide screen: pillarboxed over its own blurred, darkened copy
    if (FILL) ctx.drawImage(best(FILL), SCR.x, SCR.y, SCR.w, SCR.h); else { ctx.fillStyle = '#0a0f22'; ctx.fillRect(SCR.x, SCR.y, SCR.w, SCR.h); }
    if (which === 'clip') clipScreen(ctx, t, T, 'M', PX, SCR.y, PW, SCR.h, { bezel: false, glow: false, radius: 0 }); else clipPic(ctx, which === 'f1' ? F1 : F75);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(PX - 3, SCR.y, 3, SCR.h); ctx.fillRect(PX + PW, SCR.y, 3, SCR.h);
  }
  function rosette(ctx, t) {
    ctx.drawImage(screenBG(), SCR.x, SCR.y, SCR.w, SCR.h);
    [[0, .1, .4], [1, -.06, 2.1]].forEach(([k, sp, ph]) => { const Rg = ringImg(k); ctx.save(); ctx.translate(SCC[0], SCC[1]); ctx.rotate(t * sp + ph); ctx.scale(1 + .012 * Math.sin(t * 1.3 + ph), 1 + .012 * Math.sin(t * 1.3 + ph)); ctx.drawImage(best(Rg.c), -Rg.r, -Rg.r, Rg.r * 2, Rg.r * 2); ctx.restore(); });
    const rg = ctx.createRadialGradient(SCC[0], SCC[1], 0, SCC[0], SCC[1], 280); rg.addColorStop(0, rgba(ICE, .26 * (.8 + .2 * Math.sin(t * 2.1)))); rg.addColorStop(1, rgba(ICE, 0));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg; ctx.fillRect(SCR.x, SCR.y, SCR.w, SCR.h); ctx.restore();
  }
  // the screen's picture and its CRT state: { k vertical scale of the picture (0 = only the line), line brightness }
  function screenState(t) {
    if (t < A.on0) return { kind: null, k: 0, line: 0 };
    if (t < A.sw0) { const u = lin(A.on0, A.on1, t); return { kind: 'ros', k: mix(.006, 1, ss(u)), line: 1 - sm(lin(.15, 1, u)) }; }
    if (t < A.swL) { const u = lin(A.sw0, A.swL, t); return { kind: 'ros', k: mix(1, .006, ss(u)), line: sm(lin(.4, 1, u)) }; }
    if (t < A.sw1) return { kind: null, k: 0, line: 1 };
    if (t < A.c0) { const u = lin(A.sw1, A.sw2, t); return { kind: 'f1', k: mix(.006, 1, ss(u)), line: 1 - sm(lin(.15, 1, u)) }; }
    if (t <= A.c1) return { kind: 'clip', k: 1, line: 0 };
    if (t < A.off1) { const u = lin(A.off0, A.off1, t); return { kind: 'f75', k: mix(1, .006, ss(u)), line: sm(lin(.3, 1, u)) }; }
    return { kind: null, k: 0, line: 1 };
  }
  const hotOff = (t) => sm(lin(A.off0 + .06, A.off1, t)) * (1 - sm(lin(A.open0, A.open0 + .5, t)));   // the line that becomes the ruler
  function screen(ctx, t, C) {
    const S = SCR, st = screenState(t);
    ctx.fillStyle = '#05060f'; ctx.fillRect(SCC[0] - 70, S.y + S.h + 14, 140, STAGE.floor.back - S.y - S.h - 14);   // the stand
    ctx.fillStyle = '#04050d'; ctx.fillRect(S.x - 14, S.y - 14, S.w + 28, S.h + 28);
    ctx.strokeStyle = rgba('#b9c3ee', .22); ctx.lineWidth = 1.2; ctx.strokeRect(S.x - 14, S.y - 14, S.w + 28, S.h + 28); ctx.strokeStyle = rgba('#b9c3ee', .08); ctx.lineWidth = 1; ctx.strokeRect(S.x - 3, S.y - 3, S.w + 6, S.h + 6);
    ctx.save(); ctx.beginPath(); ctx.rect(S.x, S.y, S.w, S.h); ctx.clip();
    // the glass: the dark it reflects is the same night as the ruler world's (screen space), so the push into it hands over invisibly
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); nightBG(ctx, t, rulerBG(t, worldCam(t))); ctx.restore();
    if (st.kind && st.k > 0) {
      ctx.save(); ctx.translate(0, SCC[1]); ctx.scale(1, st.k); ctx.translate(0, -SCC[1]);
      if (st.kind === 'ros') rosette(ctx, t); else feed(ctx, t, st.kind);
      if (st.k < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#fff6e6', .5 * (1 - st.k)); ctx.fillRect(S.x, S.y, S.w, S.h); }   // the picture's light gathers into the line
      ctx.restore();
    }
    ctx.restore();
    return st;
  }
  // ---- the speaker (figure kit: breath, weight, glances, blinks); he points at the screen when it lights
  const SPK = { x: 452, y: 641, s: 1.55 };
  function speaker(ctx, t, lit) {
    const pose = { lean: .08, sh: [.3, .2], el: [.55, .5], head: .02 }, o = { t, seed: 7 };
    const g = ss(lin(A.on1 - .05, A.on1 + .5, t)) * (1 - ss(lin(A.onst - .3, A.onst + .35, t)));
    if (g > 0) { const Rm = reachArm(SPK.x, SPK.y, SPK.s, pose, 0, false, o, [700, 300]); pose.sh = [mix(.3, Rm.sh, g), .2]; pose.el = [mix(.55, Rm.el, g), .5]; pose.lock = [true, false]; pose.head = mix(.02, -.12, g); }
    figure(ctx, SPK.x, SPK.y, SPK.s, pose, { ...o, dress: { coat: '#262c44', pants: '#141320', shoes: '#0a0a12', hair: '#1a1418' }, accent: '#3a4670', accentPart: 'scarf',
      light: { x: BL[0], y: BL[1], col: '#ffd39a', a: .8 * lit }, rim: rgba('#ffc98a', .95 * lit), rimSide: -1, shadow: false, shadeA: .45 * (1 - lit) });
  }
  function lecternAt(ctx, lit) {
    const L = lectern(), x = STAGE.lect.x - L.w / 2 - L.pad, y = STAGE.lect.bot - L.h - L.pad, w = (L.w + L.pad * 2), h = (L.h + L.pad * 2);
    ctx.drawImage(best(L.dark), x, y, w, h);   // unlit it is a dark silhouette; the spot brings its wood up (one solid object, never see-through)
    if (lit > 0) { ctx.save(); ctx.globalAlpha = clamp(lit); ctx.drawImage(best(L.c), x, y, w, h); ctx.restore(); }
  }
  // ---- the audience (nearer rows have more parallax: a pinhole camera dollying in front of the stage plane)
  const DELTA = [.3, .22, .15], ROWTOP = [915, 865, 825];
  function audience(ctx, t, C, cool, warm) {
    for (let k = 2; k >= 0; k--) {
      const den = 1 - C.s * DELTA[k]; if (den < .05) continue;
      const sk = C.s / den, sk1 = 1 / (1 - DELTA[k]), top = (540 + (ROWTOP[k] - 540) / sk1 - C.cy) * sk + H / 2; if (top > H + 4) continue;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sk, sk); ctx.translate(-C.cx, -C.cy); ctx.translate(960, 540); ctx.scale(1 / sk1, 1 / sk1); ctx.translate(-960, -540);
      audienceRow(ctx, k, t, { cool, warm, warmX: STAGE.lect.x });
      ctx.restore();
    }
  }
  // ---- the lower third of clip M (screen space, on the blurred margin left of the clip, above the subtitle zone)
  function lowerThird(ctx, t, C) {
    if (t < A.c0 + .15 || t > A.c1 + .05) return;
    const [lx] = toS(C, PX, 0), x = Math.max(110, lx - 520), y = 640;
    const bar = eout(lin(A.c0 + .2, A.c0 + .7, t)) * (1 - eio(lin(A.c1 - .4, A.c1 - .05, t)));
    if (bar > 0) { ctx.fillStyle = AMBER; ctx.fillRect(x, y - 38, 3, 128 * bar); }
    const rows = [['Elon Musk', 0, { size: 44, font: 'Instrument Serif', weight: 400, spacing: 0 }], ['CEO OF TESLA', 32, { size: 17, spacing: 4, alpha: .85 }],
      ['U.S.–SAUDI INVESTMENT FORUM', 58, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 }], ['NOV 19, 2025', 82, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 }]];
    rows.forEach(([s, dy, o], k) => {   // each line rises out of its own mask and sinks back into it
      const rise = (1 - eout(lin(A.c0 + .25 + k * .08, A.c0 + .85 + k * .08, t))) + eio(lin(A.c1 - .5 + k * .04, A.c1 - .12 + k * .04, t)), z = o.size;
      if (rise >= 1) return;
      ctx.save(); ctx.beginPath(); ctx.rect(x + 12, y + dy - z * 1.05, 520, z * 1.4); ctx.clip(); label(ctx, s, x + 20, y + dy + rise * z * 1.3, o); ctx.restore();
    });
  }
  function stageWorld(ctx, t) {
    const C = stageCam(t), I = beamI(t), sc = scrI(t);
    nightBG(ctx, t, stageBG(t, C));
    let st = { k: 0, line: 0 };
    if (t >= A.pb0) {
      ctx.save(); apply(ctx, C);
      ctx.drawImage(trussImg(), truss.x, truss.y, truss.w, truss.h);
      st = screen(ctx, t, C);
      if (sc > 0) addGlow(ctx, SCC[0], SCC[1] + 40, 760, .2 * sc * (.92 + .08 * Math.sin(t * 2.1)), CYAN, ICE);   // the screen lights the hall
      ctx.drawImage(floorImg(), floorR.x, floorR.y, floorR.w, floorR.h);
      if (sc > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(SCC[0], 742); ctx.scale(1, .07); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 640); g.addColorStop(0, rgba(ICE, .34 * sc)); g.addColorStop(1, rgba(ICE, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 640, 0, TAU); ctx.fill(); ctx.restore(); }
      const lit = .2 + .8 * I;
      speaker(ctx, t, I);
      lecternAt(ctx, lit);
      beam(ctx, t, I);
      ctx.restore();
      audience(ctx, t, C, .85 * sc, I);
    }
    // the screen's hot line (on, switch, off) in screen space, clipped to the glass as the camera sees it
    const hl = Math.max(st.line, hotOff(t));
    if (hl > 0) { const [gx0, gy] = toS(C, SCR.x, SCC[1]), [gx1] = toS(C, SCR.x + SCR.w, 0); hotLine(ctx, gy, Math.max(-10, gx0), Math.min(W + 10, gx1), hl); }
    motes(ctx, t, 11, 60, .6);
    drawDots(ctx, t, C);
    const M = sheetW(t), [mx, my] = toS(C, M.x, M.y);
    if (mx > -900 && mx < W + 900 && my > -700 && my < H + 700) sheet12(ctx, t, T, { x: mx, y: my, s: M.s * C.s, sy: M.sy * C.s, r: M.r }, { vig: vigFn(t), lift: M.lift });
    lowerThird(ctx, t, C);
  }

  // ════════════════ the ruler world (2.04–2.07) ════════════════
  const K = { r0: { cx: 960, cy: 540, s: 1 }, r1: { cx: 1020, cy: 520, s: 1.035 }, seal: { cx: 1180, cy: 470, s: 1.1 }, stairs: { cx: 2330, cy: -180, s: .7 } };
  const NSOLID = A.steps.length, NGHOST = 4;
  const SEAL = { x: yearX(2040), y: RULER.y, hy: 292, r: 84 };
  const stepPos = (i) => [SEAL.x + 26 + i * STEP.run, SEAL.y - 66 - i * STEP.rise];
  const LW = (() => { const [x, y] = stepPos(NSOLID + NGHOST); return [x + 116, y - 50]; })();   // the light at the top of the stairs (world)
  const rw = (t) => 30 + 20 * ss(lin(A.if, A.betterE + .2, t)) + 40 * ss(lin(A.will - .05, A.willE + .03, t));   // its radius: grows with the climb, flares on "will"
  const RW1 = 90, S_END = R_FULL / RW1;
  function flyCam(t) {   // the light's screen point glides to the frame centre while the camera zooms into it (rest → rest)
    const u = lin(A.fly0, A.ba, t), p0 = toS(K.stairs, LW[0], LW[1]), ep = ss(lin(0, .72, u)), ez = Math.pow(ss(u), 1.5);
    const s = Math.exp(mix(Math.log(K.stairs.s), Math.log(S_END), ez)), px = mix(p0[0], W / 2, ep), py = mix(p0[1], H / 2, ep);
    return { cx: LW[0] - (px - W / 2) / s, cy: LW[1] - (py - H / 2) / s, s };
  }
  function worldCam(t) {
    let C;
    if (t < A.rb0) C = K.r0;
    else if (t < A.and - .2) C = zoomFix(K.r0, K.r1, sine(lin(A.rb0, A.and - .2, t)));
    else if (t < A.and - .1) C = K.r1;
    else if (t < A.cond + .9) C = zoomFix(K.r1, K.seal, ss(lin(A.and - .1, A.cond + .9, t)));
    else if (t < A.if - .15) C = K.seal;
    else if (t < A.betterE + .1) C = zoomFix(K.seal, K.stairs, ss(lin(A.if - .15, A.betterE + .1, t)));
    else if (t < A.fly0) C = K.stairs;
    else C = flyCam(t);
    const amp = sm(lin(A.hand, A.hand + .9, t)) * (1 - sm(lin(A.fly0 + .1, A.ba - .2, t)));
    return amp > 0 ? { cx: C.cx + drift(t, 6, 7) * amp / C.s, cy: C.cy + drift(t, 4, 8) * amp / C.s, s: C.s } : C;
  }
  const rulerBG = (t, C) => ({ dx: drift(t, 10, 2) + (960 - C.cx) * .12, dy: drift(t, 6, 3) + (540 - C.cy) * .12, s: Math.pow(C.s, .12) });
  const YB = RULER.y - RULER.h / 2 - 36;
  const BR_SOLID = [[yearX(2025), YB + 24], [yearX(2025), YB], [yearX(2035), YB], [yearX(2035), YB + 24]];
  const BR_DOT = [[yearX(2035), YB], [yearX(2045), YB], [yearX(2045), YB + 24]];
  const PITCH = 9, DOTP = (() => { const out = []; let acc = 0; for (let i = 1; i < BR_DOT.length; i++) { const [x0, y0] = BR_DOT[i - 1], [x1, y1] = BR_DOT[i], L = Math.hypot(x1 - x0, y1 - y0); while (acc <= L) { out.push([mix(x0, x1, acc / L), mix(y0, y1, acc / L)]); acc += PITCH; } acc -= L; } return out; })();
  const polyAt = (P, u) => { const d = []; let s = 0; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); d.push([s, l, i]); s += l; } const tot = s * clamp(u);
    for (const [s0, l, i] of d) if (tot <= s0 + l) { const q = (tot - s0) / l; return [mix(P[i - 1][0], P[i][0], q), mix(P[i - 1][1], P[i][1], q), Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0])]; }
    const n = P.length - 1; return [P[n][0], P[n][1], 0]; };
  const DUST = (() => { const r = prng(5), out = []; for (let i = 0; i < 46; i++) out.push({ a: -Math.PI * r(), v: 90 + r() * 260, life: .5 + r() * .7, z: .8 + r() * 1.8 }); return out; })();
  const slabK = (i, t) => eo5(lin(A.steps[i], A.steps[i] + .55, t));
  function slabAt(i, t) {   // slab i's front-face top-left and scale: it slides out from behind slab i-1 (slab 0 grows out of the seal)
    const k = slabK(i, t), [x, y] = stepPos(i);
    if (i === 0) { const cx = mix(SEAL.x, x + 118, k), cy = mix(SEAL.y, y + 3, k); return { cx, cy, sc: mix(.3, 1, k), k }; }
    const p = slabAt(i - 1, t); return { cx: mix(p.cx, x + 118, k), cy: mix(p.cy, y + 3, k), sc: 1, k };
  }
  function rulerWorld(ctx, t) {
    const C = worldCam(t), climb = sm(lin(A.if, A.betterE + .3, t));
    nightBG(ctx, t, rulerBG(t, C));
    motes(ctx, t, 11, 60, .6);
    ctx.save(); apply(ctx, C);
    // the ruler opens out of the hot line, then the burin cuts its scale left to right
    const open = eout(lin(A.open0, A.open0 + .38, t)), land = t > A.land + .04 ? 4.5 * Math.exp(-(t - A.land - .04) * 7) * Math.cos((t - A.land) * 22) : 0;
    const bx = mix(yearX(2022), yearX(2062), ss(lin(A.rb0, A.rb1, t)));
    if (open > 0) {
      const RL = rulerLayer();
      ctx.save(); ctx.translate(0, RULER.y + land); ctx.scale(1, open);
      ctx.drawImage(best(RL.c), RL.left - RL.pad, -RULER.h / 2 - RL.pad);
      if (t > A.rb0) { ctx.save(); ctx.beginPath(); ctx.rect(RL.left - RL.pad, -RULER.h, bx - RL.left + RL.pad, RULER.h * 2); ctx.clip(); ctx.drawImage(best(RL.sc), RL.left - RL.pad, -RULER.h / 2 - RL.pad); ctx.restore(); }
      ctx.restore();
      if (t > A.rb0 && t < A.rb1) burinTip(ctx, bx, RULER.y, 0, t, { size: 15 });
    }
    // the bracket: amber to 2035 on "ten" (a burin draws it), dotted to 2045 on "twenty"; the dotted years gather into the seal
    const uTen = eout(lin(A.ten, A.ten + .7, t));
    if (uTen > 0) {
      ghostLine(ctx, BR_SOLID, { ghost: 0, u: uTen, col: '#ffd59a', w: 3, glow: AMBER });
      const hd = polyAt(BR_SOLID, uTen); if (uTen < .999) burinTip(ctx, hd[0], hd[1], hd[2], t, { size: 13 });
      wipeLabel(ctx, 'TEN YEARS', (yearX(2025) + yearX(2035)) / 2, YB - 22, yearX(2025), hd[0], { align: 'center', size: 24, col: '#ffd59a' });
    }
    const uTw = eout(lin(A.twenty, A.twenty + .75, t)), gather = eio(lin(A.and - .05, A.and + .6, t));
    if (uTw > 0) {
      if (gather <= 0) ghostLine(ctx, BR_DOT, { ghost: 1, u: uTw, col: '#ffd59a', w: 3.4, dot: PITCH, a: .85 });
      const hx = polyAt(BR_DOT, uTw)[0], ex = yearX(2035) + (yearX(2045) - yearX(2035)) * clamp(gather / .2857);
      wipeLabel(ctx, 'MAYBE TWENTY', (yearX(2035) + yearX(2045)) / 2, YB - 22, gather > 0 ? ex : yearX(2035), hx, { align: 'center', size: 24, col: '#ffd59a', alpha: .62 });
    }
    const engrave = eio(lin(A.and + .5, A.and + 1.05, t));
    if (gather > 0 && engrave < 1) {   // each dot of the dotted decade flies to its place on the seal's ring
      const hov = SEAL.hy + Math.sin(t * 2) * 5;
      ctx.save(); ctx.fillStyle = rgba('#ffd59a', .72);
      DOTP.forEach(([x0, y0], j) => { const k = eio(clamp(gather * 1.4 - j / DOTP.length * .4)), a = -Math.PI / 2 + j / DOTP.length * TAU, R2 = SEAL.r * 1.04;
        if ((j / DOTP.length) < engrave) return;
        const x = mix(x0, SEAL.x + Math.cos(a) * R2, k), y = mix(y0, hov + Math.sin(a) * R2, k) - Math.sin(Math.PI * k) * 40;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, TAU); ctx.fill(); });
      ctx.restore();
    }
    // the stairs: slabs slide out one per beat (drawn top-down, so each one comes out from behind the one below it)
    for (let i = NSOLID - 1; i >= 0; i--) {
      if (slabK(i, t) <= 0) continue;
      const p = slabAt(i, t), Sl = slabLayer(i);
      ctx.save(); ctx.translate(p.cx, p.cy); ctx.scale(p.sc, p.sc); ctx.drawImage(best(Sl.c), -118 - Sl.pad, -3 - Sl.pad + STEP.D[1]); ctx.restore();
      const fl = Math.exp(-Math.pow((t - A.steps[i] - .35) / .2, 2)), [x, y] = stepPos(i); if (fl > .02) addGlow(ctx, x + STEP.run * .6, y, 160, .35 * fl, AMBER, CORE);
    }
    // the seal: engraved round by the burin while it hovers, lands on "condition" (drawn over the first slab, which grows out of it)
    if (engrave > 0) {
      const drop = ein(lin(A.land - .36, A.land, t)), y = mix(SEAL.hy + Math.sin(t * 2) * 5, SEAL.y + land * .4, drop), sq = t > A.land ? 1 - .05 * Math.exp(-(t - A.land) * 10) : 1;
      ctx.save(); ctx.translate(SEAL.x + 10, SEAL.y + 16); ctx.scale(1, .32); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, SEAL.r * mix(1.7, 1.05, drop)); sg.addColorStop(0, `rgba(20,10,4,${mix(.12, .5, drop)})`); sg.addColorStop(1, 'rgba(20,10,4,0)'); ctx.fillStyle = sg; ctx.fillRect(-300, -300, 600, 600); ctx.restore();
      ctx.save(); ctx.translate(SEAL.x, y); ctx.scale(1 / sq, sq); ifSeal(ctx, 0, 0, SEAL.r, t, { wipe: engrave, rot: -.05 + .05 * drop, glint: t > A.land ? lin(A.land, A.land + .9, t) : null }); ctx.restore();
      if (engrave < 1) { const a = -Math.PI / 2 + engrave * TAU; burinTip(ctx, SEAL.x + Math.cos(a) * SEAL.r, y + Math.sin(a) * SEAL.r, a + Math.PI / 2, t, { size: 14 }); }
      addGlow(ctx, SEAL.x, y, 260, .16 * (1 - climb * .5), AMBER, CORE);
      if (t > A.land) { const dt = t - A.land; ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (const d of DUST) { if (dt > d.life) continue; const q = dt / d.life, x = SEAL.x + Math.cos(d.a) * (SEAL.r * .9 + d.v * eout(q) * .6), yy = SEAL.y + 20 + Math.sin(d.a) * d.v * eout(q) * .25 - q * 30; ctx.fillStyle = rgba(q < .3 ? CORE : AMBER, (1 - q) * .8); ctx.fillRect(x, yy, d.z, d.z); }
        ctx.restore(); }
    }
    // the ghost steps up to the light: drawn on as dotted outlines after "better", engraved solid one after another up to "will"
    for (let j = NGHOST - 1; j >= 0; j--) {
      const i = NSOLID + j, pen = ss(lin(A.gh0 + j * .08, A.gh0 + j * .08 + .35, t)); if (pen <= 0) continue;
      const eng = ss(lin(A.en0 + j * .18, A.en0 + j * .18 + .22, t)), [x, y] = stepPos(i), Sl = slabLayer(i), D = STEP.D, xc = x + (STEP.run + D[0]) * eng;
      if (eng > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - Sl.pad, y + D[1] - Sl.pad, xc - x + Sl.pad, Sl.h); ctx.clip(); ctx.drawImage(best(Sl.c), x - Sl.pad, y - Sl.pad + D[1]); ctx.restore(); }
      if (eng < 1) {
        ctx.save(); if (eng > 0) { ctx.beginPath(); ctx.rect(xc, y + D[1] - 40, STEP.run + D[0] + 40, STEP.th - D[1] + 80); ctx.clip(); }
        const P = [[x, y + STEP.th], [x, y], [x + D[0], y + D[1]], [x + STEP.run + D[0], y + D[1]], [x + STEP.run + D[0], y + D[1] + STEP.th], [x + STEP.run, y + STEP.th], [x, y + STEP.th]];
        ghostLine(ctx, P, { ghost: 1, col: '#f6e6c4', w: 2.2, dot: 8, a: .85, u: pen });
        ghostLine(ctx, [[x, y], [x + STEP.run, y], [x + STEP.run + D[0], y + D[1]]], { ghost: 1, col: '#f6e6c4', w: 2.2, dot: 8, a: .85, u: pen });
        ctx.restore();
        if (eng > 0) burinTip(ctx, Math.min(xc, x + STEP.run), y, 0, t, { size: 14 });
      }
    }
    ctx.restore();
    hotLine(ctx, toS(C, 0, RULER.y)[1], -10, W + 10, hotOff(t));
    // the source of the numbers (screen space, steady): written on with "ten", wiped away by "If"
    { const x0 = 96, w0 = 760, a0 = ss(lin(A.ten - .3, A.ten + .5, t)), a1 = ss(lin(A.if - .25, A.if + .35, t));
      if (a0 > 0 && a1 < 1) wipeLabel(ctx, 'ELON MUSK · U.S.–SAUDI INVESTMENT FORUM · NOV 19, 2025', x0, H - 200, x0 - 4 + w0 * a1, x0 - 4 + w0 * a0, { size: 16, weight: 500, spacing: 2.5, col: '#c9c3dc', alpha: .8 }); }
    // the light above the stairs (it will be the works hall's lit door in c03): the same light as b23, in the world
    const [lx, ly] = toS(C, LW[0], LW[1]);
    lightAt(ctx, t, lx, ly, rw(t) * C.s, B23);
  }

  // ════════════════ the one frame function + the print (a getter: the clip gets a lighter halftone, eased) ════════════════
  let LT = A.t0;
  const draw = (ctx, t) => {
    LT = t;
    if (t < A.b) return b12(ctx, t, T);
    if (t >= A.ba) return b23(ctx, t);
    if (t < A.hand) stageWorld(ctx, t); else rulerWorld(ctx, t);
  };
  const clipK = (t) => ss(lin(A.sw0, A.c0, t)) * (1 - ss(lin(A.c1, A.hand, t)));
  const print = { riso: .3, get halftone() { return .6 - .25 * clipK(LT); }, get hatch() { return .6 - .25 * clipK(LT); } };

  async function warm() {
    await warmBridge(T);
    warmKit();
    // c01's wall picture as the bridge hands it over (b), frozen: from "daydream" on its lines leave it as dots
    const [pc, pg] = canvas(W, H); wallShot(pg, A.b, b12K(T));
    DOTS = makeDots(pg.getImageData(0, 0, W, H).data); PIC = toImg(pc);
    const fp = (k) => `${ROOT}clips/M/f${String(k).padStart(5, '0')}.jpg`;
    try { F1 = await loadImage(fp(1)); F75 = await loadImage(fp(75)); } catch { F1 = F75 = null; }
    if (F1) {   // the clip's own frame, blurred and darkened, fills the wide screen behind it
      const [fc, fg] = canvas(440, 248), s = Math.max(440 / F1.width, 248 / F1.height);
      fg.filter = 'blur(9px)'; fg.drawImage(F1, 220 - F1.width * s * .62, 124 - F1.height * s * .62, F1.width * s * 1.24, F1.height * s * 1.24); fg.filter = 'none';
      fg.fillStyle = 'rgba(4,6,20,.5)'; fg.fillRect(0, 0, 440, 248); FILL = toImg(fc);
    }
    const [, g] = canvas(); for (const t of [A.b + .3, A.on1 + .3, A.sw2, A.hand + .3, A.cond, A.better, A.ba - .3]) { g.save(); draw(g, t); g.restore(); }
    await ready();
  }
  return { A, draw, print, warm, stageCam, worldCam };
}
