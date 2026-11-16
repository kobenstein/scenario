// c04 · Five minutes, not luck · "want" is too big · Friston, the radio · Kagan (C2) · a lab trick?
// T.G('After about five minutes') → T.G("It didn't stay in the lab") · builder B1. Plan: docs/shots.md 4.01–4.05 · B1 module lib/f19_b1_world.mjs
// ONE entry, ONE camera: the dish field (2D) → tilt up out of the dish into the aisle (3D) → push into the radio's display (C2 plays
// in it) → swing back down into the dish (c01's descent) → the dish field (2D) again.
//
// | ID   | anchor (word)                          | picture (one idea)                                                           | 1–2 moves           |
// |------|----------------------------------------|------------------------------------------------------------------------------|---------------------|
// | 4.01 | five minutes · rallies got longer · no feedback · wasn't luck | the ORDER ticks rise into a climbing row (rallies) while a 5-minute dial sweeps; the NOISE strip folds into a flat cool line: NO FEEDBACK | ticks rise · dial |
// | 4.02 | want · static to stop · too big a word · keeps the noise away | back to the dish: "want" rises over it, shrinks to a spark and drops into the net; static flickers, then calms from the centre out | word shrinks · calm spreads |
// | 4.03 | Karl Friston · more predictable · You do it too · crackling radio · voice comes through | tilt up out of the dish into the aisle: you and a small radio on a stand (KARL FRISTON · NEUROSCIENTIST); the net glows in your hood; you turn the dial, the crackle in the display smooths into a clean gold voice line | dial · wave smooths |
// | 4.04 | Here's Brett Kagan → [C2]              | the camera pushes into the radio's display: it IS the screen (CLIP_RECT), C2 runs in it | push in · footage |
// | 4.05 | order and noise · lab trick            | the display darkens; the camera swings back and tilts down into the dish (ladder: ORDER VS. NOISE, then JUST A LAB TRICK?) | swing down |
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as B from '../lib/f19_b1_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, lin } = E;
const { cam, camAt, camDrift, view, proj, bill, quad, COOL, NET, bump } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  a.T0 = R.a; a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

// ---- the set (world units ≈ mm): you and the radio in the aisle, left of the alive rack (drawer 11 open)
const RADIO = { X: -760, Z: -1100, top: 1000, w: 460, h: 240 };
const DISP = { x: -40, y: -RADIO.h + 36, w: 212, h: 212 * 9 / 16 };        // the display (16:9, right part), local coords (y up = −)
const KNOB = { x: -150, y: -122, r: 46 };                                   // the dial (left part, toward you)
const REACH = [1.0, 1.75];                                                 // your right arm on the dial (upper, fore; rad from down)
const YOU = { X: RADIO.X + KNOB.x - (.0625 + .17 * Math.sin(REACH[0]) + .155 * Math.sin(REACH[1])) * 1700, Z: -1150, h: 1700 };
const DISPC = { X: RADIO.X + DISP.x + DISP.w / 2, Y: RADIO.top - (DISP.y + DISP.h / 2), Z: RADIO.Z - 1 };
const C_AISLE0 = cam({ tx: -720, ty: 1080, tz: -900, d: 3300, p: -.045 });
const C_AISLE1 = cam({ tx: -820, ty: 1110, tz: -1000, d: 2500, p: -.03 });
const C_RAD = cam({ tx: DISPC.X, ty: DISPC.Y, tz: DISPC.Z, d: 1500 * DISP.w / F.CLIP_RECT.w, p: 0, f: 1500, oy: F.CLIP_RECT.y + F.CLIP_RECT.h / 2 - H / 2 });
const C_RAD0 = cam({ tx: DISPC.X, ty: DISPC.Y, tz: DISPC.Z, d: 1500 * DISP.w / F.SCREEN_RECT.w, p: 0, f: 1500, oy: F.SCREEN_RECT.y + F.SCREEN_RECT.h / 2 - H / 2 });
const AISLE_DISH = { glow: .9, chip: 1, electrodes: .6, rim: 1 };

let PLATE_CV = null;
function scene(a, T) {
  const tUp0 = a.behind - .75, tUp1 = a.friston - .3;                   // tilt up out of the dish
  const c2 = a.c2, tRad = c2.start + .3;                                // the display sits on CLIP_RECT
  const tPush0 = a.heres + .15;
  const tDn0 = c2.end + .05, tDn1 = a.labTrick - .3;                   // swing back down into the dish
  const K2 = [...B.k34(a), [a.looks - .2, B.C_RALLY], [a.want + .8, B.CANON]];
  const cam2 = (t) => B.cam2Drift(B.cam2At(t, K2), t, .6 * (1 - smooth(span(t, tUp0 - 1.4, tUp0 - .2))));
  const cam2b = (t) => B.cam2Drift(B.CANON, t, .6 * smooth(span(t, tDn1 + .1, tDn1 + 1.6)));
  const K3 = [[tUp1, C_AISLE0], [tPush0, C_AISLE1], [tRad, C_RAD]];
  const gauss = (x) => Math.exp(-x * x);

  return (ctx, t) => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < tUp0) field(ctx, t, cam2(t));
    else if (t >= tDn1) field(ctx, t, cam2b(t));
    else world(ctx, t);
    ctx.restore();
    F.ladder(ctx, t, T);
  };

  // ------------------------------------------------------------------------------------------------ 2D: the dish field
  function field(ctx, t, c) {
    const m = B.mapOf(c), z = c.z;
    B.night(ctx);
    // static ("want the static to stop"), then the calm spreading from the centre ("settle … keeps the noise away")
    const sk = smooth(span(t, a.staticW - .25, a.staticW + .3)) * (1 - smooth(span(t, a.awayE, a.awayE + .5)));
    const calm = 1.15 * sineIO(span(t, a.settle - .2, a.awayE - .1));
    const out = (u, v) => Math.hypot(u, v) > calm;
    const ePulse = (i, j) => { const [u, v] = B.eUV(i, j); return out(u, v) ? B.staticPulse(t, i, j, sk) : 0; };
    const absorbed = a.tooBig + .95;
    const fire = (i) => { const s = NET.somas[i]; let f = out(s[0], s[1]) ? B.staticFire(t, i, sk * .8) : 0; if (i === NET.centre) f = Math.max(f, bump(t, absorbed - .05, .8)); return f; };
    const settled = smooth(span(t, a.settle, a.awayE + .3)) * (1 - smooth(span(t, tUp0 - 1, tUp0)));
    F.dish(ctx, t, m, { ...B.FIELD_DISH, ePulse, net: { lit: 1 - .3 * wordOn(t) + .15 * settled, ambient: 1, fire, w: 1 } });
    B.staticSpecks(ctx, t, m, sk * .9, out);
    if (t < a.looks + 1) B.stripsDraw(ctx, t, c, a);
    wantWord(ctx, t, m);
  }
  function wordOn(t) { return smooth(span(t, a.want - .3, a.want + .4)) * (1 - smooth(span(t, a.tooBig, a.tooBig + .8))); }
  // "want": rises over the dish, then shrinks into a spark and drops into the centre soma
  function wantWord(ctx, t, m) {
    const up = F.rise(span(t, a.want - .25, a.want + .55)), sh = span(t, a.tooBig - .05, a.tooBig + 1.0);
    if (up <= 0 || sh >= 1) return;
    const k = 1 - expoIn(sh) * .999 - .35 * sineIO(clamp(sh * 1.6)) * (1 - expoIn(sh));
    const [cx, cy] = m(0, 0), x = lerp(960, F.somaAt(m, NET.centre)[0], sineIO(sh)), y = lerp(600, F.somaAt(m, NET.centre)[1], sineIO(sh)) + (1 - up) * 40;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.beginPath(); ctx.rect(-500, -170 + (1 - up) * 0, 1000, 210); ctx.clip();
    E.glowText(ctx, '“want”', 0, 40 + (1 - expoOut(up)) * 150, { size: 150, serif: true, align: 'center', col: P.cream });
    ctx.restore();
    if (sh > .6) halo(ctx, x, y, 60 * (1 - sh) + 14, .8 * sineIO(span(sh, .6, 1)), P.halo0, P.core0);
  }

  // ------------------------------------------------------------------------------------------------ 3D: the aisle
  function camera(t) {
    if (t < tUp1) return B.swing(B.C_TOP, C_AISLE0, span(t, tUp0, tUp1), 'pitch');
    if (t < tDn0) { const c = camAt(t, K3); return c; }
    // v4: CLIP_RECT is near full frame, so C_RAD sits very close; the swing starts from a camera that eases back to the old
    // (Fassung 0) distance over the first 1.2 s while the screen goes dark, else the target pan whips the screen across (smooth.py lurch)
    const k = sineIO(span(t, tDn0, tDn0 + 1.2)), A = { ...C_RAD, d: Math.exp(lerp(Math.log(C_RAD.d), Math.log(C_RAD0.d), k)), oy: lerp(C_RAD.oy, C_RAD0.oy, k) };
    return B.swing(A, B.C_TOP, span(t, tDn0, tDn1), 'target', true);
  }
  function world(ctx, t) {
    const hold = Math.max(t < tUp1 ? 1 - smooth(span(t, tUp0 + .2, tUp1)) : 0, smooth(span(t, tRad - .9, tRad)) * (1 - smooth(span(t, tDn0, tDn0 + 1.2))), smooth(span(t, tDn1 - 1.4, tDn1)));
    const c = camDrift(camera(t), t, (1 - hold) * .35), v = view(c);
    const up = sineIO(span(t, tUp0, tUp1)), dn = sineIO(span(t, tDn0, tDn1));
    const top = Math.max(1 - up, dn);                                   // 1 = straight down on the dish
    const dark = Math.max(1 - smooth(span(t, tUp0 + .25, tUp1 - .5)), smooth(span(t, tDn0 + .5, tDn1 - .55)));
    const dishO = {}; for (const k of Object.keys(AISLE_DISH)) dishO[k] = lerp(AISLE_DISH[k], B.FIELD_DISH[k], top);
    // while the camera sweeps fast down onto the dish the net's light sinks (a dense bright net racing across the frame lurches),
    // and comes back up as the camera settles: the cells settle with it
    const mv = t > tDn0 ? Math.sin(Math.PI * smooth(span(t, tDn0 + .3 * (tDn1 - tDn0), tDn1 - .15))) : 0;
    const netO = { lit: 1 - .6 * mv, ambient: 1 - .7 * mv, w: 1 };
    const onTop = dark > 0;
    F.hall(ctx, v, t, { pool: 1 - top });
    const out = F.rack(ctx, v, t, { open: F.OPEN, slide: 1, glow: .9 * (1 - top), net: netO, dishO: { ...dishO, a: onTop ? 0 : 1 }, seam: 1 });
    radio(ctx, t, v);
    you(ctx, t, v);
    // KARL FRISTON · NEUROSCIENTIST, from the radio's top-left corner
    const lu = F.rise(span(t, a.friston - .2, a.friston + .6)) * (1 - expoIn(span(t, a.youToo - .4, a.youToo + .1)));
    if (lu > 0) { const p = proj(v, RADIO.X + RADIO.w / 2 - 20, RADIO.top + RADIO.h - 10, RADIO.Z); if (p) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.tag(ctx, p[0], p[1], lu, 'KARL FRISTON', 'NEUROSCIENTIST', { dx: 50, dy: -130 }); ctx.restore(); } }
    if (onTop) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dark; B.night(ctx); ctx.restore();
      const m = out.dish && out.dish.map; if (m) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.dish(ctx, t, m, { ...dishO, net: netO }); ctx.restore(); }
    }
  }
  // the radio on its stand: display (crackle → a clean gold voice line; then C2), dial knob, antenna
  function radio(ctx, t, v) {
    const X = RADIO.X, Z = RADIO.Z, Y = RADIO.top;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    quad(ctx, v, [[X - 26, 0, Z + 60], [X + 26, 0, Z + 60], [X + 26, Y, Z + 60], [X - 26, Y, Z + 60]], P.night1);
    quad(ctx, v, [[X - 180, 2, Z - 120], [X + 180, 2, Z - 120], [X + 180, 2, Z + 200], [X - 180, 2, Z + 200]], mixHex(P.night1, P.ind2, .4));
    quad(ctx, v, [[X - 150, Y - 14, Z - 40], [X + 150, Y - 14, Z - 40], [X + 150, Y, Z + 160], [X - 150, Y, Z + 160]], mixHex(P.night1, P.ind2, .6));
    ctx.restore();
    const turn = sineIO(span(t, a.radio - .35, a.voice + .45));
    const noise = 1 - sineIO(span(t, a.radio, a.voiceE - .1)), voice = sineIO(span(t, a.radio + .2, a.voiceE + .1));
    const sinkW = sineIO(span(t, c2.start - 1.0, c2.start - .45));
    bill(ctx, v, X, Y, Z, () => {
      const w = RADIO.w, h = RADIO.h;
      // antenna
      ctx.strokeStyle = rgba(COOL.mid, .7); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(w / 2 - 40, -h + 4); ctx.lineTo(w / 2 - 170, -h - 360); ctx.stroke();
      ctx.fillStyle = COOL.mid; ctx.beginPath(); ctx.arc(w / 2 - 170, -h - 360, 9, 0, TAU); ctx.fill();
      // body
      const body = new Path2D(); body.roundRect(-w / 2, -h, w, h, 28);
      ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, mixHex(P.night1, P.ind2, .7)], [.6, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.fill(body);
      ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 5; ctx.stroke(body);
      // grille slots under the knob
      ctx.fillStyle = rgba(P.night0, .6); for (let k = 0; k < 4; k++) ctx.fillRect(KNOB.x - 48, -56 + k * 12, 96, 5);
      // the display (dark glass with a cool glow; the wave)
      ctx.fillStyle = mixHex(P.night0, COOL.deep, .35); ctx.fillRect(DISP.x - 6, DISP.y - 6, DISP.w + 12, DISP.h + 12);
      ctx.fillStyle = E.rad(ctx, DISP.x + DISP.w / 2, DISP.y + DISP.h / 2, DISP.w * .7, [[0, rgba(COOL.deep, .55)], [1, rgba(P.night0, .9)]]); ctx.fillRect(DISP.x, DISP.y, DISP.w, DISP.h);
      if (sinkW < 1) {
        ctx.save(); ctx.beginPath(); ctx.rect(DISP.x, DISP.y, DISP.w, DISP.h); ctx.clip();
        const yc = DISP.y + DISP.h / 2, n = Math.floor(t * 15);
        // the crackle (cool, jagged) and the voice (gold, smooth), flattening before the clip
        ctx.lineJoin = 'round';
        if (noise > 0) { ctx.strokeStyle = rgba(COOL.mid, .85 * noise); ctx.lineWidth = 2.4; ctx.beginPath();
          for (let k = 0; k <= 60; k++) { const x = DISP.x + DISP.w / 2 + (k / 60 - .5) * (DISP.w - 16) * (1 - smooth(span(sinkW, .45, 1))), hh = Math.sin(k * 12.9898 + n * 78.233) * 43758.5453; const r = (hh - Math.floor(hh)) - .5; const y = yc + r * DISP.h * .7 * noise * (1 - sinkW); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
        if (voice > 0) { ctx.strokeStyle = rgba(P.core1, .95 * voice); ctx.lineWidth = 3.2; ctx.beginPath();
          for (let k = 0; k <= 80; k++) { const x = DISP.x + DISP.w / 2 + (k / 80 - .5) * (DISP.w - 16) * (1 - smooth(span(sinkW, .45, 1))), y = yc + Math.sin(k * .45 - t * 5) * Math.sin(k / 80 * Math.PI) * DISP.h * .28 * voice * (1 - sinkW); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
        ctx.restore();
      }
      // the knob (its mark turns with the tuning)
      const ang = -2.2 + 2.6 * turn + .04 * Math.sin(t * 9) * bump(t, a.radio - .3, 2.2);
      ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.beginPath(); ctx.arc(KNOB.x, KNOB.y, KNOB.r, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(P.blue0, 1); ctx.lineWidth = 4; ctx.stroke();
      for (let k = 0; k < 9; k++) { const an = -2.4 + k * .6; ctx.strokeStyle = rgba(COOL.mid, .55); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(KNOB.x + Math.cos(an) * (KNOB.r + 8), KNOB.y + Math.sin(an) * (KNOB.r + 8)); ctx.lineTo(KNOB.x + Math.cos(an) * (KNOB.r + 16), KNOB.y + Math.sin(an) * (KNOB.r + 16)); ctx.stroke(); }
      ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(KNOB.x, KNOB.y); ctx.lineTo(KNOB.x + Math.cos(ang) * KNOB.r * .8, KNOB.y + Math.sin(ang) * KNOB.r * .8); ctx.stroke();
      if (voice > 0) halo(ctx, DISP.x + DISP.w / 2, DISP.y + DISP.h / 2, DISP.w * .55, .18 * voice * (1 - sinkW), P.halo1, P.core1);
    });
    // the display IS the clip screen: the footage (C2) lights in it, darkens after
    const s0 = proj(v, DISPC.X - DISP.w / 2, DISPC.Y + DISP.h / 2, DISPC.Z), s1 = proj(v, DISPC.X + DISP.w / 2, DISPC.Y - DISP.h / 2, DISPC.Z);
    if (!s0 || !s1) return;
    const r = [s0[0], s0[1], s1[0] - s0[0], s1[1] - s0[1]];
    const on = Math.min(1, smooth(span(t, c2.start - .55, c2.start + .1)) * (1 + .25 * bump(t, c2.start - .55, .2)));
    if (on <= 0 || r[2] < 8) return;
    const dk = smooth(span(t, c2.end - .1, c2.end + .45));
    // the kit's plate paints its glass and bezel at full strength: while it powers on, it is composited at the 'on' level
    if (on >= 1) { F.clipPlate(ctx, t, T, 'C2', { rect: r, on: 1, dark: dk, credits: true }); return; }
    PLATE_CV ??= createCanvas(W, H); const pc = PLATE_CV.getContext('2d'); pc.setTransform(1, 0, 0, 1, 0, 0); pc.clearRect(0, 0, W, H);
    F.clipPlate(pc, t, T, 'C2', { rect: r, on: 1, dark: dk, credits: true });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = on; ctx.drawImage(PLATE_CV, 0, 0); ctx.restore();
  }
  // you: beside the radio; the net glows in your hood ("Living things"); you reach for the dial ("You do it too") and tune it
  function you(ctx, t, v) {
    const reach = sineIO(span(t, a.youToo + .2, a.radio - .35)), tune = bump(t, a.radio - .35, a.voiceE - a.radio + .8);
    const look = lerp(.1, -.25, reach) + .04 * Math.sin(t * .7), br = .02 * Math.sin(t * 1.6);
    const p = bill(ctx, v, YOU.X, 0, YOU.Z, () => {
      ctx.scale(1, 1 + .006 * Math.sin(t * 1.6));
      E.du(ctx, 0, 0, YOU.h, { dir: 1, view: 'side', look, light: 1, armR: [lerp(.18, REACH[0], reach) + br * (1 - reach), lerp(.1, REACH[1], reach) + .06 * tune * Math.sin(t * 3.1)], armL: [-.16 - br, -.08] });
    });
    const hp = proj(v, YOU.X + (.03 - .012 * look) * YOU.h, .875 * YOU.h, YOU.Z);
    const on = .3 + .7 * bump(t, a.livingT - .2, 3.6);
    if (hp && p) {
      const r = .07 * YOU.h * hp[2];
      halo(ctx, hp[0], hp[1], r * 2.4, .3 * on, P.halo1, P.core1);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(hp[0], hp[1], r, 0, TAU); ctx.clip();
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .75;
      F.net(ctx, t, F.fieldMap(hp[0], hp[1], r * 2.3), { lit: on, ambient: 1, w: .9, nSparks: 9 });
      ctx.restore();
    }
  }
}
