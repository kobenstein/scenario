// Film 13 · B1 · c04 "The glass stays" (162.30 'Then the crash' → 214.84 'Maybe'), one take.
// docs/shots.md 4.01–4.09. Worlds, all carried:
//   X  (… ~186.6)  the explainer night of c03's end. The cross-section flips (the signature) and its back is a Global Crossing share;
//                  the stamp GLOBAL CROSSING · BANKRUPT · 2002 lands (cold blue); $12.4 BN debt, the sliver $250 M (new owners, 2002).
//                  The share clones into the old shareholders' stack; on "Nothing" they flip one by one: blank backs. The camera flies
//                  into the last blank sheet: on it TELECOM STOCKS crash and INTERNET TRAFFIC climbs (×4, USA 1997–2001) on through
//                  the bust, off the sheet, into a dark fibre of the bundle from c03; the fibres light one by one, the price of moving
//                  data falls (−99 %, 1998–2015).
//   Y  (… ~197.4)  ★ the pull-back: all of that is the screen of a phone held sideways in your hands (yellow sleeves), this film playing
//                  on it (progress bar); you at a window, a city of lit windows behind (more of them light on "everyone"). The camera
//                  pushes into one city window: its warm light fills the frame.
//   T  (… ~204.2)  out of that light: the point 2000 on the timeline of c03 (1840s, 2000); on "builders" a dashed third stretch runs
//                  right into the dark. Its head rises; the camera tilts with it.
//   H  (… ~212.2)  the head is the skylight of an empty warehouse: the beam pours down, dust sinks in it (hero); in the dark beside it
//                  the Bezos quote. On "society benefits" the dust settles. The beam drains into its floor pool, the pool into a point:
//   T' (… 214.84)  NOW on the timeline (centre-left, empty, pulsing); the past grows back to its left. c05's bars start from NOW.
import { Path2D, DOMMatrix } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
import * as U from './b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, F0, lin, rad, halo, prng, drift, project } = E;
const { COL } = B;
const { rise } = U;

// a 2D stage camera: stage point (x, y) at the screen centre, scale s; keys [t, s, x, y, ease]
export function stageCam(K, t) {
  if (t <= K[0][0]) return { s: K[0][1], x: K[0][2], y: K[0][3] };
  if (t >= K[K.length - 1][0]) { const k = K[K.length - 1]; return { s: k[1], x: k[2], y: k[3] }; }
  let i = 0; while (t > K[i + 1][0]) i++;
  const A = K[i], Bk = K[i + 1], e = Bk[4] === 'q' ? quartIO : typeof Bk[4] === 'function' ? Bk[4] : sineIO, u = e((t - A[0]) / (Bk[0] - A[0]));
  return { s: Math.exp(lerp(Math.log(A[1]), Math.log(Bk[1]), u)), x: lerp(A[2], Bk[2], u), y: lerp(A[3], Bk[3], u) };
}
export const stageM = (c) => new DOMMatrix([c.s, 0, 0, c.s, W / 2 - c.x * c.s, H / 2 - c.y * c.s]);
const NIGHT = (ctx) => { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(0, 0, W, H); };

export function build(a, c03) {
  // ---------- X: layout (stage px; the camera starts as the identity) ----------
  const tF0 = a.c04 - .25, tF1 = a.c04 + 1.2;   // same curve as c03's draw (the flip starts in c03)                         // the flip: cross-section → share
  const cS = c03.camS(tF0 + .6), fp = project(cS, F0, c03.FACE.x, c03.FACE.y), FC = { x: fp[0], y: fp[1] };
  const CW = 620, CH = CW * .66;
  const ST = { x: FC.x + 125, y: FC.y + 62 };                   // the stamp
  const BX = 1150, BL = 680, B1 = [350, 420], B2 = [580, 650];          // the debt bar and the sliver
  const STACK = [[-58, 40, -.07], [-30, 22, -.035], [26, 30, .04], [52, 14, .065]];   // clones under the top share (dx, dy, rot)
  const tClone0 = a.oldSh + .05, tClone1 = a.oldSh + .9;
  const flipT = (i) => a.nothing - .08 + i * .13;                        // i = 0 … 4 (4 = the top share, the stamped one)
  const tChart0 = a.whileC - .25, tChart1 = a.whileC + 1.75;              // fly into the top blank sheet
  // the chart on the sheet (sheet-local units, the sheet is CW × CH around FC)
  const X0 = -250, X1 = 250, YB = 160, YT = -150;
  const yr = (y) => lerp(X0, X1, (y - 1997) / 4);
  const STOCK = E.catmull([[yr(1997), 60], [yr(1998), 20], [yr(1999), -60], [yr(1999.6), -120], [yr(2000.1), -140], [yr(2000.5), -40], [yr(2001), 60], [yr(2001.5), 120], [yr(2001.9), 140]], 8);
  const TRAF = (() => { const p = []; for (let i = 0; i <= 24; i++) { const y = 1997 + 4 * i / 24, v = Math.pow(4, (y - 1997) / 4); p.push([yr(y), YB - 20 - (v - 1) / 3 * 230]); } return p; })();
  // the bundle (from c03) and the price curve
  const BU = { x: 1580, y: 380, r: 130 };
  const PR = { x: 1780, y: 240, w: 300, h: 200 };
  const FIB = c03.FIB, LIT0 = c03.LIT5, ENTRY = 52;                     // the traffic line lands in fibre ENTRY
  const fibPt = (i) => [BU.x + FIB[i][0] * BU.r * .6, BU.y + FIB[i][1] * BU.r * .6];
  const sheetPt = (p) => [FC.x + p[0], FC.y + p[1]];
  const TRAF2 = (() => { const last = sheetPt(TRAF[TRAF.length - 1]), e = fibPt(ENTRY); return E.catmull([last, [last[0] + 60, last[1] - 70], [last[0] + 130, last[1] - 70], [e[0] - 60, e[1] + 20], e], 10); })();
  const tUp0 = a.through - .3, tUp1 = a.through + 1.6;                   // the climb leaves the sheet and lands in the fibre
  const litOrder = (() => { const r = prng(4411), idx = FIB.map((_, i) => i).filter((i) => !LIT0.includes(i) && i !== ENTRY); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return idx; })();
  const litAt = (k) => a.spare + .4 + 5.4 * (1 - Math.pow(1 - k / litOrder.length, .55));   // one by one, faster and faster
  const KX = [
    [tF1, 1, W / 2, H / 2],
    [a.bankrupt - .04, 1.27, FC.x + 30, FC.y + 8],                       // push on the share while its name is said; the stamp lands
    [a.bankrupt + 1.6, .92, 1130, 560],
    [a.sliver + 1.0, .9, 1150, 560],
    [a.oldSh + .5, 1.06, FC.x + 40, FC.y + 30],
    [tChart0, 1.08, FC.x + 20, FC.y + 10],
    [tChart1, 2.3, FC.x + 10, FC.y - 2],
    [a.through - .4, 2.34, FC.x + 30, FC.y - 6],
    [tUp1 + .55, 2.05, 1640, 440],
    [a.sameNet - .3, 2.1, 1650, 440],
  ];
  // the follow of the climbing line (through − .2 → tUp1 + .3) is one sine move with a breath out in scale, no stop in the middle
  const tPan0 = a.through - .4, tPan1 = tUp1 + .55;
  const camPan = (t) => { const u = sineIO(span(t, tPan0, tPan1)); return { s: Math.exp(lerp(Math.log(2.34), Math.log(2.05), u) - .48 * Math.sin(Math.PI * u)), x: lerp(FC.x + 30, 1640, u), y: lerp(FC.y - 6, 440, u) }; };
  const camX = (t) => { const c = t > tPan0 && t < tPan1 ? camPan(t) : stageCam(KX, t), d = smooth(span(t, tF1, tF1 + 1.5)), pu = 1 + .06 * sineIO(span(t, a.ninety - .6, tPull0 + 3.5)); return { s: c.s * pu * (1 + .004 * d * Math.sin(t * .4)), x: c.x + drift(t, 4, 3) * d, y: c.y + drift(t, 3, 5) * d }; };
  // ---------- Y: the phone in your hands at the window ----------
  const PH = { x: 900, y: 646, w: 440 }; PH.h = PH.w * 9 / 16;
  const TW = { x: 1290, y: 360 };                                        // the city window we fly into
  const tPull0 = a.sameNet - .1, tPull1 = a.channel + .5, tCity = a.everyone;
  const tWin0 = a.subscribe + .2, tWarm = a.twice + .35;
  const KY = [
    [tPull0, 1920 / PH.w, PH.x, PH.y],
    [tPull1, 1, 960, 540, (u) => sineIO(1 - (1 - u) ** 1.7)],
    [tWin0, 1.05, 990, 520],
    [tWarm, 16, TW.x, TW.y, (u) => u ** 2],
  ];
  const camY = (t) => { const c = stageCam(KY, t), d = smooth(span(t, tPull1 - .5, tPull1 + 1)) * (1 - smooth(span(t, tWin0, tWin0 + 1))); return { ...c, x: c.x + drift(t, 5, 7) * d, y: c.y + drift(t, 3, 9) * d }; };
  // ---------- T: the timeline ----------
  const P1 = [560, 640], P2 = [1100, 640], P3 = [1640, 640];
  const tB0 = a.builders + .05, tB1 = a.builders + 1.1;
  const tRise0 = a.bezos - .9, tRise1 = a.bezos + .45;                   // the head rises, the camera tilts with it
  const Q = [1240, 130], HY = -570;              // the head ends at stage (Q[0], HY) = screen Q
  const KT = [[tWarm, 3.2, P2[0], P2[1]], [a.twice + 2.6, 1.45, 880, 600, (u) => sineIO(1 - (1 - u) ** 1.5)], [tB0, 1.46, 890, 598], [tRise0, 1.3, 1150, 600], [tRise1, 1, 960, HY + 540 - Q[1]]];
  // ---------- H: the warehouse ----------
  const tH = tRise1, tPour1 = tH + 1.0, tSettle = a.society;
  const FLOOR = 680, POOL = [760, 650];
  const tDrain0 = a.willRails - .25, tDrain1 = a.willRails + .9, tPt = a.willRails + 1.35;
  // ---------- T': NOW ----------
  const NOW = [760, 640], PA = [160, 640], PB = [460, 640];
  // the NOW timeline's camera: one slow push from the point's landing on through c05's opening hold (c05 continues these keys)
  const KT2 = [[tPt + .6, 1, 960, 540], [a.andYet - .2, 1.07, 975, 545]];

  function draw(ctx, t) {
    if (t < tPull0) return worldX(ctx, t);
    if (t < tWarm) return worldY(ctx, t);
    if (t < tH) return worldT(ctx, t);
    if (t < tPt) return worldH(ctx, t);
    return worldT2(ctx, t);
  }

  // ============================================================================================== X
  function worldX(ctx, t, M = null) {
    // M: an extra screen transform (the phone screen during the pull-back)
    ctx.save();
    if (M) ctx.setTransform(M);
    if (t < tF0 + (tF1 - tF0) / 2) {
      // the front of the flip: c03's cross-section (its own camera), squashed
      const u = sineIO(span(t, tF0, tF1)), sx = Math.cos(Math.PI * u);
      if (M) { NIGHT(ctx); } else c03.worldS(ctx, t, { sx: Math.max(.02, sx), noText: true });
      if (M) { ctx.restore(); return; }
      const g = Math.max(0, 1 - Math.abs(sx) * 4); if (g > 0) halo(ctx, FC.x, FC.y, 420 * g, .45 * g, P.halo0, P.core0);
      ctx.restore(); return;
    }
    NIGHT(ctx);
    const c = camX(t);
    ctx.transform(c.s, 0, 0, c.s, W / 2 - c.x * c.s, H / 2 - c.y * c.s);
    const k = c.s;
    // the stack of old shares (clones under the top one), the flips to blank
    const cl = expoOut(span(t, tClone0, tClone1));
    if (cl > 0) STACK.forEach(([dx, dy, r], i) => {
      const f = expoOut(span(t, flipT(i), flipT(i) + .7)), sx = Math.cos(Math.PI * f);
      share(ctx, FC.x + dx * cl, FC.y + dy * cl, r * cl, sx, false, t, f);
    });
    // the top share (the stamped one): flips last; its blank back is the chart's paper
    const uF = sineIO(span(t, tF0, tF1)), fTop = expoOut(span(t, flipT(4), flipT(4) + .7));
    const sxTop = t < tF1 ? Math.max(.02, -Math.cos(Math.PI * uF)) : Math.cos(Math.PI * fTop);
    share(ctx, FC.x, FC.y, 0, sxTop, true, t, fTop);
    if (t < tF1) { const g = Math.max(0, 1 - Math.abs(sxTop) * 4); if (g > 0) halo(ctx, FC.x, FC.y, 420 * g, .45 * g, P.halo0, P.core0); }
    debt(ctx, t, k);
    chart(ctx, t, k);
    bundle(ctx, t, k);
    price(ctx, t, k);
    ctx.restore();
  }

  function share(ctx, x, y, rot, sx, top, t, f) {
    // a Global Crossing share: paper, a border, the name, a small globe of lines; the back (sx < 0) is blank paper
    const w = CW, h = CH;
    if (Math.abs(sx) < .02) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(Math.abs(sx), 1);
    ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w, h);
    const body = new Path2D(); body.rect(-w / 2, -h / 2, w, h);
    B.paperFill(ctx, body, { lum: top ? 1 : .86, seed: top ? 3511 : 3521, lx: -w * .2, ly: -h * .3, r: w * 1.1 });
    if (sx > 0) {
      ctx.strokeStyle = rgba(COL.ink2, .55); ctx.lineWidth = 2; ctx.strokeRect(-w * .45, -h * .43, w * .9, h * .86); ctx.lineWidth = 1; ctx.strokeRect(-w * .43, -h * .4, w * .86, h * .8);
      ctx.fillStyle = rgba(COL.ink, .85); ctx.textAlign = 'center'; ctx.font = `${Math.round(w * .075)}px "Instrument Serif"`; ctx.fillText('GLOBAL CROSSING', 0, -h * .24);
      ctx.font = `600 ${Math.round(w * .046)}px Inter`; ctx.fillStyle = rgba(COL.ink2, .75); ctx.fillText('SHARE CERTIFICATE', 0, -h * .13);
      // the emblem: a globe of meridians and one fibre ring
      ctx.strokeStyle = rgba(COL.ink2, .6); ctx.lineWidth = 1.6; const gx = -w * .2, gy = h * .1, gr = h * .17;
      ctx.beginPath(); ctx.arc(gx, gy, gr, 0, 6.29); ctx.stroke();
      for (const e of [.35, .7]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * e, gr, 0, 0, 6.29); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(gx - gr, gy); ctx.lineTo(gx + gr, gy); ctx.stroke();
      ctx.fillStyle = rgba(COL.ink2, .3); for (let i = 0; i < 3; i++) ctx.fillRect(w * .02, h * .02 + i * h * .08, w * (.32 - i * .06), 2);
    }
    ctx.restore();
    if (top && sx > 0) stamp(ctx, t, sx, x, y);
  }

  function stamp(ctx, t, sx, x, y) {
    // lands on "bankrupt": a short fall (scale 1.25 → 1, expo out), a small jolt; cold blue ink, slightly worn
    const u = span(t, a.bankrupt - .12, a.bankrupt + .18); if (u <= 0) return;
    const sc = lerp(1.3, 1, expoOut(u)), al = Math.min(1, u * 3);
    const cx = x + (ST.x - FC.x) * sx, cy = y + (ST.y - FC.y);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.1); ctx.scale(sc * sx, sc); ctx.globalAlpha = al;
    const col = mixHex(COL.loss, COL.coolDeep, .4), sw = 340, sh = 176;
    ctx.strokeStyle = rgba(col, .92); ctx.lineWidth = 8; ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);
    ctx.lineWidth = 2.5; ctx.strokeRect(-sw / 2 + 12, -sh / 2 + 12, sw - 24, sh - 24);
    ctx.fillStyle = rgba(col, .95); ctx.textAlign = 'center';
    ctx.font = `600 28px Inter`; ctx.fillText('GLOBAL CROSSING', 0, -sh / 2 + 50);
    ctx.font = `700 58px Inter`; ctx.fillText('BANKRUPT', 0, 26);
    ctx.font = `600 28px Inter`; ctx.fillText('2002', 0, sh / 2 - 24);
    // worn ink: a few paper-coloured nicks across the stamp
    ctx.fillStyle = rgba(COL.paper1, .55); const r = prng(771); for (let i = 0; i < 26; i++) ctx.fillRect((r() - .5) * sw, (r() - .5) * sh, 4 + r() * 16, 2 + r() * 3);
    ctx.restore();
  }

  function debt(ctx, t, k) {
    const out = 1 - smooth(span(t, a.oldSh - .2, a.oldSh + .3)), back = 1 - sineIO(span(t, a.oldSh - .1, a.oldSh + .75));
    const g1 = expoOut(span(t, a.bankrupt + .25, a.bankrupt + 1.4)) * back, n1 = rise(span(t, a.bankrupt + .45, a.bankrupt + 1.0)), l1 = rise(span(t, a.bankrupt + .7, a.bankrupt + 1.25));
    const g2 = expoOut(span(t, a.sliver - .05, a.sliver + .5)) * back, n2 = rise(span(t, a.sliver + .1, a.sliver + .7)), l2 = rise(span(t, a.sliver + .45, a.sliver + 1.0));
    if (g1 <= .001) return;
    ctx.save(); ctx.globalAlpha = 1;
    // the debt: a long cold bar; it leaves to the right (the camera moves away) — drawn at full length, out = text mask only
    ctx.fillStyle = lin(ctx, 0, B1[0], 0, B1[1], [[0, mixHex(COL.cool2, COL.loss, .3)], [1, COL.loss]]); ctx.beginPath(); ctx.roundRect(BX, B1[0], BL * g1, B1[1] - B1[0], 5); ctx.fill();
    ctx.fillStyle = rgba(COL.cool, .5); ctx.fillRect(BX + 4, B1[0] + 1, Math.max(0, BL * g1 - 8), 2);
    K.maskLine(ctx, [['$12.4 BN', 0]], BX, B1[0] - 26, 130 / k, n1 * out, { col: P.cream });
    K.maskLine(ctx, [['DEBT', 0]], BX + K.measure('$12.4 BN', 130 / k) + 22 / k, B1[0] - 30, 40 / k, l1 * out, { serif: false, col: P.halo2, glow: false });
    if (g2 > 0) {
      const w2 = BL * 250 / 12400;
      ctx.fillStyle = lin(ctx, 0, B2[0], 0, B2[1], [[0, COL.paper0], [1, COL.paper2]]); ctx.fillRect(BX, B2[0], w2 * g2, B2[1] - B2[0]);
      halo(ctx, BX + w2 / 2, (B2[0] + B2[1]) / 2, 50, .3 * g2, P.halo1, P.core0);
      K.maskLine(ctx, [['$250 M', 0]], BX, B2[1] + 140 / k, 130 / k, n2 * out, { col: P.cream });
      K.maskLine(ctx, [['NEW OWNERS, 2002', 0]], BX + 4, B2[1] + 194 / k, 36 / k, l2 * out, { serif: false, col: P.halo2, glow: false });
    }
    ctx.restore();
  }

  function chart(ctx, t, k) {
    // on the top share's blank back (after its flip): two lines in sheet-local units
    const back = smooth(span(t, flipT(4) + .35, flipT(4) + .6)); if (back <= 0) return;
    const ax = smooth(span(t, tChart0 + .4, tChart0 + 1.2));
    const sU = sineIO(span(t, a.whileC + .5, a.crashed + 1.3)), tU = span(t, a.crashed + .4, a.through + .3);
    const out = 1 - smooth(span(t, a.spare + 1.4, a.spare + 2.0));
    ctx.save(); ctx.translate(FC.x, FC.y);
    if (ax > 0) { ctx.globalAlpha = ax; ctx.strokeStyle = rgba(COL.ink2, .6); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X0 - 20, YT - 20); ctx.lineTo(X0 - 20, YB); ctx.lineTo(X1 + 20, YB); ctx.stroke(); ctx.globalAlpha = 1;
      K.maskLine(ctx, [['1997', 0]], X0 - 20, YB + 22, 11, ax * out, { serif: false, col: COL.ink2, glow: false }); K.maskLine(ctx, [['2001', 0]], X1 - 8, YB + 22, 11, ax * out, { serif: false, col: COL.ink2, glow: false }); }
    if (sU > 0) {
      B.inkLine(ctx, STOCK, sU, { col: COL.ink, w: 2.6 });
      K.maskLine(ctx, [['TELECOM STOCKS', 0]], -112, -158, 15, rise(span(t, a.whileC + .7, a.whileC + 1.3)) * out, { serif: false, col: COL.ink, glow: false });
    }
    if (tU > 0) {
      B.inkLine(ctx, TRAF, sineIO(tU), { col: COL.coolDeep, w: 3, head: 0 });
      K.maskLine(ctx, [['INTERNET TRAFFIC', 0]], -40, 120, 15, rise(span(t, a.demand - .1, a.demand + .5)) * out, { serif: false, col: COL.coolDeep, glow: false });
      const n = rise(span(t, a.through - .2, a.through + .4));
      K.maskLine(ctx, [['×4', 0]], 140, 70, 56, n * out, { col: COL.coolDeep, glow: false });
      K.maskLine(ctx, [['USA 1997–2001', 0]], 142, 98, 11, rise(span(t, a.through + .1, a.through + .6)) * out, { serif: false, col: COL.ink2, glow: false });
    }
    ctx.restore();
  }

  function bundle(ctx, t, k) {
    // the cable's cross-section from c03 on the night (it was there all along, up-right of the sheet); the climb lands in fibre ENTRY
    const up = span(t, tUp0, tUp1); if (t < tUp0 - 1.5) return;
    const R = BU.r, core = R * .6, vis = smooth(span(t, tUp0 - 1.5, tUp0));
    ctx.save(); ctx.globalAlpha = 1;
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.beginPath(); ctx.arc(BU.x, BU.y, R, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(COL.cool2, .5); ctx.lineWidth = 1.4 / k * 2; ctx.beginPath(); ctx.arc(BU.x, BU.y, R * 1.01, 0, 6.29); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.arc(BU.x, BU.y, R * .78, 0, 6.29); ctx.fill();
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(BU.x, BU.y, core, 0, 6.29); ctx.fill();
    const arrive = smooth(span(t, tUp1 - .2, tUp1 + .2));
    FIB.forEach(([fx, fy], i) => {
      const x = BU.x + fx * core, y = BU.y + fy * core, rr = core * .062;
      const li = litOrder.indexOf(i), on = LIT0.includes(i) ? 1 : i === ENTRY ? arrive : li >= 0 ? expoOut(span(t, litAt(li), litAt(li) + .35)) : 0;
      ctx.fillStyle = mixHex(P.ind1, COL.coolDeep, .5); ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(COL.cool2, .18); ctx.lineWidth = rr * .22; ctx.beginPath(); ctx.arc(x, y, rr * .9, 0, 6.29); ctx.stroke();
      if (on > 0) { halo(ctx, x, y, rr * 4.5, .45 * on, COL.cool2, '#f4f7ff'); ctx.fillStyle = rgba('#f4f7ff', on); ctx.beginPath(); ctx.arc(x, y, rr * .75, 0, 6.29); ctx.fill(); }
    });
    ctx.restore();
    // the climb: off the sheet's corner, across the dark, into the fibre (cool light, a head)
    if (up > 0 && t < tUp1 + .4) B.inkLine(ctx, TRAF2, sineIO(up), { col: COL.cool, w: 3, glow: .6, head: 1, headCol: COL.cool2, headCore: '#f4f7ff', u0: Math.max(0, sineIO(up) - .45), a: 1 - smooth(span(t, tUp1, tUp1 + .4)) });
  }

  function price(ctx, t, k) {
    // the price of moving data: one falling curve of cool light on the night, −99 %
    const u = span(t, a.cheap - .4, a.ninety + .3); if (u <= 0) return;
    const pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40, v = Math.pow(1 / 1900, f * 1.0); pts.push([PR.x + f * PR.w, PR.y + PR.h - Math.pow(v, .28) * PR.h]); }
    ctx.strokeStyle = rgba(COL.cool2, .5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(PR.x, PR.y - 10); ctx.lineTo(PR.x, PR.y + PR.h); ctx.lineTo(PR.x + PR.w + 10, PR.y + PR.h); ctx.stroke();
    B.inkLine(ctx, E.catmull(pts, 2), sineIO(u), { col: COL.cool, w: 2.4, glow: .7, head: 1, headCol: COL.cool2, headCore: '#f4f7ff' });
    const n = rise(span(t, a.ninety - .05, a.ninety + .5)), l = rise(span(t, a.ninety + .3, a.ninety + .9)), s2 = rise(span(t, a.ninety + .55, a.ninety + 1.1));
    K.maskLine(ctx, [['−99 %', 0]], PR.x - 4, PR.y + PR.h + 80, 140 / k, n, { col: P.cream });
    K.maskLine(ctx, [['PRICE OF MOVING DATA', 0]], PR.x, PR.y + PR.h + 108, 36 / k, l, { serif: false, col: P.halo2, glow: false });
    K.maskLine(ctx, [['1998–2015', 0]], PR.x, PR.y + PR.h + 128, 26 / k, s2, { serif: false, col: rgba(P.halo2, .8), glow: false });
    K.maskLine(ctx, [['1998', 0]], PR.x - 4, PR.y + PR.h + 18 / k * 1.2, 24 / k, rise(span(t, a.cheap, a.cheap + .6)) * 0, { serif: false, col: P.halo2, glow: false });
  }

  // ============================================================================================== Y
  function worldY(ctx, t) {
    const c = camY(t), M = stageM(c);
    // the room (dark), the window, the city
    ctx.save(); ctx.setTransform(M);
    room(ctx, t);
    // the phone: its screen shows the explainer (the frame we were in), with the player's progress bar
    const sr = new DOMMatrix([PH.w / W, 0, 0, PH.w / W, PH.x - PH.w / 2, PH.y - PH.h / 2]);
    const SM = M.multiply(sr);
    ctx.save(); ctx.beginPath(); ctx.roundRect(PH.x - PH.w / 2, PH.y - PH.h / 2, PH.w, PH.h, 6); ctx.clip();
    worldX(ctx, t, SM);
    ctx.setTransform(SM);
    const bar = smooth(span(t, tPull0 + .2, tPull0 + .9)), prog = (t - 0) / 654.24;
    ctx.strokeStyle = rgba(COL.cool, .35 * bar); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(80, 1010); ctx.lineTo(lerp(80, 1840, bar), 1010); ctx.stroke();
    ctx.strokeStyle = rgba('#f4f7ff', .9 * bar); ctx.beginPath(); ctx.moveTo(80, 1010); ctx.lineTo(lerp(80, 80 + 1760 * prog, bar), 1010); ctx.stroke();
    if (bar > 0) { ctx.fillStyle = rgba('#f4f7ff', bar); ctx.beginPath(); ctx.arc(80 + 1760 * prog * bar, 1010, 16, 0, 6.29); ctx.fill(); }
    ctx.restore();
    ctx.setTransform(M);
    phoneBody(ctx, t);
    you(ctx, t);
    ctx.restore();
    U.lightFill(ctx, ...screenOf(M, TW), span(t, tWarm - 2.3, tWarm) ** 1.25, P.halo1, P.core0);   // accelerates into the light
  }
  const screenOf = (M, p) => [M.a * p.x + M.e, M.d * p.y + M.f];

  function room(ctx, t) {
    // the wall (dark indigo), the window: a big opening with mullions; behind it the city at night
    ctx.fillStyle = lin(ctx, 0, -400, 0, 1500, [[0, P.night0], [.5, mixHex(P.night1, P.ind1, .3)], [1, P.night0]]); ctx.fillRect(-2000, -2000, 6000, 5000);
    const WX0 = 240, WX1 = 1720, WY0 = 60, WY1 = 860;
    ctx.save(); ctx.beginPath(); ctx.rect(WX0, WY0, WX1 - WX0, WY1 - WY0); ctx.clip();
    city(ctx, t, WX0, WY0, WX1, WY1);
    ctx.restore();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .25);
    for (const x of [WX0, (WX0 + WX1) / 2 - 8, WX1 - 16]) ctx.fillRect(x, WY0, 16, WY1 - WY0);
    ctx.fillRect(WX0, WY0, WX1 - WX0, 14); ctx.fillRect(WX0, (WY0 + WY1) / 2 - 6, WX1 - WX0, 12);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fillRect(WX0 - 40, WY1, WX1 - WX0 + 80, 26);   // the sill
    ctx.fillStyle = rgba(COL.cool2, .25); ctx.fillRect(WX0 - 40, WY1, WX1 - WX0 + 80, 2);
  }

  const CITYW = (() => { const r = prng(9123), b = []; let x = 180; while (x < 1800) { const w = 60 + r() * 140, h = 180 + r() * 420, far = r() < .45; b.push({ x, w, h, far, seed: Math.floor(r() * 1e6) }); x += w * (far ? .6 : 1) + r() * 20; } return b; })();
  function city(ctx, t, x0, y0, x1, y1) {
    ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind1, P.shade1, .25)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    E.stars(ctx, 913, 50, t, [x0, y0, x1 - x0, 300], .4);
    const base = 820, more = smooth(span(t, tCity - .3, tCity + 2.2));
    for (const pass of [true, false]) for (const bd of CITYW) {
      if (bd.far !== pass) continue;
      const top = base - bd.h * (bd.far ? .8 : 1), r = prng(bd.seed);
      ctx.fillStyle = bd.far ? mixHex(P.night1, P.ind1, .5) : mixHex(P.night0, P.ind1, .35); ctx.fillRect(bd.x, top, bd.w, base - top + 60);
      for (let yy = top + 14; yy < base - 10; yy += 24) for (let xx = bd.x + 10; xx < bd.x + bd.w - 12; xx += 20) {
        const q = r(), on = q < .22 ? 1 : q < .5 ? smooth(clamp(more * 1.4 - (q - .22) * 3)) : 0;
        if (on <= 0) continue;
        ctx.fillStyle = rgba(q < .05 ? COL.cool : P.halo1, (bd.far ? .45 : .75) * on * (.85 + .15 * Math.sin(t * .7 + q * 40))); ctx.fillRect(xx, yy, 9, 12);
      }
    }
    // the window we fly into (a warm one, a little brighter)
    ctx.fillStyle = rgba(P.halo1, .95); ctx.fillRect(TW.x - 5, TW.y - 6, 10, 12); halo(ctx, TW.x, TW.y, 30, .25, P.halo1, P.core0);
  }

  function phoneBody(ctx, t) {
    // the phone's body round the screen (dark), and the screen's cool light on the hood edge
    ctx.save(); ctx.fillStyle = P.night0; const m = 10;
    const outer = new Path2D(); outer.roundRect(PH.x - PH.w / 2 - m, PH.y - PH.h / 2 - m, PH.w + 2 * m, PH.h + 2 * m, 18); outer.roundRect(PH.x - PH.w / 2, PH.y - PH.h / 2, PH.w, PH.h, 6);
    ctx.fill(outer, 'evenodd'); ctx.restore();
    halo(ctx, PH.x, PH.y, PH.w * .9, .18 * smooth(span(t, tPull0, tPull0 + 1.4)), COL.cool2, COL.cool);
  }

  function you(ctx, t) {
    // you, from behind (over the shoulder): the kit's figure in the yellow coat, hood up, the right arm raised to the phone's end;
    // the phone's cool light rims the hood and the shoulder on its side. Breathing: a slow rise and fall of the whole figure.
    const br = Math.sin(t * 1.25) * 4, up = 1 - sineIO(span(t, tPull0, tPull0 + 2.0));
    E.du(ctx, 430 - 260 * up, 1745 + br + 420 * up, 1350, { view: 'back', armR: [.45, Math.PI - .1 + .015 * Math.sin(t * .9)], light: 1 });
  }

  // ============================================================================================== T: the timeline (2000)
  function timelineBase(ctx, t, o) {
    // the line, the points 1840s / 2000 with their icons; o.third (0..1), o.head (screen pos override), o.out (exit share)
    const lu = o.line ?? 1;
    B.inkLine(ctx, [[o.p1[0], o.p1[1]], [lerp(o.p1[0], o.p2[0], lu), o.p2[1]]], 1, { col: P.halo1, w: 3, glow: .5 });
    for (const [p, lab, ic, k] of [[o.p1, '1840s', 'rail', o.k1 ?? 1], [o.p2, '2000', 'fibre', o.k2 ?? 1]]) {
      if (k <= 0) continue;
      halo(ctx, p[0], p[1], 50, .45 * k, P.halo1, P.core0); ctx.fillStyle = mixHex(P.halo1, P.core0, .3); ctx.beginPath(); ctx.arc(p[0], p[1], 11 * k, 0, 6.29); ctx.fill();
      K.maskLine(ctx, [[lab, 0]], p[0], p[1] + 70, 44, (o.lk ?? 1) * k, { serif: false, col: P.cream, glow: false, align: 'center' });
      const iu = (o.ik ?? 1) * k; if (iu <= 0) continue;
      ctx.save(); ctx.globalAlpha = iu;
      if (ic === 'rail') {   // a short length of track seen from the side: two rails on sleepers
        ctx.fillStyle = mixHex(P.shade0, P.halo1, .35); for (let i = 0; i < 5; i++) ctx.fillRect(p[0] - 62 + i * 29, p[1] - 76, 14, 22);
        ctx.fillStyle = P.halo1; ctx.fillRect(p[0] - 72, p[1] - 88, 144, 8); ctx.fillStyle = rgba(P.core0, .7); ctx.fillRect(p[0] - 72, p[1] - 88, 144, 2);
      } else {   // the bundle's cross-section in small: a ring, seven fibres, the lit ones cool white
        ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.beginPath(); ctx.arc(p[0], p[1] - 84, 38, 0, 6.29); ctx.fill();
        ctx.strokeStyle = COL.cool2; ctx.lineWidth = 3; ctx.stroke();
        for (let i = 0; i < 7; i++) { const an = i / 6 * 6.28, rr = i ? 19 : 0; ctx.fillStyle = i % 3 === 0 ? '#f4f7ff' : COL.cool2; ctx.beginPath(); ctx.arc(p[0] + Math.cos(an) * rr, p[1] - 84 + Math.sin(an) * rr, 6, 0, 6.29); ctx.fill(); }
      }
      ctx.restore();
    }
  }

  function worldT(ctx, t) {
    NIGHT(ctx);
    const c = stageCam(KT, t);
    ctx.save(); ctx.setTransform(stageM(c));
    const p1 = expoOut(span(t, tWarm + .5, tWarm + 1.4)), l = sineIO(span(t, tWarm + .3, tWarm + 1.5));
    timelineBase(ctx, t, { p1: P1, p2: P2, line: 1, k1: smooth(span(t, tWarm + .9, tWarm + 1.4)), k2: 1, lk: rise(span(t, tWarm + .6, tWarm + 1.2)), ik: smooth(span(t, a.twice + .6, a.twice + 1.4)) });
    // the third stretch: dashed, into the dark; its head rises and becomes the light of the warehouse
    const th = expoOut(span(t, tB0, tB1));
    if (th > 0) {
      ctx.save(); ctx.setLineDash([14, 16]); ctx.strokeStyle = rgba(P.halo1, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P2[0] + 16, P2[1]); ctx.lineTo(lerp(P2[0], P3[0], th), P3[1]); ctx.stroke(); ctx.restore();
      const rs = sineIO(span(t, tRise0, tRise1)), hp = [lerp(lerp(P2[0], P3[0], th), Q[0], rs), lerp(P3[1], HY, rs) - Math.sin(rs * Math.PI) * 120];
      const dk = .97 * smooth(span(t, tRise0, tH));
      if (dk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, dk); ctx.fillRect(0, 0, W, H); ctx.restore(); }
      halo(ctx, hp[0], hp[1], 46, .7, P.halo1, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(hp[0], hp[1], 7, 0, 6.29); ctx.fill();
    }
    ctx.restore();
    U.lightFill(ctx, W / 2, H / 2, (1 - span(t, tWarm, tWarm + 1.7)) ** 1.6, P.halo1, P.core0);
  }

  // ============================================================================================== H: the warehouse
  const MOTES = (() => { const r = prng(8833), m = []; for (let i = 0; i < 220; i++) m.push([r(), r(), 1.2 + r() * 2.2, r() * 6.3, .4 + r()]); return m; })();
  function worldH(ctx, t) {
    const ent = smooth(span(t, tH, tH + 1.6)) * (1 - smooth(span(t, tDrain0 - .3, tPt))), dr = 1 + (.012 * smooth(span(t, tH, tH + 4)) + .004 * Math.sin(t * .3)) * ent, dx = drift(t, 6, 21) * ent, dy = drift(t, 4, 23) * ent;   // r3: settles to identity at tPt (the NOW world)
    const pour = sineIO(span(t, tH - .05, tPour1)), drain = sineIO(span(t, tDrain0, tDrain1)), lit = pour * (1 - .85 * drain);
    ctx.save();
    NIGHT(ctx);
    ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(dr, dr); ctx.translate(-W / 2, -H / 2);
    // the hall: back wall with tall windows, columns, roof trusses, a concrete floor with joints running to the far wall.
    // It is revealed only by the beam's light (a darkness that opens round the beam as it pours and closes as it drains).
    ctx.fillStyle = lin(ctx, 0, -100, 0, FLOOR, [[0, P.night0], [1, mixHex(P.night1, P.ind1, .55)]]); ctx.fillRect(-200, -200, W + 400, FLOOR + 200);
    for (const wx of [1000, 1480, 1800]) {   // tall windows: a faint cool night outside, mullions
      ctx.fillStyle = mixHex(P.night1, P.ind0, .6); ctx.fillRect(wx - 70, 150, 140, 380);
      ctx.fillStyle = rgba(COL.cool2, .1); ctx.fillRect(wx - 70, 150, 140, 380);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .3); for (let i = 1; i < 3; i++) ctx.fillRect(wx - 70 + i * 140 / 3 - 3, 150, 6, 380); for (let j = 1; j < 5; j++) ctx.fillRect(wx - 70, 150 + j * 76 - 3, 140, 6);
      ctx.fillStyle = rgba(COL.cool2, .3); ctx.fillRect(wx - 72, 530, 144, 3);
    }
    ctx.fillStyle = lin(ctx, 0, FLOOR, 0, H + 100, [[0, mixHex(P.ind1, P.blue1, .3)], [1, P.night0]]); ctx.fillRect(-200, FLOOR, W + 400, H);
    ctx.save(); ctx.beginPath(); ctx.rect(-200, FLOOR, W + 400, H); ctx.clip();
    ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 2; for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(960 + i * 150, FLOOR); ctx.lineTo(960 + i * 520, H + 100); ctx.stroke(); }
    for (const y of [FLOOR + 40, FLOOR + 120, FLOOR + 260]) { ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-200, y, W + 400, 2); }
    ctx.restore();
    ctx.fillStyle = rgba(P.halo2, .22); ctx.fillRect(-200, FLOOR, W + 400, 2);
    for (const x of [160, 520, 1060, 1420, 1780]) {
      ctx.fillStyle = mixHex(P.night1, P.ind1, .3); ctx.fillRect(x - 22, -100, 44, FLOOR + 100);
      const side = x < POOL[0] ? 1 : -1; ctx.fillStyle = rgba(P.halo1, .14 / (1 + Math.abs(x - POOL[0]) / 500)); ctx.fillRect(x + side * 16 - 3, -100, 6, FLOOR + 100);
    }
    ctx.strokeStyle = mixHex(P.night1, P.ind1, .4); ctx.lineWidth = 9;
    for (let x = -100; x < W + 200; x += 360) { ctx.beginPath(); ctx.moveTo(x, 50); ctx.lineTo(x + 180, -30); ctx.lineTo(x + 360, 50); ctx.moveTo(x, 50); ctx.lineTo(x + 360, 50); for (let k = 1; k < 4; k++) { ctx.moveTo(x + k * 90, 50); ctx.lineTo(x + k * 90, 50 - 80 * (1 - Math.abs(k * 90 - 180) / 180)); } ctx.stroke(); }
    // the light on the far wall behind the beam and on the floor round the pool
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, POOL[0] + 120, 420, 520, [[0, rgba(P.shade0, .16 * lit)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-200, -200, W + 400, FLOOR + 200);
    ctx.restore();
    // the darkness round the light
    const R = lerp(160, 1700, pour) * (1 - .75 * drain) + 40, op = smooth(span(t, tH, tH + 1.0)) * (1 - smooth(span(t, tDrain1 - .2, tPt)));
    ctx.fillStyle = rad(ctx, (Q[0] + POOL[0]) / 2, (Q[1] + POOL[1]) / 2 + 60, R, [[0, rgba(P.night0, .97 * (1 - op))], [.4, rgba(P.night0, lerp(.97, .2, op))], [.8, rgba(P.night0, lerp(.97, .75, op))], [1, rgba(P.night0, .97)]]);
    ctx.fillRect(-200, -200, W + 400, H + 400);
    // the skylight (it was the head of the dashed line) and the beam pouring down to its pool on the floor
    const top = Q, foot = POOL, wTop = 46, wFoot = 280;
    const sk = smooth(span(t, tH, tH + .7));
    halo(ctx, top[0], top[1], lerp(46, 60 + 40 * pour, sk), .7 * (1 - drain * .7), P.halo1, P.core0);
    if (sk < 1) { ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(top[0], top[1], 7 * (1 - sk), 0, 6.29); ctx.fill(); }
    ctx.fillStyle = P.core0; ctx.fillRect(top[0] - 24 * (1 - drain) * sk, top[1] - 7 * sk, 48 * (1 - drain) * sk, 14 * sk);
    const len = pour, dTop = drain;   // drains from the top down
    if (len > 0 && dTop < 1) {
      const p0 = [lerp(top[0], foot[0], dTop), lerp(top[1], foot[1], dTop)], p1 = [lerp(top[0], foot[0], len), lerp(top[1], foot[1], len)];
      const w0 = lerp(wTop, wFoot, dTop), w1 = lerp(wTop, wFoot, len);
      const beam = new Path2D(); beam.moveTo(p0[0] - w0 / 2, p0[1]); beam.lineTo(p0[0] + w0 / 2, p0[1]); beam.lineTo(p1[0] + w1 / 2, p1[1]); beam.lineTo(p1[0] - w1 / 2, p1[1]); beam.closePath();
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, top[0], top[1], foot[0], foot[1], [[0, rgba(P.halo0, .6)], [.6, rgba(P.halo1, .33)], [1, rgba(P.shade0, .22)]]); ctx.fill(beam);
      const soft = new Path2D(); soft.moveTo(p0[0] - w0, p0[1]); soft.lineTo(p0[0] + w0, p0[1]); soft.lineTo(p1[0] + w1 * .85, p1[1]); soft.lineTo(p1[0] - w1 * .85, p1[1]); soft.closePath();
      ctx.fillStyle = rgba(P.halo1, .07); ctx.fill(soft);
      ctx.restore();
      // the dust in the beam: sinking slowly; on "society benefits" it settles to the floor
      const settle = smooth(span(t, tSettle - .1, tSettle + 1.6));
      ctx.save(); ctx.clip(beam); ctx.fillStyle = P.core1;
      for (const [u, v, s, ph, f] of MOTES) {
        const yy = ((v + (t - tH) * .022 * f) % 1), yS = lerp(yy, .985 + .012 * Math.sin(ph), settle), along = lerp(top[1], foot[1], yS);
        const wAt = lerp(wTop, wFoot, yS), xc = lerp(top[0], foot[0], yS);
        ctx.globalAlpha = (.35 + .4 * Math.sin(t * f + ph) ** 2) * (1 - drain);
        ctx.fillRect(xc + (u - .5) * wAt * .9 + Math.sin(t * .5 * f + ph) * 6 * (1 - settle), along, s, s);
      }
      ctx.restore();
    }
    // the pool on the floor; at the end it shrinks into the point NOW
    const pk = 1 - sineIO(span(t, tDrain1 - .2, tPt));
    const pl = expoOut(span(t, tH + .55, tPour1 + .4));   // the pool spreads as the beam lands
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, foot[0], foot[1], 220 * pk * (.35 + .65 * pl) + 1, [[0, rgba(P.halo0, .7 * pl)], [.45, rgba(P.halo1, .3 * pl)], [1, rgba(P.shade0, 0)]]);
    ctx.beginPath(); ctx.ellipse(foot[0], foot[1], 220 * pk * (.35 + .65 * pl) + 1, 46 * pk * (.35 + .65 * pl) + 1, 0, 0, 6.29); ctx.fill();
    ctx.restore();
    if (t > tDrain1 - .2) { halo(ctx, NOW[0], NOW[1], 50, .6 * (1 - pk), P.halo1, P.core0); }
    // the quote, in the dark beside the beam
    const q = rise(span(t, a.industrial - .15, a.industrial + .5)), qa = rise(span(t, a.industrial + .5, a.industrial + 1.1)), qo = 1 - smooth(span(t, tDrain0 - .4, tDrain0 + .1));
    if (q > 0 && qo > 0) {
      K.maskLine(ctx, [['“a kind of', 0]], 140, 300, 76, q * qo, { col: P.cream });
      K.maskLine(ctx, [['industrial bubble”', 0]], 140, 384, 76, rise(span(t, a.industrial - .05, a.industrial + .6)) * qo, { col: P.cream });
      K.maskLine(ctx, [['— Jeff Bezos, Italian Tech Week, October 2025', 0]], 146, 448, 26, qa * qo, { serif: false, col: P.halo2, glow: false });
    }
    ctx.restore();
  }

  // ============================================================================================== T': NOW
  function worldT2(ctx, t) {
    NIGHT(ctx);
    const dk = .97 * (1 - smooth(span(t, tPt, tPt + 1.4)));
    if (dk > 0) { ctx.fillStyle = rgba(P.night0, dk); ctx.fillRect(0, 0, W, H); }
    ctx.save(); ctx.setTransform(stageM(stageCam(KT2, t)));
    const g = expoOut(span(t, tPt, tPt + 1.4)), gb = expoOut(span(t, tPt + .3, tPt + 1.6));
    // the line grows back to the left (the past), points return; NOW is an empty ring that pulses (a question)
    B.inkLine(ctx, [[NOW[0], NOW[1]], [lerp(NOW[0], PA[0], g), NOW[1]]], 1, { col: P.halo1, w: 3, glow: .5 });
    timelinePoint(ctx, PB, '2000', smooth(span(t, tPt + .15, tPt + .6)), t);
    timelinePoint(ctx, PA, '1840s', smooth(span(t, tPt + .5, tPt + 1.0)), t);
    // the axis on into the future: faint, dashed (c05's bars grow along it)
    ctx.save(); ctx.setLineDash([10, 14]); ctx.strokeStyle = rgba(COL.paper1, .3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(NOW[0] + 20, NOW[1]); ctx.lineTo(lerp(NOW[0] + 20, 1620, gb), NOW[1]); ctx.stroke(); ctx.restore();
    const pr = 16 + 2.5 * Math.sin((t - tPt) * 3.2) * smooth(span(t, tPt + .3, tPt + 1));
    ctx.strokeStyle = rgba(P.halo1, .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(NOW[0], NOW[1], pr * smooth(span(t, tPt, tPt + .4)), 0, 6.29); ctx.stroke();
    halo(ctx, NOW[0], NOW[1], 50, .45 * (1 - smooth(span(t, tPt, tPt + .8))) + .15, P.halo1, P.core0);
    K.maskLine(ctx, [['NOW', 0]], NOW[0], NOW[1] + 70, 44, rise(span(t, a.thisTime - .1, a.thisTime + .5)), { serif: false, col: P.cream, glow: false, align: 'center' });
    ping(ctx, t);
    ctx.restore();
  }
  // the question: NOW sends out slow, faint rings (one every 1.3 s, each lives 2.4 s); c05 stops emitting when the ring folds
  function ping(ctx, t, stop = Infinity) {
    const T0p = tPt + 1.1, per = 1.3, L = 2.4;
    if (t < T0p) return;
    const n0 = Math.floor((t - T0p) / per);
    for (let n = n0 - 1; n <= n0; n++) {
      if (n < 0 || T0p + n * per > stop) continue;
      const u = (t - T0p - n * per) / L; if (u < 0 || u > 1) continue;
      const r = 18 + 300 * (1 - (1 - u) ** 1.7), al = .55 * (1 - u) ** 1.5;
      ctx.strokeStyle = rgba(P.halo1, al); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(NOW[0], NOW[1], r, 0, 6.29); ctx.stroke();
    }
  }
  function timelinePoint(ctx, p, lab, k, t) {
    if (k <= 0) return;
    halo(ctx, p[0], p[1], 46, .4 * k, P.halo1, P.core0); ctx.fillStyle = mixHex(P.halo1, P.core0, .3); ctx.beginPath(); ctx.arc(p[0], p[1], 10 * k, 0, 6.29); ctx.fill();
    K.maskLine(ctx, [[lab, 0]], p[0], p[1] + 70, 44, k, { serif: false, col: P.cream, glow: false, align: 'center' });
  }

  draw.KT2 = KT2; draw.ping = ping; draw.NOW = NOW; draw.PA = PA; draw.PB = PB; draw.tPt = tPt; draw.timelinePoint = timelinePoint;
  return draw;
}
