// Film 6 · c02 · the world of §1a: the slate mirror room (pane, you, the comment card, the dog) and the world inside the glass
// (the wall of talking panes, the two chat windows of the Turing test, the Harari pane). Pure functions of t; deterministic prng.
// Owner: c02. Kit objects come from lib/f6_kit.mjs (pane, coolText, coolLine, ember); nothing of the kit is redrawn here except
// the glass PLATE texture (plateGlass: lib/handoff4.mjs glassPlate in local units, so the handoff cut sits inside one picture).
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift, text, hatch, addGlow } from '../engine.mjs';
import { stipple, vnoise } from './art.mjs';
import { fibreFill } from './print.mjs';
import { paperSheet } from './paper.mjs';
import { life } from './figure.mjs';
import { F6, layer, once, pending, pane, coolText, coolLine, ember, camMap } from './f6_kit.mjs';
import { loadImage } from '@napi-rs/canvas';
import { clipFrame, ROOT } from './kit.mjs';
import fs from 'node:fs';
// frame counts of the clips (clips.json `frames`), read once: the kit's framePath only clamps on `maxFrame`, which clips.json does not carry
const CLIP_FRAMES = once('c02-clip-frames', () => { try { const j = JSON.parse(fs.readFileSync(ROOT + 'audio/clips.json', 'utf8')); const m = {}; for (const k in j) m[k] = j[k].frames || 0; return m; } catch { return {}; } });

const TAU = Math.PI * 2;
export const quart = (u) => { u = clamp(u); return u < .5 ? 8 * u * u * u * u : 1 - 8 * Math.pow(1 - u, 4); };
export const expo = (u) => { u = clamp(u); return u >= 1 ? 1 : 1 - Math.pow(2, -10 * u); };
// keyframed camera: keys [{ t, x, y, z }], quart in-out between keys, held outside
export function camPath(keys, t) {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) { const u = (b.ease || quart)((t - a.t) / (b.t - a.t)); return { x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), z: mix(a.z, b.z, u) }; }
  }
  const l = keys[keys.length - 1]; return { x: l.x, y: l.y, z: l.z };
}

// ---------------------------------------------------------------- the glass plate texture in local units (identical to handoff4 glassPlate at k = 1)
// draws the plate's gradient, sliding sheen and drifting dust over the box [x0, y0, W*k, H*k] (k = local units per screen pixel of the plate)
export function plateGlass(ctx, t, x0, y0, k, o = {}) {
  const w = W * k, h = H * k;
  const g = ctx.createLinearGradient(x0, y0, x0 + w, y0 + h); g.addColorStop(0, '#0a0f24'); g.addColorStop(1, '#05060f'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
  if (o.band) { ctx.fillStyle = '#0a0f24'; ctx.fillRect(x0, y0 - o.band, w, o.band); ctx.fillStyle = '#05060f'; ctx.fillRect(x0, y0 + h, w, o.band); }
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 - (o.band || 0), w, h + 2 * (o.band || 0)); ctx.clip();
  const x = x0 + w * (.3 + .04 * Math.sin(t * .4)); ctx.translate(x, y0 + h / 2); ctx.rotate(.5);
  const s = ctx.createLinearGradient(-260 * k, 0, 260 * k, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, `rgba(216,247,255,${.06 * (o.sheen ?? 1)})`); s.addColorStop(1, 'rgba(216,247,255,0)');
  ctx.fillStyle = s; ctx.fillRect(-260 * k, -1400 * k, 520 * k, 2800 * k); ctx.restore();
  const r = prng(12); for (let i = 0; i < 70; i++) { const px = r() * W, py = (r() * H + t * 8 * (r() + .3)) % H; ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * r()})`; ctx.fillRect(x0 + px * k, y0 + py * k, 1.6 * k, 1.6 * k); }
}

// the plate's glass as the GROUND of the glass world, in wall space: inside [0, W]×[0, H] it is exactly handoff4's glassPlate (so a pane
// drawn through this ground at 1:1 IS the plate); beyond the frame the same gradient continues seamlessly (clamped along its diagonal)
export function glassGround(ctx, t, box = [-1400, -900, 4800, 2700]) {
  const [bx, by, bw, bh] = box;
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0a0f24'); g.addColorStop(1, '#05060f'); ctx.fillStyle = g; ctx.fillRect(bx, by, bw, bh);
  ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
  const x = W * (.3 + .04 * Math.sin(t * .4)); ctx.translate(x, H / 2); ctx.rotate(.5);
  const s = ctx.createLinearGradient(-260, 0, 260, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, 'rgba(216,247,255,.06)'); s.addColorStop(1, 'rgba(216,247,255,0)');
  ctx.fillStyle = s; ctx.fillRect(-260, -2600, 520, 5200); ctx.restore();
  const r = prng(12); for (let i = 0; i < 70; i++) { const px = r() * W, py = (r() * H + t * 8 * (r() + .3)) % H; ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * r()})`; ctx.fillRect(px, py, 1.6, 1.6); }
  // more dust beyond the frame (another seed), so the ground is the same everywhere
  const r2 = prng(1212); for (let i = 0; i < 260; i++) { const px = bx + r2() * bw, py = by + ((r2() * bh + t * 8 * (r2() + .3)) % bh); if (px >= 0 && px < W && py >= 0 && py < H) continue; ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * r2()})`; ctx.fillRect(px, py, 1.6, 1.6); }
}

// ---------------------------------------------------------------- the mirror room: slate wall, a floor line at y 900, fibre and hatch (cached)
export const FLOOR = 900, GROUND = [-500, 3000];   // the ground layer spans world x -500 .. 2500
export function roomGround() {
  const GW = GROUND[1];
  return layer('c02-room', GW, H, (g, c) => {
    g.translate(-GROUND[0], 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0b0f1f'); bg.addColorStop(.55, F6.slate); bg.addColorStop(1, '#0d111e'); g.fillStyle = bg; g.fillRect(GROUND[0], 0, GW, H);
    // a faint cool light on the wall around the pane (its glow lives on the wall even when it is dark)
    const wl = g.createRadialGradient(700, 520, 0, 700, 520, 900); wl.addColorStop(0, 'rgba(120,150,200,.1)'); wl.addColorStop(1, 'rgba(120,150,200,0)'); g.fillStyle = wl; g.fillRect(0, 0, W, H);
    g.beginPath(); g.rect(GROUND[0], 0, GW, H); g.setTransform(1, 0, 0, 1, 0, 0); fibreFill(g, .05); g.translate(-GROUND[0], 0);
    hatch(g, null, -.85, 7, .04, { box: [GROUND[0], 0, GW, FLOOR], col: '#000000', w: .8, wobble: .6 });
    // the floor: darker, a polished sheen, the skirting line
    const fl = g.createLinearGradient(0, FLOOR, 0, H); fl.addColorStop(0, '#0a0d18'); fl.addColorStop(1, '#070910'); g.fillStyle = fl; g.fillRect(GROUND[0], FLOOR, GW, H - FLOOR);
    g.fillStyle = 'rgba(190,210,240,.13)'; g.fillRect(GROUND[0], FLOOR - 2, GW, 2);
    hatch(g, null, .1, 9, .05, { box: [GROUND[0], FLOOR, GW, H - FLOOR], col: '#000000', w: .8, wobble: 1 });
    stipple(c, { k: .25, g: 1, seed: 5, mid: false, boost: 1 });
  });
}

// ---------------------------------------------------------------- the comment card (2.02 / 2.03): cream paper with the real wording; the count is live
export const CARD = { w: 600, h: 360, text: 'I tried to convince chatgpt to stop praising me. It told me how special I was for not needing external validation.' };
function cardLayer() {
  const PAD = 30;
  return layer('c02-card', CARD.w + 2 * PAD, CARD.h + 2 * PAD, (g, c) => {
    paperSheet(g, PAD, PAD, CARD.w, CARD.h, { seed: 11, tone: '#efe6d2', light: [-200, -100], lift: 4, lines: 0, content: (q, w, h) => {
      // the quote, wrapped in Instrument Serif (readable: the one real comment of the film)
      const size = 34, lh = 42, x = 44, maxW = w - 88; q.font = `${size}px "Instrument Serif"`;
      const words = CARD.text.split(' '), lines = []; let cur = '';
      for (const wd of words) { const nx = cur ? cur + ' ' + wd : wd; if (cur && q.measureText(nx).width > maxW) { lines.push(cur); cur = wd; } else cur = nx; }
      if (cur) lines.push(cur);
      text(q, '“', x - 14, 62, { size: 70, font: 'Instrument Serif', color: rgba('#8e6a3a', .55) });
      lines.forEach((ln, i) => text(q, ln, x, 92 + i * lh, { size, font: 'Instrument Serif', color: rgba(F6.ink, .92) }));
      // a thin rule above the like row, and the source in small caps
      q.strokeStyle = rgba(F6.ink, .22); q.lineWidth = 1; q.beginPath(); q.moveTo(x, h - 84); q.lineTo(w - 44, h - 84); q.stroke();
      text(q, 'YOUTUBE COMMENT · MORE PERFECT UNION · 2025', x, h - 26, { size: 13, weight: 600, color: rgba(F6.ink, .55), spacing: 3 });
      // the paper darkens a little away from the screen's light (it is lit from the pane on the left)
      const sh = q.createLinearGradient(0, 0, w, 0); sh.addColorStop(0, 'rgba(60,45,30,0)'); sh.addColorStop(1, 'rgba(60,45,30,.22)'); q.fillStyle = sh; q.fillRect(0, 0, w, h);
    } });
  });
}
// draw the card with its top-left at (x, y) in the current transform; count: 0..1 (the number running up), hearts: rising stipple
export function commentCard(ctx, t, x, y, o = {}) {
  const C = cardLayer(), PAD = 30; ctx.drawImage(C, x - PAD, y - PAD);
  const cu = clamp(o.count ?? 0);
  const n = Math.round(32692 * expo(cu)), str = n.toLocaleString('en-US'), hx = x + 44, hy = y + CARD.h - 50;
  // the heart: a small engraved heart that beats while the count runs
  const hs = 1 + .12 * Math.sin(Math.PI * clamp(cu * 1.2)) * (cu > 0 && cu < 1 ? 1 : 0);
  ctx.save(); ctx.translate(hx + 12, hy - 10); ctx.scale(hs, hs); ctx.fillStyle = '#c0453a';
  ctx.beginPath(); ctx.moveTo(0, 9); ctx.bezierCurveTo(-14, -2, -10, -14, -1, -9); ctx.bezierCurveTo(1, -14, 14, -2, 0, 9); ctx.fill(); ctx.restore();
  ctx.save(); ctx.font = '42px "Instrument Serif"'; const nw = ctx.measureText(str).width; ctx.restore();
  text(ctx, str, hx + 36, hy, { size: 42, font: 'Instrument Serif', color: rgba(F6.ink, .95) });
  text(ctx, 'LIKES', hx + 36 + nw + 14, hy, { size: 13, weight: 600, color: rgba(F6.ink, .6), spacing: 3 });
  // thousands of people: small hearts rise from the count as stipple and vanish
  if (o.hearts > 0) {
    const r = prng(31), nH = 34; ctx.save();
    for (let i = 0; i < nH; i++) {
      const born = r() * 1.8, sp = 60 + r() * 50, dx = (r() - .5) * 60, ph = r() * TAU, k = r();
      const e = o.hearts - born; if (e < 0 || e > 2.4) continue;
      const a = Math.min(1, e * 3) * (1 - e / 2.4), px = hx + 20 + dx + Math.sin(e * 2 + ph) * 8, py = hy - 14 - e * sp, s = .35 + .35 * k;
      ctx.globalAlpha = a; ctx.fillStyle = k < .5 ? '#c0453a' : '#e07a66'; ctx.save(); ctx.translate(px, py); ctx.scale(s, s);
      ctx.beginPath(); ctx.moveTo(0, 9); ctx.bezierCurveTo(-14, -2, -10, -14, -1, -9); ctx.bezierCurveTo(1, -14, 14, -2, 0, 9); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------- the dog (2.07 / 2.08): sitting, in profile, facing left, listening
//   dog(ctx, t, x, y, s, { seed, tilt (rad, the head), jaw 0..1, ear 0..1 (perked) }) → { eye: [x, y], head: [x, y] } in the caller's coordinates
//   x, y = ground under the front paws; s 1 ≈ 100 px tall. Breathes (life), flicks an ear on its own rhythm, the tail tip twitches.
export function dog(ctx, t, x, y, s, o = {}) {
  const seed = o.seed ?? 5, L = life(t, seed), br = 1 + .012 * L.b, tilt = o.tilt ?? 0, jaw = clamp(o.jaw ?? 0);
  const win = Math.floor(t / 2.7), rr = prng(seed * 9 + win), on = rr() < .55, at = win * 2.7 + rr() * 2.2, fl = on ? Math.sin(Math.PI * clamp((t - at) / .35)) : 0;
  const ear = clamp((o.ear ?? .35) + .45 * fl), tailT = Math.sin(t * 1.3 + seed) * .5 + .5;
  const coat = '#2a2333', coatL = '#3b3347', belly = '#56495c', dark = '#140f1a';
  const capsule = (g, x1, y1, r1, x2, y2, r2) => { const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1)))); g.beginPath(); g.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); g.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); g.closePath(); g.fill(); };
  const bodyPath = (g) => { g.beginPath(); g.moveTo(44, -44); g.bezierCurveTo(30, -70, 6, -82, -14, -76); g.bezierCurveTo(-26, -72, -24, -52, -18, -34); g.lineTo(-12, -6); g.lineTo(20, -6); g.bezierCurveTo(28, -20, 40, -30, 44, -44); g.closePath(); };
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(3,3,10,.5)'; ctx.beginPath(); ctx.ellipse(14, 2, 48, 7, 0, 0, TAU); ctx.fill();   // contact shadow
  // the tail, curled on the floor behind the haunch, its tip twitching
  ctx.strokeStyle = coat; ctx.lineCap = 'round'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(40, -22); ctx.quadraticCurveTo(66, -22, 62, -6 + tailT * 2); ctx.quadraticCurveTo(58, 1, 50, -1); ctx.stroke();
  ctx.scale(1, br);   // breathing: the body rises a touch
  const bg = ctx.createLinearGradient(-30, -90, 40, 0); bg.addColorStop(0, coatL); bg.addColorStop(.55, coat); bg.addColorStop(1, dark); ctx.fillStyle = bg;
  ctx.beginPath(); ctx.ellipse(26, -30, 27, 25, -.15, 0, TAU); ctx.fill();   // the haunch
  bodyPath(ctx); ctx.fill();                                                  // back, shoulders, chest
  ctx.fillStyle = belly; ctx.beginPath(); ctx.moveTo(-18, -62); ctx.bezierCurveTo(-24, -48, -20, -30, -14, -16); ctx.lineTo(-6, -16); ctx.bezierCurveTo(-8, -34, -8, -50, -10, -62); ctx.closePath(); ctx.fill();   // chest patch
  // engraved hatch in the shadow of the body (haunch and belly side)
  ctx.save(); bodyPath(ctx); ctx.ellipse(26, -30, 27, 25, -.15, 0, TAU); ctx.clip(); hatch(ctx, null, -1.1, 3.6, .26, { box: [-30, -84, 80, 82], col: '#05060c', w: .5, wobble: .4, fade: [50, -10, -20, -70] }); ctx.restore();
  // front legs: two straight legs side by side (the near one a little forward), round paws
  ctx.fillStyle = coat; capsule(ctx, 2, -40, 7, 4, -4, 5.5); ctx.fillStyle = coatL; capsule(ctx, -10, -42, 7.5, -12, -4, 6);
  ctx.fillStyle = coatL; ctx.beginPath(); ctx.ellipse(-14, -2, 9, 4, 0, 0, TAU); ctx.fill(); ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(3, -1.5, 8.5, 4, 0, 0, TAU); ctx.fill();
  // neck and head (the head tilts about the neck)
  ctx.fillStyle = coatL; capsule(ctx, -12, -74, 11, -22, -88, 10);
  ctx.save(); ctx.translate(-24, -90); ctx.rotate(tilt);
  ctx.fillStyle = coatL; ctx.beginPath(); ctx.ellipse(0, 0, 17, 14, -.1, 0, TAU); ctx.fill();
  // the ear: a soft leaf behind the eye that perks forward when listening
  ctx.save(); ctx.translate(6, -10); ctx.rotate(-.9 + .9 * ear); ctx.fillStyle = coat; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-12, -14, -6, -26); ctx.quadraticCurveTo(4, -22, 8, -2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(200,120,110,.25)'; ctx.beginPath(); ctx.moveTo(-1, -3); ctx.quadraticCurveTo(-8, -13, -5, -20); ctx.quadraticCurveTo(1, -17, 4, -4); ctx.closePath(); ctx.fill(); ctx.restore();
  // the muzzle, the nose, the mouth (the jaw opens a little for the answer)
  ctx.fillStyle = coatL; capsule(ctx, -8, 2, 9, -26, 6, 6.5); ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-30, 4, 3.4, 2.8, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-28, 9); ctx.quadraticCurveTo(-20, 11, -14, 9); ctx.stroke();
  if (jaw > .02) { ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(-27, 9); ctx.lineTo(-13, 9.5); ctx.lineTo(-20, 9.5 + 7 * jaw); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c47a78'; ctx.beginPath(); ctx.ellipse(-20, 10 + 3 * jaw, 3, 2 * jaw, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-7, -4, 3.2, 2.6, -.2, 0, TAU); ctx.fill();   // the eye (the ember is drawn by the caller at .eye)
  ctx.strokeStyle = rgba('#9fb8d6', .45); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-14, -11); ctx.quadraticCurveTo(-2, -16, 8, -12); ctx.stroke();   // brow, lit from the left
  ctx.restore();
  // the cool rim on the chest and the front leg (the light of the pane on the left)
  ctx.strokeStyle = rgba('#9fb8d6', .35); ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-18, -64); ctx.bezierCurveTo(-25, -50, -21, -32, -16, -18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-17, -40); ctx.lineTo(-18, -8); ctx.stroke();
  ctx.restore();
  const cs = Math.cos(tilt), sn = Math.sin(tilt), ex = -24 + (-7 * cs + 4 * sn), ey = -90 + (-7 * sn - 4 * cs);
  return { eye: [x + ex * s, y + ey * s * br], head: [x - 24 * s, y - 90 * s * br] };
}

// ---------------------------------------------------------------- clipPaneC02: a copy of the kit's clipPane (lib/f6_kit.mjs, K0) with TWO changes:
// 1. the frame index is clamped to the clip's last frame (clips.json has `frames` but no `maxFrame`; the kit asks for frame 624 at t >= c.end and shows a placeholder);
// 2. the TV band lines fade in over the first .12 of `on` (the kit pops them in at full strength), the pre-line stays until on > .1,
//    and the pane's screen haze (drawn by pane() at full strength the moment screenA > 0) is held dark and let through over the first .3 of `on`;
// 3. preloadFirstFrame(id, k): frames below k show frame k instead (C1's frames 1–4 are the source's cold-open teaser with a burned-in caption).
const FIRST = {};
export function preloadFirstFrame(id, k) { FIRST[id] = { k, im: null }; pending(loadImage(`${ROOT}clips/${id}/f${String(k).padStart(5, '0')}.jpg`).then((im) => { FIRST[id].im = im; }).catch(() => {})); }
export function clipPaneC02(ctx, t, T, id, x, y, w, h, o = {}) {
  const c = T && T.clip ? T.clip(id) : null, ramp = o.ramp ?? .5;
  const on = o.on ?? (c ? sm(lin(c.start - ramp, c.start, t)) * (1 - sm(lin(c.end, c.end + ramp, t))) : 1);
  const u = c ? clamp((t - c.start) / Math.max(.01, c.end - c.start)) : 0, cx = x + w / 2, cy = y + h / 2, open = eout(on), hv = Math.max(2, h * open);
  const kMax = CLIP_FRAMES[id] || 1e9, k = c ? Math.min(kMax, Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1) : 1, ff = FIRST[id];
  const fr = ff && ff.im && k < ff.k ? ff.im : clipFrame(id, k);
  pane(ctx, t, { x: cx, y: cy, w, h, rot: o.rot ?? 0, yaw: o.yaw ?? 0, radius: o.radius ?? 6, frame: o.frame || 'thin', edge: (o.edge ?? .8) * (1 - .6 * on), spill: false,
    screenA: on > 0 ? 1 : 0, screen: (g, pw, ph) => {
      if (on < .3) { g.fillStyle = rgba(F6.glassBot, 1 - sm(lin(0, .3, on))); g.fillRect(0, 0, pw, ph); }
      g.save(); g.beginPath(); g.rect(0, ph / 2 - hv / 2, pw, hv); g.clip();
      if (fr) { const s = Math.max(pw / fr.width, ph / fr.height), dw = fr.width * s, dh = fr.height * s; g.drawImage(fr, (pw - dw) / 2, (ph - dh) / 2, dw, dh); }
      else { const sg = g.createRadialGradient(pw * .5, ph * .35, 0, pw * .5, ph * .35, pw * .7); sg.addColorStop(0, '#2a3a6a'); sg.addColorStop(1, '#070918'); g.fillStyle = sg; g.fillRect(0, 0, pw, ph); }
      g.globalAlpha = .05; g.fillStyle = '#000'; for (let yy = 0; yy < ph; yy += 4) g.fillRect(0, yy, pw, 1.5); g.globalAlpha = 1;
      const vg = g.createRadialGradient(pw / 2, ph / 2, Math.min(pw, ph) * .35, pw / 2, ph / 2, Math.max(pw, ph) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, rgba(F6.glassBot, o.vignette ?? .4)); g.fillStyle = vg; g.fillRect(0, 0, pw, ph);
      g.restore();
      if (on > 0 && on < .999) { const k2 = 1 - on, lin0 = sm(lin(0, .12, on)); g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; for (const yy of [ph / 2 - hv / 2, ph / 2 + hv / 2]) { for (const [lw2, al] of [[18, .08], [6, .25], [1.6, .95]]) { g.strokeStyle = rgba(lw2 < 2 ? F6.coolCore : F6.cool, al * (.4 + .6 * k2) * lin0); g.lineWidth = lw2; g.beginPath(); g.moveTo(-pw, yy); g.lineTo(pw * 2, yy); g.stroke(); } } g.restore(); }
    } });
  if (on <= .1) {
    const pre = c ? sm(lin(c.start - ramp - .4, c.start - ramp, t)) * (1 - sm(lin(c.end + ramp, c.end + ramp + .4, t))) : 0;
    if (pre > 0) coolLine(ctx, t, { from: [x + 8, cy], to: [x + w - 8, cy], a: pre * (1 - on / .1), head: false, w: 1.4 });
  }
  if (o.spill !== false && on > 0) addGlow(ctx, cx, cy, Math.max(w, h) * .9, .14 * on, '#cfe0f0', '#eef4ff');
  return { on, u, line: [cy - hv / 2, cy + hv / 2] };
}

// ---------------------------------------------------------------- the switch-on: a pane opens out of one cool line (old TV), the content clipped to the band
export function switchOn(ctx, t, on, x, y, w, h, draw) {
  on = clamp(on); if (on <= 0) return;
  const cy = y + h / 2, hv = Math.max(2, h * eout(on));
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10, cy - hv / 2, w + 20, hv); ctx.clip(); draw(ctx); ctx.restore();
  if (on < .999) { const k = 1 - on; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const yy of [cy - hv / 2, cy + hv / 2]) { for (const [lw, al] of [[16, .07], [5, .22], [1.5, .9]]) { ctx.strokeStyle = rgba(lw < 2 ? F6.coolCore : F6.cool, al * (.35 + .65 * k)); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x - 4, yy); ctx.lineTo(x + w + 4, yy); ctx.stroke(); } } ctx.restore(); }
}

// ---------------------------------------------------------------- the world inside the glass: a wall of talking panes in a deep dark space
// wall space = a 1920×1080 frame at cam z 1 (the two chat windows sit at its centre), panes spread far beyond it on three planes.
export const CHAT = { L: { x: 690, y: 500, w: 500, h: 330 }, R: { x: 1230, y: 500, w: 500, h: 330 }, label: 300 };
export const HARARI = { x: 2400, y: 560, w: 1180, h: 664 };
const NEAR = [[150, 260, 440, 290], [-320, 760, 380, 250], [330, 930, 420, 270], [1030, 980, 480, 310], [1600, 100, 420, 270], [1900, 1080, 460, 300], [3150, 380, 520, 340], [3080, 1000, 460, 300], [2650, -80, 400, 260], [600, -120, 400, 260], [-150, 1150, 420, 270], [3600, 760, 440, 290]];
const MID = (() => { const r = prng(404), out = []; for (let i = 0; i < 16; i++) out.push([-700 + r() * 4600, -500 + r() * 2200, 260 + r() * 120, 170 + r() * 80, r()]); return out; })();
const FAR = (() => { const r = prng(505), out = []; for (let i = 0; i < 22; i++) out.push([-900 + r() * 5000, -600 + r() * 2400, 170 + r() * 90, 110 + r() * 60, r()]); return out; })();
function tile(v) {   // a block of cool text, fully written, to scroll inside the wall panes (talking)
  return layer('c02-tile' + v, 420, 300, (g) => coolText(g, 100, { x: 14, y: 12, w: 392, size: 13, lines: 10, lineH: 28, cps: 1e4, gap: 0, seed: 60 + v, cursor: false, ripple: false, lengths: Array.from({ length: 10 }, (_, i) => .5 + .5 * Math.abs(Math.sin(i * 1.7 + v))) }));
}
// one wall pane: dark glass, thin frame, the cool edge, scrolling text with a brighter band where it is being written; dim = depth darkening
function wallPane(g, t, x, y, w, h, i, dim, on) {
  if (on <= 0) return;
  switchOn(g, t, on, x - w / 2, y - h / 2, w, h, (q) => {
    pane(q, t, { x, y, w, h, frame: 'thin', edge: .55, radius: 4, spill: false, screenA: 1, screen: (s, pw, ph) => {
      const T = tile(i % 3), sp = 9 + (i % 4) * 2.5, lh = 28 * (ph / 300), sc = ph / 300, off = (t * sp) % 300;
      s.save(); s.beginPath(); s.rect(0, 0, pw, ph); s.clip(); s.scale(pw / 420, sc); s.globalAlpha = .78; s.drawImage(T, 0, -off); s.drawImage(T, 0, 300 - off); s.globalAlpha = 1; s.restore();
      // the line being written: a soft light band near the bottom, and a cursor
      s.save(); s.globalCompositeOperation = 'lighter'; const by = ph - lh * 1.2 - (off % lh) * sc + lh * .5; const bg = s.createLinearGradient(0, by - 12, 0, by + 12); bg.addColorStop(0, rgba(F6.cool, 0)); bg.addColorStop(.5, rgba(F6.cool, .12)); bg.addColorStop(1, rgba(F6.cool, 0)); s.fillStyle = bg; s.fillRect(0, by - 12, pw, 24);
      if (Math.sin(t * TAU + i) > 0) { s.fillStyle = rgba(F6.coolCore, .9); s.fillRect(pw * (.3 + .4 * ((i * 37) % 10) / 10), by - lh * .5, 2, lh * .8); } s.restore();
    } });
    if (dim > 0) { q.fillStyle = rgba('#05060f', dim); q.fillRect(x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 6); }
  });
}
// the two chat windows of the Turing test (2.09): a warm one (the human) and a cool one (the machine), HUMAN? over each, the mark jumps
function chatPanes(g, t, o) {
  const on = o.chatOn, T = o.T;
  for (const [key, P] of [['L', CHAT.L], ['R', CHAT.R]]) {
    const human = key === 'L', col = human ? '#f1d9a8' : F6.cool, core = human ? '#fff6e2' : F6.coolCore;
    switchOn(g, t, on, P.x - P.w / 2, P.y - P.h / 2 - 70, P.w, P.h + 70, (q) => {
      pane(q, t, { x: P.x, y: P.y, w: P.w, h: P.h, frame: 'thin', edge: .8, radius: 5, spill: false, screenA: 1, screen: (s, pw, ph) => {
        // a transcript: alternating question (short) and answer lines, written over the last seconds, cursor at the end
        coolText(s, t, { x: 22, y: 18, w: pw - 44, size: 13, lines: 8, lineH: 34, t0: o.t0 - 6 + (human ? 0 : .7), cps: human ? 20 : 34, gap: human ? .5 : .2, seed: human ? 81 : 82, col, core, ripple: true, lengths: [.55, .85, .4, .9, .5, .8, .45, .7] });
      } });
      text(q, 'HUMAN?', P.x, P.y - P.h / 2 - 28, { size: 22, weight: 600, color: rgba(F6.cool, .85), align: 'center', spacing: 6 });
      // the little speaker glyph under the label: warm (a voice with a body) or cool (a line)
      q.save(); q.lineCap = 'round'; if (human) { q.strokeStyle = rgba('#f1d9a8', .75); q.lineWidth = 2; q.beginPath(); q.arc(P.x - 112, P.y - P.h / 2 - 36, 6, 0, TAU); q.stroke(); } else { q.strokeStyle = rgba(F6.cool, .8); q.lineWidth = 2; q.beginPath(); q.moveTo(P.x - 122, P.y - P.h / 2 - 36); q.lineTo(P.x - 102, P.y - P.h / 2 - 36); q.stroke(); } q.restore();
    });
  }
  // the mark: a cool ring with a dot; it sits by the warm window, then jumps to the cool one (the judge picks the machine)
  if (on > .6) {
    const j = o.jump, u = expo(j), mx = mix(CHAT.L.x + 104, CHAT.R.x + 104, u), my = CHAT.L.y - CHAT.L.h / 2 - 36 - 34 * Math.sin(Math.PI * clamp(j));
    g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(F6.coolCore, .95); g.lineWidth = 2; g.beginPath(); g.arc(mx, my, 11, 0, TAU); g.stroke(); g.fillStyle = rgba(F6.coolCore, .95); g.beginPath(); g.arc(mx, my, 3.2, 0, TAU); g.fill();
    addGlow(g, mx, my, 40, .5, F6.cool, F6.coolCore); g.restore();
    // where the mark has landed, the window's edge brightens (the choice)
    if (j >= 1) { const P = CHAT.R, k = sm(lin(0, .4, o.jumpT)); g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(F6.cool, .5 * k); g.lineWidth = 2.5; g.beginPath(); g.roundRect(P.x - P.w / 2 - 2, P.y - P.h / 2 - 2, P.w + 4, P.h + 4, 6); g.stroke(); g.restore(); }
  }
}
// the whole wall world in the current transform (wall space). o: { T, chatOn, jump, jumpT, t0, wallOn (t when the wall starts switching on),
//   harari: (g) => … (draws the Harari pane: dark pane or clip pane), cam (for the parallax of the far planes; null = none) }
export function wallWorld(g, t, o) {
  const cam = o.cam || { x: W / 2, y: H / 2, z: 1 };
  const plane = (p, fn) => { const m = camMap(cam, p), m1 = camMap(cam, 1); g.save(); g.transform(m.k / m1.k, 0, 0, m.k / m1.k, (m.tx - m1.tx) / m1.k, (m.ty - m1.ty) / m1.k); fn(g); g.restore(); };
  // the ground of the glass world: the plate's glass, scaled over the whole wall
  glassGround(g, t);
  // a cool haze deep behind the centre
  const hz = g.createRadialGradient(1400, 540, 0, 1400, 540, 1900); hz.addColorStop(0, 'rgba(40,60,110,.22)'); hz.addColorStop(1, 'rgba(40,60,110,0)'); g.fillStyle = hz; g.fillRect(-1400, -900, 4800, 2700);
  const onAt = (i, k) => sm(lin(o.wallOn + i * .055 + k * .3, o.wallOn + i * .055 + k * .3 + .45, t));
  plane(.72, (q) => { FAR.forEach(([x, y, w, h, k], i) => wallPane(q, t, x, y, w, h, i + 40, .5, onAt(i + 12, k))); });
  plane(.86, (q) => { MID.forEach(([x, y, w, h, k], i) => wallPane(q, t, x, y, w, h, i + 20, .28, onAt(i + 6, k))); });
  NEAR.forEach(([x, y, w, h], i) => wallPane(g, t, x, y, w, h, i, .08, onAt(i, (i % 3) * .4)));
  if (o.harari) o.harari(g);
  chatPanes(g, t, o);
  // the near plane: two big dark panes passing in the foreground (depth)
  plane(1.15, (q) => { for (const [x, y, w, h] of [[-200, 200, 900, 600], [3900, 950, 900, 600]]) { q.fillStyle = 'rgba(4,5,12,.9)'; q.beginPath(); q.roundRect(x - w / 2, y - h / 2, w, h, 6); q.fill(); q.strokeStyle = rgba(F6.cool, .18); q.lineWidth = 1.5; q.stroke(); } });
}
