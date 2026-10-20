// Chunk C9 · §6 harvest: "no one picks", the border, where the world stands · shots 6.07–6.19 (bild/shots.md v2) · builder c09
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// PLAN (gate 1). Times are VO anchors (T.S/T.E/word), never seconds. No ★ in C9. 14 MG shots in the share-certificate language.
//  shot  │ words (accent)                                   │ hero onset                                       │ carrier into the next shot                 │ in
//  6.07  │ But someone would have to **pick** them.          │ c08's amber line lands as one row of an endless  │ the hand withdraws (same set)              │ zoom (carrier 'line')
//        │                                                    │ list; a pointing hand wanders, taps "pick"       │                                            │
//  6.08  │ An equal share needs **no one** to pick.          │ every row lights at once; the lights lift        │ the lights rise → camera tilts up          │ cut (plan seq.)
//  6.09  │ No **board**, no **government**, no **algorithm** │ 11 lights hover; three engraved deciders appear  │ the lights fall onto the people → tilt down│ up
//        │ decides who **deserves** it.                      │ and smoke away; the lights fall evenly on 11     │                                            │
//  6.10  │ This share wouldn't stop at a **border**.         │ a light glides Nairobi → Dodoma; the microtext   │ the light speeds off → whip                │ down
//        │                                                    │ BORDER parts like water and lets it through      │                                            │
//  6.11  │ So far, most plans in the headlines **do**.       │ three headline cards slide south and bump at the │ push into the cards                        │ whipR
//        │                                                    │ US–Mexico border; "USA ONLY" glows; tiny certs   │                                            │
//  6.12  │ A first step is being **negotiated** at the UN.   │ Nairobi table, papers passed; title + dates      │ a sheet is pushed off to the right         │ zoom
//  6.12a │ Countries could tax **digital** services … **AI** │ a phone in Nairobi; a guilloche thread to a far  │ the tax coin lands → whip                  │ left
//        │ included, even when the company sits **elsewhere**│ tower; pull back to the world; the tax returns   │                                            │
//  6.13  │ The United States has **left** the talks.         │ close on the empty chair; the placard tips over  │ camera tilts down                          │ whipR
//  6.14  │ The accounts already **exist**. **Four in five**… │ five hands, five phones: account cards; four glow│ (same set)                                 │ down
//  6.15  │ But nobody pays every human on Earth **yet**.     │ a dotted ghost share waits in every screen       │ push into the middle screen's ghost share  │ cut (plan seq.)
//  6.16  │ The pledges depend on **boards** and **billionaires**│ two PROMISE sheets (perforated) hang from a    │ both are pulled up and out                 │ zoom
//        │                                                    │ cuff + cufflink hand and a signet hand           │                                            │
//  6.17  │ And there's **no global fund** to **fill** those …│ the glass fund draws itself as a ghost; dotted   │ (same set)                                 │ cut (plan seq.)
//        │                                                    │ pipes reach for five dark phones and end short   │                                            │
//  6.18  │ That's exactly what we still have to **agree** on.│ camera glides to the plaque; the pen touches down│ the pen hovers through the pause           │ cut (plan seq.)
//  6.19  │ So picture the day we **do**.                     │ the pen signs; light ignites at the end of the   │ c09>c10 'thread' streams out right → whipR │ cut (plan seq.)
//        │                                                    │ line and runs right; the burin engraves it solid │                                            │
// Carrier chain: c08>c09 'line' (zoom) → row highlight · lights rise (up) · lights fall (down) onto the map light · light speeds off (whipR)
//                · push into cards (zoom) · sheet pushed right (left) · coin lands, whip (whipR) · tilt down (down) · push into the ghost
//                share (zoom) · one plan sequence 6.16–6.19 · c09>c10 'thread' (whipR).
// Sound (image-caused, in pauses only): chime as the lights land (after "deserves it."), card as the headlines bump (after "do."),
//       card as the placard lies flat (after "talks."). Whooshes come with the transitions.
// Shared helpers used read-only: carry, certificate (ring, microPath-style text, rosette), ghost, perforate, paper, share, figure, phone,
// glassfund (ghost mode + burin). Copies: lib/sc09_hand.mjs (hand.mjs + point/pinch/cuff/signet), lib/sc09_map.mjs (map.mjs night sheet → day).
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { carry } from '../lib/carry.mjs';
import { rosette, ring } from '../lib/certificate.mjs';
import { ghostLine, ghostPaths } from '../lib/ghost.mjs';
import { perforateText } from '../lib/perforate.mjs';
import { pen, sigLine, scribble, paperSheet } from '../lib/paper.mjs';
import { shareLight } from '../lib/share.mjs';
import { figureFlat, figureKid, handPos } from '../lib/figure.mjs';
import { heldPhone } from '../lib/phone.mjs';
import { glassFund } from '../lib/glassfund.mjs';
import { stipple } from '../lib/art.mjs';
import { daySheet, drawDay, toView, borderLine, ll } from '../lib/sc09_map.mjs';
import { hand, handTip } from '../lib/sc09_hand.mjs';

const TAU = Math.PI * 2;
const eo5 = (x) => 1 - Math.pow(1 - clamp(x), 5);                  // expo-ish out (entrances, landings)
const ei5 = (x) => Math.pow(clamp(x), 4);                          // expo-ish in (exits)
const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const AMBER = '#ffb35c', CORE = '#fff1d6', CREAM = '#f3efe2', INK = '#1f2a3a', GOLD = '#f0a04b', OCHRE = '#c98a3c', PEACH = '#f5b08a', NIGHT = '#0d1530';
const SKINS = ['#e9c2a0', '#c99a74', '#a8734f', '#7a4f33', '#5a3a26', '#f1d3b8'];

// ---------- small shared looks ----------
function label(ctx, s, x, y, a, o = {}) { if (a <= 0) return; text(ctx, s, x, y + (1 - a) * 10, { size: o.size ?? 20, weight: o.weight ?? 600, color: o.col ?? CREAM, spacing: o.spacing ?? 5, alpha: a * (o.a ?? 1), align: o.align ?? 'left', font: o.font ?? 'Inter' }); }
function serif(ctx, s, x, y, a, o = {}) { if (a <= 0) return; text(ctx, s, x, y + (1 - a) * 14, { size: o.size ?? 56, font: 'Instrument Serif', weight: 400, color: o.col ?? CREAM, alpha: a * (o.a ?? 1), align: o.align ?? 'left' }); }
function vignette(ctx, a = .5, x = W / 2, y = H / 2, r0 = 420, r1 = 1250) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); g.addColorStop(0, 'rgba(3,4,12,0)'); g.addColorStop(1, `rgba(3,4,12,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function motes(ctx, t, seed, n, a, col = '255,226,190', box = [0, 0, W, H]) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const x0 = r() * box[2], y0 = r() * box[3], sp = 4 + r() * 10, ph = r() * TAU, sz = .8 + r() * 1.8;
    const x = box[0] + ((x0 + t * sp) % box[2] + box[2]) % box[2], y = box[1] + ((y0 - t * sp * .4 + Math.sin(t * .5 + ph) * 12) % box[3] + box[3]) % box[3];
    ctx.fillStyle = `rgba(${col},${a * (.4 + .6 * Math.sin(t * 1.3 + ph) ** 2)})`; ctx.beginPath(); ctx.arc(x, y, sz, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function glowDot(ctx, x, y, r, a, col = AMBER) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, x, y, r, a, col, CORE); ctx.restore(); }
function bgCached(key, draw) { return once(key, () => { const [c, g] = canvas(W, H); draw(g, c); return c; }); }
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
function polyLen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
function alongPoly(p, s) { // point + angle at arc length s
  for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (s <= d || i === p.length - 1) { const q = d ? clamp(s / d) : 0; return [mix(p[i - 1][0], p[i][0], q), mix(p[i - 1][1], p[i][1], q), Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0])]; } s -= d; }
  return [p[0][0], p[0][1], 0];
}
const ltr = (p) => (p[p.length - 1][0] < p[0][0] ? p.slice().reverse() : p);
function smoothPoly(p, n = 3) { let q = p; for (let k = 0; k < n; k++) { const o = [q[0]]; for (let i = 1; i < q.length - 1; i++) o.push([(q[i - 1][0] + 2 * q[i][0] + q[i + 1][0]) / 4, (q[i - 1][1] + 2 * q[i][1] + q[i + 1][1]) / 4]); o.push(q[q.length - 1]); q = o; } return q; }
// letters along a line that can part like water around a point (6.10, 6.11): o { size, gap (px), at (arc length of the parting), col, a, glow }
function lettersAlong(ctx, p, str, o = {}) {
  const L = polyLen(p), size = o.size ?? 15, step = size * .78, rep = str + '   ', n = Math.floor(L / step);
  ctx.save(); ctx.font = `600 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    let s = (i + .5) * step; const ch = rep[i % rep.length]; if (ch === ' ') continue;
    let push = 0, lift = 0;
    if (o.gap && o.at != null) { const d = s - o.at, f = Math.exp(-Math.pow(d / (o.spread ?? 90), 2)); push = Math.sign(d || 1) * o.gap * f; lift = o.gap * .35 * f; }
    const [x, y, ang] = alongPoly(p, clamp(s + push, 0, L)), nx = -Math.sin(ang), ny = Math.cos(ang);
    ctx.save(); ctx.translate(x + nx * lift * (o.side ?? 1), y + ny * lift * (o.side ?? 1)); ctx.rotate(ang + (Math.abs(ang) > Math.PI / 2 ? Math.PI : 0));
    if (o.glow > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(AMBER, .5 * o.glow); ctx.fillText(ch, 0, 0); ctx.globalCompositeOperation = 'source-over'; }
    if (o.halo) { ctx.strokeStyle = o.halo; ctx.lineWidth = size * .28; ctx.lineJoin = 'round'; ctx.strokeText(ch, 0, 0); }
    ctx.fillStyle = rgba(o.col || INK, o.a ?? .85); ctx.fillText(ch, 0, 0); ctx.restore();
  }
  ctx.restore();
}

export default (T, R) => {
  const CIN = carry('c08>c09', T, R), COUT = carry('c09>c10', T, R);
  const S = (seg, ph, n) => T.S(seg, ph, n), E = (seg, ph, n) => T.E(seg, ph, n);
  const wd = (seg, ph, k = -1, n) => { const f = T.S(seg, ph, n), ws = T.words.filter((w) => w.s >= f - 1e-3), m = ph.split(' ').length; return ws[k < 0 ? m + k : k]; };
  const after = (seg, ph, n) => { const e = T.E(seg, ph, n); return T.words.find((w) => w.s > e + 1e-3); };
  // ---- anchors ----
  const A = {
    someone: S('06a', 'But someone would'), pick: wd('06a', 'to pick them').s, pickE: E('06a', 'to pick them'),
    s608: S('06a', 'An equal share'), noone: S('06a', 'no one to pick'), pick2E: E('06a', 'no one to pick'),
    s609: S('06a', 'No board'), board: wd('06a', 'No board').s, gov: wd('06a', 'no government').s, algo: wd('06a', 'no algorithm').s,
    decides: wd('06a', 'algorithm decides').s, deserves: wd('06a', 'who deserves').s, s609E: E('06a', 'deserves it'),
    s610: S('06b', 'This share'), border: wd('06b', 'stop at a border').s, borderE: E('06b', 'stop at a border'),
    s611: S('06b', 'So far'), headlines: wd('06b', 'the headlines').s, do1: wd('06b', 'headlines do').s, do1E: E('06b', 'headlines do'),
    s612: S('06b', 'A first step'), negotiated: wd('06b', 'being negotiated').s, nations: wd('06b', 'United Nations').s, unE: E('06b', 'United Nations'),
    s612a: S('06b', 'Countries could'), tax: wd('06b', 'could tax').s, digital: wd('06b', 'tax digital').s, use: wd('06b', 'people use').s, ai: S('06b', 'AI included'),
    included: wd('06b', 'AI included').s, even: S('06b', 'even when'), elsewhere: wd('06b', 'sits elsewhere').s, elsewhereE: E('06b', 'sits elsewhere'),
    s613: S('06b', 'The United States has'), left: wd('06b', 'has left').s, talksE: E('06b', 'left the talks'),
    s614: S('06b', 'The accounts'), exist: wd('06b', 'already exist').s, four: S('06b', 'Four in five'), phone: wd('06b', 'their phone').s, phoneE: E('06b', 'their phone'),
    s615: S('06b', 'But nobody pays'), every: wd('06b', 'pays every').s, yet: wd('06b', 'Earth yet').s, yetE: E('06b', 'Earth yet'),
    s616: S('06b', 'The pledges'), boards: wd('06b', 'on boards').s, bill: wd('06b', 'and billionaires').s, billE: E('06b', 'and billionaires'),
    s617: after('06b', 'and billionaires').s, nofund: S('06b', 'no global fund'), fund: wd('06b', 'global fund').s, fill: wd('06b', 'to fill').s, accounts: wd('06b', 'those accounts').s, accountsE: E('06b', 'those accounts'),
    s618: after('06b', 'those accounts').s, agree: wd('06b', 'to agree').s, agreeE: E('06b', 'agree on'),
    s619: S('07a', 'So picture'), picture: wd('07a', 'So picture').s, day: wd('07a', 'the day').s, do2: wd('07a', 'we do').s,
  };
  const TT = {
    s607: CIN.into.t, s608: A.s608 - .05, s609: A.pick2E + .22, s610: A.s609E + .55, s611: A.borderE + .4, s612: A.do1E + .4,
    s612a: A.unE + .14, s613: A.elsewhereE + .16, s614: A.talksE + .7, s615: A.s615 - .05, s616: A.yetE + .04,
    s617: A.s617 - .04, s618: A.s618 - .04, s619: A.s619 - .04, end: COUT.t,
  };

  // ════════════════ LIST (6.07, 6.08) · an endless list of people in perspective ════════════════
  // rows on a tilted sheet: depth v, q = d0/(d0+v); the c08 carrier line lands as the underline of row 0 (y 520, q .5, ±260 px).
  const LV = { cx: 960, yH: -40, yN: 1080, d0: 1300, fy: .6, gap: 112, sk: .07 };
  const lq = (v) => LV.d0 / (LV.d0 + v);
  const lpt = (v, U) => { const q = lq(v); return [LV.cx + (U + LV.sk * (v - LV.d0)) * q, LV.yH + (LV.yN - LV.yH) * q, q]; };
  const ROWS = []; for (let k = -12; k <= 56; k++) ROWS.push(k);
  const rowSprite = (i) => once('row' + (i % 9), () => {
    const [c, g] = canvas(1180, 96); g.translate(590, 70); const r = prng(40 + i % 9);
    g.strokeStyle = rgba(INK, .22); g.lineWidth = 1.4; g.beginPath(); g.moveTo(-580, 2); g.lineTo(580, 2); g.stroke();
    // a faceless portrait (head + round shoulders)
    g.fillStyle = rgba(INK, .62); g.beginPath(); g.ellipse(-528, -38, 11, 13, 0, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(-552, -6); g.bezierCurveTo(-552, -22, -542, -26, -528, -26); g.bezierCurveTo(-514, -26, -504, -22, -504, -6); g.closePath(); g.fill();
    scribble(g, -486, -22, 230 + r() * 90, 26, { seed: 11 + i * 7, ink: '#2a2433', lw: 2.3 });
    scribble(g, -150, -20, 90 + r() * 60, 15, { seed: 5 + i * 3, ink: '#4a4250', lw: 1.5 });
    g.fillStyle = rgba(INK, .4); for (let x = 30; x < 420; x += 10) { g.beginPath(); g.arc(x, -10, 1.3, 0, TAU); g.fill(); }
    rr(g, 448, -44, 40, 40, 4); g.strokeStyle = rgba(INK, .8); g.lineWidth = 2.6; g.stroke();
    return c;
  });
  const listBg = () => bgCached('listbg', (g, c) => {
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#07060a'); bg.addColorStop(1, '#1a120e'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const r = prng(3); g.lineCap = 'round'; for (let i = 0; i < 160; i++) { const y = r() * H; g.strokeStyle = `rgba(110,72,48,${.04 + r() * .06})`; g.lineWidth = .6 + r() * 2; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(W * .3, y + 6, W * .6, y - 6, W, y + 3); g.stroke(); }
    // the long sheet
    const L = [], Rr = []; for (let v = -500; v < 30000; v += v < 2000 ? 100 : 1000) { L.push(lpt(v, -610)); Rr.push(lpt(v, 610)); }
    g.beginPath(); L.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); for (let i = Rr.length - 1; i >= 0; i--) g.lineTo(Rr[i][0], Rr[i][1]); g.closePath();
    g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 40; g.shadowOffsetY = 18; g.fillStyle = '#e9dfc6'; g.fill(); g.restore();
    g.save(); g.clip(); const pg = g.createLinearGradient(0, H, 0, 0); pg.addColorStop(0, '#f1e7cf'); pg.addColorStop(.55, '#d9ccad'); pg.addColorStop(1, '#5b5244'); g.fillStyle = pg; g.fillRect(0, 0, W, H);
    // a margin rule and the ledger's red double line
    for (const U of [-575, -560]) { const a = lpt(-500, U), b = lpt(30000, U); g.strokeStyle = 'rgba(160,60,50,.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    g.restore();
    stipple(c, { k: .4, g: 1, seed: 9, mid: false, boost: 1 });
  });
  const lampPool = () => bgCached('listlamp', (g) => { const lg = g.createRadialGradient(1060, 500, 0, 1060, 500, 1000); lg.addColorStop(0, 'rgba(255,190,120,.34)'); lg.addColorStop(.5, 'rgba(255,160,90,.08)'); lg.addColorStop(1, 'rgba(255,150,80,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H);
    const dg = g.createLinearGradient(0, 0, 0, H * .55); dg.addColorStop(0, 'rgba(6,5,10,.62)'); dg.addColorStop(1, 'rgba(6,5,10,0)'); g.fillStyle = dg; g.fillRect(0, 0, W, H); });
  // the pointing hand: its fingertip follows a wandering path over the checkbox column and taps row 0 on "pick"
  const HO = { pose: 'point', ang: 2.05, skin: SKINS[1], sleeve: '#2b3150', rim: '#ffd9a0', sleeveLen: 420 };
  const tipOff = handTip(0, 0, 2.2, HO);
  const boxAt = (k, v0 = 0) => { const v = LV.d0 + k * LV.gap - v0, [x, y, q] = lpt(v, 468); return [x, y - 24 * q * LV.fy, q]; };
  const tipPath = (t) => {
    const b0 = boxAt(0), b3 = boxAt(4), bn = boxAt(-3);
    const keys = [[CIN.t - .9, 1560, -120], [CIN.t - .1, b3[0] + 40, b3[1] - 40], [A.someone + .5, bn[0] + 30, bn[1] - 30], [A.pick - .3, b0[0] + 14, b0[1] - 34], [A.pick, b0[0], b0[1]], [A.pick + .3, b0[0] + 40, b0[1] - 80], [A.s608 + .1, b0[0] + 60, b0[1] - 110], [A.s608 + .95, 2050, -420]];
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const a = keys[i], b = keys[i + 1], u = clamp((t - a[0]) / (b[0] - a[0])), e = i === keys.length - 2 ? ei5(u) : i === 0 ? eo5(u) : qio(u);
    return [mix(a[1], b[1], e) + drift(t, 5, 1) * (1 - Math.exp(-Math.abs(t - A.pick) * 3)), mix(a[2], b[2], e) + drift(t, 4, 2) * (1 - Math.exp(-Math.abs(t - A.pick) * 3))];
  };
  function listFrame(ctx, t) {
    const push = 1 + .05 * sm(lin(CIN.t + 1, A.pick2E + .5, t)), da = clamp((t - CIN.t - .9) / 1.2);
    ctx.save(); ctx.translate(960, 520); ctx.scale(push, push); ctx.translate(-960 + drift(t, 6, 3) * da, -520 + drift(t, 4, 4) * da);
    ctx.drawImage(listBg(), 0, 0);
    const lit = eo5(lin(A.noone - .02, A.noone + .25, t)), rise = (k) => ei5(lin(A.pick2E - .25 + (((k * 37) % 11) / 11) * .12, TT.s609 + .45, t));
    // rows, far to near
    for (let j = ROWS.length - 1; j >= 0; j--) {
      const k = ROWS[j], v = LV.d0 + k * LV.gap; if (v < -460) continue; const [x, y, q] = lpt(v, 0); if (y < -30 || y > H + 60) continue;
      ctx.save(); ctx.translate(x, y); ctx.scale(q, q * LV.fy); ctx.globalAlpha = clamp(q * 3.2 - .25); ctx.drawImage(rowSprite(k + 20), -590, -70); ctx.restore();
    }
    // row 0: the highlight (the c08 line) and the check on "pick"
    const hl = 1 - .65 * lit;
    if (t >= CIN.t + 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const [w, al] of [[14, .08], [5, .25], [1.6, .95]]) { ctx.strokeStyle = rgba(w > 2 ? AMBER : CORE, al * hl); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(700, 520); ctx.lineTo(1220, 520); ctx.stroke(); } ctx.restore(); }
    else CIN.draw(ctx, t);
    { const ck = eo5(lin(A.pick, A.pick + .22, t)), b0 = boxAt(0); if (ck > 0) { const s = b0[2] * 40, p = [[b0[0] - s * .32, b0[1] - s * .02], [b0[0] - s * .08, b0[1] + s * .22], [b0[0] + s * .42, b0[1] - s * .38]];
      ctx.save(); ctx.strokeStyle = rgba('#b0451f', .95 * (1 - lit)); ctx.lineWidth = 4.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); const L = polyLen(p) * ck; let acc = 0; ctx.moveTo(p[0][0], p[0][1]);
        for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + d <= L) ctx.lineTo(p[i][0], p[i][1]); else { const q = (L - acc) / d; ctx.lineTo(mix(p[i - 1][0], p[i][0], q), mix(p[i - 1][1], p[i][1], q)); break; } acc += d; }
        ctx.stroke(); ctx.restore();
        const fl = Math.exp(-Math.pow((t - A.pick - .05) / .12, 2)); glowDot(ctx, b0[0], b0[1], 60, .5 * fl + .25 * ck * (1 - lit)); } }
    // "no one": every box lights at once; then the lights lift and rise
    if (lit > 0) for (let j = ROWS.length - 1; j >= 0; j--) {
      const k = ROWS[j], v = LV.d0 + k * LV.gap; if (v < -460) continue; const [x, y, q] = boxAt(k); if (y < -40 || y > H + 40) continue;
      const up = rise(k), yy = y - up * (900 + q * 500), xx = x + up * (k % 3 - 1) * 40;
      if (up < .9 && q > .3) glowDot(ctx, xx, yy, 70 * q, .16 * lit * clamp((q - .3) * 4) * (1 - up));
      shareLight(ctx, xx, yy, 22 * q + 4, t, { a: clamp((q - .2) * 4) * lit, born: A.noone - .02 });
      if (up > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(AMBER, .25 * up); ctx.lineWidth = 3 * q + 1; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 140 * up); ctx.stroke(); ctx.restore(); }
    }
    ctx.drawImage(lampPool(), 0, 0);
    // the hand and its shadow
    if (t < A.s608 + 1) {
      const [tx, ty] = tipPath(t), tap = Math.exp(-Math.pow((t - A.pick) / .14, 2)), s = 2.2 - .06 * tap, wx = tx - tipOff[0] * s / 2.2, wy = ty - tipOff[1] * s / 2.2;
      const sh = 1 - tap * .7; ctx.save(); ctx.globalAlpha = .35; ctx.filter = 'blur(14px)'; ctx.fillStyle = '#0a0606'; ctx.beginPath(); ctx.ellipse(wx + 60 + 40 * sh, wy + 70 + 60 * sh, 140, 60, -.9, 0, TAU); ctx.fill(); ctx.filter = 'none'; ctx.restore();
      hand(ctx, wx, wy, s, { ...HO, t });
    }
    ctx.restore();
    vignette(ctx, .45, 1000, 560);
  }

  // ════════════════ DECIDERS (6.09) · lights above, people below, three deciders smoke away ════════════════
  const PX = Array.from({ length: 11 }, (_, i) => 150 + i * 162 + (i % 2 ? 6 : -6));
  const PEOPLE = PX.map((x, i) => ({ x, kid: i === 2 || i === 5 || i === 9, skin: SKINS[(i * 4 + 1) % SKINS.length], acc: [GOLD, '#c8442f', PEACH, OCHRE, '#8fb3c9', '#d9824a'][i % 6], flip: i > 5, s: 1.28 + ((i * 7) % 5) * .03 }));
  const decBg = () => bgCached('decbg', (g, c) => {
    const bg = g.createRadialGradient(960, 120, 0, 960, 300, 1300); bg.addColorStop(0, '#2a2f5a'); bg.addColorStop(.45, '#121a3a'); bg.addColorStop(1, '#060915'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    rosette(g, 960, 520, { R: 420, A: 60, B: 26, n: 44, m: 13, lines: 50, col: '#b4bfe8', w: .55, a: .018 });
    const fl = g.createLinearGradient(0, 900, 0, H); fl.addColorStop(0, 'rgba(240,160,75,0)'); fl.addColorStop(.3, 'rgba(240,160,75,.10)'); fl.addColorStop(1, 'rgba(10,8,20,.6)'); g.fillStyle = fl; g.fillRect(0, 900, W, H - 900);
    stipple(c, { k: .45, g: 1, seed: 21, mid: false, boost: 1 });
  });
  const EMB = {
    board: (() => { const L = []; L.push([[-52, -112], [52, -112], [58, -100], [58, 6], [-58, 6], [-58, -100], [-52, -112]]);
      L.push([[-74, 8], [74, 8], [64, 40], [-64, 40], [-74, 8]]); L.push([[-58, 40], [-66, 104]]); L.push([[58, 40], [66, 104]]); L.push([[0, 40], [0, 92]]); L.push([[-48, 104], [48, 104]]);
      L.push([[-74, -30], [-90, -30], [-90, 8]]); L.push([[74, -30], [90, -30], [90, 8]]); return L; })(),
    government: (() => { const L = [[[-118, -52], [0, -116], [118, -52], [-118, -52]], [[-112, -52], [112, -52], [112, -36], [-112, -36], [-112, -52]]];
      for (const x of [-84, -42, 0, 42, 84]) { L.push([[x - 10, -36], [x - 10, 70]]); L.push([[x + 10, -36], [x + 10, 70]]); }
      L.push([[-120, 70], [120, 70]]); L.push([[-132, 86], [132, 86]]); L.push([[-144, 102], [144, 102]]); return L; })(),
    algorithm: (() => { const L = []; const el = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU; el.push([Math.cos(a) * 104, -84 + Math.sin(a) * 22]); } L.push(el);
      L.push([[-104, -84], [-20, 28], [-20, 92]]); L.push([[104, -84], [20, 28], [20, 92]]);
      const N = [[-50, -60], [10, -66], [60, -54], [-30, -26], [30, -24], [0, 4]]; for (const [a, b] of [[0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]]) L.push([N[a], N[b]]);
      for (const [x, y] of N) { const c = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU; c.push([x + Math.cos(a) * 7, y + Math.sin(a) * 7]); } L.push(c); }
      L.push([[0, 98], [0, 128]]); L.push([[-8, 118], [0, 130], [8, 118]]); return L; })(),
  };
  const DEC = [['board', 'BOARD', 520, () => A.board], ['government', 'GOVERNMENT', 960, () => A.gov], ['algorithm', 'ALGORITHM', 1400, () => A.algo]];
  const lightY = 200;
  function deciderFrame(ctx, t) {
    ctx.drawImage(decBg(), 0, 0);
    ctx.save(); ctx.translate(drift(t, 5, 7), drift(t, 4, 8));
    // three deciders: engraved (dotted) emblems appear on their word and drift off as smoke
    for (const [key, name, x, tw] of DEC) {
      const w0 = tw(), u = eo5(lin(w0 - .12, w0 + .38, t)), smoke = sm(lin(w0 + .62, w0 + 1.45, t)); if (u <= 0 || smoke >= 1) continue;
      ctx.save(); ctx.translate(x, 480 - 16 * u); const sc = 1.6; ctx.scale(sc, sc);
      ghostPaths(ctx, EMB[key].map((p) => p.map(([a, b]) => [a, b])), { ghost: 1, u, smoke, col: CREAM, w: 2.2 / sc, dot: 7 / sc, a: .95, t, seed: 3, stagger: .3 });
      ctx.restore();
      label(ctx, name, x, 712, u * (1 - smoke), { align: 'center', size: 24, spacing: 9, col: PEACH });
      // the gate it makes between the lights and the people
      ctx.save(); ctx.strokeStyle = rgba(CREAM, .18 * u * (1 - smoke)); ctx.setLineDash([3, 9]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 300, 330); ctx.lineTo(x + 300, 330); ctx.stroke(); ctx.restore();
    }
    // people (feet on a soft floor line); on "deserves" their hands rise to take the light
    const land0 = A.s609E + .04, take = qio(lin(A.deserves + .3, land0 + .1, t));
    PEOPLE.forEach((p, i) => {
      const k = clamp(take - (i % 3) * .05), pose = { sh: [mix(.18, .62, k), mix(.08, .5, k)], el: [mix(.32, 1.15, k), mix(.26, 1.2, k)], head: mix(-.12, .2, k) };
      const fy = 952, hip = p.kid ? fy - 66 * p.s : fy - 96 * p.s;
      if (p.kid) figureKid(ctx, p.x, hip, p.s * 1.05, pose, { t, seed: i + 3, accent: p.acc, flip: p.flip, dress: { skin: p.skin } });
      else figureFlat(ctx, p.x, hip, p.s, pose, { t, seed: i + 3, col: '#20253f', rim: '#ffcf9a', rimSide: 1, accent: p.acc, accentPart: 'sweater', skin: p.skin, flip: p.flip, fast: true });
    });
    // the lights: rise in from below (6.08 carrier), hover, fall evenly on "deserves"
    PEOPLE.forEach((p, i) => {
      const inK = eo5(lin(TT.s609 - .3 + i * .045, TT.s609 + .75 + i * .045, t)), fall = Math.pow(lin(A.deserves, A.s609E + .04, t), 2);
      const k = clamp(qio(lin(A.deserves + .3, A.s609E + .14, t)) - (i % 3) * .05), pose = { sh: [mix(.18, .62, k), mix(.08, .5, k)], el: [mix(.32, 1.15, k), mix(.26, 1.2, k)], head: .2 * k };
      const fy = 952, hip = p.kid ? fy - 66 * p.s : fy - 96 * p.s, [hx, hy] = p.kid ? [p.x + (p.flip ? -14 : 14), hip - 36 * p.s] : handPos(p.x, hip, p.s, pose, 0, p.flip);
      const yHover = lightY + Math.sin(t * 1.4 + i * .9) * 7 + 10 * Math.sin(i * 1.7), y0 = mix(1200, yHover, inK), y = mix(y0, hy - 14, fall), x = mix(mix(1150, p.x, eo5(lin(TT.s609 - .1 + i * .045, TT.s609 + 1.0 + i * .045, t))) + Math.sin(t * .9 + i) * 4, hx, fall);
      const tremble = A.decides < t && t < A.deserves ? Math.sin(t * 40 + i) * 1.6 * sm(lin(A.decides, A.decides + .3, t)) : 0;
      shareLight(ctx, x + tremble, y, 15, t, { a: 1 });
      const L0 = A.s609E + .04, land = Math.exp(-Math.pow((t - L0 - .03) / .12, 2)); if (land > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ring(ctx, x, y, 26 + 30 * clamp((t - L0 + .05) / .5), 9 + 10 * clamp((t - L0 + .05) / .5), { lines: 4, col: AMBER, a: .6 * land, lw: .8 }); ctx.restore(); }
    });
    ctx.restore();
    motes(ctx, t, 31, 40, .25);
    vignette(ctx, .5);
  }

  // ════════════════ MAP · Africa (6.10) · the share crosses the Kenya–Tanzania border ════════════════
  const ccOf = (lon, lat) => { const [x, y] = ll(lon, lat); return { cx: x, cy: y }; };
  const SAF = () => once('saf', () => daySheet({ ...ccOf(37.4, -3.4), z: 19, rot: -.05, tilt: .36 }, { hi: ['KEN', 'TZA'], hiA: .08, seed: 7, lamp: [W * .72 + 90, -20] }));
  const afPts = () => once('afpts', () => { const S0 = SAF(); const P = (lon, lat) => S0.PL(lon, lat).slice(0, 2);
    const brd = ltr(smoothPoly(borderLine(S0, 'KEN', 'TZA'), 4));
    const route = smoothPoly([P(36.82, -1.29), P(36.86, -1.9), P(36.8, -2.55), P(36.68, -3.37), P(36.3, -4.6), P(35.74, -6.17)], 3);
    return { brd, route, nbo: P(36.82, -1.29), cross: P(36.8, -2.55), dod: P(35.74, -6.17), aru: P(36.68, -3.37), ken: P(38.3, -.2), tza: P(34.6, -5.6) }; });
  function africaFrame(ctx, t) {
    const S0 = SAF(), G = afPts(), k = (t - TT.s610), view = { z: 1.02 + .05 * sm(lin(TT.s610 - .4, TT.s611, t)), dx: drift(t, 6, 9) - 40, dy: drift(t, 5, 10) + 30 };
    drawDay(ctx, S0, view); const V = (p) => toView(S0, view, p[0], p[1]);
    // the light's route (screen) and where it crosses
    const route = G.route.map(V), L = polyLen(route), [cx0, cy0] = V(G.cross);
    let dC = 0; { let best = 1e9; for (let s = 0; s <= L; s += 3) { const [x, y] = alongPoly(route, s), d = Math.hypot(x - cx0, y - cy0); if (d < best) { best = d; dC = s; } } }
    const t0 = TT.s610 + .05, tb = A.border, v = dC / (tb - t0) * 1.25;
    const dist = t < tb ? dC * (1 - Math.pow(1 - clamp((t - t0) / (tb - t0)), 1.25) * (1 - 0)) : dC + v * (t - tb) + 520 * Math.pow(Math.max(0, t - tb - .2), 2);
    const dd = clamp(dist, 0, L + 400), [lx, ly] = dd <= L ? alongPoly(route, dd) : (() => { const [x, y, a] = alongPoly(route, L); return [x + Math.cos(a) * (dd - L), y + Math.sin(a) * (dd - L)]; })();
    // the border as microtext, parting like water where the light passes
    const brd = G.brd.map(V), near = (() => { let best = 1e9, sb = 0, acc = 0; for (let i = 1; i < brd.length; i++) { acc += Math.hypot(brd[i][0] - brd[i - 1][0], brd[i][1] - brd[i - 1][1]); const d = Math.hypot(brd[i][0] - cx0, brd[i][1] - cy0); if (d < best) { best = d; sb = acc; } } return sb; })();
    const part = Math.exp(-Math.pow((t - tb) / .5, 2)) * 70 + 20 * Math.exp(-Math.pow(Math.max(0, Math.hypot(lx - cx0, ly - cy0) - 20) / 120, 2)), glowB = .5 * Math.exp(-Math.pow((t - tb) / .5, 2));
    ctx.save(); ctx.strokeStyle = rgba('#6b2f22', .35); ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'multiply'; ctx.beginPath(); brd.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
    lettersAlong(ctx, brd, 'BORDER · BORDER · BORDER · BORDER · BORDER · BORDER · BORDER · BORDER · ', { size: 21, gap: part, at: near, spread: 110, col: '#4a1f18', a: .92, glow: glowB, halo: 'rgba(244,236,214,.85)' });
    // country names, Nairobi
    label(ctx, 'KENYA', ...V(G.ken), .55, { col: '#3a2a26', size: 26, spacing: 22, align: 'center' });
    label(ctx, 'TANZANIA', ...V(G.tza), .55, { col: '#3a2a26', size: 26, spacing: 22, align: 'center' });
    { const [x, y] = V(G.nbo); ctx.fillStyle = rgba(INK, .8); ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); label(ctx, 'NAIROBI', x + 14, y - 10, .8, { col: INK, size: 15, spacing: 4 }); }
    { const [x, y] = V(G.aru); ctx.fillStyle = rgba(INK, .6); ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); label(ctx, 'ARUSHA', x + 12, y + 4, .6, { col: INK, size: 13, spacing: 4 }); }
    // ripple where it passes
    const rk = clamp((t - tb + .05) / 1.1); if (rk > 0 && rk < 1) { ctx.save(); for (let j = 0; j < 3; j++) { const q = clamp(rk * 1.3 - j * .18); if (q <= 0) continue; ring(ctx, cx0, cy0, 20 + 150 * eout(q), 10 + 70 * eout(q), { lines: 3, col: '#7a3b17', a: .55 * (1 - q), lw: 1 }); } ctx.restore(); }
    // trail + the light
    { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let j = 1; j <= 14; j++) { const s2 = clamp(dd - j * 9, 0, L), [x, y] = alongPoly(route, s2); ctx.fillStyle = rgba(AMBER, .16 * (1 - j / 15)); ctx.beginPath(); ctx.arc(x, y, 7 * (1 - j / 18), 0, TAU); ctx.fill(); } ctx.restore(); }
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; const sg = ctx.createRadialGradient(lx + 10, ly + 16, 0, lx + 10, ly + 16, 40); sg.addColorStop(0, 'rgba(60,30,10,.4)'); sg.addColorStop(1, 'rgba(60,30,10,0)'); ctx.fillStyle = sg; ctx.fillRect(lx - 40, ly - 30, 100, 100); ctx.restore();
    shareLight(ctx, lx, ly - 4, 17, t, { a: eo5(lin(TT.s610 - .35, TT.s610 + .2, t)) });
    vignette(ctx, .42, 1000, 520);
  }

  // ════════════════ MAP · USA (6.11) · the headline plans bump at the border ════════════════
  const SUS = () => once('sus', () => daySheet({ ...ccOf(-104.5, 31.2), z: 8.2, rot: -.04, tilt: .4 }, { hi: ['USA'], hiA: .14, seed: 9, lamp: [W * .3 + 90, -40] }));
  const usPts = () => once('uspts', () => { const S0 = SUS(); const brd = ltr(smoothPoly(borderLine(S0, 'USA', 'MEX'), 3)); const r = prng(77), L = polyLen(brd), certs = [];
    for (let i = 0; i < 34; i++) { const [x, y, a] = alongPoly(brd, (i + r() * .8) / 34 * L); certs.push([x - Math.sin(a) * (10 + r() * 26), y - 8 - r() * 22, r() * 1.2 - .6, .7 + r() * .5]); }
    return { brd, certs, usa: S0.PL(-100, 39).slice(0, 2), mex: S0.PL(-102, 24.5).slice(0, 2) }; });
  const CARDS = [
    { h1: 'Sanders bill:', h2: 'an AI fund', meta: 'JUNE 2026 · U.S. ONLY', x: 700, rot: -.07, seed: 3 },
    { h1: 'A $5,000', h2: '“dividend”', meta: 'TRUMP · SEPT 2026 · UNFUNDED', x: 1000, rot: .04, seed: 5 },
    { h1: 'OpenAI floats', h2: 'a citizens’ fund', meta: 'APRIL 2026 · U.S. ONLY', x: 1290, rot: -.03, seed: 8 },
  ];
  const cardImg = (i) => once('card' + i, () => { const c0 = CARDS[i], [c, g] = canvas(330, 200); paperSheet(g, 10, 10, 300, 170, { seed: c0.seed, tone: '#ece3cd', shadow: false, lines: 0 });
    g.fillStyle = rgba(INK, .85); g.fillRect(26, 30, 268, 2); text(g, 'THE DAILY RECORD', 160, 50, { size: 11, weight: 600, color: rgba(INK, .55), spacing: 4, align: 'center' });
    text(g, c0.h1, 28, 98, { size: 34, font: 'Instrument Serif', color: '#1b1820' }); text(g, c0.h2, 28, 134, { size: 34, font: 'Instrument Serif', color: '#1b1820' });
    text(g, c0.meta, 28, 164, { size: 12, weight: 600, color: rgba('#8e2f2a', .9), spacing: 2 }); return c; });
  function usFrame(ctx, t) {
    const S0 = SUS(), G = usPts(), view = { z: 1.03 + .04 * sm(lin(TT.s611 - .3, TT.s612, t)), dx: drift(t, 6, 11), dy: drift(t, 4, 12) - 20 };
    drawDay(ctx, S0, view); const V = (p) => toView(S0, view, p[0], p[1]);
    const brd = G.brd.map(V), hit = A.do1E, bump = Math.exp(-Math.pow((t - hit - .05) / .28, 2)), glowB = sm(lin(hit - .05, hit + .2, t)) * (.6 + .4 * Math.exp(-Math.pow((t - hit) / .4, 2)));
    label(ctx, 'UNITED STATES', ...V(G.usa), .5, { col: '#3a2a26', size: 28, spacing: 26, align: 'center' });
    label(ctx, 'MEXICO', ...V(G.mex), .45, { col: '#3a2a26', size: 24, spacing: 22, align: 'center' });
    // the border glows and reads "USA ONLY"
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; for (const [w, a] of [[16, .1], [6, .25], [2, .7]]) { ctx.strokeStyle = rgba(AMBER, a * glowB); ctx.lineWidth = w; ctx.beginPath(); brd.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); } ctx.restore();
    lettersAlong(ctx, brd.map(([x, y]) => [x, y + 14]), 'USA ONLY · USA ONLY · USA ONLY · USA ONLY · USA ONLY · USA ONLY · ', { size: 13, col: '#5a1f16', a: .45 + .5 * glowB, glow: glowB * .8 });
    // tiny share certificates lying along the border (the shares c01 left at the US border in H.07)
    for (const [x0, y0, a, s] of G.certs) { const [x, y] = toView(S0, view, x0, y0); ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
      ctx.fillStyle = 'rgba(40,20,10,.25)'; ctx.fillRect(-9, -5, 20, 13); ctx.fillStyle = '#f4ecd8'; ctx.fillRect(-10, -7, 20, 13); ctx.strokeStyle = rgba('#7a3b17', .7); ctx.lineWidth = .8; ctx.strokeRect(-8.5, -5.5, 17, 10);
      ctx.fillStyle = rgba(GOLD, .9); ctx.beginPath(); ctx.arc(0, -.5, 2.6, 0, TAU); ctx.fill(); ctx.restore(); }
    // the three headline cards: slide in from the north, push south on "do", bump at the border
    CARDS.forEach((c0, i) => {
      const tin = TT.s611 + .05 + i * .16, inK = eo5(lin(tin, tin + .8, t)), go = ei5(lin(hit - .42, hit, t)), rec = Math.exp(-Math.pow((t - hit - .1) / .18, 2)) * 18 + 6 * sm(lin(hit, hit + .5, t));
      const [bx, by] = alongPoly(brd, polyLen(brd) * [.16, .5, .84][i]);
      const yHold = 300 + i * 30, yHit = by - 96, y = mix(-260, yHold, inK) + (yHit - yHold) * go - rec + drift(t, 4, i) * (1 - go), x = bx + drift(t, 5, i + 3) * (1 - go);
      const rot = c0.rot + (1 - inK) * .2 * (i - 1) + rec * .004 * (i - 1);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(.82, .82); ctx.fillStyle = 'rgba(20,10,5,.35)'; ctx.filter = 'blur(8px)'; ctx.fillRect(-150, -70, 310, 180); ctx.filter = 'none'; ctx.drawImage(cardImg(i), -165, -100); ctx.restore();
    });
    if (bump > .02) { const [bx, by] = alongPoly(brd, polyLen(brd) * .5); glowDot(ctx, bx, by, 300, .12 * bump); }
    vignette(ctx, .4, 960, 540);
  }

  // ════════════════ TABLE · Nairobi (6.12, 6.13) · the UN tax convention table ════════════════
  const TB = { cx: 960, cy: 720, rx: 720, ry: 250 };
  const SEATS = Array.from({ length: 10 }, (_, i) => { const a = Math.PI + .2 + i / 9 * (Math.PI - .4); return { a, x: TB.cx + Math.cos(a) * TB.rx * .9, y: TB.cy + Math.sin(a) * TB.ry * .9 }; });
  const US = 6, NATIONS = ['BRAZIL', 'NIGERIA', 'NORWAY', 'INDIA', 'KENYA', 'CHILE', 'UNITED STATES', 'GHANA', 'INDONESIA', 'ZAMBIA'];
  const DLG = SEATS.map((s, i) => ({ ...s, skin: SKINS[(i * 5 + 2) % SKINS.length], suit: ['#2b3150', '#4a3426', '#1f2a3a', '#5a3a4a', '#2e3b33', '#3a2a24', '#000', '#24304a', '#4b3b2a', '#30283e'][i], hair: ['#1b1416', '#2a1d18', '#b9a58a', '#121012', '#1b1416', '#3a2a20', '#000', '#141014', '#1b1416', '#5a4636'][i], long: i % 3 === 1, ph: i * 1.3 }));
  const tableLayers = () => once('table', () => {
    const SC = 1.5, [c, g] = canvas(W * SC, H * SC); g.scale(SC, SC);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#24170f'); bg.addColorStop(.6, '#160e0a'); bg.addColorStop(1, '#0b0706'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // tall windows on the back wall, ochre afternoon light
    for (let i = 0; i < 5; i++) { const x = 140 + i * 360; g.fillStyle = 'rgba(201,138,60,.16)'; g.fillRect(x, 60, 150, 300); g.strokeStyle = 'rgba(30,18,10,.8)'; g.lineWidth = 6; g.strokeRect(x, 60, 150, 300); g.beginPath(); g.moveTo(x + 75, 60); g.lineTo(x + 75, 360); g.moveTo(x, 210); g.lineTo(x + 150, 210); g.stroke(); }
    // chairs (backs) behind the seats
    for (const s of SEATS) { g.save(); g.translate(s.x, s.y - 30); g.fillStyle = '#120a08'; rr(g, -50, -120, 100, 130, 22); g.fill(); g.strokeStyle = 'rgba(201,138,60,.18)'; g.lineWidth = 2; g.stroke(); g.restore(); }
    const [c2, g2] = canvas(W * SC, H * SC); g2.scale(SC, SC);
    // the table: an oval of dark polished wood with a lit edge
    g2.save(); g2.translate(0, 26); g2.beginPath(); g2.ellipse(TB.cx, TB.cy, TB.rx, TB.ry, 0, 0, TAU); g2.fillStyle = '#0a0604'; g2.fill(); g2.restore();
    g2.beginPath(); g2.ellipse(TB.cx, TB.cy, TB.rx, TB.ry, 0, 0, TAU); const tg = g2.createLinearGradient(TB.cx - TB.rx, TB.cy - TB.ry, TB.cx + TB.rx, TB.cy + TB.ry); tg.addColorStop(0, '#5a3820'); tg.addColorStop(.5, '#3a2416'); tg.addColorStop(1, '#22150d'); g2.fillStyle = tg; g2.fill();
    g2.save(); g2.clip(); const r = prng(5); for (let i = 0; i < 120; i++) { const y = TB.cy - TB.ry + r() * TB.ry * 2; g2.strokeStyle = `rgba(${r() < .5 ? '120,80,50' : '20,10,5'},${.08 + r() * .1})`; g2.lineWidth = .6 + r() * 1.6; g2.beginPath(); g2.moveTo(TB.cx - TB.rx, y); g2.bezierCurveTo(TB.cx - 200, y + 8 * (r() - .5), TB.cx + 200, y - 8 * (r() - .5), TB.cx + TB.rx, y + 4 * (r() - .5)); g2.stroke(); }
    // window reflections on the polish
    for (let i = 0; i < 5; i++) { const x = 140 + i * 360 + 75, rg = g2.createLinearGradient(x - 80, 0, x + 80, 0); rg.addColorStop(0, 'rgba(255,190,110,0)'); rg.addColorStop(.5, 'rgba(255,190,110,.13)'); rg.addColorStop(1, 'rgba(255,190,110,0)'); g2.fillStyle = rg; g2.fillRect(x - 80, TB.cy - TB.ry, 160, TB.ry * 2); }
    g2.restore(); g2.strokeStyle = 'rgba(255,200,140,.35)'; g2.lineWidth = 2; g2.beginPath(); g2.ellipse(TB.cx, TB.cy, TB.rx, TB.ry, 0, Math.PI * 1.05, Math.PI * 1.95); g2.stroke();
    // light shafts (ochre), drawn over everything at the end
    const [c3, g3] = canvas(W * SC, H * SC); g3.scale(SC, SC); g3.filter = 'blur(26px)';
    for (let i = 0; i < 5; i++) { const x = 140 + i * 360; g3.fillStyle = 'rgba(214,150,70,.10)'; g3.beginPath(); g3.moveTo(x, 60); g3.lineTo(x + 150, 60); g3.lineTo(x + 560, H); g3.lineTo(x + 300, H); g3.closePath(); g3.fill(); }
    g3.filter = 'none'; stipple(c, { k: .45, g: 1, seed: 33, mid: false, boost: 1 });
    return { back: c, table: c2, shafts: c3, SC };
  });
  function bust(ctx, d, t, o = {}) {
    const br = Math.sin(t * 1.4 + d.ph) * 1.5, nod = Math.sin(t * .7 + d.ph * 2) * .03 + (o.nod || 0), x = d.x, y = d.y - 18;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.lean || 0);
    const top = -96 + br, sw = 60;
    ctx.fillStyle = d.suit; ctx.beginPath(); ctx.moveTo(-sw - 8, 30); ctx.bezierCurveTo(-sw - 6, top + 34, -sw + 4, top + 4, -22, top); ctx.lineTo(22, top); ctx.bezierCurveTo(sw - 4, top + 4, sw + 6, top + 34, sw + 8, 30); ctx.closePath(); ctx.fill();
    const sg = ctx.createLinearGradient(-sw, 0, sw, 0); sg.addColorStop(0, 'rgba(255,200,140,.16)'); sg.addColorStop(.5, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,.35)'); ctx.fillStyle = sg; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,196,120,.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-sw - 6, 20); ctx.bezierCurveTo(-sw - 4, top + 34, -sw + 4, top + 4, -22, top); ctx.lineTo(22, top); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#e9e1d2'; ctx.beginPath(); ctx.moveTo(-15, top); ctx.lineTo(0, top + 30); ctx.lineTo(15, top); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(0, top - 4); ctx.rotate(nod); ctx.fillStyle = d.skin; ctx.fillRect(-8, -14, 16, 18);
    ctx.beginPath(); ctx.ellipse(0, -40, 21, 26, 0, 0, TAU); ctx.fill();
    const hg = ctx.createLinearGradient(-21, 0, 21, 0); hg.addColorStop(0, 'rgba(255,210,160,.25)'); hg.addColorStop(1, 'rgba(0,0,0,.3)'); ctx.fillStyle = hg; ctx.fill();
    ctx.fillStyle = d.hair; ctx.beginPath(); ctx.ellipse(0, -50, 22.5, 18, 0, Math.PI * .95, Math.PI * 2.05); ctx.fill(); if (d.long) { ctx.fillRect(-23, -50, 9, 40); ctx.fillRect(14, -50, 9, 40); }
    ctx.strokeStyle = 'rgba(255,200,130,.55)'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(0, -44, 22, 29, 0, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
    ctx.restore(); ctx.restore();
  }
  function forearms(ctx, d, t) { // arms rest on the table in front of the body
    const x = d.x, y = d.y - 18, mv = Math.sin(t * .8 + d.ph) * 3;
    for (const sd of [-1, 1]) { ctx.fillStyle = d.suit; ctx.beginPath(); ctx.moveTo(x + sd * 58, y + 6); ctx.quadraticCurveTo(x + sd * 50, y + 40, x + sd * 22 + mv * sd, y + 52); ctx.lineTo(x + sd * 22 + mv * sd, y + 36); ctx.quadraticCurveTo(x + sd * 36, y + 26, x + sd * 40, y + 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = d.skin; ctx.beginPath(); ctx.ellipse(x + sd * 16 + mv * sd, y + 46, 11, 8, sd * .4, 0, TAU); ctx.fill(); }
  }
  function placard(ctx, x, y, name, a, tip = 0) { // a tent card; tip 0..1 falls over backwards
    ctx.save(); ctx.translate(x, y); const h = 26 * Math.cos(tip * Math.PI / 2) + 3, w = 100;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-w / 2 + 4, 2, w, 6 + 22 * tip);
    ctx.fillStyle = '#efe8da'; ctx.fillRect(-w / 2, -h, w, h); ctx.strokeStyle = 'rgba(80,60,40,.5)'; ctx.lineWidth = 1; ctx.strokeRect(-w / 2, -h, w, h);
    ctx.save(); ctx.translate(0, -h / 2); ctx.scale(1, Math.max(.05, Math.cos(tip * Math.PI / 2))); text(ctx, name, 0, 3.5, { size: name.length > 10 ? 8.6 : 10, weight: 600, color: rgba('#1b1820', a), spacing: 1.5, align: 'center' }); ctx.restore();
    ctx.restore();
  }
  const paperPos = (i) => { const s = SEATS[i]; return [mix(s.x, TB.cx, .26), mix(s.y, TB.cy, .26) + 50]; };
  const PASS = [[1, 3, 0], [8, 5, .14], [4, 2, .28], [9, 7, .4]];
  function tableFrame(ctx, t, cam) {
    const Ls = tableLayers();
    ctx.save(); ctx.translate(960, 540); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
    ctx.save(); ctx.scale(1 / Ls.SC, 1 / Ls.SC); ctx.drawImage(Ls.back, 0, 0); ctx.restore();
    { const s0 = SEATS[US]; ctx.save(); ctx.translate(s0.x + 6, s0.y - 30); ctx.rotate(.05); ctx.fillStyle = '#1c120d'; rr(ctx, -50, -120, 100, 130, 22); ctx.fill();
      const cg = ctx.createLinearGradient(-50, 0, 50, 0); cg.addColorStop(0, 'rgba(255,200,140,.22)'); cg.addColorStop(.4, 'rgba(255,200,140,.04)'); cg.addColorStop(1, 'rgba(0,0,0,.2)'); ctx.fillStyle = cg; ctx.fill();
      ctx.strokeStyle = 'rgba(255,205,150,.45)'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = 'rgba(255,205,150,.12)'; rr(ctx, -40, -108, 80, 60, 16); ctx.fill(); ctx.restore(); }
    DLG.forEach((d, i) => { if (i !== US) bust(ctx, d, t, { nod: i === 4 ? .08 * Math.sin(t * 3) * sm(lin(A.negotiated, A.negotiated + .4, t)) * (1 - sm(lin(A.nations, A.nations + .5, t))) : 0 }); });
    ctx.save(); ctx.scale(1 / Ls.SC, 1 / Ls.SC); ctx.drawImage(Ls.table, 0, 0); ctx.restore();
    // papers in front of everyone; on "negotiated" some are passed across the table
    DLG.forEach((d, i) => { if (i === US) return; const [px, py] = paperPos(i); ctx.save(); ctx.translate(px, py); ctx.scale(1, .42); ctx.rotate(.1 * Math.sin(i * 2.1)); ctx.fillStyle = '#e9e1cf'; ctx.fillRect(-36, -46, 72, 92); ctx.strokeStyle = 'rgba(60,50,40,.35)'; ctx.lineWidth = 1.2; for (let l = 0; l < 6; l++) { ctx.beginPath(); ctx.moveTo(-26, -32 + l * 13); ctx.lineTo(18 - (l % 3) * 8, -32 + l * 13); ctx.stroke(); } ctx.restore(); });
    for (const [a, b, dl] of PASS) { const k = qio(lin(A.negotiated - .1 + dl, A.negotiated + .75 + dl, t)); if (k <= 0) continue; const p0 = paperPos(a), p1 = paperPos(b), x = mix(p0[0], p1[0], k), y = mix(p0[1], p1[1], k) + 20 - Math.sin(k * Math.PI) * 30;
      ctx.save(); ctx.translate(x, y); ctx.scale(1, .42); ctx.rotate(k * 1.2 - .3); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 18 * Math.sin(k * Math.PI); ctx.fillStyle = '#f3ecdc'; ctx.fillRect(-36, -46, 72, 92); ctx.restore(); }
    // the sheet pushed off to the right (into 6.12a)
    { const k = ei5(lin(TT.s612a - .75, TT.s612a + .25, t)); if (k > 0 && t < TT.s613 - 1) { const x = mix(TB.cx + 60, 2300, k), y = TB.cy + 60 - k * 40; ctx.save(); ctx.translate(x, y); ctx.scale(1, .42); ctx.rotate(-.2 + k * .4); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14; ctx.fillStyle = '#f6efe0'; ctx.fillRect(-60, -78, 120, 156); ctx.shadowColor = 'transparent'; ctx.fillStyle = rgba(AMBER, .9); ctx.beginPath(); ctx.arc(30, -50, 9, 0, TAU); ctx.fill(); ctx.restore(); } }
    DLG.forEach((d, i) => { if (i !== US) forearms(ctx, d, t); });
    // placards; the US one tips over on "left"
    DLG.forEach((d, i) => { const [px, py] = paperPos(i); const tip = i === US ? ein(lin(A.left + .04, A.talksE + .03, t)) : 0, bounce = i === US ? Math.exp(-Math.pow((t - A.talksE - .08) / .06, 2)) * .07 : 0; placard(ctx, px + (i < 5 ? -8 : 8), py - 30, NATIONS[i], .9, clamp(tip - bounce)); });
    // a glass of water at the empty seat
    { const [px, py] = paperPos(US); ctx.save(); ctx.translate(px + 70, py - 40); ctx.fillStyle = 'rgba(200,220,235,.12)'; ctx.fillRect(-10, -34, 20, 34); ctx.strokeStyle = 'rgba(230,240,250,.45)'; ctx.lineWidth = 1.2; ctx.strokeRect(-10, -34, 20, 34); ctx.fillStyle = 'rgba(255,220,170,.25)'; ctx.fillRect(-9, -18, 18, 17); ctx.restore(); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.scale(1 / Ls.SC, 1 / Ls.SC); ctx.drawImage(Ls.shafts, drift(t, 20, 3), 0); ctx.restore();
    ctx.restore();
    motes(ctx, t, 41, 50, .3, '255,214,160');
  }
  function table612(ctx, t) {
    const z = 1.0 + .05 * sm(lin(TT.s612 - .4, TT.s612a + .3, t)), cam = { x: 960 + drift(t, 8, 1), y: 560 + drift(t, 5, 2), z };
    tableFrame(ctx, t, cam);
    const tA = eo5(lin(A.s612 + .25, A.s612 + .8, t)), sA = eo5(lin(A.s612 + .45, A.s612 + 1.0, t));
    serif(ctx, 'UN tax convention', 96, 150, tA, { size: 60 }); label(ctx, 'NEXT ROUND · 30 NOV – 11 DEC 2026 · NAIROBI', 98, 196, sA, { size: 20, spacing: 4, col: PEACH });
    vignette(ctx, .45);
  }
  function table613(ctx, t) {
    const [px, py] = paperPos(US), s0 = SEATS[US], z = 2.0 + .12 * sm(lin(TT.s613, TT.s614, t)), cam = { x: (s0.x + px) / 2 + drift(t, 4, 5), y: (s0.y - 150 + py - 30) / 2 + 20 + drift(t, 3, 6), z };
    tableFrame(ctx, t, cam);
    label(ctx, 'LEFT THE TALKS · FEB 2025', 96, 150, eo5(lin(A.left + .3, A.left + .8, t)), { size: 20, spacing: 5, col: PEACH });
    vignette(ctx, .55);
  }

  // ════════════════ MAP · world (6.12a) · tax where the users are ════════════════
  const SWD = () => once('swd', () => daySheet({ ...ccOf(-42, 14), z: 1.08, rot: -.04, tilt: .34 }, { hi: ['KEN'], hiA: .35, hiCol: GOLD, seed: 13, scale: 2, lamp: [W * .62 + 90, -60] }));
  const wPts = () => once('wpts', () => { const S0 = SWD(); return { nbo: S0.PL(36.82, -1.29).slice(0, 2), sf: S0.PL(-122.4, 37.8).slice(0, 2) }; });
  function arcPts(a, b, lift, n = 80) { const pts = [], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - lift; for (let i = 0; i <= n; i++) { const q = i / n; pts.push([(1 - q) * (1 - q) * a[0] + 2 * q * (1 - q) * mx + q * q * b[0], (1 - q) * (1 - q) * a[1] + 2 * q * (1 - q) * my + q * q * b[1]]); } return pts; }
  function worldFrame(ctx, t) {
    const S0 = SWD(), G = wPts(), pb = qio(lin(A.even - .1, A.elsewhere + .1, t)), m = mix(2.35 + .12 * sm(lin(TT.s612a, A.even, t)), 1.0, pb);
    const z0 = { z: m, dx: 0, dy: 0 }, n0 = toView(S0, z0, G.nbo[0], G.nbo[1]), tgt = [mix(1180, 0, pb), mix(620, 0, pb)];
    const view = { z: m, dx: pb < 1 ? (tgt[0] - n0[0]) * (1 - pb) + drift(t, 6, 13) : drift(t, 6, 13), dy: pb < 1 ? (tgt[1] - n0[1]) * (1 - pb) + drift(t, 4, 14) : drift(t, 4, 14) };
    drawDay(ctx, S0, view); const V = (p) => toView(S0, view, p[0], p[1]);
    // "countries could tax": Kenya's outline lights up (the country that taxes)
    { const k = sm(lin(A.tax - .1, A.tax + .3, t)), a = k * (.45 + .55 * Math.exp(-Math.pow((t - A.tax - .3) / .5, 2))); if (a > 0) { const kz = S0.SC || 1;
      ctx.save(); ctx.translate(W / 2 + view.dx, H / 2 + view.dy); ctx.scale(view.z / kz, view.z / kz); ctx.translate((-W / 2 - S0.pad) * kz, (-H / 2 - S0.pad) * kz);
      ctx.beginPath(); S0.countryPath(ctx, 'KEN'); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round';
      for (const [w, al] of [[14, .12], [5, .3], [2, .8]]) { ctx.strokeStyle = rgba(AMBER, al * a); ctx.lineWidth = w * kz / view.z; ctx.stroke(); } ctx.restore(); } }
    const nb = V(G.nbo), sf = V(G.sf), sz = .6 + .4 * m / 2.35;
    // the thread: a guilloche braid from the phone in Nairobi to a company far away
    const dU = eio(lin(A.digital - .1, A.use + .1, t)), pts = arcPts([nb[0], nb[1] - 70 * sz], [sf[0], sf[1] - 60 * sz], 240 * Math.max(.6, 1.4 - m * .35));
    if (dU > 0) { const n = Math.max(2, Math.round(pts.length * dU)); ctx.save(); ctx.lineCap = 'round';
      for (let j = 0; j < 4; j++) { ctx.strokeStyle = j === 3 ? rgba(AMBER, .25) : rgba(j === 1 ? '#7a3b17' : '#b2552c', .85); ctx.lineWidth = j === 3 ? 7 : 2; ctx.beginPath();
        for (let i = 0; i < n; i++) { const [x, y] = pts[i], q = i / pts.length, o = j === 3 ? 0 : Math.sin(q * 60 + j * 2.1 + t * 2) * 5 * sz; i ? ctx.lineTo(x, y + o) : ctx.moveTo(x, y + o); } ctx.stroke(); }
      const [hx, hy] = pts[n - 1]; glowDot(ctx, hx, hy, 30, .5 * (1 - sm(lin(A.use, A.use + .5, t)))); ctx.restore();
      // the services flowing out to the company: small packets riding the braid
      const fa = sm(lin(A.use - .2, A.use + .3, t)) * (1 - sm(lin(A.elsewhere - .3, A.elsewhere, t))); if (fa > 0) for (let k = 0; k < 5; k++) { const q = ((t - A.use) * .32 + k / 5) % 1, j = Math.min(n - 1, Math.floor(q * (pts.length - 1))); if (j >= n - 1 || q < 0) continue; const [x, y] = pts[j]; glowDot(ctx, x, y, 12, .55 * fa * Math.sin(q * Math.PI)); } }
    // the company tower (far away)
    { const s = 1.15 * sz, a = sm(lin(A.even - .3, A.even + .4, t)) * .7 + .3; ctx.save(); ctx.translate(sf[0], sf[1]); ctx.scale(s, s); ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(40,20,10,.25)'; ctx.beginPath(); ctx.ellipse(10, 2, 34, 8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2a2433'; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-16, -84); ctx.lineTo(0, -102); ctx.lineTo(16, -84); ctx.lineTo(16, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,214,150,.75)'; for (let r0 = 0; r0 < 8; r0++) for (let c0 = 0; c0 < 3; c0++) if ((r0 * 3 + c0) % 4) ctx.fillRect(-11 + c0 * 8, -78 + r0 * 9, 4, 4);
      ctx.restore(); label(ctx, 'AI COMPANY', sf[0], sf[1] + 28 * s, a, { col: INK, size: 14, spacing: 4, align: 'center' }); }
    // the phone in Nairobi: AI spark on its screen
    { const s = sz * 1.1, ai = eo5(lin(A.ai - .05, A.ai + .35, t)); ctx.save(); ctx.translate(nb[0], nb[1]); ctx.scale(s, s);
      ctx.fillStyle = 'rgba(40,20,10,.3)'; ctx.beginPath(); ctx.ellipse(14, 4, 34, 9, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#14151c'; rr(ctx, -22, -86, 44, 88, 8); ctx.fill(); const sg = ctx.createLinearGradient(0, -82, 0, -4); sg.addColorStop(0, '#2c3a5c'); sg.addColorStop(1, '#141a2c'); ctx.fillStyle = sg; rr(ctx, -19, -82, 38, 78, 5); ctx.fill();
      for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(['#8fb3c9', '#f5b08a', '#c98a3c', '#e9e1d2', '#8fd27a', '#c8442f'][k], .75 * (1 - ai * .8)); rr(ctx, -13 + (k % 2) * 15, -74 + Math.floor(k / 2) * 15, 11, 11, 3); ctx.fill(); }
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(AMBER, ai); const sp = (cx, cy, r) => { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, q = i % 2 ? r * .28 : r; i ? ctx.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q) : ctx.moveTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q); } ctx.closePath(); ctx.fill(); };
      if (ai > 0) { sp(0, -26, 9 + 5 * ai); sp(10, -38, 4 * ai); } ctx.restore();
      label(ctx, 'NAIROBI', nb[0] + 34 * s, nb[1] - 6, .8, { col: INK, size: 15, spacing: 4 }); }
    // the tax comes back: a coin rides the thread from the company to Kenya on "elsewhere"
    { const k = qio(lin(A.elsewhere - .05, A.elsewhereE + .1, t)); if (k > 0 && k < 1) { const i = Math.round((1 - k) * (pts.length - 1)), [x, y] = pts[i]; shareLight(ctx, x, y, 13, t, { a: 1 }); label(ctx, 'TAX', x, y - 22, 1, { size: 12, spacing: 3, col: '#7a3b17', align: 'center' }); }
      const land = clamp((t - A.elsewhereE - .1) / .9); if (land > 0) { ring(ctx, nb[0], nb[1] - 40, 20 + 80 * eout(land), 8 + 30 * eout(land), { lines: 3, col: '#7a3b17', a: .6 * (1 - land), lw: 1 }); shareLight(ctx, nb[0] + 26 * sz, nb[1] - 4, 11, t, { a: eo5(land * 3) }); } }
    const tagA = eo5(lin(A.ai - .05, A.ai + .4, t)) * (1 - pb);
    label(ctx, 'DIGITAL SERVICES · AI INCLUDED', 96, 150, tagA, { size: 22, spacing: 5, col: '#3a1f14' });
    label(ctx, 'DRAFT UN PROTOCOL · JULY 2026', 98, 182, tagA * .8, { size: 14, spacing: 4, col: '#5a3a2a' });
    vignette(ctx, .4, 960, 540);
  }

  // ════════════════ PHONES (6.14, 6.15) · the accounts already exist ════════════════
  const PH = [{ x: 280, y: 720, ang: -.12, skin: SKINS[3] }, { x: 620, y: 690, ang: -.04, skin: SKINS[1] }, { x: 960, y: 725, ang: .02, skin: SKINS[4] }, { x: 1300, y: 700, ang: .06, skin: SKINS[0] }, { x: 1640, y: 718, ang: .12, skin: SKINS[2] }];
  const DARK = 3;
  const phBg = () => bgCached('phbg', (g, c) => { const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0d1530'); bg.addColorStop(.62, '#2a2140'); bg.addColorStop(1, '#4a2c34'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const hg = g.createRadialGradient(960, 900, 0, 960, 900, 900); hg.addColorStop(0, 'rgba(245,176,138,.35)'); hg.addColorStop(1, 'rgba(245,176,138,0)'); g.fillStyle = hg; g.fillRect(0, 0, W, H);
    const r = prng(8); g.filter = 'blur(6px)'; for (let i = 0; i < 70; i++) { const x = r() * W, y = 640 + r() * 300, rad = 4 + r() * 14; g.fillStyle = `rgba(255,${180 + r() * 60 | 0},${110 + r() * 60 | 0},${.1 + r() * .25})`; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill(); } g.filter = 'none';
    stipple(c, { k: .45, g: 1, seed: 12, mid: false, boost: 1 }); });
  function acctScreen(i, t) {
    return (g, w, h) => {
      const has = i !== DARK, on = eo5(lin(A.s614 + .3 + i * .07, A.s614 + .8 + i * .07, t)), glow = has ? sm(lin(A.four - .05 + i * .04, A.four + .3 + i * .04, t)) : 0;
      const dim = 1 - .35 * sm(lin(A.s615, A.s615 + .6, t)) * (1 - sm(lin(A.yet - .1, A.yet + .4, t)) * .6);
      const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, has ? mix3('#1b2236', '#5a3a1e', glow) : '#151a28'); bg.addColorStop(1, has ? mix3('#0b0e18', '#2a1a10', glow) : '#090b12'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
      g.save(); g.globalAlpha = dim;
      const cx = w * .1, cy = h * .3, cw = w * .8, ch = h * .26;
      if (has) { g.globalAlpha = on * dim; const cg = g.createLinearGradient(cx, cy, cx + cw, cy + ch); cg.addColorStop(0, mix3('#2d3a5e', '#f0a04b', glow)); cg.addColorStop(1, mix3('#1a2240', '#c87a2c', glow)); g.fillStyle = cg; rr(g, cx, cy, cw, ch, 8); g.fill();
        g.strokeStyle = rgba(CREAM, .35); g.lineWidth = 1; rr(g, cx + 4, cy + 4, cw - 8, ch - 8, 6); g.stroke();
        g.fillStyle = rgba(CORE, .85); g.beginPath(); g.arc(cx + 18, cy + 20, 8, 0, TAU); g.fill();
        text(g, 'ACCOUNT', cx + 32, cy + 25, { size: 10, weight: 600, color: rgba(CORE, .9), spacing: 2 }); text(g, '•••• ' + String((4821 + i * 1373) % 10000).padStart(4, '0'), cx + 12, cy + ch - 14, { size: 13, weight: 500, color: rgba(CORE, .9), spacing: 1 }); }
      else { g.globalAlpha = on * dim * .8; g.setLineDash([3, 4]); g.strokeStyle = rgba(CREAM, .35); g.lineWidth = 1.2; rr(g, cx, cy, cw, ch, 8); g.stroke(); g.setLineDash([]); text(g, 'no account', w / 2, cy + ch / 2 + 4, { size: 11, weight: 500, color: rgba(CREAM, .4), align: 'center' }); }
      // 6.15: an incoming share that does not exist yet (dotted), in every screen
      const gh = eo5(lin(A.every - .1 + i * .05, A.every + .4 + i * .05, t)); if (gh > 0) { g.globalAlpha = 1; const yy = h * .7, pulse = .55 + .45 * Math.sin(t * 5 + i) * sm(lin(A.yet - .1, A.yet + .3, t));
        text(g, 'INCOMING', w / 2, yy - 40, { size: 10, weight: 600, color: rgba(CREAM, .6 * gh), spacing: 2, align: 'center' });
        g.strokeStyle = rgba(AMBER, (.55 + .4 * pulse) * gh); g.lineWidth = 1.8; g.setLineDash([2, 4.5]); g.beginPath(); g.arc(w / 2, yy, 24, 0, TAU); g.stroke(); g.beginPath(); g.arc(w / 2, yy, 15, 0, TAU); g.stroke(); g.setLineDash([]);
        g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(w / 2, yy, 0, w / 2, yy, 30); rg.addColorStop(0, rgba(AMBER, .25 * pulse * gh)); rg.addColorStop(1, rgba(AMBER, 0)); g.fillStyle = rg; g.fillRect(w / 2 - 30, yy - 30, 60, 60); g.globalCompositeOperation = 'source-over'; }
      g.restore();
    };
  }
  function mix3(a, b, k) { const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)], x = p(a), y = p(b); return `rgb(${x.map((v, j) => Math.round(mix(v, y[j], k))).join(',')})`; }
  function phonesFrame(ctx, t) {
    ctx.drawImage(phBg(), drift(t, 10, 2) - 10, 0);
    const z = 1 + .04 * sm(lin(TT.s614, TT.s616, t)); ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
    const pin = (i) => eo5(lin(TT.s614 - .2 + i * .06, TT.s614 + .7 + i * .06, t));
    PH.forEach((p, i) => { const k = pin(i), glow = i !== DARK ? sm(lin(A.four - .05 + i * .04, A.four + .3 + i * .04, t)) : 0;
      if (glow > 0) glowDot(ctx, p.x, p.y - 40, 260, .22 * glow);
      heldPhone(ctx, p.x + drift(t, 6, i), p.y + (1 - k) * 420 + drift(t, 5, i + 2), 1.0, { t, skin: p.skin, ang: p.ang, lit: .6 + .4 * glow, warm: i === DARK ? .1 : .4 + .6 * glow, screen: acctScreen(i, t) }); });
    ctx.restore();
    const nA = eo5(lin(A.four - .05, A.four + .4, t)) * (1 - sm(lin(A.s615 + .2, A.s615 + .8, t)));
    serif(ctx, '79%', 960, 210, nA, { size: 140, align: 'center', col: CORE });
    label(ctx, 'OF ADULTS HAVE AN ACCOUNT', 960, 262, nA, { size: 22, spacing: 6, align: 'center', col: PEACH });
    label(ctx, 'WORLD BANK · GLOBAL FINDEX 2025', 960, 296, nA * .7, { size: 13, spacing: 4, align: 'center', col: CREAM });
    const pA = eo5(lin(A.every - .1, A.every + .4, t)) * (1 - sm(lin(TT.s616 - .3, TT.s616, t)));
    label(ctx, 'PAID TO EVERY HUMAN: NOT YET', 960, 296 + 70 * nA * 0, pA * (1 - nA), { size: 22, spacing: 6, align: 'center', col: PEACH });
    vignette(ctx, .5);
  }

  // ════════════════ VOID (6.16–6.19) · one plan sequence: promises leave, the fund is drawn, agreed, the light runs ════════════════
  const FUND = { x: 600, y: 830, s: 1.15 };
  const fundGeo = once('fundgeo', () => { const [c, g] = canvas(8, 8); return glassFund(g, FUND.x, FUND.y, FUND.s, 0, { a: 0 }); });
  const OUT = fundGeo.out;
  const PHN = Array.from({ length: 5 }, (_, i) => ({ x: OUT.x + 380 + i * 150, y: OUT.y - 40 + (i % 2 ? 18 : -6) + (i === 2 ? -4 : 0) }));
  const pipes = PHN.map((p, i) => { const y0 = OUT.y + (i - 2) * 5, pts = []; for (let k = 0; k <= 40; k++) { const q = k / 40, x = mix(OUT.x, p.x - 27, q), bend = sm(clamp((q - .3) / .7)); pts.push([x, mix(y0, p.y + 36, bend)]); } return pts; });
  const PPL = PHN.map((p, i) => ({ s: 1.3 + (i % 2) * .06, flip: i > 2, pose: { sh: [2.5 - (i % 2) * .12, .22], el: [.28, .3], head: -.28 }, acc: ['#3a4a6a', '#5a3a4a', '#3a5048', '#4a3a2a', '#2e3b5a'][i], skin: SKINS[(i * 3 + 2) % SKINS.length] }));
  const PLQ = { x: OUT.x - 420, y: OUT.y - 116, w: 400, h: 150 };
  const voidBg = () => bgCached('voidbg', (g, c) => { const bg = g.createRadialGradient(960, 120, 0, 960, 420, 1400); bg.addColorStop(0, '#26244a'); bg.addColorStop(.5, '#10122a'); bg.addColorStop(1, '#05060f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    rosette(g, 960, 560, { R: 520, A: 70, B: 30, n: 48, m: 15, lines: 56, col: '#b4bfe8', w: .5, a: .015 }); stipple(c, { k: .45, g: 1, seed: 17, mid: false, boost: 1 }); });
  const SHEETS = [{ gx: 700, gy: 260, rot: .1, hand: { cuff: '#ece6da', link: '#d9a441', sleeve: '#1b2238', skin: SKINS[0] }, name: 'BOARD', word: () => A.boards, out: () => A.billE - .42 },
    { gx: 1230, gy: 280, rot: -.12, hand: { signet: true, sleeve: '#2b1e2a', skin: SKINS[2], flip: true }, name: 'BILLIONAIRE', word: () => A.bill, out: () => A.billE - .17 }];
  const sheetImg = (i) => once('promise' + i, () => { const [c, g] = canvas(420, 540); paperSheet(g, 20, 20, 380, 500, { seed: 4 + i, tone: '#efe4cc', shadow: false, lines: 0 });
    text(g, 'PLEDGE', 210, 278, { size: 16, weight: 600, color: rgba(INK, .6), spacing: 8, align: 'center' }); g.fillStyle = rgba(INK, .5); g.fillRect(90, 290, 240, 1.5);
    for (let l = 0; l < 5; l++) scribble(g, 60, 326 + l * 26, 300 - (l % 3) * 40, 12, { seed: 30 + l + i * 9, ink: '#3a3442', lw: 1.3 });
    sigLine(g, 70, 480, 240, { seed: 3 + i, u: 1, label: false }); return c; });
  function voidCam(t) {
    const g1 = qio(lin(A.s618 + .1, A.agree - .2, t)), g2 = qio(lin(A.s619 + .1, COUT.t - 1, t));
    const Z1 = 1.3, c1 = [PLQ.x + PLQ.w * .5 + 150, PLQ.y + 60], Z2 = 1.0, c2 = [OUT.x + 260 / Z2, OUT.y - 20 / Z2];
    const Z = mix(mix(1, Z1, g1), Z2, g2), cx = mix(mix(960, c1[0], g1), c2[0], g2), cy = mix(mix(540, c1[1], g1), c2[1], g2);
    const dA = 1 - g2; return { Z: Z * (1 + .01 * Math.sin(t * .3)), cx: cx + drift(t, 5, 21) * dA, cy: cy + drift(t, 4, 22) * dA };
  }
  const toS = (cam, x, y) => [960 + (x - cam.cx) * cam.Z, 540 + (y - cam.cy) * cam.Z];
  function voidFrame(ctx, t) {
    ctx.drawImage(voidBg(), 0, 0);
    const cam = voidCam(t); ctx.save(); ctx.translate(960, 540); ctx.scale(cam.Z, cam.Z); ctx.translate(-cam.cx, -cam.cy);
    // a top light where the promises hang
    { const lg = ctx.createRadialGradient(960, -100, 0, 960, 200, 900); lg.addColorStop(0, 'rgba(255,214,160,.16)'); lg.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = lg; ctx.fillRect(-400, -400, W + 800, H + 800); }
    // 6.16 · two PROMISE sheets hang from a cuff + cufflink hand and a signet hand; both are pulled up and out
    if (t < A.billE + .6) SHEETS.forEach((S0, i) => {
      const w0 = S0.word(), lift = eo5(lin(w0 - .05, w0 + .35, t)) * (1 - ei5(lin(w0 + .6, w0 + 1.2, t)) * .6), yank = ei5(lin(S0.out(), S0.out() + .45, t));
      const gx = S0.gx + drift(t, 4, i * 3), gy = S0.gy - 26 * lift - 1100 * yank + drift(t, 3, i * 3 + 1), sway = S0.rot + .04 * Math.sin(t * 1.1 + i * 2) + .06 * yank * (i ? -1 : 1);
      ctx.save(); ctx.translate(gx, gy); ctx.rotate(sway); ctx.translate(-110, -16);
      ctx.save(); ctx.globalAlpha = .45; ctx.filter = 'blur(16px)'; ctx.fillStyle = '#000'; ctx.fillRect(40, 50, 380, 500); ctx.filter = 'none'; ctx.restore();
      ctx.drawImage(sheetImg(i), -20, -20);
      perforateText(ctx, 'PROMISE', 190, 196, { size: 54, pitch: 5.6, hole: 1.5, u: eo5(lin(A.s616 + .1 + i * .12, A.s616 + .9 + i * .12, t)), t, onPaper: true, spacing: 6 });
      ctx.restore();
      const hp = { pose: 'grip', ang: Math.PI / 2 + sway * .5, rim: '#ffd9a0', sleeveLen: 500, ...S0.hand, t };
      hand(ctx, gx + (i ? 18 : -18), gy - 92, 2.0, hp);
      // the promise does not hold: as the sheet is pulled away, its light drifts off as smoke
      if (yank > 0) { const r = prng(70 + i), x0 = S0.gx, y0 = S0.gy - 26, kk = clamp((t - S0.out()) / 1.6); ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 70; k++) { const px = x0 - 110 + 30 + r() * 330, py = y0 + 160 + r() * 60, dl = r() * .3, q = clamp((t - S0.out() - dl) / 1.3); if (q <= 0) continue;
          const x = px + Math.sin(q * 5 + k) * 18 * q + (r() - .5) * 60 * q, y = py + 40 * q - 60 * q * q + Math.sin(k) * 10 * q; ctx.fillStyle = rgba('#ffe2b0', .7 * (1 - q)); ctx.beginPath(); ctx.arc(x, y, 1.6 + r() * 1.2, 0, TAU); ctx.fill(); }
        ctx.restore(); }
      label(ctx, S0.name, gx + (i ? 300 : -150), gy + 120, eo5(lin(w0 - .05, w0 + .35, t)) * (1 - yank), { size: 20, spacing: 8, col: PEACH, align: i ? 'left' : 'right' });
    });
    // 6.17 · no global fund (yet): the glass fund appears as a dotted ghost, pipes reach for the accounts and end short
    const fin = sm(lin(A.billE - .3, A.fund, t)), burin = t > A.do2 - .35 ? clamp((t - (A.do2 - .35)) / .95) : null;
    if (fin > 0) {
      ctx.save(); const top = FUND.y - 560 * FUND.s, yC = mix(FUND.y + 20, top - 40, fin); ctx.beginPath(); ctx.rect(FUND.x - 400, yC, 800, FUND.y + 120 - yC); ctx.clip();
      glassFund(ctx, FUND.x, FUND.y, FUND.s, t, { ghost: 1, burin, fill: burin != null ? .25 * sm(burin) : 0, seal: burin != null ? sm(lin(.55, .9, burin)) : 0, glow: burin != null ? sm(burin) * .8 : 0, label: 'global fund', sub: burin != null && burin > .6 ? 'agreed' : 'not yet' });
      ctx.restore();
      const gl = sm(lin(.55, .9, fin)) * (burin != null ? 1 - sm(lin(.2, .6, burin)) : 1); if (gl > 0) { serif(ctx, 'global fund', fundGeo.label.x, fundGeo.label.y + 8, gl, { size: 40, align: 'center', col: CREAM, a: .55 }); label(ctx, 'NOT YET', fundGeo.label.x, fundGeo.label.y + 40, gl * .8, { size: 14, spacing: 6, align: 'center', col: PEACH }); }
    }
    // the accounts (five dark phones) to the right, at the height of the fund's outlet
    const phA = sm(lin(A.billE - .1, A.fund + .2, t));
    PHN.forEach((p, i) => { if (phA <= 0) return; const P = PPL[i], litK = sm(lin(p.x - 60, p.x + 20, burnFront(t))), dy = drift(t, 3, i), [hx0, hy0] = handPos(0, 0, P.s, P.pose, 0, P.flip);
      ctx.save(); ctx.globalAlpha = phA; figureFlat(ctx, p.x - hx0, p.y + 38 - hy0 + dy, P.s, P.pose, { t, seed: 40 + i, col: '#161b33', rim: mix3('#4a5378', '#ffcf9a', litK), rimSide: P.flip ? -1 : 1, flip: P.flip, accent: P.acc, accentPart: 'sweater', skin: P.skin, fast: true }); ctx.restore(); });
    PHN.forEach((p, i) => { if (phA <= 0) return; const runX = burnFront(t), litK = sm(lin(p.x - 60, p.x + 20, runX)); ctx.save(); ctx.translate(p.x, p.y + drift(t, 3, i)); ctx.globalAlpha = phA; ctx.rotate((i - 2) * .05); ctx.scale(1.05, 1.05);
      ctx.fillStyle = '#0c0d13'; rr(ctx, -26, -50, 52, 100, 9); ctx.fill(); ctx.strokeStyle = 'rgba(220,226,240,.35)'; ctx.lineWidth = 1.3; ctx.stroke();
      const sg = ctx.createLinearGradient(0, -45, 0, 45); sg.addColorStop(0, mix3('#141a2a', '#f0a04b', litK)); sg.addColorStop(1, mix3('#0a0d16', '#c87a2c', litK)); ctx.fillStyle = sg; rr(ctx, -22, -45, 44, 90, 6); ctx.fill();
      ctx.setLineDash([2, 3]); ctx.strokeStyle = rgba(CREAM, .35 + .2 * Math.sin(t * 3 + i) * sm(lin(A.accounts, A.accounts + .3, t))); ctx.lineWidth = 1; rr(ctx, -16, -16, 32, 22, 4); ctx.stroke(); ctx.setLineDash([]);
      if (litK > 0) { ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, 0, 0, 80, .5 * litK, AMBER, CORE); }
      ctx.restore(); });
    const pu = .8 * eio(lin(A.fill - .25, A.accounts + .4, t));
    if (pu > 0) { const front = burnFront(t);
      pipes.forEach((p, i) => { let bur = null; if (front > OUT.x) { let s = 0; const L = polyLen(p); for (let k = 1; k < p.length; k++) { if (p[k][0] > front) break; s += Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]); } bur = clamp(s / L); }
        ghostLine(ctx, p, { ghost: 1, u: bur != null ? Math.max(pu, bur) : pu, burin: bur, col: CREAM, w: 1.8, dot: 6, a: .9, t, seed: 5 + i, glow: AMBER, noTip: bur == null || bur >= 1 || i !== 2 }); });
      // the dotted ends flicker where they stop short
      if (front <= OUT.x) pipes.forEach((p, i) => { const [x, y] = alongPoly(p, polyLen(p) * pu); glowDot(ctx, x, y, 14, .25 * (.5 + .5 * Math.sin(t * 6 + i * 2))); });
    }
    // 6.18 · the plaque on the plinth: its signature line ends at the outlet; the pen touches down on "agree" and hovers
    const pA = eo5(lin(A.s618 + .2, A.s618 + .9, t));
    if (pA > 0) {
      ctx.save(); ctx.globalAlpha = pA; ctx.translate(0, (1 - pA) * 30);
      paperSheet(ctx, PLQ.x, PLQ.y, PLQ.w, PLQ.h, { seed: 9, tone: '#efe6cf', lift: 4 });
      text(ctx, 'AGREEMENT', PLQ.x + 24, PLQ.y + 40, { size: 15, weight: 600, color: rgba(INK, .75), spacing: 8 });
      text(ctx, 'an equal share for every human', PLQ.x + 24, PLQ.y + 76, { size: 26, font: 'Instrument Serif', color: '#1b1820' });
      ctx.restore();
      const sx = PLQ.x + 30, sw = OUT.x - sx, sy = OUT.y, sU = clamp((t - (A.s619 + .09)) / .9);
      ctx.save(); ctx.globalAlpha = pA; sigLine(ctx, sx, sy, sw, { u: sU * .92, label: 'signature', dotted: sU <= 0, seed: 4, signInk: '#1b2a6b' }); ctx.restore();
      // the pen
      const touch = Math.exp(-Math.pow((t - A.agree) / .1, 2)), inK = eo5(lin(A.agree - .9, A.agree - .1, t)), outK = ei5(lin(A.do2 - .45, A.do2 + .15, t));
      if (inK > 0 && outK < 1) {
        const signing = t > A.s619 + .09 && t < A.s619 + 1.0, nibX = signing ? sx + sw * .06 + sw * .8 * sU : sx + 14, nibY = sy - 8 + (signing ? Math.sin(sU * 40) * 6 : 0);
        const lift = signing ? .05 : t < A.agree ? 1 - touch : (t < A.agree + .3 ? 1 - touch : .6 + .1 * Math.sin(t * 2.4));
        pen(ctx, mix(nibX + 380, nibX, inK) - 520 * outK, mix(nibY - 260, nibY, inK) - 30 * lift - 360 * outK, 1.25, { ang: -2.35, t, lift: clamp(lift) });
        if (touch > .05) glowDot(ctx, sx + 14, sy - 8, 26, .35 * touch);
      }
    }
    ctx.restore();
    // 6.19 · the light ignites at the end of the line and runs right (the c09>c10 thread)
    if (t > COUT.t - 1.05 && t < COUT.t + .15) { const ig = Math.exp(-Math.pow((t - (COUT.t - 1)) / .12, 2)); if (ig > .01) glowDot(ctx, 700, 560, 120, .6 * ig); COUT.draw(ctx, t); }
    motes(ctx, t, 51, 40, .25);
    vignette(ctx, .5);
  }
  // where the burin front is on the pipes (world x), driven by the carrier thread's head on screen
  function burnFront(t) { if (t < COUT.t - 1) return -1e9; const cam = voidCam(t), p = COUT.pos(t); return cam.cx + (p.x - 960) / cam.Z; }

  // ════════════════ the shot list ════════════════
  const cutIn = { tr: 'cut', d: .1 };
  return [
    { t: TT.s607, tr: CIN.into.tr, x: CIN.into.x, y: CIN.into.y, d: CIN.into.d, draw: (ctx, t) => listFrame(ctx, t) },                                    // 6.07
    { t: TT.s608, ...cutIn, draw: (ctx, t) => listFrame(ctx, t) },                                                                                      // 6.08 (plan sequence)
    { t: TT.s609, tr: 'up', d: .7, draw: (ctx, t) => deciderFrame(ctx, t), sound: [{ f: 'chime', t: A.s609E + .06, v: .25 }] },                         // 6.09
    { t: TT.s610, tr: 'down', d: .7, draw: (ctx, t) => africaFrame(ctx, t) },                                                                            // 6.10
    { t: TT.s611, tr: 'whipR', d: .3, draw: (ctx, t) => usFrame(ctx, t), sound: [{ f: 'card', t: A.do1E + .03, v: .25 }] },                              // 6.11
    { t: TT.s612, tr: 'zoom', x: 1000, y: 360, depth: 4, d: .7, draw: (ctx, t) => table612(ctx, t) },                                                   // 6.12
    { t: TT.s612a, tr: 'left', d: .6, draw: (ctx, t) => worldFrame(ctx, t) },                                                                            // 6.12a
    { t: TT.s613, tr: 'whipR', d: .3, draw: (ctx, t) => table613(ctx, t), sound: [{ f: 'card', t: A.talksE + .03, v: .3 }] },                            // 6.13
    { t: TT.s614, tr: 'down', d: .6, draw: (ctx, t) => phonesFrame(ctx, t) },                                                                            // 6.14
    { t: TT.s615, ...cutIn, draw: (ctx, t) => phonesFrame(ctx, t) },                                                                                    // 6.15 (plan sequence)
    { t: TT.s616, tr: 'zoom', x: 962, y: 790, depth: 5, d: .7, draw: (ctx, t) => voidFrame(ctx, t) },                                               // 6.16
    { t: TT.s617, ...cutIn, draw: (ctx, t) => voidFrame(ctx, t) },                                                                                      // 6.17 (plan sequence)
    { t: TT.s618, ...cutIn, draw: (ctx, t) => voidFrame(ctx, t) },                                                                                      // 6.18 (plan sequence)
    { t: TT.s619, ...cutIn, draw: (ctx, t) => voidFrame(ctx, t) },                                                                                      // 6.19 (plan sequence) → c09>c10
  ];
};
