// Film 8 · c02.06 (B1, local): Vernor Vinge's study in 1993, desk items for s8_desk.room: a typewriter that types a page by itself (the
// lines stay unreadable), paperbacks with starfield covers. Desk coordinates (s8_desk): the keys face the window (+Z).
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, fillPoly } from './s8_kit.mjs';
import { DESK, sheet, book } from './s8_desk.mjs';

// typewriter({ x, z, t0 (typing starts), cps 9 (characters per second) })
export function typewriter(o) {
  return { x: o.x, z: o.z, drawItem: (ctx, t, C) => {
    const X = o.x, Z = o.z, y = DESK.top, W = .17, D = .15, n = Math.max(0, (t - (o.t0 ?? 0)) * (o.cps ?? 9));
    const P = (a, h, b) => [X + a, y + h, Z + b];
    const face = (pts, col, rim) => { const S = projPoly(C, pts); if (fillPoly(ctx, S, col) && rim) { ctx.strokeStyle = rim; ctx.lineWidth = 1; ctx.stroke(); } return S; };
    // the paper standing in the platen, leaning back; typed lines appear (unreadable)
    const pw = .21, ph = .27, lean = .25, base = [0, .115, -D * .55];
    const PC = [P(-pw / 2, base[1] + ph * Math.cos(lean), base[2] - ph * Math.sin(lean)), P(pw / 2, base[1] + ph * Math.cos(lean), base[2] - ph * Math.sin(lean)), P(pw / 2, base[1], base[2]), P(-pw / 2, base[1], base[2])];
    const lineN = 18, perLine = 42;   // the page already holds ~ 8 lines when we arrive (o.t0 is when it started)
    sheet(ctx, t, C, { corners: PC, aspect: pw / ph, res: .4, n: 3, lamp: false, draw: (g, tt, Wp, Hp) => {
      const pg = g.createLinearGradient(0, 0, 0, Hp); pg.addColorStop(0, '#d8c8a4'); pg.addColorStop(.6, '#e8dcc0'); pg.addColorStop(1, '#b89a70'); g.fillStyle = pg; g.fillRect(0, 0, Wp, Hp);
      const r = prng(19); g.fillStyle = 'rgba(30,26,24,.8)';
      for (let l = 0; l < lineN; l++) { const lenL = perLine * (.6 + .4 * r()); for (let c = 0; c < lenL; c++) { const k = l * perLine + c; if (k > n) return; if (r() < .17) continue; g.fillRect(Wp * .1 + c * Wp * .0185, Hp * .1 + l * Hp * .042, Wp * .013, Hp * .016); } }
    } });
    // body: back hump with the platen, the keyboard slope, the front
    face([P(-W, .03, -D * .75), P(W, .03, -D * .75), P(W, .12, -D * .6), P(-W, .12, -D * .6)], '#151216', 'rgba(255,200,140,.18)');
    face([P(-W * 1.12, .1, -D * .62), P(W * 1.12, .1, -D * .62), P(W * 1.12, .135, -D * .5), P(-W * 1.12, .135, -D * .5)], '#0e0c10', 'rgba(255,200,140,.3)');   // the platen
    const slope = face([P(-W, .085, -D * .4), P(W, .085, -D * .4), P(W, .025, D * .5), P(-W, .025, D * .5)], '#1c181c', 'rgba(255,200,140,.22)');
    face([P(-W, .025, D * .5), P(W, .025, D * .5), P(W, 0, D * .55), P(-W, 0, D * .55)], '#0c0a0c');
    // keys
    for (let row = 0; row < 4; row++) for (let i = 0; i < 11; i++) {
      const a = -W * .85 + i * W * .17 + row * .006, b = -D * .25 + row * D * .17, h = .085 - (b + D * .4) / (D * .9) * .06 + .006, p = C.P(...P(a, h, b)); if (!p) continue;
      const hit = Math.floor(n) % 44 === row * 11 + i && (n % 1) < .5, rr = Math.max(1, .0065 * p[2]);
      ctx.fillStyle = hit ? '#d8c8a8' : '#2c2a2e'; ctx.beginPath(); ctx.ellipse(p[0], p[1] + (hit ? rr * .4 : 0), rr, rr * .7, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(232,220,200,.45)'; ctx.lineWidth = .8; ctx.stroke();
    }
    // the typebar strike (a quick arm from the basket to the platen on every character)
    const ph2 = n % 1; if (n > 0 && ph2 < .45) { const a = C.P(...P(0, .06, -D * .2)), b = C.P(...P((Math.floor(n) % 42 - 21) * .002, .12, -D * .55)); if (a && b) { const u = Math.sin(Math.PI * ph2 / .45); ctx.strokeStyle = '#3a3438'; ctx.lineWidth = Math.max(1, a[2] * .003); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u); ctx.stroke(); } }
  } };
}
// a paperback with a starfield cover
export function paperback(o) {
  const seed = o.seed ?? 1;
  return book({ ...o, w: .11, d: .175, th: .018, col: o.col || '#14182c', cover: (g, t, W, H) => {
    const r = prng(seed), gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, o.c0 || '#0a0c22'); gr.addColorStop(1, o.c1 || '#2a1840'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 160; i++) { const s = r() < .9 ? 2 + r() * 3 : 6 + r() * 6; g.fillStyle = `rgba(240,240,255,${.4 + .6 * r()})`; g.beginPath(); g.arc(r() * W, r() * H, s, 0, TAU); g.fill(); }
    g.save(); g.globalCompositeOperation = 'lighter'; const n = g.createRadialGradient(W * .6, H * .4, 0, W * .6, H * .4, W * .5); n.addColorStop(0, o.neb || 'rgba(255,140,90,.45)'); n.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = n; g.fillRect(0, 0, W, H); g.restore();
    g.fillStyle = o.band || '#e8c070'; g.fillRect(W * .08, H * .07, W * .84, H * .1); g.fillStyle = '#1a1418'; for (let i = 0; i < 6; i++) g.fillRect(W * (.14 + i * .12), H * .1, W * .08, H * .04);
  } });
}
