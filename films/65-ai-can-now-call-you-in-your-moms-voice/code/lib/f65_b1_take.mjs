// Film 65 · B1 (c02–c06) as ONE continuous take: 'The first step is the voice' (plateLine(1)) → 'The third step is a face' (plateLine(3)).
// Every scene file sc02 … sc06 draws its range with the same draw(ctx, t) from b1Take(T): the inner chunk boundaries match frame for frame
// by construction. Plan: docs/shots.md 1.01–2.07 · world: docs/MOTION.md · kit: lib/f65_kit.mjs + lib/f65_seams.mjs (unchanged).
//
//   1.01 out of plate 1 the camera climbs the wire into her window (STEP 1 OF 5 · THE VOICE)
//   1.02 the kitchen: her phone, propped on a mug, plays the Senate hearing; a gold voice rises from it and turns blue on "kidnapped"
//   1.03 S1 ORIGINAL FOOTAGE grows out of the phone screen and shrinks back into it
//   1.04 the call timer runs to 5:30:00 while the moon crosses the kitchen window (5½ HOURS) · 1.05 she lifts the phone: FEELING SURE ≠ BEING RIGHT
//   1.06 the phone at her ear: three silent dots · 1.07 out over the valley: ★ the glow fans hundreds of thin blue lines to the town windows,
//        two are answered (a dialing computer) · NO CASE: ONE HELLO → A CLONE · 1.08 video tiles rise from windows, strips of gold voice drift to the glow
//   1.09 the kitchen: you opposite her, a covered gold note slides across · 1.10 three phones clone out of hers: ASK FOR THE WORD · HANG UP · CALL BACK
//   1.11 the note flies onto the fridge (slot 1); out of the window, tag 1 turns gold · 1.12 along the wire to pole 2: a question mark
//   2.01 STEP 2 OF 5 · THE STORY: tiny posts rise from the town windows, become lines of text and drift to the glow
//   2.02 the kitchen, her phone close: a person talks with a blue voice · a chat where only the machine types
//   2.03 the phone screen opens into the dating app: THOUSANDS · 3 OF 4 PROFILES · MACHINES · THE COMPANY REPORTS ON ITSELF ·
//   2.04 PAID CHAT, NOT SAVINGS · 2.05 ★ one human profile flickers, a blue ring closes: SUSPECTS
//   2.06 the app shrinks into the phone; its "?" lifts off as note 2 onto the fridge; the answer is a gold dot that stays in the house
//   2.07 out of the window: gold runs down the wire, tag 2 lights, tag 3 glows; a screen lights in a town window → plateLine(3)
import * as E from './f10_editorial.mjs';
import * as F from './f65_kit.mjs';
import * as S from './f65_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, lin, prng } = E;
const { rise, maskLine, GOLD, COPY, LAMP, INK, WOOD, bump } = F;
const TAU = Math.PI * 2;
const smoothU = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };

// ------------------------------------------------------------------------------------------------ helpers
// monotone cubic through keys [[t, [v…]]…] (like S.camPath): C1-smooth, no overshoot
function kp(t, K) {
  const n = K.length, T = K.map((k) => k[0]); if (t <= T[0]) return [...K[0][1]]; if (t >= T[n - 1]) return [...K[n - 1][1]];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, u2 = u * u, u3 = u2 * u, out = [];
  for (let d = 0; d < K[0][1].length; d++) {
    const v = (j) => K[j][1][d], sec = (j) => (v(j + 1) - v(j)) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    out.push((2 * u3 - 3 * u2 + 1) * v(i) + (u3 - 2 * u2 + u) * tan(i) * h + (-2 * u3 + 3 * u2) * v(i + 1) + (u3 - u2) * tan(i + 1) * h);
  }
  return out;
}
const mixCam = (A, B, w) => E.cam3({ x: lerp(A.x, B.x, w), y: lerp(A.y, B.y, w), z: lerp(A.z, B.z, w), hz: lerp(A.hz ?? S.HZ, B.hz ?? S.HZ, w) });
// a rect in the current transform → screen px
function xfRect(ctx, r) {
  const m = ctx.getTransform(), p = (x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
  const q = [p(r.x, r.y), p(r.x + r.w, r.y), p(r.x, r.y + r.h), p(r.x + r.w, r.y + r.h)], xs = q.map((v) => v[0]), ys = q.map((v) => v[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys); return { x: x0, y: y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
}
// draw into a phone's screen (same geometry as F.phone, flat 0). land: content in landscape, upright when the phone lies on its side (rot −π/2)
function onScreen(ctx, x, y, h, rot, land, fn) {
  const w = h * .5, m = h * .035, sx = -w / 2 + m, sy = -h / 2 + m * 1.6, sw = w - 2 * m, sh = h - 3.2 * m;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, h * .085 * .6); ctx.clip(); ctx.translate(sx, sy);
  if (land) { ctx.translate(sw, 0); ctx.rotate(Math.PI / 2); fn(ctx, sh, sw); } else fn(ctx, sw, sh);
  ctx.restore();
}
const pill = (ctx, x, y, w, h, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(w, h) / 2); ctx.fill(); };
const hms = (s) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(ss).padStart(2, '0'); };
const words = (ctx, txt, x, y, size, u, o = {}) => { if (u <= 0) return null; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const r = maskLine(ctx, [[txt, 0]], x, y, size, u, { serif: o.serif ?? false, weight: 600, col: o.col ?? P.core0, glow: o.glow ?? false, align: o.align }); ctx.restore(); return r; };

// ------------------------------------------------------------------------------------------------ phone screens (content only)
// the Senate hearing (landscape): panelled wall, a long table with a cloth, a nameplate, a microphone, the witness (generic, faceless)
function hearing(ctx, t, w, h, a) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.ind1, LAMP.deep, .25)], [1, mixHex(P.night1, LAMP.deep, .2)]]); ctx.fillRect(0, 0, w, h);
  for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(mixHex(LAMP.deep, P.halo2, .3), .18); ctx.fillRect(w * (.04 + k * .165), h * .08, w * .12, h * .46); }
  ctx.fillStyle = rgba(GOLD.body, .25); ctx.beginPath(); ctx.arc(w * .5, h * .2, h * .09, 0, TAU); ctx.fill();
  E.person(ctx, w * .52 + h * .006 * Math.sin(t * .8), h * 1.08, h * .78, { long: true, look: .04 * Math.sin(t * .5), lean: .02, light: 1 });
  ctx.fillStyle = mixHex(P.blue0, P.ind1, .4); ctx.fillRect(0, h * .66, w, h * .34);                       // the table cloth
  ctx.fillStyle = rgba(P.halo2, .45); ctx.fillRect(0, h * .66, w, h * .018);
  ctx.fillStyle = mixHex(P.cream, P.halo2, .3); ctx.fillRect(w * .4, h * .6, w * .2, h * .07);                // the nameplate
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = Math.max(.6, h * .015); ctx.beginPath(); ctx.moveTo(w * .62, h * .66); ctx.lineTo(w * .58, h * .46); ctx.stroke();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(w * .578, h * .45, h * .02, h * .03, -.4, 0, TAU); ctx.fill();
  for (const [x, s] of [[.12, 1], [.86, .9]]) { ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.ellipse(w * x, h * 1.02, h * .16 * s, h * .14 * s, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(w * x, h * .84, h * .07 * s, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the call timer (landscape): your contact picture left, the running time right
function timerScreen(ctx, t, w, h, sec, a) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.ind1, P.blue0, .35)], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
  F.avatar(ctx, w * .2, h * .5, h * .27);
  E.glowText(ctx, hms(sec), w * .66, h * .6, { size: h * .3, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .03 });
  ctx.fillStyle = rgba(P.cream, .8); ctx.beginPath(); ctx.arc(w * .66, h * .82, h * .055, 0, TAU); ctx.fill();
  ctx.restore();
}
// three silent dots (portrait: the phone at her ear)
function dotsScreen(ctx, t, w, h, a, t0) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.ind1, P.blue0, .35)], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
  for (let k = 0; k < 3; k++) { const u = rise(span(t, t0 + k * .25, t0 + k * .25 + .5)), p = .55 + .45 * Math.max(0, Math.sin((t - t0) * 3.2 - k * .9)); ctx.fillStyle = rgba(P.cream, u * (.35 + .6 * p)); ctx.beginPath(); ctx.arc(w * (.3 + k * .2), h * .45, w * .075, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// 2.02 split (landscape): left a person talking, a blue voice lent to him · right a chat where only the machine types
function splitScreen(ctx, t, w, h, o) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.ind1, P.blue0, .3)], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
  const L = o.left, R = o.right;
  if (L > 0) {
    ctx.save(); ctx.globalAlpha *= L; ctx.beginPath(); ctx.rect(0, 0, w * .49, h); ctx.clip();
    E.person(ctx, w * .17, h * 1.25, h * 1.05, { look: .1 + .05 * Math.sin(t * 1.7), lean: .02, light: 1 });
    ctx.restore();
    if (o.lend > 0) F.voiceWave(ctx, t, [[w * .2, h * .3], [w * .3, h * .22], [w * .46, h * .3]], { amp: h * .1, col: COPY, seed: 9, speed: w * .4, u1: o.lend, flicker: .6 });
  }
  ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(w * .495, h * .06, w * .01, h * .88);
  if (R > 0) {
    ctx.save(); ctx.globalAlpha *= R; ctx.beginPath(); ctx.rect(w * .51, 0, w * .49, h); ctx.clip();
    const n = o.msgs, scroll = Math.max(0, n - 4) * h * .2;
    for (let k = 0; k < Math.ceil(n); k++) {
      const g = rise(clamp(n - k)), y = h * (.1 + k * .2) - scroll; if (y < -h * .2) continue;
      const user = k % 3 === 2, bw = w * (user ? .16 : .26 + .12 * ((k * 37) % 5) / 5);
      ctx.globalAlpha = R * g;
      if (user) pill(ctx, w * .97 - bw, y, bw, h * .13, rgba(mixHex(P.cream, P.halo2, .35), .8));
      else { pill(ctx, w * .54, y, bw, h * .13, rgba(COPY.body, .85)); ctx.fillStyle = rgba(COPY.core, .7); ctx.fillRect(w * .56, y + h * .05, bw * .7, h * .025); }
    }
    ctx.globalAlpha = R;
    const ty = h * (.1 + Math.ceil(n) * .2) - scroll;   // the machine is typing (three dots in a blue pill)
    if (o.typing > 0 && ty < h * .95) { ctx.globalAlpha = R * o.typing; pill(ctx, w * .54, ty, w * .14, h * .12, rgba(COPY.body, .6)); for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba(COPY.core, .5 + .5 * Math.max(0, Math.sin(t * 6 - k))); ctx.beginPath(); ctx.arc(w * (.57 + k * .04), ty + h * .06, h * .018, 0, TAU); ctx.fill(); } }
    ctx.restore();
  }
}
// 2.06 one question on the screen (landscape): a cream bubble with a gold "?"
function questionScreen(ctx, t, w, h, a, q) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.ind1, P.blue0, .3)], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
  if (q > 0) { ctx.globalAlpha *= q; pill(ctx, w * .3, h * .28, w * .4, h * .44, rgba(mixHex(P.cream, P.halo2, .25), .9)); E.glowText(ctx, '?', w * .5, h * .64, { size: h * .38, serif: true, align: 'center', col: GOLD.deep, glow: false }); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the dating app (2.03–2.05), panel-local
const PANEL = { x: 640, y: 150, w: 1180, h: 660 };
const PROF = (() => { const r = prng(6502), out = new Map(); return (i, j) => { const k = i * 997 + j; if (!out.has(k)) out.set(k, [r(), r(), r()]); return out.get(k); }; })();
function datingApp(cx, t, w, h, m, o) {
  cx.fillStyle = lin(cx, 0, 0, 0, h, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); cx.fillRect(0, 0, w, h);
  const sp = 104, R = 34, z = o.zoom, sc = o.scroll, fx = o.fx, fy = o.fy;   // the feed scrolls up (an endless feed)
  cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-fx, -fy);
  const x0 = fx - w / 2 / z - sp, x1 = fx + w / 2 / z + sp, y0 = fy - h / 2 / z - sp, y1 = fy + h / 2 / z + sp;
  for (let j = Math.floor((y0 + sc) / sp); j <= Math.ceil((y1 + sc) / sp); j++) for (let i = Math.floor(x0 / sp); i <= Math.ceil(x1 / sp); i++) {
    const x = i * sp + sp / 2, y = j * sp + sp / 2 - sc, [r1, r2, r3] = PROF(i + 500, j + 500), machine = r1 < .75;
    const rev = machine ? rise(span(o.reveal, r2 * .6, r2 * .6 + .4)) : 0, hu = machine ? 0 : rise(span(o.reveal, .5, 1)) * .85;
    const sus = o.suspect && i === o.suspect[0] && j === o.suspect[1] ? o.sus : 0;
    const base = mixHex(P.ind1, P.halo2, .3), fill = mixHex(mixHex(base, mixHex(COPY.deep, COPY.body, .5), rev), LAMP.deep, hu + .4 * sus), fig = mixHex(mixHex(mixHex(P.cream, P.halo2, .45), COPY.core, rev), LAMP.core, hu + sus * (.5 + .5 * Math.sin(t * 9)));
    cx.save(); cx.translate(x, y); cx.fillStyle = fill; cx.beginPath(); cx.arc(0, 0, R, 0, TAU); cx.fill(); cx.clip();
    cx.fillStyle = fig; cx.beginPath(); cx.arc(0, -R * .16 + R * .03 * Math.sin(t * .7 + r3 * 6), R * .32, 0, TAU); cx.fill(); cx.beginPath(); cx.ellipse(0, R * .75, R * .62, R * .45, 0, 0, TAU); cx.fill();
    cx.restore();
    if (rev > 0) { cx.strokeStyle = rgba(COPY.line, .5 * rev); cx.lineWidth = 2; cx.beginPath(); cx.arc(x, y, R + 3, 0, TAU); cx.stroke(); }
    if (sus > 0) { halo(cx, x, y, R * 3, .45 * sus, LAMP.halo, LAMP.core); }
  }
  // ★ the ring that closes around the one who starts to suspect, and the word
  if (o.suspect && o.ring > 0) {
    const x = o.suspect[0] * sp + sp / 2, y = o.suspect[1] * sp + sp / 2 - sc, rr = R + 14;
    cx.save(); cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = rgba(COPY.halo, .35 * o.ring); cx.lineWidth = 16; cx.beginPath(); cx.arc(x, y, rr, -Math.PI / 2, -Math.PI / 2 + TAU * o.ring); cx.stroke(); cx.restore();
    cx.strokeStyle = rgba(COPY.body, .95); cx.lineWidth = 5; cx.lineCap = 'round'; cx.beginPath(); cx.arc(x, y, rr, -Math.PI / 2, -Math.PI / 2 + TAU * o.ring); cx.stroke();
    if (o.word > 0) { cx.fillStyle = rgba(P.night0, .85 * rise(o.word)); cx.beginPath(); cx.roundRect(x + rr + 8, y - 34, 262, 62, 12); cx.fill(); } if (o.word > 0) maskLine(cx, [['SUSPECTS', 0]], x + rr + 22, y + 14, 46, o.word, { serif: false, weight: 600, col: COPY.text, glow: false });
  }
  cx.restore();
  // the app's top bar
  cx.fillStyle = rgba(P.night0, .75); cx.fillRect(0, 0, w, 56); cx.fillStyle = rgba(P.halo2, .5); for (let k = 0; k < 3; k++) cx.fillRect(w / 2 - 70 + k * 56, 25, 36, 6);
}

// ------------------------------------------------------------------------------------------------ the take
const CACHE = new WeakMap();
export function b1Take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const G = (p, after = 58) => T.G(p, 0, after);
  const a = {};
  a.T0 = T.G('The first step is the voice'); a.p0 = a.T0 + S.SEAM_HALF;
  a.summer = G('This summer'); a.senate = G('Senate about one call'); a.daughter = G("Her daughter's voice"); a.kidnap = G('kidnapped', a.daughter);
  const s1 = T.clip('S1'); a.S1s = s1.start; a.S1e = s1.end;
  a.notD = G('It was not her daughter'); a.noK = G('There was no kidnapping'); a.kept = G('And the callers kept'); a.fiveH = G('five and a half', a.kept);
  a.certain = G('She was certain'); a.anyone = G('Anyone would be');
  a.where = G('So where does a machine'); a.heard = G('You may have heard'); a.silent = G('silent seconds', a.heard); a.hello = G('say hello', a.heard);
  a.usually = G('Usually that silence'); a.dialing = G('a dialing computer', a.usually); a.more = G('calling more numbers', a.usually); a.free = G('free to talk', a.usually);
  a.noCase = G('No documented case'); a.posted = G('The voice can come'); a.hiding = G('So hiding it');
  a.family = G('That family in California'); a.likely = G("You've likely heard"); a.panic = G('A panicked call asks'); a.ask = G('Ask for the word');
  a.hang = G('hang up', a.ask); a.callBack = G('call back', a.ask); a.fbi = G('The FBI recommends'); a.loves = G('a voice she loves', a.fbi);
  a.still = G('Still a voice is only'); a.caller = G('The caller also seems'); a.how = G('How', a.caller);
  a.story = G('That is the second step'); a.whatever = G('Whatever a family posts'); a.noLonger = G('And the machine no longer'); a.person = G('a person usually', a.noLonger);
  a.lending = G('lending the voice', a.person); a.chat = G('But in chat'); a.whole = G('the whole conversation', a.chat);
  a.clearest = G('The clearest case'); a.misuse = G('reporting misuse', a.clearest); a.app = G('An app maker'); a.thousands = G('It put thousands');
  a.three = G('Three out of four'); a.paid = G('This was paid chat'); a.machinery = G('But look at the machinery'); a.track = G('The system kept track'); a.suspect = G('starting to suspect', a.track);
  a.second = G('So agree on a second'); a.knowing = G('Knowing things proves'); a.oneQ = G('A panicked caller gets'); a.whose = G('whose answer', a.oneQ);
  a.guards = G('That guards against'); a.still3 = G('And still the panicked call'); a.screen = G('Those often start'); a.third = G('And they take a third');
  a.T3 = T.G('The third step is a face'); a.seam3 = a.T3 - S.SEAM_HALF;
  const draw = take(a, T);
  CACHE.set(T, draw);
  return draw;
}

// world points
const WIN = S.winWorld();
const lookWin = (mag, sy = 560) => S.look(WIN[0], WIN[1], WIN[2], mag, 960, sy, 600);
const ALLWIN = S.TOWN.flatMap((hs) => hs.wins.map((w) => ({ x: hs.x + w.x, y: w.y, z: hs.z, lit: w.lit, ph: w.ph })));
const LITWIN = ALLWIN.filter((w) => w.lit);
const MUG = { x: 1062, y: 772 }, STAND = { x: 993, y: 744, h: 170 };   // her phone, propped on its side against a mug on the table

function take(a, T) {
  // ---- the world camera (one path; the kitchen visits happen inside her window)
  const pole2 = S.poleTop(2);
  const K = [
    [a.p0, S.lineCam(1, S.creep(a.p0, T, S.LINE_PHRASE[1]))],
    [a.summer - .55, lookWin(3.7, 570)], [a.summer + .6, lookWin(6.2)], [a.usually - .1, lookWin(6.8)],
    [a.usually + 1.5, lookWin(3.0, 600)],                                                                       // back out through the window
    [a.dialing - .2, E.cam3({ x: 700, y: -840, z: 300, hz: 450 })], [a.noCase + .6, E.cam3({ x: 560, y: -780, z: 1080, hz: 458 })],   // ★ up over the valley
    [a.posted + 1.3, E.cam3({ x: 250, y: -600, z: 2150, hz: 482 })],                                           // the tiles over the town
    [a.family - .6, lookWin(3.7, 570)], [a.family + .5, lookWin(6.2)], [a.fbi + 2.3, lookWin(6.8)],
    [a.still + .6, S.look(-1350, 476, 6400, 2.35, 780, 584, 572)],                                              // her house, pole 1 (one long pull-out)
    [a.caller + .4, S.look(pole2[0], pole2[1] - 200, pole2[2], 2.15, 780, 610, 548)],                           // along the wire: pole 2
    [a.story + .3, S.look(pole2[0] + 70, pole2[1] - 195, pole2[2], 1.8, 800, 610, 544)],
    [a.whatever + 1.0, S.look(-700, 330, 6400, 1.45, 820, 640, 520)],                                            // the town and the glow
    [a.noLonger - .6, lookWin(3.7, 570)], [a.noLonger + .5, lookWin(6.2)], [a.still3 - .15, lookWin(6.8)],
    [a.still3 + 1.6, S.look(-1380, 470, 6400, 2.1, 760, 600, 560)],
    [a.screen + .4, S.look(-760, 370, 6400, 2.05, 860, 595, 540)],
    [a.seam3, S.lineCam(3)],
  ];
  // ---- kitchen visits (portal out of her window): open / shut
  const V = [
    { open: [a.summer - .55, a.summer + .55], shut: [a.usually - .1, a.usually + 1.4] },
    { open: [a.family - .6, a.family + .5], shut: [a.fbi + 2.3, a.fbi + 3.7] },
    { open: [a.noLonger - .6, a.noLonger + .5], shut: [a.still3 - .15, a.still3 + 1.35] },
  ];
  const lmOf = (v, t) => sineIO(span(t, ...v.open)) * (1 - sineIO(span(t, ...v.shut)));
  // the kitchen's own camera per visit: [fx, fy, zoom] (kitchen point fx, fy at the screen centre)
  const KC = [
    [[a.summer - .6, [960, 560, 1]], [a.summer + .9, [975, 590, 1.07]], [a.senate + .4, [985, 650, 1.32]], [a.daughter - .2, [1050, 650, 1.75]], [a.S1s - .6, [1055, 648, 1.9]],
      [a.S1e + .3, [1058, 646, 1.98]], [a.notD + 1.4, [1180, 600, 1.45]], [a.fiveH + 1.2, [1196, 596, 1.55]], [a.certain + 1.1, [1150, 625, 1.3]], [a.where + .3, [1168, 608, 1.4]],
      [a.silent + .3, [1226, 566, 1.95]], [a.usually + 1.5, [1238, 556, 2.12]]],
    [[a.family - .7, [960, 560, 1]], [a.family + 1.0, [955, 600, 1.08]], [a.likely + .3, [1000, 712, 1.55]], [a.panic - .2, [1006, 708, 1.66]], [a.ask - .6, [985, 650, 1.3]],
      [a.fbi - .1, [990, 642, 1.36]], [a.fbi + 1.6, [580, 505, 1.28]], [a.fbi + 3.8, [556, 498, 1.36]]],
    [[a.noLonger - .7, [960, 560, 1]], [a.noLonger + 1.0, [985, 690, 1.7]], [a.person - .1, [1060, 728, 3.3]], [a.clearest - .3, [1058, 731, 3.5]], [a.clearest + 1.0, [890, 733, 3.5]], [a.second - .2, [884, 735, 3.6]],
      [a.knowing + .5, [720, 600, 1.35]], [a.oneQ + .4, [745, 594, 1.42]], [a.guards - .5, [1085, 565, 1.15]], [a.still3 + 1.4, [1100, 560, 1.2]]],
  ];
  const visitAt = (t) => (t < (a.usually + a.posted) / 2 ? 0 : t < (a.fbi + a.noLonger) / 2 ? 1 : 2);
  // ---- the note on the table (c04) and on the fridge
  const noteSlide = (t) => sineIO(span(t, a.family + 1.4, a.likely + .2));
  const noteFly = (t) => sineIO(span(t, a.fbi + .35, a.fbi + 1.75));
  const note2Fly = (t) => sineIO(span(t, a.knowing + .2, a.knowing + 1.6));
  // the panel (dating app) out of the phone screen
  const panelM = (t) => sineIO(span(t, a.clearest - .1, a.clearest + .9)) * (1 - sineIO(span(t, a.second - .3, a.second + .7)));
  // the three phones (c04)
  const PH3 = [{ x: 560, w: a.panic + .1, label: 'ASK FOR THE WORD', lw: a.ask, screen: 'call' }, { x: 960, w: a.hang - .35, label: 'HANG UP', lw: a.hang, screen: 'dark' }, { x: 1360, w: a.callBack - .35, label: 'CALL BACK', lw: a.callBack, screen: 'contacts' }];
  const ph3U = (k, t) => sineIO(span(t, PH3[k].w - .2, PH3[k].w + .6)) * (1 - sineIO(span(t, a.fbi - .25 + (2 - k) * .12, a.fbi + .45 + (2 - k) * .12)));
  // the answered windows (two lit town windows) and the tiles (three lit windows)
  const ANS = [7, 19].map((i) => LITWIN[i % LITWIN.length]);
  const TILES = [3, 12, 24].map((i, k) => ({ w: LITWIN[i % LITWIN.length], kind: k }));
  const POSTS = [1, 5, 9, 14, 17, 21, 26, 29, 33, 2].map((i, k) => ({ w: LITWIN[i % LITWIN.length], t0: a.story + .9 + k * .42 }));
  const SCREENWIN = (() => { let best = null; for (const hs of S.TOWN) for (const w of hs.wins) { const x = hs.x + w.x; if (!w.lit && x > 950 && x < 1100 && hs.z < 14000 && (!best || hs.z < best.z)) best = { x, y: w.y, z: hs.z - 2 }; } return best; })();

  let rectPhone = null, kitchenXf = null;   // the phone screen (screen px) and the kitchen transform of the current frame

  return (ctx, t) => {
    if (t < a.p0) { S.plateLine(ctx, t, T, 1); return; }
    if (t >= a.seam3) { S.plateLine(ctx, t, T, 3); return; }
    // ---------------- world camera: out of the plate's creep into the path; drift lives in between
    const cCreep = S.lineCam(1, S.creep(t, T, S.LINE_PHRASE[1]));
    let c = S.camPath(t, K); c = mixCam(cCreep, c, sineIO(span(t, a.p0, a.p0 + 1.2)));
    const dA = span(t, a.p0, a.p0 + 1.6) * (1 - span(t, a.seam3 - 2.4, a.seam3 - .1));
    c = S.drift(c, t, 3000, 1.4 * dA, 66);
    // between two kitchen visits the world lens creeps in all the time (focal length, so far and near move alike): it resets only
    // while the kitchen fills the screen (the world is not drawn then), so it never jumps on screen. Not in the plate-bound ends.
    for (const [s0, s1, r] of [[V[0].shut[0], V[1].open[1], .02], [V[1].shut[0], V[2].open[1], -.03]]) if (t >= s0 && t < s1) c = { ...c, f: c.f * (1 + r * (t - (s0 + s1) / 2)) };   // in over the valley, out along the wire
    if (t >= V[0].shut[0] && t < V[1].open[1]) c = { ...c, f: c.f * (1 + .3 * (sineIO(span(t, a.dialing - .2, a.posted + 1.3)) - .5)) };   // the valley flight leans in (the dialer's reach)
    const v = visitAt(t), lm = lmOf(V[v], t);
    // ---------------- the line's state (starts at lineState(1), ends at lineState(3))
    const wireU = 1 + 2 * sineIO(span(t, a.still3 + 1.0, a.screen + .9));
    const lit1 = rise(span(t, a.fbi + 3.8, a.fbi + 4.6)), lit2 = rise(span(wireU, 1.9, 2.25));
    const hi = t < a.story - .1 ? 1 : wireU < 2.5 ? 2 : 3;
    const hiA = hi === 1 ? 1 - span(t, a.story - .7, a.story - .15) : hi === 2 ? rise(span(t, a.story - .1, a.story + .6)) * (1 - span(wireU, 1.85, 2.2)) : rise(span(wireU, 2.8, 3));
    const dial = span(t, a.usually + .6, a.dialing) * (1 - span(t, a.posted + 2.0, a.family - .4));
    const postsA = span(t, a.story, a.whatever) * (1 - span(t, a.noLonger - .8, a.noLonger + .2));
    const st = {
      source: { a: .55 + .35 * smoothU(dial) + .2 * smoothU(postsA), pulse: Math.max(smoothU(dial), smoothU(postsA)) },
      tags: { lit: (k) => (k === 1 ? lit1 : k === 2 ? lit2 : 0), hi, hiA },
      wire: { gold: 1, u: wireU },
      bank: { win: .8, glow: 0 },
      house: { win: 1 + .45 * Math.max(...V.map((vv) => span(t, vv.open[0] - .9, vv.open[0]) * (1 - span(t, vv.shut[1], vv.shut[1] + 1.2)))) },
      back: (cx, out) => worldBack(cx, t, c, out),
      extra: (cx, out) => worldExtra(cx, t, c, out),
    };
    if (lm < 1) S.lineWorld(ctx, c, t, st);
    // ---------------- the kitchen (inside her window)
    rectPhone = null;
    if (lm > 0) {
      const from = S.winRect(c);
      const kc = kp(t, KC[v]), z = kc[2] * (1 + .014 * Math.sin(t * .31));
      // the kitchen always creeps: a slow elliptic float (screen speed ~56-75 px/s, never zero) on top of the keyed path and the drift
      const orb = 120 * clamp((z - 1.0) / .1) / z, fx = kc[0] + E.drift(t, 9, 31 + v) / z + orb * Math.cos(t * .62 + v), fy = kc[1] + E.drift(t, 6, 37 + v) / z + .75 * orb * Math.sin(t * .62 + v);
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, lm, (cx, w, h) => {
        cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-fx, -fy);
        kitchenBeat(cx, t, v, w, h);
        cx.restore();
        // a soft night vignette: the lamp stays the brightest thing, the room's edges sink (keeps the close-ups under luma 60)
        const vk = 1 + .7 * clamp((z - 2) / 1.5);   // deeper in the close-ups (the lit table fills the frame there)
        cx.fillStyle = E.rad(cx, w / 2, h * .46, Math.hypot(w, h) * .55, [[0, rgba(P.night0, .03 * vk)], [.4, rgba(P.night0, .1 * vk)], [1, rgba(P.night0, Math.min(.85, .62 * vk))]]); cx.fillRect(0, 0, w, h);
      }, { rim: LAMP, r: 12 * (1 - lm), glow: lm < .98 });
    }
    // ---------------- screen-space pieces: clip S1, the app panel, the three phones, the words
    if (rectPhone) {
      const m1 = sineIO(span(t, a.S1s - 1.0, a.S1s)) * (1 - sineIO(span(t, a.S1e, a.S1e + .9)));
      if (m1 > 0 && lm >= 1) F.clipFrame(ctx, t, T, 'S1', { from: rectPhone, morph: m1, dark: .85 * (1 - span(t, a.S1s - .55, a.S1s - .1)) + span(t, a.S1e + .35, a.S1e + .9) });
      const pm = panelM(t);
      if (pm > 0 && lm >= 1) F.veil(ctx, .3 * pm);   // the room sinks while the app is open
      if (pm > 0 && lm >= 1) F.portal(ctx, rectPhone, PANEL, pm, (cx, w, h) => datingApp(cx, t, w, h, pm, appState(t)), { rim: COPY, r: lerp(6, 18, pm), glow: pm < .98 });
      const anyPh = PH3.some((_, k) => ph3U(k, t) > 0);
      if (anyPh && lm >= 1) {
        F.veil(ctx, .32 * Math.max(...PH3.map((_, k) => ph3U(k, t))));
        const r0 = rectPhone, ox = r0.x + r0.w / 2, oy = r0.y + r0.h / 2;
        PH3.forEach((p, k) => {
          const u = ph3U(k, t); if (u <= 0) return; const hh = lerp(r0.w * 1.05, 330, u), x = lerp(ox, p.x, u), y = lerp(oy, 430, u) - 26 * Math.sin(Math.PI * u);
          F.phone(ctx, t, x, y, hh, { screen: p.screen, ring: k === 0 ? 1 - span(t, a.ask - .2, a.ask + .3) : 0, rot: lerp(-Math.PI / 2, 0, u), hi: 2, light: lerp(.3, 1, u), a: clamp(u * 3) });
          words(ctx, p.label, p.x, 238, 30, rise(span(t, p.lw - .1, p.lw + .5)) * (u > .98 ? 1 : 0) * (1 - expoIn(span(t, a.fbi - .4, a.fbi + .1))), { align: 'center' });
        });
      }
    }
    screenWords(ctx, t);
  };

  // ---------------------------------------------------------------- the world, between the valley and her hill (lines go behind the hills)
  function worldBack(cx, t, c, out) {
    // ★ 1.07 the dialing computer: hundreds of thin blue lines from the glow to the town windows at once, two answered
    const dIn = span(t, a.dialing - .7, a.dialing + .5);
    if (dIn > 0 && t < a.posted + .5 && out.source) {
      const sp = out.source;
      cx.save(); cx.globalCompositeOperation = 'lighter'; cx.lineCap = 'round';
      ALLWIN.forEach((w, i) => {
        const p = S.proj(c, w.x, w.y, w.z); if (!p || p[0] < -40 || p[0] > W + 40) return;
        const ans = ANS.includes(w);
        for (let j = 0; j < (ans ? 1 : 3); j++) {
          const h = ((i * 7 + j * 13) % 17) / 17, t0 = a.dialing - .7 + h * .9 + j * .08;
          const g = expoOut(span(t, t0, t0 + .7)); if (g <= 0) continue;
          const back = ans ? sineIO(span(t, a.noCase + 2.2 + .3 * j, a.posted - .2)) : sineIO(span(t, a.free + .1 + h * .6, a.free + 1.0 + h * .6));
          if (back >= 1) continue;
          const lift = 120 + 140 * ((i * 31 + j * 7) % 11) / 11, mx = (sp[0] + p[0]) / 2 + (j - 1) * 30, my = Math.min(sp[1], p[1]) - lift;
          const q = (u) => [(1 - u) * (1 - u) * sp[0] + 2 * (1 - u) * u * mx + u * u * p[0], (1 - u) * (1 - u) * sp[1] + 2 * (1 - u) * u * my + u * u * p[1]];
          const u1 = g * (1 - back), n = 14;
          const ansU = ans ? rise(span(t, a.more + .2, a.more + .9)) : 0;
          cx.strokeStyle = rgba(ansU > 0 ? mixHex(COPY.body, COPY.core, ansU) : COPY.body, (.16 + .5 * ansU) * (1 - .4 * back)); cx.lineWidth = 1.1 + 1.6 * ansU;
          cx.beginPath(); for (let k = 0; k <= n; k++) { const pt = q(u1 * k / n); k ? cx.lineTo(pt[0], pt[1]) : cx.moveTo(pt[0], pt[1]); } cx.stroke();
          if (ansU > 0 && u1 > .98) halo(cx, p[0], p[1], 46, .5 * ansU * (1 - back), LAMP.halo, LAMP.core);
        }
      });
      cx.restore();
    }
    // 2.07 a screen lights in a town window down the hill (cold, flickering a little), and settles before the plate
    const sw = SCREENWIN, su = rise(span(t, a.screen - .1, a.screen + .6)) * (1 - span(t, a.third + .2, a.seam3 - .35));
    if (sw && su > 0) { const p = S.proj(c, sw.x, sw.y, sw.z); if (p) { const s = p[2], fl = .85 + .15 * Math.sin(t * 7.3) * Math.sin(t * 2.1); cx.fillStyle = rgba(mixHex(COPY.core, COPY.body, .4), .85 * su * fl); cx.fillRect(p[0] - 26 * s, p[1] - 22 * s, 52 * s, 44 * s); halo(cx, p[0], p[1], 260 * s, .45 * su, COPY.halo, COPY.core); } }
  }
  // ---------------------------------------------------------------- the world, on top
  function worldExtra(cx, t, c, out) {
    const sp = out.source;
    // 1.08 video tiles rise from three lit windows; a strip of gold voice tears off each and drifts to the glow
    if (t > a.posted - .4 && t < a.family + .2 && sp) {
      TILES.forEach((tl, k) => {
        const p = S.proj(c, tl.w.x, tl.w.y, tl.w.z); if (!p) return;
        const u = sineIO(span(t, a.posted - .3 + k * .35, a.posted + .6 + k * .35)), dim = 1 - .65 * span(t, a.hiding, a.hiding + .8), gone = 1 - span(t, a.family - 1.4, a.family - .4);
        if (u <= 0 || gone <= 0) return;
        const tw = lerp(22, 150, u), th = tw * .62, x = p[0], y = p[1] - lerp(0, 120 + 30 * k, u);
        cx.save(); cx.globalAlpha = dim * gone; cx.beginPath(); cx.roundRect(x - tw / 2, y - th / 2, tw, th, 6); cx.fillStyle = mixHex(P.ind1, LAMP.deep, .35); cx.fill(); cx.clip();
        tileArt(cx, t, x, y, tw, th, tl.kind);
        cx.restore();
        cx.save(); cx.globalAlpha = .7 * dim * gone; cx.strokeStyle = rgba(LAMP.core, .7); cx.lineWidth = 1.5; cx.beginPath(); cx.roundRect(x - tw / 2, y - th / 2, tw, th, 6); cx.stroke();
        cx.strokeStyle = rgba(LAMP.body, .35); cx.beginPath(); cx.moveTo(x, y + th / 2); cx.lineTo(p[0], p[1]); cx.stroke(); cx.restore();
        const s0 = a.posted + .9 + k * .45, su = sineIO(span(t, s0, s0 + 2.2));
        if (su > 0 && su < 1) { const pts = F.arcPts(x, y - th / 2, sp[0], sp[1], 120 + 40 * k, 40); F.voiceWave(cx, t, pts, { amp: 12, col: GOLD, seed: 11 + k, speed: 50, u0: Math.max(0, su * .9 - .02), u1: su * .9 + .12, taper: .04, a: 1 - span(su, .85, 1) }); }
      });
    }
    // 1.12 a question mark rises over pole 2 ("seems to know your life ... How?")
    const qU = rise(span(t, a.caller + .1, a.caller + .8)) * (1 - expoIn(span(t, a.story + .5, a.story + 1.2)));
    if (qU > 0) { const pp = out.pole(2); if (pp) F.questionMark(cx, t, pp[0], pp[1] - 130 - 14 * bump(t, a.how - .1, .9), 160 * (1 + .12 * bump(t, a.how - .1, .9)), qU); }
    // 2.01 tiny posts rise from the town windows, turn into lines of text and drift to the glow
    if (t > a.story && t < a.noLonger + .3 && sp) {
      for (const po of POSTS) {
        const p = S.proj(c, po.w.x, po.w.y, po.w.z); if (!p) continue;
        const u = span(t, po.t0, po.t0 + 3.2); if (u <= 0 || u >= 1) continue;
        const up = sineIO(span(u, 0, .3)), txt = smoothU(span(u, .22, .42)), fly = sineIO(span(u, .38, 1));
        const x0 = p[0], y0 = p[1] - 46 * up, x = lerp(x0, sp[0], fly), y = lerp(y0, sp[1], fly) - 90 * Math.sin(Math.PI * fly), s = lerp(1, .45, fly), al = (1 - span(u, .85, 1)) * rise(span(u, 0, .12));
        cx.save(); cx.translate(x, y); cx.scale(1.9 * s, 1.9 * s); cx.globalAlpha = al;
        const col = mixHex(LAMP.core, COPY.line, fly);
        if (txt < 1) { cx.globalAlpha = al * (1 - txt); cx.fillStyle = mixHex(LAMP.body, LAMP.deep, .2); cx.fillRect(-13, -10, 26, 20); cx.fillStyle = mixHex(P.ind1, P.blue0, .4); cx.beginPath(); cx.moveTo(-11, 8); cx.lineTo(-3, -1); cx.lineTo(4, 8); cx.closePath(); cx.fill(); cx.fillStyle = LAMP.core; cx.beginPath(); cx.arc(6, -4, 3, 0, TAU); cx.fill(); }
        if (txt > 0) { cx.globalAlpha = al * txt; cx.fillStyle = col; for (let k = 0; k < 3; k++) cx.fillRect(-14, -8 + k * 7, [26, 20, 14][k], 3); }
        cx.restore();
      }
    }
  }
  function tileArt(cx, t, x, y, w, h, kind) {
    const s = w / 150; cx.save(); cx.translate(x, y); cx.scale(s, s);
    if (kind === 0) {   // a birthday: a cake with three candles
      cx.fillStyle = mixHex(P.cream, LAMP.body, .4); cx.fillRect(-34, 0, 68, 26); cx.fillStyle = mixHex(LAMP.body, LAMP.deep, .3); cx.fillRect(-34, 0, 68, 6);
      for (const cxk of [-18, 0, 18]) { cx.fillStyle = P.cream; cx.fillRect(cxk - 2, -16, 4, 16); cx.fillStyle = GOLD.core; cx.beginPath(); cx.ellipse(cxk, -21 + Math.sin(t * 9 + cxk) * .8, 3, 5, 0, 0, TAU); cx.fill(); }
    } else if (kind === 1) {   // a speech: a figure at a lectern
      E.person(cx, -6, 58, 80, { look: .1, light: 1 }); cx.fillStyle = mixHex(WOOD.body, LAMP.deep, .5); cx.beginPath(); cx.moveTo(-28, 4); cx.lineTo(20, 4); cx.lineTo(14, 48); cx.lineTo(-22, 48); cx.closePath(); cx.fill();
    } else {   // a holiday: a low sun over the sea
      cx.fillStyle = mixHex(LAMP.body, LAMP.halo, .3); cx.beginPath(); cx.arc(0, 4, 18, Math.PI, 0); cx.fill(); cx.fillStyle = mixHex(P.blue0, P.ind1, .3); cx.fillRect(-75, 4, 150, 50);
      cx.fillStyle = rgba(LAMP.core, .6); for (let k = 0; k < 3; k++) cx.fillRect(-20 + k * 6 + 2 * Math.sin(t + k), 12 + k * 8, 28 - k * 8, 2);
    }
    cx.restore();
  }

  // ---------------------------------------------------------------- the kitchen beats (kitchen space, 1920 × 1080)
  function kitchenBeat(cx, t, v, w, h) {
    const notes = [];
    // note 1 (the word, covered): the dashed place from c01 until it lands (c04)
    const n1 = noteFly(t) >= 1 ? { lines: ['WORD'], cover: 1, lit: .9 * bump(t, a.fbi + 1.7, 1.6) + .15 * lit1Of(t) } : { empty: 1 };
    notes[0] = n1;
    if (v === 2) notes[1] = note2Fly(t) >= 1 ? { lines: ['?'], size: .4, lit: .9 * bump(t, a.knowing + 1.55, 1.6) + .25 * bump(t, a.whose, 3) } : { empty: rise(span(t, a.noLonger + .2, a.noLonger + 1.2)), a: 1 };
    // her: the reach and the lift (c02 → c03 only)
    const reach = v === 0 ? span(t, a.certain - .6, a.certain + .25) : 0, lift = v === 0 ? span(t, a.certain + .25, a.certain + 1.4) : 0;
    const look = v === 1 ? -.06 + .03 * Math.sin(t * .6) + .06 * span(t, a.panic - .5, a.panic + .5) : .02 + .015 * Math.sin(t * .7);
    S.kitchen(cx, t, w, h, {
      notes,
      phone: { a: 0, reach, lift },
      mom: { look, lean: .06 + .012 * Math.sin(t * 1.05) + (v === 0 ? .02 * bump(t, a.certain, 3) : 0) },
      you: v === 1 ? { x: 760, a: 1 } : false,
      extra: (kx, out) => kitchenExtra(kx, t, v, out, lift),
    });
  }
  function lit1Of(t) { return rise(span(t, a.fbi + 3.8, a.fbi + 4.6)); }
  function kitchenExtra(kx, t, v, out, lift) {
    // the moon crosses the kitchen window (1.04: the only clock), then stays low right
    if (v === 0) {
      const u = smoothU(span(t, a.notD - .3, a.fiveH + 1.5)), mx = lerp(1540, 1760, u), my = 330 - 95 * Math.sin(Math.PI * lerp(.12, .88, u));
      kx.save(); kx.beginPath(); kx.rect(1507, 177, 286, 366); kx.clip(); halo(kx, mx, my, 110, .2, P.halo2, P.cream);
      kx.fillStyle = mixHex(P.cream, P.halo2, .25); kx.beginPath(); kx.arc(mx, my, 22, 0, TAU); kx.fill(); kx.fillStyle = rgba(P.ind1, .55); kx.beginPath(); kx.arc(mx + 9, my - 4, 19, 0, TAU); kx.fill();
      kx.restore(); kx.strokeStyle = mixHex(WOOD.body, LAMP.deep, .5); kx.lineWidth = 8; kx.beginPath(); kx.moveTo(1650, 170); kx.lineTo(1650, 550); kx.stroke();
    }
    // the mug
    kx.fillStyle = mixHex(P.halo2, P.blue1, .45); kx.fillRect(MUG.x - 27, MUG.y - 34, 54, 62); kx.beginPath(); kx.ellipse(MUG.x, MUG.y + 28, 27, 7, 0, 0, TAU); kx.fill();
    kx.fillStyle = mixHex(P.night1, P.blue1, .3); kx.beginPath(); kx.ellipse(MUG.x, MUG.y - 34, 27, 7, 0, 0, TAU); kx.fill();
    kx.strokeStyle = mixHex(P.halo2, P.blue1, .45); kx.lineWidth = 7; kx.beginPath(); kx.arc(MUG.x + 30, MUG.y - 4, 13, -1.3, 1.3); kx.stroke();
    // her phone: propped on its side against the mug; in c02 she lifts it to her ear (her hand from S.kitchen)
    const e = sineIO(lift);
    let px = STAND.x, py = STAND.y, ph = STAND.h, rot = -Math.PI / 2;
    if (lift > 0 && out.phone) { px = out.phone.x + (STAND.x - 1006) * (1 - e); py = out.phone.y + (STAND.y - 812) * (1 - e); ph = lerp(STAND.h, 104, e); rot = lerp(-Math.PI / 2, -.35, e); }
    const r = F.phone(kx, t, px, py, ph, { screen: 'dark', rot, light: 1 });
    if (r) rectPhone = xfRect(kx, r.screen);
    const land = lift < .5;
    if (v === 0) {
      const hearA = rise(span(t, a.summer + .2, a.summer + 1.0)) * (1 - span(t, a.S1s - .65, a.S1s - .35));
      const timA = rise(span(t, a.S1e + .55, a.S1e + 1.0)) * (1 - span(t, a.certain + .3, a.certain + .7));
      const dotA = span(t, a.where + .1, a.where + .6);
      if (hearA > 0) { halo(kx, px, py, 130, .22 * hearA, LAMP.halo, LAMP.core); onScreen(kx, px, py, ph, rot, true, (c2, sw, sh) => hearing(c2, t, sw, sh, hearA)); }
      if (timA > 0) { const sec = 19800 * (1 - Math.pow(1 - span(t, a.notD + .2, a.fiveH + 1.1), 2.2)); halo(kx, px, py, 120, .18 * timA, LAMP.halo, LAMP.core); onScreen(kx, px, py, ph, rot, land, (c2, sw, sh) => timerScreen(c2, t, sw, sh, sec, timA)); }
      if (dotA > 0) onScreen(kx, px, py, ph, rot, false, (c2, sw, sh) => dotsScreen(c2, t, sw, sh, dotA, a.silent - .1));
      // 1.02 her daughter's voice rises from the phone (gold) and turns blue on "kidnapped"; it sinks back before the footage
      const g = sineIO(span(t, a.daughter - .1, a.daughter + 1.0)), back = sineIO(span(t, a.S1s - 1.1, a.S1s - .5)), blue = sineIO(span(t, a.kidnap - .2, a.kidnap + .5));
      if (g > 0 && back < 1) {
        const pts = F.arcPts(px - 30, py - 30, 700, 470, 90, 40), o = { amp: 18, seed: 4, speed: 60, u1: g * (1 - back), taper: .1 };
        if (blue < 1) F.voiceWave(kx, t, pts, { ...o, col: GOLD, a: 1 - blue });
        if (blue > 0) F.voiceWave(kx, t, pts, { ...o, col: COPY, a: blue, flicker: blue, tremble: .4 * blue });
      }
    }
    if (v === 1) {
      // 1.09 the folded note slides across from you to her; 1.11 it flies onto the fridge (slot 1)
      const sl = noteSlide(t), fl = noteFly(t), app = rise(span(t, a.family + 1.2, a.family + 1.7));
      if (app > 0 && fl < 1) {
        const tx = lerp(840, 1110, sl), ty = lerp(812, 800, sl), [sx2, sy2] = S.NOTE_SLOTS[0];
        const x = lerp(tx, sx2, fl), y = lerp(ty, sy2, fl) - 220 * Math.sin(Math.PI * fl), s = lerp(84, 112, fl), sq = lerp(.55, 1, sineIO(span(fl, 0, .5)));
        kx.save(); kx.translate(x, y); kx.scale(1, sq); kx.translate(-x, -y);
        F.note(kx, t, x, y, s, { lines: ['WORD'], cover: 1, tilt: lerp(.12, -.06, fl), a: app, lit: .5 * bump(t, a.likely + .4, 2.4) });
        kx.restore();
      }
    }
    if (v === 2) {
      // 2.02 the split screen · 2.06 one question (its "?" lifts off as note 2) · the gold answer stays in the house
      const spA = rise(span(t, a.person - .5, a.person + .2)) * (1 - span(t, a.clearest - .3, a.clearest + .1));
      if (spA > 0) {
        const msgs = 6 * span(t, a.chat + .1, a.whole + 1.6), o = { left: rise(span(t, a.person - .4, a.person + .3)), right: rise(span(t, a.chat - .2, a.chat + .4)), lend: sineIO(span(t, a.lending - .4, a.lending + .6)), msgs, typing: rise(span(t, a.chat + .1, a.chat + .5)) };
        halo(kx, px, py, 140, .2 * spA, COPY.halo, COPY.core);
        onScreen(kx, px, py, ph, rot, true, (c2, sw, sh) => { c2.globalAlpha *= spA; splitScreen(c2, t, sw, sh, o); });
      }
      const qA = rise(span(t, a.second + .3, a.second + .9));
      if (qA > 0) {
        const q = 1 - span(t, a.knowing + .15, a.knowing + .35) + rise(span(t, a.oneQ - .1, a.oneQ + .5));
        halo(kx, px, py, 130, .2 * qA, LAMP.halo, LAMP.core);
        onScreen(kx, px, py, ph, rot, true, (c2, sw, sh) => questionScreen(c2, t, sw, sh, qA, clamp(q)));
      }
      const fl = note2Fly(t);
      if (fl > 0 && fl < 1) {
        const [sx2, sy2] = S.NOTE_SLOTS[1], x = lerp(px, sx2, fl), y = lerp(py - 4, sy2, fl) - 200 * Math.sin(Math.PI * fl), s = lerp(40, 112, fl);
        F.note(kx, t, x, y, s, { lines: ['?'], size: .4, tilt: lerp(0, .05, fl), lit: .4 });
      }
      // the answer: a gold dot that leaves note 2 and stays in the kitchen
      const dU = sineIO(span(t, a.whose + .1, a.whose + 1.3)), dA = rise(span(t, a.whose, a.whose + .4));
      if (dA > 0) {
        const [sx2, sy2] = S.NOTE_SLOTS[1], x = lerp(sx2 + 40, 640, dU), y = lerp(sy2, 470, dU) - 50 * Math.sin(Math.PI * dU), pu = 1 + .12 * Math.sin(t * 2.4);
        halo(kx, x, y, 110 * pu, .6 * dA, GOLD.halo, GOLD.core); kx.fillStyle = rgba(GOLD.core, dA); kx.beginPath(); kx.arc(x, y, 14 * pu, 0, TAU); kx.fill();
      }
      // "the caller who seems to know everything": a blue voice comes to the window and stops at the glass
      const bU = sineIO(span(t, a.guards - .1, a.guards + 1.2)), bOut = sineIO(span(t, a.guards + 2.0, a.still3 - .2));
      if (bU > 0 && bOut < 1) {
        const pts = F.arcPts(1860, 300, 1540, 420, 40, 30);
        F.voiceWave(kx, t, pts, { amp: 16, col: COPY, seed: 7, speed: 60, u1: bU * (1 - bOut), flat: .6 * span(t, a.guards + 1.0, a.guards + 2.0), flicker: 1, taper: .1 });
        if (bU > .9) { kx.strokeStyle = rgba(COPY.line, .25 * (1 - bOut) * bump(t, a.guards + 1.0, 1.4)); kx.lineWidth = 3; kx.strokeRect(1500, 170, 300, 380); }
      }
    }
  }

  // ---------------------------------------------------------------- the app's state
  function appState(t) {
    const zoom = lerp(1, .56, sineIO(span(t, a.thousands - .1, a.thousands + 2.0))) * lerp(1, 1.5, sineIO(span(t, a.machinery - .1, a.track + .6))) * (1 + .03 * Math.max(0, t - a.track - .6));   // then a slow push on the one who suspects
    const sus = [3, 4], tf = [sus[0] * 104 + 52, sus[1] * 104 + 52];
    const fk = sineIO(span(t, a.machinery - .1, a.track + .6)), sc = 16 * (t - a.clearest);
    return {
      zoom, scroll: sc * (1 - fk) + (16 * (a.machinery - .1 - a.clearest)) * fk,
      fx: lerp(PANEL.w / 2 + 40, tf[0], fk), fy: lerp(PANEL.h / 2, tf[1] - 16 * (a.machinery - .1 - a.clearest), fk) + 0,
      reveal: span(t, a.three - .1, a.three + 1.6), suspect: sus, sus: rise(span(t, a.suspect - .3, a.suspect + .3)) * (1 - .4 * span(t, a.second - 1, a.second)),
      ring: sineIO(span(t, a.suspect + .2, a.suspect + 1.3)), word: rise(span(t, a.suspect + .9, a.suspect + 1.5)),
    };
  }

  // ---------------------------------------------------------------- words in screen space (≤ 6 words, above y 880)
  function screenWords(ctx, t) {
    F.stepLabel(ctx, t, 1, 'THE VOICE', rise(span(t, a.p0 + .05, a.p0 + .8)) * (1 - expoIn(span(t, a.senate - .2, a.senate + .4))));
    F.source(ctx, t, a.summer + .9, a.S1s - .6, F.SOURCES.senate);
    const hU = rise(span(t, a.fiveH - .15, a.fiveH + .5)) * (1 - expoIn(span(t, a.certain - .3, a.certain + .2)));
    if (hU > 0) words(ctx, '5½ HOURS', 112, 236, 84, hU, { glow: true });
    const fU = rise(span(t, a.certain + .15, a.certain + .75)) * (1 - expoIn(span(t, a.where + .2, a.where + .8)));
    if (fU > 0) words(ctx, 'FEELING SURE ≠ BEING RIGHT', 112, 200, 34, fU, { col: P.core0 });
    // 1.07
    F.source(ctx, t, a.dialing - .2, a.noCase + 1.2, 'OFCOM · ABANDONED AND SILENT CALLS');
    const bU = rise(span(t, a.noCase + .1, a.noCase + .9)) * (1 - expoIn(span(t, a.posted - .6, a.posted)));
    if (bU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.bracket(ctx, 560, 1360, 236, bU, 'NO CASE: ONE HELLO → A CLONE', { size: 32 }); ctx.restore(); }
    F.source(ctx, t, a.fbi + .2, a.still - .1, F.SOURCES.codeword);
    // step 2
    F.stepLabel(ctx, t, 2, 'THE STORY', rise(span(t, a.story + .05, a.story + .8)) * (1 - expoIn(span(t, a.noLonger - .9, a.noLonger - .3))));
    F.source(ctx, t, a.whatever, a.noLonger - .2, F.SOURCES.ftcStory);
    F.source(ctx, t, a.clearest + .6, a.paid - .2, F.SOURCES.report);
    const out2 = 1 - expoIn(span(t, a.second - .6, a.second - .1));
    const cU = rise(span(t, a.misuse + .2, a.misuse + 1.0)) * (1 - expoIn(span(t, a.app + .6, a.app + 1.1)));
    if (cU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.bracket(ctx, PANEL.x + 120, PANEL.x + PANEL.w - 120, 128, cU, 'THE COMPANY REPORTS ON ITSELF', { size: 28 }); ctx.restore(); }
    const pU = rise(span(t, a.paid + .1, a.paid + .9)) * (1 - expoIn(span(t, a.track - .5, a.track)));
    if (pU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.bracket(ctx, PANEL.x + 120, PANEL.x + PANEL.w - 120, 128, pU, 'PAID CHAT, NOT SAVINGS', { size: 28 }); ctx.restore(); }
    words(ctx, 'THOUSANDS', 110, 330, 62, rise(span(t, a.thousands + .2, a.thousands + .9)) * out2, { col: P.core0, glow: true });
    words(ctx, '3 OF 4 PROFILES', 112, 430, 30, rise(span(t, a.three, a.three + .6)) * out2, { col: P.core0 });
    words(ctx, 'MACHINES', 110, 500, 62, rise(span(t, a.three + .5, a.three + 1.1)) * out2, { col: COPY.text, glow: true });
  }
}
