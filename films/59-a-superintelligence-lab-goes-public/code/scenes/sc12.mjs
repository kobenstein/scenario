// c12 · Recall the warning · you are affected · a piece, a say, a stake: threads of light to every window · a stake has a voice · a share
// has a price ★ · subscribe 2 · the 15 s end screen.  (builder B3)
// The camera, the world and the composition of B3 live in sc09.mjs (b3(T)); this file holds c12's layers (overlays12): the warning tag
// (crystal card), the threads (city card, so the rooftop hides them correctly), your own thread (rooftop card) and the screen labels.
//
// | ID   | anchor (phrase)              | picture (one idea)                                                                  | camera / layer       |
// |------|------------------------------|-------------------------------------------------------------------------------------|----------------------|
// | 11.01| Now recall the warning       | the balance draws up into the crystal's gap; the WARNING tag drops again; RISKS TO HUMANITY unfolds; "who is affected?": pull back over the city | CRY → wide · MIX |
// | 11.02| You are                      | you on the rooftop, small, in the crystal's light; the shard glints on "share"      | push to you · SCENE  |
// | 11.03| You can buy a piece (2nd)    | A PIECE (the shard) · A SAY (the far window, the wheel behind glass) · threads of gold light run from the crystal to the windows: A STAKE | pull back · MIX |
// | 11.04| And a stake has a voice      | a letter climbs one thread (the senator), a second one (the watchdog); A PUBLIC RECORD (the prospectus rises); your own thread, your letter | creep · MIX |
// | 11.05★| A share has a price         | a tag "$" on your shard; the threads have none: they flare, every window turns warm, you hold the shard up | creep · MIX ★ |
// | A.01 | This channel exists (2nd)    | subscribe 2: the light runs down the threads into the windows; the whole city warm; no text, no QR | glide to END_CAM · CITY |
// | E.01 | (end screen, 15 s)           | S.END_CAM: the crystal top centre, you small on the ledge at the left with the shard; the dark rooftop carries the tiles (S.END_TILES); no text | breathing hold · CITY |
// carriers: the beam's thread → the gap → the warning tag → the city → you → the shard / the window / the threads → the letters → the tag "$" → the windows → END_CAM
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, smooth, halo, mixHex, prng } = E;
const { rise, GOLD, PAPER, LAMP, F0, maskLine } = F;

export default async (T, R) => { const { b3, PRINT } = await import('./sc09.mjs'); E.prepareEditorial(); return [{ t: R.a, draw: b3(T), print: PRINT }]; };

// the city's windows (the same seeded skylines as lib/f59_world.mjs cityWorld, city card Z 3800) → thread targets
function skyline(seed, x0, x1, base, hMin, hMax, wMin, wMax, litP) {
  const r = prng(seed), out = []; let x = x0;
  while (x < x1) {
    const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin), wins = [];
    const cols = Math.max(2, Math.floor(w / 26)), rows = Math.max(3, Math.floor(h / 34));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const q = r(); if (q < litP * 3) wins.push([i / cols, j / rows, q < litP ? 1 : 0, r()]); }
    out.push({ x, w, h, base, cols, rows, wins, ant: r() < .2 }); x += w + r() * 18 - 4;
  }
  return out;
}
function targets(n) {
  const all = [];
  for (const b of [...skyline(23, -3600, -1040, 1180, 260, 620, 120, 260, .07), ...skyline(41, -380, 9000, 1180, 120, 330, 110, 240, .07)]) {
    const cw = b.w / b.cols, rh = b.h / b.rows;
    for (const [u, v] of b.wins) {
      const x = b.x + u * b.w + cw * .3, y = b.base - b.h + v * b.h + rh * .35, w = cw * .38, h = rh * .38;
      if (x < -1700 || x > 1100 || (x > S.TOWER.x0 - 20 && x < S.TOWER.x1 + 20) || y > 1105) continue;
      all.push({ x: x + w / 2, y: y + h / 2, w, h });
    }
  }
  const r = prng(59); for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return all.slice(0, n).sort((p, q) => Math.abs(p.x - 500) - Math.abs(q.x - 500));
}

export function overlays12(T, a, X) {
  const veil = (t) => .45 * sineIO(span(t, a.record - .6, a.record + 1.2)) * (1 - sineIO(span(t, a.sprice - 1.0, a.sprice + .8)));
  // ---------------------------------------------------------------- 11.01 the warning tag (crystal card; tied in the gap)
  const wU = (t) => span(t, a.c12 + 1.2, a.c12 + 2.3) * (1 - span(t, a.youare - .3, a.youare + .7));
  function tag(ctx, t, r) {
    const u = wU(t); if (u <= 0) return;
    X.tagLines(ctx, t, r.gap[0], r.gap[1] + 14, [['WARNING', 1], ['RISKS TO HUMANITY', span(t, a.risks - .1, a.risks + .7)]], u, { size: 32, len: 70, swing: .03 * Math.sin(t * .8) });
  }
  // ---------------------------------------------------------------- 11.03 threads of light from the crystal's gap to the windows
  const TG = targets(32);
  const tIn = (i) => a.stake - .15 + i * .03;
  const tOut = (i) => a.everybody - .3 + i * .045;                       // A.01: the light runs down into the windows
  const flare = (t) => Math.sin(Math.PI * span(t, a.snever - .15, a.snever + 3.2));
  const L1 = 6, L2 = 17;                                                  // the threads that carry the senator's and the watchdog's letters
  function gapCity(c) {   // the crystal's gap in city-card design px
    const p = E.project(c, S.Z_CRY, ...X.GAPD), m = E.cardM(c, S.Z_CITY); if (!p || !m) return null;
    return [(p[0] - m.e) / m.k, (p[1] - m.f) / m.k, m.k];
  }
  function letterAt(ctx, x, y, s, a0, rot = 0) {
    if (a0 <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(a0); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = PAPER.lit; ctx.fillRect(-14, -9, 28, 18); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.2; ctx.strokeRect(-14, -9, 28, 18);
    ctx.beginPath(); ctx.moveTo(-14, -9); ctx.lineTo(0, 2); ctx.lineTo(14, -9); ctx.stroke();
    ctx.fillStyle = GOLD.mid; ctx.beginPath(); ctx.arc(0, 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function back(ctx, t, c) {
    if (t < tIn(0)) return;
    const gp = gapCity(c); if (!gp) return;
    const [gx, gy, k] = gp, fl = flare(t), wk = 1 / k;
    TG.forEach((w, i) => {
      const u1 = sineIO(span(t, tIn(i), tIn(i) + 1.1)), u0 = sineIO(span(t, tOut(i), tOut(i) + 1.6)); if (u1 <= 0) return;
      const pts = [[gx, gy], [lerp(gx, w.x, .5), lerp(gy, w.y, .5) + 40], [w.x, w.y]];
      if (u0 < 1) F.goldSpan(ctx, pts, u0, u1, { w: (.8 + 1.0 * fl) * wk, a: .42 + .58 * fl, spark: u1 < 1 });
      const lit = span(t, tIn(i) + .9, tIn(i) + 1.4);   // the window it reaches turns warm
      if (lit > 0) { ctx.fillStyle = rgba(LAMP.core, .85 * lit); ctx.fillRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h); halo(ctx, w.x, w.y, w.w * 3, .25 * lit * (1 + fl), GOLD.halo, LAMP.core); }
    });
    // the letters climb their threads (window → gap)
    for (const [i, t0] of [[L1, a.hers], [L2, a.his]]) {
      const f = span(t, t0 - .05, t0 + 1.7); if (f <= 0 || f >= 1) continue;
      const w = TG[i], e = sineIO(f), x = lerp(w.x, gx, e), y = lerp(w.y, gy, e) + 40 * Math.sin(Math.PI * e);
      letterAt(ctx, x, y, wk * 1.7, span(f, 0, .12) * (1 - span(f, .9, 1)), -.2);
    }
  }
  // your own thread (rooftop card): from the shard in your hand up to the gap; your letter climbs it on "when you use yours"
  function extra(ctx, t, c, sh) {
    const u = sineIO(span(t, a.yours - .35, a.yours + .7)), u0 = sineIO(span(t, a.chan + .2, a.chan + 2)); if (u <= 0 || u0 >= 1) return;
    const p = E.project(c, S.Z_CRY, ...X.GAPD), m = E.cardM(c, F0); if (!p || !m) return;
    const g = [(p[0] - m.e) / m.k, (p[1] - m.f) / m.k], wk = 1 / m.k, fl = flare(t);
    F.goldSpan(ctx, [g, [sh[0], sh[1] - 20]], u0, u, { w: (1.1 + .9 * fl) * wk, a: .6 + .4 * fl, spark: false });
    const f = span(t, a.yours + .25, a.yours + 2); if (f > 0 && f < 1) { const e = sineIO(f); letterAt(ctx, lerp(sh[0], g[0], e), lerp(sh[1] - 20, g[1], e), wk * 1.7, span(f, 0, .12) * (1 - span(f, .9, 1)), .2); }
  }
  // ---------------------------------------------------------------- labels: A PIECE · A SAY · A STAKE; A PUBLIC RECORD; the "$" tag
  function labels(ctx, t, g) {
    const out = (t0) => 1 - span(t, a.hers - .4, a.hers + .2);
    if (g.hand) F.goldLabel(ctx, g.hand[0] + 12, g.hand[1] - 18, 'A PIECE', null, rise(span(t, a.buyp + .45, a.buyp + 1.2)) * out(), { dx: -70, dy: 90, size: 30 });
    if (g.win) F.goldLabel(ctx, g.win.x + g.win.w * .5, g.win.y - 6, 'A SAY', null, rise(span(t, a.sayW - .05, a.sayW + .7)) * out(), { dx: 60, dy: -80, size: 30 });
    if (g.gap) F.goldLabel(ctx, g.gap[0] - 190, g.gap[1] + 20, 'A STAKE', null, rise(span(t, a.stake + .6, a.stake + 1.4)) * out(), { dx: -60, dy: -80, size: 30 });
  }
  function record(ctx, t) {
    const u = sineIO(span(t, a.record - .3, a.record + 1.0)) * (1 - sineIO(span(t, a.sprice - .8, a.sprice + .3))); if (u <= 0) return;
    ctx.save(); F.float(ctx, t, 1);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 712); ctx.clip(); ctx.translate(0, (1 - u) * 430);
    F.prospectus(ctx, t, W / 2 - 130, 320, 260, { u: 1, thick: 1, tabs: 1, cover: 'PROSPECTUS', sub: 'FORM S-1/A' });
    ctx.restore();
    ctx.strokeStyle = rgba(P.cream, .3 * u); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 220 * u, 712); ctx.lineTo(W / 2 + 220 * u, 712); ctx.stroke();
    F.goldText(ctx, [['A PUBLIC RECORD', 1]], W / 2, 770, 40, rise(span(t, a.record + .1, a.record + .8)) * u, { serif: false, weight: 600, align: 'center', spacing: .08 });
    ctx.restore();
  }
  function price(ctx, t, g) {
    const u = span(t, a.sprice - .1, a.sprice + .7) * (1 - span(t, a.chan + .2, a.chan + 1.2)); if (u <= 0 || !g.hand) return;
    F.priceTag(ctx, t, g.hand[0], g.hand[1] + 14 * g.hand[2], '$', u, { size: 34, len: 64, swing: .04 * Math.sin(t * .9) });
  }
  function over(ctx, t, g) { labels(ctx, t, g); record(ctx, t); price(ctx, t, g); }
  return { veil, over, tag, back, extra };
}
