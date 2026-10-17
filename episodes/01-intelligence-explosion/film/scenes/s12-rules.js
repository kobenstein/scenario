// s12 · RULES — "Fourth: turn promises into rules" … "Not yet."
// A civic paper square at dawn that warms to full gold. Carriers: tilted up in the dawn sky (from s11) → tilt down onto a scroll
// of promises rolling out along a long table → many tiny figures sign it, three amber seals land → "voluntary": the signed scroll
// lifts off untethered, drifts right, rolls itself up and lands on a stack of bills under the Capitol dome; a stamp hovers, never
// presses → truck right to a huge gate only giants can pass; its lintel folds down into the barrier of a small checkpoint anyone
// can pass → crane up: dawn rises fully, the city's windows warm to gold from left AND right → WOW: amber figures stream out of
// the streets and, seen from above, form "77%" → two halves (two shades) lean the same way like wheat → stillness; one figure
// steps forward; the camera pushes in until it stands centred at 40 % of frame height (→ s13).
export default {
  build(E, def) {
    const { THREE, C, V } = E;
    const { lin, smooth, clamp, lerp, spring, sineInOut, rng } = E;
    const S = "solutions";
    const A = (p, n = 1) => E.at(S, p, n);
    const T0 = def.from, T1 = def.to;
    // ---------- word anchors ----------
    const tFourth = A("Fourth turn promises"), tPromises = A("promises into"), tRulesW = A("rules", 2);
    const tSept = A("In September the biggest"), tSigned = A("signed a safety"), tWH = A("at the White House") + 0.2, tOutside = A("Outside auditors"),
      tInternal = A("internal monitoring"), tBoard = A("board oversight"), tStep = A("It's a step"), tVoluntary = A("voluntary with no"),
      tPenalties = A("penalties"), tRegulator = A("no regulator");
    const tBills = A("Bills in Congress"), tCongress = A("Congress would"), tAudits = A("add audits"), tTeeth = A("with teeth"), tNone = A("None has passed");
    const tCritics = A("Critics warn"), tGiants = A("giants who"), tFair = A("A fair worry"), tArgument = A("an argument for"), tNarrow = A("narrow and testable"), tTestable = A("testable");
    const tFight = A("And this isn't a fight"), tLeft = A("left and right"), tRight = A("and right");
    const tPoll = A("In a September poll"), tSeventy = A("seventy-seven"), tPercent = A("percent of Americans"), tChecked = A("safety is checked");
    const tOther = A("And in other polls"), tRep = A("most Republicans"), tDem = A("most Democrats"), tSay = A("say AI is"), tTooFast = A("moving too fast");
    const tGap = A("The gap"), tSupport = A("That support"), tNotOrg = A("not organized"), tNotYet = A("not yet");

    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const R = rng(1201);
    scene.background = new THREE.Color("#2b2350");
    scene.fog = new THREE.Fog("#9a6a80", 90, 360);
    const dummy = new THREE.Object3D();
    const fig = (o) => { const f = E.figure(o); f.userData.mat.side = THREE.DoubleSide; f.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return f; };
    const mesh = (geo, hex, o = {}) => { const m = new THREE.Mesh(geo, E.paperMat(hex, o)); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
    const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };
    const basic = (geo, hex, o = {}) => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: hex, fog: o.fog ?? true, transparent: !!o.opacity, opacity: o.opacity ?? 1, side: o.side ?? THREE.FrontSide, depthWrite: o.depthWrite ?? true }));
    const cloudShape = (w, h, r) => { const s = new THREE.Shape(); s.moveTo(-w, 0); let x = -w; while (x < w) { const rr = h * (0.45 + r() * 0.55); s.absarc(x + rr, 0, rr, Math.PI, 0, true); x += rr * 2; } s.lineTo(x, -0.3); s.lineTo(-w, -0.3); return s; };
    const puff = (w, h, r) => { const s = new THREE.Shape(); s.moveTo(-w, 0); let x = -w; while (x < w) { const rr = h * (0.45 + r() * 0.55); s.absarc(x + rr, 0, rr, Math.PI, 0, true); x += rr * 2; }
      while (x > -w) { const rr = Math.min(h * (0.25 + r() * 0.2), (x + w) / 2 + 0.01); s.absarc(x - rr, 0, rr, 0, -Math.PI, true); x -= rr * 2; } return s; };

    // ---------- camera keys first (the sky is laid out relative to the opening camera) ----------
    const P0 = [16, 3.4, 13];
    const upA = (p, a) => { const r = a * Math.PI / 180; return [p[0], p[1] + Math.sin(r) * 16, p[2] - Math.cos(r) * 16]; };
    const GLY = { x: 40, z: 22 }; // the square where "77%" forms
    // hero: front-centre of the crowd; steps forward on "not yet"
    const HERO0 = V(40.2, 0, 33.4), HERO1 = V(40.2, 0, 34.9);
    const FIG_H = 2.19, FIG_C = 1.095, D_END = FIG_H / (0.4 * 2 * Math.tan((35 * Math.PI / 180) / 2));
    const KEYS = [
      { t: T0, p: P0, l: upA(P0, 62) },
      { t: tRulesW + 0.5, p: [16, 3.0, 5.6], l: [16, 0.9, -3.6], ease: "inOut" },
      { t: tWH + 0.6, p: [15.4, 2.7, 4.4], l: [16, 0.95, -3.8], ease: "sine" },
      { t: tStep, p: [15.1, 2.5, 3.7], l: [16, 1.0, -3.8], ease: "sine" },
      { t: tVoluntary + 0.2, p: [15.2, 2.8, 5.0], l: [16, 1.6, -3.8], ease: "sine" },
      { t: tRegulator + 0.4, p: [27, 6.2, 14.5], l: [31, 4.2, -4], ease: "sine", arc: 0.2 },
      { t: tCongress + 0.2, p: [40.0, 3.1, 9.6], l: [40.3, 3.9, -6], ease: "sine", arc: 0.2 },
      { t: tCritics, p: [40.2, 2.9, 8.6], l: [40.3, 3.7, -6], ease: "sine" },
      { t: tGiants - 1.4, p: [64.5, 7.0, 25], l: [66, 5.2, -4], ease: "inOut", arc: 0.1 },
      { t: tArgument, p: [65.2, 6.4, 22.5], l: [66, 4.8, -4], ease: "sine" },
      { t: tTestable + 0.4, p: [65.4, 2.8, 9.0], l: [65.6, 1.2, -3], ease: "sine" },
      { t: tRight + 0.6, p: [40, 50, 92], l: [40, 4, 12], ease: "inOut", arc: 0.08 },
      { t: tPercent + 0.1, p: [40, 60, 47], l: [40, 0, 21.5], ease: "inOut", arc: 0.05 },
      { t: tOther - 0.2, p: [41, 55, 45], l: [40, 0, 21.8], ease: "sine" },
      { t: tSay + 0.2, p: [21, 9.5, 54], l: [40, 1.4, 22], ease: "inOut", arc: 0.1 },
      { t: tGap + 0.4, p: [25, 6.8, 49], l: [40, 1.4, 24], ease: "sine" },
      { t: tNotOrg, p: [HERO0.x + 2.4, 3.4, HERO0.z + 17], l: [HERO0.x, 1.3, HERO0.z - 2], ease: "sine" },
      { t: T1, p: [HERO1.x + 0.04, FIG_C, HERO1.z + D_END], l: [HERO1.x + 0.04, FIG_C, HERO1.z], ease: "inOut" },
    ];
    const camAt = (t) => E.camPath(KEYS, t, { arc: 0.08, drift: lerp(1, 0.15, smooth(tNotOrg, T1, t)), push: 0.2 * (1 - smooth(tNotOrg, T1, t)), seed: 23 });

    // ---------- sky dome: same gradient as s11, warming to full dawn ----------
    const skyU = { k: { value: 0.35 }, sunDir: { value: V(0, 0.05, -1).normalize() },
      z0: { value: new THREE.Color("#30264f") }, m0: { value: new THREE.Color("#8a5a86") }, h0: { value: new THREE.Color("#f2a679") },
      z1: { value: new THREE.Color("#55497e") }, m1: { value: new THREE.Color("#d98a8a") }, h1: { value: new THREE.Color("#ffd29c") }, sunCol: { value: new THREE.Color("#ffcf96") } };
    const sky = new THREE.Mesh(new THREE.SphereGeometry(450, 48, 32), new THREE.ShaderMaterial({ uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `uniform float k; uniform vec3 sunDir,z0,m0,h0,z1,m1,h1,sunCol; varying vec3 vD;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
        void main(){ vec3 d = normalize(vD); float e = d.y;
          vec3 Zc = mix(z0,z1,k), Mc = mix(m0,m1,k), Hc = mix(h0,h1,k);
          vec3 c = mix(Hc, Mc, smoothstep(-0.03, 0.16, e)); c = mix(c, Zc, smoothstep(0.16, 1.0, e));
          float s = max(dot(d, normalize(sunDir)), 0.0);
          c += sunCol * (pow(s, 40.0) * 0.5 + pow(s, 6.0) * 0.16);
          c *= 1.0 + (hash(floor(gl_FragCoord.xy / 2.0)) - 0.5) * 0.05;
          gl_FragColor = vec4(c, 1.0); }` }));
    sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
    // offset that maps s11's closing camera onto this opening camera, so sun and high clouds sit where s11 left them
    const OFF = V(P0[0] - 8.2, P0[1] - 6.4, P0[2] - 29.4);
    const sun = new THREE.Group(); scene.add(sun);
    const sunCore = basic(new THREE.CircleGeometry(7, 64), "#fff1d6", { fog: false }); sun.add(sunCore);
    [[9.5, "#ffd9a8", 0.55], [13, "#f7b98a", 0.32], [18, "#eb9e86", 0.18]].forEach(([r, h, o], i) => { const m = basic(new THREE.RingGeometry(r - (i ? 3.5 : 2.5), r, 64), h, { fog: false, opacity: o, depthWrite: false }); m.position.z = -0.5 - i * 0.2; sun.add(m); });
    const clouds = []; const CR = rng(5150);
    const cloudMat = (hex) => new THREE.MeshBasicMaterial({ color: hex, map: E.paperTex, fog: false, side: THREE.DoubleSide });
    [[-70, 22, -200, 22, 4, "#d48a8a", 0.5], [60, 30, -210, 26, 5, "#c98094", 0.35], [-10, 38, -215, 18, 3.6, "#b97795", 0.42], [120, 18, -190, 20, 4, "#e09a8c", 0.3], [-130, 30, -200, 24, 4.4, "#c27f92", 0.38]]
      .forEach(([x, y, z, w, h, hex, v]) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(cloudShape(w, h, R), 12), cloudMat(hex)); m.position.set(x + OFF.x, y, z); scene.add(m); clouds.push({ m, x0: x + OFF.x, y0: y, v, k: 0 }); });
    [[-18, 62, 6, 20, 5, "#e8a08e"], [22, 70, -12, 26, 6, "#d68e98"], [2, 56, 26, 16, 4, "#f0b394"], [-40, 74, -30, 22, 5, "#c88597"], [40, 60, 36, 18, 4.5, "#e7a796"], [-6, 80, -48, 30, 6, "#b9809a"], [30, 66, 60, 20, 5, "#f1b99a"], [-34, 58, 44, 16, 4, "#dc9a92"]]
      .forEach(([x, y, z, w, h, hex], i) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(puff(w, h, CR), 12), cloudMat(hex)); m.rotation.x = Math.PI / 2; m.rotation.z = (CR() - 0.5) * 0.6;
        m.position.set(x + OFF.x, y + OFF.y, z + OFF.z); scene.add(m); clouds.push({ m, x0: x + OFF.x, y0: y + OFF.y, v: 0.25 + 0.1 * (i % 3), k: 1 }); });
    const birdShape = new THREE.Shape(); birdShape.moveTo(-0.9, 0.25); birdShape.quadraticCurveTo(-0.4, 0.15, 0, -0.1); birdShape.quadraticCurveTo(0.4, 0.15, 0.9, 0.25); birdShape.quadraticCurveTo(0.4, 0.02, 0, -0.25); birdShape.quadraticCurveTo(-0.4, 0.02, -0.9, 0.25);
    const birds = new THREE.InstancedMesh(new THREE.ShapeGeometry(birdShape), new THREE.MeshBasicMaterial({ color: "#3a2740", side: THREE.DoubleSide, fog: false }), 6); birds.frustumCulled = false; scene.add(birds);
    const birdData = [...Array(6)].map((_, i) => ({ x: -30 + i * 9 + R() * 6, y: 16 + R() * 10, z: -110 - R() * 30, s: 1 + R() * 0.8, ph: R() * 6 }));

    // ---------- light ----------
    const hemi = new THREE.HemisphereLight("#ffd6bc", "#5a4064", 1.25); scene.add(hemi);
    const key = new THREE.DirectionalLight("#ffd3a0", 2.4); key.position.set(10, 42, -40); key.target.position.set(40, 0, 10);
    key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0006; key.shadow.normalBias = 0.04;
    Object.assign(key.shadow.camera, { left: -55, right: 55, top: 45, bottom: -45, near: 1, far: 220 }); scene.add(key, key.target);
    const fill = new THREE.DirectionalLight("#f0b0b8", 0.8); fill.position.set(40, 22, 110); scene.add(fill);

    // ---------- ground, plaza, city ----------
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(800, 500), new THREE.MeshStandardMaterial({ color: "#86627e", map: E.paperTex, bumpMap: E.bumpTex, bumpScale: 0.5, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(40, 0, -40); floor.receiveShadow = true; scene.add(floor);
    { const pl = E.extrude(E.roundRectShape(54, 34, 3), "#6e4c6a", 0.06); pl.rotation.x = -Math.PI / 2; pl.position.set(40, 0.0, 22); pl.castShadow = false; scene.add(pl);
      const inner = E.extrude(E.roundRectShape(50, 30, 2.4), "#7a5674", 0.06); inner.rotation.x = -Math.PI / 2; inner.position.set(40, 0.02, 22); inner.castShadow = false; scene.add(inner);
      const civic = E.extrude(E.roundRectShape(78, 30, 2), "#94707f", 0.05); civic.rotation.x = -Math.PI / 2; civic.position.set(41, 0.0, -8); civic.castShadow = false; scene.add(civic); }
    // far hills on the horizon
    [[-200, "#b98393", 2, 6, 0.04, 3], [-180, "#9c6c85", 1.2, 4, 0.07, 5]].forEach(([z, hex, h0, h1, f, sd]) => {
      const s = new THREE.Shape(); s.moveTo(-360, -1); for (let x = -360; x <= 440; x += 5) s.lineTo(x, h0 + (h1 - h0) * (0.5 + 0.5 * Math.sin(x * f + sd))); s.lineTo(440, -1);
      const m = E.extrude(s, hex, 0.3); m.position.z = z; m.castShadow = false; scene.add(m); });
    // city blocks: instanced paper boxes with window maps; windows warm to gold on "left and right"
    const winCanvas = (em) => { const c = document.createElement("canvas"); c.width = 64; c.height = 128; const g = c.getContext("2d"); g.fillStyle = em ? "#000" : "#e8dccf"; g.fillRect(0, 0, 64, 128);
      for (let y = 8; y < 124; y += 12) for (let x = 6; x < 60; x += 12) { const lit = em ? ((x * 7 + y * 13) % 5 !== 0) : true; g.fillStyle = em ? (lit ? "#fff" : "#000") : "#5e4258"; g.fillRect(x, y, 6, 7); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = em ? THREE.NoColorSpace : THREE.SRGBColorSpace; return t; };
    const sideMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: winCanvas(false), emissiveMap: winCanvas(true), emissive: new THREE.Color("#ffb35c"), emissiveIntensity: 0.15, roughness: 0.9 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: E.paperTex, roughness: 0.95 });
    const bld = []; { const cols = ["#b7899a", "#a17790", "#c49aa0", "#8e6a86", "#d2aaa6", "#9c7a98"];
      for (let gx = -6; gx <= 12; gx++) for (let gz = -5; gz <= 7; gz++) { const cx = gx * 14, cz = gz * 14;
        const inPlaza = cx > 6 && cx < 74 && cz > -2 && cz < 44; const inCivic = cx > -4 && cx < 86 && cz > -34 && cz <= 0; const avenue = cx > 22 && cx < 58 && cz >= 44 && cz < 90;
        if (inPlaza || inCivic || avenue) continue;
        const n = R() < 0.5 ? 1 : 2; for (let k = 0; k < n; k++) { const w = n === 1 ? 6.5 + R() * 2.5 : 3.6 + R() * 1.2, d = 6 + R() * 2.5; const far = Math.hypot(cx - 40, cz - 20);
          const h = 4 + R() * 6 + Math.min(14, far * 0.08) * R(); bld.push({ x: cx + (n === 1 ? 0 : (k ? 2.4 : -2.4)), z: cz, w, h, d, c: cols[Math.floor(R() * cols.length)] }); } } }
    const city = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), [sideMat, sideMat, roofMat, roofMat, sideMat, sideMat], bld.length); city.castShadow = city.receiveShadow = true;
    { const c = new THREE.Color(); bld.forEach((b, i) => { dummy.position.set(b.x, 0, b.z); dummy.rotation.set(0, 0, 0); dummy.scale.set(b.w, b.h, b.d); dummy.updateMatrix(); city.setMatrixAt(i, dummy.matrix); city.setColorAt(i, c.set(b.c)); }); }
    scene.add(city);
    // trees along the square (instanced flat paper)
    const treeShape = (() => { const s = new THREE.Shape(); s.moveTo(-0.08, 0); s.lineTo(0.08, 0); s.lineTo(0.08, 0.5); s.quadraticCurveTo(0.7, 0.6, 0.6, 1.3); s.quadraticCurveTo(0.5, 2.2, 0, 2.6); s.quadraticCurveTo(-0.5, 2.2, -0.6, 1.3); s.quadraticCurveTo(-0.7, 0.6, -0.08, 0.5); s.lineTo(-0.08, 0); return s; })();
    { const pts = []; for (let x = 15; x <= 65; x += 5) if (Math.abs(x - 40) > 8) pts.push([x, 39.8]); for (let z = 19.4; z <= 35; z += 5.2) pts.push([12.4, z], [67.6, z]);
      const tr = new THREE.InstancedMesh(new THREE.ExtrudeGeometry(treeShape, { depth: 0.12, bevelEnabled: false, curveSegments: 8 }), E.paperMat("#4d3350"), pts.length); tr.castShadow = true;
      pts.forEach(([x, z], i) => { const s = 1.0 + R() * 0.4; dummy.position.set(x, 0, z); dummy.rotation.set(0, 0, 0); dummy.scale.set(s, s, s); dummy.updateMatrix(); tr.setMatrixAt(i, dummy.matrix); }); scene.add(tr); }
    // street lamps around the square (amber points)
    const lampPts = []; for (let x = 17.5; x <= 62.5; x += 9) if (Math.abs(x - 40) > 6) lampPts.push([x, 38.6]); for (let z = 12; z <= 34; z += 7.3) lampPts.push([13.6, z], [66.4, z]);
    const lampPosts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 2.6, 0.1).translate(0, 1.3, 0), E.paperMat("#3a2740"), lampPts.length);
    const lampHeads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.amber) }), lampPts.length);
    lampPts.forEach(([x, z], i) => { dummy.position.set(x, 0, z); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); lampPosts.setMatrixAt(i, dummy.matrix); dummy.position.y = 2.7; dummy.updateMatrix(); lampHeads.setMatrixAt(i, dummy.matrix); });
    scene.add(lampPosts, lampHeads);

    // ---------- A: the pact — White House facade, long table, the scroll ----------
    const WH = V(16, 0, -15);
    { const s = E.rectShape(22, 6.4, 0, 3.2); for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) { const x = -9.4 + c * 2.7; if (Math.abs(x) < 3.2) continue; const y = 1.2 + r * 2.7; const h = new THREE.Path(); h.moveTo(x - 0.5, y); h.lineTo(x + 0.5, y); h.lineTo(x + 0.5, y + 1.5); h.lineTo(x - 0.5, y + 1.5); h.lineTo(x - 0.5, y); s.holes.push(h); }
      const front = E.extrude(s, "#ead9c8", 0.3); front.position.copy(WH); scene.add(front);
      const body = mesh(new THREE.BoxGeometry(22, 6.4, 6), "#d7c0b0"); body.position.set(WH.x, 3.2, WH.z - 3.1); scene.add(body);
      const glow = E.glowPlane(21, 6, C.amber); glow.position.set(WH.x, 3.2, WH.z + 0.05); glow.userData.setGlow(0.5); scene.add(glow); glow.renderOrder = -1;
      const bal = mesh(new THREE.BoxGeometry(22.6, 0.5, 0.6), "#f3e6d6"); bal.position.set(WH.x, 6.65, WH.z + 0.2); scene.add(bal);
      // portico: columns, entablature, pediment
      for (let i = 0; i < 6; i++) { const col = mesh(new THREE.CylinderGeometry(0.22, 0.25, 5.2, 14), "#f6ece0"); col.position.set(WH.x - 2.9 + i * 1.16, 2.6, WH.z + 2.2); scene.add(col); }
      const ent = mesh(new THREE.BoxGeometry(7.4, 0.7, 2.8), "#f3e6d6"); ent.position.set(WH.x, 5.55, WH.z + 1.2); scene.add(ent);
      const ped = E.extrude(E.polyShape([[-3.9, 0], [3.9, 0], [0, 1.6]]), "#f3e6d6", 0.3); ped.position.set(WH.x, 5.9, WH.z + 2.3); scene.add(ped);
      const door = E.glowPlane(1.2, 2.2, C.amber); door.position.set(WH.x, 1.1, WH.z + 0.34); door.userData.setGlow(0.9); scene.add(door);
      const steps = mesh(new THREE.BoxGeometry(7.6, 0.3, 3.4), "#e2cfbf"); steps.position.set(WH.x, 0.15, WH.z + 1.9); scene.add(steps); }
    const TABLE = { x: 16, z0: -0.8, z1: -6.6, y: 0.86 };
    { const tb = mesh(new THREE.BoxGeometry(1.7, 0.08, TABLE.z0 - TABLE.z1 + 0.6), "#e6cdb5"); tb.position.set(TABLE.x, TABLE.y - 0.04, (TABLE.z0 + TABLE.z1) / 2); scene.add(tb);
      const cloth = mesh(new THREE.BoxGeometry(1.74, 0.62, TABLE.z0 - TABLE.z1 + 0.64), "#5a3a58"); cloth.position.set(TABLE.x, TABLE.y - 0.4, (TABLE.z0 + TABLE.z1) / 2); scene.add(cloth); }
    // the scroll: a sheet that unrolls from the near end, a roll at its far edge
    const SH = { w: 1.25, L: 5.4 };
    const sheetCan = document.createElement("canvas"); sheetCan.width = 256; sheetCan.height = 1104; const sg = sheetCan.getContext("2d");
    const sheetTex = new THREE.CanvasTexture(sheetCan); sheetTex.colorSpace = THREE.SRGBColorSpace; sheetTex.anisotropy = 8;
    const signers = [[-1, -1.3], [1, -1.75], [-1, -2.35], [1, -2.8], [-1, -3.4], [1, -3.85], [-1, -4.45], [1, -4.9]];
    const sigR = rng(77); const sigs = signers.map(([side, z]) => { const pts = []; let x = 0, y = 0; for (let k = 0; k < 14; k++) { x += 5 + sigR() * 6; y = (sigR() - 0.5) * 22; pts.push([x, y]); } return { side, z, pts }; });
    const drawSheet = (sigK) => { sg.fillStyle = "#f3e9d8"; sg.fillRect(0, 0, 256, 1104); sg.fillStyle = "rgba(90,58,88,0.28)";
      for (let y = 40; y < 1104 - 40; y += 18) { const w = 150 + ((y * 37) % 40); sg.fillRect(30, y, (y % 90 === 40 ? 120 : w), 3); }
      sg.fillStyle = "rgba(90,58,88,0.5)"; sg.fillRect(56, 18, 144, 6);
      sg.strokeStyle = "#3a2740"; sg.lineWidth = 3; sg.lineCap = "round";
      sigs.forEach((s, i) => { const k = sigK[i]; if (k <= 0) return; const cy = 1104 * (1 - (-s.z - 0.0) / SH.L); const cx = s.side < 0 ? 40 : 130; sg.beginPath();
        const n = Math.max(1, Math.floor(k * s.pts.length)); sg.moveTo(cx, cy); for (let j = 0; j < n; j++) sg.lineTo(cx + s.pts[j][0], cy + s.pts[j][1] * 0.6); sg.stroke(); });
      sheetTex.needsUpdate = true; };
    drawSheet(sigs.map(() => 0));
    const scroll = new THREE.Group(); scroll.position.set(TABLE.x, TABLE.y + 0.012, TABLE.z0 - 0.2); scene.add(scroll);
    const sheetGeo = new THREE.PlaneGeometry(SH.w, SH.L, 1, 36); sheetGeo.translate(0, SH.L / 2, 0); sheetGeo.rotateX(-Math.PI / 2); const sheetBase = sheetGeo.attributes.position.array.slice();
    const sheet = new THREE.Mesh(sheetGeo, new THREE.MeshStandardMaterial({ map: sheetTex, roughness: 0.9, side: THREE.DoubleSide, bumpMap: E.bumpTex, bumpScale: 0.2 })); sheet.castShadow = sheet.receiveShadow = true; scroll.add(sheet);
    const roll = mesh(new THREE.CylinderGeometry(0.17, 0.17, SH.w + 0.08, 20), "#efe3cf"); roll.rotation.z = Math.PI / 2; scroll.add(roll);
    const rollEnds = [-1, 1].map((s) => { const e = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 20), "#c9a27a"); e.rotation.z = Math.PI / 2; e.position.x = s * (SH.w / 2 + 0.06); roll.add(e); return e; });
    // three amber seals land on the pact (auditors · monitoring · oversight)
    const sealMat = E.paperMat(C.amber, { emissive: 0.35 });
    const seals = [tOutside, tInternal, tBoard].map((ts, i) => { const g = new THREE.Group(); g.position.set(-0.22 + i * 0.22, 0.03, -SH.L + 0.55); scroll.add(g);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.05, 20), sealMat); m.castShadow = true; g.add(m); const r = mesh(new THREE.TorusGeometry(0.08, 0.012, 6, 20), "#ffd9a8", { cast: false }); r.rotation.x = Math.PI / 2; r.position.y = 0.03; g.add(r); return { g, ts }; });
    // signers (lab heads): profile silhouettes on both sides of the long table, leaning in with pens
    const signFigs = signers.map(([side, z], i) => { const f = fig({ pose: "stand", hair: ["short", "bun", "long", "short", "bun", "short", "long", "bun"][i], coat: i % 3 === 1, seed: 61 + i });
      f.position.set(TABLE.x - side * 1.12, 0, TABLE.z0 - 0.2 + z); f.scale.set(side < 0 ? 1 : -1, 1, 1); f.scale.x *= 0.95; f.scale.y = f.scale.z = 0.95; scene.add(f);
      const pen = mesh(new THREE.BoxGeometry(0.03, 0.26, 0.03), "#3a2740", { cast: false }); pen.position.set(0.36, -0.08, 0.02); f.userData.forearm.add(pen); return { f, side, ph: R() * 6, t0: tSigned - 0.35 + i * 0.32 }; });

    // ---------- B: bills under the Capitol dome; a stamp hovers ----------
    const CAP = V(40.5, 0, -17); const capG = new THREE.Group(); const CS = 0.56; capG.scale.setScalar(CS); capG.position.copy(CAP).multiplyScalar(1 - CS); capG.add(capG);
    { const wing = E.extrude(E.polyShape([[-18, 0], [18, 0], [18, 5.5], [11, 5.5], [11, 6.6], [-11, 6.6], [-11, 5.5], [-18, 5.5]]), "#e9d4c4", 0.4); wing.position.copy(CAP); capG.add(wing);
      const ws = []; for (let i = 0; i < 18; i++) { const x = -16.5 + i * 1.95; if (Math.abs(x) < 4.5) continue; ws.push(x); }
      ws.forEach((x) => { const g = E.glowPlane(0.7, 1.4, C.amber); g.position.set(CAP.x + x, 2.6, CAP.z + 0.42); g.userData.setGlow(0.55); capG.add(g); });
      const drum = E.extrude(E.rectShape(10.4, 4.2, 0, 2.1), "#f0dfcf", 0.4); drum.position.set(CAP.x, 6.6, CAP.z - 0.4); capG.add(drum);
      for (let i = 0; i < 9; i++) { const c = mesh(new THREE.BoxGeometry(0.34, 3.6, 0.3), "#fbf1e4"); c.position.set(CAP.x - 4.6 + i * 1.15, 8.6, CAP.z + 0.15); capG.add(c); }
      const dome = new THREE.Shape(); dome.moveTo(-5.4, 0); dome.absellipse(0, 0, 5.4, 6.4, Math.PI, 0, true); dome.lineTo(-5.4, 0);
      const dm = E.extrude(dome, "#f6e8d8", 0.5); dm.position.set(CAP.x, 10.8, CAP.z - 0.6); capG.add(dm);
      [[0, 1.3, 0.8], [0, 2.1, 0.5]].forEach(([x, w, h], i) => { const r = mesh(new THREE.BoxGeometry(w, 0.3, 0.6), "#e3cdb9"); r.position.set(CAP.x, 10.9 + i * 0.3, CAP.z - 0.2); capG.add(r); });
      const lan = E.extrude(E.rectShape(1.3, 2.0, 0, 1.0), "#f6e8d8", 0.4); lan.position.set(CAP.x, 17.0, CAP.z - 0.5); capG.add(lan);
      const tip = E.extrude(E.circleShape(0.7), "#f6e8d8", 0.4); tip.position.set(CAP.x, 19.1, CAP.z - 0.5); capG.add(tip);
      const stat = mesh(new THREE.BoxGeometry(0.22, 1.2, 0.22), "#e3cdb9"); stat.position.set(CAP.x, 20.3, CAP.z - 0.3); capG.add(stat);
      const stepsB = mesh(new THREE.BoxGeometry(12, 0.6, 4), "#e0c9b8"); stepsB.position.set(CAP.x, 0.3, CAP.z + 2.2); capG.add(stepsB); }
    const DESK = V(40.3, 0, -2.8);
    { const d = mesh(new THREE.BoxGeometry(5.6, 0.82, 2.0), "#5a3a58"); d.position.set(DESK.x, 0.41, DESK.z); scene.add(d);
      const top = mesh(new THREE.BoxGeometry(5.8, 0.07, 2.15), "#e6cdb5"); top.position.set(DESK.x, 0.86, DESK.z); scene.add(top);
      const lamp = E.glowPlane(0.5, 0.12, C.amberSoft); lamp.position.set(DESK.x - 2.3, 1.6, DESK.z + 0.3); lamp.userData.setGlow(1.4); scene.add(lamp);
      const lampArm = mesh(new THREE.BoxGeometry(0.05, 0.75, 0.05), "#3a2740"); lampArm.position.set(DESK.x - 2.5, 1.25, DESK.z); scene.add(lampArm);
      const shade = E.extrude(E.polyShape([[-0.3, 0], [0.3, 0], [0.14, 0.3], [-0.14, 0.3]]), "#3a2740", 0.3); shade.position.set(DESK.x - 2.3, 1.6, DESK.z + 0.05); scene.add(shade); }
    const deskLight = E.pointLight("#ffc890", 6, 10); deskLight.position.set(DESK.x - 1.5, 2.2, DESK.z + 1.5); scene.add(deskLight);
    const STACKS = [[-1.65, 28], [-0.55, 44], [0.55, 36], [1.65, 52]];
    const NS = STACKS.reduce((a, s) => a + s[1], 0);
    const bills = new THREE.InstancedMesh(new THREE.BoxGeometry(0.92, 0.014, 1.25), E.paperMat("#ffffff"), NS); bills.castShadow = bills.receiveShadow = true;
    { let k = 0; const c = new THREE.Color(); STACKS.forEach(([x, n], si) => { for (let i = 0; i < n; i++) { dummy.position.set(DESK.x + x + (R() - 0.5) * 0.06, 0.9 + i * 0.015, DESK.z + (R() - 0.5) * 0.06); dummy.rotation.set(0, (R() - 0.5) * 0.12, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); bills.setMatrixAt(k, dummy.matrix); bills.setColorAt(k, c.set(i % 7 === 0 ? "#e8d3bd" : "#f3e9d8")); k++; } }); }
    scene.add(bills);
    const stackTop = (si) => 0.9 + STACKS[si][1] * 0.015;
    const stamp = new THREE.Group(); scene.add(stamp);
    { const pad = mesh(new THREE.BoxGeometry(0.8, 0.07, 0.56), "#2a1a2a"); stamp.add(pad); const blk = mesh(new THREE.BoxGeometry(0.86, 0.26, 0.62), "#9a6a5a"); blk.position.y = 0.16; stamp.add(blk);
      const neck = mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.55, 12), "#b07a62"); neck.position.y = 0.55; stamp.add(neck); const knob = mesh(new THREE.SphereGeometry(0.19, 16, 12), "#c98f6e"); knob.position.y = 0.9; stamp.add(knob); }
    const STAMP_X = DESK.x + STACKS[2][0];

    // ---------- C: a huge gate only giants can pass → a small checkpoint anyone can pass ----------
    const GATE = V(66, 0, -3);
    const pylon = (s) => { const p = new THREE.Group(); p.position.set(GATE.x + s * 6.3, 0, GATE.z); scene.add(p); const m = mesh(new THREE.BoxGeometry(2.4, 16, 1.6), "#4d3350"); m.position.set(0, 8, 0); p.add(m);
      const cap = mesh(new THREE.BoxGeometry(2.9, 0.6, 2.0), "#3a2740"); cap.position.y = 16.2; p.add(cap); return p; };
    const pyL = pylon(-1), pyR = pylon(1);
    const stripeTex = (() => { const c = document.createElement("canvas"); c.width = 256; c.height = 16; const g = c.getContext("2d"); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#ffb35c" : "#f3e9d8"; g.fillRect(i * 32, 0, 32, 16); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const lintelMat = new THREE.MeshStandardMaterial({ map: stripeTex, color: "#4d3350", roughness: 0.9 });
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), lintelMat); lintel.castShadow = lintel.receiveShadow = true; scene.add(lintel);
    const sillP = new THREE.Group(); sillP.position.set(GATE.x, 0, GATE.z + 0.8); scene.add(sillP); const sill = mesh(new THREE.BoxGeometry(10.2, 3.4, 1.6), "#5a3a58"); sill.position.set(0, 1.7, -0.8); sillP.add(sill);
    const booth = new THREE.Group(); booth.position.set(GATE.x - 1.4, 0, GATE.z + 0.4); scene.add(booth);
    { const b = mesh(new THREE.BoxGeometry(1.1, 1.5, 1.0), "#efe3cf"); b.position.y = 0.75; booth.add(b); const roofB = mesh(new THREE.BoxGeometry(1.4, 0.14, 1.3), "#5a3a58"); roofB.position.y = 1.57; booth.add(roofB);
      const win = E.glowPlane(0.6, 0.4, C.amber); win.position.set(0, 1.0, 0.51); win.userData.setGlow(1.0); booth.add(win); }
    const boothLamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: C.amber })); boothLamp.position.set(0, 1.78, 0); booth.add(boothLamp);
    const ARM_PIV = V(GATE.x - 0.8, 1.05, GATE.z + 0.4);
    const giants = [{ x: 62.6, z0: 12, z1: -14, t0: tCritics + 1.4, t1: tCompliance() }, { x: 69.4, z0: 13, z1: -13, t0: tCritics + 2.2, t1: tFair + 0.4 }].map((g, i) => {
      const f = fig({ pose: "stand", hair: "short", hex: "#2e2036", seed: 91 + i }); f.scale.set(i ? -4.3 : 4.3, 4.3, 4.3); scene.add(f); return { ...g, f }; });
    function tCompliance() { return A("compliance"); }
    const smalls = [[63.2, 2.2, 1], [64.4, 1.6, 1], [65.6, 2.5, -1], [67.4, 1.8, -1], [68.6, 2.6, 1]].map(([x, z, dir], i) => { const f = fig({ pose: "stand", hex: C.amber, hair: ["bun", "short", "long", "short", "bun"][i], seed: 101 + i });
      f.scale.set(dir * 0.95, 0.95, 0.95); f.position.set(x, 0, z); scene.add(f); return { f, x, z, dir, ph: R() * 6 }; });
    const gateLight = E.pointLight("#ffc890", 0, 9); gateLight.position.set(GATE.x - 1.4, 2.4, GATE.z + 2); scene.add(gateLight);

    // ---------- the crowd: instanced amber silhouettes that form "77%" from above ----------
    const crowdShape = (() => { const sh = []; const b = new THREE.Shape(); b.moveTo(-0.16, 0); b.lineTo(-0.05, 0); b.lineTo(-0.02, 0.8); b.lineTo(0.02, 0.8); b.lineTo(0.05, 0); b.lineTo(0.16, 0); b.lineTo(0.15, 0.95);
      b.quadraticCurveTo(0.3, 1.3, 0.26, 1.7); b.quadraticCurveTo(0.2, 1.84, 0.04, 1.86); b.quadraticCurveTo(-0.18, 1.84, -0.22, 1.68); b.quadraticCurveTo(-0.3, 1.3, -0.15, 0.95); b.lineTo(-0.16, 0); sh.push(b);
      const h = new THREE.Shape(); h.absellipse(0.03, 2.04, 0.13, 0.15, 0, Math.PI * 2, false); sh.push(h); return sh; })();
    const glyph = (() => { const c = document.createElement("canvas"); c.width = 760; c.height = 300; const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, 760, 300);
      g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineWidth = 12; g.lineJoin = "round"; g.font = '400 270px "Instrument Serif"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("77%", 380, 160); g.strokeText("77%", 380, 160);
      const d = g.getImageData(0, 0, 760, 300).data; const pts = []; const step = 9.5, sc = 47 / 760; const r = rng(31);
      for (let y = 4; y < 300; y += step * 0.866) for (let x = 4 + ((Math.round(y / (step * 0.866)) % 2) ? step / 2 : 0); x < 760; x += step) { const i = (Math.round(y) * 760 + Math.round(x)) * 4; if (d[i] > 128)
        pts.push([GLY.x + (x - 380) * sc + (r() - 0.5) * 0.16, GLY.z + (y - 150) * sc + (r() - 0.5) * 0.16]); } return pts; })();
    const NC = glyph.length;
    const crowd = new THREE.InstancedMesh(new THREE.ShapeGeometry(crowdShape, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }), NC); crowd.frustumCulled = false; scene.add(crowd);
    // entries: streets into the square from the front avenue and both sides
    const entries = [[[21, 92], [21, 40]], [[35, 92], [35, 40]], [[49, 92], [49, 40]], [[59, 92], [59, 40]], [[-44, 7], [12, 7]], [[-44, 21], [12, 21]], [[-44, 35], [12, 35]], [[126, 7], [68, 7]], [[126, 21], [68, 21]], [[126, 35], [68, 35]]];
    const CR2 = rng(41); const people = glyph.map(([x, z], i) => { let best = null, bd = 1e9; entries.forEach((e, k) => { const dd = Math.hypot(e[1][0] - x, e[1][1] - z) + CR2() * 14; if (dd < bd) { bd = dd; best = e; } });
      const back = CR2() * 30; const dir = V(best[0][0] - best[1][0], 0, best[0][1] - best[1][1]).normalize(); const lane = (CR2() - 0.5) * 3.2; const perp = V(-dir.z, 0, dir.x);
      const p0 = V(best[1][0], 0, best[1][1]).addScaledVector(dir, 6 + back).addScaledVector(perp, lane); const p1 = V(best[1][0], 0, best[1][1]).addScaledVector(perp, lane); const p2 = V(x, 0, z);
      const L1 = p0.distanceTo(p1), L2 = p1.distanceTo(p2); const half = x < GLY.x ? 0 : 1;
      return { p0, p1, p2, L1, L2, t0: tFight + 1.6 + CR2() * 1.2, dur: 2.0 + CR2() * 0.5, s: 0.8 + CR2() * 0.12, ph: CR2() * 6, half, x, z }; });
    const crowdCol = new THREE.Color(); const cA = new THREE.Color(C.amber), cHalf = [new THREE.Color("#ff9c45"), new THREE.Color("#f2b276")];
    // the hero ("you"): one amber figure at the crowd's front edge
    const hero = fig({ pose: "stand", hex: "#ffa047", seed: 7 }); hero.position.copy(HERO0); scene.add(hero);
    const heroGlow = E.pointLight("#ffc27a", 0, 7); scene.add(heroGlow);

    // ---------- DOM ----------
    const chapter = E.chapterDOM(E.layer, { text: "RULES", inAt: tFourth, outAt: tSept + 1.8 });
    const stamp2026 = E.stampDOM(E.layer, [{ t: tSept + 0.1, year: "2026", label: "White House · Sept" }, { t: tCongress, year: "2026", label: "Congress" }], tCritics - 0.3);
    const src1 = E.srcDOM(E.layer, { big: "Joint Commitment on Frontier Responsibilities", small: "White House, Sept 2026", inAt: tWH, outAt: tVoluntary + 1.6 });
    const src2 = E.srcDOM(E.layer, { big: "Congress: audit &amp; reporting bills", small: "none passed", inAt: tCongress + 0.1, outAt: tCritics - 0.2 });
    const src3 = E.srcDOM(E.layer, { big: "77% slow down or stop", small: "Quinnipiac, Sept 2026", inAt: tPercent, outAt: tOther + 2.0 });
    const doms = [chapter, stamp2026, src1, src2, src3];
    [src1, src2, src3].forEach((d) => (d.el.style.textShadow = "0 1px 10px rgba(40,22,48,0.85), 0 0 2px rgba(40,22,48,0.6)"));

    // ---------- update ----------
    const qRoll = new THREE.Quaternion(), zAx = V(0, 0, 1);
    let lastSig = -1;
    const update = (t) => {
      const cam = camAt(t); E.applyCam(camera, cam, 0.004 * Math.sin(t * 0.31)); sky.position.copy(camera.position);
      // dawn rises fully on "this isn't a fight between left and right"
      const dawn = smooth(tFight - 0.3, tRight + 0.8, t); const k = 0.35 + 0.1 * smooth(T0, tFight, t) + 0.55 * dawn; skyU.k.value = k;
      sun.position.set(OFF.x, 13.2 + OFF.y + 4 * smooth(T0, tFight, t) + 14 * dawn, -230 + OFF.z); sun.lookAt(camera.position);
      skyU.sunDir.value.copy(sun.position).sub(camera.position).normalize(); sunCore.material.color.set("#fff1d6").multiplyScalar(1.55 + 0.2 * dawn + 0.05 * Math.sin(t * 1.7));
      clouds.forEach((c, i) => { c.m.position.x = c.x0 + (t - 540) * c.v * (c.k ? 0.35 : 0.6); c.m.position.y = c.y0 + 0.3 * Math.sin(t * 0.3 + i); });
      birdData.forEach((b, i) => { dummy.position.set(((b.x + (t - 600) * 1.7 + 90) % 180) - 50, b.y + Math.sin(t * 0.7 + b.ph) * 0.8, b.z); dummy.rotation.set(0, 0, 0); dummy.scale.set(b.s, b.s * (0.55 + 0.45 * Math.sin(t * 7 + b.ph)), b.s); dummy.updateMatrix(); birds.setMatrixAt(i, dummy.matrix); }); birds.instanceMatrix.needsUpdate = true;
      key.color.set("#ffd3a0").lerp(new THREE.Color("#ffc46e"), dawn); key.intensity = 2.4 + 0.8 * dawn + 0.05 * Math.sin(t * 1.3); hemi.intensity = 1.25 + 0.35 * dawn;
      // windows warm to gold, sweeping in from the left and from the right at once
      sideMat.emissive.set("#e9a46a").lerp(new THREE.Color("#ffbf5a"), dawn); sideMat.emissiveIntensity = 0.12 + 0.95 * dawn + 0.03 * Math.sin(t * 2.1);

      // --- A: scroll unrolls, signatures, seals ---
      const unroll = sineInOut(lin(tPromises - 0.3, tRulesW + 0.4, t));
      const lift = smooth(tVoluntary - 0.15, tVoluntary + 1.1, t); const travel = sineInOut(lin(tVoluntary + 0.2, tBills + 0.5, t)); const reroll = smooth(tPenalties + 0.2, tBills + 0.2, t);
      const kVis = Math.max(0.0001, unroll * (1 - 0.82 * reroll));
      sheet.scale.z = kVis; sheetTex.repeat.set(1, kVis); sheetTex.offset.set(0, 0); roll.position.set(0, 0.17, -SH.L * kVis); roll.rotation.x = -SH.L * kVis / 0.17;
      const rr = 0.17 + 0.06 * (1 - kVis); roll.scale.set(rr / 0.17, 1, rr / 0.17);
      seals.forEach((s) => { const d = spring(lin(s.ts - 0.1, s.ts + 0.4, t)); s.g.visible = t > s.ts - 0.12; s.g.position.y = 0.03 + (1 - d) * 0.9; s.g.scale.setScalar(0.4 + 0.6 * d);
        s.g.position.z = -SH.L * 0.88 * kVis + 0.25; });
      // the pact floats up, untethered, ripples, drifts right and lands on a stack of bills
      const start = V(TABLE.x, TABLE.y + 0.012, TABLE.z0 - 0.2), land = V(DESK.x + STACKS[1][0] + 0.0, stackTop(1) + 0.02, DESK.z + 0.75);
      const mid = V(28, 6.0, -4.5); const u = travel; const pos = start.clone().multiplyScalar((1 - u) * (1 - u)).addScaledVector(mid, 2 * u * (1 - u)).addScaledVector(land, u * u);
      pos.y += lift * 1.4 * (1 - u) + Math.sin(t * 1.9) * 0.15 * lift * (1 - u);
      scroll.position.copy(pos); scroll.rotation.set(lift * (0.25 * Math.sin(t * 1.3)) * (1 - u), lift * (-0.35 * u + 0.1 * Math.sin(t * 0.9)) * (1 - u), lift * 0.18 * Math.sin(t * 1.1) * (1 - u));
      // ripple through the sheet while airborne
      { const a = sheetGeo.attributes.position; const amp = 0.22 * lift * (1 - smooth(0.85, 1, u)); for (let i = 0; i < a.count; i++) { const z = sheetBase[i * 3 + 2]; a.array[i * 3 + 1] = sheetBase[i * 3 + 1] + amp * Math.sin(z * 1.6 + t * 4.2) * (-z / SH.L); }
        a.needsUpdate = true; sheetGeo.computeVertexNormals(); }
      const sigK = signFigs.map((s) => clamp((t - s.t0 - 0.25) / 0.9, 0, 1)); const sigSum = sigK.reduce((a, b) => a + b, 0); if (Math.abs(sigSum - lastSig) > 1e-4) { drawSheet(sigK); lastSig = sigSum; }
      signFigs.forEach((s, i) => { const come = smooth(s.t0 - 0.6, s.t0, t); const write = clamp((t - s.t0) / 1.3, 0, 1); const writing = write > 0 && write < 1 ? 1 : 0; const looking = smooth(tVoluntary, tVoluntary + 0.6, t);
        s.f.userData.pose(t, { lean: 0.15 + 0.4 * come * (1 - looking), reach: 0.3 + 0.18 * come + 0.05 * writing * Math.sin(t * 14 + s.ph) + 0.25 * looking, lookUp: 0.45 * looking, armUp: 0.25 * looking * (i % 2) }); });

      // --- B: stamp hovers, dips on "None has passed" but never presses ---
      const dip = t > tNone - 0.25 ? Math.sin(Math.PI * clamp((t - tNone + 0.25) / 1.0, 0, 1)) : 0; const ant = smooth(tNone - 0.5, tNone - 0.25, t) * (1 - smooth(tNone - 0.25, tNone, t));
      stamp.position.set(STAMP_X, stackTop(2) + 1.15 + 0.08 * Math.sin(t * 1.4) + 0.18 * ant - 0.92 * dip, DESK.z); stamp.rotation.set(0.04 * Math.sin(t * 0.9), 0.1 * Math.sin(t * 0.5), 0.03 * Math.sin(t * 1.2));

      // --- C: giants pass the huge gate; the gate folds into a small checkpoint ---
      giants.forEach((g, i) => { const k = lin(g.t0, g.t1, t); const z = lerp(g.z0, g.z1, sineInOut(k)); const over = Math.exp(-Math.pow((z - (GATE.z + 0.0)) / 1.6, 2));
        g.f.position.set(g.x, 3.4 * over, z); g.f.userData.pose(t, { walk: k > 0 && k < 1 ? 1 : 0, lean: 0.1, lookUp: -0.1 }); g.f.visible = t < tTestable + 3; });
      const fold = smooth(tArgument - 0.2, tArgument + 1.2, t); const foldP = smooth(tArgument - 0.4, tArgument + 0.9, t);
      pyL.rotation.z = foldP * Math.PI / 2; pyR.rotation.z = -foldP * Math.PI / 2; sillP.rotation.x = smooth(tArgument - 0.3, tArgument + 0.6, t) * Math.PI / 2;
      const ls = { len: lerp(13.6, 2.4, fold), h: lerp(1.9, 0.12, fold), d: lerp(1.8, 0.12, fold), y: lerp(15.4, 1.05, fold) };
      const armUp = smooth(tTestable - 0.1, tTestable + 0.5, t) * (1 - smooth(tTestable + 2.4, tTestable + 3.0, t)); const aAng = armUp * 1.25;
      const ax = lerp(GATE.x, ARM_PIV.x + Math.cos(aAng) * ls.len / 2, fold), ay = lerp(ls.y, ARM_PIV.y + Math.sin(aAng) * ls.len / 2, fold);
      lintel.position.set(ax, ay, lerp(GATE.z, ARM_PIV.z, fold)); lintel.scale.set(ls.len, ls.h, ls.d); lintel.rotation.set(0, 0, aAng * fold);
      stripeTex.repeat.set(lerp(4, 1, fold), 1); lintelMat.color.set("#4d3350").lerp(new THREE.Color("#ffffff"), fold);
      const bUp = spring(lin(tArgument + 0.6, tArgument + 1.5, t)); booth.rotation.x = -Math.PI / 2 * (1 - bUp); booth.visible = t > tArgument + 0.55;
      boothLamp.material.color.set(C.amber).multiplyScalar(0.6 + 1.2 * armUp + 0.1 * Math.sin(t * 5)); gateLight.intensity = 5 * bUp;
      smalls.forEach((s, i) => { let x = s.x, z = s.z; let walk = 0;
        if (i === 1) { const k = lin(tTestable + 0.1, tTestable + 2.2, t); x = lerp(s.x, GATE.x + 0.3, smooth(0, 0.3, k)); z = lerp(s.z, GATE.z - 3.5, smooth(0.15, 1, k)); walk = k > 0 && k < 1 ? 1 : 0; }
        if (i === 3) { const k = lin(tTestable + 1.2, tTestable + 3.2, t); x = lerp(s.x, GATE.x + 0.6, smooth(0, 0.3, k)); z = lerp(s.z, GATE.z - 3.0, smooth(0.15, 1, k)); walk = k > 0 && k < 1 ? 1 : 0; }
        s.f.position.set(x, 0, z); s.f.visible = t < tFight + 1.6; s.f.userData.pose(t, { lookUp: 0.5 * (1 - fold) * (i % 2 ? 1 : 0.6), walk, reach: i === 2 ? 0.4 * (1 - fold) : 0.05 }); });

      // --- the crowd ---
      const dimC = 1 - 0.5 * smooth(tNotOrg, tNotYet + 0.6, t); const half = smooth(tOther, tRep + 0.4, t); const leanK = smooth(tSay - 0.5, tSay + 0.5, t) * (1 - smooth(tGap - 0.2, tGap + 0.6, t)); const still = smooth(tGap - 0.2, tGap + 0.6, t);
      qRoll.identity();
      for (let i = 0; i < NC; i++) { const p = people[i]; const k = clamp((t - p.t0) / p.dur, 0, 1); const e = k < 1 ? sineInOut(k) : 1; const s = e * (p.L1 + p.L2);
        if (k <= 0) { dummy.scale.setScalar(0.0001); } else { if (s < p.L1) dummy.position.lerpVectors(p.p0, p.p1, s / p.L1); else dummy.position.lerpVectors(p.p1, p.p2, (s - p.L1) / Math.max(1e-4, p.L2)); dummy.scale.setScalar(p.s); }
        const walking = k > 0 && k < 1 ? 1 : 0; dummy.position.y = walking * 0.06 * Math.abs(Math.sin(t * 9 + p.ph));
        const lean = -leanK * (0.2 + 0.14 * Math.sin(t * 2.3 - p.x * 0.16)) + (1 - still) * 0.025 * Math.sin(t * 1.3 + p.ph) + walking * 0.08 * Math.sin(t * 9 + p.ph);
        qRoll.setFromAxisAngle(zAx, lean); dummy.quaternion.copy(camera.quaternion).multiply(qRoll); dummy.updateMatrix(); crowd.setMatrixAt(i, dummy.matrix);
        crowdCol.copy(cA).lerp(cHalf[p.half], half).multiplyScalar((1 + 0.08 * Math.sin(t * 1.7 + p.ph) * (1 - still)) * dimC); crowd.setColorAt(i, crowdCol); }
      crowd.instanceMatrix.needsUpdate = true; crowd.instanceColor.needsUpdate = true; crowd.visible = t > tFight + 1.5;
      // hero: billboards like the crowd until it steps forward on "not yet"
      const stepK = smooth(tNotYet - 0.05, tNotYet + 0.85, t); hero.position.lerpVectors(HERO0, HERO1, stepK); hero.visible = t > tFight + 3.2;
      hero.quaternion.copy(camera.quaternion); hero.userData.pose(t, { walk: stepK > 0 && stepK < 1 ? 1 : 0, lookUp: 0.12 + 0.1 * smooth(tNotYet + 0.6, T1, t), lean: -0.05 });
      heroGlow.position.set(hero.position.x + 0.6, 2.2, hero.position.z + 1.6); heroGlow.intensity = 3 * smooth(tNotOrg, tNotYet + 0.5, t);

      doms.forEach((d) => d.update(t));
      post.bloom = 0.42 + 0.18 * dawn + 0.12 * smooth(tPoll, tPercent, t) * (1 - smooth(tGap, tNotYet, t));
      post.exposure = 1.08 + 0.06 * dawn;
    };
    const post = { bloom: 0.42, exposure: 1.08 };
    return { scene, camera, post, update };
  },
};
