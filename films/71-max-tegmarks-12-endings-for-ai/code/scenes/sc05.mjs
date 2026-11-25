// Film 71 · c05 (B1): ENDING 8/12 DESCENDANTS + ANCHOR 2/4 (the turn). One continuous take (docs/shots.md 8.01 – 8.13):
//   (c04 pushed into door 8: machines only) the door opening widens into a FAMILY PHOTO: the machines gather into one machine with a
//   graduation cap, you walk in as the parent · it grows, outgrows you, you put a hand on its side (proud) · SCENARIO: the photo's cream
//   border floods out into the walls of a quiet room, the photo becomes the window (the machine is the cool sun over a city that works
//   without people), you at the window · you applaud, alone · the room folds into the window and the window becomes a NEWSPAPER CLIPPING
//   (headline bars, the date; switch tag MAY 2026 · Vox) · the clipping unfolds into the C4 plate · the plate shrinks into one device with
//   two labels (A NEW SPECIES · TEGMARK / AN ASSISTANT · THE COMPANIES) · a track runs to it, a stop bar drops: STOP THE RACE · TEGMARK ·
//   ANCHOR (W): pull back, the device is door 8 in the Leitbild arc; the doors rise, 12–8 darken with their tags · ★ the seven others open
//   a crack: FROM HERE ON, YOU LIVE. · HOW? · the camera pushes into door 7 (c06 goes on from that frame).
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b1_extra.mjs';
import * as C4W from './sc04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng, GOLD, CREAM, CREAM2, COOL, LAMP, PAPER, TXT } = F;
const TAU = Math.PI * 2;
export const SLOT7 = 6, V7 = (() => { const d = S.slotDoor(6); return { x: d.x, y: d.y - d.h / 2, s: 5 }; })();   // the view at R.b (c06 starts here)
export const crackInner = (col) => (c, box) => { c.fillStyle = lin(c, 0, box.y0, 0, box.y0 + box.h, [[0, mixHex(col, '#ffffff', .75)], [1, mixHex(col, '#ffffff', .35)]]); c.fillRect(box.x0, box.y0, box.w, box.h); };
// the Leitbild of the turn at the end of c05 (shared with c06's first frames)
export function turnSlots(t, o) {
  return (i) => {
    const r = F.THUMB_ORDER[i], dark = r >= 8;
    const g = o.rise ? o.rise(i) : 1;
    if (dark) return { lit: lerp(.82, .15, o.darken ? o.darken(r) : 1), h: S.thumbSlot(i).h * g, a: g > .01 ? 1 : 0 };
    const cr = o.crack ? o.crack(r) : 1;
    return { h: S.thumbSlot(i).h * g, a: g > .01 ? 1 : 0, open: cr > .002 ? .16 * cr + (o.open7 && r === 7 ? o.open7 : 0) : undefined, inner: cr > .002 ? crackInner(S.slotDoor(i).col) : undefined, beamA: lerp(.9, 1.7, cr) * (i === S.GOLD_SLOT ? 1.1 : 1) };
  };
}

export default function (T, R) {
  const G = (p, n = 0) => T.G(p, n, R.a - .1), GE = (p, n = 0) => T.GE(p, n, R.a - .1);
  const A = {
    replace: G('The machines replace us'), proud: G("we're proud"), parents: G('like parents of a child'), outgrew: G('who outgrew them'), quiet: G('Your morning is quiet'),
    work: G("The world's work goes on"), applaud: G('And you applaud'), may: G('In May, a report'), movement: G('a small movement'), charge: G("And Tegmark's charge"),
    say: G('The companies say'), assist: G('assistants'), wants: G('And Tegmark wants this race'), stopped: G('race stopped'), dark: G('That was the dark end'),
    live: G('From here on, you live'), how: G('The question is how'),
  };
  const A4 = { some: T.G('And some ask the opposite'), opp: T.G('the opposite', 0, T.G('And some ask the opposite')), why: T.G('why stop the machines') };
  const C4 = T.clip('C4');
  // ---------------------------------------------------------------- the photo / window / clipping rectangle (screen px)
  const PH = { x: 520, y: 170, w: 880, h: 600 }, WINR = { x: 640, y: 120, w: 820, h: 560 }, CL = { x: 690, y: 240, w: 540, h: 420 };
  const lr = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
  const camA = [[R.a, C4W.V_END], [R.a + 1.8, { x: C4W.D8C[0] + 40, y: C4W.D8C[1] - 20, s: 2.1 }], [A.may, { x: C4W.D8C[0] + 60, y: C4W.D8C[1] - 60, s: 2.0 }], [A.may + 2.5, { x: 3460, y: -1250, s: 1.2 }], [C4.end + 2, { x: 3470, y: -1260, s: 1.18 }]]; const CAMA = B.holdKeys(camA);
  const doorRect = (v) => { const [x, y] = F.toScreen(v, C4W.D8BOX.x0, C4W.D8BOX.y0); return { x, y, w: C4W.D8BOX.w * v.s, h: C4W.D8BOX.h * v.s }; };
  const mPhoto = (t) => sineIO(span(t, R.a + .15, R.a + 1.6));
  const flood = (t) => sineIO(span(t, A.quiet - .45, A.quiet + .9));       // the border floods out into the room walls
  const fold = (t) => sineIO(span(t, A.may + .1, A.may + 1.6));             // the room folds into the window → the clipping
  function frameRect(t, v) {
    let r = lr(doorRect(v), PH, mPhoto(t));
    r = lr(r, WINR, flood(t)); r = lr(r, CL, fold(t));
    return r;
  }
  // ---------------------------------------------------------------- the photo
  const GLY = (() => { const r = prng(7800); return Array.from({ length: 26 }, () => [.12 + .76 * r(), .08 + .84 * r()]); })();
  const grow = (t) => sineIO(span(t, A.replace, A.outgrew + .4));
  function photoContent(ctx, t, r, a, mu) {
    // backdrop (a warm studio wall), the floor line
    ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, mixHex(LAMP.deep, P.halo2, .45)], [.78, mixHex(LAMP.deep, P.halo2, .25)], [.78, mixHex(LAMP.deep, P.night1, .35)], [1, mixHex(LAMP.deep, P.night1, .5)]]);
    ctx.fillRect(r.x, r.y, r.w, r.h);
    halo(ctx, r.x + r.w * .45, r.y + r.h * .4, r.w * .5, .35, LAMP.body, LAMP.core);
    const fl = r.y + r.h * .86, g = grow(t), mr = r.h * lerp(.1, .3, g), mx = r.x + r.w * lerp(.64, .66, g), my = fl - mr;
    // the machines from behind the door gather into one machine
    const gather = span(mu, .2, .8);
    if (gather < 1) GLY.forEach(([gx, gy], i) => { const e = sineIO(clamp(gather * 1.4 - i * .015)); F.agentGlyph(ctx, t, lerp(r.x + r.w * gx, mx, e), lerp(r.y + r.h * gy, my, e), lerp(r.w * .03, 4, e), { a: 1 - span(e, .8, 1) }); });
    if (gather > .6) {
      B.machineDisc(ctx, t, mx, my, mr * expoOut(span(gather, .6, 1)), { glow: .6 });
      // the graduation cap
      const cu = span(t, R.a + 1.2, R.a + 1.8); if (cu > 0) { const cy = my - mr * .95 - (1 - expoOut(cu)) * 60, cw = mr * 1.05;
        ctx.save(); ctx.globalAlpha *= clamp(cu * 3); ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.beginPath(); ctx.moveTo(mx - cw, cy); ctx.lineTo(mx, cy - cw * .32); ctx.lineTo(mx + cw, cy); ctx.lineTo(mx, cy + cw * .32); ctx.closePath(); ctx.fill();
        ctx.fillRect(mx - cw * .45, cy, cw * .9, cw * .32); ctx.strokeStyle = LAMP.body; ctx.lineWidth = Math.max(2, cw * .04); ctx.beginPath(); ctx.moveTo(mx, cy); ctx.quadraticCurveTo(mx + cw * .7, cy + cw * .05, mx + cw * .75 + 4 * Math.sin(t * 2), cy + cw * .5); ctx.stroke(); ctx.restore(); }
    }
    // you, the parent: walk in, step aside, the hand on its side (proud)
    const wi = sineIO(span(t, R.a + .7, R.a + 2.0)), aside = sineIO(span(t, A.proud - .4, A.proud + .6)), hand = sineIO(span(t, A.proud - .1, A.proud + .7));
    const yx = r.x + r.w * lerp(lerp(-.08, .36, wi), .22, aside), yh = r.h * .58;
    if (wi > 0) F.du(ctx, yx, fl, yh, { hood: false, dir: 1, walk: wi < 1 || (aside > 0 && aside < 1) ? t * 6 : undefined, view: wi < 1 ? 'side' : undefined, light: 1, look: .25 + .2 * g, armR: hand > 0 ? [lerp(.12, 1.45, hand), lerp(.12, 1.7, hand)] : undefined });
  }
  // ---------------------------------------------------------------- the window: a city that works without people
  const DRONES = Array.from({ length: 7 }, (_, i) => { const r = prng(7900 + i * 5); return [r(), .15 + r() * .45, .4 + r() * .8, r() * 6.3]; });
  const BLDS = Array.from({ length: 9 }, (_, i) => { const r = prng(7950 + i * 3); return [i / 9 + r() * .03, .35 + r() * .35, .08 + r() * .05]; });
  function city(ctx, t, r) {
    ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, mixHex(P.night0, P.ind1, .5)], [.7, mixHex(P.ind1, COOL.deep, .4)], [1, mixHex(COOL.deep, COOL.body, .3)]]); ctx.fillRect(r.x, r.y, r.w, r.h);
    B.machineDisc(ctx, t, r.x + r.w * .72, r.y + r.h * .24, r.h * .07, { glow: .8 });
    BLDS.forEach(([x, hh, w], i) => { const bx = r.x + r.w * x, bw = r.w * w, bh = r.h * hh; ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fillRect(bx, r.y + r.h - bh, bw, bh);
      for (let q = 0; q < 4; q++) { ctx.fillStyle = rgba(COOL.body, .25 + .2 * Math.sin(t * 1.5 + i + q)); ctx.fillRect(bx + bw * .3, r.y + r.h - bh + 14 + q * 22, bw * .4, 6); } });
    // a crane arm, moving
    const cx = r.x + r.w * .3, cy = r.y + r.h * .38, ang = -.15 + .25 * Math.sin(t * .35);
    ctx.strokeStyle = mixHex(P.ind2, COOL.deep, .5); ctx.lineWidth = r.w * .008; ctx.beginPath(); ctx.moveTo(cx, r.y + r.h); ctx.lineTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * r.w * .2, cy + Math.sin(ang) * r.w * .2); ctx.stroke();
    halo(ctx, cx + Math.cos(ang) * r.w * .2, cy + Math.sin(ang) * r.w * .2, 18, .6, COOL.halo, COOL.core);
    DRONES.forEach(([x0, y0, sp, ph]) => { const x = r.x + r.w * ((x0 + t * sp * .04) % 1), y = r.y + r.h * (y0 + .02 * Math.sin(t * sp + ph)); ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, TAU); ctx.fill(); halo(ctx, x, y, 16, .4, COOL.halo, COOL.core); });
  }
  // ---------------------------------------------------------------- the clipping (paper): headline bars and the date
  function clipping(ctx, t, r, u) {
    if (u <= 0) return;
    const ph = r.h * expoOut(u);
    ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, ph); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(r.x, r.y, r.w, r.h);
    const k = r.w / 540;
    F.glowText(ctx, 'MAY 2026', r.x + 36 * k, r.y + 52 * k, { size: 22 * k, weight: 700, col: PAPER.faint, glow: false, spacing: .12 });
    ctx.fillStyle = PAPER.ink; [[.86, 96], [.6, 140]].forEach(([w, y]) => { ctx.beginPath(); ctx.roundRect(r.x + 36 * k, r.y + y * k - 22 * k, (r.w - 72 * k) * w, 30 * k, 4 * k); ctx.fill(); });
    ctx.fillStyle = rgba(PAPER.ink, .3); for (let c = 0; c < 2; c++) for (let q = 0; q < 8; q++) { ctx.fillRect(r.x + (36 + c * 240) * k, r.y + (196 + q * 26) * k, (210 - (q === 7 ? 90 : (q * 37) % 40)) * k, 9 * k); }
    ctx.restore();
  }
  // ---------------------------------------------------------------- the device, the labels, the track (Leitbild coords, view VDEV)
  const SL8 = S.slotDoor(1), DEV = { x: SL8.x, y: SL8.y, w: SL8.w, h: SL8.h };
  const VDEV = { x: DEV.x, y: 590, s: 2.6 };
  const devRect = (v) => { const [x, y] = F.toScreen(v, DEV.x - DEV.w / 2, DEV.y - DEV.h); return { x, y, w: DEV.w * v.s, h: DEV.h * v.s, r: 9 * v.s }; };
  const pull = (t) => sineIO(span(t, A.dark + .05, A.dark + 2.0));
  const VTURN = { x: 920, y: 560, s: 1.04 };
  function leitView(t) {
    if (t < A.dark) return { ...VDEV, x: VDEV.x + 4 * Math.sin(t * .3), s: VDEV.s * (1 + .006 * (t - C4.end)) };
    const v0 = { ...VDEV, x: VDEV.x + 4 * Math.sin(A.dark * .3), s: VDEV.s * (1 + .006 * (A.dark - C4.end)) };
    const p = pull(t); let v = B.mixV(v0, F.V0, p);
    v = B.mixV(v, VTURN, sineIO(span(t, A.live - .3, A.how + .6)));
    return B.mixV(v, V7, sineIO(span(t, A.how + 1.2, R.b)));
  }
  function device(ctx, t, v, a) {
    if (a <= 0) return;
    F.inView(ctx, v, () => {
      ctx.save(); ctx.globalAlpha *= a; const x0 = DEV.x - DEV.w / 2, y0 = DEV.y - DEV.h;
      halo(ctx, DEV.x, DEV.y - DEV.h / 2, DEV.h * .7, .25, COOL.halo, COOL.core);
      ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.roundRect(x0, y0, DEV.w, DEV.h, 9); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = mixHex(P.night0, COOL.deep, .5); ctx.beginPath(); ctx.roundRect(x0 + 5, y0 + 14, DEV.w - 10, DEV.h - 40, 5); ctx.fill();
      B.machineDisc(ctx, t, DEV.x, y0 + DEV.h * .4, DEV.w * .26, { glow: .5 });
      ctx.fillStyle = rgba(CREAM, .5); ctx.beginPath(); ctx.arc(DEV.x, DEV.y - 13, 4, 0, TAU); ctx.fill();
      ctx.restore();
    });
  }
  function devLabels(ctx, t, v) {
    const out = span(t, A.dark - .3, A.dark + .3);
    B.inRef(ctx, v, VDEV, () => {
      const [dx, dy] = B.refPt(VDEV, DEV.x, DEV.y - DEV.h * .6);
      const l1 = span(t, C4.end + .45, C4.end + 1.1) * (1 - out), l2 = span(t, A.assist - .15, A.assist + .45) * (1 - out);
      if (l1 > 0) { F.lightLine(ctx, [[dx - 90, dy], [dx - 90 - 220 * expoOut(l1), dy]], 1, { w: 2, a: .6, glow: false }); F.label(ctx, TXT.e8.species, dx - 330, dy - 18, l1, { align: 'right', size: 28 }); }
      if (l2 > 0) { F.lightLine(ctx, [[dx + 90, dy], [dx + 90 + 220 * expoOut(l2), dy]], 1, { w: 2, a: .6, glow: false }); F.label(ctx, TXT.e8.assistant, dx + 330, dy - 18, l2, { align: 'left', size: 28, col: COOL.text }); }
      // the race: a track runs to the device; a stop bar drops across it
      const tu = span(t, A.wants - .1, A.wants + 1.0) * (1 - sineIO(out)), bar = span(t, A.stopped - .15, A.stopped + .3), [tx, ty] = B.refPt(VDEV, DEV.x, DEV.y - 6);
      if (tu > 0) F.track(ctx, [[-60, ty], [tx - 120, ty]], expoOut(tu), { gap: 30, lw: 3.5 });
      if (bar > 0) { const by = ty - 40 - (1 - expoOut(bar)) * 260, bx = tx - 210; ctx.save(); ctx.globalAlpha *= clamp(bar * 3) * (1 - out); ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(bx - 12, by - 60, 24, 120, 6); ctx.fill(); ctx.fillRect(bx - 46, by - 60, 92, 18); ctx.restore(); if (bar >= 1) halo(ctx, bx, ty - 40, 120, .3 * (1 - out) * (1 - span(t, A.stopped + .3, A.stopped + 1.2)), LAMP.body, LAMP.core); }
      F.label(ctx, 'STOP THE RACE · TEGMARK', tx - 520, ty - 150, span(t, A.stopped, A.stopped + .6) * (1 - out), { size: 28 });
    });
  }

  function draw(ctx, t) {
    // ------------------------------------------------ A: the row world → photo → room → clipping → C4
    if (t < C4.end - .1) {
      const v = F.viewPath(t, CAMA), fr = frameRect(t, v), mu = mPhoto(t), fl = flood(t), fo = fold(t);
      const pm = span(t, A.may, A.may + 2);
      F.yard(ctx, t, v, { lx: lerp(C4W.D8.x, v.x, pm), ly: lerp(C4W.D8.y - 100, v.y - 60, pm), pool: .8, rails: 1 - span(t, A.charge, C4.start) });
      if (fo < 1 || t < A.may) C4W.rowWorld(ctx, t, T, v, A4, { open8: .9 });
      // the room walls (the photo border flooding out; folding back into the window)
      const wallB = fl * (1 - fo) * 1500, border = lerp(0, 22, span(mu, 0, .6)) * (1 - fl) + wallB;
      if (mu > 0) {
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (mu < 1 && fl <= 0) { ctx.fillStyle = rgba(P.night0, .45 * mu); ctx.fillRect(0, 0, W, H); }
        // shadow + border (paper → the room wall)
        const wallCol = mixHex(PAPER.lit, mixHex(LAMP.deep, P.night1, .3), span(fl, 0, .5)), bw = border;
        if (bw > .5) { ctx.fillStyle = rgba(P.night0, .4 * (1 - fl)); ctx.fillRect(fr.x - bw + 8, fr.y - bw + 12, fr.w + bw * 2, fr.h + bw * 2);
          ctx.fillStyle = fl > 0 ? lin(ctx, 0, fr.y - bw, 0, fr.y + fr.h + bw, [[0, mixHex(wallCol, P.night0, .3 * fl)], [.75, wallCol], [.75, mixHex(wallCol, P.night1, .4 * fl)], [1, mixHex(wallCol, P.night0, .5 * fl)]]) : wallCol;
          ctx.beginPath(); ctx.rect(fr.x - bw, fr.y - bw, fr.w + bw * 2, fr.h + bw * 2); ctx.rect(fr.x + fr.w, fr.y, -fr.w, fr.h); ctx.fill('evenodd'); }
        // the inside: machines (door) → the photo → the city → the clipping
        ctx.beginPath(); ctx.rect(fr.x, fr.y, fr.w, fr.h); ctx.save(); ctx.clip();
        if (fl < 1) { ctx.save(); ctx.globalAlpha *= span(mu, 0, .45) * (1 - span(fl, .3, .7)); photoContent(ctx, t, fr, 1, mu); ctx.restore(); if (mu < .45) { ctx.save(); ctx.globalAlpha *= 1 - span(mu, 0, .45); C4W.machinesInner(t, v)(ctx, { x0: fr.x, y0: fr.y, w: fr.w, h: fr.h }); ctx.restore(); } }
        if (fl > .3) { ctx.save(); ctx.globalAlpha *= span(fl, .3, .7); city(ctx, t, fr); ctx.restore(); }
        clipping(ctx, t, fr, span(t, A.may + .2, A.may + 1.1));
        ctx.restore();
        // the window frame (mullions) while it is a window
        const wf = span(fl, .5, 1) * (1 - span(t, A.may + .1, A.may + .6));
        if (wf > 0) { ctx.strokeStyle = rgba(mixHex(LAMP.deep, P.night0, .5), wf); ctx.lineWidth = 16; ctx.strokeRect(fr.x, fr.y, fr.w, fr.h); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(fr.x + fr.w / 2, fr.y); ctx.lineTo(fr.x + fr.w / 2, fr.y + fr.h); ctx.moveTo(fr.x, fr.y + fr.h * .42); ctx.lineTo(fr.x + fr.w, fr.y + fr.h * .42); ctx.stroke();
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(COOL.halo, .08 * wf); ctx.beginPath(); ctx.moveTo(fr.x, fr.y + fr.h); ctx.lineTo(fr.x + fr.w, fr.y + fr.h); ctx.lineTo(fr.x + fr.w + 260, H); ctx.lineTo(fr.x - 380, H); ctx.closePath(); ctx.fill(); ctx.restore(); }
        // you at the window (back view), you applaud; when the room folds you walk out to the left
        const inRoom = span(fl, .45, 1);
        if (inRoom > 0 && fo < .7) {
          const ex = sineIO(span(t, A.applaud + 1.45, A.may + 1.2)), clap = t > A.applaud - .1 && t < A.applaud + 1.5 ? Math.abs(Math.sin((t - A.applaud + .1) * Math.PI * 2.6)) : -1;
          const arms = clap >= 0 ? { armR: [lerp(.55, .42, clap), lerp(-1.1, -1.75, clap)], armL: [lerp(-.55, -.42, clap), lerp(1.1, 1.75, clap)] } : {};
          const yx = lerp(lerp(fr.x + fr.w * .5, 1150, inRoom), -260, ex);
          ctx.save(); ctx.globalAlpha *= span(inRoom, 0, .4); F.du(ctx, yx, 990, 430, { hood: false, dir: ex > 0 ? -1 : 1, view: ex > 0 && ex < 1 ? 'side' : 'back', walk: ex > 0 && ex < 1 ? t * 6.5 : undefined, light: 1, back: .55, look: .3, ...arms }); ctx.restore();
        }
        ctx.restore();
      }
      F.scenarioTag(ctx, span(t, A.quiet - .1, A.quiet + .4) * (1 - span(t, A.may - .2, A.may + .3)));
      F.big(ctx, 'DESCENDANTS', W / 2, 126, 70, span(t, R.a + .4, R.a + 1.1) * (1 - span(t, A.quiet - .6, A.quiet - .1)), { gold: 0 });
      // the switch tag, its mini tag to the counter; the source
      const tg = span(t, A.may + .9, A.may + 1.5), tOut = span(t, A.charge + .4, A.charge + 1.0);
      if (tg > 0 && tOut < 1) { F.switchTag(ctx, t, 1500, 300, F.END[8].tag, tg, { out: tOut }); B.tagToHud(ctx, t, T, 8, [1500, 300]); }
      F.source(ctx, t, A.may + 1.0, A.charge + 1.0, TXT.e8.src);
      // the clipping unfolds into the clip plate
      const mm = sineIO(span(t, A.charge + 1.0, C4.start));
      if (mm > 0 && t < C4.end + .6) {
        F.clipPlate(ctx, t, T, 'C4', { from: { x: CL.x, y: CL.y, w: CL.w, h: CL.h, r: 2 }, morph: mm });
        const pa = 1 - span(mm, 0, .45); if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; const r = lr(CL, F.clipRect('C4'), mm); clipping(ctx, t, r, 1); ctx.restore(); }
      }
      F.counterHud(ctx, t, T);
      return;
    }
    // ------------------------------------------------ B: the device on the yard → the Leitbild (the turn)
    const v = leitView(t), p = pull(t);
    const yv = { x: v.x + 3600, y: v.y - 1200, s: v.s };   // the yard keeps its rails continuous with part A (same pitch)
    F.yard(ctx, t, yv, { lx: yv.x, ly: yv.y - 60, pool: .8, rails: span(t, C4.end + .3, C4.end + 1.2) * (1 - p) });
    if (p > 0) { ctx.save(); ctx.globalAlpha *= sineIO(span(p, 0, .7)); S.plain(ctx, t, v, { stars: 1 }); ctx.restore(); }
    const rise = (i) => (i === 1 ? 1 : sineIO(span(t, A.dark + .2 + Math.abs(i - 1) * .07, A.dark + 1.2 + Math.abs(i - 1) * .07)));
    const darken = (r) => span(t, A.dark + 1.0 + (12 - r) * .14, A.dark + 1.6 + (12 - r) * .14);
    const crack = (r) => sineIO(span(t, A.live - .15 + (7 - r) * .07, A.live + .55 + (7 - r) * .07));
    if (t > A.dark - .05) {
      S.leitbild(ctx, t, { v, bg: false, beams: p, stars: 0, slots: (i) => { const o = turnSlots(t, { rise, darken, crack })(i); if (i === 1) o.a = span(t, A.dark + .1, A.dark + .7); return o; },
        you: { ...S.YOU0, a: span(t, A.dark + .6, A.dark + 1.4), look: .1 + .25 * span(t, A.live, A.live + 1) } });
      // the tags over the five dark doors
      F.inView(ctx, v, () => { for (let i = 0; i < 12; i++) { const r = F.THUMB_ORDER[i]; if (r < 8) continue; const d = S.thumbSlot(i); F.miniTag(ctx, d.x, d.y - d.h - 22, darken(r), r); } });
    }
    // the device (its light becomes door 8's) + labels + the track
    if (t < C4.end + .6) { const back = span(t, C4.end - .05, C4.end + .55); F.clipPlate(ctx, t, T, 'C4', { from: devRect(v), morph: 1 - back }); }
    device(ctx, t, v, span(t, C4.end + .2, C4.end + .6) * (1 - span(t, A.dark + .15, A.dark + .8)));
    devLabels(ctx, t, v);
    // FROM HERE ON, YOU LIVE. · HOW?
    const [l1, l2] = TXT.e8.live.split('. ');
    const out = span(t, A.how + 1.0, A.how + 1.6);
    F.big(ctx, l1 + '.', W / 2, 236, 78, span(t, A.live - .05, A.live + .7) * (1 - out), { gold: .55 });
    F.big(ctx, l2, W / 2, 332, 78, span(t, A.how + .05, A.how + .7) * (1 - out), { gold: .2 });
    F.counterHud(ctx, t, T);
  }
  return [{ t: R.a, draw, print: F.PRINT71 }];
}
