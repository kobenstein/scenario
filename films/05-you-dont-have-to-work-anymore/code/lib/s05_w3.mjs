// s05_w3 · chapter 05, window 3: CLIP A (Sam Altman, vertical 608×1080) over a dusk wheat field at ~30 %;
// out: push into the last frame, it tilts flat and becomes the top of a kitchen table at night (chapter 06 starts there).
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, roughPath, roughPoly, roughRect, roughLine, hatch, fog, cone, printFinish, vnoise, stratus } from './art.mjs';
import { lin, sm, eio, eout, ein, sine, drift, text } from '../engine.mjs';
import { clipScreen, clipInfo } from './kit.mjs';
import { memo, glowSprite, spr, bloom, WARM, HOT, CREAM, WHITE } from './s05_kit.mjs';

const FR = { x: 700, y: 64, w: 462, h: 820 };          // 608:1080 portrait; lower 160 px stay free for subtitles
const SUN = [1380, 610];
function sky() {
  return memo('a_sky', () => {
    const [c, g] = layer();
    const gr = g.createLinearGradient(0, 0, 0, 700); gr.addColorStop(0, '#1a1838'); gr.addColorStop(.45, '#6a3a4a'); gr.addColorStop(.8, '#e08a4a'); gr.addColorStop(1, '#f6c27a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    bloom(g, SUN[0], SUN[1], 520, { col: '#ffa050', core: '#fff0c8', a: .6, k: .35, seed: 2 });
    g.fillStyle = '#fff1cf'; g.beginPath(); g.arc(SUN[0], SUN[1], 46, 0, 7); g.fill();
    const [hc, hx] = layer(); hx.beginPath(); for (const [y, x0, x1, th] of [[420, 900, 2100, 18], [470, 1100, 1800, 10], [330, -200, 700, 14]]) stratus(hx, y, x0, x1, th, y); hx.fillStyle = rgba('#e88a58', .55); hx.fill(); hx.save(); hx.clip(); hatch(hx, [0, 300, W, 200], { angle: -.015, gap: 4, w: 1.1, col: '#ffd9a4', a: .55, seed: 5, broken: .3 }); hx.restore(); put(g, hc);
    // far tree line + a farmhouse with one lit window
    roughPoly(g, [[-20, 640], [200, 628], [420, 636], [700, 622], [1000, 634], [1300, 626], [1600, 638], [1940, 628], [1940, 700], [-20, 700]], '#3a2a34', { amp: 3, step: 10, seed: 6 });
    roughRect(g, 420, 600, 70, 36, '#2a1c24', { amp: .6, seed: 7 }); roughPoly(g, [[410, 602], [455, 576], [500, 602]], '#2a1c24', { amp: .5, seed: 8 }); g.fillStyle = '#ffcf8a'; g.fillRect(440, 612, 8, 10);
    g.drawImage(wheat(0), -100, 0);
    g.fillStyle = 'rgba(8,8,22,.62)'; g.fillRect(0, 0, W, H);
    return c;
  });
}
// wheat layers: far (fine stroke texture), mid, near (big heads). Each sways by a skew around its base.
function wheat(k) {
  return memo('a_wh' + k, () => {
    const [c, g] = layer(W + 200, H), r = prng(10 + k), y0 = [640, 720, 860][k], n = [9000, 3500, 700][k], len = [10, 34, 120][k];
    if (k === 0) { const gr = g.createLinearGradient(0, 630, 0, H); gr.addColorStop(0, '#c88a40'); gr.addColorStop(1, '#5a3418'); g.fillStyle = gr; g.fillRect(0, 632, W + 200, H); }
    for (let i = 0; i < n; i++) {
      const x = r() * (W + 200), y = y0 + Math.pow(r(), k === 2 ? .7 : 1.4) * (H - y0 + 40), d = (y - y0) / (H - y0 + 1), l = len * (.6 + .6 * r()) * (1 + d);
      const lit = Math.max(0, 1 - Math.abs(x - SUN[0] - 100) / 1100);
      g.strokeStyle = mixHex('#6a3a14', '#ffd38a', clamp(lit * .8 + r() * .3 - d * .3)); g.globalAlpha = .55 + .4 * r(); g.lineWidth = k === 2 ? 2.2 : 1;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 2, y - l * .5, x + 4 + (r() - .3) * 6, y - l); g.stroke();
      if (k > 0) { g.fillStyle = g.strokeStyle; g.beginPath(); g.ellipse(x + 5, y - l - (k === 2 ? 12 : 4), k === 2 ? 4.5 : 1.8, k === 2 ? 14 : 5, .15, 0, 7); g.fill(); }
    }
    g.globalAlpha = 1; if (k > 0) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(8,8,22,.62)'; g.fillRect(0, 0, W + 200, H); } return c;
  });
}
function kitchen() {
  return memo('a_kit', () => {
    const [c, g] = layer();
    g.fillStyle = '#121230'; g.fillRect(0, 0, W, H);
    const gr = g.createRadialGradient(960, 300, 0, 960, 300, 1200); gr.addColorStop(0, 'rgba(255,190,120,.4)'); gr.addColorStop(.4, 'rgba(120,70,60,.15)'); gr.addColorStop(1, 'rgba(4,4,14,.7)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    hatch(g, [0, 0, W, 600], { angle: -.6, gap: 6, w: 1, col: '#05050f', a: .3, seed: 3, broken: .4 });
    roughRect(g, 160, 150, 300, 330, '#0a0e2a', { amp: 1.5, seed: 4 }); const r = prng(4); for (let i = 0; i < 30; i++) { g.fillStyle = rgba('#dfe8ff', .2 + .5 * r()); g.fillRect(170 + r() * 280, 160 + r() * 300, 1.4, 1.4); }
    roughRect(g, 306, 150, 8, 330, '#05050f', { amp: .4, seed: 5 }); roughRect(g, 160, 312, 300, 8, '#05050f', { amp: .4, seed: 6 });
    roughLine(g, [[960, -10], [960, 210]], { w: 3, col: '#05050f', seed: 7 }); roughPoly(g, [[900, 250], [1020, 250], [990, 205], [930, 205]], '#1a1420', { amp: .5, seed: 8 });
    cone(g, 960, 250, { spread: .62, len: 900, col: '#ffd59a', a: .22, k: .6, seed: 9, op: 'screen' });
    return c;
  });
}
function wood() {
  return memo('a_wood', () => {
    const [c, g] = layer(600, 800), r = prng(12), n = vnoise(13);
    g.fillStyle = '#6a3a20'; g.fillRect(0, 0, 600, 800);
    for (let p = 0; p < 4; p++) { const x0 = p * 150; g.fillStyle = mixHex('#5a3018', '#7a4626', r()); g.fillRect(x0 + 2, 0, 146, 800); g.fillStyle = 'rgba(20,8,4,.7)'; g.fillRect(x0, 0, 2.5, 800);
      for (let k = 0; k < 24; k++) { g.strokeStyle = rgba(r() < .5 ? '#2a1208' : '#a86a3a', .25 + .2 * r()); g.lineWidth = 1 + r(); g.beginPath(); const xx = x0 + 6 + r() * 138; for (let y = 0; y <= 800; y += 20) g.lineTo(xx + (n(xx * .05, y * .006) - .5) * 14, y); g.stroke(); } }
    const lg = g.createRadialGradient(300, 260, 0, 300, 260, 520); lg.addColorStop(0, 'rgba(255,200,130,.45)'); lg.addColorStop(1, 'rgba(10,4,4,.55)'); g.fillStyle = lg; g.fillRect(0, 0, 600, 800);
    return c;
  });
}
// draw a texture into a quad [tl,tr,br,bl] by horizontal slices (a cheap perspective tilt)
function quadDraw(ctx, img, q, a = 1, N = 120) {
  if (a <= 0) return; const [tl, tr, br, bl] = q; ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < N; i++) { const v0 = i / N, v1 = (i + 1) / N, y0 = mix(tl[1], bl[1], v0), y1 = mix(tl[1], bl[1], v1), xl = mix(tl[0], bl[0], (v0 + v1) / 2), xr = mix(tr[0], br[0], (v0 + v1) / 2);
    ctx.drawImage(img, 0, v0 * img.height, img.width, img.height / N + .5, xl, y0, xr - xl, y1 - y0 + .8); }
  ctx.restore();
}
const [clipC, clipX] = layer(FR.w, FR.h);
export function shotClipA(T) {
  const c = T.clip('A'), T0 = c.start - .6, T6 = T.seg('06a').start - 1.0, info = clipInfo('A');
  const tilt0 = T6 - 1.15, tilt1 = T6 + .05;
  return {
    t: T0, tr: 'right', d: .6,
    draw(ctx, t) {
      const e = eio(lin(tilt0, tilt1, t)), push = 1 + .03 * sine(lin(T0, tilt0, t));
      // the dusk wheat field, drifting; dimmed to ~30 % so the face leads
      const dx = drift(t, 10) - (t - T0) * 6;
      ctx.drawImage(sky(), drift(t, 4, 1) - 20, 0, W + 40, H);
      for (let k = 1; k < 3; k++) { const sw = (Math.sin(t * (.8 + k * .3) + k) * .04 + Math.sin(t * 2.1 + k * 2) * .015) * (k + 1) * .6, by = [700, 820, 1080][k];
        ctx.save(); ctx.translate(-100 + (dx * (k + 1) * .6) % 100, by); ctx.transform(1, 0, -sw, 1, 0, 0); ctx.translate(0, -by); ctx.drawImage(wheat(k), 0, 0); ctx.restore(); }
      // the kitchen fades up behind as the frame tilts flat
      if (e > 0) { ctx.save(); ctx.globalAlpha = sm(lin(.15, .75, e)); const z = mix(1.25, 1, e); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); ctx.drawImage(kitchen(), 0, 0); ctx.restore(); }
      // the frame slides in from the left with smear frames and an ease-out landing
      const ui = lin(T0 - .15, T0 + .6, t), slide = (1 - eout(ui)) * -1150, vel = ui > 0 && ui < 1 ? 3 * Math.pow(1 - ui, 2) * 1150 / .75 : 0;
      clipX.clearRect(0, 0, FR.w, FR.h); clipScreen(clipX, t, T, 'A', 0, 0, FR.w, FR.h, { bezel: false, glow: false, radius: 12 });
      const cx = FR.x + FR.w / 2, cy = FR.y + FR.h / 2;
      const rect = (x0) => { const w = FR.w * push, h = FR.h * push; return [x0 + cx - w / 2, cy - h / 2, w, h]; };
      if (e <= 0) {
        // smear ghosts while moving fast
        if (vel > 300) for (let i = 4; i >= 1; i--) { const [x, y, w, h] = rect(slide - i * vel * .012); ctx.globalAlpha = .14 * (1 - i / 5) * Math.min(1, vel / 2000); ctx.drawImage(clipC, x, y, w * (1 + i * .03), h); ctx.globalAlpha = 1; }
        const [x, y, w, h] = rect(slide);
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14; ctx.fillStyle = '#05060f'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.fill(); ctx.restore();
        ctx.drawImage(clipC, x, y, w, h);
        ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.stroke();
        // name label beside the frame
        const la = eout(lin(c.start + .3, c.start + 1.0, t)) * (1 - lin(tilt0 - .6, tilt0, t)), lx = x + w + 56, ly = y + h - 90;
        if (la > 0) { ctx.fillStyle = rgba(WARM, la); ctx.fillRect(lx, ly - 40 + (1 - la) * 14, 4, 80);
          text(ctx, info.name, lx + 22, ly + (1 - la) * 14, { size: 46, font: 'Instrument Serif', alpha: la });
          text(ctx, 'CEO, OPENAI · INTERVIEW 2025', lx + 24, ly + 34 + (1 - la) * 14, { size: 17, weight: 600, color: '#a49fc4', alpha: la, spacing: 4 }); }
      } else {
        // push in + tilt flat: the portrait frame's corners travel to the table top's corners
        const [x, y, w, h] = rect(0), q0 = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], q1 = [[600, 540], [1320, 540], [1980, 1110], [-60, 1110]];
        const ee = e, q = q0.map((p, i) => [mix(p[0], q1[i][0], ee), mix(p[1], q1[i][1], ee)]);
        ctx.save(); ctx.fillStyle = `rgba(0,0,0,${.4 * (1 - ee)})`; ctx.beginPath(); ctx.moveTo(...q[0]); q.forEach((p) => ctx.lineTo(...p)); ctx.fill(); ctx.restore();
        quadDraw(ctx, clipC, q, 1 - sm(lin(.35, .85, ee)));
        quadDraw(ctx, wood(), q, sm(lin(.3, .8, ee)));
        // the table's front edge + lamp glint grow in at the end
        const fe = sm(lin(.6, 1, ee)); if (fe > 0) { ctx.strokeStyle = rgba(HOT, .4 * fe); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...q[0]); ctx.lineTo(...q[1]); ctx.stroke(); spr(ctx, glowSprite(260, WARM, WHITE, .35, .45, 4), 960, 700, 1.4, fe * (.9 + .05 * Math.sin(t * 3))); }
      }
      printFinish(ctx, { grain: .06, vig: .45 });
    },
  };
}
