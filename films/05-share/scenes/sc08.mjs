// Chunk C8 · §5 what already exists, §6 Switzerland up to the selection · shots 5.07–6.06 (bild/shots.md v2 §3) · no ★
// R.a = R.first = "Pieces of this" (05b) … R.b = "But someone would" (06a). All times come from T (phrases), never seconds.
//
// PLAN (gate 1) — hero onset = the word the main move lands on; carrier = the object that crosses into the next shot.
// | shot  | sentence (VO)                                   | hero onset                         | carrier → next shot                                   | type        |
// |-------|-------------------------------------------------|------------------------------------|-------------------------------------------------------|-------------|
// | 5.07  | Pieces of this already exist.                   | two torn certificate fragments land | IN: c07 crane up → whipU; fragments rise from below    | (c) in      |
// |       |                                                 | on "Pieces"; dotted ghost of the    | OUT: camera pushes into fragment 1's rosette           | (b)         |
// |       |                                                 | missing middle; glint on "exist"    |                                                       |             |
// | 5.08  | The OpenAI Foundation was given about a quarter | burin cuts a 26 % foil wedge out of | the widened foil wedge flies right, the camera pans    | (a) exit R  |
// |       | of OpenAI, and gets more if … soars tenfold.    | the rosette on "given"; pull back,  | with it and it lands on fragment 2                     |             |
// |       |                                                 | rosette ×√10 on "soars", wedge +    |                                                       |             |
// |       |                                                 | widens on "tenfold"                 |                                                       |             |
// | 5.10  | Oxford researchers proposed a Windfall Clause:  | profit rings grow on "bigger the    | the rings run outward as light, push-in, iris          | (b) iris    |
// |       | the bigger the profit, the bigger the share …   | profit", foil bands 1→20→50 % on    | (they become the cheer rings over the city)            |             |
// |       |                                                 | "bigger the share"; lift on "away"  |                                                       |             |
// | 5.16a | But who gets to cheer?                          | cheer rings over the night city;    | plansequenz: the camera keeps rising                   | plan        |
// |       |                                                 | rise; the US lights on "cheer"      |                                                       |             |
// | 5.16b | Only the people of one rich country?            | border runs as microtext on "one    | the border line lifts (exit up) and redraws itself     | (a) exit up |
// |       |                                                 | rich country"; the rest stays dark  | into the HARVEST coupon edge (signature unwind)        | + unwind    |
// | 6.01  | Step three: harvest.                            | HARVEST coupon embossed in foil on  | the engraved fruit lifts as light → push-in            | (b) zoom    |
// |       |                                                 | "harvest"; the fruit lifts off      |                                                       |             |
// | 6.02  | One rule matters most: the same share for       | fruit splits into identical slices  | one slice drops, the camera tilts down with it         | (a) exit dn |
// |       | everyone.                                       | on "same", they line up             |                                                       |             |
// | 6.03  | Switzerland already does a small version.       | the slice lands on Switzerland on   | push-in on the slice                                   | (b) zoom    |
// |       |                                                 | "small"; the country lights         |                                                       |             |
// | 6.04  | Every resident, from baby to pensioner, gets    | the same amber refund line lights   | push-in on the parent's refund line                    | (b) zoom    |
// |       | the same refund … every year.                   | on all three letters on "same"      |                                                       |             |
// | 6.05  | It arrives through their health insurance.      | letterhead underlined + leader to   | the sheet slides away to the left, revealing the card  | (a) exit L  |
// |       |                                                 | the refund on "health insurance"    |                                                       |             |
// | 6.06  | Anthropic's plan mentions "direct distributions | words light with the voice; the     | OUT: carry('c08>c09') 'line' — the highlight under     | (b) zoom    |
// |       | to specific populations."                       | highlight sweeps on "specific"      | "specific populations" on the register path, push-in   |             |
// Speed contrast: snappy lands (expo-out .4–.7 s) on the accent words against slow living holds (drift, glints, motes, breathing hands).
// Sound (new, only in speech pauses or on the contact frame of my own images): shimmer as the rings run out (5.10 → 5.16a), foil glint as
// the border lifts (5.16b pause), the HARVEST emboss, paper as the statement slides away. The lead's accents are not in this range.
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { rosette, ring, microPath, foilGlint, resample, unwind } from '../lib/certificate.mjs';
import { ghostLine } from '../lib/ghost.mjs';
import { carry, drawCarrier } from '../lib/carry.mjs';
import { quoteCard2 } from '../lib/quote2.mjs';
import { planSheet } from '../lib/plansheet.mjs';
import { tree } from '../lib/tree.mjs';
import { glassFund } from '../lib/glassfund.mjs';
import { shareLight } from '../lib/share.mjs';
import { hand } from '../lib/hand.mjs';
import { paperSheet } from '../lib/paper.mjs';
import { stipple } from '../lib/art.mjs';
import * as K from '../lib/sc08_kit.mjs';

const { xout, xin, qio, env, CREAM } = K;
const TAU = Math.PI * 2;
const camApply = (ctx, cx, cy, z) => { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); };

export default (T, R) => {
  const S5 = (p, n) => T.S('05b', p, n), E5 = (p, n) => T.E('05b', p, n), S6 = (p, n) => T.S('06a', p, n), E6 = (p, n) => T.E('06a', p, n);
  const Cin = carry('c07>c08', T, R), Cout = carry('c08>c09', T, R);
  const A = {
    pieces: S5('Pieces of this'), exist: S5('already exist'), existE: E5('already exist'),
    oai: S5('The OpenAI'), found: S5('OpenAI Foundation'), given: S5('given'), quarter: S5('a quarter'), more: S5('gets more'), value: S5("company's value"), soars: S5('soars'), tenfold: S5('tenfold'), tenfoldE: E5('tenfold'),
    oxford: S5('Oxford researchers'), windfall: S5('Windfall Clause'), big1: S5('bigger the profit'), profit: S5('profit'), big2: S5('bigger the share'), share: S5('share given'), away: S5('away'), awayE: E5('away'),
    who: S5('But who'), cheer: S5('cheer'), only: S5('Only the people'), one: S5('one rich'), countryE: E5('country'),
    step: S6('Step three'), harvest: S6('harvest'), rule: S6('One rule'), same: S6('the same share'), everyone: S6('everyone'), everyoneE: E6('everyone'),
    swiss: S6('Switzerland already'), small: S6('small version'), versionE: E6('version'),
    resident: S6('Every resident'), baby: S6('baby'), pensioner: S6('pensioner'), sameRefund: S6('same refund'), tax: S6('environmental tax'), year: S6('every year'),
    arrives: S6('It arrives'), health: S6('health insurance'), healthE: E6('insurance'),
    anth: S6('Anthropic'), direct: S6('direct distributions'), specific: S6('specific'), popE: E6('populations'),
  };
  A.whip0 = Cin.t - (Cin.into.d ?? .3) / 2;
  A.push0 = A.existE - .62; A.push1 = A.oai + .25;           // 5.07 → 5.08 push-in
  A.pull0 = A.more - .35; A.pull1 = A.more + .55;             // 5.08 pull back for the tenfold
  A.pan0 = A.tenfoldE - .52; A.pan1 = A.pan0 + .8;            // 5.08 → 5.10 pan right with the wedge
  A.land2 = A.pan1 + .5;                                      // the wedge lands on fragment 2
  A.out0 = A.awayE + .02; A.iris = A.who - .25;               // 5.10 rings run out, iris into the city
  A.rise1 = A.cheer + .45;                                    // city → map rise ends
  A.lift0 = A.countryE + .45; A.cut601 = A.step - .32;        // the border lifts, cut to the plan sheet
  A.land601 = A.step + .3;
  A.fruit0 = A.harvest + .32; A.t602 = A.rule - .15;
  A.drop0 = A.everyoneE - .3; A.cut603 = A.swiss - .12;
  A.t604 = A.resident - .2; A.t605 = A.arrives - .15; A.t606 = A.anth - .5;
  const sheetAt = (t) => A.t606 + .02;                         // the statement starts to slide away
  void sheetAt;

  // ======================= WORLD A: fragments, rosette, rings =======================
  function approx(ctx, x, y, w) {   // "≈" drawn as two foil tildes (the serif font has no ≈ glyph)
    const g = ctx.createLinearGradient(x, y - 30, x + w, y + 20); ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'].forEach((c, i) => g.addColorStop(i / 4, c));
    ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
    for (const dy of [-11, 11]) { ctx.beginPath(); for (let i = 0; i <= 24; i++) { const q = i / 24, xx = x + q * w, yy = y + dy - Math.sin(q * TAU) * 7; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    ctx.restore();
  }
  const PR = K.certToWorld(...K.FRAG[0].motif), RW = 150 * K.CERT.s, ROS = [700, 540];
  const zOf = (t) => { const base = 1 + .012 * (t - A.whip0), u = qio(lin(A.push0, A.push1, t)), p = qio(lin(A.pull0, A.pull1, t)); return mix(mix(base, 1.8, u), .78, p); };
  const camA = (t) => {
    const z = zOf(t), u = qio(lin(A.push0, A.push1, t)), dx = drift(t, 7, 1), dy = drift(t, 5, 2);
    const c0 = [W / 2 + dx, H / 2 + dy], c1 = [PR[0] - (ROS[0] - W / 2) / z + dx / z, PR[1] - (ROS[1] - H / 2) / z + dy / z];
    return { x: mix(c0[0], c1[0], u), y: mix(c0[1], c1[1], u), z };
  };
  const toScreen = (cam, p) => [W / 2 + (p[0] - cam.x) * cam.z, H / 2 + (p[1] - cam.y) * cam.z];
  const PAN = 1500, pan = (t) => qio(lin(A.pan0, A.pan1, t));
  const grow = (t) => 1 + 2.1623 * xout(lin(A.soars, A.soars + 1.15, t));
  const MID = -.62, H26 = .26 * Math.PI, H34 = .34 * Math.PI;
  const halfW = (t) => mix(H26, H34, xout(lin(A.tenfold, A.tenfold + .55, t)));
  // the wedge (the Foundation's share) in screen space: before the pan it sits on the rosette, then it flies to fragment 2
  const S2 = 1.25, P2 = [1255, 548], F2ROT = .025, RINGS = K.F2RINGS.map((r) => r * S2);
  const C2 = (() => { const [mu, mv] = K.FRAG[1].motif, c = Math.cos(F2ROT), s = Math.sin(F2ROT), x = (mu - K.CW / 2) * S2, y = (mv - K.CH / 2) * S2; return { x: P2[0] - (x * c - y * s), y: P2[1] - (x * s + y * c), s: S2, rot: F2ROT }; })();
  const rosState = (t) => { const cam = camA(t), S = toScreen(cam, PR), g = grow(t), Rs = RW * cam.z * g; return { cam, S: [S[0] - PAN * pan(t), S[1]], Rs, r1: Rs * 1.233, g }; };
  const wedgeAt = (t) => {   // → { x, y (apex), r1, a0, a1, lift, a }
    const st = rosState(Math.min(t, A.pan0)), off = st.r1 * .15 * xout(lin(A.given, A.given + .7, t)), h = halfW(t);
    const w0 = { x: st.S[0] + Math.cos(MID) * off, y: st.S[1] + Math.sin(MID) * off, r1: st.r1, a0: MID - h, a1: MID + h };
    if (t <= A.pan0) return { ...w0, lift: 10 };
    const u = qio(lin(A.pan0, A.land2, t)), arc = Math.sin(Math.PI * u) * -120;
    const b0 = -Math.PI / 2, b1 = b0 + .01 * TAU;
    return { x: mix(w0.x, P2[0], u), y: mix(w0.y, P2[1], u) + arc, r1: mix(w0.r1, RINGS[0], u), a0: mix(w0.a0, b0, u), a1: mix(w0.a1, b1, u), lift: mix(10, 0, u) + 26 * Math.sin(Math.PI * u) };
  };

  function worldA(ctx, t, o = {}) {   // the dark green banknote ground + ghost + fragments in camera space (5.07, start of 5.08)
    const cam = camA(t), inv = sm(lin(A.oai - .03, A.oai + .62, t)), px = -PAN * pan(t);
    K.drawGroundA(ctx, t, px, 0);
    ctx.save(); ctx.translate(px, 0); camApply(ctx, cam.x, cam.y, cam.z);
    // the ghost: the whole certificate, dotted, revealed from the fragments' torn edges toward the middle
    const gu = xout(lin(A.pieces + .1, A.pieces + .95, t)), ga = (1 - sm(lin(A.oai, A.oai + .5, t))) * .95;
    if (gu > 0 && ga > 0) {
      const [lx] = K.certToWorld(500, 490), [rx] = K.certToWorld(1040, 490);
      ctx.save(); ctx.beginPath(); ctx.rect(-400, -400, lx + 240 * gu + 400, H + 800); ctx.rect(rx - 240 * gu, -400, W + 800, H + 800); ctx.clip();
      ctx.globalAlpha = ga; ctx.drawImage(K.ghostCert(), 0, 0, W, H); ctx.restore();
    }
    // the fragments rise from below (continuing c07's crane up) and land, rotation follows position
    const land = [A.pieces + .22, A.pieces + .36];
    for (let i = 0; i < 2; i++) {
      if (i === 1 && t > A.oai + .6) continue;
      const u = clamp((t - A.whip0) / (land[i] - A.whip0)), e = xout(u), ru = xout(clamp((t - A.whip0 - .1) / (land[i] - A.whip0 + .25)));
      const gl = lin(A.exist - .02, A.exist + .85, t), glint = gl > 0 && gl < 1 ? (gl * 1.6 + (i ? .12 : 0)) / .5 : null;
      const a = i === 0 ? 1 - inv : 1 - sm(lin(A.oai + .1, A.oai + .55, t));
      K.drawFrag(ctx, i, { dy: (1 - e) * 1000, rot: (i ? .16 : -.13) * (1 - ru) + (i ? .004 : -.003) * Math.sin(t * .7 + i), lift: 1 + 2.5 * (1 - e), a, glint, k: i === 0 ? 1 - .04 * inv : 1 });
    }
    ctx.restore();
  }
  function rosetteLight(ctx, t, st, a, holeW) {   // the value rosette as light; holeW = the wedge's original position (cut out)
    if (a <= 0) return;
    ctx.save();
    if (holeW) { const p = new Path2D(); p.rect(-W, -H, W * 3, H * 3); p.moveTo(holeW.x, holeW.y); for (let i = 0; i <= 40; i++) { const an = mix(holeW.a0, holeW.a1, i / 40); p.lineTo(holeW.x + Math.cos(an) * holeW.r1 * 1.02, holeW.y + Math.sin(an) * holeW.r1 * 1.02); } p.closePath(); ctx.clip(p, 'evenodd'); }
    const k = st.Rs / 150, dens = clamp(st.Rs / 230);
    ctx.globalCompositeOperation = 'lighter';
    K.bloomAt(ctx, st.S[0], st.S[1], st.r1 * 1.9, .35 * a, '#ffb35c');
    rosette(ctx, st.S[0], st.S[1], { R: st.Rs, A: 24 * k, B: 11 * k, n: 16, m: 7, lines: Math.round(mix(18, 44, dens)), col: '#f1ead2', w: mix(.6, .75, dens), a: mix(.3, .62, dens) * a, rot: K.CERT.rot + .025 * (t - A.oai) });
    ctx.restore();
    if (holeW) { const hw = K.wedgePath(holeW.x, holeW.y, 0, holeW.r1, holeW.a0, holeW.a1); ctx.save(); ctx.globalAlpha = .55 * a; ctx.setLineDash([.1, 6]); ctx.lineCap = 'round'; ctx.strokeStyle = '#f1ead2'; ctx.lineWidth = 1.6; ctx.stroke(hw); ctx.restore(); }
  }

  // ---------------- 5.07 Pieces of this already exist ----------------
  function d507(ctx, t) {
    worldA(ctx, t);
    K.drawFrontA(ctx, t, 0, 0, 1);
    K.vignette(ctx, .5, W * .5, H * .52, '3,8,6');
  }
  // ---------------- 5.08 The OpenAI Foundation … tenfold ----------------
  function d508(ctx, t) {
    const inv = sm(lin(A.oai - .03, A.oai + .62, t)), px = -PAN * pan(t);
    worldA(ctx, t);
    const st = rosState(t), cutU = lin(A.given - .5, A.given - .02, t), foilA = sm(lin(A.given - .06, A.given + .14, t));
    const w0 = (() => { const s0 = rosState(Math.min(t, A.pan0)), h = H26; return { x: s0.S[0], y: s0.S[1], r1: s0.r1, a0: MID - h, a1: MID + h }; })();
    ctx.save(); ctx.translate(px, 0);
    // the 10× ring (dotted ghost: the value it may reach), drawn before the growth fills it
    const ringU = lin(A.value - .25, A.value + .45, t), Rten = RW * 3.1623 * st.cam.z * 1.233, fillU = xout(lin(A.soars, A.soars + 1.15, t));
    ctx.restore();
    if (ringU > 0) {
      ctx.save(); ctx.translate(px, 0); const pts = []; for (let i = 0; i <= 240; i++) { const a = -2.3 + i / 240 * TAU; pts.push([st.S[0] - px + Math.cos(a) * Rten, st.S[1] + Math.sin(a) * Rten]); }
      ctx.translate(-px, 0); ctx.translate(px, 0);
      ghostLine(ctx, pts.map(([x, y]) => [x + px - px, y]), { u: ringU, ghost: 1 - .85 * fillU, col: '#f1ead2', w: 1.6, a: .8, dot: 7 });
      const la = env(t, A.value, A.value + .4, A.pan0, A.pan0 + .3);
      text(ctx, '10×', st.S[0] + Math.cos(-2.3) * (Rten + 26) - 30, st.S[1] + Math.sin(-2.3) * (Rten + 26), { size: 46, font: 'Instrument Serif', color: rgba('#f1ead2', .95 * la), align: 'center' });
      ctx.restore();
    }
    rosetteLight(ctx, t, st, inv * (1 - sm(lin(A.pan1 - .2, A.pan1, t))), t > A.given ? { ...w0, x: w0.x + (t > A.pan0 ? 0 : 0) } : null);
    // 1× label at the rim before the growth
    { const la = env(t, A.pull1 - .1, A.pull1 + .3, A.soars, A.soars + .3); if (la > 0) text(ctx, '1×', st.S[0] + Math.cos(-2.3) * (st.r1 + 22), st.S[1] + Math.sin(-2.3) * (st.r1 + 22), { size: 34, font: 'Instrument Serif', color: rgba('#f1ead2', .85 * la), align: 'center' }); }
    // the company's name rides on the rim (lower left)
    { const la = env(t, A.oai + .2, A.oai + .7, A.pan0, A.pan0 + .25), a = 2.45, x = st.S[0] + Math.cos(a) * (st.r1 + 30), y = st.S[1] + Math.sin(a) * (st.r1 + 30);
      if (la > 0) text(ctx, 'OPENAI', x, y, { size: 20, weight: 600, color: rgba('#f1ead2', .9 * la), spacing: 7, align: 'right' }); }
    // the burin cuts the wedge out on "given", it turns to foil and lifts toward the Foundation
    if (cutU > 0 && foilA < 1) {
      const pts = [[w0.x, w0.y]]; for (let i = 0; i <= 40; i++) { const a = mix(w0.a0, w0.a1, i / 40); pts.push([w0.x + Math.cos(a) * w0.r1, w0.y + Math.sin(a) * w0.r1]); } pts.push([w0.x, w0.y]);
      ghostLine(ctx, resample(pts, 220), { ghost: 1, burin: cutU, col: '#fff1d6', w: 1.8, a: 1 - foilA, dot: 6, t, glow: '#ffb35c', tipSize: 16 });
    }
    if (foilA > 0) {
      const w = wedgeAt(t), hExt = halfW(t);
      if (t > A.more - .1 && t < A.tenfold + .55) { const ga = env(t, A.more - .1, A.more + .3, A.tenfold + .3, A.tenfold + .55); K.ghostSector(ctx, w.x, w.y, 0, w.r1, MID + hExt, MID + H34, { a: ga }); K.ghostSector(ctx, w.x, w.y, 0, w.r1, MID - H34, MID - hExt, { a: ga }); }
      K.foilSector(ctx, w.x, w.y, 0, w.r1, w.a0, w.a1, t, { a: foilA, lift: w.lift, dark: true });
      if (t < A.given + .35) K.bloomAt(ctx, w.x + Math.cos(MID) * w.r1 * .5, w.y + Math.sin(MID) * w.r1 * .5, 260 * (1 - lin(A.given, A.given + .35, t)) + 40, .8 * env(t, A.given - .05, A.given + .03, A.given + .1, A.given + .35));
    }
    // captions (right column): name, the number in foil, the condition; they leave before the pan
    const out = 1 - sm(lin(A.pan0 - .35, A.pan0 - .05, t)), X = 1190;
    if (out > 0) {
      ctx.save(); ctx.globalAlpha = out;
      K.revealText(ctx, 'OpenAI Foundation', X, 360, lin(A.found - .05, A.found + .5, t), { size: 62, font: 'Instrument Serif', color: '#f1ead2' });
      const nu = lin(A.quarter - .05, A.quarter + .45, t);
      if (nu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(X - 10, 380, 640 * xout(nu), 200); ctx.clip(); approx(ctx, X + 4, 468, 50); K.foilText(ctx, '26 %', X + 78, 510, t, { size: 132 }); ctx.restore(); }
      K.revealText(ctx, 'OF OPENAI  ·  2025', X + 4, 556, lin(A.quarter + .25, A.quarter + .75, t), { size: 17, weight: 600, color: '#e9c46a', spacing: 5 });
      K.revealText(ctx, 'MORE IF VALUE RISES > 10×', X + 4, 616, lin(A.more - .05, A.more + .45, t), { size: 17, weight: 600, color: '#f1ead2', spacing: 4.5 });
      K.revealText(ctx, 'OVER 15 YEARS', X + 4, 644, lin(A.more + .2, A.more + .7, t), { size: 17, weight: 600, color: '#f1ead2', spacing: 4.5 });
      // hairline leader from the wedge to the number
      const la = sm(lin(A.quarter, A.quarter + .5, t)); if (la > 0 && t < A.soars) { const w = wedgeAt(t), tx = w.x + Math.cos(MID) * w.r1 * .98, ty = w.y + Math.sin(MID) * w.r1 * .98; ctx.strokeStyle = rgba('#ffb35c', .7 * la * (1 - lin(A.soars - .3, A.soars, t))); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(mix(tx, X - 24, la), mix(ty, 470, la)); ctx.stroke(); }
      ctx.restore();
      K.sourceLine(ctx, 'Source: OpenAI, “Built to benefit everyone”, 28 Oct 2025', env(t, A.found, A.found + .6, A.pan0 - .4, A.pan0 - .1));
    }
    // during the pan, fragment 2 slides in from the right (the next shot's stage)
    if (t > A.pan0) drawF2(ctx, t);
    K.drawFrontA(ctx, t, px, 0, 1);
    K.vignette(ctx, .52, W * .48, H * .52, '3,8,6');
  }
  // ---------------- 5.10 Windfall Clause ----------------
  function drawF2(ctx, t) { ctx.save(); ctx.translate(PAN * (1 - pan(t)), 0); K.drawFrag(ctx, 1, { cert: C2, lift: 1 + .4 * Math.sin(t * .6), rot: .006 * Math.sin(t * .5) }); ctx.restore(); }
  const BANDS = [[0, 0, .01], [0, 1, .20], [1, 2, .50]];   // [inner ring index (−1 → centre), outer ring index, share]
  function d510(ctx, t) {
    const px = -PAN * pan(t), zp = 1 + .42 * qio(lin(A.out0, A.iris + .4, t));
    K.drawGroundA(ctx, t, px, 0);
    ctx.save(); ctx.translate(P2[0], P2[1]); ctx.scale(zp, zp); ctx.translate(-P2[0], -P2[1]);
    drawF2(ctx, t);
    const ox = PAN * (1 - pan(t)), cx = P2[0] + ox, cy = P2[1];
    // profit rings: drawn on (a sweeping clip) one after another
    const ringT = [A.windfall - .1, A.big1 - .05, A.profit - .02];
    RINGS.forEach((Rr, k) => {
      const u = qio(lin(ringT[k], ringT[k] + .55, t)); if (u <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, Rr + 40, -Math.PI / 2, -Math.PI / 2 + TAU * u); ctx.closePath(); ctx.clip();
      ring(ctx, cx, cy, Rr, Rr, { lines: 6, band: 12 + k * 3, wave: 18, col: K.GREEN_INK, glow: null, op: 'source-over', lineA: 1, a: .9, lw: .95, ph: t * .15 + k });
      ctx.restore();
    });
    // the foil bands: 1 % (the carried wedge settles into it), 20 % on "bigger", 50 % on "share"
    const bandT = [A.land2 - .1, A.big2 - .04, A.share - .04], liftU = xout(lin(A.away - .05, A.away + .5, t));
    BANDS.forEach(([i0, i1, sh], k) => {
      if (k === 0 && t < A.land2) return;
      const u = k === 0 ? 1 : xout(lin(bandT[k], bandT[k] + .6, t)); if (u <= 0) return;
      const r0 = k === 0 ? 0 : RINGS[i0], r1 = RINGS[i1], a0 = -Math.PI / 2, a1 = a0 + TAU * sh * u, mid = (a0 + a1) / 2, off = 16 * liftU * (k + 1) * .6;
      K.foilSector(ctx, cx + Math.cos(mid) * off, cy + Math.sin(mid) * off, r0 + (k ? 3 : 0), r1 - 3, a0, a1, t, { lift: 3 + 12 * liftU, phase: k * .3 });
    });
    if (t < A.land2 + .02) { const w = wedgeAt(t); ctx.save(); ctx.translate(-0, 0); K.foilSector(ctx, w.x + (zp - 1) * 0, w.y, 0, w.r1, w.a0, w.a1, t, { lift: w.lift, dark: true }); ctx.restore(); }
    // band labels, left of the 12 o'clock line
    const labT = [A.windfall + .2, A.big2 + .25, A.share + .25];
    BANDS.forEach(([i0, i1, sh], k) => { const la = sm(lin(labT[k], labT[k] + .35, t)) * (1 - sm(lin(A.out0, A.out0 + .3, t))); if (la <= 0) return; const r0 = k === 0 ? 0 : RINGS[i0], rm = (r0 + RINGS[i1]) / 2; text(ctx, `${Math.round(sh * 100)} %`, cx - 16, cy - rm + 12, { size: k ? 36 : 30, font: 'Instrument Serif', color: rgba(k === 2 ? '#8a3a12' : '#1d4436', la), align: 'right' }); });
    // light rings run outward (they become the cheer over the city)
    if (t > A.out0) for (let k = 0; k < 4; k++) { const t0 = A.out0 + k * .17, q = lin(t0, t0 + 1.5, t); if (q <= 0 || q >= 1) continue; const r = mix(RINGS[2] + 10, 1500, xout(q) * .9 + q * .1); ring(ctx, cx, cy, r, r, { lines: 7, band: 20, wave: 30, col: '#fff1d6', glow: '#ffb35c', glowA: .12, a: (1 - q) * .9, lw: 1.1, ph: k * 1.3 }); }
    ctx.restore();
    // captions (left column)
    const ca = 1 - sm(lin(A.out0 - .1, A.out0 + .3, t)), X = 132;
    if (ca > 0) {
      ctx.save(); ctx.globalAlpha = ca;
      K.revealText(ctx, 'Windfall Clause', X, 396, lin(A.windfall - .1, A.windfall + .5, t), { size: 80, font: 'Instrument Serif', color: '#f1ead2' });
      K.revealText(ctx, 'PROPOSED BY OXFORD RESEARCHERS  ·  2020', X + 4, 446, lin(A.oxford + .05, A.oxford + .7, t), { size: 17, weight: 600, color: '#e9c46a', spacing: 4 });
      const nums = [['1 %', A.windfall + .25], ['20 %', A.big2], ['50 %', A.share]]; let xx = X;
      for (const [k, [s, t0]] of nums.entries()) { const on = sm(lin(t0, t0 + .35, t)), base = sm(lin(A.big1 - .3, A.big1 + .2, t));
        ctx.font = '46px "Instrument Serif"'; const w = ctx.measureText(s).width;
        if (base > 0 || on > 0) text(ctx, s, xx, 540, { size: 46, font: 'Instrument Serif', color: on > .5 ? '#ffb35c' : rgba('#f1ead2', .35), alpha: Math.max(base * .6, on) });
        xx += w + 18; if (k < 2) { if (base > 0) text(ctx, '→', xx, 536, { size: 30, color: rgba('#f1ead2', .5 * base) }); xx += 46; } }
      K.revealText(ctx, 'OF PROFITS ABOVE THRESHOLDS', X + 4, 584, lin(A.big1, A.big1 + .5, t), { size: 17, weight: 600, color: '#f1ead2', spacing: 4.5 });
      ctx.restore();
      K.sourceLine(ctx, 'Source: O’Keefe et al., “The Windfall Clause”, Future of Humanity Institute, Oxford, 2020', env(t, A.windfall, A.windfall + .6, A.out0 - .1, A.out0 + .2));
    }
    K.drawFrontA(ctx, t, px, 0, 1 - sm(lin(A.out0, A.iris, t)) * .5);
    K.vignette(ctx, .5, W * .55, H * .52, '3,8,6');
  }

  // ======================= WORLD B: the night city from above → the engraved night map =======================
  const MB = K.usaBorder(), SF = K.mapXY(-122.4, 37.78), US = (() => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of MB) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return [(x0 + x1) / 2, (y0 + y1) / 2]; })();
  const CITYPX = 46;   // the city raster's width on the map at scale 1 (map px)
  const mapCam = (t) => {   // screen = Q + (p − SF)·m
    const m1 = 1 + .03 * Math.max(0, t - A.rise1), Q1 = [US[0] + (SF[0] - US[0]) * m1 + drift(t, 5, 1), US[1] + (SF[1] - US[1]) * m1 + drift(t, 4, 2)];
    const r = qio(lin(A.iris - .4, A.rise1, t)), m0 = 2400 / CITYPX * 1.05, m = Math.exp(mix(Math.log(m0), Math.log(m1), Math.pow(r, .8)));
    const Q0 = [P2[0], P2[1]];
    return { m, Q: [mix(Q0[0], Q1[0], r), mix(Q0[1], Q1[1], r)], r };
  };
  const mapPt = (mc, p) => [mc.Q[0] + (p[0] - SF[0]) * mc.m, mc.Q[1] + (p[1] - SF[1]) * mc.m];
  const fogRush = () => K.once('fogRush', () => { const [c, g] = canvas(W, H), r = prng(3); g.filter = 'blur(30px)'; for (let i = 0; i < 18; i++) { const x = r() * W, y = r() * H, R = 220 + r() * 420, gr = g.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, 'rgba(120,140,180,.20)'); gr.addColorStop(.6, 'rgba(120,140,180,.08)'); gr.addColorStop(1, 'rgba(120,140,180,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, R * 1.4, R * .7, r() * .6 - .3, 0, TAU); g.fill(); } g.filter = 'none'; return c; });
  function drawMapB(ctx, t, mc, o = {}) {
    const L = K.nightMap(), [sx, sy] = mapPt(mc, [0, 0]);
    ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.drawImage(L, sx - K.MAP.pad * mc.m, sy - K.MAP.pad * mc.m, K.MAP.w * mc.m, K.MAP.h * mc.m); ctx.restore();
    const ua = o.us ?? 0; if (ua > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = ua * (.88 + .12 * Math.sin(t * 2.2)); ctx.drawImage(K.usaLayer(), sx - K.MAP.pad * mc.m, sy - K.MAP.pad * mc.m, K.MAP.w * mc.m, K.MAP.h * mc.m); ctx.restore(); }
  }
  const usPath = (mc) => { const p = new Path2D(); MB.forEach((q, i) => { const [x, y] = mapPt(mc, q); i ? p.lineTo(x, y) : p.moveTo(x, y); }); p.closePath(); return p; };
  function cheerOnMap(ctx, t, mc, a) {   // cheer rings spread from the city over the country and stop at its border
    if (a <= 0) return; ctx.save(); ctx.clip(usPath(mc));
    for (let k = 0; k < 7; k++) { const t0 = A.cheer - .55 + k * .55, q = (t - t0) / 2.8; if (q <= 0 || q >= 1) continue; const r = (40 + 900 * xout(q)) * mc.m, [x, y] = mapPt(mc, SF); ring(ctx, x, y, r, r, { lines: 5, band: 14, wave: 26, col: '#ffe2b0', glow: '#ffb35c', glowA: .14, a: a * (1 - q) * .85, lw: 1, ph: k }); }
    ctx.restore();
  }
  // ---------------- 5.16a But who gets to cheer? ----------------
  function d516a(ctx, t) {
    const mc = mapCam(t), kc = mc.m * CITYPX / K.CITY.w, cityA = 1 - sm(lin(A.cheer - .35, A.cheer + .1, t));
    ctx.fillStyle = '#05080f'; ctx.fillRect(0, 0, W, H);
    drawMapB(ctx, t, mc, { us: sm(lin(A.cheer - .2, A.cheer + .45, t)) });
    if (cityA > 0) {
      const [cx, cy] = mapPt(mc, SF), C = K.cityTop();
      ctx.save(); ctx.globalAlpha = cityA; ctx.translate(cx, cy); ctx.rotate(.03 * (t - A.iris)); ctx.drawImage(C, -K.CITY.w / 2 * kc, -K.CITY.h / 2 * kc, K.CITY.w * kc, K.CITY.h * kc); ctx.restore();
      K.cityCheer(ctx, t, A.iris - .3, cx, cy, kc, cityA);
      for (let k = 0; k < 6; k++) { const t0 = A.iris - .55 + k * .33, q = (t - t0) / 1.9; if (q <= 0 || q >= 1) continue; const r = (60 + 1300 * xout(q)) * kc; ring(ctx, cx, cy, r, r, { lines: 6, band: 18, wave: 30, col: '#ffe8c4', glow: '#ffb35c', glowA: .14, a: cityA * (1 - q) * .95, lw: 1.1, ph: k * 1.7 }); }
    }
    cheerOnMap(ctx, t, mc, sm(lin(A.cheer - .4, A.cheer, t)));
    // rising through the haze: fog rushes past the camera in the fast part of the rise
    const fr = lin(A.who - .1, A.rise1, t), fa = Math.sin(Math.PI * clamp(fr)) * .85;
    if (fa > 0) { const F = fogRush(), z = 1 + 2.2 * fr; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fa; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.drawImage(F, -W / 2, -H / 2); ctx.restore(); }
    K.motes(ctx, t, { a: .5, n: 40, seed: 7, col: '255,220,170' });
    K.vignette(ctx, .55, W * .45, H * .5, '2,4,10');
  }
  // ---------------- 5.16b Only the people of one rich country? ----------------
  const COUP = (() => { const [c, g] = canvas(8, 8); return planSheet(g, 960, 520, 1.15, A.harvest, { rot: -.025, coupons: [0, 0, 0], hi: 2 }).coupon(2); })();
  const couponPts = (() => { const { x, y, w, h, r } = COUP, rr = 14, pts = [], c = Math.cos(r), s = Math.sin(r); const P = (px, py) => [x + px * c - py * s, y + px * s + py * c];
    // rounded rectangle, starting at the top-left, clockwise (matches the border's sense roughly)
    const hw = w / 2, hh = h / 2; for (const [ax, ay, bx, by] of [[-hw + rr, -hh, hw - rr, -hh], [hw, -hh + rr, hw, hh - rr], [hw - rr, hh, -hw + rr, hh], [-hw, hh - rr, -hw, -hh + rr]]) for (let i = 0; i <= 20; i++) pts.push(P(mix(ax, bx, i / 20), mix(ay, by, i / 20)));
    pts.push(pts[0]); return pts; })();
  const borderAt = (t) => { const mc = mapCam(t); return MB.map((q) => mapPt(mc, q)); };
  const liftPts = (t) => { const u = qio(lin(A.lift0, A.land601, t)), B0 = borderAt(A.lift0); const pts = unwind(B0, couponPts, u, { n: 500, sweep: .35 }); const up = Math.sin(Math.PI * u) * -170, o = t > A.land601 - .2 ? [drift(t, 8, 1) * .5, drift(t, 5, 2) * .5 + sheetY(t) - 520] : [0, 0]; return pts.map(([x, y], i) => [x + o[0], y + up * Math.sin(Math.PI * i / 499) * .3 + up * .7 + o[1]]); };
  function liftLine(ctx, t, a = 1) {   // the border, now a glowing amber line, rising and redrawing itself into the coupon's edge
    const u = lin(A.lift0, A.land601, t), P = liftPts(t), hot = 1 - sm(lin(A.land601, A.land601 + .7, t));
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
    for (const [w, al, col] of [[16, .07, '#ffb35c'], [6, .2, '#ffb35c'], [1.8, .95, '#fff1d6']]) { ctx.strokeStyle = rgba(col, al * a * mix(.6, 1, hot)); ctx.lineWidth = w; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
    // landed on the paper: the light turns into a printed amber rule on the coupon's edge (additive light would vanish on cream)
    const pr = (1 - hot) * (1 - sm(lin(A.harvest + .3, A.harvest + .8, t)));
    if (pr > 0) { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba('#b8661f', .85 * pr * a); ctx.lineWidth = 2; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
    ctx.restore(); void u;
  }
  function d516b(ctx, t) {
    const mc = mapCam(t), tilt = xin(lin(A.lift0 + .4, A.cut601 + .1, t)) * 900;
    ctx.fillStyle = '#05080f'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(0, tilt);
    drawMapB(ctx, t, mc, { us: 1 - .5 * sm(lin(A.lift0, A.lift0 + .6, t)) });
    cheerOnMap(ctx, t, mc, 1 - sm(lin(A.countryE - .2, A.countryE + .6, t)));
    // the border of the one country as an engraved microtext line, then a glint runs along it
    const B = MB.map((q) => mapPt(mc, q)), mu = lin(A.only + .2, A.countryE - .2, t), off = (t - A.only) * 22, ga = 1 - sm(lin(A.lift0 - .05, A.lift0 + .2, t));
    if (mu > 0 && ga > 0) {
      ctx.save(); ctx.globalAlpha = ga; ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .22); ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); B.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha = ga; microPath(ctx, B, 'CITIZENS ONLY', { size: 11.5, u: xout(mu), col: '#ffe9c4', a: .95, offset: off, spacing: 1.2, glint: lin(A.one - .1, A.countryE + .4, t) * 1.15 - .08 }); ctx.restore();
    }
    // labels: the rest of the world stays dark
    const la = env(t, A.one, A.one + .5, A.lift0, A.lift0 + .3);
    if (la > 0) { const [x, y] = mapPt(mc, [US[0] + 40, US[1] + 260]); text(ctx, 'ONE COUNTRY', x, y, { size: 20, weight: 600, color: rgba('#ffe2b0', .9 * la), spacing: 8, align: 'center' }); }
    ctx.restore();
    if (t > A.lift0) liftLine(ctx, t);
    K.motes(ctx, t, { a: .45, n: 40, seed: 7, col: '255,220,170' });
    K.vignette(ctx, .55, W * .45, H * .5, '2,4,10');
  }

  // ======================= WORLD C: harvest =======================
  // ---------------- 6.01 Step three: harvest. ----------------
  // the sheet drops in from above (the camera has tilted up with the border line), the HARVEST coupon takes its foil on "harvest",
  // the engraved fruit of its vignette lifts off as light; the camera pushes in on it (it becomes the fruit in the fund's tree, 6.02)
  const sheetY = (t) => 520 - 980 * (1 - xout(lin(A.cut601, A.land601 + .05, t)));   // enters from above right after the cut (the camera tilted up with the line)
  const SHEET = (t) => ({ x: 960 + drift(t, 8, 1) * .5, y: sheetY(t) + drift(t, 5, 2) * .5, rot: -.025 + .004 * Math.sin(t * .4) });
  const EMB = (() => { const [, g] = canvas(8, 8); return planSheet(g, 960, 520, 1.15, A.harvest, { rot: -.025 }).emblem(2); })();
  const FR = [Math.round(EMB.x - 30), Math.round(EMB.y - 95)], FRR = 40, Z602 = 2.2;   // the fruit in 6.02 (screen, zoom 1): just above the HARVEST vignette; push-in factor at the cut
  const push601 = (t) => xin(lin(A.t602 - .62, A.t602, t));   // 6.01 camera push toward the fruit (expo in → cut)
  const fruitPath = (t) => { const u = qio(lin(A.fruit0, A.t602 - .05, t)), x0 = EMB.x, y0 = EMB.y, x1 = FR[0], y1 = FR[1];
    return { x: mix(x0, x1, u) + Math.sin(Math.PI * u) * 70, y: mix(y0, y1, u) - Math.sin(Math.PI * u) * 120, r: mix(EMB.r * .55, FRR * Z602, Math.pow(u, 1.6)) }; };
  function d601(ctx, t) {
    const S = SHEET(t), pu = push601(t), f = fruitPath(Math.max(t, A.fruit0)), kz = 1 + 1.6 * pu;
    ctx.save(); ctx.translate(f.x, f.y); ctx.scale(kz, kz); ctx.translate(-f.x, -f.y);
    ctx.drawImage(K.tableWarm('table601', ['#3a2516', '#1c120c', '#0a0605'], [1500, 40]), -200 + drift(t, 8, 1) * .3, -150 + drift(t, 5, 2) * .3 + (S.y - 520) * .25);
    const hu = xout(lin(A.harvest - .06, A.harvest + .62, t)), dimU = sm(lin(A.harvest, A.harvest + .5, t)) * .5;
    const P = planSheet(ctx, S.x, S.y, 1.15, t, { rot: S.rot, u: 1, hi: t > A.harvest - .06 ? 2 : null, hiU: hu, dim: [dimU, dimU, 0], lift: 6 + 8 * Math.exp(-Math.max(0, t - A.harvest) * 6) });
    // the press on "harvest": a short flash of foil light from the coupon
    const c = P.coupon(2); K.bloomAt(ctx, c.x, c.y - c.h * .15, 380 * (1 - lin(A.harvest, A.harvest + .5, t)) + 80, .5 * env(t, A.harvest - .04, A.harvest + .02, A.harvest + .08, A.harvest + .6));
    // the engraved fruit lifts off its vignette: a light that leaves the engraving behind
    if (t > A.fruit0 - .1) { const e = P.emblem(2), q = sm(lin(A.fruit0 - .1, A.fruit0 + .15, t)); K.bloomAt(ctx, e.x, e.y, e.r * 3, .45 * q * (1 - pu)); }
    if (t > A.lift0 && t < A.harvest + .85) liftLine(ctx, t);
    ctx.restore();
    if (t > A.fruit0) { const k = 1 + .35 * pu; K.bloomAt(ctx, f.x, f.y, f.r * 6 * k, .5 + .4 * pu); shareLight(ctx, f.x, f.y, f.r * k, t, { mode: 'fruit', a: 1 }); }
    K.motes(ctx, t, { a: .6, n: 50, seed: 15 });
    K.vignette(ctx, .55, W * .55, H * .45, '8,5,3');
    if (pu > .6) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffb35c', .22 * sm(lin(.6, 1, pu))); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }
  // ---------------- 6.02 One rule matters most: the same share for everyone. ----------------
  // inside the fund: the tree behind the glass, the fruit hanging in its crown (the camera pulls back from the fruit); on "same" it
  // splits into identical slices that come out and line up in a row; one slice drops and the camera tilts down after it
  const JS = 1.9, JX = FR[0] - 55 * JS, JY = FR[1] + 320 * JS, TS = .6, NS = 8;   // the fruit hangs at jar point (55, −320), upper right of the crown
  const autumn = () => K.once('autumn602', () => { const [c, g] = canvas(W + 300, H + 1700); const bg = g.createLinearGradient(0, 0, 0, c.height); bg.addColorStop(0, '#3a2414'); bg.addColorStop(.35, '#1f140c'); bg.addColorStop(1, '#0b0705'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
    const rg = g.createRadialGradient(600, 300, 0, 700, 500, 1500); rg.addColorStop(0, 'rgba(120,80,40,.55)'); rg.addColorStop(1, 'rgba(120,80,40,0)'); g.fillStyle = rg; g.fillRect(0, 0, c.width, c.height);
    const [l, lg] = canvas(W + 300, H + 300); for (let i = 0; i < 7; i++) { const a = .5 + i * .09, sp = .025 + (i % 3) * .01, L = 2000; const gr = lg.createRadialGradient(200, -100, 100, 200, -100, L); gr.addColorStop(0, 'rgba(255,200,130,.10)'); gr.addColorStop(1, 'rgba(255,200,130,0)'); lg.fillStyle = gr; lg.beginPath(); lg.moveTo(200, -100); lg.lineTo(200 + Math.cos(a - sp) * L, -100 + Math.sin(a - sp) * L); lg.lineTo(200 + Math.cos(a + sp) * L, -100 + Math.sin(a + sp) * L); lg.closePath(); lg.fill(); }
    stipple(l, { k: .85, g: 1.2, seed: 8 }); g.globalCompositeOperation = 'lighter'; g.drawImage(l, 0, 0); g.globalCompositeOperation = 'source-over';
    const r = prng(4); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,220,170,${r() * .05})`; g.fillRect(r() * c.width, r() * c.height, 1.5, 1.5); }
    return c; });
  function slice(ctx, x, y, R, a0, a1, a = 1) {   // one identical slice of the fruit (amber-red, cream rim)
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, R, a0, a1); ctx.closePath();
    const g = ctx.createRadialGradient(x - R * .3, y - R * .35, 0, x, y, R); g.addColorStop(0, '#ffe2b0'); g.addColorStop(.55, '#f0a04b'); g.addColorStop(1, '#c8442f'); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = rgba('#f3efe2', .85); ctx.lineWidth = Math.max(1, R * .07); ctx.beginPath(); ctx.arc(x, y, R * .95, a0 + .05, a1 - .05); ctx.stroke(); ctx.restore();
    addGlow(ctx, x + Math.cos((a0 + a1) / 2) * R * .5, y + Math.sin((a0 + a1) / 2) * R * .5, R * 1.6, .35 * a, '#ffb35c', '#fff1d6');
  }
  // the tree inside the fund, rendered once (leaf sprites at this size cost ~120 ms per frame); it sways as a whole about its root
  const treeCache = () => K.once('tree602', () => { const k = JS * Z602, x0 = -150, y0 = -430, w = 300, h = 400, [c, g] = canvas(Math.ceil(w * k), Math.ceil(h * k)); g.scale(k, k); g.translate(-x0, -y0); tree(g, 0, -54, TS, A.t602 + .5, { grow: 1, fruit: 0, seed: 5, wind: .7 }); return { c, x0, y0, w, h }; });
  const ROWY = 800, RS = 104, ROWDX = 176;
  const sliceState = (t, i) => {   // split on "same" (the fruit's own slices), then fly out and line up in a row, all pointing up
    const a0 = -Math.PI / 2 + i * TAU / NS, a1 = a0 + TAU / NS, mid = (a0 + a1) / 2, sp = xout(lin(A.same, A.same + .45, t));
    const fan = [FR[0] + Math.cos(mid) * FRR * .5 * sp, FR[1] + Math.sin(mid) * FRR * .5 * sp], row = [W / 2 - (NS - 1) / 2 * ROWDX + i * ROWDX, ROWY];
    const ru = qio(lin(A.same + .3 + i * .04, A.everyone + .1 + i * .04, t)), rot = ru * (-Math.PI / 2 - mid);
    const x = mix(fan[0], row[0], ru), y = mix(fan[1], row[1], ru) - Math.sin(Math.PI * ru) * 90 + Math.sin(t * 1.4 + i) * 3 * ru;
    return { x, y, R: mix(FRR, RS, ru), a0: a0 + rot, a1: a1 + rot };
  };
  const DROP = 5, GRAV = 2400;
  const dropY = (t) => { const u = clamp((t - A.drop0) / (A.cut603 - A.drop0)), dt = Math.max(0, t - A.drop0), yw = ROWY + .5 * GRAV * dt * dt, ys = ROWY + 140 * Math.sin(Math.PI * u) - (ROWY - 560) * sm(u); return { yw, ys, tilt: Math.max(0, yw - ys) }; };
  const dropPos = (t) => { const s = sliceState(A.drop0, DROP), d = dropY(t); return { x: s.x + 10 * clamp((t - A.drop0) / .9), y: d.ys, R: RS, s }; };
  function d602(ctx, t) {
    const zc = mix(Z602, 1, qio(lin(A.t602, A.t602 + 1.25, t))), tilt = t > A.drop0 ? dropY(t).tilt : 0, dx = drift(t, 7, 1), dy = drift(t, 5, 2);
    ctx.save(); ctx.translate(0, -tilt);
    ctx.drawImage(autumn(), -150 + dx * .3, -150 + dy * .3 + tilt * .6);
    ctx.save(); ctx.translate(FR[0], FR[1]); ctx.scale(zc, zc); ctx.translate(-FR[0] - dx * .4 * (1 - (zc - 1)), -FR[1] - dy * .4 * (1 - (zc - 1)));
    const inner = (g, box) => { const C = treeCache(), sw = .012 * Math.sin(t * .9) + .006 * Math.sin(t * 2.3); g.save(); g.translate(0, -54); g.rotate(sw); g.translate(0, 54); g.drawImage(C.c, C.x0, C.y0, C.w, C.h); g.restore(); void box; };
    glassFund(ctx, JX, JY, JS, t, { fill: .45, seal: 1, glow: .55, inner });
    // the fruit hangs on its stem in the crown, then splits on "same"
    const sway = Math.sin(t * 1.1) * .05, fx = FR[0] + sway * 60;
    if (t < A.same + .05) { ctx.save(); ctx.translate(FR[0], FR[1] - FRR - 22); ctx.rotate(sway); ctx.strokeStyle = '#4a3426'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -18); ctx.quadraticCurveTo(4, 4, 0, 24); ctx.stroke(); ctx.restore(); K.bloomAt(ctx, fx, FR[1], FRR * 6, .55); shareLight(ctx, fx, FR[1], FRR, t, { mode: 'fruit', a: 1 }); }
    if (t > A.same - .02 && t < A.same + .5) K.bloomAt(ctx, FR[0], FR[1], 300, .8 * env(t, A.same - .02, A.same + .04, A.same + .1, A.same + .5));
    ctx.restore();
    // the slices: identical, in a row across the frame (drawn at screen scale so they read); the fund steps back into the dark
    const veil = sm(lin(A.same + .3, A.everyone, t)); if (veil > 0) { ctx.fillStyle = `rgba(10,6,3,${.5 * veil})`; ctx.fillRect(0, -200, W, H + 400 + tilt); }
    if (t >= A.same + .05) for (let i = 0; i < NS; i++) {
      if (i === DROP && t > A.drop0) continue;
      const st = sliceState(t, i), k = zc, x = FR[0] + (st.x - FR[0]) * (st.y === ROWY ? 1 : 1), y = st.y;
      slice(ctx, (x - FR[0]) * (t < A.everyone ? mix(k, 1, qio(lin(A.same + .3, A.everyone, t))) : 1) + FR[0], y, st.R * (t < A.everyone ? mix(k, 1, qio(lin(A.same + .3, A.everyone, t))) : 1), st.a0, st.a1);
    }
    const la = env(t, A.everyone - .15, A.everyone + .25, A.drop0 + .25, A.drop0 + .5);
    if (la > 0) K.revealText(ctx, 'THE SAME SHARE FOR EVERYONE', W / 2, ROWY + 92, lin(A.everyone - .15, A.everyone + .35, t), { size: 20, weight: 600, color: rgba('#ffe2b0', .92 * la), spacing: 7, align: 'center' });
    ctx.restore();
    if (t > A.drop0) { const d = dropPos(t); slice(ctx, d.x, d.y, d.R, -Math.PI / 2 - Math.PI / NS, -Math.PI / 2 + Math.PI / NS); }
    K.motes(ctx, t, { a: .7, n: 60, seed: 19 });
    K.vignette(ctx, .55, W * .55, H * .45, '8,5,3');
  }
  // ---------------- 6.03 Switzerland already does a small version. ----------------
  const CH0 = K.swissCentroid(), MAPY = 600;
  const swissView = (t) => { const z = mix(1, 1.18, qio(lin(A.swiss + .5, A.t604 + .3, t))) * (1 + .5 * xin(lin(A.t604 - .25, A.t604 + .35, t))), oy = 950 * (1 - xout(lin(A.cut603 - .2, A.swiss + .65, t))); return { z, oy, dx: drift(t, 6, 1), dy: drift(t, 4, 2) }; };
  const mapToScreen = (v, p) => { const c = Math.cos(-.05), s = Math.sin(-.05), x = (p[0] - CH0[0]) * v.z, y = (p[1] - CH0[1]) * v.z * .84; return [960 + v.dx + x * c - y * s, MAPY + v.oy + v.dy + x * s + y * c]; };
  const slicePos603 = (t) => {   // continues the drop from 6.02 (same screen spot and size at the cut), falls away from the camera onto Switzerland on "small"
    const v = swissView(t), [lx, ly] = mapToScreen(v, CH0), u = clamp((t - A.cut603) / (A.small - A.cut603)), e = Math.pow(u, 1.5), ep = 1 - Math.pow(1 - u, 2.2) * (1 - u * .3);
    const d0 = dropPos(A.cut603);
    const bounce = t > A.small ? Math.exp(-(t - A.small) * 8) * Math.sin((t - A.small) * 26) * 4 : 0;
    return { x: mix(d0.x, lx, ep), y: mix(d0.y, ly, ep) - bounce, r: mix(d0.R, 15 * v.z, e) * (1 + .04 * bounce), s: { a0: -Math.PI / 2 - Math.PI / NS, a1: -Math.PI / 2 + Math.PI / NS } };
  };
  const push603 = (t) => xin(lin(A.t604 - .5, A.t604, t));
  function d603(ctx, t) {
    const v = swissView(t), pk = push603(t), sp0 = slicePos603(Math.min(t, A.t604));
    ctx.save(); if (pk > 0) { const k = 1 + 6 * pk; ctx.translate(mix(sp0.x, W / 2, pk), mix(sp0.y - 30, H / 2, pk)); ctx.scale(k, k); ctx.translate(-sp0.x, -sp0.y + 30); }
    ctx.fillStyle = '#121a26'; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(K.tableWarm('table603', ['#2a3444', '#161d29', '#080b10'], [1600, 0]), -200 + v.dx * .3, -150 + v.oy * .6);
    ctx.save(); ctx.translate(960 + v.dx, MAPY + v.oy + v.dy); ctx.rotate(-.05); ctx.scale(v.z, v.z * .84);
    const SS = K.swissSheet(); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 26; ctx.fillStyle = '#000'; ctx.fillRect(-K.SWM.w / 2 - CH0[0] + 40, -K.SWM.h / 2 - CH0[1] + 40, K.SWM.w - 80, K.SWM.h - 80); ctx.restore();
    ctx.drawImage(SS, -K.SWM.w / 2 - CH0[0], -K.SWM.h / 2 - CH0[1]);
    // Switzerland lights from the landing point outward
    const lu = xout(lin(A.small - .02, A.small + .7, t));
    if (lu > 0) { ctx.save(); ctx.translate(-CH0[0], -CH0[1]); ctx.clip(K.swissCH()); ctx.fillStyle = 'rgba(255,170,80,.42)'; ctx.beginPath(); ctx.arc(CH0[0], CH0[1], 420 * lu, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(200,110,30,.45)'; ctx.lineWidth = 1; for (let y = -300; y < 300; y += 5) { ctx.beginPath(); ctx.moveTo(CH0[0] - 420 * lu, CH0[1] + y); ctx.lineTo(CH0[0] + 420 * lu, CH0[1] + y - 6); ctx.stroke(); } ctx.restore();
      ctx.save(); ctx.translate(-CH0[0], -CH0[1]); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .5 * lu); ctx.lineWidth = 5; ctx.stroke(K.swissCH()); ctx.strokeStyle = rgba('#fff1d6', .8 * lu); ctx.lineWidth = 1.4; ctx.stroke(K.swissCH()); ctx.restore(); }
    ctx.restore();
    const sp = slicePos603(t);
    if (t > A.small) { const q = lin(A.small, A.small + 1.1, t); if (q < 1) ring(ctx, sp.x, sp.y + 4, 20 + 260 * xout(q), (20 + 260 * xout(q)) * .84, { lines: 5, band: 12, wave: 20, col: '#ffe2b0', glow: '#ffb35c', glowA: .1, a: (1 - q) * .8, lw: .9 }); }
    // the slice: falling, shrinking with height, landing with a small settle
    { const s = sp.s, u = clamp((t - A.cut603) / (A.small - A.cut603)), [lx, ly] = mapToScreen(v, CH0);
      ctx.save(); ctx.globalAlpha = .35 * u * u; ctx.fillStyle = '#1a1208'; ctx.filter = `blur(${mix(14, 3, u)}px)`; ctx.beginPath(); ctx.ellipse(lx + mix(40, 4, u), ly - sp.r * .4 + mix(30, 3, u), sp.r * .5, sp.r * .3, 0, 0, TAU); ctx.fill(); ctx.filter = 'none'; ctx.restore();
      slice(ctx, sp.x, sp.y, sp.r, s.a0, s.a1); }
    const la = sm(lin(A.small + .25, A.small + .7, t)) * (1 - sm(lin(A.t604 - .2, A.t604, t)));
    if (la > 0) { const [x, y] = mapToScreen(v, [CH0[0], CH0[1] - 120]); text(ctx, 'SWITZERLAND', x, y, { size: 26, weight: 600, color: rgba('#2a3f5f', .95 * la), spacing: 9, align: 'center' }); }
    ctx.restore();
    K.motes(ctx, t, { a: .4, n: 40, seed: 29, col: '255,240,220' });
    K.vignette(ctx, .5 * (1 - pk), W * .5, H * .5, '6,8,12');
    if (pk > 0) { const x = mix(sp0.x, W / 2, pk), y = mix(sp0.y - 30, H / 2, pk); K.bloomAt(ctx, x, y, 160 + 1700 * pk, .4 + .6 * pk, '#ffcf8a'); ctx.fillStyle = `rgba(255,240,218,${.9 * pk * pk})`; ctx.fillRect(0, 0, W, H); }
  }
  // ---------------- 6.04 Every resident … the same refund … every year. ----------------
  const LETTERS = [
    { x: 500, y: 495, rot: -.075, age: 'AGE 81', hand: { skin: '#e7c3a4', sleeve: '#6e6254', s: 1.0, ang: -1.32, dx: -70, dy: 300 }, tAge: 'pensioner' },
    { x: 960, y: 470, rot: .02, age: 'AGE 38', hand: { skin: '#a8734f', sleeve: '#1f5560', s: 1.0, ang: -1.5, dx: -40, dy: 305 }, tAge: 'resident' },
    { x: 1420, y: 510, rot: .085, age: 'AGE 0', hand: { skin: '#c99a74', sleeve: '#9a4a3a', s: 1.0, ang: -1.22, dx: -96, dy: 300 }, baby: { skin: '#f1d3b8', sleeve: '#e9dcc0', s: .62, ang: -2.45, dx: -18, dy: 365 }, tAge: 'baby' },
  ];
  const LW = 340, LH = 448;
  const letterCanvas = (mark) => K.once('letter' + mark, () => { const [c, g] = canvas(380, 500); g.fillStyle = '#f5f2ea'; g.fillRect(0, 0, 380, 500); K.refundLetter(g, 380, 500, { mark }); return c; });
  function drawLetter(ctx, t, L, i, mark, cam) {
    const br = Math.sin(t * 1.3 + i * 2) * 3, x = L.x + cam.dx * 1.0, y = L.y + br + cam.dy;
    paperSheet(ctx, x - LW / 2, y - LH / 2, LW, LH, { rot: L.rot + .006 * Math.sin(t * .8 + i), seed: 5 + i, tone: '#f3f0e8', light: [1700, 150], lift: 14,
      content: (g, w, h) => { g.save(); g.scale(w / 380, h / 500); g.drawImage(letterCanvas(0), 0, 0); if (mark > 0) { g.save(); g.beginPath(); g.rect(22, 318 - 24, (380 - 44) * mark, 34); g.clip(); g.drawImage(letterCanvas(1), 0, 0); g.restore(); } g.restore(); } });
    const c = Math.cos(L.rot), s = Math.sin(L.rot), lx = (x - LW / 2) + (22 * LW / 380) * c - (311 * LH / 500) * s, ly = (y - LH / 2) + (22 * LW / 380) * s + (311 * LH / 500) * c;
    return { line: [lx + (LW * .45) * c, ly + (LW * .45) * s], x, y };
  }
  const swCam = (t) => ({ dx: drift(t, 8, 1), dy: drift(t, 5, 2), z: 1 + .012 * (t - A.t604) });
  const pushE = (t) => xin(lin(A.t605 - .6, A.t605, t));
  const K605 = 2.6 / ((LW / 380) * (1 + .012 * (A.t605 - A.t604)));   // the push makes the parent's letter as large as the statement in 6.05
  const pushT = (t) => { const e = pushE(t), P = line604(Math.min(t, A.t605)), Q = [960 + drift(A.t605, 6, 1), 540 + drift(A.t605, 4, 2)], k = mix(1, K605, e); return { e, k, P, Q: [mix(P[0], Q[0], e), mix(P[1], Q[1], e)] }; };
  function d604(ctx, t) {
    const cam = swCam(t), mark = xout(lin(A.sameRefund - .1, A.sameRefund + .55, t)), pt = pushT(t);
    ctx.save(); if (pt.e > 0) { ctx.translate(pt.Q[0], pt.Q[1]); ctx.scale(pt.k, pt.k); ctx.translate(-pt.P[0], -pt.P[1]); }
    ctx.drawImage(K.swissMorning(), -150 + cam.dx * .25, -100 + cam.dy * .25);
    ctx.save(); ctx.globalAlpha = .7; ctx.drawImage(K.swissFog(), -200 + cam.dx * .5 - (t * 6) % 200, 0); ctx.restore();
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-W / 2, -H / 2);
    const rise = (i) => 260 * (1 - xout(lin(A.t604 - .3 + i * .12, A.t604 + .55 + i * .12, t)));
    const lines = [];
    LETTERS.forEach((L, i) => {
      ctx.save(); ctx.translate(0, rise(i));
      const r = drawLetter(ctx, t, L, i, mark, cam); lines.push([r.line[0], r.line[1] + rise(i)]);
      const hd = L.hand, wx = r.x + hd.dx, wy = r.y + hd.dy, ha = 1 - sm(lin(.35, .85, pushE(t)));
      if (ha > 0) { ctx.save(); ctx.globalAlpha = ha;
        hand(ctx, wx, wy, hd.s * 1.25, { pose: 'grip', ang: hd.ang + .03 * Math.sin(t * .9 + i), skin: hd.skin, sleeve: hd.sleeve, sleeveLen: 300, rim: '#fff4e0', light: [.6, -1], t, seed: i });
        if (L.baby) { const bb = L.baby, by = Math.sin(t * 2.1) * 4; hand(ctx, r.x + bb.dx, r.y + bb.dy + by, bb.s * 1.25, { pose: 'baby', ang: bb.ang + .06 * Math.sin(t * 1.7), skin: bb.skin, sleeve: bb.sleeve, sleeveLen: 320, rim: '#fff4e0', light: [.6, -1], t, seed: 7, close: .5 + .08 * Math.sin(t * 1.3) }); }
        ctx.restore(); }
      const ta = { pensioner: A.pensioner, resident: A.resident + .5, baby: A.baby }[L.tAge], la = sm(lin(ta, ta + .4, t)) * (1 - sm(lin(A.t605 - .3, A.t605, t)));
      if (la > 0) text(ctx, L.age, r.x - LW / 2 + 6, r.y - LH / 2 - 22, { size: 17, weight: 600, color: rgba('#26354f', .85 * la), spacing: 5 });
      ctx.restore();
    });
    if (mark > .05) for (const [x, y] of lines) K.bloomAt(ctx, x, y, 170, .4 * env(t, A.sameRefund, A.sameRefund + .3, A.sameRefund + .9, A.sameRefund + 1.8) + .12 * mark, '#ffb35c');
    ctx.restore();
    const ca = sm(lin(A.sameRefund + .25, A.sameRefund + .75, t)) * (1 - sm(lin(A.t605 - .3, A.t605, t)));
    if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; K.revealText(ctx, 'Switzerland · CO2 levy refund', 96, 132, lin(A.sameRefund + .25, A.sameRefund + .85, t), { size: 50, font: 'Instrument Serif', color: '#22324c' });
      K.revealText(ctx, 'CHF 61.80 PER PERSON  ·  2026', 100, 172, lin(A.sameRefund + .55, A.sameRefund + 1.1, t), { size: 18, weight: 600, color: '#9a4f12', spacing: 5 }); ctx.restore(); }
    K.sourceLine(ctx, 'Source: Swiss Federal Office for the Environment (BAFU), 2026', ca, { col: '#22324c', x: 1250, y: 118 });
    ctx.restore();
    K.vignette(ctx, .25, W * .5, H * .45, '30,40,60');
    const op = 1 - xout(lin(A.t604, A.t604 + .55, t)); if (op > 0) { ctx.fillStyle = `rgba(255,240,218,${.9 * op})`; ctx.fillRect(0, 0, W, H); }
  }
  const line604 = (t) => { const cam = swCam(t), L = LETTERS[1], x = L.x + cam.dx, y = L.y + Math.sin(t * 1.3 + 2) * 3 + cam.dy, c = Math.cos(L.rot), s = Math.sin(L.rot), lx = (x - LW / 2) + (22 * LW / 380) * c - (311 * LH / 500) * s, ly = (y - LH / 2) + (22 * LW / 380) * s + (311 * LH / 500) * c; const p = [lx + LW * .45 * c, ly + LW * .45 * s]; return [W / 2 + (p[0] - W / 2) * cam.z, H / 2 + (p[1] - H / 2) * cam.z]; };
  // ---------------- 6.05 It arrives through their health insurance. ----------------
  const bigLetter = () => K.once('bigLetter', () => { const k = 2.6, [c, g] = canvas(380 * k, 500 * k); g.scale(k, k); paperSheet(g, 0, 0, 380, 500, { rot: 0, seed: 6, tone: '#f3f0e8', shadow: false, light: [300, -100], content: (gg, w, h) => K.refundLetter(gg, w, h, { mark: 1 }) }); return c; });
  const stView = (t) => { const u = qio(lin(A.t605 + .1, A.health - .05, t)), s = mix(2.6, 2.05, u), cx = mix(193, 175, u), cy = mix(311, 190, u), slide = xin(lin(A.t606 - .02, A.t606 + .7, t)), ru = qio(lin(A.t605, A.t605 + .8, t)), t0 = Math.max(t, A.t605);
    return { s, cx, cy, x: 960 + drift(t0, 6, 1) - 2400 * slide, y: 540 + drift(t0, 4, 2) + 120 * slide, rot: mix(LETTERS[1].rot + .006 * Math.sin(A.t605 * .8 + 1), -.03, ru) - .12 * slide }; };
  function drawStatement(ctx, t) {
    const v = stView(t), B = bigLetter(), k = 2.6;
    ctx.save(); ctx.translate(v.x, v.y); ctx.rotate(v.rot); ctx.scale(v.s / k, v.s / k); ctx.translate(-v.cx * k, -v.cy * k);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 60; ctx.shadowOffsetX = 30; ctx.shadowOffsetY = 40; ctx.fillStyle = '#000'; ctx.fillRect(10, 10, 380 * k - 20, 500 * k - 20); ctx.restore();
    ctx.drawImage(B, 0, 0);
    ctx.scale(k, k);
    const hu = xout(lin(A.health - .02, A.health + .5, t)), lu = qio(lin(A.health + .25, A.healthE + .35, t));
    if (hu > 0) { ctx.strokeStyle = 'rgba(214,120,30,.95)'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(72, 57); ctx.lineTo(72 + 168 * hu, 57); ctx.stroke(); }
    if (lu > 0) { ctx.save(); ctx.strokeStyle = 'rgba(214,120,30,.85)'; ctx.lineWidth = 1.3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(150, 62); const pts = [[150, 62], [150, 180], [300, 230], [300, 290]]; let L = 0; const tot = 118 + 158 + 60, goal = tot * lu; ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (L + d <= goal) { ctx.lineTo(...pts[i]); L += d; } else { const q = (goal - L) / d; ctx.lineTo(mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)); break; } } ctx.stroke(); ctx.restore(); }
    const gp = new Path2D(); gp.rect(22, 294, 336, 34); foilGlint(ctx, gp, (t - A.t605) * .9, { x: -100, y: 311, span: 600, width: 60, speed: .5, a: .6 });
    ctx.restore();
  }
  function d605(ctx, t) {
    ctx.drawImage(K.tableWarm('table606', ['#2b211b', '#16110e', '#070505'], [1550, 40]), -200, -150);
    const ba = 1 - sm(lin(A.t605 + .05, A.t605 + .9, t));
    if (ba > 0) { const pt = pushT(A.t605), cam = swCam(A.t605); ctx.save(); ctx.globalAlpha = ba; ctx.translate(pt.Q[0], pt.Q[1]); ctx.scale(pt.k, pt.k); ctx.translate(-pt.P[0], -pt.P[1]); ctx.drawImage(K.swissMorning(), -150 + cam.dx * .25, -100 + cam.dy * .25); ctx.restore(); }
    drawStatement(ctx, t);
    K.vignette(ctx, .4, W * .5, H * .5, '10,8,6');
  }
  // ---------------- 6.06 Anthropic's plan mentions "direct distributions to specific populations." ----------------
  const QW = T.W('06a', 'direct', 'populations').map((w, i, a) => ({ ...w, w: w.w.replace(/["“”]/g, '') + (i === a.length - 1 ? '”' : '') }));
  const QSIZE = 58, QWRAP = 560;   // wraps before “specific”: the second line is exactly “specific populations.”
  const Q = (() => {   // replicate quoteCard2's layout to know where "specific populations" sits on the card (card units, centred)
    const [, mx] = canvas(8, 8); mx.font = `${QSIZE}px "Instrument Serif"`; const sp = mx.measureText(' ').width, lines = [[]]; let x = 0;
    for (const wd of QW) { const ww = mx.measureText(wd.w).width; if (x > 0 && x + ww > QWRAP) { lines.push([]); x = 0; } lines[lines.length - 1].push({ ...wd, x, ww }); x += ww + sp; }
    const meta = ['Plan', '“Investing in the public benefit”', '18 Oct 2026'].join('  ·  ').toUpperCase(); mx.font = '600 15px Inter'; const metaW = mx.measureText(meta).width + meta.length * 2.5; mx.font = '32px "Instrument Serif"'; const nameW = mx.measureText('Anthropic').width;
    const lh = QSIZE * 1.22, textH = lines.length * lh, cw = Math.max(640, ...lines.map((L) => L.length ? L[L.length - 1].x + L[L.length - 1].ww : 0), metaW, nameW) + 180, ch = textH + 84 + 160;
    let li = lines.findIndex((L) => L.some((w) => /^specific/i.test(w.w))); if (li < 0) li = lines.length - 1;
    const L = lines[li], i0 = L.findIndex((w) => /^specific/i.test(w.w)), a = L[i0], b = L[L.length - 1];
    const ux = 90 + (a.x + b.x + b.ww) / 2 - cw / 2, uy = 80 + QSIZE + li * lh + 11 - ch / 2, width = b.x + b.ww - a.x;
    return { ux, uy, width, cw, ch };
  })();
  const QROT = -.018, CPOS = Cout.pos(Cout.t - .8);
  const QC = (() => { const c = Math.cos(QROT), s = Math.sin(QROT); return [CPOS.x - (Q.ux * c - Q.uy * s), CPOS.y - (Q.ux * s + Q.uy * c)]; })();
  function d606(ctx, t) {
    const p0 = Cout.pos(Cout.t - .8), p = t > Cout.t - .8 ? Cout.pos(t) : p0, k = p.s / p0.s * mix(.93, 1, sm(lin(A.t606, Cout.t - .8, t))), dx = drift(t, 5, 1) * (1 - lin(Cout.t - 1.2, Cout.t - .8, t)), dy = drift(t, 4, 2) * (1 - lin(Cout.t - 1.2, Cout.t - .8, t));
    ctx.save(); ctx.translate(p.x + dx, p.y + dy); ctx.scale(k, k); ctx.translate(-p0.x, -p0.y);
    ctx.drawImage(K.tableWarm('table606', ['#2b211b', '#16110e', '#070505'], [1550, 40]), -200, -150);
    quoteCard2(ctx, t, { words: QW, name: 'Anthropic', role: 'Plan', source: '“Investing in the public benefit”', date: '18 Oct 2026', hi: ['specific', 'populations'], x: QC[0], y: QC[1], w: QWRAP, size: QSIZE, paper: true, rot: QROT, t0: A.t606 - 1.6, t1: Cout.t + 3, seed: 21 });
    // the highlight sweeps under "specific populations" (it becomes the register's carrier line at Cout.t − .8)
    const hu = xout(lin(A.specific - .02, A.specific + .65, t));
    if (hu > 0 && t < Cout.t - .8) { ctx.save(); ctx.beginPath(); ctx.rect(p0.x - 260 * p0.s, p0.y - 40, 520 * p0.s * hu, 80); ctx.clip(); drawCarrier(ctx, 'line', p0.x, p0.y, p0.s, 0, t, { a: 1 }); ctx.restore(); }
    ctx.restore();
    if (t >= Cout.t - .8 && t < Cout.t + .5) Cout.draw(ctx, t);
    if (t < A.t606 + .8) drawStatement(ctx, t);
    K.motes(ctx, t, { a: .5, n: 40, seed: 33 });
    K.vignette(ctx, .5, W * .55, H * .45, '8,6,4');
  }

  // ======================= the shot list =======================
  const mgPrint = { riso: .25, halftone: .45, hatch: .5 };
  return [
    { id: '5.07', t: Cin.into.t, tr: Cin.into.tr, x: Cin.into.x, y: Cin.into.y, d: Cin.into.d, draw: d507, print: mgPrint },
    { id: '5.08', t: A.oai, tr: 'cut', d: .1, draw: d508, print: mgPrint },
    { id: '5.10', t: A.pan0 + .52, tr: 'cut', d: .1, draw: d510, print: mgPrint, sound: [{ f: 'shimmer_rings', t: A.out0 + .05, v: .3 }] },
    { id: '5.16a', t: A.iris, tr: 'iris', x: P2[0], y: P2[1], r: RINGS[2] * 1.42, d: .8, draw: d516a, print: { riso: .3 } },
    { id: '5.16b', t: A.only, tr: 'cut', d: .1, draw: d516b, print: { riso: .3 }, sound: [{ f: 'foil_glint', t: A.lift0 + .05, v: .35 }] },
    { id: '6.01', t: A.cut601, tr: 'cut', d: .1, draw: d601, sound: [{ f: 'stamp', t: A.harvest + .02, v: .28 }] },
    { id: '6.02', t: A.t602, tr: 'cut', d: .1, draw: d602 },
    { id: '6.03', t: A.cut603, tr: 'cut', d: .1, draw: d603, print: { riso: .3, hatch: .4 } },
    { id: '6.04', t: A.t604, tr: 'cut', d: .1, draw: d604, print: { riso: .3, hatch: .35, vig: .3 } },
    { id: '6.05', t: A.t605, tr: 'cut', d: .1, draw: d605, print: { riso: .3, hatch: .35 } },
    { id: '6.06', t: A.t606, tr: 'cut', d: .1, draw: d606, sound: [{ f: 'pages', t: A.t606 + .05, v: .3 }] },
  ];
};
