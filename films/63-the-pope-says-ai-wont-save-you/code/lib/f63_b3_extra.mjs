// Film 63 · B3 helpers (c10 · c11 · c12). Builder B3 only; imports the kit (lib/f63_kit.mjs), never edits it.
// Carriers (no fades): flip (a card turns over), rectMorph (one rect becomes the next), irisRect / irisDot (B opens inside a shape that
// belongs to A), pullOut (reverse portal: A shrinks into an object of B). Objects: qcard (exact quote card with per-word styling), tool,
// bank counter + terminal, faceless slab, switch panel, lake + pin, concrete wall + crack + plant, hospital room, fridge + photo +
// calendar, X post, chapter bar, poll chart, levers, small pan tiles (chairs / hands / tuesday), workshop, cupped hands.
import * as F from './f63_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER, prng } = F;
export const AMBER = { core: '#fff1cf', body: '#ffb35c', deep: '#7a3b17', glow: '#ffcf86' };   // human warmth (love, morning, your light)
export const COLD = { a: '#1a2556', b: '#2a3a6e', c: '#4a5a8c', hi: '#c9d3ee' };
const nz = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
export const ease = { sineIO, quartIO, expoOut, expoIn, smooth };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
export const lrect = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
export const rc = (r) => [r.x + r.w / 2, r.y + r.h / 2];
export const lpt = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// a word that lives on its line: rises behind its mask on u, sinks back behind it on out
export const inout = (t, a0, a1, b0, b1) => Math.min(rise(span(t, a0, a1)), 1 - sineIO(span(t, b0, b1)));
export function caps(ctx, s, x, y, u, o = {}) { if (u <= 0) return; F.maskLine(ctx, [[s, 0]], x, y, o.size ?? 24, rise(u), { serif: false, weight: o.weight ?? 600, col: o.col ?? P.halo2, glow: false, align: o.align ?? 'center' }); }
export function serif(ctx, s, x, y, size, u, o = {}) { if (u <= 0) return; return F.maskLine(ctx, [[s, o.warm ?? 0]], x, y, size, rise(u), { serif: true, col: o.col ?? CREAM, glow: o.glow ?? false, align: o.align ?? 'center' }); }

// ------------------------------------------------------------------------------------------------ CARRIERS
// a card turns over around its vertical axis (u 0..1): front until half, back after; a slight lift and a heavy settle (o.heavy)
export function flip(ctx, cx, cy, u, drawFront, drawBack, o = {}) {
  const e = (o.ease ?? quartIO)(clamp(u)), ang = Math.PI * e, sx = Math.cos(ang), lift = Math.sin(ang);
  ctx.save(); ctx.translate(cx, cy - lift * (o.lift ?? 30)); ctx.scale(Math.max(.004, Math.abs(sx)) * (1 + lift * .05), 1 + lift * .05);
  ctx.transform(1, (o.skew ?? .06) * lift * Math.sign(sx || 1), 0, 1, 0, 0); ctx.translate(-cx, -cy);
  if (sx >= 0) drawFront(ctx); else drawBack(ctx);
  ctx.restore();
}
// B opens inside a growing rounded rect / circle that belongs to A (rim = the object's edge, gold)
export function irisRect(ctx, r, rr, drawB, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rr); ctx.clip(); drawB(ctx); ctx.restore();
  if (o.rim !== false) { ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rr); ctx.strokeStyle = o.rim ?? rgba(P.core1, .8); ctx.lineWidth = o.rimW ?? 3; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14; ctx.stroke(); ctx.restore(); }
}
export function irisDot(ctx, x, y, r, drawB, o = {}) { F.iris(ctx, (c) => c.arc(x, y, Math.max(.5, r), 0, 6.29), drawB, { rim: o.rim ?? rgba(P.core1, .75), rimW: o.rimW ?? 3 }); }
// pull out: A (full frame) shrinks into the rect win of B; u 0 = A only (identity), 1 = B only (identity). = portal played backwards
export function pullOut(ctx, u, win, drawB, drawA, o = {}) { F.portal(ctx, 1 - clamp(u), win, drawB, drawA, o); }
// a camera move: z, centre (cx, cy) eased between keys [[t, cx, cy, z], …] (sine in-out per leg, log zoom), plus a slow drift
export function camKeys(t, K, drift = 1) {
  let c = K[0].slice(1);
  if (t >= K[K.length - 1][0]) c = K[K.length - 1].slice(1);
  else for (let i = 0; i < K.length - 1; i++) if (t >= K[i][0] && t < K[i + 1][0]) { const u = sineIO(span(t, K[i][0], K[i + 1][0])); c = [lerp(K[i][1], K[i + 1][1], u), lerp(K[i][2], K[i + 1][2], u), Math.exp(lerp(Math.log(K[i][3]), Math.log(K[i + 1][3]), u))]; }
  return [c[0] + F.drift(t, 3 * drift, 7), c[1] + F.drift(t, 2 * drift, 13), c[2] * (1 + .003 * drift * Math.sin(t * .37))];
}

// ------------------------------------------------------------------------------------------------ QUOTE CARD (exact wording)
// words: [{ w, g (0..1 gold), d (0..1 dim), lift (px up, 0..), gone (0..1 leaves upward), slot (draw a dashed slot in its place) }]
// o: { x, y, w, size, u, out, head, credit, para (the § tag), style 'paper'|'night', rot, a, lineH, timesFn }
export function words(text, rule) { return text.split(/\s+/).filter(Boolean).map((w, i) => ({ w, ...(rule ? rule(w, i) : {}) })); }
export function layout(ws, size, maxW) {
  const lines = []; let cur = [], cw = 0; const gap = size * .26;
  for (const wd of ws) { const mw = F.measure(wd.w, size, true); if (cur.length && cw + gap + mw > maxW) { lines.push(cur); cur = []; cw = 0; } cur.push({ ...wd, mw }); cw += (cur.length > 1 ? gap : 0) + mw; }
  if (cur.length) lines.push(cur);
  return lines;
}
export function qcard(ctx, t, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const out = clamp(o.out ?? 0), night = o.style === 'night', size = o.size ?? 48, w = o.w ?? 1100, pad = o.pad ?? 50;
  const lines = layout(o.words, size, w - pad * 2 - (o.para ? 90 : 0)), lh = o.lineH ?? size * 1.24;
  const head = o.head ? 66 : 28, h = o.h ?? (head + lines.length * lh + (o.credit ? 86 : 40));
  const x = o.x ?? (W - w) / 2, y = o.y ?? 200, k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1);
  ctx.translate(x + w / 2, y + h / 2 + (1 - k) * 40 + sineIO(out) * 30); ctx.rotate((o.rot ?? -.004) + (1 - k) * .03); ctx.scale(lerp(.96, 1, k) * (1 - .04 * sineIO(out)), lerp(.96, 1, k) * (1 - .04 * sineIO(out))); ctx.translate(-w / 2, -h / 2);
  ctx.save(); ctx.beginPath(); ctx.rect(-40, -40, w + 80, (h + 80) * (1 - sineIO(out))); ctx.clip();   // a card leaves by sinking behind its own lower edge
  ctx.globalAlpha *= clamp(u * 3);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(7, 11, w, h, 10); ctx.fill();
  ctx.fillStyle = night ? mixHex(P.night1, P.ind2, .55) : F.lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, night ? 12 : 6); ctx.fill();
  ctx.strokeStyle = night ? rgba(GOLD.line, .55) : rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  const ink = night ? P.cream : PAPER.ink, faint = night ? P.halo2 : PAPER.faint, gcol = night ? GOLD.body : GOLD.deep;
  if (o.head) F.maskLine(ctx, [[o.head, 0]], pad, 46, 20, rise(span(u, .05, .6)), { serif: false, weight: 600, col: faint, glow: false });
  if (o.para) { const pu = rise(span(u, .35, .9)); F.maskLine(ctx, [[o.para, 0]], w - pad, head + size * .95, size * .9, pu, { serif: true, col: night ? GOLD.text : GOLD.deep, glow: false, align: 'right' }); }
  let ln = 0; const pos = [];
  for (const line of lines) {
    let xx = pad; const yy = head + (ln + 1) * lh;
    for (const wd of line) {
      const g = clamp(wd.g ?? 0), d = clamp(wd.d ?? 0), lift = wd.lift ?? 0;
      const col = mixHex(mixHex(ink, gcol, g * .9), night ? P.blue1 : PAPER.shade, d * .75);
      pos.push({ w: wd.w, x: xx, y: yy, mw: wd.mw });
      if (wd.slot > 0) { ctx.save(); ctx.globalAlpha *= clamp(wd.slot); ctx.strokeStyle = night ? rgba(CREAM, .8) : rgba(PAPER.ink, .55); ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 14; ctx.beginPath(); ctx.roundRect(xx - 6, yy - size * .78, wd.mw + 12, size * 1.0, 6); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
      if ((wd.gone ?? 0) < 1) {
        const gy = -lift - expoIn(clamp(wd.gone ?? 0)) * 600;
        if (lift > 0 || (wd.gone ?? 0) > 0) E_glow(ctx, wd.w, xx, yy + gy, size, col, g > .5 && night);
        else F.maskLine(ctx, [[wd.w, 0]], xx, yy, size, rise(span(o.wu ?? u, .1 + ln * .07, .7 + ln * .07)) * (wd.u ?? 1), { serif: true, col, glow: false });
        if (g > 0 && (o.underline ?? true) && !lift) { ctx.save(); ctx.fillStyle = rgba(gcol, .55 * g); ctx.fillRect(xx, yy + size * .14, wd.mw * expoOut(g), 2.5); ctx.restore(); }
      }
      xx += wd.mw + size * .26;
    }
    ln++;
  }
  if (o.credit) F.maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 32, 18, rise(span(u, .55, 1)), { serif: false, weight: 600, col: faint, glow: false });
  ctx.restore(); ctx.restore();
  return { x, y, w, h, pos };
}
function E_glow(ctx, s, x, y, size, col, glow) { F.glowText(ctx, s, x, y, { size, serif: true, col, glow }); }
// times at which each card word is spoken (null = not spoken): maps the card words onto the VO words in order
export function spokenTimes(T, ws, from, to, after = -1) {
  let vo; try { vo = T.GW(from, to, after); } catch { return ws.map(() => null); }
  let j = 0; return ws.map((wd) => { const n = nz(wd.w); if (!n) return null; for (let q = j; q < Math.min(vo.length, j + 6); q++) if (nz(vo[q].w) === n) { j = q + 1; return vo[q].s; } return null; });
}

// ------------------------------------------------------------------------------------------------ OBJECTS
// a wrench (THE TOOL): gold, (x, y) centre, s length, ang
export function wrench(ctx, x, y, s, ang, u = 1, o = {}) {
  if (u <= 0) return; const k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
  const g = F.lin(ctx, 0, -s * .1, 0, s * .1, [[0, GOLD.hot], [.5, GOLD.body], [1, GOLD.shade]]);
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-s * .42, -s * .055, s * .72, s * .11, s * .05); ctx.fill();
  ctx.beginPath(); ctx.arc(s * .34, 0, s * .15, 0, 6.29); ctx.fill();
  ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.roundRect(s * .3, -s * .06, s * .3, s * .12, s * .02); ctx.fill();
  ctx.beginPath(); ctx.arc(-s * .36, 0, s * .028, 0, 6.29); ctx.fill();
  ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba(GOLD.core, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-s * .4, -s * .045); ctx.lineTo(s * .2, -s * .045); ctx.stroke();
  ctx.restore();
  if (o.glow) F.halo(ctx, x, y, s * .5, o.glow, P.halo0, P.core0);
}
// the bank hall: back wall, a counter with a glass partition, a terminal behind it (screen rect SCREEN); returns nothing.
export const BANK = { screen: { x: 1040, y: 300, w: 440, h: 270 }, counterY: 640, you: [600, 880, 300] };
export function bank(ctx, t, o = {}) {
  ctx.fillStyle = F.lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, P.ind0, .25)], [.8, mixHex(P.ind0, P.night1, .3)], [1, P.night0]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  // ceiling light bands, cool
  for (let i = 0; i < 4; i++) { const x = 260 + i * 460; ctx.fillStyle = rgba(P.halo2, .16); ctx.fillRect(x, 60, 300, 8); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, 0, 68, 0, 600, [[0, rgba(P.blue0, .16)], [1, rgba(P.blue0, 0)]]); ctx.beginPath(); ctx.moveTo(x, 68); ctx.lineTo(x + 300, 68); ctx.lineTo(x + 380, 600); ctx.lineTo(x - 80, 600); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(-W, 880, W * 3, H);   // floor
  ctx.fillStyle = rgba(P.blue1, .5); ctx.fillRect(-W, 878, W * 3, 2);
  // the terminal behind the glass (stand + screen)
  const S = BANK.screen;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(S.x + S.w / 2 - 22, S.y + S.h, 44, BANK.counterY - S.y - S.h); ctx.fillRect(S.x + S.w / 2 - 90, BANK.counterY - 14, 180, 14);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.roundRect(S.x - 16, S.y - 16, S.w + 32, S.h + 32, 14); ctx.fill();
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke();
  if (o.screen) { ctx.save(); ctx.beginPath(); ctx.roundRect(S.x, S.y, S.w, S.h, 6); ctx.clip(); o.screen(ctx, S); ctx.restore(); }
  // glass partition (a cool sheen band), a small grille
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, 860, 160, 1700, 620, [[0, rgba(P.blue0, .05)], [.45, rgba(P.halo2, .07)], [.5, rgba(P.halo2, .02)], [1, rgba(P.blue0, .04)]]); ctx.fillRect(820, 150, 900, BANK.counterY - 150); ctx.restore();
  ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 2; ctx.strokeRect(820, 150, 900, BANK.counterY - 150);
  // the counter: lit top, dark front; the sign LOANS
  const cy = BANK.counterY;
  ctx.fillStyle = F.lin(ctx, 0, cy, 0, cy + 30, [[0, mixHex(P.halo1, P.ind1, .55)], [1, mixHex(P.shade0, P.night1, .6)]]); ctx.fillRect(220, cy, 1560, 30);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .3); ctx.fillRect(240, cy + 30, 1520, 880 - cy - 30);
  ctx.fillStyle = rgba(P.blue1, .5); for (let i = 0; i < 6; i++) ctx.fillRect(300 + i * 250, cy + 60, 2, 880 - cy - 90);
  F.glowText(ctx, 'LOANS', 1270, 128, { size: 24, weight: 700, col: P.halo2, glow: false, spacing: .3, align: 'center' });
  if (o.you !== false) { const [yx, yy, yh] = BANK.you; F.du(ctx, yx, yy, yh, { dir: 1, look: o.look ?? .3, light: 1, back: .25, armR: o.armR ?? [.9 + .03 * Math.sin(t * 1.2), 1.4], armL: o.armL ?? [.15, .25], lean: o.lean ?? 0 }); }
}
// the terminal screen content: LOAN APPLICATION form, then DECLINED (u), OUR EXAMPLE tag
export function loanScreen(ctx, S, t, u) {
  ctx.fillStyle = F.lin(ctx, 0, S.y, 0, S.y + S.h, [[0, mixHex(P.ind1, P.blue0, .4)], [1, mixHex(P.night1, P.ind1, .6)]]); ctx.fillRect(S.x, S.y, S.w, S.h);
  F.glowText(ctx, 'LOAN APPLICATION', S.x + 28, S.y + 44, { size: 22, weight: 700, col: P.halo2, glow: false, spacing: .12 });
  ctx.fillStyle = rgba(P.halo2, .35); for (let i = 0; i < 3; i++) ctx.fillRect(S.x + 28, S.y + 72 + i * 26, S.w * (i === 2 ? .35 : .6), 8);
  const k = expoOut(clamp(u)); if (k <= 0) return;
  const bx = S.x + 28, by = S.y + S.h - 98, bw = S.w - 56, bh = 72;
  ctx.save(); ctx.beginPath(); ctx.rect(bx - 4, by - 4, bw + 8, bh + 8); ctx.clip(); ctx.translate(0, (1 - k) * (bh + 10));
  ctx.fillStyle = rgba(CREAM, .1); ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = CREAM; ctx.lineWidth = 2.5; ctx.strokeRect(bx, by, bw, bh);
  F.glowText(ctx, 'DECLINED', bx + bw / 2, by + 52, { size: 46, serif: true, col: CREAM, glow: false, align: 'center', spacing: .08 });
  ctx.restore();
}
// the faceless slab (u 0..1 = from the screen rect to the tall smooth surface; covers whatever is behind it)
export function slab(ctx, t, r, sheen = 1, o = {}) {
  ctx.save(); if (o.shadow !== false) { ctx.shadowColor = rgba(P.night0, .6); ctx.shadowBlur = 40; }
  ctx.fillStyle = F.lin(ctx, r.x, r.y, r.x + r.w, r.y + r.h, [[0, mixHex(P.ind1, COLD.c, .45)], [.55, mixHex(P.ind1, COLD.b, .4)], [1, mixHex(P.night1, P.ind1, .4)]]);
  ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(r.w, r.h) * .06); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(r.w, r.h) * .06); ctx.clip();
  const sx = r.x + ((t * .08) % 1.6 - .3) * r.w;   // a slow reflection travels across: smooth, blank, no face
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, sx - r.w * .3, 0, sx + r.w * .3, 0, [[0, rgba(COLD.hi, 0)], [.5, rgba(COLD.hi, .1 * sheen)], [1, rgba(COLD.hi, 0)]]); ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.restore();
  ctx.strokeStyle = rgba(COLD.hi, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(r.w, r.h) * .06); ctx.stroke();
}
// speech arcs from (x, y) toward x1: three ")" that travel and flatten against the slab (absorbed: nothing comes back)
export function speech(ctx, t, x, y, x1, t0, t1) {
  for (let i = 0; i < 6; i++) {
    const p = ((t - t0) * .9 + i / 6) % 1; if (t < t0 + i * .15 || t > t1) continue;
    const xx = lerp(x, x1, p), a = Math.sin(Math.PI * p) * (1 - span(p, .85, 1)), r = lerp(18, 60, p) * (1 - .7 * span(p, .8, 1));
    ctx.save(); ctx.strokeStyle = rgba(CREAM, .7 * a); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(xx - r, y, r, -.6, .6); ctx.stroke(); ctx.restore();
  }
}
// a human hand seen from the side, resting / pressing (indigo with a warm rim, or your yellow sleeve when o.you)
export function sideHand(ctx, x, y, s, ang, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const base = o.you ? P.coat : P.ind2, lit = o.you ? mixHex(P.coat, P.core1, .4) : mixHex(P.ind2, P.blue0, .8);
  ctx.fillStyle = F.lin(ctx, 0, -.5, 0, .5, [[0, lit], [1, base]]);
  ctx.beginPath(); ctx.moveTo(-2.2, -.42); ctx.lineTo(-.2, -.4); ctx.bezierCurveTo(.4, -.48, .95, -.36, 1.05, -.08); ctx.bezierCurveTo(1.1, .14, .9, .3, .55, .3); ctx.lineTo(-.2, .4); ctx.lineTo(-2.2, .44); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-.05, -.42, .32, .14, -.5, 0, 6.29); ctx.fill();   // thumb
  ctx.fillStyle = o.you ? mixHex(P.coat, P.shade0, .5) : mixHex(P.ind1, P.night1, .4); ctx.fillRect(-2.2, -.5, .5, 1.0);   // cuff
  ctx.strokeStyle = rgba(o.you ? AMBER.glow : P.halo0, .7); ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(-1.6, -.42); ctx.lineTo(-.2, -.4); ctx.bezierCurveTo(.4, -.48, .95, -.36, 1.05, -.08); ctx.stroke();
  ctx.restore();
}
// the switch panel: three toggles (HUMAN up / AUTO down, AUTO struck). on[i] 0..1 = the switch snaps up and its gold light comes on
export const PANEL = { x: 360, y: 300, w: 1200, h: 440 };
export const switchX = (i) => PANEL.x + PANEL.w * (.2 + .3 * i);
export const ledPt = (i) => [switchX(i), PANEL.y + 70];
export function panel(ctx, t, r, on, o = {}) {
  ctx.save(); ctx.shadowColor = rgba(P.night0, .6); ctx.shadowBlur = 40;
  ctx.fillStyle = F.lin(ctx, 0, r.y, 0, r.y + r.h, [[0, mixHex(P.ind1, COLD.b, .4)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 26); ctx.fill(); ctx.restore();
  ctx.strokeStyle = rgba(COLD.hi, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 26); ctx.stroke();
  const k = clamp(o.u ?? 1); if (k <= 0) return;
  for (let i = 0; i < 3; i++) {
    const x = r.x + r.w * (.2 + .3 * i), sy = r.y + r.h * .56, s = clamp(on[i] ?? 0), e = expoOut(s);
    ctx.save(); ctx.globalAlpha *= k;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.roundRect(x - 34, sy - 110, 68, 220, 34); ctx.fill(); ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke();
    // AUTO (down) struck, HUMAN (up)
    F.glowText(ctx, 'AUTO', x + 60, sy + 100, { size: 22, weight: 700, col: rgba(P.halo2, .55), glow: false, spacing: .12 });
    F.strike(ctx, x + 58, sy + 92, x + 58 + F.measure('AUTO', 22, false, 700) + 12, o.strike ?? 1, { w: 3 });
    const ang = lerp(.55, -.55, e) + .04 * bump(o.t ?? t, o.snap?.[i] ?? -9, .25);
    ctx.save(); ctx.translate(x, sy); ctx.rotate(ang);
    ctx.fillStyle = F.lin(ctx, -14, 0, 14, 0, [[0, mixHex(P.cream, P.blue1, .5)], [1, mixHex(P.cream, P.ind1, .65)]]); ctx.fillRect(-12, -120, 24, 120);
    ctx.fillStyle = s > .5 ? GOLD.body : mixHex(P.cream, P.blue1, .4); ctx.beginPath(); ctx.arc(0, -124, 26, 0, 6.29); ctx.fill();
    ctx.restore();
    const [lx, ly] = [x, r.y + 70]; ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.beginPath(); ctx.arc(lx, ly, 13, 0, 6.29); ctx.fill();
    if (s > 0) { ctx.fillStyle = mixHex(P.blue1, GOLD.hot, e); ctx.beginPath(); ctx.arc(lx, ly, 10, 0, 6.29); ctx.fill(); F.halo(ctx, lx, ly, 60, .8 * e, P.halo0, P.core0); }
    ctx.restore();
  }
}
// Lake Geneva (a crescent) with a pin at its west tip (the pin head = the carrier dot)
export const LAKE = { x: 980, y: 330, s: 1.0, pin: [600, 380] };
export function lake(ctx, t, u, o = {}) {
  const k = expoOut(clamp(u)); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  const path = (c) => { c.beginPath(); c.moveTo(610, 392); c.bezierCurveTo(700, 330, 860, 250, 1060, 232); c.bezierCurveTo(1200, 220, 1330, 236, 1400, 280); c.bezierCurveTo(1350, 300, 1250, 300, 1180, 318); c.bezierCurveTo(1000, 352, 800, 360, 640, 402); c.closePath(); };
  path(ctx); ctx.fillStyle = F.lin(ctx, 600, 220, 1400, 400, [[0, mixHex(P.blue0, P.ind1, .4)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2.2; ctx.stroke();
  // a few shore dots (towns), faint
  for (const [x, y] of [[760, 330], [905, 280], [1150, 240], [1360, 262], [1010, 350]]) { ctx.fillStyle = rgba(P.halo2, .55); ctx.beginPath(); ctx.arc(x, y - 18, 3, 0, 6.29); ctx.fill(); }
  ctx.restore();
}
export function pin(ctx, x, y, u, o = {}) {
  const k = expoOut(clamp(u)); if (k <= 0) return;
  const h = 70 * k;
  ctx.save(); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 13, y - h + 10); ctx.lineTo(x + 13, y - h + 10); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y - h, 20 * (o.head ?? 1), 0, 6.29); ctx.fillStyle = GOLD.hot; ctx.fill(); ctx.restore();
  F.halo(ctx, x, y - h, 70, .7 * k, P.halo0, P.core0);
}
// the concrete wall: slabs of the card's size (CARD rect is the middle slab) with seams; o.crack 0..1, o.plant 0..1
export const SLAB = { x: 460, y: 330, w: 1000, h: 420 };
const crackPts = (() => { const r = prng(118), pts = []; let x = SLAB.x + SLAB.w * .52, y = SLAB.y - SLAB.h * 1.2; pts.push([x, y]); while (y < SLAB.y + SLAB.h * 2.05) { y += 30 + r() * 50; x += (r() - .5) * 70; pts.push([x, y]); } return pts; })();
export function concrete(ctx, t, o = {}) {
  const gap = 10;
  for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) {
    const x = SLAB.x + i * (SLAB.w + gap) + (j % 2 ? (SLAB.w + gap) / 2 : 0), y = SLAB.y + j * (SLAB.h + gap);
    ctx.fillStyle = F.lin(ctx, x, y, x + SLAB.w, y + SLAB.h, [[0, mixHex(P.blue2, P.halo2, .12 + .04 * ((i + j) & 1))], [1, mixHex(P.ind2, P.blue2, .55)]]); ctx.fillRect(x, y, SLAB.w, SLAB.h);
    ctx.fillStyle = rgba(P.halo2, .18); ctx.fillRect(x, y, SLAB.w, 3); ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x, y + SLAB.h - 4, SLAB.w, 4);
    ctx.fillStyle = rgba(P.night0, .35); for (const [u, v] of [[.12, .2], [.88, .2], [.12, .8], [.88, .8]]) { ctx.beginPath(); ctx.arc(x + u * SLAB.w, y + v * SLAB.h, 7, 0, 6.29); ctx.fill(); }   // form-tie holes
  }
  const c = clamp(o.crack ?? 0);
  if (c > 0) {   // the crack: dark, with a light lip, drawn top → bottom
    const n = crackPts.length, upto = c * (n - 1), sub = crackPts.slice(0, Math.floor(upto) + 1); const f = upto - Math.floor(upto), nx = crackPts[Math.min(n - 1, Math.floor(upto) + 1)]; sub.push(lpt(sub[sub.length - 1], nx, f));
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 9; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0] + 2, p[1] + 2) : ctx.moveTo(p[0] + 2, p[1] + 2))); ctx.stroke();
    ctx.strokeStyle = P.night0; ctx.lineWidth = 6; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    ctx.restore();
  }
}
export function plantTip(t, x, y, s, u = 1) { const sw = .04 * Math.sin(t * .9), hh = s * expoOut(span(u, 0, .7)); return [x + Math.sin(sw) * hh * .3 + hh * .12, y - hh - 6]; }
// map a drawing made for rect a into rect b (uniform scale by width, centred)
export function mapRect(ctx, a, b, fn) { const s = b.w / a.w; ctx.save(); ctx.translate(b.x + b.w / 2, b.y + b.h / 2); ctx.scale(s, b.h / a.h); ctx.translate(-(a.x + a.w / 2), -(a.y + a.h / 2)); fn(ctx); ctx.restore(); }
export const PLANT = { x: crackPts[Math.floor(crackPts.length * .62)][0], y: crackPts[Math.floor(crackPts.length * .62)][1] };
// a plant that grows out of the crack: stem, leaves unfold, a bud with warm light (returns the bud point)
export function plant(ctx, t, x, y, s, u, o = {}) {
  u = clamp(u); if (u <= 0) return [x, y];
  const sw = .04 * Math.sin(t * .9), hh = s * expoOut(span(u, 0, .7)), tip = [x + Math.sin(sw) * hh * .3 + hh * .12, y - hh];
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = mixHex(GOLD.shade, '#7f9a4a', .55); ctx.lineWidth = Math.max(3, s * .035);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x - hh * .15, y - hh * .35, x + hh * .25, y - hh * .6, tip[0], tip[1]); ctx.stroke();
  const leaves = [[.3, -1], [.48, 1], [.66, -1], [.8, 1]];
  leaves.forEach(([v, side], i) => {
    const lu = expoOut(span(u, .2 + i * .12, .55 + i * .12)); if (lu <= 0) return;
    const q = v, px = lerp(x, tip[0], q) + Math.sin(q * 3) * hh * .05, py = lerp(y, tip[1], q), L = s * .28 * lu * (1 - i * .08);
    ctx.save(); ctx.translate(px, py); ctx.rotate(side * (.9 - .2 * Math.sin(t * .7 + i)) - .2); ctx.scale(side, 1);
    ctx.fillStyle = F.lin(ctx, 0, 0, L, 0, [[0, mixHex('#6f8f3c', GOLD.mid, .45)], [1, mixHex('#a7c25a', GOLD.hot, .35)]]);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(L * .3, -L * .35, L * .8, -L * .3, L, 0); ctx.bezierCurveTo(L * .8, L * .2, L * .3, L * .25, 0, 0); ctx.fill(); ctx.restore();
  });
  const bu = expoOut(span(u, .75, 1));
  if (bu > 0) { ctx.fillStyle = AMBER.body; ctx.beginPath(); ctx.ellipse(tip[0], tip[1] - 6 * bu, 10 * bu, 15 * bu, .2, 0, 6.29); ctx.fill(); F.halo(ctx, tip[0], tip[1] - 6, 70 * bu * (o.glow ?? 1), .9 * bu, AMBER.glow, AMBER.core); }
  ctx.restore();
  return tip;
}
// THE HOSPITAL ROOM (★ c10): warm 0..1 (the lamp's warm light, the rims), pain 0..1 (a dark shadow over the patient), lamp 0..1
export const ROOM = { lamp: [470, 470], bedX: [620, 1360], bedY: 640 };
export function hospital(ctx, t, o = {}) {
  const warm = clamp(o.warm ?? 1), pain = clamp(o.pain ?? 0), lamp = clamp(o.lamp ?? 1);
  ctx.fillStyle = F.lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, P.ind0, .3)], [1, P.night0]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.fillStyle = mixHex(P.night1, P.ind0, .55); ctx.fillRect(-W, 860, W * 3, H);
  // window (night, cool), a drip stand
  ctx.fillStyle = mixHex(P.ind1, P.blue0, .35); ctx.fillRect(1480, 180, 300, 360); ctx.fillStyle = P.night1; ctx.fillRect(1626, 180, 8, 360); ctx.fillRect(1480, 356, 300, 8);
  ctx.strokeStyle = mixHex(P.blue1, P.cream, .2); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1420, 860); ctx.lineTo(1420, 300); ctx.lineTo(1470, 300); ctx.stroke(); ctx.fillStyle = rgba(COLD.hi, .45); ctx.beginPath(); ctx.roundRect(1440, 310, 36, 60, 8); ctx.fill();
  // the warm pool of the lamp
  if (warm * lamp > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, ROOM.lamp[0], ROOM.lamp[1] + 80, 900, [[0, rgba(AMBER.body, .55 * warm * lamp)], [.45, rgba(AMBER.deep, .25 * warm * lamp)], [1, rgba(AMBER.deep, 0)]]); ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
  // bedside table + lamp
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(400, 560, 150, 300); ctx.fillStyle = mixHex(P.ind1, warm > 0 ? AMBER.deep : P.ind1, .3 * warm); ctx.fillRect(390, 548, 170, 16);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.fillRect(463, 470, 14, 80); ctx.beginPath(); ctx.moveTo(420, 470); ctx.lineTo(520, 470); ctx.lineTo(500, 410); ctx.lineTo(440, 410); ctx.closePath(); ctx.fill();
  if (lamp > 0) F.halo(ctx, 470, 478, 120 * lamp, (.4 + .6 * warm) * lamp, warm > .02 ? AMBER.glow : COLD.hi, warm > .02 ? AMBER.core : COLD.hi);
  // the bed
  const [bx0, bx1] = ROOM.bedX, by = ROOM.bedY;
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .3); ctx.fillRect(bx0 - 20, by - 160, 26, 360);   // headboard
  ctx.fillStyle = mixHex(P.cream, P.blue1, .55); ctx.fillRect(bx0, by, bx1 - bx0, 40);        // mattress
  ctx.fillStyle = P.night1; ctx.fillRect(bx0 + 10, by + 40, 18, 180); ctx.fillRect(bx1 - 28, by + 40, 18, 180);
  ctx.fillStyle = mixHex(P.cream, P.blue1, .35); ctx.beginPath(); ctx.ellipse(bx0 + 90, by - 16, 80, 30, 0, 0, 6.29); ctx.fill();   // pillow
  const br = 1 + .012 * Math.sin(t * 1.3);
  ctx.fillStyle = mixHex(P.ind2, P.blue0, .3); ctx.beginPath(); ctx.arc(bx0 + 110, by - 44, 34, 0, 6.29); ctx.fill();   // the patient's head
  ctx.fillStyle = F.lin(ctx, 0, by - 90, 0, by + 10, [[0, mixHex(P.blue1, P.halo2, .25 + .2 * warm)], [1, mixHex(P.blue1, P.night1, .3)]]);   // the blanket, breathing
  ctx.beginPath(); ctx.moveTo(bx0 + 140, by); ctx.bezierCurveTo(bx0 + 220, by - 92 * br, bx0 + 480, by - 70, bx1 - 30, by - 30); ctx.lineTo(bx1, by + 4); ctx.lineTo(bx0 + 140, by + 4); ctx.closePath(); ctx.fill();
  // the pain: a dark shadow that lies over the patient (pulses)
  if (pain > 0) {   // the pain: a dark, slowly churning shadow lying over the patient
    ctx.save(); for (let i = 0; i < 5; i++) { const ph = t * (.6 + i * .13) + i * 1.7, ex = bx0 + 200 + Math.cos(ph) * 40, ey = by - 70 + Math.sin(ph * 1.3) * 18;
      ctx.fillStyle = F.rad(ctx, ex, ey, 190, [[0, rgba('#04041a', .5 * pain)], [.7, rgba('#0a0826', .25 * pain)], [1, rgba('#0a0826', 0)]]); ctx.beginPath(); ctx.ellipse(ex, ey, 200, 120, -.1, 0, 6.29); ctx.fill(); } ctx.restore(); }
  // the visitor on a chair, hand on the patient's shoulder
  F.person(ctx, 990, 862, 350, { dir: -1, lean: .22 + .015 * Math.sin(t * .6), armR: [1.45, 1.35], armL: [.35, .6], look: -.35, light: -1, back: .5 * warm, long: true, rim: warm > .02 ? AMBER.glow : mixHex(P.blue1, P.halo2, .2) });
}
// the fridge corner: the fridge (front = door, light spills from the gap at the right), you facing it; photo + calendar on the door
export const FRIDGE = { x: 980, y: 170, w: 440, h: 700, photo: { x: 1060, y: 350, w: 150, h: 112 }, cal: { x: 1230, y: 320, w: 150, h: 190 } };
export function fridge(ctx, t, o = {}) {
  const open = clamp(o.open ?? 1), R = FRIDGE;
  ctx.fillStyle = F.lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, P.ind0, .3)], [1, P.night0]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.fillRect(-W, 870, W * 3, H);
  // the warm spill on floor and wall (from the gap on the right)
  if (open > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, R.x + R.w + 10, 560, 900, [[0, rgba(AMBER.body, .3 * open)], [.5, rgba(AMBER.deep, .1 * open)], [1, rgba(AMBER.deep, 0)]]); ctx.fillRect(-W, -H, W * 3, H * 3);
    ctx.fillStyle = F.lin(ctx, R.x + R.w, 0, R.x + R.w + 520, 0, [[0, rgba(AMBER.glow, .32 * open)], [1, rgba(AMBER.glow, 0)]]); ctx.beginPath(); ctx.moveTo(R.x + R.w, R.y + 20); ctx.lineTo(R.x + R.w + 22 * open, R.y + 20); ctx.lineTo(R.x + R.w + 620, 1080); ctx.lineTo(R.x + R.w - 40, 1080); ctx.closePath(); ctx.fill(); ctx.restore(); }
  // counter left with a kettle (life)
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(180, 600, 760, 270); ctx.fillStyle = mixHex(P.shade0, P.ind1, .55); ctx.fillRect(170, 590, 780, 16);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .35); ctx.beginPath(); ctx.roundRect(260, 520, 90, 72, [20, 20, 6, 6]); ctx.fill();
  // the fridge body + door
  ctx.fillStyle = F.lin(ctx, R.x, 0, R.x + R.w, 0, [[0, mixHex(P.cream, P.ind1, .62)], [.7, mixHex(P.cream, P.ind1, .55)], [1, mixHex(P.cream, AMBER.deep, .5 * open + .1)]]); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 22); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(R.x + 16, R.y + R.h * .36, R.w - 32, 5);   // freezer seam
  ctx.fillStyle = mixHex(P.cream, P.ind1, .4); ctx.fillRect(R.x + 30, R.y + 60, 12, 160); ctx.fillRect(R.x + 30, R.y + R.h * .36 + 40, 12, 200);   // handles
  if (open > 0) { ctx.fillStyle = rgba(AMBER.core, .85 * open); ctx.fillRect(R.x + R.w - 3, R.y + 18, 6 * open, R.h - 36); F.halo(ctx, R.x + R.w, R.y + R.h * .45, 220, .5 * open, AMBER.glow, AMBER.core); }
  // the photo under a magnet
  const ph = R.photo; if ((o.photo ?? 1) > 0) photo(ctx, t, ph.x, ph.y, ph.w, ph.h, o.photoRot ?? -.05);
  // the calendar
  if ((o.cal ?? 0) > 0) calendar(ctx, t, R.cal.x, R.cal.y, R.cal.w, R.cal.h, o.cal, o.marks ?? 0);
  // you
  if (o.you !== false) F.du(ctx, 760, 872, 360, { dir: 1, look: .25 + .05 * Math.sin(t * .5), light: 1, back: .6 * open, armR: o.armR ?? [.3, .6], armL: [.1, .2] });
}
export function photo(ctx, t, x, y, w, h, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(4, 6, w, h);
  ctx.fillStyle = PAPER.lit; ctx.fillRect(0, 0, w, h);
  const m = w * .06; ctx.fillStyle = F.lin(ctx, 0, m, 0, h - m * 2.4, [[0, mixHex(AMBER.glow, P.cream, .3)], [1, mixHex(AMBER.body, AMBER.deep, .4)]]); ctx.fillRect(m, m, w - m * 2, h - m * 3);
  // two people, close: an adult and a smaller one (silhouettes)
  ctx.fillStyle = mixHex(P.ind2, AMBER.deep, .3);
  const fy = h - m * 2; ctx.beginPath(); ctx.ellipse(w * .42, fy, w * .13, h * .32, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(w * .42, fy - h * .42, h * .1, 0, 6.29); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w * .62, fy, w * .09, h * .2, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(w * .62, fy - h * .28, h * .075, 0, 6.29); ctx.fill();
  ctx.restore();
  if (o.magnet !== false) { ctx.fillStyle = GOLD.mid; ctx.beginPath(); ctx.arc(x + w / 2, y + 2, 9, 0, 6.29); ctx.fill(); }
}
// a month calendar; marks 0..1 = the small sacrifices fill the days (gold glyphs: a sleepless night, a long drive, money, a cancelled plan)
const CALM = (() => { const r = prng(316), m = []; for (let i = 0; i < 30; i++) m.push({ d: i, k: Math.floor(r() * 4), on: r() < .62, o: r() }); return m.filter((q) => q.on).sort((a, b) => a.o - b.o); })();
export function calendar(ctx, t, x, y, w, h, u, marks) {
  const k = expoOut(clamp(u)); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(1, k); ctx.translate(-w / 2, 0);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(4, 6, w, h); ctx.fillStyle = PAPER.lit; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = mixHex(AMBER.deep, PAPER.ink, .3); ctx.fillRect(0, 0, w, h * .14);
  const cw = w / 7, top = h * .2, ch = (h - top) / 5;
  ctx.strokeStyle = rgba(PAPER.edge, .7); ctx.lineWidth = 1; for (let i = 0; i <= 7; i++) { ctx.beginPath(); ctx.moveTo(i * cw, top); ctx.lineTo(i * cw, h); ctx.stroke(); } for (let j = 0; j <= 5; j++) { ctx.beginPath(); ctx.moveTo(0, top + j * ch); ctx.lineTo(w, top + j * ch); ctx.stroke(); }
  const n = Math.round(CALM.length * clamp(marks));
  for (let i = 0; i < n; i++) {
    const q = CALM[i], cx = (q.d % 7 + .5) * cw, cy = top + (Math.floor(q.d / 7) + .5) * ch, s = Math.min(cw, ch) * .3, a = expoOut(clamp((CALM.length * marks - i) * 1.5));
    ctx.save(); ctx.translate(cx, cy); ctx.scale(a, a); ctx.strokeStyle = GOLD.deep; ctx.fillStyle = GOLD.mid; ctx.lineWidth = 1.6;
    if (q.k === 0) { ctx.beginPath(); ctx.arc(0, 0, s, .6, 5.7); ctx.arc(s * .45, 0, s * .8, 4.9, 1.4, true); ctx.fill(); }   // a moon: a night without sleep
    else if (q.k === 1) { ctx.beginPath(); ctx.arc(0, 0, s * .8, 0, 6.29); ctx.fill(); ctx.fillStyle = PAPER.lit; ctx.fillRect(-1, -s * .5, 2, s); }   // a coin
    else if (q.k === 2) { ctx.beginPath(); ctx.moveTo(-s, s * .5); ctx.lineTo(s, s * .5); ctx.moveTo(-s * .6, s * .5); ctx.lineTo(-s * .4, -s * .3); ctx.lineTo(s * .5, -s * .3); ctx.lineTo(s * .7, s * .5); ctx.stroke(); }   // a road trip
    else { ctx.beginPath(); ctx.moveTo(-s * .7, -s * .7); ctx.lineTo(s * .7, s * .7); ctx.moveTo(s * .7, -s * .7); ctx.lineTo(-s * .7, s * .7); ctx.stroke(); }   // a plan cancelled
    ctx.restore();
  }
  ctx.restore();
  ctx.fillStyle = GOLD.mid; ctx.beginPath(); ctx.arc(x + w / 2, y + 2, 9, 0, 6.29); ctx.fill();
}
// ------------------------------------------------------------------------------------------------ c11 objects
// the X post card: avatar (gold disc), name, role, date line, body words (qcard-style layout), footer
export function xpost(ctx, t, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(r.x + 8, r.y + 12, r.w, r.h, 22); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .55); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 22); ctx.fill();
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  const k = span(u, .35, 1); if (k <= 0) return null;
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 22); ctx.clip();
  const ax = r.x + 70, ay = r.y + 74;
  F.maskLine(ctx, [['Eddy Lazzarin', 0]], ax + 64, ay + 2, 42, rise(k), { serif: true, col: CREAM, glow: false });
  F.maskLine(ctx, [['GENERAL PARTNER, a16z', 0]], ax + 64, ay + 38, 22, rise(span(k, .15, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  F.maskLine(ctx, [['X · 26 MAY 2026', 0]], r.x + r.w - 44, ay + 2, 22, rise(span(k, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false, align: 'right' });
  F.maskLine(ctx, [['(EVENING OF 25 MAY, U.S. TIME)', 0]], r.x + r.w - 44, ay + 34, 22, rise(span(k, .3, 1)), { serif: false, weight: 600, col: rgba(P.halo2, .75), glow: false, align: 'right' });
  ctx.restore();
  return { ax, ay };
}
// draw laid-out words at (x0, y0) (lines from layout()), per-word style like qcard; returns positions
export function wordBlock(ctx, t, lines, x0, y0, size, lh, u, o = {}) {
  const pos = []; let ln = 0;
  for (const line of lines) {
    let xx = x0; const yy = y0 + ln * lh;
    for (const wd of line) {
      const g = clamp(wd.g ?? 0), d = clamp(wd.d ?? 0), col = mixHex(mixHex(o.ink ?? CREAM, GOLD.body, g), P.blue1, d * .7);
      pos.push({ w: wd.w, x: xx, y: yy, mw: wd.mw });
      if (wd.slot > 0) { ctx.save(); ctx.globalAlpha *= clamp(wd.slot); ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 14; ctx.beginPath(); ctx.roundRect(xx - 6, yy - size * .8, wd.mw + 12, size * 1.04, 6); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
      const gone = clamp(wd.gone ?? 0), lift = wd.lift ?? 0;
      if (gone < 1) {
        if (lift > 0 || gone > 0) { const gy = -lift - expoIn(gone) * 700; F.glowText(ctx, wd.w, xx + gone * 40, yy + gy, { size, serif: true, col: GOLD.text, glow: true }); }
        else F.maskLine(ctx, [[wd.w, 0]], xx, yy, size, rise(span(u, .1 + ln * .08, .7 + ln * .08)), { serif: true, col, glow: false });
      }
      xx += wd.mw + size * .26;
    }
    ln++;
  }
  return pos;
}
// a page turning over its left edge (u 0..1): the turning leaf is drawn foreshortened (front → back), revealing what is under it
export function pageTurn(ctx, r, u, drawFront, drawUnder, o = {}) {
  drawUnder(ctx);
  const e = quartIO(clamp(u)); if (e >= 1) return;
  const sx = Math.cos(Math.PI * e);
  ctx.save(); ctx.translate(r.x, 0); ctx.scale(Math.max(.003, Math.abs(sx) * (sx < 0 ? Math.min(1, 2 * (1 - e)) : 1)), 1); ctx.transform(1, -.08 * Math.sin(Math.PI * e), 0, 1, 0, 0); ctx.translate(-r.x, 0);
  if (sx > 0) drawFront(ctx); else { ctx.fillStyle = F.lin(ctx, r.x, 0, r.x + r.w, 0, [[0, PAPER.shade], [1, PAPER.body]]); ctx.fillRect(r.x, r.y, r.w, r.h); }
  ctx.restore();
}
// ------------------------------------------------------------------------------------------------ c12 objects
// a lever on a base: (x, y) = pivot on the base, len, ang (0 = upright, + = pulled toward the viewer's right)
export function lever(ctx, t, x, y, len, ang, u = 1) {
  const k = expoOut(clamp(u)); if (k <= 0) return null;
  const yy = y + (1 - k) * 260;
  ctx.save();
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .35); ctx.beginPath(); ctx.roundRect(x - 90, yy, 180, 40, 10); ctx.fill(); ctx.fillStyle = rgba(P.halo2, .3); ctx.fillRect(x - 90, yy, 180, 3);
  ctx.translate(x, yy); ctx.rotate(ang);
  ctx.fillStyle = F.lin(ctx, -9, 0, 9, 0, [[0, mixHex(P.cream, P.blue1, .45)], [1, mixHex(P.cream, P.ind1, .7)]]); ctx.fillRect(-8, -len, 16, len);
  ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(0, -len, 26, 0, 6.29); ctx.fill(); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(-7, -len - 7, 9, 0, 6.29); ctx.fill();
  ctx.restore();
  return [x + Math.sin(ang) * len, yy - Math.cos(ang) * len];
}
// the small scenes that go onto the RIGHT pan (they stay): 'chairs' (two chairs, a lamp), 'hands' (a hand on a hand), 'tuesday' (morning light on a table)
export function smallTile(ctx, t, kind, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(lerp(.5, 1, k), lerp(.5, 1, k)); ctx.globalAlpha *= clamp(u * 3);
  const x0 = -w / 2, y0 = -h / 2, rr = Math.min(w, h) * .07;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, 0, 0, Math.max(w, h) * .8, [[0, rgba(AMBER.glow, .14)], [1, rgba(AMBER.glow, 0)]]); ctx.fillRect(-w, -h, w * 2, h * 2); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, rr); ctx.clip();
  SMALL[kind](ctx, t, x0, y0, w, h);
  ctx.restore();
  ctx.strokeStyle = mixHex(P.cream, AMBER.glow, .4); ctx.lineWidth = Math.max(2, w * .012); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, rr); ctx.stroke();
  ctx.restore();
  return { x: x - w / 2, y: y - h / 2, w, h };
}
const SMALL = {
  chairs(ctx, t, x0, y0, w, h) {   // two chairs turned to each other, a low lamp, two cups
    const X = (u) => x0 + u * w, Y = (v) => y0 + v * h;
    ctx.fillStyle = F.lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.night1, AMBER.deep, .25)], [1, P.night1]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = F.rad(ctx, X(.5), Y(.45), w * .55, [[0, rgba(AMBER.body, .5)], [1, rgba(AMBER.body, 0)]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.fillRect(x0, Y(.82), w, h * .2);
    F.halo(ctx, X(.5), Y(.3), w * .08, .9, AMBER.glow, AMBER.core); ctx.strokeStyle = P.night0; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(.5), y0); ctx.lineTo(X(.5), Y(.28)); ctx.stroke();
    ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.fillRect(X(.42), Y(.6), w * .16, h * .04); ctx.fillRect(X(.495), Y(.64), w * .01, h * .18);   // a small table
    for (const [cx, d] of [[.24, 1], [.76, -1]]) {   // chairs facing each other
      ctx.fillStyle = mixHex(P.ind2, AMBER.deep, .25); ctx.fillRect(X(cx) - w * .08, Y(.62), w * .16, h * .04); ctx.fillRect(X(cx) - d * w * .08 - w * .012, Y(.3), w * .024, h * .36);
      ctx.fillRect(X(cx) - w * .07, Y(.66), w * .016, h * .16); ctx.fillRect(X(cx) + w * .055, Y(.66), w * .016, h * .16);
    }
    ctx.fillStyle = mixHex(P.cream, AMBER.glow, .4); ctx.fillRect(X(.45), Y(.555), w * .025, h * .045); ctx.fillRect(X(.53), Y(.555), w * .025, h * .045);
  },
  hands(ctx, t, x0, y0, w, h) {   // a hand on a hand (a promise kept): two forearms meet in warm light
    const X = (u) => x0 + u * w, Y = (v) => y0 + v * h;
    ctx.fillStyle = F.lin(ctx, x0, y0, x0 + w, y0 + h, [[0, mixHex(P.night1, AMBER.deep, .35)], [1, P.night1]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = F.rad(ctx, X(.5), Y(.55), w * .5, [[0, rgba(AMBER.body, .45)], [1, rgba(AMBER.body, 0)]]); ctx.fillRect(x0, y0, w, h);
    sideHand(ctx, X(.56), Y(.6), h * .2, 0, {});                                         // the lower hand, open, from the left
    sideHand(ctx, X(.5), Y(.48 + .006 * Math.sin(t * 1.4)), h * .2, Math.PI + .12, {});    // the upper hand rests on it, from the right
  },
  tuesday(ctx, t, x0, y0, w, h) {   // a Tuesday morning: a window's low sun on a table, a cup, an open book, nobody's diary
    const X = (u) => x0 + u * w, Y = (v) => y0 + v * h;
    ctx.fillStyle = F.lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.ind1, AMBER.glow, .25)], [1, mixHex(P.night1, AMBER.deep, .3)]]); ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = F.lin(ctx, 0, Y(.1), 0, Y(.5), [[0, mixHex(AMBER.glow, P.cream, .4)], [1, mixHex(AMBER.body, P.blue1, .3)]]); ctx.fillRect(X(.58), Y(.1), w * .3, h * .4);   // dawn window
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(X(.725), Y(.1), w * .012, h * .4); ctx.fillRect(X(.58), Y(.29), w * .3, h * .012);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(AMBER.glow, .25); ctx.beginPath(); ctx.moveTo(X(.58), Y(.5)); ctx.lineTo(X(.88), Y(.5)); ctx.lineTo(X(.62), Y(.8)); ctx.lineTo(X(.18), Y(.8)); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = mixHex(P.shade0, P.night1, .4); ctx.fillRect(X(.1), Y(.7), w * .8, h * .05); ctx.fillRect(X(.16), Y(.75), w * .03, h * .25); ctx.fillRect(X(.8), Y(.75), w * .03, h * .25);
    ctx.fillStyle = mixHex(P.cream, AMBER.glow, .35); ctx.fillRect(X(.3), Y(.62), w * .06, h * .08); ctx.fillStyle = PAPER.lit; ctx.fillRect(X(.42), Y(.66), w * .2, h * .04);
    // steam from the cup
    ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 12; i++) { const v = i / 11; const px = X(.33) + Math.sin(v * 6 + t * 2) * w * .012, py = Y(.6) - v * h * .2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  },
};
// your two hands, cupped and holding a warm light from below (x, y) = the light; o.close 0..1 (the hands close round it)
export function cupHands(ctx, t, x, y, s, u, o = {}) {
  const k = expoOut(clamp(u)); if (k <= 0) return;
  const cl = clamp(o.close ?? 0), yy = y + (1 - k) * s * 3;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(x + side * s * lerp(.55, .38, cl), yy + s * .25); ctx.scale(side, 1); ctx.rotate(lerp(.5, .9, cl));
    ctx.fillStyle = F.lin(ctx, 0, -s * .3, 0, s * 2, [[0, mixHex(P.coat, P.core1, .35)], [1, mixHex(P.coat, P.shade0, .5)]]);
    ctx.beginPath(); ctx.moveTo(-s * .1, -s * .1); ctx.bezierCurveTo(s * .2, -s * .4, s * .7, -s * .2, s * .62, s * .15); ctx.bezierCurveTo(s * .55, s * .45, s * .3, s * .5, s * .15, s * .55); ctx.lineTo(s * .25, s * 2.2); ctx.lineTo(-s * .4, s * 2.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(AMBER.glow, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-s * .1, -s * .1); ctx.bezierCurveTo(s * .2, -s * .4, s * .7, -s * .2, s * .62, s * .15); ctx.stroke();
    ctx.restore();
  }
}
// the workshop of the hopeful reading: benches, a gold machine arm doing the repetitive work, a door of morning light at the right,
// a wall clock (early afternoon), two people who leave together (o.leave 0..1)
export const SHOP = { door: { x: 1470, y: 300, w: 230, h: 560 } };
export function workshop(ctx, t, o = {}) {
  const lv = clamp(o.leave ?? 0), D = SHOP.door;
  ctx.fillStyle = F.lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, P.ind0, .3)], [1, mixHex(P.ind0, P.night0, .5)]]); ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(-W, 860, W * 3, H);
  // the door and its light (the hero light: morning, warm)
  ctx.fillStyle = F.lin(ctx, 0, D.y, 0, D.y + D.h, [[0, mixHex(AMBER.core, AMBER.glow, .3)], [1, mixHex(AMBER.glow, AMBER.body, .5)]]); ctx.fillRect(D.x, D.y, D.w, D.h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, D.x, 0, D.x - 700, 0, [[0, rgba(AMBER.glow, .3)], [1, rgba(AMBER.glow, 0)]]); ctx.beginPath(); ctx.moveTo(D.x, D.y + D.h); ctx.lineTo(D.x + D.w, D.y + D.h); ctx.lineTo(D.x - 500, 1080); ctx.lineTo(D.x - 900, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
  F.halo(ctx, D.x + D.w / 2, D.y + D.h * .4, 380, .45, AMBER.glow, AMBER.core);
  ctx.strokeStyle = mixHex(P.night1, P.ind1, .4); ctx.lineWidth = 14; ctx.strokeRect(D.x - 7, D.y - 7, D.w + 14, D.h + 14);
  // the clock: early afternoon (hands at ~3)
  const cx = 1180, cy = 200; ctx.fillStyle = mixHex(P.cream, P.ind1, .45); ctx.beginPath(); ctx.arc(cx, cy, 52, 0, 6.29); ctx.fill(); ctx.strokeStyle = P.night1; ctx.lineWidth = 5; ctx.stroke();
  ctx.strokeStyle = P.night0; ctx.lineCap = 'round'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 30, cy + 4); ctx.stroke(); ctx.lineWidth = 4; const ma = -Math.PI / 2 + .25 + t * .01; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ma) * 42, cy + Math.sin(ma) * 42); ctx.stroke();
  // benches
  for (const [bx, bw] of [[140, 520], [760, 520]]) { ctx.fillStyle = mixHex(P.shade0, P.night1, .5); ctx.fillRect(bx, 640, bw, 22); ctx.fillStyle = P.night1; ctx.fillRect(bx + 20, 662, 18, 200); ctx.fillRect(bx + bw - 38, 662, 18, 200); }
  // the machine arm on bench 1 (gold, repetitive), the pieces it stacks
  const ph = (t * .9) % 1, sw = Math.sin(ph * Math.PI * 2) * .35;
  ctx.fillStyle = GOLD.mid; ctx.fillRect(270, 600, 90, 40); ctx.save(); ctx.translate(315, 600); ctx.rotate(-.6 + sw); ctx.fillStyle = GOLD.body; ctx.fillRect(-10, -150, 20, 150); ctx.translate(0, -150); ctx.rotate(1.6 - sw * 1.4); ctx.fillRect(-8, -110, 16, 110); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(0, -110, 13, 0, 6.29); ctx.fill(); ctx.restore();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = mixHex(P.cream, P.shade0, .4); ctx.fillRect(470 + i * 36, 612 - (i % 2) * 18, 30, 26); }
  F.halo(ctx, 315, 540, 220, .3, P.halo0, P.core0);
  // a worker who stays at bench 2 (relaxed), the two who leave
  F.person(ctx, 1000, 860, 290, { dir: -1, lean: .15, armR: [1.1, 1.5], armL: [.9, 1.3], look: -.1, light: 1 });
  const wx = lerp(820, D.x + D.w * .35, sineIO(span(lv, .25, 1))), wx2 = lerp(560, D.x + D.w * .65, sineIO(span(lv, .05, .9)));
  const walking1 = lv > .25 && lv < 1, walking2 = lv > .05 && lv < .9;
  ctx.save(); if (lv > .6) { ctx.beginPath(); ctx.rect(-W, -H, D.x + D.w * (lv > .95 ? 0 : 1) + W, H * 3); }   // they step out into the light
  F.person(ctx, wx2, 860, 300, walking2 ? { walk: wx2 / 30, view: 'side', dir: 1, light: 1, back: .6 } : { dir: 1, armR: [lerp(.2, 1.9, bump(lv * 10, .4, 1.2)), 2.0], look: .1, light: 1, back: .4 });
  F.person(ctx, wx, 860, 280, walking1 ? { walk: wx / 30 + 1, view: 'side', dir: 1, light: 1, back: .6 } : { dir: -1, lean: .3, armR: [1.2, 1.6], armL: [1, 1.4], light: 1 });
  ctx.restore();
}
