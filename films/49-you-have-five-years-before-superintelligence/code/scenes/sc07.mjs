// Film 49 · c07 (B2) · STEP 3 · YOUR FAMILY. Part of B2's one continuous take: the driver lives in scenes/sc06.mjs (groupB2), this
// file holds the c07 layers (camera keys, world pieces on tread 2, screen layers). The default export returns the same draw as c06/c08.
//
// | beat  | phrase (VO)                          | picture                                                                                   | camera / kind     |
// |-------|--------------------------------------|-------------------------------------------------------------------------------------------|-------------------|
// | 3.01  | Three years to go · your family …    | STEP HIT (F.stepLight): tread 2 lights, the office folds, the home pops up (window, the   | rise · MIX        |
// |       |                                      | half-open door, a bed: a screen glowing under the blanket); you climb the carved stair    |                   |
// | 3.02  | Three in four teenagers …            | four teenagers pop up out of the tread, three with a glowing device; data card KNOWN 77 % | stage left · EXPL |
// |       | Most have tried an A.I. companion    | + TRIED AN A.I. COMPANION: 72 % (2025)                                                    |                   |
// | 3.03  | California now has a law …           | a chat window grows out of the glow under the blanket; every three hours (9 PM · 12 AM ·  | push · EXPL       |
// |       |                                      | 3 AM) the line “I am not a human.” appears; source SB 243                                 |                   |
// | 3.04★ | Somebody had to write that sentence  | the window closes in on the line: “I am not a human.” alone on the dark, a gold stroke    | creep · EXPL      |
// |       |                                      | writes under it (into law)                                                                 |                   |
// | 3.05  | Harari has a name …                  | the sentence sinks, a paper card rises: YUVAL NOAH HARARI, the quote lights word by word  | creep · EXPL      |
// | 3.06  | C16                                  | C16 grows out of the card and goes back into it                                           | CLIP              |
// | 3.07  | This time, the next generation …     | the child sits up from under the blanket, the screen in its hands; you look at it         | push · MIX        |
// | 3.08  | The reflex is to forbid … hide them  | the plug is pulled out of the wall; the child slides back under the blanket, it glows on  | wider · MIX       |
// | 3.09  | So ask instead · the three questions | you sit on the bed edge, the child sits up, the screen between you; WHICH A.I. DO YOU     | stage right · EXPL|
// |       | Then ask to read one chat together   | TALK TO? · WHAT FOR? · ONE YOU’D CALL A FRIEND? · READ ONE CHAT TOGETHER (gold)           |                   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, halo, P, W, H } = E;
const { GOLD, PAPER, COOL } = F;
const TAU = Math.PI * 2;
export default async (T, R) => (await import('./sc06.mjs')).groupB2(T, R);

const Y2 = () => S.STAGES[2].y, BX = () => S.STAGES[2].x0 + 250;   // the bed of the family set (lib SETS[2])
const SIL = () => mixHex(P.night0, P.ind1, .22);
export const SOCKET = { x: 997, y: 522 };

export const keys = (a, A) => [
  [a.family + 1.1, A(1150, 488, 2.05, 900, 610)],
  [a.teens + .9, A(1250, 478, 2.0, 610, 600)],
  [a.california + 1.0, A(1305, 488, 2.32, 600, 620)],
  [a.somebody + .3, A(1314, 488, 2.5, 640, 620)],
  [a.C16.end + 1.4, A(1292, 474, 2.55, 960, 620)],
  [a.reflex + .7, A(1172, 488, 2.28, 940, 620)],
  [a.q1 + .3, A(1292, 474, 2.42, 1180, 640)],
  [a.protects + 2.2, A(1300, 470, 2.55, 1190, 640)],
];

// ---- the family stage (tread 2): up on the step hit, folds when you have climbed to step 2 (c08)
const famU = (t, a) => span(t, a.hit2, a.hit2 + 1.0) * (1 - span(t, a.itself + 1.6, a.itself + 2.6));
export function state(t, H, st) { const a = H.a; st.stage[2] = famU(t, a); }

// the child: under the blanket (hidden), sits up, hides again, sits up, lies down (0 = under, 1 = up)
function childUp(t, a) {
  return smooth(span(t, a.adapt + .4, a.adapt + 1.3)) * (1 - smooth(span(t, a.ban + .3, a.ban + 1.1)))
    + smooth(span(t, a.q1 - .3, a.q1 + .5)) * (1 - smooth(span(t, a.two - .25, a.two + .6)));
}
const CHILD = { x: 1338, h: 104 };
function devicePos(t, a, hands) {   // where the screen is: under the blanket, or in the child's hands
  const up = childUp(t, a), bx = BX(), y = Y2(), u = { x: bx + 120, y: y - 50 };
  return hands ? { x: lerp(u.x, hands.x, up), y: lerp(u.y, hands.y, up), up } : { ...u, up };
}
const devGlow = (t, a) => 1 - .55 * F.bump(t, a.forbid + .05, .7);   // the plug: it flickers, then keeps glowing (battery)

// drawn BEFORE you (behind the divan): the child
export function landBehind(ctx, t, H, c) {
  const a = H.a, u = famU(t, a); if (u <= 0) return;
  const up = childUp(t, a), y = Y2(); if (up <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(CHILD.x - 200, y - 400, 400, 399); ctx.clip();
  const hands = E.person(ctx, CHILD.x, y + lerp(112, 14, up), CHILD.h, { pose: 'hold', dir: -1, look: lerp(-.2, .1, smooth(span(t, a.q1, a.q1 + 1))), back: .2, light: .8, lean: -.05 * smooth(span(t, a.read, a.read + .8)) });
  ctx.restore();
  H.childHands = { x: hands.R[0], y: hands.R[1] };
}

// drawn AFTER you: the bed (divan + blanket + the glow), the cord and plug, the teenagers, the screen in the child's hands
export function land(ctx, t, H, c) {
  const a = H.a, u = famU(t, a); if (u <= 0) { H.childHands = null; return; }
  const y = Y2(), bx = BX(), k = H.popK(u, 1), up = childUp(t, a), g = (.6 + .4 * Math.sin(t * 1.7)) * devGlow(t, a);
  const dev = devicePos(t, a, H.childHands);
  // the bed, repainted as a divan so you can sit on its edge (same silhouette as the set's bed)
  H.popScale(ctx, k, y, () => {
    ctx.fillStyle = SIL(); ctx.fillRect(bx, y - 40, 232, 40); ctx.fillRect(bx, y - 74, 12, 74); ctx.fillRect(bx + 222, y - 50, 10, 50);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); const lump = 30 * (1 - up);
    ctx.beginPath(); ctx.moveTo(bx + 30, y - 40); ctx.bezierCurveTo(bx + 60, y - 50 - lump, bx + 170, y - 46 - lump * .9, bx + 222, y - 42); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.blue1, .35); ctx.fillRect(bx + 14, y - 40, 206, 2);
    if (dev.up < .5) { ctx.fillStyle = rgba(COOL.core, .35 * g * u * (1 - dev.up * 2)); ctx.fillRect(bx + 100, y - 58, 40, 6); }
  });
  // the cord: from the socket on the wall to the screen; on 'forbid' the plug jumps out and drops to the floor
  const pu = span(t, a.forbid + .05, a.forbid + .4), plug = { x: lerp(SOCKET.x, SOCKET.x + 40, pu), y: lerp(SOCKET.y, y - 3, pu) - 18 * Math.sin(Math.PI * pu) };
  H.popScale(ctx, k, y, () => {
    ctx.fillStyle = SIL(); ctx.fillRect(SOCKET.x - 7, SOCKET.y - 9, 14, 18); ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(SOCKET.x - 4, SOCKET.y - 5, 8, 10);
    ctx.strokeStyle = mixHex(P.night0, P.ind1, .4); ctx.lineWidth = 3; ctx.lineCap = 'round';
    const mx = (plug.x + dev.x) / 2;
    ctx.beginPath(); ctx.moveTo(plug.x, plug.y); ctx.quadraticCurveTo(mx - 40, y + 8, Math.min(dev.x, bx + 10), y - 6); ctx.lineTo(dev.x, dev.y + 4); ctx.stroke();
    ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(plug.x - 6, plug.y - 5, 12, 10);
  });
  // the screen: under the blanket a glow; in the child's hands a small lit tablet that lights the faces
  if (dev.up > .02) { ctx.fillStyle = mixHex(P.night1, COOL.body, .85 * g); ctx.save(); ctx.translate(dev.x, dev.y); ctx.rotate(-.25); ctx.fillRect(-11, -9, 22, 15); ctx.restore(); }
  halo(ctx, dev.x, dev.y - 6, lerp(70, 110, dev.up) * k, lerp(.32, .4, dev.up) * g * u * (1 + .35 * smooth(span(t, a.read, a.read + 1)) * (1 - span(t, a.act, a.act + 2))), COOL.halo, COOL.core);
  // the teenagers: four pop up out of the tread in front of the bed, three with a glowing device
  const tin = a.teens - .15, tout = a.california - .45;
  [[1226, 122, 1], [1296, 116, 0], [1366, 128, 1], [1436, 120, 1]].forEach(([x, h, dv], i) => {
    const kk = expoOut(span(t, tin + i * .08, tin + .7 + i * .08)) * (1 - expoOut(span(t, tout + (3 - i) * .06, tout + .5 + (3 - i) * .06)));
    if (kk <= 0) return;
    H.popScale(ctx, kk, y, () => {
      const hh = E.person(ctx, x, y, h, dv ? { pose: 'hold', dir: i === 3 ? -1 : 1, look: -.25, light: .7 } : { dir: 1, look: .35, light: .7 });
      if (dv) { const gl = .7 + .3 * Math.sin(t * 2.1 + i); ctx.fillStyle = mixHex(P.night1, COOL.body, .9 * gl); ctx.fillRect(hh.R[0] - 6, hh.R[1] - 9, 12, 9); halo(ctx, hh.R[0], hh.R[1] - 8, 46, .38 * gl, COOL.halo, COOL.core); }
    });
  });
}

// ---- the chat window (screen space): grows out of the glow under the blanket; the line every three hours; the sentence ★
const CH = { x: 1080, y: 150, w: 640, h: 620 };
const ITEMS = (() => {
  const L = [['b', 'L', .62], ['b', 'R', .42], ['b', 'L', .7], ['s', '9:00 PM'], ['y'], ['b', 'R', .5], ['b', 'L', .66], ['b', 'R', .38], ['s', '12:00 AM'], ['y'],
    ['b', 'L', .58], ['b', 'R', .48], ['b', 'L', .72], ['s', '3:00 AM'], ['y'], ['b', 'R', .4]];
  let p = 0; const out = [];
  for (const it of L) { const h = it[0] === 'b' ? 52 : it[0] === 's' ? 30 : 56; out.push({ kind: it[0], side: it[1], w: it[2], txt: it[1], y: p, h }); p += h + 16; }
  return out;
})();
const SENT = '“I am not a human.”';
function chat(ctx, t, H, c) {
  const a = H.a, inner = CH.y + 82, readY = CH.y + CH.h - 160;
  const sys = ITEMS.filter((i) => i.kind === 'y'), off = (it) => it.y + it.h / 2 - (readY - inner);
  const tS = [a.child + .1, a.hours + .55, a.notHuman + .35];
  const scroll = H.mono(t, [[a.california + 1.4, off(sys[0]) - 190], [tS[0], off(sys[0])], [tS[1], off(sys[1])], [tS[2], off(sys[2])], [a.somebody + .4, off(sys[2]) + 14]]);
  const grow = sineIO(span(t, a.california - .1, a.california + 1.7));
  const z = sineIO(span(t, a.somebody - .25, a.somebody + 1.55));   // ★: the window closes in on the last line
  if (grow <= 0) return;
  // the sentence's place: from its slot in the window to the centre of the frame
  const s3y = inner + sys[2].y + sys[2].h / 2 - scroll, size = lerp(34, 104, z), sx = lerp(CH.x + CH.w / 2, W / 2, z), sy = lerp(s3y + 12, 470, z);
  const sw = F.measure(SENT, size, true) + lerp(60, 0, z);
  const p0 = H.proj(c, BX() + 120, Y2() - 52), from = { x: p0.x - 24, y: p0.y - 8, w: 48, h: 16 };
  let fr = { x: lerp(from.x, CH.x, grow), y: lerp(from.y, CH.y, grow), w: lerp(from.w, CH.w, grow), h: lerp(from.h, CH.h, grow) };
  if (z > 0) { const tg = { x: sx - sw / 2 - 30, y: sy - size * .95, w: sw + 60, h: size * 1.35 }; fr = { x: lerp(fr.x, tg.x, z), y: lerp(fr.y, tg.y, z), w: lerp(fr.w, tg.w, z), h: lerp(fr.h, tg.h, z) }; }
  const frameA = 1 - smooth(span(z, .55, 1));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (frameA > 0) {
    ctx.globalAlpha = frameA;
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(fr.x + 8, fr.y + 12, fr.w, fr.h, 18); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, COOL.deep, .45); ctx.beginPath(); ctx.roundRect(fr.x, fr.y, fr.w, fr.h, 18); ctx.fill();
    ctx.strokeStyle = rgba(COOL.line, .75); ctx.lineWidth = 2; ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.beginPath(); ctx.roundRect(fr.x, fr.y, fr.w, fr.h, 18); ctx.clip();
  const sc = fr.w / CH.w; ctx.translate(fr.x, fr.y); ctx.scale(sc, sc); ctx.translate(-CH.x, -CH.y);
  if (z < 1) {
    ctx.globalAlpha = 1 - z;
    // header: the companion (a cool dot), no name, no logo
    ctx.fillStyle = mixHex(P.night1, COOL.deep, .7); ctx.fillRect(CH.x, CH.y, CH.w, 66);
    ctx.fillStyle = COOL.body; ctx.beginPath(); ctx.arc(CH.x + 44, CH.y + 33, 15, 0, TAU); ctx.fill(); halo(ctx, CH.x + 44, CH.y + 33, 40, .3, COOL.halo, COOL.core);
    ctx.fillStyle = rgba(COOL.line, .55); ctx.fillRect(CH.x + 74, CH.y + 26, 120, 7); ctx.fillStyle = rgba(COOL.line, .3); ctx.fillRect(CH.x + 74, CH.y + 40, 70, 5);
    ctx.save(); ctx.beginPath(); ctx.rect(CH.x, inner - 8, CH.w, CH.h - (inner - CH.y) - 6); ctx.clip();
    ITEMS.forEach((it, i) => {
      const yy = inner + it.y - scroll; if (yy < inner - 80 || yy > CH.y + CH.h + 10) return;
      if (it.kind === 'b') {
        const bw = (CH.w - 120) * it.w, x = it.side === 'L' ? CH.x + 30 : CH.x + CH.w - 30 - bw, mach = it.side === 'L';
        ctx.fillStyle = mach ? mixHex(P.ind1, COOL.deep, .8) : rgba(PAPER.lit, .9); ctx.beginPath(); ctx.roundRect(x, yy, bw, it.h, 16); ctx.fill();
        ctx.fillStyle = mach ? rgba(COOL.line, .55) : rgba(PAPER.ink, .35); ctx.fillRect(x + 18, yy + 16, bw * .7, 6); ctx.fillRect(x + 18, yy + 30, bw * .45, 6);
      } else if (it.kind === 's') {
        E.glowText(ctx, it.txt, CH.x + CH.w / 2, yy + 20, { size: 18, weight: 600, align: 'center', col: P.halo2, glow: false, spacing: .14 });
      } else {
        const k = sys.indexOf(it), ru = span(t, tS[k] - .55, tS[k] + .05);
        if (k === 2 && z > 0) return;   // the last one lives on as the sentence
        if (ru > 0) {
          ctx.fillStyle = rgba(COOL.line, .4); ctx.fillRect(CH.x + 40, yy + it.h / 2, 70 * ru, 1.5); ctx.fillRect(CH.x + CH.w - 40 - 70 * ru, yy + it.h / 2, 70 * ru, 1.5);
          F.maskLine(ctx, [[SENT, 0]], CH.x + CH.w / 2, yy + it.h / 2 + 12, 34, F.rise(ru), { serif: true, align: 'center', col: COOL.core, glow: false });
        }
      }
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  // the sentence (★): leaves the window, grows to the centre; a gold stroke writes under it; it sinks when Harari's card comes
  const ru = span(t, tS[2] - .55, tS[2] + .05), sink = span(t, a.harari - .15, a.harari + .45);
  if (z > 0 && sink < 1) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    F.maskLine(ctx, [[SENT, 0]], sx, sy, size, F.rise(ru) * (1 - sink), { serif: true, align: 'center', col: mixHex(COOL.core, P.cream, z * .5), glow: z > .5 });
    const lw = F.measure(SENT, 104, true), wr = smooth(span(t, Math.max(a.write - .05, a.somebody + 1.45), a.intoLaw + .5)) * (1 - sink);
    if (wr > 0) F.goldSpan(ctx, [[W / 2 - lw / 2, 506], [W / 2 + lw / 2, 500]], 0, wr, { w: 2.4 });
    ctx.restore();
  }
}

// ---- the screen layers of c07
export function over(ctx, t, H, c) {
  const a = H.a;
  // the data card (teens)
  const dk = H.io(t, a.teens + .15, a.california - .25, .9, .7), box = { x: 1150, y: 170, w: 620, h: 300 };
  H.inMask(ctx, box, dk, () => {
    F.dataCard(ctx, t, box.x, box.y, box.w, { kind: 'KNOWN', title: F.SOURCES.teensSrc.split(' · ')[0], big: F.SOURCES.teens, src: F.SOURCES.teensSrc.split(' · ')[1], u: span(t, a.teens + .15, a.teens + 1.4), h: box.h });
    F.maskLine(ctx, [[F.SOURCES.companion, 0]], box.x + 34, box.y + 236, 22, F.rise(span(t, a.most + .25, a.most + 1.0)), { serif: false, weight: 600, col: P.cream, glow: false });
  });
  // the veil: the chat, the sentence, Harari, the clip
  const v = .62 * sineIO(span(t, a.california - .1, a.california + 1.7)) + .26 * sineIO(span(t, a.somebody - .2, a.somebody + 1.2)) - .12 * sineIO(span(t, a.harari, a.harari + 1));
  F.veil(ctx, v * (1 - sineIO(span(t, a.C16.end + .6, a.C16.end + 2.4))));
  chat(ctx, t, H, c);
  // Harari: a paper card rises where the sentence sank; C16 grows out of it and goes back; then it sinks
  const hu = span(t, a.harari + .15, a.harari + 1.1), hout = span(t, a.C16.end + 1.3, a.C16.end + 2.0);
  if (hu > 0 && hout < 1) {
    const q = { text: F.SOURCES.experiment, head: 'YUVAL NOAH HARARI', credit: 'HISTORIAN', x: 330, y: 330, w: 1260, size: 62, spoken: ['a psychological', 'scale'], after: a.harari };
    const box = { x: q.x, y: q.y, w: q.w, h: 64 + 2 * q.size * 1.22 + 92 };
    let r = null;
    H.inMask(ctx, box, 1 - hout, () => { r = F.quoteCard(ctx, t, H.T, { ...q, u: F.rise(hu) }); });
    if (r) H.c16from = { x: r.x + 28, y: r.y + 18, w: 300, h: 34 };   // the clip grows out of the name line (not the whole card: no pop)
  }
  const w = a.C16, m = span(t, w.start - 1.4, w.start + .4) * (1 - span(t, w.end - .4, w.end + 1.4));
  if (m > 0 && H.c16from) F.clipPlate(ctx, t, H.T, 'C16', { from: H.c16from, morph: m });
  // the three questions in the sky, one after another; then READ ONE CHAT TOGETHER in gold
  const qo = span(t, a.read - .35, a.read + .25);
  [['WHICH A.I. DO YOU TALK TO?', a.q1, 302], ['WHAT FOR?', a.q2, 382], ['ONE YOU’D CALL A FRIEND?', a.q3, 462]].forEach(([s, t0, y], i, arr) => {
    const u = span(t, t0 - .2, t0 + 1.0) ** 2.2; if (u <= 0 || qo >= 1) return;   // a soft first frame (no pop)
    const next = arr[i + 1] ? span(t, arr[i + 1][1] - .1, arr[i + 1][1] + .4) : 0;
    ctx.save(); ctx.globalAlpha = 1 - .5 * next; F.caption(ctx, t, 96, y, [s], u, { size: 84, out: qo > 0 ? qo : null }); ctx.restore();
  });
  const ru = span(t, a.read + .05, a.read + .9) * (1 - span(t, a.act - .3, a.act + .3));
  if (ru > 0) F.verdict(ctx, t, 100, 300, 'READ ONE CHAT TOGETHER', ru, { size: 50, align: 'left' });
}
export function sources(ctx, t, H) {
  const a = H.a;
  F.source(ctx, t, a.california + .5, a.harari - .1, F.SOURCES.sb243);
}
