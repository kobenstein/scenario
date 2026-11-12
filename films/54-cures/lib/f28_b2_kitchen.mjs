// Film 28 · B2 · c07 first part: plateTree → into lantern 7 (window fly-in, continuous) → Casey's kitchen (the hook's window, grown into a
// room) → the quote → the sentence trapped inside him → the head: speech area, four sensors, signals that stall → the bead turns signals
// into sounds into words → the thoughts stay dark → the tape of old recordings, his own voice leaves warm (lamp 7) → the speaker light
// grows into C3 → one man, a research study (dashed tag) → ≈ 2,000,000 words → push through the kitchen window (subscribe 1) where the
// outside world (lib/f28_b2_sea.mjs) takes over.
// ONE camera for the whole room: kitchen space K = the vignette's local space (1000 × 1515, lib/f28_seams.mjs vignetteKitchen) put on the
// F0 card. While the room is still inside lantern 7 the tree camera is DERIVED from the K camera (same screen mapping of the glass), so the
// hand-over from tree world to room is exact; the glass fills the screen at that moment.
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
import * as S from './f28_seams.mjs';
import * as B from './f28_b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, F0 } = E;
const TAU = Math.PI * 2;
const KMAX = 40;   // the tree camera's largest magnification on the F0 card (z stays > 30 px in front of it)

export const GL7 = S.lanternGlass(7), GK = GL7.w / 1000, GX0 = GL7.x - GL7.w / 2, GY0 = GL7.y - GL7.h / 2, KH = GL7.h / GK;   // K → tree: (GX0 + kx·GK, GY0 + ky·GK)
export const PANE_L = { x: 567, y: 219, w: 156, h: 441 }, PANE_R = { x: 737, y: 219, w: 156, h: 441 };
const HEAD = { x: 359.1, y: 632.4, rx: 50, ry: 55.3 };                 // Casey's head in K (vignetteKitchen: person at (360, 1303), h 757)
const TABLE_TAPE = [640, 1047];
const BEAD = [HEAD.x + 84, HEAD.y - 14], TAPE = [HEAD.x + 150, HEAD.y - 12], SPK = [HEAD.x + 200, HEAD.y - 12];
const SENS = [HEAD.x - 20, HEAD.y - 24];

// tree camera ↔ K view (u, v, s on the F0 card in K units)
export function treeCamFromK(c) { const m = E.cardM(c, F0), k = m.k / GK, e = m.e - GX0 * k, f = m.f - GY0 * k; return E.aim(F0, (W / 2 - e) / k, (H / 2 - f) / k, k); }
export function kViewOfTree(c) { const m = E.cardM(c, F0), k = m.k * GK, e = m.e + GX0 * m.k, f = m.f + GY0 * m.k; return { u: (W / 2 - e) / k, v: (H / 2 - f) / k, s: k }; }

export function makeKitchen(T, a, outside) {
  const T0 = a.casey, tP = T0 - S.SEAM_HALF, c3 = a.C3;
  const plateTreeCam = (t) => { const k = 1 + S.CREEP * (t - tP); return E.aim(F0, 980 + S.TRUCK * (t - tP), 600, 1.35 * k, 760, 560); };
  const pv = (t) => { const v = kViewOfTree(plateTreeCam(t)); return [t, v.u, v.v, v.s]; };
  // ---------------------------------------------------------------- the K camera (K units)
  const KK = [
    pv(tP), pv(T0 + .5),
    [a.brain - .3, 503, 742, .56],                       // the lantern framed, the room inside it (glass ≈ 850 px tall)
    [a.lips + .9, 515, 724, 2.4],                        // through the glass: the room fills the screen
    [a.als + .4, 440, 706, 2.8],                         // toward Casey
    [a.said + .2, 330, 704, 2.5],                        // room for the quote on the dark wall
    [a.how + .3, 348, 690, 3.0],
    [a.surgeons - .2, 380, 660, 4.4],                    // into the head
    [a.surgeons + 1.3, 404, 646, 5.7],
    [a.thoughts + .3, 400, 602, 5.5],
    [a.then + .6, 418, 640, 5.6],
    [a.thisis - .1, 432, 644, 5.6],
    [c3.start + .5, 436, 644, 5.4],
    [c3.end - .7, 545, 640, 2.0],                        // behind the plate: back to the room
    [a.oneman + 2.2, 530, 646, 2.08],
    [a.athome + .9, 470, 632, 2.02],
    [a.million + 1.6, 486, 628, 2.06],
    [a.channel - .45, 560, 560, 2.15],
    [a.channel + 2.5, 645, 440, 30],                      // through the left window pane (subscribe 1)
  ];
  const tR = KK[KK.length - 1][0];
  const ramp = (t) => E.smooth(span(t, T0 + .5, T0 + 3.0));
  const viewK = (t) => B.driftView(B.aimPath(t, KK), t, 3.0 * ramp(t) * (1 - span(t, a.channel + .4, a.channel + 1.6)), 7);
  const camK = (t) => B.camOf(F0, viewK(t));
  const proj = (c, x, y) => E.project(c, F0, x, y);
  const paneScreen = (c, p = PANE_L) => { const p0 = proj(c, p.x, p.y), p1 = proj(c, p.x + p.w, p.y + p.h); return { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] }; };
  // hand-overs: tH = the glass covers the screen (tree → room) · tW = the left pane covers the screen (room → outside)
  const covers = (r, m) => r.x < -m && r.y < -m && r.x + r.w > W + m && r.y + r.h > H + m;
  const glassScreen = (c) => paneScreen(c, { x: 0, y: 0, w: 1000, h: KH });
  let tH = a.lips + .9, tW = tR;
  for (let t = a.brain; t < a.lips + .9; t += 1 / 60) if (covers(glassScreen(B.camOf(F0, B.aimPath(t, KK))), 160)) { tH = t; break; }
  for (let t = a.channel; t < tR; t += 1 / 60) if (covers(paneScreen(B.camOf(F0, B.aimPath(t, KK))), 40)) { tW = t; break; }
  // the outer screen transform that shows the outside world (virtual 1920 × 1080) in the left pane: its centre on the pane centre,
  // scaled slower than the pane (parallax: the world outside is far). After tR it relaxes to the identity (the pull-out).
  // the world point at the pane centre: the middle of the night at first, the path of lamps (subscribe 1) as we push in, home after the pull-out
  const WP0 = [960, 540], WP1 = [660, 830];
  const wpAt = (t) => { const g = E.smooth(span(t, a.channel - .6, a.channel + 1.4)); return [lerp(WP0[0], WP1[0], g), lerp(WP0[1], WP1[1], g)]; };
  const outerK = (t) => { const r = paneScreen(camK(Math.min(t, tR))), wp = wpAt(t); return { k: Math.pow(r.h / 1080, .6), cx: r.x + r.w / 2, cy: r.y + r.h / 2, wx: wp[0], wy: wp[1] }; };
  const tOut1 = tR + 3.4;
  function outer(t) {
    if (t >= tOut1) return null;
    const o = outerK(t), u = sineIO(span(t, tR, tOut1)), k = Math.exp(lerp(Math.log(o.k), 0, u)), cx = lerp(o.cx, W / 2, u), cy = lerp(o.cy, H / 2, u), wx = lerp(o.wx, W / 2, u), wy = lerp(o.wy, H / 2, u);
    return { k, e: cx - k * wx, f: cy - k * wy };
  }

  // ---------------------------------------------------------------- the room's things (K units)
  const wordsVig = (t) => .4 * (1 - E.smooth(span(t, T0 + .5, T0 + 2.2)));
  function wallExt(ctx) {   // the room beyond the vignette's glass: same wall gradient, a floor below the table
    ctx.fillStyle = lin(ctx, 0, 0, 0, KH, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(-4000, -3000, 9000, 7600);
  }
  // the sentence that cannot get out: gold word-bars rise from his chest and pile up under the throat
  const PILE = (() => { const r = E.prng(707), out = []; for (let i = 0; i < 16; i++) out.push({ dt: i * .42 + r() * .12, len: 14 + r() * 22, x: 342 + r() * 30, slot: i }); return out; })();
  function pile(ctx, t) {
    const t0 = a.brain + .1, dim = 1 - .7 * E.smooth(span(t, a.surgeons, a.surgeons + 1.2)), gone = E.smooth(span(t, a.learned, a.learned + 1.2));
    if (t < t0 || gone >= 1) return;
    const pulse = 1 + .35 * Math.max(0, Math.sin((t - a.how) * 3.1)) * span(t, a.how, a.how + .5) * (1 - span(t, a.surgeons, a.surgeons + .6));
    for (const w of PILE) {
      const tb = t0 + w.dt; if (t < tb) continue;
      const u = sineIO(span(t, tb, tb + 1.1)), row = Math.floor(w.slot / 3), col = w.slot % 3;
      const y = lerp(930, 716 + row * 9, u), x = lerp(w.x, 336 + col * 14, u) + (row % 2) * 6;
      const al = Math.min(1, (t - tb) * 4) * dim * (1 - gone);
      halo(ctx, x + w.len * .25, y, 12 * pulse, .16 * al, P.halo0, P.halo1);
      ctx.strokeStyle = rgba(mixHex(P.halo0, P.core1, .25 * (pulse - 1)), .9 * al); ctx.lineWidth = 3.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w.len * (.45 + .2 * (1 - u)), y); ctx.stroke();
    }
    // the throat: a thin dark line the words press against
    const la = E.smooth(span(t, a.lips, a.lips + .8)) * dim * (1 - gone);
    if (la > 0) { ctx.strokeStyle = rgba(F.COOL.line, .55 * la); ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(326, 708); ctx.lineTo(392, 708); ctx.stroke(); ctx.setLineDash([]); }
  }
  // the head as a cross-section: the speech area (warm patch), four sensors, signal paths that run toward the jaw and stall
  const SIGP = [[[-6, 6], [-10, 26], [-4, 44]], [[2, 4], [4, 24], [6, 44]], [[-14, 2], [-24, 20], [-16, 42]]].map((q) => E.catmull([[SENS[0], SENS[1]], ...q.map(([dx, dy]) => [HEAD.x + dx, HEAD.y + dy])], 10));
  const along = (pts, u) => { const i = Math.min(pts.length - 2, Math.floor(u * (pts.length - 1))), f = u * (pts.length - 1) - i; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; };
  function headDiagram(ctx, t) {
    const on = E.smooth(span(t, a.surgeons - .2, a.surgeons + .9)), off = 1 - E.smooth(span(t, c3.start + .2, c3.start + 1.2));
    if (on <= 0 || off <= 0) return;
    const A = on * off;
    // the cross-section rim
    const rim = []; for (let k = 0; k <= 64; k++) { const ang = -Math.PI / 2 + k / 64 * TAU; rim.push([HEAD.x + Math.cos(ang) * (HEAD.rx + 2), HEAD.y + Math.sin(ang) * (HEAD.ry + 2), 1.4]); }
    ctx.save(); ctx.globalAlpha *= off; E.trail(ctx, rim, sineIO(span(t, a.surgeons - .1, a.surgeons + 1.1)), { w: 1.3, spark: false }); ctx.restore();
    // the speech area: a warm patch where the brain steers lips and tongue; brighter on 'Only the words'
    const pk = E.smooth(span(t, a.surgeons + .25, a.surgeons + 1.1)) * off, bright = 1 + .5 * E.smooth(span(t, a.only, a.only + .6)) * (1 - span(t, a.then + 1, a.then + 2));
    if (pk > 0) { halo(ctx, SENS[0], SENS[1], 26 * bright, .55 * pk, P.halo0, P.core1); halo(ctx, SENS[0], SENS[1], 9, .7 * pk, P.halo0, P.core0); }
    // four tiny sensors (cream squares), set one after another on 'tiny sensors'
    for (let k = 0; k < 4; k++) { const e = expoOut(span(t, a.surgeons + .75 + k * .1, a.surgeons + 1.25 + k * .1)) * off; if (e <= 0) continue;
      const x = SENS[0] + (k % 2 ? 4 : -4), y = SENS[1] + (k < 2 ? -4 : 4), s = 2.8 * e;
      ctx.fillStyle = rgba(P.cream, e); ctx.fillRect(x - s / 2, y - s / 2, s, s); halo(ctx, x, y, 5, .3 * e, F.COOL.halo, F.COOL.core); }
    // signals: warm dots run down toward the jaw and stall (slow down, fade) before they get there
    const sg = span(t, a.surgeons + 1.6, a.surgeons + 2.2) * off * (1 - .65 * span(t, a.learned + .5, a.learned + 1.4));
    if (sg > 0) for (let p = 0; p < 3; p++) for (let k = 0; k < 3; k++) {
      const ph = ((t * .55 + k / 3 + p * .21) % 1), u = .82 * (1 - (1 - ph) ** 2), x = along(SIGP[p], u), al = sg * Math.sin(Math.PI * ph) * (1 - span(ph, .75, 1));
      ctx.fillStyle = rgba(P.halo0, .9 * al); ctx.beginPath(); ctx.arc(x[0], x[1], 1.6, 0, TAU); ctx.fill();
    }
    if (sg > 0) for (const pts of SIGP) { ctx.save(); ctx.globalAlpha *= sg * .45; ctx.setLineDash([1.5, 3]); ctx.strokeStyle = P.halo2; ctx.lineWidth = .8; ctx.beginPath(); pts.slice(0, Math.floor(pts.length * .82)).forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    // the stall: a small gap mark at the jaw where nothing arrives
    const st = sg * span(t, a.surgeons + 2.4, a.surgeons + 3.2);
    if (st > 0) { ctx.strokeStyle = rgba(F.COOL.line, .6 * st); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(HEAD.x - 16, HEAD.y + 47); ctx.lineTo(HEAD.x + 12, HEAD.y + 47); ctx.stroke(); ctx.setLineDash([]); }
  }
  // the machine: a cool line leaves the sensors, the bead forms at its end; spikes in → sounds → words out; the thoughts stay dark;
  // the tape of old recordings docks; his own voice leaves warm toward the speaker light
  const LINE = E.catmull([[SENS[0] + 3, SENS[1] + 2], [HEAD.x + 20, HEAD.y - 22], [HEAD.x + 52, HEAD.y - 16], [BEAD[0], BEAD[1]]], 10);
  function machine(ctx, t) {
    const off = 1 - E.smooth(span(t, c3.start + .2, c3.start + 1.2)); if (t < a.learned - .2 || off <= 0) return;
    const lu = sineIO(span(t, a.learned - .1, a.learned + .7));
    const bright = .7 + .5 * E.smooth(span(t, a.only, a.only + .6));
    if (lu > 0) F.coolPath(ctx, LINE, 0, lu, 1.6 * bright, off);
    const born = expoOut(span(t, a.learned + .45, a.learned + 1.1)) * off;
    // spikes running into the bead
    if (born > 0) for (let k = 0; k < 4; k++) { const ph = ((t * .9 + k / 4) % 1), p = along(LINE, ph), al = born * Math.sin(Math.PI * ph);
      ctx.strokeStyle = rgba(F.COOL.core, .9 * al); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 4); ctx.lineTo(p[0] + .8, p[1] + 3); ctx.stroke(); }
    // sounds → words: small cool dots leave the bead, travel right, stretch and warm into word-bars; after 'Then it speaks them' they ride the voice
    const outT0 = a.learned + 1.0, voice = E.smooth(span(t, a.own - .2, a.own + 1.0));
    if (born > 0) for (let k = 0; k < 7; k++) {
      const ph = ((t - outT0) * .55 + k / 7) % 1; if (t < outT0 + k / 7 / .55) continue;
      const len = lerp(46, SPK[0] - BEAD[0] - 6, voice), x = BEAD[0] + 8 + ph * len, wv = voice * 3.5 * Math.sin(ph * 12 + t * 4);
      const warm = span(ph, .15, .6), bl = lerp(1.6, 7, warm), al = born * Math.sin(Math.PI * ph);
      ctx.strokeStyle = rgba(mixHex(F.COOL.body, P.halo0, warm), .95 * al); ctx.lineWidth = lerp(2.4, 3, warm); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, BEAD[1] + wv); ctx.lineTo(x + bl, BEAD[1] + wv); ctx.stroke();
    }
    // the thoughts: a cloud with a cool dashed outline that stays dark (it is not read)
    const cl = E.smooth(span(t, a.thoughts - .05, a.thoughts + .8)) * off;
    if (cl > 0) {
      const C = [[HEAD.x - 66, HEAD.y - 60, 15], [HEAD.x - 50, HEAD.y - 72, 12], [HEAD.x - 80, HEAD.y - 72, 11], [HEAD.x - 64, HEAD.y - 80, 10]];
      ctx.save(); ctx.globalAlpha *= cl;
      for (const [x, y, r] of C) { ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.arc(x, y, r * (.6 + .4 * expoOut(cl)), 0, TAU); ctx.fill(); }
      ctx.setLineDash([2.4, 2.4]); ctx.lineDashOffset = -t * 3; ctx.strokeStyle = rgba(F.COOL.line, .8); ctx.lineWidth = 1;
      for (const [x, y, r] of C) { ctx.beginPath(); ctx.arc(x, y, r * (.6 + .4 * expoOut(cl)), 0, TAU); ctx.stroke(); }
      ctx.setLineDash([]);
      for (const [d, r] of [[.35, 3.2], [.65, 2.2]]) { ctx.strokeStyle = rgba(F.COOL.line, .7); ctx.beginPath(); ctx.arc(lerp(HEAD.x - 34, HEAD.x - 52, d), lerp(HEAD.y - 34, HEAD.y - 46, d), r, 0, TAU); ctx.stroke(); }
      ctx.restore();
    }
    // the voice: a warm wave from the bead through the tape to the speaker light
    if (voice > 0) {
      ctx.save(); ctx.globalAlpha *= off; ctx.lineCap = 'round';
      const n = 60, x0 = BEAD[0] + 8, x1 = lerp(x0, SPK[0], voice);
      ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = 1.6; ctx.beginPath();
      for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(x0, x1, u), env = Math.sin(Math.PI * u) ** .6, y = BEAD[1] + Math.sin(u * 30 - t * 7) * 4.5 * env * (.6 + .4 * Math.sin(u * 7 + t * 1.3)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.restore();
    }
    if (born > 0) F.agent(ctx, t, BEAD[0], BEAD[1], 5.2 * born, { think: span(t, a.learned + .8, a.learned + 1.6) * (1 - voice) });
  }
  // the tape: it sat on the table all along; on 'Then it speaks them' it lifts into the picture and docks after the bead
  function tape(ctx, t) {
    const lift = sineIO(span(t, a.then - .4, a.then + 1.3)), off = 1 - E.smooth(span(t, c3.start + .2, c3.start + 1.2));
    const x = lerp(TABLE_TAPE[0], TAPE[0], lift) + 6 * Math.sin(Math.PI * lift), y = lerp(TABLE_TAPE[1], TAPE[1], lift) - 30 * Math.sin(Math.PI * lift), s = lerp(30, 26, lift);
    const lit = lerp(.15, .95, E.smooth(span(t, a.then + .9, a.own + .8)));
    if (lift >= 1 && off <= 0) return;
    ctx.save(); ctx.globalAlpha *= lift > 0 ? off : 1;
    ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.roundRect(x - s * .44, y - s * .28, s * .88, s * .56, s * .06); ctx.fill();
    F.tool(ctx, 'tape', x, y, s, { lit, glow: lift });
    if (lit > .3) for (const rx of [-.18, .18]) { const ang = t * 3.2; ctx.strokeStyle = rgba(P.core1, .8 * lit); ctx.lineWidth = s * .03; for (let k = 0; k < 3; k++) { const q = ang + k * TAU / 3; ctx.beginPath(); ctx.moveTo(x + rx * s, y - .06 * s); ctx.lineTo(x + rx * s + Math.cos(q) * s * .08, y - .06 * s + Math.sin(q) * s * .08); ctx.stroke(); } }
    ctx.restore();
  }
  // the speaker light where his voice comes out: grows, then the clip plate grows out of it
  function speaker(ctx, t) {
    const g = E.smooth(span(t, a.own + .4, a.own + 1.4)), off = 1 - span(t, c3.start + .1, c3.start + .5); if (g <= 0 || off <= 0) return;
    const br = 1 + .6 * E.smooth(span(t, a.thisis - .4, a.thisis + .4));
    halo(ctx, SPK[0], SPK[1], 20 * br, .7 * g * off, P.halo0, P.core1); halo(ctx, SPK[0], SPK[1], 6 * br, .9 * g * off, P.halo0, P.core0);
  }
  function windowFrame(ctx) {
    ctx.strokeStyle = P.night0; ctx.lineWidth = 14; ctx.strokeRect(560, 212, 340, 455); ctx.beginPath(); ctx.moveTo(730, 212); ctx.lineTo(730, 667); ctx.stroke();
  }
  // everything of the room in K units (drawn inside the lantern glass while in the tree, on the F0 card afterwards)
  function room(ctx, t, c) {
    S.vignetteKitchen(ctx, t, 1000, KH, { words: wordsVig(t), lamp: lerp(.8, 1, E.smooth(span(t, T0 + .5, T0 + 2))) });
    // the outside world through both panes (the far night: hills, the path of small lamps, the sea), its own camera, mapped into the panes
    const og = E.smooth(span(t, T0 + .6, T0 + 2.2));
    if (og > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(PANE_L.x, PANE_L.y, PANE_L.w, PANE_L.h); ctx.rect(PANE_R.x, PANE_R.y, PANE_R.w, PANE_R.h); ctx.clip();
      ctx.globalAlpha *= og; const o = outerK(t), M = { k: o.k, e: o.cx - o.k * o.wx, f: o.cy - o.k * o.wy };
      E.withOuter(M, () => outside(ctx, t, M));
      ctx.restore(); windowFrame(ctx);
    }
    tape(ctx, t); pile(ctx, t); headDiagram(ctx, t); machine(ctx, t); speaker(ctx, t);
  }

  // ---------------------------------------------------------------- one frame
  function draw(ctx, t) {
    if (t < T0 + S.SEAM_HALF) { S.plateTree(ctx, t, T); return null; }
    const c = camK(t);
    if (t < tH) {
      const st = S.treeTurnState(t, T), base = st.lantern, r1 = E.smooth(span(t, T0 + .5, T0 + 1.7));
      st.lantern = (n) => (n !== 7 ? base(n) : { lit: F.lampOn(T, 7, t) * .9 + .25, inside: (cx) => room(cx, t, c), glass: lerp(.6, 1, r1), swing: -.018 * Math.sin(t * .7 + 7 * 1.3) * r1 });
      const vk = viewK(t), kt = vk.s / GK;                                  // the tree camera's magnification on the F0 card
      if (kt <= KMAX) S.treeWorld(ctx, treeCamFromK(c), t, st);
      else {   // nearer than the F0 card allows (cards closer than 30 px are culled): the same picture from KMAX, zoomed on the screen
        const cl = E.aim(F0, GX0 + vk.u * GK, GY0 + vk.v * GK, KMAX), f = kt / KMAX;
        E.withOuter({ k: f, e: W / 2 * (1 - f), f: H / 2 * (1 - f) }, () => S.treeWorld(ctx, cl, t, st));
      }
    } else {
      E.card(ctx, c, F0, () => {
        wallExt(ctx); room(ctx, t, c);
        // the glass reflection of the lantern passes as we go through
        const sa = (.08 + .06 * (1 - (F.lampOn(T, 7, t) * .9 + .25))) * (1 - E.smooth(span(t, tH, tH + 1.4)));
        if (sa > 0) { ctx.fillStyle = rgba(P.cream, sa); ctx.beginPath(); ctx.moveTo(120, 0); ctx.lineTo(300, 0); ctx.lineTo(100, KH); ctx.lineTo(-80, KH); ctx.fill(); }
      });
    }
    overlays(ctx, t, c);
    return c;
  }
  // screen-space texts and cards anchored to the room
  function overlays(ctx, t, c) {
    // 7.02 the quote on the dark wall left of him
    if (t > a.said - .4 && t < a.how + 1.6) {
      const p = proj(c, 18, 596), q = F.QUOTES.harrell;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      F.quote(ctx, t, { text: q.lines.join(' '), x: Math.max(110, p[0]), y: p[1], size: 64, w: 470, t0: a.said - .15, t1: a.how + .5, attr: q.attr, attrSize: 22, gold: [[q.gold, a.trapped]] });
      ctx.restore();
    }
    // 7.10 one man, a research study: a dashed tag on a string from the dark ceiling, left of him
    const tu = span(t, a.oneman + .5, a.oneman + 1.5), tl = expoIn(span(t, a.athome - .5, a.athome + .1));
    if (tu > 0 && tl < 1) { const p = proj(c, 214, 470); B.dashTag(ctx, t, p[0], p[1] - 700 * tl, ['RESEARCH STUDY', 'NOT YET A TREATMENT'], tu, { size: 30, len: 46 + 700 * tl * 0, a: 1 - tl }); }
    // 7.11 the words he has spoken at home: a counter on the wall, fed by fine gold words flying from him
    const cu = span(t, a.athome + .2, a.million + 1.3), cout = E.smooth(span(t, a.channel - 1.1, a.channel - .3));
    if (cu > 0 && cout < 1) {
      const p = proj(c, 40, 640), x = Math.max(120, p[0]), y = p[1], fa = F.rise(span(t, a.athome + .2, a.athome + .9)) * (1 - cout);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fa;
      const src = proj(c, HEAD.x + 36, HEAD.y + 26), tgt = [x + 250, y - 40];
      for (let k = 0; k < 9; k++) { const ph = ((t - a.athome) * .62 + k / 9) % 1; if (t < a.athome + .1 + k / 9 / .62 || t > a.million + 1.6) continue;
        const e = sineIO(ph), bx = lerp(src[0], tgt[0], e), by = lerp(src[1], tgt[1], e) - 160 * Math.sin(Math.PI * e), al = Math.sin(Math.PI * ph), len = 10 + (k * 7) % 12;
        ctx.strokeStyle = rgba(P.halo0, .85 * al); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx - len / 2, by); ctx.lineTo(bx + len / 2, by); ctx.stroke(); }
      const v = 2000000 * expoOut(cu);
      halo(ctx, x + 240, y - 34, 260, .16, P.blue0, P.blue0);
      B.approx(ctx, Math.round(v).toLocaleString('en-US'), x, y + 30 * cout, 96, 1, {});
      const lu = F.rise(span(t, a.million - .1, a.million + .7));
      if (lu > 0) F.maskLine(ctx, [['WORDS · IN UNDER 2 YEARS', 0]], x + 4, y + 52 + 30 * cout, 28, lu, { serif: false, weight: 600, col: P.halo2, glow: false });
      ctx.restore();
    }
  }
  // the clip C3 grows out of the speaker light and shrinks back into the kitchen window
  function clip(ctx, t, c) {
    if (t < c3.start - 1.5 || t > c3.end + .7) return 0;
    const grow = sineIO(span(t, c3.start - 1.25, c3.start + .1)), shrink = sineIO(span(t, c3.end - .1, c3.end + .6));
    const m = grow * (1 - shrink); if (m <= 0) return 0;
    let from;
    if (t < (c3.start + c3.end) / 2) { const p = proj(c, SPK[0], SPK[1]); from = [p[0], p[1], 7 * p[2]]; }
    else { const r = paneScreen(c, { x: 567, y: 219, w: 326, h: 441 }); from = r; }
    const fade = span(t, c3.start - 1.25, c3.start - .95) * (1 - span(t, c3.end + .4, c3.end + .6));
    ctx.save(); ctx.globalAlpha = fade; F.clipPlate(ctx, t, T, 'C3', { from, morph: m }); ctx.restore();
    return m * fade;
  }
  return { draw, clip, camK, tH, tW, tR, tOut1, outer, T0 };
}
