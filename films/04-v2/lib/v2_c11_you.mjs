// c11 (Film 4 v2) · "you" at the head of the long table, seen from behind (the protagonist of the minute: dark coat, ochre scarf),
// drawn straight onto the frame with vector paths (no scratch canvases: @napi-rs/canvas keeps every drawImage(<Canvas>) copy).
// Look follows lib/sc01_m1_you.mjs youFree (round sloping shoulders, the scarf, a lost profile on the side the head turns to,
// a warm rim from the key light and a cool rim of sky, engraved hatching in the shadow).
//   youSeat(ctx, x, y, s, o) → { head: [x, y], shoulderL, shoulderR }
//     x, y = the middle of the seat (stool top) on screen; s = pixels per millimetre (seated: the head top is ~820 mm above the seat)
//     o: { t, turn -1 (lost profile to the left: looking left) … 0 (straight ahead, away from us) … +1 (right),
//          elev 0 (seen level) … 1 (seen from straight above), light: { x, y, col, a } (key light, screen; usually in front of you = above
//          the table), sky (cool rim colour), coat, skin, hair, accent (scarf), lean (forward, rad) }
import { rgba, clamp, mix } from '../engine.mjs';
import { shadeHex, mixHex } from './v2_c11_kit.mjs';

const TAU = Math.PI * 2;
export function youSeat(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, turn = clamp(o.turn ?? 0, -1, 1), el = clamp(o.elev ?? 0), lean = o.lean ?? .05;
  const coat = o.coat || '#222c46', skin = o.skin || '#b98262', hair = o.hair || '#141019', acc = o.accent || '#c8843a';
  const L = o.light || { x, y: y - 2000 * s, col: '#ffcf8a', a: .85 };
  const br = Math.sin(t * TAU / 4.3), sw = Math.sin(t * TAU / 9.4) * .6 + Math.sin(t * 1.3 + 1) * .4;
  const ky = mix(1, .62, el), topD = 150 * el;                    // the back foreshortens seen from above, the tops of shoulders and head show
  const sy = -br * 3.2, tw = turn * .16 + sw * .02;               // breath lifts the shoulders; the shoulders follow the head a little
  const hd = { x: turn * 34 + sw * 3, y: (-690 + sy) * ky - topD * .55, rot: turn * .12 + lean * .3 };
  // light direction on screen (for rims and form)
  const ldx = L.x - x, ldy = L.y - (y - 500 * s), lm = Math.hypot(ldx, ldy) || 1, lx = ldx / lm, ly = ldy / lm;
  const rimW = Math.max(1.4, 6 * s);
  const U = (g) => { g.translate(x, y); g.scale(s, s); };
  // ---- the silhouette parts (one painter, so the rim pass and the clip use the very same shapes)
  //   mode: null (paint in colour), a colour string (flat silhouette for the rims), 'clip' (only collect the body outline as one path)
  const parts = (g, mode) => {
    const clipM = mode === 'clip', mono = clipM ? null : mode, C = (c) => mono || c;
    const B = () => { if (!clipM) g.beginPath(); }, Fi = () => { if (!clipM) g.fill(); };
    if (clipM) g.beginPath();
    // stool: round seat and legs (only in the colour pass)
    if (!mode) {
      g.strokeStyle = '#120e1a'; g.lineWidth = 16; g.lineCap = 'round';
      g.beginPath(); g.moveTo(-150, 30); g.lineTo(-190, 460); g.moveTo(150, 30); g.lineTo(190, 460); g.moveTo(0, 40); g.lineTo(0, 470); g.stroke();
      g.fillStyle = '#2a1e22'; g.beginPath(); g.ellipse(0, 18, 200, 30 + 40 * el, 0, 0, TAU); g.fill();
    }
    // upper arms at the sides (forearms go forward onto the table, hidden by the back)
    const arm = (side) => {
      const sx = side * (210 + tw * 40 * side), shY = (-548 + sy) * ky - topD * .25;
      g.fillStyle = C(shadeHex(coat, side < 0 ? .02 : -.1)); B();
      g.moveTo(sx - side * 30, shY - 16); g.bezierCurveTo(sx + side * 36, shY - 6, sx + side * 44, -440 * ky, sx + side * 34, -300 * ky);
      g.bezierCurveTo(sx + side * 28, -250 * ky, sx + side * 4, -236 * ky, sx - side * 30, -250 * ky); g.bezierCurveTo(sx - side * 40, -320 * ky, sx - side * 44, -440 * ky, sx - side * 30, shY - 16);
      g.closePath(); Fi();
    };
    if (!clipM) { arm(-1); arm(1); }   // (clip = the back only: one transform, one orientation — @napi-rs moves a path built across save/rotate/restore)
    // the back: round sloping shoulders, soft waist, the coat runs down over the seat; the collar stands up at the neck
    const sh = (-560 + sy) * ky, nk = (-610 + sy) * ky - topD * .3, rot = tw * 120;
    g.fillStyle = C(coat); B();
    g.moveTo(-206, 12);
    g.bezierCurveTo(-214, -60, -178, -150 * ky, -180, -250 * ky);
    g.bezierCurveTo(-184, -340 * ky, -198, -430 * ky, -212 + rot * .2, sh + 40 * ky);
    g.bezierCurveTo(-224 + rot * .2, sh - 10 - topD * .2, -168 + rot * .3, sh - 40 - topD * .45, -84 + rot * .4, nk + 6);
    g.quadraticCurveTo(0 + rot * .4, nk - 10, 84 + rot * .4, nk + 6);
    g.bezierCurveTo(168 + rot * .3, sh - 40 - topD * .45, 224 + rot * .2, sh - 10 - topD * .2, 212 + rot * .2, sh + 40 * ky);
    g.bezierCurveTo(198, -430 * ky, 184, -340 * ky, 180, -250 * ky);
    g.bezierCurveTo(178, -150 * ky, 214, -60, 206, 12);
    g.quadraticCurveTo(0, 36, -206, 12); g.closePath(); Fi();
    if (clipM) return { nk, rot };
    // neck
    g.fillStyle = C(shadeHex(skin, -.45)); B(); g.moveTo(-44 + rot * .4, nk + 10); g.lineTo(44 + rot * .4, nk + 10); g.lineTo(34 + hd.x * .5, hd.y + 70); g.lineTo(-38 + hd.x * .5, hd.y + 72); g.closePath(); Fi();
    // head: skull + the cheek on the side it turns to (lost profile), hair over the back, the far ear
    g.save(); g.translate(hd.x, hd.y); g.rotate(hd.rot);
    const hr = 82, hv = 102 * mix(1, .88, el), a = Math.abs(turn), d = Math.sign(turn) || 1;
    g.fillStyle = C(shadeHex(skin, -.32)); B(); g.moveTo(turn * 10 + hr, 4); g.ellipse(turn * 10, 4, hr, hv, 0, 0, TAU); Fi();
    if (a > .05) {                                        // cheek and jaw beyond the skull's edge; strong turns: brow and the tip of the nose in the contour
      const q = clamp((a - .4) / .5), e = hr + 4 + 24 * a;
      g.fillStyle = C(shadeHex(skin, -.16)); B();
      g.moveTo(d * (hr - 20), -40);
      g.quadraticCurveTo(d * (e + 2), -40, d * (e + 1 + 5 * q), -26);           // brow
      g.quadraticCurveTo(d * (e - 3), -14, d * (e - 1), -2);                    // eye socket
      g.quadraticCurveTo(d * (e + 4 + 12 * q), 14, d * (e + 2 + 9 * q), 24);    // nose tip
      g.quadraticCurveTo(d * (e - 2), 30, d * (e - 4), 40);                     // under the nose, lips
      g.bezierCurveTo(d * (e - 4), 56, d * (e - 10 + 4 * a), 70, d * (hr - 8 + 10 * a), 80);
      g.quadraticCurveTo(d * (hr - 30), 104, d * (hr - 62), 96); g.lineTo(d * (hr - 42), -26); g.closePath(); Fi();
      if (!mono && q > .2) {   // the lashes of the far eye and the line of the brow, just inside the contour
        g.strokeStyle = rgba('#1a0e10', .7 * q); g.lineWidth = 3; g.beginPath(); g.moveTo(d * (e - 14), -12); g.quadraticCurveTo(d * (e - 6), -16, d * (e - 1), -8);
        g.moveTo(d * (e - 20), -34); g.quadraticCurveTo(d * (e - 8), -40, d * (e + 2), -30); g.stroke();
      }
    }
    g.fillStyle = C(shadeHex(skin, -.42)); B(); const ex = -d * (hr - 6 - 34 * a); g.moveTo(ex + 12, 10); g.ellipse(ex, 10, 12, 23, 0, 0, TAU); Fi();
    g.fillStyle = C(hair); B();
    const hx0 = -turn * 16;
    g.moveTo(hx0 + 72, -58 - 30 * el); g.bezierCurveTo(hx0 + 50, -110 - 20 * el, hx0 - 50, -114 - 20 * el, hx0 - 76, -60 - 20 * el);
    g.bezierCurveTo(hx0 - 94, -10, hx0 - 86, 46, hx0 - 64, 72); g.bezierCurveTo(hx0 - 36, 90, hx0 + 4, 90, hx0 + 34, 72);
    g.bezierCurveTo(hx0 + 50, 46, hx0 + 60, 10, hx0 + 70, -14); g.bezierCurveTo(hx0 + 78, -30, hx0 + 80, -46, hx0 + 72, -58 - 30 * el); g.closePath(); Fi();
    g.restore();
    // scarf: a wrapped band hugging the collar and one tail down the back on the right
    const wv = (q) => (Math.sin(t * 1.9 + q * 3) * 6 + Math.sin(t * 3.1 + q * 5) * 3) * q;
    g.fillStyle = C(acc); B();
    g.moveTo(-96 + rot * .4, nk + 20); g.quadraticCurveTo(-104 + rot * .4, nk - 14 - topD * .3, -40 + rot * .4, nk - 22 - topD * .3); g.quadraticCurveTo(rot * .4, nk - 26 - topD * .3, 40 + rot * .4, nk - 22 - topD * .3);
    g.quadraticCurveTo(104 + rot * .4, nk - 14 - topD * .3, 96 + rot * .4, nk + 20); g.quadraticCurveTo(rot * .4, nk + 52 + topD * .2, -96 + rot * .4, nk + 20); g.closePath(); Fi();
    B(); g.moveTo(34 + rot * .3, nk + 30); g.bezierCurveTo(62 + wv(.3), nk + 120 * ky, 76 + wv(.6), nk + 220 * ky, 72 + wv(1), nk + 296 * ky);
    g.lineTo(24 + wv(1), nk + 300 * ky); g.bezierCurveTo(28 + wv(.6), nk + 220 * ky, 18 + wv(.3), nk + 120 * ky, -2 + rot * .3, nk + 36); g.closePath(); Fi();
    return { nk, rot };
  };
  ctx.save();
  // rims: warm from the key light (in front of you, above the table), cool from the sky
  ctx.save(); ctx.translate(lx * rimW, ly * rimW); U(ctx); parts(ctx, L.col || '#ffcf8a'); ctx.restore();
  ctx.save(); ctx.translate(-rimW * .6, -rimW * .8); U(ctx); ctx.globalAlpha = .55; parts(ctx, o.sky || '#8f9fd0'); ctx.restore();
  ctx.save(); U(ctx); const geo = parts(ctx, null);
  // form, inside the body outline only: the back is in shadow (the light is beyond you), a warm spill on shoulder tops and crown
  ctx.save(); parts(ctx, 'clip'); ctx.clip();
  const g1 = ctx.createLinearGradient(0, -900, 0, 40); g1.addColorStop(0, rgba(L.col || '#ffcf8a', .1 + .2 * el)); g1.addColorStop(.32, 'rgba(0,0,0,0)'); g1.addColorStop(1, 'rgba(3,4,12,.5)');
  ctx.fillStyle = g1; ctx.fillRect(-400, -1000, 800, 1100);
  ctx.strokeStyle = 'rgba(4,5,14,.24)'; ctx.lineWidth = Math.max(1 / s, 2); ctx.beginPath();
  for (let k = -16; k < 20; k++) { const x0 = -260 + k * 26 + 6 * Math.sin(k * 2.7), y0 = -40 - 30 * ((k * 7) % 3); ctx.moveTo(x0, y0); ctx.lineTo(x0 + 130 + 8 * Math.sin(k), -520 * ky + 40 * ((k * 5) % 2)); }
  ctx.stroke();
  ctx.restore();
  // coat seam down the back, the fold lines at the waist, the scarf's wrap line
  ctx.strokeStyle = 'rgba(0,0,0,.42)'; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(4 + tw * 60, (-600 + sy) * ky); ctx.bezierCurveTo(0, -420 * ky, 6, -280 * ky, 2, -60); ctx.stroke();
  ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-150, -200 * ky); ctx.quadraticCurveTo(-80, -176 * ky, -40, -204 * ky); ctx.moveTo(150, -206 * ky); ctx.quadraticCurveTo(90, -182 * ky, 46, -210 * ky); ctx.stroke();
  ctx.strokeStyle = rgba('#3a1a06', .5); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(-90 + geo.rot * .4, geo.nk + 14); ctx.quadraticCurveTo(geo.rot * .4, geo.nk + 38, 90 + geo.rot * .4, geo.nk + 14); ctx.stroke();
  ctx.restore();
  ctx.restore();
  const Pt = (ux, uy) => [x + ux * s, y + uy * s];
  return { head: Pt(hd.x, hd.y), shoulderL: Pt(-214, (-560) * ky), shoulderR: Pt(214, (-560) * ky) };
}
