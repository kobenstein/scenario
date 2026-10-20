// Chunk C02 · Film 4 minute 1 in the Film 5 machinery · shots 2.01–2.07 (bild/shots.md) · "It sounds" (00c) → "But that's not" (01a)
// export default (T, R) => [{ t, draw(ctx, t, s), tr, d, x, y, depth, print, sound }, …]   (every frame a pure function of t)
//
// PLAN (gate 1). Anchors are VO words (T.S/T.E), never seconds; times only for reading.
//  shot │ words (accent)                                   │ hero onset                                          │ carrier → next                          │ tr in
//  2.01 │ It sounds like a **daydream**.                    │ c01's wall shrinks into an engraved vignette on a    │ the ghost dots drift up-left and gather │ out (c01's wall
//       │                                                  │ sheet floating in the dark (slip still glowing); on  │ into the stage spotlight cone           │  → vignette)
//       │                                                  │ "daydream" its lines turn to ghost dots and smoke    │                                         │
//  2.02 │ But the people building AI are now saying it     │ the cone lands on a lectern (small silhouette, no    │ the lit screen → the camera pushes in   │ cut (plan seq.)
//       │ **on stage**.                                    │ face); the sheet falls away and the dark hall shows  │                                         │
//       │                                                  │ (audience backs); the screen lights on "on stage"    │                                         │
//  2.03 │ (clip M, Musk)                                   │ the push lands: the real clip fills the screen       │ screen goes dark, its frame collapses   │ cut (plan seq.)
//       │                                                  │ (pillarboxed, blurred sides), lower third left       │ into a line                             │
//  2.04 │ He gives it **ten**, maybe **twenty** years.     │ the line opens into an engraved ruler, a burin cuts  │ the dotted part of the bracket          │ cut (plan seq.)
//       │                                                  │ the years; amber bracket to 2035 on "ten", dotted    │                                         │
//       │                                                  │ extension to 2045 on "twenty"                        │                                         │
//  2.05 │ And he adds a **condition**.                     │ the dotted years gather into a ring = a ghost seal,  │ the seal on the ruler                   │ cut (plan seq.)
//       │                                                  │ engraved IF, it lands on the ruler at "condition"    │                                         │
//  2.06 │ If AI and robots keep getting **better**.        │ slabs rise out of the seal one per word, each a finer│ the stairs climb out of frame (up)      │ cut (plan seq.)
//       │                                                  │ engraving; camera climbs; the amber light above grows│                                         │
//  2.07 │ He thinks they **will**.                         │ camera tilts up: dotted ghost steps above; on "will" │ the camera settles high → c03 'down'    │ cut (plan seq.)
//       │                                                  │ the burin engraves them solid, the light warms       │                                         │
// ★ none (the chunk is a calm bridge; the hard accent is the seal landing). Carrier chain: wall → (out) vignette → ghost dots → cone →
//   lectern/screen → (push) clip → screen frame → ruler line → dotted bracket → seal → stairs → (c03 'down') foot of the stairs.
// Sound (pauses where possible): whoosh_airy (dots rise, after "daydream"), lamp (screen on), whoosh (push), screen_off + tape_measure
//   (pause after the clip), stamp (seal lands, end of "condition"), whoosh_up (steps on "better"), foil_glint (after "will").
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { clipScreen } from '../lib/kit.mjs';
import { ghostLine, burinTip } from '../lib/ghost.mjs';
import { nightBG, motes, VIG, vigLines, vigLayer, SHEET, sheetLayer, dotsOf, STAGE, stageLayer, lectern, audienceRow, rimRow, coneLayer, speaker,
  screenRosette, RULER, yearX, rulerLayer, ifSeal, STEP, slabLayer, AMBER, CORE, CREAM, ICE, CYAN, TAU, strokePoly } from '../lib/sc02_m1.mjs';

const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
const eo5 = (x) => 1 - Math.pow(1 - clamp(x), 5);                                                   // expo-ish out (landings)
const lerpCam = (a, b, k) => ({ cx: mix(a.cx, b.cx, k), cy: mix(a.cy, b.cy, k), s: Math.exp(mix(Math.log(a.s), Math.log(b.s), k)) });
const apply = (ctx, C) => { ctx.translate(W / 2, H / 2); ctx.scale(C.s, C.s); ctx.translate(-C.cx, -C.cy); };
const toS = (C, x, y) => [(x - C.cx) * C.s + W / 2, (y - C.cy) * C.s + H / 2];
function label(ctx, s, x, y, a, o = {}) { if (a <= 0) return; ctx.save(); ctx.shadowColor = 'rgba(2,3,12,.85)'; ctx.shadowBlur = 12; text(ctx, s, x, y, { size: o.size ?? 18, weight: o.weight ?? 600, color: rgba(o.col || CREAM, a * (o.alpha ?? .92)), spacing: o.spacing ?? 5, align: o.align || 'left', font: o.font || 'Inter' }); ctx.restore(); }

export default (T, R) => {
  const S0 = (p, n) => T.S('00c', p, n), E0 = (p, n) => T.E('00c', p, n), S1 = (p, n) => T.S('01a', p, n), E1 = (p, n) => T.E('01a', p, n);
  const clip = T.clip('M');
  const A = {
    t0: R.first, day: S0('daydream'), dayE: E0('daydream'), but: S0('But'), onst: S0('on stage'), stageE: E0('on stage'),
    c0: clip.start, c1: clip.end,
    he: S1('He gives'), ten: S1('ten'), twenty: S1('twenty'), yearsE: E1('twenty years'),
    and: S1('And he adds'), cond: S1('condition'), condE: E1('condition'),
    if: S1('If AI'), ai: S1('AI and'), robots: S1('robots'), keep: S1('keep'), getting: S1('getting'), better: S1('better'), betterE: E1('better'),
    he2: S1('He thinks'), will: S1('will'), willE: E1('will'), end: R.b,
  };
  A.push0 = A.stageE - .35; A.push1 = A.push0 + 1.15;            // the camera flies into the screen in the breath before the clip
  A.land = A.condE - .05;                                          // the seal touches the ruler at the end of "condition"
  A.steps = [A.if, A.ai, A.robots, A.keep, A.getting, A.better - .12, A.better + .16];   // one slab per beat, the last two on "better"

  // ════════════════ 2.01 the sheet with the wall vignette ════════════════
  const DEPTH = W / VIG.w, OX = 900, OY = 468;                      // c01's frame shrinks exactly into the vignette (tr 'out')
  const sheetM = (t) => {
    const pull = eout(lin(A.t0 + .3, A.t0 + 2.4, t)), drop = ein(lin(A.dayE - .25, A.dayE + .7, t));
    return { x: OX - 46 * pull + 70 * drop + drift(t, 4, 1) * pull, y: OY - 14 * pull + 900 * drop + drift(t, 3, 2) * pull, s: 1 - .13 * pull, r: -.032 * pull + .006 * Math.sin(t * .6) * pull + .32 * drop };
  };
  const mapV = (M, px, py) => { const dx = (px - VIG.w / 2) * M.s, dy = (py - VIG.h / 2) * M.s, c = Math.cos(M.r), s = Math.sin(M.r); return [M.x + dx * c - dy * s, M.y + dx * s + dy * c]; };
  // the ghost dots: every engraved line of the vignette as dots; each one leaves, drifts as smoke, then joins the spotlight cone
  const DOTS = (() => {
    const r = prng(77), P = STAGE.spot, Q = STAGE.pool;
    return dotsOf(vigLines(), 6.5).map((d) => {
      const u = Math.sqrt(r()), lat = (r() * 2 - 1) * (.18 + .82 * u) * .74;
      return { ...d, ts: A.day + .18 + r() * .55, tc: A.dayE - .2 + r() * .5, r2: r(), r3: r(),
        tx: mix(P.x, Q.x, u) + lat * Q.rx * u, ty: mix(P.y + 10, Q.y - 6, u) + (r() - .5) * 14 * u };
    });
  })();
  function sheetPhase(ctx, t) {
    const M = sheetM(t), L = sheetLayer(), V = vigLayer(), gk = sm(lin(A.day - .02, A.day + .32, t));
    if (M.y < H + 700) {
      ctx.save(); ctx.translate(M.x, M.y); ctx.rotate(M.r); ctx.scale(M.s, M.s);
      // soft shadow under the floating sheet
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 18; ctx.shadowOffsetY = 28; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(-VIG.w / 2 - SHEET.vx, -VIG.h / 2 - SHEET.vy, SHEET.w, SHEET.h); ctx.restore();
      ctx.drawImage(L.c, -VIG.w / 2 - SHEET.vx - L.pad, -VIG.h / 2 - SHEET.vy - L.pad, L.c.width / L.K, L.c.height / L.K);
      // the vignette: solid engraving, then (on "daydream") only the paper is left while its lines become dots
      ctx.globalAlpha = 1 - gk * .82; ctx.drawImage(V, -VIG.w / 2, -VIG.h / 2, VIG.w, VIG.h); ctx.globalAlpha = 1;
      if (gk > 0) { ctx.fillStyle = rgba('#e6dcc3', gk * .55); ctx.fillRect(-VIG.w / 2, -VIG.h / 2, VIG.w, VIG.h); }
      // the slip is still glowing (the money is fine)
      const S = VIG.slip, sx = S.x + S.w / 2 - VIG.w / 2, sy = S.y + S.h / 2 - VIG.h / 2, pulse = .85 + .15 * Math.sin(t * 2.1);
      addGlow(ctx, sx, sy, 150, .32 * pulse * (1 - gk * .9), AMBER, CORE);
      ctx.restore();
    }
    return { M, gk };
  }
  function dotsPhase(ctx, t, M0, gk, coneA) {
    if (gk <= 0) return;
    const fade = 1 - sm(lin(A.but + .35, A.but + .95, t)); if (fade <= 0) return;
    ctx.save();
    const Mts = new Map();
    for (const d of DOTS) {
      let x, y, q = clamp((t - d.ts) / 1.3);
      if (t < d.ts) [x, y] = mapV(M0, d.x, d.y);
      else {
        const key = Math.round(d.ts * 50); let Mt = Mts.get(key); if (!Mt) { Mt = sheetM(d.ts); Mts.set(key, Mt); }
        [x, y] = mapV(Mt, d.x, d.y);
        const dist = Math.pow(q, 1.5) * (90 + 150 * d.r2), n = 4, st = dist / n, wa = Math.atan2(-1, -.42);
        for (let i = 0; i < n; i++) { const f = Math.sin(x * .011 + t * .5) + Math.sin(y * .013 - t * .37 + x * .004) + Math.sin((x + y) * .007 + d.r3 * 6), an = wa + f * .5; x += Math.cos(an) * st; y += Math.sin(an) * st; }
      }
      const kc = eio(clamp((t - d.tc) / .8));
      if (kc > 0) { x = mix(x, d.tx + Math.sin(t * 1.3 + d.r2 * 9) * 3, kc); y = mix(y, d.ty + Math.cos(t * 1.1 + d.r3 * 9) * 3, kc); }
      const warm = Math.max(kc, d.kind === 'foil' ? .8 : 0), air = sm(clamp(q * 4)), al = (d.kind === 'wall' ? .6 : .95) * gk * fade * (1 - coneA * .5);
      if (air < .5 && warm < .5) ctx.fillStyle = `rgba(58,44,34,${al * (d.kind === 'wall' ? .7 : 1)})`;
      else ctx.fillStyle = warm > .5 ? `rgba(255,${Math.round(mix(226, 186, warm))},${Math.round(mix(190, 110, warm))},${al})` : `rgba(246,236,214,${al * .85})`;
      const z = 1.7 + q * .9; ctx.fillRect(x - z / 2, y - z / 2, z, z);
    }
    ctx.restore();
  }

  // ════════════════ 2.02 · 2.03 the stage, the push, the clip ════════════════
  const STAGE0 = { cx: 960, cy: 540, s: 1 }, SC = STAGE.scr, SCC = [SC.x + SC.w / 2, SC.y + SC.h / 2];
  const PUSHS = 1400 / SC.w, PUSHT = { cx: SCC[0] - (1000 - 960) / PUSHS, cy: SCC[1] - (468 - 540) / PUSHS, s: PUSHS };
  const stageCam = (t) => {
    const p = eio(lin(A.push0, A.push1, t)), creep = 1 + .022 * sm(lin(A.push1, A.c1 + .4, t));
    const C = lerpCam(STAGE0, PUSHT, p); C.s *= creep;
    const dr = 1 - p * .8; C.cx += drift(t, 7, 3) * dr; C.cy += drift(t, 4, 5) * dr; return C;
  };
  const [pc, pg] = canvas(456, 810), [bc, bg] = canvas(16, 9);
  function screenPicture(ctx, t, C) {
    const lit = eout(lin(A.onst, A.onst + .55, t)), on = sm(lin(A.c0 - .6, A.c0, t)), off = sm(lin(A.c1, A.c1 + .3, t));
    ctx.save(); ctx.beginPath(); ctx.rect(SC.x, SC.y, SC.w, SC.h); ctx.clip();
    if (lit > 0 && on < 1) {   // the keynote picture: a cyan guilloche rosette that opens from the centre
      ctx.save(); ctx.beginPath(); ctx.arc(SCC[0], SCC[1], 20 + lit * SC.w * .62, 0, TAU); ctx.clip(); ctx.globalAlpha = lit; ctx.drawImage(screenRosette(), SC.x, SC.y); ctx.restore();
      const rg = ctx.createRadialGradient(SCC[0], SCC[1], 0, SCC[0], SCC[1], 260); rg.addColorStop(0, rgba(ICE, .25 * lit * (.8 + .2 * Math.sin(t * 2)))); rg.addColorStop(1, rgba(ICE, 0));
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg; ctx.fillRect(SC.x, SC.y, SC.w, SC.h); ctx.globalCompositeOperation = 'source-over';
    }
    if (on > 0) {
      pg.clearRect(0, 0, 456, 810); clipScreen(pg, t, T, 'M', 0, 0, 456, 810, { bezel: false, glow: false, radius: 0 });
      // the clip is vertical: on the wide stage screen it runs pillarboxed over a blurred, darkened copy of itself
      bg.clearRect(0, 0, 16, 9); bg.drawImage(pc, 0, 270, 456, 256, 0, 0, 16, 9);
      ctx.globalAlpha = on; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(bc, SC.x - 20, SC.y - 20, SC.w + 40, SC.h + 40);
      ctx.fillStyle = 'rgba(4,6,20,.55)'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
      const ph = SC.h, pw = ph * 608 / 1080, px = SCC[0] - pw / 2;
      ctx.drawImage(pc, px, SC.y, pw, ph);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(px - 3, SC.y, 3, ph); ctx.fillRect(px + pw, SC.y, 3, ph);
      ctx.globalAlpha = 1;
    }
    if (off > 0) { ctx.fillStyle = rgba('#03040c', off * .92); ctx.fillRect(SC.x, SC.y, SC.w, SC.h); }
    ctx.restore();
    return { lit, on };
  }
  function stagePhase(ctx, t, reveal) {
    const C = stageCam(t), L = stageLayer(), coneA = sm(lin(A.dayE + .05, A.but + .65, t)), p = eio(lin(A.push0, A.push1, t));
    ctx.save(); ctx.globalAlpha = reveal; apply(ctx, C); ctx.drawImage(L.c, -L.ox, -L.oy);
    const pic = screenPicture(ctx, t, C), lit = pic.lit;
    // the screen's light into the hall (cool), the spot (amber, the hero until the screen wakes)
    addGlow(ctx, SCC[0], SCC[1], 820, .16 * lit * (1 - p * .6), CYAN, ICE);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = reveal * coneA * (1 - .35 * lit) * (.93 + .07 * Math.sin(t * 1.7)); ctx.drawImage(coneLayer(), 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = reveal;
    const Lc = lectern(), lx = STAGE.lect.x, ly = STAGE.lect.bot;
    speaker(ctx, lx - 6, STAGE.lect.top - 72, 1, t, coneA);
    ctx.drawImage(Lc.c, lx - Lc.w / 2 - Lc.pad, ly - Lc.h - Lc.pad);
    addGlow(ctx, lx - 30, STAGE.lect.top - 10, 150, .2 * coneA, AMBER, CORE);
    ctx.restore();
    // the audience rows: closer rows grow faster in the push (parallax) and fall out of the frame
    for (let k = 2; k >= 0; k--) {
      const f = [2.3, 1.75, 1.4][k], Ck = { ...C, s: Math.pow(C.s, f) }, out = 1 - sm(lin(.35, .9, p));
      if (out <= 0) continue;
      ctx.save(); ctx.globalAlpha = reveal * out; apply(ctx, { ...Ck, cy: C.cy + (Ck.s - C.s) * -30 }); ctx.translate(drift(t, 3, k + 4), 0);
      ctx.drawImage(audienceRow(k), -200, -150);
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = reveal * out * lit * .75; ctx.drawImage(rimRow(k, '#b8e4ff'), -200, -150);
      ctx.globalAlpha = reveal * out * coneA * (1 - lit) * .4; ctx.drawImage(rimRow(k, '#ffc98a'), -200, -150);
      ctx.restore();
    }
    return { C, lit };
  }
  // the lower third of the clip (name, role, source), on the dark blurred margin left of the clip, above the subtitle zone
  function lowerThird(ctx, t) {
    const a = eout(lin(A.c0 + .2, A.c0 + .85, t)) * (1 - sm(lin(A.c1 - .3, A.c1 + .05, t))); if (a <= 0) return;
    const x = 352, y = 652;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = AMBER; ctx.fillRect(x, y - 38, 3, 128 * eout(lin(A.c0 + .2, A.c0 + .7, t))); ctx.restore();
    const rise = (k) => (1 - eout(lin(A.c0 + .25 + k * .08, A.c0 + .9 + k * .08, t))) * 14;
    ctx.save(); ctx.beginPath(); ctx.rect(x + 14, y - 50, 470, 160); ctx.clip();
    label(ctx, 'Elon Musk', x + 20, y + rise(0), a, { size: 44, font: 'Instrument Serif', weight: 400, spacing: 0 });
    label(ctx, 'CEO OF TESLA', x + 21, y + 32 + rise(1), a, { size: 17, spacing: 4, alpha: .85 });
    label(ctx, 'U.S.–SAUDI INVESTMENT FORUM', x + 21, y + 58 + rise(2), a, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 });
    label(ctx, 'NOV 19, 2025', x + 21, y + 82 + rise(3), a, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 });
    ctx.restore();
  }

  // ════════════════ 2.04 – 2.07 the ruler, the seal, the stairs (one world, one camera) ════════════════
  const K = {
    r0: { cx: 960, cy: 540, s: 1 }, r1: { cx: 1020, cy: 520, s: 1.035 }, seal: { cx: 1180, cy: 470, s: 1.1 },
    stairs: { cx: 1820, cy: 150, s: .74 }, high: { cx: 2380, cy: -330, s: .72 },
  };
  const worldCam = (t) => {
    let C;
    if (t < A.and - .1) C = lerpCam(K.r0, K.r1, sm(lin(A.c1 + .6, A.and - .1, t)));
    else if (t < A.if - .1) C = lerpCam(K.r1, K.seal, qio(lin(A.and - .1, A.cond + .1, t)));
    else if (t < A.he2 - .15) C = lerpCam(K.seal, K.stairs, qio(lin(A.if - .1, A.betterE + .1, t)));
    else C = lerpCam(K.stairs, K.high, eout(lin(A.he2 - .15, A.end + .9, t)) * .85 + qio(lin(A.he2 - .15, A.end + .9, t)) * .15);
    return { cx: C.cx + drift(t, 6, 7) / C.s, cy: C.cy + drift(t, 4, 8) / C.s, s: C.s };
  };
  const YB = RULER.y - RULER.h / 2 - 36, SEAL = { x: yearX(2040), y: RULER.y, hy: 292, r: 84 };
  const BR_SOLID = [[yearX(2025), YB + 24], [yearX(2025), YB], [yearX(2035), YB], [yearX(2035), YB + 24]];
  const BR_DOT = [[yearX(2035), YB], [yearX(2045), YB], [yearX(2045), YB + 24]];
  const PITCH = 9, DOTP = (() => { const out = []; let acc = 0; for (let i = 1; i < BR_DOT.length; i++) { const [x0, y0] = BR_DOT[i - 1], [x1, y1] = BR_DOT[i], L = Math.hypot(x1 - x0, y1 - y0); while (acc <= L) { out.push([mix(x0, x1, acc / L), mix(y0, y1, acc / L)]); acc += PITCH; } acc -= L; } return out; })();
  const stepPos = (i) => [SEAL.x + 26 + i * STEP.run, SEAL.y - 66 - i * STEP.rise];
  const NSOLID = A.steps.length, NGHOST = 5;
  const topLight = (() => { const [x, y] = stepPos(NSOLID + NGHOST); return [x + 120, y - 120]; })();
  // the dust burst when the seal lands
  const DUST = (() => { const r = prng(5), out = []; for (let i = 0; i < 46; i++) out.push({ a: -Math.PI * r(), v: 90 + r() * 260, life: .5 + r() * .7, z: .8 + r() * 1.8 }); return out; })();
  function worldPhase(ctx, t, collapse) {
    const C = worldCam(t), RL = rulerLayer();
    nightBG(ctx, t, { dx: (960 - C.cx) * .15 + drift(t, 8, 2), dy: (540 - C.cy) * .15 });
    // the hero light above the stairs: it grows with the climb
    const climb = sm(lin(A.if, A.betterE + .3, t)), warm = sm(lin(A.he2, A.willE + .2, t));
    { const [lx, ly] = toS(C, ...topLight); addGlow(ctx, lx, ly, 1100 * C.s, (.2 * climb + .26 * warm), AMBER, CORE); addGlow(ctx, lx, ly, 260 * C.s, (.25 * climb + .35 * warm), AMBER, CORE); }
    motes(ctx, t, 21, 70, .7);
    ctx.save(); apply(ctx, C);
    // the ruler: opens out of the collapsed screen line, then the burin cuts the scale left to right
    const open = eout(lin(A.c1 + .5, A.c1 + .85, t)), land = t > A.land + .04 ? 4.5 * Math.exp(-(t - A.land - .04) * 7) * Math.cos((t - A.land) * 22) : 0;
    const bx = mix(yearX(2014), yearX(2056), eio(lin(A.c1 + .6, A.he + .58, t)));
    if (open > 0) {
      ctx.save(); ctx.translate(0, RULER.y + land); ctx.scale(1, open);
      ctx.drawImage(RL.c, RL.left - RL.pad, -RULER.h / 2 - RL.pad);
      ctx.save(); ctx.beginPath(); ctx.rect(RL.left - RL.pad, -RULER.h, bx - RL.left + RL.pad, RULER.h * 2); ctx.clip(); ctx.drawImage(RL.sc, RL.left - RL.pad, -RULER.h / 2 - RL.pad); ctx.restore();
      ctx.restore();
      if (bx < yearX(2055)) burinTip(ctx, bx, RULER.y, 0, t, { size: 15 });
    }
    // the bracket: amber to 2035 on "ten", dotted to 2045 on "twenty"; the dotted years gather into the seal
    const fadeBr = 1 - .6 * sm(lin(A.if, A.if + .8, t));
    const uTen = eout(lin(A.ten, A.ten + .7, t));
    if (uTen > 0) {
      const g = ghostLine(ctx, BR_SOLID, { ghost: 0, u: uTen, col: '#ffd59a', w: 3, glow: AMBER, a: fadeBr });
      if (uTen < .999) { const L = [[...BR_SOLID[0]], ...BR_SOLID.slice(1)], d = []; let s = 0; for (let i = 1; i < L.length; i++) { const l = Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]); d.push([s, l, i]); s += l; }
        const tot = s * uTen; for (const [s0, l, i] of d) if (tot <= s0 + l) { const q = (tot - s0) / l, x = mix(L[i - 1][0], L[i][0], q), y = mix(L[i - 1][1], L[i][1], q); burinTip(ctx, x, y, Math.atan2(L[i][1] - L[i - 1][1], L[i][0] - L[i - 1][0]), t, { size: 13 }); break; } }
    }
    const uTw = eout(lin(A.twenty, A.twenty + .75, t)), gather = eio(lin(A.and - .05, A.and + .6, t));
    if (uTw > 0 && gather <= 0) ghostLine(ctx, BR_DOT, { ghost: 1, u: uTw, col: '#ffd59a', w: 3.4, dot: PITCH, a: .85 });
    const engrave = eio(lin(A.and + .5, A.and + 1.05, t));
    if (gather > 0 && engrave < 1) {   // each dot of the dotted decade flies to its place on the seal's ring
      const hov = SEAL.hy + Math.sin(t * 2) * 5;
      ctx.save(); ctx.fillStyle = '#ffd59a';
      DOTP.forEach(([x0, y0], j) => { const k = eio(clamp(gather * 1.4 - j / DOTP.length * .4)), a = -Math.PI / 2 + j / DOTP.length * TAU, R2 = SEAL.r * 1.04;
        const x = mix(x0, SEAL.x + Math.cos(a) * R2, k), y = mix(y0, hov + Math.sin(a) * R2, k) - Math.sin(Math.PI * k) * 40, past = ((j / DOTP.length) < engrave);
        if (past) return; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(x, y, 1.9, 0, TAU); ctx.fill(); });
      ctx.restore();
    }
    // labels over the bracket (world space, the camera barely moves while they are read)
    label(ctx, 'TEN YEARS', (yearX(2025) + yearX(2035)) / 2, YB - 22, eout(lin(A.ten + .4, A.ten + .9, t)) * fadeBr, { align: 'center', size: 24, col: '#ffd59a' });
    label(ctx, 'MAYBE TWENTY', (yearX(2035) + yearX(2045)) / 2, YB - 22, eout(lin(A.twenty + .35, A.twenty + .85, t)) * (1 - sm(lin(A.and - .1, A.and + .25, t))), { align: 'center', size: 24, col: '#ffd59a', alpha: .62 });
    // the seal: engraved round by the burin while it hovers, lands on "condition"
    if (engrave > 0) {
      const drop = ein(lin(A.land - .36, A.land, t)), y = mix(SEAL.hy + Math.sin(t * 2) * 5, SEAL.y + land * .4, drop), sq = t > A.land ? 1 - .05 * Math.exp(-(t - A.land) * 10) : 1;
      // shadow on the ruler, tightening as it comes down
      ctx.save(); ctx.translate(SEAL.x + 10, SEAL.y + 16); ctx.scale(1, .32); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, SEAL.r * mix(1.7, 1.05, drop)); sg.addColorStop(0, `rgba(20,10,4,${mix(.12, .5, drop)})`); sg.addColorStop(1, 'rgba(20,10,4,0)'); ctx.fillStyle = sg; ctx.fillRect(-300, -300, 600, 600); ctx.restore();
      ctx.save(); ctx.translate(SEAL.x, y); ctx.scale(1 / sq, sq); ifSeal(ctx, 0, 0, SEAL.r, t, { wipe: engrave, rot: -.05 + .05 * drop, glint: t > A.land ? lin(A.land, A.land + .9, t) : null }); ctx.restore();
      if (engrave < 1) { const a = -Math.PI / 2 + engrave * TAU; burinTip(ctx, SEAL.x + Math.cos(a) * SEAL.r, y + Math.sin(a) * SEAL.r, a + Math.PI / 2, t, { size: 14 }); }
      addGlow(ctx, SEAL.x, y, 260, .16 * (1 - climb * .5), AMBER, CORE);
      if (t > A.land) { const dt = t - A.land; ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (const d of DUST) { if (dt > d.life) continue; const q = dt / d.life, x = SEAL.x + Math.cos(d.a) * (SEAL.r * .9 + d.v * eout(q) * .6), yy = SEAL.y + 20 + Math.sin(d.a) * d.v * eout(q) * .25 - q * 30; ctx.fillStyle = rgba(q < .3 ? CORE : AMBER, (1 - q) * .8); ctx.fillRect(x, yy, d.z, d.z); }
        ctx.restore(); }
    }
    // the stairs: slabs rise out of the seal, one per beat, each a finer engraving; above them dotted ghost steps, engraved on "will"
    for (let i = NSOLID + NGHOST - 1; i >= 0; i--) {
      const [x, y] = stepPos(i), Sl = slabLayer(i), D = STEP.D;
      if (i < NSOLID) {
        const k = eo5(lin(A.steps[i], A.steps[i] + .55, t)); if (k <= 0) continue;
        const [px, py] = i ? stepPos(i - 1) : [SEAL.x - 50, SEAL.y - 20];
        ctx.save(); ctx.globalAlpha = sm(clamp(k * 3)); ctx.drawImage(Sl.c, mix(px, x, k) - Sl.pad, mix(py, y, k) - Sl.pad + D[1]); ctx.restore();
        const fl = Math.exp(-Math.pow((t - A.steps[i] - .35) / .2, 2)); if (fl > .02) addGlow(ctx, x + STEP.run * .6, y, 160, .35 * fl, AMBER, CORE);
      } else {
        const j = i - NSOLID, show = sm(lin(A.betterE + .1 + j * .12, A.betterE + .6 + j * .12, t)), burn = eio(lin(A.will - .05 + j * .1, A.will + .45 + j * .1, t));
        if (show <= 0) continue;
        if (burn > 0) { ctx.save(); ctx.globalAlpha = burn; ctx.drawImage(Sl.c, x - Sl.pad, y - Sl.pad + D[1]); ctx.restore(); }
        const P = [[x, y + STEP.th], [x, y], [x + D[0], y + D[1]], [x + STEP.run + D[0], y + D[1]], [x + STEP.run + D[0], y + D[1] + STEP.th], [x + STEP.run, y + STEP.th], [x, y + STEP.th]];
        ghostLine(ctx, P, { ghost: 1, col: '#f6e6c4', w: 2.2, dot: 8, a: show * (1 - burn) * .85 });
        ghostLine(ctx, [[x, y], [x + STEP.run, y], [x + STEP.run + D[0], y + D[1]]], { ghost: 1, col: '#f6e6c4', w: 2.2, dot: 8, a: show * (1 - burn) * .85 });
        if (burn > 0 && burn < 1) burinTip(ctx, x + STEP.run * burn, y, 0, t, { size: 14 });
      }
    }
    ctx.restore();
    // the source of the numbers (screen space, steady)
    label(ctx, 'ELON MUSK · U.S.–SAUDI INVESTMENT FORUM · NOV 19, 2025', 96, H - 200, eout(lin(A.ten + .2, A.ten + .9, t)) * (1 - sm(lin(A.if - .2, A.if + .4, t))), { size: 16, weight: 500, spacing: 2.5, col: '#c9c3dc', alpha: .8 });
    return C;
  }

  function collapseFrame(ctx, t, collapse, C = worldCam(t)) {
    // the collapsing screen frame (screen space): the bright bezel closes into the ruler's line
    if (collapse < 1 && collapse > 0) {
      const Cs = stageCam(t), [x0, y0] = toS(Cs, SC.x, SC.y), [x1, y1] = toS(Cs, SC.x + SC.w, SC.y + SC.h), [, ry] = toS(C, 0, RULER.y);
      const k = collapse, X0 = mix(x0, -120, k), X1 = mix(x1, W + 120, k), Y0 = mix(y0, ry - 1.5, k), Y1 = mix(y1, ry + 1.5, k);
      ctx.save(); ctx.fillStyle = '#03040c'; ctx.globalAlpha = 1 - sm(lin(.75, 1, k)); ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(CORE, .85); ctx.lineWidth = 2; ctx.strokeRect(X0, Y0, X1 - X0, Y1 - Y0);
      ctx.strokeStyle = rgba(AMBER, .35); ctx.lineWidth = 7; ctx.strokeRect(X0, Y0, X1 - X0, Y1 - Y0); ctx.restore();
    }
  }
  const [wc, wg] = canvas(W, H);
  // ════════════════ the one frame function (a plan sequence through all seven shots) ════════════════
  const draw = (ctx, t) => {
    const collapse = eio(lin(A.c1 + .12, A.c1 + .62, t)), stageOut = sm(lin(A.c1 + .1, A.c1 + .55, t));
    if (t < A.c1 + .6) {
      nightBG(ctx, t, { dx: drift(t, 10, 2), dy: drift(t, 6, 3) });
      const reveal = sm(lin(A.dayE - .2, A.but + .9, t));
      let st = null; if (reveal > 0) st = stagePhase(ctx, t, reveal);
      if (t < A.dayE + 1) { motes(ctx, t, 11, 60, .6); const { M, gk } = sheetPhase(ctx, t); dotsPhase(ctx, t, M, gk, sm(lin(A.dayE + .05, A.but + .65, t))); }
      else if (t < A.but + 1.2) dotsPhase(ctx, t, sheetM(t), 1, sm(lin(A.dayE + .05, A.but + .65, t)));
      if (t > A.c0 - .2) lowerThird(ctx, t);
      if (stageOut > 0 || collapse > 0) { wg.save(); wg.setTransform(1, 0, 0, 1, 0, 0); wg.globalAlpha = 1; wg.globalCompositeOperation = 'source-over'; wg.clearRect(0, 0, W, H); worldPhase(wg, t, collapse); wg.restore();
        ctx.save(); ctx.globalAlpha = stageOut; ctx.drawImage(wc, 0, 0); ctx.restore();
        collapseFrame(ctx, t, collapse); }
    } else worldPhase(ctx, t, collapse);
  };

  const P0 = { riso: .25 }, PCLIP = { riso: .12, halftone: .3, hatch: .3 };
  return [
    { t: A.t0, tr: 'out', d: 1.0, x: OX, y: OY, depth: DEPTH, print: P0, draw,
      sound: [{ f: 'whoosh_airy', t: A.dayE - .08, v: .22 }] },
    { t: A.but, tr: 'cut', d: .1, print: P0, draw, sound: [{ f: 'lamp', t: A.onst + .02, v: .18 }, { f: 'whoosh', t: A.push0 - .05, v: .16 }] },
    { t: A.c0 - .3, tr: 'cut', d: .1, print: PCLIP, draw },
    { t: A.he, tr: 'cut', d: .1, print: P0, draw, sound: [{ f: 'screen_off', t: A.c1 + .06, v: .22 }, { f: 'tape_measure', t: A.c1 + .55, v: .2 }] },
    { t: A.and, tr: 'cut', d: .1, print: P0, draw, sound: [{ f: 'stamp', t: A.land, v: .34 }] },
    { t: A.if, tr: 'cut', d: .1, print: P0, draw, sound: [{ f: 'whoosh_up', t: A.better - .15, v: .16 }] },
    { t: A.he2, tr: 'cut', d: .1, print: P0, draw, sound: [{ f: 'foil_glint', t: A.willE + .02, v: .2 }] },
  ];
};
