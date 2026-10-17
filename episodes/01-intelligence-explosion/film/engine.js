// Scenario film engine: one shared renderer, one scene module per beat, a deterministic render(t).
// Every scene module exports default { id, build(E) -> { scene, camera, update(t), post? } }.
// t is always GLOBAL episode time in seconds; scene windows come from scenes/index.js.
// Style rules: skill "scenario-motion" (paper diorama, hero light, amber human vs cyan machine, never still).
import * as THREE from "three";
import { EffectComposer } from "./assets/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./assets/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "./assets/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "./assets/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "./assets/jsm/postprocessing/SMAAPass.js";

export { THREE };
const W = 1920, H = 1080;

// ---------- deterministic math ----------
export const rng = (s0 = 1) => { let s = (s0 * 2654435761) >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lin = (a, b, t) => clamp((t - a) / (b - a), 0, 1);
export const smooth = (a, b, t) => { const x = lin(a, b, t); return x * x * (3 - 2 * x); };
export const lerp = (a, b, k) => a + (b - a) * k;
export const expoOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const inOut = (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2);
export const sineInOut = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export const backOut = (x, s = 1.4) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
// pop-up spring: fast rise, ~8 % overshoot, settles (paper has little bounce)
export const spring = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-6 * x) * Math.cos(8.5 * x));
// anticipation: dips to -a before rising (use for accents)
export const antic = (x, a = 0.08) => (x <= 0 ? 0 : x < 0.25 ? -a * Math.sin((x / 0.25) * Math.PI) : expoOut((x - 0.25) / 0.75));
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
// slow organic wobble for "never still" (sum of crooked sines), returns ~[-1,1]
export const wob = (t, seed = 0, f = 1) => Math.sin(t * 0.37 * f + seed * 1.7) * 0.6 + Math.sin(t * 0.83 * f + seed * 2.9 + 1.3) * 0.3 + Math.sin(t * 1.31 * f + seed * 0.7) * 0.1;

// ---------- colours (meaning-bearing; never violate) ----------
export const C = {
  amber: "#ffb35c", amberDeep: "#7a3b17", amberSoft: "#ffd9a8",
  cyan: "#6fe3ff", cyanPale: "#d8f7ff", cyanDeep: "#0a6f8c",
  ink: "#07060c", cream: "#efe6d2", creamText: "#f3efe2", secondary: "#a49fc4", label: "#9aa5b8",
  red: "#d9503f", // only for Lena's red pencil
};
// Palettes: night (hook + scenario), grey (bad ending), dawn (good ending + solutions).
// layers: paper colours from far to near; sky: gradient stops top->horizon.
export const PAL = {
  night: { sky: ["#070b16", "#16223c", "#33476f"], fog: "#0b1222", floor: "#0d1526", hemiSky: "#6f86b8", hemiGround: "#0a0f1a", key: "#bfd0ff",
    layers: ["#33476d", "#2c3f63", "#22324f", "#19253d", "#16213a", "#101a2d"], clear: "#070b14", exposure: 1.15 },
  grey: { sky: ["#0d1418", "#25323a", "#4a5c63"], fog: "#1a2328", floor: "#1b2429", hemiSky: "#8aa3ad", hemiGround: "#0d1214", key: "#cfe6ee",
    layers: ["#55676e", "#475960", "#3a4a51", "#2f3d43", "#273338", "#1e282c"], clear: "#0c1114", exposure: 1.1 },
  dawn: { sky: ["#2b2350", "#8a5a86", "#f2a679"], fog: "#6b4a6a", floor: "#5a3f5c", hemiSky: "#ffd2b0", hemiGround: "#3a2840", key: "#ffd9a8",
    layers: ["#b07a8c", "#94627e", "#7a4f70", "#603f5f", "#4d3350", "#3a2740"], clear: "#2b2350", exposure: 1.1 },
};

// ---------- timing: word anchors from the cut VO ----------
let TIMING = null;
export const setTiming = (t) => (TIMING = t);
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9%']/g, "");
// at("hook", "Again") -> start time (s, global) of the first word "again" in section hook.
// Phrases work too: at("scenario", "Picture a flipbook"). n = occurrence (1-based). which: "s" start | "e" end.
export const at = (section, phrase, n = 1, which = "s") => {
  const sec = TIMING.sections.find((s) => s.id === section); if (!sec) throw new Error("no section " + section);
  const ws = TIMING.words.filter((w) => w.s >= sec.start - 0.01 && w.s < sec.end);
  const p = phrase.split(/\s+/).map(norm).filter(Boolean); let hit = 0;
  for (let i = 0; i + p.length <= ws.length; i++) {
    let ok = true; for (let k = 0; k < p.length; k++) if (norm(ws[i + k].w) !== p[k]) { ok = false; break; }
    if (ok && ++hit === n) return which === "e" ? ws[i + p.length - 1].e : ws[i].s;
  }
  throw new Error(`word "${phrase}" #${n} not found in ${section}`);
};
export const end = (section, phrase, n = 1) => at(section, phrase, n, "e");
export const section = (id) => TIMING.sections.find((s) => s.id === id);

// ---------- paper material ----------
let paperTex, bumpTex;
const makePaper = () => {
  const r = rng(4242), S = 512, c = document.createElement("canvas"); c.width = c.height = S; const g = c.getContext("2d");
  const img = g.createImageData(S, S);
  for (let i = 0; i < img.data.length; i += 4) { const v = 232 + (r() - 0.5) * 34; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  g.globalAlpha = 0.08; g.strokeStyle = "#ffffff"; g.lineWidth = 1;
  for (let k = 0; k < 900; k++) { const x = r() * S, y = r() * S, a = r() * Math.PI, l = 6 + r() * 22;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (r() - 0.5) * 6, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  g.globalAlpha = 0.06; g.strokeStyle = "#000000";
  for (let k = 0; k < 500; k++) { const x = r() * S, y = r() * S, a = r() * Math.PI, l = 4 + r() * 14;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  paperTex = new THREE.CanvasTexture(c); paperTex.wrapS = paperTex.wrapT = THREE.RepeatWrapping; paperTex.colorSpace = THREE.SRGBColorSpace;
  paperTex.repeat.set(0.09, 0.09); paperTex.anisotropy = 4;
  bumpTex = paperTex.clone(); bumpTex.colorSpace = THREE.NoColorSpace; bumpTex.needsUpdate = true;
};
const EDGE = new THREE.Color(C.cream);
// [face, edge] materials for an extruded paper sheet
export const paperMats = (hex, { rough = 0.92, emissive = 0, edge } = {}) => {
  const face = new THREE.MeshStandardMaterial({ color: hex, map: paperTex, bumpMap: bumpTex, bumpScale: 0.6, roughness: rough, metalness: 0 });
  if (emissive) { face.emissive = new THREE.Color(hex); face.emissiveIntensity = emissive; }
  return [face, new THREE.MeshStandardMaterial({ color: edge ? new THREE.Color(edge) : EDGE.clone().multiplyScalar(0.3), roughness: 0.9, metalness: 0 })];
};
export const paperMat = (hex, opts) => paperMats(hex, opts)[0];
// extruded paper cut-out from a THREE.Shape (lies in XY, thickness along +Z)
export const extrude = (shape, hex, depth = 0.22, opts = {}) => {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: opts.segments || 48 });
  const m = new THREE.Mesh(geo, opts.mats || paperMats(hex, opts)); m.castShadow = opts.cast !== false; m.receiveShadow = true; return m;
};
// simple shapes
export const rectShape = (w, h, cx = 0, cy = 0) => { const s = new THREE.Shape(); s.moveTo(cx - w / 2, cy - h / 2); s.lineTo(cx + w / 2, cy - h / 2); s.lineTo(cx + w / 2, cy + h / 2); s.lineTo(cx - w / 2, cy + h / 2); s.lineTo(cx - w / 2, cy - h / 2); return s; };
export const circleShape = (r, cx = 0, cy = 0) => { const s = new THREE.Shape(); s.absarc(cx, cy, r, 0, Math.PI * 2, false); return s; };
export const ringShape = (r0, r1) => { const s = circleShape(r1); const h = new THREE.Path(); h.absarc(0, 0, r0, 0, Math.PI * 2, true); s.holes.push(h); return s; };
export const polyShape = (pts) => { const s = new THREE.Shape(); s.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]); s.lineTo(pts[0][0], pts[0][1]); return s; };
export const roundRectShape = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
export const box = (w, h, d, hex, opts) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), paperMat(hex, opts)); m.castShadow = true; m.receiveShadow = true; return m; };
// glowing flat (MeshBasic, toneMapped) for light sources: screens, windows, slits. setGlow(k) scales colour.
export const glowPlane = (w, h, hex) => { const col = new THREE.Color(hex); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col.clone() }));
  m.userData.base = col; m.userData.setGlow = (k) => m.material.color.copy(col).multiplyScalar(k); return m; };

// ---------- canvas text / drawn paper cards ----------
// paper card whose face is a drawable canvas (report pages, exam booklet, typewriter page, summary cards, headlines).
// draw(ctx, w, h, state) is called by card.redraw(state); keep redraws to cards that change.
export const drawnCard = ({ w = 4, h = 3, px = 1024, hex = C.cream, depth = 0.04, draw }) => {
  const cw = px, ch = Math.round(px * h / w); const c = document.createElement("canvas"); c.width = cw; c.height = ch; const g = c.getContext("2d");
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const face = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, roughness: 0.92, bumpMap: bumpTex, bumpScale: 0.25 });
  const side = new THREE.MeshStandardMaterial({ color: EDGE.clone().multiplyScalar(0.5), roughness: 0.9 });
  const back = new THREE.MeshStandardMaterial({ color: hex, map: paperTex, roughness: 0.92 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth), [side, side, side, side, face, back]); m.castShadow = true; m.receiveShadow = true;
  const base = new THREE.Color(hex);
  m.userData.redraw = (state) => { g.fillStyle = "#" + base.getHexString(); g.fillRect(0, 0, cw, ch); if (draw) draw(g, cw, ch, state); tex.needsUpdate = true; };
  m.userData.redraw({}); m.userData.canvas = c; return m;
};
// paper cut-out letters/numbers (alpha-cut card, casts real shadows), e.g. "2026", "80%", "?"
export const cutoutText = (text, { height = 3, font = '"Instrument Serif"', hex = C.cream, weight = "400", emissive = 0 } = {}) => {
  const c = document.createElement("canvas"); const g = c.getContext("2d"); const fs = 300;
  g.font = `${weight} ${fs}px ${font}`; const tw = Math.ceil(g.measureText(text).width) + 40;
  c.width = tw; c.height = 400; g.fillStyle = "#fff"; g.font = `${weight} ${fs}px ${font}`; g.textAlign = "center"; g.fillText(text, tw / 2, 320);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.MeshStandardMaterial({ color: hex, map: paperTex, alphaMap: tex, alphaTest: 0.5, roughness: 0.9, side: THREE.DoubleSide });
  if (emissive) { mat.emissive = new THREE.Color(hex); mat.emissiveIntensity = emissive; }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(height * tw / 400, height), mat); m.castShadow = true;
  m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaMap: tex, alphaTest: 0.5 });
  return m;
};

// ---------- stage: sky, floor, stars, clouds, sun/moon ----------
export const stage = (scene, pal, { floor = true, stars = 120, clouds = true, orb = null, seed = 7, skyZ = -62, skyY = 50, floorZ = -5, floorColor } = {}) => {
  const r = rng(seed); const out = { update: () => {} };
  scene.background = new THREE.Color(pal.clear); scene.fog = new THREE.Fog(pal.fog, 70, 170);
  if (floor) { const f = new THREE.Mesh(new THREE.PlaneGeometry(260, 120), new THREE.MeshStandardMaterial({ color: floorColor || pal.floor, map: paperTex, bumpMap: bumpTex, bumpScale: 0.5, roughness: 0.95 }));
    f.rotation.x = -Math.PI / 2; f.position.set(0, 0, floorZ); f.receiveShadow = true; scene.add(f); out.floor = f; }
  const c = document.createElement("canvas"); c.width = 8; c.height = 256; const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, pal.sky[0]); gr.addColorStop(0.55, pal.sky[1]); gr.addColorStop(1, pal.sky[2]);
  g.fillStyle = gr; g.fillRect(0, 0, 8, 256); const st = new THREE.CanvasTexture(c); st.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(340, 150), new THREE.MeshBasicMaterial({ map: st, fog: false })); sky.position.set(0, skyY, skyZ); scene.add(sky); out.sky = sky;
  let starG = null;
  if (stars) { const im = new THREE.InstancedMesh(new THREE.CircleGeometry(0.16, 10), new THREE.MeshBasicMaterial({ color: "#d9d2bd", fog: false, transparent: true, opacity: 1 }), stars);
    const d = new THREE.Object3D(); for (let i = 0; i < stars; i++) { d.position.set(-160 + r() * 320, 28 + r() * 70, 0); d.scale.setScalar(0.5 + r() * 1.2); d.updateMatrix(); im.setMatrixAt(i, d.matrix); }
    starG = new THREE.Group(); starG.position.z = skyZ + 1; starG.add(im); scene.add(starG); out.stars = im; }
  const cl = [];
  if (clouds) { const shape = (w, h) => { const s = new THREE.Shape(); s.moveTo(-w, 0); let x = -w; while (x < w) { const rr = h * (0.45 + r() * 0.55); s.absarc(x + rr, 0, rr, Math.PI, 0, true); x += rr * 2; } s.lineTo(x, -0.2); s.lineTo(-w, -0.2); return s; };
    [[-30, 36, -50, 9, 2.6, 0.18], [24, 40, -54, 12, 3.2, 0.12], [-4, 29, -46, 7, 2.0, 0.24], [52, 27, -48, 8, 2.2, 0.2]].forEach(([x, y, z, w, h, v]) => {
      const m = extrude(shape(w, h), pal.layers[0], 0.18); m.position.set(x, y, z + (skyZ + 62)); m.receiveShadow = false; scene.add(m); cl.push({ m, x0: x, y0: y, v }); }); }
  if (orb) { const m = extrude(circleShape(orb.r || 3.6), orb.hex || "#e9dfc6"); m.material[0].emissive = new THREE.Color(orb.hex || "#e9dfc6"); m.material[0].emissiveIntensity = orb.glow ?? 0.35;
    m.position.set(orb.x ?? 42, orb.y ?? 31, skyZ + 4); scene.add(m); out.orb = m; }
  out.update = (t) => { if (starG) { starG.position.x = t * 0.18; starG.position.y = Math.sin(t * 0.2) * 0.3; }
    cl.forEach((c, i) => { c.m.position.x = c.x0 + (t % 400) * c.v * 0.6; c.m.position.y = c.y0 + 0.25 * Math.sin(t * 0.3 + i); });
    if (out.orb) { out.orb.position.y += 0; out.orb.rotation.z = t * 0.01; } };
  return out;
};
// standard light rig: hemisphere + one shadow-casting key light. box = half-size of the shadow frustum.
export const lights = (scene, pal, { key = [-30, 34, 40], target = [0, 0, -10], intensity = 2.4, hemi = 0.8, box = 60, map = 2048 } = {}) => {
  const h = new THREE.HemisphereLight(pal.hemiSky, pal.hemiGround, hemi); scene.add(h);
  const k = new THREE.DirectionalLight(pal.key, intensity); k.position.set(...key); k.target.position.set(...target);
  k.castShadow = true; k.shadow.mapSize.set(map, map); k.shadow.radius = 6; k.shadow.bias = -0.0006; k.shadow.normalBias = 0.04;
  Object.assign(k.shadow.camera, { left: -box, right: box, top: box * 0.8, bottom: -box * 0.5, near: 1, far: 200 }); scene.add(k, k.target);
  return { hemi: h, key: k };
};
// a warm/cold practical light (lamp, screen) with soft shadows
export const pointLight = (hex, intensity, dist = 26, shadow = false) => { const l = new THREE.PointLight(hex, intensity, dist, 1.6);
  if (shadow) { l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.radius = 4; l.shadow.bias = -0.002; } return l; };

// ---------- pop-up layers (paper theatre) ----------
// a sheet that stands up from the floor around its bottom edge; pop(t) drives it. returns {g, update(t)}
export const popLayer = (parent, z, mesh, popAt, dur = 1.1, i = 0) => {
  const hinge = new THREE.Group(); hinge.position.set(0, 0, z); parent.add(hinge); hinge.add(mesh);
  return { g: hinge, update: (t) => { const up = spring(lin(popAt, popAt + dur, t)); hinge.visible = t >= popAt - 0.03;
    hinge.rotation.x = -Math.PI / 2 * (1 - up) + 0.006 * Math.sin(t * (0.55 + i * 0.13) + i * 1.7) * up;
    hinge.position.x = (0.18 + i * 0.05) * Math.sin(t * (0.21 + i * 0.04) + i); } };
};
// skyline sheet cut along rooftops with window holes; pick(x)->{w,h,roof}
export const skylineShape = (x0, x1, pick, holeP = 0, r = rng(3)) => {
  const s = new THREE.Shape(); s.moveTo(x0, -0.5); let x = x0; const holes = [];
  while (x < x1) { const b = pick(x, r); const w = Math.min(b.w, x1 - x), h = b.h; s.lineTo(x, h);
    if (b.roof === "pitch") { s.lineTo(x + w * 0.5, h + w * 0.38); s.lineTo(x + w, h); }
    else if (b.roof === "mansard") { s.lineTo(x + w * 0.12, h + 1.4); s.lineTo(x + w * 0.88, h + 1.4); s.lineTo(x + w, h); }
    else if (b.roof === "chimney") { s.lineTo(x + w * 0.7, h); s.lineTo(x + w * 0.7, h + 1.2); s.lineTo(x + w * 0.8, h + 1.2); s.lineTo(x + w * 0.8, h); s.lineTo(x + w, h); }
    else if (b.custom) b.custom(s, x, w, h); else s.lineTo(x + w, h);
    if (holeP > 0 && w > 3 && !b.custom) for (let wy = 1.6; wy < h - 1.2; wy += 2.0) for (let wx = x + 0.9; wx < x + w - 1.3; wx += 1.6)
      if (r() < holeP) { const hp = new THREE.Path(); hp.moveTo(wx, wy); hp.lineTo(wx + 0.55, wy); hp.lineTo(wx + 0.55, wy + 0.8); hp.lineTo(wx, wy + 0.8); hp.lineTo(wx, wy); holes.push(hp); }
    x += w; }
  s.lineTo(x1, -0.5); s.lineTo(x0, -0.5); s.holes.push(...holes); return s;
};
const ROOFS = ["flat", "pitch", "mansard", "chimney", "flat", "pitch"];
export const randomPick = (hMin, hMax, wMin = 3, wMax = 7) => (x, r) => ({ w: wMin + r() * (wMax - wMin), h: hMin + r() * (hMax - hMin), roof: ROOFS[Math.floor(r() * ROOFS.length)] });
// a full night/dawn city: several popped skyline sheets. returns {layers, update(t)}
export const city = (parent, pal, { popAt = -10, seed = 11, zs = [-30, -22, -14, -6, 0], holes = [0, 0.05, 0.18, 0.12, 0.1], heights = [[3, 6], [4, 7.5], [6, 11], [5, 10], [4, 8]], width = 80 } = {}) => {
  const L = zs.map((z, i) => { const r = rng(seed + i * 13); const m = extrude(skylineShape(-width, width, randomPick(heights[i][0], heights[i][1], 3.5, 7), holes[i], r), pal.layers[i] || pal.layers.at(-1)); m.position.z = -0.11;
    return popLayer(parent, z, m, popAt + (zs.length - 1 - i) * 0.12, 1.1, i); });
  return { layers: L, update: (t) => L.forEach((l) => l.update(t)) };
};

// ---------- tower (lab buildings in hook / endings / reveal 2) ----------
// a tall paper tower with floors; floors[i] is a window strip you can light: setFloor(i, k, hex)
export const tower = ({ w = 6, h = 22, floors = 10, hex = "#22324f", roof = "flat" } = {}) => {
  const g = new THREE.Group(); const s = rectShape(w, h, 0, h / 2);
  if (roof === "spire") { s.curves = []; const p = polyShape([[-w / 2, 0], [w / 2, 0], [w / 2, h], [0, h + w * 0.6], [-w / 2, h]]); Object.assign(s, p); }
  const fh = (h - 1.4) / floors; const strips = [];
  for (let i = 0; i < floors; i++) { const y = 1.0 + i * fh + fh * 0.3; const hp = new THREE.Path(); const x0 = -w / 2 + 0.6, x1 = w / 2 - 0.6;
    hp.moveTo(x0, y); hp.lineTo(x1, y); hp.lineTo(x1, y + fh * 0.42); hp.lineTo(x0, y + fh * 0.42); hp.lineTo(x0, y); s.holes.push(hp);
    const lp = glowPlane(x1 - x0 + 0.3, fh * 0.42 + 0.3, "#ffffff"); lp.position.set(0, y + fh * 0.21, -0.4); lp.userData.setGlow(0.03); g.add(lp); strips.push(lp); }
  g.add(extrude(s, hex, 0.5));
  g.userData.setFloor = (i, k, hex2 = C.cyan) => { const p = strips[i]; if (!p) return; p.material.color.set(hex2).multiplyScalar(0.03 + k * 1.4); };
  g.userData.floors = strips; g.userData.fh = fh; return g;
};

// ---------- the figure ("you", Lena, people): faceless jointed silhouette with volume ----------
// opts: pose "sit"|"stand", hair "bun"|"short"|"long", coat (lab coat flare), hex (ink by default; amber rim comes from light)
// returns group with .userData.pose(t, {lean, reach, lookUp, turn, breathe, walk, armUp}) ; all params 0..1-ish
export const figure = ({ pose = "stand", hair = "bun", coat = false, hex = C.ink, scale = 1, seed = 1 } = {}) => {
  const INK = new THREE.MeshBasicMaterial({ color: hex }); const flat = (shape) => new THREE.Mesh(new THREE.ShapeGeometry(shape, 16), INK);
  const root = new THREE.Group(); root.scale.setScalar(scale);
  const hip = new THREE.Group(); hip.position.y = pose === "sit" ? 0.56 : 0.98; root.add(hip);
  const torso = new THREE.Group(); hip.add(torso);
  { const b = new THREE.Shape(); b.moveTo(-0.16, -0.02); b.lineTo(0.2, -0.02); b.quadraticCurveTo(0.3, 0.4, 0.26, 0.7); b.quadraticCurveTo(0.2, 0.82, 0.04, 0.84); b.quadraticCurveTo(-0.18, 0.82, -0.22, 0.66); b.quadraticCurveTo(-0.3, 0.3, -0.16, -0.02);
    torso.add(flat(b));
    if (coat) { const c = new THREE.Shape(); c.moveTo(-0.2, 0.1); c.lineTo(0.22, 0.1); c.lineTo(0.3, -0.45); c.lineTo(-0.3, -0.45); torso.add(flat(c)); } }
  const legs = [];
  if (pose === "sit") { const l = new THREE.Shape(); l.moveTo(-0.14, 0.1); l.quadraticCurveTo(0.3, 0.12, 0.64, 0.06); l.lineTo(0.68, -0.52); l.lineTo(0.8, -0.56); l.lineTo(0.8, -0.6); l.lineTo(0.54, -0.6); l.lineTo(0.5, -0.1); l.quadraticCurveTo(0.2, -0.08, -0.12, -0.08);
    hip.add(flat(l)); }
  else for (let k = 0; k < 2; k++) { const lg = new THREE.Group(); lg.position.set(k ? 0.06 : -0.06, 0.02, k ? -0.01 : 0.01); hip.add(lg);
    const s = new THREE.Shape(); s.moveTo(-0.1, 0); s.lineTo(0.1, 0); s.lineTo(0.075, -0.9); s.lineTo(0.17, -0.94); s.lineTo(0.17, -0.98); s.lineTo(-0.07, -0.98); s.lineTo(-0.075, -0.9); s.lineTo(-0.1, 0); lg.add(flat(s)); legs.push(lg); }
  const headG = new THREE.Group(); headG.position.set(0.06, 0.88, 0); torso.add(headG);
  { headG.add(new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.12), INK));
    const head = new THREE.Mesh(new THREE.CircleGeometry(0.14, 32), INK); head.scale.set(0.92, 1.08, 1); head.position.set(0.02, 0.17, 0); headG.add(head);
    if (hair === "bun") { const bun = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), INK); bun.position.set(-0.12, 0.25, 0); headG.add(bun); }
    if (hair === "long") { const hs = new THREE.Shape(); hs.moveTo(-0.12, 0.3); hs.quadraticCurveTo(-0.24, 0.1, -0.2, -0.12); hs.lineTo(-0.06, -0.08); hs.lineTo(-0.02, 0.2); headG.add(flat(hs)); } }
  const arm = (side) => { const a = new THREE.Group(); a.position.set(0.04, 0.72, side * 0.01); torso.add(a); const f = new THREE.Group(); f.position.set(0.38, 0, 0); a.add(f);
    const u = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.13), INK); u.position.x = 0.18; a.add(u);
    const fo = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.11), INK); fo.position.x = 0.17; f.add(fo);
    const hd = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), INK); hd.position.x = 0.36; f.add(hd); return { a, f }; };
  const A = arm(1), B = arm(-1);
  const ph = seed * 1.3;
  root.userData = { torso, headG, arm: A.a, forearm: A.f, arm2: B.a, forearm2: B.f, legs, mat: INK,
    // hand position helper (local): use A.f children[1] world position for props (pencil, sheet)
    hand: A.f.children[1],
    pose: (t, p = {}) => { const { lean = 0, reach = 0, lookUp = 0, turn = 0, breathe = 1, walk = 0, armUp = 0, armDown = 0 } = p;
      const br = Math.sin(t * 2.1 + ph) * 0.012 * breathe;
      torso.rotation.z = (pose === "sit" ? -0.16 : -0.04) + 0.03 * Math.sin(t * 0.6 + ph) - 0.12 * lean; torso.scale.y = 1 + br;
      A.a.rotation.z = lerp(pose === "sit" ? -0.35 : -1.35, 0.18, reach) + armUp * 2.6 - armDown * 0.2; A.f.rotation.z = lerp(pose === "sit" ? -0.9 : 0.15, -0.2, reach) + armUp * 0.2;
      B.a.rotation.z = (pose === "sit" ? -0.5 : -1.5) + 0.05 * Math.sin(t * 0.9 + ph) + walk * 0.35 * Math.sin(t * 6); B.f.rotation.z = pose === "sit" ? -1.0 : 0.25;
      headG.rotation.z = -0.06 + 0.04 * Math.sin(t * 0.8 + 1 + ph) + 0.55 * lookUp; root.rotation.y = turn * Math.PI;
      legs.forEach((lg, k) => (lg.rotation.z = walk * 0.4 * Math.sin(t * 6 + k * Math.PI)));
      hip.position.y = (pose === "sit" ? 0.56 : 0.98) + walk * 0.02 * Math.abs(Math.sin(t * 6)); } };
  root.userData.pose(0); return root;
};

// ---------- the machine: a disc / eye / rings (never a robot or brain) ----------
// machineEye({R}) -> group with .userData.update(t, {open, glow}) ; open 0 closed lids, 1 open; glow 0..1
export const machineEye = ({ R = 19, A = 14.5, B = 7.5, mask = "#141f36", lidHex = "#18243d" } = {}) => {
  const eye = new THREE.Group();
  const almond = (a, b) => { const p = [], n = 64; for (let i = 0; i <= n; i++) { const x = -a + 2 * a * i / n; p.push(new THREE.Vector2(x, b * Math.pow(Math.max(0, 1 - (x / a) ** 2), 0.75))); }
    for (let i = n - 1; i > 0; i--) { const x = -a + 2 * a * i / n; p.push(new THREE.Vector2(x, -b * Math.pow(Math.max(0, 1 - (x / a) ** 2), 0.75))); } return p; };
  const ms = circleShape(R); ms.holes.push(new THREE.Path(almond(A, B).reverse())); eye.add(extrude(ms, mask, 0.4));
  const disc = (r, hex, z) => { const m = extrude(circleShape(r), hex, 0.12); m.position.z = z; eye.add(m); return m; };
  const sc = extrude(new THREE.Shape(almond(A + 0.6, B + 0.6)), "#d9dccf", 0.12); sc.position.z = -1.6; eye.add(sc);
  const s = A / 14.5;
  const irisBack = disc(6.6 * s, "#0b5466", -1.4);
  const irisRing = extrude(ringShape(5.7 * s, 6.6 * s), "#1aa9c8", 0.12); irisRing.position.z = -1.25; eye.add(irisRing);
  const ps = new THREE.Shape(), n = 22; ps.moveTo(5.4 * s, 0);
  for (let i = 0; i < n; i++) { const a1 = (i + 0.5) / n * Math.PI * 2, a2 = (i + 1) / n * Math.PI * 2; ps.lineTo(Math.cos(a1) * 2.6 * s, Math.sin(a1) * 2.6 * s); ps.lineTo(Math.cos(a2) * 5.4 * s, Math.sin(a2) * 5.4 * s); }
  const petals = extrude(ps, C.cyan, 0.12); petals.position.z = -1.1; eye.add(petals);
  disc(2.5 * s, "#05070c", -0.95); const glint = disc(0.75 * s, "#f4fbff", -0.8); glint.position.set(1.6 * s, 1.5 * s, -0.8);
  const irisMats = [irisBack, irisRing, petals].map((m) => m.material[0]); irisMats.forEach((m) => { m.emissive = m.color.clone(); m.emissiveIntensity = 0; });
  const slit = glowPlane(A * 2, 0.5, C.cyan); slit.position.z = -1.7; eye.add(slit);
  const lid = (dir) => { const pv = new THREE.Group(); pv.position.set(0, dir * B, -0.35); eye.add(pv); const W2 = A + 0.6;
    const m = extrude(polyShape([[-W2, -dir * (B - 0.06)], [W2, -dir * (B - 0.06)], [W2, dir * 0.6], [-W2, dir * 0.6]]), lidHex, 0.14); m.position.z = -0.07; pv.add(m); return pv; };
  const lt = lid(1), lb = lid(-1);
  eye.userData.update = (t, { open = 1, glow = 1, leak = 0 } = {}) => {
    lt.rotation.x = open * Math.PI * 0.62; lb.rotation.x = -open * Math.PI * 0.62;
    slit.userData.setGlow(3 * leak * (1 - open));
    irisMats.forEach((m, i) => (m.emissiveIntensity = glow * [0.9, 1.6, 2.4][i]));
    petals.rotation.z = t * 0.05; irisRing.rotation.z = -t * 0.02; };
  eye.userData.update(0, { open: 0, glow: 0 }); return eye;
};
// concentric machine rings that pulse inward while "thinking": rings({n, r}) -> group with update(t, {think, glow})
export const machineRings = ({ n = 5, r = 6, hex = C.cyan, w = 0.18 } = {}) => {
  const g = new THREE.Group(); const rs = [];
  for (let i = 0; i < n; i++) { const rr = r * (1 - i / (n + 1)); const m = extrude(ringShape(rr - w, rr), hex, 0.08, { emissive: 0.3, cast: false }); m.position.z = i * 0.25; g.add(m); rs.push(m); }
  g.userData.update = (t, { think = 1, glow = 1 } = {}) => rs.forEach((m, i) => { const ph = ((t * 0.6 * think - i / n) % 1 + 1) % 1;
    m.material[0].emissiveIntensity = (0.3 + 1.6 * Math.pow(1 - ph, 3)) * glow; m.rotation.z = t * 0.05 * (i % 2 ? -1 : 1); m.scale.setScalar(1 - 0.03 * Math.pow(1 - ph, 3) * think); });
  return g;
};

// ---------- the flipbook (the episode's carrier object) ----------
// flipbook({w, h, pages, drawPage(ctx, w, h, i)}) : spine on the LEFT edge at x=0, pages extend to +x, lies facing +z.
// update(t, {flip, spread, open}) : flip = continuous page index turned (0..pages); spread = how many pages are in flight at once (1 = one at a time, 6 = blur)
// Pages beyond `pages` wrap around (the book keeps cycling invisibly when spinning).
export const flipbook = ({ w = 4.2, h = 3, pages = 24, drawPage, cover = "#2c3f63", seed = 5, segs = 12 } = {}) => {
  const g = new THREE.Group(); const T = 0.012;
  const back = box(w, h, 0.08, cover); back.position.set(w / 2, 0, -0.06 - pages * T); g.add(back);
  const P = [];
  for (let i = 0; i < pages; i++) { const c = document.createElement("canvas"); c.width = 512; c.height = Math.round(512 * h / w); const ctx = c.getContext("2d");
    ctx.fillStyle = C.cream; ctx.fillRect(0, 0, c.width, c.height); if (drawPage) drawPage(ctx, c.width, c.height, i);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const geo = new THREE.PlaneGeometry(w, h, segs, 1); geo.translate(w / 2, 0, 0); geo.userData.base = geo.attributes.position.array.slice();
    const front = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, roughness: 0.92, side: THREE.FrontSide, bumpMap: bumpTex, bumpScale: 0.2 });
    const backM = new THREE.MeshStandardMaterial({ color: C.cream, map: paperTex, roughness: 0.92, side: THREE.BackSide });
    const pivot = new THREE.Group(); pivot.position.z = -i * T; g.add(pivot);
    const m1 = new THREE.Mesh(geo, front), m2 = new THREE.Mesh(geo, backM); m1.castShadow = m2.castShadow = true; m1.receiveShadow = m2.receiveShadow = true; pivot.add(m1, m2);
    P.push({ pivot, geo, ctx, tex, c }); }
  const bend = (p, ang, curl) => { const a = p.geo.attributes.position, b = p.geo.userData.base;
    for (let k = 0; k < a.count; k++) { const x = b[k * 3]; const u = x / w; const z = curl * Math.sin(u * Math.PI) * 0.5 * w * Math.sin(ang); a.array[k * 3] = x; a.array[k * 3 + 2] = z; }
    a.needsUpdate = true; p.geo.computeVertexNormals(); };
  g.userData = { pages: P, w, h,
    redrawPage: (i, fn) => { const p = P[((i % pages) + pages) % pages]; p.ctx.fillStyle = C.cream; p.ctx.fillRect(0, 0, p.c.width, p.c.height); fn(p.ctx, p.c.width, p.c.height); p.tex.needsUpdate = true; },
    update: (t, { flip = 0, spread = 1, open = 1 } = {}) => {
      const cyc = Math.floor(flip / pages), f = flip - cyc * pages;
      P.forEach((p, i) => { const k = clamp((f - i) / spread + 0.5, 0, 1); const e = sineInOut(k);
        // turned pages fall to the left stack; the page in flight lifts and curls
        const ang = -Math.PI * e * open; p.pivot.rotation.y = ang;
        p.pivot.position.z = e > 0.5 ? (i * T) : -i * T; bend(p, -ang, k > 0 && k < 1 ? 0.18 : 0.02); });
      g.rotation.z = 0.004 * Math.sin(t * 0.7); } };
  g.userData.update(0); return g;
};

// ---------- DOM overlays: stamp, tags, captions ----------
// each scene gets its own overlay layer (div) shown only while the scene is active
export const css = `
.layer{position:absolute;inset:0;pointer-events:none}
.stamp{position:absolute;left:96px;top:70px;font-family:"Instrument Serif",serif;color:${C.creamText};line-height:1;letter-spacing:-0.02em;white-space:nowrap}
.stamp .yr{display:block;overflow:hidden;padding-bottom:8px;font-size:108px}
.stamp .yr span{display:inline-block}
.stamp .lab{display:block;overflow:hidden;font-family:"Inter",sans-serif;font-size:22px;letter-spacing:0.32em;text-transform:uppercase;color:${C.label};margin-top:4px;padding-left:2px}
.stamp .lab span{display:inline-block}
.tag{position:absolute;font-family:"Inter",sans-serif;color:${C.amberSoft};font-size:22px;letter-spacing:0.04em;white-space:nowrap}
.tag .rule{position:absolute;left:-132px;top:14px;width:116px;height:1px;background:${C.amber};transform-origin:100% 50%}
.tag.cy{color:${C.cyanPale}} .tag.cy .rule{background:${C.cyan}}
.tag .t{display:block;overflow:hidden} .tag .t span{display:inline-block}
.tag .sub{display:block;overflow:hidden;color:${C.label};font-size:17px;letter-spacing:0.22em;text-transform:uppercase;margin-top:8px}
.tag .sub span{display:inline-block}
.src{position:absolute;right:96px;top:84px;max-width:720px;text-align:right;font-family:"Inter",sans-serif;font-size:19px;letter-spacing:0.06em;color:${C.label};overflow:hidden}
.src span{display:inline-block}
.src b{font-weight:400;color:${C.creamText};font-size:26px;letter-spacing:0.02em;display:block;margin-bottom:6px}
.title{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-family:"Instrument Serif",serif;color:${C.creamText};font-size:120px;line-height:1.04;letter-spacing:-0.01em}
.title span{display:inline-block}
.chapter{position:absolute;left:96px;bottom:150px;font-family:"Inter",sans-serif;font-size:20px;letter-spacing:0.5em;color:${C.amberSoft};overflow:hidden}
.chapter span{display:inline-block}
`;
const el = (parent, cls, html) => { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; parent.appendChild(d); return d; };
// stamp(layer, [{t, year, label}]) : the year rolls (digits slide up) on each key; first key wipes in.
// out: time the stamp leaves. Year text can be any short string ("MAY 2026", "1965").
export const stampDOM = (layer, keys, outAt = Infinity) => {
  const d = el(layer, "stamp", `<span class="yr"></span><span class="lab"></span>`); const yr = d.children[0], lab = d.children[1];
  keys.forEach((k, i) => { k.y = el(yr, "", ""); k.y.outerHTML; const s = document.createElement("span"); s.textContent = k.year; s.style.position = i ? "absolute" : "relative"; s.style.left = "0"; yr.style.position = "relative"; yr.appendChild(s); k.ys = s;
    const l = document.createElement("span"); l.textContent = k.label || ""; l.style.position = i ? "absolute" : "relative"; l.style.left = "2px"; lab.style.position = "relative"; lab.appendChild(l); k.ls = l; });
  [...yr.querySelectorAll("div")].forEach((x) => x.remove());
  return { el: d, update: (t) => { const out = expoOut(lin(outAt, outAt + 0.6, t));
    keys.forEach((k, i) => { const inK = expoOut(lin(k.t, k.t + 0.7, t)); const nxt = keys[i + 1]; const outK = nxt ? expoOut(lin(nxt.t, nxt.t + 0.7, t)) : out;
      k.ys.style.transform = `translateY(${(1 - inK) * 105 - outK * 105}%)`; k.ys.style.opacity = t < k.t - 0.01 ? 0 : 1;
      const li = expoOut(lin(k.t + 0.2, k.t + 0.9, t)); k.ls.style.transform = `translateY(${(1 - li) * 110 - outK * 110}%)`; k.ls.style.opacity = t < k.t ? 0 : 1; }); } };
};
// tag(layer, {title, sub, inAt, outAt, cyan}) : label with rule; place via .place(x,y) in screen px each frame (use project()).
export const tagDOM = (layer, { title, sub = "", inAt, outAt = Infinity, cyan = false }) => {
  const d = el(layer, "tag" + (cyan ? " cy" : ""), `<div class="rule"></div><span class="t"><span>${title}</span></span>` + (sub ? `<span class="sub"><span>${sub}</span></span>` : ""));
  const rule = d.querySelector(".rule"), spans = [...d.querySelectorAll(".t > span, .sub > span")];
  return { el: d, place: (x, y) => { d.style.left = `${x}px`; d.style.top = `${y}px`; },
    update: (t) => { const k = expoOut(lin(inAt, inAt + 0.8, t)), o = smooth(outAt, outAt + 0.5, t); d.style.visibility = t < inAt - 0.05 ? "hidden" : "visible";
      rule.style.transform = `scaleX(${k * (1 - o)})`; spans.forEach((s, i) => { const kk = expoOut(lin(inAt + 0.12 * (i + 1), inAt + 0.9 + 0.12 * (i + 1), t)); s.style.transform = `translateY(${(1 - kk) * 110 - o * 110}%)`; }); } };
};
// source/fact caption top-right: srcDOM(layer, {big, small, inAt, outAt})
export const srcDOM = (layer, { big = "", small = "", inAt, outAt = Infinity }) => {
  const d = el(layer, "src", (big ? `<b><span>${big}</span></b>` : "") + `<span>${small}</span>`); const spans = [...d.querySelectorAll("span")];
  return { el: d, update: (t) => { const o = smooth(outAt, outAt + 0.5, t); spans.forEach((s, i) => { const k = expoOut(lin(inAt + i * 0.15, inAt + 0.8 + i * 0.15, t)); s.style.transform = `translateY(${(1 - k) * 110}%)`; s.style.opacity = (k > 0 ? 1 : 0) * (1 - o); }); } };
};
// chapter word bottom-left (REPORT, TEST, BRAKE, RULES)
export const chapterDOM = (layer, { text, inAt, outAt = Infinity }) => { const d = el(layer, "chapter", `<span>${text}</span>`); const s = d.firstChild;
  return { el: d, update: (t) => { const k = expoOut(lin(inAt, inAt + 0.9, t)), o = smooth(outAt, outAt + 0.6, t); s.style.transform = `translateY(${(1 - k) * 110 - o * 110}%)`; s.style.letterSpacing = `${0.5 + 0.1 * smooth(inAt, outAt, t)}em`; } }; };
// big centred title (title card): words rise one by one
export const titleDOM = (layer, { text, inAt, outAt = Infinity, size = 120 }) => { const d = el(layer, "title", text.split(" ").map((w) => `<span style="overflow:hidden;padding-bottom:10px;margin:0 0.12em"><span>${w}</span></span>`).join(""));
  d.style.fontSize = size + "px"; const sp = [...d.querySelectorAll("span > span")];
  return { el: d, update: (t) => { const o = smooth(outAt, outAt + 0.6, t); sp.forEach((s, i) => { const k = expoOut(lin(inAt + i * 0.09, inAt + 0.9 + i * 0.09, t)); s.style.transform = `translateY(${(1 - k) * 110}%)`; s.style.opacity = 1 - o; });
    d.style.letterSpacing = `${-0.01 + 0.015 * smooth(inAt, outAt + 0.6, t)}em`; } }; };
// project a world point to screen px
const _v = new THREE.Vector3();
export const project = (vec, camera) => { _v.copy(vec).project(camera); return { x: (_v.x * 0.5 + 0.5) * W, y: (-_v.y * 0.5 + 0.5) * H, behind: _v.z > 1 }; };

// ---------- camera path with arcs + perpetual drift ----------
// keys: [{t, p:[x,y,z], l:[x,y,z], ease?:"inOut"|"smooth"|"sine"}] ; returns {p, l} Vector3s for time t.
// Every segment bulges sideways (arc), and a crooked-sine drift + endless slow push keep the camera alive.
export const camPath = (keys, t, { arc = 0.12, drift = 1, push = 0.6, seed = 0 } = {}) => {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i], b = keys[i + 1] || a; const raw = b.t > a.t ? lin(a.t, b.t, t) : 1;
  const e = b.ease || "inOut"; const kk = e === "smooth" ? raw * raw * (3 - 2 * raw) : e === "sine" ? sineInOut(raw) : e === "linear" ? raw : inOut(raw);
  const pa = V(...a.p), pb = V(...b.p), la = V(...a.l), lb = V(...b.l);
  const p = pa.clone().lerp(pb, kk), l = la.clone().lerp(lb, kk);
  const bulge = Math.sin(Math.PI * kk) * pa.distanceTo(pb) * arc * (b.arc ?? 1); p.x += bulge * (i % 2 ? -1 : 1); p.y += bulge * 0.5;
  const d = p.distanceTo(l) * 0.01 * drift;
  p.x += d * (Math.sin(t * 0.37 + seed) * 0.9 + Math.sin(t * 0.83 + 1.3 + seed) * 0.4);
  p.y += d * (Math.sin(t * 0.51 + 0.7 + seed) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
  const dir = l.clone().sub(p).normalize(); p.addScaledVector(dir, d * push * 3 * ((t - keys[0].t) / Math.max(1, keys.at(-1).t - keys[0].t)));
  l.x += d * Math.sin(t * 0.29 + 0.4 + seed) * 0.5; l.y += d * Math.sin(t * 0.43 + 1.9 + seed) * 0.35;
  return { p, l };
};
export const applyCam = (camera, { p, l }, roll = 0) => { camera.position.copy(p); camera.lookAt(l); if (roll) camera.rotateZ(roll); camera.updateMatrixWorld(); };
export const newCamera = (fov = 35) => new THREE.PerspectiveCamera(fov, W / H, 0.1, 600);

// ---------- carriers (shared framings so scene cuts rhyme) ----------
// PAGE: a cream page facing the camera, centred, filling ~86 % of the frame width.
// To end a scene on PAGE: put a page of size (16 x 9) at distance d = PAGE_DIST in front of the camera, centred, facing it.
export const PAGE = { w: 16, h: 9, dist: 16 / (2 * Math.tan((35 * Math.PI / 180) / 2) * (W / H)) / 0.86 };
// FILL: the frame is flooded with one light colour (camera inside a light/door). Use fillDOM to finish the flood.
export const fillDOM = (layer, hex) => { const d = el(layer, "", ""); Object.assign(d.style, { position: "absolute", inset: "0", background: hex, opacity: 0 });
  return { el: d, update: (k) => (d.style.opacity = clamp(k, 0, 1)) }; };

// ---------- runtime ----------
export const E = { THREE, rng, clamp, lin, smooth, lerp, expoOut, inOut, sineInOut, backOut, spring, antic, V, wob, C, PAL,
  at, end, section, paperMats, paperMat, extrude, rectShape, circleShape, ringShape, polyShape, roundRectShape, box, glowPlane, drawnCard, cutoutText,
  stage, lights, pointLight, popLayer, skylineShape, randomPick, city, tower, figure, machineEye, machineRings, flipbook,
  stampDOM, tagDOM, srcDOM, chapterDOM, titleDOM, project, camPath, applyCam, newCamera, PAGE, fillDOM, W, H };

export const start = async ({ timing, scenes, root }) => {
  TIMING = timing;
  await Promise.all([document.fonts.load('300px "Instrument Serif"'), document.fonts.load('22px "Inter"')]);
  makePaper(); E.paperTex = paperTex; E.bumpTex = bumpTex;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const canvas = document.getElementById("gl");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt); composer.setPixelRatio(1); composer.setSize(W, H);
  const pass = new RenderPass(new THREE.Scene(), newCamera()); composer.addPass(pass);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.4, 0.55, 0.92); composer.addPass(bloom);
  composer.addPass(new OutputPass()); composer.addPass(new SMAAPass(W, H));
  E.renderer = renderer;
  const overlay = document.getElementById("overlay");
  const live = new Map(); // id -> built scene
  const dispose = (id) => { const s = live.get(id); if (!s) return; s.scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { if (x.map && x.map !== paperTex) x.map.dispose(); x.dispose(); }); });
    s.layer.remove(); live.delete(id); };
  const get = (i) => { const def = scenes[i]; if (live.has(def.id)) return live.get(def.id);
    const layer = document.createElement("div"); layer.className = "layer"; overlay.appendChild(layer); E.layer = layer;
    const s = def.build(E, def); s.layer = layer; s.def = def; live.set(def.id, s);
    // keep memory bounded: drop scenes more than one away
    [...live.keys()].forEach((k) => { const j = scenes.findIndex((d) => d.id === k); if (Math.abs(j - i) > 1) dispose(k); });
    return s; };
  const gctx = document.getElementById("grain").getContext("2d"); const gimg = gctx.createImageData(480, 270);
  const drawGrain = (frame) => { let s = (frame * 2654435761) >>> 0;
    for (let i = 0; i < gimg.data.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const n = (s >>> 24) - 128; const v = n > 0 ? 255 : 0; gimg.data[i] = gimg.data[i + 1] = gimg.data[i + 2] = v; gimg.data[i + 3] = Math.abs(n) * 0.12; }
    gctx.putImageData(gimg, 0, 0); };
  const render = (t) => {
    let i = scenes.findIndex((d) => t >= d.from && t < d.to); if (i < 0) i = t < scenes[0].from ? 0 : scenes.length - 1;
    const s = get(i);
    live.forEach((x) => (x.layer.style.display = x === s ? "block" : "none"));
    s.update(t);
    const post = s.post || {}; bloom.strength = post.bloom ?? 0.4; renderer.toneMappingExposure = post.exposure ?? 1.15;
    pass.scene = s.scene; pass.camera = s.camera; composer.render();
    drawGrain(Math.round(t * 30));
  };
  const clock = { _t: 0, get t() { return this._t; }, set t(v) { this._t = v; render(v); } };
  const tl = gsap.timeline({ paused: true }); tl.fromTo(clock, { t: 0 }, { t: timing.duration, duration: timing.duration, ease: "none" }, 0);
  window.__timelines = window.__timelines || {}; window.__timelines["main"] = tl;
  // preview helpers: ?t=12.3 shows one frame; ?scene=hook restricts to one scene
  const q = new URLSearchParams(location.search); render(q.has("t") ? Number(q.get("t")) : 0);
  window.__render = render;
};
