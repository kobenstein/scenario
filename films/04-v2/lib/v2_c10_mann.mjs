// Film 4 v2 · c10 · people as 3D capsules: a body that is right from any angle (the stairwell is seen from above, the street from a
// rooftop). Proportions of a 1.70 m adult; round shoulders, arms in front; poses by joint angles; drawn far part → near part.
//   mann(ctx, C, x, y, z, face, pose, o)   feet at (x, y, z), facing angle face (radians in the X-Z plane, 0 = +X, π/2 = +Z)
//     pose: { lean, head (nod, + down), turn (head yaw), arms: [{ fw, out, el }, …] (front swing, sideways, elbow), legs: [{ fw, kn }, …],
//             step: walk phase or null, sit }
//     o: { col: { coat, pants, skin, hair, shoes }, light (0..1 warm), lightCol, fog: { col, a }, bags (bool), key (bool), h (height scale) }
import { rgba, clamp, mix, mixHex, shade, TAU } from './v2_c10_kit.mjs';

const SEG = (a, b, ra, rb, col, kind) => ({ a, b, ra, rb, col, kind });
// local frame: u forward, y up, v right; world = rotate (u, v) by face
function rig(pose, h) {
  const P = { lean: 0, head: 0, turn: 0, arms: [{ fw: .1, out: .08, el: .15 }, { fw: .1, out: .08, el: .15 }], legs: [{ fw: 0, kn: 0 }, { fw: 0, kn: 0 }], ...pose };
  const S = [], s = h;
  const hipY = .93 * s, lean = P.lean;
  // the upper body leans forward about the pelvis
  const up = (u, y, v) => { const dy = y - hipY; return [u + Math.sin(lean) * dy, hipY + Math.cos(lean) * dy, v]; };
  const pelvis = [0, hipY, 0], chest = up(0, 1.28 * s, 0), neck = up(0, 1.47 * s, 0), headC = up(.03 * s + Math.sin(P.head) * .05, 1.6 * s, 0);
  const sh = [up(-.01, 1.41 * s, .19 * s), up(-.01, 1.41 * s, -.19 * s)];
  // legs (a step swings them; sitting bends hips forward)
  for (let i = 0; i < 2; i++) {
    const L = P.legs[i], side = i ? -1 : 1, hip = [0, hipY - .02, .095 * side * s];
    let fw = L.fw, kn = L.kn;
    if (P.step != null) { const ph = P.step + (i ? Math.PI : 0); fw = .32 * Math.sin(ph); kn = Math.max(0, .5 * Math.sin(ph + 1.2)); }
    const th = .45 * s, sl = .44 * s, knee = [hip[0] + Math.sin(fw) * th, hip[1] - Math.cos(fw) * th, hip[2]], a2 = fw - kn, ank = [knee[0] + Math.sin(a2) * sl, knee[1] - Math.cos(a2) * sl, hip[2]], toe = [ank[0] + .14 * s, Math.max(.02, ank[1] - .05), hip[2]];
    S.push(SEG(hip, knee, .085 * s, .065 * s, 'pants', 'leg'), SEG(knee, ank, .062 * s, .048 * s, 'pants', 'leg'), SEG(ank, toe, .05 * s, .045 * s, 'shoes', 'foot'));
  }
  S.push(SEG(pelvis, chest, .16 * s, .17 * s, 'coat', 'torso'), SEG(chest, neck, .17 * s, .1 * s, 'coat', 'torso'), SEG(sh[0], sh[1], .085 * s, .085 * s, 'coat', 'torso'));
  // arms: fw swings forward (toward u), out swings sideways, el bends the elbow forward/up
  const hands = [];
  for (let i = 0; i < 2; i++) {
    const A = P.arms[i], side = i ? -1 : 1, o = sh[i], ua = .29 * s, la = .27 * s;
    const dir1 = [Math.sin(A.fw) * Math.cos(A.out), -Math.cos(A.fw) * Math.cos(A.out), side * Math.sin(A.out)];
    const el = [o[0] + dir1[0] * ua, o[1] + dir1[1] * ua, o[2] + dir1[2] * ua], f2 = A.fw + A.el;
    const dir2 = [Math.sin(f2) * Math.cos(A.out * .5), -Math.cos(f2) * Math.cos(A.out * .5), side * Math.sin(A.out * .5) - side * (A.in || 0)];
    const wr = [el[0] + dir2[0] * la, el[1] + dir2[1] * la, el[2] + dir2[2] * la], hand = [wr[0] + dir2[0] * .07 * s, wr[1] + dir2[1] * .07 * s, wr[2] + dir2[2] * .07 * s];
    S.push(SEG(o, el, .062 * s, .052 * s, 'coat', 'arm'), SEG(el, wr, .05 * s, .042 * s, 'coat', 'arm'), SEG(wr, hand, .042 * s, .04 * s, 'skin', 'hand'));
    hands.push(hand);
  }
  S.push(SEG(neck, up(.0, 1.52 * s, 0), .06 * s, .06 * s, 'skin', 'neck'));
  return { S, headC, hands, turn: P.turn, nod: P.head, s };
}
export function mann(ctx, C, x, y, z, face, pose = {}, o = {}) {
  const h = o.h || 1, R = rig(pose, h), cf = Math.cos(face), sf = Math.sin(face);
  const W3 = (p) => [x + p[0] * cf - p[2] * sf, y + p[1], z + p[0] * sf + p[2] * cf];
  const col = Object.assign({ coat: '#5a6a8a', pants: '#2a2a3a', skin: '#e0b090', hair: '#2a1a14', shoes: '#141018' }, o.col || {});
  const fog = o.fog, F = (c) => (fog && fog.a > 0 ? mixHex(c, fog.col, fog.a) : c);
  const warm = o.light || 0, lc = o.lightCol || '#ffcf8a', L = (c) => F(warm > 0 ? mixHex(c, mixHex(c, lc, .5), warm * .6) : c);
  const items = [];
  for (const sgm of R.S) {
    const a = C.p(...W3(sgm.a)), b = C.p(...W3(sgm.b)); if (!a || !b) continue;
    items.push({ d: (a[2] + b[2]) / 2, draw: () => {
      const ka = C.f / a[2], kb = C.f / b[2], w = (sgm.ra * ka + sgm.rb * kb), c = L(col[sgm.col]);
      ctx.lineCap = 'round';
      ctx.strokeStyle = F(shade(col[sgm.col], -.5)); ctx.lineWidth = w + 1.6; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.strokeStyle = rgba(mixHex(c, '#ffffff', .35), .55); ctx.lineWidth = w * .35; ctx.beginPath(); ctx.moveTo(a[0] - w * .18, a[1] - w * .2); ctx.lineTo(b[0] - w * .18, b[1] - w * .2); ctx.stroke();
    } });
  }
  // the head: skin sphere, the hair cap toward the back and top, a nose hint toward the face
  const hc = R.headC, hp = C.p(...W3(hc));
  if (hp) items.push({ d: hp[2] - .02, draw: () => {
    const k = C.f / hp[2], r = .105 * h * k, back = C.p(...W3([hc[0] - .035 * h * Math.cos(R.turn), hc[1] + .03 * h, hc[2] - .035 * h * Math.sin(R.turn)])), nose = C.p(...W3([hc[0] + .1 * h * Math.cos(R.turn), hc[1] - .02 * h, hc[2] + .1 * h * Math.sin(R.turn)]));
    ctx.fillStyle = F(shade(col.skin, -.45)); ctx.beginPath(); ctx.arc(hp[0], hp[1], r + .9, 0, TAU); ctx.fill();
    ctx.fillStyle = L(col.skin); ctx.beginPath(); ctx.arc(hp[0], hp[1], r, 0, TAU); ctx.fill();
    if (nose) { ctx.fillStyle = L(shade(col.skin, -.12)); ctx.beginPath(); ctx.arc(mix(hp[0], nose[0], .75), mix(hp[1], nose[1], .75), r * .28, 0, TAU); ctx.fill(); }
    if (back) { ctx.fillStyle = F(col.hair); ctx.beginPath(); ctx.arc(back[0], back[1], r * 1.02, 0, TAU); ctx.fill(); ctx.fillStyle = rgba('#ffffff', .12); ctx.beginPath(); ctx.arc(back[0] - r * .3, back[1] - r * .35, r * .35, 0, TAU); ctx.fill(); }
  } });
  // props: two shopping bags hanging from the hands; a key that catches the light
  if (o.bags) for (const hd of R.hands) { const top = W3(hd), p0 = C.p(top[0], top[1] - .05, top[2]), p1 = C.p(top[0], top[1] - .42, top[2]); if (!p0 || !p1) continue; items.push({ d: p0[2] + .01, draw: () => {
    const k = C.f / p0[2], w = .17 * k; ctx.strokeStyle = F('#c8b48a'); ctx.lineWidth = Math.max(1, .012 * k); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(mix(p0[0], p1[0], .25), mix(p0[1], p1[1], .25)); ctx.stroke();
    ctx.fillStyle = F(o.bagCol || '#d8c8a8'); ctx.beginPath(); ctx.roundRect(mix(p0[0], p1[0], .25) - w / 2, mix(p0[1], p1[1], .25), w, Math.max(4, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) * .75 + .1 * k), Math.max(1, w * .1)); ctx.fill();
    ctx.fillStyle = F('#5a8a4a'); ctx.beginPath(); ctx.arc(mix(p0[0], p1[0], .25), mix(p0[1], p1[1], .25), w * .32, Math.PI, TAU); ctx.fill();
  } }); }
  if (o.key) { const hd = W3(R.hands[0]), p = C.p(...hd); if (p) items.push({ d: p[2] - .05, draw: () => { const k = C.f / p[2]; ctx.fillStyle = '#fff1c0'; ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1.2, .02 * k), 0, TAU); ctx.fill(); } }); }
  items.sort((p, q) => q.d - p.d);
  for (const it of items) it.draw();
  return { head: hp, hands: R.hands.map((hd) => C.p(...W3(hd))) };
}
// a few ready poses
export const MP = {
  stand: {},
  bags: { arms: [{ fw: .05, out: .16, el: .05 }, { fw: .05, out: .16, el: .05 }], head: .25 },
  unlock: { lean: .05, head: .2, arms: [{ fw: 1.0, out: -.05, el: .5 }, { fw: .15, out: .1, el: .3 }] },
  rail: { lean: .38, head: .35, arms: [{ fw: 1.05, out: .12, el: .75 }, { fw: 1.0, out: .14, el: .8 }] },   // forearms on the railing
  talk: { lean: .3, head: -.15, arms: [{ fw: 1.0, out: .12, el: .9 }, { fw: .7, out: .2, el: 1.4 }] },
  wave: { lean: .2, head: -.3, arms: [{ fw: 2.6, out: .2, el: .3 }, { fw: 1.0, out: .14, el: .8 }] },
};
