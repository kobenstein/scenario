// s03b_rest · shots 3.29 → CLIP S of chapter 03 (second half). Called from scenes/s03b.mjs (carrier chain is documented there).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, drift, text, addGlow } from '../engine.mjs';
import { once, plate, inPlate, toScreen, sprite, walker, leafField, drawLeaves, integ, pool2 } from './s03b_kit.mjs';
import { noonPlates, BN, panelScene, drawPanel, stampCanvas, drawStamp, retiredCanvas, drawRetired, formPlates, FM, GOLD, HOT, RED } from './s03b_word.mjs';
import { bridgePlates, BR, courtyardPlate, CY, centreWindowLight, kitchenPlates, KT, reflection } from './s03b_night.mjs';
import { roughLine, roughRect, roughPoly, layer, vnoise, mixHex } from './art.mjs';
import { clipScreen, clipInfo } from './kit.mjs';
import fs from 'node:fs';

const ROLE = JSON.parse(fs.readFileSync('/mnt/project-files/scenario/film-04-work/audio/clips.json', 'utf8')).S.role;
const AMBER = { coat: '#e59a3a', coatDark: '#9a5420', pants: '#1a1830', shoes: '#0d0c1c', skin: '#e9c3a0', hair: '#2a1a14' };
const srcLine = (ctx, s, a, y = 1032) => { if (a > 0) text(ctx, s, 110, y, { size: 16, weight: 400, color: '#9a96bc', alpha: a }); };

export default async function (T) {
  const S = (p) => T.S('03b', p), E = (p) => T.E('03b', p), Sc = (p) => T.S('03c', p), Ec = (p) => T.E('03c', p);
  const clip = T.clip('S'), tEnd = T.seg('04a').start - 1.0;
  const shots = [];
  const tRun = E('not less') - .1;

  // ===================================================================================== 3.29 the empty bench at noon
  const t4 = tRun + .38, t5 = S('It was the word') - .25;
  {
    const P = noonPlates(), leaves = leafField(5, 26, ['#c9a24a', '#a8762e', '#e0c070', '#8a8a3a']);
    const fx = BN.bench[0], fy = BN.slatY - 40;
    const cam = (t) => { const e = eio(lin(t5 - 1.1, t5 + .25, t)); return { x: drift(t, 12, 2) - (t - t4) * 9, y: drift(t, 5, 4), z: (1.08 + (t - t4) * .02) * Math.pow(5.5, e), fx, fy }; };
    shots.push({
      t: t4, tr: 'left', d: .8,
      draw(ctx, t) {
        const c = cam(t);
        plate(ctx, P.far, c, .35); plate(ctx, P.bench, c, .75);
        inPlate(ctx, c, .75, (g) => {
          // pigeons pecking by the bench
          for (const [px, ph, s] of [[760, 0, 1], [820, 1.7, .9], [1300, 3.1, 1.1]]) { const pk = Math.max(0, Math.sin(t * 2.6 + ph)) ** 6 * 6 * s, py = BN.bench[1] + 30 + s * 6; g.fillStyle = '#5a5650'; g.beginPath(); g.ellipse(px + Math.sin(t * .4 + ph) * 8, py, 15 * s, 9 * s, -.15, 0, 7); g.fill(); g.beginPath(); g.arc(px + 14 * s + Math.sin(t * .4 + ph) * 8, py - 8 * s + pk, 5.5 * s, 0, 7); g.fill(); }
          // the line from the chart arrives from the left and lands as light along the top slat
          const u = eout(lin(t4 - .45, t4 + .5, t)), fade = 1 - lin(t4 + .6, t4 + 2.2, t);
          if (fade > 0) { const x0 = BN.bench[0] - 262, x1 = BN.bench[0] + 262, xe = mix(-300, x1, u), y = BN.slatY - 72 + 4;
            ctx.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(GOLD, .9 * fade); g.lineWidth = 4; g.beginPath(); g.moveTo(Math.max(-300, xe - 900), y); g.lineTo(xe, y); g.stroke(); g.globalCompositeOperation = 'source-over'; ctx.restore();
            addGlow(g, xe, y, 70, .8 * fade, C.amber, '#fff3dd'); if (xe > x0) addGlow(g, (x0 + xe) / 2, y, (xe - x0) / 2 + 40, .25 * fade, C.amber, '#ffe9c0'); }
        });
        plate(ctx, P.tree, c, 1.15);
        drawLeaves(ctx, leaves, t, { a: .9, wind: 34, fall: 34 });
      },
    });
  }

  // ===================================================================================== 3.30 [G3a] the form, the stamp, the age line
  const tStamp = S('It was the word') + .48, tAge = S('retirement age') + .6, t6 = tAge + .65;
  {
    const P = formPlates(), st = stampCanvas('UNEMPLOYED', 84), { x, y, w, h } = FM, [sx, sy, sw, sh] = FM.snap;
    const snapC = once('snapC', () => { const [c, g] = layer(sw, sh); g.drawImage(panelScene(800, 560, false, 1.3), 0, 0, sw, sh); return c; });
    const focus = [sx + sw / 2, sy + sh / 2];
    const cam = (t) => { const e = ein(lin(t6 - .75, t6 + .25, t)), sh2 = Math.exp(-Math.pow((t - tStamp) / .06, 2)) * 0 + (t > tStamp ? Math.exp(-(t - tStamp) * 12) * Math.sin((t - tStamp) * 60) * 5 : 0);
      return { x: drift(t, 10, 7) + (W / 2 - focus[0]) * e * .9, y: drift(t, 5, 8) - (t - t5) * 6 + sh2 + (H / 2 - focus[1]) * e * .9, z: (1.0 + .9 * Math.pow(1 - eout(lin(t5 - .25, t5 + 1, t)), 2) + (t - t5) * .012) * Math.pow(4.6, e), fx: focus[0], fy: focus[1] }; };
    shots.push({
      t: t5, tr: 'match', d: .5,
      draw(ctx, t) {
        const c = cam(t);
        plate(ctx, P.desk, c, .8); plate(ctx, P.paper, c, 1);
        inPlate(ctx, c, 1, (g) => {
          // snapshot clipped to the form (a little photo of the bench)
          g.save(); g.translate(sx + sw / 2, sy + sh / 2); g.rotate(.035); g.fillStyle = 'rgba(5,6,26,.35)'; g.fillRect(-sw / 2 + 8, -sh / 2 + 10, sw + 20, sh + 40); g.fillStyle = '#f4efe2'; g.fillRect(-sw / 2 - 10, -sh / 2 - 10, sw + 20, sh + 40); g.drawImage(snapC, -sw / 2, -sh / 2); g.restore();
          g.strokeStyle = '#8a8aa0'; g.lineWidth = 3; g.beginPath(); g.roundRect(sx + 30, sy - 26, 18, 70, 9); g.stroke();
          // the stamp: lifts into view (shadow first), slams on "word"
          const pre = lin(tStamp - .45, tStamp, t), sc = t < tStamp ? mix(1.6, 1.0, ein(pre)) : 1, a = t < tStamp ? sm(pre) * .0 : 1;
          if (t >= tStamp - .45 && t < tStamp) { g.fillStyle = rgba('#05061a', .25 * pre); g.beginPath(); g.ellipse(x + 520, y + 580, 380 * sc, 70 * sc, -.06, 0, 7); g.fill(); }
          if (t >= tStamp) { drawStamp(g, st, x + 520, y + 580, -.06, 1.05, () => 1, 1); const fl = Math.exp(-(t - tStamp) * 6); if (fl > .02) addGlow(g, x + 520, y + 580, 420, .25 * fl, '#ff6a4a', '#ffd0c0'); }
          // the age line along the ruled lines: 55 … 70, a marker walks to 65 on "age"
          const ay = y + 838, ax0 = x + 120, ax1 = x + w - 120, A = (age) => mix(ax0, ax1, (age - 55) / 15), lA = eout(lin(S('Researchers watched') - .1, S('Researchers watched') + .6, t));
          if (lA > 0) {
            g.globalAlpha = lA; g.strokeStyle = '#3a3450'; g.lineWidth = 2; g.beginPath(); g.moveTo(ax0, ay); g.lineTo(mix(ax0, ax1, lA), ay); g.stroke();
            for (let k = 55; k <= 70; k++) { const xx = A(k); g.fillRect(xx - 1, ay - (k % 5 ? 6 : 12), 2, k % 5 ? 6 : 12); if (k % 5 === 0) text(g, String(k), xx, ay + 30, { size: 18, weight: 600, color: '#3a3450', align: 'center' }); }
            text(g, 'AGE', ax0 - 10, ay - 22, { size: 14, weight: 600, color: '#8f8aa8', spacing: 4 }); g.globalAlpha = 1;
            const age = mix(57, 65, eio(lin(S('people without'), tAge, t))), mx = A(age);
            g.fillStyle = '#3a3450'; g.beginPath(); g.arc(mx, ay, 7, 0, 7); g.fill();
            const hit = lin(tAge - .05, tAge + .3, t);
            if (hit > 0) { const r = 26 * eout(hit); g.fillStyle = GOLD; g.beginPath(); g.arc(A(65), ay - 52, r, 0, 7); g.fill(); text(g, '65', A(65), ay - 44, { size: 22, weight: 600, color: '#2a1406', align: 'center', alpha: hit }); addGlow(g, A(65), ay - 52, 90, .6 * hit, C.amber, '#fff1d6');
              text(g, 'retirement age', A(65) + 40, ay - 46, { size: 26, font: 'Instrument Serif Italic', color: '#3a3450', alpha: eout(lin(tAge + .1, tAge + .6, t)) }); }
          }
        });
        srcLine(ctx, 'Source: Hetschko, Knabe & Schöb (2014), The Economic Journal — unemployed people reaching retirement', eout(lin(S('Researchers watched'), S('Researchers watched') + .6, t)) * (1 - lin(t6 - .6, t6 - .2, t)));
      },
    });
  }

  // ===================================================================================== 3.31 / 3.32 the bench, grey then warm (same frame)
  const t7 = S('But they got') - .05, t8 = S('They weren') - .15;
  const benchCam = (t) => ({ x: drift(t, 10, 9) - (t - t6) * 5, y: drift(t, 4, 10), z: 1.05 + 1.2 * Math.pow(1 - eout(lin(t6 - .25, t6 + .9, t)), 2) + (t - t6) * .01, fx: 960, fy: 560 });
  const days = (ctx, t, warmFrom) => {   // the days run on, identical; cells turn amber after the switch
    const y = 960, cw = 64, off = ((t - t6) * 70) % (cw * 7);
    ctx.save(); ctx.globalAlpha = .9;
    for (let i = -8; i < 36; i++) { const x = 110 + i * cw - off; if (x < 60 || x > 1810) continue; const warm = t > warmFrom && x > 960 - (t - warmFrom) * 900;
      roughRect(ctx, x + 3, y, cw - 6, 30, warm ? '#3a2a1c' : '#1c2238', { amp: .4, seed: i & 7 }); ctx.fillStyle = warm ? GOLD : '#7a809a'; ctx.fillRect(x + cw / 2 - 9, y + 9, 18, 2); ctx.fillRect(x + cw / 2 - 9, y + 15, 18, 3); ctx.fillRect(x + cw / 2 - 7, y + 18, 2, 6); ctx.fillRect(x + cw / 2 + 5, y + 18, 2, 6);
      if ((((i + Math.floor((t - t6) * 70 / (cw * 7)) * 7) % 7) + 7) % 7 === 0) text(ctx, 'MON', x + 4, y - 8, { size: 11, weight: 600, color: '#8a90b0', spacing: 2 }); }
    ctx.restore();
  };
  shots.push({
    t: t6, tr: 'match', d: .5,
    draw(ctx, t) {
      const c = benchCam(t); inPlate(ctx, c, 1, (g) => drawPanel(g, 0, 0, W, H, false, 2.4, t));
      const g2 = ctx.createLinearGradient(0, 860, 0, H); g2.addColorStop(0, 'rgba(10,12,34,0)'); g2.addColorStop(1, 'rgba(10,12,34,.85)'); ctx.fillStyle = g2; ctx.fillRect(0, 860, W, 220);
      days(ctx, t, 1e9); text(ctx, 'the same days', 110, 1040, { size: 30, font: 'Instrument Serif Italic', color: '#c9c4e0', alpha: eout(lin(S('their days'), S('their days') + .6, t)) });
    },
  });
  shots.push({
    t: t7, tr: 'match', d: .8,
    draw(ctx, t) {
      const c = benchCam(t); inPlate(ctx, c, 1, (g) => drawPanel(g, 0, 0, W, H, true, 2.4, t));
      const g2 = ctx.createLinearGradient(0, 860, 0, H); g2.addColorStop(0, 'rgba(20,14,10,0)'); g2.addColorStop(1, 'rgba(20,14,10,.8)'); ctx.fillStyle = g2; ctx.fillRect(0, 860, W, 220);
      days(ctx, t, t7 + .2);
      // the satisfaction line steps up on "noticeably happier"
      const tn = S('noticeably'), u = lin(tn - .3, tn + .9, t), ly = 900, x0 = 1180, x1 = 1810, xs = 1300, n = vnoise(8);
      if (u > 0) { const pts = []; for (let x = x0; x <= mix(x0, x1, eout(u)); x += 5) { const up = x < xs ? 0 : 44 * (1 - Math.exp(-(x - xs) / 30)); pts.push([x, ly - up + (n(x * .03, 1) - .5) * 3]); }
        if (pts.length > 1) roughLine(ctx, pts, { w: 4, col: GOLD, seed: 2, amp: .3 }); const p = pts[pts.length - 1]; if (p && u < 1) addGlow(ctx, p[0], p[1], 40, .7, C.amber, '#fff3dd');
        text(ctx, 'noticeably happier', x1, ly - 64, { size: 30, font: 'Instrument Serif Italic', color: HOT, align: 'right', alpha: eout(lin(tn, tn + .6, t)) }); }
    },
  });

  // ===================================================================================== 3.33 [G3b] the diptych: UNEMPLOYED fades, "retired" is written
  const t9 = S('Now imagine') - .1;
  const PW = 800, PH = 560, PY = 170, XL = 120, XR = 1000;
  {
    const st = stampCanvas('UNEMPLOYED', 84), rc = retiredCanvas(150), tU = S('unemployed'), tUe = E('unemployed'), tR = S('retired') + .1;
    const cam = (t) => ({ x: drift(t, 8, 11), y: drift(t, 4, 12), z: 1.0 + (t - t8) * .006, fx: 960, fy: 540 });
    shots.push({
      t: t8, tr: 'out', d: .9, x: XR + PW / 2, y: PY + PH / 2, depth: W / PW,
      draw(ctx, t) {
        const c = cam(t);
        { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0c22'); g.addColorStop(1, '#14173a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
        inPlate(ctx, c, 1, (g) => {
          drawPanel(g, XL, PY, PW, PH, false, 1.3, t); drawPanel(g, XR, PY, PW, PH, true, 1.3, t);
          for (const [X, warm] of [[XL, false], [XR, true]]) { g.strokeStyle = rgba(warm ? HOT : '#8a90a8', .5); g.lineWidth = 1.5; g.strokeRect(X, PY, PW, PH); }
          // UNEMPLOYED fades letter by letter while the word is spoken
          drawStamp(g, st, XL + PW * .56, PY + 120, -.07, .86, (i) => 1 - sm(lin(tU + i * (tUe - tU) / 10, tU + i * (tUe - tU) / 10 + .35, t)));
          drawRetired(g, rc, XR + PW * .56, PY + 130, eio(lin(tR, tR + 1.0, t)));
          const x = (XL + PW + XR) / 2; g.fillStyle = GOLD; g.beginPath(); g.arc(x, PY + PH / 2, 22, 0, 7); g.fill(); addGlow(g, x, PY + PH / 2, 70, .5, C.amber, '#fff1d6'); text(g, '65', x, PY + PH / 2 + 8, { size: 22, weight: 600, color: '#2a1406', align: 'center' });
          // days + line (as in the approved art test)
          const sy = PY + PH + 64, cells = 28, cw = (XR + PW - XL) / cells;
          for (let i = 0; i < cells; i++) { const xx = XL + i * cw, warm = xx >= XR - 40; roughRect(g, xx + 3, sy, cw - 6, 30, warm ? '#3a2a1c' : '#1c2238', { amp: .4, seed: i }); g.fillStyle = warm ? GOLD : '#7a809a'; const ix = xx + cw / 2; g.fillRect(ix - 9, sy + 9, 18, 2); g.fillRect(ix - 9, sy + 15, 18, 3); g.fillRect(ix - 7, sy + 18, 2, 6); g.fillRect(ix + 5, sy + 18, 2, 6); if (i % 7 === 0) text(g, 'MON', xx + 4, sy - 8, { size: 11, weight: 600, color: '#6f7596', spacing: 2 }); }
          text(g, 'the same days', XL, sy + 62, { size: 26, font: 'Instrument Serif Italic', color: '#b9b3d8' });
          const ly = sy + 150, lx0 = XL + 330, lx1 = XR + PW, xs = (XL + PW + XR) / 2, n = vnoise(8), pts = [];
          for (let xx = lx0; xx <= lx1; xx += 4) { const up = xx < xs ? 0 : 44 * (1 - Math.exp(-(xx - xs) / 30)); pts.push([xx, ly - up + (n(xx * .03, 1) - .5) * 3]); }
          roughLine(g, pts, { w: 4, col: GOLD, seed: 2, amp: .3 });
          text(g, 'LIFE SATISFACTION · SCHEMATIC', XL, ly + 5, { size: 12, weight: 600, color: '#8f8ab0', spacing: 3 });
          text(g, 'noticeably happier', lx1, ly - 58, { size: 24, font: 'Instrument Serif Italic', color: HOT, align: 'right' });
          g.fillStyle = GOLD; g.fillRect(XL, 66, 28, 2); text(g, 'NOTHING ABOUT THEIR DAYS CHANGED', XL, 98, { size: 16, weight: 600, color: '#a49fc4', spacing: 6 });
          text(g, 'Only the word.', XL, 146, { size: 44, font: 'Instrument Serif', color: '#f3efe2', alpha: eout(lin(tR, tR + .7, t)) });
        });
        srcLine(ctx, 'Source: Hetschko, Knabe & Schöb (2014), The Economic Journal', eout(lin(t8 + .3, t8 + 1, t)), 1050);
      },
    });
  }

  // ===================================================================================== 3.34 the field of forms; the stamps fade; the pages fly
  const t10 = Sc('Take away') - .3;
  {
    const tN = S('Nobody is'), tG = S('is gone') + .3, f = 900, HZ = 110, r = prng(31), cards = [];
    for (let Z = 1.9; Z < 34; Z += .54) for (let X = -14; X <= 14; X += .78) { if (Math.abs(X) < .3 && Math.abs(Z - 2.44) < .3) continue; cards.push({ X: X + (r() - .5) * .14, Z: Z + (r() - .5) * .12, rot: (r() - .5) * .25, d: Math.hypot(X, Z - 2.44), lift: tG + .35 + r() * .9 + Math.hypot(X, Z - 2.44) * .015, sp: .8 + r() * .6, ph: r() * 7, st: r() }); }
    cards.sort((a, b) => b.Z - a.Z);
    const me = { X: 0, Z: 2.44 }, proj = (X, Z, hc) => [960 + X * f / Z, HZ + hc * f / Z];
    const rc = retiredCanvas(150);
    const zoomAt = (t) => mix(1.25, 1.0, eout(lin(t9, t9 + 3.5, t))) + (t - t9) * -.004;
    const hc = 1.7, [mx, my] = proj(0, 2.44, hc);
    shots.push({
      t: t9, tr: 'out', d: 1.0, x: mx, y: my, depth: PW / (.62 * f / 2.44),
      draw(ctx, t) {
        { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05061a'); g.addColorStop(.12, '#0c0e2c'); g.addColorStop(1, '#1a1c48'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
        const z = zoomAt(t), dx = drift(t, 10, 13), dy = drift(t, 5, 14);
        ctx.save(); ctx.translate(mx + dx, my + dy); ctx.scale(z, z); ctx.translate(-mx, -my);
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 900); glow.addColorStop(0, rgba('#ffcf8a', .22)); glow.addColorStop(1, rgba('#ffcf8a', 0)); ctx.fillStyle = glow; ctx.fillRect(-W, -H, 3 * W, 3 * H);
        const drawCard = (cd, special) => {
          const [x, y] = proj(cd.X, cd.Z, hc), s = f / cd.Z, cw = .62 * s, chh = .44 * s * (hc / cd.Z) * 2.2;
          let lift = special ? 0 : Math.max(0, t - cd.lift), yy = y, rot = cd.rot, flip = 1;
          if (lift > 0) { yy -= lift * lift * 900 * cd.sp; rot += Math.sin(lift * 5 + cd.ph) * .8; flip = Math.cos(lift * 7 + cd.ph); }
          if (yy < -200 || x < -100 || x > W + 100) return;
          const fogA = clamp((cd.Z - 4) / 26), base = mixHex(mixHex('#d8cfb6', '#efe6cf', clamp(1 - Math.abs(cd.X) / 3)), '#232650', Math.min(.95, fogA * 1.05));
          ctx.save(); ctx.translate(x, yy); ctx.rotate(rot); ctx.scale(1, lift > 0 ? Math.max(.15, Math.abs(flip)) * 1.6 : 1);
          ctx.fillStyle = rgba('#05061a', .4 * (1 - fogA)); if (lift <= 0 && cw > 6) ctx.fillRect(-cw / 2 + 3, -chh / 2 + 4, cw, chh);
          ctx.fillStyle = base; ctx.fillRect(-cw / 2, -chh / 2, cw, chh);
          if (cw > 14) { ctx.fillStyle = rgba('#8f8aa8', .5 * (1 - fogA)); for (let k = 0; k < 3; k++) ctx.fillRect(-cw * .4, -chh * .3 + k * chh * .16, cw * (.5 - k * .1), Math.max(1, chh * .03)); }
          if (special) { ctx.scale(1.25, 1.25); ctx.save(); ctx.scale(cw / 900, cw / 900); ctx.drawImage(panelScene(800, 560, true, 1.3), -400, -300, 800, 560); ctx.restore(); drawRetired(ctx, rc, 0, -chh * .1, 1, 1, cw / 1100); }
          else { const sa = 1 - sm(lin(tN + cd.d * .085, tN + cd.d * .085 + .45, t)); if (sa > 0 && cw > 3) { ctx.fillStyle = rgba(RED, .85 * sa * (1 - fogA * .6)); ctx.fillRect(-cw * .3, chh * .05, cw * .6, Math.max(1, chh * .2)); } }
          ctx.restore();
        };
        for (const cd of cards) drawCard(cd, false);
        drawCard(me, true);
        ctx.restore();
      },
    });
  }

  // ===================================================================================== 3.36 the bridge at dawn: the crowd slows and stops
  const t11 = Sc("What's left") - .15, tStop = Sc('reason to run') + .6;
  {
    const P = bridgePlates();
    const dress = [['#3a2e4e', '#1a1428'], ['#5a3448', '#20162a'], ['#2c3a4a', '#141a26'], ['#4a3a3a', '#1e1620']];
    const opt = { lightRel: [900, -200, { col: '#ffc6a0', a: .5 }], rim: '#ffcfae', rimSide: 1, rimW: 1.6, shadeA: .2 };
    const cyc = dress.map((d, i) => walker('br-w' + i, .95, { coat: d[0], pants: d[1], shoes: '#0b0a12', skin: '#c9a08a', hair: '#1a1018' }, opt, 8, { hair: ['short', 'long', 'bun', 'cap'][i], coat: i % 2 ? .7 : 0 }));
    const stand = dress.map((d, i) => sprite('br-s' + i, .95, { lean: 0, head: -.15 + i * .1, sh: [.15, -.1], el: [.3, .25], hip: [.05, -.05], kn: [0, 0], hair: ['short', 'long', 'bun', 'cap'][i], coat: i % 2 ? .7 : 0 }, Object.assign({ dress: { coat: d[0], pants: d[1], shoes: '#0b0a12', skin: '#c9a08a', hair: '#1a1018' } }, opt)));
    const sit = dress.map((d, i) => sprite('br-t' + i, .95, { lean: .05, head: -.2, sh: [.5, .4], el: [.9, .9], hip: [1.45, 1.4], kn: [1.4, 1.5], hair: ['short', 'long', 'bun', 'cap'][i], coat: 0 }, Object.assign({ dress: { coat: d[0], pants: d[1], shoes: '#0b0a12', skin: '#c9a08a', hair: '#1a1018' } }, opt)));
    const amb = walker('br-amber', .98, AMBER, opt, 8, { hood: false, coat: .8 });
    const r = prng(41), ppl = [];
    for (let i = 0; i < 13; i++) ppl.push({ x0: -300 + i * 175 + r() * 70, lane: r() < .5 ? 0 : 1, k: .9 + r() * .2, d: i % 4, sp: .85 + r() * .3, sits: r() < .3, ph: r() });
    const v = (t) => 200 * (1 - sm(lin(tStop - 1.6, tStop, t)));
    const pages = []; { const r2 = prng(43); for (let i = 0; i < 26; i++) pages.push({ x: 200 + r2() * 1500, y: 60 + r2() * 360, ph: r2() * 7, s: .7 + r2() * .7 }); }
    shots.push({
      t: t10, tr: 'up', d: 1.0,
      draw(ctx, t) {
        const cam = { x: drift(t, 10, 15) - (t - t10) * 10, y: drift(t, 5, 16), z: 1.05 + (t - t10) * .01, fx: 960, fy: 640 };
        plate(ctx, P.sky, cam, .4);
        // pages from the field arrive from above and become birds wheeling over the river
        const m = sm(lin(t10 + .1, t10 + 1.3, t));
        inPlate(ctx, cam, .5, (g) => { for (const p of pages) { const fall = 1 - eout(lin(t10 - .6, t10 + 1.2, t)), x = p.x + Math.sin(t * .6 + p.ph) * 120 + (t - t10) * 40, y = p.y - fall * 700 + Math.sin(t * .9 + p.ph) * 30;
          if (m < 1) { g.save(); g.translate(x, y); g.rotate(Math.sin(t * 3 + p.ph)); g.scale(1, Math.cos(t * 4 + p.ph)); g.fillStyle = rgba('#f2e6d0', 1 - m); g.fillRect(-14 * p.s, -10 * p.s, 28 * p.s, 20 * p.s); g.restore(); }
          if (m > 0) { const fl = Math.sin(t * 8 + p.ph) * 6 * p.s; g.strokeStyle = rgba('#3a2a44', m); g.lineWidth = 2.2 * p.s; g.beginPath(); g.moveTo(x - 14 * p.s, y - 2 * p.s - fl); g.quadraticCurveTo(x - 6 * p.s, y - 8 * p.s, x, y); g.quadraticCurveTo(x + 6 * p.s, y - 8 * p.s, x + 14 * p.s, y - 2 * p.s - fl); g.stroke(); } } });
        plate(ctx, P.deck, cam, .85);
        const run = integ(v, t10 - 2, t), list = [];
        inPlate(ctx, cam, .85, (g) => {
          for (const p of ppl) { const x = p.x0 + run * p.sp, k = p.k * (p.lane ? 1 : .9), fy = BR.deck - (p.lane ? 2 : 12), hip = fy - 88 * .95 * k;
            if (x < -100 || x > W + 100) continue;
            const moving = v(t) > 3; if (p.sits && t > tStop + .15) { list.push(p); continue; }
            if (moving) cyc[p.d].draw(g, x, hip, run * p.sp / 145 + p.ph, k); else stand[p.d].draw(g, x, hip + Math.sin(t * 1.8 + p.ph) * .6, k);
          }
          // the one who keeps walking home (amber)
          const ax = 760 + (t - t10) * 150 + ein(lin(tStop - .2, t11 + .4, t)) * 700, ak = 1.04;
          amb.draw(g, ax, BR.deck - 88 * .98 * ak, ax / 150, ak);
        });
        plate(ctx, P.front, cam, .9);
        inPlate(ctx, cam, .9, (g) => { for (const p of list) { const x = p.x0 + run * p.sp, u = eout(lin(tStop + .15, tStop + .7, t)), k = p.k; sit[p.d].draw(g, x + 6, mix(BR.deck - 88 * .95 * k, BR.rail - 4, u), k); } });
      },
    });
  }

  // ===================================================================================== 3.37a the dark kitchen: home, at the window
  const t12 = Sc('Who am I') - .1;
  {
    const P = kitchenPlates(), court = courtyardPlate(), [wx, wy, ww, wh] = KT.win;
    const wk = walker('k-walk', 1.1, AMBER, { lightRel: [-600, -60, { col: '#ffc68a', a: .6 }], rim: '#ffd59a', rimSide: -1, rimW: 2.2 }, 8, { coat: .8 });
    const stnd = sprite('k-stand', 1.1, { lean: 0, head: -.05, sh: [.25, .15], el: [.6, .7], hip: [.03, -.03], kn: [0, 0], coat: .8 }, { dress: AMBER, lightRel: [-600, -60, { col: '#ffc68a', a: .6 }], rim: '#ffd59a', rimSide: -1, rimW: 2.2, shadeA: .25 });
    const focus = [wx + ww * .3, wy + wh * .55];
    const cam = (t) => { const e = ein(lin(t12 - .8, t12 + .3, t)); return { x: drift(t, 10, 17) - (t - t11) * 6 + (W / 2 - focus[0]) * e * .8, y: drift(t, 5, 18) + (H / 2 - focus[1]) * e * .8, z: (1.05 + (t - t11) * .02) * Math.pow(3.8, e), fx: focus[0], fy: focus[1] }; };
    shots.push({
      t: t11, tr: 'left', d: .8,
      draw(ctx, t) {
        const c = cam(t);
        inPlate(ctx, c, .6, (g) => { g.save(); g.beginPath(); g.rect(wx - 10, wy - 10, ww + 20, wh + 20); g.clip(); g.drawImage(court, wx - 300 + drift(t, 8), wy - 160, W * .78, H * .78); g.restore(); });
        plate(ctx, P.room, c, 1);
        inPlate(ctx, c, 1, (g) => {
          const u = eout(lin(t11 - .3, Sc('question') - .1, t)), x = mix(380, 900, u), hip = 980 - 88 * 1.1;
          g.fillStyle = rgba('#000000', .35); g.beginPath(); g.ellipse(x + 40, 982, 120, 14, 0, 0, 7); g.fill();
          if (u < .97) wk.draw(g, x, hip, x / 140, 1); else { g.save(); g.translate(x, 980); g.scale(1, 1 + Math.sin(t * 1.8) * .006); stnd.draw(g, 0, -88 * 1.1); g.restore(); }
        });
        plate(ctx, P.fg, c, 1.2);
      },
    });
  }

  // ===================================================================================== 3.37b the pane, the reflection → CLIP S → the window across the courtyard
  {
    const court = courtyardPlate(), R = reflection(), L = centreWindowLight(), tJob = Sc('not my job') + .4;
    const FR = { x: 310, y: 70, w: 1300, h: 731 };                               // clip frame (16:9), lower 160 px kept free
    const tFrame0 = clip.start - .75, tFrame1 = clip.start - .05, tDrop = tEnd - .45, tDrop1 = tEnd + .1;
    shots.push({
      t: t12, tr: 'match', d: .6,
      draw(ctx, t) {
        // behind the glass: the courtyard, drifting slowly (dimmer while the clip plays)
        const cz = 1.08 + (t - t12) * .008, cx = drift(t, 14, 19), cy = drift(t, 6, 20);
        const dim = mix(1, .45, sm(lin(tFrame0, tFrame1, t))) * mix(1, 1 / .45, sm(lin(tDrop, tDrop1, t)));
        ctx.save(); ctx.translate(W / 2 + cx, H / 2 + cy); ctx.scale(cz, cz); ctx.translate(-W / 2, -H / 2); ctx.drawImage(court, 0, 0);
        // the window across lights amber in the same move as the frame drops out
        const lw = sm(lin(tDrop - .05, tDrop1 - .1, t));
        if (lw > 0) { ctx.globalAlpha = lw; ctx.drawImage(L.pane, CY.win[0] - CY.ww / 2 - 1, CY.win[1] - CY.wh / 2 - 1); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(L.glow, CY.win[0] - 450, CY.win[1] - 450); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
        ctx.restore();
        if (dim < 1) { ctx.fillStyle = rgba('#05061a', 1 - dim); ctx.fillRect(0, 0, W, H); }
        // the glass: faint sheen, the reflection of you (and the lamp), sharpening on "job"
        const push = (t - t12) * .03 + eio(lin(tJob + .2, tFrame1, t)) * .5, rz = 1.0 + push, sharp = sm(lin(tJob - .35, tJob + .15, t));
        const ra = (.55 + .2 * sharp) * (1 - sm(lin(tFrame0 + .2, tFrame1, t)));
        if (ra > 0) {
          ctx.save(); ctx.translate(980, 600); ctx.scale(rz, rz);
          ctx.globalAlpha = ra * (1 - sharp); ctx.drawImage(R.soft, -450, -420); ctx.globalAlpha = ra * sharp; ctx.drawImage(R.sharp, -450, -420); ctx.globalAlpha = 1;
          ctx.restore();
          addGlow(ctx, 980 - 520 * rz, 560, 160 * rz, .35 * ra, C.amber, '#ffe3b0');     // the lamp, reflected
          // mullions of the kitchen window (they slide out of frame as the camera pushes)
          ctx.fillStyle = rgba('#14122a', .95); const mx = 980 + (180 - 980) * rz * 1.2, mx2 = 980 + (1760 - 980) * rz * 1.2, my = 600 + (40 - 600) * rz * 1.2;
          ctx.fillRect(mx - 30, 0, 40, H); ctx.fillRect(mx2 - 10, 0, 40, H); ctx.fillRect(0, my - 30, W, 34);
        }
        // the clip frame grows out of the pane edges; footage fades up inside
        const fu = eio(lin(tFrame0, tFrame1, t)), drop = ein(lin(tDrop, tDrop1, t));
        if (fu > 0 && drop < 1) {
          const rz2 = 1 + (1 - fu) * .35, x = mix(FR.x - 160, FR.x, fu) , y = mix(FR.y - 60, FR.y, fu) + drop * 1150, w = mix(FR.w + 320, FR.w, fu), h = mix(FR.h + 120, FR.h, fu);
          ctx.save(); ctx.globalAlpha = .5 * fu; ctx.fillStyle = '#02030c'; ctx.filter = 'blur(22px)'; ctx.fillRect(x + 10, y + 24, w, h); ctx.restore();
          clipScreen(ctx, t, T, 'S', x, y, w, h, { bezel: false, glow: false, radius: 12 });
          ctx.strokeStyle = rgba('#f3efe2', .35 * fu); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.stroke();
          // name label, beside the frame (lower left, above the subtitle zone)
          const la = eout(lin(clip.start + .2, clip.start + .9, t)) * (1 - drop);
          if (la > 0) { const ly = y + h + 52 + (1 - la) * 12; ctx.fillStyle = rgba(C.amber, la); ctx.fillRect(x, ly - 34, 4, 66);
            text(ctx, clipInfo('S').name, x + 22, ly, { size: 40, font: 'Instrument Serif', alpha: la }); text(ctx, ROLE, x + 22, ly + 28, { size: 16, weight: 600, color: C.muted, alpha: la, spacing: 4 }); }
        }
      },
    });
  }
  return shots;
}
