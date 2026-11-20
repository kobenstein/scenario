// "Where does that leave us? I'd say the takeoff has started, but only the first stage."
// Dusk. The camera tilts down from the sky to a long runway: an airliner, cabin windows lit cyan, starts to roll.
// Runway lights stream past faster and faster. On "takeoff" the nose lifts and the nose wheel leaves the ground,
// but the main wheels stay down: the first stage of a takeoff. A three-step marker shows step one lit.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, clamp } = L;
const { grainFill, roundRect, poly, cap, cached, motes } = require('./s_k2_studio');

const T0 = 133.15, T1 = 139.1;
const T_ROLL = 134.2, T_ROT = 135.72, T_STAGE = 137.6;
const HOR = 600;          // horizon
const RWY = 790;          // runway contact line (main wheels)

// distance rolled: speed ramps up from T_ROLL
function dist(t) { const u = Math.max(0, t - T_ROLL); return 60 * u * u + 40 * u; }
const pitch = t => -0.115 * ease(ramp(t, T_ROT - 0.1, T_ROT + 0.9)) + 0.006 * Math.sin(t * 2.3) * ramp(t, T_ROT, T_ROT + 1);

function skyArt(c) {
  grainFill(c, k => k.rect(-300, -900, W + 600, HOR + 960), lin(c, 0, -900, 0, HOR + 40, [[0, '#05061c'], [0.45, '#1a1848'], [0.75, '#4a3a78'], [0.9, '#9a5a6a'], [1, '#e08a5a']]), 0.45);
  const r = rng(77); for (let i = 0; i < 120; i++) { c.fillStyle = rgba(C.cream, 0.1 + r() * 0.5); c.fillRect(-300 + r() * (W + 600), -900 + r() * 900, 1.7, 1.7); }
  // long thin clouds lit from below
  for (let i = 0; i < 6; i++) { const y = HOR - 60 - i * 55 - r() * 30, x = -200 + r() * W, w = 300 + r() * 600;
    grainFill(c, k => k.ellipse(x, y, w, 7 + r() * 6, 0, 0, Math.PI * 2), lin(c, 0, y - 10, 0, y + 10, [[0, 'rgba(90,70,130,0.5)'], [1, 'rgba(240,150,110,0.45)']]), 0.3); }
  // far hills and the city strip on the horizon
  grainFill(c, k => { k.moveTo(-300, HOR); for (let x = -300; x <= W + 300; x += 60) k.lineTo(x, HOR - 18 - 14 * Math.sin(x * 0.004) - 8 * Math.sin(x * 0.013)); k.lineTo(W + 300, HOR + 40); k.lineTo(-300, HOR + 40); k.closePath(); }, '#1c1640', 0.5);
  for (let i = 0; i < 60; i++) { c.fillStyle = rgba(r() < 0.7 ? C.amber : C.cyan, 0.4 + r() * 0.4); c.fillRect(-300 + r() * (W + 600), HOR - 6 - r() * 10, 2, 2); }
}
function fieldArt(c) {
  grainFill(c, k => k.rect(-300, HOR, W + 600, 700), lin(c, 0, HOR, 0, H + 100, [[0, '#2a2050'], [0.25, '#1a1640'], [1, '#08081c']]), 0.55);
  // the runway: a band seen from the side, far edge thin, near edge wider
  grainFill(c, poly([[-300, RWY - 46], [W + 300, RWY - 46], [W + 300, RWY + 34], [-300, RWY + 34]]), lin(c, 0, RWY - 46, 0, RWY + 34, [[0, '#3a3058'], [1, '#221c40']]), 0.5);
  c.fillStyle = 'rgba(255,170,120,0.18)'; c.fillRect(-300, RWY - 46, W + 600, 2);
}

// the airliner, side view, nose to the right; origin at the main-wheel contact point
function planeArt(c) {
  const body = lin(c, 0, -330, 0, -170, [[0, '#8a86c0'], [0.18, '#5a5694'], [0.6, '#2c2a5e'], [1, '#14143a']]);
  // far wing and far engine (behind the fuselage)
  grainFill(c, poly([[-40, -205], [-250, -240], [-300, -232], [-120, -196]]), '#1a1840', 0.4);
  // vertical fin
  grainFill(c, k => { k.moveTo(-640, -290); k.lineTo(-760, -520); k.lineTo(-700, -525); k.lineTo(-560, -300); k.closePath(); }, lin(c, -760, -520, -560, -300, [[0, '#a89ad0'], [1, '#3a3672']]), 0.45);
  grainFill(c, k => { k.moveTo(-760, -520); k.lineTo(-700, -525); k.lineTo(-690, -500); k.lineTo(-748, -496); k.closePath(); }, '#ffb35c', 0.2);
  // fuselage: a long tube, tail cone sweeping up, rounded nose
  grainFill(c, k => {
    k.moveTo(-560, -310); k.lineTo(420, -320);
    k.bezierCurveTo(520, -320, 600, -300, 640, -260); k.bezierCurveTo(660, -236, 650, -200, 600, -192);
    k.lineTo(-420, -186); k.bezierCurveTo(-560, -190, -700, -260, -790, -300); k.bezierCurveTo(-760, -312, -680, -312, -560, -310); k.closePath();
  }, body, 0.45);
  // warm sky light along the crown
  c.strokeStyle = 'rgba(255,190,150,0.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-560, -309); c.lineTo(420, -319); c.bezierCurveTo(520, -319, 590, -302, 630, -268); c.stroke();
  // cabin windows (cyan, lit) and the cockpit
  for (let x = -480; x < 400; x += 26) { c.fillStyle = rgba(C.cyanW, 0.85); c.beginPath(); roundRect(c, x, -282, 11, 15, 5); c.fill(); }
  grainFill(c, poly([[560, -290], [612, -278], [628, -262], [570, -266]]), lin(c, 560, -290, 628, -262, [[0, '#d8f7ff'], [1, '#2a8aa8']]), 0.2);
  c.fillStyle = 'rgba(10,10,30,0.6)'; c.fillRect(-490, -240, 960, 3);
  // doors
  c.strokeStyle = 'rgba(10,10,30,0.5)'; c.lineWidth = 2; for (const x of [-520, 470]) { c.beginPath(); roundRect(c, x, -296, 26, 66, 6); c.stroke(); }
  // near wing (swept back, seen slightly from below) and engine
  grainFill(c, poly([[60, -214], [-260, -150], [-330, -146], [-60, -212]]), lin(c, 0, -214, 0, -146, [[0, '#4a4680'], [1, '#1c1a46']]), 0.45);
  grainFill(c, k => roundRect(k, -40, -186, 190, 64, 30), lin(c, 0, -186, 0, -122, [[0, '#6a66a8'], [0.5, '#34306a'], [1, '#14123a']]), 0.45);
  grainFill(c, k => k.ellipse(150, -154, 12, 30, 0, 0, Math.PI * 2), '#0a0a20', 0.2);
  c.fillStyle = 'rgba(255,179,92,0.35)'; c.fillRect(-30, -184, 170, 2);
  // horizontal tail
  grainFill(c, poly([[-640, -300], [-760, -262], [-800, -262], [-700, -308]]), '#3a3672', 0.4);
  // main gear (under the wing): strut and two wheels
  c.fillStyle = '#0a0a1e'; c.fillRect(-46, -190, 12, 150);
  for (const dx of [-72, -6]) { grainFill(c, k => k.arc(dx, -36, 36, 0, Math.PI * 2), '#0c0c1c', 0.3); grainFill(c, k => k.arc(dx, -36, 15, 0, Math.PI * 2), '#3a3666', 0.3); }
}
// the nose gear is drawn live so it can extend as the nose lifts
function noseGear(c, ext) {
  c.fillStyle = '#0a0a1e'; c.fillRect(493, -196, 10, 140 + ext);
  grainFill(c, k => k.arc(498, -32 + ext, 30, 0, Math.PI * 2), '#0c0c1c', 0.3); grainFill(c, k => k.arc(498, -32 + ext, 12, 0, Math.PI * 2), '#3a3666', 0.3);
}

const LIGHTS = 40;
function edgeLights(ctx, t, y, gap, size, par, col) {
  const d = dist(t) * par, off = ((-d % gap) + gap) % gap;
  const v = Math.min(1, (dist(t + 0.05) - dist(t)) * par / 30);    // streak length with speed
  for (let i = -2; i < LIGHTS; i++) {
    const x = off + i * gap - 200; if (x < -250 || x > W + 250) continue;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(col, 0.75); ctx.lineWidth = size; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6 + v * 140, y); ctx.stroke(); ctx.restore();
    light(ctx, x, y, size * 7, col, 0.35);
  }
}

function draw(ctx, t) {
  // camera: begins tilted up into the sky, settles on the runway, then tracks with a slow push
  const tilt = 1 - ease(ramp(t, T0, T0 + 1.6));
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 13) * 5, dy = drift(t, 1, 14) * 4, ty = tilt * 560;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par + ty * (0.75 + 0.25 * par)); fn(); ctx.restore(); };

  layer(0.4, () => { cached(ctx, 'k2rsky', -300, -900, W + 300, HOR + 40, skyArt, 1); light(ctx, 1500, HOR - 10, 700, '#ff9a5a', 0.22); });
  layer(1.0, () => {
    cached(ctx, 'k2rfield', -300, HOR, W + 300, H + 100, fieldArt, 1);
    // far edge lights (small, slow), centreline dashes, near edge lights later in front of the plane
    edgeLights(ctx, t, RWY - 40, 120, 3, 0.6, '#ffe0b0');
    { const d = dist(t) * 0.85, gap = 160, off = ((-d % gap) + gap) % gap; ctx.fillStyle = 'rgba(240,230,220,0.35)'; for (let i = -1; i < 16; i++) ctx.fillRect(off + i * gap - 100, RWY - 6, 70, 3); }
    // the plane rolls in from left of centre and drifts right a little as it gathers speed
    const px = lerp(780, 980, ease(ramp(t, T_ROLL, T1))), th = pitch(t);
    const vib = Math.sin(t * 40) * 1.2 * ramp(t, T_ROLL, T_ROLL + 1) * (1 - 0.6 * ramp(t, T_ROT, T_ROT + 0.6));
    ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(px - 60, RWY + 4, 620, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(px, RWY + vib); ctx.rotate(th);
    noseGear(ctx, -th * 25);
    cached(ctx, 'k2plane', -820, -540, 680, 10, planeArt, 1);
    ctx.restore();
    // landing light on the nose gear: the hero light, reaching down the runway
    const nx = px + 498 * Math.cos(th) - (-60) * Math.sin(th), ny = RWY + 498 * Math.sin(th) + (-60) * Math.cos(th);
    const k = 0.9 + 0.1 * Math.sin(t * 7);
    light(ctx, nx, ny, 70, '#ffffff', 0.9 * k); light(ctx, nx, ny, 260, C.cyanW, 0.3 * k);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, nx, ny, nx + 900, ny, [[0, rgba(C.cyanW, 0.28 * k)], [1, rgba(C.cyanW, 0)]]);
    ctx.beginPath(); ctx.moveTo(nx, ny - 6); ctx.lineTo(nx + 1000, ny - 90 + th * 600); ctx.lineTo(nx + 1000, ny + 60 + th * 300); ctx.lineTo(nx, ny + 6); ctx.closePath(); ctx.fill(); ctx.restore();
    // engine glow and heat at the back of the engine
    light(ctx, px - 40 * Math.cos(th) + 150 * Math.sin(th), RWY - 154 + th * 40, 60, C.amber, 0.25 * ramp(t, T_ROLL - 0.5, T_ROLL));
    // near edge lights, the closest and fastest
    edgeLights(ctx, t, RWY + 30, 210, 6, 1.4, '#ffd9a0');
    // wind lines once it is fast
    const sp = ramp(t, T_ROT - 1, T_ROT + 0.5);
    for (let i = 0; i < 10; i++) { const y = 160 + i * 60 + hash(i) * 30, x = (((-dist(t) * 1.6 + hash(i, 2) * 2400) % 2400) + 2400) % 2400 - 200;
      ctx.strokeStyle = rgba(C.cream, 0.08 * sp); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 260, y); ctx.stroke(); }
  });
  // the stage marker: three steps, the first one fills on "first stage"
  const a = ramp(t, T_ROT + 0.1, T_ROT + 0.7);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 18;
    const x0 = 96, y0 = 96, fill = ramp(t, T_STAGE - 0.2, T_STAGE + 0.5);
    ctx.font = '96px "Instrument Serif"'; ctx.fillStyle = C.cream; ctx.textBaseline = 'top'; ctx.fillText('Takeoff', x0, y0 + (1 - out((t - T_ROT - 0.1) / 0.9)) * 16);
    for (let i = 0; i < 3; i++) {
      const bx = x0 + i * 112, by = y0 + 118;
      ctx.fillStyle = 'rgba(164,159,196,0.25)'; ctx.beginPath(); roundRect(ctx, bx, by, 96, 12, 6); ctx.fill();
      if (i === 0 && fill > 0) { ctx.fillStyle = C.amber; ctx.beginPath(); roundRect(ctx, bx, by, Math.max(12, 96 * fill), 12, 6); ctx.fill(); light(ctx, bx + 96 * fill, by + 6, 40, C.amber, 0.5 * fill); }
    }
    ctx.font = '26px "Inter Medium"'; ctx.letterSpacing = '6px'; ctx.fillStyle = rgba(C.cream, 0.85 * fill); ctx.fillText('FIRST STAGE', x0 + 4, y0 + 150);
    ctx.restore();
  }
}

module.exports = { T0, T1, draw };
