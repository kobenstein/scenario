// Film 65 · B2 drawings (c07–c11): the tablet room behind a lit town window, the forged face on a screen, the big phone (lifted from her
// kitchen table to the camera) with its custom screens (the fake bank call, the action plan), the paper to sign, the link chip, the moon.
// Owned by builder B2. Kit rules hold: no canvas / pattern / gradient caches per frame, seeded randomness only, no red.
import * as E from './f10_editorial.mjs';
import * as F from './f65_kit.mjs';
import * as S from './f65_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, mixHex, halo, lin, rad } = E;
const { GOLD, COPY, LAMP, WOOD, maskLine } = F;
const TAU = Math.PI * 2;
const SKIN = mixHex(P.shade0, P.night1, .5);

// ---------------------------------------------------------------------------------------------------------- the lit town window (c07)
// the nearest lit window of the town that sits between poles 4 and 5 seen from plate 3 (the camera flies over the wire, not through it)
export const TOWNWIN = (() => {
  let best = null;
  S.TOWN.forEach((hs) => hs.wins.forEach((w) => { if (!w.lit) return; const X = hs.x + w.x, d = Math.abs(X - 450) + Math.abs(hs.z - 8847); if (!best || d < best.d) best = { d, X, Y: w.y, Z: hs.z, w }; }));
  return [best.X, best.Y, best.Z - 2];
})();
export function townWinRect(c) {
  const [X, Y, Z] = TOWNWIN, a = S.proj(c, X - 26, Y + 22, Z), b = S.proj(c, X + 26, Y - 22, Z);
  return a && b ? { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] } : null;
}

// ---------------------------------------------------------------------------------------------------------- the forged face (a screen)
// a generic leader in a suit before a flag (blue and cream bands, never red), a lectern, a blank news bar. No likeness, no name.
// forged 0..1: the cold copy shows through (a blue ghost of the figure breathing out of register, a cold tint)
export function faceScreen(ctx, t, sw, sh, o = {}) {
  const fg = clamp(o.forged ?? 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, sh, [[0, mixHex(P.ind1, P.blue0, .35)], [1, P.night1]]); ctx.fillRect(0, 0, sw, sh);
  ctx.fillStyle = rad(ctx, sw * .5, sh * .35, sw * .6, [[0, rgba(mixHex(LAMP.body, COPY.body, fg), .22)], [1, rgba(P.night1, 0)]]); ctx.fillRect(0, 0, sw, sh);
  const fx = sw * .08, fy = sh * .1, fw = sw * .34, fh = sh * .42, sway = .012 * Math.sin(t * 1.3);
  ctx.save(); ctx.translate(fx, fy);
  for (let k = 0; k < 7; k++) { const yy = k * fh / 7; ctx.fillStyle = k % 2 ? mixHex(P.cream, P.halo2, .45) : mixHex(P.blue1, P.blue0, .5); ctx.beginPath(); ctx.moveTo(0, yy); for (let x = 0; x <= fw; x += fw / 8) ctx.lineTo(x, yy + fh * sway * Math.sin(x / fw * 4 + t)); ctx.lineTo(fw, yy + fh / 7 + .5); ctx.lineTo(0, yy + fh / 7 + .5); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = mixHex(P.ind1, P.blue0, .3); ctx.fillRect(0, 0, fw * .42, fh * .57);
  ctx.restore();
  ctx.fillStyle = mixHex(P.night1, P.blue1, .25); ctx.fillRect(fx + fw * .02, fy + fh, sw * .012, sh * .5);                       // the flag pole
  const px = sw * .55, py = sh * 1.06, ph = sh * .92, gest = o.gesture ?? 0;
  const arm = [lerp(.25, 1.55, gest) + .06 * Math.sin(t * 1.7) * gest, lerp(.12, 2.1, gest) + .1 * Math.sin(t * 2.1 + 1) * gest];
  if (fg > 0) {   // the copy behind: same outline, a little off, breathing in and out of register (like the voice's ghost)
    ctx.save(); ctx.globalAlpha *= .45 * fg; ctx.translate(sw * (.012 * Math.sin(t * 5.3) + .006 * Math.sin(t * 13.1)) * fg, sh * .006 * Math.sin(t * 4.1) * fg);
    E.person(ctx, px, py, ph, { look: .05, armR: arm, rim: COPY.line, light: -1 }); ctx.restore();
  }
  E.person(ctx, px, py, ph, { look: .05 + .03 * Math.sin(t * .8), armR: arm, rim: mixHex(P.blue0, COPY.line, fg), light: -1 });
  ctx.fillStyle = mixHex(P.night0, P.blue1, .3); ctx.beginPath(); ctx.moveTo(px - sw * .13, sh * .74); ctx.lineTo(px + sw * .13, sh * .74); ctx.lineTo(px + sw * .1, sh); ctx.lineTo(px - sw * .1, sh); ctx.closePath(); ctx.fill();   // the lectern
  ctx.fillStyle = rgba(P.cream, .82); ctx.fillRect(0, sh * .8, sw * .46, sh * .1);                                                // the news bar (blank)
  ctx.fillStyle = rgba(P.blue1, .9); ctx.fillRect(sw * .03, sh * .83, sw * .26, sh * .018); ctx.fillRect(sw * .03, sh * .86, sw * .18, sh * .014);
  if (fg > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(COPY.halo, .14 * fg); ctx.fillRect(0, 0, sw, sh); const by = ((t * .23) % 1) * sh; ctx.fillStyle = rgba(COPY.line, .06 * fg); ctx.fillRect(0, by - 6, sw, 12); ctx.restore(); }
}
// a small framed screen with the forged face (the "door"): centre x, y, width w
export function miniScreen(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || w < 4) return; const h = w * .62, r = w * .05;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, w * 1.1, .28, COPY.halo, COPY.core);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(x - w / 2 - w * .04, y - h / 2 - w * .04, w * 1.08, h + w * .08, r); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r * .6); ctx.clip(); ctx.translate(x - w / 2, y - h / 2); faceScreen(ctx, t, w, h, { forged: 1, gesture: .4 }); ctx.restore();
  ctx.strokeStyle = rgba(COPY.line, .7); ctx.lineWidth = Math.max(1.5, w * .012); ctx.beginPath(); ctx.roundRect(x - w / 2 - w * .04, y - h / 2 - w * .04, w * 1.08, h + w * .08, r); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------- the tablet room (c07)
// Behind the lit town window: a dim warm room, a small lamp, an old woman seen over her shoulder (silver bun, no face) holding a tablet
// with both hands; on it the forged leader. o: { forged 0..1, sink 0..1 (her hands lower: the loss), gesture 0..1 }
export function tabletRoom(ctx, t, w, h, o = {}) {
  ctx.save(); ctx.scale(w / W, h / H);
  const fg = clamp(o.forged ?? 0), sink = clamp(o.sink ?? 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, LAMP.deep, .16)], [.65, mixHex(P.night1, LAMP.deep, .2)], [1, mixHex(P.night0, LAMP.deep, .1)]]); ctx.fillRect(-400, -200, W + 800, H + 400);
  ctx.fillStyle = rad(ctx, 250, 470, 760, [[0, rgba(LAMP.body, .2)], [.5, rgba(LAMP.halo, .05)], [1, rgba(LAMP.halo, 0)]]); ctx.fillRect(-400, -200, W + 800, H + 400);
  F.paper(ctx, t, { a: .8 });
  // a curtain right, a picture frame on the wall, the small lamp left (people's light)
  ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(1700, -100, 300, H + 200);
  ctx.fillStyle = rgba(P.night0, .5); for (let k = 0; k < 4; k++) ctx.fillRect(1712 + k * 52 + 4 * Math.sin(t * .5 + k), -100, 10, H + 200);
  ctx.strokeStyle = mixHex(WOOD.body, LAMP.deep, .5); ctx.lineWidth = 10; ctx.strokeRect(1420, 120, 200, 150); ctx.fillStyle = mixHex(P.night1, LAMP.deep, .25); ctx.fillRect(1425, 125, 190, 140);
  ctx.fillStyle = mixHex(P.night1, LAMP.deep, .45); ctx.beginPath(); ctx.moveTo(170, 400); ctx.lineTo(220, 330); ctx.lineTo(280, 330); ctx.lineTo(330, 400); ctx.closePath(); ctx.fill();
  halo(ctx, 250, 410, 120, .5, LAMP.halo, LAMP.core); ctx.fillStyle = rgba(LAMP.core, .85); ctx.beginPath(); ctx.ellipse(250, 400, 80, 9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(WOOD.shade, LAMP.deep, .3); ctx.fillRect(244, 410, 12, 300);
  // the tablet in her hands (a little tilted, it breathes with her)
  const cx = 1010, cy = 450 + 40 * sineIO(sink) + 3 * Math.sin(t * .9), tw = 780, th = 500, rot = -.025 + .006 * Math.sin(t * .7) + .03 * sink;
  const scol = mixHex(LAMP.halo, COPY.halo, fg), score = mixHex(LAMP.core, COPY.core, fg);
  halo(ctx, cx, cy, 720, .2 - .05 * sink, scol, score);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(-tw / 2 + 10, -th / 2 + 14, tw, th, 30); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(-tw / 2, -th / 2, tw, th, 30); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .35), .8); ctx.lineWidth = 3; ctx.stroke();
  const sw = tw - 52, sh = th - 52;
  ctx.save(); ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, 12); ctx.clip(); ctx.translate(-sw / 2, -sh / 2);
  faceScreen(ctx, t, sw, sh, { forged: fg, gesture: o.gesture ?? .5 }); if (sink > 0) { ctx.fillStyle = rgba(P.night0, .25 * sink); ctx.fillRect(0, 0, sw, sh); }
  ctx.restore();
  ctx.restore();
  // her hands at the lower corners (sleeves in from below; skin, no detail)
  const sl = mixHex(P.ind2, P.blue0, .25), dy = 40 * sineIO(sink);
  for (const [hx, hy, bx, sd] of [[cx - tw / 2 + 40, cy + th / 2 - 50, 560, -1], [cx + tw / 2 - 40, cy + th / 2 - 46, 1500, 1]]) {
    ctx.strokeStyle = sl; ctx.lineCap = 'round'; ctx.lineWidth = 92; ctx.beginPath(); ctx.moveTo(bx, H + 80); ctx.quadraticCurveTo(bx + sd * 30, hy + 180, hx + sd * 10, hy + 46 + dy * .2); ctx.stroke();
    ctx.strokeStyle = rgba(mixHex(scol, P.cream, .3), .25); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx - sd * 40, H + 80); ctx.quadraticCurveTo(bx + sd * -10, hy + 200, hx - sd * 30, hy + 60); ctx.stroke();
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(hx, hy, 46, 58, sd * .5, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(mixHex(scol, P.cream, .4), .35); ctx.beginPath(); ctx.ellipse(hx - sd * 10, hy - 30, 26, 18, sd * .5, 0, TAU); ctx.fill();
  }
  // her, over the shoulder (bottom left, dark, the silver bun; no face): she breathes
  const br = 4 * Math.sin(t * .8);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.moveTo(-60, H + 40); ctx.bezierCurveTo(-40, 930 + br, 160, 880 + br, 330, 890 + br); ctx.bezierCurveTo(470, 900 + br, 560, 980, 600, H + 40); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(300, 770 + br, 128, 150, -.12, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(P.halo2, P.blue1, .4), .55); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(300, 770 + br, 120, 142, -.12, -1.9, -.4); ctx.stroke();       // silver hair, lit from the screen
  ctx.fillStyle = mixHex(P.blue2, P.halo2, .35); ctx.beginPath(); ctx.ellipse(262, 640 + br, 50, 42, 0, 0, TAU); ctx.fill();                                    // the bun
  ctx.strokeStyle = rgba(mixHex(scol, P.cream, .4), .5); ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(300, 770 + br, 128, 150, -.12, -.6, .5); ctx.stroke();      // rim from the screen
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------- the big phone and its screens
const ACT = ['WHAT TO DO', 'WHO TO CALL', 'HOW TO VERIFY'];
// draw a phone body (kit) with a custom screen: kind 'bank' (the fake bank calling) | 'plan' (the action plan list) | kit screens.
// o: { light, ring, seal, waveCol, tremble, flat, rot, a, dark (0..1 night over the screen), checks [3] (0..1), rows (0..1) }
export function bigPhone(ctx, t, x, y, h, kind, o = {}) {
  const custom = kind === 'bank' || kind === 'plan';
  const r = F.phone(ctx, t, x, y, h, { screen: custom ? 'dark' : kind, ring: o.ring ?? 0, light: o.light ?? 1, seal: o.seal, waveCol: o.waveCol, tremble: o.tremble, flat: o.flat ?? 0, rot: o.rot ?? 0, a: o.a ?? 1 });
  if (!r) return null; const sc = r.screen, ca = (o.a ?? 1) * clamp(o.custom ?? 1), li = clamp(o.light ?? 1);
  if ((custom && ca > 0) || (o.dark ?? 0) > 0) {
    ctx.save(); ctx.beginPath(); ctx.roundRect(sc.x, sc.y, sc.w, sc.h, h * .05); ctx.clip();
    if (custom && ca > 0) {
      ctx.globalAlpha *= ca;
      const col = kind === 'bank' ? COPY : LAMP;
      halo(ctx, sc.x + sc.w / 2, sc.y + sc.h * .4, sc.w * 1.2, .16 * li, col.halo, col.core);
      ctx.globalAlpha *= li;
      if (kind === 'bank') {   // a call from "THE BANK": a pillared house in the picture circle (the fake), answer / decline
        const cx = sc.x + sc.w / 2, cy = sc.y + sc.h * .33, rr = sc.w * .26, ring = clamp(o.ring ?? 0);
        if (ring > 0) { ctx.fillStyle = rgba(COPY.body, .12 + .1 * Math.sin(t * 6)); ctx.beginPath(); ctx.arc(cx, cy, rr * (1.25 + .1 * Math.sin(t * 6)), 0, TAU); ctx.fill(); }
        ctx.fillStyle = lin(ctx, cx, cy - rr, cx, cy + rr, [[0, mixHex(P.blue0, P.ind1, .3)], [1, P.ind1]]); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.fill();
        ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = Math.max(1, rr * .05); ctx.stroke();
        bankGlyph(ctx, cx, cy + rr * .05, rr * 1.05, rgba(P.cream, .9));
        ctx.fillStyle = rgba(P.cream, .85); ctx.beginPath(); ctx.arc(sc.x + sc.w * .28, sc.y + sc.h * .84, sc.w * .085, 0, TAU); ctx.fill();
        ctx.fillStyle = COPY.body; ctx.beginPath(); ctx.arc(sc.x + sc.w * .72, sc.y + sc.h * .84, sc.w * .085, 0, TAU); ctx.fill();
        ctx.fillStyle = rgba(P.halo2, .55); ctx.fillRect(cx - sc.w * .25, sc.y + sc.h * .55, sc.w * .5, sc.h * .022); ctx.fillRect(cx - sc.w * .16, sc.y + sc.h * .6, sc.w * .32, sc.h * .016);
      } else {                 // the action plan: a header bar and three rows with boxes that get a gold check
        const rows = clamp(o.rows ?? 1);
        ctx.fillStyle = rgba(GOLD.body, .85 * rows); ctx.fillRect(sc.x + sc.w * .12, sc.y + sc.h * .12, sc.w * .56, sc.h * .035);
        ACT.forEach((_, i) => {
          const ry = sc.y + sc.h * (.3 + i * .17), bx = sc.x + sc.w * .12, bs = sc.w * .13, ru = clamp(rows * 3 - i);
          if (ru <= 0) return; ctx.globalAlpha *= 1; ctx.save(); ctx.globalAlpha *= ru;
          ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = Math.max(1, sc.w * .012); ctx.strokeRect(bx, ry - bs / 2, bs, bs);
          ctx.fillStyle = rgba(P.halo2, .55); ctx.fillRect(bx + bs * 1.5, ry - sc.h * .012, sc.w * (.45 - .06 * i), sc.h * .024);
          const ck = (o.checks || [])[i] ?? 0; if (ck > 0) F.checkMark(ctx, bx + bs * .5, ry, bs * 1.1, ck, { col: GOLD, w: bs * .14 });
          ctx.restore();
        });
      }
    }
    if ((o.dark ?? 0) > 0) { ctx.globalAlpha = (o.a ?? 1) * clamp(o.dark); ctx.fillStyle = P.night0; ctx.fillRect(sc.x, sc.y, sc.w, sc.h); }
    ctx.restore();
  }
  return r;
}
function bankGlyph(ctx, x, y, s, col) {
  ctx.save(); ctx.fillStyle = col; ctx.translate(x, y);
  ctx.beginPath(); ctx.moveTo(-s * .42, -s * .18); ctx.lineTo(0, -s * .42); ctx.lineTo(s * .42, -s * .18); ctx.closePath(); ctx.fill();
  for (const k of [-.3, -.1, .1, .3]) ctx.fillRect(k * s - s * .045, -s * .14, s * .09, s * .38);
  ctx.fillRect(-s * .44, s * .26, s * .88, s * .08); ctx.restore();
}
// the paper to sign (cream, lines, a signature line): centre x, y, width w, rotation
export function paperSheet(ctx, t, x, y, w, rot, a = 1) {
  if (a <= 0) return; const h = w * 1.3;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot + .01 * Math.sin(t * .9)); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(P.cream, '#e9e2c6', .2)], [1, mixHex(P.cream, '#d8d0b2', .5)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(P.blue1, .55); for (let k = 0; k < 7; k++) ctx.fillRect(-w * .38, -h * .38 + k * h * .075, w * (.76 - (k % 3) * .12), h * .014);
  ctx.fillStyle = rgba(P.night1, .8); ctx.fillRect(-w * .38, h * .3, w * .6, h * .012);
  ctx.strokeStyle = rgba(P.night1, .8); ctx.lineWidth = w * .015; ctx.beginPath(); ctx.moveTo(-w * .38, h * .22); ctx.lineTo(-w * .3, h * .28); ctx.moveTo(-w * .3, h * .22); ctx.lineTo(-w * .38, h * .28); ctx.stroke();
  ctx.restore();
}
// a link chip (an ad / a chat link): a cream pill with a chain glyph; the cross comes from the caller
export function linkChip(ctx, t, x, y, s, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  halo(ctx, 0, 0, s * 1.3, .22, LAMP.halo, LAMP.core);
  ctx.fillStyle = mixHex(P.cream, '#e3dcc0', .35); ctx.beginPath(); ctx.roundRect(-s, -s * .42, s * 2, s * .84, s * .42); ctx.fill();
  ctx.strokeStyle = P.night1; ctx.lineWidth = s * .09; ctx.lineCap = 'round';
  ctx.save(); ctx.rotate(-.6); ctx.beginPath(); ctx.roundRect(-s * .5, -s * .14, s * .5, s * .28, s * .14); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-s * .05, -s * .14, s * .5, s * .28, s * .14); ctx.stroke(); ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------- the moon (the only clock)
// a far world point on a slow arc: it rises from behind the far ridge in step 4 and has set again before she leaves the house.
export function moonAt(c, t, t0, t1) {
  const u = span(t, t0, t1); if (u <= 0 || u >= 1) return null;
  const X = -16000 + 40000 * u, Y = -4000 + 17000 * Math.pow(Math.sin(Math.PI * u), .6), p = S.proj(c, X, Y, 50000); if (!p) return null;
  return { x: p[0], y: p[1], a: clamp((Y + 3000) / 4000) * clamp((p[1] - 40) / 90) };
}

// ---------------------------------------------------------------------------------------------------------- text helper (screen space)
export function words(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [[s, 0]], x, y, size, u, { serif: o.serif ?? false, weight: 600, col: o.col ?? P.core0, glow: o.glow ?? true, align: o.align });
  ctx.restore();
}
