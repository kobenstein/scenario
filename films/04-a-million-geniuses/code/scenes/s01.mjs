// 01 · Hook (0:00–0:35): copy the smartest people who ever lived.
// Carrier chain: photo → copies → mosaic → light field → one light → pill → bulb → light cone → hall → town → road → narrow door.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, canvas, addGlow, glow, text, drift } from '../engine.mjs';
import { P, skyGrad, cityLayer, houseRow, fogBand, cone, lampPost, hill, grass, person, finish, shade, mixHex } from '../lib/world.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

// ---------- the group photo (nameless, three rows, sepia) ----------
export const PHOTO_W = 1240, PHOTO_H = 760;
export function groupPhoto() {
  return once('photo', () => {
    const [c, x] = canvas(PHOTO_W, PHOTO_H), r = prng(1927);
    // paper + sepia print with soft vignette
    x.fillStyle = '#efe4c8'; x.fillRect(0, 0, PHOTO_W, PHOTO_H);
    const m = 34, iw = PHOTO_W - 2 * m, ih = PHOTO_H - 2 * m - 30;
    const g = x.createLinearGradient(0, m, 0, m + ih); g.addColorStop(0, '#a88f6c'); g.addColorStop(.55, '#8a6f50'); g.addColorStop(1, '#5d4632');
    x.fillStyle = g; x.fillRect(m, m, iw, ih);
    // building facade behind (columns, windows)
    x.fillStyle = 'rgba(70,52,36,.35)'; for (let i = 0; i < 9; i++) x.fillRect(m + 40 + i * 132, m + 10, 46, ih * .55);
    x.fillStyle = 'rgba(240,225,190,.10)'; for (let i = 0; i < 8; i++) x.fillRect(m + 100 + i * 132, m + 40, 52, 120);
    // three rows: back standing, middle standing, front seated
    const rows = [{ n: 9, y: m + ih * .47, s: .82, dx: 0 }, { n: 10, y: m + ih * .64, s: .9, dx: 60 }, { n: 9, y: m + ih * .86, s: 1, dx: 0 }];
    rows.forEach((row, ri) => {
      const span = iw - 120, x0 = m + 60 + (iw - 120 - span) / 2;
      for (let i = 0; i < row.n; i++) {
        const cx = x0 + (i + .5) * span / row.n + (r() - .5) * 18 + (ri === 1 ? (i % 2 ? 10 : -10) : 0), s = row.s * (.94 + r() * .1), cy = row.y;
        const suit = mixHex('#2c2219', '#4a3a2b', r()), skin = mixHex('#c9ab86', '#e2c9a4', r());
        // shoulders + suit
        x.fillStyle = suit; x.beginPath(); x.moveTo(cx - 52 * s, cy + 120 * s); x.bezierCurveTo(cx - 50 * s, cy + 10 * s, cx - 34 * s, cy - 8 * s, cx, cy - 8 * s); x.bezierCurveTo(cx + 34 * s, cy - 8 * s, cx + 50 * s, cy + 10 * s, cx + 52 * s, cy + 120 * s); x.fill();
        // shirt v + tie
        x.fillStyle = '#e9dcc0'; x.beginPath(); x.moveTo(cx - 12 * s, cy - 6 * s); x.lineTo(cx, cy + 34 * s); x.lineTo(cx + 12 * s, cy - 6 * s); x.fill();
        x.fillStyle = '#1d1610'; x.fillRect(cx - 3 * s, cy + 2 * s, 6 * s, 26 * s);
        // head: soft ellipse, hair cap, a hint of shadow side (no features)
        x.fillStyle = skin; x.beginPath(); x.ellipse(cx, cy - 34 * s, 19 * s, 24 * s, 0, 0, 7); x.fill();
        x.fillStyle = 'rgba(60,40,25,.28)'; x.beginPath(); x.ellipse(cx + 7 * s, cy - 32 * s, 11 * s, 22 * s, 0, 0, 7); x.fill();
        const bald = r() < .25, hair = mixHex('#1c140e', '#8a7a68', r() < .3 ? .9 : r() * .4);
        x.fillStyle = hair; x.beginPath(); x.ellipse(cx - 1 * s, cy - 48 * s, 19 * s, bald ? 6 * s : 12 * s, 0, Math.PI, 0); x.fill();
        if (r() < .3) { x.fillStyle = hair; x.beginPath(); x.ellipse(cx, cy - 22 * s, 11 * s, 7 * s, 0, 0, Math.PI); x.fill(); } // beard
        if (ri === 2) { x.fillStyle = suit; x.fillRect(cx - 40 * s, cy + 90 * s, 80 * s, 40 * s); } // seated knees
      }
    });
    // print grain, scratches, faded corners
    const d = x.getImageData(m, m, iw, ih);
    for (let i = 0; i < d.data.length; i += 4) { const n = (r() - .5) * 26; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n * .8; }
    x.putImageData(d, m, m);
    x.strokeStyle = 'rgba(245,235,210,.25)'; x.lineWidth = 1; for (let i = 0; i < 12; i++) { const sx = m + r() * iw, sy = m + r() * ih; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + (r() - .5) * 60, sy + r() * 160); x.stroke(); }
    const vg = x.createRadialGradient(PHOTO_W / 2, m + ih / 2, ih * .3, PHOTO_W / 2, m + ih / 2, iw * .7); vg.addColorStop(0, 'rgba(40,25,15,0)'); vg.addColorStop(1, 'rgba(40,25,15,.45)'); x.fillStyle = vg; x.fillRect(m, m, iw, ih);
    x.fillStyle = 'rgba(90,70,50,.55)'; x.font = '22px "Instrument Serif Italic"'; x.textAlign = 'center'; x.fillText('', PHOTO_W / 2, PHOTO_H - 22);
    return c;
  });
}
// heads only (for the light cone), transparent background
function headsOnly() {
  return once('heads', () => {
    const [c, x] = canvas(900, 300), r = prng(77);
    for (let i = 0; i < 9; i++) {
      const cx = 60 + i * 98 + (r() - .5) * 20, cy = 150 + (i % 2) * 40, s = .95 + r() * .2;
      x.fillStyle = '#e6cfa8'; x.beginPath(); x.ellipse(cx, cy - 34 * s, 19 * s, 24 * s, 0, 0, 7); x.fill();
      x.fillStyle = 'rgba(120,80,40,.35)'; x.beginPath(); x.ellipse(cx + 7 * s, cy - 32 * s, 11 * s, 22 * s, 0, 0, 7); x.fill();
      x.fillStyle = '#3b2a1c'; x.beginPath(); x.ellipse(cx - 1 * s, cy - 48 * s, 19 * s, 11 * s, 0, Math.PI, 0); x.fill();
      x.fillStyle = '#4a3a2b'; x.beginPath(); x.moveTo(cx - 48 * s, cy + 70 * s); x.bezierCurveTo(cx - 46 * s, cy + 6 * s, cx - 30 * s, cy - 8 * s, cx, cy - 8 * s); x.bezierCurveTo(cx + 30 * s, cy - 8 * s, cx + 46 * s, cy + 6 * s, cx + 48 * s, cy + 70 * s); x.fill();
    }
    return c;
  });
}

// ---------- shot A: one photo → copies → mosaic → field of lights → sky turns day/night ----------
const multiply = (T) => {
  const tNot = T.S('01a', 'Not once'), tThou = T.S('01a', 'A thousand'), tMil = T.S('01a', 'A million'), tSlept = T.S('01a', 'And they never'), tEvery = T.S('01a', 'Every medicine');
  const LP = (() => { const r = prng(9), pts = []; for (let i = 0; i < 2600; i++) pts.push({ x: r(), y: r(), m: r(), p: r() * 7 }); return pts; })();
  return (ctx, t, s) => {
    const photo = groupPhoto();
    // phase weights
    const uFlip = eio(lin(tNot - .05, tNot + .75, t));        // card flips, copy lands beside it
    const uTile = eio(lin(tThou - .1, tThou + 1.1, t));       // tiles explode outward, camera pulls back
    const uDot = eio(lin(tMil - .15, tMil + .9, t));          // photos shrink to points of light
    const uTilt = eio(lin(tSlept - .2, tSlept + 1.6, t));     // camera tilts up into the sky
    const uFly = ein(lin(tEvery - 1.0, tEvery + .15, t));     // one light flies at the camera
    // background: dark studio → night sky
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, mixHex('#0b0d24', '#0a0c26', uDot)); bg.addColorStop(1, mixHex('#17142c', '#16194a', uDot));
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // sky time-lapse once tilted up: indigo → amber dawn → indigo
    if (uTilt > 0) {
      const day = Math.sin(clamp((t - tSlept) / 2.4) * Math.PI);
      const g = ctx.createLinearGradient(0, 0, 0, H * .6); g.addColorStop(0, rgba(mixHex('#0a0c26', '#3a2d66', day), uTilt)); g.addColorStop(1, rgba(mixHex('#1b1f55', '#f0a77f', day), uTilt));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * .62);
      // sun/moon arc
      const a = clamp((t - tSlept) / 2.4) * Math.PI, sx = W / 2 - Math.cos(a) * 700, sy = H * .55 - Math.sin(a) * 380;
      addGlow(ctx, sx, sy, 160, .7 * uTilt * day, P.amber, '#fff3dd');
      // a clock face drawn faintly in the sky, hands spinning (time passes, the lights never go out)
      const cx = W / 2, cy = 250, R = 170, sp = (t - tSlept) * 9;
      ctx.save(); ctx.globalAlpha = .55 * uTilt * (1 - uFly); ctx.strokeStyle = C.cream; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      for (let i = 0; i < 12; i++) { const q = i / 12 * 6.283; ctx.beginPath(); ctx.moveTo(cx + Math.cos(q) * R * .88, cy + Math.sin(q) * R * .88); ctx.lineTo(cx + Math.cos(q) * R * .97, cy + Math.sin(q) * R * .97); ctx.stroke(); }
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sp / 12 - 1.57) * R * .5, cy + Math.sin(sp / 12 - 1.57) * R * .5); ctx.stroke();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sp - 1.57) * R * .8, cy + Math.sin(sp - 1.57) * R * .8); ctx.stroke(); ctx.restore();
    }
    // ----- photo layout -----
    // camera zoom: 1 photo fills ~65% of width; after tiling we see a grid of ~40 x 40
    const push = 1 + .06 * lin(0, tNot, t);
    const zoom = push * Math.pow(1 / 38, uTile * .9 + uDot * .1);
    const cellW = PHOTO_W * 1.06, cellH = PHOTO_H * 1.08, base = .62;
    const camY = mix(0, H * .30, uTilt);   // field slides down as the camera tilts up
    ctx.save();
    ctx.translate(W / 2, H / 2 + camY);
    // perspective squash once it becomes a field seen from above at an angle
    ctx.scale(1, mix(1, .42, uTilt));
    ctx.scale(zoom * base, zoom * base);
    // flash at the first word, a second softer one on "copy"
    const N = uTile > 0 ? 22 : 1;
    const r = prng(5);
    for (let gy = -N; gy <= N; gy++) for (let gx = -N; gx <= N; gx++) {
      const isOrig = gx === 0 && gy === 0, isCopy = gx === 1 && gy === 0;
      let ox = gx * cellW, oy = gy * cellH, a = 1;
      if (!isOrig && !isCopy) { const dd = Math.hypot(gx, gy), arrive = clamp(uTile * 26 - dd * 1.0); if (arrive <= 0) continue; a = arrive; ox *= mix(1.6, 1, eout(arrive)); oy *= mix(1.6, 1, eout(arrive)); }
      if (isCopy) { if (uFlip <= 0) continue; ox = mix(0, cellW, eout(uFlip)); }
      if (isOrig) ox = mix(0, 0, uFlip);
      const centerShift = mix(0, -cellW / 2, uFlip) * (1 - uTile);
      ctx.save(); ctx.translate(ox + centerShift, oy);
      // flip like a playing card: the copy turns over as it lands
      const flip = isCopy ? Math.abs(Math.cos((1 - uFlip) * Math.PI / 2 + Math.PI / 2 * 0)) : 1;
      ctx.scale(isCopy ? Math.max(.02, Math.sin(uFlip * Math.PI / 2)) : 1, 1);
      const rot = isOrig ? -.012 : (r() - .5) * .03;
      ctx.rotate(rot * (1 - uDot));
      if (uDot < 1) {
        ctx.globalAlpha = a * (1 - uDot);
        ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-PHOTO_W / 2 + 14, -PHOTO_H / 2 + 18, PHOTO_W, PHOTO_H);
        ctx.drawImage(photo, -PHOTO_W / 2, -PHOTO_H / 2);
      }
      ctx.restore();
    }
    ctx.restore();
    // points of light: each photo becomes one light (drawn in screen space for crisp dots)
    if (uDot > 0) {
      const cell = cellW * zoom * base, cellY = cellH * zoom * base * mix(1, .42, uTilt);
      for (let gy = -N; gy <= N; gy++) for (let gx = -N; gx <= N; gx++) {
        const k = (gy + N) * (2 * N + 1) + gx + N, L = LP[k % LP.length];
        const x = W / 2 + gx * cell + (L.x - .5) * cell * .3, y = H / 2 + camY + gy * cellY + (L.y - .5) * cellY * .3;
        if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
        const tw = .75 + .25 * Math.sin(t * (1.5 + L.m * 2) + L.p), warm = L.m > .82;
        const rr = (1.6 + L.m * 2.2) * mix(1, .8, uTilt), al = uDot * tw;
        ctx.fillStyle = rgba(warm ? '#ffd29a' : C.cyanWhite, al); ctx.fillRect(x - rr / 2, y - rr / 2, rr, rr);
        if (L.m > .9) addGlow(ctx, x, y, 14, .5 * al, warm ? P.amber : C.cyan, '#ffffff');
      }
      // denser fine points in between ("a million")
      const fine = uDot * (1 - uFly * .5);
      for (let i = 0; i < 1800; i++) { const L = LP[i]; const x = L.x * W, y = H / 2 + camY + (L.y - .5) * H * 1.6 * mix(1, .42, uTilt); if (y < H * .5 * uTilt + (1 - uTilt) * -10) continue; ctx.fillStyle = rgba(C.cyanWhite, fine * (.25 + .4 * L.m) * (.7 + .3 * Math.sin(t * 2 + L.p))); ctx.fillRect(x, y, 1.4, 1.4); }
      // horizon haze once tilted
      if (uTilt > 0) { const hz = ctx.createLinearGradient(0, H * .5, 0, H * .66); hz.addColorStop(0, rgba('#5f8fc4', 0)); hz.addColorStop(.5, rgba('#5f8fc4', .22 * uTilt)); hz.addColorStop(1, rgba('#5f8fc4', 0)); ctx.fillStyle = hz; ctx.fillRect(0, H * .48, W, H * .2); }
    }
    // flash pulses
    const fl = Math.max(0, 1 - Math.abs(t - .35) * 3.2) * .55 + Math.max(0, 1 - Math.abs(t - T.S('01a', 'copy')) * 4) * .25;
    if (fl > 0) { ctx.fillStyle = `rgba(255,248,230,${fl})`; ctx.fillRect(0, 0, W, H); }
    // dust in the beam of the old studio light
    if (uTile < 1) { const rd = prng(4); for (let i = 0; i < 90; i++) { const x = (rd() * W + t * 12 * (rd() - .3)) % W, y = (rd() * H + t * 6 * rd()) % H; ctx.fillStyle = rgba('#fff3dd', (.15 + .25 * rd()) * (1 - uTile)); ctx.fillRect(x, y, 2, 2); } }
    // one light lifts off and rushes at the camera, ending as a bright point in the centre (carrier → pill)
    if (uFly > 0) {
      const x0 = W * .56, y0 = H * .78, x = mix(x0, W / 2, eio(uFly)), y = mix(y0, H / 2, eio(uFly)), rr = mix(4, 70, uFly * uFly);
      addGlow(ctx, x, y, rr * 4, .9, '#ffd29a', '#ffffff'); ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.arc(x, y, rr * .5, 0, 7); ctx.fill();
    }
  };
};

// ---------- shot B: a pill turning in an open hand ----------
function hand(ctx, x, y, s, t, { skin = '#c98f6a', open = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.08 + Math.sin(t * .9) * .015);
  // sleeve
  ctx.fillStyle = '#2a2f6e'; ctx.beginPath(); ctx.moveTo(-420, 420); ctx.lineTo(-170, 120); ctx.lineTo(-60, 210); ctx.lineTo(-250, 520); ctx.fill();
  ctx.fillStyle = P.amberDeep; ctx.fillRect(-235, 140, 30, 30);
  // palm
  const g = ctx.createLinearGradient(-200, 0, 220, 60); g.addColorStop(0, shade(skin, -.12)); g.addColorStop(1, shade(skin, .06));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-170, 130); ctx.bezierCurveTo(-180, 40, -110, -20, 0, -10); ctx.bezierCurveTo(120, 0, 200, 30, 210, 80); ctx.bezierCurveTo(200, 150, 120, 200, 0, 205); ctx.bezierCurveTo(-90, 210, -150, 190, -170, 130); ctx.fill();
  // fingers, slightly cupped
  const fing = [[-90, -15, -.25, 120], [-20, -22, -.08, 135], [50, -15, .08, 128], [115, 5, .25, 105]];
  for (const [fx, fy, a, l] of fing) { ctx.save(); ctx.translate(fx, fy); ctx.rotate(a); ctx.fillStyle = shade(skin, -.02); ctx.beginPath(); ctx.roundRect(-20, -l * open, 40, l * open + 20, 20); ctx.fill(); ctx.fillStyle = 'rgba(90,40,20,.12)'; ctx.fillRect(-20, -l * open * .45, 40, 3); ctx.restore(); }
  // thumb
  ctx.save(); ctx.translate(-150, 120); ctx.rotate(-1.05); ctx.fillStyle = shade(skin, -.06); ctx.beginPath(); ctx.roundRect(-22, -110, 44, 130, 22); ctx.fill(); ctx.restore();
  // halftone shade on the palm
  ctx.globalAlpha = .12; ctx.fillStyle = '#4a2410'; ctx.beginPath(); ctx.ellipse(10, 120, 150, 60, 0, 0, 7); ctx.fill();
  ctx.restore();
}
function pill(ctx, x, y, len, w, ang, round = 0) {
  // round: 0 = capsule, 1 = sphere (the pill becomes the bulb)
  const L = mix(len, w, round);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.roundRect(-L / 2, -w / 2, L, w, w / 2); ctx.save(); ctx.clip();
  ctx.fillStyle = mixHex('#f3efe2', '#fff3dd', round); ctx.fillRect(-L / 2, -w / 2, L, w);
  ctx.fillStyle = rgba(P.amber, 1 - round); ctx.fillRect(0, -w / 2, L / 2, w);
  const hl = ctx.createLinearGradient(0, -w / 2, 0, w / 2); hl.addColorStop(0, 'rgba(255,255,255,.55)'); hl.addColorStop(.35, 'rgba(255,255,255,0)'); hl.addColorStop(1, 'rgba(60,30,10,.35)'); ctx.fillStyle = hl; ctx.fillRect(-L / 2, -w / 2, L, w);
  ctx.restore(); ctx.restore();
}
const pillInHand = (T) => {
  const t0 = T.S('01a', 'Every medicine'), tLight = T.S('01a', 'every light') - .1;
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .7); bg.addColorStop(0, '#1d1f55'); bg.addColorStop(1, '#090b22'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // soft bokeh of the light field behind
    const r = prng(31); for (let i = 0; i < 40; i++) addGlow(ctx, r() * W, r() * H, 20 + r() * 50, .12, r() < .3 ? P.amber : C.cyan, '#ffffff');
    const uIn = eout(lin(t0 - .5, t0 + .8, t)), uUp = eio(lin(tLight - .9, tLight + .1, t));
    // hand rises into frame and stays, pill lands on the palm and turns
    hand(ctx, W / 2 + 60, mix(H + 300, H * .62, uIn) + uUp * 160, 1.05, t, { open: 1 });
    const px = W / 2, py = mix(H / 2, H * .52, uIn) - uUp * (H * .52 - 300), ang = (t - t0) * .9;
    const round = uUp;
    addGlow(ctx, px, py, 120 + 200 * round, .5 + .4 * round, '#ffd29a', '#ffffff');
    pill(ctx, px, py, 150, 64, ang * (1 - round), round);
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot C: the bulb over a kitchen table; the chain is pulled, light floods; heads appear in the cone ----------
const kitchen = (T) => {
  const tPull = T.S('01a', 'switched') - .15, tMinds = T.S('01a', 'began in minds');
  return (ctx, t, s) => {
    const on = sm(lin(tPull, tPull + .35, t)), flick = on > 0 && on < 1 ? (Math.sin(t * 90) > 0 ? 1 : .6) : 1;
    const bx = W / 2, by = 300;
    ctx.save();
    // slow push into the cone after the light is on
    const z = 1 + .05 * lin(s.a, s.b, t) + .1 * eio(lin(tMinds, tMinds + 2, t));
    ctx.translate(W / 2, H * .45); ctx.scale(z, z); ctx.translate(-W / 2, -H * .45);
    // room: back wall, window with night town, table, two chairs
    ctx.fillStyle = mixHex('#0d0f2b', '#3a2c3c', on * .6); ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.fillStyle = mixHex('#101336', '#2a2140', on * .5); ctx.fillRect(1250, 170, 380, 300);
    ctx.fillStyle = mixHex('#1b2a66', '#3c3b70', on * .4); ctx.fillRect(1266, 186, 348, 268);
    const rr = prng(3); for (let i = 0; i < 14; i++) { ctx.fillStyle = rgba(rr() < .5 ? P.amber : C.cyan, .7); ctx.fillRect(1280 + rr() * 320, 330 + rr() * 110, 5, 7); }
    ctx.fillStyle = mixHex('#0b0d26', '#241a26', on * .5); ctx.fillRect(1440, 186, 8, 268); ctx.fillRect(1266, 316, 348, 8);
    // floor
    ctx.fillStyle = mixHex('#090a20', '#2a1f28', on * .5); ctx.fillRect(-100, 820, W + 200, 400);
    // table
    ctx.fillStyle = mixHex('#0c0d27', '#5a3a26', on * .8); ctx.beginPath(); ctx.ellipse(W / 2, 760, 420, 70, 0, 0, 7); ctx.fill();
    ctx.fillStyle = mixHex('#08091e', '#3a2618', on * .8); ctx.fillRect(W / 2 - 14, 790, 28, 260); ctx.fillRect(W / 2 - 120, 1040, 240, 14);
    // chairs
    for (const sx of [-1, 1]) { const cx = W / 2 + sx * 520; ctx.fillStyle = mixHex('#0a0b22', '#3a2618', on * .6); ctx.fillRect(cx - 70, 690, 140, 16); ctx.fillRect(cx + sx * 58 - 8, 520, 16, 186); ctx.fillRect(cx - 62, 704, 12, 300); ctx.fillRect(cx + 50, 704, 12, 300); }
    // a cup and an open notebook on the table
    ctx.fillStyle = mixHex('#14163a', '#e8d9b8', on * .9); ctx.beginPath(); ctx.moveTo(W / 2 - 160, 740); ctx.lineTo(W / 2 - 40, 730); ctx.lineTo(W / 2 - 30, 760); ctx.lineTo(W / 2 - 170, 770); ctx.fill();
    ctx.fillStyle = mixHex('#14163a', '#c9a77a', on * .9); ctx.fillRect(W / 2 + 120, 712, 46, 40);
    // cord + chain
    ctx.strokeStyle = '#05060f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, -100); ctx.lineTo(bx, by - 40); ctx.stroke();
    const pullY = 90 * Math.max(0, Math.sin(clamp((t - tPull + .35) / .7) * Math.PI));
    ctx.strokeStyle = mixHex('#2a2d55', '#c9a77a', on); ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(bx + 30, by - 10); ctx.lineTo(bx + 34, by + 170 + pullY); ctx.stroke(); ctx.setLineDash([]);
    // a hand reaches in from the right and pulls the chain
    const hv = sm(lin(tPull - 1, tPull - .3, t)) * (1 - sm(lin(tPull + .7, tPull + 1.4, t)));
    if (hv > 0) { const hx = mix(W + 200, bx + 60, hv), hy = by + 190 + pullY; ctx.fillStyle = mixHex('#2a2f6e', '#3a3070', on); ctx.beginPath(); ctx.moveTo(W + 300, hy + 40); ctx.lineTo(hx + 40, hy + 10); ctx.lineTo(hx + 40, hy + 60); ctx.lineTo(W + 300, hy + 110); ctx.fill(); ctx.fillStyle = '#c98f6a'; ctx.beginPath(); ctx.ellipse(hx + 10, hy + 30, 42, 30, -.3, 0, 7); ctx.fill(); }
    // light cone + bulb
    if (on > 0) { cone(ctx, bx, by + 30, 900, 0, .62, '#ffd29a', .38 * on * flick); const pool = ctx.createRadialGradient(W / 2, 760, 0, W / 2, 760, 700); pool.addColorStop(0, rgba('#ffd29a', .28 * on)); pool.addColorStop(1, rgba('#ffd29a', 0)); ctx.fillStyle = pool; ctx.fillRect(0, 400, W, 700); }
    ctx.fillStyle = '#0a0b20'; ctx.fillRect(bx - 16, by - 50, 32, 24);
    glow(ctx, bx, by, 32, 1, '#ffd29a', '#ffffff'); addGlow(ctx, bx, by, 260 * (.4 + .6 * on), (.5 + .5 * on) * flick, '#ffb35c', '#fff6e6');
    ctx.fillStyle = mixHex('#f3efe2', '#ffffff', on); ctx.beginPath(); ctx.arc(bx, by, 32, 0, 7); ctx.fill();
    // heads of the photo appear in the cone, thin gold thought lines from the bulb to each head
    const uM = eout(lin(tMinds - .2, tMinds + 1.2, t));
    if (uM > 0) {
      const hd = headsOnly();
      ctx.save(); ctx.globalAlpha = uM * .9; ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(hd, W / 2 - 450, 420 + (1 - uM) * 30, 900, 300); ctx.restore();
      ctx.strokeStyle = rgba(P.amber, .5 * uM); ctx.lineWidth = 1.5;
      for (let i = 0; i < 9; i++) { const hx = W / 2 - 450 + 60 + i * 98, hy = 420 + 150 + (i % 2) * 40 - 60, u2 = clamp(uM * 1.4 - i * .05); ctx.beginPath(); ctx.moveTo(bx, by + 30); ctx.quadraticCurveTo(mix(bx, hx, .5), by + 160, mix(bx, hx, u2), mix(by + 30, hy, u2)); ctx.stroke(); }
    }
    ctx.restore();
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- shot D: the great dark hall of empty chairs; then they fill, a wave of light ----------
const hall = (T) => {
  const tChange = T.S('01a', "That's about"), tOut = T.S('01a', 'Somewhere');
  const rows = 14, cols = 26;
  const seats = (() => { const r = prng(21), s = []; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) s.push({ i, j, early: r() < .035, ph: r() * 6, d: Math.hypot(i - cols / 2, j) }); return s; })();
  return (ctx, t, s) => {
    const fillU = (d) => sm(lin(tChange + d * .08, tChange + d * .08 + .6, t));
    ctx.fillStyle = '#07081a'; ctx.fillRect(0, 0, W, H);
    // camera drifts over the emptiness then rises a little as the hall fills
    const u = sine(lin(s.a, s.b, t)), camX = mix(-80, 60, u), camY = mix(0, -40, u);
    const vy = 330 + camY, vx = W / 2 + camX;
    // floor plane glow toward the far stage
    const fl = ctx.createLinearGradient(0, vy, 0, H); fl.addColorStop(0, '#141a44'); fl.addColorStop(1, '#090a20'); ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(vx - 2000, H); ctx.lineTo(vx - 260, vy); ctx.lineTo(vx + 260, vy); ctx.lineTo(vx + 2000, H); ctx.fill();
    addGlow(ctx, vx, vy - 40, 420, .35, '#5f8fc4', '#d8f7ff');
    // pillars
    for (let k = -3; k <= 3; k++) { if (!k) continue; const f = (d) => 1 / (1 + d * 1.6); for (let d = 0; d < 5; d++) { const x = vx + k * 520 * f(d), w = 60 * f(d), top = vy - 900 * f(d), bot = vy + 800 * f(d); ctx.fillStyle = shade('#0c0e2a', d * .02); ctx.fillRect(x - w / 2, top, w, bot - top); } }
    // seats from back to front
    const filled = [];
    for (let j = rows - 1; j >= 0; j--) {
      const dd = j / rows, f = 1 / (1 + dd * 3.2), y = vy + 640 * f + 40, sw = 64 * f;
      for (let i = 0; i < cols; i++) {
        const S = seats[j * cols + i], x = vx + (i - cols / 2 + .5) * 140 * f;
        if (x < -80 || x > W + 80) continue;
        // chair: back + seat, flat
        ctx.fillStyle = shade('#151a46', -dd * .06); ctx.fillRect(x - sw / 2, y - sw * 1.1, sw, sw * .9); ctx.fillRect(x - sw * .55, y - sw * .25, sw * 1.1, sw * .22);
        const fu = S.early ? 1 : fillU(S.d);
        if (fu > 0) filled.push([x, y, sw, fu, S.early, S.ph]);
      }
    }
    // occupants: early few = warm small lamps (the rare geniuses), the wave = cyan silhouettes
    for (const [x, y, sw, fu, early, ph] of filled) {
      const hgt = sw * 1.6, col = early ? P.amber : C.cyan;
      ctx.globalAlpha = fu; ctx.fillStyle = early ? '#2b2236' : '#16305a';
      ctx.beginPath(); ctx.ellipse(x, y - hgt * .95, sw * .22, sw * .26, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - sw * .42, y - sw * .2); ctx.quadraticCurveTo(x - sw * .4, y - hgt * .72, x, y - hgt * .72); ctx.quadraticCurveTo(x + sw * .4, y - hgt * .72, x + sw * .42, y - sw * .2); ctx.fill();
      ctx.globalAlpha = 1; addGlow(ctx, x, y - hgt * .8, sw * (early ? 1.4 : 1.1), (early ? .55 : .4) * fu * (.85 + .15 * Math.sin(t * 2 + ph)), col, early ? '#fff3dd' : C.cyanWhite);
    }
    // at the end all light streams to the back door (carrier into the town)
    const uEnd = eio(lin(tOut - 1.2, tOut + .2, t));
    if (uEnd > 0) addGlow(ctx, vx, vy - 20, 200 + 500 * uEnd, .6 * uEnd, P.amber, '#fff3dd');
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- shot E: a quiet town in fog; at its edge a long low building breathes warm light ----------
const town = (T) => {
  const far = () => once('town_far', () => cityLayer({ seed: 301, z: 6, base: H * .63, hMin: 40, hMax: 120, wMin: 60, wMax: 140, col: '#2a3780', fogTo: '#5b7ec4', fogAmt: .85, lit: .03, span: 2600 }));
  const houses = () => once('town_houses', () => houseRow({ seed: 302, base: H * .7, z: 3, col: '#1a1f55', span: 2800, hMin: 110, hMax: 170, lit: .3 }));
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), cx = mix(-60, 80, u), zoom = mix(1.0, 1.08, u);
    skyGrad(ctx, { t, stars: .55, bottom: '#41579e' });
    addGlow(ctx, 1500 - cx * .2, 170, 90, .5, '#d8f7ff', '#ffffff'); // moon
    far().draw(ctx, t, cx * 2, 0, zoom);
    // church spire
    ctx.save(); ctx.translate(-cx * .5, 0); ctx.fillStyle = '#1e2662'; ctx.fillRect(560, 440, 70, 260); ctx.beginPath(); ctx.moveTo(552, 442); ctx.lineTo(595, 300); ctx.lineTo(638, 442); ctx.fill(); addGlow(ctx, 595, 500, 14, .6, P.amber, '#fff3dd'); ctx.restore();
    fogBand(ctx, t, H * .62, 220, { a: .35, hex: '#8ab8e8' });
    houses().draw(ctx, t, cx * 1.2, 0, zoom);
    // fields
    hill(ctx, [[-10, 760], [400, 740], [900, 752], [1400, 735], [1930, 748]], { col: '#151a4a' });
    ctx.strokeStyle = 'rgba(95,143,196,.12)'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-10, 780 + i * 34); ctx.quadraticCurveTo(W / 2, 770 + i * 30, W + 10, 784 + i * 36); ctx.stroke(); }
    // the building at the edge of town: long and low, vents breathing light, cranes, cable drums
    ctx.save(); ctx.translate(-cx * .9, 0);
    const bx0 = 1080, bx1 = 1900, by0 = 640, by1 = 740;
    ctx.fillStyle = '#0f1440'; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0); ctx.fillStyle = '#0b0f33'; ctx.fillRect(bx0, by0, bx1 - bx0, 10);
    const breathe = .55 + .45 * Math.sin(t * 1.4);
    for (let i = 0; i < 12; i++) { const vx = bx0 + 40 + i * 66; ctx.fillStyle = rgba(P.amber, .55 + .4 * breathe); ctx.fillRect(vx, by0 + 30, 40, 14); addGlow(ctx, vx + 20, by0 + 37, 40, .35 * breathe, P.amber, '#fff3dd');
      // warm vapour rising from the vents
      for (let k = 0; k < 2; k++) { const q = ((t * .25 + i * .13 + k * .5) % 1), yy = by0 - q * 120, a = (1 - q) * .12; ctx.fillStyle = rgba('#ffd2a0', a); ctx.beginPath(); ctx.arc(vx + 20 + Math.sin(q * 6 + i) * 10, yy, 14 + q * 30, 0, 7); ctx.fill(); } }
    // cranes
    for (const [x, h, a] of [[1240, 330, .2], [1620, 380, -.15]]) { ctx.strokeStyle = '#141a4c'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, by0); ctx.lineTo(x, by0 - h); ctx.stroke(); ctx.save(); ctx.translate(x, by0 - h); ctx.rotate(a + Math.sin(t * .2) * .03); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(260, 0); ctx.stroke(); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(200, 0); ctx.lineTo(200, 120 + Math.sin(t * .7) * 10); ctx.stroke(); ctx.restore(); addGlow(ctx, x, by0 - h - 6, 12, .9 * (Math.sin(t * 3) > 0 ? 1 : .2), '#ff5a4a', '#ffd0c8'); }
    // cable drums
    for (const x of [1120, 1180, 1850]) { ctx.fillStyle = '#121845'; ctx.beginPath(); ctx.arc(x, 742, 26, 0, 7); ctx.fill(); ctx.fillStyle = '#0b0f33'; ctx.beginPath(); ctx.arc(x, 742, 8, 0, 7); ctx.fill(); }
    ctx.restore();
    fogBand(ctx, t, H * .8, 200, { a: .22, hex: '#8ab8e8', seed: 9 });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot F: the road in front; you walk past, looking at your phone; the building pulses once behind you ----------
const road = (T) => {
  const t0 = T.S('01a', 'And almost'), tPulse = T.S('01a', 'nobody');
  return (ctx, t, s) => {
    skyGrad(ctx, { t, stars: .45, bottom: '#41579e' });
    fogBand(ctx, t, H * .5, 220, { a: .3, hex: '#8ab8e8' });
    // the building, bigger now, behind a fence
    const pulse = Math.exp(-Math.pow((t - tPulse - .3) / .35, 2));
    ctx.fillStyle = '#10153f'; ctx.fillRect(-20, 420, W + 40, 260); ctx.fillStyle = '#0b0f33'; ctx.fillRect(-20, 420, W + 40, 14);
    for (let i = 0; i < 16; i++) { const vx = 40 + i * 122; ctx.fillStyle = rgba(P.amber, .6 + .4 * pulse); ctx.fillRect(vx, 470, 70, 22); addGlow(ctx, vx + 35, 481, 60 + 60 * pulse, .3 + .5 * pulse, P.amber, '#fff3dd'); }
    // fence posts and mesh
    ctx.strokeStyle = 'rgba(20,24,70,.9)'; ctx.lineWidth = 6; for (let x = -20; x < W + 40; x += 110) { ctx.beginPath(); ctx.moveTo(x, 600); ctx.lineTo(x, 780); ctx.stroke(); }
    ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(40,50,110,.5)'; for (let x = -200; x < W + 200; x += 22) { ctx.beginPath(); ctx.moveTo(x, 610); ctx.lineTo(x + 170, 780); ctx.moveTo(x + 170, 610); ctx.lineTo(x, 780); ctx.stroke(); }
    // road
    ctx.fillStyle = '#0d1033'; ctx.fillRect(-20, 780, W + 40, 320); ctx.fillStyle = 'rgba(243,239,226,.22)'; for (let x = -40; x < W; x += 180) ctx.fillRect(x + ((t * 0) % 180), 930, 90, 6);
    lampPost(ctx, 300, 790, 360, t, { on: 1 }); lampPost(ctx, 1500, 790, 360, t, { on: 1 });
    // you, walking left → right, eyes on the phone (head never turns)
    const u = lin(s.a, s.b, t), x = mix(420, 1380, u);
    person(ctx, x, 880, 230, t, { phase: t * 5.2, phone: true });
    if (pulse > .02) { ctx.fillStyle = rgba('#ffd29a', .06 * pulse); ctx.fillRect(0, 0, W, H); }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot G: the cranes set the last piece, effortless; at the fence, small, a narrow door ajar ----------
export const DOOR = { x: 1240, y: 640 };   // screen point where s02 takes over (zoom into the light of the door)
const easyBit = (T) => {
  const tStr = T.S('01a', 'And the strangest'), tEasy = T.S('01a', 'Building it');
  const r = prng(404), stars = Array.from({ length: 30 }, () => [r() * W, r() * 380, r()]);
  return (ctx, t, s) => {
    skyGrad(ctx, { t, stars: .55, bottom: '#4a64b4' });
    addGlow(ctx, 360, 150, 220, .18, '#9fb8ff', '#e8f0ff');
    const z = mix(1, 1.45, eio(lin(tEasy - .4, s.b, t)));
    ctx.save(); ctx.translate(DOOR.x, DOOR.y); ctx.scale(z, z); ctx.translate(-DOOR.x, -DOOR.y);
    // tree line far behind
    hill(ctx, [[-50, 520], [200, 488], [420, 505], [700, 470], [980, 500], [1300, 476], [1600, 498], [1980, 470], [1980, 560], [-50, 560]], { col: '#18215a' });
    fogBand(ctx, t, 500, 160, { a: .35, hex: '#9cc4f0', seed: 4 });
    // building: facade gradient, panel seams, rim light on the roof edge
    const fx = 200, fy = 430, fw = 1560, fh = 250;
    const fg = ctx.createLinearGradient(0, fy, 0, fy + fh); fg.addColorStop(0, '#222c74'); fg.addColorStop(1, '#0e1240');
    ctx.fillStyle = fg; ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = 'rgba(120,150,255,.10)'; ctx.lineWidth = 2; for (let x = fx + 120; x < fx + fw; x += 120) { ctx.beginPath(); ctx.moveTo(x, fy + 6); ctx.lineTo(x, fy + fh); ctx.stroke(); }
    ctx.fillStyle = rgba(C.cyan, .55); ctx.fillRect(fx, fy - 2, fw, 3); addGlow(ctx, fx + fw * .3, fy, 260, .08, C.cyan, C.cyanWhite);
    // rooftop cooling units with turning fans
    for (let i = 0; i < 7; i++) {
      const cx = fx + 120 + i * 200; if (i === 3) continue;
      ctx.fillStyle = '#141b55'; ctx.fillRect(cx - 60, fy - 42, 120, 42);
      ctx.save(); ctx.translate(cx, fy - 42); ctx.scale(1, .28); ctx.rotate(t * (2.4 + i * .3));
      ctx.fillStyle = 'rgba(160,190,255,.35)'; for (let k = 0; k < 3; k++) { ctx.rotate(2.094); ctx.beginPath(); ctx.ellipse(18, 0, 22, 7, 0, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    // vents breathing warm light (+ reflections later)
    const breath = .75 + .25 * Math.sin(t * 1.3);
    for (let i = 0; i < 18; i++) { const vx = fx + 40 + i * 84; ctx.fillStyle = rgba(P.amber, .8 * breath); ctx.fillRect(vx, 500, 46, 14); addGlow(ctx, vx + 23, 507, 46, .22 * breath, P.amber, '#fff3dd'); }
    // tower crane: lattice mast + jib, blinking light, the last roof module swings in and settles
    const mx = 1500;
    ctx.strokeStyle = '#1b2468'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mx - 16, 700); ctx.lineTo(mx - 16, 120); ctx.moveTo(mx + 16, 700); ctx.lineTo(mx + 16, 120); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); for (let y = 700; y > 130; y -= 32) { ctx.moveTo(mx - 16, y); ctx.lineTo(mx + 16, y - 32); ctx.moveTo(mx + 16, y); ctx.lineTo(mx - 16, y - 32); } ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(900, 120); ctx.lineTo(1720, 120); ctx.moveTo(900, 142); ctx.lineTo(1720, 142); ctx.moveTo(mx, 120); ctx.lineTo(mx, 70); ctx.lineTo(1080, 120); ctx.moveTo(mx, 70); ctx.lineTo(1720, 120); ctx.stroke();
    ctx.lineWidth = 1.2; ctx.beginPath(); for (let x = 900; x < 1720; x += 26) { ctx.moveTo(x, 142); ctx.lineTo(x + 13, 120); ctx.lineTo(x + 26, 142); } ctx.stroke();
    ctx.fillStyle = '#121a52'; ctx.fillRect(1640, 142, 70, 46);
    const blink = (t % 1.6) < .25 ? 1 : 0; if (blink) addGlow(ctx, mx, 66, 30, .9, '#ff5a4a', '#ffd0c8');
    const uSet = eio(lin(tStr + .2, tEasy + .5, t)), sw = Math.sin(t * 1.4) * 10 * (1 - uSet);
    const px = mix(1300, 960, uSet) + sw, py = mix(250, 428, uSet);
    ctx.strokeStyle = 'rgba(150,170,230,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mix(1300, 960, uSet), 142); ctx.lineTo(px, py - 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py - 34); ctx.lineTo(px - 120, py - 22); ctx.moveTo(px, py - 34); ctx.lineTo(px + 120, py - 22); ctx.stroke();
    const mg = ctx.createLinearGradient(0, py - 22, 0, py); mg.addColorStop(0, '#34428f'); mg.addColorStop(1, '#1a2366');
    ctx.fillStyle = mg; ctx.fillRect(px - 130, py - 22, 260, 24); ctx.fillStyle = rgba(C.cyan, .7); ctx.fillRect(px - 130, py - 22, 260, 2);
    const click = Math.exp(-Math.pow((t - (tEasy + .55)) / .3, 2)); if (click > .01) addGlow(ctx, px, py - 10, 320, .5 * click, C.cyan, C.cyanWhite);
    // fence with chain-link mesh, the narrow door ajar in it
    ctx.fillStyle = '#0a0e30'; ctx.fillRect(-200, 690, W + 400, 40);
    ctx.strokeStyle = 'rgba(70,90,170,.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = -200; x < W + 200; x += 18) { ctx.moveTo(x, 560); ctx.lineTo(x + 130, 690); ctx.moveTo(x + 130, 560); ctx.lineTo(x, 690); } ctx.stroke();
    ctx.strokeStyle = '#0c1036'; ctx.lineWidth = 6; for (let x = -100; x < W + 200; x += 150) { ctx.beginPath(); ctx.moveTo(x, 552); ctx.lineTo(x, 700); ctx.stroke(); }
    ctx.fillStyle = '#070922'; ctx.fillRect(DOOR.x - 42, DOOR.y - 82, 84, 160);
    const gap = 8 + 5 * Math.sin(t * .7);
    const dg = ctx.createLinearGradient(DOOR.x, 0, DOOR.x + gap, 0); dg.addColorStop(0, '#fff3dd'); dg.addColorStop(1, '#ffc477');
    ctx.fillStyle = dg; ctx.fillRect(DOOR.x - 3, DOOR.y - 76, gap, 150);
    addGlow(ctx, DOOR.x, DOOR.y, 140, .6, P.amber, '#fff3dd');
    // ground: wet asphalt, light spill from the door, vent reflections
    const gg = ctx.createLinearGradient(0, 730, 0, H); gg.addColorStop(0, '#0f1440'); gg.addColorStop(1, '#070a26'); ctx.fillStyle = gg; ctx.fillRect(-200, 730, W + 400, 500);
    for (let i = 0; i < 18; i++) { const vx = fx + 63 + i * 84; const rg = ctx.createLinearGradient(0, 740, 0, 900); rg.addColorStop(0, rgba(P.amber, .16 * breath)); rg.addColorStop(1, rgba(P.amber, 0)); ctx.fillStyle = rg; ctx.fillRect(vx - 4 + Math.sin(t * 2 + i) * 2, 740, 8, 160); }
    const beam = ctx.createLinearGradient(DOOR.x, 730, DOOR.x + 160, 1080); beam.addColorStop(0, rgba('#ffd29a', .45)); beam.addColorStop(1, rgba('#ffd29a', 0));
    ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(DOOR.x - 6, 730); ctx.lineTo(DOOR.x + gap + 4, 730); ctx.lineTo(DOOR.x + 300, 1090); ctx.lineTo(DOOR.x + 30, 1090); ctx.fill();
    for (let i = 0; i < 26; i++) { const ph = (t * .08 + i * .137) % 1, dx = DOOR.x + 10 + ph * 220 + Math.sin(t + i) * 10, dy = 740 + ph * 330 + Math.cos(t * .7 + i) * 8; ctx.fillStyle = rgba('#ffe7c2', .5 * Math.sin(ph * Math.PI)); ctx.beginPath(); ctx.arc(dx, dy, 1.6, 0, 7); ctx.fill(); }
    ctx.restore();
    fogBand(ctx, t, H * .9, 180, { a: .18, hex: '#8ab8e8', seed: 12 });
    finish(ctx, t, { vig: .5 });
  };
};

export default function (T) {
  const S = (p) => T.S('01a', p);
  return [
    { t: 0, draw: multiply(T) },
    { t: S('Every medicine') - .05, draw: pillInHand(T), tr: 'match', d: .35 },
    { t: S('every light') + .05, draw: kitchen(T), tr: 'match', d: .5, x: W / 2, y: 300 },
    { t: S('And there were') - .1, draw: hall(T), tr: 'out', d: 1.2, x: W / 2, y: 290, depth: 5 },
    { t: S('Somewhere') - .15, draw: town(T), tr: 'iris', d: 1.1, x: W / 2, y: 310 },
    { t: S('And almost') - .3, draw: road(T), tr: 'down', d: 1.2 },
    { t: S('And the strangest') - .2, draw: easyBit(T), tr: 'up', d: 1.1 },
  ];
}
